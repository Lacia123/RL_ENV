import { generateUUID } from './util.js';
import {
    getElementStyleConfig,
    LAYOUT_CONSTANTS,
    DIMENSION_CONSTANTS,
    COLOR_CONSTANTS,
    FONT_CONSTANTS,
} from './styleConfig.js';
import { createLayoutElement } from './layoutCreators.js';
import { parseEventSyntax, removeEventSyntax } from './PSUIPParser.js';


// 解析按钮类型标记
function parseButtonVariant(text) {
    // 匹配按钮类型标记格式：[variant] [文本](链接) 或 [variant][文本](链接)
    const variantPattern = /^\[(\w+)\]\s*\[([^\]]+)\]\(([^)]+)\)$/;
    const match = text.match(variantPattern);

    if (match) {
        const [, variant, buttonText, url] = match;
        const supportedVariants = ['primary', 'secondary', 'success', 'warning', 'error', 'ghost', 'link'];

        // 检查variant是否在支持的列表中
        if (supportedVariants.includes(variant)) {
            return {
                hasVariant: true,
                variant: variant,
                text: buttonText,
                url: url
            };
        }
    }

    // 🆕 检查事件语法格式：[event:eventName][文本](链接)
    const eventPattern = /^\[event:\w+\]\s*\[([^\]]+)\]\(([^)]+)\)$/;
    const eventMatch = text.match(eventPattern);

    if (eventMatch) {

        const [, buttonText, url] = eventMatch;
        return {
            hasVariant: true,
            variant: 'primary', // 事件按钮默认使用primary样式
            text: buttonText,
            url: url,
            isEventButton: true // 标记为事件按钮
        };
    }

    return { hasVariant: false };
}

// 创建按钮元素（用于超链接）
function createButtonElement(text, url, variant = 'primary', currentMarkdown = '', displayText = null) {
    const id = generateUUID();

    // 解析事件语法（使用原始文本）
    const buttonEvents = parseEventSyntax(text, id, currentMarkdown);
    // 使用提供的显示文本，或者从原始文本中移除事件语法标记
    const cleanText = displayText || removeEventSyntax(text);

    // 获取按钮元素的样式配置
    const buttonStyleConfig = getElementStyleConfig('button', variant);

    const layoutStyleConfig = getElementStyleConfig('layout', 'column');

    // 生成唯一的className
    const uniqueClassName = `button-${id}`;

    const buttonElement = {
        id,
        name: "button", // 确保按钮名称为"button"
        "name-zh": "按钮",
        "file-type": "cell-element",
        // 🔍 保存元数据用于分析
        _metadata: {
            actualType: 'button',
            variant: variant,
            isButton: true,
            buttonText: text,
            buttonUrl: url,
            hasVariantTag: variant !== 'primary' // 标记是否使用了类型标记（非默认primary）
        },
        layout: {
            classStyle: {
                ...buttonStyleConfig
            },
            className: uniqueClassName,
            style: {
                backgroundColor: [],
                font: [],
                border: [],
                scale: [],
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                boxSizing: "border-box",
                // primaryAxisSizingMode: "fixed",
                position: "relative",
                ...layoutStyleConfig,
                padding: buttonStyleConfig.padding,
                gap: buttonStyleConfig.gap,
                margin: buttonStyleConfig.margin
            },
            button_normal: {
                type: "container",
                content: [],
                resource: "",
                data: [],
                style: {
                    // display: LAYOUT_CONSTANTS.DISPLAY.FLEX,
                    // layoutMode: LAYOUT_CONSTANTS.DIRECTION.HORIZONTAL,
                    // layoutWrap: LAYOUT_CONSTANTS.WRAP.NO_WRAP,
                    // primaryAxisSizingMode: LAYOUT_CONSTANTS.SIZING.AUTO,
                    // counterAxisSizingMode: LAYOUT_CONSTANTS.SIZING.AUTO,
                    // primaryAxisAlignItems: LAYOUT_CONSTANTS.ALIGN.X.CENTER,
                    // counterAxisAlignItems: LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.CENTER,
                    // layoutAlign: LAYOUT_CONSTANTS.ALIGN.Y.SELF.INHERIT,
                    // layoutGrow: LAYOUT_CONSTANTS.GROW.ZERO,
                    // minWidth: {
                    //   element: "scale",
                    //   value: "min_width",
                    //   prop: "default",
                    //   token: "min_width"
                    // },
                    // minHeight: {
                    //   element: "scale",
                    //   value: "min_height",
                    //   prop: "default",
                    //   token: "min_height"
                    // },
                    // spacing: {
                    //   element: "scale",
                    //   value: "padding",
                    //   prop: "default",
                    //   token: "padding"
                    // },
                    // itemSpacing: {
                    //   element: "scale",
                    //   value: "gap",
                    //   prop: "default",
                    //   token: "gap"
                    // },
                    // fill: {
                    //   element: "color",
                    //   value: "bg",
                    //   prop: "default",
                    //   token: "bg"
                    // },
                    // fontColor: {
                    //   element: "color",
                    //   value: "text",
                    //   prop: "default",
                    //   token: "text"
                    // },
                    // fontSizes: {
                    //   element: "font",
                    //   value: "fontsize",
                    //   prop: "default",
                    //   token: "fontsize"
                    // },
                    // borderRadius: {
                    //   element: "shape",
                    //   value: "borderradius",
                    //   prop: "default",
                    //   token: "borderradius"
                    // },
                    // borderColor: {
                    //   element: "color",
                    //   value: "border",
                    //   prop: "default",
                    //   token: "border"
                    // },
                    // borderWidth: {
                    //   element: "shape",
                    //   value: "borderwidth",
                    //   prop: "default",
                    //   token: "borderwidth"
                    // },
                    // boxShadow: {
                    //   element: "material",
                    //   value: "elevation",
                    //   prop: "default",
                    //   token: "elevation"
                    // }
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
                            value: buttonStyleConfig.color || COLOR_CONSTANTS.BASIC.OPACITY.WHITE[100],
                            type: "color",
                            key: "color-text"
                        }
                    },
                    resource: buttonStyleConfig.color || COLOR_CONSTANTS.BASIC.OPACITY.WHITE[100]
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
                    content: cleanText, // 使用清理后的按钮文本（移除事件语法）
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
        events: buttonEvents.length > 0 ? buttonEvents : [{}], // 应用解析到的事件配置
        url: url  // 存储链接URL
    };

    return buttonElement;
}


// 创建垂直按钮布局创建函数（默认布局）
function createVerticalButtonLayout(buttons) {
    return createLayoutElement(LAYOUT_CONSTANTS.DIRECTION.VERTICAL, buttons, {
        gap: DIMENSION_CONSTANTS.GAP.base,
        alignItems: LAYOUT_CONSTANTS.ALIGN.X.MIN,
        variant: 'column', // 使用 column 布局变体
        counterAxisAlign: LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.MIN
    });
}

// 保留水平按钮布局创建函数（用于布局标签）
function createHorizontalButtonLayout(buttons, options = {}) {
    return createLayoutElement(LAYOUT_CONSTANTS.DIRECTION.HORIZONTAL, buttons, {
        gap: DIMENSION_CONSTANTS.GAP.base,
        alignItems: LAYOUT_CONSTANTS.ALIGN.X.CENTER,
        variant: 'row', // 使用 row 布局变体
        // 允许传入自定义的 justifyContent 设置
        justifyContent: options.justifyContent,
        // 无需明确设置counterAxisAlign，createLayoutElement会自动为水平布局设置交叉轴居中
    });
}

export {
    parseButtonVariant,
    createButtonElement,
    createVerticalButtonLayout,
    createHorizontalButtonLayout
}