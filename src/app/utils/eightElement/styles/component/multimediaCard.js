const MULTIMEDIA_CARD_STYLE = {
    multimediaCard: {
        type: 'template',
        hasUpdateEvent: true,
        layoutModes: [
            {
                name: 'default',
                condition: 'true',
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '{dimension.borderradius.xl}',
                    padding: '{dimension.padding.loose}',
                    background: '{color.surfacecontainer.white100}',
                    boxShadow: '{material.hierarchy.1f}',
                    gap: '{dimension.gap.base}'
                },
                structure: {
                    groups: [
                        {
                            name: 'mediaLayer',
                            slots: ['audio', 'video'],
                            type: 'template',
                            style: {
                                position: 'relative',
                                zIndex: '0',
                                overflow: 'hidden',
                                borderRadius: '{dimension.borderradius.large}'
                            }
                        },
                        {
                            name: 'contentLayer',
                            type: 'template',
                            style: {
                                position: 'relative',
                                zIndex: '1'
                            },
                            groups: [
                                { name: 'titleBlock', slots: ['title'] },
                                { name: 'descriptionBlock', slots: ['description'] }
                            ]
                        }
                    ]
                }
            }
        ],
        slotConfigs: {
            audio: {
                metaType: 'audio',
                variant: 'standard'
            },
            video: {
                metaType: 'video',
                variant: 'standard'
            },
            title: {
                metaType: 'text',
                variant: 'multimediaCardTitle',
                variantStyle: {
                    fontSize: '{font.size.title.medium}',
                    fontWeight: '{font.weight.bold}',
                    color: '{color.content.primary}'
                }
            },
            description: {
                metaType: 'text',
                variant: 'multimediaCardDescription',
                variantStyle: {
                    fontSize: '{font.size.body.medium}',
                    color: '{color.content.secondary}'
                }
            }
        }
    },
}

export default MULTIMEDIA_CARD_STYLE