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

## 颜色 token 的相关调研

## 已经部署的 design token

当前只设置了一个 `seed` 值，并且可以转换成其他 `seed` 值，存在一个转换公式

```
const mapShapeSeed = (seed) => 0.5 + (seed / 10) * 1.5;
const mapDensitySeed = (seed) => 0.75 + (seed / 10) * 0.75;
const mapFontSeed = (seed) => 0.75 + (seed / 10) * 0.5;
const mapMaterialSeed = (seed) => 0.5 + (seed / 10) * 1.5;
```

## 新增的 design token 2.0 的调控原理

首先默认了三套预设的主题，这个看看能不能用这个参考后面的主题生成，预设主题分别是：modern, tech, natural

```js
// modern
modern: {
    form: {
        roundness: 0.7,
        complexity: 0.3,
        outlineStrength: 0.2
    },
    color: {
        themeHue: 210,
        colorStyle: 'highContrast',
        brandColorRatio: 0.6,
        brightness: 0.7
    },
    typography: {
        informationDensity: 0.6,
        alignmentCenter: 0.5,
        visualStrength: 0.6
    },
    material: {
        shadowDepth: 0.5,
        texture: 0.2,
        transparency: 0.3
    },
    proportion: {
        spacing: 0.6,
        edgeTension: 0.4,
        visualWeight: 0.5
    },
    composition: {
        gridAlignment: 0.5,
        layoutStructure: 0.5,
        layoutType: 'standard'
    }
},
```

```js
// tech
tech: {
    form: {
        roundness: 0.3,
        complexity: 0.6,
        outlineStrength: 0.4
    },
    color: {
        themeHue: 240,
        colorStyle: 'monochromatic',
        brandColorRatio: 0.7,
        brightness: 0.1
    },
    typography: {
        informationDensity: 0.7,
        alignmentCenter: 0.6,
        visualStrength: 0.7
    },
    material: {
        shadowDepth: 0.6,
        texture: 0.5,
        transparency: 0.4
    },
    proportion: {
        spacing: 0.5,
        edgeTension: 0.6,
        visualWeight: 0.6
    },
    composition: {
        gridAlignment: 0.7,
        layoutStructure: 0.6,
        layoutType: 'standard'
    }
},
```

```js
// natural
natural: {
    form: {
        roundness: 0.6,
        complexity: 0.4,
        outlineStrength: 0.3
    },
    color: {
        themeHue: 120,
        colorStyle: 'adjacentColors',
        brandColorRatio: 0.5,
        brightness: 0.6
    },
    typography: {
        informationDensity: 0.5,
        alignmentCenter: 0.4,
        visualStrength: 0.4
    },
    material: {
        shadowDepth: 0.3,
        texture: 0.6,
        transparency: 0.2
    },
    proportion: {
        spacing: 0.7,
        edgeTension: 0.3,
        visualWeight: 0.4
    },
    composition: {
        gridAlignment: 0.5,
        layoutStructure: 0.4,
        layoutType: 'standard'
    }
}
```

其实相当于多套 token 的组合

其中有纯数值的计算，以 form 中的 roundness 为例，会以这个值计算普通的边框和图片边框，具体的计算方法如下

```js
const imageRoundness = Math.min(roundness + 0.1, 1) * 30;

// Calculate roundness for UI elements
const borderRadius = `${roundness * 20}px`;
```

并且会将生成的值用到各个元件的 style，例如

```js
const tagStyles = {
    backgroundColor: `hsla(${tertiaryHue}, ${mainSaturation * 0.8}%, ${mainLightness}%, 0.75)`,
    color: inverseTextColor,
    padding: '4px 10px',
    borderRadius: `${Math.max(4, roundness * 12)}px`,
    fontSize: `${14 * scale}px`,
    fontWeight: Math.min(700, fontWeightBase),
    display: 'inline-block',
    margin: '0 6px 6px 0',
    textShadow: isDarkMode ? '0 1px 1px rgba(0,0,0,0.2)' : 'none',
    boxShadow: edgeTension > 0.5 ? elementShadow : 'none',
    ...(transparency > 0.2 ? glassEffect : {})
};
```

另外也有边缘值计算的，例如 material 中的 texture，下面是 texture 的计算逻辑

```js
if (texture > 0.1) {
    if (texture < 0.3) {
        // Dots pattern
        textureBackground = `radial-gradient(rgba(${isDarkMode ? '255,255,255' : '0,0,0'},${textureOpacity}) 2px, transparent 2px)`;
    } else if (texture < 0.6) {
        // Grid pattern
        textureBackground = `linear-gradient(rgba(${isDarkMode ? '255,255,255' : '0,0,0'},${textureOpacity}) 1px, transparent 1px),
          linear-gradient(90deg, rgba(${isDarkMode ? '255,255,255' : '0,0,0'},${textureOpacity}) 1px, transparent 1px)`;
    } else if (texture < 0.8) {
        // Diagonal lines
        textureBackground = `repeating-linear-gradient(45deg, rgba(${isDarkMode ? '255,255,255' : '0,0,0'},${textureOpacity}), rgba(${isDarkMode ? '255,255,255' : '0,0,0'},${textureOpacity}) 2px, transparent 2px, transparent ${textureScale/2}px)`;
    } else {
        // Complex pattern
        textureBackground = `repeating-linear-gradient(45deg, rgba(${isDarkMode ? '255,255,255' : '0,0,0'},${textureOpacity}), rgba(${isDarkMode ? '255,255,255' : '0,0,0'},${textureOpacity*1.5}) 5px, transparent 5px, transparent ${textureScale}px),
          repeating-linear-gradient(-45deg, rgba(${isDarkMode ? '255,255,255' : '0,0,0'},${textureOpacity}), rgba(${isDarkMode ? '255,255,255' : '0,0,0'},${textureOpacity*1.5}) 5px, transparent 5px, transparent ${textureScale}px)`;
    }
}
```

其中 isDarkMode 是根据 color 中的 brightness 计算的

```js
const isDarkMode = brightness < 0.4;
const isVeryDarkMode = brightness < 0.2;
```

```js
uiPreview: {
    backgroundColor: isDarkMode ?
        (isVeryDarkMode ? "rgb(28, 28, 32)" : `hsl(${hue}, ${mainSaturation * 0.4}%, 22%)`) : (brandColorElements.fullBrandBackground || brandColorElements.cardBackground || cardBackgroundColor),
    backgroundImage: textureBackground,
    backgroundSize: `${textureScale}px ${textureScale}px`,
    borderRadius,
    padding: innerPadding,
    boxShadow: shadow,
    transition: 'all 0.3s',
    position: 'relative',
    height: 'auto',
    maxWidth: '600px', // Limit maximum width
    margin: '0 auto',
    border: `${borderWidth} ${borderStyle} ${borderColor}`,
    color: textColor, // Ensure text color changes with brightness
    ...layoutStyles
},
```

还有指定类型的，比如 composition 中的 layoutType，会直接根据不同的值设置不同的样式

```js
if (layoutType === 'standard') {
    layoutStyles = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: gapSpacing,
        padding: innerPadding
    };
} else {
    layoutStyles = {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridGap: gapSpacing,
        padding: innerPadding,
        alignItems: 'center',
        justifyItems: 'center'
    };
}
```

最终这些类会用到相应的元素上，layoutStyles 会合并到 ui Preview 中

```html
<div style={cssProps(styles.uiPreview)}>

    <span style={cssProps(styles.tag)}>智能建筑</span>
    <span style={cssProps(styles.tag)}>可持续发展</span>
    <span style={cssProps(styles.tag)}>绿色科技</span>
```




```
 "m18": {
                "success": true,
                "execution_time": 0.0848,
                "error": null,
                "results": [
                    4.534895420074463,
                    2.0326223373413086
                ]
            },
            "m10": {
                "success": true,
                "execution_time": 2.3412,
                "error": null,
                "results": [
                    0.4680095197019852
                ]
            },
            "m11": {
                "success": true,
                "execution_time": 0.0265,
                "error": null,
                "results": [
                    123
                ]
            },
            "m13": {
                "success": true,
                "execution_time": 0.0442,
                "error": null,
                "results": [
                    26.382115814189724
                ]
            },
            "m15": {
                "success": true,
                "execution_time": 0.0578,
                "error": null,
                "results": [
                    15.319702985129881
                ]
            },
            "m4": {
                "success": true,
                "execution_time": 0.0175,
                "error": null,
                "results": [
                    0.023582358699572363
                ]
            },
            "m5": {
                "success": true,
                "execution_time": 0.0382,
                "error": null,
                "results": [
                    0.5037802192864205
                ]
            },
            "m21": {
                "success": true,
                "execution_time": 0.0196,
                "error": null,
                "results": [
                    12,
                    12,
                    32,
                    32,
                    10,
                    10,
                    0.007432119119995878,
                    0.007432119119995878,
                    5,
                    5
                ]
            },
            "m22": {
                "success": true,
                "execution_time": 0.0039,
                "error": null,
                "results": [
                    0.8287243031583286
                ]
            },
            "m24": {
                "success": true,
                "execution_time": 1.1748,
                "error": null,
                "results": [
                    "4bd706b1c0154832a8654eb670337dc5-m24_0.png"
                ]
            }
```