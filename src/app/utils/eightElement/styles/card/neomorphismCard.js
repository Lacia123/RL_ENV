const NEOMORPHISM_CARD_STYLE = {
    // Copy Start
    neomorphismStandard: {
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
            code: 'content.codeBlock',
            video: 'content.video'
        },
        style: {
            display: 'flex',
            flexDirection: 'column',
            borderRadius: "{dimension.borderradius.xxl}",
            padding: "{dimension.padding.base}",
            background: "{color.surface.grey1}",
            boxShadow: `{material.hierarchy.B2}, {material.hierarchy.3f}`,
            border: `{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}`,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
                content: "''",
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                background: `linear-gradient(135deg, {color.surfacecontainer.white100} 0%, {color.surface.grey2} 100%)`,
                opacity: '0.1',
                borderRadius: "{dimension.borderradius.xxl}",
            }
        },
        title: {
            style: {
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: "{dimension.padding.semiloose} {dimension.padding.loose}",
                justifyContent: 'center',
                borderRadius: "{dimension.borderradius.large}",
                background: "{color.primary.brand5}",
                boxShadow: `{material.hierarchy.B1}`,
                marginBottom: "{dimension.margin.base}",
            },
            metaType: 'text',
            variant: 'neomorphismTitle',
        },
        content: {
            type: 'template',
            style: {
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                borderRadius: "{dimension.borderradius.large}",
                background: "{color.surface.grey0}",
                padding: "{dimension.padding.loose}",
                gap: "{dimension.gap.base}",
                boxShadow: `{material.hierarchy.B1}`,
                position: 'relative',
            },
            title: {
                metaType: 'text',
                variant: 'neomorphismSubtitle',
            },
            segment: {
                metaType: 'text',
                variant: 'neomorphismSegment',
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
            }
        },
    },
}

export default NEOMORPHISM_CARD_STYLE