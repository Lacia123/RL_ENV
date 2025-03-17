'use client';
import React, { useState, useEffect } from 'react';

/**
 * 画布设置面板 - 用于设置画布的宽度和高度
 * 
 * @param {Object} props
 * @param {number} props.initialWidth - 初始宽度
 * @param {number} props.initialHeight - 初始高度
 * @param {Function} props.onSizeChange - 尺寸变更回调 (width, height) => void
 */
const CanvasSettingsPanel = ({ initialWidth = 1024, initialHeight = 768, onSizeChange }) => {
  // 使用状态保存当前宽高值
  const [width, setWidth] = useState(initialWidth);
  const [height, setHeight] = useState(initialHeight);
  // 控制是否显示预设选项
  const [showPresets, setShowPresets] = useState(false);

  // 同步外部传入的初始值
  useEffect(() => {
    setWidth(initialWidth);
    setHeight(initialHeight);
  }, [initialWidth, initialHeight]);

  // 处理宽度变更
  const handleWidthChange = (e) => {
    const newWidth = parseInt(e.target.value, 10);
    if (!isNaN(newWidth) && newWidth > 0) {
      setWidth(newWidth);
      onSizeChange(newWidth, height);
    }
  };

  // 处理高度变更
  const handleHeightChange = (e) => {
    const newHeight = parseInt(e.target.value, 10);
    if (!isNaN(newHeight) && newHeight > 0) {
      setHeight(newHeight);
      onSizeChange(width, newHeight);
    }
  };

  // 应用预设尺寸
  const applyPreset = (presetWidth, presetHeight) => {
    setWidth(presetWidth);
    setHeight(presetHeight);
    onSizeChange(presetWidth, presetHeight);
    setShowPresets(false);
  };

  // 常用设备尺寸预设
  const presets = [
    { name: '移动设备 (小)', width: 320, height: 568 },
    { name: '移动设备 (中)', width: 375, height: 667 },
    { name: '移动设备 (大)', width: 414, height: 736 },
    { name: '平板 (竖屏)', width: 768, height: 1024 },
    { name: '平板 (横屏)', width: 1024, height: 768 },
    { name: '笔记本', width: 1366, height: 768 },
    { name: '桌面', width: 1920, height: 1080 },
  ];

  return (
    <div className="bg-white border rounded-lg shadow-sm p-4">
      <h3 className="text-lg font-medium mb-4">画布尺寸设置</h3>
      
      <div className="flex space-x-4 mb-4">
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-1">宽度 (px)</label>
          <input
            type="number"
            value={width}
            onChange={handleWidthChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            min="100"
            max="3840"
          />
        </div>
        <div className="w-1/2">
          <label className="block text-sm font-medium text-gray-700 mb-1">高度 (px)</label>
          <input
            type="number"
            value={height}
            onChange={handleHeightChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            min="100"
            max="2160"
          />
        </div>
      </div>
      
      <div className="mb-4">
        <button
          className="text-blue-600 text-sm hover:text-blue-800 flex items-center"
          onClick={() => setShowPresets(!showPresets)}
        >
          <span className="mr-1">{showPresets ? '▼' : '►'}</span>
          常用设备尺寸
        </button>
        
        {showPresets && (
          <div className="mt-2 grid grid-cols-2 gap-2">
            {presets.map((preset) => (
              <button
                key={preset.name}
                className="px-3 py-2 border border-gray-200 rounded-md text-sm hover:bg-gray-50 text-left"
                onClick={() => applyPreset(preset.width, preset.height)}
              >
                <div className="font-medium">{preset.name}</div>
                <div className="text-gray-500">{preset.width} x {preset.height}</div>
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="text-sm text-gray-500">
        <p>当前设置的画布尺寸: {width} x {height}</p>
        <p className="mt-1">注: 画布尺寸将影响布局预览区域的大小和导出的配置</p>
      </div>
    </div>
  );
};

export default CanvasSettingsPanel; 