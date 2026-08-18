import { LAYOUT_CONSTANTS, DIMENSION_CONSTANTS, COLOR_CONSTANTS, GRID_CONSTANTS } from './constant';

const LAYOUT_STYLE = {
    // 布局元素配置
    layout: {
        // 根布局元素
        root: {
            style: {
                padding: `${DIMENSION_CONSTANTS.PADDING.base}`,
                margin: DIMENSION_CONSTANTS.MARGIN.base,
                backgroundColor: COLOR_CONSTANTS.BASIC.OPACITY.WHITE[100],
                borderRadius: DIMENSION_CONSTANTS.BORDER_RADIUS.large,

                // 🔧 新增：布局动作所需的默认属性
                display: 'flex',
                flexDirection: 'column',
                flexWrap: 'nowrap',
                justifyContent: 'flex-start',
                alignItems: 'stretch',
                gap: DIMENSION_CONSTANTS.GAP.none,

                backgroundImage: 'none',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '100vw',

                // 网格布局属性（默认不启用，由动作激活）
                gridTemplateColumns: 'none',
                gridTemplateAreas: 'none',
                justifyItems: 'stretch',
            },
            supportedAttributes: ['backgroundImage', 'backgroundRepeat', 'backgroundSize', 'backgroundPosition', 'backgroundColor', 'background', 'padding', 'margin', 'borderRadius']
        },
        // 列布局元素（默认垂直布局）
        column: {
            style: {
                padding: `${DIMENSION_CONSTANTS.PADDING.tight} 0`,
                margin: `${DIMENSION_CONSTANTS.MARGIN.tight} 0`,
                backgroundColor: "none",

                // 🔧 新增：布局动作所需的默认属性
                display: 'flex',
                flexDirection: 'column',
                flexWrap: 'nowrap',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: DIMENSION_CONSTANTS.GAP.base,

                // 网格布局属性（默认不启用，由动作激活）
                gridTemplateColumns: 'none',
                gridTemplateAreas: 'none',
                justifyItems: 'stretch'
            },
            supportedAttributes: ['flex', 'gap', 'flexDirection', 'justifyContent', 'alignItems']
        },
        // row 布局元素
        row: {
            style: {
                padding: `${DIMENSION_CONSTANTS.PADDING.tight} 0`,
                margin: `${DIMENSION_CONSTANTS.MARGIN.tight} 0`,
                backgroundColor: "none",

                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'nowrap',
                justifyContent: 'flex-start',
                alignItems: 'stretch',
                gap: DIMENSION_CONSTANTS.GAP.base,

                // 网格布局属性（默认不启用，由动作激活）
                gridTemplateColumns: 'none',
                gridTemplateAreas: 'none',
                justifyItems: 'stretch'
            },
            supportedAttributes: ['flex', 'gap', 'flexWrap']
        },
        // 🆕 类似 Tailwind 的 row 变体
        'row-center': {
            padding: `${DIMENSION_CONSTANTS.PADDING.tight} 0`,
            margin: `${DIMENSION_CONSTANTS.MARGIN.tight} 0`,
            backgroundColor: "none",
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'flex-start',
            alignItems: 'center',  // 垂直居中
            gap: DIMENSION_CONSTANTS.GAP.base,
            gridTemplateColumns: 'none',
            gridTemplateAreas: 'none',
            justifyItems: 'stretch'
        },
        'row-between': {
            padding: `${DIMENSION_CONSTANTS.PADDING.tight} 0`,
            margin: `${DIMENSION_CONSTANTS.MARGIN.tight} 0`,
            backgroundColor: "none",
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'space-between',  // 两端对齐
            alignItems: 'stretch',
            gap: DIMENSION_CONSTANTS.GAP.base,
            gridTemplateColumns: 'none',
            gridTemplateAreas: 'none',
            justifyItems: 'stretch'
        },
        'row-around': {
            padding: `${DIMENSION_CONSTANTS.PADDING.tight} 0`,
            margin: `${DIMENSION_CONSTANTS.MARGIN.tight} 0`,
            backgroundColor: "none",
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'space-around',  // 周围分散对齐
            alignItems: 'stretch',
            gap: DIMENSION_CONSTANTS.GAP.base,
            gridTemplateColumns: 'none',
            gridTemplateAreas: 'none',
            justifyItems: 'stretch'
        },
        'row-evenly': {
            padding: `${DIMENSION_CONSTANTS.PADDING.tight} 0`,
            margin: `${DIMENSION_CONSTANTS.MARGIN.tight} 0`,
            backgroundColor: "none",
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'space-evenly',  // 均匀分布
            alignItems: 'stretch',
            gap: DIMENSION_CONSTANTS.GAP.base,
            gridTemplateColumns: 'none',
            gridTemplateAreas: 'none',
            justifyItems: 'stretch'
        },
        'row-center-center': {
            padding: `${DIMENSION_CONSTANTS.PADDING.tight} 0`,
            margin: `${DIMENSION_CONSTANTS.MARGIN.tight} 0`,
            backgroundColor: "none",
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'center',  // 水平居中
            alignItems: 'center',  // 垂直居中
            gap: DIMENSION_CONSTANTS.GAP.base,
            gridTemplateColumns: 'none',
            gridTemplateAreas: 'none',
            justifyItems: 'stretch'
        },
        'row-between-center': {
            padding: `${DIMENSION_CONSTANTS.PADDING.tight} 0`,
            margin: `${DIMENSION_CONSTANTS.MARGIN.tight} 0`,
            backgroundColor: "none",
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'space-between',  // 两端对齐
            alignItems: 'center',  // 垂直居中
            gap: DIMENSION_CONSTANTS.GAP.base,
            gridTemplateColumns: 'none',
            gridTemplateAreas: 'none',
            justifyItems: 'stretch'
        },
        'row-end': {
            padding: `${DIMENSION_CONSTANTS.PADDING.tight} 0`,
            margin: `${DIMENSION_CONSTANTS.MARGIN.tight} 0`,
            backgroundColor: "none",
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'flex-end',  // 靠右对齐
            alignItems: 'stretch',
            gap: DIMENSION_CONSTANTS.GAP.base,
            gridTemplateColumns: 'none',
            gridTemplateAreas: 'none',
            justifyItems: 'stretch'
        },
        'row-end-center': {
            padding: `${DIMENSION_CONSTANTS.PADDING.tight} 0`,
            margin: `${DIMENSION_CONSTANTS.MARGIN.tight} 0`,
            backgroundColor: "none",
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
            justifyContent: 'flex-end',  // 靠右对齐
            alignItems: 'center',  // 垂直居中
            gap: DIMENSION_CONSTANTS.GAP.base,
            gridTemplateColumns: 'none',
            gridTemplateAreas: 'none',
            justifyItems: 'stretch'
        },
        'column-center': {
            padding: `${DIMENSION_CONSTANTS.PADDING.tight} 0`,
            margin: `${DIMENSION_CONSTANTS.MARGIN.tight} 0`,
            backgroundColor: "none",
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            justifyContent: 'flex-start',
            alignItems: 'center',  // 水平居中
            gap: DIMENSION_CONSTANTS.GAP.base,
            gridTemplateColumns: 'none',
            gridTemplateAreas: 'none',
            justifyItems: 'stretch'
        },
        'column-between': {
            padding: `${DIMENSION_CONSTANTS.PADDING.tight} 0`,
            margin: `${DIMENSION_CONSTANTS.MARGIN.tight} 0`,
            backgroundColor: "none",
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            justifyContent: 'space-between',  // 上下两端对齐
            alignItems: 'flex-start',
            gap: DIMENSION_CONSTANTS.GAP.base,
            gridTemplateColumns: 'none',
            gridTemplateAreas: 'none',
            justifyItems: 'stretch'
        },
        'column-center-center': {
            padding: `${DIMENSION_CONSTANTS.PADDING.tight} 0`,
            margin: `${DIMENSION_CONSTANTS.MARGIN.tight} 0`,
            backgroundColor: "none",
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            justifyContent: 'center',  // 垂直居中
            alignItems: 'center',  // 水平居中
            gap: DIMENSION_CONSTANTS.GAP.base,
            gridTemplateColumns: 'none',
            gridTemplateAreas: 'none',
            justifyItems: 'stretch'
        },
        // 🆕 grid 网格布局（m*n 布局，子项通过 grid:item 提供 x/y/width/height 定位）
        grid: {
            style: {
                display: 'grid',
                gridAutoFlow: 'row',
                // 🆕 隐式轨道（显式定位超出推导 m/n 时产生）也遵守单位下限，
                // 避免隐式轨道按内容收缩成 200+px 的窄格子
                gridAutoColumns: `minmax(${GRID_CONSTANTS.CELL_WIDTH}px, 1fr)`,
                gridAutoRows: `minmax(${GRID_CONSTANTS.CELL_HEIGHT}px, 1fr)`,
                justifyItems: 'stretch',
                alignItems: 'stretch',
                boxSizing: 'border-box',
                width: '100%',
                position: 'relative',
                // 🆕 超出（宽或高）时滚动：网格内容超过容器边界时在网格内滚动，而不是撑破页面
                overflow: 'auto',
                padding: '0',
                margin: '0',
            },
            supportedAttributes: [
                'columns', 'cols', 'rows',
                'gridTemplateColumns', 'gridTemplateRows',
                'gap', 'columnGap', 'rowGap',
                'justifyItems', 'alignItems', 'justifyContent', 'alignContent',
                'width', 'height', 'minHeight',
                'padding', 'background', 'backgroundColor',
                // 🆕 是否撑满（fill）：子项内容上下左右填满所在格，默认 true
                'fill'
            ]
        },
        bgColumn: {
            style: {
                padding: `${DIMENSION_CONSTANTS.PADDING.base}`,
                borderRadius: DIMENSION_CONSTANTS.BORDER_RADIUS.large,
                boxShadow: "{material.hierarchy.main}",
                borderWidth: "{dimension.borderwidth.narrow}",
                borderColor: "{color.surfacecontainer.black12}",
                borderStyle: "solid",
                display: 'flex',
                flexDirection: 'column',
                flexWrap: 'nowrap',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: DIMENSION_CONSTANTS.GAP.base,
                background: "{color.primary.brand3}",
                /** 🆕 覆盖 createBaseLayout 的默认 width:100%
                 *  让 bgColumn 在 flex row 中与兄弟元素并排，
                 *  而非独占一行挤走其他元素 */
                width: 'auto',
                flex: '1',
            },
            supportedAttributes: ['background', 'backgroundColor', 'padding', 'margin', 'borderRadius', 'borderColor', 'borderWidth', 'boxShadow']
        },
        minimalContainer: {
            borderTopRightRadius: "{dimension.borderradius.xl}",
            borderBottomRightRadius: "{dimension.borderradius.xl}",
            borderBottomLeftRadius: "{dimension.borderradius.xl}",
            background: "{color.onprimary.white100}",
        },
        gallery: {
            // 使用CSS多列布局，不使用flexbox
            columnCount: '2',
            columnGap: '15px',
            columnFill: "balance",
            // 子元素样式
            '& > *': {
                breakInside: 'avoid',        // 避免元素被分割到不同列
                marginTop: '15px',        // 元素间距用margin而不是gap
                display: 'block',            // 子元素也使用block布局
                width: '100%',
            },
        }
    },
};


export default LAYOUT_STYLE;