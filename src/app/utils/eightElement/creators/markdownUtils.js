/**
 * Markdown 工具函数
 * 提供 markdown 解析和处理的通用工具
 */

/**
 * 清理 markdown 格式符号，保留纯文本内容
 * @param {string} text - 原始文本
 * @returns {string} 清理后的文本
 */
export function stripMarkdownFormatting(text) {
    if (!text) return text;
    
    let cleaned = text.trim();
    
    // 去掉标题符号 (# ## ### 等)
    cleaned = cleaned.replace(/^#{1,6}\s+/, '');
    
    // 去掉粗体 ** 或 __
    cleaned = cleaned.replace(/\*\*(.+?)\*\*/g, '$1');
    cleaned = cleaned.replace(/__(.+?)__/g, '$1');
    
    // 去掉斜体 * 或 _
    cleaned = cleaned.replace(/\*(.+?)\*/g, '$1');
    cleaned = cleaned.replace(/_(.+?)_/g, '$1');
    
    // 去掉删除线 ~~
    cleaned = cleaned.replace(/~~(.+?)~~/g, '$1');
    
    // 去掉行内代码 `
    cleaned = cleaned.replace(/`(.+?)`/g, '$1');
    
    return cleaned;
}

/**
 * 处理表达式，对内容进行转换
 * @param {string} content - 原始内容
 * @param {string} expression - 处理表达式（如 'replace("%", "")'）
 * @returns {string} 处理后的内容
 */
export function processExpression(content, expression) {
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
 * 从内容中提取指定类型的 markdown 值
 * @param {string} content - 内容
 * @param {string} source - 来源类型（h2, h3, h4, p 等）
 * @param {string} expression - 可选的表达式处理
 * @returns {string|null} 提取的值
 */
export function extractMarkdownValue(content, source, expression = null) {
    if (!content || !source) return null;
    
    let value = null;
    
    // 尝试从 markdown 格式中提取
    if (source === 'h4') {
        const h4Match = content.match(/####\s+(.+)/);
        if (h4Match) value = h4Match[1].trim();
    } else if (source === 'h3') {
        const h3Match = content.match(/###\s+(.+)/);
        if (h3Match) value = h3Match[1].trim();
    } else if (source === 'h2') {
        const h2Match = content.match(/##\s+(.+)/);
        if (h2Match) value = h2Match[1].trim();
    } else if (source === 'p') {
        const pMatch = content.match(/^(?!#|<)(.+)/m);
        if (pMatch) value = pMatch[1].trim();
    }
    
    // 应用表达式处理
    if (value && expression) {
        value = processExpression(value, expression);
    }
    
    return value;
}

/**
 * 从内容中提取子标签的值
 * @param {string} content - 内容
 * @param {string} tagName - 标签名
 * @returns {string|null} 提取的值
 */
export function extractSubTagValue(content, tagName) {
    if (!content || !tagName) return null;
    
    const tagPattern = new RegExp(`<${tagName}>(.+?)<\/${tagName}>`, 'is');
    const tagMatch = content.match(tagPattern);
    
    return tagMatch ? tagMatch[1].trim() : null;
}

