/**
 * eightElementAnalysis.js
 * 
 * 专门用于八要素结构的布局分析与评分
 * 作为layoutAnalysis模块的扩展，处理特定于八要素结构的分析逻辑
 */

import { analyzeLayout } from '../layoutAnalysis/index.js'

/**
 * 将八要素结构转换为标准布局结构
 * @param {Object} eightElement - 八要素结构对象
 * @returns {Object} 标准布局结构
 */
export function convertEightElementToLayout(eightElement) {
  // 创建根布局容器
  const layout = {
    id: 'root',
    type: 'container',
    children: [],
    style: {
      width: '100%',
      height: '100%'
    }
  };
  
  // 递归处理八要素结构
  if (eightElement) {
    return recursiveConvertElement(eightElement);
  }
  
  return layout;
}

/**
 * 递归地转换八要素结构中的元素
 * @param {Object} element - 八要素元素
 * @param {string} idPrefix - ID前缀，用于生成唯一ID
 * @returns {Object} - 转换后的布局元素
 */
function recursiveConvertElement(element, idPrefix = '') {
  if (!element) return null;
  
  // 生成元素ID
  const elementId = element.id || `${idPrefix}-${Math.random().toString(36).substring(2, 9)}`;
  
  // 基于name字段确定元素类型
  let elementType = 'container';
  if (element.name === 'text') {
    elementType = 'text';
  } else if (element.name === 'background' || element.name === 'image') {
    elementType = 'image';
  } else if (element.name === 'button') {
    elementType = 'button';
  } else if (element.name === 'layout') {
    elementType = 'container';
  }
  
  // 创建基础布局元素
  const layoutElement = {
    id: elementId,
    type: elementType,
    children: [],
    style: {}
  };
  
  // 处理样式 - 优先使用预处理的computedStyle
  if (element.computedStyle) {
    layoutElement.style = { ...element.computedStyle };
  } else if (element.layout && element.layout.style) {
    layoutElement.style = { ...element.layout.style };
  }
  
  // 处理文本内容 - 优先使用预处理的textContent
  if (elementType === 'text') {
    if (element.textContent !== undefined) {
      layoutElement.content = { value: element.textContent };
    } else {
      // 从各种可能的位置提取文本内容
      let content = '';
      
      if (element.font && element.font.fontsize && element.font.fontsize.default) {
        content = element.font.fontsize.default.content || '';
      } else if (element.content) {
        if (typeof element.content === 'string') {
          content = element.content;
        } else if (Array.isArray(element.content)) {
          content = element.content[0]?.value || '';
        }
      }
      
      // 设置文本内容
      layoutElement.content = { value: content };
    }
  }
  
  // 处理图片 - 优先使用预处理的imageUrl
  if (elementType === 'image') {
    if (element.imageUrl !== undefined) {
      layoutElement.src = element.imageUrl;
    } else if (element.material && element.material.image && element.material.image.default) {
      layoutElement.src = element.material.image.default.resource || '';
    } else if (element.src) {
      layoutElement.src = element.src;
    }
  }
  
  // 处理按钮内容 - 优先使用预处理的buttonText
  if (elementType === 'button') {
    if (element.buttonText !== undefined) {
      layoutElement.content = { value: element.buttonText };
    } else {
      let buttonText = '';
      
      if (element.font && element.font.fontsize && element.font.fontsize.default) {
        buttonText = element.font.fontsize.default.content || 'Button';
      } else if (element.content) {
        if (typeof element.content === 'string') {
          buttonText = element.content;
        } else if (Array.isArray(element.content)) {
          buttonText = element.content[0]?.value || 'Button';
        }
      }
      
      layoutElement.content = { value: buttonText };
    }
    
    // 添加按钮URL
    if (element.url) {
      layoutElement.url = element.url;
    }
  }
  
  // 处理子元素
  if (element.layout && element.layout.children && Array.isArray(element.layout.children)) {
    element.layout.children.forEach((child, index) => {
      const childElement = recursiveConvertElement(child, `${elementId}-child-${index}`);
      if (childElement) {
        layoutElement.children.push(childElement);
      }
    });
  }
  
  return layoutElement;
}


/**
 * 分析八要素结构并评分
 * @param {Object} domMeasurements - DOM测量结果
 * @param {Object} eightElement - 八要素结构对象
 * @param {Object} options - 分析选项
 * @returns {Object} 评分结果
 */
export function analyzeEightElement(domMeasurements, eightElement, options = {}) {
  // 将八要素结构转换为标准布局结构
  const layout = convertEightElementToLayout(eightElement);
  
  // 保存转换后的layout和domMeasurements到文件
    // saveToFile(layout, 'eight_element_layout.json');
    // saveToFile(domMeasurements, 'eight_element_measurements.json');
    // saveToFile(eightElement, 'original_eight_element.json');
  
  // 使用标准的布局分析逻辑进行评分
  return analyzeLayout(layout, domMeasurements, options.markdownElements);
}

export default {
  analyzeEightElement,
  convertEightElementToLayout
}; 