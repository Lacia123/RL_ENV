'use client';
import React from 'react';

/**
 * 通用的文本输入组件
 * @param {Object} props
 * @param {string} props.label - 输入框标签
 * @param {string|number} props.value - 当前值
 * @param {Function} props.onChange - 值变更回调函数
 * @param {string} props.type - 输入类型 (text, number, etc.)
 * @param {string} props.placeholder - 占位文本
 * @param {number} props.min - 最小值 (用于number类型)
 * @param {number} props.max - 最大值 (用于number类型)
 * @param {number} props.step - 步进值 (用于number类型)
 * @param {string} props.className - 额外的CSS类
 * @param {string} props.tooltip - 悬停提示
 */
const TextInput = ({ 
  label, 
  value, 
  onChange, 
  type = "text", 
  placeholder = "", 
  min, 
  max, 
  step,
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
    <input
      type={type}
      className="w-full border rounded p-2 text-sm"
      value={value ?? ''}
      onChange={(e) => {
        const val = type === "number" && e.target.value 
          ? Number(e.target.value) 
          : e.target.value;
        onChange(val);
      }}
      placeholder={placeholder}
      min={min}
      max={max}
      step={step}
    />
  </div>
);

export default TextInput;