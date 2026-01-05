import next from 'next';
import { createServer } from 'http';
import { logAPIRequest } from './src/app/utils/logging/apiLogger.js';

// 判断是否为开发环境
const dev = !process.env.NODE_ENV;
const hostname = process.env.HOSTNAME || 'localhost';
const port = process.env.PORT || 3001;

// 创建Next.js应用实例
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// =====================================================
// 全局错误处理器 - 记录到 API 日志
// =====================================================

function logServerError(type, error, context = {}) {
  const timestamp = new Date().toISOString();
  
  // 输出到控制台
  console.error(`\n${'='.repeat(80)}`);
  console.error(`❌ [${timestamp}] ${type.toUpperCase()}`);
  console.error(`${'='.repeat(80)}`);
  console.error('错误:', error.message);
  console.error('内存使用:', {
    rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`,
    heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
  });
  console.error('运行时间:', `${Math.round(process.uptime())}秒`);
  if (Object.keys(context).length > 0) {
    console.error('上下文:', context);
  }
  console.error('堆栈:', error.stack);
  console.error(`${'='.repeat(80)}\n`);
  
  // 检测关键错误
  if (error.message.includes('workers') || 
      error.message.includes('Server Action') ||
      error.message.includes('deployment')) {
    console.error('⚠️  检测到 Next.js 内部错误（workers/Server Action），这可能与资源泄漏相关！');
  }
  
  // 记录到 API 日志文件
  logAPIRequest({
    method: 'SERVER_ERROR',
    path: context.url || type,
    origin: 'server',
    referer: 'none',
    userAgent: `Node.js ${process.version}`,
    body: {
      errorType: type,
      errorName: error.name,
      context: context
    },
    status: 500,
    duration: 0,
    response: null,
    error: {
      message: error.message,
      stack: error.stack
    }
  });
}

// 捕获未处理的 Promise 拒绝
process.on('unhandledRejection', (reason, promise) => {
  const error = reason instanceof Error ? reason : new Error(String(reason));
  logServerError('unhandledRejection', error, {
    promise: String(promise)
  });
});

// 捕获未捕获的异常
process.on('uncaughtException', (error, origin) => {
  logServerError('uncaughtException', error, { 
    origin,
    critical: true 
  });
});

// 启动Next.js服务器
app.prepare().then(() => {
  const server = createServer((req, res) => {
    // 简洁日志：只记录 API 请求
    if (req.url.startsWith('/api/')) {
      const start = Date.now();
      
      // 响应完成时记录
      res.on('finish', () => {
        const duration = Date.now() - start;
        const status = res.statusCode;
        const icon = status === 200 ? '✓' : (status === 403 ? '⚠' : '✗');
        console.log(`[${new Date().toLocaleTimeString()}] ${icon} ${req.method} ${req.url} ${status} ${duration}ms`);
        
        // 如果是错误状态，记录到日志文件
        if (status >= 400) {
          logAPIRequest({
            method: req.method,
            path: req.url,
            origin: req.headers.origin || 'none',
            referer: req.headers.referer || 'none',
            userAgent: req.headers['user-agent'] || 'none',
            body: null, // 无法获取已消费的请求体
            status: status,
            duration: duration,
            response: { 
              note: '通过 server.js 记录的错误响应',
              statusCode: status,
              statusText: status === 403 ? 'Forbidden' : status === 404 ? 'Not Found' : 'Error'
            },
            error: status >= 500 ? {
              message: `服务器返回 ${status} 错误`,
              stack: null
            } : null
          });
        }
      });
    }
    
    // 捕获 Next.js 处理错误
    return handle(req, res).catch((err) => {
      const errorMessage = err.message || String(err);
      
      console.error('❌ Next.js 处理请求错误:', {
        url: req.url,
        method: req.method,
        error: errorMessage,
        stack: err.stack
      });
      
      // 特别标记 workers 相关错误
      if (errorMessage.includes('workers') || 
          errorMessage.includes('Server Action') ||
          errorMessage.includes('deployment')) {
        console.error('⚠️  这是与 Server Action/workers 相关的错误！');
      }
      
      // 记录到日志文件
      logAPIRequest({
        method: req.method,
        path: req.url,
        origin: req.headers.origin || 'none',
        referer: req.headers.referer || 'none',
        userAgent: req.headers['user-agent'] || 'none',
        body: null,
        status: 500,
        duration: 0,
        response: null,
        error: {
          message: errorMessage,
          stack: err.stack,
          type: 'Next.js Handler Error'
        }
      });
      
      // 如果响应还没发送，返回 500
      if (!res.headersSent) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ 
          error: 'Internal Server Error',
          message: dev ? errorMessage : 'An error occurred'
        }));
      }
    });
  });

  // 监听服务器错误
  server.on('error', (err) => {
    console.error('❌ 服务器错误:', err.message);
    
    // 记录到日志文件
    logServerError('serverError', err, {
      port: port,
      hostname: hostname
    });
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`
┌─────────────────────────────────────────────────┐
│                                                 │
│   🚀 服务器已启动!                               │
│                                                 │
│   - 本地访问地址: http://${hostname}:${port}     │
│   - 模式: ${dev ? '开发环境' : '生产环境'}        │
│   - API Routes已启用                            │
│                                                 │
└─────────────────────────────────────────────────┘
    `);
  });
}).catch((ex) => {
  console.error('❌ Next.js 启动失败:', ex.stack);
  
  // 记录启动错误到日志
  logServerError('appPrepareError', ex, {
    phase: 'startup',
    critical: true
  });
  
  process.exit(1);
}); 