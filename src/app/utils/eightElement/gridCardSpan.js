/**
 * 根据画布网格与单卡 PSUIP，估算最佳跨格 w×h（单位：格）
 */
import { markdownToEightElement } from './PSUIPParser.js';
import { renderAndEvaluateEightElement } from './renderAndEvaluate.js';
import { DEFAULT_STYLE_CONFIG, GRID_CONSTANTS } from './styles/index.js';

/** 参考格（456×216）下的默认跨格预设 */
const CARD_SPAN_PRESETS = {
  heroCard: { w: 2, h: 2 },
  featureHeroCard: { w: 2, h: 2 },
  contentDisplayCard: { w: 1, h: 2 },
  pairedImageTextCard: { w: 2, h: 2 },
  tableCard: { w: 2, h: 2 },
  layeredActionCard: { w: 1, h: 2 },
  multiActionCard: { w: 1, h: 1 },
  confirmableCard: { w: 1, h: 1 },
  summaryCard: { w: 1, h: 1 },
  summaryTransparentCard: { w: 1, h: 1 },
  metricCard: { w: 1, h: 1 },
  textCard: { w: 1, h: 1 },
  textCenterCard: { w: 1, h: 1 },
  titleCenterCard: { w: 1, h: 1 },
  actionCard: { w: 1, h: 1 },
  eventCard: { w: 1, h: 2 },
  statusCard: { w: 1, h: 1 },
  feedListCard: { w: 1, h: 2 },
  feedListTranCard: { w: 1, h: 2 },
  bannerImagePanel: { w: 2, h: 1 },
  historyCard: { w: 1, h: 1 },
  hiringTitleCard: { w: 1, h: 1 },
  hiringImageCard: { w: 1, h: 2 },
  hiringListCard: { w: 1, h: 2 },
  targetStatCard: { w: 1, h: 1 },
  mistakesCard: { w: 1, h: 2 },
  contentSummaryCard: { w: 1, h: 2 },
};

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function parsePx(value, fallback = null) {
  if (value === undefined || value === null || value === '') return fallback;
  const n = parseFloat(String(value).replace(/px$/i, ''));
  return Number.isFinite(n) ? n : fallback;
}

function getComponentNames() {
  return Object.keys(DEFAULT_STYLE_CONFIG.component || {});
}

/**
 * 从单卡 PSUIP 中识别顶层卡片类型
 */
export function detectCardType(markdown = '') {
  const names = getComponentNames();
  if (!names.length) return null;
  const re = new RegExp(`<(${names.join('|')})(?:\\s|>|/)`);
  const match = String(markdown).match(re);
  return match ? match[1] : null;
}

function hasSlot(markdown, slotName) {
  const re = new RegExp(`<${slotName}(\\s[^>]*)?>`, 'i');
  return re.test(markdown);
}

function slotTextLength(markdown, slotName) {
  const re = new RegExp(`<${slotName}(?:\\s[^>]*)?>([\\s\\S]*?)</${slotName}>`, 'i');
  const match = String(markdown).match(re);
  if (!match) return 0;
  return match[1].replace(/\s+/g, ' ').trim().length;
}

function countSlots(markdown, slotName) {
  const re = new RegExp(`<${slotName}(?:\\s[^>]*)?>`, 'gi');
  return (String(markdown).match(re) || []).length;
}

/**
 * 分析单卡内容特征，用于在预设上增减跨格
 */
export function analyzeCardContent(markdown = '', cardType = '') {
  const textSlots = [
    'text', 'description', 'body', 'subtitle', 'text_text', 'text_title',
    'title', 'message', 'content', 'caption'
  ];
  let textLen = 0;
  textSlots.forEach((slot) => {
    textLen += slotTextLength(markdown, slot);
  });

  const hasMedia = [
    'cover_image', 'coverImage', 'image', 'topImage', 'backgroundImage',
    'preview', 'visual', 'chart_mini'
  ].some((slot) => hasSlot(markdown, slot));

  const hasTable = /<table[\s>]/.test(markdown) || /\|.+\|/.test(markdown);
  const actionCount =
    countSlots(markdown, 'primaryAction') +
    countSlots(markdown, 'secondaryAction') +
    countSlots(markdown, 'cta_primary') +
    countSlots(markdown, 'cta_secondary') +
    countSlots(markdown, 'cta') +
    countSlots(markdown, 'commit') +
    countSlots(markdown, 'commitWide') +
    countSlots(markdown, 'button');

  const listItemCount =
    countSlots(markdown, 'items') +
    countSlots(markdown, 'mistakesCardItem') +
    countSlots(markdown, 'primaryItem') +
    countSlots(markdown, 'secondaryItem');

  return {
    cardType,
    textLen,
    hasMedia,
    hasTable,
    actionCount,
    listItemCount,
  };
}

function referenceSpanToPixels(span, unit, gap) {
  const s = Math.max(1, span);
  return s * unit + (s - 1) * gap;
}

function pixelsToSpan(px, cellSize, gap, maxSpan = Infinity) {
  if (!Number.isFinite(px) || px <= 0) return 1;
  const span = Math.ceil((px + gap) / (cellSize + gap));
  if (!Number.isFinite(maxSpan)) return Math.max(1, span);
  return clamp(span, 1, maxSpan);
}

/** 不裁剪到画布上限，用于判断「需要多少格才装得下」 */
function pixelsToSpanNeeded(px, cellSize, gap) {
  if (!Number.isFinite(px) || px <= 0) return 1;
  return Math.max(1, Math.ceil((px + gap) / (cellSize + gap)));
}

function spanToPixels(span, cellSize, gap) {
  const s = Math.max(1, span);
  return s * cellSize + (s - 1) * gap;
}

/**
 * 基于卡片类型 + 内容特征估算最小像素需求（相对参考格）
 */
export function estimateMinPixels(cardType, analysis, gap = GRID_CONSTANTS.GAP) {
  const preset = CARD_SPAN_PRESETS[cardType] || { w: 1, h: 1 };
  let w = preset.w;
  let h = preset.h;

  if (analysis.hasMedia) h = Math.max(h, preset.h, 2);
  if (analysis.hasTable) {
    w = Math.max(w, 2);
    h = Math.max(h, 2);
  }
  if (analysis.textLen > 180) h += 1;
  else if (analysis.textLen > 90) h = Math.max(h, preset.h + (preset.h === 1 ? 1 : 0));

  if (analysis.actionCount >= 3) w = Math.max(w, 2);
  if (analysis.listItemCount >= 3) h = Math.max(h, 2);
  if (analysis.listItemCount >= 5) h = Math.max(h, 3);

  // summary / confirmable 带大图时加高
  if (
    (cardType === 'summaryCard' || cardType === 'summaryTransparentCard') &&
    (analysis.hasMedia)
  ) {
    h = Math.max(h, 2);
  }

  if (cardType === 'heroCard' || cardType === 'featureHeroCard') {
    w = Math.max(w, 2);
    h = Math.max(h, analysis.hasMedia ? 2 : 1);
  }

  if (cardType === 'pairedImageTextCard') {
    w = Math.max(w, 2);
    h = Math.max(h, 2);
  }

  return {
    minWidthPx: referenceSpanToPixels(w, GRID_CONSTANTS.CELL_WIDTH, gap),
    minHeightPx: referenceSpanToPixels(h, GRID_CONSTANTS.CELL_HEIGHT, gap),
    presetAfterBoost: { w, h },
  };
}

function findPrimaryContentNode(eightElement) {
  const walk = (el) => {
    if (!el) return null;
    const type = el._metadata?.actualType;
    if (type === 'component' || type === 'card') return el;
    const children = el.layout?.children || [];
    for (const child of children) {
      const found = walk(child);
      if (found) return found;
    }
    return null;
  };
  return walk(eightElement);
}

function extractMeasuredSize(measurements, eightElement) {
  const primary = findPrimaryContentNode(eightElement);
  const elements = measurements?.elements || [];
  const cards = measurements?.cards || [];

  const attachOverflow = (base, cardLike) => {
    if (!base) return null;
    return {
      ...base,
      scrollWidth: cardLike?.scrollWidth ?? base.width,
      scrollHeight: cardLike?.scrollHeight ?? base.height,
      clientWidth: cardLike?.clientWidth ?? base.width,
      clientHeight: cardLike?.clientHeight ?? base.height,
      contentOverflowX: !!cardLike?.contentOverflowX,
      contentOverflowY: !!cardLike?.contentOverflowY,
      clippedText: !!cardLike?.clippedText,
    };
  };

  if (primary?.id) {
    const fromCards = cards.find((c) => c.id === primary.id);
    if (fromCards) {
      return attachOverflow(
        { width: fromCards.width, height: fromCards.height, source: 'card' },
        fromCards
      );
    }
    const fromElements = elements.find((e) => e.id === primary.id);
    if (fromElements) {
      return attachOverflow(
        { width: fromElements.width, height: fromElements.height, source: 'element' },
        fromElements
      );
    }
  }

  let best = null;
  for (const el of elements) {
    if (!el || el.parentId == null) continue;
    const area = (el.width || 0) * (el.height || 0);
    if (!best || area > best.area) {
      best = { width: el.width, height: el.height, area, source: 'largest-child', id: el.id };
    }
  }
  if (best) {
    const matchedCard = cards.find((c) => c.id === best.id) || cards[0];
    return attachOverflow(
      { width: best.width, height: best.height, source: best.source },
      matchedCard
    );
  }
  if (cards[0]) {
    return attachOverflow(
      { width: cards[0].width, height: cards[0].height, source: 'card' },
      cards[0]
    );
  }
  return null;
}

/**
 * 在指定容器宽度下渲染单卡并测量外接尺寸（必须用真实格宽，禁止抬高最小宽）
 */
export async function measureCardNaturalSize(markdown, containerWidth, containerHeight = 2400) {
  const eightElement = markdownToEightElement(markdown);
  const boxW = Math.max(1, Math.ceil(containerWidth));
  const boxH = Math.max(1, Math.ceil(containerHeight));
  const result = await renderAndEvaluateEightElement(eightElement, {
    width: boxW,
    height: boxH,
    takeScreenshot: false,
    useAims: false,
    saveHtml: false,
    saveScreenshotToDisk: false,
  });
  const size = extractMeasuredSize(result.measurements, result.processedEightElement || eightElement);
  return {
    size,
    measurements: result.measurements,
    box: { width: boxW, height: boxH },
  };
}

function computeCellSize({ width, height, columns, rows, gap }) {
  const cellWidth = (width - gap * (columns - 1)) / columns;
  const cellHeight = (height - gap * (rows - 1)) / rows;
  return { cellWidth, cellHeight };
}

const OVERFLOW_TOL_PX = 2;

/**
 * 在给定列宽（格）下测量内容完整可见所需的外接高（行）
 */
async function measureRequiredSpanAtWidth({
  markdown,
  candidateW,
  cellWidth,
  cellHeight,
  gap,
  canvasHeight,
  cache,
}) {
  if (cache.has(candidateW)) return cache.get(candidateW);

  const atWidth = spanToPixels(candidateW, cellWidth, gap);
  const { size, box } = await measureCardNaturalSize(
    markdown,
    atWidth,
    Math.max(canvasHeight * 3, 3200)
  );

  if (!size) {
    const miss = { ok: false, candidateW, atWidth, fullyVisible: false, reason: 'measure-failed' };
    cache.set(candidateW, miss);
    return miss;
  }

  const outerWidth = Math.max(size.width || 0, size.scrollWidth || 0);
  const outerHeight = Math.max(size.height || 0, size.scrollHeight || 0);
  const overflowX =
    !!size.contentOverflowX ||
    !!size.clippedText ||
    outerWidth > atWidth + OVERFLOW_TOL_PX;
  const overflowY = !!size.contentOverflowY;

  const neededH = pixelsToSpanNeeded(outerHeight + 1, cellHeight, gap);
  const fullyVisible = !overflowX && !overflowY;
  const result = {
    ok: true,
    candidateW,
    atWidth,
    boxWidth: box?.width,
    measuredWidth: size.width,
    measuredHeight: size.height,
    outerWidth,
    outerHeight,
    measureSource: size.source,
    overflowX,
    overflowY,
    clippedText: !!size.clippedText,
    fullyVisible,
    neededH,
    area: candidateW * neededH,
    sum: candidateW + neededH,
  };
  cache.set(candidateW, result);
  return result;
}

/**
 * 搜索「内容完整可见」的外接矩形跨格（默认最小化 w+h）。
 */
async function findMinFittingSpan({
  markdown,
  columns,
  rows,
  cellWidth,
  cellHeight,
  gap,
  canvasHeight,
  seedW,
  objective = 'min-sum',
  minScale = 1,
  allowCompress = false,
}) {
  const cache = new Map();
  const scale = allowCompress ? clamp(Number(minScale) || 1, 0.1, 1) : 1;

  const evaluate = (candidateW) =>
    measureRequiredSpanAtWidth({
      markdown,
      candidateW,
      cellWidth,
      cellHeight,
      gap,
      canvasHeight,
      cache,
    });

  const isFeasible = (result) => {
    if (!result?.ok || !result.fullyVisible) return false;
    const needH = pixelsToSpanNeeded(result.outerHeight * scale + 1, cellHeight, gap);
    return needH <= rows;
  };

  const neededHOf = (result) => {
    if (!result?.ok) return rows + 1;
    return pixelsToSpanNeeded(result.outerHeight * scale + 1, cellHeight, gap);
  };

  const toCandidate = (result, fits) => {
    if (!result?.ok) return null;
    const needH = neededHOf(result);
    const h = fits ? needH : clamp(needH, 1, rows);
    return {
      w: result.candidateW,
      h,
      measuredWidth: result.outerWidth,
      measuredHeight: result.outerHeight,
      measureSource: result.measureSource,
      fits,
      fullyVisible: !!result.fullyVisible,
      overflowX: !!result.overflowX,
      overflowY: !!result.overflowY,
      clippedText: !!result.clippedText,
      neededH: needH,
      area: result.candidateW * h,
      sum: result.candidateW + h,
      maxSide: Math.max(result.candidateW, h),
    };
  };

  const full = await evaluate(columns);
  if (!isFeasible(full)) {
    return {
      found: false,
      best: toCandidate(full, false),
      probes: cache.size,
      minFeasibleW: null,
    };
  }

  if (objective === 'min-square') {
    const maxS = Math.min(columns, rows);
    let lo = 1;
    let hi = maxS;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      const midResult = await evaluate(mid);
      const boxH = spanToPixels(mid, cellHeight, gap);
      const ok =
        midResult.ok &&
        midResult.fullyVisible &&
        midResult.outerHeight * scale <= boxH + OVERFLOW_TOL_PX;
      if (ok) hi = mid;
      else lo = mid + 1;
    }
    const S = lo;
    const result = await evaluate(S);
    const boxH = spanToPixels(S, cellHeight, gap);
    const ok =
      result.ok &&
      result.fullyVisible &&
      result.outerHeight * scale <= boxH + OVERFLOW_TOL_PX;
    return {
      found: ok,
      best: result.ok
        ? {
            ...toCandidate(result, ok),
            w: S,
            h: S,
            area: S * S,
            sum: S + S,
            maxSide: S,
          }
        : null,
      probes: cache.size,
      minFeasibleW: ok ? S : null,
    };
  }

  let lo = 1;
  let hi = columns;
  const seed = clamp(seedW || 1, 1, columns);
  const seedResult = await evaluate(seed);
  if (isFeasible(seedResult)) hi = seed;

  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (isFeasible(await evaluate(mid))) hi = mid;
    else lo = mid + 1;
  }

  const minFeasibleW = lo;
  if (!isFeasible(await evaluate(minFeasibleW))) {
    return {
      found: false,
      best: toCandidate(full, false),
      probes: cache.size,
      minFeasibleW: null,
    };
  }

  const probeSet = new Set([minFeasibleW]);
  const span = Math.max(0, columns - minFeasibleW);
  const step =
    objective === 'min-max-side'
      ? Math.max(1, Math.floor(span / 8) || 1)
      : span <= 24
        ? 1
        : Math.max(1, Math.floor(span / 24));
  for (let w = minFeasibleW; w <= columns; w += step) probeSet.add(w);
  probeSet.add(columns);
  [1.25, 1.5, 2].forEach((k) => {
    const w = Math.ceil(minFeasibleW * k);
    if (w >= minFeasibleW && w <= columns) probeSet.add(w);
  });

  let best = null;
  for (const candidateW of [...probeSet].sort((a, b) => a - b)) {
    const result = await evaluate(candidateW);
    if (!isFeasible(result)) continue;
    const candidate = toCandidate(result, true);
    if (!candidate) continue;

    let better = !best;
    if (!better && objective === 'min-max-side') {
      better =
        candidate.maxSide < best.maxSide ||
        (candidate.maxSide === best.maxSide && candidate.area < best.area);
    } else if (!better && objective === 'min-area') {
      better =
        candidate.area < best.area ||
        (candidate.area === best.area && candidate.sum < best.sum);
    } else if (!better) {
      better =
        candidate.sum < best.sum ||
        (candidate.sum === best.sum && candidate.area < best.area);
    }
    if (better) best = candidate;
  }

  return { found: !!best, best, probes: cache.size, minFeasibleW };
}

/**
 * 主入口：估算单卡在给定画布网格上的最佳 w、h
 *
 * 目标：内容完整可见的外接矩形跨格（默认最小化 w+h）
 *
 * @param {Object} options
 * @param {'min-sum'|'min-area'|'min-max-side'|'min-square'} [options.objective='min-sum']
 * @param {boolean} [options.allowCompress=false] 为 true 时才启用 minScale 高度压缩
 * @param {number} [options.minScale=1] 仅 allowCompress=true 时生效
 */
export async function estimateGridCardSpan(options = {}) {
  const columns = parseInt(options.columns, 10);
  const rows = parseInt(options.rows, 10);
  const width = parsePx(options.width);
  const height = parsePx(options.height);
  const gap = parsePx(options.gap, GRID_CONSTANTS.GAP);
  const markdown = String(options.markdown || '').trim();
  const measure = options.measure !== false && options.measure !== 'false';
  const objective = ['min-sum', 'min-area', 'min-square', 'min-max-side'].includes(options.objective)
    ? options.objective
    : 'min-sum';
  const allowCompress = options.allowCompress === true || options.allowCompress === 'true';
  const minScale = options.minScale !== undefined ? Number(options.minScale) : 1;

  if (!markdown) {
    throw Object.assign(new Error('markdown 参数为必填项（单卡 PSUIP）'), { status: 400 });
  }
  if (!Number.isFinite(columns) || columns < 1) {
    throw Object.assign(new Error('columns 必须是 >= 1 的整数'), { status: 400 });
  }
  if (!Number.isFinite(rows) || rows < 1) {
    throw Object.assign(new Error('rows 必须是 >= 1 的整数'), { status: 400 });
  }
  if (!Number.isFinite(width) || width <= 0) {
    throw Object.assign(new Error('width 必须是正数（画布宽度 px）'), { status: 400 });
  }
  if (!Number.isFinite(height) || height <= 0) {
    throw Object.assign(new Error('height 必须是正数（画布高度 px）'), { status: 400 });
  }
  if (!Number.isFinite(gap) || gap < 0) {
    throw Object.assign(new Error('gap 必须是 >= 0 的数字'), { status: 400 });
  }

  const cardType = detectCardType(markdown);
  if (!cardType) {
    throw Object.assign(
      new Error('未能从 markdown 中识别出已注册的卡片组件，请确保输入为单卡 PSUIP'),
      { status: 400 }
    );
  }

  const { cellWidth, cellHeight } = computeCellSize({ width, height, columns, rows, gap });
  if (cellWidth <= 0 || cellHeight <= 0) {
    throw Object.assign(new Error('画布尺寸与行列数不合法，导致单格尺寸 <= 0'), { status: 400 });
  }

  const analysis = analyzeCardContent(markdown, cardType);
  const { minWidthPx, minHeightPx, presetAfterBoost } = estimateMinPixels(cardType, analysis, gap);

  let w = pixelsToSpan(minWidthPx, cellWidth, gap, columns);
  let h = pixelsToSpan(minHeightPx, cellHeight, gap, rows);
  let measured = null;
  let method = 'heuristic';
  let search = null;

  if (measure) {
    const found = await findMinFittingSpan({
      markdown,
      columns,
      rows,
      cellWidth,
      cellHeight,
      gap,
      canvasHeight: height,
      seedW: w,
      objective,
      minScale,
      allowCompress,
    });
    const effectiveScale = allowCompress ? clamp(Number(minScale) || 1, 0.1, 1) : 1;
    search = {
      probes: found.probes,
      minFeasibleW: found.minFeasibleW ?? null,
      found: found.found,
      objective,
      allowCompress,
      minScale: effectiveScale,
    };

    if (found.best) {
      w = found.best.w;
      h = found.best.h;
      measured = {
        width: found.best.measuredWidth,
        height: found.best.measuredHeight,
        source: found.best.measureSource,
        fits: found.best.fits,
        fullyVisible: found.best.fullyVisible,
        overflowX: found.best.overflowX,
        overflowY: found.best.overflowY,
        clippedText: found.best.clippedText,
        neededH: found.best.neededH,
        area: found.best.area,
        sum: found.best.sum,
      };
      method = found.found ? 'min-fit-search' : 'min-fit-search-clamped';
    }
  }

  w = clamp(w, 1, columns);
  h = clamp(h, 1, rows);

  return {
    w,
    h,
    cardType,
    method,
    canvas: { columns, rows, width, height, gap },
    cell: {
      width: Math.round(cellWidth * 100) / 100,
      height: Math.round(cellHeight * 100) / 100,
    },
    estimatedMinPx: {
      width: Math.round(minWidthPx),
      height: Math.round(minHeightPx),
    },
    presetAfterBoost,
    analysis,
    measured,
    search,
    spanPx: {
      width: Math.round(spanToPixels(w, cellWidth, gap) * 100) / 100,
      height: Math.round(spanToPixels(h, cellHeight, gap) * 100) / 100,
    },
  };
}

export { CARD_SPAN_PRESETS, computeCellSize, pixelsToSpan, pixelsToSpanNeeded, spanToPixels };
