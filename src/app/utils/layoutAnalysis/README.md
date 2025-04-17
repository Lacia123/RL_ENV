# 布局分析模块

布局分析模块包含一组用于分析和评估UI布局的工具。该模块可以使用不同的测量方式来获取元素的尺寸和位置数据，并基于这些数据提供多维度的布局评分。

## 测量方法

布局分析模块支持两种测量方法：

1. **虚拟DOM测量 (Virtual DOM Measurement)**
   - 使用纯JavaScript实现的元素尺寸和位置计算
   - 不依赖浏览器环境
   - 适合轻量级场景和服务器端环境
   - 性能较好

2. **JSDOM测量 (JSDOM Measurement)**
   - 使用JSDOM创建虚拟浏览器环境进行测量
   - 更精确的样式和布局计算
   - 适合需要精确样式计算的场景
   - 支持更复杂的CSS特性

## 使用示例

### 基本使用

```javascript
import { layoutAnalysisAPI } from '../../utils/layoutAnalysisAPI';

// 创建布局请求
const request = {
  metadata: {
    canvasWidth: 1024,
    canvasHeight: 768,
    measurementMode: 'virtual' // 可选值: 'virtual' 或 'jsdom'
  },
  actions: [
    // 添加元素的动作...
  ]
};

// 使用默认虚拟DOM测量
const result = await layoutAnalysisAPI.evaluateLayout(request);
console.log(result);
```

### 使用JSDOM测量

```javascript
// 使用JSDOM测量
const requestWithJSDOM = {
  metadata: {
    canvasWidth: 1024,
    canvasHeight: 768,
    measurementMode: 'jsdom' // 使用JSDOM进行测量
  },
  actions: [
    // 添加元素的动作...
  ]
};

const resultWithJSDOM = await layoutAnalysisAPI.evaluateLayout(requestWithJSDOM);
console.log(resultWithJSDOM);
```

### 通过API接口请求

通过HTTP接口调用布局分析可以使用以下格式：

```javascript
// 前端请求示例
async function analyzeLayoutViaAPI() {
  const response = await fetch('/api/layout-analysis', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      metadata: {
        canvasWidth: 1024,
        canvasHeight: 768,
        measurementMode: 'virtual'
      },
      actions: [
        {
          type: 'ADD_ELEMENT',
          payload: {
            element: {
              id: 'header',
              type: 'container',
              style: {
                width: '100%',
                height: 80,
                backgroundColor: '#4a90e2'
              }
            },
            parentId: 'root'
          }
        },
        {
          type: 'ADD_ELEMENT',
          payload: {
            element: {
              id: 'title',
              type: 'text',
              style: {
                fontSize: 24,
                color: '#ffffff'
              },
              content: {
                value: '页面标题'
              }
            },
            parentId: 'header'
          }
        }
      ]
    })
  });
  
  const result = await response.json();
  return result;
}

// 使用方法
const analysisResult = await analyzeLayoutViaAPI();
console.log(analysisResult);
```

对应的后端API实现示例：

```javascript
// Next.js API路由实现 (/api/layout-analysis.js)
import { layoutAnalysisAPI } from '../../utils/layoutAnalysisAPI';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '仅支持POST请求' });
  }
  
  try {
    const request = req.body;
    const result = await layoutAnalysisAPI.evaluateLayout(request);
    
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ 
      error: '布局分析失败', 
      message: error.message 
    });
  }
}
```

### 直接使用测量模块

```javascript
import { generateVirtualDomMeasurements } from './virtualDom';
import { generateJSDOMmeasurements } from './domMeasure';
import { analyzeLayout } from './index';

// 创建布局对象
const layout = {
  id: 'root',
  type: 'container',
  // ... 布局定义
};

// 使用虚拟DOM测量
const virtualMeasurements = generateVirtualDomMeasurements(layout);
const resultVirtual = analyzeLayout(layout, virtualMeasurements);

// 使用JSDOM测量
const jsdomMeasurements = await generateJSDOMmeasurements(layout);
const resultJSDOM = analyzeLayout(layout, jsdomMeasurements);
```

## 服务器部署选项

项目提供了两种方式来部署布局分析API：

### 1. 使用 Next.js API 路由 (默认)

默认情况下，布局分析API通过 Next.js 的 API 路由功能提供服务，访问路径为：

```
POST /api/layout-analysis
```

这种方式无需额外设置，直接启动 Next.js 应用即可：

```bash
npm run dev
```

### 2. 使用独立的 Express 服务器

项目还提供了一个独立的 Express 服务器，可以与 Next.js 前端分离部署，或者作为统一的服务器同时提供 API 和前端页面：

```bash
# 启动独立的 Express 服务器
npm run server
```

Express 服务器默认在 3003 端口运行，布局分析API访问路径为：

```
POST http://localhost:3003/api/layout-analysis
```

独立服务器适合以下场景：
- 需要将布局分析API部署为独立的微服务
- 需要对API进行更精细的控制和配置
- 需要将前端和API分离部署在不同的服务器上

## 测量模式选择指南

- **选择虚拟DOM测量的情况**:
  - 性能是首要考虑因素
  - 布局比较简单，不需要精确计算CSS样式
  - 在服务器端环境运行
  - 需要大量快速评估

- **选择JSDOM测量的情况**:
  - 精确度是首要考虑因素
  - 布局中包含复杂的CSS样式和布局
  - 需要精确模拟浏览器渲染行为
  - 对复杂的文本排版和尺寸计算有要求 