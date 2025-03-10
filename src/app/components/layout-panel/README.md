# LayoutPanel 组件库

这个目录包含了布局面板的重构版本，将原本的单一文件拆分成多个可复用的组件，以提高可维护性和可扩展性。

## 目录结构

```
layout-panel/
├── inputs/                // 基础输入组件
│   ├── SelectInput.js     // 下拉选择输入
│   ├── TextInput.js       // 文本/数字输入
│   └── ColorInput.js      // 颜色选择输入
├── config-sections/       // 配置分组组件
│   ├── ConfigSection.js   // 通用配置分组
│   ├── LayoutConfigSection.js    // 布局配置
│   └── AppearanceConfigSection.js // 外观配置
├── element-editors/       // 元素特有编辑器
│   ├── TextElementEditor.js      // 文本元素编辑器
│   ├── ButtonElementEditor.js    // 按钮元素编辑器
│   ├── InputElementEditor.js     // 输入框元素编辑器
│   ├── ImageElementEditor.js     // 图片元素编辑器
│   ├── IconElementEditor.js      // 图标元素编辑器
│   ├── DividerElementEditor.js   // 分割线元素编辑器
│   ├── BackgroundElementEditor.js // 背景元素编辑器
│   └── ElementEditorSelector.js  // 元素编辑器选择器
├── management/            // 元素管理组件
│   ├── PresetSelector.js  // 预设选择器
│   ├── AddComponentPanel.js // 添加组件面板
│   └── ElementActions.js  // 元素操作(删除、复制等)
├── utils.js              // 工具函数
├── LayoutPanel.js        // 主组件
├── index.js              // 导出文件
└── README.md             // 本文档
```

## 主要组件

### LayoutPanel

主组件，整合所有子组件，包括布局配置、外观配置、元素特有配置和元素管理功能。

```jsx
<LayoutPanel
  selectedElement={element}
  selectedElementId="element-1"
  onStyleChange={(property, value) => {}}
  onContentChange={(path, value) => {}}
  onActionChange={(path, value) => {}}
  onAddComponent={(type, name) => {}}
  onPresetApply={(presetName) => {}}
  onDeleteElement={(elementId) => {}}
  onDuplicateElement={(elementId) => {}}
  onMoveElement={(elementId, direction) => {}}
/>
```

### 基础输入组件

- **SelectInput**: 下拉选择框
- **TextInput**: 文本/数字输入框
- **ColorInput**: 颜色选择器

### 配置分组组件

- **ConfigSection**: 通用配置分组，用于将相关的配置项归为一组
- **LayoutConfigSection**: 布局相关配置，如方向、对齐、尺寸等
- **AppearanceConfigSection**: 外观相关配置，如颜色、边框、阴影等

### 元素特有编辑器

为每种元素类型提供专门的编辑器组件，处理该类型元素的特有属性：

- 文本元素编辑器
- 按钮元素编辑器
- 输入框元素编辑器
- 图片元素编辑器
- 图标元素编辑器
- 分割线元素编辑器
- 背景元素编辑器

### 元素管理组件

- **PresetSelector**: 预设选择器，用于应用预定义的样式组合
- **AddComponentPanel**: 添加组件面板，用于向容器添加子组件
- **ElementActions**: 元素操作组件，提供删除、复制、移动等功能

## 工具函数

utils.js 提供了一系列实用工具函数：

- **resolveTokenValue**: 解析设计令牌值，如 {token.path}
- **resolveStyleTokens**: 解析样式对象中的所有令牌值
- **resolveStyleValue**: 解析单个样式值并确保CSS兼容
- **setNestedProperty**: 设置对象的嵌套属性，支持点路径语法

## 使用示例

```jsx
import { LayoutPanel } from '@/app/components/layout-panel';

// 在组件中使用
function MyEditor() {
  const [selectedElement, setSelectedElement] = useState(null);
  
  const handleStyleChange = (property, value) => {
    // 更新元素样式
  };
  
  const handleContentChange = (path, value) => {
    // 更新元素内容
  };
  
  return (
    <LayoutPanel
      selectedElement={selectedElement}
      selectedElementId={selectedElement?.id}
      onStyleChange={handleStyleChange}
      onContentChange={handleContentChange}
      // ...其他回调
    />
  );
}
```

## 扩展指南

### 添加新的元素类型

1. 在 `element-editors/` 目录下创建新的编辑器组件
2. 在 `ElementEditorSelector.js` 中添加对新元素类型的支持
3. 在 `utils/elementDefinitions.js` 中添加新元素类型的定义

### 添加新的配置选项

1. 在相应的配置分组组件中添加新的配置选项
2. 使用基础输入组件或创建新的输入组件

## 注意事项

- 所有组件都使用了 'use client' 指令，确保在客户端渲染
- 元素样式中的令牌值 (如 {gap.base}) 会被解析为实际值
- 内容更新支持嵌套路径，如 'content.text'