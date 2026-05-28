/**
 * 常规列表表格组件（Regular List Table）
 *
 * 表格单元格样式见 tableCommonStyle.js（与 tableStyle.js 默认表格分离）。
 *
 * Markdown 用法：
 *
 * 1) 表格标签（推荐 demo）：
 * ## 常规列表
 * [table:commonStyle]
 * | DingOS版本号 | 设备数量 | 操作 |
 * |------|------|------|
 * | AWS | 美国、亚洲、亚太 | ⟳  ⋮ |
 *
 * 2) 卡片包裹：
 * <card:regularListTable> ... </card:regularListTable>
 */

import TABLE_COMMON_STYLE from '../tableCommonStyle.js';

const REGULAR_LIST_TABLE_STYLE = {
    regularListTable: {
        type: 'template',
        hasUpdateEvent: true,
        layoutModes: [
            {
                name: 'default',
                condition: 'default',
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    gap: '{dimension.gap.tight}',
                },
                structure: {
                    groups: [
                        {
                            name: 'titleBlock',
                            condition: 'has:title',
                            slots: ['title'],
                            type: 'template',
                            style: {
                                width: '100%',
                                marginBottom: '{dimension.margin.supertight}',
                            },
                        },
                        {
                            name: 'tableBlock',
                            slots: ['table'],
                            type: 'template',
                            style: {
                                width: '100%',
                                overflowX: 'auto',
                                borderRadius: '{dimension.borderradius.large}',
                                overflow: 'hidden',
                            },
                        },
                    ],
                },
            },
        ],
        markdownMapping: {
            h2: 'title',
            h3: 'title',
            table: 'table',
        },
        slotConfigs: {
            title: {
                metaType: 'text',
                variant: 'h3',
                variantStyle: {
                    margin: '0',
                    padding: '0',
                    fontSize: '{font.size.large}',
                    fontWeight: '{font.fontweight.semibold}',
                    color: '{color.link.lightblue5}',
                    lineHeight: '1.4',
                },
            },
            table: {
                metaType: 'table',
                variant: 'commonStyle',
                style: {
                    width: '100%',
                    margin: '0',
                },
                tableElementStyle: TABLE_COMMON_STYLE.tableCommonStyle,
            },
        },
        slots: {
            title: { required: false, optional: true },
            table: { required: true, optional: false },
        },
        example: {
            title: '常规列表',
            table: [
                '| DingOS版本号 | 设备数量 | 操作 |',
                '|------|------|------|',
                '| AWS | 美国、亚洲、亚太 | ⟳  ⋮ |',
                '| Azure | 全球20+区域 | ⟳  ⋮ |',
                '| 阿里云 | 中国大陆主要城市 | ⟳  ⋮ |',
                '| 私有云 | 定制化部署 | ⟳  ⋮ |',
                '| AWS | 美国、亚洲、亚太 | ⟳  ⋮ |',
            ].join('\n'),
        },
    },
};

export default REGULAR_LIST_TABLE_STYLE;
