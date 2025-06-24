'use client';
import React, { useState, useEffect, useRef } from 'react';
import { renderEightElementToHtml } from '../utils/eightElement/renderEightElementHtml';
import { convertEightElementToLayout } from '../utils/layoutAnalysis/eightElementAnalysis';
import { markdownToEightElement } from '../utils/eightElement/markdownToEightElement';

import { RL_ACTIONS, ActionSystemManager, createActionSystemManager, convertActionResultsToTokens } from '../utils/seeds/rl_action_engines';
import { DEFAULT_STYLE_CONFIG } from '../utils/eightElement/styleConfig';
import { analyzeElementsInEightElement, applyActionsToEightElement } from '../utils/eightElement/markdownToEightElement';
import VisualSpaceEvaluator from '../components/VisualSpaceEvaluator';
import collectEightElementMeasurements from '../utils/eightElement/collectElementMeasurements.js';

const EightElementAnalyzer = () => {
  const [markdown, setMarkdown] = useState(`# 八要素测试文档

## 基本元素

### 三级标题
这是一段普通文本，将被转换为text元素。

#### 四级标题
四级标题正文四级标题正文四级标题正文四级标题正文四级标题正文四级标题正文

##### 五级标题
五级标题正文五级标题正文五级标题正文五级标题正文五级标题正文五级标题正文

###### 六级标题
六级标题正文六级标题正文六级标题正文六级标题正文六级标题正文六级标题正文

> 这是一段引用文本，展示重要的观点或引述

### 按钮（超链接）
[确认](https://example.com)
[取消](https://example.com)

### 示例图片
![示例图片](https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg)

### 代码块示例
下面是一个JavaScript代码示例：

\`\`\`javascript
function greeting(name) {
  return \`Hello, \${name}!\`;
}

// 调用函数
const message = greeting('World');
console.log(message);  // 输出: Hello, World!
\`\`\`

### 数学公式示例
行内公式：$E = mc^2$

块级公式：
$$ \\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi} $$

我们还可以有更复杂的公式，例如：
$$ L = \\frac{1}{2} \\rho v^2 S C_L $$

这是一个关于升力的公式。行内也可以混合：例如 $\\alpha + \\beta = \\gamma$。

### 表格示例
下面是一个简单的表格示例：

| 功能 | 描述 | 支持状态 |
| --- | --- | :---: |
| 文本 | 支持普通文本和标题 | ✅ |
| 按钮 | 支持超链接按钮 | ✅ |
| 图片 | 支持图片显示 | ✅ |
| 表格 | 支持表格渲染和样式 | ✅ |
| 代码块 | 支持代码高亮显示 | ✅ |
| 图表 | 支持数据可视化图表 | ✅ |
| 混合内容 | 支持在一行中文本 | ✅ |
| 数学公式 | 支持行内和块级公式 | ✅ |

### 图表示例
下面是一个分组折线图示例：

[chart:grouped_line]| 日期 | 心流满意度FSV | 心流专注值FFV | 心流效能值FEV |
| --- | --- | --- | --- |
| 2025-03-10 | 0.0 | 0.36 | 2.55 |
| 2025-03-11 | 0.0 | 0.41 | 2.22 |
| 2025-03-12 | 0.0 | 0.36 | 2.64 |
| 2025-03-13 | 0.0 | 0.32 | 2.94 |
| 2025-03-14 | 0.0 | 0.48 | 1.87 |
| 2025-03-17 | 0.0 | 0.42 | 2.16 |
| 2025-03-18 | 0.0 | 0.41 | 2.28 |
| 2025-03-19 | 0.0 | 0.31 | 2.97 |
| 2025-03-20 | 0.0 | 0.41 | 2.18 |
| 2025-03-21 | 0.0 | 0.56 | 1.52 |
| 2025-03-24 | 0.0 | 0.34 | 2.67 |
| 2025-03-25 | 0.0 | 0.61 | 1.52 |
| 2025-03-26 | 0.0 | 0.51 | 1.85 |
| 2025-03-27 | 0.0 | 0.29 | 3.25 |
| 2025-03-28 | 0.0 | 0.5 | 1.92 |
| 2025-03-31 | 0.0 | 0.32 | 3.02 |
| 2025-04-01 | 0.0 | 0.35 | 2.74 |
| 2025-04-02 | 0.0 | 0.54 | 1.72 |
| 2025-04-03 | 0.0 | 0.48 | 1.98 |

下面是一个水平柱状图示例：

[chart:barh]| 部门 | 销售额 |
| --- | --- |
| 销售部 | 1250 |
| 市场部 | 980 |
| 技术部 | 750 |
| 客服部 | 620 |
| 行政部 | 450 |

### 指标定义
- **FSV** (FSV = 用户满意度评分 / 每日心流空间交互次数): 衡量美学交互的心流满意度，数值越高表示每次交互带来的用户满意度越高。
- **FFV** (FFV = 每日心流空间服务总时长 / 每日心流空间交互次数): 衡量意图协同的心流专注值，数值越高表示用户在每次互动时保持的专注度越长。
- **FEV** (FEV = 每日心流空间服务总次数 / 每日心流空间总时长): 衡量效能跃迁的心流效能值，数值越高表示服务使用效率越高。

1. **高斯定律（Integral Form）**  
   - 磁场的通量：  
     $$ \\oint \\mathbf{B} \\cdot d\\mathbf{l} = \\frac{Q_{enc}}{\\varepsilon_0} $$

2. **法拉第电磁感应定律（Integral Form）**  
   - 电场的旋度等于变化磁场：  
     $$ \\nabla \\times \\mathbf{E} = -\\frac{\\partial \\mathbf{B}}{\\partial t} $$

3. **安培- Maxwell 恒等式（Integral Form）**  
   - 磁通量的变化：  
     $$ \\oint \\mathbf{B} \\cdot d\\mathbf{l} = \\mu_0 I_{enc} + \\mu_0 \\varepsilon_0 \\frac{\\partial \\Phi_E}{\\partial t} $$

4. **高斯率（Divergence Form）**  
   - 电场的散度等于电荷密度：  
     $$ \\nabla \\cdot \\mathbf{E} = \\rho_{enc} / \\varepsilon_0 $$

5. **高斯率（Ampère 法则）**  
   - 磁感应线的旋度等于电流密度加上变化磁场：  
     $$ \\nabla \\times \\mathbf{B} = \\mu_0 I_{enc} + \\mu_0 \\varepsilon_0 \\frac{\\partial \\mathbf{B}}{\\partial t} $$

6. **高斯率（Divergence Form）**  
   - 位移场的散度等于自由电荷密度：  
     $$ \\nabla \\cdot \\mathbf{D} = \\rho_{free} $$

7. **高斯率（Divergence Form）**  
   - 磁通密度的散度等于变化磁场：  
     $$ \\nabla \\cdot \\mathbf{B} = 0 $$

8. **高斯率（Integral Form）**  
   - 电场的环流量等于包围的净电荷量：  
     $$ \\oint \\mathbf{E} \\cdot d\\mathbf{l} = 4\\pi k_e Q_{enc} $$

`);
  // 动作系统状态
  const [actionManager, setActionManager] = useState(null);
  const [selectedActions, setSelectedActions] = useState([]); // 已选择的动作
  const [actionIntensities, setActionIntensities] = useState({}); // 动作强度
  const [actionInputMode, setActionInputMode] = useState('categories'); // 'categories' 或 'list'
  const [availableActions, setAvailableActions] = useState(Object.keys(RL_ACTIONS));
  
  // 页面元件分析状态
  const [pageElements, setPageElements] = useState([]); // 当前页面包含的所有元件 [{type, variant, count, elements}]
  const [affectedElements, setAffectedElements] = useState([]); // 当前动作会影响的元件列表
  const [isElementsCollapsed, setIsElementsCollapsed] = useState(false); // 页面元件分析折叠状态
  const [isAffectedCollapsed, setIsAffectedCollapsed] = useState(false); // 动作影响范围折叠状态
  const [eightElement, setEightElement] = useState(null);
  const [processedEightElement, setProcessedEightElement] = useState(null);
  const [renderedHtml, setRenderedHtml] = useState('');
  const [domMeasurements, setDomMeasurements] = useState(null);
  const [scoreResult, setScoreResult] = useState(null);
  const [visibleTab, setVisibleTab] = useState('html'); // 'html', 'json', 'score'
  const iframeRef = useRef(null);
  const [layout, setLayout] = useState(null);
  const [iframeKey, setIframeKey] = useState(0);  // 添加 iframe key 状态

  // 先定义commonDimensions
  const commonDimensions = [
    { name: '桌面 (1920x1080)', width: 1920, height: 1080 },
    { name: '笔记本 (1440x900)', width: 1440, height: 900 },
    { name: '平板 (1024x768)', width: 1024, height: 768 },
    { name: '手机 (375x667)', width: 375, height: 667 }
  ];

  // 然后使用commonDimensions中的值初始化dimensions
  const [dimensions, setDimensions] = useState({
    width: commonDimensions[2].width,  // 使用平板尺寸作为默认值
    height: commonDimensions[2].height
  });

  // 初始化动作系统
  useEffect(() => {
    try {
      // 使用ActionSystemManager，它会自动从styleConfig中提取基准token
      const manager = createActionSystemManager(DEFAULT_STYLE_CONFIG);
      setActionManager(manager);
      
      console.log('动作系统管理器初始化完成');
      console.log('可用动作数量:', manager.getAvailableActions().length);
    } catch (error) {
      console.error('动作系统初始化失败:', error);
    }
  }, []);

  // 计算当前动作会影响的元件
  const calculateAffectedElements = (selectedActionsList, pageElementsList) => {
    if (!actionManager || selectedActionsList.length === 0 || pageElementsList.length === 0) {
      setAffectedElements([]);
      return [];
    }

    const affected = [];
    
    // 对每种元件类型和形态，检查是否会被当前动作影响
    for (const pageElement of pageElementsList) {
      const { type, variant, count, elements, sampleContent } = pageElement;
      
      try {
        // 获取该元件的基准tokens和元数据
        const { baseTokens, metadata } = actionManager.getBaseTokens(type, variant);
        
        if (metadata._configFound) {
          // 检查任一选中的动作是否会影响该元件的tokens
          const willBeAffected = selectedActionsList.some(actionName => {
            const actionInfo = actionManager.getActionInfo(actionName);
            if (!actionInfo) return false;
            
            // 🔧 新增：首先检查动作是否适用于该元件类型和变体
            if (actionInfo.applicableToElements && Array.isArray(actionInfo.applicableToElements)) {
              const isApplicable = actionInfo.applicableToElements.some(target => {
                // 支持两种格式：
                // 1. 简单格式：'layout' （对所有 layout 变体有效）
                // 2. 精细格式：'layout.root' （只对特定变体有效）
                if (target.includes('.')) {
                  // 精细格式：检查完整的 type.variant
                  const [targetType, targetVariant] = target.split('.');
                  return targetType === type && targetVariant === variant;
                } else {
                  // 简单格式：只检查 type
                  return target === type;
                }
              });
              
              if (!isApplicable) {
                console.log(`⚪ 动作 ${actionName} 不适用于元件 ${type}.${variant}`);
                return false;
              }
            }
            
            // 检查动作影响的CSS属性是否在该元件的基准tokens中
            const affectedProperties = Object.keys(baseTokens).filter(prop => !prop.startsWith('_'));
            
            // 🔧 改进的检测逻辑：基于动作的styleMapping检测实际影响的属性
            if (actionInfo.styleMapping) {
              // 获取动作实际会影响的CSS属性
              const actionTargetProperties = Object.keys(actionInfo.styleMapping);
              
              // 🔍 调试日志：显示动作目标属性和元件属性的匹配情况
              const hasMatch = actionTargetProperties.some(targetProp => {
                const matches = affectedProperties.includes(targetProp);
                if (matches) {
                  console.log(`✅ 动作 ${actionName} 的属性 ${targetProp} 匹配元件 ${type}.${variant}`);
                }
                return matches;
              });
              
              if (!hasMatch) {
                console.log(`⚪ 动作 ${actionName} 目标属性 [${actionTargetProperties.join(', ')}] 与元件 ${type}.${variant} 属性 [${affectedProperties.join(', ')}] 无匹配`);
              }
              
              return hasMatch;
            }
            
            // 🔧 兼容性回退：更完整的启发式判断
            return affectedProperties.some(prop => {
              return (
                // 圆润度相关动作
                (actionName.includes('Roundness') && prop.includes('border')) ||
                // 轮廓相关动作  
                (actionName.includes('Outline') && (prop.includes('border') || prop.includes('Border'))) ||
                // 字体相关动作
                (actionName.includes('Font') && prop.includes('font')) ||
                // 颜色相关动作
                (actionName.includes('Color') && prop.includes('color')) ||
                // 阴影相关动作
                (actionName.includes('Shadow') && prop.includes('shadow')) ||
                // 间距相关动作
                (actionName.includes('Spacing') && (prop.includes('padding') || prop.includes('margin'))) ||
                // 尺寸相关动作
                (actionName.includes('Size') && prop.includes('font')) ||
                // 张力相关动作
                (actionName.includes('Tension') && (prop.includes('border') || prop.includes('gap'))) ||
                // 密度相关动作
                (actionName.includes('Density') && (prop.includes('font') || prop.includes('padding'))) ||
                // 强度相关动作
                (actionName.includes('Strength') && (prop.includes('font') || prop.includes('color'))) ||
                // 透明度相关动作
                (actionName.includes('Transparency') && (prop.includes('background') || prop.includes('opacity'))) ||
                // 纹理相关动作
                (actionName.includes('Texture') && prop.includes('background')) ||
                // 状态相关动作
                (actionName.includes('State') && (prop.includes('color') || prop.includes('background')))
              );
            });
          });
          
          if (willBeAffected) {
            affected.push({
              type,
              variant,
              count,
              elements,
              sampleContent,
              tokenCount: Object.keys(baseTokens).filter(k => !k.startsWith('_')).length
            });
          }
        }
      } catch (error) {
        console.warn(`无法分析元件 ${type}.${variant}:`, error);
      }
    }
    
    setAffectedElements(affected);
    console.log('🎯 受影响的元件:', affected);
    
    return affected;
  };

  // 处理markdown变化
  useEffect(() => {
    if (markdown && !renderedHtml) {
      processMarkdown();
    }
  }, [markdown, selectedActions, actionIntensities]);

  // 处理iframe加载完成后的测量
  useEffect(() => {
    if (renderedHtml && iframeRef.current) {
      const timer = setTimeout(() => {
        // 检查iframe是否已经完全加载
        const iframe = iframeRef.current;
        if (iframe && iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
          measureIframeContent();
        } else {
          // 如果还没加载完成，等待iframe加载事件
          const handleIframeLoad = () => {
            measureIframeContent();
            iframe.removeEventListener('load', handleIframeLoad);
          };
          if (iframe) {
            iframe.addEventListener('load', handleIframeLoad);
          }
        }
        // 确保测量完成后再次更新 key
        setIframeKey(prev => prev + 1);
      }, 200); // 增加等待时间，确保渲染完成
      return () => clearTimeout(timer);
    }
  }, [renderedHtml]);

  // 处理动作选择
  const handleActionToggle = (actionName) => {
    if (selectedActions.includes(actionName)) {
      // 移除动作
      setSelectedActions(prev => prev.filter(a => a !== actionName));
      setActionIntensities(prev => {
        const newIntensities = { ...prev };
        delete newIntensities[actionName];
        return newIntensities;
      });
    } else {
      // 添加动作
      setSelectedActions(prev => [...prev, actionName]);
      setActionIntensities(prev => ({
        ...prev,
        [actionName]: 0.5 // 默认强度(0.1-1.0)
      }));
      }
  };

  // 处理动作强度变化
  const handleIntensityChange = (actionName, intensity) => {
    setActionIntensities(prev => ({
      ...prev,
      [actionName]: intensity
    }));
  };

  // 处理Markdown转换为八要素结构
  const processMarkdown = (customDimensions = null) => {
    try {
      // 使用传入的自定义尺寸或当前状态中的尺寸
      const currentDimensions = customDimensions || dimensions;
      console.log('处理Markdown使用尺寸:', currentDimensions);

      
      
      // 1. 转换Markdown为八要素结构
      let eightElementObj = markdownToEightElement(markdown);
      
      // 2. 分析八要素中的元件类型（使用八要素层面的函数）
      const pageElementsList = analyzeElementsInEightElement(eightElementObj);
      setPageElements(pageElementsList);
      
      // 3. 如果有选中的动作，应用到八要素结构上
      if (actionManager && selectedActions.length > 0 && pageElementsList.length > 0) {
        console.log(`\n🚀 开始应用动作到八要素结构`);
        console.log(`   选中的动作: ${selectedActions.join(', ')}`);
        console.log(`   目标页面元件: ${pageElementsList.map(p => `${p.type}.${p.variant}(${p.count}个)`).join(', ')}`);
        console.log(`   动作强度设置:`);
        selectedActions.forEach(actionName => {
          const intensity = actionIntensities[actionName] || 0.5;
          console.log(`      ${actionName}: ${intensity.toFixed(1)}`);
        });
        
        try {
          // 使用八要素层面的函数应用动作
          eightElementObj = applyActionsToEightElement(
            eightElementObj, 
            pageElementsList, 
            actionManager, 
            selectedActions, 
            actionIntensities
          );
          
          console.log('\n🎉 动作应用到八要素结构完成！');
          console.log('   八要素结构已更新，包含所有token变化');
        } catch (error) {
          console.error('\n❌ 动作应用出错:', error);
          console.error('   将使用原始八要素结构继续渲染');
        }
      } else {
        let reason = '';
        if (!actionManager) reason = '动作管理器未初始化';
        else if (selectedActions.length === 0) reason = '未选择任何动作';
        else if (pageElementsList.length === 0) reason = '页面中没有检测到元件';
        
        console.log(`\n⚪ 跳过动作应用 - ${reason}`);
      }
      
      // 4. 保存处理后的八要素结构
      setEightElement(eightElementObj);
      
      // 5. 渲染HTML（使用应用了动作的八要素结构）
      const { html, processedEightElement } = renderEightElementToHtml(eightElementObj, { 
        width: currentDimensions.width, 
        height: currentDimensions.height
      });
      
      setRenderedHtml(html);
      setProcessedEightElement(processedEightElement);

      // 将八要素结构转换为标准布局结构
      const convertedLayout = convertEightElementToLayout(processedEightElement);
      setLayout(convertedLayout);

      // 从根元素开始收集测量数据
      const measurements = {
        container: {
          width: currentDimensions.width,
          height: currentDimensions.height
        },
        elements: []
      };
      
      setDomMeasurements(measurements);
      
      console.log(`\n🏁 Markdown处理流程完成！`);
      console.log(`   📄 生成的HTML长度: ${html.length} 字符`);
      console.log(`   🎨 八要素结构: ${pageElementsList.length} 种元件类型`);
      console.log(`   📐 渲染尺寸: ${currentDimensions.width}x${currentDimensions.height}`);
      if (selectedActions.length > 0) {
        console.log(`   ⚡ 应用的动作: ${selectedActions.length} 个`);
      }
      
      return html; // 返回生成的HTML，方便调用者使用
    } catch (error) {
      console.error('\n❌ Markdown 处理出错:', error);
      console.error('   错误详情:', error.message);
      return null;
    }
  };

  // 当动作选择变化时，重新计算影响范围
  useEffect(() => {
    calculateAffectedElements(selectedActions, pageElements);
  }, [selectedActions, pageElements, actionManager]);

  // 显式添加应用样式的函数 - 与processMarkdown分开
  const applyStyleSettings = () => {
    processMarkdown();
  };

  // 测量iframe内容时使用通用函数替换内联逻辑
  const measureIframeContent = () => {
    try {
      const iframe = iframeRef.current;
      if (!iframe || !iframe.contentWindow) return;

      // 获取iframe内容文档
      const iframeDocument = iframe.contentDocument;
      
      // 使用状态中的固定尺寸，而不是iframe的实际尺寸
      // 这样避免了iframe隐藏时测量不准确的问题
      const measureDimensions = {
        width: dimensions.width,
        height: dimensions.height
      };

      // 使用通用元素测量收集函数
      const measurements = collectEightElementMeasurements(processedEightElement, {
        document: iframeDocument,
        dimensions: measureDimensions,
        getElementById: (id) => iframeDocument.getElementById(id),
        getComputedStyle: (el) => iframe.contentWindow.getComputedStyle(el)
      });

      console.log('page measurements:', measurements);
      console.log('使用的测量尺寸:', measureDimensions);

      setDomMeasurements(measurements);
    } catch (error) {
      console.error('测量iframe内容时出错:', error);
    }
  };

  // 获取动作分类
  const getActionsByCategory = () => {
    if (!actionManager) return {};
    return actionManager.getActionCategories();
  };

  // 获取动作的中文描述
  const getActionDescription = (actionName) => {
    if (!actionManager) {
      const action = RL_ACTIONS[actionName];
      return action ? action.name : actionName;
    }
    const actionInfo = actionManager.getActionInfo(actionName);
    return actionInfo ? actionInfo.name : actionName;
    };
    
  // 获取动作的冲突信息
  const getActionConflicts = (actionName) => {
    if (!actionManager) {
      const action = RL_ACTIONS[actionName];
      return action?.conflicts || [];
    }
    return actionManager.checkActionConflicts(actionName, selectedActions);
  };

  // 检查动作是否可用（没有冲突）
  const isActionAvailable = (actionName) => {
    const conflicts = getActionConflicts(actionName);
    return conflicts.length === 0;
    };



  // 添加尺寸选择处理函数
  const handleDimensionChange = (dimension) => {
    // 防止重复点击相同尺寸
    if (dimensions.width === dimension.width && dimensions.height === dimension.height) {
      console.log('已经是当前尺寸，无需更改');
      return;
    }
    
    console.log('尺寸变更为:', dimension.width, 'x', dimension.height);
    
    // 先重置 iframe key 强制重新渲染
    setIframeKey(prev => prev + 1);
    
    // 先处理新尺寸的渲染，得到新的HTML
    const newDimensions = {
      width: dimension.width,
      height: dimension.height
    };
    
    // 先清除旧的渲染结果
    setRenderedHtml('');
    setProcessedEightElement(null);
    setDomMeasurements(null);
    
    // 更新维度状态
    setDimensions(newDimensions);
    
    // 使用新尺寸强制重新处理
    if (markdown) {
      // 使用新尺寸立即生成HTML，不依赖状态更新
      const html = processMarkdown(newDimensions);
      console.log('使用新尺寸生成了HTML, 长度:', html?.length);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-4">八要素结构分析工具</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 左侧编辑器区域 */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-medium mb-2">Markdown编辑器</h2>
          <textarea
            className="w-full h-64 border border-gray-300 rounded p-2 mb-4 font-mono"
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="输入Markdown文本..."
          />
          
          {/* 页面元件分析 */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-700">页面元件分析</h3>
              <button
                onClick={() => setIsElementsCollapsed(!isElementsCollapsed)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                title={isElementsCollapsed ? "展开" : "折叠"}
              >
                {isElementsCollapsed ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                )}
              </button>
            </div>
            
            {!isElementsCollapsed && (
              <div className="mb-4 p-3 bg-gray-50 rounded border">
                {pageElements.length > 0 ? (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-600 mb-2">
                      当前页面包含 {pageElements.length} 种元件类型:
                    </div>
                    {pageElements.map(({ type, variant, count, sampleContent }) => (
                      <div key={`${type}.${variant}`} className="flex items-center justify-between p-2 bg-white rounded border">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded font-mono">
                            {type}.{variant}
                          </span>
                          <span className="text-sm text-gray-600">
                            {sampleContent && `"${sampleContent}"`}
                          </span>
                        </div>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {count}个
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 text-center py-4">
                    请先输入Markdown内容以分析页面元件
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* 动作影响范围 */}
          {selectedActions.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-700">动作影响范围</h3>
              <button
                  onClick={() => setIsAffectedCollapsed(!isAffectedCollapsed)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  title={isAffectedCollapsed ? "展开" : "折叠"}
                >
                  {isAffectedCollapsed ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  )}
              </button>
            </div>
            
              {!isAffectedCollapsed && (
                <div className="mb-4 p-3 bg-yellow-50 rounded border border-yellow-200">
                  {affectedElements.length > 0 ? (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-yellow-800 mb-2">
                        当前动作将影响 {affectedElements.length} 种元件:
                      </div>
                      {affectedElements.map(({ type, variant, count, sampleContent, tokenCount }) => (
                        <div key={`${type}.${variant}`} className="flex items-center justify-between p-2 bg-yellow-100 rounded">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs px-2 py-1 bg-yellow-200 text-yellow-800 rounded font-mono">
                              {type}.{variant}
                            </span>
                            <span className="text-sm text-yellow-700">
                              {sampleContent && `"${sampleContent}"`}
                    </span>
                  </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs bg-yellow-200 px-2 py-1 rounded">
                              {count}个元件
                            </span>
                            <span className="text-xs bg-yellow-200 px-2 py-1 rounded">
                              {tokenCount}个tokens
                    </span>
                  </div>
                </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-yellow-700 text-center py-2">
                      当前动作不会影响页面中的任何元件
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-2">动作空间设置</h3>
            
            <div className="flex mb-3">
              <button
                className={`px-3 py-1 text-sm rounded-l ${actionInputMode === 'categories' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setActionInputMode('categories')}
              >
                分类选择
              </button>
              <button
                className={`px-3 py-1 text-sm rounded-r ${actionInputMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setActionInputMode('list')}
              >
                列表模式
              </button>
                  </div>
            
            {actionInputMode === 'categories' ? (
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {Object.entries(getActionsByCategory()).map(([category, actions]) => (
                  <div key={category} className="border border-gray-200 rounded p-3">
                    <h4 className="font-medium text-gray-800 mb-2 capitalize">
                      {category === 'form' && '🎨 形态动作'}
                      {category === 'color' && '🌈 色彩动作'}
                      {category === 'typography' && '📝 字体动作'}
                      {category === 'material' && '🎭 质感动作'}
                      {category === 'proportion' && '📏 比例动作'}
                      {category === 'composition' && '🏗️ 构图动作'}
                      {category === 'state' && '🚦 状态动作'}
                      {category === 'adaptive' && '🤖 智能动作'}
                      {category === 'animation' && '🎬 动画动作'}
                      {category === 'accessibility' && '♿ 可访问性动作'}
                    </h4>
                    <div className="space-y-2">
                      {actions.map(actionName => {
                        const isSelected = selectedActions.includes(actionName);
                        const isAvailable = isActionAvailable(actionName);
                        const conflicts = getActionConflicts(actionName);
                        
                        return (
                          <div key={actionName} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                  <input
                                type="checkbox"
                                checked={isSelected}
                                disabled={!isAvailable && !isSelected}
                                onChange={() => handleActionToggle(actionName)}
                                className="rounded"
                  />
                              <span className={`text-sm ${!isAvailable && !isSelected ? 'text-gray-400' : 'text-gray-700'}`}>
                                {getActionDescription(actionName)}
                    </span>
                              {conflicts.length > 0 && (
                                <span className="text-xs text-orange-500" title={`冲突动作: ${conflicts.join(', ')}`}>
                                  ⚠️
                                </span>
                              )}
                  </div>
                            {isSelected && (
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-500">强度:</span>
                  <input
                                  type="number"
                                  min="0.1"
                                  max="1.0"
                                  step="0.1"
                                  value={actionIntensities[actionName] || 0.5}
                                  onChange={(e) => {
                                    const value = parseFloat(e.target.value);
                                    if (value >= 0.1 && value <= 1.0) {
                                      handleIntensityChange(actionName, value);
                                    }
                                  }}
                                  className="w-16 px-1 py-0.5 text-xs border border-gray-300 rounded"
                  />
                </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto">
                <div className="space-y-2">
                  {availableActions.map(actionName => {
                    const isSelected = selectedActions.includes(actionName);
                    const isAvailable = isActionAvailable(actionName);
                    const action = RL_ACTIONS[actionName];
                    
                    return (
                      <div key={actionName} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            disabled={!isAvailable && !isSelected}
                            onChange={() => handleActionToggle(actionName)}
                            className="rounded"
                          />
                <div>
                            <span className={`text-sm font-medium ${!isAvailable && !isSelected ? 'text-gray-400' : 'text-gray-700'}`}>
                              {getActionDescription(actionName)}
                    </span>
                            <div className="text-xs text-gray-500">
                              {action.category} • {action.intensity}
                  </div>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">强度:</span>
                  <input
                              type="number"
                              min="0.1"
                              max="1.0"
                              step="0.1"
                              value={actionIntensities[actionName] || 0.5}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                if (value >= 0.1 && value <= 1.0) {
                                  handleIntensityChange(actionName, value);
                                }
                              }}
                              className="w-16 px-1 py-0.5 text-xs border border-gray-300 rounded"
                  />
                </div>
                        )}
              </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            <div className="mt-4">
              <button
                className={`px-4 py-2 rounded w-full ${
                  visibleTab === 'html' 
                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                onClick={visibleTab === 'html' ? applyStyleSettings : undefined}
                disabled={visibleTab !== 'html'}
              >
                应用动作设置
              </button>
              <p className="text-xs text-gray-500 mt-1">
                {visibleTab === 'html' 
                  ? `已选择 ${selectedActions.length} 个动作，将影响页面中 ${affectedElements.length} 种元件类型` 
                  : '请切换到HTML预览页面后再应用动作设置'
                }
              </p>
            </div>
          </div>
          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-2">预览尺寸设置</h3>
            <div className="grid grid-cols-2 gap-2">
              {commonDimensions.map((dim) => (
                <button
                  key={dim.name}
                  className={`px-3 py-2 text-sm rounded ${
                    dimensions.width === dim.width && dimensions.height === dim.height
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  onClick={() => handleDimensionChange(dim)}
                >
                  {dim.name}
                </button>
              ))}
            </div>
            <div className="mt-2 text-xs text-gray-500">
              当前尺寸: {dimensions.width} x {dimensions.height}
            </div>
          </div>
        </div>
        
        {/* 右侧预览区域 */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex border-b mb-4">
            <button 
              className={`px-4 py-2 ${visibleTab === 'html' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setVisibleTab('html')}
            >
              HTML预览
            </button>
            <button 
              className={`px-4 py-2 ${visibleTab === 'json' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setVisibleTab('json')}
            >
              八要素JSON
            </button>
            <button 
              className={`px-4 py-2 ${visibleTab === 'score' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setVisibleTab('score')}
            >
              布局评分
            </button>
          </div>
          
          {/* HTML预览 */}
          <div className={`${visibleTab === 'html' ? 'block' : 'hidden'}`}>
            <h2 className="text-lg font-medium mb-2">HTML预览</h2>
            <div className="border border-gray-300 rounded p-1 overflow-auto" style={{
              width: '100%',
              height: '600px',
              backgroundColor: '#f5f5f5'
            }}>
              <div style={{
                width: `${dimensions.width}px`,
                height: `${dimensions.height}px`,
                margin: '0 auto',
                backgroundColor: 'white',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                transition: 'width 0.3s, height 0.3s'
              }}>
                {renderedHtml && (  // 只在有内容时渲染 iframe
                  <iframe
                    ref={iframeRef}
                    className="w-full h-full"
                    srcDoc={renderedHtml}
                    title="Eight Element Preview"
                    key={iframeKey}  // 使用状态管理的 key
                  ></iframe>
                )}
              </div>
            </div>
          </div>
          
          {/* JSON预览 */}
          <div className={`${visibleTab === 'json' ? 'block' : 'hidden'}`}>
            <h2 className="text-lg font-medium mb-2">八要素结构</h2>
            <div className="border border-gray-300 rounded p-2 h-96 overflow-auto bg-gray-50">
              <pre className="text-xs">
                {eightElement ? JSON.stringify(eightElement, null, 2) : '等待处理...'}
              </pre>
            </div>
          </div>
          
          {/* 评分结果 */}
          <div className={`${visibleTab === 'score' ? 'block' : 'hidden'}`}>
            <h2 className="text-lg font-medium mb-2">布局评分</h2>
            <div className="h-96 overflow-auto">
              {layout && domMeasurements && (
                <VisualSpaceEvaluator 
                  layout={layout} 
                  domMeasurements={domMeasurements}
                />
              )}
            </div>
          </div>

          {/* 当前使用的动作 */}
          <div className="mt-4 text-xs text-gray-500 p-2 bg-gray-100 rounded">
            <div className="font-medium mb-1">动作系统状态:</div>
            {actionManager ? (
              <div className="space-y-2">
                <div className="text-green-600">✅ 系统已初始化</div>
                <div>页面元件类型: {pageElements.length} 种</div>
                <div>可用动作: {actionManager.getAvailableActions().length} 个</div>
                
                {selectedActions.length > 0 ? (
                  <div className="mt-2">
                    <div className="font-medium mb-1">已选择的动作:</div>
                    <div className="space-y-1">
                      {selectedActions.map(actionName => (
                        <div key={actionName} className="flex justify-between">
                          <span>{getActionDescription(actionName)}</span>
                          <span className="font-mono">
                            {(actionIntensities[actionName] || 0.5).toFixed(1)}
                          </span>
          </div>
                      ))}
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-300">
                      <div className="text-yellow-600">
                        💡 影响范围: {affectedElements.length} 种元件 • 总计 {affectedElements.reduce((sum, el) => sum + el.count, 0)} 个元件
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-400 mt-2">未选择动作</div>
                )}
              </div>
            ) : (
              <div className="text-red-500">❌ 系统未初始化</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EightElementAnalyzer; 