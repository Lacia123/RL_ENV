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
  // ⚠️ 先剥离 Topology 知识图谱块（[Topology|...] + @@@ fenced JSON）：
  // 图谱数据渲染为特殊组件（G6 绘制到 canvas/svg），DOM 文本与传入 JSON 无法对齐；
  // 图谱是否渲染成功由 DOM 侧容器可见性检测兜底，只要渲染出来即认为正确
  const text = String(psuip || '')
    .replace(/\[Topology[^\]]*\](?:[\s\S]*?@@@[\s\S]*?@@@)?/g, ' ')
    // ⚠️ 处理 [table:xxx] 表格：只剥离标签本身与分隔行（|----|、|:---:|），
    // 数据行的单元格文本保留并与渲染后的 td 文本对齐（| 是 markdown 语法符号，
    // 渲染后不存在）。表格渲染是否正常由 DOM 检测兜底：内容不可见
    // （如非法变体被原样输出为 HTML <title>/<table> 标签）会报内容缺失
    .replace(/\[table:[^\]]*\]/g, ' ')
    .replace(/^\s*\|[\s|:\-]+\|\s*$/gm, ' ')
    .replace(/\s*\|\s*/g, ' ')
    // ⚠️ 再剥离 LaTeX 公式段（$...$ / $$...$$ / \(...\) / \[...\]）：
    // KaTeX 渲染文本与 LaTeX 源码差异巨大（如 $\dfrac{1}{x-2}$ → 字形 "1 x − 2"），
    // 无法做文本对比；公式是否渲染由 DOM 侧 .katex 容器可见性检测兜底
    .replace(/\$\$[\s\S]*?\$\$|\$[^$\n]*?\$|\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/g, ' ')
    .replace(/<[^>]*>/g, ' ') // 去掉所有标签
    // ⚠️ 解码 HTML 实体（单次遍历，与浏览器一致）：
    // 渲染后 DOM 文本里 &amp; → &、&gt; → > 等，不解码会导致 token 匹配失败误报
    // （如 "During Q&amp;A" 渲染为 "During Q&A"）。单次解码避免 &amp;gt; 被双重解码
    .replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, name) => {
      const ENTITY_MAP = { amp: '&', gt: '>', lt: '<', quot: '"', nbsp: ' ', apos: "'" };
      return ENTITY_MAP[name.toLowerCase()] || match;
    });
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

        // ⚠️ 跳过 KaTeX 公式内部元素：annotation（隐藏的 LaTeX 源码，display:none）
        //    与符号微定位偏移（mn/mo/mi 相对定位矩形偏移）是 KaTeX 正常排版，
        //    不属于内容缺失；.katex 容器自身仍参与检测（公式未渲染/尺寸 0 时报缺失）。
        //    .katex-error（KaTeX 解析失败的红色错误提示）也跳过：错误提示可见即说明
        //    渲染端已暴露问题，且其文本与 LaTeX 源码无法对齐
        const isKatexInner = el.closest('.katex') && !el.classList.contains('katex');
        const isKatexError = el.classList.contains('katex-error') || !!el.closest('.katex-error');
        if (isKatexInner || isKatexError) return;

        // ── 判定 3：预期之外的滚动（grid:item 及以内出现滚动条）──
        // ⚠️ 必须在内容元素过滤之前执行：grid:item 等容器没有直接文本、不是 img，
        //    会被 isContentEl 提前 return，导致「grid:item 自身滚动」成为检测盲区
        //    （实测：组件 min-height 超过格子高度时 item 出现滚动，却判为 valid）。
        //    对所有元素检查自身滚动，仅排除文档级（html/body），
        //    overflow visible 的不算（内容自然溢出/叠出由其他判定覆盖）。
        if (el.tagName !== 'HTML' && el.tagName !== 'BODY') {
          if (el.scrollHeight > el.clientHeight + EPS && (cs.overflowY === 'auto' || cs.overflowY === 'scroll')) {
            violations.push({
              type: 'scroll',
              target: `${el.tagName.toLowerCase()}.${(el.className || '').toString().slice(0, 40)}`,
              detail: `内容超出出现滚动（可见 ${el.clientHeight}px，内容 ${el.scrollHeight}px）`
            });
          }
        }

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

          // 裁切祖先自身是省略号容器（line-clamp / ellipsis）时，超出属于允许的截断
          const ccs = getComputedStyle(clipper);
          const clipperIsEllipsis =
            (ccs.textOverflow === 'ellipsis' && ccs.whiteSpace === 'nowrap' && clipper.scrollWidth > clipper.clientWidth + EPS) ||
            (ccs.display === '-webkit-box' && clipper.scrollHeight > clipper.clientHeight + EPS);

          if (partiallyOutside && !isEllipsisTruncated(d) && !clipperIsEllipsis) {
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

        // ── 判定 3（滚动）已在元素循环开头对所有元素执行，此处不再重复 ──
      });

      // 渲染结果的全部可见文本（供"传入内容是否还在"对比）
      // ⚠️ 不能用 innerText 直接取：KaTeX 公式渲染字形与 LaTeX 源码无法对齐，
      //    且 innerText 受 text-transform 影响。改为遍历文本节点拼接，
      //    跳过 .katex 公式内部（公式渲染由 .katex 容器 DOM 检测兜底）
      const renderText = (() => {
        const parts = [];
        const walk = (node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            parts.push(node.textContent);
            return;
          }
          if (node.nodeType === Node.ELEMENT_NODE) {
            // 跳过 KaTeX 公式整体（成功渲染 .katex）与解析失败的错误提示（.katex-error）：
            // 公式字形/错误文本与 LaTeX 源码无法对齐，统一不参与文本对比
            if (node.classList && (node.classList.contains('katex') || node.classList.contains('katex-error'))) return;
            node.childNodes.forEach(walk);
          }
        };
        (document.body || document).childNodes.forEach(walk);
        return parts.join('');
      })();

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
    // ⚠️ 匹配必须大小写不敏感：渲染端存在 text-transform: uppercase 等样式
    //    （如 targetStatCard 的 subtitle/caption），innerText 返回变换后的文本，
    //    大小写敏感匹配会误报「内容丢失」。token 提取/计数保持原文大小写
    //    （避免 "AI" 与 "ai" 两个不同 token 被合并计数产生新的误报）。
    const violations = [...result.violations];
    if (psuip && typeof result.renderText === 'string') {
      const normalizedRenderText = String(result.renderText).replace(/\s+/g, '').toLowerCase();
      const tokenCounts = extractTextTokens(psuip);
      Object.entries(tokenCounts).forEach(([token, srcCount]) => {
        const renderCount = countOccurrences(normalizedRenderText, token.toLowerCase());
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
