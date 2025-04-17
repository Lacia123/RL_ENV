export default {
  "default": {
    "name": "默认容器",
    "description": "标准容器样式",
    "defaultStyle": {
      "backgroundColor": "transparent",
      "borderWidth": "{borderWidth.none}",
      "borderRadius": "{borderRadius.none}"
    }
  },
  "card": {
    "name": "卡片容器",
    "description": "卡片式容器，有阴影和圆角",
    "defaultStyle": {
      "backgroundColor": "{color.neutral.white}",
      "borderWidth": "{borderWidth.none}",
      "borderRadius": "{borderRadius.medium}",
      "boxShadow": "{material.card}"
    }
  },
  "panel": {
    "name": "面板容器",
    "description": "带边框的面板",
    "defaultStyle": {
      "backgroundColor": "{color.neutral.white}",
      "borderWidth": "{borderWidth.narrow}",
      "borderColor": "{color.neutral.light}",
      "borderRadius": "{borderRadius.medium}"
    }
  },
  "well": {
    "name": "凹陷容器",
    "description": "凹陷效果的容器",
    "defaultStyle": {
      "backgroundColor": "{color.neutral.lighter}",
      "borderWidth": "{borderWidth.none}",
      "borderRadius": "{borderRadius.medium}"
    }
  }
} 