export default {
  "auto": {
    "name": "自动尺寸",
    "description": "宽高自动适应内容",
    "defaultStyle": {
      "width": "auto",
      "height": "auto",
      "flexGrow": 0,
      "flexShrink": 1
    }
  },
  "fill-width": {
    "name": "填充宽度",
    "description": "填充父容器宽度",
    "defaultStyle": {
      "width": "100%",
      "height": "auto",
      "flexGrow": 1,
      "flexShrink": 0
    }
  },
  "fixed-small": {
    "name": "小尺寸",
    "description": "固定小尺寸元素",
    "defaultStyle": {
      "width": "120px",
      "minWidth": "120px",
      "flexGrow": 0,
      "flexShrink": 0
    }
  },
  "fixed-medium": {
    "name": "中等尺寸",
    "description": "固定中等尺寸元素",
    "defaultStyle": {
      "width": "240px",
      "minWidth": "240px",
      "flexGrow": 0,
      "flexShrink": 0
    }
  },
  "fixed-large": {
    "name": "大尺寸",
    "description": "固定大尺寸元素",
    "defaultStyle": {
      "width": "360px",
      "minWidth": "360px",
      "flexGrow": 0,
      "flexShrink": 0
    }
  },
  "responsive-small": {
    "name": "响应式小比例",
    "description": "占据父容器的25%",
    "defaultStyle": {
      "width": "25%",
      "flexGrow": 0,
      "flexShrink": 1
    }
  },
  "responsive-medium": {
    "name": "响应式中等比例",
    "description": "占据父容器的50%",
    "defaultStyle": {
      "width": "50%",
      "flexGrow": 0,
      "flexShrink": 1
    }
  },
  "responsive-large": {
    "name": "响应式大比例",
    "description": "占据父容器的75%",
    "defaultStyle": {
      "width": "75%",
      "flexGrow": 0,
      "flexShrink": 1
    }
  }
} 