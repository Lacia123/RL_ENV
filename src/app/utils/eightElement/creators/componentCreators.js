/**
 * 组件创建器
 * 处理通用组件的创建、参数提取和样式应用
 */

import { generateUUID } from '../util.js';
import { DEFAULT_STYLE_CONFIG, LAYOUT_CONSTANTS } from '../styleConfig.js';
import { EVENT_NAME, EVENT_CONFIG } from '../eventConfig.js';
import { createNativeEventConfig } from '../eventUtils.js';
import resolveToken from '../../tokens/resolveToken.js';
import { createTextElement } from './textCreators.js';
import { createButtonElement } from './buttonCreators.js';
import { createBackgroundElement } from './backgroundCreators.js';
import { createAudioElement } from './audioCreators.js';
import { createVideoElement } from './videoCreators.js';
import { createChartElement, createTableElement, extractTableOrChartData, sortTableData, generateChartSvg, isTableOrChartData } from './tableCreators.js';
import { stripMarkdownFormatting, processExpression, extractMarkdownValue, extractSubTagValue } from './markdownUtils.js';

// 🔧 直接导入以避免动态 import（ES6 模块系统会处理循环依赖）
import { parseTemplateCardContent, createOrMergeTemplateElement, processRequiredContainers } from './cardCreators.js';

// 🆕 导入插槽管理器
import { generateSlotDataAttributes, separateConditionalStyles, validateSlotsConfig, checkRequiredSlots } from './slotManager.js';

// ==================== 🆕 Layout Modes 系统 ====================

/**
 * 生成简单的 hash 值用于确保 class 名称唯一性
 * @param {string} str - 要生成 hash 的字符串
 * @returns {number} hash 值
 */
function generateHash(str) {
    if (!str) return 0;
    return str.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) & 0xfffff, 0);
}

/**
 * 生成唯一的 group className，包含 hash 以避免不同组件 / 模式间的样式冲突
 * @param {string} componentName - 组件名称（如 heroCard, contentDisplayCard）
 * @param {string} modeName - 模式名称（如 default, withImage）
 * @param {string} groupName - group 名称（如 ctaRow）
 * @returns {string} 唯一的 className
 */
function generateGroupClassName(componentName, modeName, groupName) {
    const safeComponentName = componentName || 'component';
    const safeModeName = modeName || 'mode';
    const safeGroupName = groupName || 'group';
    const hashInput = `${safeComponentName}-${safeModeName}-${safeGroupName}`;
    const hash = Math.abs(generateHash(hashInput));
    return `group-${safeComponentName}-${safeGroupName}-hash${hash}`;
}

/**
 * 构建组件的起始标签字符串，如 <heroCard attr="value">
 * @param {string} variant - 组件名称 / 变体
 * @param {Object} attributes - 组件标签上的属性
 * @returns {string} 起始标签
 */
function buildComponentStartTag(variant, attributes = {}) {
    const parts = [];

    Object.entries(attributes || {}).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        const strValue = value.toString().trim();
        // 简化版：统一使用引号包裹属性值
        parts.push(`${key}="${strValue}"`);
    });

    const attrString = parts.join(' ');
    if (attrString) {
        return `<${variant} ${attrString}>`;
    }
    return `<${variant}>`;
}

/**
 * 构建组件的完整 markdown 片段：<Hero>...\ncontent\n...</Hero>
 */
function buildComponentMarkdownPayload(variant, content, attributes = {}) {
    const startTag = buildComponentStartTag(variant, attributes);
    const closingTag = `</${variant}>`;
    const body = content ? `\n${content}\n` : '\n';
    return `${startTag}${body}${closingTag}`;
}

/**
 * 为组件创建 UPDATE 事件（与卡片的 update 事件类似）
 * @param {string} componentId - 组件 ID
 * @param {string} variant - 组件变体名称
 * @param {string} content - 组件内部内容（不含组件标签）
 * @param {Object} attributes - 组件标签上的属性
 * @returns {Object|null} 事件配置
 */
function createComponentUpdateEvent(componentId, variant, content, attributes = {}) {
    if (!componentId) return null;

    const baseUpdateConfig = EVENT_CONFIG?.[EVENT_NAME.UPDATE];
    if (!baseUpdateConfig) return null;

    const eventConfig = JSON.parse(JSON.stringify(baseUpdateConfig));
    eventConfig.EventTargetId = componentId;

    if (!eventConfig.parameters) {
        eventConfig.parameters = {};
    }

    // 使用组件标签 + 内容构造完整的 markdown 片段
    eventConfig.parameters.markdown = buildComponentMarkdownPayload(variant, content, attributes);
    eventConfig.parameters.cardId = componentId;

    return eventConfig;
}

/**
 * 评估布局条件
 * @param {string} condition - 条件表达式 (如 'has:image', 'no:title', 'default')
 * @param {Set} actualSlots - 实际存在的插槽名称集合
 * @returns {boolean} 条件是否满足
 */
function evaluateLayoutCondition(condition, actualSlots) {
    if (!condition) return false;
    
    // 默认条件始终为 true
    if (condition === 'default') return true;
    
    // has:slotName - 插槽存在
    const hasMatch = condition.match(/^has:(\w+)$/);
    if (hasMatch) {
        const slotName = hasMatch[1];
        return actualSlots.has(slotName);
    }
    
    // no:slotName - 插槽不存在
    const noMatch = condition.match(/^no:(\w+)$/);
    if (noMatch) {
        const slotName = noMatch[1];
        return !actualSlots.has(slotName);
    }
    
    // 复合条件: has:image && has:title
    if (condition.includes('&&')) {
        const parts = condition.split('&&').map(p => p.trim());
        return parts.every(part => evaluateLayoutCondition(part, actualSlots));
    }
    
    // 复合条件: has:image || has:video
    if (condition.includes('||')) {
        const parts = condition.split('||').map(p => p.trim());
        return parts.some(part => evaluateLayoutCondition(part, actualSlots));
    }
    
    // count:slotName > 0
    const countMatch = condition.match(/^count:(\w+)\s*([><=]+)\s*(\d+)$/);
    if (countMatch) {
        const slotName = countMatch[1];
        const operator = countMatch[2];
        const threshold = parseInt(countMatch[3], 10);
        
        // 计算该类型插槽的数量（支持通配符如 button*）
        let count = 0;
        actualSlots.forEach(slot => {
            if (slot === slotName || slot.startsWith(slotName)) {
                count++;
            }
        });
        
        switch (operator) {
            case '>': return count > threshold;
            case '>=': return count >= threshold;
            case '<': return count < threshold;
            case '<=': return count <= threshold;
            case '==':
            case '=': return count === threshold;
            default: return false;
        }
    }
    
    console.warn(`⚠️ 无法解析条件: ${condition}`);
    return false;
}

/**
 * 选择合适的布局模式
 * @param {Array} layoutModes - 布局模式配置数组
 * @param {Set} actualSlots - 实际存在的插槽名称集合
 * @returns {Object|null} 选中的布局模式
 */
function selectLayoutMode(layoutModes, actualSlots) {
    if (!layoutModes || !Array.isArray(layoutModes)) {
        return null;
    }
    
    console.log(`\n🔍 选择布局模式，实际插槽:`, Array.from(actualSlots));
    
    // 按顺序检查条件，返回第一个满足的模式
    for (const mode of layoutModes) {
        const satisfied = evaluateLayoutCondition(mode.condition, actualSlots);
        console.log(`  检查模式 "${mode.name}" (${mode.condition}): ${satisfied ? '✅' : '❌'}`);
        
        if (satisfied) {
            console.log(`  🎯 选中模式: ${mode.name}`);
            return mode;
        }
    }
    
    // 如果没有模式满足，返回 null
    console.warn(`⚠️ 没有布局模式满足条件`);
    return null;
}

/**
 * 根据布局模式构建结构（支持嵌套分组）
 * @param {Object} mode - 选中的布局模式
 * @param {Map} slotElementsMap - 插槽元素映射 (slotName => element)
 * @param {Object} componentElement - 组件元素（用于访问layout.children）
 * @param {Object} componentConfig - 组件配置
 * @param {Set} actualSlots - 实际存在的插槽名称集合（用于条件评估）
 * @param {number} depth - 当前嵌套深度（用于调试）
 * @returns {Array} 构建后的子元素数组
 */
function buildStructureFromMode(mode, slotElementsMap, componentElement, componentConfig, actualSlots, depth = 0) {
    if (!mode || !mode.structure || !mode.structure.groups) {
        console.warn(`⚠️ 模式 "${mode.name}" 没有有效的 structure 配置`);
        return Array.from(slotElementsMap.values());
    }
    
    const indent = '  '.repeat(depth);
    console.log(`\n${indent}🏗️ [深度 ${depth}] 根据模式 "${mode.name}" 构建结构...`);
    
    // 🆕 如果没有传入 actualSlots，从 slotElementsMap 获取
    if (!actualSlots) {
        actualSlots = getActualSlotsFromMap(slotElementsMap);
    }

    // 提取组件名称用于生成唯一的 group className
    const componentName =
        (componentElement && componentElement._metadata && componentElement._metadata.componentName) ||
        componentConfig?.name ||
        'component';
    
    return buildGroups(
        mode.structure.groups,
        slotElementsMap,
        actualSlots,
        mode.name,
        componentName,
        componentConfig,
        depth
    );
}

/**
 * 递归构建分组（支持嵌套）
 * @param {Array} groups - 分组配置数组
 * @param {Map} slotElementsMap - 插槽元素映射
 * @param {Set} actualSlots - 实际存在的插槽名称集合
 * @param {string} modeName - 模式名称
 * @param {string} componentName - 组件名称（用于生成唯一的 group className）
 * @param {Object} componentConfig - 组件配置（用于访问 slotConfigs 等）
 * @param {number} depth - 当前嵌套深度
 * @returns {Array} 构建后的子元素数组
 */
function buildGroups(groups, slotElementsMap, actualSlots, modeName, componentName, componentConfig, depth = 0) {
    const indent = '  '.repeat(depth);
    const children = [];
    
    for (const group of groups) {
        // 🆕 检查分组条件（如果存在）
        if (group.condition) {
            const satisfied = evaluateLayoutCondition(group.condition, actualSlots);
            console.log(`${indent}  检查分组 "${group.name}" 条件 (${group.condition}): ${satisfied ? '✅' : '❌'}`);
            if (!satisfied) {
                console.log(`${indent}  ⏭️ 跳过不满足条件的分组: ${group.name}`);
                continue;
            }
        }
        
        console.log(`${indent}  处理分组: ${group.name}`, {
            slots: group.slots || [],
            hasContainer: !!group.type,
            hasNestedGroups: !!(group.groups && group.groups.length > 0)
        });
        
        // 🆕 如果分组有嵌套的 groups，递归处理
        if (group.groups && Array.isArray(group.groups) && group.groups.length > 0) {
            console.log(`${indent}  🔄 分组 "${group.name}" 包含嵌套分组，递归处理...`);
            
            // 递归构建嵌套分组
            const nestedChildren = buildGroups(
                group.groups,
                slotElementsMap,
                actualSlots,
                modeName,
                componentName,
                componentConfig,
                depth + 1
            );
            
            if (nestedChildren.length === 0) {
                console.log(`${indent}  ⚠️ 嵌套分组 "${group.name}" 没有任何元素，跳过`);
                continue;
            }
            
            // 创建容器包裹嵌套的子元素
            if (group.type === 'template') {
                const groupStyle = group.style ? { ...group.style } : {};
                console.log(`${indent}  📦 创建嵌套容器 "${group.name}"`);
                
                const containerElement = {
                    id: generateUUID(),
                    name: 'layout',
                    'file-type': 'template',
                    _metadata: {
                        isGroup: true,
                        groupName: group.name,
                        modeName: modeName,
                        isNested: depth > 0
                    },
                    layout: {
                        style: { ...groupStyle },
                        classStyle: groupStyle,
                        className: generateGroupClassName(componentName, modeName, group.name),
                        children: nestedChildren
                    }
                };
                
                children.push(containerElement);
            } else {
                // 无容器，直接添加嵌套的子元素
                children.push(...nestedChildren);
            }
        } 
        // 如果分组有 slots，处理插槽
        else if (group.slots && Array.isArray(group.slots)) {
            // 收集该分组中实际存在的插槽元素
            const groupElements = [];
            for (const slotPattern of group.slots) {
                const matched = collectSlotElements(slotPattern, slotElementsMap);
                if (matched.length > 0) {
                    matched.forEach(() => console.log(`${indent}    ✅ 添加插槽: ${slotPattern}`));
                    groupElements.push(...matched);
                } else {
                    console.log(`${indent}    ⏭️ 跳过不存在的插槽: ${slotPattern}`);
                }
            }
            
            if (groupElements.length === 0) {
                console.log(`${indent}  ⚠️ 分组 "${group.name}" 没有任何元素，跳过`);
                continue;
            }

            // 🆕 如果配置了 styleReference，则使用引用的 slot 样式对当前分组内的元素做样式覆盖
            if (group.styleReference && componentConfig && componentConfig.slotConfigs) {
                const refSlotConfig = componentConfig.slotConfigs[group.styleReference];
                if (refSlotConfig) {
                    const refStyles = refSlotConfig.variantStyle || {};
                    if (Object.keys(refStyles).length > 0) {
                        console.log(`${indent}  🎨 分组 "${group.name}" 使用 styleReference="${group.styleReference}" 覆盖样式`);
                        groupElements.forEach(el => {
                            if (!el || !el.layout) return;
                            // 只对有 slot 元数据的元素应用（避免误伤其他容器）
                            if (!el._metadata || !el._metadata.slotName) return;
                            
                            // 将引用样式合并到 classStyle 和 style，保证覆盖生效
                            el.layout.classStyle = {
                                ...(el.layout.classStyle || {}),
                                ...refStyles
                            };
                            el.layout.style = {
                                ...(el.layout.style || {}),
                                ...refStyles
                            };
                        });
                    }
                } else {
                    console.warn(`${indent}  ⚠️ styleReference "${group.styleReference}" 未在 slotConfigs 中找到`);
                }
            }
            
            // 如果指定了 type: 'template'，创建容器
            if (group.type === 'template') {
                const groupStyle = group.style ? { ...group.style } : {};
                console.log(`${indent}  📦 创建容器 "${group.name}"`);
                
                const containerElement = {
                    id: generateUUID(),
                    name: 'layout',
                    'file-type': 'template',
                    _metadata: {
                        isGroup: true,
                        groupName: group.name,
                        modeName: modeName,
                        isNested: depth > 0
                    },
                    layout: {
                        style: { ...groupStyle },
                        classStyle: groupStyle,
                        className: generateGroupClassName(componentName, modeName, group.name),
                        children: groupElements
                    }
                };
                
                console.log(`${indent}  ✅ 容器 "${group.name}" 创建完成，样式键:`, Object.keys(groupStyle));
                children.push(containerElement);
            } else {
                // 直接添加元素（无容器）
                console.log(`${indent}  ➕ 直接添加 ${groupElements.length} 个元素`);
                children.push(...groupElements);
            }
        } else {
            console.warn(`${indent}  ⚠️ 分组 "${group.name}" 既没有 slots 也没有 groups，跳过`);
        }
    }
    
    console.log(`${indent}  🎉 [深度 ${depth}] 结构构建完成，共 ${children.length} 个元素`);
    return children;
}

function collectSlotElements(slotPattern, slotElementsMap) {
    const results = [];
    if (!slotPattern) return results;
    
    if (slotPattern.endsWith('*')) {
        const base = slotPattern.slice(0, -1);
        for (const [key, element] of slotElementsMap.entries()) {
            if (matchesSlotPattern(key, element, base, true)) {
                results.push(element);
            }
        }
    } else {
        for (const [key, element] of slotElementsMap.entries()) {
            if (matchesSlotPattern(key, element, slotPattern, false)) {
                results.push(element);
                break;
            }
        }
    }
    
    return results;
}

function matchesSlotPattern(key, element, pattern, isWildcard) {
    const base = element?._metadata?.slotBaseName || element?._metadata?.slotName || key;
    if (isWildcard) {
        return key.startsWith(pattern) || base === pattern;
    }
    return key === pattern || base === pattern;
}

function getActualSlotsFromMap(slotElementsMap) {
    const actualSlots = new Set();
    slotElementsMap.forEach((element, key) => {
        actualSlots.add(key);
        const base = element?._metadata?.slotBaseName || element?._metadata?.slotName;
        if (base) {
            actualSlots.add(base);
        }
    });
    return actualSlots;
}

function resolveSlotConfig(slotName, slotConfigs = {}) {
    if (slotConfigs[slotName]) {
        return slotConfigs[slotName];
    }
    
    for (const [key, config] of Object.entries(slotConfigs)) {
        if (key.endsWith('*')) {
            const base = key.slice(0, -1);
            if (slotName.startsWith(base)) {
                return config;
            }
        }
    }
    
    return null;
}

// ==================== 插槽标签解析 ====================

/**
 * 检测是否为插槽标签（如 <image src="..."> 或 <title>）
 * @param {string} line - 待检测的行
 * @returns {Object} 检测结果
 */
export function isSlotTag(line) {
    const trimmedLine = line.trim();
    
    // 匹配结束标签: </slotName>
    const closingMatch = trimmedLine.match(/^<\/([\w]+)>$/);
    if (closingMatch) {
        return {
            isSlotTag: true,
            slotName: closingMatch[1],
            attributes: {},
            isSelfClosing: false,
            isClosing: true
        };
    }
    
    // 匹配自闭合标签: <slotName /> 或 <slotName attr="value" />
    const selfClosingMatch = trimmedLine.match(/^<([\w]+)([^>]*)\/>$/);
    if (selfClosingMatch) {
        const slotName = selfClosingMatch[1];
        const attributesStr = selfClosingMatch[2].trim();
        const attributes = parseAttributes(attributesStr);
        
        return {
            isSlotTag: true,
            slotName: slotName,
            attributes: attributes,
            isSelfClosing: true,
            isClosing: false
        };
    }
    
    // 匹配开始标签: <slotName> 或 <slotName attr="value">
    const openingMatch = trimmedLine.match(/^<([\w]+)([^>]*)>$/);
    if (openingMatch) {
        const slotName = openingMatch[1];
        const attributesStr = openingMatch[2].trim();
        const attributes = parseAttributes(attributesStr);
        
        return {
            isSlotTag: true,
            slotName: slotName,
            attributes: attributes,
            isSelfClosing: false,
            isClosing: false
        };
    }
    
    return { isSlotTag: false };
}

/**
 * 提取插槽标签内容
 * @param {Array} lines - 文本行数组
 * @param {number} startIndex - 起始索引
 * @returns {Object} 提取结果
 */
export function extractSlotContent(lines, startIndex) {
    const startLine = lines[startIndex];
    const startTagInfo = isSlotTag(startLine);
    
    if (!startTagInfo.isSlotTag || startTagInfo.isClosing) {
        return { slotContent: '', slotName: '', attributes: {}, endIndex: startIndex };
    }
    
    const slotName = startTagInfo.slotName;
    const attributes = startTagInfo.attributes;
    
    // 如果是自闭合标签，没有内容
    if (startTagInfo.isSelfClosing) {
        return {
            slotContent: '',
            slotName: slotName,
            attributes: attributes,
            endIndex: startIndex
        };
    }
    
    // 查找对应的结束标签
    const contentLines = [];
    let i = startIndex + 1;
    let foundEnd = false;
    
    while (i < lines.length) {
        const line = lines[i];
        const tagInfo = isSlotTag(line);
        
        if (tagInfo.isSlotTag && tagInfo.isClosing && tagInfo.slotName === slotName) {
            foundEnd = true;
            i++;
            break;
        }
        
        contentLines.push(line);
        i++;
    }
    
    if (!foundEnd) {
        console.warn(`警告: 未找到插槽标签 ${slotName} 的结束标签`);
    }
    
    return {
        slotContent: contentLines.join('\n').trim(),
        slotName: slotName,
        attributes: attributes,
        endIndex: i - 1
    };
}

/**
 * 解析单行中的插槽标签（如 <tag attr="val">content</tag>）
 * @param {string} line - 文本行
 * @returns {Object|null} 插槽数据或 null
 */
function parseSingleLineSlot(line) {
    const trimmedLine = line.trim();
    
    // 匹配单行标签: <slotName attr="value">content</slotName>
    // 或自闭合: <slotName attr="value" />
    const singleLineMatch = trimmedLine.match(/^<([\w]+)([^>]*)>(.*?)<\/\1>$/);
    if (singleLineMatch) {
        const slotName = singleLineMatch[1];
        const attributesStr = singleLineMatch[2].trim();
        const slotContent = singleLineMatch[3];
        const attributes = parseAttributes(attributesStr);
        
        return {
            slotName: slotName,
            slotContent: slotContent,
            attributes: attributes,
            isSingleLine: true
        };
    }
    
    // 匹配自闭合标签
    const selfClosingMatch = trimmedLine.match(/^<([\w]+)([^>]*)\/>$/);
    if (selfClosingMatch) {
        const slotName = selfClosingMatch[1];
        const attributesStr = selfClosingMatch[2].trim();
        const attributes = parseAttributes(attributesStr);
        
        return {
            slotName: slotName,
            slotContent: '',
            attributes: attributes,
            isSingleLine: true
        };
    }
    
    return null;
}

/**
 * 解析组件内容中的所有插槽标签
 * @param {string} content - 组件内容
 * @returns {Array} 插槽数据数组 [{slotName, content, attributes}, ...]
 */
export function parseSlotTags(content) {
    const lines = content.split('\n');
    const slots = [];
    const slotNameCounts = {};
    let i = 0;
    
    console.log(`\n🔍 开始解析插槽标签...`);
    console.log(`  总行数: ${lines.length}`);
    
    while (i < lines.length) {
        const line = lines[i];
        console.log(`  检查行 ${i}: "${line.trim()}"`);
        
        // 首先尝试解析单行标签
        const singleLineSlot = parseSingleLineSlot(line);
        if (singleLineSlot) {
            console.log(`  ✅ 发现单行插槽: ${singleLineSlot.slotName}`);
            console.log(`     内容: "${singleLineSlot.slotContent}"`);
            console.log(`     属性:`, singleLineSlot.attributes);
            enrichSlotName(singleLineSlot, slotNameCounts);
            slots.push(singleLineSlot);
            i++;
            continue;
        }
        
        // 尝试解析多行标签
        const tagInfo = isSlotTag(line);
        if (tagInfo.isSlotTag && !tagInfo.isClosing) {
            console.log(`  发现多行插槽标签: ${tagInfo.slotName} (行 ${i})`);
            const slotData = extractSlotContent(lines, i);
            console.log(`    内容: "${slotData.slotContent}"`);
            console.log(`    属性:`, slotData.attributes);
            enrichSlotName(slotData, slotNameCounts);
            slots.push(slotData);
            i = slotData.endIndex + 1;
        } else {
            i++;
        }
    }
    
    console.log(`  ✅ 共解析到 ${slots.length} 个插槽`);
    return slots;
}

function enrichSlotName(slotData, slotNameCounts) {
    const baseName = slotData.slotName;
    slotNameCounts[baseName] = (slotNameCounts[baseName] || 0) + 1;
    const count = slotNameCounts[baseName];
    if (count === 1) {
        slotData.baseSlotName = baseName;
        return;
    }
    slotData.baseSlotName = baseName;
    slotData.slotName = `${baseName}#${count}`;
}

/**
 * 根据 slotConfig 创建八要素
 * @param {string} slotName - 插槽名称
 * @param {Object} slotConfig - 插槽配置
 * @param {Object} slotData - 插槽数据 {slotContent, attributes}
 * @param {string} currentMarkdown - 当前 markdown 内容
 * @returns {Object|null} 八要素对象
 */
export function createElementFromSlotConfig(slotName, slotConfig, slotData, currentMarkdown = '') {
    if (!slotConfig) {
        console.warn(`未找到插槽 "${slotName}" 的配置`);
        return null;
    }
    
    const { slotContent, attributes } = slotData;
    const baseSlotName = slotData?.baseSlotName || slotName;
    
    console.log(`\n🎰 创建插槽元素: ${slotName}`);
    if (baseSlotName !== slotName) {
        console.log(`  基础插槽名: ${baseSlotName}`);
    }
    console.log('  配置:', slotConfig);
    console.log('  内容:', slotContent);
    console.log('  属性:', attributes);
    
    // 情况1: 纯容器（只有 type: 'template' 和 style）
    if (slotConfig.type === 'template' && !slotConfig.metaType) {
        console.log('  模式: 纯容器');
        
        const containerElement = {
            dataKeys: [],
            name: "layout",
            "name-zh": `插槽容器-${slotName}`,
            "file-type": "template",
            theme: "default",
            _metadata: {
                actualType: 'slotContainer'
            },
            layout: {
                style: slotConfig.style || {},
                classStyle: {},
                className: `slot-${slotName}`,
                children: []
            },
            description: `插槽容器 - ${slotName}`,
            id: generateUUID(),
            events: [{}]
        };
        annotateElementSlotMetadata(containerElement, slotName, baseSlotName);
        
        // 如果有内容，创建文本元素作为子元素
        if (slotContent) {
            const textElement = createTextElement(slotContent, 'p', {}, null);
            containerElement.layout.children.push(textElement);
        }
        
        console.log(`  ✅ 创建纯容器成功`);
        return containerElement;
    }
    
    // 情况2: 元素+容器（有 type: 'template' 和 metaType）
    if (slotConfig.type === 'template' && slotConfig.metaType) {
        console.log('  模式: 元素+容器');
        
        // 先创建内部元素（可能是多个，比如 actions 里的多个按钮）
        const innerElements = [];
        
        if (slotConfig.metaType === 'text') {
            console.log(`    创建文本元素: variant=${slotConfig.variant}`);
            const textElement = createTextElement(
                slotContent || '',
                slotConfig.variant || 'p',
                {},  // richTextOptions
                slotConfig.variantStyle || null  // customStyles
            );
            
            // 🆕 处理 nativeEvent 和 data 属性
            if (attributes && attributes.nativeEvent && attributes.data) {
                const nativeEventConfig = createNativeEventConfig(attributes.nativeEvent, attributes.data);
                if (nativeEventConfig && textElement) {
                    if (textElement.events.length === 1 && Object.keys(textElement.events[0]).length === 0) {
                        textElement.events[0] = nativeEventConfig;
                    } else {
                        textElement.events.push(nativeEventConfig);
                    }
                }
            }
            
            if (textElement) {
                innerElements.push(textElement);
            }
        } else if (slotConfig.metaType === 'button') {
            const nestedButtons = extractInlineButtons(slotContent);
            
            if (nestedButtons.length > 0) {
                console.log(`    在插槽 "${slotName}" 中解析到 ${nestedButtons.length} 个 button 标签`);
                nestedButtons.forEach((buttonDef, index) => {
                    const buttonElement = buildButtonElementFromDefinition(
                        slotConfig,
                        buttonDef.content,
                        buttonDef.attributes,
                        attributes,
                        currentMarkdown,
                        `${slotName}-${index}`
                    );
                    
                    if (buttonElement) {
                        innerElements.push(buttonElement);
                    }
                });
            } else {
                const buttonElement = buildButtonElementFromDefinition(
                    slotConfig,
                    slotContent,
                    {}, // 没有内部属性
                    attributes,
                    currentMarkdown,
                    slotName
                );
                
                if (buttonElement) {
                    innerElements.push(buttonElement);
                }
            }
        } else if (slotConfig.metaType === 'image') {
            const imageUrl = attributes.src || '';
            console.log(`    创建图片元素: src=${imageUrl}, variant=${slotConfig.variant}`);
            const imageElement = createBackgroundElement(
                imageUrl,
                slotConfig.variant || 'normal'
            );
            
            // 🆕 应用 variantStyle 来覆盖默认样式（特别是 padding 和 margin）
            if (slotConfig.variantStyle && imageElement) {
                imageElement.layout = imageElement.layout || {};
                imageElement.layout.style = {
                    ...(imageElement.layout.style || {}),
                    ...slotConfig.variantStyle
                };
            }
            
            // 🆕 处理 nativeEvent 和 data 属性
            if (attributes && attributes.nativeEvent && attributes.data) {
                const nativeEventConfig = createNativeEventConfig(attributes.nativeEvent, attributes.data);
                if (nativeEventConfig && imageElement) {
                    if (imageElement.events.length === 1 && Object.keys(imageElement.events[0]).length === 0) {
                        imageElement.events[0] = nativeEventConfig;
                    } else {
                        imageElement.events.push(nativeEventConfig);
                    }
                }
            }
            
            if (imageElement) {
                innerElements.push(imageElement);
            }
        } else if (slotConfig.metaType === 'chart') {
            const chartElement = buildChartElementFromContent(
                slotName,
                slotConfig,
                slotContent,
                attributes
            );
            if (chartElement) {
                innerElements.push(chartElement);
            }
        } else if (slotConfig.metaType === 'feedItem') {
            const feedItemElement = buildFeedItemLayout(
                slotName,
                slotConfig,
                slotContent,
                attributes,
                currentMarkdown
            );
            if (feedItemElement) {
                innerElements.push(feedItemElement);
            }
        } else if (slotConfig.metaType === 'table') {
            console.log(`    创建表格元素: content length=${slotContent?.length || 0}`);
            const tableElement = createTableElement(slotContent || '');
            if (tableElement) {
                innerElements.push(tableElement);
            }
        }
        
        if (innerElements.length === 0) {
            console.warn(`  ❌ 无法创建插槽 "${slotName}" 的内部元素`);
            return null;
        }
        
        // 创建容器包装元素
        const containerElement = {
            dataKeys: [],
            name: "layout",
            "name-zh": `插槽容器-${slotName}`,
            "file-type": "template",
            theme: "default",
            _metadata: {
                actualType: 'slotContainer',
                containedElementType: slotConfig.metaType
            },
            layout: {
                style: slotConfig.style || {},
                classStyle: {},
                className: `slot-${slotName}`,
                children: innerElements
            },
            description: `插槽容器 - ${slotName}`,
            id: generateUUID(),
            events: [{}]
        };
        annotateElementSlotMetadata(containerElement, slotName, baseSlotName);
        
        console.log(`  ✅ 创建元素+容器成功`);
        return containerElement;
    }
    
    // 情况3: 直接元素（只有 metaType，没有 type: 'template'）
    if (slotConfig.metaType && !slotConfig.type) {
        console.log('  模式: 直接元素');
        
        let element = null;
        
        if (slotConfig.metaType === 'text') {
            console.log(`    创建文本元素: variant=${slotConfig.variant}`);
            element = createTextElement(
                slotContent || '',
                slotConfig.variant || 'p',
                {},  // richTextOptions
                slotConfig.variantStyle || null  // customStyles
            );
            
            // 🆕 处理 nativeEvent 和 data 属性
            if (attributes && attributes.nativeEvent && attributes.data) {
                const nativeEventConfig = createNativeEventConfig(attributes.nativeEvent, attributes.data);
                if (nativeEventConfig && element) {
                    if (element.events.length === 1 && Object.keys(element.events[0]).length === 0) {
                        element.events[0] = nativeEventConfig;
                    } else {
                        element.events.push(nativeEventConfig);
                    }
                }
            }
        } else if (slotConfig.metaType === 'button') {
            const buttonUrl = attributes.href || '#';
            const buttonText = slotContent || '';
            console.log(`    创建按钮元素: text="${buttonText}", url=${buttonUrl}, variant=${slotConfig.variant}`);
            element = createButtonElement(
                buttonText,
                buttonUrl,
                slotConfig.variant || 'primary',
                currentMarkdown
                // displayText - 不传递第5个参数，让 createButtonElement 内部处理 removeEventSyntax
            );
            
            // 如果有 variantStyle，应用到按钮的 classStyle
            if (slotConfig.variantStyle && element) {
                Object.assign(element.layout.classStyle, slotConfig.variantStyle);
            }
            
            // 🆕 处理 nativeEvent 和 data 属性
            if (attributes && attributes.nativeEvent && attributes.data) {
                const nativeEventConfig = createNativeEventConfig(attributes.nativeEvent, attributes.data);
                if (nativeEventConfig && element) {
                    if (element.events.length === 1 && Object.keys(element.events[0]).length === 0) {
                        element.events[0] = nativeEventConfig;
                    } else {
                        element.events.push(nativeEventConfig);
                    }
                }
            }
        } else if (slotConfig.metaType === 'image') {
            const imageUrl = attributes.src || '';
            console.log(`    创建图片元素: src=${imageUrl}, variant=${slotConfig.variant}`);
            element = createBackgroundElement(
                imageUrl,
                slotConfig.variant || 'normal'
            );
            
            // 🆕 应用 variantStyle 来覆盖默认样式（特别是 padding 和 margin）
            if (slotConfig.variantStyle && element) {
                element.layout = element.layout || {};
                element.layout.style = {
                    ...(element.layout.style || {}),
                    ...slotConfig.variantStyle
                };
            }
            
            // 🆕 处理 nativeEvent 和 data 属性
            if (attributes && attributes.nativeEvent && attributes.data) {
                const nativeEventConfig = createNativeEventConfig(attributes.nativeEvent, attributes.data);
                if (nativeEventConfig && element) {
                    if (element.events.length === 1 && Object.keys(element.events[0]).length === 0) {
                        element.events[0] = nativeEventConfig;
                    } else {
                        element.events.push(nativeEventConfig);
                    }
                }
            }
        } else if (slotConfig.metaType === 'audio') {
            const audioSrc = attributes.src || '';
            console.log(`    创建音频元素: src=${audioSrc}, variant=${slotConfig.variant}`);
            element = createAudioElement(
                audioSrc,
                attributes
            );
        } else if (slotConfig.metaType === 'video') {
            const videoSrc = attributes.src || '';
            console.log(`    创建视频元素: src=${videoSrc}, variant=${slotConfig.variant}`);
            element = createVideoElement(
                videoSrc,
                attributes
            );
        } else if (slotConfig.metaType === 'chart') {
            element = buildChartElementFromContent(
                slotName,
                slotConfig,
                slotContent,
                attributes
            );
        } else if (slotConfig.metaType === 'table') {
            console.log(`    创建表格元素: content length=${slotContent?.length || 0}`);
            // 使用 createTableElement 创建表格元素
            element = createTableElement(slotContent || '');
        }
        
        if (element) {
            // 为直接元素添加 slotName 元数据
            annotateElementSlotMetadata(element, slotName, baseSlotName);
            console.log(`  ✅ 创建直接元素成功`);
        } else {
            console.warn(`  ❌ 创建元素失败`);
        }
        return element;
    }
    
    console.warn(`插槽 "${slotName}" 的配置格式不正确`);
    return null;
}

function annotateElementSlotMetadata(element, slotName, baseSlotName) {
    if (!element) return;
    if (!element._metadata) {
        element._metadata = {};
    }
    element._metadata.slotName = baseSlotName;
    element._metadata.slotBaseName = baseSlotName;
    element._metadata.slotUniqueName = slotName;
}

/**
 * 解析插槽内容中的 button 标签
 * @param {string} slotContent - 插槽内容
 * @returns {Array<{content: string, attributes: Object}>}
 */
function extractInlineButtons(slotContent) {
    if (!slotContent || !slotContent.includes('<button')) {
        return [];
    }
    
    const buttons = [];
    const buttonRegex = /<button\b([^>]*)>([\s\S]*?)<\/button>/gi;
    let match;
    
    while ((match = buttonRegex.exec(slotContent)) !== null) {
        const attributesStr = (match[1] || '').trim();
        const content = (match[2] || '').trim();
        const attributes = parseAttributes(attributesStr);
        
        if (content) {
            buttons.push({ content, attributes });
        }
    }
    
    return buttons;
}

/**
 * 根据按钮定义创建按钮元素
 */
function buildButtonElementFromDefinition(slotConfig, buttonText, buttonAttributes = {}, outerAttributes = {}, currentMarkdown = '', debugLabel = '') {
    const finalText = (buttonText || '').trim();
    
    if (!finalText) {
        console.warn(`  ⚠️ 按钮${debugLabel ? ` (${debugLabel})` : ''} 内容为空，跳过`);
        return null;
    }
    
    const buttonUrl = buttonAttributes.href || buttonAttributes.url || outerAttributes.href || outerAttributes.url || '#';
    const buttonVariant = buttonAttributes.variant || slotConfig.variant || 'primary';
    
    console.log(`    创建按钮元素${debugLabel ? ` [${debugLabel}]` : ''}: text="${finalText}", url=${buttonUrl}, variant=${buttonVariant}`);
    
    const buttonElement = createButtonElement(
        finalText,
        buttonUrl,
        buttonVariant,
        currentMarkdown
        // displayText - 不传递第5个参数，让 createButtonElement 内部处理 removeEventSyntax
    );
    
    // 🆕 处理 nativeEvent 和 data 属性 (优先使用内部属性，其次使用外部属性)
    const nativeEvent = buttonAttributes.nativeEvent || outerAttributes.nativeEvent;
    const data = buttonAttributes.data || outerAttributes.data;
    
    if (nativeEvent && data) {
        const nativeEventConfig = createNativeEventConfig(nativeEvent, data);
        if (nativeEventConfig && buttonElement) {
            if (buttonElement.events.length === 1 && Object.keys(buttonElement.events[0]).length === 0) {
                buttonElement.events[0] = nativeEventConfig;
            } else {
                buttonElement.events.push(nativeEventConfig);
            }
        }
    }
    
    applyVariantStyleToButton(buttonElement, slotConfig.variantStyle);
    
    return buttonElement;
}

/**
 * 将插槽级别的 variantStyle 应用到按钮元素
 */
function applyVariantStyleToButton(buttonElement, variantStyle) {
    if (!buttonElement || !variantStyle) {
        return;
    }
    
    if (!buttonElement.layout) {
        buttonElement.layout = {};
    }
    
    buttonElement.layout.classStyle = {
        ...(buttonElement.layout.classStyle || {}),
        ...variantStyle
    };
}

/**
 * 创建图表插槽元素
 */
function buildChartElementFromContent(slotName, slotConfig, slotContent, attributes = {}) {
    const trimmedContent = (slotContent || '').trim();
    if (!trimmedContent) {
        console.warn(`  ⚠️ 插槽 "${slotName}" 的图表内容为空，跳过`);
        return null;
    }

    const chartType = attributes.chart || 'line';
    const chartTitle = attributes.title || null;
    const sortOrder = attributes.sort || null;
    const tableLines = trimmedContent
        .split('\n')
        .map(line => line.trimEnd())
        .filter(line => line.trim().length > 0);

    if (tableLines.length === 0) {
        console.warn(`  ⚠️ 插槽 "${slotName}" 的图表缺少表格数据，跳过`);
        return null;
    }

    const headerParts = [chartType];
    if (chartTitle) {
        headerParts.push(chartTitle);
    }
    if (sortOrder) {
        headerParts.push(sortOrder);
    }
    const syntheticHeader = `[chart:${headerParts.join('|')}]`;
    const syntheticLines = [syntheticHeader, ...tableLines];

    // 🆕 先检查是否符合表格/图表数据的基本格式
    const { isData } = isTableOrChartData(syntheticLines);

    if (!isData) {
        console.warn(`  ⚠️ 插槽 "${slotName}" 的内容不符合图表数据格式，跳过`);
        return null;
    }

    try {
        const chartData = extractTableOrChartData(syntheticLines, 0);
        const finalChartType = chartData.chartType || chartType;
        const finalChartTitle = chartData.chartTitle || chartTitle;
        const finalSortOrder = sortOrder || chartData.sortOrder;
        const sortedTableData = sortTableData(chartData.tableData, finalSortOrder);

        // 🆕 校验解析结果是否有有效表格数据
        const hasValidTable =
            Array.isArray(chartData.tableData) &&
            chartData.tableData.length > 0 &&
            Array.isArray(chartData.tableData[0]) &&
            chartData.tableData[0].length > 0;

        if (!hasValidTable) {
            console.warn(`  ⚠️ 插槽 "${slotName}" 的图表数据解析为空，跳过`);
            return null;
        }

        const chartElement = createChartElement(
            finalChartType,
            '',
            sortedTableData,
            chartData.tableContent,
            slotConfig.variant || 'mini',
            finalChartTitle,
            []
        );

        const chartStyleConfig = {
            variant: slotConfig.variant || 'mini',
            title: chartElement.layout?.title,
            legend: chartElement.layout?.legend,
            axis: chartElement.layout?.axis
        };

        const svgContent = generateChartSvg(finalChartType, sortedTableData, chartStyleConfig, finalChartTitle);
        chartElement.svgContent = svgContent;

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
            svgContent
        };

        chartElement.layout = chartElement.layout || {};
        chartElement.layout.children = chartElement.layout.children || [];
        chartElement.layout.children.push(svgElement);

        chartElement._metadata = chartElement._metadata || {};
        chartElement._metadata.slotName = slotName;

        console.log(`  ✅ 创建图表元素成功: type=${finalChartType}, slots=${slotName}`);
        return chartElement;
    } catch (error) {
        console.error(`  ❌ 创建图表元素失败 (${slotName}):`, error);
        return null;
    }
}

function buildFeedItemLayout(slotName, slotConfig, slotContent = '', attributes = {}, currentMarkdown = '') {
    const itemStyles = slotConfig.itemStyles || {};
    const subSlots = slotConfig.subSlots || {};
    const parsed = parseFeedItemSlotContent(slotContent || '', subSlots);

    const subSlotElements = new Map();
    const subSlotPresence = new Set();

    Object.keys(subSlots).forEach(subSlotName => {
        const element = createElementForSubSlot(
            subSlotName,
            parsed[subSlotName],
            subSlots[subSlotName],
            parsed.fallbackText,
            attributes,
            currentMarkdown
        );

        if (element) {
            subSlotElements.set(subSlotName, element);
            subSlotPresence.add(subSlotName);
        }
    });

    if (!subSlotElements.has('text') && parsed.fallbackText && subSlots.text) {
        const fallbackElement = createElementForSubSlot(
            'text',
            { content: parsed.fallbackText, attributes: {} },
            subSlots.text,
            parsed.fallbackText,
            attributes,
            currentMarkdown
        );

        if (fallbackElement) {
            subSlotElements.set('text', fallbackElement);
            subSlotPresence.add('text');
        }
    }

    const rowElement = createFeedLayoutNode(itemStyles.row || {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: '12px'
    }, `信息列表行-${slotName}`);

    const layoutDefinition = getFeedItemLayoutDefinition(slotConfig);
    buildFeedItemSections(layoutDefinition, rowElement, subSlotElements, subSlotPresence);

    if (subSlotElements.size > 0) {
        const residualContainer = createFeedLayoutNode({}, '信息列表补充区域');
        subSlotElements.forEach(element => {
            residualContainer.layout.children.push(element);
        });

        if (residualContainer.layout.children.length > 0) {
            rowElement.layout.children.push(residualContainer);
        }
    }

    return rowElement;
}

function createFeedLayoutNode(style = {}, label = '信息列表布局', children = []) {
    const id = generateUUID();
    const computedStyle = { ...(style || {}) };
    return {
        dataKeys: [],
        name: "layout",
        "name-zh": label,
        "file-type": "template",
        theme: "default",
        layout: {
            style: computedStyle,
            classStyle: {},
            className: `feed-${id}`,
            children: children ? [...children] : []
        },
        description: label,
        id,
        events: [{}]
    };
}

function parseFeedItemSlotContent(rawContent = '', subSlotConfigs = {}) {
    const tagNames = Object.keys(subSlotConfigs);
    const result = {};

    if (tagNames.length === 0) {
        return { fallbackText: rawContent.trim() };
    }

    tagNames.forEach(tag => {
        result[tag] = extractFeedSubTag(rawContent, tag);
    });

    let cleaned = rawContent;
    tagNames.forEach(tag => {
        const openCloseRegex = new RegExp(`<${tag}(\\s[^>]*)?>[\\s\\S]*?<\\/${tag}>`, 'gi');
        const selfClosingRegex = new RegExp(`<${tag}(\\s[^>]*)?\\/>`, 'gi');
        cleaned = cleaned.replace(openCloseRegex, ' ');
        cleaned = cleaned.replace(selfClosingRegex, ' ');
    });

    cleaned = cleaned.replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    result.fallbackText = cleaned;
    return result;
}

function extractFeedSubTag(rawContent = '', tagName = '') {
    if (!rawContent || !tagName) return null;

    const openCloseRegex = new RegExp(`<${tagName}(\\s[^>]*)?>([\\s\\S]*?)<\/${tagName}>`, 'i');
    const openCloseMatch = rawContent.match(openCloseRegex);
    if (openCloseMatch) {
        return {
            content: (openCloseMatch[2] || '').trim(),
            attributes: parseAttributes(openCloseMatch[1] || '')
        };
    }

    const selfClosingRegex = new RegExp(`<${tagName}(\\s[^>]*)?\\/>`, 'i');
    const selfClosingMatch = rawContent.match(selfClosingRegex);
    if (selfClosingMatch) {
        return {
            content: '',
            attributes: parseAttributes(selfClosingMatch[1] || '')
        };
    }

    return null;
}

function buildFeedItemSections(layoutDefinition = [], rowElement, slotElementsMap, slotPresenceSet) {
    if (!Array.isArray(layoutDefinition) || layoutDefinition.length === 0) {
        slotElementsMap.forEach(element => rowElement.layout.children.push(element));
        slotElementsMap.clear();
        return;
    }

    layoutDefinition.forEach(section => {
        if (section.condition && !evaluateLayoutCondition(section.condition, slotPresenceSet)) {
            return;
        }

        const sectionNode = createFeedLayoutNode(section.style || {}, `信息列表-${section.name || 'section'}`);
        let added = false;

        if (Array.isArray(section.slotGroups)) {
            section.slotGroups.forEach(group => {
                if (group.condition && !evaluateLayoutCondition(group.condition, slotPresenceSet)) {
                    return;
                }

                const groupNode = createFeedLayoutNode(group.style || {}, `信息列表-${section.name || 'section'}-${group.name || 'group'}`);
                const groupAdded = appendSlotsToContainer(group.slots, groupNode, slotElementsMap);
                if (groupAdded) {
                    sectionNode.layout.children.push(groupNode);
                    added = true;
                }
            });
        }

        if (appendSlotsToContainer(section.slots, sectionNode, slotElementsMap)) {
            added = true;
        }

        if (added && sectionNode.layout.children.length > 0) {
            rowElement.layout.children.push(sectionNode);
        }
    });
}

function appendSlotsToContainer(slotNames = [], containerNode, slotElementsMap) {
    if (!Array.isArray(slotNames) || slotNames.length === 0) {
        return false;
    }

    let added = false;
    slotNames.forEach(slotName => {
        const element = slotElementsMap.get(slotName);
        if (element) {
            containerNode.layout.children.push(element);
            slotElementsMap.delete(slotName);
            added = true;
        }
    });

    return added;
}

function getFeedItemLayoutDefinition(slotConfig = {}) {
    if (Array.isArray(slotConfig.itemLayout) && slotConfig.itemLayout.length > 0) {
        return slotConfig.itemLayout;
    }

    return [
        {
            name: 'leading',
            condition: 'has:avatar',
            slots: ['avatar']
        },
        {
            name: 'content',
            slotGroups: [
                {
                    name: 'textRow',
                    slots: ['icon', 'text']
                }
            ]
        },
        {
            name: 'meta',
            condition: 'has:timestamp || has:cta_inline',
            slots: ['timestamp', 'cta_inline']
        }
    ];
}

function createElementForSubSlot(subSlotName, slotData, subSlotConfig, fallbackText = '', parentAttributes = {}, currentMarkdown = '') {
    if (!subSlotConfig) {
        return null;
    }

    const metaType = subSlotConfig.metaType || 'text';
    let content = (slotData?.content || '').trim();
    const slotAttributes = { ...(slotData?.attributes || {}) };

    if (!content && subSlotName === 'text' && fallbackText) {
        content = fallbackText;
    }

    if (metaType === 'text') {
        if (!content) return null;
        return createTextElement(
            content,
            subSlotConfig.variant || 'p',
            {},
            subSlotConfig.variantStyle || null
        );
    }

    if (metaType === 'image') {
        const src = slotAttributes.src || content || parentAttributes[`${subSlotName}`] || parentAttributes[`${subSlotName}_src`] || '';
        if (!src) return null;

        const imageElement = createBackgroundElement(src, subSlotConfig.variant || 'normal');
        if (subSlotConfig.variantStyle) {
            imageElement.layout = imageElement.layout || {};
            // 🆕 应用 variantStyle 到 classStyle（用于样式属性）
            imageElement.layout.classStyle = {
                ...(imageElement.layout.classStyle || {}),
                ...subSlotConfig.variantStyle
            };
            // 🆕 也应用到 style 中以覆盖 layout column 的默认 padding/margin
            imageElement.layout.style = {
                ...(imageElement.layout.style || {}),
                ...subSlotConfig.variantStyle
            };
        }
        return imageElement;
    }

    if (metaType === 'button') {
        const label = content || subSlotConfig.defaultText || '';
        if (!label) return null;

        const href = slotAttributes.href || slotAttributes.url || parentAttributes[`${subSlotName}_href`] || parentAttributes.href || '#';
        const variant = slotAttributes.variant || subSlotConfig.variant || parentAttributes[`${subSlotName}_variant`] || 'link';

        const buttonElement = createButtonElement(label, href, variant, currentMarkdown, label);
        if (subSlotConfig.variantStyle) {
            applyVariantStyleToButton(buttonElement, subSlotConfig.variantStyle);
        }
        return buttonElement;
    }

    if (metaType === 'icon') {
        if (!content) return null;
        return createTextElement(
            content,
            subSlotConfig.variant || 'p',
            {},
            subSlotConfig.variantStyle || null
        );
    }

    if (metaType === 'video') {
        const src = slotAttributes.src || content || parentAttributes[`${subSlotName}_src`] || '';
        if (!src) return null;
        
        return createVideoElement(src, slotAttributes);
    }

    if (metaType === 'audio') {
        const src = slotAttributes.src || content || parentAttributes[`${subSlotName}_src`] || '';
        if (!src) return null;

        return createAudioElement(src, slotAttributes);
    }

    return null;
}

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
    console.log('  markdownData:', markdownData);
    
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
    
    let value = null;
    
    // 优先根据 source 从子标签提取: <source>value</source>
    value = extractSubTagValue(content, paramConfig.source);
    
    // 如果根据 source 没找到，再尝试使用参数名作为标签名: <paramName>value</paramName>
    if (!value) {
        value = extractSubTagValue(content, paramName);
    }
    
    // 如果仍然没有找到子标签，尝试从 markdown 格式提取
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
    // 🔧 修复：不处理 URL
    if (value.includes('.') && !value.startsWith('$') && !value.startsWith('http')) {
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
    
    // 🔧 重要修复：深拷贝输入的 style，确保不修改原始对象
    const inputStyle = JSON.parse(JSON.stringify(style));
    const processedStyle = {};
    
    for (const [key, value] of Object.entries(inputStyle)) {
        if (typeof value === 'string') {
            // 处理字符串中的所有 $paramName 占位符（支持字符串中间的占位符）
            let processedValue = value;
            
            // 替换所有 $paramName 或 {paramName} 格式的占位符
            // 🔧 修复：支持 {paramName} 格式
            processedValue = processedValue.replace(/(?:\$(\w+)|\{(\w+)\})/g, (match, p1, p2) => {
                const paramName = p1 || p2;
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
                    // 🔧 如果是 {paramName} 格式且未找到参数，可能是普通 token，不报警告
                    if (match.startsWith('{')) {
                         return match;
                    }
                    console.warn(`⚠️ 未找到参数: ${paramName}，可用参数:`, Object.keys(paramValues));
                    return match; // 保持原样
                }
            });
            
            processedStyle[key] = processedValue;
        } else if (typeof value === 'object' && value !== null) {
            // 递归处理嵌套对象（已经是深拷贝的对象了）
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
    const originalConfig = DEFAULT_STYLE_CONFIG.component && DEFAULT_STYLE_CONFIG.component[variant];
    
    if (!originalConfig) {
        console.warn(`未找到组件变体 "${variant}" 的配置`);
        // 返回一个基础的文本元素作为回退
        return createTextElement(content);
    }
    
    // 🔧 关键修复：深拷贝配置对象，确保每个组件实例都有独立的配置
    // 这样参数应用到样式时不会影响其他实例
    const componentConfig = JSON.parse(JSON.stringify(originalConfig));
    
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
    // 🔧 重要：深拷贝避免共享对象
    let finalStyle = componentConfig.style ? JSON.parse(JSON.stringify(componentConfig.style)) : {};
    if (styleOverride) {
        finalStyle = { ...finalStyle, ...styleOverride };
    }

    // 应用参数到样式
    if (Object.keys(paramValues).length > 0) {
        finalStyle = applyParametersToStyle(finalStyle, paramValues);
        console.log(`🎨 应用参数后的样式 (metaType):`, finalStyle);
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
        
        // 🆕 处理 nativeEvent 和 data 属性 (针对 containerElement)
        if (externalParameters && externalParameters.nativeEvent && externalParameters.data) {
            const nativeEventConfig = createNativeEventConfig(externalParameters.nativeEvent, externalParameters.data);
            if (nativeEventConfig) {
                if (containerElement.events.length === 1 && Object.keys(containerElement.events[0]).length === 0) {
                    containerElement.events[0] = nativeEventConfig;
                } else {
                    containerElement.events.push(nativeEventConfig);
                }
            }
        }

        return containerElement;
    }
    
    // 🆕 处理 nativeEvent 和 data 属性 (针对 elementInstance，当没有容器时)
    if (elementInstance && externalParameters && externalParameters.nativeEvent && externalParameters.data) {
        const nativeEventConfig = createNativeEventConfig(externalParameters.nativeEvent, externalParameters.data);
        if (nativeEventConfig) {
            // elementInstance 应该也有 events 数组
            if (!elementInstance.events) {
                elementInstance.events = [{}];
            }
            if (elementInstance.events.length === 1 && Object.keys(elementInstance.events[0]).length === 0) {
                elementInstance.events[0] = nativeEventConfig;
            } else {
                elementInstance.events.push(nativeEventConfig);
            }
        }
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
    
    // 🔧 检查是否有 layoutModes（如果有，不预先应用 componentConfig.style）
    const hasLayoutModes = componentConfig.layoutModes && componentConfig.layoutModes.length > 0;
    
    // 应用参数到样式
    // 🔧 重要：必须深拷贝 style，避免多个实例共享同一个对象
    let processedStyle = componentConfig.style ? JSON.parse(JSON.stringify(componentConfig.style)) : {};
    if (Object.keys(paramValues).length > 0) {
        processedStyle = applyParametersToStyle(processedStyle, paramValues);
        console.log(`🎨 应用参数后的样式:`, processedStyle);
    }
    
    // 创建组件容器元素
    const componentId = generateUUID();
    // 🔧 关键修复：生成唯一的 className，避免样式冲突
    const uniqueClassName = `component-${variant}-${componentId}`;

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
            style: {},  // style 用于内联样式
            className: uniqueClassName,  // 🔧 使用唯一的 className
            // 🔧 如果有 layoutModes，不预先应用 componentConfig.style（等模式选择后再应用）
            // 如果没有 layoutModes，使用 componentConfig.style 作为默认样式
            classStyle: hasLayoutModes ? {} : { ...processedStyle }
        },
        id: componentId,
        events: [{}]
    };

    // 应用样式覆盖（只有在没有 layoutModes 时才应用）
    if (styleOverride && !hasLayoutModes) {
        Object.assign(componentElement.layout.classStyle, styleOverride);
    }
    
    // 🆕 优先处理插槽标签（slotConfigs）
    if (componentConfig.slotConfigs && content) {
        console.log(`\n🎰 组件 "${variant}" 使用插槽标签系统`);
        
        // 解析内容中的所有插槽标签
        const slots = parseSlotTags(content);
        console.log(`  解析到 ${slots.length} 个插槽:`, slots.map(s => s.slotName));
        
        // 🆕 创建插槽元素并存储到 Map 中（用于后续重新组织）
        const slotElementsMap = new Map();
        
        // 为每个插槽创建对应的元素
        let abortForInvalidChart = false;
        slots.forEach(slotData => {
            const { slotName } = slotData;
            const baseSlotName = slotData.baseSlotName || slotName;
            const slotConfig = resolveSlotConfig(baseSlotName, componentConfig.slotConfigs);
            
            if (!slotConfig) {
                console.warn(`  ⚠️ 未找到插槽 "${baseSlotName}" 的配置`);
                return;
            }
            
            const element = createElementFromSlotConfig(
                slotName,
                slotConfig,
                slotData,
                currentMarkdown
            );
            
            if (element) {
                console.log(`  ✅ 成功创建插槽元素: ${slotName}`);
                slotElementsMap.set(slotName, element);
            } else {
                console.warn(`  ❌ 创建插槽元素失败: ${slotName}`);
                
                // 🆕 如果是图表插槽且内容不合法，终止整个组件生成
                if (slotConfig.metaType === 'chart') {
                    abortForInvalidChart = true;
                }
            }
        });

        if (abortForInvalidChart) {
            console.warn(`  ❌ 图表内容无效，终止组件 "${variant}" 的生成`);
            return null;
        }
        
        // 🆕 检查是否有 layoutModes 配置
        if (componentConfig.layoutModes && componentConfig.layoutModes.length > 0) {
            console.log(`\n🎛️ 组件 "${variant}" 使用布局模式系统`);
            
            // 获取实际存在的插槽名称集合
            const actualSlots = getActualSlotsFromMap(slotElementsMap);
            
            // 选择合适的布局模式
            const selectedMode = selectLayoutMode(componentConfig.layoutModes, actualSlots);
            
            if (selectedMode) {
                // 🆕 先应用组件基础样式（包括通过 parameters 注入的变量），再叠加模式样式
                if (processedStyle && Object.keys(processedStyle).length > 0) {
                    componentElement.layout.classStyle = {
                        ...processedStyle,
                        ...componentElement.layout.classStyle
                    };
                    console.log(`  🎨 应用组件基础样式（含参数）:`, Object.keys(processedStyle));
                }

                // 🔧 应用选中模式的容器样式（合并到 classStyle，确保优先级）
                if (selectedMode.style) {
                    // 🔧 修复：应用参数到模式样式
                    let modeStyle = selectedMode.style;
                    if (Object.keys(paramValues).length > 0) {
                        modeStyle = applyParametersToStyle(modeStyle, paramValues);
                        console.log(`  🎨 模式样式应用参数完成`);
                    }

                    // 合并模式样式到 classStyle（覆盖原有样式）
                    componentElement.layout.classStyle = {
                        ...componentElement.layout.classStyle,
                        ...modeStyle
                    };
                    console.log(`  🎨 应用模式 "${selectedMode.name}" 的样式:`, Object.keys(modeStyle));
                }
                
                // 根据模式构建结构（传入 actualSlots 以支持嵌套分组中的条件评估）
                const structuredChildren = buildStructureFromMode(
                    selectedMode,
                    slotElementsMap,
                    componentElement,
                    componentConfig,
                    actualSlots  // 🆕 传入 actualSlots 以支持嵌套分组条件
                );
                
                // 替换原有的 children
                componentElement.layout.children = structuredChildren;
                
                // 在元数据中记录使用的模式
                componentElement._metadata = componentElement._metadata || {};
                componentElement._metadata.layoutMode = selectedMode.name;
                
                console.log(`  🎉 布局模式 "${selectedMode.name}" 应用完成`);
            } else {
                // 如果没有模式被选中，使用扁平结构（向后兼容）
                console.warn(`  ⚠️ 未选中任何布局模式，使用扁平结构`);
                componentElement.layout.children = Array.from(slotElementsMap.values());
                
                // 🔧 回退到默认样式（componentConfig.style）
                if (processedStyle && Object.keys(processedStyle).length > 0) {
                    componentElement.layout.classStyle = { ...processedStyle };
                    console.log(`  🔄 回退到默认样式`);
                }
            }
        } else {
            // 没有 layoutModes，使用扁平结构（向后兼容）
            componentElement.layout.children = Array.from(slotElementsMap.values());
            console.log(`  📋 未配置布局模式，使用扁平结构（${slotElementsMap.size} 个元素）`);
        }
    }
    // 处理组件的子元素映射（向后兼容）
    else if (componentConfig.markdownMapping && content) {
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

    // 🆕 如果样式配置中声明了 hasUpdateEvent，则为组件创建 UPDATE 事件
    if (componentConfig.hasUpdateEvent) {
        const updateEvent = createComponentUpdateEvent(componentId, variant, content, externalParameters || {});
        if (updateEvent) {
            componentElement.events = [updateEvent];
        }
    }
    
    // 🆕 插槽系统：生成数据属性并处理条件样式
    if (componentConfig.slots || componentConfig.autoDataAttributes) {
        console.log(`\n🎰 组件 "${variant}" 启用插槽系统...`);
        
        // 1. 验证插槽配置（可选）
        if (componentConfig.slots) {
            const validation = validateSlotsConfig(componentConfig.slots);
            if (!validation.valid) {
                console.warn(`⚠️ 组件 "${variant}" 插槽配置有问题:`, validation.errors);
            }
            
            // 2. 检查必需插槽
            const requiredCheck = checkRequiredSlots(componentConfig.slots, componentElement.layout.children);
            if (!requiredCheck.satisfied) {
                console.warn(`⚠️ 组件 "${variant}" 缺少必需插槽:`, requiredCheck.missing);
            }
        }
        
        // 3. 生成数据属性
        const slotDataAttrs = generateSlotDataAttributes(componentConfig, componentElement.layout.children);
        
        if (Object.keys(slotDataAttrs).length > 0) {
            // 将数据属性存储到 _metadata 中，供渲染器使用
            if (!componentElement._metadata.slotDataAttributes) {
                componentElement._metadata.slotDataAttributes = {};
            }
            Object.assign(componentElement._metadata.slotDataAttributes, slotDataAttrs);
            console.log(`  ✅ 生成了 ${Object.keys(slotDataAttrs).length} 个数据属性`);
        }
        
        // 4. 处理条件样式（如果有）
        if (componentElement.layout.classStyle && Object.keys(componentElement.layout.classStyle).length > 0) {
            const { baseStyles, conditionalStyles } = separateConditionalStyles(componentElement.layout.classStyle);
            
            console.log(`  📋 基础样式:`, baseStyles);
            console.log(`  📋 条件样式规则数:`, conditionalStyles.length);
            
            if (conditionalStyles.length > 0) {
                console.log(`  🎨 发现 ${conditionalStyles.length} 个条件样式规则`);
                
                // 开始时使用基础样式
                let finalStyles = {};
                
                // 先复制基础样式
                Object.keys(baseStyles).forEach(key => {
                    finalStyles[key] = baseStyles[key];
                });
                
                // 🆕 根据当前的数据属性，预先应用匹配的条件样式
                conditionalStyles.forEach(condStyle => {
                    const condition = `${condStyle.attrName}=${condStyle.attrValue}`;
                    const dataAttrKey = `data-${condStyle.attrName}`;
                    
                    console.log(`  🔍 检查条件: ${condition}, 数据属性: ${dataAttrKey}=${slotDataAttrs[dataAttrKey]}`);
                    
                    if (slotDataAttrs[dataAttrKey] === condStyle.attrValue) {
                        console.log(`  ✅ 条件 "${condition}" 满足，应用条件样式`);
                        console.log(`     条件样式内容:`, condStyle.styles);
                        
                        // 🔧 使用扩展运算符确保完全覆盖
                        finalStyles = { ...finalStyles, ...condStyle.styles };
                        
                        console.log(`     合并后的样式:`, finalStyles);
                    } else {
                        console.log(`  ❌ 条件 "${condition}" 不满足`);
                    }
                });
                
                // 🆕 将最终样式应用到 style 中（不是 classStyle）
                // 这样 renderEightElementHtml.js 可以直接从 style 渲染
                componentElement.layout.style = finalStyles;
                
                // 清空 classStyle，避免混淆
                componentElement.layout.classStyle = {};
                
                console.log(`  🎨 最终应用的样式:`, finalStyles);
                console.log(`  🎨 最终 flexDirection:`, finalStyles.flexDirection);
            } else {
                // 没有条件样式，直接将 classStyle 移到 style
                console.log(`  ℹ️ 没有条件样式，直接使用基础样式`);
                componentElement.layout.style = componentElement.layout.classStyle;
                componentElement.layout.classStyle = {};
            }
        }
    }
    
    // 🆕 处理 nativeEvent 和 data 属性 (针对 createTemplateComponent)
    if (externalParameters && externalParameters.nativeEvent && externalParameters.data) {
        const nativeEventConfig = createNativeEventConfig(externalParameters.nativeEvent, externalParameters.data);
        if (nativeEventConfig) {
            if (!componentElement.events) {
                componentElement.events = [];
            }
            // 检查是否已有空事件对象，如果是则替换
            if (componentElement.events.length === 1 && Object.keys(componentElement.events[0]).length === 0) {
                componentElement.events[0] = nativeEventConfig;
            } else {
                componentElement.events.push(nativeEventConfig);
            }
        }
    }

    return componentElement;
}

