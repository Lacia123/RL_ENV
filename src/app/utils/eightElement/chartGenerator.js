/**
 * chartGenerator.js
 * 
 * 用于生成D3可视化图表的工具函数
 * 支持从表格数据生成各种类型的图表
 * 使用jsdom创建服务器端虚拟DOM环境来利用d3的全部功能
 */

import * as d3 from 'd3';
import { COLOR_CONSTANTS, DEFAULT_STYLE_CONFIG,  } from './styleConfig.js';
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
  
  // 🆕 创建响应式SVG元素 - 适应容器宽度
  const svg = d3.select(document.body)
    .append('svg')
    .attr('width', '100%')        // 🆕 使用100%宽度，适应容器
    .attr('height', '100%')       // 🆕 使用100%高度，完全填充
    .attr('viewBox', `0 0 ${width} ${height}`)  // 保持原始比例
    .attr('preserveAspectRatio', 'none')  // 🆕 不保持宽高比，完全拉伸填充
    .attr('xmlns', 'http://www.w3.org/2000/svg')
    .style('width', '100%')       // 🆕 CSS确保宽度100%
    .style('height', '100%')      // 🆕 CSS确保高度100%
    .style('display', 'block')    // 🆕 块级元素，避免内联空隙
    .style('min-height', '200px'); // 🆕 最小高度，避免太小
  
  // 解析颜色tokens
  const colorBrand6 = resolveColor(COLOR_CONSTANTS.PRIMARY.BRAND6);
  const colorBrand5 = resolveColor(COLOR_CONSTANTS.PRIMARY.BRAND5);
  const colorBrand4 = resolveColor(COLOR_CONSTANTS.PRIMARY.BRAND4);


  // .axis text {
    //   fill: #666;
    //   font-size: 12px;
    // }
  
  // 添加样式
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
 * @param {Object} chartStyleConfig - 图表样式配置（包含title、legend、axis的className和classStyle）
 * @returns {string} - SVG图表的HTML字符串
 */
export function generateChartFromTableData(tableData, chartType, chartStyleConfig = null) {
  try {
    console.log('生成图表，类型:', chartType, '数据行数:', tableData.length);
    
    // 确保至少有标题行和一行数据
    if (!tableData || tableData.length < 2) {
      throw new Error('图表数据不足，至少需要标题行和一行数据');
    }
    
    // 设置图表尺寸和边距
    // 🆕 增大基础尺寸，让图表占满容器
    const width = 600;  // 增大宽度，充分利用容器空间
    const height = 400; // 增大高度，保持合理比例
    // 🆕 根据图表宽度动态调整显示参数
    const isSmallChart = chartStyleConfig?.variant === 'small'
    // 🆕 根据是否为小图表优化边距
    const optimizedMargin = isSmallChart ? 
      { top: 15, right: 20, bottom: 60, left: 80 } :   // 小图表：减少上下边距，优化空间利用
      { top: 20, right: 30, bottom: 80, left: 90 };    // 普通图表：保持充足边距
    
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
      axisLabelSize: isSmallChart ? '20px' : '12px',     // 小图表轴标签显著更大 (18px→20px)
      dataLabelSize: isSmallChart ? '16px' : '10px',     // 小图表数据标签显著更大
      legendLabelSize: isSmallChart ? '16px' : '10px',   // 小图表图例显著更大
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
        return generateGroupedLineChart(chartData, dateField, valueFields, width, height, margin, chartStyleConfig, displayConfig);
      case 'line':
        return generateGroupedLineChart(chartData, dateField, valueFields, width, height, margin, chartStyleConfig, displayConfig);
      case 'bar':
        return generateBarChart(chartData, dateField, valueFields, width, height, margin, chartStyleConfig, displayConfig);
      case 'barh':
        return generateBarHChart(chartData, dateField, valueFields, width, height, margin, chartStyleConfig, displayConfig);
      case 'pie':
        return generatePieChart(chartData, dateField, valueFields, width, height, margin, chartStyleConfig, displayConfig);
      default:
        // 默认使用分组折线图
        return generateGroupedLineChart(chartData, dateField, valueFields, width, height, margin, chartStyleConfig, displayConfig);
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
 * @param {Object} chartStyleConfig - 图表样式配置
 * @param {Object} displayConfig - 显示配置（字体大小、刻度数量等）
 * @returns {string} - SVG图表的HTML字符串
 */
function generateGroupedLineChart(data, dateField, valueFields, width, height, margin, chartStyleConfig = null, displayConfig = {}) {
  try {
    console.log('生成分组折线图, 数据点数:', data.length, '数据系列数:', valueFields.length);
    
    const { svg, document } = createJsdomEnv(width, height);
    
    const colorBrand6 = resolveColor(COLOR_CONSTANTS.PRIMARY.BRAND6);
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

    const colorClass = [
      'color-brand6',
      'color-brand5',
      'color-brand4'
    ]
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
    
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
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

        // 1. Draw Line PATH first
        // lineGroup.append('path')
        //     .attr('class', 'line')
        //     .attr('d', line(lineData))
        //     .attr('stroke', color)
        //     .attr('fill', 'none')
        //     .attr('stroke-width', lineStyle.strokeWidth)
        //     .attr('stroke-dasharray', lineStyle.dashArray);

        // // 2. Draw DOTS (and their groups) on top of lines
        // const dots = lineGroup.selectAll('.dot-group')
        //     .data(lineData)
        //     .enter()
        //     .append('g')
        //     .attr('class', 'dot-group')
        //     .attr('transform', d => `translate(${xScale(d.x)},${yScale(d.y)})`);

        // dots.append('circle')
        //     .attr('class', 'dot')
        //     .attr('r', 4)
        //     .attr('fill', color)
        //     .attr('stroke', '#fff')
        //     .attr('stroke-width', 1.5);


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
                        .attr('font-size', displayConfig.dataLabelSize || '10px') // 🆕 使用动态数据标签字体大小
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
      .attr('stroke', '#e0e0e0')
      .attr('stroke-opacity', 0.7);
    
    // 添加X轴
    const xAxis = g.append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', `translate(0,${innerHeight})`);
    
    // 获取轴样式配置
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
      .attr('font-size', displayConfig.axisLabelSize || '12px') // 🆕 使用动态轴标签字体大小
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
          .attr('class', axisClassName)
          .attr('x', -9)
          .attr('dy', '.32em')
          .attr('text-anchor', 'end')
          .attr('font-size', displayConfig.axisLabelSize || '12px') // 🆕 使用动态轴标签字体大小
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
    
    // 添加图例 - 🆕 优化图例排版以节省空间
    const legend = g.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(0, -${margin.top - 5})`); // 🆕 图例更靠近顶部，节省空间
    
    // 🆕 动态计算图例位置 - 调整间距避免重叠
    const legendItemWidth = displayConfig.isSmallChart ? 150 : 160; // 🆕 增加图例间距避免重叠 (100→150)
    const legendItemHeight = displayConfig.isSmallChart ? 20 : 24;   // 🆕 增加图例高度避免垂直重叠 (16→20)
    const legendItemsPerRow = Math.min(3, valueFields.length); // 🆕 减少每行图例数量避免拥挤 (4→3)
    const legendWidth = legendItemsPerRow * legendItemWidth;
    
    valueFields.forEach((field, i) => {
      const row = Math.floor(i / legendItemsPerRow);
      const col = i % legendItemsPerRow;
      const x = col * legendItemWidth;
      const y = row * legendItemHeight;
      const color = colorValues[i % colorValues.length];
      const colorClassSuffix = colorClass[i % colorClass.length];
      const lineStyle = lineStyles[i % lineStyles.length];
      
      const legendItem = legend.append('g')
        .attr('transform', `translate(${x}, ${y})`);
      
      // 绘制线样式示例而不是方块，以便更好地区分
      legendItem.append('line')
        .attr('x1', 0)
        .attr('y1', 6)
        .attr('x2', 15)
        .attr('y2', 6)
        .attr('class', `line line-${colorClassSuffix}`)
        .attr('stroke', '#000')
        .attr('stroke-width', lineStyle.strokeWidth)
        .attr('stroke-dasharray', lineStyle.dashArray);
      
      // 添加小圆点
      legendItem.append('circle')
        .attr('cx', 8)
        .attr('cy', 6)
        .attr('r', 3)
        .attr('class', `dot dot-${colorClassSuffix}`)
        .attr('fill', '#000')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1);
      
      // 获取图例样式配置
      const legendClassName = chartStyleConfig?.legend?.className || 'legend-label';
      
      // 减小图例文字大小，截断过长的文字
      const text = legendItem.append('text')
        .attr('class', legendClassName)
        .attr('x', 20)
        .attr('y', 9)
        .attr('font-size', displayConfig.legendLabelSize || '10px') // 🆕 使用动态图例字体大小
        .attr('alignment-baseline', 'middle')
        .text(field);
      
      // 如果文字太长，截断并添加省略号 - 🆕 根据间距调整最大长度
      const maxTextLength = displayConfig.isSmallChart ? 120 : 130; // 🆕 增加最大文本长度，配合更大的间距
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
 * @param {Object} chartStyleConfig - 图表样式配置
 * @param {Object} displayConfig - 显示配置（字体大小、刻度数量等）
 * @returns {string} - SVG图表的HTML字符串
 */
function generateBarChart(data, dateField, valueFields, width, height, margin, chartStyleConfig = null, displayConfig = {}) {
  try {
    console.log('生成垂直柱状图, 数据点数:', data.length, '数据系列数:', valueFields.length);
    
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

    const colorClass = [
      'color-brand6',
      'color-brand5',
      'color-brand4'
    ];
    
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // 主图表组
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // X轴类别（品牌名称）
    const categories = data.map(d => d[dateField]);
    
    // 处理单个数据系列的情况
    const valueField = valueFields[0]; // 只使用第一个数据系列
    
    // 寻找所有数据系列的最大值，用于设置比例尺
    let maxValue = 0;
    valueFields.forEach(field => {
      const fieldMax = d3.max(data, d => parseFloat(d[field].toString().replace('%', '')) || 0);
      maxValue = Math.max(maxValue, fieldMax);
    });
    maxValue = maxValue * 1.1; // 增加10%的空间
    
    // 创建x和y轴的比例尺
    const xScale = d3.scaleBand()
      .domain(categories)
      .range([0, innerWidth])
      .padding(displayConfig.isSmallChart ? 0.2 : 0.3); // 🆕 小图表减少柱子间距
    
    const yScale = d3.scaleLinear()
      .domain([0, maxValue])
      .range([innerHeight, 0]);
    
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
      .attr('stroke', '#e0e0e0')
      .attr('stroke-opacity', 0.7);
    
    // 🆕 手动创建X轴标签，设置合适的字体大小
    const xAxis = g.append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', `translate(0,${innerHeight})`);
    
    // 添加X轴刻度线和标签（品牌名称）
    xAxis.selectAll('.tick')
      .data(categories)
      .enter()
      .append('g')
      .attr('class', 'tick')
      .attr('transform', d => `translate(${xScale(d) + xScale.bandwidth() / 2}, 0)`)
      .call(g => {
        // 添加刻度线
        g.append('line')
          .attr('y2', 6)
          .attr('stroke', '#666');
        
        // 🆕 添加标签文字，使用动态字体大小
        g.append('text')
          .attr('y', 9)
          .attr('dy', '.71em')
          .attr('text-anchor', 'middle')
          .attr('font-size', displayConfig.axisLabelSize || '14px') // 🆕 使用动态字体大小
          .attr('fill', '#333')
          .text(d => d);
      });
    
    // 添加y轴
    const yAxis = g.append('g')
      .attr('class', 'axis y-axis')
      .call(d3.axisLeft(yScale).ticks(displayConfig.isSmallChart ? 3 : 5));
    
    // 获取柱状图颜色
    const barColor = colorValues[0];
    const colorClassSuffix = colorClass[0];
    
    // 绘制垂直柱状图
    const bars = g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', `bar bar-${colorClassSuffix}`)
      .attr('x', d => xScale(d[dateField]))
      .attr('y', d => yScale(parseFloat(d[valueField].toString().replace('%', '')) || 0))
      .attr('width', xScale.bandwidth())
      .attr('height', d => innerHeight - yScale(parseFloat(d[valueField].toString().replace('%', '')) || 0))
      .attr('fill', '#000');
    
    // 添加数值标签
    g.selectAll('.bar-label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'bar-label')
      .attr('x', d => xScale(d[dateField]) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(parseFloat(d[valueField].toString().replace('%', '')) || 0) - 5)
      .attr('text-anchor', 'middle')
      .attr('fill', '#333')
      .attr('font-size', displayConfig.dataLabelSize || '12px') // 🆕 使用动态数据标签字体大小
      .text(d => d[valueField]);
    
    // 将SVG转换为字符串
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
 * @returns {string} - SVG图表的HTML字符串
 */
function generateBarHChart(data, dateField, valueFields, width, height, margin, chartStyleConfig = null, displayConfig = {}) {
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

    const colorClass = [
      'color-brand6',
      'color-brand5',
      'color-brand4'
    ]
    
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
      .padding(displayConfig.isSmallChart ? 0.2 : 0.3); // 🆕 小图表减少柱子间距，提高空间利用
    
    // 添加水平网格线
    g.append('g')
      .attr('class', 'grid y-grid')
      .selectAll('line')
      .data(xScale.ticks(displayConfig.isSmallChart ? 3 : 5)) // 🆕 小图表减少网格线数量
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
    
    // 🆕 手动创建Y轴标签，设置合适的字体大小
    const yAxis = g.append('g')
      .attr('class', 'axis y-axis');
    
    // 添加Y轴刻度线和标签
    yAxis.selectAll('.tick')
      .data(categories)
      .enter()
      .append('g')
      .attr('class', 'tick')
      .attr('transform', d => `translate(0, ${yScale(d) + yScale.bandwidth() / 2})`)
      .call(g => {
        // 添加刻度线
        g.append('line')
          .attr('x2', -6)
          .attr('stroke', '#666');
        
        // 🆕 添加标签文字，使用动态字体大小
        g.append('text')
          .attr('x', -9)
          .attr('dy', '.32em')
          .attr('text-anchor', 'end')
          .attr('font-size', displayConfig.axisLabelSize || '14px') // 🆕 使用动态字体大小
          .attr('fill', '#333')
          .text(d => d);
      });
    
    // 获取柱状图颜色
    const barColor = colorValues[0];
    const colorClassSuffix = colorClass[0];
    // 绘制水平柱状图
    const bars = g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', `bar bar-${colorClassSuffix}`)
      .attr('y', d => yScale(d[dateField]))
      .attr('x', 0)
      .attr('height', yScale.bandwidth())
      .attr('width', d => xScale(d[valueField]))
      .attr('fill', '#000');
    
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
      .attr('font-size', displayConfig.dataLabelSize || '12px') // 🆕 使用动态数据标签字体大小
      .text(d => d[valueField]);
    
    
    // 获取轴样式配置
    const axisClassName = chartStyleConfig?.axis?.className || 'axis-title';
    
    // 添加X轴标题
    g.append('text')
      .attr('class', axisClassName)
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 40)
      .attr('text-anchor', 'middle')
      .attr('font-size', displayConfig.axisLabelSize || '14px') // 🆕 使用动态轴标签字体大小
      .text(valueField);
    
    // 添加Y轴标题
    g.append('text')
      .attr('class', axisClassName)
      .attr('transform', `rotate(-90)`)
      .attr('x', -innerHeight / 2)
      .attr('y', -60)
      .attr('text-anchor', 'middle')
      .attr('font-size', displayConfig.axisLabelSize || '14px') // 🆕 使用动态轴标签字体大小
      .text(dateField);
    
    // 将SVG转换为字符串
    return svg.node().outerHTML;
  } catch (error) {
    console.error('生成水平柱状图时发生错误:', error);
    return generateErrorSvg('生成水平柱状图失败: ' + error.message);
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
 * @returns {string} - SVG图表的HTML字符串
 */
function generatePieChart(data, dateField, valueFields, width, height, margin, chartStyleConfig = null, displayConfig = {}) {
  try {
    console.log('生成饼图, 数据点数:', data.length, '值字段:', valueFields);
    
    // 创建JSDOM环境
    const { svg, document } = createJsdomEnv(width, height);
    
    // 解析颜色配置
    const colorBrand6 = resolveColor(COLOR_CONSTANTS.PRIMARY.BRAND6);
    const colorBrand5 = resolveColor(COLOR_CONSTANTS.PRIMARY.BRAND5);
    const colorBrand4 = resolveColor(COLOR_CONSTANTS.PRIMARY.BRAND4);
    const colorBrand3 = resolveColor(COLOR_CONSTANTS.PRIMARY.BRAND3);
    
    // 扩展颜色数组用于多个扇形
    const colorValues = [
      colorBrand5,
      colorBrand4,
      colorBrand3,
      colorBrand6,
      '#76b7b2', 
      '#59a14f', 
      '#edc949', 
      '#af7aa1', 
      '#ff9da7', 
      '#9c755f', 
      '#bab0ab'
    ];
    
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
    
    console.log('饼图数据:', pieData);
    
    // 计算图表区域
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // 🆕 优化饼图半径，减少留白，提高空间利用率
    const baseRadius = Math.min(innerWidth, innerHeight) / 2;
    const radius = displayConfig.isSmallChart ? 
      baseRadius - 10 :  // 小图表：减少留白，图例可能在外部
      baseRadius - 20;   // 普通图表：保留一些空间给标签
    
    // 创建主图表组，居中定位
    const g = svg.append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);
    
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
    
    // 🆕 应用小图表优化 - 标签字体大小
    const labelFontSize = displayConfig.dataLabelSize || '12px';
    
    // 添加标签
    arcs.append('text')
      .attr('transform', d => `translate(${labelArc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('font-size', labelFontSize) // 🆕 使用动态字体大小
      .attr('fill', '#333')
      .attr('font-weight', 'bold')
      .text(d => d.data.label);
    
    // 添加数值标签（显示在扇形内部）
    arcs.append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('font-size', displayConfig.dataLabelSize || '12px') // 🆕 使用动态字体大小
      .attr('fill', '#fff')
      .attr('font-weight', 'bold')
      .attr('stroke', '#000')
      .attr('stroke-width', '0.5px')
      .attr('paint-order', 'stroke')
      .text(d => d.data.originalValue); // 🆕 显示原始值（包含%符号）
    
    // 🆕 添加图例（可选）
    if (pieData.length <= 5) { // 只有在项目不太多时才显示图例
      const legend = g.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${radius + 40}, ${-pieData.length * 10})`);
      
      const legendFontSize = displayConfig.legendLabelSize || '12px';
      
      pieData.forEach((d, i) => {
        const legendItem = legend.append('g')
          .attr('transform', `translate(0, ${i * 20})`);
        
        // 图例色块
        legendItem.append('rect')
          .attr('width', 15)
          .attr('height', 15)
          .attr('fill', colorValues[i % colorValues.length]);
        
        // 图例文字
        legendItem.append('text')
          .attr('x', 20)
          .attr('y', 12)
          .attr('font-size', legendFontSize) // 🆕 使用动态字体大小
          .attr('fill', '#333')
          .text(`${d.label}: ${d.originalValue}`); // 🆕 使用原始值显示
      });
    }
    
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
  generateBarChart,
  generateBarHChart,
  generatePieChart,
  generateErrorSvg
}; 