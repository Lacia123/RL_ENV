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

    // 纯展示 label（无箭头）
    // <label>text</label>
    label: {
        parameters: {
            labelBgColor: {
                source: 'outer',
                default: '{color.basic.red.9}'
            }
        },
        style: {
            '--bg-color': '$labelBgColor',
            display: 'inline-flex',
            alignItems: 'center',
            width: 'fit-content',
            padding: "2px 8px",
            borderRadius: "{dimension.borderradius.full}",
            background: "var(--bg-color)",
        },
        metaType: 'text',
        variant: 'precentItemLabel',
    },

    // 可点击 label（带右箭头）
    // <label nativeEvent="click">text</label>
    labelLink: {
        parameters: {
            labelBgColor: {
                source: 'outer',
                default: '{color.basic.red.9}'
            }
        },
        style: {
            '--bg-color': '$labelBgColor',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '{dimension.gap.supertight}',
            padding: "2px 4px 2px 8px",
            borderRadius: "{dimension.borderradius.full}",
            background: "var(--bg-color)",
            cursor: 'pointer',
            userSelect: 'none',
            width: 'fit-content',
            '&::after': {
                content: '""',
                width: '16px',
                height: '16px',
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10.9764 10.0006L6.85156 5.87577L8.03008 4.69727L13.3334 10.0006L8.03008 15.3038L6.85156 14.1253L10.9764 10.0006Z' fill='white' fill-opacity='0.72'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: 'contain',
                flexShrink: '0',
            }
        },
        metaType: 'text',
        variant: 'precentItemLabel',
    },
}

export default LABEL_TITLE_STYLE