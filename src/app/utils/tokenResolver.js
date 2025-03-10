'use client';
import designTokens from './token';

/**
 * 解析设计令牌值
 * 将形如 {token.path} 的字符串转换为实际值
 * @param {any} value - 要解析的值
 * @returns {any} - 解析后的值
 */
export const resolveToken = (value) => {
  if (typeof value !== 'string' || !value.startsWith('{') || !value.endsWith('}')) {
    return value;
  }

  const path = value.slice(1, -1).split('.');
  let result = designTokens;
  for (const key of path) {
    result = result[key];
    if (result === undefined) return value;
  }
  return result;
};

/**
 * 将样式对象中的所有令牌值解析为实际值
 * @param {Object} style - 样式对象
 * @returns {Object} - 解析后的样式对象
 */
export const convertStyle = (style) => {
  if (!style) return {};
  
  const result = {};
  for (const [key, value] of Object.entries(style)) {
    result[key] = resolveToken(value);
  }
  return result;
};

/**
 * 处理样式属性值，统一处理数值、单位、令牌等
 * @param {any} value - 输入的样式值
 * @param {string} unit - 默认单位，例如 'px'
 * @param {any} defaultValue - 当值为 null/undefined 时使用的默认值
 * @returns {string|number} - 处理后的样式值
 */
export const processStyleValue = (value, unit = 'px', defaultValue = '') => {
  // 处理 null 或 undefined
  if (value == null) {
    return defaultValue;
  }
  
  // 处理令牌
  const resolvedValue = resolveToken(value);
  
  // 处理数字类型，添加单位
  if (typeof resolvedValue === 'number') {
    return `${resolvedValue}${unit}`;
  }
  
  // 返回其他类型值
  return resolvedValue;
};

/**
 * 合并两个样式值，如果主值存在则使用主值，否则使用备用值
 * @param {any} primary - 主要样式值
 * @param {any} fallback - 备用样式值
 * @param {string} unit - 默认单位，例如 'px'
 * @param {any} defaultValue - 当值都不存在时使用的默认值
 * @returns {string|number} - 合并后的样式值
 */
export const mergeStyleValues = (primary, fallback, unit = 'px', defaultValue = '') => {
  // 如果主值存在，处理并返回
  if (primary != null) {
    return processStyleValue(primary, unit, defaultValue);
  }
  
  // 否则处理并返回备用值
  return processStyleValue(fallback, unit, defaultValue);
};

export default {
  resolveToken,
  convertStyle,
  processStyleValue,
  mergeStyleValues
};