import { generateUUID } from '../util.js';
import {
    getElementStyleConfig,
    LAYOUT_CONSTANTS,
    DIMENSION_CONSTANTS,
    COLOR_CONSTANTS,
  } from '../styleConfig.js';
import { EVENT_NAME } from '../eventConfig.js';

// 创建背景元素（用于图片）
function createBackgroundElement(imageUrl, variant = 'normal') {
    const id = generateUUID();
    // 获取图片元素的样式配置
    const imageStyleConfig = getElementStyleConfig('image', variant);
    const layoutStyleConfig = getElementStyleConfig('layout', 'column');

    // 生成唯一的className
    const uniqueClassName = `background-${id}`;

    return {
        id,
        name: "background",
        "name-zh": "背景",
        "file-type": "cell-element",
        // 🔍 保存元数据用于分析
        _metadata: {
            actualType: 'image',
            variant: variant,
            isImage: true,
            imageUrl: imageUrl
        },
        layout: {
            classStyle: {
                ...imageStyleConfig
            },
            className: uniqueClassName,
            style: {
                backgroundColor: [],
                font: [],
                border: [],
                scale: [],
                overflow: "hidden",
                boxSizing: "border-box",
                // primaryAxisSizingMode: "fixed",
                position: "relative",
                ...layoutStyleConfig,
                padding: '0',
                margin: '0'
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
                    layoutAlign: LAYOUT_CONSTANTS.ALIGN.Y.SELF.INHERIT,
                    layoutGrow: LAYOUT_CONSTANTS.GROW.ZERO,
                    width: '100%',
                    height: '100%',
                    // borderColor: {
                    //   element: "color",
                    //   value: "border",
                    //   prop: "default",
                    //   token: "border"
                    // },
                    // borderRadius: {
                    //   element: "shape",
                    //   value: "borderradius",
                    //   prop: "default",
                    //   token: "borderradius"
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
                    // },
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
                    preview: imageUrl,
                    style: {
                        image: {
                            value: imageUrl,
                            type: "asset",
                            key: "material-image"
                        },
                        width: '100%',
                        height: '100%'
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
        events: [{
            "runtimeEventKey": EVENT_NAME.THEME_CHANGED,
            "nativeEventKey": 'contextmenu',
            "dataEventKey": [],
            "parameters": {
                "imageUrl": imageUrl
            }
        }]
    };
}

export {
    createBackgroundElement
}