const MISTAKES_CARD_STYLE = {
    mistakesCard: {
        type: 'template',
        description: '易错点卡片。支持两种布局：1) 含 title 时外层容器带 padding/圆角/背景（同 showcaseCard），title 样式与 showcaseCard 一致；2) 不含 title 时无外层样式，仅渲染 mistakesCardItem 列表。mistakesCardItem 为 feedItem，三个子标签：title（顶部）、text（左）、caption（右，带外边框）。mistakesCardItem 通过 type 属性区分 normal/warning/error，字体颜色随类型变化（颜色逻辑见 subSlots.colorByType）。',
        layoutModes: [
            {
                name: 'withTitle',
                condition: 'has:title',
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '{dimension.gap.extraloose}',
                    padding: '{dimension.padding.extraloose}',
                    width: '100%',
                    boxSizing: 'border-box',
                    borderRadius: '{dimension.borderradius.xxxl}',
                    background: '{color.basic.opacity.white.48}',
                },
                structure: {
                    groups: [
                        {
                            name: 'titleRow',
                            type: 'template',
                            style: {
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '12px',
                                width: '100%',
                            },
                            groups: [
                                {
                                    name: 'titleGroup',
                                    type: 'template',
                                    style: {
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'baseline',
                                        gap: '8px',
                                        flex: '1',
                                        minWidth: '0',
                                    },
                                    slots: ['title'],
                                },
                            ],
                        },
                        {
                            name: 'listBlock',
                            type: 'template',
                            condition: 'has:mistakesCardItem',
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '{dimension.gap.extraloose}',
                                width: '100%',
                                // 🆕 grid 适配：列表区占满剩余高度，项由 flex 平分空间（随格子高度伸缩）
                                flex: '1',
                                minHeight: '0',
                            },
                            slots: ['mistakesCardItem*'],
                        },
                    ],
                },
            },
            {
                name: 'noTitle',
                condition: 'default',
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    boxSizing: 'border-box',
                    // 🆕 grid 适配：无标题模式同样占满格子高度
                    flex: '1',
                    minHeight: '0',
                },
                structure: {
                    groups: [
                        {
                            name: 'listBlock',
                            type: 'template',
                            condition: 'has:mistakesCardItem',
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                width: '100%',
                                // 🆕 grid 适配：列表区占满剩余高度，项由 flex 平分空间
                                flex: '1',
                                minHeight: '0',
                            },
                            slots: ['mistakesCardItem*'],
                        },
                    ],
                },
            },
        ],
        slots: {
            title: {
                metaType: 'text',
                supportedAttributes: ['href', 'target'],
                variant: 'showcaseCardTitle',
                variantStyle: {
                    margin: '0',
                    fontSize: '{font.size.xxl}',
                    fontWeight: '{font.fontweight.bold}',
                    color: '{color.basic.grey.9}',
                    lineHeight: 1.4,
                    whiteSpace: 'normal',
                    overflowWrap: 'break-word',
                },
            },
            mistakesCardItem: createMistakesCardItemSlotConfig(),
        },
    },
};

/**
 * mistakesCardItem：上下布局——顶部 title，下方左 text + 右 caption（带外边框）。
 * type 属性取值 normal/warning/error：
 *   - normal：背景 grey-0
 *   - warning：背景 orange-0 + backdrop-filter blur(7px)
 *   - error：背景 pink-0
 * 容器 border 1.2px solid rgba(255,255,255,0.64)、圆角 32px 保持一致。
 * 三个子标签字体颜色随 type 切换（见各 subSlot.colorByType）。
 * 注：feedItem 的 subSlots 作用域仅限 <mistakesCardItem> 内部，与 mistakesCard 顶层 title 插槽不冲突。
 */
function createMistakesCardItemSlotConfig() {
    return {
        type: 'template',
        metaType: 'feedItem',
        supportedAttributes: ['type'],
        style: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            // 🆕 grid 适配：列表项平分列表区高度，格子余数摊平后空间自动分布
            flex: '1',
            minHeight: '0',
        },
        itemStyles: {
            row: {
                display: 'flex',
                flexDirection: 'column',
                gap: '{dimension.gap.loose}',
                padding: '{dimension.padding.base}',
                width: '100%',
                boxSizing: 'border-box',
                borderStyle: 'solid',
                borderWidth: '1.2px',
                borderColor: 'rgba(255, 255, 255, 0.64)',
                borderRadius: '32px',
            },
        },
        // 🆕 按类型覆盖容器背景（warning 额外带毛玻璃）
        itemStylesByType: {
            normal: {
                background: '{color.basic.grey.0}',
            },
            warning: {
                background: '{color.basic.orange.0}',
                backdropFilter: 'blur(7px)',
            },
            error: {
                background: '{color.basic.pink.0}',
            },
        },
        subSlots: {
            title: {
                metaType: 'text',
                variant: 'p',
                description: '易错点标题，位于顶部。',
                variantStyle: {
                    margin: '0',
                    fontSize: '{font.size.xxl}',
                    fontWeight: '600',
                    color: '{color.basic.grey.7}',
                    lineHeight: '1.35',
                    whiteSpace: 'normal',
                    overflowWrap: 'break-word',
                },
                colorByType: {
                    normal: '{color.basic.grey.7}',
                    warning: '{color.basic.orange.7}',
                    error: '{color.basic.pink.7}',
                },
            },
            text: {
                metaType: 'text',
                variant: 'p',
                description: '易错点描述，位于左侧。',
                variantStyle: {
                    margin: '0',
                    fontSize: '{font.size.xl}',
                    color: '{color.basic.grey.5}',
                    lineHeight: 1.5,
                    whiteSpace: 'normal',
                    overflowWrap: 'break-word',
                },
                colorByType: {
                    normal: '{color.basic.grey.5}',
                    warning: '{color.basic.orange.5}',
                    error: '{color.basic.pink.5}',
                },
            },
            caption: {
                metaType: 'text',
                variant: 'p',
                description: '易错点占比，位于右侧，带外边框。',
                variantStyle: {
                    margin: '0',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: '0',
                    paddingTop: '{dimension.padding.base}',
                    paddingBottom: '{dimension.padding.base}',
                    paddingLeft: '{dimension.padding.semiloose}',
                    paddingRight: '{dimension.padding.semiloose}',
                    fontSize: '{font.size.xl}',
                    fontWeight: '{font.fontweight.semibold}',
                    color: '{color.basic.grey.7}',
                    borderRadius: '{dimension.borderradius.medium}',
                    boxShadow: '{material.hierarchy.main}',
                    whiteSpace: 'normal',
                    overflowWrap: 'break-word',
                    boxSizing: 'border-box',
                },
                colorByType: {
                    normal: '{color.basic.grey.7}',
                    warning: '{color.basic.orange.7}',
                    error: '{color.basic.pink.7}',
                },
            },
        },
        itemLayout: [
            {
                name: 'titleBlock',
                slots: ['title'],
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    boxSizing: 'border-box',
                },
            },
            {
                name: 'amountRow',
                slotGroups: [
                    {
                        name: 'row',
                        style: {
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '{dimension.padding.semitight}',
                            width: '100%',
                            boxSizing: 'border-box',
                        },
                        slots: ['text', 'caption'],
                    },
                ],
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    boxSizing: 'border-box',
                },
            },
        ],
    };
}

export default MISTAKES_CARD_STYLE