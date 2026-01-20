/**
 * styleConfig.js
 * 八要素结构的样式配置系统
 * 提供了对不同元素类型样式的完整配置
 */
import LAYOUT_STYLE from './layoutStyle';
import TEXT_STYLE from './textStyle';
import MATH_STYLE from './mathStyle';
import CHART_STYLE from './chartStyle';
import TABLE_STYLE from './tableStyle';
import BUTTON_STYLE from './buttonStyle';
import LIST_STYLE from './listStyle';
import ALERT_STYLE from './alertStyle';
import CARD_STYLE from './card';
import COMPONENT_STYLE from './component';
import TAB_STYLE from './tabStyle';
import VIDEO_STYLE from './videoStyle';
import AUDIO_STYLE from './audioStyle';
import IMAGE_STYLE from './imageStyle';
import ICON_STYLE from './iconStyle';

import { CSS_VARIABLE_SYSTEM, LAYOUT_CONSTANTS, COLOR_CONSTANTS, DIMENSION_CONSTANTS, FONT_CONSTANTS } from './constant';

/**
 * 默认样式配置
 * 配置所有元素类型的样式引用和值
 */
export const DEFAULT_STYLE_CONFIG = {
    ...LAYOUT_STYLE,
    ...TEXT_STYLE,
    ...MATH_STYLE,
    ...CHART_STYLE,
    ...TABLE_STYLE,
    ...BUTTON_STYLE,
    ...LIST_STYLE,
    ...ALERT_STYLE,
    ...CARD_STYLE,
    ...COMPONENT_STYLE,
    ...TAB_STYLE,
    ...VIDEO_STYLE,
    ...AUDIO_STYLE,
    // ==================== 图像元件 ====================
    ...IMAGE_STYLE,
    // ==================== 图标元件 ====================
    ...ICON_STYLE,
};

/**
 * 当前活动的样式配置，默认使用默认配置
 */
let activeStyleConfig = { ...DEFAULT_STYLE_CONFIG };

/**
 * 设置活动样式配置
 * @param {Object} config - 新的样式配置对象
 */
export function setStyleConfig(config) {
    // 深度合并配置
    activeStyleConfig = deepMerge(DEFAULT_STYLE_CONFIG, config);
}

/**
 * 重置样式配置为默认值
 */
export function resetStyleConfig() {
    activeStyleConfig = { ...DEFAULT_STYLE_CONFIG };
}

/**
 * 获取特定元素类型的样式配置
 * @param {string} elementType - 元素类型 (layout, text, button, image)
 * @param {string} variant - 变体名称
 * @param {Object} attributes - 要应用的属性（可选）
 * @returns {Object} 样式配置对象
 */
export function getElementStyleConfig(elementType, variant = 'normal', attributes = {}) {
    if (!activeStyleConfig[elementType]) {
        console.warn(`未找到元素类型 "${elementType}" 的样式配置`);
        return {};
    }

    if (!activeStyleConfig[elementType][variant]) {
        console.warn(`未找到元素类型 "${elementType}" 的变体 "${variant}"`);

        // 为不同元素类型提供合适的默认变体
        let defaultVariant = null;
        switch (elementType) {
            case 'text':
                defaultVariant = 'p';
                break;
            case 'icon':
                defaultVariant = 'medium';
                break;
            case 'button':
                defaultVariant = 'primary';
                break;
            case 'card':
                defaultVariant = 'standard';
                break;
            case 'layout':
                defaultVariant = 'column';
                break;
            case 'image':
                defaultVariant = 'normal';
                break;
            default:
                // 尝试获取第一个可用的变体
                const availableVariants = Object.keys(activeStyleConfig[elementType]);
                defaultVariant = availableVariants.length > 0 ? availableVariants[0] : null;
        }

        if (defaultVariant && activeStyleConfig[elementType][defaultVariant]) {
            console.warn(`使用默认变体 "${defaultVariant}" 替代 "${variant}"`);
            return getElementStyleConfig(elementType, defaultVariant, attributes);
        }

        return {};
    }

    const variantConfig = activeStyleConfig[elementType][variant];

    // 🆕 处理新格式：有 style 键和 supportedAttributes 键
    if (variantConfig.style && variantConfig.supportedAttributes) {

        // 复制基础样式
        let finalStyle = { ...variantConfig.style };

        // 应用支持的属性
        if (attributes && Object.keys(attributes).length > 0) {

            Object.entries(attributes).forEach(([attrName, attrValue]) => {
                if (variantConfig.supportedAttributes.includes(attrName)) {
        
                    // 🆕 解析token值 - 如果不包含大括号，自动添加（但排除URL等特殊值）
                    let resolvedValue = attrValue;

                    // 检查是否是特殊值（URL, 普通CSS值等），这些不需要token解析
                    const isSpecialValue = attrValue.startsWith('url(') ||
                        attrValue.startsWith('#') ||
                        attrValue.match(/^\d+px$/) ||
                        attrValue.match(/^\d+%$/) ||
                        attrValue === 'none' ||
                        attrValue === 'auto';

                    if (!isSpecialValue && !attrValue.startsWith('{') && !attrValue.endsWith('}')) {
                        // 如果看起来像token路径（包含点），自动添加大括号
                        if (attrValue.includes('.')) {
                            const tokenToResolve = `{${attrValue}}`;
                            resolvedValue = tokenToResolve
                        }
                    }
                    finalStyle[attrName] = resolvedValue;
                } else {
                    console.warn(`   ⚠️ 属性 "${attrName}" 不在支持列表中:`, variantConfig.supportedAttributes);
                }
            });
        }

        return finalStyle;
    }

    // 🔧 处理旧格式：直接返回样式对象（向后兼容）
    return variantConfig;
}

/**
 * 辅助函数：深度合并对象
 * @param {Object} target - 目标对象
 * @param {Object} source - 源对象
 * @returns {Object} 合并后的对象
 */
function deepMerge(target, source) {
    const output = { ...target };

    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!(key in target)) {
                    output[key] = source[key];
                } else {
                    output[key] = deepMerge(target[key], source[key]);
                }
            } else {
                output[key] = source[key];
            }
        });
    }

    return output;
}

/**
 * 辅助函数：检查值是否为对象
 * @param {*} item - 要检查的值
 * @returns {boolean} 是否为对象
 */
function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}

export {
    CSS_VARIABLE_SYSTEM,
    LAYOUT_CONSTANTS,
    COLOR_CONSTANTS,
    DIMENSION_CONSTANTS,
    FONT_CONSTANTS,
    DEFAULT_STYLE_CONFIG,
    setStyleConfig,
    resetStyleConfig,
    getElementStyleConfig
}; 