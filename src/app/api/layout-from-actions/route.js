import { NextResponse } from 'next/server';
import { layoutAnalysisAPI } from '../../utils/layoutAnalysisAPI.js';

/**
 * 接收actions序列并返回生成的layout对象
 * POST /api/layout-from-actions
 */
export async function POST(request) {
  try {
    // 解析请求体
    const requestData = await request.json();
    
    // 验证请求数据
    if (!requestData || !requestData.actions || !Array.isArray(requestData.actions)) {
      return NextResponse.json(
        { success: false, message: '无效的请求数据，actions必须是数组' },
        { status: 400 }
      );
    }
    
    // 构建布局分析API请求
    const apiRequest = {
      metadata: {
        canvasWidth: requestData.canvasWidth || 1024,
        canvasHeight: requestData.canvasHeight || 768,
        measurementMode: 'virtual' // 使用虚拟DOM测量，更轻量
      },
      actions: requestData.actions
    };
    
    // 调用布局分析API生成布局
    const result = await layoutAnalysisAPI.evaluateLayout(apiRequest);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error || '布局生成失败' },
        { status: 500 }
      );
    }
    
    // 只返回layout部分，不返回分析结果
    return NextResponse.json({
      success: true,
      layout: result.result.layout
    });
  } catch (error) {
    console.error('布局生成错误:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: '处理布局数据时出错', 
        error: error.message 
      },
      { status: 500 }
    );
  }
} 