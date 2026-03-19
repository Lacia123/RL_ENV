/**
 * historyCard 组件样式
 * 子标签仅支持：标题(title)、内容(text)、时间(timestamp)
 * 3 种卡片：大的（紫色最深）、中等（紫色第二深）、小的（浅色）
 */

const PLACEHOLDER = {
  title: '{color.basic.brand.7}',
  text: '{color.basic.opacity.black.64}',
  timestampBg: '{color.basic.opacity.white.48}',
  timestampText: '{color.basic.opacity.black.48}',
  timestampBorder: '{color.basic.opacity.white.64}',
  // 大的 - 紫色最深
  cardLarge: 'linear-gradient(180deg, {color.basic.red.1} 0%, {color.basic.violet.2} 47.91%, {color.basic.brand.5} 100%)',
  // 中等 - 紫色第二深
  cardMedium: 'linear-gradient(180deg, {color.basic.purple.0} 0%, {color.basic.brand.2} 100%)',
  // 小的 - 浅色
  cardSmall: '{color.basic.brand.0}',
};

const structure = {
  groups: [{
    name: 'header',
    type: 'template',
    style: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '8px',
    },
    groups: [{
      name: 'titleGroup',
      slots: ['title'],
      type: 'template',
      style: {
        display: 'flex',
        flex: '1',
        minWidth: 0,
        overflow: 'hidden',
      },
    }, {
      name: 'timestampSlot',
      slots: ['timestamp'],
      type: 'template',
      style: { flexShrink: '0' },
    }],
  }, {
    name: 'textSlot',
    slots: ['text'],
    type: 'template',
    style: { width: '100%' },
  }],
};

// 小卡片：内容区单行 + 超出省略
const structureSmall = {
  groups: [{
    name: 'header',
    type: 'template',
    style: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '8px',
    },
    groups: [{
      name: 'titleGroup',
      slots: ['title'],
      type: 'template',
      style: {
        display: 'flex',
        flex: '1',
        minWidth: 0,
        overflow: 'hidden',
      },
    }, {
      name: 'timestampSlot',
      slots: ['timestamp'],
      type: 'template',
      style: { flexShrink: '0' },
    }],
  }, {
    name: 'textSlot',
    slots: ['text'],
    type: 'template',
    styleReference: 'textOneLine',
    style: {
      width: '100%',
      minWidth: 0,
    },
  }],
};

const cardStyleBase = {
  display: 'flex',
  flex: '1',
  width: '100%',
  gap: '{dimension.gap.semitight}',
  flexDirection: 'column',
  padding: '24px',
  borderRadius: '{dimension.borderradius.xxxxl}',
  border: '1px solid {color.basic.opacity.white.24}',
  boxShadow: '6px -2px 20.047px 0 rgba(63, 223, 255, 0.18), -6px 6px 40px 0 rgba(63, 71, 255, 0.24)',
  overflow: 'hidden',
  backgroundRepeat: 'no-repeat',
};

const layoutModes = [
  {
    name: 'large',
    condition: 'has:cardLarge',
    style: { background: PLACEHOLDER.cardLarge, minHeight: '250px', ...cardStyleBase },
    structure,
  },
  {
    name: 'medium',
    condition: 'has:cardMedium',
    style: { background: PLACEHOLDER.cardMedium, minHeight: '250px', ...cardStyleBase },
    structure,
  },
  {
    name: 'small',
    condition: 'default',
    style: { backgroundColor: PLACEHOLDER.cardSmall, ...cardStyleBase },
    structure: structureSmall,
  },
];

const HISTORY_CARD_STYLE = {
  historyCard: {
    type: 'template',
    layoutModes,
    slotConfigs: {
      title: {
        optional: false,
        metaType: 'text',
        variantStyle: {
          margin: '0',
          fontSize: '{font.size.xl}',
          color: PLACEHOLDER.title,
          fontWeight: '900',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          minWidth: 0,
          '& p': { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 },
          '& div': { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 },
        },
      },
      text: {
        optional: true,
        metaType: 'text',
        variant: 'p',
        variantStyle: {
          margin: '0',
          fontSize: '{font.size.medium}',
          color: PLACEHOLDER.text,
          lineHeight: '1.5',
        },
      },
      // 小卡片内容区单行省略，通过 structureSmall 的 textSlot styleReference 引用
      textOneLine: {
        optional: true,
        metaType: 'text',
        variantStyle: {
          '& p': { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 },
        },
      },
      timestamp: {
        optional: true,
        metaType: 'text',
        variantStyle: {
          margin: '0',
          fontSize: '{font.size.medium}',
          color: PLACEHOLDER.timestampText,
          backgroundColor: PLACEHOLDER.timestampBg,
          padding: '2px 8px',
          borderRadius: '{dimension.borderradius.xxxxl}',
          border: `1px solid ${PLACEHOLDER.timestampBorder}`,
          flexShrink: '0',
          boxShadow: '0 10px 30.05px 0 rgba(57, 40, 214, 0.24)',
          backdropFilter: 'blur(7px)',
        },
      },
      cardLarge: {
        optional: true,
        metaType: 'text',
        variantStyle: { display: 'none' },
      },
      cardMedium: {
        optional: true,
        metaType: 'text',
        variantStyle: { display: 'none' },
      },
    },
    example: {
      title: '标题',
      text: '内容文本',
      timestamp: '12.20',
    },
  },
};

export default HISTORY_CARD_STYLE;
