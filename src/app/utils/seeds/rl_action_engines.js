/**
 * 
 * 🎯 总共包含 45 个动作，分为以下类别：
 * 
 * ⚠️ 调控失效的样式属性（需要在 styleConfig.js 中补充）：
 * 
 * 📋 Form Actions 相关：
 *   - clipPath: 当前样式系统中完全没有设置，影响 increaseComplexity, decreaseComplexity, makeExtremeRounded
 *   - transform: 部分元素没有设置，影响 increaseVisualWeight, decreaseVisualWeight, responsiveScale
 * 
 * 📋 Material Actions 相关：
 *   - backgroundImage: 大部分元素没有设置，影响 increaseTexture, decreaseTexture  
 *   - backgroundSize: 没有设置，影响纹理动作
 *   - backdropFilter: 完全没有设置，影响 increaseTransparency, decreaseTransparency
 *   - opacity: 某些元素没有设置，影响透明度动作
 * 
 * 📋 Composition Actions 相关：
 *   - display: 某些布局没有设置为 grid，影响 enhanceGridAlignment, structureLayout
 *   - gridTemplateColumns/Areas: 只在特定布局中设置，影响网格相关动作
 *   - flexDirection/flexWrap: 某些元素没有设置，影响 flexibleLayout
 * 
 * 📋 Animation Actions 相关：
 *   - transition: 部分元素没有设置，影响 addMicroInteractions
 *   - &:hover 伪类: 某些元素没有设置，影响悬停效果
 * 
 * 📋 Accessibility Actions 相关：
 *   - &:focus 伪类: 大部分元素没有设置，影响 enhanceAccessibility
 *   - outline/outlineOffset: 没有设置，影响焦点可见性
 * 
 * 🎯 总共包含 45 个动作，分为以下类别：
 * 
 * 📐 形态动作 (Form Actions) - 8个
 *   ├── 圆润度调节: increaseRoundness, decreaseRoundness
 *   ├── 复杂度调节: increaseComplexity, decreaseComplexity  
 *   ├── 轮廓调节: strengthenOutline, weakenOutline
 *   └── 极致调节: makeExtremeRounded, makeAngular
 * 
 * 🎨 色彩动作 (Color Actions) - 4个
 *   ├── 品牌色调节: increaseBrandColor, decreaseBrandColor
 *   └── 明暗调节: brightenTheme, darkenTheme
 * 
 * 📝 字体动作 (Typography Actions) - 7个
 *   ├── 密度调节: increaseInfoDensity, decreaseInfoDensity
 *   ├── 强度调节: enhanceVisualStrength, softenVisualStrength
 *   └── 对齐调节: centerAlignment, leftAlignment, rightAlignment
 * 
 * 🎭 质感动作 (Material Actions) - 6个
 *   ├── 阴影调节: increaseShadowDepth, decreaseShadowDepth
 *   ├── 纹理调节: increaseTexture, decreaseTexture
 *   └── 透明调节: increaseTransparency, decreaseTransparency
 * 
 * 📏 比例动作 (Proportion Actions) - 6个
 *   ├── 空间调节: increaseSpacing, decreaseSpacing
 *   ├── 张力调节: increaseEdgeTension, decreaseEdgeTension
 *   └── 重量调节: increaseVisualWeight, decreaseVisualWeight
 * 
 * 🏗️ 构图动作 (Composition Actions) - 4个
 *   ├── 对齐调节: enhanceGridAlignment, relaxGridAlignment
 *   └── 布局调节: structureLayout, flexibleLayout
 * 
 * 🚦 状态动作 (State Actions) - 5个
 *   └── 状态指示: applySuccessState, applyErrorState, applyWarningState, 
 *                applyDisableState, applyInfoState
 * 
 * 🤖 智能动作 (Adaptive Actions) - 2个
 *   └── 自适应: adaptToContext, responsiveScale
 * 
 * 🎬 动画动作 (Animation Actions) - 2个
 *   └── 微动效: addMicroInteractions, removeAnimations
 * 
 * ♿ 可访问性动作 (Accessibility Actions) - 1个
 *   └── 无障碍: enhanceAccessibility
 */

/**
 * Code 存在问题，不能根据 token 调节
 */


/**
 * 完整的Design Token映射表
 * 基于用户提供的完整token结构，将强化学习动作映射到具体的design token
 */
export const DESIGN_TOKEN_MAPPING = {
  // 字体系统映射
  font: {
    size: {
      tiny: "{font.size.tiny}",
      small: "{font.size.small}",
      medium: "{font.size.medium}",
      large: "{font.size.large}",
      xl: "{font.size.xl}",
      xxl: "{font.size.xxl}",
      xxxl: "{font.size.xxxl}",
      // 推断可能存在的更大尺寸
      xxxxl: "{font.size.xxxxl}",
      super: "{font.size.super}"
    },
    weight: {
      light: "{font.fontweight.light}",     // 100
      medium: "{font.fontweight.medium}",   // 200
      semibold: "{font.fontweight.semibold}", // 400
      bold: "{font.fontweight.bold}"        // 600
    },
    lineHeight: {
      base: "{font.lineheight.base}",
      tight: "{font.lineheight.tight}",
      loose: "{font.lineheight.loose}"
    },
    letterSpacing: {
      base: "{font.letterspacing.base}",
      tight: "{font.letterspacing.tight}",
      loose: "{font.letterspacing.loose}"
    }
  },
  
  // 尺寸系统映射
  dimension: {
    padding: {
      none: "{dimension.padding.none}",
      supertight: "{dimension.padding.supertight}",
      extratight: "{dimension.padding.extratight}",
      tight: "{dimension.padding.tight}",
      semitight: "{dimension.padding.semitight}",
      base: "{dimension.padding.base}",
      semiloose: "{dimension.padding.semiloose}",
      loose: "{dimension.padding.loose}",
      extraloose: "{dimension.padding.extraloose}",
      superloose: "{dimension.padding.superloose}"
    },
    margin: {
      none: "{dimension.margin.none}",
      supertight: "{dimension.margin.supertight}",
      extratight: "{dimension.margin.extratight}",
      tight: "{dimension.margin.tight}",
      semitight: "{dimension.margin.semitight}",
      base: "{dimension.margin.base}",
      semiloose: "{dimension.margin.semiloose}",
      loose: "{dimension.margin.loose}",
      extraloose: "{dimension.margin.extraloose}",
      superloose: "{dimension.margin.superloose}"
    },
    gap: {
      none: "{dimension.gap.none}",
      supertight: "{dimension.gap.supertight}",
      extratight: "{dimension.gap.extratight}",
      tight: "{dimension.gap.tight}",
      semitight: "{dimension.gap.semitight}",
      base: "{dimension.gap.base}",
      semiloose: "{dimension.gap.semiloose}",
      loose: "{dimension.gap.loose}",
      extraloose: "{dimension.gap.extraloose}",
      superloose: "{dimension.gap.superloose}"
    },
    borderRadius: {
      none: "{dimension.borderradius.none}",
      xs: "{dimension.borderradius.xs}",
      small: "{dimension.borderradius.small}",
      medium: "{dimension.borderradius.medium}",
      large: "{dimension.borderradius.large}",
      xl: "{dimension.borderradius.xl}",
      xxl: "{dimension.borderradius.xxl}",
      xxxl: "{dimension.borderradius.xxxl}",
      xxxxl: "{dimension.borderradius.xxxxl}",  // 新增
      full: "{dimension.borderradius.full}"     // 新增 - 完全圆形
    },
    borderWidth: {
      none: "{dimension.borderwidth.none}",
      narrow: "{dimension.borderwidth.narrow}",
      base: "{dimension.borderwidth.base}",
      wide: "{dimension.borderwidth.wide}"
    }
  },
  
  // 完整的颜色系统映射
  color: {
    // 主色调系统
    primary: {
      brand3: "{color.primary.brand3}",
      brand4: "{color.primary.brand4}",
      brand5: "{color.primary.brand5}",
      brand6: "{color.primary.brand6}"
    },
    primaryContainer: {
      brand0: "{color.primarycontainer.brand0}",
      brand1: "{color.primarycontainer.brand1}",
      brand2: "{color.primarycontainer.brand2}"
    },
    onPrimary: {
      black76: "{color.onprimary.black76}",
      black88: "{color.onprimary.black88}",
      black100: "{color.onprimary.black100}",
      white76: "{color.onprimary.white76}",
      white88: "{color.onprimary.white88}",
      white100: "{color.onprimary.white100}"
    },
    onPrimaryContainer: {
      brand7: "{color.onprimarycontainer.brand7}",
      brand8: "{color.onprimarycontainer.brand8}",
      brand9: "{color.onprimarycontainer.brand9}"
    },
    
    // 次色调系统
    secondary: {
      violet3: "{color.secondary.violet3}",
      violet4: "{color.secondary.violet4}",
      violet5: "{color.secondary.violet5}",
      violet6: "{color.secondary.violet6}"
    },
    secondaryContainer: {
      violet0: "{color.secondarycontainer.violet0}",
      violet1: "{color.secondarycontainer.violet1}",
      violet2: "{color.secondarycontainer.violet2}"
    },
    onSecondary: {
      black76: "{color.onsecondary.black76}",
      black88: "{color.onsecondary.black88}",
      black100: "{color.onsecondary.black100}",
      white76: "{color.onsecondary.white76}",
      white88: "{color.onsecondary.white88}",
      white100: "{color.onsecondary.white100}"
    },
    onSecondaryContainer: {
      violet7: "{color.onsecondarycontainer.violet7}",
      violet8: "{color.onsecondarycontainer.violet8}",
      violet9: "{color.onsecondarycontainer.violet9}"
    },
    
    // 表面颜色系统（推断）
    surface: {
      grey0: "{color.surface.grey0}",
      grey1: "{color.surface.grey1}",
      grey2: "{color.surface.grey2}"
    },
    onSurface: {
      black48: "{color.onsurface.black48}",
      black64: "{color.onsurface.black64}",
      black76: "{color.onsurface.black76}",
      black88: "{color.onsurface.black88}",
      black100: "{color.onsurface.black100}",
      white48: "{color.onsurface.white48}",
      white64: "{color.onsurface.white64}",
      white76: "{color.onsurface.white76}",
      white88: "{color.onsurface.white88}",
      white100: "{color.onsurface.white100}"
    },
    
    // 语义化状态颜色系统
    success: {
      green0: "{color.success.green0}",
      green1: "{color.success.green1}",
      green2: "{color.success.green2}",
      green3: "{color.success.green3}",
      green4: "{color.success.green4}",
      green5: "{color.success.green5}",
      green6: "{color.success.green6}",
      green7: "{color.success.green7}",
      green8: "{color.success.green8}",
      green9: "{color.success.green9}"
    },
    error: {
      red0: "{color.error.red0}",
      red1: "{color.error.red1}",
      red2: "{color.error.red2}",
      red3: "{color.error.red3}",
      red4: "{color.error.red4}",
      red5: "{color.error.red5}",
      red6: "{color.error.red6}",
      red7: "{color.error.red7}",
      red8: "{color.error.red8}",
      red9: "{color.error.red9}"
    },
    warning: {
      orange0: "{color.warning.orange0}",
      orange1: "{color.warning.orange1}",
      orange2: "{color.warning.orange2}",
      orange3: "{color.warning.orange3}",
      orange4: "{color.warning.orange4}",
      orange5: "{color.warning.orange5}",
      orange6: "{color.warning.orange6}",
      orange7: "{color.warning.orange7}",
      orange8: "{color.warning.orange8}",
      orange9: "{color.warning.orange9}"
    },
    disable: {
      grey0: "{color.disable.grey0}",
      grey1: "{color.disable.grey1}",
      grey2: "{color.disable.grey2}",
      grey3: "{color.disable.grey3}",
      grey4: "{color.disable.grey4}",
      grey5: "{color.disable.grey5}",
      grey6: "{color.disable.grey6}",
      grey7: "{color.disable.grey7}",
      grey8: "{color.disable.grey8}",
      grey9: "{color.disable.grey9}"
    },
    // 推断可能存在的info状态
    info: {
      blue0: "{color.info.blue0}",
      blue1: "{color.info.blue1}",
      blue3: "{color.info.blue3}",
      blue5: "{color.info.blue5}",
      blue7: "{color.info.blue7}",
      blue9: "{color.info.blue9}"
    }
  },
  
  // 材质层次映射
  material: {
    hierarchy: {
      ground: "{material.hierarchy.ground}",
      main: "{material.hierarchy.main}",
      B1: "{material.hierarchy.B1}",
      B2: "{material.hierarchy.B2}",
      B3: "{material.hierarchy.B3}",
      "1f": "{material.hierarchy.1f}",
      "2f": "{material.hierarchy.2f}",
      "3f": "{material.hierarchy.3f}",
      "4f": "{material.hierarchy.4f}",
      "5f": "{material.hierarchy.5f}"
    }
  }
};

/**
 * 动作强度映射
 * 定义每个动作的强度等级和对应的数值变化
 */
export const ACTION_INTENSITY_MAP = {
  // 微调 (0.1-0.3范围)
  subtle: { min: 0.1, max: 0.3, step: 0.05 },
  // 中等调整 (0.3-0.7范围) 
  moderate: { min: 0.3, max: 0.7, step: 0.1 },
  // 强烈调整 (0.7-1.0范围)
  strong: { min: 0.7, max: 1.0, step: 0.1 }
};

/**
 * 解析基准值，提取级别名称
 * @param {string} baseValue - 基准值（可能是token引用）
 * @param {string} tokenType - token类型（如 'borderradius', 'size', 'padding'）
 * @param {string} defaultLevel - 默认级别名称
 * @returns {string} 解析出的级别名称
 */
export function parseBaseValueLevel(baseValue, tokenType, defaultLevel) {
  // 如果基准值未定义，直接返回默认值
  if (baseValue === undefined || baseValue === null || baseValue === '') {
    return defaultLevel;
  }
  
  if (typeof baseValue === 'string') {
    // 尝试匹配 token 引用格式 {dimension.borderradius.small}
    const tokenMatch = baseValue.match(new RegExp(`${tokenType}\\.(\\w+)`));
    if (tokenMatch) {
      return tokenMatch[1];
    }
    
    // 如果是直接的级别名称（如 'small', 'medium'），直接返回
    return baseValue;
  }
  
  return defaultLevel;
}

/**
 * 根据基准值和强度计算新的级别索引
 * @param {string} baseValue - 基准值
 * @param {number} delta - 强度值
 * @param {Array} levels - 级别数组
 * @param {string} tokenType - token类型
 * @param {string} defaultLevel - 默认级别
 * @param {boolean} isIncrease - 是否增加（true）还是减少（false）
 * @returns {string} 新的token引用
 */
export function calculateLevelChange(baseValue, delta, levels, tokenType, defaultLevel, isIncrease = true) {
  const baseLevelName = parseBaseValueLevel(baseValue, tokenType, defaultLevel);
  let baseIndex = levels.indexOf(baseLevelName);
  
  // 如果找不到基准级别，使用默认级别
  if (baseIndex === -1) {
    const defaultIndex = levels.indexOf(defaultLevel);
    baseIndex = defaultIndex !== -1 ? defaultIndex : Math.floor(levels.length / 2); // 如果默认级别也找不到，使用中间值
  }
  
  const offset = Math.ceil(delta * 4); // 最大可以变化4个级别
  const newIndex = isIncrease 
    ? Math.min(levels.length - 1, baseIndex + offset)
    : Math.max(0, baseIndex - offset);
  
  return levels[newIndex];
}

/**
 * 强化学习动作定义
 * 每个动作包含：动作名称、影响的属性、变化方向、强度
 */
export const RL_ACTIONS = {
  // ==================== 形态动作 (Form Actions) ====================
  
  // 1. 增加圆润度
  increaseRoundness: {
    category: 'form',
    name: '增加圆润度',
    intensity: 'moderate',
    effects: {
      borderRadius: 'increase',
      clipPath: 'soften'
    },
    styleMapping: {
      borderRadius: (baseValue, delta) => {
        const levels = ['none', 'xs', 'small', 'medium', 'large', 'xl', 'xxl', 'xxxl', 'xxxxl'];
        try {
          const newLevel = calculateLevelChange(baseValue, delta, levels, 'borderradius', 'small', true);
          return DESIGN_TOKEN_MAPPING.dimension.borderRadius[newLevel];
        } catch (error) {
          console.error('borderRadius映射错误:', error.message, '基准值:', baseValue, '强度:', delta);
          return DESIGN_TOKEN_MAPPING.dimension.borderRadius.small; // 回退到默认值
        }
      }
    },
    conflicts: ['decreaseRoundness']
  },
  
  // 2. 减少圆润度
  decreaseRoundness: {
    category: 'form',
    name: '减少圆润度',
    intensity: 'moderate',
    effects: {
      borderRadius: 'decrease',
      clipPath: 'sharpen'
    },
    styleMapping: {
      borderRadius: (baseValue, delta) => {
        const levels = ['none', 'xs', 'small', 'medium', 'large', 'xl', 'xxl', 'xxxl', 'xxxxl'];
        const newLevel = calculateLevelChange(baseValue, delta, levels, 'borderradius', 'small', false);
        return DESIGN_TOKEN_MAPPING.dimension.borderRadius[newLevel];
      }
    },
    conflicts: ['increaseRoundness']
  },
  
  // 3. 增加形态复杂度
  increaseComplexity: {
    category: 'form',
    name: '增加形态复杂度',
    intensity: 'strong',
    effects: {
      clipPath: 'complex',
      borderStyle: 'decorative'
    },
    styleMapping: {
      clipPath: (current, delta) => {
        if (delta < 0.3) return 'none';
        if (delta < 0.6) return 'circle(50% at 50% 50%)';
        return 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';
      }
    },
    conflicts: ['decreaseComplexity']
  },
  
  // 4. 减少形态复杂度
  decreaseComplexity: {
    category: 'form',
    name: '减少形态复杂度',
    intensity: 'moderate',
    effects: {
      clipPath: 'simple',
      borderStyle: 'minimal'
    },
    styleMapping: {
      clipPath: () => 'none'
    },
    conflicts: ['increaseComplexity']
  },
  
  // 5. 增强轮廓强度
  strengthenOutline: {
    category: 'form',
    name: '增强轮廓强度',
    intensity: 'moderate',
    effects: {
      borderWidth: 'increase',
      borderColor: 'enhance'
    },
    styleMapping: {
      borderWidth: (baseValue, delta) => {
        const levels = ['none', 'narrow', 'base', 'wide'];
        const newLevel = calculateLevelChange(baseValue, delta, levels, 'borderwidth', 'narrow', true);
        return DESIGN_TOKEN_MAPPING.dimension.borderWidth[newLevel];
      }
    },
    conflicts: ['weakenOutline']
  },
  
  // 6. 减弱轮廓强度
  weakenOutline: {
    category: 'form',
    name: '减弱轮廓强度',
    intensity: 'moderate',
    effects: {
      borderWidth: 'decrease',
      borderColor: 'soften'
    },
    styleMapping: {
      borderWidth: (baseValue, delta) => {
        const levels = ['none', 'narrow', 'base', 'wide'];
        const newLevel = calculateLevelChange(baseValue, delta, levels, 'borderwidth', 'narrow', false);
        return DESIGN_TOKEN_MAPPING.dimension.borderWidth[newLevel];
      }
    },
    conflicts: ['strengthenOutline']
  },

  // ==================== 色彩动作 (Color Actions) ====================
  
  // 7. 增加品牌色使用
  increaseBrandColor: {
    category: 'color',
    name: '增加品牌色使用',
    intensity: 'moderate',
    effects: {
      brandColorRatio: 'increase',
      primaryColor: 'enhance'
    },
    styleMapping: {
      color: (current, delta, elementType, variant) => {
        // 检查是否为标题类型（text元素的h1-h6变体）
        if (elementType === 'text' && variant && ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(variant) && delta > 0.3) {
          return DESIGN_TOKEN_MAPPING.color.primary.brand5;
        }
        // button 的 backgroundColor 也必须发生变化，否则对比度又问题
        if (elementType === 'button' && delta > 0.2) {
          return DESIGN_TOKEN_MAPPING.color.primary.brand4;
        }
        return current;
      },
      backgroundColor: (current, delta, elementType, variant) => {
        // 根布局容器应用品牌色背景
        if (elementType === 'layout' && variant === 'root' && delta > 0.5) {
          return DESIGN_TOKEN_MAPPING.color.primary.brand3;
        }
        // 按钮元素应用品牌色背景
        if (elementType === 'button' && delta > 0.3) {
          return DESIGN_TOKEN_MAPPING.color.primary.brand4;
        }
        return current;
      }
    },
    conflicts: ['decreaseBrandColor']
  },
  
  // 8. 减少品牌色使用
  decreaseBrandColor: {
    category: 'color',
    name: '减少品牌色使用',
    intensity: 'moderate',
    effects: {
      brandColorRatio: 'decrease',
      primaryColor: 'neutralize'
    },
    styleMapping: {
      color: (current, delta) => {
        if (delta > 0.3) return DESIGN_TOKEN_MAPPING.color.onSurface.black76;
        return current;
      },
      backgroundColor: (current, delta) => {
        if (delta > 0.3) return DESIGN_TOKEN_MAPPING.color.surface.grey1;
        return current;
      }
    },
    conflicts: ['increaseBrandColor']
  },
  
  // 9. 调亮主题
  brightenTheme: {
    category: 'color', 
    name: '调亮主题',
    intensity: 'moderate',
    effects: {
      brightness: 'increase',
      contrast: 'soften'
    },
    styleMapping: {
      backgroundColor: (current, delta) => {
        if (delta > 0.4) return DESIGN_TOKEN_MAPPING.color.surface.grey0;
        return DESIGN_TOKEN_MAPPING.color.surface.grey1;
      },
      color: (current, delta) => {
        if (delta > 0.3) return DESIGN_TOKEN_MAPPING.color.onSurface.black64;
        return DESIGN_TOKEN_MAPPING.color.onSurface.black76;
      }
    },
    conflicts: ['darkenTheme']
  },
  
  // 10. 调暗主题
  darkenTheme: {
    category: 'color',
    name: '调暗主题',
    intensity: 'moderate', 
    effects: {
      brightness: 'decrease',
      contrast: 'enhance'
    },
    styleMapping: {
      backgroundColor: (current, delta) => {
        if (delta > 0.4) return DESIGN_TOKEN_MAPPING.color.surface.grey2;
        return DESIGN_TOKEN_MAPPING.color.surface.grey1;
      },
      color: (current, delta) => {
        if (delta > 0.3) return DESIGN_TOKEN_MAPPING.color.onSurface.black100;
        return DESIGN_TOKEN_MAPPING.color.onSurface.black88;
      }
    },
    conflicts: ['brightenTheme']
  },

  // ==================== 字体动作 (Typography Actions) ====================
  
  // 11. 增加信息密度
  increaseInfoDensity: {
    category: 'typography',
    name: '增加信息密度',
    intensity: 'moderate',
    effects: {
      fontSize: 'decrease',
      lineHeight: 'tighten',
      padding: 'reduce'
    },
    styleMapping: {
      fontSize: (baseValue, delta) => {
        const levels = ['tiny', 'small', 'medium', 'large', 'xl', 'xxl', 'xxxl'];
        const newLevel = calculateLevelChange(baseValue, delta, levels, 'size', 'medium', false);
        return DESIGN_TOKEN_MAPPING.font.size[newLevel];
      },
      padding: (baseValue, delta) => {
        const levels = ['none', 'supertight', 'extratight', 'tight', 'semitight', 'base', 'semiloose', 'loose', 'extraloose', 'superloose'];
        const newLevel = calculateLevelChange(baseValue, delta, levels, 'padding', 'base', false);
        return DESIGN_TOKEN_MAPPING.dimension.padding[newLevel];
      }
    },
    conflicts: ['decreaseInfoDensity']
  },
  
  // 12. 减少信息密度
  decreaseInfoDensity: {
    category: 'typography',
    name: '减少信息密度',
    intensity: 'moderate',
    effects: {
      fontSize: 'increase',
      lineHeight: 'expand',
      padding: 'increase'
    },
    styleMapping: {
      fontSize: (baseValue, delta) => {
        const levels = ['tiny', 'small', 'medium', 'large', 'xl', 'xxl', 'xxxl'];
        const newLevel = calculateLevelChange(baseValue, delta, levels, 'size', 'medium', true);
        return DESIGN_TOKEN_MAPPING.font.size[newLevel];
      },
      padding: (baseValue, delta) => {
        const levels = ['none', 'supertight', 'extratight', 'tight', 'semitight', 'base', 'semiloose', 'loose', 'extraloose', 'superloose'];
        const newLevel = calculateLevelChange(baseValue, delta, levels, 'padding', 'base', true);
        return DESIGN_TOKEN_MAPPING.dimension.padding[newLevel];
      }
    },
    conflicts: ['increaseInfoDensity']
  },
  
  // 13. 增强视觉强度
  enhanceVisualStrength: {
    category: 'typography',
    name: '增强视觉强度',
    intensity: 'strong',
    effects: {
      fontWeight: 'increase',
      fontSize: 'increase',
      contrast: 'enhance'
    },
    styleMapping: {
      fontWeight: (baseValue, delta) => {
        const levels = ['light', 'medium', 'semibold', 'bold'];
        const newLevel = calculateLevelChange(baseValue, delta, levels, 'fontweight', 'medium', true);
        return DESIGN_TOKEN_MAPPING.font.weight[newLevel];
      },
      color: (current, delta) => {
        if (delta > 0.5) return DESIGN_TOKEN_MAPPING.color.onSurface.black100;
        return DESIGN_TOKEN_MAPPING.color.onSurface.black88;
      }
    },
    conflicts: ['softenVisualStrength']
  },
  
  // 14. 减弱视觉强度
  softenVisualStrength: {
    category: 'typography',
    name: '减弱视觉强度',
    intensity: 'moderate',
    effects: {
      fontWeight: 'decrease',
      fontSize: 'decrease', 
      contrast: 'soften'
    },
    styleMapping: {
      fontWeight: (baseValue, delta) => {
        const levels = ['light', 'medium', 'semibold', 'bold'];
        const newLevel = calculateLevelChange(baseValue, delta, levels, 'fontweight', 'medium', false);
        return DESIGN_TOKEN_MAPPING.font.weight[newLevel];
      },
      color: (current, delta) => {
        if (delta > 0.5) return DESIGN_TOKEN_MAPPING.color.onSurface.black48;
        return DESIGN_TOKEN_MAPPING.color.onSurface.black64;
      }
    },
    conflicts: ['enhanceVisualStrength']
  },
  
  // 15. 居中对齐
  centerAlignment: {
    category: 'typography',
    name: '居中对齐',
    intensity: 'moderate',
    effects: {
      textAlign: 'center',
      justifyContent: 'center'
    },
    styleMapping: {
      textAlign: () => 'center',
      justifyContent: () => 'center',
      alignItems: () => 'center'
    },
    conflicts: ['leftAlignment', 'rightAlignment']
  },
  
  // 16. 左对齐
  leftAlignment: {
    category: 'typography',
    name: '左对齐',
    intensity: 'moderate',
    effects: {
      textAlign: 'left',
      justifyContent: 'flex-start'
    },
    styleMapping: {
      textAlign: () => 'left',
      justifyContent: () => 'flex-start',
      alignItems: () => 'flex-start'
    },
    conflicts: ['centerAlignment', 'rightAlignment']
  },
  
  // 17. 右对齐
  rightAlignment: {
    category: 'typography',
    name: '右对齐',
    intensity: 'moderate',
    effects: {
      textAlign: 'right',
      justifyContent: 'flex-end'
    },
    styleMapping: {
      textAlign: () => 'right',
      justifyContent: () => 'flex-end',
      alignItems: () => 'flex-end'
    },
    conflicts: ['centerAlignment', 'leftAlignment']
  },

  // ==================== 质感动作 (Material Actions) ====================
  
  // 18. 增加阴影深度
  increaseShadowDepth: {
    category: 'material',
    name: '增加阴影深度',
    intensity: 'moderate',
    effects: {
      boxShadow: 'deepen',
      elevation: 'increase'
    },
    styleMapping: {
      boxShadow: (baseValue, delta) => {
        const levels = ['ground', 'main', 'B1', '1f', '2f', '3f', '4f', '5f'];
        const newLevel = calculateLevelChange(baseValue, delta, levels, 'hierarchy', 'main', true);
        return DESIGN_TOKEN_MAPPING.material.hierarchy[newLevel];
      }
    },
    conflicts: ['decreaseShadowDepth']
  },
  
  // 19. 减少阴影深度
  decreaseShadowDepth: {
    category: 'material',
    name: '减少阴影深度',
    intensity: 'moderate',
    effects: {
      boxShadow: 'flatten',
      elevation: 'decrease'
    },
    styleMapping: {
      boxShadow: (baseValue, delta) => {
        const levels = ['ground', 'main', 'B1', '1f', '2f', '3f', '4f', '5f'];
        const newLevel = calculateLevelChange(baseValue, delta, levels, 'hierarchy', 'main', false);
        return DESIGN_TOKEN_MAPPING.material.hierarchy[newLevel];
      }
    },
    conflicts: ['increaseShadowDepth']
  },
  
  // 20. 增加材质纹理，增加材质纹理目前没有设置，需要确定
  increaseTexture: {
    category: 'material',
    name: '增加材质纹理',
    intensity: 'strong',
    effects: {
      backgroundImage: 'pattern',
      opacity: 'texture'
    },
    styleMapping: {
      backgroundImage: (current, delta) => {
        if (delta < 0.2) return 'none';
        if (delta < 0.5) return 'radial-gradient(rgba(0,0,0,0.1) 2px, transparent 2px)';
        return 'repeating-linear-gradient(45deg, rgba(0,0,0,0.1), rgba(0,0,0,0.1) 2px, transparent 2px, transparent 10px)';
      },
      backgroundSize: (current, delta) => `${10 + delta * 20}px ${10 + delta * 20}px`
    },
    conflicts: ['decreaseTexture']
  },
  
  // 21. 减少材质纹理
  decreaseTexture: {
    category: 'material',
    name: '减少材质纹理',
    intensity: 'moderate',
    effects: {
      backgroundImage: 'clean',
      opacity: 'solid'
    },
    styleMapping: {
      backgroundImage: () => 'none',
      backgroundSize: () => 'auto'
    },
    conflicts: ['increaseTexture']
  },
  
  // 22. 增加透明度，增加透明度也需要确认
  increaseTransparency: {
    category: 'material',
    name: '增加透明度',
    intensity: 'moderate',
    effects: {
      opacity: 'decrease',
      backdropFilter: 'blur'
    },
    styleMapping: {
      backgroundColor: (current, delta) => {
        // 从solid颜色转换为半透明
        if (current && !current.includes('rgba')) {
          return current.replace('rgb', 'rgba').replace(')', `, ${1 - delta * 0.5})`);
        }
        return current;
      },
      backdropFilter: (current, delta) => {
        if (delta > 0.2) return `blur(${delta * 10}px)`;
        return 'none';
      }
    },
    conflicts: ['decreaseTransparency']
  },
  
  // 23. 减少透明度
  decreaseTransparency: {
    category: 'material',
    name: '减少透明度',
    intensity: 'moderate',
    effects: {
      opacity: 'increase',
      backdropFilter: 'none'
    },
    styleMapping: {
      backgroundColor: (current, delta) => {
        // 从半透明转换为更实体
        if (current && current.includes('rgba')) {
          return current.replace(/,\s*[\d.]+\)/, `, ${Math.min(1, 0.7 + delta * 0.3)})`);
        }
        return current;
      },
      backdropFilter: () => 'none'
    },
    conflicts: ['increaseTransparency']
  },

  // ==================== 比例动作 (Proportion Actions) ====================
  
  // 24. 增加空间感
  increaseSpacing: {
    category: 'proportion',
    name: '增加空间感',
    intensity: 'moderate',
    effects: {
      padding: 'increase',
      margin: 'increase',
      gap: 'increase'
    },
    styleMapping: {
      padding: (baseValue, delta) => {
        const levels = ['none', 'supertight', 'extratight', 'tight', 'semitight', 'base', 'semiloose', 'loose', 'extraloose', 'superloose'];
        const newLevel = calculateLevelChange(baseValue, delta, levels, 'padding', 'base', true);
        return DESIGN_TOKEN_MAPPING.dimension.padding[newLevel];
      },
      margin: (baseValue, delta) => {
        const levels = ['none', 'supertight', 'extratight', 'tight', 'semitight', 'base', 'semiloose', 'loose', 'extraloose', 'superloose'];
        const newLevel = calculateLevelChange(baseValue, delta, levels, 'margin', 'base', true);
        return DESIGN_TOKEN_MAPPING.dimension.margin[newLevel];
      },
      gap: (baseValue, delta) => {
        const levels = ['none', 'supertight', 'extratight', 'tight', 'semitight', 'base', 'semiloose', 'loose', 'extraloose', 'superloose'];
        const newLevel = calculateLevelChange(baseValue, delta, levels, 'gap', 'base', true);
        return DESIGN_TOKEN_MAPPING.dimension.gap[newLevel];
      }
    },
    conflicts: ['decreaseSpacing']
  },
  
  // 25. 减少空间感
  decreaseSpacing: {
    category: 'proportion',
    name: '减少空间感',
    intensity: 'moderate',
    effects: {
      padding: 'decrease',
      margin: 'decrease',
      gap: 'decrease'
    },
    styleMapping: {
      padding: (baseValue, delta) => {
        const levels = ['none', 'supertight', 'extratight', 'tight', 'semitight', 'base', 'semiloose', 'loose', 'extraloose', 'superloose'];
        const newLevel = calculateLevelChange(baseValue, delta, levels, 'padding', 'base', false);
        return DESIGN_TOKEN_MAPPING.dimension.padding[newLevel];
      },
      margin: (baseValue, delta) => {
        const levels = ['none', 'supertight', 'extratight', 'tight', 'semitight', 'base', 'semiloose', 'loose', 'extraloose', 'superloose'];
        const newLevel = calculateLevelChange(baseValue, delta, levels, 'margin', 'base', false);
        return DESIGN_TOKEN_MAPPING.dimension.margin[newLevel];
      },
      gap: (baseValue, delta) => {
        const levels = ['none', 'supertight', 'extratight', 'tight', 'semitight', 'base', 'semiloose', 'loose', 'extraloose', 'superloose'];
        const newLevel = calculateLevelChange(baseValue, delta, levels, 'gap', 'base', false);
        return DESIGN_TOKEN_MAPPING.dimension.gap[newLevel];
      }
    },
    conflicts: ['increaseSpacing']
  },
  
  // 26. 增强边缘张力
  increaseEdgeTension: {
    category: 'proportion',
    name: '增强边缘张力',
    intensity: 'strong',
    effects: {
      borderWidth: 'increase',
      gap: 'decrease',
      separation: 'enhance'
    },
    styleMapping: {
      borderWidth: (baseValue, delta) => {
        const levels = ['none', 'narrow', 'base', 'wide'];
        const newLevel = calculateLevelChange(baseValue, delta, levels, 'borderwidth', 'narrow', true);
        return DESIGN_TOKEN_MAPPING.dimension.borderWidth[newLevel];
      },
      gap: (baseValue, delta) => {
        const levels = ['none', 'supertight', 'extratight', 'tight', 'semitight', 'base', 'semiloose', 'loose', 'extraloose', 'superloose'];
        const newLevel = calculateLevelChange(baseValue, delta, levels, 'gap', 'base', false);
        return DESIGN_TOKEN_MAPPING.dimension.gap[newLevel];
      }
    },
    conflicts: ['decreaseEdgeTension']
  },
  
  // 27. 减弱边缘张力
  decreaseEdgeTension: {
    category: 'proportion',
    name: '减弱边缘张力',
    intensity: 'moderate',
    effects: {
      borderWidth: 'decrease',
      gap: 'increase',
      separation: 'soften'
    },
    styleMapping: {
      borderWidth: (baseValue, delta) => {
        const levels = ['none', 'narrow', 'base', 'wide'];
        const newLevel = calculateLevelChange(baseValue, delta, levels, 'borderwidth', 'narrow', false);
        return DESIGN_TOKEN_MAPPING.dimension.borderWidth[newLevel];
      },
      gap: (baseValue, delta) => {
        const levels = ['none', 'supertight', 'extratight', 'tight', 'semitight', 'base', 'semiloose', 'loose', 'extraloose', 'superloose'];
        const newLevel = calculateLevelChange(baseValue, delta, levels, 'gap', 'base', true);
        return DESIGN_TOKEN_MAPPING.dimension.gap[newLevel];
      }
    },
    conflicts: ['increaseEdgeTension']
  },
  
  // 28. 增加视觉重量
  increaseVisualWeight: {
    category: 'proportion',
    name: '增加视觉重量',
    intensity: 'strong',
    effects: {
      scale: 'increase',
      fontWeight: 'increase',
      boxShadow: 'enhance'
    },
    styleMapping: {
      transform: (current, delta) => {
        const scale = 1 + delta * 0.3;
        return `scale(${scale})`;
      },
      fontWeight: (baseValue, delta) => {
        const levels = ['light', 'medium', 'semibold', 'bold'];
        const newLevel = calculateLevelChange(baseValue, delta, levels, 'fontweight', 'medium', true);
        return DESIGN_TOKEN_MAPPING.font.weight[newLevel];
      }
    },
    conflicts: ['decreaseVisualWeight']
  },
  
  // 29. 减少视觉重量
  decreaseVisualWeight: {
    category: 'proportion',
    name: '减少视觉重量',
    intensity: 'moderate',
    effects: {
      scale: 'decrease',
      fontWeight: 'decrease',
      boxShadow: 'soften'
    },
    styleMapping: {
      transform: (current, delta) => {
        const scale = Math.max(0.7, 1 - delta * 0.3);
        return `scale(${scale})`;
      },
      fontWeight: (baseValue, delta) => {
        const levels = ['light', 'medium', 'semibold', 'bold'];
        const newLevel = calculateLevelChange(baseValue, delta, levels, 'fontweight', 'medium', false);
        return DESIGN_TOKEN_MAPPING.font.weight[newLevel];
      }
    },
    conflicts: ['increaseVisualWeight']
  },

  // ==================== 构图动作 (Composition Actions) - 已废弃，使用新的布局调控系统 ====================
  
  // 注意：布局动作已被移除，现在使用基于布局ID的精确调控系统
  // 新系统支持：
  // - 解析所有有子元素的layout
  // - 根据布局ID精确调控
  // - 强度0-0.5为column，0.5-1.0为row
  // - 显示layout对应的markdown内容

  // ==================== 状态指示动作 (State Actions) ====================
  
  // 34. 应用成功状态
  applySuccessState: {
    category: 'state',
    name: '应用成功状态',
    intensity: 'moderate',
    effects: {
      backgroundColor: 'success',
      borderColor: 'success',
      textColor: 'success'
    },
    styleMapping: {
      backgroundColor: (current, delta) => {
        const levels = ['green0', 'green1', 'green2', 'green3', 'green4', 'green5'];
        const index = Math.floor(delta * levels.length);
        return DESIGN_TOKEN_MAPPING.color.success[levels[Math.min(index, levels.length - 1)]];
      },
      borderColor: (current, delta) => {
        const level = delta > 0.5 ? 'green5' : 'green3';
        return DESIGN_TOKEN_MAPPING.color.success[level];
      },
      color: (current, delta) => {
        const level = delta > 0.7 ? 'green8' : 'green6';
        return DESIGN_TOKEN_MAPPING.color.success[level];
      }
    },
    conflicts: ['applyErrorState', 'applyWarningState', 'applyDisableState']
  },
  
  // 35. 应用错误状态
  applyErrorState: {
    category: 'state',
    name: '应用错误状态',
    intensity: 'moderate',
    effects: {
      backgroundColor: 'error',
      borderColor: 'error',
      textColor: 'error'
    },
    styleMapping: {
      backgroundColor: (current, delta) => {
        const levels = ['red0', 'red1', 'red2', 'red3', 'red4', 'red5'];
        const index = Math.floor(delta * levels.length);
        return DESIGN_TOKEN_MAPPING.color.error[levels[Math.min(index, levels.length - 1)]];
      },
      borderColor: (current, delta) => {
        const level = delta > 0.5 ? 'red5' : 'red3';
        return DESIGN_TOKEN_MAPPING.color.error[level];
      },
      color: (current, delta) => {
        const level = delta > 0.7 ? 'red8' : 'red6';
        return DESIGN_TOKEN_MAPPING.color.error[level];
      }
    },
    conflicts: ['applySuccessState', 'applyWarningState', 'applyDisableState']
  },
  
  // 36. 应用警告状态
  applyWarningState: {
    category: 'state',
    name: '应用警告状态',
    intensity: 'moderate',
    effects: {
      backgroundColor: 'warning',
      borderColor: 'warning',
      textColor: 'warning'
    },
    styleMapping: {
      backgroundColor: (current, delta) => {
        const levels = ['orange0', 'orange1', 'orange2', 'orange3', 'orange4', 'orange5'];
        const index = Math.floor(delta * levels.length);
        return DESIGN_TOKEN_MAPPING.color.warning[levels[Math.min(index, levels.length - 1)]];
      },
      borderColor: (current, delta) => {
        const level = delta > 0.5 ? 'orange5' : 'orange3';
        return DESIGN_TOKEN_MAPPING.color.warning[level];
      },
      color: (current, delta) => {
        const level = delta > 0.7 ? 'orange8' : 'orange6';
        return DESIGN_TOKEN_MAPPING.color.warning[level];
      }
    },
    conflicts: ['applySuccessState', 'applyErrorState', 'applyDisableState']
  },
  
  // 37. 应用禁用状态
  applyDisableState: {
    category: 'state',
    name: '应用禁用状态',
    intensity: 'moderate',
    effects: {
      backgroundColor: 'disable',
      borderColor: 'disable',
      textColor: 'disable',
      opacity: 'reduce'
    },
    styleMapping: {
      backgroundColor: (current, delta) => {
        const levels = ['grey0', 'grey1', 'grey2', 'grey3', 'grey4'];
        const index = Math.floor(delta * levels.length);
        return DESIGN_TOKEN_MAPPING.color.disable[levels[Math.min(index, levels.length - 1)]];
      },
      borderColor: (current, delta) => {
        return DESIGN_TOKEN_MAPPING.color.disable.grey3;
      },
      color: (current, delta) => {
        const level = delta > 0.5 ? 'grey6' : 'grey5';
        return DESIGN_TOKEN_MAPPING.color.disable[level];
      },
      opacity: (current, delta) => Math.max(0.4, 1 - delta * 0.4),
      cursor: () => 'not-allowed'
    },
    conflicts: ['applySuccessState', 'applyErrorState', 'applyWarningState']
  },
  
  // 38. 应用信息状态
  applyInfoState: {
    category: 'state',
    name: '应用信息状态',
    intensity: 'moderate',
    effects: {
      backgroundColor: 'info',
      borderColor: 'info',
      textColor: 'info'
    },
    styleMapping: {
      backgroundColor: (current, delta) => {
        const level = delta > 0.5 ? 'blue1' : 'blue0';
        return DESIGN_TOKEN_MAPPING.color.info[level];
      },
      borderColor: (current, delta) => {
        const level = delta > 0.5 ? 'blue5' : 'blue3';
        return DESIGN_TOKEN_MAPPING.color.info[level];
      },
      color: (current, delta) => {
        const level = delta > 0.7 ? 'blue9' : 'blue7';
        return DESIGN_TOKEN_MAPPING.color.info[level];
      }
    },
    conflicts: []
  },

  // ==================== 极致圆角动作 (Extreme Roundness Actions) ====================
  
  // 39. 极致圆角化
  makeExtremeRounded: {
    category: 'form',
    name: '极致圆角化',
    intensity: 'strong',
    effects: {
      borderRadius: 'extreme',
      clipPath: 'round'
    },
    styleMapping: {
      borderRadius: (current, delta) => {
        if (delta > 0.8) return DESIGN_TOKEN_MAPPING.dimension.borderRadius.full; // 完全圆形
        if (delta > 0.6) return DESIGN_TOKEN_MAPPING.dimension.borderRadius.xxxxl;
        if (delta > 0.4) return DESIGN_TOKEN_MAPPING.dimension.borderRadius.xxxl;
        return DESIGN_TOKEN_MAPPING.dimension.borderRadius.xxl;
      },
      clipPath: (current, delta) => {
        if (delta > 0.7) return 'circle(50% at 50% 50%)';
        return 'none';
      }
    },
    conflicts: ['decreaseRoundness', 'makeAngular']
  },
  
  // 40. 完全方角化
  makeAngular: {
    category: 'form',
    name: '完全方角化',
    intensity: 'strong',
    effects: {
      borderRadius: 'none',
      clipPath: 'rectangular'
    },
    styleMapping: {
      borderRadius: () => DESIGN_TOKEN_MAPPING.dimension.borderRadius.none,
      clipPath: () => 'none'
    },
    conflicts: ['increaseRoundness', 'makeExtremeRounded']
  },

  // ==================== 智能适应动作 (Adaptive Actions) ====================
  
  // 41. 智能状态适应
  adaptToContext: {
    category: 'adaptive',
    name: '智能状态适应',
    intensity: 'moderate',
    effects: {
      contextualStyling: 'auto',
      responsiveAdjustment: 'enable'
    },
    styleMapping: {
      // 根据元素类型智能调整
      padding: (current, delta, elementType) => {
        if (elementType === 'button') {
          return delta > 0.5 ? 
            DESIGN_TOKEN_MAPPING.dimension.padding.loose : 
            DESIGN_TOKEN_MAPPING.dimension.padding.base;
        }
        if (elementType === 'text') {
          return delta > 0.5 ? 
            DESIGN_TOKEN_MAPPING.dimension.padding.tight : 
            DESIGN_TOKEN_MAPPING.dimension.padding.none;
        }
        return current;
      },
      fontSize: (current, delta, elementType, variant) => {
        // 检查是否为标题类型（text元素的h1-h6变体）
        if (elementType === 'text' && variant && ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(variant) && delta > 0.6) {
          return DESIGN_TOKEN_MAPPING.font.size.xxxl;
        }
        // 检查是否为正文类型（text元素的normal变体或无变体）
        if (elementType === 'text' && (!variant || variant === 'normal') && delta > 0.4) {
          return DESIGN_TOKEN_MAPPING.font.size.large;
        }
        return current;
      }
    },
    conflicts: []
  },
  
  // 42. 响应式缩放
  responsiveScale: {
    category: 'adaptive',
    name: '响应式缩放',
    intensity: 'moderate',
    effects: {
      scale: 'responsive',
      breakpointAdaptation: 'enable'
    },
    styleMapping: {
      transform: (current, delta) => {
        const scale = 0.8 + delta * 0.4; // 0.8 到 1.2 的范围
        return `scale(${scale})`;
      },
      fontSize: (current, delta) => {
        // 小屏设备时字体相对较小
        const mobileScale = 0.9 + delta * 0.2;
        return `calc(${current} * ${mobileScale})`;
      },
      '@media (max-width: 768px)': {
        padding: (current, delta) => {
          const levels = ['tight', 'semitight', 'base', 'semiloose'];
          const index = Math.floor(delta * levels.length);
          return DESIGN_TOKEN_MAPPING.dimension.padding[levels[Math.min(index, levels.length - 1)]];
        }
      }
    },
    conflicts: []
  },

  // ==================== 高级动画动作 (Animation Actions) ====================
  
  // 43. 增加微动效
  addMicroInteractions: {
    category: 'animation',
    name: '增加微动效',
    intensity: 'subtle',
    effects: {
      transition: 'smooth',
      hoverEffects: 'enhance',
      microAnimations: 'enable'
    },
    styleMapping: {
      transition: (current, delta) => {
        if (delta > 0.7) return 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        if (delta > 0.4) return 'all 0.2s ease';
        return 'all 0.1s ease';
      },
      '&:hover': {
        transform: (current, delta) => {
          if (delta > 0.6) return 'translateY(-2px) scale(1.02)';
          if (delta > 0.3) return 'translateY(-1px)';
          return 'none';
        },
        boxShadow: (current, delta) => {
          if (delta > 0.5) return DESIGN_TOKEN_MAPPING.material.hierarchy['2f'];
          return DESIGN_TOKEN_MAPPING.material.hierarchy.main;
        }
      }
    },
    conflicts: ['removeAnimations']
  },
  
  // 44. 移除动画效果
  removeAnimations: {
    category: 'animation',
    name: '移除动画效果',
    intensity: 'moderate',
    effects: {
      transition: 'none',
      hoverEffects: 'disable',
      animations: 'remove'
    },
    styleMapping: {
      transition: () => 'none',
      animation: () => 'none',
      '&:hover': {
        transform: () => 'none',
        boxShadow: (current) => current
      }
    },
    conflicts: ['addMicroInteractions']
  },

  // ==================== 可访问性动作 (Accessibility Actions) ====================
  
  // 45. 增强可访问性
  enhanceAccessibility: {
    category: 'accessibility',
    name: '增强可访问性',
    intensity: 'strong',
    effects: {
      contrast: 'enhance',
      focusVisible: 'improve',
      textReadability: 'optimize'
    },
    styleMapping: {
      // 增强对比度
      color: (current, delta, elementType) => {
        if (elementType === 'text' && delta > 0.5) {
          return DESIGN_TOKEN_MAPPING.color.onSurface.black100;
        }
        return current;
      },
      // 改善焦点可见性
      '&:focus': {
        outline: (current, delta) => {
          if (delta > 0.6) return `3px solid ${DESIGN_TOKEN_MAPPING.color.primary.brand5}`;
          return `2px solid ${DESIGN_TOKEN_MAPPING.color.primary.brand4}`;
        },
        outlineOffset: () => '2px'
      },
      // 优化字体大小
      fontSize: (baseValue, delta) => {
        if (delta > 0.7) {
          const levels = ['medium', 'large', 'xl'];
          const newLevel = calculateLevelChange(baseValue, delta, levels, 'size', 'medium', true);
          return DESIGN_TOKEN_MAPPING.font.size[newLevel];
        }
        return baseValue;
      }
    },
    conflicts: []
  }
};

/**
 * 动作冲突检测和解决机制
 */
export class ActionConflictResolver {
  constructor() {
    this.appliedActions = new Map(); // 记录已应用的动作
    this.styleState = new Map(); // 记录当前样式状态
  }
  
  /**
   * 检测动作冲突
   * @param {string} actionName - 动作名称
   * @returns {Array} 冲突的动作列表
   */
  detectConflicts(actionName) {
    const action = RL_ACTIONS[actionName];
    if (!action || !action.conflicts) return [];
    
    const conflicts = [];
    action.conflicts.forEach(conflictAction => {
      if (this.appliedActions.has(conflictAction)) {
        conflicts.push(conflictAction);
      }
    });
    
    return conflicts;
  }
  
  /**
   * 解决样式冲突 - 采用增量合并策略
   * @param {string} property - 样式属性名
   * @param {*} value1 - 第一个值
   * @param {*} value2 - 第二个值
   * @param {string} mergeStrategy - 合并策略
   * @returns {*} 合并后的值
   */
  resolveStyleConflict(property, value1, value2, mergeStrategy = 'max') {
    try {
      // 数值类型的增量合并
      if (typeof value1 === 'number' && typeof value2 === 'number') {
        switch (mergeStrategy) {
          case 'max': return Math.max(value1, value2);
          case 'min': return Math.min(value1, value2);
          case 'add': return value1 + value2;
          case 'avg': return (value1 + value2) / 2;
          default: return Math.max(value1, value2);
        }
      }
      
      // 字符串类型的级别合并
      if (typeof value1 === 'string' && typeof value2 === 'string') {
        const levels = this.getPropertyLevels(property);
        if (levels && Array.isArray(levels)) {
          const index1 = levels.indexOf(value1);
          const index2 = levels.indexOf(value2);
          if (index1 !== -1 && index2 !== -1) {
            const maxIndex = Math.max(index1, index2);
            return levels[maxIndex];
          }
        }
      }
      
    } catch (error) {
      console.warn(`冲突解决过程出错 ${property}:`, error.message);
    }
    
    // 默认返回较新的值
    return value2;
  }
  
  /**
   * 获取属性的级别序列
   * @param {string} property - 属性名
   * @returns {Array|null} 级别数组
   */
  getPropertyLevels(property) {
    const levelMap = {
      borderRadius: ['none', 'xs', 'small', 'medium', 'large', 'xl', 'xxl', 'xxxl', 'xxxxl', 'full'],
      borderWidth: ['none', 'narrow', 'base', 'wide'],
      fontSize: ['tiny', 'small', 'medium', 'large', 'xl', 'xxl', 'xxxl', 'xxxxl', 'super'],
      fontWeight: ['light', 'medium', 'semibold', 'bold'],
      padding: ['none', 'supertight', 'extratight', 'tight', 'semitight', 'base', 'semiloose', 'loose', 'extraloose', 'superloose'],
      margin: ['none', 'supertight', 'extratight', 'tight', 'semitight', 'base', 'semiloose', 'loose', 'extraloose', 'superloose'],
      gap: ['none', 'supertight', 'extratight', 'tight', 'semitight', 'base', 'semiloose', 'loose', 'extraloose', 'superloose'],
      boxShadow: ['ground', 'main', 'B1', 'B2', 'B3', '1f', '2f', '3f', '4f', '5f'],
      // 状态颜色级别
      successColor: ['green0', 'green1', 'green2', 'green3', 'green4', 'green5', 'green6', 'green7', 'green8', 'green9'],
      errorColor: ['red0', 'red1', 'red2', 'red3', 'red4', 'red5', 'red6', 'red7', 'red8', 'red9'],
      warningColor: ['orange0', 'orange1', 'orange2', 'orange3', 'orange4', 'orange5', 'orange6', 'orange7', 'orange8', 'orange9'],
      disableColor: ['grey0', 'grey1', 'grey2', 'grey3', 'grey4', 'grey5', 'grey6', 'grey7', 'grey8', 'grey9'],
      infoColor: ['blue0', 'blue1', 'blue2', 'blue3', 'blue4', 'blue5', 'blue6', 'blue7', 'blue8', 'blue9']
    };
    
    return levelMap[property] || null;
  }
  
  /**
   * 应用动作到样式状态
   * @param {string} actionName - 动作名称
   * @param {number} intensity - 动作强度 (0-1)
   * @param {Object} currentStyles - 当前样式对象
   * @param {Object} baseStyles - 基准样式对象
   * @returns {Object} 更新后的样式对象
   */
  applyAction(actionName, intensity, currentStyles, baseStyles = null) {
    console.log(`\n🔍 [DEBUG] 开始执行动作: ${actionName}, 强度: ${intensity}`);
    
    // 安全检查
    if (!currentStyles || typeof currentStyles !== 'object') {
      console.error('❌ [ERROR] 当前样式对象无效:', currentStyles);
      return {};
    }
    
    // 使用传入的基准样式或者实例的基准样式
    const effectiveBaseStyles = baseStyles || this.baseStyles || {};
    if (!effectiveBaseStyles || typeof effectiveBaseStyles !== 'object') {
      console.warn('⚠️ [WARN] 基准样式对象无效，将使用当前样式作为基准:', effectiveBaseStyles);
    }
    
    const action = RL_ACTIONS[actionName];
    if (!action) {
      console.error(`❌ [ERROR] 未找到动作: ${actionName}`);
      return currentStyles;
    }
    
    // 检查动作是否适用于当前元件类型
    const elementType = currentStyles.elementType || 'general';
    const variant = currentStyles.variant || 'normal';
    console.log(`🔍 [DEBUG] 元件类型: ${elementType}.${variant}, 动作类别: ${action.category}`);
    
    if (!this.isActionApplicableToElement(action, elementType, variant)) {
      console.warn(`❌ [WARN] 动作 ${actionName} 不适用于元件类型 ${elementType}.${variant}`);
      return currentStyles;
    }
    
    // 检测冲突
    const conflicts = this.detectConflicts(actionName);
    
    // 计算动作强度 - 直接将用户输入的0-1范围映射到动作的有效范围
    const intensityRange = ACTION_INTENSITY_MAP[action.intensity];
    // 如果强度为0，则设置为极小值而不是强制提升
    const effectiveIntensity = intensity === 0 ? 0.01 : intensity;
    const normalizedIntensity = intensityRange.min + effectiveIntensity * (intensityRange.max - intensityRange.min);
    
    // 🎯 动作执行开始
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🎯 执行动作: ${action.name}`);
    console.log(`   📊 强度: ${intensity.toFixed(1)} (用户) → ${normalizedIntensity.toFixed(2)} (系统)`);
    console.log(`   🎯 目标: ${elementType}.${variant}`);
    console.log(`   📋 分类: ${action.category} | 强度类型: ${action.intensity}`);
    if (conflicts.length > 0) {
      console.log(`   ⚠️ 冲突: ${conflicts.join(', ')}`);
    }
    console.log(`${'='.repeat(60)}`);
    
    // 应用样式映射
    const updatedStyles = { ...currentStyles };
    const tokenChanges = []; // 记录所有token变化
    
    if (action.styleMapping) {
      Object.entries(action.styleMapping).forEach(([property, mappingFunc]) => {
        try {
          // 使用基准值作为相对调节的起点，如果基准值不存在则使用当前值
          const baseValue = effectiveBaseStyles[property] || updatedStyles[property];
          const currentValue = updatedStyles[property];
          
          // 确保有基准值可用
          if (baseValue === undefined) {
            console.warn(`❌ 属性 ${property} 的基准值和当前值都未定义，跳过此动作`);
            return;
          }
          
          const newValue = mappingFunc(baseValue, normalizedIntensity, updatedStyles.elementType, updatedStyles.variant);
          
          // 确保新值有效
          if (newValue === undefined) {
            console.warn(`❌ 动作 ${actionName} 的 ${property} 映射返回 undefined`);
            return;
          }
          
          let finalValue = newValue;
          
          // 如果存在冲突，使用冲突解决策略
          if (conflicts.length > 0) {
            try {
              finalValue = this.resolveStyleConflict(property, currentValue, newValue);
              
              // 记录冲突解决的变化
              if (finalValue !== newValue) {
                console.log(`🔧 冲突解决 ${property}: ${currentValue} → ${newValue} → ${finalValue} (冲突合并后)`);
              }
            } catch (conflictError) {
              console.warn(`❌ 冲突解决失败 ${property}:`, conflictError.message);
              finalValue = newValue; // 使用新值作为回退
            }
          }
          
          // 只在值真正发生变化时记录和更新
          if (finalValue !== currentValue) {
            tokenChanges.push({
              property,
              baseValue,
              currentValue,
              newValue: finalValue,
              changed: true
            });
            
            updatedStyles[property] = finalValue;
          } else {
            tokenChanges.push({
              property,
              baseValue,
              currentValue,
              newValue: finalValue,
              changed: false
            });
          }
          
        } catch (mappingError) {
          console.error(`❌ 动作 ${actionName} 的 ${property} 映射执行失败:`, mappingError.message);
        }
      });
    }
    
    // 📊 总结token变化情况
    const changedTokens = tokenChanges.filter(change => change.changed);
    console.log(`\n${'='.repeat(60)}`);
    if (changedTokens.length > 0) {
      console.log(`✅ 动作完成 - 变更了 ${changedTokens.length} 个token:`);
      console.log(`${'─'.repeat(40)}`);
      changedTokens.forEach(change => {
        // 🔍 只显示变化的token，格式简洁明了
        if (typeof change.newValue === 'string' && change.newValue.startsWith('{') && change.newValue.endsWith('}')) {
          // Token引用，显示简化的token路径
          const tokenPath = change.newValue.slice(1, -1);
          const [category, subcategory, level] = tokenPath.split('.');
          console.log(`   📝 ${change.property}: ${change.currentValue || '默认'} → ${level} (${category}.${subcategory})`);
        } else {
          // 直接值，显示完整值
          console.log(`   📝 ${change.property}: ${change.currentValue || '默认'} → ${change.newValue}`);
        }
      });
    } else {
      console.log(`⚪ 动作完成 - 但没有token发生变化`);
      
      // 显示哪些属性被处理了但未变化
      const processedTokens = tokenChanges.filter(change => !change.changed);
      if (processedTokens.length > 0) {
        console.log(`   📋 已处理的属性: ${processedTokens.map(t => t.property).join(', ')}`);
      }
    }
    console.log(`${'='.repeat(60)}\n`);
    
    // 记录应用的动作
    this.appliedActions.set(actionName, {
      intensity: normalizedIntensity,
      timestamp: Date.now(),
      conflicts: conflicts,
      tokenChanges: tokenChanges // 保存变化记录用于后续分析
    });
    
    return updatedStyles;
  }
  
  /**
   * 检查动作是否适用于特定元件类型
   * @param {Object} action - 动作对象
   * @param {string} elementType - 元件类型
   * @returns {boolean} 是否适用
   */
  isActionApplicableToElement(action, elementType, variant = 'normal') {
    // 🔧 新增：基于动作的 applicableToElements 属性判断
    if (action.applicableToElements && Array.isArray(action.applicableToElements)) {
      return action.applicableToElements.some(target => {
        // 支持两种格式：
        // 1. 简单格式：'layout' （对所有 layout 变体有效）
        // 2. 精细格式：'layout.root' （只对特定变体有效）
        if (target.includes('.')) {
          // 精细格式：检查完整的 elementType.variant
          const [targetType, targetVariant] = target.split('.');
          return targetType === elementType && targetVariant === variant;
        } else {
          // 简单格式：只检查 elementType
          return target === elementType;
        }
      });
    }
    
    // 🔧 兼容性回退：构图动作只对Layout元件生效
    if (action.category === 'composition') {
      return elementType === 'layout' || elementType === 'container';
    }
    
    // 其他动作对所有元件生效
    return true;
  }
  
  /**
   * 批量应用动作
   * @param {Array} actions - 动作列表 [{name, intensity}, ...]
   * @param {Object} baseStyles - 基础样式
   * @returns {Object} 最终样式对象
   */
  applyActions(actions, baseStyles) {
    let currentStyles = { ...baseStyles };
    
    // 按动作强度排序，强度高的后执行
    const sortedActions = actions.sort((a, b) => {
      const actionA = RL_ACTIONS[a.name];
      const actionB = RL_ACTIONS[b.name];
      const intensityA = ACTION_INTENSITY_MAP[actionA?.intensity || 'moderate'];
      const intensityB = ACTION_INTENSITY_MAP[actionB?.intensity || 'moderate'];
      return intensityA.max - intensityB.max;
    });
    
    sortedActions.forEach(actionItem => {
      currentStyles = this.applyAction(actionItem.name, actionItem.intensity, currentStyles, baseStyles);
    });
    
    return currentStyles;
  }
  
  /**
   * 重置动作状态
   */
  reset() {
    this.appliedActions.clear();
    this.styleState.clear();
  }
  
  /**
   * 获取动作历史
   * @returns {Object} 动作历史记录
   */
  getActionHistory() {
    return Object.fromEntries(this.appliedActions);
  }
}

/**
 * 强化学习环境接口
 */
export class RLStyleEnvironment {
  constructor(initialStyles = {}, metadata = {}) {
    this.conflictResolver = new ActionConflictResolver();
    this.baseStyles = initialStyles; // 保存初始基准值（仅包含CSS样式属性）
    this.currentStyles = { ...initialStyles, ...metadata }; // 当前样式包含元数据用于动作处理
    this.metadata = metadata; // 分离存储元数据
    this.actionHistory = [];
  }
  
  /**
   * 执行动作
   * @param {string} actionName - 动作名称
   * @param {number} intensity - 动作强度 (0-1)
   * @returns {Object} 执行结果
   */
  step(actionName, intensity = 0.5) {
    const prevStyles = { ...this.currentStyles };
    
    try {
      const newStyles = this.conflictResolver.applyAction(
        actionName, 
        intensity, 
        this.currentStyles,
        this.baseStyles
      );
      
      // 确保返回的样式对象有效
      if (!newStyles || typeof newStyles !== 'object') {
        throw new Error('动作返回的样式对象无效');
      }
      
      this.currentStyles = newStyles;
      
      this.actionHistory.push({
        action: actionName,
        intensity,
        timestamp: Date.now(),
        prevStyles: prevStyles,
        newStyles: { ...this.currentStyles }
      });
      
      return {
        success: true,
        styles: this.currentStyles,
        conflicts: this.conflictResolver.detectConflicts(actionName),
        message: `动作 ${actionName} 执行成功，强度: ${intensity}`
      };
      
    } catch (error) {
      console.error(`动作 ${actionName} 执行出错:`, error);
      this.currentStyles = prevStyles; // 恢复到之前的状态
      return {
        success: false,
        styles: prevStyles,
        error: error.message,
        message: `动作 ${actionName} 执行失败`
      };
    }
  }
  
  /**
   * 批量执行动作
   * @param {Array} actions - 动作列表
   * @returns {Object} 执行结果
   */
  stepBatch(actions) {
    const prevStyles = { ...this.currentStyles };
    
    try {
      this.currentStyles = this.conflictResolver.applyActions(actions, this.currentStyles);
      
      this.actionHistory.push({
        actions,
        timestamp: Date.now(),
        prevStyles: prevStyles,
        newStyles: { ...this.currentStyles }
      });
      
      return {
        success: true,
        styles: this.currentStyles,
        message: `批量执行 ${actions.length} 个动作成功`
      };
      
    } catch (error) {
      return {
        success: false,
        styles: prevStyles,
        error: error.message,
        message: `批量动作执行失败`
      };
    }
  }
  
  /**
   * 重置环境
   */
  reset() {
    this.currentStyles = { ...this.baseStyles, ...this.metadata };
    this.conflictResolver.reset();
    this.actionHistory = [];
  }
  
  /**
   * 获取当前状态
   * @returns {Object} 当前状态
   */
  getState() {
    return {
      styles: this.currentStyles,
      actionHistory: this.actionHistory,
      appliedActions: this.conflictResolver.getActionHistory()
    };
  }
  
  /**
   * 获取可用动作列表
   * @returns {Array} 动作名称列表
   */
  getActionSpace() {
    return Object.keys(RL_ACTIONS);
  }
  
  /**
   * 获取动作信息
   * @param {string} actionName - 动作名称
   * @returns {Object} 动作信息
   */
  getActionInfo(actionName) {
    return RL_ACTIONS[actionName] || null;
  }
}

/**
 * 将动作执行结果转换为兼容现有token系统的格式
 * @param {Object} actionResults - 动作执行结果
 * @returns {Object} 兼容的token对象
 */
export function convertActionResultsToTokens(actionResults) {
  // 创建基础token结构
  const tokens = {
    shape: 5,      // 默认中等值
    degree: 5,     // 默认中等值  
    font: 5,       // 默认中等值
    material: 5,   // 默认中等值
    color: "#2563eb" // 默认主题色
  };
  
  if (!actionResults || !actionResults.styles) {
    return tokens;
  }
  
  const styles = actionResults.styles;
  
  // 根据动作结果调整token值
  // 这里需要反向映射：从具体样式值推断应该使用的token级别
  
  // 处理圆角相关
  if (styles.borderRadius) {
    const radiusValue = styles.borderRadius;
    if (typeof radiusValue === 'string') {
      if (radiusValue.includes('none')) tokens.shape = 0;
      else if (radiusValue.includes('xs')) tokens.shape = 2;
      else if (radiusValue.includes('small')) tokens.shape = 3;
      else if (radiusValue.includes('medium')) tokens.shape = 5;
      else if (radiusValue.includes('large')) tokens.shape = 7;
      else if (radiusValue.includes('xl')) tokens.shape = 8;
      else if (radiusValue.includes('xxl')) tokens.shape = 9;
      else if (radiusValue.includes('full')) tokens.shape = 10;
    }
  }
  
  // 处理间距相关
  if (styles.padding || styles.margin || styles.gap) {
    let spacingLevel = 5; // 默认值
    
    [styles.padding, styles.margin, styles.gap].forEach(spacing => {
      if (typeof spacing === 'string') {
        if (spacing.includes('none')) spacingLevel = Math.min(spacingLevel, 0);
        else if (spacing.includes('tight')) spacingLevel = Math.min(spacingLevel, 3);
        else if (spacing.includes('base')) spacingLevel = Math.min(spacingLevel, 5);
        else if (spacing.includes('loose')) spacingLevel = Math.max(spacingLevel, 7);
        else if (spacing.includes('superloose')) spacingLevel = Math.max(spacingLevel, 10);
      }
    });
    
    tokens.degree = spacingLevel;
  }
  
  // 处理字体相关
  if (styles.fontSize) {
    const fontSize = styles.fontSize;
    if (typeof fontSize === 'string') {
      if (fontSize.includes('tiny')) tokens.font = 1;
      else if (fontSize.includes('small')) tokens.font = 3;
      else if (fontSize.includes('medium')) tokens.font = 5;
      else if (fontSize.includes('large')) tokens.font = 7;
      else if (fontSize.includes('xl')) tokens.font = 8;
      else if (fontSize.includes('xxl')) tokens.font = 9;
      else if (fontSize.includes('xxxl')) tokens.font = 10;
    }
  }
  
  // 处理材质/阴影相关
  if (styles.boxShadow) {
    const shadow = styles.boxShadow;
    if (typeof shadow === 'string') {
      if (shadow.includes('ground')) tokens.material = 0;
      else if (shadow.includes('main')) tokens.material = 3;
      else if (shadow.includes('1f')) tokens.material = 5;
      else if (shadow.includes('2f')) tokens.material = 6;
      else if (shadow.includes('3f')) tokens.material = 7;
      else if (shadow.includes('4f')) tokens.material = 8;
      else if (shadow.includes('5f')) tokens.material = 10;
    }
  }
  
  // 处理颜色相关
  if (styles.color || styles.backgroundColor) {
    // 尝试从样式中提取主题色
    const colorValue = styles.color || styles.backgroundColor;
    if (typeof colorValue === 'string' && colorValue.startsWith('#')) {
      tokens.color = colorValue;
    } else if (typeof colorValue === 'string') {
      // 如果是token引用，尝试映射回颜色值
      if (colorValue.includes('primary')) {
        tokens.color = "#2563eb";
      } else if (colorValue.includes('secondary')) {
        tokens.color = "#9333ea";
      } else if (colorValue.includes('success')) {
        tokens.color = "#22c55e";
      } else if (colorValue.includes('warning')) {
        tokens.color = "#f59e0b";
      } else if (colorValue.includes('error')) {
        tokens.color = "#ef4444";
      }
    }
  }
  
  return tokens;
}

// 导出主要接口
export default {
  RL_ACTIONS,
  ActionConflictResolver,
  RLStyleEnvironment,
  DESIGN_TOKEN_MAPPING,
  ACTION_INTENSITY_MAP,
  convertActionResultsToTokens
};

/**
 * 使用示例:
 * 
 * // 创建环境
 * const env = new RLStyleEnvironment({
 *   fontSize: 'medium',
 *   borderRadius: 'small',
 *   padding: 'base',
 *   backgroundColor: 'surface.grey1'
 * });
 * 
 * // 执行单个动作
 * const result1 = env.step('increaseRoundness', 0.7);
 * const result2 = env.step('applySuccessState', 0.8);
 * const result3 = env.step('makeExtremeRounded', 0.9); // 使用新的极致圆角
 * 
 * // 批量执行动作 - 状态指示组合
 * const result4 = env.stepBatch([
 *   { name: 'enhanceVisualStrength', intensity: 0.8 },
 *   { name: 'applyErrorState', intensity: 0.6 },
 *   { name: 'addMicroInteractions', intensity: 0.7 }
 * ]);
 * 
 * // 自适应设计组合
 * const result5 = env.stepBatch([
 *   { name: 'adaptToContext', intensity: 0.7 },
 *   { name: 'responsiveScale', intensity: 0.5 },
 *   { name: 'enhanceAccessibility', intensity: 0.8 }
 * ]);
 * 
 * // 获取当前样式状态
 * const currentState = env.getState();
 * 
 * // 检查动作冲突
 * const conflicts = env.conflictResolver.detectConflicts('applySuccessState');
 * console.log('冲突的动作:', conflicts); // 可能显示 ['applyErrorState', 'applyWarningState']
 * 
 * // 使用新的状态颜色
 * const disableResult = env.step('applyDisableState', 0.5); // 使用disable颜色系统
 * const warningResult = env.step('applyWarningState', 0.7); // 使用warning颜色系统
 */

/**
 * 从特定元件配置中提取CSS属性对应的token值作为基准值
 * @param {Object} elementConfig - 元件配置对象（如 text.normal, button.primary）
 * @returns {Object} 提取的基准token映射
 */
function extractTokensFromElementConfig(elementConfig) {
  const baseTokens = {};
  
  if (!elementConfig || typeof elementConfig !== 'object') {
    return baseTokens;
  }
  
  // 遍历配置中的所有样式属性
  Object.entries(elementConfig).forEach(([cssProperty, value]) => {
    if (typeof value === 'string') {
      if (value.startsWith('{') && value.endsWith('}')) {
        // 这是一个token引用，提取实际的token
        const tokenPath = value.slice(1, -1); // 去掉大括号
        const [category, subcategory, level] = tokenPath.split('.');
        
        if (category && subcategory && level) {
          // 映射CSS属性到对应的token
          baseTokens[cssProperty] = value;
          
          // 同时建立逆向索引，方便按token类型查找
          if (!baseTokens._tokens) baseTokens._tokens = {};
          if (!baseTokens._tokens[category]) baseTokens._tokens[category] = {};
          if (!baseTokens._tokens[category][subcategory]) baseTokens._tokens[category][subcategory] = {};
          baseTokens._tokens[category][subcategory][level] = {
            cssProperty,
            tokenValue: value
          };
        }
      } else {
        // 🔧 新增：对于非token的直接CSS值，也添加到baseTokens中
        // 这样动作系统能够正确检测对这些属性的影响
        baseTokens[cssProperty] = value;
      }
    } else if (typeof value === 'number') {
      // 🔧 新增：对于数值类型的CSS属性，也添加到baseTokens中
      baseTokens[cssProperty] = value;
    }
  });
  
  return baseTokens;
}

/**
 * 从styleConfig中获取特定元件类型和形态的基准token值
 * @param {Object} styleConfig - 样式配置对象
 * @param {string} elementType - 元件类型 (text, button, image, table, etc.)
 * @param {string} variant - 变体名称 (normal, primary, h1, h2, etc.)
 * @returns {Object} 该元件形态的基准token值和元数据
 */
export function getElementBaseTokens(styleConfig, elementType = 'text', variant = 'normal') {
  
  const elementConfig = styleConfig[elementType];
  if (!elementConfig) {
    console.warn(`未找到元件类型 ${elementType} 的配置`);
    return { 
      baseTokens: {},
      metadata: { elementType, variant, _configFound: false }
    };
  }
  
  const variantConfig = elementConfig[variant];
  if (!variantConfig) {
    console.warn(`未找到元件类型 ${elementType} 的变体 ${variant}`);
    // 回退到第一个可用变体
    const availableVariants = Object.keys(elementConfig);
    console.log(`可用变体: ${availableVariants.join(', ')}`);
    
    if (availableVariants.length > 0) {
      const fallbackVariant = availableVariants[0];
      console.log(`回退到变体: ${fallbackVariant}`);
      return getElementBaseTokens(styleConfig, elementType, fallbackVariant);
    }
    return { 
      baseTokens: {},
      metadata: { elementType, variant, _configFound: false }
    };
  }
  
  // 从变体配置中提取基准tokens
  const baseTokens = extractTokensFromElementConfig(variantConfig);
  
  // 分离元数据，不混入到基准样式中
  const metadata = {
    elementType,
    variant,
    _configFound: true
  };
  
//   console.log(`✅ 成功提取 ${elementType}.${variant} 的基准tokens:`, Object.keys(baseTokens).filter(k => !k.startsWith('_')));
  
  // 对于layout元素，特别标注其层级
  if (elementType === 'layout') {
    console.log(`   🏗️ Layout层级: ${variant} (${variant === 'root' ? '根布局' : '内部布局'})`);
  }
  
  return { baseTokens, metadata };
}

/**
 * 获取所有可用的元件类型和形态
 * @param {Object} styleConfig - 样式配置对象
 * @returns {Object} 元件类型和形态的映射
 */
export function getAvailableElementTypes(styleConfig) {
  const elementTypes = {};
  
  Object.entries(styleConfig).forEach(([elementType, elementConfig]) => {
    if (elementConfig && typeof elementConfig === 'object') {
      elementTypes[elementType] = Object.keys(elementConfig);
    }
  });
  
  return elementTypes;
}

/**
 * 动作系统管理器 - 封装所有动作相关的操作
 */
export class ActionSystemManager {
  constructor(styleConfig) {
    this.styleConfig = styleConfig;
    this.environments = new Map(); // 存储不同元件类型的环境
    this.availableElements = this.getAvailableElements();
    console.log('动作系统管理器创建完成');
    console.log('可用元件类型:', Object.keys(this.availableElements));
  }
  
  /**
   * 获取可用的元件类型和形态
   */
  getAvailableElements() {
    return getAvailableElementTypes(this.styleConfig);
  }
  
  /**
   * 为特定元件类型和形态创建或获取环境
   * @param {string} elementType - 元件类型
   * @param {string} variant - 变体名称
   * @returns {RLStyleEnvironment} RL环境实例
   */
  getOrCreateEnvironment(elementType = 'text', variant = 'normal') {
    const envKey = `${elementType}.${variant}`;
    
    if (!this.environments.has(envKey)) {
      console.log(`🔧 为 ${envKey} 创建新的动作环境`);
      
      // 获取该元件形态的基准tokens和元数据
      const { baseTokens, metadata } = getElementBaseTokens(this.styleConfig, elementType, variant);
      
      if (!metadata._configFound) {
        console.warn(`无法为 ${envKey} 创建环境：配置未找到`);
        return null;
      }
      
      // 创建专用的RL环境，分离传递基准样式和元数据
      const environment = new RLStyleEnvironment(baseTokens, metadata);
      this.environments.set(envKey, environment);
      
      console.log(`✅ ${envKey} 环境创建成功，基准tokens:`, Object.keys(baseTokens));
      console.log(`   📋 元数据:`, metadata);
    }
    
    return this.environments.get(envKey);
  }
  
  /**
   * 执行单个动作
   * @param {string} actionName - 动作名称
   * @param {number} intensity - 动作强度 (0-1)
   * @param {string} elementType - 元件类型
   * @param {string} variant - 变体名称
   * @returns {Object} 执行结果
   */
  executeAction(actionName, intensity = 0.5, elementType = 'text', variant = 'normal') {
    const environment = this.getOrCreateEnvironment(elementType, variant);
    
    if (!environment) {
      return {
        success: false,
        error: `无法为 ${elementType}.${variant} 创建动作环境`,
        message: '元件类型或变体不存在'
      };
    }
    
    const result = environment.step(actionName, intensity);
    result.elementContext = { elementType, variant };
    
    return result;
  }
  
  /**
   * 批量执行动作
   * @param {Array} actions - 动作列表 [{name, intensity}, ...]
   * @param {string} elementType - 元件类型
   * @param {string} variant - 变体名称
   * @returns {Object} 执行结果
   */
  executeActions(actions, elementType = 'text', variant = 'normal') {
    if (!Array.isArray(actions) || actions.length === 0) {
      return {
        success: false,
        error: '动作列表无效',
        message: '请提供有效的动作列表'
      };
    }
    
    const environment = this.getOrCreateEnvironment(elementType, variant);
    
    if (!environment) {
      return {
        success: false,
        error: `无法为 ${elementType}.${variant} 创建动作环境`,
        message: '元件类型或变体不存在'
      };
    }
    
    const result = environment.stepBatch(actions);
    result.elementContext = { elementType, variant };
    
    return result;
  }
  
  /**
   * 重置特定元件的动作环境
   * @param {string} elementType - 元件类型
   * @param {string} variant - 变体名称
   */
  resetEnvironment(elementType = 'text', variant = 'normal') {
    const envKey = `${elementType}.${variant}`;
    const environment = this.environments.get(envKey);
    
    if (environment) {
      environment.reset();
      console.log(`🔄 已重置 ${envKey} 的动作环境`);
    }
  }
  
  /**
   * 重置所有环境
   */
  resetAllEnvironments() {
    this.environments.forEach((env, key) => {
      env.reset();
      console.log(`🔄 已重置 ${key} 的动作环境`);
    });
  }
  
  /**
   * 获取特定元件的当前状态
   * @param {string} elementType - 元件类型
   * @param {string} variant - 变体名称
   */
  getCurrentState(elementType = 'text', variant = 'normal') {
    const environment = this.getOrCreateEnvironment(elementType, variant);
    
    if (!environment) {
      return null;
    }
    
    const state = environment.getState();
    state.elementContext = { elementType, variant };
    
    return state;
  }
  
  /**
   * 获取可用动作列表
   */
  getAvailableActions() {
    // 🔧 过滤掉废弃的构图动作
    return Object.keys(RL_ACTIONS).filter(actionName => {
      const action = RL_ACTIONS[actionName];
      return action.category !== 'composition'; // 排除构图动作
    });
  }
  
  /**
   * 获取动作信息
   * @param {string} actionName - 动作名称
   */
  getActionInfo(actionName) {
    return RL_ACTIONS[actionName] || null;
  }
  
  /**
   * 获取动作分类
   */
  getActionCategories() {
    const categories = {};
    Object.entries(RL_ACTIONS).forEach(([actionName, action]) => {
      // 🔧 过滤掉废弃的构图动作类别
      if (action.category === 'composition') {
        return; // 跳过构图动作，因为已被新的布局调控系统替代
      }
      
      if (!categories[action.category]) {
        categories[action.category] = [];
      }
      categories[action.category].push(actionName);
    });
    return categories;
  }
  
  /**
   * 检查动作冲突
   * @param {string} actionName - 动作名称
   * @param {Array} selectedActions - 已选择的动作列表
   */
  checkActionConflicts(actionName, selectedActions = []) {
    const action = RL_ACTIONS[actionName];
    if (!action?.conflicts) return [];
    
    return action.conflicts.filter(conflictAction => 
      selectedActions.includes(conflictAction)
    );
  }
  
  /**
   * 将动作结果转换为兼容token格式
   * @param {Object} actionResult - 动作执行结果
   */
  convertToTokens(actionResult) {
    return convertActionResultsToTokens(actionResult);
  }
  
  /**
   * 获取特定元件的基准token信息
   * @param {string} elementType - 元件类型
   * @param {string} variant - 变体名称
   */
  getBaseTokens(elementType = 'text', variant = 'normal') {
    const { baseTokens, metadata } = getElementBaseTokens(this.styleConfig, elementType, variant);
    return { baseTokens, metadata };
  }
  
  /**
   * 获取所有已创建的环境信息
   */
  getAllEnvironments() {
    const envInfo = {};
    this.environments.forEach((env, key) => {
      envInfo[key] = {
        baseTokens: env.baseStyles, // 仅包含CSS样式属性
        metadata: env.metadata, // 分离的元数据
        currentState: env.getState()
      };
    });
    return envInfo;
  }
  
  /**
   * 清除特定环境
   * @param {string} elementType - 元件类型
   * @param {string} variant - 变体名称
   */
  clearEnvironment(elementType, variant) {
    const envKey = `${elementType}.${variant}`;
    if (this.environments.has(envKey)) {
      this.environments.delete(envKey);
      console.log(`🗑️ 已清除 ${envKey} 的动作环境`);
    }
  }
  
  /**
   * 清除所有环境
   */
  clearAllEnvironments() {
    this.environments.clear();
    console.log('🗑️ 已清除所有动作环境');
  }
}

/**
 * 创建动作系统管理器的工厂函数
 * @param {Object} styleConfig - 样式配置对象
 * @returns {ActionSystemManager} 动作系统管理器实例
 */
export function createActionSystemManager(styleConfig) {
  return new ActionSystemManager(styleConfig);
}