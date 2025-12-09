/**
 * 通用样式解析工具
 * 用于解析 Markdown 中的自定义样式语法，如 [background:{color.primarycontainer.brand0}]
 */

/**
 * 解析内容中的自定义样式语法
 * 支持的语法格式：
 * - [background:{color.primarycontainer.brand0}]
 * - [color:{color.onprimary.white100}]
 * - [fontSize:{font.size.large}]
 * 等任何 CSS 属性
 * 
 * @param {string} content - 包含样式语法的内容
 * @returns {Object} { styles: Object, cleanContent: string }
 */
export function parseInlineStyles(content) {
    if (!content) {
        return { styles: {}, cleanContent: content };
    }

    const styles = {};
    let cleanContent = content;

    // 匹配所有样式语法：[属性名:{token路径}] 或 [属性名:值]
    const styleRegex = /\[(\w+):\s*\{([^}]+)\}\]/g;
    let match;

    while ((match = styleRegex.exec(content)) !== null) {
        const [fullMatch, propertyName, tokenPath] = match;
        
        // 将 CSS 属性名转换为驼峰命名（如果需要）
        const camelCaseProperty = propertyName.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        
        // 存储样式，保留 token 格式
        styles[camelCaseProperty] = `{${tokenPath}}`;
    }

    // 移除所有样式语法标记，保留原始内容
    cleanContent = content.replace(/\[(\w+):\s*\{([^}]+)\}\]/g, '');

    return { styles, cleanContent };
}

/**
 * 解析表头中的背景颜色语法（向后兼容的特定版本）
 * @param {string} tableContent - 表格内容
 * @returns {string|null} 背景颜色 token 或 null
 */
export function parseHeaderBackgroundSyntax(tableContent) {
    const lines = tableContent.trim().split('\n');
    let headerBackgroundColor = null;
    
    // 查找第一行（表头行）
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // 跳过分隔行和事件语法行
        if (line.match(/\|[-|\s]+\|/) || line.match(/^\[event:/)) {
            continue;
        }
        
        // 检查是否包含背景语法
        const backgroundMatch = line.match(/\[background:\s*\{([^}]+)\}\]/);
        if (backgroundMatch) {
            headerBackgroundColor = `{${backgroundMatch[1]}}`;
            break;
        }
        
        // 如果找到了第一行且没有背景语法，退出循环
        if (line.includes('|')) {
            break;
        }
    }
    
    return headerBackgroundColor;
}

/**
 * 从内容中移除所有样式语法标记
 * @param {string} content - 包含样式语法的内容
 * @returns {string} 清理后的内容
 */
export function removeInlineStyles(content) {
    if (!content) {
        return content;
    }
    
    // 移除所有样式语法：[属性名:{token路径}]
    return content.replace(/\[(\w+):\s*\{([^}]+)\}\]/g, '');
}

/**
 * 解析表格内容，提取表头样式并清理内容
 * 支持格式：
 * - [background:{color.primarycontainer.brand0};headerAlign:center;cellAlign:center]
 * - 多个样式用 ; 分隔
 * - headerAlign: center/left/right - 表头对齐
 * - cellAlign: center/left/right - 单元格对齐
 * @param {string} tableContent - 表格内容
 * @returns {Object} { headerStyles: Object, headerAlign: string, cellAlign: string, cleanContent: string }
 */
export function parseTableHeaderStyles(tableContent) {
    const lines = tableContent.trim().split('\n');
    let headerStyles = {};
    let headerAlign = null;
    let cellAlign = null;
    const cleanLines = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // 第一行（表头行）：解析样式
        if (i === 0) {
            // 🆕 匹配完整的样式块：[...]
            const styleBlockMatch = line.match(/\[([^\]]+)\]/);
            
            if (styleBlockMatch) {
                const styleBlockContent = styleBlockMatch[1];
                
                // 🆕 用 ; 分割多个样式设置
                const styleParts = styleBlockContent.split(';').map(s => s.trim()).filter(s => s);
                
                styleParts.forEach(part => {
                    // 🆕 处理特殊对齐属性：headerAlign:center 或 cellAlign:center
                    const headerAlignMatch = part.match(/^headerAlign:\s*(center|left|right)$/i);
                    if (headerAlignMatch) {
                        headerAlign = headerAlignMatch[1].toLowerCase();
                        return;
                    }
                    
                    const cellAlignMatch = part.match(/^cellAlign:\s*(center|left|right)$/i);
                    if (cellAlignMatch) {
                        cellAlign = cellAlignMatch[1].toLowerCase();
                        return;
                    }
                    
                    // 🆕 处理普通样式：property:{token} 或 property:value
                    const tokenStyleMatch = part.match(/^(\w+):\s*\{([^}]+)\}$/);
                    if (tokenStyleMatch) {
                        const [, propertyName, tokenPath] = tokenStyleMatch;
                        const camelCaseProperty = propertyName.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                        headerStyles[camelCaseProperty] = `{${tokenPath}}`;
                        return;
                    }
                    
                    // 🆕 处理普通值样式：property:value（非 token）
                    const valueStyleMatch = part.match(/^(\w+):\s*(.+)$/);
                    if (valueStyleMatch) {
                        const [, propertyName, value] = valueStyleMatch;
                        const camelCaseProperty = propertyName.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                        headerStyles[camelCaseProperty] = value.trim();
                        return;
                    }
                });
                
                // 🆕 移除样式块，保留其他内容
                const cleanContent = line.replace(/\[([^\]]+)\]/, '').trim();
                cleanLines.push(cleanContent);
            } else {
                // 没有样式块，直接使用原内容
                cleanLines.push(line);
            }
        } else {
            // 其他行：直接清理样式语法
            cleanLines.push(removeInlineStyles(line));
        }
    }

    return {
        headerStyles,
        headerAlign,
        cellAlign,
        cleanContent: cleanLines.join('\n')
    };
}
