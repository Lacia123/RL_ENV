import next from 'next';
import { createServer } from 'http';

// 判断是否为开发环境
const dev = !process.env.NODE_ENV;
const hostname = process.env.HOSTNAME || 'localhost';
const port = process.env.PORT || 3001;

// 创建Next.js应用实例
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// =====================================================
// 全局错误处理器 - 只输出到控制台
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
    console.error('⚠️  检测到 Next.js 内部错误（workers/Server Action）');
  }
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

// ✅ 监控内存使用，防止泄漏
let memoryCheckCount = 0;
setInterval(() => {
  const usage = process.memoryUsage();
  const heapUsedMB = Math.round(usage.heapUsed / 1024 / 1024);
  const heapTotalMB = Math.round(usage.heapTotal / 1024 / 1024);
  
  memoryCheckCount++;
  
  // 每10次检查（约5分钟）输出一次
  if (memoryCheckCount % 10 === 0) {
    console.log(`📊 内存使用: ${heapUsedMB}MB / ${heapTotalMB}MB`);
  }
  
  // 内存使用超过 1.5GB 时警告
  if (heapUsedMB > 1536) {
    console.warn(`⚠️  内存使用过高: ${heapUsedMB}MB`);
    console.warn('💡 建议检查是否有资源泄漏（Playwright browser/page）');
  }
  
  // 内存使用超过 4GB 时强制 GC（如果可用）
  if (heapUsedMB > 4096 && global.gc) {
    console.warn(`🗑️  触发垃圾回收 (${heapUsedMB}MB)`);
    global.gc();
  }
}, 30000); // 每30秒检查一次

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
  process.exit(1);
}); 