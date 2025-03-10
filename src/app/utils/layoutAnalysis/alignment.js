'use client';

/**
 * 分析布局的对齐质量
 * @param {Object} layout - 布局对象
 * @returns {Object} 对齐分析结果
 */
export function analyzeAlignment(layout) {
  const results = {
    score: 100,
    horizontalAlignment: 'strong',
    verticalAlignment: 'strong',
    gridAlignment: 'partial',
    alignmentLines: [],
    details: []
  };
  
  // 如果没有布局或子元素，返回默认结果
  if (!layout || !layout.children || layout.children.length === 0) {
    results.details.push({
      type: 'warning',
      message: '布局为空或没有子元素，无法评估对齐'
    });
    return results;
  }
  
  // 分析水平对齐
  const horizontalLines = findHorizontalAlignmentLines(layout);
  
  // 分析垂直对齐
  const verticalLines = findVerticalAlignmentLines(layout);
  
  // 记录所有对齐线
  results.alignmentLines = [...horizontalLines, ...verticalLines];
  
  // 评估对齐强度
  if (horizontalLines.length < 2) {
    results.horizontalAlignment = 'weak';
    results.score -= 20;
    results.details.push({
      type: 'warning',
      message: '水平对齐较弱，元素之间缺乏明确的对齐关系'
    });
  } else if (horizontalLines.length >= 4) {
    results.details.push({
      type: 'success',
      message: '水平对齐良好，创建了清晰的视觉结构'
    });
  }
  
  if (verticalLines.length < 2) {
    results.verticalAlignment = 'weak';
    results.score -= 20;
    results.details.push({
      type: 'warning',
      message: '垂直对齐较弱，缺乏明确的列结构'
    });
  } else if (verticalLines.length >= 3) {
    results.details.push({
      type: 'success',
      message: '垂直对齐良好，形成了有效的视觉列'
    });
  }
  
  // 检查元素是否遵循网格
  const gridScore = evaluateGridAlignment(layout, horizontalLines, verticalLines);
  if (gridScore < 70) {
    results.gridAlignment = 'poor';
    results.score -= 15;
    results.details.push({
      type: 'warning',
      message: '元素没有遵循一致的网格系统，影响整体秩序感'
    });
  } else if (gridScore > 85) {
    results.gridAlignment = 'strong';
    results.details.push({
      type: 'success',
      message: '元素遵循了一致的网格系统，提高了布局的专业性'
    });
  }
  
  // 确保分数在0-100范围内
  results.score = Math.max(0, Math.min(100, results.score));
  
  return results;
}

/**
 * 查找水平对齐线
 * @param {Object} layout - 布局对象
 * @returns {Array} 水平对齐线数组
 */
function findHorizontalAlignmentLines(layout) {
  const lines = new Set();
  const threshold = 2; // 最小对齐元素数量
  
  // 递归查找所有元素的位置
  const elements = [];
  collectElements(layout, elements);
  
  // 查找顶部对齐
  const topEdges = elements.map(el => el.position?.y || 0);
  findAlignmentPositions(topEdges, threshold).forEach(pos => 
    lines.add({orientation: 'horizontal', position: pos, type: 'top'}));
  
  // 查找底部对齐
  const bottomEdges = elements.map(el => {
    const pos = el.position?.y || 0;
    const height = el.height || 0;
    return pos + height;
  });
  findAlignmentPositions(bottomEdges, threshold).forEach(pos => 
    lines.add({orientation: 'horizontal', position: pos, type: 'bottom'}));
  
  // 查找中心对齐
  const centerPoints = elements.map(el => {
    const pos = el.position?.y || 0;
    const height = el.height || 0;
    return pos + (height / 2);
  });
  findAlignmentPositions(centerPoints, threshold).forEach(pos => 
    lines.add({orientation: 'horizontal', position: pos, type: 'center'}));
  
  return Array.from(lines);
}

/**
 * 查找垂直对齐线
 * @param {Object} layout - 布局对象
 * @returns {Array} 垂直对齐线数组
 */
function findVerticalAlignmentLines(layout) {
  const lines = new Set();
  const threshold = 2; // 最小对齐元素数量
  
  // 递归查找所有元素的位置
  const elements = [];
  collectElements(layout, elements);
  
  // 查找左侧对齐
  const leftEdges = elements.map(el => el.position?.x || 0);
  findAlignmentPositions(leftEdges, threshold).forEach(pos => 
    lines.add({orientation: 'vertical', position: pos, type: 'left'}));
  
  // 查找右侧对齐
  const rightEdges = elements.map(el => {
    const pos = el.position?.x || 0;
    const width = el.width || 0;
    return pos + width;
  });
  findAlignmentPositions(rightEdges, threshold).forEach(pos => 
    lines.add({orientation: 'vertical', position: pos, type: 'right'}));
  
  // 查找中心对齐
  const centerPoints = elements.map(el => {
    const pos = el.position?.x || 0;
    const width = el.width || 0;
    return pos + (width / 2);
  });
  findAlignmentPositions(centerPoints, threshold).forEach(pos => 
    lines.add({orientation: 'vertical', position: pos, type: 'center'}));
  
  return Array.from(lines);
}

/**
 * 收集布局中的所有元素
 * @param {Object} element - 布局元素
 * @param {Array} elements - 元素收集数组
 */
function collectElements(element, elements, position = { x: 0, y: 0 }) {
  if (!element) return;
  
  // 计算绝对位置
  const elementPos = {
    x: position.x + (element.position?.x || 0),
    y: position.y + (element.position?.y || 0)
  };
  
  // 添加元素到数组
  elements.push({
    ...element,
    position: elementPos
  });
  
  // 递归处理子元素
  if (element.children) {
    element.children.forEach(child => {
      collectElements(child, elements, elementPos);
    });
  }
}

/**
 * 查找对齐位置
 * @param {Array} positions - 位置数组
 * @param {number} threshold - 最小对齐数量阈值
 * @returns {Array} 对齐位置数组
 */
function findAlignmentPositions(positions, threshold) {
  const tolerance = 1; // 允许的误差范围
  const positionCounts = {};
  
  // 计算每个位置出现的次数
  positions.forEach(pos => {
    // 四舍五入到整数以处理小数误差
    const roundedPos = Math.round(pos);
    positionCounts[roundedPos] = (positionCounts[roundedPos] || 0) + 1;
  });
  
  // 返回超过阈值的位置
  return Object.entries(positionCounts)
    .filter(([_, count]) => count >= threshold)
    .map(([pos, _]) => parseFloat(pos));
}

/**
 * 评估网格对齐
 * @param {Object} layout - 布局对象
 * @param {Array} horizontalLines - 水平对齐线
 * @param {Array} verticalLines - 垂直对齐线
 * @returns {number} 网格对齐评分(0-100)
 */
function evaluateGridAlignment(layout, horizontalLines, verticalLines) {
  // 如果有足够的对齐线，可能形成网格
  if (horizontalLines.length >= 3 && verticalLines.length >= 3) {
    // 简单实现：检查是否有规律的间距
    const horizontalSpacing = checkEvenSpacing(horizontalLines);
    const verticalSpacing = checkEvenSpacing(verticalLines);
    
    if (horizontalSpacing && verticalSpacing) {
      return 90; // 强网格对齐
    } else if (horizontalSpacing || verticalSpacing) {
      return 75; // 部分网格对齐
    }
  }
  
  // 对齐线不足或间距不规律
  return 60;
}

/**
 * 检查间距是否均匀
 * @param {Array} lines - 对齐线数组
 * @returns {boolean} 是否有均匀间距
 */
function checkEvenSpacing(lines) {
  if (lines.length < 3) return false;
  
  // 对位置排序
  const positions = lines
    .map(line => line.position || 0)
    .sort((a, b) => a - b);
  
  // 计算间距
  const spacings = [];
  for (let i = 1; i < positions.length; i++) {
    spacings.push(positions[i] - positions[i-1]);
  }
  
  // 检查间距是否接近
  const avgSpacing = spacings.reduce((sum, val) => sum + val, 0) / spacings.length;
  const tolerance = avgSpacing * 0.2; // 允许20%的误差
  
  return spacings.every(spacing => 
    Math.abs(spacing - avgSpacing) <= tolerance);
}