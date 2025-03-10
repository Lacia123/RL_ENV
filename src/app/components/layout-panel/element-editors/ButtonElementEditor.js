'use client';
import React from 'react';
import ConfigSection from '../config-sections/ConfigSection';
import TextInput from '../inputs/TextInput';
import SelectInput from '../inputs/SelectInput';
import ColorInput from '../inputs/ColorInput';

/**
 * 按钮元素编辑器 - 用于编辑按钮特有的属性
 * @param {Object} props
 * @param {Object} props.style - 当前样式对象
 * @param {Object} props.content - 按钮内容
 * @param {Object} props.action - 按钮动作
 * @param {Function} props.onStyleChange - 样式变更回调
 * @param {Function} props.onContentChange - 内容变更回调
 * @param {Function} props.onActionChange - 动作变更回调
 */
const ButtonElementEditor = ({ 
  style, 
  content, 
  action, 
  onStyleChange, 
  onContentChange, 
  onActionChange 
}) => {
  // 处理内容嵌套属性更新
  const handleNestedContentChange = (key, value) => {
    onContentChange(`content.${key}`, value);
  };
  
  // 处理动作属性更新
  const handleActionChange = (key, value) => {
    if (onActionChange) {
      onActionChange(`action.${key}`, value);
    }
  };
  
  return (
    <>
      <ConfigSection
        title="按钮内容"
        description="配置按钮显示的文本和图标"
        defaultCollapsed={true}
      >
        <TextInput
          label="按钮文本"
          value={content?.text}
          onChange={(val) => handleNestedContentChange('text', val)}
          tooltip="按钮上显示的文字"
        />
        
        <TextInput
          label="图标"
          value={content?.icon}
          onChange={(val) => handleNestedContentChange('icon', val)}
          placeholder="图标名称"
          tooltip="按钮上显示的图标名称"
        />
        
        <SelectInput
          label="图标位置"
          value={content?.iconPosition}
          options={[
            {value: 'left', label: '左侧'},
            {value: 'right', label: '右侧'}
          ]}
          onChange={(val) => handleNestedContentChange('iconPosition', val)}
          tooltip="图标相对于文本的位置"
        />
        
        <TextInput
          label="字体大小"
          value={content?.fontSize}
          onChange={(val) => handleNestedContentChange('fontSize', val)}
          tooltip="按钮文本的字体大小"
        />
      </ConfigSection>
      
      <ConfigSection
        title="按钮样式"
        description="配置按钮的视觉样式"
        defaultCollapsed={true}
      >
        <ColorInput
          label="背景颜色"
          value={style?.backgroundColor}
          onChange={(val) => onStyleChange('backgroundColor', val)}
          tooltip="按钮的背景色"
        />
        
        <ColorInput
          label="文字颜色"
          value={style?.color || content?.color}
          onChange={(val) => onStyleChange('color', val)}
          tooltip="按钮文字的颜色"
        />
        
        <ColorInput
          label="悬停颜色"
          value={style?.hoverColor}
          onChange={(val) => onStyleChange('hoverColor', val)}
          tooltip="鼠标悬停时按钮的背景色"
        />
        
        <ColorInput
          label="激活颜色"
          value={style?.activeColor}
          onChange={(val) => onStyleChange('activeColor', val)}
          tooltip="点击时按钮的背景色"
        />
        
        <TextInput
          label="最小宽度"
          value={style?.minWidth}
          type="number"
          onChange={(val) => onStyleChange('minWidth', val)}
          tooltip="按钮的最小宽度"
        />
        
        <TextInput
          label="最小高度"
          value={style?.minHeight}
          type="number"
          onChange={(val) => onStyleChange('minHeight', val)}
          tooltip="按钮的最小高度"
        />
      </ConfigSection>
      
      <ConfigSection
        title="按钮行为"
        description="配置点击按钮时触发的操作"
        defaultCollapsed={true}
      >
        <SelectInput
          label="动作类型"
          value={action?.type}
          options={[
            {value: 'submit', label: '提交表单'},
            {value: 'link', label: '链接跳转'},
            {value: 'function', label: '执行函数'}
          ]}
          onChange={(val) => handleActionChange('type', val)}
          tooltip="点击按钮时触发的动作类型"
        />
        
        {action?.type === 'link' && (
          <TextInput
            label="链接地址"
            value={action?.target}
            onChange={(val) => handleActionChange('target', val)}
            placeholder="http://..."
            tooltip="跳转的URL地址"
          />
        )}
        
        {action?.type === 'function' && (
          <TextInput
            label="函数名称"
            value={action?.target}
            onChange={(val) => handleActionChange('target', val)}
            placeholder="函数名"
            tooltip="要调用的函数名称"
          />
        )}
      </ConfigSection>
    </>
  );
};

export default ButtonElementEditor;