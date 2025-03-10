'use client';
import React, { useRef, useEffect, useState } from 'react';
import { calculateVisualWeight } from '../../utils/layoutAnalysis/index';

/**
 * 内容密度可视化组件
 * 直接使用真实DOM元素显示密度分布
 */
const DensityMapVisualizer = ({ densityData, layout }) => {
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 300, height: 300 });

  // 将密度值映射到颜色
  const getColorForDensity = (density) => {
    // 根据密度值选择颜色
    const colorRange = densityData?.visualizationData?.colorRange || [
      { value: 0, color: '#FFFFFF' },    // 白色 - 无内容
      { value: 20, color: '#E3F5FD' },   // 非常浅的蓝色 - 极低密度
      { value: 40, color: '#C2E8F9' },   // 浅蓝色 - 低密度
      { value: 60, color: '#A1D9F5' },   // 中蓝色 - 中密度
      { value: 80, color: '#74C6EC' },   // 蓝色 - 中高密度
      { value: 100, color: '#4FB0E3' },  // 深蓝色 - 高密度
      { value: 120, color: '#F99D45' },  // 橙色 - 过高密度
      { value: 140, color: '#E94A3D' }   // 红色 - 极高密度
    ];

    // 从范围中找出适当的颜色
    for (let i = 1; i < colorRange.length; i++) {
      if (density <= colorRange[i].value) {
        const lowerColor = colorRange[i - 1].color;
        const upperColor = colorRange[i].color;
        const lowerValue = colorRange[i - 1].value;
        const upperValue = colorRange[i].value;

        // 计算内插因子
        const factor = (density - lowerValue) / (upperValue - lowerValue);

        // 解析颜色
        const lowerRGB = hexToRgb(lowerColor);
        const upperRGB = hexToRgb(upperColor);

        // 线性内插RGB值
        const r = Math.round(lowerRGB.r + factor * (upperRGB.r - lowerRGB.r));
        const g = Math.round(lowerRGB.g + factor * (upperRGB.g - lowerRGB.g));
        const b = Math.round(lowerRGB.b + factor * (upperRGB.b - lowerRGB.b));

        return `rgb(${r}, ${g}, ${b})`;
      }
    }

    // 默认返回最高密度颜色
    return colorRange[colorRange.length - 1].color;
  };

  // 十六进制颜色转RGB
  const hexToRgb = (hex) => {
    // 移除 # 如果存在
    hex = hex.replace('#', '');
    
    // 解析RGB值
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return { r, g, b };
  };

  // 渲染热图
  useEffect(() => {
    if (!canvasRef.current || !densityData?.densityMap) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const densityMap = densityData.densityMap;
    const gridSize = densityMap.length;
    const cellWidth = canvas.width / gridSize;
    const cellHeight = canvas.height / gridSize;

    // 保存画布尺寸
    setDimensions({ width: canvas.width, height: canvas.height });
    
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制密度网格
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const density = densityMap[y][x];
        
        // 设置填充颜色
        ctx.fillStyle = getColorForDensity(density);
        
        // 填充单元格
        ctx.fillRect(
          x * cellWidth, 
          y * cellHeight, 
          cellWidth, 
          cellHeight
        );
        
        // 为高密度区域添加边框
        if (density > 100) {
          ctx.strokeStyle = 'rgba(255, 0, 0, 0.7)';
          ctx.lineWidth = 1;
          ctx.strokeRect(
            x * cellWidth, 
            y * cellHeight, 
            cellWidth, 
            cellHeight
          );
        } else if (density > 80) {
          ctx.strokeStyle = 'rgba(255, 165, 0, 0.5)';
          ctx.lineWidth = 1;
          ctx.strokeRect(
            x * cellWidth, 
            y * cellHeight, 
            cellWidth, 
            cellHeight
          );
        }
      }
    }

    // 绘制问题区域标记
    if (densityData.problemAreas && densityData.problemAreas.length > 0) {
      densityData.problemAreas.forEach((area, index) => {
        if (area.cells && area.cells.length > 0) {
          // 在第一个单元格上标注区域编号
          const cell = area.cells[0];
          const centerX = (cell.x + 0.5) * cellWidth;
          const centerY = (cell.y + 0.5) * cellHeight;
          
          // 根据问题严重程度设置不同的标记样式
          const color = area.severity === 'high' ? 'red' : 'orange';
          
          ctx.fillStyle = 'white';
          ctx.beginPath();
          ctx.arc(centerX, centerY, 9, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.fillStyle = 'white';
          ctx.font = 'bold 10px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(index + 1, centerX, centerY);
        }
      });
    }

  }, [densityData]);

  // 渲染布局元素轮廓
  const renderLayoutElements = () => {
    if (!layout) return null;
    
    return (
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ 
          width: dimensions.width,
          height: dimensions.height
        }}
        ref={overlayRef}
      >
        <ElementOutline 
          element={layout} 
          containerDimensions={dimensions} 
        />
      </div>
    );
  };
  
  // 递归渲染元素轮廓的组件
  const ElementOutline = ({ element, containerDimensions, parentBounds = null }) => {
    if (!element) return null;
    
    // 计算元素相对位置和尺寸
    const getBounds = () => {
      // 如果是根元素，占据整个容器
      if (!parentBounds) {
        return { 
          left: 0, 
          top: 0, 
          width: containerDimensions.width, 
          height: containerDimensions.height 
        };
      }
      
      // 计算相对于父元素的位置
      const { style } = element;
      const isColumn = parentBounds.direction === 'column';
      
      // 默认宽度和高度
      let width = element.style?.width;
      if (typeof width === 'number') {
        width = (width / 1000) * containerDimensions.width; // 假设1000px是标准宽度
      } else {
        width = isColumn ? parentBounds.width : (parentBounds.width / (parentBounds.childCount || 1));
      }
      
      let height = element.style?.height;
      if (typeof height === 'number') {
        height = (height / 1000) * containerDimensions.height; // 假设1000px是标准高度
      } else {
        height = isColumn ? (parentBounds.height / (parentBounds.childCount || 1)) : parentBounds.height;
      }
      
      // 计算位置
      const index = parentBounds.children?.findIndex(child => child.id === element.id) || 0;
      const left = isColumn ? parentBounds.left : parentBounds.left + (index * (parentBounds.width / (parentBounds.childCount || 1)));
      const top = isColumn ? parentBounds.top + (index * (parentBounds.height / (parentBounds.childCount || 1))) : parentBounds.top;
      
      return { left, top, width, height };
    };
    
    const bounds = getBounds();
    
    // 根据元素类型选择边框颜色
    const getBorderColor = () => {
      switch (element.type) {
        case 'container': return 'rgba(0, 128, 255, 0.7)';
        case 'text': return 'rgba(255, 165, 0, 0.7)';
        case 'button': return 'rgba(255, 0, 128, 0.7)';
        case 'image': return 'rgba(0, 255, 128, 0.7)';
        default: return 'rgba(128, 128, 128, 0.7)';
      }
    };
    
    // 为子元素创建新的parentBounds
    const childParentBounds = {
      ...bounds,
      direction: element.style?.direction || 'column',
      childCount: element.children?.length || 0,
      children: element.children || []
    };
    
    return (
      <>
        <div 
          className="absolute border-2"
          style={{
            left: bounds.left,
            top: bounds.top,
            width: bounds.width,
            height: bounds.height,
            borderColor: getBorderColor(),
            boxSizing: 'border-box',
            zIndex: 10
          }}
        >
          {/* 可选: 添加元素类型标签 */}
          <span 
            className="absolute top-0 left-0 bg-white px-1 text-xs font-bold"
            style={{ color: getBorderColor().replace('0.7', '1') }}
          >
            {element.type}
          </span>
        </div>
        
        {/* 递归渲染子元素 */}
        {element.children?.map(child => (
          <ElementOutline 
            key={child.id} 
            element={child} 
            containerDimensions={containerDimensions}
            parentBounds={childParentBounds}
          />
        ))}
      </>
    );
  };

  if (!densityData) {
    return <div className="p-4 text-center">暂无密度数据可视化</div>;
  }

  // 绘制密度图例
  const renderLegend = () => {
    const colorRange = densityData.visualizationData?.colorRange || [];
    
    if (colorRange.length === 0) return null;
    
    return (
      <div className="mt-2">
        <div className="flex items-center justify-center">
          <div className="flex h-4 w-full rounded-md overflow-hidden">
            {colorRange.map((item, index) => (
              <div 
                key={index} 
                className="flex-1" 
                style={{ backgroundColor: item.color }}
                title={`密度值: ${item.value}`}
              ></div>
            ))}
          </div>
        </div>
        <div className="flex w-full justify-between text-xs mt-1">
          <span>低密度</span>
          <span>高密度</span>
        </div>
      </div>
    );
  };

  // 绘制计算详情
  const renderCalculations = () => {
    const { calculations } = densityData;
    
    if (!calculations) return null;
    
    // 获取布局类型信息
    const layoutTypeInfo = calculations.layoutTypeInfo || {};
    
    return (
      <div className="mt-4 text-sm border-t pt-3">
        <h5 className="font-medium mb-2">密度计算详情</h5>
        <div className="space-y-2">
          <div>
            <span className="font-medium">计算方法: </span>
            <span>{calculations.method || '结构估算'}</span>
          </div>
          
          {layoutTypeInfo.type && (
            <div>
              <span className="font-medium">布局类型: </span>
              <span>{layoutTypeInfo.type}</span>
              <span className="ml-2 font-medium">理想密度范围: </span>
              <span>{layoutTypeInfo.idealDensityRange}</span>
            </div>
          )}
          
          {calculations.densityStats && (
            <div>
              <span className="font-medium">平均密度: </span>
              <span>{calculations.densityStats.average.toFixed(1)}%</span>
              <span className="ml-2 font-medium">标准差: </span>
              <span>{calculations.densityStats.stdDev.toFixed(1)}%</span>
              <span className="ml-2 font-medium">最大值: </span>
              <span>{calculations.densityStats.max.toFixed(1)}%</span>
            </div>
          )}
          
          {calculations.densityScore && (
            <div>
              <span className="font-medium">密度评分计算: </span>
              <span>{calculations.densityScore.formula}</span>
            </div>
          )}
          
          {calculations.stdDevPenalty && (
            <div>
              <span className="font-medium">标准差扣分: </span>
              <span>-{calculations.stdDevPenalty.penalty.toFixed(1)} 分</span>
            </div>
          )}
          
          {calculations.variationPenalty > 0 && (
            <div>
              <span className="font-medium">分布不均匀扣分: </span>
              <span>-{calculations.variationPenalty.toFixed(1)} 分</span>
            </div>
          )}
          
          {calculations.problemAreas && calculations.problemAreas.length > 0 && (
            <div>
              <span className="font-medium">问题区域: </span>
              <div className="ml-4 mt-1">
                {calculations.problemAreas.map((area, index) => (
                  <div key={index} className="text-xs flex items-center">
                    <span className={`inline-block w-4 h-4 rounded-full mr-2 flex items-center justify-center text-white text-xs font-bold ${area.severity === 'high' ? 'bg-red-500' : 'bg-orange-400'}`}>
                      {area.id}
                    </span>
                    <span>
                      大小: {area.size} 格, 平均密度: {area.density}, 
                      严重度: {area.severity === 'high' ? '高' : '中'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // 渲染改进建议
  const renderRecommendations = () => {
    if (!densityData.recommendations || densityData.recommendations.length === 0) {
      return null;
    }
    
    return (
      <div className="mt-4 text-sm border-t pt-3">
        <h5 className="font-medium mb-2">密度改进建议</h5>
        <ul className="space-y-1 text-sm text-gray-700 ml-5 list-disc">
          {densityData.recommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium mb-2">内容密度分布可视化</h4>
      <div className="border rounded-md overflow-hidden relative">
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className="w-full h-auto"
        />
        {renderLayoutElements()}
        {renderLegend()}
      </div>
      {renderCalculations()}
      {renderRecommendations()}
    </div>
  );
};

export default DensityMapVisualizer;