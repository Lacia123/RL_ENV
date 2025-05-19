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



```
正文的字体的大小变化切换太快， 最好有一个字体的梯度，可以参考飞书的字体。
笔试题： 代码片段不能显示。数学公式不能显示。最好后续支持 xmind , draw.io文件格式。
折线图： 带图带数字的可以下面附表格。
工作总结： 字体没有区分。需要修改提示词， 输出正确的Markdown文档。
会议纪要：底色是否可以定制，底色是否全部白色？待确认。
八要素测试文档示例： 显示效果比较好。
后续提需求，修改提示词，更好的生成Markdown 文档。
增加数学公式的显示。目前deepseek对这块的输出结果比较好， 可以增加相关的场景对结果进行使用。
```

