/**
 * renderAndEvaluate.js
 * 
 * 渲染八要素结构为HTML并使用Playwright进行测量和评分
 */

import { chromium } from 'playwright-chromium';
import { renderEightElementToHtml } from './renderEightElementHtml.js';

// 导入专用于八要素分析的模块
import { analyzeEightElement } from '../layoutAnalysis/eightElementAnalysis.js';

/**
 * 渲染八要素结构并进行评分
 * @param {Object} eightElement - 八要素结构对象
 * @param {Object} options - 选项
 * @returns {Object} - 测量和评分结果
 */
export async function renderAndEvaluateEightElement(eightElement, options = {}) {
  const { width = 1024, height = 768 } = options;
  
  // 渲染HTML和预处理八要素结构
  const { html, processedEightElement } = renderEightElementToHtml(eightElement, { width, height });
  
  // 使用Playwright进行测量
  const measurements = await measureWithPlaywright(html, processedEightElement, { width, height });
  
  // 使用layoutAnalysis模块进行评分 - 传入预处理的八要素结构
  const score = evaluateEightElementWithLayoutAnalysis(measurements, processedEightElement, options);
  
  return {
    measurements,
    score,
    html,
    processedEightElement
  };
}

/**
 * 使用Playwright测量HTML元素
 * @param {string} htmlContent - HTML内容
 * @param {Object} eightElement - 八要素结构对象
 * @param {Object} containerDimensions - 容器尺寸
 * @returns {Object} - 测量数据
 */
async function measureWithPlaywright(htmlContent, eightElement, containerDimensions) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // 设置视口尺寸
  await page.setViewportSize({
    width: containerDimensions.width,
    height: containerDimensions.height
  });
  
  // 设置页面内容
  await page.setContent(htmlContent);
  
  // 收集测量数据
  const measurements = await page.evaluate(({ containerDimensions }) => {
    const measurements = {
      container: { ...containerDimensions },
      elements: []
    };
    
    function parseStyleValue(value, defaultValue = 0) {
      if (value === 'normal' || value === 'none' || value === 'auto') {
        return defaultValue;
      }
      const parsed = parseFloat(value);
      return isNaN(parsed) ? defaultValue : parsed;
    }
    
    function hexToRgb(hex) {
      if (!hex || hex === 'transparent' || hex === 'rgba(0, 0, 0, 0)') {
        return null;
      }
      
      // 检查是否是RGB格式
      const rgbMatch = hex.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/i);
      if (rgbMatch) {
        return {
          r: parseInt(rgbMatch[1], 10),
          g: parseInt(rgbMatch[2], 10),
          b: parseInt(rgbMatch[3], 10)
        };
      }
      
      // 检查是否是RGBA格式
      const rgbaMatch = hex.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/i);
      if (rgbaMatch) {
        return {
          r: parseInt(rgbaMatch[1], 10),
          g: parseInt(rgbaMatch[2], 10),
          b: parseInt(rgbaMatch[3], 10),
          a: parseFloat(rgbaMatch[4])
        };
      }
      
      // 处理十六进制
      let hexColor = hex.replace('#', '');
      if (hexColor.length === 3) {
        hexColor = hexColor.split('').map(c => c + c).join('');
      }
      
      return {
        r: parseInt(hexColor.substr(0, 2), 16),
        g: parseInt(hexColor.substr(2, 2), 16),
        b: parseInt(hexColor.substr(4, 2), 16)
      };
    }
    
    function collectElementMeasurements(element, parent = null) {
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
          },
          textAlign: computedStyle.textAlign,
          letterSpacing: parseStyleValue(computedStyle.letterSpacing),
          wordSpacing: parseStyleValue(computedStyle.wordSpacing),
          borderRadius: parseStyleValue(computedStyle.borderRadius),
          borderWidth: parseStyleValue(computedStyle.borderWidth),
          display: computedStyle.display,
          flexDirection: computedStyle.flexDirection,
          justifyContent: computedStyle.justifyContent,
          alignItems: computedStyle.alignItems,
          gap: parseStyleValue(computedStyle.gap),
          position: computedStyle.position,
          zIndex: parseStyleValue(computedStyle.zIndex),
          overflow: computedStyle.overflow
        }
      };
      
      // 解析颜色为RGB对象，方便后续分析
      elementData.style.colorRgb = hexToRgb(elementData.style.color);
      elementData.style.backgroundColorRgb = hexToRgb(elementData.style.backgroundColor);
      
      // 文本元素的特殊处理
      if (element.getAttribute('data-element-type') === 'text' || 
          element.tagName === 'P' || 
          element.tagName === 'H1' || 
          element.tagName === 'H2' || 
          element.tagName === 'H3' || 
          element.tagName === 'H4' || 
          element.tagName === 'H5' || 
          element.tagName === 'H6' || 
          element.tagName === 'SPAN') {
        const textContent = element.textContent || '';
        elementData.textContent = textContent;
        elementData.textLength = textContent.length;
        
        // 计算文本密度
        const textArea = rect.width * rect.height;
        elementData.textDensity = textArea > 0 ?
          (textContent.length / textArea) * 10000 : 0;
          
        // 获取文本的角色（标题、段落等）
        if (element.tagName.match(/^H[1-6]$/)) {
          elementData.role = 'heading';
          elementData.headingLevel = parseInt(element.tagName.substring(1), 10);
        } else {
          elementData.role = 'text';
        }
      }
      
      // 图像元素处理
      if (element.getAttribute('data-element-type') === 'image' || element.tagName === 'IMG') {
        elementData.role = 'image';
        elementData.src = element.getAttribute('src') || '';
        
        if (element.hasAttribute('alt')) {
          elementData.alt = element.getAttribute('alt');
        }
      }
      
      // 按钮元素处理
      if (element.getAttribute('data-element-type') === 'button' || element.tagName === 'BUTTON') {
        elementData.role = 'button';
        elementData.isDisabled = element.disabled || element.getAttribute('aria-disabled') === 'true';
        elementData.textContent = element.textContent || '';
      }
      
      // 保存容器尺寸到每个元素的测量数据
      elementData.containerWidth = containerDimensions.width;
      elementData.containerHeight = containerDimensions.height;
      
      // 添加到元素集合
      measurements.elements.push(elementData);
      
      // 递归处理子元素
      Array.from(element.children).forEach(child => {
        collectElementMeasurements(child, elementData);
      });
    }
    
    // 开始从根元素收集测量数据
    const rootElement = document.getElementById('root');
    if (rootElement) {
      // 先处理根元素
      const rootData = {
        id: 'root',
        x: 0,
        y: 0,
        width: containerDimensions.width,
        height: containerDimensions.height,
        type: 'container',
        parentId: null,
        childIndex: -1,
        style: {}
      };
      
      measurements.elements.push(rootData);
      
      // 然后处理子元素
      Array.from(rootElement.children).forEach(child => {
        collectElementMeasurements(child, rootData);
      });
    }
    
    return measurements;
  }, { containerDimensions });
  
  await browser.close();
  return measurements;
}

/**
 * 使用layoutAnalysis模块评估八要素结构
 * @param {Object} measurements - 元素测量数据
 * @param {Object} eightElement - 八要素结构对象
 * @param {Object} options - 评分选项
 * @returns {Object} - 评分结果
 */
function evaluateEightElementWithLayoutAnalysis(measurements, eightElement, options = {}) {
  // 使用专门针对八要素结构的分析模块
  return analyzeEightElement(measurements, eightElement, options);
}

export default renderAndEvaluateEightElement;
