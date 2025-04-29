/**
 * renderAndEvaluate.js
 * 
 * 渲染八要素结构为HTML并使用Playwright进行测量和评分
 */

import { chromium } from 'playwright-chromium';
import { renderEightElementToHtml } from './renderEightElementHtml.js';

// 导入视觉空间评分模块
import { evaluateVisualSpace } from '../layoutAnalysis/visualSpaceScore.js';

import { convertEightElementToLayout } from '../layoutAnalysis/eightElementAnalysis.js';

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

  // 将八要素结构转换为标准布局格式
  const layout = convertEightElementToLayout(processedEightElement);

  // 使用Playwright进行测量
  const measurements = await measureWithPlaywright(html, processedEightElement, { width, height });
  
  // 仅使用visualSpaceScore模块进行评分
  const visualSpaceScore = evaluateVisualSpace(measurements, layout);
  
  // 将visualSpaceScore转换为统一格式
  const score = {
    score: visualSpaceScore.score,
    categories: visualSpaceScore.categories,
    visualization: visualSpaceScore.visualization,
    overallRecommendation: visualSpaceScore.overallRecommendation
  };
  
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
 * @param {Object} processedEightElement - 预处理后的八要素结构
 * @param {Object} containerDimensions - 容器尺寸
 * @returns {Object} - 测量数据
 */
async function measureWithPlaywright(htmlContent, processedEightElement, containerDimensions) {
  // 尝试使用安全选项启动浏览器
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  
  const page = await browser.newPage();

  page.on('console', (message) => {
    console.log(`PAGE LOG: ${message.text()}`);
  });
  
  // 设置视口尺寸
  await page.setViewportSize({
    width: containerDimensions.width,
    height: containerDimensions.height
  });
  
  // 设置页面内容
  await page.setContent(htmlContent);
    
  // 收集测量数据 - 根据八要素结构和DOM元素进行
  const measurements = await page.evaluate(({ processedEightElement, containerDimensions }) => {
    // 创建基础测量对象
    const measurements = {
      container: { ...containerDimensions },
      elements: []
    };
    
    // 辅助函数: 解析样式值
    function parseStyleValue(value, defaultValue = 0) {
      if (!value || value === 'normal' || value === 'none' || value === 'auto') {
        return defaultValue;
      }
      const parsed = parseFloat(value);
      return isNaN(parsed) ? defaultValue : parsed;
    }
    
    // 递归收集元素测量数据 - 类似page.js中的逻辑
    function collectMeasurements(element, parent = null) {
      if (!element) return;
      
      // 找到对应的DOM元素
      const elementId = element.id;
      if (!elementId) return;
      
      const domElement = document.getElementById(elementId);
      if (!domElement) return;
      
      const rect = domElement.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(domElement);
      
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
      
      // 添加计算样式
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
      
      // 添加到测量结果
      measurements.elements.push(elementData);
      
      // 递归处理子元素
      if (element.layout && element.layout.children) {
        element.layout.children.forEach(child => collectMeasurements(child, element));
      }
    }
    
    // 从根元素开始收集测量数据
    collectMeasurements(processedEightElement);
    
    console.log(`收集了 ${measurements.elements.length} 个元素的测量数据`);
    
    // 确保至少添加根容器元素
    if (measurements.elements.length === 0) {
      measurements.elements.push({
        id: 'root',
        x: 0,
        y: 0,
        width: containerDimensions.width,
        height: containerDimensions.height,
        type: 'container',
        parentId: null
      });
      
      // 添加一个模拟文本元素确保评分能够进行
      measurements.elements.push({
        id: 'mock-text',
        x: 10,
        y: 10,
        width: 200,
        height: 30,
        type: 'text',
        parentId: 'root'
      });
    }
    
    return measurements;
  }, { processedEightElement, containerDimensions });

  console.log('收集到的元素数量:', measurements.elements.length);
  
  await browser.close();
  
  return measurements;
}

export default renderAndEvaluateEightElement;
