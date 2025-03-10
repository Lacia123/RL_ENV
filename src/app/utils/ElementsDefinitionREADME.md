# 八要素设计系统定义文档

本文档详细说明了八要素设计系统的完整定义，包括通用属性抽象化和各类元件特性整合。

## 系统概述

八要素设计系统是一套完整的UI组件定义标准，旨在通过抽象化和标准化来提高设计和开发效率。系统包含以下核心部分：

1. **通用样式属性抽象** - 所有组件共享的基础样式属性
2. **预设系统** - 预定义的样式集合，可快速应用于组件
3. **主题变量** - 可配置的设计令牌，保证一致的视觉语言
4. **工具函数** - 用于处理预设和主题变量的辅助函数

## 八要素组件

系统包含以下八种基础组件：

1. **容器 (Container)** - 用于布局和组织其他元素
2. **文本 (Text)** - 用于展示各类文字内容
3. **按钮 (Button)** - 交互元素，用于触发操作
4. **输入框 (Input)** - 用于接收用户输入
5. **图标 (Icon)** - 视觉符号
6. **背景 (Background)** - 背景元素
7. **图片 (Image)** - 图像展示
8. **分割线 (Divider)** - 视觉分隔元素

## 通用样式属性

所有组件共享以下基础样式属性：

```javascript
const commonStyleProps = {
  // 布局方向
  direction: 'column', // column | row | none
  
  // 对齐方式
  justifyContent: 'flex-start', // flex-start | center | flex-end | space-between | space-around | space-evenly
  alignItems: 'flex-start',     // flex-start | center | flex-end | stretch
  
  // 尺寸模式
  primaryAxisSizingMode: 'auto', // fixed | auto | fix-content | responsive
  counterAxisSizingMode: 'auto', // fixed | auto | fix-content
  
  // 尺寸属性
  width: 'auto',      // 数值 | 'auto' | 'fix-content'
  height: 'auto',     // 数值 | 'auto' | 'fix-content'
  minWidth: null,     // 数值 | null
  maxWidth: null,     // 数值 | null
  minHeight: null,    // 数值 | null
  maxHeight: null,    // 数值 | null
  grow: 0,            // 伸展因子
  
  // 间距
  gap: 0,             // 元素间距
  
  // 外边距与内边距
  marginTop: 0, marginRight: 0, marginBottom: 0, marginLeft: 0,
  paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0,
  
  // 边框
  borderRadius: 0,    // 圆角
  borderWidth: 0,     // 边框宽度
  borderColor: null,  // 边框颜色
  
  // 其他通用样式
  overflow: 'visible', // visible | hidden | auto | scroll
  boxShadow: 'none',   // 阴影
  opacity: 1,          // 透明度
  backgroundColor: null // 背景色
};
```

## 组件特有属性

除了通用样式属性外，每个组件还有其特有的属性：

### 文本特有属性

```javascript
{
  preset: 'body',          // h1 | h2 | h3 | body | caption | link
  align: 'inherit',        // left | center | right | justify | inherit
  wordBreak: 'break-all',  // normal | break-all | keep-all | break-word
  fontSize: null,          // 可覆盖预设字号
  fontWeight: null,        // normal | bold | 数值
  color: null,             // 文本颜色
  lineHeight: null,        // 行高
  letterSpacing: null      // 字间距
}
```

### 按钮特有属性

```javascript
{
  preset: 'normal',        // normal | iconButton | iconTextButton
  minWidth: 176,           // 最小宽度
  minHeight: 56,           // 最小高度
  backgroundColor: '#40A9FF', // 按钮背景色
  hoverColor: '#1890FF',   // 悬停颜色
  activeColor: '#096DD9'   // 激活颜色
}
```

### 输入框特有属性

```javascript
{
  preset: 'normal',        // normal | fixedheight | flexibleheight
  fontSize: 'xl',          // 字体大小
  borderRadius: 32,        // 输入框圆角
  borderWidth: 1,          // 输入框边框
  borderColor: 'rgba(0,0,0,0.2)', // 边框颜色
  backgroundColor: '#FFFFFF' // 背景色
}
```

### 图标特有属性

```javascript
{
  preset: 'line',          // line | 其他预设类型
  width: 24,               // 图标宽度
  height: 24,              // 图标高度
  color: '#40A9FF'         // 图标颜色
}
```

### 背景特有属性

```javascript
{
  preset: 'default',       // 预设类型
  overflow: 'hidden'       // 溢出处理
}
```

### 图片特有属性

```javascript
{
  borderRadius: 0,         // 图片圆角
  objectFit: 'cover'       // cover | contain | fill | none | scale-down
}
```

### 分割线特有属性

```javascript
{
  direction: 'horizontal', // horizontal | vertical
  thickness: 1,            // 线条粗细
  color: 'rgba(0,0,0,0.1)', // 线条颜色
  style: 'solid'           // solid | dashed | dotted
}
```

## 预设系统

预设系统为每种组件提供了预定义的样式集合，可以通过简单的预设名称快速应用一组样式。

示例：

```javascript
// 文本预设
text: {
  h1: {
    type: 'text',
    defaultStyle: {
      fontSize: "{font.size.xxxl}",
      fontWeight: "{font.weight.bold}",
      letterSpacing: "{font.letterSpacing.tight}",
      lineHeight: "{font.lineHeight.tight}"
    }
  },
  body: {
    type: 'text',
    defaultStyle: {
      fontSize: "{font.size.medium}",
      fontWeight: "{font.weight.medium}",
      letterSpacing: "{font.letterSpacing.base}",
      lineHeight: "{font.lineHeight.base}"
    }
  }
}
```

## 主题系统

主题系统提供了一套可配置的设计令牌（Design Tokens），用于保证视觉设计的一致性：

```javascript
const themeSystem = {
  theme: {
    colors: {
      brand: { /* 品牌色阶 */ },
      black: { /* 黑色色阶 */ },
      white: '#FFFFFF',
      grey: { /* 灰色色阶 */ },
      success: '#52C41A',
      warning: '#FAAD14',
      error: '#F5222D',
      info: '#1890FF'
    },
    shadow: { /* 阴影预设 */ },
    font: { /* 字体相关令牌 */ },
    dimension: { /* 尺寸相关令牌 */ }
  }
};
```

## 工具函数

系统提供了两个主要工具函数：

1. **应用预设**: `applyPreset(element, presetName)` - 将指定预设应用到元素上
2. **解析主题变量**: `resolveThemeValue(value, theme)` - 解析主题变量引用（如 "{colors.brand.5}"）

## 使用方法

### 创建元素

```javascript
// 创建一个按钮元素
const myButton = {
  ...elementDefinitions.button,
  style: {
    ...elementDefinitions.button.style,
    backgroundColor: themeSystem.theme.colors.brand[5]
  },
  content: {
    text: '点击按钮',
    fontSize: themeSystem.theme.font.size.medium
  }
};
```

### 应用预设

```javascript
// 创建一个卡片容器
const cardContainer = applyPreset(
  {
    ...elementDefinitions.container,
    style: {
      ...elementDefinitions.container.style,
      width: '100%',
      maxWidth: '600px'
    }
  },
  'card'
);
```

### 嵌套元素

```javascript
// 创建一个包含标题和文本的容器
const container = {
  ...elementDefinitions.container,
  children: [
    {
      ...applyPreset({...elementDefinitions.text}, 'h1'),
      content: '标题文本'
    },
    {
      ...applyPreset({...elementDefinitions.text}, 'body'),
      content: '正文内容'
    }
  ]
};
```

## 最佳实践

1. 使用预设系统来保持一致性，避免重复定义样式
2. 通过主题变量引用设计令牌，而不是硬编码具体数值
3. 避免过度嵌套容器，保持结构扁平
4. 为特定场景创建自定义预设，而不是重复定义相似样式
5. 在实际开发中，为常用的组合创建复合组件

## 扩展性

八要素设计系统设计时考虑了扩展性，可以通过以下方式扩展：

1. 添加新的预设
2. 扩展主题变量
3. 添加组件特定属性
4. 创建复合组件

---

通过遵循此设计系统规范，可以大幅提高设计和开发效率，同时保证产品视觉和交互的一致性。