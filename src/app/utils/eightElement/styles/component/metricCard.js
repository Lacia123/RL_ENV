import { COMMAND_SLOT_CONFIG } from './command';

const METRIC_CARD_STYLE = {
    // 📊 指标 / KPI 卡片
    metricCard: {
        type: 'template',
        hasUpdateEvent: true,
        layoutModes: [
            {
                name: 'withChart',
                condition: 'has:chart_mini',
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
                            name: 'metaRow',
                            condition: 'has:metric_label || has:time_range',
                            slots: ['metric_label', 'time_range'],
                            type: 'template',
                            style: {
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: '{dimension.gap.tight}',
                                flexWrap: 'wrap',
                                borderBottom: '1px solid {color.surfacecontainer.black8}',
                                paddingBottom: '{dimension.padding.supertight}',
                                marginBottom: '{dimension.margin.tight}'
                            }
                        },
                        {
                            name: 'commandBlock',
                            condition: 'has:command',
                            slots: ['command'],
                            type: 'template',
                            style: { width: '100%', marginBottom: '{dimension.margin.tight}' }
                        },
                        {
                            name: 'contentRow',
                            type: 'template',
                            style: {
                                display: 'flex',
                                flexDirection: 'row',
                                gap: '{dimension.gap.loose}',
                                alignItems: 'stretch'
                            },
                            groups: [
                                {
                                    name: 'metricColumn',
                                    type: 'template',
                                    style: {
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '{dimension.gap.tight}',
                                        justifyContent: 'space-between',
                                        flex: '1',
                                        padding: '{dimension.padding.base} 0'
                                    },
                                    groups: [
                                        {
                                            name: 'metricContainer',
                                            type: 'template',
                                            condition: 'has:metric_label || has:metric_value || has:trend_value',
                                            style: {
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '{dimension.gap.tight}',
                                            },
                                            groups: [
                                                {
                                                    name: 'valueRow',
                                                    slots: ['metric_value']
                                                },
                                                {
                                                    name: 'trendRow',
                                                    condition: 'has:trend_value',
                                                    slots: ['trend_value'],
                                                    type: 'template',
                                                    style: {
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        gap: '{dimension.gap.supertight}'
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            name: 'status',
                                            slots: ['status']
                                        }
                                    ]

                                },
                                {
                                    name: 'chartMini',
                                    slots: ['chart_mini'],
                                    type: 'template',
                                    style: {
                                        width: '240px',
                                        minHeight: '120px',
                                        padding: '{dimension.padding.base}',
                                        background: '{color.surfacecontainer.white96}',
                                        borderRadius: '{dimension.borderradius.large}',
                                        border: '1px solid {color.surfacecontainer.black8}',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
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
                            name: 'metaRow',
                            condition: 'has:metric_label || has:time_range',
                            slots: ['metric_label', 'time_range'],
                            type: 'template',
                            style: {
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: '{dimension.gap.tight}',
                                flexWrap: 'wrap',
                                borderBottom: '1px solid {color.surfacecontainer.black8}',
                                paddingBottom: '{dimension.padding.supertight}',
                                marginBottom: '{dimension.margin.tight}'
                            }
                        },
                        {
                            name: 'commandBlock',
                            condition: 'has:command',
                            slots: ['command'],
                            type: 'template',
                            style: { width: '100%', marginBottom: '{dimension.margin.tight}' }
                        },
                        {
                            name: 'contentRow',
                            type: 'template',
                            style: {
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            },
                            groups: [
                                {
                                    name: 'metricColumn',
                                    type: 'template',
                                    style: {
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '{dimension.gap.tight}',
                                    },
                                    groups: [
                                        {
                                            name: 'valueRow',
                                            slots: ['metric_value']
                                        },
                                        {
                                            name: 'trendRow',
                                            condition: 'has:trend_icon || has:trend_value',
                                            slots: ['trend_icon', 'trend_value'],
                                            type: 'template',
                                            style: {
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                gap: '{dimension.gap.supertight}'
                                            }
                                        }
                                    ]
                                },
                                {
                                    name: 'status',
                                    slots: ['status'],
                                    styleReference: 'status_large'
                                }
                            ]
                        },
                        {

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
            border: '{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}',

        },
        slotConfigs: {
            metric_value: {
                metaType: 'text',
                variant: 'metricCardValue'
            },
            metric_label: {
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    fontSize: '{font.size.tiny}',
                    fontWeight: '{font.fontweight.medium}',
                    color: '{color.onsurface.black64}',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    margin: '0',
                    opacity: '0.85'
                }
            },
            trend_value: {
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    padding: '{dimension.padding.supertight} {dimension.padding.tight}',
                    background: '{color.success.green1}',
                    borderRadius: '{dimension.borderradius.medium}',
                    fontSize: '{font.size.small}',
                    fontWeight: '{font.fontweight.semibold}',
                    color: '{color.success.green6}',
                    margin: '0',
                    letterSpacing: '0.02em'
                }
            },
            chart_mini: {
                type: 'template',
                style: {
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, {color.surface.grey0} 0%, {color.surfacecontainer.white100} 100%)',
                    borderRadius: '{dimension.borderradius.large}',
                    border: '1px dashed {color.surfacecontainer.black8}'
                },
                metaType: 'chart',
                variant: 'mini'
            },
            time_range: {
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    fontSize: '{font.size.tiny}',
                    fontWeight: '{font.fontweight.medium}',
                    color: '{color.onsurface.black48}',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    margin: '0'
                }
            },
            status: {
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    fontSize: '{font.size.xl}',
                    fontWeight: '{font.fontweight.bold}',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '{color.primary.brand5}',
                }
            },
            status_large: {
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    fontSize: '{font.size.xxxl}',
                    fontWeight: '{font.fontweight.bold}',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '{color.primary.brand5}',
                }
            },
            command: COMMAND_SLOT_CONFIG
        },
        slots: {
            metric_value: { required: true, optional: false },
            metric_label: { required: true, optional: false },
            trend_icon: { required: false, optional: true },
            trend_value: { required: false, optional: true },
            chart_mini: { required: false, optional: true, supportedAttributes: ['chart', 'title', 'sort'] },
            time_range: { required: false, optional: true },
            status: { required: false, optional: true },
            command: { required: false, optional: true }
        }
    },
}


export default METRIC_CARD_STYLE