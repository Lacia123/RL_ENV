const HEADER_CARD_STYLE = {

    headerCard: {
        type: 'template',
        markdownMapping: {
            h2: 'title',
            p: 'text',
            "chart:*": 'chartContainer.chart*'
        },
        style: {
            display: 'flex',
            flexDirection: 'column',
            padding: "{dimension.padding.extraloose} 0",
            boxShadow: "{material.hierarchy.main}",
            borderRadius: "{dimension.borderradius.xl}",
            borderWidth: "{dimension.borderwidth.narrow}",
            borderColor: "{color.surfacecontainer.black12}",
            borderStyle: "solid",
            background: "{color.surfacecontainer.white100}",
            // 嵌套选择器：重置内部ul元素的默认margin
            "& ul": {
                marginBlockStart: "0",
                marginBlockEnd: "0",
                marginTop: "0",
                marginBottom: "0"
            }
        },
        title: {
            style: {
                width: '100%',
            },
            metaType: 'text',
            variant: 'headerCardTitle',
        },
        text: {
            style: {
                padding: "0 {dimension.padding.base}",
                marginTop: "{dimension.margin.base}",
            },
            metaType: 'text',
            variant: 'headerCardText',
        },
        chartContainer: {
            type: 'template',
            style: {
                display: 'flex',
                flexDirection: 'row',
            },
            "chart*": {
                metaType: 'chart',
                variant: 'small'
            }
        }
    },

    headerPrecentCard: {
        type: 'template',
        markdownMapping: {
            h2: 'title',
            p: 'text',
            'h3+h4+p:group': 'percentItems.percentItem*', // 将h3+h4+p组合分组到percentItems容器中的percentItem
        },
        style: {
            display: 'flex',
            flexDirection: 'column',
            flexGrow: '1',
            borderRadius: "{dimension.borderradius.xl}",
            padding: "{dimension.padding.extraloose} 0",
            boxShadow: "{material.hierarchy.main}",
            borderWidth: "{dimension.borderwidth.narrow}",
            borderColor: "{color.surfacecontainer.black12}",
            borderStyle: "solid",
            background: "{color.surfacecontainer.white100}",
            // 嵌套选择器：重置内部ul元素的默认margin
            "& ul": {
                marginBlockStart: "0",
                marginBlockEnd: "0",
                marginTop: "0",
                marginBottom: "0"
            }
        },
        title: {
            style: {
                width: '100%',

            },
            metaType: 'text',
            variant: 'headerCardTitle',
        },
        text: {
            style: {
                padding: "0 {dimension.padding.base}",
                marginTop: "{dimension.margin.base}",
            },
            metaType: 'text',
            variant: 'headerCardText',
        },
        percentItems: {
            type: 'template',
            style: {
                display: 'flex',
                flexDirection: 'row',
                gap: "{dimension.gap.loose}",
                padding: "{dimension.padding.base}",
                flexWrap: "wrap",
                justifyContent: "space-between",
            },
            "percentItem*": {
                type: 'template',
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    flex: "1",
                    minWidth: "200px",
                    padding: "{dimension.padding.base}",
                    alignItems: "center",
                    textAlign: "center",
                },
                markdownMapping: {
                    h3: 'itemTitle',
                    h4: 'percentValue',
                    p: 'itemDescription',
                },
                itemTitle: {
                    style: {
                        marginBottom: "{dimension.margin.tight}",
                    },
                    metaType: 'text',
                    variant: 'percentItemTitle',
                },
                percentValue: {
                    style: {
                        marginBottom: "{dimension.margin.tight}",
                    },
                    metaType: 'text',
                    variant: 'percentValue',
                },
                itemDescription: {
                    metaType: 'text',
                    variant: 'percentItemDescription',
                }
            }
        }
    },

    // ==================== header Precent Card 新的实验样式 ====================   

    headerPrecentCardExpe: {
        type: 'template',
        markdownMapping: {
            h2: 'title',
            p: 'text',
            'h3+h4+p:group': 'percentItems.percentItem*', // 将h3+h4+p组合分组到percentItems容器中的percentItem
        },
        style: {
            display: 'flex',
            flexDirection: 'column',
            flexGrow: '1',
            borderRadius: "{dimension.borderradius.xl}",
            padding: "{dimension.padding.extraloose} 0",
            boxShadow: "{material.hierarchy.main}",
            borderWidth: "{dimension.borderwidth.narrow}",
            borderColor: "{color.surfacecontainer.black12}",
            borderStyle: "solid",
            background: "{color.surfacecontainer.white100}",
            // 嵌套选择器：重置内部ul元素的默认margin
            "& ul": {
                marginBlockStart: "0",
                marginBlockEnd: "0",
                marginTop: "0",
                marginBottom: "0"
            }
        },
        title: {
            style: {
                width: '100%',
                padding: "0 {dimension.padding.base}",
                borderLeftWidth: "{dimension.borderwidth.wide}",
                borderLeftStyle: "solid",
                borderLeftColor: "{color.primary.brand5}",
            },
            metaType: 'text',
            variant: 'headerCardTitle',
        },
        text: {
            style: {
                padding: "0 {dimension.padding.base}",
                marginTop: "{dimension.margin.base}",
            },
            metaType: 'text',
            variant: 'headerCardText',
        },
        percentItems: {
            type: 'template',
            style: {
                display: 'flex',
                flexDirection: 'row',
                gap: "{dimension.gap.loose}",
                padding: "{dimension.padding.base}",
                flexWrap: "wrap",
                justifyContent: "space-between",
            },
            "percentItem*": {
                metaType: 'component',
                variant: 'newPrecentItem',
            }
        }
    },

}

export default HEADER_CARD_STYLE