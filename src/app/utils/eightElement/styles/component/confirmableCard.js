const FEIJI_SVG_DATA_URI = `url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTcyIiBoZWlnaHQ9IjE0MiIgdmlld0JveD0iMCAwIDE3MiAxNDIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xNzAuNjkzIDUwLjU4NzNDMTcyLjQ4IDU3LjI1NTcgMTY4LjUyMyA2NC4xMDk4IDE2MS44NTUgNjUuODk2NUwzMS4yOTk4IDEwMC44NzhDMjcuNjA2MiAxMDEuODY4IDIzLjcxMyAxMDAuMjE3IDIxLjg1NyA5Ni44NzRMMCA1Ny41MDE1TDEyLjA3NDEgNTQuMjY2NUwzMi42MzkgNzQuNjM4Mkw3NS4wOTk4IDYzLjI2MDdMMzcuNTEyMiA0LjMxMzY3TDUzLjYxMDkgMEwxMTEuNTM5IDUzLjQ5NjVMMTU1LjM4NCA0MS43NDg0QzE2Mi4wNTIgMzkuOTYxNiAxNjguOTA2IDQzLjkxODkgMTcwLjY5MyA1MC41ODczWk0yMS4xMTkzIDEyNC42NTZIMTU0LjQ1MlYxNDEuMzIySDIxLjExOTNWMTI0LjY1NloiIGZpbGw9IiM2MTVFRUMiLz4KPC9zdmc+Cg==')`;

const CONFIRMABLE_CARD_STYLE = {
    confirmableCard: {
        type: 'template',
        description: '可确认内容卡片。无标签时左上角展示品牌飞机图标，有标签时隐藏飞机。可选右上图标、可选标题、正文和底部操作入口。',
        usage: {
            guidance: 'tag 用于左上角标签文字，提供后飞机图标自动隐藏；cornerIcon 用于右上角静态图标；cornerIconAction 用于右上角可点击图标。title 用于主标题；body 用于正文说明；primaryAction 用于底部确认按钮。',
            psuip: `<confirmableCard>
  <tag>标签文字</tag>
  <cornerIconAction nativeEvent="click" data="open">↗</cornerIconAction>
  <title>打破常规、说到做到，年终给满！</title>
  <primaryAction nativeEvent="click" data="confirm">按钮</primaryAction>
</confirmableCard>`
        },
        layoutModes: [
            {
                name: 'default',
                condition: 'default',
                style: createConfirmableRootStyle(),
                structure: createConfirmableStructure(),
            }
        ],
        slotConfigs: {
            tag: {
                optional: true,
                description: '左上角标签文字。提供后飞机图标自动隐藏。',
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
                    justifyContent: 'end',
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
                    padding: '{dimension.padding.base} {dimension.padding.superloose}',
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
            tag: { required: false, optional: true },
            cornerIcon: { required: false, optional: true },
            cornerIconAction: { required: false, optional: true, supportedAttributes: ['nativeEvent', 'data'] },
            title: { required: false, optional: true },
            body: { required: false, optional: true },
            primaryAction: { required: false, optional: true, supportedAttributes: ['nativeEvent', 'data'] }
        },
        example: {
            tag: '标签文字',
            cornerIconAction: '↗',
            title: '打破常规、说到做到，年终给满！',
            primaryAction: '确认'
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
        background: 'var(--cc-bg)',
        overflow: 'hidden',
        '&': { 
            '--cc-bg': `${FEIJI_SVG_DATA_URI} no-repeat 14px 29px / 171px, #f3f3fd`,
        },
        '&:has([class*="-tagBlock-"])': {
            '--cc-bg': '#f3f3fd',
            paddingTop: '{dimension.padding.extraloose}'
        },
        '&:has([class*="-tagBlock-"]) [class*="-contentBlock-"]': {
            marginTop: '0'
        }
    };
}

function createConfirmableStructure() {
    return {
        groups: [
            {
                name: 'topBlock',
                condition: 'has:tag || has:cornerIcon || has:cornerIconAction',
                type: 'template',
                style: {
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '{dimension.gap.base}',
                    alignItems: 'start',
                    minHeight: '0'
                },
                groups: [
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
                    minWidth: '0',
                    marginTop: '{dimension.basic.dimension.160}'
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
