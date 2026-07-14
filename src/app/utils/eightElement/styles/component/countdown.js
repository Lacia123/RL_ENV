const COUNTDOWN_STYLE = {
    // 倒计时组件
    countdown: {
        parameters: {
            target: {
                source: 'outer',
                default: ''
            },
            format: {
                source: 'outer',
                default: ''
            }
        },
        style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '{dimension.padding.base}',
            fontFamily: 'monospace',
            fontSize: '{font.size.2xl}',
            color: '{color.onSurface}',
        },
        metaType: 'countdown',
    }
};

export default COUNTDOWN_STYLE;
