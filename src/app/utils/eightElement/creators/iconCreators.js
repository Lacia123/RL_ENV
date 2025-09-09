import { generateUUID } from '../util.js';
import { getElementStyleConfig } from '../styleConfig.js';

// 创建图标元素
function createIconElement(iconName, variant = 'medium') {
    const id = generateUUID();

    // 获取图标元素的样式配置
    const iconStyleConfig = getElementStyleConfig('icon', variant);

    // 生成唯一的className
    const uniqueClassName = `icon-${variant}-${id}`;

    console.log(`🔧 创建图标元素: 图标名称=${iconName}, 变体=${variant}, 样式配置=`, iconStyleConfig);

    // 创建图标元素结构
    const iconElement = {
        dataKeys: [],
        id: id,
        name: "icon",
        "name-zh": "图标",
        "file-type": "cell-element",
        // 🔍 保存图标元数据用于分析
        _metadata: {
            actualType: 'icon',
            variant: variant,
            iconName: iconName,
            sampleContent: iconName
        },
        layout: {
            classStyle: {
                ...iconStyleConfig // 应用图标样式配置到classStyle
            },
            className: uniqueClassName,
            style: {
                "background-color": [],
                "font": [],
                "border": [],
                "scale": [],
                "box-sizing": "border-box"
            },
            icon_line: {
                type: "container",
                content: [],
                resource: "",
                data: [],
                style: {
                    display: "{layout.state.display.flex}",
                    layoutMode: "{layout.direction.NONE}",
                    layoutWrap: "{layout.wrap.NO_WRAP}",
                    layoutAlign: "{layout.align.y.self.INHERIT}",
                    layoutGrow: "{layout.grow.0}",
                    height: {
                        element: "scale",
                        value: "icon_height",
                        prop: "default",
                        token: "icon_height"
                    },
                    width: {
                        element: "scale",
                        value: "icon_width",
                        prop: "default",
                        token: "icon_width"
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
                            layoutAlign: "{layout.align.y.self.INHERIT}",
                            layoutGrow: "{layout.grow.1}",
                            iconColor: {
                                element: "color",
                                value: "icon_color",
                                prop: "default",
                                token: "icon_color"
                            },
                            height: {
                                element: "scale",
                                value: "icon_height",
                                prop: "default",
                                token: "icon_height"
                            },
                            width: {
                                element: "scale",
                                value: "icon_width",
                                prop: "default",
                                token: "icon_width"
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
                            value: "{color.basic.brand.5}",
                            type: "color",
                            key: "color-bg"
                        }
                    },
                    resource: "{color.basic.brand.5}"
                }
            },
            border: {
                default: {
                    "data-key": "",
                    style: {
                        border: {
                            value: "{color.basic.brand.5}",
                            type: "color",
                            key: "color-border"
                        }
                    },
                    resource: "{color.basic.brand.5}"
                }
            },
            icon_color: {
                default: {
                    "data-key": "",
                    style: {
                        // icon_color: {
                        //   value: "{color.basic.brand.5}",
                        //   type: "color",
                        //   key: "color-icon_color"
                        // },
                        // height: {
                        //   element: "scale",
                        //   value: "icon_height",
                        //   prop: "default",
                        //   token: "icon_height"
                        // },
                        // width: {
                        //   element: "scale",
                        //   value: "icon_width",
                        //   prop: "default",
                        //   token: "icon_width"
                        // }
                    },
                    type: "icon",
                    resource: iconName // 使用传入的图标名称
                },
                hover: {
                    "data-key": "",
                    style: {
                        icon_color: {
                            value: "{color.basic.opacity.white.100}",
                            type: "color",
                            key: "color-icon_color"
                        },
                        height: {
                            element: "scale",
                            value: "icon_height",
                            prop: "default",
                            token: "icon_height"
                        },
                        width: {
                            element: "scale",
                            value: "icon_width",
                            prop: "default",
                            token: "icon_width"
                        }
                    },
                    type: "icon",
                    resource: iconName
                },
                active: {
                    "data-key": "",
                    style: {
                        icon_color: {
                            value: "{color.basic.opacity.white.100}",
                            type: "color",
                            key: "color-icon_color"
                        },
                        height: {
                            element: "scale",
                            value: "icon_height",
                            prop: "default",
                            token: "icon_height"
                        },
                        width: {
                            element: "scale",
                            value: "icon_width",
                            prop: "default",
                            token: "icon_width"
                        }
                    },
                    type: "icon",
                    resource: iconName
                },
                pressed: {
                    "data-key": "",
                    style: {
                        icon_color: {
                            value: "{color.basic.opacity.white.100}",
                            type: "color",
                            key: "color-icon_color"
                        },
                        height: {
                            element: "scale",
                            value: "icon_height",
                            prop: "default",
                            token: "icon_height"
                        },
                        width: {
                            element: "scale",
                            value: "icon_width",
                            prop: "default",
                            token: "icon_width"
                        }
                    },
                    type: "icon",
                    resource: iconName
                },
                loading: {
                    "data-key": "",
                    style: {
                        icon_color: {
                            value: "{color.basic.opacity.white.100}",
                            type: "color",
                            key: "color-icon_color"
                        },
                        height: {
                            element: "scale",
                            value: "icon_height",
                            prop: "default",
                            token: "icon_height"
                        },
                        width: {
                            element: "scale",
                            value: "icon_width",
                            prop: "default",
                            token: "icon_width"
                        }
                    },
                    type: "icon",
                    resource: iconName
                },
                disable: {
                    "data-key": "",
                    style: {
                        icon_color: {
                            value: "{color.basic.opacity.white.100}",
                            type: "color",
                            key: "color-icon_color"
                        },
                        height: {
                            element: "scale",
                            value: "icon_height",
                            prop: "default",
                            token: "icon_height"
                        },
                        width: {
                            element: "scale",
                            value: "icon_width",
                            prop: "default",
                            token: "icon_width"
                        }
                    },
                    type: "icon",
                    resource: iconName
                }
            }
        },
        scale: {
            icon_width: {
                default: {
                    "data-key": "",
                    style: {
                        icon_width: {
                            value: "{dimension.basic.dimension.56}",
                            type: "sizing",
                            key: "scale-icon_width"
                        }
                    },
                    resource: "{dimension.basic.dimension.56}"
                }
            },
            icon_height: {
                default: {
                    "data-key": "",
                    style: {
                        icon_height: {
                            value: "{dimension.basic.dimension.56}",
                            type: "sizing",
                            key: "scale-icon_height"
                        }
                    },
                    resource: "{dimension.basic.dimension.56}"
                }
            }
        },
        shape: {
            borderwidth: {
                default: {
                    "data-key": "",
                    style: {
                        borderwidth: {
                            value: "{dimension.borderwidth.4}",
                            type: "borderWidth",
                            key: "shape-borderwidth"
                        }
                    },
                    resource: "{dimension.borderwidth.4}"
                }
            }
        },
        type: "icon_line",
        state: "default",
        events: [{}]
    };

    return iconElement;
}

export { createIconElement }