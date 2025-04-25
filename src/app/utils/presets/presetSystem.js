/**
 * 预设系统 - 用于管理和应用UI组件预设
 * 
 * 该系统允许：
 * 1. 注册和管理设计令牌（colors, spacing等）
 * 2. 注册预设配置
 * 3. 应用预设到元素样式
 * 4. 处理变量插值，如 {{colors.primary}}
 */

import resolveToken, { 
  resolveTokensInText, 
  isTokenReference, 
  convertStyle,
  containsTokenReferences
} from '../tokens/resolveToken.js';

// 预设状态常量
const PRESET_STATES = {
  DEFAULT: 'default',
  HOVER: 'hover',
  ACTIVE: 'active',
  FOCUS: 'focus',
  DISABLED: 'disabled'
};

class PresetSystem {
  constructor() {
    this.presets = {};
    this.designTokens = {};
    this.elementPresets = {
      // 基础元件类型
      container: {},
      button: {},
      text: {},
      image: {},
      input: {},
      card: {},
      grid: {}
    };
  }

  /**
   * 注册设计令牌（全局变量）
   * @param {Object} tokens 设计令牌对象
   */
  registerTokens(tokens) {
    this.designTokens = { ...this.designTokens, ...tokens };
  }

  /**
   * 注册一个预设
   * @param {string} name 预设名称
   * @param {Object} preset 预设配置
   */
  registerPreset(name, preset) {
    this.presets[name] = preset;
  }

  /**
   * 为特定元素类型注册预设分类
   * @param {string} elementType 元素类型
   * @param {string} category 预设分类
   * @param {Array} presets 预设列表
   */
  registerElementPresets(elementType, category, presets) {
    if (!this.elementPresets[elementType]) {
      this.elementPresets[elementType] = {};
    }
    
    this.elementPresets[elementType][category] = presets;
  }
  
  /**
   * 获取元素类型的可用预设分类
   * @param {string} elementType 元素类型
   * @returns {Object} 预设分类及其预设列表
   */
  getAvailablePresets(elementType) {
    const presetCategories = this.elementPresets[elementType] || {};
    const result = {};
    
    // 遍历每个预设分类
    for (const [category, presetKeys] of Object.entries(presetCategories)) {
      result[category] = {};
      
      // 遍历分类中的每个预设键
      if (Array.isArray(presetKeys)) {
        presetKeys.forEach(presetKey => {
          // 查找预设的完整对象，以便获取name和description
          const presetObject = this.findPresetByName(presetKey);
          if (presetObject) {
            // 添加到结果中，包含预设的名称和描述
            result[category][presetKey] = {
              name: presetObject.name || presetKey,
              description: presetObject.description || '',
              defaultStyle: presetObject.states?.[PRESET_STATES.DEFAULT] || {}
            };
          }
        });
      }
    }
    
    return result;
  }

  /**
   * 根据名称查找预设
   * @param {string} name 预设名称
   * @returns {Object|null} 预设对象或null
   */
  findPresetByName(name) {
    return this.presets[name] || null;
  }

  /**
   * 解析变量引用，例如 {{colors.primary}}
   * @param {string} value 包含变量引用的字符串
   * @returns {string} 解析后的值
   */
  resolveTokenReference(value) {
    if (typeof value !== 'string') {
      return value;
    }

    // 使用标准token系统处理{color.primary.500}格式的引用
    if (isTokenReference(value)) {
      return resolveToken(value);
    }
    
    // 处理包含多个token引用的情况，例如"{token1} {token2}"
    if (containsTokenReferences(value)) {
      return resolveTokensInText(value);
    }

    // 匹配{{变量名}}格式（预设系统特有格式）
    const pattern = /\{\{([^}]+)\}\}/g;
    
    return value.replace(pattern, (match, path) => {
      // 分解路径，例如 "colors.primary" -> ["colors", "primary"]
      const parts = path.trim().split('.');
      
      // 从designTokens中获取值
      let result = this.designTokens;
      for (const part of parts) {
        if (!result || result[part] === undefined) {
          console.warn(`Token reference not found: ${path}`);
          return match; // 保留原始引用
        }
        result = result[part];
      }
      
      return result;
    });
  }

  /**
   * 处理对象中的所有变量引用
   * @param {Object} obj 包含变量引用的对象
   * @returns {Object} 解析后的对象
   */
  resolveTokensInObject(obj) {
    if (!obj || typeof obj !== 'object') {
      return obj;
    }

    // 首先使用convertStyle处理标准token引用和包含多个token的字符串引用
    const processedObj = convertStyle(obj);
    
    const result = Array.isArray(processedObj) ? [] : {};

    // 然后处理预设系统特有的 {{}} 格式引用
    for (const [key, value] of Object.entries(processedObj)) {
      if (typeof value === 'object' && value !== null) {
        // 递归处理嵌套对象
        result[key] = this.resolveTokensInObject(value);
      } else if (typeof value === 'string' && value.includes('{{')) {
        // 只处理包含{{}}格式的字符串，其他token格式已由convertStyle处理
        result[key] = this.resolveTokenReference(value);
      } else {
        // 保持原值
        result[key] = value;
      }
    }

    return result;
  }

  /**
   * 获取预设的样式对象
   * @param {Object} preset 预设对象
   * @param {string} state 状态名称 (default, hover, active, etc.)
   * @returns {Object} 样式对象
   */
  getPresetStyles(preset, state = PRESET_STATES.DEFAULT) {
    if (!preset || !preset.states) {
      return {};
    }

    // 获取指定状态的样式，如果不存在则使用默认状态
    const styles = preset.states[state] || preset.states[PRESET_STATES.DEFAULT] || {};
    
    // 解析样式中的变量引用
    return this.resolveTokensInObject(styles);
  }

  /**
   * 应用多个预设，并与基础样式合并
   * @param {Array} presets 预设对象数组
   * @param {Object} baseStyles 基础样式对象
   * @param {boolean} resolveTokens 是否解析设计令牌引用
   * @param {string} state 要应用的状态
   * @returns {Object} 合并后的样式对象
   */
  applyPresets(presets = [], baseStyles = {}, resolveTokens = true, state = PRESET_STATES.DEFAULT) {
    // 确保presets是数组且过滤掉无效项
    const validPresets = Array.isArray(presets) ? presets.filter(Boolean) : [];
    
    // 从所有预设中收集样式
    const presetStyles = validPresets.reduce((styles, preset) => {
      const presetStyle = this.getPresetStyles(preset, state);
      return { ...styles, ...presetStyle };
    }, {});
    
    // 合并预设样式和基础样式（基础样式优先级更高）
    const mergedStyles = { ...presetStyles, ...baseStyles };
    
    // 解析设计令牌引用
    return resolveTokens ? this.resolveTokensInObject(mergedStyles) : mergedStyles;
  }

  /**
   * 为元素应用所有预设和样式
   * @param {Object} element 元素对象
   * @param {string} state 要应用的状态
   * @returns {Object} 处理后的元素对象
   */
  processElement(element, state = PRESET_STATES.DEFAULT) {
    if (!element) return element;

    // 获取元素的预设名称数组
    const presetNames = element.presets || [];
    
    // 查找并收集所有预设对象
    const presets = presetNames
      .map(name => this.findPresetByName(name))
      .filter(Boolean); // 过滤掉未找到的预设
    
    // 应用所有预设和基础样式
    const styles = this.applyPresets(
      presets,
      element.style || {},
      true,
      state
    );
    
    // 返回处理后的元素对象
    return {
      ...element,
      styles,
      appliedPresets: presetNames
    };
  }
  
  /**
   * 将单个预设应用到布局元素（用于动作执行系统）
   * @param {Object} layout - 整个布局对象
   * @param {string} elementId - 要应用预设的元素ID
   * @param {string} presetCategory - 预设类别
   * @param {string} presetKey - 预设键名
   * @returns {Object} 更新后的布局对象
   */
  applyPresetToElement(layout, elementId, presetCategory, presetKey) {
    if (!layout || !elementId || !presetCategory || !presetKey) {
      console.error('应用预设失败：缺少必要参数', { layout, elementId, presetCategory, presetKey });
      return layout;
    }
    
    // 创建一个新的布局对象副本，不修改原始对象
    const newLayout = JSON.parse(JSON.stringify(layout));
    
    // 查找元素
    const findElement = (node) => {
      if (!node) return null;
      if (node.id === elementId) return node;
      if (node.children) {
        for (const child of node.children) {
          const found = findElement(child);
          if (found) return found;
        }
      }
      return null;
    };
    
    // 在布局中找到目标元素
    const element = findElement(newLayout);
    if (!element) {
      console.error(`找不到ID为 ${elementId} 的元素`);
      return layout;
    }
    
    // 构建完整的预设名称
    const presetName = `${presetCategory}:${presetKey}`;
    
    // 确保元素有presets数组
    if (!element.presets) {
      element.presets = [];
    }
    
    // 检查预设是否已应用
    if (!element.presets.includes(presetName)) {
      // 添加新预设
      element.presets.push(presetName);
      console.log(`预设 ${presetName} 已应用到元素 ${elementId}`);
    } else {
      console.log(`预设 ${presetName} 已经应用在元素 ${elementId} 上了`);
    }
    
    return newLayout;
  }
}

const presetSystem = new PresetSystem();

/**
 * 为元素合并预设样式
 * @param {Object} element - 要合并预设的元素
 * @returns {Object} 合并了预设样式的元素
 */
function mergeElementPresets(element) {
  if (!element || !element.presets || !Array.isArray(element.presets) || element.presets.length === 0) {
    return element.style || {};
  }
  
  // 查找并收集所有预设对象
  const presets = element.presets
    .map(name => presetSystem.findPresetByName(name))
    .filter(Boolean); // 过滤掉未找到的预设
  
  // 应用所有预设和基础样式
  return presetSystem.applyPresets(
    presets, 
    element.style || {}, 
    true, 
    PRESET_STATES.DEFAULT
  );
}

/**
 * 将单个预设应用到布局中的元素
 * @param {Object} layout - 整个布局对象
 * @param {string} elementId - 要应用预设的元素ID
 * @param {string} presetCategory - 预设类别
 * @param {string} presetKey - 预设键名
 * @returns {Object} 更新后的布局对象
 */
function applyPresetToElement(layout, elementId, presetCategory, presetKey) {
  return presetSystem.applyPresetToElement(layout, elementId, presetCategory, presetKey);
}

// 导出预设系统实例和常量
export default presetSystem;
export { PRESET_STATES, mergeElementPresets, applyPresetToElement };
export const getAvailablePresets = (elementType) => presetSystem.getAvailablePresets(elementType);
