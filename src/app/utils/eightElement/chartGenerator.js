/**
 * chartGenerator.js
 * 
 * 用于生成D3可视化图表的工具函数
 * 支持从表格数据生成各种类型的图表
 * 使用jsdom创建服务器端虚拟DOM环境来利用d3的全部功能
 * 
 * ⚠️  此模块仅在服务端使用（需要 jsdom）
 */

import * as d3 from 'd3';
import { COLOR_CONSTANTS } from './styles';
import resolveToken from '../tokens/resolveToken.js';

// ✅ 浏览器环境检测 - 防止在客户端构建时失败
const isBrowser = typeof window !== 'undefined';

const legendConfig = {
  fontSize: "14px",
  fontWeight: "400",
  fill: "{color.onsurface.black88}",
}

const axisConfig = {
  fontSize: "14px",
  fontWeight: "400",
  fill: "{color.onsurface.black88}",
}


const smallAxisConfig = {
  fontSize: "{font.size.medium}",
  fontWeight: "400",
  fill: "{color.onsurface.black88}",
}

const smalllegendConfig = {
  fontSize: "{font.size.medium}",
  fontWeight: "400",
  fill: "{color.onsurface.black88}",
}

const titleConfig = {
  fontSize: "{font.size.xl}",
  fontWeight: "400",
  fill: "{color.onsurface.black88}",
}

const hasBrowserDom = typeof window !== 'undefined' && typeof window.document !== 'undefined';
let cachedJsdomClass;

function tryLoadJsdom() {
  if (cachedJsdomClass !== undefined) {
    return cachedJsdomClass;
  }

  if (hasBrowserDom) {
    cachedJsdomClass = null;
    return cachedJsdomClass;
  }

  const globalJsdom =
    (typeof globalThis !== 'undefined' && (globalThis.JSDOM || globalThis.jsdom || globalThis.__JSDOM__)) ||
    null;

  if (globalJsdom) {
    cachedJsdomClass = globalJsdom;
    return cachedJsdomClass;
  }

  // ✅ 只在服务端环境尝试加载 jsdom
  if (typeof require === 'function' && !isBrowser) {
    try {
      // 使用动态 require 避免 Turbopack 构建时错误
      const jsdomModule = eval('require')('jsdom');
      cachedJsdomClass = jsdomModule?.JSDOM || jsdomModule?.default?.JSDOM || jsdomModule?.default || null;
      return cachedJsdomClass;
    } catch (error) {
      console.warn('[psuip] 加载 jsdom 失败，将在无 DOM 环境禁用图表渲染：', error);
    }
  }

  cachedJsdomClass = null;
  return cachedJsdomClass;
}

function createDocumentContext(width = 800, height = 500) {
  if (hasBrowserDom) {
    const doc =
      window.document?.implementation?.createHTMLDocument('psuip-chart') ||
      window.document.cloneNode(false) ||
      window.document;
    if (!doc.body) {
      doc.appendChild(doc.createElement('body'));
    }
    return { document: doc, cleanup: () => {} };
  }

  const JsdomClass = tryLoadJsdom();
  if (!JsdomClass) {
    throw new Error(
      'PSUIP chartGenerator 需要 DOM 环境。请在 Node 端安装 jsdom，或手动注入 window/document。'
    );
  }

  const dom = new JsdomClass(`<!DOCTYPE html><html><body></body></html>`, {
    pretendToBeVisual: true,
    url: 'http://localhost/',
    width,
    height
  });

  return {
    document: dom.window.document,
    cleanup: () => {
      if (typeof dom.window.close === 'function') {
        dom.window.close();
      }
    }
  };
}

/**
 * 创建渲染所需的 DOM/SVG 环境
 * @param {number} width - SVG宽度
 * @param {number} height - SVG高度
 * @returns {Object} - 包含document和svg引用的环境
 */
function createJsdomEnv(width = 800, height = 500) {
  const { document, cleanup } = createDocumentContext(width, height);
  const host = document.createElement('div');
  document.body?.appendChild(host);

  const svg = d3
    .select(host)
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'none')
    .attr('xmlns', 'http://www.w3.org/2000/svg')
    .style('width', '100%')
    .style('height', '100%')
    .style('display', 'block')
    .style('min-height', '200px');

  const colorBrand6 = resolveColor(COLOR_CONSTANTS.PRIMARY.BRAND6);
  const colorBrand5 = resolveColor(COLOR_CONSTANTS.PRIMARY.BRAND5);
  const colorBrand4 = resolveColor(COLOR_CONSTANTS.PRIMARY.BRAND4);

  const defs = svg.append('defs');
  defs.append('style').text(`
    .axis line, .axis path {
      stroke: #bdbdbd;
      shape-rendering: crispEdges;
    }

    .grid line {
      stroke: #e0e0e0;
      stroke-opacity: 0.7;
      shape-rendering: crispEdges;
    }
    .grid path {
      stroke-width: 0;
    }
    .line {
      fill: none;
      stroke-width: 2.5;
    }
    .dot {
      stroke: #fff;
      stroke-width: 1;
    }
    .dot-color-brand6 {
      fill: ${colorBrand6}; 
    }
    .dot-color-brand5 {
      fill: ${colorBrand5}; 
    }
    .dot-color-brand4 {
      fill: ${colorBrand4}; 
    }
    .line-color-brand6 {
      stroke: ${colorBrand6}; 
    }
    .line-color-brand5 {
      stroke: ${colorBrand5}; 
    }
    .line-color-brand4 {
      stroke: ${colorBrand4}; 
    }
    .data-label-color-brand6 {
      fill: ${colorBrand6}; 
    }
    .data-label-color-brand5 {
      fill: ${colorBrand5}; 
    }
    .data-label-color-brand4 {
      fill: ${colorBrand4}; 
    }
    .bar {
      fill-opacity: 0.8;
    }
    .bar:hover {
      fill-opacity: 1;
    }
    .bar-color-brand6 {
      fill: ${colorBrand6}; 
    }
    .bar-color-brand5 {
      fill: ${colorBrand5}; 
    }
    .bar-color-brand4 {
      fill: ${colorBrand4}; 
    }
    .area {
      fill-opacity: 0.6;
    }
    .area-color-brand6 {
      fill: ${colorBrand6}; 
    }
    .area-color-brand5 {
      fill: ${colorBrand5}; 
    }
    .area-color-brand4 {
      fill: ${colorBrand4}; 
    }
    .donut {
      fill-opacity: 1;
    }
    .donut-color-brand6 {
      fill: ${colorBrand6}; 
    }
    .donut-color-brand5 {
      fill: ${colorBrand5}; 
    }
    .donut-color-brand4 {
      fill: ${colorBrand4}; 
    }
  `);

  return {
    document,
    svg,
    body: document.body,
    cleanup: () => {
      if (host.parentNode) {
        host.parentNode.removeChild(host);
      }
      cleanup?.();
    }
  };
}

// 解析颜色tokens
function resolveColor(color) {
  if (typeof color === 'string' && color.startsWith('{') && color.endsWith('}')) {
    return resolveToken(color) || color;
  }
  return color;
}

/**
 * 在图表 SVG 内绘制背景 rect（作为第一个子元素，位于最底层）
 * 配置了 chartBackgroundColor 时，背景色已应用到外层容器，此处用 transparent 避免两层半透明叠加。
 * @param {Object} svg - D3 的 svg 选择
 * @param {number} width - SVG 宽度
 * @param {number} height - SVG 高度
 * @param {Object} chartStyleConfig - 可含 chartBackgroundColor（token 或 hex）
 */
function applyChartSvgBackground(svg, width, height, chartStyleConfig = null) {
  const bg = chartStyleConfig?.chartBackgroundColor;
  if (bg == null) return;
  if (String(bg).toLowerCase() === 'transparent') return;
  svg.insert('rect', ':first-child')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', width)
    .attr('height', height)
    .attr('fill', 'transparent');
}

/**
 * 从 chartStyleConfig.chartColors 解析出 colorValues 与 colorClass，供图表透传颜色使用。
 * 颜色与内容对应：chartColors[i] 固定对应「第 i 个」数据维度（第 i 个系列/第 i 根柱子/第 i 个扇形），
 * 图例与图形按同一顺序使用，多出部分循环取色。
 * @param {Object} chartStyleConfig - 图表样式配置，可含 chartColors 数组（建议 design token）
 * @param {Object} defaultColors - 默认 { colorValues, colorClass }
 * @returns {{ colorValues: string[], colorClass: string[], useCustomColors: boolean }}
 */
function getChartColorsFromConfig(chartStyleConfig = null, defaultColors = {}) {
  const custom = chartStyleConfig?.chartColors;
  if (custom && Array.isArray(custom) && custom.length > 0) {
    const colorValues = custom.map(c => resolveColor(c));
    const colorClass = colorValues.map((_, i) => `color-custom-${i}`);
    return { colorValues, colorClass, useCustomColors: true };
  }
  return {
    colorValues: defaultColors.colorValues || [],
    colorClass: defaultColors.colorClass || [],
    useCustomColors: false
  };
}

/** 从 chartStyleConfig 解析轴样式（优先使用透传的 axis.fill/stroke/fontSize，否则用默认 axisConfig） */
function getResolvedAxisStyle(displayConfig, chartStyleConfig) {
  const base = displayConfig?.isSmallChart ? smallAxisConfig : axisConfig;
  const fill = chartStyleConfig?.axis?.fill != null ? (resolveToken(chartStyleConfig.axis.fill) || resolveColor(chartStyleConfig.axis.fill)) : resolveToken(base.fill);
  const stroke = chartStyleConfig?.axis?.stroke != null ? (resolveToken(chartStyleConfig.axis.stroke) || resolveColor(chartStyleConfig.axis.stroke)) : null;
  const fontSize = chartStyleConfig?.axis?.fontSize != null ? (resolveToken(chartStyleConfig.axis.fontSize) || chartStyleConfig.axis.fontSize) : resolveToken(base.fontSize);
  const fontWeight = chartStyleConfig?.axis?.fontWeight != null ? (resolveToken(chartStyleConfig.axis.fontWeight) || chartStyleConfig.axis.fontWeight) : resolveToken(base.fontWeight);
  return { fill: fill || '#666', stroke: stroke || '#666', fontSize, fontWeight: fontWeight || '400' };
}

/** 从 chartStyleConfig 解析图例文字样式 */
function getResolvedLegendStyle(displayConfig, chartStyleConfig) {
  const base = displayConfig?.isSmallChart ? smalllegendConfig : legendConfig;
  const fill = chartStyleConfig?.legend?.fill != null ? (resolveToken(chartStyleConfig.legend.fill) || resolveColor(chartStyleConfig.legend.fill)) : resolveToken(base.fill);
  const fontSize = chartStyleConfig?.legend?.fontSize != null ? (resolveToken(chartStyleConfig.legend.fontSize) || chartStyleConfig.legend.fontSize) : resolveToken(base.fontSize);
  const fontWeight = chartStyleConfig?.legend?.fontWeight != null ? (resolveToken(chartStyleConfig.legend.fontWeight) || chartStyleConfig.legend.fontWeight) : resolveToken(base.fontWeight);
  return { fill: fill || '#666', fontSize, fontWeight: fontWeight || '400' };
}

/** 从 chartStyleConfig 解析图表标题样式 */
function getResolvedTitleStyle(chartStyleConfig) {
  const fill = chartStyleConfig?.title?.fill != null ? (resolveToken(chartStyleConfig.title.fill) || resolveColor(chartStyleConfig.title.fill)) : resolveToken(titleConfig.fill);
  const fontSize = chartStyleConfig?.title?.fontSize != null ? (resolveToken(chartStyleConfig.title.fontSize) || chartStyleConfig.title.fontSize) : resolveToken(titleConfig.fontSize);
  const fontWeight = chartStyleConfig?.title?.fontWeight != null ? (resolveToken(chartStyleConfig.title.fontWeight) || chartStyleConfig.title.fontWeight) : resolveToken(titleConfig.fontWeight);
  return { fill: fill || '#111', fontSize, fontWeight: fontWeight || '400' };
}

/** 从 chartStyleConfig 解析网格线样式 */
function getResolvedGridStyle(chartStyleConfig) {
  const stroke = chartStyleConfig?.grid?.stroke != null ? (resolveToken(chartStyleConfig.grid.stroke) || resolveColor(chartStyleConfig.grid.stroke)) : '#e0e0e0';
  const strokeOpacity = chartStyleConfig?.grid?.strokeOpacity != null ? chartStyleConfig.grid.strokeOpacity : 0.7;
  return { stroke, strokeOpacity };
}

/** 从 chartStyleConfig 解析柱顶数值标签样式（未配置时回退到 axis 样式） */
function getResolvedDataLabelStyle(displayConfig, chartStyleConfig, axisStyleFallback) {
  const dl = chartStyleConfig?.dataLabel;
  const fill = dl?.fill != null ? (resolveToken(dl.fill) || resolveColor(dl.fill)) : (axisStyleFallback?.fill || '#666');
  const fontSize = dl?.fontSize != null ? (resolveToken(dl.fontSize) || dl.fontSize) : (axisStyleFallback?.fontSize || displayConfig?.dataLabelSize || '8px');
  return { fill, fontSize };
}

/**
 * 向 SVG 的 defs 中注入图表主题样式（轴体、网格、图例、标题），用 CSS 覆盖默认 defs，便于外部再用 CSS 覆盖
 * @param {Object} svg - D3 的 svg 选择
 * @param {Object} options - { axisStyle, gridStyle, legendStyle, titleStyle }，可为 null 则跳过对应项
 */
function injectChartThemeStyle(svg, options = {}) {
  const { axisStyle, gridStyle, legendStyle, titleStyle } = options;
  const rules = [];
  if (axisStyle) {
    rules.push(`.axis line, .axis path { stroke: ${axisStyle.stroke}; }`);
    rules.push(`.axis text { fill: ${axisStyle.fill}; }`);
  }
  if (gridStyle) {
    rules.push(`.grid line { stroke: ${gridStyle.stroke}; stroke-opacity: ${gridStyle.strokeOpacity}; }`);
  }
  if (legendStyle) {
    rules.push(`.legend text { fill: ${legendStyle.fill}; }`);
  }
  if (titleStyle) {
    rules.push(`.ee-chart-title-wrap text { fill: ${titleStyle.fill}; }`);
  }
  if (rules.length === 0) return;
  const defs = svg.select('defs');
  if (!defs.empty()) {
    defs.append('style').attr('type', 'text/css').attr('data-chart-theme', 'true').text(rules.join('\n'));
  }
}

/**
 * 生成图例
 * @param {Object} g - D3图表组
 * @param {number} innerHeight - 图表内部高度
 * @param {Array} items - 图例项数组，每个项包含 { label, color, colorClass, type, style? }
 * @param {Object} displayConfig - 显示配置
 * @param {Object} chartStyleConfig - 图表样式配置
 * @param {number} yOffset - Y轴偏移量，默认为80
 * @returns {Object} - 图例组对象
 */
function generateLegend(g, innerHeight, items, displayConfig, chartStyleConfig, yOffset = 80) {
  // 添加图例 - 将图例显示在图表下方
  const legend = g.append('g')
    .attr('class', 'legend')
    .attr('transform', `translate(0, ${innerHeight + yOffset})`);
  
  // 🆕 动态计算图例位置 - 调整间距避免重叠
  const legendItemWidth = displayConfig.isSmallChart ? 140 : 160; 
  const legendItemHeight = displayConfig.isSmallChart ? 20 : 24;
  const legendItemsPerRow = Math.min(6, items.length);
  
  items.forEach((item, i) => {
    const row = Math.floor(i / legendItemsPerRow);
    const col = i % legendItemsPerRow;
    const x = col * legendItemWidth;
    const y = row * legendItemHeight;
    
    const legendItem = legend.append('g')
      .attr('transform', `translate(${x}, ${y})`);
    
    // 图例色块使用 item.color（透传颜色或默认解析色），无则回退 #000 依赖外部 CSS
    const legendColor = item.color || '#000';
    // 根据图例类型绘制不同的样式示例
    if (item.type === 'line') {
      // 绘制线样式示例
      legendItem.append('line')
        .attr('x1', 0)
        .attr('y1', 6)
        .attr('x2', 15)
        .attr('y2', 6)
        .attr('class', `line line-${item.colorClass}`)
        .attr('stroke', legendColor)
        .attr('stroke-width', item.style?.strokeWidth || 2.5)
        .attr('stroke-dasharray', item.style?.dashArray || '0');
      
      // 添加小圆点
      legendItem.append('circle')
        .attr('cx', 8)
        .attr('cy', 6)
        .attr('r', 3)
        .attr('class', `dot dot-${item.colorClass}`)
        .attr('fill', legendColor)
        .attr('stroke', '#fff')
        .attr('stroke-width', 1);
    } else if (item.type === 'bar') {
      // 绘制柱状图样式示例（与柱子颜色一致）
      legendItem.append('rect')
        .attr('width', 15)
        .attr('height', 12)
        .attr('class', `bar bar-${item.colorClass}`)
        .attr('fill', legendColor);
    } else if (item.type === 'area') {
      // 绘制面积图样式示例
      legendItem.append('path')
        .attr('d', 'M0,12 L15,3 L15,12 Z')
        .attr('class', `area area-${item.colorClass}`)
        .attr('fill', legendColor)
        .attr('fill-opacity', item.style?.fillOpacity || 0.6)
        .attr('stroke', legendColor)
        .attr('stroke-width', item.style?.strokeWidth || 2);
    } else if (item.type === 'donut') {
      // 绘制环状图样式示例
      legendItem.append('circle')
        .attr('cx', 7.5)
        .attr('cy', 6)
        .attr('r', 6)
        .attr('class', `donut donut-${item.colorClass}`)
        .attr('fill', legendColor)
        .attr('stroke', '#fff')
        .attr('stroke-width', 1);
    }
    
    // 获取图例样式配置（优先使用透传的 chartStyleConfig.legend）
    const legendClassName = chartStyleConfig?.legend?.className || 'legend-label';
    const legendStyle = getResolvedLegendStyle(displayConfig, chartStyleConfig);
    
    // 添加图例文字
    const text = legendItem.append('text')
      .attr('class', legendClassName)
      .attr('x', 20)
      .attr('y', 9)
      .attr('font-size', legendStyle.fontSize || displayConfig.legendLabelSize || '8px')
      .attr('font-weight', legendStyle.fontWeight || '400')
      .attr('fill', legendStyle.fill || '#666')
      .attr('alignment-baseline', 'middle')
      .text(item.label);
    
    // 如果文字太长，截断并添加省略号
    const maxTextLength = displayConfig.isSmallChart ? 120 : 130;
    const truncateText = (text, maxLength) => {
      const node = text.node();
      if (node) {
        const textLength = node.getComputedTextLength ? node.getComputedTextLength() : item.label.length * 6;
        if (textLength > maxLength) {
          const approxChars = Math.floor((maxLength / textLength) * item.label.length) - 3;
          text.text(item.label.substring(0, approxChars) + '...');
        }
      }
    };
    
    truncateText(text, maxTextLength);
  });
  
  return legend;
}

/**
 * 从表格数据生成折线图
 * @param {Array} tableData - 二维数组表格数据
 * @param {string} chartType - 图表类型
 * @param {Object} chartStyleConfig - 图表样式配置（包含title、legend、axis的className和classStyle）
 * @param {string} chartTitle - 图表标题（可选）
 * @returns {string} - SVG图表的HTML字符串
 */
export function generateChartFromTableData(tableData, chartType, chartStyleConfig = null, chartTitle = null) {
  try {    
    // 确保至少有标题行和一行数据
    if (!tableData || tableData.length < 2) {
      throw new Error('图表数据不足，至少需要标题行和一行数据');
    }
    
    // 🆕 特殊类型：tree_mind 树状图
    if (chartType === 'tree_mind') {
      return generateTreeMindChart(tableData, chartTitle);
    }

    // 设置图表尺寸和边距
    // 🆕 增大基础尺寸，让图表占满容器，特别是为柱状图增加更多底部空间
    const width = 600;  // 增大宽度，充分利用容器空间
    const height = 600; // 增加高度，为图例留出更多空间
    // 🆕 根据图表宽度动态调整显示参数
    const isSmallChart = chartStyleConfig?.variant === 'small'
    // 🆕 根据是否为小图表优化边距，增加底部边距为图例留空间
    const optimizedMargin = isSmallChart ? 
      { top: 15, right: 20, bottom: 120, left: 80 } :   
      { top: 40, right: 50, bottom: 120, left: 90 };  
    
    const margin = optimizedMargin;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    
    const displayConfig = {
      // 🆕 添加 isSmallChart 标识
      isSmallChart: isSmallChart,
      // 坐标轴刻度数量
      yTickCount: isSmallChart ? 3 : 5,
      xLabelRotation: isSmallChart ? 30 : 45, // 🆕 小图表使用30度旋转，避免重叠又保持可读性
      // 字体大小 - 🆕 进一步增大小图表的字体差异，特别是轴标题
      axisLabelSize: isSmallChart ? '20px' : '10px',     // 小图表轴标签显著更大，非小图表调小 (12px→10px)
      dataLabelSize: isSmallChart ? '16px' : '8px',      // 小图表数据标签显著更大，非小图表调小 (10px→8px)
      legendLabelSize: isSmallChart ? '16px' : '8px',    // 小图表图例显著更大，非小图表调小 (10px→8px)
      // 显示策略 - 🆕 调整X轴标签显示策略
      showEveryNthXLabel: 1, // 🆕 总是显示所有X轴标签，通过旋转和字体大小解决拥挤问题
      dotRadius: isSmallChart ? 7 : 4,          // 🆕 小图表点显著更大
      strokeWidth: isSmallChart ? 5 : 2.5       // 🆕 小图表线显著更粗
    };
    
    // 提取标题行和数据行
    const headers = tableData[0];
    const rows = tableData.slice(1);
    
    // 日期列是第一列
    const dateField = headers[0];
    
    // 其他列是值
    const valueFields = headers.slice(1);
    
    // 处理数据，转换为适合绘图的格式
    let chartData = rows.map(row => {
      const item = { [dateField]: row[0] };
      valueFields.forEach((field, i) => {
        // 尝试转换为数字，如果失败则保留为0
        item[field] = parseFloat(row[i + 1]) || 0;
      });
      return item;
    });

    // Sort chartData by date ascending ONLY for line charts to ensure X-axis is chronological LTR
    // For bar charts, maintain original data order
    if (chartType === 'line' || chartType === 'grouped_line' || chartType === 'area_chart') {
        chartData.sort((a, b) => {
            // Assuming dateField contains date strings in a format sortable (e.g., YYYY-MM-DD)
            if (a[dateField] < b[dateField]) {
                return -1;
            }
            if (a[dateField] > b[dateField]) {
                return 1;
            }
            return 0;
        });
    }
    // For bar charts (bar, barh, pie, donut_chart), maintain original order
    
    // 根据图表类型生成不同的图表
    switch(chartType) {
      case 'grouped_line':
        return generateGroupedLineChart(chartData, dateField, valueFields, width, height, margin, chartStyleConfig, displayConfig, chartTitle);
      case 'line':
        return generateGroupedLineChart(chartData, dateField, valueFields, width, height, margin, chartStyleConfig, displayConfig, chartTitle);
      case 'area_chart':
        return generateAreaChart(chartData, dateField, valueFields, width, height, margin, chartStyleConfig, displayConfig, chartTitle);
      case 'bar':
        return generateBarChart(chartData, dateField, valueFields, width, height, margin, chartStyleConfig, displayConfig, chartTitle);
      case 'barh':
        return generateBarHChart(chartData, dateField, valueFields, width, height, margin, chartStyleConfig, displayConfig, chartTitle);
      case 'pie':
        return generatePieChart(chartData, dateField, valueFields, width, height, margin, chartStyleConfig, displayConfig, chartTitle);
      case 'donut_chart':
        return generateDonutChart(chartData, dateField, valueFields, width, height, margin, chartStyleConfig, displayConfig, chartTitle);
      default:
        // 默认使用分组折线图
        return generateGroupedLineChart(chartData, dateField, valueFields, width, height, margin, chartStyleConfig, displayConfig, chartTitle);
    }
  } catch (error) {
    console.error('生成图表时发生错误:', error);
    return generateErrorSvg(error.message);
  }
}

// 🆕 将层级表格转换为树状结构
function buildHierarchyFromTable(headers, rows, title = 'Tree') {
  const lastIndex = headers.length - 1;

  const root = { name: title || headers[0] || 'Tree', children: [] };

  // 使用映射避免重复节点
  const map = new Map(); // key -> node

  function getOrCreateChild(parent, name) {
    if (!parent.children) parent.children = [];
    let child = parent.children.find(c => c.name === name);
    if (!child) {
      child = { name, children: [] };
      parent.children.push(child);
    }
    return child;
  }

  rows.forEach(row => {
    if (!row) return;
    // 将整行视为层级路径，最后一列也作为末级子节点名称
    const levels = row.slice(0, headers.length).map(v => String(v));

    let current = root;
    for (const lvl of levels) {
      const key = `${current.name}::${lvl}`;
      let next = map.get(key);
      if (!next) {
        next = getOrCreateChild(current, lvl);
        map.set(key, next);
      }
      current = next;
    }
    // 最末级为叶子节点，保持空 children 数组（后续修剪会去掉空 children 属性）
    if (current.children && current.children.length === 0) {
      delete current.children;
    }
  });

  // 清理空 children
  function prune(node) {
    if (node.children && node.children.length > 0) {
      node.children.forEach(prune);
      node.children = node.children.filter(c => c && c.name != null);
      if (node.children.length === 0) delete node.children;
    }
  }
  prune(root);

  return root;
}

// 🆕 生成 TreeMind 树状图（静态展开版）
function generateTreeMindChart(tableData, chartTitle = null) {
  const headers = tableData[0];
  const rows = tableData.slice(1);

  const treeData = buildHierarchyFromTable(headers, rows, chartTitle || headers[0] || 'Tree');

  // 计算布局参数
  const baseWidth = 928;
  const marginTop = 20;
  const marginRight = 20;
  const marginBottom = 20;
  const marginLeft = 80;

  const root = d3.hierarchy(treeData);
  const dx = 18;
  const dy = (baseWidth - marginLeft - marginRight) / (1 + (root.height || 1));
  const tree = d3.tree().nodeSize([dx, dy]);
  const diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x);

  // 首次布局以获取高度
  tree(root);
  let left = root;
  let right = root;
  root.eachBefore(node => {
    if (node.x < left.x) left = node;
    if (node.x > right.x) right = node;
  });
  const contentHeight = (right.x - left.x) + dx * 2;
  const titleYOffset = chartTitle ? 24 : 0;
  const height = contentHeight + marginTop + marginBottom + titleYOffset;

  // 创建JSDOM SVG
  const { svg } = createJsdomEnv(baseWidth, Math.max(240, height));

  // 标题（支持 chartStyleConfig.title 透传）
  if (chartTitle) {
    const titleStyleTree = getResolvedTitleStyle(chartStyleConfig);
    svg.append('text')
      .attr('x', baseWidth / 2)
      .attr('y', titleYOffset)
      .attr('text-anchor', 'middle')
      .attr('font-size', titleStyleTree.fontSize || '14px')
      .attr('font-weight', titleStyleTree.fontWeight || '600')
      .attr('fill', titleStyleTree.fill)
      .text(chartTitle);
  }

  // 计算内容宽度并在单根时水平居中显示
  const nodesAll = root.descendants();
  const hasMultipleFirstLevel = Array.isArray(root.children) && root.children.length > 1;
  // 单根时仅以可见节点（depth>0）计算宽度范围；多根时使用全部节点
  const nodesForWidth = hasMultipleFirstLevel ? nodesAll : nodesAll.filter(d => d.depth > 0);
  const minY = d3.min(nodesForWidth, d => d.y);
  const maxY = d3.max(nodesForWidth, d => d.y);
  const contentWidth = (maxY - minY) || 0;
  const availableWidth = baseWidth - marginLeft - marginRight;

  // 显示根标签时，为左侧文本预留额外内边距；否则基于内容宽度进行水平居中并抵消 minY
  const extraPadX = 100;
  const translateX = hasMultipleFirstLevel
    ? (marginLeft + extraPadX)
    : (marginLeft + Math.max(0, (availableWidth - contentWidth) / 2) - (minY || 0));

  const g = svg.append('g')
    .attr('transform', `translate(${translateX}, ${marginTop + titleYOffset - left.x + dx})`);

  // 链接
  const gLink = g.append('g')
    .attr('fill', 'none')
    .attr('stroke', '#555')
    .attr('stroke-opacity', 0.4)
    .attr('stroke-width', 1.5);

  // 节点组
  const gNode = g.append('g')
    .attr('cursor', 'pointer')
    .attr('pointer-events', 'all');

  // 绘制链接（若只有一个根分支且隐藏根标签，则不绘制根到第一层的连线）
  const links = root.links();
  const displayRootLabelForLinks = Array.isArray(root.children) && root.children.length > 1;
  const filteredLinks = displayRootLabelForLinks ? links : links.filter(l => (l.source && l.source.depth > 0));
  gLink.selectAll('path')
    .data(filteredLinks)
    .enter()
    .append('path')
    .attr('d', diagonal)
    .attr('data-link-source-id', d => String(d.source._treeId || 0))
    .attr('data-link-target-id', d => String(d.target._treeId || 0));

  // 绘制节点
  const descendants = root.descendants().reverse();

  // 为每个节点分配稳定的 id
  descendants.forEach((d, i) => { d._treeId = i; });

  // 是否需要显示根节点标签：当且仅当存在多个一级分支时
  const displayRootLabel = Array.isArray(root.children) && root.children.length > 1;

  // 收集某节点所有后代ID
  function collectDescendantIds(d) {
    const ids = [];
    d.each(node => {
      if (node !== d) ids.push(node._treeId);
    });
    return ids;
  }

  const node = gNode.selectAll('g')
    .data(descendants)
    .enter()
    .append('g')
    .attr('transform', d => `translate(${d.y},${d.x})`)
    .attr('fill-opacity', 1)
    .attr('stroke-opacity', 1)
    .attr('class', 'node')
    .attr('data-node-id', d => String(d._treeId))
    .attr('data-has-children', d => (d.children && d.children.length) ? 'true' : 'false')
    .attr('data-descendants', d => collectDescendantIds(d).join(','))
    .attr('onclick', 'toggleNode(evt)');

  node.filter(d => displayRootLabel || d.depth > 0).append('circle')
    .attr('r', 3)
    .attr('fill', d => d.children ? '#555' : '#999')
    .attr('stroke-width', 8)
    .attr('stroke', 'white');

  // 名称与数值
  node.filter(d => displayRootLabel || d.depth > 0).append('text')
    .attr('dy', '0.31em')
    .attr('x', d => d.children ? -8 : 8)
    .attr('text-anchor', d => d.children ? 'end' : 'start')
    .text(d => (d.data && d.data.name ? String(d.data.name) : ''))
    .attr('stroke-linejoin', 'round')
    .attr('stroke-width', 3)
    .attr('stroke', 'white')
    .attr('paint-order', 'stroke')
    .attr('font-size', '10px')
    .attr('fill', '#111');

  // 返回SVG字符串

  return svg.node().outerHTML;
}

/**
 * 生成分组折线图
 * @param {Array} data - 图表数据
 * @param {string} dateField - 日期字段名
 * @param {Array} valueFields - 值字段名数组
 * @param {number} width - 图表宽度
 * @param {number} height - 图表高度
 * @param {Object} margin - 图表边距
 * @param {Object} chartStyleConfig - 图表样式配置
 * @param {Object} displayConfig - 显示配置（字体大小、刻度数量等）
 * @param {string} chartTitle - 图表标题（可选）
 * @returns {string} - SVG图表的HTML字符串
 */
function generateGroupedLineChart(data, dateField, valueFields, width, height, margin, chartStyleConfig = null, displayConfig = {}, chartTitle = null) {
  try {
    
    const { svg, document } = createJsdomEnv(width, height);
    applyChartSvgBackground(svg, width, height, chartStyleConfig);
    
    const colorBrand6 = resolveColor(COLOR_CONSTANTS.PRIMARY.BRAND6);
    const colorBrand5 = resolveColor(COLOR_CONSTANTS.PRIMARY.BRAND5);
    const colorBrand4 = resolveColor(COLOR_CONSTANTS.PRIMARY.BRAND4);
    const colorBrand3 = resolveColor(COLOR_CONSTANTS.PRIMARY.BRAND3);
    const defaultColorValues = [colorBrand5, colorBrand4, colorBrand3, '#76b7b2', '#59a14f', '#edc949', '#af7aa1', '#ff9da7', '#9c755f', '#bab0ab'];
    const defaultColorClass = ['color-brand6', 'color-brand5', 'color-brand4'];
    const { colorValues, colorClass } = getChartColorsFromConfig(chartStyleConfig, { colorValues: defaultColorValues, colorClass: defaultColorClass });
    const lineStyles = [
      { strokeWidth: 3, dashArray: "0" },   
      { strokeWidth: 2.5, dashArray: "0" },  
      { strokeWidth: 2, dashArray: "0" },    
      { strokeWidth: 3.5, dashArray: "0" },     
      { strokeWidth: 1.8, dashArray: "0" }, 
      { strokeWidth: 2.8, dashArray: "0" },  
      { strokeWidth: 2.2, dashArray: "0" },    
      { strokeWidth: 3.2, dashArray: "0" },      
      { strokeWidth: 2.3, dashArray: "0" },   
      { strokeWidth: 1.9, dashArray: "0" }          
    ];
    
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // 🆕 有标题时整个图表向下移动，为图例留出空间
    const chartOffsetY = chartTitle ? 25 : 0;
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top + chartOffsetY})`);
    
    const xValues = data.map(d => d[dateField]);
    
    let allValues = [];
    valueFields.forEach(field => {
      allValues = allValues.concat(data.map(d => d[field]));
    });
    
    // 🆕 优化Y轴范围，减少空白区域
    const yMin = Math.min(0, Math.min(...allValues) * 0.9); // 降低下限，留5%空间而不是从0开始
    const yMax = Math.max(...allValues) * 1.05; // 上限只留5%空间，而不是10%
    
    const xScale = d3.scalePoint()
      .domain(xValues)
      .range([0, innerWidth])
      .padding(0.3); // 🆕 减少左右边距，增加图表密度 (0.5→0.3)
    
    const yScale = d3.scaleLinear()
      .domain([yMin, yMax])
      .range([innerHeight, 0]);
    
    // RE-INTRODUCE Data point grouping and pre-calculation of label positions
    const valueGroupsMap = new Map();
    const areValuesClose = (a, b) => { 
        if (Math.abs(a) < 0.001 && Math.abs(b) < 0.001) return true;
        return Math.abs(a - b) < 0.005; // Reduced threshold for closer matching
    };

    data.forEach(dataPoint => {
        const dateStr = dataPoint[dateField];
        if (!valueGroupsMap.has(dateStr)) {
            valueGroupsMap.set(dateStr, []);
        }
        let groupsForDate = valueGroupsMap.get(dateStr);
        valueFields.forEach((field, fieldIdx) => {
            const yVal = parseFloat(dataPoint[field]) || 0;
            let existingGroup = groupsForDate.find(g => areValuesClose(g.value, yVal));
            if (existingGroup) {
                existingGroup.seriesInfo.push({ field, fieldIndex: fieldIdx, yValue: yVal });
            } else {
                groupsForDate.push({
                    value: yVal,
                    seriesInfo: [{ field, fieldIndex: fieldIdx, yValue: yVal }],
                });
            }
        });
        groupsForDate.sort((a, b) => b.value - a.value); // Crucial: Sort by value for consistent stacking logic
    });

    // RE-CALCULATE label positions for each group with refined anti-collision
    valueGroupsMap.forEach((groupsAtDate, dateStr) => {
        const labelHeight = 10; 
        const verticalPadding = 2; // Minimal vertical padding
        const yPositionOfXAxis = yScale(0);

        // Default small offsets, aiming for (0,0)-like placement
        const defaultXOffset = 6; // Slight right offset from point center
        const defaultYOffset = 4; // Slight down offset (for text baseline below point center)
        const textAnchorDefault = 'start';

        // Keep track of Y positions used by labels at this specific X-coordinate (dateStr)
        // This is a simple way to manage overlap for this date.
        const occupiedYRanges = []; 

        // Process groups sorted by Y value (descending) - higher values first
        // groupsAtDate is already sorted this way from its initial population.

        groupsAtDate.forEach((group, index) => {
            let finalX = defaultXOffset;
            let finalY = defaultYOffset;
            let finalAnchor = textAnchorDefault;

            const pointValY = yScale(group.value); // Screen Y of the data point
            let labelTop = pointValY + finalY - labelHeight; // Estimated top of the label box
            let labelBottom = pointValY + finalY;         // Estimated bottom of the label box (baseline)

            // Simple iterative overlap avoidance for Y
            // Try to place downwards first, then shift if overlap or below X-axis
            let attempts = 0;
            const maxAttempts = 5; // Prevent infinite loops in very dense scenarios

            while (attempts < maxAttempts) {
                let overlaps = false;
                for (const range of occupiedYRanges) {
                    if (!(labelBottom < range.top || labelTop > range.bottom)) {
                        overlaps = true;
                        break;
                    }
                }

                // Check if label for non-negative value goes below X-axis
                let belowXAxis = false;
                if (group.value >= 0 && (labelBottom > yPositionOfXAxis + 2)) { // +2 for a little margin
                    belowXAxis = true;
                }

                if (!overlaps && !belowXAxis) {
                    break; // Found a good spot
                }

                // If overlap or below X-axis, try to adjust Y
                if (belowXAxis) {
                    // If it was trying to go down but went below axis, try to place it above the point
                    finalY = -defaultYOffset - labelHeight; // Place above the point
                } else if (overlaps) {
                    // If overlap, shift it further down (or up, if we change strategy)
                    finalY += (labelHeight + verticalPadding); // Shift down by one label height + padding
                }
                
                // Recalculate label bounds for next check
                labelTop = pointValY + finalY - labelHeight;
                labelBottom = pointValY + finalY;
                attempts++;
            }
            
            if(attempts === maxAttempts){
                 // Fallback for very dense cases: slightly alternate X to show something
                finalX = defaultXOffset + (index % 2 === 0 ? 0 : 5);
                finalY = defaultYOffset + (index % 3) * verticalPadding; // Minimal Y shift
            }

            occupiedYRanges.push({ top: labelTop, bottom: labelBottom });
            
            group.calculatedLabelPosition = { 
                x: finalX, 
                y: finalY, 
                anchor: finalAnchor 
            };
        });
    });

    // DRAWING LINES, DOTS, AND THEN LABELS
    valueFields.forEach((field, fieldIndex) => {
        const color = colorValues[fieldIndex % colorValues.length];
        const colorClassSuffix = colorClass[fieldIndex % colorClass.length];
        const lineStyle = lineStyles[fieldIndex % lineStyles.length];
        
        const lineData = data.map(d => ({ x: d[dateField], y: d[field], original: d }));
        
        const line = d3.line().x(d => xScale(d.x)).y(d => yScale(d.y));
        
        const lineGroup = g.append('g').attr('class', 'line-group');

    
        lineGroup.append('path')
            .attr('class', `line line-${colorClassSuffix}`)
            .attr('d', line(lineData))
            .attr('stroke', '#000')
            .attr('fill', 'none')
            .attr('stroke-width', displayConfig.strokeWidth || lineStyle.strokeWidth) // 🆕 使用动态线条粗细
            .attr('stroke-dasharray', lineStyle.dashArray);

        // 2. Draw DOTS (and their groups) on top of lines
        const dots = lineGroup.selectAll('.dot-group')
            .data(lineData)
            .enter()
            .append('g')
            .attr('class', 'dot-group')
            .attr('transform', d => `translate(${xScale(d.x)},${yScale(d.y)})`);

        dots.append('circle')
            .attr('class', `dot dot-${colorClassSuffix}`)
            .attr('r', displayConfig.dotRadius || 4) // 🆕 使用动态圆点大小
            .attr('fill', '#000')
            .attr('stroke', '#fff')
            .attr('stroke-width', 1.5);
        
        // 3. Draw LABELS on top of dots/lines, using pre-calculated positions
        dots.each(function(d) { // d is {x, y, original}
            const currentDotG = d3.select(this); // This is the <g class="dot-group">
            const groupsAtThisDate = valueGroupsMap.get(d.x);
            let currentPointValueGroup = null;

            if (groupsAtThisDate) {
                currentPointValueGroup = groupsAtThisDate.find(g =>
                    g.seriesInfo.some(si => si.field === field && areValuesClose(g.value, d.y))
                );
            }

            if (currentPointValueGroup && currentPointValueGroup.calculatedLabelPosition) {
                const designatedSeriesInfo = currentPointValueGroup.seriesInfo.reduce((prev, curr) => 
                    (prev.fieldIndex < curr.fieldIndex ? prev : curr), currentPointValueGroup.seriesInfo[0]);
                const isDesignatedDrawer = designatedSeriesInfo.field === field;

                if (isDesignatedDrawer) {
                    const pos = currentPointValueGroup.calculatedLabelPosition;
                    currentDotG.append('text') // Append to the dot's <g> to keep it relative
                        .attr('class', `data-label data-label-${colorClassSuffix}`)
                        .attr('x', pos.x)
                        .attr('y', pos.y)
                        .attr('font-size', displayConfig.dataLabelSize || '8px') // 🆕 使用动态数据标签字体大小
                        .attr('text-anchor', pos.anchor)
                        .attr('fill', '#000') // Use series color for label
                        .attr('font-weight', 'normal')
                        .attr('stroke', 'white')
                        .attr('stroke-width', '2px')
                        .attr('stroke-opacity', '0.85')
                        .attr('paint-order', 'stroke')
                        .text(currentPointValueGroup.value.toFixed(2)); // Display two decimal places
                }
            }
        });
    });

    // 🆕 根据图表大小与透传配置解析轴、网格样式（坐标系与文字颜色可由 chartStyleConfig 覆盖）
    const axisStyle = getResolvedAxisStyle(displayConfig, chartStyleConfig);
    const gridStyle = getResolvedGridStyle(chartStyleConfig);
    
    // 添加X轴网格线
    g.append('g')
      .attr('class', 'grid x-grid')
      .selectAll('line')
      .data(xValues)
      .enter()
      .append('line')
      .attr('x1', d => xScale(d))
      .attr('y1', 0)
      .attr('x2', d => xScale(d))
      .attr('y2', innerHeight)
      .attr('stroke', gridStyle.stroke)
      .attr('stroke-opacity', gridStyle.strokeOpacity);
    
    // 添加Y轴网格线
    const yTickCount = displayConfig.yTickCount || 5; // 🆕 使用动态刻度数量
    const yTicks = yScale.ticks(yTickCount);
    g.append('g')
      .attr('class', 'grid y-grid')
      .selectAll('line')
      .data(yTicks)
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('y1', d => yScale(d))
      .attr('x2', innerWidth)
      .attr('y2', d => yScale(d))
      .attr('stroke', gridStyle.stroke)
      .attr('stroke-opacity', gridStyle.strokeOpacity);
    
    // 添加X轴（含轴体：底部水平线，使用 axis.stroke）
    const xAxis = g.append('g')
      .attr('class', 'axis x-axis')
      .attr('font-size', axisStyle.fontSize || displayConfig.axisLabelSize || '10px')
      .attr('transform', `translate(0,${innerHeight})`);
    xAxis.insert('line', ':first-child')
      // .attr('x1', 0)
      // .attr('y1', 0)
      // .attr('x2', innerWidth)
      // .attr('y2', 0)
      .attr('stroke', axisStyle.stroke)
      .attr('stroke-width', 1);
    
    const axisClassName = chartStyleConfig?.axis?.className || 'axis-label';
    
    // 🆕 显示所有X轴标签，优化日期显示
    xAxis.selectAll('g')
      .data(xValues) // 🆕 显示所有X轴标签
      .enter()
      .append('g')
      .attr('transform', d => `translate(${xScale(d)},0)`)
      .append('text')
      .attr('class', axisClassName)
      .attr('y', 9)
      .attr('dy', '.71em')
      .attr('transform', displayConfig.xLabelRotation ? `rotate(${displayConfig.xLabelRotation})` : 'rotate(45)') // 🆕 使用动态旋转角度
      .attr('text-anchor', displayConfig.xLabelRotation <= 15 ? 'middle' : 'start') // 🆕 小角度旋转时居中对齐
      .attr('font-size', axisStyle.fontSize || displayConfig.axisLabelSize || '10px')
      .attr('font-weight', axisStyle.fontWeight || '400')
      .attr('fill', axisStyle.fill)
      .text(d => {
        // 🆕 优化日期显示，截取月-日部分
        if (d.includes('-')) {
          const parts = d.split('-');
          if (parts.length === 3) {
            return `${parts[1]}-${parts[2]}`; // 显示 "03-10" 而不是 "2025-03-10"
          }
        }
        return d;
      });
    
    // 添加Y轴（含轴体：左侧竖线，使用 axis.stroke）
    const yAxis = g.append('g')
      .attr('class', 'axis y-axis');
    yAxis.insert('line', ':first-child')
      // .attr('x1', 0)
      // .attr('y1', 0)
      // .attr('x2', 0)
      // .attr('y2', innerHeight)
      .attr('stroke', axisStyle.stroke)
      .attr('stroke-width', 1);
    
    yAxis.selectAll('g')
      .data(yTicks)
      .enter()
      .append('g')
      .attr('transform', d => `translate(0,${yScale(d)})`)
      .call(g => {
        g.append('line')
          .attr('x2', -6)
          .attr('stroke', axisStyle.stroke);
        g.append('text')
          .attr('class', axisClassName)
          .attr('x', -9)
          .attr('dy', '.32em')
          .attr('text-anchor', 'end')
          .attr('font-size', axisStyle.fontSize || displayConfig.axisLabelSize || '10px')
          .attr('font-weight', axisStyle.fontWeight || '400')
          .attr('fill', axisStyle.fill)
          .text(d => {
            // 🆕 智能格式化数字：整数不显示小数点，小数最多显示1位
            if (d % 1 === 0) {
              return d.toString(); // 整数直接显示
            } else if (Math.abs(d) >= 100) {
              return d.toFixed(0); // 大数字不显示小数
            } else {
              return d.toFixed(1); // 小数显示1位
            }
          });
      });
    
    if (chartTitle) {
      const titleStyle = getResolvedTitleStyle(chartStyleConfig);
      svg.append('g').attr('class', 'ee-chart-title-wrap')
        .append('text')
        .attr('x', width / 2)
        .attr('y', 25)
        .attr('text-anchor', 'middle')
        .attr('font-size', titleStyle.fontSize)
        .attr('font-weight', titleStyle.fontWeight)
        .attr('fill', titleStyle.fill)
        .text(chartTitle);
    }

    // 生成图例数据
    const legendItems = valueFields.map((field, i) => ({
      label: field,
      color: colorValues[i % colorValues.length],
      colorClass: colorClass[i % colorClass.length],
      type: 'line',
      style: lineStyles[i % lineStyles.length]
    }));
    
    generateLegend(g, innerHeight, legendItems, displayConfig, chartStyleConfig, 80);
    
    // 注入主题 CSS，覆盖 defs 默认样式，便于外部再用 CSS 覆盖
    injectChartThemeStyle(svg, {
      axisStyle,
      gridStyle,
      legendStyle: getResolvedLegendStyle(displayConfig, chartStyleConfig),
      titleStyle: getResolvedTitleStyle(chartStyleConfig)
    });
    
    return svg.node().outerHTML;
  } catch (error) {
    console.error('生成分组折线图时发生错误:', error);
    return generateErrorSvg('生成折线图失败: ' + error.message);
  }
}

/**
 * 生成柱状图
 * @param {Array} data - 图表数据
 * @param {string} dateField - 日期字段名
 * @param {Array} valueFields - 值字段名数组
 * @param {number} width - 图表宽度
 * @param {number} height - 图表高度
 * @param {Object} margin - 图表边距
 * @param {Object} chartStyleConfig - 图表样式配置
 * @param {Object} displayConfig - 显示配置（字体大小、刻度数量等）
 * @param {string} chartTitle - 图表标题（可选）
 * @returns {string} - SVG图表的HTML字符串
 */
function generateBarChart(data, dateField, valueFields, width, height, margin, chartStyleConfig = null, displayConfig = {}, chartTitle = null) {
  try {
    
    // 创建JSDOM环境
    const { svg, document } = createJsdomEnv(width, height);
    applyChartSvgBackground(svg, width, height, chartStyleConfig);
    
    // 解析颜色（支持透传 chartColors）
    const colorBrand5 = resolveColor(COLOR_CONSTANTS.PRIMARY.BRAND5);
    const colorBrand4 = resolveColor(COLOR_CONSTANTS.PRIMARY.BRAND4);
    const colorBrand3 = resolveColor(COLOR_CONSTANTS.PRIMARY.BRAND3);
    const defaultColorValues = [
      colorBrand5,
      colorBrand4,
      colorBrand3,
      '#76b7b2', '#59a14f', '#edc949', '#af7aa1', '#ff9da7', '#9c755f', '#bab0ab'
    ];
    const defaultColorClass = ['color-brand6', 'color-brand5', 'color-brand4'];
    const { colorValues, colorClass, useCustomColors } = getChartColorsFromConfig(chartStyleConfig, { colorValues: defaultColorValues, colorClass: defaultColorClass });
    
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // 🆕 有标题时整个图表向下移动，保持与折线图一致
    const chartOffsetY = chartTitle ? 15 : 0;
    // 主图表组
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top + chartOffsetY})`);
    
    // X轴类别（品牌名称）- 严格按照原始数据顺序
    const categories = data.map(d => d[dateField]);
    
    // 处理单个数据系列的情况
    const valueField = valueFields[0]; // 只使用第一个数据系列
    
    // 寻找所有数据系列的最大值，用于设置比例尺
    let maxValue = 0;
    valueFields.forEach(field => {
      const fieldMax = d3.max(data, d => parseFloat(d[field].toString().replace(/[,%]/g, '')) || 0);
      maxValue = Math.max(maxValue, fieldMax);
    });
    maxValue = maxValue * 1.1; // 增加10%的空间
    
    // 创建x和y轴的比例尺 - 确保严格按照原始数据顺序
    const xScale = d3.scaleBand()
      .domain(categories)
      .range([0, innerWidth])
      .padding(displayConfig.isSmallChart ? 0.2 : 0.3); // 🆕 小图表减少柱子间距
    
    const yScale = d3.scaleLinear()
      .domain([0, maxValue])
      .range([innerHeight, 0]);

    
    const axisStyle2 = getResolvedAxisStyle(displayConfig, chartStyleConfig);
    const gridStyle2 = getResolvedGridStyle(chartStyleConfig);
    
    // 添加垂直网格线
    g.append('g')
      .attr('class', 'grid x-grid')
      .selectAll('line')
      .data(yScale.ticks(displayConfig.isSmallChart ? 3 : 5)) // 🆕 小图表减少网格线数量
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('y1', d => yScale(d))
      .attr('x2', innerWidth)
      .attr('y2', d => yScale(d))
      .attr('stroke', gridStyle2.stroke)
      .attr('stroke-opacity', gridStyle2.strokeOpacity);
    
    // 手动创建X轴（含轴体：底部水平线）
    const xAxis = g.append('g')
      .attr('class', 'axis x-axis')
      .attr('font-size', axisStyle2.fontSize || displayConfig.axisLabelSize || '10px')
      .attr('transform', `translate(0,${innerHeight})`);
    xAxis.insert('line', ':first-child')
      // .attr('x1', 0)
      // .attr('y1', 0)
      // .attr('x2', innerWidth)
      // .attr('y2', 0)
      .attr('stroke', axisStyle2.stroke)
      .attr('stroke-width', 1);
    
    // 添加X轴刻度线和标签（品牌名称）
    xAxis.selectAll('.tick')
      .data(categories)
      .enter()
      .append('g')
      .attr('class', 'tick')
      .attr('transform', d => `translate(${xScale(d) + xScale.bandwidth() / 2}, 0)`)
      .call(g => {
        g.append('line')
          .attr('y2', 6)
          .attr('stroke', axisStyle2.stroke);
        g.append('text')
          .attr('y', 9)
          .attr('dy', '.71em')
          .attr('text-anchor', 'middle')
          .attr('font-size', axisStyle2.fontSize || displayConfig.axisLabelSize || '10px')
          .attr('font-weight', axisStyle2.fontWeight || '400')
          .attr('fill', axisStyle2.fill)
          .text(d => d);
      });
    
    // 添加y轴（刻度文字与轴线颜色由 axisStyle2 透传）
    const yAxis = g.append('g')
      .attr('class', 'axis y-axis')
      .call(d3.axisLeft(yScale).ticks(displayConfig.isSmallChart ? 3 : 5));
    yAxis.selectAll('.tick text').attr('fill', axisStyle2.fill).attr('font-size', axisStyle2.fontSize || displayConfig.axisLabelSize || '10px');
    yAxis.selectAll('.tick line').attr('stroke', axisStyle2.stroke);
    yAxis.selectAll('path.domain').attr('stroke', axisStyle2.stroke);
    
    // 柱状图颜色：透传时每根柱子按类别顺序用 chartColors[i]，与图例一一对应；否则单色依赖外部 CSS
    const bars = g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', (d, i) => `bar bar-${colorClass[i % colorClass.length]}`)
      .attr('x', d => xScale(d[dateField]))
      .attr('y', d => yScale(parseFloat(d[valueField].toString().replace(/[,%]/g, '')) || 0))
      .attr('width', xScale.bandwidth())
      .attr('height', d => innerHeight - yScale(parseFloat(d[valueField].toString().replace(/[,%]/g, '')) || 0))
      .attr('fill', (d, i) => (useCustomColors ? colorValues[i % colorValues.length] : '#000'));
    
    // 添加数值标签：优先用 chartCard.dataLabel（可与轴颜色/字号不同），无则用 axis
    const dataLabelStyle2 = getResolvedDataLabelStyle(displayConfig, chartStyleConfig, axisStyle2);
    g.selectAll('.bar-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'bar-label')
      .attr('x', d => xScale(d[dateField]) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(parseFloat(d[valueField].toString().replace(/[,%]/g, '')) || 0) - 5)
      .attr('text-anchor', 'middle')
      .attr('fill', dataLabelStyle2.fill)
      .attr('font-size', dataLabelStyle2.fontSize)
      .text(d => d[valueField]);
    
    if (chartTitle) {
      const titleStyle2 = getResolvedTitleStyle(chartStyleConfig);
      svg.append('g').attr('class', 'ee-chart-title-wrap')
        .append('text')
        .attr('x', width / 2)
        .attr('y', 25)
        .attr('text-anchor', 'middle')
        .attr('font-size', titleStyle2.fontSize)
        .attr('font-weight', titleStyle2.fontWeight)
        .attr('fill', titleStyle2.fill)
        .text(chartTitle);
    }

    const legendItems = categories.map((category, i) => ({
      label: category,
      color: colorValues[i % colorValues.length],
      colorClass: colorClass[i % colorClass.length],
      type: 'bar'
    }));
    generateLegend(g, innerHeight, legendItems, displayConfig, chartStyleConfig, 80);

    injectChartThemeStyle(svg, {
      axisStyle: axisStyle2,
      gridStyle: gridStyle2,
      legendStyle: getResolvedLegendStyle(displayConfig, chartStyleConfig),
      titleStyle: getResolvedTitleStyle(chartStyleConfig)
    });
    return svg.node().outerHTML;
  } catch (error) {
    console.error('生成垂直柱状图时发生错误:', error);
    return generateErrorSvg('生成垂直柱状图失败: ' + error.message);
  }
}

/**
 * 生成水平柱状图
 * @param {Array} data - 图表数据
 * @param {string} dateField - 日期字段名
 * @param {Array} valueFields - 值字段名数组
 * @param {number} width - 图表宽度
 * @param {number} height - 图表高度
 * @param {Object} margin - 图表边距
 * @param {Object} chartStyleConfig - 图表样式配置
 * @param {Object} displayConfig - 显示配置（字体大小、刻度数量等）
 * @param {string} chartTitle - 图表标题（可选）
 * @returns {string} - SVG图表的HTML字符串
 */
function generateBarHChart(data, dateField, valueFields, width, height, margin, chartStyleConfig = null, displayConfig = {}, chartTitle = null) {
  try {    
    // 创建JSDOM环境
    const { svg, document } = createJsdomEnv(width, height);
    applyChartSvgBackground(svg, width, height, chartStyleConfig);
    
    // 解析颜色（支持透传 chartColors）
    const colorBrand5 = resolveColor(COLOR_CONSTANTS.PRIMARY.BRAND5);
    const colorBrand4 = resolveColor(COLOR_CONSTANTS.PRIMARY.BRAND4);
    const colorBrand3 = resolveColor(COLOR_CONSTANTS.PRIMARY.BRAND3);
    const defaultColorValues = [colorBrand5, colorBrand4, colorBrand3, '#76b7b2', '#59a14f', '#edc949', '#af7aa1', '#ff9da7', '#9c755f', '#bab0ab'];
    const defaultColorClass = ['color-brand6', 'color-brand5', 'color-brand4'];
    const { colorValues, colorClass, useCustomColors } = getChartColorsFromConfig(chartStyleConfig, { colorValues: defaultColorValues, colorClass: defaultColorClass });
    
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // 🆕 有标题时整个图表向下移动，保持与折线图一致
    const chartOffsetY = chartTitle ? 15 : 0;
    // 主图表组
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top + chartOffsetY})`);
    
    // Y轴类别（标签）- 严格按照原始数据顺序
    const categories = data.map(d => d[dateField]);
    
    // 寻找所有数据系列的最大值，用于设置比例尺
    let maxValue = 0;
    valueFields.forEach(field => {
      const fieldMax = d3.max(data, d => parseFloat(d[field].toString().replace(',', '')) || 0);
      maxValue = Math.max(maxValue, fieldMax);
    });
    maxValue = maxValue * 1.1; // 增加10%的空间
    
    // 处理单个数据系列的情况
    const valueField = valueFields[0]; // 只使用第一个数据系列

    const axisStyle3 = getResolvedAxisStyle(displayConfig, chartStyleConfig);
    const gridStyle3 = getResolvedGridStyle(chartStyleConfig);
    
    // 创建x和y轴的比例尺 - 确保严格按照原始数据顺序
    const xScale = d3.scaleLinear()
      .domain([0, maxValue])
      .range([0, innerWidth]);
    
    const yScale = d3.scaleBand()
      .domain(categories)
      .range([0, innerHeight])
      .padding(displayConfig.isSmallChart ? 0.2 : 0.3); // 🆕 小图表减少柱子间距，提高空间利用
    
    // 添加水平网格线
    g.append('g')
      .attr('class', 'grid y-grid')
      .selectAll('line')
      .data(xScale.ticks(displayConfig.isSmallChart ? 3 : 5))
      .enter()
      .append('line')
      .attr('x1', d => xScale(d))
      .attr('y1', 0)
      .attr('x2', d => xScale(d))
      .attr('y2', innerHeight)
      .attr('stroke', gridStyle3.stroke)
      .attr('stroke-opacity', gridStyle3.strokeOpacity);
    
    // 添加x轴
    const xAxis = g.append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .attr('font-size', axisStyle3.fontSize || displayConfig.axisLabelSize || '10px')
      .call(d3.axisBottom(xScale).ticks(5).tickFormat(d => d));
    xAxis.selectAll('.tick text').attr('fill', axisStyle3.fill).attr('font-size', axisStyle3.fontSize || displayConfig.axisLabelSize || '10px');
    xAxis.selectAll('.tick line').attr('stroke', axisStyle3.stroke);
    xAxis.selectAll('path.domain').attr('stroke', axisStyle3.stroke);
    
    // 手动创建Y轴（含轴体：左侧竖线）
    const yAxis = g.append('g')
      .attr('class', 'axis y-axis');
    yAxis.insert('line', ':first-child')
      // .attr('x1', 0)
      // .attr('y1', 0)
      // .attr('x2', 0)
      // .attr('y2', innerHeight)
      .attr('stroke', axisStyle3.stroke)
      .attr('stroke-width', 1);
    // 添加Y轴刻度线和标签
    yAxis.selectAll('.tick')
      .data(categories)
      .enter()
      .append('g')
      .attr('class', 'tick')
      .attr('transform', d => `translate(0, ${yScale(d) + yScale.bandwidth() / 2})`)
      .call(g => {
        g.append('line')
          .attr('x2', -6)
          .attr('stroke', axisStyle3.stroke);
        g.append('text')
          .attr('x', -9)
          .attr('dy', '.32em')
          .attr('text-anchor', 'end')
          .attr('font-size', axisStyle3.fontSize || displayConfig.axisLabelSize || '10px')
          .attr('font-weight', axisStyle3.fontWeight || '400')
          .attr('fill', axisStyle3.fill)
          .text(d => d);
      });
    
    // 水平柱状图颜色：透传时每根柱子按类别顺序用 chartColors[i]，与图例一一对应
    const bars = g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', (d, i) => `bar bar-${colorClass[i % colorClass.length]}`)
      .attr('y', d => yScale(d[dateField]))
      .attr('x', 0)
      .attr('height', yScale.bandwidth())
      .attr('width', d => xScale(parseFloat(d[valueField].toString().replace(',', '')) || 0))
      .attr('fill', (d, i) => (useCustomColors ? colorValues[i % colorValues.length] : '#000'));
    
    // 添加数值标签：优先用 chartCard.dataLabel（可与轴颜色/字号不同），无则用 axis
    const dataLabelStyle3 = getResolvedDataLabelStyle(displayConfig, chartStyleConfig, axisStyle3);
    g.selectAll('.bar-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'bar-label')
      .attr('y', d => yScale(d[dateField]) + yScale.bandwidth() / 2)
      .attr('x', d => xScale(parseFloat(d[valueField].toString().replace(',', '')) || 0) + 5)
      .attr('dy', '.35em')
      .attr('text-anchor', 'start')
      .attr('fill', dataLabelStyle3.fill)
      .attr('font-size', dataLabelStyle3.fontSize)
      .text(d => d[valueField]);
    
    const axisClassName = chartStyleConfig?.axis?.className || 'axis-title';
    
    // 添加X轴标题
    g.append('text')
      .attr('class', axisClassName)
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 40)
      .attr('text-anchor', 'middle')
      .attr('font-size', axisStyle3.fontSize || displayConfig.axisLabelSize || '10px')
      .attr('font-weight', axisStyle3.fontWeight || '400')
      .attr('fill', axisStyle3.fill)
      .text(valueField);
    
    // 添加Y轴标题
    g.append('text')
      .attr('class', axisClassName)
      .attr('transform', `rotate(-90)`)
      .attr('x', -innerHeight / 2)
      .attr('y', -60)
      .attr('text-anchor', 'middle')
      .attr('font-size', axisStyle3.fontSize || displayConfig.axisLabelSize || '10px')
      .attr('font-weight', axisStyle3.fontWeight || '400')
      .attr('fill', axisStyle3.fill)
      .text(dateField);
    
    if (chartTitle) {
      const titleStyle3 = getResolvedTitleStyle(chartStyleConfig);
      svg.append('g').attr('class', 'ee-chart-title-wrap')
        .append('text')
        .attr('x', width / 2)
        .attr('y', 25)
        .attr('text-anchor', 'middle')
        .attr('font-size', titleStyle3.fontSize)
        .attr('font-weight', titleStyle3.fontWeight)
        .attr('fill', titleStyle3.fill)
        .text(chartTitle);
    }

    const legendItems = categories.map((category, i) => ({
      label: category,
      color: colorValues[i % colorValues.length],
      colorClass: colorClass[i % colorClass.length],
      type: 'bar'
    }));
    generateLegend(g, innerHeight, legendItems, displayConfig, chartStyleConfig, 80);

    injectChartThemeStyle(svg, {
      axisStyle: axisStyle3,
      gridStyle: gridStyle3,
      legendStyle: getResolvedLegendStyle(displayConfig, chartStyleConfig),
      titleStyle: getResolvedTitleStyle(chartStyleConfig)
    });
    return svg.node().outerHTML;
  } catch (error) {
    console.error('生成水平柱状图时发生错误:', error);
    return generateErrorSvg('生成水平柱状图失败: ' + error.message);
  }
}

/**
 * 生成面积图
 * @param {Array} data - 图表数据
 * @param {string} dateField - 日期字段名
 * @param {Array} valueFields - 值字段名数组
 * @param {number} width - 图表宽度
 * @param {number} height - 图表高度
 * @param {Object} margin - 图表边距
 * @param {Object} chartStyleConfig - 图表样式配置
 * @param {Object} displayConfig - 显示配置（字体大小、刻度数量等）
 * @param {string} chartTitle - 图表标题（可选）
 * @returns {string} - SVG图表的HTML字符串
 */
function generateAreaChart(data, dateField, valueFields, width, height, margin, chartStyleConfig = null, displayConfig = {}, chartTitle = null) {
  try {    
    const { svg, document } = createJsdomEnv(width, height);
    applyChartSvgBackground(svg, width, height, chartStyleConfig);
    
    const colorBrand5 = resolveColor(COLOR_CONSTANTS.PRIMARY.BRAND5);
    const colorBrand4 = resolveColor(COLOR_CONSTANTS.PRIMARY.BRAND4);
    const colorBrand3 = resolveColor(COLOR_CONSTANTS.PRIMARY.BRAND3);
    const defaultColorValues = [colorBrand5, colorBrand4, colorBrand3, '#76b7b2', '#59a14f', '#edc949', '#af7aa1', '#ff9da7', '#9c755f', '#bab0ab'];
    const defaultColorClass = ['color-brand6', 'color-brand5', 'color-brand4'];
    const { colorValues, colorClass } = getChartColorsFromConfig(chartStyleConfig, { colorValues: defaultColorValues, colorClass: defaultColorClass });
    
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // 🆕 有标题时整个图表向下移动，为图例留出空间
    const chartOffsetY = chartTitle ? 25 : 0;
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top + chartOffsetY})`);
    
    const xValues = data.map(d => d[dateField]);
    
    let allValues = [];
    valueFields.forEach(field => {
      allValues = allValues.concat(data.map(d => d[field]));
    });
    
    // 🆕 优化Y轴范围，面积图通常从0开始
    const yMin = 0;
    const yMax = Math.max(...allValues) * 1.05; // 上限留5%空间
    
    const xScale = d3.scalePoint()
      .domain(xValues)
      .range([0, innerWidth])
      .padding(0.3);
    
    const yScale = d3.scaleLinear()
      .domain([yMin, yMax])
      .range([innerHeight, 0]);
    
    const axisStyleArea = getResolvedAxisStyle(displayConfig, chartStyleConfig);
    const gridStyleArea = getResolvedGridStyle(chartStyleConfig);
    
    // 添加X轴网格线
    g.append('g')
      .attr('class', 'grid x-grid')
      .selectAll('line')
      .data(xValues)
      .enter()
      .append('line')
      .attr('x1', d => xScale(d))
      .attr('y1', 0)
      .attr('x2', d => xScale(d))
      .attr('y2', innerHeight)
      .attr('stroke', gridStyleArea.stroke)
      .attr('stroke-opacity', gridStyleArea.strokeOpacity);
    
    // 添加Y轴网格线
    const yTickCount = displayConfig.yTickCount || 5;
    const yTicks = yScale.ticks(yTickCount);
    g.append('g')
      .attr('class', 'grid y-grid')
      .selectAll('line')
      .data(yTicks)
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('y1', d => yScale(d))
      .attr('x2', innerWidth)
      .attr('y2', d => yScale(d))
      .attr('stroke', gridStyleArea.stroke)
      .attr('stroke-opacity', gridStyleArea.strokeOpacity);
    
    // 绘制面积图 - 为每个数据系列创建面积
    valueFields.forEach((field, fieldIndex) => {
      const color = colorValues[fieldIndex % colorValues.length];
      const colorClassSuffix = colorClass[fieldIndex % colorClass.length];
      
      const areaData = data.map(d => ({ x: d[dateField], y: d[field] }));
      
      // 创建面积生成器
      const area = d3.area()
        .x(d => xScale(d.x))
        .y0(yScale(0)) // 面积图底部始终在y=0处
        .y1(d => yScale(d.y))
        .curve(d3.curveMonotoneX); // 使用平滑曲线
      
      // 绘制面积
      g.append('path')
        .attr('class', `area area-${colorClassSuffix}`)
        .attr('d', area(areaData))
        .attr('fill', '#000')
        .attr('fill-opacity', 0.6)
        .attr('stroke', '#000')
        .attr('stroke-width', 2);
      
      // 添加数据点
      g.selectAll(`.dot-${colorClassSuffix}`)
        .data(areaData)
        .enter()
        .append('circle')
        .attr('class', `dot dot-${colorClassSuffix}`)
        .attr('cx', d => xScale(d.x))
        .attr('cy', d => yScale(d.y))
        .attr('r', displayConfig.dotRadius || 4)
        .attr('fill', '#000')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5);
      
      // 添加数值标签
      g.selectAll(`.data-label-${colorClassSuffix}`)
        .data(areaData)
        .enter()
        .append('text')
        .attr('class', `data-label data-label-${colorClassSuffix}`)
        .attr('x', d => xScale(d.x))
        .attr('y', d => yScale(d.y) - 8)
        .attr('text-anchor', 'middle')
        .attr('font-size', displayConfig.dataLabelSize || '8px')
        .attr('fill', '#000')
        .attr('font-weight', 'normal')
        .attr('stroke', 'white')
        .attr('stroke-width', '2px')
        .attr('stroke-opacity', '0.85')
        .attr('paint-order', 'stroke')
        .text(d => d.y.toFixed(1));
    });
    
    // 添加X轴（含轴体：底部水平线）
    const xAxis = g.append('g')
      .attr('class', 'axis x-axis')
      .attr('font-size', axisStyleArea.fontSize || displayConfig.axisLabelSize || '10px')
      .attr('transform', `translate(0,${innerHeight})`);
    xAxis.insert('line', ':first-child')
      // .attr('x1', 0)
      // .attr('y1', 0)
      // .attr('x2', innerWidth)
      // .attr('y2', 0)
      .attr('stroke', axisStyleArea.stroke)
      .attr('stroke-width', 1);
    
    const axisClassName = chartStyleConfig?.axis?.className || 'axis-label';
    
    xAxis.selectAll('g')
      .data(xValues)
      .enter()
      .append('g')
      .attr('transform', d => `translate(${xScale(d)},0)`)
      .append('text')
      .attr('class', axisClassName)
      .attr('y', 9)
      .attr('dy', '.71em')
      .attr('transform', displayConfig.xLabelRotation ? `rotate(${displayConfig.xLabelRotation})` : 'rotate(45)')
      .attr('text-anchor', displayConfig.xLabelRotation <= 15 ? 'middle' : 'start')
      .attr('font-size', axisStyleArea.fontSize || displayConfig.axisLabelSize || '10px')
      .attr('font-weight', axisStyleArea.fontWeight || '400')
      .attr('fill', axisStyleArea.fill)
      .text(d => {
        if (d.includes('.')) {
          const parts = d.split('.');
          if (parts.length === 3) {
            return `${parts[1]}.${parts[2]}`;
          }
        }
        return d;
      });
    
    // 添加Y轴（含轴体：左侧竖线）
    const yAxis = g.append('g')
      .attr('class', 'axis y-axis');
    yAxis.insert('line', ':first-child')
      // .attr('x1', 0)
      // .attr('y1', 0)
      // .attr('x2', 0)
      // .attr('y2', innerHeight)
      .attr('stroke', axisStyleArea.stroke)
      .attr('stroke-width', 1);
    
    yAxis.selectAll('g')
      .data(yTicks)
      .enter()
      .append('g')
      .attr('transform', d => `translate(0,${yScale(d)})`)
      .call(g => {
        g.append('line')
          .attr('x2', -6)
          .attr('stroke', axisStyleArea.stroke);
        g.append('text')
          .attr('class', axisClassName)
          .attr('x', -9)
          .attr('dy', '.32em')
          .attr('text-anchor', 'end')
          .attr('font-size', axisStyleArea.fontSize || displayConfig.axisLabelSize || '10px')
          .attr('font-weight', axisStyleArea.fontWeight || '400')
          .attr('fill', axisStyleArea.fill)
          .text(d => {
            if (d % 1 === 0) {
              return d.toString();
            } else if (Math.abs(d) >= 100) {
              return d.toFixed(0);
            } else {
              return d.toFixed(1);
            }
          });
      });
    
    if (chartTitle) {
      const titleStyleArea = getResolvedTitleStyle(chartStyleConfig);
      svg.append('g').attr('class', 'ee-chart-title-wrap')
        .append('text')
        .attr('x', width / 2)
        .attr('y', 25)
        .attr('text-anchor', 'middle')
        .attr('font-size', titleStyleArea.fontSize)
        .attr('font-weight', titleStyleArea.fontWeight)
        .attr('fill', titleStyleArea.fill)
        .text(chartTitle);
    }

    const legendItems = valueFields.map((field, i) => ({
      label: field,
      color: colorValues[i % colorValues.length],
      colorClass: colorClass[i % colorClass.length],
      type: 'area',
      style: { fillOpacity: 0.6, strokeWidth: 2 }
    }));
    generateLegend(g, innerHeight, legendItems, displayConfig, chartStyleConfig, 80);

    injectChartThemeStyle(svg, {
      axisStyle: axisStyleArea,
      gridStyle: gridStyleArea,
      legendStyle: getResolvedLegendStyle(displayConfig, chartStyleConfig),
      titleStyle: getResolvedTitleStyle(chartStyleConfig)
    });
    return svg.node().outerHTML;
  } catch (error) {
    console.error('生成面积图时发生错误:', error);
    return generateErrorSvg('生成面积图失败: ' + error.message);
  }
}

/**
 * 生成环状图（甜甜圈图）
 * @param {Array} data - 图表数据
 * @param {string} dateField - 标签字段名（环状图中为类别标签）
 * @param {Array} valueFields - 值字段名数组（环状图中为数值）
 * @param {number} width - 图表宽度
 * @param {number} height - 图表高度
 * @param {Object} margin - 图表边距
 * @param {Object} chartStyleConfig - 图表样式配置
 * @param {Object} displayConfig - 显示配置（字体大小、刻度数量等）
 * @param {string} chartTitle - 图表标题（可选）
 * @returns {string} - SVG图表的HTML字符串
 */
function generateDonutChart(data, dateField, valueFields, width, height, margin, chartStyleConfig = null, displayConfig = {}, chartTitle = null) {
  try {
    
    // 创建JSDOM环境
    const { svg, document } = createJsdomEnv(width, height);
    applyChartSvgBackground(svg, width, height, chartStyleConfig);
    
    // 解析颜色配置（支持透传 chartColors）
    const colorBrand6 = resolveColor(COLOR_CONSTANTS.PRIMARY.BRAND6);
    const colorBrand5 = resolveColor(COLOR_CONSTANTS.PRIMARY.BRAND5);
    const colorBrand4 = resolveColor(COLOR_CONSTANTS.PRIMARY.BRAND4);
    const colorBrand3 = resolveColor(COLOR_CONSTANTS.PRIMARY.BRAND3);
    const defaultColorValues = [colorBrand5, colorBrand4, colorBrand3, colorBrand6, '#76b7b2', '#59a14f', '#edc949', '#af7aa1', '#ff9da7', '#9c755f', '#bab0ab'];
    const { colorValues } = getChartColorsFromConfig(chartStyleConfig, { colorValues: defaultColorValues, colorClass: [] });
    
    // 处理环状图数据 - 使用第一个值字段
    const valueField = valueFields[0];
    const donutData = data.map(d => {
      let rawValue = d[valueField];
      // 🆕 处理数值：移除 "万" 等后缀并转换为数字
      let numericValue = parseFloat(rawValue.toString().replace(/[万千百十]/g, '')) || 0;
      
      return {
        name: d[dateField],
        value: numericValue,
        originalValue: rawValue // 保留原始值用于显示
      };
    });
    
    const currentAxisConfig = displayConfig.isSmallChart ? smallAxisConfig : axisConfig;
    const resolvedAxisFontSize = resolveToken(currentAxisConfig.fontSize);
    
    // 计算图表区域
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // 🆕 优化环状图半径，减少留白，提高空间利用率
    const baseRadius = Math.min(innerWidth, innerHeight) / 2;
    const radius = displayConfig.isSmallChart ? 
      baseRadius - 10 :  // 小图表：减少留白
      baseRadius - 20;   // 普通图表：保留一些空间给标签
    
    if (chartTitle) {
      const titleStyleDonut = getResolvedTitleStyle(chartStyleConfig);
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', 25)
        .attr('text-anchor', 'middle')
        .attr('font-size', titleStyleDonut.fontSize)
        .attr('font-weight', titleStyleDonut.fontWeight)
        .attr('fill', titleStyleDonut.fill)
        .text(chartTitle);
    }

    // 创建主图表组，居中定位（如果有标题则向下移动）
    const g = svg.append('g')
      .attr('transform', `translate(${width / 2},${height / 2 + (chartTitle ? 15 : 0)})`);
    
    // 创建环状图生成器
    const pie = d3.pie()
      .value(d => d.value)
      .sort(null) // 不排序，保持原始顺序
      .padAngle(1 / radius); // 🆕 添加扇形间距，基于半径动态调整
    
    // 创建弧形生成器 - 环状图有内半径
    const arc = d3.arc()
      .innerRadius(radius * 0.67) // 🆕 内半径，创建环状效果
      .outerRadius(radius - 1);   // 外半径，留1px边距
    
    // 创建标签弧形（稍微外移）
    const labelArc = d3.arc()
      .innerRadius(radius + 10)
      .outerRadius(radius + 10);
    
    // 生成环状图扇形
    const arcs = g.selectAll('.arc')
      .data(pie(donutData))
      .enter()
      .append('g')
      .attr('class', 'arc');
    
    // 绘制扇形
    arcs.append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => colorValues[i % colorValues.length])
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);
    
    // 添加标签 - 只在扇形足够大时显示
    arcs.append('text')
      .attr('transform', d => `translate(${labelArc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('font-size', resolvedAxisFontSize || displayConfig.dataLabelSize || '8px')
      .attr('fill', '#333')
      .attr('font-weight', 'bold')
      .text(d => d.data.name);
    
    // 添加数值标签（显示在扇形内部）
    arcs.append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('font-size', resolvedAxisFontSize || displayConfig.dataLabelSize || '8px')
      .attr('fill', '#fff')
      .attr('font-weight', 'bold')
      .attr('stroke', '#000')
      .attr('stroke-width', '0.5px')
      .attr('paint-order', 'stroke')
      .text(d => d.data.originalValue); // 🆕 显示原始值（包含"万"等后缀）
    
    // 将SVG转换为字符串
    return svg.node().outerHTML;
  } catch (error) {
    console.error('生成环状图时发生错误:', error);
    return generateErrorSvg('生成环状图失败: ' + error.message);
  }
}

/**
 * 生成饼图
 * @param {Array} data - 图表数据
 * @param {string} dateField - 标签字段名（饼图中为类别标签）
 * @param {Array} valueFields - 值字段名数组（饼图中为数值）
 * @param {number} width - 图表宽度
 * @param {number} height - 图表高度
 * @param {Object} margin - 图表边距
 * @param {Object} chartStyleConfig - 图表样式配置
 * @param {Object} displayConfig - 显示配置（字体大小、刻度数量等）
 * @param {string} chartTitle - 图表标题（可选）
 * @returns {string} - SVG图表的HTML字符串
 */
function generatePieChart(data, dateField, valueFields, width, height, margin, chartStyleConfig = null, displayConfig = {}, chartTitle = null) {
  try {    
    // 创建JSDOM环境
    const { svg, document } = createJsdomEnv(width, height);
    applyChartSvgBackground(svg, width, height, chartStyleConfig);
    
    // 解析颜色配置（支持透传 chartColors）
    const colorBrand6 = resolveColor(COLOR_CONSTANTS.PRIMARY.BRAND6);
    const colorBrand5 = resolveColor(COLOR_CONSTANTS.PRIMARY.BRAND5);
    const colorBrand4 = resolveColor(COLOR_CONSTANTS.PRIMARY.BRAND4);
    const colorBrand3 = resolveColor(COLOR_CONSTANTS.PRIMARY.BRAND3);
    const defaultColorValues = [colorBrand5, colorBrand4, colorBrand3, colorBrand6, '#76b7b2', '#59a14f', '#edc949', '#af7aa1', '#ff9da7', '#9c755f', '#bab0ab'];
    const { colorValues } = getChartColorsFromConfig(chartStyleConfig, { colorValues: defaultColorValues, colorClass: [] });
    
    // 处理饼图数据 - 使用第一个值字段
    const valueField = valueFields[0];
    const pieData = data.map(d => {
      let rawValue = d[valueField];
      // 🆕 处理百分号：移除 % 符号并转换为数字
      let numericValue = parseFloat(rawValue.toString().replace('%', '')) || 0;
      
      return {
        label: d[dateField],
        value: numericValue,
        originalValue: rawValue // 保留原始值用于显示
      };
    });
    
    const currentAxisConfig4 = displayConfig.isSmallChart ? smallAxisConfig : axisConfig;
    const resolvedAxisFontSize4 = resolveToken(currentAxisConfig4.fontSize);
    
    // 计算图表区域
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // 🆕 优化饼图半径，减少留白，提高空间利用率
    const baseRadius = Math.min(innerWidth, innerHeight) / 2;
    const radius = displayConfig.isSmallChart ? 
      baseRadius - 10 :  // 小图表：减少留白，图例可能在外部
      baseRadius - 20;   // 普通图表：保留一些空间给标签
    
    if (chartTitle) {
      const titleStylePie = getResolvedTitleStyle(chartStyleConfig);
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', 25)
        .attr('text-anchor', 'middle')
        .attr('font-size', titleStylePie.fontSize)
        .attr('font-weight', titleStylePie.fontWeight)
        .attr('fill', titleStylePie.fill)
        .text(chartTitle);
    }

    // 创建主图表组，居中定位（如果有标题则向下移动）
    const g = svg.append('g')
      .attr('transform', `translate(${width / 2},${height / 2 + (chartTitle ? 15 : 0)})`);
    
    // 创建饼图生成器
    const pie = d3.pie()
      .value(d => d.value)
      .sort(null); // 不排序，保持原始顺序
    
    // 创建弧形生成器
    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);
    
    // 创建标签弧形（稍微外移）
    const labelArc = d3.arc()
      .innerRadius(radius + 10)
      .outerRadius(radius + 10);
    
    // 生成饼图扇形
    const arcs = g.selectAll('.arc')
      .data(pie(pieData))
      .enter()
      .append('g')
      .attr('class', 'arc');
    
    // 绘制扇形
    arcs.append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => colorValues[i % colorValues.length])
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);
    
    
    // 添加标签
    arcs.append('text')
      .attr('transform', d => `translate(${labelArc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('font-size', resolvedAxisFontSize4 || displayConfig.dataLabelSize || '8px') // 🆕 使用动态字体大小
      .attr('fill', '#333')
      .attr('font-weight', 'bold')
      .text(d => d.data.label);
    
    // 添加数值标签（显示在扇形内部）
    arcs.append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('font-size', resolvedAxisFontSize4 || displayConfig.dataLabelSize || '8px') // 🆕 使用动态字体大小
      .attr('fill', '#fff')
      .attr('font-weight', 'bold')
      .attr('stroke', '#000')
      .attr('stroke-width', '0.5px')
      .attr('paint-order', 'stroke')
      .text(d => d.data.originalValue); // 🆕 显示原始值（包含%符号）
    
    // 🆕 添加图例（可选）
    // // if (pieData.length <= 5) { // 只有在项目不太多时才显示图例
    // //   const legend = g.append('g')
    // //     .attr('class', 'legend')
    // //     .attr('transform', `translate(${radius - 35}, ${-pieData.length * 55})`);
      
    // //   // 🆕 根据图表大小选择合适的图例配置
    // //   const currentLegendConfig2 = displayConfig.isSmallChart ? smalllegendConfig : legendConfig;
    // //   const resolvedFontSize = resolveToken(currentLegendConfig2.fontSize);
    // //   const resolvedFontWeight = resolveToken(currentLegendConfig2.fontWeight);
    // //   const resolvedFill = resolveToken(currentLegendConfig2.fill);
    // //   const legendFontSize = resolvedFontSize || displayConfig.legendLabelSize || '8px';
      
    // //   pieData.forEach((d, i) => {
    // //     const legendItem = legend.append('g')
    // //       .attr('transform', `translate(0, ${i * 20})`);
        
    // //     // 图例色块
    // //     legendItem.append('rect')
    // //       .attr('width', 15)
    // //       .attr('height', 15)
    // //       .attr('fill', colorValues[i % colorValues.length]);
        
    // //     // 图例文字
    // //     legendItem.append('text')
    // //       .attr('x', 20)
    // //       .attr('y', 12)
    //       .attr('width', 200)
    //       .attr('word-break', 'break-all')
    // //       .attr('font-size', legendFontSize) // 🆕 优先使用token，其次使用动态配置
    // //       .attr('font-weight', resolvedFontWeight || '400')  // 🆕 使用token中的字体粗细
    // //       .attr('fill', resolvedFill || '#333')  // 🆕 使用token中的颜色
    // //       .text(`${d.label}: ${d.originalValue}`); // 🆕 使用原始值显示
    // //   });
    // // }
    
    // 将SVG转换为字符串
    return svg.node().outerHTML;
  } catch (error) {
    console.error('生成饼图时发生错误:', error);
    return generateErrorSvg('生成饼图失败: ' + error.message);
  }
}

/**
 * 生成错误信息的SVG
 * @param {string} errorMessage - 错误信息
 * @returns {string} - 错误信息SVG
 */
function generateErrorSvg(errorMessage) {
  try {
    // 创建JSDOM环境
    const { svg, document } = createJsdomEnv(800, 250);
    
    // 添加背景矩形
    svg.append('rect')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('fill', '#fff0f0');
    
    // 添加错误标题
    svg.append('text')
      .attr('x', 50)
      .attr('y', 50)
      .attr('font-family', 'sans-serif')
      .attr('font-size', '18px')
      .attr('fill', '#d32f2f')
      .text('图表生成错误');
    
    // 添加错误信息
    svg.append('text')
      .attr('x', 50)
      .attr('y', 80)
      .attr('font-family', 'sans-serif')
      .attr('font-size', '14px')
      .attr('fill', '#666')
      .text(errorMessage || '未知错误');
    
    // 添加提示信息
    svg.append('text')
      .attr('x', 50)
      .attr('y', 120)
      .attr('font-family', 'sans-serif')
      .attr('font-size', '14px')
      .attr('fill', '#666')
      .text('请检查数据格式是否正确，确保表格至少包含标题行和一行数据。');
    
    // 将SVG转换为字符串
    return svg.node().outerHTML;
  } catch (error) {
    console.error('生成错误SVG时发生错误:', error);
    // 返回简单的错误提示，避免错误嵌套
    return `<svg width="800" height="250" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#fff0f0" />
      <text x="50" y="50" font-family="sans-serif" font-size="18" fill="#d32f2f">
        图表生成错误
      </text>
      <text x="50" y="80" font-family="sans-serif" font-size="14" fill="#666">
        ${errorMessage || '未知错误'}
      </text>
    </svg>`;
  }
}

export default {
  generateChartFromTableData,
  generateGroupedLineChart,
  generateAreaChart,
  generateBarChart,
  generateBarHChart,
  generatePieChart,
  generateDonutChart,
  generateErrorSvg
}; 