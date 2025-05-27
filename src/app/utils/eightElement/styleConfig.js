/**
 * styleConfig.js
 * 八要素结构的样式配置系统
 * 提供了对不同元素类型样式的完整配置
 */

// 布局常量定义
export const LAYOUT_CONSTANTS = {
  DISPLAY: {
    FLEX: "{layout.state.display.flex}"
  },
  DIRECTION: {
    HORIZONTAL: "{layout.direction.HORIZONTAL}",
    VERTICAL: "{layout.direction.VERTICAL}"
  },
  WRAP: {
    NO_WRAP: "{layout.wrap.NO_WRAP}"
  },
  SIZING: {
    FIXED: "{layout.sizing.FIXED}",
    AUTO: "{layout.sizing.AUTO}"
  },
  ALIGN: {
    X: {
      MIN: "{layout.align.x.MIN}",
      CENTER: "{layout.align.x.CENTER}"
    },
    Y: {
      ITEMS: {
        MIN: "{layout.align.y.items.MIN}",
        CENTER: "{layout.align.y.items.CENTER}"
      },
      SELF: {
        INHERIT: "{layout.align.y.self.INHERIT}"
      }
    }
  },
  GROW: {
    ZERO: "{layout.grow.0}"
  }
};

// 颜色常量定义
export const COLOR_CONSTANTS = {
  PRIMARY: {
    // SECONDARY1: "" // tODO, 
    BRAND3: "{color.primary.brand3}",
    BRAND4: "{color.primary.brand4}",
    BRAND5: "{color.primary.brand5}", // 按钮
    BRAND6: "{color.primary.brand6}"
  },
  BASIC: {
    BRAND: {
      5: "{color.basic.brand.5}",
      4: "{color.basic.brand.4}",
      6: "{color.basic.brand.6}",
      7: "{color.basic.brand.7}"
    },
    GREY: {
      2: "{color.basic.grey.2}"
    },
    OPACITY: {
      WHITE: {
        100: "{color.basic.opacity.white.100}",
        32: "{color.basic.opacity.white.32}"
      },
      BLACK: {
        100: "{color.basic.opacity.black.100}",
        20: "{color.basic.opacity.black.20}"
      }
    },
    LIGHT_BLUE: {
      5: "{color.basic.light-blue.5}",
      4: "{color.basic.light-blue.4}",
      7: "{color.basic.light-blue.7}"
    },
    VIOLET: {
      6: "{color.basic.violet.6}"
    }
  },
  GRADIENT: {
    BLUE2YELLOW: "{color.gradient.gradient.blue2yellow}"
  }
};

// 维度常量定义
export const DIMENSION_CONSTANTS = {
  BORDER_RADIUS: {
    0: "{dimension.borderradius.0}",
    8: "{dimension.borderradius.8}",
    20: "{dimension.borderradius.20}",
    none: "{dimension.borderradius.none}",
    small: "{dimension.borderradius.small}",
    medium: "{dimension.borderradius.medium}",
    large: "{dimension.borderradius.large}",
    xl: "{dimension.borderradius.xl}",
    xxl: "{dimension.borderradius.xxl}",
    xxxl: "{dimension.borderradius.xxxl}"
  },
  BORDER_WIDTH: {
    none: "{dimension.borderwidth.none}",
    narrow: "{dimension.borderwidth.narrow}",
    base: "{dimension.borderwidth.base}",
    wide: "{dimension.borderwidth.wide}"
  },
  PADDING: {
    none: "{dimension.padding.none}",
    tight: "{dimension.padding.tight}",
    base: "{dimension.padding.base}",
    loose: "{dimension.padding.loose}",
    superloose: "{dimension.padding.superloose}",
    8: "{dimension.padding.8}"
  },
  GAP: {
    none: "{dimension.padding.none}",
    tight: "{dimension.padding.tight}",
    base: "{dimension.padding.base}",
    loose: "{dimension.padding.loose}",
    superloose: "{dimension.padding.superloose}",
    8: "{dimension.gap.8}",
    24: "{dimension.gap.24}"
  },
  MARGIN: {
    none: "{dimension.margin.none}",
    tight: "{dimension.margin.tight}",
    base: "{dimension.margin.base}",
    loose: "{dimension.margin.loose}",
    superloose: "{dimension.margin.superloose}",
  },
  BASIC: {
    0: "{dimension.basic.dimension.0}",
    72: "{dimension.basic.dimension.72}",
    1200: "{dimension.basic.dimension.1200}"
  }
};

// 字体常量定义
export const FONT_CONSTANTS = {
  SIZE: {
    SMALL: "{font.size.small}",
    MEDIUM: "{font.size.medium}",
    LARGE: "{font.size.large}",
    XL: "{font.size.xl}",
    XXL: "{font.size.xxl}"
  },
  WEIGHT: {
    NORMAL: "{font.fontweight.normal}",
    MEDIUM: "{font.fontweight.medium}",
    SEMIBOLD: "{font.fontweight.semibold}",
    BOLD: "{font.fontweight.bold}"
  }
};

/**
 * 默认样式配置
 * 配置所有元素类型的样式引用和值
 */
export const DEFAULT_STYLE_CONFIG = {
  // 布局元素配置
  layout: {
    // 根布局元素
    root: {
      "padding-top": DIMENSION_CONSTANTS.PADDING.base,
      "padding-bottom": DIMENSION_CONSTANTS.PADDING.base,
      "padding-left": DIMENSION_CONSTANTS.PADDING.loose,
      "padding-right": DIMENSION_CONSTANTS.PADDING.base,
      "margin-top": DIMENSION_CONSTANTS.MARGIN.base,
      "margin-bottom": DIMENSION_CONSTANTS.MARGIN.base,
      "margin-left": DIMENSION_CONSTANTS.MARGIN.base,
      "margin-right": DIMENSION_CONSTANTS.MARGIN.base,
      "border-width": DIMENSION_CONSTANTS.BORDER_WIDTH.base,
      "border-color": COLOR_CONSTANTS.BASIC.OPACITY.BLACK[20],
      "background": COLOR_CONSTANTS.BASIC.OPACITY.WHITE[100],
      "border-style": "solid",
      "border-radius": DIMENSION_CONSTANTS.BORDER_RADIUS.large,
      // "gap": DIMENSION_CONSTANTS.GAP.tight
    },
    // 内部布局元素
    inner: {
      "padding-top": DIMENSION_CONSTANTS.PADDING.tight,
      "padding-bottom": DIMENSION_CONSTANTS.PADDING.tight,
      // "padding-left": DIMENSION_CONSTANTS.PADDING.tight,
      // "padding-right": DIMENSION_CONSTANTS.PADDING.tight,
      "margin-top": DIMENSION_CONSTANTS.MARGIN.tight,
      "margin-bottom": DIMENSION_CONSTANTS.MARGIN.tight,
      // "margin-left": DIMENSION_CONSTANTS.MARGIN.tight,
      // "margin-right": DIMENSION_CONSTANTS.MARGIN.tight,
      // "border-width": DIMENSION_CONSTANTS.BORDER_WIDTH.none,
      "background-color": "none",
      // "gap": DIMENSION_CONSTANTS.GAP.tight
    }
  },
  
  // 文本元素配置
  text: {
    // 正文文本
    normal: {
      "textColor": COLOR_CONSTANTS.BASIC.OPACITY.BLACK[100],
      "fill": "none",
      "fontSizes": FONT_CONSTANTS.SIZE.MEDIUM
    },
    // 标题文本（h1 - h6）
    h1: {
      "textColor": COLOR_CONSTANTS.BASIC.OPACITY.BLACK[100],
      "fill": "none",
      "fontSizes": FONT_CONSTANTS.SIZE.XXL,
      "fontWeight": FONT_CONSTANTS.WEIGHT.BOLD,
    },
    h2: {
      "textColor": COLOR_CONSTANTS.BASIC.OPACITY.BLACK[100],
      "fill": "none",
      "fontSizes": FONT_CONSTANTS.SIZE.XL,
      "fontWeight": FONT_CONSTANTS.WEIGHT.BOLD
    },
    h3: {
      "textColor": COLOR_CONSTANTS.BASIC.OPACITY.BLACK[100],
      "fill": "none",
      "fontSizes": FONT_CONSTANTS.SIZE.LARGE,
      "fontWeight": FONT_CONSTANTS.WEIGHT.SEMIBOLD
    },
    h4: {
      "textColor": COLOR_CONSTANTS.BASIC.OPACITY.BLACK[100],
      "fill": "none",
      "fontSizes": FONT_CONSTANTS.SIZE.MEDIUM,
      "fontWeight": FONT_CONSTANTS.WEIGHT.SEMIBOLD
    },
    h5: {
      "textColor": COLOR_CONSTANTS.BASIC.OPACITY.BLACK[100],
      "fill": "none",
      "fontSizes": FONT_CONSTANTS.SIZE.MEDIUM,
      "fontWeight": FONT_CONSTANTS.WEIGHT.MEDIUM
    },
    h6: {
      "textColor": COLOR_CONSTANTS.BASIC.OPACITY.BLACK[100],
      "fill": "none",
      "fontSizes": FONT_CONSTANTS.SIZE.MEDIUM,
      "fontWeight": FONT_CONSTANTS.WEIGHT.MEDIUM
    },
    // 超链接文本
    hyperlink: {
      "textColor": COLOR_CONSTANTS.BASIC.LIGHT_BLUE[5],
      "fill": "none",
      "fontSizes": FONT_CONSTANTS.SIZE.LARGE
    }
  },
  
  // 按钮元素配置
  button: {
    primary: {
      "minWidth": DIMENSION_CONSTANTS.BASIC[0],
      "minHeight": DIMENSION_CONSTANTS.BASIC[0],
      "paddingLeft": DIMENSION_CONSTANTS.PADDING.base,
      "paddingRight": DIMENSION_CONSTANTS.PADDING.base,
      // "spacing": DIMENSION_CONSTANTS.PADDING.base,
      "itemSpacing": DIMENSION_CONSTANTS.GAP.base,
      "fill": COLOR_CONSTANTS.PRIMARY.BRAND5,
      "fontColor": COLOR_CONSTANTS.BASIC.OPACITY.WHITE[100],
      "fontSizes": FONT_CONSTANTS.SIZE.LARGE,
      "borderRadius": DIMENSION_CONSTANTS.BORDER_RADIUS[8],
      "borderColor": COLOR_CONSTANTS.BASIC.OPACITY.WHITE[32],
      "borderWidth": DIMENSION_CONSTANTS.BORDER_WIDTH.narrow,
      "boxShadow": "none"
    },
    secondary: {
      "minWidth": DIMENSION_CONSTANTS.BASIC[0],
      "minHeight": DIMENSION_CONSTANTS.BASIC[0],
      "spacing": DIMENSION_CONSTANTS.PADDING.base,
      "itemSpacing": DIMENSION_CONSTANTS.GAP.base,
      "fill": COLOR_CONSTANTS.BASIC.BRAND[5],
      "fontColor": COLOR_CONSTANTS.BASIC.OPACITY.WHITE[100],
      "fontSizes": FONT_CONSTANTS.SIZE.XL,
      "borderRadius": DIMENSION_CONSTANTS.BORDER_RADIUS[8],
      "borderColor": COLOR_CONSTANTS.BASIC.OPACITY.WHITE[32],
      "borderWidth": DIMENSION_CONSTANTS.BORDER_WIDTH.narrow,
      "boxShadow": "none"
    },
    link: {
      "minWidth": DIMENSION_CONSTANTS.BASIC[0],
      "minHeight": DIMENSION_CONSTANTS.BASIC[0],
      "spacing": DIMENSION_CONSTANTS.PADDING.tight,
      "itemSpacing": DIMENSION_CONSTANTS.GAP.tight,
      "fill": "none",
      "fontColor": COLOR_CONSTANTS.BASIC.LIGHT_BLUE[5],
      "fontSizes": FONT_CONSTANTS.SIZE.LARGE,
      "borderRadius": DIMENSION_CONSTANTS.BORDER_RADIUS.none,
      "borderColor": "none",
      "borderWidth": DIMENSION_CONSTANTS.BORDER_WIDTH.none,
      "boxShadow": "none"
    }
  },
  
  // 背景/图片元素配置
  image: {
    normal: {
      "borderColor": COLOR_CONSTANTS.BASIC.OPACITY.BLACK[20],
      "borderRadius": DIMENSION_CONSTANTS.BORDER_RADIUS.none,
      "borderWidth": DIMENSION_CONSTANTS.BORDER_WIDTH.none,
      "boxShadow": "none"
    },
    rounded: {
      "borderColor": COLOR_CONSTANTS.BASIC.OPACITY.BLACK[20],
      "borderRadius": DIMENSION_CONSTANTS.BORDER_RADIUS.medium,
      "borderWidth": DIMENSION_CONSTANTS.BORDER_WIDTH.none,
      "boxShadow": "none"
    },
    framed: {
      "borderColor": COLOR_CONSTANTS.BASIC.OPACITY.BLACK[20],
      "borderRadius": DIMENSION_CONSTANTS.BORDER_RADIUS.small,
      "borderWidth": DIMENSION_CONSTANTS.BORDER_WIDTH.narrow,
      "boxShadow": "none"
    }
  }
};

/**
 * 当前活动的样式配置，默认使用默认配置
 */
let activeStyleConfig = { ...DEFAULT_STYLE_CONFIG };

/**
 * 设置活动样式配置
 * @param {Object} config - 新的样式配置对象
 */
export function setStyleConfig(config) {
  // 深度合并配置
  activeStyleConfig = deepMerge(DEFAULT_STYLE_CONFIG, config);
}

/**
 * 重置样式配置为默认值
 */
export function resetStyleConfig() {
  activeStyleConfig = { ...DEFAULT_STYLE_CONFIG };
}

/**
 * 获取特定元素类型的样式配置
 * @param {string} elementType - 元素类型 (layout, text, button, image)
 * @param {string} variant - 变体名称
 * @returns {Object} 样式配置对象
 */
export function getElementStyleConfig(elementType, variant = 'normal') {
  if (!activeStyleConfig[elementType]) {
    console.warn(`未找到元素类型 "${elementType}" 的样式配置`);
    return {};
  }
  
  if (!activeStyleConfig[elementType][variant]) {
    console.warn(`未找到元素类型 "${elementType}" 的变体 "${variant}"`);
    return activeStyleConfig[elementType]['normal'] || {};
  }
  
  return activeStyleConfig[elementType][variant];
}

/**
 * 辅助函数：深度合并对象
 * @param {Object} target - 目标对象
 * @param {Object} source - 源对象
 * @returns {Object} 合并后的对象
 */
function deepMerge(target, source) {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          output[key] = source[key];
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        output[key] = source[key];
      }
    });
  }
  
  return output;
}

/**
 * 辅助函数：检查值是否为对象
 * @param {*} item - 要检查的值
 * @returns {boolean} 是否为对象
 */
function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

export default {
  LAYOUT_CONSTANTS,
  COLOR_CONSTANTS,
  DIMENSION_CONSTANTS,
  FONT_CONSTANTS,
  DEFAULT_STYLE_CONFIG,
  setStyleConfig,
  resetStyleConfig,
  getElementStyleConfig
}; 