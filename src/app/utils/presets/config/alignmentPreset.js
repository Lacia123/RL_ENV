export default {
    "metawareType": "all",
    "preset": {
        "contentAlignLeft": {
            "name": "内容左对齐",
            "description": "将文本和内容左对齐，适合阅读长文本",
            "defaultStyle": {
                "textAlign": "left",
                "justifyContent": "flex-start",
                "alignItems": "flex-start"
            }
        },
        "contentAlignCenter": {
            "name": "内容居中对齐",
            "description": "将文本和内容居中对齐，适合标题和重点内容",
            "defaultStyle": {
                "textAlign": "center",
                "justifyContent": "center",
                "alignItems": "center"
            }
        },
        "contentAlignRight": {
            "name": "内容右对齐",
            "description": "将文本和内容右对齐，适合特定语言或数值展示",
            "defaultStyle": {
                "textAlign": "right",
                "justifyContent": "flex-end",
                "alignItems": "flex-end"
            }
        },
        "contentAlignJustify": {
            "name": "内容两端对齐",
            "description": "文本两端对齐，创造整齐的边缘",
            "defaultStyle": {
                "textAlign": "justify"
            }
        },
        "flexStartAlignment": {
            "name": "弹性起点对齐",
            "description": "元素在主轴起点对齐",
            "defaultStyle": {
                "display": "flex",
                "justifyContent": "flex-start",
                "gap": "{dimension.gap.base}"
            }
        },
        "flexCenterAlignment": {
            "name": "弹性居中对齐",
            "description": "元素在主轴居中对齐",
            "defaultStyle": {
                "display": "flex",
                "justifyContent": "center",
                "gap": "{dimension.gap.base}"
            }
        },
        "flexEndAlignment": {
            "name": "弹性末端对齐",
            "description": "元素在主轴末端对齐",
            "defaultStyle": {
                "display": "flex",
                "justifyContent": "flex-end",
                "gap": "{dimension.gap.base}"
            }
        },
        "flexSpaceBetweenAlignment": {
            "name": "弹性两端对齐",
            "description": "元素在主轴均匀分布，首尾对齐容器边缘",
            "defaultStyle": {
                "display": "flex",
                "justifyContent": "space-between",
                "gap": "{dimension.gap.base}"
            }
        },
        "flexSpaceAroundAlignment": {
            "name": "弹性环绕对齐",
            "description": "元素在主轴均匀分布，包括首尾空间",
            "defaultStyle": {
                "display": "flex",
                "justifyContent": "space-around",
                "gap": "{dimension.gap.base}"
            }
        },
        "flexSpaceEvenlyAlignment": {
            "name": "弹性均分对齐",
            "description": "元素及间距在主轴完全均匀分布",
            "defaultStyle": {
                "display": "flex",
                "justifyContent": "space-evenly",
                "gap": "{dimension.gap.base}"
            }
        },
        "crossAxisStretchAlignment": {
            "name": "交叉轴拉伸对齐",
            "description": "元素在交叉轴方向拉伸填满容器",
            "defaultStyle": {
                "display": "flex",
                "alignItems": "stretch"
            }
        },
        "crossAxisCenterAlignment": {
            "name": "交叉轴居中对齐",
            "description": "元素在交叉轴方向居中对齐",
            "defaultStyle": {
                "display": "flex",
                "alignItems": "center"
            }
        },
        "crossAxisStartAlignment": {
            "name": "交叉轴起点对齐",
            "description": "元素在交叉轴方向起点对齐",
            "defaultStyle": {
                "display": "flex",
                "alignItems": "flex-start"
            }
        },
        "crossAxisEndAlignment": {
            "name": "交叉轴末端对齐",
            "description": "元素在交叉轴方向末端对齐",
            "defaultStyle": {
                "display": "flex",
                "alignItems": "flex-end"
            }
        },
        "gridCellCenterAlignment": {
            "name": "网格单元格居中对齐",
            "description": "内容在网格单元格中居中对齐",
            "defaultStyle": {
                "display": "grid",
                "placeItems": "center"
            }
        },
        "gridContentDistribution": {
            "name": "网格内容分布",
            "description": "内容在网格中均匀分布",
            "defaultStyle": {
                "display": "grid",
                "placeContent": "space-between"
            }
        },
        "baselineAlignment": {
            "name": "基线对齐",
            "description": "文本元素按基线对齐",
            "defaultStyle": {
                "display": "flex",
                "alignItems": "baseline"
            }
        },
        "stackedAlignment": {
            "name": "垂直堆叠对齐",
            "description": "元素垂直居中堆叠",
            "defaultStyle": {
                "display": "flex",
                "flexDirection": "column",
                "alignItems": "center",
                "gap": "{dimension.gap.base}"
            }
        },
        "horizontalStackAlignment": {
            "name": "水平堆叠对齐",
            "description": "元素水平居中排列",
            "defaultStyle": {
                "display": "flex",
                "flexDirection": "row",
                "justifyContent": "center",
                "alignItems": "center",
                "gap": "{dimension.gap.base}"
            }
        },
        "edgeToContentAlignment": {
            "name": "边缘内容对齐",
            "description": "内容区与容器边缘保持固定距离",
            "defaultStyle": {
                "padding": "{dimension.gap.semiloose}",
                "boxSizing": "border-box"
            }
        }
    }
}