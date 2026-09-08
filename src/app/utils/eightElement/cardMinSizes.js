/**
 * 卡片最小尺寸映射表（cardMinSizes.js）
 *
 * 每种卡片类型可配置「最小宽度 / 最小高度」，单位为【格】（列数 × 行数），
 * 与 /api/markdown-layout-check 接口的 width/height 入参语义一致——
 * 模型不关心像素，只关心"几行几列"级别的格子尺寸。
 *
 * 校验规则（由 gridValidity.checkGridLayoutValidity 调用）：
 *   模型分配给卡片的网格（width × height）小于该卡片类型的最小格数时
 *   （任一维度不足即算），直接判定非法：不渲染、不做 DOM 检测（短路），
 *   报错作为 details.messages 的第一条返回。
 *
 * 约定：
 *   - key = psuip 中卡片的标签名，如 <textCard> → "textCard"；
 *     <card:headerPrecentCard> 这类带命名空间前缀的取 "headerPrecentCard"
 *   - 未配置（或值为空对象）的卡片类型不做限制，保持原有行为，向后兼容
 *   - minW = 最小宽度（列数），minH = 最小高度（行数），仅配置其一也生效
 *
 * 下表为现有在 grid 布局中实际使用过的全部卡片（来源：layout-check/test-cases.json
 * 用例 + src 中 <layout:grid>/<grid:item> 块），统一按 2 列 × 1 行 作为最小格数；
 * 新增卡片按需在此追加。
 */
export const CARD_MIN_SIZE_MAP = {
    commonStyleList:             { minW: 2, minH: 1 },
    commonStyleServiceListCompact: { minW: 2, minH: 1 },
    commonStyleServiceListDesc:  { minW: 2, minH: 1 },
    contentSummaryCard:          { minW: 2, minH: 1 },
    heroCard:                    { minW: 2, minH: 1 },
    metricCard:                  { minW: 2, minH: 1 },
    mistakesCard:                { minW: 2, minH: 1 },
    pairedImageTextCard:         { minW: 2, minH: 1 },
    showcaseCard:                { minW: 2, minH: 1 },
    summaryCard:                 { minW: 2, minH: 1 },
    targetStatCard:              { minW: 2, minH: 1 },
    textCard:                    { minW: 2, minH: 1 },
    textCenterCard:              { minW: 2, minH: 1 },
};
