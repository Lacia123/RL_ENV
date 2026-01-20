const LABEL_TITLE_STYLE = {
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
}

export default LABEL_TITLE_STYLE