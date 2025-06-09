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
      "background": COLOR_CONSTANTS.BASIC.OPACITY.WHITE[100],
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
      fontSizes: "{font.size.medium}",
      fontWeight: "400",
      lineHeight: "1.7",
      letterSpacing: "{font.letterspacing.base}",
      color: CSS_VARIABLE_SYSTEM.COLOR.ON_SURFACE_BLACK76,
      marginBottom: "{dimension.margin.base}",
      textAlign: "justify",
      textJustify: "inter-word",
    },
    // 标题文本（h1 - h6）
    h1: {
      width: "auto",
      fontSizes: "{font.size.xxxl}",
      fontWeight: "{font.fontweight.bold}",
      lineHeight: "{font.lineheight.base}",
      letterSpacing: "{font.letterspacing.base}",
      background: CSS_VARIABLE_SYSTEM.GRADIENT.TEXT_HERO,
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      // marginTop: "{dimension.margin.superloose}",
      marginBottom: "{dimension.margin.loose}",
      marginLeft: "auto",
      marginRight: "auto",
      position: 'relative',
      '&::after': {
        content: "''",
        position: 'absolute',
        bottom: '0',
        left: '0',
        width: '60px',
        height: '4px',
        background: CSS_VARIABLE_SYSTEM.GRADIENT.PRIMARY,
        borderRadius: "{dimension.borderradius.large}"
      }
    },
    h2: {
      width: "100%",
      fontSizes: "{font.size.xxl}",
      fontWeight: "{font.fontweight.bold}",
      lineHeight: "{font.lineheight.base}",
      letterSpacing: "{font.letterspacing.base}",
      color: CSS_VARIABLE_SYSTEM.COLOR.ON_SURFACE_BLACK88,
      marginTop: "{dimension.margin.extraloose}",
      marginBottom: "{dimension.margin.base}",
      paddingTop: "{dimension.padding.base}",
      paddingBottom: "{dimension.padding.base}",
      paddingLeft: "{dimension.padding.semiloose}",
      paddingRight: "{dimension.padding.semiloose}",
      borderLeft: `4px solid ${CSS_VARIABLE_SYSTEM.COLOR.PRIMARY_BRAND5}`,
      background: `linear-gradient(90deg, ${CSS_VARIABLE_SYSTEM.COLOR.PRIMARY_CONTAINER_BRAND1} 0%, transparent 100%)`,
      borderRadius: "{dimension.borderradius.small}",
      boxShadow: "{material.hierarchy.main}"
    },
    h3: {
      width: "auto",
      display: "flex",
      fontSizes: "{font.size.xl}",
      fontWeight: "{font.fontweight.semibold}",
      lineHeight: "{font.lineheight.base}",
      letterSpacing: "{font.letterspacing.base}",
      color: CSS_VARIABLE_SYSTEM.COLOR.ON_SURFACE_BLACK76,
      marginTop: "{dimension.margin.loose}",
      marginBottom: "{dimension.margin.base}",
      position: 'relative',
      '&::before': {
        content: "'#'",
        color: CSS_VARIABLE_SYSTEM.COLOR.PRIMARY_BRAND5,
        marginRight: "{dimension.gap.tight}",
        fontWeight: "{font.fontweight.bold}"
      }
    },
    h4: {
      width: "auto",
      fontSizes: "{font.size.large}",
      fontWeight: "{font.fontweight.semibold}",
      lineHeight: "{font.lineheight.base}",
      letterSpacing: "{font.letterspacing.base}",
      color: CSS_VARIABLE_SYSTEM.COLOR.ON_SURFACE_BLACK76,
      marginTop: "{dimension.margin.semiloose}",
      marginBottom: "{dimension.margin.tight}",
      textTransform: "capitalize",
      paddingBottom: "{dimension.padding.extratight}",
      borderBottom: `2px solid ${CSS_VARIABLE_SYSTEM.COLOR.SURFACE_CONTAINER_BLACK12}`
    },
    h5: {
      width: "auto",
      fontSizes: "{font.size.medium}",
      fontWeight: "{font.fontweight.semibold}",
      lineHeight: "{font.lineheight.base}",
      letterSpacing: "{font.letterspacing.base}",
      color: CSS_VARIABLE_SYSTEM.COLOR.ON_SURFACE_BLACK64,
      marginTop: "{dimension.margin.base}",
      marginBottom: "{dimension.margin.tight}",
      textDecoration: "underline",
      textDecorationColor: CSS_VARIABLE_SYSTEM.COLOR.PRIMARY_CONTAINER_BRAND2,
      textUnderlineOffset: "4px"
    },
    h6: {
      width: "auto",
      fontSizes: "{font.size.small}",
      fontWeight: "{font.fontweight.medium}",
      lineHeight: "{font.lineheight.base}",
      letterSpacing: "{font.letterspacing.base}",
      color: CSS_VARIABLE_SYSTEM.COLOR.ON_SURFACE_BLACK48,
      marginTop: "{dimension.margin.base}",
      marginBottom: "{dimension.margin.tight}",
      textTransform: "uppercase",
      letterSpacing: "1px",
      background: CSS_VARIABLE_SYSTEM.COLOR.SURFACE_CONTAINER_BLACK4,
      paddingTop: "{dimension.padding.supertight}",
      paddingBottom: "{dimension.padding.supertight}",
      paddingLeft: "{dimension.padding.tight}",
      paddingRight: "{dimension.padding.tight}",
      borderRadius: "{dimension.borderradius.xs}",
      display: "inline-block"
    },

    // 代码块  
    codeBlock: {
      fontSizes: "{font.size.small}",
      fontWeight: "400",
      fontFamily: "'Fira Code', 'Monaco', 'Cascadia Code', monospace",
      lineHeight: "1.5",
      backgroundColor: CSS_VARIABLE_SYSTEM.COLOR.ON_SURFACE_WHITE88,
      paddingTop: "{dimension.padding.loose}",
      paddingBottom: "{dimension.padding.loose}",
      paddingLeft: "{dimension.padding.extraloose}",
      paddingRight: "{dimension.padding.extraloose}",
      marginTop: "{dimension.margin.base}",
      marginBottom: "{dimension.margin.base}",
      borderRadius: "{dimension.borderradius.large}",
      borderWidth: "{dimension.borderwidth.narrow}",
      borderStyle: "solid",
      borderColor: CSS_VARIABLE_SYSTEM.COLOR.ON_SURFACE_CONTAINER_GREY7,
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
        backgroundColor: CSS_VARIABLE_SYSTEM.COLOR.WARNING_ORANGE5,
        boxShadow: `24px 0 0 ${CSS_VARIABLE_SYSTEM.COLOR.WARNING_ORANGE6}, 48px 0 0 ${CSS_VARIABLE_SYSTEM.COLOR.SUCCESS_GREEN5}`
      }
    },

    // 超链接文本
    hyperlink: {
      "textColor": COLOR_CONSTANTS.BASIC.LIGHT_BLUE[5],
      "fill": "none",
      "fontSizes": FONT_CONSTANTS.SIZE.LARGE
    }
  },

  // 数学公式元素配置
  math: {
    // 行内公式
    inline: {
      fontSizes: "1.1em"
    },
    // 块级公式
    display: {
      marginTop: "{dimension.margin.loose}",
      marginBottom: "{dimension.margin.loose}",
      marginLeft: 0,
      marginRight: 0,
      padding: "{dimension.padding.base}",
      background: CSS_VARIABLE_SYSTEM.COLOR.SURFACE_GREY1,
      borderRadius: "{dimension.borderradius.medium}",
      borderLeftWidth: "{dimension.borderwidth.wide}",
      borderLeftColor: CSS_VARIABLE_SYSTEM.COLOR.PRIMARY_BRAND5,
      borderLeftStyle: "solid",
      boxShadow: "{material.hierarchy.main}"
    }
  },
  chart: {
    // 图表容器  
    container: {
      marginTop: "{dimension.margin.loose}",
      marginBottom: "{dimension.margin.loose}",
      marginLeft: "0",
      marginRight: "0",
      padding: "{dimension.padding.extraloose}",
      background: CSS_VARIABLE_SYSTEM.COLOR.SURFACE_CONTAINER_WHITE100,
      borderRadius: "{dimension.borderradius.xl}",
      boxShadow: "{material.hierarchy.2f}",
      borderWidth: "{dimension.borderwidth.narrow}",
      borderStyle: "solid",
      borderColor: CSS_VARIABLE_SYSTEM.COLOR.SURFACE_CONTAINER_BLACK12,
    },
    // 图表标题
    title: {
      fontSize: "{font.size.large}",
      fontWeight: "{font.fontweight.semibold}",
      color: CSS_VARIABLE_SYSTEM.COLOR.ON_SURFACE_BLACK88,
      marginBottom: "{dimension.margin.base}",
      textAlign: 'center'
    },
    // 图例
    legend: {
      fontSize: "{font.size.small}",
      fontWeight: "400",
      color: CSS_VARIABLE_SYSTEM.COLOR.ON_SURFACE_BLACK64,
      display: 'flex',
      justifyContent: 'center',
      gap: "{dimension.gap.loose}",
      marginTop: "{dimension.margin.base}"
    },
    // 坐标轴  
    axis: {
      fontSize: "{font.size.tiny}",
      fontWeight: "400",
      color: CSS_VARIABLE_SYSTEM.COLOR.ON_SURFACE_BLACK48
    },
  },
  // 表格元素配置
  table: {
    // 表格容器  
    container: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: "{dimension.margin.loose}",
      marginBottom: "{dimension.margin.loose}",
      marginLeft: "0",
      marginRight: "0",
      background: CSS_VARIABLE_SYSTEM.COLOR.SURFACE_CONTAINER_WHITE100,
      borderRadius: "{dimension.borderradius.large}",
      overflow: 'hidden',
      boxShadow: "{material.hierarchy.1f}"
    },
    th: {
      background: CSS_VARIABLE_SYSTEM.COLOR.SURFACE_GREY1,
      color: CSS_VARIABLE_SYSTEM.COLOR.ON_SURFACE_BLACK88,
      fontWeight: "{font.fontweight.semibold}",
      fontSize: "{font.size.small}",
      paddingTop: "{dimension.padding.base}",
      paddingBottom: "{dimension.padding.base}",
      paddingLeft: "{dimension.padding.semiloose}",
      paddingRight: "{dimension.padding.semiloose}",
      textAlign: 'left',
      borderBottomWidth: "{dimension.borderwidth.base}",
      borderBottomStyle: "solid",
      borderBottomColor: CSS_VARIABLE_SYSTEM.COLOR.SURFACE_CONTAINER_BLACK20
    },
    td: {
      fontSize: "{font.size.medium}",
      paddingTop: "{dimension.padding.base}",
      paddingBottom: "{dimension.padding.base}",
      paddingLeft: "{dimension.padding.semiloose}",
      paddingRight: "{dimension.padding.semiloose}",
      borderBottomWidth: "{dimension.borderwidth.narrow}",
      borderBottomStyle: "solid",
      borderBottomColor: CSS_VARIABLE_SYSTEM.COLOR.SURFACE_CONTAINER_BLACK12,
      color: CSS_VARIABLE_SYSTEM.COLOR.ON_SURFACE_BLACK76
    },
    // 表格行  
    tr: {
      borderBottomWidth: "{dimension.borderwidth.narrow}",
      borderBottomStyle: "solid",
      borderBottomColor: CSS_VARIABLE_SYSTEM.COLOR.SURFACE_CONTAINER_BLACK12,
      transition: CSS_VARIABLE_SYSTEM.ANIMATION.FAST,
      '&:hover': {
        background: CSS_VARIABLE_SYSTEM.COLOR.SURFACE_GREY0
      },
      '&:last-child': {
        borderBottom: "{dimension.borderwidth.none}"
      }
    }
  },

  // 按钮元素配置
  button: {
    // 主要按钮  
    primary: {
      fontSizes: "{font.size.medium}",
      fontWeight: "{font.fontweight.semibold}",
      color: CSS_VARIABLE_SYSTEM.COLOR.ON_PRIMARY_WHITE100,
      background: CSS_VARIABLE_SYSTEM.GRADIENT.PRIMARY,
      border: "{dimension.borderwidth.none}",
      borderRadius: "{dimension.borderradius.large}",
      paddingLeft: "{dimension.padding.base}",
      paddingRight: "{dimension.padding.base}",
      paddingTop: "{dimension.padding.base}",
      paddingBottom: "{dimension.padding.base}",
      cursor: 'pointer',
      transition: CSS_VARIABLE_SYSTEM.ANIMATION.SMOOTH,
      boxShadow: "{material.hierarchy.2f}",
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: "{dimension.gap.tight}",
      margin: "{dimension.margin.tight}",
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: "{material.hierarchy.4f}"
      }
    },
    // 次要按钮  
    secondary: {
      fontSizes: "{font.size.medium}",
      fontWeight: "{font.fontweight.semibold}",
      color: CSS_VARIABLE_SYSTEM.COLOR.SECONDARY_VIOLET6,
      backgroundColor: CSS_VARIABLE_SYSTEM.COLOR.SECONDARY_CONTAINER_VIOLET1,
      background: 'none',
      borderWidth: "{dimension.borderwidth.base}",
      borderStyle: "solid",
      borderColor: CSS_VARIABLE_SYSTEM.COLOR.SECONDARY_VIOLET4,
      borderRadius: "{dimension.borderradius.large}",
      paddingTop: "{dimension.padding.base}",
      paddingBottom: "{dimension.padding.base}",
      paddingLeft: "{dimension.padding.extraloose}",
      paddingRight: "{dimension.padding.extraloose}",
      cursor: 'pointer',
      transition: CSS_VARIABLE_SYSTEM.ANIMATION.SMOOTH,
      boxShadow: "{material.hierarchy.main}",
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: "{dimension.gap.tight}",
      margin: "{dimension.margin.tight}",
      '&:hover': {
        backgroundColor: CSS_VARIABLE_SYSTEM.COLOR.SECONDARY_CONTAINER_VIOLET2,
        color: CSS_VARIABLE_SYSTEM.COLOR.ON_SECONDARY_CONTAINER_VIOLET8,
        transform: 'translateY(-1px)',
        boxShadow: "{material.hierarchy.2f}"
      }
    },
    // 成功按钮  
    success: {
      fontSizes: "{font.size.medium}",
      fontWeight: "{font.fontweight.semibold}",
      color: CSS_VARIABLE_SYSTEM.COLOR.ON_PRIMARY_WHITE100,
      background: CSS_VARIABLE_SYSTEM.GRADIENT.SUCCESS,
      border: "{dimension.borderwidth.none}",
      borderRadius: "{dimension.borderradius.large}",
      paddingTop: "{dimension.padding.base}",
      paddingBottom: "{dimension.padding.base}",
      paddingLeft: "{dimension.padding.extraloose}",
      paddingRight: "{dimension.padding.extraloose}",
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
        boxShadow: "{material.hierarchy.3f}"
      }
    },

    // 警告按钮  
    warning: {
      fontSizes: "{font.size.medium}",
      fontWeight: "{font.fontweight.semibold}",
      color: CSS_VARIABLE_SYSTEM.COLOR.ON_PRIMARY_WHITE100,
      background: CSS_VARIABLE_SYSTEM.GRADIENT.WARNING,
      border: "{dimension.borderwidth.none}",
      borderRadius: "{dimension.borderradius.large}",
      paddingTop: "{dimension.padding.base}",
      paddingBottom: "{dimension.padding.base}",
      paddingLeft: "{dimension.padding.extraloose}",
      paddingRight: "{dimension.padding.extraloose}",
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
        boxShadow: "{material.hierarchy.3f}"
      }
    },

    // 透明按钮  
    ghost: {
      fontSizes: "{font.size.medium}",
      fontWeight: "{font.fontweight.medium}",
      color: CSS_VARIABLE_SYSTEM.COLOR.PRIMARY_BRAND5,
      backgroundColor: "transparent",
      border: "{dimension.borderwidth.none}",
      borderRadius: "{dimension.borderradius.medium}",
      paddingTop: "{dimension.padding.tight}",
      paddingBottom: "{dimension.padding.tight}",
      paddingLeft: "{dimension.padding.base}",
      paddingRight: "{dimension.padding.base}",
      cursor: 'pointer',
      transition: CSS_VARIABLE_SYSTEM.ANIMATION.FAST,
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: "{dimension.gap.tight}",
      '&:hover': {
        backgroundColor: CSS_VARIABLE_SYSTEM.COLOR.PRIMARY_CONTAINER_BRAND1,
        color: CSS_VARIABLE_SYSTEM.COLOR.PRIMARY_BRAND6,
        boxShadow: "{material.hierarchy.B1}"
      }
    },

    // 链接按钮  
    link: {
      fontSizes: "{font.size.medium}",
      fontWeight: "{font.fontweight.medium}",
      color: CSS_VARIABLE_SYSTEM.COLOR.PRIMARY_BRAND5,
      backgroundColor: "transparent",
      border: "{dimension.borderwidth.none}",
      paddingTop: "{dimension.padding.extratight}",
      paddingBottom: "{dimension.padding.extratight}",
      paddingLeft: "{dimension.padding.tight}",
      paddingRight: "{dimension.padding.tight}",
      cursor: 'pointer',
      transition: CSS_VARIABLE_SYSTEM.ANIMATION.FAST,
      textDecoration: "underline",
      textDecorationColor: "transparent",
      textUnderlineOffset: "4px",
      display: 'inline-flex',
      alignItems: 'center',
      gap: "{dimension.gap.tight}",
      '&:hover': {
        color: CSS_VARIABLE_SYSTEM.COLOR.PRIMARY_BRAND6,
        textDecorationColor: CSS_VARIABLE_SYSTEM.COLOR.PRIMARY_CONTAINER_BRAND2
      }
    },
  },

  // ==================== 列表元件 ====================
  list: {
    // 无序列表 
    unordered: {
      paddingLeft: "{dimension.padding.loose}",
      marginBottom: "{dimension.margin.base}",
      fontSizes: "{font.size.medium}",
      lineHeight: "1.6",
      color: CSS_VARIABLE_SYSTEM.COLOR.ON_SURFACE_BLACK76,
      marginBottom: "{dimension.margin.tight}",
      position: 'relative',
      '&::before': {
        content: "'•'",
        color: CSS_VARIABLE_SYSTEM.COLOR.PRIMARY_BRAND5,
        fontSize: '1.2em',
        position: 'absolute',
        top: '-4px',
        left: '0px'
      }
    },

    // 有序列表 
    ordered: {
      paddingLeft: "{dimension.padding.loose}",
      marginBottom: "{dimension.margin.base}",
      counterReset: 'list-counter',
      fontSizes: "{font.size.medium}",
      lineHeight: "1.6",
      color: CSS_VARIABLE_SYSTEM.COLOR.ON_SURFACE_BLACK76,
      marginBottom: "{dimension.margin.tight}",
      position: 'relative',
      counterIncrement: 'list-counter',
      '&::before': {
        content: 'counter(list-counter)',
        color: CSS_VARIABLE_SYSTEM.COLOR.ON_PRIMARY_WHITE100,
        fontWeight: "{font.fontweight.semibold}",
        fontSize: "{font.size.small}",
        backgroundColor: CSS_VARIABLE_SYSTEM.COLOR.PRIMARY_BRAND5,
        borderRadius: "{dimension.borderradius.full}",
        width: '20px',
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: '0px',
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

  // 背景/图片元素配置
  image: {

    // 普通图片  
    normal: {
      borderRadius: "{dimension.borderradius.medium}",
      borderWidth: "{dimension.borderwidth.narrow}",
      borderStyle: "solid",
      borderColor: CSS_VARIABLE_SYSTEM.COLOR.SURFACE_CONTAINER_BLACK16,
      boxShadow: "{material.hierarchy.main}",
      transition: CSS_VARIABLE_SYSTEM.ANIMATION.SMOOTH,
      maxWidth: "100%",
      height: "auto",
      '&:hover': {
        boxShadow: "{material.hierarchy.2f}",
        transform: "scale(1.02)"
      }
    },

    // 圆角图片  
    rounded: {
      borderRadius: "{dimension.borderradius.xl}",
      borderWidth: "{dimension.borderwidth.base}",
      borderStyle: "solid",
      borderColor: CSS_VARIABLE_SYSTEM.COLOR.SURFACE_CONTAINER_BLACK12,
      boxShadow: "{material.hierarchy.1f}",
      maxWidth: "100%",
      height: "auto",
      transition: CSS_VARIABLE_SYSTEM.ANIMATION.SMOOTH,
      '&:hover': {
        borderColor: CSS_VARIABLE_SYSTEM.COLOR.PRIMARY_CONTAINER_BRAND2,
        boxShadow: "{material.hierarchy.3f}"
      }
    },

    // 圆形图片（头像）  
    circle: {
      borderRadius: "{dimension.borderradius.full}",
      border: `3px solid ${CSS_VARIABLE_SYSTEM.COLOR.PRIMARY_CONTAINER_BRAND2}`,
      boxShadow: "{material.hierarchy.2f}",
      aspectRatio: "1",
      objectFit: "cover",
      transition: CSS_VARIABLE_SYSTEM.ANIMATION.SMOOTH,
      '&:hover': {
        borderColor: CSS_VARIABLE_SYSTEM.COLOR.PRIMARY_BRAND4,
        boxShadow: "{material.hierarchy.4f}",
        transform: "scale(1.05)"
      }
    },

    // 带边框图片  
    framed: {
      borderRadius: "{dimension.borderradius.large}",
      borderWidth: "{dimension.borderwidth.wide}",
      borderStyle: "solid",
      borderColor: CSS_VARIABLE_SYSTEM.COLOR.SURFACE_CONTAINER_WHITE100,
      boxShadow: "{material.hierarchy.3f}",
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
        borderStyle: "solid",
        borderColor: CSS_VARIABLE_SYSTEM.COLOR.SURFACE_CONTAINER_BLACK20,
        borderRadius: "{dimension.borderradius.xl}",
        pointerEvents: "none"
      }
    },

    // 英雄图片  
    hero: {
      borderRadius: "{dimension.borderradius.xxl}",
      boxShadow: "{material.hierarchy.5f}",
      width: "100%",
      height: "400px",
      objectFit: "cover",
      background: CSS_VARIABLE_SYSTEM.GRADIENT.SURFACE,
      position: "relative",
      '&::after': {
        content: "''",
        position: "absolute",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        background: `linear-gradient(45deg, ${CSS_VARIABLE_SYSTEM.COLOR.SURFACE_CONTAINER_BLACK16} 0%, transparent 50%)`,
        borderRadius: "{dimension.borderradius.xxl}"
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