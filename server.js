import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { parse } from 'url';
import next from 'next';
import fs from 'fs';
import path from 'path';

// 配置Playwright的Chrome路径
// Windows环境下的Chromium路径
process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH = process.platform === 'win32' 
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' 
  : process.platform === 'linux'
    ? '/usr/bin/google-chrome'
    : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

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
    
    // Markdown评分API
    server.post('/api/markdown-evaluate', async (req, res) => {
      try {
        console.log('收到Markdown评分请求');
        
        const request = req.body;
        if (!request || !request.markdown) {
          return res.status(400).json({ 
            success: false, 
            error: 'markdown参数为必填项' 
          });
        }
        
        // 提取参数
        const { markdown, width = 1024, height = 768, seed } = request;
        
        // 动态导入所需模块
        const { markdownToEightElement } = await import('./src/app/utils/eightElement/markdownToEightElement.js');
        const { renderAndEvaluateEightElement } = await import('./src/app/utils/eightElement/renderAndEvaluate.js');
        
        // 处理seed参数，生成自定义设计令牌
        let designTokens = null;
        if (seed) {
          try {
            const { calculateTokens } = await import('./src/app/utils/seeds/generateTokenBySeed.js');
            // 使用seed参数生成设计令牌
            designTokens = calculateTokens(seed);
            console.log('使用自定义种子生成设计令牌:', seed);
            
            // 使用token解析器的动态token系统
            const { setDynamicTokenSystem } = await import('./src/app/utils/tokens/resolveToken.js');
            setDynamicTokenSystem(designTokens);
            console.log('已将设计令牌设置为动态token系统');
          } catch (tokenError) {
            console.warn('生成设计令牌失败，将使用默认令牌:', tokenError);
          }
        }
        
        // 转换Markdown为八要素结构
        const eightElement = markdownToEightElement(markdown);
        
        // 确保目录存在
        const outputDir = path.join(__dirname, 'output');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        
        // 生成带时间戳的文件名
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const outputPath = path.join(outputDir, `eight-element-${timestamp}.json`);
        
        // 写入文件
        fs.writeFileSync(outputPath, JSON.stringify(eightElement, null, 2), 'utf8');
        
        // 使用Playwright渲染并评分
        const result = await renderAndEvaluateEightElement(eightElement, { width, height });
        
        // 如果设置了动态token系统，需要清除
        if (designTokens) {
          try {
            const { clearDynamicTokenSystem } = await import('./src/app/utils/tokens/resolveToken.js');
            clearDynamicTokenSystem();
            console.log('已清除动态token系统');
          } catch (error) {
            console.warn('清除动态token系统失败:', error);
          }
        }
        
        // 返回评分结果
        res.status(200).json({
          success: true,
          score: result.score,
          // 确保scoreDetails与result.score.categories保持一致
          scoreDetails: result.score.categories,
          // 如果使用了自定义设计令牌，返回相关信息
          designTokens: designTokens,
          tokensApplied: !!designTokens
        });
      } catch (error) {
        // 确保无论如何都清除动态token系统
        try {
          const { clearDynamicTokenSystem } = await import('./src/app/utils/tokens/resolveToken.js');
          clearDynamicTokenSystem();
        } catch (clearError) {
          // 忽略清除错误
        }
        
        console.error('Markdown评分失败:', error);
        res.status(500).json({ 
          success: false, 
          error: 'Markdown评分失败', 
          message: error.message 
        });
      }
    });
    
    // 布局生成API - 仅将actions转换为layout对象，不进行布局分析评估
    server.post('/api/layout-from-actions', async (req, res) => {
      try {
        console.log('收到布局生成请求');
        
        const requestData = req.body;
        
        // 验证请求数据
        if (!requestData || !requestData.actions || !Array.isArray(requestData.actions)) {
          return res.status(400).json({ 
            success: false, 
            message: '无效的请求数据，actions必须是数组'
          });
        }
        
        // 构建布局分析API请求
        const apiRequest = {
          metadata: {
            canvasWidth: requestData.canvasWidth || 1024,
            canvasHeight: requestData.canvasHeight || 768,
            measurementMode: 'virtual' // 使用虚拟DOM测量，更轻量
          },
          actions: requestData.actions
        };
        
        // 动态导入API模块(仅在需要时加载)
        const { layoutAnalysisAPI } = await import('./src/app/utils/layoutAnalysisAPI.js');
        
        // 调用布局分析API生成布局
        const result = await layoutAnalysisAPI.evaluateLayout(apiRequest);
        
        if (!result.success) {
          return res.status(500).json({ 
            success: false, 
            message: result.error || '布局生成失败'
          });
        }
        
        // 处理输出格式
        const outputFormat = requestData.outputFormat || 'standard'; // 默认为标准格式
        
        if (outputFormat === 'eightElements') {
          // 转换为八要素格式
          try {
            // 动态导入转换工具
            const { convertToEightElementFormat } = await import('./src/app/utils/layoutToEightElements.js');
            
            // 将layout转换为八要素格式
            const eightElementLayout = convertToEightElementFormat(result.result.layout);
            
            // 返回八要素格式的布局
            return res.status(200).json({
              success: true,
              layout: eightElementLayout
            });
          } catch (conversionError) {
            console.error('转换为八要素格式失败:', conversionError);
            return res.status(500).json({
              success: false,
              message: '转换为八要素格式失败',
              error: conversionError.message
            });
          }
        } else {
          // 返回标准格式的布局
          res.status(200).json({
            success: true,
            layout: result.result.layout
          });
        }
      } catch (error) {
        console.error('布局生成错误:', error);
        res.status(500).json({ 
          success: false, 
          message: '处理布局数据时出错', 
          error: error.message 
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