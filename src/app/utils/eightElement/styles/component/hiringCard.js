const HIRING_CARD_STYLE = {
    // Hiring Title Card
    hiringTitleCard: {
        type: 'template',
        hasUpdateEvent: true,
        layoutModes: [{
            name: 'default',
            condition: 'default',
            style: {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                borderRadius: '{dimension.borderradius.xxxxl}',
                background: '{color.basic.brand.5}',
                padding: '{dimension.padding.superloose}',
            },
            structure: {
                groups: [{
                    name: 'titleBlock',
                    slots: ['title', 'desc'],
                    type: 'template',
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '{dimension.gap.tight}',
                    }
                }, {
                    name: 'badgeBlock',
                    slots: ['badge'],
                }]
            }
        }],
        slotConfigs: {
            title: {
                metaType: 'text',
                variantStyle: {
                    lineHeight: '1',
                    fontSize: '{font.size.xxxl}',
                    fontWeight: '{font.fontweight.bold}',
                    color: '{color.basic.opacity.white.100}',
                }
            },
            desc: {
                metaType: 'text',
                variantStyle: {
                    width: '70%',
                    fontSize: '{font.size.medium}',
                    color: '{color.basic.opacity.white.64}',
                }
            },
            badge: {
                metaType: 'text',
                variantStyle: {
                    fontSize: '{font.size.medium}',
                    color: '{color.basic.opacity.white.100}',
                    padding: '{dimension.padding.base} {dimension.padding.extraloose}',
                    background: '{color.basic.opacity.white.12}',
                    borderRadius: '{dimension.borderradius.full}',
                }
            }
        }
    },
    // Hiring List Card
    hiringListCard: {
        type: 'template',
        hasUpdateEvent: true,
        layoutModes: [{
            name: 'default',
            condition: 'default',
            style: {
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '{dimension.borderradius.xxxxl}',
                padding: '{dimension.padding.superloose}',
                background: 'linear-gradient(135deg, {color.primary.brand3} 0%, {color.primary.brand5} 100%)',
            },
            structure: {
                groups: [{
                    name: 'topBlock',
                    type: 'template',
                    style: {
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%',
                        alignItems: 'flex-start',
                    },
                    groups: [{
                        name: 'shortListContainer',
                        type: 'template',
                        style: {
                            width: '50%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '{dimension.gap.base}',
                        },
                        groups: [{
                            name: 'shortListItem',
                            type: 'template',
                            style: {
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                borderRadius: '{dimension.borderradius.xxxxl}',
                                padding: '{dimension.padding.base} {dimension.padding.superloose}',
                                background: '{color.basic.brand.5}',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    left: '12px',
                                    width: '6px',
                                    height: '25%',
                                    borderRadius: '{dimension.borderradius.full}',
                                    background: '{color.basic.brand.3}',
                                }
                            },
                            slots: ['salaryTitle', 'salaryValue'],
                        }, {
                            name: 'shortListItem1',
                            type: 'template',
                            style: {
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                borderRadius: '{dimension.borderradius.xxxxl}',
                                padding: '{dimension.padding.base} {dimension.padding.superloose}',
                                background: '{color.basic.blue.6}',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    left: '12px',
                                    width: '6px',
                                    height: '25%',
                                    borderRadius: '{dimension.borderradius.full}',
                                    background: '{color.basic.blue.3}',
                                }
                            },
                            slots: ['hrTitle', 'hrValue'],
                        }]
                    }, {
                        name: 'titleBlock',
                        type: 'template',
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            width: '35%',
                            gap: '{dimension.gap.base}',
                        },
                        slots: ['title', 'desc']
                    }]
                }, {
                    name: 'listContainer',
                    type: 'template',
                    style: {
                        marginTop: '{dimension.margin.base}',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '{dimension.gap.base}',
                    },
                    groups: [{
                        name: 'listItem1',
                        type: 'template',
                        style: {
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: '{dimension.borderradius.xxxxl}',
                            padding: '{dimension.padding.base} {dimension.padding.superloose}',
                            background: '{color.basic.opacity.black.12}',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                left: '12px',
                                width: '6px',
                                height: '25%',
                                borderRadius: '{dimension.borderradius.full}',
                                background: '{color.basic.opacity.white.32}',
                            }
                        },
                        slots: ['areaTitle', 'areaValue']
                    }, {
                        name: 'listItem2',
                        type: 'template',
                        style: {
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: '{dimension.borderradius.xxxxl}',
                            padding: '{dimension.padding.base} {dimension.padding.superloose}',
                            background: '{color.basic.opacity.black.12}',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                left: '12px',
                                width: '6px',
                                height: '25%',
                                borderRadius: '{dimension.borderradius.full}',
                                background: '{color.basic.opacity.white.32}',
                            }
                        },
                        slots: ['jobTitle', 'jobValue']
                    }]
                }]
            }
        }],
        slotConfigs: {
            salaryTitle: {
                metaType: 'text',
                variantStyle: {
                    fontSize: '{font.size.medium}',
                    color: '{color.basic.opacity.white.48}',
                    margin: 0,
                }
            },
            hrTitle: {
                metaType: 'text',
                variantStyle: {
                    fontSize: '{font.size.medium}',
                    color: '{color.basic.opacity.white.48}',
                    margin: 0,
                }
            },
            jobTitle: {
                metaType: 'text',
                variantStyle: {
                    fontSize: '{font.size.medium}',
                    color: '{color.basic.opacity.white.48}',
                    margin: 0,
                }
            },
            areaTitle: {
                metaType: 'text',
                variantStyle: {
                    fontSize: '{font.size.medium}',
                    color: '{color.basic.opacity.white.48}',
                    margin: 0,
                }
            },
            areaValue: {
                metaType: 'text',
                variantStyle: {
                    fontSize: '{font.size.xl}',
                    color: '{color.basic.opacity.white.100}',
                    margin: 0,
                }
            },
            jobValue: {
                metaType: 'text',
                variantStyle: {
                    fontSize: '{font.size.xl}',
                    color: '{color.basic.opacity.white.100}',
                    margin: 0,
                }
            },
            salaryValue: {
                metaType: 'text',
                variantStyle: {
                    fontSize: '{font.size.xl}',
                    color: '{color.basic.opacity.white.100}',
                    margin: 0,
                }
            },
            hrValue: {
                metaType: 'text',
                variantStyle: {
                    fontSize: '{font.size.xl}',
                    color: '{color.basic.opacity.white.100}',
                    margin: 0,
                }
            },
            title: {
                metaType: 'text',
                variantStyle: {
                    fontSize: '{font.size.xl}',
                    color: '{color.basic.opacity.white.100}',
                    margin: 0,
                }
            },
            desc: {
                metaType: 'text',
                variantStyle: {
                    fontSize: 'font.size.medium',
                    color: '{color.basic.opacity.white.64}'
                }
            }
        }
    },
    // Hiring Image Card
    hiringImageCard: {
        type: 'template',
        hasUpdateEvent: true,
        parameters: {
            image: {
                source: 'outer',
            }
        },
        layoutModes: [{
            name: 'default',
            condition: 'default',
            style: {
                backgroundImage: 'url({image})',
                padding: '{dimension.padding.extraloose}',
                borderRadius: '{dimension.borderradius.xxxxl}',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            },
            structure: {
                groups: [{
                    name: 'contentBlock',
                    slots: ['title', 'desc'],
                    type: 'template',
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '{dimension.gap.tight}',
                        minHeight: '320px',
                    }
                }]
            }
        }],
        slotConfigs: {
            title: {
                metaType: 'text',
                variantStyle: {
                    fontSize: '{font.size.xxl}',
                    color: '{color.basic.opacity.white.100}',
                    lineHeight: '1',
                }
            },
            desc: {
                metaType: 'text',
                variantStyle: {
                    width: '60%',
                    fontSize: '{font.size.medium}',
                    color: '{color.basic.opacity.white.64}'
                }
            }
        },
    },

    // 新的演示示例卡片
    // Hiring Title Card
    hiringNewTitleCard: {
        type: 'template',
        hasUpdateEvent: true,
        layoutModes: [{
            name: 'default',
            condition: 'default',
            style: {
                width: '100%',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                borderRadius: '{dimension.borderradius.xxxxl}',
                borderColor: '{color.basic.opacity.white.24}',
                borderWidth: '1px',
                borderStyle: 'solid',
                background: '{color.basic.dark-blue.4}',
                padding: '{dimension.padding.superloose}',
            },
            structure: {
                groups: [{
                    name: 'titleBlock',
                    slots: ['title', 'desc'],
                    type: 'template',
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '{dimension.gap.tight}',
                    }
                }, {
                    name: 'badgeBlock',
                    slots: ['badge'],
                }]
            }
        }],
        slotConfigs: {
            title: {
                metaType: 'text',
                variantStyle: {
                    lineHeight: '1em',
                    fontSize: '{font.size.xxxl}',
                    marginBottom: '{dimension.margin.base}',
                    color: '{color.basic.opacity.white.100}',
                }
            },
            desc: {
                metaType: 'text',
                variantStyle: {
                    fontSize: '{font.size.medium}',
                    color: '{color.basic.opacity.white.48}',
                }
            },
            badge: {
                metaType: 'text',
                variantStyle: {
                    fontSize: '{font.size.medium}',
                    color: '{color.basic.opacity.white.100}',
                    padding: '{dimension.padding.base} {dimension.padding.extraloose}',
                    background: '{color.basic.opacity.white.12}',
                    borderColor: '{color.basic.opacity.white.12}',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    cursor: 'pointer',
                    borderRadius: '{dimension.borderradius.full}',
                }
            }
        }
    },

    hiringNewPersonCard: {
        type: 'template',
        hasUpdateEvent: true,
        layoutModes: [{
            name: 'default',
            condition: 'default',
            style: {
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                padding: '{dimension.padding.superloose}',
                borderColor: '{color.basic.opacity.white.24}',
                borderRadius: '{dimension.borderradius.xxxxl}',
                borderWidth: '1px',
                borderStyle: 'solid',
                background: 'linear-gradient(135deg, #CEEEFF 0%, #EBD8FA 50%, #F3F3FD 100%);'
            },
            structure: {
                groups: [{
                    name: 'contentBlock',
                    slots: ['title', 'name', 'badge', 'desc'],
                    type: 'template',
                    style: {
                        display: 'flex',
                        alignItems: 'flex-start',
                        flexDirection: 'column',
                        gap: '{dimension.gap.base}',
                    }
                }]
            }
        }],
        slotConfigs: {
            title: {
                metaType: 'text',
                variantStyle: {
                    lineHeight: '1em',
                    fontSize: '{font.size.xxl}',
                    marginBottom: '{dimension.margin.base}',
                    color: '{color.basic.opacity.black.100}',
                }
            },
            name: {
                metaType: 'text',
                variantStyle: {
                    lineHeight: '1em',
                    fontSize: '{font.size.xxxl}',
                    color: '{color.basic.opacity.black.100}',
                    marginBottom: '{dimension.margin.loose}',
                }
            },
            badge: {
                metaType: 'text',
                variantStyle: {
                    fontSize: '{font.size.medium}',
                    color: '{color.basic.opacity.white.100}',
                    padding: '{dimension.padding.base} {dimension.padding.extraloose}',
                    background: '{color.basic.opacity.black.12}',
                    borderColor: '{color.basic.opacity.black.12}',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    cursor: 'pointer',
                    borderRadius: '{dimension.borderradius.full}',
                }
            },
            desc: {
                metaType: 'text',
                variantStyle: {
                    fontSize: '{font.size.medium}',
                    color: '{color.basic.opacity.black.48}',
                    width: '60%',
                }
            }
        }
    },

    hiringNewAvatarCard: {
        type: 'template',
        hasUpdateEvent: true,
        layoutModes: [{
            name: 'default',
            condition: 'default',
            style: {
                display: 'flex',
                flex: '1',
                borderRadius: '{dimension.borderradius.xxxxl}',
                borderWidth: '1px',
                borderStyle: 'solid',
                padding: '{dimension.padding.superloose}',
                background: 'linear-gradient(135deg, #D57A06 0%, #700B05 50%, #282E8A 100%);'
            },
            structure: {
                groups: [{
                    name: 'rowBlock',
                    type: 'template',
                    style: {
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                    },
                    groups: [{
                        name: 'messageBlock',
                        type: 'template',
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            gap: '{dimension.gap.base}',
                        },
                        slots: ['title', 'name', 'badge', 'desc']
                    }, {
                        name: 'avatarBlock',
                        type: 'template',
                        style: {
                            width: '64px',
                            height: '64px',
                            borderRadius: '{dimension.borderradius.full}',
                            overflow: 'hidden',
                            flexShrink: '0',  // 防止被 flex 压缩
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        },
                        slots: ['avatar']
                    }]
                }]
            }
        }],
        slotConfigs: {
            title: {
                metaType: 'text',
                variantStyle: {
                    lineHeight: '1em',
                    fontSize: '{font.size.xl}',
                    color: '{color.basic.opacity.white.100}',
                    marginBottom: '{dimension.margin.base}',
                }
            },
            name: {
                metaType: 'text',
                variantStyle: {
                    lineHeight: '1em',
                    fontSize: '{font.size.xxxl}',
                    color: '{color.basic.opacity.white.100}',
                    marginBottom: '{dimension.margin.base}',
                }
            },
            badge: {
                metaType: 'text',
                variantStyle: {
                    fontSize: '{font.size.medium}',
                    color: '{color.basic.opacity.white.100}',
                    padding: '{dimension.padding.base} {dimension.padding.extraloose}',
                    background: '{color.basic.opacity.white.12}',
                    borderColor: '{color.basic.opacity.white.12}',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    cursor: 'pointer',
                    borderRadius: '{dimension.borderradius.full}',
                }
            },
            desc: {
                metaType: 'text',
                variantStyle: {
                    color: '{color.basic.opacity.white.48}',
                    fontSize: '{font.size.medium}',
                }
            },
            avatar: {
                metaType: 'image',
                variant: 'avatar',
                variantStyle: {
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',  // 填充整个圆形区域
                    display: 'block',
                }
            },
        }
    },

    hiringDarkNewAvatarCard: {
        type: 'template',
        hasUpdateEvent: true,
        layoutModes: [{
            name: 'default',
            condition: 'default',
            style: {
                display: 'flex',
                flex: '1',
                borderRadius: '{dimension.borderradius.xxxxl}',
                borderWidth: '1px',
                borderStyle: 'solid',
                padding: '{dimension.padding.superloose}',
                background: 'linear-gradient(135deg, #0064B8 0%, #53299E 50%, #2E2881 100%);'
            },
            structure: {
                groups: [{
                    name: 'rowBlock',
                    type: 'template',
                    style: {
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                    },
                    groups: [{
                        name: 'messageBlock',
                        type: 'template',
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            gap: '{dimension.gap.base}',
                        },
                        slots: ['title', 'name', 'badge', 'desc']
                    }, {
                        name: 'avatarBlock',
                        type: 'template',
                        style: {
                            width: '64px',
                            height: '64px',
                            borderRadius: '{dimension.borderradius.full}',
                            overflow: 'hidden',
                            flexShrink: '0',  // 防止被 flex 压缩
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        },
                        slots: ['avatar']
                    }]
                }]
            }
        }],
        slotConfigs: {
            title: {
                metaType: 'text',
                variantStyle: {
                    lineHeight: '1em',
                    fontSize: '{font.size.xl}',
                    color: '{color.basic.opacity.white.100}',
                    marginBottom: '{dimension.margin.base}',
                }
            },
            name: {
                metaType: 'text',
                variantStyle: {
                    lineHeight: '1em',
                    fontSize: '{font.size.xxxl}',
                    color: '{color.basic.opacity.white.100}',
                    marginBottom: '{dimension.margin.base}',
                }
            },
            badge: {
                metaType: 'text',
                variantStyle: {
                    fontSize: '{font.size.medium}',
                    color: '{color.basic.opacity.white.100}',
                    padding: '{dimension.padding.base} {dimension.padding.extraloose}',
                    background: '{color.basic.opacity.white.12}',
                    borderColor: '{color.basic.opacity.white.12}',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    cursor: 'pointer',
                    borderRadius: '{dimension.borderradius.full}',
                }
            },
            desc: {
                metaType: 'text',
                variantStyle: {
                    color: '{color.basic.opacity.white.48}',
                    fontSize: '{font.size.medium}',
                }
            },
            avatar: {
                metaType: 'image',
                variant: 'avatar',
                variantStyle: {
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',  // 填充整个圆形区域
                    display: 'block',
                }
            },
        }
    }
}

export default HIRING_CARD_STYLE