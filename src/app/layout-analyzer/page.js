import { Suspense } from 'react';
import LayoutAnalyzerForm from '../components/layout-analyzer/LayoutAnalyzerForm.js';
import LayoutAnalysisResult from '../components/layout-analyzer/LayoutAnalysisResult.js';

/**
 * 布局分析页面 - 服务器组件
 * 通过表单提交布局请求到服务器进行分析
 */
export default function LayoutAnalyzerPage({ searchParams }) {
  // 从URL参数中获取布局数据或分析结果ID
  const layoutId = searchParams?.id;
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">在线布局分析工具</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 左侧 - 布局编辑表单 */}
          <div className="lg:col-span-5 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">提交布局</h2>
            <LayoutAnalyzerForm />
          </div>
          
          {/* 右侧 - 分析结果 */}
          <div className="lg:col-span-7 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">分析结果</h2>
            {layoutId ? (
              <Suspense fallback={<div className="p-12 text-center">加载分析结果中...</div>}>
                <LayoutAnalysisResult layoutId={layoutId} />
              </Suspense>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <p className="mb-2">尚未提交布局进行分析</p>
                <p className="text-sm">请在左侧表单中填写布局数据并提交</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-12 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">关于布局分析工具</h2>
          <p className="mb-4">
            本工具使用Next.js的SSR功能，实现了服务器端布局分析。
            无需通过API调用，布局分析直接在服务器端完成，提高了性能和安全性。
          </p>
          
          <h3 className="text-lg font-semibold mt-6 mb-2">优势</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>服务器端处理复杂布局计算，减轻客户端负担</li>
            <li>支持更大规模的布局分析，不受客户端内存限制</li>
            <li>实时分析结果，立即反馈</li>
            <li>支持分析结果共享和持久化存储</li>
            <li>完全集成到Next.js应用中，无需额外API层</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 