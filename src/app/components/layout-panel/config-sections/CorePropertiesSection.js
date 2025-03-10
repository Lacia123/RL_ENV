'use client';
import React, { useState } from 'react';
import TextInput from '../inputs/TextInput';
import SelectInput from '../inputs/SelectInput';
import IconSelector from '../inputs/IconSelector';
import ConfigSection from './ConfigSection';

/**
 * 核心属性配置区域组件 - 用于配置元素的核心属性
 * @param {Object} props
 * @param {Object} props.element - 当前编辑的元素对象
 * @param {Function} props.onContentChange - 内容变更回调
 * @param {Function} props.onStyleChange - 样式变更回调
 */
const CorePropertiesSection = ({ element, onContentChange, onStyleChange }) => {
  // 获取元素类型和内容
  const { type, content } = element;
  
  // 根据元素类型渲染不同的核心属性配置
  const renderCoreProperties = () => {
    switch (type) {
      case 'text':
        // 文本元素的核心属性是文本内容
        return (
          <TextInput
            label="文本内容"
            value={typeof content === 'string' ? content : (content?.value || '')}
            multiline={true}
            rows={3}
            tooltip="文本组件显示的内容"
            onChange={(value) => {
              // 根据内容类型决定如何更新
              if (typeof content === 'string') {
                onContentChange('content', value);
              } else {
                onContentChange('value', value);
              }
            }}
          />
        );
        
      case 'button':
        // 按钮元素的核心属性包括文本、图标和图标位置
        return (
          <>
            <TextInput
              label="按钮文本"
              value={content?.text || ''}
              tooltip="按钮上显示的文字"
              onChange={(value) => onContentChange('text', value)}
            />
            
            <IconSelector
              label="图标"
              value={content?.icon || ''}
              tooltip="按钮上显示的图标"
              onChange={(value) => onContentChange('icon', value)}
            />
            
            {content?.icon && (
              <SelectInput
                label="图标位置"
                value={content?.iconPosition || 'left'}
                options={[
                  { value: 'left', label: '左侧' },
                  { value: 'right', label: '右侧' }
                ]}
                tooltip="图标在按钮中的位置"
                onChange={(value) => onContentChange('iconPosition', value)}
              />
            )}
          </>
        );
        
      case 'image':
        // 图片元素的核心属性包括图片源和替代文本
        return (
          <>
            <TextInput
              label="图片链接"
              value={content?.src || ''}
              tooltip="图片的URL地址"
              onChange={(value) => onContentChange('src', value)}
            />
            
            <TextInput
              label="替代文本"
              value={content?.alt || ''}
              tooltip="当图片无法显示时的替代文本"
              onChange={(value) => onContentChange('alt', value)}
            />
          </>
        );
        
      case 'icon':
        // 图标元素的核心属性是图标名称
        return (
          <>
            <IconSelector
              label="图标"
              value={content?.icon || ''}
              tooltip="要显示的图标"
              onChange={(value) => onContentChange('icon', value)}
            />
            {content?.icon && (
              <TextInput
                label="图标大小"
                value={element.style?.fontSize || '24px'}
                tooltip="图标的大小"
                onChange={(value) => onStyleChange?.('fontSize', value)}
              />
            )}
          </>
        );
        
      case 'input':
        // 输入框元素的核心属性包括占位符、字段名和类型
        return (
          <>
            <TextInput
              label="占位符"
              value={content?.placeholder || ''}
              tooltip="输入框未输入内容时显示的提示文本"
              onChange={(value) => onContentChange('placeholder', value)}
            />
            
            <TextInput
              label="字段名"
              value={content?.field || ''}
              tooltip="表单提交时的字段名"
              onChange={(value) => onContentChange('field', value)}
            />
            
            <SelectInput
              label="输入类型"
              value={content?.type || 'text'}
              options={[
                { value: 'text', label: '文本' },
                { value: 'password', label: '密码' },
                { value: 'number', label: '数字' },
                { value: 'email', label: '邮箱' },
                { value: 'tel', label: '电话' },
                { value: 'url', label: '网址' }
              ]}
              tooltip="输入框的类型"
              onChange={(value) => onContentChange('type', value)}
            />
          </>
        );
        
      case 'container':
        // 容器的核心属性较少，主要是样式和布局
        return (
          <p className="text-sm text-gray-500 py-2">容器元素没有核心内容属性，请使用布局和样式配置。</p>
        );
        
      case 'divider':
        // 分割线没有太多核心属性
        return (
          <p className="text-sm text-gray-500 py-2">分割线元素没有核心内容属性，请使用样式配置。</p>
        );
        
      default:
        return (
          <p className="text-sm text-gray-500 py-2">该元素类型没有可配置的核心属性。</p>
        );
    }
  };
  
  return (
    <ConfigSection
      title="核心属性"
      description="配置元素的基本内容和功能"
      defaultCollapsed={false}
    >
      {renderCoreProperties()}
    </ConfigSection>
  );
};

export default CorePropertiesSection;