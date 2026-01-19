const TECH_GRADIENT_CARD_STYLE = {
    // 1. 科技渐变标准布局
    techGradientStandard: {
        type: 'template',
        markdownMapping: {
            h2: 'title',
            h3: 'content.title',
            p: 'content.segment',
            'button:primary': 'content.buttonContainer.button',
            'button:secondary': 'content.buttonContainer.secondaryButton',
            img: 'content.image',
            ul: 'content.list',
            table: 'content.table',
            blockquote: 'content.quote',
            code: 'content.codeBlock'
        },
        style: {
            display: 'flex',
            flexDirection: 'column',
            borderRadius: "{dimension.borderradius.xl}",
            padding: "{dimension.padding.tight}",
            background: `linear-gradient(135deg, {color.primary.brand4} 0%, {color.secondary.violet5} 35%, {color.primary.brand6} 100%)`,
            boxShadow: `{material.hierarchy.4f}`,
            border: `{dimension.borderwidth.narrow} solid {color.primarycontainer.brand2}`,
            position: 'relative',
            overflow: 'hidden',
            '&::after': {
                content: "''",
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, {color.surfacecontainer.white32} 60deg, transparent 120deg)`,
                opacity: '0.3',
                animation: 'rotate 8s linear infinite',
            }
        },
        title: {
            style: {
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: "{dimension.padding.base} {dimension.padding.loose}",
                justifyContent: 'space-between',
                borderRadius: "{dimension.borderradius.medium}",
                background: `linear-gradient(90deg, {color.surfacecontainer.white88} 0%, {color.surfacecontainer.white76} 100%)`,
                backdropFilter: 'blur(10px)',
                boxShadow: `{material.hierarchy.2f}`,
                border: `{dimension.borderwidth.narrow} solid {color.surfacecontainer.white48}`,
                marginBottom: "{dimension.margin.base}",
            },
            metaType: 'text',
            variant: 'techGradientTitle',
        },
        content: {
            type: 'template',
            style: {
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                borderRadius: "{dimension.borderradius.medium}",
                background: `linear-gradient(180deg, {color.surfacecontainer.white88} 0%, {color.surfacecontainer.white76} 100%)`,
                padding: "{dimension.padding.loose}",
                gap: "{dimension.gap.base}",
                backdropFilter: 'blur(10px)',
                boxShadow: `{material.hierarchy.B1}`,
                border: `{dimension.borderwidth.narrow} solid {color.surfacecontainer.white48}`,
                position: 'relative',
            },
            title: {
                metaType: 'text',
                variant: 'techGradientSubtitle',
            },
            segment: {
                metaType: 'text',
                variant: 'techGradientSegment',
            },
            buttonContainer: {
                type: 'template',
                style: {
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'row',
                },
                button: {
                    metaType: 'button',
                    variant: 'primary',
                    style: {
                        alignSelf: 'flex-start',
                    }
                },
                secondaryButton: {
                    metaType: 'button',
                    variant: 'secondary',
                    style: {
                        alignSelf: 'flex-start'
                    }
                },
            },
            image: {
                metaType: 'image',
                variant: 'rounded',
                style: {
                    marginTop: "{dimension.margin.base}"
                }
            },
            list: {
                metaType: 'list',
                variant: 'unordered'
            },
            table: {
                metaType: 'table',
                variant: 'container'
            },
            quote: {
                metaType: 'text',
                variant: 'quote'
            },
            codeBlock: {
                metaType: 'text',
                variant: 'codeBlock'
            },
            audio: {
                metaType: 'audio',
                variant: 'normal'
            }
        },
    },
    // 2. 科技渐变头部操作布局
    techGradientHeaderActions: {
        type: 'template',
        markdownMapping: {
            h2: 'header.title',
            'button:primary': 'header.actions.primaryAction',
            'button:secondary': 'header.actions.secondaryAction',
            h3: 'content.title',
            p: 'content.segment',
            img: 'content.image',
            ul: 'content.list'
        },
        style: {
            display: 'flex',
            flexDirection: 'column',
            borderRadius: "{dimension.borderradius.xl}",
            padding: "{dimension.padding.tight}",
            background: `linear-gradient(135deg, {color.primary.brand4} 0%, {color.secondary.violet5} 35%, {color.primary.brand6} 100%)`,
            boxShadow: `{material.hierarchy.4f}`,
            border: `{dimension.borderwidth.narrow} solid {color.primarycontainer.brand2}`,
            position: 'relative',
            overflow: 'hidden',
            '&::after': {
                content: "''",
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: `conic-gradient(from 0deg at 50% 50%, transparent 0deg, {color.surfacecontainer.white32} 60deg, transparent 120deg)`,
                opacity: '0.3',
                animation: 'rotate 8s linear infinite',
            }
        },
        header: {
            type: 'template',
            style: {
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: "{dimension.padding.base} {dimension.padding.loose}",
                borderRadius: "{dimension.borderradius.medium}",
                background: `linear-gradient(90deg, {color.surfacecontainer.white88} 0%, {color.surfacecontainer.white76} 100%)`,
                backdropFilter: 'blur(10px)',
                boxShadow: `{material.hierarchy.2f}`,
                border: `{dimension.borderwidth.narrow} solid {color.surfacecontainer.white48}`,

            },
            title: {
                metaType: 'text',
                variant: 'techGradientTitle',
            },
            actions: {
                type: 'template',
                style: {
                    display: 'flex',
                    flexDirection: 'row',
                    width: 'auto',
                    gap: "{dimension.gap.tight}"
                },
                primaryAction: {
                    metaType: 'button',
                    variant: 'primary'
                },
                secondaryAction: {
                    metaType: 'button',
                    variant: 'secondary'
                }
            }
        },
        content: {
            type: 'template',
            style: {
                display: 'flex',
                flex: '1',
                flexDirection: 'column',
                width: '100%',
                marginTop: "{dimension.margin.base}",
                borderRadius: "{dimension.borderradius.medium}",
                background: `linear-gradient(180deg, {color.surfacecontainer.white88} 0%, {color.surfacecontainer.white76} 100%)`,
                padding: "{dimension.padding.loose}",
                gap: "{dimension.gap.base}",
                backdropFilter: 'blur(10px)',
                boxShadow: `{material.hierarchy.B1}`,
                border: `{dimension.borderwidth.narrow} solid {color.surfacecontainer.white48}`,
                position: 'relative',
            },
            title: {
                metaType: 'text',
                variant: 'techGradientSubtitle',
            },
            segment: {
                metaType: 'text',
                variant: 'techGradientSegment',
            },
            image: {
                metaType: 'image',
                variant: 'rounded'
            },
            list: {
                metaType: 'list',
                variant: 'unordered'
            }
        }
    },
}


export default TECH_GRADIENT_CARD_STYLE