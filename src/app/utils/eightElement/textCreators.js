import { generateUUID, detectMathInHTML, applyCustomStyleOverride } from './util.js';

import {
    getElementStyleConfig,
    LAYOUT_CONSTANTS,
    DIMENSION_CONSTANTS,
    FONT_CONSTANTS,
} from './styleConfig.js';

import { processText } from './PSUIPParser.js';

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
        const textElement = createTextElement(content, 'normal', {
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
        const textElement = createTextElement(line, 'normal', {
            isBold: true,
            processedText: processedText // 传递处理后的文本
        });

        return { element: textElement, processed: true, type: 'text' };
    }

    // 如果没有特殊格式，返回未处理
    return { processed: false };
}

// 创建文本元素 - 修改以支持富文本和KaTeX
function createTextElement(text, variant = 'normal', richTextOptions = {}, customStyles = null) {
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
                "box-sizing": "border-box",
                primaryAxisSizingMode: "fixed",
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
                    "text-decoration": "underline",
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

export {
    isListItem,
    processListItemAndRichText,
    createTextElement
}