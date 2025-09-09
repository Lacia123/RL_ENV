import {
    LAYOUT_CONSTANTS,
    getElementStyleConfig
} from '../styleConfig.js';
import { generateUUID } from '../util.js';
import { createTextElement } from './textCreators.js';

// 检测是否为布局标签（支持属性）
function isLayoutTag(line) {
    // 匹配带属性的开始标签: <layout:variant attr1="value1" attr2="value2">
    const layoutTagWithAttrsMatch = line.trim().match(/^<layout:(\w+)([^>]*)>$/);
    if (layoutTagWithAttrsMatch) {
        const variant = layoutTagWithAttrsMatch[1];
        const attributesStr = layoutTagWithAttrsMatch[2].trim();

        // 解析属性
        const attributes = {};
        if (attributesStr) {
            // 匹配多种格式的属性：key="value", key='value', key={value}
            const attrRegex = /(\w+)=(["']([^"']*?)["']|\{([^}]*?)\})/g;
            let attrMatch;
            while ((attrMatch = attrRegex.exec(attributesStr)) !== null) {
                const attrName = attrMatch[1];
                // attrMatch[3] 是引号格式的值，attrMatch[4] 是大括号格式的值
                const attrValue = attrMatch[3] !== undefined ? attrMatch[3] : attrMatch[4];
                attributes[attrName] = attrValue;
            }
        }

        return {
            isLayoutTag: true,
            variant: variant,
            attributes: attributes,
            isClosing: false
        };
    }

    // 匹配简单的开始标签: <layout:variant>
    const layoutTagMatch = line.trim().match(/^<layout:(\w+)>$/);
    if (layoutTagMatch) {
        return {
            isLayoutTag: true,
            variant: layoutTagMatch[1],
            attributes: {},
            isClosing: false
        };
    }

    const closingTagMatch = line.trim().match(/^<\/layout:(\w+)>$/);
    if (closingTagMatch) {
        return {
            isLayoutTag: true,
            variant: closingTagMatch[1],
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
                layoutGrow: LAYOUT_CONSTANTS.GROW.ZERO,
                boxSizing: "border-box",
                borderStyle: "solid",
                borderWidth: "0",
                borderColor: "initial",
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
            display: LAYOUT_CONSTANTS.DISPLAY.FLEX,
            layoutMode: direction,
            layoutWrap: LAYOUT_CONSTANTS.WRAP.NO_WRAP,
            // primaryAxisSizingMode: "fixed",
            // layoutAlign: LAYOUT_CONSTANTS.ALIGN.Y.SELF.INHERIT,
            layoutGrow: LAYOUT_CONSTANTS.GROW.ZERO,
            boxSizing: "border-box",
            borderStyle: "solid",
            borderWidth: "0",
            borderColor: "initial",
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
                borderStyle: "solid",
                borderWidth: "0",
                borderColor: "initial",
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

// 创建布局元素，支持自定义选项
function createLayoutElement(direction, children = [], options = {}) {
    const { width, height, gap, variant = 'column', isRoot = false,
        alignItems = LAYOUT_CONSTANTS.ALIGN.X.MIN, attributes = {} } = options;

    // 使用随机UUID生成ID
    const layoutId = generateUUID();

    // 根据方向自动计算交叉轴对齐方式
    // 对于水平布局，默认交叉轴居中对齐；对于垂直布局，使用传入的选项或默认左对齐
    const counterAxisAlign = options.counterAxisAlign ||
        (direction === LAYOUT_CONSTANTS.DIRECTION.HORIZONTAL ?
            LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.CENTER :
            LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.MIN);

    // 🆕 获取布局元素的样式配置，传入属性
    const layoutStyleConfig = getElementStyleConfig('layout', isRoot ? 'root' : variant, attributes);

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
            appliedAttributes: attributes
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

    // 添加子元素
    layout.layout.children = children;

    return layout;
}

// 提取完整的布局标签块
function extractLayoutBlock(lines, startIndex) {

    const startLine = lines[startIndex];
    const startTagInfo = isLayoutTag(startLine);

    if (!startTagInfo.isLayoutTag || startTagInfo.isClosing) {
        return { layoutContent: '', variant: '', attributes: {}, endIndex: startIndex };
    }

    const variant = startTagInfo.variant;
    const attributes = startTagInfo.attributes || {};
    const contentLines = [];
    let i = startIndex + 1;
    let foundEnd = false;

    // 查找对应的结束标签
    while (i < lines.length) {
        const line = lines[i];
        const tagInfo = isLayoutTag(line);

        if (tagInfo.isLayoutTag && tagInfo.isClosing && tagInfo.variant === variant) {
            foundEnd = true;
            i++;
            break;
        }

        contentLines.push(line);
        i++;
    }

    if (!foundEnd) {
        console.warn(`警告: 未找到布局标签 ${variant} 的结束标签`);
    }

    return {
        layoutContent: contentLines.join('\n').trim(),
        variant: variant,
        attributes: attributes,
        endIndex: i - 1
    };
}

// 更新标题布局创建函数
function createHeadingLayout(headingContent, subElements = [], headingLevel = 1) {
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

    // 添加标题文本，根据标题级别选择文本样式
    const headingVariant = `h${headingLevel}`;
    const headingText = createTextElement(headingContent, headingVariant);

    // 不需要额外设置textAlign和width，createTextElement已经处理了

    layout.layout.children.push(headingText);

    // 添加子元素
    if (subElements.length > 0) {
        layout.layout.children = layout.layout.children.concat(subElements);
    }

    return layout;
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
                        console.log(`🎯 收集到EventTargetId: ${event.EventTargetId}`);
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

    console.log(`📋 总共收集到 ${eventTargetIds.length} 个EventTargetId:`, eventTargetIds);
    return eventTargetIds;
}

// 创建八要素根对象
function createEightElementRoot(markdownElements, rootAttributes = {}) {
    // 使用随机UUID生成根布局ID
    const rootId = generateUUID();

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
                display: LAYOUT_CONSTANTS.DISPLAY.FLEX,
                layoutMode: LAYOUT_CONSTANTS.DIRECTION.VERTICAL,
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