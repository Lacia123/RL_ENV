/**
 * renderEightElementHtml.js
 * 
 * 将八要素结构渲染为HTML的工具
 * 不依赖预设系统，完全基于metaware的CSS和八要素结构
 */

import resolveToken from '../tokens/resolveToken.js';
import { Marked, marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import markedKatex from 'marked-katex-extension';

/**
 * Configure marked globally with KaTeX and Highlight.js
 */
const katexOptions = {
    throwOnError: false,
    // displayMode: true, // This might be relevant for how $$...$$ is handled by default
};

const markedInstance = new Marked(
    markedHighlight({
        async: false, // Assuming synchronous highlighting for simplicity here
        langPrefix: 'hljs language-',
        highlight(code, lang) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
        }
    })
);
markedInstance.use(markedKatex(katexOptions));
// Use markedInstance.parse(markdownString) instead of marked.parse() later

/**
 * 渲染八要素结构为HTML字符串，并返回预处理后的八要素结构
 * @param {Object} eightElement - 八要素结构对象
 * @param {Object} options - 渲染选项
 * @returns {Object} - 包含HTML字符串和预处理后的八要素结构
 */
export function renderEightElementToHtml(eightElement, options = {}) {
    const { width = 1024, height = 768 } = options;

    // 预处理八要素结构，收集所有classStyle
    const processedEightElement = preProcessEightElement(eightElement);
    const classStyles = collectClassStyles(processedEightElement);

    // 生成CSS样式表
    const cssStyles = generateCSSFromClassStyles(classStyles);

    // 检查是否有代码元素，并确定主题
    const hasCodeElement = checkForCodeElement(processedEightElement);
    const highlightTheme = hasCodeElement.isDarkMode ? 
        'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/github-dark.min.css' :
        'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.11.1/build/styles/github.min.css';

    // 创建HTML文档头部
    const htmlHeader = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Eight Element Renderer</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css" crossorigin="anonymous">
      <link rel="stylesheet" href="${highlightTheme}" crossorigin="anonymous"></link>
       
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }
        p {
           margin-block: 0;
           margin-inline: 0;
           padding-block: 0;
           padding-inline: 0;
        }
        .eight-element-container {
          position: relative;
        }
        * {
          box-sizing: border-box;
        }

        pre code.hljs {
            display: block;
            overflow-x: auto;
            padding: 1em;
        }
        code.hljs {
            padding: 3px 5px;
        }
        
        /* 🆕 编辑器相关样式 */
        .editor-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          z-index: 9999;
          display: none;
          align-items: center;
          justify-content: center;
        }
        
        .editor-container {
          width: 90%;
          max-width: 1200px;
          height: 80%;
          background: white;
          border-radius: 8px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        
        .editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 1px solid #eee;
        }
        
        .editor-title {
          font-size: 18px;
          font-weight: bold;
          color: #333;
        }
        
        .editor-buttons {
          display: flex;
          gap: 10px;
        }
        
        .editor-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
        }
        
        .editor-btn-primary {
          background: #007bff;
          color: white;
        }
        
        .editor-btn-primary:hover {
          background: #0056b3;
        }
        
        .editor-btn-secondary {
          background: #6c757d;
          color: white;
        }
        
        .editor-btn-secondary:hover {
          background: #545b62;
        }
        
        .editor-content {
          flex: 1;
          border: 1px solid #ddd;
          border-radius: 4px;
          overflow: hidden;
        }
        
        #markdown-editor {
          width: 100%;
          height: 100%;
        }
        
        /* 动态生成的类样式 */
        ${cssStyles}
      </style>
    </head>
    <body>
      <div class="eight-element-container" id="root">
  `;

    // 递归渲染主体内容
    const htmlBody = renderElement(processedEightElement);

    // 创建HTML文档尾部
    const htmlFooter = `
      </div>
      
      <!-- 🆕 Markdown 编辑器覆盖层 -->
      <div class="editor-overlay" id="editor-overlay">
        <div class="editor-container">
          <div class="editor-header">
            <div class="editor-title">编辑 Markdown 内容</div>
            <div class="editor-buttons">
              <button class="editor-btn editor-btn-primary" id="save-btn">保存</button>
              <button class="editor-btn editor-btn-secondary" id="cancel-btn">返回</button>
            </div>
          </div>
          <div class="editor-content">
            <div id="markdown-editor"></div>
          </div>
        </div>
      </div>
      
      <script type="module">
        // 🆕 编辑器功能实现
        let crepeEditor = null;
        let currentMarkdown = '';
        let currentEventTargetId = '';
        
        // 初始化编辑器（延迟加载）
        async function initEditor() {
          if (crepeEditor) return crepeEditor;
          
          try {
            // 等待所有依赖加载完成
            await waitForDependencies();
            
            // 尝试多种全局变量名称
            const CrepeClass = window.Crepe || 
                              window.MilkdownCrepe?.Crepe || 
                              window['@milkdown/crepe']?.Crepe ||
                              window.milkdownCrepe?.Crepe;
            
            if (!CrepeClass) {
              throw new Error('Crepe类未找到，可能依赖加载失败');
            }
            
            console.log('🔍 找到Crepe类:', typeof CrepeClass);
            
            crepeEditor = new CrepeClass({
              root: '#markdown-editor',
              defaultValue: '',
            });
            
            await crepeEditor.create();
            console.log('✅ Crepe 编辑器初始化成功');
            return crepeEditor;
          } catch (error) {
            console.error('❌ Crepe 编辑器初始化失败:', error);
            console.log('🔄 回退到简单编辑器...');
            
            // 回退到功能丰富的 textarea 编辑器
            createFallbackEditor();
            return null;
          }
        }
        
        // 等待依赖加载
        function waitForDependencies() {
          return new Promise((resolve) => {
            let attempts = 0;
            const maxAttempts = 50; // 5秒超时
            
            const checkDependencies = () => {
              attempts++;
              
              // 检查关键依赖是否已加载
              const hasLodash = window._ !== undefined;
              const hasProseMirror = window.ProseMirror !== undefined || window['prosemirror-state'] !== undefined;
              const hasCrepe = window.Crepe !== undefined || 
                              window.MilkdownCrepe !== undefined || 
                              window['@milkdown/crepe'] !== undefined;
              
              console.log('🔍 依赖检查:', { hasLodash, hasProseMirror, hasCrepe, attempt: attempts });
              
              if (attempts >= maxAttempts) {
                console.warn('⚠️ 依赖加载超时，继续尝试初始化');
                resolve();
              } else if (hasLodash || hasCrepe) {
                console.log('✅ 基础依赖已加载');
                resolve();
              } else {
                setTimeout(checkDependencies, 100);
              }
            };
            
            checkDependencies();
          });
        }
        
        // 创建回退编辑器
        function createFallbackEditor() {
          const editorContainer = document.getElementById('markdown-editor');
          editorContainer.innerHTML = \`
            <div style="height: 100%; display: flex; flex-direction: column;">
              <div style="padding: 10px; background: #f5f5f5; border-bottom: 1px solid #ddd; font-size: 12px; color: #666;">
                简化 Markdown 编辑器 (Crepe 加载失败时的备用方案)
              </div>
              <textarea id="fallback-editor" 
                style="flex: 1; border: none; padding: 15px; font-family: 'Consolas', 'Monaco', 'Courier New', monospace; font-size: 14px; resize: none; outline: none; line-height: 1.5;"
                placeholder="在此输入 Markdown 内容..."></textarea>
            </div>
          \`;
        }
        
        // 显示编辑器
        async function showEditor(markdown, eventTargetId) {
          currentMarkdown = markdown;
          currentEventTargetId = eventTargetId;
          
          console.log('🔧 显示编辑器，EventTargetId:', eventTargetId);
          console.log('📝 要编辑的markdown长度:', markdown.length);
          
          const overlay = document.getElementById('editor-overlay');
          overlay.style.display = 'flex';
          
          // 初始化编辑器
          const editor = await initEditor();
          
          if (editor) {
            // 使用 Crepe 编辑器
            try {
              // 设置编辑器内容
              await editor.action((ctx) => {
                const view = ctx.get('editorView');
                const schema = ctx.get('schema');
                const parser = ctx.get('parser');
                
                // 解析 markdown 并设置到编辑器
                const doc = parser(markdown);
                view.dispatch(view.state.tr.replaceWith(0, view.state.doc.content.size, doc));
              });
            } catch (error) {
              console.error('设置编辑器内容失败:', error);
            }
          } else {
            // 使用回退的 textarea
            const fallbackEditor = document.getElementById('fallback-editor');
            if (fallbackEditor) {
              fallbackEditor.value = markdown;
            }
          }
        }
        
        // 获取编辑器内容
        async function getEditorContent() {
          if (crepeEditor) {
            try {
              return await crepeEditor.action((ctx) => {
                const serializer = ctx.get('serializer');
                const view = ctx.get('editorView');
                return serializer(view.state.doc);
              });
            } catch (error) {
              console.error('获取Crepe编辑器内容失败:', error);
              // 如果Crepe获取失败，尝试回退编辑器
              const fallbackEditor = document.getElementById('fallback-editor');
              return fallbackEditor ? fallbackEditor.value : currentMarkdown;
            }
          } else {
            // 使用回退的 textarea
            const fallbackEditor = document.getElementById('fallback-editor');
            if (fallbackEditor) {
              console.log('📝 从回退编辑器获取内容，长度:', fallbackEditor.value.length);
              return fallbackEditor.value;
            } else {
              console.warn('⚠️ 回退编辑器也未找到，返回原始内容');
              return currentMarkdown;
            }
          }
        }
        
        // 隐藏编辑器
        function hideEditor() {
          const overlay = document.getElementById('editor-overlay');
          overlay.style.display = 'none';
        }
        
        // 重新渲染页面
        async function rerenderPage(newMarkdown) {
          try {
            console.log('🔄 开始重新渲染页面...');
            console.log('📝 新的markdown长度:', newMarkdown.length);
            
            // 调用 markdown-to-html API 重新生成 HTML
            const response = await fetch('/api/markdown-to-html', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                markdown: newMarkdown,
                width: 800,
                height: 500
              })
            });
            
            if (!response.ok) {
              throw new Error('API调用失败: ' + response.status);
            }
            
            const result = await response.json();
            
            if (result.success && result.html) {
              // 🆕 重新加载整个页面内容
              document.open();
              document.write(result.html);
              document.close();
              console.log('✅ 页面重新渲染成功');
            } else {
              throw new Error(result.error || '重新渲染失败');
            }
          } catch (error) {
            console.error('❌ 重新渲染失败:', error);
            alert('保存失败: ' + error.message);
          }
        }
        
        // 保存按钮事件
        document.getElementById('save-btn').addEventListener('click', async () => {
          try {
            const newMarkdown = await getEditorContent();
            console.log('💾 保存编辑内容，长度:', newMarkdown.length);
            
            hideEditor();
            await rerenderPage(newMarkdown);
          } catch (error) {
            console.error('保存失败:', error);
            alert('保存失败: ' + error.message);
          }
        });
        
        // 取消按钮事件
        document.getElementById('cancel-btn').addEventListener('click', () => {
          hideEditor();
        });
        
        // 🆕 为所有具有 edit 事件的元素添加点击监听器
        document.addEventListener('DOMContentLoaded', () => {
          console.log('🎯 页面加载完成，开始绑定编辑事件...');
          
          // 获取所有EventTargetIds
          const eventTargetIds = ${JSON.stringify(eightElement.EventTargetIds || [])};
          console.log('📋 找到EventTargetIds:', eventTargetIds);
          
          // 检查是否在iframe中（React环境）
          const isInIframe = window.parent !== window;
          
          // 为每个EventTargetId绑定点击事件
          eventTargetIds.forEach(targetId => {
            const element = document.getElementById(targetId);
            if (element) {
              console.log('🔗 为元素绑定编辑事件:', targetId);
              
              element.addEventListener('click', (e) => {
                e.preventDefault();
                
                // 🆕 从元素的事件配置中获取markdown内容
                const elementData = findElementDataById(targetId);
                if (elementData && elementData.events) {
                  const editEvent = elementData.events.find(event => 
                    event.runtimeEventKey === 'edit' && event.parameters && event.parameters.markdown
                  );
                  
                  if (editEvent) {
                    console.log('🎯 触发编辑事件，EventTargetId:', targetId);
                    
                    if (isInIframe) {
                      // 🆕 在React环境中，发送消息给父窗口
                      console.log('📤 发送编辑事件到React父窗口');
                      window.parent.postMessage({
                        type: 'EDIT_EVENT',
                        eventTargetId: targetId,
                        markdown: editEvent.parameters.markdown
                      }, '*');
                    } else {
                      // 在独立HTML中，使用内置编辑器
                      showEditor(editEvent.parameters.markdown, targetId);
                    }
                  } else {
                    console.warn('⚠️ 未找到edit事件配置:', targetId);
                  }
                } else {
                  console.warn('⚠️ 未找到元素数据:', targetId);
                }
              });
            } else {
              console.warn('⚠️ 未找到元素:', targetId);
            }
          });

          // 🆕 为所有可点击的图表添加切换事件监听器
          console.log('📊 开始绑定图表切换事件...');
          const chartElements = document.querySelectorAll('[data-chart-clickable="true"]');
          console.log('📊 找到可点击的图表数量:', chartElements.length);
          
                     chartElements.forEach(chartElement => {
             const chartId = chartElement.id;
             const currentChartType = chartElement.getAttribute('data-chart-type');
             const chartTypesStr = chartElement.getAttribute('data-chart-types');
             
             if (chartTypesStr) {
               try {
                 const chartTypes = chartTypesStr.split(',').filter(type => type.trim());
                 console.log('📊 为图表绑定切换事件:', chartId, '当前类型:', currentChartType, '可用类型:', chartTypes);
                
                chartElement.addEventListener('click', (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  console.log('🎯 触发图表切换事件，图表ID:', chartId);
                  
                  // 找到当前类型在数组中的位置
                  const currentIndex = chartTypes.indexOf(currentChartType);
                  const nextIndex = (currentIndex + 1) % chartTypes.length;
                  const nextChartType = chartTypes[nextIndex];
                  
                  console.log('🔄 切换图表类型:', currentChartType, '->', nextChartType);
                  
                  if (isInIframe) {
                    // 🆕 在React环境中，发送消息给父窗口
                    console.log('📤 发送图表切换事件到React父窗口');
                    window.parent.postMessage({
                      type: 'CHART_CHANGED_EVENT',
                      eventTargetId: chartId,
                      currentChartType: currentChartType,
                      nextChartType: nextChartType,
                      chartTypes: chartTypes
                    }, '*');
                  } else {
                    // 🆕 在独立HTML中，调用API重新生成图表
                    handleChartTypeChange(chartId, currentChartType, nextChartType, chartTypes);
                  }
                });
              } catch (error) {
                console.error('解析图表类型失败:', error);
              }
            }
          });
        });
        
        // 🆕 监听来自React父窗口的消息
        window.addEventListener('message', (event) => {
          if (event.data && event.data.type === 'SETUP_EDIT_LISTENER') {
            console.log('📨 收到React父窗口的设置消息');
            // React环境已经设置好了，不需要额外处理
          }
        });
        
        // 🆕 处理图表类型切换
        async function handleChartTypeChange(chartId, currentChartType, nextChartType, chartTypes) {
          try {
            console.log('🔄 开始处理图表类型切换:', chartId, currentChartType, '->', nextChartType);
            
            // 获取图表元素数据
            const elementData = findElementDataById(chartId);
            if (!elementData) {
              console.error('未找到图表元素数据:', chartId);
              return;
            }
            
            // 调用API重新生成图表
            const response = await fetch('/api/markdown-to-eight-element', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                markdown: elementData.rawData || '',
                chartType: nextChartType,
                width: 800,
                height: 500
              })
            });
            
            if (!response.ok) {
              throw new Error('API调用失败: ' + response.status);
            }
            
            const result = await response.json();
            
            if (result.success && result.eightElement) {
              // 找到新的图表元素
              const newChartElement = findChartElementById(result.eightElement, chartId);
              if (newChartElement && newChartElement.svgContent) {
                // 更新图表内容
                const chartElement = document.getElementById(chartId);
                if (chartElement) {
                  // 更新图表类型属性
                  chartElement.setAttribute('data-chart-type', nextChartType);
                  
                  // 更新SVG内容
                  chartElement.innerHTML = newChartElement.svgContent;
                  
                  console.log('✅ 图表切换成功:', currentChartType, '->', nextChartType);
                }
              } else {
                console.error('未找到新的图表元素或SVG内容');
              }
            } else {
              throw new Error(result.error || '图表切换失败');
            }
          } catch (error) {
            console.error('❌ 图表切换失败:', error);
            alert('图表切换失败: ' + error.message);
          }
        }
        
        // 🆕 辅助函数：在八要素结构中查找图表元素
        function findChartElementById(element, targetId) {
          if (!element) return null;
          
          if (element.id === targetId && element.name === 'chart') {
            return element;
          }
          
          if (element.layout && element.layout.children) {
            for (const child of element.layout.children) {
              const found = findChartElementById(child, targetId);
              if (found) return found;
            }
          }
          
          return null;
        }
        
        // 🆕 辅助函数：根据ID查找元素数据（从八要素结构中）
        function findElementDataById(targetId) {
          const eightElementData = ${JSON.stringify(eightElement)};
          
          function searchElement(element) {
            if (!element) return null;
            
            if (element.id === targetId) {
              return element;
            }
            
            if (element.layout && element.layout.children) {
              for (const child of element.layout.children) {
                const found = searchElement(child);
                if (found) return found;
              }
            }
            
            return null;
          }
          
          return searchElement(eightElementData);
        }
      </script>
    </body>
    </html>
  `;

    return {
        html: htmlHeader + htmlBody + htmlFooter,
        processedEightElement
    };
}

/**
 * 检查八要素结构中是否有代码元素，并确定主题
 * @param {Object} element - 八要素元素
 * @returns {Object} - 包含是否有代码元素和主题信息的对象
 */
function checkForCodeElement(element) {
    if (!element) return { hasCode: false, isDarkMode: false };

    let hasCode = false;
    let isDarkMode = false;

    // 递归检查所有代码元素
    const checkElement = (el) => {
        if (!el) return;

        // 检查当前元素是否为代码元素
        if (el.name === 'code' || el.type === 'code') {
            hasCode = true;
            // 如果任何一个代码元素是深色主题，就使用深色主题
            if (el.isDarkMode === true) {
                isDarkMode = true;
            }
        }

        // 递归检查子元素
        if (el.layout && el.layout.children && Array.isArray(el.layout.children)) {
            el.layout.children.forEach(checkElement);
        }
    };

    checkElement(element);

    return { hasCode, isDarkMode };
}

/**
 * 收集所有元素的classStyle
 * @param {Object} element - 八要素元素
 * @param {Object} classStyles - 收集的类样式对象
 * @returns {Object} - 收集的类样式对象
 */
function collectClassStyles(element, classStyles = {}) {
    if (!element) return classStyles;

    // 收集当前元素的classStyle
    if (element.layout && element.layout.className && element.layout.classStyle) {
        classStyles[element.layout.className] = element.layout.classStyle;
    }

    // 特殊处理表格元素的classStyle（新结构：table、th、tr、td在layout下）
    if (element.name === 'table' && element.layout) {
        // 收集table的classStyle
        if (element.layout.table && element.layout.table.className && element.layout.table.classStyle) {
            classStyles[element.layout.table.className] = element.layout.table.classStyle;
        }
        
        // 收集th的classStyle
        if (element.layout.th && element.layout.th.className && element.layout.th.classStyle) {
            classStyles[element.layout.th.className] = element.layout.th.classStyle;
        }
        
        // 收集tr的classStyle
        if (element.layout.tr && element.layout.tr.className && element.layout.tr.classStyle) {
            classStyles[element.layout.tr.className] = element.layout.tr.classStyle;
        }
        
        // 收集td的classStyle
        if (element.layout.td && element.layout.td.className && element.layout.td.classStyle) {
            classStyles[element.layout.td.className] = element.layout.td.classStyle;
        }
    }
    
    // 特殊处理图表元素的classStyle（新结构：chart、title、legend、axis在layout下）
    if (element.name === 'chart' && element.layout) {
        // 收集chart的classStyle
        if (element.layout.chart && element.layout.chart.className && element.layout.chart.classStyle) {
            classStyles[element.layout.chart.className] = element.layout.chart.classStyle;
        }
        
        // 收集title的classStyle
        if (element.layout.title && element.layout.title.className && element.layout.title.classStyle) {
            classStyles[element.layout.title.className] = element.layout.title.classStyle;
        }
        
        // 收集legend的classStyle
        if (element.layout.legend && element.layout.legend.className && element.layout.legend.classStyle) {
            classStyles[element.layout.legend.className] = element.layout.legend.classStyle;
        }
        
        // 收集axis的classStyle
        if (element.layout.axis && element.layout.axis.className && element.layout.axis.classStyle) {
            classStyles[element.layout.axis.className] = element.layout.axis.classStyle;
        }
    }

    // 递归收集子元素的classStyle
    if (element.layout && element.layout.children && Array.isArray(element.layout.children)) {
        element.layout.children.forEach(child => {
            collectClassStyles(child, classStyles);
        });
    }

    return classStyles;
}


function separateStyles(styleObj) {
    const mainStyles = {};
    const nestedStyles = {};

    Object.entries(styleObj).forEach(([key, value]) => {
        if (key.startsWith('&')) {
            // 嵌套选择器（如 &::after, &:hover 等）
            nestedStyles[key] = value;
        } else {
            // 主样式属性
            mainStyles[key] = value;
        }
    });

    return { mainStyles, nestedStyles };
}



/**
 * 从classStyle对象生成CSS字符串
 * @param {Object} classStyles - 类样式对象
 * @returns {string} - CSS字符串
 */
function generateCSSFromClassStyles(classStyles) {
    let css = '';

    Object.entries(classStyles).forEach(([className, styleObj]) => {
        if (!styleObj || typeof styleObj !== 'object') return;

        // 处理主选择器的样式和嵌套选择器
        const { mainStyles, nestedStyles } = separateStyles(styleObj);

        // 生成主选择器的CSS
        if (Object.keys(mainStyles).length > 0) {
            css += `.${className} {\n`;
            css += generateStyleProperties(mainStyles);
            css += '}\n\n';
        }

        if (Object.keys(nestedStyles).length > 0) {
            // 生成嵌套选择器的CSS
            Object.entries(nestedStyles).forEach(([selector, nestedStyleObj]) => {
                const fullSelector = selector.replace('&', `.${className}`);
                css += `${fullSelector} {\n`;
                css += generateStyleProperties(nestedStyleObj);
                css += '}\n\n';
            });
        }
    });

    return css;
}

function generateStyleProperties(styleObj) {
    let css = '';
    Object.entries(styleObj).forEach(([property, value]) => {
        if (value === null || value === undefined) return;
        
        let resolvedValue = value;
        
        // 🆕 处理包含多个token的复合值
        if (typeof value === 'string' && value.includes('{') && value.includes('}')) {
            // 找到所有token并逐个解析
            resolvedValue = value.replace(/\{[^}]+\}/g, (match) => {
                const tokenResult = resolveToken(match);
                return tokenResult || match; // 如果解析失败，保持原值
            });
            
            // 🐛 调试日志：记录token解析
            console.log(`🎯 Token解析: ${property}: ${value} -> ${resolvedValue}`);
        } else {
            // 单个token解析（保持向后兼容）
            resolvedValue = resolveToken(value) || value;
        }
        
        // 转换属性名为CSS格式
        const cssProperty = convertToCSSProperty(property);
        
        // 处理数值类型，为需要单位的属性添加px
        if (typeof resolvedValue === 'number' && shouldAddPixelUnit(cssProperty)) {
            resolvedValue = `${resolvedValue}px`;
        }
        
        css += `  ${cssProperty}: ${resolvedValue};\n`;
    });
    
    return css;
}

function convertToCSSProperty(property) {
    // 处理特殊的CSS属性名
    const specialProperties = {
        'WebkitBackgroundClip': '-webkit-background-clip',
        'WebkitTextFillColor': '-webkit-text-fill-color',
        'MozBackgroundClip': '-moz-background-clip',
        'MsBackgroundClip': '-ms-background-clip'
    };
    
    if (specialProperties[property]) {
        return specialProperties[property];
    }
    
    // 将驼峰命名转换为短横线命名
    return property.replace(/([A-Z])/g, '-$1').toLowerCase();
}

function shouldAddPixelUnit(cssProperty) {
    const noUnitProperties = [
        'font-weight', 'line-height', 'opacity', 'z-index', 
        'flex-grow', 'flex-shrink', 'order', 'column-count',
        'fill-opacity', 'stroke-opacity', 'stop-opacity'
    ];
    
    return !noUnitProperties.includes(cssProperty);
}

/**
 * 预处理八要素结构，解析所有token和特殊样式
 * @param {Object} element - 八要素元素
 * @returns {Object} - 预处理后的八要素元素
 */
function preProcessEightElement(element) {
    if (!element) return null;

    // 深拷贝以避免修改原始对象
    const processedElement = JSON.parse(JSON.stringify(element));

    // 处理样式引用并计算最终样式
    processedElement.computedStyle = computeElementStyle(element);

    // 处理文本内容引用
    if (element.name === 'text') {
        processTextElement(processedElement, element);
    }

    // 处理按钮内容引用
    else if (element.name === 'button') {
        processButtonElement(processedElement, element);
    }

    // 处理图片引用
    else if (element.name === 'background' || element.name === 'image') {
        processImageElement(processedElement, element);
    }

    // 处理图标元素
    else if (element.name === 'icon') {
        processIconElement(processedElement, element);
    }

    // 处理表格元素
    else if (element.name === 'table') {
        processTableElement(processedElement, element);
    }

    // 处理代码元素
    else if (element.name === 'code') {
        processCodeElement(processedElement, element);
    }

    // 处理图表元素
    else if (element.name === 'chart') {
        processChartElement(processedElement, element);
    }

    // 递归处理子元素
    if (processedElement.layout && processedElement.layout.children && Array.isArray(processedElement.layout.children)) {
        processedElement.layout.children = processedElement.layout.children.map(child => preProcessEightElement(child));
    }

    return processedElement;
}

/**
 * 处理通用属性引用，统一解析引用关系并应用样式
 * @param {Object} processedElement - 要修改的处理元素
 * @param {Object} originalElement - 原始元素
 * @param {Object} styleConfig - 样式配置
 */
function processStyleReferences(processedElement, originalElement, styleConfig) {
    if (!styleConfig || typeof styleConfig !== 'object') return;

    // 遍历所有样式属性，处理引用关系
    Object.entries(styleConfig).forEach(([key, value]) => {


        // 处理对象引用格式
        if (value && typeof value === 'object' && value.element) {
            const { element, value: refValue, prop, token } = value;

            // 按照引用关系获取实际值
            if (originalElement[element] && originalElement[element][refValue]) {
                const refProp = prop || 'default';
                const refData = originalElement[element][refValue][refProp];

                if (refData) {
                    let styleValue;

                    // 根据引用目标获取对应的样式值
                    if (token && refData.style && refData.style[token]) {
                        styleValue = refData.style[token].value;
                    } else if (refData.style) {
                        // 如果没有指定token，但是有style对象，尝试获取第一个值
                        const firstStyleKey = Object.keys(refData.style)[0];
                        if (firstStyleKey) {
                            styleValue = refData.style[firstStyleKey].value;
                        }
                    } else if (refData.resource) {
                        styleValue = refData.resource;
                    } else if (refData.content) {
                        styleValue = refData.content;
                    }

                    
                    // 应用样式值
                    if (styleValue) {
                        styleValue = resolveToken(styleValue) || styleValue;
                        applyStylesToElement(processedElement.computedStyle, key, styleValue);
                    }
                }
            }
        }
        // 解析token字符串
        else if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
            const resolvedValue = resolveToken(value) || value;
            applyStylesToElement(processedElement.computedStyle, key, resolvedValue);

        }
        // 处理普通值
        else if (typeof value === 'string' || typeof value === 'number') {
            applyStylesToElement(processedElement.computedStyle, key, value);
        }
    });
}

/**
 * 应用样式到元素，处理特殊属性映射
 * @param {Object} computedStyle - 计算样式对象
 * @param {string} key - 样式属性键
 * @param {any} value - 样式属性值
 */
function applyStylesToElement(computedStyle, key, value) {
    // 特殊属性名映射
    const specialPropertyMap = {
        // 布局相关
        'spacing': 'padding',
        'horizontalPadding': 'paddingLeft paddingRight',
        'verticalPadding': 'paddingTop paddingBottom',

        // 字体相关
        'fontSizes': 'fontSize',
        'fontColor': 'color',
        'textColor': 'color',

        // 背景相关
        'fill': 'backgroundColor',
        'background': 'backgroundColor',

        // 边框相关
        'strokeColor': 'borderColor',
        'strokeWidth': 'borderWidth',
        'borderRadius': 'borderRadius',
        'radius': 'borderRadius',

        // 其他
        'dropShadow': 'boxShadow',
        'elevation': 'boxShadow'
    };

    // 处理布局相关的token
    if (['display', 'layoutMode', 'layoutWrap', 'primaryAxisAlignItems', 'counterAxisAlignItems',
        'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
        'itemSpacing', 'gap', 'layoutAlign', 'layoutGrow',
        'strokeTopWeight', 'strokeRightWeight', 'strokeBottomWeight', 'strokeLeftWeight'].includes(key)) {
        applyLayoutToken(computedStyle, key, value);
        return;
    }

    // 处理特殊属性映射
    if (key in specialPropertyMap) {
        const cssProperties = specialPropertyMap[key].split(' ');
        cssProperties.forEach(cssProp => {
            computedStyle[cssProp] = value;
        });

        // 额外处理：如果设置了borderWidth，确保有borderStyle
        if (key === 'strokeWidth' || key === 'borderWidth') {
            computedStyle.borderStyle = computedStyle.borderStyle || 'solid';
        }
    } else {
        // 转换为CSS属性名
        const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        computedStyle[cssKey] = value;
    }
}

/**
 * 处理文本元素的内容和样式引用
 * @param {Object} processedElement - 要修改的处理元素
 * @param {Object} originalElement - 原始元素
 */
function processTextElement(processedElement, originalElement) {
    const textType = originalElement.type === 'text_body' ? 'text_body' : 'text_hyperlink';
    const textConfig = originalElement.layout[textType];

    if (!textConfig) return;

    processedElement.textType = textType;
    let rawTextContent = '';

    if (textConfig.content && Array.isArray(textConfig.content)) {
        const fontRef = textConfig.content.find(item => item.element === 'font');
        if (fontRef && originalElement.font && originalElement.font[fontRef.value]) {
            rawTextContent = originalElement.font[fontRef.value][fontRef.prop]?.content || '';
        }
    }
    processedElement.originalTextContent = rawTextContent; // Keep original for non-katex uses if any

    // 🔧 修复：检查内容是否已经是HTML格式，避免重复处理
    if (rawTextContent && typeof rawTextContent === 'string') {
        // 🔧 修复：清理段落符号
        rawTextContent = rawTextContent.replace(/§PARAGRAPH§/g, '');
        
        // 如果内容已经包含HTML标签（如<p>, <math>, <span>等），说明已经被处理过了
        if (rawTextContent.includes('<') && (rawTextContent.includes('<p>') || rawTextContent.includes('<math') || rawTextContent.includes('<span') || rawTextContent.includes('<li>'))) {
            // 直接使用已处理的HTML内容
            processedElement.katexProcessedContent = rawTextContent;
        } else {
            // 未处理的Markdown内容，需要用KaTeX-enabled marked处理
        try {
            let preppedMarkdown = rawTextContent;

            // Correctly add a space before an inline $ if it's preceded by a non-whitespace character
            // and is not part of a $$ block delimiter.
            preppedMarkdown = preppedMarkdown.replace(/(\S)(\$)(?!\$)/g, (match, charBefore, dollarSign) => {
                if (charBefore === '$') { // Avoid altering existing $$ pairs
                    return match;
                }
                return charBefore + ' ' + dollarSign; // Add space: e.g., "word$" -> "word $"
            });

            // Ensure newlines in original text are treated as <br> or new paragraphs by marked
            preppedMarkdown = preppedMarkdown.replace(/\\n/g, '  \\n');
            
            processedElement.katexProcessedContent = markedInstance.parse(preppedMarkdown);
        } catch (error) {
            console.error("KaTeX or Marked parsing error for text:", error);
            // Fallback to showing original text with an error message if parsing fails
            const errorMessage = `<p style="color:red;">Error rendering math/markdown: ${escapeHtml(error.message)}</p>`;
            processedElement.katexProcessedContent = errorMessage + escapeHtml(rawTextContent).replace(/\\n/g, '<br>');
            }
        }
    } else {
        processedElement.katexProcessedContent = escapeHtml(rawTextContent || '').replace(/\\n/g, '<br>'); // Handle null/undefined rawTextContent
    }

    if (textConfig.style) {
        processStyleReferences(processedElement, originalElement, textConfig.style);
    }
}

/**
 * 处理按钮元素的内容和样式引用
 * @param {Object} processedElement - 要修改的处理元素
 * @param {Object} originalElement - 原始元素
 */
function processButtonElement(processedElement, originalElement) {
    // 确定使用哪种按钮形态 (button_normal, button_icontextbutton, button_iconbutton)
    const buttonType = originalElement.type === 'button_normal' ? 'button_normal' :
        originalElement.type === 'button_icontextbutton' ? 'button_icontextbutton' :
            'button_iconbutton';

    // 获取对应的按钮配置
    const buttonConfig = originalElement.layout[buttonType];

    if (!buttonConfig) return;

    processedElement.buttonType = buttonType;

    // 处理按钮文本内容 - 优先级：children > content > 默认值
    // 1. 检查是否有子元素中的文本
    if (buttonConfig.children && Array.isArray(buttonConfig.children)) {
        const textChild = buttonConfig.children.find(child => child.type === 'text');
        if (textChild && textChild.content && Array.isArray(textChild.content)) {
            const fontRef = textChild.content.find(item => item.element === 'font');
            if (fontRef && originalElement.font && originalElement.font[fontRef.value]) {
                const content = originalElement.font[fontRef.value][fontRef.prop]?.content || '';
                processedElement.buttonText = content;
            }
        }
    }
    // 2. 如果没有从子元素中找到文本，查找content
    else if (buttonConfig.content && Array.isArray(buttonConfig.content)) {
        const fontRef = buttonConfig.content.find(item => item.element === 'font');
        if (fontRef && originalElement.font && originalElement.font[fontRef.value]) {
            const content = originalElement.font[fontRef.value][fontRef.prop]?.content || '';
            processedElement.buttonText = content;
        }
    }
    // 3. 使用默认字体设置
    else if (originalElement.font && originalElement.font.fontsize && originalElement.font.fontsize.default) {
        processedElement.buttonText = originalElement.font.fontsize.default.content || 'Button';
    }
    // 4. 最后的后备选项
    else {
        processedElement.buttonText = 'Button';
    }

    // 处理URL
    if (originalElement.url) {
        processedElement.url = originalElement.url;
    }

    // 处理按钮样式引用
    if (buttonConfig && buttonConfig.style) {
        processStyleReferences(processedElement, originalElement, buttonConfig.style);
    }
}

/**
 * 处理图片元素的内容和样式引用
 * @param {Object} processedElement - 要修改的处理元素
 * @param {Object} originalElement - 原始元素
 */
function processImageElement(processedElement, originalElement) {
    // 处理图片URL
    if (originalElement.material && originalElement.material.image && originalElement.material.image.default) {
        processedElement.imageUrl = originalElement.material.image.default.resource || '';
    } else if (originalElement.src) {
        processedElement.imageUrl = originalElement.src;
    }
}

/**
 * 处理图标元素的内容和样式引用
 * @param {Object} processedElement - 要修改的处理元素
 * @param {Object} originalElement - 原始元素
 */
function processIconElement(processedElement, originalElement) {
    // 处理图标名称
    if (originalElement._metadata && originalElement._metadata.iconName) {
        processedElement.iconName = originalElement._metadata.iconName;
    } else if (originalElement.color && originalElement.color.icon_color && originalElement.color.icon_color.default) {
        processedElement.iconName = originalElement.color.icon_color.default.resource || '';
    }

    // 处理图标样式引用
    if (originalElement.layout && originalElement.layout.style) {
        processStyleReferences(processedElement, originalElement, originalElement.layout.style);
    }

    // 处理图标颜色引用
    if (originalElement.color && originalElement.color.icon_color) {
        const iconColorConfig = originalElement.color.icon_color.default;
        if (iconColorConfig && iconColorConfig.style && iconColorConfig.style.icon_color) {
            const iconColor = iconColorConfig.style.icon_color.value;
            if (iconColor) {
                const resolvedColor = resolveToken(iconColor) || iconColor;
                if (!processedElement.computedStyle) {
                    processedElement.computedStyle = {};
                }
                processedElement.computedStyle.color = resolvedColor;
            }
        }
    }
}

/**
 * 处理表格元素的样式引用
 * @param {Object} processedElement - 要修改的处理元素
 * @param {Object} originalElement - 原始元素
 */
function processTableElement(processedElement, originalElement) {
    // 保留原始的Markdown表格内容
    processedElement.rawData = originalElement.rawData || '';

    // 确保layout存在
    if (!processedElement.layout) {
        processedElement.layout = {};
    }

    // 确保表格样式对象存在
    if (!processedElement.layout.table) processedElement.layout.table = {};
    if (!processedElement.layout.th) processedElement.layout.th = {};
    if (!processedElement.layout.tr) processedElement.layout.tr = {};
    if (!processedElement.layout.td) processedElement.layout.td = {};

    // 处理表格样式 - 支持新的结构（table、th、tr、td在layout下）
    if (originalElement.layout) {
        // 处理table样式
        if (originalElement.layout.table) {
            const tableConfig = originalElement.layout.table;
            
            // 处理style属性（内联样式）
            if (tableConfig.style) {
                processStyleReferences(
                    { computedStyle: processedElement.layout.table },
                    originalElement,
                    tableConfig.style
                );
            }
            
            // 保存className和classStyle信息
            if (tableConfig.className) {
                processedElement.layout.table.className = tableConfig.className;
            }
            if (tableConfig.classStyle) {
                processedElement.layout.table.classStyle = tableConfig.classStyle;
            }
        }

        // 处理th样式
        if (originalElement.layout.th) {
            const thConfig = originalElement.layout.th;
            
            // 处理style属性（内联样式）
            if (thConfig.style) {
                processStyleReferences(
                    { computedStyle: processedElement.layout.th },
                    originalElement,
                    thConfig.style
                );
            }
            
            // 保存className和classStyle信息
            if (thConfig.className) {
                processedElement.layout.th.className = thConfig.className;
            }
            if (thConfig.classStyle) {
                processedElement.layout.th.classStyle = thConfig.classStyle;
            }
        }

        // 处理tr样式
        if (originalElement.layout.tr) {
            const trConfig = originalElement.layout.tr;
            
            // 处理style属性（内联样式）
            if (trConfig.style) {
                processStyleReferences(
                    { computedStyle: processedElement.layout.tr },
                    originalElement,
                    trConfig.style
                );
            }
            
            // 保存className和classStyle信息
            if (trConfig.className) {
                processedElement.layout.tr.className = trConfig.className;
            }
            if (trConfig.classStyle) {
                processedElement.layout.tr.classStyle = trConfig.classStyle;
            }
        }

        // 处理td样式
        if (originalElement.layout.td) {
            const tdConfig = originalElement.layout.td;
            
            // 处理style属性（内联样式）
            if (tdConfig.style) {
                processStyleReferences(
                    { computedStyle: processedElement.layout.td },
                    originalElement,
                    tdConfig.style
                );
            }
            
            // 保存className和classStyle信息
            if (tdConfig.className) {
                processedElement.layout.td.className = tdConfig.className;
            }
            if (tdConfig.classStyle) {
                processedElement.layout.td.classStyle = tdConfig.classStyle;
            }
        }
    }
}

/**
 * 处理代码元素的样式引用
 * @param {Object} processedElement - 要修改的处理元素
 * @param {Object} originalElement - 原始元素
 */
function processCodeElement(processedElement, originalElement) {
    // 保留原始的代码内容和语言
    processedElement.rawData = originalElement.rawData || '';
    processedElement.language = originalElement.language || 'plaintext';

    // 处理样式引用
    if (originalElement.layout && originalElement.layout.style) {
        processStyleReferences(processedElement, originalElement, originalElement.layout.style);
    }
}

/**
 * 处理图表元素的内容和样式
 * @param {Object} processedElement - 要修改的处理元素
 * @param {Object} originalElement - 原始元素
 */
function processChartElement(processedElement, originalElement) {
    // 保留原始SVG内容和图表类型
    processedElement.svgContent = originalElement.svgContent || '';
    processedElement.chartType = originalElement.chartType || 'line';
    processedElement.tableData = originalElement.tableData || []; // 保存表格数据
    processedElement.rawData = originalElement.rawData || ''; // 保存原始数据

    // 确保layout存在
    if (!processedElement.layout) {
        processedElement.layout = {};
    }

    // 确保图表子元素样式对象存在
    if (!processedElement.layout.title) processedElement.layout.title = {};
    if (!processedElement.layout.legend) processedElement.layout.legend = {};
    if (!processedElement.layout.axis) processedElement.layout.axis = {};

    // 处理图表容器样式引用（只处理layout.style，不处理子元素的classStyle）
    if (originalElement.layout && originalElement.layout.style) {
        processStyleReferences(processedElement, originalElement, originalElement.layout.style);
    }

    // 处理图表子元素样式 - 保持classStyle格式，不转换为内联样式
    if (originalElement.layout) {
        // 处理title样式
        if (originalElement.layout.title) {
            const titleConfig = originalElement.layout.title;
            
            // 保存className和classStyle信息
            if (titleConfig.className) {
                processedElement.layout.title.className = titleConfig.className;
            }
            if (titleConfig.classStyle) {
                processedElement.layout.title.classStyle = titleConfig.classStyle;
            }
        }

        // 处理legend样式
        if (originalElement.layout.legend) {
            const legendConfig = originalElement.layout.legend;
            
            // 保存className和classStyle信息
            if (legendConfig.className) {
                processedElement.layout.legend.className = legendConfig.className;
            }
            if (legendConfig.classStyle) {
                processedElement.layout.legend.classStyle = legendConfig.classStyle;
            }
        }

        // 处理axis样式
        if (originalElement.layout.axis) {
            const axisConfig = originalElement.layout.axis;
            
            // 保存className和classStyle信息
            if (axisConfig.className) {
                processedElement.layout.axis.className = axisConfig.className;
            }
            if (axisConfig.classStyle) {
                processedElement.layout.axis.classStyle = axisConfig.classStyle;
            }
        }
    }
}

/**
 * 计算元素的最终样式
 * @param {Object} element - 八要素元素
 * @returns {Object} - 计算后的样式对象
 */
function computeElementStyle(element) {
    let computedStyle = {};

    // 如果没有元素，返回空样式
    if (!element) return computedStyle;

    // 🆕 检查是否为画廊布局，画廊布局需要特殊处理
    const isGalleryLayout = element._metadata?.variant === 'gallery' || 
                           (element.layout && element.layout.style && element.layout.style.columnCount);

    // 🆕 处理样式优先级：如果classStyle有和style中相同的属性key，就把style上的去掉，以classStyle为主
    let processedStyle = element.layout?.style ? { ...element.layout.style } : {};
    let processedClassStyle = element.layout?.classStyle ? { ...element.layout.classStyle } : {};
    
    if (element.layout?.style && element.layout?.classStyle) {
        // 找出classStyle中存在的属性，从style中移除, 另外要移除相关的自定义属性
        Object.keys(element.layout.classStyle).forEach(classStyleKey => {
            if (classStyleKey === 'flexDirection') {
                delete processedStyle['layoutMode'];
            } else if (classStyleKey === 'flexWrap') {
                delete processedStyle['layoutWrap'];
            } else if (classStyleKey === 'flexGrow') {
                delete processedStyle['layoutGrow'];
            }
            if (processedStyle.hasOwnProperty(classStyleKey)) {
                delete processedStyle[classStyleKey];
            }
        });
    }

    // 处理layout.style（已移除与classStyle冲突的属性）
    if (Object.keys(processedStyle).length > 0) {
        processStyleReferences({ computedStyle }, element, processedStyle);
    }
    
    // 处理layout.classStyle，确保属性样式被应用
    // if (Object.keys(processedClassStyle).length > 0) {
    //     processStyleReferences({ computedStyle }, element, processedClassStyle);
    // }

    // 🆕 画廊布局特殊处理：确保使用多列布局而不是flex
    if (isGalleryLayout) {
        // 强制覆盖可能冲突的flex属性
        computedStyle.display = 'block';  // 画廊必须使用block，不能是flex
        
        // 移除可能的flex相关属性
        delete computedStyle.flexDirection;
        delete computedStyle.flexWrap;
        delete computedStyle.justifyContent;
        delete computedStyle.alignItems;
        delete computedStyle.gap;  // 画廊使用marginBottom而不是gap
        
    } else {
        // 默认值处理：如果设置了display=flex但未设置flex方向，默认为column
        if (computedStyle.display === 'flex' && !processedClassStyle.flexDirection && !computedStyle.flexDirection) {
            computedStyle.flexDirection = 'column';
        }
    }

    return computedStyle;
}

/**
 * 根据布局token映射规则应用样式
 * @param {Object} computedStyle - 计算样式对象
 * @param {string} key - 属性键
 * @param {any} value - 属性值
 */
function applyLayoutToken(computedStyle, key, value) {
    // 跳过null或undefined值
    if (value === null || value === undefined) return;

    switch (key) {
        // 显示属性
        case 'display':
            computedStyle.display = value;
            break;

        // 布局方向
        case 'layoutMode':
            if (value === 'HORIZONTAL' || value === '{layout.direction.HORIZONTAL}') {
                computedStyle.flexDirection = 'row';
            } else if (value === 'VERTICAL' || value === '{layout.direction.VERTICAL}') {
                computedStyle.flexDirection = 'column';
            } else if (value === 'NONE' || value === '{layout.direction.NONE}') {
                computedStyle.flexDirection = 'unset';
            }
            break;

        // 布局换行
        case 'layoutWrap':
            computedStyle.flexWrap = value === 'WRAP' ? 'wrap' : 'nowrap';
            break;

        // 主轴对齐
        case 'primaryAxisAlignItems':
            switch (value) {
                case 'MIN':
                    computedStyle.justifyContent = 'flex-start';
                    break;
                case 'MAX':
                    computedStyle.justifyContent = 'flex-end';
                    break;
                case 'CENTER':
                    computedStyle.justifyContent = 'center';
                    break;
                case 'SPACE_BETWEEN':
                    computedStyle.justifyContent = 'space-between';
                    break;
                default:
                    computedStyle.justifyContent = value; // 直接使用值
            }
            break;

        // 交叉轴对齐
        case 'counterAxisAlignItems':
            switch (value) {
                case 'MIN':
                    computedStyle.alignItems = 'flex-start';
                    break;
                case 'MAX':
                    computedStyle.alignItems = 'flex-end';
                    break;
                case 'CENTER':
                    computedStyle.alignItems = 'center';
                    break;
                case 'BASELINE':
                    computedStyle.alignItems = 'baseline';
                    break;
                default:
                    computedStyle.alignItems = value; // 直接使用值
            }
            break;

        // 内边距相关
        case 'paddingTop':
            computedStyle.paddingTop = value;
            break;
        case 'paddingRight':
            computedStyle.paddingRight = value;
            break;
        case 'paddingBottom':
            computedStyle.paddingBottom = value;
            break;
        case 'paddingLeft':
            computedStyle.paddingLeft = value;
            break;

        // 间距
        case 'itemSpacing':
        case 'gap':
            computedStyle.gap = value;
            break;

        // 元素自身对齐
        case 'layoutAlign':
            switch (value) {
                case 'MIN':
                    computedStyle.alignSelf = 'flex-start';
                    break;
                case 'MAX':
                    computedStyle.alignSelf = 'flex-end';
                    break;
                case 'CENTER':
                    computedStyle.alignSelf = 'center';
                    break;
                case 'STRETCH':
                    computedStyle.alignSelf = 'stretch';
                    break;
                case 'INHERIT':
                    computedStyle.alignSelf = 'inherit';
                    break;
                default:
                    computedStyle.alignSelf = value; // 直接使用值
            }
            break;

        // 伸展因子
        case 'layoutGrow':
            computedStyle.flexGrow = value;
            break;

        // 边框相关
        case 'strokeTopWeight':
            computedStyle.borderTopWidth = value;
            computedStyle.borderStyle = computedStyle.borderStyle || 'solid';
            break;
        case 'strokeRightWeight':
            computedStyle.borderRightWidth = value;
            computedStyle.borderStyle = computedStyle.borderStyle || 'solid';
            break;
        case 'strokeBottomWeight':
            computedStyle.borderBottomWidth = value;
            computedStyle.borderStyle = computedStyle.borderStyle || 'solid';
            break;
        case 'strokeLeftWeight':
            computedStyle.borderLeftWidth = value;
            computedStyle.borderStyle = computedStyle.borderStyle || 'solid';
            break;

        // 其他属性直接添加
        default:
            // 转换驼峰命名为CSS属性
            const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            computedStyle[cssKey] = value;
    }
}

/**
 * 递归渲染单个元素
 * @param {Object} element - 八要素元素
 * @returns {string} - 渲染的HTML字符串
 */
function renderElement(element) {
    if (!element) return '';

    // 处理layout容器
    if (element.name === 'layout' && element.layout) {
        return renderLayoutElement(element);
    }

    // 处理具体元素类型
    const elementType = element.name || element.type || '';

    switch (elementType.toLowerCase()) {
        case 'text':
        case 'math':
        case 'list':
            return renderTextElement(element);
        case 'button':
            return renderButtonElement(element);
        case 'background':
        case 'image':
            return renderImageElement(element);
        case 'icon':
            return renderIconElement(element);
        case 'table':
            return renderTableElement(element);
        case 'code':
            return renderCodeElement(element);
        case 'chart':
            return renderChartElement(element);
        default:
            return renderGenericElement(element);
    }
}

/**
 * 渲染布局元素
 * @param {Object} element - 布局元素
 * @returns {string} - 渲染的HTML字符串
 */
function renderLayoutElement(element) {



    const styleAttr = generateStyleAttribute(element.computedStyle);
    const className = element.layout && element.layout.className ? element.layout.className : '';
    const classAttr = className ? `class="${className}"` : '';

    let childrenHtml = '';
    if (element.layout && element.layout.children && Array.isArray(element.layout.children)) {
        childrenHtml = element.layout.children.map(child => renderElement(child)).join('');
    }

    return `<div id="${element.id || ''}" ${classAttr} data-element-type="layout" ${styleAttr}>${childrenHtml}</div>`;
}

/**
 * 渲染文本元素
 * @param {Object} element - 文本元素
 * @returns {string} - 渲染的HTML字符串
 */
function renderTextElement(element) {
    const styleAttr = generateStyleAttribute(element.computedStyle);
    const className = element.layout && element.layout.className ? element.layout.className : '';
    const classAttr = className ? `class="${className}"` : '';

    // 🔧 修复：优先使用预处理的KaTeX+Markdown内容
    let contentHtml = '';

    // 1. 优先使用经过KaTeX和Markdown处理的内容
    if (element.katexProcessedContent) {
        contentHtml = element.katexProcessedContent;
        // 🔧 修复：确保清理段落符号
        if (typeof contentHtml === 'string') {
            contentHtml = contentHtml.replace(/§PARAGRAPH§/g, '');
        }
    }
    // 2. 回退到原始font内容
    else if (element.font && element.font.fontsize && element.font.fontsize.default) {
        contentHtml = element.font.fontsize.default.content || '';
        // 🔧 修复：清理段落符号
        if (typeof contentHtml === 'string') {
            contentHtml = contentHtml.replace(/§PARAGRAPH§/g, '');
        }

        // 如果content不是HTML格式（老格式或纯文本），则进行简单的HTML转义和换行处理
        if (contentHtml && !contentHtml.includes('<')) {
            contentHtml = escapeHtml(contentHtml).replace(/\\n/g, '<br>');
        }
    }

    if (element.textType === 'text_hyperlink') {
        const url = element.url || '#';
        return `
      <div id="${element.id || ''}" ${classAttr} data-element-type="text" ${styleAttr}>
        <a href="${url}" style="text-decoration:underline;color:inherit;">${contentHtml}</a>
      </div>
    `;
    } else {
        return `
      <div id="${element.id || ''}" ${classAttr} data-element-type="text" ${styleAttr}>
        ${contentHtml}
      </div>
    `;
    }
}

/**
 * 渲染按钮元素
 * @param {Object} element - 按钮元素
 * @returns {string} - 渲染的HTML字符串
 */
function renderButtonElement(element) {
    const styleAttr = generateStyleAttribute(element.computedStyle);
    const className = element.layout && element.layout.className ? element.layout.className : '';
    const classAttr = className ? `class="${className}"` : '';

    // 获取按钮内容和URL
    let buttonText = element.buttonText || 'Button';
    let buttonUrl = element.url || '#';

    // 转义HTML特殊字符
    buttonText = escapeHtml(buttonText);

    // 构建按钮HTML
    return `
    <div id="${element.id || ''}" ${classAttr} data-element-type="button" ${styleAttr}>
      <a href="${buttonUrl}" style="display:block;width:100%;height:100%;text-decoration:none;color:inherit;">
        ${buttonText}
      </a>
      </div>
    `;
}

/**
 * 渲染图片元素
 * @param {Object} element - 图片元素
 * @returns {string} - 渲染的HTML字符串
 */
function renderImageElement(element) {
    const styleAttr = generateStyleAttribute(element.computedStyle);
    const className = element.layout && element.layout.className ? element.layout.className : '';
    const classAttr = className ? `class="${className}"` : '';

    // 获取图片URL，支持多种属性来源
    let imageUrl = element.imageUrl || '';
    
    // 🔧 修复：从多个可能的位置获取图片URL
    if (!imageUrl && element.material && element.material.image && element.material.image.default) {
        imageUrl = element.material.image.default.resource || '';
    }
    
    // 🔧 修复：从src属性获取图片URL
    if (!imageUrl && element.src) {
        imageUrl = element.src;
    }
    
    // 🆕 获取alt文本，支持多种来源
    let altText = 'Element Image';
    if (element._metadata && element._metadata.alt) {
        altText = element._metadata.alt;
    }

    console.log(`🖼️ 渲染图片元素: URL="${imageUrl}", Alt="${altText}"`);

    if (imageUrl) {
        // 添加图片标签
        return `
      <div id="${element.id || ''}" ${classAttr} data-element-type="image" ${styleAttr}>
        <img src="${imageUrl}" alt="${altText}" style="width:100%;height:100%;object-fit:cover;" loading="lazy">
      </div>
    `;
    } else {
        // 没有图片URL时显示占位符
        return `
      <div id="${element.id || ''}" ${classAttr} data-element-type="image" ${styleAttr} style="display:flex;align-items:center;justify-content:center;color:#999;">
        Image Placeholder
      </div>
    `;
    }
}

/**
 * 渲染图标元素
 * @param {Object} element - 图标元素
 * @returns {string} - 渲染的HTML字符串
 */
function renderIconElement(element) {
    const styleAttr = generateStyleAttribute(element.computedStyle);
    const className = element.layout && element.layout.className ? element.layout.className : '';
    const classAttr = className ? `class="${className}"` : '';

    // 获取图标名称
    let iconName = '';
    
    // 从不同位置获取图标名称
    if (element._metadata && element._metadata.iconName) {
        iconName = element._metadata.iconName;
    } else if (element.color && element.color.icon_color && element.color.icon_color.default && element.color.icon_color.default.resource) {
        iconName = element.color.icon_color.default.resource;
    }

    if (!iconName) {
        // 没有图标名称时显示占位符
        return `
      <div id="${element.id || ''}" ${classAttr} data-element-type="icon" ${styleAttr} style="display:flex;align-items:center;justify-content:center;color:#999;">
        Icon Placeholder
      </div>
    `;
    }

    // 生成SVG图标
    const svgContent = generateSVGIcon(iconName);

    return `
    <div id="${element.id || ''}" ${classAttr} data-element-type="icon" ${styleAttr}>
      ${svgContent}
    </div>
  `;
}

/**
 * 生成SVG图标
 * @param {string} iconName - 图标名称
 * @returns {string} - SVG图标HTML
 */
function generateSVGIcon(iconName) {
    // 这里可以根据图标名称生成对应的SVG
    // 为了简化，我们使用一个基本的SVG图标映射
    const iconMap = {
        'send': `<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="currentColor"/>
                 </svg>`,
        'home': `<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z" fill="currentColor"/>
                 </svg>`,
        'user': `<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
                 </svg>`,
        'star': `<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
                 </svg>`,
        'heart': `<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.5783 8.50903 2.9987 7.05 2.9987C5.59096 2.9987 4.19169 3.5783 3.16 4.61C2.1283 5.6417 1.5487 7.04097 1.5487 8.5C1.5487 9.95903 2.1283 11.3583 3.16 12.39L12 21.23L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6054C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39457C21.7563 5.72703 21.351 5.12063 20.84 4.61Z" fill="currentColor"/>
                  </svg>`,
        'menu': `<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z" fill="currentColor"/>
                 </svg>`,
        'close': `<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
                  </svg>`,
        'search': `<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z" fill="currentColor"/>
                   </svg>`,
        'arrow-right': `<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" fill="currentColor"/>
                        </svg>`,
        'arrow-left': `<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <path d="M15.41 16.59L10.83 12L15.41 7.41L14 6L8 12L14 18L15.41 16.59Z" fill="currentColor"/>
                       </svg>`
    };

    // 返回对应的SVG图标，如果没有找到则返回默认图标
    return iconMap[iconName] || iconMap['star'] || `<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                      <circle cx="12" cy="12" r="10" fill="currentColor"/>
                                                    </svg>`;
}

/**
 * 渲染表格元素
 * @param {Object} element - 表格元素
 * @returns {string} - 渲染的HTML字符串
 */
function renderTableElement(element) {
    if (!element || !element.layout) {
        return '<div>表格元素结构不完整</div>';
    }

    // 获取表格样式（新结构：table、th、tr、td在layout下）
    const tableStyleConfig = element.layout.table || {};
    const thStyleConfig = element.layout.th || {};
    const trStyleConfig = element.layout.tr || {};
    const tdStyleConfig = element.layout.td || {};

    // 生成容器样式
    const containerStyleAttr = generateStyleAttribute(element.computedStyle || {});

    // 获取Markdown表格内容
    const rawMarkdown = element.rawData || '';

    if (!rawMarkdown.trim()) {
        return `<div id="${element.id || ''}" data-element-type="table" ${containerStyleAttr}>
              <p>表格内容为空</p>
            </div>`;
    }

    try {

        // 配置marked选项
        const markedOptions = {
            gfm: true,           // 启用GitHub风格Markdown
            breaks: true,        // 允许回车换行
            headerIds: false,    // 不生成header ID
            mangle: false        // 不转义HTML
        };

        // 使用marked解析markdown
        let html = marked(rawMarkdown, markedOptions);

        // 从HTML中提取表格
        const tableMatch = html.match(/<table>[\s\S]*?<\/table>/);
        if (!tableMatch) {
            throw new Error('无法从marked输出中提取表格HTML');
        }

        // 获取表格HTML
        let tableHtml = tableMatch[0];

        // 应用样式
        tableHtml = applyTableStyles(tableHtml, tableStyleConfig, thStyleConfig, trStyleConfig, tdStyleConfig);


        const className = element.layout && element.layout.className ? element.layout.className : '';
        const classAttr = className ? `class="${className}"` : '';

        return `
      <div id="${element.id || ''}" ${classAttr} data-element-type="table" ${containerStyleAttr}>
        ${tableHtml}
      </div>
    `;
    } catch (error) {
        console.error('表格渲染出错:', error);
        return `
      <div id="${element.id || ''}" data-element-type="table" ${containerStyleAttr}>
        <p>表格解析错误: ${error.message}</p>
        <pre>${escapeHtml(rawMarkdown)}</pre>
      </div>
    `;
    }
}

/**
 * 生成内联样式字符串
 * @param {Object} styleObj - 样式对象
 * @returns {string} - 内联样式字符串
 */
function generateInlineStyle(styleObj) {
    if (!styleObj || Object.keys(styleObj).length === 0) return '';

    return Object.entries(styleObj)
        .filter(([key, value]) => {
            // 过滤掉className和classStyle，这些不是CSS样式属性
            if (key === 'className' || key === 'classStyle') {
                return false;
            }
            
            // 过滤掉对象类型的值，只保留基本类型（字符串、数字、布尔值）
            if (value === null || value === undefined) {
                return false;
            }
            
            if (typeof value === 'object') {
                console.warn(`跳过对象类型的样式值: ${key}:`, value);
                return false;
            }
            
            return true;
        })
        .map(([key, value]) => {
            // 转换驼峰式为连字符式
            const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            
            // 如果值是数字但不是特定属性，添加px
            let cssValue = value;
            if (typeof value === 'number' &&
                !['fontWeight', 'lineHeight', 'opacity', 'zIndex'].includes(key)) {
                cssValue = `${value}px`;
            }
            
            return `${cssKey}: ${cssValue}`;
        })
        .join('; ');
}

/**
 * 为表格应用样式
 * @param {string} tableHtml - 原始表格HTML
 * @param {Object} tableStyleConfig - 表格样式配置
 * @param {Object} thStyleConfig - 表头样式配置
 * @param {Object} trStyleConfig - 行样式配置
 * @param {Object} tdStyleConfig - 单元格样式配置
 * @returns {string} - 应用样式后的表格HTML
 */
function applyTableStyles(tableHtml, tableStyleConfig, thStyleConfig, trStyleConfig, tdStyleConfig) {

    // 生成样式字符串，确保它们以分号结尾
    const ensureStyleEndsWithSemicolon = (style) => {
        if (!style) return '';
        return style.endsWith(';') ? style : `${style};`;
    };

    // 获取各元素的样式字符串和className
    const tableStyleStr = generateInlineStyle(tableStyleConfig);
    const tableClassName = tableStyleConfig?.className || '';
    
    const thStyleStr = generateInlineStyle(thStyleConfig);
    const thClassName = thStyleConfig?.className || '';
    
    const trStyleStr = generateInlineStyle(trStyleConfig);
    const trClassName = trStyleConfig?.className || '';
    
    const tdStyleStr = generateInlineStyle(tdStyleConfig);
    const tdClassName = tdStyleConfig?.className || '';

    // 替换表格标签，应用样式和className
    let tableAttributes = '';
    if (tableClassName) {
        tableAttributes += ` class="${tableClassName}"`;
    }
    if (tableStyleStr) {
        tableAttributes += ` style="${ensureStyleEndsWithSemicolon(tableStyleStr)}"`;
    }
    if (tableAttributes) {
        tableHtml = tableHtml.replace(/<table/, `<table${tableAttributes}`);
    }

    // 应用th样式和className
    let thAttributes = '';
    if (thClassName) {
        thAttributes += ` class="${thClassName}"`;
    }
    if (thStyleStr) {
        thAttributes += ` style="${ensureStyleEndsWithSemicolon(thStyleStr)}"`;
    }
    if (thAttributes) {
        tableHtml = tableHtml.replace(/<th\b/g, `<th${thAttributes}`);
    }

    // 应用tr样式和className
    let trAttributes = '';
    if (trClassName) {
        trAttributes += ` class="${trClassName}"`;
    }
    if (trStyleStr) {
        trAttributes += ` style="${ensureStyleEndsWithSemicolon(trStyleStr)}"`;
    }
    if (trAttributes) {
        tableHtml = tableHtml.replace(/<tr\b/g, `<tr${trAttributes}`);
    }

    // 应用td样式和className
    let tdAttributes = '';
    if (tdClassName) {
        tdAttributes += ` class="${tdClassName}"`;
    }
    if (tdStyleStr) {
        tdAttributes += ` style="${ensureStyleEndsWithSemicolon(tdStyleStr)}"`;
    }
    if (tdAttributes) {
        tableHtml = tableHtml.replace(/<td\b/g, `<td${tdAttributes}`);
    }

    console.log('表格样式应用完成');
    return tableHtml;
}

/**
 * 生成代码容器专用的样式属性（排除会影响hljs高亮的属性）
 * @param {Object} styleObject - 样式对象
 * @returns {string} - 样式属性字符串
 */
function generateCodeContainerStyleAttribute(styleObject) {
    if (!styleObject || typeof styleObject !== 'object') {
        return '';
    }

    // 创建样式副本，排除会影响hljs高亮的属性
    const codeContainerStyle = { ...styleObject };
    
    // 删除会影响hljs语法高亮的颜色属性
    delete codeContainerStyle.color;
    
    // 将样式对象转换为样式字符串
    const styleString = Object.entries(codeContainerStyle)
        .map(([key, value]) => {
            // 如果值是数字，且不是特定属性，添加px单位
            if (typeof value === 'number' &&
                !['fontWeight', 'lineHeight', 'opacity', 'zIndex'].includes(key)) {
                value = `${value}px`;
            }

            // 转换驼峰式属性名为连字符式
            const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            return `${cssKey}: ${value}`;
        })
        .join('; ');

    return styleString ? `style="${styleString}"` : '';
}

/**
 * 渲染代码元素
 * @param {Object} element - 代码元素
 * @returns {string} - 渲染的HTML字符串
 */
function renderCodeElement(element) {
    if (!element) {
        return '<div>代码元素结构不完整</div>';
    }

    // 🆕 使用专门的代码容器样式生成函数，避免覆盖hljs颜色
    const containerStyleAttr = generateCodeContainerStyleAttribute(element.computedStyle || {});

    // 使用预处理好的高亮HTML
    let html = element.highlightedCode || '';

    // 如果没有预处理的HTML，回退到原始方式
    if (!html) {
        const rawCode = element.rawData || '';
        const language = element.language || 'plaintext';

        if (!rawCode.trim()) {
            return `<div id="${element.id || ''}" data-element-type="code" ${containerStyleAttr}>
                  <p>代码内容为空</p>
                </div>`;
        }

        try {
            // 使用原始的方式生成代码高亮
            html = `<pre><code class="language-${language}">${escapeHtml(rawCode)}</code></pre>`;
        } catch (error) {
            console.error('代码渲染出错:', error);
            html = `<p>代码解析错误: ${error.message}</p><pre>${escapeHtml(rawCode)}</pre>`;
        }
    }

    const className = element.layout && element.layout.className ? element.layout.className : '';
    const classAttr = className ? `class="${className}"` : '';

    return `
      <div id="${element.id || ''}" ${classAttr} data-element-type="code" ${containerStyleAttr}>
        ${html}
      </div>
    `;
}

/**
 * 渲染图表元素
 * @param {Object} element - 图表元素
 * @returns {string} - 渲染的HTML字符串
 */
function renderChartElement(element) {
    if (!element) {
        return '<div>图表元素结构不完整</div>';
    }

    // 生成容器样式
    const containerStyleAttr = generateStyleAttribute(element.computedStyle || {});

    // 获取SVG内容
    const svgContent = element.svgContent || '';

    if (!svgContent) {
        return `<div id="${element.id || ''}" data-element-type="chart" ${containerStyleAttr}>
              <p>图表内容为空</p>
              <pre>${escapeHtml(element.rawData || '')}</pre>
            </div>`;
    }

    try {
        // 直接使用生成的SVG内容
        const className = element.layout && element.layout.className ? element.layout.className : '';
        const classAttr = className ? `class="${className}"` : '';

        // 应用图表子元素样式到SVG内容
        const styledSvgContent = applyChartStyles(svgContent, element);

        // 🆕 检查是否有图表切换事件
        const hasChartChangedEvent = element.events && element.events.some(event => 
            event.runtimeEventKey === 'chart_changed' && event.parameters && event.parameters.chartTypes
        );

        // 🆕 如果有图表切换事件，添加点击样式和事件属性
        const clickStyle = hasChartChangedEvent ? 'cursor: pointer;' : '';
        const clickAttr = hasChartChangedEvent ? 'data-chart-clickable="true"' : '';
        const chartTypes = element.events.find(e => e.runtimeEventKey === 'chart_changed')?.parameters?.chartTypes || [];
        const chartTypesAttr = hasChartChangedEvent ? 
            `data-chart-types="${chartTypes.join(',')}"` : '';

        return `
      <div id="${element.id || ''}" ${classAttr} data-element-type="chart" data-chart-type="${element.chartType || ''}" ${containerStyleAttr} style="${clickStyle}" ${clickAttr} ${chartTypesAttr}>
        ${styledSvgContent}
      </div>
    `;
    } catch (error) {
        console.error('图表渲染出错:', error);
        return `
      <div id="${element.id || ''}" data-element-type="chart" ${containerStyleAttr}>
        <p>图表渲染错误: ${error.message}</p>
        <pre>${escapeHtml(element.rawData || '')}</pre>
      </div>
    `;
    }
}

/**
 * 应用图表子元素样式到SVG内容
 * @param {string} svgContent - 原始SVG内容
 * @param {Object} element - 图表元素
 * @returns {string} - 应用样式后的SVG内容
 */
function applyChartStyles(svgContent, element) {
    if (!element.layout) return svgContent;

    let styledSvg = svgContent;

    // 应用标题样式
    if (element.layout.title && element.layout.title.className && element.layout.title.classStyle) {
        const titleClassName = element.layout.title.className;
        const titleStyle = element.layout.title.classStyle;
        const titleStyleStr = generateInlineStyle(titleStyle);
        
        if (titleStyleStr) {
            // 为SVG中的标题元素添加样式
            styledSvg = styledSvg.replace(
                /<text[^>]*class="[^"]*title[^"]*"[^>]*>/g,
                `<text class="${titleClassName}" style="${titleStyleStr}">`
            );
        }
    }

    // 应用图例样式
    if (element.layout.legend && element.layout.legend.className && element.layout.legend.classStyle) {
        const legendClassName = element.layout.legend.className;
        const legendStyle = element.layout.legend.classStyle;
        const legendStyleStr = generateInlineStyle(legendStyle);
        
        if (legendStyleStr) {
            // 为SVG中的图例元素添加样式
            styledSvg = styledSvg.replace(
                /<text[^>]*class="[^"]*legend-label[^"]*"[^>]*>/g,
                `<text class="${legendClassName}" style="${legendStyleStr}">`
            );
        }
    }

    // 应用坐标轴样式
    if (element.layout.axis && element.layout.axis.className && element.layout.axis.classStyle) {
        const axisClassName = element.layout.axis.className;
        const axisStyle = element.layout.axis.classStyle;
        const axisStyleStr = generateInlineStyle(axisStyle);
        
        if (axisStyleStr) {
            // 为SVG中的坐标轴标签添加样式
            styledSvg = styledSvg.replace(
                /<text[^>]*class="[^"]*axis-label[^"]*"[^>]*>/g,
                `<text class="${axisClassName}" style="${axisStyleStr}">`
            );
            
            // 为SVG中的坐标轴标题添加样式
            styledSvg = styledSvg.replace(
                /<text[^>]*class="[^"]*axis-title[^"]*"[^>]*>/g,
                `<text class="${axisClassName}" style="${axisStyleStr}">`
            );
        }
    }

    return styledSvg;
}

/**
 * 渲染通用元素
 * @param {Object} element - 元素对象
 * @returns {string} - 渲染的HTML字符串
 */
function renderGenericElement(element) {
    const styleAttr = generateStyleAttribute(element.computedStyle);

    // 递归渲染子元素
    let childrenHtml = '';
    if (element.children && Array.isArray(element.children)) {
        childrenHtml = element.children.map(child => renderElement(child)).join('');
    }

    return `<div id="${element.id || ''}" data-element-type="generic" ${styleAttr}>${childrenHtml}</div>`;
}

/**
 * 生成style属性字符串
 * @param {Object} styleObject - 样式对象
 * @returns {string} - style属性字符串
 */
function generateStyleAttribute(styleObject) {
    if (!styleObject || typeof styleObject !== 'object') {
        return '';
    }

    // 将样式对象转换为样式字符串
    const styleString = Object.entries(styleObject)
        .map(([key, value]) => {
            // 如果值是数字，且不是特定属性，添加px单位
            if (typeof value === 'number' &&
                !['fontWeight', 'lineHeight', 'opacity', 'zIndex'].includes(key)) {
                value = `${value}px`;
            }

            // 转换驼峰式属性名为连字符式
            const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
            return `${cssKey}: ${value}`;
        })
        .join('; ');

    return styleString ? `style="${styleString}"` : '';
}

/**
 * 转义HTML特殊字符
 * @param {string} text - 需要转义的文本
 * @returns {string} - 转义后的文本
 */
function escapeHtml(text) {
    if (!text || typeof text !== 'string') return '';

    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export default renderEightElementToHtml; 