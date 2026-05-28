const CONFIRMABLE_CARD_STYLE = {
    // confirmableCard 数据绑定示例
    confirmableCard: {
        type: 'template',
        description: '可确认内容卡片。用于一张卡片中展示可选左上图片或左上小文字、可选右上图标、可选标题、正文和底部操作入口的场景。适合品牌/人物/任务/活动/提示类卡片，卡片本身可承载确认、刷新、查看详情等操作。',
        usage: {
            guidance: '根据内容选择槽位：visual 用于左上角主视觉图片或图形，贴紧卡片左上角；tag 用于左上角小文字，visual 与 tag 通常二选一；cornerIcon 用于右上角静态图标展示，没有按钮边框和背景；cornerIconAction 用于右上角图标按钮，需要点击响应时才使用。cornerIcon 和 cornerIconAction 都只能放图标符号，不放普通文字。title 用于主标题；body 用于正文说明；primaryAction 用于底部确认按钮。底部按钮和可点击图标都用普通文本容器承载，不使用 button 默认行为。',
            psuip: `<confirmableCard>
  <visual src="https://sop-cdn.dingcloud.com/filez/icon/8mm6fa2u7foi4j38r6r67navgpttixwi20240708114129822.png" alt="品牌图形" />
  <cornerIcon>↻</cornerIcon>
  <title>鼎道智联</title>
  <body>正文文字正文文字正文文字正文文字正文文字正文文字正文文字正文文字正文文字正文文字</body>
</confirmableCard>

<confirmableCard>
  <tag>标签文字</tag>
  <cornerIconAction nativeEvent="click" data="open">↗</cornerIconAction>
  <title>打破常规、说到做到，年终给满！</title>
  <primaryAction nativeEvent="click" data="confirm">按钮</primaryAction>
</confirmableCard>`
        },
        layoutModes: [
            {
                name: 'withVisual',
                condition: 'has:visual',
                style: createConfirmableRootStyle(),
                structure: createConfirmableStructure(true)
            },
            {
                name: 'default',
                condition: 'default',
                style: createConfirmableRootStyle(),
                structure: createConfirmableStructure(false)
            }
        ],
        slotConfigs: {
            visual: {
                optional: true,
                description: '左上角主视觉图片或图形，贴紧卡片左上角，图片自身不需要 margin。用于品牌标识、插画、产品图或装饰图形。没有主视觉时不要提供本槽。',
                metaType: 'image',
                variant: 'minimalist',
                variantStyle: {
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    objectPosition: 'left top',
                    display: 'block',
                    margin: '0',
                    padding: '0',
                    borderRadius: '0',
                    borderWidth: '0',
                    borderColor: 'transparent',
                    borderStyle: 'none',
                    boxShadow: 'none',
                    outline: 'none'
                },
                supportedAttributes: ['src', 'alt']
            },
            tag: {
                optional: true,
                description: '左上角小文字。用于短标签、分类、状态或补充说明，例如“标签文字”“官方”“推荐”。如果已经使用 visual，通常不再使用 tag。',
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    margin: '0',
                    fontSize: '{font.size.medium}',
                    color: '{color.basic.opacity.black.48}',
                    lineHeight: '1.35'
                }
            },
            cornerIcon: {
                optional: true,
                description: '右上角静态图标。只用于展示，不是按钮，没有边框、背景和阴影；只能放图标符号，不放普通文字。如果需要点击响应，请使用 cornerIconAction。',
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    margin: '0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '{dimension.basic.dimension.64}',
                    height: '{dimension.basic.dimension.64}',
                    color: '{color.basic.brand.6}',
                    fontSize: '{font.size.xl}',
                    fontWeight: '{font.fontweight.bold}',
                    lineHeight: '1',
                    userSelect: 'none'
                },
            },
            cornerIconAction: {
                optional: true,
                description: '右上角图标按钮。只有需要点击响应时使用，可配置 nativeEvent/data；只能放图标符号，不放普通文字。视觉上有按钮背景、圆角和阴影。',
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    margin: '0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '{dimension.basic.dimension.64}',
                    height: '{dimension.basic.dimension.64}',
                    borderRadius: '{dimension.borderradius.xl}',
                    background: '{color.basic.opacity.white.100}',
                    boxShadow: '{material.hierarchy.2f}',
                    color: '{color.basic.opacity.black.48}',
                    fontSize: '{font.size.xl}',
                    fontWeight: '{font.fontweight.bold}',
                    lineHeight: '1',
                    cursor: 'pointer',
                    userSelect: 'none'
                },
                supportedAttributes: ['nativeEvent', 'data']
            },
            title: {
                optional: true,
                description: '卡片主标题。用于名称、主张、任务标题或提示文案。可以独立使用，也可以和 body、primaryAction 搭配。',
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    margin: '0',
                    fontSize: '{font.size.xl}',
                    fontWeight: '900',
                    color: '{color.basic.brand.6}',
                    lineHeight: '1.22',
                    whiteSpace: 'normal',
                    overflowWrap: 'break-word'
                }
            },
            body: {
                optional: true,
                description: '卡片正文说明。用于补充解释标题、背景、价值或提示内容。正文较长时会自然换行。',
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    margin: '0',
                    fontSize: '{font.size.medium}',
                    color: '{color.basic.opacity.black.64}',
                    lineHeight: '1.55',
                    whiteSpace: 'normal',
                    overflowWrap: 'break-word'
                }
            },
            primaryAction: {
                optional: true,
                description: '底部主操作项。用于确认、提交、查看详情、进入下一步等动作。视觉上呈现为按钮，但底层使用文本容器，可配置 nativeEvent/data。',
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    margin: '0',
                    cursor: 'pointer',
                    userSelect: 'none',
                    color: 'rgba(255, 255, 255, 0.72)',
                    fontSize: '{font.size.medium}',
                    fontWeight: '{font.fontweight.bold}',
                    padding: '{dimension.padding.base} {dimension.padding.semiloose}',
                    borderRadius: '20px',
                    background: `linear-gradient(135deg, {color.basic.pink.2} 0%, {color.basic.brand.4} 100%);`,
                    width: '100%',
                    textAlign: 'center',
                    whiteSpace: 'normal',
                    overflowWrap: 'break-word'
                },
                supportedAttributes: ['nativeEvent', 'data']
            }
        },
        slots: {
            visual: { required: false, optional: true, supportedAttributes: ['src', 'alt'] },
            tag: { required: false, optional: true },
            cornerIcon: { required: false, optional: true },
            cornerIconAction: { required: false, optional: true, supportedAttributes: ['nativeEvent', 'data'] },
            title: { required: false, optional: true },
            body: { required: false, optional: true },
            primaryAction: { required: false, optional: true, supportedAttributes: ['nativeEvent', 'data'] }
        },
        example: {
            visual: 'https://sop-cdn.dingcloud.com/filez/icon/8mm6fa2u7foi4j38r6r67navgpttixwi20240708114129822.png',
            cornerIcon: '↻',
            title: '鼎道智联',
            body: '正文文字正文文字正文文字正文文字正文文字正文文字正文文字正文文字正文文字正文文字'
        }
    }
};

function createConfirmableRootStyle() {
    return {
        display: 'flex',
        flex: '1',
        width: '100%',
        minHeight: '{dimension.basic.dimension.320}',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        gap: '{dimension.gap.base}',
        padding: '{dimension.padding.extraloose}',
        borderRadius: '{dimension.borderradius.xxxxl}',
        background: '{color.basic.brand.0}',
        overflow: 'hidden'
    };
}

function createConfirmableStructure(hasVisual) {
    return {
        groups: [
            {
                name: 'topBlock',
                condition: 'has:visual || has:tag || has:cornerIcon || has:cornerIconAction',
                type: 'template',
                style: {
                    display: 'grid',
                    gridTemplateColumns: hasVisual ? '59.17% 1fr' : '1fr auto',
                    gap: '{dimension.gap.base}',
                    alignItems: 'start',
                    minHeight: hasVisual ? '{dimension.basic.dimension.160}' : '0'
                },
                groups: [
                    {
                        name: 'visualBlock',
                        condition: 'has:visual',
                        slots: ['visual'],
                        type: 'template',
                        style: {
                            width: '100%',
                            overflow: 'hidden',
                            minWidth: '0',
                            marginTop: '-{dimension.padding.extraloose}',
                            marginLeft: '-{dimension.padding.extraloose}',
                            borderWidth: '0',
                            borderStyle: 'none',
                            borderColor: 'transparent',
                            boxShadow: 'none',
                            outline: 'none'
                        }
                    },
                    {
                        name: 'tagBlock',
                        condition: 'has:tag',
                        slots: ['tag'],
                        type: 'template',
                        style: {
                            minWidth: '0'
                        }
                    },
                    {
                        name: 'cornerIconBlock',
                        condition: 'has:cornerIcon',
                        slots: ['cornerIcon'],
                        type: 'template',
                        style: {
                            justifySelf: 'end'
                        }
                    },
                    {
                        name: 'cornerIconActionBlock',
                        condition: 'has:cornerIconAction',
                        slots: ['cornerIconAction'],
                        type: 'template',
                        style: {
                            justifySelf: 'end'
                        }
                    }
                ]
            },
            {
                name: 'contentBlock',
                condition: 'has:title || has:body',
                type: 'template',
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '{dimension.gap.base}',
                    minWidth: '0'
                },
                groups: [
                    {
                        name: 'titleBlock',
                        condition: 'has:title',
                        slots: ['title'],
                        type: 'template'
                    },
                    {
                        name: 'bodyBlock',
                        condition: 'has:body',
                        slots: ['body'],
                        type: 'template'
                    }
                ]
            },
            {
                name: 'actionBlock',
                condition: 'has:primaryAction',
                slots: ['primaryAction'],
                type: 'template',
                style: {
                    width: '100%',
                    marginTop: 'auto'
                }
            }
        ]
    };
}

export default CONFIRMABLE_CARD_STYLE
