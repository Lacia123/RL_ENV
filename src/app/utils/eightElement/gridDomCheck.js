/**
 * gridDomCheck.js
 *
 * 使用 Playwright 对 grid 布局渲染结果做 DOM 检测（内容缺失检测）。
 * 复用 renderAndEvaluate.js 的浏览器模式：launch → setViewportSize → setContent → evaluate。
 *
 * 检测范围（内容缺失）：
 * 1. 某个内容没有显示出来（元素尺寸为 0 / display:none / visibility:hidden / 完全在裁剪容器之外）
 * 2. 某个内容有一部分超出了容器（被裁切）；「...」省略号截断（ellipsis / line-clamp）是允许的，不算缺失
 * 3. grid:item 及以内出现预期之外的滚动（内容超出容器出现滚动条；文档级滚动不参与判定）
 * 4. 传入的文本内容丢失：psuip 中出现的文本片段在渲染结果中找不到
 *    （不做声明数量对比——卡片变体可能有意不渲染某些插槽，只对比"传入了的内容是否还在"）
 */
import { chromium } from 'playwright-chromium';
import fs from 'fs';
import path from 'path';

/**
 * 从 psuip 中提取文本片段及出现次数（作为"传入的内容"基准）
 * 处理：去标签、去 markdown 语法符号（**、*、`、#、~~、链接 [文字](url)、列表符号等）
 * 按行切分并去空白归一化，返回 { 归一化文本: 出现次数 }，仅保留长度 ≥ 2 的文本
 *
 * 同时记录次数：同一内容传入多次（如两个相同的 <metric_value>68%</metric_value>）
 * 渲染只出一个时，靠内容匹配查不出来，必须结合次数对比。
 */
function extractTextTokens(psuip) {
  const counts = {};
  const text = String(psuip || '').replace(/<[^>]*>/g, ' '); // 去掉所有标签
  text.split(/\n/).forEach((line) => {
    const cleaned = line
      .replace(/```/g, ' ')
      .replace(/~~/g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/`/g, '')
      .replace(/#{1,6}\s*/g, '')
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // 链接 [文字](url) → 文字
      .replace(/^\s*[!>+\-]\s*/g, '') // 列表 / 引用符号
      .trim();
    const normalized = cleaned.replace(/\s+/g, '');
    if (normalized.length >= 2) {
      counts[normalized] = (counts[normalized] || 0) + 1;
    }
  });
  return counts;
}

/**
 * 统计文本中某子串的出现次数（非重叠）
 */
function countOccurrences(text, token) {
  let count = 0;
  let idx = 0;
  while ((idx = text.indexOf(token, idx)) !== -1) {
    count++;
    idx += token.length;
  }
  return count;
}

/**
 * 对渲染后的 HTML 执行 grid 内容缺失检测
 * @param {string} htmlContent - 渲染后的 HTML
 * @param {{width: number, height: number, psuip?: string, takeScreenshot?: boolean, outputDir?: string, outputPrefix?: string}} options
 *        - width/height: 视口尺寸（px，与渲染视口一致）
 *        - psuip: 裸 psuip（用于源码声明数量 vs 实际渲染数量的对比检测）
 *        - takeScreenshot: 是否截图（供人工核对判定结果），默认 false
 *        - outputDir/outputPrefix: 截图保存目录与文件前缀
 * @returns {Promise<Object>} 检测结果 { elementCount, violations, slotCounts?, screenshotPath? }
 */
export async function measureGridDom(htmlContent, { width, height, psuip, takeScreenshot = false, outputDir = 'output', outputPrefix = 'grid-check' }) {
  let browser = null;
  let page = null;

  try {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    page = await browser.newPage();
    await page.setViewportSize({ width, height });
    await page.setContent(htmlContent);

    const result = await page.evaluate(({ viewportWidth, viewportHeight }) => {
      const EPS = 1; // 容差（px）：避免字体渲染小数误差误报

      // 归一化环境边距：浏览器默认 body margin(8px) 会让文档 scroll 尺寸虚高，
      // 导致"文档滚动"误报（grid 本身完整可见）
      document.documentElement.style.margin = '0';
      document.body.style.margin = '0';

      // 判定某个元素是否被「...」省略号截断（允许的缺失形态）
      const isEllipsisTruncated = (d) => {
        // 横向省略：text-overflow: ellipsis + nowrap，内容超出被省略号截断
        if (d.textOverflow === 'ellipsis' && d.whiteSpace === 'nowrap' && d.scrollWidth > d.clientWidth + EPS) {
          return true;
        }
        // 纵向省略：-webkit-box（line-clamp），内容超出被省略号截断
        if (d.display === '-webkit-box' && d.scrollHeight > d.clientHeight + EPS) {
          return true;
        }
        return false;
      };

      // 元素是否具备裁切能力（overflow 非 visible）
      const isClipping = (cs) =>
        ['hidden', 'scroll', 'auto', 'clip'].includes(cs.overflowX) ||
        ['hidden', 'scroll', 'auto', 'clip'].includes(cs.overflowY);

      // 找最近的裁切祖先（包含溢出内容的容器）
      const nearestClipper = (el) => {
        let p = el.parentElement;
        while (p && p !== document.body) {
          if (isClipping(getComputedStyle(p))) return p;
          p = p.parentElement;
        }
        return null;
      };

      const violations = [];
      const elements = Array.from(document.querySelectorAll('body *'));

      elements.forEach((el, index) => {
        const cs = getComputedStyle(el);
        const rect = el.getBoundingClientRect();

        // 直接文本内容（仅叶子文本节点）
        const text = Array.from(el.childNodes)
          .filter(n => n.nodeType === Node.TEXT_NODE)
          .map(n => n.textContent)
          .join('')
          .trim();

        // 内容元素：有文本的叶子 / 图片 / 音视频
        const isContentEl = text.length > 0 || ['img', 'video', 'audio'].includes(el.tagName.toLowerCase());
        if (!isContentEl) return;

        const d = {
          index,
          tag: el.tagName.toLowerCase(),
          cls: (el.className || '').toString().slice(0, 40),
          rect: {
            left: rect.left, top: rect.top,
            right: rect.right, bottom: rect.bottom,
            width: rect.width, height: rect.height
          },
          clientWidth: el.clientWidth, clientHeight: el.clientHeight,
          scrollWidth: el.scrollWidth, scrollHeight: el.scrollHeight,
          overflowX: cs.overflowX, overflowY: cs.overflowY,
          textOverflow: cs.textOverflow, whiteSpace: cs.whiteSpace,
          display: cs.display, visibility: cs.visibility,
          text: text.slice(0, 30)
        };

        // ── 判定 1：内容没有显示出来 ──
        if (d.rect.width <= 0.5 || d.rect.height <= 0.5 || d.visibility === 'hidden' || d.display === 'none') {
          violations.push({
            type: 'missing',
            target: `${d.tag}.${d.cls}`,
            detail: `内容未显示（尺寸 ${Math.round(d.rect.width)}×${Math.round(d.rect.height)}，display=${d.display}，visibility=${d.visibility}）文本「${d.text}」`
          });
          return;
        }

        // ── 判定 2：内容有一部分超出容器（省略号截断允许）──
        const clipper = nearestClipper(el);
        if (clipper) {
          const cRect = clipper.getBoundingClientRect();
          const partiallyOutside =
            d.rect.right > cRect.right + EPS || d.rect.bottom > cRect.bottom + EPS ||
            d.rect.left < cRect.left - EPS || d.rect.top < cRect.top - EPS;
          const fullyOutside =
            d.rect.bottom <= cRect.top + EPS || d.rect.top >= cRect.bottom - EPS ||
            d.rect.right <= cRect.left + EPS || d.rect.left >= cRect.right - EPS;

          if (partiallyOutside && !isEllipsisTruncated(d)) {
            violations.push({
              type: 'clipped',
              target: `${d.tag}.${d.cls}`,
              detail: `内容超出容器被裁切（元素 ${Math.round(d.rect.width)}×${Math.round(d.rect.height)}，容器 ${Math.round(cRect.width)}×${Math.round(cRect.height)}）文本「${d.text}」`
            });
          } else if (fullyOutside && !isEllipsisTruncated(d)) {
            violations.push({
              type: 'missing',
              target: `${d.tag}.${d.cls}`,
              detail: `内容完全位于容器之外（被裁切不可见）文本「${d.text}」`
            });
          }
        }

        // ── 判定 3：预期之外的滚动（grid:item 及以内出现滚动条）──
        // 只检测元素自身滚动（scroll > client 且 overflow auto/scroll），
        // 文档级滚动（body/视口）不参与判定
        if (d.scrollHeight > d.clientHeight + EPS && (d.overflowY === 'auto' || d.overflowY === 'scroll')) {
          violations.push({
            type: 'scroll',
            target: `${d.tag}.${d.cls}`,
            detail: `内容超出出现滚动（可见 ${d.clientHeight}px，内容 ${d.scrollHeight}px）`
          });
        }
      });

      // 渲染结果的全部可见文本（供"传入内容是否还在"对比）
      const renderText = document.body.innerText;

      return {
        elementCount: elements.length,
        violations,
        renderText
      };
    }, { viewportWidth: width, viewportHeight: height });

    // 服务端：传入的文本内容（含出现次数）vs 渲染结果文本对比
    // 不做声明数量对比（变体可能有意不渲染某些插槽），只查"传入了的内容是否还在"：
    // 内容找不到（渲染 0 次）→ 丢失；同一内容传入多次但渲染次数更少 → 丢失
    // ⚠️ 渲染文本为空字符串也必须参与对比（内容全丢时 renderText 为 ""，不能跳过）
    const violations = [...result.violations];
    if (psuip && typeof result.renderText === 'string') {
      const normalizedRenderText = String(result.renderText).replace(/\s+/g, '');
      const tokenCounts = extractTextTokens(psuip);
      Object.entries(tokenCounts).forEach(([token, srcCount]) => {
        const renderCount = countOccurrences(normalizedRenderText, token);
        if (srcCount > renderCount) {
          violations.push({
            type: 'missing',
            target: 'content',
            detail: `传入的文本内容丢失：「${token}」psuip 中出现 ${srcCount} 次，渲染结果中仅 ${renderCount} 次`
          });
        }
      });
    }

    // 可选：截图（test 模式）——无头浏览器用户看不见，保存图片供人工核对判定结果
    let screenshotPath = null;
    if (takeScreenshot) {
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      // 文件名加随机后缀：批量/并发校验时多个请求可能落在同一毫秒，
      // 仅用时间戳会互相覆盖，导致截图错乱
      const timestamp = Date.now();
      const rand = Math.random().toString(36).slice(2, 8);
      screenshotPath = path.join(outputDir, `${outputPrefix}-${timestamp}-${rand}.png`);
      const screenshotBuffer = await page.screenshot({ fullPage: true, type: 'png' });
      fs.writeFileSync(screenshotPath, screenshotBuffer);
      console.log(`grid 检测截图已保存至: ${screenshotPath}`);
    }

    return {
      elementCount: result.elementCount,
      violations,
      screenshotPath
    };
  } finally {
    try {
      if (page) await page.close();
    } catch (err) {
      console.error('关闭 Playwright page 失败:', err.message);
    }
    try {
      if (browser) await browser.close();
    } catch (err) {
      console.error('关闭 Playwright browser 失败:', err.message);
    }
  }
}
