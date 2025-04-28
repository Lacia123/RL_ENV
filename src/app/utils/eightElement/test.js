// test.js
const { markdownToEightElement, printEightElementStructure } = require('./markdownToEightElement.js');

// 测试Markdown文本
const testMarkdown = `
# 八要素测试文档

这是一个简单的测试文档，用于测试Markdown到八要素的转换功能。

## 基本元素

### 文本
这是一段普通文本，将被转换为text元素。

### 按钮（超链接）
这是一个[按钮链接](https://example.com)，将被转换为button元素。

多个连续的按钮：
[按钮1](https://example1.com)
[按钮2](https://example2.com)
[按钮3](https://example3.com)

### 图片
下面是一张图片，将被转换为background元素：

![测试图片](https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80)

## 混合内容

这段文本包含[内联链接](https://example.com)和普通文本混合在一起。

这是另一个包含![内联图片](https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80)的段落，文本和图片混合。

## 嵌套结构

### 一级嵌套
这是一级嵌套中的内容。

#### 二级嵌套
这是二级嵌套中的内容。

##### 三级嵌套
这是三级嵌套中的内容，包含[嵌套链接](https://example.com)。
`;

// 执行转换
const eightElement = markdownToEightElement(testMarkdown);

// 打印结构（仅展示元素的层次结构，不显示所有详细属性）
console.log("八要素结构预览：");
printEightElementStructure(eightElement);

// 将完整的八要素对象保存到文件
const fs = require('fs');
fs.writeFileSync('eightElementOutput.json', JSON.stringify(eightElement, null, 2));
console.log("完整的八要素结构已保存到 eightElementOutput.json");

// 测试单行包含链接的情况
const testInlineLink = `这是一个[按钮链接](https://example.com)，将被转换为button元素。`;

console.log("测试单行包含链接的情况:");
const result = markdownToEightElement(testInlineLink);
console.log("结果结构：");
printEightElementStructure(result);

// 打印结果中的children信息，以便调试
console.log("\n子元素数量:", result.layout.children ? result.layout.children.length : 0);

// 检查第一个子元素是否存在
if (result.layout.children && result.layout.children.length > 0) {
  const firstChild = result.layout.children[0];
  console.log("\n第一个子元素类型:", firstChild.name);

  // 如果是水平布局，再检查其子元素
  if (firstChild.name === 'layout') {
    console.log("水平布局子元素数量:", firstChild.layout.children.length);
    
    // 输出水平布局的每个子元素类型
    firstChild.layout.children.forEach((child, index) => {
      console.log(`子元素${index + 1}类型:`, child.name);
      if (child.name === 'text') {
        console.log(`子元素${index + 1}内容:`, child.font.fontsize.default.content);
      } else if (child.name === 'button') {
        console.log(`子元素${index + 1}按钮文本:`, child.font.fontsize.default.content);
        console.log(`子元素${index + 1}按钮链接:`, child.url);
      }
    });
  } else {
    // 如果不是水平布局，直接打印第一个元素的信息
    console.log("非水平布局元素:", firstChild.name);
    if (firstChild.name === 'text') {
      console.log("文本内容:", firstChild.font.fontsize.default.content);
    } else if (firstChild.name === 'button') {
      console.log("按钮文本:", firstChild.font.fontsize.default.content);
      console.log("按钮链接:", firstChild.url);
    }
  }
} else {
  console.log("没有找到任何子元素!");
}

// 测试多行顺序解析情况
const testMultipleLines = `
只是一个
[按钮链接](https://example.com)
，将被转换为button元素。
`;

console.log("\n\n测试多行顺序解析情况:");
const result2 = markdownToEightElement(testMultipleLines);
console.log("结果结构：");
printEightElementStructure(result2); 