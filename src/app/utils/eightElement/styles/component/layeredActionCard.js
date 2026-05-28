const LAYERED_ACTION_CARD_STYLE = {
    // layeredActionCard 数据绑定示例
    layeredActionCard: {
        type: 'template',
        description: '层叠式行动卡片。用于紫色主视觉背景上叠加浅色信息面板，并提供一个或两个操作入口的场景，例如订阅通讯、开启助手、加入计划或领取权益。左上角可以是图标 icon，也可以是小标签 badge；标题可以是一行 title，也可以用 title + titleAccent 表达两行且颜色不同的标题。',
        usage: {
            guidance: '当卡片需要强调一个行动入口，并带有层叠浅色说明区域时使用 layeredActionCard。icon 和 badge 只选其一；标题单行时只使用 title，标题需要两行且第二行强调时使用 title + titleAccent。按钮只有一个时只用 primaryAction；按钮有两个时使用 primaryAction + secondaryAction。按钮视觉上呈现为按钮，但底层是普通文本容器，可通过 nativeEvent/data 响应事件。',
            psuip: `<layeredActionCard>
  <icon>✦</icon>
  <title>订阅我们的</title>
  <titleAccent>新闻通讯</titleAccent>
  <description>获取最新的产品更新、行业资讯和独家优惠信息。</description>
  <primaryAction nativeEvent="click" data="subscribe">订阅</primaryAction>
  <secondaryAction nativeEvent="click" data="later">稍后再说</secondaryAction>
</layeredActionCard>

<layeredActionCard>
  <badge>官方</badge>
  <title>开始使用AI助手</title>
  <description>获取最新的产品更新、行业资讯和独家优惠信息。</description>
  <primaryAction nativeEvent="click" data="startAssistant">订阅</primaryAction>
</layeredActionCard>`
        },
        layoutModes: [
            {
                name: 'withIconAndActions',
                condition: 'has:icon && has:secondaryAction',
                style: createRootStyle(),
                structure: createStructure(['icon'], ['primaryAction', 'secondaryAction'], 'repeat(2, minmax(0, 1fr))')
            },
            {
                name: 'withBadgeAndActions',
                condition: 'has:badge && has:secondaryAction',
                style: createRootStyle(),
                structure: createStructure(['badge'], ['primaryAction', 'secondaryAction'], 'repeat(2, minmax(0, 1fr))')
            },
            {
                name: 'withActions',
                condition: 'has:secondaryAction',
                style: createRootStyle(),
                structure: createStructure([], ['primaryAction', 'secondaryAction'], 'repeat(2, minmax(0, 1fr))')
            },
            {
                name: 'withIcon',
                condition: 'has:icon',
                style: createRootStyle(),
                structure: createStructure(['icon'], ['primaryAction'], '1fr')
            },
            {
                name: 'withBadge',
                condition: 'has:badge',
                style: createRootStyle(),
                structure: createStructure(['badge'], ['primaryAction'], '1fr')
            },
            {
                name: 'default',
                condition: 'default',
                style: createRootStyle(),
                structure: createStructure([], ['primaryAction'], '1fr')
            }
        ],
        slotConfigs: {
            icon: {
                optional: true,
                description: '左上角图标。用于装饰或提示卡片主题，例如订阅、消息、助手、提醒。icon 与 badge 二选一。',
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    margin: '0',
                    width: '{dimension.basic.dimension.48}',
                    height: '{dimension.basic.dimension.48}',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '{font.size.xl}',
                    fontWeight: '{font.fontweight.bold}',
                    color: '{color.basic.brand.6}',
                    lineHeight: '1'
                }
            },
            badge: {
                optional: true,
                description: '左上角小标签。用于展示“官方”“推荐”“Beta”等短提示。badge 与 icon 二选一。',
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    margin: '0',
                    padding: '{dimension.padding.supertight} {dimension.padding.semitight}',
                    borderRadius: '{dimension.borderradius.xl}',
                    fontSize: '{font.size.tiny}',
                    fontWeight: '{font.fontweight.medium}',
                    color: '{color.basic.brand.6}',
                    background: '{color.basic.brand.1}',
                    lineHeight: '1.35'
                }
            },
            title: {
                optional: false,
                description: '主标题第一行，必须提供。单行标题时只使用 title；需要两行不同颜色时，title 放第一行，titleAccent 放第二行。',
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    margin: '0',
                    fontSize: '{font.size.xl}',
                    fontWeight: '350',
                    color: '{color.basic.brand.7}',
                    lineHeight: '1.35',
                    whiteSpace: 'normal',
                    overflowWrap: 'break-word'
                }
            },
            titleAccent: {
                optional: true,
                description: '主标题第二行强调文字。仅当标题需要换行且第二行颜色不同的时候使用。',
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    margin: '0',
                    fontSize: '{font.size.xl}',
                    fontWeight: '900',
                    color: '{color.basic.brand.7}',
                    lineHeight: '1.35',
                    whiteSpace: 'normal',
                    overflowWrap: 'break-word'
                }
            },
            description: {
                optional: false,
                description: '底部浅色面板内的说明文字，必须提供。用于解释行动入口的价值、收益或提示。',
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    margin: '0',
                    fontSize: '{font.size.medium}',
                    color: '{color.basic.opacity.black.48}',
                    lineHeight: '1.6',
                    whiteSpace: 'normal',
                    overflowWrap: 'break-word'
                }
            },
            primaryAction: {
                optional: false,
                description: '主操作项，必须提供。单按钮场景独占整行；双按钮场景位于左侧并与 secondaryAction 并列。',
                metaType: 'text',
                variant: 'p',
                variantStyle: createPrimaryActionStyle()
            },
            secondaryAction: {
                optional: true,
                description: '双按钮场景下的次操作项。仅当存在 multiPrimaryAction 时使用，用于“稍后再说”“了解更多”等次要动作。',
                metaType: 'text',
                variant: 'p',
                variantStyle: createSecondaryActionStyle()
            },
            multiPrimaryAction: {
                optional: true,
                description: '内部样式引用。双按钮场景下用于覆盖 primaryAction，使左侧主操作使用蓝色样式；PSUIP 中不要直接书写此槽。',
                metaType: 'text',
                variant: 'p',
                variantStyle: createMultiPrimaryActionStyle()
            }
        },
        slots: {
            icon: { required: false, optional: true },
            badge: { required: false, optional: true },
            title: { required: true, optional: false },
            titleAccent: { required: false, optional: true },
            description: { required: true, optional: false },
            primaryAction: { required: true, optional: false, supportedAttributes: ['nativeEvent', 'data'] },
            secondaryAction: { required: false, optional: true, supportedAttributes: ['nativeEvent', 'data'] }
        },
        example: {
            icon: '✦',
            title: '订阅我们的',
            titleAccent: '新闻通讯',
            description: '获取最新的产品更新、行业资讯和独家优惠信息。',
            primaryAction: '订阅',
            secondaryAction: '稍后再说'
        }
    }
};

function createRootStyle() {
    return {
        display: 'flex',
        flex: '1',
        width: '100%',
        minHeight: '{dimension.basic.dimension.240}',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '{dimension.gap.base}',
        padding: '{dimension.padding.semiloose}',
        borderRadius: '{dimension.borderradius.xxxxl}',
        background: '{color.basic.brand.2}',
        overflow: 'hidden'
    };
}

function createStructure(metaSlots, actionSlots, actionColumns) {
    return {
        groups: [
            {
                name: 'visualBlock',
                type: 'template',
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '{dimension.gap.base}',
                    minHeight: '{dimension.basic.dimension.128}'
                },
                groups: [
                    {
                        name: 'metaBlock',
                        condition: metaSlots.length > 0 ? `has:${metaSlots[0]}` : 'false',
                        slots: metaSlots,
                        type: 'template',
                        style: {
                            display: 'flex',
                            alignItems: 'flex-start'
                        }
                    },
                    {
                        name: 'titleBlock',
                        type: 'template',
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '{dimension.gap.supertight}',
                            marginTop: '{dimension.margin.loose}'
                        },
                        groups: [
                            {
                                name: 'titleLine',
                                slots: ['title'],
                                type: 'template'
                            },
                            {
                                name: 'titleAccentLine',
                                condition: 'has:titleAccent',
                                slots: ['titleAccent'],
                                type: 'template'
                            }
                        ]
                    }
                ]
            },
            {
                name: 'panelBlock',
                type: 'template',
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '{dimension.gap.base}',
                    padding: '{dimension.padding.base}',
                    marginLeft: '-{dimension.padding.semiloose}',
                    marginRight: '-{dimension.padding.semiloose}',
                    marginBottom: '-{dimension.padding.semiloose}',
                    borderRadius: '{dimension.borderradius.xxxxl} {dimension.borderradius.xxxxl} {dimension.borderradius.xxxxl} {dimension.borderradius.xxxxl}',
                    background: '{color.basic.opacity.white.64}',
                    backdropFilter: 'blur(8px)'
                },
                groups: [
                    {
                        name: 'descriptionBlock',
                        slots: ['description'],
                        type: 'template'
                    },
                    {
                        name: 'actionRow',
                        type: 'template',
                        style: {
                            display: 'grid',
                            gridTemplateColumns: actionColumns,
                            gap: '{dimension.gap.base}',
                            width: '100%',
                            minWidth: '0'
                        },
                        groups: createActionGroups(actionSlots)
                    }
                ]
            }
        ]
    };
}

function createActionGroups(actionSlots) {
    if (actionSlots.length > 1) {
        return [
            {
                name: 'primaryActionBlock',
                slots: ['primaryAction'],
                styleReference: 'multiPrimaryAction'
            },
            {
                name: 'secondaryActionBlock',
                slots: ['secondaryAction']
            }
        ];
    }

    return [
        {
            name: 'primaryActionBlock',
            slots: ['primaryAction']
        }
    ];
}

function createPrimaryActionStyle() {
    return {
        margin: '0',
        cursor: 'pointer',
        userSelect: 'none',
        color: 'rgba(255, 255, 255, 0.72)',
        fontSize: '{font.size.medium}',
        padding: '{dimension.padding.base} {dimension.padding.semiloose}',
        borderRadius: '20px',
        background: `linear-gradient(135deg, {color.basic.pink.2} 0%, {color.basic.brand.4} 100%);`,
        width: '100%',
        textAlign: 'center',
    };
}

function createMultiPrimaryActionStyle() {
    return {
        margin: '0',
        cursor: 'pointer',
        userSelect: 'none',
        color: 'rgba(255, 255, 255, 0.72)',
        fontSize: '{font.size.medium}',
        padding: '{dimension.padding.base} {dimension.padding.semiloose}',
        borderRadius: '20px',
        background: '{color.basic.brand.6}',
        width: '100%',
        textAlign: 'center',
    };
}

function createSecondaryActionStyle() {
    return {
        margin: '0',
        cursor: 'pointer',
        userSelect: 'none',
        color: '{color.basic.opacity.black.48}',
        fontSize: '{font.size.medium}',
        padding: '{dimension.padding.base} {dimension.padding.semiloose}',
        borderRadius: '20px',
        background: '{color.basic.brand.1}',
        border: '{dimension.borderwidth.narrow} solid {color.basic.opacity.black.32}',
        width: '100%',
        textAlign: 'center',
    };
}

export default LAYERED_ACTION_CARD_STYLE
