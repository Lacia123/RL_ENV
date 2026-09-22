import { checkGridLayoutValidity } from './gridValidity.js';
import { CARD_MIN_SIZE_MAP } from './cardMinSizes.js';
import { resolveGrowthTendency } from './cardGrowthConfig.js';

/**
 * 解析 psuip 顶层卡片的起始格子数（该卡片的最小格数 minW×minH）
 *
 * 语义：卡片类型在 CARD_MIN_SIZE_MAP 中配置了最小宽/高（格）时，低于该尺寸的
 * 网格必然被最小尺寸预检判「严格不符合」，没有检测意义——因此增长检测的起始点
 * 直接取 minW×minH（与接口 width/height 入参语义一致：列数 × 行数）。
 * 未配置最小尺寸的卡片类型 / 顶层非卡片（纯文本、layout 包裹等）回退 1×1。
 * 起始尺寸不超过上限（minW > maxColumns 时取 maxColumns）。
 *
 * @param {string} psuip - 裸 PSUIP 内容
 * @param {{maxColumns: number, maxRows: number}} limits - 列/行上限
 * @returns {{columns: number, rows: number}} 起始格子数
 */
function resolveStartSize(psuip, { maxColumns, maxRows }) {
  // 顶层标签名：<textCard ...> → textCard；<card:headerPrecentCard> → headerPrecentCard
  const topTagMatch = String(psuip || '').trim().match(/^<([a-zA-Z][\w.:-]*)/);
  if (!topTagMatch) return { columns: 1, rows: 1 };
  const rawTag = topTagMatch[1];
  const tagName = rawTag.includes(':') ? rawTag.split(':').pop() : rawTag;

  const cfg = CARD_MIN_SIZE_MAP[tagName];
  if (!cfg) return { columns: 1, rows: 1 }; // 未配置最小尺寸 → 从 1×1 起

  const minW = Number(cfg.minW);
  const minH = Number(cfg.minH);
  return {
    columns: Number.isFinite(minW) && minW >= 1 ? Math.min(minW, maxColumns) : 1,
    rows: Number.isFinite(minH) && minH >= 1 ? Math.min(minH, maxRows) : 1
  };
}

/**
 * 按增长趋势自动检测卡片所需格子数（gridGrowthCheck.js）
 *
 * 用途：输入一段 psuip（grid 内内容，不含 grid:item / layout:grid 标签），从卡片
 * 的起始格子数（minW×minH，未配置则 1×1）开始逐格增长，检测内容在哪个格子数下
 * 布局合法，返回最终结果。供 /api/markdown-grid-growth-check 接口使用。
 *
 * 增长趋势（tendency）语义：
 *   - 形如 [[1,0],[1,0],[0,1],...] 的方向向量列表，第 k 步按第 k 个向量扩 1 格：
 *       [1,0] → 列 +1（横向加宽）；[0,1] → 行 +1（纵向加高）
 *   - 列表用尽后从头循环（实际增长步数通常不多）
 *   - 某一侧到达上限（maxColumns / maxRows）后，该方向的向量视为 0（无效）；
 *     两个方向都无效的 [0,0] 步直接跳过（优化：不渲染、不做 DOM 检测），
 *     直到一圈内找不到任何有效方向（两侧都到头）才停止增长。
 *
 * 倾向性自动推导（tendency 可不传）：
 *   调用方不再需要输入倾向性向量——它与卡片的「整体形态」相关联：
 *   - 上下形态（column，如标题在上/内容在下/按钮贴底）：[[0,1],[1,0]]（先加行再加列）
 *   - 左右形态（row，如左信息+右头像、左文右图）：[[1,0],[0,1]]（先加列再加行）
 *   通过 cardGrowthConfig.CARD_GROWTH_TENDENCY_MAP 按顶层卡片名（去掉 card: 前缀）
 *   自动匹配；未配置的卡片 / 顶层非卡片回退默认（上下形态）。
 *
 * 合法性判定（每步都执行，复用 gridValidity.checkGridLayoutValidity）：
 *   1. 卡片最小尺寸预检（严格）：psuip 顶层卡片在 CARD_MIN_SIZE_MAP 中配置了
 *      最小格数时，当前网格任一维度不足即严格判不符合（短路，不渲染）。
 *      起始点即 minW×minH，该预检必然通过；增长过程中由趋势驱动不会回退。
 *   2. DOM 内容检测：真实渲染后检测内容缺失 / 裁切 / 预期外滚动。
 *   第一个合法的格子数即为最终结果。
 *
 * @param {string} psuip - 裸 PSUIP 内容（grid 内内容，不含 grid / grid:item 标签）
 * @param {object} options
 * @param {Array<[number, number]>} [options.tendency] - 增长方向向量列表（用尽循环）。
 *        可选：不传时按卡片整体形态自动推导（上下 [[0,1],[1,0]] / 左右 [[1,0],[0,1]]）
 * @param {number} options.maxColumns - 列数上限 n（横向最多 n 格）
 * @param {number} options.maxRows - 行数上限 m（纵向最多 m 格）
 * @param {boolean} [options.takeScreenshot=false] - 是否对最终结果截图（本地 test 用）
 * @param {string} [options.outputDir='public'] - 截图输出目录
 * @param {string} [options.outputPrefix='grid-check'] - 截图文件前缀（.gitignore 已忽略）
 * @returns {Promise<{valid: boolean, startColumns: number, startRows: number, columns: number, rows: number, tendency: Array<[number,number]>, cardName: string|null, tendencySource: 'config'|'default'|'input', screenshotPath: string|null, details: object}>}
 */
export async function growCheckGridLayout(psuip, {
  tendency,
  maxColumns,
  maxRows,
  takeScreenshot = false,
  outputDir = 'public',
  outputPrefix = 'grid-check'
}) {
  // 倾向性：未传时按卡片整体形态自动推导（配置命中 / 回退默认）
  let tendencySource = 'input';
  let cardName = null;
  if (tendency === undefined || tendency === null) {
    const derived = resolveGrowthTendency(psuip);
    tendency = derived.tendency;
    cardName = derived.cardName;
    tendencySource = derived.source;
  }
  const len = tendency.length;
  if (!Array.isArray(tendency) || len === 0) {
    throw new Error('tendency 必须为非空的方向向量列表');
  }

  // 起始尺寸 = 顶层卡片的最小格数 minW×minH（未配置回退 1×1）
  const start = resolveStartSize(psuip, { maxColumns, maxRows });
  let columns = start.columns;
  let rows = start.rows;
  let k = 0; // 趋势列表游标（用尽循环）
  let lastResult = null;

  while (true) {
    // ── 1. 判定当前尺寸（最小尺寸预检严格短路 + DOM 内容检测）──
    const result = await checkGridLayoutValidity(psuip, { columns, rows });
    lastResult = result;

    // 合法 → 当前尺寸即最终结果
    if (result.valid) break;

    // 两侧都到上限 → 无法再增长，返回最后判定结果
    if (columns >= maxColumns && rows >= maxRows) break;

    // ── 2. 取下一个有效增长方向（列表循环；到头方向视为 0；[0,0] 跳过）──
    let dc = 0;
    let dr = 0;
    let steps = 0;
    while (steps < len) {
      const v = tendency[k % len];
      k++;
      steps++;
      // 一侧到头 → 该方向视为 0（无效）
      dc = columns >= maxColumns ? 0 : (Number(v?.[0]) || 0);
      dr = rows >= maxRows ? 0 : (Number(v?.[1]) || 0);
      if (dc === 0 && dr === 0) continue; // [0,0]：跳过（优化，不渲染不检测）
      break;
    }

    // 一整圈都没有有效方向（两侧都到头）→ 停止增长
    if (dc === 0 && dr === 0) break;

    columns += dc;
    rows += dr;
  }

  // ── 3. 最终结果截图（本地 test 模式；仅对最终尺寸截一次）──
  let screenshotPath = null;
  if (takeScreenshot) {
    const finalResult = await checkGridLayoutValidity(psuip, {
      columns,
      rows,
      takeScreenshot: true,
      outputDir,
      outputPrefix
    });
    screenshotPath = finalResult.screenshotPath || null;
    lastResult = finalResult; // valid/details 与判定一致（确定性渲染）
  }

  return {
    valid: lastResult.valid,
    startColumns: start.columns,
    startRows: start.rows,
    columns,
    rows,
    tendency,
    cardName,
    tendencySource,
    screenshotPath,
    details: lastResult.details
  };
}
