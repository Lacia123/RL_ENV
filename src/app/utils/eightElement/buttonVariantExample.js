// buttonVariantExample.js
// 展示不同按钮类型的解析示例

import { markdownToEightElement, parseButtonVariant } from './markdownToEightElement.js';

// 示例Markdown文本，包含不同类型的按钮
const buttonExampleMarkdown = `
# 按钮样式示例

这个页面展示了不同类型的按钮解析功能。

## 带类型标记的按钮

[primary] [主要按钮](https://example.com/primary)

[secondary] [次要按钮](https://example.com/secondary)

[success][成功按钮](https://example.com/success)

[warning][警告按钮](https://example.com/warning)

[error][错误按钮](https://example.com/error)

[ghost][透明按钮](https://example.com/ghost)

[link][链接按钮](https://example.com/link)

## 默认按钮（无类型标记）

[默认按钮](https://example.com/default)

## 混合内容行

这里有一个 [primary][主要操作](https://example.com/action) 和一个 [secondary] [取消](https://example.com/cancel) 按钮。

还有普通文本和 [默认链接](https://example.com/link) 按钮。

## 不支持的类型标记

[unknown][不支持的类型](https://example.com/unknown) 会被当作普通文本处理。

[custom] [自定义类型](https://example.com/custom) 也会被当作普通文本处理。
`;

/**
 * 测试按钮类型标记解析功能
 */
export function testButtonVariantParsing() {
  console.log('=== 测试按钮类型标记解析功能 ===');
  
  // 测试各种按钮类型标记
  const testCases = [
    '[primary] [主要按钮](https://example.com/primary)',
    '[secondary] [次要按钮](https://example.com/secondary)', 
    '[success][成功按钮](https://example.com/success)',
    '[warning][警告按钮](https://example.com/warning)',
    '[error][错误按钮](https://example.com/error)',
    '[ghost][透明按钮](https://example.com/ghost)',
    '[link][链接按钮](https://example.com/link)',
    '[默认按钮](https://example.com/default)', // 无类型标记
    '[unknown][不支持的类型](https://example.com/unknown)', // 不支持的类型
    '[custom] [自定义类型](https://example.com/custom)' // 不支持的类型
  ];
  
  testCases.forEach((testCase, index) => {
    console.log(`\n测试案例 ${index + 1}: ${testCase}`);
    const result = parseButtonVariant(testCase);
    
    if (result.hasVariant) {
      console.log(`  ✅ 解析成功:`);
      console.log(`     类型: ${result.variant}`);
      console.log(`     文本: ${result.text}`);
      console.log(`     链接: ${result.url}`);
    } else {
      console.log(`  ❌ 未识别为按钮类型标记（将按默认方式处理）`);
    }
  });
}

/**
 * 生成包含所有按钮类型的八要素结构
 */
export function generateButtonVariantEightElement() {
  console.log('\n=== 生成按钮样式示例的八要素结构 ===');
  
  const eightElement = markdownToEightElement(buttonExampleMarkdown);
  
  console.log('✅ 八要素结构生成完成');
  console.log(`根布局ID: ${eightElement.id}`);
  
  return eightElement;
}

/**
 * 分析八要素结构中的按钮元素
 */
export function analyzeButtonElements(eightElement) {
  console.log('\n=== 分析按钮元素 ===');
  
  const buttons = [];
  
  function findButtons(element, path = '') {
    if (!element) return;
    
    if (element.name === 'button' && element._metadata) {
      const metadata = element._metadata;
      buttons.push({
        id: element.id,
        variant: metadata.variant,
        text: metadata.buttonText,
        url: metadata.buttonUrl,
        hasVariantTag: metadata.hasVariantTag,
        path: path
      });
    }
    
    // 递归查找子元素
    if (element.layout && element.layout.children) {
      element.layout.children.forEach((child, index) => {
        findButtons(child, `${path}/${index}`);
      });
    }
  }
  
  findButtons(eightElement, 'root');
  
  console.log(`找到 ${buttons.length} 个按钮元素:`);
  buttons.forEach((button, index) => {
    console.log(`  ${index + 1}. ID: ${button.id}`);
    console.log(`     样式: ${button.variant}`);
    console.log(`     文本: ${button.text}`);
    console.log(`     使用类型标记: ${button.hasVariantTag ? '是' : '否'}`);
    console.log(`     路径: ${button.path}`);
    console.log('');
  });
  
  return buttons;
}

/**
 * 统计不同类型的按钮数量
 */
export function getButtonVariantStats(buttons) {
  const stats = {};
  
  buttons.forEach(button => {
    if (!stats[button.variant]) {
      stats[button.variant] = 0;
    }
    stats[button.variant]++;
  });
  
  console.log('=== 按钮类型统计 ===');
  Object.entries(stats).forEach(([variant, count]) => {
    console.log(`${variant}: ${count} 个`);
  });
  
  return stats;
}

// 示例用法
export function runButtonVariantExample() {
  console.log('🎨 按钮样式解析示例');
  console.log('========================');
  
  // 1. 测试解析功能
  testButtonVariantParsing();
  
  // 2. 生成八要素结构
  const eightElement = generateButtonVariantEightElement();
  
  // 3. 分析按钮元素
  const buttons = analyzeButtonElements(eightElement);
  
  // 4. 统计按钮类型
  const stats = getButtonVariantStats(buttons);
  
  console.log('\n✅ 示例运行完成！');
  
  return {
    eightElement,
    buttons,
    stats
  };
}

export default {
  buttonExampleMarkdown,
  testButtonVariantParsing,
  generateButtonVariantEightElement,
  analyzeButtonElements,
  getButtonVariantStats,
  runButtonVariantExample
}; 