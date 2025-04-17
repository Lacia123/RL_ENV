'use client';

import { resolveToken } from '../tokenResolver.js';

/**
 * 分析布局的颜色和排版质量
 * @param {Object} layout - 布局对象
 * @returns {Object} 颜色和排版分析结果
 */
export function analyzeColorTypography(layout) {
  const results = {
    score: 100,
    colorPaletteAnalysis: {
      paletteSize: 0,
      primaryColors: [],
      secondaryColors: [],
      accentColors: []
    },
    typographyConsistency: 90,
    colorHarmony: 85,
    readabilityMetrics: {
      fontSize: 'adequate',
      lineSpacing: 'good',
      contrastScore: 80
    },
    details: []
  };
  
  // 检查是否有布局
  if (!layout) {
    results.score = 0;
    results.details.push({
      type: 'warning',
      message: '无法分析空布局'
    });
    return results;
  }
  
  // 分析使用的颜色
  const colorAnalysis = analyzeColorUsage(layout);
  results.colorPaletteAnalysis = colorAnalysis.palette;
  
  // 分析排版一致性
  const typographyAnalysis = analyzeTypography(layout);
  results.typographyConsistency = typographyAnalysis.consistencyScore;
  
  // 评估颜色和排版的组合效果
  if (colorAnalysis.palette.paletteSize > 5) {
    results.score -= 15;
    results.colorHarmony = 70;
    results.details.push({
      type: 'warning',
      message: `使用了${colorAnalysis.palette.paletteSize}种颜色，超过5种可能影响视觉一致性`
    });
  } else if (colorAnalysis.palette.paletteSize >= 3) {
    results.details.push({
      type: 'success',
      message: '颜色数量适中，有助于创建视觉层次并保持一致性'
    });
  } else if (colorAnalysis.palette.paletteSize <= 1) {
    results.score -= 10;
    results.details.push({
      type: 'warning',
      message: '颜色使用过少，可能缺乏视觉吸引力和层次感'
    });
  }
  
  // 评估排版一致性
  if (typographyAnalysis.consistencyScore < 70) {
    results.score -= 20;
    results.details.push({
      type: 'warning',
      message: '排版风格不一致，使用了过多不同的字体样式'
    });
  } else {
    results.details.push({
      type: 'success',
      message: '排版风格一致，增强了整体设计的专业感'
    });
  }
  
  // 评估可读性
  if (typographyAnalysis.hasSmallText) {
    results.score -= 15;
    results.readabilityMetrics.fontSize = 'inadequate';
    results.details.push({
      type: 'warning',
      message: '存在字体过小的文本，可能影响可读性'
    });
  }
  
  // 评估对比度
  if (colorAnalysis.lowContrastCount > 0) {
    results.score -= Math.min(30, colorAnalysis.lowContrastCount * 10);
    results.readabilityMetrics.contrastScore = 60;
    results.details.push({
      type: 'warning',
      message: `发现${colorAnalysis.lowContrastCount}处文本颜色与背景对比度不足`
    });
  }
  
  return results;
}

/**
 * 分析颜色使用情况
 * @param {Object} element - 布局元素
 * @returns {Object} 颜色分析结果
 */
function analyzeColorUsage(element) {
  const colors = new Set();
  const primaryColors = new Set();
  const secondaryColors = new Set();
  const accentColors = new Set();
  let lowContrastCount = 0;
  
  // 递归分析元素颜色
  const analyzeElementColors = (el, background = '') => {
    if (!el) return;
    
    // 提取元素颜色
    let currentBackground = background;
    if (el.backgroundColor) {
      const bgColor = resolveToken(el.backgroundColor);
      colors.add(bgColor);
      currentBackground = bgColor;
      
      // 简化处理：根据使用频率判断颜色类型
      if (el.type === 'container' || el.appearancePreset === 'primary') {
        primaryColors.add(bgColor);
      } else {
        secondaryColors.add(bgColor);
      }
    }
    
    // 分析文本颜色
    if (el.type === 'text' && el.color) {
      const textColor = resolveToken(el.color);
      colors.add(textColor);
      
      // 检查与背景的对比度
      if (currentBackground && !hasAdequateContrast(textColor, currentBackground)) {
        lowContrastCount++;
      }
      
      // 文本颜色可能是强调色
      if (el.typographyPreset === 'h1' || el.typographyPreset === 'h2') {
        primaryColors.add(textColor);
      } else if (el.emphasis || el.typographyPreset === 'caption') {
        accentColors.add(textColor);
      } else {
        secondaryColors.add(textColor);
      }
    }
    
    // 按钮和强调元素的颜色
    if (el.type === 'button' || el.type === 'link') {
      if (el.color) {
        const buttonColor = resolveToken(el.color);
        colors.add(buttonColor);
        accentColors.add(buttonColor);
      }
    }
    
    // 递归处理子元素
    if (el.children) {
      el.children.forEach(child => analyzeElementColors(child, currentBackground));
    }
  };
  
  analyzeElementColors(element);
  
  return {
    palette: {
      paletteSize: colors.size,
      primaryColors: [...primaryColors],
      secondaryColors: [...secondaryColors],
      accentColors: [...accentColors]
    },
    lowContrastCount
  };
}

/**
 * 简化的对比度检查
 * @param {string} color1 - 颜色1
 * @param {string} color2 - 颜色2
 * @returns {boolean} 是否有足够对比度
 */
function hasAdequateContrast(color1, color2) {
  // 简化实现，实际应该使用WCAG标准算法
  // 这里仅做简单判断
  if (!color1 || !color2) return true;
  
  // 检查明显的低对比度组合
  if ((color1.includes('white') && color2.includes('light')) ||
      (color1.includes('light') && color2.includes('white')) ||
      (color1.includes('black') && color2.includes('dark')) ||
      (color1.includes('dark') && color2.includes('black')) ||
      (color1 === color2)) {
    return false;
  }
  
  return true;
}

/**
 * 分析排版
 * @param {Object} element - 布局元素
 * @returns {Object} 排版分析结果
 */
function analyzeTypography(element) {
  const fontFamilies = new Set();
  const fontSizes = new Set();
  const lineHeights = new Set();
  const typographyPresets = new Set();
  let textElementCount = 0;
  let hasSmallText = false;
  
  // 递归分析排版
  const analyzeElementTypography = (el) => {
    if (!el) return;
    
    if (el.type === 'text') {
      textElementCount++;
      
      // 收集字体属性
      if (el.fontFamily) fontFamilies.add(el.fontFamily);
      if (el.fontSize) {
        fontSizes.add(el.fontSize);
        if (el.fontSize < 12) hasSmallText = true;
      }
      if (el.lineHeight) lineHeights.add(el.lineHeight);
      if (el.typographyPreset) typographyPresets.add(el.typographyPreset);
    }
    
    // 递归处理子元素
    if (el.children) {
      el.children.forEach(analyzeElementTypography);
    }
  };
  
  analyzeElementTypography(element);
  
  // 计算一致性分数
  let consistencyScore = 100;
  
  // 如果使用了多种字体，降低一致性分数
  if (fontFamilies.size > 2) {
    consistencyScore -= (fontFamilies.size - 2) * 15;
  }
  
  // 如果使用了过多字体大小，降低一致性分数
  if (fontSizes.size > 5) {
    consistencyScore -= (fontSizes.size - 5) * 10;
  }
  
  // 如果更多地使用了排版预设，提高一致性分数
  if (typographyPresets.size > 0 && textElementCount > 0) {
    const presetUsageRatio = typographyPresets.size / textElementCount;
    if (presetUsageRatio > 0.7) {
      consistencyScore += 10;
    }
  }
  
  return {
    fontCount: fontFamilies.size,
    fontSizeCount: fontSizes.size,
    lineHeightCount: lineHeights.size,
    presetCount: typographyPresets.size,
    consistencyScore: Math.max(0, Math.min(100, consistencyScore)),
    hasSmallText
  };
}