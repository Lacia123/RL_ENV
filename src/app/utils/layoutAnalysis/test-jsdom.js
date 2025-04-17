'use client';

/**
 * 布局分析JSDOM测试脚本
 * 
 * 运行方法:
 * 1. 在终端中使用Node.js运行: node test-jsdom.js
 * 2. 或在浏览器控制台中直接运行
 * 
 * 该脚本测试和比较virtualDom和JSDOM两种测量方法的布局分析结果
 */

import { analyzeLayout } from './index.js';
import { generateVirtualDomMeasurements } from './virtualDom.js';
import { generateJSDOMmeasurements } from './domMeasure.js';

// 测试布局结构
const testLayout = {
  id: 'root',
  type: 'container',
  style: {
    width: 1200,
    height: 800,
    padding: 20,
    backgroundColor: '#f5f5f5',
    display: 'flex',
    flexDirection: 'column'
  },
  children: [
    {
      id: 'header',
      type: 'container',
      style: {
        width: '100%',
        height: 80,
        backgroundColor: '#4a90e2',
        padding: 16,
        marginBottom: 20,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      },
      children: [
        {
          id: 'logo',
          type: 'text',
          style: {
            fontSize: 24,
            fontWeight: 'bold',
            color: '#ffffff'
          },
          content: {
            value: '布局分析测试'
          }
        },
        {
          id: 'nav',
          type: 'container',
          style: {
            display: 'flex',
            flexDirection: 'row',
            gap: 20
          },
          children: [
            {
              id: 'nav-item-1',
              type: 'text',
              style: {
                fontSize: 16,
                color: '#ffffff'
              },
              content: {
                value: '首页'
              }
            },
            {
              id: 'nav-item-2',
              type: 'text',
              style: {
                fontSize: 16,
                color: '#ffffff'
              },
              content: {
                value: '关于'
              }
            },
            {
              id: 'nav-item-3',
              type: 'text',
              style: {
                fontSize: 16,
                color: '#ffffff'
              },
              content: {
                value: '服务'
              }
            }
          ]
        }
      ]
    },
    {
      id: 'content',
      type: 'container',
      style: {
        width: '100%',
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        gap: 20
      },
      children: [
        {
          id: 'sidebar',
          type: 'container',
          style: {
            width: 250,
            backgroundColor: '#ffffff',
            padding: 16,
            borderRadius: 8,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          },
          children: [
            {
              id: 'sidebar-title',
              type: 'text',
              style: {
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 16
              },
              content: {
                value: '侧边栏'
              }
            },
            {
              id: 'sidebar-item-1',
              type: 'container',
              style: {
                padding: '10px 0',
                borderBottom: '1px solid #eeeeee'
              },
              children: [
                {
                  id: 'sidebar-item-1-text',
                  type: 'text',
                  style: {
                    fontSize: 14
                  },
                  content: {
                    value: '菜单项 1'
                  }
                }
              ]
            },
            {
              id: 'sidebar-item-2',
              type: 'container',
              style: {
                padding: '10px 0',
                borderBottom: '1px solid #eeeeee'
              },
              children: [
                {
                  id: 'sidebar-item-2-text',
                  type: 'text',
                  style: {
                    fontSize: 14
                  },
                  content: {
                    value: '菜单项 2'
                  }
                }
              ]
            },
            {
              id: 'sidebar-item-3',
              type: 'container',
              style: {
                padding: '10px 0'
              },
              children: [
                {
                  id: 'sidebar-item-3-text',
                  type: 'text',
                  style: {
                    fontSize: 14
                  },
                  content: {
                    value: '菜单项 3'
                  }
                }
              ]
            }
          ]
        },
        {
          id: 'main',
          type: 'container',
          style: {
            flex: 1,
            backgroundColor: '#ffffff',
            padding: 24,
            borderRadius: 8,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: 20
          },
          children: [
            {
              id: 'main-title',
              type: 'text',
              style: {
                fontSize: 24,
                fontWeight: 'bold',
                marginBottom: 16
              },
              content: {
                value: '主要内容区域'
              }
            },
            {
              id: 'main-description',
              type: 'text',
              style: {
                fontSize: 16,
                lineHeight: 1.6,
                marginBottom: 20
              },
              content: {
                value: '这是一个测试布局，用于比较不同DOM测量方法的分析结果。我们将对比虚拟DOM和JSDOM两种实现方式在各个维度上的评分差异。'
              }
            },
            {
              id: 'main-buttons',
              type: 'container',
              style: {
                display: 'flex',
                flexDirection: 'row',
                gap: 12,
                marginTop: 20
              },
              children: [
                {
                  id: 'button-primary',
                  type: 'button',
                  style: {
                    padding: '10px 20px',
                    backgroundColor: '#4a90e2',
                    borderRadius: 4,
                    color: '#ffffff',
                    fontWeight: 'bold'
                  },
                  content: {
                    value: '主要按钮'
                  }
                },
                {
                  id: 'button-secondary',
                  type: 'button',
                  style: {
                    padding: '10px 20px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: 4,
                    color: '#333333',
                    border: '1px solid #dddddd'
                  },
                  content: {
                    value: '次要按钮'
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'footer',
      type: 'container',
      style: {
        width: '100%',
        height: 60,
        backgroundColor: '#333333',
        marginTop: 20,
        padding: 16,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      },
      children: [
        {
          id: 'footer-text',
          type: 'text',
          style: {
            fontSize: 14,
            color: '#ffffff',
            textAlign: 'center'
          },
          content: {
            value: '© 2023 布局分析测试。保留所有权利。'
          }
        }
      ]
    }
  ]
};

/**
 * 运行测试并比较结果
 */
async function runTests() {
  console.log('开始布局分析测试...');
  console.log('------------------------------');
  
  // 使用虚拟DOM测量测试
  console.log('使用虚拟DOM测量:');
  const virtualDomResults = await testWithMode('virtual');
  
  console.log('------------------------------');
  
  // 使用JSDOM测量测试
  console.log('使用JSDOM测量:');
  const jsdomResults = await testWithMode('jsdom');
  
  console.log('------------------------------');
  
  // 比较两种方法的结果
  console.log('结果比较:');
  compareResults(virtualDomResults, jsdomResults);
}

/**
 * 指定模式下的测试
 * @param {string} mode - 测试模式 ('virtual' 或 'jsdom')
 * @returns {Object} 分析结果
 */
async function testWithMode(mode) {
  const startTime = performance.now();
  
  // 容器尺寸
  const containerDimensions = { width: 1200, height: 800 };
  
  // 根据模式生成测量数据
  let measurements;
  if (mode === 'virtual') {
    measurements = generateVirtualDomMeasurements(testLayout, containerDimensions);
  } else {
    measurements = await generateJSDOMmeasurements(testLayout, containerDimensions);
  }
  
  // 分析布局
  const results = analyzeLayout(testLayout, { measurements });
  
  const endTime = performance.now();
  const timeElapsed = (endTime - startTime).toFixed(2);
  
  console.log(`处理时间: ${timeElapsed}毫秒`);
  console.log('总体评分:', results.score.toFixed(2));
  console.log('维度评分:');
  console.log(' - 内容密度:', results.dimensions.contentDensity.score.toFixed(2));
  console.log(' - 对齐:', results.dimensions.alignment.score.toFixed(2));
  console.log(' - 视觉平衡:', results.dimensions.visualBalance.score.toFixed(2));
  console.log(' - 排版:', results.dimensions.typography.score.toFixed(2));
  console.log(' - 色彩和对比度:', results.dimensions.colorAndContrast.score.toFixed(2));
  console.log(' - 响应式设计:', results.dimensions.responsiveDesign.score.toFixed(2));
  
  return results;
}

/**
 * 比较两种测量方法的结果
 * @param {Object} virtualResults - 虚拟DOM测量结果
 * @param {Object} jsdomResults - JSDOM测量结果
 */
function compareResults(virtualResults, jsdomResults) {
  const compareScores = (name, virtualScore, jsdomScore) => {
    const diff = (jsdomScore - virtualScore).toFixed(2);
    const diffSymbol = diff > 0 ? '+' : '';
    console.log(`${name}: ${diffSymbol}${diff} (虚拟DOM: ${virtualScore.toFixed(2)}, JSDOM: ${jsdomScore.toFixed(2)})`);
  };
  
  console.log('差异比较 (JSDOM相对于虚拟DOM):');
  compareScores('总体评分', virtualResults.score, jsdomResults.score);
  console.log('维度评分差异:');
  compareScores(' - 内容密度', 
    virtualResults.dimensions.contentDensity.score,
    jsdomResults.dimensions.contentDensity.score);
  compareScores(' - 对齐', 
    virtualResults.dimensions.alignment.score,
    jsdomResults.dimensions.alignment.score);
  compareScores(' - 视觉平衡', 
    virtualResults.dimensions.visualBalance.score,
    jsdomResults.dimensions.visualBalance.score);
  compareScores(' - 排版', 
    virtualResults.dimensions.typography.score,
    jsdomResults.dimensions.typography.score);
  compareScores(' - 色彩和对比度', 
    virtualResults.dimensions.colorAndContrast.score,
    jsdomResults.dimensions.colorAndContrast.score);
  compareScores(' - 响应式设计', 
    virtualResults.dimensions.responsiveDesign.score,
    jsdomResults.dimensions.responsiveDesign.score);
}

// 判断是否在Node.js环境中运行
if (typeof window === 'undefined') {
  runTests().catch(err => console.error('测试失败:', err));
} else {
  // 浏览器环境提示
  console.log('请点击"运行测试"按钮执行测试，或在控制台中调用runTests()函数');
  
  // 导出测试函数供UI调用
  window.runLayoutTests = runTests;
} 