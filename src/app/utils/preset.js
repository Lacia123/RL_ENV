export default {
    "text": {
        "h1": {
            "type": "text",
            "defaultStyle": {
                "fontSize": "{font.size.xxxl}",
                "fontWeight": "{font.weight.bold}",
                "letterSpacing": "{font.letterSpacing.tight}",
                "lineHeight": "{font.lineHeight.tight}"
            }
        },
        "h2": {
            "type": "text",
            "defaultStyle": {
                "fontSize": "{font.size.xxl}",
                "fontWeight": "{font.weight.bold}",
                "letterSpacing": "{font.letterSpacing.tight}",
                "lineHeight": "{font.lineHeight.tight}"
            }
        },
        "body": {
            "type": "text",
            "defaultStyle": {
                "fontSize": "{font.size.medium}",
                "fontWeight": "{font.weight.medium}",
                "letterSpacing": "{font.letterSpacing.base}",
                "lineHeight": "{font.lineHeight.base}"
            }
        }
    },
    "button": {
        "normal": {
            "type": "button",
            "defaultStyle": {
                "direction": "row",
                "grow": 0,
                "padding": "{padding.semitight}",
                "gap": "{gap.semitight}",
                "borderRadius": "{borderRadius.medium}",
                "fontSize": "{font.size.medium}",
                "fontWeight": "{font.weight.medium}",
                "boxShadow": "{material.main}"
            }
        }
    },
    "input": {
        "normal": {
            "type": "input",
            "defaultStyle": {
                "direction": "row",
                "padding": "{padding.semitight}",
                "borderRadius": "{borderRadius.medium}",
                "borderWidth": "{borderWidth.narrow}",
                "fontSize": "{font.size.medium}"
            }
        }
    },
    "icon": {
        "line": {
            "type": "icon",
            "defaultStyle": {
                "direction": "none",
                "padding": "{padding.none}",
                "gap": "{gap.none}"
            }
        }
    },
    "background": {
        "default": {
            "type": "background",
            "defaultStyle": {
                "direction": "none",
                "overflow": "hidden",
                "borderRadius": "{borderRadius.none}",
                "boxShadow": "{material.ground}"
            }
        }
    }
}