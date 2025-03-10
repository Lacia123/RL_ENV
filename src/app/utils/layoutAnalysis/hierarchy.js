'use client';

/**
 * 分析布局的视觉层次结构
 * @param {Object} layout - 布局对象
 * @returns {Object} 层次分析结果
 */
export function analyzeHierarchy(layout) {
  const results = {
    score: 100,
    hierarchyLevels: 0,
    hierarchyClarity: 0,
    focusElements: [],
    hierarchyIssues: [],
    details: []
  };
  
  // 如果布局为空，直接返回
  if (!layout || !layout.children || layout.children.length === 0) {
    results.details.push({
      type: 'warning',
      message: '布局为空或没有子元素，无法评估层次结构'
    });
    return results;
  }
  
  // 分析布局的层次结构
  const hierarchyMap = mapHierarchy(layout);
  
  // 分析层次结构的质量
  analyzeHierarchyQuality(hierarchyMap, results);
  
  // 分析焦点元素
  identifyFocusElements(hierarchyMap, results);
  
  // 分析信息组织
  analyzeInformationOrganization(layout, hierarchyMap, results);
  
  return results;
}

/**
 * 映射布局的层次结构
 * @param {Object} element - 布局元素
 * @returns {Object} 层次映射
 */
function mapHierarchy(element, depth = 0, path = '') {
  if (!element) return null;
  
  // 初始化当前元素的层次信息
  const hierarchyInfo = {
    element,
    depth,
    path,
    children: [],
    visualWeight: calculateVisualWeight(element),
    visualImportance: 0, // 将在后续计算
  };
  
  // 递归处理子元素
  if (element.children && element.children.length > 0) {
    element.children.forEach((child, index) => {
      const childPath = path ? `${path}-${index}` : `${index}`;
      const childHierarchy = mapHierarchy(child, depth + 1, childPath);
      if (childHierarchy) {
        hierarchyInfo.children.push(childHierarchy);
      }
    });
  }
  
  // 计算视觉重要性
  hierarchyInfo.visualImportance = calculateVisualImportance(hierarchyInfo);
  
  return hierarchyInfo;
}

/**
 * 计算元素的视觉权重
 * @param {Object} element - 布局元素
 * @returns {number} 视觉权重
 */
function calculateVisualWeight(element) {
  if (!element) return 0;
  
  let weight = 1; // 基础权重
  
  // 根据元素类型调整权重
  switch (element.type) {
    case 'text':
      // 文本权重取决于字体大小和粗细
      const fontSize = element.fontSize || 16;
      const isBold = element.fontWeight === 'bold';
      weight = (fontSize / 16) * (isBold ? 1.5 : 1);
      
      // 标题文本有更高权重
      if (element.variant && ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(element.variant)) {
        const headingLevel = parseInt(element.variant.substring(1));
        weight *= (7 - headingLevel); // h1权重最高，h6权重最低
      }
      break;
      
    case 'image':
      // 图像通常有较高的视觉权重
      weight = 4;
      break;
      
    case 'button':
      // 按钮通常有较高的视觉权重
      weight = 3;
      // 强调按钮有更高的权重
      if (element.variant === 'primary' || element.bgColor === 'primary') weight += 1;
      break;
      
    case 'icon':
      weight = 2;
      break;
      
    case 'divider':
      weight = 0.5;
      break;
      
    case 'container':
      weight = 0.2;
      break;
  }
  
  // 根据元素大小调整权重
  if (element.width && element.height) {
    const area = element.width * element.height;
    // 大元素比小元素有更高的视觉权重
    weight *= Math.min(2, Math.sqrt(area) / 50);
  }
  
  // 根据颜色调整权重
  if (element.bgColor) {
    // 明亮或鲜艳的背景色增加权重
    const vibrantColors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple'];
    if (vibrantColors.some(color => element.bgColor.includes(color))) {
      weight *= 1.3;
    }
  }
  
  // 根据位置调整权重(中心位置权重更高)
  if (element.position) {
    const distanceFromCenter = Math.sqrt(
      Math.pow((element.position.x + (element.width || 0) / 2) - 0.5, 2) +
      Math.pow((element.position.y + (element.height || 0) / 2) - 0.5, 2)
    );
    // 距离中心越近，权重越高
    weight *= (1 + Math.max(0, 0.5 - distanceFromCenter));
  }
  
  return weight;
}

/**
 * 计算元素的视觉重要性
 * @param {Object} hierarchyInfo - 层次信息
 * @returns {number} 视觉重要性
 */
function calculateVisualImportance(hierarchyInfo) {
  const { element, depth, visualWeight } = hierarchyInfo;
  
  // 基本重要性取决于视觉权重
  let importance = visualWeight;
  
  // 层次较浅的元素更重要
  importance *= Math.pow(0.9, depth); // 每增加一层，重要性降低10%
  
  // 特殊元素类型可能具有更高的重要性
  if (element.type === 'text' && element.variant && ['h1', 'h2'].includes(element.variant)) {
    importance *= 1.5; // 主标题重要性更高
  } else if (element.type === 'button' && (element.variant === 'primary' || element.bgColor === 'primary')) {
    importance *= 1.3; // 强调按钮重要性更高
  } else if (element.type === 'image' && (element.width > 100 || element.height > 100)) {
    importance *= 1.2; // 大图重要性更高
  }
  
  return importance;
}

/**
 * 分析层次结构质量
 * @param {Object} hierarchyMap - 层次映射
 * @param {Object} results - 分析结果
 */
function analyzeHierarchyQuality(hierarchyMap, results) {
  // 计算层次级别
  const maxDepth = calculateMaxDepth(hierarchyMap);
  results.hierarchyLevels = maxDepth + 1;
  
  // 层次过多或过少都可能不理想
  if (maxDepth > 5) {
    results.score -= 10;
    results.details.push({
      type: 'warning',
      message: '层次结构过于复杂(超过5层)，可能导致用户理解困难'
    });
  } else if (maxDepth < 2 && hierarchyMap.children.length > 3) {
    results.score -= 5;
    results.details.push({
      type: 'warning',
      message: '层次结构过于扁平，缺乏有效的视觉组织'
    });
  } else if (maxDepth >= 2 && maxDepth <= 4) {
    results.details.push({
      type: 'success',
      message: '层次深度适中，便于信息组织和理解'
    });
  }
  
  // 计算层次清晰度
  const allElements = collectAllElements(hierarchyMap);
  
  // 按视觉重要性排序
  allElements.sort((a, b) => b.visualImportance - a.visualImportance);
  
  // 检查视觉重要性的梯度
  let isGradient = true;
  const importanceValues = allElements.map(el => el.visualImportance);
  
  // 检查是否形成合理梯度
  const threshold = 0.3; // 最小阈值差异
  for (let i = 0; i < importanceValues.length - 1; i++) {
    if (i < 3 && (importanceValues[i] - importanceValues[i + 1]) < threshold) {
      isGradient = false;
      break;
    }
  }
  
  results.hierarchyClarity = isGradient ? 80 : 60;
  
  if (!isGradient) {
    results.score -= 15;
    results.details.push({
      type: 'warning',
      message: '视觉层次不够清晰，关键元素没有足够的视觉区分度'
    });
  } else {
    results.hierarchyClarity = 90;
    results.details.push({
      type: 'success',
      message: '视觉层次清晰，用户可以轻松识别内容优先级'
    });
  }
}

/**
 * 计算最大深度
 * @param {Object} hierarchyInfo - 层次信息
 * @returns {number} 最大深度
 */
function calculateMaxDepth(hierarchyInfo) {
  if (!hierarchyInfo.children || hierarchyInfo.children.length === 0) {
    return hierarchyInfo.depth;
  }
  
  return Math.max(...hierarchyInfo.children.map(child => calculateMaxDepth(child)));
}

/**
 * 收集所有元素
 * @param {Object} hierarchyInfo - 层次信息
 * @returns {Array} 所有元素数组
 */
function collectAllElements(hierarchyInfo) {
  let elements = [hierarchyInfo];
  
  if (hierarchyInfo.children && hierarchyInfo.children.length > 0) {
    hierarchyInfo.children.forEach(child => {
      elements = elements.concat(collectAllElements(child));
    });
  }
  
  return elements;
}

/**
 * 识别焦点元素
 * @param {Object} hierarchyMap - 层次映射
 * @param {Object} results - 分析结果
 */
function identifyFocusElements(hierarchyMap, results) {
  const allElements = collectAllElements(hierarchyMap);
  
  // 按视觉重要性排序
  allElements.sort((a, b) => b.visualImportance - a.visualImportance);
  
  // 取前3个作为焦点元素
  results.focusElements = allElements.slice(0, 3).map(el => ({
    type: el.element.type,
    path: el.path,
    importance: el.visualImportance
  }));
  
  // 检查焦点元素的视觉重要性差异
  if (allElements.length >= 3) {
    const topThreeImportance = results.focusElements.map(el => el.importance);
    const avgTopThree = topThreeImportance.reduce((sum, val) => sum + val, 0) / 3;
    const avgRest = allElements.slice(3).reduce((sum, el) => sum + el.visualImportance, 0) / 
                 Math.max(1, allElements.length - 3);
    
    // 检查焦点元素是否足够突出
    if (avgTopThree < avgRest * 1.5) {
      results.score -= 10;
      results.details.push({
        type: 'warning',
        message: '主要内容与次要内容区分度不足，缺乏明确的视觉焦点'
      });
    } else {
      results.details.push({
        type: 'success',
        message: '布局具有清晰的视觉焦点，引导用户注意力'
      });
    }
  }
}

/**
 * 分析信息组织
 * @param {Object} layout - 布局对象
 * @param {Object} hierarchyMap - 层次映射
 * @param {Object} results - 分析结果
 */
function analyzeInformationOrganization(layout, hierarchyMap, results) {
  // 检查布局的信息组织是否合理
  
  // 1. 检查布局的分组方式
  const groupingScore = evaluateGrouping(layout);
  if (groupingScore < 70) {
    results.score -= 10;
    results.hierarchyIssues.push('poorGrouping');
    results.details.push({
      type: 'warning',
      message: '相关元素分组不清晰，影响用户理解信息关系'
    });
  }
  
  // 2. 检查是否有明确的阅读路径
  const readingPathScore = evaluateReadingPath(hierarchyMap);
  if (readingPathScore < 70) {
    results.score -= 10;
    results.hierarchyIssues.push('unclearReadingPath');
    results.details.push({
      type: 'warning',
      message: '缺乏清晰的视觉阅读路径，用户可能不清楚如何浏览内容'
    });
  } else {
    results.details.push({
      type: 'success',
      message: '布局提供了明确的视觉阅读路径，引导用户浏览内容'
    });
  }
  
  // 确保分数在0-100范围内
  results.score = Math.max(0, Math.min(100, results.score));
}

/**
 * 评估布局分组
 * @param {Object} layout - 布局对象
 * @returns {number} 分组评分
 */
function evaluateGrouping(layout) {
  // 简化实现：检查是否有合理的容器结构
  if (!layout.children || layout.children.length === 0) {
    return 50;
  }
  
  // 计算容器元素的比例
  const totalElements = countElements(layout);
  const containerElements = countElementsByType(layout, 'container');
  
  // 理想情况下，容器数量应该适中(太多意味着过度复杂，太少意味着缺乏组织)
  const containerRatio = containerElements / Math.max(1, totalElements - containerElements);
  
  if (containerRatio < 0.1) {
    return 60; // 太少的容器
  } else if (containerRatio > 0.5) {
    return 70; // 可能有太多的容器
  } else {
    return 85; // 适当的容器比例
  }
}

/**
 * 评估阅读路径
 * @param {Object} hierarchyMap - 层次映射
 * @returns {number} 阅读路径评分
 */
function evaluateReadingPath(hierarchyMap) {
  // 获取所有元素
  const allElements = collectAllElements(hierarchyMap);
  
  // 按视觉重要性排序
  allElements.sort((a, b) => b.visualImportance - a.visualImportance);
  
  // 检查位置是否形成逻辑阅读路径
  if (allElements.length < 3) {
    return 80; // 元素太少，无法做出有意义的评估
  }
  
  // 获取前三个重要元素
  const topElements = allElements.slice(0, 3);
  
  // 检查是否遵循自然阅读顺序(从上到下，从左到右)
  let isOrdered = true;
  for (let i = 0; i < topElements.length - 1; i++) {
    const current = topElements[i].element.position || { x: 0, y: 0 };
    const next = topElements[i + 1].element.position || { x: 0, y: 0 };
    
    // 如果下一个元素不在当前元素的下方或右侧，则认为不符合自然阅读顺序
    if (!(next.y > current.y || (next.y === current.y && next.x > current.x))) {
      isOrdered = false;
      break;
    }
  }
  
  return isOrdered ? 85 : 65;
}

/**
 * 计算元素总数
 * @param {Object} element - 布局元素
 * @returns {number} 元素总数
 */
function countElements(element) {
  if (!element) return 0;
  
  let count = 1; // 当前元素
  
  if (element.children && element.children.length > 0) {
    element.children.forEach(child => {
      count += countElements(child);
    });
  }
  
  return count;
}

/**
 * 计算特定类型的元素数量
 * @param {Object} element - 布局元素
 * @param {string} type - 元素类型
 * @returns {number} 指定类型的元素数量
 */
function countElementsByType(element, type) {
  if (!element) return 0;
  
  let count = element.type === type ? 1 : 0;
  
  if (element.children && element.children.length > 0) {
    element.children.forEach(child => {
      count += countElementsByType(child, type);
    });
  }
  
  return count;
}