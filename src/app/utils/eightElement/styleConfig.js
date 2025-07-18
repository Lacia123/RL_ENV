/**
 * styleConfig.js
 * 八要素结构的样式配置系统
 * 提供了对不同元素类型样式的完整配置
 */

// CSS变量系统
export const CSS_VARIABLE_SYSTEM = {
  // 字体系统
  FONT: {
    SIZE_TINY: 'var(--font-size-tiny, 12px)',
    SIZE_SMALL: 'var(--font-size-small, 14px)',
    SIZE_MEDIUM: 'var(--font-size-medium, 16px)',
    SIZE_LARGE: 'var(--font-size-large, 20px)',
    SIZE_XL: 'var(--font-size-xl, 26px)',
    SIZE_XXL: 'var(--font-size-xxl, 36px)',
    SIZE_XXXL: 'var(--font-size-xxxl, 52px)',
    WEIGHT_LIGHT: 'var(--font-fontweight-light, 100)',
    WEIGHT_MEDIUM: 'var(--font-fontweight-medium, 200)',
    WEIGHT_SEMIBOLD: 'var(--font-fontweight-semibold, 400)',
    WEIGHT_BOLD: 'var(--font-fontweight-bold, 600)',
    LINE_HEIGHT_BASE: 'var(--font-lineheight-base, 1.4)',
    LETTER_SPACING_BASE: 'var(--font-letterspacing-base, 0)'
  },

  // 尺寸系统
  DIMENSION: {
    PADDING_NONE: 'var(--dimension-padding-none, 0)',
    PADDING_SUPERTIGHT: 'var(--dimension-padding-supertight, 2px)',
    PADDING_EXTRATIGHT: 'var(--dimension-padding-extratight, 4px)',
    PADDING_TIGHT: 'var(--dimension-padding-tight, 6px)',
    PADDING_SEMITIGHT: 'var(--dimension-padding-semitight, 8px)',
    PADDING_BASE: 'var(--dimension-padding-base, 12px)',
    PADDING_SEMILOOSE: 'var(--dimension-padding-semiloose, 16px)',
    PADDING_LOOSE: 'var(--dimension-padding-loose, 20px)',
    PADDING_EXTRALOOSE: 'var(--dimension-padding-extraloose, 24px)',
    PADDING_SUPERLOOSE: 'var(--dimension-padding-superloose, 32px)',
    MARGIN_NONE: 'var(--dimension-margin-none, 0)',
    MARGIN_TIGHT: 'var(--dimension-margin-tight, 6px)',
    MARGIN_BASE: 'var(--dimension-margin-base, 12px)',
    MARGIN_LOOSE: 'var(--dimension-margin-loose, 20px)',
    MARGIN_EXTRALOOSE: 'var(--dimension-margin-extraloose, 24px)',
    MARGIN_SUPERLOOSE: 'var(--dimension-margin-superloose, 32px)',
    GAP_TIGHT: 'var(--dimension-gap-tight, 6px)',
    GAP_BASE: 'var(--dimension-gap-base, 12px)',
    GAP_LOOSE: 'var(--dimension-gap-loose, 20px)',
    BORDER_RADIUS_NONE: 'var(--dimension-borderradius-none, 0)',
    BORDER_RADIUS_XS: 'var(--dimension-borderradius-xs, 4px)',
    BORDER_RADIUS_SMALL: 'var(--dimension-borderradius-small, 8px)',
    BORDER_RADIUS_MEDIUM: 'var(--dimension-borderradius-medium, 12px)',
    BORDER_RADIUS_LARGE: 'var(--dimension-borderradius-large, 16px)',
    BORDER_RADIUS_XL: 'var(--dimension-borderradius-xl, 20px)',
    BORDER_RADIUS_XXL: 'var(--dimension-borderradius-xxl, 24px)'
  },

  // 颜色系统 - 支持主题切换
  COLOR: {
    SURFACE_CONTAINER_WHITE100: 'var(--color-surface-container-white100, #ffffff)',
    ON_SURFACE_BLACK88: 'var(--color-on-surface-black88, rgba(0, 0, 0, 0.88))',
    ON_SURFACE_BLACK76: 'var(--color-on-surface-black76, rgba(0, 0, 0, 0.76))',
    ON_SURFACE_BLACK64: 'var(--color-on-surface-black64, rgba(0, 0, 0, 0.64))',
    ON_SURFACE_BLACK48: 'var(--color-on-surface-black48, rgba(0, 0, 0, 0.48))',
    SURFACE_GREY0: 'var(--color-surface-grey0, #ffffff)',
    SURFACE_GREY1: 'var(--color-surface-grey1, #f9fafb)',
    SURFACE_GREY2: 'var(--color-surface-grey2, #f3f4f6)',
    SURFACE_CONTAINER_BLACK4: 'var(--color-surface-container-black4, rgba(0, 0, 0, 0.04))',
    SURFACE_CONTAINER_BLACK7: 'var(--color-surface-container-black7, rgba(0, 0, 0, 0.07))',
    SURFACE_CONTAINER_BLACK12: 'var(--color-surface-container-black12, rgba(0, 0, 0, 0.12))',
    SURFACE_CONTAINER_BLACK16: 'var(--color-surface-container-black16, rgba(0, 0, 0, 0.16))',
    SURFACE_CONTAINER_BLACK20: 'var(--color-surface-container-black20, rgba(0, 0, 0, 0.20))',
    PRIMARY_BRAND4: 'var(--color-primary-brand4, #2563eb)',
    PRIMARY_BRAND5: 'var(--color-primary-brand5, #1d4ed8)',
    PRIMARY_BRAND6: 'var(--color-primary-brand6, #1e40af)',
    PRIMARY_CONTAINER_BRAND1: 'var(--color-primary-container-brand1, #dbeafe)',
    PRIMARY_CONTAINER_BRAND2: 'var(--color-primary-container-brand2, #bfdbfe)',
    SECONDARY_VIOLET4: 'var(--color-secondary-violet4, #9333ea)',
    SECONDARY_VIOLET5: 'var(--color-secondary-violet5, #7c3aed)',
    SECONDARY_VIOLET6: 'var(--color-secondary-violet6, #6d28d9)',
    SECONDARY_CONTAINER_VIOLET1: 'var(--color-secondary-container-violet1, #f3e8ff)',
    SECONDARY_CONTAINER_VIOLET2: 'var(--color-secondary-container-violet2, #e9d5ff)',
    ON_SECONDARY_CONTAINER_VIOLET8: 'var(--color-on-secondary-container-violet8, #6b21a8)',
    SUCCESS_GREEN1: 'var(--color-success-green1, #dcfce7)',
    SUCCESS_GREEN3: 'var(--color-success-green3, #86efac)',
    SUCCESS_GREEN5: 'var(--color-success-green5, #22c55e)',
    SUCCESS_GREEN6: 'var(--color-success-green6, #16a34a)',
    SUCCESS_GREEN8: 'var(--color-success-green8, #166534)',
    WARNING_ORANGE1: 'var(--color-warning-orange1, #fef3c7)',
    WARNING_ORANGE3: 'var(--color-warning-orange3, #fcd34d)',
    WARNING_ORANGE5: 'var(--color-warning-orange5, #f59e0b)',
    WARNING_ORANGE6: 'var(--color-warning-orange6, #d97706)',
    WARNING_ORANGE7: 'var(--color-warning-orange7, #b45309)',
    WARNING_ORANGE8: 'var(--color-warning-orange8, #92400e)',
    ON_PRIMARY_WHITE100: 'var(--color-on-primary-white100, rgba(255, 255, 255, 1))',
    ON_PRIMARY_CONTAINER_BRAND8: 'var(--color-on-primary-container-brand8, #1e40af)',
    ON_SURFACE_CONTAINER_GREY7: 'var(--color-on-surface-container-grey7, #374151)',
    ON_SURFACE_CONTAINER_GREY9: 'var(--color-on-surface-container-grey9, #111827)',
    ON_SURFACE_WHITE88: 'var(--color-on-surface-white88, rgba(255, 255, 255, 0.88))'
  },

  // 阴影系统
  SHADOW: {
    HIERARCHY_B1: 'var(--material-hierarchy-B1, inset 0 1px 8px 0 rgba(31, 31, 42, 0.11))',
    HIERARCHY_MAIN: 'var(--material-hierarchy-main, 0 1px 8px 0 rgba(31, 31, 42, 0.15))',
    HIERARCHY_1F: 'var(--material-hierarchy-1f, 0 4px 12px 0 rgba(31, 31, 42, 0.16))',
    HIERARCHY_2F: 'var(--material-hierarchy-2f, 0 6px 16px 0 rgba(31, 31, 42, 0.17))',
    HIERARCHY_3F: 'var(--material-hierarchy-3f, 0 8px 20px 0 rgba(31, 31, 42, 0.18))',
    HIERARCHY_4F: 'var(--material-hierarchy-4f, 0 12px 24px 0 rgba(31, 31, 42, 0.19))'
  },

  // 渐变系统
  GRADIENT: {
    PRIMARY: 'var(--gradient-primary, linear-gradient(135deg, #2563eb 0%, #1e40af 100%))',
    SECONDARY: 'var(--gradient-secondary, linear-gradient(135deg, #9333ea 0%, #6d28d9 100%))',
    SUCCESS: 'var(--gradient-success, linear-gradient(135deg, #86efac 0%, #22c55e 100%))',
    WARNING: 'var(--gradient-warning, linear-gradient(135deg, #fcd34d 0%, #f59e0b 100%))',
    TEXT_HERO: 'var(--gradient-text-hero, linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%))'
  },

  // 动画系统
  ANIMATION: {
    SMOOTH: 'var(--animation-smooth, all 0.3s cubic-bezier(0.4, 0, 0.2, 1))',
    FAST: 'var(--animation-fast, all 0.2s cubic-bezier(0.4, 0, 0.2, 1))',
    SPRING: 'var(--animation-spring, all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275))'
  }
};

/**
 * 语义化颜色系统 - 基于design token (保持向后兼容)
 */
export const SEMANTIC_COLOR_SYSTEM = {
  PRIMARY: {
    BRAND3: "{color.primary.brand3}",
    BRAND4: "{color.primary.brand4}",
    BRAND5: "{color.primary.brand5}",
    BRAND6: "{color.primary.brand6}"
  },
  PRIMARY_CONTAINER: {
    BRAND0: "{color.primarycontainer.brand0}",
    BRAND1: "{color.primarycontainer.brand1}",
    BRAND2: "{color.primarycontainer.brand2}"
  },
  ON_PRIMARY: {
    BLACK76: "{color.onprimary.black76}",
    BLACK88: "{color.onprimary.black88}",
    BLACK100: "{color.onprimary.black100}",
    WHITE76: "{color.onprimary.white76}",
    WHITE88: "{color.onprimary.white88}",
    WHITE100: "{color.onprimary.white100}"
  },
  ON_PRIMARY_CONTAINER: {
    BRAND7: "{color.onprimarycontainer.brand7}",
    BRAND8: "{color.onprimarycontainer.brand8}",
    BRAND9: "{color.onprimarycontainer.brand9}"
  },
  SECONDARY: {
    VIOLET3: "{color.secondary.violet3}",
    VIOLET4: "{color.secondary.violet4}",
    VIOLET5: "{color.secondary.violet5}",
    VIOLET6: "{color.secondary.violet6}"
  },
  SECONDARY_CONTAINER: {
    VIOLET0: "{color.secondarycontainer.violet0}",
    VIOLET1: "{color.secondarycontainer.violet1}",
    VIOLET2: "{color.secondarycontainer.violet2}"
  },
  ON_SECONDARY: {
    BLACK76: "{color.onsecondary.black76}",
    BLACK88: "{color.onsecondary.black88}",
    BLACK100: "{color.onsecondary.black100}",
    WHITE76: "{color.onsecondary.white76}",
    WHITE88: "{color.onsecondary.white88}",
    WHITE100: "{color.onsecondary.white100}"
  },
  ON_SECONDARY_CONTAINER: {
    VIOLET7: "{color.onsecondarycontainer.violet7}",
    VIOLET8: "{color.onsecondarycontainer.violet8}",
    VIOLET9: "{color.onsecondarycontainer.violet9}"
  },
  SURFACE: {
    GREY0: "{color.surface.grey0}",
    GREY1: "{color.surface.grey1}",
    GREY2: "{color.surface.grey2}"
  },
  SURFACE_CONTAINER: {
    WHITE4: "{color.surfacecontainer.white4}",
    WHITE7: "{color.surfacecontainer.white7}",
    WHITE12: "{color.surfacecontainer.white12}",
    WHITE16: "{color.surfacecontainer.white16}",
    WHITE20: "{color.surfacecontainer.white20}",
    WHITE24: "{color.surfacecontainer.white24}",
    WHITE32: "{color.surfacecontainer.white32}",
    WHITE48: "{color.surfacecontainer.white48}",
    WHITE64: "{color.surfacecontainer.white64}",
    WHITE76: "{color.surfacecontainer.white76}",
    WHITE88: "{color.surfacecontainer.white88}",
    WHITE100: "{color.surfacecontainer.white100}",
    BLACK4: "{color.surfacecontainer.black4}",
    BLACK7: "{color.surfacecontainer.black7}",
    BLACK12: "{color.surfacecontainer.black12}",
    BLACK16: "{color.surfacecontainer.black16}",
    BLACK20: "{color.surfacecontainer.black20}",
    BLACK24: "{color.surfacecontainer.black24}",
    BLACK32: "{color.surfacecontainer.black32}",
    BLACK48: "{color.surfacecontainer.black48}",
    BLACK64: "{color.surfacecontainer.black64}",
    BLACK76: "{color.surfacecontainer.black76}",
    BLACK88: "{color.surfacecontainer.black88}",
    BLACK100: "{color.surfacecontainer.black100}"
  },
  ON_SURFACE: {
    BLACK48: "{color.onsurface.black48}",
    BLACK64: "{color.onsurface.black64}",
    BLACK76: "{color.onsurface.black76}",
    BLACK88: "{color.onsurface.black88}",
    BLACK100: "{color.onsurface.black100}",
    WHITE48: "{color.onsurface.white48}",
    WHITE64: "{color.onsurface.white64}",
    WHITE76: "{color.onsurface.white76}",
    WHITE88: "{color.onsurface.white88}",
    WHITE100: "{color.onsurface.white100}"
  },
  ON_SURFACE_CONTAINER: {
    BLACK48: "{color.onsurfacecontainer.black48}",
    BLACK64: "{color.onsurfacecontainer.black64}",
    BLACK76: "{color.onsurfacecontainer.black76}",
    BLACK88: "{color.onsurfacecontainer.black88}",
    BLACK100: "{color.onsurfacecontainer.black100}",
    WHITE48: "{color.onsurfacecontainer.white48}",
    WHITE64: "{color.onsurfacecontainer.white64}",
    WHITE76: "{color.onsurfacecontainer.white76}",
    WHITE88: "{color.onsurfacecontainer.white88}",
    WHITE100: "{color.onsurfacecontainer.white100}",
    GREY5: "{color.onsurfacecontainer.grey5}",
    GREY6: "{color.onsurfacecontainer.grey6}",
    GREY7: "{color.onsurfacecontainer.grey7}",
    GREY8: "{color.onsurfacecontainer.grey8}",
    GREY9: "{color.onsurfacecontainer.grey9}"
  },
  SUCCESS: {
    GREEN0: "{color.success.green0}",
    GREEN1: "{color.success.green1}",
    GREEN2: "{color.success.green2}",
    GREEN3: "{color.success.green3}",
    GREEN4: "{color.success.green4}",
    GREEN5: "{color.success.green5}",
    GREEN6: "{color.success.green6}",
    GREEN7: "{color.success.green7}",
    GREEN8: "{color.success.green8}",
    GREEN9: "{color.success.green9}"
  },
  WARNING: {
    ORANGE0: "{color.warning.orange0}",
    ORANGE1: "{color.warning.orange1}",
    ORANGE2: "{color.warning.orange2}",
    ORANGE3: "{color.warning.orange3}",
    ORANGE4: "{color.warning.orange4}",
    ORANGE5: "{color.warning.orange5}",
    ORANGE6: "{color.warning.orange6}",
    ORANGE7: "{color.warning.orange7}",
    ORANGE8: "{color.warning.orange8}",
    ORANGE9: "{color.warning.orange9}"
  }
};

/**
 * 材质层次阴影系统 - 基于design token (保持向后兼容)
 */
export const MATERIAL_HIERARCHY_SYSTEM = {
  INNER: {
    B1: "{material.hierarchy.B1}",
    B2: "{material.hierarchy.B2}",
    B3: "{material.hierarchy.B3}"
  },
  ELEVATION: {
    GROUND: "{material.hierarchy.ground}",
    MAIN: "{material.hierarchy.main}",
    FLOOR_1: "{material.hierarchy.1f}",
    FLOOR_2: "{material.hierarchy.2f}",
    FLOOR_3: "{material.hierarchy.3f}",
    FLOOR_4: "{material.hierarchy.4f}",
    FLOOR_5: "{material.hierarchy.5f}"
  }
};



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
      style: {
        padding: `${DIMENSION_CONSTANTS.PADDING.base} ${DIMENSION_CONSTANTS.PADDING.base} ${DIMENSION_CONSTANTS.PADDING.base} ${DIMENSION_CONSTANTS.PADDING.loose}`,
        margin: DIMENSION_CONSTANTS.MARGIN.base,
        backgroundColor: COLOR_CONSTANTS.BASIC.OPACITY.WHITE[100],
        borderRadius: DIMENSION_CONSTANTS.BORDER_RADIUS.large,

        // 🔧 新增：布局动作所需的默认属性
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        gap: DIMENSION_CONSTANTS.GAP.none,

        backgroundImage: 'none',
        backgroundPosition: '50% 0',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100vw 140px',

        // 网格布局属性（默认不启用，由动作激活）
        gridTemplateColumns: 'none',
        gridTemplateAreas: 'none',
        justifyItems: 'stretch',
      },
      supportedAttributes: ['backgroundImage']
    },
    // 列布局元素（默认垂直布局）
    column: {
      padding: `${DIMENSION_CONSTANTS.PADDING.tight} 0`,
      margin: `${DIMENSION_CONSTANTS.MARGIN.tight} 0`,
      backgroundColor: "none",

      // 🔧 新增：布局动作所需的默认属性
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'nowrap',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      gap: DIMENSION_CONSTANTS.GAP.none,

      // 网格布局属性（默认不启用，由动作激活）
      gridTemplateColumns: 'none',
      gridTemplateAreas: 'none',
      justifyItems: 'stretch'
    },
    // row 布局元素
    row: {
      padding: `${DIMENSION_CONSTANTS.PADDING.tight} 0`,
      margin: `${DIMENSION_CONSTANTS.MARGIN.tight} 0`,
      backgroundColor: "none",

      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'flex-start',
      alignItems: 'stretch',
      gap: DIMENSION_CONSTANTS.GAP.base,

      // 网格布局属性（默认不启用，由动作激活）
      gridTemplateColumns: 'none',
      gridTemplateAreas: 'none',
      justifyItems: 'stretch'
    }
  },

  // 文本元素配置
  text: {
    // 正文文本
    p: {
      fontSize: "{font.size.medium}",
      fontWeight: "400",
      lineHeight: "1.7",
      letterSpacing: "{font.letterspacing.base}",
      color: "{color.onsurface.black76}",
      margin: "0 0 {dimension.margin.base} 0",
      textAlign: "justify",
      textJustify: "inter-word"
    },
    // 标题文本（h1 - h6）
    h1: {
      width: "100%",
      fontSize: "{font.size.xxxl}",
      fontWeight: "{font.fontweight.bold}",
      lineHeight: "{font.lineheight.base}",
      letterSpacing: "{font.letterspacing.base}",
      color: "{color.onsurface.black88}",
      // marginTop: "{dimension.margin.superloose}",
      marginBottom: "{dimension.margin.loose}",
      textAlign: "center",
      // marginLeft: "auto",
      // marginRight: "auto",
      position: 'relative',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',

      // '&::after': {
      //   content: "''",
      //   position: 'absolute',
      //   bottom: '-8px',
      //   left: '0',
      //   width: '60px',
      //   height: '4px',
      //   background: `linear-gradient(135deg, {color.primary.brand4} 0%, {color.secondary.violet5} 100%)`,
      //   borderRadius: "{dimension.borderradius.large}"
      // }
    },
    h2: {
      width: "100%",
      fontSize: "{font.size.xxl}",
      textAlign: "left",
      fontWeight: "{font.fontweight.bold}",
      lineHeight: "{font.lineheight.base}",
      letterSpacing: "{font.letterspacing.base}",
      color: "{color.onsurface.black88}",
      margin: "{dimension.margin.extraloose} 0 {dimension.margin.base} 0",
      padding: "{dimension.padding.base} {dimension.padding.semiloose}",
      borderLeft: `4px solid {color.primary.brand5}`,
      background: `linear-gradient(90deg, {color.primarycontainer.brand1} 0%, transparent 100%)`,
      backgroundImage: 'none',
      borderRadius: "{dimension.borderradius.small}",
      boxShadow: "{material.hierarchy.main}"
    },
    h3: {
      width: "100%",
      display: "flex",
      textAlign: "left",
      fontSize: "{font.size.xl}",
      fontWeight: "{font.fontweight.semibold}",
      lineHeight: "{font.lineheight.base}",
      letterSpacing: "{font.letterspacing.base}",
      color: "{color.onsurface.black76}",
      margin: "{dimension.margin.loose} 0 {dimension.margin.base} 0",
      position: 'relative',
      // '&::before': {
      //   content: "'#'",
      //   color: "{color.primary.brand5}",
      //   marginRight: "{dimension.gap.tight}",
      //   fontWeight: "{font.fontweight.bold}"
      // }
    },
    h4: {
      width: "auto",
      fontSize: "{font.size.large}",
      fontWeight: "{font.fontweight.semibold}",
      lineHeight: "{font.lineheight.base}",
      letterSpacing: "{font.letterspacing.base}",
      color: "{color.onsurface.black76}",
      justifyContent: "center",
      margin: "{dimension.margin.semiloose} 0 {dimension.margin.tight} 0",
      padding: "0 0 {dimension.padding.extratight} 0",
      textTransform: "capitalize",
      borderBottom: `2px solid {color.surfacecontainer.black12}`
    },
    h5: {
      width: "auto",
      fontSize: "{font.size.medium}",
      fontWeight: "{font.fontweight.semibold}",
      lineHeight: "{font.lineheight.base}",
      letterSpacing: "{font.letterspacing.base}",
      color: "{color.onsurface.black64}",
      margin: "{dimension.margin.base} 0 {dimension.margin.tight} 0",
      textDecoration: "underline",
      textDecorationColor: "{color.primarycontainer.brand2}",
      textUnderlineOffset: "4px"
    },
    h6: {
      width: "auto",
      display: "inline-block",
      fontSize: "{font.size.small}",
      fontWeight: "{font.fontweight.medium}",
      lineHeight: "{font.lineheight.base}",
      letterSpacing: "{font.letterspacing.base}",
      color: "{color.onsurface.black48}",
      margin: "{dimension.margin.base} 0 {dimension.margin.tight} 0",
      padding: "{dimension.padding.supertight} {dimension.padding.tight}",
      textTransform: "uppercase",
      letterSpacing: "1px",
      background: "{color.surfacecontainer.black4}",
      borderRadius: "{dimension.borderradius.xs}"
    },

    // 小字说明，TODO: 需要确定解析关系
    caption: {
      fontSize: "{font.size.small}",
      fontWeight: "400",
      lineHeight: "{font.lineheight.base}",
      letterSpacing: "{font.letterspacing.base}",
      color: "{color.onsurface.black48}",
      fontStyle: "italic",
      textAlign: "center",
      marginTop: "{dimension.margin.tight}",
      marginBottom: "{dimension.margin.base}",
      background: "{color.surfacecontainer.black4}",
      padding: "{dimension.padding.tight} {dimension.padding.base}",
      borderRadius: "{dimension.borderradius.small}"
    },

    // 引用文本，对应 markdown 中的 >
    quote: {
      fontSize: "{font.size.large}",
      fontWeight: "400",
      lineHeight: "1.6",
      letterSpacing: "{font.letterspacing.base}",
      color: "{color.onsurface.black76}",
      fontStyle: 'italic',
      padding: "{dimension.padding.loose} {dimension.padding.extraloose}",
      margin: "{dimension.margin.loose} 0",
      backgroundColor: "{color.surface.grey1}",
      borderLeft: `6px solid {color.primary.brand4}`,
      borderRadius: "{dimension.borderradius.medium}",
      boxShadow: "{material.hierarchy.1f}",
      position: 'relative',
      // 🆕 纹理动作所需的默认属性
      backgroundImage: 'none',
      opacity: '1.0',
      backdropFilter: 'none',

      '&::before': {
        content: '"""',
        fontSize: '3rem',
        color: "{color.primarycontainer.brand2}",
        position: 'absolute',
        top: '-10px',
        left: '20px',
        fontFamily: 'serif'
      }
    },

    // 代码块  
    codeBlock: {
      fontSize: "{font.size.small}",
      fontWeight: "400",
      fontFamily: "'Fira Code', 'Monaco', 'Cascadia Code', monospace",
      lineHeight: "1.5",
      backgroundColor: "{color.onsurface.white88}",
      padding: "{dimension.padding.loose} {dimension.padding.extraloose}",
      marginTop: "{dimension.margin.base}",
      marginBottom: "{dimension.margin.base}",
      borderRadius: "{dimension.borderradius.large}",
      borderWidth: "{dimension.borderwidth.narrow}",
      borderColor: "{color.onsurfacecontainer.grey7}",
      borderStyle: "solid",
      boxShadow: "{material.hierarchy.2f}",
      overflow: 'auto',
      position: 'relative',
      '&::before': {
        content: "''",
        position: 'absolute',
        top: '12px',
        left: '16px',
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        backgroundColor: "{color.warning.orange5}",
        boxShadow: `24px 0 0 {color.warning.orange6}, 48px 0 0 {color.success.green5}`
      }
    },

    // 超链接文本 TODO: 超链接样式暂不支持，因为超链接会被解析成按钮
    hyperlink: {
      fontSize: "inherit",
      fontWeight: "{font.fontweight.medium}",
      color: "{color.primary.brand5}",
      textDecoration: 'none',
      borderBottom: '2px solid transparent',
      transition: CSS_VARIABLE_SYSTEM.ANIMATION.SMOOTH,
      '&:hover': {
        color: "{color.primary.brand6}",
        borderBottomColor: "{color.primarycontainer.brand2}",
        textDecoration: "none"
      },
      '&:active': {
        color: "{color.onprimarycontainer.brand8}"
      }
    },

    // 强调文本, TODO：需要确定解析关系 
    emphasis: {
      fontWeight: "{font.fontweight.semibold}",
      color: "{color.onsurface.black88}",
      background: "{color.primarycontainer.brand1}",
      padding: "{dimension.padding.supertight} {dimension.padding.extratight}",
      borderRadius: "{dimension.borderradius.xs}",
      boxShadow: "{material.hierarchy.B1}"
    },
    cardTitle: {
      fontWeight: "{font.fontweight.semibold}",
      color: "{color.onprimary.white100}",
      fontSize: "{font.size.medium}",
    },
    cardSubtitle: {
      fontWeight: "{font.fontweight.semibold}",
      color: "{color.onprimary.black88}",
      fontSize: "{font.size.medium}",
    },
    cardSegment: {
      color: "{color.onprimary.black88}",
      fontSize: "{font.size.small}",
    },

    // 新拟态风格文字样式
    neomorphismTitle: {
      fontWeight: "{font.fontweight.semibold}",
      color: "{color.onprimary.white100}",
      fontSize: "{font.size.medium}",
    },
    neomorphismSubtitle: {
      fontWeight: "{font.fontweight.semibold}",
      color: "{color.onprimary.black88}",
      fontSize: "{font.size.small}",
    },
    neomorphismSegment: {
      fontWeight: "{font.fontweight.medium}",
      color: "{color.onprimary.black88}",
      fontSize: "{font.size.small}",
    },

    // 科技渐变风格文字样式
    techGradientTitle: {
      fontWeight: "{font.fontweight.semibold}",
      color: "{color.primary.brand6}", // 深蓝色确保可读性
      fontSize: "{font.size.medium}",
    },
    techGradientSubtitle: {
      fontWeight: "{font.fontweight.semibold}",
      color: "{color.onprimary.black88}",
      fontSize: "{font.size.small}",
    },
    techGradientSegment: {
      fontWeight: "{font.fontweight.medium}",
      color: "{color.onprimary.black88}",
      fontSize: "{font.size.small}",
    },

    // 优雅青蓝卡片风格文字样式
    elegantCardTitle: {
      fontWeight: "{font.fontweight.semibold}",
      color: "{color.primary.brand6}", // 深青蓝色确保可读性
      fontSize: "{font.size.medium}",
    },
    elegantCardSubtitle: {
      fontWeight: "{font.fontweight.semibold}",
      color: "{color.onprimary.black88}",
      fontSize: "{font.size.small}",
    },
    elegantCardSegment: {
      fontWeight: "{font.fontweight.medium}",
      color: "{color.onprimary.black88}",
      fontSize: "{font.size.small}",
    },
  },

  // ==================== 数学公式元件 ==================== (新增)
  math: {
    // 行内公式
    inline: {
      textAlign: "left",
      fontSize: "{font.size.medium}",
      color: "{color.onsurface.black88}",
      verticalAlign: "baseline"
    },
    // 块级公式
    display: {
      fontSize: "{font.size.large}",
      margin: "{dimension.margin.loose} 0",
      padding: "{dimension.padding.base}",
      backgroundColor: "{color.surface.grey1}",
      // background: "{color.surface.grey1}",
      borderRadius: "{dimension.borderradius.medium}",
      borderLeft: `{dimension.borderwidth.wide} solid {color.basic.brand.4}`,
      boxShadow: "{material.hierarchy.main}",
      textAlign: "center"
    }
  },
  chart: {
    // 图表容器  
    container: {
      margin: "{dimension.margin.loose} 0",
      padding: "{dimension.padding.extraloose}",
      backgroundColor: "{color.surfacecontainer.white100}",
      borderRadius: "{dimension.borderradius.xl}",
      boxShadow: "{material.hierarchy.2f}",
      borderWidth: "{dimension.borderwidth.narrow}",
      borderColor: "{color.surfacecontainer.black12}",
      borderStyle: "solid"
    },
    // 图表标题
    title: {
      fontSize: "{font.size.large}",
      fontWeight: "{font.fontweight.semibold}",
      color: "{color.surfacecontainer.white100}",
      // color: "{color.onsurface.black88}",
      marginBottom: "{dimension.margin.base}",
      textAlign: 'center'
    },
    // 图例
    legend: {
      fontSize: "{font.size.small}",
      fontWeight: "400",
      fill: "{color.onsurface.black88}",
      display: 'flex',
      justifyContent: 'center',
      gap: "{dimension.gap.loose}",
      marginTop: "{dimension.margin.base}"
    },
    // 坐标轴  
    axis: {
      fontSize: "{font.size.tiny}",
      fontWeight: "400",
      fill: "{color.onsurface.black88}",
    },
  },
  // 表格元素配置
  table: {
    // 表格容器  
    container: {
      width: '100%',
      borderCollapse: 'collapse',
      backgroundColor: "{color.surfacecontainer.white100}",
      borderRadius: "{dimension.borderradius.large}",
      overflow: 'hidden',
      boxShadow: "{material.hierarchy.1f}",
      borderWidth: "{dimension.borderwidth.narrow}",
      borderColor: "{color.surfacecontainer.black12}",
      borderStyle: "solid",
    },
    th: {
      backgroundColor: "{color.surface.grey1}",
      color: "{color.onsurface.black88}",
      fontWeight: "{font.fontweight.semibold}",
      fontSize: "{font.size.small}",
      padding: "{dimension.padding.base} {dimension.padding.semiloose}",
      textAlign: 'left',
      borderBottom: `{dimension.borderwidth.base} solid {color.surfacecontainer.black20}`,
      backgroundImage: 'none',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    td: {
      fontSize: "{font.size.medium}",
      padding: "{dimension.padding.base} {dimension.padding.semiloose}",
      color: "{color.onsurface.black76}",
      verticalAlign: 'top'
    },
    // 表格行  
    tr: {
      fontSize: "{font.size.medium}",
      borderBottom: `{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}`,
      transition: CSS_VARIABLE_SYSTEM.ANIMATION.FAST,
      '&:hover': {
        backgroundColor: "{color.surface.grey0}"
      },
      '&:last-child': {
        borderBottom: "{dimension.borderwidth.none}"
      },
    }
  },

  // 按钮元素配置
  button: {
    // 主要按钮  
    primary: {
      fontSize: "{font.size.medium}",
      fontWeight: "{font.fontweight.semibold}",
      color: "{color.onprimary.white100}",
      background: `linear-gradient(135deg, {color.primary.brand4} 0%, {color.primary.brand6} 100%)`,
      // borderWidth: "{dimension.borderwidth.none}",
      borderRadius: "{dimension.borderradius.large}",
      padding: "{dimension.padding.base} {dimension.padding.extraloose}",
      cursor: 'pointer',
      transition: CSS_VARIABLE_SYSTEM.ANIMATION.SMOOTH,
      boxShadow: "{material.hierarchy.2f}",
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: "{dimension.gap.tight}",
      margin: "{dimension.margin.tight}",

      // 🆕 通透程度动作所需的默认属性
      opacity: '1.0',
      backdropFilter: 'none',

      // 🆕 视觉重量动作所需的默认属性
      transform: 'scale(1.0)',

      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: "{material.hierarchy.4f}",
        background: `linear-gradient(135deg, {color.primary.brand5} 0%, {color.onprimarycontainer.brand7} 100%)`
      }
    },

    // 次要按钮  TODO: 需要确定解析的权重
    secondary: {
      fontSize: "{font.size.medium}",
      fontWeight: "{font.fontweight.semibold}",
      color: "{color.secondary.violet6}",
      backgroundColor: "{color.secondarycontainer.violet1}",
      background: 'none',
      borderWidth: "{dimension.borderwidth.base}",
      borderColor: "{color.secondary.violet4}",
      borderStyle: "solid",
      borderRadius: "{dimension.borderradius.large}",
      padding: "{dimension.padding.base} {dimension.padding.extraloose}",
      cursor: 'pointer',
      transition: CSS_VARIABLE_SYSTEM.ANIMATION.SMOOTH,
      boxShadow: "{material.hierarchy.main}",
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: "{dimension.gap.tight}",
      margin: "{dimension.margin.tight}",

      // 🆕 通透程度动作所需的默认属性
      opacity: '0.98',
      backdropFilter: 'none',

      // 🆕 视觉重量动作所需的默认属性
      transform: 'scale(0.98)',

      '&:hover': {
        backgroundColor: "{color.secondarycontainer.violet2}",
        color: "{color.onsecondarycontainer.violet8}",
        transform: 'translateY(-1px)',
        boxShadow: "{material.hierarchy.2f}"
      }
    },

    // 成功按钮 TODO：需要确定解析的规则
    success: {
      fontSize: "{font.size.medium}",
      fontWeight: "{font.fontweight.semibold}",
      color: "{color.onprimary.white100}",
      background: `linear-gradient(135deg, {color.success.green4} 0%, {color.success.green6} 100%)`,
      borderWidth: "{dimension.borderwidth.none}",
      borderRadius: "{dimension.borderradius.large}",
      padding: "{dimension.padding.base} {dimension.padding.extraloose}",
      cursor: 'pointer',
      transition: CSS_VARIABLE_SYSTEM.ANIMATION.SMOOTH,
      boxShadow: "{material.hierarchy.1f}",
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: "{dimension.gap.tight}",
      margin: "{dimension.margin.tight}",
      '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: "{material.hierarchy.3f}",
        background: `linear-gradient(135deg, {color.success.green5} 0%, {color.success.green7} 100%)`
      }
    },

    // 警告按钮 TODO: 需要确定解析的规则
    warning: {
      fontSize: "{font.size.medium}",
      fontWeight: "{font.fontweight.semibold}",
      color: "{color.onprimary.white100}",
      background: `linear-gradient(135deg, {color.warning.orange4} 0%, {color.warning.orange6} 100%)`,
      borderWidth: "{dimension.borderwidth.none}",
      borderRadius: "{dimension.borderradius.large}",
      padding: "{dimension.padding.base} {dimension.padding.extraloose}",
      cursor: 'pointer',
      transition: CSS_VARIABLE_SYSTEM.ANIMATION.SMOOTH,
      boxShadow: "{material.hierarchy.1f}",
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: "{dimension.gap.tight}",
      margin: "{dimension.margin.tight}",
      '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: "{material.hierarchy.3f}",
        background: `linear-gradient(135deg, {color.warning.orange5} 0%, {color.warning.orange7} 100%)`
      }
    },

    // 错误按钮 TODO: 需要确定解析的规则
    error: {
      fontSize: "{font.size.medium}",
      fontWeight: "{font.fontweight.semibold}",
      color: "{color.onprimary.white100}",
      background: `linear-gradient(135deg, {color.error.red4} 0%, {color.error.red6} 100%)`,
      borderWidth: "{dimension.borderwidth.none}",
      borderRadius: "{dimension.borderradius.large}",
      padding: "{dimension.padding.base} {dimension.padding.extraloose}",
      cursor: 'pointer',
      transition: CSS_VARIABLE_SYSTEM.ANIMATION.SMOOTH,
      boxShadow: "{material.hierarchy.1f}",
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: "{dimension.gap.tight}",
      margin: "{dimension.margin.tight}",
      '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: "{material.hierarchy.3f}",
        background: `linear-gradient(135deg, {color.error.red5} 0%, {color.error.red7} 100%)`
      }
    },

    // 透明按钮 TODO: 需要确定解析的规则
    ghost: {
      fontSize: "{font.size.medium}",
      fontWeight: "{font.fontweight.medium}",
      color: "{color.primary.brand5}",
      backgroundColor: "transparent",
      borderWidth: "{dimension.borderwidth.none}",
      borderRadius: "{dimension.borderradius.medium}",
      padding: "{dimension.padding.tight} {dimension.padding.base}",
      cursor: 'pointer',
      transition: CSS_VARIABLE_SYSTEM.ANIMATION.FAST,
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: "{dimension.gap.tight}",

      // 🆕 通透程度动作所需的默认属性 - ghost 按钮天然适合透明效果
      opacity: '0.9',
      backdropFilter: 'blur(2px)',

      // 🆕 视觉重量动作所需的默认属性 - ghost 按钮较轻
      transform: 'scale(0.95)',

      '&:hover': {
        backgroundColor: "{color.primarycontainer.brand1}",
        color: "{color.primary.brand6}",
        boxShadow: "{material.hierarchy.B1}"
      }
    },

    // 链接按钮  TODO: 需要确定解析的规则
    link: {
      fontSize: "{font.size.medium}",
      fontWeight: "{font.fontweight.medium}",
      color: "{color.primary.brand5}",
      backgroundColor: "transparent",
      borderWidth: "{dimension.borderwidth.none}",
      padding: "{dimension.padding.extratight} {dimension.padding.tight}",
      cursor: 'pointer',
      transition: CSS_VARIABLE_SYSTEM.ANIMATION.FAST,
      textDecoration: "underline",
      textDecorationColor: "transparent",
      textUnderlineOffset: "4px",
      display: 'inline-flex',
      alignItems: 'center',
      gap: "{dimension.gap.tight}",
      '&:hover': {
        color: "{color.primary.brand6}",
        textDecorationColor: "{color.primarycontainer.brand2}"
      }
    },
  },

  // ==================== 列表元件 ====================
  list: {
    // 无序列表 
    unordered: {
      paddingLeft: "{dimension.padding.loose}",
      marginBottom: "{dimension.margin.base}",
      fontSize: "{font.size.medium}",
      lineHeight: "1.6",
      color: "{color.onsurface.black76}",
      marginBottom: "{dimension.margin.tight}",
      position: 'relative',
      '&::before': {
        content: "'•'",
        color: "{color.primary.brand5}",
        fontSize: '1.2em',
        position: 'absolute',
        top: '-3px',
        left: '0px'
      }
    },

    // 有序列表 TODO: 目前无法应用有序列表样式，因为八要素解析成 html，不是标准的 <ol> 标签
    ordered: {
      paddingLeft: "{dimension.padding.loose}",
      marginBottom: "{dimension.margin.base}",
      counterReset: 'list-counter',
      fontSize: "{font.size.medium}",
      lineHeight: "1.6",
      color: "{color.onsurface.black76}",
      marginBottom: "{dimension.margin.tight}",
      position: 'relative',
      counterIncrement: 'list-counter',
      '&::before': {
        content: 'counter(list-counter)',
        color: "{color.onprimary.white100}",
        fontWeight: "{font.fontweight.semibold}",
        fontSize: "{font.size.small}",
        backgroundColor: "{color.primary.brand5}",
        borderRadius: "50%",
        width: '20px',
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: '-30px',
        top: '2px',
        boxShadow: "{material.hierarchy.main}"
      }

    },
    // 任务列表  
    task: {
      paddingLeft: "{dimension.padding.base}",
      marginBottom: "{dimension.margin.base}",
      '& > :first-child': {
        fontSize: "{font.size.medium}",
        lineHeight: "1.6",
        color: CSS_VARIABLE_SYSTEM.COLOR.ON_SURFACE_BLACK76,
        marginBottom: "{dimension.margin.tight}",
        display: 'flex',
        alignItems: 'flex-start',
        gap: "{dimension.gap.tight}",
        '& input[type="checkbox"]': {
          marginTop: '4px',
          accentColor: CSS_VARIABLE_SYSTEM.COLOR.PRIMARY_BRAND5
        }
      }
    }
  },

  // ==================== 通知/警告元件 ====================
  alert: {
    // 成功提示  
    success: {
      padding: "{dimension.padding.base} {dimension.padding.loose}",
      margin: "{dimension.margin.base} 0",
      borderRadius: "{dimension.borderradius.medium}",
      boxShadow: "{material.hierarchy.main}",
      display: 'flex',
      alignItems: 'center',
      gap: "{dimension.gap.tight}",
      backgroundColor: "{color.success.green1}",
      borderWidth: "{dimension.borderwidth.narrow}",
      borderColor: "{color.success.green3}",
      borderStyle: "solid",
      color: "{color.success.green8}",
      borderLeft: `{dimension.borderwidth.wide} solid {color.success.green5}`,

      // 🆕 通透程度动作所需的默认属性
      opacity: '0.95',
      backdropFilter: 'none',

      // 🆕 视觉重量动作所需的默认属性 - 成功提示正常大小
      transform: 'scale(1.0)'
    },

    // 警告提示  
    warning: {
      padding: "{dimension.padding.base} {dimension.padding.loose}",
      margin: "{dimension.margin.base} 0",
      borderRadius: "{dimension.borderradius.medium}",
      boxShadow: "{material.hierarchy.main}",
      display: 'flex',
      alignItems: 'center',
      gap: "{dimension.gap.tight}",
      backgroundColor: "{color.warning.orange1}",
      borderWidth: "{dimension.borderwidth.narrow}",
      borderColor: "{color.warning.orange3}",
      borderStyle: "solid",
      color: "{color.warning.orange8}",
      borderLeftWidth: "{dimension.borderwidth.wide}",
      borderLeftColor: "{color.warning.orange5}",
      borderLeftStyle: "solid",

      // 🆕 通透程度动作所需的默认属性
      opacity: '0.95',
      backdropFilter: 'none',

      // 🆕 视觉重量动作所需的默认属性 - 警告提示稍大
      transform: 'scale(1.01)'
    },

    // 错误提示  
    error: {
      padding: "{dimension.padding.base} {dimension.padding.loose}",
      margin: "{dimension.margin.base} 0",
      borderRadius: "{dimension.borderradius.medium}",
      boxShadow: "{material.hierarchy.main}",
      display: 'flex',
      alignItems: 'center',
      gap: "{dimension.gap.tight}",
      backgroundColor: "{color.error.red1}",
      borderWidth: "{dimension.borderwidth.narrow}",
      borderColor: "{color.error.red3}",
      borderStyle: "solid",
      color: "{color.error.red8}",
      borderLeftWidth: "{dimension.borderwidth.wide}",
      borderLeftColor: "{color.error.red5}",
      borderLeftStyle: "solid",

      // 🆕 通透程度动作所需的默认属性
      opacity: '0.95',
      backdropFilter: 'none',

      // 🆕 视觉重量动作所需的默认属性 - 错误提示更大（最紧急）
      transform: 'scale(1.03)'
    },

    // 信息提示  
    info: {
      padding: "{dimension.padding.base} {dimension.padding.loose}",
      margin: "{dimension.margin.base} 0",
      borderRadius: "{dimension.borderradius.medium}",
      boxShadow: "{material.hierarchy.main}",
      display: 'flex',
      alignItems: 'center',
      gap: "{dimension.gap.tight}",
      backgroundColor: "{color.primarycontainer.brand1}",
      borderWidth: "{dimension.borderwidth.narrow}",
      borderColor: "{color.primarycontainer.brand2}",
      borderStyle: "solid",
      color: "{color.onprimarycontainer.brand8}",
      borderLeftWidth: "{dimension.borderwidth.wide}",
      borderLeftColor: "{color.primary.brand5}",
      borderLeftStyle: "solid",

      // 🆕 通透程度动作所需的默认属性
      opacity: '0.95',
      backdropFilter: 'none',

      // 🆕 视觉重量动作所需的默认属性 - 信息提示正常大小
      transform: 'scale(1.0)'
    }
  },

  // ==================== 卡片元件 ====================
  card: {
    // 标准卡片  
    standard: {
      backgroundColor: "{color.surfacecontainer.white100}",
      borderRadius: "{dimension.borderradius.xl}",
      borderWidth: "{dimension.borderwidth.narrow}",
      borderColor: "{color.surfacecontainer.black12}",
      borderStyle: "solid",
      boxShadow: "{material.hierarchy.1f}",
      padding: "{dimension.padding.loose}",
      margin: "{dimension.margin.loose} 0",
      backgroundImage: 'none',
      transition: CSS_VARIABLE_SYSTEM.ANIMATION.SMOOTH,

      // 🆕 通透程度动作所需的默认属性
      opacity: '1.0',
      backdropFilter: 'none',

      // 🆕 视觉重量动作所需的默认属性
      transform: 'scale(1.0)',

      '&:hover': {
        boxShadow: "{material.hierarchy.2f}",
        transform: 'translateY(-2px)'
      }
    },

    // 高级卡片  
    elevated: {
      backgroundColor: "{color.surfacecontainer.white100}",
      borderRadius: "{dimension.borderradius.xxl}",
      borderWidth: "{dimension.borderwidth.none}",
      boxShadow: "{material.hierarchy.3f}",
      padding: "{dimension.padding.extraloose}",
      margin: "{dimension.margin.loose} 0",
      backgroundImage: 'none',
      transition: CSS_VARIABLE_SYSTEM.ANIMATION.SMOOTH,

      // 🆕 通透程度动作所需的默认属性 - 高级卡片稍微透明营造层次感
      opacity: '0.98',
      backdropFilter: 'blur(1px)',

      // 🆕 视觉重量动作所需的默认属性 - 高级卡片稍大
      transform: 'scale(1.02)',

      '&:hover': {
        boxShadow: "{material.hierarchy.4f}",
        transform: 'translateY(-4px)'
      }
    },

    // 轮廓卡片  
    outlined: {
      backgroundColor: "transparent",
      borderRadius: "{dimension.borderradius.large}",
      borderWidth: "{dimension.borderwidth.base}",
      borderColor: "{color.surfacecontainer.black20}",
      borderStyle: "solid",
      boxShadow: "{material.hierarchy.ground}",
      padding: "{dimension.padding.loose}",
      margin: "{dimension.margin.base} 0",
      transition: CSS_VARIABLE_SYSTEM.ANIMATION.SMOOTH,

      // 🆕 通透程度动作所需的默认属性 - 轮廓卡片适合透明效果
      opacity: '0.95',
      backdropFilter: 'none',

      // 🆕 视觉重量动作所需的默认属性 - 轮廓卡片较轻
      transform: 'scale(0.98)',

      '&:hover': {
        borderColor: "{color.primarycontainer.brand2}",
        backgroundColor: "{color.surface.grey0}"
      }
    },

    highlight: {
      type: 'template',
      markdownMapping: {
        h2: 'title',
        others: 'content'
      },
      style: {
        borderRadius: "{dimension.borderradius.xl}",
        borderWidth: "{dimension.borderwidth.narrow}",
        borderColor: "{color.surfacecontainer.black12}",
        borderStyle: "solid",
        boxShadow: "{material.hierarchy.1f}",
        padding: "0 0 {dimension.padding.base}",
        overflow: 'hidden',
      },
      title: {
        style: {
          padding: "{dimension.padding.base}",
          background: "{color.primary.brand5}",
        },
        metaType: 'text',
        variant: 'cardTitle',
      },
      content: {
        style: {
          padding: "{dimension.padding.base}",
        }
      }
    },

    custom: {
      type: 'template',
      // Markdown 转换映射规则
      markdownMapping: {
        // H2 (##) 映射到 title
        h2: 'title',
        // H3 (###) 映射到 content.title
        h3: 'content.title',
        // 普通文本段落映射到 content.segment
        p: 'content.segment',

      },
      style: {
        display: 'flex',
        flexDirection: 'column',
        borderRadius: "{dimension.borderradius.xl}",
        padding: "{dimension.padding.tight}",
        background: `linear-gradient(to top right, #975af4, #2f7cf8 40%, #78aafa 65%, #934cff 100%)`,
      },
      title: {
        style: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: "{dimension.padding.base} {dimension.padding.loose}",
          justifyContent: 'space-between',
        },
        metaType: 'text',
        variant: 'cardTitle',
      },
      content: {
        type: 'template',
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          borderRadius: "{dimension.borderradius.large}",
          background: "{color.surfacecontainer.white88}",
          padding: "{dimension.padding.loose}",
          gap: "{dimension.gap.base}",
          color: "{color.onprimary.white100}",
        },
        title: {
          metaType: 'text',
          variant: 'cardSubtitle',
        },
        segment: {
          metaType: 'text',
          variant: 'cardSegment',
        }
      },
    },
    // Copy Start
    neomorphismStandard: {
      type: 'template',
      markdownMapping: {
        h2: 'title',
        h3: 'content.title',
        p: 'content.segment',
        'button:primary': 'content.buttonContainer.button',
        'button:secondary': 'content.buttonContainer.secondaryButton',
        img: 'content.image',
        ul: 'content.list',
        table: 'content.table',
        blockquote: 'content.quote',
        code: 'content.codeBlock'
      },
      style: {
        display: 'flex',
        flexDirection: 'column',
        borderRadius: "{dimension.borderradius.xxl}",
        padding: "{dimension.padding.base}",
        background: "{color.surface.grey1}",
        boxShadow: `{material.hierarchy.B2}, {material.hierarchy.3f}`,
        border: `{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: "''",
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          background: `linear-gradient(135deg, {color.surfacecontainer.white100} 0%, {color.surface.grey2} 100%)`,
          opacity: '0.1',
          borderRadius: "{dimension.borderradius.xxl}",
        }
      },
      title: {
        style: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: "{dimension.padding.semiloose} {dimension.padding.loose}",
          justifyContent: 'center',
          borderRadius: "{dimension.borderradius.large}",
          background: "{color.primary.brand5}",
          boxShadow: `{material.hierarchy.B1}`,
          marginBottom: "{dimension.margin.base}",
        },
        metaType: 'text',
        variant: 'neomorphismTitle',
      },
      content: {
        type: 'template',
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          borderRadius: "{dimension.borderradius.large}",
          background: "{color.surface.grey0}",
          padding: "{dimension.padding.loose}",
          gap: "{dimension.gap.base}",
          boxShadow: `{material.hierarchy.B1}`,
          position: 'relative',
        },
        title: {
          metaType: 'text',
          variant: 'neomorphismSubtitle',
        },
        segment: {
          metaType: 'text',
          variant: 'neomorphismSegment',
        },
        buttonContainer: {
          type: 'template',
          style: {
            position: 'relative',
            display: 'flex',
            flexDirection: 'row',
          },
          button: {
            metaType: 'button',
            variant: 'primary',
            style: {
              alignSelf: 'flex-start',
            }
          },
          secondaryButton: {
            metaType: 'button',
            variant: 'secondary',
            style: {
              alignSelf: 'flex-start'
            }
          },
        },
        image: {
          metaType: 'image',
          variant: 'rounded',
          style: {
            marginTop: "{dimension.margin.base}"
          }
        },
        list: {
          metaType: 'list',
          variant: 'unordered'
        },
        table: {
          metaType: 'table',
          variant: 'container'
        },
        quote: {
          metaType: 'text',
          variant: 'quote'
        },
        codeBlock: {
          metaType: 'text',
          variant: 'codeBlock'
        }
      },
    },

    // 2. 新拟态底部按钮布局
    neomorphismFooterActions: {
      type: 'template',
      markdownMapping: {
        h2: 'title',
        h3: 'content.title',
        p: 'content.segment',
        img: 'content.image',
        ul: 'content.list',
        'button:primary': 'footer.primaryButton',
        'button:secondary': 'footer.secondaryButton',
      },
      style: {
        display: 'flex',
        flexDirection: 'column',
        borderRadius: "{dimension.borderradius.xxl}",
        padding: "{dimension.padding.base}",
        background: "{color.surface.grey1}",
        boxShadow: `{material.hierarchy.B2}, {material.hierarchy.3f}`,
        border: `{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: "''",
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          background: `linear-gradient(135deg, {color.surfacecontainer.white100} 0%, {color.surface.grey2} 100%)`,
          opacity: '0.1',
          borderRadius: "{dimension.borderradius.xxl}",
        }
      },
      title: {
        style: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: "{dimension.padding.semiloose} {dimension.padding.loose}",
          justifyContent: 'center',
          borderRadius: "{dimension.borderradius.large}",
          background: "{color.primary.brand5}",
          boxShadow: `{material.hierarchy.B1}`,
          marginBottom: "{dimension.margin.base}",
        },
        metaType: 'text',
        variant: 'neomorphismTitle',
      },
      content: {
        type: 'template',
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          borderRadius: "{dimension.borderradius.large}",
          background: "{color.surface.grey0}",
          padding: "{dimension.padding.loose}",
          gap: "{dimension.gap.base}",
          boxShadow: `{material.hierarchy.B1}`,
          position: 'relative',
          marginBottom: "{dimension.margin.base}",
        },
        title: {
          metaType: 'text',
          variant: 'neomorphismSubtitle',
        },
        segment: {
          metaType: 'text',
          variant: 'neomorphismSegment',
        },
        image: {
          metaType: 'image',
          variant: 'rounded'
        },
        list: {
          metaType: 'list',
          variant: 'unordered'
        }
      },
      footer: {
        type: 'template',
        style: {
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          gap: "{dimension.gap.base}",
          padding: "{dimension.padding.base} {dimension.padding.loose}",
          background: "{color.surface.grey0}",
          borderRadius: "{dimension.borderradius.large}",
          boxShadow: `{material.hierarchy.B1}`,
        },
        primaryButton: {
          metaType: 'button',
          variant: 'primary'
        },
        secondaryButton: {
          metaType: 'button',
          variant: 'secondary'
        }
      }
    },

    // 3. 新拟态侧边布局
    neomorphismSidebar: {
      type: 'template',
      markdownMapping: {
        h2: 'title',
        h3: 'main.title',
        p: 'main.segment',
        img: 'main.image',
        'button:primary': 'sidebar.primaryButton',
        'button:secondary': 'sidebar.secondaryButton',
        ul: 'sidebar.list'
      },
      style: {
        display: 'flex',
        flexDirection: 'column',
        borderRadius: "{dimension.borderradius.xxl}",
        padding: "{dimension.padding.base}",
        background: "{color.surface.grey1}",
        boxShadow: `{material.hierarchy.B2}, {material.hierarchy.3f}`,
        border: `{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: "''",
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          background: `linear-gradient(135deg, {color.surfacecontainer.white100} 0%, {color.surface.grey2} 100%)`,
          opacity: '0.1',
          borderRadius: "{dimension.borderradius.xxl}",
        }
      },
      title: {
        style: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: "{dimension.padding.semiloose} {dimension.padding.loose}",
          justifyContent: 'center',
          borderRadius: "{dimension.borderradius.large}",
          background: "{color.primary.brand5}",
          boxShadow: `{material.hierarchy.B1}`,
          marginBottom: "{dimension.margin.base}",
        },
        metaType: 'text',
        variant: 'neomorphismTitle',
      },
      container: {
        type: 'template',
        style: {
          display: 'flex',
          flexDirection: 'row',
          gap: "{dimension.gap.base}",
          background: "{color.surface.grey0}",
          borderRadius: "{dimension.borderradius.large}",
          boxShadow: `{material.hierarchy.B1}`,
          overflow: 'hidden'
        },
        main: {
          type: 'template',
          style: {
            flex: '1',
            padding: "{dimension.padding.loose}",
            display: 'flex',
            flexDirection: 'column',
            gap: "{dimension.gap.base}"
          },
          title: {
            metaType: 'text',
            variant: 'neomorphismSubtitle',
          },
          segment: {
            metaType: 'text',
            variant: 'neomorphismSegment',
          },
          image: {
            metaType: 'image',
            variant: 'rounded'
          }
        },
        sidebar: {
          type: 'template',
          style: {
            width: '200px',
            padding: "{dimension.padding.base}",
            background: "{color.surface.grey1}",
            display: 'flex',
            flexDirection: 'column',
            gap: "{dimension.gap.tight}",
            borderLeft: `{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}`
          },
          primaryButton: {
            metaType: 'button',
            variant: 'primary',
            style: {
              width: '100%'
            }
          },
          secondaryButton: {
            metaType: 'button',
            variant: 'secondary',
            style: {
              width: '100%'
            }
          },
          list: {
            metaType: 'list',
            variant: 'unordered'
          }
        }
      }
    },

    // 4. 新拟态仪表板布局
    neomorphismDashboard: {
      type: 'template',
      markdownMapping: {
        h2: 'title',
        h3: 'metrics.title',
        'chart:line': 'charts.lineChart',
        'chart:bar': 'charts.barChart',
        table: 'data.table',
        p: 'summary.text'
      },
      style: {
        display: 'flex',
        flexDirection: 'column',
        borderRadius: "{dimension.borderradius.xxl}",
        padding: "{dimension.padding.base}",
        background: "{color.surface.grey1}",
        boxShadow: `{material.hierarchy.B2}, {material.hierarchy.3f}`,
        border: `{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}`,
        position: 'relative',
        overflow: 'hidden',
        minHeight: '400px',
        '&::before': {
          content: "''",
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          background: `linear-gradient(135deg, {color.surfacecontainer.white100} 0%, {color.surface.grey2} 100%)`,
          opacity: '0.1',
          borderRadius: "{dimension.borderradius.xxl}",
        }
      },
      title: {
        style: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: "{dimension.padding.semiloose} {dimension.padding.loose}",
          justifyContent: 'center',
          borderRadius: "{dimension.borderradius.large}",
          background: "{color.primary.brand5}",
          boxShadow: `{material.hierarchy.B1}`,
          marginBottom: "{dimension.margin.base}",
        },
        metaType: 'text',
        variant: 'neomorphismTitle',
      },
      dashboard: {
        type: 'template',
        style: {
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: 'auto auto',
          gap: "{dimension.gap.base}",
          background: "{color.surface.grey0}",
          borderRadius: "{dimension.borderradius.large}",
          padding: "{dimension.padding.loose}",
          boxShadow: `{material.hierarchy.B1}`,
        },
        metrics: {
          type: 'template',
          style: {
            gridColumn: '1 / -1',
            display: 'flex',
            flexDirection: 'column',
            gap: "{dimension.gap.tight}"
          },
          title: {
            metaType: 'text',
            variant: 'neomorphismSubtitle',
          }
        },
        charts: {
          type: 'template',
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: "{dimension.gap.base}"
          },
          lineChart: {
            metaType: 'chart',
            variant: 'container'
          },
          barChart: {
            metaType: 'chart',
            variant: 'container'
          }
        },
        data: {
          type: 'template',
          style: {
            display: 'flex',
            flexDirection: 'column'
          },
          table: {
            metaType: 'table',
            variant: 'container'
          }
        },
        summary: {
          type: 'template',
          style: {
            gridColumn: '1 / -1',
            marginTop: "{dimension.margin.base}"
          },
          text: {
            metaType: 'text',
            variant: 'neomorphismSegment'
          }
        }
      }
    },

    // ==================== 科技渐变风格卡片系列 ====================

    // 1. 科技渐变标准布局
    techGradientStandard: {
      type: 'template',
      markdownMapping: {
        h2: 'title',
        h3: 'content.title',
        p: 'content.segment',
        'button:primary': 'content.buttonContainer.button',
        'button:secondary': 'content.buttonContainer.secondaryButton',
        img: 'content.image',
        ul: 'content.list',
        table: 'content.table',
        blockquote: 'content.quote',
        code: 'content.codeBlock'
      },
      style: {
        display: 'flex',
        flexDirection: 'column',
        borderRadius: "{dimension.borderradius.xl}",
        padding: "{dimension.padding.tight}",
        background: `linear-gradient(135deg, {color.primary.brand4} 0%, {color.secondary.violet5} 35%, {color.primary.brand6} 100%)`,
        boxShadow: `{material.hierarchy.4f}`,
        border: `{dimension.borderwidth.narrow} solid {color.primarycontainer.brand2}`,
        position: 'relative',
        overflow: 'hidden',
        '&::after': {
          content: "''",
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, {color.surfacecontainer.white32} 60deg, transparent 120deg)`,
          opacity: '0.3',
          animation: 'rotate 8s linear infinite',
        }
      },
      title: {
        style: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: "{dimension.padding.base} {dimension.padding.loose}",
          justifyContent: 'space-between',
          borderRadius: "{dimension.borderradius.medium}",
          background: `linear-gradient(90deg, {color.surfacecontainer.white88} 0%, {color.surfacecontainer.white76} 100%)`,
          backdropFilter: 'blur(10px)',
          boxShadow: `{material.hierarchy.2f}`,
          border: `{dimension.borderwidth.narrow} solid {color.surfacecontainer.white48}`,
          marginBottom: "{dimension.margin.base}",
        },
        metaType: 'text',
        variant: 'techGradientTitle',
      },
      content: {
        type: 'template',
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          borderRadius: "{dimension.borderradius.medium}",
          background: `linear-gradient(180deg, {color.surfacecontainer.white88} 0%, {color.surfacecontainer.white76} 100%)`,
          padding: "{dimension.padding.loose}",
          gap: "{dimension.gap.base}",
          backdropFilter: 'blur(10px)',
          boxShadow: `{material.hierarchy.B1}`,
          border: `{dimension.borderwidth.narrow} solid {color.surfacecontainer.white48}`,
          position: 'relative',
        },
        title: {
          metaType: 'text',
          variant: 'techGradientSubtitle',
        },
        segment: {
          metaType: 'text',
          variant: 'techGradientSegment',
        },
        buttonContainer: {
          type: 'template',
          style: {
            position: 'relative',
            display: 'flex',
            flexDirection: 'row',
          },
          button: {
            metaType: 'button',
            variant: 'primary',
            style: {
              alignSelf: 'flex-start',
            }
          },
          secondaryButton: {
            metaType: 'button',
            variant: 'secondary',
            style: {
              alignSelf: 'flex-start'
            }
          },
        },
        image: {
          metaType: 'image',
          variant: 'rounded',
          style: {
            marginTop: "{dimension.margin.base}"
          }
        },
        list: {
          metaType: 'list',
          variant: 'unordered'
        },
        table: {
          metaType: 'table',
          variant: 'container'
        },
        quote: {
          metaType: 'text',
          variant: 'quote'
        },
        codeBlock: {
          metaType: 'text',
          variant: 'codeBlock'
        }
      },
    },

    // 2. 科技渐变头部操作布局
    techGradientHeaderActions: {
      type: 'template',
      markdownMapping: {
        h2: 'header.title',
        'button:primary': 'header.actions.primaryAction',
        'button:secondary': 'header.actions.secondaryAction',
        h3: 'content.title',
        p: 'content.segment',
        img: 'content.image',
        ul: 'content.list'
      },
      style: {
        display: 'flex',
        flexDirection: 'column',
        borderRadius: "{dimension.borderradius.xl}",
        padding: "{dimension.padding.tight}",
        background: `linear-gradient(135deg, {color.primary.brand4} 0%, {color.secondary.violet5} 35%, {color.primary.brand6} 100%)`,
        boxShadow: `{material.hierarchy.4f}`,
        border: `{dimension.borderwidth.narrow} solid {color.primarycontainer.brand2}`,
        position: 'relative',
        overflow: 'hidden',
        '&::after': {
          content: "''",
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, {color.surfacecontainer.white32} 60deg, transparent 120deg)`,
          opacity: '0.3',
          animation: 'rotate 8s linear infinite',
        }
      },
      header: {
        type: 'template',
        style: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: "{dimension.padding.base} {dimension.padding.loose}",
          borderRadius: "{dimension.borderradius.medium}",
          background: `linear-gradient(90deg, {color.surfacecontainer.white88} 0%, {color.surfacecontainer.white76} 100%)`,
          backdropFilter: 'blur(10px)',
          boxShadow: `{material.hierarchy.2f}`,
          border: `{dimension.borderwidth.narrow} solid {color.surfacecontainer.white48}`,

        },
        title: {
          metaType: 'text',
          variant: 'techGradientTitle',
        },
        actions: {
          type: 'template',
          style: {
            display: 'flex',
            flexDirection: 'row',
            width: 'auto',
            gap: "{dimension.gap.tight}"
          },
          primaryAction: {
            metaType: 'button',
            variant: 'primary'
          },
          secondaryAction: {
            metaType: 'button',
            variant: 'secondary'
          }
        }
      },
      content: {
        type: 'template',
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          marginTop: "{dimension.margin.base}",
          borderRadius: "{dimension.borderradius.medium}",
          background: `linear-gradient(180deg, {color.surfacecontainer.white88} 0%, {color.surfacecontainer.white76} 100%)`,
          padding: "{dimension.padding.loose}",
          gap: "{dimension.gap.base}",
          backdropFilter: 'blur(10px)',
          boxShadow: `{material.hierarchy.B1}`,
          border: `{dimension.borderwidth.narrow} solid {color.surfacecontainer.white48}`,
          position: 'relative',
        },
        title: {
          metaType: 'text',
          variant: 'techGradientSubtitle',
        },
        segment: {
          metaType: 'text',
          variant: 'techGradientSegment',
        },
        image: {
          metaType: 'image',
          variant: 'rounded'
        },
        list: {
          metaType: 'list',
          variant: 'unordered'
        }
      }
    },

    // 3. 科技渐变画廊布局
    techGradientGallery: {
      type: 'template',
      markdownMapping: {
        h2: 'title',
        h3: 'gallery.title',
        'img:1': 'gallery.images.image1',
        'img:2': 'gallery.images.image2',
        'img:3': 'gallery.images.image3',
        'img:4': 'gallery.images.image4',
        p: 'gallery.description'
      },
      style: {
        display: 'flex',
        flexDirection: 'column',
        borderRadius: "{dimension.borderradius.xl}",
        padding: "{dimension.padding.tight}",
        background: `linear-gradient(135deg, {color.primary.brand4} 0%, {color.secondary.violet5} 35%, {color.primary.brand6} 100%)`,
        boxShadow: `{material.hierarchy.4f}`,
        border: `{dimension.borderwidth.narrow} solid {color.primarycontainer.brand2}`,
        position: 'relative',
        overflow: 'hidden',
        '&::after': {
          content: "''",
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, {color.surfacecontainer.white32} 60deg, transparent 120deg)`,
          opacity: '0.3',
          animation: 'rotate 8s linear infinite',
        }
      },
      title: {
        style: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: "{dimension.padding.base} {dimension.padding.loose}",
          justifyContent: 'center',
          borderRadius: "{dimension.borderradius.medium}",
          background: `linear-gradient(90deg, {color.surfacecontainer.white88} 0%, {color.surfacecontainer.white76} 100%)`,
          backdropFilter: 'blur(10px)',
          boxShadow: `{material.hierarchy.2f}`,
          border: `{dimension.borderwidth.narrow} solid {color.surfacecontainer.white48}`,
          marginBottom: "{dimension.margin.base}",
        },
        metaType: 'text',
        variant: 'techGradientTitle',
      },
      gallery: {
        type: 'template',
        style: {
          display: 'flex',
          flexDirection: 'column',
          borderRadius: "{dimension.borderradius.medium}",
          background: `linear-gradient(180deg, {color.surfacecontainer.white88} 0%, {color.surfacecontainer.white76} 100%)`,
          padding: "{dimension.padding.loose}",
          gap: "{dimension.gap.base}",
          backdropFilter: 'blur(10px)',
          boxShadow: `{material.hierarchy.B1}`,
          border: `{dimension.borderwidth.narrow} solid {color.surfacecontainer.white48}`,
        },
        title: {
          metaType: 'text',
          variant: 'techGradientSubtitle',
        },
        images: {
          type: 'template',
          style: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: "{dimension.gap.base}",
            marginTop: "{dimension.margin.base}"
          },
          image1: {
            metaType: 'image',
            variant: 'rounded'
          },
          image2: {
            metaType: 'image',
            variant: 'rounded'
          },
          image3: {
            metaType: 'image',
            variant: 'rounded'
          },
          image4: {
            metaType: 'image',
            variant: 'rounded'
          }
        },
        description: {
          metaType: 'text',
          variant: 'techGradientSegment',
          style: {
            marginTop: "{dimension.margin.base}"
          }
        }
      }
    },

    // ==================== 优雅青蓝卡片系列 ====================

    // 1. 优雅青蓝标准布局  
    elegantStandard: {
      type: 'template',
      markdownMapping: {
        h2: 'title',
        h3: 'content.title',
        p: 'content.segment',
        'button:primary': 'content.buttonContainer.button',
        'button:secondary': 'content.buttonContainer.secondaryButton',
        img: 'content.image',
        ul: 'content.list',
        table: 'content.table',
        blockquote: 'content.quote',
        code: 'content.codeBlock'
      },
      style: {
        display: 'flex',
        flexDirection: 'column',
        borderRadius: "{dimension.borderradius.xxxl}",
        padding: "{dimension.padding.semiloose}",
        background: `linear-gradient(145deg, {color.primarycontainer.brand1} 0%, {color.primarycontainer.brand2} 50%, {color.secondarycontainer.violet1} 100%)`,
        boxShadow: `{material.hierarchy.2f}`,
        border: `{dimension.borderwidth.base} solid {color.primary.brand3}`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: "''",
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          backgroundImage: `radial-gradient(circle at 25% 25%, {color.primarycontainer.brand2} 0%, transparent 50%), 
                       radial-gradient(circle at 75% 75%, {color.secondarycontainer.violet2} 0%, transparent 50%)`,
          opacity: '0.4',
          borderRadius: "{dimension.borderradius.xxxl}",
        }
      },
      title: {
        style: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: "{dimension.padding.base} {dimension.padding.semiloose}",
          justifyContent: 'center',
          borderRadius: "{dimension.borderradius.xl}",
          background: `linear-gradient(90deg, {color.surfacecontainer.white100} 0%, {color.secondarycontainer.violet0} 100%)`,
          boxShadow: `{material.hierarchy.1f}`,
          marginBottom: "{dimension.margin.tight}",
          border: `{dimension.borderwidth.narrow} solid {color.primary.brand4}`,
          position: 'relative',
          '&::before': {
            content: "''",
            position: 'absolute',
            left: "{dimension.padding.base}",
            top: '50%',
            transform: 'translateY(-50%)',
            width: '3px',
            height: '50%',
            background: `linear-gradient(180deg, {color.primary.brand5} 0%, {color.primary.brand6} 100%)`,
            borderRadius: "{dimension.borderradius.xs}",
          },
          '&::after': {
            content: "''",
            position: 'absolute',
            right: "{dimension.padding.base}",
            top: '50%',
            transform: 'translateY(-50%)',
            width: '3px',
            height: '50%',
            background: `linear-gradient(180deg, {color.primary.brand5} 0%, {color.primary.brand6} 100%)`,
            borderRadius: "{dimension.borderradius.xs}",
          }
        },
        metaType: 'text',
        variant: 'elegantCardTitle',
      },
      content: {
        type: 'template',
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          borderRadius: "{dimension.borderradius.xl}",
          background: `linear-gradient(135deg, {color.surfacecontainer.white100} 0%, {color.surface.grey0} 100%)`,
          padding: "{dimension.padding.extraloose}",
          gap: "{dimension.gap.tight}",
          boxShadow: `{material.hierarchy.B1}, {material.hierarchy.main}`,
          border: `{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}`,
          position: 'relative',
          '&::before': {
            content: "''",
            position: 'absolute',
            top: "{dimension.padding.base}",
            left: "{dimension.padding.base}",
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, {color.secondary.violet4} 0%, {color.secondary.violet6} 100%)`,
            boxShadow: `{material.hierarchy.main}`,
          },
          '&::after': {
            content: "''",
            position: 'absolute',
            top: "{dimension.padding.base}",
            right: "{dimension.padding.base}",
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, {color.secondary.violet4} 0%, {color.secondary.violet6} 100%)`,
            boxShadow: `{material.hierarchy.main}`,
          },
          '& > *:last-child::before': {
            content: "''",
            position: 'absolute',
            bottom: `calc(-{dimension.padding.extraloose} + {dimension.padding.base})`, // 相对于content容器的位置
            right: `calc(-{dimension.padding.extraloose} + {dimension.padding.base})`, // 相对于content容器的位置
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, {color.secondary.violet4} 0%, {color.secondary.violet6} 100%)`,
            boxShadow: `{material.hierarchy.main}`,
          },
          '& > *:last-child::after': {
            content: "''",
            position: 'absolute',
            bottom: `calc(-{dimension.padding.extraloose} + {dimension.padding.base})`, // 相对于content容器的位置
            left: `calc(-{dimension.padding.extraloose} + {dimension.padding.base})`, // 相对于content容器的位置
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, {color.secondary.violet4} 0%, {color.secondary.violet6} 100%)`,
            boxShadow: `{material.hierarchy.main}`,
          },
        },
        title: {
          style: {
            position: 'relative',
          },
          metaType: 'text',
          variant: 'elegantCardSubtitle',
        },
        segment: {
          style: {
            position: 'relative',
          },
          metaType: 'text',
          variant: 'elegantCardSegment',
        },
        buttonContainer: {
          type: 'template',
          style: {
            position: 'relative',
            display: 'flex',
            flexDirection: 'row',
          },
          button: {
            metaType: 'button',
            variant: 'primary',
            style: {
              alignSelf: 'flex-start',
            }
          },
          secondaryButton: {
            metaType: 'button',
            variant: 'secondary',
            style: {
              alignSelf: 'flex-start'
            }
          },
        },
        image: {
          metaType: 'image',
          variant: 'rounded',
          style: {
            marginTop: "{dimension.margin.base}"
          }
        },
        list: {
          metaType: 'list',
          variant: 'unordered'
        },
        table: {
          metaType: 'table',
          variant: 'container'
        },
        quote: {
          metaType: 'text',
          variant: 'quote'
        },
        codeBlock: {
          metaType: 'text',
          variant: 'codeBlock'
        }
      },
    },

    // 2. 优雅青蓝列表布局
    elegantList: {
      type: 'template',
      markdownMapping: {
        h2: 'title',
        h3: 'listContainer.listTitle',
        'li:1': 'listContainer.list.item1',
        'li:2': 'listContainer.list.item2',
        'li:3': 'listContainer.list.item3',
        'li:4': 'listContainer.list.item4',
        'li:5': 'listContainer.list.item5',
        p: 'summary.text'
      },
      style: {
        display: 'flex',
        flexDirection: 'column',
        borderRadius: "{dimension.borderradius.xxxl}",
        padding: "{dimension.padding.semiloose}",
        background: `linear-gradient(145deg, {color.primarycontainer.brand1} 0%, {color.primarycontainer.brand2} 50%, {color.secondarycontainer.violet1} 100%)`,
        boxShadow: `{material.hierarchy.2f}`,
        border: `{dimension.borderwidth.base} solid {color.primary.brand3}`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: "''",
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          backgroundImage: `radial-gradient(circle at 25% 25%, {color.primarycontainer.brand2} 0%, transparent 50%), 
                       radial-gradient(circle at 75% 75%, {color.secondarycontainer.violet2} 0%, transparent 50%)`,
          opacity: '0.4',
          borderRadius: "{dimension.borderradius.xxxl}",
        },
      },
      title: {
        style: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: "{dimension.padding.base} {dimension.padding.semiloose}",
          justifyContent: 'center',
          borderRadius: "{dimension.borderradius.xl}",
          background: `linear-gradient(90deg, {color.surfacecontainer.white100} 0%, {color.secondarycontainer.violet0} 100%)`,
          boxShadow: `{material.hierarchy.1f}`,
          marginBottom: "{dimension.margin.tight}",
          border: `{dimension.borderwidth.narrow} solid {color.primary.brand4}`,
          position: 'relative',
          '&::before': {
            content: "''",
            position: 'absolute',
            left: "{dimension.padding.base}",
            top: '50%',
            transform: 'translateY(-50%)',
            width: '3px',
            height: '50%',
            background: `linear-gradient(180deg, {color.primary.brand5} 0%, {color.primary.brand6} 100%)`,
            borderRadius: "{dimension.borderradius.xs}",
          },
          '&::after': {
            content: "''",
            position: 'absolute',
            right: "{dimension.padding.base}",
            top: '50%',
            transform: 'translateY(-50%)',
            width: '3px',
            height: '50%',
            background: `linear-gradient(180deg, {color.primary.brand5} 0%, {color.primary.brand6} 100%)`,
            borderRadius: "{dimension.borderradius.xs}",
          }
        },
        metaType: 'text',
        variant: 'elegantCardTitle',
      },
      listContainer: {
        type: 'template',
        style: {
          display: 'flex',
          flexDirection: 'column',
          borderRadius: "{dimension.borderradius.xl}",
          background: `linear-gradient(135deg, {color.surfacecontainer.white100} 0%, {color.surface.grey0} 100%)`,
          padding: "{dimension.padding.extraloose}",
          gap: "{dimension.gap.base}",
          boxShadow: `{material.hierarchy.B1}, {material.hierarchy.main}`,
          border: `{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}`,
          marginBottom: "{dimension.margin.base}",
          position: 'relative',
          '&::before': {
            content: "''",
            position: 'absolute',
            top: "{dimension.padding.base}",
            left: "{dimension.padding.base}",
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, {color.secondary.violet4} 0%, {color.secondary.violet6} 100%)`,
            boxShadow: `{material.hierarchy.main}`,
          },
          '&::after': {
            content: "''",
            position: 'absolute',
            top: "{dimension.padding.base}",
            right: "{dimension.padding.base}",
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, {color.secondary.violet4} 0%, {color.secondary.violet6} 100%)`,
            boxShadow: `{material.hierarchy.main}`,
          },
          '& > *:last-child::before': {
            content: "''",
            position: 'absolute',
            bottom: `calc(-{dimension.padding.extraloose} + {dimension.padding.base})`, // 相对于content容器的位置
            right: `calc(-{dimension.padding.extraloose} + {dimension.padding.base})`, // 相对于content容器的位置
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, {color.secondary.violet4} 0%, {color.secondary.violet6} 100%)`,
            boxShadow: `{material.hierarchy.main}`,
          },
          '& > *:last-child::after': {
            content: "''",
            position: 'absolute',
            bottom: `calc(-{dimension.padding.extraloose} + {dimension.padding.base})`, // 相对于content容器的位置
            left: `calc(-{dimension.padding.extraloose} + {dimension.padding.base})`, // 相对于content容器的位置
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, {color.secondary.violet4} 0%, {color.secondary.violet6} 100%)`,
            boxShadow: `{material.hierarchy.main}`,
          },
        },
        listTitle: {
          style: {
            position: 'relative',
          },
          metaType: 'text',
          variant: 'elegantCardSubtitle',
        },
        list: {
          type: 'template',
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: "{dimension.gap.tight}",
            marginTop: "{dimension.margin.base}",
            position: 'relative',
          },
          item1: {
            metaType: 'text',
            variant: 'elegantCardSegment',
            style: {
              padding: "{dimension.padding.tight} {dimension.padding.base}",
              background: "{color.secondarycontainer.violet0}",
              borderRadius: "{dimension.borderradius.medium}",
              borderLeft: `{dimension.borderwidth.base} solid {color.secondary.violet4}`
            }
          },
          item2: {
            metaType: 'text',
            variant: 'elegantCardSegment',
            style: {
              padding: "{dimension.padding.tight} {dimension.padding.base}",
              background: "{color.secondarycontainer.violet0}",
              borderRadius: "{dimension.borderradius.medium}",
              borderLeft: `{dimension.borderwidth.base} solid {color.secondary.violet4}`
            }
          },
          item3: {
            metaType: 'text',
            variant: 'elegantCardSegment',
            style: {
              padding: "{dimension.padding.tight} {dimension.padding.base}",
              background: "{color.secondarycontainer.violet0}",
              borderRadius: "{dimension.borderradius.medium}",
              borderLeft: `{dimension.borderwidth.base} solid {color.secondary.violet4}`
            }
          },
          item4: {
            metaType: 'text',
            variant: 'elegantCardSegment',
            style: {
              padding: "{dimension.padding.tight} {dimension.padding.base}",
              background: "{color.secondarycontainer.violet0}",
              borderRadius: "{dimension.borderradius.medium}",
              borderLeft: `{dimension.borderwidth.base} solid {color.secondary.violet4}`
            }
          },
          item5: {
            metaType: 'text',
            variant: 'elegantCardSegment',
            style: {
              padding: "{dimension.padding.tight} {dimension.padding.base}",
              background: "{color.secondarycontainer.violet0}",
              borderRadius: "{dimension.borderradius.medium}",
              borderLeft: `{dimension.borderwidth.base} solid {color.secondary.violet4}`
            }
          }
        }
      },
      summary: {
        type: 'template',
        style: {
          borderRadius: "{dimension.borderradius.xl}",
          background: `linear-gradient(135deg, {color.surfacecontainer.white100} 0%, {color.surface.grey0} 100%)`,
          padding: "{dimension.padding.base}",
          boxShadow: `{material.hierarchy.B1}`,
          border: `{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}`,
        },
        text: {
          metaType: 'text',
          variant: 'elegantCardSegment'
        }
      }
    },

    // 3. 优雅青蓝表格布局
    elegantTable: {
      type: 'template',
      markdownMapping: {
        h2: 'title',
        h3: 'tableContainer.tableTitle',
        table: 'tableContainer.dataTable',
        p: 'notes.text'
      },
      style: {
        display: 'flex',
        flexDirection: 'column',
        borderRadius: "{dimension.borderradius.xxxl}",
        padding: "{dimension.padding.semiloose}",
        background: `linear-gradient(145deg, {color.primarycontainer.brand1} 0%, {color.primarycontainer.brand2} 50%, {color.secondarycontainer.violet1} 100%)`,
        boxShadow: `{material.hierarchy.2f}`,
        border: `{dimension.borderwidth.base} solid {color.primary.brand3}`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: "''",
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          backgroundImage: `radial-gradient(circle at 25% 25%, {color.primarycontainer.brand2} 0%, transparent 50%), 
                       radial-gradient(circle at 75% 75%, {color.secondarycontainer.violet2} 0%, transparent 50%)`,
          opacity: '0.4',
          borderRadius: "{dimension.borderradius.xxxl}",
        }
      },
      title: {
        style: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: "{dimension.padding.base} {dimension.padding.semiloose}",
          justifyContent: 'center',
          borderRadius: "{dimension.borderradius.xl}",
          background: `linear-gradient(90deg, {color.surfacecontainer.white100} 0%, {color.secondarycontainer.violet0} 100%)`,
          boxShadow: `{material.hierarchy.1f}`,
          marginBottom: "{dimension.margin.tight}",
          border: `{dimension.borderwidth.narrow} solid {color.primary.brand4}`,
          position: 'relative',
          '&::before': {
            content: "''",
            position: 'absolute',
            left: "{dimension.padding.base}",
            top: '50%',
            transform: 'translateY(-50%)',
            width: '3px',
            height: '50%',
            background: `linear-gradient(180deg, {color.primary.brand5} 0%, {color.primary.brand6} 100%)`,
            borderRadius: "{dimension.borderradius.xs}",
          },
          '&::after': {
            content: "''",
            position: 'absolute',
            right: "{dimension.padding.base}",
            top: '50%',
            transform: 'translateY(-50%)',
            width: '3px',
            height: '50%',
            background: `linear-gradient(180deg, {color.primary.brand5} 0%, {color.primary.brand6} 100%)`,
            borderRadius: "{dimension.borderradius.xs}",
          }
        },
        metaType: 'text',
        variant: 'elegantCardTitle',
      },
      tableContainer: {
        type: 'template',
        style: {
          display: 'flex',
          flexDirection: 'column',
          borderRadius: "{dimension.borderradius.xl}",
          background: `linear-gradient(135deg, {color.surfacecontainer.white100} 0%, {color.surface.grey0} 100%)`,
          padding: "{dimension.padding.extraloose}",
          gap: "{dimension.gap.base}",
          boxShadow: `{material.hierarchy.B1}, {material.hierarchy.main}`,
          border: `{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}`,
          marginBottom: "{dimension.margin.base}",
          position: 'relative',
          '&::before': {
            content: "''",
            position: 'absolute',
            top: "{dimension.padding.base}",
            left: "{dimension.padding.base}",
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, {color.secondary.violet4} 0%, {color.secondary.violet6} 100%)`,
            boxShadow: `{material.hierarchy.main}`,
          },
          '&::after': {
            content: "''",
            position: 'absolute',
            top: "{dimension.padding.base}",
            right: "{dimension.padding.base}",
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, {color.secondary.violet4} 0%, {color.secondary.violet6} 100%)`,
            boxShadow: `{material.hierarchy.main}`,
          },
          '& > *:last-child::before': {
            content: "''",
            position: 'absolute',
            bottom: `calc(-{dimension.padding.extraloose} + {dimension.padding.base})`, // 相对于content容器的位置
            right: `calc(-{dimension.padding.extraloose} + {dimension.padding.base})`, // 相对于content容器的位置
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, {color.secondary.violet4} 0%, {color.secondary.violet6} 100%)`,
            boxShadow: `{material.hierarchy.main}`,
          },
          '& > *:last-child::after': {
            content: "''",
            position: 'absolute',
            bottom: `calc(-{dimension.padding.extraloose} + {dimension.padding.base})`, // 相对于content容器的位置
            left: `calc(-{dimension.padding.extraloose} + {dimension.padding.base})`, // 相对于content容器的位置
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, {color.secondary.violet4} 0%, {color.secondary.violet6} 100%)`,
            boxShadow: `{material.hierarchy.main}`,
          },
        },
        tableTitle: {
          style: {
            position: 'relative',
          },
          metaType: 'text',
          variant: 'elegantCardSubtitle',
        },
        dataTable: {
          metaType: 'table',
          style: {
            marginTop: "{dimension.margin.base}",
            position: 'relative',
          }
        }
      },
      notes: {
        type: 'template',
        style: {
          borderRadius: "{dimension.borderradius.xl}",
          background: `linear-gradient(135deg, {color.surfacecontainer.white100} 0%, {color.surface.grey0} 100%)`,
          padding: "{dimension.padding.base}",
          boxShadow: `{material.hierarchy.B1}`,
          border: `{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}`,
        },
        text: {
          metaType: 'text',
          variant: 'elegantCardSegment'
        }
      }
    },
    // Copy End
  },

  // ==================== 图像元件 ====================
  image: {
    // 普通图片  
    normal: {
      borderRadius: "{dimension.borderradius.medium}",
      borderWidth: "{dimension.borderwidth.narrow}",
      borderColor: "{color.surfacecontainer.black16}",
      borderStyle: "solid",
      boxShadow: "{material.hierarchy.main}",
      clipPath: "none",
      transition: CSS_VARIABLE_SYSTEM.ANIMATION.SMOOTH,
      maxWidth: "100%",
      height: "auto",

      '&:hover': {
        boxShadow: "{material.hierarchy.2f}",
        transform: "scale(1.02)"
      }
    },

    // 圆角图片 TODO: 需要确定解析的规则
    rounded: {
      borderRadius: "{dimension.borderradius.xl}",
      borderWidth: "{dimension.borderwidth.base}",
      borderColor: "{color.surfacecontainer.black12}",
      borderStyle: "solid",
      boxShadow: "{material.hierarchy.1f}",
      clipPath: "none",
      maxWidth: "100%",
      height: "auto",
      transition: CSS_VARIABLE_SYSTEM.ANIMATION.SMOOTH,
      '&:hover': {
        borderColor: "{color.primarycontainer.brand2}",
        boxShadow: "{material.hierarchy.3f}"
      }
    },

    // 圆形图片（头像） TODO: 需要确定解析的规则
    circle: {
      borderRadius: "50%",
      borderWidth: "{dimension.borderwidth.base}",
      borderColor: "{color.primarycontainer.brand2}",
      borderStyle: "solid",
      boxShadow: "{material.hierarchy.2f}",
      clipPath: "none",
      aspectRatio: "1",
      objectFit: "cover",
      transition: CSS_VARIABLE_SYSTEM.ANIMATION.SMOOTH,
      '&:hover': {
        borderColor: "{color.primary.brand4}",
        boxShadow: "{material.hierarchy.4f}",
        transform: "scale(1.05)"
      }
    },

    // 带边框图片 TODO: 需要确定解析的规则
    framed: {
      borderRadius: "{dimension.borderradius.large}",
      borderWidth: "{dimension.borderwidth.wide}",
      borderColor: "{color.surfacecontainer.white100}",
      borderStyle: "solid",
      boxShadow: "{material.hierarchy.3f}",
      clipPath: "none",
      maxWidth: "100%",
      height: "auto",
      position: "relative",
      '&::after': {
        content: "''",
        position: "absolute",
        top: "-4px",
        left: "-4px",
        right: "-4px",
        bottom: "-4px",
        borderWidth: "{dimension.borderwidth.narrow}",
        borderColor: "{color.surfacecontainer.black20}",
        borderStyle: "solid",
        borderRadius: "{dimension.borderradius.xl}",
        pointerEvents: "none"
      }
    },

    // 英雄图片 TODO: 需要确定解析的规则
    hero: {
      borderRadius: "{dimension.borderradius.xxl}",
      boxShadow: "{material.hierarchy.5f}",
      width: "100%",
      height: "400px",
      objectFit: "cover",
      clipPath: "none",
      background: `linear-gradient(135deg, {color.surface.grey1} 0%, {color.surface.grey2} 100%)`,
      position: "relative",
      '&::after': {
        content: "''",
        position: "absolute",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        background: `linear-gradient(45deg, {color.surfacecontainer.black16} 0%, transparent 50%)`,
        borderRadius: "{dimension.borderradius.xxl}"
      }
    }
  },

  // ==================== 图标元件 ====================
  icon: {
    // 小图标  
    small: {
      width: "16px",
      height: "16px",
      color: "{color.onsurface.black48}",
      margin: "0 0 {dimension.margin.base} 0",
      transition: CSS_VARIABLE_SYSTEM.ANIMATION.FAST
    },

    // 中等图标  
    medium: {
      width: "24px",
      height: "24px",
      color: "{color.onsurface.black64}",
      transition: CSS_VARIABLE_SYSTEM.ANIMATION.FAST
    },

    // 大图标  
    large: {
      width: "32px",
      height: "32px",
      color: "{color.onsurface.black76}",
      transition: CSS_VARIABLE_SYSTEM.ANIMATION.FAST
    },

    // 可交互图标  
    interactive: {
      width: "24px",
      height: "24px",
      color: "{color.primary.brand5}",
      cursor: "pointer",
      transition: CSS_VARIABLE_SYSTEM.ANIMATION.SPRING,
      '&:hover': {
        color: "{color.primary.brand6}",
        transform: "scale(1.1)"
      }
    },

    // 状态图标  
    status: {
      success: {
        width: "20px",
        height: "20px",
        color: "{color.success.green6}",
        transition: CSS_VARIABLE_SYSTEM.ANIMATION.FAST
      },
      warning: {
        width: "20px",
        height: "20px",
        color: "{color.warning.orange6}",
        transition: CSS_VARIABLE_SYSTEM.ANIMATION.FAST
      },
      error: {
        width: "20px",
        height: "20px",
        color: "{color.error.red6}",
        transition: CSS_VARIABLE_SYSTEM.ANIMATION.FAST
      }
    }
  },

  // ==================== 功能性元件 ==================== (新增)
  // TODO: 暂无应用
  utility: {
    // 复制按钮  
    copyButton: {
      position: 'absolute',
      top: '12px',
      right: '12px',
      background: "{color.surfacecontainer.black20}",
      borderWidth: "{dimension.borderwidth.none}",
      borderRadius: "{dimension.borderradius.small}",
      padding: "{dimension.padding.tight}",
      color: "{color.onsurface.white88}",
      cursor: 'pointer',
      opacity: '0',
      transition: CSS_VARIABLE_SYSTEM.ANIMATION.FAST,
      '&:hover': {
        background: "{color.primary.brand5}"
      }
    },

    // 波纹效果动画  
    ripple: {
      position: 'absolute',
      borderRadius: "50%",
      background: 'rgba(255, 255, 255, 0.3)',
      transform: 'scale(0)',
      animation: 'ripple 0.6s ease-out',
      pointerEvents: 'none'
    }
  },

  // ==================== 响应式断点 ==================== (新增)
  // TODO: 暂无应用
  responsive: {
    // 移动端断点
    mobile: {
      '@media (max-width: 768px)': {
        '.markdown-container': {
          fontSize: "{font.size.small}"
        },
        '.markdown-h1': {
          fontSize: '28px !important'
        },
        '.markdown-h2': {
          fontSize: '24px !important'
        }
      }
    },

    // 平板端断点
    tablet: {
      '@media (max-width: 1024px)': {
        '.app-container': {
          gridTemplateColumns: '1fr',
          gap: "{dimension.gap.loose}"
        }
      }
    }
  },

  // ==================== 动画关键帧 ==================== (新增)
  // TODO: 暂无应用
  animations: {
    // 波纹动画
    ripple: {
      '@keyframes ripple': {
        'to': {
          transform: 'scale(2)',
          opacity: '0'
        }
      }
    },

    // 淡入动画
    fadeIn: {
      '@keyframes fadeIn': {
        'from': {
          opacity: '0',
          transform: 'translateY(20px)'
        },
        'to': {
          opacity: '1',
          transform: 'translateY(0)'
        }
      }
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
 * @param {Object} attributes - 要应用的属性（可选）
 * @returns {Object} 样式配置对象
 */
export function getElementStyleConfig(elementType, variant = 'normal', attributes = {}) {
  if (!activeStyleConfig[elementType]) {
    console.warn(`未找到元素类型 "${elementType}" 的样式配置`);
    return {};
  }

  if (!activeStyleConfig[elementType][variant]) {
    console.warn(`未找到元素类型 "${elementType}" 的变体 "${variant}"`);

    // 为不同元素类型提供合适的默认变体
    let defaultVariant = null;
    switch (elementType) {
      case 'text':
        defaultVariant = 'p';
        break;
      case 'icon':
        defaultVariant = 'medium';
        break;
      case 'button':
        defaultVariant = 'primary';
        break;
      case 'card':
        defaultVariant = 'standard';
        break;
      case 'layout':
        defaultVariant = 'column';
        break;
      case 'image':
        defaultVariant = 'normal';
        break;
      default:
        // 尝试获取第一个可用的变体
        const availableVariants = Object.keys(activeStyleConfig[elementType]);
        defaultVariant = availableVariants.length > 0 ? availableVariants[0] : null;
    }

    if (defaultVariant && activeStyleConfig[elementType][defaultVariant]) {
      console.warn(`使用默认变体 "${defaultVariant}" 替代 "${variant}"`);
      return getElementStyleConfig(elementType, defaultVariant, attributes);
    }

    return {};
  }

  const variantConfig = activeStyleConfig[elementType][variant];

  // 🆕 处理新格式：有 style 键和 supportedAttributes 键
  if (variantConfig.style && variantConfig.supportedAttributes) {
    console.log(`🎨 使用新格式样式配置: ${elementType}.${variant}`);

    // 复制基础样式
    let finalStyle = { ...variantConfig.style };

    // 应用支持的属性
    if (attributes && Object.keys(attributes).length > 0) {
      console.log(`🔧 应用属性到 ${elementType}.${variant}:`, attributes);

      Object.entries(attributes).forEach(([attrName, attrValue]) => {
        if (variantConfig.supportedAttributes.includes(attrName)) {
          console.log(`   ✅ 应用支持的属性: ${attrName} = "${attrValue}"`);
          finalStyle[attrName] = attrValue;
        } else {
          console.warn(`   ⚠️ 属性 "${attrName}" 不在支持列表中:`, variantConfig.supportedAttributes);
        }
      });
    }

    return finalStyle;
  }

  // 🔧 处理旧格式：直接返回样式对象（向后兼容）
  return variantConfig;
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
  CSS_VARIABLE_SYSTEM,
  LAYOUT_CONSTANTS,
  COLOR_CONSTANTS,
  DIMENSION_CONSTANTS,
  FONT_CONSTANTS,
  DEFAULT_STYLE_CONFIG,
  setStyleConfig,
  resetStyleConfig,
  getElementStyleConfig
}; 