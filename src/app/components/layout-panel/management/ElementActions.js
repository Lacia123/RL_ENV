'use client';
import React from 'react';

/**
 * 元素操作组件 - 提供删除、复制等元素管理功能
 * @param {Object} props
 * @param {string} props.elementId - 当前操作的元素ID
 * @param {boolean} props.isRootElement - 是否为根元素
 * @param {Function} props.onDeleteElement - 删除元素回调
 * @param {Function} props.onDuplicateElement - 复制元素回调
 * @param {Function} props.onMoveElement - 移动元素回调 (上移或下移)
 * @param {string} props.className - 额外的CSS类
 */
const ElementActions = ({ 
  elementId, 
  isRootElement = false, 
  onDeleteElement, 
  onDuplicateElement,
  onMoveElement,
  className = "" 
}) => {
  // 如果是根元素，则不显示删除按钮
  if (isRootElement) {
    return null;
  }
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={() => onDeleteElement(elementId)}
        className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors flex items-center"
        title="删除此元素"
      >
        <span className="mr-1">🗑️</span> 删除
      </button>
      
      <button
        onClick={() => onDuplicateElement(elementId)}
        className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors flex items-center"
        title="复制此元素"
      >
        <span className="mr-1">📋</span> 复制
      </button>
      
      <div className="flex ml-2">
        <button
          onClick={() => onMoveElement(elementId, 'up')}
          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-l text-sm hover:bg-gray-200 transition-colors"
          title="上移此元素"
        >
          ↑
        </button>
        <button
          onClick={() => onMoveElement(elementId, 'down')}
          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-r text-sm hover:bg-gray-200 transition-colors border-l border-gray-200"
          title="下移此元素"
        >
          ↓
        </button>
      </div>
    </div>
  );
};

export default ElementActions;