import { COMMAND_SLOT_CONFIG } from './command';

const MEDIA_CARD_SERIES_STYLE = {
    // 🌄 主视觉说明卡
    heroCard: {
        type: 'template',
        hasUpdateEvent: true,
        layoutModes: [
            {
                name: 'withCover',
                condition: 'has:cover_image',
                style: {
                    display: 'flex',
                    flex: "1",
                    flexDirection: 'column',
                    borderRadius: '{dimension.borderradius.xxxxl}',
                    padding: '{dimension.padding.extraloose}',
                    color: '{color.onprimary.white100}',
                    position: 'relative',
                    overflow: 'hidden',
                    minHeight: '320px',
                    height: 'auto',
                    boxShadow: '{material.hierarchy.2f}'
                },
                structure: {
                    groups: [
                        {
                            name: 'coverLayer',
                            slots: ['cover_image'],
                            type: 'template',
                            style: {
                                position: 'absolute',
                                inset: '0',
                                zIndex: '0',
                                overflow: 'hidden',
                                borderRadius: '{dimension.borderradius.xxxl}',
                                padding: '0'
                            }
                        },
                        {
                            name: 'contentLayer',
                            type: 'template',
                            style: {
                                position: 'relative',
                                zIndex: '1',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '{dimension.gap.superloose}'
                            },
                            groups: [
                                {
                                    name: 'badgeRow',
                                    condition: 'has:badge',
                                    slots: ['badge'],
                                    type: 'template',
                                    style: {
                                        display: 'flex',
                                        flexDirection: 'row',
                                        gap: '{dimension.gap.tight}',
                                        flexWrap: 'wrap'
                                    }
                                },
                                {
                                    name: 'commandBlock',
                                    condition: 'has:command',
                                    slots: ['command*'],
                                    slotConsumeBefore: 'title',
                                    type: 'template',
                                    style: {
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '{dimension.gap.tight}'
                                    }
                                },
                                {
                                    name: 'titleBlock',
                                    slots: ['title']
                                },
                                {
                                    name: 'commandBlock',
                                    condition: 'has:command',
                                    slots: ['command*'],
                                    slotConsumeBetween: ['title', 'subtitle'],
                                    type: 'template',
                                    style: {
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '{dimension.gap.tight}'
                                    }
                                },
                                {
                                    name: 'subtitleBlock',
                                    condition: 'has:subtitle',
                                    slots: ['subtitle']
                                },
                                {
                                    name: 'commandBlock',
                                    condition: 'has:command',
                                    slots: ['command*'],
                                    slotConsumeAfter: 'subtitle',
                                    type: 'template',
                                    style: {
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '{dimension.gap.tight}'
                                    }
                                },
                                {
                                    name: 'metricsRow',
                                    condition: 'has:metrics',
                                    slots: ['metrics*'],
                                    type: 'template',
                                    style: {
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '{dimension.gap.tight}'
                                    }
                                },
                                {
                                    name: 'ctaRow',
                                    condition: 'has:cta_primary || has:cta_secondary',
                                    slots: ['cta_primary', 'cta_secondary'],
                                    type: 'template',
                                    style: {
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'flex-end',
                                        gap: '{dimension.gap.tight}',
                                        flexWrap: 'wrap'
                                    }
                                }
                            ]
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
                    gap: '{dimension.gap.superloose}',
                    flexDirection: 'column',
                    borderRadius: '{dimension.borderradius.xxxxl}',
                    padding: '{dimension.padding.extraloose}',
                    background: 'linear-gradient(135deg, {color.primary.brand6} 0%, {color.secondary.violet5} 60%, {color.surfacecontainer.black12} 100%)',
                    color: '{color.onprimary.white100}',
                    position: 'relative',
                    minHeight: '280px',
                    height: 'auto',
                    boxShadow: '{material.hierarchy.2f}'
                },
                structure: {
                    groups: [
                        {
                            name: 'badgeRow',
                            condition: 'has:badge',
                            slots: ['badge'],
                            type: 'template',
                            style: {
                                display: 'flex',
                                flexDirection: 'row',
                                gap: '{dimension.gap.tight}',
                                flexWrap: 'wrap'
                            }
                        },
                        {
                            name: 'commandBlock',
                            condition: 'has:command',
                            slots: ['command*'],
                            slotConsumeBefore: 'title',
                            type: 'template',
                            style: {
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '{dimension.gap.tight}'
                            }
                        },
                        {
                            name: 'titleBlock',
                            slots: ['title']
                        },
                        {
                            name: 'commandBlock',
                            condition: 'has:command',
                            slots: ['command*'],
                            slotConsumeBetween: ['title', 'subtitle'],
                            type: 'template',
                            style: {
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '{dimension.gap.tight}'
                            }
                        },
                        {
                            name: 'subtitleBlock',
                            condition: 'has:subtitle',
                            slots: ['subtitle']
                        },
                        {
                            name: 'commandBlock',
                            condition: 'has:command',
                            slots: ['command*'],
                            slotConsumeAfter: 'subtitle',
                            type: 'template',
                            style: {
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '{dimension.gap.tight}'
                            }
                        },
                        {
                            name: 'metricsRow',
                            condition: 'has:metrics',
                            slots: ['metrics*'],
                            type: 'template',
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '{dimension.gap.tight}'
                            }
                        },
                        {
                            name: 'ctaRow',
                            condition: 'has:cta_primary || has:cta_secondary',
                            slots: ['cta_primary', 'cta_secondary'],
                            type: 'template',
                            style: {
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                gap: '{dimension.gap.tight}',
                                flexWrap: 'wrap'
                            }
                        }
                    ]
                }
            }
        ],
        style: {
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '{dimension.borderradius.xxxxl}',
            padding: '{dimension.padding.extraloose}',
            background: 'linear-gradient(135deg, {color.primary.brand6} 0%, {color.secondary.violet5} 60%, {color.surfacecontainer.black12} 100%)',
            color: '{color.onprimary.white100}',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '280px',
            boxShadow: '{material.hierarchy.2f}'
        },
        slotConfigs: {
            cover_image: {
                type: 'template',
                style: {
                    position: 'absolute',
                    inset: '0',
                    zIndex: '0',
                    overflow: 'hidden',
                    padding: '0',
                    margin: '0'
                },
                metaType: 'image',
                variant: 'background',
                variantStyle: {
                    padding: '0',
                    margin: '0'
                }
            },
            badge: {
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    display: 'inline-block',
                    fontSize: '{font.size.tiny}',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '{color.basic.opacity.white.88}',
                    padding: '{dimension.padding.semitight} {dimension.padding.base}',
                    borderRadius: '{dimension.borderradius.full}',
                    backdropFilter: 'blur(10px)',
                    background: '{color.basic.opacity.white.16}',
                    margin: '0'
                }
            },
            title: {
                metaType: 'text',
                variant: 'heroTitle'
            },
            command: COMMAND_SLOT_CONFIG,
            'command*': COMMAND_SLOT_CONFIG,
            subtitle: {
                metaType: 'text',
                variant: 'heroSubtitle'
            },
            metrics: {
                metaType: 'text',
                variant: 'heroMetric'
            },
            cta_primary: {
                metaType: 'button',
                variant: 'primary',
                variantStyle: {
                    minWidth: '160px',
                    boxShadow: '{material.hierarchy.1f}'
                }
            },
            cta_secondary: {
                metaType: 'button',
                variant: 'secondary',
                variantStyle: {
                    minWidth: '160px',
                    background: 'transparent',
                    color: '{color.onprimary.white100}',
                    border: '1px solid rgba(255,255,255,0.5)'
                }
            }
        },
        slots: {
            cover_image: { required: false, optional: true, supportedAttributes: ['src', 'alt'] },
            badge: { required: false, optional: true },
            title: { required: true, optional: false },
            command: { required: false, optional: true },
            subtitle: { required: false, optional: true },
            metrics: { required: false, optional: true },
            cta_primary: { required: false, optional: true, supportedAttributes: ['href', 'target'] },
            cta_secondary: { required: false, optional: true, supportedAttributes: ['href', 'target'] }
        }
    },

    // 🖼️ 内容展示卡（可视媒体信息卡片）
    contentDisplayCard: {
        type: 'template',
        hasUpdateEvent: true,
        layoutModes: [
            {
                name: 'withImage',
                condition: 'has:image',
                style: {
                    display: 'flex',
                    flex: "1",
                    flexDirection: 'column',
                    gap: '{dimension.gap.superloose}',
                    borderRadius: '{dimension.borderradius.xl}',
                    padding: '{dimension.padding.loose}',
                    background: '{color.surfacecontainer.white100}',
                    boxShadow: '{material.hierarchy.1f}',
                    border: '{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}'
                },
                structure: {
                    groups: [
                        {
                            name: 'mediaBlock',
                            slots: ['image'],
                            type: 'template',
                            style: {
                                width: '100%',
                                borderRadius: '{dimension.borderradius.large}',
                                overflow: 'hidden',
                                aspectRatio: '4 / 3',
                                margin: 0,
                                padding: 0,
                                background: '{color.surfacecontainer.black7}'
                            }
                        },
                        {
                            name: 'contentBlock',
                            type: 'template',
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '{dimension.gap.semiloose}'
                            },
                            groups: [
                                {
                                    name: 'titleGroup',
                                    slots: ['title']
                                },
                                {
                                    name: 'subtitleGroup',
                                    condition: 'has:subtitle',
                                    slots: ['subtitle']
                                },
                                {
                                    name: 'commandBlock',
                                    condition: 'has:command',
                                    slots: ['command*'],
                                    type: 'template',
                                    style: {
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '{dimension.gap.tight}'
                                    }
                                },
                                {
                                    name: 'tagRow',
                                    condition: 'has:tags',
                                    slots: ['tags*'],
                                    type: 'template',
                                    style: {
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '{dimension.gap.tight}'
                                    }
                                },
                                {
                                    name: 'infoRow',
                                    condition: 'has:rating || has:location || has:price',
                                    type: 'template',
                                    style: {
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderRadius: '{dimension.borderradius.large}',
                                        background: '{color.primarycontainer.brand0}',
                                        margin: '{dimension.margin.semitight} 0',
                                        padding: '{dimension.padding.base}',
                                        gap: '{dimension.gap.base}'
                                    },
                                    groups: [
                                        {
                                            name: 'priceRow',
                                            condition: 'has:price',
                                            slots: ['price'],
                                            type: 'template',
                                            style: {
                                                display: 'flex',
                                                justifyContent: 'flex-start'
                                            }
                                        },
                                        {
                                            name: 'ratingLocationRow',
                                            condition: 'has:rating || has:location',
                                            slots: ['rating', 'location'],
                                            type: 'template',
                                            style: {
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '{dimension.gap.base}',
                                                flexWrap: 'wrap'
                                            }
                                        }
                                    ]
                                },
                                {
                                    name: 'ctaRow',
                                    condition: 'has:cta',
                                    slots: ['cta'],
                                    type: 'template',
                                    style: {
                                        display: 'flex',
                                        justifyContent: 'flex-start'
                                    }
                                }
                            ]
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
                    gap: '{dimension.gap.superloose}',
                    borderRadius: '{dimension.borderradius.xl}',
                    padding: '{dimension.padding.loose}',
                    background: '{color.surfacecontainer.white100}',
                    boxShadow: '{material.hierarchy.1f}',
                    border: '{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}'
                },
                structure: {
                    groups: [
                        {
                            name: 'contentBlock',
                            type: 'template',
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '{dimension.gap.semiloose}'
                            },
                            groups: [
                                {
                                    name: 'titleGroup',
                                    slots: ['title']
                                },
                                {
                                    name: 'subtitleGroup',
                                    condition: 'has:subtitle',
                                    slots: ['subtitle']
                                },
                                {
                                    name: 'commandBlock',
                                    condition: 'has:command',
                                    slots: ['command*'],
                                    type: 'template',
                                    style: {
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '{dimension.gap.tight}'
                                    }
                                },
                                {
                                    name: 'tagRow',
                                    condition: 'has:tags',
                                    slots: ['tags*'],
                                    type: 'template',
                                    style: {
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '{dimension.gap.tight}'
                                    }
                                },
                                {
                                    name: 'infoRow',
                                    condition: 'has:rating || has:location || has:price',
                                    type: 'template',
                                    style: {
                                        display: 'flex',
                                        flexDirection: 'column',
                                        borderRadius: '{dimension.borderradius.large}',
                                        background: '{color.primarycontainer.brand0}',
                                        margin: '{dimension.margin.semitight} 0',
                                        padding: '{dimension.padding.base}',
                                        gap: '{dimension.gap.base}'
                                    },
                                    groups: [
                                        {
                                            name: 'priceRow',
                                            condition: 'has:price',
                                            slots: ['price'],
                                            type: 'template',
                                            style: {
                                                display: 'flex',
                                                justifyContent: 'flex-start'
                                            }
                                        },
                                        {
                                            name: 'ratingLocationRow',
                                            condition: 'has:rating || has:location',
                                            slots: ['rating', 'location'],
                                            type: 'template',
                                            style: {
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '{dimension.gap.base}',
                                                flexWrap: 'wrap'
                                            }
                                        }
                                    ],
                                },
                                {
                                    name: 'ctaRow',
                                    condition: 'has:cta',
                                    slots: ['cta'],
                                    type: 'template',
                                    style: {
                                        display: 'flex',
                                        justifyContent: 'flex-start'
                                    }
                                }
                            ]
                        }
                    ]
                }
            }
        ],
        style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '{dimension.gap.superloose}',
            borderRadius: '{dimension.borderradius.xl}',
            padding: '{dimension.padding.loose}',
            background: '{color.surfacecontainer.white100}',
            boxShadow: '{material.hierarchy.1f}',
            border: '{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}',
        },
        slotConfigs: {
            image: {
                metaType: 'image',
                variant: 'cover',
                variantStyle: {
                    width: '100%',
                    height: '100%',
                    margin: 0,
                    padding: 0,
                    objectFit: 'cover',
                    display: 'block'
                },
                supportedAttributes: ['src', 'alt']
            },
            command: COMMAND_SLOT_CONFIG,
            'command*': COMMAND_SLOT_CONFIG,
            title: {
                metaType: 'text',
                variant: 'h3',
                variantStyle: {
                    margin: '0',
                    fontSize: '{font.size.xxl}',
                    fontWeight: '{font.fontweight.bold}',
                    color: '{color.basic.opacity.black.100}'
                }
            },
            subtitle: {
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    margin: '0',
                    fontSize: '{font.size.medium}',
                    color: '{color.basic.opacity.black.48}',
                    lineHeight: '1.5'
                }
            },
            tags: {
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    margin: '0',
                    fontSize: '{font.size.tiny}',
                    fontWeight: '{font.fontweight.semibold}',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    color: '{color.primary.brand4}',
                    background: '{color.primarycontainer.brand0}',
                    padding: '{dimension.padding.supertight} {dimension.padding.tight}',
                    borderRadius: '{dimension.borderradius.large}'
                }
            },
            rating: {
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    margin: '0',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '{dimension.gap.tight}',
                    fontSize: '{font.size.small}',
                    fontWeight: '{font.fontweight.semibold}',
                    color: '{color.onsurface.black88}'
                }
            },
            price: {
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    margin: '0',
                    fontSize: '{font.size.xl}',
                    fontWeight: '{font.fontweight.bold}',
                    color: '{color.basic.brand.7}'
                }
            },
            location: {
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    margin: '0',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '{dimension.gap.tight}',
                    fontSize: '{font.size.small}',
                    color: '{color.onsurface.black64}'
                }
            },
            cta: {
                metaType: 'button',
                variant: 'primary',
                variantStyle: {
                    minWidth: '140px',
                    padding: '{dimension.padding.base} {dimension.padding.loose}',
                    borderRadius: '{dimension.borderradius.large}',
                    fontWeight: '{font.fontweight.bold}'
                },
                supportedAttributes: ['href', 'target']
            }
        },
        slots: {
            image: { required: false, optional: true, supportedAttributes: ['src', 'alt'] },
            command: { required: false, optional: true },
            title: { required: true, optional: false },
            subtitle: { required: false, optional: true },
            tags: { required: false, optional: true },
            rating: { required: false, optional: true },
            price: { required: false, optional: true },
            location: { required: false, optional: true },
            cta: { required: false, optional: true, supportedAttributes: ['href', 'target'] }
        }
    },

    // 🎯 操作与引导卡（Action / CTA Card）
    actionCard: {
        type: 'template',
        hasUpdateEvent: true,
        layoutModes: [
            {
                name: 'withIcon',
                condition: 'has:icon',
                style: {
                    display: 'flex',
                    flex: "1",
                    flexDirection: 'column',
                    gap: '{dimension.gap.base}',
                    borderRadius: '{dimension.borderradius.xl}',
                    padding: '{dimension.padding.loose}',
                    background: '{color.surfacecontainer.white100}',
                    boxShadow: '{material.hierarchy.1f}',
                    border: '{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}'
                },
                structure: {
                    groups: [
                        {
                            name: 'headerRow',
                            type: 'template',
                            style: {
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'flex-start',
                                gap: '{dimension.gap.base}'
                            },
                            groups: [
                                {
                                    name: 'iconBlock',
                                    slots: ['icon'],
                                    type: 'template',
                                    style: {
                                        flexShrink: '0'
                                    }
                                },
                                {
                                    name: 'contentBlock',
                                    type: 'template',
                                    style: {
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '{dimension.gap.supertight}',
                                        flex: '1'
                                    },
                                    groups: [
                                        {
                                            name: 'badgeRow',
                                            condition: 'has:badge',
                                            slots: ['badge'],
                                            type: 'template',
                                            style: {
                                                display: 'flex',
                                                flexDirection: 'row',
                                                gap: '{dimension.gap.tight}',
                                                flexWrap: 'wrap'
                                            }
                                        },
                                        {
                                            name: 'titleBlock',
                                            slots: ['title']
                                        },
                                        {
                                            name: 'descriptionBlock',
                                            condition: 'has:description',
                                            slots: ['description']
                                        },
                                        {
                                            name: 'commandBlock',
                                            condition: 'has:command',
                                            slots: ['command*'],
                                            type: 'template',
                                            style: {
                                                width: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '{dimension.gap.tight}'
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            name: 'ctaRow',
                            condition: 'has:cta_primary || has:cta_secondary',
                            slots: ['cta_primary', 'cta_secondary'],
                            type: 'template',
                            style: {
                                display: 'flex',
                                flexDirection: 'row',
                                gap: '{dimension.gap.tight}',
                                flexWrap: 'wrap',
                                marginTop: '{dimension.margin.tight}'
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
                    gap: '{dimension.gap.base}',
                    borderRadius: '{dimension.borderradius.xl}',
                    padding: '{dimension.padding.loose}',
                    background: '{color.surfacecontainer.white100}',
                    boxShadow: '{material.hierarchy.1f}',
                    border: '{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}'
                },
                structure: {
                    groups: [
                        {
                            name: 'badgeRow',
                            condition: 'has:badge',
                            slots: ['badge'],
                            type: 'template',
                            style: {
                                display: 'flex',
                                flexDirection: 'row',
                                gap: '{dimension.gap.tight}',
                                flexWrap: 'wrap'
                            }
                        },
                        {
                            name: 'titleBlock',
                            slots: ['title']
                        },
                        {
                            name: 'commandBlock',
                            condition: 'has:command',
                            slots: ['command*'],
                            type: 'template',
                            style: {
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '{dimension.gap.tight}'
                            }
                        },
                        {
                            name: 'descriptionBlock',
                            condition: 'has:description',
                            slots: ['description']
                        },
                        {
                            name: 'commandBlock',
                            condition: 'has:command',
                            slots: ['command*'],
                            type: 'template',
                            style: {
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '{dimension.gap.tight}'
                            }
                        },
                        {
                            name: 'ctaRow',
                            condition: 'has:cta_primary || has:cta_secondary',
                            slots: ['cta_primary', 'cta_secondary'],
                            type: 'template',
                            style: {
                                display: 'flex',
                                flexDirection: 'row',
                                gap: '{dimension.gap.tight}',
                                flexWrap: 'wrap',
                                marginTop: '{dimension.margin.tight}'
                            }
                        }
                    ]
                }
            }
        ],
        style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '{dimension.gap.base}',
            borderRadius: '{dimension.borderradius.xl}',
            padding: '{dimension.padding.loose}',
            background: '{color.surfacecontainer.white100}',
            boxShadow: '{material.hierarchy.1f}',
            border: '{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}'
        },
        slotConfigs: {
            icon: {
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    margin: '0',
                    fontSize: '{font.size.xxxl}',
                    lineHeight: '1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '56px',
                    height: '56px',
                    borderRadius: '{dimension.borderradius.large}',
                    background: '{color.surfacecontainer.black4}',
                    flexShrink: '0'
                }
            },
            badge: {
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    fontSize: '{font.size.tiny}',
                    fontWeight: '{font.fontweight.semibold}',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    padding: '{dimension.padding.supertight} {dimension.padding.tight}',
                    borderRadius: '{dimension.borderradius.large}',
                    background: '{color.surfacecontainer.black4}',
                    color: '{color.onsurface.black76}',
                    margin: '0'
                }
            },
            title: {
                metaType: 'text',
                variant: 'h3',
                variantStyle: {
                    margin: '0',
                    fontSize: '{font.size.xl}',
                    fontWeight: '{font.fontweight.bold}',
                    color: '{color.onsurface.black88}',
                    lineHeight: '1.3'
                }
            },
            command: COMMAND_SLOT_CONFIG,
            'command*': COMMAND_SLOT_CONFIG,
            description: {
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    margin: '0',
                    fontSize: '{font.size.medium}',
                    color: '{color.onsurface.black64}',
                    lineHeight: '1.6'
                }
            },
            cta_primary: {
                metaType: 'button',
                variant: 'primary',
                variantStyle: {
                    minWidth: '140px',
                    padding: '{dimension.padding.base} {dimension.padding.loose}',
                    borderRadius: '{dimension.borderradius.large}',
                    fontWeight: '{font.fontweight.bold}',
                    boxShadow: '{material.hierarchy.1f}'
                }
            },
            cta_secondary: {
                metaType: 'button',
                variant: 'secondary',
                variantStyle: {
                    minWidth: '140px',
                    padding: '{dimension.padding.base} {dimension.padding.loose}',
                    borderRadius: '{dimension.borderradius.large}',
                    fontWeight: '{font.fontweight.semibold}'
                }
            }
        },
        slots: {
            icon: { required: false, optional: true },
            badge: { required: false, optional: true },
            title: { required: true, optional: false },
            command: { required: false, optional: true },
            description: { required: false, optional: true },
            cta_primary: { required: false, optional: true, supportedAttributes: ['href', 'target'] },
            cta_secondary: { required: false, optional: true, supportedAttributes: ['href', 'target'] }
        }
    },

    // 📅 事件/活动卡（Event / Announcement Card）
    eventCard: {
        type: 'template',
        hasUpdateEvent: true,
        layoutModes: [
            {
                name: 'withImage',
                condition: 'has:image',
                style: {
                    display: 'flex',
                    flex: "1",
                    flexDirection: 'column',
                    gap: '{dimension.gap.base}',
                    borderRadius: '{dimension.borderradius.xl}',
                    padding: '0',
                    background: '{color.surfacecontainer.white100}',
                    boxShadow: '{material.hierarchy.1f}',
                    border: '{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}',
                    overflow: 'hidden'
                },
                structure: {
                    groups: [
                        {
                            name: 'imageBlock',
                            slots: ['image'],
                            type: 'template',
                            style: {
                                width: '100%',
                                borderRadius: '{dimension.borderradius.xl} {dimension.borderradius.xl} 0 0',
                                overflow: 'hidden',
                                aspectRatio: '16 / 9',
                                background: '{color.surfacecontainer.black7}',
                                position: 'relative'
                            }
                        },
                        {
                            name: 'contentBlock',
                            type: 'template',
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '{dimension.gap.base}',
                                padding: '{dimension.padding.loose}'
                            },
                            groups: [
                                {
                                    name: 'tagRow',
                                    condition: 'has:tag',
                                    slots: ['tag'],
                                    type: 'template',
                                    style: {
                                        display: 'flex',
                                        flexDirection: 'row',
                                        gap: '{dimension.gap.tight}',
                                        flexWrap: 'wrap'
                                    }
                                },
                                {
                                    name: 'titleBlock',
                                    slots: ['event_title']
                                },
                                {
                                    name: 'timeBlock',
                                    condition: 'has:event_time',
                                    slots: ['event_time']
                                },
                                {
                                    name: 'commandBlock',
                                    condition: 'has:command',
                                    slots: ['command*'],
                                    type: 'template',
                                    style: {
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '{dimension.gap.tight}'
                                    }
                                },
                                {
                                    name: 'ctaRow',
                                    condition: 'has:cta',
                                    slots: ['cta'],
                                    type: 'template',
                                    style: {
                                        display: 'flex',
                                        marginTop: '{dimension.margin.tight}'
                                    }
                                }
                            ]
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
                    gap: '{dimension.gap.base}',
                    borderRadius: '{dimension.borderradius.xl}',
                    padding: '{dimension.padding.loose}',
                    background: '{color.surfacecontainer.white100}',
                    boxShadow: '{material.hierarchy.1f}',
                    border: '{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}'
                },
                structure: {
                    groups: [
                        {
                            name: 'tagRow',
                            condition: 'has:tag',
                            slots: ['tag'],
                            type: 'template',
                            style: {
                                display: 'flex',
                                flexDirection: 'row',
                                gap: '{dimension.gap.tight}',
                                flexWrap: 'wrap'
                            }
                        },
                        {
                            name: 'titleBlock',
                            slots: ['event_title']
                        },
                        {
                            name: 'timeBlock',
                            condition: 'has:event_time',
                            slots: ['event_time']
                        },
                        {
                            name: 'commandBlock',
                            condition: 'has:command',
                            slots: ['command*'],
                            type: 'template',
                            style: {
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '{dimension.gap.tight}'
                            }
                        },
                        {
                            name: 'ctaRow',
                            condition: 'has:cta',
                            slots: ['cta'],
                            type: 'template',
                            style: {
                                display: 'flex',
                                marginTop: '{dimension.margin.tight}'
                            }
                        }
                    ]
                }
            }
        ],
        style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '{dimension.gap.base}',
            borderRadius: '{dimension.borderradius.xl}',
            padding: '{dimension.padding.loose}',
            background: '{color.surfacecontainer.white100}',
            boxShadow: '{material.hierarchy.1f}',
            border: '{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}'
        },
        slotConfigs: {
            image: {
                metaType: 'image',
                variant: 'cover',
                variantStyle: {
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    padding: '0',
                    margin: '0'
                },
                supportedAttributes: ['src', 'alt']
            },
            tag: {
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    fontSize: '{font.size.tiny}',
                    fontWeight: '{font.fontweight.semibold}',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    padding: '{dimension.padding.supertight} {dimension.padding.tight}',
                    borderRadius: '{dimension.borderradius.large}',
                    background: '{color.primary.brand1}',
                    color: '{color.primary.brand6}',
                    margin: '0'
                }
            },
            event_title: {
                metaType: 'text',
                variant: 'h3',
                variantStyle: {
                    margin: '0',
                    fontSize: '{font.size.xl}',
                    fontWeight: '{font.fontweight.bold}',
                    color: '{color.onsurface.black88}',
                    lineHeight: '1.3'
                }
            },
            command: COMMAND_SLOT_CONFIG,
            'command*': COMMAND_SLOT_CONFIG,
            event_time: {
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    margin: '0',
                    fontSize: '{font.size.medium}',
                    color: '{color.onsurface.black64}',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '{dimension.gap.supertight}'
                }
            },
            cta: {
                metaType: 'button',
                variant: 'primary',
                variantStyle: {
                    minWidth: '140px',
                    padding: '{dimension.padding.base} {dimension.padding.loose}',
                    borderRadius: '{dimension.borderradius.large}',
                    fontWeight: '{font.fontweight.bold}'
                },
                supportedAttributes: ['href', 'target']
            }
        },
        slots: {
            image: { required: false, optional: true, supportedAttributes: ['src', 'alt'] },
            tag: { required: false, optional: true },
            event_title: { required: true, optional: false },
            command: { required: false, optional: true },
            event_time: { required: false, optional: true },
            cta: { required: false, optional: true, supportedAttributes: ['href', 'target'] }
        }
    },

    // 🔔 系统状态卡（System Status / Update Card）
    statusCard: {
        type: 'template',
        hasUpdateEvent: true,
        // 使用 progress 插槽内容作为参数，驱动进度条宽度
        parameters: {
            progressValue: {
                source: 'progress',              // 从 <progress>65%</progress> 中取值
                expression: 'replace(\"%\", \"\")' // 去掉百分号，只保留数字
            }
        },
        layoutModes: [
            {
                name: 'withProgress',
                condition: 'has:progress',
                style: {
                    display: 'flex',
                    flex: "1",
                    flexDirection: 'column',
                    gap: '{dimension.gap.base}',
                    borderRadius: '{dimension.borderradius.xl}',
                    padding: '{dimension.padding.loose}',
                    background: '{color.surfacecontainer.white100}',
                    boxShadow: '{material.hierarchy.1f}',
                    border: '{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}'
                },
                structure: {
                    groups: [
                        {
                            name: 'statusHeader',
                            type: 'template',
                            style: {
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'top',
                                gap: '{dimension.gap.base}',
                                flexWrap: 'wrap'
                            },
                            groups: [
                                {
                                    name: 'statusMessage',
                                    type: 'template',
                                    style: {
                                        display: 'flex',
                                        flexDirection: 'column',
                                    },
                                    groups: [{
                                        name: 'statusTypeBlock',
                                        slots: ['status_type'],
                                        type: 'template',
                                        style: {
                                            flexShrink: '0'
                                        }
                                    }, {
                                        name: 'messageBlock',
                                        slots: ['message'],
                                        type: 'template',
                                        style: {
                                            flex: '1'
                                        }
                                    }]
                                },
                                {
                                    name: 'timestampBlock',
                                    condition: 'has:timestamp',
                                    slots: ['timestamp']
                                }
                            ]
                        },
                        {
                            name: 'progressBlock',
                            slots: ['progress'],
                            type: 'template',
                            style: {
                                marginTop: '{dimension.margin.tight}'
                            }
                        },
                        {
                            name: 'commandBlock',
                            condition: 'has:command',
                            slots: ['command*'],
                            type: 'template',
                            style: {
                                width: '100%',
                                marginTop: '{dimension.margin.tight}',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '{dimension.gap.tight}'
                            }
                        },
                        {
                            name: 'footerRow',
                            type: 'template',
                            style: {
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '{dimension.gap.base}',
                                flexWrap: 'wrap',
                                marginTop: '{dimension.margin.tight}'
                            },
                            groups: [
                                {
                                    name: 'ctaBlock',
                                    condition: 'has:cta',
                                    slots: ['cta']
                                }
                            ]
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
                    gap: '{dimension.gap.base}',
                    borderRadius: '{dimension.borderradius.xl}',
                    padding: '{dimension.padding.loose}',
                    background: '{color.surfacecontainer.white100}',
                    boxShadow: '{material.hierarchy.1f}',
                    border: '{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}'
                },
                structure: {
                    groups: [
                        {
                            name: 'statusHeader',
                            type: 'template',
                            style: {
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'top',
                                gap: '{dimension.gap.base}',
                                flexWrap: 'wrap'
                            },
                            groups: [
                                {
                                    name: 'statusMessage',
                                    type: 'template',
                                    style: {
                                        display: 'flex',
                                        flexDirection: 'column',
                                    },
                                    groups: [{
                                        name: 'statusTypeBlock',
                                        slots: ['status_type'],
                                        type: 'template',
                                        style: {
                                            flexShrink: '0'
                                        }
                                    }, {
                                        name: 'messageBlock',
                                        slots: ['message'],
                                        type: 'template',
                                        style: {
                                            flex: '1'
                                        }
                                    }]
                                },
                                {
                                    name: 'timestampBlock',
                                    condition: 'has:timestamp',
                                    slots: ['timestamp']
                                }
                            ]
                        },
                        {
                            name: 'progressBlock',
                            slots: ['progress'],
                            type: 'template',
                            style: {
                                marginTop: '{dimension.margin.tight}'
                            }
                        },
                        {
                            name: 'commandBlock',
                            condition: 'has:command',
                            slots: ['command*'],
                            type: 'template',
                            style: {
                                width: '100%',
                                marginTop: '{dimension.margin.tight}',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '{dimension.gap.tight}'
                            }
                        },
                        {
                            name: 'footerRow',
                            type: 'template',
                            style: {
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '{dimension.gap.base}',
                                flexWrap: 'wrap',
                                marginTop: '{dimension.margin.tight}'
                            },
                            groups: [
                                {
                                    name: 'ctaBlock',
                                    condition: 'has:cta',
                                    slots: ['cta']
                                }
                            ]
                        }
                    ]
                }
            }
        ],
        style: {
            '--status-progress': '$progressValue',
            display: 'flex',
            flexDirection: 'column',
            gap: '{dimension.gap.base}',
            borderRadius: '{dimension.borderradius.xl}',
            padding: '{dimension.padding.loose}',
            background: '{color.surfacecontainer.white100}',
            boxShadow: '{material.hierarchy.1f}',
            border: '{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}'
        },
        slotConfigs: {
            status_type: {
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    margin: '0',
                    fontSize: '{font.size.small}',
                    fontWeight: '{font.fontweight.bold}',
                    // 默认样式（成功）
                    color: '{color.basic.brand.6}'
                }
            },
            message: {
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    margin: '0',
                    fontSize: '{font.size.medium}',
                    color: '{color.onsurface.black88}',
                    lineHeight: '1.5'
                }
            },
            command: COMMAND_SLOT_CONFIG,
            'command*': COMMAND_SLOT_CONFIG,
            progress: {
                type: 'template',
                style: {
                    width: '100%',
                    height: '8px',
                    background: '{color.surfacecontainer.black7}',
                    borderRadius: '{dimension.borderradius.large}',
                    overflow: 'hidden',
                    position: 'relative'
                },
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    margin: '0',
                    fontSize: '{font.size.tiny}',
                    color: '{color.onsurface.black64}',
                    // 进度条填充部分，通过 CSS 变量控制宽度
                    display: 'block',
                    height: '100%',
                    background: 'linear-gradient({dimension.basic.deg.135}, {color.basic.violet.5} {dimension.basic.percent.0}, {color.basic.blue.5} {dimension.basic.percent.100})',
                    borderRadius: 'inherit',
                    transition: 'width 0.3s ease',
                    // 使用 statusCard 根上的 --status-progress（0-100），映射到宽度百分比
                    width: 'calc(var(--status-progress, 0) * 1%)'
                }
            },
            timestamp: {
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    margin: '0',
                    fontSize: '{font.size.tiny}',
                    color: '{color.onsurface.black48}',
                    letterSpacing: '0.04em'
                }
            },
            cta: {
                metaType: 'button',
                variant: 'secondary',
                variantStyle: {
                    minWidth: '100px',
                    padding: '{dimension.padding.supertight} {dimension.padding.base}',
                    borderRadius: '{dimension.borderradius.large}',
                    fontSize: '{font.size.small}',
                    fontWeight: '{font.fontweight.semibold}'
                },
                supportedAttributes: ['href', 'target']
            }
        },
        slots: {
            status_type: { required: true, optional: false },
            message: { required: true, optional: false },
            command: { required: false, optional: true },
            progress: { required: false, optional: true },
            timestamp: { required: false, optional: true },
            cta: { required: false, optional: true, supportedAttributes: ['href', 'target'] }
        }
    },

    // 📊 表格卡片（Table Card）
    tableCard: {
        type: 'template',
        hasUpdateEvent: true,
        layoutModes: [
            {
                name: 'full',
                condition: 'has:title || has:subtitle || has:description || has:icon || has:badge || has:command',
                style: {
                    display: 'flex',
                    width: '100%',
                    flex: "1",
                    flexDirection: 'column',
                    gap: '{dimension.gap.base}',
                    borderRadius: '{dimension.borderradius.xl}',
                    padding: '{dimension.padding.loose}',
                    background: '{color.surfacecontainer.white100}',
                    boxShadow: '{material.hierarchy.1f}',
                    border: '{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}'
                },
                structure: {
                    groups: [
                        {
                            name: 'headerSection',
                            condition: 'has:title || has:subtitle || has:icon || has:badge',
                            type: 'template',
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '{dimension.gap.tight}',
                                marginBottom: '{dimension.margin.base}'
                            },
                            groups: [
                                {
                                    name: 'headerRow',
                                    type: 'template',
                                    style: {
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'flex-start',
                                        gap: '{dimension.gap.base}',
                                        flexWrap: 'wrap'
                                    },
                                    groups: [
                                        {
                                            name: 'iconBlock',
                                            condition: 'has:icon',
                                            slots: ['icon'],
                                            type: 'template',
                                            style: {
                                                flexShrink: '0'
                                            }
                                        },
                                        {
                                            name: 'titleBlock',
                                            type: 'template',
                                            style: {
                                                flex: '1',
                                                minWidth: '0'
                                            },
                                            groups: [
                                                {
                                                    name: 'badgeRow',
                                                    condition: 'has:badge',
                                                    slots: ['badge'],
                                                    type: 'template',
                                                    style: {
                                                        marginBottom: '{dimension.margin.supertight}'
                                                    }
                                                },
                                                {
                                                    name: 'titleRow',
                                                    condition: 'has:title',
                                                    slots: ['title'],
                                                    type: 'template'
                                                },
                                                {
                                                    name: 'subtitleRow',
                                                    condition: 'has:subtitle',
                                                    slots: ['subtitle'],
                                                    type: 'template'
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    name: 'descriptionBlock',
                                    condition: 'has:description',
                                    slots: ['description'],
                                    type: 'template',
                                    style: {
                                        marginTop: '{dimension.margin.supertight}'
                                    }
                                },
                                {
                                    name: 'commandBlock',
                                    condition: 'has:command',
                                    slots: ['command*'],
                                    type: 'template',
                                    style: {
                                        width: '100%',
                                        marginTop: '{dimension.margin.tight}',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '{dimension.gap.tight}'
                                    }
                                }
                            ]
                        },
                        {
                            name: 'tableBlock',
                            slots: ['table'],
                            type: 'template',
                            style: {
                                width: '100%',
                                overflowX: 'auto',
                                marginTop: '{dimension.margin.tight}'
                            }
                        },
                        {
                            name: 'footerSection',
                            condition: 'has:footer',
                            slots: ['footer'],
                            type: 'template',
                            style: {
                                marginTop: '{dimension.margin.base}',
                                paddingTop: '{dimension.padding.base}',
                                borderTop: '1px solid {color.surfacecontainer.black8}'
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
                    width: '100%',
                    flex: "1",
                    flexDirection: 'column',
                    gap: '{dimension.gap.base}',
                    borderRadius: '{dimension.borderradius.xl}',
                    padding: '{dimension.padding.loose}',
                    background: '{color.surfacecontainer.white100}',
                    boxShadow: '{material.hierarchy.1f}',
                    border: '{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}'
                },
                structure: {
                    groups: [
                        {
                            name: 'tableBlock',
                            slots: ['table'],
                            type: 'template',
                            style: {
                                width: '100%',
                                overflowX: 'auto'
                            }
                        }
                    ]
                }
            }
        ],
        style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '{dimension.gap.base}',
            borderRadius: '{dimension.borderradius.xl}',
            padding: '{dimension.padding.loose}',
            background: '{color.surfacecontainer.white100}',
            boxShadow: '{material.hierarchy.1f}',
            border: '{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}'
        },
        slotConfigs: {
            icon: {
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    margin: '0',
                    fontSize: '{font.size.xxl}',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '48px',
                    height: '48px',
                    borderRadius: '{dimension.borderradius.large}',
                    background: '{color.primary.brand1}',
                    color: '{color.primary.brand6}',
                    flexShrink: '0'
                }
            },
            badge: {
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    margin: '0',
                    fontSize: '{font.size.tiny}',
                    fontWeight: '{font.fontweight.semibold}',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    padding: '{dimension.padding.supertight} {dimension.padding.tight}',
                    borderRadius: '{dimension.borderradius.large}',
                    background: '{color.primary.brand1}',
                    color: '{color.primary.brand6}',
                    display: 'inline-block'
                }
            },
            title: {
                metaType: 'text',
                variant: 'h4',
                variantStyle: {
                    margin: '0',
                    fontSize: '{font.size.large}',
                    fontWeight: '{font.fontweight.semibold}',
                    color: '{color.onsurface.black88}',
                    lineHeight: '1.3'
                }
            },
            subtitle: {
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    margin: '0',
                    fontSize: '{font.size.medium}',
                    color: '{color.onsurface.black64}',
                    lineHeight: '1.5',
                    marginTop: '{dimension.margin.supertight}'
                }
            },
            description: {
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    margin: '0',
                    fontSize: '{font.size.small}',
                    color: '{color.onsurface.black64}',
                    lineHeight: '1.6'
                }
            },
            command: COMMAND_SLOT_CONFIG,
            'command*': COMMAND_SLOT_CONFIG,
            table: {
                type: 'template',
                metaType: 'table',
                variant: 'container',
                style: {
                    width: '100%',
                    margin: '0'
                }
            },
            footer: {
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    margin: '0',
                    fontSize: '{font.size.small}',
                    color: '{color.onsurface.black48}',
                    lineHeight: '1.5'
                }
            }
        },
        slots: {
            icon: { required: false, optional: true },
            badge: { required: false, optional: true },
            title: { required: false, optional: true },
            subtitle: { required: false, optional: true },
            description: { required: false, optional: true },
            command: { required: false, optional: true },
            table: { required: true, optional: false },
            footer: { required: false, optional: true }
        }
    },

    // 🗞️ 信息列表卡（Feed / List）
    feedListCard: {
        type: 'template',
        hasUpdateEvent: true,
        layoutModes: [
            {
                name: 'default',
                condition: 'default',
                style: {
                    display: 'flex',
                    flex: "1",
                    width: '100%',
                    flexDirection: 'column',
                    gap: '{dimension.gap.base}',
                    padding: '{dimension.padding.loose}',
                    borderRadius: '{dimension.borderradius.xl}',
                    background: '{color.surfacecontainer.white100}',
                    boxShadow: '{material.hierarchy.1f}',
                    border: '{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}'
                },
                structure: {
                    groups: [
                        {
                            name: 'header',
                            condition: 'has:title || has:subtitle',
                            slots: ['title', 'subtitle'],
                            type: 'template',
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '{dimension.gap.supertight}'
                            }
                        },
                        {
                            name: 'commandBlock',
                            condition: 'has:command',
                            slots: ['command*'],
                            type: 'template',
                            style: {
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '{dimension.gap.tight}'
                            }
                        },
                        {
                            name: 'listGroup',
                            condition: 'has:items',
                            slots: ['items*'],
                            type: 'template',
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '{dimension.gap.tight}'
                            }
                        }
                    ]
                }
            }
        ],
        style: {
            display: 'flex',
            flex: "1",
            width: '100%',
            flexDirection: 'column',
            gap: '{dimension.gap.base}',
            padding: '{dimension.padding.loose}',
            borderRadius: '{dimension.borderradius.xl}',
            background: '{color.surfacecontainer.white100}',
            boxShadow: '{material.hierarchy.1f}',
            border: '{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}'
        },
        slotConfigs: {
            title: {
                metaType: 'text',
                variant: 'h4',
                variantStyle: {
                    margin: '0',
                    color: '{color.onsurface.black88}'
                }
            },
            subtitle: {
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    margin: '0',
                    color: '{color.onsurface.black64}',
                    fontSize: '{font.size.small}'
                }
            },
            command: COMMAND_SLOT_CONFIG,
            'command*': COMMAND_SLOT_CONFIG,
            items: {
                type: 'template',
                metaType: 'feedItem',
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '{dimension.gap.tight}',
                    padding: '{dimension.padding.tight} 0',
                    borderBottom: '1px solid {color.surfacecontainer.black7}'
                },
                itemStyles: {
                    row: {
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '{dimension.gap.base}',
                        alignItems: 'flex-start'
                    },
                    leading: {
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: '{dimension.gap.supertight}'
                    },
                    avatar: {
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        background: '{color.surfacecontainer.black4}',
                        flexShrink: '0'
                    },
                    content: {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '{dimension.gap.supertight}',
                        flex: '1'
                    },
                    textRow: {
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        gap: '{dimension.gap.supertight}'
                    },
                    icon: {
                        margin: '0',
                        fontSize: '{font.size.medium}',
                        color: '{color.primary.brand5}'
                    },
                    text: {
                        margin: '0',
                        fontSize: '{font.size.medium}',
                        color: '{color.onsurface.black88}',
                        lineHeight: '1.5'
                    },
                    timestamp: {
                        margin: '0',
                        fontSize: '{font.size.tiny}',
                        color: '{color.onsurface.black64}',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase'
                    },
                    meta: {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        gap: '{dimension.gap.supertight}',
                        marginLeft: '{dimension.margin.tight}'
                    },
                    ctaVariant: 'link'
                },
                subSlots: {
                    avatar: {
                        metaType: 'image',
                        variant: 'avatar',
                        variantStyle: {
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            objectFit: 'cover'
                        }
                    },
                    icon: {
                        metaType: 'text',
                        variant: 'p',
                        variantStyle: {
                            margin: '0',
                            fontSize: '{font.size.medium}',
                            color: '{color.primary.brand5}'
                        }
                    },
                    text: {
                        metaType: 'text',
                        variant: 'p',
                        variantStyle: {
                            margin: '0',
                            fontSize: '{font.size.medium}',
                            color: '{color.onsurface.black88}',
                            lineHeight: '1.5'
                        }
                    },
                    timestamp: {
                        metaType: 'text',
                        variant: 'p',
                        variantStyle: {
                            margin: '0',
                            fontSize: '{font.size.tiny}',
                            color: '{color.onsurface.black64}',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase'
                        }
                    },
                    cta_inline: {
                        metaType: 'button',
                        variant: 'link',
                        variantStyle: {
                            fontSize: '{font.size.small}',
                            fontWeight: '{font.fontweight.semibold}',
                            textDecoration: 'none'
                        }
                    }
                },
                itemLayout: [
                    {
                        name: 'leading',
                        condition: 'has:avatar',
                        style: {
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: '{dimension.gap.supertight}',
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            background: '{color.surfacecontainer.black4}',
                            flexShrink: '0'
                        },
                        slots: ['avatar']
                    },
                    {
                        name: 'content',
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '{dimension.gap.supertight}',
                            flex: '1'
                        },
                        slotGroups: [
                            {
                                name: 'textRow',
                                style: {
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'flex-start',
                                    gap: '{dimension.gap.supertight}'
                                },
                                slots: ['icon', 'text']
                            }
                        ]
                    },
                    {
                        name: 'meta',
                        condition: 'has:timestamp || has:cta_inline',
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            gap: '{dimension.gap.supertight}',
                            marginLeft: '{dimension.margin.tight}'
                        },
                        slots: ['timestamp', 'cta_inline']
                    }
                ]
            }
        },
        slots: {
            title: { required: false, optional: true },
            subtitle: { required: false, optional: true },
            command: { required: false, optional: true },
            items: {
                required: true,
                optional: false,
                supportedAttributes: ['avatar', 'icon', 'timestamp', 'cta_label', 'cta_href', 'cta_variant']
            }
        }
    },
}


export default MEDIA_CARD_SERIES_STYLE