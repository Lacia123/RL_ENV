import tokens from './token';
import presets from './preset';

// 通用样式属性 - 所有组件共享的基础样式
export const commonStyleProps = {
  // 布局方向
  direction: 'column', // column | row | none
  
  // 对齐方式
  justifyContent: 'flex-start', // flex-start | center | flex-end | space-between | space-around | space-evenly
  alignItems: 'flex-start',     // flex-start | center | flex-end | stretch
  
  // 尺寸模式
  primaryAxisSizingMode: 'auto', // fixed | auto | fix-content | responsive
  counterAxisSizingMode: 'auto', // fixed | auto | fix-content
  
  // 尺寸属性
  width: 'auto',      // 数值 | 'auto' | 'fix-content'
  height: 'auto',     // 数值 | 'auto' | 'fix-content'
  minWidth: null,     // 数值 | null
  minHeight: null,    // 数值 | null
  maxWidth: null,     // 数值 | null
  maxHeight: null,    // 数值 | null
  grow: 0,            // 伸展因子
  
  // 间距
  gap: 0,             // 元素间距
  
  // 外边距
  marginTop: 0,
  marginRight: 0,
  marginBottom: 0,
  marginLeft: 0,
  
  // 内边距
  paddingTop: 0,
  paddingRight: 0,
  paddingBottom: 0,
  paddingLeft: 0,
  
  // 边框
  borderRadius: 0,    // 圆角
  borderWidth: 0,     // 边框宽度
  borderColor: null,  // 边框颜色
  
  // 其他通用样式
  overflow: 'visible', // visible | hidden | auto | scroll
  boxShadow: 'none',   // 阴影
  opacity: 1,          // 透明度
  backgroundColor: null // 背景色
};

// 八要素完整定义
export const elementDefinitions = {
  // 容器组件定义
  container: {
    type: 'container',
    style: {
      ...commonStyleProps,
      // 容器特有样式可在此覆盖
    },
    children: [], // 子元素数组
    presets: {
      // 容器预设，可基于需求扩展
      default: {
        type: 'container',
        defaultStyle: {
          direction: 'column',
          gap: tokens.gap.base,
          padding: tokens.padding.base
        }
      },
      row: {
        type: 'container',
        defaultStyle: {
          direction: 'row',
          gap: tokens.gap.base,
          padding: tokens.padding.base
        }
      },
      card: {
        type: 'container',
        defaultStyle: {
          direction: 'column',
          gap: tokens.gap.base,
          padding: tokens.padding.loose,
          borderRadius: tokens.borderRadius.medium,
          boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
          backgroundColor: '#FFFFFF'
        }
      }
    }
  },
  
  // 文本组件定义
  text: {
    type: 'text',
    style: {
      ...commonStyleProps,
      preset: 'body',          // h1 | h2 | h3 | body | caption | link
      align: 'inherit',        // left | center | right | justify | inherit
      wordBreak: 'break-all',  // normal | break-all | keep-all | break-word
      fontSize: null,          // 可覆盖预设字号
      fontWeight: null,        // normal | bold | 数值
      color: null,             // 文本颜色
      lineHeight: null,        // 行高
      letterSpacing: null      // 字间距
    },
    content: '默认文本',        // 文本内容
    presets: presets.text      // 从现有预设导入
  },
  
  // 输入框组件定义
  input: {
    type: 'input',
    style: {
      ...commonStyleProps,
      preset: 'normal',        // normal | fixedheight | flexibleheight
      fontSize: 'xl',          // 字体大小
      borderRadius: tokens.borderRadius.medium,  // 输入框圆角
      borderWidth: tokens.borderWidth.narrow,    // 输入框边框
      borderColor: 'rgba(0,0,0,0.2)',           // 边框颜色
      backgroundColor: '#FFFFFF'                 // 背景色
    },
    content: {
      placeholder: '默认文本',
      field: '',               // 字段名
      value: '',               // 当前值
      type: 'text'             // text | password | number | email | etc.
    },
    presets: presets.input     // 从现有预设导入
  },
  
  // 按钮组件定义
  button: {
    type: 'button',
    style: {
      ...commonStyleProps,
      preset: 'normal',        // normal | iconButton | iconTextButton
      minWidth: 176,           // 最小宽度
      minHeight: 56,           // 最小高度
      borderRadius: tokens.borderRadius.medium,  // 按钮圆角
      backgroundColor: '#40A9FF',               // 按钮背景色
      hoverColor: '#1890FF',                    // 悬停颜色
      activeColor: '#096DD9',                   // 激活颜色
      justifyContent: 'center',
      alignItems: 'center'
    },
    content: {
      text: '按钮',            // 按钮文本
      icon: null,              // 图标名称
      fontSize: tokens.font.size.medium,  // 文本大小
      iconPosition: 'left'     // left | right
    },
    action: {
      type: 'submit',          // submit | link | function
      target: null             // 目标URL或函数名
    },
    presets: presets.button    // 从现有预设导入
  },
  
  // 图标组件定义
  icon: {
    type: 'icon',
    style: {
      ...commonStyleProps,
      preset: 'line',          // line | 其他预设类型
      width: 24,               // 图标宽度
      height: 24,              // 图标高度
      color: '#40A9FF'         // 图标颜色
    },
    content: {
      icon: 'send',            // 图标名称
      color: null              // 可覆盖style中的颜色
    },
    presets: presets.icon      // 从现有预设导入
  },
  
  // 背景组件定义
  background: {
    type: 'background',
    style: {
      ...commonStyleProps,
      preset: 'default',       // 预设类型
      overflow: 'hidden'       // 溢出处理
    },
    content: {
      type: 'img',             // img | color | gradient
      src: '',                 // 图片链接
      state: 'default',        // default | loaded | error
      fit: 'cover'             // cover | contain | fill | none
    },
    presets: presets.background // 从现有预设导入
  },
  
  // 图片组件定义
  image: {
    type: 'image',
    style: {
      ...commonStyleProps,
      borderRadius: 0,         // 图片圆角
      objectFit: 'cover'       // cover | contain | fill | none | scale-down
    },
    content: {
      src: '',                 // 图片链接
      alt: '',                 // 替代文本
      state: 'default'         // default | loaded | error
    },
    presets: {
      // 图片预设，可基于需求扩展
      default: {
        type: 'image',
        defaultStyle: {
          direction: 'none',
          objectFit: 'cover'
        }
      },
      rounded: {
        type: 'image',
        defaultStyle: {
          direction: 'none',
          objectFit: 'cover',
          borderRadius: tokens.borderRadius.medium
        }
      },
      circle: {
        type: 'image',
        defaultStyle: {
          direction: 'none',
          objectFit: 'cover',
          borderRadius: tokens.borderRadius.full
        }
      }
    }
  },
  
  // 分割线组件定义
  divider: {
    type: 'divider',
    style: {
      ...commonStyleProps,
      direction: 'horizontal', // horizontal | vertical
      thickness: 1,            // 线条粗细
      color: 'rgba(0,0,0,0.1)',// 线条颜色
      style: 'solid'           // solid | dashed | dotted
    },
    presets: {
      // 分割线预设，可基于需求扩展
      horizontal: {
        type: 'divider',
        defaultStyle: {
          direction: 'horizontal',
          thickness: tokens.borderWidth.narrow,
          style: 'solid'
        }
      },
      vertical: {
        type: 'divider',
        defaultStyle: {
          direction: 'vertical',
          thickness: tokens.borderWidth.narrow,
          style: 'solid'
        }
      },
      dashed: {
        type: 'divider',
        defaultStyle: {
          direction: 'horizontal',
          thickness: tokens.borderWidth.narrow,
          style: 'dashed'
        }
      }
    }
  }
};

// 预设系统定义
export const themeSystem = {
  // 主题变量
  theme: {
    colors: {
      brand: {
        1: '#E6F7FF',
        2: '#BAE7FF',
        3: '#91D5FF',
        4: '#69C0FF',
        5: '#40A9FF',
        6: '#1890FF',
        7: '#096DD9',
        8: '#0050B3',
        9: '#003A8C',
        10: '#002766'
      },
      black: {
        10: 'rgba(0,0,0,0.1)',
        20: 'rgba(0,0,0,0.2)',
        50: 'rgba(0,0,0,0.5)',
        80: 'rgba(0,0,0,0.8)',
        100: '#000000'
      },
      white: '#FFFFFF',
      grey: {
        1: '#FAFAFA',
        2: '#F5F5F5',
        3: '#E8E8E8',
        4: '#D9D9D9',
        5: '#BFBFBF',
        6: '#8C8C8C',
        7: '#595959',
        8: '#262626',
        9: '#141414',
        10: '#000000'
      },
      success: '#52C41A',
      warning: '#FAAD14',
      error: '#F5222D',
      info: '#1890FF'
    },
    shadow: {
      small: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      medium: '0px 4px 8px rgba(0, 0, 0, 0.1)',
      large: '0px 8px 16px rgba(0, 0, 0, 0.1)',
      inner: 'inset 0px 2px 4px rgba(0, 0, 0, 0.05)'
    },
    // 复用现有token中的字体设置
    font: tokens.font,
    // 复用现有token中的尺寸设置
    dimension: {
      borderRadius: tokens.borderRadius,
      borderWidth: tokens.borderWidth,
      spacing: {
        gap: tokens.gap,
        margin: tokens.margin,
        padding: tokens.padding
      }
    }
  }
};

// 工具函数：根据预设合并样式
export const applyPreset = (element, presetName) => {
  const { type, style } = element;
  const elementDef = elementDefinitions[type];
  
  if (!elementDef || !elementDef.presets || !elementDef.presets[presetName]) {
    console.warn(`预设 ${presetName} 不存在于组件类型 ${type} 中`);
    return element;
  }
  
  const preset = elementDef.presets[presetName];
  
  return {
    ...element,
    style: {
      ...style,
      ...preset.defaultStyle
    }
  };
};

// 工具函数：解析主题变量
export const resolveThemeValue = (value, theme = themeSystem.theme) => {
  if (typeof value !== 'string' || !value.startsWith('{') || !value.endsWith('}')) {
    return value;
  }
  
  const path = value.slice(1, -1).split('.');
  let result = theme;
  
  for (const key of path) {
    if (result === undefined || result === null) {
      return value; // 未找到路径，返回原始值
    }
    result = result[key];
  }
  
  return result !== undefined ? result : value;
};

export default {
  commonStyleProps,
  elementDefinitions,
  themeSystem,
  applyPreset,
  resolveThemeValue
};