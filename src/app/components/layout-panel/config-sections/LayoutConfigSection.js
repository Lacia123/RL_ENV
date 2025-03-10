'use client';
import React from 'react';
import ConfigSection from './ConfigSection';
import SelectInput from '../inputs/SelectInput';
import TextInput from '../inputs/TextInput';

/**
 * 布局配置部分 - 用于配置元素的布局相关属性
 * @param {Object} props
 * @param {Object} props.style - 当前样式对象
 * @param {Function} props.onStyleChange - 样式变更回调
 */
const LayoutConfigSection = ({ style, onStyleChange }) => {
  return (
    <>
      <ConfigSection 
        title="布局方向"
        description="设置元素的排列方向和对齐方式"
      >
        <SelectInput
          label="方向"
          value={style.direction}
          options={[
            {value: 'column', label: '列(垂直)'},
            {value: 'row', label: '行(水平)'},
            {value: 'none', label: '无'}
          ]}
          tooltip="元素内部的排列方向"
          onChange={(val) => onStyleChange('direction', val)}
        />
        <SelectInput
          label="主轴对齐"
          value={style.justifyContent}
          options={[
            {value: 'flex-start', label: '起点'},
            {value: 'center', label: '居中'},
            {value: 'flex-end', label: '终点'},
            {value: 'space-between', label: '两端对齐'},
            {value: 'space-around', label: '环绕'},
            {value: 'space-evenly', label: '均匀分布'}
          ]}
          tooltip="元素在主轴方向上的对齐方式"
          onChange={(val) => onStyleChange('justifyContent', val)}
        />
        <SelectInput
          label="交叉轴对齐"
          value={style.alignItems}
          options={[
            {value: 'flex-start', label: '起点'},
            {value: 'center', label: '居中'},
            {value: 'flex-end', label: '终点'},
            {value: 'stretch', label: '拉伸'}
          ]}
          tooltip="元素在交叉轴方向上的对齐方式"
          onChange={(val) => onStyleChange('alignItems', val)}
        />
        <TextInput
          label="间距"
          value={style.gap}
          type="number"
          tooltip="元素之间的间距"
          onChange={(val) => onStyleChange('gap', val)}
        />
      </ConfigSection>
      
      <ConfigSection 
        title="尺寸设置"
        description="配置元素的尺寸模式和具体尺寸"
      >
        <SelectInput
          label="主轴尺寸模式"
          value={style.primaryAxisSizingMode}
          options={[
            {value: 'fixed', label: '固定尺寸'},
            {value: 'auto', label: '自动'},
            {value: 'fix-content', label: '适应内容'},
            {value: 'responsive', label: '响应式'}
          ]}
          tooltip="决定元素在主轴方向上如何调整大小"
          onChange={(val) => onStyleChange('primaryAxisSizingMode', val)}
        />
        <SelectInput
          label="交叉轴尺寸模式"
          value={style.counterAxisSizingMode}
          options={[
            {value: 'fixed', label: '固定尺寸'},
            {value: 'auto', label: '自动'},
            {value: 'fix-content', label: '适应内容'}
          ]}
          tooltip="决定元素在交叉轴方向上如何调整大小"
          onChange={(val) => onStyleChange('counterAxisSizingMode', val)}
        />
        <TextInput
          label="宽度"
          value={style.width}
          onChange={(val) => onStyleChange('width', val)}
          placeholder="auto/fix-content/数值"
          tooltip="元素的宽度，可以是具体数值或特殊值"
        />
        <TextInput
          label="高度"
          value={style.height}
          onChange={(val) => onStyleChange('height', val)}
          placeholder="auto/fix-content/数值"
          tooltip="元素的高度，可以是具体数值或特殊值"
        />
        <TextInput
          label="最小宽度"
          value={style.minWidth}
          type="number"
          tooltip="元素的最小宽度"
          onChange={(val) => onStyleChange('minWidth', val)}
        />
        <TextInput
          label="最小高度"
          value={style.minHeight}
          type="number"
          tooltip="元素的最小高度"
          onChange={(val) => onStyleChange('minHeight', val)}
        />
        <TextInput
          label="最大宽度"
          value={style.maxWidth}
          type="number"
          tooltip="元素的最大宽度"
          onChange={(val) => onStyleChange('maxWidth', val)}
        />
        <TextInput
          label="最大高度"
          value={style.maxHeight}
          type="number"
          tooltip="元素的最大高度"
          onChange={(val) => onStyleChange('maxHeight', val)}
        />
        <TextInput
          label="伸展因子"
          value={style.grow}
          type="number"
          min="0"
          max="10"
          tooltip="元素在剩余空间中的伸展比例"
          onChange={(val) => onStyleChange('grow', val)}
        />
      </ConfigSection>
      
      <ConfigSection 
        title="边距设置"
        description="配置元素的外边距"
      >
        <TextInput
          label="上边距"
          value={style.marginTop}
          type="number"
          tooltip="元素顶部的外边距"
          onChange={(val) => onStyleChange('marginTop', val)}
        />
        <TextInput
          label="右边距"
          value={style.marginRight}
          type="number"
          tooltip="元素右侧的外边距"
          onChange={(val) => onStyleChange('marginRight', val)}
        />
        <TextInput
          label="下边距"
          value={style.marginBottom}
          type="number"
          tooltip="元素底部的外边距"
          onChange={(val) => onStyleChange('marginBottom', val)}
        />
        <TextInput
          label="左边距"
          value={style.marginLeft}
          type="number"
          tooltip="元素左侧的外边距"
          onChange={(val) => onStyleChange('marginLeft', val)}
        />
      </ConfigSection>
      
      <ConfigSection 
        title="内边距设置"
        description="配置元素的内边距"
      >
        <TextInput
          label="上内边距"
          value={style.paddingTop}
          type="number"
          tooltip="元素顶部的内边距"
          onChange={(val) => onStyleChange('paddingTop', val)}
        />
        <TextInput
          label="右内边距"
          value={style.paddingRight}
          type="number"
          tooltip="元素右侧的内边距"
          onChange={(val) => onStyleChange('paddingRight', val)}
        />
        <TextInput
          label="下内边距"
          value={style.paddingBottom}
          type="number"
          tooltip="元素底部的内边距"
          onChange={(val) => onStyleChange('paddingBottom', val)}
        />
        <TextInput
          label="左内边距"
          value={style.paddingLeft}
          type="number"
          tooltip="元素左侧的内边距"
          onChange={(val) => onStyleChange('paddingLeft', val)}
        />
      </ConfigSection>
    </>
  );
};

export default LayoutConfigSection;