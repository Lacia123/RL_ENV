const MULTI_ACTION_CARD_STYLE = {
    // multiActionCard 数据绑定示例
    multiActionCard: {
        type: 'template',
        description: '多按钮操作卡片。用于一段说明内容下提供多个操作入口的场景，例如加入我们、申请方式、联系方式、下载入口或多个跳转按钮。适合有一个主操作和多个次操作的卡片。',
        usage: {
            guidance: '当内容需要提供多个并列按钮时使用 multiActionCard。label 用于顶部紫色标题；description 用于主要说明；actionLabel 用于按钮组标题；primaryAction 是最重要的按钮，secondaryAction 可重复提供其它按钮。不要用于只有一个按钮的普通摘要卡。',
            psuip: `<multiActionCard>
  <label>加入我们</label>
  <description>成为我们团队的一员，你将有机会参与前沿技术研究，与优秀团队一起成长，共同打造行业领先的解决方案。</description>
  <actionLabel>应聘方式</actionLabel>
  <primaryAction nativeEvent="click" data="officialApply">官网在线申请</primaryAction>
  <secondaryAction nativeEvent="click" data="wechatApply">公众号后台申请</secondaryAction>
  <secondaryAction nativeEvent="click" data="emailApply">发送邮件申请</secondaryAction>
</multiActionCard>`
        },
        layoutModes: [
            {
                name: 'default',
                condition: 'default',
                style: {
                    display: 'flex',
                    flex: '1',
                    width: '100%',
                    flexDirection: 'column',
                    gap: '{dimension.gap.base}',
                    padding: '{dimension.padding.base}',
                    borderRadius: '{dimension.borderradius.xxxxl}',
                    background: '{color.basic.opacity.black.4}',
                    boxShadow: '{material.hierarchy.1f}',
                    overflow: 'hidden'
                },
                structure: {
                    groups: [
                        {
                            name: 'headerBlock',
                            condition: 'has:label || has:title || has:description',
                            type: 'template',
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '{dimension.gap.base}'
                            },
                            groups: [
                                {
                                    name: 'labelBlock',
                                    condition: 'has:label',
                                    slots: ['label'],
                                    type: 'template'
                                },
                                {
                                    name: 'titleBlock',
                                    condition: 'has:title',
                                    slots: ['title'],
                                    type: 'template'
                                },
                                {
                                    name: 'descriptionBlock',
                                    condition: 'has:description',
                                    slots: ['description'],
                                    type: 'template'
                                }
                            ]
                        },
                        {
                            name: 'actionBlock',
                            condition: 'has:actionLabel || has:primaryAction || has:secondaryAction',
                            type: 'template',
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '{dimension.gap.base}',
                                borderTop: '{dimension.borderwidth.narrow} solid {color.basic.opacity.black.7}',
                                paddingTop: '{dimension.padding.base}'
                            },
                            groups: [
                                {
                                    name: 'actionLabelBlock',
                                    condition: 'has:actionLabel',
                                    slots: ['actionLabel'],
                                    type: 'template'
                                },
                                {
                                    name: 'actionRow',
                                    condition: 'has:primaryAction || has:secondaryAction',
                                    slots: ['primaryAction', 'secondaryAction*'],
                                    type: 'template',
                                    style: {
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                                        gap: '{dimension.gap.base}',
                                        width: '100%',
                                        minWidth: '0'
                                    }
                                }
                            ]
                        }
                    ]
                }
            }
        ],
        slotConfigs: {
            label: {
                optional: true,
                description: '顶部紫色标题，例如“加入我们”“联系我们”“申请入口”。用于说明整张操作卡的主题。',
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    margin: '0',
                    padding: '{dimension.padding.semitight} {dimension.padding.semiloose}',
                    fontSize: '{font.size.medium}',
                    fontWeight: '{font.fontweight.bold}',
                    color: '{color.basic.brand.6}',
                    lineHeight: '1.35'
                }
            },
            title: {
                optional: true,
                description: '可选主标题。用于在说明文字前补充一个更明确的行动主张；没有主标题时直接使用 description。',
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    margin: '0',
                    marginTop: '{dimension.margin.semitight}',
                    marginLeft: '{dimension.margin.semiloose}',
                    fontSize: '{font.size.xl}',
                    fontWeight: '{font.fontweight.bold}',
                    color: '{color.basic.opacity.black.48}',
                    lineHeight: '1.28',
                    whiteSpace: 'normal',
                    overflowWrap: 'break-word'
                }
            },
            description: {
                optional: false,
                description: '主要说明文字，必须提供。用于解释操作卡的背景、价值或申请说明。',
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    margin: '0',
                    padding: '{dimension.padding.semitight} {dimension.padding.semiloose}',
                    fontSize: '{font.size.medium}',
                    color: '{color.basic.opacity.black.48}',
                    lineHeight: '1.65',
                    whiteSpace: 'normal',
                    overflowWrap: 'break-word'
                }
            },
            actionLabel: {
                optional: true,
                description: '按钮组标题，例如“应聘方式”“申请方式”“联系方式”。用于说明下方多个按钮的共同目的。',
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    margin: '0',
                    padding: '{dimension.padding.semitight} {dimension.padding.semiloose}',
                    fontSize: '{font.size.medium}',
                    fontWeight: '{font.fontweight.bold}',
                    color: '{color.basic.brand.6}',
                    lineHeight: '1.35'
                }
            },
            primaryAction: {
                optional: false,
                description: '主操作项，必须提供。用于最重要、最推荐的操作入口。视觉上呈现为按钮，但底层使用普通文本容器响应 nativeEvent，不使用 button 默认行为。',
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    minHeight: '{dimension.basic.dimension.56}',
                    padding: '{dimension.padding.base} {dimension.padding.semiloose}',
                    borderRadius: '{dimension.borderradius.xl}',
                    borderWidth: '0',
                    borderStyle: 'none',
                    background: '{color.basic.brand.5}',
                    color: '{color.basic.brand.0}',
                    fontSize: '{font.size.medium}',
                    fontWeight: '{font.fontweight.bold}',
                    lineHeight: '1.2',
                    textAlign: 'center',
                    whiteSpace: 'normal',
                    overflowWrap: 'break-word',
                    boxShadow: 'none',
                    cursor: 'pointer',
                    userSelect: 'none'
                },
                supportedAttributes: ['nativeEvent', 'data']
            },
            secondaryAction: {
                optional: true,
                description: '次操作项，可重复。用于主操作之外的其它操作入口。视觉上呈现为按钮，但底层使用普通文本容器响应 nativeEvent，不使用 button 默认行为。',
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    minHeight: '{dimension.basic.dimension.56}',
                    padding: '{dimension.padding.base} {dimension.padding.semiloose}',
                    borderRadius: '{dimension.borderradius.xl}',
                    borderWidth: '{dimension.borderwidth.base}',
                    borderStyle: 'solid',
                    borderColor: '{color.basic.brand.5}',
                    background: '{color.basic.brand.1}',
                    color: '{color.basic.brand.5}',
                    fontSize: '{font.size.medium}',
                    fontWeight: '{font.fontweight.bold}',
                    lineHeight: '1.2',
                    textAlign: 'center',
                    whiteSpace: 'normal',
                    overflowWrap: 'break-word',
                    boxShadow: 'none',
                    cursor: 'pointer',
                    userSelect: 'none'
                },
                supportedAttributes: ['nativeEvent', 'data']
            },
            'secondaryAction*': {
                optional: true,
                description: '可重复次操作项，语义同 secondaryAction。',
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    minHeight: '{dimension.basic.dimension.56}',
                    padding: '{dimension.padding.base} {dimension.padding.semiloose}',
                    borderRadius: '{dimension.borderradius.xl}',
                    borderWidth: '{dimension.borderwidth.base}',
                    borderStyle: 'solid',
                    borderColor: '{color.basic.brand.5}',
                    background: '{color.basic.brand.1}',
                    color: '{color.basic.brand.5}',
                    fontSize: '{font.size.medium}',
                    fontWeight: '{font.fontweight.bold}',
                    lineHeight: '1.2',
                    textAlign: 'center',
                    whiteSpace: 'normal',
                    overflowWrap: 'break-word',
                    boxShadow: 'none',
                    cursor: 'pointer',
                    userSelect: 'none'
                },
                supportedAttributes: ['nativeEvent', 'data']
            }
        },
        slots: {
            label: { required: false, optional: true },
            title: { required: false, optional: true },
            description: { required: true, optional: false },
            actionLabel: { required: false, optional: true },
            primaryAction: { required: true, optional: false, supportedAttributes: ['nativeEvent', 'data'] },
            secondaryAction: { required: false, optional: true, supportedAttributes: ['nativeEvent', 'data'] }
        },
        example: {
            label: '加入我们',
            description: '成为我们团队的一员，你将有机会参与前沿技术研究，与优秀团队一起成长，共同打造行业领先的解决方案。如果你对算法充满热情，渴望挑战，欢迎加入我们！',
            actionLabel: '应聘方式',
            primaryAction: '官网在线申请',
            secondaryAction: ['公众号后台申请', '发送邮件申请']
        }
    }
};

export default MULTI_ACTION_CARD_STYLE
