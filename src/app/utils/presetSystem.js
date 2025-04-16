'use client';

/**
 * 预设系统 - 支持多类别预设组合与完全基于设计令牌的配置
 * 
 * 该系统将预设分为不同类别:
 * - Typography (排版): 控制字体大小、粗细、行高等文本属性
 * - Appearance (外观): 控制颜色、边框、圆角、阴影等视觉属性
 * - Spacing (间距): 控制内外边距、间隙等空间属性
 * - Layout (布局): 控制对齐方式、尺寸调整模式等布局属性
 * 
 * 每个元素可以同时应用多个不同类别的预设
 */

// 从JSON文件引入通用预设
import sizePresets from './size_presets.json';
import layoutPresets from './layout_presets.json';
import selfAlignPresets from './self_align_presets.json';
import flexRatioPresets from './flex_ratio_presets.json';
import imageProportionPresets from './image_proportion_presets.json';
import textAlignPresets from './text_align_presets.json';

// 从JSON文件引入元素专用预设
import appearancePresets from './appearance_presets.json';
import typographyPresets from './typography_presets.json';
import spacingPresets from './spacing_presets.json';

// 文本元素专用预设
import textAppearancePresets from './text_appearance_presets.json';

// 按钮元素专用预设
import buttonAppearancePresets from './button_appearance_presets.json';
import buttonSizePresets from './button_size_presets.json';
import buttonTypographyPresets from './button_typography_presets.json';
import buttonSpacingPresets from './button_spacing_presets.json';

// 容器元素专用预设
import containerAppearancePresets from './container_appearance_presets.json';

// 输入框元素专用预设
import inputAppearancePresets from './input_appearance_presets.json';
import inputTypographyPresets from './input_typography_presets.json';
import inputSpacingPresets from './input_spacing_presets.json';

// 图标元素专用预设
import iconAppearancePresets from './icon_appearance_presets.json';
import iconSpacingPresets from './icon_spacing_presets.json';

// 图片元素专用预设
import imageAppearancePresets from './image_appearance_presets.json';

// 分割线元素专用预设
import dividerAppearancePresets from './divider_appearance_presets.json';
import dividerSpacingPresets from './divider_spacing_presets.json';

// 各元素类型的默认组合预设 - 使用元素专用的预设文件
const elementPresets = {
  'text': {
    // 文本元素适合的预设
    selfAlign: selfAlignPresets,  // 元素自身对齐预设
    size: sizePresets,            // 尺寸预设
    textAlign: textAlignPresets,  // 文本对齐预设
    typography: typographyPresets, // 排版预设
    appearance: textAppearancePresets, // 文本专用外观预设
    spacing: spacingPresets
  },
  
  'button': {
    // 按钮元素适合的预设
    selfAlign: selfAlignPresets,      // 元素自身对齐预设
    buttonSize: buttonSizePresets,    // 按钮专用尺寸预设(已包含按钮尺寸控制)
    appearance: buttonAppearancePresets, // 按钮专用外观预设
    typography: buttonTypographyPresets, // 按钮专用排版预设
    spacing: buttonSpacingPresets // 按钮专用间距预设
  },
  
  'container': {
    // 容器元素是唯一需要完整布局预设的元素
    layout: layoutPresets,       // 布局方向、对齐方式等
    flexRatio: flexRatioPresets, // Flex比例预设
    size: sizePresets,           // 尺寸预设
    appearance: containerAppearancePresets, // 容器专用外观预设
    spacing: spacingPresets
  },
  
  'input': {
    appearance: inputAppearancePresets, // 输入框专用外观预设
    typography: inputTypographyPresets, // 输入框专用排版预设
    spacing: inputSpacingPresets // 输入框专用间距预设
  },
  
  'icon': {
    appearance: iconAppearancePresets, // 图标专用外观预设
    spacing: iconSpacingPresets // 图标专用间距预设
  },
  
  'image': {
    // 图片元素适合的预设
    selfAlign: selfAlignPresets,        // 元素自身对齐预设
    size: sizePresets,                  // 尺寸预设
    imageProportion: imageProportionPresets, // 图片比例预设
    appearance: imageAppearancePresets // 图片专用外观预设
  },
  
  'divider': {
    appearance: dividerAppearancePresets, // 分割线专用外观预设
    spacing: dividerSpacingPresets // 分割线专用间距预设
  }
};

/**
 * 合并多个预设样式 - 支持单个预设键或预设数组
 * @param {Object} element - 元素对象
 * @param {Object} presets - 预设定义对象
 * @returns {Object} - 合并后的样式对象
 */
export const mergeElementPresets = (element, presets) => {
  if (!element || !element.type) return {};
  
  const elementPresetCategories = elementPresets[element.type];
  if (!elementPresetCategories) return {};
  
  let mergedStyle = {};
  
  // 定义预设应用顺序 - 确保特定类型的预设按照正确的顺序应用
  // 这个顺序很重要：后面的预设会覆盖前面预设中相同的属性
  const categoryOrder = [
    'layout',           // 容器布局方向应该最先应用
    'flexRatio',        // 元素在Flex布局中的伸缩比例
    'size',             // 尺寸预设
    'buttonSize',       // 按钮专用尺寸
    'imageProportion',  // 图片比例预设
    'selfAlign',        // 元素自身在父容器中的对齐方式
    'textAlign',        // 文本对齐
    'spacing',          // 间距
    'typography',       // 排版
    'appearance'        // 最后是外观（颜色、边框等）
  ];
  
  // 按照定义的顺序处理每个预设类别
  for (const category of categoryOrder) {
    if (!elementPresetCategories[category]) continue;
    
    // 支持单个预设键或预设数组
    const presetKeys = element[`${category}Preset`];
    
    // 如果是单个预设键
    if (typeof presetKeys === 'string' && elementPresetCategories[category][presetKeys]) {
      const presetStyle = elementPresetCategories[category][presetKeys].defaultStyle;
      // 合并样式
      mergedStyle = { ...mergedStyle, ...presetStyle };
      console.log(`应用${category}预设: ${presetKeys}`);
    }
    // 如果是预设数组
    else if (Array.isArray(presetKeys)) {
      for (const key of presetKeys) {
        if (elementPresetCategories[category][key]) {
          const presetStyle = elementPresetCategories[category][key].defaultStyle;
          // 合并样式，数组中后面的预设会覆盖前面预设的相同属性
          mergedStyle = { ...mergedStyle, ...presetStyle };
          console.log(`应用${category}预设数组: ${key}`);
        }
      }
    }
  }
  
  return mergedStyle;
};

/**
 * 获取元素类型可用的预设类别
 * @param {string} elementType - 元素类型
 * @returns {Object} - 每个预设类别的可用预设
 */
export const getAvailablePresets = (elementType) => {
  if (!elementType || !elementPresets[elementType]) {
    return {};
  }
  
  return elementPresets[elementType];
};

/**
 * 应用预设到元素 - 支持单个预设键或添加到预设数组
 * @param {Object} element - 要应用预设的元素
 * @param {string} category - 预设类别 (typography, appearance, spacing, layout, textAlign)
 * @param {string} presetKey - 预设键名
 * @param {boolean} [asArray=false] - 是否作为数组添加(不覆盖现有预设)
 * @returns {Object} - 应用预设后的新元素
 */
export const applyPresetToElement = (element, category, presetKey, asArray = false) => {
  if (!element || !element.type) return element;
  
  const availablePresets = getAvailablePresets(element.type);
  if (!availablePresets[category] || !availablePresets[category][presetKey]) {
    return element;
  }
  
  // 创建新元素并应用预设
  const newElement = { ...element };
  
  // 如果以数组模式添加预设
  if (asArray) {
    const currentPresets = Array.isArray(newElement[`${category}Preset`])
      ? [...newElement[`${category}Preset`]]
      : newElement[`${category}Preset`] ? [newElement[`${category}Preset`]] : [];
    
    // 避免重复添加相同的预设
    if (!currentPresets.includes(presetKey)) {
      currentPresets.push(presetKey);
    }
    
    newElement[`${category}Preset`] = currentPresets;
    console.log(`向${category}预设数组添加: ${presetKey}, 当前预设: ${currentPresets.join(', ')}`);
  } else {
    // 单个预设模式 - 直接替换
    newElement[`${category}Preset`] = presetKey;
    console.log(`设置${category}预设: ${presetKey}`);
  }
  
  // 获取预设样式
  const presetStyle = availablePresets[category][presetKey].defaultStyle;
  
  // 创建或更新样式对象
  if (!newElement.style) newElement.style = {};
  
  // 应用预设样式（保留令牌引用）并记录应用的预设
  for (const [key, value] of Object.entries(presetStyle)) {
    // 处理可能导致React样式冲突的快捷方式
    if (key === 'padding') {
      // 使用单独属性而不是简写方式
      newElement.style.paddingTop = value;
      newElement.style.paddingRight = value;
      newElement.style.paddingBottom = value;
      newElement.style.paddingLeft = value;
      console.log(`应用预设 ${category}:${presetKey} - 将padding=${value}拆分为独立属性`);
    }
    else if (key === 'margin') {
      // 使用单独属性而不是简写方式
      newElement.style.marginTop = value;
      newElement.style.marginRight = value;
      newElement.style.marginBottom = value;
      newElement.style.marginLeft = value;
      console.log(`应用预设 ${category}:${presetKey} - 将margin=${value}拆分为独立属性`);
    }
    else {
      // 其他属性正常应用
      newElement.style[key] = value;
      console.log(`应用预设 ${category}:${presetKey} - 设置 ${key}=${value}`);
    }
  }
  
  return newElement;
};

// 扩展的设计令牌
export const extendedDesignTokens = {
  color: {
    primary: {
      lightest: '#E3F2FD',
      lighter: '#BBDEFB',
      light: '#64B5F6',
      base: '#2196F3',
      dark: '#1976D2',
      darker: '#0D47A1',
      contrast: '#FFFFFF'
    },
    secondary: {
      lightest: '#F3E5F5',
      lighter: '#E1BEE7',
      light: '#BA68C8',
      base: '#9C27B0',
      dark: '#7B1FA2',
      darker: '#4A148C',
      contrast: '#FFFFFF'
    },
    neutral: {
      white: '#FFFFFF',
      lighter: '#F5F5F5',
      light: '#E0E0E0',
      base: '#9E9E9E',
      dark: '#616161',
      darker: '#212121',
      darkest: '#000000'
    },
    success: {
      light: '#A5D6A7',
      base: '#4CAF50',
      dark: '#2E7D32',
      contrast: '#FFFFFF'
    },
    warning: {
      light: '#FFE082',
      base: '#FFC107',
      dark: '#F57F17',
      contrast: '#000000'
    },
    error: {
      light: '#EF9A9A',
      base: '#F44336',
      dark: '#C62828',
      contrast: '#FFFFFF'
    }
  },
  material: {
    none: 'none',
    light: '0 2px 4px rgba(0,0,0,0.1)',
    main: '0 4px 8px rgba(0,0,0,0.1)',
    card: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    elevated: '0 8px 16px rgba(0,0,0,0.12), 0 8px 8px rgba(0,0,0,0.08)',
    ground: '0 -2px 10px rgba(0,0,0,0.1)',
    heavy: '0 16px 24px rgba(0,0,0,0.16), 0 8px 16px rgba(0,0,0,0.12)'
  }
};

export default elementPresets;