/**
 * 健康监控脚本 - 检测 workers 错误并自动重启
 */

import http from 'http';

const CHECK_INTERVAL = 60000; // 5分钟检查一次
const MAX_FAILURES = 3;
let failureCount = 0;
let lastSuccessTime = Date.now();

function checkHealth() {
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/health/check',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const req = http.request(options, (res) => {
    let responseData = '';
    
    // ✅ 读取响应体，防止连接挂起
    res.on('data', (chunk) => {
      responseData += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 200) {
        failureCount = 0;
        lastSuccessTime = Date.now();
        
        try {
          const data = JSON.parse(responseData);
          console.log(`✓ 健康检查通过 (${new Date().toLocaleTimeString()}) - 内存: ${data.memory?.heapUsed || 'N/A'}MB`);
        } catch {
          console.log(`✓ 健康检查通过 (${new Date().toLocaleTimeString()})`);
        }
      } else if (res.statusCode === 403) {
        failureCount++;
        console.error(`⚠️  检测到 403 错误 (${failureCount}/${MAX_FAILURES})`);
        
        if (failureCount >= MAX_FAILURES) {
          console.error('❌ 检测到 Server Actions registry 失效！');
          console.error('💡 建议立即重启服务：npm run dev 或 npm start');
          
          // 可选：自动重启
          process.exit(1);
        }
      }
    });
  });

  // ✅ 正确设置超时
  req.setTimeout(5000, () => {
    console.error('健康检查超时');
    req.destroy();
  });

  req.on('error', (error) => {
    // 忽略 ECONNRESET 错误（由 destroy 引起）
    if (error.code !== 'ECONNRESET') {
      console.error('健康检查失败:', error.message);
    }
  });

  req.write(JSON.stringify({ check: 'health' }));
  req.end();
}

// 启动定期检查
console.log('🏥 健康监控已启动');
console.log(`   检查间隔: ${CHECK_INTERVAL / 1000}秒`);
console.log(`   失败阈值: ${MAX_FAILURES}次`);

setInterval(checkHealth, CHECK_INTERVAL);

// 立即执行一次
setTimeout(checkHealth, 5000);
