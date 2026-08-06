import { generateUUID } from '../util.js';
import { getElementStyleConfig } from '../styles';

// 检测是否为知识图谱标签行：[Topology|title=xxxxx]
function isTopologyTag(line) {
    const trimmed = (line || '').trim();
    if (!trimmed) return { isTopologyTag: false };

    const match = trimmed.match(/^\[Topology(?:\|([^\]]*))?\]\s*$/i);
    if (!match) return { isTopologyTag: false };

    const attrs = match[1] || '';
    let title = null;
    const titleMatch = attrs.match(/title\s*=\s*["']?([^"'|]+)["']?/);
    if (titleMatch) title = titleMatch[1].trim();

    return { isTopologyTag: true, title: title || null };
}

// 提取完整的知识图谱块：[Topology|title=...]\n@@@\n{json}\n@@@
function extractGraphBlock(lines, startIndex) {
    const startLine = (lines[startIndex] || '').trim();
    const tagInfo = isTopologyTag(startLine);
    if (!tagInfo.isTopologyTag) return null;

    const jsonLines = [];
    let i = startIndex + 1;
    let inFence = false;
    let foundOpen = false;

    while (i < lines.length) {
        const trimmed = (lines[i] || '').trim();
        if (!inFence) {
            if (trimmed === '@@@') {
                inFence = true;
                foundOpen = true;
                i++;
                continue;
            }
            // 标签行后紧接的不是 @@@，则不构成图谱块
            if (trimmed.length > 0) break;
        } else {
            if (trimmed === '@@@') {
                break;
            }
            jsonLines.push(lines[i]);
        }
        i++;
    }

    if (!foundOpen || !inFence) return null;

    const jsonString = jsonLines.join('\n').trim();
    if (!jsonString) return null;

    let graphData = null;
    const trimmedJson = jsonString.trim();
    // 候选解析串：1) 直接对象格式（向后兼容）；2) 外层 {} 包裹的 JSON 字符串格式
    const candidates = [trimmedJson];
    if (trimmedJson.startsWith('{') && trimmedJson.endsWith('}')) {
        candidates.push(trimmedJson.slice(1, -1).trim());
    }
    for (const candidate of candidates) {
        try {
            const firstParse = JSON.parse(candidate);
            if (typeof firstParse === 'string') {
                // {} 包裹的 JSON 字符串：解析出字符串后再解析一次得到图谱数据
                const secondParse = JSON.parse(firstParse);
                if (secondParse && Array.isArray(secondParse.nodes)) {
                    graphData = secondParse;
                    break;
                }
            } else if (firstParse && Array.isArray(firstParse.nodes)) {
                graphData = firstParse;
                break;
            }
        } catch (error) {
            // 当前候选解析失败，尝试下一种
        }
    }

    if (!graphData) {
        console.error('知识图谱 JSON 解析失败:', trimmedJson.slice(0, 200));
        return null;
    }

    return {
        title: tagInfo.title,
        graphData,
        jsonString: JSON.stringify(graphData), // 归一化为图谱数据 JSON 字符串（浏览器端渲染用）
        endIndex: i // 指向闭合的 @@@ 行
    };
}

// 创建图谱元素
function createGraphElement(graphData, jsonString, title) {
    const id = generateUUID();
    const graphContainerStyleConfig = getElementStyleConfig('graph', 'container');
    const graphAreaStyleConfig = getElementStyleConfig('graph', 'graphArea');
    const uniqueClassName = `graph-${id}`;
    const uniqueTitleClassName = `graph-title-${id}`;
    const uniqueGraphAreaClassName = `graph-area-${id}`;

    // 创建符合要求的图谱元素结构
    const graphElement = {
        id,
        name: "graph",
        "name-zh": "图谱",
        "file-type": "cell-element",
        type: "graph",
        title: title || null,
        // 🔍 保存元数据用于分析
        _metadata: {
            actualType: 'graph',
            isGraph: true,
            title: title || null
        },
        graphData: jsonString,    // 保存图谱数据 JSON 字符串（渲染、分析用）
        jsonString: jsonString,   // 保存原始 JSON 字符串（用于浏览器端渲染）
        layout: {
            // 图谱容器样式（showcaseCard 风格的卡片容器）
            classStyle: {
                ...graphContainerStyleConfig
            },
            className: uniqueClassName,
            style: {
                boxSizing: "border-box",
                overflow: "hidden",
                position: "relative",
                width: "100%",
            },
            // 图谱标题样式
            title: {
                className: uniqueTitleClassName,
                classStyle: {
                    margin: '0',
                    fontSize: "{font.size.xxl}",
                    fontWeight: "{font.fontweight.bold}",
                    color: "{color.basic.grey.9}",
                    lineHeight: 1.4,
                }
            },
            // G6 渲染区域容器样式
            graphArea: {
                className: uniqueGraphAreaClassName,
                classStyle: {
                    ...graphAreaStyleConfig
                },
            },
            children: [],
        },
        events: [{}]
    };

    return graphElement;
}

// 处理图谱数据 - 创建图谱元素并放入元素栈
function processGraphBlock(result, stack) {
    const graphElement = createGraphElement(result.graphData, result.jsonString, result.title);
    stack[stack.length - 1].elements.push(graphElement);
    return result.endIndex;
}

export {
    isTopologyTag,
    extractGraphBlock,
    createGraphElement,
    processGraphBlock,
};
