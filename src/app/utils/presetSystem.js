'use client';

/**
 * 预设系统 - 支持多类别预设组合与完全基于设计令牌的配置
 * 
 * 该系统将预设分为不同类别:
 * - Typography (排版): 控制字体大小、粗细、行高等文本属性
 * - Appearance (外观): 控制颜色、边框、圆角、阴影等视觉属性
 * - Spacing (间距): 控制内外边距、间隙等空间属性
 * - Layout (布局): 控制对齐方式、尺寸调整模式等布局属性
 * 
 * 每个元素可以同时应用多个不同类别的预设
 */

// 尺寸预设 - 控制元素的大小比例
const sizePresets = {
  'auto': {
    name: '自动尺寸',
    description: '宽高自动适应内容',
    defaultStyle: {
      width: 'auto',
      height: 'auto',
      flexGrow: 0,
      flexShrink: 1
    }
  },
  'fill-width': {
    name: '填充宽度',
    description: '填充父容器宽度',
    defaultStyle: {
      width: '100%',
      height: 'auto',
      flexGrow: 1,
      flexShrink: 0
    }
  },
  'fixed-small': {
    name: '小尺寸',
    description: '固定小尺寸元素',
    defaultStyle: {
      width: '120px',
      minWidth: '120px',
      flexGrow: 0,
      flexShrink: 0
    }
  },
  'fixed-medium': {
    name: '中等尺寸',
    description: '固定中等尺寸元素',
    defaultStyle: {
      width: '240px',
      minWidth: '240px',
      flexGrow: 0,
      flexShrink: 0
    }
  },
  'fixed-large': {
    name: '大尺寸',
    description: '固定大尺寸元素',
    defaultStyle: {
      width: '360px',
      minWidth: '360px',
      flexGrow: 0,
      flexShrink: 0
    }
  },
  'responsive-small': {
    name: '响应式小比例',
    description: '占据父容器的25%',
    defaultStyle: {
      width: '25%',
      flexGrow: 0,
      flexShrink: 1
    }
  },
  'responsive-medium': {
    name: '响应式中等比例',
    description: '占据父容器的50%',
    defaultStyle: {
      width: '50%',
      flexGrow: 0,
      flexShrink: 1
    }
  },
  'responsive-large': {
    name: '响应式大比例',
    description: '占据父容器的75%',
    defaultStyle: {
      width: '75%',
      flexGrow: 0,
      flexShrink: 1
    }
  }
};

// 元素自身对齐预设 - 控制元素在父容器中如何对齐
const selfAlignPresets = {
  'self-start': {
    name: '顶部/左侧对齐',
    description: '元素自身对齐于父容器起始位置',
    defaultStyle: {
      alignSelf: 'flex-start',
      justifySelf: 'flex-start'
    }
  },
  'self-center': {
    name: '居中对齐',
    description: '元素自身居中对齐',
    defaultStyle: {
      alignSelf: 'center',
      justifySelf: 'center'
    }
  },
  'self-end': {
    name: '底部/右侧对齐',
    description: '元素自身对齐于父容器结束位置',
    defaultStyle: {
      alignSelf: 'flex-end',
      justifySelf: 'flex-end'
    }
  },
  'self-stretch': {
    name: '自身拉伸',
    description: '元素自身拉伸填充父容器',
    defaultStyle: {
      alignSelf: 'stretch',
      justifySelf: 'stretch'
    }
  }
};

// Flex比例预设 - 控制元素在Flex布局中的伸缩比例
const flexRatioPresets = {
  'no-grow': {
    name: '不伸展',
    description: '元素不会伸展占据额外空间',
    defaultStyle: {
      flexGrow: 0,
      flexShrink: 1,
      flexBasis: 'auto'
    }
  },
  'grow-1': {
    name: '等比伸展',
    description: '元素将平均分配额外空间',
    defaultStyle: {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: '0%'
    }
  },
  'grow-2': {
    name: '双倍伸展',
    description: '元素将获得2倍的额外空间',
    defaultStyle: {
      flexGrow: 2,
      flexShrink: 1,
      flexBasis: '0%'
    }
  },
  'grow-3': {
    name: '三倍伸展',
    description: '元素将获得3倍的额外空间',
    defaultStyle: {
      flexGrow: 3,
      flexShrink: 1,
      flexBasis: '0%'
    }
  },
  'no-shrink': {
    name: '不收缩',
    description: '元素不会收缩',
    defaultStyle: {
      flexGrow: 0,
      flexShrink: 0,
      flexBasis: 'auto'
    }
  }
};

// 图片比例预设 - 控制图片的大小和纵横比
const imageProportionPresets = {
  'original': {
    name: '原始尺寸',
    description: '保持图片原始尺寸',
    defaultStyle: {
      width: 'auto',
      height: 'auto',
      maxWidth: '100%',
      objectFit: 'none'
    }
  },
  'contain': {
    name: '完整适应',
    description: '保持比例完整显示图片',
    defaultStyle: {
      width: '100%',
      height: '100%',
      objectFit: 'contain'
    }
  },
  'cover': {
    name: '填充覆盖',
    description: '填充容器可能裁剪图片',
    defaultStyle: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  },
  'square': {
    name: '正方形',
    description: '强制图片为正方形',
    defaultStyle: {
      width: '100%',
      height: '0',
      paddingBottom: '100%',
      objectFit: 'cover',
      position: 'relative'
    }
  },
  '16-9': {
    name: '16:9比例',
    description: '宽屏比例',
    defaultStyle: {
      width: '100%',
      height: '0',
      paddingBottom: '56.25%',
      objectFit: 'cover',
      position: 'relative'
    }
  },
  '4-3': {
    name: '4:3比例',
    description: '标准屏幕比例',
    defaultStyle: {
      width: '100%',
      height: '0',
      paddingBottom: '75%',
      objectFit: 'cover',
      position: 'relative'
    }
  }
};

// 按钮尺寸预设 - 不同大小的按钮
const buttonSizePresets = {
  'btn-small': {
    name: '小按钮',
    description: '小号按钮尺寸',
    defaultStyle: {
      paddingTop: '{padding.tight}',
      paddingRight: '{padding.base}',
      paddingBottom: '{padding.tight}',
      paddingLeft: '{padding.base}',
      fontSize: '{font.size.small}',
      minHeight: '32px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: 'auto'
    }
  },
  'btn-medium': {
    name: '中按钮',
    description: '中号按钮尺寸',
    defaultStyle: {
      paddingTop: '{padding.semitight}',
      paddingRight: '{padding.semiloose}',
      paddingBottom: '{padding.semitight}',
      paddingLeft: '{padding.semiloose}',
      fontSize: '{font.size.medium}',
      minHeight: '40px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: 'auto'
    }
  },
  'btn-large': {
    name: '大按钮',
    description: '大号按钮尺寸',
    defaultStyle: {
      paddingTop: '{padding.base}',
      paddingRight: '{padding.loose}',
      paddingBottom: '{padding.base}',
      paddingLeft: '{padding.loose}',
      fontSize: '{font.size.large}',
      minHeight: '48px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: 'auto'
    }
  },
  'btn-full-width': {
    name: '全宽按钮',
    description: '占据父容器全部宽度的按钮',
    defaultStyle: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }
  }
};

// 布局预设 - 适用于容器元素的布局方式
const layoutPresets = {
  'vertical-centered': {
    name: '居中垂直布局',
    description: '垂直方向的居中布局',
    defaultStyle: {
      direction: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: 'auto',
      height: 'auto'
    }
  },
  'vertical-start': {
    name: '顶部垂直布局',
    description: '从顶部开始的垂直布局',
    defaultStyle: {
      direction: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: 'auto',
      height: 'auto'
    }
  },
  'vertical-stretch': {
    name: '拉伸垂直布局',
    description: '垂直方向两端对齐的布局',
    defaultStyle: {
      direction: 'column',
      justifyContent: 'space-between',
      alignItems: 'stretch',
      width: 'auto',
      height: 'auto'
    }
  },
  'horizontal-centered': {
    name: '居中水平布局',
    description: '水平方向的居中布局',
    defaultStyle: {
      direction: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width: 'auto',
      height: 'auto'
    }
  },
  'horizontal-between': {
    name: '水平两端对齐',
    description: '水平方向两端对齐的布局',
    defaultStyle: {
      direction: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: 'auto',
      height: 'auto'
    }
  },
  'grid-1x2': {
    name: '1x2网格布局',
    description: '1行2列的网格布局',
    defaultStyle: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gridTemplateRows: 'auto',
      gap: '{gap.base}'
    }
  },
  'grid-1x3': {
    name: '1x3网格布局',
    description: '1行3列的网格布局',
    defaultStyle: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridTemplateRows: 'auto',
      gap: '{gap.base}'
    }
  },
  'grid-2x2': {
    name: '2x2网格布局',
    description: '2行2列的网格布局',
    defaultStyle: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gridTemplateRows: 'repeat(2, auto)',
      gap: '{gap.base}'
    }
  },
  'grid-2x3': {
    name: '2x3网格布局',
    description: '2行3列的网格布局',
    defaultStyle: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridTemplateRows: 'repeat(2, auto)',
      gap: '{gap.base}'
    }
  },
  'grid-3x3': {
    name: '3x3网格布局',
    description: '3行3列的网格布局',
    defaultStyle: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gridTemplateRows: 'repeat(3, auto)',
      gap: '{gap.base}'
    }
  },
  'none': {
    name: '无布局',
    description: '适用于文本等不需要布局方向的元素',
    defaultStyle: {
      direction: 'none',
      display: 'block'
    }
  }
};

// 文本对齐预设
const textAlignPresets = {
  'center': {
    name: '居中对齐',
    description: '文本居中对齐',
    defaultStyle: {
      textAlign: 'center',
      align: 'center'
    }
  },
  'left': {
    name: '左对齐',
    description: '文本左对齐',
    defaultStyle: {
      textAlign: 'left',
      align: 'left'
    }
  },
  'right': {
    name: '右对齐',
    description: '文本右对齐',
    defaultStyle: {
      textAlign: 'right',
      align: 'right'
    }
  },
  'justify': {
    name: '两端对齐',
    description: '文本两端对齐',
    defaultStyle: {
      textAlign: 'justify',
      align: 'justify'
    }
  }
};

// 排版预设
const typographyPresets = {
  'h1': {
    name: '一级标题',
    description: '用于页面主标题',
    defaultStyle: {
      fontSize: '{font.size.xxxl}',
      fontWeight: '{font.weight.bold}',
      letterSpacing: '{font.letterSpacing.tight}',
      lineHeight: '{font.lineHeight.tight}'
    }
  },
  'h2': {
    name: '二级标题',
    description: '用于页面次级标题',
    defaultStyle: {
      fontSize: '{font.size.xxl}',
      fontWeight: '{font.weight.bold}',
      letterSpacing: '{font.letterSpacing.tight}',
      lineHeight: '{font.lineHeight.tight}'
    }
  },
  'h3': {
    name: '三级标题',
    description: '用于页面部分标题',
    defaultStyle: {
      fontSize: '{font.size.xl}',
      fontWeight: '{font.weight.semibold}',
      letterSpacing: '{font.letterSpacing.tight}',
      lineHeight: '{font.lineHeight.tight}'
    }
  },
  'body': {
    name: '正文',
    description: '用于主要文本内容',
    defaultStyle: {
      fontSize: '{font.size.medium}',
      fontWeight: '{font.weight.medium}',
      letterSpacing: '{font.letterSpacing.base}',
      lineHeight: '{font.lineHeight.base}'
    }
  },
  'small': {
    name: '小文本',
    description: '用于附注或辅助文本',
    defaultStyle: {
      fontSize: '{font.size.small}',
      fontWeight: '{font.weight.medium}',
      letterSpacing: '{font.letterSpacing.base}',
      lineHeight: '{font.lineHeight.loose}'
    }
  },
  'caption': {
    name: '说明文本',
    description: '用于图片说明或标注',
    defaultStyle: {
      fontSize: '{font.size.tiny}',
      fontWeight: '{font.weight.light}',
      letterSpacing: '{font.letterSpacing.wide}',
      lineHeight: '{font.lineHeight.tight}'
    }
  }
};

// 外观预设
const appearancePresets = {
  'primary': {
    name: '主色调',
    description: '品牌主色调样式',
    defaultStyle: {
      backgroundColor: '{color.primary.base}',
      color: '{color.primary.contrast}',
      borderColor: '{color.primary.dark}',
      boxShadow: '{material.main}'
    }
  },
  'secondary': {
    name: '次色调',
    description: '品牌次色调样式',
    defaultStyle: {
      backgroundColor: '{color.secondary.base}',
      color: '{color.secondary.contrast}',
      borderColor: '{color.secondary.dark}',
      boxShadow: '{material.light}'
    }
  },
  'neutral': {
    name: '中性色',
    description: '适用于大多数界面元素',
    defaultStyle: {
      backgroundColor: '{color.neutral.light}',
      color: '{color.neutral.dark}',
      borderColor: '{color.neutral.base}',
      boxShadow: 'none'
    }
  },
  'elevated': {
    name: '浮起',
    description: '有明显阴影的浮起效果',
    defaultStyle: {
      backgroundColor: '{color.neutral.white}',
      boxShadow: '{material.elevated}',
      borderRadius: '{borderRadius.medium}'
    }
  },
  'outlined': {
    name: '描边',
    description: '有边框无背景的样式',
    defaultStyle: {
      backgroundColor: 'transparent',
      borderWidth: '{borderWidth.base}',
      borderColor: '{color.neutral.base}',
      borderRadius: '{borderRadius.medium}'
    }
  },
  'rounded': {
    name: '圆角',
    description: '显著圆角效果',
    defaultStyle: {
      borderRadius: '{borderRadius.xl}'
    }
  }
};

// 间距预设
const spacingPresets = {
  'compact': {
    name: '紧凑',
    description: '适用于空间有限的区域',
    defaultStyle: {
      gap: '{gap.tight}',
      // 使用单独属性而非简写，避免样式冲突
      paddingTop: '{padding.tight}',
      paddingRight: '{padding.tight}',
      paddingBottom: '{padding.tight}',
      paddingLeft: '{padding.tight}',
      marginTop: '{margin.tight}',
      marginRight: '{margin.tight}',
      marginBottom: '{margin.tight}',
      marginLeft: '{margin.tight}'
    }
  },
  'comfortable': {
    name: '舒适',
    description: '标准间距，提供良好的可读性',
    defaultStyle: {
      gap: '{gap.base}',
      paddingTop: '{padding.base}',
      paddingRight: '{padding.base}',
      paddingBottom: '{padding.base}',
      paddingLeft: '{padding.base}',
      marginTop: '{margin.base}',
      marginRight: '{margin.base}',
      marginBottom: '{margin.base}',
      marginLeft: '{margin.base}'
    }
  },
  'spacious': {
    name: '宽敞',
    description: '更大的间距，提供丰富的留白',
    defaultStyle: {
      gap: '{gap.loose}',
      paddingTop: '{padding.loose}',
      paddingRight: '{padding.loose}',
      paddingBottom: '{padding.loose}',
      paddingLeft: '{padding.loose}',
      marginTop: '{margin.loose}',
      marginRight: '{margin.loose}',
      marginBottom: '{margin.loose}',
      marginLeft: '{margin.loose}'
    }
  },
  'asymmetric': {
    name: '非对称',
    description: '上下紧凑，左右宽敞',
    defaultStyle: {
      paddingTop: '{padding.tight}',
      paddingRight: '{padding.loose}',
      paddingBottom: '{padding.tight}',
      paddingLeft: '{padding.loose}',
      marginTop: '{margin.tight}',
      marginRight: '{margin.loose}',
      marginBottom: '{margin.tight}',
      marginLeft: '{margin.loose}'
    }
  }
};

// 各元素类型的默认组合预设
const elementPresets = {
  'text': {
    // 文本元素适合的预设
    selfAlign: selfAlignPresets,  // 元素自身对齐预设
    size: sizePresets,            // 尺寸预设
    textAlign: textAlignPresets,  // 文本对齐预设
    typography: typographyPresets, // 排版预设
    appearance: {
      'default': {
        name: '默认文本',
        description: '标准文本样式',
        defaultStyle: {
          color: '{color.neutral.dark}'
        }
      },
      'primary': {
        name: '主要文本',
        description: '突出显示的文本',
        defaultStyle: {
          color: '{color.primary.base}'
        }
      },
      'secondary': {
        name: '次要文本',
        description: '辅助文本样式',
        defaultStyle: {
          color: '{color.secondary.base}'
        }
      },
      'success': {
        name: '成功文本',
        description: '表示成功状态的文本',
        defaultStyle: {
          color: '{color.success.base}'
        }
      },
      'warning': {
        name: '警告文本',
        description: '表示警告状态的文本',
        defaultStyle: {
          color: '{color.warning.base}'
        }
      },
      'error': {
        name: '错误文本',
        description: '表示错误状态的文本',
        defaultStyle: {
          color: '{color.error.base}'
        }
      }
    },
    spacing: spacingPresets
  },
  
  'button': {
    // 按钮元素适合的预设
    selfAlign: selfAlignPresets,      // 元素自身对齐预设
    buttonSize: buttonSizePresets,    // 按钮专用尺寸预设(已包含按钮尺寸控制)
    appearance: {
      'primary': {
        name: '主按钮',
        description: '用于主要操作的按钮',
        defaultStyle: {
          backgroundColor: '{color.primary.base}',
          color: '{color.primary.contrast}',
          borderWidth: '{borderWidth.none}',
          borderRadius: '{borderRadius.medium}',
          boxShadow: '{material.main}'
        }
      },
      'secondary': {
        name: '次要按钮',
        description: '用于次要操作的按钮',
        defaultStyle: {
          backgroundColor: '{color.secondary.base}',
          color: '{color.secondary.contrast}',
          borderWidth: '{borderWidth.none}',
          borderRadius: '{borderRadius.medium}',
          boxShadow: '{material.light}'
        }
      },
      'outline': {
        name: '轮廓按钮',
        description: '带边框无背景的按钮',
        defaultStyle: {
          backgroundColor: 'transparent',
          color: '{color.primary.base}',
          borderWidth: '{borderWidth.base}',
          borderColor: '{color.primary.base}',
          borderRadius: '{borderRadius.medium}'
        }
      },
      'ghost': {
        name: '幽灵按钮',
        description: '无背景无边框的按钮',
        defaultStyle: {
          backgroundColor: 'transparent',
          color: '{color.primary.base}',
          borderWidth: '{borderWidth.none}',
          borderRadius: '{borderRadius.medium}'
        }
      }
    },
    typography: {
      'default': {
        name: '默认按钮文本',
        description: '标准按钮文字样式',
        defaultStyle: {
          fontSize: '{font.size.medium}',
          fontWeight: '{font.weight.medium}'
        }
      },
      'small': {
        name: '小型按钮文本',
        description: '小型按钮文字样式',
        defaultStyle: {
          fontSize: '{font.size.small}',
          fontWeight: '{font.weight.medium}'
        }
      },
      'large': {
        name: '大型按钮文本',
        description: '大型按钮文字样式',
        defaultStyle: {
          fontSize: '{font.size.large}',
          fontWeight: '{font.weight.semibold}'
        }
      }
    },
    spacing: {
      'default': {
        name: '标准按钮间距',
        description: '标准按钮内边距',
        defaultStyle: {
          paddingTop: '{padding.semitight}',
          paddingRight: '{padding.semiloose}',
          paddingBottom: '{padding.semitight}',
          paddingLeft: '{padding.semiloose}',
          gap: '{gap.semitight}',
          // 确保按钮文本居中
          textAlign: 'center',
          justifyContent: 'center',
          alignItems: 'center'
        }
      },
      'compact': {
        name: '紧凑按钮间距',
        description: '紧凑的按钮内边距',
        defaultStyle: {
          paddingTop: '{padding.tight}',
          paddingRight: '{padding.base}',
          paddingBottom: '{padding.tight}',
          paddingLeft: '{padding.base}',
          gap: '{gap.tight}',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }
      },
      'spacious': {
        name: '宽敞按钮间距',
        description: '宽敞的按钮内边距',
        defaultStyle: {
          paddingTop: '{padding.base}',
          paddingRight: '{padding.loose}',
          paddingBottom: '{padding.base}',
          paddingLeft: '{padding.loose}',
          gap: '{gap.base}',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }
      }
    }
  },
  
  'container': {
    // 容器元素是唯一需要完整布局预设的元素
    layout: layoutPresets,       // 布局方向、对齐方式等
    flexRatio: flexRatioPresets, // Flex比例预设
    size: sizePresets,           // 尺寸预设
    appearance: {
      'default': {
        name: '默认容器',
        description: '标准容器样式',
        defaultStyle: {
          backgroundColor: 'transparent',
          borderWidth: '{borderWidth.none}',
          borderRadius: '{borderRadius.none}'
        }
      },
      'card': {
        name: '卡片容器',
        description: '卡片式容器，有阴影和圆角',
        defaultStyle: {
          backgroundColor: '{color.neutral.white}',
          borderWidth: '{borderWidth.none}',
          borderRadius: '{borderRadius.medium}',
          boxShadow: '{material.card}'
        }
      },
      'panel': {
        name: '面板容器',
        description: '带边框的面板',
        defaultStyle: {
          backgroundColor: '{color.neutral.white}',
          borderWidth: '{borderWidth.narrow}',
          borderColor: '{color.neutral.light}',
          borderRadius: '{borderRadius.medium}'
        }
      },
      'well': {
        name: '凹陷容器',
        description: '凹陷效果的容器',
        defaultStyle: {
          backgroundColor: '{color.neutral.lighter}',
          borderWidth: '{borderWidth.none}',
          borderRadius: '{borderRadius.medium}'
        }
      }
    },
    spacing: spacingPresets
  },
  
  'input': {
    appearance: {
      'default': {
        name: '默认输入框',
        description: '标准输入框样式',
        defaultStyle: {
          backgroundColor: '{color.neutral.white}',
          borderWidth: '{borderWidth.narrow}',
          borderColor: '{color.neutral.base}',
          borderRadius: '{borderRadius.medium}',
          color: '{color.neutral.darkest}'
        }
      },
      'filled': {
        name: '填充输入框',
        description: '带背景色的输入框',
        defaultStyle: {
          backgroundColor: '{color.neutral.lighter}',
          borderWidth: '{borderWidth.none}',
          borderRadius: '{borderRadius.medium}',
          color: '{color.neutral.darkest}'
        }
      },
      'underlined': {
        name: '下划线输入框',
        description: '仅有下边框的输入框',
        defaultStyle: {
          backgroundColor: 'transparent',
          borderWidth: '{borderWidth.none}',
          borderBottomWidth: '{borderWidth.narrow}',
          borderColor: '{color.neutral.base}',
          borderRadius: '{borderRadius.none}',
          color: '{color.neutral.darkest}'
        }
      }
    },
    typography: {
      'default': {
        name: '默认输入文本',
        description: '标准输入框文字样式',
        defaultStyle: {
          fontSize: '{font.size.medium}',
          fontWeight: '{font.weight.medium}'
        }
      },
      'small': {
        name: '小型输入文本',
        description: '小型输入框文字样式',
        defaultStyle: {
          fontSize: '{font.size.small}',
          fontWeight: '{font.weight.medium}'
        }
      }
    },
    spacing: {
      'default': {
        name: '标准输入框间距',
        description: '标准输入框内边距',
        defaultStyle: {
          paddingTop: '{padding.semitight}',
          paddingRight: '{padding.base}',
          paddingBottom: '{padding.semitight}',
          paddingLeft: '{padding.base}'
        }
      },
      'compact': {
        name: '紧凑输入框间距',
        description: '紧凑的输入框内边距',
        defaultStyle: {
          paddingTop: '{padding.tight}',
          paddingRight: '{padding.semitight}',
          paddingBottom: '{padding.tight}',
          paddingLeft: '{padding.semitight}'
        }
      }
    }
  },
  
  'icon': {
    appearance: {
      'default': {
        name: '默认图标',
        description: '标准图标样式',
        defaultStyle: {
          color: '{color.neutral.dark}'
        }
      },
      'primary': {
        name: '主色图标',
        description: '使用主色的图标',
        defaultStyle: {
          color: '{color.primary.base}'
        }
      },
      'secondary': {
        name: '次色图标',
        description: '使用次色的图标',
        defaultStyle: {
          color: '{color.secondary.base}'
        }
      }
    },
    spacing: {
      'none': {
        name: '无间距',
        description: '无内边距',
        defaultStyle: {
          padding: '{padding.none}'
        }
      },
      'minimal': {
        name: '最小间距',
        description: '最小内边距',
        defaultStyle: {
          padding: '{padding.supertight}'
        }
      }
    }
  },
  
  'image': {
    // 图片元素适合的预设
    selfAlign: selfAlignPresets,        // 元素自身对齐预设
    size: sizePresets,                  // 尺寸预设
    imageProportion: imageProportionPresets, // 图片比例预设
    appearance: {
      'default': {
        name: '默认图片',
        description: '标准图片样式',
        defaultStyle: {
          borderRadius: '{borderRadius.none}'
        }
      },
      'rounded': {
        name: '圆角图片',
        description: '圆角图片样式',
        defaultStyle: {
          borderRadius: '{borderRadius.medium}'
        }
      },
      'circle': {
        name: '圆形图片',
        description: '圆形图片样式',
        defaultStyle: {
          borderRadius: '{borderRadius.full}'
        }
      },
      'bordered': {
        name: '带边框图片',
        description: '带边框的图片样式',
        defaultStyle: {
          borderWidth: '{borderWidth.narrow}',
          borderColor: '{color.neutral.light}',
          borderRadius: '{borderRadius.medium}'
        }
      }
    }
  },
  
  'divider': {
    appearance: {
      'default': {
        name: '默认分割线',
        description: '标准分割线样式',
        defaultStyle: {
          backgroundColor: '{color.neutral.light}',
          height: '{borderWidth.narrow}'
        }
      },
      'subtle': {
        name: '淡色分割线',
        description: '更淡的分割线样式',
        defaultStyle: {
          backgroundColor: '{color.neutral.lighter}',
          height: '{borderWidth.narrow}'
        }
      },
      'bold': {
        name: '粗分割线',
        description: '更粗的分割线样式',
        defaultStyle: {
          backgroundColor: '{color.neutral.base}',
          height: '{borderWidth.base}'
        }
      }
    },
    spacing: {
      'default': {
        name: '标准分割线间距',
        description: '标准分割线外边距',
        defaultStyle: {
          marginTop: '{margin.base}',
          marginBottom: '{margin.base}'
        }
      },
      'compact': {
        name: '紧凑分割线间距',
        description: '紧凑的分割线外边距',
        defaultStyle: {
          marginTop: '{margin.tight}',
          marginBottom: '{margin.tight}'
        }
      },
      'spacious': {
        name: '宽敞分割线间距',
        description: '宽敞的分割线外边距',
        defaultStyle: {
          marginTop: '{margin.loose}',
          marginBottom: '{margin.loose}'
        }
      }
    }
  }
};

/**
 * 合并多个预设样式 - 支持单个预设键或预设数组
 * @param {Object} element - 元素对象
 * @param {Object} presets - 预设定义对象
 * @returns {Object} - 合并后的样式对象
 */
export const mergeElementPresets = (element, presets) => {
  if (!element || !element.type) return {};
  
  const elementPresetCategories = elementPresets[element.type];
  if (!elementPresetCategories) return {};
  
  let mergedStyle = {};
  
  // 定义预设应用顺序 - 确保特定类型的预设按照正确的顺序应用
  // 这个顺序很重要：后面的预设会覆盖前面预设中相同的属性
  const categoryOrder = [
    'layout',           // 容器布局方向应该最先应用
    'flexRatio',        // 元素在Flex布局中的伸缩比例
    'size',             // 尺寸预设
    'buttonSize',       // 按钮专用尺寸
    'imageProportion',  // 图片比例预设
    'selfAlign',        // 元素自身在父容器中的对齐方式
    'textAlign',        // 文本对齐
    'spacing',          // 间距
    'typography',       // 排版
    'appearance'        // 最后是外观（颜色、边框等）
  ];
  
  // 按照定义的顺序处理每个预设类别
  for (const category of categoryOrder) {
    if (!elementPresetCategories[category]) continue;
    
    // 支持单个预设键或预设数组
    const presetKeys = element[`${category}Preset`];
    
    // 如果是单个预设键
    if (typeof presetKeys === 'string' && elementPresetCategories[category][presetKeys]) {
      const presetStyle = elementPresetCategories[category][presetKeys].defaultStyle;
      // 合并样式
      mergedStyle = { ...mergedStyle, ...presetStyle };
      console.log(`应用${category}预设: ${presetKeys}`);
    }
    // 如果是预设数组
    else if (Array.isArray(presetKeys)) {
      for (const key of presetKeys) {
        if (elementPresetCategories[category][key]) {
          const presetStyle = elementPresetCategories[category][key].defaultStyle;
          // 合并样式，数组中后面的预设会覆盖前面预设的相同属性
          mergedStyle = { ...mergedStyle, ...presetStyle };
          console.log(`应用${category}预设数组: ${key}`);
        }
      }
    }
  }
  
  return mergedStyle;
};

/**
 * 获取元素类型可用的预设类别
 * @param {string} elementType - 元素类型
 * @returns {Object} - 每个预设类别的可用预设
 */
export const getAvailablePresets = (elementType) => {
  if (!elementType || !elementPresets[elementType]) {
    return {};
  }
  
  return elementPresets[elementType];
};

/**
 * 应用预设到元素 - 支持单个预设键或添加到预设数组
 * @param {Object} element - 要应用预设的元素
 * @param {string} category - 预设类别 (typography, appearance, spacing, layout, textAlign)
 * @param {string} presetKey - 预设键名
 * @param {boolean} [asArray=false] - 是否作为数组添加(不覆盖现有预设)
 * @returns {Object} - 应用预设后的新元素
 */
export const applyPresetToElement = (element, category, presetKey, asArray = false) => {
  if (!element || !element.type) return element;
  
  const availablePresets = getAvailablePresets(element.type);
  if (!availablePresets[category] || !availablePresets[category][presetKey]) {
    return element;
  }
  
  // 创建新元素并应用预设
  const newElement = { ...element };
  
  // 如果以数组模式添加预设
  if (asArray) {
    const currentPresets = Array.isArray(newElement[`${category}Preset`])
      ? [...newElement[`${category}Preset`]]
      : newElement[`${category}Preset`] ? [newElement[`${category}Preset`]] : [];
    
    // 避免重复添加相同的预设
    if (!currentPresets.includes(presetKey)) {
      currentPresets.push(presetKey);
    }
    
    newElement[`${category}Preset`] = currentPresets;
    console.log(`向${category}预设数组添加: ${presetKey}, 当前预设: ${currentPresets.join(', ')}`);
  } else {
    // 单个预设模式 - 直接替换
    newElement[`${category}Preset`] = presetKey;
    console.log(`设置${category}预设: ${presetKey}`);
  }
  
  // 获取预设样式
  const presetStyle = availablePresets[category][presetKey].defaultStyle;
  
  // 创建或更新样式对象
  if (!newElement.style) newElement.style = {};
  
  // 应用预设样式（保留令牌引用）并记录应用的预设
  for (const [key, value] of Object.entries(presetStyle)) {
    // 处理可能导致React样式冲突的快捷方式
    if (key === 'padding') {
      // 使用单独属性而不是简写方式
      newElement.style.paddingTop = value;
      newElement.style.paddingRight = value;
      newElement.style.paddingBottom = value;
      newElement.style.paddingLeft = value;
      console.log(`应用预设 ${category}:${presetKey} - 将padding=${value}拆分为独立属性`);
    }
    else if (key === 'margin') {
      // 使用单独属性而不是简写方式
      newElement.style.marginTop = value;
      newElement.style.marginRight = value;
      newElement.style.marginBottom = value;
      newElement.style.marginLeft = value;
      console.log(`应用预设 ${category}:${presetKey} - 将margin=${value}拆分为独立属性`);
    }
    else {
      // 其他属性正常应用
      newElement.style[key] = value;
      console.log(`应用预设 ${category}:${presetKey} - 设置 ${key}=${value}`);
    }
  }
  
  return newElement;
};

// 扩展的设计令牌
export const extendedDesignTokens = {
  color: {
    primary: {
      lightest: '#E3F2FD',
      lighter: '#BBDEFB',
      light: '#64B5F6',
      base: '#2196F3',
      dark: '#1976D2',
      darker: '#0D47A1',
      contrast: '#FFFFFF'
    },
    secondary: {
      lightest: '#F3E5F5',
      lighter: '#E1BEE7',
      light: '#BA68C8',
      base: '#9C27B0',
      dark: '#7B1FA2',
      darker: '#4A148C',
      contrast: '#FFFFFF'
    },
    neutral: {
      white: '#FFFFFF',
      lighter: '#F5F5F5',
      light: '#E0E0E0',
      base: '#9E9E9E',
      dark: '#616161',
      darker: '#212121',
      darkest: '#000000'
    },
    success: {
      light: '#A5D6A7',
      base: '#4CAF50',
      dark: '#2E7D32',
      contrast: '#FFFFFF'
    },
    warning: {
      light: '#FFE082',
      base: '#FFC107',
      dark: '#F57F17',
      contrast: '#000000'
    },
    error: {
      light: '#EF9A9A',
      base: '#F44336',
      dark: '#C62828',
      contrast: '#FFFFFF'
    }
  },
  material: {
    none: 'none',
    light: '0 2px 4px rgba(0,0,0,0.1)',
    main: '0 4px 8px rgba(0,0,0,0.1)',
    card: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    elevated: '0 8px 16px rgba(0,0,0,0.12), 0 8px 8px rgba(0,0,0,0.08)',
    ground: '0 -2px 10px rgba(0,0,0,0.1)',
    heavy: '0 16px 24px rgba(0,0,0,0.16), 0 8px 16px rgba(0,0,0,0.12)'
  }
};

export default elementPresets;