# 动作空间API接口文档

本文档描述了三个基于新动作空间系统的API接口，用于替代基于seed的旧接口系统。这些接口独立于现有的seed接口，支持更精细的设计调控。

## 概述

新的动作空间系统包含：
- **45个动作**：分为形态、色彩、字体、质感、比例、状态、智能、动画、可访问性等9个类别
- **布局调控**：基于索引的精确layout方向调控
- **冲突检测**：自动检测和报告动作之间的冲突
- **强度控制**：所有动作和布局调控支持0-1的强度调节

---

## 1. 获取动作信息接口

### 接口地址
```
POST /api/markdown-actions
```

### 接口描述
传入markdown内容，获取当前可用的动作列表、动作分类、layout调控信息等。

### 请求参数
```json
{
  "markdown": "string, 必填 - Markdown内容",
  "width": "number, 可选 - 页面宽度，默认1024",
  "height": "number, 可选 - 页面高度，默认768"
}
```

### 响应格式
```json
{
  "success": true,
  "data": {
    "actions": {
      "available": ["increaseRoundness", "decreaseRoundness", ...],
      "categories": {
        "form": ["increaseRoundness", "decreaseRoundness", ...],
        "color": ["increaseBrandColor", "decreaseBrandColor", ...],
        "typography": ["increaseInfoDensity", "decreaseInfoDensity", ...],
        "material": ["increaseShadowDepth", "decreaseShadowDepth", ...],
        "proportion": ["increaseSpacing", "decreaseSpacing", ...],
        "state": ["applySuccessState", "applyErrorState", ...],
        "adaptive": ["adaptToContext", "responsiveScale"],
        "animation": ["addMicroInteractions", "removeAnimations"],
        "accessibility": ["enhanceAccessibility"]
      },
      "details": {
        "increaseRoundness": {
          "name": "增加圆润度",
          "category": "form",
          "intensity": "moderate",
          "effects": {
            "borderRadius": "increase",
            "clipPath": "soften"
          },
          "conflicts": ["decreaseRoundness"]
        }
        // ... 其他动作详情
      },
      "conflicts": {
        "increaseRoundness": ["decreaseRoundness"],
        "applySuccessState": ["applyErrorState", "applyWarningState"]
        // ... 其他冲突信息
      },
      "totalCount": 45
    },
    "layouts": {
      "available": [
        {
          "index": 0,
          "variant": "row",
          "childrenCount": 3,
          "layoutDirection": "HORIZONTAL",
          "content": {
            "preview": "标题1, 按钮1, 图片",
            "full": "标题1, 按钮1, 图片"
          },
          "path": "root/0",
          "depth": 1
        }
      ],
      "totalCount": 2,
      "description": "每个layout可通过索引进行方向调控，强度0-0.5为column(垂直)，0.5-1.0为row(水平)"
    },
    "elements": {
      "types": [
        {
          "type": "text",
          "variant": "h1",
          "count": 2,
          "path": "root/0/heading"
        }
      ],
      "totalCount": 8
    },
    "source": {
      "markdown": "# 示例标题\n这是一些示例内容...",
      "eightElementId": "dd-12345678-1234-4567-8901-123456789012",
      "analysisTimestamp": "2024-01-15T10:30:00.000Z",
      "dimensions": { "width": 1024, "height": 768 }
    }
  }
}
```

### 动作分类说明
- **form（形态）**: 控制圆润度、复杂度、轮廓等视觉形态
- **color（色彩）**: 调整品牌色彩、明暗主题
- **typography（字体）**: 调节信息密度、文字强度、对齐方式
- **material（质感）**: 控制阴影深度、纹理、透明度
- **proportion（比例）**: 调整空间感、边缘张力、视觉重量
- **state（状态）**: 应用不同的状态颜色（成功、错误、警告等）
- **adaptive（智能）**: 自适应和响应式调整
- **animation（动画）**: 微动效和动画控制
- **accessibility（可访问性）**: 无障碍功能增强

---

## 2. 基于动作的评分接口

### 接口地址
```
POST /api/markdown-evaluate-actions
```

### 接口描述
使用动作系统对markdown进行渲染并评分，替代基于seed的评分方式。

### 请求参数
```json
{
  "markdown": "string, 必填 - Markdown内容",
  "width": "number, 可选 - 页面宽度，默认1024",
  "height": "number, 可选 - 页面高度，默认768",
  "useAims": "boolean, 可选 - 是否使用AIMS评估，默认false",
  "takeScreenshot": "boolean, 可选 - 是否生成截图，默认false",
  "actions": [
    {
      "name": "string, 必填 - 动作名称",
      "intensity": "number, 必填 - 动作强度 (0-1)"
    }
  ],
  "layoutControls": [
    {
      "layoutIndex": "number, 必填 - layout索引",
      "intensity": "number, 必填 - 调控强度 (0-1，0-0.5为column，0.5-1.0为row)"
    }
  ]
}
```

### 请求示例
```json
{
  "markdown": "# 示例页面\n\n这是一个示例按钮：[点击这里](https://example.com)\n\n## 子标题\n\n更多内容...",
  "width": 1024,
  "height": 768,
  "useAims": true,
  "takeScreenshot": true,
  "actions": [
    {
      "name": "increaseRoundness",
      "intensity": 0.8
    },
    {
      "name": "applySuccessState",
      "intensity": 0.6
    },
    {
      "name": "enhanceVisualStrength",
      "intensity": 0.7
    }
  ],
  "layoutControls": [
    {
      "layoutIndex": 0,
      "intensity": 0.9
    }
  ]
}
```

### 响应格式
```json
{
  "success": true,
  "score": {
    // 详细评分数据
  },
  "aims": {
    // AIMS评估结果（如果启用）
  },
  "base64Image": "data:image/png;base64,iVBORw0KGgoAAAA...",
  "appliedActions": [
    { "name": "increaseRoundness", "intensity": 0.8 }
  ],
  "appliedLayoutControls": [
    { "layoutIndex": 0, "intensity": 0.9 }
  ],
  "actionSystemUsed": true,
  "layoutControlsUsed": true,
  "tokensApplied": false,
  "designTokens": null
}
```

---

## 3. 基于动作的生成八要素接口

### 接口地址
```
POST /api/markdown-to-eight-element-actions
```

### 接口描述
使用动作系统将markdown转换为八要素结构，替代基于seed的生成方式。

### 请求参数
```json
{
  "markdown": "string, 必填 - Markdown内容",
  "width": "number, 可选 - 页面宽度，默认1024",
  "height": "number, 可选 - 页面高度，默认768",
  "actions": [
    {
      "name": "string, 必填 - 动作名称",
      "intensity": "number, 必填 - 动作强度 (0-1)"
    }
  ],
  "layoutControls": [
    {
      "layoutIndex": "number, 必填 - layout索引",
      "intensity": "number, 必填 - 调控强度 (0-1)"
    }
  ]
}
```

### 响应格式
```json
{
  "success": true,
  "eightElement": {
    // 处理后的八要素结构
  },
  "originalEightElement": {
    // 原始八要素结构（未应用动作前）
  },
  "appliedActions": [
    { "name": "increaseRoundness", "intensity": 0.8 }
  ],
  "appliedLayoutControls": [
    { "layoutIndex": 0, "intensity": 0.9 }
  ],
  "actionSystemUsed": true,
  "layoutControlsUsed": true,
  "pageElements": [
    // 页面元素分析结果（不包含layout）
  ],
  "layoutsAvailable": [
    // 可用的layout信息
  ],
  "tokensApplied": false,
  "designTokens": null
}
```

---

## 使用流程示例

### 1. 获取动作信息
```javascript
// 获取markdown的动作信息
const actionsResponse = await fetch('/api/markdown-actions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    markdown: '# 我的页面\n\n[按钮](https://example.com)'
  })
});

const actionsData = await actionsResponse.json();
console.log('可用动作:', actionsData.data.actions.available);
console.log('可用布局:', actionsData.data.layouts.available);
```

### 2. 应用动作并评分
```javascript
// 应用动作并评分
const evaluateResponse = await fetch('/api/markdown-evaluate-actions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    markdown: '# 我的页面\n\n[按钮](https://example.com)',
    takeScreenshot: true,
    actions: [
      { name: 'increaseRoundness', intensity: 0.8 },
      { name: 'applySuccessState', intensity: 0.6 }
    ],
    layoutControls: [
      { layoutIndex: 0, intensity: 0.7 } // 调整为水平布局
    ]
  })
});

const evaluateData = await evaluateResponse.json();
console.log('评分结果:', evaluateData.score);
```

### 3. 生成八要素结构
```javascript
// 生成八要素结构
const generateResponse = await fetch('/api/markdown-to-eight-element-actions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    markdown: '# 我的页面\n\n[按钮](https://example.com)',
    actions: [
      { name: 'enhanceVisualStrength', intensity: 0.9 }
    ]
  })
});

const generateData = await generateResponse.json();
console.log('八要素结构:', generateData.eightElement);
```

---

## 错误处理

所有接口在出错时返回统一格式：
```json
{
  "success": false,
  "error": "错误类型",
  "message": "详细错误信息"
}
```

常见错误：
- `markdown参数为必填项`: 未提供markdown参数
- `动作强度超出范围 [0,1]`: 动作强度不在有效范围内
- `动作不存在`: 提供的动作名称不存在
- `布局索引不存在`: 提供的布局索引无效
- `基于动作的Markdown评分失败`: 评分过程中出现错误

---

## 注意事项

1. **动作冲突**: 系统会自动检测动作冲突，冲突的动作会在日志中警告但不会阻止执行
2. **强度范围**: 所有强度参数必须在0-1范围内
3. **布局调控**: layout强度0-0.5对应垂直布局(column)，0.5-1.0对应水平布局(row)
4. **兼容性**: 新接口完全独立于现有的seed接口，不会影响原有功能
5. **性能**: 动作应用是实时计算，复杂的动作组合可能需要更多处理时间
6. **验证**: 所有参数都会进行严格验证，无效参数会被过滤并记录警告

---

## 动作参考表

### 形态动作 (form)
- `increaseRoundness` / `decreaseRoundness` - 调整圆润度
- `increaseComplexity` / `decreaseComplexity` - 调整形态复杂度
- `strengthenOutline` / `weakenOutline` - 调整轮廓强度
- `makeExtremeRounded` / `makeAngular` - 极致圆角/棱角

### 色彩动作 (color)
- `increaseBrandColor` / `decreaseBrandColor` - 调整品牌色强度
- `brightenTheme` / `darkenTheme` - 调整主题明暗

### 字体动作 (typography)
- `increaseInfoDensity` / `decreaseInfoDensity` - 调整信息密度
- `enhanceVisualStrength` / `softenVisualStrength` - 调整视觉强度
- `centerAlignment` / `leftAlignment` / `rightAlignment` - 调整文字对齐

### 质感动作 (material)
- `increaseShadowDepth` / `decreaseShadowDepth` - 调整阴影深度
- `increaseTexture` / `decreaseTexture` - 调整纹理
- `increaseTransparency` / `decreaseTransparency` - 调整透明度

### 比例动作 (proportion)
- `increaseSpacing` / `decreaseSpacing` - 调整空间感
- `increaseEdgeTension` / `decreaseEdgeTension` - 调整边缘张力
- `increaseVisualWeight` / `decreaseVisualWeight` - 调整视觉重量

### 状态动作 (state)
- `applySuccessState` - 应用成功状态
- `applyErrorState` - 应用错误状态
- `applyWarningState` - 应用警告状态
- `applyDisableState` - 应用禁用状态
- `applyInfoState` - 应用信息状态

### 智能动作 (adaptive)
- `adaptToContext` - 自适应调整
- `responsiveScale` - 响应式缩放

### 动画动作 (animation)
- `addMicroInteractions` - 添加微动效
- `removeAnimations` - 移除动画

### 可访问性动作 (accessibility)
- `enhanceAccessibility` - 增强无障碍功能



```
# 八要素测试文档\n\n## 基本元素\n\n### 左侧标题\n这是一段普通文本，将被转换为text元素。\n\n### 右侧标题\n\n#### 四级标题\n四级标题正文四级标题正文四级标题正文四级标题正文四级标题正文四级标题正文\n\n##### 五级标题\n五级标题正文五级标题正文五级标题正文五级标题正文五级标题正文五级标题正文\n\n###### 六级标题\n六级标题正文六级标题正文六级标题正文六级标题正文六级标题正文六级标题正文\n\n> 这是一段引用文本，展示重要的观点或引述\n\n### 按钮（超链接）\n<layout:row>\n[确认](https://example.com)\n[取消](https://example.com)\n</layout:row>\n\n### 示例图片\n![示例图片](https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg)\n\n### 代码块示例\n下面是一个JavaScript代码示例：\n\n```javascript\nfunction greeting(name) {\n  return `Hello, ${name}!`;\n}\n\n// 调用函数\nconst message = greeting('World');\nconsole.log(message);  // 输出: Hello, World!\n```\n\n### 数学公式示例\n行内公式：$E = mc^2$\n\n块级公式：\n$$ \\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi} $$\n\n我们还可以有更复杂的公式，例如：\n$$ L = \\frac{1}{2} \\rho v^2 S C_L $$\n\n这是一个关于升力的公式。行内也可以混合：例如 $\\alpha + \\beta = \\gamma$。\n\n### 表格示例\n下面是一个简单的表格示例：\n\n| 功能 | 描述 | 支持状态 |\n| --- | --- | :---: |\n| 文本 | 支持普通文本和标题 | ✅ |\n| 按钮 | 支持超链接按钮 | ✅ |\n| 图片 | 支持图片显示 | ✅ |\n| 表格 | 支持表格渲染和样式 | ✅ |\n| 代码块 | 支持代码高亮显示 | ✅ |\n| 图表 | 支持数据可视化图表 | ✅ |\n| 混合内容 | 支持在一行中文本 | ✅ |\n| 数学公式 | 支持行内和块级公式 | ✅ |\n\n### 图表示例\n下面是一个分组折线图示例：\n\n[chart:grouped_line]| 日期 | 心流满意度FSV | 心流专注值FFV | 心流效能值FEV |\n| --- | --- | --- | --- |\n| 2025-03-10 | 0.0 | 0.36 | 2.55 |\n| 2025-03-11 | 0.0 | 0.41 | 2.22 |\n| 2025-03-12 | 0.0 | 0.36 | 2.64 |\n| 2025-03-13 | 0.0 | 0.32 | 2.94 |\n| 2025-03-14 | 0.0 | 0.48 | 1.87 |\n| 2025-03-17 | 0.0 | 0.42 | 2.16 |\n| 2025-03-18 | 0.0 | 0.41 | 2.28 |\n| 2025-03-19 | 0.0 | 0.31 | 2.97 |\n| 2025-03-20 | 0.0 | 0.41 | 2.18 |\n| 2025-03-21 | 0.0 | 0.56 | 1.52 |\n| 2025-03-24 | 0.0 | 0.34 | 2.67 |\n| 2025-03-25 | 0.0 | 0.61 | 1.52 |\n| 2025-03-26 | 0.0 | 0.51 | 1.85 |\n| 2025-03-27 | 0.0 | 0.29 | 3.25 |\n| 2025-03-28 | 0.0 | 0.5 | 1.92 |\n| 2025-03-31 | 0.0 | 0.32 | 3.02 |\n| 2025-04-01 | 0.0 | 0.35 | 2.74 |\n| 2025-04-02 | 0.0 | 0.54 | 1.72 |\n| 2025-04-03 | 0.0 | 0.48 | 1.98 |\n\n下面是一个水平柱状图示例：\n\n[chart:barh]| 部门 | 销售额 |\n| --- | --- |\n| 销售部 | 1250 |\n| 市场部 | 980 |\n| 技术部 | 750 |\n| 客服部 | 620 |\n| 行政部 | 450 |\n\n### 指标定义\n- **FSV** (FSV = 用户满意度评分 / 每日心流空间交互次数): 衡量美学交互的心流满意度，数值越高表示每次交互带来的用户满意度越高。\n- **FFV** (FFV = 每日心流空间服务总时长 / 每日心流空间交互次数): 衡量意图协同的心流专注值，数值越高表示用户在每次互动时保持的专注度越长。\n- **FEV** (FEV = 每日心流空间服务总次数 / 每日心流空间总时长): 衡量效能跃迁的心流效能值，数值越高表示服务使用效率越高。\n\n1. **高斯定律（Integral Form）**  \n   - 磁场的通量：  \n     $$ \\oint \\mathbf{B} \\cdot d\\mathbf{l} = \\frac{Q_{enc}}{\\varepsilon_0} $$\n\n2. **法拉第电磁感应定律（Integral Form）**  \n   - 电场的旋度等于变化磁场：  \n     $$ \\nabla \\times \\mathbf{E} = -\\frac{\\partial \\mathbf{B}}{\\partial t} $$\n\n3. **安培- Maxwell 恒等式（Integral Form）**  \n   - 磁通量的变化：  \n     $$ \\oint \\mathbf{B} \\cdot d\\mathbf{l} = \\mu_0 I_{enc} + \\mu_0 \\varepsilon_0 \\frac{\\partial \\Phi_E}{\\partial t} $$\n\n4. **高斯率（Divergence Form）**  \n   - 电场的散度等于电荷密度：  \n     $$ \\nabla \\cdot \\mathbf{E} = \\rho_{enc} / \\varepsilon_0 $$\n\n5. **高斯率（Ampère 法则）**  \n   - 磁感应线的旋度等于电流密度加上变化磁场：  \n     $$ \\nabla \\times \\mathbf{B} = \\mu_0 I_{enc} + \\mu_0 \\varepsilon_0 \\frac{\\partial \\mathbf{B}}{\\partial t} $$\n\n6. **高斯率（Divergence Form）**  \n   - 位移场的散度等于自由电荷密度：  \n     $$ \\nabla \\cdot \\mathbf{D} = \\rho_{free} $$\n\n7. **高斯率（Divergence Form）**  \n   - 磁通密度的散度等于变化磁场：  \n     $$ \\nabla \\cdot \\mathbf{B} = 0 $$\n\n8. **高斯率（Integral Form）**  \n   - 电场的环流量等于包围的净电荷量：  \n     $$ \\oint \\mathbf{E} \\cdot d\\mathbf{l} = 4\\pi k_e Q_{enc} $$
```