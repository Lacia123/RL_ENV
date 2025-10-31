"use client"
import React from 'react';
import EightElementAnalyzer from './eight-element-analyzer/page';

/**
 * 主页面组件 - 直接使用八要素分析器
 */
const HomePage = () => {
  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* 顶部导航栏 - 固定高度 */}
      <div className="w-full bg-white border-b shadow-sm flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex py-3">
            <div className="font-bold text-blue-600">
              强化学习环境
            </div>
          </div>
        </div>
      </div>

      {/* 内容区域 - 占据剩余空间 */}
      <div className="flex-1 overflow-hidden">
        <EightElementAnalyzer />
      </div>

      {/* 页脚信息 - 固定高度（可选，如果需要可以保留） */}
      {/* <div className="w-full bg-white border-t py-4 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          八要素设计系统 &copy; 2025 - 通用抽象化组件定义
        </div>
      </div> */}
    </div>
  );
};

export default HomePage;