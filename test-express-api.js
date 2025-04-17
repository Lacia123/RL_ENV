/**
 * Express 服务器布局分析 API 测试脚本
 * 
 * 使用方法:
 * 1. 先启动 Express 服务器: npm run server
 * 2. 然后在另一个终端中运行: node test-express-api.js
 */

const fetch = require('node-fetch');

// 测试布局请求数据
const testRequest = {
  metadata: {
    canvasWidth: 1200,
    canvasHeight: 800,
    measurementMode: 'virtual' // 使用虚拟DOM测量以提高性能
  },
  actions: [
    // 添加根容器的样式
    {
      type: 'SET_CANVAS_SIZE',
      payload: {
        width: 1200,
        height: 800
      }
    },
    // 添加头部容器
    {
      type: 'ADD_ELEMENT',
      payload: {
        element: {
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
          }
        },
        parentId: 'root'
      }
    },
    // 添加标题文本
    {
      type: 'ADD_ELEMENT',
      payload: {
        element: {
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
        parentId: 'header'
      }
    },
    // 添加内容区容器
    {
      type: 'ADD_ELEMENT',
      payload: {
        element: {
          id: 'content',
          type: 'container',
          style: {
            width: '100%',
            height: 600,
            display: 'flex',
            flexDirection: 'row',
            gap: 20,
            padding: 20
          }
        },
        parentId: 'root'
      }
    },
    // 添加侧边栏
    {
      type: 'ADD_ELEMENT',
      payload: {
        element: {
          id: 'sidebar',
          type: 'container',
          style: {
            width: 250,
            backgroundColor: '#ffffff',
            padding: 16,
            borderRadius: 8,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }
        },
        parentId: 'content'
      }
    },
    // 添加侧边栏标题
    {
      type: 'ADD_ELEMENT',
      payload: {
        element: {
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
        parentId: 'sidebar'
      }
    },
    // 添加主内容区
    {
      type: 'ADD_ELEMENT',
      payload: {
        element: {
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
          }
        },
        parentId: 'content'
      }
    },
    // 添加主内容标题
    {
      type: 'ADD_ELEMENT',
      payload: {
        element: {
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
        parentId: 'main'
      }
    },
    // 添加主内容描述
    {
      type: 'ADD_ELEMENT',
      payload: {
        element: {
          id: 'main-description',
          type: 'text',
          style: {
            fontSize: 16,
            lineHeight: 1.6,
            marginBottom: 20
          },
          content: {
            value: '这是一个测试布局，用于测试Express服务器中的布局分析API功能。我们将分析这个布局的各个维度评分。'
          }
        },
        parentId: 'main'
      }
    }
  ]
};

/**
 * 测试Express服务器的布局分析API
 */
async function testLayoutAnalysisAPI() {
  console.log('开始测试布局分析API...');
  console.log('------------------------------');
  
  try {
    // 使用Express服务器端点
    const expressUrl = 'http://localhost:3003/api/layout-analysis';
    console.log(`向 ${expressUrl} 发送POST请求`);
    
    const startTime = Date.now();
    
    // 发送请求到Express服务器
    const response = await fetch(expressUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testRequest)
    });
    
    const endTime = Date.now();
    const elapsedTime = endTime - startTime;
    
    // 解析响应
    const result = await response.json();
    
    console.log(`请求完成，耗时: ${elapsedTime}ms`);
    console.log('------------------------------');
    
    if (result.success) {
      console.log('布局分析成功!');
      console.log('总体评分:', result.result.score.toFixed(2));
      
      // 输出各维度评分
      console.log('\n各维度评分:');
      const dimensions = result.result;
      
      Object.keys(dimensions).forEach(key => {
        if (key !== 'score' && key !== 'allDetails' && dimensions[key] && typeof dimensions[key].score === 'number') {
          console.log(`- ${key}: ${dimensions[key].score.toFixed(2)}`);
        }
      });
      
      // 输出一些详情
      console.log('\n详情摘要:');
      if (result.result.allDetails && result.result.allDetails.length > 0) {
        result.result.allDetails.slice(0, 5).forEach((detail, index) => {
          console.log(`${index + 1}. ${detail.message || detail.type}`);
        });
        
        if (result.result.allDetails.length > 5) {
          console.log(`... 及其他 ${result.result.allDetails.length - 5} 条详情`);
        }
      } else {
        console.log('无详情数据');
      }
    } else {
      console.error('布局分析失败:', result.error);
      if (result.message) {
        console.error('错误信息:', result.message);
      }
    }
  } catch (error) {
    console.error('测试过程中发生错误:', error.message);
  }
}

// 执行测试
testLayoutAnalysisAPI(); 