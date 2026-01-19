const MINIMALIST_CARD_STYLE = {
    minimalistBorderLessCard: {
        type: 'template',
        markdownMapping: {
            h2: 'title',
            h3: 'pageTitle',
            p: 'content',
        },
        style: {
            display: 'flex',
            flexDirection: 'column',
            gap: "{dimension.gap.tight}",
        },
        title: {
            metaType: 'text',
            variant: 'minimalistBorderLessCardTitle',
        },
        pageTitle: {
            metaType: 'text',
            variant: 'minimalistBorderLessCardPageTitle',
        },
        content: {
            style: {
                paddingTop: "{dimension.padding.base}",
            },
            metaType: 'text',
            variant: 'minimalistBorderLessCardContent',
        }
    },
    minimalistHeaderCard: {
        type: 'template',
        markdownMapping: {
            h2: 'title',
            h3: 'label'
        },
        style: {
            width: '360px',
            padding: "{dimension.padding.base}",
            borderTopRightRadius: "{dimension.borderradius.xl}",
            borderTopLeftRadius: "{dimension.borderradius.xl}",
            background: "{color.surfacecontainer.white100}",
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
        },
        title: {
            metaType: 'text',
            style: {
                paddingLeft: "{dimension.padding.base}",
            },
            variant: 'minimalistBorderLessCardTitle',
        },
        label: {
            metaType: 'component',
            variant: 'labelTitle',
            parameters: {
                labelBgColor: "{color.primary.brand4}"
            }
        }
    },
    minimalistListCard: {
        type: 'template',
        markdownMapping: {
            h2: 'title',
            p: 'content',
            'h3+h4:group': 'listItems.listItem*',
        },
        style: {
            // marginTop: "{dimension.margin.base}",
            display: 'flex',
            flexDirection: 'column',
            padding: "{dimension.padding.base}",
            gap: "{dimension.gap.base}",
            borderRadius: "{dimension.borderradius.xl}",
        },
        title: {
            metaType: 'text',
            style: {
                paddingTop: "{dimension.padding.base}",
                paddingLeft: "{dimension.padding.loose}",
            },
            variant: 'minimalistListCardTitle',
        },
        content: {
            metaType: 'text',
            style: {
                paddingLeft: "{dimension.padding.base}",
            },
            variant: 'minimalistListCardContent',
        },
        listItems: {
            type: 'template',
            style: {
                display: 'flex',
                flexDirection: 'row',
                gap: "{dimension.gap.loose}",
                padding: "{dimension.padding.base}",
                flexWrap: "wrap",
                justifyContent: "space-between",
            },
            "listItem*": {
                type: 'template',
                style: {
                    flex: "0 0 48%",
                    borderRadius: "{dimension.borderradius.large}",
                    background: "{color.basic.brand.1}",
                    display: 'flex',
                    padding: "{dimension.padding.base}",
                    flexDirection: 'column',
                },
                markdownMapping: {
                    h3: 'itemTitle',
                    h4: 'itemDescription',
                },
                itemTitle: {
                    metaType: 'text',
                    variant: 'minimalistListCardItemTitle',
                },
                itemDescription: {
                    metaType: 'text',
                    variant: 'minimalistListCardItemDescription',
                }
            }
        }
    },
    minimalistImageCard: {
        type: 'template',
        markdownMapping: {
            h2: 'title',
            h3: 'pageTitle',
            'img+h4+p:group': 'imageItems.imageItem*',
        },
        style: {
            display: 'flex',
            flexDirection: 'column',
            gap: "{dimension.gap.base}",
            marginTop: "{dimension.margin.base}",
            padding: "{dimension.padding.base}",
            borderRadius: "{dimension.borderradius.xl}",
        },
        title: {
            metaType: 'text',
            style: {
                paddingLeft: "{dimension.padding.base}",
            },
            variant: 'minimalistCardMainTitle',
        },
        pageTitle: {
            metaType: 'text',
            style: {
                paddingTop: "{dimension.padding.base}",
                paddingLeft: "{dimension.padding.base}",
            },
            variant: 'minimalistListCardTitle',
        },
        imageItems: {
            type: 'template',
            style: {
                display: 'flex',
                flexDirection: 'row',
                gap: "{dimension.gap.base}",
                justifyContent: "space-between",
            },
            "imageItem*": {
                type: 'template',
                style: {
                    borderRadius: "{dimension.borderradius.xl}",
                    background: "{color.basic.grey.0}",
                    overflow: 'hidden',
                    flex: "0 0 49%",
                    display: 'flex',
                    flexDirection: 'column',
                },
                markdownMapping: {
                    img: 'image',
                    h4: 'itemTitle',
                    p: 'itemDescription',
                },
                image: {
                    metaType: 'image',
                    variant: 'minimalist',
                },
                itemTitle: {
                    metaType: 'text',
                    style: {
                        marginTop: "{dimension.margin.base}",
                        paddingBottom: "{dimension.padding.base}",
                        paddingLeft: "{dimension.padding.base}",
                        paddingRight: "{dimension.padding.base}",

                    },
                    variant: 'minimalistListCardItemTitle',
                },
                itemDescription: {
                    metaType: 'text',
                    style: {
                        paddingLeft: "{dimension.padding.base}",
                        paddingRight: "{dimension.padding.base}",
                        marginBottom: "{dimension.margin.base}",
                    },
                    variant: 'minimalistBorderLessCardContent'
                }
            }
        }
    },
    minimalistButtonCard: {
        type: 'template',
        markdownMapping: {
            h2: 'title',
            p: 'content',
            'button:primary': 'buttonContainer.button',
            'button:secondary': 'buttonContainer.secondaryButton',
        },
        style: {
            display: 'flex',
            marginTop: "{dimension.margin.base}",
            flexDirection: 'column',
            gap: "{dimension.gap.base}",
            borderRadius: "{dimension.borderradius.xl}",
            padding: "{dimension.padding.base}",
        },
        title: {
            metaType: 'text',
            style: {
                paddingLeft: "{dimension.padding.base}",
                paddingTop: "{dimension.padding.base}",
                borderTop: `{dimension.borderwidth.base} solid {color.basic.grey.1}`,
                '&:first-child': {
                    borderTop: 'none',
                }
            },
            variant: 'minimalistListCardTitle',
        },
        content: {
            metaType: 'text',
            variant: 'minimalistBorderLessCardContent',
            style: {
                marginTop: "{dimension.margin.base}",
                marginBottom: "{dimension.margin.base}",
                paddingLeft: "{dimension.padding.base}",
                paddingRight: "{dimension.padding.base}",
            }
        },
        buttonContainer: {
            type: 'template',
            style: {
                display: 'flex',
                flexDirection: 'row',
            },
            button: {
                metaType: 'button',
                variant: 'primary',
            },
            secondaryButton: {
                metaType: 'button',
                variant: 'secondary',
            }
        }
    },
    minimalistChartCard: {
        type: 'template',
        markdownMapping: {
            h2: 'headerContainer.headerTitle',
            h3: 'headerContainer.right.pageTitle',
            p: 'headerContainer.right.description',
            "chart:*": 'chartContainer.chart*'
        },
        style: {
            display: 'flex',
            flexDirection: 'column',
            gap: "{dimension.gap.base}",
            borderRadius: "{dimension.borderradius.xl}",
            padding: "{dimension.padding.base}",
            background: "{color.surfacecontainer.white100}",
        },
        headerContainer: {
            type: 'template',
            style: {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: "{dimension.gap.base}",
            },

            // 左侧标题
            headerTitle: {
                style: {
                    width: '105px',
                },
                metaType: 'text',
                variant: 'minimalistChartCardHeaderTitle',
            },

            // 右侧区域
            right: {
                type: 'template',
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: "{dimension.gap.base}",
                },
                pageTitle: {
                    metaType: 'text',
                    variant: 'minimalistChartCardPageTitle',
                },
                description: {
                    metaType: 'text',
                    variant: 'minimalistChartCardDescription',
                }
            }
        },

        chartContainer: {
            type: 'template',
            style: {
                display: 'flex',
                flexDirection: 'row',
                gap: "{dimension.gap.base}",
            },
            "chart*": {
                metaType: 'chart',
                variant: 'minimalist'
            }
        }
    }
}


export default MINIMALIST_CARD_STYLE