'use client';

import React, { useEffect, useRef, useState } from 'react';
import { evaluateVisualSpace } from '../utils/layoutAnalysis/visualSpaceScore';

/**
 * 视觉空间评分组件
 * @param {Object} props 
 * @param {Object} props.domMeasurements - DOM测量数据
 * @param {Object} props.layout - 布局数据
 */
const VisualSpaceEvaluator = ({ domMeasurements, layout }) => {
  const [scoreResult, setScoreResult] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!domMeasurements || !layout) return;

    // 计算评分
    const result = evaluateVisualSpace(domMeasurements, layout);
    setScoreResult(result);

    // 如果有可视化Canvas，添加到DOM中
    if (result.visualization && canvasRef.current) {
      const canvasContainer = canvasRef.current;
      // 清空容器
      while (canvasContainer.firstChild) {
        canvasContainer.removeChild(canvasContainer.firstChild);
      }
      
      // 添加新的Canvas，并设置样式使其适应容器
      result.visualization.style.maxWidth = '100%';
      result.visualization.style.height = 'auto';
      result.visualization.style.border = '1px solid #ddd';
      result.visualization.style.borderRadius = '4px';
      result.visualization.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
      canvasContainer.appendChild(result.visualization);
    }
  }, [domMeasurements, layout]);

  if (!scoreResult) {
    return <div className="p-4 text-center">加载中...</div>;
  }

  const { score, categories, overallRecommendation } = scoreResult;
  const { spaceUtilization, contentAdaptability } = categories;

  // 根据分数设置颜色 - 更平滑的颜色过渡
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 70) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 50) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-500';
    return 'text-orange-600'; // 最低分数为20，不会出现红色
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">视觉空间评分</h2>
          <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
            {score}
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">总体建议</h3>
          <p className="text-gray-700">{overallRecommendation}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* 空间利用率 */}
          <div className="bg-gray-50 p-3 rounded">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">空间利用率</h4>
              <span className={`font-bold ${getScoreColor(spaceUtilization.score)}`}>
                {spaceUtilization.score}分
              </span>
            </div>
            <div className="text-sm mb-2">
              有效利用率: {
                (parseFloat(spaceUtilization.details.utilizationRatio) * 100).toFixed(2) || 0
              }%
              <span className="ml-2 text-blue-600 font-medium">
                (推荐: 30-50%)
              </span>
            </div>
            <div className="mt-1 w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${
                  spaceUtilization.score >= 80 ? 'bg-green-500' : 
                  spaceUtilization.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${spaceUtilization.score}%` }}>
              </div>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {spaceUtilization.details.recommendation}
            </div>
          </div>

          {/* 内容适应性 */}
          <div className="bg-gray-50 p-3 rounded">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold">内容适应性</h4>
              <span className={`font-bold ${getScoreColor(contentAdaptability.score)}`}>
                {contentAdaptability.score}分
              </span>
            </div>
            <div className="text-sm mb-2">
              垂直溢出: {
                (parseFloat(contentAdaptability.details.verticalOverflowRatio) * 100).toFixed(2) || 0
              }%
              <br />
              水平溢出: {
                (parseFloat(contentAdaptability.details.horizontalOverflowRatio) * 100).toFixed(2) || 0
              }%
            </div>
            <div className="text-sm text-gray-600">
              {contentAdaptability.details.recommendation}
            </div>
          </div>
        </div>

        {/* 布局可视化 */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">布局可视化</h3>
          <div
            ref={canvasRef}
            className="border rounded p-2 bg-gray-100 flex justify-center overflow-auto"
            style={{ minHeight: '300px', maxHeight: '500px' }}
          ></div>
          <div className="mt-2 text-xs text-gray-500 text-center">
            <span className="inline-block px-2 py-1 mr-2 bg-blue-100 rounded">蓝色: 文本元素</span>
            <span className="inline-block px-2 py-1 mr-2 bg-green-100 rounded">绿色: 图片元素</span>
            <span className="inline-block px-2 py-1 mr-2 bg-red-100 rounded">红色: 按钮元素</span>
            <span className="inline-block px-2 py-1 bg-gray-100 rounded">灰色: 容器元素</span>
          </div>
        </div>

        {/* 详细数据 */}
        <div className="mt-6">
          <details className="text-sm">
            <summary className="cursor-pointer font-medium mb-2">显示详细数据</summary>
            <div className="mt-2 bg-gray-50 p-3 rounded overflow-auto">
              <pre className="text-xs">
                {JSON.stringify({
                  spaceUtilization: {
                    score: spaceUtilization.score,
                    utilizationRatio: spaceUtilization.details.utilizationRatio,
                    effectiveArea: spaceUtilization.details.effectiveArea,
                    totalArea: spaceUtilization.details.totalArea,
                    elementsCount: spaceUtilization.details.elementsCount,
                    recommendation: spaceUtilization.details.recommendation
                  },
                  contentAdaptability: {
                    score: contentAdaptability.score,
                    verticalOverflowRatio: contentAdaptability.details.verticalOverflowRatio,
                    horizontalOverflowRatio: contentAdaptability.details.horizontalOverflowRatio,
                    maxBottom: contentAdaptability.details.maxBottom,
                    maxRight: contentAdaptability.details.maxRight,
                    containerHeight: contentAdaptability.details.containerHeight,
                    containerWidth: contentAdaptability.details.containerWidth,
                    overflowingElementsCount: contentAdaptability.details.overflowingElements?.length || 0,
                    recommendation: contentAdaptability.details.recommendation
                  }
                }, null, 2)}
              </pre>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};

export default VisualSpaceEvaluator; 