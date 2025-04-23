/**
 * Metaware 组件转 JSON 样式工具
 * 
 * 该工具用于将 metaware 组件定义转换为 React 样式对象，支持保留 token 或解析为实际值
 */

import resolveToken from '../tokens/resolveToken.js';
import buttonMeta from './button.js';
import containerMeta from './container.js';
import textMeta from './text.js';
import imageMeta from './image.js';

// 属性名映射到 React 样式属性
const PROPERTY_MAP = {
  // 颜色相关
  'bg': 'backgroundColor',
  'text': 'color',
  'hyperlinktext': '--hyperlinkColor', // 可以用作变量
  'border': 'borderColor',
  'icon_color': 'color', // 用于图标元素
  
  // 图片相关
  'image': 'backgroundImage',
  'image_size': 'backgroundSize',
  'image_position': 'backgroundPosition',
  'image_repeat': 'backgroundRepeat',
  
  // 尺寸相关
  'padding': 'padding',
  'gap': 'gap',
  'width': 'width',
  'height': 'height',
  'min_width': 'minWidth',
  'max_width': 'maxWidth',
  'min_height': 'minHeight',
  'max_height': 'maxHeight',
  
  // 形状相关
  'borderradius': 'borderRadius',
  'borderwidth': 'borderWidth',
  
  // 布局相关
  'display': 'display',
  'flex_direction': 'flexDirection',
  
  // 字体相关
  'fontsize': 'fontSize',
  
  // 阴影相关
  'elevation': 'boxShadow'
};

// 获取组件类型对应的 metaware 定义
const getMetaware = (componentType) => {
  switch (componentType.toLowerCase()) {
    case 'button':
      return buttonMeta;
    case 'container':
      return containerMeta;
    case 'text':
      return textMeta;
    case 'image':
      return imageMeta;
    default:
      throw new Error(`不支持的组件类型: ${componentType}`);
  }
};

/**
 * 从 metaware 对象中提取特定状态的属性
 * @param {Object} metaObj - 组件的 metaware 对象
 * @param {string} state - 要提取的状态，如 'default', 'hover' 等
 * @returns {Object} 提取出的属性对象
 */
const extractStateProperties = (metaObj, state = 'default') => {
  const properties = {};
  
  // 遍历所有属性组
  Object.keys(metaObj).forEach(propGroup => {
    // 检查属性组是否包含指定状态
    if (propGroup.includes(`-state-${state}`)) {
      // 将属性组中的所有属性添加到结果中
      Object.keys(metaObj[propGroup]).forEach(prop => {
        properties[prop] = metaObj[propGroup][prop];
      });
    }
  });
  
  return properties;
};

/**
 * 将 metaware 属性转换为样式对象
 * @param {string} componentType - 组件类型，如 'button', 'container' 等
 * @param {string} state - 组件状态，如 'default', 'hover' 等
 * @param {boolean} resolveTokens - 是否解析 token（默认为 true）
 * @returns {Object} 样式属性对象
 */
export const metawareToStyleObject = (componentType, state = 'default', resolveTokens = true) => {
  const metaObj = getMetaware(componentType);
  const properties = extractStateProperties(metaObj, state);
  const styleObject = {
    // 默认添加 border-box 盒模型
    boxSizing: 'border-box'
  };
  
  // 转换为样式属性
  Object.keys(properties).forEach(prop => {
    const value = properties[prop].value;
    const styleProperty = PROPERTY_MAP[prop] || prop; // 使用映射，如果没有则使用原属性名
    
    // 根据配置决定是否解析 token
    styleObject[styleProperty] = resolveTokens ? resolveToken(value) || value : value;
    
    // 特殊情况处理：边框宽度和颜色
    if (prop === 'borderwidth' && properties['border']) {
      const borderWidth = resolveTokens ? resolveToken(value) || value : value;
      const borderColor = resolveTokens 
        ? resolveToken(properties['border'].value) || properties['border'].value 
        : properties['border'].value;
      
      if (borderWidth !== '0px' && borderWidth !== 'none') {
        // 不需要合并为 border 属性，保持分离的属性更适合 React 样式对象
        styleObject['borderWidth'] = borderWidth;
        styleObject['borderColor'] = borderColor;
        styleObject['borderStyle'] = 'solid';
      }
    }
  });
  
  return styleObject;
};

/**
 * 获取组件的所有可用状态
 * @param {string} componentType - 组件类型，如 'button', 'container' 等
 * @returns {string[]} 状态名称数组
 */
export const getComponentStates = (componentType) => {
  const metaObj = getMetaware(componentType);
  const states = new Set();
  
  // 提取所有状态
  Object.keys(metaObj).forEach(propGroup => {
    const stateMatch = propGroup.match(/-state-([a-z]+)/);
    if (stateMatch && stateMatch[1]) {
      states.add(stateMatch[1]);
    }
  });
  
  return Array.from(states);
};

/**
 * 生成组件所有状态的样式对象
 * @param {string} componentType - 组件类型，如 'button', 'container' 等 
 * @param {boolean} resolveTokens - 是否解析 token（默认为 true）
 * @returns {Object} 包含所有状态样式的对象
 */
export const generateComponentStyleMap = (componentType, resolveTokens = true) => {
  const states = getComponentStates(componentType);
  const styleMap = {};
  
  // 为每个状态生成样式对象
  states.forEach(state => {
    styleMap[state] = metawareToStyleObject(componentType, state, resolveTokens);
  });
  
  return styleMap;
};

/**
 * 获取组件的CSS伪类映射
 * @returns {Object} 状态到伪类的映射
 */
export const getStateToPseudoClassMap = () => {
  return {
    'default': null,   // 默认状态没有伪类
    'hover': ':hover',
    'active': ':active',
    'focus': ':focus',
    'pressed': null,   // pressed 通常是通过 class 实现，不是伪类
    'disable': ':disabled',
    'loading': null,   // loading 通常是通过 class 实现，不是伪类
    'visited': ':visited',
    'loaded': null     // loaded 通常是通过 class 实现，不是伪类
  };
};

/**
 * 生成完整的组件样式配置
 * @param {string} componentType - 组件类型，如 'button', 'container' 等
 * @param {boolean} resolveTokens - 是否解析 token（默认为 true）
 * @returns {Object} 完整的组件样式配置
 */
export const generateComponentConfig = (componentType, resolveTokens = true) => {
  return {
    type: componentType,
    styleMap: generateComponentStyleMap(componentType, resolveTokens),
    pseudoClasses: getStateToPseudoClassMap()
  };
};

/**
 * 示例用法
 */
const example = () => {
  // 获取按钮的样式映射（解析 token）
  console.log(generateComponentStyleMap('button'));
  
  // 获取按钮的样式映射（保留 token）
  console.log(generateComponentStyleMap('button', false));
  
  // 获取按钮的完整配置
  console.log(generateComponentConfig('button'));
};

export default {
  metawareToStyleObject,
  generateComponentStyleMap,
  getComponentStates,
  getStateToPseudoClassMap,
  generateComponentConfig
}; 