'use client';

import { JSDOM } from 'jsdom';
import { mergeElementPresets } from '../presets/presetSystem.js';
import resolveToken, { convertStyle, processStyleValue } from '../tokens/resolveToken.js';

/**
 * jsdom DOM测量系统
 * 
 * 该模块负责使用jsdom创建虚拟浏览器环境，
 * 并将布局对象转换为与浏览器DOM测量一致的数据，用于布局分析
 */

/**
 * 生成基于jsdom的DOM测量数据
 * @param {Object} layout - 布局对象
 * @param {Object} containerDimensions - 容器尺寸，格式为 {width, height}
 * @returns {Object} DOM测量数据
 */
export async function generateJSDOMmeasurements(layout, containerDimensions = { width: 1024, height: 768 }) {
  // 创建jsdom实例
  const dom = new JSDOM(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          margin: 0;
          padding: 0;
        }
        .layout-container {
          width: ${containerDimensions.width}px;
          height: ${containerDimensions.height}px;
          position: relative;
        }
      </style>
    </head>
    <body>
      <div class="layout-container" id="root"></div>
    </body>
    </html>
  `, { 
    // resources: 'usable', 
    // runScripts: 'dangerously',
  });

  const { window } = dom;
  const { document } = window;
  
  // 初始化测量数据对象
  const measurements = {
    container: { ...containerDimensions }
  };

  
  // 递归创建DOM元素
  await createDOMTree(layout, document.getElementById('root'), document);


  const entireHTML = document.documentElement.outerHTML;
  console.log('..... entireHTML')
  console.log(entireHTML);
  
  // 等待样式计算完成
  await new Promise(resolve => setTimeout(resolve, 50));
  

  
  // 收集测量数据
  collectMeasurements(layout, document, measurements, containerDimensions);

  console.log('.... measurements')
  console.log(measurements)
  
  // 清理jsdom资源
  window.close();
  
  return measurements;
}

/**
 * 递归创建DOM树
 * @param {Object} element - 布局元素
 * @param {Object} parentNode - 父DOM节点
 * @param {Object} document - JSDOM文档对象
 */
async function createDOMTree(element, parentNode, document) {
  if (!element || !element.id) return;
  
  // 创建DOM元素
  const domElement = document.createElement('div');
  domElement.id = element.id;
  domElement.setAttribute('data-element-id', element.id);
  domElement.setAttribute('data-element-type', element.type);
  
  // 合并预设样式和直接设置的样式
  const mergedStyle = mergeElementPresets(element);
  const style = {
    position: 'relative',
    boxSizing: 'border-box',
    // 基础默认样式
    fontSize: '16px',
    lineHeight: '1.5',
    fontWeight: 'normal',
    color: '#000000',
    backgroundColor: 'transparent',
    paddingTop: '0px',
    paddingRight: '0px',
    paddingBottom: '0px',
    paddingLeft: '0px',
    marginTop: '0px',
    marginRight: '0px',
    marginBottom: '0px',
    marginLeft: '0px',
    textAlign: 'left',
    letterSpacing: '0px',
    wordSpacing: '0px',
    borderRadius: '0px',
    borderWidth: '0px',
    display: element.type === 'container' ? 'flex' : 'block',
    flexDirection: element.direction || 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: '0px',
    ...mergedStyle,
    ...(element.style || {})
  };
  
  // 解析样式中的令牌并转换为实际值
  const resolvedStyle = convertStyle(style);
  
  // 应用样式到DOM元素
  Object.keys(resolvedStyle).forEach(key => {
    let value = resolvedStyle[key];
    // 确保数值属性有单位
    if (typeof value === 'number' && 
        ['fontSize', 'lineHeight', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
         'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 'letterSpacing', 'wordSpacing',
         'borderRadius', 'borderWidth', 'gap', 'width', 'height'].includes(key)) {
      value = processStyleValue(value, 'px', '0px');
    }
    domElement.style[key] = value;
  });
  
  // 为文本元素添加内容
  if (element.type === 'text' && element.content && element.content.value) {
    domElement.textContent = element.content.value;
  }
  
  // 为按钮元素添加内容
  if (element.type === 'button' && element.content && element.content.text) {
    domElement.textContent = element.content.text;
  }
  
  // 为图像元素添加占位符
  if (element.type === 'image') {
    domElement.style.backgroundColor = '#e0e0e0'; // 图像占位符颜色
  }
  
  // 将元素添加到父节点
  parentNode.appendChild(domElement);
  
  // 递归处理子元素
  if (element.children && element.children.length > 0) {
    for (const child of element.children) {
      await createDOMTree(child, domElement, document);
    }
  }
}

/**
 * 递归收集DOM测量数据
 * @param {Object} element - 布局元素
 * @param {Object} document - JSDOM文档对象
 * @param {Object} measurements - 测量结果对象
 * @param {Object} containerDimensions - 容器尺寸
 */
function collectMeasurements(element, document, measurements, containerDimensions) {
  if (!element || !element.id) return;
  
  const domElement = document.getElementById(element.id);
  if (!domElement) return;
  
  // 获取元素位置和尺寸
  const rect = domElement.getBoundingClientRect();
  const computedStyle = domElement.ownerDocument.defaultView.getComputedStyle(domElement);
  
  // 创建元素的测量数据
  measurements[element.id] = {
    x: rect.left,
    y: rect.top,
    width: rect.width,
    height: rect.height,
    type: element.type,
    style: {
      fontSize: parseFloat(computedStyle.fontSize),
      lineHeight: parseFloat(computedStyle.lineHeight),
      fontWeight: computedStyle.fontWeight,
      color: computedStyle.color,
      backgroundColor: computedStyle.backgroundColor,
      padding: {
        top: parseFloat(computedStyle.paddingTop),
        right: parseFloat(computedStyle.paddingRight),
        bottom: parseFloat(computedStyle.paddingBottom),
        left: parseFloat(computedStyle.paddingLeft)
      },
      margin: {
        top: parseFloat(computedStyle.marginTop),
        right: parseFloat(computedStyle.marginRight),
        bottom: parseFloat(computedStyle.marginBottom),
        left: parseFloat(computedStyle.marginLeft)
      },
      textAlign: computedStyle.textAlign,
      letterSpacing: parseFloat(computedStyle.letterSpacing),
      wordSpacing: parseFloat(computedStyle.wordSpacing),
      borderRadius: parseFloat(computedStyle.borderRadius),
      borderWidth: parseFloat(computedStyle.borderWidth),
      display: computedStyle.display,
      flexDirection: computedStyle.flexDirection,
      justifyContent: computedStyle.justifyContent,
      alignItems: computedStyle.alignItems,
      gap: parseFloat(computedStyle.gap)
    }
  };
  
  // 保存所有预设属性
  const presetProperties = {};
  Object.keys(element).forEach(key => {
    if (key.endsWith('Preset')) {
      presetProperties[key] = element[key];
    }
  });
  measurements[element.id].presets = presetProperties;
  
  // 为文本元素添加文本内容相关数据
  if (element.type === 'text' && element.content && element.content.value) {
    measurements[element.id].textContent = element.content.value;
    measurements[element.id].textLength = element.content.value.length;
    
    // 计算文本密度
    const textArea = rect.width * rect.height;
    measurements[element.id].textDensity = textArea > 0 ?
      (element.content.value.length / textArea) * 10000 : 0;
  }
  
  // 递归处理子元素
  if (element.children && element.children.length > 0) {
    element.children.forEach(child => {
      collectMeasurements(child, document, measurements, containerDimensions);
    });
  }
} 