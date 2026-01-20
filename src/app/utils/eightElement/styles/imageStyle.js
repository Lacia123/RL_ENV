import { CSS_VARIABLE_SYSTEM } from './constant';

const IMAGE_STYLE = {
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
}

export default IMAGE_STYLE