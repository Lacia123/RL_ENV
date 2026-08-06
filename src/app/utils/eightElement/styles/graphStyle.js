const GRAPH_STYLE = {
    graph: {
        container: {
            display: "flex",
            flexDirection: "column",
            gap: "{dimension.gap.extraloose}",
            padding: "32px",
            width: "100%",
            boxSizing: "border-box",
            borderRadius: "{dimension.borderradius.xxxl}",
            background: "{color.basic.opacity.white.48}",
        },
        // G6 渲染区域容器（卡片下方，标题之下）
        graphArea: {
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            width: "100%",
            boxSizing: "border-box",
            borderRadius: "{dimension.basic.dimension.40}",
            background: "{color.basic.brand.0}",
        },
    },
}

export default GRAPH_STYLE
