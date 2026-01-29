import { flag } from "@/app/utils/icons/Travel"
import font from "@/app/utils/tokens/asset/font"

const MIXED_CARD_STYLE = {
    mixedCard: {
        type: 'template',
        hasUpdateEvent: true,
        // 🆕 参数定义 - 支持从外部传入
        parameters: {
            flex: {
                source: 'outer',  // 从外部属性获取 <mixedCard flex="1">
                default: '0 0 auto'  // 默认值：不伸缩
            },
            minWidth: {
                source: 'outer',  // 从外部属性获取 <mixedCard minWidth="300px">
                default: 'auto'  // 默认值：自动宽度
            },
            maxWidth: {
                source: 'outer',  // 从外部属性获取 <mixedCard maxWidth="500px">
                default: 'auto'  // 默认值：自动宽度
            }
        },
        // 🆕 添加组件基础样式（可选但推荐）
        style: {
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '{dimension.borderradius.xl}',
            boxShadow: '{material.hierarchy.1f}',
            padding: '{dimension.padding.loose}',
            gap: '{dimension.gap.base}',
            // 🆕 使用参数（通过 $paramName 引用）
            flex: '$flex',
            minWidth: '$minWidth',
            maxWidth: '$maxWidth',
        },
        layoutModes: [{
            name: 'default',
            condition: 'default',
            style: {
                // 🆕 模式样式（会合并到基础样式）
                // 如果需要在默认模式下覆盖基础样式，在这里添加
            },
            structure: {
                groups: [{
                    name: 'subtitleLayer',
                    slots: ['subtitle'],
                    type: 'template',
                }, {
                    name: 'imageLayer',
                    slots: ['image'],
                    type: 'template',
                    style: {
                        width: '100%',
                        overflow: 'hidden',
                        borderRadius: '{dimension.borderradius.xl}',
                        aspectRatio: '16 / 9',
                    }
                }, {
                    name: 'titleLayer',
                    type: 'template',
                    style: {
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',

                    },
                    groups: [{
                        name: 'titleGroup',
                        type: 'template',
                        style: {
                            display: 'flex',
                            flexDirection: 'row',
                            gap: '{dimension.gap.base}',
                            alignItems: 'center',
                        },
                        slots: ['avatar', 'title']
                    }, {
                        name: 'actionGroup',
                        type: 'template',
                        slots: ['detail']
                    }]
                }, {
                    name: 'labelLayer',
                    type: 'template',
                    style: {
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '{dimension.gap.base}',
                    },
                    slots: ['blueLabel*', 'redLabel*', 'purpleLabel*']
                }, {
                    name: 'contentLayer',
                    type: 'template',
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '{dimension.gap.base}',
                    },
                    slots: ['content*']
                }, {
                    name: 'imageLayer',
                    type: 'template',
                    style: {
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '{dimension.gap.base}',
                    },
                    slots: ['imageItem*']
                }]
            }
        }],
        slotConfigs: {
            subtitle: {
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    margin: '0',
                    fontSize: '{font.size.small}',
                    color: '{color.basic.opacity.black.32}',
                }
            },
            image: {
                metaType: 'image',
                variant: 'cover',
                variantStyle: {
                    flex: 1,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    padding: '0',
                    margin: '0'
                }
            },
            avatar: {
                metaType: 'image',
                variant: 'normal',
                variantStyle: {
                    width: '40px',
                }
            },
            title: {
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    margin: '0',
                    fontSize: '{font.size.xxl}',
                    fontWeight: '{font.fontweight.semibold}',
                    color: '{color.basic.opacity.black.88}',
                }
            },
            detail: {
                metaType: 'button',
                variantStyle: {
                    background: '{color.basic.blue.5}',
                    padding: '{dimension.padding.tight} {dimension.padding.loose}',
                    borderRadius: '{dimension.borderradius.large}',
                    fontWeight: '{font.fontweight.bold}',
                    fontSize: '{font.size.medium}',
                    '&:hover': {
                        background: '{color.basic.blue.5}',
                    }
                },
            },
            blueLabel: {
                metaType: 'text',
                variant: 'label',
                variantStyle: {
                    padding: "{dimension.padding.tight} {dimension.padding.base}",
                    borderRadius: "{dimension.borderradius.xl}",
                    background: "{color.basic.light-blue.0}",
                },
            },
            redLabel: {
                metaType: 'text',
                variant: 'label',
                variantStyle: {
                    padding: "{dimension.padding.tight} {dimension.padding.base}",
                    borderRadius: "{dimension.borderradius.xl}",
                    background: "{color.basic.red.0}",
                }
            },
            purpleLabel: {
                metaType: 'text',
                variant: 'label',
                variantStyle: {
                    padding: "{dimension.padding.tight} {dimension.padding.base}",
                    borderRadius: "{dimension.borderradius.xl}",
                    background: "{color.basic.brand.1}",
                },
            },
            content: {
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    margin: '0',
                    fontSize: '{font.size.medium}',
                    fontWeight: '{font.fontweight.medium}',
                    color: '{color.basic.opacity.black.32}',
                    lineHeight: '1.5em'
                }
            },
            imageItem: {
                metaType: 'image',
                variant: 'cover',
                variantStyle: {
                    flex: 1,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    padding: '0',
                    margin: '0'
                }
            }
        }
    }
}

export default MIXED_CARD_STYLE