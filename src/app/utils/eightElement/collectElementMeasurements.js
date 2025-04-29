/**
 * collectElementMeasurements.js
 * 
 * 通用元素测量收集模块，适用于八要素结构的DOM测量
 */

/**
 * 解析样式值
 * @param {string|number} value - 样式值
 * @param {number} defaultValue - 默认值
 * @returns {number} - 解析后的数值
 */
function parseStyleValue(value, defaultValue = 0) {
  if (!value || value === 'normal' || value === 'none' || value === 'auto') {
    return defaultValue;
  }
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * 收集八要素结构的DOM测量数据
 * @param {Object} processedEightElement - 预处理后的八要素结构
 * @param {Object} options - 选项
 * @param {Document} options.document - DOM文档对象
 * @param {Object} options.dimensions - 容器尺寸 {width, height}
 * @param {Function} options.getElementById - 获取DOM元素的函数
 * @param {Function} options.getComputedStyle - 获取计算样式的函数
 * @returns {Object} - 测量数据对象 {container, elements}
 */
export function collectEightElementMeasurements(processedEightElement, options) {
  const {
    document: doc = document,
    dimensions = { width: 1024, height: 768 },
    getElementById = (id) => doc.getElementById(id),
    getComputedStyle = (el) => window.getComputedStyle(el)
  } = options || {};

  // 创建基础测量对象
  const measurements = {
    container: { ...dimensions },
    elements: []
  };

  // 递归收集元素测量数据
  function collectMeasurements(element, parent = null) {
    if (!element) return;
    
    // 找到对应的DOM元素
    const elementId = element.id;
    if (!elementId) return;
    
    const domElement = getElementById(elementId);
    if (!domElement) return;
    
    // 获取元素位置和尺寸
    const rect = domElement.getBoundingClientRect();
    
    // 确定元素类型
    let elementType = 'container';
    if (element.name === 'text') {
      elementType = 'text';
    } else if (element.name === 'button') {
      elementType = 'button';
    } else if (element.name === 'background' || element.name === 'image') {
      elementType = 'image';
    }
    
    // 创建元素的测量数据
    const elementData = {
      id: elementId,
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
      type: elementType,
      parentId: parent ? parent.id : null,
      style: {}
    };
    
    // 获取计算样式
    if (domElement) {
      const computedStyle = getComputedStyle(domElement);
      elementData.style = {
        fontSize: parseStyleValue(computedStyle.fontSize),
        lineHeight: parseStyleValue(computedStyle.lineHeight),
        fontWeight: computedStyle.fontWeight,
        color: computedStyle.color,
        backgroundColor: computedStyle.backgroundColor,
        padding: {
          top: parseStyleValue(computedStyle.paddingTop),
          right: parseStyleValue(computedStyle.paddingRight),
          bottom: parseStyleValue(computedStyle.paddingBottom),
          left: parseStyleValue(computedStyle.paddingLeft)
        },
        margin: {
          top: parseStyleValue(computedStyle.marginTop),
          right: parseStyleValue(computedStyle.marginRight),
          bottom: parseStyleValue(computedStyle.marginBottom),
          left: parseStyleValue(computedStyle.marginLeft)
        }
      };
      
      // 特殊类型处理
      if (elementType === 'text') {
        elementData.textContent = domElement.textContent;
        elementData.textLength = domElement.textContent.length;
        const textArea = rect.width * rect.height;
        elementData.textDensity = textArea > 0 ? (elementData.textLength / textArea) * 10000 : 0;
      }
    }
    
    // 添加到测量结果
    measurements.elements.push(elementData);
    
    // 递归处理子元素
    if (element.layout && element.layout.children) {
      element.layout.children.forEach(child => collectMeasurements(child, element));
    }
  }
  
  // 从根元素开始收集测量数据
  collectMeasurements(processedEightElement);
  
  // 确保至少添加根容器元素
  if (measurements.elements.length === 0) {
    measurements.elements.push({
      id: 'root',
      x: 0,
      y: 0,
      width: dimensions.width,
      height: dimensions.height,
      type: 'container',
      parentId: null
    });
  }
  
  return measurements;
}

export default collectEightElementMeasurements; 