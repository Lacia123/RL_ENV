'use client';
import React from 'react';
import { elementDefinitions } from '@/app/utils/elementDefinitions';

/**
 * 预设选择器组件 - 用于从元素定义中选择并应用预设样式
 * @param {Object} props
 * @param {string} props.elementType - 元素类型
 * @param {string} props.currentPreset - 当前选中的预设名称
 * @param {Function} props.onPresetSelect - 预设选择回调
 * @param {string} props.className - 额外的CSS类
 */
const PresetSelector = ({ elementType, currentPreset, onPresetSelect, className = "" }) => {
  // 获取当前元素类型的所有预设
  const presets = elementDefinitions[elementType]?.presets || {};
  const presetOptions = Object.keys(presets).map(name => ({ value: name, label: name }));
  
  // 如果没有预设，不渲染任何内容
  if (presetOptions.length === 0) return null;
  
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-medium mb-2">应用预设样式</label>
      <div className="flex flex-wrap gap-2">
        {presetOptions.map(preset => {
          const isActive = preset.value === currentPreset;
          return (
            <button
              key={preset.value}
              onClick={() => onPresetSelect(preset.value)}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-blue-600 text-white font-medium border-2 border-blue-600"
                  : "bg-blue-100 text-blue-800 hover:bg-blue-200 border-2 border-transparent"
              }`}
              title={`应用${preset.label}预设`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-gray-500 mt-1">点击预设按钮可快速应用预定义样式组合</p>
    </div>
  );
};

export default PresetSelector;