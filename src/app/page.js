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
      
      {/* SSR布局分析功能导航 */}
      <div className="max-w-7xl mx-auto px-4 py-8 mt-8 bg-white border rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">服务器端布局分析功能</h2>
        <p className="mb-6 text-gray-600">
          探索我们新的服务器端渲染(SSR)布局分析功能，充分利用Next.js的强大功能直接在服务器上进行布局评估。
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/layout-server-demo" className="block p-6 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
            <h3 className="text-xl font-semibold mb-2 text-blue-800">服务器端布局演示</h3>
            <p className="text-blue-600">查看预设布局的服务器端分析示例，了解SSR布局分析的工作原理。</p>
          </Link>
          
          <Link href="/layout-analyzer" className="block p-6 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
            <h3 className="text-xl font-semibold mb-2 text-green-800">在线布局分析工具</h3>
            <p className="text-green-600">使用我们的在线工具分析您自己的布局，获取详细的评估和改进建议。</p>
          </Link>
        </div>
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