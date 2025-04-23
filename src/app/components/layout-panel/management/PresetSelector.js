'use client';
import React from 'react';
import { useSelector } from 'react-redux';
import { getComponentStates } from '@/app/utils/metaware/metawareToCss.js';
import { findElement } from '@/app/utils/layoutOperations.js';

/**
 * 预设选择器组件 - 用于应用元素的不同状态样式
 * @param {Object} props
 * @param {string} props.elementType - 元素类型
 * @param {string} props.currentPreset - 当前选中的预设状态
 * @param {Function} props.onPresetSelect - 预设选择回调
 * @param {string} props.className - 额外的CSS类
 */
const PresetSelector = ({ elementType, currentPreset, onPresetSelect, className = "" }) => {
  // 从Redux获取当前布局和选中元素ID
  const layout = useSelector(state => state.layout.layout);
  const selectedElementId = useSelector(state => state.layout.selectedElementId);
  
  // 获取选中元素
  const selectedElement = selectedElementId ? findElement(layout, selectedElementId) : null;
  
  // 获取元素应用的预设列表
  const appliedPresets = selectedElement?.presets || [];
  
  // 获取当前元素类型的所有可用状态
  let availableStates = [];
  try {
    availableStates = getComponentStates(elementType) || [];
  } catch (error) {
    console.warn(`无法获取元素类型 ${elementType} 的状态`, error);
  }
  
  // 将状态名称映射为更友好的显示名称
  const stateOptions = availableStates.map(state => ({ 
    value: state, 
    label: state.charAt(0).toUpperCase() + state.slice(1) 
  }));
  
  // 判断预设是否被选中（检查预设名称是否在应用的预设列表中）
  const isPresetSelected = (presetName) => {
    // 支持新格式（如 state:default）
    return appliedPresets.includes(presetName) || 
           // 向后兼容旧格式
           appliedPresets.includes(`state:${presetName}`);
  };
  
  // 选择预设时，确保互斥
  const handlePresetSelect = (presetValue) => {
    // 构建预设名称
    const presetName = `state:${presetValue}`;
    
    // 检查是否已选中
    const isSelected = isPresetSelected(presetName);
    
    if (isSelected) {
      // 如果已选中，则取消选择
      onPresetSelect(null);
    } else {
      // 如果未选中，替换所有同类别预设
      onPresetSelect(presetValue);
    }
  };
  
  // 如果没有可用状态，不渲染任何内容
  if (stateOptions.length === 0) return null;
  
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-medium mb-2">应用预设状态样式</label>
      <div className="flex flex-wrap gap-2">
        {stateOptions.map(preset => {
          // 检查这个预设是否被选中
          const isActive = isPresetSelected(`state:${preset.value}`) || preset.value === currentPreset;
          
          return (
            <button
              key={preset.value}
              onClick={() => handlePresetSelect(preset.value)}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-blue-600 text-white font-medium border-2 border-blue-600"
                  : "bg-blue-100 text-blue-800 hover:bg-blue-200 border-2 border-transparent"
              }`}
              title={`应用${preset.label}状态样式`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-gray-500 mt-1">点击预设按钮可快速应用不同状态的样式</p>
    </div>
  );
};

export default PresetSelector;