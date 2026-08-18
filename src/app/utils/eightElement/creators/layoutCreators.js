import {
    LAYOUT_CONSTANTS,
    GRID_CONSTANTS,
    getElementStyleConfig
} from '../styles';
import { generateUUID } from '../util.js';
import { createTextElement } from './textCreators.js';
import { EVENT_NAME, EVENT_CONFIG } from '../eventConfig.js';
import { createNativeEventConfig } from '../eventUtils.js';

// 检测是否为布局标签（支持属性）
function isLayoutTag(line) {
    const trimmed = line.trim();

    // 通用属性解析函数
    const parseAttributes = (attributesStr) => {
        const attributes = {};
        if (!attributesStr) return attributes;

        // 匹配多种格式的属性：key="value", key='value', key={value}
        const attrRegex = /(\w+)=(["']([^"']*?)["']|\{([^}]*?)\})/g;
        let attrMatch;
        while ((attrMatch = attrRegex.exec(attributesStr)) !== null) {
            const attrName = attrMatch[1];
            // attrMatch[3] 是引号格式的值，attrMatch[4] 是大括号格式的值
            const attrValue = attrMatch[3] !== undefined ? attrMatch[3] : attrMatch[4];
            attributes[attrName] = attrValue;
        }
        return attributes;
    };

    // 🆕 支持单行形式：<layout ...></layout>
    const simpleSelfClosingMatch = trimmed.match(/^<layout([^>]*)>\s*<\/layout>$/);
    if (simpleSelfClosingMatch) {
        const attributesStr = simpleSelfClosingMatch[1].trim();
        const attributes = parseAttributes(attributesStr);

        return {
            isLayoutTag: true,
            variant: 'column',
            attributes,
            isClosing: false
        };
    }

    // 🆕 支持单行形式：<layout:variant ...></layout:variant>
    const variantSelfClosingMatch = trimmed.match(/^<layout:([\w-]+)([^>]*)>\s*<\/layout:\1>$/);
    if (variantSelfClosingMatch) {
        const variant = variantSelfClosingMatch[1];
        const attributesStr = variantSelfClosingMatch[2].trim();
        const attributes = parseAttributes(attributesStr);

        return {
            isLayoutTag: true,
            variant,
            attributes,
            isClosing: false
        };
    }

    // 匹配带属性的开始标签: <layout:variant attr1="value1" attr2="value2">
    // 🔧 修复：使用 [\w-]+ 来支持包含连字符的变体名（如 row-center）
    const layoutTagWithAttrsMatch = trimmed.match(/^<layout:([\w-]+)([^>]*)>$/);
    if (layoutTagWithAttrsMatch) {
        const variant = layoutTagWithAttrsMatch[1];
        const attributesStr = layoutTagWithAttrsMatch[2].trim();
        const attributes = parseAttributes(attributesStr);

        return {
            isLayoutTag: true,
            variant: variant,
            attributes: attributes,
            isClosing: false
        };
    }

    // 🆕 支持简写形式: <layout attr1="..." attr2="...">
    const simpleLayoutWithAttrsMatch = trimmed.match(/^<layout([^>]*)>$/);
    if (simpleLayoutWithAttrsMatch) {
        const attributesStr = simpleLayoutWithAttrsMatch[1].trim();
        const attributes = parseAttributes(attributesStr);

        // 简写形式默认使用 column 变体
        return {
            isLayoutTag: true,
            variant: 'column',
            attributes: attributes,
            isClosing: false
        };
    }

    // 匹配简单的开始标签: <layout:variant>
    // 🔧 修复：使用 [\w-]+ 来支持包含连字符的变体名
    const layoutTagMatch = trimmed.match(/^<layout:([\w-]+)>$/);
    if (layoutTagMatch) {
        return {
            isLayoutTag: true,
            variant: layoutTagMatch[1],
            attributes: {},
            isClosing: false
        };
    }

    // 🔧 修复：使用 [\w-]+ 来支持包含连字符的变体名
    const closingTagMatch = trimmed.match(/^<\/layout:([\w-]+)>$/);
    if (closingTagMatch) {
        return {
            isLayoutTag: true,
            variant: closingTagMatch[1],
            attributes: {},
            isClosing: true
        };
    }

    // 🆕 支持简写形式的结束标签: </layout>
    const simpleClosingTagMatch = trimmed.match(/^<\/layout>$/);
    if (simpleClosingTagMatch) {
        return {
            isLayoutTag: true,
            variant: 'column',
            attributes: {},
            isClosing: true
        };
    }

    return { isLayoutTag: false };
}


// 创建流式布局容器，用于包装一级标题块
function createFlexWrapLayout(children = []) {
    const layoutId = generateUUID();

    // 创建一个水平流式布局，使用CSS的flex-wrap属性
    const layout = {
        dataKeys: [],
        name: "layout",
        "name-zh": "流式布局",
        "file-type": "template",
        theme: "default",
        layout: {
            style: {
                display: LAYOUT_CONSTANTS.DISPLAY.FLEX,
                layoutMode: LAYOUT_CONSTANTS.DIRECTION.HORIZONTAL,
                // 使用CSS的flex-wrap属性
                flexWrap: "wrap",
                alignSelf: "flex-start",
                // layoutGrow: LAYOUT_CONSTANTS.GROW.ZERO,
                boxSizing: "border-box",
                // borderStyle: "solid",
                // borderWidth: "0",
                // borderColor: "initial",
                height: "auto",
                width: "100%",
                boxSizing: "border-box",
                // "back-width": "100%",
                // "back-height": "auto",
                position: "relative"
            },
            children: children
        },
        description: "",
        id: layoutId,
        events: [{}]
    };

    return layout;
}


// 更新基础布局元素创建函数，支持自定义高宽
function createBaseLayout(direction = LAYOUT_CONSTANTS.DIRECTION.VERTICAL, options = {}) {
    const { width = "100%", height = "auto", alignItems = LAYOUT_CONSTANTS.ALIGN.X.MIN } = options;

    return {
        style: {
            // display: LAYOUT_CONSTANTS.DISPLAY.FLEX,
            layoutMode: direction,
            layoutWrap: LAYOUT_CONSTANTS.WRAP.NO_WRAP,
            // primaryAxisSizingMode: "fixed",
            // layoutAlign: LAYOUT_CONSTANTS.ALIGN.Y.SELF.INHERIT,
            // layoutGrow: LAYOUT_CONSTANTS.GROW.ZERO,
            boxSizing: "border-box",
            // borderStyle: "solid",
            // borderWidth: "0",
            // borderColor: "initial",
            height: height,
            width: width,
            boxSizing: "border-box",
            position: "relative"
        },
        children: []
    };
}

// 🆕 创建元素容器（用于包装具有样式的元素）
function createElementContainer(tagName, content, cardStyleConfig, elementInstance, markdownData = null) {
    const id = generateUUID();
    const uniqueClassName = `template-${tagName}-${id}`;
    const tagConfig = cardStyleConfig[tagName] || {};

    // 创建容器来包装元件实例
    const containerElement = {
        dataKeys: [],
        name: "layout",
        "name-zh": `模板标签容器-${tagName}`,
        "file-type": "template",
        theme: "default",
        _metadata: {
            actualType: 'templateTag',
            tagName: tagName,
            isTemplateTag: true,
            isLayout: true,
            isElementContainer: true,
            containedElementType: markdownData ? markdownData.type : (tagConfig.metaType || 'unknown'),
            containedElementVariant: markdownData ? (markdownData.variant || 'default') : (tagConfig.variant || 'default'),
            tagContent: content
        },
        layout: {
            style: {
                display: LAYOUT_CONSTANTS.DISPLAY.FLEX,
                layoutMode: LAYOUT_CONSTANTS.DIRECTION.VERTICAL,
                layoutWrap: LAYOUT_CONSTANTS.WRAP.NO_WRAP,
                // primaryAxisSizingMode: "fixed",
                // layoutGrow: LAYOUT_CONSTANTS.GROW.ZERO,
                boxSizing: "border-box",
                // borderStyle: "solid",
                // borderWidth: "0",
                // borderColor: "initial",
                height: "auto",
                width: tagConfig.metaType === "button" ? "auto" : "100%",
                boxSizing: "border-box",
                position: "relative",
                // ...(tagConfig.style || {}) // 应用标签样式
            },
            classStyle: {
                ...(tagConfig.style || {})
            },
            className: uniqueClassName,
            children: [elementInstance] // 包装元件实例
        },
        description: `模板标签容器 - ${tagName}`,
        id,
        events: [{}]
    };

    return containerElement;
}

// 🆕 校验 grid 容器子项的定位：越界（超过列/行数）与重叠
function validateGridPlacements(children, attributes) {
    if (!children || !Array.isArray(children) || children.length === 0) return;

    const columnCount = parseInt(attributes.columns ?? attributes.cols, 10);
    const rowCount = parseInt(attributes.rows, 10);

    const placed = [];
    children.forEach((child, index) => {
        const placement = child?._metadata?.gridPlacement;
        if (!placement || !placement.hasXY) return; // 自动占位无需校验

        const { x, y, width, height } = placement;
        if (columnCount && x + width - 1 > columnCount) {
            console.warn(`⚠️ grid 子项 #${index + 1} 越界：x=${x} width=${width} 超出列数 ${columnCount}`);
        }
        if (rowCount && y + height - 1 > rowCount) {
            console.warn(`⚠️ grid 子项 #${index + 1} 越界：y=${y} height=${height} 超出行数 ${rowCount}`);
        }

        const range = { x, y, x2: x + width - 1, y2: y + height - 1 };
        placed.forEach((prev, j) => {
            const overlap = !(range.x2 < prev.x || prev.x2 < range.x || range.y2 < prev.y || prev.y2 < range.y);
            if (overlap) {
                console.warn(`⚠️ grid 子项 #${index + 1} 与 #${j + 1} 重叠`);
            }
        });
        placed.push(range);
    });
}

// 🆕 让 grid:item 内容填满所在格（fill=true，默认）：子内容沿主轴拉伸占满上下空间，左右由 grid 容器 stretch 撑满
// fill=false（/none/0/no）时保持内容自然尺寸
function applyGridItemFill(gridItemElement, fill) {
    if (!gridItemElement || !gridItemElement.layout) return;
    const isFill = !(fill === 'false' || fill === 'none' || fill === '0' || fill === 'no');
    if (!isFill) return;

    // 子项容器占满整格高度（父级 grid alignItems:stretch 已保证宽度撑满）
    gridItemElement.layout.style = gridItemElement.layout.style || {};
    gridItemElement.layout.style.height = '100%';

    // 直接子内容沿主轴拉伸，填满剩余高度
    // minHeight:0 允许子内容（卡片）在格子内压缩——格子高度随容器余数摊平浮动（i+δ），
    // 卡片必须能跟随格子伸缩，由卡片内部 flex 弹性分配内容，而不是靠固定像素匹配
    (gridItemElement.layout.children || []).forEach(child => {
        if (child && child.layout && child.layout.style) {
            child.layout.style.flexGrow = 1;
            child.layout.style.minHeight = '0';
        }
    });
}

// 创建布局元素，支持自定义选项
function createLayoutElement(direction, children = [], options = {}) {
    const { width, height, gap, variant = 'column', isRoot = false,
        alignItems = LAYOUT_CONSTANTS.ALIGN.X.MIN, attributes = {} } = options;

    // 使用随机UUID生成ID
    const layoutId = generateUUID();

    // 🆕 处理绑定数据和事件相关属性（仅针对布局，目前支持 bindingData + dataListener）
    const bindingDataKey = attributes.bindingData || null;
    const eventType = attributes.event || null;
    const actionType = attributes.action || 'append';
    const statusKey = attributes.status || '';

    // 根据方向自动计算交叉轴对齐方式
    // 对于水平布局，默认交叉轴居中对齐；对于垂直布局，使用传入的选项或默认左对齐
    const counterAxisAlign = options.counterAxisAlign ||
        (direction === LAYOUT_CONSTANTS.DIRECTION.HORIZONTAL ?
            LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.CENTER :
            LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.MIN);

    // 🆕 获取布局元素的样式配置，传入属性
    const layoutStyleConfig = getElementStyleConfig('layout', isRoot ? 'root' : variant, attributes);

    // 🆕 grid 网格布局：把 columns/cols/rows 展开成 grid-template，并清理原始键（避免泄漏为 CSS 的 columns 简写）
    // 通用策略（i/j 为固定单位，永不随容器变化）：
    // - grid 必须显式指定 width/height：m=⌊(width+GAP)/(i+GAP)⌋、n=⌊(height+GAP)/(j+GAP)⌋ 由 grid 自身尺寸推导，
    //   容器尺寸不确定也无关，grid 是自带尺寸的块；容器不是整数倍时，余数摊平到格子上（格子 = i+δ）
    // - 未声明 width/height 时，退回 CSS auto-fill + minmax(i|j, 1fr) 按实际容器推导
    // - 显式 columns/rows/gridTemplateColumns/gridTemplateRows 始终优先
    if (variant === 'grid') {
        const gridColumns = attributes.columns ?? attributes.cols;
        const gridRows = attributes.rows;
        const gridGapNum = parseFloat(attributes.gap) || GRID_CONSTANTS.GAP;
        const gridWidth = attributes.width ? parseInt(attributes.width, 10) : null;
        const gridHeight = attributes.height ? parseInt(attributes.height, 10) : null;
        const deriveGridCount = (size, unit) => (size != null && !isNaN(size) && size > 0)
            ? Math.floor((size + gridGapNum) / (unit + gridGapNum))
            : null;

        if (gridColumns) {
            layoutStyleConfig.gridTemplateColumns = `repeat(${gridColumns}, minmax(0, 1fr))`;
        } else if (attributes.gridTemplateColumns) {
            layoutStyleConfig.gridTemplateColumns = attributes.gridTemplateColumns;
        } else {
            const derivedM = deriveGridCount(gridWidth, GRID_CONSTANTS.CELL_WIDTH);
            layoutStyleConfig.gridTemplateColumns = derivedM && derivedM > 0
                ? `repeat(${derivedM}, minmax(0, 1fr))`
                : `repeat(auto-fill, minmax(${GRID_CONSTANTS.CELL_WIDTH}px, 1fr))`;
        }
        if (gridRows) {
            layoutStyleConfig.gridTemplateRows = `repeat(${gridRows}, auto)`;
        } else if (attributes.gridTemplateRows) {
            layoutStyleConfig.gridTemplateRows = attributes.gridTemplateRows;
        } else {
            const derivedN = deriveGridCount(gridHeight, GRID_CONSTANTS.CELL_HEIGHT);
            layoutStyleConfig.gridTemplateRows = derivedN && derivedN > 0
                ? `repeat(${derivedN}, minmax(0, 1fr))`
                : `repeat(auto-fill, minmax(${GRID_CONSTANTS.CELL_HEIGHT}px, 1fr))`;
        }

        delete layoutStyleConfig.columns;
        delete layoutStyleConfig.cols;
        delete layoutStyleConfig.rows;

        // 🆕 网格间距缺省值：与 i/j 推导配套（auto-fill 计数时自动扣减 gap，不影响推导公式）
        if (layoutStyleConfig.gap === undefined && options.gap === undefined) {
            layoutStyleConfig.gap = `${GRID_CONSTANTS.GAP}px`;
        }

        // 🆕 fill 撑满：容器设置默认值（默认 true），子项可单独覆盖；清理原始键避免泄漏为 CSS
        const gridFill = attributes.fill !== undefined ? attributes.fill : 'true';
        delete layoutStyleConfig.fill;

        // 校验子项定位（越界 / 重叠）
        validateGridPlacements(children, attributes);

        // 🆕 将 fill 应用到每个 grid:item（子项未显式指定时继承容器默认值）
        children.forEach(child => {
            if (child && child._metadata && child._metadata.isGridItem) {
                const itemFill = child._metadata.fill !== undefined ? child._metadata.fill : gridFill;
                applyGridItemFill(child, itemFill);
            }
        });
    }

    // 🆕 数值型 gap/columnGap/rowGap 补 px（gap 需要合法长度单位，避免输出无效的 gap: 16）
    ['gap', 'columnGap', 'rowGap'].forEach((key) => {
        const v = layoutStyleConfig[key];
        if (typeof v === 'string' && /^\d+(\.\d+)?$/.test(v)) {
            layoutStyleConfig[key] = `${v}px`;
        }
    });

    // 创建基础布局
    const baseLayout = createBaseLayout(direction, { width, height, alignItems });

    // 应用来自配置的样式，但保留传入的对齐设置
    Object.entries(layoutStyleConfig).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            // 🔧 重要：保留传入的对齐设置，不覆盖 justifyContent 和 alignItems
            if ((key === 'justifyContent' || key === 'alignItems') && options[key] !== undefined) {
                // 如果传入的选项中明确设置了这些属性，则跳过默认配置
                return;
            }
            baseLayout.style[key] = value;
        }
    });

    // 如果提供了间距，覆盖配置
    if (gap) {
        baseLayout.style.gap = gap;
    }

    // 🆕 数值型 gap/columnGap/rowGap 补 px（gap 需要合法长度单位，避免输出无效的 gap: 16）
    ['gap', 'columnGap', 'rowGap'].forEach((key) => {
        const v = baseLayout.style[key];
        if (typeof v === 'string' && /^\d+(\.\d+)?$/.test(v)) {
            baseLayout.style[key] = `${v}px`;
        }
    });

    // 🔧 重要：确保传入的 justifyContent 和 alignItems 被正确设置
    if (options.justifyContent !== undefined) {
        baseLayout.style.justifyContent = options.justifyContent;
    }
    if (options.alignItems !== undefined) {
        baseLayout.style.alignItems = options.alignItems;
    }

    // 生成唯一的className
    const uniqueClassName = `layout-${layoutId}`;

    const layout = {
        dataKeys: [],
        name: "layout",
        "name-zh": "布局",
        "file-type": "template",
        theme: "default",
        // 🔍 保存元数据用于分析
        _metadata: {
            actualType: 'layout',
            variant: isRoot ? 'root' : variant,
            isLayout: true,
            isRoot: isRoot,
            // 🆕 保存应用的属性信息
            appliedAttributes: attributes,
            // 🆕 绑定的数据键（用于 dataVariables 和 dataListener）
            bindingData: bindingDataKey || undefined,
            dataAction: actionType,
            statusKey: statusKey,
        },
        layout: {
            ...baseLayout,
            classStyle: {
                ...layoutStyleConfig
            },
            className: uniqueClassName
        },
        description: "",
        id: layoutId,
        events: [{}]
    };

    // 🆕 如果配置了 dataListener 事件，为该布局元素创建 DATA_LISTENER 事件
    if (bindingDataKey && eventType && (eventType === EVENT_NAME.DATA_LISTENER || eventType === 'dataListener')) {
        const baseConfig = EVENT_CONFIG?.[EVENT_NAME.DATA_LISTENER];
        if (baseConfig) {
            const dataListenerEvent = JSON.parse(JSON.stringify(baseConfig));
            dataListenerEvent.EventTargetId = layoutId;

            if (!dataListenerEvent.parameters) {
                dataListenerEvent.parameters = {};
            }

            dataListenerEvent.parameters.eleId = layoutId;
            dataListenerEvent.parameters.dataKey = bindingDataKey;
            dataListenerEvent.parameters.action = actionType || 'append';
            dataListenerEvent.parameters.statusKey = statusKey || '';

            layout.events = [dataListenerEvent];
        }
    }

    // 🆕 处理 nativeEvent 和 data 属性
    if (attributes.nativeEvent) {
        const nativeEventConfig = createNativeEventConfig(attributes.nativeEvent, attributes.data);
        if (nativeEventConfig) {
            // 如果 events 第一个元素是空对象，则替换它，否则追加
            if (layout.events.length === 1 && Object.keys(layout.events[0]).length === 0) {
                layout.events[0] = nativeEventConfig;
            } else {
                layout.events.push(nativeEventConfig);
            }
        }
    }

    // 添加子元素
    layout.layout.children = children;

    return layout;
}

// 提取完整的布局标签块
function extractLayoutBlock(lines, startIndex) {
    const startLine = lines[startIndex];
    const trimmed = startLine.trim();

    // 🆕 支持单行形式的 layout：<layout ...></layout> 或 <layout:row ...></layout:row>
    // 1) 简写形式：<layout attr...></layout>
    let selfClosingMatch = trimmed.match(/^<layout([^>]*)>\s*<\/layout>$/);
    if (selfClosingMatch) {
        const attributesStr = selfClosingMatch[1].trim();
        const attributes = {};
        if (attributesStr) {
            const attrRegex = /(\w+)=(["']([^"']*?)["']|\{([^}]*?)\})/g;
            let attrMatch;
            while ((attrMatch = attrRegex.exec(attributesStr)) !== null) {
                const attrName = attrMatch[1];
                const attrValue = attrMatch[3] !== undefined ? attrMatch[3] : attrMatch[4];
                attributes[attrName] = attrValue;
            }
        }

        return {
            layoutContent: '',
            variant: 'column',
            attributes,
            endIndex: startIndex
        };
    }

    // 2) 带变体形式：<layout:row attr...></layout:row>
    selfClosingMatch = trimmed.match(/^<layout:([\w-]+)([^>]*)>\s*<\/layout:\1>$/);
    if (selfClosingMatch) {
        const variant = selfClosingMatch[1];
        const attributesStr = selfClosingMatch[2].trim();
        const attributes = {};
        if (attributesStr) {
            const attrRegex = /(\w+)=(["']([^"']*?)["']|\{([^}]*?)\})/g;
            let attrMatch;
            while ((attrMatch = attrRegex.exec(attributesStr)) !== null) {
                const attrName = attrMatch[1];
                const attrValue = attrMatch[3] !== undefined ? attrMatch[3] : attrMatch[4];
                attributes[attrName] = attrValue;
            }
        }

        return {
            layoutContent: '',
            variant,
            attributes,
            endIndex: startIndex
        };
    }

    // 常规多行形式：起始行和结束行分别存在
    const startTagInfo = isLayoutTag(startLine);

    if (!startTagInfo.isLayoutTag || startTagInfo.isClosing) {
        return { layoutContent: '', variant: '', attributes: {}, endIndex: startIndex };
    }

    const variant = startTagInfo.variant;
    const attributes = startTagInfo.attributes || {};
    const contentLines = [];
    let i = startIndex + 1;
    let foundEnd = false;
    let nestingLevel = 1; // 🔧 跟踪嵌套深度，从1开始（当前标签）

    // 查找对应的结束标签，考虑嵌套情况
    while (i < lines.length && nestingLevel > 0) {
        const line = lines[i];
        const tagInfo = isLayoutTag(line);

        if (tagInfo.isLayoutTag && tagInfo.variant === variant) {
            if (tagInfo.isClosing) {
                // 遇到结束标签，减少嵌套深度
                nestingLevel--;
                if (nestingLevel === 0) {
                    // 找到了匹配的结束标签
                    foundEnd = true;
                    i++;
                    break;
                }
            } else {
                // 遇到同名的开始标签，增加嵌套深度
                nestingLevel++;
            }
        }

        // 将当前行加入内容（包括嵌套的标签）
        contentLines.push(line);
        i++;
    }

    if (!foundEnd) {
        console.warn(`⚠️  警告: 未找到布局标签 <layout:${variant}> 的结束标签，可能存在标签不匹配`);
    }

    return {
        layoutContent: contentLines.join('\n').trim(),
        variant: variant,
        attributes: attributes,
        endIndex: i - 1
    };
}

// 更新标题布局创建函数
function createHeadingLayout(headingContent, subElements = [], headingLevel = 1, customStyles = null) {
    // 所有标题布局都使用左对齐
    // 注意：标题文本的对齐方式由createTextElement函数根据变体（h1、h2等）自动处理
    const layout = createLayoutElement(
        LAYOUT_CONSTANTS.DIRECTION.VERTICAL,
        [],
        {
            alignItems: LAYOUT_CONSTANTS.ALIGN.X.MIN, // 所有标题布局主轴左对齐
            counterAxisAlign: LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.MIN // 所有标题布局交叉轴左对齐
        }
    );

    // 🏷️ 设置标题布局的元数据，包含标题级别信息
    layout._metadata = {
        ...layout._metadata,
        actualType: 'layout',
        variant: 'column',
        headingLevel: headingLevel, // 添加标题级别信息
        isHeadingLayout: true,
        isLayout: true
    };

    // 添加标题文本，根据标题级别选择文本样式，支持 customStyles（如 <h3 color={...}>）
    const headingVariant = `h${headingLevel}`;
    const headingText = createTextElement(headingContent, headingVariant, {}, customStyles || undefined);

    // 不需要额外设置textAlign和width，createTextElement已经处理了

    layout.layout.children.push(headingText);

    // 添加子元素
    if (subElements.length > 0) {
        layout.layout.children = layout.layout.children.concat(subElements);
    }

    return layout;
}

// 递归收集所有数据变量的函数
function collectDataVariables(elements) {
    const dataVariables = {};

    const collectFromElement = (element) => {
        if (!element) return;

        // 检查选项卡元素的绑定数据（优先使用默认选中 tab 值）
        if (element._metadata && element._metadata.isTab && element._metadata.bindingData && element._metadata.defaultTabKey) {
            dataVariables[element._metadata.bindingData] = element._metadata.defaultTabKey;
        }

        // 🆕 检查普通布局元素的绑定数据（bindingData），默认值为空字符串
        if (element._metadata && element._metadata.bindingData && !element._metadata.isTab) {
            const key = element._metadata.bindingData;
            // 如果之前没有被其他元素（如 Tab）设置过，才初始化
            if (!Object.prototype.hasOwnProperty.call(dataVariables, key)) {
                dataVariables[key] = '';
            }
        }

        // 🆕 如果有 statusKey，也在根 data 中初始化一个空值
        if (element._metadata && element._metadata.statusKey) {
            const statusKey = element._metadata.statusKey;
            if (!Object.prototype.hasOwnProperty.call(dataVariables, statusKey)) {
                dataVariables[statusKey] = '';
            }
        }

        // 递归检查子元素
        if (element.layout && element.layout.children && Array.isArray(element.layout.children)) {
            element.layout.children.forEach(child => {
                collectFromElement(child);
            });
        }

        // 检查其他可能包含子元素的结构
        for (const key in element) {
            if (typeof element[key] === 'object' && element[key] !== null) {
                if (Array.isArray(element[key])) {
                    element[key].forEach(item => {
                        if (typeof item === 'object') {
                            collectFromElement(item);
                        }
                    });
                } else if (element[key].layout && element[key].layout.children) {
                    collectFromElement(element[key]);
                }
            }
        }
    };

    // 收集所有元素中的数据变量
    if (Array.isArray(elements)) {
        elements.forEach(element => {
            collectFromElement(element);
        });
    } else {
        collectFromElement(elements);
    }

    return dataVariables;
}

// 递归收集所有EventTargetId的函数
function collectEventTargetIds(elements) {
    const eventTargetIds = [];

    const collectFromElement = (element) => {
        if (!element) return;

        // 检查当前元素的events数组
        if (element.events && Array.isArray(element.events)) {
            element.events.forEach(event => {
                if (event && event.EventTargetId && typeof event.EventTargetId === 'string') {
                    if (!eventTargetIds.includes(event.EventTargetId)) {
                        eventTargetIds.push(event.EventTargetId);
                    }
                }
            });
        }

        // 递归检查子元素
        if (element.layout && element.layout.children && Array.isArray(element.layout.children)) {
            element.layout.children.forEach(child => {
                collectFromElement(child);
            });
        }

        // 检查其他可能包含子元素的结构
        for (const key in element) {
            if (typeof element[key] === 'object' && element[key] !== null) {
                if (Array.isArray(element[key])) {
                    element[key].forEach(item => {
                        if (typeof item === 'object') {
                            collectFromElement(item);
                        }
                    });
                } else if (element[key].layout && element[key].layout.children) {
                    collectFromElement(element[key]);
                }
            }
        }
    };

    // 收集所有元素中的EventTargetId
    if (Array.isArray(elements)) {
        elements.forEach(element => {
            collectFromElement(element);
        });
    } else {
        collectFromElement(elements);
    }

    return eventTargetIds;
}

// 创建八要素根对象
function createEightElementRoot(markdownElements, rootAttributes = {}) {
    // 使用随机UUID生成根布局ID
    const rootId = generateUUID();

    // 🆕 收集所有数据变量
    const dataVariables = collectDataVariables(markdownElements);

    // 🆕 收集所有EventTargetId
    const eventTargetIds = collectEventTargetIds(markdownElements);

    // 🆕 获取根布局的样式配置，传入根layout属性
    const rootStyleConfig = getElementStyleConfig('layout', 'root', rootAttributes);

    // 生成唯一的className
    const uniqueClassName = `layout-root-${rootId}`;

    const rootLayout = {
        dataKeys: [],
        id: rootId,
        name: "layout",
        "name-zh": "布局",
        "file-type": "template",
        theme: "default",
        data: dataVariables, // 🆕 收集的所有数据变量
        EventTargetIds: eventTargetIds, // 🆕 收集的所有EventTargetId
        // 🔍 保存根布局元数据用于分析
        _metadata: {
            actualType: 'layout',
            variant: 'root',
            isLayout: true,
            isRoot: true,
            // 🆕 保存根layout的属性信息
            appliedAttributes: rootAttributes
        },
        layout: {
            classStyle: {
                ...rootStyleConfig // 应用根布局样式配置到classStyle（包含属性）
            },
            className: uniqueClassName,
            style: {
                // display: LAYOUT_CONSTANTS.DISPLAY.FLEX,
                // layoutMode: LAYOUT_CONSTANTS.DIRECTION.VERTICAL,
                layoutWrap: LAYOUT_CONSTANTS.WRAP.NO_WRAP,
                layoutAlign: LAYOUT_CONSTANTS.ALIGN.Y.SELF.INHERIT,
                layoutGrow: LAYOUT_CONSTANTS.GROW.ZERO,
                // width: "calc(100% - 30px)",
                height: "100%",
                position: "relative",
                boxSizing: "border-box",
                // "back-width": "auto",
                // "back-height": "100px",
                // 🆕 应用根布局样式配置中的属性样式
                // ...rootStyleConfig
            },
            children: markdownElements
        },
        events: [{}]
    };

    return rootLayout;
}

export {
    createFlexWrapLayout,
    createElementContainer,
    createBaseLayout,
    createLayoutElement,
    isLayoutTag,
    extractLayoutBlock,
    createHeadingLayout,
    createEightElementRoot
}