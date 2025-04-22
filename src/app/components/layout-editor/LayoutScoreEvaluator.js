'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { analyzeLayout } from '../../utils/layoutAnalysis/index';
import DensityMapVisualizer from './DensityMapVisualizer';
import EnhancedDensityVisualizer from './EnhanceDensityMapVisualizer';

// 注册Chart.js组件
if (typeof window !== 'undefined') {
  Chart.register(...registerables);
}

/**
 * 计算布局评分组件
 * @param {Object} props
 * @param {Object} props.layout - 要评估的布局对象
 */
const LayoutScoreEvaluator = ({ layout }) => {
  const [selectedDimension, setSelectedDimension] = useState(null);
  const [showDetailedScores, setShowDetailedScores] = useState(false);
  const [domMeasurements, setDomMeasurements] = useState(null);
  // We no longer need to switch between real DOM and estimated mode
  const observerRef = useRef(null);

  // 收集DOM测量数据
  useEffect(() => {
    // 只在详细视图打开且选择了内容密度时测量
    // if (!showDetailedScores || selectedDimension !== '内容密度') {
    //   return;
    // }

    // 创建ResizeObserver来监控元素尺寸
    const collectDomMeasurements = () => {
      const measurements = {};
      const layoutContainer = document.querySelector('.layout-preview-container');

      if (!layoutContainer) {
        console.warn('未找到布局预览容器元素');
        return;
      }

      // 记录容器尺寸
      const containerRect = layoutContainer.getBoundingClientRect();
      measurements.container = {
        width: containerRect.width,
        height: containerRect.height
      };

      // 获取所有具有ID的元素
      const walkDOM = (element, layoutObj) => {
        if (!element || !layoutObj) return;

        if (layoutObj.id) {
          const domElement = document.querySelector(`[data-element-id="${layoutObj.id}"]`);
          if (domElement) {
            const rect = domElement.getBoundingClientRect();

            // 计算相对于容器的位置
            const measurement = {
              x: rect.left - containerRect.left,
              y: rect.top - containerRect.top,
              width: rect.width,
              height: rect.height,
              type: layoutObj.type
            }

            // 收集计算样式信息
            const computedStyle = window.getComputedStyle(domElement);


            // 添加关键样式属性
            measurement.style = {
              fontSize: parseFloat(computedStyle.fontSize),
              lineHeight: parseFloat(computedStyle.lineHeight),
              fontWeight: computedStyle.fontWeight,
              color: computedStyle.color,
              backgroundColor: computedStyle.backgroundColor,
              padding: {
                top: parseFloat(computedStyle.paddingTop),
                right: parseFloat(computedStyle.paddingRight),
                bottom: parseFloat(computedStyle.paddingBottom),
                left: parseFloat(computedStyle.paddingLeft)
              },
              margin: {
                top: parseFloat(computedStyle.marginTop),
                right: parseFloat(computedStyle.marginRight),
                bottom: parseFloat(computedStyle.marginBottom),
                left: parseFloat(computedStyle.marginLeft)
              }
            };


            // 文本元素特有属性
            if (layoutObj.type === 'text') {
              measurement.style.textAlign = computedStyle.textAlign;
              measurement.style.letterSpacing = parseFloat(computedStyle.letterSpacing);
              measurement.style.wordSpacing = parseFloat(computedStyle.wordSpacing);

              // 计算文本密度
              if (domElement.textContent) {
                measurement.textContent = domElement.textContent;
                measurement.textLength = domElement.textContent.length;
                const textArea = rect.width * rect.height;
                measurement.textDensity = textArea > 0 ?
                  (measurement.textLength / textArea) * 10000 : 0; // 标准化单位
              }

              // 获取Typography预设名称，方便后续分析
              measurement.typographyPreset = layoutObj.typographyPreset;
            }

            // 按钮元素特有属性
            if (layoutObj.type === 'button') {
              measurement.style.borderRadius = computedStyle.borderRadius;
              measurement.style.borderWidth = parseFloat(computedStyle.borderWidth);
              measurement.buttonSizePreset = layoutObj.buttonSizePreset;
              measurement.appearancePreset = layoutObj.appearancePreset;
            }

            // 容器元素特有属性
            if (layoutObj.type === 'container') {
              measurement.style.display = computedStyle.display;
              measurement.style.flexDirection = computedStyle.flexDirection;
              measurement.style.justifyContent = computedStyle.justifyContent;
              measurement.style.alignItems = computedStyle.alignItems;
              measurement.style.gap = parseFloat(computedStyle.gap);
              measurement.layoutPreset = layoutObj.layoutPreset;
              measurement.spacingPreset = layoutObj.spacingPreset;
            }

            // 保存所有信息
            measurements[layoutObj.id] = measurement;
          }
        }

        // 递归子元素
        if (layoutObj.children) {
          layoutObj.children.forEach(child => {
            walkDOM(element, child);
          });
        }
      };

      walkDOM(layoutContainer, layout);
      setDomMeasurements(measurements);
    };

    // 初始收集
    setTimeout(collectDomMeasurements, 500); // 延迟以确保DOM已渲染

    // 设置ResizeObserver监听容器大小变化
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const observer = new ResizeObserver(() => {
      collectDomMeasurements();
    });

    const layoutContainer = document.querySelector('.layout-preview-container');
    if (layoutContainer) {
      observer.observe(layoutContainer);
      observerRef.current = observer;
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [layout, showDetailedScores, selectedDimension]);

  // 评估布局并获取各维度评分
  const { overallScore, dimensionScores, feedback, densityData } = evaluateLayout(layout, domMeasurements);

  // 排序维度分数，用于显示
  const sortedDimensions = Object.entries(dimensionScores).sort((a, b) => b[1].score - a[1].score);

  // 准备图表数据
  const chartData = {
    labels: Object.keys(dimensionScores),
    datasets: [
      {
        label: '维度评分',
        data: Object.values(dimensionScores).map(d => d.score),
        backgroundColor: 'rgba(64, 169, 255, 0.6)',
        borderColor: 'rgba(24, 144, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    indexAxis: 'y',
    responsive: true,
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <div className="bg-white rounded-lg p-4 border my-4">
      <h3 className="text-lg font-medium mb-2">布局评分</h3>
      <div className="flex items-center">
        <div className="w-full bg-gray-200 rounded-full h-4 mr-4">
          <div
            className="bg-blue-600 h-4 rounded-full"
            style={{ width: `${overallScore}%` }}
          ></div>
        </div>
        <span className="font-medium">{Math.round(overallScore)}%</span>
      </div>

      <div className="mt-4">
        <button
          className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100"
          onClick={() => setShowDetailedScores(!showDetailedScores)}
        >
          {showDetailedScores ? '隐藏详细评分' : '查看详细评分'}
        </button>
      </div>

      {showDetailedScores && (
        <div className="mt-4">
          <div className="h-72">
            <Bar data={chartData} options={chartOptions} />
          </div>

          <div className="mt-6 space-y-4">
            {sortedDimensions.map(([dimension, data]) => (
              <div key={dimension} className="border rounded-md p-3">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => setSelectedDimension(selectedDimension === dimension ? null : dimension)}
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{dimension}</h4>
                    <div className="flex items-center mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className={`h-2 rounded-full ${getScoreColorClass(data.score)}`}
                          style={{ width: `${data.score}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{Math.round(data.score)}</span>
                    </div>
                  </div>
                  <div className="ml-2">
                    <svg className={`w-5 h-5 transform ${selectedDimension === dimension ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>

                {selectedDimension === dimension && (
                  <div className="mt-3 text-sm border-t pt-3">
                    {/* 评分详情 */}
                    {data.details && (
                      <>
                        <h5 className="font-medium mb-2">评分详情</h5>
                        <ul className="space-y-2">
                          {data.details.map((detail, i) => (
                            <li key={i} className={`flex items-start ${detail.type === 'success' ? 'text-green-700' : 'text-amber-700'}`}>
                              {detail.type === 'success' ? (
                                <span className="mr-2 mt-0.5">✓</span>
                              ) : (
                                <span className="mr-2 mt-0.5">⚠</span>
                              )}
                              <span>{detail.message}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}

                    {/* 内容密度可视化 */}
                    {dimension === '内容密度' && densityData && (
                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="font-medium">密度可视化</h5>
                        </div>
                        {/* <DensityMapVisualizer
                          densityData={densityData}
                          layout={layout}
                        /> */}
                        <EnhancedDensityVisualizer
                          densityData={densityData}
                          layout={layout}
                          domMeasurements={domMeasurements}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-2 text-xs text-gray-500">
        评分基于多维度指标，包括视觉平衡、层次结构、响应式设计等
      </div>
    </div>
  );
};

/**
 * 获取分数对应的颜色类
 * @param {number} score - 评分 (0-100)
 * @returns {string} - Tailwind颜色类
 */
const getScoreColorClass = (score) => {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-blue-500';
  if (score >= 40) return 'bg-yellow-500';
  return 'bg-red-500';
};

/**
 * 计算布局评分
 * @param {Object} layout - 布局对象
 * @param {Object} domMeasurements - DOM测量数据（可选）
 * @returns {Object} - 评分结果，包括总分和各维度分数
 */
export const evaluateLayout = (layout, domMeasurements = null) => {
  // 使用新的模块化分析系统
  console.log('....  evaluateLayout domMeasurements')
  console.log(domMeasurements)
  const analysisResult = analyzeLayout(layout, domMeasurements);

  // 将分析结果转换为组件所需的格式
  const overallScore = analysisResult.score;

  // 构建维度评分
  const dimensionScores = {
    '视觉平衡': {
      score: analysisResult.visualBalance.score,
      details: analysisResult.visualBalance.details
    },
    '层次结构': {
      score: analysisResult.hierarchy.score,
      details: analysisResult.hierarchy.details
    },
    '响应式设计': {
      score: analysisResult.responsiveDesign.score,
      details: analysisResult.responsiveDesign.details
    },
    '可访问性': {
      score: analysisResult.accessibility.score,
      details: analysisResult.accessibility.details
    },
    '颜色排版': {
      score: analysisResult.colorTypography.score,
      details: analysisResult.colorTypography.details
    },
    '内容密度': {
      score: analysisResult.contentDensity.score,
      details: analysisResult.contentDensity.details
    },
    '性能考量': {
      score: analysisResult.performance.score,
      details: analysisResult.performance.details
    },
    '对齐': {
      score: analysisResult.alignment.score,
      details: analysisResult.alignment.details
    }
  };

  // 提取改进建议
  const feedback = analysisResult.allDetails
    .filter(detail => detail.type === 'warning')
    .map(detail => detail.message);

  // 返回内容密度数据用于可视化
  const densityData = analysisResult.contentDensity;

  console.log('.... layout')
  console.log(layout)

  console.log('.... densityData')
  console.log(densityData)

  return { overallScore, dimensionScores, feedback, densityData };
};


export default LayoutScoreEvaluator;