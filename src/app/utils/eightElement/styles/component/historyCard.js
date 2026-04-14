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

// 右缘：中间高、两侧低、全程弧线；高斯×sin 收窄鼓包
function historyCardBellPathD(peakX, h = 100, steps = 56, sigmaRatio = 0.2) {
  const cy = h / 2;
  const sigma = h * sigmaRatio;
  const parts = [`M 0 0 L 0 ${h}`];
  for (let i = 0; i <= steps; i += 1) {
    const y = h * (1 - i / steps);
    const gauss = Math.exp(-Math.pow((y - cy) / sigma, 2));
    const w = Math.sin((Math.PI * y) / h);
    const x = peakX * gauss * w;
    parts.push(`L ${x.toFixed(3)} ${y.toFixed(3)}`);
  }
  parts.push('Z');
  return parts.join(' ');
}

// 仅形状的白填充 SVG → mask；颜色用伪元素 background:inherit 跟卡片同一套 token 渐变（content:url(彩色svg) 无法被外层 CSS 染色）
function historyCardBulgeMaskUrl(peakX = 46) {
  const vbW = peakX + 6;
  const pathD = historyCardBellPathD(peakX);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vbW} 100" preserveAspectRatio="none"><path d="${pathD}" fill="#fff"/></svg>`;
  return `url('data:image/svg+xml,${encodeURIComponent(svg)}')`;
}

const HISTORY_CARD_BULGE_MASK = historyCardBulgeMaskUrl(46);

const historyCardLargeMediumHoverBulge = {
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    overflow: 'visible',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    right: '-18px',
    top: '0',
    bottom: '0',
    width: '24px',
    height: '100%',
    background: 'inherit',
    WebkitMaskImage: HISTORY_CARD_BULGE_MASK,
    maskImage: HISTORY_CARD_BULGE_MASK,
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskSize: '100% 100%',
    maskSize: '100% 100%',
    WebkitMaskPosition: 'left center',
    maskPosition: 'left center',
    pointerEvents: 'none',
    opacity: '0',
    transition: 'opacity 0.32s ease',
  },
  '&:hover::before': {
    opacity: '1',
  },
};

const layoutModes = [
  {
    name: 'large',
    condition: 'has:cardLarge',
    style: {
      background: PLACEHOLDER.cardLarge,
      minHeight: '250px',
      ...cardStyleBase,
      ...historyCardLargeMediumHoverBulge,
    },
    structure,
  },
  {
    name: 'medium',
    condition: 'has:cardMedium',
    style: {
      background: PLACEHOLDER.cardMedium,
      minHeight: '250px',
      ...cardStyleBase,
      ...historyCardLargeMediumHoverBulge,
    },
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
