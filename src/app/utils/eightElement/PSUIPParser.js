import { EVENT_NAME, EVENT_CONFIG } from './eventConfig.js';
import { LAYOUT_CONSTANTS, DEFAULT_STYLE_CONFIG } from './styleConfig.js';
import { getIcon } from '../icons/index.js';
import { escapeHtml, getMarkedInstance } from './util.js';
import resolveToken from '../tokens/resolveToken.js';
import { isTableOrChartData, extractTableOrChartData, processTableOrChartData } from './creators/tableCreators.js';
import { extractMarkdownCodeBlock, createCodeElement, isMarkdownCodeBlock } from './creators/codeCreators.js';
import { createLayoutElement, extractLayoutBlock, isLayoutTag, createHeadingLayout, createEightElementRoot } from './creators/layoutCreators.js';

import { extractCardBlock, createCardElement, isCardTag, isComponentTag, extractComponentBlock, findWildcardMatch, processTemplatePathWithWildcard } from './creators/cardCreators.js';
import { isListItem, processListItemAndRichText, createTextElement, createHeadingBlockContainer, createHyperlinkElement } from './creators/textCreators.js';

import { parseButtonVariant, createButtonElement, createVerticalButtonLayout } from './creators/buttonCreators.js';
import { createBackgroundElement } from './creators/backgroundCreators.js';
import { createIconElement } from './creators/iconCreators.js';
import { isTabTag, extractTabBlock, createTabElement } from './creators/tabCreators.js';

// 检测是否为引用文本
function isQuoteText(line) {
    return line.trim().match(/^>\s*(.*)$/);
}``

// 检测是否为图标标签
function isIconTag(line) {
    // 匹配 <icon>iconname</icon> 或 <icon:variant>iconname</icon:variant> 格式
    const iconMatch = line.match(/^<icon(?::(\w+))?>([^<>]+)<\/icon(?::\w+)?>$/);
    if (iconMatch) {
        return {
            isIconTag: true,
            variant: iconMatch[1] || 'medium', // 默认为 medium 变体
            iconName: iconMatch[2].trim()
        };
    }

    return { isIconTag: false };
}

// 解析事件语法 [event:eventName] 并返回事件配置
function parseEventSyntax(text, elementId, currentMarkdown = '') {
    // 🆕 更新事件模式以支持带参数的事件：[event:eventName(param1,param2)]
    const eventPattern = /\[event:(\w+)(?:\(([^)]*)\))?\]/g;
    const events = [];
    let match;

    while ((match = eventPattern.exec(text)) !== null) {
        const eventName = match[1];
        const eventParams = match[2]; // 获取括号内的参数

        // 从eventConfig中获取对应的事件配置
        if (EVENT_CONFIG[eventName]) {
            const eventConfig = JSON.parse(JSON.stringify(EVENT_CONFIG[eventName])); // 深拷贝

            // 设置EventTargetId
            eventConfig.EventTargetId = elementId;

            // 特殊处理edit事件的markdown参数
            if (eventName === EVENT_NAME.EDIT && currentMarkdown) {
                eventConfig.parameters.markdown = currentMarkdown;
            }

            // 🆕 特殊处理chart_changed事件的参数
            if (eventName === EVENT_NAME.CHART_CHANGED && eventParams) {
                // 解析参数：chart_changed(barh,bar,pie) -> ["barh", "bar", "pie"]
                const chartTypes = eventParams.split(',').map(param => param.trim());
                eventConfig.parameters.chartTypes = chartTypes;
            }

            // 🆕 特殊处理tab_changed事件的参数
            if (eventName === EVENT_NAME.TAB_CHANGED && eventParams) {
                // 解析参数：tab_changed(tab1) -> "tab1"
                const tabKey = eventParams.trim();
                eventConfig.parameters.tabKey = tabKey;
            }

            events.push(eventConfig);
        } else {
            console.warn(`⚠️ 未找到事件配置: ${eventName}`);
        }
    }

    return events;
}

// 移除文本中的事件语法标记
function removeEventSyntax(text) {
    // 首先检查是否是完整的事件按钮语法：[event:eventName][buttonText](url)
    const fullEventMatch = text.match(/^\[event:\w+(?:\([^)]*\))?\]\s*\[([^\]]+)\]\(([^)]+)\)$/); 
    if (fullEventMatch) {
        // 如果是完整的事件按钮语法，返回按钮文本部分
        return fullEventMatch[1].trim();
    }

    // 🆕 清理带参数的事件标记：[event:eventName(param1,param2)]
    return text.replace(/\[event:\w+(?:\([^)]*\))?\]/g, '').trim();
}

// 🆕 辅助函数：处理内联图标文本，将图标语法转换为内联 SVG
function processInlineIconText(text) {

    // 将图标标识替换为内联 SVG
    const processedText = text.replace(/\[icon:([^\]]+)\]/g, (match, iconPath) => {

        // 使用真实的图标系统获取 SVG
        const iconSvg = getIcon(iconPath);

        if (iconSvg) {

            // 为内联显示优化 SVG 样式
            const inlineSvg = iconSvg.replace(
                '<svg',
                '<svg width="1em" height="1em" style="display: inline; vertical-align: middle; margin-right: 4px;"'
            )
            // .replace(/stroke="black"/g, 'stroke="currentColor"');

            return inlineSvg;
        }

        // 如果没有找到图标，返回占位符
        return `<span style="display: inline-flex; align-items: center; color: #6b7280; font-size: 12px; background: #f3f4f6; padding: 2px 6px; border-radius: 4px; margin-right: 4px;">🔲 ${iconPath}</span>`;
    });

    return processedText;
}

// 预处理Markdown文本，优化KaTeX解析
function prepareMarkdownForKatex(text) {
    if (!text || typeof text !== 'string') return '';

    let preppedMarkdown = text;

    // 确保在单美元符号前有空格，避免误识别
    preppedMarkdown = preppedMarkdown.replace(/(\S)(\$)(?!\$)/g, (match, charBefore, dollarSign) => {
        if (charBefore === '$') { // 避免修改$$对
            return match;
        }
        return charBefore + ' ' + dollarSign; // 添加空格: "word$" -> "word $"
    });

    // 确保换行在marked中被正确处理
    preppedMarkdown = preppedMarkdown.replace(/\\n/g, '  \\n');


    return preppedMarkdown;
}

// 🆕 为包含SVG的段落标签添加flexbox样式
function addFlexboxToParagraphsWithSVG(htmlContent) {
    if (!htmlContent || typeof htmlContent !== 'string') return htmlContent;

    // 使用正则表达式查找包含SVG的段落标签
    // 匹配 <p>...</p> 其中包含 <svg 标签
    return htmlContent.replace(
        /<p([^>]*)>([^<]*<svg[^>]*>.*?)<\/p>/g,
        (match, pAttributes, pContent) => {
            // 检查p标签是否已经有style属性
            if (pAttributes.includes('style=')) {
                // 如果已有style属性，添加flexbox样式
                return `<p${pAttributes.replace(
                    /style="([^"]*)"/,
                    (match, styleValue) => {
                        // 确保style值不以分号结尾，然后添加新的样式
                        const cleanStyle = styleValue.trim().replace(/;$/, '');
                        return `style="${cleanStyle}; display: flex; align-items: center;"`;
                    }
                )}>${pContent}</p>`;
            } else {
                // 如果没有style属性，添加新的style属性
                return `<p${pAttributes} style="display: flex; align-items: center;">${pContent}</p>`;
            }
        }
    );
}


// 🆕 解析自定义样式标签，如 <percentValue color={color.success.green5}>#### 15%</percentValue>
function parseCustomStyleTag(line) {
    // 匹配格式: <tagName attr1={value1} attr2={value2}>content</tagName>
    const customTagRegex = /<(\w+)(\s+[^>]*)?>([^<]+)<\/\1>/;
    const match = line.match(customTagRegex);

    if (!match) {
        return null;
    }

    const tagName = match[1];
    const attributesStr = match[2] || '';
    const content = match[3].trim();

    // 🔧 修复：只处理带属性的标签，纯模板标签（无属性）不在这里处理
    // 这样可以避免模板标签被错误地当作自定义样式标签处理
    if (!attributesStr.trim()) {
        return null; // 没有属性，不是自定义样式标签
    }

    // 解析属性
    const customStyles = {};
    if (attributesStr.trim()) {
        // 匹配属性格式: attr={value}
        const attrRegex = /(\w+)=\{([^}]+)\}/g;
        let attrMatch;
        while ((attrMatch = attrRegex.exec(attributesStr)) !== null) {
            const attrName = attrMatch[1];
            let attrValue = attrMatch[2];

            // 🔧 修复：如果属性值看起来像设计令牌（包含点号分隔的路径），且没有花括号，则添加花括号
            // 检查是否是特殊值（URL、普通CSS值等），这些不需要token解析
            const isSpecialValue = attrValue.startsWith('url(') ||
                attrValue.startsWith('#') ||
                attrValue.match(/^\d+px$/) ||
                attrValue.match(/^\d+%$/) ||
                attrValue === 'none' ||
                attrValue === 'auto' ||
                attrValue.startsWith('linear-gradient') ||
                attrValue.startsWith('rgb(') ||
                attrValue.startsWith('rgba(');

            // 如果值看起来像设计令牌路径（包含点号，如 color.success.green6），且不是特殊值，则添加花括号
            if (!isSpecialValue && attrValue.includes('.') && !attrValue.startsWith('{') && !attrValue.endsWith('}')) {
                attrValue = `{${attrValue}}`;
            }

            // 将属性名转换为CSS样式属性
            const cssProperty = attrName === 'color' ? 'color' : attrName;
            customStyles[cssProperty] = attrValue;
        }
    }

    return {
        variant: tagName,
        content: content,
        customStyles: customStyles
    };
}


// 提取完整的引用块
function extractQuoteBlock(lines, startIndex) {

    const quoteLines = [];
    let i = startIndex;

    // 收集所有连续的引用行
    while (i < lines.length) {
        const line = lines[i];
        const quoteMatch = line.trim().match(/^>\s*(.*)$/);

        if (quoteMatch) {
            // 提取引用内容（去除 > 符号）
            quoteLines.push(quoteMatch[1]);
            i++;
        } else if (line.trim() === '') {
            // 空行继续检查下一行是否还是引用
            i++;
            if (i < lines.length && isQuoteText(lines[i])) {
                quoteLines.push(''); // 在引用内容中保留空行
                continue;
            } else {
                // 如果下一行不是引用，则引用块结束
                break;
            }
        } else {
            // 非引用行，引用块结束
            break;
        }
    }

    return {
        quoteContent: quoteLines.join('\n').trim(),
        endIndex: i - 1
    };
}


// 解析 markdown 格式并映射到模板路径, TODO: 需要重构
function parseMarkdownToTemplate(line, markdownMapping, listItemCounter = 0) {
    let currentListItemCounter = listItemCounter;

    // 🆕 首先检查是否是自定义样式标签
    const customStyleResult = parseCustomStyleTag(line);
    if (customStyleResult) {
        // 解析内容部分的markdown格式（如 #### 15%）
        const contentResult = parseMarkdownToTemplate(customStyleResult.content, markdownMapping, currentListItemCounter);
        if (contentResult && contentResult.markdownResult) {
            // 将自定义样式附加到解析结果
            return {
                markdownResult: {
                    ...contentResult.markdownResult,
                    customVariant: customStyleResult.variant,
                    customStyles: customStyleResult.customStyles
                },
                newListItemCounter: contentResult.newListItemCounter
            };
        }
    }

    // 🆕 优先检查列表项格式（支持单独的li:n映射）
    const listItemInfo = isListItem(line);

    if (listItemInfo.isList) {
        // 增加列表项计数器
        currentListItemCounter++;

        // 构造列表项映射键，例如 'li:1', 'li:2'
        const listItemKey = `li:${currentListItemCounter}`;

        // 🆕 先尝试通配符匹配 li:*
        const wildcardResult = findWildcardMatch(listItemKey, markdownMapping);

        if (wildcardResult.matched) {
            const processedTemplatePath = processTemplatePathWithWildcard(
                wildcardResult.templatePath,
                wildcardResult.wildcard || currentListItemCounter.toString()
            );

            console.log(`🎯 列表项通配符匹配: ${listItemKey} -> ${processedTemplatePath}`, {
                wildcard: wildcardResult.wildcard,
                pattern: wildcardResult.pattern,
                originalTemplate: wildcardResult.templatePath,
                processedTemplate: processedTemplatePath
            });
            return {
                markdownResult: {
                    type: 'li',
                    listItemNumber: currentListItemCounter,
                    templatePath: processedTemplatePath,
                    content: listItemInfo.content.trim(),
                    wildcard: wildcardResult.wildcard,
                    pattern: wildcardResult.pattern
                },
                newListItemCounter: currentListItemCounter
            };
        }

        // 然后尝试精确匹配
        if (markdownMapping[listItemKey]) {
            console.log(`🎯 使用专门的列表项映射: ${listItemKey} -> ${markdownMapping[listItemKey]}`);
            return {
                markdownResult: {
                    type: 'li',
                    listItemNumber: currentListItemCounter,
                    templatePath: markdownMapping[listItemKey],
                    content: listItemInfo.content.trim()
                },
                newListItemCounter: currentListItemCounter
            };
        } else {
            console.log(`⚪ 无专门的列表项映射: ${listItemKey}，将使用默认处理`);
            // 如果没有专门的li:n映射，重置计数器，让它走通用的ul处理
            currentListItemCounter = listItemCounter;
        }
    }

    // 检查标题格式
    const h1Match = line.match(/^#\s+(.+)$/);
    if (h1Match && markdownMapping.h1) {
        return {
            markdownResult: {
                type: 'h1',
                templatePath: markdownMapping.h1,
                content: h1Match[1].trim()
            },
            newListItemCounter: currentListItemCounter
        };
    }

    const h2Match = line.match(/^##\s+(.+)$/);
    if (h2Match && markdownMapping.h2) {
        return {
            markdownResult: {
                type: 'h2',
                templatePath: markdownMapping.h2,
                content: h2Match[1].trim()
            },
            newListItemCounter: currentListItemCounter
        };
    }

    const h3Match = line.match(/^###\s+(.+)$/);
    if (h3Match && markdownMapping.h3) {
        return {
            markdownResult: {
                type: 'h3',
                templatePath: markdownMapping.h3,
                content: h3Match[1].trim()
            },
            newListItemCounter: currentListItemCounter
        };
    }

    const h4Match = line.match(/^####\s+(.+)$/);
    if (h4Match && markdownMapping.h4) {
        return {
            markdownResult: {
                type: 'h4',
                templatePath: markdownMapping.h4,
                content: h4Match[1].trim()
            },
            newListItemCounter: currentListItemCounter
        };
    }

    const h5Match = line.match(/^#####\s+(.+)$/);
    if (h5Match && markdownMapping.h5) {
        return {
            markdownResult: {
                type: 'h5',
                templatePath: markdownMapping.h5,
                content: h5Match[1].trim()
            },
            newListItemCounter: currentListItemCounter
        };
    }

    const h6Match = line.match(/^######\s+(.+)$/);
    if (h6Match && markdownMapping.h6) {
        return {
            markdownResult: {
                type: 'h6',
                templatePath: markdownMapping.h6,
                content: h6Match[1].trim()
            },
            newListItemCounter: currentListItemCounter
        };
    }

    // 检查列表格式
    if (listItemInfo.isList && markdownMapping.ul) {
        return {
            markdownResult: {
                type: 'ul',
                templatePath: markdownMapping.ul,
                content: listItemInfo.content.trim()
            },
            newListItemCounter: currentListItemCounter
        };
    }

    // 检查有序列表格式
    const orderedListMatch = line.match(/^\d+\.\s+(.+)$/);
    if (orderedListMatch && markdownMapping.ol) {
        return {
            markdownResult: {
                type: 'ol',
                templatePath: markdownMapping.ol,
                content: orderedListMatch[1].trim()
            },
            newListItemCounter: currentListItemCounter
        };
    }

    // 🆕 检查事件语法格式 [event:eventName][text](url) - 创建为 primary 按钮
    const eventLinkMatch = line.match(/^\[event:\w+\]\s*\[([^\]]+)\]\(([^)]+)\)$/);
    if (eventLinkMatch) {
        const primaryButtonMapping = markdownMapping['button:primary'];
        if (primaryButtonMapping) {
            return {
                markdownResult: {
                    type: 'button',
                    variant: 'primary',
                    templatePath: primaryButtonMapping,
                    content: eventLinkMatch[1].trim(), // 按钮文本
                    url: eventLinkMatch[2].trim(),     // 按钮URL
                    originalText: line.trim()          // 🆕 保存原始完整文本，包含事件语法
                },
                newListItemCounter: currentListItemCounter
            };
        }
    }

    // 🆕 检查链接格式 [text](url) - 根据情况决定是超链接还是按钮
    const linkMatch = line.match(/^\[([^\]]+)\]\(([^)]*)\)$/);
    if (linkMatch) {
        const linkText = linkMatch[1].trim();
        const linkUrl = linkMatch[2].trim();
        
        // 🆕 判断是否有 URL
        const hasUrl = linkUrl && linkUrl.length > 0;
        
        // 🆕 没有 URL -> 创建按钮
        if (!hasUrl) {
            const primaryButtonMapping = markdownMapping['button:primary'];
            if (primaryButtonMapping) {
                return {
                    markdownResult: {
                        type: 'button',
                        variant: 'primary',
                        templatePath: primaryButtonMapping,
                        content: linkText,
                        url: '#'  // 默认 URL
                    },
                    newListItemCounter: currentListItemCounter
                };
            }
        }
        
        // 🆕 有 URL -> 优先创建超链接（不依赖 markdownMapping）
        // 如果 markdownMapping 中有定义，使用它；否则返回 null 让主解析循环处理
        const hyperlinkMapping = markdownMapping['a'] || markdownMapping['hyperlink'];
        if (hyperlinkMapping) {
            return {
                markdownResult: {
                    type: 'a',
                    templatePath: hyperlinkMapping,
                    content: linkText,
                    url: linkUrl
                },
                newListItemCounter: currentListItemCounter
            };
        }
        
        // 🔧 如果没有超链接映射，返回 null 让主解析循环直接创建超链接元素
        // 这样超链接就不会依赖于 markdownMapping 的配置
        return null;
    }

    // 检查带变体的按钮格式 [variant][text](url)
    const buttonVariantMatch = line.match(/^\[(\w+)\]\s*\[([^\]]+)\]\(([^)]+)\)$/);
    if (buttonVariantMatch) {
        const variant = buttonVariantMatch[1];
        const buttonMappingKey = `button:${variant}`; // 构造按钮映射键，如 'button:primary'
        const buttonTemplatePath = markdownMapping[buttonMappingKey];

        if (buttonTemplatePath) {
            return {
                markdownResult: {
                    type: 'button',
                    variant: variant,
                    templatePath: buttonTemplatePath,
                    content: buttonVariantMatch[2].trim(), // 按钮文本
                    url: buttonVariantMatch[3].trim()      // 按钮链接
                },
                newListItemCounter: currentListItemCounter
            };
        }
    }

    // 检查图片格式 ![alt](url)
    const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);

    if (imgMatch && markdownMapping.img) {
        return {
            markdownResult: {
                type: 'img',
                templatePath: markdownMapping.img,
                content: imgMatch[1].trim(), // 图片alt文本
                url: imgMatch[2].trim()      // 图片URL
            },
            newListItemCounter: currentListItemCounter
        };
    }

    // 🆕 检查代码块格式 ```language
    const codeBlockMatch = line.match(/^```(\w+)?$/);
    if (codeBlockMatch) {
        const language = codeBlockMatch[1] || 'plaintext';
        const templatePath = markdownMapping.code || markdownMapping.p || markdownMapping.others;
        return {
            markdownResult: {
                type: 'code',
                language: language,
                templatePath: templatePath, // 优先使用 code 映射，其次 p 映射，最后 others 映射
                content: line.trim(),
                isCodeBlockStart: true
            },
            newListItemCounter: currentListItemCounter
        };
    }

    // 🆕 检查代码块结束标记 ```
    if (line.trim() === '```') {
        const templatePath = markdownMapping.code || markdownMapping.p || markdownMapping.others;
        return {
            markdownResult: {
                type: 'code',
                templatePath: templatePath, // 优先使用 code 映射，其次 p 映射，最后 others 映射
                content: line.trim(),
                isCodeBlockEnd: true
            },
            newListItemCounter: currentListItemCounter
        };
    }

    // 🆕 检查引用格式 > content
    const blockquoteMatch = line.match(/^>\s*(.+)$/);
    if (blockquoteMatch && markdownMapping.blockquote) {
        return {
            markdownResult: {
                type: 'blockquote',
                templatePath: markdownMapping.blockquote,
                content: blockquoteMatch[1].trim()
            },
            newListItemCounter: currentListItemCounter
        };
    }

    // 🆕 检查表格格式 | 表头 | 表头 |
    if (line.includes('|') && markdownMapping.table) {
        const trimmedLine = line.trim();
        // 检查是否是表格行（包含竖线分隔符）
        // 匹配标准markdown表格格式：|列1|列2| 或 列1|列2|列3
        const isTableLine = trimmedLine.match(/^\|.*\|$/) ||
            trimmedLine.match(/^[^|]*\|.*\|[^|]*$/) ||
            trimmedLine.match(/^[-|\s|:]+$/); // 表格分隔行如 |---|---|

        if (isTableLine) {
            return {
                markdownResult: {
                    type: 'table',
                    templatePath: markdownMapping.table,
                    content: trimmedLine, // 返回原始表格行
                    isTableLine: true
                },
                newListItemCounter: currentListItemCounter
            };
        }
    }

    // 🆕 检查图表格式 [chart:type|title|sort] 或 [chart:type|title] 或 [chart:type] (新增标题和排序支持)
    const chartMatch = line.match(/^\[chart:(.+?)\]/);
    if (chartMatch) {
        const fullChartSpec = chartMatch[1];
        // 🆕 解析图表类型、可选标题和可选排序参数
        const parts = fullChartSpec.split('|').map(s => s.trim());
        let chartType = parts[0];
        // 🆕 统一命名：将 TreeMind 兼容为 tree_mind
        if (chartType === 'TreeMind') chartType = 'tree_mind';
        const chartTitle = parts[1] || null;
        const sortOrder = parts[2] || null; // asc 或 desc

        const chartKey = `chart:${chartType}`;

        // 先尝试通配符匹配
        const wildcardResult = findWildcardMatch(chartKey, markdownMapping);
        if (wildcardResult.matched) {
            const processedTemplatePath = processTemplatePathWithWildcard(
                wildcardResult.templatePath,
                wildcardResult.wildcard || chartType
            );

            return {
                markdownResult: {
                    type: 'chart',
                    chartType: chartType,
                    chartTitle: chartTitle, // 🆕 添加图表标题
                    sortOrder: sortOrder, // 🆕 添加排序参数
                    templatePath: processedTemplatePath,
                    content: line.trim(),
                    wildcard: wildcardResult.wildcard,
                    pattern: wildcardResult.pattern
                },
                newListItemCounter: currentListItemCounter
            };
        }

        // 如果没有通配符匹配，尝试精确匹配（兼容旧逻辑）
        if (markdownMapping[chartKey] || markdownMapping.chart) {
            const templatePath = markdownMapping[chartKey] || markdownMapping.chart;

            return {
                markdownResult: {
                    type: 'chart',
                    chartType: chartType,
                    chartTitle: chartTitle, // 🆕 添加图表标题
                    sortOrder: sortOrder, // 🆕 添加排序参数
                    templatePath: templatePath,
                    content: line.trim()
                },
                newListItemCounter: currentListItemCounter
            };
        }
    }

    // 🆕 检查自定义项目格式 item:n (新增功能)
    const itemMatch = line.match(/^item:(\d+)\s+(.+)$/);
    if (itemMatch) {
        const itemNumber = itemMatch[1];
        const itemContent = itemMatch[2];
        const itemKey = `item:${itemNumber}`;

        // 尝试通配符匹配
        const wildcardResult = findWildcardMatch(itemKey, markdownMapping);
        if (wildcardResult.matched) {
            const processedTemplatePath = processTemplatePathWithWildcard(
                wildcardResult.templatePath,
                wildcardResult.wildcard || itemNumber
            );

            return {
                markdownResult: {
                    type: 'item',
                    itemNumber: parseInt(itemNumber),
                    templatePath: processedTemplatePath,
                    content: itemContent.trim(),
                    wildcard: wildcardResult.wildcard,
                    pattern: wildcardResult.pattern
                },
                newListItemCounter: currentListItemCounter
            };
        }

        // 如果没有通配符匹配，尝试精确匹配
        if (markdownMapping[itemKey]) {
            return {
                markdownResult: {
                    type: 'item',
                    itemNumber: parseInt(itemNumber),
                    templatePath: markdownMapping[itemKey],
                    content: itemContent.trim()
                },
                newListItemCounter: currentListItemCounter
            };
        }
    }

    // 🆕 检查段落格式（非空行且不匹配其他格式）
    if (line.trim() && markdownMapping.p) {
        // 🔧 修复：清理段落符号
        const cleanedContent = line.trim().replace(/§PARAGRAPH§/g, '');
        if (cleanedContent) {
            return {
                markdownResult: {
                    type: 'p',
                    templatePath: markdownMapping.p,
                    content: cleanedContent
                },
                newListItemCounter: currentListItemCounter
            };
        }
    }

    // 如果没有匹配到任何 markdown 格式，返回 null
    return null;
}

// 处理文本，包括Markdown、KaTeX公式和内联图标
function processText(text) {
    if (!text || typeof text !== 'string') return '';

    try {
        // 🔧 修复：清理段落符号
        const cleanedText = text.replace(/§PARAGRAPH§/g, '');

        // 🆕 处理内联图标语法 [icon:path]，将其转换为SVG
        const textWithIcons = processInlineIconText(cleanedText);

        // 预处理文本，优化KaTeX解析
        const preparedText = prepareMarkdownForKatex(textWithIcons);

        // 使用markedInstance处理Markdown和KaTeX
        const parseResult = getMarkedInstance().parse(preparedText);

        // 🆕 为包含SVG的段落标签添加flexbox样式
        const processedResult = addFlexboxToParagraphsWithSVG(parseResult);

        if (processedResult.includes('class="katex-error"')) {
            const titleMatch = processedResult.match(/title="([^"]*)"/);
            const errorMessage = titleMatch ? titleMatch[1] : null;
            console.error('KaTeX解析错误:', errorMessage);

            // 🔧 修复：即使有KaTeX错误，也要返回解析结果
            return processedResult;
        } else {
            return processedResult;
        }

    } catch (error) {
        console.error("处理文本时出错:", error);
        // 🔧 修复：出错时返回转义后的原文本，而不是undefined，同时清理段落符号
        const cleanedText = text.replace(/§PARAGRAPH§/g, '');
        const errorMessage = `<span style="color:red;">公式或Markdown解析错误: ${escapeHtml(error.message)}</span>`;
        return errorMessage + escapeHtml(cleanedText).replace(/\\n/g, '<br>');
    }
}


function processMarkdownWithMathProtection(markdown) {
    // 第一步：提取并保护数学公式
    const mathBlocks = [];
    let mathIndex = 0;

    // 提取行内数学公式 $...$（非贪婪匹配，避免跨行）
    let processedMarkdown = markdown.replace(/\$([^$\n]+?)\$/g, (match) => {
        const placeholder = `§MATH_INLINE_${mathIndex}§`;
        mathBlocks[mathIndex] = match;
        mathIndex++;
        return placeholder;
    });

    // 提取块级数学公式 $$...$$（可以跨行）
    processedMarkdown = processedMarkdown.replace(/\$\$([\s\S]*?)\$\$/g, (match) => {
        const placeholder = `§MATH_BLOCK_${mathIndex}§`;
        mathBlocks[mathIndex] = match;
        mathIndex++;
        return placeholder;
    });

    // 第二步：规范化换行符
    const normalizedMarkdown = processedMarkdown.replace(/\r\n/g, '\n');

    // 第三步：处理段落分隔符（现在数学公式已经被保护了）
    const paragraphProcessed = normalizedMarkdown
        .replace(/\n\n+/g, '\n§PARAGRAPH§\n')  // 标记段落分隔符
        .replace(/\\n\\n+/g, '\n§PARAGRAPH§\n')
        .replace(/\\n/g, '\n');

    // 第四步：还原数学公式
    let result = paragraphProcessed;
    for (let i = 0; i < mathBlocks.length; i++) {
        result = result.replace(`§MATH_INLINE_${i}§`, mathBlocks[i]);
        result = result.replace(`§MATH_BLOCK_${i}§`, mathBlocks[i]);
    }

    return result;
}


// 改进Markdown解析功能，支持列表和富文本，TODO: 需要重构
function parseMarkdown(markdown, options = {}) {
    const { disableButtonGrouping = false, disableSiblingGrouping = false, currentMarkdown: passedMarkdown } = options;
    const currentMarkdown = passedMarkdown || markdown; // 优先使用传入的完整markdown，否则使用当前部分
    // 首先规范化换行符处理
    // 把所有的\r\n转换为\n
    const normalizedMarkdown = markdown.replace(/\r\n/g, '\n');

    const processedMarkdown = processMarkdownWithMathProtection(normalizedMarkdown);

    // 分割Markdown文本为行（保留空行标记）
    const lines = processedMarkdown.split('\n');

    // 解析结果将存储在这个数组中
    const elements = [];

    // 存储一级标题块，用于后续流式布局
    const h1Blocks = [];

    // 用于跟踪当前的嵌套级别
    const stack = [{ level: 0, elements: elements }];

    // 当前处理的一级标题块
    let currentH1Block = null;

    // 用于收集连续的按钮元素
    let consecutiveButtons = [];

    // 缓存当前处理的文本块
    let currentTextBlock = '';

    // 标记当前正在处理的列表状态
    let inList = false;
    let listItems = [];


    // 创建一个函数来查找完整表格的起始行
    function findTableStartLines(lines) {
        const tableStarts = [];

        for (let i = 0; i < lines.length - 1; i++) {
            // 使用新的检测逻辑检查是否为表格
            const { isData, isChart } = isTableOrChartData(lines[i]);
            if (isData) {
                tableStarts.push(i);
            }
        }

        return tableStarts;
    }

    // 查找所有表格的起始行
    const allLines = lines.map(line => line);
    const tableStarts = findTableStartLines(allLines);

    const markedLines = [];
    for (let i = 0; i < lines.length; i++) {
        markedLines.push({
            line: lines[i],
            isTable: false,
            tableContent: null,
            isTableStart: false
        });
    }

    // 处理每个表格
    for (const startIndex of tableStarts) {
        // 提取表格内容，使用新的提取函数
        const result = extractTableOrChartData(allLines, startIndex);
        const { tableContent, endIndex } = result;

        if (tableContent) {

            // 标记第一行为表格开始，并存储完整表格内容
            markedLines[startIndex].isTable = true;
            markedLines[startIndex].tableContent = tableContent;
            markedLines[startIndex].isTableStart = true;

            // 标记其余表格行
            for (let j = startIndex + 1; j <= endIndex; j++) {
                if (j < markedLines.length) {
                    markedLines[j].isTable = true;
                }
            }
        }
    }

    // 处理每一行
    for (let i = 0; i < markedLines.length; i++) {
        const { line, isTable, tableContent, isTableStart } = markedLines[i];
        const trimmedLine = line.trim();

        // 🔧 修复：跳过完全空白的行
        if (!trimmedLine) {
            continue;
        }

        // 检查是否为段落分隔符
        if (trimmedLine === '§PARAGRAPH§') {
            // 处理之前累积的内容
            flushTextBlock();

            // 如果正在处理列表，结束列表
            if (inList && listItems.length > 0) {
                // 创建一个垂直布局来容纳列表项，明确指定左对齐
                const listLayout = createLayoutElement(
                    LAYOUT_CONSTANTS.DIRECTION.VERTICAL,
                    listItems,
                    {
                        alignItems: LAYOUT_CONSTANTS.ALIGN.X.MIN,
                        counterAxisAlign: LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.MIN
                    }
                );

                // 添加到当前堆栈的末尾元素的children中
                stack[stack.length - 1].elements.push(listLayout);

                // 重置列表状态
                inList = false;
                listItems = [];
            }

            continue;
        }

        // 检查是否为表格或图表数据
        const { isData, isChart, chartType } = isTableOrChartData(trimmedLine);

        if (isData) {
            // 处理之前累积的内容
            flushTextBlock();
            flushConsecutiveButtons();

            // 提取表格/图表数据
            const result = extractTableOrChartData(
                markedLines.map(item => item.line),
                i
            );

            // 处理表格/图表数据
            const endIndex = processTableOrChartData(result, stack);

            // 跳过已处理的行
            i = endIndex;
            continue;
        }

        // 处理代码块
        if (isMarkdownCodeBlock(trimmedLine)) {
            // 处理之前累积的内容
            flushTextBlock();
            flushConsecutiveButtons();

            // 提取代码块内容和语言
            const { codeContent, language, endIndex } = extractMarkdownCodeBlock(
                markedLines.map(item => item.line),
                i
            );

            // 创建代码元素
            const codeElement = createCodeElement(codeContent, language);
            stack[stack.length - 1].elements.push(codeElement);

            // 跳过已处理的代码块行
            i = endIndex;
            continue;
        }

        // 处理布局标签
        const layoutTagInfo = isLayoutTag(trimmedLine);
        if (layoutTagInfo.isLayoutTag && !layoutTagInfo.isClosing) {

            // 处理之前累积的内容
            flushTextBlock();
            flushConsecutiveButtons();

            // 如果正在处理列表，先结束列表
            if (inList && listItems.length > 0) {
                const listLayout = createLayoutElement(
                    LAYOUT_CONSTANTS.DIRECTION.VERTICAL,
                    listItems,
                    {
                        alignItems: LAYOUT_CONSTANTS.ALIGN.X.MIN,
                        counterAxisAlign: LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.MIN
                    }
                );
                stack[stack.length - 1].elements.push(listLayout);
                inList = false;
                listItems = [];
            }

            // 提取布局标签内容
            const { layoutContent, variant, attributes, endIndex } = extractLayoutBlock(
                markedLines.map(item => item.line),
                i
            );

            // 🆕 特殊处理根layout标签
            if (variant === 'root') {

                // 对于根layout，我们需要应用属性到现有的根布局
                // 递归解析根布局内的内容（如果有）
                if (layoutContent.trim()) {
                    const rootChildren = parseMarkdown(layoutContent, {
                        disableButtonGrouping: true,
                        disableSiblingGrouping: false,
                        currentMarkdown
                    });

                    // 将解析的内容添加到当前堆栈
                    rootChildren.forEach(child => {
                        stack[stack.length - 1].elements.push(child);
                    });
                }

                // 🆕 保存根layout的属性信息，在创建根对象时会用到
                if (!options.rootAttributes) {
                    options.rootAttributes = {};
                }
                Object.assign(options.rootAttributes, attributes);
            } else {
                // 递归解析布局标签内的内容
                if (layoutContent.trim()) {
                    const layoutChildren = parseMarkdown(layoutContent, {
                        disableButtonGrouping: true,
                        disableSiblingGrouping: variant === 'row',  // 🔧 只在 row 布局中禁用同级标题分组
                        currentMarkdown
                    });

                    // 根据变体确定布局方向
                    let direction = LAYOUT_CONSTANTS.DIRECTION.VERTICAL; // 默认垂直
                    let alignItems = LAYOUT_CONSTANTS.ALIGN.X.MIN;
                    let counterAxisAlign = LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.MIN;

                    if (variant === 'row') {
                        direction = LAYOUT_CONSTANTS.DIRECTION.HORIZONTAL;
                        // changed center to stretch
                        // alignItems = LAYOUT_CONSTANTS.ALIGN.X.CENTER;
                        alignItems = 'stretch';
                        // alignItems = 'flex-start';
                        counterAxisAlign = LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.CENTER;
                    } else if (variant === 'column') {
                        direction = LAYOUT_CONSTANTS.DIRECTION.VERTICAL;
                        alignItems = LAYOUT_CONSTANTS.ALIGN.X.MIN;
                        counterAxisAlign = LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.MIN;
                    }

                    // 🔧 创建稳定的内容种子用于生成稳定ID
                    const contentSeed = `${variant}-${layoutContent}`;
                    const position = `line-${i}`;

                    // 创建布局容器，传递属性
                    const layoutContainer = createLayoutElement(
                        direction,
                        layoutChildren,
                        {
                            variant: variant,
                            alignItems: alignItems,
                            counterAxisAlign: counterAxisAlign,
                            contentSeed: contentSeed,
                            position: position,
                            attributes: attributes // 🆕 传递属性
                        }
                    );

                    // 🔧 确保元数据正确保存了variant信息
                    if (layoutContainer._metadata) {
                        layoutContainer._metadata.variant = variant;
                        layoutContainer._metadata.originalVariant = variant; // 保存原始variant
                        layoutContainer._metadata.isLayoutTag = true; // 标记这是来自layout标签的
                    }

                    stack[stack.length - 1].elements.push(layoutContainer);
                }
            }

            // 跳过已处理的布局标签行
            i = endIndex;
            continue;
        }

        // 处理卡片标签
        const cardTagInfo = isCardTag(trimmedLine);
        if (cardTagInfo.isCardTag && !cardTagInfo.isClosing) {
            console.log(`发现卡片标签，行号: ${i}，变体: ${cardTagInfo.variant}`);

            // 处理之前累积的内容
            flushTextBlock();
            flushConsecutiveButtons();

            // 如果正在处理列表，先结束列表
            if (inList && listItems.length > 0) {
                const listLayout = createLayoutElement(
                    LAYOUT_CONSTANTS.DIRECTION.VERTICAL,
                    listItems,
                    {
                        alignItems: LAYOUT_CONSTANTS.ALIGN.X.MIN,
                        counterAxisAlign: LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.MIN
                    }
                );
                stack[stack.length - 1].elements.push(listLayout);
                inList = false;
                listItems = [];
            }

            // 提取卡片标签内容
            const { cardContent, variant, attributes, attributeMeta, rawTag, endIndex } = extractCardBlock(
                markedLines.map(item => item.line),
                i
            );

            // 创建卡片元素
            const cardElement = createCardElement(
                cardContent,
                variant,
                attributes,
                currentMarkdown,
                {
                    rawTag,
                    attributeMeta
                }
            );


            stack[stack.length - 1].elements.push(cardElement);

            // 跳过已处理的卡片标签行
            i = endIndex;
            continue;
        }

        // 处理组件标签（如 <simpleCard>）
        const componentTagInfo = isComponentTag(trimmedLine);
        if (componentTagInfo.isComponentTag && !componentTagInfo.isClosing) {

            // 处理之前累积的内容
            flushTextBlock();
            flushConsecutiveButtons();

            // 如果正在处理列表，先结束列表
            if (inList && listItems.length > 0) {
                const listLayout = createLayoutElement(
                    LAYOUT_CONSTANTS.DIRECTION.VERTICAL,
                    listItems,
                    {
                        alignItems: LAYOUT_CONSTANTS.ALIGN.X.MIN,
                        counterAxisAlign: LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.MIN
                    }
                );
                stack[stack.length - 1].elements.push(listLayout);
                inList = false;
                listItems = [];
            }

            // 提取组件标签内容
            const { componentContent, componentName, attributes, endIndex } = extractComponentBlock(
                markedLines.map(item => item.line),
                i
            );

            // 🔧 修复：组件需要特殊处理，因为它们在 component 配置下，不是 card 配置
            // 创建一个模拟的 card 元素结构来包装组件
            const componentConfig = DEFAULT_STYLE_CONFIG.component && DEFAULT_STYLE_CONFIG.component[componentName];
            if (componentConfig) {
                // 使用 createCardElement，但传入完整的配置作为样式
                const componentElement = createCardElement(componentContent, componentName, attributes, currentMarkdown);
                
                // 修正元素的配置来源为 component
                if (componentElement && componentElement._metadata) {
                    componentElement._metadata.isComponent = true;
                    componentElement._metadata.configSource = 'component';
                }
                
                stack[stack.length - 1].elements.push(componentElement);
            } else {
                console.warn(`组件 ${componentName} 的配置未找到`);
            }

            // 跳过已处理的组件标签行
            i = endIndex;
            continue;
        }

        // 处理选项卡标签
        const tabTagInfo = isTabTag(trimmedLine);
        if (tabTagInfo.isTabTag && !tabTagInfo.isClosing) {
            console.log(`发现选项卡标签，行号: ${i}`);

            // 处理之前累积的内容
            flushTextBlock();
            flushConsecutiveButtons();

            // 如果正在处理列表，先结束列表
            if (inList && listItems.length > 0) {
                const listLayout = createLayoutElement(
                    LAYOUT_CONSTANTS.DIRECTION.VERTICAL,
                    listItems,
                    {
                        alignItems: LAYOUT_CONSTANTS.ALIGN.X.MIN,
                        counterAxisAlign: LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.MIN
                    }
                );
                stack[stack.length - 1].elements.push(listLayout);
                inList = false;
                listItems = [];
            }

            // 提取选项卡标签内容
            const { tabContent, attributes, endIndex } = extractTabBlock(
                markedLines.map(item => item.line),
                i
            );

            // 创建选项卡元素
            const tabElement = createTabElement(tabContent, attributes, currentMarkdown);

            stack[stack.length - 1].elements.push(tabElement);

            // 跳过已处理的选项卡标签行
            i = endIndex;
            continue;
        }

        // 处理引用文本
        if (isQuoteText(trimmedLine)) {

            // 处理之前累积的内容
            flushTextBlock();
            flushConsecutiveButtons();

            // 如果正在处理列表，先结束列表
            if (inList && listItems.length > 0) {
                const listLayout = createLayoutElement(
                    LAYOUT_CONSTANTS.DIRECTION.VERTICAL,
                    listItems,
                    {
                        alignItems: LAYOUT_CONSTANTS.ALIGN.X.MIN,
                        counterAxisAlign: LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.MIN
                    }
                );
                stack[stack.length - 1].elements.push(listLayout);
                inList = false;
                listItems = [];
            }

            // 提取引用块内容
            const { quoteContent, endIndex } = extractQuoteBlock(
                markedLines.map(item => item.line),
                i
            );

            // 创建引用文本元素，使用 'quote' 样式变体
            const quoteElement = createTextElement(quoteContent, 'quote');
            stack[stack.length - 1].elements.push(quoteElement);

            // 跳过已处理的引用块行
            i = endIndex;
            continue;
        }

        // 解析标题
        const headingMatch = trimmedLine.match(/^(#{1,6})\s+(.*?)$/);
        if (headingMatch) {
            // 处理之前累积的内容
            flushTextBlock();
            flushConsecutiveButtons();

            // 如果正在处理列表，先结束列表
            if (inList && listItems.length > 0) {
                // 创建一个垂直布局来容纳列表项，明确指定左对齐
                const listLayout = createLayoutElement(
                    LAYOUT_CONSTANTS.DIRECTION.VERTICAL,
                    listItems,
                    {
                        alignItems: LAYOUT_CONSTANTS.ALIGN.X.MIN,
                        counterAxisAlign: LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.MIN
                    }
                );

                // 添加到当前堆栈的末尾元素的children中
                stack[stack.length - 1].elements.push(listLayout);

                // 重置列表状态
                inList = false;
                listItems = [];
            }

            const level = headingMatch[1].length;
            const content = headingMatch[2].trim();

            // 如果是一级标题，创建新的一级标题块
            if (level === 1) {
                // 如果已经有一个当前的一级标题块，将其添加到h1Blocks中
                if (currentH1Block) {
                    h1Blocks.push(currentH1Block);
                }

                // 🔧 修复：在创建新标题块之前，保存根级别的现有元素
                const rootElements = stack[0].elements; // 获取根级别的元素

                // 创建新的一级标题布局
                const newHeadingLayout = createHeadingLayout(content, [], level);

                // 🔧 修复：将根级别的现有元素添加到新标题块的开头
                if (rootElements.length > 0) {
                    // 将根级别元素添加到标题块的children数组开头
                    newHeadingLayout.layout.children.unshift(...rootElements);
                    // 清空根级别元素，避免重复
                    rootElements.length = 0;
                }

                // 创建新的一级标题块
                currentH1Block = newHeadingLayout;

                // 重置栈，只保留根级别
                while (stack.length > 1) {
                    stack.pop();
                }

                // 将新的嵌套层级添加到栈中
                stack.push({ level, elements: newHeadingLayout.layout.children });
            } else {
                // 对于非一级标题，找到正确的父级嵌套层级
                while (stack.length > 1 && stack[stack.length - 1].level >= level) {
                    stack.pop();
                }

                // 创建新的嵌套层级，传递标题级别
                const newHeadingLayout = createHeadingLayout(content, [], level);

                // 🆕 检查是否禁用同级标题分组（如在布局标签内）
                if (disableSiblingGrouping) {
                    // 在布局标签内，直接添加标题，由布局标签控制方向
                    stack[stack.length - 1].elements.push(newHeadingLayout);
                } else {
                    // 🆕 检查同级标题分组逻辑
                    const parentElements = stack[stack.length - 1].elements;

                    // 查找父容器中是否已经有同级标题
                    const existingSiblingHeading = parentElements.find(element =>
                        element._metadata?.actualType === 'layout' &&
                        element._metadata?.headingLevel === level &&
                        !element._metadata?.isSiblingGroup  // 不是同级组合容器本身
                    );

                    // 查找是否已经有同级标题组合容器
                    const existingSiblingGroup = parentElements.find(element =>
                        element._metadata?.actualType === 'layout' &&
                        element._metadata?.isSiblingGroup === true &&
                        element._metadata?.headingLevel === level
                    );

                    if (existingSiblingHeading && !existingSiblingGroup) {
                        // 🔧 第一次遇到同级标题：创建同级标题组合容器

                        // 从父容器中移除已存在的同级标题
                        const siblingIndex = parentElements.indexOf(existingSiblingHeading);
                        parentElements.splice(siblingIndex, 1);

                        // 🔧 为同级标题组合创建稳定ID
                        const siblingContentSeed = `sibling-h${level}-${existingSiblingHeading.id}-${newHeadingLayout.id}`;
                        const siblingPosition = `sibling-group-${level}`;

                        // 创建同级标题组合容器
                        const siblingGroupContainer = createLayoutElement(
                            LAYOUT_CONSTANTS.DIRECTION.VERTICAL,
                            [existingSiblingHeading, newHeadingLayout],
                            {
                                alignItems: LAYOUT_CONSTANTS.ALIGN.X.MIN,
                                counterAxisAlign: LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.MIN,
                                variant: 'column',
                                contentSeed: siblingContentSeed,
                                position: siblingPosition
                            }
                        );

                        // 🏷️ 标记为同级标题组合容器
                        siblingGroupContainer._metadata = {
                            ...siblingGroupContainer._metadata,
                            actualType: 'layout',
                            variant: 'column',
                            isSiblingGroup: true,
                            headingLevel: level,
                            isLayout: true
                        };

                        // 将同级标题组合容器添加到父容器
                        parentElements.push(siblingGroupContainer);

                    } else if (existingSiblingGroup) {
                        // 🔧 已有同级标题组合容器：添加到现有容器
                        existingSiblingGroup.layout.children.push(newHeadingLayout);
                    } else {
                        // 🔧 首个标题或无同级标题：正常添加
                        parentElements.push(newHeadingLayout);
                    }
                }

                // 将新的嵌套层级添加到栈中
                stack.push({ level, elements: newHeadingLayout.layout.children });
            }

            continue;
        }

        // 检查是否为列表项或包含富文本的行
        const richTextResult = processListItemAndRichText(trimmedLine);

        if (richTextResult.processed) {
            // 处理之前累积的文本块
            flushTextBlock();

            // 如果是列表项
            if (richTextResult.element.layout.style.listStyleType) {
                // 标记我们正在处理列表
                inList = true;

                // 添加到列表项数组
                listItems.push(richTextResult.element);
            }
            // 如果不是列表项，直接添加到当前元素栈
            else {
                // 如果之前有列表，先处理列表
                if (inList && listItems.length > 0) {
                    // 创建一个垂直布局来容纳列表项，明确指定左对齐
                    const listLayout = createLayoutElement(
                        LAYOUT_CONSTANTS.DIRECTION.VERTICAL,
                        listItems,
                        {
                            alignItems: LAYOUT_CONSTANTS.ALIGN.X.MIN,
                            counterAxisAlign: LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.MIN
                        }
                    );
                    stack[stack.length - 1].elements.push(listLayout);

                    // 重置列表状态
                    inList = false;
                    listItems = [];
                }

                // 将处理后的元素添加到栈
                stack[stack.length - 1].elements.push(richTextResult.element);
            }

            continue;
        }

        // 整行是图片 ![alt](url)
        // 🔧 修复：改进图片检测逻辑，增加调试信息
        const isImageLine = trimmedLine.match(/^!\[.*?\]\(.*?\)$/);
        const hasMultipleLinks = trimmedLine.match(/^!\[.*?\]\(.*?\).*?\[.*?\]\(.*?\)/);


        // 🔧 修复：更宽松的图片检测逻辑
        if (trimmedLine.includes('![') && trimmedLine.includes('](') && trimmedLine.includes(')')) {
            const basicImagePattern = /!\[([^\]]*)\]\(([^)]+)\)/;
            const imgMatch = trimmedLine.match(basicImagePattern);

            if (imgMatch && !hasMultipleLinks) {
                flushTextBlock();
                flushConsecutiveButtons();

                // 🔧 修复：提取图片信息并创建完整的图片元素
                const imgAlt = imgMatch[1].trim();
                const imgUrl = imgMatch[2].trim();

                // 创建带有完整信息的背景元素
                const backgroundElement = createBackgroundElement(imgUrl, 'normal');

                // 🆕 添加图片的alt信息到元数据中
                if (backgroundElement._metadata) {
                    backgroundElement._metadata.alt = imgAlt;
                }

                stack[stack.length - 1].elements.push(backgroundElement);
                console.log(`✅ 图片元素已添加到栈中`);

                continue;
            }
        }

        // 检查是否有多个链接或混合内容
        if (trimmedLine.includes('[') && trimmedLine.includes('](') && trimmedLine.includes(')')) {
            console.log(`🔍 检测到可能的链接内容: "${trimmedLine}"`);

            // 首先检查是否是按钮类型标记格式
            const buttonVariantResult = parseButtonVariant(trimmedLine);

            if (buttonVariantResult.hasVariant) {
                // 处理带类型标记的按钮
                flushTextBlock();

                console.log(`发现按钮类型标记: variant="${buttonVariantResult.variant}", 文本="${buttonVariantResult.text}", URL="${buttonVariantResult.url}"`);

                // 🆕 传入原始完整文本用于事件解析，同时传入提取的按钮文本
                const buttonElement = createButtonElement(trimmedLine, buttonVariantResult.url, buttonVariantResult.variant, currentMarkdown, buttonVariantResult.text);
                console.log(`按钮ID: ${buttonElement.id}, 名称: ${buttonElement.name}, 样式: ${buttonVariantResult.variant}`);
                consecutiveButtons.push(buttonElement);

                continue;
            }

            // 如果该行不仅仅只有一个链接（即前后有其他文本），视为混合内容行
            const multiLinkMatch = trimmedLine.match(/\[([^\]]+)\]\(([^)]+)\)/g);
            const linkPattern = /^\[([^\]]+)\]\(([^)]+)\)$/;
            const isLinkLine = linkPattern.test(trimmedLine);

            // 如果不是纯链接行，则当作混合内容处理
            if (!isLinkLine) {
                flushTextBlock();
                flushConsecutiveButtons();

                const processedLayout = processMixedContent(trimmedLine);
                stack[stack.length - 1].elements.push(processedLayout);

                continue;
            }

            // 🆕 如果只有一个链接且占据整行，根据情况决定是超链接还是按钮
            if (multiLinkMatch && multiLinkMatch.length === 1 && isLinkLine) {
                flushTextBlock();

                // 🆕 支持空括号的匹配：[text]()
                const singleLinkMatch = multiLinkMatch[0].match(/\[([^\]]+)\]\(([^)]*)\)/);
                if (singleLinkMatch) {
                    const linkText = singleLinkMatch[1];
                    const linkUrl = singleLinkMatch[2];
                    
                    // 🆕 检查是否有事件语法
                    const hasEvent = trimmedLine.includes('[event:');
                    
                    // 🆕 判断是否有 URL
                    const hasUrl = linkUrl && linkUrl.trim().length > 0;
                    
                    console.log(`🔗 链接解析: 文本="${linkText}", URL="${linkUrl}", 有事件=${hasEvent}, 有URL=${hasUrl}`);
                    
                    // 🆕 有事件 OR 没有 URL -> 创建按钮
                    if (hasEvent || !hasUrl) {
                        console.log(`  → 创建按钮（${hasEvent ? '有事件' : '无 URL'}）`);
                        const buttonElement = createButtonElement(trimmedLine, linkUrl || '#', 'primary', currentMarkdown);
                        consecutiveButtons.push(buttonElement);
                    } 
                    // 🆕 有 URL 且无事件 -> 创建超链接
                    else {
                        console.log(`  → 创建超链接`);
                        const hyperlinkElement = createHyperlinkElement(linkText, linkUrl, 'hyperlink');
                        console.log(`  → 超链接ID: ${hyperlinkElement.id}`);
                        
                        // 🆕 超链接作为文本元素处理，不添加到按钮组
                        flushConsecutiveButtons();
                        stack[stack.length - 1].elements.push(hyperlinkElement);
                    }

                    continue;
                }
            }
        }

        // 检测图标标签
        const iconTagInfo = isIconTag(trimmedLine);
        if (iconTagInfo.isIconTag) {
            console.log(`发现图标标签，行号: ${i}，图标名称: ${iconTagInfo.iconName}，变体: ${iconTagInfo.variant}`);

            // 处理之前累积的内容
            flushTextBlock();
            flushConsecutiveButtons();

            // 如果正在处理列表，先结束列表
            if (inList && listItems.length > 0) {
                const listLayout = createLayoutElement(
                    LAYOUT_CONSTANTS.DIRECTION.VERTICAL,
                    listItems,
                    {
                        alignItems: LAYOUT_CONSTANTS.ALIGN.X.MIN,
                        counterAxisAlign: LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.MIN
                    }
                );
                stack[stack.length - 1].elements.push(listLayout);
                inList = false;
                listItems = [];
            }

            // 创建图标元素，使用从标签解析出的变体
            const iconElement = createIconElement(iconTagInfo.iconName, iconTagInfo.variant);

            console.log(`🔧 创建图标元素: ID=${iconElement.id}, 图标名称=${iconTagInfo.iconName}, 变体=${iconTagInfo.variant}`);

            stack[stack.length - 1].elements.push(iconElement);

            continue;
        }

        // 检查是否包含内联图标语法 [icon:path]，但不包含其他复杂元素
        if (trimmedLine.includes('[icon:') && trimmedLine.includes(']') &&
            !trimmedLine.includes('](') && !trimmedLine.includes('![')) {
            console.log(`🔍 检测到包含内联图标的纯文本: "${trimmedLine}"`);

            // 处理之前累积的文本块
            flushTextBlock();
            flushConsecutiveButtons();

            // 处理包含内联图标的文本，将图标直接嵌入文本内容中
            const processedText = processInlineIconText(trimmedLine);
            const textElement = createTextElement(processedText);
            stack[stack.length - 1].elements.push(textElement);

            continue;
        }

        // 普通文本行
        if (trimmedLine !== '') {
            // 🔧 修复：清理段落符号
            const cleanedLine = trimmedLine.replace(/§PARAGRAPH§/g, '');
            if (cleanedLine) {
                if (currentTextBlock) {
                    currentTextBlock += '\n' + cleanedLine;
                } else {
                    currentTextBlock = cleanedLine;
                }
            }
        }
    }

    // 确保处理完所有累积的内容
    flushTextBlock();
    flushConsecutiveButtons();

    // 处理最后可能遗留的列表项
    if (inList && listItems.length > 0) {
        // 创建一个垂直布局来容纳列表项，明确指定左对齐
        const listLayout = createLayoutElement(
            LAYOUT_CONSTANTS.DIRECTION.VERTICAL,
            listItems,
            {
                alignItems: LAYOUT_CONSTANTS.ALIGN.X.MIN,
                counterAxisAlign: LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.MIN
            }
        );
        stack[stack.length - 1].elements.push(listLayout);
    }

    // 如果有当前的一级标题块，将其添加到h1Blocks中
    if (currentH1Block) {
        h1Blocks.push(currentH1Block);
    }

    // 如果有多个一级标题块，创建流式布局并将它们包装起来
    if (h1Blocks.length > 1) {
        // 标记是多标题布局的上下文
        const isMultiTitleLayout = true;

        // 将每个一级标题块包装在容器中，设置最小宽度
        // 当多标题并排时，标题应该左对齐
        const wrappedH1Blocks = h1Blocks.map(block => {
            // 标题文本应该在多标题布局中左对齐
            if (block && block.layout && block.layout.children && block.layout.children.length > 0) {
                // 查找标题文本元素
                const headingText = block.layout.children[0];
                if (headingText && headingText.name === "text") {
                    // 修改标题文本为左对齐
                    if (headingText.layout && headingText.layout.style) {
                        headingText.layout.style.textAlign = "left";
                    }

                    // 修改文本容器样式
                    if (headingText.layout.text_body && headingText.layout.text_body.style) {
                        headingText.layout.text_body.style.textAlign = "left";
                    }

                    if (headingText.layout.text_hyperlink && headingText.layout.text_hyperlink.style) {
                        headingText.layout.text_hyperlink.style.textAlign = "left";
                    }
                }
            }

            return createHeadingBlockContainer(block);
        });

        // 创建流式布局容器
        const flexLayout = createFlexWrapLayout(wrappedH1Blocks);

        // 返回流式布局
        return [flexLayout];
    } else if (h1Blocks.length === 1) {
        // 如果只有一个一级标题块，直接返回
        // 这种情况下标题应该居中对齐
        return [h1Blocks[0]];
    }

    // 如果没有一级标题块，返回原始元素
    return elements;
    // 辅助函数：处理文本块
    function flushTextBlock() {
        if (currentTextBlock) {
            // 在处理文本块之前，移除所有内部的段落标记
            const cleanedTextBlock = currentTextBlock.replace(/§PARAGRAPH§/g, '\n').trim();

            if (cleanedTextBlock) { // 确保清理后仍有内容
                // 检查文本块是否包含富文本或列表项
                const lines = cleanedTextBlock.split('\n');

                // 如果只有一行，尝试处理富文本
                if (lines.length === 1) {
                    const singleCleanedLine = lines[0].trim();
                    if (singleCleanedLine) {
                        const richTextResult = processListItemAndRichText(singleCleanedLine);

                        if (richTextResult.processed) {
                            // 如果是列表项
                            if (richTextResult.element.layout.style.listStyleType) {
                                inList = true;
                                listItems.push(richTextResult.element);
                            }
                            // 如果不是列表项，直接添加到当前元素栈
                            else {
                                if (inList && listItems.length > 0) {
                                    // 🔧 生成稳定的内容种子，使用列表内容而不是ID
                                    const listTexts = listItems.map(item => {
                                        if (item.font?.fontsize?.default?.content) {
                                            return item.font.fontsize.default.content.slice(0, 15);
                                        }
                                        return 'listitem';
                                    }).join('|');
                                    const listHash = listTexts.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) & 0xfffff, 0);
                                    const listContentSeed = `list-items-${listTexts}-count${listItems.length}`;
                                    const listPosition = `vertical-list-hash${listHash}`;

                                    const listLayout = createLayoutElement(
                                        LAYOUT_CONSTANTS.DIRECTION.VERTICAL,
                                        listItems,
                                        {
                                            alignItems: LAYOUT_CONSTANTS.ALIGN.X.MIN,
                                            counterAxisAlign: LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.MIN,
                                            contentSeed: listContentSeed,
                                            position: listPosition
                                        }
                                    );
                                    stack[stack.length - 1].elements.push(listLayout);
                                    inList = false;
                                    listItems = [];
                                }
                                stack[stack.length - 1].elements.push(richTextResult.element);
                            }
                        } else {
                            // 如果没有富文本格式，创建普通文本元素
                            const textElement = createTextElement(singleCleanedLine);
                            stack[stack.length - 1].elements.push(textElement);
                        }
                    }
                }
                // 如果有多行，为每行单独处理
                else {
                    // 🔧 生成稳定的内容种子，添加文本块哈希
                    const textHash = cleanedTextBlock.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) & 0xfffff, 0);
                    const contentSeed = `multi-text-${cleanedTextBlock.slice(0, 30)}-lines${lines.length}`;
                    const position = `vertical-text-hash${textHash}`;

                    const textLayout = createLayoutElement(
                        LAYOUT_CONSTANTS.DIRECTION.VERTICAL,
                        [],
                        {
                            alignItems: LAYOUT_CONSTANTS.ALIGN.X.MIN,
                            counterAxisAlign: LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.MIN,
                            contentSeed: contentSeed,
                            position: position
                        }
                    );

                    for (const line of lines) {
                        const cleanedLine = line.trim();
                        if (cleanedLine === '') continue;

                        const richTextResult = processListItemAndRichText(cleanedLine);

                        if (richTextResult.processed) {
                            if (richTextResult.element.layout.style.listStyleType) {
                                inList = true;
                                listItems.push(richTextResult.element);
                            }
                            else {
                                textLayout.layout.children.push(richTextResult.element);
                            }
                        } else {
                            const textElement = createTextElement(cleanedLine);
                            textLayout.layout.children.push(textElement);
                        }
                    }

                    if (textLayout.layout.children.length > 0) {
                        stack[stack.length - 1].elements.push(textLayout);
                    }

                    if (inList && listItems.length > 0) {
                        // 🔧 生成稳定的内容种子，使用列表内容而不是ID
                        const listTexts = listItems.map(item => {
                            if (item.font?.fontsize?.default?.content) {
                                return item.font.fontsize.default.content.slice(0, 15);
                            }
                            return 'listitem';
                        }).join('|');
                        const listHash = listTexts.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) & 0xfffff, 0);
                        const listContentSeed = `multiline-list-${listTexts}-count${listItems.length}`;
                        const listPosition = `vertical-list-multiline-hash${listHash}`;

                        const listLayout = createLayoutElement(
                            LAYOUT_CONSTANTS.DIRECTION.VERTICAL,
                            listItems,
                            {
                                alignItems: LAYOUT_CONSTANTS.ALIGN.X.MIN,
                                counterAxisAlign: LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.MIN,
                                contentSeed: listContentSeed,
                                position: listPosition
                            }
                        );
                        stack[stack.length - 1].elements.push(listLayout);
                        inList = false;
                        listItems = [];
                    }
                }
            }
            currentTextBlock = '';
        }
    }

    // 辅助函数：将累积的按钮添加为布局（现在默认使用垂直布局）
    function flushConsecutiveButtons() {
        if (consecutiveButtons.length > 0) {

            if (disableButtonGrouping) {
                // 在布局标签内，按钮作为独立元素添加，不创建按钮布局容器
                consecutiveButtons.forEach(button => {
                    stack[stack.length - 1].elements.push(button);
                });
            } else if (consecutiveButtons.length === 1) {
                // 单个按钮直接添加
                stack[stack.length - 1].elements.push(consecutiveButtons[0]);
            } else {
                // 多个连续按钮放在垂直布局中（默认布局）
                const buttonLayout = createVerticalButtonLayout(consecutiveButtons);
                stack[stack.length - 1].elements.push(buttonLayout);
            }
            consecutiveButtons = [];
        }
    }


    /**
     * 生成带样式的超链接 HTML
     * @param {string} text - 链接文本
     * @param {string} url - 链接 URL
     * @returns {string} 带样式的 <a> 标签 HTML（CSS 类 + 内联样式）
     */
    function generateStyledHyperlink(text, url) {
        // 从 styleConfig 获取 hyperlink 样式并解析 tokens
        const hyperlinkStyle = DEFAULT_STYLE_CONFIG.text?.hyperlink || {};
        
        const fontSize = 'inherit';
        const fontWeight = '500';
        const color = '#615eec';
        const textDecoration = 'none';
        // 🔧 borderBottom 也需要解析 token（可能包含颜色 token）
        const borderBottom = '2px solid #bcbef7';
        const transition = 'all 0.3s ease';
        
        // 同时使用 CSS 类（支持 hover）和内联样式（作为备用）
        const inlineStyle = `font-size: ${fontSize}; font-weight: ${fontWeight}; color: ${color}; text-decoration: ${textDecoration}; border-bottom: ${borderBottom}; transition: ${transition};`;
        
        return `<a href="${url}" class="hyperlink-styled" style="${inlineStyle}">${text}</a>`;
    }

    // 辅助函数：处理混合内容行
    function processMixedContent(line) {
        console.log(`🔍 处理混合内容: "${line}"`);

        // 查找所有按钮类型标记 [variant] [text](url) 或 [variant][text](url) 或 [event:eventName][text](url)
        const buttonVariantRegex = /\[(\w+(?::\w+)?)\]\s*\[([^\]]+)\]\(([^)]*)\)/g;
        const buttonVariantMatches = [...line.matchAll(buttonVariantRegex)];

        // 查找所有普通链接 [text](url) 但不是图片链接，也不是按钮类型标记
        const normalLinkRegex = /(?<!!)\[(.*?)\]\((.*?)\)/g;
        const linkMatches = [...line.matchAll(normalLinkRegex)];

        // 过滤掉已经被按钮类型标记匹配的链接
        const filteredLinkMatches = linkMatches.filter(linkMatch => {
            return !buttonVariantMatches.some(buttonMatch => {
                const linkStart = linkMatch.index;
                const linkEnd = linkMatch.index + linkMatch[0].length;
                const buttonStart = buttonMatch.index;
                const buttonEnd = buttonMatch.index + buttonMatch[0].length;
                return linkStart >= buttonStart && linkEnd <= buttonEnd;
            });
        });

        // 查找所有图片 ![alt](url)
        const imageMatches = [...line.matchAll(/!\[(.*?)\]\((.*?)\)/g)];

        // 🆕 检查是否有按钮或图片（需要单独处理）
        const hasButtonsOrImages = buttonVariantMatches.length > 0 || imageMatches.length > 0;

        // 🆕 检查是否所有链接都有 URL（如果有链接没有URL，需要创建按钮）
        let hasLinksWithoutUrl = false;
        let hasLinksWithEvent = false;
        for (const match of filteredLinkMatches) {
            const linkUrl = match[2];
            const matchIndex = match.index;
            const hasEvent = line.substring(Math.max(0, matchIndex - 20), matchIndex).includes('[event:');
            const hasUrl = linkUrl && linkUrl.trim().length > 0;
            
            if (hasEvent) {
                hasLinksWithEvent = true;
            }
            if (!hasUrl) {
                hasLinksWithoutUrl = true;
            }
        }

        // 🆕 如果只有文本和超链接（所有链接都有URL且无事件），创建单个文本元素
        if (!hasButtonsOrImages && !hasLinksWithoutUrl && !hasLinksWithEvent && filteredLinkMatches.length > 0) {
            console.log(`  → 纯文本+超链接，创建单个文本元素`);
            
            // 将整行转换为 HTML 字符串
            let htmlContent = '<p>';
            let lastIndex = 0;
            
            // 对所有超链接按位置排序
            const sortedLinks = filteredLinkMatches.sort((a, b) => a.index - b.index);
            
            for (const match of sortedLinks) {
                const matchIndex = match.index;
                const linkText = match[1];
                const linkUrl = match[2];
                
                // 添加链接前的文本
                if (matchIndex > lastIndex) {
                    const textBefore = line.substring(lastIndex, matchIndex);
                    htmlContent += textBefore;
                }
                
                // 添加超链接
                console.log(`    → 添加超链接: "${linkText}" -> ${linkUrl}`);
                htmlContent += generateStyledHyperlink(linkText, linkUrl);
                
                lastIndex = matchIndex + match[0].length;
            }
            
            // 添加最后的文本
            if (lastIndex < line.length) {
                htmlContent += line.substring(lastIndex);
            }
            
            htmlContent += '</p>\n';
            
            console.log(`  → 生成的 HTML: ${htmlContent}`);
            
            // 创建文本元素
            const textElement = createTextElement(htmlContent);
            return textElement;
        }

        // 🆕 如果有按钮或图片，使用原来的 layout 方式
        console.log(`  → 包含按钮/图片，使用 layout 容器`);
        
        // 🔧 生成稳定的内容种子，添加行内容哈希
        const lineHash = line.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) & 0xfffff, 0);
        const contentSeed = `mixed-content-${line.slice(0, 30)}-len${line.length}`;
        const position = `horizontal-mixed-hash${lineHash}`;

        // 创建一个水平布局元素
        let currentLayout = createLayoutElement(LAYOUT_CONSTANTS.DIRECTION.HORIZONTAL, [], {
            contentSeed: contentSeed,
            position: position
        });

        // 合并并按照在原文中的位置排序
        const allMatches = [
            ...buttonVariantMatches.map(match => ({ type: 'buttonVariant', match })),
            ...filteredLinkMatches.map(match => ({ type: 'link', match })),
            ...imageMatches.map(match => ({ type: 'image', match }))
        ].sort((a, b) => a.match.index - b.match.index);

        let lastIndex = 0;

        // 按顺序处理所有匹配项
        for (const { type, match } of allMatches) {
            const matchIndex = match.index;

            // 处理匹配项前的文本
            if (matchIndex > lastIndex) {
                const textBefore = line.substring(lastIndex, matchIndex);
                // 始终创建文本元素，即使只有空格
                const textElement = createTextElement(textBefore);
                currentLayout.layout.children.push(textElement);
            }

            // 处理匹配项
            if (type === 'buttonVariant') {
                const variant = match[1];
                const buttonText = match[2];
                const buttonUrl = match[3];
                const supportedVariants = ['primary', 'secondary', 'success', 'warning', 'error', 'ghost', 'link'];

                // 检查是否是事件语法
                if (variant.startsWith('event:')) {
                    // 🆕 传入原始匹配文本用于事件解析
                    const buttonElement = createButtonElement(match[0], buttonUrl, 'primary', currentMarkdown, buttonText);
                    currentLayout.layout.children.push(buttonElement);
                } else if (supportedVariants.includes(variant)) {
                    const buttonElement = createButtonElement(buttonText, buttonUrl, variant, currentMarkdown);
                    currentLayout.layout.children.push(buttonElement);
                } else {
                    // 如果variant不支持，当作普通文本处理
                    const textElement = createTextElement(match[0]);
                    currentLayout.layout.children.push(textElement);
                }
            } else if (type === 'link') {
                const linkText = match[1];
                const linkUrl = match[2];
                
                // 🆕 检查是否有事件语法（通过检查整行）
                const hasEvent = line.substring(Math.max(0, matchIndex - 20), matchIndex).includes('[event:');
                
                // 🆕 判断是否有 URL
                const hasUrl = linkUrl && linkUrl.trim().length > 0;
                
                console.log(`🔗 混合内容中的链接: 文本="${linkText}", URL="${linkUrl}", 有事件=${hasEvent}, 有URL=${hasUrl}`);
                
                // 🆕 有事件 OR 没有 URL -> 创建按钮
                if (hasEvent || !hasUrl) {
                    console.log(`  → 创建按钮（${hasEvent ? '有事件' : '无 URL'}）`);
                    const buttonElement = createButtonElement(linkText, linkUrl || '#', 'primary', currentMarkdown);
                    currentLayout.layout.children.push(buttonElement);
                } 
                // 🆕 有 URL 且无事件 -> 创建带样式的超链接文本元素
                else {
                    console.log(`  → 创建带样式超链接的文本元素`);
                    const hyperlinkHtml = generateStyledHyperlink(linkText, linkUrl);
                    const textElement = createTextElement(hyperlinkHtml);
                    currentLayout.layout.children.push(textElement);
                }
            } else if (type === 'image') {
                const imgAlt = match[1];
                const imgUrl = match[2];
                const backgroundElement = createBackgroundElement(imgUrl, 'normal');

                // 🆕 添加图片的alt信息到元数据中
                if (backgroundElement._metadata) {
                    backgroundElement._metadata.alt = imgAlt;
                }

                currentLayout.layout.children.push(backgroundElement);
            }

            lastIndex = matchIndex + match[0].length;
        }

        // 处理最后一个匹配后的文本
        if (lastIndex < line.length) {
            const textAfter = line.substring(lastIndex);
            // 始终创建尾部文本元素，即使只有空格
            const textElement = createTextElement(textAfter);
            currentLayout.layout.children.push(textElement);
        }

        // 直接返回layout元素，而不是包含它的数组
        return currentLayout;
    }
}


// 主函数：将Markdown转换为八要素格式
function markdownToEightElement(markdown, styleConfig) {
    // 🆕 保存原始未处理的markdown用于事件解析（清理内部标记）
    const originalMarkdown = typeof markdown === 'string'
        ? markdown.replace(/§PARAGRAPH§/g, '')
        : markdown;

    // 如果提供了样式配置，设置当前配置
    if (styleConfig) {
        try {
            // 动态导入避免循环依赖
            import('./styleConfig.js').then(({ setStyleConfig }) => {
                setStyleConfig(styleConfig);
            });
        } catch (error) {
            console.warn('设置样式配置失败:', error);
        }
    }

    // 检查并规范化输入
    let processedMarkdown = markdown;

    // 确保markdown是字符串类型
    if (typeof processedMarkdown !== 'string') {
        console.warn('收到非字符串类型的Markdown输入，尝试转换为字符串');
        try {
            processedMarkdown = String(processedMarkdown || '');
        } catch (error) {
            console.error('转换Markdown输入为字符串失败:', error);
            processedMarkdown = '';
        }
    }

    // 确保最后有一个换行符，以正确处理最后一个段落
    if (processedMarkdown && !processedMarkdown.endsWith('\n')) {
        processedMarkdown += '\n';
    }

    console.log(`处理Markdown文本，长度: ${processedMarkdown.length}`);

    // 🆕 创建解析选项对象，用于收集根layout属性
    const parseOptions = {
        rootAttributes: {},
        currentMarkdown: originalMarkdown  // 🆕 传递原始未处理的markdown用于事件解析
    };

    // 直接使用parseMarkdown函数解析Markdown为元素数组
    const parsedElements = parseMarkdown(processedMarkdown, parseOptions);
    console.log(`解析得到的元素数量: ${parsedElements.length}`);

    // 🆕 使用createEightElementRoot创建八要素根结构，传递根layout属性
    const eightElementRoot = createEightElementRoot(parsedElements, parseOptions.rootAttributes);

    // 重置为默认配置
    try {
        // 动态导入避免循环依赖
        import('./styleConfig.js').then(({ resetStyleConfig }) => {
            resetStyleConfig();
        });
    } catch (error) {
        console.warn('重置样式配置失败:', error);
    }

    return eightElementRoot;
}

export {
    markdownToEightElement,
    parseMarkdown,
    parseMarkdownToTemplate,
    parseEventSyntax,
    removeEventSyntax,
    processInlineIconText,
    prepareMarkdownForKatex,
    addFlexboxToParagraphsWithSVG,
    processText,
    isListItem,
    isQuoteText,
    isIconTag
}