const TAB_STYLE = {
    tab: {
        standard: {
            tabContainer: {
                style: {
                    padding: "{dimension.padding.superloose} {dimension.padding.extraloose}",
                    background: `{color.basic.brand.0}`,
                    borderRadius: "{dimension.borderradius.xl}",
                    border: `{dimension.borderwidth.base} solid {color.basic.opacity.black.7}`,
                    gap: "{dimension.gap.extraloose}",
                    position: 'relative',
                    overflow: 'hidden',
                },
            },
            tabList: {
                style: {
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: "{dimension.padding.tight}",
                    gap: "{dimension.gap.base}",
                    borderRadius: "{dimension.borderradius.xxxxl}",
                    background: "{color.basic.brand.1}",
                    overflow: 'hidden'
                }
            },
            tabListItem: {
                normal: {
                    metaType: 'text',
                    variant: 'tabItemText',
                    style: {
                        flexGrow: "1",
                        padding: "{dimension.padding.tight}",
                    }
                },
                active: {
                    metaType: 'text',
                    variant: 'tabActiveItemText',
                    style: {
                        flexGrow: "1",
                        padding: "{dimension.padding.tight}",
                        background: "{color.onprimary.white100}",
                        borderRadius: "{dimension.borderradius.large}",
                    }
                }
            },
            tabPanel: {
                style: {
                    padding: "{dimension.padding.base} {dimension.padding.semiloose}",
                    borderRadius: "{dimension.borderradius.large}",
                    background: "{color.surfacecontainer.white100}",
                }
            }
        },
    },
}

export default TAB_STYLE