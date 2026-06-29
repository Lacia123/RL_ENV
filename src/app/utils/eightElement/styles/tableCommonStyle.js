/**
 * tableCommonStyle.js
 *
 * 常规列表表格（commonStyle）专用样式，与 tableStyle.js 中的默认表格完全分离。
 * 表头圆角/外框在整行首尾 th 上（classStyle），而非每个 th 各自圆角。
 */

/** [table:xxx] 标签 → 样式命名空间 tableCommonStyle */
export const TABLE_TAG_VARIANT_MAP = {
    commonStyle: 'commonStyle',
};

/** 表头 / 行 hover 圆角（12px → dimension.borderradius.medium） */
const TABLE_COMMON_HEADER_RADIUS = '{dimension.borderradius.medium}';

const TABLE_COMMON_STYLE = {
    tableCommonStyle: {
        container: {
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: '0',
            overflow: 'hidden',
            backgroundColor: 'transparent',
        },
        th: {
            fill: '{color.basic.brand.1}',
            color: '{color.basic.brand.8}',
            fontWeights: '{font.fontweight.bold}',
            fontSizes: '{font.size.medium}',
            padding: '{dimension.padding.base} {dimension.padding.semiloose}',
            textAlign: 'left',
            borderBottom: '{dimension.borderwidth.narrow} solid {color.basic.opacity.black.7}',
            borderTop: '{dimension.borderwidth.narrow} solid {color.basic.opacity.black.7}',
            borderLeft: 'none',
            borderRight: 'none',
            whiteSpace: 'nowrap',
            classStyle: {
                '&:first-child': {
                    borderLeft: '{dimension.borderwidth.narrow} solid {color.basic.opacity.black.7}',
                    borderTopLeftRadius: TABLE_COMMON_HEADER_RADIUS,
                    borderBottomLeftRadius: TABLE_COMMON_HEADER_RADIUS,
                },
                '&:last-child': {
                    borderRight: '{dimension.borderwidth.narrow} solid {color.basic.opacity.black.7}',
                    borderTopRightRadius: TABLE_COMMON_HEADER_RADIUS,
                    borderBottomRightRadius: TABLE_COMMON_HEADER_RADIUS,
                },
            },
        },
        td: {
            backgroundColor: 'transparent',
            textAlign: 'left',
            padding: '{dimension.padding.base} {dimension.padding.semiloose}',
            verticalAlign: 'middle',
            borderBottom: '{dimension.borderwidth.narrow} solid {color.basic.opacity.black.7}',
            borderRight: 'none',
            classStyle: {
                '&:nth-child(1)': {
                    fill: '{color.basic.opacity.black.100}',
                    fontWeights: '{font.fontweight.bold}',
                    fontSizes: '{font.size.medium}',
                },
                '&:nth-child(2)': {
                    fill: '{color.basic.opacity.black.64}',
                    fontWeights: '{font.fontweight.semibold}',
                    fontSizes: '{font.size.medium}',
                },
                '&:nth-child(3)': {
                    fontSizes: '{font.size.large}',
                },
            },
        },
        tr: {
            classStyle: {
                transition: 'background-color 0.15s ease',
                '&:hover': {
                    fill: '{color.basic.opacity.black.4}',
                },
                '&:hover td:first-child': {
                    borderTopLeftRadius: TABLE_COMMON_HEADER_RADIUS,
                    borderBottomLeftRadius: TABLE_COMMON_HEADER_RADIUS,
                },
                '&:hover td:last-child': {
                    borderTopRightRadius: TABLE_COMMON_HEADER_RADIUS,
                    borderBottomRightRadius: TABLE_COMMON_HEADER_RADIUS,
                },
                '&:last-child td': {
                    borderBottom: '{dimension.borderwidth.none}',
                },
            },
        },
    },
};

export default TABLE_COMMON_STYLE;
