/**
 * 卡片整体形态 → 增长趋势配置（cardGrowthConfig.js）
 *
 * 用途：增长格子数检测接口不再由调用方输入倾向性向量列表，而是根据
 * 卡片的「整体形态」自动推导——配置文件名即形态注册表。
 *
 * 语义（与 gridGrowthCheck 增长趋势一致）：
 *   - 卡片整体形态是「上下」（纵向 column 布局，如：标题在上、内容在下、
 *     按钮贴底）时，倾向性 = [[0,1],[1,0]]：优先纵向加高，再横向加宽；
 *   - 卡片整体形态是「左右」（横向 row 布局，如：左侧信息 + 右侧头像/操作、
 *     左文右图）时，倾向性 = [[1,0],[0,1]]：优先横向加宽，再纵向加高。
 *
 * 形态判定来源（2026-09 核对组件 styleConfig 的 layoutModes/style.flexDirection）：
 *   上下（column）：contentSummaryCard、detailListCard、heroCard、listCard、metricCard、
 *     mistakesCard、pairedImageTextCard、showcaseCard、summaryCard、targetStatCard、
 *     textCard、textCenterCard、commentListCard、commentStyleListCard、confirmableCard、
 *     featureHeroCard、headerCard、headerPrecentCard、minimalistChartCard、
 *     hiringNewPersonCard、layeredActionCard、multiActionCard、productCard、simpleCard、
 *     titleCenterCard
 *   左右（row）：hiringNewTitleCard、hiringNewAvatarCard、hiringDarkNewAvatarCard
 *
 * 注意：键名使用「规范化卡片名」（去掉 card: 前缀），与 gridGrowthCheck 解析
 * 顶层标签后的 tagName 一致；新增卡片未配置时回退 DEFAULT_TENDENCY（上下）。
 */

/** 上下形态（column）默认增长趋势：先加行（纵向），再加列（横向） */
export const VERTICAL_TENDENCY = [
  [0, 1],
  [1, 0]
];

/** 左右形态（row）增长趋势：先加列（横向），再加行（纵向） */
export const HORIZONTAL_TENDENCY = [
  [1, 0],
  [0, 1]
];

/** 默认趋势：绝大多数卡片为上下形态，未配置的卡片按上下处理 */
export const DEFAULT_TENDENCY = VERTICAL_TENDENCY;

/** 卡片名（规范化，不带 card: 前缀）→ 增长趋势（自动推导倾向性） */
export const CARD_GROWTH_TENDENCY_MAP = {
  // ── 上下形态（column）：[[0,1],[1,0]] ──
  contentSummaryCard: VERTICAL_TENDENCY,
  detailListCard: VERTICAL_TENDENCY,
  heroCard: VERTICAL_TENDENCY,
  listCard: VERTICAL_TENDENCY,
  metricCard: VERTICAL_TENDENCY,
  mistakesCard: VERTICAL_TENDENCY,
  pairedImageTextCard: VERTICAL_TENDENCY,
  showcaseCard: VERTICAL_TENDENCY,
  summaryCard: VERTICAL_TENDENCY,
  targetStatCard: VERTICAL_TENDENCY,
  textCard: VERTICAL_TENDENCY,
  textCenterCard: VERTICAL_TENDENCY,
  commentListCard: VERTICAL_TENDENCY,
  commentStyleListCard: VERTICAL_TENDENCY,
  confirmableCard: VERTICAL_TENDENCY,
  featureHeroCard: VERTICAL_TENDENCY,
  headerCard: VERTICAL_TENDENCY,
  headerPrecentCard: VERTICAL_TENDENCY,
  minimalistChartCard: VERTICAL_TENDENCY,
  hiringNewPersonCard: VERTICAL_TENDENCY,
  layeredActionCard: VERTICAL_TENDENCY,
  multiActionCard: VERTICAL_TENDENCY,
  productCard: VERTICAL_TENDENCY,
  simpleCard: VERTICAL_TENDENCY,
  titleCenterCard: VERTICAL_TENDENCY,

  // ── 左右形态（row）：[[1,0],[0,1]] ──
  hiringNewTitleCard: HORIZONTAL_TENDENCY,
  hiringNewAvatarCard: HORIZONTAL_TENDENCY,
  hiringDarkNewAvatarCard: HORIZONTAL_TENDENCY
};

/**
 * 解析 psuip 顶层卡片名（规范化：去掉 card: 前缀；非卡片内容返回 null）
 *
 * @param {string} psuip - 裸 PSUIP 内容（grid 内内容）
 * @returns {string|null} 规范化卡片名（如 headerPrecentCard），解析不到返回 null
 */
export function resolveTopCardName(psuip) {
  const topTagMatch = String(psuip || '').trim().match(/^<([a-zA-Z][\w.:-]*)/);
  if (!topTagMatch) return null;
  const rawTag = topTagMatch[1];
  return rawTag.includes(':') ? rawTag.split(':').pop() : rawTag;
}

/**
 * 按 psuip 顶层卡片自动推导增长趋势（倾向性）
 *
 * @param {string} psuip - 裸 PSUIP 内容（grid 内内容）
 * @returns {{tendency: Array<[number,number]>, cardName: string|null, source: 'config'|'default'}}
 *   - tendency: 推导出的方向向量列表
 *   - cardName: 命中的卡片名（未识别返回 null）
 *   - source: 'config' = 配置命中；'default' = 未配置回退默认（上下）
 */
export function resolveGrowthTendency(psuip) {
  const cardName = resolveTopCardName(psuip);
  if (cardName && CARD_GROWTH_TENDENCY_MAP[cardName]) {
    return { tendency: CARD_GROWTH_TENDENCY_MAP[cardName], cardName, source: 'config' };
  }
  return { tendency: DEFAULT_TENDENCY, cardName, source: 'default' };
}
