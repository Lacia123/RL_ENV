/**
 * 启发式奖励（无需专家偏好数据）
 *
 * 输入：
 * - candidatePsuip：模型生成的 PSUIP
 * - goldPsuip：data 中人工标注结构
 * - sourceMarkdown：原始内容文本（覆盖度）
 * - visualScore：可选，现有 visualSpaceScore（0-100）
 *
 * 输出：0-100 的 dense reward + 分项明细
 */

import {
  extractTopLevelCards,
  extractShowcaseCardBlocks,
  extractLayoutSkeleton,
  extractContentKeywords,
  multisetF1,
} from './psuipStructure.js';
import { buildShowcaseCardMask, evaluateCardMaskViolations } from './cardMask.js';

function clamp01(x) {
  return Math.max(0, Math.min(1, x));
}

function score01to100(x) {
  return Math.round(clamp01(x) * 1000) / 10;
}

/**
 * 比较 showcaseCard 块模式（preview/default、中间形态家族）
 */
function compareShowcasePatterns(goldBlocks, candBlocks) {
  if (goldBlocks.length === 0 && candBlocks.length === 0) return 1;
  if (goldBlocks.length === 0 || candBlocks.length === 0) {
    return candBlocks.length === 0 ? 0.3 : 0.2;
  }

  // 布局模式直方图
  const hist = (blocks) => {
    const h = { preview: 0, default: 0 };
    blocks.forEach((b) => {
      h[b.layoutMode] = (h[b.layoutMode] || 0) + 1;
    });
    return h;
  };
  const modeF1 = multisetF1(hist(goldBlocks), hist(candBlocks));

  // 中间形态：list / dualImage / loadingCta / preview
  const kindHist = (blocks) => {
    const h = {};
    blocks.forEach((b) => {
      let kind = 'empty';
      if (b.layoutMode === 'preview') kind = 'preview';
      else if (b.hasLoadingButton) kind = 'loadingCta';
      else if (b.middleKinds.includes('doubleImageItem')) kind = 'dualImage';
      else if (
        b.middleKinds.includes('imageTextItem') ||
        b.middleKinds.includes('commonListItem')
      ) {
        kind = 'listMedia';
      }
      h[kind] = (h[kind] || 0) + 1;
    });
    return h;
  };
  const kindF1 = multisetF1(kindHist(goldBlocks), kindHist(candBlocks));

  // 数量接近度
  const countRatio =
    1 -
    Math.min(
      1,
      Math.abs(goldBlocks.length - candBlocks.length) / Math.max(goldBlocks.length, 1)
    );

  return clamp01(0.4 * modeF1 + 0.4 * kindF1 + 0.2 * countRatio);
}

function compareLayoutSkeleton(goldSkel, candSkel) {
  let score = 0;
  let n = 0;
  const pair = (a, b, weight = 1) => {
    n += weight;
    if (!!a === !!b) score += weight;
    else if (typeof a === 'number' && typeof b === 'number') {
      const denom = Math.max(a, b, 1);
      score += weight * (1 - Math.min(1, Math.abs(a - b) / denom));
    }
  };
  pair(goldSkel.hasRoot, candSkel.hasRoot, 1);
  pair(goldSkel.rowCount, candSkel.rowCount, 1.5);
  pair(goldSkel.columnCount, candSkel.columnCount, 1.5);
  // grid 为可选增强：标注无 grid 时不强制
  if (goldSkel.gridItemCount > 0 || candSkel.gridItemCount > 0) {
    pair(goldSkel.gridItemCount, candSkel.gridItemCount, 0.5);
  }
  return n === 0 ? 0.5 : clamp01(score / n);
}

function contentCoverage(sourceMd, candidatePsuip) {
  const keywords = extractContentKeywords(sourceMd);
  if (keywords.length === 0) return 0.5;
  const hay = String(candidatePsuip).toLowerCase();
  let hit = 0;
  keywords.forEach((k) => {
    if (hay.includes(k)) hit += 1;
  });
  return clamp01(hit / Math.min(keywords.length, 40));
}

/**
 * @param {object} input
 * @param {string} input.candidatePsuip
 * @param {string} input.goldPsuip
 * @param {string} [input.sourceMarkdown]
 * @param {number|object} [input.visualScore] 数字或 { score }
 * @param {object} [input.weights]
 * @returns {{ reward: number, details: object }}
 */
export function computeHeuristicReward(input = {}) {
  const {
    candidatePsuip = '',
    goldPsuip = '',
    sourceMarkdown = '',
    visualScore = null,
    weights = {},
  } = input;

  const w = {
    cardSet: weights.cardSet ?? 0.28,
    showcasePattern: weights.showcasePattern ?? 0.22,
    layoutSkeleton: weights.layoutSkeleton ?? 0.12,
    contentCoverage: weights.contentCoverage ?? 0.18,
    maskCompliance: weights.maskCompliance ?? 0.12,
    visual: weights.visual ?? 0.08,
  };

  const goldCards = extractTopLevelCards(goldPsuip);
  const candCards = extractTopLevelCards(candidatePsuip);
  const cardSetScore = multisetF1(goldCards.counts, candCards.counts);

  const goldBlocks = extractShowcaseCardBlocks(goldPsuip);
  const candBlocks = extractShowcaseCardBlocks(candidatePsuip);
  const showcasePatternScore = compareShowcasePatterns(goldBlocks, candBlocks);

  const layoutSkeletonScore = compareLayoutSkeleton(
    extractLayoutSkeleton(goldPsuip),
    extractLayoutSkeleton(candidatePsuip)
  );

  const coverageScore = contentCoverage(sourceMarkdown, candidatePsuip);

  const mask = buildShowcaseCardMask();
  const maskEval = evaluateCardMaskViolations(candidatePsuip, mask);
  const maskComplianceScore = clamp01(
    maskEval.allowedRatio * (maskEval.slotConflicts.length === 0 ? 1 : 0.7)
  );

  let visualNorm = 0.5;
  if (visualScore != null) {
    const raw = typeof visualScore === 'number' ? visualScore : visualScore.score;
    if (typeof raw === 'number' && !Number.isNaN(raw)) {
      visualNorm = clamp01(raw / 100);
    }
  }

  // 无 visual 时把权重摊给结构项
  let useW = { ...w };
  if (visualScore == null) {
    const v = useW.visual;
    useW.visual = 0;
    const rest = 1 - v;
    ['cardSet', 'showcasePattern', 'layoutSkeleton', 'contentCoverage', 'maskCompliance'].forEach(
      (k) => {
        useW[k] = useW[k] / (1 - w.visual || 1) * rest / ((1 - w.visual) || 1) * (1 - w.visual);
      }
    );
    // 简化：均匀重归一
    const sum =
      useW.cardSet +
      useW.showcasePattern +
      useW.layoutSkeleton +
      useW.contentCoverage +
      useW.maskCompliance;
    if (sum > 0) {
      useW.cardSet /= sum;
      useW.showcasePattern /= sum;
      useW.layoutSkeleton /= sum;
      useW.contentCoverage /= sum;
      useW.maskCompliance /= sum;
    }
  }

  const combined01 = clamp01(
    useW.cardSet * cardSetScore +
      useW.showcasePattern * showcasePatternScore +
      useW.layoutSkeleton * layoutSkeletonScore +
      useW.contentCoverage * coverageScore +
      useW.maskCompliance * maskComplianceScore +
      useW.visual * visualNorm
  );

  // 硬惩罚：大量使用被 mask 的 card
  const hardPenalty = Math.min(0.35, (maskEval.violationCount || 0) * 0.05);
  const reward01 = clamp01(combined01 - hardPenalty);

  return {
    reward: score01to100(reward01),
    details: {
      components: {
        cardSet: score01to100(cardSetScore),
        showcasePattern: score01to100(showcasePatternScore),
        layoutSkeleton: score01to100(layoutSkeletonScore),
        contentCoverage: score01to100(coverageScore),
        maskCompliance: score01to100(maskComplianceScore),
        visual: score01to100(visualNorm),
      },
      weights: useW,
      hardPenalty: score01to100(hardPenalty),
      goldCardCounts: goldCards.counts,
      candidateCardCounts: candCards.counts,
      maskEvaluation: maskEval,
      mask,
    },
  };
}

/**
 * 便捷：对候选列表批量打分
 */
export function rankByHeuristicReward(candidates, shared) {
  return (candidates || [])
    .map((candidatePsuip, index) => ({
      index,
      ...computeHeuristicReward({ ...shared, candidatePsuip }),
    }))
    .sort((a, b) => b.reward - a.reward);
}
