import { parseMarkdown } from '../PSUIPParser.js';
import { generateUUID } from '../util.js';
import { LAYOUT_CONSTANTS } from '../styles';

// 通用属性解析函数：key="value" | key='value' | key={value}
function parseAttributes(attributesStr) {
    const attributes = {};
    if (!attributesStr) return attributes;

    const attrRegex = /(\w+)=(["']([^"']*?)["']|\{([^}]*?)\})/g;
    let attrMatch;
    while ((attrMatch = attrRegex.exec(attributesStr)) !== null) {
        const attrName = attrMatch[1];
        const attrValue = attrMatch[3] !== undefined ? attrMatch[3] : attrMatch[4];
        attributes[attrName] = attrValue;
    }
    return attributes;
}

// 检测是否为 grid:item 标签
function isGridItemTag(line) {
    const trimmed = line.trim();

    // 🆕 单行形式：<grid:item x="1" y="1" width="2" height="2">text</grid:item>
    // isSingleLine=true 表示自闭合于同一行，嵌套计数时必须跳过（不改变嵌套深度）
    const singleLineMatch = trimmed.match(/^<grid:item([^>]*)>([\s\S]*?)<\/grid:item>$/);
    if (singleLineMatch) {
        return {
            isGridItemTag: true,
            attributes: parseAttributes(singleLineMatch[1].trim()),
            isClosing: false,
            isSingleLine: true
        };
    }

    // 开始标签: <grid:item x="1" y="1" width="2" height="2">
    const openingMatch = trimmed.match(/^<grid:item([^>]*)>$/);
    if (openingMatch) {
        return {
            isGridItemTag: true,
            attributes: parseAttributes(openingMatch[1].trim()),
            isClosing: false
        };
    }

    // 结束标签: </grid:item>
    if (trimmed === '</grid:item>') {
        return {
            isGridItemTag: true,
            attributes: {},
            isClosing: true
        };
    }

    return { isGridItemTag: false };
}

// 提取完整的 grid:item 块内容（支持单行形式与嵌套）
function extractGridItemBlock(lines, startIndex) {
    const startLine = lines[startIndex];

    // 🆕 单行形式：<grid:item ...>text</grid:item>
    const singleLineMatch = startLine.trim().match(/^<grid:item([^>]*)>([\s\S]*?)<\/grid:item>$/);
    if (singleLineMatch) {
        return {
            gridItemContent: singleLineMatch[2].trim(),
            attributes: parseAttributes(singleLineMatch[1].trim()),
            endIndex: startIndex
        };
    }

    const startTagInfo = isGridItemTag(startLine);
    if (!startTagInfo.isGridItemTag || startTagInfo.isClosing) {
        return { gridItemContent: '', attributes: {}, endIndex: startIndex };
    }

    const attributes = startTagInfo.attributes || {};
    const contentLines = [];
    let i = startIndex + 1;
    let foundEnd = false;
    let nestingLevel = 1; // 跟踪嵌套深度，从当前标签开始

    while (i < lines.length && nestingLevel > 0) {
        const line = lines[i];
        const tagInfo = isGridItemTag(line);

        // 🆕 单行 grid:item（<grid:item>text</grid:item>）自闭合，不参与嵌套计数
        if (tagInfo.isSingleLine) {
            contentLines.push(line);
            i++;
            continue;
        }

        if (tagInfo.isGridItemTag) {
            if (tagInfo.isClosing) {
                nestingLevel--;
                if (nestingLevel === 0) {
                    foundEnd = true;
                    i++;
                    break;
                }
            } else {
                nestingLevel++;
            }
        }

        contentLines.push(line);
        i++;
    }

    if (!foundEnd) {
        console.warn('⚠️  警告: 未找到 grid:item 的结束标签，可能存在标签不匹配');
    }

    return {
        gridItemContent: contentLines.join('\n').trim(),
        attributes,
        endIndex: i - 1
    };
}

// 创建 grid:item 网格子项元素
// 定位语义：x/y 为起始格（1 起始），width/height 为占用的格子数
function createGridItemElement(content, attributes = {}, currentMarkdown = '') {
    const id = generateUUID();

    // 解析定位信息（缺省时走 CSS 自动占位，width/height 缺省为 1）
    const x = attributes.x !== undefined ? parseInt(attributes.x, 10) : null;
    const y = attributes.y !== undefined ? parseInt(attributes.y, 10) : null;
    const width = attributes.width !== undefined ? parseInt(attributes.width, 10) : 1;
    const height = attributes.height !== undefined ? parseInt(attributes.height, 10) : 1;

    const hasXY = x !== null && y !== null;

    // 🆕 是否撑满（fill）：未指定时继承 <layout:grid> 容器的默认值
    const fill = attributes.fill !== undefined ? attributes.fill : undefined;

    // 生成 grid 定位样式（gridColumn/gridRow 由渲染端转成 grid-column/grid-row）
    // overflow:auto —— 单元格内内容超出（宽或高）时滚动，避免溢出撑破网格
    const classStyle = { minWidth: '0', overflow: 'auto' };
    if (hasXY) {
        classStyle.gridColumn = `${x} / span ${width}`;
        classStyle.gridRow = `${y} / span ${height}`;
    } else {
        // 自动占位：只声明跨距，起始位置交给 CSS auto-flow 按顺序填充
        if (width > 1) classStyle.gridColumn = `span ${width}`;
        if (height > 1) classStyle.gridRow = `span ${height}`;
    }

    // 递归解析子内容（任意内容：Markdown / 卡片 / 组件 / 嵌套布局 / 嵌套 grid）
    let children = [];
    if (content && content.trim()) {
        children = parseMarkdown(content, { currentMarkdown });
    }

    const uniqueClassName = `grid-item-${id}`;

    const gridItemElement = {
        dataKeys: [],
        name: "layout",
        "name-zh": "网格子项",
        "file-type": "template",
        theme: "default",
        _metadata: {
            actualType: 'gridItem',
            variant: 'gridItem',
            isGridItem: true,
            isLayout: true,
            gridPlacement: { x, y, width, height, hasXY },
            fill: fill,
        },
        layout: {
            style: {
                display: LAYOUT_CONSTANTS.DISPLAY.FLEX,
                layoutMode: LAYOUT_CONSTANTS.DIRECTION.VERTICAL,
                layoutWrap: LAYOUT_CONSTANTS.WRAP.NO_WRAP,
                boxSizing: "border-box",
                height: "auto",
                width: "100%",
                position: "relative",
            },
            classStyle,
            className: uniqueClassName,
            children
        },
        description: "网格子项",
        id,
        events: [{}]
    };

    return gridItemElement;
}

export {
    isGridItemTag,
    extractGridItemBlock,
    createGridItemElement
}
