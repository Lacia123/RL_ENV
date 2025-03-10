'use client';
import React, { useState } from 'react';
import { elementDefinitions } from '@/app/utils/elementDefinitions';

// 获取元素类型下拉选项（排除背景类型）
const elementTypeOptions = Object.keys(elementDefinitions)
  .filter(type => type !== 'background') // 背景作为特殊类型单独处理
  .map(type => ({
    value: type,
    label: type.charAt(0).toUpperCase() + type.slice(1)
  }));

/**
 * 添加组件面板 - 用于向容器元素添加子组件
 * @param {Object} props
 * @param {Function} props.onAddComponent - 添加组件回调
 * @param {Object} props.parentElement - 父容器元素
 * @param {string} props.className - 额外的CSS类
 */
const AddComponentPanel = ({ onAddComponent, parentElement, className = "" }) => {
  const [selectedType, setSelectedType] = useState('container');
  const [elementName, setElementName] = useState('');
  
  const handleAddComponent = () => {
    onAddComponent(selectedType, elementName);
    setElementName(''); // 清空名称输入
  };
  
  return (
    <div className={`mb-6 p-4 border rounded-md bg-gray-50 ${className}`}>
      <h4 className="text-md font-medium mb-3">
        添加组件到 {parentElement?.id || 'root'}
      </h4>
      
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">组件类型</label>
        <select
          className="w-full border rounded p-2 text-sm"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          {elementTypeOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      <div className="mb-3">
        <label className="block text-sm font-medium mb-1">
          组件名称 <span className="text-gray-400 text-xs">(可选)</span>
        </label>
        <input
          type="text"
          className="w-full border rounded p-2 text-sm"
          value={elementName}
          onChange={(e) => setElementName(e.target.value)}
          placeholder="输入组件名称，用于标识"
        />
      </div>
      
      <div className="flex justify-end">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          onClick={handleAddComponent}
        >
          添加组件
        </button>
      </div>
    </div>
  );
};

export default AddComponentPanel;