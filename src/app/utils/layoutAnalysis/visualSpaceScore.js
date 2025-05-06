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
 * @returns {Object} - 评分详情
 */
function calculateSpaceUtilizationScore(domMeasurements) {
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
  
  // 计算评分，目标是40%左右的空间利用率
  // 使用修改后的高斯分布函数，在40%时得分最高，但下降更平缓
  const optimalRatio = 0.4; // 最佳空间利用率
  const variance = 0.2; // 增大方差，使评分曲线更平缓
  
  // 考虑元素数量的影响 - 元素越多，对密度的容忍度越高
  const elementCountFactor = Math.min(1.5, 1 + (elementsCount / 50)); // 最多增加50%的容忍度
  const adjustedVariance = variance * elementCountFactor;
  
  // 安全计算指数函数，防止溢出
  let score;
  try {
    // 使用修改后的评分函数，确保分数不会太快降到0
    score = 100 * Math.exp(-Math.pow(utilizationRatio - optimalRatio, 2) / (2 * Math.pow(adjustedVariance, 2)));
    
    // 确保最低分数为20，而不是0
    score = Math.max(20, score);
    
    // 验证分数是否为有效数字
    if (isNaN(score) || !isFinite(score)) {
      score = 20; // 最低分数为20
    }
  } catch (error) {
    console.error("计算评分时出错:", error);
    score = 20; // 出错时也给20分而不是0分
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
    return "空间利用率较低，可以考虑增加元素大小或添加更多内容";
  } else if (ratio < 0.35) {
    return "空间利用率略低，但仍在合理范围内";
  } else if (ratio <= 0.45) {
    return "空间利用率良好，处于最佳范围内";
  } else if (ratio < 0.55) {
    return "空间利用率略高，但仍在合理范围内";
  } else if (ratio < 0.7) {
    return "空间利用率较高，可以考虑增加适当的间距";
  } else {
    return "空间利用率过高，建议增加间距或减少内容密度";
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
  // 没有溢出得100分，溢出越多分数越低，但不会降到20分以下
  let verticalScore, horizontalScore;
  
  // 计算内容占用的屏数
  const verticalScreens = maxBottom / containerHeight;
  const horizontalScreens = maxRight / containerWidth;
  
  try {
    // 基于屏数的评分系统，对刚出现滚动条的情况惩罚更大
    
    // 垂直方向评分
    if (verticalScreens <= 1) {
      // 一屏内显示，满分
      verticalScore = 100;
    } else if (verticalScreens <= 1.1) {
      // 刚超出一屏，分数快速下降
      // 从100分快速下降到75分
      verticalScore = 100 - 250 * (verticalScreens - 1);
    } else if (verticalScreens <= 2) {
      // 1.1到2屏，分数从75分缓慢下降到60分
      verticalScore = 75 - 15 * ((verticalScreens - 1.1) / 0.9);
    } else if (verticalScreens <= 3) {
      // 2到3屏，分数从60分缓慢下降到45分
      verticalScore = 60 - 15 * (verticalScreens - 2);
    } else {
      // 超过3屏，使用更平缓的指数函数
      verticalScore = 45 * Math.exp(-0.3 * (verticalScreens - 3));
      verticalScore = Math.max(20, verticalScore);
    }
    
    // 水平方向评分（水平滚动条通常更影响用户体验）
    if (horizontalScreens <= 1) {
      // 一屏内显示，满分
      horizontalScore = 100;
    } else if (horizontalScreens <= 1.05) {
      // 刚超出一屏，分数极速下降
      // 从100分极速下降到70分
      horizontalScore = 100 - 600 * (horizontalScreens - 1);
    } else if (horizontalScreens <= 1.5) {
      // 1.05到1.5屏，分数从70分缓慢下降到55分
      horizontalScore = 70 - 15 * ((horizontalScreens - 1.05) / 0.45);
    } else {
      // 超过1.5屏，使用更平缓的指数函数
      horizontalScore = 55 * Math.exp(-0.5 * (horizontalScreens - 1.5));
      horizontalScore = Math.max(20, horizontalScore);
    }
    
    // 验证分数是否为有效数字
    if (isNaN(verticalScore) || !isFinite(verticalScore)) {
      verticalScore = 20;
    }
    if (isNaN(horizontalScore) || !isFinite(horizontalScore)) {
      horizontalScore = 20;
    }
    
  } catch (error) {
    console.error("计算溢出评分时出错:", error);
    verticalScore = 20;
    horizontalScore = 20;
  }
  
  // 取垂直和水平方向的较低分数作为最终分数
  const score = Math.min(verticalScore, horizontalScore);
  
  return {
    score: Math.round(score),
    details: {
      verticalOverflowRatio: verticalOverflowRatio.toFixed(2),
      horizontalOverflowRatio: horizontalOverflowRatio.toFixed(2),
      verticalScreens: verticalScreens.toFixed(2),
      horizontalScreens: horizontalScreens.toFixed(2),
      maxBottom,
      maxRight,
      containerHeight,
      containerWidth,
      overflowingElements,
      recommendation: getAdaptabilityRecommendation(verticalScreens, horizontalScreens)
    }
  };
}

/**
 * 获取内容适应性的建议
 * @param {number} verticalScreens - 垂直方向占用的屏数
 * @param {number} horizontalScreens - 水平方向占用的屏数
 * @returns {string} - 建议内容
 */
function getAdaptabilityRecommendation(verticalScreens, horizontalScreens) {
  if (verticalScreens <= 1 && horizontalScreens <= 1) {
    return "内容完全适应当前视口，布局良好";
  }
  
  let recommendations = [];
  
  // 垂直方向建议
  if (verticalScreens <= 1) {
    // 不需要建议
  } else if (verticalScreens <= 1.1) {
    recommendations.push("内容刚刚超出视口高度，建议微调以避免出现垂直滚动条");
  } else if (verticalScreens <= 2) {
    recommendations.push("内容需要垂直滚动约 " + Math.round((verticalScreens - 1) * 100) + "% 的视口高度");
  } else if (verticalScreens <= 3) {
    recommendations.push("内容需要较多垂直滚动（约 " + Math.round(verticalScreens) + " 屏），考虑适当精简内容或增大视口");
  } else {
    recommendations.push("内容垂直方向过长（约 " + Math.round(verticalScreens) + " 屏），建议分页或大幅精简内容");
  }
  
  // 水平方向建议
  if (horizontalScreens <= 1) {
    // 不需要建议
  } else if (horizontalScreens <= 1.05) {
    recommendations.push("内容刚刚超出水平视口，强烈建议调整以避免水平滚动条");
  } else if (horizontalScreens <= 1.5) {
    recommendations.push("内容超出水平视口，需要水平滚动，建议调整布局");
  } else {
    recommendations.push("内容水平方向溢出较多（约 " + horizontalScreens.toFixed(1) + " 屏），建议使用响应式布局或减少内容宽度");
  }
  
  return recommendations.length > 0 ? recommendations.join("；") : "内容适应性良好";
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
    
    // 计算内容的实际尺寸（可能超出容器）
    let maxRight = 0;
    let maxBottom = 0;
    
    elements.forEach(element => {
      if (!element) return;
      const right = (element.x || 0) + (element.width || 0);
      const bottom = (element.y || 0) + (element.height || 0);
      
      if (right > maxRight) maxRight = right;
      if (bottom > maxBottom) maxBottom = bottom;
    });
    
    // 使用内容的实际尺寸和容器尺寸的较大值
    const containerWidth = container.width || 600;
    const containerHeight = container.height || 400;
    const canvasWidth = Math.max(containerWidth, maxRight);
    const canvasHeight = Math.max(containerHeight, maxBottom);
    
    // 创建Canvas元素
    const canvas = document.createElement('canvas');
    const scale = 1; // 可以调整缩放比例
    
    canvas.width = canvasWidth * scale;
    canvas.height = canvasHeight * scale;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    // 绘制整个内容区域背景
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制容器区域背景（稍微深一点的颜色）
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, containerWidth * scale, containerHeight * scale);
    
    // 绘制容器边界
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, containerWidth * scale, containerHeight * scale);
    
    // 添加网格线（每100像素一条）
    ctx.strokeStyle = 'rgba(200, 200, 200, 0.5)';
    ctx.lineWidth = 1;
    
    // 垂直网格线
    for (let x = 100; x < canvasWidth; x += 100) {
      ctx.beginPath();
      ctx.moveTo(x * scale, 0);
      ctx.lineTo(x * scale, canvasHeight * scale);
      ctx.stroke();
    }
    
    // 水平网格线
    for (let y = 100; y < canvasHeight; y += 100) {
      ctx.beginPath();
      ctx.moveTo(0, y * scale);
      ctx.lineTo(canvasWidth * scale, y * scale);
      ctx.stroke();
    }
    
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
    
    // 综合评分（各占50%），确保最低分数为20
    const totalScore = Math.max(20, Math.round((utilizationScore.score + adaptabilityScore.score) / 2));
    
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