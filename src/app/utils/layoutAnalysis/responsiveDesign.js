'use client';

/**
 * 分析布局的响应式设计质量
 * @param {Object} layout - 布局对象
 * @returns {Object} 响应式设计分析结果
 */
export function analyzeResponsiveDesign(layout) {
  const results = {
    score: 100,
    breakpointCoverage: 90, // 默认值，表示对各种屏幕尺寸的覆盖程度
    flexibilityScore: 85,   // 默认值，表示布局弹性适应能力
    screenSizeAdaptability: 80, // 默认值，表示对不同屏幕的适应性
    problemElements: [],    // 存储可能有问题的元素
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
  
  // 分析响应式设计问题
  const responsiveIssues = detectResponsiveIssues(layout);
  
  // 根据问题数量调整评分
  const issueCount = responsiveIssues.length;
  if (issueCount > 0) {
    // 每个问题扣除一定分数，但保持一个最低分
    results.score = Math.max(40, 100 - (issueCount * 15));
    
    // 添加问题到详情
    responsiveIssues.forEach(issue => {
      results.details.push({
        type: 'warning',
        message: issue.message
      });
    });
    
    // 记录问题元素
    results.problemElements = responsiveIssues.map(issue => issue.element);
  } else {
    // 没有问题，添加积极反馈
    results.details.push({
      type: 'success',
      message: '布局具有良好的响应式设计特性'
    });
  }
  
  // 检查是否使用了弹性布局
  if (hasFlexibleLayout(layout)) {
    results.flexibilityScore = 100;
    results.details.push({
      type: 'success',
      message: '使用弹性布局有助于适应不同屏幕尺寸'
    });
  } else {
    results.flexibilityScore = 60;
    results.score -= 10;
    results.details.push({
      type: 'warning',
      message: '缺少弹性布局属性，可能在不同屏幕上表现不佳'
    });
  }
  
  // 添加关于媒体查询或响应式预设的评估
  if (usesResponsivePresets(layout)) {
    results.breakpointCoverage = 100;
    results.details.push({
      type: 'success',
      message: '使用响应式预设有助于在不同设备上提供最佳体验'
    });
  }
  
  return results;
}

/**
 * 检测响应式设计问题
 * @param {Object} element - 布局元素
 * @param {Array} issues - 问题数组
 * @returns {Array} 响应式设计问题数组
 */
function detectResponsiveIssues(element, issues = []) {
  if (!element) return issues;
  
  // 检查固定宽度问题
  if (element.width && typeof element.width === 'number' && element.width > 600) {
    issues.push({
      element: element,
      type: 'fixed-width',
      message: `检测到固定宽度(${element.width}px)元素，可能在小屏幕上溢出`
    });
  }
  
  // 检查行布局中的大量子元素
  if (element.direction === 'row' && element.children && element.children.length > 4) {
    issues.push({
      element: element,
      type: 'many-row-children',
      message: `行布局中有${element.children.length}个子元素，在小屏幕上可能会挤压或溢出`
    });
  }
  
  // 检查字体大小是否使用相对单位
  if (element.type === 'text' && element.fontSize && typeof element.fontSize === 'number' && element.fontSize > 16) {
    issues.push({
      element: element,
      type: 'fixed-font-size',
      message: `文本使用较大的固定字体大小(${element.fontSize}px)，应考虑使用相对单位`
    });
  }
  
  // 检查溢出风险
  if (element.overflow === 'hidden') {
    issues.push({
      element: element,
      type: 'overflow-hidden',
      message: '使用overflow:hidden可能在小屏幕上裁剪重要内容'
    });
  }
  
  // 递归检查子元素
  if (element.children) {
    element.children.forEach(child => {
      detectResponsiveIssues(child, issues);
    });
  }
  
  return issues;
}

/**
 * 检查是否使用了弹性布局
 * @param {Object} element - 布局元素
 * @returns {boolean} 是否使用弹性布局
 */
function hasFlexibleLayout(element) {
  if (!element) return false;
  
  // 检查是否使用弹性布局属性
  const hasFlexProps = element.display === 'flex' ||
                     element.flexDirection !== undefined ||
                     element.flex !== undefined ||
                     element.flexGrow !== undefined ||
                     element.flexShrink !== undefined;
  
  if (hasFlexProps) return true;
  
  // 检查是否使用百分比或自动宽度
  const hasFlexibleWidth = element.width === 'auto' ||
                        (typeof element.width === 'string' && element.width.includes('%'));
  
  if (hasFlexibleWidth) return true;
  
  // 递归检查子元素
  if (element.children) {
    for (const child of element.children) {
      if (hasFlexibleLayout(child)) return true;
    }
  }
  
  return false;
}

/**
 * 检查是否使用了响应式预设
 * @param {Object} element - 布局元素
 * @returns {boolean} 是否使用响应式预设
 */
function usesResponsivePresets(element) {
  if (!element) return false;
  
  // 检查常见的响应式预设或类
  const hasResponsivePreset = element.responsivePreset ||
                           (element.className &&
                            (element.className.includes('responsive') ||
                             element.className.includes('mobile') ||
                             element.className.includes('tablet') ||
                             element.className.includes('desktop')));
  
  if (hasResponsivePreset) return true;
  
  // 递归检查子元素
  if (element.children) {
    for (const child of element.children) {
      if (usesResponsivePresets(child)) return true;
    }
  }
  
  return false;
}