import { generateUUID } from './util.js';
import {
    getElementStyleConfig,
} from './styleConfig.js';
import { generateChartFromTableData } from './chartGenerator.js';
import { extractWildcardMatch } from './cardCreators.js';
import { parseEventSyntax } from './PSUIPParser.js';

// 解析表格数据为二维数组
function parseTableData(tableContent) {
    // 分割表格内容为行
    const lines = tableContent.trim().split('\n');
    const data = [];

    // 解析每一行
    for (let i = 0; i < lines.length; i++) {
        // 跳过分隔行 (包含 --- 的行)
        if (lines[i].match(/\|[-|\s]+\|/)) {
            continue;
        }

        // 🆕 跳过事件语法行
        if (lines[i].trim().match(/^\[event:/)) {
            continue;
        }

        // 移除行首尾的|，并分割单元格
        const cells = lines[i].trim()
            .replace(/^\||\|$/g, '')  // 移除首尾的|
            .split('|')                // 按|分割
            .map(cell => cell.trim()); // 移除单元格内容的空白

        data.push(cells);
    }

    return data;
}

// 检测是否为表格或图表数据（统一检测）
function isTableOrChartData(line) {
    // 首先检查是否是图表数据标记
    const isChart = line.trim().match(/^\[chart:(.+?)\]/);

    if (isChart) {
        return { isData: true, isChart: true, chartType: isChart[1] };
    }

    // 然后检查是否是普通表格
    if (line.includes('|')) {
        const nextLine = line.trim();
        // 表格至少需要一个分隔符
        const hasSeparator = nextLine.includes('|');

        if (hasSeparator) {
            return { isData: true, isChart: false, chartType: null };
        }
    }

    return { isData: false, isChart: false, chartType: null };
}

// 提取完整的表格或图表数据（统一提取）
function extractTableOrChartData(lines, startIndex) {

    // 获取第一行，检查是否包含图表标记
    const firstLine = lines[startIndex].trim();
    const chartMatch = firstLine.match(/^\[chart:(.+?)\]/);
    const isChart = !!chartMatch;

    let chartType = null;
    let chartTitle = null;

    if (isChart) {
        const fullChartSpec = chartMatch[1];
        // 🆕 解析图表类型和可选标题
        [chartType, chartTitle] = fullChartSpec.includes('|')
            ? fullChartSpec.split('|', 2).map(s => s.trim())
            : [fullChartSpec.trim(), null];

    }

    // 处理第一行 - 如果是图表，移除图表标记和事件语法
    const processedFirstLine = isChart
        ? firstLine.replace(/^\[chart:[^\]]+\]/, '').replace(/\[event:[^\]]+\]/, '').trim()
        : firstLine;

    // 🆕 如果处理后的第一行为空，则跳过它
    const tableLines = processedFirstLine ? [processedFirstLine] : [];
    const remainingLines = lines.slice(startIndex + 1);

    // 继续添加后续表格行，直到遇到空行
    let i = 0;
    while (i < remainingLines.length) {
        const line = remainingLines[i].trim();

        // 如果行为空或不再包含表格分隔符，认为表格结束
        if (line === '' || !line.includes('|')) {
            break;
        }

        tableLines.push(remainingLines[i]);
        i++;
    }

    // 提取原始表格内容（用于显示和调试）
    const originalContent = tableLines.join('\n');

    // 解析表格数据为二维数组（用于图表数据处理）
    const tableData = parseTableData(originalContent);

    return {
        isChart: isChart,
        chartType: chartType,
        chartTitle: chartTitle, // 🆕 添加图表标题
        tableContent: originalContent,
        tableData: tableData,
        endIndex: startIndex + i,
        originalFirstLine: firstLine // 🆕 保存原始的第一行用于事件解析
    };
}

// 创建表格元素
function createTableElement(markdownTableContent) {
    const id = generateUUID();
    const layoutStyleConfig = getElementStyleConfig('layout', 'column');


    const tableContainerStyleConfig = getElementStyleConfig('table', 'container');
    const tableHeaderStyleConfig = getElementStyleConfig('table', 'th');
    const tableRowStyleConfig = getElementStyleConfig('table', 'tr');
    const tableCellStyleConfig = getElementStyleConfig('table', 'td');

    // 确保表格内容不为空
    if (!markdownTableContent.trim()) {
        console.error('警告: 尝试创建表格元素但内容为空');
    }

    // 生成唯一的className
    const uniqueClassName = `table-${id}`;
    const uniqueTrClassName = `tr-${id}`;

    // 创建符合要求的表格元素结构
    const tableElement = {
        id,
        name: "table",
        "name-zh": "表格",
        "file-type": "cell-element",
        type: "table",
        // 🔍 保存元数据用于分析
        _metadata: {
            actualType: 'table',
            variant: 'container',
            isTable: true
        },
        rawData: markdownTableContent,
        layout: {
            // classStyle: {
            //   ...tableContainerStyleConfig
            // },
            // className: uniqueClassName,
            style: {
                // 基础样式
                "background-color": [],
                font: [],
                border: [],
                scale: [],
                "box-sizing": "border-box",
                // primaryAxisSizingMode: "fixed",
                position: "relative",
                width: "100%",
                ...layoutStyleConfig,
            },
            // 表格特定样式
            table: {
                style: {
                    ...tableContainerStyleConfig
                },

                // borderCollapse: "collapse",
                // backgroundColor: "transparent",
                // width: "100%",
                // color: "#212529",
                // fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
                // fontSize: FONT_CONSTANTS.SIZE.MEDIUM,
                // marginBottom: '1rem'
            },
            th: {
                style: {
                    ...tableHeaderStyleConfig
                }

            },
            tr: {
                className: uniqueTrClassName,
                classStyle: {
                    ...tableRowStyleConfig
                }
                // borderBottomWidth: DIMENSION_CONSTANTS.BORDER_WIDTH.narrow,
                // borderBottomColor: COLOR_CONSTANTS.BASIC.OPACITY.BLACK[20],
                // borderBottomStyle: "solid"
            },
            td: {
                style: {
                    ...tableCellStyleConfig
                }
            }
        },
        events: [{}]
    };

    return tableElement;
}

// 创建图表元素
function createChartElement(chartType, svgContent, tableData, rawData, variant = 'normal', chartTitle = null, events = []) {
    const id = generateUUID();
    const layoutStyleConfig = getElementStyleConfig('layout', 'column');

    // 🆕 根据 variant 获取对应的图表样式配置
    const chartContainerStyleConfig = getElementStyleConfig('chart', variant, 'container');
    const chartTitleStyleConfig = getElementStyleConfig('chart', variant, 'title');
    const chartLegendStyleConfig = getElementStyleConfig('chart', variant, 'legend');
    const chartAxisStyleConfig = getElementStyleConfig('chart', variant, 'axis');

    // 生成唯一的className
    const uniqueClassName = `chart-${id}`;
    const uniqueTitleClassName = `chart-title-${id}`;
    const uniqueLegendClassName = `chart-legend-${id}`;
    const uniqueAxisClassName = `chart-axis-${id}`;

    // 创建符合要求的图表元素结构
    const chartElement = {
        id,
        name: "chart",
        "name-zh": "图表",
        "file-type": "cell-element",
        type: "chart",
        chartType: chartType,
        // 🔍 保存元数据用于分析
        _metadata: {
            actualType: 'chart',
            variant: variant || 'normal',  // 🔧 修复：使用正确的 variant 参数
            chartType: chartType || 'line', // 🆕 图表类型（不包含标题）
            title: chartTitle, // 🆕 添加图表标题到元数据
            isChart: true
        },
        svgContent: svgContent,
        tableData: tableData, // 保存解析后的表格数据
        rawData: rawData,     // 保存原始Markdown表格内容
        layout: {
            // 图表容器样式
            classStyle: {
                ...chartContainerStyleConfig
            },
            className: uniqueClassName,
            style: {
                // 基础样式
                backgroundColor: [],
                font: [],
                border: [],
                scale: [],
                boxSizing: "border-box",
                overflow: "hidden",
                // primaryAxisSizingMode: "fixed",
                position: "relative",
                width: "100%",
                height: "auto",
                cursor: "pointer",
                ...layoutStyleConfig
            },
            // 图表子元素样式配置
            chart: {
                style: {
                    ...chartContainerStyleConfig
                }
            },
            title: {
                className: uniqueTitleClassName,
                classStyle: {
                    ...chartTitleStyleConfig
                }
            },
            legend: {
                className: uniqueLegendClassName,
                classStyle: {
                    ...chartLegendStyleConfig
                }
            },
            axis: {
                className: uniqueAxisClassName,
                classStyle: {
                    ...chartAxisStyleConfig
                }
            }
        },
        events: events.length > 0 ? events : [{}]
    };

    return chartElement;
}

// 使用D3生成SVG图表
function generateChartSvg(chartType, data, chartStyleConfig = null, chartTitle = null) {
    try {
        // 使用chartGenerator提供的功能生成SVG，传入样式配置和标题
        return generateChartFromTableData(data, chartType, chartStyleConfig, chartTitle);
    } catch (error) {
        console.error('生成图表SVG时出错:', error);
        // 返回错误信息的SVG
        return `<svg width="800" height="200" xmlns="http://www.w3.org/2000/svg">
        <text x="50" y="50" font-family="sans-serif" font-size="16" fill="red">
          图表生成错误: ${error.message}
        </text>
      </svg>`;
    }
}

// 处理表格数据 - 决定创建普通表格还是图表元素
function processTableOrChartData(result, stack) {
    const { isChart, chartType, chartTitle, tableContent, tableData, endIndex, originalFirstLine } = result;

    if (isChart) {
        // 处理为图表
        try {
            // 🆕 解析图表行中的事件
            const chartEvents = [];
            if (originalFirstLine) {
                // 使用导入的parseEventSyntax函数解析事件
                const chartId = generateUUID();
                const events = parseEventSyntax(originalFirstLine, chartId);
                chartEvents.push(...events);
            }

            // 先创建图表元素（包含样式配置）- 使用默认 variant，传递标题和事件
            const chartElement = createChartElement(chartType, '', tableData, tableContent, 'normal', chartTitle, chartEvents);

            // 提取样式配置
            const chartStyleConfig = {
                variant: 'normal',
                title: chartElement.layout.title,
                legend: chartElement.layout.legend,
                axis: chartElement.layout.axis
            };

            // 生成SVG图表，传入样式配置和标题
            const svgContent = generateChartSvg(chartType, tableData, chartStyleConfig, chartTitle);

            // 更新图表元素的SVG内容
            chartElement.svgContent = svgContent;

            stack[stack.length - 1].elements.push(chartElement);
        } catch (error) {
            console.error('生成图表时出错:', error);
            // 创建一个带有错误信息的图表元素
            const errorSvg = `<svg width="800" height="250" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#fff0f0" />
          <text x="50" y="50" font-family="sans-serif" font-size="18" fill="#d32f2f">
            图表生成错误
          </text>
          <text x="50" y="80" font-family="sans-serif" font-size="14" fill="#666">
            ${error.message || '未知错误'}
          </text>
        </svg>`;
            const chartElement = createChartElement(chartType, errorSvg, tableData, tableContent, 'normal');
            stack[stack.length - 1].elements.push(chartElement);
        }
    } else {
        // 处理为普通表格
        const tableElement = createTableElement(tableContent);
        stack[stack.length - 1].elements.push(tableElement);
    }

    return endIndex;
}

// 从模板配置中获取图表的 variant
function getChartVariantFromConfig(templatePath, cardStyleConfig) {
    const pathParts = templatePath.split('.');
    let chartVariant = 'normal'; // 默认 variant

    // 从配置中获取 variant
    if (pathParts.length >= 2) {
        const parentConfig = cardStyleConfig[pathParts[0]];
        if (parentConfig) {
            // 查找匹配的子配置
            const childTagName = pathParts[pathParts.length - 1];
            for (const [configKey, configValue] of Object.entries(parentConfig)) {
                if (configKey.includes('*')) {
                    const wildcardMatch = extractWildcardMatch(childTagName, configKey);
                    if (wildcardMatch !== null && configValue.variant) {
                        chartVariant = configValue.variant;
                        break;
                    }
                }
            }
        }
    }

    return chartVariant;
}


export {
    createTableElement,
    createChartElement,
    isTableOrChartData,
    extractTableOrChartData,
    processTableOrChartData,
    getChartVariantFromConfig,
    generateChartSvg
}