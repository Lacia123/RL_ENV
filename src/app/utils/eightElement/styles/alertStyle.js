const ALERT_STYLE = {
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
}


export default ALERT_STYLE