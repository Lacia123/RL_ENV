'use client';
import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

// 注册Chart.js组件
if (typeof window !== 'undefined') {
  Chart.register(...registerables);
}

/**
 * 布局分析结果展示组件
 * 这是一个客户端组件，用于展示服务器端生成的分析结果
 */
export default function LayoutResultDisplay({ result }) {
  const [expandedSection, setExpandedSection] = useState(null);
  
  // 如果没有结果或结果不成功，显示错误消息
  if (!result || !result.success) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-md">
        <h3 className="text-lg font-medium text-red-800 mb-2">分析失败</h3>
        <p className="text-red-600">{result?.error || '未知错误'}</p>
      </div>
    );
  }
  
  const analysisData = result.result;
  
  // 格式化分数为两位小数
  const formatScore = (score) => typeof score === 'number' ? score.toFixed(2) : '0.00';
  
  // 获取评分对应的颜色类
  const getScoreColorClass = (score) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  // 准备图表数据 - 转换维度数据
  const dimensions = {
    '视觉平衡': analysisData.visualBalance,
    '层次结构': analysisData.hierarchy,
    '响应式设计': analysisData.responsiveDesign,
    '可访问性': analysisData.accessibility,
    '颜色排版': analysisData.colorTypography,
    '内容密度': analysisData.contentDensity,
    '性能考量': analysisData.performance,
    '对齐': analysisData.alignment
  };
  
  // 排序维度分数
  const sortedDimensions = Object.entries(dimensions).filter(([key, data])=>data && typeof data.score === 'number').sort(([_, a], [__, b])=>b.score - a.score);
  
  // 图表数据
  const chartData = {
    labels: sortedDimensions.map(([name]) => name),
    datasets: [
      {
        label: '维度评分',
        data: sortedDimensions.map(([_, data]) => data.score),
        backgroundColor: 'rgba(64, 169, 255, 0.6)',
        borderColor: 'rgba(24, 144, 255, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  // 图表配置
  const chartOptions = {
    indexAxis: 'y',
    responsive: true,
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: '分数'
        }
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `分数: ${formatScore(context.raw)}`
        }
      }
    }
  };
  
  return (
    <div className="bg-white rounded-lg">
      {/* 总体评分 */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h2 className="text-2xl font-bold mb-2">总体评分</h2>
        <div className="flex items-center">
          <span className={`text-5xl font-bold ${getScoreColorClass(analysisData.score)}`}>
            {formatScore(analysisData.score)}
          </span>
          <span className="ml-2 text-gray-500">/ 100</span>
        </div>
      </div>
      
      {/* 维度评分图表 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">维度评分</h2>
        <div className="h-96">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
      
      {/* 详细反馈 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">改进建议</h2>
        {analysisData.allDetails && analysisData.allDetails.length > 0 ? (
          <ul className="space-y-2">
            {analysisData.allDetails
              .filter(detail => detail.type === 'warning' || detail.type === 'suggestion')
              .slice(0, 10) // 限制显示数量
              .map((detail, index) => (
                <li key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  {detail.message}
                </li>
              ))}
          </ul>
        ) : (
          <p className="text-gray-500">没有特别需要改进的地方。</p>
        )}
      </div>
      
      {/* 各维度详情（可折叠） */}
      <div>
        <h2 className="text-2xl font-bold mb-4">维度详情</h2>
        <div className="space-y-4">
          {sortedDimensions.map(([name, data]) => (
            <div key={name} className="border border-gray-200 rounded-md overflow-hidden">
              <div 
                className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
                onClick={() => setExpandedSection(expandedSection === name ? null : name)}
              >
                <div className="flex items-center">
                  <span className="font-medium text-gray-800">{name}</span>
                  <span className={`ml-4 font-bold ${getScoreColorClass(data.score)}`}>
                    {formatScore(data.score)}
                  </span>
                </div>
                <svg 
                  className={`w-5 h-5 text-gray-500 transform ${expandedSection === name ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
              
              {expandedSection === name && (
                <div className="p-4 bg-white">
                  {data.details && data.details.length > 0 ? (
                    <ul className="space-y-2">
                      {data.details.map((detail, idx) => (
                        <li key={idx} className={`p-2 rounded-md ${
                          detail.type === 'warning' ? 'bg-red-50 text-red-700' : 
                          detail.type === 'suggestion' ? 'bg-yellow-50 text-yellow-700' : 
                          'bg-blue-50 text-blue-700'
                        }`}>
                          {detail.message}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">没有详细信息可显示。</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 