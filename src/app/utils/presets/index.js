/**
 * 预设系统索引 - 导出所有预设和工具
 */

import presetSystem, { PRESET_STATES, getAvailablePresets } from './presetSystem.js';
import alignmentPresets from './alignmentPreset.js';
import elementRenderer from './elementRenderer.js';
import resolveToken, { resolveTokensInText } from '../tokens/resolveToken.js';

// 注册预设
// 导入预设配置
const presets = alignmentPresets.preset || {};

// 注册预设到系统
Object.entries(presets).forEach(([presetName, presetConfig]) => {
  // 为每个预设创建状态对象
  const presetWithStates = {
    name: presetConfig.name,
    description: presetConfig.description,
    states: {
      [PRESET_STATES.DEFAULT]: presetConfig.defaultStyle || {}
      // 后期可以添加其他状态，如hover、active等
    }
  };
  
  // 注册预设
  presetSystem.registerPreset(`alignment:${presetName}`, presetWithStates);
});

// 处理和注册通用预设到各元件类型
// 获取所有支持的元件类型
const elementTypes = Object.keys(presetSystem.elementPresets);

// 检查预设模块的 metawareType 属性，用于决定将预设注册到哪些元件类型
if (alignmentPresets.metawareType === 'all') {
  // 如果是 'all'，则将预设注册到所有元件类型
  elementTypes.forEach(elementType => {
    // 从预设对象中提取键名，创建预设键列表
    const presetKeys = Object.keys(presets).map(presetKey => `alignment:${presetKey}`);
    
    // 将对齐预设注册到每种元件类型的 'alignment' 分类下
    presetSystem.registerElementPresets(elementType, 'alignment', presetKeys);
    
    console.log(`已将对齐预设注册到 ${elementType} 类型元件`);
  });
} else if (Array.isArray(alignmentPresets.metawareType)) {
  // 如果是数组，则只注册到指定的元件类型
  alignmentPresets.metawareType.forEach(elementType => {
    if (elementTypes.includes(elementType)) {
      const presetKeys = Object.keys(presets).map(presetKey => `alignment:${presetKey}`);
      presetSystem.registerElementPresets(elementType, 'alignment', presetKeys);
      console.log(`已将对齐预设注册到 ${elementType} 类型元件`);
    }
  });
}

// 汇总所有预设系统的功能和预设
export default {
  // 预设系统核心功能
  processElement: presetSystem.processElement.bind(presetSystem),
  applyPresets: presetSystem.applyPresets.bind(presetSystem),
  findPresetByName: presetSystem.findPresetByName.bind(presetSystem),
  registerPreset: presetSystem.registerPreset.bind(presetSystem),
  registerTokens: presetSystem.registerTokens.bind(presetSystem),
  registerElementPresets: presetSystem.registerElementPresets.bind(presetSystem),
  getAvailablePresets,
  
  // 渲染器功能
  renderElement: elementRenderer.renderElement,
  stylesToCss: elementRenderer.stylesToCss,
  generateHtmlPage: elementRenderer.generateHtmlPage,
  
  // 令牌系统
  resolveToken,
  resolveTokensInText,
  
  // 预设状态常量
  states: PRESET_STATES
};

// 也直接导出关键函数，方便直接导入
export {
  getAvailablePresets,
  PRESET_STATES
}; 