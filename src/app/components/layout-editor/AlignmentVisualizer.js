'use client';
import React, { useRef, useEffect } from 'react';

/**
 * 对齐情况可视化组件
 * 展示布局元素的对齐线和对齐关系
 * 
 * @param {Object} props
 * @param {Object} props.alignmentData - 对齐分析数据
 * @param {Object} props.layout - 布局对象
 * @param {Object} props.domMeasurements - DOM测量数据
 */
const AlignmentVisualizer = ({ alignmentData, layout, domMeasurements }) => {
  const canvasRef = useRef(null);
  
  // 常量定义
  const PADDING = 10;
  const LINE_COLORS = {
    horizontal: {
      top: '#4CAF50',     // 绿色
      center: '#2196F3',  // 蓝色
      bottom: '#FF9800'   // 橙色
    },
    vertical: {
      left: '#E91E63',    // 粉色
      center: '#9C27B0',  // 紫色
      right: '#F44336'    // 红色
    }
  };
  
  // 绘制对齐可视化
  useEffect(() => {
    if (!canvasRef.current || !alignmentData || !domMeasurements) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const container = domMeasurements.container || { width: 800, height: 600 };
    
    // 设置画布尺寸，考虑比例缩放以适应预览窗口
    const scale = Math.min(
      (canvas.clientWidth - PADDING * 2) / container.width,
      (canvas.clientHeight - PADDING * 2) / container.height
    );
    
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制背景
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 计算偏移量，使布局居中
    const offsetX = (canvas.width - container.width * scale) / 2;
    const offsetY = (canvas.height - container.height * scale) / 2;
    
    // 绘制容器边框
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    ctx.strokeRect(
      offsetX, offsetY, 
      container.width * scale, container.height * scale
    );
    
    // 绘制所有元素边框
    drawElements(ctx, layout, domMeasurements, scale, offsetX, offsetY);
    
    // 绘制对齐线
    if (alignmentData.alignmentLines) {
      drawAlignmentLines(ctx, alignmentData.alignmentLines, scale, offsetX, offsetY, container);
    }
    
    // 添加图例
    drawLegend(ctx, canvas.width);
    
  }, [alignmentData, layout, domMeasurements]);
  
  /**
   * 绘制布局元素
   */
  const drawElements = (ctx, layout, measurements, scale, offsetX, offsetY) => {
    const drawElement = (element) => {
      if (!element || !element.id) return;
      
      const measurement = measurements[element.id];
      if (measurement) {
        // 绘制元素边框
        ctx.strokeStyle = '#aaa';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(
          offsetX + measurement.x * scale,
          offsetY + measurement.y * scale,
          measurement.width * scale,
          measurement.height * scale
        );
        
        // 递归绘制子元素
        if (element.children) {
          element.children.forEach(child => drawElement(child));
        }
      }
    };
    
    // 从根元素开始递归绘制
    drawElement(layout);
  };
  
  /**
   * 绘制对齐线
   */
  const drawAlignmentLines = (ctx, alignmentLines, scale, offsetX, offsetY, container) => {
    alignmentLines.forEach(line => {
      // 设置线条样式
      ctx.strokeStyle = LINE_COLORS[line.orientation][line.type] || '#999';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 3]);
      
      // 开始绘制路径
      ctx.beginPath();
      
      if (line.orientation === 'horizontal') {
        // 水平对齐线
        const y = offsetY + line.position * scale;
        ctx.moveTo(offsetX, y);
        ctx.lineTo(offsetX + container.width * scale, y);
      } else {
        // 垂直对齐线
        const x = offsetX + line.position * scale;
        ctx.moveTo(x, offsetY);
        ctx.lineTo(x, offsetY + container.height * scale);
      }
      
      ctx.stroke();
      ctx.setLineDash([]);
    });
  };
  
  /**
   * 绘制图例
   */
  const drawLegend = (ctx, canvasWidth) => {
    const legendY = 15;
    const lineLength = 20;
    const spacing = 80;
    
    ctx.font = '10px Arial';
    ctx.textBaseline = 'middle';
    
    // 垂直对齐图例
    let startX = canvasWidth - 300;
    
    Object.entries(LINE_COLORS.vertical).forEach(([type, color], index) => {
      const x = startX + index * spacing;
      
      // 绘制线条
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 3]);
      ctx.beginPath();
      ctx.moveTo(x, legendY - 5);
      ctx.lineTo(x, legendY + lineLength - 5);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // 绘制文本
      ctx.fillStyle = '#333';
      ctx.fillText(`垂直${getTypeText(type)}`, x + 5, legendY + 5);
    });
    
    // 水平对齐图例
    startX = 20;
    const legendY2 = legendY + 30;
    
    Object.entries(LINE_COLORS.horizontal).forEach(([type, color], index) => {
      const x = startX + index * spacing;
      
      // 绘制线条
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 3]);
      ctx.beginPath();
      ctx.moveTo(x, legendY2 - 5);
      ctx.lineTo(x + lineLength, legendY2 - 5);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // 绘制文本
      ctx.fillStyle = '#333';
      ctx.fillText(`水平${getTypeText(type)}`, x + 25, legendY2 - 5);
    });
  };
  
  /**
   * 获取对齐类型的中文描述
   */
  const getTypeText = (type) => {
    switch (type) {
      case 'top': return '顶部对齐';
      case 'bottom': return '底部对齐';
      case 'left': return '左侧对齐';
      case 'right': return '右侧对齐';
      case 'center': return '居中对齐';
      default: return '对齐';
    }
  };
  
  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        <h5 className="font-medium">对齐可视化</h5>
        <span className="text-xs text-gray-500">展示布局中的对齐线</span>
      </div>
      
      <div className="border rounded overflow-hidden bg-white">
        <canvas 
          ref={canvasRef} 
          className="w-full" 
          style={{ height: '280px' }}
        ></canvas>
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        {alignmentData.alignmentLines?.length > 0 
          ? `检测到 ${alignmentData.alignmentLines.length} 条对齐线` 
          : '未检测到明显的对齐线，请检查布局的对齐情况'}
      </div>
    </div>
  );
};

export default AlignmentVisualizer; 