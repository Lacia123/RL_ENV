/**
 * renderAndEvaluate.js
 * 
 * 渲染八要素结构为HTML并使用Playwright进行测量和评分
 */

import { chromium } from 'playwright-chromium';
import { renderEightElementToHtml } from './renderEightElementHtml.js';


// 导入collectElementMeasurements函数
import { collectElementMeasurements } from './collectMeasurements.js';

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


  // 使用Playwright进行测量
  const measurements = await measureWithPlaywright(html, processedEightElement, { width, height });
  
  // 仅使用visualSpaceScore模块进行评分
  const score = evaluateEightElementVisualSpace(measurements, processedEightElement, options);
  
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
  const browser = await chromium.launch({ 
    headless: true,
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
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
        collectElementMeasurements(child, rootData, measurements);
      });
    }
    
    return measurements;
  }, { containerDimensions });
  
  await browser.close();
  return measurements;
}

/**
 * 仅使用visualSpaceScore模块评估八要素结构
 * @param {Object} measurements - 元素测量数据
 * @param {Object} eightElement - 八要素结构对象
 * @param {Object} options - 评分选项
 * @returns {Object} - 评分结果
 */
function evaluateEightElementVisualSpace(measurements, eightElement, options = {}) {
  // 将八要素结构转换为布局格式
  const layout = convertEightElementToLayout(eightElement);
  
  // 只使用视觉空间评分
  return evaluateVisualSpace(measurements, layout);
}

export default renderAndEvaluateEightElement;
