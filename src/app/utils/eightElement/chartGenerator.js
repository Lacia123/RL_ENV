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
    let chartData = rows.map(row => {
      const item = { [dateField]: row[0] };
      valueFields.forEach((field, i) => {
        // 尝试转换为数字，如果失败则保留为0
        item[field] = parseFloat(row[i + 1]) || 0;
      });
      return item;
    });

    // Sort chartData by date ascending to ensure X-axis is chronological LTR
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
    
    const { svg, document } = createJsdomEnv(width, height);
    
    const colorBrand5 = resolveColor(COLOR_CONSTANTS.PRIMARY.BRAND5);
    const colorBrand4 = resolveColor(COLOR_CONSTANTS.PRIMARY.BRAND4);
    const colorBrand3 = resolveColor(COLOR_CONSTANTS.PRIMARY.BRAND3);
    
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
    
    const lineStyles = [
      { strokeWidth: 3, dashArray: "0" },      // 实线粗
      { strokeWidth: 2.5, dashArray: "0" },    // 实线中
      { strokeWidth: 2, dashArray: "0" },      // 实线细
      { strokeWidth: 3.5, dashArray: "0" },    // 实线最粗
      { strokeWidth: 1.8, dashArray: "0" },    // 实线较细
      { strokeWidth: 2.8, dashArray: "0" },    // 实线中粗
      { strokeWidth: 2.2, dashArray: "0" },    // 实线中细
      { strokeWidth: 3.2, dashArray: "0" },    // 实线粗2
      { strokeWidth: 2.3, dashArray: "0" },    // 实线中2
      { strokeWidth: 1.9, dashArray: "0" }     // 实线细2
    ];
    
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    const xValues = data.map(d => d[dateField]);
    
    let allValues = [];
    valueFields.forEach(field => {
      allValues = allValues.concat(data.map(d => d[field]));
    });
    const yMin = Math.min(0, ...allValues);
    const yMax = Math.max(...allValues) * 1.1; // 上限留10%空间
    
    const xScale = d3.scalePoint()
      .domain(xValues)
      .range([0, innerWidth])
      .padding(0.5);
    
    const yScale = d3.scaleLinear()
      .domain([yMin, yMax])
      .range([innerHeight, 0]);
    
    // RE-INTRODUCE Data point grouping and pre-calculation of label positions
    const valueGroupsMap = new Map();
    const areValuesClose = (a, b) => { 
        if (Math.abs(a) < 0.001 && Math.abs(b) < 0.001) return true;
        return Math.abs(a - b) < 0.5; 
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
        const lineStyle = lineStyles[fieldIndex % lineStyles.length];
        
        const lineData = data.map(d => ({ x: d[dateField], y: d[field], original: d }));
        
        const line = d3.line().x(d => xScale(d.x)).y(d => yScale(d.y));
        
        const lineGroup = g.append('g').attr('class', 'line-group');

        // 1. Draw Line PATH first
        lineGroup.append('path')
            .attr('class', 'line')
            .attr('d', line(lineData))
            .attr('stroke', color)
            .attr('fill', 'none')
            .attr('stroke-width', lineStyle.strokeWidth)
            .attr('stroke-dasharray', lineStyle.dashArray);

        // 2. Draw DOTS (and their groups) on top of lines
        const dots = lineGroup.selectAll('.dot-group')
            .data(lineData)
            .enter()
            .append('g')
            .attr('class', 'dot-group')
            .attr('transform', d => `translate(${xScale(d.x)},${yScale(d.y)})`);

        dots.append('circle')
            .attr('class', 'dot')
            .attr('r', 4)
            .attr('fill', color)
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
                        .attr('class', 'data-label')
                        .attr('x', pos.x)
                        .attr('y', pos.y)
                        .attr('font-size', '10px')
                        .attr('text-anchor', pos.anchor)
                        .attr('fill', color) // Use series color for label
                        .attr('font-weight', 'normal')
                        .attr('stroke', 'white')
                        .attr('stroke-width', '2px')
                        .attr('stroke-opacity', '0.85')
                        .attr('paint-order', 'stroke')
                        .text(currentPointValueGroup.value.toFixed(1));
                }
            }
        });
    });
    
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
    
    // 添加图例 - 修改图例排版以避免重叠
    const legend = g.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(0, -${margin.top - 10})`);
    
    // 动态计算图例位置 - 使用更紧凑的布局
    const legendItemWidth = 140; // 调整图例项宽度，增加间距
    const legendItemHeight = 20; // 图例项高度
    const legendItemsPerRow = Math.min(3, valueFields.length); // 减少每行图例数量以增加间距
    const legendWidth = legendItemsPerRow * legendItemWidth;
    
    valueFields.forEach((field, i) => {
      const row = Math.floor(i / legendItemsPerRow);
      const col = i % legendItemsPerRow;
      const x = col * legendItemWidth;
      const y = row * legendItemHeight;
      const color = colorValues[i % colorValues.length];
      const lineStyle = lineStyles[i % lineStyles.length];
      
      const legendItem = legend.append('g')
        .attr('transform', `translate(${x}, ${y})`);
      
      // 绘制线样式示例而不是方块，以便更好地区分
      legendItem.append('line')
        .attr('x1', 0)
        .attr('y1', 6)
        .attr('x2', 15)
        .attr('y2', 6)
        .attr('stroke', color)
        .attr('stroke-width', lineStyle.strokeWidth)
        .attr('stroke-dasharray', lineStyle.dashArray);
      
      // 添加小圆点
      legendItem.append('circle')
        .attr('cx', 8)
        .attr('cy', 6)
        .attr('r', 3)
        .attr('fill', color)
        .attr('stroke', '#fff')
        .attr('stroke-width', 1);
      
      // 减小图例文字大小，截断过长的文字
      const text = legendItem.append('text')
        .attr('x', 20)
        .attr('y', 9)
        .attr('font-size', '10px') // 缩小字体大小
        .attr('alignment-baseline', 'middle')
        .text(field);
      
      // 如果文字太长，截断并添加省略号
      const maxTextLength = 85; // 最大文本长度（像素）
      const truncateText = (text, maxLength) => {
        const node = text.node();
        if (node) {
          const textLength = node.getComputedTextLength ? node.getComputedTextLength() : field.length * 6;
          if (textLength > maxLength) {
            // 根据字符估算长度，尝试截断
            const approxChars = Math.floor((maxLength / textLength) * field.length) - 3;
            text.text(field.substring(0, approxChars) + '...');
          }
        }
      };
      
      truncateText(text, maxTextLength);
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