export default {
    "metawareType": "all",
    "preset": {
        "primaryFocus": {
            "name": "主要焦点",
            "description": "突出展示界面中最重要的核心元素",
            "defaultStyle": {
                "transform": "scale(1.1)",
                "zIndex": "2",
                "position": "relative",
                "boxShadow": "0 8px 16px rgba(0,0,0,0.12)",
                "margin": "{dimension.margin.extratight} 0",
                "backgroundColor": "{color.onprimary.white100}"
            }
        },
        "contentEmphasis": {
            "name": "内容强调",
            "description": "强调重要内容，提高用户注意力",
            "defaultStyle": {
                "fontWeight": "bold",
                "color": "{color.primary.brand5}",
                "fontSize": "calc({font.size.medium} * 1.1)",
                "position": "relative",
                "display": "inline-block"
            }
        },
        "visualWeight": {
            "name": "视觉重量",
            "description": "通过视觉重量分配创建清晰的重要性层级",
            "defaultStyle": {
                "primary": {
                    "fontSize": "{font.size.xl}",
                    "fontWeight": "bold",
                    "color": "{color.onprimary.black100}"
                },
                "secondary": {
                    "fontSize": "{font.size.large}",
                    "fontWeight": "600",
                    "color": "{color.onprimary.black88}"
                },
                "tertiary": {
                    "fontSize": "{font.size.medium}",
                    "fontWeight": "500",
                    "color": "{color.onprimary.black76}"
                }
            }
        },
        "contentGrouping": {
            "name": "内容分组",
            "description": "通过视觉特征将相关元素分组，增强关联性",
            "defaultStyle": {
                "padding": "{dimension.padding.base}",
                "backgroundColor": "{color.onprimary.white100}",
                "borderRadius": "8px",
                "border": "1px solid rgba(0,0,0,0.1)",
                "marginBottom": "{dimension.margin.extraloose}"
            }
        },
        "depthLayers": {
            "name": "深度分层",
            "description": "利用Z轴创建界面元素的前后层次关系",
            "defaultStyle": {
                "base": {
                    "position": "relative",
                    "zIndex": "0"
                },
                "middle": {
                    "position": "relative",
                    "zIndex": "1",
                    "boxShadow": "0 4px 8px rgba(0,0,0,0.1)"
                },
                "top": {
                    "position": "relative",
                    "zIndex": "2",
                    "boxShadow": "0 8px 16px rgba(0,0,0,0.12)"
                }
            }
        },
        "sizeScaling": {
            "name": "尺寸缩放",
            "description": "通过元素大小变化传达重要性和层级关系",
            "defaultStyle": {
                "large": {
                    "fontSize": "{font.size.xl}",
                    "padding": "calc({dimension.padding.base} * 1.5)"
                },
                "medium": {
                    "fontSize": "{font.size.large}",
                    "padding": "{dimension.padding.base}"
                },
                "small": {
                    "fontSize": "{font.size.small}",
                    "padding": "{dimension.padding.tight}"
                }
            }
        },
        "contrastHierarchy": {
            "name": "对比层级",
            "description": "运用对比度创建视觉注意力引导",
            "defaultStyle": {
                "high": {
                    "color": "{color.onprimary.black100}",
                    "backgroundColor": "{color.onprimary.white100}",
                    "fontWeight": "bold"
                },
                "medium": {
                    "color": "{color.onprimary.black88}",
                    "backgroundColor": "rgba(255,255,255,0.9)",
                    "fontWeight": "600"
                },
                "low": {
                    "color": "{color.onprimary.black76}",
                    "backgroundColor": "rgba(255,255,255,0.8)",
                    "fontWeight": "normal"
                }
            }
        },
        "directionalFlow": {
            "name": "方向性流动",
            "description": "设计引导用户视线流动方向的布局结构",
            "defaultStyle": {
                "display": "flex",
                "flexDirection": "column",
                "alignItems": "flex-start",
                "gap": "{dimension.gap.base}",
                "width": "100%"
            }
        },
        "visualBreaks": {
            "name": "视觉分隔",
            "description": "利用分隔元素创建内容区块感",
            "defaultStyle": {
                "divider": {
                    "height": "1px",
                    "backgroundColor": "rgba(0,0,0,0.1)",
                    "margin": "{dimension.margin.extraloose} 0",
                    "width": "100%"
                },
                "spacer": {
                    "height": "{dimension.gap.superloose}",
                    "width": "100%"
                },
                "separator": {
                    "height": "4px",
                    "width": "40px",
                    "backgroundColor": "{color.primary.brand5}",
                    "margin": "{dimension.margin.base} 0"
                }
            }
        },
        "informationDensity": {
            "name": "信息密度控制",
            "description": "根据内容性质调整信息呈现密度",
            "defaultStyle": {
                "dense": {
                    "lineHeight": "1.3",
                    "gap": "{dimension.gap.extratight}",
                    "padding": "{dimension.padding.extratight}"
                },
                "balanced": {
                    "lineHeight": "1.5",
                    "gap": "{dimension.gap.base}",
                    "padding": "{dimension.padding.base}"
                },
                "airy": {
                    "lineHeight": "1.8",
                    "gap": "{dimension.gap.extraloose}",
                    "padding": "{dimension.padding.extraloose}"
                }
            }
        },
        "focusArea": {
            "name": "焦点区域",
            "description": "创建视觉上的内容焦点区域",
            "defaultStyle": {
                "padding": "{dimension.padding.extraloose}",
                "backgroundColor": "{color.onprimary.white100}",
                "borderRadius": "12px",
                "boxShadow": "0 4px 12px rgba(0,0,0,0.1)",
                "border": "1px solid rgba(0,0,0,0.05)",
                "transform": "translateY(-8px)"
            }
        }
    }
}