import next from 'next';
import { createServer } from 'http';

// 判断是否为开发环境
const dev = !process.env.NODE_ENV;
const hostname = process.env.HOSTNAME || 'localhost';
const port = process.env.PORT || 3002;

// 创建Next.js应用实例
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// 启动Next.js服务器
app.prepare().then(() => {
  createServer((req, res) => {
    return handle(req, res);
  }).listen(port, (err) => {
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
  console.error(ex.stack);
  process.exit(1);
}); 