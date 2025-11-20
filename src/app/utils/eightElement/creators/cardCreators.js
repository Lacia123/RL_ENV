import { parseMarkdownToTemplate, parseMarkdown, parseEventSyntax } from '../PSUIPParser.js';
import { generateUUID } from '../util.js';
import { createCodeElement } from './codeCreators.js';
import { createTableElement, extractTableOrChartData, getChartVariantFromConfig, createChartElement, generateChartSvg, addChartEventButton } from './tableCreators.js';
import { createBackgroundElement } from './backgroundCreators.js';
import { createButtonElement } from './buttonCreators.js';
import { createTextElement } from './textCreators.js';
import { createElementContainer, createBaseLayout, createLayoutElement } from './layoutCreators.js';
import { LAYOUT_CONSTANTS } from '../styleConfig.js';
import { EVENT_NAME, EVENT_CONFIG } from '../eventConfig.js';
import resolveToken from '../../tokens/resolveToken.js';
import { getElementStyleConfig } from '../styleConfig.js';
import { DEFAULT_STYLE_CONFIG } from '../styleConfig.js';


// 检测是否为卡片标签
function isCardTag(line) {
    // 匹配带属性的开始标签: <card:variant attr1="value1" attr2="value2"> 或 <card:variant attr1={token.value}>
    const cardTagWithAttrsMatch = line.trim().match(/^<card(?::(\w+))([^>]*)>$/);
    if (cardTagWithAttrsMatch) {
        const variant = cardTagWithAttrsMatch[1] || 'standard';
        const attributesStr = cardTagWithAttrsMatch[2].trim();

        // 解析属性
        const attributes = {};
        const attributeMeta = {};
        if (attributesStr) {
            // 匹配 key="value" 或 key={token.value} 格式的属性
            const attrRegex = /(\w+)=(?:["']([^"']*?)["']|\{([^}]*?)\})/g;
            let attrMatch;
            while ((attrMatch = attrRegex.exec(attributesStr)) !== null) {
                const key = attrMatch[1];
                const quotedValue = attrMatch[2];
                const bracedValue = attrMatch[3];
                const value = quotedValue !== undefined ? quotedValue : bracedValue;
                attributes[key] = value;
                attributeMeta[key] = {
                    format: quotedValue !== undefined ? 'quoted' : 'braced',
                    value
                };
            }
        }

        return {
            isCardTag: true,
            variant: variant,
            attributes: attributes,
            attributeMeta,
            rawTag: cardTagWithAttrsMatch[0],
            isClosing: false
        };
    }

    // 匹配 </card> 或 </card:variant>
    const closingTagMatch = line.trim().match(/^<\/card(?::(\w+))?>$/);
    if (closingTagMatch) {
        return {
            isCardTag: true,
            variant: closingTagMatch[1] || 'standard',
            attributes: {},
            isClosing: true
        };
    }

    return { isCardTag: false };
}

// 解析分组模式，支持 h3+h4+p:group 这种语法
function parseGroupPattern(pattern) {
    const groupMatch = pattern.match(/^(.+):group$/);
    if (!groupMatch) return null;

    const elements = groupMatch[1].split('+').map(el => el.trim());
    return {
        elements,
        pattern: groupMatch[1],
        isGroup: true
    };
}

// 检查当前行是否匹配任何分组模式的起始元素
function checkGroupStart(line, groupConfigs) {
    for (const groupConfig of groupConfigs) {
        const firstElementType = groupConfig.pattern[0];
        const parseResult = parseMarkdownToTemplate(line, { [firstElementType]: 'temp' }, 0);

        if (parseResult && parseResult.markdownResult && parseResult.markdownResult.type === firstElementType) {
            return {
                groupConfig,
                startElement: parseResult.markdownResult
            };
        }
    }
    return null;
}


// 从输入中提取通配符匹配的部分
function extractWildcardMatch(input, pattern) {
    if (!pattern.includes('*')) {
        return input === pattern ? '' : null;
    }

    // 找到 * 的位置
    const starIndex = pattern.indexOf('*');
    const prefix = pattern.substring(0, starIndex);
    const suffix = pattern.substring(starIndex + 1);

    // 检查输入是否以指定前缀开头、后缀结尾
    if (input.startsWith(prefix) && input.endsWith(suffix)) {
        // 提取中间的匹配部分
        const matchPart = input.substring(prefix.length, input.length - suffix.length);
        return matchPart;
    }

    return null;
}

// 在 markdownMapping 中查找通配符匹配
function findWildcardMatch(input, markdownMapping) {
    // 首先检查精确匹配
    if (markdownMapping[input]) {
        return {
            matched: true,
            templatePath: markdownMapping[input],
            matchedValue: input,
            wildcard: null
        };
    }

    // 然后检查通配符匹配
    for (const [pattern, templatePath] of Object.entries(markdownMapping)) {
        if (pattern.includes('*')) {
            const wildcardMatch = extractWildcardMatch(input, pattern);

            if (wildcardMatch !== null) {
                return {
                    matched: true,
                    templatePath: templatePath,
                    matchedValue: input,
                    wildcard: wildcardMatch,
                    pattern: pattern
                };
            }
        }
    }

    return { matched: false };
}


// 提取模板标签内容
function extractTemplateTag(lines, startIndex, tagName) {

    const contentLines = [];
    let i = startIndex + 1;
    let foundEnd = false;

    while (i < lines.length) {
        const line = lines[i];
        const closingTagMatch = line.trim().match(new RegExp(`^</${tagName}>$`));

        if (closingTagMatch) {
            foundEnd = true;
            break;
        }

        contentLines.push(line);
        i++;
    }

    if (!foundEnd) {
        console.warn(`警告: 未找到模板标签 ${tagName} 的结束标签`);
    }

    const tagContent = contentLines.join('\n').trim();

    return {
        tagContent,
        endIndex: i
    };
}

// 收集分组项目, TODO: 需要重构
function collectGroupItems(lines, startIndex, groupConfig, cardStyleConfig) {
    const groupPattern = groupConfig.pattern;
    const groupItems = [];
    let i = startIndex;
    

    while (i < lines.length) {
        const currentGroupItem = {
            elements: {},
            rawLines: []
        };

        // 收集一个完整的分组项
        let elementIndex = 0;
        let j = i;
        let consecutiveEmptyLines = 0; // 🆕 跟踪连续空行数量

        while (j < lines.length && elementIndex < groupPattern.length) {
            const originalLine = lines[j];
            const line = originalLine.trim();

            // 🆕 处理空行：允许分组内的空行，但限制连续空行数量
            if (!line) {
                consecutiveEmptyLines++;
                // 🆕 如果连续空行超过3行，可能是分组结束
                if (consecutiveEmptyLines > 3) {
                    console.log(`🔍 连续空行过多(${consecutiveEmptyLines})，可能是分组结束`);
                    break;
                }
                j++;
                continue;
            }

            // 🆕 重置连续空行计数
            consecutiveEmptyLines = 0;

            const expectedType = groupPattern[elementIndex];
            const parseResult = parseMarkdownToTemplate(line, { [expectedType]: 'temp' }, 0);

            if (parseResult && parseResult.markdownResult && parseResult.markdownResult.type === expectedType) {
                // 匹配期望的元素类型
                if (expectedType === 'ul' || expectedType === 'ol') {
                    // 🆕 列表类型：收集连续的列表行作为一个整体
                    const listLines = [lines[j]];
                    let k = j + 1;
                    while (k < lines.length) {
                        const nextOriginalLine = lines[k];
                        const nextTrimmedLine = nextOriginalLine.trim();
                        if (!nextTrimmedLine) {
                            // 空行视为列表的一部分，保留以维持原始结构
                            listLines.push(nextOriginalLine);
                            k++;
                            continue;
                        }

                        const nextParseResult = parseMarkdownToTemplate(nextTrimmedLine, { [expectedType]: 'temp' }, 0);
                        if (nextParseResult && nextParseResult.markdownResult && nextParseResult.markdownResult.type === expectedType) {
                            listLines.push(nextOriginalLine);
                            k++;
                        } else {
                            break;
                        }
                    }

                    currentGroupItem.elements[expectedType] = listLines.join('\n');
                    currentGroupItem.rawLines.push(...listLines);
                    j = k;
                } else {
                    currentGroupItem.elements[expectedType] = parseResult.markdownResult.content;
                    currentGroupItem.rawLines.push(originalLine);
                    j++;
                }
                elementIndex++;
                continue;
            } else if (expectedType === 'p') {
                // 🆕 对于p类型，需要特殊处理
                if (line === '§PARAGRAPH§') {
                    // 如果是段落分隔符，跳过并继续寻找真正的段落内容
                    j++;
                    continue;
                } else if (line.match(/^[^#\[\|]/)) {
                    // 匹配非标题行、非链接行、非表格行
                    // 排除以 # 开头的标题、以 [ 开头的链接、以 | 开头的表格
                    currentGroupItem.elements['p'] = line;
                    currentGroupItem.rawLines.push(originalLine);
                    elementIndex++;
                } else {
                    // 不匹配段落格式，跳过这行继续寻找
                    j++;
                    continue;
                }
            } else {
                // 不匹配，检查是否是新的分组开始
                const newGroupCheck = checkGroupStart(line, [groupConfig]);
                if (newGroupCheck && elementIndex > 0) {
                    // 是新的分组开始，当前分组项收集完成
                    console.log(`🔄 检测到新分组开始，当前分组项收集完成 (已收集${elementIndex}/${groupPattern.length}个元素)`);
                    break;
                } else if (elementIndex === 0) {
                    // 第一个元素就不匹配，说明不是分组
                    console.log(`❌ 第一个元素不匹配，不是有效分组: "${line}"`);
                    return null;
                } else {
                    // 🆕 改进：如果不是期望的类型，但已经收集了一些元素，检查是否可以跳过这行
                    console.log(`⚠️ 不匹配期望类型 ${expectedType}，尝试跳过: "${line}"`);
                    // 跳过不匹配的行，继续寻找下一个期望的元素
                    j++;
                    continue;
                }
            }

            j++;
        }

        // 如果收集到了完整的分组项（所有元素都有）
        if (elementIndex === groupPattern.length) {
            groupItems.push(currentGroupItem);
            i = j;

            // 检查下一行是否是新的分组开始
            if (j < lines.length) {
                const nextLine = lines[j].trim();
                if (nextLine) {
                    const nextGroupCheck = checkGroupStart(nextLine, [groupConfig]);
                    if (!nextGroupCheck) {
                        // 不是新的分组开始，结束收集
                        break;
                    }
                }
            }
        } else {
            // 没有收集到完整的分组项，结束收集
            break;
        }
    }

    if (groupItems.length > 0) {
        const groupContent = groupItems.map(item => item.rawLines.join('\n')).join('\n\n');

        return {
            items: groupItems,
            content: groupContent,
            nextIndex: i
        };
    }

    return null;
}

// 🆕 收集连续的未映射 markdown 内容
function collectUnmappedMarkdownContent(lines, startIndex, markdownMapping) {

    const contentLines = [];
    let i = startIndex;

    while (i < lines.length) {
        const line = lines[i].trim();

        // 跳过空行
        if (!line) {
            i++;
            continue;
        }

        // 检查是否为已映射的 markdown 格式
        const parseResult = parseMarkdownToTemplate(line, markdownMapping, 0);
        if (parseResult && parseResult.markdownResult) {
            // 遇到已映射的内容，停止收集
            break;
        }

        // 检查是否为内联模板标签
        const inlineTemplateTagMatch = line.match(/^<(\w+)>(.*?)<\/\1>$/);
        if (inlineTemplateTagMatch) {
            break;
        }

        // 检查是否为块级模板标签
        const templateTagMatch = line.match(/^<(\w+)>$/);
        if (templateTagMatch) {
            break;
        }

        // 将此行添加到未映射内容中
        contentLines.push(lines[i]); // 保留原始行（包括缩进）
        i++;
    }

    const content = contentLines.join('\n');

    return {
        content: content,
        lineCount: contentLines.length,
        endIndex: i // 下一行的索引
    };
}

// 提取完整的卡片标签块，TODO: 看到有类似代码，需要重构
function extractCardBlock(lines, startIndex) {

    const startLine = lines[startIndex];
    const startTagInfo = isCardTag(startLine);

    if (!startTagInfo.isCardTag || startTagInfo.isClosing) {
        console.error('无效的卡片标签起始行');
        return { cardContent: '', variant: 'standard', attributes: {}, endIndex: startIndex };
    }

    const variant = startTagInfo.variant;
    const attributes = startTagInfo.attributes || {};
    const contentLines = [];
    let i = startIndex + 1;
    let foundEnd = false;

    // 查找对应的结束标签
    while (i < lines.length) {
        const line = lines[i];
        const tagInfo = isCardTag(line);

        if (tagInfo.isCardTag && tagInfo.isClosing && tagInfo.variant === variant) {
            foundEnd = true;
            i++;
            break;
        }

        contentLines.push(line);
        i++;
    }

    if (!foundEnd) {
        console.warn(`警告: 未找到卡片标签 ${variant} 的结束标签`);
    }

    return {
        cardContent: contentLines.join('\n').trim(),
        variant: variant,
        attributes: attributes,
        attributeMeta: startTagInfo.attributeMeta || {},
        rawTag: startTagInfo.rawTag || '',
        endIndex: i - 1
    };
}


function sanitizeCardContent(content = '') {
    if (!content) {
        return '';
    }
    return content.replace(/§PARAGRAPH§/g, '\n\n').trim();
}

function buildCardTagName(variant = 'standard') {
    if (variant && variant !== 'standard') {
        return `card:${variant}`;
    }
    return 'card';
}

function serializeCardAttributes(attributes = {}, attributeMeta = {}) {
    const parts = [];

    Object.entries(attributes).forEach(([key, value]) => {
        if (value === undefined || value === null) {
            return;
        }

        const meta = attributeMeta?.[key];
        const baseValue = value.toString().trim();

        if (meta?.format === 'braced') {
            const rawValue = meta.value ?? baseValue;
            parts.push(`${key}={${rawValue}}`);
            return;
        }

        if (meta?.format === 'quoted') {
            const rawValue = meta.value ?? baseValue;
            parts.push(`${key}="${rawValue}"`);
            return;
        }

        const shouldUseBraces = baseValue.includes('.') &&
            !baseValue.startsWith('http') &&
            !baseValue.includes('://') &&
            !baseValue.includes('/');

        if (shouldUseBraces) {
            parts.push(`${key}={${baseValue}}`);
        } else {
            parts.push(`${key}="${baseValue}"`);
        }
    });

    return parts.join(' ');
}

function buildCardStartTag(variant, attributes, attributeMeta = {}) {
    const tagName = buildCardTagName(variant);
    const attrString = serializeCardAttributes(attributes, attributeMeta);
    if (attrString) {
        return `<${tagName} ${attrString}>`;
    }
    return `<${tagName}>`;
}

function buildCardClosingTag(variant) {
    const tagName = buildCardTagName(variant);
    return `</${tagName}>`;
}

function buildCardMarkdownPayload(variant, sanitizedContent, options = {}) {
    const { rawTag = '', attributes = {}, attributeMeta = {} } = options || {};
    const startTag = rawTag?.trim() || buildCardStartTag(variant, attributes, attributeMeta);
    const closingTag = buildCardClosingTag(variant);
    const body = sanitizedContent ? `\n${sanitizedContent}\n` : '\n';
    return `${startTag}${body}${closingTag}`;
}

function createCardUpdateEvent(cardId, variant, sanitizedContent, options = {}) {
    if (!cardId) {
        return null;
    }

    const baseUpdateConfig = EVENT_CONFIG?.[EVENT_NAME.UPDATE];
    if (!baseUpdateConfig) {
        return null;
    }

    const eventConfig = JSON.parse(JSON.stringify(baseUpdateConfig));
    eventConfig.EventTargetId = cardId;

    if (!eventConfig.parameters) {
        eventConfig.parameters = {};
    }

    eventConfig.parameters.markdown = buildCardMarkdownPayload(
        variant,
        sanitizedContent,
        {
            rawTag: options.rawTag,
            attributes: options.attributes,
            attributeMeta: options.attributeMeta
        }
    );
    eventConfig.parameters.cardId = cardId;

    return eventConfig;
}

// 创建卡片元素
function createCardElement(content, variant = 'standard', attributes = {}, currentMarkdown = '', options = {}) {
    const id = generateUUID();
    const sanitizedCardContent = sanitizeCardContent(content || '');
    const { rawTag = '', attributeMeta = {} } = options || {};
    // 获取卡片元素的样式配置
    let cardStyleConfig = getElementStyleConfig('card', variant);

    // 🆕 处理 classList 和 defaultClass
    // 深拷贝以避免修改原配置
    cardStyleConfig = JSON.parse(JSON.stringify(cardStyleConfig));

    // 确保样式对象存在
    if (!cardStyleConfig.style) {
        cardStyleConfig.style = {};
    }

    // 🆕 如果有 classList 和 defaultClass，应用默认 class 样式
    if (cardStyleConfig.classList && cardStyleConfig.defaultClass) {
        const defaultClassStyle = cardStyleConfig.classList[cardStyleConfig.defaultClass];
        if (defaultClassStyle) {
            // 合并 defaultClass 样式到 style
            Object.assign(cardStyleConfig.style, defaultClassStyle);
        }
    }

    // 应用属性到样式配置
    if (Object.keys(attributes).length > 0) {
        // 处理各种可能的属性
        Object.keys(attributes).forEach(attrKey => {
            const attrValue = attributes[attrKey];

            // 🆕 特殊处理 class 属性
            if (attrKey === 'class' && cardStyleConfig.classList) {
                const classStyle = cardStyleConfig.classList[attrValue];
                if (classStyle) {
                    // 使用指定的 class 样式覆盖
                    Object.assign(cardStyleConfig.style, classStyle);
                } else {
                    console.warn(`未找到 class "${attrValue}"，可用的 class:`, Object.keys(cardStyleConfig.classList));
                }
                return; // class 属性不作为普通属性处理
            }

            // 解析token值 - 如果不包含大括号，自动添加
            let tokenToResolve = attrValue;
            if (!attrValue.startsWith('{') && !attrValue.endsWith('}')) {
                // 如果看起来像token路径（包含点），自动添加大括号
                if (attrValue.includes('.')) {
                    tokenToResolve = `{${attrValue}}`;
                }
            }

            const resolvedValue = resolveToken(tokenToResolve);

            // 根据属性名称应用到相应的样式
            if (attrKey === 'background' || attrKey === 'backgroundColor') {
                cardStyleConfig.style.background = resolvedValue;
            } else {
                // 对于其他未知属性，直接添加到样式
                cardStyleConfig.style[attrKey] = resolvedValue;
            }
        });
    }

    // 生成唯一的className
    const uniqueClassName = `card-${id}`;

    // 检查是否为模板类型的卡片
    const isTemplateCard = cardStyleConfig && cardStyleConfig.type === 'template';

    let cardChildren = [];
    if (content && content.trim()) {
        if (isTemplateCard) {
            // 对于模板类型的卡片，解析嵌套的模板标签
            cardChildren = parseTemplateCardContent(content, cardStyleConfig, false, currentMarkdown);
        } else {
            // 对于普通卡片，递归解析内容
            const parsedContent = parseMarkdown(content, { currentMarkdown });
            cardChildren = parsedContent;
        }
    }

    const cardUpdateEvent = createCardUpdateEvent(
        id,
        variant,
        sanitizedCardContent,
        {
            rawTag,
            attributes,
            attributeMeta
        }
    );
    const cardEvents = cardUpdateEvent ? [cardUpdateEvent] : [{}];

    if (isTemplateCard) {
        // 模板类型卡片的结构
        const cardElement = {
            dataKeys: [],
            name: "layout",
            "name-zh": "卡片",
            "file-type": "template",
            theme: "default",
            _metadata: {
                actualType: 'card',
                variant: variant,
                isCard: true,
                isLayout: true,
                isTemplateCard: true,
                cardContent: sanitizedCardContent
            },
            layout: {
                style: {
                    display: LAYOUT_CONSTANTS.DISPLAY.FLEX,
                    layoutMode: LAYOUT_CONSTANTS.DIRECTION.VERTICAL,
                    layoutWrap: LAYOUT_CONSTANTS.WRAP.NO_WRAP,
                    // primaryAxisSizingMode: "fixed",
                    layoutGrow: LAYOUT_CONSTANTS.GROW.ZERO,
                    boxSizing: "border-box",
                    // borderStyle: "solid",
                    // borderWidth: "0",
                    // borderColor: "initial",
                    height: "auto",
                    width: "100%",
                    boxSizing: "border-box",
                    // "back-width": "100%",
                    // "back-height": "auto",
                    position: "relative",
                    // ...cardStyleConfig.style // 应用模板样式
                },
                classStyle: {
                    ...cardStyleConfig.style
                },
                className: uniqueClassName,
                children: cardChildren
            },
            description: `模板卡片元素 - ${variant}`,
            id,
            events: cardEvents
        };

        return cardElement;
    } else {
        // 普通卡片的结构（保持原有逻辑）
        const baseLayout = createBaseLayout(LAYOUT_CONSTANTS.DIRECTION.VERTICAL, {
            width: "100%",
            height: "auto",
            alignItems: LAYOUT_CONSTANTS.ALIGN.X.MIN
        });

        // 应用卡片样式到布局
        // Object.entries(cardStyleConfig).forEach(([key, value]) => {
        //     if (value !== undefined && value !== null) {
        //         baseLayout.style[key] = value;
        //     }
        // });

        const cardElement = {
            dataKeys: [],
            name: "layout",
            "name-zh": "卡片",
            "file-type": "template",
            theme: "default",
            _metadata: {
                actualType: 'card',
                variant: variant,
                isCard: true,
                isLayout: true,
                cardContent: sanitizedCardContent
            },
            layout: {
                ...baseLayout,
                classStyle: {
                    ...cardStyleConfig
                },
                className: uniqueClassName,
                children: cardChildren
            },
            description: `卡片元素 - ${variant}`,
            id,
            events: cardEvents
        };

        return cardElement;
    }
}


// 创建模板标签元素, TODO: 需要重构
function createTemplateTagElement(tagName, content, cardStyleConfig, markdownData = null, currentMarkdown = '') {

    const id = generateUUID();
    const uniqueClassName = `template-${tagName}-${id}`;

    // 获取标签配置
    const tagConfig = cardStyleConfig[tagName];
    if (!tagConfig) {
        console.warn(`警告: 未找到模板标签 ${tagName} 的配置`);
        return null;
    }
    

    // 🆕 检查是否有嵌套的markdownMapping或required配置，如果有，需要处理
    if (tagConfig.markdownMapping || tagConfig.required) {

        // 使用递归调用parseTemplateCardContent来处理嵌套内容（即使content为空）
        const nestedElements = parseTemplateCardContent(content || '', tagConfig, true);

        // 创建容器元素来包装嵌套的子元素（即使nestedElements为空也要创建，因为可能有required容器）
        const containerElement = {
            dataKeys: [],
            name: "layout",
            "name-zh": `嵌套模板容器-${tagName}`,
            "file-type": "template",
            type: "layout",
            variant: "normal",
            id: id,
            className: uniqueClassName,
            layout: {
                direction: tagConfig.style?.flexDirection === 'row' ? 'horizontal' : 'vertical',
                style: tagConfig.style || {},
                children: nestedElements || [],
                classStyle: {
                    ...(tagConfig.style || {})
                },
                className: uniqueClassName,
            },

        };

        return containerElement;
    }

    // 🆕 特殊处理：如果只有metaType: 'component'，也要检查是否需要处理markdownMapping
    if (tagConfig.metaType === 'component' && tagConfig.markdownMapping) {
        // 对于组件引用，需要先获取被引用的组件配置
        const componentConfig = DEFAULT_STYLE_CONFIG.component && DEFAULT_STYLE_CONFIG.component[tagConfig.variant];
        
        if (componentConfig) {
            // 使用被引用组件的配置来处理markdownMapping
            const nestedElements = parseTemplateCardContent(content || '', componentConfig, true);
            
            if (nestedElements && nestedElements.length > 0) {
                // 创建容器元素来包装组件和解析的元素
                const containerElement = {
                    dataKeys: [],
                    name: "layout",
                    "name-zh": `组件容器-${tagName}`,
                    "file-type": "template",
                    type: "layout",
                    variant: "normal",
                    id: id,
                    className: uniqueClassName,
                    layout: {
                        direction: tagConfig.style?.flexDirection === 'row' ? 'horizontal' : 'vertical',
                        style: tagConfig.style || {},
                        children: nestedElements,
                        classStyle: {
                            ...(tagConfig.style || {})
                        },
                        className: uniqueClassName,
                    },
                };

                return containerElement;
            }
        }
    }

    // 🆕 优先检查 markdownData 的类型，决定如何渲染元素
    if (markdownData && markdownData.type) {
        let elementInstance = null;
        if (markdownData.type === 'code') {
            // 代码块类型，优先创建代码元素
            const language = markdownData.language || 'plaintext';
            elementInstance = createCodeElement(content, language);
        } else if (markdownData.type === 'table') {
            // 表格类型
            elementInstance = createTableElement(content);
        } else if (markdownData.type === 'img') {
            // 图片类型
            const imageUrl = markdownData.url || '';
            // 🔧 修复：优先使用tagConfig中的variant，回退到markdownData中的variant或默认值
            const imageVariant = (tagConfig && tagConfig.variant) ? tagConfig.variant : (markdownData.variant || 'normal');
            elementInstance = createBackgroundElement(imageUrl, imageVariant);
        } else if (markdownData.type === 'button') {
            // 按钮类型
            const buttonText = content;
            const buttonUrl = markdownData.url || '#';
            const buttonVariant = markdownData.variant || 'primary';  // 🔧 修复：使用 variant 而不是 buttonVariant

            // 🆕 如果有原始文本，使用原始文本来解析事件；否则使用按钮文本
            const textForEventParsing = markdownData.originalText || buttonText;
            elementInstance = createButtonElement(textForEventParsing, buttonUrl, buttonVariant, currentMarkdown);
        } else if (markdownData.type === 'p') {
            // 🆕 段落类型：检查是否包含链接，如果有则用 parseMarkdown 处理
            if (content && (content.includes('](') || content.includes('[') || content.includes('**'))) {
                // 包含可能的 markdown 格式，使用 parseMarkdown 处理
                const parsedElements = parseMarkdown(content, { currentMarkdown });
                if (parsedElements && parsedElements.length > 0) {
                    // 如果解析出多个元素，用容器包装
                    if (parsedElements.length === 1) {
                        elementInstance = parsedElements[0];
                    } else {
                        // 创建容器包装多个元素
                        const containerId = generateUUID();
                        elementInstance = {
                            dataKeys: [],
                            name: "layout",
                            "name-zh": "段落容器",
                            "file-type": "template",
                            theme: "default",
                            id: containerId,
                            layout: {
                                style: {
                                    display: LAYOUT_CONSTANTS.DISPLAY.FLEX,
                                    layoutMode: LAYOUT_CONSTANTS.DIRECTION.VERTICAL,
                                    layoutWrap: LAYOUT_CONSTANTS.WRAP.NO_WRAP,
                                    boxSizing: "border-box",
                                    height: "auto",
                                    width: "100%"
                                },
                                children: parsedElements
                            }
                        };
                    }
                }
            }
            // 如果没有特殊格式或解析失败，继续使用原逻辑（后续会创建普通文本元素）
        }

        // 如果成功创建了元素实例，跳过后续的 tagConfig 处理
        if (elementInstance) {
            // 如果标签配置中有 style，需要创建容器来包装元件并应用样式
            if (tagConfig.style) {
                // 创建容器来包装元件实例
                const containerElement = createElementContainer(tagName, content, cardStyleConfig, elementInstance, markdownData);
                return containerElement;
            } else {
                return elementInstance;
            }
        }
    }

    // 检查是否为元件引用（回退到原有逻辑）
    if (tagConfig.metaType && tagConfig.variant) {

        // 🆕 处理自定义样式覆盖
        let finalVariant = tagConfig.variant;
        let styleOverride = null;

        // 检查是否有自定义变体和样式
        if (markdownData && markdownData.customVariant) {
            // 如果自定义变体与当前标签配置匹配，应用自定义样式
            if (markdownData.customVariant === finalVariant) {
                styleOverride = markdownData.customStyles;
            }
        }
        
        // 🔧 修复：tagConfig.style 是容器样式，不应该作为 styleOverride 传递给文本元素
        // 容器样式会通过容器的 classStyle 应用，文本元素应该只使用 variant 对应的样式
        // styleOverride 只应该来自 markdownData.customStyles（如果存在）

        // 根据 metaType 创建对应的元件
        let elementInstance = null;
        if (tagConfig.metaType === 'text') {
            // 🔧 修复：不传递 tagConfig.style 作为 styleOverride，只传递 markdownData.customStyles
            elementInstance = createTextElement(content, finalVariant, {}, styleOverride);
        } else if (tagConfig.metaType === 'button') {
            // 🆕 处理button类型，从markdownData中获取URL和变体信息
            const buttonText = content;
            const buttonUrl = markdownData && markdownData.url ? markdownData.url : '#';
            // 🔧 修复：优先使用markdownData中的variant，回退到tagConfig中的variant
            const buttonVariant = (markdownData && markdownData.variant) ? markdownData.variant : tagConfig.variant;
            elementInstance = createButtonElement(buttonText, buttonUrl, buttonVariant);
        } else if (tagConfig.metaType === 'image') {
            // 🆕 处理image类型，从markdownData中获取URL
            const imageUrl = markdownData && markdownData.url ? markdownData.url : '';
            elementInstance = createBackgroundElement(imageUrl, tagConfig.variant);
        } else if (tagConfig.metaType === 'table') {
            // 🆕 处理table类型，直接创建表格元素（不需要variant）
            elementInstance = createTableElement(content);
        } else if (tagConfig.metaType === 'code') {
            // 🆕 处理code类型，创建代码元素
            const language = markdownData && markdownData.language ? markdownData.language : 'plaintext';
            elementInstance = createCodeElement(content, language);
        } else if (tagConfig.metaType === 'component') {
            // 🆕 处理component类型，引用通用组件配置
            // 从 tagConfig 中获取外部参数（如果有的话）
            const externalParameters = tagConfig.parameters || null;
            elementInstance = createComponentElement(content, tagConfig.variant, markdownData, styleOverride, externalParameters);
        }
        // 可以在这里添加其他元件类型的支持

        if (!elementInstance) {
            return null;
        }

        // 如果标签配置中有 style，需要创建容器来包装元件并应用样式
        if (tagConfig.style) {
            // 🆕 容器使用基础样式，自定义样式已应用到元件级别
            const finalStyle = tagConfig.style;

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
                    containedElementType: tagConfig.metaType,
                    containedElementVariant: finalVariant,
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
                        // width: "100%",
                        boxSizing: "border-box",
                        position: "relative",
                        // ...finalStyle // 容器使用基础样式
                    },
                    classStyle: {
                        ...finalStyle // 容器使用基础样式
                    },
                    className: uniqueClassName,
                    children: [elementInstance] // 包装元件实例
                },
                description: `模板标签容器 - ${tagName}`,
                id,
                events: [{}]
            };

            return containerElement;
        } else {
            // 没有样式，直接返回元件实例
            return elementInstance;
        }
    }

    // 解析嵌套内容
    let children = [];
    if (content && content.trim()) {
        if (tagConfig.type === 'template') {
            // 递归解析嵌套的模板标签
            children = parseTemplateCardContent(content, tagConfig, false, currentMarkdown);
        } else {
            // 解析为普通内容
            const parsedContent = parseMarkdown(content, { currentMarkdown });
            children = parsedContent;
        }
    }

    // 创建模板标签元素
    const templateElement = {
        dataKeys: [],
        name: "layout",
        "name-zh": `模板标签-${tagName}`,
        "file-type": "template",
        theme: "default",
        _metadata: {
            actualType: 'templateTag',
            tagName: tagName,
            isTemplateTag: true,
            isLayout: true,
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
                width: "100%",
                boxSizing: "border-box",
                // "back-width": "100%",
                // "back-height": "auto",
                position: "relative",
                // ...(tagConfig.style || {}) // 应用标签样式
            },
            classStyle: {
                ...(tagConfig.style || {})
            },
            className: uniqueClassName,
            children: children
        },
        description: `模板标签元素 - ${tagName}`,
        id,
        events: [{}]
    };


    return templateElement;
}


// 🆕 创建或合并到现有容器的模板元素, TODO: 需要重构
function createOrMergeTemplateElement(templatePath, content, cardStyleConfig, containerMap, children, existingElement = null, markdownData = null, currentMarkdown = '') {

    // 🔧 验证 templatePath 参数
    if (!templatePath || typeof templatePath !== 'string') {
        // 如果有已存在的元素，直接添加到children中
        if (existingElement) {
            children.push(existingElement);
            return existingElement;
        }

        return null;
    }

    // 解析路径（支持嵌套路径如 'content.title'）
    const pathParts = templatePath.split('.');

    if (pathParts.length === 1) {
        // 简单路径，需要检查是否需要创建容器
        const tagName = pathParts[0];

        if (existingElement) {
            // 如果传入了已解析的元素，需要创建容器来包裹它 
            // 检查是否已经存在该容器
            let containerElement = containerMap.get(tagName);
            if (!containerElement) {
                // 创建新的容器
                containerElement = createTemplateTagElement(tagName, '', cardStyleConfig);
                if (!containerElement) {
                    return null;
                }

                // 将容器添加到children并记录到containerMap
                children.push(containerElement);
                containerMap.set(tagName, containerElement);
            }

            // 将已解析的元素添加到容器中
            if (containerElement.layout && containerElement.layout.children) {
                containerElement.layout.children.push(existingElement);
            }

            return existingElement;
        } else {
            // 否则创建新的模板元素，直接添加到children
            const templateElement = createTemplateTagElement(tagName, content, cardStyleConfig, markdownData, currentMarkdown);
            if (templateElement) {
                children.push(templateElement);
            }
            return templateElement;
        }
    } else if (pathParts.length === 2) {
        // 嵌套路径，需要处理容器合并
        const parentTagName = pathParts[0];
        const childTagName = pathParts[1];

        // 检查父级配置是否存在
        const parentConfig = cardStyleConfig[parentTagName];
        if (!parentConfig) {
            return null;
        }

        // 🆕 检查子级配置是否存在（支持通配符匹配）
        let childConfig = parentConfig[childTagName];
        let actualChildTagName = childTagName;

        // 如果直接匹配失败，尝试通配符匹配
        if (!childConfig) {

            // 在父级配置中查找通配符模式
            for (const [configKey, configValue] of Object.entries(parentConfig)) {
                if (configKey.includes('*')) {
                    const wildcardMatch = extractWildcardMatch(childTagName, configKey);
                    if (wildcardMatch !== null) {
                        childConfig = configValue;
                        actualChildTagName = childTagName; // 保持实际的子元素名称
                        break;
                    }
                }
            }
        }

        if (!childConfig) {
            console.warn(`警告: 未找到子级模板标签 ${parentTagName}.${childTagName} 的配置`);
            return null;
        }

        // 创建子元素
        let childElement;
        if (existingElement) {
            // 如果传入了已解析的元素，直接使用
            childElement = existingElement;
        } else {
            // 否则创建新的模板元素，使用子元素配置
            // 为子元素创建临时配置对象，以便createTemplateTagElement能正确访问
            const tempChildConfig = { [actualChildTagName]: childConfig };
            childElement = createTemplateTagElement(actualChildTagName, content, tempChildConfig, markdownData);
            if (!childElement) {
                return null;
            }
        }

        // 检查是否已经存在该容器
        let parentElement = containerMap.get(parentTagName);
        if (!parentElement) {
            // 创建新的父容器，使用父容器的完整配置
            parentElement = createTemplateTagElement(parentTagName, '', cardStyleConfig);
            if (!parentElement) {
                return null;
            }

            // 将父容器添加到children并记录到containerMap
            children.push(parentElement);
            containerMap.set(parentTagName, parentElement);
        }

        // 将子元素添加到父容器中
        if (parentElement.layout && parentElement.layout.children) {
            parentElement.layout.children.push(childElement);
        }

        return childElement;
    } else if (pathParts.length >= 3) {
        // 🆕 支持三层及以上嵌套路径，如 listContainer.list.item*

        // 递归处理嵌套路径
        let currentContainer = null;
        let currentConfig = cardStyleConfig;

        // 逐层处理每个路径部分
        for (let i = 0; i < pathParts.length - 1; i++) {
            const currentTagName = pathParts[i];

            // 检查当前层的配置
            if (!currentConfig[currentTagName]) {
                console.warn(`警告: 未找到模板标签 ${currentTagName} 的配置`);
                return null;
            }

            // 检查是否已经存在该容器
            const containerKey = pathParts.slice(0, i + 1).join('.');
            let containerElement = containerMap.get(containerKey);

            if (!containerElement) {
                // 创建新的容器
                containerElement = createTemplateTagElement(currentTagName, '', currentConfig, null, currentMarkdown);
                if (!containerElement) {
                    return null;
                }

                // 将容器添加到正确的父级中
                if (currentContainer) {
                    // 添加到父容器中
                    if (currentContainer.layout && currentContainer.layout.children) {
                        currentContainer.layout.children.push(containerElement);
                    }
                } else {
                    // 添加到根级children中
                    children.push(containerElement);
                }

                containerMap.set(containerKey, containerElement);
            }

            // 更新当前容器和配置引用
            currentContainer = containerElement;
            currentConfig = currentConfig[currentTagName];
        }

        // 处理最后一层（实际的子元素）
        const finalTagName = pathParts[pathParts.length - 1];

        // 🆕 检查最终子元素配置（支持通配符匹配）
        let finalConfig = currentConfig[finalTagName];
        let actualFinalTagName = finalTagName;
        let usedWildcardMatch = false;

        // 如果直接匹配失败，尝试通配符匹配
        if (!finalConfig) {

            // 在当前配置中查找通配符模式
            for (const [configKey, configValue] of Object.entries(currentConfig)) {
                if (configKey.includes('*')) {
                    const wildcardMatch = extractWildcardMatch(finalTagName, configKey);
                    if (wildcardMatch !== null) {
                        finalConfig = configValue;
                        actualFinalTagName = finalTagName; // 保持实际的子元素名称
                        usedWildcardMatch = true; // 🔧 标记使用了通配符匹配
                        break;
                    }
                }
            }
        }

        if (!finalConfig) {
            console.warn(`警告: 未找到最终子元素 ${finalTagName} 的配置`);
            return null;
        }

        // 创建最终子元素
        let finalElement;
        if (existingElement) {
            // 如果传入了已解析的元素，直接使用
            finalElement = existingElement;
        } else {
            // 🔧 修复：如果使用了通配符匹配，创建一个临时的配置对象来传递正确的配置
            let tempConfig = currentConfig;
            if (usedWildcardMatch) {
                // 说明使用了通配符匹配，需要创建临时配置
                tempConfig = { ...currentConfig, [actualFinalTagName]: finalConfig };
            }

            // 否则创建新的模板元素
            finalElement = createTemplateTagElement(actualFinalTagName, content, tempConfig, markdownData, currentMarkdown);
            if (!finalElement) {
                return null;
            }
        }

        // 将最终子元素添加到最后一层容器中
        if (currentContainer && currentContainer.layout && currentContainer.layout.children) {
            currentContainer.layout.children.push(finalElement);
        }

        return finalElement;
    } else {
        console.warn(`警告: 不支持的模板路径深度: ${templatePath}`);
        return null;
    }
}

/**
 * 处理表达式，对内容进行转换
 * @param {string} content - 原始内容
 * @param {string} expression - 处理表达式（如 'replace("%", "")'）
 * @returns {string} 处理后的内容
 */
function processExpression(content, expression) {
    if (!expression || !content) {
        return content;
    }
    
    try {
        // 解析 replace 表达式：支持多种格式
        // 格式1: replace("search", "replacement")
        // 格式2: replace('search', 'replacement')
        // 格式3: replace(search, "replacement")
        const replaceMatch = expression.match(/replace\s*\(\s*["']?([^"',)]+)["']?\s*,\s*["']?([^"']*)["']?\s*\)/);
        if (replaceMatch) {
            const [, searchValue, replaceValue] = replaceMatch;
            // 转义特殊字符
            const escapedSearch = searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            return content.replace(new RegExp(escapedSearch, 'g'), replaceValue);
        }
        
        // trim() 表达式
        if (expression.match(/^\s*trim\s*\(\s*\)\s*$/)) {
            return content.trim();
        }
        
        // toLowerCase() 表达式
        if (expression.match(/^\s*toLowerCase\s*\(\s*\)\s*$/)) {
            return content.toLowerCase();
        }
        
        // toUpperCase() 表达式
        if (expression.match(/^\s*toUpperCase\s*\(\s*\)\s*$/)) {
            return content.toUpperCase();
        }
        
        console.warn(`不支持的表达式: ${expression}`);
        return content;
    } catch (error) {
        console.error(`处理表达式时出错: ${expression}`, error);
        return content;
    }
}

/**
 * 提取组件参数值
 * @param {Object} parameterDefinitions - 参数定义对象（来自组件配置的 parameters）
 * @param {Object} markdownData - Markdown数据（包含 type 和 content）
 * @param {string} content - 内容
 * @param {Object} externalParameters - 外部传递的参数值（来自使用方的 parameters）
 * @returns {Object} 参数值对象 { paramName: value }
 */
function extractComponentParameters(parameterDefinitions, markdownData, content, externalParameters = {}) {
    const paramValues = {};
    
    if (!parameterDefinitions) {
        return paramValues;
    }
    
    // 遍历所有参数定义
    for (const [paramName, paramConfig] of Object.entries(parameterDefinitions)) {
        let value = null;
        
        // 处理不同的参数来源
        if (paramConfig.source === 'outer') {
            // 🆕 从外部参数中获取值
            if (externalParameters && externalParameters.hasOwnProperty(paramName)) {
                value = externalParameters[paramName];
            } else if (paramConfig.default !== undefined) {
                // 使用默认值
                value = paramConfig.default;
            } else {
                console.warn(`外部参数 "${paramName}" 未提供，且没有默认值`);
                continue;
            }
        } else if (markdownData && paramConfig.source === markdownData.type) {
            // 从 markdown 内容中提取
            value = content;
            
            // 如果有 expression，应用表达式处理
            if (paramConfig.expression) {
                value = processExpression(value, paramConfig.expression);
            }
        } else {
            // 参数来源不匹配，跳过
            continue;
        }
        
        if (value !== null) {
            paramValues[paramName] = value;
        }
    }
    
    return paramValues;
}

/**
 * 应用参数到样式对象
 * @param {Object} style - 样式对象
 * @param {Object} paramValues - 参数值对象 { paramName: value }
 * @returns {Object} 应用参数后的样式对象
 */
function applyParametersToStyle(style, paramValues) {
    if (!style || !paramValues || Object.keys(paramValues).length === 0) {
        return style;
    }
    
    const processedStyle = {};
    
    for (const [key, value] of Object.entries(style)) {
        if (typeof value === 'string' && value.startsWith('$')) {
            // 替换参数引用
            const paramName = value.substring(1); // 去掉 $ 符号
            if (paramValues.hasOwnProperty(paramName)) {
                processedStyle[key] = paramValues[paramName];
            } else {
                console.warn(`未找到参数: ${paramName}`);
                processedStyle[key] = value;
            }
        } else if (typeof value === 'object' && value !== null) {
            // 递归处理嵌套对象
            processedStyle[key] = applyParametersToStyle(value, paramValues);
        } else {
            processedStyle[key] = value;
        }
    }
    
    return processedStyle;
}

/**
 * 处理required容器：确保必需的样式承载容器被渲染
 * @param {Object} config - 配置对象（可能包含 required 数组）
 * @param {Array} children - 子元素数组，required 容器将被添加到此数组
 * @param {Object} styleConfig - 样式配置对象，用于查找 required 容器的配置
 */
function processRequiredContainers(config, children, styleConfig) {
    if (config.required && Array.isArray(config.required)) {
        config.required.forEach(requiredContainerName => {
            const requiredConfig = config[requiredContainerName];
            if (requiredConfig) {
                // 创建必需的容器元素
                const requiredElement = createTemplateTagElement(requiredContainerName, '', config);
                if (requiredElement) {
                    children.push(requiredElement);
                }
            }
        });
    }
}

// 解析模板卡片内容，TODO: 需要重构
function parseTemplateCardContent(content, cardStyleConfig, returnElements = false, currentMarkdown = '') {
    const lines = content.split('\n');
    const children = [];
    let i = 0;

    // 🆕 检查是否有 markdownMapping 配置
    const hasMarkdownMapping = cardStyleConfig.markdownMapping && Object.keys(cardStyleConfig.markdownMapping).length > 0;

    // 🆕 预解析所有分组配置
    const groupConfigs = [];
    if (hasMarkdownMapping) {
        for (const [key, value] of Object.entries(cardStyleConfig.markdownMapping)) {
            const groupInfo = parseGroupPattern(key);
            if (groupInfo) {
                groupConfigs.push({
                    pattern: groupInfo.elements,
                    templatePath: value,
                    mappingKey: key,
                    groupInfo
                });
            }
        }
    }

    // 🆕 用于跟踪容器，确保相同容器的子元素被合并
    const containerMap = new Map(); // key: containerName, value: containerElement

    // 🆕 用于跟踪列表项计数器
    let listItemCounter = 0;

    while (i < lines.length) {
        const line = lines[i].trim();

        if (!line) {
            i++;
            continue;
        }

        // 🆕 优先检查是否匹配分组模式
        if (groupConfigs.length > 0) {
            const groupMatch = checkGroupStart(line, groupConfigs);
            if (groupMatch) {
                // 处理分组收集
                const groupResult = collectGroupItems(lines, i, groupMatch.groupConfig, cardStyleConfig);
                if (groupResult) {
                    // 处理分组路径：检查是否是通配符路径（如 percentItems.percentItem*）
                    const templatePath = groupMatch.groupConfig.templatePath;
                    if (templatePath.includes('*')) {
                        // 通配符路径：为每个分组项创建独立的子元素
                        const pathParts = templatePath.split('.');
                        const parentPath = pathParts[0]; // percentItems
                        const childPattern = pathParts[1]; // percentItem*
                        const childBaseName = childPattern.replace('*', ''); // percentItem

                        // 首先确保父容器存在
                        let parentContainer = containerMap.get(parentPath);
                        if (!parentContainer) {
                            parentContainer = createTemplateTagElement(parentPath, '', cardStyleConfig);
                            if (parentContainer) {
                                children.push(parentContainer);
                                containerMap.set(parentPath, parentContainer);
                            }
                        }

                        // 为每个分组项创建独立的子元素
                        groupResult.items.forEach((groupItem, index) => {
                            const childName = `${childBaseName}${index + 1}`; // percentItem1, percentItem2, ...
                            const childPath = `${parentPath}.${childName}`;
                            const itemContent = groupItem.rawLines.join('\n');

                            const childElement = createOrMergeTemplateElement(
                                childPath,
                                itemContent,
                                cardStyleConfig,
                                containerMap,
                                children,
                                null,
                                { isGroupItem: true, groupItemIndex: index, groupItem }
                            );

                        });
                    } else {
                        // 普通路径：整体创建分组元素
                        const templateElement = createOrMergeTemplateElement(
                            templatePath,
                            groupResult.content,
                            cardStyleConfig,
                            containerMap,
                            children,
                            null,
                            { isGroup: true, groupItems: groupResult.items, groupConfig: groupMatch.groupConfig }
                        );
                    }

                    // 跳过已处理的行
                    i = groupResult.nextIndex;
                    continue;
                }
            }
        }

        // 🆕 检查 markdown 格式（单独元素处理）
        if (hasMarkdownMapping) {
            const parseResult = parseMarkdownToTemplate(line, cardStyleConfig.markdownMapping, listItemCounter);
            if (parseResult && parseResult.markdownResult) {
                const { markdownResult, newListItemCounter } = parseResult;
                listItemCounter = newListItemCounter;

                // 🆕 特殊处理表格：收集完整的表格内容
                if (markdownResult.type === 'table' && markdownResult.isTableLine) {

                    // 收集所有连续的表格行
                    const tableLines = [line];
                    let j = i + 1;

                    while (j < lines.length) {
                        const nextLine = lines[j].trim();
                        if (!nextLine) {
                            j++;
                            continue; // 跳过空行
                        }

                        // 检查是否还是表格行
                        const nextParseResult = parseMarkdownToTemplate(nextLine, cardStyleConfig.markdownMapping, 0);
                        if (nextParseResult && nextParseResult.markdownResult &&
                            nextParseResult.markdownResult.type === 'table' &&
                            nextParseResult.markdownResult.isTableLine) {
                            tableLines.push(nextLine);
                            j++;
                        } else {
                            break; // 遇到非表格行，停止收集
                        }
                    }

                    // 合并完整的表格内容
                    const completeTableContent = tableLines.join('\n');

                    // 创建表格元素
                    const templateElement = createOrMergeTemplateElement(
                        markdownResult.templatePath,
                        completeTableContent,
                        cardStyleConfig,
                        containerMap,
                        children,
                        null, // existingElement
                        { ...markdownResult, content: completeTableContent } // 传递完整表格内容
                    );

                    // 跳过已处理的表格行
                    i = j;
                    continue;
                }

                // 🆕 特殊处理代码块：收集完整的代码块内容
                if (markdownResult.type === 'code' && markdownResult.isCodeBlockStart) {

                    // 收集代码块内容
                    const codeLines = [line]; // 包含开始标记 ```language
                    let j = i + 1;
                    let foundEnd = false;

                    while (j < lines.length) {
                        const nextLine = lines[j];
                        codeLines.push(nextLine);

                        // 检查是否是代码块结束标记
                        if (nextLine.trim() === '```') {
                            foundEnd = true;
                            j++;
                            break;
                        }
                        j++;
                    }

                    if (!foundEnd) {
                        console.warn(`⚠️ 代码块未找到结束标记，从第${i}行开始`);
                    }

                    // 提取纯代码内容（去除开始和结束的```标记）
                    let pureCodeContent = '';
                    if (codeLines.length >= 2) {
                        // 去除第一行（```language）和最后一行（```）
                        const codeContentLines = codeLines.slice(1);
                        if (codeContentLines[codeContentLines.length - 1].trim() === '```') {
                            codeContentLines.pop(); // 移除最后的 ```
                        }
                        pureCodeContent = codeContentLines.join('\n');
                    }

                    console.log(`📋 收集到完整代码块，共 ${codeLines.length} 行，提取纯代码内容 ${pureCodeContent.length} 字符`);

                    // 创建代码块元素
                    const templateElement = createOrMergeTemplateElement(
                        markdownResult.templatePath,
                        pureCodeContent, // 传递纯代码内容
                        cardStyleConfig,
                        containerMap,
                        children,
                        null, // existingElement
                        { ...markdownResult, content: pureCodeContent, language: markdownResult.language } // 传递纯代码内容和语言信息
                    );

                    // 跳过已处理的代码块行
                    i = j;
                    continue;
                }

                // 🆕 特殊处理图表：收集图表标记后面的表格数据
                if (markdownResult.type === 'chart') {

                    // 图表标记行本身
                    const chartHeaderLine = line;
                    let j = i + 1;
                    const tableLines = [];

                    // 收集后面的表格数据
                    while (j < lines.length) {
                        const nextLine = lines[j].trim();
                        if (!nextLine) {
                            j++;
                            continue; // 跳过空行
                        }

                        // 检查是否是表格行
                        if (nextLine.includes('|')) {
                            const isTableLine = nextLine.match(/^\|.*\|$/) ||
                                nextLine.match(/^[^|]*\|.*\|[^|]*$/) ||
                                nextLine.match(/^[-|\s|:]+$/); // 表格分隔行

                            if (isTableLine) {
                                tableLines.push(nextLine);
                                j++;
                            } else {
                                break; // 遇到非表格行，停止收集
                            }
                        } else {
                            break; // 遇到非表格行，停止收集
                        }
                    }

                    if (tableLines.length > 0) {
                        // 合并完整的图表数据
                        const completeChartContent = `${chartHeaderLine}\n${tableLines.join('\n')}`;
                        // 解析图表数据
                        const chartResult = extractTableOrChartData([chartHeaderLine, ...tableLines], 0);

                        if (chartResult.isChart) {
                            // 创建图表元素
                            try {
                                // 🆕 获取图表的 variant 配置
                                const chartVariant = getChartVariantFromConfig(markdownResult.templatePath, cardStyleConfig);

                                // 🆕 解析图表事件
                                const chartEvents = [];
                                if (chartResult.originalFirstLine) {
                                    const chartId = generateUUID();
                                    const events = parseEventSyntax(chartResult.originalFirstLine, chartId);
                                    chartEvents.push(...events);
                                }

                                const chartElement = createChartElement(chartResult.chartType, '', chartResult.tableData, chartResult.tableContent, chartVariant, chartResult.chartTitle, chartEvents);

                                // 🆕 生成按钮元素（如果需要）
                                let buttonElement = addChartEventButton(chartElement, chartResult.originalFirstLine);

                                // 🆕 用父级layout容器包裹（相对定位，按钮绝对定位）
                                const wrapperLayout = createLayoutElement(
                                    LAYOUT_CONSTANTS.DIRECTION.VERTICAL,
                                    [],
                                    {
                                        variant: 'column',
                                        style: { position: 'relative' }
                                    }
                                );
                                if (buttonElement) {
                                    // 事件绑定与兜底逻辑已在 tableCreators.addChartEventButton 中封装
                                    wrapperLayout.layout.children.push(buttonElement);
                                }
                                wrapperLayout.layout.children.push(chartElement);

                                // 生成SVG图表 - 传递 variant 信息和标题
                                const chartStyleConfig = {
                                    variant: chartVariant,
                                    container: chartElement.layout?.container,
                                    title: chartElement.layout?.title,
                                    legend: chartElement.layout?.legend,
                                    axis: chartElement.layout?.axis
                                };
                                const svgContent = generateChartSvg(chartResult.chartType, chartResult.tableData, chartStyleConfig, chartResult.chartTitle);
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

                                // 使用通配符处理的路径创建模板元素
                                const templateElement = createOrMergeTemplateElement(
                                    markdownResult.templatePath,
                                    completeChartContent,
                                    cardStyleConfig,
                                    containerMap,
                                    children,
                                    wrapperLayout, // 传入包裹容器
                                    { ...markdownResult, chartElement: chartElement, chartData: chartResult }
                                );

                                console.log(`✅ 成功创建图表模板元素: ${markdownResult.chartType} (variant: ${chartVariant})`);
                            } catch (error) {
                                console.error('生成图表时出错:', error);
                                // 创建错误图表元素
                                const errorSvg = `<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100%" height="100%" fill="#fff0f0" />
                    <text x="20" y="30" font-family="sans-serif" font-size="16" fill="#d32f2f">图表生成错误: ${markdownResult.chartType}</text>
                    <text x="20" y="50" font-family="sans-serif" font-size="12" fill="#666">${error.message || '未知错误'}</text>
                  </svg>`;

                                // 🆕 使用辅助函数获取 variant
                                const chartVariant = getChartVariantFromConfig(markdownResult.templatePath, cardStyleConfig);

                                const errorChartElement = createChartElement(markdownResult.chartType, errorSvg, [], completeChartContent, chartVariant);
                                const templateElement = createOrMergeTemplateElement(
                                    markdownResult.templatePath,
                                    completeChartContent,
                                    cardStyleConfig,
                                    containerMap,
                                    children,
                                    errorChartElement,
                                    { ...markdownResult, chartElement: errorChartElement }
                                );
                            }
                        } else {
                            console.warn(`⚠️ 图表数据解析失败: ${markdownResult.chartType}`);
                        }
                    } else {
                        console.warn(`⚠️ 未找到图表 ${markdownResult.chartType} 的表格数据`);
                        // 即使没有数据也创建一个空图表
                        // 🆕 使用辅助函数获取 variant
                        const chartVariant = getChartVariantFromConfig(markdownResult.templatePath, cardStyleConfig);

                        const emptyChartElement = createChartElement(markdownResult.chartType, '', [], chartHeaderLine, chartVariant);
                        const templateElement = createOrMergeTemplateElement(
                            markdownResult.templatePath,
                            chartHeaderLine,
                            cardStyleConfig,
                            containerMap,
                            children,
                            emptyChartElement,
                            { ...markdownResult, chartElement: emptyChartElement }
                        );
                    }

                    // 跳过已处理的行
                    i = j;
                    continue;
                }

                // 🆕 检查是否需要合并到现有容器，传递完整的解析结果
                const templateElement = createOrMergeTemplateElement(
                    markdownResult.templatePath,
                    markdownResult.content,
                    cardStyleConfig,
                    containerMap,
                    children,
                    null, // existingElement
                    markdownResult, // 传递完整的解析结果，包含URL等信息
                    currentMarkdown // 传递原始markdown内容用于事件配置
                );

                i++;
                continue;
            }

            // 🆕 检查是否有 others 映射，用于处理未匹配的内容
            if (cardStyleConfig.markdownMapping.others) {

                // 收集连续的未映射内容
                const collectResult = collectUnmappedMarkdownContent(lines, i, cardStyleConfig.markdownMapping);

                if (collectResult.content.trim()) {

                    // 使用标准 parseMarkdown 解析整块内容
                    const parsedElements = parseMarkdown(collectResult.content, { currentMarkdown });

                    // 将解析后的元素放到 others 指定的容器中
                    for (const element of parsedElements) {

                        // 🔧 验证 others 映射是否存在
                        if (!cardStyleConfig.markdownMapping.others) {
                            continue; // 跳过这个元素
                        }

                        createOrMergeTemplateElement(cardStyleConfig.markdownMapping.others, '', cardStyleConfig, containerMap, children, element, null, currentMarkdown);
                    }
                }

                // 跳过已处理的行
                i = collectResult.endIndex;
                continue;
            }
        }

        // 检查是否为内联模板标签（如 <title>内容</title>）
        const inlineTemplateTagMatch = line.match(/^<(\w+)>(.*?)<\/\1>$/);
        if (inlineTemplateTagMatch) {
            const tagName = inlineTemplateTagMatch[1];
            const tagContent = inlineTemplateTagMatch[2];

            // 创建模板标签元素
            const templateElement = createTemplateTagElement(tagName, tagContent, cardStyleConfig);
            if (templateElement) {
                children.push(templateElement);
            }

            i++;
        } else {
            // 检查是否为块级模板标签（如 <content>...多行内容...</content>）
            const templateTagMatch = line.match(/^<(\w+)>$/);
            if (templateTagMatch) {
                const tagName = templateTagMatch[1];

                // 提取标签内容
                const { tagContent, endIndex } = extractTemplateTag(lines, i, tagName);

                // 创建模板标签元素
                const templateElement = createTemplateTagElement(tagName, tagContent, cardStyleConfig);
                if (templateElement) {
                    children.push(templateElement);
                }

                i = endIndex + 1;
            } else {
                // 🆕 如果有 markdownMapping 且是普通文本，尝试作为段落处理
                if (hasMarkdownMapping && cardStyleConfig.markdownMapping.p) {
                    // 🔧 修复：清理段落符号
                    const cleanedLine = line.replace(/§PARAGRAPH§/g, '');
                    if (cleanedLine.trim()) {
                        // 🆕 使用合并逻辑处理段落
                        createOrMergeTemplateElement(
                            cardStyleConfig.markdownMapping.p,
                            cleanedLine,
                            cardStyleConfig,
                            containerMap,
                            children,
                            null, // existingElement
                            { type: 'p', content: cleanedLine } // markdownData for paragraph
                        );
                    }
                } else if (!hasMarkdownMapping) {
                    // 如果没有 markdownMapping，按普通卡片处理
                    // 🔧 修复：清理段落符号并使用 parseMarkdown 处理（支持超链接等）
                    const cleanedLine = line.replace(/§PARAGRAPH§/g, '');
                    if (cleanedLine.trim()) {
                        // 🆕 使用 parseMarkdown 处理，这样可以正确解析超链接等内容
                        const parsedElements = parseMarkdown(cleanedLine, { currentMarkdown });
                        if (parsedElements && parsedElements.length > 0) {
                            children.push(...parsedElements);
                        } else {
                            // 如果解析失败，回退到创建普通文本元素
                            const textElement = createTextElement(cleanedLine);
                            children.push(textElement);
                        }
                    }
                }
                // 🆕 如果有 markdownMapping 但没有 p 映射，且没有 others 映射，则跳过不处理
                i++;
            }
        }
    }

    // 🆕 处理required容器：确保必需的样式承载容器被渲染
    processRequiredContainers(cardStyleConfig, children, cardStyleConfig);

    if (returnElements) {
        return children;
    }

    return children;
}

// 处理模板路径中的通配符替换
function processTemplatePathWithWildcard(templatePath, wildcardValue) {
    if (!wildcardValue || !templatePath.includes('*')) {
        return templatePath;
    }

    return templatePath.replace(/\*/g, wildcardValue);
}

/**
 * 创建组件元素，支持引用通用组件配置
 * @param {string} content - 组件内容
 * @param {string} variant - 组件变体名称
 * @param {Object} markdownData - Markdown数据
 * @param {Object} styleOverride - 样式覆盖
 * @param {Object} externalParameters - 外部传递的参数（用于 source: 'outer' 的参数）
 * @returns {Object} 组件元素实例
 */
function createComponentElement(content, variant, markdownData = null, styleOverride = null, externalParameters = null) {
    // 获取组件配置
    const componentConfig = DEFAULT_STYLE_CONFIG.component && DEFAULT_STYLE_CONFIG.component[variant];
    
    if (!componentConfig) {
        console.warn(`未找到组件变体 "${variant}" 的配置`);
        // 返回一个基础的文本元素作为回退
        return createTextElement(content);
    }
    
    // 🆕 如果组件配置有 metaType（如 text, button 等），说明这是一个元件引用，而不是模板组件
    // 应该直接创建对应的元件，如果有 style 则用容器包装
    if (componentConfig.metaType) {
        // 🆕 提取参数（如果有 parameters 配置）
        let paramValues = {};
        if (componentConfig.parameters) {
            paramValues = extractComponentParameters(
                componentConfig.parameters, 
                markdownData, 
                content,
                externalParameters || {}
            );
        }
        
        // 合并样式：componentConfig.style + styleOverride
        let finalStyle = {
            ...(componentConfig.style || {}),
            ...(styleOverride || {})
        };
        
        // 🆕 应用参数到样式
        if (Object.keys(paramValues).length > 0) {
            finalStyle = applyParametersToStyle(finalStyle, paramValues);
        }
        
        let elementInstance = null;
        
        // 根据 metaType 创建对应的元件（不传递样式，样式由容器承载）
        if (componentConfig.metaType === 'text') {
            elementInstance = createTextElement(content, componentConfig.variant, {}, null);
        } else if (componentConfig.metaType === 'button') {
            const buttonUrl = markdownData?.url || '#';
            const buttonVariant = componentConfig.variant;
            elementInstance = createButtonElement(content, buttonUrl, buttonVariant, '', null);
        } else if (componentConfig.metaType === 'image') {
            const imageUrl = markdownData?.url || '';
            elementInstance = createBackgroundElement(imageUrl, componentConfig.variant, null);
        }
        // 可以添加更多类型...
        
        // 如果有样式配置，创建容器来包装元件
        if (elementInstance && Object.keys(finalStyle).length > 0) {
            const id = generateUUID();
            const uniqueClassName = `component-${variant}-${id}`;
            
            const containerElement = {
                dataKeys: [],
                name: "layout",
                "name-zh": `组件容器-${variant}`,
                "file-type": "template",
                theme: "default",
                _metadata: {
                    actualType: 'component',
                    variant: variant,
                    isComponent: true,
                    componentName: variant,
                    isElementContainer: true,
                    containedElementType: componentConfig.metaType,
                    containedElementVariant: componentConfig.variant,
                    // 🆕 存储参数值，供调试使用
                    parameters: paramValues
                },
                layout: {
                    style: {
                        display: "{layout.state.display.flex}",
                        layoutMode: "{layout.direction.VERTICAL}",
                        layoutWrap: "{layout.wrap.NO_WRAP}",
                        boxSizing: "border-box",
                        height: "auto",
                        position: "relative"
                    },
                    classStyle: finalStyle, // 应用自定义样式
                    className: uniqueClassName,
                    children: [elementInstance]
                },
                description: `组件容器 - ${variant}`,
                id: id,
                events: [{}]
            };
            
            return containerElement;
        }
        
        // 如果没有样式，直接返回元件
        return elementInstance;
    }
    
    // 🆕 提取组件参数（如果有 parameters 配置）
    let paramValues = {};
    if (componentConfig.parameters) {
        paramValues = extractComponentParameters(
            componentConfig.parameters, 
            markdownData, 
            content,
            externalParameters || {} // 传递外部参数
        );
    }
    
    // 🆕 应用参数到样式
    let processedStyle = componentConfig.style || {};
    if (Object.keys(paramValues).length > 0) {
        processedStyle = applyParametersToStyle(processedStyle, paramValues);
    }
    
    // 创建组件容器元素
    const componentElement = {
        dataKeys: [],
        name: "layout",
        "name-zh": `组件容器-${variant}`,
        "file-type": "template",
        theme: "default",
        _metadata: {
            actualType: 'component',
            variant: variant,
            isComponent: true,
            componentName: variant,
            // 🆕 存储参数值，供调试使用
            parameters: paramValues
        },
        layout: {
            children: [],
            style: processedStyle,
            className: `component-${variant}`,
            classStyle: {}
        }
    };
    
    // 应用样式覆盖
    if (styleOverride) {
        Object.assign(componentElement.layout.style, styleOverride);
    }
    
    // 处理组件的子元素映射
    if (componentConfig.markdownMapping && content) {
        // 如果有 markdownData，使用它来确定内容类型
        if (markdownData && markdownData.type) {
            // 根据 markdownData.type 查找对应的映射
            const targetPath = componentConfig.markdownMapping[markdownData.type];
            
            if (targetPath) {
                // 直接创建对应的元素，传递原始的 markdownData
                const containerMap = new Map();
                const targetElement = createOrMergeTemplateElement(
                    targetPath, 
                    content, 
                    componentConfig, 
                    containerMap, 
                    componentElement.layout.children,
                    null, // existingElement
                    markdownData // 传递原始的 markdownData
                );
            } else {
                console.warn(`组件 "${variant}" 的 markdownMapping 中没有定义 "${markdownData.type}" 的映射`);
            }
            
            // 🆕 处理required容器：确保必需的样式承载容器被渲染
            processRequiredContainers(componentConfig, componentElement.layout.children, componentConfig);
        } else {
            // 如果没有 markdownData，尝试使用 parseTemplateCardContent 解析完整的 markdown 内容
            const componentChildren = parseTemplateCardContent(content, componentConfig, true);
            
            if (componentChildren && componentChildren.length > 0) {
                componentElement.layout.children.push(...componentChildren);
            }
        }
    } else if (content) {
        // 如果没有markdownMapping，直接创建文本元素
        const textElement = createTextElement(content);
        componentElement.layout.children.push(textElement);
    }
    
    return componentElement;
}

export {
    isCardTag,
    extractWildcardMatch,
    extractCardBlock,
    findWildcardMatch,
    createCardElement,
    processTemplatePathWithWildcard,
    createComponentElement
}