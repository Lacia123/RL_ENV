/**
 * commonStyle 列表组件 — 共享样式与插槽配置
 */

export const COMMON_STYLE_LIST_TITLE_TEXT_STYLE = {
    margin: '0',
    textAlign: 'left',
    fontSize: '{font.size.medium}',
    fontWeight: '{font.fontweight.bold}',
    lineHeight: '1.4',
    color: '{color.basic.opacity.black.100}',
};

export const COMMON_STYLE_LIST_DESC_TEXT_STYLE = {
    margin: '0',
    textAlign: 'left',
    fontSize: '{font.size.medium}',
    fontWeight: '{font.fontweight.semibold}',
    color: '{color.basic.opacity.black.64}',
    lineHeight: '1.4',
};

export const COMMON_STYLE_LIST_ROW_STYLE = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '{dimension.gap.base}',
    padding: '{dimension.padding.base} {dimension.padding.loose}',
    borderBottom: '1px solid {color.surfacecontainer.black7}',
    transition: 'background 0.15s ease',
};

/** 图 3/4 列表行 item hover token */
export const COMMON_STYLE_LIST_ITEM_HOVER = {
    '&:hover': {
        fill: '{color.basic.opacity.black.4}',
        borderRadius: '12',
    },
};

/** 带 item hover 的列表行（图 3 / 图 4） */
export const COMMON_STYLE_LIST_ITEM_ROW_STYLE = {
    ...COMMON_STYLE_LIST_ROW_STYLE,
    ...COMMON_STYLE_LIST_ITEM_HOVER,
};

/** 图 3 操作按钮文字（与中间描述区一致） */
export const COMMON_STYLE_LIST_ACTION_TEXT_STYLE = {
    margin: '0',
    fontSize: '{font.size.medium}',
    fontWeight: '{font.fontweight.semibold}',
    color: '{color.basic.opacity.black.64}',
    lineHeight: '1',
    cursor: 'default',
    userSelect: 'none',
};

export const COMMON_STYLE_LIST_SYNC_ACTION_STYLE = {
    ...COMMON_STYLE_LIST_ACTION_TEXT_STYLE,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '32px',
    minHeight: '32px',
    borderRadius: '{dimension.borderradius.medium}',
    '&:hover': {
        background: '{color.basic.opacity.black.8}',
    },
};

/** 图 3 列表 icon 区 24×24 */
export const COMMON_STYLE_LIST_ICON_BOX_STYLE = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: '0',
    width: '24px',
    height: '24px',
};

export const COMMON_STYLE_LIST_ICON_TEXT_STYLE = {
    margin: '0',
    width: '24px',
    height: '24px',
    fontSize: '24px',
    lineHeight: '24px',
    textAlign: 'center',
    color: '{color.primary.brand5}',
    flexShrink: '0',
};

export const COMMON_STYLE_LIST_ITEM_SUB_SLOTS = {
    icon: {
        metaType: 'text',
        variant: 'p',
        variantStyle: COMMON_STYLE_LIST_ICON_TEXT_STYLE,
    },
    title: {
        metaType: 'text',
        variant: 'p',
        variantStyle: COMMON_STYLE_LIST_TITLE_TEXT_STYLE,
    },
    description: {
        metaType: 'text',
        variant: 'p',
        variantStyle: COMMON_STYLE_LIST_DESC_TEXT_STYLE,
    },
    content: {
        metaType: 'text',
        variant: 'p',
        variantStyle: COMMON_STYLE_LIST_DESC_TEXT_STYLE,
    },
    sync: {
        metaType: 'text',
        variant: 'p',
        variantStyle: COMMON_STYLE_LIST_SYNC_ACTION_STYLE,
    },
    more: {
        metaType: 'text',
        variant: 'p',
        variantStyle: COMMON_STYLE_LIST_ACTION_TEXT_STYLE,
    },
};

export const COMMON_STYLE_LIST_ITEM_SUB_SLOTS_TINTED_ICON = {
    ...COMMON_STYLE_LIST_ITEM_SUB_SLOTS,
    icon: {
        metaType: 'text',
        variant: 'p',
        variantStyle: {
            ...COMMON_STYLE_LIST_ICON_TEXT_STYLE,
            color: 'inherit',
        },
    },
};

/** 生成 item / item* 成对插槽配置 */
export function duplicateCommonStyleListItemSlotConfig(itemConfig) {
    return {
        item: itemConfig,
        'item*': { ...itemConfig },
    };
}
