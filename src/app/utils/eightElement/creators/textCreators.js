import { generateUUID, detectMathInHTML, applyCustomStyleOverride } from '../util.js';

import {
    getElementStyleConfig,
    LAYOUT_CONSTANTS,
    DIMENSION_CONSTANTS,
    FONT_CONSTANTS,
} from '../styles';

import { processText } from '../PSUIPParser.js';
import resolveToken from '../../tokens/resolveToken.js'

// 新增函数：处理文本中的加粗部分
function processBoldText(text) {
    // 找出所有加粗文本 **text**
    const boldRegex = /\*\*(.*?)\*\*/g;
    const boldMatches = [...text.matchAll(boldRegex)];

    if (boldMatches.length === 0) {
        return {
            processedText: text,
            hasBold: false
        };
    }

    // 处理文本，将加粗部分用HTML标签替换
    let processedText = text;
    let hasBold = false;

    // 替换加粗文本为带有HTML标签的形式，这将在渲染时被解析
    processedText = text.replace(boldRegex, (match, p1) => {
        hasBold = true;
        return `<span style="font-weight: bold;">${p1}</span>`;  // 使用HTML标签表示加粗
    });

    return {
        processedText,
        hasBold
    };
}

// 检测是否为列表项
function isListItem(line) {
    // 检测无序列表项 (-, *, +)
    const unorderedMatch = line.trim().match(/^[-*+]\s+(.+)$/);
    if (unorderedMatch) {
        return {
            isList: true,
            listType: 'unordered',
            content: unorderedMatch[1]
        };
    }

    // 检测有序列表项 (1., 2., etc.)
    const orderedMatch = line.trim().match(/^(\d+)\.\s+(.+)$/);
    if (orderedMatch) {
        return {
            isList: true,
            listType: 'ordered',
            content: orderedMatch[2],
            number: parseInt(orderedMatch[1])
        };
    }

    return { isList: false };
}

// 处理列表项和富文本 - 简化版本，避免拆分文本
function processListItemAndRichText(line) {
    // 首先检查是否为列表项
    const listItemInfo = isListItem(line);

    // 如果是列表项，处理其内容中的富文本
    if (listItemInfo.isList) {
        const { content, listType } = listItemInfo;

        // 处理加粗文本
        const { processedText, hasBold } = processBoldText(content);

        // 创建一个包含处理后文本的文本元素
        const textElement = createTextElement(content, 'p', {
            isList: true,
            listType: listType,
            isBold: hasBold,
            processedText: processedText // 传递处理后的文本
        });

        return { element: textElement, processed: true, type: 'text' };
    }

    // 如果不是列表项，检查是否包含加粗文本
    const { processedText, hasBold } = processBoldText(line);

    // 如果有加粗文本，创建包含处理后文本的文本元素
    if (hasBold) {
        const textElement = createTextElement(line, 'p', {
            isBold: true,
            processedText: processedText // 传递处理后的文本
        });

        return { element: textElement, processed: true, type: 'text' };
    }

    // 如果没有特殊格式，返回未处理
    return { processed: false };
}

// 创建文本元素 - 修改以支持富文本和KaTeX
function createTextElement(text, variant = 'p', richTextOptions = {}, customStyles = null) {
    const id = generateUUID();
    // 获取文本元素的样式配置
    let textStyleConfig = getElementStyleConfig('text', variant);

    // 🆕 应用自定义样式覆盖到元件级别
    if (customStyles && Object.keys(customStyles).length > 0) {
        textStyleConfig = applyCustomStyleOverride(textStyleConfig, customStyles, variant);
    }

    // 判断是否有富文本选项
    const hasRichText = Object.keys(richTextOptions).length > 0;

    let elementWidth = ""; // 默认宽度
    let elementType = 'text'; // 默认元素类型
    let elementVariant = variant; // 保存原始variant

    // 处理文本内容 - 包括Markdown和KaTeX
    let processedContent = text;
    // 🔧 修复：清理段落符号
    if (typeof processedContent === 'string') {
        processedContent = processedContent.replace(/§PARAGRAPH§/g, '');
    }
    // 如果是富文本，使用富文本处理过的内容
    if (hasRichText && richTextOptions.processedText) {
        processedContent = richTextOptions.processedText;
        // 🔧 修复：也清理富文本中的段落符号
        if (typeof processedContent === 'string') {
            processedContent = processedContent.replace(/§PARAGRAPH§/g, '');
        }
    }

    // 应用Markdown和KaTeX处理
    const htmlContent = processText(processedContent);

    const htmlResult = detectMathInHTML(htmlContent);

    const hasInlineMath = htmlResult.hasInline;
    const hasBlockMath = htmlResult.hasBlock;

    // 最终判断是否包含数学公式
    const containsMath = hasInlineMath || hasBlockMath;

    if (containsMath) {
        elementWidth = "100%";
        const mathVariant = hasInlineMath ? 'inline' : 'display';
        textStyleConfig = getElementStyleConfig('math', mathVariant);
        elementType = 'math'; // 更新元素类型
        elementVariant = mathVariant; // 更新变体
    }

    // 有序或无须列表样式
    if (hasRichText && richTextOptions.isList) {
        // 当前的渲染方法不支持有序列表
        textStyleConfig = getElementStyleConfig('list', 'unordered');
        elementType = 'list'; // 更新元素类型
        elementVariant = 'unordered'; // 更新变体
    }

    // 生成唯一的className
    const uniqueClassName = `text-${id}`;

    // 基础文本元素结构
    const textElement = {
        id,
        name: elementType === 'text' ? "text" : elementType, // 使用实际的元素类型
        "name-zh": elementType === 'text' ? "文本" :
            elementType === 'math' ? "数学公式" :
                elementType === 'list' ? "列表" : "文本",
        "file-type": "cell-element",
        // 🔍 保存元数据用于分析
        _metadata: {
            originalType: 'text',
            actualType: elementType,
            variant: elementVariant,
            originalVariant: variant,
            containsMath: containsMath,
            mathType: containsMath ? (hasInlineMath ? 'inline' : 'display') : null,
            isList: hasRichText && richTextOptions.isList,
            listType: hasRichText && richTextOptions.isList ? 'unordered' : null,
            hasRichText: hasRichText
        },
        layout: {
            classStyle: {
                ...textStyleConfig
            },
            className: uniqueClassName,
            style: {
                boxSizing: "border-box",
                // primaryAxisSizingMode: "fixed",
                position: "relative",
                width: elementWidth, // 设置宽度
            },
            text_body: {
                type: "container",
                content: [
                    {
                        element: "font",
                        value: "fontsize",
                        prop: "default",
                        token: "fontsize"
                    }
                ],
                resource: "",
                data: [],
                style: {
                    // layoutAlign: LAYOUT_CONSTANTS.ALIGN.Y.SELF.INHERIT,
                    layoutGrow: LAYOUT_CONSTANTS.GROW.ZERO,
                    // "word-break": "break-all",
                    width: elementWidth, // 设置宽度
                    textColor: {
                        element: "color",
                        value: "text",
                        prop: "default",
                        token: "text"
                    },
                    fill: {
                        element: "color",
                        value: "bg",
                        prop: "default",
                        token: "bg"
                    },
                    // fontSizes: {
                    //   element: "font",
                    //   value: "fontsize",
                    //   prop: "default",
                    //   token: "fontsize"
                    // }
                },
                children: []
            },
            text_hyperlink: {
                type: "container",
                content: [
                    {
                        element: "font",
                        value: "fontsize",
                        prop: "default",
                        token: "fontsize"
                    }
                ],
                resource: "",
                data: [],
                style: {
                    layoutAlign: LAYOUT_CONSTANTS.ALIGN.Y.SELF.INHERIT,
                    layoutGrow: LAYOUT_CONSTANTS.GROW.ZERO,
                    textDecoration: "underline",
                    // "word-break": "break-all",
                    width: elementWidth, // 设置宽度
                    textColor: {
                        element: "color",
                        value: "text",
                        prop: "default",
                        token: "hyperlinktext"
                    },
                    fill: {
                        element: "color",
                        value: "bg",
                        prop: "default",
                        token: "bg"
                    },
                    // fontSizes: {
                    //   element: "font",
                    //   value: "fontsize",
                    //   prop: "default",
                    //   token: "fontsize"
                    // }
                },
                children: []
            }
        },
        color: {
            text: {
                default: {
                    "data-key": "",
                    style: {
                        // text: {
                        //   value: textStyleConfig.textColor || COLOR_CONSTANTS.BASIC.OPACITY.BLACK[100],
                        //   type: "color",
                        //   key: "color-text"
                        // },
                        // hyperlinktext: {
                        //   value: variant === 'hyperlink' ?
                        //     (textStyleConfig.textColor || COLOR_CONSTANTS.BASIC.LIGHT_BLUE[5]) :
                        //     COLOR_CONSTANTS.BASIC.LIGHT_BLUE[5],
                        //   type: "color",
                        //   key: "color-text"
                        // }
                    },
                    // resource: COLOR_CONSTANTS.BASIC.LIGHT_BLUE[5]
                }
            },
            bg: {
                default: {
                    "data-key": "",
                    style: {
                        bg: {
                            value: textStyleConfig.fill || "none",
                            type: "color",
                            key: "color-bg"
                        }
                    },
                    resource: "none"
                }
            }
        },
        scale: {
            min_height: {
                default: {
                    "data-key": "",
                    style: {
                        min_height: {
                            value: DIMENSION_CONSTANTS.BASIC[72],
                            type: "sizing",
                            key: "scale-min_height"
                        }
                    },
                    resource: DIMENSION_CONSTANTS.BASIC[72]
                }
            },
            max_width: {
                default: {
                    "data-key": "",
                    style: {
                        max_width: {
                            value: DIMENSION_CONSTANTS.BASIC[1200],
                            type: "sizing",
                            key: "scale-max_width"
                        }
                    },
                    resource: DIMENSION_CONSTANTS.BASIC[1200]
                }
            }
        },
        font: {
            fontsize: {
                default: {
                    "data-key": "",
                    content: htmlContent, // 保存处理后的HTML内容，包含Markdown和KaTeX
                    // style: {
                    //   fontsize: {
                    //     value: textStyleConfig.fontSize || FONT_CONSTANTS.SIZE.LARGE,
                    //     type: "fontSizes",
                    //     key: "font-fontsize"
                    //   }
                    // },
                    // resource: textStyleConfig.fontSize || FONT_CONSTANTS.SIZE.LARGE
                }
            },
            fontweight: textStyleConfig.fontWeight || (richTextOptions.isBold ? {
                default: {
                    "data-key": "",
                    style: {
                        fontweight: {
                            value: FONT_CONSTANTS.WEIGHT.BOLD,
                            type: "fontWeight",
                            key: "font-fontweight"
                        }
                    },
                    resource: FONT_CONSTANTS.WEIGHT.BOLD
                }
            } : undefined)
        },
        type: "text_body",
        state: "default",
        events: [{}]
    };

    return textElement;
}


// 创建一级标题块容器，设置最小宽度和最大宽度
function createHeadingBlockContainer(headingLayout) {
    const layoutId = generateUUID();

    // 创建一个包装容器，设置最小宽度和flex-basis
    const layout = {
        dataKeys: [],
        name: "layout",
        "name-zh": "标题块容器",
        "file-type": "template",
        theme: "default",
        layout: {
            style: {
                display: LAYOUT_CONSTANTS.DISPLAY.FLEX,
                layoutMode: LAYOUT_CONSTANTS.DIRECTION.VERTICAL,
                alignSelf: "flex-start",
                // layoutGrow: LAYOUT_CONSTANTS.GROW.ZERO,
                boxSizing: "border-box",
                borderStyle: "solid",
                borderWidth: "0",
                borderColor: "initial",
                height: "auto",
                width: "100%",
                minWidth: "375px",  // 设置最小宽度为375px
                maxWidth: "50%",    // 设置最大宽度为50%，确保一行最多两个
                // 添加flex-basis属性，使其在流式布局中正确工作
                flexBasis: "375px",
                flexGrow: "1",
                flexShrink: "0",
                boxSizing: "border-box",
                position: "relative",
                padding: DIMENSION_CONSTANTS.PADDING.base,
                margin: DIMENSION_CONSTANTS.MARGIN.tight
            },
            children: [headingLayout]
        },
        description: "",
        id: layoutId,
        events: [{}]
    };

    // 查找并修改headingLayout中标题文本的对齐方式
    const updateHeadingTextAlignment = (layout) => {
        // 检查是否是一级标题布局
        if (layout && layout.layout && layout.layout.children && layout.layout.children.length > 0) {
            const firstChild = layout.layout.children[0];
            if (firstChild && firstChild.name === "text" && firstChild.layout && firstChild.layout.style) {
                // 将标题文本对齐方式改为左对齐
                firstChild.layout.style.textAlign = "left";

                if (firstChild.layout.text_body && firstChild.layout.text_body.style) {
                    firstChild.layout.text_body.style.textAlign = "left";
                }

                if (firstChild.layout.text_hyperlink && firstChild.layout.text_hyperlink.style) {
                    firstChild.layout.text_hyperlink.style.textAlign = "left";
                }
            }
        }
    };

    // 应用对齐方式更改
    updateHeadingTextAlignment(headingLayout);

    return layout;
}

/**
 * 创建超链接元素
 * @param {string} text - 链接文本
 * @param {string} url - 链接 URL
 * @param {string} variant - 样式变体，默认为 'hyperlink'
 * @returns {Object} 超链接元素
 */
function createHyperlinkElement(text, url, variant = 'hyperlink') {
    const id = generateUUID();
    
    // 获取超链接的样式配置
    let hyperlinkStyle = getElementStyleConfig('text', variant);
    
    // 🆕 如果没有找到超链接样式，使用默认文本样式
    if (!hyperlinkStyle || Object.keys(hyperlinkStyle).length === 0) {
        console.warn(`未找到超链接样式 "${variant}"，使用默认样式`);
        hyperlinkStyle = {
            fontSize: "inherit",
            fontWeight: "{font.fontweight.medium}",
            color: "{color.primary.brand5}",
            textDecoration: 'none',
            borderBottom: '2px solid transparent',
            transition: "{animation.smooth}",
            '&:hover': {
                color: "{color.primary.brand6}",
                borderBottomColor: "{color.primarycontainer.brand2}",
                textDecoration: "none"
            },
            '&:active': {
                color: "{color.onprimarycontainer.brand8}"
            }
        };
    }
    
    // 🆕 生成带有 <a> 标签的 content（CSS 类 + 内联样式）
    // 解析样式 tokens
    const fontSize = hyperlinkStyle.fontSize ? (resolveToken(hyperlinkStyle.fontSize) || hyperlinkStyle.fontSize) : 'inherit';
    const fontWeight = hyperlinkStyle.fontWeight ? (resolveToken(hyperlinkStyle.fontWeight) || hyperlinkStyle.fontWeight) : '500';
    const color = hyperlinkStyle.color ? (resolveToken(hyperlinkStyle.color) || hyperlinkStyle.color) : '#615eec';
    const textDecoration = hyperlinkStyle.textDecoration || 'none';
    // 🔧 borderBottom 也需要解析 token（可能包含颜色 token）
    const borderBottom = hyperlinkStyle.borderBottom ? (resolveToken(hyperlinkStyle.borderBottom) || hyperlinkStyle.borderBottom) : '2px solid #bcbef7';
    const transition = hyperlinkStyle.transition ? (resolveToken(hyperlinkStyle.transition) || hyperlinkStyle.transition) : 'all 0.3s ease';
    
    const inlineStyle = `font-size: ${fontSize}; font-weight: ${fontWeight}; color: ${color}; text-decoration: ${textDecoration}; border-bottom: ${borderBottom}; transition: ${transition};`;
    
    const hyperlinkContent = `<a href="${url}" class="hyperlink-styled" style="${inlineStyle}">${text}</a>`;
    
    // 创建超链接元素
    const hyperlinkElement = {
        id: id,
        name: 'text',
        'name-zh': '超链接',
        'file-type': 'cell-element',
        description: `超链接文本元素 - ${variant}`,
        dataKeys: [],
        theme: 'default',
        type: 'text_body', // 🆕 设置为 text_body 类型
        _metadata: {
            actualType: 'hyperlink',
            variant: variant,
            isHyperlink: true,
            url: url
        },
        layout: {
            text_body: {
                content: [
                    {
                        element: 'font',
                        value: 'fontsize',
                        prop: 'default'
                    }
                ],
                style: hyperlinkStyle
            }
        },
        font: {
            fontsize: {
                default: {
                    'data-key': '',
                    content: hyperlinkContent // 🆕 将 HTML content 放在正确的位置
                }
            },
            fontweight: hyperlinkStyle.fontWeight || 'inherit'
        }
    };
    
    return hyperlinkElement;
}

export {
    isListItem,
    processListItemAndRichText,
    createHeadingBlockContainer,
    createTextElement,
    createHyperlinkElement
}