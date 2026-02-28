
const SUMMARY_CARD_STYLE = {
  // summaryCard 数据绑定示例
  summaryCard: {
      type: 'template',
      layoutModes: [
          // 模式1: 图片作为背景，宽按钮在底部
          {
              name: 'verticalWithBackgroundImageAndWideButton',
              condition: 'has:backgroundImage && has:commitWide',
              style: {
                  display: 'flex',
                  flex: "1",
                  width: '100%',
                  gap: '{dimension.gap.semiloose}',
                  flexDirection: 'column',
                  padding: '{dimension.padding.semiloose}',
                  borderRadius: '{dimension.borderradius.xxxxl}',
                  boxShadow: '{material.hierarchy.3f}',
                  border: '{dimension.borderwidth.narrow} solid {color.basic.opacity.white.64}',
                  position: 'relative',
                  overflow: 'hidden',
              },
              structure: {
                  groups: [{
                      name: 'backgroundImageBlock',
                      slots: ['backgroundImage'],
                      type: 'template',
                      style: {
                          position: 'absolute',
                          top: "0px",
                          left: "0px",
                          right: "0px",
                          bottom: "0px",
                          zIndex: "0",
                          '& > div': {
                            width: '100%',
                            height: '100%',
                          }
                      }
                  }, {
                      name: 'contentBlock',
                      type: 'template',
                      style: {
                          position: 'relative',
                          zIndex: "1",
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-end',
                          gap: '{dimension.gap.semiloose}',
                          overflow: 'hidden',
                          width: '100%',
                          height: '400px',
                      },
                      groups: [{
                          name: 'header',
                          type: 'template',
                          style: {
                              display: 'flex',
                              flexDirection: 'row',
                              gap: '{dimension.gap.supertight}',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              overflow: 'hidden',
                          },
                          groups: [{
                              name: 'titleGroup',
                              slots: ['icon', 'title'],
                              type: 'template',
                              style: {
                                  display: 'flex',
                                  flexDirection: 'row',
                                  gap: '{dimension.gap.semitight}',
                                  alignItems: 'center',
                                  flex: '1',
                                  overflow: 'hidden',
                              },
                              styleReference: 'titleOnBackground'
                          }]
                      }, {
                          name: 'itemContent',
                          slots: ['text'],
                          type: 'template',
                          style: {
                              display: 'flex',
                              flex: '1',
                              flexDirection: 'column',
                              width: '100%'
                          },
                          styleReference: 'textOnBackground'
                      }, {
                          name: 'commitBottomBlock',
                          slots: ['commitWide'],
                          type: 'template',
                          style: {
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'flex-start',
                              alignItems: 'center',
                              width: '100%'
                          }
                      }]
                  }]
              }
          },
          // 模式2: 图片作为背景的布局
          {
              name: 'verticalWithBackgroundImage',
              condition: 'has:backgroundImage',
              style: {
                  display: 'flex',
                  flex: "1",
                  width: '100%',
                  gap: '{dimension.gap.semiloose}',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '{dimension.padding.semiloose}',
                  borderRadius: '{dimension.borderradius.xxxxl}',
                  boxShadow: '{material.hierarchy.3f}',
                  border: '{dimension.borderwidth.narrow} solid {color.basic.opacity.white.64}',
                  position: 'relative',
                  overflow: 'hidden',
                  width: '100%',
                  height: '400px',
              },
              structure: {
                  groups: [{
                      name: 'backgroundImageBlock',
                      slots: ['backgroundImage'],
                      type: 'template',
                      style: {
                          position: 'absolute',
                          top: "0px",
                          left: "0px",
                          right: "0px",
                          bottom: "0px",
                          zIndex: "0",
                          '& > div': {
                            width: '100%',
                            height: '100%',
                          }
                      }
                  }, {
                      name: 'contentBlock',
                      type: 'template',
                      style: {
                          position: 'relative',
                          zIndex: "1",
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '{dimension.gap.semiloose}',
                          overflow: 'hidden',
                      },
                      groups: [{
                          name: 'header',
                          type: 'template',
                          style: {
                              display: 'flex',
                              flexDirection: 'row',
                              gap: '{dimension.gap.supertight}',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              overflow: 'hidden',
                          },
                          groups: [{
                              name: 'titleGroup',
                              slots: ['icon', 'title'],
                              type: 'template',
                              style: {
                                  display: 'flex',
                                  flexDirection: 'row',
                                  gap: '{dimension.gap.semitight}',
                                  alignItems: 'center',
                                  flex: '1',
                                  overflow: 'hidden',
                              },
                              styleReference: 'titleOnBackground'
                          }, {
                              name: 'commitGroup',
                              slots: ['commit'],
                              type: 'template',
                              style: {
                                  flexShrink: "0",
                              }
                          }]
                      }, {
                          name: 'itemContent',
                          slots: ['text'],
                          type: 'template',
                          style: {
                              display: 'flex',
                              flex: '1',
                              flexDirection: 'column',
                              width: '100%'
                          },
                          styleReference: 'textOnBackground'
                      }]
                  }]
              }
          },
          // 模式3: 图片在上方，宽按钮在底部
          {
              name: 'verticalWithTopImageAndWideButton',
              condition: 'has:topImage && has:commitWide',
              style: {
                  display: 'flex',
                  flex: "1",
                  width: '100%',
                  gap: '{dimension.gap.loose}',
                  flexDirection: 'column',
                  padding: '{dimension.padding.semiloose}',
                  borderRadius: '{dimension.borderradius.xxxxl}',
                  background: '{color.basic.opacity.white.48}',
                  boxShadow: '{material.hierarchy.3f}',
                  border: '{dimension.borderwidth.narrow} solid {color.basic.opacity.white.64}',
                  overflow: 'hidden',
              },
              structure: {
                  groups: [{
                      name: 'topImageBlock',
                      slots: ['topImage'],
                      type: 'template',
                      style: {
                          width: '100%',
                          height: '344px',
                          flexShrink: "0",
                          fontSize: '{font.size.medium}',
                          borderRadius: '{dimension.borderradius.large}',
                          overflow: 'hidden',
                          '& > div': {
                            width: '100%',
                            height: '100%',
                          }
                      }
                  }, {
                      name: 'contentBlock',
                      type: 'template',
                      style: {
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '{dimension.gap.semiloose}',
                          overflow: 'hidden',
                      },
                      groups: [{
                          name: 'header',
                          slots: ['icon', 'title'],
                          type: 'template',
                          style: {
                              display: 'flex',
                              flexDirection: 'row',
                              gap: '{dimension.gap.supertight}',
                              justifyContent: 'flex-start',
                              alignItems: 'center',
                              overflow: 'hidden',
                          }
                      }, {
                          name: 'itemContent',
                          slots: ['text'],
                          type: 'template',
                          style: {
                              display: 'flex',
                              flex: '1',
                              flexDirection: 'column',
                              width: '100%'
                          },
                      }, {
                          name: 'commitBottomBlock',
                          slots: ['commitWide'],
                          type: 'template',
                          style: {
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'flex-start',
                              alignItems: 'center',
                              width: '100%'
                          }
                      }]
                  }]
              }
          },
          // 模式4: 图片在上方的布局
          {
              name: 'verticalWithTopImage',
              condition: 'has:topImage',
              style: {
                  display: 'flex',
                  flex: "1",
                  width: '100%',
                  gap: '{dimension.gap.loose}',
                  flexDirection: 'column',
                  padding: '{dimension.padding.semiloose}',
                  borderRadius: '{dimension.borderradius.xxxxl}',
                  background: '{color.basic.opacity.white.48}',
                  boxShadow: '{material.hierarchy.3f}',
                  border: '{dimension.borderwidth.narrow} solid {color.basic.opacity.white.64}',
                  overflow: 'hidden',
              },
              structure: {
                  groups: [{
                      name: 'topImageBlock',
                      slots: ['topImage'],
                      type: 'template',
                      style: {
                          width: '100%',
                          height: '344px',
                          flexShrink: "0",
                          fontSize: '{font.size.medium}',
                          borderRadius: '{dimension.borderradius.large}',
                          overflow: 'hidden',
                          '& > div': {
                            width: '100%',
                            height: '100%',
                          }
                      }
                  }, {
                      name: 'contentBlock',
                      type: 'template',
                      style: {
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '{dimension.gap.semiloose}',
                          overflow: 'hidden',
                      },
                      groups: [{
                          name: 'header',
                          type: 'template',
                          style: {
                              display: 'flex',
                              flexDirection: 'row',
                              gap: '{dimension.gap.supertight}',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              overflow: 'hidden',
                          },
                          groups: [{
                              name: 'titleGroup',
                              slots: ['icon', 'title'],
                              type: 'template',
                              style: {
                                  display: 'flex',
                                  flexDirection: 'row',
                                  gap: '{dimension.gap.semitight}',
                                  alignItems: 'center',
                                  flex: '1',
                                  overflow: 'hidden',
                              }
                          }, {
                              name: 'commitGroup',
                              slots: ['commit'],
                              type: 'template',
                              style: {
                                  flexShrink: "0",
                              }
                          }]
                      }, {
                          name: 'itemContent',
                          slots: ['text'],
                          type: 'template',
                          style: {
                              display: 'flex',
                              flex: '1',
                              flexDirection: 'column',
                              width: '100%'
                          },
                      }]
                  }]
              }
          },
          // 模式5: 横向布局（有预览图片时）
          {
              name: 'horizontalWithPreview',
              condition: 'has:preview',
              style: {
                  display: 'flex',
                  flex: "1",
                  width: '100%',
                  gap: '{dimension.gap.semiloose}',
                  flexDirection: 'row',
                  padding: '{dimension.padding.semiloose}',
                  borderRadius: '{dimension.borderradius.xxxxl}',
                  background: '{color.basic.opacity.white.48}',
                  boxShadow: '{material.hierarchy.3f}',
                  border: '{dimension.borderwidth.narrow} solid {color.basic.opacity.white.64}'
              },
              structure: {
                  groups: [{
                      name: 'contentBlock',
                      type: 'template',
                      style: {
                          flex: '1',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '{dimension.gap.semiloose}',
                          overflow: 'hidden',
                      },
                      groups: [{
                          name: 'header',
                          slots: ['icon', 'title'],
                          type: 'template',
                          style: {
                              display: 'flex',
                              flexDirection: 'row',
                              gap: '{dimension.gap.supertight}',
                              justifyContent: 'flex-start',
                              alignItems: 'center',
                              overflow: 'hidden',
                          }
                      }, {
                          name: 'itemContent',
                          slots: ['text'],
                          type: 'template',
                          style: {
                              display: 'flex',
                              flex: '1',
                              flexDirection: 'column',
                              width: '100%'
                          },
                      }, {
                          name: 'commitBlock',
                          slots: ['commit'],
                          type: 'template',
                          style: {
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'flex-start',
                              alignItems: 'center'
                          }
                      }]
                  }, {
                      name: 'previewBlock',
                      slots: ['preview'],
                      type: 'template',
                      style: {
                          width: '122px',
                          height: '184px',
                          flexShrink: "0",
                          fontSize: '{font.size.medium}',
                          borderRadius: '20px',
                          borderRadius: '{dimension.borderradius.large}',
                          overflow: 'hidden',
                          '& > div': {
                            width: '100%',
                            height: '100%',
                          }
                      }
                  }]
              }
          },
          // 模式6: 纵向布局，宽按钮在底部
          {
              name: 'verticalWithWideButton',
              condition: 'has:commitWide',
              style: {
                  display: 'flex',
                  flex: "1",
                  width: '100%',
                  gap: '{dimension.gap.semiloose}',
                  flexDirection: 'column',
                  padding: '{dimension.padding.semiloose}',
                  borderRadius: '{dimension.borderradius.xxxxl}',
                  background: '{color.basic.opacity.white.48}',
                  boxShadow: '{material.hierarchy.3f}',
                  border: '{dimension.borderwidth.narrow} solid {color.basic.opacity.white.64}'
              },
              structure: {
                  groups: [{
                      name: 'header',
                      slots: ['icon', 'title'],
                      type: 'template',
                      style: {
                          display: 'flex',
                          flexDirection: 'row',
                          gap: '{dimension.gap.supertight}',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          overflow: 'hidden',
                      }
                  }, {
                      name: 'itemContent',
                      slots: ['text'],
                      type: 'template',
                      style: {
                          display: 'flex',
                          flex: '1',
                          flexDirection: 'column',
                          width: '100%'
                      },
                  }, {
                      name: 'commitBottomBlock',
                      slots: ['commitWide'],
                      type: 'template',
                      style: {
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                          width: '100%'
                      }
                  }]
              }
          },
          // 模式7: 纵向布局（有图标时）
          {
              name: 'verticalWithIcon',
              condition: 'has:icon',
              style: {
                  display: 'flex',
                  flex: "1",
                  width: '100%',
                  gap: '{dimension.gap.semiloose}',
                  flexDirection: 'column',
                  padding: '{dimension.padding.semiloose}',
                  borderRadius: '{dimension.borderradius.xxxxl}',
                  background: '{color.basic.opacity.white.48}',
                  boxShadow: '{material.hierarchy.3f}',
                  border: '{dimension.borderwidth.narrow} solid {color.basic.opacity.white.64}'
              },
              structure: {
                  groups: [{
                      name: 'header',
                      type: 'template',
                      style: {
                          display: 'flex',
                          flexDirection: 'row',
                          gap: '{dimension.gap.supertight}',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          overflow: 'hidden',
                      },
                      groups: [{
                          name: 'titleGroup',
                          slots: ['icon', 'title'],
                          type: 'template',
                          style: {
                              display: 'flex',
                              flexDirection: 'row',
                              gap: '{dimension.gap.semitight}',
                              alignItems: 'center',
                              flex: '1',
                              overflow: 'hidden',
                          }
                      }, {
                          name: 'commitGroup',
                          slots: ['commit'],
                          type: 'template',
                          style: {
                              flexShrink: "0",
                          }
                      }]
                  }, {
                      name: 'itemContent',
                      slots: ['text'],
                      type: 'template',
                      style: {
                          display: 'flex',
                          flex: '1',
                          flexDirection: 'column',
                          width: '100%'
                      },
                  }]
              }
          },
          // 模式8: 默认纵向布局
          {
              name: 'default',
              condition: 'default',
              style: {
                  display: 'flex',
                  flex: "1",
                  width: '100%',
                  gap: '{dimension.gap.semiloose}',
                  flexDirection: 'column',
                  padding: '{dimension.padding.semiloose}',
                  borderRadius: '{dimension.borderradius.xxxxl}',
                  background: '{color.basic.opacity.white.48}',
                  boxShadow: '{material.hierarchy.3f}',
                  border: '{dimension.borderwidth.narrow} solid {color.basic.opacity.white.64}'
              },
              structure: {
                  groups: [{
                      name: 'header',
                      type: 'template',
                      style: {
                          display: 'flex',
                          flexDirection: 'row',
                          gap: '{dimension.gap.supertight}',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          overflow: 'hidden',
                      },
                      groups: [{
                          name: 'titleGroup',
                          slots: ['title'],
                          type: 'template',
                          style: {
                              display: 'flex',
                              flexDirection: 'row',
                              gap: '{dimension.gap.semitight}',
                              alignItems: 'center',
                              flex: '1',
                              overflow: 'hidden',
                          }
                      }, {
                          name: 'commitGroup',
                          slots: ['commit'],
                          type: 'template',
                          style: {
                              flexShrink: "0",
                          }
                      }]
                  }, {
                      name: 'itemContent',
                      slots: ['text'],
                      type: 'template',
                      style: {
                          display: 'flex',
                          flex: '1',
                          flexDirection: 'column',
                          width: '100%'
                      },
                  }]
              }
          }
      ],
      slotConfigs: {
          title: {
              metaType: 'text',
              variantStyle: {
                  margin: '0',
                  fontSize: '{font.size.xl}',
                  color: '{color.basic.opacity.black.100}',
                  fontWeight: '900',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  '& p': {
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                  },
                  '& div': {
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                  }
              }
          },
          icon: {
              metaType: 'text',
              variantStyle: {
                  fontSize: '{font.size.medium}',
                  color: '{color.basic.opacity.white.100}',
                  lineHeight: '1',
                  flexShrink: "0",
                  width: '32px',
                  height: '32px',
                  marginBottom: '0px',
                  '&::after': {
                        content: '""',
                        position: 'absolute',
                        right: "0",
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '32px',
                        height: '32px',
                        fontSize: '{font.size.medium}',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%20%20%20%20%3Cpath%20d%3D%22M16.2492%201.77801C17.0229%202.22478%2017.4995%203.05063%2017.4995%203.94405C17.4995%204.83721%2017.976%205.6628%2018.7495%206.10938C19.523%206.55596%2019.9995%207.38127%2019.9995%208.27443V11.1597C19.9995%2012.0532%2019.5224%2012.879%2018.7488%2013.3258C17.9754%2013.7725%2017.4987%2014.5981%2017.499%2015.4911C17.4993%2016.3843%2017.0229%2017.2097%2016.2494%2017.6563L13.7495%2019.0996C12.976%2019.5462%2012.023%2019.5462%2011.2495%2019.0996C10.476%2018.653%209.52301%2018.653%208.7495%2019.0996C7.976%2019.5462%207.02301%2019.5462%206.24951%2019.0996L3.7495%2017.6563C2.97601%2017.2097%202.49951%2016.3843%202.49951%2015.4912C2.49951%2014.5981%202.02306%2013.7728%201.24963%2013.3263C0.476075%2012.8797%20-0.000394899%2012.0542%20-0.00024332%2011.161L0.000246779%208.27289C0.000398294%207.38003%200.476871%206.55494%201.25004%206.10838C2.02314%205.66186%202.49951%204.83678%202.49951%203.94399C2.49951%203.05105%202.97589%202.22595%203.7492%201.77948L6.24985%200.335747C7.02312%20-0.110698%207.97585%20-0.110616%208.74905%200.335963C9.52221%200.782519%2010.4756%200.782212%2011.2489%200.335831C12.0229%20-0.111026%2012.9773%20-0.111375%2013.7513%200.335589L16.2492%201.77801ZM11.6107%202.43634C11.2325%202.6546%2010.9995%203.05809%2010.9995%203.49477V3.7168C10.9995%204.26909%2010.5518%204.7168%209.99951%204.7168C9.44723%204.7168%208.99951%204.26909%208.99951%203.7168V3.49524C8.99951%203.05885%208.76673%202.65561%208.38883%202.43739L8.24946%202.35691C7.78538%202.08891%207.21358%202.0888%206.74939%202.35662L5.74885%202.9339C4.97518%203.38027%204.49853%204.20584%204.49853%205.09904C4.49853%205.99177%204.02221%206.81693%203.24902%207.2632C2.47584%207.70947%201.99951%208.53438%201.99951%209.42711V10.0068C1.99951%2010.9%202.47601%2011.7253%203.24951%2012.1719C4.02302%2012.6185%204.49951%2013.4438%204.49951%2014.337C4.49951%2015.2301%204.97594%2016.0554%205.74937%2016.5021L6.74875%2017.0792C7.21327%2017.3474%207.78567%2017.3473%208.25006%2017.0788L8.38861%2016.9987C8.76667%2016.7801%208.99951%2016.3765%208.99951%2015.9399V15.7168C8.99951%2015.1645%209.44723%2014.7168%209.99951%2014.7168C10.5518%2014.7168%2010.9995%2015.1645%2010.9995%2015.7168V15.9402C10.9995%2016.3773%2011.2327%2016.7811%2011.6111%2016.9997L11.7493%2017.0795C12.2135%2017.3475%2012.7855%2017.3475%2013.2496%2017.0793L14.2502%2016.5011C15.0233%2016.0544%2015.4995%2015.2293%2015.4995%2014.3365C15.4995%2013.4436%2015.9761%2012.6183%2016.7492%2012.1716C17.5227%2011.7247%2017.9995%2010.8989%2017.9995%2010.0056V9.43005C17.9995%208.53664%2017.5227%207.71094%2016.749%207.26415C15.9754%206.81739%2015.4987%205.99161%2015.499%205.09824C15.4993%204.20478%2015.0228%203.37907%2014.249%202.93234L13.2508%202.356C12.7865%202.08796%2012.2145%202.08791%2011.7502%202.35586L11.6107%202.43634ZM12.2641%2010.877C12.3524%2010.6641%2012.6467%2010.6641%2012.7349%2010.877L12.8618%2011.1816C13.0778%2011.7028%2013.4802%2012.1195%2013.9868%2012.3447L14.3452%2012.5039C14.5506%2012.5952%2014.5506%2012.8941%2014.3452%2012.9854L13.9653%2013.1543C13.4716%2013.3739%2013.0756%2013.7754%2012.8559%2014.2793L12.7329%2014.5615C12.6427%2014.7685%2012.3564%2014.7685%2012.2661%2014.5615L12.1431%2014.2793C11.9234%2013.7754%2011.5274%2013.3739%2011.0337%2013.1543L10.6538%2012.9854C10.4484%2012.8941%2010.4484%2012.5952%2010.6538%2012.5039L11.0122%2012.3447C11.5188%2012.1195%2011.9212%2011.7028%2012.1372%2011.1816L12.2641%2010.877ZM7.5874%205.4961C7.7419%205.12351%208.25721%205.1235%208.41161%205.4961L8.63331%206.03125C9.01131%206.94375%209.71561%207.67304%2010.602%208.0674L11.23%208.3457C11.5894%208.5055%2011.5892%209.0285%2011.23%209.1885L10.5649%209.4844C9.70081%209.8688%209.00811%2010.5716%208.62351%2011.4541L8.40771%2011.9492C8.24991%2012.3116%207.74924%2012.3116%207.59131%2011.9492L7.37549%2011.4541C6.99094%2010.5716%206.29826%209.8688%205.43408%209.4844L4.76904%209.1885C4.40984%209.0285%204.40973%208.5055%204.76904%208.3457L5.39697%208.0674C6.28341%207.67304%206.98783%206.94377%207.36572%206.03125L7.5874%205.4961Z%22%20fill%3D%22%23D57A06%22%2F%3E%0A%3C%2Fsvg%3E")`,  // 用控制台生成后粘贴
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundColor: '{color.basic.orange.2}',
                        border: '1px solid {color.basic.orange.1}',
                        borderRadius: '8px',
                    }
              }
          },
          commit: {
              metaType: 'text',
              variant: 'p',
              variantStyle: {
                  margin: '0',
                  color: 'rgba(255, 255, 255, 0.72)',
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
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10.9764 10.0006L6.85156 5.87577L8.03008 4.69727L13.3334 10.0006L8.03008 15.3038L6.85156 14.1253L10.9764 10.0006Z' fill='white' fill-opacity='0.72'/%3E%3C/svg%3E")`,
                        // backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center'
                    }
              }
          },
          commitWide: {
              metaType: 'text',
              variant: 'p',
              variantStyle: {
                  margin: '0',
                  cursor: 'pointer',
                  userSelect: 'none',
                  color: 'rgba(255, 255, 255, 0.72)',
                  fontSize: '{font.size.medium}',
                  padding: '{dimension.padding.base} {dimension.padding.semiloose}',
                  borderRadius: '20px',
                  background: `linear-gradient(135deg, {color.basic.pink.2} 0%, {color.basic.brand.4} 100%);`,
                  width: '100%',
                  textAlign: 'center',
              }
          },
          text: {
              metaType: 'text',
              variant: 'p',
              variantStyle: {
                  margin: '0',
                  fontSize: '{font.size.medium}',
                  color: '{color.basic.opacity.black.64}',
                  lineHeight: '1.5'
              }
          },
          preview: {
              metaType: 'image',
              variantStyle: {
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
              }
          },
          topImage: {
              metaType: 'image',
              variantStyle: {
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
              }
          },
          backgroundImage: {
              metaType: 'image',
              variantStyle: {
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
              }
          },
          // 背景图片模式下的标题样式（白色字体）
          titleOnBackground: {
              metaType: 'text',
              variantStyle: {
                  margin: '0',
                  fontSize: '{font.size.xl}',
                  color: '{color.basic.opacity.white.100}',
                  fontWeight: '900',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  '& p': {
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                  },
                  '& div': {
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                  }
              }
          },
          // 背景图片模式下的文本样式（白色字体）
          textOnBackground: {
              metaType: 'text',
              variant: 'p',
              variantStyle: {
                  margin: '0',
                  fontSize: '{font.size.small}',
                  color: '{color.basic.opacity.white.64}',
                  lineHeight: '1.5'
              }
          },
      },
      example: {
        title: '生成岗位JD完成, 我很长很长很长很长很长',
        summary: '已生成完整岗位。',
    }
  }
}


export default SUMMARY_CARD_STYLE