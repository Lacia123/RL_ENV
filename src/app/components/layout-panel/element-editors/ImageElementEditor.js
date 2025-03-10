'use client';
import React from 'react';
import ConfigSection from '../config-sections/ConfigSection';
import TextInput from '../inputs/TextInput';
import SelectInput from '../inputs/SelectInput';

/**
 * 图片元素编辑器 - 用于编辑图片特有的属性
 * @param {Object} props
 * @param {Object} props.style - 当前样式对象
 * @param {Object} props.content - 图片内容
 * @param {Function} props.onStyleChange - 样式变更回调
 * @param {Function} props.onContentChange - 内容变更回调
 */
const ImageElementEditor = ({ style, content, onStyleChange, onContentChange }) => {
  // 处理内容嵌套属性更新
  const handleNestedContentChange = (key, value) => {
    onContentChange(`content.${key}`, value);
  };
  
  return (
    <ConfigSection title="图片属性">
      <TextInput
        label="图片链接"
        value={content?.src}
        onChange={(val) => handleNestedContentChange('src', val)}
        placeholder="URL地址"
        tooltip="图片的链接地址"
      />
      
      <TextInput
        label="替代文本"
        value={content?.alt}
        onChange={(val) => handleNestedContentChange('alt', val)}
        tooltip="当图片无法加载时显示的文本，对无障碍访问很重要"
      />
      
      <SelectInput
        label="填充模式"
        value={style.objectFit}
        options={[
          {value: 'cover', label: '覆盖 - 填满区域可能裁剪'},
          {value: 'contain', label: '包含 - 完整显示可能留白'},
          {value: 'fill', label: '填充 - 可能变形'},
          {value: 'none', label: '无 - 原始尺寸'},
          {value: 'scale-down', label: '缩小 - 适应容器'}
        ]}
        onChange={(val) => onStyleChange('objectFit', val)}
        tooltip="图片如何适应其容器尺寸"
      />
      
      <SelectInput
        label="对齐位置"
        value={style.objectPosition}
        options={[
          {value: 'center', label: '居中'},
          {value: 'top', label: '顶部'},
          {value: 'bottom', label: '底部'},
          {value: 'left', label: '左侧'},
          {value: 'right', label: '右侧'},
          {value: 'top left', label: '左上角'},
          {value: 'top right', label: '右上角'},
          {value: 'bottom left', label: '左下角'},
          {value: 'bottom right', label: '右下角'}
        ]}
        onChange={(val) => onStyleChange('objectPosition', val)}
        tooltip="当图片被裁剪或留白时的对齐位置"
      />
      
      <SelectInput
        label="加载中图片"
        value={content?.loading || 'eager'}
        options={[
          {value: 'eager', label: '立即加载'},
          {value: 'lazy', label: '延迟加载'}
        ]}
        onChange={(val) => handleNestedContentChange('loading', val)}
        tooltip="图片的加载策略，延迟加载可以提高页面性能"
      />
      
      <TextInput
        label="最大宽度"
        value={style.maxWidth}
        type="number"
        onChange={(val) => onStyleChange('maxWidth', val)}
        tooltip="图片的最大宽度限制"
      />
      
      <TextInput
        label="最大高度"
        value={style.maxHeight}
        type="number"
        onChange={(val) => onStyleChange('maxHeight', val)}
        tooltip="图片的最大高度限制"
      />
      
      <SelectInput
        label="状态"
        value={content?.state || 'default'}
        options={[
          {value: 'default', label: '默认'},
          {value: 'loaded', label: '已加载'},
          {value: 'error', label: '加载失败'}
        ]}
        onChange={(val) => handleNestedContentChange('state', val)}
        tooltip="图片的加载状态"
      />
    </ConfigSection>
  );
};

export default ImageElementEditor;