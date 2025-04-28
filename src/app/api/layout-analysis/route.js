import { NextResponse } from 'next/server';
import { layoutAnalysisAPI } from '../../utils/layoutAnalysisAPI';

/**
 * 布局分析API路由处理器
 * POST /api/layout-analysis
 */
export async function POST(request) {
  try {
    // 解析请求体
    const requestData = await request.json();
    
    if (!requestData || !requestData.actions) {
      return NextResponse.json(
        { success: false, error: '无效的请求格式' },
        { status: 400 }
      );
    }
    
    // 使用布局分析API评估布局
    const result = await layoutAnalysisAPI.evaluateLayout(requestData);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('布局分析API错误:', error);
    
    return NextResponse.json(
      {
        success: false, 
        error: '布局分析失败', 
        message: error.message 
      },
      { status: 500 }
    );
  }
} 