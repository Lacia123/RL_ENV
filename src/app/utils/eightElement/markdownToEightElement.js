// markdownToEightElement.js
// 导入样式配置和常量
import { 
  getElementStyleConfig, 
  LAYOUT_CONSTANTS,
  COLOR_CONSTANTS, 
  DIMENSION_CONSTANTS, 
  FONT_CONSTANTS 
} from './styleConfig.js';

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
  const { width = "100%", height = "100%" } = options;

  return {
    style: {
      display: LAYOUT_CONSTANTS.DISPLAY.FLEX,
      layoutMode: direction,
      layoutWrap: LAYOUT_CONSTANTS.WRAP.NO_WRAP,
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

// 创建文本元素
function createTextElement(text, variant = 'normal') {
  const id = generateUUID();
  // 获取文本元素的样式配置
  const textStyleConfig = getElementStyleConfig('text', variant);
  
  return {
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
        position: "relative"
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
          content: text,
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
      fontweight: textStyleConfig.fontWeight ? {
        default: {
          "data-key": "",
          style: {
            fontweight: {
              value: textStyleConfig.fontWeight,
              type: "fontWeight",
              key: "font-fontweight"
            }
          },
          resource: textStyleConfig.fontWeight
        }
      } : undefined
    },
    type: "text_body",
    state: "default",
    events: [{}]
  };
}

// 创建按钮元素（用于超链接）
function createButtonElement(text, url, variant = 'primary') {
  const id = generateUUID();
  // 获取按钮元素的样式配置
  const buttonStyleConfig = getElementStyleConfig('button', variant);

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
        position: "relative"
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
        position: "relative"
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
  const { width, height, gap, variant = 'inner', isRoot = false } = options;

  // 获取布局元素的样式配置
  const layoutStyleConfig = getElementStyleConfig('layout', isRoot ? 'root' : variant);
  
  // 创建基础布局
  const baseLayout = createBaseLayout(direction, { width, height });
  
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
    gap: DIMENSION_CONSTANTS.GAP.base
  });
}

// 更新标题布局创建函数
function createHeadingLayout(headingContent, subElements = [], headingLevel = 1) {
  const layout = createLayoutElement(LAYOUT_CONSTANTS.DIRECTION.VERTICAL, [], {
    gap: DIMENSION_CONSTANTS.GAP.loose,
    variant: 'inner'
  });

  // 添加标题文本，根据标题级别选择文本样式
  const headingVariant = `h${headingLevel}`;
  const headingText = createTextElement(headingContent, headingVariant);
  
  layout.layout.children.push(headingText);

  // 添加子元素
  if (subElements.length > 0) {
    layout.layout.children = layout.layout.children.concat(subElements);
  }

  return layout;
}

// 改进Markdown解析功能，支持更复杂的内容处理
function parseMarkdown(markdown) {
  // 分割Markdown文本为行
  const lines = markdown.split('\n');

  // 解析结果将存储在这个数组中
  const elements = [];

  // 用于跟踪当前的嵌套级别
  const stack = [{ level: 0, elements: elements }];

  // 用于收集连续的按钮元素
  let consecutiveButtons = [];

  // 缓存当前处理的文本块
  let currentTextBlock = '';

  // 处理每一行
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // 新段落或特殊元素开始，处理之前累积的文本块
    if (line === '' && currentTextBlock) {
      flushTextBlock();
      continue;
    }

    // 解析标题
    const headingMatch = line.match(/^(#{1,6})\s+(.*?)$/);
    if (headingMatch) {
      // 处理之前累积的内容
      flushTextBlock();
      flushConsecutiveButtons();

      const level = headingMatch[1].length;
      const content = headingMatch[2].trim();

      // 找到正确的父级嵌套层级
      while (stack.length > 1 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }

      // 创建新的嵌套层级，传递标题级别
      const newHeadingLayout = createHeadingLayout(content, [], level);
      stack[stack.length - 1].elements.push(newHeadingLayout);

      // 将新的嵌套层级添加到栈中
      stack.push({ level, elements: newHeadingLayout.layout.children });

      continue;
    }

    // 整行是图片 ![alt](url)
    if (line.match(/^!\[.*?\]\(.*?\)$/) && !line.match(/^!\[.*?\]\(.*?\).*?\[.*?\]\(.*?\)/)) {
      flushTextBlock();
      flushConsecutiveButtons();

      const imgUrl = line.match(/\((.*?)\)/)[1];

      const backgroundElement = createBackgroundElement(imgUrl);
      stack[stack.length - 1].elements.push(backgroundElement);

      continue;
    }

    // 检查是否有多个链接或混合内容
    if (line.includes('[') && line.includes('](') && line.includes(')')) {
      // 如果该行不仅仅只有一个链接（即前后有其他文本），视为混合内容行
      const multiLinkMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/g);
      const linkPattern = /^\[([^\]]+)\]\(([^)]+)\)$/;
      const isLinkLine = linkPattern.test(line);

      // 如果不是纯链接行，则当作混合内容处理
      if (!isLinkLine) {
        flushTextBlock();
        flushConsecutiveButtons();

        console.log(`处理混合内容行: ${line}`);

        const processedLayout = processMixedContent(line);
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
    if (line !== '') {
      if (currentTextBlock) {
        currentTextBlock += '\n' + line;
      } else {
        currentTextBlock = line;
      }
    }
  }

  // 确保处理完所有累积的内容
  flushTextBlock();
  flushConsecutiveButtons();

  // 辅助函数：处理文本块
  function flushTextBlock() {
    if (currentTextBlock) {
      const textElement = createTextElement(currentTextBlock);
      stack[stack.length - 1].elements.push(textElement);
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

  return elements;
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
        primaryAxisAlignItems: LAYOUT_CONSTANTS.ALIGN.X.CENTER,
        counterAxisAlignItems: LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.CENTER,
        layoutAlign: LAYOUT_CONSTANTS.ALIGN.Y.SELF.INHERIT,
        layoutGrow: LAYOUT_CONSTANTS.GROW.ZERO,
        width: "auto",
        height: "auto",
        position: "relative",
        "back-width": "auto",
        "back-height": "100px",
        "box-sizing": "border-box",
        "border-top-left-radius": DIMENSION_CONSTANTS.BORDER_RADIUS[20]
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
  
  const parsedElements = parseMarkdown(markdown);
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

// 添加辅助函数：打印八要素结构以便调试
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

// 增强导出功能，添加示例和调试工具

export {
  markdownToEightElement,
  parseMarkdown,
  createTextElement,
  createButtonElement,
  createBackgroundElement,
  createLayoutElement,
  createHorizontalButtonLayout,
  createHeadingLayout,
  printEightElementStructure,
  exampleMarkdownToEightElement,
  LAYOUT_CONSTANTS,
  COLOR_CONSTANTS,
  DIMENSION_CONSTANTS,
  FONT_CONSTANTS
}
