/**
 * 元素渲染器 - 用于渲染应用了预设的元素
 * 
 * 该模块提供：
 * 1. 将元素对象渲染为HTML字符串
 * 2. 将样式对象转换为CSS字符串
 * 3. 处理不同类型的元素（容器、文本、按钮等）
 */

import presetSystem, { PRESET_STATES } from './presetSystem.js';

/**
 * 将样式对象转换为CSS字符串
 * @param {Object} styles 样式对象
 * @returns {string} CSS样式字符串
 */
export const stylesToCss = (styles = {}) => {
  if (!styles || typeof styles !== 'object') {
    return '';
  }

  return Object.entries(styles)
    .map(([key, value]) => {
      // 转换驼峰命名为短横线命名
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      // 如果值是数字且需要单位的属性，添加px
      const needsUnit = [
        'width', 'height', 'top', 'right', 'bottom', 'left',
        'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
        'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
        'font-size', 'line-height', 'border-width', 'border-radius',
        'min-width', 'max-width', 'min-height', 'max-height',
        'grid-gap', 'column-gap', 'row-gap'
      ];
      
      let cssValue = value;
      if (typeof value === 'number' && needsUnit.includes(cssKey)) {
        cssValue = `${value}px`;
      }
      
      return `${cssKey}: ${cssValue};`;
    })
    .join(' ');
};

/**
 * 渲染容器元素
 * @param {Object} element 元素对象
 * @param {Object} options 渲染选项
 * @returns {string} HTML字符串
 */
const renderContainer = (element, options = {}) => {
  const { children = [], styles = {}, id } = element;
  const childrenHtml = (Array.isArray(children) ? children : []).map(child => 
    renderElement(child, options)
  ).join('');
  
  const cssStyles = stylesToCss(styles);
  return `<div id="${id || ''}" class="container" style="${cssStyles}">${childrenHtml}</div>`;
};

/**
 * 渲染文本元素
 * @param {Object} element 元素对象
 * @param {Object} options 渲染选项
 * @returns {string} HTML字符串
 */
const renderText = (element, options = {}) => {
  const { content = '', styles = {}, id } = element;
  const cssStyles = stylesToCss(styles);
  return `<p id="${id || ''}" style="${cssStyles}">${content}</p>`;
};

/**
 * 渲染按钮元素
 * @param {Object} element 元素对象
 * @param {Object} options 渲染选项
 * @returns {string} HTML字符串
 */
const renderButton = (element, options = {}) => {
  const { content = '', styles = {}, id } = element;
  const cssStyles = stylesToCss(styles);
  return `<button id="${id || ''}" style="${cssStyles}">${content}</button>`;
};

/**
 * 渲染图像元素
 * @param {Object} element 元素对象
 * @param {Object} options 渲染选项
 * @returns {string} HTML字符串
 */
const renderImage = (element, options = {}) => {
  const { src = '', alt = '', styles = {}, id } = element;
  const cssStyles = stylesToCss(styles);
  return `<img id="${id || ''}" src="${src}" alt="${alt}" style="${cssStyles}" />`;
};

/**
 * 渲染任意元素
 * @param {Object} element 元素对象
 * @param {Object} options 渲染选项
 * @returns {string} HTML字符串
 */
export const renderElement = (element, options = {}) => {
  if (!element) return '';
  
  // 应用预设到元素
  const processedElement = presetSystem.processElement(element, options.state || PRESET_STATES.DEFAULT);
  
  // 根据元素类型选择渲染函数
  switch (processedElement.type) {
    case 'container':
      return renderContainer(processedElement, options);
    case 'text':
      return renderText(processedElement, options);
    case 'button':
      return renderButton(processedElement, options);
    case 'image':
      return renderImage(processedElement, options);
    default:
      console.warn(`Unknown element type: ${processedElement.type}`);
      return '';
  }
};

/**
 * 生成完整的HTML页面
 * @param {Array} elements 元素数组
 * @param {Object} options 渲染选项
 * @returns {string} 完整的HTML页面
 */
export const generateHtmlPage = (elements = [], options = {}) => {
  const { title = '预设系统测试', additionalStyles = '' } = options;
  
  const elementsHtml = elements.map(element => renderElement(element, options)).join('\n');
  
  return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.5;
      color: #333;
      margin: 0;
      padding: 20px;
    }
    .container {
      display: flex;
      flex-direction: column;
    }
    ${additionalStyles}
  </style>
</head>
<body>
  ${elementsHtml}
</body>
</html>
  `.trim();
};

export default {
  renderElement,
  renderContainer,
  renderText,
  renderButton,
  renderImage,
  stylesToCss,
  generateHtmlPage
}; 