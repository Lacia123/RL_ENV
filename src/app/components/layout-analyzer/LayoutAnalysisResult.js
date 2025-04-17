import { notFound } from 'next/navigation';
import LayoutResultDisplay from '../layout-server-demo/LayoutResultDisplay.js';

/**
 * 布局分析结果组件 (服务器组件)
 * 根据ID从服务器获取结果并展示
 * 
 * @param {Object} props
 * @param {string} props.layoutId - 布局分析结果ID
 */
export default async function LayoutAnalysisResult({ layoutId }) {
  // 从服务器获取结果
  const result = await fetchAnalysisResult(layoutId);
  
  // 如果找不到结果，显示404页面
  if (!result || !result.success) {
    notFound();
  }
  
  return (
    <div>
      {/* 使用客户端组件展示分析结果 */}
      <LayoutResultDisplay result={result.data.result} />
      
      {/* 显示结果元数据 */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          分析完成时间: {formatDate(result.data.timestamp)}
        </p>
      </div>
    </div>
  );
}

/**
 * 从服务器获取分析结果
 * @param {string} layoutId - 布局分析结果ID
 * @returns {Promise<Object>} 分析结果
 */
async function fetchAnalysisResult(layoutId) {
  try {
    // 服务器组件可以直接使用node-fetch或全局fetch
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/layout-analyzer/submit?id=${layoutId}`, {
      // 禁止缓存以确保获取最新结果
      cache: 'no-store'
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('获取分析结果失败:', error);
    return null;
  }
}

/**
 * 格式化日期
 * @param {number} timestamp 时间戳
 * @returns {string} 格式化的日期字符串
 */
function formatDate(timestamp) {
  if (!timestamp) return '未知时间';
  
  const date = new Date(timestamp);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
} 