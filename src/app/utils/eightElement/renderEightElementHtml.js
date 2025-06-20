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

    // 创建HTML文档头部
    const htmlHeader = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Eight Element Renderer</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css" crossorigin="anonymous">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.11.1/build/styles/github.min.css" crossorigin="anonymous"></link>
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
    </body>
    </html>
  `;

    return {
        html: htmlHeader + htmlBody + htmlFooter,
        processedEightElement
    };
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
        
        // 解析token值
        let resolvedValue = resolveToken(value) || value;
        
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

                    
                    // FOCUS: 这里没有 background 的解析
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

    // 处理样式引用
    if (originalElement.layout && originalElement.layout.style) {
        processStyleReferences(processedElement, originalElement, originalElement.layout.style);
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

    // 处理layout.style，通过统一的引用处理逻辑
    if (element.layout && element.layout.style) {
        processStyleReferences({ computedStyle }, element, element.layout.style);
    }

    // 默认值处理：如果设置了display=flex但未设置flex方向，默认为column
    if (computedStyle.display === 'flex' && !computedStyle.flexDirection) {
        computedStyle.flexDirection = 'column';
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
            if (value === 'HORIZONTAL') {
                computedStyle.flexDirection = 'row';
            } else if (value === 'VERTICAL') {
                computedStyle.flexDirection = 'column';
            } else if (value === 'NONE') {
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
    }
    // 2. 回退到原始font内容
    else if (element.font && element.font.fontsize && element.font.fontsize.default) {
        contentHtml = element.font.fontsize.default.content || '';

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

    // 获取图片URL
    let imageUrl = element.imageUrl || '';

    if (imageUrl) {
        // 添加图片标签
        return `
      <div id="${element.id || ''}" ${classAttr} data-element-type="image" ${styleAttr}>
        <img src="${imageUrl}" alt="Element Image" style="width:100%;height:100%;object-fit:cover;">
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

    // 生成内联样式字符串
    const generateInlineStyle = (styleObj) => {
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
 * 渲染代码元素
 * @param {Object} element - 代码元素
 * @returns {string} - 渲染的HTML字符串
 */
function renderCodeElement(element) {
    if (!element) {
        return '<div>代码元素结构不完整</div>';
    }

    // 生成容器样式
    const containerStyleAttr = generateStyleAttribute(element.computedStyle || {});

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

        return `
      <div id="${element.id || ''}" ${classAttr} data-element-type="chart" data-chart-type="${element.chartType || ''}" ${containerStyleAttr}>
        ${svgContent}
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