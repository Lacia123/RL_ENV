'use client';

/**
 * 分析布局中的元素使用率
 * 检查 markdown 导入的所有元素是否都在布局中使用
 * 
 * @param {Object} layout - 布局对象
 * @param {Array} markdownElements - 从 markdown 导入的元素数组
 * @returns {Object} 元素使用率评分结果
 */
export function analyzeElementUsage(layout, markdownElements = []) {
  const results = {
    score: 100,
    usagePercentage: 100,
    unusedElements: [],
    missingElementTypes: {},
    details: []
  };

  // 如果没有 markdown 元素，则返回默认结果
  if (!markdownElements || markdownElements.length === 0) {
    results.details.push({
      type: 'success',
      message: '没有找到需要包含的 Markdown 元素'
    });
    return results;
  }
  
  // 收集布局中所有元素的 ID
  const layoutElementIds = new Set();
  collectElementIds(layout, layoutElementIds);
  
  // 检查哪些 markdown 元素没有被使用
  const unusedElements = markdownElements.filter(element => !layoutElementIds.has(element.id));
  
  // 计算使用率
  const usagePercentage = Math.round(
    ((markdownElements.length - unusedElements.length) / markdownElements.length) * 100
  );
  
  results.usagePercentage = usagePercentage;
  
  // 根据使用率调整分数
  if (usagePercentage < 100) {
    // 对未使用的元素分类统计
    const missingElementTypes = {};
    unusedElements.forEach(element => {
      missingElementTypes[element.type] = (missingElementTypes[element.type] || 0) + 1;
    });
    
    results.unusedElements = unusedElements;
    results.missingElementTypes = missingElementTypes;
    
    // 计算扣分
    // 基础扣分策略: 根据未使用元素的比例扣分
    // 未使用率越高，扣分越多且呈非线性增长
    const unusedRate = 1 - (usagePercentage / 100);
    const penaltyFactor = Math.pow(unusedRate, 0.7) * 100; // 使用 0.7 次方来达到非线性扣分效果
    
    // 根据不同元素类型的重要性调整扣分
    let typeSpecificPenalty = 0;
    
    // 图片和标题未使用的惩罚更高
    if (missingElementTypes['image']) {
      typeSpecificPenalty += missingElementTypes['image'] * 5;
    }
    
    if (missingElementTypes['text'] && unusedElements.some(el => el.typographyPreset?.includes('h'))) {
      typeSpecificPenalty += 10; // 标题元素未使用的额外惩罚
    }
    
    results.score = Math.max(0, Math.min(100, 100 - penaltyFactor - typeSpecificPenalty));
    
    // 添加详细信息
    if (unusedElements.length === 1) {
      results.details.push({
        type: 'warning',
        message: `有1个 Markdown 元素未被使用: ${getElementDescription(unusedElements[0])}`
      });
    } else {
      results.details.push({
        type: 'warning',
        message: `有${unusedElements.length}个 Markdown 元素未被使用，使用率为${usagePercentage}%`
      });
      
      // 按类型分组添加详细信息
      Object.entries(missingElementTypes).forEach(([type, count]) => {
        results.details.push({
          type: 'warning',
          message: `未使用的${getElementTypeName(type)}元素: ${count}个`
        });
      });
    }
  } else {
    results.details.push({
      type: 'success',
      message: '所有 Markdown 元素都已被使用，使用率达到100%'
    });
  }
  
  return results;
}

/**
 * 递归收集布局中所有元素的ID
 * @param {Object} element - 布局元素
 * @param {Set} idSet - 用于存储ID的集合
 */
function collectElementIds(element, idSet) {
  if (!element) return;
  
  if (element.id) {
    idSet.add(element.id);
  }
  
  if (element.children && element.children.length > 0) {
    element.children.forEach(child => collectElementIds(child, idSet));
  }
}

/**
 * 获取元素的描述文本
 * @param {Object} element - 元素对象
 * @returns {string} 元素描述
 */
function getElementDescription(element) {
  if (!element) return '未知元素';
  
  switch (element.type) {
    case 'text':
      const contentPreview = element.content?.value
        ? (element.content.value.length > 20 
           ? element.content.value.substring(0, 20) + '...' 
           : element.content.value)
        : '';
      return `文本"${contentPreview}"`;
      
    case 'image':
      return `图片${element.content?.alt ? `"${element.content.alt}"` : ''}`;
      
    case 'button':
      return `按钮"${element.content?.text || ''}"`;
      
    default:
      return `${getElementTypeName(element.type)}元素`;
  }
}

/**
 * 获取元素类型的中文名称
 * @param {string} type - 元素类型
 * @returns {string} 类型中文名称
 */
function getElementTypeName(type) {
  const typeMap = {
    'text': '文本',
    'image': '图片',
    'button': '按钮',
    'container': '容器'
  };
  
  return typeMap[type] || type;
} 