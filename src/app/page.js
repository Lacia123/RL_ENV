"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import LayoutEditor from './components/layout-editor/LayoutEditor';
import ElementsDemo from './components/ElementsDemo';
import { Provider } from 'react-redux';
import { store } from './utils/reduxStore';
/**
 * 主页面组件 - 整合布局编辑器和元素演示
 */
const HomePage = () => {
  const [activeTab, setActiveTab] = useState('layoutEditor');
  
  const tabStyle = (isActive) => ({
    padding: '12px 24px',
    fontWeight: isActive ? 'bold' : 'normal',
    borderBottom: isActive ? '2px solid #1890FF' : '2px solid transparent',
    color: isActive ? '#1890FF' : '#595959',
    cursor: 'pointer'
  });
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <div className="w-full bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-6">
            <div 
              style={tabStyle(activeTab === 'layoutEditor')}
              onClick={() => setActiveTab('layoutEditor')}
            >
              布局编辑器
            </div>
            {/* <div 
              style={tabStyle(activeTab === 'elementsDemo')}
              onClick={() => setActiveTab('elementsDemo')}
            >
              八要素定义系统
            </div> */}
          </div>
        </div>
      </div>
      
      {/* 内容区域 */}
      <div className="w-full">
        {activeTab === 'layoutEditor' ? (
          <Provider store={store}>
            <LayoutEditor/>
          </Provider>
        ) : (
          <ElementsDemo />
        )}
      </div>
        
      {/* 页脚信息 */}
      <div className="w-full bg-white border-t py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          八要素设计系统 &copy; 2025 - 通用抽象化组件定义
        </div>
      </div>
    </div>
  );
};

export default HomePage;