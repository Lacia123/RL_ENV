// test-code-theme.js
// 测试代码主题功能

import { markdownToEightElement } from './markdownToEightElement.js';
import { renderEightElementToHtml } from './renderEightElementHtml.js';

// 测试包含代码块的Markdown
const testMarkdownWithCode = `
# 代码主题测试

这是一个包含代码块的测试文档。

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

console.log('开始测试代码主题功能...');

// 执行转换
const eightElement = markdownToEightElement(testMarkdownWithCode);

// 查找代码元素并检查isDarkMode字段
function findCodeElements(element, path = '') {
    const results = [];
    
    if (element.name === 'code' || element.type === 'code') {
        results.push({
            path: path,
            isDarkMode: element.isDarkMode,
            language: element.language,
            hasHighlightedCode: !!element.highlightedCode,
            highlightedCode: element.highlightedCode
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
console.log('\n找到的代码元素:');
codeElements.forEach((code, index) => {
    console.log(`代码元素 ${index + 1}:`);
    console.log(`  路径: ${code.path}`);
    console.log(`  语言: ${code.language}`);
    console.log(`  是否为深色主题: ${code.isDarkMode}`);
    console.log(`  是否有高亮代码: ${code.hasHighlightedCode}`);
    
    // 检查highlightedCode中是否包含背景色样式
    if (code.highlightedCode) {
        const hasBackgroundColor = code.highlightedCode.includes('background-color:');
        console.log(`  代码标签是否包含背景色: ${hasBackgroundColor}`);
        if (hasBackgroundColor) {
            // 提取背景色值
            const bgColorMatch = code.highlightedCode.match(/background-color:\s*([^;]+)/);
            if (bgColorMatch) {
                console.log(`  背景色值: ${bgColorMatch[1]}`);
            }
        }
    }
});

// 渲染HTML并检查主题选择
const { html } = renderEightElementToHtml(eightElement);

// 检查HTML中是否包含正确的highlight.js主题链接
const hasDarkTheme = html.includes('github-dark.min.css');
const hasLightTheme = html.includes('github.min.css');

console.log('\nHTML主题检查:');
console.log(`包含深色主题: ${hasDarkTheme}`);
console.log(`包含浅色主题: ${hasLightTheme}`);

// 检查是否有代码元素且使用了正确的主题
if (codeElements.length > 0) {
    const hasDarkCode = codeElements.some(code => code.isDarkMode === true);
    const expectedTheme = hasDarkCode ? '深色' : '浅色';
    const actualTheme = hasDarkTheme ? '深色' : '浅色';
    
    console.log(`\n主题匹配检查:`);
    console.log(`期望主题: ${expectedTheme}`);
    console.log(`实际主题: ${actualTheme}`);
    console.log(`主题匹配: ${expectedTheme === actualTheme ? '✅ 通过' : '❌ 失败'}`);
} else {
    console.log('\n未找到代码元素，使用默认浅色主题');
}

console.log('\n测试完成！'); 