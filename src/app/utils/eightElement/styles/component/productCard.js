const PRODUCT_CARD_STYLE = {
    // 产品卡片 - 使用插槽标签系统
    productCard: {
        type: 'template',
        style: {
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '{dimension.borderradius.xl}',
            padding: '{dimension.padding.base}',
            background: '{color.surfacecontainer.white100}',
            boxShadow: '{material.hierarchy.1f}',
            gap: '{dimension.gap.tight}',
            maxWidth: '320px'
        },
        // 使用 slotConfigs 定义插槽
        slotConfigs: {
            image: {
                metaType: 'image',
                variant: 'rounded',
                variantStyle: {
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '{dimension.borderradius.medium}'
                }
            },
            title: {
                metaType: 'text',
                variant: 'h4',
                variantStyle: {
                    margin: '{dimension.margin.tight} 0',
                    color: '{color.onsurface.black88}'
                }
            },
            description: {
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    color: '{color.onsurface.black64}',
                    fontSize: '{font.size.small}',
                    margin: '0'
                }
            },
            price: {
                type: 'template',
                style: {
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'baseline',
                    gap: '{dimension.gap.tight}',
                    marginTop: '{dimension.margin.base}'
                },
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    color: '{color.primary.brand5}',
                    fontWeight: 'bold',
                    fontSize: '{font.size.large}',
                    margin: '0'
                }
            },
            button: {
                metaType: 'button',
                variant: 'primary',
                variantStyle: {
                    marginTop: '{dimension.margin.base}'
                }
            }
        },
        // 可选：定义插槽元数据（用于验证）
        slots: {
            image: {
                required: false,
                optional: true,
                supportedAttributes: ['src', 'alt', 'href', 'target']
            },
            title: {
                required: true,
                optional: false
            },
            description: {
                required: false,
                optional: true
            },
            price: {
                required: false,
                optional: true
            },
            button: {
                required: false,
                optional: true,
                supportedAttributes: ['href', 'target']
            }
        }
    },

    // 🎯 智能产品卡片 - 条件布局模式
    smartProductCard: {
        type: 'template',

        // 🆕 布局模式配置（按优先级排列）
        layoutModes: [
            // 模式1：完整信息布局（有图片时，纵向布局）
            {
                name: 'withImage',
                condition: 'has:image',
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '{dimension.borderradius.xl}',
                    background: '{color.surfacecontainer.white100}',
                    boxShadow: '{material.hierarchy.1f}',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    maxWidth: '400px',
                    padding: '0',
                    gap: '0',
                    '&:hover': {
                        boxShadow: '{material.hierarchy.3f}',
                        transform: 'translateY(-2px)'
                    }
                },
                structure: {
                    groups: [
                        // 图片区域（顶部）
                        {
                            name: 'imageArea',
                            slots: ['badge', 'image'],
                            type: 'template',
                            style: {
                                position: 'relative',
                                width: '100%'
                            }
                        },
                        // 内容区域（嵌套结构）
                        {
                            name: 'contentArea',
                            type: 'template',
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                padding: '{dimension.padding.base}',
                                gap: '{dimension.gap.tight}'
                            },
                            // 🆕 支持嵌套分组
                            groups: [
                                // 标题和评分在同一行（如果有评分）
                                {
                                    name: 'header',
                                    condition: 'has:rating',
                                    slots: ['title', 'rating'],
                                    type: 'template',
                                    style: {
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'flex-start',
                                        gap: '{dimension.gap.tight}',
                                        marginBottom: '{dimension.margin.tight}'
                                    }
                                },
                                // 只有标题（没有评分时）
                                {
                                    name: 'titleOnly',
                                    condition: 'no:rating',
                                    slots: ['title']
                                },
                                // 标签
                                {
                                    name: 'tags',
                                    condition: 'has:tags',
                                    slots: ['tags']
                                },
                                // 描述
                                {
                                    name: 'description',
                                    condition: 'has:description',
                                    slots: ['description']
                                },
                                // 底部：价格和操作按钮
                                {
                                    name: 'footer',
                                    condition: 'has:price || has:actions || has:footer',
                                    slots: ['price', 'actions', 'footer'],
                                    type: 'template',
                                    style: {
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        gap: '{dimension.gap.base}',
                                        marginTop: 'auto',
                                        paddingTop: '{dimension.padding.tight}',
                                        borderTop: '1px solid {color.surfacecontainer.black12}'
                                    }
                                }
                            ]
                        }
                    ]
                }
            },

            // 模式2：简化布局（无图片时）
            {
                name: 'simple',
                condition: 'default',
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '{dimension.borderradius.xl}',
                    background: '{color.surfacecontainer.white100}',
                    boxShadow: '{material.hierarchy.1f}',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    maxWidth: '400px',
                    padding: '{dimension.padding.base}',
                    gap: '{dimension.gap.tight}',
                    '&:hover': {
                        boxShadow: '{material.hierarchy.3f}',
                        transform: 'translateY(-2px)'
                    }
                },
                structure: {
                    groups: [
                        // 标题和评分
                        {
                            name: 'header',
                            condition: 'has:rating',
                            slots: ['title', 'rating'],
                            type: 'template',
                            style: {
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                gap: '{dimension.gap.tight}'
                            }
                        },
                        {
                            name: 'titleOnly',
                            condition: 'no:rating',
                            slots: ['title']
                        },
                        // 标签
                        {
                            name: 'tags',
                            condition: 'has:tags',
                            slots: ['tags']
                        },
                        // 描述
                        {
                            name: 'description',
                            condition: 'has:description',
                            slots: ['description']
                        },
                        // 底部
                        {
                            name: 'footer',
                            condition: 'has:price || has:actions || has:footer',
                            slots: ['price', 'actions', 'footer'],
                            type: 'template',
                            style: {
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: '{dimension.gap.base}',
                                marginTop: 'auto',
                                paddingTop: '{dimension.padding.tight}',
                                borderTop: '1px solid {color.surfacecontainer.black12}'
                            }
                        }
                    ]
                }
            }
        ],

        // 🔧 保留旧的 style 作为后备（如果没有 layoutModes）
        style: {
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '{dimension.borderradius.xl}',
            background: '{color.surfacecontainer.white100}',
            boxShadow: '{material.hierarchy.1f}',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            position: 'relative',
            maxWidth: '400px',
            padding: '0',
            gap: '0',

            '&:hover': {
                boxShadow: '{material.hierarchy.3f}',
                transform: 'translateY(-2px)'
            }
        },

        slotConfigs: {
            // 徽章 - 绝对定位，不影响布局
            badge: {
                metaType: 'text',
                variant: 'p',
                supportedAttributes: ['href', 'target'],
                variantStyle: {
                    position: 'absolute',
                    top: '{dimension.padding.tight}',
                    right: '{dimension.padding.tight}',
                    padding: '{dimension.padding.supertight} {dimension.padding.tight}',
                    background: '{color.error.red5}',
                    color: '{color.onprimary.white100}',
                    borderRadius: '{dimension.borderradius.small}',
                    fontSize: '{font.size.tiny}',
                    fontWeight: '{font.fontweight.bold}',
                    zIndex: '10',
                    margin: '0'
                }
            },

            // 图片 - 顶部，固定高度
            image: {
                metaType: 'image',
                variant: 'normal',
                variantStyle: {
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    flexShrink: '0',
                    margin: '0',
                    padding: '0'
                }
            },

            // 标题 - 大而醒目
            title: {
                metaType: 'text',
                variant: 'h4',
                supportedAttributes: ['href', 'target'],
                variantStyle: {
                    margin: '{dimension.margin.base} {dimension.margin.base} {dimension.margin.tight} {dimension.margin.base}',
                    color: '{color.onsurface.black88}',
                    fontWeight: '{font.fontweight.semibold}',
                    fontSize: '{font.size.large}'
                }
            },

            // 评分 - 小而淡
            rating: {
                metaType: 'text',
                variant: 'p',
                supportedAttributes: ['href', 'target'],
                variantStyle: {
                    fontSize: '{font.size.small}',
                    color: '{color.warning.orange5}',
                    margin: '0 {dimension.margin.base} {dimension.margin.tight} {dimension.margin.base}'
                }
            },

            // 标签 - 灰色背景
            tags: {
                metaType: 'text',
                variant: 'p',
                supportedAttributes: ['href', 'target'],
                variantStyle: {
                    fontSize: '{font.size.small}',
                    color: '{color.onsurface.black64}',
                    margin: '0 {dimension.margin.base} {dimension.margin.tight} {dimension.margin.base}',
                    padding: '{dimension.padding.supertight} {dimension.padding.tight}',
                    background: '{color.surface.grey1}',
                    borderRadius: '{dimension.borderradius.small}',
                    display: 'inline-block'
                }
            },

            // 描述 - 限制3行
            description: {
                metaType: 'text',
                variant: 'p',
                supportedAttributes: ['href', 'target'],
                variantStyle: {
                    fontSize: '{font.size.small}',
                    color: '{color.onsurface.black64}',
                    lineHeight: '1.6',
                    margin: '0 {dimension.margin.base} {dimension.margin.base} {dimension.margin.base}',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: '3',
                    WebkitBoxOrient: 'vertical'
                }
            },


            // 价格 - 大而醒目
            price: {
                metaType: 'text',
                variant: 'p',
                supportedAttributes: ['href', 'target'],
                variantStyle: {
                    fontSize: '{font.size.xl}',
                    fontWeight: '{font.fontweight.bold}',
                    color: '{color.primary.brand5}',
                    margin: 'auto {dimension.margin.base} {dimension.margin.tight} {dimension.margin.base}'
                }
            },

            // 操作按钮 - 支持多个按钮
            actions: {
                type: 'template',
                style: {
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: '{dimension.gap.tight}',
                    margin: '0 {dimension.margin.base} {dimension.margin.base} {dimension.margin.base}',
                    marginLeft: 'auto'
                },
                metaType: 'button',
                variant: 'primary',
                variantStyle: {
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    whiteSpace: 'nowrap',
                    padding: '{dimension.padding.base}',
                    flexShrink: '0'
                }
            },

            // 自定义页脚容器 - 也支持多个按钮
            footer: {
                type: 'template',
                style: {
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: '{dimension.gap.tight}',
                    margin: '0 {dimension.margin.base} {dimension.margin.base} {dimension.margin.base}',
                    marginLeft: 'auto'
                },
                metaType: 'button',
                variant: 'primary',
                variantStyle: {
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    whiteSpace: 'nowrap',
                    padding: '{dimension.padding.base}',
                    flexShrink: '0'
                }
            }
        },

        slots: {
            badge: { required: false, optional: true, supportedAttributes: ['href', 'target'] },
            image: { required: false, optional: true, supportedAttributes: ['src', 'alt', 'href', 'target'] },
            title: { required: true, optional: false, supportedAttributes: ['href', 'target'] },
            rating: { required: false, optional: true, supportedAttributes: ['href', 'target'] },
            tags: { required: false, optional: true, supportedAttributes: ['href', 'target'] },
            description: { required: false, optional: true, supportedAttributes: ['href', 'target'] },
            price: { required: false, optional: true, supportedAttributes: ['href', 'target'] },
            actions: { required: false, optional: true, supportedAttributes: ['href', 'target'] },
            footer: { required: false, optional: true, supportedAttributes: ['href', 'target'] }
        }
    },
}


export default PRODUCT_CARD_STYLE


