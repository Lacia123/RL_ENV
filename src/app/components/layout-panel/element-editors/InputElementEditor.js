'use client';
import React from 'react';
import ConfigSection from '../config-sections/ConfigSection';
import TextInput from '../inputs/TextInput';
import SelectInput from '../inputs/SelectInput';
import ColorInput from '../inputs/ColorInput';

/**
 * 输入框元素编辑器 - 用于编辑输入框特有的属性
 * @param {Object} props
 * @param {Object} props.style - 当前样式对象
 * @param {Object} props.content - 输入框内容
 * @param {Function} props.onStyleChange - 样式变更回调
 * @param {Function} props.onContentChange - 内容变更回调
 */
const InputElementEditor = ({ style, content, onStyleChange, onContentChange }) => {
  // 处理内容嵌套属性更新
  const handleNestedContentChange = (key, value) => {
    onContentChange(`content.${key}`, value);
  };
  
  return (
    <ConfigSection title="输入框属性">
      <TextInput
        label="占位文本"
        value={content?.placeholder}
        onChange={(val) => handleNestedContentChange('placeholder', val)}
        tooltip="输入框未输入内容时显示的提示文本"
      />
      
      <TextInput
        label="字段名"
        value={content?.field}
        onChange={(val) => handleNestedContentChange('field', val)}
        tooltip="表单提交时的字段名称"
      />
      
      <TextInput
        label="默认值"
        value={content?.value}
        onChange={(val) => handleNestedContentChange('value', val)}
        tooltip="输入框的初始默认值"
      />
      
      <SelectInput
        label="输入类型"
        value={content?.type}
        options={[
          {value: 'text', label: '文本'},
          {value: 'password', label: '密码'},
          {value: 'number', label: '数字'},
          {value: 'email', label: '邮箱'},
          {value: 'tel', label: '电话'},
          {value: 'date', label: '日期'},
          {value: 'time', label: '时间'},
          {value: 'url', label: 'URL地址'}
        ]}
        onChange={(val) => handleNestedContentChange('type', val)}
        tooltip="输入框的数据类型"
      />
      
      <ColorInput
        label="边框颜色"
        value={style.borderColor}
        onChange={(val) => onStyleChange('borderColor', val)}
        tooltip="输入框的边框颜色"
      />
      
      <ColorInput
        label="背景颜色"
        value={style.backgroundColor}
        onChange={(val) => onStyleChange('backgroundColor', val)}
        tooltip="输入框的背景颜色"
      />
      
      <ColorInput
        label="文本颜色"
        value={style.color}
        onChange={(val) => onStyleChange('color', val)}
        tooltip="输入框文本的颜色"
      />
      
      <ColorInput
        label="占位符颜色"
        value={style.placeholderColor}
        onChange={(val) => onStyleChange('placeholderColor', val)}
        tooltip="占位文本的颜色"
      />
      
      <TextInput
        label="字体大小"
        value={style.fontSize}
        onChange={(val) => onStyleChange('fontSize', val)}
        tooltip="输入框文本的字体大小"
      />
      
      <TextInput
        label="最小宽度"
        value={style.minWidth}
        type="number"
        onChange={(val) => onStyleChange('minWidth', val)}
        tooltip="输入框的最小宽度"
      />
      
      <TextInput
        label="最小高度"
        value={style.minHeight}
        type="number"
        onChange={(val) => onStyleChange('minHeight', val)}
        tooltip="输入框的最小高度"
      />
      
      <SelectInput
        label="可读状态"
        value={content?.readOnly ? 'true' : 'false'}
        options={[
          {value: 'false', label: '可编辑'},
          {value: 'true', label: '只读'}
        ]}
        onChange={(val) => handleNestedContentChange('readOnly', val === 'true')}
        tooltip="设置输入框是否为只读状态"
      />
      
      <SelectInput
        label="必填状态"
        value={content?.required ? 'true' : 'false'}
        options={[
          {value: 'false', label: '选填'},
          {value: 'true', label: '必填'}
        ]}
        onChange={(val) => handleNestedContentChange('required', val === 'true')}
        tooltip="设置输入框是否为必填项"
      />
    </ConfigSection>
  );
};

export default InputElementEditor;