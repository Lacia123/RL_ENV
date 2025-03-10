'use client';

/**
 * 分析布局性能
 * @param {Object} layout - 布局对象
 * @returns {Object} 性能分析结果
 */
export function analyzePerformance(layout) {
  const results = {
    score: 100,
    nodeCount: 0,
    depth: 0,
    renderComplexity: 'low',
    loadImpact: 'minimal',
    details: []
  };
  
  // 检查是否有布局
  if (!layout) {
    results.score = 0;
    results.details.push({
      type: 'warning',
      message: '无法分析空布局'
    });
    return results;
  }
  
  // 计算节点数和最大深度
  const metrics = calculateLayoutMetrics(layout);
  results.nodeCount = metrics.nodeCount;
  results.depth = metrics.maxDepth;
  
  // 评估渲染复杂度
  if (metrics.nodeCount > 100) {
    results.score -= 30;
    results.renderComplexity = 'high';
    results.details.push({
      type: 'warning',
      message: `布局包含${metrics.nodeCount}个节点，数量过多可能影响性能`
    });
  } else if (metrics.nodeCount > 50) {
    results.score -= 15;
    results.renderComplexity = 'medium';
    results.details.push({
      type: 'warning',
      message: `布局包含${metrics.nodeCount}个节点，节点数中等，但仍需注意性能`
    });
  } else {
    results.details.push({
      type: 'success',
      message: `布局包含${metrics.nodeCount}个节点，数量适中`
    });
  }
  
  // 评估嵌套深度
  if (metrics.maxDepth > 8) {
    results.score -= 25;
    results.details.push({
      type: 'warning',
      message: `DOM嵌套深度为${metrics.maxDepth}层，过深的嵌套可能影响渲染性能`
    });
  } else if (metrics.maxDepth > 5) {
    results.score -= 10;
    results.details.push({
      type: 'warning',
      message: `DOM嵌套深度为${metrics.maxDepth}层，较深的嵌套可能影响渲染性能`
    });
  } else {
    results.details.push({
      type: 'success',
      message: `DOM嵌套深度为${metrics.maxDepth}层，深度适中`
    });
  }
  
  // 分析资源使用
  const resourceImpact = analyzeResourceImpact(layout);
  
  if (resourceImpact.heavyElements > 3) {
    results.score -= 25;
    results.loadImpact = 'high';
    results.details.push({
      type: 'warning',
      message: `检测到${resourceImpact.heavyElements}个可能占用大量资源的元素`
    });
  } else if (resourceImpact.heavyElements > 0) {
    results.score -= 10;
    results.loadImpact = 'moderate';
    results.details.push({
      type: 'warning',
      message: `检测到${resourceImpact.heavyElements}个可能占用较多资源的元素`
    });
  }
  
  // 最终评分调整
  return {
    ...results,
    score: Math.max(0, Math.min(100, results.score))
  };
}

/**
 * 计算布局指标
 * @param {Object} element - 布局元素
 * @returns {Object} 布局指标
 */
function calculateLayoutMetrics(element) {
  let nodeCount = 0;
  let maxDepth = 0;
  
  const traverse = (node, depth = 0) => {
    if (!node) return;
    
    nodeCount++;
    maxDepth = Math.max(maxDepth, depth);
    
    if (node.children) {
      node.children.forEach(child => traverse(child, depth + 1));
    }
  };
  
  traverse(element);
  
  return { nodeCount, maxDepth };
}

/**
 * 分析资源影响
 * @param {Object} element - 布局元素
 * @returns {Object} 资源使用分析
 */
function analyzeResourceImpact(element) {
  let heavyElements = 0;
  
  const checkResourceUsage = (node) => {
    if (!node) return;
    
    // 检查可能占用资源的元素
    if (node.type === 'image' || node.type === 'background') {
      // 假设这些元素会占用资源
      heavyElements++;
    }
    
    // 检查复杂的动画或效果
    if (node.animation || node.transitionPreset ||
        (node.style && (node.style.includes('animation') || node.style.includes('transition')))) {
      heavyElements++;
    }
    
    // 递归处理子元素
    if (node.children) {
      node.children.forEach(checkResourceUsage);
    }
  };
  
  checkResourceUsage(element);
  
  return { heavyElements };
}