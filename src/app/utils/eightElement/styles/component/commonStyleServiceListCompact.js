/**
 * commonStyle 列表 — 图 5（≤3 条堆叠卡，token 与图 4 一致）
 *
 * 卡片级 loop + 平铺插槽（推荐）：
 * <layout:row flexWrap="wrap">
 * <loop data="commonStyleServiceGridDataCompact" nativeEvent="click">
 * <commonStyleServiceListCompact>
 * <icon key="icon"></icon>
 * <layout:column>
 * <title key="title"></title>
 * <desc key="content"></desc>
 * </layout:column>
 * </commonStyleServiceListCompact>
 * </loop>
 * </layout:row>
 *
 * 组件内 loop + item 亦支持（stackDeck）
 */

import {
    COMMON_STYLE_LIST_ITEM_HOVER,
    COMMON_STYLE_LIST_TITLE_TEXT_STYLE,
    COMMON_STYLE_LIST_DESC_TEXT_STYLE,
    COMMON_STYLE_LIST_ICON_TEXT_STYLE,
    COMMON_STYLE_LIST_ITEM_SUB_SLOTS,
    duplicateCommonStyleListItemSlotConfig,
} from './commonStyleListShared.js';

/** 堆叠步进：每层向下/向右偏移，露出下层标题与描述 */
const COMMON_STYLE_LIST_COMPACT_STACK_OFFSET = {
    stepY: '56px',
    stepX: '24px',
    stepY2: '112px',
    stepX2: '48px',
    reserveRight: '56px',
    reserveBottom: '188px',
    minHeight: '260px',
};

/** 卡片级 loop 容器：三张卡层叠（供 PSUIPParser 使用） */
export const COMMON_STYLE_LIST_COMPACT_LOOP_STACK_CLASS_STYLE = {
    position: 'relative',
    width: '100%',
    minHeight: COMMON_STYLE_LIST_COMPACT_STACK_OFFSET.minHeight,
    paddingRight: COMMON_STYLE_LIST_COMPACT_STACK_OFFSET.reserveRight,
    paddingBottom: COMMON_STYLE_LIST_COMPACT_STACK_OFFSET.reserveBottom,
    boxSizing: 'border-box',
    '& > *:nth-child(1)': {
        position: 'absolute',
        top: '0',
        left: '0',
        zIndex: '3',
        width: `calc(100% - ${COMMON_STYLE_LIST_COMPACT_STACK_OFFSET.reserveRight})`,
    },
    '& > *:nth-child(2)': {
        position: 'absolute',
        top: COMMON_STYLE_LIST_COMPACT_STACK_OFFSET.stepY,
        left: COMMON_STYLE_LIST_COMPACT_STACK_OFFSET.stepX,
        zIndex: '2',
        width: `calc(100% - ${COMMON_STYLE_LIST_COMPACT_STACK_OFFSET.reserveRight})`,
    },
    '& > *:nth-child(3)': {
        position: 'absolute',
        top: COMMON_STYLE_LIST_COMPACT_STACK_OFFSET.stepY2,
        left: COMMON_STYLE_LIST_COMPACT_STACK_OFFSET.stepX2,
        zIndex: '1',
        width: `calc(100% - ${COMMON_STYLE_LIST_COMPACT_STACK_OFFSET.reserveRight})`,
    },
    '& > *:nth-child(1) > *:nth-child(1)': {
        background: '{color.basic.purple.1}',
    },
    '& > *:nth-child(1) > *:nth-child(1) *': {
        color: '{color.basic.purple.6}',
    },
    '& > *:nth-child(2) > *:nth-child(1)': {
        background: '{color.surfacecontainer.black7}',
    },
    '& > *:nth-child(2) > *:nth-child(1) *': {
        color: '{color.basic.opacity.black.64}',
    },
    '& > *:nth-child(3) > *:nth-child(1)': {
        background: '{color.basic.light-blue.1}',
    },
    '& > *:nth-child(3) > *:nth-child(1) *': {
        color: '{color.basic.light-blue.6}',
    },
};

/** 单张堆叠卡 */
const COMMON_STYLE_LIST_COMPACT_CARD_STYLE = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '{dimension.gap.base}',
    padding: '{dimension.padding.base} {dimension.padding.loose}',
    fill: '{color.basic.opacity.white.100}',
    borderRadius: '{dimension.borderradius.xl}',
    boxShadow: '{material.hierarchy.4f}',
    width: '100%',
    boxSizing: 'border-box',
    ...COMMON_STYLE_LIST_ITEM_HOVER,
};

const COMMON_STYLE_LIST_COMPACT_ICON_BOX_STYLE = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: '0',
    width: '48px',
    height: '48px',
    borderRadius: '{dimension.borderradius.medium}',
};

const COMMON_STYLE_LIST_COMPACT_SUB_SLOTS = {
    ...COMMON_STYLE_LIST_ITEM_SUB_SLOTS,
    icon: {
        metaType: 'text',
        variant: 'p',
        variantStyle: {
            ...COMMON_STYLE_LIST_ICON_TEXT_STYLE,
            width: 'auto',
            height: 'auto',
            fontSize: '{font.size.xxl}',
            lineHeight: '1',
            color: 'inherit',
        },
    },
    desc: {
        metaType: 'text',
        variant: 'p',
        variantStyle: COMMON_STYLE_LIST_DESC_TEXT_STYLE,
    },
    title: {
        metaType: 'text',
        variant: 'p',
        variantStyle: COMMON_STYLE_LIST_TITLE_TEXT_STYLE,
    },
    link: {
        metaType: 'text',
        variant: 'p',
        variantStyle: {
            margin: '0',
            fontSize: '{font.size.medium}',
            lineHeight: '1',
            color: '{color.basic.opacity.black.48}',
            flexShrink: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '32px',
        },
    },
};

const COMMON_STYLE_LIST_COMPACT_FLAT_SLOT_GROUPS = [
    {
        name: 'leading',
        type: 'template',
        style: COMMON_STYLE_LIST_COMPACT_ICON_BOX_STYLE,
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
        name: 'linkBlock',
        condition: 'has:link',
        type: 'template',
        style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: '0',
        },
        slots: ['link'],
    },
];

const COMMON_STYLE_LIST_COMPACT_ROW_SLOT_GROUPS = [
    {
        name: 'iconBox',
        style: COMMON_STYLE_LIST_COMPACT_ICON_BOX_STYLE,
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
        name: 'linkBlock',
        condition: 'has:link',
        style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: '0',
        },
        slots: ['link'],
    },
];

const COMMON_STYLE_LIST_COMPACT_ITEM_LAYOUT = [
    {
        name: 'row',
        style: COMMON_STYLE_LIST_COMPACT_CARD_STYLE,
        slotGroups: COMMON_STYLE_LIST_COMPACT_ROW_SLOT_GROUPS,
    },
];

const COMMON_STYLE_LIST_COMPACT_ITEM_FEED_CONFIG = {
    metaType: 'feedItem',
    style: COMMON_STYLE_LIST_COMPACT_CARD_STYLE,
    itemStyles: { row: COMMON_STYLE_LIST_COMPACT_CARD_STYLE },
    subSlots: COMMON_STYLE_LIST_COMPACT_SUB_SLOTS,
    itemLayout: COMMON_STYLE_LIST_COMPACT_ITEM_LAYOUT,
};

const COMMON_STYLE_LIST_COMPACT_STACK_STYLE = {
    ...COMMON_STYLE_LIST_COMPACT_LOOP_STACK_CLASS_STYLE,
    '& > *:nth-child(1)': {
        ...COMMON_STYLE_LIST_COMPACT_LOOP_STACK_CLASS_STYLE['& > *:nth-child(1)'],
        width: '100%',
    },
    '& > *:nth-child(2)': {
        ...COMMON_STYLE_LIST_COMPACT_LOOP_STACK_CLASS_STYLE['& > *:nth-child(2)'],
        width: '100%',
    },
    '& > *:nth-child(3)': {
        ...COMMON_STYLE_LIST_COMPACT_LOOP_STACK_CLASS_STYLE['& > *:nth-child(3)'],
        width: '100%',
    },
};

const COMMON_STYLE_SERVICE_LIST_COMPACT_STYLE = {
    commonStyleServiceListCompact: {
        type: 'template',
        hasUpdateEvent: true,
        layoutModes: [
            {
                name: 'flatRowDesc',
                condition: 'has:textCol',
                style: COMMON_STYLE_LIST_COMPACT_CARD_STYLE,
                structure: {
                    groups: COMMON_STYLE_LIST_COMPACT_FLAT_SLOT_GROUPS,
                },
            },
            {
                name: 'stackDeck',
                condition: 'has:item',
                style: {
                    display: 'block',
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
                            style: COMMON_STYLE_LIST_COMPACT_STACK_STYLE,
                        },
                    ],
                },
            },
        ],
        slotConfigs: {
            ...duplicateCommonStyleListItemSlotConfig(COMMON_STYLE_LIST_COMPACT_ITEM_FEED_CONFIG),
            icon: COMMON_STYLE_LIST_COMPACT_SUB_SLOTS.icon,
            title: COMMON_STYLE_LIST_COMPACT_SUB_SLOTS.title,
            desc: COMMON_STYLE_LIST_COMPACT_SUB_SLOTS.desc,
            link: COMMON_STYLE_LIST_COMPACT_SUB_SLOTS.link,
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
                supportedAttributes: ['icon', 'title', 'desc', 'link'],
            },
            icon: { required: false, optional: true },
            title: { required: false, optional: false },
            desc: { required: false, optional: true },
            link: { required: false, optional: true },
        },
    },
};

export default COMMON_STYLE_SERVICE_LIST_COMPACT_STYLE;
