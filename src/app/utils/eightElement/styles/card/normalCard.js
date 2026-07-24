import { CSS_VARIABLE_SYSTEM } from '../constant';

const NORMAL_CARD_STYLE = {
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
            supportedAttributes: ['href', 'target'],
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
}

export default NORMAL_CARD_STYLE