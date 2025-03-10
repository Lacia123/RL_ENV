'use client';
import React from 'react';
import ConfigSection from '../config-sections/ConfigSection';
import TextInput from '../inputs/TextInput';
import ColorInput from '../inputs/ColorInput';
import SelectInput from '../inputs/SelectInput';

/**
 * 图标元素编辑器 - 用于编辑图标特有的属性
 * @param {Object} props
 * @param {Object} props.style - 当前样式对象
 * @param {Object} props.content - 图标内容
 * @param {Function} props.onStyleChange - 样式变更回调
 * @param {Function} props.onContentChange - 内容变更回调
 */
const IconElementEditor = ({ style, content, onStyleChange, onContentChange }) => {
  // 处理内容嵌套属性更新
  const handleNestedContentChange = (key, value) => {
    onContentChange(`content.${key}`, value);
  };
  
  // 常用图标列表
  const commonIcons = [
    {value: 'send', label: '发送 ✉️'},
    {value: 'user', label: '用户 👤'},
    {value: 'heart', label: '心形 ❤️'},
    {value: 'search', label: '搜索 🔍'},
    {value: 'star', label: '星星 ⭐'},
    {value: 'home', label: '家 🏠'},
    {value: 'settings', label: '设置 ⚙️'},
    {value: 'menu', label: '菜单 ☰'},
  ];
  
  return (
    <ConfigSection title="图标属性">
      <SelectInput
        label="图标名称"
        value={content?.icon}
        options={commonIcons}
        onChange={(val) => handleNestedContentChange('icon', val)}
        tooltip="选择预设图标"
      />
      
      <TextInput
        label="自定义图标"
        value={content?.customIcon}
        onChange={(val) => handleNestedContentChange('customIcon', val)}
        placeholder="输入自定义图标"
        tooltip="可以输入自定义图标名称或Emoji"
      />
      
      <ColorInput
        label="图标颜色"
        value={content?.color || style.color}
        onChange={(val) => {
          // 同时更新content中的颜色和style中的颜色
          handleNestedContentChange('color', val);
          onStyleChange('color', val);
        }}
        tooltip="图标的颜色"
      />
      
      <TextInput
        label="宽度"
        value={style.width}
        type="number"
        onChange={(val) => onStyleChange('width', val)}
        tooltip="图标的宽度(像素)"
      />
      
      <TextInput
        label="高度"
        value={style.height}
        type="number"
        onChange={(val) => onStyleChange('height', val)}
        tooltip="图标的高度(像素)"
      />
      
      <SelectInput
        label="大小预设"
        value={style.size || 'medium'}
        options={[
          {value: 'xsmall', label: '极小'},
          {value: 'small', label: '小'},
          {value: 'medium', label: '中'},
          {value: 'large', label: '大'},
          {value: 'xlarge', label: '极大'}
        ]}
        onChange={(val) => onStyleChange('size', val)}
        tooltip="预设的图标尺寸"
      />
      
      <TextInput
        label="旋转角度"
        value={style.rotate}
        type="number"
        min="0"
        max="360"
        onChange={(val) => onStyleChange('rotate', val)}
        tooltip="图标的旋转角度(0-360度)"
      />
      
      <SelectInput
        label="动画效果"
        value={style.animation || 'none'}
        options={[
          {value: 'none', label: '无'},
          {value: 'spin', label: '旋转'},
          {value: 'pulse', label: '脉冲'},
          {value: 'bounce', label: '弹跳'}
        ]}
        onChange={(val) => onStyleChange('animation', val)}
        tooltip="图标的动画效果"
      />
    </ConfigSection>
  );
};

export default IconElementEditor;