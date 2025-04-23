'use client';
import React, { useState } from 'react';
import tokens from '@/app/utils/tokens/token';
import { metawareToStyleObject, getComponentStates } from '@/app/utils/metaware/metawareToCss.js';

/**
 * 元件演示组件 - 展示基于metaware系统的各种元件
 */
const ElementsDemo = () => {
  const [activeTab, setActiveTab] = useState('container');
  
  // 可用的组件类型
  const componentTypes = ['container', 'button', 'text', 'image'];
  
  // 渲染单个组件演示
  const renderComponentDemo = (componentType) => {
    // 获取组件的所有状态
    const states = getComponentStates(componentType);
    
    return (
      <div className="p-4 border rounded-lg mb-6 bg-white">
        <h2 className="text-xl font-medium mb-4 text-gray-800">
          {componentType.charAt(0).toUpperCase() + componentType.slice(1)} 组件
        </h2>
        
        <div className="grid gap-4">
          {states.map(state => {
            // 获取该状态的样式
            const styles = metawareToStyleObject(componentType, state);
            
            return (
              <div key={state} className="border p-4 rounded">
                <h3 className="text-sm font-medium mb-2 text-gray-600">
                  {state.charAt(0).toUpperCase() + state.slice(1)} 状态
                </h3>
                
                {/* 渲染组件示例 */}
                {renderComponentWithState(componentType, state, styles)}
                
                {/* 显示样式代码 */}
                <details className="mt-4">
                  <summary className="text-xs text-blue-600 cursor-pointer">查看样式代码</summary>
                  <pre className="text-xs bg-gray-100 p-2 mt-2 rounded overflow-auto">
                    {JSON.stringify(styles, null, 2)}
                  </pre>
                </details>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  // 根据组件类型和状态渲染组件
  const renderComponentWithState = (type, state, styles) => {
    switch (type) {
      case 'container':
        return (
          <div style={styles} className="flex items-center justify-center min-h-16">
            <span>Container ({state})</span>
          </div>
        );
        
      case 'button':
        return (
          <button style={styles} className="px-4 py-2">
            Button ({state})
          </button>
        );
        
      case 'text':
        return (
          <p style={styles}>
            Text component in {state} state
          </p>
        );
        
      case 'image':
        return (
          <div style={styles} className="flex items-center justify-center min-h-20 min-w-32">
            <span>Image ({state})</span>
          </div>
        );
        
      default:
        return <div>未知组件类型</div>;
    }
  };
  
  // Tab样式
  const tabStyle = (isActive) => `px-4 py-2 ${isActive ? 'bg-blue-100 border-b-2 border-blue-500' : 'hover:bg-gray-100'} cursor-pointer`;
  
  return (
    <div className="max-w-4xl mx-auto my-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">元件系统展示</h1>
      
      {/* 组件类型选择器 */}
      <div className="flex border-b mb-6">
        {componentTypes.map(type => (
          <div
            key={type}
            className={tabStyle(activeTab === type)}
            onClick={() => setActiveTab(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </div>
        ))}
      </div>
      
      {/* 组件演示 */}
      {renderComponentDemo(activeTab)}
      
      {/* 设计令牌信息 */}
      <div className="mt-8 p-4 border rounded-lg bg-gray-50">
        <h2 className="text-xl font-medium mb-4">设计令牌系统</h2>
        <p className="text-sm text-gray-600 mb-4">
          元件系统基于设计令牌系统构建，使用 metaware 提供统一的设计语言和样式定义。
        </p>
        
        <details>
          <summary className="text-sm text-blue-600 cursor-pointer">查看设计令牌示例</summary>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium mb-2">颜色令牌</h3>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(tokens.color.basic, null, 2)}
              </pre>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">尺寸令牌</h3>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(tokens.borderRadius, null, 2)}
              </pre>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
};

export default ElementsDemo;