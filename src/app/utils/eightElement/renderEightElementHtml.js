/**
 * renderEightElementHtml.js
 * 
 * 将八要素结构渲染为HTML的工具
 * 不依赖预设系统，完全基于metaware的CSS和八要素结构
 */

import { metawareToStyleObject } from '../metaware/metawareToCss.js';
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
          height: ${height}px;
          position: relative;
          overflow: auto;
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
  
  // 处理当前元素的样式
  processedElement.computedStyle = processElementStyle(element);
  
  // 处理元素的文本内容
  if (element.name === 'text') {
    let content = '';
    
    if (element.font && element.font.fontsize && element.font.fontsize.default) {
      content = element.font.fontsize.default.content || '';
    } else if (element.content) {
      if (typeof element.content === 'string') {
        content = element.content;
      } else if (Array.isArray(element.content)) {
        content = element.content[0]?.value || '';
      }
    }
    
    processedElement.textContent = content;
  }
  
  // 处理元素的图片
  if (element.name === 'background' || element.name === 'image') {
    let imageUrl = '';
    
    if (element.material && element.material.image && element.material.image.default) {
      imageUrl = element.material.image.default.resource || '';
    } else if (element.src) {
      imageUrl = element.src;
    }
    
    processedElement.imageUrl = imageUrl;
  }
  
  // 处理按钮内容
  if (element.name === 'button') {
    let buttonText = '';
    
    if (element.font && element.font.fontsize && element.font.fontsize.default) {
      buttonText = element.font.fontsize.default.content || 'Button';
    } else if (element.content) {
      if (typeof element.content === 'string') {
        buttonText = element.content;
      } else if (Array.isArray(element.content)) {
        buttonText = element.content[0]?.value || 'Button';
      }
    }
    
    processedElement.buttonText = buttonText;
  }
  
  // 递归处理子元素
  if (processedElement.layout && processedElement.layout.children && Array.isArray(processedElement.layout.children)) {
    processedElement.layout.children = processedElement.layout.children.map(child => preProcessEightElement(child));
  }
  
  return processedElement;
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
  const style = processElementStyle(element);
  const styleAttr = generateStyleAttribute(style);
  
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
  const style = processElementStyle(element);
  const styleAttr = generateStyleAttribute(style);
  
  // 从元素中提取文本内容
  let textContent = '';
  
  if (element.font && element.font.fontsize && element.font.fontsize.default) {
    textContent = element.font.fontsize.default.content || '';
  } else if (element.content) {
    if (typeof element.content === 'string') {
      textContent = element.content;
    } else if (Array.isArray(element.content)) {
      textContent = element.content[0]?.value || '';
    }
  }
  
  // 转义HTML特殊字符
  textContent = escapeHtml(textContent);
  
  // 处理换行
  textContent = textContent.replace(/\n/g, '<br>');
  
  return `<div id="${element.id || ''}" data-element-type="text" ${styleAttr}>${textContent}</div>`;
}

/**
 * 渲染按钮元素
 * @param {Object} element - 按钮元素
 * @returns {string} - 渲染的HTML字符串
 */
function renderButtonElement(element) {
  const style = processElementStyle(element);
  const styleAttr = generateStyleAttribute(style);
  
  // 从元素中提取按钮文本和URL
  let buttonText = '';
  let buttonUrl = element.url || '#';
  
  if (element.font && element.font.fontsize && element.font.fontsize.default) {
    buttonText = element.font.fontsize.default.content || 'Button';
  } else if (element.content) {
    if (typeof element.content === 'string') {
      buttonText = element.content;
    } else if (Array.isArray(element.content)) {
      buttonText = element.content[0]?.value || 'Button';
    }
  }
  
  // 判断是否有图标
  const hasIcon = element.color && element.color.icon_color;
  
  // 构建按钮HTML，使用<a>标签以支持链接功能
  if (hasIcon) {
    return `
      <div href="${buttonUrl}" id="${element.id || ''}" data-element-type="button" ${styleAttr}>
        ${escapeHtml(buttonText)}
      </div>
    `;
  } else {
    return `<div href="${buttonUrl}" id="${element.id || ''}" data-element-type="button" ${styleAttr}>${escapeHtml(buttonText)}</div>`;
  }
}

/**
 * 渲染图片元素
 * @param {Object} element - 图片元素
 * @returns {string} - 渲染的HTML字符串
 */
function renderImageElement(element) {
  const style = processElementStyle(element);
  const styleAttr = generateStyleAttribute(style);
  
  // 获取图片URL
  let imageUrl = '';
  
  if (element.material && element.material.image && element.material.image.default) {
    imageUrl = element.material.image.default.resource || '';
  } else if (element.src) {
    imageUrl = element.src;
  }
  
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
  const style = processElementStyle(element);
  const styleAttr = generateStyleAttribute(style);
  
  // 递归渲染子元素
  let childrenHtml = '';
  if (element.children && Array.isArray(element.children)) {
    childrenHtml = element.children.map(child => renderElement(child)).join('');
  }
  
  return `<div id="${element.id || ''}" data-element-type="generic" ${styleAttr}>${childrenHtml}</div>`;
}

/**
 * 处理元素样式，合并metaware样式和自定义样式
 * @param {Object} element - 元素对象
 * @returns {Object} - 处理后的样式对象
 */
function processElementStyle(element) {
  let computedStyle = {};
  
  try {
    // 获取元素类型
    const elementType = element.name || element.type || 'container';
    
    // 获取元素状态，默认为default
    const elementState = element.state || 'default';
    
    // 从metaware系统获取基础样式
    try {
      const metawareStyles = metawareToStyleObject(elementType, elementState, true);
      Object.assign(computedStyle, metawareStyles);
    } catch (err) {
      console.warn(`无法加载metaware样式: ${err.message}`, elementType, elementState);
    }
    
    // 合并元素自身样式
    if (element.style) {
      Object.assign(computedStyle, element.style);
    } else if (element.layout && element.layout.style) {
      // 这里不直接Object.assign，而是处理layout.style的特殊格式
      processLayoutStyle(element.layout.style, computedStyle);
    }
    
    // 处理八要素特有的样式格式
    processEightElementStyleTokens(element, computedStyle);
    
  } catch (error) {
    console.error('处理样式出错:', error);
  }
  
  return computedStyle;
}

/**
 * 处理八要素特有的样式token
 * @param {Object} element - 元素对象
 * @param {Object} computedStyle - 计算的样式对象
 */
function processEightElementStyleTokens(element, computedStyle) {
  // 处理颜色
  if (element.color) {
    processColorTokens(element, computedStyle);
  }
  
  // 处理形状
  if (element.shape) {
    processShapeTokens(element, computedStyle);
  }
  
  // 处理尺寸
  if (element.scale) {
    processScaleTokens(element, computedStyle);
  }
  
  // 处理字体
  if (element.font) {
    processFontTokens(element, computedStyle);
  }
  
  // 处理布局
  if (element.layout) {
    processLayoutTokens(element, computedStyle);
  }
  
  // 处理其他素材
  if (element.material) {
    processMaterialTokens(element, computedStyle);
  }
}

/**
 * 处理颜色相关token
 * @param {Object} element - 元素对象
 * @param {Object} computedStyle - 计算的样式对象
 */
function processColorTokens(element, computedStyle) {
  const state = element.state || 'default';
  
  // 背景色
  if (element.color.bg && element.color.bg[state]) {
    const bgColor = element.color.bg[state].style?.bg?.value;
    if (bgColor) {
      computedStyle.backgroundColor = resolveToken(bgColor) || bgColor;
    }
  }
  
  // 文本色
  if (element.color.text && element.color.text[state]) {
    const textColor = element.color.text[state].style?.text?.value;
    if (textColor) {
      computedStyle.color = resolveToken(textColor) || textColor;
    }
  }
  
  // 边框色
  if (element.color.border && element.color.border[state]) {
    const borderColor = element.color.border[state].style?.border?.value;
    if (borderColor) {
      computedStyle.borderColor = resolveToken(borderColor) || borderColor;
    }
  }
  
  // 图标色
  if (element.color.icon_color && element.color.icon_color[state]) {
    const iconColor = element.color.icon_color[state].style?.icon_color?.value;
    if (iconColor) {
      computedStyle['--icon-color'] = resolveToken(iconColor) || iconColor;
    }
  }
}

/**
 * 处理形状相关token
 * @param {Object} element - 元素对象
 * @param {Object} computedStyle - 计算的样式对象
 */
function processShapeTokens(element, computedStyle) {
  const state = element.state || 'default';
  
  // 边框圆角
  if (element.shape.borderradius && element.shape.borderradius[state]) {
    const borderRadius = element.shape.borderradius[state].style?.borderradius?.value;
    if (borderRadius) {
      computedStyle.borderRadius = resolveToken(borderRadius) || borderRadius;
    }
  }
  
  // 边框宽度
  if (element.shape.borderwidth && element.shape.borderwidth[state]) {
    const borderWidth = element.shape.borderwidth[state].style?.borderwidth?.value;
    if (borderWidth) {
      computedStyle.borderWidth = resolveToken(borderWidth) || borderWidth;
      computedStyle.borderStyle = computedStyle.borderStyle || 'solid';
    }
  }
}

/**
 * 处理尺寸相关token
 * @param {Object} element - 元素对象
 * @param {Object} computedStyle - 计算的样式对象
 */
function processScaleTokens(element, computedStyle) {
  const state = element.state || 'default';
  
  // 内边距
  if (element.scale.padding && element.scale.padding[state]) {
    const padding = element.scale.padding[state].style?.padding?.value;
    if (padding) {
      computedStyle.padding = resolveToken(padding) || padding;
    }
  }
  
  // 间距
  if (element.scale.gap && element.scale.gap[state]) {
    const gap = element.scale.gap[state].style?.gap?.value;
    if (gap) {
      computedStyle.gap = resolveToken(gap) || gap;
    }
  }
  
  // 最小宽度
  if (element.scale.min_width && element.scale.min_width[state]) {
    const minWidth = element.scale.min_width[state].style?.min_width?.value;
    if (minWidth) {
      computedStyle.minWidth = resolveToken(minWidth) || minWidth;
    }
  }
  
  // 最小高度
  if (element.scale.min_height && element.scale.min_height[state]) {
    const minHeight = element.scale.min_height[state].style?.min_height?.value;
    if (minHeight) {
      computedStyle.minHeight = resolveToken(minHeight) || minHeight;
    }
  }
  
  // 最大宽度
  if (element.scale.max_width && element.scale.max_width[state]) {
    const maxWidth = element.scale.max_width[state].style?.max_width?.value;
    if (maxWidth) {
      computedStyle.maxWidth = resolveToken(maxWidth) || maxWidth;
    }
  }
}

/**
 * 处理字体相关token
 * @param {Object} element - 元素对象
 * @param {Object} computedStyle - 计算的样式对象
 */
function processFontTokens(element, computedStyle) {
  const state = element.state || 'default';
  
  // 字体大小
  if (element.font.fontsize && element.font.fontsize[state]) {
    const fontSize = element.font.fontsize[state].style?.fontsize?.value;
    if (fontSize) {
      computedStyle.fontSize = resolveToken(fontSize) || fontSize;
    }
  }
  
  // 字体粗细
  if (element.font.fontweight && element.font.fontweight[state]) {
    const fontWeight = element.font.fontweight[state].style?.fontweight?.value;
    if (fontWeight) {
      computedStyle.fontWeight = resolveToken(fontWeight) || fontWeight;
    }
  }
}

/**
 * 处理布局相关token
 * @param {Object} element - 元素对象
 * @param {Object} computedStyle - 计算的样式对象
 */
function processLayoutTokens(element, computedStyle) {
  // 处理布局样式对象
  if (element.layout.style) {
    processLayoutStyle(element.layout.style, computedStyle);
  }
  
  const state = element.state || 'default';
  
  // 处理flex方向
  if (element.layout.flex_direction) {
    const flexDirection = element.layout.flex_direction;
    if (typeof flexDirection === 'string') {
      computedStyle.flexDirection = flexDirection;
    } else if (flexDirection[state] && flexDirection[state].style?.flex_direction?.value) {
      computedStyle.flexDirection = resolveToken(flexDirection[state].style.flex_direction.value) || 
                                   flexDirection[state].style.flex_direction.value;
    }
  }
  
  // 处理justify-content
  if (element.layout.justify_content) {
    const justifyContent = element.layout.justify_content;
    if (typeof justifyContent === 'string') {
      computedStyle.justifyContent = justifyContent;
    } else if (justifyContent[state] && justifyContent[state].style?.justify_content?.value) {
      computedStyle.justifyContent = resolveToken(justifyContent[state].style.justify_content.value) || 
                                    justifyContent[state].style.justify_content.value;
    }
  }
  
  // 处理align-items
  if (element.layout.align_items) {
    const alignItems = element.layout.align_items;
    if (typeof alignItems === 'string') {
      computedStyle.alignItems = alignItems;
    } else if (alignItems[state] && alignItems[state].style?.align_items?.value) {
      computedStyle.alignItems = resolveToken(alignItems[state].style.align_items.value) || 
                               alignItems[state].style.align_items.value;
    }
  }
  
  // 处理flex-wrap
  if (element.layout.flex_wrap) {
    const flexWrap = element.layout.flex_wrap;
    if (typeof flexWrap === 'string') {
      computedStyle.flexWrap = flexWrap;
    } else if (flexWrap[state] && flexWrap[state].style?.flex_wrap?.value) {
      computedStyle.flexWrap = resolveToken(flexWrap[state].style.flex_wrap.value) || 
                             flexWrap[state].style.flex_wrap.value;
    }
  }
  
  // 处理gap（如果在scale中没有定义）
  if (!computedStyle.gap && element.layout.gap) {
    const gap = element.layout.gap;
    if (typeof gap === 'string') {
      computedStyle.gap = gap;
    } else if (gap[state] && gap[state].style?.gap?.value) {
      computedStyle.gap = resolveToken(gap[state].style.gap.value) || gap[state].style.gap.value;
    }
  }
}

/**
 * 处理布局样式对象，将八要素特定的布局属性转换为CSS属性
 * @param {Object} layoutStyle - 布局样式对象
 * @param {Object} computedStyle - 计算的样式对象
 */
function processLayoutStyle(layoutStyle, computedStyle) {
  if (!layoutStyle || typeof layoutStyle !== 'object') return;
  
  // 遍历布局样式对象的所有属性
  Object.entries(layoutStyle).forEach(([key, value]) => {
    // 提取值（解析token或对象）
    const resolvedValue = extractStyleValue(value);
    
    // 根据键名转换为CSS属性
    switch (key) {
      // 显示相关
      case 'display':
        if (resolvedValue === 'inlineblock') {
          computedStyle.display = 'inline-block';
        } else {
          computedStyle.display = resolvedValue;
        }
        break;
        
      // 布局方向
      case 'layoutMode':
        if (resolvedValue === 'HORIZONTAL') {
          computedStyle.flexDirection = 'row';
        } else if (resolvedValue === 'VERTICAL') {
          computedStyle.flexDirection = 'column';
        } else if (resolvedValue === 'NONE') {
          // 不设置flexDirection
        }
        break;
        
      // 布局换行
      case 'layoutWrap':
        computedStyle.flexWrap = resolvedValue === 'WRAP' ? 'wrap' : 'nowrap';
        break;
        
      // 主轴对齐（水平方向的对齐方式）
      case 'primaryAxisAlignItems':
        switch (resolvedValue) {
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
            computedStyle.justifyContent = 'flex-start';
            break;
        }
        break;
        
      // 交叉轴对齐（垂直方向的对齐方式）
      case 'counterAxisAlignItems':
        switch (resolvedValue) {
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
            computedStyle.alignItems = 'stretch';
            break;
        }
        break;
        
      // 主轴尺寸模式
      case 'primaryAxisSizingMode':
        switch (resolvedValue) {
          case 'FIXED':
            // 固定尺寸，由width/height决定
            break;
          case 'AUTO':
            // 自动尺寸，根据内容决定
            if (computedStyle.flexDirection === 'row') {
              computedStyle.width = 'auto';
            } else {
              computedStyle.height = 'auto';
            }
            break;
          case 'FILL':
            // 填充可用空间
            computedStyle.flexGrow = computedStyle.flexGrow || 1;
            break;
          default:
            // 默认为AUTO
            if (computedStyle.flexDirection === 'row') {
              computedStyle.width = 'auto';
            } else {
              computedStyle.height = 'auto';
            }
            break;
        }
        break;
        
      // 交叉轴尺寸模式
      case 'counterAxisSizingMode':
        switch (resolvedValue) {
          case 'FIXED':
            // 固定尺寸，由width/height决定
            break;
          case 'AUTO':
            // 自动尺寸，根据内容决定
            if (computedStyle.flexDirection === 'row') {
              computedStyle.height = 'auto';
            } else {
              computedStyle.width = 'auto';
            }
            break;
          case 'FILL':
            // 填充可用空间
            if (computedStyle.flexDirection === 'row') {
              computedStyle.height = '100%';
            } else {
              computedStyle.width = '100%';
            }
            break;
          default:
            // 默认为AUTO
            if (computedStyle.flexDirection === 'row') {
              computedStyle.height = 'auto';
            } else {
              computedStyle.width = 'auto';
            }
            break;
        }
        break;
        
      // 自身对齐（元素在父容器中的对齐方式）
      case 'layoutAlign':
        switch (resolvedValue) {
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
            // 不设置
            break;
        }
        break;
        
      // 伸展因子
      case 'layoutGrow':
        computedStyle.flexGrow = resolvedValue;
        break;
        
      // 内边距
      case 'spacing':
        if (typeof value !== 'object' || !value.element) {
          computedStyle.padding = resolvedValue;
        }
        break;
        
      // 元素之间的间距
      case 'itemSpacing':
        if (typeof value !== 'object' || !value.element) {
          computedStyle.gap = resolvedValue;
        }
        break;
        
      // 尺寸相关属性，这些通常会被八要素的其他处理器处理
      case 'borderColor':
      case 'borderRadius':
      case 'borderWidth':
      case 'boxShadow':
      case 'iconColor':
      case 'minWidth':
      case 'minHeight':
      case 'maxWidth':
      case 'maxHeight':
        // 这些属性通常有对应的element对象处理，不在这里处理
        break;
        
      // 对于不能识别的属性，直接添加到样式对象中
      default:
        computedStyle[key] = resolvedValue;
        break;
    }
  });
  
  // 默认值处理：如果设置了display=flex但未设置flex方向，默认为column
  if (computedStyle.display === 'flex' && !computedStyle.flexDirection) {
    computedStyle.flexDirection = 'column';
  }
}

/**
 * 提取样式值，处理token和对象引用
 * @param {any} value - 样式值
 * @returns {any} - 解析后的值
 */
function extractStyleValue(value) {
  // 处理token字符串
  if (typeof value === 'string') {
    return resolveToken(value) || value;
  }
  
  // 处理对象类型的引用（如八要素对象引用）
  if (value && typeof value === 'object' && value.element && value.value) {
    // 这种情况通常由其他处理函数处理，返回原对象
    return value;
  }
  
  // 其他类型原样返回
  return value;
}

/**
 * 处理素材相关token
 * @param {Object} element - 元素对象
 * @param {Object} computedStyle - 计算的样式对象
 */
function processMaterialTokens(element, computedStyle) {
  const state = element.state || 'default';
  
  // 阴影效果
  if (element.material.elevation && element.material.elevation[state]) {
    const elevation = element.material.elevation[state].style?.elevation?.value;
    if (elevation && elevation !== 'none') {
      computedStyle.boxShadow = resolveToken(elevation) || elevation;
    }
  }
  
  // 图片背景
  if (element.material.image && element.material.image[state]) {
    const image = element.material.image[state].style?.image?.value;
    if (image && image !== 'none') {
      computedStyle.backgroundImage = `url(${image})`;
      computedStyle.backgroundSize = 'cover';
      computedStyle.backgroundPosition = 'center';
    }
  }
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