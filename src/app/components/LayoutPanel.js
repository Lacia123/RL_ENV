'use client';
import React from 'react';
import LayoutPanel from './layout-panel';
import { applyPreset } from '@/app/utils/elementDefinitions';
import { setNestedProperty } from './layout-panel/utils';

/**
 * 布局控制面板 - 兼容层
 * 提供与原始LayoutControl组件相同的API，但内部使用重构后的LayoutPanel组件
 */
const LayoutControl = ({
  selectedElement,
  onStyleChange,
  onContentChange,
  onAddComponent,
  onPresetApply,
  selectedElementId
}) => {
  // 处理删除元素的回调 - 如果父组件没提供，这里提供空实现
  const handleDeleteElement = (elementId) => {
    console.log('删除元素功能暂未实现', elementId);
    // 如果需要实现此功能，可以在父组件传入对应的回调函数
  };
  
  // 处理复制元素的回调 - 如果父组件没提供，这里提供空实现
  const handleDuplicateElement = (elementId) => {
    console.log('复制元素功能暂未实现', elementId);
    // 如果需要实现此功能，可以在父组件传入对应的回调函数
  };
  
  // 处理移动元素的回调 - 如果父组件没提供，这里提供空实现
  const handleMoveElement = (elementId, direction) => {
    console.log(`移动元素功能暂未实现: ${elementId}, 方向: ${direction}`);
    // 如果需要实现此功能，可以在父组件传入对应的回调函数
  };
  
  // 处理动作属性更新的回调 - 如果父组件没提供，这里提供空实现
  const handleActionChange = (path, value) => {
    console.log(`动作属性更新功能暂未实现: ${path}, 值: ${value}`);
    // 如果需要实现此功能，可以在父组件传入对应的回调函数
  };

  // 处理内容属性更新 - 兼容原有API
  const handleContentChange = (path, value) => {
    if (path === 'content' && typeof value === 'string') {
      // 直接设置文本内容
      onContentChange(path, value);
    } else if (path.startsWith('content.')) {
      // 处理嵌套属性 - 如content.text
      const updatedContent = selectedElement.content ? {...selectedElement.content} : {};
      const propName = path.split('.')[1];
      updatedContent[propName] = value;
      onContentChange('content', updatedContent);
    } else {
      // 其他情况直接传递
      onContentChange(path, value);
    }
  };
  
  return (
    <LayoutPanel
      selectedElement={selectedElement}
      selectedElementId={selectedElementId}
      onStyleChange={onStyleChange}
      onContentChange={handleContentChange}
      onActionChange={handleActionChange}
      onAddComponent={(type, name) => onAddComponent(type)}
      onPresetApply={(presetName) => onPresetApply(presetName)}
      onDeleteElement={handleDeleteElement}
      onDuplicateElement={handleDuplicateElement}
      onMoveElement={handleMoveElement}
    />
  );
};

export default LayoutControl;