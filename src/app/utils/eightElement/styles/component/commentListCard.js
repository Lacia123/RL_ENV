const COMMENT_LIST_CARD_STYLE = {
    // commentListCard 数据绑定示例
    commentListCard: {
        type: 'template',
        layoutModes: [{
            name: 'default',
            condition: 'default',
            style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                padding: '16px',
                backgroundColor: '{color.surface.default}',
                borderRadius: '{dimension.borderradius.medium}',
                boxShadow: '{shadow.elevation.low}'
            },
            structure: {
                groups: [
                    {
                        name: 'itemContent',
                        type: 'template',
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '{dimension.padding.base} 0',
                            borderBottom: '1px solid {color.surfacecontainer.black7}',
                            gap: '4px',
                            width: '100%'
                        },
                        groups: [{
                            name: 'headerRow',
                            type: 'template',
                            style: {
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'flex-start',
                                gap: '{dimension.gap.base}',
                                flexWrap: 'wrap'
                            },
                            groups: [{
                                name: 'titleGroup',
                                type: 'template',
                                slots: ['title']
                            }]
                        }]
                    }
                ]
            }
        }],
        slots: {
            title: {
                metaType: 'text',
                variant: 'h3',
                variantStyle: {
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '{color.onsurface.black88}'
                }
            },
            desc: {
                metaType: 'text',
                variant: 'body',
                variantStyle: {
                    fontSize: '14px',
                    color: '{color.onsurface.black64}'
                }
            }
        },
        example: [{
            title: '用户评论1',
            desc: '这是一条用户评论，展示了用户对产品的评价和反馈。'
        }, {
            title: '用户评论2',
            desc: '这是另一条用户评论，展示了用户对产品的评价和反馈。'
        }]
    },

    // commentStyleListCard 带样式的评论卡片
    commentStyleListCard: {
        type: 'template',
        layoutModes: [{
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
                groups: [{
                    name: 'header',
                    slots: ['title', 'subtitle'],
                    type: 'template',
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '{dimension.gap.supertight}'
                    }
                }, {
                    name: 'itemContent',
                    type: 'template',
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '{dimension.padding.base} 0',
                        borderBottom: '1px solid {color.surfacecontainer.black7}',
                        gap: '4px',
                        width: '100%'
                    },
                    groups: [{
                        name: 'headerRow',
                        type: 'template',
                        style: {
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'flex-start',
                            gap: '{dimension.gap.base}',
                            flexWrap: 'wrap'
                        },
                        groups: [{
                            name: 'avatarGroup',
                            type: 'template',
                            style: {
                                width: '44px',
                                height: '44px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                objectFit: 'cover'
                            },
                            slots: ['avatar']
                        }, {
                            name: 'contentGroup',
                            type: 'template',
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '{dimension.gap.supertight}',
                                flex: '1'
                            },
                            groups: [{
                                name: 'nameGroup',
                                type: 'template',
                                slots: ['name', 'text'],
                                style: {
                                    display: 'flex',
                                    flexDirection: 'row',
                                    gap: '{dimension.gap.base}',
                                    flex: '1'
                                }
                            }, {
                                name: 'descGroup',
                                type: 'template',
                                slots: ['desc'],
                                style: {
                                    display: 'flex',
                                    flexDirection: 'column'
                                }
                            }],
                        }, {
                            name: 'rightGroup',
                            type: 'template',
                            style: {
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'flex-end',
                                gap: '{dimension.gap.base}'
                            },
                            slots: ['timestamp']
                        }]
                    }]
                }]
            }
        }],
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
            name: {
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    margin: '0',
                    fontSize: '{font.size.medium}',
                    color: '{color.onsurface.black88}',
                    lineHeight: '1.5'
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
            desc: {
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    margin: '0',
                    fontSize: '{font.size.small}',
                    color: '{color.onsurface.black64}'
                }
            },
            timestamp: {
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    margin: '0',
                    fontSize: '{font.size.tiny}',
                    color: '{color.onsurface.black64}'
                }
            },
            avatar: {
                metaType: 'image',
                variant: 'avatar'
            },
        },
        example: [{
            applyDeptName: '数据智能&用户体验',
            approveAuditorName: '李峰',
            avatarUrl: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=200&h=200',
            orderSummary: '申报金额（CNY）：23,0000',
            beginTime: '2025-08-11 15:34:05'
        }, {
            applyDeptName: '数据智能&用户体验12',
            approveAuditorName: '李峰2',
            avatarUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200',
            orderSummary: '申报金额（CNY）：45,0000',
            beginTime: '2025-08-11 15:34:05'
        }]
    },
}


export default COMMENT_LIST_CARD_STYLE