'use client';

import { calculateVisualWeight } from './index';

/**
 * 计算布局的视觉平衡度
 * @param {Object} layout - 布局对象
 * @returns {Object} 视觉平衡分析结果
 */
export function analyzeVisualBalance(layout) {
  const results = {
    score: 100,
    horizontalBalance: 1, // 1表示完美平衡，0表示完全不平衡
    verticalBalance: 1,
    quadrantWeights: [0, 0, 0, 0], // 左上、右上、左下、右下四个象限的权重
    dominantAreaIndex: -1, // 最重的象限索引
    details: []
  };
  
  // 如果没有布局或子元素，返回默认结果
  if (!layout || !layout.children || layout.children.length === 0) {
    results.details.push({
      type: 'warning',
      message: '布局为空或没有子元素，无法评估视觉平衡'
    });
    return results;
  }
  
  // 创建一个虚拟画布来计算视觉权重分布
  const virtualCanvas = createVirtualCanvas();
  
  // 计算每个象限的视觉权重
  populateVirtualCanvas(layout, virtualCanvas);
  
  // 计算视觉质心
  const centerOfGravity = calculateCenterOfGravity(virtualCanvas);
  
  // 根据理想中心点(0.5, 0.5)计算平衡度
  const idealCenter = { x: 0.5, y: 0.5 }; // 理想情况下，重心应该在画布中央
  const horizontalDeviation = Math.abs(centerOfGravity.x - idealCenter.x) * 2; // 范围0到1
  const verticalDeviation = Math.abs(centerOfGravity.y - idealCenter.y) * 2; // 范围0到1
  
  results.horizontalBalance = 1 - horizontalDeviation;
  results.verticalBalance = 1 - verticalDeviation;
  
  // 计算四个象限的权重
  const quadrantWeights = calculateQuadrantWeights(virtualCanvas);
  results.quadrantWeights = quadrantWeights;
  
  // 找出权重最大的象限
  const maxWeight = Math.max(...quadrantWeights);
  results.dominantAreaIndex = quadrantWeights.indexOf(maxWeight);
  
  // 根据权重分布计算不平衡程度
  const totalWeight = quadrantWeights.reduce((sum, weight) => sum + weight, 0);
  const idealQuadrantWeight = totalWeight / 4; // 理想情况下每个象限占25%
  
  // 计算各象限与理想权重的偏差
  const weightDeviations = quadrantWeights.map(weight => 
    Math.abs(weight - idealQuadrantWeight) / idealQuadrantWeight);
  
  // 总偏差(范围0-1)
  const totalDeviation = weightDeviations.reduce((sum, dev) => sum + dev, 0) / 4;
  
  // 根据总偏差计算视觉平衡得分
  results.score = Math.max(0, Math.min(100, 100 - (totalDeviation * 100)));
  
  // 添加详细反馈
  if (results.score >= 80) {
    results.details.push({
      type: 'success',
      message: '布局具有良好的视觉平衡，各区域权重分布均匀'
    });
  } else if (results.score >= 60) {
    results.details.push({
      type: 'success',
      message: '布局视觉平衡度尚可，但某些区域可能略重'
    });
    
    // 指出最重的区域
    const quadrantNames = ['左上', '右上', '左下', '右下'];
    if (results.dominantAreaIndex >= 0) {
      results.details.push({
        type: 'warning',
        message: `${quadrantNames[results.dominantAreaIndex]}区域视觉权重较大，考虑平衡调整`
      });
    }
  } else {
    results.details.push({
      type: 'warning',
      message: '布局视觉严重不平衡，需要重新分配元素权重'
    });
    
    // 提供更具体的建议
    if (horizontalDeviation > 0.3) {
      const direction = centerOfGravity.x > 0.5 ? '右' : '左';
      results.details.push({
        type: 'warning',
        message: `布局在水平方向偏${direction}，考虑向${direction === '右' ? '左' : '右'}侧添加平衡元素`
      });
    }
    
    if (verticalDeviation > 0.3) {
      const direction = centerOfGravity.y > 0.5 ? '下' : '上';
      results.details.push({
        type: 'warning',
        message: `布局在垂直方向偏${direction}，考虑向${direction === '下' ? '上' : '下'}侧添加平衡元素`
      });
    }
  }
  
  return results;
}

/**
 * 创建虚拟画布用于视觉分析
 * @param {number} size - 画布大小
 * @returns {Array} 虚拟画布的二维数组(默认10x10格)
 */
function createVirtualCanvas(size = 10) {
  const canvas = [];
  for (let y = 0; y < size; y++) {
    canvas[y] = [];
    for (let x = 0; x < size; x++) {
      canvas[y][x] = 0; // 初始化每个单元格的权重为0
    }
  }
  return canvas;
}

/**
 * 在虚拟画布上填充元素权重
 * @param {Object} element - 要分析的元素
 * @param {Array} canvas - 虚拟画布
 * @param {Object} position - 元素位置信息
 */
function populateVirtualCanvas(element, canvas, position = { x: 0, y: 0, width: 1, height: 1 }) {
  if (!element) return;
  
  const canvasSize = canvas.length;
  const weight = calculateVisualWeight(element);
  
  // 计算元素在画布上的位置(相对于0-1的比例)
  const startX = Math.floor(position.x * canvasSize);
  const startY = Math.floor(position.y * canvasSize);
  const endX = Math.min(canvasSize - 1, Math.floor((position.x + position.width) * canvasSize));
  const endY = Math.min(canvasSize - 1, Math.floor((position.y + position.height) * canvasSize));
  
  // 为元素覆盖的区域添加权重
  for (let y = startY; y <= endY; y++) {
    for (let x = startX; x <= endX; x++) {
      canvas[y][x] += weight;
    }
  }
  
  // 递归处理子元素
  if (element.children && element.children.length > 0) {
    // 计算子元素的相对位置
    const childPosition = { ...position };
    const childWidth = position.width / element.children.length;
    
    if (element.direction === 'row') {
      // 水平布局
      element.children.forEach((child, index) => {
        const childPos = { 
          x: position.x + (index * childWidth),
          y: position.y,
          width: childWidth,
          height: position.height
        };
        populateVirtualCanvas(child, canvas, childPos);
      });
    } else {
      // 垂直布局(默认)
      const childHeight = position.height / element.children.length;
      element.children.forEach((child, index) => {
        const childPos = { 
          x: position.x,
          y: position.y + (index * childHeight),
          width: position.width,
          height: childHeight
        };
        populateVirtualCanvas(child, canvas, childPos);
      });
    }
  }
}

/**
 * 计算视觉重心
 * @param {Array} canvas - 虚拟画布
 * @returns {Object} 视觉重心坐标{x, y}(0-1范围)
 */
function calculateCenterOfGravity(canvas) {
  const size = canvas.length;
  let totalWeight = 0;
  let weightedSumX = 0;
  let weightedSumY = 0;
  
  // 计算加权和
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const weight = canvas[y][x];
      totalWeight += weight;
      
      // 使用单元格中心点的归一化坐标(0-1范围)
      const normalizedX = (x + 0.5) / size;
      const normalizedY = (y + 0.5) / size;
      
      weightedSumX += normalizedX * weight;
      weightedSumY += normalizedY * weight;
    }
  }
  
  // 避免除以零
  if (totalWeight === 0) {
    return { x: 0.5, y: 0.5 }; // 默认为中心
  }
  
  // 返回归一化的重心坐标
  return {
    x: weightedSumX / totalWeight,
    y: weightedSumY / totalWeight
  };
}

/**
 * 计算四个象限的权重
 * @param {Array} canvas - 虚拟画布
 * @returns {Array} 各象限权重[左上, 右上, 左下, 右下]
 */
function calculateQuadrantWeights(canvas) {
  const size = canvas.length;
  const halfSize = Math.floor(size / 2);
  const weights = [0, 0, 0, 0]; // 左上, 右上, 左下, 右下
  
  // 计算各象限权重
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const weight = canvas[y][x];
      if (y < halfSize) {
        if (x < halfSize) weights[0] += weight; // 左上
        else weights[1] += weight; // 右上
      } else {
        if (x < halfSize) weights[2] += weight; // 左下
        else weights[3] += weight; // 右下
      }
    }
  }
  
  return weights;
}