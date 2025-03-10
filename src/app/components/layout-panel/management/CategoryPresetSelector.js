import React, { useState, useRef } from 'react';
import { getAvailablePresets } from '../../../utils/presetSystem';

/**
 * 分类预设选择器组件 - 允许按类别选择预设
 */
const CategoryPresetSelector = ({ elementType, selectedPresets = {}, onPresetSelect, asArray = false }) => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [tooltipInfo, setTooltipInfo] = useState(null);
  const tooltipRef = useRef(null);
  const availablePresetCategories = getAvailablePresets(elementType);
  
  // 如果没有可用预设，则不显示
  if (!availablePresetCategories || Object.keys(availablePresetCategories).length === 0) {
    return <div className="text-sm text-gray-500">该元素类型没有可用预设</div>;
  }
  
  // 切换类别展开/折叠
  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };
  
  // 判断一个预设是否被选中
  const isPresetSelected = (category, presetKey) => {
    const selected = selectedPresets[category];
    if (Array.isArray(selected)) {
      return selected.includes(presetKey);
    }
    return selected === presetKey;
  };
  
  // 显示预设详情提示框
  const showTooltip = (e, category, presetKey, preset) => {
    // 获取被悬停元素的位置信息
    const rect = e.currentTarget.getBoundingClientRect();
    
    // 获取视口尺寸和滚动位置
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scrollX = window.scrollX || window.pageXOffset;
    const scrollY = window.scrollY || window.pageYOffset;
    
    // 创建提示框内容 - 包括样式属性
    const styleString = Object.entries(preset.defaultStyle || {})
      .map(([key, value]) => `  ${key}: ${JSON.stringify(value)}`)
      .join(',\n');
    
    const tooltipContent = {
      category,
      presetKey,
      name: preset.name,
      description: preset.description,
      styleString: `{\n${styleString}\n}`
    };
    
    // 估计提示框尺寸 (宽度大约300-400px)
    const estimatedWidth = 350;
    const estimatedHeight = 250;
    
    // 计算最佳位置 - 相对于预设元素
    let x, y;
    
    // 水平位置 - 优先在右侧
    if (rect.right + estimatedWidth < viewportWidth - 20) {
      // 右侧有足够空间
      x = rect.right + 5;
    } else if (rect.left - estimatedWidth > 20) {
      // 右侧空间不足，尝试左侧
      x = rect.left - estimatedWidth - 5;
    } else {
      // 两侧都没有足够空间，居中显示并限制宽度
      x = (viewportWidth - estimatedWidth) / 2;
    }
    
    // 垂直位置 - 优先在元素正上方
    if (rect.top > estimatedHeight + 10) {
      // 上方有足够空间
      y = rect.top - estimatedHeight - 5;
    } else if (rect.bottom + estimatedHeight < viewportHeight - 10) {
      // 上方空间不足，尝试下方
      y = rect.bottom + 5;
    } else {
      // 上下都没有足够空间，使用元素中心对齐
      y = Math.max(10, Math.min(
        viewportHeight - estimatedHeight - 10,
        rect.top - (estimatedHeight / 2) + (rect.height / 2)
      ));
    }
    
    // 设置提示框信息和位置 (注意：fixed定位不需要考虑滚动)
    setTooltipInfo({
      content: tooltipContent,
      position: { x, y }
    });
  };
  
  // 隐藏提示框
  const hideTooltip = () => {
    setTooltipInfo(null);
  };
  
  // 获取当前选中的预设名称显示
  const getSelectedPresetName = (category, presets) => {
    const selected = selectedPresets[category];
    
    if (!selected) return null;
    
    if (Array.isArray(selected)) {
      if (selected.length === 0) return null;
      
      if (selected.length === 1) {
        return presets[selected[0]]?.name || selected[0];
      }
      
      return `${selected.length} 个预设`;
    }
    
    return presets[selected]?.name || selected;
  };
  
  return (
    <div className="space-y-2">
      {Object.entries(availablePresetCategories).map(([category, presets]) => (
        <div key={category} className="border rounded overflow-hidden">
          <div 
            className="flex justify-between items-center p-2 bg-gray-50 cursor-pointer hover:bg-gray-100"
            onClick={() => toggleCategory(category)}
          >
            <div className="font-medium">
              {getCategoryName(category)}
              {selectedPresets[category] && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
                  {getSelectedPresetName(category, presets)}
                </span>
              )}
            </div>
            <div>{expandedCategory === category ? '▲' : '▼'}</div>
          </div>
          
          {expandedCategory === category && (
            <div className="p-2 bg-white">
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(presets).map(([presetKey, preset]) => (
                  <div
                    key={presetKey}
                    className={`p-2 border rounded cursor-pointer hover:bg-blue-50 ${
                      isPresetSelected(category, presetKey) ? 'bg-blue-100 border-blue-300' : 'border-gray-200'
                    }`}
                    onClick={() => onPresetSelect(category, presetKey, asArray)}
                    onMouseEnter={(e) => showTooltip(e, category, presetKey, preset)}
                    onMouseLeave={hideTooltip}
                  >
                    <div className="font-medium">{preset.name}</div>
                    <div className="text-xs text-gray-500">{preset.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
      
      {/* 预设详情提示框 */}
      {tooltipInfo && (
        <div
          ref={tooltipRef}
          className="fixed z-50 p-4 bg-gray-800 text-white rounded shadow-lg max-w-md"
          style={{
            left: `${tooltipInfo.position.x}px`,
            top: `${tooltipInfo.position.y}px`,
          }}
        >
          <div className="flex justify-between items-center mb-2">
            <div className="font-bold text-base">{tooltipInfo.content.name}</div>
            <div className="px-2 py-0.5 bg-blue-600 rounded-full text-xs">
              {getCategoryName(tooltipInfo.content.category)}
            </div>
          </div>
          <div className="mb-3 text-sm text-gray-300">{tooltipInfo.content.description}</div>
          <div className="text-xs font-medium text-blue-300 mb-1">预设属性:</div>
          <pre className="text-xs font-mono bg-gray-900 p-3 rounded overflow-auto max-h-64 border border-gray-700">
            {tooltipInfo.content.styleString}
          </pre>
        </div>
      )}
    </div>
  );
};

// 获取预设类别显示名称
const getCategoryName = (category) => {
  switch (category) {
    // 原有预设类别
    case 'typography': return '排版预设';
    case 'appearance': return '外观预设';
    case 'spacing': return '间距预设';
    case 'layout': return '布局预设';
    case 'textAlign': return '文本对齐';
    
    // 新增预设类别
    case 'selfAlign': return '元素对齐';
    case 'size': return '尺寸预设';
    case 'buttonSize': return '按钮尺寸';
    case 'flexRatio': return 'Flex比例';
    case 'imageProportion': return '图片比例';
    
    // 默认情况下展示原始类别名
    default: return category.charAt(0).toUpperCase() + category.slice(1);
  }
};

export default CategoryPresetSelector;