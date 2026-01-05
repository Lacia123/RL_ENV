# 🔍 服务器错误日志说明

## 📌 功能说明

`server.js` 现在会将所有服务器级错误记录到 `logs/api-requests.log` 文件中，包括：

### 1. **Next.js 处理错误**
当 Next.js 处理请求时发生错误，包括 "workers" 相关错误：
```
Error: Failed to find Server Action "x". 
Original error: Cannot read properties of undefined (reading 'workers')
```

### 2. **未捕获的异常 (uncaughtException)**
Node.js 进程中任何未被 try-catch 捕获的错误

### 3. **未处理的 Promise 拒绝 (unhandledRejection)**
Promise 被 reject 但没有 .catch() 处理的情况

### 4. **HTTP 错误响应 (4xx/5xx)**
所有 API 请求返回错误状态码时自动记录

### 5. **服务器启动错误**
服务器无法启动时的错误

## 📋 日志格式

所有错误都会以统一格式记录到 `logs/api-requests.log`：

```
================================================================================
[2024-01-15T10:30:45.123Z] SERVER_ERROR unhandledRejection
================================================================================
📥 REQUEST:
  - Origin: server
  - Referer: none
  - User-Agent: Node.js v20.x.x
  - Body: {
      "errorType": "unhandledRejection",
      "errorName": "Error",
      "context": { ... }
    }

📤 RESPONSE:
  - Status: 500
  - Duration: 0ms
  - Data: null

❌ ERROR:
  - Message: Cannot read properties of undefined (reading 'workers')
  - Stack: Error: Cannot read properties...
      at measureWithPlaywright (...)
      at ...
================================================================================
```

## 🔍 如何查看日志

### 查看所有错误（包括服务器错误）

```bash
npm run logs:errors
```

### 查看最近的日志

```bash
npm run logs:tail
```

### 查看统计信息

```bash
npm run logs:stats
```

### 直接查看日志文件

```bash
# Windows
type logs\api-requests.log

# 查找特定错误
Select-String -Path logs\api-requests.log -Pattern "workers"
Select-String -Path logs\api-requests.log -Pattern "Server Action"
Select-String -Path logs\api-requests.log -Pattern "SERVER_ERROR"
```

## 🎯 识别 Workers 相关错误

日志中 workers 相关的错误会有特殊标记：

### 在控制台中
```
⚠️  检测到 Next.js 内部错误（workers/Server Action），这可能与资源泄漏相关！
```

### 在日志文件中搜索
```bash
# 搜索 workers 错误
Select-String -Path logs\api-requests.log -Pattern "workers" -Context 5,5

# 搜索 Server Action 错误
Select-String -Path logs\api-requests.log -Pattern "Server Action" -Context 5,5

# 搜索所有服务器错误
Select-String -Path logs\api-requests.log -Pattern "SERVER_ERROR" -Context 2,10
```

## 📊 错误类型说明

### SERVER_ERROR 类型

1. **uncaughtException**
   ```
   method: "SERVER_ERROR"
   path: "uncaughtException"
   ```
   - 最严重的错误
   - 通常需要立即处理
   - 可能导致进程崩溃

2. **unhandledRejection**
   ```
   method: "SERVER_ERROR"
   path: "unhandledRejection"
   ```
   - Promise 错误未处理
   - 可能导致内存泄漏
   - 需要检查异步代码

3. **Next.js Handler Error**
   ```
   method: "GET" or "POST"
   path: "/api/xxx"
   error.type: "Next.js Handler Error"
   ```
   - 请求处理时的错误
   - workers 错误通常出现在这里

4. **serverError**
   ```
   method: "SERVER_ERROR"
   path: "serverError"
   ```
   - 服务器底层错误
   - 如端口被占用、权限问题等

## 🔬 调试 Workers 错误

### 步骤 1: 启动服务器
```bash
npm run dev
```

### 步骤 2: 复现问题
正常使用应用，等待错误出现

### 步骤 3: 检查日志
```bash
# 查看是否有 workers 错误
Select-String -Path logs\api-requests.log -Pattern "workers"
```

### 步骤 4: 分析错误堆栈
在日志中找到完整的错误堆栈：
```
❌ ERROR:
  - Message: Cannot read properties of undefined (reading 'workers')
  - Stack: Error: ...
      at <具体文件和行号>
```

### 步骤 5: 检查内存使用
当 workers 错误出现时，通常伴随内存问题：

```powershell
# 持续监控内存
while ($true) { 
  $proc = Get-Process node -ErrorAction SilentlyContinue | Select -First 1
  if ($proc) {
    $mem = [math]::Round($proc.WorkingSet / 1MB, 2)
    Write-Host "$(Get-Date -Format 'HH:mm:ss') - Memory: $mem MB"
  }
  Start-Sleep -Seconds 5
}
```

## 💡 常见问题

### Q: 为什么有些错误显示 `body: null`？

A: 在 `server.js` 层面捕获错误时，请求体可能已经被 Next.js 消费，无法再次读取。API 路由中的错误会包含完整的请求体。

### Q: workers 错误一定会被记录吗？

A: 是的。我们在三个层面捕获：
1. `process.on('uncaughtException')` - 最外层
2. `process.on('unhandledRejection')` - Promise 层
3. `handle(req, res).catch()` - 请求处理层

### Q: 如何清空日志？

A: 日志文件会自动管理（超过 7 天自动备份），也可以手动删除：
```bash
del logs\api-requests.log
```

### Q: 日志文件会无限增长吗？

A: 不会。日志记录器会：
- 截断超过 2000 字符的请求体/响应
- 不记录 base64 图片数据
- 超过 7 天自动备份旧日志

## 📈 监控最佳实践

### 开发环境
保持终端开启，观察实时日志：
```bash
npm run dev
```

### 生产环境
定期检查日志统计：
```bash
npm run logs:stats
```

如果发现错误率上升，立即检查：
```bash
npm run logs:errors
```

### 长期运行
每天检查一次日志文件大小和错误数量：
```powershell
# 查看文件大小
Get-Item logs\api-requests.log | Select Name, @{N="Size(MB)";E={[math]::Round($_.Length/1MB,2)}}

# 统计错误数量
(Select-String -Path logs\api-requests.log -Pattern "❌ ERROR").Count
```

## 🚨 关键错误告警

以下错误出现时需要立即处理：

1. **workers 错误频繁出现**
   - 表明资源泄漏严重
   - 检查 Playwright 等资源是否正确关闭

2. **内存持续增长**
   - 配合 workers 错误通常表示浏览器实例泄漏
   - 重启服务器，检查代码中的 try-finally

3. **uncaughtException 重复出现**
   - 代码中存在未处理的错误
   - 需要添加 try-catch 或 .catch()

4. **403 错误突增**
   - 可能与资源耗尽相关
   - 检查是否伴随 workers 错误

---

**记住：** 所有错误现在都会被记录，不会再丢失任何线索！
