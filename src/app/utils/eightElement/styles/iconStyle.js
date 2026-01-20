import { CSS_VARIABLE_SYSTEM } from './constant';

const ICON_STYLE = {
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
}


export default ICON_STYLE