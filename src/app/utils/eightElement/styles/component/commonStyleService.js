/**
 * commonStyle 通用 List — 网格卡（图 1 / 图 2）
 *
 * 图 1：<commonStyleListItemRow> — icon + title + content（叠层双块）
 * 图 2：<commonStyleList> + <card:commonStyleListItem> + layout:column
 *
 * 行列表见：commonStyleServiceList.js / commonStyleServiceListDesc.js / commonStyleServiceListCompact.js
 */

const COMMON_STYLE_LIST_CARD_PARAMS = {
    headerTint: {
        source: 'outer',
        default: '{color.basic.brand.1}',
    },
    accentColor: {
        source: 'outer',
        default: '{color.basic.brand.6}',
    },
    titleColor: {
        source: 'outer',
        default: '{color.basic.brand.7}',
    },
    iconColor: {
        source: 'outer',
        default: '{color.basic.brand.6}',
    },
    contentTint: {
        source: 'outer',
        default: '{color.basic.brand.0}',
    },
};

const COMMON_STYLE_LIST_CARD_CSS_VARS = {
    '--cs-header-tint': '$headerTint',
    '--cs-accent': '$accentColor',
    '--cs-title-color': '$titleColor',
    '--cs-icon-color': '$iconColor',
    '--cs-content-tint': '$contentTint',
};

const COMMON_STYLE_LIST_ICON_SLOT = {
    metaType: 'text',
    variant: 'p',
    variantStyle: {
        margin: '0',
        fontSize: '{font.size.xxl}',
        lineHeight: '1',
        color: 'var(--cs-icon-color)',
        background: 'transparent',
        backgroundColor: 'transparent',
    },
};

const COMMON_STYLE_LIST_TITLE_SLOT = {
    metaType: 'text',
    variant: 'p',
    variantStyle: {
        margin: '0',
        color: 'var(--cs-title-color)',
        background: 'transparent',
        backgroundColor: 'transparent',
        fontWeight: '{font.fontweight.bold}',
        fontSize: '{font.size.xl}',
        lineHeight: '1.4',
    },
};

const COMMON_STYLE_LIST_CONTENT_SLOT = {
    metaType: 'text',
    variant: 'p',
    variantStyle: {
        margin: '0',
        color: '{color.basic.opacity.black.64}',
        background: 'transparent',
        backgroundColor: 'transparent',
        fontWeight: '{font.fontweight.semibold}',
        fontSize: '{font.size.small}',
        lineHeight: '1.4',
    },
};

const COMMON_STYLE_LIST_CONTAINER = {
    type: 'template',
    layoutModes: [
        {
            name: 'default',
            condition: 'default',
            style: {
                display: 'flex',
                flexWrap: 'wrap',
                gap: '{dimension.gap.base}',
                width: '100%',
                alignItems: 'stretch',
            },
        },
    ],
    markdownMapping: {
        'card:commonStyleListItem': 'cards.card*',
        'card:commonStyleServiceGridCard': 'cards.card*',
        'card:*': 'cards.card*',
    },
    cards: {
        type: 'template',
        style: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '{dimension.gap.base}',
            width: '100%',
            alignItems: 'stretch',
        },
        'card*': {
            metaType: 'component',
            variant: 'commonStyleListItem',
        },
    },
};

/** 图 1：叠层行卡（平铺 icon / title / content） */
const COMMON_STYLE_LIST_ITEM_ROW = {
    type: 'template',
    hasUpdateEvent: true,
    parameters: COMMON_STYLE_LIST_CARD_PARAMS,
    style: COMMON_STYLE_LIST_CARD_CSS_VARS,
    layoutModes: [
        {
            name: 'overlapRowCard',
            condition: 'default',
            style: {
                display: 'flex',
                flexDirection: 'column',
                flex: '0 0 48%',
                minWidth: '200px',
                position: 'relative',
                overflow: 'visible',
                background: 'transparent',
                border: 'none',
                boxShadow: 'none',
            },
            structure: {
                groups: [
                    {
                        name: 'headerBlock',
                        slots: ['icon'],
                        type: 'template',
                        style: {
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            boxSizing: 'border-box',
                            width: 'calc(100% - 20px)',
                            maxWidth: '100%',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            height: '121px',
                            minHeight: '121px',
                            padding: '{dimension.padding.loose}',
                            background: 'var(--cs-header-tint)',
                            borderRadius: '{dimension.borderradius.xl}',
                            position: 'relative',
                            zIndex: '2',
                        },
                    },
                    {
                        name: 'bodyBlock',
                        type: 'template',
                        style: {
                            position: 'relative',
                            width: '100%',
                            padding: '0',
                            background: 'transparent',
                        },
                        groups: [
                            {
                                name: 'textRowWrap',
                                condition: 'has:title',
                                slots: ['title', 'content'],
                                type: 'template',
                                styleReference: 'textRowAlign',
                                style: {
                                    display: 'flex',
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '{dimension.gap.tight}',
                                    boxSizing: 'border-box',
                                    width: 'calc(100% - 12px)',
                                    height: '111px',
                                    minHeight: '111px',
                                    marginLeft: 'auto',
                                    marginRight: 'auto',
                                    marginTop: '-40px',
                                    padding:
                                        '44px {dimension.padding.loose} {dimension.padding.loose}',
                                    background: 'var(--cs-content-tint)',
                                    borderRadius: '{dimension.borderradius.xl}',
                                    boxShadow: '{material.hierarchy.4f}',
                                    position: 'relative',
                                    zIndex: '1',
                                    textAlign: 'center',
                                },
                            },
                        ],
                    },
                ],
            },
        },
    ],
    slotConfigs: {
        textRowAlign: {
            variantStyle: {
                textAlign: 'center',
            },
        },
        icon: COMMON_STYLE_LIST_ICON_SLOT,
        title: {
            ...COMMON_STYLE_LIST_TITLE_SLOT,
            variantStyle: {
                ...COMMON_STYLE_LIST_TITLE_SLOT.variantStyle,
                textAlign: 'center',
            },
        },
        content: {
            ...COMMON_STYLE_LIST_CONTENT_SLOT,
            variantStyle: {
                ...COMMON_STYLE_LIST_CONTENT_SLOT.variantStyle,
                textAlign: 'center',
            },
        },
    },
    slots: {
        icon: { required: false, optional: true },
        title: { required: true, optional: false },
        content: { required: false, optional: true },
    },
};

/** 图 2：整块 item + layout:column（icon 上 / 文案下） */
const COMMON_STYLE_LIST_ITEM = {
    type: 'template',
    hasUpdateEvent: true,
    parameters: COMMON_STYLE_LIST_CARD_PARAMS,
    style: COMMON_STYLE_LIST_CARD_CSS_VARS,
    layoutModes: [
        {
            name: 'columnItemCard',
            condition: 'has:textCol',
            style: {
                display: 'flex',
                flexDirection: 'column',
                flex: '0 0 48%',
                minWidth: '200px',
                position: 'relative',
                overflow: 'visible',
                background: 'transparent',
                border: 'none',
                boxShadow: 'none',
            },
            structure: {
                groups: [
                    {
                        name: 'itemBlock',
                        type: 'template',
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            width: '100%',
                            boxSizing: 'border-box',
                            background: 'var(--cs-content-tint)',
                            borderRadius: '{dimension.borderradius.xl}',
                            boxShadow: '{material.hierarchy.4f}',
                            overflow: 'hidden',
                        },
                        groups: [
                            {
                                name: 'iconBlock',
                                slots: ['icon'],
                                type: 'template',
                                style: {
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    alignSelf: 'center',
                                    boxSizing: 'border-box',
                                    width: 'calc(100% - 16px)',
                                    margin: '8px',
                                    minHeight: '121px',
                                    padding: '{dimension.padding.loose}',
                                    background: 'var(--cs-header-tint)',
                                    borderRadius: '{dimension.borderradius.large}',
                                },
                            },
                            {
                                name: 'textColBody',
                                slots: ['textCol'],
                                type: 'template',
                                styleReference: 'textColAlign',
                                style: {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '{dimension.gap.tight}',
                                    width: '100%',
                                    boxSizing: 'border-box',
                                    padding: '0 8px 8px',
                                    background: 'transparent',
                                    textAlign: 'center',
                                },
                            },
                        ],
                    },
                ],
            },
        },
    ],
    slotConfigs: {
        textColAlign: {
            variantStyle: {
                textAlign: 'center',
                alignItems: 'center',
                justifyContent: 'center',
            },
        },
        icon: COMMON_STYLE_LIST_ICON_SLOT,
        title: {
            ...COMMON_STYLE_LIST_TITLE_SLOT,
            variantStyle: {
                ...COMMON_STYLE_LIST_TITLE_SLOT.variantStyle,
                textAlign: 'center',
            },
        },
        content: {
            ...COMMON_STYLE_LIST_CONTENT_SLOT,
            variantStyle: {
                ...COMMON_STYLE_LIST_CONTENT_SLOT.variantStyle,
                textAlign: 'center',
            },
        },
        /** @deprecated 与 content 同义，layout:column 内仍可用 */
        description: {
            ...COMMON_STYLE_LIST_CONTENT_SLOT,
            variantStyle: {
                ...COMMON_STYLE_LIST_CONTENT_SLOT.variantStyle,
                textAlign: 'center',
            },
        },
    },
    slots: {
        icon: { required: false, optional: true },
        title: { required: true, optional: false },
        content: { required: false, optional: true },
        description: { required: false, optional: true },
    },
};

/** @deprecated 使用 commonStyleList */
const COMMON_STYLE_SERVICE_GRID = COMMON_STYLE_LIST_CONTAINER;
/** @deprecated 图 2 使用 commonStyleListItem；图 1 使用 commonStyleListItemRow */
const COMMON_STYLE_SERVICE_GRID_CARD = COMMON_STYLE_LIST_ITEM;

const COMMON_STYLE_SERVICE_STYLE = {
    commonStyleList: COMMON_STYLE_LIST_CONTAINER,
    commonStyleListItemRow: COMMON_STYLE_LIST_ITEM_ROW,
    commonStyleListItem: COMMON_STYLE_LIST_ITEM,
    commonStyleServiceGrid: COMMON_STYLE_SERVICE_GRID,
    commonStyleServiceGridCard: COMMON_STYLE_SERVICE_GRID_CARD,
};

export default COMMON_STYLE_SERVICE_STYLE;
