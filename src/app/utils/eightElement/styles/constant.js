// CSS变量系统，目前只保留动画
export const CSS_VARIABLE_SYSTEM = {
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


// 网格单位常量（i=列单元基准宽, j=行单元基准高, GAP=格间距）
// 模型：i/j 固定写死；渲染时网格按容器自动推导 m×n（m=⌊(W+GAP)/(i+GAP)⌋，n 同理），
// 容器不是 i/j 整数倍时，余数由 CSS auto-fill + minmax 摊平到格子上（格子 = i+δ，δ 很小，展示稳定）。
// i=228 是旧 456 的一半，横向粒度翻倍：同格距体系下 2 新列 = 2×228+16 = 472px ≈ 旧 1 列 456px（+16 为内部格距），
// 卡片跨格数按 ×2 换算后观感基本不变；整页 8 列 = 8×228+7×16 = 1936px ≈ 旧 4 列 1872px（+64 为新增内部格距）。
// j=216 不变：680px 内容块恰好 3 行。
export const GRID_CONSTANTS = {
    CELL_WIDTH: 228,   // i：列单元基准宽（px）
    CELL_HEIGHT: 216,  // j：行单元基准高（px）
    GAP: 16,           // 网格间距（px）
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
                64: "{color.basic.opacity.black.64}",
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