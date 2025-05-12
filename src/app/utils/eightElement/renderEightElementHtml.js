/**
 * renderEightElementHtml.js
 * 
 * 将八要素结构渲染为HTML的工具
 * 不依赖预设系统，完全基于metaware的CSS和八要素结构
 */

import resolveToken from '../tokens/resolveToken.js';

/**
 * 渲染八要素结构为HTML字符串，并返回预处理后的八要素结构
 * @param {Object} eightElement - 八要素结构对象
 * @param {Object} options - 渲染选项
 * @returns {Object} - 包含HTML字符串和预处理后的八要素结构
 */
export function renderEightElementToHtml(eightElement, options = {}) {
  const { width = 1024, height = 768 } = options;
  
  // 创建HTML文档头部
  const htmlHeader = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Eight Element Renderer</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }
        .eight-element-container {
          width: ${width}px;
          position: relative;
        }
        * {
          box-sizing: border-box;
        }
      </style>
    </head>
    <body>
      <div class="eight-element-container" id="root">
  `;

    // 预处理八要素结构
    const processedEightElement = preProcessEightElement(eightElement);
  
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
    // 确定使用哪种文本形态 (text_body 或 text_hyperlink)
    const textType = originalElement.type === 'text_body' ? 'text_body' : 'text_hyperlink';
    const textConfig = originalElement.layout[textType];

    if (!textConfig) return;

    processedElement.textType = textType;

    // 处理内容引用
    if (textConfig.content && Array.isArray(textConfig.content)) {
        const fontRef = textConfig.content.find(item => item.element === 'font');
        if (fontRef && originalElement.font && originalElement.font[fontRef.value]) {
            const content = originalElement.font[fontRef.value][fontRef.prop]?.content || '';
            processedElement.textContent = content;
        }
    }

    // 处理文本样式引用
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
      return renderTextElement(element);
    case 'button':
      return renderButtonElement(element);
    case 'background':
    case 'image':
      return renderImageElement(element);
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
  
  let childrenHtml = '';
  if (element.layout && element.layout.children && Array.isArray(element.layout.children)) {
    childrenHtml = element.layout.children.map(child => renderElement(child)).join('');
  }
  
  return `<div id="${element.id || ''}" data-element-type="layout" ${styleAttr}>${childrenHtml}</div>`;
}

/**
 * 渲染文本元素
 * @param {Object} element - 文本元素
 * @returns {string} - 渲染的HTML字符串
 */
function renderTextElement(element) {
    const styleAttr = generateStyleAttribute(element.computedStyle);
    let textContent = element.textContent || '';
  
  // 转义HTML特殊字符
  textContent = escapeHtml(textContent);
  
  // 处理换行
  textContent = textContent.replace(/\n/g, '<br>');
  
    // 根据textType决定HTML结构
    if (element.textType === 'text_hyperlink') {
        // 超链接文本用带样式的a标签
        const url = element.url || '#';
        return `
      <div id="${element.id || ''}" data-element-type="text" ${styleAttr}>
        <a href="${url}" style="text-decoration:underline;color:inherit;">${textContent}</a>
      </div>
    `;
    } else {
        // 普通文本用span嵌套在div中
        return `
      <div id="${element.id || ''}" data-element-type="text" ${styleAttr}>
        <span>${textContent}</span>
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
  
    // 获取按钮内容和URL
    let buttonText = element.buttonText || 'Button';
  let buttonUrl = element.url || '#';
  
    // 转义HTML特殊字符
    buttonText = escapeHtml(buttonText);

    // 构建按钮HTML
    return `
    <div id="${element.id || ''}" data-element-type="button" ${styleAttr}>
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
  
  // 获取图片URL
    let imageUrl = element.imageUrl || '';
  
  if (imageUrl) {
    // 添加图片标签
    return `
      <div id="${element.id || ''}" data-element-type="image" ${styleAttr}>
        <img src="${imageUrl}" alt="Element Image" style="width:100%;height:100%;object-fit:cover;">
      </div>
    `;
  } else {
    // 没有图片URL时显示占位符
    return `
      <div id="${element.id || ''}" data-element-type="image" ${styleAttr} style="display:flex;align-items:center;justify-content:center;color:#999;">
        Image Placeholder
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