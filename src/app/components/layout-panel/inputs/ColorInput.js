'use client';
import React from 'react';

/**
 * 颜色输入组件
 * @param {Object} props
 * @param {string} props.label - 输入框标签
 * @param {string} props.value - 当前颜色值
 * @param {Function} props.onChange - 值变更回调函数
 * @param {string} props.className - 额外的CSS类
 * @param {string} props.tooltip - 悬停提示
 */
const ColorInput = ({ 
  label, 
  value, 
  onChange, 
  className = "",
  tooltip
}) => {
  // 确保颜色值有效
  const safeColorValue = value || '';
  const colorDisplay = safeColorValue.trim() ? safeColorValue : '#FFFFFF';
  
  return (
    <div className={`${className}`}>
      <label className="block text-sm font-medium mb-1">
        {label}
        {tooltip && (
          <span 
            className="ml-1 text-gray-400 cursor-help"
            title={tooltip}
          >
            ?
          </span>
        )}
      </label>
      <div className="flex items-center">
        <div 
          className="relative mr-2"
          style={{ width: '36px', height: '36px' }}
        >
          <input
            type="color"
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            value={colorDisplay}
            onChange={(e) => onChange(e.target.value)}
          />
          <div 
            className="w-full h-full rounded border border-gray-300"
            style={{ backgroundColor: colorDisplay }}
          />
        </div>
        <input
          type="text"
          className="flex-1 border rounded p-2 text-sm"
          value={safeColorValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#RRGGBB 或 rgba()"
        />
      </div>
    </div>
  );
};

export default ColorInput;