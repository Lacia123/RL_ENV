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
import colorTertiaryContainer from './color/tertiarycontainer.js';
import colorError from './color/error.js';
import colorSuccess from './color/success.js';
import colorWarning from './color/warning.js';
import colorLink from './color/link.js';
import colorDisable from './color/disable.js';
import colorOnPrimary from './color/onprimary.js';
import colorOnPrimaryContainer from './color/onprimarycontainer.js';
import colorOnSurface from './color/onsurface.js';
import colorOnSurfaceContainer from './color/onsurfacecontainer.js';
import colorOnSecondary from './color/onsecondary.js';
import colorOnSecondaryContainer from './color/onsecondarycontainer.js';
import colorOnTertiary from './color/ontertiary.js';
import colorOnTertiaryContainer from './color/ontertiarycontainer.js';

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


import layoutAlign from './layout/align.js';
import layoutDirection from './layout/direction.js';
import layoutGrow from './layout/grow.js';
import layoutSizing from './layout/sizing.js';
import layoutState from './layout/state.js';
import layoutWrap from './layout/wrap.js';


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
  colorTertiaryContainer,
  colorOnPrimary,
  colorOnPrimaryContainer,
  colorOnSecondary,
  colorOnSecondaryContainer,
  colorOnTertiary,
  colorOnTertiaryContainer,
  colorOnSurface,
  colorOnSurfaceContainer,


  // 布局相关
  layoutAlign,
  layoutDirection,
  layoutGrow,
  layoutSizing,
  layoutState,
  layoutWrap,



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

// 存储动态token系统，初始为null
let dynamicTokenSystem = null;

/**
 * 设置动态token系统
 * @param {Object} tokenSystem - 动态token对象
 */
function setDynamicTokenSystem(tokenSystem) {
  if (tokenSystem && typeof tokenSystem === 'object') {
    dynamicTokenSystem = tokenSystem;
    console.log('已设置动态token系统');
    return true;
  }
  return false;
}

/**
 * 获取当前动态token系统
 * @returns {Object|null} - 当前设置的动态token系统
 */
function getDynamicTokenSystem() {
  return dynamicTokenSystem;
}

/**
 * 清除当前动态token系统
 */
function clearDynamicTokenSystem() {
  dynamicTokenSystem = null;
  console.log('已清除动态token系统');
}

/**
 * 解析 token 路径字符串，返回对应的值
 * @param {string} path - token 路径，如 "color.border.white7"
 * @param {Object} [customTokenSystem=null] - 可选的自定义token系统
 * @returns {Object} - 包含 token 值及其类型的对象
 */
function getTokenByPath(path, customTokenSystem = null) {
  if (!path) return null;

  const parts = path.split('.');


  if (path == 'font.size.xxl') {
    console.log('parts')
    console.log(parts)
  }

  // 优先使用传入的自定义token系统
  if (customTokenSystem) {
    let current = customTokenSystem;
    let allFound = true;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (current && Object.prototype.hasOwnProperty.call(current, part)) {
        current = current[part];
      } else {
        allFound = false;
        break;
      }
    }

    if (allFound) {
      return current;
    }
  }

  // 其次使用全局动态token系统
  if (dynamicTokenSystem) {
    let current = dynamicTokenSystem;
    let allFound = true;


    if (path == 'font.size.xxl') {
      console.log('current')
      console.log(current)
    }

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (current && Object.prototype.hasOwnProperty.call(current, part)) {
        current = current[part];
      } else {
        allFound = false;
        break;
      }
    }

    if (allFound) {
      return current;
    }
  }

  // 最后使用默认token集合
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
 * 判断字符串是否包含 token 引用
 * @param {string} value - 输入字符串
 * @returns {boolean} - 是否包含 token 引用
 */
function containsTokenReferences(value) {
  return typeof value === 'string' && value.includes('{') && value.includes('}');
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
 * @param {number} [maxDepth=20] - 最大解析深度，防止循环引用
 * @param {Object} [customTokenSystem=null] - 可选的自定义token系统
 * @returns {string|null} - token 的最终值，如果无法解析则返回 null
 */
function resolveToken(tokenReference, maxDepth = 20, customTokenSystem = null) {
  // 非字符串类型直接返回
  if (typeof tokenReference !== 'string') {
    return tokenReference;
  }

  // 处理包含多个 token 的情况，委托给 resolveTokensInText 处理
  if (!isTokenReference(tokenReference) && containsTokenReferences(tokenReference)) {
    return resolveTokensInText(tokenReference, maxDepth, customTokenSystem);
  }

  // 非 token 引用格式，直接返回
  if (!isTokenReference(tokenReference)) {
    return tokenReference;
  }

  // 防止无限递归
  if (maxDepth <= 0) {
    console.warn('达到最大解析深度，可能存在循环引用:', tokenReference);
    return null;
  }

  // 解析 token 路径
  const tokenPath = parseTokenReference(tokenReference);
  const token = getTokenByPath(tokenPath, customTokenSystem);

  if (tokenReference == '{font.size.xxl}') {
    console.log('..... tokenReference')
    console.log(tokenReference)
    console.log('..... tokenPath')
    console.log(tokenPath)
  }


  // 找不到 token
  if (!token) {
    console.warn('无法找到 token:', tokenPath);
    return null;
  }

  // 如果 token 有 value 属性，进一步检查它是否也是引用
  if (token.value !== undefined) {
    if (isTokenReference(token.value)) {
      // 递归解析引用
      return resolveToken(token.value, maxDepth - 1, customTokenSystem);
    } else {
      // 找到最终值
      return token.value;
    }
  }

  // token 对象本身作为值返回
  return token;
}

/**
 * 解析字符串中的所有 token 引用
 * @param {string} text - 包含 token 引用的字符串
 * @param {number} [maxDepth=20] - 最大解析深度 
 * @param {Object} [customTokenSystem=null] - 可选的自定义token系统
 * @returns {string} - 所有 token 引用都被替换为实际值的字符串
 */
function resolveTokensInText(text, maxDepth = 20, customTokenSystem = null) {
  if (typeof text !== 'string') {
    return text;
  }

  // 逐个处理每个token引用
  // 注意：这种实现确保每个token引用都被单独处理
  const regex = /\{([^{}]+)\}/g;
  let result = text;
  let matches = [];
  let match;

  // 先收集所有匹配项
  while ((match = regex.exec(text)) !== null) {
    matches.push({
      fullMatch: match[0],
      content: match[1],
      index: match.index
    });
  }

  // 从后向前替换，确保索引位置不会变化
  for (let i = matches.length - 1; i >= 0; i--) {
    const { fullMatch } = matches[i];
    const tokenValue = resolveToken(fullMatch, maxDepth, customTokenSystem);

    if (tokenValue !== null) {
      // 构建替换前和替换后的部分
      const before = result.substring(0, matches[i].index);
      const after = result.substring(matches[i].index + fullMatch.length);
      result = before + tokenValue + after;
    }
  }

  return result;
}

/**
 * 处理样式值，确保正确的单位
 * @param {any} value - 样式值
 * @param {string} [unit='px'] - 默认单位
 * @param {string} [defaultValue='0'] - 默认值
 * @param {Object} [customTokenSystem=null] - 可选的自定义token系统
 * @returns {string} - 处理后的样式值
 */
function processStyleValue(value, unit = 'px', defaultValue = '0', customTokenSystem = null) {
  if (value === null || value === undefined) {
    return defaultValue;
  }

  if (typeof value === 'number') {
    return `${value}${unit}`;
  }

  // 如果是token引用或包含token引用，先解析
  if (isTokenReference(value) || containsTokenReferences(value)) {
    const resolved = resolveToken(value, 20, customTokenSystem);
    return resolved !== null ? resolved : defaultValue;
  }

  return value;
}

/**
 * 将样式对象中的所有token引用转换为实际值
 * @param {Object} style - 样式对象
 * @param {Object} [customTokenSystem=null] - 可选的自定义token系统
 * @returns {Object} - 转换后的样式对象
 */
function convertStyle(style, customTokenSystem = null) {
  if (!style || typeof style !== 'object') {
    return style;
  }

  const result = {};

  for (const [key, value] of Object.entries(style)) {
    if (typeof value === 'string' && (isTokenReference(value) || containsTokenReferences(value))) {
      // 对于字符串类型的值，我们使用resolveTokensInText处理
      // 这可以处理单个token引用和包含多个token的字符串
      result[key] = resolveTokensInText(value, 20, customTokenSystem);
    } else if (typeof value === 'object' && value !== null) {
      // 递归处理嵌套对象
      result[key] = convertStyle(value, customTokenSystem);
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
  containsTokenReferences,
  getTokenByPath,
  convertStyle,
  processStyleValue,
  setDynamicTokenSystem,
  getDynamicTokenSystem,
  clearDynamicTokenSystem
}; 