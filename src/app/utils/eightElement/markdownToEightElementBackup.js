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
  // 导入图标系统
  import { getIcon, renderIcon } from '../icons/index.js';
  
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
  
  

  
  
     


//   // 🆕 应用自定义样式覆盖
//   function applyCustomStyleOverride(baseStyle, customStyles, customVariant) {
//     if (!customStyles) {
//       return baseStyle;
//     }
    
//     // 创建样式副本并应用覆盖
//     const overriddenStyle = { ...baseStyle };
    
//     Object.entries(customStyles).forEach(([property, value]) => {
//         // const resolvedValue = resolveToken(`{${value}}`);
//         overriddenStyle[property] = `{${value}}`;
//     });
    
//     return overriddenStyle;
//   }
  
      
 
    
    
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
  
              
  // 检测markdown表格 - 为了保持兼容性而保留的函数
  function isMarkdownTable(lines) {
    if (lines.length < 2) return false;
  
    // 使用新的检测逻辑
    const { isData, isChart } = isTableOrChartData(lines[0]);
    // 只有当是表格数据且不是图表时返回true
    return isData && !isChart;
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
  

    
  // 处理模板路径中的通配符替换
  function processTemplatePathWithWildcard(templatePath, wildcardValue) {
    if (!wildcardValue || !templatePath.includes('*')) {
      return templatePath;
    }
    
    return templatePath.replace(/\*/g, wildcardValue);
  }
 
 