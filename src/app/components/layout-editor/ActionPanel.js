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
  usedElementIds = [], // 已使用的元素ID列表
  onAddContainer, // 添加容器的函数
}) => {
  // 设置当前活动的标签页
  const [activeTab, setActiveTab] = useState('components');
  // 添加容器时选中的元素
  const [selectedElements, setSelectedElements] = useState([]);
  
  // 获取未使用的元素
  const unusedElements = markdownElements.filter(element => !usedElementIds.includes(element.id));


  console.log('..... unusedElements')
  console.log(unusedElements)
  
  // 处理容器添加
  const handleAddContainer = () => {
    // 添加一个容器，包含选中的元素
    onAddContainer(selectedElements);
    setSelectedElements([]); // 清空选择
  };

  // 处理元素选择
  const handleElementSelect = (element) => {
    setSelectedElements(prev => {
      const index = prev.findIndex(e => e.id === element.id);
      if (index === -1) {
        return [...prev, element];
      }
      return prev.filter(e => e.id !== element.id);
    });
  };

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
    
    // 只有当根元素存在时才遍历
    if (rootElement) {
      traverse(rootElement);
    }
    return containers;
  };

  // 查找元素的同级元素
  const findSiblings = (rootElement, elementId) => {
    const siblings = [];
    let parentElement = null;
    
    // 如果根元素不存在，直接返回空数组
    if (!rootElement) {
      return siblings;
    }
    
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
    // 如果没有布局或元素ID，返回空对象
    if (!layout || !elementId) return {};
    
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

  // 根据元素类型渲染不同的核心属性配置
  const renderCoreProperties = () => {
    if (!selectedElementId || !layout) return null;
    
    const selectedElement = findElement(layout, selectedElementId);
    if (!selectedElement) return null;

    const { type, content } = selectedElement;
    
    switch (type) {
      case 'text':
        // 文本元素的核心属性是文本内容
        return (
          <div className="space-y-3">
            <div className="flex items-center">
              <label className="w-1/3 text-sm">文本内容:</label>
              <textarea
                className="flex-1 px-3 py-2 border rounded text-sm"
                rows="3"
                value={typeof content === 'string' ? content : (content?.value || '')}
                onChange={(e) => {
                  if (typeof content === 'string') {
                    onUpdateElementContent(selectedElementId, 'content', e.target.value);
                  } else {
                    onUpdateElementContent(selectedElementId, 'value', e.target.value);
                  }
                }}
                placeholder="输入文本内容"
              />
            </div>
          </div>
        );
        
      case 'button':
        // 按钮元素的核心属性包括文本、图标和图标位置
        return (
          <div className="space-y-3">
            <div className="flex items-center">
              <label className="w-1/3 text-sm">按钮文本:</label>
              <input
                type="text"
                className="flex-1 px-3 py-2 border rounded text-sm"
                value={content?.text || ''}
                onChange={(e) => onUpdateElementContent(selectedElementId, 'text', e.target.value)}
                placeholder="输入按钮文本"
              />
            </div>
            <div className="flex items-center">
              <label className="w-1/3 text-sm">图标:</label>
              <input
                type="text"
                className="flex-1 px-3 py-2 border rounded text-sm"
                value={content?.icon || ''}
                onChange={(e) => onUpdateElementContent(selectedElementId, 'icon', e.target.value)}
                placeholder="选择图标"
              />
            </div>
            {content?.icon && (
              <div className="flex items-center">
                <label className="w-1/3 text-sm">图标位置:</label>
                <select
                  className="flex-1 px-3 py-2 border rounded text-sm"
                  value={content?.iconPosition || 'left'}
                  onChange={(e) => onUpdateElementContent(selectedElementId, 'iconPosition', e.target.value)}
                >
                  <option value="left">左侧</option>
                  <option value="right">右侧</option>
                </select>
              </div>
            )}
          </div>
        );
        
      case 'image':
        // 图片元素的核心属性包括图片源和替代文本
        return (
          <div className="space-y-3">
            <div className="flex items-center">
              <label className="w-1/3 text-sm">图片链接:</label>
              <input
                type="text"
                className="flex-1 px-3 py-2 border rounded text-sm"
                value={content?.src || ''}
                onChange={(e) => onUpdateElementContent(selectedElementId, 'src', e.target.value)}
                placeholder="输入图片URL"
              />
            </div>
            <div className="flex items-center">
              <label className="w-1/3 text-sm">替代文本:</label>
              <input
                type="text"
                className="flex-1 px-3 py-2 border rounded text-sm"
                value={content?.alt || ''}
                onChange={(e) => onUpdateElementContent(selectedElementId, 'alt', e.target.value)}
                placeholder="输入替代文本"
              />
            </div>
          </div>
        );
        
      case 'icon':
        // 图标元素的核心属性是图标名称和大小
        return (
          <div className="space-y-3">
            <div className="flex items-center">
              <label className="w-1/3 text-sm">图标:</label>
              <input
                type="text"
                className="flex-1 px-3 py-2 border rounded text-sm"
                value={content?.icon || ''}
                onChange={(e) => onUpdateElementContent(selectedElementId, 'icon', e.target.value)}
                placeholder="选择图标"
              />
            </div>
            {content?.icon && (
              <div className="flex items-center">
                <label className="w-1/3 text-sm">图标大小:</label>
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border rounded text-sm"
                  value={selectedElement.style?.fontSize || '24px'}
                  onChange={(e) => onUpdateElementStyle(selectedElementId, 'fontSize', e.target.value)}
                  placeholder="输入图标大小"
                />
              </div>
            )}
          </div>
        );
        
      case 'input':
        // 输入框元素的核心属性包括占位符、字段名和类型
        return (
          <div className="space-y-3">
            <div className="flex items-center">
              <label className="w-1/3 text-sm">占位符:</label>
              <input
                type="text"
                className="flex-1 px-3 py-2 border rounded text-sm"
                value={content?.placeholder || ''}
                onChange={(e) => onUpdateElementContent(selectedElementId, 'placeholder', e.target.value)}
                placeholder="输入占位符文本"
              />
            </div>
            <div className="flex items-center">
              <label className="w-1/3 text-sm">字段名:</label>
              <input
                type="text"
                className="flex-1 px-3 py-2 border rounded text-sm"
                value={content?.field || ''}
                onChange={(e) => onUpdateElementContent(selectedElementId, 'field', e.target.value)}
                placeholder="输入字段名"
              />
            </div>
            <div className="flex items-center">
              <label className="w-1/3 text-sm">输入类型:</label>
              <select
                className="flex-1 px-3 py-2 border rounded text-sm"
                value={content?.type || 'text'}
                onChange={(e) => onUpdateElementContent(selectedElementId, 'type', e.target.value)}
              >
                <option value="text">文本</option>
                <option value="password">密码</option>
                <option value="number">数字</option>
                <option value="email">邮箱</option>
                <option value="tel">电话</option>
                <option value="url">网址</option>
              </select>
            </div>
          </div>
        );
        
      case 'container':
      case 'divider':
      default:
        return (
          <p className="text-sm text-gray-500 py-2">
            {type === 'container' || type === 'divider' 
              ? `${type === 'container' ? '容器' : '分割线'}元素没有核心内容属性，请使用布局和样式配置。`
              : '该元素类型没有可配置的核心属性。'
            }
          </p>
        );
    }
  };

  // 检查是否可以执行动作
  const isActionDisabled = !layout || !selectedElementId;
  const selectedElement = selectedElementId ? findElement(layout, selectedElementId) : null;
  const containers = findAllContainers(layout);
  const siblings = selectedElementId ? findSiblings(layout, selectedElementId) : [];
  const availablePresets = selectedElementId ? getElementPresets(selectedElementId) : {};

  // 查找元素
  function findElement(layout, id) {
    if (!layout || !id) return null;
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
        {[
          { id: 'container', label: '容器' },
          { id: 'components', label: '组件' },
          { id: 'presets', label: '预设' },
          { id: 'properties', label: '属性' },
          { id: 'movement', label: '移动' }
        ].map(tab => (
          <button
            key={tab.id}
            className={`flex-1 py-2 px-4 font-medium ${activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {/* 容器标签内容 */}
        {activeTab === 'container' && (
          <div>
            <h4 className="font-medium mb-3">添加新容器</h4>
            {!layout && (
              <div className="mb-4">
                <p className="text-sm text-yellow-600 mb-2">
                  ⚠️ 将创建一个根容器来开始布局
                </p>
              </div>
            )}
            
            <div className="space-y-4">
              {/* 可选元素列表 */}
              <div>
                <h5 className="text-sm font-medium mb-2">选择要包含的元素：</h5>
                {unusedElements.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {unusedElements.map((element) => (
                      <button
                        key={element.id}
                        className={`p-2 border rounded flex items-center ${
                          selectedElements.some(e => e.id === element.id)
                            ? 'bg-blue-50 border-blue-300'
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleElementSelect(element)}
                      >
                        <span className="mr-2">{getElementIcon(element.type)}</span>
                        <div className="text-left">
                          <div className="text-sm font-medium">{element.content?.value || element.content?.text || element.type}</div>
                          <div className="text-xs text-gray-500">{element.type}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 text-center py-2">
                    <p>没有可用的未使用元素</p>
                  </div>
                )}
              </div>

              {/* 容器说明 */}
              <div className="p-4 border rounded-lg bg-gray-50">
                <h5 className="text-sm font-medium mb-2">容器说明：</h5>
                <p className="text-sm text-gray-600 mb-2">
                  容器是用来组织和布局其他元素的基本单位。您可以：
                </p>
                <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                  {[
                    { id: 'add', text: '添加一个新的容器，可选择包含未使用的元素' },
                    { id: 'nest', text: '在"移动"标签页中调整容器的嵌套关系' }
                  ].map(item => (
                    <li key={item.id}>{item.text}</li>
                  ))}
                </ul>
              </div>

              {/* 添加容器按钮 */}
              <button
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                onClick={handleAddContainer}
              >
                {!layout 
                  ? '创建根容器'
                  : `添加新容器${selectedElements.length > 0 ? `(包含 ${selectedElements.length} 个元素)` : ''}`
                }
              </button>
            </div>
          </div>
        )}

        {/* 组件标签内容 */}
        {activeTab === 'components' && (
          <div>
            <h4 className="font-medium mb-3">可用组件</h4>
            {unusedElements.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {unusedElements.map((element, index) => (
                  <button
                    key={element.id}
                    className={`p-3 border rounded flex items-center ${
                      !layout || layout.type !== 'container'
                        ? 'bg-gray-100 cursor-not-allowed'
                        : 'hover:bg-blue-50 hover:border-blue-300'
                    } transition-colors`}
                    onClick={() => {
                      if (layout && layout.type === 'container') {
                        onAddComponent(selectedElementId || layout.id, element.type, element);
                      }
                    }}
                    disabled={!layout || layout.type !== 'container'}
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
                <p className="text-sm">所有组件已添加到布局中</p>
              </div>
            )}

            {/* 添加已使用组件的提示信息 */}
            {markdownElements.length > unusedElements.length && (
              <div className="mt-4 p-3 bg-gray-50 border rounded-lg">
                <h5 className="text-sm font-medium mb-2">已使用的组件</h5>
                <div className="text-sm text-gray-600">
                  <p>已添加 {markdownElements.length - unusedElements.length} 个组件到布局中</p>
                  <p className="mt-1">提示：已使用的组件可以在"移动"标签页中调整位置</p>
                </div>
                <div className="mt-2 space-y-2">
                  {markdownElements
                    .filter(element => usedElementIds.includes(element.id))
                    .map(element => (
                      <div key={element.id} className="flex items-center p-2 bg-white border rounded">
                        <span className="mr-2 text-xl opacity-50">{getElementIcon(element.type)}</span>
                        <div className="text-left">
                          <div className="font-medium text-gray-400">{element.content?.value || element.content?.text || element.type}</div>
                          <div className="text-xs text-gray-400">{element.type}</div>
                        </div>
                      </div>
                    ))
                  }
                </div>
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
              renderCoreProperties()
            ) : (
              <div className="text-gray-500 text-center py-4">
                <p>请先选择一个元素</p>
              </div>
            )}
          </div>
        )}

        {/* 移动标签内容 - 增强容器嵌套功能 */}
        {activeTab === 'movement' && (
          <div>
            <h4 className="font-medium mb-3">移动元素</h4>
            {!isActionDisabled ? (
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium mb-2">移动到容器</h5>
                  {containers.length > 0 ? (
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {containers
                        .filter(container => container.id !== selectedElementId)
                        .map(container => (
                          <button
                            key={container.id}
                            className="w-full p-2 border rounded flex items-center hover:bg-blue-50 hover:border-blue-300"
                            onClick={() => onMoveElement(selectedElementId, container.id)}
                          >
                            <span className="mr-2">🔲</span>
                            <span>{container.name || `容器 - ${container.id}`}</span>
                          </button>
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