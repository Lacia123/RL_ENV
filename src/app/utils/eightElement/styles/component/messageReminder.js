const MESSAGE_REMINDER_PROGRESS_STYLE = {
    messageReminderProgress: {
        type: 'template',
        parameters: {
            progressValue: {
                source: 'progress',
                default: 65
            }
        },
        style: {
            '--progress-value': '$progressValue',
        },
        layoutModes: [
            {
                name: 'withProgress',
                condition: 'has:message_progress',
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                    padding: '16px',
                    width: '100%',
                    boxSizing: 'border-box',
                    borderRadius: '{dimension.borderradius.xxxxl}',
                    boxShadow: '6px -2px 20.047px 0 rgba(63, 223, 255, 0.18), -6px 6px 20.047px 0 rgba(63, 71, 255, 0.18)',
                    backdropFilter: 'blur(12px)',
                },
                structure: {
                    groups: [
                        {
                            name: 'topRow',
                            type: 'template',
                            style: {
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: '12px',
                                width: '100%',
                            },
                            groups: [
                                {
                                    name: 'iconBlock',
                                    slots: ['status_icon'],
                                    type: 'template',
                                    style: { flexShrink: 0 }
                                },
                                {
                                    name: 'contentBlock',
                                    type: 'template',
                                    style: {
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: '8px',
                                        flex: 1,
                                        minWidth: 0,
                                    },
                                    groups: [
                                        {
                                            name: 'messageTextBlock',
                                            type: 'template',
                                            style: {
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '8px',
                                                flex: 1,
                                                minWidth: 0,
                                            },
                                            groups: [
                                                {
                                                    name: 'statusGroup',
                                                    slots: ['message_status'],
                                                    type: 'template',
                                                    style: {}
                                                },
                                                {
                                                    name: 'messageGroup',
                                                    slots: ['message'],
                                                    type: 'template',
                                                    style: {}
                                                }
                                            ]
                                        },
                                        {
                                            name: 'completedTimeRow',
                                            type: 'template',
                                            style: {
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'baseline',
                                                gap: '2px',
                                                flexShrink: 0,
                                                alignSelf: 'flex-end',
                                                padding: '4px',
                                            },
                                            slots: ['completed_time', 'time_unit']
                                        }
                                    ]
                                },
                                {
                                    name: 'timeBlock',
                                    slots: ['time'],
                                    type: 'template',
                                    style: {
                                        flexShrink: 0,
                                        alignSelf: 'flex-start',
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        alignItems: 'flex-start',
                                    }
                                }
                            ]
                        },
                        {
                            name: 'bottomRow',
                            type: 'template',
                            style: {
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '24px',
                                width: '100%',
                            },
                            groups: [
                                {
                                    name: 'progressBlock',
                                    slots: ['message_progress'],
                                    type: 'template',
                                    style: { flex: 1, minWidth: 0 }
                                },
                                {
                                    name: 'buttonBlock',
                                    slots: ['message_button'],
                                    type: 'template',
                                    style: { flexShrink: 0 }
                                }
                            ]
                        }
                    ]
                }
            },
            {
                name: 'withoutProgress',
                condition: 'default',
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '16px',
                    width: '100%',
                    boxSizing: 'border-box',
                    borderRadius: '{dimension.borderradius.xxxxl}',
                    boxShadow: '6px -2px 20.047px 0 rgba(63, 223, 255, 0.18), -6px 6px 20.047px 0 rgba(63, 71, 255, 0.18)',
                    backdropFilter: 'blur(12px)',
                },
                structure: {
                    groups: [
                        {
                            name: 'topRow',
                            type: 'template',
                            style: {
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: '12px',
                                width: '100%',
                            },
                            groups: [
                                {
                                    name: 'iconBlock',
                                    slots: ['status_icon'],
                                    type: 'template',
                                    style: { flexShrink: 0 }
                                },
                                {
                                    name: 'contentBlock',
                                    type: 'template',
                                    style: {
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: '8px',
                                        flex: 1,
                                        minWidth: 0,
                                    },
                                    groups: [
                                        {
                                            name: 'messageTextBlock',
                                            type: 'template',
                                            style: {
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '8px',
                                                flex: 1,
                                                minWidth: 0,
                                            },
                                            groups: [
                                                {
                                                    name: 'statusGroup',
                                                    slots: ['message_status'],
                                                    type: 'template',
                                                    style: {}
                                                },
                                                {
                                                    name: 'messageGroup',
                                                    slots: ['message'],
                                                    type: 'template',
                                                    style: {}
                                                }
                                            ]
                                        },
                                        {
                                            name: 'completedTimeRow',
                                            type: 'template',
                                            style: {
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'baseline',
                                                gap: '2px',
                                                flexShrink: 0,
                                                alignSelf: 'flex-end',
                                                padding: '4px',
                                            },
                                            slots: ['completed_time', 'time_unit']
                                        }
                                    ]
                                },
                                {
                                    name: 'timeBlock',
                                    type: 'template',
                                    style: {
                                        flexShrink: 0,
                                        alignSelf: 'flex-start',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-end',
                                        gap: '16px',
                                    },
                                    groups: [
                                        {
                                            name: 'timeRow',
                                            slots: ['time'],
                                            type: 'template',
                                            style: {}
                                        },
                                        {
                                            name: 'buttonRow',
                                            slots: ['message_button'],
                                            type: 'template',
                                            style: {}
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            }
        ],
        slots: {
            status_icon: {
                metaType: 'text',
                variant: 'statusIcon',
                variantStyle: {
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: '{color.basic.brand.6}',
                    color: '{color.basic.opacity.white.100}',
                    fontSize: '{font.size.large}',
                    fontWeight: '{font.fontweight.bold}',
                    lineHeight: 1,
                    flexShrink: 0,
                }
            },
            message_status: {
                metaType: 'text',
                variant: 'messageStatus',
                variantStyle: {
                    fontSize: '{font.size.medium}',
                    fontWeight: '{font.fontweight.bold}',
                    color: '{color.basic.brand.6}',
                    lineHeight: 1.4,
                }
            },
            message: {
                metaType: 'text',
                variant: 'messageContent',
                variantStyle: {
                    fontSize: '{font.size.large}',
                    fontWeight: '{font.fontweight.bold}',
                    color: '{color.basic.opacity.black.100}',
                    lineHeight: 1.5,
                }
            },
            time: {
                metaType: 'text',
                variant: 'time',
                variantStyle: {
                    fontSize: '{font.size.medium}',
                    fontWeight: '{font.fontweight.semibold}',
                    color: '{color.basic.opacity.black.48}',
                    lineHeight: 1.4,
                }
            },
            completed_time: {
                metaType: 'text',
                variant: 'completedTime',
                variantStyle: {
                    fontSize: '{font.size.xxl}',
                    fontWeight: '{font.fontweight.bold}',
                    color: '{color.basic.brand.5}',
                    lineHeight: 1,
                }
            },
            time_unit: {
                metaType: 'text',
                variant: 'timeUnit',
                variantStyle: {
                    fontSize: '{font.size.medium}',
                    fontWeight: '{font.fontweight.bold}',
                    color: '{color.basic.opacity.black.100}',
                    lineHeight: 1,
                }
            },
            message_progress: {
                type: 'template',
                style: {
                    width: '100%',
                    height: '8px',
                    background: '{color.basic.brand.1}',
                    borderRadius: '200px',
                    overflow: 'hidden',
                    position: 'relative',
                },
                metaType: 'text',
                variant: 'progressBar',
                variantStyle: {
                    margin: '0',
                    display: 'block',
                    height: '100%',
                    background: 'linear-gradient(90deg, {color.basic.pink.2} {dimension.basic.percent.0}, {color.basic.brand.4} {dimension.basic.percent.100}), linear-gradient({dimension.basic.deg.135}, {color.basic.violet.5} {dimension.basic.percent.0}, {color.basic.blue.5} {dimension.basic.percent.100})',
                    borderRadius: '200px',
                    transition: 'width 0.3s ease',
                    width: 'calc(var(--progress-value, 0) * 1%)',
                }
            },
            message_button: {
                metaType: 'text',
                variant: 'messageButton',
                defaultText: '',
                rawContent: true,
                classStyle: {
                    position: 'relative',
                    width: '24px',
                    height: '24px',
                    flexShrink: 0,
                    cursor: 'pointer',
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '24px',
                        height: '24px',
                        maskImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10.9764 10.0006L6.85156 5.87577L8.03008 4.69727L13.3334 10.0006L8.03008 15.3038L6.85156 14.1253L10.9764 10.0006Z' fill='black'/%3E%3C/svg%3E")`,
                        maskSize: 'contain',
                        maskRepeat: 'no-repeat',
                        maskPosition: 'center',
                        WebkitMaskImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10.9764 10.0006L6.85156 5.87577L8.03008 4.69727L13.3334 10.0006L8.03008 15.3038L6.85156 14.1253L10.9764 10.0006Z' fill='black'/%3E%3C/svg%3E")`,
                        WebkitMaskSize: 'contain',
                        WebkitMaskRepeat: 'no-repeat',
                        WebkitMaskPosition: 'center',
                        backgroundColor: '{color.basic.opacity.black.100}',
                    }
                },
                variantStyle: {}
            },
        }
    },
}

export default MESSAGE_REMINDER_PROGRESS_STYLE
