const PAIRED_IMAGE_TEXT_CARD_STYLE = {
    // pairedImageTextCard 数据绑定示例
    pairedImageTextCard: {
        type: 'template',
        description: '固定双子内容的图文卡片。用于一个主题下并列展示两个图文说明项，例如“关于企业 / 关于团队”“产品能力 / 服务优势”。本组件必须包含外层标题、外层内容，以及两个子内容；每个子内容必须包含图片、标题、正文。',
        usage: {
            guidance: '只有明确需要展示两个并列图文内容时使用 pairedImageTextCard。外层 title/content 用于说明整组主题；primaryItem 和 secondaryItem 是两个固定子内容，二者都必须包含 image/title/body。不要用于单个内容，也不要用于三个及以上内容；短摘要或推荐概览仍使用 contentSummaryCard。',
            psuip: `<pairedImageTextCard>
  <label>公司简介</label>
  <title>致力于提供最先进的数字化解决方案</title>
  <content>我们围绕技术、团队与服务能力，为客户提供可持续的数字化支持。</content>
  <primaryItem>
    <image src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&h=800" alt="企业会议与数字化方案讨论" />
    <title>关于企业</title>
    <body>我们是一家专注于人工智能和大数据领域的创新科技公司，围绕数据治理、智能分析、业务自动化与系统集成，为客户提供从方案规划到落地交付的完整支持。</body>
  </primaryItem>
  <secondaryItem>
    <image src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&h=800" alt="团队协作会议" />
    <title>关于团队</title>
    <body>我们拥有一支充满活力和创新精神的技术团队。</body>
  </secondaryItem>
</pairedImageTextCard>`
        },
        layoutModes: [
            {
                name: 'withLabel',
                condition: 'has:label',
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
                    border: '{dimension.borderwidth.narrow} solid {color.surfacecontainer.black7}',
                    overflow: 'hidden'
                },
                structure: {
                    groups: [
                        {
                            name: 'headerBlock',
                            type: 'template',
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '{dimension.gap.base}'
                            },
                            groups: [
                                {
                                    name: 'labelBlock',
                                    slots: ['label'],
                                    type: 'template'
                                },
                                {
                                    name: 'titleBlock',
                                    slots: ['title'],
                                    type: 'template'
                                },
                                {
                                    name: 'contentBlock',
                                    slots: ['content'],
                                    type: 'template'
                                }
                            ]
                        },
                        {
                            name: 'pairGrid',
                            slots: ['primaryItem', 'secondaryItem'],
                            type: 'template',
                            style: {
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                                gap: '{dimension.gap.base}',
                                alignItems: 'stretch',
                                width: '100%',
                                minWidth: '0'
                            }
                        }
                    ]
                }
            },
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
                    border: '{dimension.borderwidth.narrow} solid {color.surfacecontainer.black7}',
                    overflow: 'hidden'
                },
                structure: {
                    groups: [
                        {
                            name: 'headerBlock',
                            condition: 'has:title || has:content',
                            type: 'template',
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '{dimension.gap.base}'
                            },
                            groups: [
                                {
                                    name: 'titleBlock',
                                    slots: ['title'],
                                    type: 'template'
                                },
                                {
                                    name: 'contentBlock',
                                    slots: ['content'],
                                    type: 'template'
                                }
                            ]
                        },
                        {
                            name: 'pairGrid',
                            slots: ['primaryItem', 'secondaryItem'],
                            type: 'template',
                            style: {
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                                gap: '{dimension.gap.base}',
                                alignItems: 'stretch',
                                width: '100%',
                                minWidth: '0'
                            }
                        }
                    ]
                }
            }
        ],
        slotConfigs: {
            label: {
                optional: true,
                description: '可选的紫色分组标题，例如“公司简介”“服务说明”“能力介绍”。只用于标识整张双子内容卡片的上级主题。',
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    margin: '0',
                    marginTop: '{dimension.margin.semitight}',
                    marginLeft: '{dimension.margin.superloose}',
                    fontSize: '{font.size.medium}',
                    fontWeight: '{font.fontweight.bold}',
                    color: '{color.basic.brand.6}',
                    lineHeight: '1.35'
                }
            },
            title: {
                optional: false,
                description: '外层黑色标题，必须提供。用于概括两个子内容共同表达的主题或主张。',
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    margin: '0',
                    marginTop: '{dimension.margin.semitight}',
                    marginLeft: '{dimension.margin.superloose}',
                    fontSize: '{font.size.xl}',
                    fontWeight: '{font.fontweight.bold}',
                    color: '{color.basic.opacity.black.48}',
                    lineHeight: '1.28',
                    whiteSpace: 'normal',
                    overflowWrap: 'break-word'
                }
            },
            content: {
                optional: false,
                description: '外层内容，必须提供。用于补充说明整组双子内容的背景、价值或上下文，不替代子内容正文。',
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    margin: '0',
                    marginTop: '{dimension.margin.semitight}',
                    marginLeft: '{dimension.margin.superloose}',
                    fontSize: '{font.size.medium}',
                    color: '{color.basic.opacity.black.48}',
                    lineHeight: '1.6',
                    whiteSpace: 'normal',
                    overflowWrap: 'break-word'
                }
            },
            primaryItem: createPairedItemSlotConfig('第一个子内容，必须提供。用于左侧或第一项图文说明，内部必须包含 image/title/body。'),
            secondaryItem: createPairedItemSlotConfig('第二个子内容，必须提供。用于右侧或第二项图文说明，内部必须包含 image/title/body。')
        },
        slots: {
            label: { required: false, optional: true },
            title: { required: true, optional: false },
            content: { required: true, optional: false },
            primaryItem: { required: true, optional: false },
            secondaryItem: { required: true, optional: false }
        },
        example: {
            label: '公司简介',
            title: '致力于提供最先进的数字化解决方案',
            content: '我们围绕技术、团队与服务能力，为客户提供可持续的数字化支持。',
            primaryItem: {
                image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&h=800',
                title: '关于企业',
                body: '我们是一家专注于人工智能和大数据领域的创新科技公司，围绕数据治理、智能分析、业务自动化与系统集成，为客户提供从方案规划、产品研发到落地交付的完整支持，帮助不同阶段的企业建立更稳定、更高效的数字化能力。'
            },
            secondaryItem: {
                image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&h=800',
                title: '关于团队',
                body: '我们拥有一支充满活力和创新精神的技术团队。'
            }
        }
    }
};

function createPairedItemSlotConfig(description) {
    return {
        type: 'template',
        metaType: 'feedItem',
        description,
        style: {
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            minWidth: '0'
        },
        itemStyles: {
            row: {
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                minWidth: '0',
                overflow: 'hidden',
                borderRadius: '{dimension.borderradius.xxl}',
                background: '{color.surfacecontainer.white100}',
                border: '{dimension.borderwidth.narrow} solid {color.surfacecontainer.black7}'
            }
        },
        subSlots: {
            image: {
                metaType: 'image',
                variant: 'cover',
                description: '子内容图片，必须提供。用于表现当前子内容对应的对象、场景或主题。',
                variantStyle: {
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    display: 'block',
                    margin: '0',
                    padding: '0',
                    borderRadius: '0',
                    borderWidth: '0',
                    borderStyle: 'none',
                    boxShadow: 'none'
                },
                supportedAttributes: ['src', 'alt']
            },
            title: {
                metaType: 'text',
                variant: 'p',
                description: '子内容标题，必须提供。用于概括当前子内容。',
                variantStyle: {
                    margin: '0',
                    fontSize: '{font.size.medium}',
                    fontWeight: '{font.fontweight.bold}',
                    color: '{color.basic.opacity.black.48}',
                    lineHeight: '1.35',
                    whiteSpace: 'normal',
                    overflowWrap: 'break-word'
                }
            },
            body: {
                metaType: 'text',
                variant: 'p',
                description: '子内容正文，必须提供。用于解释当前子内容，建议一到多句自然文字。',
                variantStyle: {
                    margin: '0',
                    fontSize: '{font.size.medium}',
                    color: '{color.basic.opacity.black.64}',
                    lineHeight: '1.6',
                    whiteSpace: 'normal',
                    overflowWrap: 'break-word'
                }
            }
        },
        itemLayout: [
            {
                name: 'imageBlock',
                slots: ['image'],
                style: {
                    width: '100%',
                    aspectRatio: '4 / 3',
                    flexShrink: '0',
                    overflow: 'hidden',
                    background: '{color.surfacecontainer.black7}',
                    borderRadius: '{dimension.borderradius.xxl} {dimension.borderradius.xxl} 0 0'
                }
            },
            {
                name: 'textBlock',
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '{dimension.gap.base}',
                    padding: '{dimension.padding.extraloose} {dimension.padding.superloose} {dimension.padding.superloose} {dimension.padding.superloose}',
                    minWidth: '0'
                },
                slotGroups: [
                    {
                        name: 'titleBlock',
                        slots: ['title']
                    },
                    {
                        name: 'bodyBlock',
                        slots: ['body']
                    }
                ]
            }
        ]
    };
}

export default PAIRED_IMAGE_TEXT_CARD_STYLE
