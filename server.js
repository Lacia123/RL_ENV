import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { parse } from 'url';
import next from 'next';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 判断是否为开发环境
const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOSTNAME || 'localhost';
const port = process.env.PORT || 3001;

// 创建Next.js应用实例
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// 使用async IIFE初始化服务器
(async () => {
  try {
    // 等待Next.js准备好
    await app.prepare();
    
    // 创建Express服务器
    const server = express();
    
    // 中间件
    server.use(cors());
    server.use(bodyParser.json({ limit: '5mb' }));
    
    // 应用性能监控中间件(可选)
    server.use((req, res, next) => {
      const start = Date.now();
      res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
      });
      next();
    });
    
    // 设置Express API路由
    // 布局分析API
    server.post('/api/layout-analysis', async (req, res) => {
      try {
        console.log('收到布局分析请求');
        
        const request = req.body;
        if (!request || !request.actions) {
          return res.status(400).json({ 
            success: false, 
            error: '无效的请求格式' 
          });
        }
        
        // 动态导入API模块(仅在需要时加载)，指定具体文件路径
        const { layoutAnalysisAPI } = await import('./src/app/utils/layoutAnalysisAPI.js');
        
        // 使用布局分析API评估布局
        const result = await layoutAnalysisAPI.evaluateLayout(request);
        
        res.status(200).json(result);
      } catch (error) {
        console.error('布局分析API错误:', error);
        res.status(500).json({ 
          success: false, 
          error: '布局分析失败', 
          message: error.message 
        });
      }
    });
    
    // 添加静态文件服务(可选)
    server.use(express.static('public'));
    
    // 将其他所有请求代理到Next.js
    server.all('*', (req, res) => {
      const parsedUrl = parse(req.url, true);
      return handle(req, res, parsedUrl);
    });
    
    // 启动服务器
    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`
┌─────────────────────────────────────────────────┐
│                                                 │
│   🚀 服务器已启动!                               │
│                                                 │
│   - 本地访问地址: http://${hostname}:${port}     │
│   - 模式: ${dev ? '开发环境' : '生产环境'}        │
│   - SSR已启用                                   │
│                                                 │
└─────────────────────────────────────────────────┘
      `);
    });
  } catch (err) {
    console.error('服务器启动失败:', err);
    process.exit(1);
  }
})(); 