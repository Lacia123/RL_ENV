import React, { useRef, useEffect, useState } from 'react';

// 增强版密度可视化组件，直接使用DOM测量数据
const EnhancedDensityVisualizer = ({ densityData, layout, domMeasurements }) => {
  const canvasRef = useRef(null);
  const [activeView, setActiveView] = useState('heatmap'); // 'heatmap', 'outline', 'combined'
  const [dimensions, setDimensions] = useState({ width: 500, height: 400 });
  
  // 将密度值映射到颜色，带透明度
  const getColorForDensity = (density, alpha = 1) => {
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
        const lowerColor = hexToRgb(colorRange[i - 1].color);
        const upperColor = hexToRgb(colorRange[i].color);
        const lowerValue = colorRange[i - 1].value;
        const upperValue = colorRange[i].value;

        // 计算内插因子
        const factor = (density - lowerValue) / (upperValue - lowerValue);

        // 线性内插RGB值
        const r = Math.round(lowerColor.r + factor * (upperColor.r - lowerColor.r));
        const g = Math.round(lowerColor.g + factor * (upperColor.g - lowerColor.g));
        const b = Math.round(lowerColor.b + factor * (upperColor.b - lowerColor.b));

        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }
    }

    // 默认返回最高密度颜色
    const highestColor = hexToRgb(colorRange[colorRange.length - 1].color);
    return `rgba(${highestColor.r}, ${highestColor.g}, ${highestColor.b}, ${alpha})`;
  };

  // 十六进制颜色转RGB
  const hexToRgb = (hex) => {
    hex = hex.replace('#', '');
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
    
    // 使用实际DOM容器尺寸设置画布大小
    if (domMeasurements?.container) {
      const ratio = domMeasurements.container.width / domMeasurements.container.height;
      const maxWidth = 500; // 最大宽度限制
      
      let canvasWidth = Math.min(maxWidth, domMeasurements.container.width);
      let canvasHeight = canvasWidth / ratio;
      
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      setDimensions({ width: canvasWidth, height: canvasHeight });
    }
    
    const cellWidth = canvas.width / gridSize;
    const cellHeight = canvas.height / gridSize;
    
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 判断是否需要绘制热图
    if (activeView === 'heatmap' || activeView === 'combined') {
      // 绘制密度网格
      for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
          const density = densityMap[y][x];
          
          // 设置填充颜色 - 在combined模式下使用半透明
          ctx.fillStyle = getColorForDensity(density, activeView === 'combined' ? 0.7 : 1);
          
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
    }

    // 判断是否需要绘制轮廓
    if (activeView === 'outline' || activeView === 'combined') {
      // 直接绘制DOM元素轮廓
      if (domMeasurements && layout) {
        drawElementOutlines(ctx, layout, domMeasurements);
      }
    }
  }, [densityData, activeView, domMeasurements, layout]);

  // 使用Canvas绘制元素轮廓而不是DOM叠加
  const drawElementOutlines = (ctx, rootElement, domMeasurements) => {
    if (!rootElement || !domMeasurements.container) return;
    
    const containerWidth = domMeasurements.container.width;
    const containerHeight = domMeasurements.container.height;
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;
    
    // 递归绘制元素轮廓
    const drawElement = (element) => {
      if (!element || !element.id || !domMeasurements[element.id]) return;
      
      const measurement = domMeasurements[element.id];
      
      // 计算缩放后的坐标
      const scaledX = (measurement.x / containerWidth) * canvasWidth;
      const scaledY = (measurement.y / containerHeight) * canvasHeight;
      const scaledWidth = (measurement.width / containerWidth) * canvasWidth;
      const scaledHeight = (measurement.height / containerHeight) * canvasHeight;
      
      // 根据元素类型选择边框颜色
      let strokeColor;
      switch (element.type) {
        case 'container': strokeColor = 'rgba(0, 128, 255, 0.8)'; break;
        case 'text': strokeColor = 'rgba(255, 165, 0, 0.8)'; break;
        case 'button': strokeColor = 'rgba(255, 0, 128, 0.8)'; break;
        case 'image': strokeColor = 'rgba(0, 255, 128, 0.8)'; break;
        default: strokeColor = 'rgba(128, 128, 128, 0.8)';
      }
      
      // 绘制元素边框
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(scaledX, scaledY, scaledWidth, scaledHeight);
      
      // 添加元素类型标签
      ctx.fillStyle = 'white';
      ctx.fillRect(scaledX, scaledY, 40, 16);
      ctx.fillStyle = strokeColor;
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(element.type, scaledX + 3, scaledY + 8);
      
      // 递归处理子元素
      if (element.children && element.children.length > 0) {
        element.children.forEach(child => drawElement(child));
      }
    };
    
    // 从根元素开始绘制
    drawElement(rootElement);
  };

  // 绘制密度图例
  const renderLegend = () => {
    const colorRange = densityData?.visualizationData?.colorRange || [];
    
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

  // 可视化模式切换按钮
  const renderViewToggle = () => {
    return (
      <div className="flex space-x-2 my-2">
        <button 
          className={`px-3 py-1 text-sm rounded ${activeView === 'heatmap' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveView('heatmap')}
        >
          热力图
        </button>
        <button 
          className={`px-3 py-1 text-sm rounded ${activeView === 'outline' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveView('outline')}
        >
          元素轮廓
        </button>
        <button 
          className={`px-3 py-1 text-sm rounded ${activeView === 'combined' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveView('combined')}
        >
          组合视图
        </button>
      </div>
    );
  };

  // 综合评分显示
  const renderScoreCard = () => {
    if (!densityData) return null;
    
    const { score, overallDensity } = densityData;
    let scoreColor, scoreLabel;
    
    if (score >= 90) {
      scoreColor = 'text-green-600';
      scoreLabel = '优秀';
    } else if (score >= 75) {
      scoreColor = 'text-blue-600';
      scoreLabel = '良好';
    } else if (score >= 60) {
      scoreColor = 'text-yellow-600';
      scoreLabel = '一般';
    } else {
      scoreColor = 'text-red-600';
      scoreLabel = '需改进';
    }
    
    return (
      <div className="flex items-center justify-between mt-2 mb-4 bg-gray-50 p-3 rounded-md">
        <div>
          <span className="text-sm font-medium">内容密度评分: </span>
          <span className={`text-xl font-bold ${scoreColor}`}>{score.toFixed(1)}</span>
          <span className={`ml-2 text-sm ${scoreColor}`}>({scoreLabel})</span>
        </div>
        <div>
          <span className="text-sm font-medium">平均密度: </span>
          <span className="text-lg font-semibold">{overallDensity.toFixed(1)}%</span>
        </div>
      </div>
    );
  };

  // 绘制计算详情和推荐
  const renderDetails = () => {
    if (!densityData) return null;
    
    return (
      <div className="mt-4">
        <details>
          <summary className="font-medium cursor-pointer">密度分析详情</summary>
          <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm">
            {densityData.details.map((detail, index) => (
              <div key={index} className={`mb-2 ${detail.type === 'warning' ? 'text-orange-600' : 'text-green-600'}`}>
                {detail.message}
              </div>
            ))}
          </div>
        </details>
        
        {densityData.recommendations && densityData.recommendations.length > 0 && (
          <details className="mt-3">
            <summary className="font-medium cursor-pointer">改进建议</summary>
            <div className="mt-2 p-3 bg-gray-50 rounded-md">
              <ul className="space-y-1 text-sm text-gray-700 ml-5 list-disc">
                {densityData.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </details>
        )}
      </div>
    );
  };

  if (!densityData) {
    return <div className="p-4 text-center">暂无密度数据可视化</div>;
  }

  return (
    <div className="mt-4">
      <h4 className="text-lg font-medium mb-2">内容密度分析</h4>
      {renderScoreCard()}
      {renderViewToggle()}
      <div className="border rounded-md overflow-hidden relative">
        <canvas
          ref={canvasRef}
          className="w-full h-auto"
        />
      </div>
      {renderLegend()}
      {renderDetails()}
    </div>
  );
};

export default EnhancedDensityVisualizer;