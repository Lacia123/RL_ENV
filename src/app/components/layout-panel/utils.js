'use client';
import tokens from '@/app/utils/token';
import { themeSystem, resolveThemeValue } from '@/app/utils/elementDefinitions';

/**
 * 解析设计令牌值
 * 将形如 {token.path} 的字符串转换为实际值
 * @param {any} value - 要解析的值
 * @returns {any} - 解析后的值
 */
export const resolveTokenValue = (value) => {
  // 如果值不是字符串或不符合令牌格式，直接返回
  if (typeof value !== 'string' || !value.startsWith('{') || !value.endsWith('}')) {
    return value;
  }
  
  // 提取令牌路径并解析
  const path = value.slice(1, -1).split('.');
  
  // 首先尝试从 tokens 中解析
  let result = tokens;
  let found = true;
  
  for (const key of path) {
    if (!result || result[key] === undefined) {
      found = false;
      break;
    }
    result = result[key];
  }
  
  // 如果在tokens中找到，返回结果
  if (found && result !== undefined) {
    return result;
  }
  
  // 如果在tokens中没找到，尝试从theme中解析
  return resolveThemeValue(value, themeSystem.theme);
};

/**
 * 将样式对象中的令牌值解析为实际值
 * @param {Object} style - 样式对象
 * @returns {Object} - 解析后的样式对象
 */
export const resolveStyleTokens = (style) => {
  if (!style) return {};
  
  const resolvedStyle = {};
  
  for (const [key, value] of Object.entries(style)) {
    resolvedStyle[key] = resolveTokenValue(value);
  }
  
  return resolvedStyle;
};

/**
 * 用于直接在React样式对象中安全地解析令牌
 * 确保返回CSS兼容的格式，处理单位等
 * @param {string|number} value - 要解析的样式值
 * @param {string} [unit='px'] - 如果值是数字，要添加的单位
 * @returns {string|number} - CSS兼容的值
 */
export const resolveStyleValue = (value, unit = 'px') => {
  const resolved = resolveTokenValue(value);
  
  // 如果是数字且应该有单位，添加单位
  if (typeof resolved === 'number' && unit) {
    return `${resolved}${unit}`;
  }
  
  // 特殊处理某些样式属性的值
  if (resolved === 'auto' || resolved === 'none' || resolved === 'inherit' ||
      resolved === 'initial' || resolved === 'unset' || resolved === null ||
      resolved === undefined) {
    return resolved;
  }
  
  return resolved;
};

/**
 * 处理嵌套属性值设置
 * 允许使用点路径语法设置对象深层属性
 * @param {Object} obj - 要修改的对象
 * @param {string} path - 属性路径，如 'content.title'
 * @param {any} value - 要设置的值
 * @returns {Object} - 修改后的对象副本
 */
export const setNestedProperty = (obj, path, value) => {
  // 创建对象副本，避免直接修改原对象
  const result = { ...obj };
  
  if (path.includes('.')) {
    const parts = path.split('.');
    let current = result;
    
    // 遍历路径直到倒数第二部分
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      // 如果当前部分不存在，创建一个空对象
      if (!current[part] || typeof current[part] !== 'object') {
        current[part] = {};
      }
      current = current[part];
    }
    
    // 设置最后一部分的值
    const lastPart = parts[parts.length - 1];
    current[lastPart] = value;
  } else {
    // 简单属性直接设置
    result[path] = value;
  }
  
  return result;
};

export default {
  resolveTokenValue,
  resolveStyleTokens,
  resolveStyleValue,
  setNestedProperty
};