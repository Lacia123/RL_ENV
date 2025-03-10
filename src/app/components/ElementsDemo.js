'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
  elementDefinitions,
  applyPreset,
  resolveThemeValue,
  themeSystem,
  commonStyleProps
} from '@/app/utils/elementDefinitions';
import LayoutControl from './LayoutPanel';

// 生成唯一ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// 辅助函数：将元素定义转换为React样式对象
const convertToReactStyle = (style, theme = themeSystem.theme) => {
  if (!style) return {};
  
  const result = {};
  
  Object.entries(style).forEach(([key, value]) => {
    // 忽略非样式属性
    if (['direction', 'preset', 'thickness', 'style'].includes(key)) return;
    
    // 处理主题变量
    if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
      result[key] = resolveThemeValue(value, theme);
    } else {
      result[key] = value;
    }
  });
  
  // 添加flex相关样式
  if (style.direction === 'row' || style.direction === 'column') {
    result.display = 'flex';
    result.flexDirection = style.direction;
  }

  return result;
};

// 深度设置对象属性，支持点路径
const setNestedProperty = (obj, path, value) => {
  if (path.includes('.')) {
    const parts = path.split('.');
    let current = obj;
    
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    }
    
    current[parts[parts.length - 1]] = value;
  } else {
    obj[path] = value;
  }
  
  return obj;
};

// 克隆元素树并找到特定ID的元素
const findAndUpdateElement = (element, id, updater) => {
  if (element.id === id) {
    return updater(element);
  }
  
  if (element.children) {
    return {
      ...element,
      children: element.children.map(child => findAndUpdateElement(child, id, updater))
    };
  }
  
  return element;
};

// 添加子元素到指定容器
const addChildToContainer = (element, containerId, childElement) => {
  if (element.id === containerId) {
    return {
      ...element,
      children: [...(element.children || []), childElement]
    };
  }
  
  if (element.children) {
    return {
      ...element,
      children: element.children.map(child => addChildToContainer(child, containerId, childElement))
    };
  }
  
  return element;
};

// 创建一个新元素
const createNewElement = (type) => {
  const newElement = {
    ...elementDefinitions[type],
    id: generateId(),
    style: { ...elementDefinitions[type].style },
  };
  
  // 为容器初始化空子数组
  if (type === 'container' && !newElement.children) {
    newElement.children = [];
  }
  
  return newElement;
};

// 渲染可编辑的元素
const EditableElement = ({ element, onClick, isSelected, draggable = false, onDragStart, onDragOver, onDrop }) => {
  const { id, type, style, content, children, action } = element;
  
  // 选中元素的样式
  const selectedStyle = isSelected ? {
    outline: '2px dashed #1890FF',
    position: 'relative'
  } : {};
  
  // 拖拽相关属性
  const dragProps = draggable ? {
    draggable: true,
    onDragStart: (e) => onDragStart(e, id),
    style: { ...convertToReactStyle(style), ...selectedStyle, cursor: 'move' }
  } : {
    style: { ...convertToReactStyle(style), ...selectedStyle }
  };
  
  // 容器额外的拖拽接收属性
  const dropProps = type === 'container' ? {
    onDragOver: (e) => onDragOver(e),
    onDrop: (e) => onDrop(e, id)
  } : {};
  
  // 渲染元素的公共属性
  const commonProps = {
    onClick: (e) => {
      e.stopPropagation();
      onClick(id);
    },
    ...dragProps,
    ...dropProps
  };
  
  // 根据元素类型渲染
  switch (type) {
    case 'container':
      return (
        <div {...commonProps} data-element-id={id} data-element-type={type}>
          {isSelected && (
            <div className="absolute -top-5 left-0 text-xs bg-blue-500 text-white px-2 py-1 rounded-t-md">
              {type}
            </div>
          )}
          {children && children.map((child, index) => (
            <EditableElement
              key={child.id || index}
              element={child}
              onClick={onClick}
              isSelected={false}
              draggable={draggable}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
            />
          ))}
          {children && children.length === 0 && (
            <div className="p-4 border-2 border-dashed border-gray-300 text-gray-500 text-center">
              拖动元素至此或使用右侧面板添加
            </div>
          )}
        </div>
      );
      
    case 'text':
      return (
        <p {...commonProps} data-element-id={id} data-element-type={type}>
          {isSelected && (
            <div className="absolute -top-5 left-0 text-xs bg-blue-500 text-white px-2 py-1 rounded-t-md">
              {type}
            </div>
          )}
          {content}
        </p>
      );
      
    case 'button':
      return (
        <button
          {...commonProps}
          data-element-id={id}
          data-element-type={type}
          onClick={(e) => {
            e.stopPropagation();
            onClick(id);
          }}
        >
          {isSelected && (
            <div className="absolute -top-5 left-0 text-xs bg-blue-500 text-white px-2 py-1 rounded-t-md">
              {type}
            </div>
          )}
          {content?.icon && content.iconPosition === 'left' && (
            <span style={{ marginRight: '8px' }}>
              {content.icon === 'send' ? '✉️' :
               content.icon === 'user' ? '👤' :
               content.icon === 'heart' ? '❤️' : '🔍'}
            </span>
          )}
          {content?.text}
          {content?.icon && content.iconPosition === 'right' && (
            <span style={{ marginLeft: '8px' }}>
              {content.icon === 'send' ? '✉️' :
               content.icon === 'user' ? '👤' :
               content.icon === 'heart' ? '❤️' : '🔍'}
            </span>
          )}
        </button>
      );
      
    case 'input':
      return (
        <div {...commonProps} data-element-id={id} data-element-type={type}>
          {isSelected && (
            <div className="absolute -top-5 left-0 text-xs bg-blue-500 text-white px-2 py-1 rounded-t-md">
              {type}
            </div>
          )}
          <input
            type={content?.type || 'text'}
            placeholder={content?.placeholder}
            value={content?.value || ''}
            style={convertToReactStyle(style)}
            onChange={(e) => e.preventDefault()}
            disabled
          />
        </div>
      );
      
    case 'image':
      return (
        <div {...commonProps} data-element-id={id} data-element-type={type}>
          {isSelected && (
            <div className="absolute -top-5 left-0 text-xs bg-blue-500 text-white px-2 py-1 rounded-t-md">
              {type}
            </div>
          )}
          <img
            src={content?.src || "https://via.placeholder.com/150"}
            alt={content?.alt || "示例图片"}
            style={convertToReactStyle(style)}
          />
        </div>
      );
      
    case 'divider':
      const dividerStyle = {
        border: 'none',
        height: style.direction === 'horizontal' ? `${style.thickness}px` : '100%',
        width: style.direction === 'vertical' ? `${style.thickness}px` : '100%',
        backgroundColor: style.color,
        borderStyle: style.style || 'solid',
        margin: style.direction === 'horizontal' ? '16px 0' : '0 16px',
        ...selectedStyle
      };
      
      return (
        <div {...commonProps} data-element-id={id} data-element-type={type}>
          {isSelected && (
            <div className="absolute -top-5 left-0 text-xs bg-blue-500 text-white px-2 py-1 rounded-t-md">
              {type}
            </div>
          )}
          <hr style={dividerStyle} />
        </div>
      );
      
    case 'icon':
      return (
        <div
          {...commonProps}
          data-element-id={id}
          data-element-type={type}
          style={{
            ...commonProps.style,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {isSelected && (
            <div className="absolute -top-5 left-0 text-xs bg-blue-500 text-white px-2 py-1 rounded-t-md">
              {type}
            </div>
          )}
          {content?.icon === 'send' ? '✉️' :
           content?.icon === 'user' ? '👤' :
           content?.icon === 'heart' ? '❤️' : '🔍'}
        </div>
      );
      
    case 'background':
      const bgStyle = {
        ...convertToReactStyle(style),
        backgroundImage: content?.type === 'img' ? `url(${content.src})` : null,
        backgroundColor: content?.type === 'color' ? content.color : null,
        backgroundSize: content?.fit,
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: -1,
        ...selectedStyle
      };
      
      return (
        <div
          {...commonProps}
          style={bgStyle}
          data-element-id={id}
          data-element-type={type}
        >
          {isSelected && (
            <div className="absolute -top-5 left-0 text-xs bg-blue-500 text-white px-2 py-1 rounded-t-md">
              {type}
            </div>
          )}
        </div>
      );
      
    default:
      return (
        <div
          {...commonProps}
          data-element-id={id}
          data-element-type={type}
        >
          {isSelected && (
            <div className="absolute -top-5 left-0 text-xs bg-blue-500 text-white px-2 py-1 rounded-t-md">
              {type}
            </div>
          )}
          未知元素类型: {type}
        </div>
      );
  }
};

// 主编辑器组件
const LayoutEditor = () => {
  // 初始容器模板
  const initialLayout = {
    ...elementDefinitions.container,
    id: 'root',
    style: {
      ...elementDefinitions.container.style,
      width: '100%',
      minHeight: 400,
      backgroundColor: '#f5f5f5',
      borderRadius: 4,
      padding: 16
    },
    children: []
  };
  
  // 状态管理
  const [layout, setLayout] = useState(initialLayout);
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedElementId, setDraggedElementId] = useState(null);
  
  // 查找当前选中的元素
  const findSelectedElement = useCallback(() => {
    const findElementById = (element, id) => {
      if (element.id === id) return element;
      
      if (element.children) {
        for (const child of element.children) {
          const found = findElementById(child, id);
          if (found) return found;
        }
      }
      
      return null;
    };
    
    return selectedElementId ? findElementById(layout, selectedElementId) : null;
  }, [layout, selectedElementId]);
  
  // 获取当前选中的元素
  const selectedElement = findSelectedElement();
  
  // 处理元素选择
  const handleElementSelect = (id) => {
    setSelectedElementId(id);
  };
  
  // 处理样式变更
  const handleStyleChange = (property, value) => {
    if (!selectedElementId) return;
    
    setLayout(prevLayout =>
      findAndUpdateElement(prevLayout, selectedElementId, (element) => ({
        ...element,
        style: {
          ...element.style,
          [property]: value
        }
      }))
    );
  };
  
  // 处理内容变更
  const handleContentChange = (path, value) => {
    if (!selectedElementId) return;
    
    setLayout(prevLayout =>
      findAndUpdateElement(prevLayout, selectedElementId, (element) => {
        const newElement = { ...element };
        
        // 处理内容对象
        if (path === 'content' && typeof value === 'string') {
          // 直接设置文本内容
          newElement.content = value;
        } else {
          // 设置内容对象的属性
          setNestedProperty(newElement, path, value);
        }
        
        return newElement;
      })
    );
  };
  
  // 处理新元素添加
  const handleAddComponent = (elementType) => {
    if (!selectedElementId) return;
    
    const newElement = createNewElement(elementType);
    
    setLayout(prevLayout =>
      addChildToContainer(prevLayout, selectedElementId, newElement)
    );
  };
  
  // 处理预设应用
  const handlePresetApply = (presetName) => {
    if (!selectedElementId || !selectedElement) return;
    
    const updatedElement = applyPreset(selectedElement, presetName);
    
    setLayout(prevLayout =>
      findAndUpdateElement(prevLayout, selectedElementId, () => updatedElement)
    );
  };
  
  // 拖拽处理
  const handleDragStart = (e, id) => {
    setIsDragging(true);
    setDraggedElementId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  
  const handleDrop = (e, containerId) => {
    e.preventDefault();
    setIsDragging(false);
    
    const elementId = e.dataTransfer.getData('text/plain');
    if (!elementId || elementId === containerId) return;
    
    // 找到被拖拽的元素并从原位置移除
    let draggedElement = null;
    const removeElementById = (element, id) => {
      if (element.id === id) {
        draggedElement = { ...element };
        return null;
      }
      
      if (element.children) {
        const newChildren = element.children.map(child => removeElementById(child, id)).filter(Boolean);
        return { ...element, children: newChildren };
      }
      
      return element;
    };
    
    // 应用移除操作获取更新后的布局
    const updatedLayout = removeElementById(layout, elementId);
    
    // 如果找到了要移动的元素，则将其添加到目标容器
    if (draggedElement) {
      const finalLayout = addChildToContainer(updatedLayout, containerId, draggedElement);
      setLayout(finalLayout);
    }
  };
  
  // 渲染编辑器界面
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* 编辑区域 */}
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-bold mb-6">八要素布局编辑器</h1>
        <div className="bg-white rounded-lg shadow-md p-4 min-h-[600px]">
          <EditableElement
            element={layout}
            onClick={handleElementSelect}
            isSelected={selectedElementId === layout.id}
            draggable={true}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        </div>
      </div>
      
      {/* 配置面板 */}
      <div className="w-1/3 bg-white border-l p-4 overflow-y-auto">
        <LayoutControl
          selectedElement={selectedElement}
          selectedElementId={selectedElementId}
          onStyleChange={handleStyleChange}
          onContentChange={handleContentChange}
          onAddComponent={handleAddComponent}
          onPresetApply={handlePresetApply}
        />
      </div>
    </div>
  );
};

// 初始演示组件
const ElementsDemo = () => {
  // 标签页状态
  const [activeTab, setActiveTab] = useState('editor');

  // 辅助函数：生成简单元素示例
  const renderElementExample = (type) => {
    const element = {
      ...elementDefinitions[type],
      id: `example-${type}`,
      style: {
        ...elementDefinitions[type].style,
        margin: '10px 0'
      }
    };
    
    // 添加示例内容
    switch (type) {
      case 'text':
        element.content = `${type.charAt(0).toUpperCase() + type.slice(1)} 示例`;
        break;
      case 'button':
        element.content = {
          ...element.content,
          text: '按钮示例'
        };
        break;
      case 'input':
        element.content = {
          ...element.content,
          placeholder: '输入框示例'
        };
        break;
      case 'image':
        element.content = {
          ...element.content,
          src: 'https://via.placeholder.com/150',
          alt: '图片示例'
        };
        break;
      case 'icon':
        element.content = {
          ...element.content,
          icon: 'heart'
        };
        break;
      default:
        break;
    }
    
    return (
      <div key={type} className="mb-4 p-4 border rounded-md">
        <h3 className="text-lg font-medium mb-2">{type.charAt(0).toUpperCase() + type.slice(1)}</h3>
        <EditableElement
          element={element}
          onClick={() => {}}
          isSelected={false}
        />
      </div>
    );
  };
  
  // 标签样式
  const tabStyle = (isActive) => `px-4 py-2 ${isActive ? 'bg-blue-100 border-b-2 border-blue-500' : 'hover:bg-gray-100'} cursor-pointer`;
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 标签页导航 */}
      <div className="bg-white border-b flex">
        <div
          className={tabStyle(activeTab === 'editor')}
          onClick={() => setActiveTab('editor')}
        >
          布局编辑器
        </div>
        <div
          className={tabStyle(activeTab === 'elements')}
          onClick={() => setActiveTab('elements')}
        >
          八要素组件
        </div>
      </div>
      
      {/* 内容区域 */}
      <div className="container mx-auto p-4">
        {activeTab === 'editor' ? (
          <LayoutEditor />
        ) : (
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            {Object.keys(elementDefinitions).map(type => renderElementExample(type))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ElementsDemo;