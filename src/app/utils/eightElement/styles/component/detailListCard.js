const DETAIL_ITEM_SUB_SLOTS = {
    title: {
        metaType: 'text',
        variant: 'p',
        variantStyle: {
            leadingTrim: 'both',
            textEdge: 'cap',
            fontSize: '{font.size.large}',
            fontStyle: 'normal',
            fontWeight: '{font.fontweight.bold}',
            lineHeight: '150%',
            color: '{color.basic.grey.9}',
            margin: '0',
        },
    },
    text: {
        metaType: 'text',
        variant: 'p',
        variantStyle: {
            leadingTrim: 'both',
            textEdge: 'cap',
            fontSize: '{font.size.large}',
            fontStyle: 'normal',
            fontWeight: '400',
            lineHeight: '120%',
            color: '{color.basic.grey.5}',
            margin: '0',
        },
    },
    score: {
        metaType: 'score',
        variantStyle: {
            gap: '8px',
        },
    },
};

// ── detailItem 行布局 ──────────────────────────────────────────────────────

const DETAIL_ITEM_ROW_STYLE = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    alignSelf: 'stretch',
    borderTop: '1px solid {color.basic.grey.1}',
};

const DETAIL_ITEM_LAYOUT = [
    {
        name: 'row',
        style: DETAIL_ITEM_ROW_STYLE,
        slotGroups: [
            {
                name: 'titleCell',
                style: {
                    display: 'flex',
                    flex: '0 0 156px',
                    padding: '{dimension.padding.loose}',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    alignSelf: 'stretch',
                    borderRadius: '{dimension.borderradius.none}',
                    background: '{color.basic.opacity.black.4}',
                },
                slots: ['title'],
            },
            {
                name: 'valueCell',
                style: {
                    display: 'flex',
                    flex: '1 1 auto',
                    minWidth: '0',
                    padding: '{dimension.padding.loose}',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    alignSelf: 'stretch',
                    borderRadius: '{dimension.borderradius.none}',
                    backdropFilter: 'blur(7px)',
                },
                slots: ['text', 'score'],
            },
        ],
    },
];

// ── 组件配置 ───────────────────────────────────────────────────────────────

const DETAIL_LIST_CARD_STYLE = {
    detailListCard: {
        type: 'template',
        hasUpdateEvent: true,

        // ── default layoutMode（上中下三块） ──
        layoutModes: [
            {
                name: 'default',
                condition: 'default',
                style: {
                    display: 'flex',
                    width: '100%',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0',
                    borderRadius: '32px',
                    overflow: 'hidden',
                    margin: '0 auto',
                },
                structure: {
                    groups: [
                        // ── 上方标题容器（紫底） ──
                        {
                            name: 'titleBlock',
                            condition: 'has:title || has:subtitle',
                            type: 'template',
                            slots: ['title', 'subtitle'],
                            style: {
                                display: 'flex',
                                padding: '40px',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '{dimension.gap.loose}',
                                alignSelf: 'stretch',
                                borderRadius: '{dimension.borderradius.none}',
                                border: '1.2px solid rgba(255, 255, 255, 0.64)',
                                background: '{color.basic.brand.6}',
                                backdropFilter: 'blur(7px)',
                            },
                        },
                        // ── 中间图片容器（灰底） ──
                        {
                            name: 'imageBlock',
                            condition: 'has:image',
                            type: 'template',
                            slots: ['image'],
                            style: {
                                display: 'flex',
                                alignSelf: 'stretch',
                                padding: '{dimension.padding.semiloose}',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                borderRadius: '{dimension.borderradius.none}',
                                border: '1.2px solid rgba(255, 255, 255, 0.64)',
                                background: '{color.basic.grey.0}',
                                backdropFilter: 'blur(7px)',
                            },
                        },
                        // ── 下方表格（detailItem 行列表） ──
                        {
                            name: 'detailItemBlock',
                            condition: 'has:detailItem',
                            slots: ['detailItem*'],
                            type: 'template',
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                width: '100%',
                                margin: '0',
                            },
                        },
                    ],
                },
            },
        ],

        // ── fallback style（与 layoutModes.default 一致） ──
        style: {
            display: 'flex',
            width: '100%',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0',
            borderRadius: '32px',
            overflow: 'hidden',
            margin: '0 auto',
        },

        // ── 槽位配置 ──
        slotConfigs: {
            title: {
                metaType: 'text',
                variant: 'h3',
                variantStyle: {
                    leadingTrim: 'both',
                    textEdge: 'cap',
                    fontSize: '32px',
                    fontStyle: 'normal',
                    fontWeight: '{font.fontweight.bold}',
                    lineHeight: '150%',
                    color: '{color.basic.opacity.white.100}',
                    textAlign: 'center',
                    justifyContent: 'center',
                    margin: '0',
                },
            },
            subtitle: {
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    leadingTrim: 'both',
                    textEdge: 'cap',
                    fontSize: '{font.size.large}',
                    fontStyle: 'normal',
                    fontWeight: '{font.fontweight.bold}',
                    lineHeight: '150%',
                    color: '{color.basic.opacity.white.48}',
                    textAlign: 'center',
                    justifyContent: 'center',
                    margin: '0',
                },
            },
            image: {
                metaType: 'image',
                variant: 'normal',
                variantStyle: {
                    borderRadius: '30px',
                    height: '360px',
                    alignSelf: 'stretch',
                    objectFit: 'cover',
                },
            },
            detailItem: {
                type: 'template',
                metaType: 'feedItem',
                itemStyles: { row: DETAIL_ITEM_ROW_STYLE },
                subSlots: DETAIL_ITEM_SUB_SLOTS,
                itemLayout: DETAIL_ITEM_LAYOUT,
            },
        },

        // ── 外部可用槽位 ──
        slots: {
            title: { required: false, optional: true, supportedAttributes: ['color'] },
            subtitle: { required: false, optional: true, supportedAttributes: ['color'] },
            image: { required: false, optional: true, supportedAttributes: ['src', 'href'] },
            detailItem: {
                required: false,
                optional: true,
                supportedAttributes: ['title', 'text', 'score', 'value', 'max', 'color'],
            },
        },
    },
};

export default DETAIL_LIST_CARD_STYLE