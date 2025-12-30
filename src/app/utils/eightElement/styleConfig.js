/**
 * styleConfig.js
 * 八要素结构的样式配置系统
 * 提供了对不同元素类型样式的完整配置
 */

import { text } from 'd3';
import { fontSize } from '../icons/Edit/index.js';
import resolveToken from '../tokens/resolveToken.js';
import border from '../tokens/color/border.js';
import margin from '../tokens/dimension/margin.js';
import lineheight from '../tokens/font/lineheight.js';
import borderradius from '../tokens/dimension/borderradius.js';

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
  },

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
        padding: `${DIMENSION_CONSTANTS.PADDING.base}`,
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
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100vw',

        // 网格布局属性（默认不启用，由动作激活）
        gridTemplateColumns: 'none',
        gridTemplateAreas: 'none',
        justifyItems: 'stretch',
      },
      supportedAttributes: ['backgroundImage', 'backgroundRepeat', 'backgroundSize', 'backgroundPosition', 'backgroundColor', 'background']
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
      gap: DIMENSION_CONSTANTS.GAP.base,

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
    },
    // 🆕 类似 Tailwind 的 row 变体
    'row-center': {
      padding: `${DIMENSION_CONSTANTS.PADDING.tight} 0`,
      margin: `${DIMENSION_CONSTANTS.MARGIN.tight} 0`,
      backgroundColor: "none",
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'flex-start',
      alignItems: 'center',  // 垂直居中
      gap: DIMENSION_CONSTANTS.GAP.base,
      gridTemplateColumns: 'none',
      gridTemplateAreas: 'none',
      justifyItems: 'stretch'
    },
    'row-between': {
      padding: `${DIMENSION_CONSTANTS.PADDING.tight} 0`,
      margin: `${DIMENSION_CONSTANTS.MARGIN.tight} 0`,
      backgroundColor: "none",
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'space-between',  // 两端对齐
      alignItems: 'stretch',
      gap: DIMENSION_CONSTANTS.GAP.base,
      gridTemplateColumns: 'none',
      gridTemplateAreas: 'none',
      justifyItems: 'stretch'
    },
    'row-around': {
      padding: `${DIMENSION_CONSTANTS.PADDING.tight} 0`,
      margin: `${DIMENSION_CONSTANTS.MARGIN.tight} 0`,
      backgroundColor: "none",
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'space-around',  // 周围分散对齐
      alignItems: 'stretch',
      gap: DIMENSION_CONSTANTS.GAP.base,
      gridTemplateColumns: 'none',
      gridTemplateAreas: 'none',
      justifyItems: 'stretch'
    },
    'row-evenly': {
      padding: `${DIMENSION_CONSTANTS.PADDING.tight} 0`,
      margin: `${DIMENSION_CONSTANTS.MARGIN.tight} 0`,
      backgroundColor: "none",
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'space-evenly',  // 均匀分布
      alignItems: 'stretch',
      gap: DIMENSION_CONSTANTS.GAP.base,
      gridTemplateColumns: 'none',
      gridTemplateAreas: 'none',
      justifyItems: 'stretch'
    },
    'row-center-center': {
      padding: `${DIMENSION_CONSTANTS.PADDING.tight} 0`,
      margin: `${DIMENSION_CONSTANTS.MARGIN.tight} 0`,
      backgroundColor: "none",
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'center',  // 水平居中
      alignItems: 'center',  // 垂直居中
      gap: DIMENSION_CONSTANTS.GAP.base,
      gridTemplateColumns: 'none',
      gridTemplateAreas: 'none',
      justifyItems: 'stretch'
    },
    'row-between-center': {
      padding: `${DIMENSION_CONSTANTS.PADDING.tight} 0`,
      margin: `${DIMENSION_CONSTANTS.MARGIN.tight} 0`,
      backgroundColor: "none",
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'space-between',  // 两端对齐
      alignItems: 'center',  // 垂直居中
      gap: DIMENSION_CONSTANTS.GAP.base,
      gridTemplateColumns: 'none',
      gridTemplateAreas: 'none',
      justifyItems: 'stretch'
    },
    'row-end': {
      padding: `${DIMENSION_CONSTANTS.PADDING.tight} 0`,
      margin: `${DIMENSION_CONSTANTS.MARGIN.tight} 0`,
      backgroundColor: "none",
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'flex-end',  // 靠右对齐
      alignItems: 'stretch',
      gap: DIMENSION_CONSTANTS.GAP.base,
      gridTemplateColumns: 'none',
      gridTemplateAreas: 'none',
      justifyItems: 'stretch'
    },
    'row-end-center': {
      padding: `${DIMENSION_CONSTANTS.PADDING.tight} 0`,
      margin: `${DIMENSION_CONSTANTS.MARGIN.tight} 0`,
      backgroundColor: "none",
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      justifyContent: 'flex-end',  // 靠右对齐
      alignItems: 'center',  // 垂直居中
      gap: DIMENSION_CONSTANTS.GAP.base,
      gridTemplateColumns: 'none',
      gridTemplateAreas: 'none',
      justifyItems: 'stretch'
    },
    'column-center': {
      padding: `${DIMENSION_CONSTANTS.PADDING.tight} 0`,
      margin: `${DIMENSION_CONSTANTS.MARGIN.tight} 0`,
      backgroundColor: "none",
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'nowrap',
      justifyContent: 'flex-start',
      alignItems: 'center',  // 水平居中
      gap: DIMENSION_CONSTANTS.GAP.base,
      gridTemplateColumns: 'none',
      gridTemplateAreas: 'none',
      justifyItems: 'stretch'
    },
    'column-between': {
      padding: `${DIMENSION_CONSTANTS.PADDING.tight} 0`,
      margin: `${DIMENSION_CONSTANTS.MARGIN.tight} 0`,
      backgroundColor: "none",
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'nowrap',
      justifyContent: 'space-between',  // 上下两端对齐
      alignItems: 'flex-start',
      gap: DIMENSION_CONSTANTS.GAP.base,
      gridTemplateColumns: 'none',
      gridTemplateAreas: 'none',
      justifyItems: 'stretch'
    },
    'column-center-center': {
      padding: `${DIMENSION_CONSTANTS.PADDING.tight} 0`,
      margin: `${DIMENSION_CONSTANTS.MARGIN.tight} 0`,
      backgroundColor: "none",
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'nowrap',
      justifyContent: 'center',  // 垂直居中
      alignItems: 'center',  // 水平居中
      gap: DIMENSION_CONSTANTS.GAP.base,
      gridTemplateColumns: 'none',
      gridTemplateAreas: 'none',
      justifyItems: 'stretch'
    },
    bgColumn: {
      style: {
        padding: `${DIMENSION_CONSTANTS.PADDING.base}`,
        borderRadius: DIMENSION_CONSTANTS.BORDER_RADIUS.large,
        boxShadow: "{material.hierarchy.main}",
        borderWidth: "{dimension.borderwidth.narrow}",
        borderColor: "{color.surfacecontainer.black12}",
        borderStyle: "solid",
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: DIMENSION_CONSTANTS.GAP.base,
        background: "{color.primary.brand3}",
      },
      supportedAttributes: ['background', 'backgroundColor', 'padding', 'margin', 'borderRadius', 'borderColor', 'borderWidth', 'boxShadow']
    },
    minimalContainer: {
      borderTopRightRadius: "{dimension.borderradius.xl}",
      borderBottomRightRadius: "{dimension.borderradius.xl}",
      borderBottomLeftRadius: "{dimension.borderradius.xl}",
      background: "{color.onprimary.white100}",
    },
    gallery: {
      // 使用CSS多列布局，不使用flexbox
      columnCount: '2',
      columnGap: '15px',
      columnFill: "balance",
      // 子元素样式
      '& > *': {
        breakInside: 'avoid',        // 避免元素被分割到不同列
        marginTop: '15px',        // 元素间距用margin而不是gap
        display: 'block',            // 子元素也使用block布局
        width: '100%',
      },
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
      borderBottom: '2px solid {color.primarycontainer.brand2}',
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
      fontSize: "{font.size.large}",
    },
    cardSubtitle: {
      fontWeight: "{font.fontweight.semibold}",
      color: "{color.onprimary.black88}",
      fontSize: "{font.size.medium}",
    },
    metricCardValue: {
      fontSize: "{font.size.xxxl}",
      fontWeight: "{font.fontweight.bold}",
      color: "{color.primary.brand6}",
      letterSpacing: "-0.02em",
      lineHeight: "1em",
      margin: "0"
    },
    heroTitle: {
      fontSize: "{font.size.xxl}",
      fontWeight: "{font.fontweight.bold}",
      letterSpacing: "-0.02em",
      color: "{color.onprimary.white100}",
      margin: "0",
      lineHeight: "1.1"
    },
    heroSubtitle: {
      fontSize: "{font.size.medium}",
      fontWeight: "{font.fontweight.medium}",
      color: "{color.onprimary.white88}",
      margin: "0",
      lineHeight: "1.5",
      maxWidth: "580px"
    },
    heroMetric: {
      fontSize: "{font.size.medium}",
      fontWeight: "{font.fontweight.semibold}",
      color: "{color.basic.opacity.white.88}",
      margin: "0",
      padding: "{dimension.padding.base} {dimension.padding.extraloose}",
      borderRadius: "{dimension.borderradius.full}",
      backdropFilter: 'blur(10px)',
      background: '{color.basic.opacity.white.12}',
      letterSpacing: "0.02em"
    },
    cardSegment: {
      color: "{color.onprimary.black88}",
      fontSize: "{font.size.medium}",
    },

    // 新拟态风格文字样式
    neomorphismTitle: {
      fontWeight: "{font.fontweight.semibold}",
      color: "{color.onprimary.white100}",
      fontSize: "{font.size.large}",
    },
    neomorphismSubtitle: {
      fontWeight: "{font.fontweight.semibold}",
      color: "{color.onprimary.black88}",
      fontSize: "{font.size.medium}",
    },
    neomorphismSegment: {
      fontWeight: "{font.fontweight.medium}",
      color: "{color.onprimary.black88}",
      fontSize: "{font.size.medium}",
    },

    // 科技渐变风格文字样式
    techGradientTitle: {
      fontWeight: "{font.fontweight.semibold}",
      color: "{color.primary.brand6}", // 深蓝色确保可读性
      fontSize: "{font.size.large}",
    },
    techGradientSubtitle: {
      fontWeight: "{font.fontweight.semibold}",
      color: "{color.onprimary.black88}",
      fontSize: "{font.size.medium}",
    },
    techGradientSegment: {
      fontWeight: "{font.fontweight.medium}",
      color: "{color.onprimary.black88}",
      fontSize: "{font.size.medium}",
    },

    // 优雅青蓝卡片风格文字样式
    elegantCardTitle: {
      fontWeight: "{font.fontweight.semibold}",
      color: "{color.primary.brand6}", // 深青蓝色确保可读性
      fontSize: "{font.size.large}",
    },
    elegantCardSubtitle: {
      fontWeight: "{font.fontweight.semibold}",
      color: "{color.onprimary.black88}",
      fontSize: "{font.size.medium}",
    },
    elegantCardSegment: {
      fontWeight: "{font.fontweight.medium}",
      color: "{color.onprimary.black88}",
      fontSize: "{font.size.medium}",
    },

    // 标题卡片风格文字样式
    headerCardTitle: {
      fontWeight: "{font.fontweight.bold}",
      color: "{color.onprimary.black88}",
      fontSize: "{font.size.large}",
      padding: "0 {dimension.padding.base}",
      borderLeftWidth: "{dimension.borderwidth.wide}",
      borderLeftStyle: "solid",
      borderLeftColor: "{color.primary.brand5}",
    },
    headerCardText: {
      fontWeight: "{font.fontweight.semibold}",
      color: "{color.onprimary.black76}",
      fontSize: "{font.size.medium}",
    },
    percentItemTitle: {
      fontSize: "{font.size.small}",
      fontWeight: "bold",
      color: "{color.onsurfacecontainer.grey9}",
    },
    precentItemLabel: {
      fontSize: "{font.size.small}",
      fontWeight: "bold",
      color: "{color.onprimary.white100}",
    },
    percentValue: {
      fontSize: "{font.size.xxl}",
      fontWeight: "bold",
      color: "{color.error.red5}",
      textAlign: 'center',
    },
    percentItemDescription: {
      lineHeight: "1.4",
      fontSize: "{font.size.tiny}",
      fontWeight: "{font.fontweight.medium}",
      color: "{color.onsurfacecontainer.grey9}",
    },
    // 简约风格卡片
    minimalistBorderLessCardTitle: {
      fontSize: "{font.size.xxl}",
      fontWeight: "{font.fontweight.bold}",
      color: "{color.onsurface.black88}",
    },
    minimalistBorderLessCardPageTitle: {
      fontSize: "{font.size.large}",
      fontWeight: "{font.fontweight.semibold}",
      color: "{color.onsurface.black88}",
    },
    minimalistBorderLessCardContent: {
      lineHeight: "1.4",
      fontSize: "{font.size.medium}",
      fontWeight: "{font.fontweight.medium}",
      color: "{color.onsurfacecontainer.grey9}",
    },
    minimalistListCardTitle: {
      lineHeight: "1.4",
      fontSize: "{font.size.medium}",
      fontWeight: "{font.fontweight.bold}",
      color: "{color.basic.brand.6}",
    },

    minimalistListCardContent: {
      lineHeight: "1.4",
      fontSize: "{font.size.medium}",
      fontWeight: "{font.fontweight.medium}",
      color: "{color.onsurfacecontainer.grey9}",
    },

    minimalistCardMainTitle: {
      lineHeight: "1.4",
      fontSize: "{font.size.xl}",
      fontWeight: "{font.fontweight.semibold}",
      color: "{color.onsurface.black88}",
    },

    minimalistListCardItemTitle: {
      lineHeight: "1.4",
      fontSize: "{font.size.medium}",
      fontWeight: "{font.fontweight.bold}",
      color: "{color.onsurface.black88}",
    },

    minimalistListCardItemDescription: {
      lineHeight: "1.4",
      fontSize: "{font.size.xl}",
      fontWeight: "{font.fontweight.bold}",
      color: "{color.onsurface.black88}",
    },

    minimalistChartCardHeaderTitle: {
      fontSize: "{dimension.basic.dimension.80}",
      fontWeight: "{font.fontweight.bold}",
      color: "{color.basic.brand.1}"
    },

    minimalistChartCardPageTitle: {
      fontSize: "{font.size.large}",
      fontWeight: "{font.fontweight.bold}",
      color: "{color.onsurface.black88}",
    },

    minimalistChartCardDescription: {
      lineHeight: "1.4",
      fontSize: "{font.size.small}",
      color: "{color.onsurface.black64}",
    },

    // tabItemText
    tabItemText: {
      fontSize: "{font.size.medium}",
      fontWeight: "{font.fontweight.semibold}",
      textAlign: "center",
      color: "{color.basic.brand.3}"
    },
    tabActiveItemText: {
      fontSize: "{font.size.medium}",
      fontWeight: "{font.fontweight.bold}",
      textAlign: "center",
      color: "{color.basic.brand.6}",
    },

    // bannerPanel 标题
    bannerTitle: {
      fontSize: "{font.size.xxl}",
      fontWeight: "{font.fontweight.bold}",
      color: "{color.onprimary.white100}",
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
    small: {
      margin: "{dimension.margin.base} 0",
      padding: "{dimension.padding.extratight}",
    },
    minimalist: {
      padding: "{dimension.padding.loose}",
      background: "{color.basic.grey.0}",
      borderRadius: "{dimension.borderradius.xl}",
    },
    normal: {
      margin: "{dimension.margin.loose} 0",
      padding: "{dimension.padding.extraloose}",
      position: "relative",
      backgroundColor: "{color.surfacecontainer.white100}",
      borderRadius: "{dimension.borderradius.xl}",
      boxShadow: "{material.hierarchy.2f}",
      borderWidth: "{dimension.borderwidth.narrow}",
      borderColor: "{color.surfacecontainer.black12}",
      borderStyle: "solid"
    },
    event: {
      button: {
        text: '新样式',
        metaType: 'button',
        variant: 'chartButton',
        style: {
          position: 'absolute',
          right: "{dimension.padding.loose}",
          top: "{dimension.padding.loose}"
        }
      }
    }
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
      textAlign: 'center',
      // borderRight: `{dimension.borderwidth.narrow} solid {color.surfacecontainer.black20}`,
      borderBottom: `{dimension.borderwidth.base} solid {color.surfacecontainer.black20}`,
      backgroundImage: 'none',
      // textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    td: {
      fontSize: "{font.size.medium}",
      borderRight: `{dimension.borderwidth.narrow} solid {color.surfacecontainer.black20}`,
      borderBottom: `{dimension.borderwidth.narrow} solid {color.surfacecontainer.black20}`,
      padding: "{dimension.padding.base} {dimension.padding.semiloose}",
      color: "{color.onsurface.black76}",
      textAlign: 'left',
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

    chartButton: {
      // 基础视觉
      // background: `linear-gradient(135deg, {color.primary.brand4} 0%, {color.primary.brand6} 100%)`,
      background: `linear-gradient(90deg, #9064FF 0%, #66B0FF 100%)`,
      color: "{color.onprimary.white100}",
      fontWeight: "{font.fontweight.semibold}",
      boxShadow: "{material.hierarchy.2f}",
      borderRadius: "{dimension.borderradius.large}",
      textDecoration: 'none',
      // 仅展示首字：窄宽度 + nowrap + overflow
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      letterSpacing: '18px',
      whiteSpace: 'nowrap',
      padding: "{dimension.padding.base} 0",
      textIndent: '18px',
      maxWidth: '50px',
      fontSize: "{font.size.medium}",
      // 动效与层级
      transition: 'all 0.5s ease',
      cursor: 'pointer',
      margin: "{dimension.margin.tight}",
      opacity: '1.0',
      backdropFilter: 'none',
      transform: 'scale(1.0)',
      zIndex: '1000',
      // 悬停展开显示文字
      '&:hover': {
        letterSpacing: '1px',
        textIndent: '0',
        maxWidth: '240px',
        padding: "{dimension.padding.base} {dimension.padding.extraloose}"
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
        code: 'content.codeBlock',
        video: 'content.video'
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

    bannerPanel: {
      type: 'template',
      markdownMapping: {
        h2: 'title'
      },
      classList: {
        crossLines: {
          width: '100%',
          padding: "{dimension.padding.extraloose} {dimension.padding.loose}",
          borderRadius: "{dimension.borderradius.large}",
          background: "linear-gradient(135deg, {color.primary.brand4} 0%, {color.secondary.violet5} 35%, {color.primary.brand6} 100%)",
          boxShadow: "{material.hierarchy.1f}",
          position: 'relative',
          overflow: 'hidden',
          marginBottom: "{dimension.margin.loose}",
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
    linear-gradient(0deg, transparent 24%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.1) 26%, transparent 27%, transparent 74%, rgba(255,255,255,0.1) 75%, rgba(255,255,255,0.1) 76%, transparent 77%),
    linear-gradient(90deg, transparent 24%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.1) 26%, transparent 27%, transparent 74%, rgba(255,255,255,0.1) 75%, rgba(255,255,255,0.1) 76%, transparent 77%)
  `,
            backgroundSize: '30px 30px',
            pointerEvents: 'none'
          }
        },
        randomDots: {
          width: '100%',
          padding: "{dimension.padding.extraloose} {dimension.padding.loose}",
          borderRadius: "{dimension.borderradius.large}",
          background: "linear-gradient(135deg, {color.primary.brand4} 0%, {color.secondary.violet5} 35%, {color.primary.brand6} 100%)",
          boxShadow: "{material.hierarchy.1f}",
          position: 'relative',
          overflow: 'hidden',
          marginBottom: "{dimension.margin.loose}",
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
    radial-gradient(circle at 10% 20%, rgba(255,255,255,0.1) 1px, transparent 2px),
    radial-gradient(circle at 80% 80%, rgba(255,255,255,0.08) 1px, transparent 2px),
    radial-gradient(circle at 40% 40%, rgba(255,255,255,0.12) 1px, transparent 2px),
    radial-gradient(circle at 90% 10%, rgba(255,255,255,0.1) 1px, transparent 2px)
  `,
            backgroundSize: '80px 80px, 120px 120px, 100px 100px, 60px 60px',
            pointerEvents: 'none'
          }
        },
        hive: {
          width: '100%',
          padding: "{dimension.padding.extraloose} {dimension.padding.loose}",
          borderRadius: "{dimension.borderradius.large}",
          background: "linear-gradient(135deg, {color.primary.brand4} 0%, {color.secondary.violet5} 35%, {color.primary.brand6} 100%)",
          boxShadow: "{material.hierarchy.1f}",
          position: 'relative',
          overflow: 'hidden',
          marginBottom: "{dimension.margin.loose}",
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
    linear-gradient(115deg, transparent 49%, rgba(255,255,255,0.1) 50%, transparent 51%),
    linear-gradient(245deg, transparent 49%, rgba(255,255,255,0.1) 50%, transparent 51%),
    linear-gradient(355deg, transparent 49%, rgba(255,255,255,0.1) 50%, transparent 51%)
  `,
            backgroundSize: '40px 35px',
            pointerEvents: 'none'
          }
        },
        slash: {
          width: '100%',
          padding: "{dimension.padding.extraloose} {dimension.padding.loose}",
          borderRadius: "{dimension.borderradius.large}",
          background: "linear-gradient(135deg, {color.primary.brand4} 0%, {color.secondary.violet5} 35%, {color.primary.brand6} 100%)",
          boxShadow: "{material.hierarchy.1f}",
          position: 'relative',
          overflow: 'hidden',
          marginBottom: "{dimension.margin.loose}",
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 5px,
      rgba(255,255,255,0.08) 5px,
      rgba(255,255,255,0.08) 10px
    )
  `,
            backgroundSize: '20px 20px',
            pointerEvents: 'none'
          }
        },
        matrixDots: {
          width: '100%',
          padding: "{dimension.padding.extraloose} {dimension.padding.loose}",
          borderRadius: "{dimension.borderradius.large}",
          background: "linear-gradient(135deg, {color.primary.brand4} 0%, {color.secondary.violet5} 35%, {color.primary.brand6} 100%)",
          boxShadow: "{material.hierarchy.1f}",
          position: 'relative',
          overflow: 'hidden',
          marginBottom: "{dimension.margin.loose}",
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
    radial-gradient(circle at 10px 10px, rgba(255,255,255,0.15) 1px, transparent 1px)
  `,
            backgroundSize: '25px 25px',
            pointerEvents: 'none'
          }
        },
        square: {
          width: '100%',
          padding: "{dimension.padding.extraloose} {dimension.padding.loose}",
          borderRadius: "{dimension.borderradius.large}",
          background: "linear-gradient(135deg, {color.primary.brand4} 0%, {color.secondary.violet5} 35%, {color.primary.brand6} 100%)",
          boxShadow: "{material.hierarchy.1f}",
          position: 'relative',
          overflow: 'hidden',
          marginBottom: "{dimension.margin.loose}",
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
          /* 几何线条纹理 */
          linear-gradient(45deg, transparent 49%, rgba(255,255,255,0.1) 50%, transparent 51%),
          linear-gradient(-45deg, transparent 49%, rgba(255,255,255,0.1) 50%, transparent 51%)
        `,
            backgroundSize: '30px 30px',
            pointerEvents: 'none'
          }
        },

      },
      defaultClass: 'square',
      title: {
        metaType: 'text',
        variant: 'bannerTitle',
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
        },
        audio: {
          metaType: 'audio',
          variant: 'normal'
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
          flex: '1',
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
          marginTop: "{dimension.margin.tight}",
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
          justifyContent: 'space-between',
          width: '100%',
          borderRadius: "{dimension.borderradius.xl}",
          background: `linear-gradient(135deg, {color.surfacecontainer.white100} 0%, {color.surface.grey0} 100%)`,
          padding: "{dimension.padding.extraloose}",
          gap: "{dimension.gap.tight}",
          boxShadow: `{material.hierarchy.B1}, {material.hierarchy.main}`,
          border: `{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}`,
          position: 'relative',
          flex: '1',
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
        },
        audio: {
          metaType: 'audio',
          variant: 'normal'
        }
      },
    },

    // 2. 优雅青蓝列表布局
    elegantList: {
      type: 'template',
      markdownMapping: {
        h2: 'title',
        h3: 'content.groupTitle',
        ul: 'content.groupList',
        p: 'summary.text',
        'p+ul:group': 'content.groupBlock*',
        'p+ol:group': 'content.groupBlock*'
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
          marginTop: "{dimension.margin.tight}",
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
          flex: '1',
          flexDirection: 'column',
          borderRadius: "{dimension.borderradius.xl}",
          background: `linear-gradient(135deg, {color.surfacecontainer.white100} 0%, {color.surface.grey0} 100%)`,
          padding: "{dimension.padding.extraloose}",
          gap: "{dimension.gap.base}",
          boxShadow: `{material.hierarchy.B1}, {material.hierarchy.main}`,
          border: `{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}`,
          margin: "{dimension.margin.base} 0",
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
            bottom: `calc(-{dimension.padding.extraloose} + {dimension.padding.base})`,
            right: `calc(-{dimension.padding.extraloose} + {dimension.padding.base})`,
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, {color.secondary.violet4} 0%, {color.secondary.violet6} 100%)`,
            boxShadow: `{material.hierarchy.main}`,
          },
          '& > *:last-child::after': {
            content: "''",
            position: 'absolute',
            bottom: `calc(-{dimension.padding.extraloose} + {dimension.padding.base})`,
            left: `calc(-{dimension.padding.extraloose} + {dimension.padding.base})`,
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, {color.secondary.violet4} 0%, {color.secondary.violet6} 100%)`,
            boxShadow: `{material.hierarchy.main}`,
          },
        },
        groupTitle: {
          metaType: 'text',
          variant: 'elegantCardSubtitle',
          style: {
            marginTop: "{dimension.margin.base}",
            marginBottom: "{dimension.margin.tight}"
          }
        },
        groupList: {
          metaType: 'text',
          variant: 'elegantCardSegment',
          style: {
            padding: "{dimension.padding.tight} {dimension.padding.base}",
            background: "{color.secondarycontainer.violet0}",
            borderRadius: "{dimension.borderradius.medium}",
            borderLeft: `{dimension.borderwidth.base} solid {color.secondary.violet4}`,
            position: 'relative',
          }
        },
        "groupBlock*": {
          type: 'template',
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: "{dimension.gap.tight}",
            padding: "{dimension.padding.base}",
          },
          markdownMapping: {
            p: 'groupTitle',
            ul: 'groupList',
            ol: 'groupList'
          },
          groupTitle: {
            metaType: 'text',
            variant: 'elegantCardSubtitle',
            style: {
              margin: "{dimension.margin.base} 0",
              fontWeight: "{font.fontweight.semibold}"
            }
          },
          groupList: {
            metaType: 'text',
            variant: 'elegantCardSegment',
            style: {
              padding: "{dimension.padding.tight} {dimension.padding.base}",
              background: "{color.secondarycontainer.violet0}",
              borderRadius: "{dimension.borderradius.medium}",
              borderLeft: `{dimension.borderwidth.base} solid {color.secondary.violet4}`,
              position: 'relative'
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
        flexGrow: '1',
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
          flex: '1',
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
            flex: '1',
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
    // ==================== headerCard 系列 ====================
    headerCard: {
      type: 'template',
      markdownMapping: {
        h2: 'title',
        p: 'text',
        "chart:*": 'chartContainer.chart*'
      },
      style: {
        display: 'flex',
        flexDirection: 'column',
        padding: "{dimension.padding.extraloose} 0",
        boxShadow: "{material.hierarchy.main}",
        borderRadius: "{dimension.borderradius.xl}",
        borderWidth: "{dimension.borderwidth.narrow}",
        borderColor: "{color.surfacecontainer.black12}",
        borderStyle: "solid",
        background: "{color.surfacecontainer.white100}",
        // 嵌套选择器：重置内部ul元素的默认margin
        "& ul": {
          marginBlockStart: "0",
          marginBlockEnd: "0",
          marginTop: "0",
          marginBottom: "0"
        }
      },
      title: {
        style: {
          width: '100%',
        },
        metaType: 'text',
        variant: 'headerCardTitle',
      },
      text: {
        style: {
          padding: "0 {dimension.padding.base}",
          marginTop: "{dimension.margin.base}",
        },
        metaType: 'text',
        variant: 'headerCardText',
      },
      chartContainer: {
        type: 'template',
        style: {
          display: 'flex',
          flexDirection: 'row',
        },
        "chart*": {
          metaType: 'chart',
          variant: 'small'
        }
      }
    },

    headerPrecentCard: {
      type: 'template',
      markdownMapping: {
        h2: 'title',
        p: 'text',
        'h3+h4+p:group': 'percentItems.percentItem*', // 将h3+h4+p组合分组到percentItems容器中的percentItem
      },
      style: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: '1',
        borderRadius: "{dimension.borderradius.xl}",
        padding: "{dimension.padding.extraloose} 0",
        boxShadow: "{material.hierarchy.main}",
        borderWidth: "{dimension.borderwidth.narrow}",
        borderColor: "{color.surfacecontainer.black12}",
        borderStyle: "solid",
        background: "{color.surfacecontainer.white100}",
        // 嵌套选择器：重置内部ul元素的默认margin
        "& ul": {
          marginBlockStart: "0",
          marginBlockEnd: "0",
          marginTop: "0",
          marginBottom: "0"
        }
      },
      title: {
        style: {
          width: '100%',

        },
        metaType: 'text',
        variant: 'headerCardTitle',
      },
      text: {
        style: {
          padding: "0 {dimension.padding.base}",
          marginTop: "{dimension.margin.base}",
        },
        metaType: 'text',
        variant: 'headerCardText',
      },
      percentItems: {
        type: 'template',
        style: {
          display: 'flex',
          flexDirection: 'row',
          gap: "{dimension.gap.loose}",
          padding: "{dimension.padding.base}",
          flexWrap: "wrap",
          justifyContent: "space-between",
        },
        "percentItem*": {
          type: 'template',
          style: {
            display: 'flex',
            flexDirection: 'column',
            flex: "1",
            minWidth: "200px",
            padding: "{dimension.padding.base}",
            alignItems: "center",
            textAlign: "center",
          },
          markdownMapping: {
            h3: 'itemTitle',
            h4: 'percentValue',
            p: 'itemDescription',
          },
          itemTitle: {
            style: {
              marginBottom: "{dimension.margin.tight}",
            },
            metaType: 'text',
            variant: 'percentItemTitle',
          },
          percentValue: {
            style: {
              marginBottom: "{dimension.margin.tight}",
            },
            metaType: 'text',
            variant: 'percentValue',
          },
          itemDescription: {
            metaType: 'text',
            variant: 'percentItemDescription',
          }
        }
      }
    },


    // ==================== header Precent Card 新的实验样式 ====================

    headerPrecentCardExpe: {
      type: 'template',
      markdownMapping: {
        h2: 'title',
        p: 'text',
        'h3+h4+p:group': 'percentItems.percentItem*', // 将h3+h4+p组合分组到percentItems容器中的percentItem
      },
      style: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: '1',
        borderRadius: "{dimension.borderradius.xl}",
        padding: "{dimension.padding.extraloose} 0",
        boxShadow: "{material.hierarchy.main}",
        borderWidth: "{dimension.borderwidth.narrow}",
        borderColor: "{color.surfacecontainer.black12}",
        borderStyle: "solid",
        background: "{color.surfacecontainer.white100}",
        // 嵌套选择器：重置内部ul元素的默认margin
        "& ul": {
          marginBlockStart: "0",
          marginBlockEnd: "0",
          marginTop: "0",
          marginBottom: "0"
        }
      },
      title: {
        style: {
          width: '100%',
          padding: "0 {dimension.padding.base}",
          borderLeftWidth: "{dimension.borderwidth.wide}",
          borderLeftStyle: "solid",
          borderLeftColor: "{color.primary.brand5}",
        },
        metaType: 'text',
        variant: 'headerCardTitle',
      },
      text: {
        style: {
          padding: "0 {dimension.padding.base}",
          marginTop: "{dimension.margin.base}",
        },
        metaType: 'text',
        variant: 'headerCardText',
      },
      percentItems: {
        type: 'template',
        style: {
          display: 'flex',
          flexDirection: 'row',
          gap: "{dimension.gap.loose}",
          padding: "{dimension.padding.base}",
          flexWrap: "wrap",
          justifyContent: "space-between",
        },
        "percentItem*": {
          metaType: 'component',
          variant: 'newPrecentItem',
        }
      }
    },

    // ==================== 新的实验样式位置 ====================

    // ==================== 简约系列 ====================

    minimalistBorderLessCard: {
      type: 'template',
      markdownMapping: {
        h2: 'title',
        h3: 'pageTitle',
        p: 'content',
      },
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: "{dimension.gap.tight}",
      },
      title: {
        metaType: 'text',
        variant: 'minimalistBorderLessCardTitle',
      },
      pageTitle: {
        metaType: 'text',
        variant: 'minimalistBorderLessCardPageTitle',
      },
      content: {
        style: {
          paddingTop: "{dimension.padding.base}",
        },
        metaType: 'text',
        variant: 'minimalistBorderLessCardContent',
      }
    },
    minimalistHeaderCard: {
      type: 'template',
      markdownMapping: {
        h2: 'title',
        h3: 'label'
      },
      style: {
        width: '360px',
        padding: "{dimension.padding.base}",
        borderTopRightRadius: "{dimension.borderradius.xl}",
        borderTopLeftRadius: "{dimension.borderradius.xl}",
        background: "{color.surfacecontainer.white100}",
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
      },
      title: {
        metaType: 'text',
        style: {
          paddingLeft: "{dimension.padding.base}",
        },
        variant: 'minimalistBorderLessCardTitle',
      },
      label: {
        metaType: 'component',
        variant: 'labelTitle',
        parameters: {
          labelBgColor: "{color.primary.brand4}"
        }
      }
    },
    minimalistListCard: {
      type: 'template',
      markdownMapping: {
        h2: 'title',
        p: 'content',
        'h3+h4:group': 'listItems.listItem*',
      },
      style: {
        // marginTop: "{dimension.margin.base}",
        display: 'flex',
        flexDirection: 'column',
        padding: "{dimension.padding.base}",
        gap: "{dimension.gap.base}",
        borderRadius: "{dimension.borderradius.xl}",
      },
      title: {
        metaType: 'text',
        style: {
          paddingTop: "{dimension.padding.base}",
          paddingLeft: "{dimension.padding.loose}",
        },
        variant: 'minimalistListCardTitle',
      },
      content: {
        metaType: 'text',
        style: {
          paddingLeft: "{dimension.padding.base}",
        },
        variant: 'minimalistListCardContent',
      },
      listItems: {
        type: 'template',
        style: {
          display: 'flex',
          flexDirection: 'row',
          gap: "{dimension.gap.loose}",
          padding: "{dimension.padding.base}",
          flexWrap: "wrap",
          justifyContent: "space-between",
        },
        "listItem*": {
          type: 'template',
          style: {
            flex: "0 0 48%",
            borderRadius: "{dimension.borderradius.large}",
            background: "{color.basic.brand.1}",
            display: 'flex',
            padding: "{dimension.padding.base}",
            flexDirection: 'column',
          },
          markdownMapping: {
            h3: 'itemTitle',
            h4: 'itemDescription',
          },
          itemTitle: {
            metaType: 'text',
            variant: 'minimalistListCardItemTitle',
          },
          itemDescription: {
            metaType: 'text',
            variant: 'minimalistListCardItemDescription',
          }
        }
      }
    },

    minimalistImageCard: {
      type: 'template',
      markdownMapping: {
        h2: 'title',
        h3: 'pageTitle',
        'img+h4+p:group': 'imageItems.imageItem*',
      },
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: "{dimension.gap.base}",
        marginTop: "{dimension.margin.base}",
        padding: "{dimension.padding.base}",
        borderRadius: "{dimension.borderradius.xl}",
      },
      title: {
        metaType: 'text',
        style: {
          paddingLeft: "{dimension.padding.base}",
        },
        variant: 'minimalistCardMainTitle',
      },
      pageTitle: {
        metaType: 'text',
        style: {
          paddingTop: "{dimension.padding.base}",
          paddingLeft: "{dimension.padding.base}",
        },
        variant: 'minimalistListCardTitle',
      },
      imageItems: {
        type: 'template',
        style: {
          display: 'flex',
          flexDirection: 'row',
          gap: "{dimension.gap.base}",
          justifyContent: "space-between",
        },
        "imageItem*": {
          type: 'template',
          style: {
            borderRadius: "{dimension.borderradius.xl}",
            background: "{color.basic.grey.0}",
            overflow: 'hidden',
            flex: "0 0 49%",
            display: 'flex',
            flexDirection: 'column',
          },
          markdownMapping: {
            img: 'image',
            h4: 'itemTitle',
            p: 'itemDescription',
          },
          image: {
            metaType: 'image',
            variant: 'minimalist',
          },
          itemTitle: {
            metaType: 'text',
            style: {
              marginTop: "{dimension.margin.base}",
              paddingBottom: "{dimension.padding.base}",
              paddingLeft: "{dimension.padding.base}",
              paddingRight: "{dimension.padding.base}",

            },
            variant: 'minimalistListCardItemTitle',
          },
          itemDescription: {
            metaType: 'text',
            style: {
              paddingLeft: "{dimension.padding.base}",
              paddingRight: "{dimension.padding.base}",
              marginBottom: "{dimension.margin.base}",
            },
            variant: 'minimalistBorderLessCardContent'
          }
        }
      }
    },

    minimalistButtonCard: {
      type: 'template',
      markdownMapping: {
        h2: 'title',
        p: 'content',
        'button:primary': 'buttonContainer.button',
        'button:secondary': 'buttonContainer.secondaryButton',
      },
      style: {
        display: 'flex',
        marginTop: "{dimension.margin.base}",
        flexDirection: 'column',
        gap: "{dimension.gap.base}",
        borderRadius: "{dimension.borderradius.xl}",
        padding: "{dimension.padding.base}",
      },
      title: {
        metaType: 'text',
        style: {
          paddingLeft: "{dimension.padding.base}",
          paddingTop: "{dimension.padding.base}",
          borderTop: `{dimension.borderwidth.base} solid {color.basic.grey.1}`,
          '&:first-child': {
            borderTop: 'none',
          }
        },
        variant: 'minimalistListCardTitle',
      },
      content: {
        metaType: 'text',
        variant: 'minimalistBorderLessCardContent',
        style: {
          marginTop: "{dimension.margin.base}",
          marginBottom: "{dimension.margin.base}",
          paddingLeft: "{dimension.padding.base}",
          paddingRight: "{dimension.padding.base}",
        }
      },
      buttonContainer: {
        type: 'template',
        style: {
          display: 'flex',
          flexDirection: 'row',
        },
        button: {
          metaType: 'button',
          variant: 'primary',
        },
        secondaryButton: {
          metaType: 'button',
          variant: 'secondary',
        }
      }
    },

    minimalistChartCard: {
      type: 'template',
      markdownMapping: {
        h2: 'headerContainer.headerTitle',
        h3: 'headerContainer.right.pageTitle',
        p: 'headerContainer.right.description',
        "chart:*": 'chartContainer.chart*'
      },
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: "{dimension.gap.base}",
        borderRadius: "{dimension.borderradius.xl}",
        padding: "{dimension.padding.base}",
        background: "{color.surfacecontainer.white100}",
      },
      headerContainer: {
        type: 'template',
        style: {
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: "{dimension.gap.base}",
        },

        // 左侧标题
        headerTitle: {
          style: {
            width: '105px',
          },
          metaType: 'text',
          variant: 'minimalistChartCardHeaderTitle',
        },

        // 右侧区域
        right: {
          type: 'template',
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: "{dimension.gap.base}",
          },
          pageTitle: {
            metaType: 'text',
            variant: 'minimalistChartCardPageTitle',
          },
          description: {
            metaType: 'text',
            variant: 'minimalistChartCardDescription',
          }
        }
      },

      chartContainer: {
        type: 'template',
        style: {
          display: 'flex',
          flexDirection: 'row',
          gap: "{dimension.gap.base}",
        },
        "chart*": {
          metaType: 'chart',
          variant: 'minimalist'
        }
      }
    }


  },

  tab: {
    standard: {
      tabContainer: {
        style: {
          padding: "{dimension.padding.superloose} {dimension.padding.extraloose}",
          background: `{color.basic.brand.0}`,
          borderRadius: "{dimension.borderradius.xl}",
          border: `{dimension.borderwidth.base} solid {color.basic.opacity.black.7}`,
          gap: "{dimension.gap.extraloose}",
          position: 'relative',
          overflow: 'hidden',
        },
      },
      tabList: {
        style: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: "{dimension.padding.tight}",
          gap: "{dimension.gap.base}",
          borderRadius: "{dimension.borderradius.xxxxl}",
          background: "{color.basic.brand.1}",
          overflow: 'hidden'
        }
      },
      tabListItem: {
        normal: {
          metaType: 'text',
          variant: 'tabItemText',
          style: {
            flexGrow: "1",
            padding: "{dimension.padding.tight}",
          }
        },
        active: {
          metaType: 'text',
          variant: 'tabActiveItemText',
          style: {
            flexGrow: "1",
            padding: "{dimension.padding.tight}",
            background: "{color.onprimary.white100}",
            borderRadius: "{dimension.borderradius.large}",
          }
        }
      },
      tabPanel: {
        style: {
          padding: "{dimension.padding.base} {dimension.padding.semiloose}",
          borderRadius: "{dimension.borderradius.large}",
          background: "{color.surfacecontainer.white100}",
        }
      }
    },
  },
  video: {
    normal: {
      width: "100%",
      height: "auto",
    }
  },
  audio: {
    normal: {
      width: "auto",
      height: "auto"
    }
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
      padding: '0',
      margin: '0',
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

    background: {
      width: '100%',
      height: '100% ',
      objectFit: 'cover',
      filter: 'brightness(0.65)',
      transform: 'scale(1.05)',
      borderRadius: "{dimension.borderradius.medium}",
      borderWidth: "{dimension.borderwidth.narrow}",
      borderColor: "{color.surfacecontainer.black16}",
      borderStyle: "solid",
      boxShadow: "{material.hierarchy.main}",
      clipPath: "none",
      transition: CSS_VARIABLE_SYSTEM.ANIMATION.SMOOTH,
      maxWidth: "100%",
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
    },

    minimalist: {
      width: "100%",
      height: "300px",
      objectFit: "cover",
      clipPath: "none",
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
  },

  // ==================== 封装组件 ====================（用于支持通用组件的样式配置）
  component: {
    multimediaCard: {
      type: 'template',
      hasUpdateEvent: true,
      layoutModes: [
        {
          name: 'default',
          condition: 'true',
          style: {
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '{dimension.borderradius.xl}',
            padding: '{dimension.padding.loose}',
            background: '{color.surfacecontainer.white100}',
            boxShadow: '{material.hierarchy.1f}',
            gap: '{dimension.gap.base}'
          },
          structure: {
            groups: [
              {
                name: 'mediaLayer',
                slots: ['audio', 'video'],
                type: 'template',
                style: {
                  position: 'relative',
                  zIndex: '0',
                  overflow: 'hidden',
                  borderRadius: '{dimension.borderradius.large}'
                }
              },
              {
                name: 'contentLayer',
                type: 'template',
                style: {
                  position: 'relative',
                  zIndex: '1'
                },
                groups: [
                  { name: 'titleBlock', slots: ['title'] },
                  { name: 'descriptionBlock', slots: ['description'] }
                ]
              }
            ]
          }
        }
      ],
      slotConfigs: {
        audio: {
          metaType: 'audio',
          variant: 'standard'
        },
        video: {
          metaType: 'video',
          variant: 'standard'
        },
        title: {
          metaType: 'text',
          variant: 'multimediaCardTitle',
          variantStyle: {
            fontSize: '{font.size.title.medium}',
            fontWeight: '{font.weight.bold}',
            color: '{color.content.primary}'
          }
        },
        description: {
          metaType: 'text',
          variant: 'multimediaCardDescription',
          variantStyle: {
            fontSize: '{font.size.body.medium}',
            color: '{color.content.secondary}'
          }
        }
      }
    },
    // 半分比 item 组件
    precentItem: {
      type: 'template',
      style: {
        display: 'flex',
        flexDirection: 'column',
        flex: "1",
        minWidth: "200px",
        padding: "{dimension.padding.base}",
        alignItems: "center",
        textAlign: "center",
      },
      markdownMapping: {
        h3: 'itemTitle',
        h4: 'percentValue',
        p: 'itemDescription',
      },
      itemTitle: {
        style: {
          marginBottom: "{dimension.margin.tight}",
        },
        metaType: 'text',
        variant: 'percentItemTitle',
      },
      percentValue: {
        style: {
          marginBottom: "{dimension.margin.tight}",
        },
        metaType: 'text',
        variant: 'percentValue',
      },
      itemDescription: {
        metaType: 'text',
        variant: 'percentItemDescription',
      }
    },
    newPrecentItem: {
      type: 'template',
      style: {
        display: 'flex',
        flexDirection: 'column',
        flex: "1",
        minWidth: "200px",
        padding: "{dimension.padding.base}",
        alignItems: "center",
        textAlign: "center",
        background: "{color.basic.red.0}",
        borderRadius: "{dimension.borderradius.xl}",

      },

      markdownMapping: {
        h3: 'header.title',
        h4: 'precentContainer',  // 🔧 修复：h4 移到 p 之前，匹配实际 markdown 顺序
        p: 'header.description',
      },
      header: {
        type: 'template',
        style: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: "{dimension.margin.base}",
        },
        title: {
          metaType: 'component',
          variant: 'labelTitle',
        },
        description: {
          metaType: 'text',
          variant: 'percentItemDescription'
        }
      },
      precentContainer: {
        metaType: 'component',
        variant: 'halfCirclePrecent',
        parameters: {
          fillColor: "{color.basic.red.0}"
        }
      },
    },
    // lable 标题组件
    labelTitle: {
      parameters: {
        labelBgColor: {
          source: 'outer',
          default: '{color.basic.red.9}'
        }
      },
      style: {
        '--bg-color': '$labelBgColor',
        padding: "{dimension.padding.tight} {dimension.padding.base}",
        borderRadius: "{dimension.borderradius.xl}",
        background: "var(--bg-color)",
      },
      metaType: 'text',
      variant: 'precentItemLabel',
    },

    // 半圆进度条组件
    halfCirclePrecent: {
      type: 'template',
      parameters: {
        progressValue: {
          source: 'h4',
          expression: 'replace("%", "")',
        },
        fillColor: {
          source: 'outer',
          default: '{color.surfacecontainer.white100}'
        }
      },
      style: {
        position: 'relative',
        width: '200px',
        height: '100px',
        '--p': '$progressValue',
        '--progress-deg': 'calc(var(--p) * 1.8deg)',
        '--bg-color': '$fillColor'
      },
      required: ['progressTrack', 'progressFill', 'progressInner'],
      markdownMapping: {
        'h4': 'progressValue',
      },
      progressTrack: {
        type: 'template',
        style: {
          position: 'absolute',
          width: '200px',
          height: '100px',
          borderRadius: '100px 100px 0 0',
          background: '#fee2e2',
        }
      },
      progressFill: {
        type: 'template',
        style: {
          position: 'absolute',
          width: '200px',
          height: '100px',
          borderRadius: '100px 100px 0 0',
          overflow: 'hidden',
          '&::before': {
            content: "''",
            position: 'absolute',
            width: '200px',
            height: '200px',
            top: '0',
            left: '0',
            borderRadius: '50%',
            background: 'conic-gradient(from 270deg, #ef4444 0deg, #ef4444 var(--progress-deg), transparent var(--progress-deg))',
          }
        }
      },
      progressInner: {
        type: 'template',
        style: {
          position: 'absolute',
          width: '160px',
          height: '80px',
          top: '20px',
          left: '20px',
          background: 'var(--bg-color)',
          borderRadius: '84px 84px 0 0',
          zIndex: '1',
        }
      },
      progressValue: {
        type: 'template',
        style: {
          position: 'absolute',
          bottom: '10px',
          textWrap: 'nowrap',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: '2',
        },
        metaType: 'text',
        variant: 'percentValue'
      }
    },

    // card 形式组件
    simpleCard: {
      type: 'template',
      style: {
        flex: "0 0 48%",
        borderRadius: "{dimension.borderradius.large}",
        background: "{color.basic.brand.1}",
        display: 'flex',
        padding: "{dimension.padding.base}",
        flexDirection: 'column',
      },
      markdownMapping: {
        h3: 'itemTitle',
        h4: 'itemDescription',
      },
      itemTitle: {
        metaType: 'text',
        variant: 'minimalistListCardItemTitle',
      },
      itemDescription: {
        metaType: 'text',
        variant: 'minimalistListCardItemDescription',
      }
    },

    // ==================== 插槽标签示例组件 ====================

    // 产品卡片 - 使用插槽标签系统
    productCard: {
      type: 'template',
      style: {
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '{dimension.borderradius.xl}',
        padding: '{dimension.padding.base}',
        background: '{color.surfacecontainer.white100}',
        boxShadow: '{material.hierarchy.1f}',
        gap: '{dimension.gap.tight}',
        maxWidth: '320px'
      },
      // 使用 slotConfigs 定义插槽
      slotConfigs: {
        image: {
          metaType: 'image',
          variant: 'rounded',
          variantStyle: {
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            borderRadius: '{dimension.borderradius.medium}'
          }
        },
        title: {
          metaType: 'text',
          variant: 'h4',
          variantStyle: {
            margin: '{dimension.margin.tight} 0',
            color: '{color.onsurface.black88}'
          }
        },
        description: {
          metaType: 'text',
          variant: 'p',
          variantStyle: {
            color: '{color.onsurface.black64}',
            fontSize: '{font.size.small}',
            margin: '0'
          }
        },
        price: {
          type: 'template',
          style: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'baseline',
            gap: '{dimension.gap.tight}',
            marginTop: '{dimension.margin.base}'
          },
          metaType: 'text',
          variant: 'p',
          variantStyle: {
            color: '{color.primary.brand5}',
            fontWeight: 'bold',
            fontSize: '{font.size.large}',
            margin: '0'
          }
        },
        button: {
          metaType: 'button',
          variant: 'primary',
          variantStyle: {
            marginTop: '{dimension.margin.base}'
          }
        }
      },
      // 可选：定义插槽元数据（用于验证）
      slots: {
        image: {
          required: false,
          optional: true,
          supportedAttributes: ['src', 'alt']
        },
        title: {
          required: true,
          optional: false
        },
        description: {
          required: false,
          optional: true
        },
        price: {
          required: false,
          optional: true
        },
        button: {
          required: false,
          optional: true,
          supportedAttributes: ['href', 'target']
        }
      }
    },

    // 🎯 智能产品卡片 - 条件布局模式
    smartProductCard: {
      type: 'template',

      // 🆕 布局模式配置（按优先级排列）
      layoutModes: [
        // 模式1：完整信息布局（有图片时，纵向布局）
        {
          name: 'withImage',
          condition: 'has:image',
          style: {
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '{dimension.borderradius.xl}',
            background: '{color.surfacecontainer.white100}',
            boxShadow: '{material.hierarchy.1f}',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            position: 'relative',
            maxWidth: '400px',
            padding: '0',
            gap: '0',
            '&:hover': {
              boxShadow: '{material.hierarchy.3f}',
              transform: 'translateY(-2px)'
            }
          },
          structure: {
            groups: [
              // 图片区域（顶部）
              {
                name: 'imageArea',
                slots: ['badge', 'image'],
                type: 'template',
                style: {
                  position: 'relative',
                  width: '100%'
                }
              },
              // 内容区域（嵌套结构）
              {
                name: 'contentArea',
                type: 'template',
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '{dimension.padding.base}',
                  gap: '{dimension.gap.tight}'
                },
                // 🆕 支持嵌套分组
                groups: [
                  // 标题和评分在同一行（如果有评分）
                  {
                    name: 'header',
                    condition: 'has:rating',
                    slots: ['title', 'rating'],
                    type: 'template',
                    style: {
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '{dimension.gap.tight}',
                      marginBottom: '{dimension.margin.tight}'
                    }
                  },
                  // 只有标题（没有评分时）
                  {
                    name: 'titleOnly',
                    condition: 'no:rating',
                    slots: ['title']
                  },
                  // 标签
                  {
                    name: 'tags',
                    condition: 'has:tags',
                    slots: ['tags']
                  },
                  // 描述
                  {
                    name: 'description',
                    condition: 'has:description',
                    slots: ['description']
                  },
                  // 底部：价格和操作按钮
                  {
                    name: 'footer',
                    condition: 'has:price || has:actions || has:footer',
                    slots: ['price', 'actions', 'footer'],
                    type: 'template',
                    style: {
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '{dimension.gap.base}',
                      marginTop: 'auto',
                      paddingTop: '{dimension.padding.tight}',
                      borderTop: '1px solid {color.surfacecontainer.black12}'
                    }
                  }
                ]
              }
            ]
          }
        },

        // 模式2：简化布局（无图片时）
        {
          name: 'simple',
          condition: 'default',
          style: {
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '{dimension.borderradius.xl}',
            background: '{color.surfacecontainer.white100}',
            boxShadow: '{material.hierarchy.1f}',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            position: 'relative',
            maxWidth: '400px',
            padding: '{dimension.padding.base}',
            gap: '{dimension.gap.tight}',
            '&:hover': {
              boxShadow: '{material.hierarchy.3f}',
              transform: 'translateY(-2px)'
            }
          },
          structure: {
            groups: [
              // 标题和评分
              {
                name: 'header',
                condition: 'has:rating',
                slots: ['title', 'rating'],
                type: 'template',
                style: {
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '{dimension.gap.tight}'
                }
              },
              {
                name: 'titleOnly',
                condition: 'no:rating',
                slots: ['title']
              },
              // 标签
              {
                name: 'tags',
                condition: 'has:tags',
                slots: ['tags']
              },
              // 描述
              {
                name: 'description',
                condition: 'has:description',
                slots: ['description']
              },
              // 底部
              {
                name: 'footer',
                condition: 'has:price || has:actions || has:footer',
                slots: ['price', 'actions', 'footer'],
                type: 'template',
                style: {
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '{dimension.gap.base}',
                  marginTop: 'auto',
                  paddingTop: '{dimension.padding.tight}',
                  borderTop: '1px solid {color.surfacecontainer.black12}'
                }
              }
            ]
          }
        }
      ],

      // 🔧 保留旧的 style 作为后备（如果没有 layoutModes）
      style: {
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '{dimension.borderradius.xl}',
        background: '{color.surfacecontainer.white100}',
        boxShadow: '{material.hierarchy.1f}',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        position: 'relative',
        maxWidth: '400px',
        padding: '0',
        gap: '0',

        '&:hover': {
          boxShadow: '{material.hierarchy.3f}',
          transform: 'translateY(-2px)'
        }
      },

      slotConfigs: {
        // 徽章 - 绝对定位，不影响布局
        badge: {
          metaType: 'text',
          variant: 'p',
          variantStyle: {
            position: 'absolute',
            top: '{dimension.padding.tight}',
            right: '{dimension.padding.tight}',
            padding: '{dimension.padding.supertight} {dimension.padding.tight}',
            background: '{color.error.red5}',
            color: '{color.onprimary.white100}',
            borderRadius: '{dimension.borderradius.small}',
            fontSize: '{font.size.tiny}',
            fontWeight: '{font.fontweight.bold}',
            zIndex: '10',
            margin: '0'
          }
        },

        // 图片 - 顶部，固定高度
        image: {
          metaType: 'image',
          variant: 'normal',
          variantStyle: {
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            flexShrink: '0',
            margin: '0',
            padding: '0'
          }
        },

        // 标题 - 大而醒目
        title: {
          metaType: 'text',
          variant: 'h4',
          variantStyle: {
            margin: '{dimension.margin.base} {dimension.margin.base} {dimension.margin.tight} {dimension.margin.base}',
            color: '{color.onsurface.black88}',
            fontWeight: '{font.fontweight.semibold}',
            fontSize: '{font.size.large}'
          }
        },

        // 评分 - 小而淡
        rating: {
          metaType: 'text',
          variant: 'p',
          variantStyle: {
            fontSize: '{font.size.small}',
            color: '{color.warning.orange5}',
            margin: '0 {dimension.margin.base} {dimension.margin.tight} {dimension.margin.base}'
          }
        },

        // 标签 - 灰色背景
        tags: {
          metaType: 'text',
          variant: 'p',
          variantStyle: {
            fontSize: '{font.size.small}',
            color: '{color.onsurface.black64}',
            margin: '0 {dimension.margin.base} {dimension.margin.tight} {dimension.margin.base}',
            padding: '{dimension.padding.supertight} {dimension.padding.tight}',
            background: '{color.surface.grey1}',
            borderRadius: '{dimension.borderradius.small}',
            display: 'inline-block'
          }
        },

        // 描述 - 限制3行
        description: {
          metaType: 'text',
          variant: 'p',
          variantStyle: {
            fontSize: '{font.size.small}',
            color: '{color.onsurface.black64}',
            lineHeight: '1.6',
            margin: '0 {dimension.margin.base} {dimension.margin.base} {dimension.margin.base}',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: '3',
            WebkitBoxOrient: 'vertical'
          }
        },


        // 价格 - 大而醒目
        price: {
          metaType: 'text',
          variant: 'p',
          variantStyle: {
            fontSize: '{font.size.xl}',
            fontWeight: '{font.fontweight.bold}',
            color: '{color.primary.brand5}',
            margin: 'auto {dimension.margin.base} {dimension.margin.tight} {dimension.margin.base}'
          }
        },

        // 操作按钮 - 支持多个按钮
        actions: {
          type: 'template',
          style: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '{dimension.gap.tight}',
            margin: '0 {dimension.margin.base} {dimension.margin.base} {dimension.margin.base}',
            marginLeft: 'auto'
          },
          metaType: 'button',
          variant: 'primary',
          variantStyle: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            whiteSpace: 'nowrap',
            padding: '{dimension.padding.base}',
            flexShrink: '0'
          }
        },

        // 自定义页脚容器 - 也支持多个按钮
        footer: {
          type: 'template',
          style: {
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '{dimension.gap.tight}',
            margin: '0 {dimension.margin.base} {dimension.margin.base} {dimension.margin.base}',
            marginLeft: 'auto'
          },
          metaType: 'button',
          variant: 'primary',
          variantStyle: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            whiteSpace: 'nowrap',
            padding: '{dimension.padding.base}',
            flexShrink: '0'
          }
        }
      },

      slots: {
        badge: { required: false, optional: true },
        image: { required: false, optional: true, supportedAttributes: ['src', 'alt'] },
        title: { required: true, optional: false },
        rating: { required: false, optional: true },
        tags: { required: false, optional: true },
        description: { required: false, optional: true },
        price: { required: false, optional: true },
        actions: { required: false, optional: true, supportedAttributes: ['href', 'target'] },
        footer: { required: false, optional: true, supportedAttributes: ['href', 'target'] }
      }
    },

    // 📊 指标 / KPI 卡片
    metricCard: {
      type: 'template',
      hasUpdateEvent: true,
      layoutModes: [
        {
          name: 'withChart',
          condition: 'has:chart_mini',
          style: {
            display: 'flex',
            flex: "1",
            flexDirection: 'column',
            gap: '{dimension.gap.base}',
            borderRadius: '{dimension.borderradius.xl}',
            padding: '{dimension.padding.loose}',
            background: '{color.surfacecontainer.white100}',
            boxShadow: '{material.hierarchy.1f}',
            border: '{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}'
          },

          structure: {
            groups: [
              {
                name: 'metaRow',
                condition: 'has:metric_label || has:time_range',
                slots: ['metric_label', 'time_range'],
                type: 'template',
                style: {
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '{dimension.gap.tight}',
                  flexWrap: 'wrap',
                  borderBottom: '1px solid {color.surfacecontainer.black8}',
                  paddingBottom: '{dimension.padding.supertight}',
                  marginBottom: '{dimension.margin.tight}'
                }
              },
              {
                name: 'contentRow',
                type: 'template',
                style: {
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '{dimension.gap.loose}',
                  alignItems: 'stretch'
                },
                groups: [
                  {
                    name: 'metricColumn',
                    type: 'template',
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '{dimension.gap.tight}',
                      justifyContent: 'space-between',
                      flex: '1',
                      padding: '{dimension.padding.base} 0'
                    },
                    groups: [
                      {
                        name: 'metricContainer',
                        type: 'template',
                        condition: 'has:metric_label || has:metric_value || has:trend_value',
                        style: {
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '{dimension.gap.tight}',
                        },
                        groups: [
                          {
                            name: 'valueRow',
                            slots: ['metric_value']
                          },
                          {
                            name: 'trendRow',
                            condition: 'has:trend_value',
                            slots: ['trend_value'],
                            type: 'template',
                            style: {
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                              gap: '{dimension.gap.supertight}'
                            }
                          }
                        ]
                      },
                      {
                        name: 'status',
                        slots: ['status']
                      }
                    ]

                  },
                  {
                    name: 'chartMini',
                    slots: ['chart_mini'],
                    type: 'template',
                    style: {
                      width: '240px',
                      minHeight: '120px',
                      padding: '{dimension.padding.base}',
                      background: '{color.surfacecontainer.white96}',
                      borderRadius: '{dimension.borderradius.large}',
                      border: '1px solid {color.surfacecontainer.black8}',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }
                  }
                ]
              }
            ]
          }
        },
        {
          name: 'default',
          condition: 'default',
          style: {
            display: 'flex',
            flex: "1",
            flexDirection: 'column',
            gap: '{dimension.gap.base}',
            borderRadius: '{dimension.borderradius.xl}',
            padding: '{dimension.padding.loose}',
            background: '{color.surfacecontainer.white100}',
            boxShadow: '{material.hierarchy.1f}',
            border: '{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}'
          },
          structure: {
            groups: [
              {
                name: 'metaRow',
                condition: 'has:metric_label || has:time_range',
                slots: ['metric_label', 'time_range'],
                type: 'template',
                style: {
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '{dimension.gap.tight}',
                  flexWrap: 'wrap',
                  borderBottom: '1px solid {color.surfacecontainer.black8}',
                  paddingBottom: '{dimension.padding.supertight}',
                  marginBottom: '{dimension.margin.tight}'
                }
              },
              {
                name: 'contentRow',
                type: 'template',
                style: {
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                },
                groups: [
                  {
                    name: 'metricColumn',
                    type: 'template',
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '{dimension.gap.tight}',
                    },
                    groups: [
                      {
                        name: 'valueRow',
                        slots: ['metric_value']
                      },
                      {
                        name: 'trendRow',
                        condition: 'has:trend_icon || has:trend_value',
                        slots: ['trend_icon', 'trend_value'],
                        type: 'template',
                        style: {
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: '{dimension.gap.supertight}'
                        }
                      }
                    ]
                  },
                  {
                    name: 'status',
                    slots: ['status'],
                    styleReference: 'status_large'
                  }
                ]
              },
              {

              }
            ]
          }
        }
      ],
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '{dimension.gap.base}',
        borderRadius: '{dimension.borderradius.xl}',
        padding: '{dimension.padding.loose}',
        background: '{color.surfacecontainer.white100}',
        boxShadow: '{material.hierarchy.1f}',
        border: '{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}',

      },
      slotConfigs: {
        metric_value: {
          metaType: 'text',
          variant: 'metricCardValue'
        },
        metric_label: {
          metaType: 'text',
          variant: 'p',
          variantStyle: {
            fontSize: '{font.size.tiny}',
            fontWeight: '{font.fontweight.medium}',
            color: '{color.onsurface.black64}',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            margin: '0',
            opacity: '0.85'
          }
        },
        trend_value: {
          metaType: 'text',
          variant: 'p',
          variantStyle: {
            padding: '{dimension.padding.supertight} {dimension.padding.tight}',
            background: '{color.success.green1}',
            borderRadius: '{dimension.borderradius.medium}',
            fontSize: '{font.size.small}',
            fontWeight: '{font.fontweight.semibold}',
            color: '{color.success.green6}',
            margin: '0',
            letterSpacing: '0.02em'
          }
        },
        chart_mini: {
          type: 'template',
          style: {
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, {color.surface.grey0} 0%, {color.surfacecontainer.white100} 100%)',
            borderRadius: '{dimension.borderradius.large}',
            border: '1px dashed {color.surfacecontainer.black8}'
          },
          metaType: 'chart',
          variant: 'mini'
        },
        time_range: {
          metaType: 'text',
          variant: 'p',
          variantStyle: {
            fontSize: '{font.size.tiny}',
            fontWeight: '{font.fontweight.medium}',
            color: '{color.onsurface.black48}',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            margin: '0'
          }
        },
        status: {
          metaType: 'text',
          variant: 'p',
          variantStyle: {
            fontSize: '{font.size.xl}',
            fontWeight: '{font.fontweight.bold}',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '{color.primary.brand5}',
          }
        },
        status_large: {
          metaType: 'text',
          variant: 'p',
          variantStyle: {
            fontSize: '{font.size.xxxl}',
            fontWeight: '{font.fontweight.bold}',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '{color.primary.brand5}',
          }
        }
      },
      slots: {
        metric_value: { required: true, optional: false },
        metric_label: { required: true, optional: false },
        trend_icon: { required: false, optional: true },
        trend_value: { required: false, optional: true },
        chart_mini: { required: false, optional: true, supportedAttributes: ['chart', 'title', 'sort'] },
        time_range: { required: false, optional: true },
        status: { required: false, optional: true }
      }
    },

    // Hiring Title Card
    hiringTitleCard: {
      type: 'template',
      hasUpdateEvent: true,
      layoutModes: [{
        name: 'default',
        condition: 'default',
        style: {
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          borderRadius: '{dimension.borderradius.xxxxl}',
          background: '{color.basic.brand.5}',
          padding: '{dimension.padding.superloose}',
        },
        structure: {
          groups: [{
            name: 'titleBlock',
            slots: ['title', 'desc'],
            type: 'template',
            style: {
              display: 'flex',
              flexDirection: 'column',
              gap: '{dimension.gap.tight}',
            }
          }, {
            name: 'badgeBlock',
            slots: ['badge'],
          }]
        }
      }],
      slotConfigs: {
        title: {
          metaType: 'text',
          variantStyle: {
            lineHeight: '1',
            fontSize: '{font.size.xxxl}',
            fontWeight: '{font.fontweight.bold}',
            color: '{color.basic.opacity.white.100}',
          }
        },
        desc: {
          metaType: 'text',
          variantStyle: {
            width: '70%',
            fontSize: '{font.size.medium}',
            color: '{color.basic.opacity.white.64}',
          }
        },
        badge: {
          metaType: 'text',
          variantStyle: {
            fontSize: '{font.size.medium}',
            color: '{color.basic.opacity.white.100}',
            padding: '{dimension.padding.base} {dimension.padding.extraloose}',
            background: '{color.basic.opacity.white.12}',
            borderRadius: '{dimension.borderradius.full}',
          }
        }
      }
    },

    // Hiring List Card
    hiringListCard: {
      type: 'template',
      hasUpdateEvent: true,
      layoutModes: [{
        name: 'default',
        condition: 'default',
        style: {
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '{dimension.borderradius.xxxxl}',
          padding: '{dimension.padding.superloose}',
          background: 'linear-gradient(135deg, {color.primary.brand3} 0%, {color.primary.brand5} 100%)',
        },
        structure: {
          groups: [{
            name: 'topBlock',
            type: 'template',
            style: {
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
              alignItems: 'flex-start',
            },
            groups: [{
              name: 'shortListContainer',
              type: 'template',
              style: {
                width: '50%',
                display: 'flex',
                flexDirection: 'column',
                gap: '{dimension.gap.base}',
              },
              groups: [{
                name: 'shortListItem',
                type: 'template',
                style: {
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '{dimension.borderradius.xxxxl}',
                  padding: '{dimension.padding.base} {dimension.padding.superloose}',
                  background: '{color.basic.brand.5}',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    left: '12px',
                    width: '6px',
                    height: '25%',
                    borderRadius: '{dimension.borderradius.full}',
                    background: '{color.basic.brand.3}',
                  }
                },
                slots: ['salaryTitle', 'salaryValue'],
              }, {
                name: 'shortListItem1',
                type: 'template',
                style: {
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '{dimension.borderradius.xxxxl}',
                  padding: '{dimension.padding.base} {dimension.padding.superloose}',
                  background: '{color.basic.blue.6}',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    left: '12px',
                    width: '6px',
                    height: '25%',
                    borderRadius: '{dimension.borderradius.full}',
                    background: '{color.basic.blue.3}',
                  }
                },
                slots: ['hrTitle', 'hrValue'],
              }]
            }, {
              name: 'titleBlock',
              type: 'template',
              style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                width: '35%',
                gap: '{dimension.gap.base}',
              },
              slots: ['title', 'desc']
            }]
          }, {
            name: 'listContainer',
            type: 'template',
            style: {
              marginTop: '{dimension.margin.base}',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '{dimension.gap.base}',
            },
            groups: [{
              name: 'listItem1',
              type: 'template',
              style: {
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '{dimension.borderradius.xxxxl}',
                padding: '{dimension.padding.base} {dimension.padding.superloose}',
                background: '{color.basic.opacity.black.12}',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  left: '12px',
                  width: '6px',
                  height: '25%',
                  borderRadius: '{dimension.borderradius.full}',
                  background: '{color.basic.opacity.white.32}',
                }
              },
              slots: ['areaTitle', 'areaValue']
            }, {
              name: 'listItem2',
              type: 'template',
              style: {
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '{dimension.borderradius.xxxxl}',
                padding: '{dimension.padding.base} {dimension.padding.superloose}',
                background: '{color.basic.opacity.black.12}',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  left: '12px',
                  width: '6px',
                  height: '25%',
                  borderRadius: '{dimension.borderradius.full}',
                  background: '{color.basic.opacity.white.32}',
                }
              },
              slots: ['jobTitle', 'jobValue']
            }]
          }]
        }
      }],
      slotConfigs: {
        salaryTitle: {
          metaType: 'text',
          variantStyle: {
            fontSize: '{font.size.medium}',
            color: '{color.basic.opacity.white.48}',
            margin: 0,
          }
        },
        hrTitle: {
          metaType: 'text',
          variantStyle: {
            fontSize: '{font.size.medium}',
            color: '{color.basic.opacity.white.48}',
            margin: 0,
          }
        },
        jobTitle: {
          metaType: 'text',
          variantStyle: {
            fontSize: '{font.size.medium}',
            color: '{color.basic.opacity.white.48}',
            margin: 0,
          }
        },
        areaTitle: {
          metaType: 'text',
          variantStyle: {
            fontSize: '{font.size.medium}',
            color: '{color.basic.opacity.white.48}',
            margin: 0,
          }
        },
        areaValue: {
          metaType: 'text',
          variantStyle: {
            fontSize: '{font.size.xl}',
            color: '{color.basic.opacity.white.100}',
            margin: 0,
          }
        },
        jobValue: {
          metaType: 'text',
          variantStyle: {
            fontSize: '{font.size.xl}',
            color: '{color.basic.opacity.white.100}',
            margin: 0,
          }
        },
        salaryValue: {
          metaType: 'text',
          variantStyle: {
            fontSize: '{font.size.xl}',
            color: '{color.basic.opacity.white.100}',
            margin: 0,
          }
        },
        hrValue: {
          metaType: 'text',
          variantStyle: {
            fontSize: '{font.size.xl}',
            color: '{color.basic.opacity.white.100}',
            margin: 0,
          }
        },
        title: {
          metaType: 'text',
          variantStyle: {
            fontSize: '{font.size.xl}',
            color: '{color.basic.opacity.white.100}',
            margin: 0,
          }
        },
        desc: {
          metaType: 'text',
          variantStyle: {
            fontSize: 'font.size.medium',
            color: '{color.basic.opacity.white.64}'
          }
        }
      }
    },

    // Hiring Image Card
    hiringImageCard: {
      type: 'template',
      hasUpdateEvent: true,
      parameters: {
        image: {
          source: 'outer',
        }
      },
      layoutModes: [{
        name: 'default',
        condition: 'default',
        style: {
          backgroundImage: 'url({image})',
          padding: '{dimension.padding.extraloose}',
          borderRadius: '{dimension.borderradius.xxxxl}',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        },
        structure: {
          groups: [{
            name: 'contentBlock',
            slots: ['title', 'desc'],
            type: 'template',
            style: {
              display: 'flex',
              flexDirection: 'column',
              gap: '{dimension.gap.tight}',
              minHeight: '320px',
            }
          }]
        }
      }],
      slotConfigs: {
        title: {
          metaType: 'text',
          variantStyle: {
            fontSize: '{font.size.xxl}',
            color: '{color.basic.opacity.white.100}',
            lineHeight: '1',
          }
        },
        desc: {
          metaType: 'text',
          variantStyle: {
            width: '60%',
            fontSize: '{font.size.medium}',
            color: '{color.basic.opacity.white.64}'
          }
        }
      },
    },

    // 🌄 主视觉说明卡
    heroCard: {
      type: 'template',
      hasUpdateEvent: true,
      layoutModes: [
        {
          name: 'withCover',
          condition: 'has:cover_image',
          style: {
            display: 'flex',
            flex: "1",
            flexDirection: 'column',
            borderRadius: '{dimension.borderradius.xxxxl}',
            padding: '{dimension.padding.extraloose}',
            color: '{color.onprimary.white100}',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '320px',
            height: 'auto',
            boxShadow: '{material.hierarchy.2f}'
          },
          structure: {
            groups: [
              {
                name: 'coverLayer',
                slots: ['cover_image'],
                type: 'template',
                style: {
                  position: 'absolute',
                  inset: '0',
                  zIndex: '0',
                  overflow: 'hidden',
                  borderRadius: '{dimension.borderradius.xxxl}',
                  padding: '0'
                }
              },
              {
                name: 'contentLayer',
                type: 'template',
                style: {
                  position: 'relative',
                  zIndex: '1',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '{dimension.gap.superloose}'
                },
                groups: [
                  {
                    name: 'badgeRow',
                    condition: 'has:badge',
                    slots: ['badge'],
                    type: 'template',
                    style: {
                      display: 'flex',
                      flexDirection: 'row',
                      gap: '{dimension.gap.tight}',
                      flexWrap: 'wrap'
                    }
                  },
                  {
                    name: 'titleBlock',
                    slots: ['title']
                  },
                  {
                    name: 'subtitleBlock',
                    condition: 'has:subtitle',
                    slots: ['subtitle']
                  },
                  {
                    name: 'metricsRow',
                    condition: 'has:metrics',
                    slots: ['metrics*'],
                    type: 'template',
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '{dimension.gap.tight}'
                    }
                  },
                  {
                    name: 'ctaRow',
                    condition: 'has:cta_primary || has:cta_secondary',
                    slots: ['cta_primary', 'cta_secondary'],
                    type: 'template',
                    style: {
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      gap: '{dimension.gap.tight}',
                      flexWrap: 'wrap'
                    }
                  }
                ]
              }
            ]
          }
        },
        {
          name: 'default',
          condition: 'default',
          style: {
            display: 'flex',
            flex: '1',
            gap: '{dimension.gap.superloose}',
            flexDirection: 'column',
            borderRadius: '{dimension.borderradius.xxxxl}',
            padding: '{dimension.padding.extraloose}',
            background: 'linear-gradient(135deg, {color.primary.brand6} 0%, {color.secondary.violet5} 60%, {color.surfacecontainer.black12} 100%)',
            color: '{color.onprimary.white100}',
            position: 'relative',
            minHeight: '280px',
            height: 'auto',
            boxShadow: '{material.hierarchy.2f}'
          },
          structure: {
            groups: [
              {
                name: 'badgeRow',
                condition: 'has:badge',
                slots: ['badge'],
                type: 'template',
                style: {
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '{dimension.gap.tight}',
                  flexWrap: 'wrap'
                }
              },
              {
                name: 'titleBlock',
                slots: ['title']
              },
              {
                name: 'subtitleBlock',
                condition: 'has:subtitle',
                slots: ['subtitle']
              },
              {
                name: 'metricsRow',
                condition: 'has:metrics',
                slots: ['metrics*'],
                type: 'template',
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '{dimension.gap.tight}'
                }
              },
              {
                name: 'ctaRow',
                condition: 'has:cta_primary || has:cta_secondary',
                slots: ['cta_primary', 'cta_secondary'],
                type: 'template',
                style: {
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  gap: '{dimension.gap.tight}',
                  flexWrap: 'wrap'
                }
              }
            ]
          }
        }
      ],
      style: {
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '{dimension.borderradius.xxxxl}',
        padding: '{dimension.padding.extraloose}',
        background: 'linear-gradient(135deg, {color.primary.brand6} 0%, {color.secondary.violet5} 60%, {color.surfacecontainer.black12} 100%)',
        color: '{color.onprimary.white100}',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '280px',
        boxShadow: '{material.hierarchy.2f}'
      },
      slotConfigs: {
        cover_image: {
          type: 'template',
          style: {
            position: 'absolute',
            inset: '0',
            zIndex: '0',
            overflow: 'hidden',
            padding: '0',
            margin: '0'
          },
          metaType: 'image',
          variant: 'background',
          variantStyle: {
            padding: '0',
            margin: '0'
          }
        },
        badge: {
          metaType: 'text',
          variant: 'p',
          variantStyle: {
            display: 'inline-block',
            fontSize: '{font.size.tiny}',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '{color.basic.opacity.white.88}',
            padding: '{dimension.padding.semitight} {dimension.padding.base}',
            borderRadius: '{dimension.borderradius.full}',
            backdropFilter: 'blur(10px)',
            background: '{color.basic.opacity.white.16}',
            margin: '0'
          }
        },
        title: {
          metaType: 'text',
          variant: 'heroTitle'
        },
        subtitle: {
          metaType: 'text',
          variant: 'heroSubtitle'
        },
        metrics: {
          metaType: 'text',
          variant: 'heroMetric'
        },
        cta_primary: {
          metaType: 'button',
          variant: 'primary',
          variantStyle: {
            minWidth: '160px',
            boxShadow: '{material.hierarchy.1f}'
          }
        },
        cta_secondary: {
          metaType: 'button',
          variant: 'secondary',
          variantStyle: {
            minWidth: '160px',
            background: 'transparent',
            color: '{color.onprimary.white100}',
            border: '1px solid rgba(255,255,255,0.5)'
          }
        }
      },
      slots: {
        cover_image: { required: false, optional: true, supportedAttributes: ['src', 'alt'] },
        badge: { required: false, optional: true },
        title: { required: true, optional: false },
        subtitle: { required: false, optional: true },
        metrics: { required: false, optional: true },
        cta_primary: { required: false, optional: true, supportedAttributes: ['href', 'target'] },
        cta_secondary: { required: false, optional: true, supportedAttributes: ['href', 'target'] }
      }
    },

    // 🖼️ 内容展示卡（可视媒体信息卡片）
    contentDisplayCard: {
      type: 'template',
      hasUpdateEvent: true,
      layoutModes: [
        {
          name: 'withImage',
          condition: 'has:image',
          style: {
            display: 'flex',
            flex: "1",
            flexDirection: 'column',
            gap: '{dimension.gap.superloose}',
            borderRadius: '{dimension.borderradius.xl}',
            padding: '{dimension.padding.loose}',
            background: '{color.surfacecontainer.white100}',
            boxShadow: '{material.hierarchy.1f}',
            border: '{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}'
          },
          structure: {
            groups: [
              {
                name: 'mediaBlock',
                slots: ['image'],
                type: 'template',
                style: {
                  width: '100%',
                  borderRadius: '{dimension.borderradius.large}',
                  overflow: 'hidden',
                  aspectRatio: '4 / 3',
                  margin: 0,
                  padding: 0,
                  background: '{color.surfacecontainer.black7}'
                }
              },
              {
                name: 'contentBlock',
                type: 'template',
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '{dimension.gap.semiloose}'
                },
                groups: [
                  {
                    name: 'titleGroup',
                    slots: ['title']
                  },
                  {
                    name: 'subtitleGroup',
                    condition: 'has:subtitle',
                    slots: ['subtitle']
                  },
                  {
                    name: 'tagRow',
                    condition: 'has:tags',
                    slots: ['tags*'],
                    type: 'template',
                    style: {
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '{dimension.gap.tight}'
                    }
                  },
                  {
                    name: 'infoRow',
                    condition: 'has:rating || has:location || has:price',
                    type: 'template',
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: '{dimension.borderradius.large}',
                      background: '{color.primarycontainer.brand0}',
                      margin: '{dimension.margin.semitight} 0',
                      padding: '{dimension.padding.base}',
                      gap: '{dimension.gap.base}'
                    },
                    groups: [
                      {
                        name: 'priceRow',
                        condition: 'has:price',
                        slots: ['price'],
                        type: 'template',
                        style: {
                          display: 'flex',
                          justifyContent: 'flex-start'
                        }
                      },
                      {
                        name: 'ratingLocationRow',
                        condition: 'has:rating || has:location',
                        slots: ['rating', 'location'],
                        type: 'template',
                        style: {
                          display: 'flex',
                          alignItems: 'center',
                          gap: '{dimension.gap.base}',
                          flexWrap: 'wrap'
                        }
                      }
                    ]
                  },
                  {
                    name: 'ctaRow',
                    condition: 'has:cta',
                    slots: ['cta'],
                    type: 'template',
                    style: {
                      display: 'flex',
                      justifyContent: 'flex-start'
                    }
                  }
                ]
              }
            ]
          }
        },
        {
          name: 'default',
          condition: 'default',
          style: {
            display: 'flex',
            flex: "1",
            flexDirection: 'column',
            gap: '{dimension.gap.superloose}',
            borderRadius: '{dimension.borderradius.xl}',
            padding: '{dimension.padding.loose}',
            background: '{color.surfacecontainer.white100}',
            boxShadow: '{material.hierarchy.1f}',
            border: '{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}'
          },
          structure: {
            groups: [
              {
                name: 'contentBlock',
                type: 'template',
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '{dimension.gap.semiloose}'
                },
                groups: [
                  {
                    name: 'titleGroup',
                    slots: ['title']
                  },
                  {
                    name: 'subtitleGroup',
                    condition: 'has:subtitle',
                    slots: ['subtitle']
                  },
                  {
                    name: 'tagRow',
                    condition: 'has:tags',
                    slots: ['tags*'],
                    type: 'template',
                    style: {
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '{dimension.gap.tight}'
                    }
                  },
                  {
                    name: 'infoRow',
                    condition: 'has:rating || has:location || has:price',
                    type: 'template',
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: '{dimension.borderradius.large}',
                      background: '{color.primarycontainer.brand0}',
                      margin: '{dimension.margin.semitight} 0',
                      padding: '{dimension.padding.base}',
                      gap: '{dimension.gap.base}'
                    },
                    groups: [
                      {
                        name: 'priceRow',
                        condition: 'has:price',
                        slots: ['price'],
                        type: 'template',
                        style: {
                          display: 'flex',
                          justifyContent: 'flex-start'
                        }
                      },
                      {
                        name: 'ratingLocationRow',
                        condition: 'has:rating || has:location',
                        slots: ['rating', 'location'],
                        type: 'template',
                        style: {
                          display: 'flex',
                          alignItems: 'center',
                          gap: '{dimension.gap.base}',
                          flexWrap: 'wrap'
                        }
                      }
                    ],
                  },
                  {
                    name: 'ctaRow',
                    condition: 'has:cta',
                    slots: ['cta'],
                    type: 'template',
                    style: {
                      display: 'flex',
                      justifyContent: 'flex-start'
                    }
                  }
                ]
              }
            ]
          }
        }
      ],
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '{dimension.gap.superloose}',
        borderRadius: '{dimension.borderradius.xl}',
        padding: '{dimension.padding.loose}',
        background: '{color.surfacecontainer.white100}',
        boxShadow: '{material.hierarchy.1f}',
        border: '{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}',
      },
      slotConfigs: {
        image: {
          metaType: 'image',
          variant: 'cover',
          variantStyle: {
            width: '100%',
            height: '100%',
            margin: 0,
            padding: 0,
            objectFit: 'cover',
            display: 'block'
          },
          supportedAttributes: ['src', 'alt']
        },
        title: {
          metaType: 'text',
          variant: 'h3',
          variantStyle: {
            margin: '0',
            fontSize: '{font.size.xxl}',
            fontWeight: '{font.fontweight.bold}',
            color: '{color.basic.opacity.black.100}'
          }
        },
        subtitle: {
          metaType: 'text',
          variant: 'p',
          variantStyle: {
            margin: '0',
            fontSize: '{font.size.medium}',
            color: '{color.basic.opacity.black.48}',
            lineHeight: '1.5'
          }
        },
        tags: {
          metaType: 'text',
          variant: 'p',
          variantStyle: {
            margin: '0',
            fontSize: '{font.size.tiny}',
            fontWeight: '{font.fontweight.semibold}',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: '{color.primary.brand4}',
            background: '{color.primarycontainer.brand0}',
            padding: '{dimension.padding.supertight} {dimension.padding.tight}',
            borderRadius: '{dimension.borderradius.large}'
          }
        },
        rating: {
          metaType: 'text',
          variant: 'p',
          variantStyle: {
            margin: '0',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '{dimension.gap.tight}',
            fontSize: '{font.size.small}',
            fontWeight: '{font.fontweight.semibold}',
            color: '{color.onsurface.black88}'
          }
        },
        price: {
          metaType: 'text',
          variant: 'p',
          variantStyle: {
            margin: '0',
            fontSize: '{font.size.xl}',
            fontWeight: '{font.fontweight.bold}',
            color: '{color.basic.brand.7}'
          }
        },
        location: {
          metaType: 'text',
          variant: 'p',
          variantStyle: {
            margin: '0',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '{dimension.gap.tight}',
            fontSize: '{font.size.small}',
            color: '{color.onsurface.black64}'
          }
        },
        cta: {
          metaType: 'button',
          variant: 'primary',
          variantStyle: {
            minWidth: '140px',
            padding: '{dimension.padding.base} {dimension.padding.loose}',
            borderRadius: '{dimension.borderradius.large}',
            fontWeight: '{font.fontweight.bold}'
          },
          supportedAttributes: ['href', 'target']
        }
      },
      slots: {
        image: { required: false, optional: true, supportedAttributes: ['src', 'alt'] },
        title: { required: true, optional: false },
        subtitle: { required: false, optional: true },
        tags: { required: false, optional: true },
        rating: { required: false, optional: true },
        price: { required: false, optional: true },
        location: { required: false, optional: true },
        cta: { required: false, optional: true, supportedAttributes: ['href', 'target'] }
      }
    },

    // 🎯 操作与引导卡（Action / CTA Card）
    actionCard: {
      type: 'template',
      hasUpdateEvent: true,
      layoutModes: [
        {
          name: 'withIcon',
          condition: 'has:icon',
          style: {
            display: 'flex',
            flex: "1",
            flexDirection: 'column',
            gap: '{dimension.gap.base}',
            borderRadius: '{dimension.borderradius.xl}',
            padding: '{dimension.padding.loose}',
            background: '{color.surfacecontainer.white100}',
            boxShadow: '{material.hierarchy.1f}',
            border: '{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}'
          },
          structure: {
            groups: [
              {
                name: 'headerRow',
                type: 'template',
                style: {
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  gap: '{dimension.gap.base}'
                },
                groups: [
                  {
                    name: 'iconBlock',
                    slots: ['icon'],
                    type: 'template',
                    style: {
                      flexShrink: '0'
                    }
                  },
                  {
                    name: 'contentBlock',
                    type: 'template',
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '{dimension.gap.supertight}',
                      flex: '1'
                    },
                    groups: [
                      {
                        name: 'badgeRow',
                        condition: 'has:badge',
                        slots: ['badge'],
                        type: 'template',
                        style: {
                          display: 'flex',
                          flexDirection: 'row',
                          gap: '{dimension.gap.tight}',
                          flexWrap: 'wrap'
                        }
                      },
                      {
                        name: 'titleBlock',
                        slots: ['title']
                      },
                      {
                        name: 'descriptionBlock',
                        condition: 'has:description',
                        slots: ['description']
                      }
                    ]
                  }
                ]
              },
              {
                name: 'ctaRow',
                condition: 'has:cta_primary || has:cta_secondary',
                slots: ['cta_primary', 'cta_secondary'],
                type: 'template',
                style: {
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '{dimension.gap.tight}',
                  flexWrap: 'wrap',
                  marginTop: '{dimension.margin.tight}'
                }
              }
            ]
          }
        },
        {
          name: 'default',
          condition: 'default',
          style: {
            display: 'flex',
            flex: "1",
            flexDirection: 'column',
            gap: '{dimension.gap.base}',
            borderRadius: '{dimension.borderradius.xl}',
            padding: '{dimension.padding.loose}',
            background: '{color.surfacecontainer.white100}',
            boxShadow: '{material.hierarchy.1f}',
            border: '{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}'
          },
          structure: {
            groups: [
              {
                name: 'badgeRow',
                condition: 'has:badge',
                slots: ['badge'],
                type: 'template',
                style: {
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '{dimension.gap.tight}',
                  flexWrap: 'wrap'
                }
              },
              {
                name: 'titleBlock',
                slots: ['title']
              },
              {
                name: 'descriptionBlock',
                condition: 'has:description',
                slots: ['description']
              },
              {
                name: 'ctaRow',
                condition: 'has:cta_primary || has:cta_secondary',
                slots: ['cta_primary', 'cta_secondary'],
                type: 'template',
                style: {
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '{dimension.gap.tight}',
                  flexWrap: 'wrap',
                  marginTop: '{dimension.margin.tight}'
                }
              }
            ]
          }
        }
      ],
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '{dimension.gap.base}',
        borderRadius: '{dimension.borderradius.xl}',
        padding: '{dimension.padding.loose}',
        background: '{color.surfacecontainer.white100}',
        boxShadow: '{material.hierarchy.1f}',
        border: '{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}'
      },
      slotConfigs: {
        icon: {
          metaType: 'text',
          variant: 'p',
          variantStyle: {
            margin: '0',
            fontSize: '{font.size.xxxl}',
            lineHeight: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            borderRadius: '{dimension.borderradius.large}',
            background: '{color.surfacecontainer.black4}',
            flexShrink: '0'
          }
        },
        badge: {
          metaType: 'text',
          variant: 'p',
          variantStyle: {
            fontSize: '{font.size.tiny}',
            fontWeight: '{font.fontweight.semibold}',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '{dimension.padding.supertight} {dimension.padding.tight}',
            borderRadius: '{dimension.borderradius.large}',
            background: '{color.surfacecontainer.black4}',
            color: '{color.onsurface.black76}',
            margin: '0'
          }
        },
        title: {
          metaType: 'text',
          variant: 'h3',
          variantStyle: {
            margin: '0',
            fontSize: '{font.size.xl}',
            fontWeight: '{font.fontweight.bold}',
            color: '{color.onsurface.black88}',
            lineHeight: '1.3'
          }
        },
        description: {
          metaType: 'text',
          variant: 'p',
          variantStyle: {
            margin: '0',
            fontSize: '{font.size.medium}',
            color: '{color.onsurface.black64}',
            lineHeight: '1.6'
          }
        },
        cta_primary: {
          metaType: 'button',
          variant: 'primary',
          variantStyle: {
            minWidth: '140px',
            padding: '{dimension.padding.base} {dimension.padding.loose}',
            borderRadius: '{dimension.borderradius.large}',
            fontWeight: '{font.fontweight.bold}',
            boxShadow: '{material.hierarchy.1f}'
          }
        },
        cta_secondary: {
          metaType: 'button',
          variant: 'secondary',
          variantStyle: {
            minWidth: '140px',
            padding: '{dimension.padding.base} {dimension.padding.loose}',
            borderRadius: '{dimension.borderradius.large}',
            fontWeight: '{font.fontweight.semibold}'
          }
        }
      },
      slots: {
        icon: { required: false, optional: true },
        badge: { required: false, optional: true },
        title: { required: true, optional: false },
        description: { required: false, optional: true },
        cta_primary: { required: false, optional: true, supportedAttributes: ['href', 'target'] },
        cta_secondary: { required: false, optional: true, supportedAttributes: ['href', 'target'] }
      }
    },

    // 📅 事件/活动卡（Event / Announcement Card）
    eventCard: {
      type: 'template',
      hasUpdateEvent: true,
      layoutModes: [
        {
          name: 'withImage',
          condition: 'has:image',
          style: {
            display: 'flex',
            flex: "1",
            flexDirection: 'column',
            gap: '{dimension.gap.base}',
            borderRadius: '{dimension.borderradius.xl}',
            padding: '0',
            background: '{color.surfacecontainer.white100}',
            boxShadow: '{material.hierarchy.1f}',
            border: '{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}',
            overflow: 'hidden'
          },
          structure: {
            groups: [
              {
                name: 'imageBlock',
                slots: ['image'],
                type: 'template',
                style: {
                  width: '100%',
                  borderRadius: '{dimension.borderradius.xl} {dimension.borderradius.xl} 0 0',
                  overflow: 'hidden',
                  aspectRatio: '16 / 9',
                  background: '{color.surfacecontainer.black7}',
                  position: 'relative'
                }
              },
              {
                name: 'contentBlock',
                type: 'template',
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '{dimension.gap.base}',
                  padding: '{dimension.padding.loose}'
                },
                groups: [
                  {
                    name: 'tagRow',
                    condition: 'has:tag',
                    slots: ['tag'],
                    type: 'template',
                    style: {
                      display: 'flex',
                      flexDirection: 'row',
                      gap: '{dimension.gap.tight}',
                      flexWrap: 'wrap'
                    }
                  },
                  {
                    name: 'titleBlock',
                    slots: ['event_title']
                  },
                  {
                    name: 'timeBlock',
                    condition: 'has:event_time',
                    slots: ['event_time']
                  },
                  {
                    name: 'ctaRow',
                    condition: 'has:cta',
                    slots: ['cta'],
                    type: 'template',
                    style: {
                      display: 'flex',
                      marginTop: '{dimension.margin.tight}'
                    }
                  }
                ]
              }
            ]
          }
        },
        {
          name: 'default',
          condition: 'default',
          style: {
            display: 'flex',
            flex: "1",
            flexDirection: 'column',
            gap: '{dimension.gap.base}',
            borderRadius: '{dimension.borderradius.xl}',
            padding: '{dimension.padding.loose}',
            background: '{color.surfacecontainer.white100}',
            boxShadow: '{material.hierarchy.1f}',
            border: '{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}'
          },
          structure: {
            groups: [
              {
                name: 'tagRow',
                condition: 'has:tag',
                slots: ['tag'],
                type: 'template',
                style: {
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '{dimension.gap.tight}',
                  flexWrap: 'wrap'
                }
              },
              {
                name: 'titleBlock',
                slots: ['event_title']
              },
              {
                name: 'timeBlock',
                condition: 'has:event_time',
                slots: ['event_time']
              },
              {
                name: 'ctaRow',
                condition: 'has:cta',
                slots: ['cta'],
                type: 'template',
                style: {
                  display: 'flex',
                  marginTop: '{dimension.margin.tight}'
                }
              }
            ]
          }
        }
      ],
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '{dimension.gap.base}',
        borderRadius: '{dimension.borderradius.xl}',
        padding: '{dimension.padding.loose}',
        background: '{color.surfacecontainer.white100}',
        boxShadow: '{material.hierarchy.1f}',
        border: '{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}'
      },
      slotConfigs: {
        image: {
          metaType: 'image',
          variant: 'cover',
          variantStyle: {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            padding: '0',
            margin: '0'
          },
          supportedAttributes: ['src', 'alt']
        },
        tag: {
          metaType: 'text',
          variant: 'p',
          variantStyle: {
            fontSize: '{font.size.tiny}',
            fontWeight: '{font.fontweight.semibold}',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '{dimension.padding.supertight} {dimension.padding.tight}',
            borderRadius: '{dimension.borderradius.large}',
            background: '{color.primary.brand1}',
            color: '{color.primary.brand6}',
            margin: '0'
          }
        },
        event_title: {
          metaType: 'text',
          variant: 'h3',
          variantStyle: {
            margin: '0',
            fontSize: '{font.size.xl}',
            fontWeight: '{font.fontweight.bold}',
            color: '{color.onsurface.black88}',
            lineHeight: '1.3'
          }
        },
        event_time: {
          metaType: 'text',
          variant: 'p',
          variantStyle: {
            margin: '0',
            fontSize: '{font.size.medium}',
            color: '{color.onsurface.black64}',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '{dimension.gap.supertight}'
          }
        },
        cta: {
          metaType: 'button',
          variant: 'primary',
          variantStyle: {
            minWidth: '140px',
            padding: '{dimension.padding.base} {dimension.padding.loose}',
            borderRadius: '{dimension.borderradius.large}',
            fontWeight: '{font.fontweight.bold}'
          },
          supportedAttributes: ['href', 'target']
        }
      },
      slots: {
        image: { required: false, optional: true, supportedAttributes: ['src', 'alt'] },
        tag: { required: false, optional: true },
        event_title: { required: true, optional: false },
        event_time: { required: false, optional: true },
        cta: { required: false, optional: true, supportedAttributes: ['href', 'target'] }
      }
    },

    // 🔔 系统状态卡（System Status / Update Card）
    statusCard: {
      type: 'template',
      hasUpdateEvent: true,
      // 使用 progress 插槽内容作为参数，驱动进度条宽度
      parameters: {
        progressValue: {
          source: 'progress',              // 从 <progress>65%</progress> 中取值
          expression: 'replace(\"%\", \"\")' // 去掉百分号，只保留数字
        }
      },
      layoutModes: [
        {
          name: 'withProgress',
          condition: 'has:progress',
          style: {
            display: 'flex',
            flex: "1",
            flexDirection: 'column',
            gap: '{dimension.gap.base}',
            borderRadius: '{dimension.borderradius.xl}',
            padding: '{dimension.padding.loose}',
            background: '{color.surfacecontainer.white100}',
            boxShadow: '{material.hierarchy.1f}',
            border: '{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}'
          },
          structure: {
            groups: [
              {
                name: 'statusHeader',
                type: 'template',
                style: {
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'top',
                  gap: '{dimension.gap.base}',
                  flexWrap: 'wrap'
                },
                groups: [
                  {
                    name: 'statusMessage',
                    type: 'template',
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                    },
                    groups: [{
                      name: 'statusTypeBlock',
                      slots: ['status_type'],
                      type: 'template',
                      style: {
                        flexShrink: '0'
                      }
                    }, {
                      name: 'messageBlock',
                      slots: ['message'],
                      type: 'template',
                      style: {
                        flex: '1'
                      }
                    }]
                  },
                  {
                    name: 'timestampBlock',
                    condition: 'has:timestamp',
                    slots: ['timestamp']
                  }
                ]
              },
              {
                name: 'progressBlock',
                slots: ['progress'],
                type: 'template',
                style: {
                  marginTop: '{dimension.margin.tight}'
                }
              },
              {
                name: 'footerRow',
                type: 'template',
                style: {
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '{dimension.gap.base}',
                  flexWrap: 'wrap',
                  marginTop: '{dimension.margin.tight}'
                },
                groups: [
                  {
                    name: 'ctaBlock',
                    condition: 'has:cta',
                    slots: ['cta']
                  }
                ]
              }
            ]
          }
        },
        {
          name: 'default',
          condition: 'default',
          style: {
            display: 'flex',
            flex: "1",
            flexDirection: 'column',
            gap: '{dimension.gap.base}',
            borderRadius: '{dimension.borderradius.xl}',
            padding: '{dimension.padding.loose}',
            background: '{color.surfacecontainer.white100}',
            boxShadow: '{material.hierarchy.1f}',
            border: '{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}'
          },
          structure: {
            groups: [
              {
                name: 'statusHeader',
                type: 'template',
                style: {
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'top',
                  gap: '{dimension.gap.base}',
                  flexWrap: 'wrap'
                },
                groups: [
                  {
                    name: 'statusMessage',
                    type: 'template',
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                    },
                    groups: [{
                      name: 'statusTypeBlock',
                      slots: ['status_type'],
                      type: 'template',
                      style: {
                        flexShrink: '0'
                      }
                    }, {
                      name: 'messageBlock',
                      slots: ['message'],
                      type: 'template',
                      style: {
                        flex: '1'
                      }
                    }]
                  },
                  {
                    name: 'timestampBlock',
                    condition: 'has:timestamp',
                    slots: ['timestamp']
                  }
                ]
              },
              {
                name: 'progressBlock',
                slots: ['progress'],
                type: 'template',
                style: {
                  marginTop: '{dimension.margin.tight}'
                }
              },
              {
                name: 'footerRow',
                type: 'template',
                style: {
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '{dimension.gap.base}',
                  flexWrap: 'wrap',
                  marginTop: '{dimension.margin.tight}'
                },
                groups: [
                  {
                    name: 'ctaBlock',
                    condition: 'has:cta',
                    slots: ['cta']
                  }
                ]
              }
            ]
          }
        }
      ],
      style: {
        '--status-progress': '$progressValue',
        display: 'flex',
        flexDirection: 'column',
        gap: '{dimension.gap.base}',
        borderRadius: '{dimension.borderradius.xl}',
        padding: '{dimension.padding.loose}',
        background: '{color.surfacecontainer.white100}',
        boxShadow: '{material.hierarchy.1f}',
        border: '{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}'
      },
      slotConfigs: {
        status_type: {
          metaType: 'text',
          variant: 'p',
          variantStyle: {
            margin: '0',
            fontSize: '{font.size.small}',
            fontWeight: '{font.fontweight.bold}',
            // 默认样式（成功）
            color: '{color.basic.brand.6}'
          }
        },
        message: {
          metaType: 'text',
          variant: 'p',
          variantStyle: {
            margin: '0',
            fontSize: '{font.size.medium}',
            color: '{color.onsurface.black88}',
            lineHeight: '1.5'
          }
        },
        progress: {
          type: 'template',
          style: {
            width: '100%',
            height: '8px',
            background: '{color.surfacecontainer.black7}',
            borderRadius: '{dimension.borderradius.large}',
            overflow: 'hidden',
            position: 'relative'
          },
          metaType: 'text',
          variant: 'p',
          variantStyle: {
            margin: '0',
            fontSize: '{font.size.tiny}',
            color: '{color.onsurface.black64}',
            // 进度条填充部分，通过 CSS 变量控制宽度
            display: 'block',
            height: '100%',
            background: 'linear-gradient({dimension.basic.deg.135}, {color.basic.violet.5} {dimension.basic.percent.0}, {color.basic.blue.5} {dimension.basic.percent.100})',
            borderRadius: 'inherit',
            transition: 'width 0.3s ease',
            // 使用 statusCard 根上的 --status-progress（0-100），映射到宽度百分比
            width: 'calc(var(--status-progress, 0) * 1%)'
          }
        },
        timestamp: {
          metaType: 'text',
          variant: 'p',
          variantStyle: {
            margin: '0',
            fontSize: '{font.size.tiny}',
            color: '{color.onsurface.black48}',
            letterSpacing: '0.04em'
          }
        },
        cta: {
          metaType: 'button',
          variant: 'secondary',
          variantStyle: {
            minWidth: '100px',
            padding: '{dimension.padding.supertight} {dimension.padding.base}',
            borderRadius: '{dimension.borderradius.large}',
            fontSize: '{font.size.small}',
            fontWeight: '{font.fontweight.semibold}'
          },
          supportedAttributes: ['href', 'target']
        }
      },
      slots: {
        status_type: { required: true, optional: false },
        message: { required: true, optional: false },
        progress: { required: false, optional: true },
        timestamp: { required: false, optional: true },
        cta: { required: false, optional: true, supportedAttributes: ['href', 'target'] }
      }
    },

    // 📊 表格卡片（Table Card）
    tableCard: {
      type: 'template',
      hasUpdateEvent: true,
      layoutModes: [
        {
          name: 'full',
          condition: 'has:title || has:subtitle || has:description || has:icon || has:badge',
          style: {
            display: 'flex',
            width: '100%',
            flex: "1",
            flexDirection: 'column',
            gap: '{dimension.gap.base}',
            borderRadius: '{dimension.borderradius.xl}',
            padding: '{dimension.padding.loose}',
            background: '{color.surfacecontainer.white100}',
            boxShadow: '{material.hierarchy.1f}',
            border: '{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}'
          },
          structure: {
            groups: [
              {
                name: 'headerSection',
                condition: 'has:title || has:subtitle || has:icon || has:badge',
                type: 'template',
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '{dimension.gap.tight}',
                  marginBottom: '{dimension.margin.base}'
                },
                groups: [
                  {
                    name: 'headerRow',
                    type: 'template',
                    style: {
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      gap: '{dimension.gap.base}',
                      flexWrap: 'wrap'
                    },
                    groups: [
                      {
                        name: 'iconBlock',
                        condition: 'has:icon',
                        slots: ['icon'],
                        type: 'template',
                        style: {
                          flexShrink: '0'
                        }
                      },
                      {
                        name: 'titleBlock',
                        type: 'template',
                        style: {
                          flex: '1',
                          minWidth: '0'
                        },
                        groups: [
                          {
                            name: 'badgeRow',
                            condition: 'has:badge',
                            slots: ['badge'],
                            type: 'template',
                            style: {
                              marginBottom: '{dimension.margin.supertight}'
                            }
                          },
                          {
                            name: 'titleRow',
                            condition: 'has:title',
                            slots: ['title'],
                            type: 'template'
                          },
                          {
                            name: 'subtitleRow',
                            condition: 'has:subtitle',
                            slots: ['subtitle'],
                            type: 'template'
                          }
                        ]
                      }
                    ]
                  },
                  {
                    name: 'descriptionBlock',
                    condition: 'has:description',
                    slots: ['description'],
                    type: 'template',
                    style: {
                      marginTop: '{dimension.margin.supertight}'
                    }
                  }
                ]
              },
              {
                name: 'tableBlock',
                slots: ['table'],
                type: 'template',
                style: {
                  width: '100%',
                  overflowX: 'auto',
                  marginTop: '{dimension.margin.tight}'
                }
              },
              {
                name: 'footerSection',
                condition: 'has:footer',
                slots: ['footer'],
                type: 'template',
                style: {
                  marginTop: '{dimension.margin.base}',
                  paddingTop: '{dimension.padding.base}',
                  borderTop: '1px solid {color.surfacecontainer.black8}'
                }
              }
            ]
          }
        },
        {
          name: 'default',
          condition: 'default',
          style: {
            display: 'flex',
            width: '100%',
            flex: "1",
            flexDirection: 'column',
            gap: '{dimension.gap.base}',
            borderRadius: '{dimension.borderradius.xl}',
            padding: '{dimension.padding.loose}',
            background: '{color.surfacecontainer.white100}',
            boxShadow: '{material.hierarchy.1f}',
            border: '{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}'
          },
          structure: {
            groups: [
              {
                name: 'tableBlock',
                slots: ['table'],
                type: 'template',
                style: {
                  width: '100%',
                  overflowX: 'auto'
                }
              }
            ]
          }
        }
      ],
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '{dimension.gap.base}',
        borderRadius: '{dimension.borderradius.xl}',
        padding: '{dimension.padding.loose}',
        background: '{color.surfacecontainer.white100}',
        boxShadow: '{material.hierarchy.1f}',
        border: '{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}'
      },
      slotConfigs: {
        icon: {
          metaType: 'text',
          variant: 'p',
          variantStyle: {
            margin: '0',
            fontSize: '{font.size.xxl}',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: '{dimension.borderradius.large}',
            background: '{color.primary.brand1}',
            color: '{color.primary.brand6}',
            flexShrink: '0'
          }
        },
        badge: {
          metaType: 'text',
          variant: 'p',
          variantStyle: {
            margin: '0',
            fontSize: '{font.size.tiny}',
            fontWeight: '{font.fontweight.semibold}',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '{dimension.padding.supertight} {dimension.padding.tight}',
            borderRadius: '{dimension.borderradius.large}',
            background: '{color.primary.brand1}',
            color: '{color.primary.brand6}',
            display: 'inline-block'
          }
        },
        title: {
          metaType: 'text',
          variant: 'h4',
          variantStyle: {
            margin: '0',
            fontSize: '{font.size.large}',
            fontWeight: '{font.fontweight.semibold}',
            color: '{color.onsurface.black88}',
            lineHeight: '1.3'
          }
        },
        subtitle: {
          metaType: 'text',
          variant: 'p',
          variantStyle: {
            margin: '0',
            fontSize: '{font.size.medium}',
            color: '{color.onsurface.black64}',
            lineHeight: '1.5',
            marginTop: '{dimension.margin.supertight}'
          }
        },
        description: {
          metaType: 'text',
          variant: 'p',
          variantStyle: {
            margin: '0',
            fontSize: '{font.size.small}',
            color: '{color.onsurface.black64}',
            lineHeight: '1.6'
          }
        },
        table: {
          type: 'template',
          metaType: 'table',
          variant: 'container',
          style: {
            width: '100%',
            margin: '0'
          }
        },
        footer: {
          metaType: 'text',
          variant: 'p',
          variantStyle: {
            margin: '0',
            fontSize: '{font.size.small}',
            color: '{color.onsurface.black48}',
            lineHeight: '1.5'
          }
        }
      },
      slots: {
        icon: { required: false, optional: true },
        badge: { required: false, optional: true },
        title: { required: false, optional: true },
        subtitle: { required: false, optional: true },
        description: { required: false, optional: true },
        table: { required: true, optional: false },
        footer: { required: false, optional: true }
      }
    },

    // 🗞️ 信息列表卡（Feed / List）
    feedListCard: {
      type: 'template',
      hasUpdateEvent: true,
      layoutModes: [
        {
          name: 'default',
          condition: 'default',
          style: {
            display: 'flex',
            flex: "1",
            width: '100%',
            flexDirection: 'column',
            gap: '{dimension.gap.base}',
            padding: '{dimension.padding.loose}',
            borderRadius: '{dimension.borderradius.xl}',
            background: '{color.surfacecontainer.white100}',
            boxShadow: '{material.hierarchy.1f}',
            border: '{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}'
          },
          structure: {
            groups: [
              {
                name: 'header',
                condition: 'has:title || has:subtitle',
                slots: ['title', 'subtitle'],
                type: 'template',
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '{dimension.gap.supertight}'
                }
              },
              {
                name: 'listGroup',
                condition: 'has:items',
                slots: ['items*'],
                type: 'template',
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '{dimension.gap.tight}'
                }
              }
            ]
          }
        }
      ],
      style: {
        display: 'flex',
        flex: "1",
        width: '100%',
        flexDirection: 'column',
        gap: '{dimension.gap.base}',
        padding: '{dimension.padding.loose}',
        borderRadius: '{dimension.borderradius.xl}',
        background: '{color.surfacecontainer.white100}',
        boxShadow: '{material.hierarchy.1f}',
        border: '{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}'
      },
      slotConfigs: {
        title: {
          metaType: 'text',
          variant: 'h4',
          variantStyle: {
            margin: '0',
            color: '{color.onsurface.black88}'
          }
        },
        subtitle: {
          metaType: 'text',
          variant: 'p',
          variantStyle: {
            margin: '0',
            color: '{color.onsurface.black64}',
            fontSize: '{font.size.small}'
          }
        },
        items: {
          type: 'template',
          metaType: 'feedItem',
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '{dimension.gap.tight}',
            padding: '{dimension.padding.tight} 0',
            borderBottom: '1px solid {color.surfacecontainer.black7}'
          },
          itemStyles: {
            row: {
              display: 'flex',
              flexDirection: 'row',
              gap: '{dimension.gap.base}',
              alignItems: 'flex-start'
            },
            leading: {
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '{dimension.gap.supertight}'
            },
            avatar: {
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              overflow: 'hidden',
              background: '{color.surfacecontainer.black4}',
              flexShrink: '0'
            },
            content: {
              display: 'flex',
              flexDirection: 'column',
              gap: '{dimension.gap.supertight}',
              flex: '1'
            },
            textRow: {
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: '{dimension.gap.supertight}'
            },
            icon: {
              margin: '0',
              fontSize: '{font.size.medium}',
              color: '{color.primary.brand5}'
            },
            text: {
              margin: '0',
              fontSize: '{font.size.medium}',
              color: '{color.onsurface.black88}',
              lineHeight: '1.5'
            },
            timestamp: {
              margin: '0',
              fontSize: '{font.size.tiny}',
              color: '{color.onsurface.black64}',
              letterSpacing: '0.08em',
              textTransform: 'uppercase'
            },
            meta: {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '{dimension.gap.supertight}',
              marginLeft: '{dimension.margin.tight}'
            },
            ctaVariant: 'link'
          },
          subSlots: {
            avatar: {
              metaType: 'image',
              variant: 'avatar',
              variantStyle: {
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                objectFit: 'cover'
              }
            },
            icon: {
              metaType: 'text',
              variant: 'p',
              variantStyle: {
                margin: '0',
                fontSize: '{font.size.medium}',
                color: '{color.primary.brand5}'
              }
            },
            text: {
              metaType: 'text',
              variant: 'p',
              variantStyle: {
                margin: '0',
                fontSize: '{font.size.medium}',
                color: '{color.onsurface.black88}',
                lineHeight: '1.5'
              }
            },
            timestamp: {
              metaType: 'text',
              variant: 'p',
              variantStyle: {
                margin: '0',
                fontSize: '{font.size.tiny}',
                color: '{color.onsurface.black64}',
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }
            },
            cta_inline: {
              metaType: 'button',
              variant: 'link',
              variantStyle: {
                fontSize: '{font.size.small}',
                fontWeight: '{font.fontweight.semibold}',
                textDecoration: 'none'
              }
            }
          },
          itemLayout: [
            {
              name: 'leading',
              condition: 'has:avatar',
              style: {
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '{dimension.gap.supertight}',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                overflow: 'hidden',
                background: '{color.surfacecontainer.black4}',
                flexShrink: '0'
              },
              slots: ['avatar']
            },
            {
              name: 'content',
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '{dimension.gap.supertight}',
                flex: '1'
              },
              slotGroups: [
                {
                  name: 'textRow',
                  style: {
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    gap: '{dimension.gap.supertight}'
                  },
                  slots: ['icon', 'text']
                }
              ]
            },
            {
              name: 'meta',
              condition: 'has:timestamp || has:cta_inline',
              style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '{dimension.gap.supertight}',
                marginLeft: '{dimension.margin.tight}'
              },
              slots: ['timestamp', 'cta_inline']
            }
          ]
        }
      },
      slots: {
        title: { required: false, optional: true },
        subtitle: { required: false, optional: true },
        items: {
          required: true,
          optional: false,
          supportedAttributes: ['avatar', 'icon', 'timestamp', 'cta_label', 'cta_href', 'cta_variant']
        }
      }
    },

    // commentListCard 数据绑定示例
    commentListCard: {
      type: 'template',
      layoutModes: [{
        name: 'default',
        condition: 'default',
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          padding: '16px',
          backgroundColor: '{color.surface.default}',
          borderRadius: '{dimension.borderradius.medium}',
          boxShadow: '{shadow.elevation.low}'
        },
        structure: {
          groups: [
            {
              name: 'itemContent',
              type: 'template',
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                width: '100%'
              },
              slots: ['title', 'desc']
            }
          ]
        }
      }],
      slots: {
        title: {
          metaType: 'text',
          variant: 'h3',
          variantStyle: {
            fontSize: '16px',
            fontWeight: 'bold',
            color: '{color.onsurface.black88}'
          }
        },
        desc: {
          metaType: 'text',
          variant: 'body',
          variantStyle: {
            fontSize: '14px',
            color: '{color.onsurface.black64}'
          }
        }
      },
      example: [{
          title: '用户评论1',
          desc: '这是一条用户评论，展示了用户对产品的评价和反馈。'
         }, {
          title: '用户评论2',
          desc: '这是另一条用户评论，展示了用户对产品的评价和反馈。'
         }]
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

          // 🆕 解析token值 - 如果不包含大括号，自动添加（但排除URL等特殊值）
          let resolvedValue = attrValue;

          // 检查是否是特殊值（URL, 普通CSS值等），这些不需要token解析
          const isSpecialValue = attrValue.startsWith('url(') ||
            attrValue.startsWith('#') ||
            attrValue.match(/^\d+px$/) ||
            attrValue.match(/^\d+%$/) ||
            attrValue === 'none' ||
            attrValue === 'auto';

          if (!isSpecialValue && !attrValue.startsWith('{') && !attrValue.endsWith('}')) {
            // 如果看起来像token路径（包含点），自动添加大括号
            if (attrValue.includes('.')) {
              const tokenToResolve = `{${attrValue}}`;
              resolvedValue = tokenToResolve
            }
          }
          finalStyle[attrName] = resolvedValue;
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