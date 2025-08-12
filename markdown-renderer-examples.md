# Markdown Renderer 使用示例

## 基本用法

通过浏览器访问 `/markdown-renderer` 路由，并通过URL参数传递markdown内容：

```
http://localhost:3001/markdown-renderer?markdown=your_encoded_markdown
```

## 参数说明

- `markdown` (必需) - URL编码的markdown内容
- `width` (可选) - 渲染宽度，默认800
- `height` (可选) - 渲染高度，默认500

## 示例1：简单文本

```
http://localhost:3001/markdown-renderer?markdown=%23%23%20Hello%20World%0A这是一个简单的示例
```

对应的原始markdown：
```markdown
## Hello World
这是一个简单的示例
```

## 示例2：复杂卡片（原用户示例）

```
http://localhost:3001/markdown-renderer?markdown=%3Ccard%3AheaderPrecentCard%3E%0A%20%20%20%23%23%20二、市场概述%0A%20%20%20AI-PC%20概念自%202023%20年由英特尔提出后，迅速引发行业关注%0A%20%20%20%23%23%23%20中国市场%0A%20%20%20%3CpercentValue%20color%3D%7Bcolor.error.red8%7D%3E%23%23%23%23%2015%25%3C%2FpercentValue%3E%0A%20%20%20AI-PC%20出货量%0A%20%20%20%23%23%23%20全球市场%20%20%0A%20%20%20%23%23%23%23%2025%25%0A%20%20%20AI-PC%20渗透率%0A%20%20%20%23%23%23%20未来预测%0A%20%20%20%23%23%23%23%2040%25%0A%20%20%20预计增长率%0A%3C%2Fcard%3AheaderPrecentCard%3E
```

## 示例3：带自定义尺寸

```
http://localhost:3001/markdown-renderer?markdown=%23%20大标题&width=1200&height=600
```

## URL编码工具

你可以使用以下JavaScript代码来编码markdown内容：

```javascript
const markdown = `<card:headerPrecentCard>
## 二、市场概述
AI-PC 概念自 2023 年由英特尔提出后，迅速引发行业关注
### 中国市场
<percentValue color={color.error.red8}>#### 15%</percentValue>
AI-PC 出货量
### 全球市场  
#### 25%
AI-PC 渗透率
### 未来预测
#### 40%
预计增长率
</card:headerPrecentCard>`;

const encodedMarkdown = encodeURIComponent(markdown);
console.log(`http://localhost:3001/markdown-renderer?markdown=${encodedMarkdown}`);
```

## 注意事项

1. Markdown内容必须进行URL编码
2. 如果内容很长，建议使用POST请求到API端点而不是GET请求
3. 页面会自动调用 `/api/markdown-to-html` API进行渲染
4. 渲染结果会直接显示在页面中，包含完整的样式和布局
