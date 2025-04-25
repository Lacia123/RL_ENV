'use client';
import { findElementById } from '../tools.js'

/**
 * 分析布局中的内容密度
 * @param {Object} layout - 布局对象
 * @param {Object} domMeasurements - DOM测量数据 (可选)
 * @returns {Object} 内容密度分析结果
 */
export function analyzeContentDensity(layout, domMeasurements = null) {
  const results = {
    score: 100,
    overallDensity: 0,
    densityMap: [],
    problemAreas: [],
    details: [],
    visualizationData: null, // 用于可视化的数据
    calculations: {}, // 用于存储详细计算结果
    recommendations: [] // 具体的改进建议
  };

  // 创建密度图(20x20网格以获得更高精度)
  const gridSize = 20;
  const densityMap = createVirtualCanvas(gridSize);

  // 填充密度图 - 根据可用数据选择适当的方法
  if (domMeasurements && Object.keys(domMeasurements).length > 0) {
    // 使用DOM测量数据进行更精确的密度计算


    populateDensityMapWithDomData(layout, densityMap, domMeasurements);
    results.calculations.method = 'DOM测量';
  } else {
    // 使用布局结构进行估算
    populateDensityMap(layout, densityMap);
    results.calculations.method = '布局结构估算';
  }

  // 分析密度
  const densityStats = calculateDensityStatistics(densityMap);
  results.overallDensity = densityStats.average;
  results.densityMap = densityMap;
  results.calculations.densityStats = densityStats;

  // 准备可视化数据
  results.visualizationData = prepareVisualizationData(densityMap);

  // 应用更细粒度的评分标准
  evaluateDensityScore(results, densityStats, layout);

  // 检查密度差异
  evaluateDensityVariation(results, densityStats, densityMap);

  // 查找并评估高密度区域
  identifyProblemAreas(results, densityMap, layout);

  // 基于行业标准评估
  if (domMeasurements && Object.keys(domMeasurements).length > 0) {
    evaluateDensityByStandards(results, layout, domMeasurements);
  }

  // 根据布局类型添加上下文相关的密度建议
  addContextualRecommendations(results, layout);

  // 确保分数在0-100范围内
  results.score = Math.max(0, Math.min(100, results.score));
  results.calculations.finalScore = results.score.toFixed(1);

  return results;
}

function evaluateDensityByStandards(results, layout, domMeasurements) {
  // 1. WCAG行高评估
  evaluateLineHeightByWCAG(results, layout, domMeasurements);
  
  // 2. 材料设计间距评估
  // evaluateMaterialDesignSpacing(results, layout, domMeasurements);
  
  // 3. 认知负荷评估
  evaluateCognitiveLoad(results, layout, domMeasurements);
}


function evaluateLineHeightByWCAG(results, layout, domMeasurements) {
  // 收集所有文本元素
  const textElements = [];
  
  // 递归查找所有文本元素
  const findTextElements = (element) => {
    if (element && element.type === 'text' && element.id && domMeasurements[element.id]) {
      textElements.push({
        id: element.id,
        element: element,
        measurement: domMeasurements[element.id]
      });
    }
    
    if (element && element.children) {
      element.children.forEach(findTextElements);
    }
  };
  
  // 从布局中查找文本元素
  findTextElements(layout);
  
  // 评估行高
  let lineHeightIssues = 0;
  
  textElements.forEach(item => {
    const { id, element, measurement } = item;
    
    // 只评估正文文本，标题可以例外
    if (element.typographyPreset && !element.typographyPreset.startsWith('h')) {
      // 如果有计算样式
      if (measurement.style && measurement.style.fontSize && measurement.style.lineHeight) {
        const lineHeightRatio = measurement.style.lineHeight / measurement.style.fontSize;

        if (lineHeightRatio < 1.5) {
          lineHeightIssues++;
          
          results.details.push({
            type: 'warning',
            message: `文本元素(${id})的行高比例(${lineHeightRatio.toFixed(1)})低于WCAG推荐的1.5倍，可能影响可读性`
          });
        }
      }
      // 如果没有测量样式，但有预设，尝试评估预设
      else if (element.typographyPreset === 'body' || element.typographyPreset === 'paragraph') {
        // 无法判断确切行高，提示可能需要检查
        results.details.push({
          type: 'info',
          message: `建议检查文本元素(${id})的行高是否达到WCAG推荐的字体大小1.5倍`
        });
      }
    }
  });
  
  // 根据问题数量减分
  if (lineHeightIssues > 0) {
    const penalty = Math.min(10, lineHeightIssues * 3);
    results.score -= penalty;
    
    results.recommendations.push(
      '将正文文本的行高设置为字体大小的至少1.5倍，以符合WCAG可读性标准',
      '考虑使用预设的排版系统，确保所有文本元素具有适当的行高'
    );
    
    results.calculations.wcagLineHeightPenalty = {
      issues: lineHeightIssues,
      penalty: penalty
    };
  }
}

/**
 * 评估认知负荷
 * @param {Object} results - 结果对象
 * @param {Object} layout - 布局对象
 * @param {Object} domMeasurements - DOM测量数据
 */
function evaluateCognitiveLoad(results, layout, domMeasurements) {
  // 根据Miller法则(7±2法则)，人类短期记忆最佳处理范围
  // 计算视觉上重要的元素数量
  let highAttentionElements = 0;
  
  Object.keys(domMeasurements).forEach(id => {
    if (id === 'container') return;
    
    const measurement = domMeasurements[id];
    const element = findElementById(layout, id);
    
    // 判断元素是否高注意力元素
    let isHighAttention = false;
    
    // 1. 大型元素
    const area = measurement.width * measurement.height;
    const containerArea = 
      domMeasurements.container.width * domMeasurements.container.height;
    const relativeSizeRatio = area / containerArea;
    
    if (relativeSizeRatio > 0.15) { // 超过15%的视图区域
      isHighAttention = true;
    }
    
    // 2. 特定类型元素
    if (element) {
      if ((element.type === 'button' && element.appearancePreset === 'primary') || 
          (element.type === 'text' && element.typographyPreset?.startsWith('h')) ||
          element.importance === 'high') {
        isHighAttention = true;
      }
    }
    
    // 3. 高对比度元素
    if (measurement.style && 
        measurement.style.backgroundColor && 
        measurement.style.backgroundColor !== 'transparent' && 
        measurement.style.backgroundColor !== '#FFFFFF') {
      isHighAttention = true;
    }
    
    if (isHighAttention) {
      highAttentionElements++;
    }
  });

  
  // 评估认知负荷
  if (highAttentionElements > 9) { // 超过Miller法则上限
    const excessElements = highAttentionElements - 9;
    const penalty = Math.min(15, 5 + excessElements * 2);
    
    results.score -= penalty;
    
    results.details.push({
      type: 'warning',
      message: `布局包含${highAttentionElements}个高注意力元素，超过了认知负荷推荐上限(9个)，可能导致用户体验复杂化`
    });
    
    results.recommendations.push(
      '减少页面中高注意力元素的数量，将次要内容移至二级页面',
      '对高注意力元素进行分组或分层，降低用户的认知负担',
      '使用视觉层次结构来引导用户注意力，而不是通过多个突出元素争夺注意力'
    );
    
    results.calculations.cognitiveLoadPenalty = {
      highAttentionElements: highAttentionElements,
      threshold: 9,
      penalty: penalty
    };
  }
}


/**
 * 创建虚拟画布用于视觉分析
 * @param {number} size - 网格大小
 * @returns {Array} 虚拟画布的二维数组
 */
function createVirtualCanvas(size = 20) {
  const canvas = [];
  for (let y = 0; y < size; y++) {
    canvas[y] = [];
    for (let x = 0; x < size; x++) {
      canvas[y][x] = 0; // 初始化每个单元格的权重为0
    }
  }
  return canvas;
}

/**
 * 使用DOM测量数据填充密度图
 * @param {Object} element - 布局元素
 * @param {Array} densityMap - 密度图
 * @param {Object} domMeasurements - DOM测量数据对象，键为元素ID，值为位置和尺寸
 * @param {Object} position - 位置信息，用于递归
 */
function populateDensityMapWithDomData(element, densityMap, domMeasurements, position = { x: 0, y: 0, width: 1, height: 1 }) {

  if (!element || !element.id) return;

  const measurement = domMeasurements[element.id];


  if (!measurement) {
    // 如果没有测量数据，回退到估算方法
    populateDensityMap(element, densityMap, position);
    return;
  }

  const size = densityMap.length;
  const containerSize = domMeasurements.container || { width: 1000, height: 1000 }; // 默认容器尺寸

  // 将容器尺寸保存到测量对象中，供后续使用
  measurement.containerWidth = containerSize.width;
  measurement.containerHeight = containerSize.height;

  // 计算元素在画布上的相对位置和尺寸
  const relativeX = measurement.x / containerSize.width;
  const relativeY = measurement.y / containerSize.height;
  const relativeWidth = measurement.width / containerSize.width;
  const relativeHeight = measurement.height / containerSize.height;

  // 计算网格位置
  const startX = Math.floor(relativeX * size);
  const startY = Math.floor(relativeY * size);
  const endX = Math.min(size - 1, Math.floor((relativeX + relativeWidth) * size));
  const endY = Math.min(size - 1, Math.floor((relativeY + relativeHeight) * size));

  // 根据元素类型和视觉特征计算密度值
  let densityValue = calculateElementDensity(element, measurement);

  // 将密度值应用到网格
  for (let y = startY; y <= endY; y++) {
    for (let x = startX; x <= endX; x++) {
      if (y >= 0 && y < size && x >= 0 && x < size) {
        // 累加而不是替换，以表示重叠元素
        densityMap[y][x] += densityValue;
      }
    }
  }

  // 递归处理子元素
  if (element.children && element.children.length > 0) {
    element.children.forEach(child => {
      populateDensityMapWithDomData(child, densityMap, domMeasurements);
    });
  }
}

/**
 * 填充密度图（无DOM测量数据时的估算方法）
 * @param {Object} element - 布局元素
 * @param {Array} densityMap - 密度图
 * @param {Object} position - 位置信息
 */
function populateDensityMap(element, densityMap, position = { x: 0, y: 0, width: 1, height: 1 }) {
  if (!element) return;

  const size = densityMap.length;

  // 计算元素在画布上的位置
  const startX = Math.floor(position.x * size);
  const startY = Math.floor(position.y * size);
  const endX = Math.min(size - 1, Math.floor((position.x + position.width) * size));
  const endY = Math.min(size - 1, Math.floor((position.y + position.height) * size));

  // 根据元素类型计算密度值
  let densityValue = calculateElementDensity(element);

  // 应用内边距减少密度
  const hasPadding = element.paddingTop > 0 || element.paddingLeft > 0 ||
    element.paddingRight > 0 || element.paddingBottom > 0 ||
    (element.spacingPreset && element.spacingPreset !== 'compact');

  if (hasPadding) {
    densityValue *= 0.8; // 有内边距的元素密度降低
  }

  // 设置元素区域的密度值
  for (let y = startY; y <= endY; y++) {
    for (let x = startX; x <= endX; x++) {
      // 累加而不是替换，以表示重叠元素
      if (y >= 0 && y < size && x >= 0 && x < size) {
        densityMap[y][x] += densityValue;
      }
    }
  }

  // 递归处理子元素
  if (element.children && element.children.length > 0) {
    const isRow = element.direction === 'row';
    const childSize = isRow ? position.width / element.children.length : position.height / element.children.length;

    element.children.forEach((child, index) => {
      const childPos = isRow
        ? {
          x: position.x + (index * childSize),
          y: position.y,
          width: childSize,
          height: position.height
        }
        : {
          x: position.x,
          y: position.y + (index * childSize),
          width: position.width,
          height: childSize
        };

      populateDensityMap(child, densityMap, childPos);
    });
  }
}

/**
 * 计算单个元素的视觉密度值
 * @param {Object} element - 布局元素
 * @param {Object} measurement - DOM测量数据 (可选)
 * @returns {number} 密度值
 */
function calculateElementDensity(element, measurement = null) {
  // 基础密度值
  let densityValue = 10;

  // 根据元素类型计算更详细的密度值
  switch (element.type) {
    case 'text':
      // 文本元素密度取决于内容长度、字体大小和字重
      const text = element.content?.value || '';
      let textMultiplier = 1;


      // 根据DOM测量数据优化计算
      if (measurement) {
        // 使用实际测量的样式信息
        const style = measurement.style;

        // 计算字体大小影响
        if (style?.fontSize) {
          textMultiplier *= (style.fontSize / 16); // 16px作为基准字体大小
        } else if (element.typographyPreset) {
          // 标题有更高的视觉密度，使用预设
          if (element.typographyPreset === 'h1') textMultiplier *= 1.5;
          else if (element.typographyPreset === 'h2') textMultiplier *= 1.3;
          else if (element.typographyPreset === 'h3') textMultiplier *= 1.2;
        }

        // 计算文本内容密度
        if (measurement.textContent) {
          const textLength = measurement.textContent.length;
          const area = measurement.width * measurement.height;

          // 使用真实的文本密度计算
          if (area > 0) {
            // 字符密度（每平方像素的字符数）
            const charDensity = textLength / area * 10000; // 标准化
            densityValue = Math.min(45, 15 + charDensity * textMultiplier);

            // 加入行高因素 - 较大行高降低密度
            if (style?.lineHeight && style.fontSize) {
              const lineHeightRatio = style.lineHeight / style.fontSize;
              if (lineHeightRatio > 1.5) densityValue *= 0.85;
              else if (lineHeightRatio < 1.2) densityValue *= 1.15;
            }

            return densityValue;
          }
        }
      }


      // 根据文本属性调整密度
      if (element.style?.fontSize && typeof element.style.fontSize === 'number') {
        textMultiplier *= (element.style.fontSize / 16); // 16px作为基准字体大小
      }

      if (element.style?.fontWeight && typeof element.style.fontWeight === 'number') {
        textMultiplier *= (element.style.fontWeight / 400); // 400作为基准字重
      }

      if (element.typographyPreset) {
        // 标题有更高的视觉密度
        if (element.typographyPreset === 'h1') textMultiplier *= 1.5;
        else if (element.typographyPreset === 'h2') textMultiplier *= 1.3;
        else if (element.typographyPreset === 'h3') textMultiplier *= 1.2;
      }

      // 计算最终文本密度值
      densityValue = Math.min(40, 15 + (text.length / 20) * textMultiplier);
      break;

    case 'image':
    case 'background':
      // 图像密度取决于颜色复杂度、对比度等
      // 这里使用简化的估计，真实实现可考虑图像内容
      densityValue = 40;

      // 使用DOM测量数据进一步细化
      if (measurement) {
        // 图像尺寸对密度的影响
        const area = measurement.width * measurement.height;
        // 获取容器尺寸，确保使用传入的measurement相关的容器尺寸
        const containerArea = 
          (measurement.containerWidth || 1000) * 
          (measurement.containerHeight || 1000);

        // 根据图像占整体视图的比例调整
        const areaRatio = area / containerArea;

        if (areaRatio > 0.4) { // 大图像(超过40%的视图)
          densityValue = 50;
        } else if (areaRatio < 0.05) { // 小图像(小于5%的视图)
          densityValue = 30;
        }

        // 考虑图像位置 - 中央图像吸引更多注意力
        const centerX = 0.5;
        const centerY = 0.5;
        // 确保使用容器尺寸计算相对位置
        const containerWidth = measurement.containerWidth || 1000;
        const containerHeight = measurement.containerHeight || 1000;
        const relativeX = (measurement.x + measurement.width / 2) / containerWidth;
        const relativeY = (measurement.y + measurement.height / 2) / containerHeight;
        const distanceFromCenter = Math.sqrt(
          Math.pow(relativeX - centerX, 2) + Math.pow(relativeY - centerY, 2)
        );

        // 离中心越近，密度越高
        if (distanceFromCenter < 0.2) {
          densityValue += 10; // 中央图像密度更高
        }
      } else if (element.content?.src) {
        // 回退到原有计算
        if (element.style?.width && element.style?.height) {
          const area = element.style.width * element.style.height;
          if (area > 40000) densityValue = 45;
          else if (area < 10000) densityValue = 35;
        }
      }

      // 如果有src属性且有测量数据，可以进一步细化
      if (element.content?.src && measurement) {
        // 图像尺寸对密度的影响
        const area = measurement.width * measurement.height;
        if (area > 40000) { // 大图像
          densityValue = 45;
        } else if (area < 10000) { // 小图像
          densityValue = 35;
        }
      }
      break;

    case 'button':
      // 按钮密度取决于大小、内容和视觉样式
      densityValue = 30;

      // 考虑按钮状态
      if (element.appearancePreset === 'primary') {
        densityValue += 5; // 主要按钮更引人注目
      } else if (element.appearancePreset === 'ghost' || element.appearancePreset === 'text') {
        densityValue -= 5; // 幽灵按钮或文本按钮视觉密度较低
      }

      // 考虑按钮大小
      if (element.buttonSizePreset === 'btn-large') {
        densityValue += 5;
      } else if (element.buttonSizePreset === 'btn-small') {
        densityValue -= 5;
      }
      break;

    case 'container':
      // 容器本身密度较低，主要取决于其背景和边框
      densityValue = 5;

      // 使用DOM测量数据
      if (measurement && measurement.style) {
        // 有背景色的容器
        if (measurement.style.backgroundColor &&
          measurement.style.backgroundColor !== 'transparent' &&
          measurement.style.backgroundColor !== '#FFFFFF') {
          densityValue += 10;
        }

        // 有边框的容器
        if (measurement.style.borderWidth && measurement.style.borderWidth > 0) {
          densityValue += 5;
        }


        // 有内边距的容器密度较低（考虑留白空间）
        const hasPadding =
          (measurement.style.padding?.top > 10) ||
          (measurement.style.padding?.left > 10) ||
          (measurement.style.padding?.right > 10) ||
          (measurement.style.padding?.bottom > 10);


        if (hasPadding) {
          densityValue *= 0.8; // 有内边距的元素密度降低
        }

      } else {
        // 容器有背景色会增加密度
        if (element.style?.backgroundColor && element.style.backgroundColor !== 'transparent') {
          densityValue += 10;
        }

        // 容器有边框会增加密度
        if (element.style?.borderWidth && element.style.borderWidth > 0) {
          densityValue += 5;
        }
      }

      break;

    case 'input':
      // 输入框的密度
      densityValue = 25;
      break;

    case 'icon':
      // 图标密度
      densityValue = 20;
      break;

    case 'divider':
      // 分割线密度
      densityValue = 15;
      break;

    default:
      // 默认密度值
      densityValue = 10;
  }

  // 考虑元素重要性
  if (element.importance === 'high') {
    densityValue *= 1.2; // 重要元素增加密度权重
  } else if (element.importance === 'low') {
    densityValue *= 0.8; // 次要元素降低密度权重
  }

  return densityValue;
}

/**
 * 计算密度统计信息
 * @param {Array} densityMap - 密度图
 * @returns {Object} 统计信息
 */
function calculateDensityStatistics(densityMap) {
  const size = densityMap.length;
  let total = 0;
  const allValues = [];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const value = densityMap[y][x];
      total += value;
      allValues.push(value);
    }
  }

  const count = size * size;
  const average = total / count;

  // 计算标准差
  let sumSquaredDiff = 0;
  for (const value of allValues) {
    const diff = value - average;
    sumSquaredDiff += diff * diff;
  }

  const variance = sumSquaredDiff / count;
  const stdDev = Math.sqrt(variance);

  // 找出最大和最小密度
  const max = Math.max(...allValues);
  const min = Math.min(...allValues);

  // 计算四分位数以了解分布情况
  allValues.sort((a, b) => a - b);
  const q1Index = Math.floor(count * 0.25);
  const q2Index = Math.floor(count * 0.5);
  const q3Index = Math.floor(count * 0.75);

  // 计算密度分布的集中程度 (峰度)
  let sumKurtosis = 0;
  for (const value of allValues) {
    const diff = value - average;
    sumKurtosis += Math.pow(diff, 4);
  }
  const kurtosis = sumKurtosis / (count * Math.pow(stdDev, 4)) - 3;

  // 计算分布的偏斜度
  let sumSkewness = 0;
  for (const value of allValues) {
    const diff = value - average;
    sumSkewness += Math.pow(diff, 3);
  }
  const skewness = sumSkewness / (count * Math.pow(stdDev, 3));

  return {
    average,
    stdDev,
    max,
    min,
    q1: allValues[q1Index],
    median: allValues[q2Index],
    q3: allValues[q3Index],
    kurtosis,  // 新增：分布的尖峰度
    skewness,  // 新增：分布的偏斜度
    histogramData: generateHistogram(allValues)
  };
}

/**
 * 生成数据直方图
 * @param {Array} values - 数值数组
 * @param {number} bins - 分组数量
 * @returns {Array} 直方图数据
 */
function generateHistogram(values, bins = 10) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  const binSize = range / bins;

  // 创建分组
  const histogram = Array(bins).fill(0);

  // 将值分配到相应的分组
  values.forEach(value => {
    const binIndex = Math.min(bins - 1, Math.floor((value - min) / binSize));
    histogram[binIndex]++;
  });

  // 格式化结果，包含分组边界信息
  return histogram.map((count, i) => ({
    min: min + (i * binSize),
    max: min + ((i + 1) * binSize),
    count
  }));
}

/**
 * 根据布局类型和统计数据评估密度分数
 * @param {Object} results - 结果对象
 * @param {Object} densityStats - 密度统计信息
 * @param {Object} layout - 布局对象
 */
function evaluateDensityScore(results, densityStats, layout) {
  // 获取布局类型 (例如：文档、仪表板、登录页等)
  const layoutType = getLayoutType(layout);

  // 根据布局类型设置合适的密度范围
  let idealMin, idealMax, idealCenter;

  switch (layoutType) {
    case 'dashboard':
      // 仪表板类型通常允许较高的内容密度
      idealMin = 35;
      idealMax = 75;
      idealCenter = 55;
      break;
    case 'landing':
      // 宣传页面需要较低的内容密度，更多留白
      idealMin = 20;
      idealMax = 50;
      idealCenter = 35;
      break;
    case 'form':
      // 表单页面需要清晰的布局，中等密度
      idealMin = 25;
      idealMax = 60;
      idealCenter = 40;
      break;
    case 'article':
      // 文章页面需要舒适的阅读体验
      idealMin = 30;
      idealMax = 55;
      idealCenter = 42;
      break;
    default:
      // 默认通用范围
      idealMin = 30;
      idealMax = 60;
      idealCenter = 45;
  }

  // 记录相应布局类型的理想密度范围
  results.calculations.layoutTypeInfo = {
    type: layoutType,
    idealDensityRange: `${idealMin}-${idealMax}%`,
    idealCenter: `${idealCenter}%`
  };

  const average = densityStats.average;
  let score = 100;

  // 基于布局类型的理想范围评估分数
  if (average > idealMax) {
    // 密度过高，使用非线性惩罚公式，密度越高惩罚越严重
    const excessDensity = average - idealMax;
    const penalty = Math.min(50, 10 + excessDensity * (1 + excessDensity / 50));
    score -= penalty;

    results.details.push({
      type: 'warning',
      message: `布局内容密度过高 (${average.toFixed(1)}%)，超出了${layoutType}类型页面的理想范围 (${idealMin}-${idealMax}%)`
    });

    results.recommendations.push(
      '增加页面留白，特别是元素之间的间距',
      '考虑将部分内容移至二级页面或使用标签页/手风琴组件',
      '减少页面上同时显示的元素数量'
    );
  } else if (average < idealMin) {
    // 密度过低，使用二次函数惩罚
    const deficitDensity = idealMin - average;
    const penalty = Math.min(30, 5 + deficitDensity * deficitDensity / 10);
    score -= penalty;

    results.details.push({
      type: 'warning',
      message: `布局内容密度过低 (${average.toFixed(1)}%)，低于${layoutType}类型页面的理想范围 (${idealMin}-${idealMax}%)`
    });

    results.recommendations.push(
      '减少过大的空白区域',
      '适当增加页面内容或扩大内容区域',
      '使用更紧凑的排版以提高信息效率'
    );
  } else {
    // 密度适中，根据与理想中心点的接近程度评分
    const deviation = Math.abs(average - idealCenter);

    if (deviation < 5) {
      // 非常接近理想值，满分
      score = 100;
      results.details.push({
        type: 'success',
        message: `布局内容密度完美 (${average.toFixed(1)}%)，非常接近${layoutType}类型页面的理想值 (${idealCenter}%)`
      });
    } else {
      // 在理想范围内但有偏差
      const penalty = Math.min(20, deviation - 5);
      score -= penalty;
      results.details.push({
        type: 'success',
        message: `布局内容密度适中 (${average.toFixed(1)}%)，在${layoutType}类型页面的理想范围内 (${idealMin}-${idealMax}%)`
      });
    }
  }

  // 记录密度分数计算
  results.calculations.densityScore = {
    rawScore: score,
    averageDensity: average,
    layoutType: layoutType,
    idealRange: `${idealMin}-${idealMax}%`,
    formula: `基于${layoutType}类型的理想密度范围(${idealMin}-${idealMax}%)评估: ${score.toFixed(1)}`
  };

  results.score = score;
}

/**
 * 获取布局类型
 * @param {Object} layout - 布局对象
 * @returns {string} 布局类型
 */
function getLayoutType(layout) {
  // 尝试从布局元数据或结构中推断布局类型

  // 如果有明确的类型属性，直接使用
  if (layout.layoutType) {
    return layout.layoutType;
  }

  // 根据子元素类型和数量推断
  const elementCounts = countElementTypes(layout);

  if (elementCounts.form > 3 || elementCounts.input > 4) {
    return 'form';
  } else if (elementCounts.chart > 2 || elementCounts.data > 4 || elementCounts.card > 4) {
    return 'dashboard';
  } else if (elementCounts.heading > 0 && elementCounts.text > 3 && elementCounts.image < 3) {
    return 'article';
  } else if (elementCounts.heading > 0 && elementCounts.image > 1 && elementCounts.button > 0) {
    return 'landing';
  }

  // 默认返回通用类型
  return 'general';
}

/**
 * 递归计算各种元素类型的数量
 * @param {Object} element - 布局元素
 * @returns {Object} 元素类型计数
 */
function countElementTypes(element) {
  const counts = {
    form: 0,
    input: 0,
    button: 0,
    text: 0,
    heading: 0,
    image: 0,
    chart: 0,
    data: 0,
    card: 0
  };

  // 递归函数统计元素
  const countElements = (el) => {
    if (!el) return;

    // 根据类型或特性计数
    if (el.type === 'form') counts.form++;
    else if (el.type === 'input') counts.input++;
    else if (el.type === 'button') counts.button++;
    else if (el.type === 'image') counts.image++;
    else if (el.type === 'text') {
      if (el.typographyPreset?.startsWith('h') ||
        (el.style?.fontSize && el.style.fontSize > 18)) {
        counts.heading++;
      } else {
        counts.text++;
      }
    }
    else if (el.type === 'chart' || el.componentType === 'chart') counts.chart++;
    else if (el.type === 'data' || el.type === 'table') counts.data++;
    else if (el.type === 'card') counts.card++;

    // 递归处理子元素
    if (el.children && el.children.length > 0) {
      el.children.forEach(countElements);
    }
  };

  countElements(element);
  return counts;
}

/**
 * 评估密度变化
 * @param {Object} results - 结果对象
 * @param {Object} densityStats - 密度统计信息
 * @param {Array} densityMap - 密度图
 */
function evaluateDensityVariation(results, densityStats, densityMap) {
  // 根据标准差评估密度均匀性
  const { stdDev, average, kurtosis, skewness } = densityStats;

  // 标准差评估 - 根据平均密度调整阈值
  // 高密度布局可以容忍更高的标准差
  const stdDevThreshold = 20 + (average > 50 ? 5 : 0);

  // 偏斜度评估 - 偏斜度过高表示密度分布不均
  const skewnessThreshold = 1.5;

  // 峰度评估 - 峰度过高表示密度集中在特定区域
  const kurtosisThreshold = 2;

  let variationPenalty = 0;

  // 根据标准差评估
  if (stdDev > stdDevThreshold) {
    const stdDevPenalty = Math.min(20, (stdDev - stdDevThreshold) * 0.8);
    variationPenalty += stdDevPenalty;

    results.details.push({
      type: 'warning',
      message: `布局不同区域密度差异过大 (标准差: ${stdDev.toFixed(1)}%)，考虑更均匀地分布内容`
    });

    // 记录标准差扣分
    results.calculations.stdDevPenalty = {
      stdDev: stdDev,
      threshold: stdDevThreshold,
      penalty: stdDevPenalty,
      formula: `(${stdDev.toFixed(1)} - ${stdDevThreshold}) * 0.8 = -${stdDevPenalty.toFixed(1)}`
    };

    // 添加改进建议
    results.recommendations.push(
      '使内容分布更加均匀，避免某些区域过度拥挤而其他区域过于空旷',
      '考虑使用网格系统来更好地组织布局元素'
    );
  }

  // 根据偏斜度评估
  if (Math.abs(skewness) > skewnessThreshold) {
    const skewnessPenalty = Math.min(10, (Math.abs(skewness) - skewnessThreshold) * 4);
    variationPenalty += skewnessPenalty;

    const skewDirection = skewness > 0 ? '右偏(高密度区域集中)' : '左偏(低密度区域集中)';

    results.details.push({
      type: 'warning',
      message: `布局密度分布不均 (偏斜度: ${skewness.toFixed(2)}, ${skewDirection})，某些区域密度明显高于其他区域`
    });

    // 记录偏斜度扣分
    results.calculations.skewnessPenalty = {
      skewness: skewness,
      threshold: skewnessThreshold,
      penalty: skewnessPenalty,
      direction: skewDirection
    };
  }

  // 根据峰度评估
  if (kurtosis > kurtosisThreshold) {
    const kurtosisPenalty = Math.min(10, (kurtosis - kurtosisThreshold) * 3);
    variationPenalty += kurtosisPenalty;

    results.details.push({
      type: 'warning',
      message: `布局密度分布尖峰化 (峰度: ${kurtosis.toFixed(2)})，密度过度集中在特定区域`
    });

    // 记录峰度扣分
    results.calculations.kurtosisPenalty = {
      kurtosis: kurtosis,
      threshold: kurtosisThreshold,
      penalty: kurtosisPenalty
    };
  }

  // 应用总变异惩罚
  results.score -= variationPenalty;
  results.calculations.variationPenalty = variationPenalty;
}

/**
 * 找出密度问题区域并评估
 * @param {Object} results - 结果对象
 * @param {Array} densityMap - 密度图
 * @param {Object} layout - 布局对象 
 */
function identifyProblemAreas(results, densityMap, layout) {
  // 根据布局类型设置不同的阈值
  const layoutType = results.calculations.layoutTypeInfo?.type || 'general';

  let densityThreshold;
  switch (layoutType) {
    case 'dashboard': densityThreshold = 85; break; // 仪表板允许较高密度
    case 'landing': densityThreshold = 65; break;   // 宣传页面要求较低密度
    case 'form': densityThreshold = 75; break;      // 表单页面中等密度
    case 'article': densityThreshold = 70; break;   // 文章页面适中密度
    default: densityThreshold = 75;                 // 默认阈值
  }

  // 区分不同严重程度的问题区域
  const severeThreshold = densityThreshold + 25;  // 严重问题区域阈值

  // 找出常规问题区域
  const problemAreas = findDensityProblemAreas(densityMap, densityThreshold);

  // 找出严重问题区域
  const severeProblemAreas = findDensityProblemAreas(densityMap, severeThreshold);

  // 标记不同严重程度的问题区域
  problemAreas.forEach(area => {
    // 检查该区域是否也是严重问题区域
    const isSevere = severeProblemAreas.some(severeArea =>
      severeArea.cells.some(severeCell =>
        area.cells.some(cell => cell.x === severeCell.x && cell.y === severeCell.y)
      )
    );

    area.severity = isSevere ? 'high' : 'medium';
  });

  results.problemAreas = problemAreas;

  // 处理问题区域扣分
  if (problemAreas.length > 0) {
    // 根据问题区域数量、大小和严重程度计算扣分
    let areaPenalty = Math.min(15, problemAreas.length * 3);

    // 严重问题区域额外扣分
    const severeCount = problemAreas.filter(area => area.severity === 'high').length;
    areaPenalty += Math.min(15, severeCount * 5);

    // 应用扣分
    results.score -= areaPenalty;

    // 添加详情
    results.details.push({
      type: 'warning',
      message: `检测到${problemAreas.length}个高密度区域，其中${severeCount}个区域密度严重过高`
    });

    // 记录问题区域扣分
    results.calculations.problemAreaPenalty = {
      totalAreas: problemAreas.length,
      severeAreas: severeCount,
      penalty: areaPenalty,
      formula: `基本扣分 ${Math.min(15, problemAreas.length * 3)} + 严重区域扣分 ${Math.min(15, severeCount * 5)} = -${areaPenalty}`
    };

    // 为每个问题区域添加详细数据
    results.calculations.problemAreas = problemAreas.map((area, index) => ({
      id: index + 1,
      size: area.size,
      density: area.avgDensity.toFixed(1) + '%',
      severity: area.severity,
      location: `网格区域: ${area.cells[0].x},${area.cells[0].y} 周围`
    }));

    // 添加改进建议
    if (severeCount > 0) {
      results.recommendations.push(
        '优先处理密度极高的区域，考虑将部分内容移至其他页面或组件',
        '增加严重问题区域的内边距和元素间距'
      );
    }

    results.recommendations.push(
      '重新组织高密度区域的元素布局，考虑使用折叠/展开组件',
      '调整元素大小，减少这些区域的视觉复杂度'
    );
  }
}

/**
 * 添加上下文相关的密度改进建议
 * @param {Object} results - 结果对象
 * @param {Object} layout - 布局对象
 */
function addContextualRecommendations(results, layout) {
  const layoutType = results.calculations.layoutTypeInfo?.type || 'general';
  const elementCounts = countElementTypes(layout);

  // 如果已有改进建议，就不添加通用建议
  if (results.recommendations.length > 0) {
    return;
  }

  // 根据布局类型添加通用建议
  switch (layoutType) {
    case 'dashboard':
      results.recommendations.push(
        '考虑使用标签页或手风琴组件来分组显示数据',
        '使用卡片组件为不同数据集创建清晰的视觉边界',
        '保持一致的数据可视化样式以减少认知负担'
      );
      break;

    case 'landing':
      results.recommendations.push(
        '增加页面留白，特别是关键内容周围的空间',
        '使用视觉层次结构突出重要内容',
        '限制页面上的CTA按钮数量，避免选择困难'
      );
      break;

    case 'form':
      results.recommendations.push(
        '分组相关的表单字段，增加字段组之间的间距',
        '使用明确的分隔符或卡片区分表单的不同部分',
        '考虑多步骤表单以减少单页面的内容密度'
      );
      break;

    case 'article':
      results.recommendations.push(
        '增加文本行高以提高可读性',
        '使用适当的段落间距来区分内容',
        '将长文本分成更小的段落，并使用小标题划分内容'
      );
      break;

    default:
      results.recommendations.push(
        '保持一致的间距系统以创建有条理的布局',
        '使用分组和层次结构组织内容',
        '考虑使用折叠/展开组件来简化初始视图'
      );
  }
}

/**
 * 找出密度问题区域
 * @param {Array} densityMap - 密度图
 * @param {number} threshold - 密度阈值
 * @returns {Array} 问题区域数组
 */
function findDensityProblemAreas(densityMap, threshold = 75) {
  const size = densityMap.length;
  const problemAreas = [];

  // 简单聚类方法找出密度过高的区域
  const visited = Array(size).fill().map(() => Array(size).fill(false));

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (densityMap[y][x] > threshold && !visited[y][x]) {
        // 找到一个高密度点，执行广度优先搜索找到整个连通区域
        const area = { cells: [], avgDensity: 0 };
        const queue = [{ x, y }];
        visited[y][x] = true;

        let totalDensity = 0;
        let cellCount = 0;

        while (queue.length > 0) {
          const cell = queue.shift();
          area.cells.push(cell);
          totalDensity += densityMap[cell.y][cell.x];
          cellCount++;

          // 检查相邻单元格
          const directions = [
            { dx: 1, dy: 0 }, { dx: -1, dy: 0 },
            { dx: 0, dy: 1 }, { dx: 0, dy: -1 }
          ];

          for (const dir of directions) {
            const nx = cell.x + dir.dx;
            const ny = cell.y + dir.dy;

            if (nx >= 0 && nx < size && ny >= 0 && ny < size &&
              densityMap[ny][nx] > threshold && !visited[ny][nx]) {
              queue.push({ x: nx, y: ny });
              visited[ny][nx] = true;
            }
          }
        }

        // 如果区域足够大，添加到问题区域列表
        if (cellCount >= 2) {
          area.avgDensity = totalDensity / cellCount;
          area.size = cellCount;
          problemAreas.push(area);
        }
      }
    }
  }

  return problemAreas;
}

/**
 * 准备用于可视化的数据
 * @param {Array} densityMap - 密度图
 * @returns {Object} 格式化后的可视化数据
 */
function prepareVisualizationData(densityMap) {
  const size = densityMap.length;
  // 为热图准备数据
  const heatmapData = [];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      heatmapData.push({
        x,
        y,
        value: densityMap[y][x]
      });
    }
  }

  // 生成颜色范围数据 - 使用热图颜色以更直观地表示密度
  const colorRange = generateColorRange();

  return {
    heatmapData,
    colorRange,
    gridSize: size
  };
}

/**
 * 生成热图的颜色范围 - 使用更直观的热力图配色方案
 * @returns {Array} 颜色范围数据
 */
function generateColorRange() {
  return [
    { value: 0, color: '#FFFFFF' },    // 白色 - 无内容
    { value: 20, color: '#E3F5FD' },   // 非常浅的蓝色 - 极低密度
    { value: 40, color: '#C2E8F9' },   // 浅蓝色 - 低密度
    { value: 60, color: '#A1D9F5' },   // 中蓝色 - 中密度
    { value: 80, color: '#74C6EC' },   // 蓝色 - 中高密度
    { value: 100, color: '#4FB0E3' },  // 深蓝色 - 高密度
    { value: 120, color: '#F99D45' },  // 橙色 - 过高密度
    { value: 140, color: '#E94A3D' }   // 红色 - 极高密度
  ];
}