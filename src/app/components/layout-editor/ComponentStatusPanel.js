'use client';
import React, { useState, useCallback } from 'react';
import TreeNodeActions from './TreeNodeActions';

/**
 * 元件状态面板组件 - 显示元件树状结构和属性
 */
const ComponentStatusPanel = ({
  layout,
  selectedElementId,
  onElementClick,
  onElementSelect = onElementClick, // 默认使用onElementClick作为备选
  onAddComponent, // 添加元件的函数
  onDeleteElement, // 删除元件的函数
  onMoveElement, // 移动元件的函数
  onMoveElementToSibling, // 同级间移动元素的方法
}) => {
  // 控制树节点操作菜单的状态
  const [actionMenuState, setActionMenuState] = useState({
    isOpen: false,
    element: null,
    position: { x: 0, y: 0 }
  });
  
  // 关闭操作菜单
  const closeActionMenu = useCallback(() => {
    setActionMenuState(prev => ({ ...prev, isOpen: false }));
  }, []);
  
  // 打开操作菜单
  const openActionMenu = useCallback((e, element) => {
    e.preventDefault();
    e.stopPropagation();
    
    // 获取点击位置，用于定位菜单
    const rect = e.currentTarget.getBoundingClientRect();
    
    // 获取窗口宽度，以确保菜单不会超出可视区域
    const windowWidth = window.innerWidth;
    
    // 计算最佳菜单位置
    // 如果是右键菜单，使用鼠标位置；如果是点击按钮，使用按钮位置
    const x = e.type === 'contextmenu' ? e.clientX : (rect.right + 10);
    const y = e.type === 'contextmenu' ? e.clientY : rect.top;
    
    // 确保菜单显示在可视区域内
    const adjustedX = Math.min(x, windowWidth - 200); // 假设菜单宽度约为200px
    
    setActionMenuState({
      isOpen: true,
      element,
      position: {
        x: adjustedX,
        y
      }
    });
    
    console.log(`Opening menu for ${element.type} (${element.id}) at position:`, adjustedX, y);
  }, []);
  
  // 查找所有容器元素，用于移动功能
  const findAllContainers = useCallback((rootElement) => {
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
  }, []);

  // 查找元素的同级元素，用于同级移动功能
  const findSiblings = useCallback((rootElement, elementId) => {
    const siblings = [];
    let parentElement = null;
    
    // 辅助函数：查找元素的父元素
    const findParent = (element, targetId, parent = null) => {
      if (!element) return null;
      
      // 检查当前元素的子元素是否包含目标元素
      if (element.children) {
        for (const child of element.children) {
          if (child.id === targetId) {
            return element; // 找到了父元素
          }
        }
        
        // 递归查找子元素
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
  }, []);
  
  // 确保元素有ID
  const ensureElementId = (element) => {
    if (!element) return element;
    
    // 如果元素已有ID，直接返回
    if (element.id) return element;
    
    // 创建简单哈希
    const simpleHash = (str) => {
      if (!str) return '';
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return Math.abs(hash).toString(16).substring(0, 8);
    };
    
    // 获取内容哈希
    let contentString = '';
    if (element.content) {
      if (typeof element.content === 'string') {
        contentString = element.content;
      } else if (element.content.text) {
        contentString = element.content.text;
      } else if (element.content.value) {
        contentString = element.content.value.toString();
      }
    }
    
    // 添加额外特征字符串
    let featureString = '';
    if (element.name) {
      featureString += element.name;
    }
    
    // 添加预设特征
    const presetKeys = Object.keys(element).filter(key => key.endsWith('Preset'));
    presetKeys.forEach(key => {
      if (element[key]) {
        featureString += `${key}:${element[key]};`;
      }
    });
    
    // 生成ID组件
    const idBase = `element_${element.type}`;
    const contentHash = contentString ? `_${simpleHash(contentString)}` : '';
    const featureHash = featureString ? `_${simpleHash(featureString)}` : '';
    const finalId = `${idBase}${contentHash}${featureHash}${!contentHash && !featureHash ? '_0' : ''}`;
    
    return {
      ...element,
      id: finalId
    };
  };
  
  // 生成元素的树状视图
  const renderElementTree = (element, depth = 0) => {
    if (!element) return null;

    // 确保元素有ID
    const elementWithId = ensureElementId(element);
    const isSelected = elementWithId.id === selectedElementId;
    const hasChildren = elementWithId.children && elementWithId.children.length > 0;
    
    return (
      <div key={elementWithId.id} className="element-tree-item">
        <div
          className={`flex items-center py-1 px-2 cursor-pointer hover:bg-gray-100 rounded group ${
            isSelected ? 'bg-blue-100 border-blue-300 border' : ''
          }`}
          style={{ marginLeft: `${depth * 16}px` }}
          onClick={(e) => {
            e.stopPropagation();
            // 只选中元素，不显示配置面板
            onElementSelect(elementWithId, e);
          }}
          onDoubleClick={(e) => {
            e.stopPropagation();
            // 双击选中元素并显示配置面板
            onElementClick(elementWithId, e);
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // 右键菜单
            openActionMenu(e, elementWithId);
          }}
        >
          {/* 元素类型图标 */}
          <span className="mr-2">
            {getElementIcon(elementWithId.type)}
          </span>
          
          {/* 元素类型和ID */}
          <div className="flex-1 truncate">
            <span className="font-medium">{getElementName(elementWithId)}</span>
            <span className="text-xs text-gray-500 ml-2">{elementWithId.id}</span>
          </div>
          
          {/* 操作按钮 - 鼠标悬停时显示 */}
          <div className="flex items-center opacity-0 group-hover:opacity-100 mr-1">
            <button
              className="p-1 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded"
              onClick={(e) => {
                e.stopPropagation();
                openActionMenu(e, elementWithId);
              }}
              title="元件操作"
            >
              ⋮
            </button>
          </div>
          
          {/* 展示是否有子元素 */}
          {hasChildren && (
            <span className="text-gray-400 text-xs">
              {elementWithId.children.length}
            </span>
          )}
        </div>
        
        {/* 递归渲染子元素 */}
        {elementWithId.children?.map((child) => renderElementTree(child, depth + 1))}
      </div>
    );
  };
  
  // 获取元素类型图标
  const getElementIcon = (type) => {
    switch (type) {
      case 'container':
        return <div className="w-4 h-4 bg-blue-200 rounded-sm"></div>;
      case 'text':
        return <div className="w-4 h-4 bg-green-200 rounded-sm"></div>;
      case 'button':
        return <div className="w-4 h-4 bg-yellow-200 rounded-sm"></div>;
      case 'image':
        return <div className="w-4 h-4 bg-purple-200 rounded-sm"></div>;
      default:
        return <div className="w-4 h-4 bg-gray-200 rounded-sm"></div>;
    }
  };
  
  // 获取友好的元素名称 - 优先使用元素实际名称，如果不存在则使用默认名称
  const getElementName = (element) => {
    // 先尝试获取元素的名称（可能存在于不同位置）
    if (element.name) {
      return element.name;
    }
    
    // 检查内容对象中是否包含名称
    if (element.content && element.content.name) {
      return element.content.name;
    }
    
    // 检查内容对象中是否包含标题或文本
    if (element.content) {
      if (element.content.title) return element.content.title;
      if (element.content.text) return element.content.text;
      if (element.content.value) return element.content.value;
    }
    
    // 如果没有找到实际名称，使用默认名称
    switch (element.type) {
      case 'container':
        return `容器`;
      case 'text':
        return `文本`;
      case 'button':
        return `按钮`;
      case 'image':
        return `图片`;
      default:
        return element.type.charAt(0).toUpperCase() + element.type.slice(1);
    }
  };
  
  // 生成元素属性视图
  const renderElementProperties = (element) => {
    if (!element) return null;
    
    const properties = [
      { label: '类型', value: element.type },
      { label: 'ID', value: element.id },
    ];
    
    // 添加预设信息
    const presets = Object.entries(element)
      .filter(([key, value]) => key.endsWith('Preset') && value)
      .map(([key, value]) => ({
        label: getPresetName(key),
        value,
      }));
    
    return (
      <div className="mt-4 bg-white rounded-lg border p-4">
        <h3 className="text-md font-medium mb-2">元件属性</h3>
        <div className="space-y-2">
          {properties.map((prop) => (
            <div key={prop.label} className="flex justify-between text-sm">
              <span className="text-gray-500">{prop.label}:</span>
              <span className="font-medium">{prop.value}</span>
            </div>
          ))}
          
          {presets.length > 0 && (
            <>
              <div className="border-t my-2"></div>
              <h4 className="text-sm font-medium mb-1">应用的预设</h4>
              {presets.map((preset) => (
                <div key={preset.label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{preset.label}:</span>
                  <span className="font-medium text-blue-600">{preset.value}</span>
                </div>
              ))}
            </>
          )}
          
          {/* 样式属性 */}
          {element.style && Object.keys(element.style).length > 0 && (
            <>
              <div className="border-t my-2"></div>
              <h4 className="text-sm font-medium mb-1">样式</h4>
              <div className="text-xs font-mono bg-gray-50 p-2 rounded overflow-auto max-h-40">
                {JSON.stringify(element.style, null, 2)}
              </div>
            </>
          )}
        </div>
      </div>
    );
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
  
  // 找到选中的元素
  const findElement = (layout, id) => {
    if (layout.id === id) return layout;
    if (layout.children) {
      for (const child of layout.children) {
        const found = findElement(child, id);
        if (found) return found;
      }
    }
    return null;
  };
  
  const selectedElement = selectedElementId ? findElement(layout, selectedElementId) : null;
  
  // 处理添加子元素
  const handleAddChild = useCallback((parentId, type) => {
    if (onAddComponent) {
      // 修正参数顺序：父ID在前，类型在后
      onAddComponent(parentId, type);
    }
  }, [onAddComponent]);
  
  // 处理删除元素
  const handleDelete = useCallback((elementId) => {
    if (onDeleteElement) {
      onDeleteElement(elementId);
    }
  }, [onDeleteElement]);
  
  // 处理移动元素
  const handleMoveTo = useCallback((elementId, targetId) => {
    if (onMoveElement) {
      onMoveElement(elementId, targetId);
    }
  }, [onMoveElement]);
  
  // 处理同级移动元素
  const handleMoveToSibling = useCallback((elementId, targetId, position) => {
    if (onMoveElementToSibling) {
      onMoveElementToSibling(elementId, targetId, position);
    }
  }, [onMoveElementToSibling]);
  
  return (
    <div className="h-full bg-gray-50 border-l" style={{ minHeight: '400px' }}>
      <div className="p-3 h-full">
        <h3 className="text-lg font-medium mb-3">元件状态区</h3>
        
        {/* 元件树状结构 */}
        <div className="mb-4 bg-white rounded-lg border p-3 overflow-auto" style={{ maxHeight: '500px' }}>
          <h4 className="text-md font-medium mb-2">元件结构</h4>
          <div className="mt-2">
            {renderElementTree(layout)}
          </div>
        </div>
        
        {/* 元件属性 */}
        {selectedElement && renderElementProperties(selectedElement)}
        
        {/* 树节点操作菜单 */}
        {actionMenuState.isOpen && actionMenuState.element && (
          <TreeNodeActions
            element={actionMenuState.element}
            onAddChild={handleAddChild}
            onDelete={handleDelete}
            onMoveTo={handleMoveTo}
            onMoveToSibling={handleMoveToSibling} // 添加同级移动功能
            containerElements={findAllContainers(layout)}
            siblingElements={findSiblings(layout, actionMenuState.element.id)} // 添加兄弟元素列表
            isOpen={actionMenuState.isOpen}
            onClose={closeActionMenu}
            position={actionMenuState.position}
          />
        )}
      </div>
    </div>
  );
};

export default ComponentStatusPanel;