import { markdownToEightElement } from './index.js';
import { renderEightElementToHtml } from './renderEightElementHtml.js';
import { GRID_CONSTANTS } from './styles';
import { measureGridDom } from './gridDomCheck.js';
import { CARD_MIN_SIZE_MAP } from './cardMinSizes.js';

/**
 * 将裸 psuip 包裹为完整的 grid 布局（可渲染）
 *
 * 调用方传入的 psuip 不包含 <layout:grid> 与 <grid:item> 标签，
 * 当 type=grid 时，由本函数包裹成完整的可渲染 PSUIP：
 *
 *   grid   → <layout:grid width="{columns}" gap="16" height="{rows}">
 *   item   → <grid:item x="1" y="1" width="{columns}" height="{rows}">
 *
 * 注：x/y 为起始格，1 起始（与 gridCreators 的语义一致）。
 * 不能写 0 —— CSS Grid 的网格线从 1 开始，grid-column/row 为 0 是无效声明，
 * 会被浏览器忽略导致 grid:item 落入自动占位、高度只剩 1 格（span 丢失），
 * 进而组件空间不足产生内容叠加。
 *
 * 即：外层网格 = 传入的格子数（m 列 × n 行）；内部单个 grid:item 占满整个网格，
 * psuip 的卡片内容全部放入该 item 中渲染。
 *
 * @param {string} psuip - 裸 PSUIP 内容（不含 grid / grid:item 标签）
 * @param {{columns: number, rows: number}} options - 网格格子数（m 列 × n 行）
 * @returns {string} 包裹后的完整可渲染 PSUIP
 */
export function wrapGridPsuip(psuip, { columns, rows }) {
  const content = String(psuip || '').trim();
  return [
    `<layout:grid width="${columns}" gap="16" height="${rows}">`,
    `<grid:item x="1" y="1" width="${columns}" height="${rows}">`,
    content,
    `</grid:item>`,
    `</layout:grid>`
  ].join('\n');
}

/**
 * 卡片最小尺寸预检（最小格数检测，纯静态不渲染）
 *
 * 语义：每种卡片类型可在 CARD_MIN_SIZE_MAP（cardMinSizes.js）里配置最小宽/高，
 * 单位为「格」（列数 × 行数，与接口 width/height 入参一致）。模型分配给卡片的
 * 网格小于该类型的最小格数时，卡片必然放不下（内容会被挤压/裁切），属于根本性
 * 错误——无需渲染即可判定非法，报错放最前（短路，省一次 Playwright DOM 检测）。
 *
 * 识别范围：仅取 psuip 顶层的卡片标签（契约中 psuip 为裸内容，顶层即卡片）；
 * 顶层不是卡片（纯文本 / layout 包裹 / 未在表中配置的类型）时不适用，返回 null，
 * 交由原有 DOM 内容缺失检测继续兜底。
 *
 * @param {string} psuip - 裸 PSUIP 内容（不含 grid / grid:item 标签）
 * @param {{columns: number, rows: number}} grid - 分配网格的列数 m 与行数 n
 * @returns {string|null} 不满足时返回报错文案（应置于 messages 最前）；满足/不适用返回 null
 */
function checkCardMinSize(psuip, { columns, rows }) {
  // 顶层标签名：<textCard ...> → textCard；<card:headerPrecentCard> → headerPrecentCard
  const topTagMatch = String(psuip || '').trim().match(/^<([a-zA-Z][\w.:-]*)/);
  if (!topTagMatch) return null;
  const rawTag = topTagMatch[1];
  const tagName = rawTag.includes(':') ? rawTag.split(':').pop() : rawTag;

  const cfg = CARD_MIN_SIZE_MAP[tagName];
  if (!cfg) return null; // 该类型未配置最小尺寸 → 不限制（向后兼容）

  const minW = Number(cfg.minW);
  const minH = Number(cfg.minH);
  const hasMinW = Number.isFinite(minW);
  const hasMinH = Number.isFinite(minH);
  if (!hasMinW && !hasMinH) return null; // 配置了条目但没填有效值 → 视同不限制

  if ((hasMinW && columns < minW) || (hasMinH && rows < minH)) {
    return `${tagName} 卡片不满足最小尺寸：至少需要 ${hasMinW ? minW : '—'}×${hasMinH ? minH : '—'} 格（宽×高），当前网格仅 ${columns}×${rows} 格`;
  }
  return null;
}

/**
 * grid 布局合理性校验（内容缺失检测）
 *
 * 判定一段 PSUIP 字符串中的 grid 布局在指定的「格子数」网格（m 列 × n 行）下是否"合理"。
 * 供 /api/markdown-layout-check 接口使用（强化模型训练用）。
 *
 * 语义：模型不能看图、不关心像素，只关心格子级语义——因此入参是格子数（columns/rows），
 * 像素换算（i=228 / j=216 / gap=16，见 GRID_CONSTANTS）由校验内部完成，对模型不可见。
 *
 * 检测范围（内容缺失，详见 gridDomCheck.js）：
 * 1. 某个内容没有显示出来（尺寸为 0 / display:none / visibility:hidden / 完全在容器之外）
 * 2. 某个内容有一部分超出了容器（被裁切）；「...」省略号截断是允许的
 * 3. grid:item 及以内出现预期之外的滚动（文档级滚动不参与判定）
 *
 * @param {string} psuip - 裸 PSUIP 内容（不含 grid / grid:item 标签）
 * @param {{columns: number, rows: number, html?: string, takeScreenshot?: boolean, outputDir?: string, outputPrefix?: string}} options
 *        - columns/rows: 网格格子数（m 列 × n 行）
 *        - html: 可选，已渲染好的 HTML（由接口传入，避免重复渲染）；不传则内部渲染
 *        - takeScreenshot/outputDir/outputPrefix: test 模式截图（透传给 measureGridDom）
 * @returns {Promise<{valid: boolean, details: object, screenshotPath?: string}>} - valid=false 时 details 说明原因
 */
export async function checkGridLayoutValidity(psuip, { columns, rows, html, takeScreenshot = false, outputDir = 'output', outputPrefix = 'grid-check' }) {
  // ── 0. 卡片最小尺寸预检（短路：不渲染、不做 DOM 检测）──
  // 网格分配不足卡片类型要求的最小格数时，卡片必然放不下，属根本性错误，
  // 直接判定非法并将报错作为唯一（最前）消息返回
  const minSizeError = checkCardMinSize(psuip, { columns, rows });
  if (minSizeError) {
    return {
      valid: false,
      details: {
        checked: 0,
        messages: [minSizeError]
      }
    };
  }

  // 视口 = 网格换算尺寸 + 环境余量：
  // 渲染环境中 layout:root 有 padding（dimension.padding.base = 12px，左右各 12），
  // 若视口精确等于网格尺寸，grid 会被 root padding 挤出视口 → 文档滚动误报。
  // 余量 40px 覆盖 root padding 24px + 安全值，grid 完整落在视口内。
  const VIEWPORT_PADDING = 40;
  const viewportWidth = columns * GRID_CONSTANTS.CELL_WIDTH + (columns - 1) * GRID_CONSTANTS.GAP + VIEWPORT_PADDING;
  const viewportHeight = rows * GRID_CONSTANTS.CELL_HEIGHT + (rows - 1) * GRID_CONSTANTS.GAP + VIEWPORT_PADDING;

  try {
    // 1. 渲染 HTML（若接口已渲染则复用）
    let htmlContent = html;
    if (!htmlContent) {
      const wrapped = wrapGridPsuip(psuip, { columns, rows });
      const eightElement = markdownToEightElement(wrapped);
      htmlContent = renderEightElementToHtml(eightElement, {
        width: viewportWidth,
        height: viewportHeight,
        includeInteractive: false
      }).html;
    }

    // 2. Playwright 真实渲染 + 内容缺失检测（test 模式附带截图）
    const dom = await measureGridDom(htmlContent, {
      width: viewportWidth,
      height: viewportHeight,
      psuip,
      takeScreenshot,
      outputDir,
      outputPrefix
    });

    // 3. 汇总判定：任一缺失 → invalid
    const messages = dom.violations.map(v =>
      `[${v.type}] ${v.target}: ${v.detail}`
    );

    return {
      valid: dom.violations.length === 0,
      screenshotPath: dom.screenshotPath || null,
      details: {
        checked: dom.elementCount,
        messages: messages.length > 0 ? messages : ['通过：无内容缺失']
      }
    };
  } catch (error) {
    console.error('grid DOM 检测失败:', error);
    return {
      valid: false,
      details: {
        checked: 0,
        messages: [`DOM 检测异常: ${error.message}`]
      }
    };
  }
}
