export default {
    "metawareType": "all",
    "preset": {
        "gridSystem12Col": {
            "name": "12列栅格系统",
            "description": "应用经典的12列栅格系统布局，提供精确的内容定位与对齐",
            "defaultStyle": {
                "display": "grid",
                "gridTemplateColumns": "repeat(12, 1fr)",
                "gap": "{dimension.gap.base}",
                "width": "100%",
                "maxWidth": "1200px",
                "margin": "0 auto",
                "padding": "0 {dimension.padding.semiloose}"
            }
        },
        "gridSystem8Col": {
            "name": "8列栅格系统",
            "description": "应用更简洁的8列栅格布局，适合中等复杂度的界面",
            "defaultStyle": {
                "display": "grid",
                "gridTemplateColumns": "repeat(8, 1fr)",
                "gap": "{dimension.gap.base}",
                "width": "100%",
                "maxWidth": "1024px",
                "margin": "0 auto",
                "padding": "0 {dimension.padding.semiloose}"
            }
        },
        "flexRowLayout": {
            "name": "弹性行布局",
            "description": "创建横向弹性布局，元素自动适应空间分布",
            "defaultStyle": {
                "display": "flex",
                "flexDirection": "row",
                "flexWrap": "wrap",
                "alignItems": "center",
                "justifyContent": "space-between",
                "gap": "{dimension.gap.base}",
                "width": "100%"
            }
        },
        "flexColumnLayout": {
            "name": "弹性列布局",
            "description": "创建纵向弹性布局，元素自上而下流动排列",
            "defaultStyle": {
                "display": "flex",
                "flexDirection": "column",
                "gap": "{dimension.gap.extraloose}",
                "width": "100%"
            }
        },
        "cardGridLayout": {
            "name": "卡片网格布局",
            "description": "创建自适应的卡片网格，适合展示集合内容",
            "defaultStyle": {
                "display": "grid",
                "gridTemplateColumns": "repeat(auto-fill, minmax(280px, 1fr))",
                "gap": "{dimension.gap.extraloose}",
                "width": "100%",
                "padding": "{dimension.padding.base}"
            }
        },
        "heroSection": {
            "name": "英雄区布局",
            "description": "创建全宽度的主视觉区域，突出显示核心信息",
            "defaultStyle": {
                "display": "flex",
                "flexDirection": "column",
                "alignItems": "center",
                "justifyContent": "center",
                "minHeight": "500px",
                "width": "100%",
                "padding": "{dimension.padding.superloose} {dimension.padding.base}",
                "textAlign": "center",
                "position": "relative",
                "overflow": "hidden"
            }
        },
        "sideBySide": {
            "name": "并排布局",
            "description": "创建左右并排的内容布局，适合对比展示或媒体加文本组合",
            "defaultStyle": {
                "display": "grid",
                "gridTemplateColumns": "1fr 1fr",
                "gap": "{dimension.gap.superloose}",
                "alignItems": "center",
                "width": "100%"
            }
        },
        "asymmetricSplit": {
            "name": "非对称分割",
            "description": "创建比例不均等的分栏布局，强调主次关系",
            "defaultStyle": {
                "display": "grid",
                "gridTemplateColumns": "2fr 1fr",
                "gap": "{dimension.gap.extraloose}",
                "width": "100%"
            }
        },
        "sidebar": {
            "name": "侧边栏布局",
            "description": "创建主内容区配合侧边栏的布局模式",
            "defaultStyle": {
                "display": "grid",
                "gridTemplateColumns": "280px 1fr",
                "gap": "{dimension.gap.extraloose}",
                "width": "100%",
                "minHeight": "calc(100vh - 64px)"
            }
        },
        "negativeSpace": {
            "name": "留白布局",
            "description": "运用充分的留白创造优雅、聚焦的内容布局",
            "defaultStyle": {
                "maxWidth": "800px",
                "margin": "0 auto",
                "padding": "{dimension.padding.superloose} {dimension.padding.extraloose}",
                "display": "flex",
                "flexDirection": "column",
                "gap": "{dimension.gap.superloose}"
            }
        },
        "containerConstraint": {
            "name": "内容宽度约束",
            "description": "应用理想内容宽度限制，提高长文本可读性",
            "defaultStyle": {
                "maxWidth": "65ch",
                "margin": "0 auto",
                "width": "100%",
                "lineHeight": "1.6"
            }
        },
        "horizontalScroll": {
            "name": "水平滚动容器",
            "description": "创建横向可滚动的内容区域，适合展示一组相关项目",
            "defaultStyle": {
                "display": "flex",
                "flexDirection": "row",
                "overflowX": "auto",
                "overflowY": "hidden",
                "gap": "{dimension.gap.base}",
                "padding": "{dimension.padding.base}",
                "width": "100%",
                "scrollSnapType": "x mandatory",
                "WebkitOverflowScrolling": "touch"
            }
        }
    }
}