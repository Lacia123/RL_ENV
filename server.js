import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { parse } from 'url';
import next from 'next';

// // 配置Playwright的Chrome路径
// // Windows环境下的Chromium路径
// process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH = process.platform === 'win32' 
//   ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' 
//   : process.platform === 'linux'
//     ? '/usr/bin/google-chrome'
//     : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';


// 判断是否为开发环境
const dev = !process.env.NODE_ENV;
const hostname = process.env.HOSTNAME || 'localhost';
const port = process.env.PORT || 3002;


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
    // 健康检查接口
    server.get('/health/check', (req, res) => {
      const timestamp = new Date().toISOString();
      console.log(JSON.stringify({
        status: "ok",
        timestamp: timestamp
      }));
      res.status(200).json({
        status: "ok",
        timestamp: timestamp
      });
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
        const { markdownToEightElement } = await import(`./${dev ? 'src/app' : ''}/utils/eightElement/markdownToEightElement.js`);
        const { renderAndEvaluateEightElement } = await import(`./${dev ? 'src/app' : ''}/utils/eightElement/renderAndEvaluate.js`);
        
        // 处理seed参数，生成自定义设计令牌
        let designTokens = null;
        if (seed) {
          try {
            const { calculateTokens } = await import(`./${dev ? 'src/app' : ''}/utils/seeds/generateTokenBySeed.js`);
            // 使用seed参数生成设计令牌
            designTokens = calculateTokens(seed);
            console.log('使用自定义种子生成设计令牌:', seed);
            
            // 使用token解析器的动态token系统
            const { setDynamicTokenSystem } = await import(`./${dev ? 'src/app' : ''}/utils/tokens/resolveToken.js`);
            setDynamicTokenSystem(designTokens);
            console.log('已将设计令牌设置为动态token系统');
          } catch (tokenError) {
            console.warn('生成设计令牌失败，将使用默认令牌:', tokenError);
          }
        }
        
        // 转换Markdown为八要素结构
        const eightElement = markdownToEightElement(markdown);
                
        // 使用Playwright渲染并评分
        const result = await renderAndEvaluateEightElement(eightElement, { width, height });
        
        // 如果设置了动态token系统，需要清除
        if (designTokens) {
          try {
            const { clearDynamicTokenSystem } = await import(`./${dev ? 'src/app' : ''}/utils/tokens/resolveToken.js`);
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
          const { clearDynamicTokenSystem } = await import(`./${dev ? 'src/app' : ''}/utils/tokens/resolveToken.js`);
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
    
    // Markdown到八要素转换API
    server.post('/api/markdown-to-eight-element', async (req, res) => {
      try {
        console.log('收到Markdown转八要素请求');
        
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
        const { markdownToEightElement } = await import(`./${dev ? 'src/app' : ''}/utils/eightElement/markdownToEightElement.js`);
        const { renderEightElementToHtml } = await import(`./${dev ? 'src/app' : ''}/utils/eightElement/renderEightElementHtml.js`);
        
        // 处理seed参数，生成自定义设计令牌
        let designTokens = null;
        if (seed) {
          try {
            const { calculateTokens } = await import(`./${dev ? 'src/app' : ''}/utils/seeds/generateTokenBySeed.js`);
            // 使用seed参数生成设计令牌
            designTokens = calculateTokens(seed);
            console.log('使用自定义种子生成设计令牌:', seed);
            
            // 使用token解析器的动态token系统
            const { setDynamicTokenSystem } = await import(`./${dev ? 'src/app' : ''}/utils/tokens/resolveToken.js`);
            setDynamicTokenSystem(designTokens);
            console.log('已将设计令牌设置为动态token系统');
          } catch (tokenError) {
            console.warn('生成设计令牌失败，将使用默认令牌:', tokenError);
          }
        }
        
        try {
          // 转换Markdown为八要素结构
          const eightElement = markdownToEightElement(markdown);
                    
          // 预处理八要素结构以应用样式
          const { processedEightElement } = renderEightElementToHtml(eightElement, { width, height });
                    
          // 返回八要素结构
          res.status(200).json({
            success: true,
            eightElement: processedEightElement,
            originalEightElement: eightElement,
            designTokens: designTokens,
            tokensApplied: !!designTokens
          });
        } finally {
          // 确保清除动态token系统
          if (designTokens) {
            try {
              const { clearDynamicTokenSystem } = await import(`./${dev ? 'src/app' : ''}/utils/tokens/resolveToken.js`);
              clearDynamicTokenSystem();
              console.log('已清除动态token系统');
            } catch (error) {
              console.warn('清除动态token系统失败:', error);
            }
          }
        }
      } catch (error) {
        console.error('Markdown转八要素失败:', error);
        res.status(500).json({ 
          success: false, 
          error: 'Markdown转八要素失败', 
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