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

// 导入统一的元素测量收集模块
import collectEightElementMeasurements from './collectElementMeasurements.js';

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
    
  // 注入统一的collectEightElementMeasurements模块到页面上下文
  // 首先注入辅助函数
  await page.addScriptTag({
    content: `
      function parseStyleValue(value, defaultValue = 0) {
        if (!value || value === 'normal' || value === 'none' || value === 'auto') {
          return defaultValue;
        }
        const parsed = parseFloat(value);
        return isNaN(parsed) ? defaultValue : parsed;
      }
      
      // 全局收集测量的函数
      window.collectEightElementMeasurements = function(processedEightElement, options) {
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
          } else if (element.type === 'chart') {
            elementType = 'chart';
          } else if (element.type === 'table') {
            elementType = 'table';
          } else if (element.type === 'code') {
            elementType = 'code';
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
        
        // 在测量元素前，添加处理以确保完全滚动页面
        function ensureFullPageScroll() {
          if (typeof doc.body !== 'undefined' && typeof doc.documentElement !== 'undefined') {
            // 首先滚动到顶部
            doc.body.scrollTop = 0;
            doc.documentElement.scrollTop = 0;
            
            // 计算页面的总高度
            const scrollHeight = Math.max(
              doc.body.scrollHeight, 
              doc.documentElement.scrollHeight
            );
            
            // 执行分步滚动以确保所有内容加载
            const scrollStep = window.innerHeight || 500;
            let currentScroll = 0;
            
            // 分步滚动整个页面
            while (currentScroll < scrollHeight) {
              window.scrollTo(0, currentScroll);
              currentScroll += scrollStep;
            }
            
            // 确保滚动到页面底部
            window.scrollTo(0, scrollHeight);
            
            // 滚动回顶部开始收集元素
            window.scrollTo(0, 0);
          }
        }
        
        // 确保页面滚动以加载所有内容
        ensureFullPageScroll();
        
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
            parentId: null,
            style: {}
          });
        }
        
        return measurements;
      };
    `
  });
    
  // 使用注入的collectEightElementMeasurements函数收集测量数据
  const measurements = await page.evaluate(({ processedEightElement, containerDimensions }) => {
    // 使用注入的全局函数进行测量
    const measurements = window.collectEightElementMeasurements(processedEightElement, {
      document: document,
      dimensions: containerDimensions,
      getElementById: (id) => document.getElementById(id),
      getComputedStyle: (el) => window.getComputedStyle(el)
    });
    
    console.log(`收集了 ${measurements.elements.length} 个元素的测量数据`);
    return measurements;
  }, { processedEightElement, containerDimensions });


  console.log('final measurements')
  console.log(measurements)

  console.log('收集到的元素数量:', measurements.elements.length);
  
  await browser.close();
  
  return measurements;
}

export default renderAndEvaluateEightElement;
