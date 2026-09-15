const TEXT_BUTTON_STYLE = {
    textButton: {
        metaType: 'button',
        // 默认回退到 primary 按钮变体（解析 button:primary 样式）
        variant: 'primary',

        // 按 type 区分的样式：默认(primary) / dark / light
        types: {
            primary: {
                background: 'linear-gradient(272deg, rgba(120, 208, 254, 0.80) -5.46%, rgba(189, 125, 255, 0.80) 47.74%, rgba(113, 59, 239, 0.80) 96.57%)',
                color: '#FFF',
                fontWeight: '{font.fontweight.bold}',
            },
            dark: {
                background: '#333',
                color: '#FFF',
                fontWeight: '400',
            },
            light: {
                border: '1px solid {color.basic.opacity.black.12}',
                background: '#FFF',
                color: '{color.basic.opacity.black.76}',
                fontWeight: '{font.fontweight.bold}',
            },
        },

        // 三类按钮的公共样式（直接作用在按钮元素上，不生成额外容器）
        baseStyle: {
            display: 'flex',
            width: 'fit-content',
            height: '88px',
            padding: '20px 60px',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            borderRadius: '60px',
            fontSize: '32px',
            fontStyle: 'normal',
            lineHeight: 'normal',
            cursor: 'pointer',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
        },
    },
}

export default TEXT_BUTTON_STYLE