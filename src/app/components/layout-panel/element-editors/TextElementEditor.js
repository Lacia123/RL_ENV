'use client';
import React from 'react';
import ConfigSection from '../config-sections/ConfigSection';
import TextInput from '../inputs/TextInput';
import SelectInput from '../inputs/SelectInput';
import ColorInput from '../inputs/ColorInput';

/**
 * 文本元素编辑器 - 用于编辑文本特有的属性
 * @param {Object} props
 * @param {Object} props.style - 当前样式对象
 * @param {string|Object} props.content - 文本内容
 * @param {Function} props.onStyleChange - 样式变更回调
 * @param {Function} props.onContentChange - 内容变更回调
 */
const TextElementEditor = ({ style, content, onStyleChange, onContentChange }) => {
  // 处理文本内容更新
  const handleContentChange = (value) => {
    onContentChange('content', value);
  };
  
  return (
    <ConfigSection
      title="文本属性"
      description="编辑文本的特定属性"
      defaultCollapsed={true} // 默认折叠
    >
      <TextInput
        label="文本内容"
        value={typeof content === 'string' ? content : content?.value}
        onChange={handleContentChange}
        tooltip="元素显示的文本"
      />
      
      <SelectInput
        label="文本对齐"
        value={style?.align}
        options={[
          {value: 'left', label: '左对齐'},
          {value: 'center', label: '居中'},
          {value: 'right', label: '右对齐'},
          {value: 'justify', label: '两端对齐'},
          {value: 'inherit', label: '继承'}
        ]}
        tooltip="文本的对齐方式"
        onChange={(val) => onStyleChange('align', val)}
      />
      
      <SelectInput
        label="断字规则"
        value={style?.wordBreak}
        options={[
          {value: 'normal', label: '正常'},
          {value: 'break-all', label: '全部断开'},
          {value: 'keep-all', label: '保持全部'},
          {value: 'break-word', label: '按词断开'}
        ]}
        tooltip="文本的断字处理方式"
        onChange={(val) => onStyleChange('wordBreak', val)}
      />
      
      <TextInput
        label="字体大小"
        value={style?.fontSize}
        onChange={(val) => onStyleChange('fontSize', val)}
        tooltip="文本的字体大小"
        placeholder="像素值或预设名"
      />
      
      <TextInput
        label="字重"
        value={style?.fontWeight}
        onChange={(val) => onStyleChange('fontWeight', val)}
        tooltip="文本的字体粗细"
        placeholder="normal/bold/数值"
      />
      
      <ColorInput
        label="文本颜色"
        value={style?.color}
        tooltip="文本的颜色"
        onChange={(val) => onStyleChange('color', val)}
      />
      
      <TextInput
        label="行高"
        value={style?.lineHeight}
        onChange={(val) => onStyleChange('lineHeight', val)}
        tooltip="文本的行间距"
        placeholder="normal/数值/百分比"
      />
      
      <TextInput
        label="字间距"
        value={style?.letterSpacing}
        onChange={(val) => onStyleChange('letterSpacing', val)}
        tooltip="文本的字符间距"
        placeholder="normal/像素值"
      />
      
      <SelectInput
        label="文本变换"
        value={style?.textTransform}
        options={[
          {value: 'none', label: '无'},
          {value: 'uppercase', label: '大写'},
          {value: 'lowercase', label: '小写'},
          {value: 'capitalize', label: '首字母大写'}
        ]}
        tooltip="文本大小写转换"
        onChange={(val) => onStyleChange('textTransform', val)}
      />
      
      <SelectInput
        label="字体样式"
        value={style?.fontStyle}
        options={[
          {value: 'normal', label: '正常'},
          {value: 'italic', label: '斜体'},
          {value: 'oblique', label: '倾斜'}
        ]}
        tooltip="文本的字体样式"
        onChange={(val) => onStyleChange('fontStyle', val)}
      />
    </ConfigSection>
  );
};

export default TextElementEditor;