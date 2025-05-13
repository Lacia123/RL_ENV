/**
 * chartGenerator.js
 * 
 * 用于生成D3可视化图表的工具函数
 * 支持从表格数据生成各种类型的图表
 * 使用jsdom创建服务器端虚拟DOM环境来利用d3的全部功能
 */

import * as d3 from 'd3';
import { COLOR_CONSTANTS } from './styleConfig.js';
import resolveToken from '../tokens/resolveToken.js';
import { JSDOM } from 'jsdom';

/**
 * 创建JSDOM环境
 * @param {number} width - SVG宽度
 * @param {number} height - SVG高度
 * @returns {Object} - 包含document和d3对象的环境
 */
function createJsdomEnv(width = 800, height = 500) {
  // 创建虚拟DOM
  const dom = new JSDOM(`<!DOCTYPE html><html><body></body></html>`);
  const document = dom.window.document;
  
  // 创建SVG元素
  const svg = d3.select(document.body)
    .append('svg')
    .attr('width', "100%")
    .attr('height', height)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('xmlns', 'http://www.w3.org/2000/svg');
  
  // 添加样式
  const defs = svg.append('defs');
  defs.append('style').text(`
    .axis line, .axis path {
      stroke: #bdbdbd;
      shape-rendering: crispEdges;
    }
    .axis text {
      fill: #666;
      font-size: 12px;
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
    .bar {
      fill-opacity: 0.8;
    }
    .bar:hover {
      fill-opacity: 1;
    }
  `);
  
  return {
    document,
    svg,
    body: document.body
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
 * 从表格数据生成折线图
 * @param {Array} tableData - 二维数组表格数据
 * @param {string} chartType - 图表类型
 * @returns {string} - SVG图表的HTML字符串
 */
export function generateChartFromTableData(tableData, chartType) {
  try {
    console.log('生成图表，类型:', chartType, '数据行数:', tableData.length);
    
    // 确保至少有标题行和一行数据
    if (!tableData || tableData.length < 2) {
      throw new Error('图表数据不足，至少需要标题行和一行数据');
    }
    
    // 设置图表尺寸和边距
    const width = 800;
    const height = 500;
    const margin = { top: 50, right: 50, bottom: 70, left: 70 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // 提取标题行和数据行
    const headers = tableData[0];
    const rows = tableData.slice(1);
    
    // 日期列是第一列
    const dateField = headers[0];
    
    // 其他列是值
    const valueFields = headers.slice(1);
    
    // 处理数据，转换为适合绘图的格式
    const chartData = rows.map(row => {
      const item = { [dateField]: row[0] };
      valueFields.forEach((field, i) => {
        // 尝试转换为数字，如果失败则保留为0
        item[field] = parseFloat(row[i + 1]) || 0;
      });
      return item;
    });
    
    // 根据图表类型生成不同的图表
    switch(chartType) {
      case 'grouped_line':
        return generateGroupedLineChart(chartData, dateField, valueFields, width, height, margin);
      case 'bar':
        return generateBarChart(chartData, dateField, valueFields, width, height, margin);
      case 'barh':
        return generateBarHChart(chartData, dateField, valueFields, width, height, margin);
      default:
        // 默认使用分组折线图
        return generateGroupedLineChart(chartData, dateField, valueFields, width, height, margin);
    }
  } catch (error) {
    console.error('生成图表时发生错误:', error);
    return generateErrorSvg(error.message);
  }
}

/**
 * 生成分组折线图
 * @param {Array} data - 图表数据
 * @param {string} dateField - 日期字段名
 * @param {Array} valueFields - 值字段名数组
 * @param {number} width - 图表宽度
 * @param {number} height - 图表高度
 * @param {Object} margin - 图表边距
 * @returns {string} - SVG图表的HTML字符串
 */
function generateGroupedLineChart(data, dateField, valueFields, width, height, margin) {
  try {
    console.log('生成分组折线图, 数据点数:', data.length, '数据系列数:', valueFields.length);
    
    // 创建JSDOM环境
    const { svg, document } = createJsdomEnv(width, height);
    
    // 解析颜色，确保使用有效的颜色值
    const colorBrand5 = resolveColor(COLOR_CONSTANTS.PRIMARY.BRAND5);
    const colorBrand4 = resolveColor(COLOR_CONSTANTS.PRIMARY.BRAND4);
    const colorBrand3 = resolveColor(COLOR_CONSTANTS.PRIMARY.BRAND3);
    
    // 定义颜色数组
    const colorValues = [
      colorBrand5,
      colorBrand4,
      colorBrand3,
      '#76b7b2', 
      '#59a14f', 
      '#edc949', 
      '#af7aa1', 
      '#ff9da7', 
      '#9c755f', 
      '#bab0ab'
    ];
    
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // 创建图表组容器
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // X轴数据点
    const xValues = data.map(d => d[dateField]);
    
    // 找出所有值字段的最大值和最小值
    let allValues = [];
    valueFields.forEach(field => {
      allValues = allValues.concat(data.map(d => d[field]));
    });
    const yMin = Math.min(0, ...allValues);
    const yMax = Math.max(...allValues) * 1.1; // 上限留10%空间
    
    // 创建比例尺
    const xScale = d3.scalePoint()
      .domain(xValues)
      .range([0, innerWidth])
      .padding(0.5);
    
    const yScale = d3.scaleLinear()
      .domain([yMin, yMax])
      .range([innerHeight, 0]);
    
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
      .attr('stroke', '#e0e0e0')
      .attr('stroke-opacity', 0.7);
    
    // 添加Y轴网格线
    const yTickCount = 5;
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
      .attr('stroke', '#e0e0e0')
      .attr('stroke-opacity', 0.7);
    
    // 添加X轴
    const xAxis = g.append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', `translate(0,${innerHeight})`);
    
    xAxis.selectAll('g')
      .data(xValues)
      .enter()
      .append('g')
      .attr('transform', d => `translate(${xScale(d)},0)`)
      .append('text')
      .attr('y', 9)
      .attr('dy', '.71em')
      .attr('transform', 'rotate(45)')
      .attr('text-anchor', 'start')
      .attr('font-size', '12px')
      .text(d => d);
    
    // 添加Y轴
    const yAxis = g.append('g')
      .attr('class', 'axis y-axis');
    
    yAxis.selectAll('g')
      .data(yTicks)
      .enter()
      .append('g')
      .attr('transform', d => `translate(0,${yScale(d)})`)
      .call(g => {
        g.append('line')
          .attr('x2', -6)
          .attr('stroke', '#666');
        g.append('text')
          .attr('x', -9)
          .attr('dy', '.32em')
          .attr('text-anchor', 'end')
          .attr('font-size', '12px')
          .text(d => d.toFixed(2));
      });
    
    // 为每个值字段绘制一条线和点
    valueFields.forEach((field, fieldIndex) => {
      const color = colorValues[fieldIndex % colorValues.length];
      
      // 提取该字段的数据
      const lineData = data.map(d => ({
        x: d[dateField],
        y: d[field]
      }));
      
      // 创建线的生成器
      const line = d3.line()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y));
      
      // 绘制折线组
      const lineGroup = g.append('g')
        .attr('class', 'line-group');
      
      // 添加线
      lineGroup.append('path')
        .attr('class', 'line')
        .attr('d', line(lineData))
        .attr('stroke', color)
        .attr('fill', 'none')
        .attr('stroke-width', 2.5);
      
      // 添加数据点
      lineGroup.selectAll('.dot')
        .data(lineData)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', d => xScale(d.x))
        .attr('cy', d => yScale(d.y))
        .attr('r', 4)
        .attr('fill', color)
        .attr('stroke', '#fff')
        .attr('stroke-width', 1);
      
      // 添加最后一个点的标签
      if (lineData.length > 0) {
        const lastPoint = lineData[lineData.length - 1];
        lineGroup.append('text')
          .attr('x', xScale(lastPoint.x) + 5)
          .attr('y', yScale(lastPoint.y))
          .attr('font-size', '12px')
          .attr('fill', color)
          .text(lastPoint.y.toFixed(2));
      }
    });
    
    // 添加图例
    const legend = g.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${innerWidth / 2}, -${margin.top - 30})`);
    
    // 动态计算图例位置
    const legendItemWidth = 150;
    const legendItemsPerRow = Math.min(3, valueFields.length);
    const legendWidth = legendItemsPerRow * legendItemWidth;
    const legendStartX = -legendWidth / 2;
    
    valueFields.forEach((field, i) => {
      const row = Math.floor(i / legendItemsPerRow);
      const col = i % legendItemsPerRow;
      const x = legendStartX + col * legendItemWidth;
      const y = row * 25;
      const color = colorValues[i % colorValues.length];
      
      const legendItem = legend.append('g')
        .attr('transform', `translate(${x}, ${y})`);
      
      legendItem.append('rect')
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', color);
      
      legendItem.append('text')
        .attr('x', 20)
        .attr('y', 12.5)
        .attr('font-size', '14px')
        .attr('alignment-baseline', 'middle')
        .text(field);
    });
    
    // 将SVG转换为字符串
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
 * @returns {string} - SVG图表的HTML字符串
 */
function generateBarChart(data, dateField, valueFields, width, height, margin) {
  try {
    console.log('生成柱状图，使用d3和jsdom');
    
    // 创建JSDOM环境
    const { svg, document } = createJsdomEnv(width, height);
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // 主图表组
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // 添加提示文本
    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight / 2)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'sans-serif')
      .attr('font-size', '24px')
      .attr('fill', '#333')
      .text('柱状图功能正在开发中');
    
    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight / 2 + 40)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'sans-serif')
      .attr('font-size', '14px')
      .attr('fill', '#666')
      .text('当前已支持分组折线图 (grouped_line)');
    
    // 将SVG转换为字符串
    return svg.node().outerHTML;
  } catch (error) {
    console.error('生成柱状图时发生错误:', error);
    return generateErrorSvg('生成柱状图失败: ' + error.message);
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
 * @returns {string} - SVG图表的HTML字符串
 */
function generateBarHChart(data, dateField, valueFields, width, height, margin) {
  try {
    console.log('生成水平柱状图, 数据点数:', data.length, '数据系列数:', valueFields.length);
    
    // 创建JSDOM环境
    const { svg, document } = createJsdomEnv(width, height);
    
    // 解析颜色
    const colorBrand5 = resolveColor(COLOR_CONSTANTS.PRIMARY.BRAND5);
    const colorBrand4 = resolveColor(COLOR_CONSTANTS.PRIMARY.BRAND4);
    const colorBrand3 = resolveColor(COLOR_CONSTANTS.PRIMARY.BRAND3);
    
    // 定义颜色数组
    const colorValues = [
      colorBrand5,
      colorBrand4,
      colorBrand3,
      '#76b7b2', 
      '#59a14f', 
      '#edc949', 
      '#af7aa1', 
      '#ff9da7', 
      '#9c755f', 
      '#bab0ab'
    ];
    
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // 主图表组
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // X轴类别（日期）
    const categories = data.map(d => d[dateField]);
    
    // 寻找所有数据系列的最大值，用于设置比例尺
    let maxValue = 0;
    valueFields.forEach(field => {
      const fieldMax = d3.max(data, d => d[field]);
      maxValue = Math.max(maxValue, fieldMax);
    });
    maxValue = maxValue * 1.1; // 增加10%的空间
    
    // 处理单个数据系列的情况
    const valueField = valueFields[0]; // 只使用第一个数据系列
    
    // 创建x和y轴的比例尺
    const xScale = d3.scaleLinear()
      .domain([0, maxValue])
      .range([0, innerWidth]);
    
    const yScale = d3.scaleBand()
      .domain(categories)
      .range([0, innerHeight])
      .padding(0.3);
    
    // 添加水平网格线
    g.append('g')
      .attr('class', 'grid y-grid')
      .selectAll('line')
      .data(xScale.ticks(5))
      .enter()
      .append('line')
      .attr('x1', d => xScale(d))
      .attr('y1', 0)
      .attr('x2', d => xScale(d))
      .attr('y2', innerHeight)
      .attr('stroke', '#e0e0e0')
      .attr('stroke-opacity', 0.7);
    
    // 添加x轴
    const xAxis = g.append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).ticks(5).tickFormat(d => d));
    
    // 添加y轴
    const yAxis = g.append('g')
      .attr('class', 'axis y-axis')
      .call(d3.axisLeft(yScale));
    
    // 获取柱状图颜色
    const barColor = colorValues[0];
    
    // 绘制水平柱状图
    const bars = g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('y', d => yScale(d[dateField]))
      .attr('x', 0)
      .attr('height', yScale.bandwidth())
      .attr('width', d => xScale(d[valueField]))
      .attr('fill', barColor);
    
    // 添加数值标签
    g.selectAll('.bar-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'bar-label')
      .attr('y', d => yScale(d[dateField]) + yScale.bandwidth() / 2)
      .attr('x', d => xScale(d[valueField]) + 5)
      .attr('dy', '.35em')
      .attr('text-anchor', 'start')
      .attr('fill', '#333')
      .attr('font-size', '12px')
      .text(d => d[valueField]);
    
    
    // 添加X轴标题
    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 40)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .text(valueField);
    
    // 添加Y轴标题
    g.append('text')
      .attr('transform', `rotate(-90)`)
      .attr('x', -innerHeight / 2)
      .attr('y', -60)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .text(dateField);
    
    // 将SVG转换为字符串
    return svg.node().outerHTML;
  } catch (error) {
    console.error('生成水平柱状图时发生错误:', error);
    return generateErrorSvg('生成水平柱状图失败: ' + error.message);
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
  generateBarChart,
  generateBarHChart,
  generateErrorSvg
}; 