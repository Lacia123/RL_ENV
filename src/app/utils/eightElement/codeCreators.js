import { generateUUID, escapeHtml, getMarkedInstance } from './util.js';
import {
    getElementStyleConfig,
    FONT_CONSTANTS,
} from './styleConfig.js';
import resolveToken, { isColorDark } from '../tokens/resolveToken.js';


// 创建代码元素
function createCodeElement(codeContent, language = '') {
    const id = generateUUID();
    const codeStyleConfig = getElementStyleConfig('text', 'codeBlock');

    // 判断是否为深色主题
    let isDarkMode = false;
    let backgroundColor = null;

    // 检查 codeStyleConfig 中是否有 background 或 backgroundColor 设置
    if (codeStyleConfig.background) {
        backgroundColor = resolveToken(codeStyleConfig.background);
    } else if (codeStyleConfig.backgroundColor) {
        backgroundColor = resolveToken(codeStyleConfig.backgroundColor);
    }

    // 如果有背景色，判断是否为深色主题
    if (backgroundColor) {
        isDarkMode = isColorDark(backgroundColor);
    }

    // 使用markedInstance处理代码高亮
    let highlightedCode = codeContent;
    try {
        const markdownCode = `\`\`\`${language || 'plaintext'}\n${codeContent}\n\`\`\``;
        highlightedCode = getMarkedInstance().parse(markdownCode);
    } catch (error) {
        console.error('代码高亮处理错误:', error);
        // 出错时转义原始代码内容
        highlightedCode = `<pre><code>${escapeHtml(codeContent)}</code></pre>`;
    }

    // 如果有背景色，将其注入到highlightedCode的code标签中
    if (backgroundColor) {
        // 使用正则表达式找到code标签并添加背景色样式
        highlightedCode = highlightedCode.replace(
            /<code([^>]*)>/g,
            (match, attributes) => {
                // 检查是否已经有style属性
                if (attributes.includes('style=')) {
                    // 如果已有style属性，在现有style中添加背景色
                    return match.replace(
                        /style="([^"]*)"/g,
                        `style="$1; background-color: inherit;"`
                    );
                } else {
                    // 如果没有style属性，添加新的style属性
                    return `<code${attributes} style="background-color: inherit;">`;
                }
            }
        );
    }

    // 生成唯一的className
    const uniqueClassName = `code-${id}`;

    // 创建符合要求的代码元素结构
    const codeElement = {
        id,
        name: "code",
        "name-zh": "代码",
        "file-type": "cell-element",
        type: "code",
        // 🔍 保存元数据用于分析 - 与styleConfig的text.codeBlock配置匹配
        _metadata: {
            actualType: 'text',  // 在styleConfig中code实际是text类型的一个变体
            variant: 'codeBlock', // 对应styleConfig中的text.codeBlock
            language: language || 'plaintext',
            isCodeBlock: true
        },
        isDarkMode: isDarkMode, // 新增字段：是否为深色主题
        rawData: codeContent,       // 保存原始代码内容
        highlightedCode: highlightedCode, // 保存高亮后的HTML
        language: language || 'plaintext', // 保存代码语言
        layout: {
            classStyle: {
                ...codeStyleConfig
            },
            className: uniqueClassName,
            style: {
                // 基础样式
                "background-color": [],
                font: [],
                border: [],
                scale: [],
                "box-sizing": "border-box",
                fontSize: FONT_CONSTANTS.SIZE.SMALL,
                lineHeight: "1.5",
                whiteSpace: "pre",
                width: "100%",
            }
        },
        events: [{}]
    };
    return codeElement;
}

// 提取完整的Markdown代码块
function extractMarkdownCodeBlock(lines, startIndex) {

    const startLine = lines[startIndex].trim();
    let language = '';

    // 从第一行提取语言信息
    if (startLine.length > 3) {
        language = startLine.substring(3).trim();
    }

    const codeLines = [];
    let i = startIndex + 1;
    let foundEnd = false;

    // 查找代码块结束标记
    while (i < lines.length) {
        const line = lines[i]; // Preserve original line content for code blocks

        if (line.trim() === '```') {
            foundEnd = true;
            i++;
            break;
        }

        codeLines.push(line);
        i++;
    }

    // 如果没有找到结束标记，可能是不完整的代码块
    if (!foundEnd) {
        console.log('警告: 未找到代码块结束标记');
    }

    // 在组合代码行之前，清理每一行中的 §PARAGRAPH§ 标记
    // 通常不期望 §PARAGRAPH§ 出现在代码块中，但以防万一直接移除
    const cleanedCodeLines = codeLines.map(line => line.replace(/§PARAGRAPH§/g, ''));

    const result = {
        codeContent: cleanedCodeLines.join('\n'),
        language: language,
        endIndex: i - 1
    };

    return result;
}

// 检测Markdown代码块
function isMarkdownCodeBlock(line) {
    return line.trim().startsWith('```');
}


export {
    isMarkdownCodeBlock,
    createCodeElement,
    extractMarkdownCodeBlock
}