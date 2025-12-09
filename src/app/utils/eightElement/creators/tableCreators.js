import { generateUUID } from '../util.js';
import {
    getElementStyleConfig,
} from '../styleConfig.js';
import { generateChartFromTableData } from '../chartGenerator.js';
import { extractWildcardMatch } from './cardCreators.js';
import { parseEventSyntax } from '../PSUIPParser.js';
import { createButtonElement } from './buttonCreators.js';
import { createLayoutElement } from './layoutCreators.js';
import { LAYOUT_CONSTANTS } from '../styleConfig.js';
import { EVENT_NAME } from '../eventConfig.js';
import { parseHeaderBackgroundSyntax, parseTableHeaderStyles, removeInlineStyles } from '../styleParser.js';

// 注意：parseHeaderBackgroundSyntax 和相关函数已移至 styleParser.js 作为通用工具

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

        // 🆕 使用通用工具移除样式语法标记
        let cleanLine = removeInlineStyles(lines[i].trim());

        // 移除行首尾的|，并分割单元格
        const cells = cleanLine
            .replace(/^\||\|$/g, '')  // 移除首尾的|
            .split('|')                // 按|分割
            .map(cell => cell.trim()); // 移除单元格内容的空白

        data.push(cells);
    }

    return data;
}

// 🆕 根据排序参数对表格数据进行排序
function sortTableData(tableData, sortOrder) {
    if (!sortOrder || !tableData || tableData.length < 2) {
        return tableData; // 如果没有排序参数或数据不足，返回原始数据
    }
    
    // 获取标题行
    const headers = tableData[0];
    // 获取数据行
    const dataRows = tableData.slice(1);
    
    // 检查是否有第二列（索引为1）
    if (headers.length < 2) {
        return tableData; // 如果列数不足，返回原始数据
    }
    
    // 对数据行按第二列进行排序
    const sortedDataRows = dataRows.sort((a, b) => {
        const valueA = parseFloat(a[1].toString().replace(/[,%]/g, '')) || 0;
        const valueB = parseFloat(b[1].toString().replace(/[,%]/g, '')) || 0;
        
        if (sortOrder.toLowerCase() === 'desc') {
            return valueB - valueA; // 降序
        } else {
            return valueA - valueB; // 升序 (asc 或默认)
        }
    });
    
    // 返回排序后的数据（标题行 + 排序后的数据行）
    return [headers, ...sortedDataRows];
}

// 检测是否为表格或图表数据（统一检测）
function isTableOrChartData(lineOrLines) {
    // 兼容数组或字符串
    const lines = Array.isArray(lineOrLines) ? lineOrLines : [lineOrLines];
    // 过滤出有效的非空字符串行
    const validLines = lines.filter(l => typeof l === 'string' && l.trim().length > 0);

    if (validLines.length === 0) {
        return { isData: false, isChart: false, chartType: null };
    }

    const firstLine = validLines[0].trim();

    // 首先检查是否是图表数据标记
    const chartMatch = firstLine.match(/^\[chart:(.+?)\]/);
    if (chartMatch) {
        // 图表必须至少有一行表格数据（包含 | 且至少两列）
        const hasTableLine = validLines.slice(1).some(l => {
            const trimmed = l.trim();
            if (!trimmed.includes('|')) return false;
            const cols = trimmed.split('|').filter(c => c.trim().length > 0);
            return cols.length >= 2;
        });

        if (!hasTableLine) {
            return { isData: false, isChart: true, chartType: chartMatch[1] };
        }

        return { isData: true, isChart: true, chartType: chartMatch[1] };
    }

    // 检查是否是普通表格：任意一行包含 | 且至少两列
    const hasTable = validLines.some(l => {
        const trimmed = l.trim();
        if (!trimmed.includes('|')) return false;
        const cols = trimmed.split('|').filter(c => c.trim().length > 0);
        return cols.length >= 2;
    });

    if (hasTable) {
        return { isData: true, isChart: false, chartType: null };
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
    let sortOrder = null;

    if (isChart) {
        const fullChartSpec = chartMatch[1];
        // 🆕 解析图表类型、可选标题和可选排序参数
        const parts = fullChartSpec.split('|').map(s => s.trim());
        chartType = parts[0];
        chartTitle = parts[1] || null;
        sortOrder = parts[2] || null; // asc 或 desc
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
    
    // 🆕 使用通用工具清理样式语法标记（仅用于数据解析）
    const cleanedContent = removeInlineStyles(originalContent);

    // 解析表格数据为二维数组（用于图表数据处理，使用清理后的内容）
    const tableData = parseTableData(cleanedContent);

    return {
        isChart: isChart,
        chartType: chartType,
        chartTitle: chartTitle, // 🆕 添加图表标题
        sortOrder: sortOrder, // 🆕 添加排序参数
        tableContent: originalContent, // 🔧 修复：返回原始内容（包含样式语法），让 createTableElement 来解析和清理
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

    // 🆕 使用通用工具解析表头样式
    const { headerStyles, headerAlign, cellAlign, cleanContent } = parseTableHeaderStyles(markdownTableContent);
    const cleanedTableContent = cleanContent;
    
    // 🆕 扩展样式应用：不仅支持 background，还支持其他样式属性
    const headerBackgroundColor = headerStyles.background || null;

    // 确保表格内容不为空
    if (!cleanedTableContent.trim()) {
        console.error('警告: 尝试创建表格元素但内容为空');
    }

    // 生成唯一的className
    const uniqueClassName = `table-${id}`;
    const uniqueTrClassName = `tr-${id}`;

    // 🆕 构建th样式配置，应用所有自定义样式
    let finalThStyleConfig = { ...tableHeaderStyleConfig };
    if (Object.keys(headerStyles).length > 0) {
        // 应用所有解析出的样式，保持 token 格式
        Object.entries(headerStyles).forEach(([key, value]) => {
            // 🔧 不解析 token，保持原始格式，token 解析应该在渲染时进行
            // 将样式属性名转换为对应的配置键
            if (key === 'background') {
                finalThStyleConfig.backgroundColor = value;
            } else {
                // 其他样式属性直接应用
                finalThStyleConfig[key] = value;
            }
        });
        console.log('🎨 应用表头自定义样式 (保持 token 格式):', headerStyles);
    }
    
    // 🆕 应用表头对齐设置
    if (headerAlign) {
        finalThStyleConfig.textAlign = headerAlign;
        console.log('🎨 应用表头对齐:', headerAlign);
    }
    
    // 🆕 构建td样式配置，应用单元格对齐设置
    let finalTdStyleConfig = { ...tableCellStyleConfig };
    if (cellAlign) {
        finalTdStyleConfig.textAlign = cellAlign;
        console.log('🎨 应用单元格对齐:', cellAlign);
    }

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
        rawData: cleanedTableContent, // 🆕 使用清理后的内容
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
                style: finalThStyleConfig
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
                style: finalTdStyleConfig
            }
        },
        events: [{}]
    };

    return tableElement;
}

// 🆕 为图表添加事件按钮（如果需要）
function addChartEventButton(chartElement, originalFirstLine) {
    if (!originalFirstLine) return;

    // 检测是否有 style:button 标记
    const hasStyleButton = /\[event:[^\]]*style\s*:\s*button/i.test(originalFirstLine);
    
    console.log('🔍 检查 style:button:', {
        originalFirstLine,
        hasStyleButton,
        chartId: chartElement.id
    });

    if (!hasStyleButton) return;

    console.log('✅ 检测到 style:button，开始创建按钮');
    
    // 从样式配置读取按钮文本与变体
    const buttonStyleFromConfig = getElementStyleConfig('chart', 'event');
    const buttonConfig = buttonStyleFromConfig && buttonStyleFromConfig.button;
    const buttonText = (buttonConfig && buttonConfig.text) ? buttonConfig.text : '操作';
    const buttonVariant = (buttonConfig && buttonConfig.variant) ? buttonConfig.variant : 'primary';

    console.log('📝 按钮配置:', {
        buttonStyleFromConfig,
        buttonConfig,
        buttonText,
        buttonVariant
    });

    // 用整行解析事件，绑定目标为图表 id
    const parsedButtonEvents = parseEventSyntax(originalFirstLine, chartElement.id, originalFirstLine) || [];
    
    console.log('🎯 解析的按钮事件:', parsedButtonEvents);
    
    // 构造按钮：不传递 currentMarkdown，避免在 createButtonElement 内部重复解析事件
    const buttonElement = createButtonElement(buttonText, '#', buttonVariant, '', buttonText);
    
    console.log('🔧 创建的按钮元素:', buttonElement);
    
    // 覆盖按钮的事件为从图表行解析的事件（若无解析结果则回退构造 chart_changed 事件）
    let finalEvents = parsedButtonEvents;

    // 确保存在 chart_changed 事件；如果没有从行中解析到，则从图表元素事件中复制/构造
    const chartChangedFromChart = (chartElement.events || []).find(ev => ev && ev.runtimeEventKey === EVENT_NAME.CHART_CHANGED);
    const hasParsedChartChanged = finalEvents.some(ev => ev && ev.runtimeEventKey === EVENT_NAME.CHART_CHANGED);

    if (!hasParsedChartChanged) {
        // 优先从图表事件复制
        let chartTypes = (chartChangedFromChart && chartChangedFromChart.parameters && chartChangedFromChart.parameters.chartTypes) || null;

        // 如果图表上也未携带，则直接从原始行中正则抽取 [event:chart_changed(a,b,c)]
        if (!chartTypes) {
            const m = originalFirstLine && originalFirstLine.match(/\[event:\s*chart_changed\(([^)]*)\)/i);
            if (m && m[1]) {
                chartTypes = m[1].split(',').map(s => s.trim()).filter(Boolean);
            }
        }

        if (!chartTypes) chartTypes = [];

        finalEvents = [
            {
                runtimeEventKey: EVENT_NAME.CHART_CHANGED,
                nativeEventKey: 'click',
                dataEventKey: [],
                parameters: { chartTypes },
                EventTargetId: chartElement.id
            }
        ];
    }

    // 兜底：若仍然为空，创建空事件占位避免渲染器漏绑
    if (!finalEvents || finalEvents.length === 0) {
        finalEvents = [{ runtimeEventKey: EVENT_NAME.CHART_CHANGED, nativeEventKey: 'click', dataEventKey: [], parameters: { chartTypes: [] }, EventTargetId: chartElement.id }];
    }

    // 统一确保 EventTargetId 指向图表 id
    finalEvents.forEach(ev => { ev.EventTargetId = chartElement.id; });

    buttonElement.events = finalEvents;

    // 应用按钮的样式配置（position: absolute 等）
    if (buttonConfig && buttonConfig.style) {
        Object.assign(buttonElement.layout.style, buttonConfig.style);
        console.log('🎨 应用按钮样式:', buttonConfig.style);
    }

    // 返回按钮元素，由调用方决定放置位置
    return buttonElement;
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
            // 子元素数组，用于存放按钮和 SVG
            children: [],
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
    const { isChart, chartType, chartTitle, sortOrder, tableContent, tableData, endIndex, originalFirstLine } = result;

    if (isChart) {
        // 处理为图表
        try {
            // 🆕 根据排序参数对表格数据进行排序
            const sortedTableData = sortTableData(tableData, sortOrder);
            
            // 先创建基础图表元素（无事件），以便拿到图表 id 作为事件载体
            const tempChartElement = createChartElement(chartType, '', sortedTableData, tableContent, 'normal', chartTitle, []);

            // 解析图表行中的事件，EventTargetId 设为图表 id
            const chartEvents = [];
            if (originalFirstLine) {
                const events = parseEventSyntax(originalFirstLine, tempChartElement.id);
                chartEvents.push(...events);
            }

            // 重新创建最终图表元素，带事件
            const chartElement = createChartElement(chartType, '', sortedTableData, tableContent, 'normal', chartTitle, chartEvents);

            // 🆕 生成按钮元素（如果需要）
            const buttonElement = addChartEventButton(chartElement, originalFirstLine);

            // 🆕 用一个父级 layout 容器包裹按钮与图表，使其成为同级子元素
            const wrapperLayout = createLayoutElement(LAYOUT_CONSTANTS.DIRECTION.VERTICAL, [], {
                variant: 'column',
                // 确保相对定位，按钮绝对定位可生效
                style: { position: 'relative' }
            });

            // 将按钮（若存在）与图表作为 children 加入
            if (buttonElement) {
                wrapperLayout.layout.children.push(buttonElement);
            }
            wrapperLayout.layout.children.push(chartElement);

            // 提取样式配置
            const chartStyleConfig = {
                variant: 'normal',
                title: chartElement.layout.title,
                legend: chartElement.layout.legend,
                axis: chartElement.layout.axis
            };

            // 生成SVG图表，传入样式配置和标题，使用排序后的数据
            const svgContent = generateChartSvg(chartType, sortedTableData, chartStyleConfig, chartTitle);

            // 更新图表元素的SVG内容
            chartElement.svgContent = svgContent;

            // 将 SVG 作为子元素添加到图表容器中
            const svgElement = {
                id: generateUUID(),
                name: "svg",
                "name-zh": "SVG图表",
                "file-type": "cell-element",
                type: "svg",
                _metadata: {
                    actualType: 'svg',
                    isChartSvg: true
                },
                layout: {
                    style: {
                        width: "100%",
                        height: "auto",
                        display: "block"
                    }
                },
                svgContent: svgContent
            };
            chartElement.layout.children.push(svgElement);

            // 🆕 将 wrapperLayout 放入元素栈
            stack[stack.length - 1].elements.push(wrapperLayout);
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
    addChartEventButton,
    isTableOrChartData,
    extractTableOrChartData,
    processTableOrChartData,
    getChartVariantFromConfig,
    generateChartSvg,
    sortTableData,
    parseHeaderBackgroundSyntax
}