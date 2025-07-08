// test-code-background-control.js
// 测试代码元素的背景色调控功能

import { markdownToEightElement } from './markdownToEightElement.js';
import { renderEightElementToHtml } from './renderEightElementHtml.js';
import { createActionSystemManager } from '../seeds/rl_action_engines.js';
import styleConfig from './styleConfig.js';

// 测试包含代码块的Markdown
const testMarkdownWithCode = `
# 代码背景色调控测试

这是一个测试代码元素背景色调控功能的文档。

## JavaScript代码示例

\`\`\`javascript
function greeting(name) {
  return \`Hello, \${name}!\`;
}

// 调用函数
const message = greeting('World');
console.log(message);  // 输出: Hello, World!
\`\`\`

## Python代码示例

\`\`\`python
def greeting(name):
    return f"Hello, {name}!"

# 调用函数
message = greeting('World')
print(message)  # 输出: Hello, World!
\`\`\`

## 普通文本

这是一段普通的文本内容。
`;

console.log('开始测试代码元素背景色调控功能...');

// 执行转换
const eightElement = markdownToEightElement(testMarkdownWithCode);

// 创建动作系统管理器
const actionManager = createActionSystemManager(styleConfig);

// 查找代码元素
function findCodeElements(element, path = '') {
    const results = [];
    
    if (element.name === 'code' || element.type === 'code') {
        results.push({
            path: path,
            element: element
        });
    }
    
    if (element.layout && element.layout.children) {
        element.layout.children.forEach((child, index) => {
            results.push(...findCodeElements(child, `${path}.children[${index}]`));
        });
    }
    
    return results;
}

const codeElements = findCodeElements(eightElement);
console.log(`\n找到 ${codeElements.length} 个代码元素`);

// 测试不同的背景色调控强度
const testIntensities = [0.1, 0.3, 0.5, 0.7, 0.9];

testIntensities.forEach(intensity => {
    console.log(`\n=== 测试背景色调控强度: ${intensity} ===`);
    
    // 对每个代码元素应用背景色调控
    codeElements.forEach((codeInfo, index) => {
        console.log(`\n代码元素 ${index + 1}:`);
        
        // 获取当前背景色
        const currentBackground = codeInfo.element.layout?.classStyle?.background || 
                                 codeInfo.element.layout?.classStyle?.backgroundColor || 
                                 '无背景色';
        console.log(`  当前背景色: ${currentBackground}`);
        
        // 应用背景色调控动作
        try {
            const result = actionManager.executeAction('backgroundColor', intensity, 'text', 'codeBlock');
            console.log(`  调控结果:`, result);
            
            // 检查是否有背景色变化
            if (result && result.backgroundColor) {
                console.log(`  新背景色: ${result.backgroundColor}`);
                
                // 判断是否为深色主题
                const isDark = result.isDarkMode;
                console.log(`  是否为深色主题: ${isDark}`);
            } else {
                console.log(`  无背景色变化`);
            }
        } catch (error) {
            console.error(`  调控出错: ${error.message}`);
        }
    });
});

// 测试色彩明暗调控
console.log(`\n=== 测试色彩明暗调控 ===`);
testIntensities.forEach(intensity => {
    console.log(`\n强度 ${intensity}:`);
    
    codeElements.forEach((codeInfo, index) => {
        try {
            const result = actionManager.executeAction('colorBrightness', intensity, 'text', 'codeBlock');
            console.log(`  代码元素 ${index + 1} 明暗调控结果:`, result);
        } catch (error) {
            console.error(`  代码元素 ${index + 1} 明暗调控出错: ${error.message}`);
        }
    });
});

// 测试渲染HTML
console.log(`\n=== 测试HTML渲染 ===`);
const { html } = renderEightElementToHtml(eightElement);

// 检查HTML中是否包含代码元素
const hasCodeElements = html.includes('data-element-type="code"');
console.log(`HTML中包含代码元素: ${hasCodeElements}`);

// 检查是否有背景色样式
const hasBackgroundColor = html.includes('background-color:');
console.log(`HTML中包含背景色样式: ${hasBackgroundColor}`);

// 提取代码元素的背景色
const codeBackgroundMatches = html.match(/background-color:\s*([^;]+)/g);
if (codeBackgroundMatches) {
    console.log(`找到的背景色样式:`);
    codeBackgroundMatches.forEach((match, index) => {
        console.log(`  ${index + 1}: ${match}`);
    });
}

console.log('\n测试完成！'); 