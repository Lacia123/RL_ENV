import { parseMarkdown, parseEventSyntax } from '../PSUIPParser.js';
import { generateUUID } from '../util.js';
import { createLayoutElement } from './layoutCreators.js';
import { createTextElement } from './textCreators.js';
import { getElementStyleConfig, LAYOUT_CONSTANTS } from '../styles';
import { EVENT_NAME } from '../eventConfig.js';

// 检测是否为选项卡标签
function isTabTag(line) {
    // 匹配带属性的开始标签: <tab bindingData="tabData" defaultTabKey="tab1">
    const tabTagWithAttrsMatch = line.trim().match(/^<tab([^>]*)>$/);
    if (tabTagWithAttrsMatch) {
        const attributesStr = tabTagWithAttrsMatch[1].trim();

        // 解析属性
        const attributes = {};
        if (attributesStr) {
            // 匹配 key="value" 或 key={token.value} 格式的属性
            const attrRegex = /(\w+)=(?:["']([^"']*?)["']|\{([^}]*?)\})/g;
            let attrMatch;
            while ((attrMatch = attrRegex.exec(attributesStr)) !== null) {
                const key = attrMatch[1];
                const value = attrMatch[2] || attrMatch[3]; // 支持引号和大括号格式
                attributes[key] = value;
            }
        }

        return {
            isTabTag: true,
            attributes: attributes,
            isClosing: false
        };
    }

    // 匹配 </tab>
    const closingTagMatch = line.trim().match(/^<\/tab>$/);
    if (closingTagMatch) {
        return {
            isTabTag: true,
            attributes: {},
            isClosing: true
        };
    }

    return { isTabTag: false };
}

// 检测是否为 tabPanel 标签
function isTabPanelTag(line) {
    // 匹配带属性的开始标签: <tabPanel tabKey="tab1" tabTitle="市场概述">
    const tabPanelTagWithAttrsMatch = line.trim().match(/^<tabPanel([^>]*)>$/);
    if (tabPanelTagWithAttrsMatch) {
        const attributesStr = tabPanelTagWithAttrsMatch[1].trim();

        // 解析属性
        const attributes = {};
        if (attributesStr) {
            // 匹配 key="value" 或 key={token.value} 格式的属性
            const attrRegex = /(\w+)=(?:["']([^"']*?)["']|\{([^}]*?)\})/g;
            let attrMatch;
            while ((attrMatch = attrRegex.exec(attributesStr)) !== null) {
                const key = attrMatch[1];
                const value = attrMatch[2] || attrMatch[3]; // 支持引号和大括号格式
                attributes[key] = value;
            }
        }

        return {
            isTabPanelTag: true,
            attributes: attributes,
            isClosing: false
        };
    }

    // 匹配 </tabPanel>
    const closingTagMatch = line.trim().match(/^<\/tabPanel>$/);
    if (closingTagMatch) {
        return {
            isTabPanelTag: true,
            attributes: {},
            isClosing: true
        };
    }

    return { isTabPanelTag: false };
}

// 提取选项卡标签块
function extractTabBlock(lines, startIndex) {
    const startLine = lines[startIndex];
    const startTagInfo = isTabTag(startLine);

    if (!startTagInfo.isTabTag || startTagInfo.isClosing) {
        return { tabContent: '', attributes: {}, endIndex: startIndex };
    }

    const attributes = startTagInfo.attributes || {};
    const contentLines = [];
    let i = startIndex + 1;
    let foundEnd = false;

    // 查找对应的结束标签
    while (i < lines.length) {
        const line = lines[i];
        const tagInfo = isTabTag(line);

        if (tagInfo.isTabTag && tagInfo.isClosing) {
            foundEnd = true;
            i++;
            break;
        }

        contentLines.push(line);
        i++;
    }

    if (!foundEnd) {
        console.warn(`警告: 未找到选项卡标签的结束标签`);
    }

    return {
        tabContent: contentLines.join('\n').trim(),
        attributes: attributes,
        endIndex: i - 1
    };
}

// 提取 tabPanel 标签块
function extractTabPanelBlock(lines, startIndex) {
    const startLine = lines[startIndex];
    const startTagInfo = isTabPanelTag(startLine);

    if (!startTagInfo.isTabPanelTag || startTagInfo.isClosing) {
        return { tabPanelContent: '', attributes: {}, endIndex: startIndex };
    }

    const attributes = startTagInfo.attributes || {};
    const contentLines = [];
    let i = startIndex + 1;
    let foundEnd = false;

    // 查找对应的结束标签
    while (i < lines.length) {
        const line = lines[i];
        const tagInfo = isTabPanelTag(line);

        if (tagInfo.isTabPanelTag && tagInfo.isClosing) {
            foundEnd = true;
            i++;
            break;
        }

        contentLines.push(line);
        i++;
    }

    if (!foundEnd) {
        console.warn(`警告: 未找到 tabPanel 标签的结束标签`);
    }

    return {
        tabPanelContent: contentLines.join('\n').trim(),
        attributes: attributes,
        endIndex: i - 1
    };
}

// 解析选项卡内容，提取所有 tabPanel
function parseTabContent(content, currentMarkdown = '') {
    const lines = content.split('\n');
    const tabPanels = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i].trim();
        
        // 检查是否为 tabPanel 标签
        const tabPanelTagInfo = isTabPanelTag(line);
        if (tabPanelTagInfo.isTabPanelTag && !tabPanelTagInfo.isClosing) {
            // 提取 tabPanel 内容
            const { tabPanelContent, attributes, endIndex } = extractTabPanelBlock(lines, i);
            
            // 解析 tabPanel 内的 markdown 内容
            const panelChildren = parseMarkdown(tabPanelContent, { currentMarkdown });
            
            tabPanels.push({
                tabKey: attributes.tabKey || '',
                tabTitle: attributes.tabTitle || '',
                content: panelChildren,
                attributes: attributes
            });
            
            i = endIndex + 1;
        } else {
            i++;
        }
    }

    return tabPanels;
}

// 创建选项卡元素
function createTabElement(content, attributes = {}, currentMarkdown = '') {
    const tabId = generateUUID();
    
    // 获取绑定数据和默认选项卡键
    const bindingData = attributes.bindingData || 'tabData';
    const defaultTabKey = attributes.defaultTabKey || 'tab1';
    
    // 解析选项卡内容，提取所有 tabPanel
    const tabPanels = parseTabContent(content, currentMarkdown);
    
    // 获取选项卡样式配置
    const tabStyleConfig = getElementStyleConfig('tab', 'standard', attributes);
    
    // 调试选项卡样式配置结构
    // console.log('选项卡样式配置结构:', JSON.stringify(tabStyleConfig, null, 2));
    
    // 创建 tabList 中的 tabListItem
    const tabListItems = tabPanels.map(panel => {
        const itemId = generateUUID();
        // 🔧 移除：不再在创建时判断激活状态，完全依赖数据绑定系统
        
        // 根据选项卡样式配置获取 tabListItem 样式
        const normalItemConfig = tabStyleConfig.tabListItem?.normal || {};
        const activeItemConfig = tabStyleConfig.tabListItem?.active || {};
        // 🔧 修复：始终使用普通配置作为基础，激活状态只通过条件样式应用
        const currentItemConfig = normalItemConfig;
                
        // 🔧 修复：创建选项卡标题文本，始终使用普通状态的变体
        const titleText = createTextElement(panel.tabTitle, normalItemConfig.variant || 'body');
        
        // 🔧 修复：应用普通状态的 metaType 和 variant
        if (normalItemConfig.metaType || normalItemConfig.variant) {
            titleText._metadata = {
                ...titleText._metadata,
                customMetaType: normalItemConfig.metaType,
                customVariant: normalItemConfig.variant
            };
        }
        
        // 从 styleConfig 的 text 部分获取文本样式
        const normalTextStyle = getElementStyleConfig('text', normalItemConfig.variant || 'body');
        const activeTextStyle = getElementStyleConfig('text', activeItemConfig.variant || 'body');
        
        // 应用当前状态的文本样式到 classStyle
        if (titleText.layout) {
            titleText.layout.classStyle = {
                ...titleText.layout.classStyle,
                ...normalTextStyle
            };
            
            // 为文本元件添加条件样式支持
            titleText.layout.conditionStyle = {
                condition: `${bindingData}=${panel.tabKey}`,
                className: `tab-text-active-${itemId}`,
                classStyle: activeTextStyle
            };
            
            // 如果激活状态有不同的 metaType 或 variant，也需要在条件样式中体现
            if (activeItemConfig.metaType || activeItemConfig.variant) {
                titleText.layout.conditionStyle.metaType = activeItemConfig.metaType;
                titleText.layout.conditionStyle.variant = activeItemConfig.variant;
            }
        }
        
        // 创建选项卡点击事件
        const tabClickEvent = parseEventSyntax(`[event:${EVENT_NAME.TAB_CHANGED}(${panel.tabKey})]`, itemId);
        // 注入绑定的数据名称到事件参数中
        if (Array.isArray(tabClickEvent) && tabClickEvent.length > 0 && tabClickEvent[0] && tabClickEvent[0].parameters) {
            tabClickEvent[0].parameters.dataKey = bindingData;
        }
        
        return {
            dataKeys: [],
            name: "layout",
            "name-zh": "选项卡项",
            "file-type": "template",
            theme: "default",
            _metadata: {
                actualType: 'tabListItem',
                isLayout: true,
                isTabListItem: true,
                tabKey: panel.tabKey,
                bindingData: bindingData
            },
            layout: {
                style: {
                    display: LAYOUT_CONSTANTS.DISPLAY.FLEX,
                    layoutMode: LAYOUT_CONSTANTS.DIRECTION.VERTICAL,
                    layoutWrap: LAYOUT_CONSTANTS.WRAP.NO_WRAP,
                    layoutGrow: LAYOUT_CONSTANTS.GROW.ZERO,
                    boxSizing: "border-box",
                    height: "auto",
                    width: "auto",
                    position: "relative",
                    cursor: "pointer"
                },
                classStyle: normalItemConfig.style || {},
                className: `tab-item-${itemId}`,
                // 添加条件样式支持
                conditionStyle: {
                    condition: `${bindingData}=${panel.tabKey}`,
                    className: `tab-item-active-${itemId}`,
                    classStyle: activeItemConfig.style || {}
                },
                children: [titleText]
            },
            description: `选项卡项 - ${panel.tabTitle}`,
            id: itemId,
            events: tabClickEvent.length > 0 ? tabClickEvent : [{}]
        };
    });
    
    // 创建 tabList 容器
    const tabListId = generateUUID();
    const tabList = {
        dataKeys: [],
        name: "layout",
        "name-zh": "选项卡列表",
        "file-type": "template",
        theme: "default",
        _metadata: {
            actualType: 'tabList',
            isLayout: true,
            isTabList: true
        },
        layout: {
            style: {
                display: LAYOUT_CONSTANTS.DISPLAY.FLEX,
                layoutMode: LAYOUT_CONSTANTS.DIRECTION.HORIZONTAL,
                layoutWrap: LAYOUT_CONSTANTS.WRAP.NO_WRAP,
                layoutGrow: LAYOUT_CONSTANTS.GROW.ZERO,
                boxSizing: "border-box",
                height: "auto",
                width: "100%",
                position: "relative",
                ...tabStyleConfig.tabList?.style
            },
            classStyle: tabStyleConfig.tabList?.style || {},
            className: `tab-list-${tabListId}`,
            children: tabListItems
        },
        description: "选项卡列表容器",
        id: tabListId,
        events: [{}]
    };
    
    // 创建 tabPanel 容器
    const tabPanelContainers = tabPanels.map(panel => {
        const panelId = generateUUID();
        
        return {
            dataKeys: [],
            name: "layout",
            "name-zh": "选项卡面板",
            "file-type": "template",
            theme: "default",
            _metadata: {
                actualType: 'tabPanel',
                isLayout: true,
                isTabPanel: true,
                tabKey: panel.tabKey
            },
            layout: {
                style: {
                    display: LAYOUT_CONSTANTS.DISPLAY.FLEX,
                    layoutMode: LAYOUT_CONSTANTS.DIRECTION.VERTICAL,
                    layoutWrap: LAYOUT_CONSTANTS.WRAP.NO_WRAP,
                    layoutGrow: LAYOUT_CONSTANTS.GROW.ZERO,
                    boxSizing: "border-box",
                    height: "auto",
                    width: "100%",
                    position: "relative",
                    ...tabStyleConfig.tabPanel?.style
                },
                classStyle: tabStyleConfig.tabPanel?.style || {},
                className: `tab-panel-${panelId}`,
                // 添加条件字段
                condition: `${bindingData}=${panel.tabKey}`,
                children: panel.content
            },
            description: `选项卡面板 - ${panel.tabTitle}`,
            id: panelId,
            events: [{}]
        };
    });
    
    // 创建主选项卡容器
    const tabContainer = {
        dataKeys: [],
        name: "layout",
        "name-zh": "选项卡容器",
        "file-type": "template",
        theme: "default",
        _metadata: {
            actualType: 'tab',
            isLayout: true,
            isTab: true,
            bindingData: bindingData,
            defaultTabKey: defaultTabKey
        },
        layout: {
            style: {
                display: LAYOUT_CONSTANTS.DISPLAY.FLEX,
                layoutMode: LAYOUT_CONSTANTS.DIRECTION.VERTICAL,
                layoutWrap: LAYOUT_CONSTANTS.WRAP.NO_WRAP,
                layoutGrow: LAYOUT_CONSTANTS.GROW.ZERO,
                boxSizing: "border-box",
                height: "auto",
                width: "100%",
                position: "relative",
                ...tabStyleConfig.tabContainer?.style
            },
            classStyle: tabStyleConfig.tabContainer?.style || {},
            className: `tab-container-${tabId}`,
            children: [tabList, ...tabPanelContainers]
        },
        description: "选项卡主容器",
        id: tabId,
        events: [{}]
    };
    
    return tabContainer;
}

export {
    isTabTag,
    isTabPanelTag,
    extractTabBlock,
    extractTabPanelBlock,
    parseTabContent,
    createTabElement
};
