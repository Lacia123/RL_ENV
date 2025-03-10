'use client';
import React from 'react';
import ConfigSection from '../config-sections/ConfigSection';
import SelectInput from '../inputs/SelectInput';
import TextInput from '../inputs/TextInput';
import ColorInput from '../inputs/ColorInput';

/**
 * 分割线元素编辑器 - 用于编辑分割线特有的属性
 * @param {Object} props
 * @param {Object} props.style - 当前样式对象
 * @param {Function} props.onStyleChange - 样式变更回调
 */
const DividerElementEditor = ({ style, onStyleChange }) => {
  return (
    <ConfigSection title="分割线属性">
      <SelectInput
        label="方向"
        value={style.direction}
        options={[
          {value: 'horizontal', label: '水平'},
          {value: 'vertical', label: '垂直'}
        ]}
        onChange={(val) => onStyleChange('direction', val)}
        tooltip="分割线的方向"
      />
      
      <TextInput
        label="粗细"
        value={style.thickness}
        type="number"
        min="1"
        onChange={(val) => onStyleChange('thickness', val)}
        tooltip="分割线的粗细(像素)"
      />
      
      <ColorInput
        label="颜色"
        value={style.color}
        onChange={(val) => onStyleChange('color', val)}
        tooltip="分割线的颜色"
      />
      
      <SelectInput
        label="样式"
        value={style.style}
        options={[
          {value: 'solid', label: '实线'},
          {value: 'dashed', label: '虚线'},
          {value: 'dotted', label: '点线'}
        ]}
        onChange={(val) => onStyleChange('style', val)}
        tooltip="分割线的线条样式"
      />
      
      <TextInput
        label="长度"
        value={style.length}
        onChange={(val) => onStyleChange('length', val)}
        tooltip="分割线的长度，可以是像素值或百分比(如100%)"
        placeholder="像素值或百分比"
      />
      
      <TextInput
        label="间距"
        value={style.margin}
        onChange={(val) => onStyleChange('margin', val)}
        tooltip="分割线与相邻元素的间距"
        placeholder="像素值"
      />
      
      <SelectInput
        label="对齐方式"
        value={style.align || 'center'}
        options={[
          {value: 'start', label: '开始对齐'},
          {value: 'center', label: '居中'},
          {value: 'end', label: '末端对齐'}
        ]}
        onChange={(val) => onStyleChange('align', val)}
        tooltip="分割线在容器中的对齐方式"
      />
    </ConfigSection>
  );
};

export default DividerElementEditor;