'use client';
import React, { useState } from 'react';
import { getAvailablePresets } from '../../utils/presetSystem';

/**
 * 动作操作面板 - 用于强化学习环境的动作选择
 * 
 * 此组件展示所有可用的动作选项，包括:
 * - 从Markdown生成的元素添加
 * - 应用预设
 * - 修改核心属性
 * - 移动元素
 */
const ActionPanel = ({
  markdownElements = [], // 从Markdown解析出的元素列表
  selectedElementId, // 当前选中的元素ID
  layout, // 当前布局
  onAddComponent, // 添加组件的函数
  onApplyCategoryPreset, // 应用分类预设的函数
  onUpdateElementStyle, // 更新元素样式的函数
  onUpdateElementContent, // 更新元素内容的函数
  onMoveElement, // 移动元素到容器的函数
  onMoveElementToSibling, // 移动元素到同级位置的函数
}) => {
  // 设置当前活动的标签页
  const [activeTab, setActiveTab] = useState('components');

  // 查找所有容器元素，用于移动功能
  const findAllContainers = (rootElement) => {
    const containers = [];
    
    const traverse = (element) => {
      if (element.type === 'container') {
        containers.push(element);
      }
      
      if (element.children) {
        element.children.forEach(traverse);
      }
    };
    
    traverse(rootElement);
    return containers;
  };

  // 查找元素的同级元素
  const findSiblings = (rootElement, elementId) => {
    const siblings = [];
    let parentElement = null;
    
    // 辅助函数：查找元素的父元素
    const findParent = (element, targetId, parent = null) => {
      if (!element) return null;
      
      if (element.children) {
        for (const child of element.children) {
          if (child.id === targetId) {
            return element;
          }
        }
        
        for (const child of element.children) {
          const result = findParent(child, targetId, element);
          if (result) return result;
        }
      }
      
      return null;
    };
    
    // 查找元素的父元素
    parentElement = findParent(rootElement, elementId);
    
    // 如果找到父元素，获取其所有子元素（除了当前元素本身）
    if (parentElement && parentElement.children) {
      parentElement.children.forEach(child => {
        if (child.id !== elementId) {
          siblings.push(child);
        }
      });
    }
    
    return siblings;
  };

  // 使用通过导入的getAvailablePresets获取元素的可用预设
  const getElementPresets = (elementId) => {
    // 查找元素
    const element = findElement(layout, elementId);
    if (!element || !element.type) return {};
    
    // 使用预设系统的函数获取可用预设
    return getAvailablePresets(element.type);
  };

  // 获取元素图标
  const getElementIcon = (type) => {
    switch(type) {
      case 'container': return '🔲';
      case 'text': return '📝';
      case 'button': return '🔘';
      case 'image': return '🖼️';
      case 'input': return '📋';
      case 'icon': return '⭐';
      case 'divider': return '➖';
      default: return '📄';
    }
  };

  // 获取预设名称的中文显示
  const getPresetName = (presetKey) => {
    const presetMap = {
      'layoutPreset': '布局预设',
      'spacingPreset': '间距预设',
      'appearancePreset': '外观预设',
      'typographyPreset': '排版预设',
      'sizePreset': '尺寸预设',
      'selfAlignPreset': '自对齐',
      'textAlignPreset': '文本对齐',
      'flexRatioPreset': 'Flex比例',
      'buttonSizePreset': '按钮尺寸',
      'imageProportionPreset': '图片比例'
    };
    
    return presetMap[presetKey] || presetKey.replace('Preset', '');
  };

  // 核心属性列表
  const coreProperties = [
    { 
      name: 'width', 
      label: '宽度',
      type: 'text',
      placeholder: '例如: 100px, 50%, auto'
    },
    { 
      name: 'height', 
      label: '高度',
      type: 'text',
      placeholder: '例如: 100px, 50%, auto'
    },
    { 
      name: 'margin', 
      label: '外边距',
      type: 'text',
      placeholder: '例如: 10px, 10px 20px'
    },
    { 
      name: 'padding', 
      label: '内边距',
      type: 'text',
      placeholder: '例如: 10px, 10px 20px'
    },
    { 
      name: 'background', 
      label: '背景',
      type: 'text',
      placeholder: '例如: #ffffff, rgba(255,255,255,0.5)'
    },
    { 
      name: 'color', 
      label: '文字颜色',
      type: 'text',
      placeholder: '例如: #000000, rgb(0,0,0)'
    },
    { 
      name: 'fontSize', 
      label: '字体大小',
      type: 'text',
      placeholder: '例如: 16px, 1.2rem'
    },
    { 
      name: 'fontWeight', 
      label: '字体粗细',
      type: 'text',
      placeholder: '例如: normal, bold, 600'
    }
  ];

  // 仅在有元素选中时才启用动作
  const isActionDisabled = !selectedElementId;
  const selectedElement = selectedElementId ? findElement(layout, selectedElementId) : null;
  const containers = findAllContainers(layout);
  const siblings = selectedElementId ? findSiblings(layout, selectedElementId) : [];
  const availablePresets = selectedElementId ? getElementPresets(selectedElementId) : {};

  // 查找元素
  function findElement(layout, id) {
    if (layout.id === id) return layout;
    if (layout.children) {
      for (const child of layout.children) {
        const found = findElement(child, id);
        if (found) return found;
      }
    }
    return null;
  }

  return (
    <div className="w-full bg-white border rounded-lg shadow-sm">
      {/* 标题 */}
      <div className="border-b p-3">
        <h3 className="text-lg font-medium">动作面板</h3>
        <p className="text-sm text-gray-500">
          用于强化学习环境的动作选择
        </p>
      </div>

      {/* 标签栏 */}
      <div className="flex border-b">
        <button
          className={`flex-1 py-2 px-4 font-medium ${activeTab === 'components' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('components')}
        >
          组件
        </button>
        <button
          className={`flex-1 py-2 px-4 font-medium ${activeTab === 'presets' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('presets')}
        >
          预设
        </button>
        <button
          className={`flex-1 py-2 px-4 font-medium ${activeTab === 'properties' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('properties')}
        >
          属性
        </button>
        <button
          className={`flex-1 py-2 px-4 font-medium ${activeTab === 'movement' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('movement')}
        >
          移动
        </button>
      </div>

      {/* 内容区域 */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {/* 组件标签内容 - 从Markdown生成的组件 */}
        {activeTab === 'components' && (
          <div>
            <h4 className="font-medium mb-3">可用组件</h4>
            {markdownElements.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {markdownElements.map((element, index) => (
                  <button
                    key={index}
                    className="p-3 border rounded flex items-center hover:bg-blue-50 hover:border-blue-300 transition-colors"
                    onClick={() => onAddComponent(selectedElementId || layout.id, element.type, element)}
                    disabled={isActionDisabled}
                  >
                    <span className="mr-2 text-xl">{getElementIcon(element.type)}</span>
                    <div className="text-left">
                      <div className="font-medium">{element.content?.value || element.content?.text || element.type}</div>
                      <div className="text-xs text-gray-500">
                        {element.type}
                        {element.typographyPreset && <span className="ml-2 font-semibold text-blue-600">({element.typographyPreset})</span>}
                        {element.buttonSizePreset && <span className="ml-2 font-semibold text-blue-600">({element.buttonSizePreset})</span>}
                        {element.imageProportionPreset && <span className="ml-2 font-semibold text-blue-600">({element.imageProportionPreset})</span>}
                        {element.layoutPreset && <span className="ml-2 font-semibold text-blue-600">({element.layoutPreset})</span>}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-center py-4">
                <p>没有可用的组件</p>
                <p className="text-sm">请先输入Markdown内容</p>
              </div>
            )}
          </div>
        )}

        {/* 预设标签内容 */}
        {activeTab === 'presets' && (
          <div>
            <h4 className="font-medium mb-3">可用预设</h4>
            {!isActionDisabled ? (
              Object.keys(availablePresets).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(availablePresets).map(([presetCategory, presetObj]) => (
                    <div key={presetCategory} className="border rounded-lg p-3">
                      <h5 className="font-medium mb-2">{getPresetName(presetCategory)}</h5>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(presetObj).map(([presetKey, preset]) => (
                          <button
                            key={`${presetCategory}-${presetKey}`}
                            className="px-3 py-2 border rounded text-sm hover:bg-blue-50 hover:border-blue-300"
                            onClick={() => onApplyCategoryPreset(presetCategory, presetKey)}
                          >
                            <div className="text-sm font-medium">{preset.name}</div>
                            <div className="text-xs text-gray-600">{preset.description?.substring(0, 20)}{preset.description?.length > 20 ? '...' : ''}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-center py-4">
                  <p>当前元素没有可用预设</p>
                </div>
              )
            ) : (
              <div className="text-gray-500 text-center py-4">
                <p>请先选择一个元素</p>
              </div>
            )}
          </div>
        )}

        {/* 属性标签内容 */}
        {activeTab === 'properties' && (
          <div>
            <h4 className="font-medium mb-3">核心属性</h4>
            {!isActionDisabled ? (
              <div className="space-y-3">
                {coreProperties.map(property => (
                  <div key={property.name} className="flex items-center">
                    <label className="w-1/3 text-sm">{property.label}:</label>
                    <input
                      type={property.type}
                      className="flex-1 px-3 py-2 border rounded text-sm"
                      placeholder={property.placeholder}
                      value={selectedElement?.style?.[property.name] || ''}
                      onChange={(e) => onUpdateElementStyle(selectedElementId, property.name, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-center py-4">
                <p>请先选择一个元素</p>
              </div>
            )}
          </div>
        )}

        {/* 移动标签内容 */}
        {activeTab === 'movement' && (
          <div>
            <h4 className="font-medium mb-3">移动元素</h4>
            {!isActionDisabled ? (
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium mb-2">移动到容器</h5>
                  {containers.length > 0 ? (
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {containers.map(container => (
                        container.id !== selectedElementId && (
                          <button
                            key={container.id}
                            className="w-full p-2 border rounded flex items-center hover:bg-blue-50 hover:border-blue-300"
                            onClick={() => onMoveElement(selectedElementId, container.id)}
                          >
                            <span className="mr-2">🔲</span>
                            <span>{container.name || `容器 - ${container.id}`}</span>
                          </button>
                        )
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-center py-2">
                      <p>没有可用的容器</p>
                    </div>
                  )}
                </div>

                <div>
                  <h5 className="font-medium mb-2">同级移动</h5>
                  {siblings.length > 0 ? (
                    <div className="space-y-3 max-h-32 overflow-y-auto">
                      {siblings.map(sibling => (
                        <div key={sibling.id} className="border rounded p-2">
                          <div className="flex items-center mb-2">
                            <span className="mr-2">{getElementIcon(sibling.type)}</span>
                            <span>{sibling.name || `${sibling.type} - ${sibling.id}`}</span>
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              className="flex-1 px-2 py-1 bg-green-50 text-green-700 rounded text-sm hover:bg-green-100"
                              onClick={() => onMoveElementToSibling(selectedElementId, sibling.id, 'before')}
                            >
                              移到前面
                            </button>
                            <button 
                              className="flex-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm hover:bg-blue-100"
                              onClick={() => onMoveElementToSibling(selectedElementId, sibling.id, 'after')}
                            >
                              移到后面
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-center py-2">
                      <p>没有可用的同级元素</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-gray-500 text-center py-4">
                <p>请先选择一个元素</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 底部状态栏 */}
      <div className="border-t p-3 bg-gray-50 text-sm">
        {selectedElementId ? (
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">当前选中: </span>
              <span>{selectedElement?.type || 'unknown'} - {selectedElementId}</span>
            </div>
            <div className="text-blue-600">
              {activeTab === 'components' ? '添加组件' : 
               activeTab === 'presets' ? '应用预设' : 
               activeTab === 'properties' ? '修改属性' : '移动元素'}
            </div>
          </div>
        ) : (
          <div className="text-gray-500 text-center">
            请先选择一个元素以启用动作
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionPanel;