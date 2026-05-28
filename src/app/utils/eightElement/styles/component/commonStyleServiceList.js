/**
 * commonStyle 列表 — 图 3（24×24 icon + 标题 + 中间文案 + 操作）
 *
 * 多行 item：
 * <commonStyleServiceList>
 * <loop data="commonStyleServiceListData">
 * <item>...</item>
 * </loop>
 * </commonStyleServiceList>
 *
 * loop 平铺插槽（与图 1 同源数据）：
 * <layout:row flexWrap="wrap">
 * <loop data="commonStyleServiceGridData">
 * <commonStyleServiceList>
 * <icon key="icon"></icon>
 * <title key="title"></title>
 * <content key="content"></content>
 * </commonStyleServiceList>
 * </loop>
 * </layout:row>
 */

import {
    COMMON_STYLE_LIST_ITEM_ROW_STYLE,
    COMMON_STYLE_LIST_ICON_BOX_STYLE,
    COMMON_STYLE_LIST_ITEM_SUB_SLOTS,
    duplicateCommonStyleListItemSlotConfig,
} from './commonStyleListShared.js';

/** icon + title 一组，content 一组，两组 flex:1 平分 */
const COMMON_STYLE_LIST_ROW_SLOT_GROUPS = [
    {
        name: 'titleGroup',
        style: {
            display: 'flex',
            flex: '1',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '{dimension.gap.tight}',
            minWidth: '0',
        },
        slots: ['icon', 'title'],
    },
    {
        name: 'contentGroup',
        style: {
            display: 'flex',
            flex: '1',
            flexDirection: 'row',
            alignItems: 'center',
            minWidth: '0',
        },
        slots: ['content', 'description'],
    },
    {
        name: 'actions',
        condition: 'has:sync || has:more',
        style: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '{dimension.gap.tight}',
            flexShrink: '0',
        },
        slots: ['sync', 'more'],
    },
];

const COMMON_STYLE_LIST_ITEM_LAYOUT = [
    {
        name: 'row',
        style: COMMON_STYLE_LIST_ITEM_ROW_STYLE,
        slotGroups: COMMON_STYLE_LIST_ROW_SLOT_GROUPS,
    },
];

const COMMON_STYLE_LIST_ITEM_FEED_CONFIG = {
    metaType: 'feedItem',
    style: COMMON_STYLE_LIST_ITEM_ROW_STYLE,
    itemStyles: { row: COMMON_STYLE_LIST_ITEM_ROW_STYLE },
    subSlots: COMMON_STYLE_LIST_ITEM_SUB_SLOTS,
    itemLayout: COMMON_STYLE_LIST_ITEM_LAYOUT,
};

const COMMON_STYLE_SERVICE_LIST_STYLE = {
    commonStyleServiceList: {
        type: 'template',
        hasUpdateEvent: true,
        layoutModes: [
            {
                name: 'itemList',
                condition: 'has:item',
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    background: 'transparent',
                },
                structure: {
                    groups: [
                        {
                            name: 'item',
                            condition: 'has:item',
                            slots: ['item*'],
                            type: 'template',
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                width: '100%',
                            },
                        },
                    ],
                },
            },
            {
                name: 'flatRowLoop',
                condition: 'has:title',
                style: {
                    ...COMMON_STYLE_LIST_ITEM_ROW_STYLE,
                    width: '100%',
                    boxSizing: 'border-box',
                },
                structure: {
                    groups: COMMON_STYLE_LIST_ROW_SLOT_GROUPS.map((group) => ({
                        ...group,
                        type: 'template',
                    })),
                },
            },
        ],
        slotConfigs: {
            ...duplicateCommonStyleListItemSlotConfig(COMMON_STYLE_LIST_ITEM_FEED_CONFIG),
            icon: COMMON_STYLE_LIST_ITEM_SUB_SLOTS.icon,
            title: COMMON_STYLE_LIST_ITEM_SUB_SLOTS.title,
            content: COMMON_STYLE_LIST_ITEM_SUB_SLOTS.content,
            description: COMMON_STYLE_LIST_ITEM_SUB_SLOTS.description,
            sync: COMMON_STYLE_LIST_ITEM_SUB_SLOTS.sync,
            more: COMMON_STYLE_LIST_ITEM_SUB_SLOTS.more,
        },
        slots: {
            item: {
                required: false,
                optional: true,
                supportedAttributes: ['icon', 'title', 'content', 'description', 'sync', 'more'],
            },
            icon: { required: false, optional: true },
            title: { required: false, optional: false },
            content: { required: false, optional: true },
            description: { required: false, optional: true },
            sync: { required: false, optional: true },
            more: { required: false, optional: true },
        },
    },
};

export default COMMON_STYLE_SERVICE_LIST_STYLE;
