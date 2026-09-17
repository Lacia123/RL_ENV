export default {
    "dataKeys": [],
    "id": "dd-ab5ef6d7-f0f9-45b2-a953-7ef55e662444",
    "name": "layout",
    "name-zh": "布局",
    "file-type": "template",
    "theme": "default",
    "layout": {
      "style": {
        "display": "{layout.state.display.flex}",
        "layoutMode": "{layout.direction.VERTICAL}",
        "layoutWrap": "{layout.wrap.NO_WRAP}",
        "primaryAxisSizingMode": "responsive",
        "counterAxisSizingMode": "{layout.sizing.FIXED}",
        "primaryAxisAlignItems": "{layout.align.x.CENTER}",
        "counterAxisAlignItems": "{layout.align.y.items.CENTER}",
        "layoutAlign": "{layout.align.y.self.INHERIT}",
        "layoutGrow": "{layout.grow.0}",
        "width": "auto",
        "height": "auto",
        "border-width": "0",
        "border-style": "solid",
        "justify-content": "initial",
        "position": "relative",
        "back-width": "auto",
        "back-height": "100px",
        "box-sizing": "border-box",
        "border-top-left-radius": "{dimension.borderradius.20}"
      },
      "children": [
        {
          "dataKeys": [],
          "name": "layout",
          "name-zh": "布局",
          "border-color": "initial",
          "boxSizing": "border-box",
          "borderRadius": "{dimension.borderradius.8}",
          "background": "#fff",
          "file-type": "template",
          "theme": "default",
          "layout": {
            "style": {
              "display": "{layout.state.display.flex}",
              "layoutMode": "{layout.direction.HORIZONTAL}",
              "layoutWrap": "{layout.wrap.NO_WRAP}",
              "primaryAxisSizingMode": "fixed",
              "counterAxisSizingMode": "{layout.sizing.FIXED}",
              "primaryAxisAlignItems": "{layout.align.x.CENTER}",
              "counterAxisAlignItems": "{layout.align.y.items.CENTER}",
              "layoutAlign": "{layout.align.y.self.INHERIT}",
              "layoutGrow": "{layout.grow.0}",
              "boxSizing": "border-box",
              "border-style": "solid ",
              "border-width": "0",
              "border-color": "initial",
              "height": "100%",
              "width": "100%",
              "box-sizing": "border-box",
              "back-width": "100%",
              "back-height": "100%",
              "position": "relative"
            },
            "children": [
              {
                "id": "dd-59e34143-95e6-4427-a2cd-41dec840e7dd",
                "name": "text",
                "name-zh": "文本",
                "file-type": "cell-element",
                "layout": {
                  "style": {
                    "background-color": [],
                    "font": [],
                    "border": [],
                    "scale": [],
                    "box-sizing": "border-box",
                    "primaryAxisSizingMode": "fixed",
                    "position": "relative"
                  },
                  "text_body": {
                    "type": "container",
                    "content": [
                      {
                        "element": "font",
                        "value": "fontsize",
                        "prop": "default",
                        "token": "fontsize"
                      }
                    ],
                    "resource": "",
                    "data": [],
                    "style": {
                      "layoutAlign": "{layout.align.y.self.INHERIT}",
                      "layoutGrow": "{layout.grow.0}",
                      "overflow": "auto",
                      "word-break": "break-all",
                      "textColor": {
                        "element": "color",
                        "value": "text",
                        "prop": "default",
                        "token": "text"
                      },
                      "fill": {
                        "element": "color",
                        "value": "bg",
                        "prop": "default",
                        "token": "bg"
                      },
                      "fontSizes": {
                        "element": "font",
                        "value": "fontsize",
                        "prop": "default",
                        "token": "fontsize"
                      }
                    },
                    "children": []
                  },
                  "text_hyperlink": {
                    "type": "container",
                    "content": [
                      {
                        "element": "font",
                        "value": "fontsize",
                        "prop": "default",
                        "token": "fontsize"
                      }
                    ],
                    "resource": "",
                    "data": [],
                    "style": {
                      "layoutAlign": "{layout.align.y.self.INHERIT}",
                      "layoutGrow": "{layout.grow.0}",
                      "text-decoration": "underline",
                      "overflow": "auto",
                      "word-break": "break-all",
                      "textColor": {
                        "element": "color",
                        "value": "text",
                        "prop": "default",
                        "token": "hyperlinktext"
                      },
                      "fill": {
                        "element": "color",
                        "value": "bg",
                        "prop": "default",
                        "token": "bg"
                      },
                      "fontSizes": {
                        "element": "font",
                        "value": "fontsize",
                        "prop": "default",
                        "token": "fontsize"
                      }
                    },
                    "children": []
                  }
                },
                "color": {
                  "text": {
                    "default": {
                      "data-key": "",
                      "style": {
                        "text": {
                          "value": "{color.basic.opacity.black.100}",
                          "type": "color",
                          "key": "color-text"
                        },
                        "hyperlinktext": {
                          "value": "{color.basic.light-blue.5}",
                          "type": "color",
                          "key": "color-text"
                        }
                      },
                      "resource": "{color.basic.light-blue.5}"
                    },
                    "hover": {
                      "data-key": "",
                      "style": {
                        "text": {
                          "value": "{color.basic.opacity.black.100}",
                          "type": "color",
                          "key": "color-text"
                        },
                        "hyperlinktext": {
                          "value": "{color.basic.light-blue.4}",
                          "type": "color",
                          "key": "color-text"
                        }
                      },
                      "resource": "{color.basic.light-blue.4}"
                    },
                    "visited": {
                      "data-key": "",
                      "style": {
                        "hyperlinktext": {
                          "value": "{color.basic.violet.6}",
                          "type": "color",
                          "key": "color-text"
                        }
                      },
                      "resource": "{color.basic.violet.6}"
                    },
                    "active": {
                      "data-key": "",
                      "style": {
                        "hyperlinktext": {
                          "value": "{color.basic.light-blue.7}",
                          "type": "color",
                          "key": "color-text"
                        }
                      },
                      "resource": "{color.basic.light-blue.7}"
                    }
                  },
                  "bg": {
                    "default": {
                      "data-key": "",
                      "style": {
                        "bg": {
                          "value": "none",
                          "type": "color",
                          "key": "color-bg"
                        }
                      },
                      "resource": "none"
                    },
                    "hover": {
                      "data-key": "",
                      "style": {
                        "bg": {
                          "value": "none",
                          "type": "color",
                          "key": "color-bg"
                        }
                      },
                      "resource": "none"
                    },
                    "visited": {
                      "data-key": "",
                      "style": {
                        "bg": {
                          "value": "none",
                          "type": "color",
                          "key": "color-bg"
                        }
                      },
                      "resource": "none"
                    },
                    "active": {
                      "data-key": "",
                      "style": {
                        "bg": {
                          "value": "none",
                          "type": "color",
                          "key": "color-bg"
                        }
                      },
                      "resource": "none"
                    }
                  }
                },
                "scale": {
                  "min_height": {
                    "default": {
                      "data-key": "",
                      "style": {
                        "min_height": {
                          "value": "{dimension.basic.dimension.72}",
                          "type": "sizing",
                          "key": "scale-min_height"
                        }
                      },
                      "resource": "{dimension.basic.dimension.72}"
                    },
                    "hover": {
                      "data-key": "",
                      "style": {
                        "min_height": {
                          "value": "{dimension.basic.dimension.72}",
                          "type": "sizing",
                          "key": "scale-min_height"
                        }
                      },
                      "resource": "{dimension.basic.dimension.72}"
                    },
                    "visited": {
                      "data-key": "",
                      "style": {
                        "min_height": {
                          "value": "{dimension.basic.dimension.72}",
                          "type": "sizing",
                          "key": "scale-min_height"
                        }
                      },
                      "resource": "{dimension.basic.dimension.72}"
                    }
                  },
                  "max_width": {
                    "default": {
                      "data-key": "",
                      "style": {
                        "max_width": {
                          "value": "{dimension.basic.dimension.1200}",
                          "type": "sizing",
                          "key": "scale-max_width"
                        }
                      },
                      "resource": "{dimension.basic.dimension.1200}"
                    },
                    "hover": {
                      "data-key": "",
                      "style": {
                        "max_width": {
                          "value": "{dimension.basic.dimension.1200}",
                          "type": "sizing",
                          "key": "scale-max_width"
                        }
                      },
                      "resource": "{dimension.basic.dimension.1200}"
                    },
                    "visited": {
                      "data-key": "",
                      "style": {
                        "max_width": {
                          "value": "{dimension.basic.dimension.1200}",
                          "type": "sizing",
                          "key": "scale-max_width"
                        }
                      },
                      "resource": "{dimension.basic.dimension.1200}"
                    }
                  }
                },
                "font": {
                  "fontsize": {
                    "default": {
                      "data-key": "",
                      "content": "这里是文本显示内容",
                      "style": {
                        "fontsize": {
                          "value": "{font.size.large}",
                          "type": "fontSizes",
                          "key": "font-fontsize"
                        }
                      },
                      "resource": "{font.size.large}"
                    },
                    "hover": {
                      "data-key": "",
                      "content": "默认文本",
                      "style": {
                        "fontsize": {
                          "value": "{font.size.large}",
                          "type": "fontSizes",
                          "key": "font-fontsize"
                        }
                      },
                      "resource": "{font.size.large}"
                    },
                    "visited": {
                      "data-key": "",
                      "content": "默认文本",
                      "style": {
                        "fontsize": {
                          "value": "{font.size.large}",
                          "type": "fontSizes",
                          "key": "font-fontsize"
                        }
                      },
                      "resource": "{font.size.large}"
                    },
                    "active": {
                      "data-key": "",
                      "content": "默认文本",
                      "style": {
                        "fontsize": {
                          "value": "{font.size.large}",
                          "type": "fontSizes",
                          "key": "font-fontsize"
                        }
                      },
                      "resource": "{font.size.large}"
                    }
                  }
                },
                "type": "text_body",
                "state": "default",
                "events": [
                  {}
                ]
              }
            ]
          },
          "description": "",
          "id": "dd-a57e04b6-b68b-4217-a174-abd38745efd5",
          "events": [
            {}
          ]
        },
        {
          "dataKeys": [],
          "name": "layout",
          "name-zh": "布局",
          "file-type": "template",
          "theme": "default",
          "layout": {
            "style": {
              "display": "{layout.state.display.flex}",
              "layoutMode": "{layout.direction.HORIZONTAL}",
              "layoutWrap": "{layout.wrap.NO_WRAP}",
              "primaryAxisSizingMode": "fixed",
              "counterAxisSizingMode": "{layout.sizing.FIXED}",
              "primaryAxisAlignItems": "{layout.align.x.CENTER}",
              "counterAxisAlignItems": "{layout.align.y.items.CENTER}",
              "layoutAlign": "{layout.align.y.self.INHERIT}",
              "layoutGrow": "{layout.grow.0}",
              "boxSizing": "border-box",
              "border-style": "solid ",
              "border-width": "0",
              "border-color": "initial",
              "height": "100%",
              "width": "100%",
              "box-sizing": "border-box",
              "back-width": "100%",
              "back-height": "100%",
              "position": "relative",
              "margin-bottom": "{dimension.gap.24}",
              "margin-right": null,
              "gap": "{dimension.gap.24}",
              "margin-left": null,
              "margin-top": "{dimension.gap.24}"
            },
            "children": [
              {
                "id": "dd-e56d6a5b-03bf-45cc-bda3-87d7654fbb41",
                "name": "button",
                "name-zh": "按钮",
                "file-type": "cell-element",
                "layout": {
                  "style": {
                    "background-color": [],
                    "font": [],
                    "border": [],
                    "scale": [],
                    "white-space": "nowrap",
                    "overflow": "hidden",
                    "text-overflow": "ellipsis",
                    "box-sizing": "border-box",
                    "primaryAxisSizingMode": "fixed",
                    "position": "relative"
                  },
                  "button_icontextbutton": {
                    "type": "container",
                    "content": [],
                    "resource": "",
                    "data": [],
                    "style": {
                      "display": "{layout.state.display.flex}",
                      "layoutMode": "{layout.direction.HORIZONTAL}",
                      "layoutWrap": "{layout.wrap.NO_WRAP}",
                      "primaryAxisSizingMode": "{layout.sizing.AUTO}",
                      "counterAxisSizingMode": "{layout.sizing.AUTO}",
                      "primaryAxisAlignItems": "{layout.align.x.CENTER}",
                      "counterAxisAlignItems": "{layout.align.y.items.CENTER}",
                      "layoutAlign": "{layout.align.y.self.INHERIT}",
                      "layoutGrow": "{layout.grow.0}",
                      "minWidth": {
                        "element": "scale",
                        "value": "min_width",
                        "prop": "default",
                        "token": "min_width"
                      },
                      "minHeight": {
                        "element": "scale",
                        "value": "min_height",
                        "prop": "default",
                        "token": "min_height"
                      },
                      "spacing": {
                        "element": "scale",
                        "value": "padding",
                        "prop": "default",
                        "token": "padding"
                      },
                      "itemSpacing": {
                        "element": "scale",
                        "value": "gap",
                        "prop": "default",
                        "token": "gap"
                      },
                      "iconColor": {
                        "element": "color",
                        "value": "icon_color",
                        "prop": "default",
                        "token": "icon_color"
                      },
                      "icon": {
                        "element": "color",
                        "value": "icon_color",
                        "prop": "default"
                      },
                      "fontSizes": {
                        "element": "font",
                        "value": "fontsize",
                        "prop": "default",
                        "token": "fontsize"
                      },
                      "textColor": {
                        "element": "color",
                        "value": "text",
                        "prop": "default",
                        "token": "text"
                      },
                      "fill": {
                        "element": "color",
                        "value": "bg",
                        "prop": "default",
                        "token": "bg"
                      },
                      "borderRadius": {
                        "element": "shape",
                        "value": "borderradius",
                        "prop": "default",
                        "token": "borderradius"
                      },
                      "borderColor": {
                        "element": "color",
                        "value": "border",
                        "prop": "default",
                        "token": "border"
                      },
                      "borderWidth": {
                        "element": "shape",
                        "value": "borderwidth",
                        "prop": "default",
                        "token": "borderwidth"
                      },
                      "boxShadow": {
                        "element": "material",
                        "value": "elevation",
                        "prop": "default",
                        "token": "elevation"
                      }
                    },
                    "children": [
                      {
                        "content": [
                          {
                            "element": "color",
                            "value": "icon_color"
                          }
                        ],
                        "data": [],
                        "style": {
                          "layoutAlign": "{layout.align.y.self.INHERIT}",
                          "layoutGrow": "{layout.grow.0}",
                          "fill": {
                            "element": "color",
                            "value": "icon_color",
                            "prop": "default",
                            "token": "icon_color"
                          }
                        },
                        "children": []
                      },
                      {
                        "type": "text",
                        "content": [
                          {
                            "element": "font",
                            "value": "fontsize",
                            "prop": "default",
                            "token": "fontsize"
                          }
                        ],
                        "resource": "",
                        "data": [],
                        "style": {
                          "layoutAlign": "{layout.align.y.self.INHERIT}",
                          "layoutGrow": "{layout.grow.0}",
                          "fill": {
                            "element": "color",
                            "value": "text",
                            "prop": "default",
                            "token": "text"
                          },
                          "fontSizes": {
                            "element": "font",
                            "value": "fontsize",
                            "prop": "default",
                            "token": "fontsize"
                          }
                        },
                        "children": []
                      }
                    ]
                  },
                  "button_normal": {
                    "type": "container",
                    "content": [],
                    "resource": "",
                    "data": [],
                    "style": {
                      "display": "{layout.state.display.flex}",
                      "layoutMode": "{layout.direction.HORIZONTAL}",
                      "layoutWrap": "{layout.wrap.NO_WRAP}",
                      "primaryAxisSizingMode": "{layout.sizing.AUTO}",
                      "counterAxisSizingMode": "{layout.sizing.AUTO}",
                      "primaryAxisAlignItems": "{layout.align.x.CENTER}",
                      "counterAxisAlignItems": "{layout.align.y.items.CENTER}",
                      "layoutAlign": "{layout.align.y.self.INHERIT}",
                      "layoutGrow": "{layout.grow.0}",
                      "minWidth": {
                        "element": "scale",
                        "value": "min_width",
                        "prop": "default",
                        "token": "min_width"
                      },
                      "minHeight": {
                        "element": "scale",
                        "value": "min_height",
                        "prop": "default",
                        "token": "min_height"
                      },
                      "spacing": {
                        "element": "scale",
                        "value": "padding",
                        "prop": "default",
                        "token": "padding"
                      },
                      "itemSpacing": {
                        "element": "scale",
                        "value": "gap",
                        "prop": "default",
                        "token": "gap"
                      },
                      "fill": {
                        "element": "color",
                        "value": "bg",
                        "prop": "default",
                        "token": "bg"
                      },
                      "fontColor": {
                        "element": "color",
                        "value": "text",
                        "prop": "default",
                        "token": "text"
                      },
                      "fontSizes": {
                        "element": "font",
                        "value": "fontsize",
                        "prop": "default",
                        "token": "fontsize"
                      },
                      "borderRadius": {
                        "element": "shape",
                        "value": "borderradius",
                        "prop": "default",
                        "token": "borderradius"
                      },
                      "borderColor": {
                        "element": "color",
                        "value": "border",
                        "prop": "default",
                        "token": "border"
                      },
                      "borderWidth": {
                        "element": "shape",
                        "value": "borderwidth",
                        "prop": "default",
                        "token": "borderwidth"
                      },
                      "boxShadow": {
                        "element": "material",
                        "value": "elevation",
                        "prop": "default",
                        "token": "elevation"
                      }
                    },
                    "children": [
                      {
                        "content": [
                          {
                            "element": "font",
                            "value": "fontsize",
                            "prop": "default",
                            "token": "fontsize"
                          }
                        ],
                        "data": [],
                        "style": {
                          "layoutAlign": "{layout.align.y.self.INHERIT}",
                          "layoutGrow": "{layout.grow.0}",
                          "fill": {
                            "element": "color",
                            "value": "text",
                            "prop": "default",
                            "token": "text"
                          },
                          "fontSizes": {
                            "element": "font",
                            "value": "fontsize",
                            "prop": "default",
                            "token": "fontsize"
                          }
                        },
                        "children": []
                      }
                    ]
                  },
                  "button_iconbutton": {
                    "type": "container",
                    "content": [],
                    "resource": "",
                    "data": [],
                    "style": {
                      "display": "{layout.state.display.flex}",
                      "layoutMode": "{layout.direction.HORIZONTAL}",
                      "layoutWrap": "{layout.wrap.NO_WRAP}",
                      "primaryAxisSizingMode": "{layout.sizing.AUTO}",
                      "counterAxisSizingMode": "{layout.sizing.AUTO}",
                      "primaryAxisAlignItems": "{layout.align.x.CENTER}",
                      "counterAxisAlignItems": "{layout.align.y.items.CENTER}",
                      "layoutAlign": "{layout.align.y.self.INHERIT}",
                      "layoutGrow": "{layout.grow.0}",
                      "minWidth": {
                        "element": "scale",
                        "value": "min_width",
                        "prop": "default",
                        "token": "min_width"
                      },
                      "minHeight": {
                        "element": "scale",
                        "value": "min_height",
                        "prop": "default",
                        "token": "min_height"
                      },
                      "spacing": {
                        "element": "scale",
                        "value": "padding",
                        "prop": "default",
                        "token": "padding"
                      },
                      "itemSpacing": {
                        "element": "scale",
                        "value": "gap",
                        "prop": "default",
                        "token": "gap"
                      },
                      "iconColor": {
                        "element": "color",
                        "value": "icon_color",
                        "prop": "default",
                        "token": "icon_color"
                      },
                      "icon": {
                        "element": "color",
                        "value": "icon_color"
                      },
                      "fill": {
                        "element": "color",
                        "value": "bg",
                        "prop": "default",
                        "token": "bg"
                      },
                      "borderColor": {
                        "element": "color",
                        "value": "border",
                        "prop": "default",
                        "token": "border"
                      },
                      "borderWidth": {
                        "element": "shape",
                        "value": "borderwidth",
                        "prop": "default",
                        "token": "borderwidth"
                      },
                      "borderRadius": {
                        "element": "shape",
                        "value": "borderradius",
                        "prop": "default",
                        "token": "borderradius"
                      },
                      "boxShadow": {
                        "element": "material",
                        "value": "elevation",
                        "prop": "default",
                        "token": "elevation"
                      }
                    },
                    "children": [
                      {
                        "content": [
                          {
                            "element": "color",
                            "value": "icon_color"
                          }
                        ],
                        "data": [],
                        "style": {
                          "layoutAlign": "{layout.align.y.self.INHERIT}",
                          "layoutGrow": "{layout.grow.0}",
                          "fill": {
                            "element": "color",
                            "value": "icon_color",
                            "prop": "default",
                            "token": "icon_color"
                          }
                        },
                        "children": []
                      }
                    ]
                  }
                },
                "color": {
                  "bg": {
                    "default": {
                      "data-key": "",
                      "style": {
                        "bg": {
                          "value": "{color.basic.brand.5}",
                          "type": "color",
                          "key": "color-bg"
                        }
                      },
                      "resource": "{color.basic.brand.5}"
                    },
                    "hover": {
                      "data-key": "",
                      "style": {
                        "bg": {
                          "value": "{color.basic.brand.4}",
                          "type": "color",
                          "key": "color-bg"
                        }
                      },
                      "resource": "{color.basic.brand.4}"
                    },
                    "active": {
                      "data-key": "",
                      "style": {
                        "bg": {
                          "value": "{color.basic.brand.6}",
                          "type": "color",
                          "key": "color-bg"
                        }
                      },
                      "resource": "{color.basic.brand.6}"
                    },
                    "pressed": {
                      "data-key": "",
                      "style": {
                        "bg": {
                          "value": "{color.basic.brand.7}",
                          "type": "color",
                          "key": "color-bg"
                        }
                      },
                      "resource": "{color.basic.brand.7}"
                    },
                    "loading": {
                      "data-key": "",
                      "style": {
                        "bg": {
                          "value": "{color.gradient.gradient.blue2yellow}",
                          "type": "color",
                          "key": "color-bg"
                        }
                      },
                      "resource": "{color.gradient.gradient.blue2yellow}"
                    },
                    "disable": {
                      "data-key": "",
                      "style": {
                        "bg": {
                          "value": "{color.basic.grey.2}",
                          "type": "color",
                          "key": "color-bg"
                        }
                      },
                      "resource": "{color.basic.grey.2}"
                    }
                  },
                  "text": {
                    "default": {
                      "data-key": "",
                      "style": {
                        "text": {
                          "value": "{color.basic.opacity.white.100}",
                          "type": "color",
                          "key": "color-text"
                        }
                      },
                      "resource": "{color.basic.opacity.white.100}"
                    }
                  },
                  "border": {
                    "default": {
                      "data-key": "",
                      "style": {
                        "border": {
                          "value": "{color.basic.opacity.white.32}",
                          "type": "color",
                          "key": "color-border"
                        }
                      },
                      "resource": "{color.basic.opacity.white.32}"
                    },
                    "active": {
                      "data-key": "",
                      "style": {
                        "border": {
                          "value": "{color.basic.opacity.white.32}",
                          "type": "color",
                          "key": "color-border"
                        }
                      },
                      "resource": "{color.basic.opacity.white.32}"
                    },
                    "pressed": {
                      "data-key": "",
                      "style": {
                        "border": {
                          "value": "{color.basic.opacity.white.32}",
                          "type": "color",
                          "key": "color-border"
                        }
                      },
                      "resource": "{color.basic.opacity.white.32}"
                    },
                    "loading": {
                      "data-key": "",
                      "style": {
                        "border": {
                          "value": "{color.basic.opacity.white.32}",
                          "type": "color",
                          "key": "color-border"
                        }
                      },
                      "resource": "{color.basic.opacity.white.32}"
                    },
                    "disable": {
                      "data-key": "",
                      "style": {
                        "border": {
                          "value": "{color.basic.opacity.white.32}",
                          "type": "color",
                          "key": "color-border"
                        }
                      },
                      "resource": "{color.basic.opacity.white.32}"
                    },
                    "hover": {
                      "data-key": "",
                      "style": {
                        "border": {
                          "value": "{color.basic.opacity.white.32}",
                          "type": "color",
                          "key": "color-border"
                        }
                      },
                      "resource": "{color.basic.opacity.white.32}"
                    }
                  },
                  "icon_color": {
                    "default": {
                      "data-key": "",
                      "style": {
                        "icon_color": {
                          "value": "{color.basic.opacity.white.100}",
                          "type": "color",
                          "key": "color-icon_color"
                        }
                      },
                      "type": "icon",
                      "resource": "send"
                    },
                    "hover": {
                      "data-key": "",
                      "style": {
                        "icon_color": {
                          "value": "{color.basic.opacity.white.100}",
                          "type": "color",
                          "key": "color-icon_color"
                        }
                      },
                      "resource": "{color.basic.opacity.white.100}"
                    },
                    "active": {
                      "data-key": "",
                      "style": {
                        "icon_color": {
                          "value": "{color.basic.opacity.white.100}",
                          "type": "color",
                          "key": "color-icon_color"
                        }
                      },
                      "resource": "{color.basic.opacity.white.100}"
                    },
                    "pressed": {
                      "data-key": "",
                      "style": {
                        "icon_color": {
                          "value": "{color.basic.opacity.white.100}",
                          "type": "color",
                          "key": "color-icon_color"
                        }
                      },
                      "resource": "{color.basic.opacity.white.100}"
                    },
                    "loading": {
                      "data-key": "",
                      "style": {
                        "icon_color": {
                          "value": "{color.basic.opacity.white.100}",
                          "type": "color",
                          "key": "color-icon_color"
                        }
                      },
                      "resource": "{color.basic.opacity.white.100}"
                    },
                    "disable": {
                      "data-key": "",
                      "style": {
                        "icon_color": {
                          "value": "{color.basic.opacity.white.100}",
                          "type": "color",
                          "key": "color-icon_color"
                        }
                      },
                      "resource": "{color.basic.opacity.white.100}"
                    }
                  }
                },
                "shape": {
                  "borderradius": {
                    "default": {
                      "data-key": "",
                      "style": {
                        "borderradius": {
                          "value": "{dimension.borderradius.8}",
                          "type": "borderRadius",
                          "key": "shape-borderradius"
                        }
                      },
                      "resource": "{dimension.borderradius.8}"
                    },
                    "hover": {
                      "data-key": "",
                      "style": {
                        "borderradius": {
                          "value": "{dimension.borderradius.8}",
                          "type": "borderRadius",
                          "key": "shape-borderradius"
                        }
                      },
                      "resource": "{dimension.borderradius.8}"
                    },
                    "active": {
                      "data-key": "",
                      "style": {
                        "borderradius": {
                          "value": "{dimension.borderradius.8}",
                          "type": "borderRadius",
                          "key": "shape-borderradius"
                        }
                      },
                      "resource": "{dimension.borderradius.8}"
                    },
                    "pressed": {
                      "data-key": "",
                      "style": {
                        "borderradius": {
                          "value": "{dimension.borderradius.8}",
                          "type": "borderRadius",
                          "key": "shape-borderradius"
                        }
                      },
                      "resource": "{dimension.borderradius.8}"
                    },
                    "loading": {
                      "data-key": "",
                      "style": {
                        "borderradius": {
                          "value": "{dimension.borderradius.8}",
                          "type": "borderRadius",
                          "key": "shape-borderradius"
                        }
                      },
                      "resource": "{dimension.borderradius.8}"
                    },
                    "disable": {
                      "data-key": "",
                      "style": {
                        "borderradius": {
                          "value": "{dimension.borderradius.8}",
                          "type": "borderRadius",
                          "key": "shape-borderradius"
                        }
                      },
                      "resource": "{dimension.borderradius.8}"
                    }
                  },
                  "borderwidth": {
                    "default": {
                      "data-key": "",
                      "style": {
                        "borderwidth": {
                          "value": "{dimension.borderwidth.0}",
                          "type": "borderWidth",
                          "key": "shape-borderwidth"
                        }
                      },
                      "resource": "{dimension.borderwidth.0}"
                    },
                    "hover": {
                      "data-key": "",
                      "style": {
                        "borderwidth": {
                          "value": "{dimension.borderwidth.1}",
                          "type": "borderWidth",
                          "key": "shape-borderwidth"
                        }
                      },
                      "resource": "{dimension.borderwidth.1}"
                    },
                    "active": {
                      "data-key": "",
                      "style": {
                        "borderwidth": {
                          "value": "{dimension.borderwidth.2}",
                          "type": "borderWidth",
                          "key": "shape-borderwidth"
                        }
                      },
                      "resource": "{dimension.borderwidth.2}"
                    },
                    "pressed": {
                      "data-key": "",
                      "style": {
                        "borderwidth": {
                          "value": "{dimension.borderwidth.1}",
                          "type": "borderWidth",
                          "key": "shape-borderwidth"
                        }
                      },
                      "resource": "{dimension.borderwidth.1}"
                    },
                    "loading": {
                      "data-key": "",
                      "style": {
                        "borderwidth": {
                          "value": "{dimension.borderwidth.1}",
                          "type": "borderWidth",
                          "key": "shape-borderwidth"
                        }
                      },
                      "resource": "{dimension.borderwidth.1}"
                    },
                    "disable": {
                      "data-key": "",
                      "style": {
                        "borderwidth": {
                          "value": "{dimension.borderwidth.1}",
                          "type": "borderWidth",
                          "key": "shape-borderwidth"
                        }
                      },
                      "resource": "{dimension.borderwidth.1}"
                    }
                  }
                },
                "scale": {
                  "padding": {
                    "default": {
                      "data-key": "",
                      "style": {
                        "padding": {
                          "value": "{dimension.padding.8}",
                          "type": "spacing",
                          "key": "scale-padding"
                        }
                      },
                      "resource": "{dimension.padding.8}"
                    },
                    "hover": {
                      "data-key": "",
                      "style": {
                        "padding": {
                          "value": "{dimension.padding.8}",
                          "type": "spacing",
                          "key": "scale-padding"
                        }
                      },
                      "resource": "{dimension.padding.8}"
                    },
                    "active": {
                      "data-key": "",
                      "style": {
                        "padding": {
                          "value": "{dimension.padding.8}",
                          "type": "spacing",
                          "key": "scale-padding"
                        }
                      },
                      "resource": "{dimension.padding.8}"
                    },
                    "disable": {
                      "data-key": "",
                      "style": {
                        "padding": {
                          "value": "{dimension.padding.8}",
                          "type": "spacing",
                          "key": "scale-padding"
                        }
                      },
                      "resource": "{dimension.padding.8}"
                    },
                    "pressed": {
                      "data-key": "",
                      "style": {
                        "padding": {
                          "value": "{dimension.padding.8}",
                          "type": "spacing",
                          "key": "scale-padding"
                        }
                      },
                      "resource": "{dimension.padding.8}"
                    },
                    "loading": {
                      "data-key": "",
                      "style": {
                        "padding": {
                          "value": "{dimension.padding.8}",
                          "type": "spacing",
                          "key": "scale-padding"
                        }
                      },
                      "resource": "{dimension.padding.8}"
                    }
                  },
                  "gap": {
                    "default": {
                      "data-key": "",
                      "style": {
                        "gap": {
                          "value": "{dimension.gap.8}",
                          "type": "spacing",
                          "key": "scale-gap"
                        }
                      },
                      "resource": "{dimension.gap.8}"
                    },
                    "hover": {
                      "data-key": "",
                      "style": {
                        "gap": {
                          "value": "{dimension.gap.8}",
                          "type": "spacing",
                          "key": "scale-gap"
                        }
                      },
                      "resource": "{dimension.gap.8}"
                    },
                    "active": {
                      "data-key": "",
                      "style": {
                        "gap": {
                          "value": "{dimension.gap.8}",
                          "type": "spacing",
                          "key": "scale-gap"
                        }
                      },
                      "resource": "{dimension.gap.8}"
                    },
                    "disable": {
                      "data-key": "",
                      "style": {
                        "gap": {
                          "value": "{dimension.gap.8}",
                          "type": "spacing",
                          "key": "scale-gap"
                        }
                      },
                      "resource": "{dimension.gap.8}"
                    },
                    "pressed": {
                      "data-key": "",
                      "style": {
                        "gap": {
                          "value": "{dimension.gap.8}",
                          "type": "spacing",
                          "key": "scale-gap"
                        }
                      },
                      "resource": "{dimension.gap.8}"
                    },
                    "loading": {
                      "data-key": "",
                      "style": {
                        "gap": {
                          "value": "{dimension.gap.8}",
                          "type": "spacing",
                          "key": "scale-gap"
                        }
                      },
                      "resource": "{dimension.gap.8}"
                    }
                  },
                  "min_width": {
                    "default": {
                      "data-key": "",
                      "style": {
                        "min_width": {
                          "value": "{dimension.basic.dimension.0}",
                          "type": "sizing",
                          "key": "scale-min_width"
                        }
                      },
                      "resource": "{dimension.basic.dimension.0}"
                    },
                    "hover": {
                      "data-key": "",
                      "style": {
                        "min_width": {
                          "value": "{dimension.basic.dimension.0}",
                          "type": "sizing",
                          "key": "scale-min_width"
                        }
                      },
                      "resource": "{dimension.basic.dimension.0}"
                    },
                    "active": {
                      "data-key": "",
                      "style": {
                        "min_width": {
                          "value": "{dimension.basic.dimension.0}",
                          "type": "sizing",
                          "key": "scale-min_width"
                        }
                      },
                      "resource": "{dimension.basic.dimension.0}"
                    },
                    "loading": {
                      "data-key": "",
                      "style": {
                        "min_width": {
                          "value": "{dimension.basic.dimension.0}",
                          "type": "sizing",
                          "key": "scale-min_width"
                        }
                      },
                      "resource": "{dimension.basic.dimension.0}"
                    },
                    "pressed": {
                      "data-key": "",
                      "style": {
                        "min_width": {
                          "value": "{dimension.basic.dimension.0}",
                          "type": "sizing",
                          "key": "scale-min_width"
                        }
                      },
                      "resource": "{dimension.basic.dimension.0}"
                    },
                    "disable": {
                      "data-key": "",
                      "style": {
                        "min_width": {
                          "value": "{dimension.basic.dimension.0}",
                          "type": "sizing",
                          "key": "scale-min_width"
                        }
                      },
                      "resource": "{dimension.basic.dimension.0}"
                    }
                  },
                  "min_height": {
                    "default": {
                      "data-key": "",
                      "style": {
                        "min_height": {
                          "value": "{dimension.basic.dimension.0}",
                          "type": "sizing",
                          "key": "scale-min_height"
                        }
                      },
                      "resource": "{dimension.basic.dimension.0}"
                    },
                    "hover": {
                      "data-key": "",
                      "style": {
                        "min_height": {
                          "value": "{dimension.basic.dimension.0}",
                          "type": "sizing",
                          "key": "scale-min_height"
                        }
                      },
                      "resource": "{dimension.basic.dimension.0}"
                    },
                    "active": {
                      "data-key": "",
                      "style": {
                        "min_height": {
                          "value": "{dimension.basic.dimension.0}",
                          "type": "sizing",
                          "key": "scale-min_height"
                        }
                      },
                      "resource": "{dimension.basic.dimension.0}"
                    },
                    "loading": {
                      "data-key": "",
                      "style": {
                        "min_height": {
                          "value": "{dimension.basic.dimension.0}",
                          "type": "sizing",
                          "key": "scale-min_height"
                        }
                      },
                      "resource": "{dimension.basic.dimension.0}"
                    },
                    "pressed": {
                      "data-key": "",
                      "style": {
                        "min_height": {
                          "value": "{dimension.basic.dimension.0}",
                          "type": "sizing",
                          "key": "scale-min_height"
                        }
                      },
                      "resource": "{dimension.basic.dimension.0}"
                    },
                    "disable": {
                      "data-key": "",
                      "style": {
                        "min_height": {
                          "value": "{dimension.basic.dimension.0}",
                          "type": "sizing",
                          "key": "scale-min_height"
                        }
                      },
                      "resource": "{dimension.basic.dimension.0}"
                    }
                  }
                },
                "font": {
                  "fontsize": {
                    "default": {
                      "data-key": "",
                      "content": "取消",
                      "style": {
                        "fontsize": {
                          "value": "{font.size.xl}",
                          "type": "fontSizes",
                          "key": "font-fontsize"
                        }
                      },
                      "resource": "{font.size.xl}"
                    },
                    "hover": {
                      "data-key": "",
                      "content": "默认文本",
                      "style": {
                        "fontsize": {
                          "value": "{font.size.xl}",
                          "type": "fontSizes",
                          "key": "font-fontsize"
                        }
                      },
                      "resource": "{font.size.xl}"
                    },
                    "active": {
                      "data-key": "",
                      "content": "默认文本",
                      "style": {
                        "fontsize": {
                          "value": "{font.size.xl}",
                          "type": "fontSizes",
                          "key": "font-fontsize"
                        }
                      },
                      "resource": "{font.size.xl}"
                    },
                    "pressed": {
                      "data-key": "",
                      "content": "默认文本",
                      "style": {
                        "fontsize": {
                          "value": "{font.size.xl}",
                          "type": "fontSizes",
                          "key": "font-fontsize"
                        }
                      },
                      "resource": "{font.size.xl}"
                    },
                    "loading": {
                      "data-key": "",
                      "content": "默认文本",
                      "style": {
                        "fontsize": {
                          "value": "{font.size.xl}",
                          "type": "fontSizes",
                          "key": "font-fontsize"
                        }
                      },
                      "resource": "{font.size.xl}"
                    },
                    "disable": {
                      "data-key": "",
                      "content": "默认文本",
                      "style": {
                        "fontsize": {
                          "value": "{font.size.xl}",
                          "type": "fontSizes",
                          "key": "font-fontsize"
                        }
                      },
                      "resource": "{font.size.xl}"
                    }
                  }
                },
                "material": {
                  "elevation": {
                    "default": {
                      "data-key": "",
                      "style": {
                        "elevation": {
                          "value": "none",
                          "type": "boxShadow",
                          "key": "material-elevation"
                        }
                      },
                      "resource": "none"
                    },
                    "hover": {
                      "data-key": "",
                      "style": {
                        "elevation": {
                          "value": "none",
                          "type": "boxShadow",
                          "key": "material-elevation"
                        }
                      },
                      "resource": "none"
                    },
                    "active": {
                      "data-key": "",
                      "style": {
                        "elevation": {
                          "value": "none",
                          "type": "boxShadow",
                          "key": "material-elevation"
                        }
                      },
                      "resource": "none"
                    },
                    "pressed": {
                      "data-key": "",
                      "style": {
                        "elevation": {
                          "value": "none",
                          "type": "boxShadow",
                          "key": "material-elevation"
                        }
                      },
                      "resource": "none"
                    },
                    "loading": {
                      "data-key": "",
                      "style": {
                        "elevation": {
                          "value": "none",
                          "type": "boxShadow",
                          "key": "material-elevation"
                        }
                      },
                      "resource": "none"
                    },
                    "disable": {
                      "data-key": "",
                      "style": {
                        "elevation": {
                          "value": "none",
                          "type": "boxShadow",
                          "key": "material-elevation"
                        }
                      },
                      "resource": "none"
                    }
                  }
                },
                "type": "button_normal",
                "state": "default",
                "events": [
                  {}
                ]
              },
              {
                "id": "dd-3f9ffed8-7188-42d7-ad7e-126e8331298f",
                "name": "button",
                "name-zh": "按钮",
                "file-type": "cell-element",
                "layout": {
                  "style": {
                    "background-color": [],
                    "font": [],
                    "border": [],
                    "scale": [],
                    "white-space": "nowrap",
                    "overflow": "hidden",
                    "text-overflow": "ellipsis",
                    "box-sizing": "border-box",
                    "primaryAxisSizingMode": "fixed",
                    "position": "relative"
                  },
                  "button_icontextbutton": {
                    "type": "container",
                    "content": [],
                    "resource": "",
                    "data": [],
                    "style": {
                      "display": "{layout.state.display.flex}",
                      "layoutMode": "{layout.direction.HORIZONTAL}",
                      "layoutWrap": "{layout.wrap.NO_WRAP}",
                      "primaryAxisSizingMode": "{layout.sizing.AUTO}",
                      "counterAxisSizingMode": "{layout.sizing.AUTO}",
                      "primaryAxisAlignItems": "{layout.align.x.CENTER}",
                      "counterAxisAlignItems": "{layout.align.y.items.CENTER}",
                      "layoutAlign": "{layout.align.y.self.INHERIT}",
                      "layoutGrow": "{layout.grow.0}",
                      "minWidth": {
                        "element": "scale",
                        "value": "min_width",
                        "prop": "default",
                        "token": "min_width"
                      },
                      "minHeight": {
                        "element": "scale",
                        "value": "min_height",
                        "prop": "default",
                        "token": "min_height"
                      },
                      "spacing": {
                        "element": "scale",
                        "value": "padding",
                        "prop": "default",
                        "token": "padding"
                      },
                      "itemSpacing": {
                        "element": "scale",
                        "value": "gap",
                        "prop": "default",
                        "token": "gap"
                      },
                      "iconColor": {
                        "element": "color",
                        "value": "icon_color",
                        "prop": "default",
                        "token": "icon_color"
                      },
                      "icon": {
                        "element": "color",
                        "value": "icon_color",
                        "prop": "default"
                      },
                      "fontSizes": {
                        "element": "font",
                        "value": "fontsize",
                        "prop": "default",
                        "token": "fontsize"
                      },
                      "textColor": {
                        "element": "color",
                        "value": "text",
                        "prop": "default",
                        "token": "text"
                      },
                      "fill": {
                        "element": "color",
                        "value": "bg",
                        "prop": "default",
                        "token": "bg"
                      },
                      "borderRadius": {
                        "element": "shape",
                        "value": "borderradius",
                        "prop": "default",
                        "token": "borderradius"
                      },
                      "borderColor": {
                        "element": "color",
                        "value": "border",
                        "prop": "default",
                        "token": "border"
                      },
                      "borderWidth": {
                        "element": "shape",
                        "value": "borderwidth",
                        "prop": "default",
                        "token": "borderwidth"
                      },
                      "boxShadow": {
                        "element": "material",
                        "value": "elevation",
                        "prop": "default",
                        "token": "elevation"
                      }
                    },
                    "children": [
                      {
                        "content": [
                          {
                            "element": "color",
                            "value": "icon_color"
                          }
                        ],
                        "data": [],
                        "style": {
                          "layoutAlign": "{layout.align.y.self.INHERIT}",
                          "layoutGrow": "{layout.grow.0}",
                          "fill": {
                            "element": "color",
                            "value": "icon_color",
                            "prop": "default",
                            "token": "icon_color"
                          }
                        },
                        "children": []
                      },
                      {
                        "type": "text",
                        "content": [
                          {
                            "element": "font",
                            "value": "fontsize",
                            "prop": "default",
                            "token": "fontsize"
                          }
                        ],
                        "resource": "",
                        "data": [],
                        "style": {
                          "layoutAlign": "{layout.align.y.self.INHERIT}",
                          "layoutGrow": "{layout.grow.0}",
                          "fill": {
                            "element": "color",
                            "value": "text",
                            "prop": "default",
                            "token": "text"
                          },
                          "fontSizes": {
                            "element": "font",
                            "value": "fontsize",
                            "prop": "default",
                            "token": "fontsize"
                          }
                        },
                        "children": []
                      }
                    ]
                  },
                  "button_normal": {
                    "type": "container",
                    "content": [],
                    "resource": "",
                    "data": [],
                    "style": {
                      "display": "{layout.state.display.flex}",
                      "layoutMode": "{layout.direction.HORIZONTAL}",
                      "layoutWrap": "{layout.wrap.NO_WRAP}",
                      "primaryAxisSizingMode": "{layout.sizing.AUTO}",
                      "counterAxisSizingMode": "{layout.sizing.AUTO}",
                      "primaryAxisAlignItems": "{layout.align.x.CENTER}",
                      "counterAxisAlignItems": "{layout.align.y.items.CENTER}",
                      "layoutAlign": "{layout.align.y.self.INHERIT}",
                      "layoutGrow": "{layout.grow.0}",
                      "minWidth": {
                        "element": "scale",
                        "value": "min_width",
                        "prop": "default",
                        "token": "min_width"
                      },
                      "minHeight": {
                        "element": "scale",
                        "value": "min_height",
                        "prop": "default",
                        "token": "min_height"
                      },
                      "spacing": {
                        "element": "scale",
                        "value": "padding",
                        "prop": "default",
                        "token": "padding"
                      },
                      "itemSpacing": {
                        "element": "scale",
                        "value": "gap",
                        "prop": "default",
                        "token": "gap"
                      },
                      "fill": {
                        "element": "color",
                        "value": "bg",
                        "prop": "default",
                        "token": "bg"
                      },
                      "fontColor": {
                        "element": "color",
                        "value": "text",
                        "prop": "default",
                        "token": "text"
                      },
                      "fontSizes": {
                        "element": "font",
                        "value": "fontsize",
                        "prop": "default",
                        "token": "fontsize"
                      },
                      "borderRadius": {
                        "element": "shape",
                        "value": "borderradius",
                        "prop": "default",
                        "token": "borderradius"
                      },
                      "borderColor": {
                        "element": "color",
                        "value": "border",
                        "prop": "default",
                        "token": "border"
                      },
                      "borderWidth": {
                        "element": "shape",
                        "value": "borderwidth",
                        "prop": "default",
                        "token": "borderwidth"
                      },
                      "boxShadow": {
                        "element": "material",
                        "value": "elevation",
                        "prop": "default",
                        "token": "elevation"
                      }
                    },
                    "children": [
                      {
                        "content": [
                          {
                            "element": "font",
                            "value": "fontsize",
                            "prop": "default",
                            "token": "fontsize"
                          }
                        ],
                        "data": [],
                        "style": {
                          "layoutAlign": "{layout.align.y.self.INHERIT}",
                          "layoutGrow": "{layout.grow.0}",
                          "fill": {
                            "element": "color",
                            "value": "text",
                            "prop": "default",
                            "token": "text"
                          },
                          "fontSizes": {
                            "element": "font",
                            "value": "fontsize",
                            "prop": "default",
                            "token": "fontsize"
                          }
                        },
                        "children": []
                      }
                    ]
                  },
                  "button_iconbutton": {
                    "type": "container",
                    "content": [],
                    "resource": "",
                    "data": [],
                    "style": {
                      "display": "{layout.state.display.flex}",
                      "layoutMode": "{layout.direction.HORIZONTAL}",
                      "layoutWrap": "{layout.wrap.NO_WRAP}",
                      "primaryAxisSizingMode": "{layout.sizing.AUTO}",
                      "counterAxisSizingMode": "{layout.sizing.AUTO}",
                      "primaryAxisAlignItems": "{layout.align.x.CENTER}",
                      "counterAxisAlignItems": "{layout.align.y.items.CENTER}",
                      "layoutAlign": "{layout.align.y.self.INHERIT}",
                      "layoutGrow": "{layout.grow.0}",
                      "minWidth": {
                        "element": "scale",
                        "value": "min_width",
                        "prop": "default",
                        "token": "min_width"
                      },
                      "minHeight": {
                        "element": "scale",
                        "value": "min_height",
                        "prop": "default",
                        "token": "min_height"
                      },
                      "spacing": {
                        "element": "scale",
                        "value": "padding",
                        "prop": "default",
                        "token": "padding"
                      },
                      "itemSpacing": {
                        "element": "scale",
                        "value": "gap",
                        "prop": "default",
                        "token": "gap"
                      },
                      "iconColor": {
                        "element": "color",
                        "value": "icon_color",
                        "prop": "default",
                        "token": "icon_color"
                      },
                      "icon": {
                        "element": "color",
                        "value": "icon_color"
                      },
                      "fill": {
                        "element": "color",
                        "value": "bg",
                        "prop": "default",
                        "token": "bg"
                      },
                      "borderColor": {
                        "element": "color",
                        "value": "border",
                        "prop": "default",
                        "token": "border"
                      },
                      "borderWidth": {
                        "element": "shape",
                        "value": "borderwidth",
                        "prop": "default",
                        "token": "borderwidth"
                      },
                      "borderRadius": {
                        "element": "shape",
                        "value": "borderradius",
                        "prop": "default",
                        "token": "borderradius"
                      },
                      "boxShadow": {
                        "element": "material",
                        "value": "elevation",
                        "prop": "default",
                        "token": "elevation"
                      }
                    },
                    "children": [
                      {
                        "content": [
                          {
                            "element": "color",
                            "value": "icon_color"
                          }
                        ],
                        "data": [],
                        "style": {
                          "layoutAlign": "{layout.align.y.self.INHERIT}",
                          "layoutGrow": "{layout.grow.0}",
                          "fill": {
                            "element": "color",
                            "value": "icon_color",
                            "prop": "default",
                            "token": "icon_color"
                          }
                        },
                        "children": []
                      }
                    ]
                  }
                },
                "color": {
                  "bg": {
                    "default": {
                      "data-key": "",
                      "style": {
                        "bg": {
                          "value": "{color.basic.brand.5}",
                          "type": "color",
                          "key": "color-bg"
                        }
                      },
                      "resource": "{color.basic.brand.5}"
                    },
                    "hover": {
                      "data-key": "",
                      "style": {
                        "bg": {
                          "value": "{color.basic.brand.4}",
                          "type": "color",
                          "key": "color-bg"
                        }
                      },
                      "resource": "{color.basic.brand.4}"
                    },
                    "active": {
                      "data-key": "",
                      "style": {
                        "bg": {
                          "value": "{color.basic.brand.6}",
                          "type": "color",
                          "key": "color-bg"
                        }
                      },
                      "resource": "{color.basic.brand.6}"
                    },
                    "pressed": {
                      "data-key": "",
                      "style": {
                        "bg": {
                          "value": "{color.basic.brand.7}",
                          "type": "color",
                          "key": "color-bg"
                        }
                      },
                      "resource": "{color.basic.brand.7}"
                    },
                    "loading": {
                      "data-key": "",
                      "style": {
                        "bg": {
                          "value": "{color.gradient.gradient.blue2yellow}",
                          "type": "color",
                          "key": "color-bg"
                        }
                      },
                      "resource": "{color.gradient.gradient.blue2yellow}"
                    },
                    "disable": {
                      "data-key": "",
                      "style": {
                        "bg": {
                          "value": "{color.basic.grey.2}",
                          "type": "color",
                          "key": "color-bg"
                        }
                      },
                      "resource": "{color.basic.grey.2}"
                    }
                  },
                  "text": {
                    "default": {
                      "data-key": "",
                      "style": {
                        "text": {
                          "value": "{color.basic.opacity.white.100}",
                          "type": "color",
                          "key": "color-text"
                        }
                      },
                      "resource": "{color.basic.opacity.white.100}"
                    }
                  },
                  "border": {
                    "default": {
                      "data-key": "",
                      "style": {
                        "border": {
                          "value": "{color.basic.opacity.white.32}",
                          "type": "color",
                          "key": "color-border"
                        }
                      },
                      "resource": "{color.basic.opacity.white.32}"
                    },
                    "active": {
                      "data-key": "",
                      "style": {
                        "border": {
                          "value": "{color.basic.opacity.white.32}",
                          "type": "color",
                          "key": "color-border"
                        }
                      },
                      "resource": "{color.basic.opacity.white.32}"
                    },
                    "pressed": {
                      "data-key": "",
                      "style": {
                        "border": {
                          "value": "{color.basic.opacity.white.32}",
                          "type": "color",
                          "key": "color-border"
                        }
                      },
                      "resource": "{color.basic.opacity.white.32}"
                    },
                    "loading": {
                      "data-key": "",
                      "style": {
                        "border": {
                          "value": "{color.basic.opacity.white.32}",
                          "type": "color",
                          "key": "color-border"
                        }
                      },
                      "resource": "{color.basic.opacity.white.32}"
                    },
                    "disable": {
                      "data-key": "",
                      "style": {
                        "border": {
                          "value": "{color.basic.opacity.white.32}",
                          "type": "color",
                          "key": "color-border"
                        }
                      },
                      "resource": "{color.basic.opacity.white.32}"
                    },
                    "hover": {
                      "data-key": "",
                      "style": {
                        "border": {
                          "value": "{color.basic.opacity.white.32}",
                          "type": "color",
                          "key": "color-border"
                        }
                      },
                      "resource": "{color.basic.opacity.white.32}"
                    }
                  },
                  "icon_color": {
                    "default": {
                      "data-key": "",
                      "style": {
                        "icon_color": {
                          "value": "{color.basic.opacity.white.100}",
                          "type": "color",
                          "key": "color-icon_color"
                        }
                      },
                      "type": "icon",
                      "resource": "send"
                    },
                    "hover": {
                      "data-key": "",
                      "style": {
                        "icon_color": {
                          "value": "{color.basic.opacity.white.100}",
                          "type": "color",
                          "key": "color-icon_color"
                        }
                      },
                      "resource": "{color.basic.opacity.white.100}"
                    },
                    "active": {
                      "data-key": "",
                      "style": {
                        "icon_color": {
                          "value": "{color.basic.opacity.white.100}",
                          "type": "color",
                          "key": "color-icon_color"
                        }
                      },
                      "resource": "{color.basic.opacity.white.100}"
                    },
                    "pressed": {
                      "data-key": "",
                      "style": {
                        "icon_color": {
                          "value": "{color.basic.opacity.white.100}",
                          "type": "color",
                          "key": "color-icon_color"
                        }
                      },
                      "resource": "{color.basic.opacity.white.100}"
                    },
                    "loading": {
                      "data-key": "",
                      "style": {
                        "icon_color": {
                          "value": "{color.basic.opacity.white.100}",
                          "type": "color",
                          "key": "color-icon_color"
                        }
                      },
                      "resource": "{color.basic.opacity.white.100}"
                    },
                    "disable": {
                      "data-key": "",
                      "style": {
                        "icon_color": {
                          "value": "{color.basic.opacity.white.100}",
                          "type": "color",
                          "key": "color-icon_color"
                        }
                      },
                      "resource": "{color.basic.opacity.white.100}"
                    }
                  }
                },
                "shape": {
                  "borderradius": {
                    "default": {
                      "data-key": "",
                      "style": {
                        "borderradius": {
                          "value": "{dimension.borderradius.8}",
                          "type": "borderRadius",
                          "key": "shape-borderradius"
                        }
                      },
                      "resource": "{dimension.borderradius.8}"
                    },
                    "hover": {
                      "data-key": "",
                      "style": {
                        "borderradius": {
                          "value": "{dimension.borderradius.8}",
                          "type": "borderRadius",
                          "key": "shape-borderradius"
                        }
                      },
                      "resource": "{dimension.borderradius.8}"
                    },
                    "active": {
                      "data-key": "",
                      "style": {
                        "borderradius": {
                          "value": "{dimension.borderradius.8}",
                          "type": "borderRadius",
                          "key": "shape-borderradius"
                        }
                      },
                      "resource": "{dimension.borderradius.8}"
                    },
                    "pressed": {
                      "data-key": "",
                      "style": {
                        "borderradius": {
                          "value": "{dimension.borderradius.8}",
                          "type": "borderRadius",
                          "key": "shape-borderradius"
                        }
                      },
                      "resource": "{dimension.borderradius.8}"
                    },
                    "loading": {
                      "data-key": "",
                      "style": {
                        "borderradius": {
                          "value": "{dimension.borderradius.8}",
                          "type": "borderRadius",
                          "key": "shape-borderradius"
                        }
                      },
                      "resource": "{dimension.borderradius.8}"
                    },
                    "disable": {
                      "data-key": "",
                      "style": {
                        "borderradius": {
                          "value": "{dimension.borderradius.8}",
                          "type": "borderRadius",
                          "key": "shape-borderradius"
                        }
                      },
                      "resource": "{dimension.borderradius.8}"
                    }
                  },
                  "borderwidth": {
                    "default": {
                      "data-key": "",
                      "style": {
                        "borderwidth": {
                          "value": "{dimension.borderwidth.0}",
                          "type": "borderWidth",
                          "key": "shape-borderwidth"
                        }
                      },
                      "resource": "{dimension.borderwidth.0}"
                    },
                    "hover": {
                      "data-key": "",
                      "style": {
                        "borderwidth": {
                          "value": "{dimension.borderwidth.1}",
                          "type": "borderWidth",
                          "key": "shape-borderwidth"
                        }
                      },
                      "resource": "{dimension.borderwidth.1}"
                    },
                    "active": {
                      "data-key": "",
                      "style": {
                        "borderwidth": {
                          "value": "{dimension.borderwidth.2}",
                          "type": "borderWidth",
                          "key": "shape-borderwidth"
                        }
                      },
                      "resource": "{dimension.borderwidth.2}"
                    },
                    "pressed": {
                      "data-key": "",
                      "style": {
                        "borderwidth": {
                          "value": "{dimension.borderwidth.1}",
                          "type": "borderWidth",
                          "key": "shape-borderwidth"
                        }
                      },
                      "resource": "{dimension.borderwidth.1}"
                    },
                    "loading": {
                      "data-key": "",
                      "style": {
                        "borderwidth": {
                          "value": "{dimension.borderwidth.1}",
                          "type": "borderWidth",
                          "key": "shape-borderwidth"
                        }
                      },
                      "resource": "{dimension.borderwidth.1}"
                    },
                    "disable": {
                      "data-key": "",
                      "style": {
                        "borderwidth": {
                          "value": "{dimension.borderwidth.1}",
                          "type": "borderWidth",
                          "key": "shape-borderwidth"
                        }
                      },
                      "resource": "{dimension.borderwidth.1}"
                    }
                  }
                },
                "scale": {
                  "padding": {
                    "default": {
                      "data-key": "",
                      "style": {
                        "padding": {
                          "value": "{dimension.padding.8}",
                          "type": "spacing",
                          "key": "scale-padding"
                        }
                      },
                      "resource": "{dimension.padding.8}"
                    },
                    "hover": {
                      "data-key": "",
                      "style": {
                        "padding": {
                          "value": "{dimension.padding.8}",
                          "type": "spacing",
                          "key": "scale-padding"
                        }
                      },
                      "resource": "{dimension.padding.8}"
                    },
                    "active": {
                      "data-key": "",
                      "style": {
                        "padding": {
                          "value": "{dimension.padding.8}",
                          "type": "spacing",
                          "key": "scale-padding"
                        }
                      },
                      "resource": "{dimension.padding.8}"
                    },
                    "disable": {
                      "data-key": "",
                      "style": {
                        "padding": {
                          "value": "{dimension.padding.8}",
                          "type": "spacing",
                          "key": "scale-padding"
                        }
                      },
                      "resource": "{dimension.padding.8}"
                    },
                    "pressed": {
                      "data-key": "",
                      "style": {
                        "padding": {
                          "value": "{dimension.padding.8}",
                          "type": "spacing",
                          "key": "scale-padding"
                        }
                      },
                      "resource": "{dimension.padding.8}"
                    },
                    "loading": {
                      "data-key": "",
                      "style": {
                        "padding": {
                          "value": "{dimension.padding.8}",
                          "type": "spacing",
                          "key": "scale-padding"
                        }
                      },
                      "resource": "{dimension.padding.8}"
                    }
                  },
                  "gap": {
                    "default": {
                      "data-key": "",
                      "style": {
                        "gap": {
                          "value": "{dimension.gap.8}",
                          "type": "spacing",
                          "key": "scale-gap"
                        }
                      },
                      "resource": "{dimension.gap.8}"
                    },
                    "hover": {
                      "data-key": "",
                      "style": {
                        "gap": {
                          "value": "{dimension.gap.8}",
                          "type": "spacing",
                          "key": "scale-gap"
                        }
                      },
                      "resource": "{dimension.gap.8}"
                    },
                    "active": {
                      "data-key": "",
                      "style": {
                        "gap": {
                          "value": "{dimension.gap.8}",
                          "type": "spacing",
                          "key": "scale-gap"
                        }
                      },
                      "resource": "{dimension.gap.8}"
                    },
                    "disable": {
                      "data-key": "",
                      "style": {
                        "gap": {
                          "value": "{dimension.gap.8}",
                          "type": "spacing",
                          "key": "scale-gap"
                        }
                      },
                      "resource": "{dimension.gap.8}"
                    },
                    "pressed": {
                      "data-key": "",
                      "style": {
                        "gap": {
                          "value": "{dimension.gap.8}",
                          "type": "spacing",
                          "key": "scale-gap"
                        }
                      },
                      "resource": "{dimension.gap.8}"
                    },
                    "loading": {
                      "data-key": "",
                      "style": {
                        "gap": {
                          "value": "{dimension.gap.8}",
                          "type": "spacing",
                          "key": "scale-gap"
                        }
                      },
                      "resource": "{dimension.gap.8}"
                    }
                  },
                  "min_width": {
                    "default": {
                      "data-key": "",
                      "style": {
                        "min_width": {
                          "value": "{dimension.basic.dimension.0}",
                          "type": "sizing",
                          "key": "scale-min_width"
                        }
                      },
                      "resource": "{dimension.basic.dimension.0}"
                    },
                    "hover": {
                      "data-key": "",
                      "style": {
                        "min_width": {
                          "value": "{dimension.basic.dimension.0}",
                          "type": "sizing",
                          "key": "scale-min_width"
                        }
                      },
                      "resource": "{dimension.basic.dimension.0}"
                    },
                    "active": {
                      "data-key": "",
                      "style": {
                        "min_width": {
                          "value": "{dimension.basic.dimension.0}",
                          "type": "sizing",
                          "key": "scale-min_width"
                        }
                      },
                      "resource": "{dimension.basic.dimension.0}"
                    },
                    "loading": {
                      "data-key": "",
                      "style": {
                        "min_width": {
                          "value": "{dimension.basic.dimension.0}",
                          "type": "sizing",
                          "key": "scale-min_width"
                        }
                      },
                      "resource": "{dimension.basic.dimension.0}"
                    },
                    "pressed": {
                      "data-key": "",
                      "style": {
                        "min_width": {
                          "value": "{dimension.basic.dimension.0}",
                          "type": "sizing",
                          "key": "scale-min_width"
                        }
                      },
                      "resource": "{dimension.basic.dimension.0}"
                    },
                    "disable": {
                      "data-key": "",
                      "style": {
                        "min_width": {
                          "value": "{dimension.basic.dimension.0}",
                          "type": "sizing",
                          "key": "scale-min_width"
                        }
                      },
                      "resource": "{dimension.basic.dimension.0}"
                    }
                  },
                  "min_height": {
                    "default": {
                      "data-key": "",
                      "style": {
                        "min_height": {
                          "value": "{dimension.basic.dimension.0}",
                          "type": "sizing",
                          "key": "scale-min_height"
                        }
                      },
                      "resource": "{dimension.basic.dimension.0}"
                    },
                    "hover": {
                      "data-key": "",
                      "style": {
                        "min_height": {
                          "value": "{dimension.basic.dimension.0}",
                          "type": "sizing",
                          "key": "scale-min_height"
                        }
                      },
                      "resource": "{dimension.basic.dimension.0}"
                    },
                    "active": {
                      "data-key": "",
                      "style": {
                        "min_height": {
                          "value": "{dimension.basic.dimension.0}",
                          "type": "sizing",
                          "key": "scale-min_height"
                        }
                      },
                      "resource": "{dimension.basic.dimension.0}"
                    },
                    "loading": {
                      "data-key": "",
                      "style": {
                        "min_height": {
                          "value": "{dimension.basic.dimension.0}",
                          "type": "sizing",
                          "key": "scale-min_height"
                        }
                      },
                      "resource": "{dimension.basic.dimension.0}"
                    },
                    "pressed": {
                      "data-key": "",
                      "style": {
                        "min_height": {
                          "value": "{dimension.basic.dimension.0}",
                          "type": "sizing",
                          "key": "scale-min_height"
                        }
                      },
                      "resource": "{dimension.basic.dimension.0}"
                    },
                    "disable": {
                      "data-key": "",
                      "style": {
                        "min_height": {
                          "value": "{dimension.basic.dimension.0}",
                          "type": "sizing",
                          "key": "scale-min_height"
                        }
                      },
                      "resource": "{dimension.basic.dimension.0}"
                    }
                  }
                },
                "font": {
                  "fontsize": {
                    "default": {
                      "data-key": "",
                      "content": "确认",
                      "style": {
                        "fontsize": {
                          "value": "{font.size.xl}",
                          "type": "fontSizes",
                          "key": "font-fontsize"
                        }
                      },
                      "resource": "{font.size.xl}"
                    },
                    "hover": {
                      "data-key": "",
                      "content": "默认文本",
                      "style": {
                        "fontsize": {
                          "value": "{font.size.xl}",
                          "type": "fontSizes",
                          "key": "font-fontsize"
                        }
                      },
                      "resource": "{font.size.xl}"
                    },
                    "active": {
                      "data-key": "",
                      "content": "默认文本",
                      "style": {
                        "fontsize": {
                          "value": "{font.size.xl}",
                          "type": "fontSizes",
                          "key": "font-fontsize"
                        }
                      },
                      "resource": "{font.size.xl}"
                    },
                    "pressed": {
                      "data-key": "",
                      "content": "默认文本",
                      "style": {
                        "fontsize": {
                          "value": "{font.size.xl}",
                          "type": "fontSizes",
                          "key": "font-fontsize"
                        }
                      },
                      "resource": "{font.size.xl}"
                    },
                    "loading": {
                      "data-key": "",
                      "content": "默认文本",
                      "style": {
                        "fontsize": {
                          "value": "{font.size.xl}",
                          "type": "fontSizes",
                          "key": "font-fontsize"
                        }
                      },
                      "resource": "{font.size.xl}"
                    },
                    "disable": {
                      "data-key": "",
                      "content": "默认文本",
                      "style": {
                        "fontsize": {
                          "value": "{font.size.xl}",
                          "type": "fontSizes",
                          "key": "font-fontsize"
                        }
                      },
                      "resource": "{font.size.xl}"
                    }
                  }
                },
                "material": {
                  "elevation": {
                    "default": {
                      "data-key": "",
                      "style": {
                        "elevation": {
                          "value": "none",
                          "type": "boxShadow",
                          "key": "material-elevation"
                        }
                      },
                      "resource": "none"
                    },
                    "hover": {
                      "data-key": "",
                      "style": {
                        "elevation": {
                          "value": "none",
                          "type": "boxShadow",
                          "key": "material-elevation"
                        }
                      },
                      "resource": "none"
                    },
                    "active": {
                      "data-key": "",
                      "style": {
                        "elevation": {
                          "value": "none",
                          "type": "boxShadow",
                          "key": "material-elevation"
                        }
                      },
                      "resource": "none"
                    },
                    "pressed": {
                      "data-key": "",
                      "style": {
                        "elevation": {
                          "value": "none",
                          "type": "boxShadow",
                          "key": "material-elevation"
                        }
                      },
                      "resource": "none"
                    },
                    "loading": {
                      "data-key": "",
                      "style": {
                        "elevation": {
                          "value": "none",
                          "type": "boxShadow",
                          "key": "material-elevation"
                        }
                      },
                      "resource": "none"
                    },
                    "disable": {
                      "data-key": "",
                      "style": {
                        "elevation": {
                          "value": "none",
                          "type": "boxShadow",
                          "key": "material-elevation"
                        }
                      },
                      "resource": "none"
                    }
                  }
                },
                "state": "default",
                "events": [
                  {}
                ],
                "type": "button_normal"
              }
            ]
          },
          "description": "",
          "id": "dd-3f284a65-f1e8-40d8-8f61-c3e1d522e6e3",
          "events": [
            {}
          ]
        },
        {
          "dataKeys": [],
          "name": "layout",
          "name-zh": "布局",
          "file-type": "template",
          "theme": "default",
          "layout": {
            "style": {
              "display": "{layout.state.display.flex}",
              "layoutMode": "{layout.direction.HORIZONTAL}",
              "layoutWrap": "{layout.wrap.NO_WRAP}",
              "primaryAxisSizingMode": "fixed",
              "counterAxisSizingMode": "{layout.sizing.FIXED}",
              "primaryAxisAlignItems": "{layout.align.x.CENTER}",
              "counterAxisAlignItems": "{layout.align.y.items.CENTER}",
              "layoutAlign": "{layout.align.y.self.INHERIT}",
              "layoutGrow": "{layout.grow.0}",
              "boxSizing": "border-box",
              "border-style": "solid ",
              "border-width": "0",
              "border-color": "initial",
              "height": "400px",
              "width": "400px",
              "box-sizing": "border-box",
              "back-width": "400px",
              "back-height": "400px",
              "position": "relative"
            },
            "children": [
              {
                "id": "dd-626a4c20-d4e8-49c3-b634-dfea7f8cb115",
                "name": "background",
                "name-zh": "背景",
                "file-type": "cell-element",
                "layout": {
                  "style": {
                    "background-color": [],
                    "font": [],
                    "border": [],
                    "scale": [],
                    "overflow": "hidden",
                    "box-sizing": "border-box",
                    "primaryAxisSizingMode": "fixed",
                    "position": "relative"
                  },
                  "background": {
                    "type": "container",
                    "content": [
                      {
                        "element": "material",
                        "value": "image",
                        "prop": "default",
                        "token": "image"
                      }
                    ],
                    "resource": "",
                    "data": [],
                    "style": {
                      "display": "{layout.state.display.flex}",
                      "layoutMode": "{layout.direction.NONE}",
                      "layoutWrap": "{layout.wrap.NO_WRAP}",
                      "primaryAxisSizingMode": "{layout.sizing.AUTO}",
                      "counterAxisSizingMode": "{layout.sizing.FIXED}",
                      "primaryAxisAlignItems": "{layout.align.x.MIN}",
                      "counterAxisAlignItems": "{layout.align.y.items.MIN}",
                      "layoutAlign": "{layout.align.y.self.INHERIT}",
                      "layoutGrow": "{layout.grow.0}",
                      "borderColor": {
                        "element": "color",
                        "value": "border",
                        "prop": "default",
                        "token": "border"
                      },
                      "borderRadius": {
                        "element": "shape",
                        "value": "borderradius",
                        "prop": "default",
                        "token": "borderradius"
                      },
                      "borderWidth": {
                        "element": "shape",
                        "value": "borderwidth",
                        "prop": "default",
                        "token": "borderwidth"
                      },
                      "boxShadow": {
                        "element": "material",
                        "value": "elevation",
                        "prop": "default",
                        "token": "elevation"
                      },
                      "asset": {
                        "element": "material",
                        "value": "image",
                        "prop": "default",
                        "token": "image"
                      }
                    },
                    "children": []
                  }
                },
                "material": {
                  "image": {
                    "default": {
                      "data-key": "",
                      "type": "img",
                      "style": {
                        "image": {
                          "value": "https://sop-cdn.dingcloud.com/filez/icon/8mm6fa2u7foi4j38r6r67navgpttixwi20240708114129822.png",
                          "type": "asset",
                          "key": "material-image"
                        }
                      },
                      "resource": "https://sop-cdn.dingcloud.com/filez/icon/8mm6fa2u7foi4j38r6r67navgpttixwi20240708114129822.png"
                    },
                    "loaded": {
                      "data-key": "",
                      "type": "img",
                      "style": {
                        "image": {
                          "value": "https://i.pinimg.com/736x/35/6f/f1/356ff1848ba9affde2fbde8dacbf9891.jpg",
                          "type": "asset",
                          "key": "material-image"
                        }
                      },
                      "resource": "https://i.pinimg.com/736x/35/6f/f1/356ff1848ba9affde2fbde8dacbf9891.jpg"
                    }
                  },
                  "elevation": {
                    "default": {
                      "data-key": "",
                      "style": {
                        "elevation": {
                          "value": "none",
                          "type": "boxShadow",
                          "key": "material-elevation"
                        }
                      },
                      "resource": "none"
                    },
                    "loaded": {
                      "data-key": "",
                      "style": {
                        "elevation": {
                          "value": "none",
                          "type": "boxShadow",
                          "key": "material-elevation"
                        }
                      },
                      "resource": "none"
                    }
                  }
                },
                "shape": {
                  "borderradius": {
                    "default": {
                      "data-key": "",
                      "style": {
                        "borderradius": {
                          "value": "{dimension.borderradius.0}",
                          "type": "borderRadius",
                          "key": "shape-borderradius"
                        }
                      },
                      "resource": "{dimension.borderradius.0}"
                    },
                    "loaded": {
                      "data-key": "",
                      "style": {
                        "borderradius": {
                          "value": "{dimension.borderradius.0}",
                          "type": "borderRadius",
                          "key": "shape-borderradius"
                        }
                      },
                      "resource": "{dimension.borderradius.0}"
                    }
                  },
                  "borderwidth": {
                    "default": {
                      "data-key": "",
                      "style": {
                        "borderwidth": {
                          "value": "{dimension.borderwidth.0}",
                          "type": "borderWidth",
                          "key": "shape-borderwidth"
                        }
                      },
                      "resource": "{dimension.borderwidth.0}"
                    },
                    "loaded": {
                      "data-key": "",
                      "style": {
                        "borderwidth": {
                          "value": "{dimension.borderwidth.0}",
                          "type": "borderWidth",
                          "key": "shape-borderwidth"
                        }
                      },
                      "resource": "{dimension.borderwidth.0}"
                    }
                  }
                },
                "color": {
                  "border": {
                    "default": {
                      "data-key": "",
                      "style": {
                        "border": {
                          "value": "{color.basic.opacity.black.20}",
                          "type": "color",
                          "key": "color-border"
                        }
                      },
                      "resource": "{color.basic.opacity.black.20}"
                    },
                    "loaded": {
                      "data-key": "",
                      "style": {
                        "border": {
                          "value": "{color.basic.opacity.black.20}",
                          "type": "color",
                          "key": "color-border"
                        }
                      },
                      "resource": "{color.basic.opacity.black.20}"
                    }
                  }
                },
                "type": "background",
                "state": "default",
                "events": [
                  {}
                ]
              }
            ]
          },
          "description": "",
          "id": "dd-0a2a81e1-6296-4ba7-a906-6149f95e2eac",
          "events": [
            {}
          ]
        }
      ]
    },
    "events": [
      {}
    ]
  }