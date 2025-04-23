'use client';

import { mergeElementPresets } from '../presets/presetSystem.js';

/**
 * 虚拟DOM测量系统
 * 
 * 该模块负责将布局对象转换为虚拟DOM测量数据，
 * 提供与浏览器DOM测量一致的接口，用于布局分析
 */

/**
 * 生成虚拟DOM测量数据
 * @param {Object} layout - 布局对象
 * @param {Object} containerDimensions - 容器尺寸，格式为 {width, height}
 * @returns {Object} 虚拟DOM测量数据
 */
export function generateVirtualDomMeasurements(layout, containerDimensions = { width: 1024, height: 768 }) {
  // 初始化测量数据对象
  const measurements = {
    container: { ...containerDimensions }
  };
  
  // 递归生成虚拟DOM测量数据
  generateElementMeasurement(
    layout,
    null,
    0,
    0,
    containerDimensions.width,
    containerDimensions.height,
    measurements
  );
  
  return measurements;
}

/**
 * 递归生成元素的虚拟DOM测量
 * @param {Object} element - 布局元素
 * @param {Object} parent - 父元素
 * @param {number} x - x坐标
 * @param {number} y - y坐标
 * @param {number} width - 宽度
 * @param {number} height - 高度
 * @param {Object} measurements - 测量结果对象
 */
function generateElementMeasurement(element, parent, x, y, width, height, measurements) {
  if (!element || !element.id) return;
  
  // 使用预设系统计算样式
  const mergedStyle = mergeElementPresets(element);
  
  // 合并默认样式、预设样式和直接设置的样式
  const style = {
    // 基础默认样式
    fontSize: 16,
    lineHeight: 1.5,
    fontWeight: 'normal',
    color: '#000000',
    backgroundColor: 'transparent',
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
    textAlign: 'left',
    letterSpacing: 0,
    wordSpacing: 0,
    borderRadius: 0,
    borderWidth: 0,
    display: element.type === 'container' ? 'flex' : 'block',
    flexDirection: element.direction || 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 0,
    ...mergedStyle, // 应用预设样式
    ...(element.style || {}) // 应用直接设置的样式（优先级最高）
  };
  
  // 创建元素的测量数据
  measurements[element.id] = {
    x,
    y,
    width,
    height,
    type: element.type,
    style: {
      fontSize: style.fontSize,
      lineHeight: style.lineHeight,
      fontWeight: style.fontWeight,
      color: style.color,
      backgroundColor: style.backgroundColor,
      padding: {
        top: style.paddingTop,
        right: style.paddingRight,
        bottom: style.paddingBottom,
        left: style.paddingLeft
      },
      margin: {
        top: style.marginTop,
        right: style.marginRight,
        bottom: style.marginBottom,
        left: style.marginLeft
      },
      textAlign: style.textAlign,
      letterSpacing: style.letterSpacing,
      wordSpacing: style.wordSpacing,
      borderRadius: style.borderRadius,
      borderWidth: style.borderWidth,
      display: style.display,
      flexDirection: style.flexDirection,
      justifyContent: style.justifyContent,
      alignItems: style.alignItems,
      gap: style.gap
    }
  };
  
  // 保存所有预设属性
  const presetProperties = {};
  Object.keys(element).forEach(key => {
    if (key.endsWith('Preset')) {
      presetProperties[key] = element[key];
    }
  });
  measurements[element.id].presets = presetProperties;
  
  // 为文本元素添加文本内容相关数据
  if (element.type === 'text' && element.content && element.content.value) {
    measurements[element.id].textContent = element.content.value;
    measurements[element.id].textLength = element.content.value.length;
    
    // 计算文本密度
    const textArea = width * height;
    measurements[element.id].textDensity = textArea > 0 ?
      (element.content.value.length / textArea) * 10000 : 0;
  }
  
  // 处理子元素
  if (element.children && element.children.length > 0) {
    // 计算子元素的尺寸和位置
    const isRow = element.direction === 'row' || style.flexDirection === 'row';
    const innerWidth = width - style.paddingLeft - style.paddingRight;
    const innerHeight = height - style.paddingTop - style.paddingBottom;
    const startX = x + style.paddingLeft;
    const startY = y + style.paddingTop;
    
    // 计算子元素间距
    const gap = style.gap || 0;
    const totalGap = gap * (element.children.length - 1);
    
    // 处理不同的布局方向和对齐方式
    if (isRow) {
      distributeRowChildren(
        element.children,
        style,
        startX,
        startY,
        innerWidth,
        innerHeight,
        gap,
        measurements
      );
    } else {
      distributeColumnChildren(
        element.children,
        style,
        startX,
        startY,
        innerWidth,
        innerHeight,
        gap,
        measurements
      );
    }
  }
}

/**
 * 分配水平布局子元素
 * @param {Array} children - 子元素数组
 * @param {Object} parentStyle - 父元素样式
 * @param {number} startX - 起始X坐标
 * @param {number} startY - 起始Y坐标
 * @param {number} innerWidth - 可用宽度
 * @param {number} innerHeight - 可用高度
 * @param {number} gap - 间距
 * @param {Object} measurements - 测量数据对象
 */
function distributeRowChildren(children, parentStyle, startX, startY, innerWidth, innerHeight, gap, measurements) {
  // 计算子元素的宽度分配
  const childWidths = calculateChildWidths(children, innerWidth, gap, 'row');
  
  // 水平布局
  let currentX = startX;
  
  children.forEach((child, index) => {
    const childWidth = childWidths[index];
    
    // 计算子元素的垂直对齐
    let childY = startY;
    let childHeight = innerHeight;
    
    // 应用子元素自身的对齐方式
    if (child.selfAlignPreset) {
      switch (child.selfAlignPreset) {
        case 'self-start':
          // 顶部对齐，Y坐标不变
          break;
        case 'self-center':
          // 如果是自动高度，估算一个高度
          if (child.sizePreset === 'auto-height') {
            const estimatedHeight = estimateElementHeight(child);
            childY = startY + (innerHeight - estimatedHeight) / 2;
            childHeight = estimatedHeight;
          }
          break;
        case 'self-end':
          // 如果是自动高度，估算一个高度
          if (child.sizePreset === 'auto-height') {
            const estimatedHeight = estimateElementHeight(child);
            childY = startY + innerHeight - estimatedHeight;
            childHeight = estimatedHeight;
          }
          break;
        case 'self-stretch':
          // 拉伸填充整个高度，Y坐标不变
          break;
        default:
          // 默认顶部对齐
          break;
      }
    } else {
      // 使用父容器的alignItems
      switch (parentStyle.alignItems) {
        case 'center':
          // 如果是自动高度，估算一个高度
          if (child.sizePreset === 'auto-height') {
            const estimatedHeight = estimateElementHeight(child);
            childY = startY + (innerHeight - estimatedHeight) / 2;
            childHeight = estimatedHeight;
          }
          break;
        case 'flex-end':
          // 如果是自动高度，估算一个高度
          if (child.sizePreset === 'auto-height') {
            const estimatedHeight = estimateElementHeight(child);
            childY = startY + innerHeight - estimatedHeight;
            childHeight = estimatedHeight;
          }
          break;
        // 其他情况使用默认值
      }
    }
    
    // 递归处理子元素
    generateElementMeasurement(
      child,
      children,
      currentX,
      childY,
      childWidth,
      childHeight,
      measurements
    );
    
    // 更新下一个元素的起始位置
    currentX += childWidth + gap;
  });
}

/**
 * 分配垂直布局子元素
 * @param {Array} children - 子元素数组
 * @param {Object} parentStyle - 父元素样式
 * @param {number} startX - 起始X坐标
 * @param {number} startY - 起始Y坐标
 * @param {number} innerWidth - 可用宽度
 * @param {number} innerHeight - 可用高度
 * @param {number} gap - 间距
 * @param {Object} measurements - 测量数据对象
 */
function distributeColumnChildren(children, parentStyle, startX, startY, innerWidth, innerHeight, gap, measurements) {
  // 计算子元素的高度分配
  const childHeights = calculateChildWidths(children, innerHeight, gap, 'column');
  
  // 垂直布局
  let currentY = startY;
  
  children.forEach((child, index) => {
    const childHeight = childHeights[index];
    
    // 计算子元素的水平对齐
    let childX = startX;
    let childWidth = innerWidth;
    
    // 应用子元素自身的对齐方式
    if (child.selfAlignPreset) {
      switch (child.selfAlignPreset) {
        case 'self-start':
          // 左对齐，X坐标不变
          break;
        case 'self-center':
          // 如果是自动宽度，估算一个宽度
          if (child.sizePreset === 'auto-width') {
            const estimatedWidth = estimateElementWidth(child);
            childX = startX + (innerWidth - estimatedWidth) / 2;
            childWidth = estimatedWidth;
          }
          break;
        case 'self-end':
          // 如果是自动宽度，估算一个宽度
          if (child.sizePreset === 'auto-width') {
            const estimatedWidth = estimateElementWidth(child);
            childX = startX + innerWidth - estimatedWidth;
            childWidth = estimatedWidth;
          }
          break;
        case 'self-stretch':
          // 拉伸填充整个宽度，X坐标不变
          break;
        default:
          // 默认左对齐
          break;
      }
    } else {
      // 使用父容器的alignItems
      switch (parentStyle.alignItems) {
        case 'center':
          // 如果是自动宽度，估算一个宽度
          if (child.sizePreset === 'auto-width') {
            const estimatedWidth = estimateElementWidth(child);
            childX = startX + (innerWidth - estimatedWidth) / 2;
            childWidth = estimatedWidth;
          }
          break;
        case 'flex-end':
          // 如果是自动宽度，估算一个宽度
          if (child.sizePreset === 'auto-width') {
            const estimatedWidth = estimateElementWidth(child);
            childX = startX + innerWidth - estimatedWidth;
            childWidth = estimatedWidth;
          }
          break;
        // 其他情况使用默认值
      }
    }
    
    // 递归处理子元素
    generateElementMeasurement(
      child,
      children,
      childX,
      currentY,
      childWidth,
      childHeight,
      measurements
    );
    
    // 更新下一个元素的起始位置
    currentY += childHeight + gap;
  });
}

/**
 * 计算子元素尺寸分配
 * @param {Array} children - 子元素数组
 * @param {number} availableSpace - 可用空间
 * @param {number} gap - 间距
 * @param {string} direction - 布局方向 ('row'|'column')
 * @returns {Array} 子元素尺寸数组
 */
function calculateChildWidths(children, availableSpace, gap, direction) {
  const totalGap = gap * (children.length - 1);
  const flexChildren = [];
  const fixedWidths = [];
  let remainingSpace = availableSpace - totalGap;
  
  // 第一次遍历：处理固定尺寸的元素
  children.forEach((child, index) => {
    const sizeProp = direction === 'row' ? 'width' : 'height';
    
    // 检查是否有固定尺寸
    if (child.style && child.style[sizeProp] && typeof child.style[sizeProp] === 'number') {
      fixedWidths[index] = child.style[sizeProp];
      remainingSpace -= child.style[sizeProp];
    } else {
      // 收集弹性尺寸元素
      let flexGrow = 1; // 默认flex-grow
      
      // 检查flexRatioPreset
      if (child.flexRatioPreset) {
        switch (child.flexRatioPreset) {
          case 'grow-1':
            flexGrow = 1;
            break;
          case 'grow-2':
            flexGrow = 2;
            break;
          case 'grow-3':
            flexGrow = 3;
            break;
          case 'shrink-0':
            flexGrow = 0;
            break;
          default:
            // 解析自定义ratio，例如 'ratio-2-1'
            if (child.flexRatioPreset.startsWith('ratio-')) {
              const parts = child.flexRatioPreset.split('-');
              if (parts.length === 3) {
                flexGrow = parseInt(parts[1], 10) || 1;
              }
            }
        }
      }
      
      flexChildren.push({ index, flexGrow });
    }
  });
  
  // 分配剩余空间给弹性元素
  const totalFlexGrow = flexChildren.reduce((sum, child) => sum + child.flexGrow, 0);
  const childSizes = Array(children.length).fill(0);
  
  if (totalFlexGrow === 0) {
    // 如果没有弹性元素，平均分配
    const equalShare = remainingSpace / flexChildren.length;
    flexChildren.forEach(child => {
      childSizes[child.index] = equalShare;
    });
  } else {
    // 根据flex-grow比例分配
    flexChildren.forEach(child => {
      childSizes[child.index] = (child.flexGrow / totalFlexGrow) * remainingSpace;
    });
  }
  
  // 合并固定尺寸
  fixedWidths.forEach((width, index) => {
    if (width !== undefined) {
      childSizes[index] = width;
    }
  });
  
  return childSizes;
}

/**
 * 估算元素自然高度
 * @param {Object} element - 布局元素
 * @returns {number} 估算的高度
 */
function estimateElementHeight(element) {
  switch (element.type) {
    case 'text':
      // 基于文本类型和内容估算
      if (element.typographyPreset) {
        switch (element.typographyPreset) {
          case 'h1':
            return 60;
          case 'h2':
            return 50;
          case 'h3':
            return 40;
          case 'body':
            // 根据内容长度计算
            if (element.content && element.content.value) {
              const textLength = element.content.value.length;
              return Math.max(30, Math.min(100, textLength / 2));
            }
            return 30;
          default:
            return 30;
        }
      }
      return 30;
      
    case 'button':
      if (element.buttonSizePreset) {
        switch (element.buttonSizePreset) {
          case 'small':
            return 32;
          case 'medium':
            return 40;
          case 'large':
            return 48;
          default:
            return 40;
        }
      }
      return 40;
      
    case 'image':
      if (element.imageProportion) {
        // 这里需要知道宽度来计算高度，但我们还没有宽度
        // 使用一个默认估计值
        return 200;
      }
      return 200;
      
    default:
      return 50;
  }
}

/**
 * 估算元素自然宽度
 * @param {Object} element - 布局元素
 * @returns {number} 估算的宽度
 */
function estimateElementWidth(element) {
  switch (element.type) {
    case 'text':
      // 基于文本类型和内容估算
      if (element.content && element.content.value) {
        const textLength = element.content.value.length;
        if (element.typographyPreset) {
          switch (element.typographyPreset) {
            case 'h1':
              return Math.min(600, textLength * 20);
            case 'h2':
              return Math.min(500, textLength * 16);
            case 'h3':
              return Math.min(400, textLength * 14);
            case 'body':
              // 较长文本的宽度应该有限制
              return Math.min(400, textLength * 8);
            default:
              return Math.min(300, textLength * 8);
          }
        }
        return Math.min(300, textLength * 8);
      }
      return 200;
      
    case 'button':
      if (element.content && element.content.value) {
        const textLength = element.content.value.length;
        return Math.min(300, Math.max(100, textLength * 10));
      }
      return 120;
      
    case 'image':
      return 200;
      
    default:
      return 200;
  }
}

/**
 * 检查元素是否有可见边框
 * @param {Object} style - 元素样式
 * @returns {boolean} 是否有可见边框
 */
function hasVisibleBorder(style) {
  return style && 
         style.borderWidth && 
         style.borderWidth > 0 && 
         style.borderColor && 
         style.borderColor !== 'transparent';
}

/**
 * 检查元素是否有可见背景
 * @param {Object} style - 元素样式
 * @returns {boolean} 是否有可见背景
 */
function hasVisibleBackground(style) {
  return style && 
         style.backgroundColor && 
         style.backgroundColor !== 'transparent' && 
         style.backgroundColor !== '#FFFFFF' && 
         style.backgroundColor !== 'white';
} 