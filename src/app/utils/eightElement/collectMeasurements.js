/**
 * 收集DOM元素的测量数据
 * @param {HTMLElement} element - 要测量的DOM元素
 * @param {HTMLElement|null} parent - 父元素
 * @param {Object} measurements - 存储测量数据的对象
 */
export function collectElementMeasurements(element, parent = null, measurements) {
  if (!element) return;
  
  const elementId = element.id || `element-${measurements.elements.length}`;
  const rect = element.getBoundingClientRect();
  const computedStyle = window.getComputedStyle(element);
  
  // 获取元素在父元素中的索引位置
  const parentNode = element.parentNode;
  const childIndex = parentNode ? Array.from(parentNode.children).indexOf(element) : -1;
  
  // 创建元素的测量数据
  const elementData = {
    id: elementId,
    x: rect.left,
    y: rect.top,
    width: rect.width,
    height: rect.height,
    type: element.getAttribute('data-element-type') || element.tagName.toLowerCase(),
    parentId: parent ? parent.id : null,
    childIndex,
    style: {
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
    }
  };
  
  // 特殊类型处理
  if (elementData.type === 'text' || elementData.type === 'p' || elementData.type === 'span') {
    elementData.textContent = element.textContent;
    elementData.textLength = element.textContent.length;
    const textArea = rect.width * rect.height;
    elementData.textDensity = textArea > 0 ? (elementData.textLength / textArea) * 10000 : 0;
  }
  
  measurements.elements.push(elementData);
  
  // 递归处理子元素
  Array.from(element.children).forEach(child => {
    collectElementMeasurements(child, element, measurements);
  });
}

/**
 * 解析样式值，将带单位的值转换为数字
 * @param {string} value - 样式值
 * @returns {number} - 解析后的数值
 */
function parseStyleValue(value) {
  return parseFloat(value) || 0;
} 