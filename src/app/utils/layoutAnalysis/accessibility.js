'use client';

import { resolveToken } from '../tokenResolver.js';

/**
 * 分析布局的可访问性
 * @param {Object} layout - 布局对象
 * @returns {Object} 可访问性分析结果
 */
export function analyzeAccessibility(layout) {
  const results = {
    score: 100,
    contrastScores: [],
    interactionAccessibility: 90,
    keyboardNavigability: 85,
    semanticStructure: 80,
    wcagCompliance: 'AA',
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
  
  // 分析元素的可访问性问题
  const accessibilityIssues = detectAccessibilityIssues(layout);
  
  // 根据问题数量调整评分
  const issueCount = accessibilityIssues.length;
  if (issueCount > 0) {
    // 每个问题扣除一定分数，但保持一个最低分
    results.score = Math.max(40, 100 - (issueCount * 10));
    
    // 添加问题到详情
    accessibilityIssues.forEach(issue => {
      results.details.push({
        type: 'warning',
        message: issue.message
      });
    });
  } else {
    // 没有问题，添加积极反馈
    results.details.push({
      type: 'success',
      message: '布局具有良好的可访问性基础'
    });
  }
  
  // 计算颜色对比度评分
  const contrastResults = evaluateColorContrast(layout);
  results.contrastScores = contrastResults.scores;
  
  if (contrastResults.lowContrastCount > 0) {
    results.score -= Math.min(30, contrastResults.lowContrastCount * 10);
    results.details.push({
      type: 'warning',
      message: `检测到${contrastResults.lowContrastCount}处颜色对比度不足，可能影响可读性`
    });
  } else {
    results.details.push({
      type: 'success',
      message: '颜色对比度良好，确保了内容的可读性'
    });
  }
  
  // 评估键盘导航
  if (!hasKeyboardNavigation(layout)) {
    results.keyboardNavigability = 60;
    results.score -= 15;
    results.details.push({
      type: 'warning',
      message: '缺少键盘导航支持，考虑添加快捷键或焦点管理'
    });
  }
  
  // 评估语义结构
  const semanticScore = evaluateSemanticStructure(layout);
  results.semanticStructure = semanticScore;
  
  if (semanticScore < 70) {
    results.score -= 10;
    results.details.push({
      type: 'warning',
      message: '语义结构不清晰，可能影响屏幕阅读器用户体验'
    });
  }
  
  // 确定WCAG符合级别
  if (results.score >= 90) {
    results.wcagCompliance = 'AAA';
  } else if (results.score >= 75) {
    results.wcagCompliance = 'AA';
  } else {
    results.wcagCompliance = 'A';
  }
  
  return results;
}

/**
 * 检测可访问性问题
 * @param {Object} element - 布局元素
 * @param {Array} issues - 问题数组
 * @returns {Array} 可访问性问题数组
 */
function detectAccessibilityIssues(element, issues = []) {
  if (!element) return issues;
  
  // 检查图片是否有替代文本
  if (element.type === 'image' && (!element.content?.alt || element.content.alt === '')) {
    issues.push({
      element: element,
      type: 'missing-alt',
      message: '图片缺少替代文本(alt)，对屏幕阅读器用户不友好'
    });
  }
  
  // 检查交互元素的大小
  if ((element.type === 'button' || element.type === 'input') &&
      ((element.width && element.width < 44) || (element.height && element.height < 44))) {
    issues.push({
      element: element,
      type: 'small-touch-target',
      message: '交互元素尺寸小于44×44像素，触碰目标太小'
    });
  }
  
  // 检查按钮是否有标签
  if (element.type === 'button' && (!element.content || !element.content.text || element.content.text.length < 1)) {
    issues.push({
      element: element,
      type: 'unlabeled-button',
      message: '按钮缺少文本标签，无法被屏幕阅读器正确识别'
    });
  }
  
  // 检查表单元素是否有标签
  if (element.type === 'input' && !element.label) {
    issues.push({
      element: element,
      type: 'unlabeled-input',
      message: '输入框缺少标签，用户可能不清楚其用途'
    });
  }
  
  // 检查文本大小是否足够
  if (element.type === 'text' && element.fontSize && element.fontSize < 12) {
    issues.push({
      element: element,
      type: 'small-text',
      message: `文本大小(${element.fontSize}px)过小，可能难以阅读`
    });
  }
  
  // 递归检查子元素
  if (element.children) {
    element.children.forEach(child => {
      detectAccessibilityIssues(child, issues);
    });
  }
  
  return issues;
}

/**
 * 评估颜色对比度
 * @param {Object} element - 布局元素
 * @returns {Object} 对比度评估结果
 */
function evaluateColorContrast(element) {
  const results = {
    scores: [],
    lowContrastCount: 0
  };
  
  // 使用简化的评估方式
  // 实际实现应使用WCAG标准计算对比度
  const evaluateElementContrast = (el) => {
    if (!el) return;
    
    // 检查文本元素的对比度
    if (el.type === 'text' && el.color && el.backgroundColor) {
      // 简化评估 - 实际应使用计算公式
      const color = resolveToken(el.color) || '';
      const backgroundColor = resolveToken(el.backgroundColor) || '';
      
      let contrastScore = 90; // 默认假设对比度良好
      
      // 简单评估一些明显的低对比度组合
      if ((color.includes('white') && backgroundColor.includes('light')) ||
          (color.includes('light') && backgroundColor.includes('white')) ||
          (color.includes('black') && backgroundColor.includes('dark')) ||
          (color.includes('dark') && backgroundColor.includes('black'))) {
        contrastScore = 40;
        results.lowContrastCount++;
      }
      
      results.scores.push({
        element: el.type,
        score: contrastScore
      });
    }
    
    // 递归检查子元素
    if (el.children) {
      el.children.forEach(child => {
        evaluateElementContrast(child);
      });
    }
  };
  
  evaluateElementContrast(element);
  return results;
}

/**
 * 检查是否有键盘导航支持
 * @param {Object} element - 布局元素
 * @returns {boolean} 是否支持键盘导航
 */
function hasKeyboardNavigation(element) {
  if (!element) return false;
  
  // 检查是否有键盘支持的属性
  if (element.keyboardShortcuts || element.tabIndex !== undefined) {
    return true;
  }
  
  // 递归检查子元素
  if (element.children) {
    for (const child of element.children) {
      if (hasKeyboardNavigation(child)) return true;
    }
  }
  
  return false;
}

/**
 * 评估语义结构
 * @param {Object} element - 布局元素
 * @returns {number} 语义结构评分(0-100)
 */
function evaluateSemanticStructure(element) {
  if (!element) return 0;
  
  let score = 100;
  let hasHeading = false;
  let hasMainContent = false;
  let hasNavigation = false;
  
  // 检查常见的语义元素是否存在
  const checkSemanticElements = (el) => {
    if (!el) return;
    
    // 检查标题
    if (el.type === 'text' && (el.role === 'heading' || el.typographyPreset?.startsWith('h'))) {
      hasHeading = true;
    }
    
    // 检查主内容区域
    if (el.role === 'main' || el.id === 'main-content') {
      hasMainContent = true;
    }
    
    // 检查导航
    if (el.role === 'navigation' || el.type === 'nav') {
      hasNavigation = true;
    }
    
    // 递归检查子元素
    if (el.children) {
      el.children.forEach(checkSemanticElements);
    }
  };
  
  checkSemanticElements(element);
  
  // 根据关键语义元素是否存在调整分数
  if (!hasHeading) score -= 20;
  if (!hasMainContent) score -= 15;
  if (!hasNavigation) score -= 10;
  
  return Math.max(0, score);
}