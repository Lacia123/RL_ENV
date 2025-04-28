/**
 * 视觉空间评分系统
 * 
 * 评估八要素布局的视觉空间使用效率和内容适应性
 * 主要评分点：
 * 1. 空间利用率：有效元素应该占用整个空间的70%左右，过多或过少都会降低分数
 * 2. 内容适应性：内容应该尽量在一屏内显示完整，出现滚动条或显示不全会扣分
 */

/**
 * 计算空间利用率评分
 * @param {Object} domMeasurements - DOM测量数据
 * @param {Object} layout - 布局数据
 * @returns {Object} - 评分详情
 */
function calculateSpaceUtilizationScore(domMeasurements, layout) {
  if (!domMeasurements || !domMeasurements.container || !domMeasurements.elements) {
    return {
      score: 0,
      details: {
        utilizationRatio: "0.00",
        effectiveArea: 0,
        totalArea: 0,
        elementsCount: 0,
        recommendation: "无法计算空间利用率，测量数据不完整"
      }
    };
  }

  const { container, elements } = domMeasurements;
  const totalArea = (container.width || 0) * (container.height || 0);
  
  // 防止总面积为0
  if (totalArea <= 0) {
    return {
      score: 0,
      details: {
        utilizationRatio: "0.00",
        effectiveArea: 0,
        totalArea: 0,
        elementsCount: 0,
        recommendation: "无法计算空间利用率，容器尺寸无效"
      }
    };
  }
  
  // 计算有效元素（文本、图片、按钮）占用的总面积
  let effectiveArea = 0;
  let elementsCount = 0;
  
  elements.forEach(element => {
    if (!element) return;
    
    // 排除容器类元素，只计算实际内容元素
    if (element.type === 'text' || 
        element.type === 'p' || 
        element.type === 'span' || 
        element.type === 'h1' || 
        element.type === 'h2' || 
        element.type === 'h3' || 
        element.type === 'h4' || 
        element.type === 'h5' || 
        element.type === 'h6' || 
        element.type === 'img' || 
        element.type === 'image' || 
        element.type === 'button') {
      
      const width = element.width || 0;
      const height = element.height || 0;
      
      // 确保宽高为正数
      if (width > 0 && height > 0) {
        // 文字和按钮元素占空间权重为3倍
        let weightMultiplier = 1;
        if (element.type === 'text' || 
            element.type === 'p' || 
            element.type === 'span' || 
            element.type === 'h1' || 
            element.type === 'h2' || 
            element.type === 'h3' || 
            element.type === 'h4' || 
            element.type === 'h5' || 
            element.type === 'h6' || 
            element.type === 'button') {
          weightMultiplier = 3; // 文字和按钮元素的权重为3倍
        }
        
        effectiveArea += width * height * weightMultiplier;
        elementsCount++;
      }
    }
  });
  
  // 计算空间利用率，防止除以零
  const utilizationRatio = totalArea > 0 ? effectiveArea / totalArea : 0;
  
  // 计算评分，目标是40%左右的空间利用率（之前是70%）
  // 使用高斯分布函数，在40%时得分最高
  const optimalRatio = 0.4; // 最佳空间利用率从70%改为40%
  const variance = 0.1; // 减小方差，使评分曲线更陡峭（之前是0.15）
  
  // 安全计算指数函数，防止溢出
  let score;
  try {
    score = 100 * Math.exp(-Math.pow(utilizationRatio - optimalRatio, 2) / (2 * Math.pow(variance, 2)));
    
    // 验证分数是否为有效数字
    if (isNaN(score) || !isFinite(score)) {
      score = 0;
    }
  } catch (error) {
    console.error("计算评分时出错:", error);
    score = 0;
  }
  
  return {
    score: Math.round(score),
    details: {
      utilizationRatio: utilizationRatio.toFixed(2),
      effectiveArea,
      totalArea,
      elementsCount,
      recommendation: getUtilizationRecommendation(utilizationRatio)
    }
  };
}

/**
 * 获取空间利用率的建议
 * @param {number} ratio - 利用率
 * @returns {string} - 建议内容
 */
function getUtilizationRecommendation(ratio) {
  if (ratio < 0.25) {
    return "空间利用率过低，考虑增加元素大小、减少间距或添加更多内容";
  } else if (ratio < 0.35) {
    return "空间利用率略低，可以适当增加元素大小或减少部分间距";
  } else if (ratio <= 0.45) {
    return "空间利用率良好，处于最佳范围内";
  } else if (ratio < 0.55) {
    return "空间利用率略高，可以适当减小元素大小或增加部分间距";
  } else {
    return "空间利用率过高，考虑减小元素大小、增加间距或减少内容密度";
  }
}

/**
 * 计算内容适应性评分
 * @param {Object} domMeasurements - DOM测量数据
 * @param {Object} layout - 布局数据
 * @returns {Object} - 评分详情
 */
function calculateContentAdaptabilityScore(domMeasurements, layout) {
  if (!domMeasurements || !domMeasurements.container || !domMeasurements.elements) {
    return {
      score: 0,
      details: {
        verticalOverflowRatio: "0.00",
        horizontalOverflowRatio: "0.00",
        maxBottom: 0,
        maxRight: 0,
        containerHeight: 0,
        containerWidth: 0,
        overflowingElements: [],
        recommendation: "无法计算内容适应性，测量数据不完整"
      }
    };
  }
  
  const { container, elements } = domMeasurements;
  const containerWidth = container.width || 0;
  const containerHeight = container.height || 0;
  
  // 检查是否有内容超出容器
  let maxBottom = 0;
  let maxRight = 0;
  let overflowingElements = [];
  
  elements.forEach(element => {
    if (!element) return;
    
    const x = element.x || 0;
    const y = element.y || 0;
    const width = element.width || 0;
    const height = element.height || 0;
    
    const bottom = y + height;
    const right = x + width;
    
    if (bottom > maxBottom) maxBottom = bottom;
    if (right > maxRight) maxRight = right;
    
    if (containerHeight > 0 && containerWidth > 0 && 
        (bottom > containerHeight || right > containerWidth)) {
      overflowingElements.push({
        id: element.id,
        type: element.type,
        overflow: {
          vertical: bottom > containerHeight ? bottom - containerHeight : 0,
          horizontal: right > containerWidth ? right - containerWidth : 0
        }
      });
    }
  });
  
  // 计算垂直和水平溢出比例，防止除以零
  const verticalOverflowRatio = containerHeight > 0 ? 
    Math.max(0, (maxBottom - containerHeight) / containerHeight) : 0;
  const horizontalOverflowRatio = containerWidth > 0 ? 
    Math.max(0, (maxRight - containerWidth) / containerWidth) : 0;
  
  // 根据溢出情况计算评分
  // 没有溢出得100分，溢出越多分数越低
  let verticalScore, horizontalScore;
  
  try {
    verticalScore = 100 * Math.exp(-5 * verticalOverflowRatio);
    horizontalScore = 100 * Math.exp(-5 * horizontalOverflowRatio);
    
    // 验证分数是否为有效数字
    if (isNaN(verticalScore) || !isFinite(verticalScore)) {
      verticalScore = 0;
    }
    if (isNaN(horizontalScore) || !isFinite(horizontalScore)) {
      horizontalScore = 0;
    }
  } catch (error) {
    console.error("计算溢出评分时出错:", error);
    verticalScore = 0;
    horizontalScore = 0;
  }
  
  // 取垂直和水平方向的较低分数作为最终分数
  const score = Math.min(verticalScore, horizontalScore);
  
  return {
    score: Math.round(score),
    details: {
      verticalOverflowRatio: verticalOverflowRatio.toFixed(2),
      horizontalOverflowRatio: horizontalOverflowRatio.toFixed(2),
      maxBottom,
      maxRight,
      containerHeight,
      containerWidth,
      overflowingElements,
      recommendation: getAdaptabilityRecommendation(verticalOverflowRatio, horizontalOverflowRatio)
    }
  };
}

/**
 * 获取内容适应性的建议
 * @param {number} verticalRatio - 垂直溢出比例
 * @param {number} horizontalRatio - 水平溢出比例
 * @returns {string} - 建议内容
 */
function getAdaptabilityRecommendation(verticalRatio, horizontalRatio) {
  if (verticalRatio <= 0 && horizontalRatio <= 0) {
    return "内容完全适应当前视口，无需调整";
  }
  
  let recommendations = [];
  
  if (verticalRatio > 0) {
    if (verticalRatio > 0.5) {
      recommendations.push("垂直方向溢出严重，考虑减少内容高度、调整布局或使用更合适的视口尺寸");
    } else {
      recommendations.push("有轻微垂直溢出，可以减小元素高度或减少垂直间距");
    }
  }
  
  if (horizontalRatio > 0) {
    if (horizontalRatio > 0.3) {
      recommendations.push("水平方向溢出严重，考虑减少内容宽度或使用响应式布局");
    } else {
      recommendations.push("有轻微水平溢出，可以减小元素宽度或调整水平排列");
    }
  }
  
  return recommendations.join("；");
}

/**
 * 创建Canvas可视化布局
 * @param {Object} domMeasurements - DOM测量数据
 * @returns {HTMLCanvasElement} - 包含布局可视化的Canvas元素
 */
function createLayoutVisualization(domMeasurements) {
  if (!domMeasurements || !domMeasurements.container || !domMeasurements.elements || 
      typeof document === 'undefined') {
    return null;
  }
  
  try {
    const { container, elements } = domMeasurements;
    const containerWidth = container.width || 600;
    const containerHeight = container.height || 400;
    
    // 创建Canvas元素
    const canvas = document.createElement('canvas');
    const scale = 1; // 可以调整缩放比例
    
    canvas.width = containerWidth * scale;
    canvas.height = containerHeight * scale;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    // 绘制容器背景
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制容器边界
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    
    // 为不同类型的元素设置不同的颜色
    const colorMap = {
      text: 'rgba(52, 152, 219, 0.7)', // 蓝色
      p: 'rgba(52, 152, 219, 0.7)',
      span: 'rgba(52, 152, 219, 0.7)',
      h1: 'rgba(41, 128, 185, 0.8)',
      h2: 'rgba(41, 128, 185, 0.8)',
      h3: 'rgba(41, 128, 185, 0.8)',
      h4: 'rgba(41, 128, 185, 0.8)',
      h5: 'rgba(41, 128, 185, 0.8)',
      h6: 'rgba(41, 128, 185, 0.8)',
      image: 'rgba(46, 204, 113, 0.7)', // 绿色
      img: 'rgba(46, 204, 113, 0.7)',
      button: 'rgba(231, 76, 60, 0.7)', // 红色
      container: 'rgba(189, 195, 199, 0.4)', // 灰色
      div: 'rgba(189, 195, 199, 0.4)'
    };
    
    // 绘制每个元素
    elements.forEach(element => {
      if (!element) return;
      
      const x = (element.x || 0) * scale;
      const y = (element.y || 0) * scale;
      const width = (element.width || 0) * scale;
      const height = (element.height || 0) * scale;
      
      // 确保宽高为正数
      if (width <= 0 || height <= 0) return;
      
      // 获取元素颜色
      const color = colorMap[element.type] || 'rgba(149, 165, 166, 0.5)';
      
      // 填充元素背景
      ctx.fillStyle = color;
      ctx.fillRect(x, y, width, height);
      
      // 绘制元素边框
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, width, height);
      
      // 标注元素类型
      if (width > 40 && height > 20) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.font = '10px Arial';
        ctx.fillText(element.type || 'unknown', x + 5, y + 15);
      }
    });
    
    return canvas;
  } catch (error) {
    console.error("创建Canvas可视化时出错:", error);
    return null;
  }
}

/**
 * 主评分函数
 * @param {Object} domMeasurements - DOM测量数据
 * @param {Object} layout - 布局数据
 * @returns {Object} - 评分和建议
 */
export function evaluateVisualSpace(domMeasurements, layout) {
  try {
    // 计算各项评分
    const utilizationScore = calculateSpaceUtilizationScore(domMeasurements, layout);
    const adaptabilityScore = calculateContentAdaptabilityScore(domMeasurements, layout);
    
    // 综合评分（各占50%）
    const totalScore = Math.round((utilizationScore.score + adaptabilityScore.score) / 2);
    
    // 创建布局可视化
    const visualizationCanvas = typeof document !== 'undefined' ? 
      createLayoutVisualization(domMeasurements) : null;
    
    return {
      score: totalScore,
      categories: {
        spaceUtilization: utilizationScore,
        contentAdaptability: adaptabilityScore
      },
      visualization: visualizationCanvas,
      overallRecommendation: getOverallRecommendation(
        utilizationScore.score, 
        adaptabilityScore.score
      )
    };
  } catch (error) {
    console.error("评估视觉空间时出错:", error);
    return {
      score: 0,
      categories: {
        spaceUtilization: {
          score: 0,
          details: {
            utilizationRatio: "0.00",
            effectiveArea: 0,
            totalArea: 0,
            elementsCount: 0,
            recommendation: "评估空间利用率时出错"
          }
        },
        contentAdaptability: {
          score: 0,
          details: {
            verticalOverflowRatio: "0.00",
            horizontalOverflowRatio: "0.00",
            maxBottom: 0,
            maxRight: 0,
            containerHeight: 0,
            containerWidth: 0,
            overflowingElements: [],
            recommendation: "评估内容适应性时出错"
          }
        }
      },
      visualization: null,
      overallRecommendation: "评估视觉空间时发生错误，请检查控制台以获取更多信息。"
    };
  }
}

/**
 * 获取综合建议
 * @param {number} utilizationScore - 空间利用率评分
 * @param {number} adaptabilityScore - 内容适应性评分
 * @returns {string} - 综合建议
 */
function getOverallRecommendation(utilizationScore, adaptabilityScore) {
  if (utilizationScore >= 80 && adaptabilityScore >= 80) {
    return "布局效果良好，空间利用合理且内容完全适应视口";
  }
  
  let recommendations = [];
  
  if (utilizationScore < 60) {
    recommendations.push("需要优化空间利用率");
  } else if (utilizationScore < 80) {
    recommendations.push("可以适当调整空间利用率");
  }
  
  if (adaptabilityScore < 60) {
    recommendations.push("内容超出视口范围较多，需要调整布局或内容量");
  } else if (adaptabilityScore < 80) {
    recommendations.push("有少量内容可能超出视口，可以微调");
  }
  
  return recommendations.join("；");
}

export default evaluateVisualSpace; 