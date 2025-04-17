export default {
  "primary": {
    "name": "主色调",
    "description": "品牌主色调样式",
    "defaultStyle": {
      "backgroundColor": "{color.primary.base}",
      "color": "{color.primary.contrast}",
      "borderColor": "{color.primary.dark}",
      "boxShadow": "{material.main}"
    }
  },
  "secondary": {
    "name": "次色调",
    "description": "品牌次色调样式",
    "defaultStyle": {
      "backgroundColor": "{color.secondary.base}",
      "color": "{color.secondary.contrast}",
      "borderColor": "{color.secondary.dark}",
      "boxShadow": "{material.light}"
    }
  },
  "neutral": {
    "name": "中性色",
    "description": "适用于大多数界面元素",
    "defaultStyle": {
      "backgroundColor": "{color.neutral.light}",
      "color": "{color.neutral.dark}",
      "borderColor": "{color.neutral.base}",
      "boxShadow": "none"
    }
  },
  "elevated": {
    "name": "浮起",
    "description": "有明显阴影的浮起效果",
    "defaultStyle": {
      "backgroundColor": "{color.neutral.white}",
      "boxShadow": "{material.elevated}",
      "borderRadius": "{borderRadius.medium}"
    }
  },
  "outlined": {
    "name": "描边",
    "description": "有边框无背景的样式",
    "defaultStyle": {
      "backgroundColor": "transparent",
      "borderWidth": "{borderWidth.base}",
      "borderColor": "{color.neutral.base}",
      "borderRadius": "{borderRadius.medium}"
    }
  },
  "rounded": {
    "name": "圆角",
    "description": "显著圆角效果",
    "defaultStyle": {
      "borderRadius": "{borderRadius.xl}"
    }
  }
}