const CHART_STYLE = {
    chart: {
        small: {
            margin: "{dimension.margin.base} 0",
            padding: "{dimension.padding.extratight}",
        },
        minimalist: {
            padding: "{dimension.padding.loose}",
            background: "{color.basic.grey.0}",
            borderRadius: "{dimension.borderradius.xl}",
        },
        normal: {
            margin: "{dimension.margin.loose} 0",
            padding: "{dimension.padding.extraloose}",
            position: "relative",
            backgroundColor: "{color.surfacecontainer.white100}",
            borderRadius: "{dimension.borderradius.xl}",
            boxShadow: "{material.hierarchy.2f}",
            borderWidth: "{dimension.borderwidth.narrow}",
            borderColor: "{color.surfacecontainer.black12}",
            borderStyle: "solid"
        },
        event: {
            button: {
                text: '新样式',
                metaType: 'button',
                variant: 'chartButton',
                style: {
                    position: 'absolute',
                    right: "{dimension.padding.loose}",
                    top: "{dimension.padding.loose}"
                }
            }
        }
    },
}

export default CHART_STYLE