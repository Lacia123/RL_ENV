export default {
    "metawareType": "all",
    "preset": {
        "responsiveBreakpoints": {
            "name": "响应式断点",
            "description": "应用多断点响应式布局适配不同设备",
            "defaultStyle": {
                "mobile": {
                    "maxWidth": "480px",
                    "columns": "1fr",
                    "fontSize": "{font.size.medium}"
                },
                "tablet": {
                    "maxWidth": "768px",
                    "columns": "repeat(2, 1fr)",
                    "fontSize": "{font.size.medium}"
                },
                "laptop": {
                    "maxWidth": "1024px",
                    "columns": "repeat(3, 1fr)",
                    "fontSize": "{font.size.medium}"
                },
                "desktop": {
                    "maxWidth": "1440px",
                    "columns": "repeat(4, 1fr)",
                    "fontSize": "{font.size.medium}"
                }
            }
        },
        "containerQueries": {
            "name": "容器查询响应",
            "description": "基于容器大小而非视口大小的响应式布局",
            "defaultStyle": {
                "small": {
                    "padding": "{dimension.padding.extratight}",
                    "fontSize": "{font.size.small}",
                    "gap": "{dimension.gap.extratight}"
                },
                "medium": {
                    "padding": "{dimension.padding.base}",
                    "fontSize": "{font.size.medium}",
                    "gap": "{dimension.gap.base}"
                },
                "large": {
                    "padding": "{dimension.padding.extraloose}",
                    "fontSize": "{font.size.large}",
                    "gap": "{dimension.gap.extraloose}"
                }
            }
        },
        "deviceOptimization": {
            "name": "设备优化",
            "description": "针对特定设备类型优化体验",
            "defaultStyle": {
                "touch": {
                    "touchAction": "manipulation",
                    "WebkitTapHighlightColor": "transparent",
                    "minHeight": "44px",
                    "minWidth": "44px"
                },
                "pointer": {
                    "cursor": "pointer",
                    "transition": "all 0.2s ease"
                },
                "keyboard": {
                    "outlineWidth": "2px",
                    "outlineStyle": "solid",
                    "outlineColor": "{color.primary.brand5}",
                    "outlineOffset": "2px"
                }
            }
        },
        "colorModeAdaptation": {
            "name": "色彩模式适配",
            "description": "适配浅色/深色模式的界面设计",
            "defaultStyle": {
                "light": {
                    "backgroundColor": "{color.onprimary.white100}",
                    "color": "{color.onprimary.black88}",
                    "borderColor": "rgba(0,0,0,0.1)"
                },
                "dark": {
                    "backgroundColor": "{color.onprimary.black100}",
                    "color": "{color.onprimary.white88}",
                    "borderColor": "rgba(255,255,255,0.1)"
                },
                "transition": "background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease"
            }
        },
        "contentPrioritization": {
            "name": "内容优先级",
            "description": "根据屏幕尺寸重新排序和优先展示关键内容",
            "defaultStyle": {
                "critical": {
                    "order": "0",
                    "display": "block"
                },
                "important": {
                    "order": "1",
                    "display": "block"
                },
                "optional": {
                    "order": "2",
                    "display": "none",
                    "tabletDisplay": "block"
                },
                "decoration": {
                    "order": "3",
                    "display": "none",
                    "desktopDisplay": "block"
                }
            }
        },
        "layoutShifting": {
            "name": "布局重排",
            "description": "在不同的屏幕尺寸下重新排列内容结构",
            "defaultStyle": {
                "stack": {
                    "display": "flex",
                    "flexDirection": "column",
                    "gap": "{dimension.gap.base}",
                    "width": "100%"
                },
                "sideToSide": {
                    "display": "flex",
                    "flexDirection": "row",
                    "gap": "{dimension.gap.extraloose}",
                    "width": "100%",
                    "alignItems": "center"
                },
                "swapOrder": {
                    "display": "flex",
                    "flexDirection": "column-reverse",
                    "tabletFlexDirection": "row",
                    "gap": "{dimension.gap.base}"
                }
            }
        },
        "accessibilityEnhancement": {
            "name": "无障碍增强",
            "description": "增强界面的可访问性和普遍可用性",
            "defaultStyle": {
                "highContrast": {
                    "color": "#000000",
                    "backgroundColor": "#ffffff",
                    "border": "1px solid #000000"
                },
                "largeText": {
                    "fontSize": "{font.size.large}",
                    "lineHeight": "1.5"
                },
                "focusVisible": {
                    "outline": "3px solid {color.primary.brand5}",
                    "outlineOffset": "2px"
                },
                "keyboardFriendly": {
                    "tabIndex": "0"
                }
            }
        },
        "contentDensityControl": {
            "name": "内容密度控制",
            "description": "允许用户控制或自动适应内容密度",
            "defaultStyle": {
                "compact": {
                    "padding": "{dimension.padding.extratight}",
                    "fontSize": "{font.size.small}",
                    "lineHeight": "1.4",
                    "gap": "{dimension.gap.extratight}"
                },
                "comfortable": {
                    "padding": "{dimension.padding.base}",
                    "fontSize": "{font.size.medium}",
                    "lineHeight": "1.6",
                    "gap": "{dimension.gap.base}"
                },
                "spacious": {
                    "padding": "{dimension.padding.extraloose}",
                    "fontSize": "{font.size.large}",
                    "lineHeight": "1.8",
                    "gap": "{dimension.gap.extraloose}"
                }
            }
        },
        "contextualSpacing": {
            "name": "情境间距",
            "description": "根据上下文关系调整元素间距",
            "defaultStyle": {
                "related": {
                    "gap": "{dimension.gap.extratight}",
                    "marginBottom": "{dimension.margin.base}"
                },
                "grouped": {
                    "gap": "{dimension.gap.base}",
                    "marginBottom": "{dimension.margin.extraloose}"
                },
                "separated": {
                    "gap": "{dimension.gap.superloose}",
                    "marginBottom": "{dimension.margin.superloose}"
                }
            }
        }
    }
}