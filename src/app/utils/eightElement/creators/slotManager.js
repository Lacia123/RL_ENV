/**
 * 插槽管理器
 * 用于管理组件的插槽系统，支持条件渲染和自动数据属性
 */

/**
 * 根据插槽定义和实际子元素生成数据属性
 * @param {Object} componentConfig - 组件配置（包含 slots 和 autoDataAttributes）
 * @param {Array} children - 已解析的子元素数组
 * @returns {Object} 数据属性对象 { 'data-image': 'true', ... }
 */
export function generateSlotDataAttributes(componentConfig, children) {
    const dataAttrs = {};
    
    // 如果没有配置自动数据属性，返回空对象
    if (!componentConfig || !componentConfig.autoDataAttributes) {
        return dataAttrs;
    }
    
    console.log('🎰 生成插槽数据属性...');
    console.log('  子元素数量:', children?.length || 0);
    
    const autoDataAttrs = componentConfig.autoDataAttributes;
    
    // 支持两种格式：
    // 1. 数组: ['badge', 'image', 'rating'] - 插槽名和属性名相同
    // 2. 对象: { 'hasImage': 'image', 'hasActions': 'actions' } - 自定义属性名
    
    if (Array.isArray(autoDataAttrs)) {
        // 数组形式：插槽名称即为属性名称
        console.log('  使用数组形式的 autoDataAttributes');
        autoDataAttrs.forEach(slotName => {
            const hasSlot = checkSlotExists(children, slotName);
            
            if (hasSlot) {
                dataAttrs[`data-${slotName}`] = 'true';
                console.log(`  ✅ 插槽 "${slotName}" 存在，添加 data-${slotName}="true"`);
            } else {
                console.log(`  ❌ 插槽 "${slotName}" 不存在`);
            }
        });
    } else if (typeof autoDataAttrs === 'object') {
        // 对象形式：自定义属性名
        console.log('  使用对象形式的 autoDataAttributes');
        for (const [attrName, slotPath] of Object.entries(autoDataAttrs)) {
            const hasSlot = checkSlotExists(children, slotPath);
            
            if (hasSlot) {
                dataAttrs[`data-${attrName}`] = 'true';
                console.log(`  ✅ 插槽 "${slotPath}" 存在，添加 data-${attrName}="true"`);
            } else {
                console.log(`  ❌ 插槽 "${slotPath}" 不存在`);
            }
        }
    }
    
    console.log('📦 最终数据属性:', dataAttrs);
    return dataAttrs;
}

/**
 * 检查特定插槽路径是否存在内容
 * @param {Array} children - 子元素数组
 * @param {string} slotPath - 插槽路径（如 'image', 'header.title', 'actions'）
 * @returns {boolean} 是否存在
 */
function checkSlotExists(children, slotPath) {
    if (!children || !Array.isArray(children) || children.length === 0) {
        return false;
    }
    
    // 支持点号分隔的路径（如 'header.title'）
    const pathParts = slotPath.split('.');
    
    // 递归检查子元素
    return children.some(child => {
        if (!child) return false;
        
        // 检查元素的标识符（支持多种来源）
        const elementPath = getElementPath(child);
        
        if (!elementPath) return false;
        
        // 完全匹配
        if (elementPath === slotPath) {
            return true;
        }
        
        // 前缀匹配（用于嵌套路径）
        if (elementPath.startsWith(pathParts[0])) {
            // 如果是嵌套路径，递归检查子元素
            if (pathParts.length > 1 && child.layout?.children) {
                const remainingPath = pathParts.slice(1).join('.');
                return checkSlotExists(child.layout.children, remainingPath);
            }
            return true;
        }
        
        // 检查子元素（递归）
        if (child.layout?.children) {
            return checkSlotExists(child.layout.children, slotPath);
        }
        
        return false;
    });
}

/**
 * 获取元素的路径标识符
 * @param {Object} element - 八要素元素
 * @returns {string|null} 路径标识符
 */
function getElementPath(element) {
    if (!element) return null;
    
    // 优先级1: _metadata 中的标识
    if (element._metadata) {
        // 插槽名称（最高优先级）
        if (element._metadata.slotName) {
            return element._metadata.slotName;
        }
        
        // 模板标签名
        if (element._metadata.tagName) {
            return element._metadata.tagName;
        }
        
        // 组件名称
        if (element._metadata.componentName) {
            return element._metadata.componentName;
        }
        
        // 变体名称
        if (element._metadata.variant) {
            return element._metadata.variant;
        }
        
        // 实际类型
        if (element._metadata.actualType) {
            return element._metadata.actualType;
        }
    }
    
    // 优先级2: layout.className（可能包含语义信息）
    if (element.layout?.className) {
        // 从 className 中提取语义名称（如 'header-title-xxx' -> 'header'）
        const classNameMatch = element.layout.className.match(/^([a-zA-Z]+)/);
        if (classNameMatch) {
            return classNameMatch[1];
        }
    }
    
    // 优先级3: 元素的 name 属性
    if (element.name) {
        return element.name;
    }
    
    return null;
}

/**
 * 将数据属性对象转换为 HTML 属性字符串
 * @param {Object} dataAttrs - 数据属性对象
 * @returns {string} HTML 属性字符串（如 'data-has-image="true" data-has-actions="true"'）
 */
export function dataAttributesToString(dataAttrs) {
    if (!dataAttrs || Object.keys(dataAttrs).length === 0) {
        return '';
    }
    
    return Object.entries(dataAttrs)
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ');
}

/**
 * 解析条件样式选择器，提取数据属性条件
 * 例如：'&[data-has-image="true"]' -> { selector: '&[data-has-image="true"]', condition: 'has-image=true' }
 * @param {string} selector - CSS 选择器
 * @returns {Object|null} 解析结果或 null
 */
export function parseConditionalSelector(selector) {
    if (!selector || typeof selector !== 'string') {
        return null;
    }
    
    // 匹配 &[data-xxx="yyy"] 格式
    const match = selector.match(/^&\[data-([^=]+)="([^"]+)"\]$/);
    
    if (match) {
        const [, attrName, attrValue] = match;
        return {
            selector: selector,
            dataAttribute: `data-${attrName}`,
            condition: `${attrName}=${attrValue}`,
            attrName: attrName,
            attrValue: attrValue
        };
    }
    
    return null;
}

/**
 * 从样式对象中分离条件样式和基础样式
 * @param {Object} styleObj - 原始样式对象
 * @returns {Object} { baseStyles: {}, conditionalStyles: [] }
 */
export function separateConditionalStyles(styleObj) {
    if (!styleObj || typeof styleObj !== 'object') {
        return { baseStyles: {}, conditionalStyles: [] };
    }
    
    const baseStyles = {};
    const conditionalStyles = [];
    
    Object.entries(styleObj).forEach(([key, value]) => {
        // 检查是否为条件选择器（以 & 开头且包含 [data-]）
        if (key.startsWith('&[data-')) {
            const parsed = parseConditionalSelector(key);
            if (parsed) {
                conditionalStyles.push({
                    ...parsed,
                    styles: value
                });
            }
        } else if (key.startsWith('&')) {
            // 其他伪类/伪元素（如 &:hover, &::before）保留在基础样式中
            baseStyles[key] = value;
        } else {
            // 普通样式属性
            baseStyles[key] = value;
        }
    });
    
    return { baseStyles, conditionalStyles };
}

/**
 * 检查元素的数据属性是否满足条件
 * @param {Object} dataAttrs - 元素的数据属性对象
 * @param {string} condition - 条件字符串（如 'has-image=true'）
 * @returns {boolean} 是否满足条件
 */
export function checkCondition(dataAttrs, condition) {
    if (!dataAttrs || !condition) {
        return false;
    }
    
    const [attrName, expectedValue] = condition.split('=');
    const actualValue = dataAttrs[`data-${attrName}`];
    
    return actualValue === expectedValue;
}

/**
 * 验证插槽配置的合法性
 * @param {Object} slots - 插槽配置
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export function validateSlotsConfig(slots) {
    const errors = [];
    
    if (!slots || typeof slots !== 'object') {
        return { valid: true, errors: [] }; // 没有插槽配置是合法的
    }
    
    Object.entries(slots).forEach(([slotName, slotConfig]) => {
        if (!slotConfig || typeof slotConfig !== 'object') {
            errors.push(`插槽 "${slotName}" 配置无效`);
            return;
        }
        
        // 检查必需的属性
        if (slotConfig.optional === undefined) {
            errors.push(`插槽 "${slotName}" 缺少 optional 属性`);
        }
        
        // 检查 layoutImpact 的有效值
        if (slotConfig.layoutImpact && 
            !['none', 'minor', 'major'].includes(slotConfig.layoutImpact)) {
            errors.push(`插槽 "${slotName}" 的 layoutImpact 值无效: ${slotConfig.layoutImpact}`);
        }
    });
    
    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * 获取必需的插槽列表
 * @param {Object} slots - 插槽配置
 * @returns {string[]} 必需插槽的名称数组
 */
export function getRequiredSlots(slots) {
    if (!slots || typeof slots !== 'object') {
        return [];
    }
    
    return Object.entries(slots)
        .filter(([, config]) => config.optional === false)
        .map(([name]) => name);
}

/**
 * 检查是否所有必需插槽都已填充
 * @param {Object} slots - 插槽配置
 * @param {Array} children - 子元素数组
 * @returns {Object} { satisfied: boolean, missing: string[] }
 */
export function checkRequiredSlots(slots, children) {
    const requiredSlots = getRequiredSlots(slots);
    const missing = [];
    
    requiredSlots.forEach(slotName => {
        if (!checkSlotExists(children, slotName)) {
            missing.push(slotName);
        }
    });
    
    return {
        satisfied: missing.length === 0,
        missing
    };
}

