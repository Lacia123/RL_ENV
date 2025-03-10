'use client';
import React from 'react';
import TextElementEditor from './TextElementEditor';
import ButtonElementEditor from './ButtonElementEditor';
import InputElementEditor from './InputElementEditor';
import ImageElementEditor from './ImageElementEditor';
import IconElementEditor from './IconElementEditor';
import DividerElementEditor from './DividerElementEditor';
import BackgroundElementEditor from './BackgroundElementEditor';

/**
 * 元素编辑器选择器 - 根据元素类型渲染对应的编辑器组件
 * @param {Object} props
 * @param {Object} props.element - 当前元素
 * @param {Function} props.onStyleChange - 样式变更回调
 * @param {Function} props.onContentChange - 内容变更回调
 * @param {Function} props.onActionChange - 动作变更回调
 */
const ElementEditorSelector = ({ 
  element, 
  onStyleChange, 
  onContentChange, 
  onActionChange 
}) => {
  if (!element) return null;
  
  // 确保传递给编辑器的属性不为 undefined
  const { type } = element;
  const style = element.style || {};
  const content = element.content || {};
  const action = element.action || {};
  
  // 根据元素类型选择对应的编辑器组件
  switch (type) {
    case 'text':
      return (
        <TextElementEditor 
          style={style} 
          content={content} 
          onStyleChange={onStyleChange} 
          onContentChange={onContentChange} 
        />
      );
      
    case 'button':
      return (
        <ButtonElementEditor 
          style={style} 
          content={content} 
          action={action}
          onStyleChange={onStyleChange} 
          onContentChange={onContentChange} 
          onActionChange={onActionChange}
        />
      );
      
    case 'input':
      return (
        <InputElementEditor 
          style={style} 
          content={content} 
          onStyleChange={onStyleChange} 
          onContentChange={onContentChange} 
        />
      );
      
    case 'image':
      return (
        <ImageElementEditor 
          style={style} 
          content={content} 
          onStyleChange={onStyleChange} 
          onContentChange={onContentChange} 
        />
      );
      
    case 'icon':
      return (
        <IconElementEditor 
          style={style} 
          content={content} 
          onStyleChange={onStyleChange} 
          onContentChange={onContentChange} 
        />
      );
      
    case 'divider':
      return (
        <DividerElementEditor 
          style={style} 
          onStyleChange={onStyleChange} 
        />
      );
      
    case 'background':
      return (
        <BackgroundElementEditor 
          style={style} 
          content={content} 
          onStyleChange={onStyleChange} 
          onContentChange={onContentChange} 
        />
      );
      
    case 'container':
      return null; // 容器没有特有属性，只需使用通用布局和外观配置
      
    default:
      return (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800">未知元素类型: {type}</p>
          <p className="text-sm text-yellow-600 mt-2">
            该元素类型没有特定的编辑器组件
          </p>
        </div>
      );
  }
};

export default ElementEditorSelector;