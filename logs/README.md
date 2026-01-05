# 日志目录

这个目录包含各种类型的日志文件。

## 📋 API 请求日志

### api-requests.log

记录所有 POST 请求的详细信息，用于排查 403 等问题。

**查看日志：**
```bash
npm run logs              # 查看最后 10 条
npm run logs:tail         # 查看最后 20 条
npm run logs:errors       # 只看错误
npm run logs:403          # 只看 403 错误
npm run logs:stats        # 查看统计信息
```

**日志内容包括：**
- 请求时间、方法、路径
- 请求来源（Origin、Referer、User-Agent）
- 请求参数（Body）
- 响应状态码、耗时
- 响应数据
- 错误信息（如果有）

---

## 🔘 按钮样式错误日志

自动检测和记录的按钮样式错误日志。

## 功能说明

当使用markdown转八要素API时，系统会异步检测生成的页面中是否存在以下按钮样式问题：

1. **按钮超出容器边界** - 按钮位置超出了指定的页面宽高范围
2. **按钮文字溢出** - 按钮内的文字过长，超出了按钮的可用宽度

## 日志文件

- `button-style-errors.json` - 主要的日志文件，包含：
  - `buttonStyleError` - 累计检测到的按钮样式错误数量
  - `logs[]` - 详细的错误日志条目数组

## 日志格式

每个日志条目包含以下信息：

```json
{
  "timestamp": "2024-01-01T00:00:00.000Z",
  "seed": "example-seed-value",
  "dimensions": { "width": 1024, "height": 768 },
  "markdownHash": "abcd1234...",
  "buttonIssues": [
    {
      "id": "button-id",
      "textContent": "按钮文字内容",
      "isOverflowing": false,
      "hasTextOverflow": true,
      "position": { "x": 100, "y": 200 },
      "size": { "width": 120, "height": 40 }
    }
  ],
  "issueCount": 1
}
```

## API接口

### 查看统计信息

```bash
GET /api/button-style-stats
```

返回格式：
```json
{
  "success": true,
  "stats": {
    "totalButtonStyleErrors": 42,
    "recentLogs": [...]
  }
}
```

## 注意事项

1. 日志记录是异步进行的，不会影响API接口的响应速度
2. 系统会自动维护日志文件大小，最多保留1000条日志条目
3. 检测依赖于Playwright浏览器引擎，需要确保环境中已正确安装
4. 如果检测过程中出现错误，不会影响主要的API功能

## 故障排除

如果日志记录功能出现问题：

1. 检查logs目录是否有写入权限
2. 确认Playwright是否正确安装：`npx playwright install chromium`
3. 查看控制台输出中的相关错误信息 