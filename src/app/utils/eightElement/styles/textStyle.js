import { CSS_VARIABLE_SYSTEM } from './constant';

const TEXT_STYLE = {
    // 文本元素配置
    text: {
        // 正文文本
        p: {
            style: {
                fontSize: "{font.size.medium}",
                fontWeight: "400",
                lineHeight: "1.7",
                letterSpacing: "{font.letterspacing.base}",
                color: "{color.onsurface.black76}",
                margin: "0 0 {dimension.margin.base} 0",
                textAlign: "justify",
                textJustify: "inter-word"
            },
            supportedAttributes: ['color']
        },
        // 标题文本（h1 - h6）
        h1: {
            width: "100%",
            fontSize: "{font.size.xxxl}",
            fontWeight: "{font.fontweight.bold}",
            lineHeight: "{font.lineheight.base}",
            letterSpacing: "{font.letterspacing.base}",
            color: "{color.onsurface.black88}",
            // marginTop: "{dimension.margin.superloose}",
            marginBottom: "{dimension.margin.loose}",
            textAlign: "center",
            // marginLeft: "auto",
            // marginRight: "auto",
            position: 'relative',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',

            // '&::after': {
            //   content: "''",
            //   position: 'absolute',
            //   bottom: '-8px',
            //   left: '0',
            //   width: '60px',
            //   height: '4px',
            //   background: `linear-gradient(135deg, {color.primary.brand4} 0%, {color.secondary.violet5} 100%)`,
            //   borderRadius: "{dimension.borderradius.large}"
            // }
        },
        h2: {
            width: "100%",
            fontSize: "{font.size.xxl}",
            textAlign: "left",
            fontWeight: "{font.fontweight.bold}",
            lineHeight: "{font.lineheight.base}",
            letterSpacing: "{font.letterspacing.base}",
            color: "{color.onsurface.black88}",
            margin: "{dimension.margin.extraloose} 0 {dimension.margin.base} 0",
            padding: "{dimension.padding.base} {dimension.padding.semiloose}",
            borderLeft: `4px solid {color.primary.brand5}`,
            background: `linear-gradient(90deg, {color.primarycontainer.brand1} 0%, transparent 100%)`,
            backgroundImage: 'none',
            borderRadius: "{dimension.borderradius.small}",
            boxShadow: "{material.hierarchy.main}"
        },
        h3: {
            style: {
                width: "100%",
                display: "flex",
                textAlign: "left",
                fontSize: "{font.size.xl}",
                fontWeight: "{font.fontweight.semibold}",
                lineHeight: "{font.lineheight.base}",
                letterSpacing: "{font.letterspacing.base}",
                color: "{color.onsurface.black76}",
                margin: "{dimension.margin.loose} 0 {dimension.margin.base} 0",
                position: 'relative',
            },
            supportedAttributes: ['color'],
            // '&::before': {
            //   content: "'#'",
            //   color: "{color.primary.brand5}",
            //   marginRight: "{dimension.gap.tight}",
            //   fontWeight: "{font.fontweight.bold}"
            // }
        },

        h4: {
            width: "auto",
            fontSize: "{font.size.large}",
            fontWeight: "{font.fontweight.semibold}",
            lineHeight: "{font.lineheight.base}",
            letterSpacing: "{font.letterspacing.base}",
            color: "{color.onsurface.black76}",
            justifyContent: "center",
            margin: "{dimension.margin.semiloose} 0 {dimension.margin.tight} 0",
            padding: "0 0 {dimension.padding.extratight} 0",
            textTransform: "capitalize",
            borderBottom: `2px solid {color.surfacecontainer.black12}`
        },
        h5: {
            width: "auto",
            fontSize: "{font.size.medium}",
            fontWeight: "{font.fontweight.semibold}",
            lineHeight: "{font.lineheight.base}",
            letterSpacing: "{font.letterspacing.base}",
            color: "{color.onsurface.black64}",
            margin: "{dimension.margin.base} 0 {dimension.margin.tight} 0",
            textDecoration: "underline",
            textDecorationColor: "{color.primarycontainer.brand2}",
            textUnderlineOffset: "4px"
        },
        h6: {
            width: "auto",
            display: "inline-block",
            fontSize: "{font.size.small}",
            fontWeight: "{font.fontweight.medium}",
            lineHeight: "{font.lineheight.base}",
            letterSpacing: "{font.letterspacing.base}",
            color: "{color.onsurface.black48}",
            margin: "{dimension.margin.base} 0 {dimension.margin.tight} 0",
            padding: "{dimension.padding.supertight} {dimension.padding.tight}",
            textTransform: "uppercase",
            letterSpacing: "1px",
            background: "{color.surfacecontainer.black4}",
            borderRadius: "{dimension.borderradius.xs}"
        },

        // 小字说明，TODO: 需要确定解析关系
        caption: {
            fontSize: "{font.size.small}",
            fontWeight: "400",
            lineHeight: "{font.lineheight.base}",
            letterSpacing: "{font.letterspacing.base}",
            color: "{color.onsurface.black48}",
            fontStyle: "italic",
            textAlign: "center",
            marginTop: "{dimension.margin.tight}",
            marginBottom: "{dimension.margin.base}",
            background: "{color.surfacecontainer.black4}",
            padding: "{dimension.padding.tight} {dimension.padding.base}",
            borderRadius: "{dimension.borderradius.small}"
        },

        // 引用文本，对应 markdown 中的 >
        quote: {
            fontSize: "{font.size.large}",
            fontWeight: "400",
            lineHeight: "1.6",
            letterSpacing: "{font.letterspacing.base}",
            color: "{color.onsurface.black76}",
            fontStyle: 'italic',
            padding: "{dimension.padding.loose} {dimension.padding.extraloose}",
            margin: "{dimension.margin.loose} 0",
            backgroundColor: "{color.surface.grey1}",
            borderLeft: `6px solid {color.primary.brand4}`,
            borderRadius: "{dimension.borderradius.medium}",
            boxShadow: "{material.hierarchy.1f}",
            position: 'relative',
            // 🆕 纹理动作所需的默认属性
            backgroundImage: 'none',
            opacity: '1.0',
            backdropFilter: 'none',
        },

        // 代码块  
        codeBlock: {
            fontSize: "{font.size.small}",
            fontWeight: "400",
            fontFamily: "'Fira Code', 'Monaco', 'Cascadia Code', monospace",
            lineHeight: "1.5",
            backgroundColor: "{color.onsurface.white88}",
            padding: "{dimension.padding.loose} {dimension.padding.extraloose}",
            marginTop: "{dimension.margin.base}",
            marginBottom: "{dimension.margin.base}",
            borderRadius: "{dimension.borderradius.large}",
            borderWidth: "{dimension.borderwidth.narrow}",
            borderColor: "{color.onsurfacecontainer.grey7}",
            borderStyle: "solid",
            boxShadow: "{material.hierarchy.2f}",
            overflow: 'auto',
            position: 'relative',
            '&::before': {
                content: "''",
                position: 'absolute',
                top: '12px',
                left: '16px',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: "{color.warning.orange5}",
                boxShadow: `24px 0 0 {color.warning.orange6}, 48px 0 0 {color.success.green5}`
            }
        },

        // 命令行块（通用，可嵌入任意卡片）
        commandBlock: {
            fontSize: "{font.size.small}",
            fontWeight: "400",
            fontFamily: "'Fira Code', 'Monaco', 'Cascadia Code', monospace",
            backgroundColor: "{color.onsurface.white88}",
            padding: "{dimension.padding.superloose} {dimension.padding.extraloose} {dimension.padding.loose}",
            marginTop: "{dimension.margin.base}",
            lineHeight: "1",
            marginBottom: "{dimension.margin.base}",
            borderRadius: "{dimension.borderradius.large}",
            borderWidth: "{dimension.borderwidth.narrow}",
            borderColor: "{color.onsurfacecontainer.grey7}",
            borderStyle: "solid",
            boxShadow: "{material.hierarchy.2f}",
            overflow: 'auto',
            position: 'relative',
            color: "{color.onsurface.black88}",
            '&::before': {
                content: "''",
                position: 'absolute',
                top: '12px',
                left: '16px',
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: "{color.warning.orange5}",
                boxShadow: `24px 0 0 {color.warning.orange6}, 48px 0 0 {color.success.green5}`
            }
        },

        // 行内链接文本 - 支持 <link>text</link> 语法，浅灰底深色文字标签
        inlineLink: {
            display: "inline-block",
            fontSize: "inherit",
            fontWeight: "{font.fontweight.medium}",
            lineHeight: "inherit",
            color: "{color.basic.opacity.black.64}",
            backgroundColor: "{color.basic.opacity.black.7}",
            padding: "2px 6px",
            borderRadius: "8px",
            textDecoration: "none",
            cursor: "pointer",
        },

        // 超链接文本 TODO: 超链接样式暂不支持，因为超链接会被解析成按钮
        hyperlink: {
            fontSize: "inherit",
            fontWeight: "{font.fontweight.medium}",
            color: "{color.primary.brand5}",
            textDecoration: 'none',
            borderBottom: '2px solid {color.primarycontainer.brand2}',
            transition: CSS_VARIABLE_SYSTEM.ANIMATION.SMOOTH,
            '&:hover': {
                color: "{color.primary.brand6}",
                borderBottomColor: "{color.primarycontainer.brand2}",
                textDecoration: "none"
            },
            '&:active': {
                color: "{color.onprimarycontainer.brand8}"
            }
        },

        // 强调文本, TODO：需要确定解析关系 
        emphasis: {
            fontWeight: "{font.fontweight.semibold}",
            color: "{color.onsurface.black88}",
            background: "{color.primarycontainer.brand1}",
            padding: "{dimension.padding.supertight} {dimension.padding.extratight}",
            borderRadius: "{dimension.borderradius.xs}",
            boxShadow: "{material.hierarchy.B1}"
        },
        cardTitle: {
            fontWeight: "{font.fontweight.semibold}",
            color: "{color.onprimary.white100}",
            fontSize: "{font.size.large}",
        },
        cardSubtitle: {
            fontWeight: "{font.fontweight.semibold}",
            color: "{color.onprimary.black88}",
            fontSize: "{font.size.medium}",
        },
        metricCardValue: {
            fontSize: "{font.size.xxxl}",
            fontWeight: "{font.fontweight.bold}",
            color: "{color.primary.brand6}",
            letterSpacing: "-0.02em",
            lineHeight: "1em",
            margin: "0"
        },
        heroTitle: {
            fontSize: "{font.size.xl}",
            fontWeight: "{font.fontweight.bold}",
            letterSpacing: "-0.02em",
            color: "{color.onprimary.white100}",
            margin: "0",
            lineHeight: "1.1"
        },
        heroSubtitle: {
            fontSize: "{font.size.medium}",
            fontWeight: "{font.fontweight.medium}",
            color: "{color.onprimary.white88}",
            margin: "0",
            lineHeight: "1.5",
            maxWidth: "580px"
        },
        heroMetric: {
            fontSize: "{font.size.medium}",
            fontWeight: "{font.fontweight.semibold}",
            color: "{color.basic.opacity.white.88}",
            margin: "0",
            padding: "{dimension.padding.base} {dimension.padding.extraloose}",
            borderRadius: "{dimension.borderradius.full}",
            backdropFilter: 'blur(10px)',
            background: '{color.basic.opacity.white.12}',
            letterSpacing: "0.02em"
        },
        cardSegment: {
            color: "{color.onprimary.black88}",
            fontSize: "{font.size.medium}",
        },

        // 新拟态风格文字样式
        neomorphismTitle: {
            fontWeight: "{font.fontweight.semibold}",
            color: "{color.onprimary.white100}",
            fontSize: "{font.size.large}",
        },
        neomorphismSubtitle: {
            fontWeight: "{font.fontweight.semibold}",
            color: "{color.onprimary.black88}",
            fontSize: "{font.size.medium}",
        },
        neomorphismSegment: {
            fontWeight: "{font.fontweight.medium}",
            color: "{color.onprimary.black88}",
            fontSize: "{font.size.medium}",
        },

        // 科技渐变风格文字样式
        techGradientTitle: {
            fontWeight: "{font.fontweight.semibold}",
            color: "{color.primary.brand6}", // 深蓝色确保可读性
            fontSize: "{font.size.large}",
        },
        techGradientSubtitle: {
            fontWeight: "{font.fontweight.semibold}",
            color: "{color.onprimary.black88}",
            fontSize: "{font.size.medium}",
        },
        techGradientSegment: {
            fontWeight: "{font.fontweight.medium}",
            color: "{color.onprimary.black88}",
            fontSize: "{font.size.medium}",
        },

        // 优雅青蓝卡片风格文字样式
        elegantCardTitle: {
            fontWeight: "{font.fontweight.semibold}",
            color: "{color.primary.brand6}", // 深青蓝色确保可读性
            fontSize: "{font.size.large}",
        },
        elegantCardSubtitle: {
            fontWeight: "{font.fontweight.semibold}",
            color: "{color.onprimary.black88}",
            fontSize: "{font.size.medium}",
        },
        elegantCardSegment: {
            fontWeight: "{font.fontweight.medium}",
            color: "{color.onprimary.black88}",
            fontSize: "{font.size.medium}",
        },

        // 标题卡片风格文字样式
        headerCardTitle: {
            fontWeight: "{font.fontweight.bold}",
            color: "{color.onprimary.black88}",
            fontSize: "{font.size.large}",
            padding: "0 {dimension.padding.base}",
            borderLeftWidth: "{dimension.borderwidth.wide}",
            borderLeftStyle: "solid",
            borderLeftColor: "{color.primary.brand5}",
        },
        headerCardText: {
            fontWeight: "{font.fontweight.semibold}",
            color: "{color.onprimary.black76}",
            fontSize: "{font.size.medium}",
        },
        percentItemTitle: {
            fontSize: "{font.size.small}",
            fontWeight: "bold",
            color: "{color.onsurfacecontainer.grey9}",
        },
        precentItemLabel: {
            fontSize: "{font.size.small}",
            fontWeight: "bold",
            color: "{color.onprimary.white100}",
        },
        percentValue: {
            fontSize: "{font.size.xxl}",
            fontWeight: "bold",
            color: "{color.error.red5}",
            textAlign: 'center',
        },
        percentItemDescription: {
            lineHeight: "1.4",
            fontSize: "{font.size.tiny}",
            fontWeight: "{font.fontweight.medium}",
            color: "{color.onsurfacecontainer.grey9}",
        },
        // 简约风格卡片
        minimalistBorderLessCardTitle: {
            fontSize: "{font.size.xxl}",
            fontWeight: "{font.fontweight.bold}",
            color: "{color.onsurface.black88}",
        },
        minimalistBorderLessCardPageTitle: {
            fontSize: "{font.size.large}",
            fontWeight: "{font.fontweight.semibold}",
            color: "{color.onsurface.black88}",
        },
        minimalistBorderLessCardContent: {
            lineHeight: "1.4",
            fontSize: "{font.size.medium}",
            fontWeight: "{font.fontweight.medium}",
            color: "{color.onsurfacecontainer.grey9}",
        },
        minimalistListCardTitle: {
            lineHeight: "1.4",
            fontSize: "{font.size.medium}",
            fontWeight: "{font.fontweight.bold}",
            color: "{color.basic.brand.6}",
        },

        minimalistListCardContent: {
            lineHeight: "1.4",
            fontSize: "{font.size.medium}",
            fontWeight: "{font.fontweight.medium}",
            color: "{color.onsurfacecontainer.grey9}",
        },

        minimalistCardMainTitle: {
            lineHeight: "1.4",
            fontSize: "{font.size.xl}",
            fontWeight: "{font.fontweight.semibold}",
            color: "{color.onsurface.black88}",
        },

        minimalistListCardItemTitle: {
            lineHeight: "1.4",
            fontSize: "{font.size.medium}",
            fontWeight: "{font.fontweight.bold}",
            color: "{color.onsurface.black88}",
        },

        minimalistListCardItemDescription: {
            lineHeight: "1.4",
            fontSize: "{font.size.xl}",
            fontWeight: "{font.fontweight.bold}",
            color: "{color.onsurface.black88}",
        },

        minimalistChartCardHeaderTitle: {
            fontSize: "{dimension.basic.dimension.80}",
            fontWeight: "{font.fontweight.bold}",
            color: "{color.basic.brand.1}"
        },

        minimalistChartCardPageTitle: {
            fontSize: "{font.size.large}",
            fontWeight: "{font.fontweight.bold}",
            color: "{color.onsurface.black88}",
        },

        minimalistChartCardDescription: {
            lineHeight: "1.4",
            fontSize: "{font.size.small}",
            color: "{color.onsurface.black64}",
        },

        // tabItemText
        tabItemText: {
            fontSize: "{font.size.medium}",
            fontWeight: "{font.fontweight.semibold}",
            textAlign: "center",
            color: "{color.basic.brand.3}"
        },
        tabActiveItemText: {
            fontSize: "{font.size.medium}",
            fontWeight: "{font.fontweight.bold}",
            textAlign: "center",
            color: "{color.basic.brand.6}",
        },

        // bannerPanel 标题
        bannerTitle: {
            fontSize: "{font.size.xxl}",
            fontWeight: "{font.fontweight.bold}",
            color: "{color.onprimary.white100}",
        },
    },
};

export default TEXT_STYLE;