'use client';
import React, { useState, useEffect } from 'react';

/**
 * JSON输入面板组件 - 允许用户直接输入JSON配置布局
 * 
 * @param {Object} props
 * @param {Object} props.initialJson - 初始JSON字符串
 * @param {Function} props.onJsonChange - JSON变更回调函数
 * @param {Function} props.onApplyJson - 应用JSON到布局的回调函数
 */
const JsonInputPanel = ({ initialJson = '', onJsonChange, onApplyJson }) => {
  const [jsonInput, setJsonInput] = useState(initialJson);
  const [error, setError] = useState('');
  const [isValid, setIsValid] = useState(true);

  // 当传入新的initialJson时更新
  useEffect(() => {
    if (initialJson !== jsonInput) {
      setJsonInput(initialJson);
      validateJson(initialJson);
    }
  }, [initialJson]);

  // 验证JSON格式
  const validateJson = (jsonStr) => {
    try {
      // 确保JSON可以被正确解析
      JSON.parse(jsonStr);
      setIsValid(true);
      setError('');
      return true;
    } catch (err) {
      setIsValid(false);
      setError(`JSON解析错误: ${err.message}`);
      return false;
    }
  };

  // 处理文本变更
  const handleChange = (e) => {
    const newValue = e.target.value;
    setJsonInput(newValue);
    validateJson(newValue);
    
    // 回调通知外部组件
    if (onJsonChange) {
      onJsonChange(newValue);
    }
  };

  // 应用JSON到布局
  const handleApply = () => {
    if (!isValid) return;
    
    try {
      const parsedJson = JSON.parse(jsonInput);
      if (onApplyJson) {
        onApplyJson(parsedJson);
      }
    } catch (err) {
      setError(`应用JSON时出错: ${err.message}`);
    }
  };

  // 恢复示例布局
  const handleRestoreExample = () => {
    // 导入示例布局并转换为字符串
    import('../layout-editor/exampleLayout').then(module => {
      const exampleJson = JSON.stringify(module.exampleLayout, null, 2);
      setJsonInput(exampleJson);
      validateJson(exampleJson);
      if (onJsonChange) {
        onJsonChange(exampleJson);
      }
    });
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm">
      <div className="border-b p-3 flex justify-between items-center">
        <h3 className="text-lg font-medium">JSON布局配置</h3>
        <div className="space-x-2">
          <button
            className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
            onClick={handleRestoreExample}
          >
            恢复示例
          </button>
          <button
            className={`px-3 py-1 text-sm rounded ${
              isValid 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            onClick={handleApply}
            disabled={!isValid}
          >
            应用JSON
          </button>
        </div>
      </div>
      
      <div className="p-4">
        <textarea
          className={`w-full h-96 font-mono text-sm p-3 border rounded ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          value={jsonInput}
          onChange={handleChange}
          placeholder="请输入有效的JSON布局配置..."
        />
        
        {error && (
          <div className="mt-2 text-red-500 text-sm">
            {error}
          </div>
        )}
        
        <div className="mt-4 text-sm text-gray-500">
          <p>提示：JSON布局配置应包含元素类型、预设和内容属性</p>
          <p>示例：{"{ \"type\": \"container\", \"layoutPreset\": \"vertical-centered\", \"children\": [] }"}</p>
        </div>
      </div>
    </div>
  );
};

export default JsonInputPanel;