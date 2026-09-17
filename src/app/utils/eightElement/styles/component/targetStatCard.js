const TARGET_STAT_CARD_STYLE = {
    // targetStatCard：目标统计卡片
    // 浅灰底白色卡片，顶部紫色小标签 + 主标题（黑色 bold 大字）+ 右上角灰色八角星装饰
    // 底部度量：大数字（紫色 bold）+ 标签（灰色）
    targetStatCard: {
        type: 'template',
        description: '目标统计卡片，适合突出展示单一目标标题与关键指标。顶部紫色 subtitle 小标签 + 黑色超大主标题 + 右上角灰色八角星装饰 + 底部紫色大数字与灰色说明标签。',
        usage: {
            guidance: '优先使用 subtitle + title + text + caption 表达"副标题 + 主标题 + 关键数字 + 数字说明"的高亮统计；需要操作按钮时使用 button 自动追加在度量行右侧。',
            psuip: `<targetStatCard>
  <subtitle>FOR MAGGIE</subtitle>
  <title>Master Calculus in 14 Dyas.</title>
  <text>240</text>
  <caption>TOTAL PROBLEMS</caption>
</targetStatCard>`
        },
        // ⚠️ 两个模式都不设 minHeight（原为 240px）：grid 里卡片高度由格子决定——grid:item 是
        //    flex 列容器，applyGridItemFill 已让直接子内容 flex:1 + min-height:0 跟随格子
        //    （见 creators/layoutCreators.js）。固定像素下限与「格」这套度量会打架：240px > 1 格(216px)
        //    时 1 行格子永远放不下——卡片被顶出格子（多出的 24px 压到下一行）、内部 flex 被挤扁
        //    （实测 2×1：标题块溢出 headerBlock 压到底部数字上，被判定 4 报 invalid）；
        //    而在装得下的格子里这个下限又不起作用（2 列宽时内容本身 ≈260px，已超过 240px）。
        layoutModes: [
            // 模式1：含按钮的横向度量行
            {
                name: 'withCommit',
                condition: 'has:button',
                style: {
                    display: 'flex',
                    flex: "1",
                    width: '100%',
                    minWidth: '440px',
                    gap: '{dimension.gap.loose}',
                    flexDirection: 'column',
                    padding: '{dimension.padding.extraloose}',
                    borderRadius: '{dimension.borderradius.xxxxl}',
                    backgroundColor: '{color.basic.brand.0}',
                    border: '1px solid {color.basic.opacity.white.64}',
                    boxSizing: 'border-box',
                    position: 'relative',
                    overflow: 'hidden',
                },
                structure: {
                    groups: [{
                        name: 'headerBlock',
                        type: 'template',
                        style: {
                            display: 'flex',
                            flex: '1',
                            flexDirection: 'column',
                            gap: '{dimension.gap.loose}',
                            justifyContent: 'flex-start',
                            position: 'relative',
                            minHeight: '0',
                        },
                        groups: [{
                            name: 'subtitleRow',
                            slots: ['subtitle'],
                            type: 'template',
                            style: {
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                position: 'relative',
                                paddingTop: '{dimension.padding.semitight}',
                                paddingRight: '96px',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    top: '50%',
                                    right: '0px',
                                    width: '72px',
                                    height: '72px',
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='101' height='101' viewBox='0 0 101 101' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M53.0049 44.4521L79.7285 17.7285L83.2637 21.2637L56.5322 47.9951H101V52.9951H56.5225L83.2637 79.7363L79.7285 83.2715L53.0049 56.5479V101H48.0049V56.5225L21.2637 83.2646L17.7285 79.7285L44.4619 52.9951H0V47.9951H44.4521L17.7285 21.2715L21.2637 17.7354L48.0049 44.4766V0H53.0049V44.4521Z' fill='black' fill-opacity='0.16'/%3E%3C/svg%3E")`,
                                    backgroundSize: 'contain',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                    pointerEvents: 'none',
                                }
                            }
                        }, {
                            name: 'titleBlock',
                            slots: ['title'],
                            type: 'template',
                            style: {
                                position: 'relative',
                            }
                        }]
                    }, {
                        name: 'metricRow',
                        type: 'template',
                        style: {
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'flex-end',
                            gap: '{dimension.gap.semitight}',
                            flexWrap: 'wrap',
                            marginTop: 'auto',
                        },
                        groups: [{
                            name: 'textGroup',
                            slots: ['text'],
                            type: 'template',
                            style: {
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'flex-end',
                                gap: '{dimension.gap.semiloose}',
                            }
                        }, {
                            name: 'captionGroup',
                            slots: ['caption'],
                            type: 'template',
                            style: {
                                flexShrink: "0",
                            }
                        }, {
                            name: 'buttonGroup',
                            slots: ['button'],
                            type: 'template',
                            style: {
                                marginLeft: 'auto',
                                flexShrink: "0",
                                alignSelf: 'center',
                            }
                        }]
                    }]
                }
            },
            // 模式2：默认，标题 + 底部数字 + 标签
            {
                name: 'default',
                condition: 'default',
                style: {
                    display: 'flex',
                    flex: "1",
                    width: '100%',
                    minWidth: '440px',
                    gap: '{dimension.gap.loose}',
                    flexDirection: 'column',
                    padding: '{dimension.padding.extraloose}',
                    borderRadius: '{dimension.borderradius.xxxxl}',
                    backgroundColor: '{color.basic.brand.0}',
                    border: '1px solid {color.basic.opacity.white.64}',
                    boxSizing: 'border-box',
                    position: 'relative',
                    overflow: 'hidden',
                },
                structure: {
                    groups: [{
                        name: 'headerBlock',
                        type: 'template',
                        style: {
                            display: 'flex',
                            flex: '1',
                            flexDirection: 'column',
                            gap: '{dimension.gap.loose}',
                            justifyContent: 'flex-start',
                            position: 'relative',
                            minHeight: '0',
                        },
                        groups: [{
                            name: 'subtitleRow',
                            slots: ['subtitle'],
                            type: 'template',
                            style: {
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                position: 'relative',
                                paddingTop: '{dimension.padding.semitight}',
                                paddingRight: '96px',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    top: '-4px',
                                    right: '0px',
                                    width: '72px',
                                    height: '72px',
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='101' height='101' viewBox='0 0 101 101' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M53.0049 44.4521L79.7285 17.7285L83.2637 21.2637L56.5322 47.9951H101V52.9951H56.5225L83.2637 79.7363L79.7285 83.2715L53.0049 56.5479V101H48.0049V56.5225L21.2637 83.2646L17.7285 79.7285L44.4619 52.9951H0V47.9951H44.4521L17.7285 21.2715L21.2637 17.7354L48.0049 44.4766V0H53.0049V44.4521Z' fill='black' fill-opacity='0.16'/%3E%3C/svg%3E")`,
                                    backgroundSize: 'contain',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center',
                                    pointerEvents: 'none',
                                }
                            }
                        }, {
                            name: 'titleBlock',
                            slots: ['title'],
                            type: 'template',
                            style: {
                                position: 'relative',
                            }
                        }]
                    }, {
                        name: 'metricRow',
                        type: 'template',
                        style: {
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'flex-end',
                            gap: '{dimension.gap.semiloose}',
                            flexWrap: 'wrap',
                            marginTop: 'auto',
                        },
                        groups: [{
                            name: 'textGroup',
                            slots: ['text'],
                            type: 'template',
                            style: {
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'flex-end',
                                gap: '{dimension.gap.semiloose}',
                            }
                        }, {
                            name: 'captionGroup',
                            slots: ['caption'],
                            type: 'template',
                            style: {
                                flexShrink: "0",
                            }
                        }]
                    }]
                }
            }
        ],
        slotConfigs: {
            subtitle: {
                optional: true,
                description: '顶部紫色小标签，用于标记主题、人名或分组。',
                metaType: 'text',
                variantStyle: {
                    margin: '0',
                    fontSize: '{font.size.large}',
                    fontWeight: '{font.fontweight.bold}',
                    color: '{color.basic.brand.5}',
                    letterSpacing: '0.5px',
                    lineHeight: '1.4',
                    textTransform: 'uppercase',
                }
            },
            title: {
                optional: false,
                description: '主标题，超大黑色 900 粗体。允许换行显示长标题。',
                metaType: 'text',
                variantStyle: {
                    margin: '0',
                    fontSize: '{font.size.xxxl}',
                    color: '{color.basic.opacity.black.100}',
                    fontWeight: '{font.fontweight.bold}',
                    lineHeight: '1.15',
                    letterSpacing: '-0.5px',
                }
            },
            text: {
                optional: true,
                description: '关键数字，超大紫色粗体，用于核心指标展示。',
                metaType: 'text',
                variantStyle: {
                    margin: '0',
                    fontSize: '72px',
                    color: '{color.basic.brand.5}',
                    fontWeight: '{font.fontweight.bold}',
                    lineHeight: '1',
                    letterSpacing: '-1px',
                }
            },
            caption: {
                optional: true,
                description: '数字说明标签，灰色大写字母，紧贴 text 右侧展示。',
                metaType: 'text',
                variantStyle: {
                    margin: '0',
                    fontSize: '{font.size.large}',
                    color: '{color.basic.opacity.black.64}',
                    fontWeight: '{font.fontweight.bold}',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    lineHeight: '1.4',
                }
            },
            button: {
                optional: true,
                description: '度量行右侧的小型主操作按钮，例如 "查看详情"。',
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    margin: '0',
                    color: 'rgba(255, 255, 255, 0.88)',
                    paddingLeft: '{dimension.padding.semitight}',
                    paddingTop: '{dimension.padding.extratight}',
                    paddingBottom: '{dimension.padding.extratight}',
                    paddingRight: '24px',
                    borderRadius: '20px',
                    fontSize: '{font.size.medium}',
                    cursor: 'pointer',
                    userSelect: 'none',
                    background: `linear-gradient(135deg, {color.basic.pink.2} 0%, {color.basic.brand.4} 100%);`,
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        right: '0px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '20px',
                        height: '20px',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10.9764 10.0006L6.85156 5.87577L8.03008 4.69727L13.3334 10.0006L8.03008 15.3038L6.85156 14.1253L10.9764 10.0006Z' fill='white' fill-opacity='0.88'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center'
                    }
                }
            }
        },
        example: {
            subtitle: 'FOR MAGGIE',
            title: 'Master Calculus in 14 Dyas.',
            text: '240',
            caption: 'TOTAL PROBLEMS',
        }
    }
};


export default TARGET_STAT_CARD_STYLE;