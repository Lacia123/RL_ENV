/**
 * commonStyle 列表 — 图 4（24×24 icon + 标题/描述列 + 操作）
 * token 与图 3 一致；图 3 的 content 在图 4 为 desc（数据仍可用 key="content"）
 *
 * <layout:row flexWrap="wrap">
 * <loop data="commonStyleServiceGridData" nativeEvent="click">
 * <commonStyleServiceListDesc>
 * <icon key="icon"></icon>
 * <layout:column>
 * <title key="title"></title>
 * <desc key="content"></desc>
 * </layout:column>
 * </commonStyleServiceListDesc>
 * </loop>
 * </layout:row>
 */

import {
    COMMON_STYLE_LIST_ITEM_ROW_STYLE,
    COMMON_STYLE_LIST_ICON_BOX_STYLE,
    COMMON_STYLE_LIST_ITEM_SUB_SLOTS,
    COMMON_STYLE_LIST_DESC_TEXT_STYLE,
    duplicateCommonStyleListItemSlotConfig,
} from './commonStyleListShared.js';

const COMMON_STYLE_LIST_DESC_SUB_SLOTS = {
    ...COMMON_STYLE_LIST_ITEM_SUB_SLOTS,
    desc: {
        metaType: 'text',
        variant: 'p',
        variantStyle: COMMON_STYLE_LIST_DESC_TEXT_STYLE,
    },
};

const COMMON_STYLE_LIST_DESC_ROW_SLOT_GROUPS = [
    {
        name: 'leading',
        style: COMMON_STYLE_LIST_ICON_BOX_STYLE,
        slots: ['icon'],
    },
    {
        name: 'main',
        style: {
            display: 'flex',
            flex: '1',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            gap: '{dimension.gap.supertight}',
            minWidth: '0',
        },
        slots: ['title', 'desc'],
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

const COMMON_STYLE_LIST_DESC_FLAT_SLOT_GROUPS = [
    {
        name: 'leading',
        type: 'template',
        style: COMMON_STYLE_LIST_ICON_BOX_STYLE,
        slots: ['icon'],
    },
    {
        name: 'main',
        type: 'template',
        style: {
            display: 'flex',
            flex: '1',
            minWidth: '0',
        },
        slots: ['textCol'],
        styleReference: 'textColAlign',
    },
    {
        name: 'actions',
        condition: 'has:sync || has:more',
        type: 'template',
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

const COMMON_STYLE_LIST_DESC_ITEM_LAYOUT = [
    {
        name: 'row',
        style: COMMON_STYLE_LIST_ITEM_ROW_STYLE,
        slotGroups: COMMON_STYLE_LIST_DESC_ROW_SLOT_GROUPS,
    },
];

const COMMON_STYLE_LIST_DESC_ITEM_FEED_CONFIG = {
    metaType: 'feedItem',
    style: COMMON_STYLE_LIST_ITEM_ROW_STYLE,
    itemStyles: { row: COMMON_STYLE_LIST_ITEM_ROW_STYLE },
    subSlots: COMMON_STYLE_LIST_DESC_SUB_SLOTS,
    itemLayout: COMMON_STYLE_LIST_DESC_ITEM_LAYOUT,
};

const COMMON_STYLE_SERVICE_LIST_DESC_STYLE = {
    commonStyleServiceListDesc: {
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
                name: 'flatRowDesc',
                condition: 'has:textCol',
                style: {
                    ...COMMON_STYLE_LIST_ITEM_ROW_STYLE,
                    width: '100%',
                    boxSizing: 'border-box',
                },
                structure: {
                    groups: COMMON_STYLE_LIST_DESC_FLAT_SLOT_GROUPS,
                },
            },
        ],
        slotConfigs: {
            ...duplicateCommonStyleListItemSlotConfig(COMMON_STYLE_LIST_DESC_ITEM_FEED_CONFIG),
            icon: COMMON_STYLE_LIST_DESC_SUB_SLOTS.icon,
            title: COMMON_STYLE_LIST_DESC_SUB_SLOTS.title,
            desc: COMMON_STYLE_LIST_DESC_SUB_SLOTS.desc,
            sync: COMMON_STYLE_LIST_DESC_SUB_SLOTS.sync,
            more: COMMON_STYLE_LIST_DESC_SUB_SLOTS.more,
            textColAlign: {
                variantStyle: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '{dimension.gap.supertight}',
                    minWidth: '0',
                    width: '100%',
                },
            },
        },
        slots: {
            item: {
                required: false,
                optional: true,
                supportedAttributes: ['icon', 'title', 'desc', 'sync', 'more'],
            },
            icon: { required: false, optional: true },
            title: { required: false, optional: false },
            desc: { required: false, optional: true },
            sync: { required: false, optional: true },
            more: { required: false, optional: true },
        },
    },
};

export default COMMON_STYLE_SERVICE_LIST_DESC_STYLE;
