const OTHER_CARD_STYLE = {
    bannerPanel: {
        type: 'template',
        markdownMapping: {
            h2: 'title'
        },
        classList: {
            crossLines: {
                width: '100%',
                padding: "{dimension.padding.extraloose} {dimension.padding.loose}",
                borderRadius: "{dimension.borderradius.large}",
                background: "linear-gradient(135deg, {color.primary.brand4} 0%, {color.secondary.violet5} 35%, {color.primary.brand6} 100%)",
                boxShadow: "{material.hierarchy.1f}",
                position: 'relative',
                overflow: 'hidden',
                marginBottom: "{dimension.margin.loose}",
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `
  linear-gradient(0deg, transparent 24%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.1) 26%, transparent 27%, transparent 74%, rgba(255,255,255,0.1) 75%, rgba(255,255,255,0.1) 76%, transparent 77%),
  linear-gradient(90deg, transparent 24%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.1) 26%, transparent 27%, transparent 74%, rgba(255,255,255,0.1) 75%, rgba(255,255,255,0.1) 76%, transparent 77%)
`,
                    backgroundSize: '30px 30px',
                    pointerEvents: 'none'
                }
            },
            randomDots: {
                width: '100%',
                padding: "{dimension.padding.extraloose} {dimension.padding.loose}",
                borderRadius: "{dimension.borderradius.large}",
                background: "linear-gradient(135deg, {color.primary.brand4} 0%, {color.secondary.violet5} 35%, {color.primary.brand6} 100%)",
                boxShadow: "{material.hierarchy.1f}",
                position: 'relative',
                overflow: 'hidden',
                marginBottom: "{dimension.margin.loose}",
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `
  radial-gradient(circle at 10% 20%, rgba(255,255,255,0.1) 1px, transparent 2px),
  radial-gradient(circle at 80% 80%, rgba(255,255,255,0.08) 1px, transparent 2px),
  radial-gradient(circle at 40% 40%, rgba(255,255,255,0.12) 1px, transparent 2px),
  radial-gradient(circle at 90% 10%, rgba(255,255,255,0.1) 1px, transparent 2px)
`,
                    backgroundSize: '80px 80px, 120px 120px, 100px 100px, 60px 60px',
                    pointerEvents: 'none'
                }
            },
            hive: {
                width: '100%',
                padding: "{dimension.padding.extraloose} {dimension.padding.loose}",
                borderRadius: "{dimension.borderradius.large}",
                background: "linear-gradient(135deg, {color.primary.brand4} 0%, {color.secondary.violet5} 35%, {color.primary.brand6} 100%)",
                boxShadow: "{material.hierarchy.1f}",
                position: 'relative',
                overflow: 'hidden',
                marginBottom: "{dimension.margin.loose}",
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `
  linear-gradient(115deg, transparent 49%, rgba(255,255,255,0.1) 50%, transparent 51%),
  linear-gradient(245deg, transparent 49%, rgba(255,255,255,0.1) 50%, transparent 51%),
  linear-gradient(355deg, transparent 49%, rgba(255,255,255,0.1) 50%, transparent 51%)
`,
                    backgroundSize: '40px 35px',
                    pointerEvents: 'none'
                }
            },
            slash: {
                width: '100%',
                padding: "{dimension.padding.extraloose} {dimension.padding.loose}",
                borderRadius: "{dimension.borderradius.large}",
                background: "linear-gradient(135deg, {color.primary.brand4} 0%, {color.secondary.violet5} 35%, {color.primary.brand6} 100%)",
                boxShadow: "{material.hierarchy.1f}",
                position: 'relative',
                overflow: 'hidden',
                marginBottom: "{dimension.margin.loose}",
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `
  repeating-linear-gradient(
    45deg,
    transparent,
    transparent 5px,
    rgba(255,255,255,0.08) 5px,
    rgba(255,255,255,0.08) 10px
  )
`,
                    backgroundSize: '20px 20px',
                    pointerEvents: 'none'
                }
            },
            matrixDots: {
                width: '100%',
                padding: "{dimension.padding.extraloose} {dimension.padding.loose}",
                borderRadius: "{dimension.borderradius.large}",
                background: "linear-gradient(135deg, {color.primary.brand4} 0%, {color.secondary.violet5} 35%, {color.primary.brand6} 100%)",
                boxShadow: "{material.hierarchy.1f}",
                position: 'relative',
                overflow: 'hidden',
                marginBottom: "{dimension.margin.loose}",
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `
  radial-gradient(circle at 10px 10px, rgba(255,255,255,0.15) 1px, transparent 1px)
`,
                    backgroundSize: '25px 25px',
                    pointerEvents: 'none'
                }
            },
            square: {
                width: '100%',
                padding: "{dimension.padding.extraloose} {dimension.padding.loose}",
                borderRadius: "{dimension.borderradius.large}",
                background: "linear-gradient(135deg, {color.primary.brand4} 0%, {color.secondary.violet5} 35%, {color.primary.brand6} 100%)",
                boxShadow: "{material.hierarchy.1f}",
                position: 'relative',
                overflow: 'hidden',
                marginBottom: "{dimension.margin.loose}",
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `
        /* 几何线条纹理 */
        linear-gradient(45deg, transparent 49%, rgba(255,255,255,0.1) 50%, transparent 51%),
        linear-gradient(-45deg, transparent 49%, rgba(255,255,255,0.1) 50%, transparent 51%)
      `,
                    backgroundSize: '30px 30px',
                    pointerEvents: 'none'
                }
            },

        },
        defaultClass: 'square',
        title: {
            metaType: 'text',
            variant: 'bannerTitle',
        }
    },
}

export default OTHER_CARD_STYLE