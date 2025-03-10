'use client';
import React from 'react';
import ConfigSection from '../config-sections/ConfigSection';
import SelectInput from '../inputs/SelectInput';
import TextInput from '../inputs/TextInput';
import ColorInput from '../inputs/ColorInput';

/**
 * 背景元素编辑器 - 用于编辑背景特有的属性
 * @param {Object} props
 * @param {Object} props.style - 当前样式对象
 * @param {Object} props.content - 背景内容
 * @param {Function} props.onStyleChange - 样式变更回调
 * @param {Function} props.onContentChange - 内容变更回调
 */
const BackgroundElementEditor = ({ style, content, onStyleChange, onContentChange }) => {
  // 处理内容嵌套属性更新
  const handleNestedContentChange = (key, value) => {
    onContentChange(`content.${key}`, value);
  };
  
  return (
    <ConfigSection title="背景属性">
      <SelectInput
        label="背景类型"
        value={content?.type}
        options={[
          {value: 'img', label: '图片'},
          {value: 'color', label: '颜色'},
          {value: 'gradient', label: '渐变'}
        ]}
        onChange={(val) => handleNestedContentChange('type', val)}
        tooltip="背景的类型"
      />
      
      {content?.type === 'img' && (
        <>
          <TextInput
            label="图片链接"
            value={content?.src}
            onChange={(val) => handleNestedContentChange('src', val)}
            placeholder="URL地址"
            tooltip="背景图片的链接地址"
          />
          
          <SelectInput
            label="填充模式"
            value={content?.fit}
            options={[
              {value: 'cover', label: '覆盖 - 填满区域可能裁剪'},
              {value: 'contain', label: '包含 - 完整显示可能留白'},
              {value: 'fill', label: '填充 - 可能变形'},
              {value: 'none', label: '无 - 原始尺寸'}
            ]}
            onChange={(val) => handleNestedContentChange('fit', val)}
            tooltip="背景图片如何适应其容器尺寸"
          />
          
          <SelectInput
            label="背景重复"
            value={content?.repeat || 'no-repeat'}
            options={[
              {value: 'no-repeat', label: '不重复'},
              {value: 'repeat', label: '重复'},
              {value: 'repeat-x', label: '水平重复'},
              {value: 'repeat-y', label: '垂直重复'}
            ]}
            onChange={(val) => handleNestedContentChange('repeat', val)}
            tooltip="背景图片的重复方式"
          />
          
          <TextInput
            label="背景位置"
            value={content?.position || 'center'}
            onChange={(val) => handleNestedContentChange('position', val)}
            placeholder="center/top/50% 50%"
            tooltip="背景图片的位置"
          />
        </>
      )}
      
      {content?.type === 'color' && (
        <ColorInput
          label="背景颜色"
          value={content?.color}
          onChange={(val) => handleNestedContentChange('color', val)}
          tooltip="背景的颜色"
        />
      )}
      
      {content?.type === 'gradient' && (
        <>
          <SelectInput
            label="渐变类型"
            value={content?.gradientType || 'linear'}
            options={[
              {value: 'linear', label: '线性渐变'},
              {value: 'radial', label: '径向渐变'}
            ]}
            onChange={(val) => handleNestedContentChange('gradientType', val)}
            tooltip="渐变的类型"
          />
          
          <TextInput
            label="渐变方向"
            value={content?.gradientDirection || 'to bottom'}
            onChange={(val) => handleNestedContentChange('gradientDirection', val)}
            placeholder="例如: to bottom, 45deg"
            tooltip="线性渐变的方向"
          />
          
          <TextInput
            label="渐变颜色停止点"
            value={content?.gradientStops || '#ffffff, #000000'}
            onChange={(val) => handleNestedContentChange('gradientStops', val)}
            placeholder="例如: #fff 0%, #000 100%"
            tooltip="渐变的颜色停止点列表，用逗号分隔"
          />
        </>
      )}
      
      <SelectInput
        label="状态"
        value={content?.state || 'default'}
        options={[
          {value: 'default', label: '默认'},
          {value: 'loaded', label: '已加载'},
          {value: 'error', label: '加载失败'}
        ]}
        onChange={(val) => handleNestedContentChange('state', val)}
        tooltip="背景的加载状态"
      />
    </ConfigSection>
  );
};

export default BackgroundElementEditor;