export default {
  "vertical-centered": {
    "name": "居中垂直布局",
    "description": "垂直方向的居中布局",
    "defaultStyle": {
      "direction": "column",
      "justifyContent": "center",
      "alignItems": "center",
      "width": "auto",
      "height": "auto"
    }
  },
  "vertical-start": {
    "name": "顶部垂直布局",
    "description": "从顶部开始的垂直布局",
    "defaultStyle": {
      "direction": "column",
      "justifyContent": "flex-start",
      "alignItems": "center",
      "width": "auto",
      "height": "auto"
    }
  },
  "vertical-stretch": {
    "name": "拉伸垂直布局",
    "description": "垂直方向两端对齐的布局",
    "defaultStyle": {
      "direction": "column",
      "justifyContent": "space-between",
      "alignItems": "stretch",
      "width": "auto",
      "height": "auto"
    }
  },
  "horizontal-centered": {
    "name": "居中水平布局",
    "description": "水平方向的居中布局",
    "defaultStyle": {
      "direction": "row",
      "justifyContent": "center",
      "alignItems": "center",
      "width": "auto",
      "height": "auto"
    }
  },
  "horizontal-between": {
    "name": "水平两端对齐",
    "description": "水平方向两端对齐的布局",
    "defaultStyle": {
      "direction": "row",
      "justifyContent": "space-between",
      "alignItems": "center",
      "width": "auto",
      "height": "auto"
    }
  },
  "grid-1x2": {
    "name": "1x2网格布局",
    "description": "1行2列的网格布局",
    "defaultStyle": {
      "display": "grid",
      "gridTemplateColumns": "repeat(2, 1fr)",
      "gridTemplateRows": "auto",
      "gap": "{gap.base}"
    }
  },
  "grid-1x3": {
    "name": "1x3网格布局",
    "description": "1行3列的网格布局",
    "defaultStyle": {
      "display": "grid",
      "gridTemplateColumns": "repeat(3, 1fr)",
      "gridTemplateRows": "auto",
      "gap": "{gap.base}"
    }
  },
  "grid-2x2": {
    "name": "2x2网格布局",
    "description": "2行2列的网格布局",
    "defaultStyle": {
      "display": "grid",
      "gridTemplateColumns": "repeat(2, 1fr)",
      "gridTemplateRows": "repeat(2, auto)",
      "gap": "{gap.base}"
    }
  },
  "grid-2x3": {
    "name": "2x3网格布局",
    "description": "2行3列的网格布局",
    "defaultStyle": {
      "display": "grid",
      "gridTemplateColumns": "repeat(3, 1fr)",
      "gridTemplateRows": "repeat(2, auto)",
      "gap": "{gap.base}"
    }
  },
  "grid-3x3": {
    "name": "3x3网格布局",
    "description": "3行3列的网格布局",
    "defaultStyle": {
      "display": "grid",
      "gridTemplateColumns": "repeat(3, 1fr)",
      "gridTemplateRows": "repeat(3, auto)",
      "gap": "{gap.base}"
    }
  },
  "none": {
    "name": "无布局",
    "description": "适用于文本等不需要布局方向的元素",
    "defaultStyle": {
      "direction": "none",
      "display": "block"
    }
  }
} 