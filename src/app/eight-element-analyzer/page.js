'use client';
import React, { useState, useEffect, useRef } from 'react';
import { renderEightElementToHtml } from '../utils/eightElement/renderEightElementHtml';
import { convertEightElementToLayout } from '../utils/layoutAnalysis/eightElementAnalysis';
import { markdownToEightElement } from '../utils/eightElement/markdownToEightElement';
import { setDynamicTokenSystem, clearDynamicTokenSystem } from '../utils/tokens/resolveToken';
import { calculateTokens } from '../utils/seeds/generateTokenBySeed';
import VisualSpaceEvaluator from '../components/VisualSpaceEvaluator';
import collectEightElementMeasurements from '../utils/eightElement/collectElementMeasurements.js';

const EightElementAnalyzer = () => {
  const [markdown, setMarkdown] = useState(`# 八要素测试文档

这是一个简单的测试文档，用于测试Markdown到八要素的转换功能。

## 基本元素

### 文本
这是一段普通文本，将被转换为text元素。

### 按钮（超链接）
这是一个[按钮链接](https://example.com)，将被转换为button元素。

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

### 表格示例
下面是一个简单的表格示例：

| 功能 | 描述 | 支持状态 |
| --- | --- | :---: |
| 文本 | 支持普通文本和标题 | ✅ |
| 按钮 | 支持超链接按钮 | ✅ |
| 图片 | 支持图片显示 | ✅ |
| 表格 | 支持表格渲染和样式 | ✅ |
| 代码块 | 支持代码高亮显示 | ✅ |
| 混合内容 | 支持在一行中混合[链接](https://example.com)和文本 | ✅ |
`);
  const [seedText, setSeedText] = useState(''); // 用于存储JSON文本
  const [seed, setSeed] = useState({
    shape: 7,      // 较大圆角
    degree: 3,     // 紧凑间距
    font: 6,       // 较大字体
    material: 7,   // 较重阴影
    color: "#FF5757" // 主题色
  });
  const [eightElement, setEightElement] = useState(null);
  const [processedEightElement, setProcessedEightElement] = useState(null);
  const [renderedHtml, setRenderedHtml] = useState('');
  const [domMeasurements, setDomMeasurements] = useState(null);
  const [scoreResult, setScoreResult] = useState(null);
  const [visibleTab, setVisibleTab] = useState('html'); // 'html', 'json', 'score'
  const [seedInputMode, setSeedInputMode] = useState('sliders'); // 'sliders' 或 'json'
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

  // 初始化seedText
  useEffect(() => {
    setSeedText(JSON.stringify(seed, null, 2));
  }, []);

  // 处理markdown变化
  useEffect(() => {
    if (markdown && !renderedHtml) {
      processMarkdown();
    }
  }, [markdown, seed]);

  // 处理iframe加载完成后的测量
  useEffect(() => {
    if (renderedHtml && iframeRef.current) {
      const timer = setTimeout(() => {
        measureIframeContent();
        // 确保测量完成后再次更新 key
        setIframeKey(prev => prev + 1);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [renderedHtml]);

  // 处理Seed的更新（通过滑块）
  const handleSeedChange = (key, value) => {
    const newSeed = {
      ...seed,
      [key]: value
    };
    setSeed(newSeed);
    setSeedText(JSON.stringify(newSeed, null, 2));
  };

  // 处理JSON文本的更新
  const handleSeedTextChange = (e) => {
    const text = e.target.value;
    setSeedText(text);
    
    try {
      const parsedSeed = JSON.parse(text);
      // 验证必要的字段
      if (typeof parsedSeed === 'object' && parsedSeed !== null) {
        setSeed(parsedSeed);
      }
    } catch (error) {
      // JSON解析错误，保持文本但不更新seed对象
      console.error('解析JSON时出错:', error);
    }
  };

  // 处理Markdown转换为八要素结构
  const processMarkdown = (customDimensions = null) => {
    try {
      // 使用传入的自定义尺寸或当前状态中的尺寸
      const currentDimensions = customDimensions || dimensions;
      console.log('处理Markdown使用尺寸:', currentDimensions);
      
      // 先清除之前可能存在的动态token系统
      clearDynamicTokenSystem();
      
      // 使用seed生成设计令牌并设置到动态token系统
      const designTokens = calculateTokens(seed);
      console.log('使用种子生成设计令牌:', seed);
      setDynamicTokenSystem(designTokens);
      console.log('已将设计令牌设置为动态token系统');
      
      // 转换Markdown为八要素结构
      const eightElementObj = markdownToEightElement(markdown);
      setEightElement(eightElementObj);
      
      // 渲染HTML，使用currentDimensions中的宽高
      const { html, processedEightElement } = renderEightElementToHtml(eightElementObj, { 
        width: currentDimensions.width, 
        height: currentDimensions.height
      });
      
      setRenderedHtml(html);
      setProcessedEightElement(processedEightElement);

      // 将八要素结构转换为标准布局结构
      const convertedLayout = convertEightElementToLayout(processedEightElement);
      setLayout(convertedLayout);
      console.log('转换后的布局结构:', convertedLayout);

      // 从根元素开始收集测量数据
      const measurements = {
        container: {
          width: currentDimensions.width,
          height: currentDimensions.height
        },
        elements: []
      };
      
      setDomMeasurements(measurements);
      
      return html; // 返回生成的HTML，方便调用者使用
    } catch (error) {
      console.error('处理Markdown时出错:', error);
      // 确保出错时也清除动态token系统
      clearDynamicTokenSystem();
      return null;
    }
  };

  // 处理seed变化时立即应用样式
  useEffect(() => {
    // 确保seed变化后不会立即触发渲染，而是让用户手动点击应用按钮
    // 这样可以避免用户调整过程中频繁渲染导致性能问题
  }, [seed]);

  // 显式添加应用样式的函数 - 与processMarkdown分开
  const applyStyleSettings = () => {
    processMarkdown();
  };

  // 测量iframe内容时使用通用函数替换内联逻辑
  const measureIframeContent = () => {
    try {
      const iframe = iframeRef.current;
      if (!iframe || !iframe.contentWindow) return;

      // 获取iframe内容的实际尺寸，而不仅仅是视口尺寸
      const iframeDocument = iframe.contentDocument;
      const iframeBody = iframeDocument.body;
      
      // 计算内容的实际尺寸（可能超出容器）
      const scrollWidth = iframeBody.scrollWidth;
      const scrollHeight = iframeBody.scrollHeight;
      
      // 使用内容的实际尺寸和容器尺寸的较大值
      const dimensions = {
        width: Math.max(iframe.clientWidth, scrollWidth),
        height: Math.max(iframe.clientHeight, scrollHeight)
      };

      console.log("测量iframe内容尺寸:", dimensions);

      // 使用通用元素测量收集函数
      const measurements = collectEightElementMeasurements(processedEightElement, {
        document: iframeDocument,
        dimensions,
        getElementById: (id) => iframeDocument.getElementById(id),
        getComputedStyle: (el) => window.getComputedStyle(el)
      });

      setDomMeasurements(measurements);
    } catch (error) {
      console.error('测量iframe内容时出错:', error);
    }
  };

  // 获取数值对应的描述文本
  const getValueDescription = (key, value) => {
    const descriptions = {
      shape: {
        0: '无圆角',
        3: '小圆角',
        5: '中等圆角',
        7: '较大圆角',
        10: '最大圆角'
      },
      degree: {
        0: '极宽间距',
        3: '紧凑间距',
        5: '中等间距',
        7: '宽松间距',
        10: '极宽间距'
      },
      font: {
        0: '极小字体',
        3: '小字体',
        5: '中等字体',
        7: '大字体',
        10: '极大字体'
      },
      material: {
        0: '无阴影',
        3: '轻阴影',
        5: '中等阴影',
        7: '重阴影',
        10: '极重阴影'
      }
    };
    
    // 找到最接近的描述
    const values = Object.keys(descriptions[key]).map(Number);
    const closestValue = values.reduce((prev, curr) => 
      Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    );
    
    return descriptions[key][closestValue];
  };

  // 在组件卸载时清除动态token系统
  useEffect(() => {
    return () => {
      clearDynamicTokenSystem();
      console.log('组件卸载，已清除动态token系统');
    };
  }, []);

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

  console.log('processedEightElement')
  console.log(processedEightElement)

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
          
          <div className="mb-6">
            <h3 className="font-medium text-gray-700 mb-2">样式种子设置</h3>
            
            <div className="flex mb-3">
              <button
                className={`px-3 py-1 text-sm rounded-l ${seedInputMode === 'sliders' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setSeedInputMode('sliders')}
              >
                滑块控制
              </button>
              <button
                className={`px-3 py-1 text-sm rounded-r ${seedInputMode === 'json' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setSeedInputMode('json')}
              >
                JSON编辑
              </button>
            </div>
            
            {seedInputMode === 'sliders' ? (
              <div className="space-y-4">
                {/* 形状控制 */}
                <div>
                  <div className="flex justify-between">
                    <label className="block text-sm font-medium text-gray-700">
                      形状 (Shape)
                    </label>
                    <span className="text-xs text-gray-500">
                      {seed.shape} - {getValueDescription('shape', seed.shape)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    value={seed.shape || 0}
                    onChange={(e) => handleSeedChange('shape', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-full mt-1"
                  />
                </div>
                
                {/* 间距控制 */}
                <div>
                  <div className="flex justify-between">
                    <label className="block text-sm font-medium text-gray-700">
                      间距 (Degree)
                    </label>
                    <span className="text-xs text-gray-500">
                      {seed.degree} - {getValueDescription('degree', seed.degree)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    value={seed.degree || 0}
                    onChange={(e) => handleSeedChange('degree', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-full mt-1"
                  />
                </div>
                
                {/* 字体控制 */}
                <div>
                  <div className="flex justify-between">
                    <label className="block text-sm font-medium text-gray-700">
                      字体 (Font)
                    </label>
                    <span className="text-xs text-gray-500">
                      {seed.font} - {getValueDescription('font', seed.font)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    value={seed.font || 0}
                    onChange={(e) => handleSeedChange('font', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-full mt-1"
                  />
                </div>
                
                {/* 材质控制 */}
                <div>
                  <div className="flex justify-between">
                    <label className="block text-sm font-medium text-gray-700">
                      材质 (Material)
                    </label>
                    <span className="text-xs text-gray-500">
                      {seed.material} - {getValueDescription('material', seed.material)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    value={seed.material || 0}
                    onChange={(e) => handleSeedChange('material', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-full mt-1"
                  />
                </div>
                
                {/* 颜色控制 */}
                <div>
                  <div className="flex justify-between">
                    <label className="block text-sm font-medium text-gray-700">
                      主题色 (Color)
                    </label>
                    <span className="text-xs text-gray-500 inline-flex items-center">
                      <span className="w-4 h-4 inline-block mr-1 rounded-full" style={{backgroundColor: seed.color}}></span>
                      {seed.color}
                    </span>
                  </div>
                  <input
                    type="color"
                    value={seed.color || "#000000"}
                    onChange={(e) => handleSeedChange('color', e.target.value)}
                    className="w-full h-8 rounded mt-1"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seed JSON配置
                </label>
                <textarea
                  className="w-full h-48 border border-gray-300 rounded p-2 font-mono text-sm"
                  value={seedText}
                  onChange={handleSeedTextChange}
                  placeholder='{"shape": 7, "degree": 3, "font": 6, "material": 7, "color": "#FF5757"}'
                />
                <p className="text-xs text-gray-500 mt-1">
                  直接编辑JSON配置，shape/degree/font/material的值范围是0-10，color为HEX颜色值
                </p>
              </div>
            )}
            
            <div className="mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
                onClick={applyStyleSettings}
              >
                应用样式设置
              </button>
              <p className="text-xs text-gray-500 mt-1">
                样式种子会影响八要素结构的视觉效果
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
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              backgroundColor: '#f5f5f5'
            }}>
              <div style={{
                width: `${dimensions.width}px`,
                height: `${dimensions.height}px`,
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

          {/* 当前使用的Seed */}
          <div className="mt-4 text-xs text-gray-500 p-2 bg-gray-100 rounded">
            <div className="font-medium mb-1">当前样式种子:</div>
            <pre>{JSON.stringify(seed, null, 2)}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EightElementAnalyzer; 