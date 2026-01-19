import { CSS_VARIABLE_SYSTEM } from './constant';

const TABLE_STYLE = {
    // 表格元素配置
    table: {
        // 表格容器  
        container: {
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: "{color.surfacecontainer.white100}",
            borderRadius: "{dimension.borderradius.large}",
            overflow: 'hidden',
            boxShadow: "{material.hierarchy.1f}",
            borderWidth: "{dimension.borderwidth.narrow}",
            borderColor: "{color.surfacecontainer.black12}",
            borderStyle: "solid",
        },
        th: {
            backgroundColor: "{color.surface.grey1}",
            color: "{color.onsurface.black88}",
            fontWeight: "{font.fontweight.semibold}",
            fontSize: "{font.size.small}",
            padding: "{dimension.padding.base} {dimension.padding.semiloose}",
            textAlign: 'center',
            // borderRight: `{dimension.borderwidth.narrow} solid {color.surfacecontainer.black20}`,
            borderBottom: `{dimension.borderwidth.base} solid {color.surfacecontainer.black20}`,
            backgroundImage: 'none',
            // textTransform: 'uppercase',
            letterSpacing: '0.5px'
        },
        td: {
            fontSize: "{font.size.medium}",
            borderRight: `{dimension.borderwidth.narrow} solid {color.surfacecontainer.black20}`,
            borderBottom: `{dimension.borderwidth.narrow} solid {color.surfacecontainer.black20}`,
            padding: "{dimension.padding.base} {dimension.padding.semiloose}",
            color: "{color.onsurface.black76}",
            textAlign: 'left',
            verticalAlign: 'top'
        },
        // 表格行
        tr: {
            fontSize: "{font.size.medium}",
            borderBottom: `{dimension.borderwidth.narrow} solid {color.surfacecontainer.black12}`,
            transition: CSS_VARIABLE_SYSTEM.ANIMATION.FAST,
            '&:hover': {
                backgroundColor: "{color.surface.grey0}"
            },
            '&:last-child': {
                borderBottom: "{dimension.borderwidth.none}"
            },
        }
    },
}

export default TABLE_STYLE