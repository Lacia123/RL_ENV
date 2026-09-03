const TEXT_CARD_STYLE = {
    textCard: {
        type: 'template',
        layoutModes: [
            {
                name: 'full',
                condition: 'has:text_subtitle',
                style: {
                    display: 'flex',
                    flex: "1",
                    flexDirection: 'column',
                    gap: '{dimension.gap.tight}',
                    borderRadius: '{dimension.borderradius.xl}',
                    padding: '{dimension.padding.loose}',
                    background: '{color.surfacecontainer.white100}',
                },
                structure: {
                    groups: [
                        {
                            name: 'titleBlock',
                            // 标题样式与 mode 解耦：无论哪种 mode，<text_title> 统一使用 text_title 样式，保证同标签渲染一致
                            slots: ['text_title']
                        },
                        {
                            name: 'subtitleBlock',
                            condition: 'has:text_subtitle',
                            slots: ['text_subtitle']
                        },
                        {
                            name: 'textBlock',
                            condition: 'has:text_text',
                            slots: ['text_text']
                        },
                        {
                            name: 'ctaRow',
                            condition: 'has:cta',
                            slots: ['cta'],
                            type: 'template',
                            style: {
                                display: 'flex',
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
                    flex: "1",
                    flexDirection: 'column',
                    gap: '{dimension.gap.tight}',
                    borderRadius: '{dimension.borderradius.xl}',
                    padding: '{dimension.padding.loose}',
                    background: '{color.surfacecontainer.white100}',
                },
                structure: {
                    groups: [
                        {
                            name: 'titleBlock',
                            slots: ['text_title']
                        },
                        {
                            name: 'textBlock',
                            condition: 'has:text_text',
                            slots: ['text_text']
                        },
                        {
                            name: 'ctaRow',
                            condition: 'has:cta',
                            slots: ['cta'],
                            type: 'template',
                            style: {
                                display: 'flex',
                            }
                        }
                    ]
                }
            }
        ],
        style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '{dimension.gap.tight}',
            borderRadius: '{dimension.borderradius.xl}',
            padding: '{dimension.padding.loose}',
            background: '{color.surfacecontainer.white100}',
        },
        slotConfigs: {
            text_title: {
                metaType: 'text',
                variant: 'h3',
                variantStyle: {
                    margin: '0',
                    fontSize: '{font.size.xl}',
                    fontWeight: '700',
                    background: 'linear-gradient(135deg, {color.basic.brand.5} 0%, {color.basic.violet.5} 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: '1.3'
                }
            },
            text_subtitle: {
                metaType: 'text',
                variant: 'h4',
                variantStyle: {
                    margin: '0',
                    fontSize: '{font.size.xl}',
                    fontWeight: '700',
                    color: '{color.basic.grey.5}',
                    lineHeight: '1.3',
                    borderBottom: 'none',
                    padding: '0'
                }
            },
            text_text: {
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    margin: '0',
                    fontSize: '{font.size.small}',
                    color: '{color.basic.opacity.black.64}',
                    lineHeight: '1.5',
                    // 🆕 grid 适配：正文最多 2 行，超出省略，避免 1×1 格内溢出
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: '2',
                    overflow: 'hidden',
                }
            },
            cta: {
                metaType: 'button',
                variant: 'primary',
                variantStyle: {
                    minWidth: '140px',
                    borderRadius: '{dimension.borderradius.full}',
                    fontWeight: '{font.fontweight.bold}',
                    padding: '{dimension.padding.base} {dimension.padding.superloose}',
                    background: 'linear-gradient(135deg, {color.basic.brand.5} 0%, {color.basic.violet.5} 100%)'
                },
                supportedAttributes: ['href', 'target']
            }
        },
        slots: {
            text_title: { required: true, optional: false },
            text_subtitle: { required: false, optional: true },
            text_text: { required: false, optional: true },
            cta: { required: false, optional: true, supportedAttributes: ['href', 'target'] }
        }
    },

    textCenterCard: {
        type: 'template',
        layoutModes: [
            {
                name: 'full',
                condition: 'has:text_subtitle',
                style: {
                    display: 'flex',
                    flex: "1",
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: '0',
                    borderRadius: '{dimension.borderradius.xl}',
                    padding: '{dimension.padding.extraloose}',
                    background: '{color.surfacecontainer.white100}',
                },
                structure: {
                    groups: [
                        {
                            type: 'template',
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                gap: '0',
                                marginBottom: '24px'
                            },
                            slots: ['text_subtitle', 'text_title']
                        },
                        {
                            name: 'textBlock',
                            condition: 'has:text_text',
                            slots: ['text_text']
                        },
                    ]
                }
            },
            {
                name: 'default',
                condition: 'default',
                style: {
                    display: 'flex',
                    flex: "1",
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: '{dimension.gap.semitight}',
                    borderRadius: '{dimension.borderradius.xl}',
                    padding: '{dimension.padding.extraloose}',
                    background: '{color.surfacecontainer.white100}',
                },
                structure: {
                    groups: [
                        {
                            name: 'titleBlock',
                            slots: ['text_title']
                        },
                        {
                            name: 'textBlock',
                            condition: 'has:text_text',
                            slots: ['text_text']
                        }
                    ]
                }
            }
        ],
        style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '{dimension.gap.semiloose}',
            borderRadius: '{dimension.borderradius.xl}',
            padding: '{dimension.padding.loose}',
            background: '{color.surfacecontainer.white100}',
        },
        slotConfigs: {
            text_title: {
                metaType: 'text',
                variant: 'h3',
                variantStyle: {
                    margin: '0',
                    fontSize: '{font.size.xl}',
                    fontWeight: '700',
                    color: '{color.onsurface.black100}',
                    lineHeight: '1.3',
                    justifyContent: 'center',
                }
            },
            text_subtitle: {
                metaType: 'text',
                variant: 'h4',
                variantStyle: {
                    margin: '0',
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '{color.basic.brand.1}',
                    lineHeight: '1.3',
                    borderBottom: 'none',
                    padding: '0',
                    textAlign: 'center',
                }
            },
            text_text: {
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    margin: '0',
                    fontSize: '{font.size.small}',
                    color: '{color.basic.opacity.black.64}',
                    lineHeight: '1.5',
                    textAlign: 'center',
                }
            }
        },
        slots: {
            text_title: { required: true, optional: false },
            text_subtitle: { required: false, optional: true },
            text_text: { required: false, optional: true }
        }
    },

    titleCenterCard: {
        type: 'template',
        layoutModes: [
            {
                name: 'default',
                condition: 'default',
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    position: 'relative',
                    containerType: 'inline-size',
                    gap: '0',
                    borderRadius: '{dimension.borderradius.xl}',
                    padding: '{dimension.padding.extraloose}',
                    background: '{color.surfacecontainer.white100}',
                    width: '100%'
                },
                structure: {
                    groups: [
                        {
                            name: 'subtitleBlock',
                            condition: 'has:text_subtitle',
                            type: 'template',
                            style: {
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                            },
                            slots: ['text_subtitle']
                        },
                        {
                            name: 'titleBlock',
                            type: 'template',
                            style: {
                                position: 'relative',
                                zIndex: '1',
                            },
                            slots: ['text_title']
                        }
                    ]
                }
            }
        ],
        style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            position: 'relative',
            borderRadius: '{dimension.borderradius.xl}',
            padding: '{dimension.padding.loose}',
            background: '{color.surfacecontainer.white100}',
        },
        slotConfigs: {
            text_subtitle: {
                metaType: 'text',
                variant: 'h4',
                variantStyle: {
                    margin: '0',
                    fontSize: 'min(80px, 15cqw)',
                    fontWeight: '700',
                    color: '{color.basic.brand.1}',
                    lineHeight: '1.3',
                    borderBottom: 'none',
                    padding: '0',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                }
            },
            text_title: {
                metaType: 'text',
                variant: 'h3',
                variantStyle: {
                    margin: '0',
                    fontSize: '{font.size.xl}',
                    fontWeight: '700',
                    color: '{color.onsurface.black100}',
                    lineHeight: '1.3',
                    justifyContent: 'center',
                }
            }
        },
        slots: {
            text_subtitle: { required: false, optional: true },
            text_title: { required: true, optional: false }
        }
    },
}

export default TEXT_CARD_STYLE
