'use client';
import React from 'react';
import ConfigSection from './ConfigSection';
import SelectInput from '../inputs/SelectInput';
import TextInput from '../inputs/TextInput';
import ColorInput from '../inputs/ColorInput';

/**
 * 外观配置部分 - 用于配置元素的视觉样式相关属性
 * @param {Object} props
 * @param {Object} props.style - 当前样式对象
 * @param {Function} props.onStyleChange - 样式变更回调
 */
const AppearanceConfigSection = ({ style, onStyleChange }) => {
  return (
    <ConfigSection 
      title="外观设置"
      description="配置元素的视觉样式，如颜色、边框和阴影"
    >
      <TextInput
        label="圆角"
        value={style.borderRadius}
        type="number"
        tooltip="元素的圆角半径，单位为像素"
        onChange={(val) => onStyleChange('borderRadius', val)}
      />
      <TextInput
        label="边框宽度"
        value={style.borderWidth}
        type="number"
        tooltip="元素的边框宽度，单位为像素"
        onChange={(val) => onStyleChange('borderWidth', val)}
      />
      <ColorInput
        label="边框颜色"
        value={style.borderColor}
        tooltip="元素的边框颜色"
        onChange={(val) => onStyleChange('borderColor', val)}
      />
      <SelectInput
        label="边框样式"
        value={style.borderStyle}
        options={[
          {value: 'solid', label: '实线'},
          {value: 'dashed', label: '虚线'},
          {value: 'dotted', label: '点线'},
          {value: 'none', label: '无'}
        ]}
        tooltip="边框的线条样式"
        onChange={(val) => onStyleChange('borderStyle', val)}
      />
      <ColorInput
        label="背景颜色"
        value={style.backgroundColor}
        tooltip="元素的背景颜色"
        onChange={(val) => onStyleChange('backgroundColor', val)}
      />
      <SelectInput
        label="溢出处理"
        value={style.overflow}
        options={[
          {value: 'visible', label: '可见'},
          {value: 'hidden', label: '隐藏'},
          {value: 'auto', label: '自动'},
          {value: 'scroll', label: '滚动'}
        ]}
        tooltip="当内容超出元素尺寸时的处理方式"
        onChange={(val) => onStyleChange('overflow', val)}
      />
      <TextInput
        label="盒阴影"
        value={style.boxShadow}
        tooltip="元素的阴影效果，如'0px 4px 8px rgba(0, 0, 0, 0.1)'"
        onChange={(val) => onStyleChange('boxShadow', val)}
        placeholder="x轴 y轴 模糊 颜色"
      />
      <TextInput
        label="透明度"
        value={style.opacity}
        type="number"
        min="0"
        max="1"
        step="0.1"
        tooltip="元素的透明度，0完全透明到1完全不透明"
        onChange={(val) => onStyleChange('opacity', val)}
      />
      <TextInput
        label="z-index"
        value={style.zIndex}
        type="number"
        tooltip="元素的层叠顺序，数值越大越靠前显示"
        onChange={(val) => onStyleChange('zIndex', val)}
      />
      <SelectInput
        label="背景图像填充"
        value={style.backgroundSize}
        options={[
          {value: '', label: '默认'},
          {value: 'cover', label: '覆盖'},
          {value: 'contain', label: '包含'},
          {value: '100% 100%', label: '拉伸填充'}
        ]}
        tooltip="背景图像的填充方式"
        onChange={(val) => onStyleChange('backgroundSize', val)}
      />
      <TextInput
        label="背景图像"
        value={style.backgroundImage}
        tooltip="元素的背景图像URL或渐变"
        onChange={(val) => onStyleChange('backgroundImage', val)}
        placeholder="url() 或 linear-gradient()"
      />
    </ConfigSection>
  );
};

export default AppearanceConfigSection;