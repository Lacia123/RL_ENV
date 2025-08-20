// markdownToEightElement.js
// 导入样式配置和常量
import {
  getElementStyleConfig,
  LAYOUT_CONSTANTS,
  COLOR_CONSTANTS,
  DIMENSION_CONSTANTS,
  FONT_CONSTANTS,
  CSS_VARIABLE_SYSTEM
} from './styleConfig.js';
import { generateChartFromTableData } from './chartGenerator.js';
// 导入Markdown和KaTeX处理库
import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import markedKatex from 'marked-katex-extension';
// 导入token解析和颜色判断功能
import resolveToken, { isColorDark } from '../tokens/resolveToken.js';
// 导入事件配置
import { EVENT_NAME, EVENT_CONFIG } from './eventConfig.js';

// 配置Marked实例，支持KaTeX和代码高亮
const katexOptions = {
  throwOnError: false,
};

const markedInstance = new Marked(
  markedHighlight({
    async: false,
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    }
  })
);
markedInstance.use(markedKatex(katexOptions));

// 改进UUID生成，确保更唯一
function generateUUID() {
  return 'dd-' + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// 恢复随机UUID生成 - 简单可靠
// 布局调控将改为使用解析索引而不是ID

// 解析事件语法 [event:eventName] 并返回事件配置
function parseEventSyntax(text, elementId, currentMarkdown = '') {
  const eventPattern = /\[event:(\w+)\]/g;
  const events = [];
  let match;
  
  while ((match = eventPattern.exec(text)) !== null) {
    const eventName = match[1];
    
    // 从eventConfig中获取对应的事件配置
    if (EVENT_CONFIG[eventName]) {
      const eventConfig = JSON.parse(JSON.stringify(EVENT_CONFIG[eventName])); // 深拷贝
      
      // 设置EventTargetId
      eventConfig.EventTargetId = elementId;
      
      // 特殊处理edit事件的markdown参数
      if (eventName === EVENT_NAME.EDIT && currentMarkdown) {
        eventConfig.parameters.markdown = currentMarkdown;
      }
      
      console.log(`🎯 解析到事件: ${eventName}, 绑定到元素: ${elementId}`);
      events.push(eventConfig);
    } else {
      console.warn(`⚠️ 未找到事件配置: ${eventName}`);
    }
  }
  
  return events;
}

// 移除文本中的事件语法标记
function removeEventSyntax(text) {
  // 首先检查是否是完整的事件按钮语法：[event:eventName][buttonText](url)
  const fullEventMatch = text.match(/^\[event:\w+\]\s*\[([^\]]+)\]\(([^)]+)\)$/);
  if (fullEventMatch) {
    // 如果是完整的事件按钮语法，返回按钮文本部分
    return fullEventMatch[1].trim();
  }
  
  // 否则只清理 [event:eventName] 标记
  return text.replace(/\[event:\w+\]/g, '').trim();
}

// HTML转义函数，用于安全处理文本
function escapeHtml(text) {
  if (!text || typeof text !== 'string') return '';

  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// 预处理Markdown文本，优化KaTeX解析
function prepareMarkdownForKatex(text) {
  if (!text || typeof text !== 'string') return '';

  let preppedMarkdown = text;

  // 确保在单美元符号前有空格，避免误识别
  preppedMarkdown = preppedMarkdown.replace(/(\S)(\$)(?!\$)/g, (match, charBefore, dollarSign) => {
    if (charBefore === '$') { // 避免修改$$对
      return match;
    }
    return charBefore + ' ' + dollarSign; // 添加空格: "word$" -> "word $"
  });

  // 确保换行在marked中被正确处理
  preppedMarkdown = preppedMarkdown.replace(/\\n/g, '  \\n');


  return preppedMarkdown;
}

// 处理文本，包括Markdown和KaTeX公式
function processText(text) {
  if (!text || typeof text !== 'string') return '';

  try {
    // 🔧 修复：清理段落符号
    const cleanedText = text.replace(/§PARAGRAPH§/g, '');
    
    // 预处理文本，优化KaTeX解析
    const preparedText = prepareMarkdownForKatex(cleanedText);

    // 使用markedInstance处理Markdown和KaTeX
    const parseResult = markedInstance.parse(preparedText);

    if (parseResult.includes('class="katex-error"')) {
      const titleMatch = parseResult.match(/title="([^"]*)"/);
      const errorMessage = titleMatch ? titleMatch[1] : null;
      console.error('KaTeX解析错误:', errorMessage);
      
      // 🔧 修复：即使有KaTeX错误，也要返回解析结果
      return parseResult;
    } else {
      return parseResult;
    }
  
  } catch (error) {
    console.error("处理文本时出错:", error);
    // 🔧 修复：出错时返回转义后的原文本，而不是undefined，同时清理段落符号
    const cleanedText = text.replace(/§PARAGRAPH§/g, '');
    const errorMessage = `<span style="color:red;">公式或Markdown解析错误: ${escapeHtml(error.message)}</span>`;
    return errorMessage + escapeHtml(cleanedText).replace(/\\n/g, '<br>');
  }
}

// 更新基础布局元素创建函数，支持自定义高宽
function createBaseLayout(direction = LAYOUT_CONSTANTS.DIRECTION.VERTICAL, options = {}) {
  const { width = "100%", height = "100%", alignItems = LAYOUT_CONSTANTS.ALIGN.X.MIN } = options;

  return {
    style: {
      display: LAYOUT_CONSTANTS.DISPLAY.FLEX,
      layoutMode: direction,
      layoutWrap: LAYOUT_CONSTANTS.WRAP.NO_WRAP,
      primaryAxisSizingMode: "fixed",
      // layoutAlign: LAYOUT_CONSTANTS.ALIGN.Y.SELF.INHERIT,
      layoutGrow: LAYOUT_CONSTANTS.GROW.ZERO,
      boxSizing: "border-box",
      "border-style": "solid",
      "border-width": "0",
      "border-color": "initial",
      height: height,
      width: width,
      "box-sizing": "border-box",
      position: "relative"
    },
    children: []
  };
}

// 检测处理后HTML中的KaTeX类
function detectMathInHTML(htmlContent) {
  if (!htmlContent) return { hasInline: false, hasBlock: false };

  // 检测行内公式（katex类但不是katex-display）
  const hasInlineHTML = htmlContent.includes('class="katex"') && 
                       !htmlContent.includes('class="katex-display"');

  // 检测块级公式
  const hasBlockHTML = htmlContent.includes('class="katex-display"');

  return {
    hasInline: hasInlineHTML,
    hasBlock: hasBlockHTML
  };
}

// 创建文本元素 - 修改以支持富文本和KaTeX
function createTextElement(text, variant = 'normal', richTextOptions = {}, customStyles = null) {
  const id = generateUUID();
  // 获取文本元素的样式配置
  let textStyleConfig = getElementStyleConfig('text', variant);
  
  // 🆕 应用自定义样式覆盖到元件级别
  if (customStyles && Object.keys(customStyles).length > 0) {
    console.log(`🎨 为文本元件应用自定义样式: variant=${variant}`, customStyles);
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

// 检测是否为引用文本
function isQuoteText(line) {
  return line.trim().match(/^>\s*(.*)$/);
}

// 检测是否为布局标签（支持属性）
function isLayoutTag(line) {
  // 匹配带属性的开始标签: <layout:variant attr1="value1" attr2="value2">
  const layoutTagWithAttrsMatch = line.trim().match(/^<layout:(\w+)([^>]*)>$/);
  if (layoutTagWithAttrsMatch) {
    const variant = layoutTagWithAttrsMatch[1];
    const attributesStr = layoutTagWithAttrsMatch[2].trim();
    
    // 解析属性
    const attributes = {};
    if (attributesStr) {
      // 匹配多种格式的属性：key="value", key='value', key={value}
      const attrRegex = /(\w+)=(["']([^"']*?)["']|\{([^}]*?)\})/g;
      let attrMatch;
      while ((attrMatch = attrRegex.exec(attributesStr)) !== null) {
        const attrName = attrMatch[1];
        // attrMatch[3] 是引号格式的值，attrMatch[4] 是大括号格式的值
        const attrValue = attrMatch[3] !== undefined ? attrMatch[3] : attrMatch[4];
        attributes[attrName] = attrValue;
        console.log(`🔍 解析布局属性: ${attrName} = "${attrValue}"`);
      }
    }
    
    return {
      isLayoutTag: true,
      variant: variant,
      attributes: attributes,
      isClosing: false
    };
  }
  
  // 匹配简单的开始标签: <layout:variant>
  const layoutTagMatch = line.trim().match(/^<layout:(\w+)>$/);
  if (layoutTagMatch) {
    return {
      isLayoutTag: true,
      variant: layoutTagMatch[1],
      attributes: {},
      isClosing: false
    };
  }
  
  const closingTagMatch = line.trim().match(/^<\/layout:(\w+)>$/);
  if (closingTagMatch) {
    return {
      isLayoutTag: true,
      variant: closingTagMatch[1],
      attributes: {},
      isClosing: true
    };
  }
  
  return { isLayoutTag: false };
}

// 检测是否为图标标签
function isIconTag(line) {
  // 匹配 <icon>iconname</icon> 或 <icon:variant>iconname</icon:variant> 格式
  const iconMatch = line.match(/^<icon(?::(\w+))?>([^<>]+)<\/icon(?::\w+)?>$/);
  if (iconMatch) {
    return {
      isIconTag: true,
      variant: iconMatch[1] || 'medium', // 默认为 medium 变体
      iconName: iconMatch[2].trim()
    };
  }
  
  return { isIconTag: false };
}

// 检测是否为卡片标签
function isCardTag(line) {
  // 匹配带属性的开始标签: <card:variant attr1="value1" attr2="value2"> 或 <card:variant attr1={token.value}>
  const cardTagWithAttrsMatch = line.trim().match(/^<card(?::(\w+))([^>]*)>$/);
  if (cardTagWithAttrsMatch) {
    const variant = cardTagWithAttrsMatch[1] || 'standard';
    const attributesStr = cardTagWithAttrsMatch[2].trim();
    
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
      isCardTag: true,
      variant: variant,
      attributes: attributes,
      isClosing: false
    };
  }
  
  // 匹配 </card> 或 </card:variant>
  const closingTagMatch = line.trim().match(/^<\/card(?::(\w+))?>$/);
  if (closingTagMatch) {
    return {
      isCardTag: true,
      variant: closingTagMatch[1] || 'standard',
      attributes: {},
      isClosing: true
    };
  }
  
  return { isCardTag: false };
}
// 解析模板卡片内容
function parseTemplateCardContent(content, cardStyleConfig, returnElements = false, currentMarkdown = '') {
  console.log(`解析模板卡片内容，长度: ${content.length}, 返回元素: ${returnElements}`);
  
  const lines = content.split('\n');
  const children = [];
  let i = 0;

  // 🆕 检查是否有 markdownMapping 配置
  const hasMarkdownMapping = cardStyleConfig.markdownMapping && Object.keys(cardStyleConfig.markdownMapping).length > 0;
  
  // 🆕 预解析所有分组配置
  const groupConfigs = [];
  if (hasMarkdownMapping) {
    for (const [key, value] of Object.entries(cardStyleConfig.markdownMapping)) {
      const groupInfo = parseGroupPattern(key);
      if (groupInfo) {
        groupConfigs.push({
          pattern: groupInfo.elements,
          templatePath: value,
          mappingKey: key,
          groupInfo
        });
      }
    }
    console.log(`🔍 发现 ${groupConfigs.length} 个分组配置:`, groupConfigs.map(g => g.mappingKey));
  }
  
  // 🆕 用于跟踪容器，确保相同容器的子元素被合并
  const containerMap = new Map(); // key: containerName, value: containerElement
  
  // 🆕 用于跟踪列表项计数器
  let listItemCounter = 0;
  
  while (i < lines.length) {
    const line = lines[i].trim();
    
    if (!line) {
      i++;
      continue;
    }

    // 🆕 优先检查是否匹配分组模式
    if (groupConfigs.length > 0) {
      const groupMatch = checkGroupStart(line, groupConfigs);
      if (groupMatch) {
        console.log(`🔍 发现分组起始元素: ${groupMatch.startElement.type}, 分组模式: ${groupMatch.groupConfig.mappingKey}`);
        console.log(`🔍 开始从第${i}行收集分组项目: "${line}"`);
        
        // 处理分组收集
        const groupResult = collectGroupItems(lines, i, groupMatch.groupConfig, cardStyleConfig);
        if (groupResult) {
          // 处理分组路径：检查是否是通配符路径（如 percentItems.percentItem*）
          const templatePath = groupMatch.groupConfig.templatePath;
          if (templatePath.includes('*')) {
            // 通配符路径：为每个分组项创建独立的子元素
            const pathParts = templatePath.split('.');
            const parentPath = pathParts[0]; // percentItems
            const childPattern = pathParts[1]; // percentItem*
            const childBaseName = childPattern.replace('*', ''); // percentItem
            
            console.log(`🔧 处理通配符分组路径: ${templatePath}, 分组项数量: ${groupResult.items.length}`);
            
            // 首先确保父容器存在
            let parentContainer = containerMap.get(parentPath);
            if (!parentContainer) {
              parentContainer = createTemplateTagElement(parentPath, '', cardStyleConfig);
              if (parentContainer) {
                children.push(parentContainer);
                containerMap.set(parentPath, parentContainer);
                console.log(`创建父容器: ${parentPath}`);
              }
            }
            
            // 为每个分组项创建独立的子元素
            groupResult.items.forEach((groupItem, index) => {
              const childName = `${childBaseName}${index + 1}`; // percentItem1, percentItem2, ...
              const childPath = `${parentPath}.${childName}`;
              const itemContent = groupItem.rawLines.join('\n');
              
              console.log(`🔧 创建分组子项 ${index + 1}/${groupResult.items.length}: ${childPath}`);
              console.log(`📝 子项内容: "${itemContent}"`);
              console.log(`🎯 分组项详情:`, JSON.stringify(groupItem, null, 2));
              
              const childElement = createOrMergeTemplateElement(
                childPath,
                itemContent,
                cardStyleConfig,
                containerMap,
                children,
                null,
                { isGroupItem: true, groupItemIndex: index, groupItem }
              );
              
              if (childElement) {
                console.log(`✅ 分组子项创建成功: ${childPath}`);
              } else {
                console.log(`❌ 分组子项创建失败: ${childPath}`);
              }
            });
          } else {
            // 普通路径：整体创建分组元素
            const templateElement = createOrMergeTemplateElement(
              templatePath,
              groupResult.content,
              cardStyleConfig,
              containerMap,
              children,
              null,
              { isGroup: true, groupItems: groupResult.items, groupConfig: groupMatch.groupConfig }
            );
          }
          
          // 跳过已处理的行
          i = groupResult.nextIndex;
          continue;
        }
      }
    }

    // 🆕 检查 markdown 格式（单独元素处理）
    if (hasMarkdownMapping) {
      const parseResult = parseMarkdownToTemplate(line, cardStyleConfig.markdownMapping, listItemCounter);
      if (parseResult && parseResult.markdownResult) {
        const { markdownResult, newListItemCounter } = parseResult;
        listItemCounter = newListItemCounter;
        
        console.log(`发现 markdown 格式: ${markdownResult.type} -> ${markdownResult.templatePath}, 内容: "${markdownResult.content}"`);
        

        
        // 🆕 特殊处理表格：收集完整的表格内容
        if (markdownResult.type === 'table' && markdownResult.isTableLine) {
          console.log(`🔍 开始收集完整表格内容，起始行: ${i}`);
          
          // 收集所有连续的表格行
          const tableLines = [line];
          let j = i + 1;
          
          while (j < lines.length) {
            const nextLine = lines[j].trim();
            if (!nextLine) {
              j++;
              continue; // 跳过空行
            }
            
            // 检查是否还是表格行
            const nextParseResult = parseMarkdownToTemplate(nextLine, cardStyleConfig.markdownMapping, 0);
            if (nextParseResult && nextParseResult.markdownResult && 
                nextParseResult.markdownResult.type === 'table' && 
                nextParseResult.markdownResult.isTableLine) {
              tableLines.push(nextLine);
              j++;
            } else {
              break; // 遇到非表格行，停止收集
            }
          }
          
          // 合并完整的表格内容
          const completeTableContent = tableLines.join('\n');
          console.log(`📋 收集到完整表格，共 ${tableLines.length} 行`);
          
          // 创建表格元素
          const templateElement = createOrMergeTemplateElement(
            markdownResult.templatePath, 
            completeTableContent, 
            cardStyleConfig, 
            containerMap, 
            children,
            null, // existingElement
            { ...markdownResult, content: completeTableContent } // 传递完整表格内容
          );
          
          // 跳过已处理的表格行
          i = j;
          continue;
        }
        
        // 🆕 特殊处理代码块：收集完整的代码块内容
        if (markdownResult.type === 'code' && markdownResult.isCodeBlockStart) {
          console.log(`🔍 开始收集完整代码块内容，起始行: ${i}, 语言: ${markdownResult.language}`);
          
          // 收集代码块内容
          const codeLines = [line]; // 包含开始标记 ```language
          let j = i + 1;
          let foundEnd = false;
          
          while (j < lines.length) {
            const nextLine = lines[j];
            codeLines.push(nextLine);
            
            // 检查是否是代码块结束标记
            if (nextLine.trim() === '```') {
              foundEnd = true;
              j++;
              break;
            }
            j++;
          }
          
          if (!foundEnd) {
            console.warn(`⚠️ 代码块未找到结束标记，从第${i}行开始`);
          }
          
          // 提取纯代码内容（去除开始和结束的```标记）
          let pureCodeContent = '';
          if (codeLines.length >= 2) {
            // 去除第一行（```language）和最后一行（```）
            const codeContentLines = codeLines.slice(1);
            if (codeContentLines[codeContentLines.length - 1].trim() === '```') {
              codeContentLines.pop(); // 移除最后的 ```
            }
            pureCodeContent = codeContentLines.join('\n');
          }
          
          console.log(`📋 收集到完整代码块，共 ${codeLines.length} 行，提取纯代码内容 ${pureCodeContent.length} 字符`);
          
          // 创建代码块元素
          const templateElement = createOrMergeTemplateElement(
            markdownResult.templatePath, 
            pureCodeContent, // 传递纯代码内容
            cardStyleConfig, 
            containerMap, 
            children,
            null, // existingElement
            { ...markdownResult, content: pureCodeContent, language: markdownResult.language } // 传递纯代码内容和语言信息
          );
          
          // 跳过已处理的代码块行
          i = j;
          continue;
        }
        
        // 🆕 特殊处理图表：收集图表标记后面的表格数据
        if (markdownResult.type === 'chart') {
          console.log(`🔍 开始收集图表数据，起始行: ${i}, 图表类型: ${markdownResult.chartType}`);
          
          // 图表标记行本身
          const chartHeaderLine = line;
          let j = i + 1;
          const tableLines = [];
          
          // 收集后面的表格数据
          while (j < lines.length) {
            const nextLine = lines[j].trim();
            if (!nextLine) {
              j++;
              continue; // 跳过空行
            }
            
            // 检查是否是表格行
            if (nextLine.includes('|')) {
              const isTableLine = nextLine.match(/^\|.*\|$/) || 
                                 nextLine.match(/^[^|]*\|.*\|[^|]*$/) ||
                                 nextLine.match(/^[-|\s|:]+$/); // 表格分隔行
              
              if (isTableLine) {
                tableLines.push(nextLine);
                j++;
              } else {
                break; // 遇到非表格行，停止收集
              }
            } else {
              break; // 遇到非表格行，停止收集
            }
          }
          
          if (tableLines.length > 0) {
            // 合并完整的图表数据
            const completeChartContent = `${chartHeaderLine}\n${tableLines.join('\n')}`;
            console.log(`📊 收集到完整图表数据，共 ${tableLines.length + 1} 行`);
            
            // 解析图表数据
            const chartResult = extractTableOrChartData([chartHeaderLine, ...tableLines], 0);
            
            if (chartResult.isChart) {
              // 创建图表元素
              try {
                // 🆕 获取图表的 variant 配置
                const chartVariant = getChartVariantFromConfig(markdownResult.templatePath, cardStyleConfig);
                
                const chartElement = createChartElement(chartResult.chartType, '', chartResult.tableData, chartResult.tableContent, chartVariant, chartResult.chartTitle);
                
                // 生成SVG图表 - 传递 variant 信息和标题
                const chartStyleConfig = {
                  variant: chartVariant,
                  container: chartElement.layout?.container,
                  title: chartElement.layout?.title,
                  legend: chartElement.layout?.legend,
                  axis: chartElement.layout?.axis
                };
                const svgContent = generateChartSvg(chartResult.chartType, chartResult.tableData, chartStyleConfig, chartResult.chartTitle);
                chartElement.svgContent = svgContent;
                
                // 使用通配符处理的路径创建模板元素
                const templateElement = createOrMergeTemplateElement(
                  markdownResult.templatePath, 
                  completeChartContent,
                  cardStyleConfig, 
                  containerMap, 
                  children,
                  chartElement, // 传入已创建的图表元素
                  { ...markdownResult, chartElement: chartElement, chartData: chartResult }
                );
                
                console.log(`✅ 成功创建图表模板元素: ${markdownResult.chartType} (variant: ${chartVariant})`);
              } catch (error) {
                console.error('生成图表时出错:', error);
                // 创建错误图表元素
                const errorSvg = `<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
                  <rect width="100%" height="100%" fill="#fff0f0" />
                  <text x="20" y="30" font-family="sans-serif" font-size="16" fill="#d32f2f">图表生成错误: ${markdownResult.chartType}</text>
                  <text x="20" y="50" font-family="sans-serif" font-size="12" fill="#666">${error.message || '未知错误'}</text>
                </svg>`;
                
                // 🆕 使用辅助函数获取 variant
                const chartVariant = getChartVariantFromConfig(markdownResult.templatePath, cardStyleConfig);
                
                const errorChartElement = createChartElement(markdownResult.chartType, errorSvg, [], completeChartContent, chartVariant);
                const templateElement = createOrMergeTemplateElement(
                  markdownResult.templatePath, 
                  completeChartContent,
                  cardStyleConfig, 
                  containerMap, 
                  children,
                  errorChartElement,
                  { ...markdownResult, chartElement: errorChartElement }
                );
              }
            } else {
              console.warn(`⚠️ 图表数据解析失败: ${markdownResult.chartType}`);
            }
          } else {
            console.warn(`⚠️ 未找到图表 ${markdownResult.chartType} 的表格数据`);
            // 即使没有数据也创建一个空图表
            // 🆕 使用辅助函数获取 variant
            const chartVariant = getChartVariantFromConfig(markdownResult.templatePath, cardStyleConfig);
            
            const emptyChartElement = createChartElement(markdownResult.chartType, '', [], chartHeaderLine, chartVariant);
            const templateElement = createOrMergeTemplateElement(
              markdownResult.templatePath, 
              chartHeaderLine,
              cardStyleConfig, 
              containerMap, 
              children,
              emptyChartElement,
              { ...markdownResult, chartElement: emptyChartElement }
            );
          }
          
          // 跳过已处理的行
          i = j;
          continue;
        }
        
        // 🆕 检查是否需要合并到现有容器，传递完整的解析结果
        const templateElement = createOrMergeTemplateElement(
          markdownResult.templatePath, 
          markdownResult.content, 
          cardStyleConfig, 
          containerMap, 
          children,
          null, // existingElement
          markdownResult, // 传递完整的解析结果，包含URL等信息
          currentMarkdown // 传递原始markdown内容用于事件配置
        );
        
        i++;
        continue;
      }
      
      // 🆕 检查是否有 others 映射，用于处理未匹配的内容
      if (cardStyleConfig.markdownMapping.others) {
        console.log(`发现未映射的内容，开始收集连续的未映射内容，起始行: ${i}`);
        console.log(`others 映射值: "${cardStyleConfig.markdownMapping.others}"`);
        
        // 收集连续的未映射内容
        const collectResult = collectUnmappedMarkdownContent(lines, i, cardStyleConfig.markdownMapping);
        
        if (collectResult.content.trim()) {
          console.log(`收集到未映射内容 (${collectResult.lineCount} 行):\n${collectResult.content}`);
          
          // 使用标准 parseMarkdown 解析整块内容
          const parsedElements = parseMarkdown(collectResult.content, { currentMarkdown });
          
          // 将解析后的元素放到 others 指定的容器中
          for (const element of parsedElements) {
            console.log(`准备创建模板元素，others映射: "${cardStyleConfig.markdownMapping.others}", 元素类型: ${element.type}`);
            console.log(`cardStyleConfig.markdownMapping:`, cardStyleConfig.markdownMapping);
            console.log(`element:`, element);
            
            // 🔧 验证 others 映射是否存在
            if (!cardStyleConfig.markdownMapping.others) {
              console.error(`❌ others 映射未定义! markdownMapping:`, cardStyleConfig.markdownMapping);
              continue; // 跳过这个元素
            }
            
            createOrMergeTemplateElement(cardStyleConfig.markdownMapping.others, '', cardStyleConfig, containerMap, children, element, null, currentMarkdown);
          }
        }
        
        // 跳过已处理的行
        i = collectResult.endIndex;
        continue;
      }
    }

    // 检查是否为内联模板标签（如 <title>内容</title>）
    const inlineTemplateTagMatch = line.match(/^<(\w+)>(.*?)<\/\1>$/);
    if (inlineTemplateTagMatch) {
      const tagName = inlineTemplateTagMatch[1];
      const tagContent = inlineTemplateTagMatch[2];
      console.log(`发现内联模板标签: ${tagName}, 内容: "${tagContent}"`);
      
      // 创建模板标签元素
      const templateElement = createTemplateTagElement(tagName, tagContent, cardStyleConfig);
      if (templateElement) {
        children.push(templateElement);
      }
      
      i++;
    } else {
      // 检查是否为块级模板标签（如 <content>...多行内容...</content>）
      const templateTagMatch = line.match(/^<(\w+)>$/);
      if (templateTagMatch) {
        const tagName = templateTagMatch[1];
        console.log(`发现块级模板标签: ${tagName}`);
        
        // 提取标签内容
        const { tagContent, endIndex } = extractTemplateTag(lines, i, tagName);
        
        // 创建模板标签元素
        const templateElement = createTemplateTagElement(tagName, tagContent, cardStyleConfig);
        if (templateElement) {
          children.push(templateElement);
        }
        
        i = endIndex + 1;
      } else {
        // 🆕 如果有 markdownMapping 且是普通文本，尝试作为段落处理
        if (hasMarkdownMapping && cardStyleConfig.markdownMapping.p) {
          // 🔧 修复：清理段落符号
          const cleanedLine = line.replace(/§PARAGRAPH§/g, '');
          if (cleanedLine.trim()) {
            console.log(`将普通文本作为段落处理: "${cleanedLine}"`);
            console.log(`p 映射值: "${cardStyleConfig.markdownMapping.p}"`);
            // 🆕 使用合并逻辑处理段落
            createOrMergeTemplateElement(
              cardStyleConfig.markdownMapping.p, 
              cleanedLine, 
              cardStyleConfig, 
              containerMap, 
              children,
              null, // existingElement
              { type: 'p', content: cleanedLine } // markdownData for paragraph
            );
          }
        } else if (!hasMarkdownMapping) {
          // 如果没有 markdownMapping，按普通卡片处理
          // 🔧 修复：清理段落符号
          const cleanedLine = line.replace(/§PARAGRAPH§/g, '');
          if (cleanedLine.trim()) {
            const textElement = createTextElement(cleanedLine);
            children.push(textElement);
          }
        }
        // 🆕 如果有 markdownMapping 但没有 p 映射，且没有 others 映射，则跳过不处理
        i++;
      }
    }
  }

  if (returnElements) {
    return children;
  }
  
  return children;
}

// 🆕 收集连续的未映射 markdown 内容
function collectUnmappedMarkdownContent(lines, startIndex, markdownMapping) {
  console.log(`开始收集未映射内容，起始行: ${startIndex}`);
  
  const contentLines = [];
  let i = startIndex;
  
  while (i < lines.length) {
    const line = lines[i].trim();
    
    // 跳过空行
    if (!line) {
      i++;
      continue;
    }
    
    // 检查是否为已映射的 markdown 格式
    const parseResult = parseMarkdownToTemplate(line, markdownMapping, 0);
    if (parseResult && parseResult.markdownResult) {
      // 遇到已映射的内容，停止收集
      console.log(`在第${i}行遇到已映射内容，停止收集: ${parseResult.markdownResult.type}`);
      break;
    }
    
    // 检查是否为内联模板标签
    const inlineTemplateTagMatch = line.match(/^<(\w+)>(.*?)<\/\1>$/);
    if (inlineTemplateTagMatch) {
      console.log(`在第${i}行遇到内联模板标签，停止收集: ${inlineTemplateTagMatch[1]}`);
      break;
    }
    
    // 检查是否为块级模板标签
    const templateTagMatch = line.match(/^<(\w+)>$/);
    if (templateTagMatch) {
      console.log(`在第${i}行遇到块级模板标签，停止收集: ${templateTagMatch[1]}`);
      break;
    }
    
    // 将此行添加到未映射内容中
    contentLines.push(lines[i]); // 保留原始行（包括缩进）
    i++;
  }
  
  const content = contentLines.join('\n');
  console.log(`收集完成，共 ${contentLines.length} 行，结束行: ${i - 1}`);
  
  return {
    content: content,
    lineCount: contentLines.length,
    endIndex: i // 下一行的索引
  };
}
// 🆕 解析分组模式，支持 h3+h4+p:group 这种语法
function parseGroupPattern(pattern) {
  const groupMatch = pattern.match(/^(.+):group$/);
  if (!groupMatch) return null;
  
  const elements = groupMatch[1].split('+').map(el => el.trim());
  return {
    elements,
    pattern: groupMatch[1],
    isGroup: true
  };
}

// 🆕 检查当前行是否匹配任何分组模式的起始元素
function checkGroupStart(line, groupConfigs) {
  for (const groupConfig of groupConfigs) {
    const firstElementType = groupConfig.pattern[0];
    const parseResult = parseMarkdownToTemplate(line, { [firstElementType]: 'temp' }, 0);
    
    if (parseResult && parseResult.markdownResult && parseResult.markdownResult.type === firstElementType) {
      return {
        groupConfig,
        startElement: parseResult.markdownResult
      };
    }
  }
  return null;
}

// 🆕 收集分组项目
function collectGroupItems(lines, startIndex, groupConfig, cardStyleConfig) {
  console.log(`🔍 开始收集分组项目，分组模式: ${groupConfig.pattern.join('+')}`);
  
  const groupPattern = groupConfig.pattern;
  const groupItems = [];
  let i = startIndex;
  
  while (i < lines.length) {
    const currentGroupItem = {
      elements: {},
      rawLines: []
    };
    
    // 收集一个完整的分组项
    let elementIndex = 0;
    let j = i;
    let consecutiveEmptyLines = 0; // 🆕 跟踪连续空行数量
    
    while (j < lines.length && elementIndex < groupPattern.length) {
      const line = lines[j].trim();
      
      // 🆕 处理空行：允许分组内的空行，但限制连续空行数量
      if (!line) {
        consecutiveEmptyLines++;
        // 🆕 如果连续空行超过3行，可能是分组结束
        if (consecutiveEmptyLines > 3) {
          console.log(`🔍 连续空行过多(${consecutiveEmptyLines})，可能是分组结束`);
          break;
        }
        j++;
        continue;
      }
      
      // 🆕 重置连续空行计数
      consecutiveEmptyLines = 0;
      
      const expectedType = groupPattern[elementIndex];
      const parseResult = parseMarkdownToTemplate(line, { [expectedType]: 'temp' }, 0);
      
      if (parseResult && parseResult.markdownResult && parseResult.markdownResult.type === expectedType) {
        // 匹配期望的元素类型
        currentGroupItem.elements[expectedType] = parseResult.markdownResult.content;
        currentGroupItem.rawLines.push(line);
        elementIndex++;
        console.log(`✅ 匹配到 ${expectedType}: "${parseResult.markdownResult.content}"`);
      } else if (expectedType === 'p') {
        // 🆕 对于p类型，需要特殊处理
        if (line === '§PARAGRAPH§') {
          // 如果是段落分隔符，跳过并继续寻找真正的段落内容
          j++;
          continue;
        } else if (line.match(/^[^#\[\|]/)) {
          // 匹配非标题行、非链接行、非表格行
          // 排除以 # 开头的标题、以 [ 开头的链接、以 | 开头的表格
          currentGroupItem.elements['p'] = line;
          currentGroupItem.rawLines.push(line);
          elementIndex++;
          console.log(`✅ 匹配到段落: "${line}"`);
        } else {
          // 不匹配段落格式，跳过这行继续寻找
          j++;
          continue;
        }
      } else {
        // 不匹配，检查是否是新的分组开始
        const newGroupCheck = checkGroupStart(line, [groupConfig]);
        if (newGroupCheck && elementIndex > 0) {
          // 是新的分组开始，当前分组项收集完成
          console.log(`🔄 检测到新分组开始，当前分组项收集完成 (已收集${elementIndex}/${groupPattern.length}个元素)`);
          break;
        } else if (elementIndex === 0) {
          // 第一个元素就不匹配，说明不是分组
          console.log(`❌ 第一个元素不匹配，不是有效分组: "${line}"`);
          return null;
        } else {
          // 🆕 改进：如果不是期望的类型，但已经收集了一些元素，检查是否可以跳过这行
          console.log(`⚠️ 不匹配期望类型 ${expectedType}，尝试跳过: "${line}"`);
          // 跳过不匹配的行，继续寻找下一个期望的元素
          j++;
          continue;
        }
      }
      
      j++;
    }
    
    // 如果收集到了完整的分组项（所有元素都有）
    if (elementIndex === groupPattern.length) {
      groupItems.push(currentGroupItem);
      i = j;
      
      // 检查下一行是否是新的分组开始
      if (j < lines.length) {
        const nextLine = lines[j].trim();
        if (nextLine) {
          const nextGroupCheck = checkGroupStart(nextLine, [groupConfig]);
          if (!nextGroupCheck) {
            // 不是新的分组开始，结束收集
            break;
          }
        }
      }
    } else {
      // 没有收集到完整的分组项，结束收集
      break;
    }
  }
  
  if (groupItems.length > 0) {
    const groupContent = groupItems.map(item => item.rawLines.join('\n')).join('\n\n');
    console.log(`📋 收集到 ${groupItems.length} 个分组项目`);
    
    return {
      items: groupItems,
      content: groupContent,
      nextIndex: i
    };
  }
  
  return null;
}

// 🆕 解析自定义样式标签，如 <percentValue color={color.success.green5}>#### 15%</percentValue>
function parseCustomStyleTag(line) {
  // 匹配格式: <tagName attr1={value1} attr2={value2}>content</tagName>
  const customTagRegex = /<(\w+)(\s+[^>]*)?>([^<]+)<\/\1>/;
  const match = line.match(customTagRegex);
  
  if (!match) {
    return null;
  }
  
  const tagName = match[1];
  const attributesStr = match[2] || '';
  const content = match[3].trim();
  
  // 解析属性
  const customStyles = {};
  if (attributesStr.trim()) {
    // 匹配属性格式: attr={value}
    const attrRegex = /(\w+)=\{([^}]+)\}/g;
    let attrMatch;
    while ((attrMatch = attrRegex.exec(attributesStr)) !== null) {
      const attrName = attrMatch[1];
      const attrValue = attrMatch[2];
      
      // 将属性名转换为CSS样式属性
      const cssProperty = attrName === 'color' ? 'color' : attrName;
      customStyles[cssProperty] = attrValue;
    }
  }
  
  console.log(`🎨 解析到自定义样式标签: ${tagName}, 内容: "${content}", 样式:`, customStyles);
  
  return {
    variant: tagName,
    content: content,
    customStyles: customStyles
  };
}

// 🆕 解析 markdown 格式并映射到模板路径
function parseMarkdownToTemplate(line, markdownMapping, listItemCounter = 0) {
  let currentListItemCounter = listItemCounter;
  
  // 🆕 首先检查是否是自定义样式标签
  const customStyleResult = parseCustomStyleTag(line);
  if (customStyleResult) {
    // 解析内容部分的markdown格式（如 #### 15%）
    const contentResult = parseMarkdownToTemplate(customStyleResult.content, markdownMapping, currentListItemCounter);
    if (contentResult && contentResult.markdownResult) {
      // 将自定义样式附加到解析结果
      return {
        markdownResult: {
          ...contentResult.markdownResult,
          customVariant: customStyleResult.variant,
          customStyles: customStyleResult.customStyles
        },
        newListItemCounter: contentResult.newListItemCounter
      };
    }
  }
  
  // 🆕 优先检查列表项格式（支持单独的li:n映射）
  const listItemInfo = isListItem(line);
  
  if (listItemInfo.isList) {
    // 增加列表项计数器
    currentListItemCounter++;
    
    // 构造列表项映射键，例如 'li:1', 'li:2'
    const listItemKey = `li:${currentListItemCounter}`;
    
    // 🆕 先尝试通配符匹配 li:*
    const wildcardResult = findWildcardMatch(listItemKey, markdownMapping);
    
    if (wildcardResult.matched) {
      const processedTemplatePath = processTemplatePathWithWildcard(
        wildcardResult.templatePath, 
        wildcardResult.wildcard || currentListItemCounter.toString()
      );
      
      console.log(`🎯 列表项通配符匹配: ${listItemKey} -> ${processedTemplatePath}`, { 
        wildcard: wildcardResult.wildcard, 
        pattern: wildcardResult.pattern,
        originalTemplate: wildcardResult.templatePath,
        processedTemplate: processedTemplatePath 
      });
      return {
        markdownResult: {
          type: 'li',
          listItemNumber: currentListItemCounter,
          templatePath: processedTemplatePath,
          content: listItemInfo.content.trim(),
          wildcard: wildcardResult.wildcard,
          pattern: wildcardResult.pattern
        },
        newListItemCounter: currentListItemCounter
      };
    }
    
    // 然后尝试精确匹配
    if (markdownMapping[listItemKey]) {
      console.log(`🎯 使用专门的列表项映射: ${listItemKey} -> ${markdownMapping[listItemKey]}`);
      return {
        markdownResult: {
          type: 'li',
          listItemNumber: currentListItemCounter,
          templatePath: markdownMapping[listItemKey],
          content: listItemInfo.content.trim()
        },
        newListItemCounter: currentListItemCounter
      };
    } else {
      console.log(`⚪ 无专门的列表项映射: ${listItemKey}，将使用默认处理`);
      // 如果没有专门的li:n映射，重置计数器，让它走通用的ul处理
      currentListItemCounter = listItemCounter;
    }
  }
  
  // 检查标题格式
  const h1Match = line.match(/^#\s+(.+)$/);
  if (h1Match && markdownMapping.h1) {
    return {
      markdownResult: {
        type: 'h1',
        templatePath: markdownMapping.h1,
        content: h1Match[1].trim()
      },
      newListItemCounter: currentListItemCounter
    };
  }
  
  const h2Match = line.match(/^##\s+(.+)$/);
  if (h2Match && markdownMapping.h2) {
    return {
      markdownResult: {
        type: 'h2',
        templatePath: markdownMapping.h2,
        content: h2Match[1].trim()
      },
      newListItemCounter: currentListItemCounter
    };
  }
  
  const h3Match = line.match(/^###\s+(.+)$/);
  if (h3Match && markdownMapping.h3) {
    return {
      markdownResult: {
        type: 'h3',
        templatePath: markdownMapping.h3,
        content: h3Match[1].trim()
      },
      newListItemCounter: currentListItemCounter
    };
  }
  
  const h4Match = line.match(/^####\s+(.+)$/);
  if (h4Match && markdownMapping.h4) {
    return {
      markdownResult: {
        type: 'h4',
        templatePath: markdownMapping.h4,
        content: h4Match[1].trim()
      },
      newListItemCounter: currentListItemCounter
    };
  }
  
  const h5Match = line.match(/^#####\s+(.+)$/);
  if (h5Match && markdownMapping.h5) {
    return {
      markdownResult: {
        type: 'h5',
        templatePath: markdownMapping.h5,
        content: h5Match[1].trim()
      },
      newListItemCounter: currentListItemCounter
    };
  }
  
  const h6Match = line.match(/^######\s+(.+)$/);
  if (h6Match && markdownMapping.h6) {
    return {
      markdownResult: {
        type: 'h6',
        templatePath: markdownMapping.h6,
        content: h6Match[1].trim()
      },
      newListItemCounter: currentListItemCounter
    };
  }
  
  // 检查列表格式
  if (listItemInfo.isList && markdownMapping.ul) {
    return {
      markdownResult: {
        type: 'ul',
        templatePath: markdownMapping.ul,
        content: listItemInfo.content.trim()
      },
      newListItemCounter: currentListItemCounter
    };
  }
  
  // 检查有序列表格式
  const orderedListMatch = line.match(/^\d+\.\s+(.+)$/);
  if (orderedListMatch && markdownMapping.ol) {
    return {
      markdownResult: {
        type: 'ol',
        templatePath: markdownMapping.ol,
        content: orderedListMatch[1].trim()
      },
      newListItemCounter: currentListItemCounter
    };
  }
  
  // 🆕 检查事件语法格式 [event:eventName][text](url) - 创建为 primary 按钮
  const eventLinkMatch = line.match(/^\[event:\w+\]\s*\[([^\]]+)\]\(([^)]+)\)$/);
  if (eventLinkMatch) {
    const primaryButtonMapping = markdownMapping['button:primary'];
    if (primaryButtonMapping) {
      console.log(`🔍 事件链接解析为 primary 按钮: ${eventLinkMatch[1]} -> ${primaryButtonMapping}`);
      return {
        markdownResult: {
          type: 'button',
          variant: 'primary',
          templatePath: primaryButtonMapping,
          content: eventLinkMatch[1].trim(), // 按钮文本
          url: eventLinkMatch[2].trim(),     // 按钮URL
          originalText: line.trim()          // 🆕 保存原始完整文本，包含事件语法
        },
        newListItemCounter: currentListItemCounter
      };
    }
  }
  
  // 检查链接格式 [text](url) - 默认创建为 primary 按钮
  const linkMatch = line.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
  if (linkMatch) {
    // 🔧 优先查找 button:primary 映射，如果没有则使用 a 映射
    const primaryButtonMapping = markdownMapping['button:primary'];
    const linkMapping = markdownMapping.a;
    
    if (primaryButtonMapping) {
      console.log(`🔍 普通链接解析为 primary 按钮: ${linkMatch[1]} -> ${primaryButtonMapping}`);
      return {
        markdownResult: {
          type: 'button',
          variant: 'primary',
          templatePath: primaryButtonMapping,
          content: linkMatch[1].trim(), // 按钮文本
          url: linkMatch[2].trim()      // 按钮URL
        },
        newListItemCounter: currentListItemCounter
      };
    } else if (linkMapping) {
      console.log(`🔍 普通链接解析为超链接: ${linkMatch[1]} -> ${linkMapping}`);
      return {
        markdownResult: {
          type: 'a',
          templatePath: linkMapping,
          content: linkMatch[1].trim(), // 链接文本
          url: linkMatch[2].trim()      // 链接URL
        },
        newListItemCounter: currentListItemCounter
      };
    }
  }
  
  // 检查带变体的按钮格式 [variant][text](url)
  const buttonVariantMatch = line.match(/^\[(\w+)\]\s*\[([^\]]+)\]\(([^)]+)\)$/);
  if (buttonVariantMatch) {
    const variant = buttonVariantMatch[1];
    const buttonMappingKey = `button:${variant}`; // 构造按钮映射键，如 'button:primary'
    const buttonTemplatePath = markdownMapping[buttonMappingKey];
    
    if (buttonTemplatePath) {
      return {
        markdownResult: {
          type: 'button',
          variant: variant,
          templatePath: buttonTemplatePath,
          content: buttonVariantMatch[2].trim(), // 按钮文本
          url: buttonVariantMatch[3].trim()      // 按钮链接
        },
        newListItemCounter: currentListItemCounter
      };
    }
  }
  
  // 检查图片格式 ![alt](url)
  const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
  
  if (imgMatch && markdownMapping.img) {
    return {
      markdownResult: {
        type: 'img',
        templatePath: markdownMapping.img,
        content: imgMatch[1].trim(), // 图片alt文本
        url: imgMatch[2].trim()      // 图片URL
      },
      newListItemCounter: currentListItemCounter
    };
  }
  
  // 🆕 检查代码块格式 ```language
  const codeBlockMatch = line.match(/^```(\w+)?$/);
  if (codeBlockMatch) {
    const language = codeBlockMatch[1] || 'plaintext';
    const templatePath = markdownMapping.code || markdownMapping.p || markdownMapping.others;
    console.log(`🎯 发现代码块开始: ${language}, 映射路径: ${templatePath}`);
    return {
      markdownResult: {
        type: 'code',
        language: language,
        templatePath: templatePath, // 优先使用 code 映射，其次 p 映射，最后 others 映射
        content: line.trim(),
        isCodeBlockStart: true
      },
      newListItemCounter: currentListItemCounter
    };
  }
  
  // 🆕 检查代码块结束标记 ```
  if (line.trim() === '```') {
    const templatePath = markdownMapping.code || markdownMapping.p || markdownMapping.others;
    console.log(`🎯 发现代码块结束, 映射路径: ${templatePath}`);
    return {
      markdownResult: {
        type: 'code',
        templatePath: templatePath, // 优先使用 code 映射，其次 p 映射，最后 others 映射
        content: line.trim(),
        isCodeBlockEnd: true
      },
      newListItemCounter: currentListItemCounter
    };
  }
  
  // 🆕 检查引用格式 > content
  const blockquoteMatch = line.match(/^>\s*(.+)$/);
  if (blockquoteMatch && markdownMapping.blockquote) {
    return {
      markdownResult: {
        type: 'blockquote',
        templatePath: markdownMapping.blockquote,
        content: blockquoteMatch[1].trim()
      },
      newListItemCounter: currentListItemCounter
    };
  }
  
  // 🆕 检查表格格式 | 表头 | 表头 |
  if (line.includes('|') && markdownMapping.table) {
    const trimmedLine = line.trim();
    // 检查是否是表格行（包含竖线分隔符）
    // 匹配标准markdown表格格式：|列1|列2| 或 列1|列2|列3
    const isTableLine = trimmedLine.match(/^\|.*\|$/) || 
                       trimmedLine.match(/^[^|]*\|.*\|[^|]*$/) ||
                       trimmedLine.match(/^[-|\s|:]+$/); // 表格分隔行如 |---|---|
    
    if (isTableLine) {
      console.log(`🎯 发现表格行: ${trimmedLine.substring(0, 50)}...`);
      return {
        markdownResult: {
          type: 'table',
          templatePath: markdownMapping.table,
          content: trimmedLine, // 返回原始表格行
          isTableLine: true
        },
        newListItemCounter: currentListItemCounter
      };
    }
  }
  
  // 🆕 检查图表格式 [chart:type|title] 或 [chart:type] (新增标题支持)
  const chartMatch = line.match(/^\[chart:(.+?)\]/);
  if (chartMatch) {
    const fullChartSpec = chartMatch[1];
    // 🆕 解析图表类型和可选标题
    const [chartType, chartTitle] = fullChartSpec.includes('|') 
      ? fullChartSpec.split('|', 2).map(s => s.trim())
      : [fullChartSpec.trim(), null];
    
    const chartKey = `chart:${chartType}`;
    
    // 先尝试通配符匹配
    const wildcardResult = findWildcardMatch(chartKey, markdownMapping);
    if (wildcardResult.matched) {
      const processedTemplatePath = processTemplatePathWithWildcard(
        wildcardResult.templatePath, 
        wildcardResult.wildcard || chartType
      );
      
      console.log(`🎯 发现图表 (通配符匹配): ${chartKey} -> ${processedTemplatePath}${chartTitle ? `, 标题: ${chartTitle}` : ''}`);
      return {
        markdownResult: {
          type: 'chart',
          chartType: chartType,
          chartTitle: chartTitle, // 🆕 添加图表标题
          templatePath: processedTemplatePath,
          content: line.trim(),
          wildcard: wildcardResult.wildcard,
          pattern: wildcardResult.pattern
        },
        newListItemCounter: currentListItemCounter
      };
    }
    
    // 如果没有通配符匹配，尝试精确匹配（兼容旧逻辑）
    if (markdownMapping[chartKey] || markdownMapping.chart) {
      const templatePath = markdownMapping[chartKey] || markdownMapping.chart;
      console.log(`🎯 发现图表 (精确匹配): ${chartKey} -> ${templatePath}${chartTitle ? `, 标题: ${chartTitle}` : ''}`);
      return {
        markdownResult: {
          type: 'chart',
          chartType: chartType,
          chartTitle: chartTitle, // 🆕 添加图表标题
          templatePath: templatePath,
          content: line.trim()
        },
        newListItemCounter: currentListItemCounter
      };
    }
  }
  
  // 🆕 检查自定义项目格式 item:n (新增功能)
  const itemMatch = line.match(/^item:(\d+)\s+(.+)$/);
  if (itemMatch) {
    const itemNumber = itemMatch[1];
    const itemContent = itemMatch[2];
    const itemKey = `item:${itemNumber}`;
    
    // 尝试通配符匹配
    const wildcardResult = findWildcardMatch(itemKey, markdownMapping);
    if (wildcardResult.matched) {
      const processedTemplatePath = processTemplatePathWithWildcard(
        wildcardResult.templatePath, 
        wildcardResult.wildcard || itemNumber
      );
      
      console.log(`🎯 发现自定义项目 (通配符匹配): ${itemKey} -> ${processedTemplatePath}`);
      return {
        markdownResult: {
          type: 'item',
          itemNumber: parseInt(itemNumber),
          templatePath: processedTemplatePath,
          content: itemContent.trim(),
          wildcard: wildcardResult.wildcard,
          pattern: wildcardResult.pattern
        },
        newListItemCounter: currentListItemCounter
      };
    }
    
    // 如果没有通配符匹配，尝试精确匹配
    if (markdownMapping[itemKey]) {
      console.log(`🎯 发现自定义项目 (精确匹配): ${itemKey} -> ${markdownMapping[itemKey]}`);
      return {
        markdownResult: {
          type: 'item',
          itemNumber: parseInt(itemNumber),
          templatePath: markdownMapping[itemKey],
          content: itemContent.trim()
        },
        newListItemCounter: currentListItemCounter
      };
    }
  }
  
  // 🆕 检查段落格式（非空行且不匹配其他格式）
  if (line.trim() && markdownMapping.p) {
    // 🔧 修复：清理段落符号
    const cleanedContent = line.trim().replace(/§PARAGRAPH§/g, '');
    if (cleanedContent) {
      return {
        markdownResult: {
          type: 'p',
          templatePath: markdownMapping.p,
          content: cleanedContent
        },
        newListItemCounter: currentListItemCounter
      };
    }
  }
  
  // 如果没有匹配到任何 markdown 格式，返回 null
  return null;
}

// 🆕 创建或合并到现有容器的模板元素
function createOrMergeTemplateElement(templatePath, content, cardStyleConfig, containerMap, children, existingElement = null, markdownData = null, currentMarkdown = '') {
  console.log(`创建或合并模板元素，路径: ${templatePath}, 内容: "${content}", 已有元素: ${existingElement ? existingElement.type : 'null'}`);

  
  // 🔧 验证 templatePath 参数
  if (!templatePath || typeof templatePath !== 'string') {
    console.error(`❌ templatePath 无效: ${templatePath}, 类型: ${typeof templatePath}`);
    console.error('调用堆栈信息:', new Error().stack);
    
    // 如果有已存在的元素，直接添加到children中
    if (existingElement) {
      console.log(`🔧 直接添加已存在元素到children: ${existingElement.type}`);
      children.push(existingElement);
      return existingElement;
    }
    
    return null;
  }
  
  // 解析路径（支持嵌套路径如 'content.title'）
  const pathParts = templatePath.split('.');
  
  if (pathParts.length === 1) {
    // 简单路径，需要检查是否需要创建容器
    const tagName = pathParts[0];
    
    if (existingElement) {
      // 如果传入了已解析的元素，需要创建容器来包裹它
      console.log(`为已解析元素创建容器: ${tagName}`);
      
      // 检查是否已经存在该容器
      let containerElement = containerMap.get(tagName);
      if (!containerElement) {
        // 创建新的容器
        containerElement = createTemplateTagElement(tagName, '', cardStyleConfig);
        if (!containerElement) {
          return null;
        }
        
        // 将容器添加到children并记录到containerMap
        children.push(containerElement);
        containerMap.set(tagName, containerElement);
        console.log(`创建新的容器: ${tagName}`);
      } else {
        console.log(`使用现有容器: ${tagName}`);
      }
      
      // 将已解析的元素添加到容器中
      if (containerElement.layout && containerElement.layout.children) {
        containerElement.layout.children.push(existingElement);
        console.log(`将元素添加到容器 ${tagName} 中，当前子元素数量: ${containerElement.layout.children.length}`);
      }
      
      return existingElement;
    } else {
      // 否则创建新的模板元素，直接添加到children
      const templateElement = createTemplateTagElement(tagName, content, cardStyleConfig, markdownData, currentMarkdown);
      if (templateElement) {
        children.push(templateElement);
      }
      return templateElement;
    }
  } else if (pathParts.length === 2) {
    // 嵌套路径，需要处理容器合并
    const parentTagName = pathParts[0];
    const childTagName = pathParts[1];
    
    // 检查父级配置是否存在
    const parentConfig = cardStyleConfig[parentTagName];
    if (!parentConfig) {
      console.warn(`警告: 未找到父级模板标签 ${parentTagName} 的配置`);
      return null;
    }
    
    // 🆕 检查子级配置是否存在（支持通配符匹配）
    let childConfig = parentConfig[childTagName];
    let actualChildTagName = childTagName;
    
    // 如果直接匹配失败，尝试通配符匹配
    if (!childConfig) {
      console.log(`直接匹配失败，尝试通配符匹配: ${childTagName}`);
      
      // 在父级配置中查找通配符模式
      for (const [configKey, configValue] of Object.entries(parentConfig)) {
        if (configKey.includes('*')) {
          const wildcardMatch = extractWildcardMatch(childTagName, configKey);
          if (wildcardMatch !== null) {
            childConfig = configValue;
            actualChildTagName = childTagName; // 保持实际的子元素名称
            console.log(`🎯 通配符匹配成功: ${childTagName} 匹配模式 ${configKey}`);
            break;
          }
        }
      }
    }
    
    if (!childConfig) {
      console.warn(`警告: 未找到子级模板标签 ${parentTagName}.${childTagName} 的配置`);
      return null;
    }
    
    // 创建子元素
    let childElement;
    if (existingElement) {
      // 如果传入了已解析的元素，直接使用
      childElement = existingElement;
    } else {
      // 否则创建新的模板元素，使用子元素配置
      // 为子元素创建临时配置对象，以便createTemplateTagElement能正确访问
      const tempChildConfig = { [actualChildTagName]: childConfig };
      childElement = createTemplateTagElement(actualChildTagName, content, tempChildConfig, markdownData);
      if (!childElement) {
        return null;
      }
    }
    
    // 检查是否已经存在该容器
    let parentElement = containerMap.get(parentTagName);
    if (!parentElement) {
      // 创建新的父容器
      parentElement = createTemplateTagElement(parentTagName, '', cardStyleConfig);
      if (!parentElement) {
        return null;
      }
      
      // 将父容器添加到children并记录到containerMap
      children.push(parentElement);
      containerMap.set(parentTagName, parentElement);
      console.log(`创建新的容器: ${parentTagName}`);
    } else {
      console.log(`使用现有容器: ${parentTagName}`);
    }
    
    // 将子元素添加到父容器中
    if (parentElement.layout && parentElement.layout.children) {
      parentElement.layout.children.push(childElement);
      console.log(`将 ${actualChildTagName} 添加到容器 ${parentTagName} 中，当前子元素数量: ${parentElement.layout.children.length}`);
    }
    
    return childElement;
  } else if (pathParts.length >= 3) {
    // 🆕 支持三层及以上嵌套路径，如 listContainer.list.item*
    console.log(`🔍 处理多层嵌套路径: ${templatePath}, 层数: ${pathParts.length}`, { 
      pathParts, 
      content: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
      cardStyleConfigKeys: Object.keys(cardStyleConfig)
    });
    
    // 递归处理嵌套路径
    let currentContainer = null;
    let currentConfig = cardStyleConfig;
    
    // 逐层处理每个路径部分
    for (let i = 0; i < pathParts.length - 1; i++) {
      const currentTagName = pathParts[i];
      console.log(`处理第 ${i + 1} 层: ${currentTagName}`);
      
      // 检查当前层的配置
      if (!currentConfig[currentTagName]) {
        console.warn(`警告: 未找到模板标签 ${currentTagName} 的配置`);
        return null;
      }
      
      // 检查是否已经存在该容器
      const containerKey = pathParts.slice(0, i + 1).join('.');
      let containerElement = containerMap.get(containerKey);
      
      if (!containerElement) {
        // 创建新的容器
        containerElement = createTemplateTagElement(currentTagName, '', currentConfig, null, currentMarkdown);
        if (!containerElement) {
          return null;
        }
        
        // 将容器添加到正确的父级中
        if (currentContainer) {
          // 添加到父容器中
          if (currentContainer.layout && currentContainer.layout.children) {
            currentContainer.layout.children.push(containerElement);
          }
        } else {
          // 添加到根级children中
          children.push(containerElement);
        }
        
        containerMap.set(containerKey, containerElement);
        console.log(`创建新的嵌套容器: ${containerKey}`);
      } else {
        console.log(`使用现有嵌套容器: ${containerKey}`);
      }
      
      // 更新当前容器和配置引用
      currentContainer = containerElement;
      currentConfig = currentConfig[currentTagName];
    }
    
    // 处理最后一层（实际的子元素）
    const finalTagName = pathParts[pathParts.length - 1];
    console.log(`处理最终子元素: ${finalTagName}`);
    
    // 🆕 检查最终子元素配置（支持通配符匹配）
    let finalConfig = currentConfig[finalTagName];
    let actualFinalTagName = finalTagName;
    let usedWildcardMatch = false;
    
    // 如果直接匹配失败，尝试通配符匹配
    if (!finalConfig) {
      console.log(`最终子元素直接匹配失败，尝试通配符匹配: ${finalTagName}`);
      
      // 在当前配置中查找通配符模式
      for (const [configKey, configValue] of Object.entries(currentConfig)) {
        if (configKey.includes('*')) {
          const wildcardMatch = extractWildcardMatch(finalTagName, configKey);
          if (wildcardMatch !== null) {
            finalConfig = configValue;
            actualFinalTagName = finalTagName; // 保持实际的子元素名称
            usedWildcardMatch = true; // 🔧 标记使用了通配符匹配
            console.log(`🎯 最终子元素通配符匹配成功: ${finalTagName} 匹配模式 ${configKey}`);
            break;
          }
        }
      }
    }
    
    if (!finalConfig) {
      console.warn(`警告: 未找到最终子元素 ${finalTagName} 的配置`);
      return null;
    }
    
    // 创建最终子元素
    let finalElement;
    if (existingElement) {
      // 如果传入了已解析的元素，直接使用
      finalElement = existingElement;
    } else {
      // 🔧 修复：如果使用了通配符匹配，创建一个临时的配置对象来传递正确的配置
      let tempConfig = currentConfig;
      if (usedWildcardMatch) {
        // 说明使用了通配符匹配，需要创建临时配置
        tempConfig = { ...currentConfig, [actualFinalTagName]: finalConfig };
        console.log(`🔧 创建临时配置，将 ${actualFinalTagName} 映射到通配符匹配的配置`);
      }
      
      // 否则创建新的模板元素
      finalElement = createTemplateTagElement(actualFinalTagName, content, tempConfig, markdownData, currentMarkdown);
      if (!finalElement) {
        return null;
      }
    }
    
    // 将最终子元素添加到最后一层容器中
    if (currentContainer && currentContainer.layout && currentContainer.layout.children) {
      currentContainer.layout.children.push(finalElement);
      console.log(`将 ${actualFinalTagName} 添加到最终容器中，当前子元素数量: ${currentContainer.layout.children.length}`);
    }
    
    return finalElement;
  } else {
    console.warn(`警告: 不支持的模板路径深度: ${templatePath}`);
    return null;
  }
}

// 🆕 根据模板路径创建对应的元素（兼容函数）
function createTemplateElementFromPath(templatePath, content, cardStyleConfig) {
  console.log(`创建模板元素，路径: ${templatePath}, 内容: "${content}"`);
  
  // 解析路径（支持嵌套路径如 'content.title'）
  const pathParts = templatePath.split('.');
  
  if (pathParts.length === 1) {
    // 简单路径，直接创建元素
    const tagName = pathParts[0];
    return createTemplateTagElement(tagName, content, cardStyleConfig);
  } else if (pathParts.length === 2) {
    // 嵌套路径，需要创建嵌套结构
    const parentTagName = pathParts[0];
    const childTagName = pathParts[1];
    
    // 检查父级配置是否存在
    const parentConfig = cardStyleConfig[parentTagName];
    if (!parentConfig) {
      console.warn(`警告: 未找到父级模板标签 ${parentTagName} 的配置`);
      return null;
    }
    
    // 检查子级配置是否存在
    const childConfig = parentConfig[childTagName];
    if (!childConfig) {
      console.warn(`警告: 未找到子级模板标签 ${parentTagName}.${childTagName} 的配置`);
      return null;
    }
    
    // 先创建子元素
    const childElement = createTemplateTagElement(childTagName, content, parentConfig, null);
    if (!childElement) {
      return null;
    }
    
    // 然后创建父元素，将子元素作为其内容
    const parentElement = createTemplateTagElement(parentTagName, '', cardStyleConfig, null);
    if (!parentElement) {
      return null;
    }
    
    // 将子元素添加到父元素的 children 中
    if (parentElement.layout && parentElement.layout.children) {
      parentElement.layout.children.push(childElement);
    }
    
    console.log(`创建嵌套模板元素: ${parentTagName} > ${childTagName}`);
    return parentElement;
  } else {
    console.warn(`警告: 不支持的模板路径深度: ${templatePath}`);
    return null;
  }
}

// 提取模板标签内容
function extractTemplateTag(lines, startIndex, tagName) {
  console.log(`提取模板标签 ${tagName}，从第${startIndex}行开始`);
  
  const contentLines = [];
  let i = startIndex + 1;
  let foundEnd = false;
  
  while (i < lines.length) {
    const line = lines[i];
    const closingTagMatch = line.trim().match(new RegExp(`^</${tagName}>$`));
    
    if (closingTagMatch) {
      foundEnd = true;
      break;
    }
    
    contentLines.push(line);
    i++;
  }
  
  if (!foundEnd) {
    console.warn(`警告: 未找到模板标签 ${tagName} 的结束标签`);
  }
  
  const tagContent = contentLines.join('\n').trim();
  console.log(`模板标签 ${tagName} 提取完成，内容长度: ${tagContent.length}，结束索引: ${i}`);
  
  return {
    tagContent,
    endIndex: i
  };
}

// 🆕 创建元素容器（用于包装具有样式的元素）
function createElementContainer(tagName, content, cardStyleConfig, elementInstance, markdownData = null) {
  const id = generateUUID();
  const uniqueClassName = `template-${tagName}-${id}`;
  const tagConfig = cardStyleConfig[tagName] || {};
  
  // 创建容器来包装元件实例
  const containerElement = {
    dataKeys: [],
    name: "layout",
    "name-zh": `模板标签容器-${tagName}`,
    "file-type": "template",
    theme: "default",
    _metadata: {
      actualType: 'templateTag',
      tagName: tagName,
      isTemplateTag: true,
      isLayout: true,
      isElementContainer: true,
      containedElementType: markdownData ? markdownData.type : (tagConfig.metaType || 'unknown'),
      containedElementVariant: markdownData ? (markdownData.variant || 'default') : (tagConfig.variant || 'default'),
      tagContent: content
    },
    layout: {
      style: {
        display: LAYOUT_CONSTANTS.DISPLAY.FLEX,
        layoutMode: LAYOUT_CONSTANTS.DIRECTION.VERTICAL,
        layoutWrap: LAYOUT_CONSTANTS.WRAP.NO_WRAP,
        primaryAxisSizingMode: "fixed",
        // layoutGrow: LAYOUT_CONSTANTS.GROW.ZERO,
        boxSizing: "border-box",
        "border-style": "solid",
        "border-width": "0",
        "border-color": "initial",
        height: "auto",
        width: tagConfig.metaType === "button" ? "auto" : "100%",
        "box-sizing": "border-box",
        position: "relative",
        ...(tagConfig.style || {}) // 应用标签样式
      },
      classStyle: {
        ...(tagConfig.style || {})
      },
      className: uniqueClassName,
      children: [elementInstance] // 包装元件实例
    },
    description: `模板标签容器 - ${tagName}`,
    id,
    events: [{}]
  };
  
  return containerElement;
}
// 🆕 应用自定义样式覆盖
function applyCustomStyleOverride(baseStyle, customStyles, customVariant) {
  if (!customStyles) {
    return baseStyle;
  }
  
  // 创建样式副本并应用覆盖
  const overriddenStyle = { ...baseStyle };
  
  Object.entries(customStyles).forEach(([property, value]) => {
      // const resolvedValue = resolveToken(`{${value}}`);
      overriddenStyle[property] = `{${value}}`;
  });
  
  return overriddenStyle;
}

// 创建模板标签元素
function createTemplateTagElement(tagName, content, cardStyleConfig, markdownData = null, currentMarkdown = '') {

  const id = generateUUID();
  const uniqueClassName = `template-${tagName}-${id}`;
  
  // 获取标签配置
  const tagConfig = cardStyleConfig[tagName];
  if (!tagConfig) {
    console.warn(`警告: 未找到模板标签 ${tagName} 的配置`);
    return null;
  }

  // 🆕 检查是否有嵌套的markdownMapping，如果有，需要递归解析内容
  if (tagConfig.markdownMapping && content && content.trim()) {
    console.log(`🔍 发现嵌套markdownMapping，递归解析内容: ${tagName}`);
    
    // 递归解析嵌套的markdown内容
    const nestedChildren = [];
    const nestedContainerMap = new Map();
    
    // 使用递归调用parseTemplateCardContent来处理嵌套内容
    const nestedElements = parseTemplateCardContent(content, tagConfig, true);
    
    if (nestedElements && nestedElements.length > 0) {
      console.log(`✅ 嵌套解析成功，获得 ${nestedElements.length} 个子元素`);
      
      // 创建容器元素来包装嵌套的子元素
      const containerElement = {
        dataKeys: [],
        name: "layout",
        "name-zh": `嵌套模板容器-${tagName}`,
        "file-type": "template",
        type: "layout",
        variant: "normal",
        id: id,
        className: uniqueClassName,
        layout: {
          direction: tagConfig.style?.flexDirection === 'row' ? 'horizontal' : 'vertical',
          style: tagConfig.style || {},
          children: nestedElements,
          classStyle: {
            ...(tagConfig.style || {})
          },
          className: uniqueClassName,
        },
        
      };
      
      return containerElement;
    }
  }

  // 🆕 优先检查 markdownData 的类型，决定如何渲染元素
  if (markdownData && markdownData.type) {
    console.log(`根据 markdownData 类型创建元素: ${markdownData.type}`);
    
    let elementInstance = null;
    if (markdownData.type === 'code') {
      // 代码块类型，优先创建代码元素
      const language = markdownData.language || 'plaintext';
      console.log(`创建代码元素: 语言="${language}", 内容="${content.substring(0, 50)}..."`);
      elementInstance = createCodeElement(content, language);
    } else if (markdownData.type === 'table') {
      // 表格类型
      console.log(`创建表格元素: 内容="${content.substring(0, 50)}..."`);
      elementInstance = createTableElement(content);
    } else if (markdownData.type === 'img') {
      // 图片类型
      const imageUrl = markdownData.url || '';
      console.log(`创建图片元素: URL="${imageUrl}"`);
      elementInstance = createBackgroundElement(imageUrl, 'normal');
    } else if (markdownData.type === 'button') {
      // 按钮类型
      const buttonText = content;
      const buttonUrl = markdownData.url || '#';
      const buttonVariant = markdownData.variant || 'primary';  // 🔧 修复：使用 variant 而不是 buttonVariant
      console.log(`🔍 createTemplateTagElement: 按钮类型处理 - 文本="${buttonText}", URL="${buttonUrl}", 变体="${buttonVariant}"`);
      console.log(`🔍 markdownData 完整内容:`, markdownData);
      
      // 🆕 如果有原始文本，使用原始文本来解析事件；否则使用按钮文本
      const textForEventParsing = markdownData.originalText || buttonText;
      console.log(`🔍 用于事件解析的文本: "${textForEventParsing}"`);
      elementInstance = createButtonElement(textForEventParsing, buttonUrl, buttonVariant, currentMarkdown);
    }
    
    // 如果成功创建了元素实例，跳过后续的 tagConfig 处理
    if (elementInstance) {
      // 如果标签配置中有 style，需要创建容器来包装元件并应用样式
      if (tagConfig.style) {
        console.log(`为 markdownData 元素创建样式容器: ${tagName}`);
        
        // 创建容器来包装元件实例
        const containerElement = createElementContainer(tagName, content, cardStyleConfig, elementInstance, markdownData);
        return containerElement;
      } else {
        return elementInstance;
      }
    }
  }
  
  // 检查是否为元件引用（回退到原有逻辑）
  if (tagConfig.metaType && tagConfig.variant) {
    console.log(`创建元件引用: ${tagConfig.metaType}.${tagConfig.variant}`);
    
    // 🆕 处理自定义样式覆盖
    let finalVariant = tagConfig.variant;
    let styleOverride = null;
    
    // 检查是否有自定义变体和样式
    if (markdownData && markdownData.customVariant) {
      console.log(`🎨 检测到自定义变体: ${markdownData.customVariant}`);
      // 如果自定义变体与当前标签配置匹配，应用自定义样式
      if (markdownData.customVariant === finalVariant) {
        styleOverride = markdownData.customStyles;
        console.log(`✅ 变体匹配，将应用自定义样式:`, styleOverride);
      }
    }
    
    // 根据 metaType 创建对应的元件
    let elementInstance = null;
    if (tagConfig.metaType === 'text') {
      console.log(`🔍 创建文本元素: content="${content.substring(0, 30)}...", variant="${finalVariant}"`);
      // 🆕 将自定义样式传递给文本元件
      elementInstance = createTextElement(content, finalVariant, {}, styleOverride);
      console.log(`🔍 文本元素创建结果:`, elementInstance ? '成功' : '失败');
    } else if (tagConfig.metaType === 'button') {
      // 🆕 处理button类型，从markdownData中获取URL和变体信息
      const buttonText = content;
      const buttonUrl = markdownData && markdownData.url ? markdownData.url : '#';
      // 🔧 修复：优先使用markdownData中的variant，回退到tagConfig中的variant
      const buttonVariant = (markdownData && markdownData.variant) ? markdownData.variant : tagConfig.variant;
      console.log(`🔍 createTemplateTagElement: tagConfig.metaType=button 处理 - 文本="${buttonText}", URL="${buttonUrl}", 变体="${buttonVariant}"`);
      console.log(`🔍 markdownData:`, markdownData);
      console.log(`🔍 tagConfig:`, tagConfig);
      elementInstance = createButtonElement(buttonText, buttonUrl, buttonVariant);
    } else if (tagConfig.metaType === 'image') {
      // 🆕 处理image类型，从markdownData中获取URL
      const imageUrl = markdownData && markdownData.url ? markdownData.url : '';
      console.log(`创建image元件: URL="${imageUrl}", 变体="${tagConfig.variant}"`);
      elementInstance = createBackgroundElement(imageUrl, tagConfig.variant);
    } else if (tagConfig.metaType === 'table') {
      // 🆕 处理table类型，直接创建表格元素（不需要variant）
      console.log(`创建table元件: 内容="${content.substring(0, 50)}..."`);
      elementInstance = createTableElement(content);
    } else if (tagConfig.metaType === 'code') {
      // 🆕 处理code类型，创建代码元素
      const language = markdownData && markdownData.language ? markdownData.language : 'plaintext';
      console.log(`创建code元件: 语言="${language}", 内容="${content.substring(0, 50)}..."`);
      elementInstance = createCodeElement(content, language);
    }
    // 可以在这里添加其他元件类型的支持
    
    if (!elementInstance) {
      return null;
    }
    
    // 如果标签配置中有 style，需要创建容器来包装元件并应用样式
    if (tagConfig.style) {
      console.log(`为元件引用创建样式容器: ${tagName}`);
      
      // 🆕 容器使用基础样式，自定义样式已应用到元件级别
      const finalStyle = tagConfig.style;
      
      // 创建容器来包装元件实例
      const containerElement = {
        dataKeys: [],
        name: "layout",
        "name-zh": `模板标签容器-${tagName}`,
        "file-type": "template",
        theme: "default",
        _metadata: {
          actualType: 'templateTag',
          tagName: tagName,
          isTemplateTag: true,
          isLayout: true,
          isElementContainer: true,
          containedElementType: tagConfig.metaType,
          containedElementVariant: finalVariant,
          tagContent: content
        },
        layout: {
          style: {
            display: LAYOUT_CONSTANTS.DISPLAY.FLEX,
            layoutMode: LAYOUT_CONSTANTS.DIRECTION.VERTICAL,
            layoutWrap: LAYOUT_CONSTANTS.WRAP.NO_WRAP,
            primaryAxisSizingMode: "fixed",
            // layoutGrow: LAYOUT_CONSTANTS.GROW.ZERO,
            boxSizing: "border-box",
            "border-style": "solid",
            "border-width": "0",
            "border-color": "initial",
            height: "auto",
            width: "100%",
            "box-sizing": "border-box",
            position: "relative",
            ...finalStyle // 容器使用基础样式
          },
          classStyle: {
            ...finalStyle // 容器使用基础样式
          },
          className: uniqueClassName,
          children: [elementInstance] // 包装元件实例
        },
        description: `模板标签容器 - ${tagName}`,
        id,
        events: [{}]
      };
      
      return containerElement;
    } else {
      // 没有样式，直接返回元件实例
      return elementInstance;
    }
  }

  // 解析嵌套内容
  let children = [];
  if (content && content.trim()) {
    if (tagConfig.type === 'template') {
      // 递归解析嵌套的模板标签
      children = parseTemplateCardContent(content, tagConfig, false, currentMarkdown);
    } else {
      // 解析为普通内容
      const parsedContent = parseMarkdown(content, { currentMarkdown });
      children = parsedContent;
    }
  }

  // 创建模板标签元素
  const templateElement = {
    dataKeys: [],
    name: "layout",
    "name-zh": `模板标签-${tagName}`,
    "file-type": "template",
    theme: "default",
    _metadata: {
      actualType: 'templateTag',
      tagName: tagName,
      isTemplateTag: true,
      isLayout: true,
      tagContent: content
    },
    layout: {
      style: {
        display: LAYOUT_CONSTANTS.DISPLAY.FLEX,
        layoutMode: LAYOUT_CONSTANTS.DIRECTION.VERTICAL,
        layoutWrap: LAYOUT_CONSTANTS.WRAP.NO_WRAP,
        primaryAxisSizingMode: "fixed",
        // layoutGrow: LAYOUT_CONSTANTS.GROW.ZERO,
        boxSizing: "border-box",
        "border-style": "solid",
        "border-width": "0",
        "border-color": "initial",
        height: "auto",
        width: "100%",
        "box-sizing": "border-box",
        "back-width": "100%",
        "back-height": "auto",
        position: "relative",
        ...(tagConfig.style || {}) // 应用标签样式
      },
      classStyle: {
        ...(tagConfig.style || {})
      },
      className: uniqueClassName,
      children: children
    },
    description: `模板标签元素 - ${tagName}`,
    id,
    events: [{}]
  };

  return templateElement;
}

// 提取完整的引用块
function extractQuoteBlock(lines, startIndex) {
  console.log(`开始提取引用块，从第${startIndex}行开始`);
  
  const quoteLines = [];
  let i = startIndex;
  
  // 收集所有连续的引用行
  while (i < lines.length) {
    const line = lines[i];
    const quoteMatch = line.trim().match(/^>\s*(.*)$/);
    
    if (quoteMatch) {
      // 提取引用内容（去除 > 符号）
      quoteLines.push(quoteMatch[1]);
      i++;
    } else if (line.trim() === '') {
      // 空行继续检查下一行是否还是引用
      i++;
      if (i < lines.length && isQuoteText(lines[i])) {
        quoteLines.push(''); // 在引用内容中保留空行
        continue;
      } else {
        // 如果下一行不是引用，则引用块结束
        break;
      }
    } else {
      // 非引用行，引用块结束
      break;
    }
  }
  
  console.log(`引用块提取完成，共${quoteLines.length}行，结束索引: ${i - 1}`);
  
  return {
    quoteContent: quoteLines.join('\n').trim(),
    endIndex: i - 1
  };
}

// 提取完整的布局标签块
function extractLayoutBlock(lines, startIndex) {
  console.log(`开始提取布局标签块，从第${startIndex}行开始`);
  
  const startLine = lines[startIndex];
  const startTagInfo = isLayoutTag(startLine);
  
  if (!startTagInfo.isLayoutTag || startTagInfo.isClosing) {
    console.error('无效的布局标签起始行');
    return { layoutContent: '', variant: '', attributes: {}, endIndex: startIndex };
  }
  
  const variant = startTagInfo.variant;
  const attributes = startTagInfo.attributes || {};
  const contentLines = [];
  let i = startIndex + 1;
  let foundEnd = false;
  
  // 查找对应的结束标签
  while (i < lines.length) {
    const line = lines[i];
    const tagInfo = isLayoutTag(line);
    
    if (tagInfo.isLayoutTag && tagInfo.isClosing && tagInfo.variant === variant) {
      foundEnd = true;
      i++;
      break;
    }
    
    contentLines.push(line);
    i++;
  }
  
  if (!foundEnd) {
    console.warn(`警告: 未找到布局标签 ${variant} 的结束标签`);
  }
  
  console.log(`布局标签块提取完成，变体: ${variant}，属性:`, attributes, `内容行数: ${contentLines.length}，结束索引: ${i - 1}`);
  
  return {
    layoutContent: contentLines.join('\n').trim(),
    variant: variant,
    attributes: attributes,
    endIndex: i - 1
  };
}

// 提取完整的卡片标签块
function extractCardBlock(lines, startIndex) {
  console.log(`开始提取卡片标签块，从第${startIndex}行开始`);
  
  const startLine = lines[startIndex];
  const startTagInfo = isCardTag(startLine);
  
  if (!startTagInfo.isCardTag || startTagInfo.isClosing) {
    console.error('无效的卡片标签起始行');
    return { cardContent: '', variant: 'standard', attributes: {}, endIndex: startIndex };
  }
  
  const variant = startTagInfo.variant;
  const attributes = startTagInfo.attributes || {};
  const contentLines = [];
  let i = startIndex + 1;
  let foundEnd = false;
  
  // 查找对应的结束标签
  while (i < lines.length) {
    const line = lines[i];
    const tagInfo = isCardTag(line);
    
    if (tagInfo.isCardTag && tagInfo.isClosing && tagInfo.variant === variant) {
      foundEnd = true;
      i++;
      break;
    }
    
    contentLines.push(line);
    i++;
  }
  
  if (!foundEnd) {
    console.warn(`警告: 未找到卡片标签 ${variant} 的结束标签`);
  }
  
  console.log(`卡片标签块提取完成，变体: ${variant}，内容行数: ${contentLines.length}，结束索引: ${i - 1}`);
  
  return {
    cardContent: contentLines.join('\n').trim(),
    variant: variant,
    attributes: attributes,
    endIndex: i - 1
  };
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

// 解析按钮类型标记
function parseButtonVariant(text) {
  // 匹配按钮类型标记格式：[variant] [文本](链接) 或 [variant][文本](链接)
  const variantPattern = /^\[(\w+)\]\s*\[([^\]]+)\]\(([^)]+)\)$/;
  const match = text.match(variantPattern);
  
  if (match) {
    const [, variant, buttonText, url] = match;
    const supportedVariants = ['primary', 'secondary', 'success', 'warning', 'error', 'ghost', 'link'];
    
    // 检查variant是否在支持的列表中
    if (supportedVariants.includes(variant)) {
      return {
        hasVariant: true,
        variant: variant,
        text: buttonText,
        url: url
      };
    }
  }
  
  // 🆕 检查事件语法格式：[event:eventName][文本](链接)
  const eventPattern = /^\[event:\w+\]\s*\[([^\]]+)\]\(([^)]+)\)$/;
  const eventMatch = text.match(eventPattern);
  
  if (eventMatch) {
    const [, buttonText, url] = eventMatch;
    console.log(`✅ 找到事件按钮: 文本="${buttonText}", URL="${url}"`);
    return {
      hasVariant: true,
      variant: 'primary', // 事件按钮默认使用primary样式
      text: buttonText,
      url: url,
      isEventButton: true // 标记为事件按钮
    };
  }
  
  return { hasVariant: false };
}

// 创建卡片元素
function createCardElement(content, variant = 'standard', attributes = {}, currentMarkdown = '') {
  const id = generateUUID();
  // 获取卡片元素的样式配置
  let cardStyleConfig = getElementStyleConfig('card', variant);
  
  // 应用属性到样式配置（深拷贝以避免修改原配置）
  if (Object.keys(attributes).length > 0) {
    cardStyleConfig = JSON.parse(JSON.stringify(cardStyleConfig));
    
    // 确保样式对象存在
    if (!cardStyleConfig.style) {
      cardStyleConfig.style = {};
    }
    
    // 处理各种可能的属性
    Object.keys(attributes).forEach(attrKey => {
      const attrValue = attributes[attrKey];
      console.log(`🎨 应用卡片属性: ${attrKey} = ${attrValue}`);
      
      // 解析token值 - 如果不包含大括号，自动添加
      let tokenToResolve = attrValue;
      if (!attrValue.startsWith('{') && !attrValue.endsWith('}')) {
        // 如果看起来像token路径（包含点），自动添加大括号
        if (attrValue.includes('.')) {
          tokenToResolve = `{${attrValue}}`;
        }
      }
      
      const resolvedValue = resolveToken(tokenToResolve);
      if (resolvedValue !== tokenToResolve) {
        console.log(`🎯 Token解析: ${attrValue} -> ${tokenToResolve} -> ${resolvedValue}`);
      } else {
        console.log(`📝 普通值: ${attrValue} (未解析为token)`);
      }
      
      // 根据属性名称应用到相应的样式
      if (attrKey === 'background' || attrKey === 'backgroundColor') {
        cardStyleConfig.style.background = resolvedValue;
      } else if (attrKey === 'color') {
        cardStyleConfig.style.color = resolvedValue;
      } else if (attrKey === 'border') {
        cardStyleConfig.style.border = resolvedValue;
      } else if (attrKey === 'borderColor') {
        cardStyleConfig.style.borderColor = resolvedValue;
      } else if (attrKey === 'borderRadius') {
        cardStyleConfig.style.borderRadius = resolvedValue;
      } else if (attrKey === 'padding') {
        cardStyleConfig.style.padding = resolvedValue;
      } else if (attrKey === 'margin') {
        cardStyleConfig.style.margin = resolvedValue;
      } else {
        // 对于其他未知属性，直接添加到样式
        cardStyleConfig.style[attrKey] = resolvedValue;
      }
    });
    
    console.log(`📋 修改后的卡片样式配置:`, JSON.stringify(cardStyleConfig.style, null, 2));
  }

  // 生成唯一的className
  const uniqueClassName = `card-${id}`;

  // 检查是否为模板类型的卡片
  const isTemplateCard = cardStyleConfig && cardStyleConfig.type === 'template';

  let cardChildren = [];
  if (content && content.trim()) {
    if (isTemplateCard) {
      // 对于模板类型的卡片，解析嵌套的模板标签
      cardChildren = parseTemplateCardContent(content, cardStyleConfig, false, currentMarkdown);
    } else {
      // 对于普通卡片，递归解析内容
      const parsedContent = parseMarkdown(content, { currentMarkdown });
      cardChildren = parsedContent;
    }
  }

  if (isTemplateCard) {
    // 模板类型卡片的结构
    const cardElement = {
      dataKeys: [],
      name: "layout",
      "name-zh": "卡片",
      "file-type": "template",
      theme: "default",
      _metadata: {
        actualType: 'card',
        variant: variant,
        isCard: true,
        isLayout: true,
        isTemplateCard: true,
        cardContent: content
      },
      layout: {
        style: {
          display: LAYOUT_CONSTANTS.DISPLAY.FLEX,
          layoutMode: LAYOUT_CONSTANTS.DIRECTION.VERTICAL,
          layoutWrap: LAYOUT_CONSTANTS.WRAP.NO_WRAP,
          primaryAxisSizingMode: "fixed",
          layoutGrow: LAYOUT_CONSTANTS.GROW.ZERO,
          boxSizing: "border-box",
          "border-style": "solid",
          "border-width": "0",
          "border-color": "initial",
          height: "auto",
          width: "100%",
          "box-sizing": "border-box",
          "back-width": "100%",
          "back-height": "auto",
          position: "relative",
          ...cardStyleConfig.style // 应用模板样式
        },
        classStyle: {
          ...cardStyleConfig.style
        },
        className: uniqueClassName,
        children: cardChildren
      },
      description: `模板卡片元素 - ${variant}`,
      id,
      events: [{}]
    };

    return cardElement;
  } else {
    // 普通卡片的结构（保持原有逻辑）
    const baseLayout = createBaseLayout(LAYOUT_CONSTANTS.DIRECTION.VERTICAL, {
      width: "100%",
      height: "auto",
      alignItems: LAYOUT_CONSTANTS.ALIGN.X.MIN
    });

    // 应用卡片样式到布局
    Object.entries(cardStyleConfig).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        baseLayout.style[key] = value;
      }
    });

    const cardElement = {
      dataKeys: [],
      name: "layout",
      "name-zh": "卡片",
      "file-type": "template",
      theme: "default",
      _metadata: {
        actualType: 'card',
        variant: variant,
        isCard: true,
        isLayout: true,
        cardContent: content
      },
      layout: {
        ...baseLayout,
        classStyle: {
          ...cardStyleConfig
        },
        className: uniqueClassName,
        children: cardChildren
      },
      description: `卡片元素 - ${variant}`,
      id,
      events: [{}]
    };

    return cardElement;
  }
}
// 创建按钮元素（用于超链接）
function createButtonElement(text, url, variant = 'primary', currentMarkdown = '', displayText = null) {
  const id = generateUUID();
  console.log(`🔍 createButtonElement: 创建按钮 - 文本="${text}", URL="${url}", 变体="${variant}"`);
  console.log(`🔍 传入的currentMarkdown长度: ${currentMarkdown.length}`);
  
  // 解析事件语法（使用原始文本）
  const buttonEvents = parseEventSyntax(text, id, currentMarkdown);
  // 使用提供的显示文本，或者从原始文本中移除事件语法标记
  const cleanText = displayText || removeEventSyntax(text);
  
  console.log(`🔍 解析到的事件数量: ${buttonEvents.length}`);
  console.log(`🔍 清理后的按钮文本: "${cleanText}"`);
  if (buttonEvents.length > 0) {
    console.log(`🔍 解析到的事件配置:`, buttonEvents);
  }
  
  // 获取按钮元素的样式配置
  const buttonStyleConfig = getElementStyleConfig('button', variant);
  console.log(`🎨 获取到的按钮样式配置:`, buttonStyleConfig);
  
  const layoutStyleConfig = getElementStyleConfig('layout', 'column');

  // 生成唯一的className
  const uniqueClassName = `button-${id}`;

  const buttonElement = {
    id,
    name: "button", // 确保按钮名称为"button"
    "name-zh": "按钮",
    "file-type": "cell-element",
    // 🔍 保存元数据用于分析
    _metadata: {
      actualType: 'button',
      variant: variant,
      isButton: true,
      buttonText: text,
      buttonUrl: url,
      hasVariantTag: variant !== 'primary' // 标记是否使用了类型标记（非默认primary）
    },
    layout: {
      classStyle: {
        ...buttonStyleConfig
      },
      className: uniqueClassName,
      style: {
        "background-color": [],
        font: [],
        border: [],
        scale: [],
        "white-space": "nowrap",
        overflow: "hidden",
        "text-overflow": "ellipsis",
        "box-sizing": "border-box",
        primaryAxisSizingMode: "fixed",
        position: "relative",
        ...layoutStyleConfig,
        padding: buttonStyleConfig.padding,
        gap: buttonStyleConfig.gap,
        margin: buttonStyleConfig.margin
      },
      button_normal: {
        type: "container",
        content: [],
        resource: "",
        data: [],
        style: {
          // display: LAYOUT_CONSTANTS.DISPLAY.FLEX,
          // layoutMode: LAYOUT_CONSTANTS.DIRECTION.HORIZONTAL,
          // layoutWrap: LAYOUT_CONSTANTS.WRAP.NO_WRAP,
          // primaryAxisSizingMode: LAYOUT_CONSTANTS.SIZING.AUTO,
          // counterAxisSizingMode: LAYOUT_CONSTANTS.SIZING.AUTO,
          // primaryAxisAlignItems: LAYOUT_CONSTANTS.ALIGN.X.CENTER,
          // counterAxisAlignItems: LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.CENTER,
          // layoutAlign: LAYOUT_CONSTANTS.ALIGN.Y.SELF.INHERIT,
          // layoutGrow: LAYOUT_CONSTANTS.GROW.ZERO,
          // minWidth: {
          //   element: "scale",
          //   value: "min_width",
          //   prop: "default",
          //   token: "min_width"
          // },
          // minHeight: {
          //   element: "scale",
          //   value: "min_height",
          //   prop: "default",
          //   token: "min_height"
          // },
          // spacing: {
          //   element: "scale",
          //   value: "padding",
          //   prop: "default",
          //   token: "padding"
          // },
          // itemSpacing: {
          //   element: "scale",
          //   value: "gap",
          //   prop: "default",
          //   token: "gap"
          // },
          // fill: {
          //   element: "color",
          //   value: "bg",
          //   prop: "default",
          //   token: "bg"
          // },
          // fontColor: {
          //   element: "color",
          //   value: "text",
          //   prop: "default",
          //   token: "text"
          // },
          // fontSizes: {
          //   element: "font",
          //   value: "fontsize",
          //   prop: "default",
          //   token: "fontsize"
          // },
          // borderRadius: {
          //   element: "shape",
          //   value: "borderradius",
          //   prop: "default",
          //   token: "borderradius"
          // },
          // borderColor: {
          //   element: "color",
          //   value: "border",
          //   prop: "default",
          //   token: "border"
          // },
          // borderWidth: {
          //   element: "shape",
          //   value: "borderwidth",
          //   prop: "default",
          //   token: "borderwidth"
          // },
          // boxShadow: {
          //   element: "material",
          //   value: "elevation",
          //   prop: "default",
          //   token: "elevation"
          // }
        },
        children: [
          {
            type: "text",
            content: [
              {
                element: "font",
                value: "fontsize",
                prop: "default",
                token: "fontsize"
              }
            ],
            data: [],
            style: {
              layoutAlign: LAYOUT_CONSTANTS.ALIGN.Y.SELF.INHERIT,
              layoutGrow: LAYOUT_CONSTANTS.GROW.ZERO,
              fill: {
                element: "color",
                value: "text",
                prop: "default",
                token: "text"
              },
              fontSizes: {
                element: "font",
                value: "fontsize",
                prop: "default",
                token: "fontsize"
              }
            },
            children: []
          }
        ]
      },
      button_icontextbutton: {
        type: "container",
        content: [],
        resource: "",
        data: [],
        style: {
          display: LAYOUT_CONSTANTS.DISPLAY.FLEX,
          layoutMode: LAYOUT_CONSTANTS.DIRECTION.HORIZONTAL,
          layoutWrap: LAYOUT_CONSTANTS.WRAP.NO_WRAP,
          layoutAlign: LAYOUT_CONSTANTS.ALIGN.Y.SELF.INHERIT,
          layoutGrow: LAYOUT_CONSTANTS.GROW.ZERO,
          minWidth: {
            element: "scale",
            value: "min_width",
            prop: "default",
            token: "min_width"
          },
          minHeight: {
            element: "scale",
            value: "min_height",
            prop: "default",
            token: "min_height"
          },
          spacing: {
            element: "scale",
            value: "padding",
            prop: "default",
            token: "padding"
          },
          itemSpacing: {
            element: "scale",
            value: "gap",
            prop: "default",
            token: "gap"
          },
          iconColor: {
            element: "color",
            value: "icon_color",
            prop: "default",
            token: "icon_color"
          },
          icon: {
            element: "color",
            value: "icon_color",
            prop: "default"
          },
          fontSizes: {
            element: "font",
            value: "fontsize",
            prop: "default",
            token: "fontsize"
          },
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
          borderRadius: {
            element: "shape",
            value: "borderradius",
            prop: "default",
            token: "borderradius"
          },
          borderColor: {
            element: "color",
            value: "border",
            prop: "default",
            token: "border"
          },
          borderWidth: {
            element: "shape",
            value: "borderwidth",
            prop: "default",
            token: "borderwidth"
          },
          boxShadow: {
            element: "material",
            value: "elevation",
            prop: "default",
            token: "elevation"
          }
        },
        children: [
          {
            content: [
              {
                element: "color",
                value: "icon_color"
              }
            ],
            data: [],
            style: {
              layoutAlign: LAYOUT_CONSTANTS.ALIGN.Y.SELF.INHERIT,
              layoutGrow: LAYOUT_CONSTANTS.GROW.ZERO,
              fill: {
                element: "color",
                value: "icon_color",
                prop: "default",
                token: "icon_color"
              }
            },
            children: []
          },
          {
            type: "text",
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
              fill: {
                element: "color",
                value: "text",
                prop: "default",
                token: "text"
              },
              fontSizes: {
                element: "font",
                value: "fontsize",
                prop: "default",
                token: "fontsize"
              }
            },
            children: []
          }
        ]
      },
      button_iconbutton: {
        type: "container",
        content: [],
        resource: "",
        data: [],
        style: {
          display: LAYOUT_CONSTANTS.DISPLAY.FLEX,
          layoutMode: LAYOUT_CONSTANTS.DIRECTION.HORIZONTAL,
          layoutWrap: LAYOUT_CONSTANTS.WRAP.NO_WRAP,
          layoutAlign: LAYOUT_CONSTANTS.ALIGN.Y.SELF.INHERIT,
          layoutGrow: LAYOUT_CONSTANTS.GROW.ZERO,
          minWidth: {
            element: "scale",
            value: "min_width",
            prop: "default",
            token: "min_width"
          },
          minHeight: {
            element: "scale",
            value: "min_height",
            prop: "default",
            token: "min_height"
          },
          spacing: {
            element: "scale",
            value: "padding",
            prop: "default",
            token: "padding"
          },
          itemSpacing: {
            element: "scale",
            value: "gap",
            prop: "default",
            token: "gap"
          },
          iconColor: {
            element: "color",
            value: "icon_color",
            prop: "default",
            token: "icon_color"
          },
          icon: {
            element: "color",
            value: "icon_color"
          },
          fill: {
            element: "color",
            value: "bg",
            prop: "default",
            token: "bg"
          },
          borderColor: {
            element: "color",
            value: "border",
            prop: "default",
            token: "border"
          },
          borderWidth: {
            element: "shape",
            value: "borderwidth",
            prop: "default",
            token: "borderwidth"
          },
          borderRadius: {
            element: "shape",
            value: "borderradius",
            prop: "default",
            token: "borderradius"
          },
          boxShadow: {
            element: "material",
            value: "elevation",
            prop: "default",
            token: "elevation"
          }
        },
        children: [
          {
            content: [
              {
                element: "color",
                value: "icon_color"
              }
            ],
            data: [],
            style: {
              layoutAlign: LAYOUT_CONSTANTS.ALIGN.Y.SELF.INHERIT,
              layoutGrow: LAYOUT_CONSTANTS.GROW.ZERO,
              fill: {
                element: "color",
                value: "icon_color",
                prop: "default",
                token: "icon_color"
              }
            },
            children: []
          }
        ]
      }
    },
    color: {
      bg: {
        default: {
          "data-key": "",
          style: {
            bg: {
              value: buttonStyleConfig.fill || COLOR_CONSTANTS.PRIMARY.BRAND5,
              type: "color",
              key: "color-bg"
            }
          },
          resource: buttonStyleConfig.fill || COLOR_CONSTANTS.PRIMARY.BRAND5
        }
      },
      text: {
        default: {
          "data-key": "",
          style: {
            text: {
              value: buttonStyleConfig.color || COLOR_CONSTANTS.BASIC.OPACITY.WHITE[100],
              type: "color",
              key: "color-text"
            }
          },
          resource: buttonStyleConfig.color || COLOR_CONSTANTS.BASIC.OPACITY.WHITE[100]
        }
      },
      border: {
        default: {
          "data-key": "",
          style: {
            border: {
              value: buttonStyleConfig.borderColor || COLOR_CONSTANTS.BASIC.OPACITY.WHITE[32],
              type: "color",
              key: "color-border"
            }
          },
          resource: buttonStyleConfig.borderColor || COLOR_CONSTANTS.BASIC.OPACITY.WHITE[32]
        }
      },
      icon_color: {
        default: {
          "data-key": "",
          style: {
            icon_color: {
              value: COLOR_CONSTANTS.BASIC.OPACITY.WHITE[100],
              type: "color",
              key: "color-icon_color"
            }
          },
          type: "icon",
          resource: "send"
        }
      }
    },
    shape: {
      borderradius: {
        default: {
          "data-key": "",
          style: {
            borderradius: {
              value: buttonStyleConfig.borderRadius || DIMENSION_CONSTANTS.BORDER_RADIUS[8],
              type: "borderRadius",
              key: "shape-borderradius"
            }
          },
          resource: buttonStyleConfig.borderRadius || DIMENSION_CONSTANTS.BORDER_RADIUS[8]
        }
      },
      borderwidth: {
        default: {
          "data-key": "",
          style: {
            borderwidth: {
              value: buttonStyleConfig.borderWidth || DIMENSION_CONSTANTS.BORDER_WIDTH.none,
              type: "borderWidth",
              key: "shape-borderwidth"
            }
          },
          resource: buttonStyleConfig.borderWidth || DIMENSION_CONSTANTS.BORDER_WIDTH.none
        }
      }
    },
    scale: {
      padding: {
        default: {
          "data-key": "",
          style: {
            padding: {
              value: buttonStyleConfig.spacing || DIMENSION_CONSTANTS.PADDING.base,
              type: "spacing",
              key: "scale-padding"
            }
          },
          resource: buttonStyleConfig.spacing || DIMENSION_CONSTANTS.PADDING.base
        }
      },
      gap: {
        default: {
          "data-key": "",
          style: {
            gap: {
              value: buttonStyleConfig.itemSpacing || DIMENSION_CONSTANTS.GAP.base,
              type: "spacing",
              key: "scale-gap"
            }
          },
          resource: buttonStyleConfig.itemSpacing || DIMENSION_CONSTANTS.GAP.base
        }
      },
      min_width: {
        default: {
          "data-key": "",
          style: {
            min_width: {
              value: buttonStyleConfig.minWidth || DIMENSION_CONSTANTS.BASIC[0],
              type: "sizing",
              key: "scale-min_width"
            }
          },
          resource: buttonStyleConfig.minWidth || DIMENSION_CONSTANTS.BASIC[0]
        }
      },
      min_height: {
        default: {
          "data-key": "",
          style: {
            min_height: {
              value: buttonStyleConfig.minHeight || DIMENSION_CONSTANTS.BASIC[0],
              type: "sizing",
              key: "scale-min_height"
            }
          },
          resource: buttonStyleConfig.minHeight || DIMENSION_CONSTANTS.BASIC[0]
        }
      }
    },
    font: {
      fontsize: {
        default: {
          "data-key": "",
          content: cleanText, // 使用清理后的按钮文本（移除事件语法）
          style: {
            fontsize: {
              value: buttonStyleConfig.fontSizes || FONT_CONSTANTS.SIZE.XL,
              type: "fontSizes",
              key: "font-fontsize"
            }
          },
          resource: buttonStyleConfig.fontSizes || FONT_CONSTANTS.SIZE.XL
        }
      }
    },
    material: {
      elevation: {
        default: {
          "data-key": "",
          style: {
            elevation: {
              value: buttonStyleConfig.boxShadow || "none",
              type: "boxShadow",
              key: "material-elevation"
            }
          },
          resource: buttonStyleConfig.boxShadow || "none"
        }
      }
    },
    type: "button_normal", // 确保类型正确
    state: "default",
    events: buttonEvents.length > 0 ? buttonEvents : [{}], // 应用解析到的事件配置
    url: url  // 存储链接URL
  };

  return buttonElement;
}
// 创建图标元素
function createIconElement(iconName, variant = 'medium') {
  const id = generateUUID();
  
  // 获取图标元素的样式配置
  const iconStyleConfig = getElementStyleConfig('icon', variant);
  
  // 生成唯一的className
  const uniqueClassName = `icon-${variant}-${id}`;
  
  console.log(`🔧 创建图标元素: 图标名称=${iconName}, 变体=${variant}, 样式配置=`, iconStyleConfig);
  
  // 创建图标元素结构
  const iconElement = {
    dataKeys: [],
    id: id,
    name: "icon",
    "name-zh": "图标",
    "file-type": "cell-element",
    // 🔍 保存图标元数据用于分析
    _metadata: {
      actualType: 'icon',
      variant: variant,
      iconName: iconName,
      sampleContent: iconName
    },
    layout: {
      classStyle: {
        ...iconStyleConfig // 应用图标样式配置到classStyle
      },
      className: uniqueClassName,
      style: {
        "background-color": [],
        "font": [],
        "border": [],
        "scale": [],
        "box-sizing": "border-box"
      },
      icon_line: {
        type: "container",
        content: [],
        resource: "",
        data: [],
        style: {
          display: "{layout.state.display.flex}",
          layoutMode: "{layout.direction.NONE}",
          layoutWrap: "{layout.wrap.NO_WRAP}",
          layoutAlign: "{layout.align.y.self.INHERIT}",
          layoutGrow: "{layout.grow.0}",
          height: {
            element: "scale",
            value: "icon_height",
            prop: "default",
            token: "icon_height"
          },
          width: {
            element: "scale",
            value: "icon_width",
            prop: "default",
            token: "icon_width"
          },
          iconColor: {
            element: "color",
            value: "icon_color",
            prop: "default",
            token: "icon_color"
          },
          icon: {
            element: "color",
            value: "icon_color"
          }
        },
        children: [
          {
            content: [
              {
                element: "color",
                value: "icon_color"
              }
            ],
            data: [],
            style: {
              layoutAlign: "{layout.align.y.self.INHERIT}",
              layoutGrow: "{layout.grow.1}",
              iconColor: {
                element: "color",
                value: "icon_color",
                prop: "default",
                token: "icon_color"
              },
              height: {
                element: "scale",
                value: "icon_height",
                prop: "default",
                token: "icon_height"
              },
              width: {
                element: "scale",
                value: "icon_width",
                prop: "default",
                token: "icon_width"
              }
            },
            children: []
          }
        ]
      }
    },
    color: {
      bg: {
        default: {
          "data-key": "",
          style: {
            bg: {
              value: "{color.basic.brand.5}",
              type: "color",
              key: "color-bg"
            }
          },
          resource: "{color.basic.brand.5}"
        }
      },
      border: {
        default: {
          "data-key": "",
          style: {
            border: {
              value: "{color.basic.brand.5}",
              type: "color",
              key: "color-border"
            }
          },
          resource: "{color.basic.brand.5}"
        }
      },
      icon_color: {
        default: {
          "data-key": "",
          style: {
            // icon_color: {
            //   value: "{color.basic.brand.5}",
            //   type: "color",
            //   key: "color-icon_color"
            // },
            // height: {
            //   element: "scale",
            //   value: "icon_height",
            //   prop: "default",
            //   token: "icon_height"
            // },
            // width: {
            //   element: "scale",
            //   value: "icon_width",
            //   prop: "default",
            //   token: "icon_width"
            // }
          },
          type: "icon",
          resource: iconName // 使用传入的图标名称
        },
        hover: {
          "data-key": "",
          style: {
            icon_color: {
              value: "{color.basic.opacity.white.100}",
              type: "color",
              key: "color-icon_color"
            },
            height: {
              element: "scale",
              value: "icon_height",
              prop: "default",
              token: "icon_height"
            },
            width: {
              element: "scale",
              value: "icon_width",
              prop: "default",
              token: "icon_width"
            }
          },
          type: "icon",
          resource: iconName
        },
        active: {
          "data-key": "",
          style: {
            icon_color: {
              value: "{color.basic.opacity.white.100}",
              type: "color",
              key: "color-icon_color"
            },
            height: {
              element: "scale",
              value: "icon_height",
              prop: "default",
              token: "icon_height"
            },
            width: {
              element: "scale",
              value: "icon_width",
              prop: "default",
              token: "icon_width"
            }
          },
          type: "icon",
          resource: iconName
        },
        pressed: {
          "data-key": "",
          style: {
            icon_color: {
              value: "{color.basic.opacity.white.100}",
              type: "color",
              key: "color-icon_color"
            },
            height: {
              element: "scale",
              value: "icon_height",
              prop: "default",
              token: "icon_height"
            },
            width: {
              element: "scale",
              value: "icon_width",
              prop: "default",
              token: "icon_width"
            }
          },
          type: "icon",
          resource: iconName
        },
        loading: {
          "data-key": "",
          style: {
            icon_color: {
              value: "{color.basic.opacity.white.100}",
              type: "color",
              key: "color-icon_color"
            },
            height: {
              element: "scale",
              value: "icon_height",
              prop: "default",
              token: "icon_height"
            },
            width: {
              element: "scale",
              value: "icon_width",
              prop: "default",
              token: "icon_width"
            }
          },
          type: "icon",
          resource: iconName
        },
        disable: {
          "data-key": "",
          style: {
            icon_color: {
              value: "{color.basic.opacity.white.100}",
              type: "color",
              key: "color-icon_color"
            },
            height: {
              element: "scale",
              value: "icon_height",
              prop: "default",
              token: "icon_height"
            },
            width: {
              element: "scale",
              value: "icon_width",
              prop: "default",
              token: "icon_width"
            }
          },
          type: "icon",
          resource: iconName
        }
      }
    },
    scale: {
      icon_width: {
        default: {
          "data-key": "",
          style: {
            icon_width: {
              value: "{dimension.basic.dimension.56}",
              type: "sizing",
              key: "scale-icon_width"
            }
          },
          resource: "{dimension.basic.dimension.56}"
        }
      },
      icon_height: {
        default: {
          "data-key": "",
          style: {
            icon_height: {
              value: "{dimension.basic.dimension.56}",
              type: "sizing",
              key: "scale-icon_height"
            }
          },
          resource: "{dimension.basic.dimension.56}"
        }
      }
    },
    shape: {
      borderwidth: {
        default: {
          "data-key": "",
          style: {
            borderwidth: {
              value: "{dimension.borderwidth.4}",
              type: "borderWidth",
              key: "shape-borderwidth"
            }
          },
          resource: "{dimension.borderwidth.4}"
        }
      }
    },
    type: "icon_line",
    state: "default",
    events: [{}]
  };
  
  return iconElement;
}

// 创建背景元素（用于图片）
function createBackgroundElement(imageUrl, variant = 'normal') {
  const id = generateUUID();
  // 获取图片元素的样式配置
  const imageStyleConfig = getElementStyleConfig('image', variant);
  const layoutStyleConfig = getElementStyleConfig('layout', 'column');

  // 生成唯一的className
  const uniqueClassName = `background-${id}`;

  return {
    id,
    name: "background",
    "name-zh": "背景",
    "file-type": "cell-element",
    // 🔍 保存元数据用于分析
    _metadata: {
      actualType: 'image',
      variant: variant,
      isImage: true,
      imageUrl: imageUrl
    },
    layout: {
      classStyle: {
        ...imageStyleConfig
      },
      className: uniqueClassName,
      style: {
        "background-color": [],
        font: [],
        border: [],
        scale: [],
        overflow: "hidden",
        "box-sizing": "border-box",
        primaryAxisSizingMode: "fixed",
        position: "relative",
        ...layoutStyleConfig
      },
      background: {
        type: "container",
        content: [
          {
            element: "material",
            value: "image",
            prop: "default",
            token: "image"
          }
        ],
        resource: "",
        data: [],
        style: {
          display: LAYOUT_CONSTANTS.DISPLAY.FLEX,
          layoutMode: LAYOUT_CONSTANTS.DIRECTION.HORIZONTAL,
          layoutWrap: LAYOUT_CONSTANTS.WRAP.NO_WRAP,
          layoutAlign: LAYOUT_CONSTANTS.ALIGN.Y.SELF.INHERIT,
          layoutGrow: LAYOUT_CONSTANTS.GROW.ZERO,
          // borderColor: {
          //   element: "color",
          //   value: "border",
          //   prop: "default",
          //   token: "border"
          // },
          // borderRadius: {
          //   element: "shape",
          //   value: "borderradius",
          //   prop: "default",
          //   token: "borderradius"
          // },
          // borderWidth: {
          //   element: "shape",
          //   value: "borderwidth",
          //   prop: "default",
          //   token: "borderwidth"
          // },
          // boxShadow: {
          //   element: "material",
          //   value: "elevation",
          //   prop: "default",
          //   token: "elevation"
          // },
          asset: {
            element: "material",
            value: "image",
            prop: "default",
            token: "image"
          }
        },
        children: []
      }
    },
    material: {
      image: {
        default: {
          "data-key": "",
          type: "img",
          preview: imageUrl,
          style: {
            image: {
              value: imageUrl,
              type: "asset",
              key: "material-image"
            },
            width: '100%',
            height: '100%'
          },
          resource: imageUrl
        }
      },
      elevation: {
        default: {
          "data-key": "",
          style: {
            elevation: {
              value: imageStyleConfig.boxShadow || "none",
              type: "boxShadow",
              key: "material-elevation"
            }
          },
          resource: imageStyleConfig.boxShadow || "none"
        }
      }
    },
    shape: {
      borderradius: {
        default: {
          "data-key": "",
          style: {
            borderradius: {
              value: imageStyleConfig.borderRadius || DIMENSION_CONSTANTS.BORDER_RADIUS.none,
              type: "borderRadius",
              key: "shape-borderradius"
            }
          },
          resource: imageStyleConfig.borderRadius || DIMENSION_CONSTANTS.BORDER_RADIUS.none
        }
      },
      borderwidth: {
        default: {
          "data-key": "",
          style: {
            borderwidth: {
              value: imageStyleConfig.borderWidth || DIMENSION_CONSTANTS.BORDER_WIDTH.none,
              type: "borderWidth",
              key: "shape-borderwidth"
            }
          },
          resource: imageStyleConfig.borderWidth || DIMENSION_CONSTANTS.BORDER_WIDTH.none
        }
      }
    },
    color: {
      border: {
        default: {
          "data-key": "",
          style: {
            border: {
              value: imageStyleConfig.borderColor || COLOR_CONSTANTS.BASIC.OPACITY.BLACK[20],
              type: "color",
              key: "color-border"
            }
          },
          resource: imageStyleConfig.borderColor || COLOR_CONSTANTS.BASIC.OPACITY.BLACK[20]
        }
      }
    },
    type: "background",
    state: "default",
    events: [{}]
  };
}

// 创建布局元素，支持自定义选项
function createLayoutElement(direction, children = [], options = {}) {
  const { width, height, gap, variant = 'column', isRoot = false,
    alignItems = LAYOUT_CONSTANTS.ALIGN.X.MIN, attributes = {} } = options;
  
  // 使用随机UUID生成ID
  const layoutId = generateUUID();

  // 根据方向自动计算交叉轴对齐方式
  // 对于水平布局，默认交叉轴居中对齐；对于垂直布局，使用传入的选项或默认左对齐
  const counterAxisAlign = options.counterAxisAlign ||
    (direction === LAYOUT_CONSTANTS.DIRECTION.HORIZONTAL ?
      LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.CENTER :
      LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.MIN);

  // 🆕 获取布局元素的样式配置，传入属性
  const layoutStyleConfig = getElementStyleConfig('layout', isRoot ? 'root' : variant, attributes);

  // 创建基础布局
  const baseLayout = createBaseLayout(direction, { width, height, alignItems });

  // 应用来自配置的样式，但保留传入的对齐设置
  Object.entries(layoutStyleConfig).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      // 🔧 重要：保留传入的对齐设置，不覆盖 justifyContent 和 alignItems
      if ((key === 'justifyContent' || key === 'alignItems') && options[key] !== undefined) {
        // 如果传入的选项中明确设置了这些属性，则跳过默认配置
        return;
      }
      baseLayout.style[key] = value;
    }
  });

  // 如果提供了间距，覆盖配置
  if (gap) {
    baseLayout.style.gap = gap;
  }

  // 🔧 重要：确保传入的 justifyContent 和 alignItems 被正确设置
  if (options.justifyContent !== undefined) {
    baseLayout.style.justifyContent = options.justifyContent;
  }
  if (options.alignItems !== undefined) {
    baseLayout.style.alignItems = options.alignItems;
  }

  // 生成唯一的className
  const uniqueClassName = `layout-${layoutId}`;

  const layout = {
    dataKeys: [],
    name: "layout",
    "name-zh": "布局",
    "file-type": "template",
    theme: "default",
    // 🔍 保存元数据用于分析
    _metadata: {
      actualType: 'layout',
      variant: isRoot ? 'root' : variant,
      isLayout: true,
      isRoot: isRoot,
      // 🆕 保存应用的属性信息
      appliedAttributes: attributes
    },
    layout: {
      ...baseLayout,
      classStyle: {
        ...layoutStyleConfig
      },
      className: uniqueClassName
    },
    description: "",
    id: layoutId,
    events: [{}]
  };

  // 添加子元素
  layout.layout.children = children;

  return layout;
}

// 创建垂直按钮布局创建函数（默认布局）
function createVerticalButtonLayout(buttons) {
  return createLayoutElement(LAYOUT_CONSTANTS.DIRECTION.VERTICAL, buttons, {
    gap: DIMENSION_CONSTANTS.GAP.base,
    alignItems: LAYOUT_CONSTANTS.ALIGN.X.MIN,
    variant: 'column', // 使用 column 布局变体
    counterAxisAlign: LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.MIN
  });
}

// 保留水平按钮布局创建函数（用于布局标签）
function createHorizontalButtonLayout(buttons, options = {}) {
  return createLayoutElement(LAYOUT_CONSTANTS.DIRECTION.HORIZONTAL, buttons, {
    gap: DIMENSION_CONSTANTS.GAP.base,
    alignItems: LAYOUT_CONSTANTS.ALIGN.X.CENTER,
    variant: 'row', // 使用 row 布局变体
    // 允许传入自定义的 justifyContent 设置
    justifyContent: options.justifyContent,
    // 无需明确设置counterAxisAlign，createLayoutElement会自动为水平布局设置交叉轴居中
  });
}

// 更新标题布局创建函数
function createHeadingLayout(headingContent, subElements = [], headingLevel = 1) {
  // 所有标题布局都使用左对齐
  // 注意：标题文本的对齐方式由createTextElement函数根据变体（h1、h2等）自动处理
  const layout = createLayoutElement(
    LAYOUT_CONSTANTS.DIRECTION.VERTICAL,
    [],
    {
      alignItems: LAYOUT_CONSTANTS.ALIGN.X.MIN, // 所有标题布局主轴左对齐
      counterAxisAlign: LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.MIN // 所有标题布局交叉轴左对齐
    }
  );

  // 🏷️ 设置标题布局的元数据，包含标题级别信息
  layout._metadata = {
    ...layout._metadata,
    actualType: 'layout',
    variant: 'column',
    headingLevel: headingLevel, // 添加标题级别信息
    isHeadingLayout: true,
    isLayout: true
  };

  // 添加标题文本，根据标题级别选择文本样式
  const headingVariant = `h${headingLevel}`;
  const headingText = createTextElement(headingContent, headingVariant);

  // 不需要额外设置textAlign和width，createTextElement已经处理了

  layout.layout.children.push(headingText);

  // 添加子元素
  if (subElements.length > 0) {
    layout.layout.children = layout.layout.children.concat(subElements);
  }

  return layout;
}

// 创建流式布局容器，用于包装一级标题块
function createFlexWrapLayout(children = []) {
  const layoutId = generateUUID();

  // 创建一个水平流式布局，使用CSS的flex-wrap属性
  const layout = {
    dataKeys: [],
    name: "layout",
    "name-zh": "流式布局",
    "file-type": "template",
    theme: "default",
    layout: {
      style: {
        display: LAYOUT_CONSTANTS.DISPLAY.FLEX,
        layoutMode: LAYOUT_CONSTANTS.DIRECTION.HORIZONTAL,
        // 使用CSS的flex-wrap属性
        "flex-wrap": "wrap",
        // layoutAlign: LAYOUT_CONSTANTS.ALIGN.Y.SELF.INHERIT,
        "align-self": "flex-start",
        layoutGrow: LAYOUT_CONSTANTS.GROW.ZERO,
        boxSizing: "border-box",
        "border-style": "solid",
        "border-width": "0",
        "border-color": "initial",
        height: "auto",
        width: "100%",
        "box-sizing": "border-box",
        "back-width": "100%",
        "back-height": "auto",
        position: "relative"
      },
      children: children
    },
    description: "",
    id: layoutId,
    events: [{}]
  };

  return layout;
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
        "align-self": "flex-start", // 确保自身左对齐
        // layoutGrow: LAYOUT_CONSTANTS.GROW.ZERO,
        boxSizing: "border-box",
        "border-style": "solid",
        "border-width": "0",
        "border-color": "initial",
        height: "auto",
        width: "100%",
        minWidth: "375px",  // 设置最小宽度为375px
        maxWidth: "50%",    // 设置最大宽度为50%，确保一行最多两个
        // 添加flex-basis属性，使其在流式布局中正确工作
        "flex-basis": "375px",
        "flex-grow": "1",
        "flex-shrink": "0",
        "box-sizing": "border-box",
        "back-width": "100%",
        "back-height": "auto",
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

// 检测是否为表格或图表数据（统一检测）
function isTableOrChartData(line) {
  // 首先检查是否是图表数据标记
  const isChart = line.trim().match(/^\[chart:(.+?)\]/);

  if (isChart) {
    return { isData: true, isChart: true, chartType: isChart[1] };
  }

  // 然后检查是否是普通表格
  if (line.includes('|')) {
    const nextLine = line.trim();
    // 表格至少需要一个分隔符
    const hasSeparator = nextLine.includes('|');

    if (hasSeparator) {
      return { isData: true, isChart: false, chartType: null };
    }
  }

  return { isData: false, isChart: false, chartType: null };
}
// 提取完整的表格或图表数据（统一提取）
function extractTableOrChartData(lines, startIndex) {
  console.log(`开始提取表格/图表数据，从第${startIndex}行开始`);

  // 获取第一行，检查是否包含图表标记
  const firstLine = lines[startIndex].trim();
  const chartMatch = firstLine.match(/^\[chart:(.+?)\]/);
  const isChart = !!chartMatch;
  
  let chartType = null;
  let chartTitle = null;
  
  if (isChart) {
    const fullChartSpec = chartMatch[1];
    // 🆕 解析图表类型和可选标题
    [chartType, chartTitle] = fullChartSpec.includes('|') 
      ? fullChartSpec.split('|', 2).map(s => s.trim())
      : [fullChartSpec.trim(), null];
    
    console.log(`检测到图表类型: ${chartType}${chartTitle ? `, 标题: ${chartTitle}` : ''}`);
  } else {
    console.log('检测到普通表格');
  }

  // 处理第一行 - 如果是图表，移除图表标记
  const processedFirstLine = isChart
    ? firstLine.replace(/^\[chart:.+?\]/, '').trim()
    : firstLine;

  const tableLines = [processedFirstLine];
  const remainingLines = lines.slice(startIndex + 1);

  // 继续添加后续表格行，直到遇到空行
  let i = 0;
  while (i < remainingLines.length) {
    const line = remainingLines[i].trim();

    // 如果行为空或不再包含表格分隔符，认为表格结束
    if (line === '' || !line.includes('|')) {
      console.log(`表格/图表数据在第${startIndex + i + 1}行结束`);
      break;
    }

    tableLines.push(remainingLines[i]);
    i++;
  }

  console.log('提取的表格/图表行数:', tableLines.length);

  // 提取原始表格内容（用于显示和调试）
  const originalContent = tableLines.join('\n');

  // 解析表格数据为二维数组（用于图表数据处理）
  const tableData = parseTableData(originalContent);

  return {
    isChart: isChart,
    chartType: chartType,
    chartTitle: chartTitle, // 🆕 添加图表标题
    tableContent: originalContent,
    tableData: tableData,
    endIndex: startIndex + i
  };
}

// 处理表格数据 - 决定创建普通表格还是图表元素
function processTableOrChartData(result, stack) {
  const { isChart, chartType, chartTitle, tableContent, tableData, endIndex } = result;

  if (isChart) {
    // 处理为图表
    try {
      console.log(`处理图表数据，类型: ${chartType}`);
      
      // 先创建图表元素（包含样式配置）- 使用默认 variant，传递标题
      const chartElement = createChartElement(chartType, '', tableData, tableContent, 'normal', chartTitle);
      
      // 提取样式配置
      const chartStyleConfig = {
        variant: 'normal',
        title: chartElement.layout.title,
        legend: chartElement.layout.legend,
        axis: chartElement.layout.axis
      };
      
      // 生成SVG图表，传入样式配置和标题
      const svgContent = generateChartSvg(chartType, tableData, chartStyleConfig, chartTitle);
      
      // 更新图表元素的SVG内容
      chartElement.svgContent = svgContent;
      
      stack[stack.length - 1].elements.push(chartElement);
    } catch (error) {
      console.error('生成图表时出错:', error);
      // 创建一个带有错误信息的图表元素
      const errorSvg = `<svg width="800" height="250" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#fff0f0" />
        <text x="50" y="50" font-family="sans-serif" font-size="18" fill="#d32f2f">
          图表生成错误
        </text>
        <text x="50" y="80" font-family="sans-serif" font-size="14" fill="#666">
          ${error.message || '未知错误'}
        </text>
      </svg>`;
      const chartElement = createChartElement(chartType, errorSvg, tableData, tableContent, 'normal');
      stack[stack.length - 1].elements.push(chartElement);
    }
  } else {
    // 处理为普通表格
    console.log('处理普通表格数据');
    const tableElement = createTableElement(tableContent);
    stack[stack.length - 1].elements.push(tableElement);
  }

  return endIndex;
}

// 创建表格元素
function createTableElement(markdownTableContent) {
  console.log('开始创建表格元素，原始表格内容长度:', markdownTableContent.length);
  const id = generateUUID();
  const layoutStyleConfig = getElementStyleConfig('layout', 'column');

  
  const tableContainerStyleConfig = getElementStyleConfig('table', 'container');
  const tableHeaderStyleConfig = getElementStyleConfig('table', 'th');
  const tableRowStyleConfig = getElementStyleConfig('table', 'tr');
  const tableCellStyleConfig = getElementStyleConfig('table', 'td');

  // 确保表格内容不为空
  if (!markdownTableContent.trim()) {
    console.error('警告: 尝试创建表格元素但内容为空');
  }

  // 生成唯一的className
  const uniqueClassName = `table-${id}`;
  const uniqueTrClassName = `tr-${id}`;

  // 创建符合要求的表格元素结构
  const tableElement = {
    id,
    name: "table",
    "name-zh": "表格",
    "file-type": "cell-element",
    type: "table",
    // 🔍 保存元数据用于分析
    _metadata: {
      actualType: 'table',
      variant: 'container',
      isTable: true
    },
    rawData: markdownTableContent,
    layout: {
      // classStyle: {
      //   ...tableContainerStyleConfig
      // },
      // className: uniqueClassName,
      style: {
        // 基础样式
        "background-color": [],
        font: [],
        border: [],
        scale: [],
        "box-sizing": "border-box",
        primaryAxisSizingMode: "fixed",
        position: "relative",
        width: "100%",
        ...layoutStyleConfig,
      },
      // 表格特定样式
      table: {
        style: {
          ...tableContainerStyleConfig
        },
        
        // borderCollapse: "collapse",
        // backgroundColor: "transparent",
        // width: "100%",
        // color: "#212529",
        // fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        // fontSize: FONT_CONSTANTS.SIZE.MEDIUM,
        // marginBottom: '1rem'
      },
      th: {
        style: {
          ...tableHeaderStyleConfig
        }
        
      },
      tr: {
        className: uniqueTrClassName,
        classStyle: {
          ...tableRowStyleConfig
        }
        // borderBottomWidth: DIMENSION_CONSTANTS.BORDER_WIDTH.narrow,
        // borderBottomColor: COLOR_CONSTANTS.BASIC.OPACITY.BLACK[20],
        // borderBottomStyle: "solid"
      },
      td: {
        style: {
          ...tableCellStyleConfig
        }
      }
    },
    events: [{}]
  };

  console.log('表格元素创建完成:', JSON.stringify({
    id: tableElement.id,
    name: tableElement.name,
    type: tableElement.type,
    rawData: (tableElement.rawData && tableElement.rawData.length > 0) ? '有内容' : '无内容',
    hasTableStyles: !!(tableElement.layout?.style?.table)
  }, null, 2));

  return tableElement;
}

// 创建代码元素
function createCodeElement(codeContent, language = '') {
  const id = generateUUID();
  const codeStyleConfig = getElementStyleConfig('text', 'codeBlock');

  console.log('创建代码元素，语言:', language);

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
    console.log('代码背景色:', backgroundColor, '是否为深色主题:', isDarkMode);
  }

  // 使用markedInstance处理代码高亮
  let highlightedCode = codeContent;
  try {
    const markdownCode = `\`\`\`${language || 'plaintext'}\n${codeContent}\n\`\`\``;
    highlightedCode = markedInstance.parse(markdownCode);
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

// 检测Markdown代码块
function isMarkdownCodeBlock(line) {
  return line.trim().startsWith('```');
}

// 提取完整的Markdown代码块
function extractMarkdownCodeBlock(lines, startIndex) {
  console.log(`开始提取代码块，从第${startIndex}行开始`);

  const startLine = lines[startIndex].trim();
  let language = '';

  // 从第一行提取语言信息
  if (startLine.length > 3) {
    language = startLine.substring(3).trim();
    console.log(`检测到代码语言: ${language}`);
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

  console.log(`提取的代码内容 (${cleanedCodeLines.length}行):`);
  console.log(`代码结束索引: ${result.endIndex}`);

  return result;
}

// 使用D3生成SVG图表
function generateChartSvg(chartType, data, chartStyleConfig = null, chartTitle = null) {
  console.log('开始生成图表SVG，类型:', chartType, chartTitle ? `，标题: ${chartTitle}` : '');

  try {
    // 使用chartGenerator提供的功能生成SVG，传入样式配置和标题
    return generateChartFromTableData(data, chartType, chartStyleConfig, chartTitle);
  } catch (error) {
    console.error('生成图表SVG时出错:', error);
    // 返回错误信息的SVG
    return `<svg width="800" height="200" xmlns="http://www.w3.org/2000/svg">
      <text x="50" y="50" font-family="sans-serif" font-size="16" fill="red">
        图表生成错误: ${error.message}
      </text>
    </svg>`;
  }
}

// 创建图表元素
function createChartElement(chartType, svgContent, tableData, rawData, variant = 'normal', chartTitle = null) {
  const id = generateUUID();
  const layoutStyleConfig = getElementStyleConfig('layout', 'column');
  
  // 🆕 根据 variant 获取对应的图表样式配置
  const chartContainerStyleConfig = getElementStyleConfig('chart', variant, 'container');
  const chartTitleStyleConfig = getElementStyleConfig('chart', variant, 'title');
  const chartLegendStyleConfig = getElementStyleConfig('chart', variant, 'legend');
  const chartAxisStyleConfig = getElementStyleConfig('chart', variant, 'axis');

  console.log(`创建图表元素，类型: ${chartType}, variant: ${variant}`);

  // 生成唯一的className
  const uniqueClassName = `chart-${id}`;
  const uniqueTitleClassName = `chart-title-${id}`;
  const uniqueLegendClassName = `chart-legend-${id}`;
  const uniqueAxisClassName = `chart-axis-${id}`;

  // 创建符合要求的图表元素结构
  const chartElement = {
    id,
    name: "chart",
    "name-zh": "图表",
    "file-type": "cell-element",
    type: "chart",
    chartType: chartType,
    // 🔍 保存元数据用于分析
    _metadata: {
      actualType: 'chart',
      variant: variant || 'normal',  // 🔧 修复：使用正确的 variant 参数
      chartType: chartType || 'line', // 🆕 图表类型（不包含标题）
      title: chartTitle, // 🆕 添加图表标题到元数据
      isChart: true
    },
    svgContent: svgContent,
    tableData: tableData, // 保存解析后的表格数据
    rawData: rawData,     // 保存原始Markdown表格内容
    layout: {
      // 图表容器样式
      classStyle: {
        ...chartContainerStyleConfig
      },
      className: uniqueClassName,
      style: {
        // 基础样式
        "background-color": [],
        font: [],
        border: [],
        scale: [],
        "box-sizing": "border-box",
        overflow: "hidden",
        "box-sizing": "border-box",
        primaryAxisSizingMode: "fixed",
        position: "relative",
        width: "100%",
        height: "auto",
        ...layoutStyleConfig
      },
      // 图表子元素样式配置
      chart: {
        style: {
          ...chartContainerStyleConfig
        }
      },
      title: {
        className: uniqueTitleClassName,
        classStyle: {
          ...chartTitleStyleConfig
        }
      },
      legend: {
        className: uniqueLegendClassName,
        classStyle: {
          ...chartLegendStyleConfig
        }
      },
      axis: {
        className: uniqueAxisClassName,
        classStyle: {
          ...chartAxisStyleConfig
        }
      }
    },
    events: [{}]
  };

  console.log('图表元素创建完成:', JSON.stringify({
    id: chartElement.id,
    name: chartElement.name,
    type: chartElement.type,
    chartType: chartElement.chartType,
    hasTableData: !!(tableData && tableData.length),
    dataRows: tableData ? tableData.length : 0,
    hasSubElements: !!(chartElement.layout.title && chartElement.layout.legend && chartElement.layout.axis)
  }, null, 2));

  return chartElement;
}

// 解析表格数据为二维数组
function parseTableData(tableContent) {
  // 分割表格内容为行
  const lines = tableContent.trim().split('\n');
  const data = [];

  // 解析每一行
  for (let i = 0; i < lines.length; i++) {
    // 跳过分隔行 (包含 --- 的行)
    if (lines[i].match(/\|[-|\s]+\|/)) {
      continue;
    }

    // 移除行首尾的|，并分割单元格
    const cells = lines[i].trim()
      .replace(/^\||\|$/g, '')  // 移除首尾的|
      .split('|')                // 按|分割
      .map(cell => cell.trim()); // 移除单元格内容的空白

    data.push(cells);
  }

  return data;
}

// 检测markdown表格 - 为了保持兼容性而保留的函数
function isMarkdownTable(lines) {
  if (lines.length < 2) return false;

  // 使用新的检测逻辑
  const { isData, isChart } = isTableOrChartData(lines[0]);
  // 只有当是表格数据且不是图表时返回true
  return isData && !isChart;
}

function processMarkdownWithMathProtection(markdown) {
  // 第一步：提取并保护数学公式
  const mathBlocks = [];
  let mathIndex = 0;
  
  // 提取行内数学公式 $...$（非贪婪匹配，避免跨行）
  let processedMarkdown = markdown.replace(/\$([^$\n]+?)\$/g, (match) => {
      const placeholder = `§MATH_INLINE_${mathIndex}§`;
      mathBlocks[mathIndex] = match;
      mathIndex++;
      return placeholder;
  });
  
  // 提取块级数学公式 $$...$$（可以跨行）
  processedMarkdown = processedMarkdown.replace(/\$\$([\s\S]*?)\$\$/g, (match) => {
      const placeholder = `§MATH_BLOCK_${mathIndex}§`;
      mathBlocks[mathIndex] = match;
      mathIndex++;
      return placeholder;
  });
  
  // 第二步：规范化换行符
  const normalizedMarkdown = processedMarkdown.replace(/\r\n/g, '\n');
  
  // 第三步：处理段落分隔符（现在数学公式已经被保护了）
  const paragraphProcessed = normalizedMarkdown
      .replace(/\n\n+/g, '\n§PARAGRAPH§\n')  // 标记段落分隔符
      .replace(/\\n\\n+/g, '\n§PARAGRAPH§\n')
      .replace(/\\n/g, '\n');
  
  // 第四步：还原数学公式
  let result = paragraphProcessed;
  for (let i = 0; i < mathBlocks.length; i++) {
      result = result.replace(`§MATH_INLINE_${i}§`, mathBlocks[i]);
      result = result.replace(`§MATH_BLOCK_${i}§`, mathBlocks[i]);
  }
  
  return result;
}
// 改进Markdown解析功能，支持列表和富文本
function parseMarkdown(markdown, options = {}) {
  const { disableButtonGrouping = false, disableSiblingGrouping = false, currentMarkdown: passedMarkdown } = options;
  const currentMarkdown = passedMarkdown || markdown; // 优先使用传入的完整markdown，否则使用当前部分
  // 首先规范化换行符处理
  // 把所有的\r\n转换为\n
  const normalizedMarkdown = markdown.replace(/\r\n/g, '\n');

  const processedMarkdown = processMarkdownWithMathProtection(normalizedMarkdown);

  // 分割Markdown文本为行（保留空行标记）
  const lines = processedMarkdown.split('\n');

  // 解析结果将存储在这个数组中
  const elements = [];

  // 存储一级标题块，用于后续流式布局
  const h1Blocks = [];

  // 用于跟踪当前的嵌套级别
  const stack = [{ level: 0, elements: elements }];

  // 当前处理的一级标题块
  let currentH1Block = null;

  // 用于收集连续的按钮元素
  let consecutiveButtons = [];

  // 缓存当前处理的文本块
  let currentTextBlock = '';

  // 标记当前正在处理的列表状态
  let inList = false;
  let listItems = [];

  // 优先预处理：识别Markdown中的表格
  console.log('开始检查Markdown中的表格...');

  // 创建一个函数来查找完整表格的起始行
  function findTableStartLines(lines) {
    const tableStarts = [];

    for (let i = 0; i < lines.length - 1; i++) {
      // 使用新的检测逻辑检查是否为表格
      const { isData, isChart } = isTableOrChartData(lines[i]);
      if (isData) {
        tableStarts.push(i);
      }
    }

    return tableStarts;
  }

  // 查找所有表格的起始行
  const allLines = lines.map(line => line);
  const tableStarts = findTableStartLines(allLines);
  console.log(`找到 ${tableStarts.length} 个表格起始行: ${tableStarts.join(', ')}`);

  // 标记每一行是否为表格的一部分
  const markedLines = [];
  for (let i = 0; i < lines.length; i++) {
    markedLines.push({
      line: lines[i],
      isTable: false,
      tableContent: null,
      isTableStart: false
    });
  }

  // 处理每个表格
  for (const startIndex of tableStarts) {
    // 提取表格内容，使用新的提取函数
    const result = extractTableOrChartData(allLines, startIndex);
    const { tableContent, endIndex } = result;

    if (tableContent) {

      // 标记第一行为表格开始，并存储完整表格内容
      markedLines[startIndex].isTable = true;
      markedLines[startIndex].tableContent = tableContent;
      markedLines[startIndex].isTableStart = true;

      // 标记其余表格行
      for (let j = startIndex + 1; j <= endIndex; j++) {
        if (j < markedLines.length) {
          markedLines[j].isTable = true;
        }
      }
    }
  }

  // 处理每一行
  for (let i = 0; i < markedLines.length; i++) {
    const { line, isTable, tableContent, isTableStart } = markedLines[i];
    const trimmedLine = line.trim();

    // 🔧 修复：跳过完全空白的行
    if (!trimmedLine) {
      continue;
    }

    // 检查是否为段落分隔符
    if (trimmedLine === '§PARAGRAPH§') {
      // 处理之前累积的内容
      flushTextBlock();

      // 如果正在处理列表，结束列表
      if (inList && listItems.length > 0) {
        // 创建一个垂直布局来容纳列表项，明确指定左对齐
        const listLayout = createLayoutElement(
          LAYOUT_CONSTANTS.DIRECTION.VERTICAL,
          listItems,
          {
            alignItems: LAYOUT_CONSTANTS.ALIGN.X.MIN,
            counterAxisAlign: LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.MIN
          }
        );

        // 添加到当前堆栈的末尾元素的children中
        stack[stack.length - 1].elements.push(listLayout);

        // 重置列表状态
        inList = false;
        listItems = [];
      }

      continue;
    }

    // 检查是否为表格或图表数据
    const { isData, isChart, chartType } = isTableOrChartData(trimmedLine);

    if (isData) {
      console.log(`发现${isChart ? '图表' : '表格'}数据，行号: ${i}`);

      // 处理之前累积的内容
      flushTextBlock();
      flushConsecutiveButtons();

      // 提取表格/图表数据
      const result = extractTableOrChartData(
        markedLines.map(item => item.line),
        i
      );

      // 处理表格/图表数据
      const endIndex = processTableOrChartData(result, stack);

      // 跳过已处理的行
      i = endIndex;
      continue;
    }

    // 处理代码块
    if (isMarkdownCodeBlock(trimmedLine)) {
      // 处理之前累积的内容
      flushTextBlock();
      flushConsecutiveButtons();

      // 提取代码块内容和语言
      const { codeContent, language, endIndex } = extractMarkdownCodeBlock(
        markedLines.map(item => item.line),
        i
      );

      // 创建代码元素
      const codeElement = createCodeElement(codeContent, language);
      stack[stack.length - 1].elements.push(codeElement);

      // 跳过已处理的代码块行
      i = endIndex;
      continue;
    }

    // 处理布局标签
    const layoutTagInfo = isLayoutTag(trimmedLine);
    if (layoutTagInfo.isLayoutTag && !layoutTagInfo.isClosing) {
      console.log(`发现布局标签，行号: ${i}，变体: ${layoutTagInfo.variant}，属性:`, layoutTagInfo.attributes);
      
      // 处理之前累积的内容
      flushTextBlock();
      flushConsecutiveButtons();

      // 如果正在处理列表，先结束列表
      if (inList && listItems.length > 0) {
        const listLayout = createLayoutElement(
          LAYOUT_CONSTANTS.DIRECTION.VERTICAL,
          listItems,
          {
            alignItems: LAYOUT_CONSTANTS.ALIGN.X.MIN,
            counterAxisAlign: LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.MIN
          }
        );
        stack[stack.length - 1].elements.push(listLayout);
        inList = false;
        listItems = [];
      }

      // 提取布局标签内容
      const { layoutContent, variant, attributes, endIndex } = extractLayoutBlock(
        markedLines.map(item => item.line),
        i
      );

      // 🆕 特殊处理根layout标签
      if (variant === 'root') {
        console.log(`🌱 发现根layout标签，属性:`, attributes);
        
        // 对于根layout，我们需要应用属性到现有的根布局
        // 递归解析根布局内的内容（如果有）
        if (layoutContent.trim()) {
          console.log(`递归解析根布局内容`);
          const rootChildren = parseMarkdown(layoutContent, { 
            disableButtonGrouping: true,
            disableSiblingGrouping: false,
            currentMarkdown
          });
          
          // 将解析的内容添加到当前堆栈
          rootChildren.forEach(child => {
            stack[stack.length - 1].elements.push(child);
          });
        }
        
        // 🆕 保存根layout的属性信息，在创建根对象时会用到
        if (!options.rootAttributes) {
          options.rootAttributes = {};
        }
        Object.assign(options.rootAttributes, attributes);
        
        console.log(`🌱 根layout属性已保存:`, options.rootAttributes);
      } else {
        // 递归解析布局标签内的内容
        if (layoutContent.trim()) {
          console.log(`递归解析布局内容，变体: ${variant}，属性:`, attributes);
          const layoutChildren = parseMarkdown(layoutContent, { 
            disableButtonGrouping: true,
            disableSiblingGrouping: variant === 'row',  // 🔧 只在 row 布局中禁用同级标题分组
            currentMarkdown
          });

          // 根据变体确定布局方向
          let direction = LAYOUT_CONSTANTS.DIRECTION.VERTICAL; // 默认垂直
          let alignItems = LAYOUT_CONSTANTS.ALIGN.X.MIN;
          let counterAxisAlign = LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.MIN;

          if (variant === 'row') {
            direction = LAYOUT_CONSTANTS.DIRECTION.HORIZONTAL;
            // changed center to stretch
            // alignItems = LAYOUT_CONSTANTS.ALIGN.X.CENTER;
            alignItems = 'stretch';
            // alignItems = 'flex-start';
            counterAxisAlign = LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.CENTER;
          } else if (variant === 'column') {
            direction = LAYOUT_CONSTANTS.DIRECTION.VERTICAL;
            alignItems = LAYOUT_CONSTANTS.ALIGN.X.MIN;
            counterAxisAlign = LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.MIN;
          }

          // 🔧 创建稳定的内容种子用于生成稳定ID
          const contentSeed = `${variant}-${layoutContent}`;
          const position = `line-${i}`;
          
          // 创建布局容器，传递属性
          const layoutContainer = createLayoutElement(
            direction,
            layoutChildren,
            {
              variant: variant,
              alignItems: alignItems,
              counterAxisAlign: counterAxisAlign,
              contentSeed: contentSeed,
              position: position,
              attributes: attributes // 🆕 传递属性
            }
          );
          
          // 🔧 确保元数据正确保存了variant信息
          if (layoutContainer._metadata) {
            layoutContainer._metadata.variant = variant;
            layoutContainer._metadata.originalVariant = variant; // 保存原始variant
            layoutContainer._metadata.isLayoutTag = true; // 标记这是来自layout标签的
          }
          
          console.log(`🔧 创建layout标签容器: ID=${layoutContainer.id}, variant=${variant}, 属性:`, attributes, `内容长度=${layoutContent.length}`);

          stack[stack.length - 1].elements.push(layoutContainer);
        }
      }

      // 跳过已处理的布局标签行
      i = endIndex;
      continue;
    }

    // 处理卡片标签
    const cardTagInfo = isCardTag(trimmedLine);
    if (cardTagInfo.isCardTag && !cardTagInfo.isClosing) {
      console.log(`发现卡片标签，行号: ${i}，变体: ${cardTagInfo.variant}`);
      
      // 处理之前累积的内容
      flushTextBlock();
      flushConsecutiveButtons();

      // 如果正在处理列表，先结束列表
      if (inList && listItems.length > 0) {
        const listLayout = createLayoutElement(
          LAYOUT_CONSTANTS.DIRECTION.VERTICAL,
          listItems,
          {
            alignItems: LAYOUT_CONSTANTS.ALIGN.X.MIN,
            counterAxisAlign: LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.MIN
          }
        );
        stack[stack.length - 1].elements.push(listLayout);
        inList = false;
        listItems = [];
      }

      // 提取卡片标签内容
      const { cardContent, variant, attributes, endIndex } = extractCardBlock(
        markedLines.map(item => item.line),
        i
      );

      // 创建卡片元素
      const cardElement = createCardElement(cardContent, variant, attributes, currentMarkdown);
      
      console.log(`🔧 创建卡片元素: ID=${cardElement.id}, variant=${variant}, 内容长度=${cardContent.length}`);

      stack[stack.length - 1].elements.push(cardElement);

      // 跳过已处理的卡片标签行
      i = endIndex;
      continue;
    }

    // 处理引用文本
    if (isQuoteText(trimmedLine)) {
      console.log(`发现引用文本，行号: ${i}`);
      
      // 处理之前累积的内容
      flushTextBlock();
      flushConsecutiveButtons();

      // 如果正在处理列表，先结束列表
      if (inList && listItems.length > 0) {
        const listLayout = createLayoutElement(
          LAYOUT_CONSTANTS.DIRECTION.VERTICAL,
          listItems,
          {
            alignItems: LAYOUT_CONSTANTS.ALIGN.X.MIN,
            counterAxisAlign: LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.MIN
          }
        );
        stack[stack.length - 1].elements.push(listLayout);
        inList = false;
        listItems = [];
      }

      // 提取引用块内容
      const { quoteContent, endIndex } = extractQuoteBlock(
        markedLines.map(item => item.line),
        i
      );

      // 创建引用文本元素，使用 'quote' 样式变体
      const quoteElement = createTextElement(quoteContent, 'quote');
      stack[stack.length - 1].elements.push(quoteElement);

      // 跳过已处理的引用块行
      i = endIndex;
      continue;
    }

    // 解析标题
    const headingMatch = trimmedLine.match(/^(#{1,6})\s+(.*?)$/);
    if (headingMatch) {
      // 处理之前累积的内容
      flushTextBlock();
      flushConsecutiveButtons();

      // 如果正在处理列表，先结束列表
      if (inList && listItems.length > 0) {
        // 创建一个垂直布局来容纳列表项，明确指定左对齐
        const listLayout = createLayoutElement(
          LAYOUT_CONSTANTS.DIRECTION.VERTICAL,
          listItems,
          {
            alignItems: LAYOUT_CONSTANTS.ALIGN.X.MIN,
            counterAxisAlign: LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.MIN
          }
        );

        // 添加到当前堆栈的末尾元素的children中
        stack[stack.length - 1].elements.push(listLayout);

        // 重置列表状态
        inList = false;
        listItems = [];
      }

      const level = headingMatch[1].length;
      const content = headingMatch[2].trim();

      // 如果是一级标题，创建新的一级标题块
      if (level === 1) {
        // 如果已经有一个当前的一级标题块，将其添加到h1Blocks中
        if (currentH1Block) {
          h1Blocks.push(currentH1Block);
        }

        // 🔧 修复：在创建新标题块之前，保存根级别的现有元素
        const rootElements = stack[0].elements; // 获取根级别的元素
        console.log(`🔍 一级标题处理前，根级别有 ${rootElements.length} 个元素`);
        
        // 创建新的一级标题布局
        const newHeadingLayout = createHeadingLayout(content, [], level);

        // 🔧 修复：将根级别的现有元素添加到新标题块的开头
        if (rootElements.length > 0) {
          console.log(`🔧 将 ${rootElements.length} 个根级别元素添加到新标题块`);
          // 将根级别元素添加到标题块的children数组开头
          newHeadingLayout.layout.children.unshift(...rootElements);
          // 清空根级别元素，避免重复
          rootElements.length = 0;
        }

        // 创建新的一级标题块
        currentH1Block = newHeadingLayout;

        // 重置栈，只保留根级别
        while (stack.length > 1) {
          stack.pop();
        }

        // 将新的嵌套层级添加到栈中
        stack.push({ level, elements: newHeadingLayout.layout.children });
      } else {
        // 对于非一级标题，找到正确的父级嵌套层级
        while (stack.length > 1 && stack[stack.length - 1].level >= level) {
          stack.pop();
        }

        // 创建新的嵌套层级，传递标题级别
        const newHeadingLayout = createHeadingLayout(content, [], level);

        // 🆕 检查是否禁用同级标题分组（如在布局标签内）
        if (disableSiblingGrouping) {
          // 在布局标签内，直接添加标题，由布局标签控制方向
          console.log(`布局标签内添加独立标题(level ${level})，同级分组已禁用`);
          stack[stack.length - 1].elements.push(newHeadingLayout);
        } else {
          // 🆕 检查同级标题分组逻辑
          const parentElements = stack[stack.length - 1].elements;
          
          // 查找父容器中是否已经有同级标题
          const existingSiblingHeading = parentElements.find(element => 
            element._metadata?.actualType === 'layout' && 
            element._metadata?.headingLevel === level &&
            !element._metadata?.isSiblingGroup  // 不是同级组合容器本身
          );

          // 查找是否已经有同级标题组合容器
          const existingSiblingGroup = parentElements.find(element =>
            element._metadata?.actualType === 'layout' &&
            element._metadata?.isSiblingGroup === true &&
            element._metadata?.headingLevel === level
          );

          if (existingSiblingHeading && !existingSiblingGroup) {
            // 🔧 第一次遇到同级标题：创建同级标题组合容器
            console.log(`检测到同级标题(level ${level})，创建同级标题组合容器`);
            
            // 从父容器中移除已存在的同级标题
            const siblingIndex = parentElements.indexOf(existingSiblingHeading);
            parentElements.splice(siblingIndex, 1);
            
            // 🔧 为同级标题组合创建稳定ID
            const siblingContentSeed = `sibling-h${level}-${existingSiblingHeading.id}-${newHeadingLayout.id}`;
            const siblingPosition = `sibling-group-${level}`;
            
            // 创建同级标题组合容器
            const siblingGroupContainer = createLayoutElement(
              LAYOUT_CONSTANTS.DIRECTION.VERTICAL,
              [existingSiblingHeading, newHeadingLayout],
              {
                alignItems: LAYOUT_CONSTANTS.ALIGN.X.MIN,
                counterAxisAlign: LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.MIN,
                variant: 'column',
                contentSeed: siblingContentSeed,
                position: siblingPosition
              }
            );
            
            // 🏷️ 标记为同级标题组合容器
            siblingGroupContainer._metadata = {
              ...siblingGroupContainer._metadata,
              actualType: 'layout',
              variant: 'column',
              isSiblingGroup: true,
              headingLevel: level,
              isLayout: true
            };
            
            // 将同级标题组合容器添加到父容器
            parentElements.push(siblingGroupContainer);
            
            console.log(`✅ 创建同级标题组合容器(level ${level})，包含 2 个同级标题`);
            
          } else if (existingSiblingGroup) {
            // 🔧 已有同级标题组合容器：添加到现有容器
            console.log(`向现有同级标题组合容器添加标题(level ${level})`);
            
            existingSiblingGroup.layout.children.push(newHeadingLayout);
            console.log(`✅ 已添加到同级标题组合容器，当前包含 ${existingSiblingGroup.layout.children.length} 个同级标题`);
            
          } else {
            // 🔧 首个标题或无同级标题：正常添加
            parentElements.push(newHeadingLayout);
            console.log(`添加独立标题(level ${level})`);
          }
        }

        // 将新的嵌套层级添加到栈中
        stack.push({ level, elements: newHeadingLayout.layout.children });
      }

      continue;
    }

    // 检查是否为列表项或包含富文本的行
    const richTextResult = processListItemAndRichText(trimmedLine);

    if (richTextResult.processed) {
      // 处理之前累积的文本块
      flushTextBlock();

      // 如果是列表项
      if (richTextResult.element.layout.style.listStyleType) {
        // 标记我们正在处理列表
        inList = true;

        // 添加到列表项数组
        listItems.push(richTextResult.element);
      }
      // 如果不是列表项，直接添加到当前元素栈
      else {
        // 如果之前有列表，先处理列表
        if (inList && listItems.length > 0) {
          // 创建一个垂直布局来容纳列表项，明确指定左对齐
          const listLayout = createLayoutElement(
            LAYOUT_CONSTANTS.DIRECTION.VERTICAL,
            listItems,
            {
              alignItems: LAYOUT_CONSTANTS.ALIGN.X.MIN,
              counterAxisAlign: LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.MIN
            }
          );
          stack[stack.length - 1].elements.push(listLayout);

          // 重置列表状态
          inList = false;
          listItems = [];
        }

        // 将处理后的元素添加到栈
        stack[stack.length - 1].elements.push(richTextResult.element);
      }

      continue;
    }

    // 整行是图片 ![alt](url)
    // 🔧 修复：改进图片检测逻辑，增加调试信息
    const isImageLine = trimmedLine.match(/^!\[.*?\]\(.*?\)$/);
    const hasMultipleLinks = trimmedLine.match(/^!\[.*?\]\(.*?\).*?\[.*?\]\(.*?\)/);
    
    // 🔧 只在真正检测到图片时输出关键调试信息
    if (trimmedLine.includes('![') && trimmedLine.includes('](')) {
      console.log(`🔍 检测到可能的图片行 ${i}: "${trimmedLine.substring(0, 50)}..."`);
    }
    
    // 🔧 修复：更宽松的图片检测逻辑
    if (trimmedLine.includes('![') && trimmedLine.includes('](') && trimmedLine.includes(')')) {
      const basicImagePattern = /!\[([^\]]*)\]\(([^)]+)\)/;
      const imgMatch = trimmedLine.match(basicImagePattern);
      
      if (imgMatch && !hasMultipleLinks) {
        flushTextBlock();
        flushConsecutiveButtons();

        // 🔧 修复：提取图片信息并创建完整的图片元素
        const imgAlt = imgMatch[1].trim();
        const imgUrl = imgMatch[2].trim();
        
        console.log(`🖼️ 成功创建独立图片元素: alt="${imgAlt}", url="${imgUrl}"`);
        
        // 创建带有完整信息的背景元素
        const backgroundElement = createBackgroundElement(imgUrl, 'normal');
        
        // 🆕 添加图片的alt信息到元数据中
        if (backgroundElement._metadata) {
          backgroundElement._metadata.alt = imgAlt;
        }
        
        stack[stack.length - 1].elements.push(backgroundElement);
        console.log(`✅ 图片元素已添加到栈中`);

        continue;
      }
    }

    // 检查是否有多个链接或混合内容
    if (trimmedLine.includes('[') && trimmedLine.includes('](') && trimmedLine.includes(')')) {
      console.log(`🔍 检测到可能的链接内容: "${trimmedLine}"`);
      
      // 首先检查是否是按钮类型标记格式
      const buttonVariantResult = parseButtonVariant(trimmedLine);
      
      if (buttonVariantResult.hasVariant) {
        // 处理带类型标记的按钮
        flushTextBlock();

        console.log(`发现按钮类型标记: variant="${buttonVariantResult.variant}", 文本="${buttonVariantResult.text}", URL="${buttonVariantResult.url}"`);

        // 🆕 传入原始完整文本用于事件解析，同时传入提取的按钮文本
        const buttonElement = createButtonElement(trimmedLine, buttonVariantResult.url, buttonVariantResult.variant, currentMarkdown, buttonVariantResult.text);
        console.log(`按钮ID: ${buttonElement.id}, 名称: ${buttonElement.name}, 样式: ${buttonVariantResult.variant}`);
        consecutiveButtons.push(buttonElement);

        continue;
      }

      // 如果该行不仅仅只有一个链接（即前后有其他文本），视为混合内容行
      const multiLinkMatch = trimmedLine.match(/\[([^\]]+)\]\(([^)]+)\)/g);
      const linkPattern = /^\[([^\]]+)\]\(([^)]+)\)$/;
      const isLinkLine = linkPattern.test(trimmedLine);

      // 如果不是纯链接行，则当作混合内容处理
      if (!isLinkLine) {
        flushTextBlock();
        flushConsecutiveButtons();

        console.log(`处理混合内容行: ${trimmedLine}`);

        const processedLayout = processMixedContent(trimmedLine);
        stack[stack.length - 1].elements.push(processedLayout);

        continue;
      }

      // 如果只有一个链接且占据整行，视为按钮（默认primary样式）
      if (multiLinkMatch && multiLinkMatch.length === 1 && isLinkLine) {
        console.log(`发现单个链接: ${multiLinkMatch[0]}`);
        flushTextBlock();

        const singleLinkMatch = multiLinkMatch[0].match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (singleLinkMatch) {
          const linkText = singleLinkMatch[1];
          const linkUrl = singleLinkMatch[2];

          console.log(`创建默认按钮: 文本="${linkText}", URL="${linkUrl}"`);

          const buttonElement = createButtonElement(linkText, linkUrl, 'primary', currentMarkdown); // 默认使用primary样式
          console.log(`按钮ID: ${buttonElement.id}, 名称: ${buttonElement.name}, 样式: primary`);
          consecutiveButtons.push(buttonElement);

          continue;
        }
      }
    }

    // 检测图标标签
    const iconTagInfo = isIconTag(trimmedLine);
    if (iconTagInfo.isIconTag) {
      console.log(`发现图标标签，行号: ${i}，图标名称: ${iconTagInfo.iconName}，变体: ${iconTagInfo.variant}`);
      
      // 处理之前累积的内容
      flushTextBlock();
      flushConsecutiveButtons();

      // 如果正在处理列表，先结束列表
      if (inList && listItems.length > 0) {
        const listLayout = createLayoutElement(
          LAYOUT_CONSTANTS.DIRECTION.VERTICAL,
          listItems,
          {
            alignItems: LAYOUT_CONSTANTS.ALIGN.X.MIN,
            counterAxisAlign: LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.MIN
          }
        );
        stack[stack.length - 1].elements.push(listLayout);
        inList = false;
        listItems = [];
      }

      // 创建图标元素，使用从标签解析出的变体
      const iconElement = createIconElement(iconTagInfo.iconName, iconTagInfo.variant);
      
      console.log(`🔧 创建图标元素: ID=${iconElement.id}, 图标名称=${iconTagInfo.iconName}, 变体=${iconTagInfo.variant}`);

      stack[stack.length - 1].elements.push(iconElement);

      continue;
    }

    // 普通文本行
    if (trimmedLine !== '') {
      // 🔧 修复：清理段落符号
      const cleanedLine = trimmedLine.replace(/§PARAGRAPH§/g, '');
      if (cleanedLine) {
        if (currentTextBlock) {
          currentTextBlock += '\n' + cleanedLine;
        } else {
          currentTextBlock = cleanedLine;
        }
      }
    }
  }

  // 确保处理完所有累积的内容
  flushTextBlock();
  flushConsecutiveButtons();

  // 处理最后可能遗留的列表项
  if (inList && listItems.length > 0) {
    // 创建一个垂直布局来容纳列表项，明确指定左对齐
    const listLayout = createLayoutElement(
      LAYOUT_CONSTANTS.DIRECTION.VERTICAL,
      listItems,
      {
        alignItems: LAYOUT_CONSTANTS.ALIGN.X.MIN,
        counterAxisAlign: LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.MIN
      }
    );
    stack[stack.length - 1].elements.push(listLayout);
  }

  // 如果有当前的一级标题块，将其添加到h1Blocks中
  if (currentH1Block) {
    h1Blocks.push(currentH1Block);
  }

  // 如果有多个一级标题块，创建流式布局并将它们包装起来
  if (h1Blocks.length > 1) {
    // 标记是多标题布局的上下文
    const isMultiTitleLayout = true;

    // 将每个一级标题块包装在容器中，设置最小宽度
    // 当多标题并排时，标题应该左对齐
    const wrappedH1Blocks = h1Blocks.map(block => {
      // 标题文本应该在多标题布局中左对齐
      if (block && block.layout && block.layout.children && block.layout.children.length > 0) {
        // 查找标题文本元素
        const headingText = block.layout.children[0];
        if (headingText && headingText.name === "text") {
          // 修改标题文本为左对齐
          if (headingText.layout && headingText.layout.style) {
            headingText.layout.style.textAlign = "left";
          }

          // 修改文本容器样式
          if (headingText.layout.text_body && headingText.layout.text_body.style) {
            headingText.layout.text_body.style.textAlign = "left";
          }

          if (headingText.layout.text_hyperlink && headingText.layout.text_hyperlink.style) {
            headingText.layout.text_hyperlink.style.textAlign = "left";
          }
        }
      }

      return createHeadingBlockContainer(block);
    });

    // 创建流式布局容器
    const flexLayout = createFlexWrapLayout(wrappedH1Blocks);

    // 返回流式布局
    return [flexLayout];
  } else if (h1Blocks.length === 1) {
    // 如果只有一个一级标题块，直接返回
    // 这种情况下标题应该居中对齐
    return [h1Blocks[0]];
  }

  // 如果没有一级标题块，返回原始元素
  return elements;
  // 辅助函数：处理文本块
  function flushTextBlock() {
    if (currentTextBlock) {
      // 在处理文本块之前，移除所有内部的段落标记
      const cleanedTextBlock = currentTextBlock.replace(/§PARAGRAPH§/g, '\n').trim();

      if (cleanedTextBlock) { // 确保清理后仍有内容
        // 检查文本块是否包含富文本或列表项
        const lines = cleanedTextBlock.split('\n');

        // 如果只有一行，尝试处理富文本
        if (lines.length === 1) {
          const singleCleanedLine = lines[0].trim();
          if (singleCleanedLine) {
            const richTextResult = processListItemAndRichText(singleCleanedLine);

            if (richTextResult.processed) {
              // 如果是列表项
              if (richTextResult.element.layout.style.listStyleType) {
                inList = true;
                listItems.push(richTextResult.element);
              }
              // 如果不是列表项，直接添加到当前元素栈
              else {
                if (inList && listItems.length > 0) {
                  // 🔧 生成稳定的内容种子，使用列表内容而不是ID
                  const listTexts = listItems.map(item => {
                    if (item.font?.fontsize?.default?.content) {
                      return item.font.fontsize.default.content.slice(0, 15);
                    }
                    return 'listitem';
                  }).join('|');
                  const listHash = listTexts.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) & 0xfffff, 0);
                  const listContentSeed = `list-items-${listTexts}-count${listItems.length}`;
                  const listPosition = `vertical-list-hash${listHash}`;
                  
                  const listLayout = createLayoutElement(
                    LAYOUT_CONSTANTS.DIRECTION.VERTICAL,
                    listItems,
                    {
                      alignItems: LAYOUT_CONSTANTS.ALIGN.X.MIN,
                      counterAxisAlign: LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.MIN,
                      contentSeed: listContentSeed,
                      position: listPosition
                    }
                  );
                  stack[stack.length - 1].elements.push(listLayout);
                  inList = false;
                  listItems = [];
                }
                stack[stack.length - 1].elements.push(richTextResult.element);
              }
            } else {
              // 如果没有富文本格式，创建普通文本元素
              const textElement = createTextElement(singleCleanedLine);
              stack[stack.length - 1].elements.push(textElement);
            }
          }
        }
        // 如果有多行，为每行单独处理
        else {
          // 🔧 生成稳定的内容种子，添加文本块哈希
          const textHash = cleanedTextBlock.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) & 0xfffff, 0);
          const contentSeed = `multi-text-${cleanedTextBlock.slice(0, 30)}-lines${lines.length}`;
          const position = `vertical-text-hash${textHash}`;
          
          const textLayout = createLayoutElement(
            LAYOUT_CONSTANTS.DIRECTION.VERTICAL,
            [],
            {
              alignItems: LAYOUT_CONSTANTS.ALIGN.X.MIN,
              counterAxisAlign: LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.MIN,
              contentSeed: contentSeed,
              position: position
            }
          );

          for (const line of lines) {
            const cleanedLine = line.trim();
            if (cleanedLine === '') continue;

            const richTextResult = processListItemAndRichText(cleanedLine);

            if (richTextResult.processed) {
              if (richTextResult.element.layout.style.listStyleType) {
                inList = true;
                listItems.push(richTextResult.element);
              }
              else {
                textLayout.layout.children.push(richTextResult.element);
              }
            } else {
              const textElement = createTextElement(cleanedLine);
              textLayout.layout.children.push(textElement);
            }
          }

          if (textLayout.layout.children.length > 0) {
            stack[stack.length - 1].elements.push(textLayout);
          }

          if (inList && listItems.length > 0) {
            // 🔧 生成稳定的内容种子，使用列表内容而不是ID
            const listTexts = listItems.map(item => {
              if (item.font?.fontsize?.default?.content) {
                return item.font.fontsize.default.content.slice(0, 15);
              }
              return 'listitem';
            }).join('|');
            const listHash = listTexts.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) & 0xfffff, 0);
            const listContentSeed = `multiline-list-${listTexts}-count${listItems.length}`;
            const listPosition = `vertical-list-multiline-hash${listHash}`;
            
            const listLayout = createLayoutElement(
              LAYOUT_CONSTANTS.DIRECTION.VERTICAL,
              listItems,
              {
                alignItems: LAYOUT_CONSTANTS.ALIGN.X.MIN,
                counterAxisAlign: LAYOUT_CONSTANTS.ALIGN.Y.ITEMS.MIN,
                contentSeed: listContentSeed,
                position: listPosition
              }
            );
            stack[stack.length - 1].elements.push(listLayout);
            inList = false;
            listItems = [];
          }
        }
      }
      currentTextBlock = '';
    }
  }

  // 辅助函数：将累积的按钮添加为布局（现在默认使用垂直布局）
  function flushConsecutiveButtons() {
    if (consecutiveButtons.length > 0) {
      console.log(`处理 ${consecutiveButtons.length} 个连续按钮`);

      if (disableButtonGrouping) {
        // 在布局标签内，按钮作为独立元素添加，不创建按钮布局容器
        consecutiveButtons.forEach(button => {
          stack[stack.length - 1].elements.push(button);
          console.log(`添加独立按钮: ${button.id} (布局标签内)`);
        });
      } else if (consecutiveButtons.length === 1) {
        // 单个按钮直接添加
        stack[stack.length - 1].elements.push(consecutiveButtons[0]);
        console.log(`添加单个按钮: ${consecutiveButtons[0].id}`);
      } else {
        // 多个连续按钮放在垂直布局中（默认布局）
        const buttonLayout = createVerticalButtonLayout(consecutiveButtons);
        stack[stack.length - 1].elements.push(buttonLayout);
        console.log(`添加按钮布局: ${buttonLayout.id}, 包含 ${consecutiveButtons.length} 个按钮，默认垂直布局 (使用 <layout:row> 标签可改为水平布局)`);
      }
      consecutiveButtons = [];
    }
  }

  // 辅助函数：处理混合内容行
  function processMixedContent(line) {
    console.log(`🔍 processMixedContent 处理行: "${line}"`);
    
    // 🔧 生成稳定的内容种子，添加行内容哈希
    const lineHash = line.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) & 0xfffff, 0);
    const contentSeed = `mixed-content-${line.slice(0, 30)}-len${line.length}`;
    const position = `horizontal-mixed-hash${lineHash}`;
    
    // 创建一个水平布局元素
    let currentLayout = createLayoutElement(LAYOUT_CONSTANTS.DIRECTION.HORIZONTAL, [], {
      contentSeed: contentSeed,
      position: position
    });

    // 查找所有按钮类型标记 [variant] [text](url) 或 [variant][text](url) 或 [event:eventName][text](url)
    const buttonVariantRegex = /\[(\w+(?::\w+)?)\]\s*\[([^\]]+)\]\(([^)]+)\)/g;
    const buttonVariantMatches = [...line.matchAll(buttonVariantRegex)];
    console.log(`🎯 按钮变体正则: ${buttonVariantRegex.toString()}`);
    console.log(`🎯 按钮变体匹配结果:`, buttonVariantMatches);
    console.log(`找到 ${buttonVariantMatches.length} 个按钮类型标记`);

    // 查找所有普通链接 [text](url) 但不是图片链接，也不是按钮类型标记
    const normalLinkRegex = /(?<!!)\[(.*?)\]\((.*?)\)/g;
    const linkMatches = [...line.matchAll(normalLinkRegex)];
    
    // 过滤掉已经被按钮类型标记匹配的链接
    const filteredLinkMatches = linkMatches.filter(linkMatch => {
      return !buttonVariantMatches.some(buttonMatch => {
        // 检查链接是否在按钮类型标记的范围内
        const linkStart = linkMatch.index;
        const linkEnd = linkMatch.index + linkMatch[0].length;
        const buttonStart = buttonMatch.index;
        const buttonEnd = buttonMatch.index + buttonMatch[0].length;
        return linkStart >= buttonStart && linkEnd <= buttonEnd;
      });
    });
    
    console.log(`找到 ${filteredLinkMatches.length} 个普通链接（排除按钮类型标记）`);

    // 查找所有图片 ![alt](url)
    const imageMatches = [...line.matchAll(/!\[(.*?)\]\((.*?)\)/g)];
    console.log(`找到 ${imageMatches.length} 个图片链接`);

    // 合并并按照在原文中的位置排序
    const allMatches = [
      ...buttonVariantMatches.map(match => ({ type: 'buttonVariant', match })),
      ...filteredLinkMatches.map(match => ({ type: 'link', match })),
      ...imageMatches.map(match => ({ type: 'image', match }))
    ].sort((a, b) => a.match.index - b.match.index);

    let lastIndex = 0;

    // 按顺序处理所有匹配项
    for (const { type, match } of allMatches) {
      const matchIndex = match.index;

      // 处理匹配项前的文本
      if (matchIndex > lastIndex) {
        const textBefore = line.substring(lastIndex, matchIndex);
        // 始终创建文本元素，即使只有空格
        const textElement = createTextElement(textBefore);
        currentLayout.layout.children.push(textElement);
      }

      // 处理匹配项
      if (type === 'buttonVariant') {
        const variant = match[1];
        const buttonText = match[2];
        const buttonUrl = match[3];
        const supportedVariants = ['primary', 'secondary', 'success', 'warning', 'error', 'ghost', 'link'];
        
        // 检查是否是事件语法
        if (variant.startsWith('event:')) {
          console.log(`处理混合内容中的事件按钮: variant="${variant}", 文本="${buttonText}", URL="${buttonUrl}"`);
          // 🆕 传入原始匹配文本用于事件解析
          const buttonElement = createButtonElement(match[0], buttonUrl, 'primary', currentMarkdown, buttonText);
          currentLayout.layout.children.push(buttonElement);
        } else if (supportedVariants.includes(variant)) {
          console.log(`处理混合内容中的按钮类型标记: variant="${variant}", 文本="${buttonText}", URL="${buttonUrl}"`);
          const buttonElement = createButtonElement(buttonText, buttonUrl, variant, currentMarkdown);
          currentLayout.layout.children.push(buttonElement);
        } else {
          // 如果variant不支持，当作普通文本处理
          const textElement = createTextElement(match[0]);
          currentLayout.layout.children.push(textElement);
        }
      } else if (type === 'link') {
        const linkText = match[1];
        const linkUrl = match[2];
        console.log(`处理混合内容中的普通链接: 文本="${linkText}", URL="${linkUrl}"`);
        const buttonElement = createButtonElement(linkText, linkUrl, 'primary', currentMarkdown); // 默认使用primary样式
        currentLayout.layout.children.push(buttonElement);
      } else if (type === 'image') {
        const imgAlt = match[1];
        const imgUrl = match[2];
        console.log(`🖼️ 处理混合内容中的图片: alt="${imgAlt}", url="${imgUrl}"`);
        const backgroundElement = createBackgroundElement(imgUrl, 'normal');
        
        // 🆕 添加图片的alt信息到元数据中
        if (backgroundElement._metadata) {
          backgroundElement._metadata.alt = imgAlt;
        }
        
        currentLayout.layout.children.push(backgroundElement);
      }

      lastIndex = matchIndex + match[0].length;
    }

    // 处理最后一个匹配后的文本
    if (lastIndex < line.length) {
      const textAfter = line.substring(lastIndex);
      // 始终创建尾部文本元素，即使只有空格
      const textElement = createTextElement(textAfter);
      currentLayout.layout.children.push(textElement);
    }

    // 直接返回layout元素，而不是包含它的数组
    return currentLayout;
  }
}

// 🆕 递归收集所有EventTargetId的函数
function collectEventTargetIds(elements) {
  const eventTargetIds = [];
  
  const collectFromElement = (element) => {
    if (!element) return;
    
    // 检查当前元素的events数组
    if (element.events && Array.isArray(element.events)) {
      element.events.forEach(event => {
        if (event && event.EventTargetId && typeof event.EventTargetId === 'string') {
          if (!eventTargetIds.includes(event.EventTargetId)) {
            eventTargetIds.push(event.EventTargetId);
            console.log(`🎯 收集到EventTargetId: ${event.EventTargetId}`);
          }
        }
      });
    }
    
    // 递归检查子元素
    if (element.layout && element.layout.children && Array.isArray(element.layout.children)) {
      element.layout.children.forEach(child => {
        collectFromElement(child);
      });
    }
    
    // 检查其他可能包含子元素的结构
    for (const key in element) {
      if (typeof element[key] === 'object' && element[key] !== null) {
        if (Array.isArray(element[key])) {
          element[key].forEach(item => {
            if (typeof item === 'object') {
              collectFromElement(item);
            }
          });
        } else if (element[key].layout && element[key].layout.children) {
          collectFromElement(element[key]);
        }
      }
    }
  };
  
  // 收集所有元素中的EventTargetId
  if (Array.isArray(elements)) {
    elements.forEach(element => {
      collectFromElement(element);
    });
  } else {
    collectFromElement(elements);
  }
  
  console.log(`📋 总共收集到 ${eventTargetIds.length} 个EventTargetId:`, eventTargetIds);
  return eventTargetIds;
}

// 创建八要素根对象
function createEightElementRoot(markdownElements, rootAttributes = {}) {
  // 使用随机UUID生成根布局ID
  const rootId = generateUUID();

  // 🆕 收集所有EventTargetId
  const eventTargetIds = collectEventTargetIds(markdownElements);

  // 🆕 获取根布局的样式配置，传入根layout属性
  const rootStyleConfig = getElementStyleConfig('layout', 'root', rootAttributes);

  // 生成唯一的className
  const uniqueClassName = `layout-root-${rootId}`;

  const rootLayout = {
    dataKeys: [],
    id: rootId,
    name: "layout",
    "name-zh": "布局",
    "file-type": "template",
    theme: "default",
    EventTargetIds: eventTargetIds, // 🆕 收集的所有EventTargetId
    // 🔍 保存根布局元数据用于分析
    _metadata: {
      actualType: 'layout',
      variant: 'root',
      isLayout: true,
      isRoot: true,
      // 🆕 保存根layout的属性信息
      appliedAttributes: rootAttributes
    },
    layout: {
      classStyle: {
        ...rootStyleConfig // 应用根布局样式配置到classStyle（包含属性）
      },
      className: uniqueClassName,
      style: {
        display: LAYOUT_CONSTANTS.DISPLAY.FLEX,
        layoutMode: LAYOUT_CONSTANTS.DIRECTION.VERTICAL,
        layoutWrap: LAYOUT_CONSTANTS.WRAP.NO_WRAP,
        layoutAlign: LAYOUT_CONSTANTS.ALIGN.Y.SELF.INHERIT,
        layoutGrow: LAYOUT_CONSTANTS.GROW.ZERO,
        // width: "calc(100% - 30px)",
        height: "100%",
        position: "relative",
        "back-width": "auto",
        "back-height": "100px",
        "box-sizing": "border-box",
        // 🆕 应用根布局样式配置中的属性样式
        ...rootStyleConfig
      },
    children: markdownElements
    },
    events: [{}]
  };

  console.log(`🌱 创建根布局，应用属性:`, rootAttributes);

  return rootLayout;
}

// 主函数：将Markdown转换为八要素格式
function markdownToEightElement(markdown, styleConfig) {
  // 🆕 保存原始未处理的markdown用于事件解析（清理内部标记）
  const originalMarkdown = typeof markdown === 'string' 
    ? markdown.replace(/§PARAGRAPH§/g, '') 
    : markdown;
  
  // 如果提供了样式配置，设置当前配置
  if (styleConfig) {
    try {
      // 动态导入避免循环依赖
      import('./styleConfig.js').then(({ setStyleConfig }) => {
        setStyleConfig(styleConfig);
      });
    } catch (error) {
      console.warn('设置样式配置失败:', error);
    }
  }

  // 检查并规范化输入
  let processedMarkdown = markdown;

  // 确保markdown是字符串类型
  if (typeof processedMarkdown !== 'string') {
    console.warn('收到非字符串类型的Markdown输入，尝试转换为字符串');
    try {
      processedMarkdown = String(processedMarkdown || '');
    } catch (error) {
      console.error('转换Markdown输入为字符串失败:', error);
      processedMarkdown = '';
    }
  }

  // 确保最后有一个换行符，以正确处理最后一个段落
  if (processedMarkdown && !processedMarkdown.endsWith('\n')) {
    processedMarkdown += '\n';
  }

  console.log(`处理Markdown文本，长度: ${processedMarkdown.length}`);

  // 🆕 创建解析选项对象，用于收集根layout属性
  const parseOptions = { 
    rootAttributes: {},
    currentMarkdown: originalMarkdown  // 🆕 传递原始未处理的markdown用于事件解析
  };
  
  // 直接使用parseMarkdown函数解析Markdown为元素数组
  const parsedElements = parseMarkdown(processedMarkdown, parseOptions);
  console.log(`解析得到的元素数量: ${parsedElements.length}`);

  // 🆕 使用createEightElementRoot创建八要素根结构，传递根layout属性
  const eightElementRoot = createEightElementRoot(parsedElements, parseOptions.rootAttributes);

  // 重置为默认配置
  try {
    // 动态导入避免循环依赖
    import('./styleConfig.js').then(({ resetStyleConfig }) => {
      resetStyleConfig();
    });
  } catch (error) {
    console.warn('重置样式配置失败:', error);
  }

  return eightElementRoot;
}

// 打印八要素结构工具函数
function printEightElementStructure(element, indent = 0) {
  const indentation = ' '.repeat(indent);

  if (element.name) {
    console.log(`${indentation}${element.name} (${element.id || 'no-id'})`);
  } else {
    console.log(`${indentation}Anonymous Element`);
  }

  if (element.layout && element.layout.children) {
    console.log(`${indentation}Children (${element.layout.children.length}):`);
    for (const child of element.layout.children) {
      printEightElementStructure(child, indent + 2);
    }
  }
}

// 示例：将Markdown文本转换为八要素
function exampleMarkdownToEightElement(styleConfig) {
  const markdownText = `
# 示例标题

这是一段普通文本。

## 子标题

这是子标题下的文本内容。

### 次级标题

这是一些[链接1](https://example.com)和[链接2](https://example2.com)。

![示例图片](https://example.com/image.jpg)

混合内容行：文本中间的[链接](https://example.com)和![图片](https://example.com/img.png)以及更多文本。
  `;

  const eightElement = markdownToEightElement(markdownText, styleConfig);
  return eightElement;
}

// 示例调用
// const example = exampleMarkdownToEightElement();
// console.log(JSON.stringify(example, null, 2));
/**
 * 分析八要素结构中包含的所有元件类型和形态
 * @param {Object} eightElement - 八要素结构对象
 * @returns {Array} 页面元件列表 [{type, variant, count, elements}]
 */
export function analyzeElementsInEightElement(eightElement) {
  if (!eightElement || !eightElement.layout) {
    return [];
  }

  const elementMap = new Map();
  const layoutAnalysis = []; // 新增：专门用于layout分析的数组
  let layoutIndexCounter = 0; // 🆕 改为索引计数器：为每个layout分配唯一索引
  
  const analyzeElement = (element, path = '', depth = 0, parentContent = '') => {
    if (!element || !element.name) return;
    
    // 🔍 优先使用保存的元数据来确定元件类型和形态
    let elementType = element.name;
    let variant = 'normal';
    let sampleContent = '';
    
    // 1. 优先检查是否有元数据
    if (element._metadata) {
      const metadata = element._metadata;
      elementType = metadata.actualType || element.name;
      variant = metadata.variant || 'normal';
      
      // 🔧 修复：对于layout元素，正确保留原始variant信息
      if (elementType === 'layout' && metadata.isRoot !== undefined) {
        if (metadata.isRoot) {
          variant = 'root';
        } else {
          // 优先使用originalVariant，如果没有则使用variant，最后回退到'column'
          variant = metadata.originalVariant || metadata.variant || 'column';
        }
      }
      
      // 根据元数据设置示例内容
      if (metadata.actualType === 'math') {
        sampleContent = `数学公式(${metadata.mathType})`;
      } else if (metadata.actualType === 'list') {
        sampleContent = `列表(${metadata.listType})`;
      } else if (metadata.isCodeBlock) {
        sampleContent = `代码块(${metadata.language})`;
      } else if (metadata.actualType === 'chart') {
        sampleContent = `图表(${metadata.variant})`;
      } else if (metadata.actualType === 'table') {
        sampleContent = '表格';
      } else if (metadata.actualType === 'button') {
        sampleContent = metadata.buttonText || '按钮';
      } else if (metadata.actualType === 'image') {
        sampleContent = '图片';
      } else if (metadata.actualType === 'layout') {
        sampleContent = metadata.isRoot ? '根布局' : '列布局';
      }
    }
    
    // 2. 回退到基于元素类型的判断（兼容没有元数据的旧元素）
    if (!element._metadata) {
      console.log(`⚠️ 元素 ${element.id} 没有元数据，使用回退分析方法`);
      
      if (elementType === 'text') {
        // 从样式配置反推文本类型
        if (element.layout && element.layout.classStyle) {
          const classStyle = element.layout.classStyle;
          // 检查fontSize来判断是否为标题
          if (classStyle.fontSize) {
            if (typeof classStyle.fontSize === 'string' && classStyle.fontSize.includes('xxxl')) {
              variant = 'h1';
            } else if (typeof classStyle.fontSize === 'string' && classStyle.fontSize.includes('xxl')) {
              variant = 'h2';
            } else if (typeof classStyle.fontSize === 'string' && classStyle.fontSize.includes('xl')) {
              variant = 'h3';
            } else if (typeof classStyle.fontSize === 'string' && classStyle.fontSize.includes('large')) {
              variant = 'h4';
            }
          }
        }
        
        // 尝试从content获取示例文本
        if (element.font && element.font.fontsize && element.font.fontsize.default) {
          const content = element.font.fontsize.default.content || '';
          // 移除HTML标签来获取纯文本示例
          sampleContent = content.replace(/<[^>]*>/g, '').slice(0, 20);
        }
      } else if (elementType === 'button') {
        // 根据按钮文本判断形态
        if (element.font && element.font.fontsize && element.font.fontsize.default) {
          const buttonText = element.font.fontsize.default.content || '';
          sampleContent = buttonText;
          if (buttonText.includes('确认') || buttonText.includes('提交')) {
            variant = 'primary';
          } else if (buttonText.includes('取消') || buttonText.includes('重置')) {
            variant = 'secondary';
          }
        }
      } else if (elementType === 'background') {
        elementType = 'image'; // 统一为image类型
        variant = 'normal';
        sampleContent = '图片';
      } else if (elementType === 'layout') {
        // 🔧 关键修复：根据深度确定layout的变体
        variant = depth === 0 ? 'root' : 'column';
        sampleContent = depth === 0 ? '根布局' : '列布局';
      } else if (elementType === 'table') {
        variant = 'container';
        sampleContent = '表格';
      } else if (elementType === 'code') {
        // code元素实际对应styleConfig中的text.codeBlock
        elementType = 'text';
        variant = 'codeBlock';
        sampleContent = '代码块';
      } else if (elementType === 'chart') {
        variant = element.chartType || 'line';
        sampleContent = `图表(${variant})`;
      } else if (elementType === 'math') {
        variant = 'display';
        sampleContent = '数学公式';
      } else if (elementType === 'list') {
        variant = 'unordered';
        sampleContent = '列表';
      }
    }
    
    // 🆕 Layout专门分析：识别所有有子元素的layout，但排除根布局和template类型布局
    if (elementType === 'layout' && element.layout && element.layout.children) {
      const childrenCount = element.layout.children.length;
      
      // 🔧 修复：排除根布局、template类型布局（如card:custom），只识别有多个子元素的可调控布局
      const isTemplateLayout = element._metadata?.isTemplateCard || 
                               element._metadata?.isTemplateTag || 
                               element._metadata?.isCard ||
                               element._metadata?.actualType === 'templateTag' ||
                               element._metadata?.actualType === 'card';
      
      if (childrenCount > 1 && variant !== 'root' && !isTemplateLayout) {
        // 🆕 为layout分配唯一索引
        const layoutIndex = layoutIndexCounter++;
        
        // 提取layout的内容信息用于显示
        const layoutContent = extractLayoutContent(element, parentContent);
        
        // 🔧 改进：正确识别布局方向，优先从元数据获取
        let actualLayoutDirection = 'VERTICAL'; // 默认垂直
        if (element._metadata?.originalVariant === 'row' || variant === 'row') {
          actualLayoutDirection = 'HORIZONTAL';
        } else if (element.layout.style?.layoutMode) {
          actualLayoutDirection = element.layout.style.layoutMode;
        }
        
        const layoutInfo = {
          index: layoutIndex, // 🆕 使用索引作为唯一标识
          id: element.id, // 保留ID用于调试显示
          variant: variant,
          childrenCount: childrenCount,
          path: path,
          depth: depth,
          isRoot: false, // 根布局已被排除，这里总是false
          layoutDirection: actualLayoutDirection,
          content: layoutContent,
          element: element // 保存元素引用以便后续修改
        };
        
        layoutAnalysis.push(layoutInfo);
        
        console.log(`🏗️ 识别可调控Layout: 索引=${layoutIndex}, ID=${element.id}, 变体=${variant}, 子元素=${childrenCount}, 深度=${depth}`);
        console.log(`   📋 内容预览: ${layoutContent.preview}`);
      } else if (variant === 'root') {
        console.log(`🚫 跳过根布局: ID=${element.id}, 深度=${depth} (根布局不可调控)`);
      } else if (isTemplateLayout) {
        console.log(`🚫 跳过template布局: ID=${element.id}, 深度=${depth}, 类型=${element._metadata?.actualType || 'unknown'} (template布局不可调控)`);
      }
    }
    
    const key = `${elementType}.${variant}`;
    
    // 🔧 调试信息：显示layout层级识别结果
    if (elementType === 'layout') {
      console.log(`🔍 识别到Layout元素 ID:${element.id}, 层级:${variant}, 深度:${depth}, 路径:${path}`);
    }
    
    if (!elementMap.has(key)) {
      elementMap.set(key, {
        type: elementType,
        variant: variant,
        count: 0,
        elements: [],
        sampleContent: ''
      });
    }
    
    const elementInfo = elementMap.get(key);
    elementInfo.count++;
    elementInfo.elements.push({
      id: element.id,
      element: element, // 保存元素引用
      path: path
    });
    
    // 🔧 新增：表格元素的特殊处理 - 将子元素也识别为独立的页面元件
    if (elementType === 'table' && variant === 'container') {
      console.log(`🔍 表格元素特殊处理: 识别子元素为独立页面元件`);
      
      // 检查表格子元素配置是否存在
      const subElementTypes = ['th', 'td', 'tr'];
      subElementTypes.forEach(subType => {
        if (element.layout && element.layout[subType]) {
          const subKey = `table.${subType}`;
          
          if (!elementMap.has(subKey)) {
            elementMap.set(subKey, {
              type: 'table',
              variant: subType,
              count: 0,
              elements: [],
              sampleContent: `表格${subType}`
            });
          }
          
          const subElementInfo = elementMap.get(subKey);
          subElementInfo.count++;
          subElementInfo.elements.push({
            id: `${element.id}-${subType}`, // 创建虚拟ID
            element: element, // 指向父表格元素
            path: `${path}.${subType}`,
            subElementType: subType // 标记这是子元素
          });
          
          console.log(`   ✅ 识别到 table.${subType} 子元件`);
        }
      });
    }
    
    // 🔧 新增：图表元素的特殊处理 - 将子元素也识别为独立的页面元件
    if (elementType === 'chart' && variant === 'container') {
      console.log(`🔍 图表元素特殊处理: 识别子元素为独立页面元件`);
      
      // 检查图表子元素配置是否存在
      const subElementTypes = ['title', 'legend', 'axis'];
      subElementTypes.forEach(subType => {
        if (element.layout && element.layout[subType]) {
          const subKey = `chart.${subType}`;
          
          if (!elementMap.has(subKey)) {
            elementMap.set(subKey, {
              type: 'chart',
              variant: subType,
              count: 0,
              elements: [],
              sampleContent: `图表${subType}`
            });
          }
          
          const subElementInfo = elementMap.get(subKey);
          subElementInfo.count++;
          subElementInfo.elements.push({
            id: `${element.id}-${subType}`, // 创建虚拟ID
            element: element, // 指向父图表元素
            path: `${path}.${subType}`,
            subElementType: subType // 标记这是子元素
          });
          
          console.log(`   ✅ 识别到 chart.${subType} 子元件`);
        }
      });
    }
    
    // 设置示例内容
    if (!elementInfo.sampleContent) {
      if (sampleContent) {
        elementInfo.sampleContent = sampleContent.length > 20 ? sampleContent.slice(0, 20) + '...' : sampleContent;
      } else if (element.font && element.font.fontsize && element.font.fontsize.default) {
        const content = element.font.fontsize.default.content || '';
        // 移除HTML标签来获取纯文本示例
        const cleanContent = content.replace(/<[^>]*>/g, '');
        elementInfo.sampleContent = cleanContent.slice(0, 20) + (cleanContent.length > 20 ? '...' : '');
      } else if (element.rawData) {
        elementInfo.sampleContent = element.rawData.slice(0, 20) + (element.rawData.length > 20 ? '...' : '');
      }
    }
    
    // 递归分析子元素，传递当前元素的内容信息
    if (element.layout && element.layout.children && element.layout.children.length > 0) {
      const currentContent = extractLayoutContent(element);
      element.layout.children.forEach((child, index) => {
        analyzeElement(child, `${path}/${index}`, depth + 1, currentContent.full);
      });
    }
  };
  
  // 🆕 Layout内容提取函数
  const extractLayoutContent = (layoutElement, parentContent = '') => {
    const children = layoutElement.layout?.children || [];
    let contentItems = [];
    let itemTypes = []; // 新增：存储每个子元素的类型信息
    
    // 遍历子元素，提取内容信息和类型信息
    children.forEach((child, index) => {
      let itemContent = '';
      let itemType = child.name;
      let itemVariant = 'p';
      
      // 使用元数据确定实际类型和形态
      if (child._metadata) {
        const metadata = child._metadata;
        itemType = metadata.actualType || child.name;
        itemVariant = metadata.variant || 'p';
        
        // 对于layout元素，特别处理
        if (itemType === 'layout' && metadata.isRoot !== undefined) {
          itemVariant = metadata.isRoot ? 'root' : 'column';
        }
      } else {
        // 回退到基于名称的判断
        if (itemType === 'background') {
          itemType = 'image';
        } else if (itemType === 'code') {
          itemType = 'text';
          itemVariant = 'codeBlock';
        } else if (itemType === 'layout') {
          itemVariant = 'column'; // 默认为column
        }
      }
      
      // 先生成内容预览
      if (child.name === 'text' && child.font?.fontsize?.default?.content) {
        // 文本元素：提取文本内容
        const content = child.font.fontsize.default.content.replace(/<[^>]*>/g, '').trim();
        if (content) {
          itemContent = content.slice(0, 30) + (content.length > 30 ? '...' : '');
        }
      } else if (child.name === 'button' && child.font?.fontsize?.default?.content) {
        // 按钮元素：提取按钮文本
        const buttonText = child.font.fontsize.default.content;
        itemContent = `[${buttonText}]`;
      } else if (child.name === 'background' || child.name === 'image') {
        // 图片元素
        itemContent = '[图片]';
      } else if (child.name === 'table') {
        // 表格元素
        itemContent = '[表格]';
      } else if (child.name === 'chart') {
        // 图表元素
        itemContent = `[图表:${child.chartType || 'unknown'}]`;
      } else if (child.name === 'code') {
        // 代码元素
        itemContent = `[代码:${child.language || 'unknown'}]`;
      } else if (child.name === 'layout') {
        // 嵌套布局：递归提取
        const nestedContent = extractLayoutContent(child);
        itemContent = `{${nestedContent.preview}}`;
      } else {
        // 其他元素类型
        itemContent = `[${child.name || 'unknown'}]`;
      }
      
      // 现在有了内容后，再添加类型信息到itemTypes数组
      const itemInfo = {
        type: itemType,
        variant: itemVariant,
        content: itemContent || `[${itemType}]` // 添加内容字段
      };
      
      // 🆕 如果是layout类型，添加第一个子元素的类型信息
      if (itemType === 'layout' && child.layout?.children?.length > 0) {
        const firstChild = child.layout.children[0];
        if (firstChild && firstChild.name) {
          let firstElementType = firstChild.name;
          let firstElementVariant = 'p';
          
          // 使用元数据确定第一个子元素的实际类型
          if (firstChild._metadata) {
            const metadata = firstChild._metadata;
            firstElementType = metadata.actualType || firstChild.name;
            firstElementVariant = metadata.variant || 'p';
          } else {
            // 回退到基于名称的判断
            if (firstElementType === 'background') {
              firstElementType = 'image';
            } else if (firstElementType === 'code') {
              firstElementType = 'text';
              firstElementVariant = 'codeBlock';
            }
          }
          
          itemInfo.firstElementType = firstElementType;
          itemInfo.firstElementVariant = firstElementVariant;
        }
      }
      
      itemTypes.push(itemInfo);
      
      if (itemContent) {
        contentItems.push(itemContent);
      }
    });
    
    const preview = contentItems.slice(0, 3).join(', ') + (contentItems.length > 3 ? `... (+${contentItems.length - 3}项)` : '');
    const full = contentItems.join(', ');
    
    return {
      preview: preview || '[空布局]',
      full: full || '[空布局]',
      items: itemTypes, // 现在返回类型信息数组而不是内容字符串数组
      childrenCount: children.length
    };
  };
  
  // 先分析根布局本身
  analyzeElement(eightElement, 'root', 0); // 根布局本身是depth=0
  
  // 然后分析根布局的子元素
  if (eightElement.layout.children) {
    eightElement.layout.children.forEach((child, index) => {
      analyzeElement(child, `root/${index}`, 1); // 根布局的子元素从depth=1开始
    });
  }
  
  const result = Array.from(elementMap.values());
  console.log('📊 八要素中的元件分析结果:', result);
  console.log('🏗️ 可调控的Layout数量:', layoutAnalysis.length);
  
  // 🆕 返回结果中包含layout分析
  result.layoutAnalysis = layoutAnalysis;
  
  return result;
}
/**
 * 将动作系统的执行结果应用到八要素结构上
 * @param {Object} eightElement - 八要素结构对象 
 * @param {Array} pageElements - 页面元件列表
 * @param {Object} actionManager - 动作系统管理器
 * @param {Array} selectedActions - 选中的动作列表
 * @param {Object} actionIntensities - 动作强度映射
 * @returns {Object} 应用了动作结果的八要素结构
 */
export function applyActionsToEightElement(eightElement, pageElements, actionManager, selectedActions, actionIntensities) {
  if (!eightElement || !actionManager || !selectedActions.length || !pageElements.length) {
    return eightElement;
  }

  console.log(`🎯 开始将动作应用到八要素结构上`);
  console.log(`页面包含 ${pageElements.length} 种元件类型，选择了 ${selectedActions.length} 个动作`);

  // 深拷贝八要素结构以避免修改原对象
  const updatedEightElement = JSON.parse(JSON.stringify(eightElement));
  
  // 为每种元件类型执行动作并收集结果
  const elementStyleUpdates = new Map();
  
  console.log(`\n🎬 开始批量动作执行 - 目标: ${pageElements.length} 种元件类型`);
  console.log(`📋 选中的动作: ${selectedActions.join(', ')}`);
  
  for (const pageElement of pageElements) {
    const { type, variant, elements } = pageElement;
    
    try {     
      // 重置特定元件的环境
      actionManager.resetEnvironment(type, variant);
      
      // 批量执行动作
      const actionList = selectedActions.map(actionName => ({
        name: actionName,
        intensity: actionIntensities[actionName] || 0.5
      }));
      
      console.log(`🎯 执行动作列表:`);
      actionList.forEach(action => {
        const actionInfo = actionManager.getActionInfo(action.name);
        console.log(`   • ${actionInfo?.name || action.name}: 强度 ${action.intensity.toFixed(1)}`);
        console.log(`   • 预期修改属性: ${Object.keys(actionInfo?.styleMapping || {}).join(', ')}`);
      });
      
      const result = actionManager.executeActions(actionList, type, variant);
      
      if (result.success && result.styles) {   
        console.log(`🔍 ${type}.${variant} 动作执行原始结果:`, Object.keys(result.styles));
        console.log(`📊 原始结果样本:`, JSON.stringify(result.styles, null, 2).slice(0, 500) + '...');
        elementStyleUpdates.set(`${type}.${variant}`, result.styles);
      } else {
        console.warn(`⚠️ ${type}.${variant} 动作执行失败:`, result.error);
      }
    } catch (error) {
      console.error(`❌ ${type}.${variant} 动作执行出错:`, error);
    }
  }
  
  // 将样式更新应用到具体的元素实例上
  let updatedCount = 0;
  let updatedElementsCount = 0;
  
    const applyStylesToElement = (element, elementType, variant, updates) => {
    if (!element || !updates) return;
    
    // 确保元素有layout结构
    if (!element.layout) element.layout = {};
    if (!element.layout.classStyle) element.layout.classStyle = {};
    if (!element.layout.style) element.layout.style = {};
    
    const originalValues = {};
    const appliedChanges = [];
    
    // 🔧 新增：过滤出真正的CSS样式属性，排除元数据
    const cssProperties = {};
    const filteredOut = [];
        
    Object.entries(updates).forEach(([property, value]) => {
      // 排除以下划线开头的元数据属性和特殊字段
      if (!property.startsWith('_') && 
          !['elementType', 'variant', 'configFound'].includes(property) &&
          value !== undefined && value !== null) {
        cssProperties[property] = value;
      } else {
        filteredOut.push(`${property}: ${value}`);
      }
    });
        
    // 记录原始值并应用样式更新 - 同时更新classStyle和style
    Object.entries(cssProperties).forEach(([property, value]) => {
      // 记录原始值（优先从classStyle获取）
      originalValues[property] = element.layout.classStyle[property] || element.layout.style[property];
      
      // 🔧 关键改进：同时更新classStyle和style，确保动作在任何配置下都生效
      element.layout.classStyle[property] = value;
      element.layout.style[property] = value;
      
      // 🔧 新增：table.container 特殊处理 - 应用到 layout.table.style
      if (elementType === 'table' && variant === 'container') {
        if (!element.layout.table) element.layout.table = {};
        if (!element.layout.table.style) element.layout.table.style = {};
        element.layout.table.style[property] = value;
      }
      
      updatedCount++;
      
      appliedChanges.push({
        property,
        oldValue: originalValues[property],
        newValue: value
      });
    });
    
    if (appliedChanges.length > 0) {
      updatedElementsCount++;
    }
  };
  
  // 递归查找并更新匹配的元素
  const findAndUpdateElements = (element, path = '', depth = 0) => {
    if (!element || !element.name) return;
    
    // 🔍 使用与analyzeElementsInEightElement相同的逻辑确定元素类型和形态
    let elementType = element.name;
    let variant = 'normal';
    
    // 1. 优先使用元数据
    if (element._metadata) {
      const metadata = element._metadata;
      elementType = metadata.actualType || element.name;
      variant = metadata.variant || 'normal';
      
      // 🔧 对于layout元素，优先使用 variant，只有在没有 variant 时才使用 isRoot 标志
      if (elementType === 'layout' && !metadata.variant && metadata.isRoot !== undefined) {
        variant = metadata.isRoot ? 'root' : 'column';
      }
    }
    // 2. 回退到传统判断方法
    else {
      if (elementType === 'text') {
        // 从样式配置反推文本类型
        if (element.layout && element.layout.classStyle) {
          const classStyle = element.layout.classStyle;
          if (classStyle.fontSize) {
            if (typeof classStyle.fontSize === 'string' && classStyle.fontSize.includes('xxxl')) {
              variant = 'h1';
            } else if (typeof classStyle.fontSize === 'string' && classStyle.fontSize.includes('xxl')) {
              variant = 'h2';
            } else if (typeof classStyle.fontSize === 'string' && classStyle.fontSize.includes('xl')) {
              variant = 'h3';
            } else if (typeof classStyle.fontSize === 'string' && classStyle.fontSize.includes('large')) {
              variant = 'h4';
            }
          }
        }
      } else if (elementType === 'button') {
        if (element.font && element.font.fontsize && element.font.fontsize.default) {
          const buttonText = element.font.fontsize.default.content || '';
          if (buttonText.includes('确认') || buttonText.includes('提交')) variant = 'primary';
          else if (buttonText.includes('取消') || buttonText.includes('重置')) variant = 'secondary';
        }
      } else if (elementType === 'background') {
        elementType = 'image';
        variant = 'normal';
      } else if (elementType === 'layout') {
        // 🔧 关键修复：优先使用元数据确定layout的变体，回退到深度判断
        if (element._metadata && element._metadata.variant) {
          variant = element._metadata.variant;
        } else {
          variant = depth === 0 ? 'root' : 'column';
        }
      } else if (elementType === 'table') {
        variant = 'container';
      } else if (elementType === 'code') {
        // code元素实际对应styleConfig中的text.codeBlock
        elementType = 'text';
        variant = 'codeBlock';
      } else if (elementType === 'chart') {
        variant = element.chartType || 'line';
      } else if (elementType === 'math') {
        variant = 'display';
      } else if (elementType === 'list') {
        variant = 'unordered';
      }
    }
        
    // 检查是否有对应的样式更新
    const updateKey = `${elementType}.${variant}`;
    const styleUpdates = elementStyleUpdates.get(updateKey);
    
    if (styleUpdates) {
      applyStylesToElement(element, elementType, variant, styleUpdates);
    }
    
    // 🔧 新增：表格子元素的特殊处理 - 直接应用到表格子元素
    if (elementType === 'table' && variant === 'container') {
      
      const subElementTypes = ['th', 'td', 'tr'];
      subElementTypes.forEach(subType => {
        const subUpdateKey = `table.${subType}`;
        const subStyleUpdates = elementStyleUpdates.get(subUpdateKey);
        
        if (subStyleUpdates && element.layout && element.layout[subType]) {
     
          // 创建一个特殊的应用函数，直接应用到子元素配置
          const applySubElementStyles = (subType, updates) => {
            // 过滤CSS属性
            const cssProperties = {};
            Object.entries(updates).forEach(([property, value]) => {
              if (!property.startsWith('_') && 
                  !['elementType', 'variant', 'configFound'].includes(property) &&
                  value !== undefined && value !== null) {
                cssProperties[property] = value;
              }
            });
                        
            // 确保子元素结构存在
            if (!element.layout[subType]) element.layout[subType] = {};
            if (subType === 'tr') {
              if (!element.layout[subType].classStyle) element.layout[subType].classStyle = {};
            } else {
              if (!element.layout[subType].style) element.layout[subType].style = {};
            }
            
            // 🔧 转换扁平格式为嵌套格式的函数
            const convertFlatToNested = (flatStyles) => {
              const nestedStyles = {};
              
              Object.entries(flatStyles).forEach(([property, value]) => {
                // 检查是否是伪类嵌套属性（如 &:hover.backgroundColor）
                if (property.includes('&:') && property.includes('.')) {
                  const [pseudoClass, nestedProperty] = property.split('.');
                  
                  // 创建嵌套结构
                  if (!nestedStyles[pseudoClass]) {
                    nestedStyles[pseudoClass] = {};
                  }
                  nestedStyles[pseudoClass][nestedProperty] = value;
                  
                } else {
                  // 普通属性直接复制
                  nestedStyles[property] = value;
                }
              });
              
              return nestedStyles;
            };
            
            // 应用样式到对应的子元素配置
            if (subType === 'tr') {
              // 🔧 对 tr 使用嵌套格式转换
              const nestedStyles = convertFlatToNested(cssProperties);
              element.layout[subType].classStyle = nestedStyles;
            } else {
              // 其他子元素使用原有逻辑
              Object.entries(cssProperties).forEach(([property, value]) => {
                element.layout[subType].style[property] = value;
              });
            }
          };
          
          applySubElementStyles(subType, subStyleUpdates);
        }
      });
    }
    
    // 🔧 新增：图表子元素的特殊处理 - 直接应用到图表子元素
    if (elementType === 'chart' && variant === 'container') {
      
      const subElementTypes = ['title', 'legend', 'axis'];
      subElementTypes.forEach(subType => {
        const subUpdateKey = `chart.${subType}`;
        const subStyleUpdates = elementStyleUpdates.get(subUpdateKey);
        
        if (subStyleUpdates && element.layout && element.layout[subType]) {          
          // 创建一个特殊的应用函数，直接应用到子元素配置
          const applySubElementStyles = (subType, updates) => {
            // 过滤CSS属性
            const cssProperties = {};
            Object.entries(updates).forEach(([property, value]) => {
              if (!property.startsWith('_') && 
                  !['elementType', 'variant', 'configFound'].includes(property) &&
                  value !== undefined && value !== null) {
                cssProperties[property] = value;
              }
            });
                        
            // 确保子元素结构存在
            if (!element.layout[subType]) element.layout[subType] = {};
            if (!element.layout[subType].classStyle) element.layout[subType].classStyle = {};
            
            // 应用样式到对应的子元素配置
            Object.entries(cssProperties).forEach(([property, value]) => {
              element.layout[subType].classStyle[property] = value;
            });
          };
          
          applySubElementStyles(subType, subStyleUpdates);
        }
      });
    }
    
    // 递归处理子元素
    if (element.layout && element.layout.children && element.layout.children.length > 0) {
      element.layout.children.forEach((child, index) => {
        findAndUpdateElements(child, `${path}/${index}`, depth + 1);
      });
    }
  };
  
  // 先处理根布局本身
  findAndUpdateElements(updatedEightElement, 'root', 0); // 根布局本身是depth=0
  
  // 然后处理根布局的子元素
  if (updatedEightElement.layout.children) {
    updatedEightElement.layout.children.forEach((child, index) => {
      findAndUpdateElements(child, `root/${index}`, 1); // 根布局的子元素从depth=1开始
    });
  }
  
  console.log(`\n🎨 八要素动作应用完成！`);
  console.log(`   📊 统计信息:`);
  console.log(`      • 更新的八要素实例: ${updatedElementsCount} 个`);
  console.log(`      • 更新的样式属性总数: ${updatedCount} 个`);
  console.log(`      • 成功处理的元件类型: ${elementStyleUpdates.size} 种`);
  
  if (updatedElementsCount > 0) {
    console.log(`   🔄 所有token变化已应用到八要素结构的 layout.classStyle 中`);
    console.log(`   ✅ 更新后的八要素结构已准备好进行HTML渲染`);
  } else {
    console.log(`   ⚪ 没有八要素实例被更新，可能是因为:`);
    console.log(`      - 动作不适用于当前页面的元件类型`);
    console.log(`      - 元件配置中缺少相应的token设置`);
    console.log(`      - 动作执行过程中出现错误`);
  }
  
  return updatedEightElement;
}

/**
 * 应用布局调控到八要素结构
 * @param {Object} eightElement - 八要素结构对象
 * @param {Array} layoutControls - 布局调控列表 [{layoutIndex, intensity}, ...]
 * @param {Array} layoutAnalysis - 布局分析结果，包含索引到layout的映射
 * @returns {Object} 应用了布局调控的八要素结构
 */
export function applyLayoutControlsToEightElement(eightElement, layoutControls, layoutAnalysis = null) {
  if (!eightElement || !layoutControls || layoutControls.length === 0) {
    return eightElement;
  }

  console.log(`🏗️ 开始应用基于索引的布局调控`);
  console.log(`   📊 调控项数量: ${layoutControls.length}`);
  console.log(`   🎯 调控目标:`);
  layoutControls.forEach(control => {
    console.log(`      Layout 索引: ${control.layoutIndex}, 强度: ${control.intensity.toFixed(2)}`);
  });

  // 深拷贝八要素结构以避免修改原对象
  const updatedEightElement = JSON.parse(JSON.stringify(eightElement));
  
  // 🔧 修复关键问题：必须重新分析深拷贝后的八要素结构来建立索引映射
  // 不能使用传入的layoutAnalysis，因为它指向原始结构，不是深拷贝后的结构
  console.log(`   🔍 重新分析深拷贝后的八要素结构获取layout索引映射`);
  let indexToLayoutMap = new Map();
  let layoutIndexCounter = 0;
  
  const buildIndexMap = (element, depth = 0) => {
    if (!element || !element.name) return;
    
    if (element.name === 'layout' && element.layout && element.layout.children) {
      const childrenCount = element.layout.children.length;
      const isRoot = depth === 0;
      
      // 🔧 修复：排除根布局和template类型布局，只映射可调控的布局
      const isTemplateLayout = element._metadata?.isTemplateCard || 
                               element._metadata?.isTemplateTag || 
                               element._metadata?.isCard ||
                               element._metadata?.actualType === 'templateTag' ||
                               element._metadata?.actualType === 'card';
      
      if (childrenCount > 1 && !isRoot && !isTemplateLayout) {
        const layoutIndex = layoutIndexCounter++;
        indexToLayoutMap.set(layoutIndex, element);
        console.log(`     📍 索引 ${layoutIndex} → Layout ID ${element.id} (layout)`);
      } else if (isRoot) {
        console.log(`     🚫 跳过根布局: ID=${element.id} (根布局不可调控)`);
      } else if (isTemplateLayout) {
        console.log(`     🚫 跳过template布局: ID=${element.id}, 类型=${element._metadata?.actualType || 'unknown'} (template布局不可调控)`);
      }
    }
    
    // 递归处理子元素
    if (element.layout && element.layout.children) {
      element.layout.children.forEach(child => {
        buildIndexMap(child, depth + 1);
      });
    }
  };
  
  buildIndexMap(updatedEightElement, 0);
  console.log(`   📋 重新分析完成，映射了 ${indexToLayoutMap.size} 个layout`);
    
  // 创建基于索引的布局调控映射
  const controlsMap = new Map();
  layoutControls.forEach(control => {
    controlsMap.set(control.layoutIndex, control.intensity);
    
    // 根据强度确定目标variant
    const targetVariant = control.intensity <= 0.5 ? 'column' : 'row';
    const direction = control.intensity <= 0.5 ? 'VERTICAL' : 'HORIZONTAL';
    
    console.log(`   🎯 布局调控: 索引=${control.layoutIndex}, 强度=${control.intensity.toFixed(2)}, 目标=${targetVariant}`);
  });

  // 直接应用布局调控，不需要递归查找
  let updatedLayoutsCount = 0;
  
  // 🆕 直接通过索引映射更新layout元素
  controlsMap.forEach((intensity, layoutIndex) => {
    const element = indexToLayoutMap.get(layoutIndex);
    
    if (!element) {
      console.warn(`⚠️ 警告: 索引 ${layoutIndex} 对应的layout元素不存在`);
      return;
    }
       
    const targetVariant = intensity <= 0.5 ? 'column' : 'row';
    const targetDirection = intensity <= 0.5 ? 'VERTICAL' : 'HORIZONTAL';
    
    // 获取当前layout信息
    const currentDirection = element.layout?.style?.layoutMode || 'VERTICAL';
       
    // 🔧 修复：先清理可能冲突的布局属性，然后同时更新style和classStyle
    if (element.layout) {

           
      // 🔧 不清理 primaryAxisAlignItems 和 counterAxisAlignItems，因为它们可能包含板式重心动作的设置
        
      // 🔧 保留板式重心动作设置的对齐方式
      // 检查是否已有板式重心动作设置的对齐方式
      const hasExistingJustifyContent = element.layout.style?.justifyContent || element.layout.classStyle?.justifyContent;
      const hasExistingAlignItems = element.layout.style?.alignItems || element.layout.classStyle?.alignItems;
        
      // 🔧 根据布局方向和现有的板式重心动作设置计算新的对齐方式
      let newPrimaryAxisAlignItems, newCounterAxisAlignItems;
      
      if (targetDirection === 'HORIZONTAL') {
        // 水平布局：主轴对应justifyContent，交叉轴对应alignItems
        // 如果从 column 变为 row，需要交换对齐设置
        if (currentDirection && currentDirection.includes('VERTICAL')) {
          // 从垂直变为水平：alignItems(左右对齐) → justifyContent(左右对齐)
          newPrimaryAxisAlignItems = hasExistingAlignItems || 'center';
          newCounterAxisAlignItems = hasExistingJustifyContent || 'center';
        } else {
          // 本来就是水平或新建：保持现有设置
          newPrimaryAxisAlignItems = hasExistingJustifyContent || 'center';
          newCounterAxisAlignItems = hasExistingAlignItems || 'center';
        }
      } else {
        // 垂直布局：主轴对应alignItems，交叉轴对应justifyContent
        // 如果从 row 变为 column，需要交换对齐设置
        if (currentDirection && currentDirection.includes('HORIZONTAL')) {
          // 从水平变为垂直：justifyContent(左右对齐) → alignItems(左右对齐)
          newPrimaryAxisAlignItems = hasExistingJustifyContent || 'flex-start';
          newCounterAxisAlignItems = hasExistingAlignItems || 'flex-start';
        } else {
          // 本来就是垂直或新建：保持现有设置
          newPrimaryAxisAlignItems = hasExistingAlignItems || 'flex-start';
          newCounterAxisAlignItems = hasExistingJustifyContent || 'flex-start';
        }
      }
      
      // 🔧 重要：布局调控不应该干预板式重心动作设置
      // 布局调控只负责方向转换，板式重心动作的对齐设置由板式重心动作本身负责
      // 🔧 同时更新layout.style和layout.classStyle
      if (element.layout.style) {
        element.layout.style.layoutMode = targetDirection;
      }
      
      if (element.layout.classStyle) {
        element.layout.classStyle.layoutMode = targetDirection;
      }
    }
  
    // 🔧 更新元数据，保存调控信息
    if (element._metadata) {
      element._metadata.variant = targetVariant;
      element._metadata.controlledLayoutMode = targetDirection; // 🆕 保存被调控的布局方向
      element._metadata.appliedLayoutControl = {
        layoutIndex: layoutIndex,
        intensity: intensity,
        targetVariant: targetVariant,
        targetDirection: targetDirection,
        timestamp: Date.now()
      };
    } else {
      // 如果没有元数据，创建一个
      element._metadata = {
        actualType: 'layout',
        variant: targetVariant,
        controlledLayoutMode: targetDirection,
        appliedLayoutControl: {
          layoutIndex: layoutIndex,
          intensity: intensity,
          targetVariant: targetVariant,
          targetDirection: targetDirection,
          timestamp: Date.now()
        }
      };
    }
    
    // 🔧 修复：先保存重要的调控设置，然后应用样式配置，最后恢复调控设置
    // 获取当前设置的对齐方式
    const currentPrimaryAxisAlignItems = element.layout.style?.primaryAxisAlignItems || element.layout.classStyle?.primaryAxisAlignItems;
    const currentCounterAxisAlignItems = element.layout.style?.counterAxisAlignItems || element.layout.classStyle?.counterAxisAlignItems;
    
    const importantSettings = {
      layoutMode: targetDirection,
    };
    
    // 🔧 修复：同时更新样式配置到style和classStyle（但不包括会被覆盖的关键设置）
    try {
      const newStyleConfig = getElementStyleConfig('layout', targetVariant);
      if (newStyleConfig) {
        // 合并新的样式配置，但排除会覆盖调控设置和板式重心动作的属性
        Object.entries(newStyleConfig).forEach(([key, value]) => {
          if (value !== undefined && value !== null && 
              !['layoutMode', 'primaryAxisAlignItems', 'counterAxisAlignItems', 'justifyContent', 'alignItems'].includes(key)) {
            
            // 🔧 关键修复：同时更新classStyle和style
            if (element.layout.classStyle) {
              element.layout.classStyle[key] = value;
            }
            if (element.layout.style) {
              element.layout.style[key] = value;
            }
          }
        });
      }
    } catch (error) {
      console.warn(`⚠️ 获取Layout样式配置失败 (${targetVariant}):`, error);
    }
    
    // 🔧 关键修复：只确保布局调控设置不被样式配置覆盖
    // 板式重心动作的设置由板式重心动作本身负责，布局调控不干预
    
    if (element.layout.style) {
      element.layout.style.layoutMode = importantSettings.layoutMode;
    }
    
    if (element.layout.classStyle) {
      element.layout.classStyle.layoutMode = importantSettings.layoutMode;
    }
        
    updatedLayoutsCount++;

  });
    
  return updatedEightElement;
}

// 命名导出
export {
  markdownToEightElement,
  parseMarkdown,
  createTextElement,
  createButtonElement,
  createBackgroundElement,
  createLayoutElement,
  createVerticalButtonLayout,  // 导出垂直按钮布局函数
  createHorizontalButtonLayout,
  createHeadingLayout,
  createFlexWrapLayout,
  createHeadingBlockContainer,
  createTableElement,
  createCodeElement,
  createChartElement,
  parseButtonVariant,   // 导出按钮类型标记解析函数
  isMarkdownTable,
  isMarkdownCodeBlock,
  isTableOrChartData,   // 导出表格/图表检测函数
  extractTableOrChartData, // 导出表格/图表提取函数
  isQuoteText,          // 导出引用文本检测函数
  extractQuoteBlock,    // 导出引用文本提取函数
  isLayoutTag,          // 导出布局标签检测函数
  extractLayoutBlock,   // 导出布局标签提取函数
  generateChartSvg,
  printEightElementStructure,
  exampleMarkdownToEightElement,
  // applyLayoutControlsToEightElement 已在函数定义时导出，无需重复导出
  LAYOUT_CONSTANTS,
  COLOR_CONSTANTS,
  DIMENSION_CONSTANTS,
  FONT_CONSTANTS
};

/**
 * 通配符模式匹配工具函数
 */

// 检查字符串是否匹配通配符模式
function matchesWildcardPattern(input, pattern) {
  // 如果模式不包含通配符，直接比较
  if (!pattern.includes('*')) {
    return input === pattern;
  }
  
  // 将通配符模式转换为正则表达式
  const regexPattern = pattern
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // 转义特殊字符
    .replace(/\\\*/g, '.*'); // 将 \* 替换为 .*
  
  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(input);
}

// 从输入中提取通配符匹配的部分
function extractWildcardMatch(input, pattern) {
  if (!pattern.includes('*')) {
    return input === pattern ? '' : null;
  }
  
  // 找到 * 的位置
  const starIndex = pattern.indexOf('*');
  const prefix = pattern.substring(0, starIndex);
  const suffix = pattern.substring(starIndex + 1);
  
  // 检查输入是否以指定前缀开头、后缀结尾
  if (input.startsWith(prefix) && input.endsWith(suffix)) {
    // 提取中间的匹配部分
    const matchPart = input.substring(prefix.length, input.length - suffix.length);
    return matchPart;
  }
  
  return null;
}

// 在 markdownMapping 中查找通配符匹配
function findWildcardMatch(input, markdownMapping) {
  // 首先检查精确匹配
  if (markdownMapping[input]) {
    return {
      matched: true,
      templatePath: markdownMapping[input],
      matchedValue: input,
      wildcard: null
    };
  }
  
  // 然后检查通配符匹配
  for (const [pattern, templatePath] of Object.entries(markdownMapping)) {
    if (pattern.includes('*')) {
      const wildcardMatch = extractWildcardMatch(input, pattern);
      
      if (wildcardMatch !== null) {
        return {
          matched: true,
          templatePath: templatePath,
          matchedValue: input,
          wildcard: wildcardMatch,
          pattern: pattern
        };
      }
    }
  }
  
  return { matched: false };
}

// 处理模板路径中的通配符替换
function processTemplatePathWithWildcard(templatePath, wildcardValue) {
  if (!wildcardValue || !templatePath.includes('*')) {
    return templatePath;
  }
  
  return templatePath.replace(/\*/g, wildcardValue);
}
// 🆕 辅助函数：从模板配置中获取图表的 variant
function getChartVariantFromConfig(templatePath, cardStyleConfig) {
  const pathParts = templatePath.split('.');
  let chartVariant = 'normal'; // 默认 variant
  
  // 从配置中获取 variant
  if (pathParts.length >= 2) {
    const parentConfig = cardStyleConfig[pathParts[0]];
    if (parentConfig) {
      // 查找匹配的子配置
      const childTagName = pathParts[pathParts.length - 1];
      for (const [configKey, configValue] of Object.entries(parentConfig)) {
        if (configKey.includes('*')) {
          const wildcardMatch = extractWildcardMatch(childTagName, configKey);
          if (wildcardMatch !== null && configValue.variant) {
            chartVariant = configValue.variant;
            console.log(`🎯 获取到图表 variant: ${chartVariant} (从配置 ${configKey})`);
            break;
          }
        }
      }
    }
  }
  
  return chartVariant;
}
