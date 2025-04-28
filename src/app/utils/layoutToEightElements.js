/**
 * 布局转换工具 - 将普通layout格式转换为八要素格式
 */

import { mergeElementPresets } from './presets/presetSystem.js';

/**
 * 将布局对象转换为八要素格式
 * @param {Object} layout - 布局对象
 * @returns {Object} - 八要素格式的布局对象
 */
export function convertToEightElementFormat(layout) {
  if (!layout) {
    throw new Error('无效的布局对象');
  }
  
  // 创建八要素格式的基础结构
  const eightElementLayout = {
    "dataKeys": [],
    "id": layout.id || `dd-${generateRandomId()}`,
    "name": "layout",
    "name-zh": "布局",
    "file-type": "template",
    "theme": "default",
    "layout": {
      "style": transformStyleToEightElementFormat(layout.style || {}),
      "children": []
    },
    "events": [{}]
  };
  
  // 递归处理子元素
  if (layout.children && Array.isArray(layout.children)) {
    eightElementLayout.layout.children = layout.children.map(child => 
      transformElementToEightElementFormat(child)
    );
  }
  
  return eightElementLayout;
}

/**
 * 将元素转换为八要素格式
 * @param {Object} element - 元素对象
 * @returns {Object} - 八要素格式的元素
 */
function transformElementToEightElementFormat(element) {
  if (!element) return null;

  // 处理元素的类型，确定八要素格式中的对应类型
  const elementType = determineElementType(element);
  
  // 基础的八要素元素格式
  const eightElementItem = {
    "dataKeys": [],
    "name": "layout",
    "name-zh": "布局",
    "file-type": "template",
    "theme": "default",
    "layout": {
      "style": transformStyleToEightElementFormat(element.style || {}),
      "children": []
    },
    "description": "",
    "id": element.id || `dd-${generateRandomId()}`,
    "events": [{}]
  };
  
  // 根据元素类型处理特殊结构
  switch (elementType) {
    case 'container':
      // 容器类型不需要特殊处理，使用默认的layout结构
      if (element.children && Array.isArray(element.children)) {
        eightElementItem.layout.children = element.children.map(child => 
          transformElementToEightElementFormat(child)
        );
      }
      break;
      
    case 'text':
      // 处理文本类型元素
      eightElementItem.name = "text";
      eightElementItem["name-zh"] = "文本";
      eightElementItem["file-type"] = "cell-element";
      eightElementItem.layout = createTextElementLayout(element);
      break;
      
    case 'image':
    case 'background':
      // 处理图片或背景类型元素
      eightElementItem.name = "background";
      eightElementItem["name-zh"] = "背景";
      eightElementItem["file-type"] = "cell-element";
      eightElementItem.layout = createBackgroundElementLayout(element);
      break;
      
    case 'button':
      // 处理按钮类型元素
      eightElementItem.name = "button";
      eightElementItem["name-zh"] = "按钮";
      eightElementItem["file-type"] = "cell-element";
      eightElementItem.layout = createButtonElementLayout(element);
      break;
      
    default:
      // 对于其他未明确支持的类型，按容器处理
      if (element.children && Array.isArray(element.children)) {
        eightElementItem.layout.children = element.children.map(child => 
          transformElementToEightElementFormat(child)
        );
      }
  }
  
  return eightElementItem;
}

/**
 * 创建文本元素的八要素布局结构
 * @param {Object} element - 原始元素
 * @returns {Object} - 文本元素的八要素布局结构
 */
function createTextElementLayout(element) {
  // 从预设解析实际样式
  const resolvedStyle = element.presets ? mergeElementPresets(element) : (element.style || {});
  
  return {
    "style": {
      "background-color": [],
      "font": [],
      "border": [],
      "scale": [],
      "box-sizing": "border-box"
    },
    "text_body": {
      "type": "container",
      "content": [
        {
          "element": "font",
          "value": "fontsize",
          "prop": "default",
          "token": "fontsize"
        }
      ],
      "resource": element.content?.value || "默认文本",
      "data": [],
      "style": {
        "layoutAlign": "{layout.align.y.self.INHERIT}",
        "layoutGrow": "{layout.grow.0}",
        "overflow": "auto",
        "word-break": "break-all",
        "textColor": {
          "element": "color",
          "value": "text",
          "prop": "default",
          "token": "text"
        },
        "fill": {
          "element": "color",
          "value": "bg",
          "prop": "default",
          "token": "bg"
        },
        "fontSizes": {
          "element": "font",
          "value": "fontsize",
          "prop": "default",
          "token": "fontsize"
        }
      },
      "children": []
    }
  };
}

/**
 * 创建背景/图片元素的八要素布局结构
 * @param {Object} element - 原始元素
 * @returns {Object} - 背景元素的八要素布局结构
 */
function createBackgroundElementLayout(element) {
  // 从预设解析实际样式
  const resolvedStyle = element.presets ? mergeElementPresets(element) : (element.style || {});
  const imageUrl = element.content?.imageUrl || element.style?.backgroundImage || "";
  
  return {
    "style": {
      "background-color": [],
      "font": [],
      "border": [],
      "scale": [],
      "overflow": "hidden",
      "box-sizing": "border-box"
    },
    "background": {
      "type": "container",
      "content": [
        {
          "element": "material",
          "value": "image",
          "prop": "default",
          "token": "image"
        }
      ],
      "resource": "",
      "data": [],
      "style": {
        "display": "{layout.state.display.flex}",
        "layoutMode": "{layout.direction.NONE}",
        "layoutWrap": "{layout.wrap.NO_WRAP}",
        "primaryAxisSizingMode": "{layout.sizing.AUTO}",
        "counterAxisSizingMode": "{layout.sizing.FIXED}",
        "primaryAxisAlignItems": "{layout.align.x.MIN}",
        "counterAxisAlignItems": "{layout.align.y.items.MIN}",
        "layoutAlign": "{layout.align.y.self.INHERIT}",
        "layoutGrow": "{layout.grow.0}",
        "borderColor": {
          "element": "color",
          "value": "border",
          "prop": "default",
          "token": "border"
        },
        "borderRadius": {
          "element": "shape",
          "value": "borderradius",
          "prop": "default",
          "token": "borderradius"
        },
        "borderWidth": {
          "element": "shape",
          "value": "borderwidth",
          "prop": "default",
          "token": "borderwidth"
        },
        "boxShadow": {
          "element": "material",
          "value": "elevation",
          "prop": "default",
          "token": "elevation"
        },
        "asset": {
          "element": "material",
          "value": "image",
          "prop": "default",
          "token": "image"
        }
      },
      "children": []
    }
  };
}

/**
 * 创建按钮元素的八要素布局结构
 * @param {Object} element - 原始元素
 * @returns {Object} - 按钮元素的八要素布局结构
 */
function createButtonElementLayout(element) {
  // 从预设解析实际样式
  const resolvedStyle = element.presets ? mergeElementPresets(element) : (element.style || {});
  const buttonText = element.content?.value || "默认按钮";
  
  return {
    "style": {
      "background-color": [],
      "font": [],
      "border": [],
      "scale": [],
      "white-space": "nowrap",
      "overflow": "hidden",
      "text-overflow": "ellipsis",
      "box-sizing": "border-box"
    },
    "button_normal": {
      "type": "container",
      "content": [],
      "resource": "",
      "data": [],
      "style": {
        "display": "{layout.state.display.flex}",
        "layoutMode": "{layout.direction.HORIZONTAL}",
        "layoutWrap": "{layout.wrap.NO_WRAP}",
        "primaryAxisSizingMode": "{layout.sizing.AUTO}",
        "counterAxisSizingMode": "{layout.sizing.AUTO}",
        "primaryAxisAlignItems": "{layout.align.x.CENTER}",
        "counterAxisAlignItems": "{layout.align.y.items.CENTER}",
        "layoutAlign": "{layout.align.y.self.INHERIT}",
        "layoutGrow": "{layout.grow.0}",
        "minWidth": {
          "element": "scale",
          "value": "min_width",
          "prop": "default",
          "token": "min_width"
        },
        "minHeight": {
          "element": "scale",
          "value": "min_height",
          "prop": "default",
          "token": "min_height"
        },
        "spacing": {
          "element": "scale",
          "value": "padding",
          "prop": "default",
          "token": "padding"
        },
        "itemSpacing": {
          "element": "scale",
          "value": "gap",
          "prop": "default",
          "token": "gap"
        },
        "fill": {
          "element": "color",
          "value": "bg",
          "prop": "default",
          "token": "bg"
        },
        "fontColor": {
          "element": "color",
          "value": "text",
          "prop": "default",
          "token": "text"
        },
        "fontSizes": {
          "element": "font",
          "value": "fontsize",
          "prop": "default",
          "token": "fontsize"
        },
        "borderRadius": {
          "element": "shape",
          "value": "borderradius",
          "prop": "default",
          "token": "borderradius"
        },
        "borderColor": {
          "element": "color",
          "value": "border",
          "prop": "default",
          "token": "border"
        },
        "borderWidth": {
          "element": "shape",
          "value": "borderwidth",
          "prop": "default",
          "token": "borderwidth"
        },
        "boxShadow": {
          "element": "material",
          "value": "elevation",
          "prop": "default",
          "token": "elevation"
        }
      },
      "children": [
        {
          "content": [
            {
              "element": "font",
              "value": "fontsize",
              "prop": "default",
              "token": "fontsize"
            }
          ],
          "data": [],
          "style": {
            "layoutAlign": "{layout.align.y.self.INHERIT}",
            "layoutGrow": "{layout.grow.0}",
            "fill": {
              "element": "color",
              "value": "text",
              "prop": "default",
              "token": "text"
            },
            "fontSizes": {
              "element": "font",
              "value": "fontsize",
              "prop": "default",
              "token": "fontsize"
            }
          },
          "children": []
        }
      ]
    }
  };
}

/**
 * 确定元素类型
 * @param {Object} element - 元素对象
 * @returns {string} - 元素类型 (container, text, image, button 等)
 */
function determineElementType(element) {
  // 直接使用元素的type属性
  if (element.type) {
    return element.type;
  }
  
  // 基于元素ID前缀推断
  if (element.id) {
    if (element.id.includes('text')) return 'text';
    if (element.id.includes('image') || element.id.includes('img')) return 'image';
    if (element.id.includes('button') || element.id.includes('btn')) return 'button';
    if (element.id.includes('container')) return 'container';
  }
  
  // 基于元素结构推断
  if (element.content && element.content.value && typeof element.content.value === 'string') {
    return 'text';
  }
  
  if (element.style) {
    if (element.style.backgroundImage || element.style.background?.includes('url')) {
      return 'image';
    }
  }
  
  // 默认为容器类型
  return 'container';
}

/**
 * 将普通样式对象转换为八要素格式的样式对象
 * @param {Object} style - 原始样式对象
 * @returns {Object} - 八要素格式的样式对象
 */
function transformStyleToEightElementFormat(style) {
  // 从预设解析实际样式（如果存在）
  const resolvedStyle = style;
  
  // 八要素格式样式的默认结构
  return {
    "display": resolvedStyle.display || "{layout.state.display.flex}",
    "layoutMode": resolvedStyle.flexDirection === 'row' ? 
      "{layout.direction.HORIZONTAL}" : "{layout.direction.VERTICAL}",
    "layoutWrap": resolvedStyle.flexWrap === 'wrap' ? 
      "{layout.wrap.WRAP}" : "{layout.wrap.NO_WRAP}",
    "primaryAxisSizingMode": "fixed",
    "counterAxisSizingMode": "{layout.sizing.FIXED}",
    "primaryAxisAlignItems": mapJustifyContentToEightElements(resolvedStyle.justifyContent),
    "counterAxisAlignItems": mapAlignItemsToEightElements(resolvedStyle.alignItems),
    "layoutAlign": "{layout.align.y.self.INHERIT}",
    "layoutGrow": resolvedStyle.flexGrow ? `{layout.grow.${resolvedStyle.flexGrow}}` : "{layout.grow.0}",
    "boxSizing": "border-box",
    "border-style": resolvedStyle.borderStyle || "solid",
    "border-width": resolvedStyle.borderWidth || "0",
    "border-color": resolvedStyle.borderColor || "initial",
    "height": resolvedStyle.height || "100%",
    "width": resolvedStyle.width || "100%",
    "box-sizing": "border-box",
    "back-width": resolvedStyle.width || "100%",
    "back-height": resolvedStyle.height || "100%",
    "position": resolvedStyle.position || "relative"
  };
}

/**
 * 将justifyContent样式值映射到八要素格式
 * @param {string} value - CSS justifyContent值
 * @returns {string} - 八要素格式的对应值
 */
function mapJustifyContentToEightElements(value) {
  const map = {
    'flex-start': '{layout.align.x.START}',
    'flex-end': '{layout.align.x.END}',
    'center': '{layout.align.x.CENTER}',
    'space-between': '{layout.align.x.SPACE_BETWEEN}',
    'space-around': '{layout.align.x.SPACE_AROUND}'
  };
  
  return map[value] || '{layout.align.x.START}';
}

/**
 * 将alignItems样式值映射到八要素格式
 * @param {string} value - CSS alignItems值
 * @returns {string} - 八要素格式的对应值
 */
function mapAlignItemsToEightElements(value) {
  const map = {
    'flex-start': '{layout.align.y.items.MIN}',
    'flex-end': '{layout.align.y.items.MAX}',
    'center': '{layout.align.y.items.CENTER}',
    'stretch': '{layout.align.y.items.STRETCH}',
    'baseline': '{layout.align.y.items.BASELINE}'
  };
  
  return map[value] || '{layout.align.y.items.START}';
}

/**
 * 生成随机ID
 * @returns {string} - 随机ID字符串
 */
function generateRandomId() {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
} 