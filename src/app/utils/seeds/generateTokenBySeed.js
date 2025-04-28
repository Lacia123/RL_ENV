/**
 * generateTokenBySeed.js
 * 根据种子值生成设计令牌
 */

const basicTokens = {
  dimension: {
    '0': '{dimension.basic.dimension.0}',
    '1': '{dimension.basic.dimension.1}',
    '2': '{dimension.basic.dimension.2}',
    '4': '{dimension.basic.dimension.4}',
    '6': '{dimension.basic.dimension.6}',
    '8': '{dimension.basic.dimension.8}',
    '12': '{dimension.basic.dimension.12}',
    '14': '{dimension.basic.dimension.14}',
    '16': '{dimension.basic.dimension.16}',
    '20': '{dimension.basic.dimension.20}',
    '24': '{dimension.basic.dimension.24}',
    '26': '{dimension.basic.dimension.26}',
    '28': '{dimension.basic.dimension.28}',
    '32': '{dimension.basic.dimension.32}',
    '36': '{dimension.basic.dimension.36}',
    '52': '{dimension.basic.dimension.52}',
    '200': '{dimension.basic.dimension.200}',
  },
  weight: {
    '100': '{dimension.basic.weight.100}',
    '200': '{dimension.basic.weight.200}',
    '400': '{dimension.basic.weight.400}',
    '600': '{dimension.basic.weight.600}',
  },
  float: {
    scale0: '{dimension.basic.float.scale0}',
  },
  percent: {
    '140': '{dimension.basic.percent.140}',
  },
};

const createTokenReference = (path) => ({
  value: path,
  type: 'other',
});

const mapShapeSeed = (seed) => 0.5 + (seed / 10) * 1.5;
const mapDensitySeed = (seed) => 0.75 + (seed / 10) * 0.75;
const mapFontSeed = (seed) => 0.75 + (seed / 10) * 0.5;
const mapMaterialSeed = (seed) => 0.5 + (seed / 10) * 1.5;

const getClosestToken = (targetValue, maxAllowed) => {
  const availableValues = Object.keys(basicTokens.dimension)
    .map(Number)
    .filter((val) => val <= maxAllowed)
    .sort((a, b) => a - b);

  let closest = availableValues[0];
  for (const value of availableValues) {
    if (Math.abs(value - targetValue) < Math.abs(closest - targetValue)) {
      closest = value;
    }
  }
  return createTokenReference(basicTokens.dimension[closest]);
};

const getFontWeightToken = (seed) => {
  const weights = [100, 200, 400, 600];
  const index = Math.min(Math.floor(seed / 2.5), weights.length - 1);
  return createTokenReference(basicTokens.weight[weights[index]]);
};

export const calculateShapeTokens = (shapeSeedValue) => {
  const shapeMultiplier = mapShapeSeed(shapeSeedValue);

  const borderradius = {
    none: createTokenReference(basicTokens.dimension[0]),
    xs: getClosestToken(2 * shapeMultiplier, 4),
    small: getClosestToken(4 * shapeMultiplier, 8),
    medium: getClosestToken(6 * shapeMultiplier, 12),
    large: getClosestToken(8 * shapeMultiplier, 16),
    xl: getClosestToken(12 * shapeMultiplier, 20),
    xxl: getClosestToken(16 * shapeMultiplier, 24),
    xxxl: getClosestToken(20 * shapeMultiplier, 28),
    xxxxl: getClosestToken(24 * shapeMultiplier, 32),
    full: createTokenReference(basicTokens.dimension[200]),
  };

  const borderwidth = {
    none: createTokenReference(basicTokens.dimension[0]),
    narrow: getClosestToken(1 * shapeMultiplier, 2),
    base: getClosestToken(2 * shapeMultiplier, 4),
    wide: getClosestToken(4 * shapeMultiplier, 6),
  };

  return {
    borderradius,
    borderwidth,
  };
};

export const calculateDensityTokens = (densitySeedValue) => {
  const densityMultiplier = mapDensitySeed(densitySeedValue);

  const spacing = {
    none: createTokenReference(basicTokens.dimension[0]),
    supertight: getClosestToken(2 * densityMultiplier, 4),
    extratight: getClosestToken(4 * densityMultiplier, 6),
    tight: getClosestToken(6 * densityMultiplier, 8),
    semitight: getClosestToken(8 * densityMultiplier, 12),
    base: getClosestToken(12 * densityMultiplier, 16),
    semiloose: getClosestToken(16 * densityMultiplier, 20),
    loose: getClosestToken(20 * densityMultiplier, 24),
    extraloose: getClosestToken(24 * densityMultiplier, 28),
    superloose: getClosestToken(32 * densityMultiplier, 32),
  };

  return {
    gap: { ...spacing },
    margin: { ...spacing },
    padding: { ...spacing },
  };
};

export const calculateFontTokens = (fontSeedValue) => {
  const fontMultiplier = mapFontSeed(fontSeedValue);

  const font = {
    weight: {
      light: getFontWeightToken(Math.max(0, fontSeedValue - 2)),
      medium: getFontWeightToken(Math.max(2, fontSeedValue)),
      semibold: getFontWeightToken(Math.min(8, fontSeedValue + 2)),
      bold: getFontWeightToken(10),
    },
    letterSpacing: {
      tight: createTokenReference(`-${0.05 * fontMultiplier}em`),
      base: createTokenReference('0em'),
      loose: createTokenReference(`${0.05 * fontMultiplier}em`),
      wide: createTokenReference(`${0.1 * fontMultiplier}em`),
    },
    lineHeight: {
      tight: createTokenReference(`${120 + fontSeedValue * 2}%`),
      base: createTokenReference(`${140 + fontSeedValue * 2}%`),
      loose: createTokenReference(`${160 + fontSeedValue * 2}%`),
      wide: createTokenReference(`${180 + fontSeedValue * 2}%`),
    },
    size: {
      tiny: getClosestToken(12 * fontMultiplier, 14),
      small: getClosestToken(14 * fontMultiplier, 16),
      medium: getClosestToken(16 * fontMultiplier, 20),
      large: getClosestToken(20 * fontMultiplier, 26),
      xl: getClosestToken(26 * fontMultiplier, 36),
      xxl: getClosestToken(36 * fontMultiplier, 52),
    },
  };

  return {
    font,
  };
};

export const calculateMaterialTokens = (seedValue) => {
  const multiplier = mapMaterialSeed(seedValue);

  const getBlurToken = (baseSize) => {
    const targetBlur = Math.round(baseSize * multiplier);
    const availableValues = [8, 12, 16, 20, 24, 32];
    let closest = availableValues[0];
    for (const value of availableValues) {
      if (Math.abs(value - targetBlur) < Math.abs(closest - targetBlur)) {
        closest = value;
      }
    }
    return basicTokens.dimension[closest];
  };

  return {
    material: {
      B1: {
        value: {
          x: '0px',
          y: '1px',
          blur: getBlurToken(8),
          spread: '0px',
          alpha: 0.11,
        },
        type: 'innerShadow',
      },
      B2: {
        value: {
          x: '0px',
          y: '2px',
          blur: getBlurToken(12),
          spread: '0px',
          alpha: 0.12,
        },
        type: 'innerShadow',
      },
      B3: {
        value: {
          x: '0px',
          y: '4px',
          blur: getBlurToken(16),
          spread: '0px',
          alpha: 0.13,
        },
        type: 'innerShadow',
      },
      ground: {
        value: {
          x: '0px',
          y: '0px',
          blur: getBlurToken(4),
          spread: '0px',
          alpha: 0.02,
        },
        type: 'dropShadow',
      },
      main: {
        value: {
          x: '0px',
          y: '1px',
          blur: getBlurToken(8),
          spread: '0px',
          alpha: 0.04,
        },
        type: 'dropShadow',
      },
      '1f': {
        value: {
          x: '0px',
          y: '4px',
          blur: getBlurToken(12),
          spread: '0px',
          alpha: 0.16,
        },
        type: 'dropShadow',
      },
      '2f': {
        value: {
          x: '0px',
          y: '6px',
          blur: getBlurToken(16),
          spread: '0px',
          alpha: 0.17,
        },
        type: 'dropShadow',
      },
      '3f': {
        value: {
          x: '0px',
          y: '8px',
          blur: getBlurToken(20),
          spread: '0px',
          alpha: 0.18,
        },
        type: 'dropShadow',
      },
      '4f': {
        value: {
          x: '0px',
          y: '12px',
          blur: getBlurToken(24),
          spread: '0px',
          alpha: 0.19,
        },
        type: 'dropShadow',
      },
      '5f': {
        value: {
          x: '0px',
          y: '16px',
          blur: getBlurToken(32),
          spread: '0px',
          alpha: 0.2,
        },
        type: 'dropShadow',
      },
    },
  };
};

export const calculateShadow = (x, y, blur, spread, alpha) => {
  const xToken = getClosestToken(x, x);
  const yToken = getClosestToken(y, y);
  const blurToken = getClosestToken(blur, blur);
  const spreadToken = getClosestToken(spread, spread);

  return {
    value: `${xToken.value} ${yToken.value} ${blurToken.value} ${spreadToken.value} rgba(31, 31, 42, ${alpha})`,
    type: 'shadow',
  };
};

// 将嵌套对象转换为扁平化对象
export const convertToFlatObject = (nested) => {
  const flat = {};

  function recurse(current, path = []) {
    if (current && typeof current === 'object' && !('value' in current)) {
      // 递归深入对象
      for (const key in current) {
        recurse(current[key], [...path, key]);
      }
    } else {
      // 到达叶子节点，构造键值对
      flat[JSON.stringify(path)] = current.value;
    }
  }

  recurse(nested);
  return flat;
};

export const reverseToken = (tokenObj) => {
  return Object.entries(tokenObj).map(([key, value]) => {
    const keys = JSON.parse(key);
    keys.push(value);
    return JSON.stringify(keys);
  });
};

export const processToken = (tokens) => {
  return tokens.reduce((acc, cur) => {
    const keys = JSON.parse(cur);
    const value = keys.pop();
    acc[JSON.stringify(keys)] = value;
    return acc;
  }, {});
};

//将扁平化对象转换为嵌套对象
export const convertToNestedObject = (flat) => {
  const nested = {};

  for (const flatKey in flat) {
    const keys = JSON.parse(flatKey); // 将键解析为数组
    let currentLevel = nested;

    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        // 最后一层，赋值
        currentLevel[key] = {
          value: flat[flatKey],
          type: 'other',
        };
      } else {
        // 不是最后一层，继续深入
        if (!currentLevel[key]) currentLevel[key] = {};
        currentLevel = currentLevel[key];
      }
    });
  }

  return nested;
};

// 色彩转换和调整工具函数
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

const hexToHSL = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
};

const HSLToHex = (h, s, l) => {
  h = h % 360;
  s = clamp(s, 0, 100);
  l = clamp(l, 0, 100);

  s /= 100;
  l /= 100;

  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
};

// 使用非线性映射函数来生成亮度值
const getLightness = (index, baseL) => {
  // 使用 sigmoid 函数进行非线性映射
  const sigmoid = (x) => 1 / (1 + Math.exp(-x));

  // 将 index 映射到合适的范围
  const x = (index - 5) * 0.8;
  const normalizedL = sigmoid(x);

  // 根据基准亮度调整范围
  const minL = 15; // 避免完全黑
  const maxL = 98; // 避免完全白
  const range = maxL - minL;

  // 反转亮度值并应用范围
  const adjustedL = maxL - normalizedL * range;
  return clamp(adjustedL, minL, maxL);
};

// 调整颜色协调度的函数
const adjustColorHarmony = (targetHue, seedHSL) => {
  const hueDiff = Math.abs(((targetHue - seedHSL.h + 180) % 360) - 180);

  // 计算饱和度调整系数
  const saturationAdjust = 0.7 + Math.cos((hueDiff * Math.PI) / 180) * 0.3;

  // 基于色相差异的饱和度调整
  const newS = seedHSL.s * saturationAdjust;

  return {
    h: targetHue,
    s: clamp(newS, 30, 95), // 限制饱和度范围
    l: seedHSL.l,
  };
};

// 生成色阶的函数
const generateColorScale = (baseHSL) => {
  const scale = {};

  for (let i = 0; i < 10; i++) {
    // 使用非线性函数计算亮度
    const l = getLightness(i, baseHSL.l);

    // 根据亮度调整饱和度
    const s = baseHSL.s * (1 - (Math.abs(l - 50) / 100) * 0.3);

    scale[i] = {
      value: HSLToHex(baseHSL.h, s, l),
      type: 'color',
    };
  }

  return scale;
};

// 生成透明色
const generateOpacityColors = (color, opacityValues) => {
  const result = {};
  Object.entries(opacityValues).forEach(([key, opacity]) => {
    const alpha = Math.round(opacity * 255)
      .toString(16)
      .padStart(2, '0');
    result[key] = {
      value: `${color}${alpha}`,
      type: 'color',
    };
  });
  return result;
};

// 根据seed color生成完整调色板
export const calculateColorTokens = (seed) => {
  const seedHSL = hexToHSL(seed);

  const colorConfig = {
    brand: seedHSL.h,
    red: 0,
    blue: 210,
    cyan: 180,
    grey: seedHSL.h,
    lime: 90,
    pink: 340,
    teal: 195,
    amber: 45,
    green: 120,
    indigo: 230,
    orange: 30,
    purple: 300,
    violet: 270,
    yellow: 60,
    'light-blue': 195,
    'light-green': 105,
    'dark-blue': 220,
  };

  const result = {
    color: {
      basic: {},
    },
  };

  // 生成主要颜色
  Object.entries(colorConfig).forEach(([name, hue]) => {
    let colorHSL;

    if (name === 'grey') {
      colorHSL = { h: seedHSL.h, s: seedHSL.s * 0.08, l: seedHSL.l };
    } else if (name === 'brand') {
      colorHSL = seedHSL;
    } else {
      colorHSL = adjustColorHarmony(hue, seedHSL);
    }

    result.color.basic[name] = generateColorScale(colorHSL);
  });

  // 添加透明度颜色
  const opacityValues = {
    '4': 0.04,
    '7': 0.07,
    '12': 0.12,
    '16': 0.16,
    '20': 0.2,
    '24': 0.24,
    '32': 0.32,
    '48': 0.48,
    '64': 0.64,
    '76': 0.76,
    '88': 0.88,
    '100': 1,
  };

  result.color.basic['opacity'] = {
    black: generateOpacityColors('#000000', opacityValues),
    white: generateOpacityColors('#FFFFFF', opacityValues),
  };

  return result;
};

export const calculateTokens = (seed) => {
  const dimensionTokens = {};
  const fontTokens = {};

  if (seed.shape !== undefined) {
    Object.assign(dimensionTokens, calculateShapeTokens(seed.shape));
  }
  if (seed.degree !== undefined) {
    Object.assign(dimensionTokens, calculateDensityTokens(seed.degree));
  }
  if (seed.font !== undefined) {
    Object.assign(fontTokens, calculateFontTokens(seed.font));
  }
  if (seed.material !== undefined) {
    Object.assign(dimensionTokens, calculateMaterialTokens(seed.material));
  }

  const tokens = {};

  if (Object.keys(dimensionTokens).length > 0) {
    tokens.dimension = dimensionTokens;
  }

  if (Object.keys(fontTokens).length > 0) {
    tokens.font = { ...fontTokens.font };
  }

  if (seed.color) {
    Object.assign(tokens, calculateColorTokens(seed.color));
  }

  return tokens;
};
  