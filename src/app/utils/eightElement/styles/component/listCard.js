const LIST_CARD_STYLE = {
    listCard: {
        type: 'template',
        parameters: {
            color: {
                source: 'outer',
                default: '{color.basic.grey.5}',
            },
            background: {
                source: 'outer',
                default: '{color.basic.grey.0}',
            },
        },
        layoutModes: [
            {
                name: 'default',
                condition: 'default',
                style: {
                    display: 'flex',
                    width: '100%',
                    padding: '40px',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '{dimension.gap.loose}',
                    borderRadius: '32px',
                    border: '1.2px solid rgba(255, 255, 255, 0.64)',
                    backdropFilter: 'blur(7px)',
                    background: '$background',
                },
                structure: {
                    groups: [
                        {
                            name: 'titleBlock',
                            condition: 'has:title',
                            slots: ['title'],
                        },
                        {
                            name: 'orderedListBlock',
                            condition: 'has:orderedListItem',
                            slots: ['orderedListItem*'],
                        },
                        {
                            name: 'unorderedListBlock',
                            condition: 'has:unorderedListItem',
                            slots: ['unorderedListItem*'],
                        },
                    ],
                },
            },
        ],
        style: {
            display: 'flex',
            width: '100%',
            padding: '40px',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '{dimension.gap.loose}',
            borderRadius: '32px',
            border: '1.2px solid rgba(255, 255, 255, 0.64)',
            backdropFilter: 'blur(7px)',
            background: '$background',
        },
        slotConfigs: {
            title: {
                metaType: 'text',
                variant: 'h3',
                variantStyle: {
                    leadingTrim: 'both',
                    textEdge: 'cap',
                    fontFamily: 'Roboto',
                    fontSize: '32px',
                    fontStyle: 'normal',
                    fontWeight: '{font.fontweight.bold}',
                    lineHeight: '150%',
                    color: '{color.basic.brand.8}',
                    margin: '0',
                },
            },
            orderedListItem: {
                metaType: 'text',
                variant: 'p',
                // 允许通过标签前空格缩进 / level 属性标识子项
                indentFromWhitespace: true,
                // 🆕 纯文本渲染：避免 marked 把 "1. xxx" 内容误转成 <ol>（<ol> 自带上下 margin 与外层间距重复）
                rawContent: true,
                variantStyle: {
                    display: 'flex',
                    padding: '{dimension.padding.semitight} 0',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '16px',
                    alignSelf: 'stretch',
                    fontSize: '{font.size.xl}',
                    fontStyle: 'normal',
                    fontWeight: '400',
                    lineHeight: '1.6',
                    color: '$color',
                    // 🆕 覆盖文本元素默认 margin: 0 0 12px 0，避免与外层 gap 间距重复
                    margin: '0',
                },
            },
            unorderedListItem: {
                metaType: 'text',
                variant: 'p',
                indentFromWhitespace: true,
                // 🆕 无序列表项目符号 — 16x16 圆点，按出现顺序依次循环 4 种颜色
                // blue-3 / violet-4 / amber-5 / teal-4
                bulletCycling: true,
                variantStyle: {
                    display: 'flex',
                    padding: '{dimension.padding.semitight} 0',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '16px',
                    alignSelf: 'stretch',
                    fontSize: '{font.size.xl}',
                    fontStyle: 'normal',
                    fontWeight: '400',
                    lineHeight: '1.6',
                    color: '$color',
                    // 🆕 左侧为圆点项目符号，文字右移：16px（圆点宽度）+ 16px（间距）
                    paddingLeft: '32px',
                    position: 'relative',
                    // 🆕 覆盖文本元素默认 margin: 0 0 12px 0，避免与外层 gap 间距重复
                    margin: '0',
                    '&::before': {
                        content: '""',
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        backgroundColor: '{color.basic.blue.3}',
                        position: 'absolute',
                        top: '21px',
                        left: '0px',
                    },
                },
            },
        },
        slots: {
            title: { required: false, optional: true, supportedAttributes: ['color'] },
            orderedListItem: { required: false, optional: true, supportedAttributes: ['color', 'level'] },
            unorderedListItem: { required: false, optional: true, supportedAttributes: ['color', 'level'] },
        },
    },
}

export default LIST_CARD_STYLE