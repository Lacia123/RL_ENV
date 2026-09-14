/**
 * gridDomCheck.js
 *
 * 使用 Playwright 对 grid 布局渲染结果做 DOM 检测（内容缺失检测）。
 * 复用 renderAndEvaluate.js 的浏览器模式：launch → setViewportSize → setContent → evaluate。
 *
 * 检测范围（内容缺失）：
 * 1. 某个内容没有显示出来（元素尺寸为 0 / display:none / visibility:hidden / 完全在裁剪容器之外）
 * 2. 某个内容有一部分超出了容器（被裁切）；「...」省略号截断（ellipsis / line-clamp）是允许的，不算缺失
 * 3. grid:item 自身出现滚动（布局级溢出 = 内容整体放不下格子）；
 *    组件内部的滚动容器（如 showcaseCard 列表区 overflow-y:auto）是设计行为——
 *    滚动只发生在列表内部，内容可达不裁切，不算问题（文档级滚动不参与判定）
 * 4. 传入的文本内容丢失：psuip 中出现的文本片段在渲染结果中找不到
 *    （不做声明数量对比——卡片变体可能有意不渲染某些插槽，只对比"传入了的内容是否还在"）
 * 5. 内容溢出「不裁切的父容器」（被压扁折叠）：容器被 flex 压缩得比内容矮且
 *    overflow: visible 时，内容既不裁切也不滚动，而是压在兄弟内容上
 *    （如 targetStatCard 2×1：卡片内分组被压到 76px，标题第二行压到底部数字上）
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
    // ⚠️ 处理 [table:xxx] 表格：只剥离标签本身与分隔行（|----|、|:---:|）。
    // 数据行保留并与渲染后的 td 文本对齐：仅「以 | 开头」的 markdown 表格行
    // 把 | 语法符号替换为空格（行首/行尾/单元格分隔）；普通文本行里的 |（如
    // P(A|B)）是内容，不能动。表格渲染是否正常由 DOM 检测兜底
    .replace(/\[table:[^\]]*\]/g, ' ')
    .replace(/^\s*\|[\s|:\-]+\|\s*$/gm, ' ')
    .replace(/^[ \t]*\|.*$/gm, (line) => line.replace(/\|/g, ' '))
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
      // 溢出容差（px）：比 EPS 略大，吸收 flex 压缩与字体度量的亚像素误差
      // （判定 4「内容溢出父容器」使用，避免 1px 级抖动误报）
      const OVERFLOW_EPS = 2;

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

      // 找全部裁切祖先（由近到远，含溢出的容器链）
      // ⚠️ 不能只看最近的裁切祖先：内容元素相对最近容器完整、但该容器自身
      //    又超出外层裁切容器时，内容实际已被外层裁掉不可见（如 contentSummaryCard
      //    塞进过矮的格子里，desc 相对文字区完整、相对卡片容器越界被 hidden 裁掉）
      const allClippers = (el) => {
        const clippers = [];
        let p = el.parentElement;
        while (p && p !== document.body) {
          if (isClipping(getComputedStyle(p))) clippers.push(p);
          p = p.parentElement;
        }
        return clippers;
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

        // ── 判定 3：预期外的布局级滚动 ──
        // ⚠️ 在内容元素过滤之前执行（grid:item 容器无直接文本，会被 isContentEl 提前
        //    return，导致「grid:item 自身滚动」成为盲区——实测组件 min-height 超过
        //    格子高度时 item 出现滚动却判 valid）。
        // 只报 grid:item 自身滚动（item 级溢出 = 布局放不下，不合理）；
        // 组件内部的滚动容器（如 showcaseCard 列表区 overflow-y:auto）是设计行为
        // ——滚动只发生在 filelist 内部，内容可达不裁切，不算问题
        const isGridItemEl = (el.className || '').toString().includes('grid-item-dd-');
        if (isGridItemEl) {
          if (el.scrollHeight > el.clientHeight + EPS && (cs.overflowY === 'auto' || cs.overflowY === 'scroll')) {
            violations.push({
              type: 'scroll',
              target: `${el.tagName.toLowerCase()}.${(el.className || '').toString().slice(0, 40)}`,
              detail: `内容超出出现滚动（可见 ${el.clientHeight}px，内容 ${el.scrollHeight}px）`
            });
          }
        }

        // ── 判定 4：内容溢出「不裁切的父容器」（被压扁折叠）──
        // 场景：容器被 flex 压缩得比内容矮（如卡片内 flex:1 + min-height:0 的分组），
        //    且容器 overflow: visible —— 内容既不会被裁切（判定 2 只查裁切祖先），
        //    也不会出现滚动（判定 3 只认 overflow auto/scroll），于是内容直接压到
        //    兄弟内容上（实测 targetStatCard 2×1：标题第二行压在底部数字上，判定全绿）。
        // 判定：子元素「内容盒」（边框盒去掉自身 padding/border）超出「不裁切的父容器」边框盒
        //    超过 OVERFLOW_EPS 即报。⚠️ 必须扣掉子元素自身的 padding/border：
        //    padding 是设计留白，溢出量被自身留白吸收时内容并未越界（实测 mistakesCard 2×2
        //    的 12px 就是 feed 容器的 padding-bottom 伸到插槽外，文字既未越界也未重叠）
        // 排除（这些元素的矩形不代表流内布局占位，越界属正常视觉设计）：
        //   - 脱离文档流的子元素（absolute / fixed）
        //   - 被「真实偏移」的相对定位子元素（relative / sticky 且 top/bottom/left/right
        //     是非 0 的长度）。⚠️ 不能只判 !== 'auto'：实测 position: relative 且未设偏移时
        //     chrome 计算值是 0px 而非 auto，卡片/分组这类 relative 容器会被整类误排除，
        //     判定 4 形同虚设（2×1 targetStatCard 的折叠就是这么漏掉的）
        //   - 带 transform 的子元素（矩形是变换后的矩形）
        //   - display: inline 的子元素（行内盒子可高于行盒，KaTeX 公式即如此）
        //   - 零尺寸子元素 / 零尺寸父容器
        if (!isClipping(cs) && rect.width > 0 && rect.height > 0) {
          Array.from(el.children).forEach((child) => {
            const childCs = getComputedStyle(child);
            if (childCs.display === 'none' || childCs.visibility === 'hidden') return;
            if (childCs.position === 'absolute' || childCs.position === 'fixed') return;
            if ((childCs.position === 'relative' || childCs.position === 'sticky') &&
                ['top', 'bottom', 'left', 'right'].some((k) => {
                  const v = String(childCs[k] || '').trim();
                  return v !== '' && v !== 'auto' && !/^[-+]?0(\.0+)?(px|%)?$/.test(v);
                })) return;
            if (childCs.transform && childCs.transform !== 'none') return;
            if (childCs.display === 'inline') return;

            const cRect = child.getBoundingClientRect();
            if (cRect.width <= 0.5 || cRect.height <= 0.5) return;

            // 子元素内容盒 = 边框盒去掉自身 padding + border（非内容的设计留白/描边）
            const px = (v) => parseFloat(v) || 0;
            const insetTop = px(childCs.paddingTop) + px(childCs.borderTopWidth);
            const insetRight = px(childCs.paddingRight) + px(childCs.borderRightWidth);
            const insetBottom = px(childCs.paddingBottom) + px(childCs.borderBottomWidth);
            const insetLeft = px(childCs.paddingLeft) + px(childCs.borderLeftWidth);

            const overflow = Math.max(
              (cRect.bottom - insetBottom) - rect.bottom,
              rect.top - (cRect.top + insetTop),
              (cRect.right - insetRight) - rect.right,
              rect.left - (cRect.left + insetLeft)
            );
            if (overflow > OVERFLOW_EPS) {
              violations.push({
                type: 'overflow',
                target: `${child.tagName.toLowerCase()}.${(child.className || '').toString().slice(0, 40)}`,
                detail: `内容溢出容器（未被裁切，被压扁）「${el.tagName.toLowerCase()}.${(el.className || '').toString().slice(0, 40)}」${Math.round(overflow)}px（元素 ${Math.round(cRect.width)}×${Math.round(cRect.height)}，容器 ${Math.round(rect.width)}×${Math.round(rect.height)}）文本「${String(child.textContent || '').trim().slice(0, 30)}」`
              });
            }
          });
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

        // ── 判定 2：内容有一部分超出裁切容器（省略号截断允许）──
        // 遍历整条裁切祖先链（由近到远）：内容相对最近容器完整、但容器自身
        // 相对外层越界时，内容实际已被外层裁掉（见 allClippers 注释）。
        // 对链上每个裁切容器检查，任一越界即报（内容最终不可见/被裁）
        const clippers = allClippers(el);
        for (const clipper of clippers) {
          const cRect = clipper.getBoundingClientRect();
          const ccs = getComputedStyle(clipper);

          // 可滚动容器（overflow auto/scroll 且实际有溢出内容）：内容在滚动区内
          // 可滚可达，视觉受该容器裁切控制，外层容器无法再裁切它（如 showcaseCard
          // 列表区），直接跳出裁切链检查——内容不缺失
          const clipperScrollable =
            (ccs.overflowX === 'auto' || ccs.overflowX === 'scroll' || ccs.overflowY === 'auto' || ccs.overflowY === 'scroll') &&
            (clipper.scrollHeight > clipper.clientHeight + EPS || clipper.scrollWidth > clipper.clientWidth + EPS);
          if (clipperScrollable) break;

          const partiallyOutside =
            d.rect.right > cRect.right + EPS || d.rect.bottom > cRect.bottom + EPS ||
            d.rect.left < cRect.left - EPS || d.rect.top < cRect.top - EPS;
          const fullyOutside =
            d.rect.bottom <= cRect.top + EPS || d.rect.top >= cRect.bottom - EPS ||
            d.rect.right <= cRect.left + EPS || d.rect.left >= cRect.right - EPS;

          // 裁切祖先自身是省略号容器（line-clamp / ellipsis）时，超出属于允许的截断
          const clipperIsEllipsis =
            (ccs.textOverflow === 'ellipsis' && ccs.whiteSpace === 'nowrap' && clipper.scrollWidth > clipper.clientWidth + EPS) ||
            (ccs.display === '-webkit-box' && clipper.scrollHeight > clipper.clientHeight + EPS);

          if (partiallyOutside && d.tag !== 'img' && !isEllipsisTruncated(d) && !clipperIsEllipsis) {
            // ⚠️ img 部分越界豁免：图片是 cover 视觉，允许边缘被容器裁切
            //（如 heroCard 封面放大防白边的出血设计），裁掉的是图片边缘不算内容缺失
            violations.push({
              type: 'clipped',
              target: `${d.tag}.${d.cls}`,
              detail: `内容超出容器被裁切（元素 ${Math.round(d.rect.width)}×${Math.round(d.rect.height)}，容器 ${Math.round(cRect.width)}×${Math.round(cRect.height)}）文本「${d.text}」`
            });
            break; // 已确认越界被裁，不再检查外层裁切祖先（避免同一元素重复报）
          } else if (fullyOutside && !isEllipsisTruncated(d)) {
            // 完全不可见（含 img 完全在容器外）仍报缺失
            violations.push({
              type: 'missing',
              target: `${d.tag}.${d.cls}`,
              detail: `内容完全位于容器之外（被裁切不可见）文本「${d.text}」`
            });
            break;
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
