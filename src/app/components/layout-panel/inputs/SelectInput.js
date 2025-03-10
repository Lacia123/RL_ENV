'use client';
import React from 'react';

/**
 * 通用的下拉选择组件
 * @param {Object} props
 * @param {string} props.label - 输入框标签
 * @param {string} props.value - 当前值
 * @param {Array} props.options - 选项数组，每个选项为{value, label}
 * @param {Function} props.onChange - 值变更回调函数
 * @param {string} props.className - 额外的CSS类
 */
const SelectInput = ({ 
  label, 
  value, 
  options, 
  onChange, 
  className = "",
  tooltip
}) => (
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
    <select
      className="w-full border rounded p-2 text-sm"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export default SelectInput;