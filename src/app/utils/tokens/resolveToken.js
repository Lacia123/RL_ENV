/**
 * Token 解析器 - 用于解析设计系统中的 token 引用并获取其最终值
 * 
 * 示例:
 * - 输入: "{color.border.white7}"
 * - 解析过程: 找到 color.border.white7 -> "{color.basic.opacity.white.7}" -> "#ffffff12"
 * - 输出: "#ffffff12"
 */

import colorBasic from './color/basic.js';
import colorBorder from './color/border.js';
import colorSurface from './color/surface.js';
import colorPrimary from './color/primary.js';
import colorSecondary from './color/secondary.js';
import colorTertiary from './color/tertiary.js';
import colorError from './color/error.js';
import colorSuccess from './color/success.js';
import colorWarning from './color/warning.js';
import colorLink from './color/link.js';
import colorDisable from './color/disable.js';
import colorDirection from './color/gradient/direction.js'
import colorGradient from './color/gradient/gradient.js'

import dimensionBasic from './dimension/basic.js';
import dimensionPadding from './dimension/padding.js';
import dimensionMargin from './dimension/margin.js';
import dimensionGap from './dimension/gap.js';
import dimensionBorderRadius from './dimension/borderradius.js';
import dimensionBorderWidth from './dimension/borderwidth.js';

import fontSize from './font/size.js';
import fontWeight from './font/fontweight.js';
import fontLineHeight from './font/lineheight.js';
import fontLetterSpacing from './font/letterspacing.js';

import motionDuration from './motion/duration.js';
import motionDelay from './motion/delay.js';
import motionEasingFunction from './motion/easingfunction.js';

import assetFont from './asset/font.js';

// 优化：使用深度合并函数，确保嵌套对象正确合并
function deepMerge(...objects) {
  const result = {};
  
  for (const obj of objects) {
    if (!obj) continue; // 跳过 null 或 undefined
    
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          // 如果值是对象并且不是数组，则递归合并
          result[key] = deepMerge(result[key] || {}, obj[key]);
        } else {
          // 否则直接赋值
          result[key] = obj[key];
        }
      }
    }
  }
  
  return result;
}

// 将所有 token 合并到一个对象中，便于查找
const tokenCollections = deepMerge(
  // 颜色相关
  colorBasic,
  colorBorder,
  colorSurface,
  colorPrimary,
  colorSecondary,
  colorTertiary,
  colorError,
  colorSuccess,
  colorWarning,
  colorLink,
  colorDisable,
  colorDirection,
  colorGradient,

  
  // 尺寸相关
  dimensionBasic,
  dimensionPadding,
  dimensionMargin, 
  dimensionGap,
  dimensionBorderRadius,
  dimensionBorderWidth,
  
  // 字体相关
  fontSize,
  fontWeight,
  fontLineHeight,
  fontLetterSpacing,
  
  // 动效相关
  motionDuration,
  motionDelay,
  motionEasingFunction,
  
  // 资源相关
  assetFont
);

/**
 * 解析 token 路径字符串，返回对应的值
 * @param {string} path - token 路径，如 "color.border.white7"
 * @returns {Object} - 包含 token 值及其类型的对象
 */
function getTokenByPath(path) {
  if (!path) return null;
  
  const parts = path.split('.');
  let current = tokenCollections;
  
  
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (current && Object.prototype.hasOwnProperty.call(current, part)) {
      current = current[part];
    } else { 
      return null; // 路径无效
    }
  }
  
  return current;
}

/**
 * 判断是否是 token 引用字符串
 * @param {string} value - 输入字符串
 * @returns {boolean} - 是否是 token 引用
 */
function isTokenReference(value) {
  return typeof value === 'string' && value.startsWith('{') && value.endsWith('}');
}

/**
 * 解析 token 引用
 * @param {string} reference - token 引用字符串，如 "{color.border.white7}"
 * @returns {string} - token 路径，如 "color.border.white7"
 */
function parseTokenReference(reference) {
  // 去除花括号
  return reference.slice(1, -1);
}

/**
 * 解析 token 引用并返回最终值
 * @param {string} tokenReference - token 引用字符串，如 "{color.border.white7}"
 * @param {number} [maxDepth=10] - 最大解析深度，防止循环引用
 * @returns {string|null} - token 的最终值，如果无法解析则返回 null
 */
function resolveToken(tokenReference, maxDepth = 20) {
  
  if (!isTokenReference(tokenReference)) {
    return tokenReference; // 非 token 引用，直接返回
  }
  
  if (maxDepth <= 0) {
    return null;
  }
  
  const tokenPath = parseTokenReference(tokenReference);
  const token = getTokenByPath(tokenPath);
  
  
  if (!token) {
    console.error('无法找到 token:', tokenPath);
    return null;
  }
  
  // 如果 token 有 value 属性，进一步检查它是否也是引用
  if (token.value) {
    if (isTokenReference(token.value)) {
      // 递归解析引用
      return resolveToken(token.value, maxDepth - 1);
    } else {
      // 找到最终值
      return token.value;
    }
  }
  
  // token 对象本身没有 value 属性
  return token;
}

/**
 * 解析字符串中的所有 token 引用
 * @param {string} text - 包含 token 引用的字符串
 * @returns {string} - 所有 token 引用都被替换为实际值的字符串
 */
function resolveTokensInText(text) {
  if (typeof text !== 'string') {
    return text;
  }
  
  // 使用正则表达式查找所有 token 引用
  return text.replace(/\{([^{}]+)\}/g, (match) => {
    const resolved = resolveToken(match);
    return resolved !== null ? resolved : match;
  });
}

/**
 * 处理样式值，确保正确的单位
 * @param {any} value - 样式值
 * @param {string} [unit='px'] - 默认单位
 * @param {string} [defaultValue='0'] - 默认值
 * @returns {string} - 处理后的样式值
 */
function processStyleValue(value, unit = 'px', defaultValue = '0') {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  
  if (typeof value === 'number') {
    return `${value}${unit}`;
  }
  
  // 如果是token引用，先解析
  if (isTokenReference(value)) {
    const resolved = resolveToken(value);
    return resolved !== null ? resolved : defaultValue;
  }
  
  return value;
}

/**
 * 将样式对象中的所有token引用转换为实际值
 * @param {Object} style - 样式对象
 * @returns {Object} - 转换后的样式对象
 */
function convertStyle(style) {
  if (!style || typeof style !== 'object') {
    return style;
  }
  
  const result = {};
  
  for (const [key, value] of Object.entries(style)) {
    if (isTokenReference(value)) {
      // 解析token引用
      result[key] = resolveToken(value);
    } else if (typeof value === 'object' && value !== null) {
      // 递归处理嵌套对象
      result[key] = convertStyle(value);
    } else {
      // 保持原值
      result[key] = value;
    }
  }
  
  return result;
}

export default resolveToken;
export { 
  resolveTokensInText, 
  isTokenReference, 
  getTokenByPath,
  convertStyle,
  processStyleValue 
}; 