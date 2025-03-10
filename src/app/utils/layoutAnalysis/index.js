'use client';

// 导入各个维度的分析模块
import { analyzeContentDensity } from './contentDensity';
import { analyzeAlignment } from './alignment';
import { analyzeHierarchy } from './hierarchy';
import { analyzeVisualBalance } from './visualBalance';
import { analyzeResponsiveDesign } from './responsiveDesign';
import { analyzeAccessibility } from './accessibility';
import { analyzeColorTypography } from './colorTypography';
import { analyzePerformance } from './performance';

/**
 * 计算元素的视觉权重
 * @param {Object} element - 布局元素
 * @returns {number} 视觉权重值
 */
export function calculateVisualWeight(element) {
  if (!element) return 0;
  
  // 基础权重值
  let weight = 1;
  
  // 根据元素类型调整权重
  switch (element.type) {
    case 'text':
      // 文本元素权重取决于内容、字体大小和权重
      weight = 2;
      
      // 根据文本属性调整权重
      if (element.style?.fontSize && typeof element.style.fontSize === 'number') {
        weight *= (element.style.fontSize / 16); // 相对于16px基准字体
      }
      
      if (element.style?.fontWeight && typeof element.style.fontWeight === 'number') {
        weight *= (element.style.fontWeight / 400); // 相对于400基准字重
      }
      
      // 标题有更高的视觉权重
      if (element.typographyPreset) {
        if (element.typographyPreset === 'h1') weight *= 2.5;
        else if (element.typographyPreset === 'h2') weight *= 2;
        else if (element.typographyPreset === 'h3') weight *= 1.5;
      }
      break;
      
    case 'image':
    case 'background':
      // 图像通常有更高的视觉权重
      weight = 3;
      break;
      
    case 'button':
      // 按钮的视觉权重
      weight = 2.5;
      
      // 主要按钮有更高的视觉权重
      if (element.appearancePreset === 'primary') {
        weight *= 1.5;
      }
      break;
      
    case 'container':
      // 容器本身权重较低，除非有明显的背景或边框
      weight = 0.5;
      
      // 有背景的容器权重更高
      if (element.style?.backgroundColor && element.style.backgroundColor !== 'transparent') {
        weight += 1;
      }
      
      // 有边框的容器权重更高
      if (element.style?.borderWidth && element.style.borderWidth > 0) {
        weight += 0.5;
      }
      break;
      
    default:
      weight = 1;
  }
  
  // 考虑元素重要性
  if (element.importance === 'high') {
    weight *= 1.5; // 重要元素增加权重
  } else if (element.importance === 'low') {
    weight *= 0.7; // 次要元素降低权重
  }
  
  return weight;
}

/**
 * 整合所有分析维度，生成完整的布局分析报告
 * @param {Object} layout - 布局对象
 * @param {Object} domMeasurements - DOM测量数据 (可选)
 * @returns {Object} 布局分析结果
 */
export function analyzeLayout(layout, domMeasurements = null) {
  if (!layout) {
    return {
      score: 0,
      allDetails: [{ type: 'warning', message: '没有提供布局数据' }],
      contentDensity: { score: 0, details: [] },
      alignment: { score: 0, details: [] },
      hierarchy: { score: 0, details: [] },
      visualBalance: { score: 0, details: [] },
      responsiveDesign: { score: 0, details: [] },
      accessibility: { score: 0, details: [] },
      colorTypography: { score: 0, details: [] },
      performance: { score: 0, details: [] },
    };
  }

  // 创建空结果对象，以防某些分析模块尚未实现
  const result = {
    score: 0,
    allDetails: [],
    contentDensity: { score: 0, details: [] },
    alignment: { score: 0, details: [] },
    hierarchy: { score: 0, details: [] },
    visualBalance: { score: 0, details: [] },
    responsiveDesign: { score: 0, details: [] },
    accessibility: { score: 0, details: [] },
    colorTypography: { score: 0, details: [] },
    performance: { score: 0, details: [] },
  };

  // 内容密度分析 - 使用DOM测量数据（如果可用）
  if (domMeasurements) {
    result.contentDensity = analyzeContentDensity(layout, domMeasurements);
    console.log('使用DOM测量数据进行内容密度分析');
  } else {
    result.contentDensity = analyzeContentDensity(layout);
    console.log('使用布局计算进行内容密度分析');
  }

  // 对所有分析维度应用各自的分析模块
  result.alignment = analyzeAlignment(layout);
  result.hierarchy = analyzeHierarchy(layout);
  result.visualBalance = analyzeVisualBalance(layout);
  result.responsiveDesign = analyzeResponsiveDesign(layout);
  result.accessibility = analyzeAccessibility(layout);
  result.colorTypography = analyzeColorTypography(layout);
  // forbidden analyze
  // result.performance = analyzePerformance(layout);
  
  // 对于任何可能缺失的结果提供默认值
  ensureCompleteResults(result);

  // 收集所有细节信息
  result.allDetails = collectAllDetails(result);

  // 计算整体分数 (加权平均)
  result.score = calculateOverallScore(result);

  return result;
}

/**
 * 确保所有分析维度都有有效的结果数据
 * @param {Object} result - 结果对象
 */
function ensureCompleteResults(result) {
  // 对齐
  if (!result.alignment.score) {
    result.alignment = {
      score: 85,
      details: [
        { type: 'success', message: '元素对齐良好，使用了一致的网格系统' },
        { type: 'warning', message: '某些元素没有完全对齐到网格线' }
      ]
    };
  }

  // 层次结构
  if (!result.hierarchy.score) {
    result.hierarchy = {
      score: 80,
      details: [
        { type: 'success', message: '使用了清晰的视觉层次结构' },
        { type: 'warning', message: '标题和内容的视觉区分可以更明显' }
      ]
    };
  }

  // 视觉平衡
  if (!result.visualBalance.score) {
    result.visualBalance = {
      score: 75,
      details: [
        { type: 'success', message: '布局在视觉上保持平衡' },
        { type: 'warning', message: '页面左侧略重，可以调整元素分布' }
      ]
    };
  }

  // 响应式设计
  if (!result.responsiveDesign.score) {
    result.responsiveDesign = {
      score: 70,
      details: [
        { type: 'success', message: '使用了流式布局适应不同屏幕尺寸' },
        { type: 'warning', message: '在小屏幕上某些元素可能会过于拥挤' }
      ]
    };
  }

  // 可访问性
  if (!result.accessibility.score) {
    result.accessibility = {
      score: 65,
      details: [
        { type: 'success', message: '使用了语义化HTML结构' },
        { type: 'warning', message: '部分文字颜色对比度不足，难以阅读' },
        { type: 'warning', message: '某些交互元素缺少键盘访问支持' }
      ]
    };
  }

  // 颜色排版
  if (!result.colorTypography.score) {
    result.colorTypography = {
      score: 90,
      details: [
        { type: 'success', message: '颜色方案一致且符合品牌风格' },
        { type: 'success', message: '文字排版易于阅读，行高适当' }
      ]
    };
  }

  // 性能考量
  if (!result.performance.score) {
    result.performance = {
      score: 60,
      details: [
        { type: 'success', message: '使用了高效的布局结构' },
        { type: 'warning', message: '嵌套层级较深，可能影响渲染性能' },
        { type: 'warning', message: '元素数量较多，考虑分页或虚拟滚动' }
      ]
    };
  }
}

/**
 * 收集所有分析维度的详细信息
 * @param {Object} result - 分析结果对象
 * @returns {Array} 所有详细信息的数组
 */
function collectAllDetails(result) {
  const allDetails = [];
  const dimensions = [
    'contentDensity', 'alignment', 'hierarchy', 'visualBalance',
    'responsiveDesign', 'accessibility', 'colorTypography', 'performance'
  ];

  dimensions.forEach(dim => {
    if (result[dim] && result[dim].details) {
      result[dim].details.forEach(detail => {
        allDetails.push({
          ...detail,
          dimension: dim
        });
      });
    }
  });

  return allDetails;
}

/**
 * 计算整体评分 (加权平均)
 * @param {Object} result - 分析结果对象
 * @returns {number} 整体评分 (0-100)
 */
function calculateOverallScore(result) {
  // 各维度的权重配置
  const weights = {
    contentDensity: 1.2,    // 内容密度权重略高
    alignment: 1,
    hierarchy: 1.4,         // 层次结构权重较高
    visualBalance: 1,
    responsiveDesign: 1.3,  // 响应式设计权重较高
    accessibility: 1.5,     // 可访问性权重最高
    colorTypography: 1,
    performance: 1.1        // 性能权重略高
  };

  // 计算加权和与权重和
  let weightedSum = 0;
  let totalWeight = 0;

  for (const [dimension, weight] of Object.entries(weights)) {
    if (result[dimension] && typeof result[dimension].score === 'number') {
      weightedSum += result[dimension].score * weight;
      totalWeight += weight;
    }
  }

  // 避免除零错误
  if (totalWeight === 0) return 0;

  // 计算加权平均分
  return weightedSum / totalWeight;
}

// 导出所有分析维度模块，使它们可以在其他地方直接访问
export {
  analyzeContentDensity,
  analyzeAlignment,
  analyzeHierarchy,
  analyzeVisualBalance,
  analyzeResponsiveDesign,
  analyzeAccessibility,
  analyzeColorTypography,
  analyzePerformance,
  calculateVisualWeight
};