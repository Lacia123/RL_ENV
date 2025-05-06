"use client"
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './utils/reduxStore';
import EightElementAnalyzer from './eight-element-analyzer/page';

/**
 * 主页面组件 - 直接使用八要素分析器
 */
const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <div className="w-full bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex py-3">
            <div className="font-bold text-blue-600">
              八要素分析器
            </div>
          </div>
        </div>
      </div>
      
      {/* 内容区域 */}
      <div className="w-full">
        <Provider store={store}>
          <EightElementAnalyzer />
        </Provider>
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