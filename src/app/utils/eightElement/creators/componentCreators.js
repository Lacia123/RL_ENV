/**
 * 组件创建器
 * 处理通用组件的创建、参数提取和样式应用
 */

import { generateUUID } from '../util.js';
import { DEFAULT_STYLE_CONFIG, LAYOUT_CONSTANTS } from '../styleConfig.js';
import resolveToken from '../../tokens/resolveToken.js';
import { createTextElement } from './textCreators.js';
import { createButtonElement } from './buttonCreators.js';
import { createBackgroundElement } from './backgroundCreators.js';
import { stripMarkdownFormatting, processExpression, extractMarkdownValue, extractSubTagValue } from './markdownUtils.js';

// 🔧 直接导入以避免动态 import（ES6 模块系统会处理循环依赖）
import { parseTemplateCardContent, createOrMergeTemplateElement, processRequiredContainers } from './cardCreators.js';

/**
 * 检测是否为组件标签（如 <simpleCard> 或 <halfCirclePrecent fillColor={...}>）
 * @param {string} line - 待检测的行
 * @returns {Object} 检测结果
 */
export function isComponentTag(line) {
    // 匹配开始标签: <componentName attr1="value1" attr2="value2"> 或 <componentName>
    // 注意：不匹配 card:, layout:, tab: 等已有的命名空间标签
    const componentTagMatch = line.trim().match(/^<(?!card:|layout:|tab:|\/)([\w]+)([^>]*)>$/);
    if (componentTagMatch) {
        const componentName = componentTagMatch[1];
        const attributesStr = componentTagMatch[2].trim();

        // 检查 component 配置
        const componentConfig = DEFAULT_STYLE_CONFIG.component && DEFAULT_STYLE_CONFIG.component[componentName];
        if (!componentConfig) {
            return { isComponentTag: false };
        }

        // 解析属性（支持多种格式）
        const attributes = parseAttributes(attributesStr);

        return {
            isComponentTag: true,
            componentName: componentName,
            attributes: attributes,
            isClosing: false
        };
    }

    // 匹配结束标签 </componentName>
    const closingTagMatch = line.trim().match(/^<\/([\w]+)>$/);
    if (closingTagMatch) {
        const componentName = closingTagMatch[1];
        
        // 检查 component 配置
        const componentConfig = DEFAULT_STYLE_CONFIG.component && DEFAULT_STYLE_CONFIG.component[componentName];
        if (componentConfig) {
            return {
                isComponentTag: true,
                componentName: componentName,
                attributes: {},
                isClosing: true
            };
        }
    }

    return { isComponentTag: false };
}

/**
 * 检测是否为带属性的模板标签（如 <halfCirclePrecent fillColor={...}>）
 * @param {string} line - 待检测的行
 * @returns {Object} 检测结果
 */
export function isTemplateTagWithAttributes(line) {
    // 匹配带属性的开始标签: <tagName attr1="value1" attr2={token.value}> 
    // 注意：不匹配 card:, layout:, tab: 等已有的命名空间标签
    const templateTagMatch = line.trim().match(/^<([\w\.]+)\s+([^>]+)>$/);
    if (templateTagMatch && !line.includes(':')) {
        const tagName = templateTagMatch[1];
        const attributesStr = templateTagMatch[2].trim();

        // 解析属性
        const attributes = parseAttributes(attributesStr);

        return {
            isTemplateTag: true,
            tagName: tagName,
            attributes: attributes,
            isClosing: false
        };
    }

    return { isTemplateTag: false };
}

/**
 * 解析属性字符串
 * @param {string} attributesStr - 属性字符串
 * @returns {Object} 属性对象
 */
function parseAttributes(attributesStr) {
    const attributes = {};
    if (!attributesStr) return attributes;
    
    // 匹配 key="value", key='value', key={token.value} 格式的属性
    // 使用更强大的正则来处理带点的 token（如 {color.basic.red.0}）
    const attrRegex = /(\w+)=(?:["']([^"']*?)["']|\{([^}]*?)\})/g;
    let attrMatch;
    while ((attrMatch = attrRegex.exec(attributesStr)) !== null) {
        const key = attrMatch[1];
        const value = attrMatch[2] || attrMatch[3]; // 支持引号和大括号格式
        attributes[key] = value;
    }
    
    return attributes;
}

/**
 * 提取组件标签块
 * @param {Array} lines - 文本行数组
 * @param {number} startIndex - 起始索引
 * @returns {Object} 提取结果
 */
export function extractComponentBlock(lines, startIndex) {
    const startLine = lines[startIndex];
    const startTagInfo = isComponentTag(startLine);

    if (!startTagInfo.isComponentTag || startTagInfo.isClosing) {
        console.error('无效的组件标签起始行');
        return { componentContent: '', componentName: '', attributes: {}, endIndex: startIndex };
    }

    const componentName = startTagInfo.componentName;
    const attributes = startTagInfo.attributes || {};
    const contentLines = [];
    let i = startIndex + 1;
    let foundEnd = false;

    // 查找对应的结束标签
    while (i < lines.length) {
        const line = lines[i];
        const tagInfo = isComponentTag(line);

        if (tagInfo.isComponentTag && tagInfo.isClosing && tagInfo.componentName === componentName) {
            foundEnd = true;
            i++;
            break;
        }

        contentLines.push(line);
        i++;
    }

    if (!foundEnd) {
        console.warn(`警告: 未找到组件标签 ${componentName} 的结束标签`);
    }

    return {
        componentContent: contentLines.join('\n').trim(),
        componentName: componentName,
        attributes: attributes,
        endIndex: i - 1
    };
}

/**
 * 提取组件参数值
 * @param {Object} parameterDefinitions - 参数定义对象（来自组件配置的 parameters）
 * @param {Object} markdownData - Markdown数据（包含 type 和 content）
 * @param {string} content - 内容
 * @param {Object} externalParameters - 外部传递的参数值（来自使用方的 parameters 或标签属性）
 * @returns {Object} 参数值对象 { paramName: value }
 */
export function extractComponentParameters(parameterDefinitions, markdownData, content, externalParameters = {}) {
    const paramValues = {};
    
    if (!parameterDefinitions) {
        return paramValues;
    }
    
    console.log('🔍 开始提取组件参数...');
    console.log('  参数定义:', parameterDefinitions);
    console.log('  外部参数:', externalParameters);
    console.log('  内容:', content);
    
    // 遍历所有参数定义
    for (const [paramName, paramConfig] of Object.entries(parameterDefinitions)) {
        let value = null;
        let valueSource = '';
        
        // 处理不同的参数来源
        if (paramConfig.source === 'outer') {
            // 从外部参数中获取值
            if (externalParameters && externalParameters.hasOwnProperty(paramName)) {
                value = externalParameters[paramName];
                valueSource = '外部属性';
                
                // 处理 token 格式
                value = normalizeTokenValue(value);
                if (value !== externalParameters[paramName]) {
                    valueSource += ' (转换为 token)';
                }
            } else if (paramConfig.default !== undefined) {
                // 使用默认值
                value = paramConfig.default;
                valueSource = '默认值';
            } else {
                console.warn(`⚠️ 外部参数 "${paramName}" 未提供，且没有默认值`);
                continue;
            }
        } else if (markdownData && paramConfig.source === markdownData.type) {
            // 从 markdown 内容中提取
            value = content;
            valueSource = 'markdown 数据';
            
            // 如果有 expression，应用表达式处理
            if (paramConfig.expression) {
                value = processExpression(value, paramConfig.expression);
                valueSource += ' (经过表达式处理)';
            }
        } else {
            // 尝试从 content 中的子标签或 markdown 格式提取参数值
            value = extractParameterFromContent(paramName, paramConfig, content);
            valueSource = value ? '从内容提取' : '';
        }
        
        // 如果还没有值，使用默认值
        if (value === null && paramConfig.default !== undefined) {
            value = paramConfig.default;
            valueSource = '默认值（回退）';
        }
        
        if (value !== null) {
            paramValues[paramName] = value;
            console.log(`  ✅ 参数 ${paramName} = "${value}" (来源: ${valueSource})`);
        } else {
            console.warn(`  ❌ 参数 ${paramName} 提取失败`);
        }
    }
    
    console.log('📦 最终提取的参数:', paramValues);
    return paramValues;
}

/**
 * 从内容中提取参数值
 * @param {string} paramName - 参数名
 * @param {Object} paramConfig - 参数配置
 * @param {string} content - 内容
 * @returns {string|null} 提取的值
 */
function extractParameterFromContent(paramName, paramConfig, content) {
    if (!content || !paramConfig.source) return null;
    
    // 尝试从子标签提取: <paramName>value</paramName>
    let value = extractSubTagValue(content, paramName);
    
    // 如果没有找到子标签，尝试从 markdown 格式提取
    if (!value) {
        value = extractMarkdownValue(content, paramConfig.source, paramConfig.expression);
    }
    
    // 如果找到值且有表达式，应用表达式处理
    if (value && paramConfig.expression) {
        const beforeExpression = value;
        value = processExpression(value, paramConfig.expression);
        console.log(`    表达式处理: ${beforeExpression} -> ${value}`);
    }
    
    return value;
}

/**
 * 规范化 token 值
 * @param {string} value - 原始值
 * @returns {string} 规范化后的值
 */
function normalizeTokenValue(value) {
    if (typeof value !== 'string') return value;
    
    // 如果已经是 token 格式，保持不变
    if (value.startsWith('{') && value.endsWith('}')) {
        console.log(`  📦 参数是 token 格式: ${value}`);
        return value;
    }
    
    // 如果看起来像 token 路径（如 color.basic.red.0），添加大括号
    if (value.includes('.') && !value.startsWith('$')) {
        const tokenValue = `{${value}}`;
        console.log(`  📦 参数转换为 token 格式: ${tokenValue}`);
        return tokenValue;
    }
    
    return value;
}

/**
 * 应用参数到样式对象
 * @param {Object} style - 样式对象
 * @param {Object} paramValues - 参数值对象 { paramName: value }
 * @returns {Object} 应用参数后的样式对象
 */
export function applyParametersToStyle(style, paramValues) {
    if (!style || !paramValues || Object.keys(paramValues).length === 0) {
        return style;
    }
    
    const processedStyle = {};
    
    for (const [key, value] of Object.entries(style)) {
        if (typeof value === 'string') {
            // 处理字符串中的所有 $paramName 占位符（支持字符串中间的占位符）
            let processedValue = value;
            
            // 替换所有 $paramName 格式的占位符
            processedValue = processedValue.replace(/\$(\w+)/g, (match, paramName) => {
                if (paramValues.hasOwnProperty(paramName)) {
                    let paramValue = paramValues[paramName];
                    
                    // 如果参数值是 token 格式（如 {color.basic.red.0}），解析它
                    if (typeof paramValue === 'string' && paramValue.startsWith('{') && paramValue.endsWith('}')) {
                        const resolvedValue = resolveToken(paramValue);
                        console.log(`✅ 应用参数 ${paramName}: ${paramValue} -> ${resolvedValue}`);
                        return resolvedValue;
                    } else {
                        console.log(`✅ 应用参数 ${paramName}: ${paramValue}`);
                        return paramValue;
                    }
                } else {
                    console.warn(`⚠️ 未找到参数: ${paramName}，可用参数:`, Object.keys(paramValues));
                    return match; // 保持原样
                }
            });
            
            processedStyle[key] = processedValue;
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
 * 创建组件元素，支持引用通用组件配置
 * @param {string} content - 组件内容
 * @param {string} variant - 组件变体名称
 * @param {Object} markdownData - Markdown数据
 * @param {Object} styleOverride - 样式覆盖
 * @param {Object} externalParameters - 外部传递的参数（用于 source: 'outer' 的参数）
 * @param {string} currentMarkdown - 当前 markdown 内容
 * @returns {Object} 组件元素实例
 */
export function createComponentElement(content, variant, markdownData = null, styleOverride = null, externalParameters = null, currentMarkdown = '') {
    // 获取组件配置
    const componentConfig = DEFAULT_STYLE_CONFIG.component && DEFAULT_STYLE_CONFIG.component[variant];
    
    if (!componentConfig) {
        console.warn(`未找到组件变体 "${variant}" 的配置`);
        // 返回一个基础的文本元素作为回退
        return createTextElement(content);
    }
    
    // 如果组件配置有 metaType（如 text, button 等），说明这是一个元件引用，而不是模板组件
    // 应该直接创建对应的元件，如果有 style 则用容器包装
    if (componentConfig.metaType) {
        return createMetaTypeComponent(content, variant, componentConfig, markdownData, styleOverride, externalParameters, currentMarkdown);
    }
    
    // 模板组件：创建组件容器
    return createTemplateComponent(content, variant, componentConfig, markdownData, styleOverride, externalParameters, currentMarkdown);
}

/**
 * 创建 metaType 类型的组件（text, button, image 等）
 */
function createMetaTypeComponent(content, variant, componentConfig, markdownData, styleOverride, externalParameters, currentMarkdown) {
    // 提取参数（如果有 parameters 配置）
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
    
    // 应用参数到样式
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
        elementInstance = createButtonElement(content, buttonUrl, buttonVariant, currentMarkdown, null);
    } else if (componentConfig.metaType === 'image') {
        const imageUrl = markdownData?.url || '';
        elementInstance = createBackgroundElement(imageUrl, componentConfig.variant, null);
    }
    
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
                parameters: paramValues
            },
            layout: {
                style: {
                    display: LAYOUT_CONSTANTS.DISPLAY.FLEX,
                    layoutMode: LAYOUT_CONSTANTS.DIRECTION.VERTICAL,
                    layoutWrap: LAYOUT_CONSTANTS.WRAP.NO_WRAP,
                    boxSizing: "border-box",
                    height: "auto",
                    position: "relative"
                },
                classStyle: finalStyle,
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

/**
 * 创建模板组件
 */
function createTemplateComponent(content, variant, componentConfig, markdownData, styleOverride, externalParameters, currentMarkdown) {
    // 使用顶部导入的函数（ES6 模块系统处理循环依赖）
    
    // 提取组件参数（如果有 parameters 配置）
    let paramValues = {};
    if (componentConfig.parameters) {
        paramValues = extractComponentParameters(
            componentConfig.parameters, 
            markdownData, 
            content,
            externalParameters || {}
        );
    }
    
    // 应用参数到样式
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
                createOrMergeTemplateElement(
                    targetPath, 
                    content, 
                    componentConfig, 
                    containerMap, 
                    componentElement.layout.children,
                    null,
                    markdownData,
                    currentMarkdown // 🔧 修复：传递 currentMarkdown 参数
                );
            } else {
                console.warn(`组件 "${variant}" 的 markdownMapping 中没有定义 "${markdownData.type}" 的映射`);
            }
        } else {
            // 如果没有 markdownData，尝试使用 parseTemplateCardContent 解析完整的 markdown 内容
            const componentChildren = parseTemplateCardContent(content, componentConfig, true, currentMarkdown);
            
            if (componentChildren && componentChildren.length > 0) {
                componentElement.layout.children.push(...componentChildren);
            }
        }
    } else if (content) {
        // 如果没有markdownMapping，直接创建文本元素
        const textElement = createTextElement(content);
        componentElement.layout.children.push(textElement);
    }
    
    // 🔧 处理 required 容器：确保必需的样式承载容器被渲染
    if (componentConfig.required) {
        console.log(`  处理组件 "${variant}" 的 required 容器:`, componentConfig.required);
        processRequiredContainers(componentConfig, componentElement.layout.children, componentConfig, paramValues);
    }
    
    return componentElement;
}

