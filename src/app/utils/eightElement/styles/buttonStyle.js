import { CSS_VARIABLE_SYSTEM } from './constant';

const BUTTON_STYLE = {
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
}

export default BUTTON_STYLE