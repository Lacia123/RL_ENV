'use client';
import React, { useState, useEffect } from 'react';

/**
 * Markdown解析器组件 - 将Markdown文本转换为可用的UI元素
 *
 * 此组件接收Markdown文本，解析其中的各种元素，并将其转换为可用于布局编辑器的UI元素
 */
const MarkdownParser = ({
  markdownText = '',
  onElementsGenerated = () => {},
  onMarkdownTextChange = null
}) => {
  const [parsedElements, setParsedElements] = useState([]);
  const [error, setError] = useState('');

  // 初始解析
  useEffect(() => {
    // 仅在组件初始加载时解析一次，后续通过onChange事件处理
    if (markdownText.trim() && parsedElements.length === 0) {
      try {
        const elements = parseMarkdownToElements(markdownText);
        setParsedElements(elements);
        // 不在这里调用onElementsGenerated，避免循环
      } catch (err) {
        console.error('解析Markdown出错:', err);
        setError('Markdown解析失败，请检查格式。');
      }
    }
  }, []); // 空依赖数组，只在组件挂载时执行一次

  // 将Markdown解析为UI元素的函数
  const parseMarkdownToElements = (markdown) => {
    const elements = [];
    const lines = markdown.split('\n');
    
    let inCodeBlock = false;
    let codeContent = '';
    let codeLanguage = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // 处理代码块
      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLanguage = line.slice(3).trim();
          codeContent = '';
        } else {
          elements.push(createCodeElement(codeContent, codeLanguage));
          inCodeBlock = false;
          codeContent = '';
          codeLanguage = '';
        }
        continue;
      }
      
      if (inCodeBlock) {
        codeContent += line + '\n';
        continue;
      }
      
      // 跳过空行
      if (line === '') continue;
      
      // 处理标题
      if (line.startsWith('# ')) {
        elements.push(createHeadingElement(line.slice(2), 1));
      } else if (line.startsWith('## ')) {
        elements.push(createHeadingElement(line.slice(3), 2));
      } else if (line.startsWith('### ')) {
        elements.push(createHeadingElement(line.slice(4), 3));
      } else if (line.startsWith('#### ')) {
        elements.push(createHeadingElement(line.slice(5), 4));
      } else if (line.startsWith('##### ')) {
        elements.push(createHeadingElement(line.slice(6), 5));
      } else if (line.startsWith('###### ')) {
        elements.push(createHeadingElement(line.slice(7), 6));
      }
      // 处理列表项 - 现在每个列表项都成为独立的文本元素
      else if (line.startsWith('- ')) {
        elements.push(createListItemElement(line.slice(2)));
      }
      // 处理图片
      else if (line.match(/!\[.*?\]\(.*?\)/)) {
        const altMatch = line.match(/!\[(.*?)\]/);
        const srcMatch = line.match(/\((.*?)\)/);
        const alt = altMatch ? altMatch[1] : '';
        const src = srcMatch ? srcMatch[1] : '';
        elements.push(createImageElement(src, alt));
      }
      // 处理链接按钮
      else if (line.match(/\[.*?\]\(.*?\)/)) {
        const textMatch = line.match(/\[(.*?)\]/);
        const urlMatch = line.match(/\((.*?)\)/);
        const text = textMatch ? textMatch[1] : '';
        const url = urlMatch ? urlMatch[1] : '';
        elements.push(createButtonElement(text, url));
      }
      // 处理普通段落
      else {
        elements.push(createParagraphElement(line));
      }
    }
    
    return elements;
  };
  
  // 创建标题元素
  const createHeadingElement = (text, level) => {
    const typographyMap = {
      1: 'h1',
      2: 'h2',
      3: 'h3',
      4: 'subtitle',
      5: 'subtitle',
      6: 'subtitle'
    };
    
    return {
      type: 'text',
      name: `标题 ${text}`,
      typographyPreset: typographyMap[level],
      selfAlignPreset: 'self-start',
      textAlignPreset: 'left',
      sizePreset: 'fill-width',
      content: { value: text }
    };
  };
  
  // 创建段落元素
  const createParagraphElement = (text) => {
    return {
      type: 'text',
      name: `段落 ${text.slice(0, 15)}${text.length > 15 ? '...' : ''}`,
      typographyPreset: 'body',
      selfAlignPreset: 'self-start',
      textAlignPreset: 'left',
      sizePreset: 'fill-width',
      content: { value: text }
    };
  };
  
  // 创建单个列表项元素（作为独立的文本元素），后续需要处理
  const createListItemElement = (text) => {
    return {
      type: 'text',
      name: `列表项 ${text.slice(0, 15)}${text.length > 15 ? '...' : ''}`,
      typographyPreset: 'body',
      selfAlignPreset: 'self-start',
      textAlignPreset: 'left',
      sizePreset: 'fill-width',
      content: { value: `${text}` }
    };
  };
  
  // 创建图片元素
  const createImageElement = (src, alt) => {
    return {
      type: 'image',
      name: `图片 ${alt || 'image'}`,
      selfAlignPreset: 'self-center',
      sizePreset: 'responsive-medium',
      imageProportionPreset: 'original',
      content: {
        src,
        alt
      }
    };
  };
  
  // 创建按钮元素
  const createButtonElement = (text, url) => {
    return {
      type: 'button',
      name: `按钮 ${text}`,
      buttonSizePreset: 'btn-medium',
      selfAlignPreset: 'self-start',
      appearancePreset: 'primary',
      content: { text },
      action: { type: 'link', url }
    };
  };
  
  // 创建代码元素
  const createCodeElement = (code, language) => {
    return {
      type: 'text',
      name: `代码块 ${language}`,
      typographyPreset: 'body',
      selfAlignPreset: 'self-start',
      sizePreset: 'fill-width',
      appearancePreset: 'card',
      style: {
        fontFamily: 'monospace',
        whiteSpace: 'pre',
        overflowX: 'auto',
        padding: '16px',
        backgroundColor: '#f5f5f5',
        borderRadius: '4px'
      },
      content: { value: code }
    };
  };
  
  // 处理Markdown文本更改
  const handleMarkdownChange = (e) => {
    const newText = e.target.value;
    
    if (onMarkdownTextChange) {
      onMarkdownTextChange(newText);
    }
    
    try {
      const elements = parseMarkdownToElements(newText);
      setParsedElements(elements);
      onElementsGenerated(elements);
      setError('');
    } catch (err) {
      console.error('解析Markdown出错:', err);
      setError('Markdown解析失败，请检查格式。');
    }
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm p-4">
      <h3 className="text-lg font-medium mb-2">Markdown解析器</h3>
      
      {/* 文本输入区 */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          输入Markdown文本
        </label>
        <textarea
          className="w-full h-40 border rounded p-2 font-mono text-sm"
          value={markdownText}
          onChange={handleMarkdownChange}
          placeholder="请输入Markdown文本"
        />
      </div>
      
      {/* 错误显示 */}
      {error && (
        <div className="mb-4 p-2 bg-red-50 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {/* 预览区 */}
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">解析元素预览</h4>
        <div className="border rounded p-3 max-h-60 overflow-y-auto">
          {parsedElements.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1">
              {parsedElements.map((element, index) => (
                <li key={index} className="text-sm">
                  <span className="font-medium">{element.type}</span>: {element.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">请输入Markdown内容</p>
          )}
        </div>
      </div>
      
      {/* 生成按钮 */}
      <button
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
        onClick={() => onElementsGenerated(parsedElements)}
      >
        应用到布局
      </button>
    </div>
  );
};

export default MarkdownParser;