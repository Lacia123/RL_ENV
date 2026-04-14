const ELEGANT_CARD_STYLE = {
    // 内容区布局：无独立 title 块，h2 作为 content 内主标题
    elegantNormal: {
        type: 'template',
        markdownMapping: {
            h2: 'content.mainTitle',
            h3: 'content.title',
            p: 'content.segment',
            'button:primary': 'content.buttonContainer.button',
            'button:secondary': 'content.buttonContainer.secondaryButton',
            img: 'content.image',
            ul: 'content.list',
            table: 'content.table',
            blockquote: 'content.quote',
            code: 'content.codeBlock'
        },
        style: {
            display: 'flex',
            flexDirection: 'column',
            borderRadius: "{dimension.borderradius.xxxl}",
            padding: "{dimension.padding.semiloose}",
            background: `linear-gradient(145deg, {color.primarycontainer.brand1} 0%, {color.primarycontainer.brand2} 50%, {color.secondarycontainer.violet1} 100%)`,
            boxShadow: `{material.hierarchy.2f}`,
            border: `{dimension.borderwidth.base} solid {color.primary.brand3}`,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
                content: "''",
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                backgroundImage: `radial-gradient(circle at 25% 25%, {color.primarycontainer.brand2} 0%, transparent 50%), 
                     radial-gradient(circle at 75% 75%, {color.secondarycontainer.violet2} 0%, transparent 50%)`,
                opacity: '0.4',
                borderRadius: "{dimension.borderradius.xxxl}",
            }
        },
        content: {
            type: 'template',
            style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                width: '100%',
                borderRadius: "{dimension.borderradius.xl}",
                background: `linear-gradient(135deg, {color.surfacecontainer.white100} 0%, {color.surface.grey0} 100%)`,
                padding: "{dimension.padding.extraloose}",
                gap: "{dimension.gap.tight}",
                boxShadow: `{material.hierarchy.B1}, {material.hierarchy.main}`,
                border: `{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}`,
                position: 'relative',
                flex: '1',
                '&::before': {
                    content: "''",
                    position: 'absolute',
                    top: "{dimension.padding.base}",
                    left: "{dimension.padding.base}",
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, {color.secondary.violet4} 0%, {color.secondary.violet6} 100%)`,
                    boxShadow: `{material.hierarchy.main}`,
                },
                '&::after': {
                    content: "''",
                    position: 'absolute',
                    top: "{dimension.padding.base}",
                    right: "{dimension.padding.base}",
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, {color.secondary.violet4} 0%, {color.secondary.violet6} 100%)`,
                    boxShadow: `{material.hierarchy.main}`,
                },
                '& > *:last-child::before': {
                    content: "''",
                    position: 'absolute',
                    bottom: `calc(-{dimension.padding.extraloose} + {dimension.padding.base})`,
                    right: `calc(-{dimension.padding.extraloose} + {dimension.padding.base})`,
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, {color.secondary.violet4} 0%, {color.secondary.violet6} 100%)`,
                    boxShadow: `{material.hierarchy.main}`,
                },
                '& > *:last-child::after': {
                    content: "''",
                    position: 'absolute',
                    bottom: `calc(-{dimension.padding.extraloose} + {dimension.padding.base})`,
                    left: `calc(-{dimension.padding.extraloose} + {dimension.padding.base})`,
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, {color.secondary.violet4} 0%, {color.secondary.violet6} 100%)`,
                    boxShadow: `{material.hierarchy.main}`,
                },
            },
            mainTitle: {
                style: {
                    position: 'relative',
                    marginBottom: "{dimension.margin.tight}",
                },
                metaType: 'text',
                variant: 'elegantCardTitle',
            },
            title: {
                style: {
                    position: 'relative',
                },
                metaType: 'text',
                variant: 'elegantCardSubtitle',
            },
            segment: {
                style: {
                    position: 'relative',
                },
                metaType: 'text',
                variant: 'elegantCardSegment',
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
                    style: { alignSelf: 'flex-start' }
                },
                secondaryButton: {
                    metaType: 'button',
                    variant: 'secondary',
                    style: { alignSelf: 'flex-start' }
                },
            },
            image: {
                metaType: 'image',
                variant: 'rounded',
                style: { marginTop: "{dimension.margin.base}" }
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
            },
            audio: {
                metaType: 'audio',
                variant: 'normal'
            }
        },
    },    
    // 1. 优雅青蓝标准布局  
    elegantStandard: {
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
            code: 'content.codeBlock'
        },
        style: {
            display: 'flex',
            flexDirection: 'column',
            borderRadius: "{dimension.borderradius.xxxl}",
            padding: "{dimension.padding.semiloose}",
            background: `linear-gradient(145deg, {color.primarycontainer.brand1} 0%, {color.primarycontainer.brand2} 50%, {color.secondarycontainer.violet1} 100%)`,
            boxShadow: `{material.hierarchy.2f}`,
            border: `{dimension.borderwidth.base} solid {color.primary.brand3}`,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
                content: "''",
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                backgroundImage: `radial-gradient(circle at 25% 25%, {color.primarycontainer.brand2} 0%, transparent 50%), 
                     radial-gradient(circle at 75% 75%, {color.secondarycontainer.violet2} 0%, transparent 50%)`,
                opacity: '0.4',
                borderRadius: "{dimension.borderradius.xxxl}",
            }
        },
        title: {
            style: {
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: "{dimension.padding.base} {dimension.padding.semiloose}",
                justifyContent: 'center',
                borderRadius: "{dimension.borderradius.xl}",
                background: `linear-gradient(90deg, {color.surfacecontainer.white100} 0%, {color.secondarycontainer.violet0} 100%)`,
                boxShadow: `{material.hierarchy.1f}`,
                marginTop: "{dimension.margin.tight}",
                marginBottom: "{dimension.margin.tight}",
                border: `{dimension.borderwidth.narrow} solid {color.primary.brand4}`,
                position: 'relative',
                '&::before': {
                    content: "''",
                    position: 'absolute',
                    left: "{dimension.padding.base}",
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '3px',
                    height: '50%',
                    background: `linear-gradient(180deg, {color.primary.brand5} 0%, {color.primary.brand6} 100%)`,
                    borderRadius: "{dimension.borderradius.xs}",
                },
                '&::after': {
                    content: "''",
                    position: 'absolute',
                    right: "{dimension.padding.base}",
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '3px',
                    height: '50%',
                    background: `linear-gradient(180deg, {color.primary.brand5} 0%, {color.primary.brand6} 100%)`,
                    borderRadius: "{dimension.borderradius.xs}",
                }
            },
            metaType: 'text',
            variant: 'elegantCardTitle',
        },
        content: {
            type: 'template',
            style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                width: '100%',
                borderRadius: "{dimension.borderradius.xl}",
                background: `linear-gradient(135deg, {color.surfacecontainer.white100} 0%, {color.surface.grey0} 100%)`,
                padding: "{dimension.padding.extraloose}",
                gap: "{dimension.gap.tight}",
                boxShadow: `{material.hierarchy.B1}, {material.hierarchy.main}`,
                border: `{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}`,
                position: 'relative',
                flex: '1',
                '&::before': {
                    content: "''",
                    position: 'absolute',
                    top: "{dimension.padding.base}",
                    left: "{dimension.padding.base}",
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, {color.secondary.violet4} 0%, {color.secondary.violet6} 100%)`,
                    boxShadow: `{material.hierarchy.main}`,
                },
                '&::after': {
                    content: "''",
                    position: 'absolute',
                    top: "{dimension.padding.base}",
                    right: "{dimension.padding.base}",
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, {color.secondary.violet4} 0%, {color.secondary.violet6} 100%)`,
                    boxShadow: `{material.hierarchy.main}`,
                },
                '& > *:last-child::before': {
                    content: "''",
                    position: 'absolute',
                    bottom: `calc(-{dimension.padding.extraloose} + {dimension.padding.base})`, // 相对于content容器的位置
                    right: `calc(-{dimension.padding.extraloose} + {dimension.padding.base})`, // 相对于content容器的位置
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, {color.secondary.violet4} 0%, {color.secondary.violet6} 100%)`,
                    boxShadow: `{material.hierarchy.main}`,
                },
                '& > *:last-child::after': {
                    content: "''",
                    position: 'absolute',
                    bottom: `calc(-{dimension.padding.extraloose} + {dimension.padding.base})`, // 相对于content容器的位置
                    left: `calc(-{dimension.padding.extraloose} + {dimension.padding.base})`, // 相对于content容器的位置
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, {color.secondary.violet4} 0%, {color.secondary.violet6} 100%)`,
                    boxShadow: `{material.hierarchy.main}`,
                },
            },
            title: {
                style: {
                    position: 'relative',
                },
                metaType: 'text',
                variant: 'elegantCardSubtitle',
            },
            segment: {
                style: {
                    position: 'relative',
                },
                metaType: 'text',
                variant: 'elegantCardSegment',
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
            },
            audio: {
                metaType: 'audio',
                variant: 'normal'
            }
        },
    },
    // 2. 优雅青蓝列表布局
    elegantList: {
        type: 'template',
        markdownMapping: {
            h2: 'title',
            h3: 'content.groupTitle',
            ul: 'content.groupList',
            p: 'summary.text',
            'p+ul:group': 'content.groupBlock*',
            'p+ol:group': 'content.groupBlock*'
        },
        style: {
            display: 'flex',
            flexDirection: 'column',
            borderRadius: "{dimension.borderradius.xxxl}",
            padding: "{dimension.padding.semiloose}",
            background: `linear-gradient(145deg, {color.primarycontainer.brand1} 0%, {color.primarycontainer.brand2} 50%, {color.secondarycontainer.violet1} 100%)`,
            boxShadow: `{material.hierarchy.2f}`,
            border: `{dimension.borderwidth.base} solid {color.primary.brand3}`,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
                content: "''",
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                backgroundImage: `radial-gradient(circle at 25% 25%, {color.primarycontainer.brand2} 0%, transparent 50%), 
                     radial-gradient(circle at 75% 75%, {color.secondarycontainer.violet2} 0%, transparent 50%)`,
                opacity: '0.4',
                borderRadius: "{dimension.borderradius.xxxl}",
            },
        },
        title: {
            style: {
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: "{dimension.padding.base} {dimension.padding.semiloose}",
                justifyContent: 'center',
                borderRadius: "{dimension.borderradius.xl}",
                background: `linear-gradient(90deg, {color.surfacecontainer.white100} 0%, {color.secondarycontainer.violet0} 100%)`,
                boxShadow: `{material.hierarchy.1f}`,
                marginTop: "{dimension.margin.tight}",
                marginBottom: "{dimension.margin.tight}",
                border: `{dimension.borderwidth.narrow} solid {color.primary.brand4}`,
                position: 'relative',
                '&::before': {
                    content: "''",
                    position: 'absolute',
                    left: "{dimension.padding.base}",
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '3px',
                    height: '50%',
                    background: `linear-gradient(180deg, {color.primary.brand5} 0%, {color.primary.brand6} 100%)`,
                    borderRadius: "{dimension.borderradius.xs}",
                },
                '&::after': {
                    content: "''",
                    position: 'absolute',
                    right: "{dimension.padding.base}",
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '3px',
                    height: '50%',
                    background: `linear-gradient(180deg, {color.primary.brand5} 0%, {color.primary.brand6} 100%)`,
                    borderRadius: "{dimension.borderradius.xs}",
                }
            },
            metaType: 'text',
            variant: 'elegantCardTitle',
        },
        content: {
            type: 'template',
            style: {
                display: 'flex',
                flex: '1',
                flexDirection: 'column',
                borderRadius: "{dimension.borderradius.xl}",
                background: `linear-gradient(135deg, {color.surfacecontainer.white100} 0%, {color.surface.grey0} 100%)`,
                padding: "{dimension.padding.extraloose}",
                gap: "{dimension.gap.base}",
                boxShadow: `{material.hierarchy.B1}, {material.hierarchy.main}`,
                border: `{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}`,
                margin: "{dimension.margin.base} 0",
                position: 'relative',
                '&::before': {
                    content: "''",
                    position: 'absolute',
                    top: "{dimension.padding.base}",
                    left: "{dimension.padding.base}",
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, {color.secondary.violet4} 0%, {color.secondary.violet6} 100%)`,
                    boxShadow: `{material.hierarchy.main}`,
                },
                '&::after': {
                    content: "''",
                    position: 'absolute',
                    top: "{dimension.padding.base}",
                    right: "{dimension.padding.base}",
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, {color.secondary.violet4} 0%, {color.secondary.violet6} 100%)`,
                    boxShadow: `{material.hierarchy.main}`,
                },
                '& > *:last-child::before': {
                    content: "''",
                    position: 'absolute',
                    bottom: `calc(-{dimension.padding.extraloose} + {dimension.padding.base})`,
                    right: `calc(-{dimension.padding.extraloose} + {dimension.padding.base})`,
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, {color.secondary.violet4} 0%, {color.secondary.violet6} 100%)`,
                    boxShadow: `{material.hierarchy.main}`,
                },
                '& > *:last-child::after': {
                    content: "''",
                    position: 'absolute',
                    bottom: `calc(-{dimension.padding.extraloose} + {dimension.padding.base})`,
                    left: `calc(-{dimension.padding.extraloose} + {dimension.padding.base})`,
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, {color.secondary.violet4} 0%, {color.secondary.violet6} 100%)`,
                    boxShadow: `{material.hierarchy.main}`,
                },
            },
            groupTitle: {
                metaType: 'text',
                variant: 'elegantCardSubtitle',
                style: {
                    marginTop: "{dimension.margin.base}",
                    marginBottom: "{dimension.margin.tight}"
                }
            },
            groupList: {
                metaType: 'text',
                variant: 'elegantCardSegment',
                style: {
                    padding: "{dimension.padding.tight} {dimension.padding.base}",
                    background: "{color.secondarycontainer.violet0}",
                    borderRadius: "{dimension.borderradius.medium}",
                    borderLeft: `{dimension.borderwidth.base} solid {color.secondary.violet4}`,
                    position: 'relative',
                }
            },
            "groupBlock*": {
                type: 'template',
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: "{dimension.gap.tight}",
                    padding: "{dimension.padding.base}",
                },
                markdownMapping: {
                    p: 'groupTitle',
                    ul: 'groupList',
                    ol: 'groupList'
                },
                groupTitle: {
                    metaType: 'text',
                    variant: 'elegantCardSubtitle',
                    style: {
                        margin: "{dimension.margin.base} 0",
                        fontWeight: "{font.fontweight.semibold}"
                    }
                },
                groupList: {
                    metaType: 'text',
                    variant: 'elegantCardSegment',
                    style: {
                        padding: "{dimension.padding.tight} {dimension.padding.base}",
                        background: "{color.secondarycontainer.violet0}",
                        borderRadius: "{dimension.borderradius.medium}",
                        borderLeft: `{dimension.borderwidth.base} solid {color.secondary.violet4}`,
                        position: 'relative'
                    }
                }
            }
        },
        summary: {
            type: 'template',
            style: {
                borderRadius: "{dimension.borderradius.xl}",
                background: `linear-gradient(135deg, {color.surfacecontainer.white100} 0%, {color.surface.grey0} 100%)`,
                padding: "{dimension.padding.base}",
                boxShadow: `{material.hierarchy.B1}`,
                border: `{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}`,
            },
            text: {
                metaType: 'text',
                variant: 'elegantCardSegment'
            }
        }
    },
    // 3. 优雅青蓝表格布局
    elegantTable: {
        type: 'template',
        markdownMapping: {
            h2: 'title',
            h3: 'tableContainer.tableTitle',
            table: 'tableContainer.dataTable',
            p: 'notes.text'
        },
        style: {
            display: 'flex',
            flexGrow: '1',
            flexDirection: 'column',
            borderRadius: "{dimension.borderradius.xxxl}",
            padding: "{dimension.padding.semiloose}",
            background: `linear-gradient(145deg, {color.primarycontainer.brand1} 0%, {color.primarycontainer.brand2} 50%, {color.secondarycontainer.violet1} 100%)`,
            boxShadow: `{material.hierarchy.2f}`,
            border: `{dimension.borderwidth.base} solid {color.primary.brand3}`,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
                content: "''",
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                backgroundImage: `radial-gradient(circle at 25% 25%, {color.primarycontainer.brand2} 0%, transparent 50%), 
                     radial-gradient(circle at 75% 75%, {color.secondarycontainer.violet2} 0%, transparent 50%)`,
                opacity: '0.4',
                borderRadius: "{dimension.borderradius.xxxl}",
            }
        },
        title: {
            style: {
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                padding: "{dimension.padding.base} {dimension.padding.semiloose}",
                justifyContent: 'center',
                borderRadius: "{dimension.borderradius.xl}",
                background: `linear-gradient(90deg, {color.surfacecontainer.white100} 0%, {color.secondarycontainer.violet0} 100%)`,
                boxShadow: `{material.hierarchy.1f}`,
                marginBottom: "{dimension.margin.tight}",
                border: `{dimension.borderwidth.narrow} solid {color.primary.brand4}`,
                position: 'relative',
                '&::before': {
                    content: "''",
                    position: 'absolute',
                    left: "{dimension.padding.base}",
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '3px',
                    height: '50%',
                    background: `linear-gradient(180deg, {color.primary.brand5} 0%, {color.primary.brand6} 100%)`,
                    borderRadius: "{dimension.borderradius.xs}",
                },
                '&::after': {
                    content: "''",
                    position: 'absolute',
                    right: "{dimension.padding.base}",
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '3px',
                    height: '50%',
                    background: `linear-gradient(180deg, {color.primary.brand5} 0%, {color.primary.brand6} 100%)`,
                    borderRadius: "{dimension.borderradius.xs}",
                }
            },
            metaType: 'text',
            variant: 'elegantCardTitle',
        },
        tableContainer: {
            type: 'template',
            style: {
                display: 'flex',
                flex: '1',
                flexDirection: 'column',
                borderRadius: "{dimension.borderradius.xl}",
                background: `linear-gradient(135deg, {color.surfacecontainer.white100} 0%, {color.surface.grey0} 100%)`,
                padding: "{dimension.padding.extraloose}",
                gap: "{dimension.gap.base}",
                boxShadow: `{material.hierarchy.B1}, {material.hierarchy.main}`,
                border: `{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}`,
                marginBottom: "{dimension.margin.base}",
                position: 'relative',
                '&::before': {
                    content: "''",
                    position: 'absolute',
                    top: "{dimension.padding.base}",
                    left: "{dimension.padding.base}",
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, {color.secondary.violet4} 0%, {color.secondary.violet6} 100%)`,
                    boxShadow: `{material.hierarchy.main}`,
                },
                '&::after': {
                    content: "''",
                    position: 'absolute',
                    top: "{dimension.padding.base}",
                    right: "{dimension.padding.base}",
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, {color.secondary.violet4} 0%, {color.secondary.violet6} 100%)`,
                    boxShadow: `{material.hierarchy.main}`,
                },
                '& > *:last-child::before': {
                    content: "''",
                    position: 'absolute',
                    bottom: `calc(-{dimension.padding.extraloose} + {dimension.padding.base})`, // 相对于content容器的位置
                    right: `calc(-{dimension.padding.extraloose} + {dimension.padding.base})`, // 相对于content容器的位置
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, {color.secondary.violet4} 0%, {color.secondary.violet6} 100%)`,
                    boxShadow: `{material.hierarchy.main}`,
                },
                '& > *:last-child::after': {
                    content: "''",
                    position: 'absolute',
                    bottom: `calc(-{dimension.padding.extraloose} + {dimension.padding.base})`, // 相对于content容器的位置
                    left: `calc(-{dimension.padding.extraloose} + {dimension.padding.base})`, // 相对于content容器的位置
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, {color.secondary.violet4} 0%, {color.secondary.violet6} 100%)`,
                    boxShadow: `{material.hierarchy.main}`,
                },
            },
            tableTitle: {
                style: {
                    position: 'relative',
                },
                metaType: 'text',
                variant: 'elegantCardSubtitle',
            },
            dataTable: {
                metaType: 'table',
                style: {
                    marginTop: "{dimension.margin.base}",
                    flex: '1',
                    position: 'relative',
                }
            }
        },
        notes: {
            type: 'template',
            style: {
                borderRadius: "{dimension.borderradius.xl}",
                background: `linear-gradient(135deg, {color.surfacecontainer.white100} 0%, {color.surface.grey0} 100%)`,
                padding: "{dimension.padding.base}",
                boxShadow: `{material.hierarchy.B1}`,
                border: `{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}`,
            },
            text: {
                metaType: 'text',
                variant: 'elegantCardSegment'
            }
        }
    },
}


export default ELEGANT_CARD_STYLE