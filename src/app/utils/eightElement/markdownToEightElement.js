// markdownToEightElement.js
// 导入样式配置和常量
import {
  getElementStyleConfig,
  LAYOUT_CONSTANTS,
  COLOR_CONSTANTS,
  DIMENSION_CONSTANTS,
  FONT_CONSTANTS
} from './styleConfig.js';
import { generateChartFromTableData } from './chartGenerator.js';

// 改进UUID生成，确保更唯一
function generateUUID() {
  return 'dd-' + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// 更新基础布局元素创建函数，支持自定义高宽
function createBaseLayout(direction = LAYOUT_CONSTANTS.DIRECTION.VERTICAL, options = {}) {
  const { width = "100%", height = "100%", alignItems = LAYOUT_CONSTANTS.ALIGN.X.MIN } = options;

  return {
    style: {
      display: LAYOUT_CONSTANTS.DISPLAY.FLEX,
      layoutMode: direction,
      layoutWrap: LAYOUT_CONSTANTS.WRAP.NO_WRAP,
      primaryAxisSizingMode: "fixed",
      counterAxisSizingMode: LAYOUT_CONSTANTS.SIZING.FIXED,
      primaryAxisAlignItems: direction === LAYOUT_CONSTANTS.DIRECTION.VERTICAL ? alignItems : LAYOUT_CONSTANTS.ALIGN.X.CENTER,
      // 当方向为水平时，交叉轴（垂直方向）居中对齐；当方向为垂直时，交叉轴（水平方向）左对齐
      counterAxisAlignItems: direction === LAYOUT_CONSTANTS.DIRECTION.HORIZONTAL ? 
                            LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.CENTER : 
                            LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.MIN,
      layoutAlign: LAYOUT_CONSTANTS.ALIGN.Y.SELF.INHERIT,
      layoutGrow: LAYOUT_CONSTANTS.GROW.ZERO,
      boxSizing: "border-box",
      "border-style": "solid",
      "border-width": "0",
      "border-color": "initial",
      height: height,
      width: width,
      "box-sizing": "border-box",
      "back-width": width,
      "back-height": height,
      position: "relative"
    },
    children: []
  };
}

// 创建文本元素 - 修改以支持富文本
function createTextElement(text, variant = 'normal', richTextOptions = {}) {
  const id = generateUUID();
  // 获取文本元素的样式配置
  const textStyleConfig = getElementStyleConfig('text', variant);
  const layoutStyleConfig = getElementStyleConfig('layout', 'inner');
  
  // 判断是否有富文本选项
  const hasRichText = Object.keys(richTextOptions).length > 0;
  
  // 为标题元素设置默认宽度和对齐
  let textAlign = "left"; // 默认左对齐
  let width = "auto"; // 默认宽度
  let borderBottom = "none"; // 默认没有下边框
  
  // 如果是H1标题，设置特殊样式
  if (variant === 'h1') {
    textAlign = "center"; // H1居中对齐
    width = "100%"; // H1宽度100%
    borderBottom = "1px solid rgb(242, 242, 242)"; 
  }
  
  // 基础文本元素结构
  const textElement = {
    id,
    name: "text",
    "name-zh": "文本",
    "file-type": "cell-element",
    layout: {
      style: {
        "background-color": [],
        font: [],
        border: [],
        scale: [],
        "box-sizing": "border-box",
        primaryAxisSizingMode: "fixed",
        position: "relative",
        textAlign: textAlign, // 根据变体设置对齐方式
        width: width, // 设置宽度
        "border-bottom": borderBottom, // 设置下边框
        ...layoutStyleConfig
      },
      text_body: {
        type: "container",
        content: [
          {
            element: "font",
            value: "fontsize",
            prop: "default",
            token: "fontsize"
          }
        ],
        resource: "",
        data: [],
        style: {
          layoutAlign: LAYOUT_CONSTANTS.ALIGN.Y.SELF.INHERIT,
          layoutGrow: LAYOUT_CONSTANTS.GROW.ZERO,
          overflow: "auto",
          "word-break": "break-all",
          textAlign: textAlign, // 根据变体设置对齐方式
          width: width, // 设置宽度
          "border-bottom": borderBottom, // 设置下边框
          textColor: {
            element: "color",
            value: "text",
            prop: "default",
            token: "text"
          },
          fill: {
            element: "color",
            value: "bg",
            prop: "default",
            token: "bg"
          },
          fontSizes: {
            element: "font",
            value: "fontsize",
            prop: "default",
            token: "fontsize"
          }
        },
        children: []
      },
      text_hyperlink: {
        type: "container",
        content: [
          {
            element: "font",
            value: "fontsize",
            prop: "default",
            token: "fontsize"
          }
        ],
        resource: "",
        data: [],
        style: {
          layoutAlign: LAYOUT_CONSTANTS.ALIGN.Y.SELF.INHERIT,
          layoutGrow: LAYOUT_CONSTANTS.GROW.ZERO,
          "text-decoration": "underline",
          overflow: "auto",
          "word-break": "break-all",
          textAlign: textAlign, // 根据变体设置对齐方式
          width: width, // 设置宽度
          "border-bottom": borderBottom, // 设置下边框
          textColor: {
            element: "color",
            value: "text",
            prop: "default",
            token: "hyperlinktext"
          },
          fill: {
            element: "color",
            value: "bg",
            prop: "default",
            token: "bg"
          },
          fontSizes: {
            element: "font",
            value: "fontsize",
            prop: "default",
            token: "fontsize"
          }
        },
        children: []
      }
    },
    color: {
      text: {
        default: {
          "data-key": "",
          style: {
            text: {
              value: textStyleConfig.textColor || COLOR_CONSTANTS.BASIC.OPACITY.BLACK[100],
              type: "color",
              key: "color-text"
            },
            hyperlinktext: {
              value: variant === 'hyperlink' ?
                (textStyleConfig.textColor || COLOR_CONSTANTS.BASIC.LIGHT_BLUE[5]) :
                COLOR_CONSTANTS.BASIC.LIGHT_BLUE[5],
              type: "color",
              key: "color-text"
            }
          },
          resource: COLOR_CONSTANTS.BASIC.LIGHT_BLUE[5]
        }
      },
      bg: {
        default: {
          "data-key": "",
          style: {
            bg: {
              value: textStyleConfig.fill || "none",
              type: "color",
              key: "color-bg"
            }
          },
          resource: "none"
        }
      }
    },
    scale: {
      min_height: {
        default: {
          "data-key": "",
          style: {
            min_height: {
              value: DIMENSION_CONSTANTS.BASIC[72],
              type: "sizing",
              key: "scale-min_height"
            }
          },
          resource: DIMENSION_CONSTANTS.BASIC[72]
        }
      },
      max_width: {
        default: {
          "data-key": "",
          style: {
            max_width: {
              value: DIMENSION_CONSTANTS.BASIC[1200],
              type: "sizing",
              key: "scale-max_width"
            }
          },
          resource: DIMENSION_CONSTANTS.BASIC[1200]
        }
      }
    },
    font: {
      fontsize: {
        default: {
          "data-key": "",
          content: richTextOptions.processedText || text, // 使用处理后的富文本（如果有）
          style: {
            fontsize: {
              value: textStyleConfig.fontSizes || FONT_CONSTANTS.SIZE.LARGE,
              type: "fontSizes",
              key: "font-fontsize"
            }
          },
          resource: textStyleConfig.fontSizes || FONT_CONSTANTS.SIZE.LARGE
        }
      },
      fontweight: textStyleConfig.fontWeight || (richTextOptions.isBold ? {
        default: {
          "data-key": "",
          style: {
            fontweight: {
              value: FONT_CONSTANTS.WEIGHT.BOLD,
              type: "fontWeight",
              key: "font-fontweight"
            }
          },
          resource: FONT_CONSTANTS.WEIGHT.BOLD
        }
      } : undefined)
    },
    type: "text_body",
    state: "default",
    events: [{}]
  };
  
  // 添加列表样式（如果适用）
  if (hasRichText && richTextOptions.isList) {
    // 添加左边距和列表标识符
    textElement.layout.style.paddingLeft = DIMENSION_CONSTANTS.PADDING.medium;
    textElement.layout.style.position = "relative";
    textElement.layout.style.listStyleType = richTextOptions.listType === 'unordered' ? "disc" : "decimal";
    // 将带有列表标记的文本设置为列表项样式
    textElement.layout.style["list-style-position"] = "outside";
    textElement.layout.style.marginLeft = DIMENSION_CONSTANTS.MARGIN.medium;
  }
  
  return textElement;
}

// 新增函数：处理文本中的加粗部分
function processBoldText(text) {
  // 找出所有加粗文本 **text**
  const boldRegex = /\*\*(.*?)\*\*/g;
  const boldMatches = [...text.matchAll(boldRegex)];
  
  if (boldMatches.length === 0) {
    return { 
      processedText: text,
      hasBold: false 
    };
  }
  
  // 处理文本，将加粗部分用HTML标签替换
  let processedText = text;
  let hasBold = false;
  
  // 替换加粗文本为带有HTML标签的形式，这将在渲染时被解析
  processedText = text.replace(boldRegex, (match, p1) => {
    hasBold = true;
    return `<span style="font-weight: bold;">${p1}</span>`;  // 使用HTML标签表示加粗
  });
  
  return {
    processedText,
    hasBold
  };
}

// 检测是否为列表项
function isListItem(line) {
  // 检测无序列表项 (-, *, +)
  const unorderedMatch = line.trim().match(/^[-*+]\s+(.+)$/);
  if (unorderedMatch) {
    return { 
      isList: true, 
      listType: 'unordered', 
      content: unorderedMatch[1] 
    };
  }
  
  // 检测有序列表项 (1., 2., etc.)
  const orderedMatch = line.trim().match(/^(\d+)\.\s+(.+)$/);
  if (orderedMatch) {
    return { 
      isList: true, 
      listType: 'ordered', 
      content: orderedMatch[2],
      number: parseInt(orderedMatch[1]) 
    };
  }
  
  return { isList: false };
}

// 处理列表项和富文本 - 简化版本，避免拆分文本
function processListItemAndRichText(line) {
  // 首先检查是否为列表项
  const listItemInfo = isListItem(line);
  
  // 如果是列表项，处理其内容中的富文本
  if (listItemInfo.isList) {
    const { content, listType } = listItemInfo;
    
    // 处理加粗文本
    const { processedText, hasBold } = processBoldText(content);
    
    // 创建一个包含处理后文本的文本元素
    const textElement = createTextElement(content, 'normal', { 
      isList: true, 
      listType: listType,
      isBold: hasBold,
      processedText: processedText // 传递处理后的文本
    });
    
    return { element: textElement, processed: true, type: 'text' };
  }
  
  // 如果不是列表项，检查是否包含加粗文本
  const { processedText, hasBold } = processBoldText(line);
  
  // 如果有加粗文本，创建包含处理后文本的文本元素
  if (hasBold) {
    const textElement = createTextElement(line, 'normal', { 
      isBold: true,
      processedText: processedText // 传递处理后的文本
    });
    
    return { element: textElement, processed: true, type: 'text' };
  }
  
  // 如果没有特殊格式，返回未处理
  return { processed: false };
}

// 创建按钮元素（用于超链接）
function createButtonElement(text, url, variant = 'primary') {
  const id = generateUUID();
  // 获取按钮元素的样式配置
  const buttonStyleConfig = getElementStyleConfig('button', variant);
  const layoutStyleConfig = getElementStyleConfig('layout', 'inner');

  console.log("创建按钮元素：", { id, text, url });

  const buttonElement = {
    id,
    name: "button", // 确保按钮名称为"button"
    "name-zh": "按钮",
    "file-type": "cell-element",
    layout: {
      style: {
        "background-color": [],
        font: [],
        border: [],
        scale: [],
        "white-space": "nowrap",
        overflow: "hidden",
        "text-overflow": "ellipsis",
        "box-sizing": "border-box",
        primaryAxisSizingMode: "fixed",
        position: "relative",
        ...layoutStyleConfig
      },
      button_normal: {
        type: "container",
        content: [],
        resource: "",
        data: [],
        style: {
          display: LAYOUT_CONSTANTS.DISPLAY.FLEX,
          layoutMode: LAYOUT_CONSTANTS.DIRECTION.HORIZONTAL,
          layoutWrap: LAYOUT_CONSTANTS.WRAP.NO_WRAP,
          primaryAxisSizingMode: LAYOUT_CONSTANTS.SIZING.AUTO,
          counterAxisSizingMode: LAYOUT_CONSTANTS.SIZING.AUTO,
          primaryAxisAlignItems: LAYOUT_CONSTANTS.ALIGN.X.CENTER,
          counterAxisAlignItems: LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.CENTER,
          layoutAlign: LAYOUT_CONSTANTS.ALIGN.Y.SELF.INHERIT,
          layoutGrow: LAYOUT_CONSTANTS.GROW.ZERO,
          minWidth: {
            element: "scale",
            value: "min_width",
            prop: "default",
            token: "min_width"
          },
          minHeight: {
            element: "scale",
            value: "min_height",
            prop: "default",
            token: "min_height"
          },
          spacing: {
            element: "scale",
            value: "padding",
            prop: "default",
            token: "padding"
          },
          itemSpacing: {
            element: "scale",
            value: "gap",
            prop: "default",
            token: "gap"
          },
          fill: {
            element: "color",
            value: "bg",
            prop: "default",
            token: "bg"
          },
          fontColor: {
            element: "color",
            value: "text",
            prop: "default",
            token: "text"
          },
          fontSizes: {
            element: "font",
            value: "fontsize",
            prop: "default",
            token: "fontsize"
          },
          borderRadius: {
            element: "shape",
            value: "borderradius",
            prop: "default",
            token: "borderradius"
          },
          borderColor: {
            element: "color",
            value: "border",
            prop: "default",
            token: "border"
          },
          borderWidth: {
            element: "shape",
            value: "borderwidth",
            prop: "default",
            token: "borderwidth"
          },
          boxShadow: {
            element: "material",
            value: "elevation",
            prop: "default",
            token: "elevation"
          }
        },
        children: [
          {
            type: "text",
            content: [
              {
                element: "font",
                value: "fontsize",
                prop: "default",
                token: "fontsize"
              }
            ],
            data: [],
            style: {
              layoutAlign: LAYOUT_CONSTANTS.ALIGN.Y.SELF.INHERIT,
              layoutGrow: LAYOUT_CONSTANTS.GROW.ZERO,
              fill: {
                element: "color",
                value: "text",
                prop: "default",
                token: "text"
              },
              fontSizes: {
                element: "font",
                value: "fontsize",
                prop: "default",
                token: "fontsize"
              }
            },
            children: []
          }
        ]
      },
      button_icontextbutton: {
        type: "container",
        content: [],
        resource: "",
        data: [],
        style: {
          display: LAYOUT_CONSTANTS.DISPLAY.FLEX,
          layoutMode: LAYOUT_CONSTANTS.DIRECTION.HORIZONTAL,
          layoutWrap: LAYOUT_CONSTANTS.WRAP.NO_WRAP,
          primaryAxisSizingMode: LAYOUT_CONSTANTS.SIZING.AUTO,
          counterAxisSizingMode: LAYOUT_CONSTANTS.SIZING.AUTO,
          primaryAxisAlignItems: LAYOUT_CONSTANTS.ALIGN.X.CENTER,
          counterAxisAlignItems: LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.CENTER,
          layoutAlign: LAYOUT_CONSTANTS.ALIGN.Y.SELF.INHERIT,
          layoutGrow: LAYOUT_CONSTANTS.GROW.ZERO,
          minWidth: {
            element: "scale",
            value: "min_width",
            prop: "default",
            token: "min_width"
          },
          minHeight: {
            element: "scale",
            value: "min_height",
            prop: "default",
            token: "min_height"
          },
          spacing: {
            element: "scale",
            value: "padding",
            prop: "default",
            token: "padding"
          },
          itemSpacing: {
            element: "scale",
            value: "gap",
            prop: "default",
            token: "gap"
          },
          iconColor: {
            element: "color",
            value: "icon_color",
            prop: "default",
            token: "icon_color"
          },
          icon: {
            element: "color",
            value: "icon_color",
            prop: "default"
          },
          fontSizes: {
            element: "font",
            value: "fontsize",
            prop: "default",
            token: "fontsize"
          },
          textColor: {
            element: "color",
            value: "text",
            prop: "default",
            token: "text"
          },
          fill: {
            element: "color",
            value: "bg",
            prop: "default",
            token: "bg"
          },
          borderRadius: {
            element: "shape",
            value: "borderradius",
            prop: "default",
            token: "borderradius"
          },
          borderColor: {
            element: "color",
            value: "border",
            prop: "default",
            token: "border"
          },
          borderWidth: {
            element: "shape",
            value: "borderwidth",
            prop: "default",
            token: "borderwidth"
          },
          boxShadow: {
            element: "material",
            value: "elevation",
            prop: "default",
            token: "elevation"
          }
        },
        children: [
          {
            content: [
              {
                element: "color",
                value: "icon_color"
              }
            ],
            data: [],
            style: {
              layoutAlign: LAYOUT_CONSTANTS.ALIGN.Y.SELF.INHERIT,
              layoutGrow: LAYOUT_CONSTANTS.GROW.ZERO,
              fill: {
                element: "color",
                value: "icon_color",
                prop: "default",
                token: "icon_color"
              }
            },
            children: []
          },
          {
            type: "text",
            content: [
              {
                element: "font",
                value: "fontsize",
                prop: "default",
                token: "fontsize"
              }
            ],
            resource: "",
            data: [],
            style: {
              layoutAlign: LAYOUT_CONSTANTS.ALIGN.Y.SELF.INHERIT,
              layoutGrow: LAYOUT_CONSTANTS.GROW.ZERO,
              fill: {
                element: "color",
                value: "text",
                prop: "default",
                token: "text"
              },
              fontSizes: {
                element: "font",
                value: "fontsize",
                prop: "default",
                token: "fontsize"
              }
            },
            children: []
          }
        ]
      },
      button_iconbutton: {
        type: "container",
        content: [],
        resource: "",
        data: [],
        style: {
          display: LAYOUT_CONSTANTS.DISPLAY.FLEX,
          layoutMode: LAYOUT_CONSTANTS.DIRECTION.HORIZONTAL,
          layoutWrap: LAYOUT_CONSTANTS.WRAP.NO_WRAP,
          primaryAxisSizingMode: LAYOUT_CONSTANTS.SIZING.AUTO,
          counterAxisSizingMode: LAYOUT_CONSTANTS.SIZING.AUTO,
          primaryAxisAlignItems: LAYOUT_CONSTANTS.ALIGN.X.CENTER,
          counterAxisAlignItems: LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.CENTER,
          layoutAlign: LAYOUT_CONSTANTS.ALIGN.Y.SELF.INHERIT,
          layoutGrow: LAYOUT_CONSTANTS.GROW.ZERO,
          minWidth: {
            element: "scale",
            value: "min_width",
            prop: "default",
            token: "min_width"
          },
          minHeight: {
            element: "scale",
            value: "min_height",
            prop: "default",
            token: "min_height"
          },
          spacing: {
            element: "scale",
            value: "padding",
            prop: "default",
            token: "padding"
          },
          itemSpacing: {
            element: "scale",
            value: "gap",
            prop: "default",
            token: "gap"
          },
          iconColor: {
            element: "color",
            value: "icon_color",
            prop: "default",
            token: "icon_color"
          },
          icon: {
            element: "color",
            value: "icon_color"
          },
          fill: {
            element: "color",
            value: "bg",
            prop: "default",
            token: "bg"
          },
          borderColor: {
            element: "color",
            value: "border",
            prop: "default",
            token: "border"
          },
          borderWidth: {
            element: "shape",
            value: "borderwidth",
            prop: "default",
            token: "borderwidth"
          },
          borderRadius: {
            element: "shape",
            value: "borderradius",
            prop: "default",
            token: "borderradius"
          },
          boxShadow: {
            element: "material",
            value: "elevation",
            prop: "default",
            token: "elevation"
          }
        },
        children: [
          {
            content: [
              {
                element: "color",
                value: "icon_color"
              }
            ],
            data: [],
            style: {
              layoutAlign: LAYOUT_CONSTANTS.ALIGN.Y.SELF.INHERIT,
              layoutGrow: LAYOUT_CONSTANTS.GROW.ZERO,
              fill: {
                element: "color",
                value: "icon_color",
                prop: "default",
                token: "icon_color"
              }
            },
            children: []
          }
        ]
      }
    },
    color: {
      bg: {
        default: {
          "data-key": "",
          style: {
            bg: {
              value: buttonStyleConfig.fill || COLOR_CONSTANTS.PRIMARY.BRAND5,
              type: "color",
              key: "color-bg"
            }
          },
          resource: buttonStyleConfig.fill || COLOR_CONSTANTS.PRIMARY.BRAND5
        }
      },
      text: {
        default: {
          "data-key": "",
          style: {
            text: {
              value: buttonStyleConfig.fontColor || COLOR_CONSTANTS.BASIC.OPACITY.WHITE[100],
              type: "color",
              key: "color-text"
            }
          },
          resource: buttonStyleConfig.fontColor || COLOR_CONSTANTS.BASIC.OPACITY.WHITE[100]
        }
      },
      border: {
        default: {
          "data-key": "",
          style: {
            border: {
              value: buttonStyleConfig.borderColor || COLOR_CONSTANTS.BASIC.OPACITY.WHITE[32],
              type: "color",
              key: "color-border"
            }
          },
          resource: buttonStyleConfig.borderColor || COLOR_CONSTANTS.BASIC.OPACITY.WHITE[32]
        }
      },
      icon_color: {
        default: {
          "data-key": "",
          style: {
            icon_color: {
              value: COLOR_CONSTANTS.BASIC.OPACITY.WHITE[100],
              type: "color",
              key: "color-icon_color"
            }
          },
          type: "icon",
          resource: "send"
        }
      }
    },
    shape: {
      borderradius: {
        default: {
          "data-key": "",
          style: {
            borderradius: {
              value: buttonStyleConfig.borderRadius || DIMENSION_CONSTANTS.BORDER_RADIUS[8],
              type: "borderRadius",
              key: "shape-borderradius"
            }
          },
          resource: buttonStyleConfig.borderRadius || DIMENSION_CONSTANTS.BORDER_RADIUS[8]
        }
      },
      borderwidth: {
        default: {
          "data-key": "",
          style: {
            borderwidth: {
              value: buttonStyleConfig.borderWidth || DIMENSION_CONSTANTS.BORDER_WIDTH.none,
              type: "borderWidth",
              key: "shape-borderwidth"
            }
          },
          resource: buttonStyleConfig.borderWidth || DIMENSION_CONSTANTS.BORDER_WIDTH.none
        }
      }
    },
    scale: {
      padding: {
        default: {
          "data-key": "",
          style: {
            padding: {
              value: buttonStyleConfig.spacing || DIMENSION_CONSTANTS.PADDING.base,
              type: "spacing",
              key: "scale-padding"
            }
          },
          resource: buttonStyleConfig.spacing || DIMENSION_CONSTANTS.PADDING.base
        }
      },
      gap: {
        default: {
          "data-key": "",
          style: {
            gap: {
              value: buttonStyleConfig.itemSpacing || DIMENSION_CONSTANTS.GAP.base,
              type: "spacing",
              key: "scale-gap"
            }
          },
          resource: buttonStyleConfig.itemSpacing || DIMENSION_CONSTANTS.GAP.base
        }
      },
      min_width: {
        default: {
          "data-key": "",
          style: {
            min_width: {
              value: buttonStyleConfig.minWidth || DIMENSION_CONSTANTS.BASIC[0],
              type: "sizing",
              key: "scale-min_width"
            }
          },
          resource: buttonStyleConfig.minWidth || DIMENSION_CONSTANTS.BASIC[0]
        }
      },
      min_height: {
        default: {
          "data-key": "",
          style: {
            min_height: {
              value: buttonStyleConfig.minHeight || DIMENSION_CONSTANTS.BASIC[0],
              type: "sizing",
              key: "scale-min_height"
            }
          },
          resource: buttonStyleConfig.minHeight || DIMENSION_CONSTANTS.BASIC[0]
        }
      }
    },
    font: {
      fontsize: {
        default: {
          "data-key": "",
          content: text, // 按钮文本
          style: {
            fontsize: {
              value: buttonStyleConfig.fontSizes || FONT_CONSTANTS.SIZE.XL,
              type: "fontSizes",
              key: "font-fontsize"
            }
          },
          resource: buttonStyleConfig.fontSizes || FONT_CONSTANTS.SIZE.XL
        }
      }
    },
    material: {
      elevation: {
        default: {
          "data-key": "",
          style: {
            elevation: {
              value: buttonStyleConfig.boxShadow || "none",
              type: "boxShadow",
              key: "material-elevation"
            }
          },
          resource: buttonStyleConfig.boxShadow || "none"
        }
      }
    },
    type: "button_normal", // 确保类型正确
    state: "default",
    events: [{}],
    url: url  // 存储链接URL
  };

  return buttonElement;
}

// 创建背景元素（用于图片）
function createBackgroundElement(imageUrl, variant = 'normal') {
  const id = generateUUID();
  // 获取图片元素的样式配置
  const imageStyleConfig = getElementStyleConfig('image', variant);
  const layoutStyleConfig = getElementStyleConfig('layout', 'inner');

  return {
    id,
    name: "background",
    "name-zh": "背景",
    "file-type": "cell-element",
    layout: {
      style: {
        "background-color": [],
        font: [],
        border: [],
        scale: [],
        overflow: "hidden",
        "box-sizing": "border-box",
        primaryAxisSizingMode: "fixed",
        position: "relative",
        ...layoutStyleConfig
      },
      background: {
        type: "container",
        content: [
          {
            element: "material",
            value: "image",
            prop: "default",
            token: "image"
          }
        ],
        resource: "",
        data: [],
        style: {
          display: LAYOUT_CONSTANTS.DISPLAY.FLEX,
          layoutMode: LAYOUT_CONSTANTS.DIRECTION.HORIZONTAL,
          layoutWrap: LAYOUT_CONSTANTS.WRAP.NO_WRAP,
          primaryAxisSizingMode: LAYOUT_CONSTANTS.SIZING.AUTO,
          counterAxisSizingMode: LAYOUT_CONSTANTS.SIZING.FIXED,
          primaryAxisAlignItems: LAYOUT_CONSTANTS.ALIGN.X.MIN,
          counterAxisAlignItems: LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.MIN,
          layoutAlign: LAYOUT_CONSTANTS.ALIGN.Y.SELF.INHERIT,
          layoutGrow: LAYOUT_CONSTANTS.GROW.ZERO,
          borderColor: {
            element: "color",
            value: "border",
            prop: "default",
            token: "border"
          },
          borderRadius: {
            element: "shape",
            value: "borderradius",
            prop: "default",
            token: "borderradius"
          },
          borderWidth: {
            element: "shape",
            value: "borderwidth",
            prop: "default",
            token: "borderwidth"
          },
          boxShadow: {
            element: "material",
            value: "elevation",
            prop: "default",
            token: "elevation"
          },
          asset: {
            element: "material",
            value: "image",
            prop: "default",
            token: "image"
          }
        },
        children: []
      }
    },
    material: {
      image: {
        default: {
          "data-key": "",
          type: "img",
          style: {
            image: {
              value: imageUrl,
              type: "asset",
              key: "material-image"
            }
          },
          resource: imageUrl
        }
      },
      elevation: {
        default: {
          "data-key": "",
          style: {
            elevation: {
              value: imageStyleConfig.boxShadow || "none",
              type: "boxShadow",
              key: "material-elevation"
            }
          },
          resource: imageStyleConfig.boxShadow || "none"
        }
      }
    },
    shape: {
      borderradius: {
        default: {
          "data-key": "",
          style: {
            borderradius: {
              value: imageStyleConfig.borderRadius || DIMENSION_CONSTANTS.BORDER_RADIUS.none,
              type: "borderRadius",
              key: "shape-borderradius"
            }
          },
          resource: imageStyleConfig.borderRadius || DIMENSION_CONSTANTS.BORDER_RADIUS.none
        }
      },
      borderwidth: {
        default: {
          "data-key": "",
          style: {
            borderwidth: {
              value: imageStyleConfig.borderWidth || DIMENSION_CONSTANTS.BORDER_WIDTH.none,
              type: "borderWidth",
              key: "shape-borderwidth"
            }
          },
          resource: imageStyleConfig.borderWidth || DIMENSION_CONSTANTS.BORDER_WIDTH.none
        }
      }
    },
    color: {
      border: {
        default: {
          "data-key": "",
          style: {
            border: {
              value: imageStyleConfig.borderColor || COLOR_CONSTANTS.BASIC.OPACITY.BLACK[20],
              type: "color",
              key: "color-border"
            }
          },
          resource: imageStyleConfig.borderColor || COLOR_CONSTANTS.BASIC.OPACITY.BLACK[20]
        }
      }
    },
    type: "background",
    state: "default",
    events: [{}]
  };
}

// 创建布局元素，支持自定义选项
function createLayoutElement(direction, children = [], options = {}) {
  const layoutId = generateUUID();
  const { width, height, gap, variant = 'inner', isRoot = false, 
          alignItems = LAYOUT_CONSTANTS.ALIGN.X.MIN } = options;
          
  // 根据方向自动计算交叉轴对齐方式
  // 对于水平布局，默认交叉轴居中对齐；对于垂直布局，使用传入的选项或默认左对齐
  const counterAxisAlign = options.counterAxisAlign || 
                          (direction === LAYOUT_CONSTANTS.DIRECTION.HORIZONTAL ? 
                           LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.CENTER : 
                           LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.MIN);

  // 获取布局元素的样式配置
  const layoutStyleConfig = getElementStyleConfig('layout', isRoot ? 'root' : variant);

  // 创建基础布局
  const baseLayout = createBaseLayout(direction, { width, height, alignItems });

  // 应用来自配置的样式
  Object.entries(layoutStyleConfig).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      baseLayout.style[key] = value;
    }
  });

  // 如果提供了间距，覆盖配置
  if (gap) {
    baseLayout.style.gap = gap;
  }
  
  // 设置主轴对齐方式
  baseLayout.style.primaryAxisAlignItems = alignItems;
  
  // 设置交叉轴对齐方式
  baseLayout.style.counterAxisAlignItems = counterAxisAlign;

  const layout = {
    dataKeys: [],
    name: "layout",
    "name-zh": "布局",
    "file-type": "template",
    theme: "default",
    layout: baseLayout,
    description: "",
    id: layoutId,
    events: [{}]
  };

  // 添加子元素
  layout.layout.children = children;

  return layout;
}

// 更新水平按钮布局创建函数
function createHorizontalButtonLayout(buttons) {
  return createLayoutElement(LAYOUT_CONSTANTS.DIRECTION.HORIZONTAL, buttons, {
    gap: DIMENSION_CONSTANTS.GAP.base,
    alignItems: LAYOUT_CONSTANTS.ALIGN.X.CENTER,
    // 无需明确设置counterAxisAlign，createLayoutElement会自动为水平布局设置交叉轴居中
  });
}

// 更新标题布局创建函数
function createHeadingLayout(headingContent, subElements = [], headingLevel = 1) {
  // 所有标题布局都使用左对齐
  // 注意：标题文本的对齐方式由createTextElement函数根据变体（h1、h2等）自动处理
  const layout = createLayoutElement(
    LAYOUT_CONSTANTS.DIRECTION.VERTICAL, 
    [], 
    { 
      alignItems: LAYOUT_CONSTANTS.ALIGN.X.MIN, // 所有标题布局主轴左对齐
      counterAxisAlign: LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.MIN // 所有标题布局交叉轴左对齐
    }
  );

  // 添加标题文本，根据标题级别选择文本样式
  const headingVariant = `h${headingLevel}`;
  const headingText = createTextElement(headingContent, headingVariant);
  
  // 不需要额外设置textAlign和width，createTextElement已经处理了

  layout.layout.children.push(headingText);

  // 添加子元素
  if (subElements.length > 0) {
    layout.layout.children = layout.layout.children.concat(subElements);
  }

  return layout;
}

// 创建流式布局容器，用于包装一级标题块
function createFlexWrapLayout(children = []) {
  const layoutId = generateUUID();

  // 创建一个水平流式布局，使用CSS的flex-wrap属性
  const layout = {
    dataKeys: [],
    name: "layout",
    "name-zh": "流式布局",
    "file-type": "template",
    theme: "default",
    layout: {
      style: {
        display: LAYOUT_CONSTANTS.DISPLAY.FLEX,
        layoutMode: LAYOUT_CONSTANTS.DIRECTION.HORIZONTAL,
        // 使用CSS的flex-wrap属性
        "flex-wrap": "wrap",
        primaryAxisSizingMode: "fixed",
        counterAxisSizingMode: LAYOUT_CONSTANTS.SIZING.FIXED,
        primaryAxisAlignItems: LAYOUT_CONSTANTS.ALIGN.X.CENTER,
        counterAxisAlignItems: LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.CENTER, // 水平布局交叉轴居中
        layoutAlign: LAYOUT_CONSTANTS.ALIGN.Y.SELF.INHERIT,
        layoutGrow: LAYOUT_CONSTANTS.GROW.ZERO,
        boxSizing: "border-box",
        "border-style": "solid",
        "border-width": "0",
        "border-color": "initial",
        height: "auto",
        width: "100%",
        "box-sizing": "border-box",
        "back-width": "100%",
        "back-height": "auto",
        position: "relative"
      },
      children: children
    },
    description: "",
    id: layoutId,
    events: [{}]
  };

  return layout;
}

// 创建一级标题块容器，设置最小宽度和最大宽度
function createHeadingBlockContainer(headingLayout) {
  const layoutId = generateUUID();

  // 创建一个包装容器，设置最小宽度和flex-basis
  const layout = {
    dataKeys: [],
    name: "layout",
    "name-zh": "标题块容器",
    "file-type": "template",
    theme: "default",
    layout: {
      style: {
        display: LAYOUT_CONSTANTS.DISPLAY.FLEX,
        layoutMode: LAYOUT_CONSTANTS.DIRECTION.VERTICAL,
        primaryAxisSizingMode: "fixed",
        counterAxisSizingMode: LAYOUT_CONSTANTS.SIZING.FIXED,
        primaryAxisAlignItems: LAYOUT_CONSTANTS.ALIGN.X.CENTER,
        counterAxisAlignItems: LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.CENTER,
        layoutAlign: LAYOUT_CONSTANTS.ALIGN.Y.SELF.INHERIT,
        layoutGrow: LAYOUT_CONSTANTS.GROW.ZERO,
        boxSizing: "border-box",
        "border-style": "solid",
        "border-width": "0",
        "border-color": "initial",
        height: "auto",
        width: "100%",
        minWidth: "375px",  // 设置最小宽度为375px
        maxWidth: "50%",    // 设置最大宽度为50%，确保一行最多两个
        // 添加flex-basis属性，使其在流式布局中正确工作
        "flex-basis": "375px",
        "flex-grow": "1",
        "flex-shrink": "0",
        "box-sizing": "border-box",
        "back-width": "100%",
        "back-height": "auto",
        position: "relative",
        padding: DIMENSION_CONSTANTS.PADDING.base,
        margin: DIMENSION_CONSTANTS.MARGIN.tight
      },
      children: [headingLayout]
    },
    description: "",
    id: layoutId,
    events: [{}]
  };

  return layout;
}

// 检测是否为表格或图表数据（统一检测）
function isTableOrChartData(line) {
  // 首先检查是否是图表数据标记
  const isChart = line.trim().match(/^\[chart:(.+?)\]/);
  
  if (isChart) {
    return { isData: true, isChart: true, chartType: isChart[1] };
  }
  
  // 然后检查是否是普通表格
  if (line.includes('|')) {
    const nextLine = line.trim();
    // 表格至少需要一个分隔符
    const hasSeparator = nextLine.includes('|');
    
    if (hasSeparator) {
      return { isData: true, isChart: false, chartType: null };
    }
  }
  
  return { isData: false, isChart: false, chartType: null };
}

// 提取完整的表格或图表数据（统一提取）
function extractTableOrChartData(lines, startIndex) {
  console.log(`开始提取表格/图表数据，从第${startIndex}行开始`);
  
  // 获取第一行，检查是否包含图表标记
  const firstLine = lines[startIndex].trim();
  const chartMatch = firstLine.match(/^\[chart:(.+?)\]/);
  const isChart = !!chartMatch;
  const chartType = isChart ? chartMatch[1] : null;
  
  if (isChart) {
    console.log(`检测到图表类型: ${chartType}`);
  } else {
    console.log('检测到普通表格');
  }
  
  // 处理第一行 - 如果是图表，移除图表标记
  const processedFirstLine = isChart 
    ? firstLine.replace(/^\[chart:.+?\]/, '').trim() 
    : firstLine;
  
  const tableLines = [processedFirstLine];
  const remainingLines = lines.slice(startIndex + 1);
  
  // 继续添加后续表格行，直到遇到空行
  let i = 0;
  while (i < remainingLines.length) {
    const line = remainingLines[i].trim();
    
    // 如果行为空或不再包含表格分隔符，认为表格结束
    if (line === '' || !line.includes('|')) {
      console.log(`表格/图表数据在第${startIndex + i + 1}行结束`);
      break;
    }
    
    tableLines.push(remainingLines[i]);
    i++;
  }
  
  console.log('提取的表格/图表行数:', tableLines.length);
  
  // 提取原始表格内容（用于显示和调试）
  const originalContent = tableLines.join('\n');
  
  // 解析表格数据为二维数组（用于图表数据处理）
  const tableData = parseTableData(originalContent);
  
  return {
    isChart: isChart,
    chartType: chartType,
    tableContent: originalContent,
    tableData: tableData,
    endIndex: startIndex + i
  };
}

// 处理表格数据 - 决定创建普通表格还是图表元素
function processTableOrChartData(result, stack) {
  const { isChart, chartType, tableContent, tableData, endIndex } = result;
  
  if (isChart) {
    // 处理为图表
    try {
      console.log(`处理图表数据，类型: ${chartType}`);
      // 生成SVG图表
      const svgContent = generateChartSvg(chartType, tableData);
      
      // 创建图表元素
      const chartElement = createChartElement(chartType, svgContent, tableData, tableContent);
      stack[stack.length - 1].elements.push(chartElement);
    } catch (error) {
      console.error('生成图表时出错:', error);
      // 创建一个带有错误信息的图表元素
      const errorSvg = `<svg width="800" height="250" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#fff0f0" />
        <text x="50" y="50" font-family="sans-serif" font-size="18" fill="#d32f2f">
          图表生成错误
        </text>
        <text x="50" y="80" font-family="sans-serif" font-size="14" fill="#666">
          ${error.message || '未知错误'}
        </text>
      </svg>`;
      const chartElement = createChartElement(chartType, errorSvg, tableData, tableContent);
      stack[stack.length - 1].elements.push(chartElement);
    }
  } else {
    // 处理为普通表格
    console.log('处理普通表格数据');
    const tableElement = createTableElement(tableContent);
    stack[stack.length - 1].elements.push(tableElement);
  }
  
  return endIndex;
}

// 创建表格元素
function createTableElement(markdownTableContent) {
  console.log('开始创建表格元素，原始表格内容长度:', markdownTableContent.length);
  const id = generateUUID();
  const layoutStyleConfig = getElementStyleConfig('layout', 'inner');

  // 确保表格内容不为空
  if (!markdownTableContent.trim()) {
    console.error('警告: 尝试创建表格元素但内容为空');
  }

  // 创建符合要求的表格元素结构
  const tableElement = {
    id,
    name: "table",
    "name-zh": "表格",
    "file-type": "cell-element",
    type: "table",
    rawData: markdownTableContent,
    layout: {
      style: {
        // 基础样式
        "background-color": [],
        font: [],
        border: [],
        scale: [],
        "box-sizing": "border-box",
        primaryAxisSizingMode: "fixed",
        position: "relative",
        width: "100%",
        ...layoutStyleConfig,

        // 表格特定样式
        table: {
          borderCollapse: "collapse",
          backgroundColor: "transparent",
          width: "100%",
          color: "#212529",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          fontSize: FONT_CONSTANTS.SIZE.MEDIUM,
          marginBottom: '1rem'
        },
        th: {
          padding: "0.75rem",
          verticalAlign: "middle",
          borderTop: "1px solid #dee2e6"
        },
        tr: {
          borderBottomWidth: DIMENSION_CONSTANTS.BORDER_WIDTH.narrow,
          borderBottomColor: COLOR_CONSTANTS.BASIC.OPACITY.BLACK[20],
          borderBottomStyle: "solid"
        },
        td: {
          padding: "0.75rem",
          verticalAlign: "middle",
          borderTop: "1px solid #dee2e6"
        }
      }
    },
    events: [{}]
  };

  console.log('表格元素创建完成:', JSON.stringify({
    id: tableElement.id,
    name: tableElement.name,
    type: tableElement.type,
    rawData: (tableElement.rawData && tableElement.rawData.length > 0) ? '有内容' : '无内容',
    hasTableStyles: !!(tableElement.layout?.style?.table)
  }, null, 2));

  return tableElement;
}

// 创建代码元素
function createCodeElement(codeContent, language = '') {
  const id = generateUUID();
  const layoutStyleConfig = getElementStyleConfig('layout', 'inner');

  console.log('创建代码元素，语言:', language);

  // 创建符合要求的代码元素结构
  const codeElement = {
    id,
    name: "code",
    "name-zh": "代码",
    "file-type": "cell-element",
    type: "code",
    rawData: codeContent,
    language: language || 'plaintext', // 保存代码语言
    layout: {
      style: {
        // 基础样式
        "background-color": [],
        font: [],
        border: [],
        scale: [],
        "box-sizing": "border-box",
        padding: DIMENSION_CONSTANTS.PADDING.base,
        fontSize: FONT_CONSTANTS.SIZE.SMALL,
        lineHeight: "1.5",
        whiteSpace: "pre",
        borderWidth: DIMENSION_CONSTANTS.BORDER_WIDTH.narrow,
        borderStyle: "solid",
        borderColor: COLOR_CONSTANTS.BASIC.OPACITY.BLACK[20],
        borderRadius: DIMENSION_CONSTANTS.BORDER_RADIUS.medium,
        width: "100%",
      }
    },
    events: [{}]
  };

  console.log('代码元素创建完成:', JSON.stringify({
    id: codeElement.id,
    name: codeElement.name,
    type: codeElement.type,
    language: codeElement.language,
    rawData: (codeElement.rawData && codeElement.rawData.length > 0) ? '有内容' : '无内容'
  }, null, 2));

  return codeElement;
}

// 检测Markdown代码块
function isMarkdownCodeBlock(line) {
  return line.trim().startsWith('```');
}

// 提取完整的Markdown代码块
function extractMarkdownCodeBlock(lines, startIndex) {
  console.log(`开始提取代码块，从第${startIndex}行开始`);

  const startLine = lines[startIndex].trim();
  let language = '';

  // 从第一行提取语言信息
  if (startLine.length > 3) {
    language = startLine.substring(3).trim();
    console.log(`检测到代码语言: ${language}`);
  }

  const codeLines = [];
  let i = startIndex + 1;
  let foundEnd = false;

  // 查找代码块结束标记
  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === '```') {
      foundEnd = true;
      i++;
      break;
    }

    codeLines.push(line);
    i++;
  }

  // 如果没有找到结束标记，可能是不完整的代码块
  if (!foundEnd) {
    console.log('警告: 未找到代码块结束标记');
  }

  const result = {
    codeContent: codeLines.join('\n'),
    language: language,
    endIndex: i - 1
  };

  console.log(`提取的代码内容 (${codeLines.length}行):`);
  console.log(`代码结束索引: ${result.endIndex}`);

  return result;
}

// 使用D3生成SVG图表
function generateChartSvg(chartType, data) {
  console.log('开始生成图表SVG，类型:', chartType);
  
  try {
    // 使用chartGenerator提供的功能生成SVG
    return generateChartFromTableData(data, chartType);
  } catch (error) {
    console.error('生成图表SVG时出错:', error);
    // 返回错误信息的SVG
    return `<svg width="800" height="200" xmlns="http://www.w3.org/2000/svg">
      <text x="50" y="50" font-family="sans-serif" font-size="16" fill="red">
        图表生成错误: ${error.message}
      </text>
    </svg>`;
  }
}

// 创建图表元素
function createChartElement(chartType, svgContent, tableData, rawData) {
  const id = generateUUID();
  const layoutStyleConfig = getElementStyleConfig('layout', 'inner');
  
  console.log('创建图表元素，类型:', chartType);
  
  // 创建符合要求的图表元素结构
  const chartElement = {
    id,
    name: "chart",
    "name-zh": "图表",
    "file-type": "cell-element",
    type: "chart",
    chartType: chartType,
    svgContent: svgContent,
    tableData: tableData, // 保存解析后的表格数据
    rawData: rawData,     // 保存原始Markdown表格内容
    layout: {
      style: {
        // 基础样式
        "background-color": [],
        font: [],
        border: [],
        scale: [],
        "box-sizing": "border-box",
        overflow: "hidden",
        "box-sizing": "border-box",
        primaryAxisSizingMode: "fixed",
        position: "relative",
        width: "100%",
        height: "auto",
        ...layoutStyleConfig
      }
    },
    events: [{}]
  };
  
  console.log('图表元素创建完成:', JSON.stringify({
    id: chartElement.id,
    name: chartElement.name,
    type: chartElement.type,
    chartType: chartElement.chartType,
    hasTableData: !!(tableData && tableData.length),
    dataRows: tableData ? tableData.length : 0
  }, null, 2));
  
  return chartElement;
}

// 解析表格数据为二维数组
function parseTableData(tableContent) {
  // 分割表格内容为行
  const lines = tableContent.trim().split('\n');
  const data = [];
  
  // 解析每一行
  for (let i = 0; i < lines.length; i++) {
    // 跳过分隔行 (包含 --- 的行)
    if (lines[i].match(/\|[-|\s]+\|/)) {
      continue;
    }
    
    // 移除行首尾的|，并分割单元格
    const cells = lines[i].trim()
      .replace(/^\||\|$/g, '')  // 移除首尾的|
      .split('|')                // 按|分割
      .map(cell => cell.trim()); // 移除单元格内容的空白
    
    data.push(cells);
  }
  
  return data;
}

// 检测markdown表格 - 为了保持兼容性而保留的函数
function isMarkdownTable(lines) {
  if (lines.length < 2) return false;
  
  // 使用新的检测逻辑
  const { isData, isChart } = isTableOrChartData(lines[0]);
  // 只有当是表格数据且不是图表时返回true
  return isData && !isChart;
}

// 改进Markdown解析功能，支持列表和富文本
function parseMarkdown(markdown) {
  // 首先规范化换行符处理
  // 把所有的\r\n转换为\n
  const normalizedMarkdown = markdown.replace(/\r\n/g, '\n');


  
  // 把所有连续的\n\n替换为单独的分隔符，以便后续统一处理
  const processedMarkdown = normalizedMarkdown.replace(/(\n\n)+/g, '\n').replace(/(\\n\\n)+/g, '\n').replace(/\\n/g, '\n');
  
  // 分割Markdown文本为行
  const lines = processedMarkdown.split('\n').filter(line => line.trim() !== '');

  // 解析结果将存储在这个数组中
  const elements = [];

  // 存储一级标题块，用于后续流式布局
  const h1Blocks = [];

  // 用于跟踪当前的嵌套级别
  const stack = [{ level: 0, elements: elements }];

  // 当前处理的一级标题块
  let currentH1Block = null;

  // 用于收集连续的按钮元素
  let consecutiveButtons = [];

  // 缓存当前处理的文本块
  let currentTextBlock = '';
  
  // 标记当前正在处理的列表状态
  let inList = false;
  let listItems = [];

  // 优先预处理：识别Markdown中的表格
  console.log('开始检查Markdown中的表格...');

  // 创建一个函数来查找完整表格的起始行
  function findTableStartLines(lines) {
    const tableStarts = [];

    for (let i = 0; i < lines.length - 1; i++) {
      // 使用新的检测逻辑检查是否为表格
      const { isData, isChart } = isTableOrChartData(lines[i]);
      if (isData) {
        tableStarts.push(i);
      }
    }

    return tableStarts;
  }

  // 查找所有表格的起始行
  const allLines = lines.map(line => line);
  const tableStarts = findTableStartLines(allLines);
  console.log(`找到 ${tableStarts.length} 个表格起始行: ${tableStarts.join(', ')}`);

  // 标记每一行是否为表格的一部分
  const markedLines = [];
  for (let i = 0; i < lines.length; i++) {
    markedLines.push({
      line: lines[i],
      isTable: false,
      tableContent: null,
      isTableStart: false
    });
  }

  // 处理每个表格
  for (const startIndex of tableStarts) {
    // 提取表格内容，使用新的提取函数
    const result = extractTableOrChartData(allLines, startIndex);
    const { tableContent, endIndex } = result;

    if (tableContent) {
      console.log(`标记表格从第${startIndex}行到第${endIndex}行`);

      // 标记第一行为表格开始，并存储完整表格内容
      markedLines[startIndex].isTable = true;
      markedLines[startIndex].tableContent = tableContent;
      markedLines[startIndex].isTableStart = true;

      // 标记其余表格行
      for (let j = startIndex + 1; j <= endIndex; j++) {
        markedLines[j].isTable = true;
      }
    }
  }

  console.log('表格检测和标记完成');

  // 处理每一行
  for (let i = 0; i < markedLines.length; i++) {
    const { line, isTable, tableContent, isTableStart } = markedLines[i];
    const trimmedLine = line.trim();
    
    // 检查是否为段落分隔符
    if (trimmedLine === '§PARAGRAPH§') {
      // 处理之前累积的内容
      flushTextBlock();
      
      // 如果正在处理列表，结束列表
      if (inList && listItems.length > 0) {
        // 创建一个垂直布局来容纳列表项，明确指定左对齐
        const listLayout = createLayoutElement(
          LAYOUT_CONSTANTS.DIRECTION.VERTICAL, 
          listItems,
          {
            alignItems: LAYOUT_CONSTANTS.ALIGN.X.MIN,
            counterAxisAlign: LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.MIN
          }
        );
        stack[stack.length - 1].elements.push(listLayout);
        
        // 重置列表状态
        inList = false;
        listItems = [];
      }
      
      continue;
    }

    // 检查是否为表格或图表数据
    const { isData, isChart, chartType } = isTableOrChartData(trimmedLine);
    
    if (isData) {
      console.log(`发现${isChart ? '图表' : '表格'}数据，行号: ${i}`);
      
      // 处理之前累积的内容
      flushTextBlock();
      flushConsecutiveButtons();
      
      // 提取表格/图表数据
      const result = extractTableOrChartData(
        markedLines.map(item => item.line),
        i
      );
      
      // 处理表格/图表数据
      const endIndex = processTableOrChartData(result, stack);
      
      // 跳过已处理的行
      i = endIndex;
      continue;
    }

    // 处理代码块
    if (isMarkdownCodeBlock(trimmedLine)) {
      // 处理之前累积的内容
      flushTextBlock();
      flushConsecutiveButtons();

      // 提取代码块内容和语言
      const { codeContent, language, endIndex } = extractMarkdownCodeBlock(
        markedLines.map(item => item.line),
        i
      );

      // 创建代码元素
      const codeElement = createCodeElement(codeContent, language);
      stack[stack.length - 1].elements.push(codeElement);

      // 跳过已处理的代码块行
      i = endIndex;
      continue;
    }

    // 新段落或特殊元素开始，处理之前累积的文本块
    if (trimmedLine === '') {
      flushTextBlock();
      
      // 如果正在处理列表，结束列表
      if (inList && listItems.length > 0) {
        // 创建一个垂直布局来容纳列表项，明确指定左对齐
        const listLayout = createLayoutElement(
          LAYOUT_CONSTANTS.DIRECTION.VERTICAL, 
          listItems,
          {
            alignItems: LAYOUT_CONSTANTS.ALIGN.X.MIN,
            counterAxisAlign: LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.MIN
          }
        );
        stack[stack.length - 1].elements.push(listLayout);
        
        // 重置列表状态
        inList = false;
        listItems = [];
      }
      
      continue;
    }

    // 解析标题
    const headingMatch = trimmedLine.match(/^(#{1,6})\s+(.*?)$/);
    if (headingMatch) {
      // 处理之前累积的内容
      flushTextBlock();
      flushConsecutiveButtons();

      const level = headingMatch[1].length;
      const content = headingMatch[2].trim();

      // 如果是一级标题，创建新的一级标题块
      if (level === 1) {
        // 如果已经有一个当前的一级标题块，将其添加到h1Blocks中
        if (currentH1Block) {
          h1Blocks.push(currentH1Block);
        }

        // 创建新的一级标题布局
        const newHeadingLayout = createHeadingLayout(content, [], level);

        // 创建新的一级标题块
        currentH1Block = newHeadingLayout;

        // 重置栈，只保留根级别
        while (stack.length > 1) {
          stack.pop();
        }

        // 将新的嵌套层级添加到栈中
        stack.push({ level, elements: newHeadingLayout.layout.children });
      } else {
        // 对于非一级标题，找到正确的父级嵌套层级
        while (stack.length > 1 && stack[stack.length - 1].level >= level) {
          stack.pop();
        }

        // 创建新的嵌套层级，传递标题级别
        const newHeadingLayout = createHeadingLayout(content, [], level);
        stack[stack.length - 1].elements.push(newHeadingLayout);

        // 将新的嵌套层级添加到栈中
        stack.push({ level, elements: newHeadingLayout.layout.children });
      }

      continue;
    }

    // 检查是否为列表项或包含富文本的行
    const richTextResult = processListItemAndRichText(trimmedLine);
    
    if (richTextResult.processed) {
      // 处理之前累积的文本块
      flushTextBlock();
      
      // 如果是列表项
      if (richTextResult.element.layout.style.listStyleType) {
        // 标记我们正在处理列表
        inList = true;
        
        // 添加到列表项数组
        listItems.push(richTextResult.element);
      } 
      // 如果不是列表项，直接添加到当前元素栈
      else {
        // 如果之前有列表，先处理列表
        if (inList && listItems.length > 0) {
          // 创建一个垂直布局来容纳列表项，明确指定左对齐
          const listLayout = createLayoutElement(
            LAYOUT_CONSTANTS.DIRECTION.VERTICAL, 
            listItems,
            {
              alignItems: LAYOUT_CONSTANTS.ALIGN.X.MIN,
              counterAxisAlign: LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.MIN
            }
          );
          stack[stack.length - 1].elements.push(listLayout);
          
          // 重置列表状态
          inList = false;
          listItems = [];
        }
        
        // 将处理后的元素添加到栈
        stack[stack.length - 1].elements.push(richTextResult.element);
      }
      
      continue;
    }

    // 整行是图片 ![alt](url)
    if (trimmedLine.match(/^!\[.*?\]\(.*?\)$/) && !trimmedLine.match(/^!\[.*?\]\(.*?\).*?\[.*?\]\(.*?\)/)) {
      flushTextBlock();
      flushConsecutiveButtons();

      const imgUrl = trimmedLine.match(/\((.*?)\)/)[1];

      const backgroundElement = createBackgroundElement(imgUrl);
      stack[stack.length - 1].elements.push(backgroundElement);

      continue;
    }

    // 检查是否有多个链接或混合内容
    if (trimmedLine.includes('[') && trimmedLine.includes('](') && trimmedLine.includes(')')) {
      // 如果该行不仅仅只有一个链接（即前后有其他文本），视为混合内容行
      const multiLinkMatch = trimmedLine.match(/\[([^\]]+)\]\(([^)]+)\)/g);
      const linkPattern = /^\[([^\]]+)\]\(([^)]+)\)$/;
      const isLinkLine = linkPattern.test(trimmedLine);

      // 如果不是纯链接行，则当作混合内容处理
      if (!isLinkLine) {
        flushTextBlock();
        flushConsecutiveButtons();

        console.log(`处理混合内容行: ${trimmedLine}`);

        const processedLayout = processMixedContent(trimmedLine);
        stack[stack.length - 1].elements.push(processedLayout);

        continue;
      }

      // 如果只有一个链接且占据整行，视为按钮
      if (multiLinkMatch && multiLinkMatch.length === 1 && isLinkLine) {
        console.log(`发现单个链接: ${multiLinkMatch[0]}`);
        flushTextBlock();

        const singleLinkMatch = multiLinkMatch[0].match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (singleLinkMatch) {
          const linkText = singleLinkMatch[1];
          const linkUrl = singleLinkMatch[2];

          console.log(`创建按钮: 文本="${linkText}", URL="${linkUrl}"`);

          const buttonElement = createButtonElement(linkText, linkUrl);
          console.log(`按钮ID: ${buttonElement.id}, 名称: ${buttonElement.name}`);
          consecutiveButtons.push(buttonElement);

          continue;
        }
      }
    }

    // 普通文本行
    if (trimmedLine !== '') {
      if (currentTextBlock) {
        currentTextBlock += '\n' + trimmedLine;
      } else {
        currentTextBlock = trimmedLine;
      }
    }
  }

  // 确保处理完所有累积的内容
  flushTextBlock();
  flushConsecutiveButtons();
  
  // 处理最后可能遗留的列表项
  if (inList && listItems.length > 0) {
    // 创建一个垂直布局来容纳列表项，明确指定左对齐
    const listLayout = createLayoutElement(
      LAYOUT_CONSTANTS.DIRECTION.VERTICAL, 
      listItems,
      {
        alignItems: LAYOUT_CONSTANTS.ALIGN.X.MIN,
        counterAxisAlign: LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.MIN
      }
    );
    stack[stack.length - 1].elements.push(listLayout);
  }

  // 如果有当前的一级标题块，将其添加到h1Blocks中
  if (currentH1Block) {
    h1Blocks.push(currentH1Block);
  }

  // 如果有多个一级标题块，创建流式布局并将它们包装起来
  if (h1Blocks.length > 1) {
    // 将每个一级标题块包装在容器中，设置最小宽度
    const wrappedH1Blocks = h1Blocks.map(block => createHeadingBlockContainer(block));

    // 创建流式布局容器
    const flexLayout = createFlexWrapLayout(wrappedH1Blocks);

    // 返回流式布局
    return [flexLayout];
  } else if (h1Blocks.length === 1) {
    // 如果只有一个一级标题块，直接返回
    return [h1Blocks[0]];
  }

  // 如果没有一级标题块，返回原始元素
  return elements;

  // 辅助函数：处理文本块
  function flushTextBlock() {
    if (currentTextBlock) {
      // 检查文本块是否包含富文本或列表项
      const lines = currentTextBlock.split('\n');
      
      // 如果只有一行，尝试处理富文本
      if (lines.length === 1) {
        const richTextResult = processListItemAndRichText(currentTextBlock);
        
        if (richTextResult.processed) {
          // 如果是列表项
          if (richTextResult.element.layout.style.listStyleType) {
            // 标记我们正在处理列表
            inList = true;
            
            // 添加到列表项数组
            listItems.push(richTextResult.element);
          } 
          // 如果不是列表项，直接添加到当前元素栈
          else {
            // 如果之前有列表，先处理列表
            if (inList && listItems.length > 0) {
              // 创建一个垂直布局来容纳列表项，明确指定左对齐
              const listLayout = createLayoutElement(
                LAYOUT_CONSTANTS.DIRECTION.VERTICAL, 
                listItems,
                {
                  alignItems: LAYOUT_CONSTANTS.ALIGN.X.MIN,
                  counterAxisAlign: LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.MIN
                }
              );
              stack[stack.length - 1].elements.push(listLayout);
              
              // 重置列表状态
              inList = false;
              listItems = [];
            }
            
            // 将处理后的元素添加到栈
            stack[stack.length - 1].elements.push(richTextResult.element);
          }
        } else {
          // 如果没有富文本格式，创建普通文本元素
          const textElement = createTextElement(currentTextBlock);
          stack[stack.length - 1].elements.push(textElement);
        }
      } 
      // 如果有多行，为每行单独处理
      else {
        // 创建一个垂直布局来容纳多行文本，明确指定左对齐
        const textLayout = createLayoutElement(
          LAYOUT_CONSTANTS.DIRECTION.VERTICAL,
          [],
          {
            alignItems: LAYOUT_CONSTANTS.ALIGN.X.MIN,
            counterAxisAlign: LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.MIN
          }
        );
        
        for (const line of lines) {
          if (line.trim() === '') continue;
          
          const richTextResult = processListItemAndRichText(line);
          
          if (richTextResult.processed) {
            // 如果是列表项
            if (richTextResult.element.layout.style.listStyleType) {
              // 标记我们正在处理列表
              inList = true;
              
              // 添加到列表项数组
              listItems.push(richTextResult.element);
            } 
            // 如果不是列表项，添加到布局
            else {
              textLayout.layout.children.push(richTextResult.element);
            }
          } else {
            // 如果没有富文本格式，创建普通文本元素
            const textElement = createTextElement(line);
            textLayout.layout.children.push(textElement);
          }
        }
        
        // 如果布局中有元素，添加到栈
        if (textLayout.layout.children.length > 0) {
          stack[stack.length - 1].elements.push(textLayout);
        }
      }
      
      currentTextBlock = '';
    }
  }

  // 辅助函数：将累积的按钮添加为水平布局
  function flushConsecutiveButtons() {
    if (consecutiveButtons.length > 0) {
      console.log(`处理 ${consecutiveButtons.length} 个连续按钮`);

      if (consecutiveButtons.length === 1) {
        // 单个按钮不需要水平布局
        stack[stack.length - 1].elements.push(consecutiveButtons[0]);
        console.log(`添加单个按钮: ${consecutiveButtons[0].id}`);
      } else {
        // 多个连续按钮放在水平布局中
        const buttonLayout = createHorizontalButtonLayout(consecutiveButtons);
        stack[stack.length - 1].elements.push(buttonLayout);
        console.log(`添加按钮布局: ${buttonLayout.id}, 包含 ${consecutiveButtons.length} 个按钮`);
      }
      consecutiveButtons = [];
    }
  }

  // 辅助函数：处理混合内容行
  function processMixedContent(line) {
    // 创建一个水平布局元素
    let currentLayout = createLayoutElement(LAYOUT_CONSTANTS.DIRECTION.HORIZONTAL);

    // 查找所有普通链接 [text](url) 但不是图片链接
    const normalLinkRegex = /(?<!!)\[(.*?)\]\((.*?)\)/g;
    const linkMatches = [...line.matchAll(normalLinkRegex)];
    console.log(`找到 ${linkMatches.length} 个普通链接`);

    // 查找所有图片 ![alt](url)
    const imageMatches = [...line.matchAll(/!\[(.*?)\]\((.*?)\)/g)];
    console.log(`找到 ${imageMatches.length} 个图片链接`);

    // 合并并按照在原文中的位置排序
    const allMatches = [
      ...linkMatches.map(match => ({ type: 'link', match })),
      ...imageMatches.map(match => ({ type: 'image', match }))
    ].sort((a, b) => a.match.index - b.match.index);

    let lastIndex = 0;

    // 按顺序处理所有匹配项
    for (const { type, match } of allMatches) {
      const matchIndex = match.index;

      // 处理匹配项前的文本
      if (matchIndex > lastIndex) {
        const textBefore = line.substring(lastIndex, matchIndex);
        // 始终创建文本元素，即使只有空格
        const textElement = createTextElement(textBefore);
        currentLayout.layout.children.push(textElement);
      }

      // 处理匹配项
      if (type === 'link') {
        const linkText = match[1];
        const linkUrl = match[2];
        console.log(`处理混合内容中的链接: 文本="${linkText}", URL="${linkUrl}"`);
        const buttonElement = createButtonElement(linkText, linkUrl);
        currentLayout.layout.children.push(buttonElement);
      } else if (type === 'image') {
        const imgAlt = match[1];
        const imgUrl = match[2];
        const backgroundElement = createBackgroundElement(imgUrl);
        currentLayout.layout.children.push(backgroundElement);
      }

      lastIndex = matchIndex + match[0].length;
    }

    // 处理最后一个匹配后的文本
    if (lastIndex < line.length) {
      const textAfter = line.substring(lastIndex);
      // 始终创建尾部文本元素，即使只有空格
      const textElement = createTextElement(textAfter);
      currentLayout.layout.children.push(textElement);
    }

    // 直接返回layout元素，而不是包含它的数组
    return currentLayout;
  }
}

// 创建八要素根对象
function createEightElementRoot(markdownElements) {
  const rootId = generateUUID();

  // 获取根布局的样式配置
  const rootStyleConfig = getElementStyleConfig('layout', 'root');

  const rootLayout = {
    dataKeys: [],
    id: rootId,
    name: "layout",
    "name-zh": "布局",
    "file-type": "template",
    theme: "default",
    layout: {
      style: {
        display: LAYOUT_CONSTANTS.DISPLAY.FLEX,
        layoutMode: LAYOUT_CONSTANTS.DIRECTION.VERTICAL,
        layoutWrap: LAYOUT_CONSTANTS.WRAP.NO_WRAP,
        primaryAxisSizingMode: "responsive",
        counterAxisSizingMode: LAYOUT_CONSTANTS.SIZING.FIXED,
        primaryAxisAlignItems: LAYOUT_CONSTANTS.ALIGN.X.CENTER, // 根容器主轴居中对齐
        counterAxisAlignItems: LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.CENTER, // 根容器交叉轴居中对齐
        layoutAlign: LAYOUT_CONSTANTS.ALIGN.Y.SELF.INHERIT,
        layoutGrow: LAYOUT_CONSTANTS.GROW.ZERO,
        width: "auto",
        height: "auto",
        position: "relative",
        "back-width": "auto",
        "back-height": "100px",
        "box-sizing": "border-box",
      },
      children: markdownElements
    },
    events: [{}]
  };

  // 应用根布局样式配置
  Object.entries(rootStyleConfig).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      rootLayout.layout.style[key] = value;
    }
  });

  // 确保根容器的对齐设置不被配置覆盖
  rootLayout.layout.style.primaryAxisAlignItems = LAYOUT_CONSTANTS.ALIGN.X.CENTER;
  rootLayout.layout.style.counterAxisAlignItems = LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.CENTER;

  return rootLayout;
}

// 主函数：将Markdown转换为八要素格式
function markdownToEightElement(markdown, styleConfig) {
  // 如果提供了样式配置，设置当前配置
  if (styleConfig) {
    try {
      // 动态导入避免循环依赖
      import('./styleConfig.js').then(({ setStyleConfig }) => {
        setStyleConfig(styleConfig);
      });
    } catch (error) {
      console.warn('设置样式配置失败:', error);
    }
  }

  // 检查并规范化输入
  let processedMarkdown = markdown;
  
  // 确保markdown是字符串类型
  if (typeof processedMarkdown !== 'string') {
    console.warn('收到非字符串类型的Markdown输入，尝试转换为字符串');
    try {
      processedMarkdown = String(processedMarkdown || '');
    } catch (error) {
      console.error('转换Markdown输入为字符串失败:', error);
      processedMarkdown = '';
    }
  }
  
  // 确保最后有一个换行符，以正确处理最后一个段落
  if (processedMarkdown && !processedMarkdown.endsWith('\n')) {
    processedMarkdown += '\n';
  }

  console.log(`处理Markdown文本，长度: ${processedMarkdown.length}`);
  
  // 直接使用parseMarkdown函数解析Markdown为元素数组
  const parsedElements = parseMarkdown(processedMarkdown);
  console.log(`解析得到的元素数量: ${parsedElements.length}`);
  
  // 使用createEightElementRoot创建八要素根结构
  const eightElementRoot = createEightElementRoot(parsedElements);

  // 重置为默认配置
  try {
    // 动态导入避免循环依赖
    import('./styleConfig.js').then(({ resetStyleConfig }) => {
      resetStyleConfig();
    });
  } catch (error) {
    console.warn('重置样式配置失败:', error);
  }

  return eightElementRoot;
}

// 打印八要素结构工具函数
function printEightElementStructure(element, indent = 0) {
  const indentation = ' '.repeat(indent);

  if (element.name) {
    console.log(`${indentation}${element.name} (${element.id || 'no-id'})`);
  } else {
    console.log(`${indentation}Anonymous Element`);
  }

  if (element.layout && element.layout.children) {
    console.log(`${indentation}Children (${element.layout.children.length}):`);
    for (const child of element.layout.children) {
      printEightElementStructure(child, indent + 2);
    }
  }
}

// 示例：将Markdown文本转换为八要素
function exampleMarkdownToEightElement(styleConfig) {
  const markdownText = `
# 示例标题

这是一段普通文本。

## 子标题

这是子标题下的文本内容。

### 次级标题

这是一些[链接1](https://example.com)和[链接2](https://example2.com)。

![示例图片](https://example.com/image.jpg)

混合内容行：文本中间的[链接](https://example.com)和![图片](https://example.com/img.png)以及更多文本。
  `;

  const eightElement = markdownToEightElement(markdownText, styleConfig);
  return eightElement;
}

// 示例调用
// const example = exampleMarkdownToEightElement();
// console.log(JSON.stringify(example, null, 2));

// 命名导出
export {
  markdownToEightElement,
  parseMarkdown,
  createTextElement,
  createButtonElement,
  createBackgroundElement,
  createLayoutElement,
  createHorizontalButtonLayout,
  createHeadingLayout,
  createFlexWrapLayout,
  createHeadingBlockContainer,
  createTableElement,
  createCodeElement,
  createChartElement,
  isMarkdownTable,
  isMarkdownCodeBlock,
  isTableOrChartData,   // 导出表格/图表检测函数
  extractTableOrChartData, // 导出表格/图表提取函数
  generateChartSvg,
  printEightElementStructure,
  exampleMarkdownToEightElement,
  LAYOUT_CONSTANTS,
  COLOR_CONSTANTS,
  DIMENSION_CONSTANTS,
  FONT_CONSTANTS
};
