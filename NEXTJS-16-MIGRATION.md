# Next.js 16 迁移指南

## ✅ 已完成的修复

### 1. 配置文件更新 (`next.config.js`)

#### Turbopack 配置
```javascript
// ✅ Turbopack 会自动处理 serverExternalPackages
// 不需要手动配置 resolveAlias
turbopack: {}
```

**注意**：不要在 `turbopack.resolveAlias` 中使用布尔值（如 `false`），这会导致构建错误。Turbopack 通过 `serverExternalPackages` 自动处理服务端专用模块。

#### serverActions 配置位置
- ❌ 之前（错误）：顶级配置 `serverActions: { ... }`
- ✅ 现在（正确）：在 `experimental` 中
```javascript
experimental: {
  serverActions: {
    bodySizeLimit: '20mb'
  }
}
```

#### 服务端专用包
```javascript
serverExternalPackages: [
  'playwright-chromium', 
  'jsdom',
  'canvas',
  'vm',
  'tough-cookie',
  // ... 其他 Node.js 专用包
]
```

### 2. API Routes 更新

移除了已弃用的 `export const config` 配置：
- `src/app/api/markdown-to-eight-element/route.js`
- `src/app/api/markdown-evaluate/route.js`

### 3. 图表生成器修复 (`chartGenerator.js`)

#### 问题
jsdom 在客户端构建时被 Turbopack 分析，导致构建失败。

#### 解决方案
```javascript
// 使用 eval('require') 避免 Turbopack 静态分析
const jsdomModule = eval('require')('jsdom');
```

### 4. Middleware 删除

- 删除了已弃用的 `src/middleware.js`
- Next.js 16 使用新的 proxy 约定
- 日志功能已由 `server.js` 实现

## 🎯 关键变更

### Next.js 16 vs Next.js 15

| 特性 | Next.js 15 | Next.js 16 |
|------|------------|------------|
| 默认构建工具 | Webpack | Turbopack |
| middleware | ✅ 支持 | ❌ 已弃用（改用 proxy） |
| serverActions | experimental | experimental（但位置可能变化） |
| API config | ✅ 支持 | ❌ 已移除 |
| Node.js 模块 | webpack fallback | turbopack resolveAlias |

## 🚀 构建命令

### 使用 Turbopack（推荐）
```bash
npm run build
npm run dev
```

### 使用 Webpack（如果遇到问题）
```bash
npm run build -- --webpack
npm run dev -- --webpack
```

## ⚠️ 注意事项

### 1. jsdom 使用限制
- jsdom 只能在**服务端**使用
- 客户端组件不能直接导入使用 jsdom 的模块
- 使用 `eval('require')` 避免 Turbopack 静态分析

### 2. 模块解析
- Turbopack 的模块解析与 Webpack 不同
- 使用 `turbopack.resolveAlias` 替代 `webpack.resolve.fallback`
- 使用 `serverExternalPackages` 标记服务端专用包

### 3. 构建错误排查
如果遇到构建错误：
1. 清理缓存：`rm -rf .next node_modules/.cache`
2. 重装依赖：`npm install`
3. 检查错误追踪中的模块导入路径
4. 确认模块是否只在服务端使用

## 📊 性能提升

Turbopack 带来的改进：
- ✅ 构建速度提升 10x
- ✅ HMR（热更新）更快
- ✅ 内存占用更低
- ✅ 原生支持 TypeScript/JSX

## 🔧 常见问题

### Q: "Module not found: Can't resolve 'fs'"
**A:** 这是 Node.js 模块在客户端被导入的问题。
- 检查是否有客户端组件导入了服务端专用模块
- 将该模块添加到 `serverExternalPackages`
- 使用 `eval('require')` 进行动态导入，避免静态分析

### Q: "Unrecognized key(s) in object: 'serverActions'"
**A:** Next.js 16 中 `serverActions` 配置位置有变化。
- 将 `serverActions` 放在 `experimental` 对象中
- 不要作为顶级配置

### Q: "boolean values are invalid in exports field entries"
**A:** 不要在 `turbopack.resolveAlias` 中使用布尔值。
```javascript
// ❌ 错误
turbopack: {
  resolveAlias: {
    'jsdom': false  // 不要这样做
  }
}

// ✅ 正确
turbopack: {}  // 让 Turbopack 自动处理
serverExternalPackages: ['jsdom']  // 通过这个配置
```

### Q: 构建时 Turbopack 错误
**A:** 
1. 移除 `turbopack.resolveAlias` 中的布尔值
2. 使用 `eval('require')` 避免静态分析
3. 确保 `serverExternalPackages` 配置正确
4. 或使用 `--webpack` 标志回退到 Webpack

## 📝 迁移清单

- [x] 更新 `next.config.js` 添加 Turbopack 配置
- [x] 移除 API routes 中的 `config.api`
- [x] 修复 `serverActions` 配置位置
- [x] 删除 `src/middleware.js`
- [x] 修复 `chartGenerator.js` 的 jsdom 导入
- [x] 添加 `serverExternalPackages` 配置
- [x] 测试构建是否成功

## 🎉 完成！

你的项目已成功迁移到 Next.js 16！
