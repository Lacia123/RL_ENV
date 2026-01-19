const MATH_STYLE = {
    // ==================== 数学公式元件 ==================== (新增)
    math: {
        // 行内公式
        inline: {
            textAlign: "left",
            fontSize: "{font.size.medium}",
            color: "{color.onsurface.black88}",
            verticalAlign: "baseline"
        },
        // 块级公式
        display: {
            fontSize: "{font.size.large}",
            margin: "{dimension.margin.loose} 0",
            padding: "{dimension.padding.base}",
            backgroundColor: "{color.surface.grey1}",
            // background: "{color.surface.grey1}",
            borderRadius: "{dimension.borderradius.medium}",
            borderLeft: `{dimension.borderwidth.wide} solid {color.basic.brand.4}`,
            boxShadow: "{material.hierarchy.main}",
            textAlign: "center"
        }
    },
}

export default MATH_STYLE