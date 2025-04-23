/**
 * 设计令牌系统 - 统一入口
 * 提供设计系统中的所有令牌集合
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
import colorDirection from './color/gradient/direction.js';
import colorGradient from './color/gradient/gradient.js';

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
import { resolveTokensInText } from './resolveToken.js';

// 常用的令牌分类
const tokens = {
  // 颜色相关
  color: {
    basic: colorBasic.color.basic,
    border: colorBorder.color.border,
    surface: colorSurface.color.surface,
    primary: colorPrimary.color.primary,
    secondary: colorSecondary.color.secondary,
    tertiary: colorTertiary.color.tertiary,
    error: colorError.color.error,
    success: colorSuccess.color.success,
    warning: colorWarning.color.warning,
    link: colorLink.color.link,
    disable: colorDisable.color.disable,
    gradient: {
      direction: colorDirection.color.gradient.direction,
      gradient: colorGradient.color.gradient.gradient
    }
  },
  
  // 尺寸相关
  dimension: dimensionBasic.dimension.basic,
  padding: dimensionPadding.dimension.padding,
  margin: dimensionMargin.dimension.margin,
  gap: dimensionGap.dimension.gap,
  borderRadius: dimensionBorderRadius.dimension.borderradius,
  borderWidth: dimensionBorderWidth.dimension.borderwidth,
  
  // 字体相关
  font: {
    size: fontSize.font.size,
    weight: fontWeight.font.weight,
    lineHeight: fontLineHeight.font.lineheight,
    letterSpacing: fontLetterSpacing.font.letterspacing
  },
  
  // 动效相关
  motion: {
    duration: motionDuration.motion.duration,
    delay: motionDelay.motion.delay,
    easingFunction: motionEasingFunction.motion.easingfunction
  },
  
  // 资产相关
  asset: {
    font: assetFont.asset.font
  }
};

/**
 * 解析文本中的令牌引用
 * @param {string} text - 包含令牌引用的文本
 * @returns {string} - 解析后的文本
 */
export const resolveTokens = (text) => {
  return resolveTokensInText(text);
};

export default tokens; 