/**
 * Metaware 组件转样式对象工具测试
 */

import metawareToStyle from './metawareToCss.js';
import fs from 'fs';
import path from 'path';

const TEST_OUTPUT_DIR = path.join(process.cwd(), 'output');

// 确保输出目录存在
if (!fs.existsSync(TEST_OUTPUT_DIR)) {
  fs.mkdirSync(TEST_OUTPUT_DIR, { recursive: true });
}

// 测试用例
const testCases = [
  {
    name: '按钮组件 - 默认状态 (带 token 解析)',
    fn: () => metawareToStyle.metawareToStyleObject('button', 'default', true),
    expected: (result) => {
      // 检查是否成功解析了 token
      return typeof result === 'object' && 
             result.backgroundColor && 
             !result.backgroundColor.includes('{{') &&
             Object.keys(result).length > 0;
    }
  },
  {
    name: '按钮组件 - 默认状态 (保留 token)',
    fn: () => metawareToStyle.metawareToStyleObject('button', 'default', false),
    expected: (result) => {
      // 检查是否保留了 token
      return typeof result === 'object' && 
             result.backgroundColor && 
             result.backgroundColor.includes('{') &&
             Object.keys(result).length > 0;
    }
  },
  {
    name: '容器组件 - 样式对象生成',
    fn: () => metawareToStyle.metawareToStyleObject('container', 'default'),
    expected: (result) => {
      // 检查是否生成了样式对象
      return typeof result === 'object' && 
             Object.keys(result).length > 0 &&
             (result.backgroundColor || result.padding || result.borderRadius);
    }
  },
  {
    name: '图片组件 - 属性映射检查',
    fn: () => {
      const styles = metawareToStyle.metawareToStyleObject('image', 'default');
      console.log('图片组件样式:', styles);
      return styles;
    },
    expected: (result) => {
      // 检查image是否正确映射到backgroundImage
      return typeof result === 'object' && 
             (!result.image || result.backgroundImage) && // 如果有image，应该已被映射为backgroundImage
             Object.keys(result).length > 0;
    }
  },
  {
    name: '按钮组件 - 多状态样式映射',
    fn: () => metawareToStyle.generateComponentStyleMap('button'),
    expected: (result) => {
      // 检查是否包含了多个状态
      return typeof result === 'object' && 
             Object.keys(result).length > 0 &&
             result['default'] && 
             (result['hover'] || result['active']);
    }
  },
  {
    name: '组件完整配置生成',
    fn: () => metawareToStyle.generateComponentConfig('button'),
    expected: (result) => {
      // 检查是否生成了完整的配置
      return typeof result === 'object' && 
             result.type === 'button' &&
             result.styleMap && 
             result.pseudoClasses &&
             Object.keys(result.styleMap).length > 0;
    }
  }
];

// 运行测试
const runTests = () => {
  console.log('开始测试 Metaware 组件转样式对象工具...\n');
  
  const results = [];
  let passCount = 0;
  
  testCases.forEach((test, index) => {
    console.log(`测试 ${index + 1}: ${test.name}`);
    
    try {
      const result = test.fn();
      const passed = test.expected(result);
      
      if (passed) {
        console.log('✅ 通过');
        passCount++;
      } else {
        console.log('❌ 失败');
        console.log('返回结果:', result);
      }
      
      results.push({
        name: test.name,
        passed,
        result,
        error: null
      });
    } catch (error) {
      console.log('❌ 失败 (出现错误)');
      console.error(error);
      
      results.push({
        name: test.name,
        passed: false,
        result: null,
        error: error.message
      });
    }
    
    console.log('---');
  });
  
  console.log(`\n测试完成: ${passCount}/${testCases.length} 通过\n`);
  
  return results;
};

// 生成 HTML 报告
const generateHtmlReport = (results) => {
  // 获取组件配置
  const buttonConfig = metawareToStyle.generateComponentConfig('button');
  const containerConfig = metawareToStyle.generateComponentConfig('container');
  const textConfig = metawareToStyle.generateComponentConfig('text');
  const imageConfig = metawareToStyle.generateComponentConfig('image');

  const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Metaware 组件样式预览</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; max-width: 1000px; margin: 0 auto; padding: 20px; color: #333; }
    h1 { border-bottom: 1px solid #eee; padding-bottom: 10px; }
    .summary { display: flex; gap: 20px; margin: 20px 0; }
    .summary-item { padding: 15px; border-radius: 4px; }
    .pass { background-color: #e6f4ea; }
    .fail { background-color: #fce8e6; }
    .test-case { margin-bottom: 20px; border: 1px solid #eee; border-radius: 4px; overflow: hidden; }
    .test-header { padding: 10px 15px; display: flex; justify-content: space-between; align-items: center; }
    .pass-header { background-color: #e6f4ea; }
    .fail-header { background-color: #fce8e6; }
    .test-badge { padding: 3px 8px; border-radius: 3px; font-size: 12px; font-weight: bold; }
    .pass-badge { background-color: #34a853; color: white; }
    .fail-badge { background-color: #ea4335; color: white; }
    .test-content { padding: 15px; background-color: #f8f9fa; font-family: monospace; white-space: pre-wrap; }
    .error { color: #ea4335; }
    
    .preview-section { margin-top: 30px; }
    .component-preview { margin: 30px 0; }
    .component-header { display: flex; justify-content: space-between; align-items: center; }
    .component-selector { padding: 5px; border-radius: 4px; background-color: #f5f5f5; border: 1px solid #ddd; }
    .state-tabs { display: flex; gap: 10px; margin: 15px 0; overflow-x: auto; padding-bottom: 5px; }
    .state-tab { cursor: pointer; padding: 8px 15px; border-radius: 4px; border: 1px solid #ddd; }
    .state-tab.active { background-color: #4285f4; color: white; border-color: #4285f4; }
    .state-content { display: none; padding: 20px; border: 1px solid #eee; border-radius: 4px; margin-bottom: 15px; }
    .state-content.active { display: block; }
    .preview-box { display: flex; gap: 20px; flex-wrap: wrap; }
    .style-code { flex: 1; min-width: 300px; font-family: monospace; white-space: pre-wrap; background-color: #f8f9fa; padding: 15px; border-radius: 4px; overflow: auto; max-height: 300px; }
    .visual-preview-container { flex: 1; min-width: 300px; display: flex; justify-content: center; align-items: center; padding: 20px; background-color: #f5f5f5; border-radius: 4px; }
    .visual-preview { position: relative; border: 1px dashed #ccc; border-radius: 4px; display: flex; align-items: center; justify-content: center; text-align: center; padding: 10px; min-height: 40px; min-width: 80px; }
    .image-preview { min-height: 150px; min-width: 200px; background-position: center; background-repeat: no-repeat; background-size: cover; }
    .fallback-image-text { font-size: 12px; color: #888; display: none; }
    .state-indicator { position: absolute; top: -10px; right: -10px; background-color: #333; color: white; font-size: 10px; padding: 2px 6px; border-radius: 10px; }
    .style-info { margin-top: 10px; font-size: 12px; color: #666; }
    .dimensions { display: flex; gap: 10px; margin-top: 5px; font-family: monospace; flex-wrap: wrap; }
    .dimension-item { background-color: #eee; padding: 3px 8px; border-radius: 3px; }
    .pseudo-controls { display: flex; gap: 10px; margin-top: 15px; flex-wrap: wrap; }
    .pseudo-button { cursor: pointer; padding: 5px 10px; border-radius: 4px; background-color: #eee; border: 1px solid #ddd; font-size: 12px; }
    .pseudo-button.active { background-color: #4285f4; color: white; border-color: #4285f4; }
    .preset-instances { margin-top: 20px; padding: 20px; border: 1px solid #eee; border-radius: 4px; }
    .preset-title { font-weight: bold; margin-bottom: 10px; }
    .preset-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; }
    .preset-item { padding: 15px; border-radius: 4px; background-color: #f5f5f5; }
    .hover-style-example:hover { background-color: #f8f9f0; }
    .image-controls { margin-top: 15px; }
    .sample-image-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 10px; margin-top: 10px; }
    .sample-image { width: 80px; height: 60px; border-radius: 4px; cursor: pointer; object-fit: cover; border: 2px solid transparent; }
    .sample-image.selected { border-color: #4285f4; }
  </style>
</head>
<body>
  <h1>Metaware 组件样式预览</h1>
  
  <div class="summary">
    <div class="summary-item pass">
      <strong>通过:</strong> ${results.filter(r => r.passed).length}
    </div>
    <div class="summary-item fail">
      <strong>失败:</strong> ${results.filter(r => !r.passed).length}
    </div>
    <div class="summary-item">
      <strong>总计:</strong> ${results.length}
    </div>
  </div>
  
  <h2>测试详情</h2>
  
  ${results.map((result, i) => `
    <div class="test-case">
      <div class="test-header ${result.passed ? 'pass-header' : 'fail-header'}">
        <h3>${i + 1}. ${result.name}</h3>
        <span class="test-badge ${result.passed ? 'pass-badge' : 'fail-badge'}">${result.passed ? '通过' : '失败'}</span>
      </div>
      <div class="test-content">
        ${result.error 
          ? `<div class="error">错误: ${result.error}</div>` 
          : typeof result.result === 'object' 
            ? JSON.stringify(result.result, null, 2) 
            : result.result}
      </div>
    </div>
  `).join('')}
  
  <div class="preview-section">
    <h2>组件样式预览</h2>
    <p>以下显示了每个组件在不同状态下的样式。鼠标悬停在元素上可查看悬停状态效果。</p>
    
    <div class="component-preview">
      <div class="component-header">
        <h3>按钮组件</h3>
        <select class="component-selector" id="button-example-selector">
          <option value="default">默认示例</option>
          <option value="hover">悬停示例</option>
          <option value="active">激活示例</option>
          <option value="disable">禁用示例</option>
        </select>
      </div>
      
      <div class="state-tabs" id="button-tabs">
        ${Object.keys(buttonConfig.styleMap).map(state => 
          `<div class="state-tab ${state === 'default' ? 'active' : ''}" data-state="${state}">${state}</div>`
        ).join('')}
      </div>
      
      ${Object.keys(buttonConfig.styleMap).map(state => `
        <div class="state-content ${state === 'default' ? 'active' : ''}" id="button-${state}-content">
          <div class="preview-box">
            <div class="style-code">${JSON.stringify(buttonConfig.styleMap[state], null, 2)}</div>
            <div class="visual-preview-container">
              <div class="visual-preview" id="button-${state}-preview">
                按钮
                <span class="state-indicator">${state}</span>
              </div>
            </div>
          </div>
          <div class="style-info">
            <div class="dimensions" id="button-${state}-dimensions"></div>
          </div>
        </div>
      `).join('')}
      
      <div class="preset-instances">
        <div class="preset-title">按钮演示</div>
        <div class="preset-grid">
          <div class="preset-item">
            <div class="visual-preview hover-style-example" style="cursor: pointer;" id="button-interactive">
              交互按钮
            </div>
          </div>
          <div class="preset-item">
            <div class="visual-preview" id="button-disabled" style="opacity: 0.6;">
              禁用按钮
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="component-preview">
      <div class="component-header">
        <h3>容器组件</h3>
      </div>
      
      <div class="state-tabs" id="container-tabs">
        ${Object.keys(containerConfig.styleMap).map(state => 
          `<div class="state-tab ${state === 'default' ? 'active' : ''}" data-state="${state}">${state}</div>`
        ).join('')}
      </div>
      
      ${Object.keys(containerConfig.styleMap).map(state => `
        <div class="state-content ${state === 'default' ? 'active' : ''}" id="container-${state}-content">
          <div class="preview-box">
            <div class="style-code">${JSON.stringify(containerConfig.styleMap[state], null, 2)}</div>
            <div class="visual-preview-container">
              <div class="visual-preview" id="container-${state}-preview">
                容器内容
                <span class="state-indicator">${state}</span>
              </div>
            </div>
          </div>
          <div class="style-info">
            <div class="dimensions" id="container-${state}-dimensions"></div>
          </div>
        </div>
      `).join('')}
    </div>
    
    <div class="component-preview">
      <div class="component-header">
        <h3>文本组件</h3>
      </div>
      
      <div class="state-tabs" id="text-tabs">
        ${Object.keys(textConfig.styleMap).map(state => 
          `<div class="state-tab ${state === 'default' ? 'active' : ''}" data-state="${state}">${state}</div>`
        ).join('')}
      </div>
      
      ${Object.keys(textConfig.styleMap).map(state => `
        <div class="state-content ${state === 'default' ? 'active' : ''}" id="text-${state}-content">
          <div class="preview-box">
            <div class="style-code">${JSON.stringify(textConfig.styleMap[state], null, 2)}</div>
            <div class="visual-preview-container">
              <div class="visual-preview" id="text-${state}-preview">
                示例文本
                <span class="state-indicator">${state}</span>
              </div>
            </div>
          </div>
          <div class="style-info">
            <div class="dimensions" id="text-${state}-dimensions"></div>
          </div>
        </div>
      `).join('')}
    </div>
    
    <div class="component-preview">
      <div class="component-header">
        <h3>图片组件</h3>
      </div>
      
      <div class="state-tabs" id="image-tabs">
        ${Object.keys(imageConfig.styleMap).map(state => 
          `<div class="state-tab ${state === 'default' ? 'active' : ''}" data-state="${state}">${state}</div>`
        ).join('')}
      </div>
      
      ${Object.keys(imageConfig.styleMap).map(state => `
        <div class="state-content ${state === 'default' ? 'active' : ''}" id="image-${state}-content">
          <div class="preview-box">
            <div class="style-code">${JSON.stringify(imageConfig.styleMap[state], null, 2)}</div>
            <div class="visual-preview-container">
              <div class="visual-preview image-preview" id="image-${state}-preview">
                <span class="state-indicator">${state}</span>
              </div>
            </div>
          </div>
          <div class="style-info">
            <div class="dimensions" id="image-${state}-dimensions"></div>
          </div>
        </div>
      `).join('')}
    </div>
  </div>
  
  <script>
    // 组件配置
    const buttonConfig = ${JSON.stringify(buttonConfig)};
    const containerConfig = ${JSON.stringify(containerConfig)};
    const textConfig = ${JSON.stringify(textConfig)};
    const imageConfig = ${JSON.stringify(imageConfig)};
    
    // 应用样式到预览元素
    function applyStyles(elementId, styles) {
      const element = document.getElementById(elementId);
      if (element) {
        // 应用样式
        Object.keys(styles).forEach(prop => {
          if (element.classList.contains('image-preview') && prop === 'backgroundImage') {
            // 如果是图片预览元素且有backgroundImage属性，确保它能正确显示
            if (styles[prop]) {
              // 不要添加引号，因为style.backgroundImage已经会处理这一点
              element.style[prop] = styles[prop];
              
              // 清除可能存在的文本内容，只保留状态指示器
              Array.from(element.childNodes).forEach(node => {
                if (node.nodeType === Node.TEXT_NODE || 
                    (node.nodeType === Node.ELEMENT_NODE && !node.classList.contains('state-indicator'))) {
                  element.removeChild(node);
                }
              });
            } else {
              // 如果没有背景图，添加提示文本
              const textNode = document.createElement('span');
              textNode.textContent = '无背景图片';
              textNode.className = 'fallback-image-text';
              textNode.style.display = 'inline';
              element.appendChild(textNode);
            }
          } else {
            // 其他元素和属性正常应用
            element.style[prop] = styles[prop];
          }
        });
        
        // 更新尺寸信息
        updateDimensions(elementId, styles);
      }
    }
    
    // 更新尺寸信息
    function updateDimensions(elementId, styles) {
      const dimensionsId = elementId.replace('-preview', '-dimensions');
      const dimensionsEl = document.getElementById(dimensionsId);
      if (!dimensionsEl) return;
      
      dimensionsEl.innerHTML = '';
      
      // 添加尺寸信息
      const dimensionProps = ['width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight', 'padding', 'margin', 'borderRadius', 'backgroundImage', 'backgroundSize', 'backgroundPosition', 'backgroundRepeat'];
      dimensionProps.forEach(prop => {
        if (styles[prop]) {
          const item = document.createElement('div');
          item.className = 'dimension-item';
          item.textContent = prop + ': ' + styles[prop];
          dimensionsEl.appendChild(item);
        }
      });
    }
    
    // 选项卡切换功能
    function setupTabs(componentType) {
      const tabs = document.querySelectorAll('#' + componentType + '-tabs .state-tab');
      
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          // 移除所有活动状态
          tabs.forEach(t => t.classList.remove('active'));
          document.querySelectorAll('#' + componentType + '-tabs + div').forEach(
            content => content.classList.remove('active')
          );
          
          // 设置新的活动状态
          const state = tab.getAttribute('data-state');
          tab.classList.add('active');
          document.getElementById(componentType + '-' + state + '-content').classList.add('active');
        });
      });
    }
    
    // 设置交互式演示
    function setupInteractiveDemo() {
      const interactiveButton = document.getElementById('button-interactive');
      if (!interactiveButton) return;
      
      // 应用默认样式
      Object.keys(buttonConfig.styleMap.default).forEach(prop => {
        interactiveButton.style[prop] = buttonConfig.styleMap.default[prop];
      });
      
      // 添加鼠标悬停样式
      if (buttonConfig.styleMap.hover) {
        const hoverStyles = buttonConfig.styleMap.hover;
        let hoverCSS = '';
        Object.keys(hoverStyles).forEach(prop => {
          if (prop !== 'boxSizing') { // 避免重复基本属性
            const cssProp = prop.replace(/([A-Z])/g, "-$1").toLowerCase();
            hoverCSS += cssProp + ': ' + hoverStyles[prop] + '; ';
          }
        });
        
        // 添加悬停样式
        const style = document.createElement('style');
        style.textContent = 
          '#button-interactive:hover {' +
          hoverCSS +
          '}';
        document.head.appendChild(style);
      }
      
      // 添加禁用按钮样式
      const disabledButton = document.getElementById('button-disabled');
      if (disabledButton && buttonConfig.styleMap.disable) {
        Object.keys(buttonConfig.styleMap.disable).forEach(prop => {
          disabledButton.style[prop] = buttonConfig.styleMap.disable[prop];
        });
      }
    }
    
    // 应用所有组件的样式
    window.onload = function() {
      // 应用样式到预览元素
      Object.keys(buttonConfig.styleMap).forEach(state => {
        applyStyles('button-' + state + '-preview', buttonConfig.styleMap[state]);
      });
      
      Object.keys(containerConfig.styleMap).forEach(state => {
        applyStyles('container-' + state + '-preview', containerConfig.styleMap[state]);
      });
      
      Object.keys(textConfig.styleMap).forEach(state => {
        applyStyles('text-' + state + '-preview', textConfig.styleMap[state]);
      });
      
      Object.keys(imageConfig.styleMap).forEach(state => {
        // 对于图片组件，需要特殊处理
        const imageStyles = {...imageConfig.styleMap[state]};
        
        // 如果没有背景图，为测试添加默认背景图
        if (!imageStyles.backgroundImage) {
          imageStyles.backgroundImage = 'url("https://sop-cdn.dingcloud.com/filez/icon/8mm6fa2u7foi4j38r6r67navgpttixwi20240708114129822.png")';
        } else if (imageStyles.backgroundImage && !imageStyles.backgroundImage.startsWith('url(')) {
          // 如果有背景图但没有url()包裹，添加它
          imageStyles.backgroundImage = 'url("' + imageStyles.backgroundImage + '")';
        }
        
        applyStyles('image-' + state + '-preview', imageStyles);
      });
      
      // 设置选项卡功能
      setupTabs('button');
      setupTabs('container');
      setupTabs('text');
      setupTabs('image');
      
      // 设置交互式演示
      setupInteractiveDemo();
    };
  </script>
</body>
</html>
  `;
  
  const outputPath = path.join(TEST_OUTPUT_DIR, 'metaware-style-preview.html');
  fs.writeFileSync(outputPath, html);
  console.log(`HTML 预览报告已生成: ${outputPath}`);
  
  return outputPath;
};

// 主函数
const main = () => {
  const results = runTests();
  generateHtmlReport(results);
};

// 执行测试
main(); 