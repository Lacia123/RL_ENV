'use client';
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * 树节点操作菜单 - 提供元件的操作功能
 */
const TreeNodeActions = ({
  element,
  onAddChild,
  onDelete,
  onMoveTo,
  onMoveToSibling, // 添加同级移动功能
  containerElements = [],
  siblingElements = [], // 添加同级元素列表
  isOpen = false,
  onClose,
  position = { x: 0, y: 0 }
}) => {
  const menuRef = useRef(null);
  
  // 控制添加子元件模态框
  const [showAddModal, setShowAddModal] = useState(false);
  const [elementName, setElementName] = useState('');
  const [selectedType, setSelectedType] = useState('container');
  
  // 控制移动到模态框
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [moveMode, setMoveMode] = useState('container'); // 'container' 或 'sibling'
  
  // 是否为容器类型
  const isContainer = element.type === 'container';
  // 是否有子元素，如果有子元素，不能删除
  const hasChildren = element.children && element.children.length > 0;
  
  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      // 只有当点击的不是菜单内部元素且模态框都没有打开时，才关闭菜单
      if (menuRef.current && !menuRef.current.contains(event.target) && !showAddModal && !showMoveModal) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, showAddModal, showMoveModal]);
  
  // 处理添加子元素
  const handleAddChild = (e) => {
    if (e) e.stopPropagation();
    
    // 调用父组件传入的添加子元素函数并传递配置
    onAddChild(element.id, selectedType, { name: elementName });
    
    // 重置状态
    setShowAddModal(false);
    setElementName('');
    setSelectedType('container');
    
    // 关闭当前操作菜单
    onClose();
  };
  
  // 处理移动元素到容器
  const handleMoveElement = (targetId, e) => {
    if (e) e.stopPropagation();
    
    onMoveTo(element.id, targetId);
    setShowMoveModal(false);
    onClose(); // 确保关闭主菜单
  };
  
  // 处理同级移动元素
  const handleMoveSibling = (targetId, position, e) => {
    if (e) e.stopPropagation();
    
    onMoveToSibling(element.id, targetId, position);
    setShowMoveModal(false);
    onClose(); // 确保关闭主菜单
  };
  
  // 选择组件类型
  const selectType = (type, e) => {
    if (e) e.stopPropagation();
    setSelectedType(type);
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
  
  // 如果不是打开状态，不渲染
  if (!isOpen) return null;
  
  // 使用Portal渲染模态框，避免被父组件的重新渲染影响
  const renderPortal = (content) => {
    if (typeof document === 'undefined') return null; // 服务器端渲染保护
    return createPortal(content, document.body);
  };
  
  return (
    <>
      <div
        ref={menuRef}
        className="absolute z-50 bg-white rounded-lg shadow-lg py-1 border min-w-40"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translateX(-50%)', // 水平居中于点击位置
          boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.2)', // 更强的阴影
          border: '1px solid #ddd'
        }}
      >
        {isContainer && (
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
            onClick={(e) => {
              e.stopPropagation();
              setShowAddModal(true);
            }}
          >
            <span className="mr-2">➕</span> 添加子元件
          </button>
        )}
        <button
          className={`w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center ${hasChildren ? 'text-gray-400 cursor-not-allowed' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            if (!hasChildren) onDelete(element.id);
          }}
          disabled={hasChildren}
          title={hasChildren ? "不能删除含有子元素的容器" : "删除元素"}
        >
          <span className="mr-2">🗑️</span> 删除
          {hasChildren && <span className="ml-2 text-xs">(有子元素)</span>}
        </button>
        <button
          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
          onClick={(e) => {
            e.stopPropagation();
            setMoveMode('container'); // 默认打开容器移动模式
            setShowMoveModal(true);
          }}
        >
          <span className="mr-2">📦</span> 移动到容器
        </button>
        {siblingElements.length > 0 && (
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
            onClick={(e) => {
              e.stopPropagation();
              setMoveMode('sibling'); // 打开同级元素移动模式
              setShowMoveModal(true);
            }}
          >
            <span className="mr-2">↔️</span> 同级移动
          </button>
        )}
      </div>
      
      {/* 使用Portal渲染模态框 */}
      {showAddModal && renderPortal(
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50"
          onClick={(e) => {
            // 只有点击背景时才关闭
            if (e.target === e.currentTarget) {
              setShowAddModal(false);
            }
          }}
        >
          <div 
            className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-medium mb-2">添加子元件</h3>
            <p className="text-sm text-gray-500 mb-4">添加到: {element?.name || `${element.type} - ${element.id}`}</p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">选择组件类型</label>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {['container', 'text', 'button', 'image', 'input', 'icon', 'divider'].map((type) => (
                  <button
                    key={type}
                    className={`p-3 border rounded-lg flex flex-col items-center transition-colors ${
                      selectedType === type 
                        ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-200' 
                        : 'bg-gray-50 hover:bg-blue-50'
                    }`}
                    onClick={(e) => selectType(type, e)}
                  >
                    <div className="text-2xl mb-1">
                      {getElementIcon(type)}
                    </div>
                    <div className="text-sm capitalize">{type}</div>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                组件名称 <span className="text-gray-400 text-xs">(可选)</span>
              </label>
              <input
                type="text"
                className="w-full border rounded p-2 text-sm"
                value={elementName}
                onChange={(e) => {
                  e.stopPropagation();
                  setElementName(e.target.value);
                }}
                onClick={(e) => e.stopPropagation()}
                placeholder="输入组件名称，用于标识"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAddModal(false);
                }}
              >
                取消
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                onClick={handleAddChild}
              >
                添加组件
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showMoveModal && renderPortal(
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50"
          onClick={(e) => {
            // 只有点击背景时才关闭
            if (e.target === e.currentTarget) {
              setShowMoveModal(false);
            }
          }}
        >
          <div 
            className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 移动模式切换标签 */}
            <div className="flex mb-4 border-b">
              <button
                className={`px-4 py-2 font-medium ${moveMode === 'container' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                onClick={() => setMoveMode('container')}
              >
                移动到容器
              </button>
              <button
                className={`px-4 py-2 font-medium ${moveMode === 'sibling' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                onClick={() => setMoveMode('sibling')}
              >
                同级移动
              </button>
            </div>
            
            {moveMode === 'container' ? (
              // 容器移动模式
              <>
                {containerElements.length > 0 ? (
                  <div className="max-h-60 overflow-y-auto mb-4">
                    {containerElements
                      .filter(container => container.id !== element.id)
                      .map((container) => (
                        <div
                          key={container.id}
                          className="p-2 hover:bg-gray-100 cursor-pointer rounded"
                          onClick={(e) => handleMoveElement(container.id, e)}
                        >
                          <div className="flex items-center">
                            <span className="mr-2">🔲</span>
                            <div>
                              <div>{container.name || `容器 - ${container.id}`}</div>
                              <div className="text-xs text-gray-500">{container.id}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-gray-500 mb-4">没有可用的容器元素</div>
                )}
              </>
            ) : (
              // 同级移动模式
              <>
                {siblingElements.length > 0 ? (
                  <div className="max-h-60 overflow-y-auto mb-4">
                    {siblingElements.map((sibling) => (
                      <div
                        key={sibling.id}
                        className="p-3 border-b last:border-b-0"
                      >
                        <div className="flex items-center mb-2">
                          <span className="mr-2">{getElementIcon(sibling.type)}</span>
                          <div>
                            <div>{sibling.name || `${sibling.type} - ${sibling.id}`}</div>
                            <div className="text-xs text-gray-500">{sibling.id}</div>
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-1">
                          <button
                            className="flex-1 px-3 py-1 bg-green-50 text-green-700 rounded hover:bg-green-100"
                            onClick={(e) => handleMoveSibling(sibling.id, 'before', e)}
                          >
                            移到前面
                          </button>
                          <button
                            className="flex-1 px-3 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                            onClick={(e) => handleMoveSibling(sibling.id, 'after', e)}
                          >
                            移到后面
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 mb-4">没有可用的同级元素</div>
                )}
              </>
            )}
            
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMoveModal(false);
                }}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TreeNodeActions;