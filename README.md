# 布局分析系统

一个基于 Next.js 和 Express 的布局分析应用，支持服务器端渲染 (SSR) 和直接 API 集成。

## 功能特点

- 布局评估与分析
- 多维度设计评分
- 服务器端渲染 (SSR)
- Express API 集成
- 客户端和服务器组件分离

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发环境

```bash
# 使用 Express + Next.js SSR (推荐)
npm run dev

# Windows用户
npm run dev:win

# 仅使用 Next.js 开发服务器
npm run dev:next
```

### 构建生产版本

```bash
npm run build
```

### 启动生产环境

```bash
# 使用 Express + Next.js SSR
npm start

# Windows用户
npm run start:win
```

## 服务器架构

该应用使用双重架构实现了高性能和灵活性：

1. **Express 服务器** - 作为主要入口点，处理以下内容：
   - 提供静态文件服务
   - API 端点实现
   - 性能监控
   - 路由代理到 Next.js

2. **Next.js SSR** - 处理：
   - 页面渲染
   - 服务器组件
   - 布局分析
   - 动态路由

## 布局分析 API

布局分析可以通过以下方式进行：

1. **直接在服务器组件中**：
   ```javascript
   import { evaluateLayoutOnServer } from '../api/layout-analysis/server-utils';
   const result = await evaluateLayoutOnServer(layoutData);
   ```

2. **通过 API 调用**：
   ```javascript
   const response = await fetch('/api/layout-analysis', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(layoutData)
   });
   ```

## 开发模式

开发时可以选择以下两种模式：

1. **完整的 SSR 模式**：使用 `npm run dev` 启动 Express + Next.js
2. **单独的 Next.js 模式**：使用 `npm run dev:next` 只启动 Next.js

## 许可证

MIT
