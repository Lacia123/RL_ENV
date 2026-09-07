const SHOWCASE_CARD_STYLE = {
    showcaseCard: {
        type: 'template',
        description: '展示型卡片容器。支持两种布局：1) 默认上中下三段布局（支持 title/subtitle/toggle/text/loading/button/imageTextItem/commonListItem/doubleImageItem/caption 插槽）；2) preview 布局（含 preview 标签时）—— 左右布局，左侧 title + caption，右侧 preview 图片。其中 text 为 24px 段落正文；loading 渲染为上下两段渐变骨架条（下条 60% 宽、均 32px 高、opacity 0.6）；button 渲染为内边距 20px 40px、白字 32px 居中的展示按钮。',
        layoutModes: [
            {
                name: 'previewMode',
                condition: 'has:preview',
                style: {
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'stretch',
                    justifyContent: 'space-between',
                    gap: '{dimension.gap.extraloose}',
                    padding: '{dimension.padding.extraloose}',
                    width: '100%',
                    boxSizing: 'border-box',
                    borderRadius: '{dimension.borderradius.xxxl}',
                    background: '{color.basic.opacity.white.48}',
                },
                structure: {
                    groups: [
                        {
                            name: 'leftBlock',
                            type: 'template',
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                flex: '1',
                                minWidth: '0',
                                alignSelf: 'stretch',
                            },
                            slots: ['title', 'caption'],
                        },
                        {
                            name: 'previewBlock',
                            type: 'template',
                            condition: 'has:preview',
                            style: {
                                flexShrink: '0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '180px',
                                height: '154px',
                                overflow: 'hidden',
                                boxSizing: 'border-box',
                                borderRadius: '{dimension.borderradius.small}',
                            },
                            slots: ['preview'],
                        },
                    ],
                },
            },
            {
                name: 'default',
                condition: 'default',
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    // 🆕 弹性布局：块间距从 extraloose(24) 收紧到 semitight(8)，
                    // 矮格（1×2）内把空间让给正文；富余空间的弹性由
                    // loadingBlock/buttonBlock 的 margin-top:auto 承担
                    gap: '{dimension.gap.semitight}',
                    padding: '{dimension.padding.extraloose}',
                    width: '100%',
                    boxSizing: 'border-box',
                    borderRadius: '{dimension.borderradius.xxxl}',
                    background: '{color.basic.opacity.white.48}',
                },
                structure: {
                    groups: [
                        {
                            name: 'topRow',
                            type: 'template',
                            style: {
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '12px',
                                width: '100%',
                            },
                            groups: [
                                {
                                    name: 'titleGroup',
                                    type: 'template',
                                    style: {
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'baseline',
                                        gap: '8px',
                                        flex: '1',
                                        minWidth: '0',
                                    },
                                    slots: ['title', 'subtitle'],
                                },
                                {
                                    name: 'toggleGroup',
                                    type: 'template',
                                    condition: 'has:toggle',
                                    style: {
                                        flexShrink: '0',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                    },
                                    slots: ['toggle'],
                                },
                            ],
                        },
                        {
                            name: 'textBlock',
                            type: 'template',
                            condition: 'has:text',
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                width: '100%',
                            },
                            slots: ['text'],
                        },
                        {
                            name: 'middleBlock',
                            type: 'template',
                            condition: 'has:imageTextItem || has:commonListItem || has:doubleImageItem',
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                                width: '100%',
                                // 🆕 grid 适配：列表区占满剩余高度（格子高度随余数浮动），内容由 flex 弹性分配
                                flex: '1',
                                minHeight: '0',
                                // 🆕 列表区自身可滚动：内容超出（格子过矮）时只在列表内滚动，
                                // 不把整卡撑破/挤压其他区块（滚动只发生在 filelist 内部）
                                overflowY: 'auto',
                            },
                            slots: ['imageTextItem*', 'commonListItem*', 'doubleImageItem*'],
                        },
                        {
                            name: 'loadingBlock',
                            type: 'template',
                            condition: 'has:loading',
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                width: '100%',
                                // 🆕 弹性布局：富余空间推给 loading+button（贴底），
                                // 空间不足时 auto margin 归零、块自然紧凑堆叠
                                marginTop: 'auto',
                            },
                            slots: ['loading'],
                        },
                        {
                            name: 'buttonBlock',
                            type: 'template',
                            condition: 'has:button',
                            style: {
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                width: '100%',
                            },
                            slots: ['button'],
                        },
                        {
                            name: 'captionRow',
                            type: 'template',
                            condition: 'has:caption',
                            style: {
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start',
                                width: '100%',
                            },
                            slots: ['caption'],
                        },
                    ],
                },
            },
        ],
        slots: {
            title: {
                metaType: 'text',
                supportedAttributes: ['href', 'target'],
                variant: 'showcaseCardTitle',
                variantStyle: {
                    margin: '0',
                    fontSize: '{font.size.xxl}',
                    fontWeight: '{font.fontweight.bold}',
                    color: '{color.basic.grey.9}',
                    lineHeight: 1.4,
                    whiteSpace: 'normal',
                    overflowWrap: 'break-word',
                },
            },
            subtitle: {
                metaType: 'text',
                supportedAttributes: ['href', 'target'],
                variant: 'showcaseCardSubTitle',
                variantStyle: {
                    margin: '0',
                    marginLeft: 'auto',
                    fontSize: '{font.size.xl}',
                    fontWeight: '{font.fontweight.medium}',
                    color: '{color.basic.dark-blue.2}',
                    lineHeight: 1.4,
                    textAlign: 'right',
                    whiteSpace: 'normal',
                    overflowWrap: 'break-word',
                },
            },
            toggle: {
                metaType: 'text',
                supportedAttributes: ['href', 'target'],
                variant: 'showcaseCardToggle',
                variantStyle: {
                    margin: '0',
                    display: 'inline-block',
                    width: '84px',
                    height: '48px',
                    borderRadius: '200px',
                    background: '{color.basic.brand.6}',
                    position: 'relative',
                    verticalAlign: 'middle',
                    fontSize: '0',
                    lineHeight: '0',
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: '{color.basic.opacity.white.100}',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
                    },
                },
            },
            caption: {
                metaType: 'text',
                supportedAttributes: ['href', 'target'],
                variant: 'showcaseCardBottomText',
                variantStyle: {
                    margin: '0',
                    fontSize: '{font.size.xl}',
                    fontWeight: '{font.fontweight.medium}',
                    color: '{color.basic.dark-blue.2}',
                    lineHeight: 1.5,
                    textAlign: 'left',
                },
            },
            // 段落正文：黑字 24px
            text: {
                metaType: 'text',
                supportedAttributes: ['href', 'target'],
                variant: 'showcaseCardText',
                variantStyle: {
                    margin: '0',
                    fontSize: '24px',
                    color: '{color.basic.opacity.black.100}',
                    lineHeight: 1.5,
                    textAlign: 'left',
                    whiteSpace: 'normal',
                    overflowWrap: 'break-word',
                },
            },
            // 骨架占位：上下两个渐变条，下方条宽度 60%，高均 32px，整体 opacity 0.6
            loading: {
                metaType: 'text',
                supportedAttributes: [],
                variant: 'showcaseCardLoading',
                variantStyle: {
                    margin: '0',
                    display: 'block',
                    width: '100%',
                    height: 'auto',
                    fontSize: '0',
                    lineHeight: '0',
                    opacity: '0.6',
                    '&::before': {
                        content: '""',
                        display: 'block',
                        width: '100%',
                        height: '32px',
                        background: 'linear-gradient(271deg, rgba(142, 100, 221, 0.10) 0.79%, rgba(183, 100, 221, 0.40) 37.16%, rgba(126, 100, 221, 0.10) 99.07%)',
                        borderRadius: '{dimension.borderradius.small}',
                    },
                    '&::after': {
                        content: '""',
                        display: 'block',
                        width: '60%',
                        height: '32px',
                        marginTop: '16px',
                        background: 'linear-gradient(271deg, rgba(142, 100, 221, 0.10) 0.79%, rgba(183, 100, 221, 0.40) 37.16%, rgba(126, 100, 221, 0.10) 99.07%)',
                        borderRadius: '{dimension.borderradius.small}',
                    },
                },
            },
            // 展示按钮：内边距 12px 40px（原 20px 40px，垂直内边距收紧以适配矮格），白字 32px 居中
            button: {
                metaType: 'button',
                supportedAttributes: ['href'],
                variant: 'primary',
                variantStyle: {
                    margin: '0',
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    gap: '10px',
                    padding: '12px 40px',
                    fontSize: '32px',
                    fontWeight: '{font.fontweight.semibold}',
                    color: '{color.basic.opacity.white.100}',
                    background: 'linear-gradient(272deg, rgba(120, 208, 254, 0.80) -5.46%, rgba(189, 125, 255, 0.80) 47.74%, rgba(113, 59, 239, 0.80) 96.57%)',
                    borderRadius: '60px',
                    boxShadow: 'none',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    '&:hover': {
                        background: 'linear-gradient(272deg, rgba(120, 208, 254, 0.80) -5.46%, rgba(189, 125, 255, 0.80) 47.74%, rgba(113, 59, 239, 0.80) 96.57%)',
                        transform: 'none',
                        boxShadow: 'none',
                    },
                },
            },
            preview: {
                metaType: 'image',
                variant: 'cover',
                supportedAttributes: ['src', 'alt'],
                description: '预览图，触发 preview 布局模式（左右布局）。',
                variantStyle: {
                    width: '180px',
                    height: '154px',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    display: 'block',
                    margin: '0',
                    padding: '0',
                    borderRadius: '{dimension.borderradius.small}',
                    borderWidth: '0',
                    borderStyle: 'none',
                    borderColor: 'transparent',
                    boxShadow: 'none',
                    overflow: 'hidden',
                    boxSizing: 'border-box',
                },
            },
            imageTextItem: createImageTextItemSlotConfig(),
            commonListItem: createCommonListItemSlotConfig(),
            doubleImageItem: createDoubleImageItemSlotConfig(),
        },
    },
};

/**
 * imageTextItem：单图 + 标题 + 正文，参考 pairedImageTextCard.primaryItem 的布局
 */
function createImageTextItemSlotConfig() {
    return {
        type: 'template',
        metaType: 'feedItem',
        style: {
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            minWidth: '0',
        },
        itemStyles: {
            row: {
                display: 'flex',
                flexDirection: 'column',
                minWidth: '0',
                overflow: 'visible',
            },
        },
        subSlots: {
            image: {
                metaType: 'image',
                variant: 'cover',
                description: '主图，必须提供。',
                variantStyle: {
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    display: 'block',
                    margin: '0',
                    padding: '0',
                    borderRadius: '30px',
                    borderWidth: '0',
                    borderStyle: 'none',
                    boxShadow: 'none',
                },
                supportedAttributes: ['src', 'alt'],
            },
            title: {
                metaType: 'text',
                variant: 'p',
                description: '标题。',
                variantStyle: {
                    margin: '0',
                    fontSize: '{font.size.xxl}',
                    fontWeight: '{font.fontweight.semibold}',
                    color: '{color.basic.grey.9}',
                    lineHeight: '1.35',
                    whiteSpace: 'normal',
                    overflowWrap: 'break-word',
                },
            },
            text: {
                metaType: 'text',
                variant: 'p',
                description: '正文描述。',
                variantStyle: {
                    margin: '0',
                    fontSize: '24px',
                    color: '{color.basic.dark-blue.2}',
                    lineHeight: '1.6',
                    whiteSpace: 'normal',
                    overflowWrap: 'break-word',
                },
            },
        },
        itemLayout: [
            {
                name: 'imageBlock',
                slots: ['image'],
                style: {
                    width: '100%',
                    // 🆕 grid 适配：图片高度弹性——占列表区剩余空间（随格子高度伸缩），
                    // 上限 260px 防止格子过高时图片失控；矮格子时自动压缩，不再依赖固定像素匹配
                    flex: '1',
                    minHeight: '100px',
                    maxHeight: '260px',
                    flexShrink: '1',
                    overflow: 'hidden',
                    position: 'relative',
                    zIndex: '0',
                    borderRadius: '30px',
                },
            },
            {
                name: 'textBlock',
                style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '{dimension.gap.loose}',
                    padding: '40px',
                    minWidth: '0',
                    marginTop: '-80px',
                    position: 'relative',
                    zIndex: '1',
                    borderRadius: '{dimension.borderradius.xxxl}',
                    background: '{color.basic.opacity.white.100}',
                    boxSizing: 'border-box',
                },
                slotGroups: [
                    { name: 'titleBlock', slots: ['title'] },
                    { name: 'bodyBlock', slots: ['text'] },
                ],
            },
        ],
    };
}

/**
 * commonListItem：参考 commonStyleServiceListDesc 的布局（icon + 标题/描述列），
 * 但去掉底部边框与 hover 变色样式。
 */
function createCommonListItemSlotConfig() {
    return {
        type: 'template',
        metaType: 'feedItem',
        style: {
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
        },
        itemStyles: {
            row: {
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '30px',
                padding: '16px 0',
                width: '100%',
                boxSizing: 'border-box',
            },
        },
        subSlots: {
            icon: {
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    margin: '0',
                    width: '52px',
                    height: '52px',
                    fontSize: '52px',
                    lineHeight: '52px',
                    textAlign: 'center',
                    color: '{color.primary.brand5}',
                    flexShrink: '0',
                },
            },
            title: {
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    margin: '0',
                    fontSize: '{font.size.xxl}',
                    fontWeight: '{font.fontweight.semibold}',
                    color: '{color.basic.grey.9}',
                    lineHeight: '1.35',
                    whiteSpace: 'normal',
                    overflowWrap: 'break-word',
                },
            },
            text: {
                metaType: 'text',
                variant: 'p',
                variantStyle: {
                    margin: '0',
                    fontSize: '24px',
                    color: '{color.basic.dark-blue.2}',
                    lineHeight: '1.6',
                    whiteSpace: 'normal',
                    overflowWrap: 'break-word',
                },
            },
        },
        itemLayout: [
            {
                name: 'leading',
                slots: ['icon'],
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: '0',
                    minWidth: '52px',
                    minHeight: '52px',
                },
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
                slotGroups: [
                    { name: 'textCol', slots: ['title', 'text'] },
                ],
            },
        ],
    };
}

/**
 * doubleImageItem：外框容器内两张图片并排、两端对齐。
 */
function createDoubleImageItemSlotConfig() {
    return {
        type: 'template',
        metaType: 'feedItem',
        style: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
        },
        itemStyles: {
            row: {
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                boxSizing: 'border-box',
            },
        },
        subSlots: {
            image: {
                metaType: 'image',
                variant: 'cover',
                repeat: true,
                description: '两张并排图片，按出现顺序左/右排列。',
                variantStyle: {
                    flex: '1',
                    minWidth: '0',
                    aspectRatio: '4 / 3',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    display: 'block',
                    margin: '0',
                    borderRadius: '30px',
                    borderWidth: '0',
                    boxShadow: 'none',
                },
                supportedAttributes: ['src', 'alt'],
            },
        },
        itemLayout: [
            {
                name: 'imageRow',
                slots: ['image#1', 'image#2', 'image'],
                style: {
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'stretch',
                    gap: '12px',
                    width: '100%',
                },
            },
        ],
    };
}

export default SHOWCASE_CARD_STYLE