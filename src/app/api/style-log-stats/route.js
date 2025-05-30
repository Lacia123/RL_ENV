import { NextResponse } from 'next/server';
import { getLogStatistics } from '@/app/utils/logging/elementStyleLogger';

export async function POST(request) {
  try {
    console.log('获取元素样式错误统计');

    const requestData = await request.json();

    const { days = 7 } = requestData;
    
    const stats = getLogStatistics(days);
    
    return NextResponse.json({
      success: true,
      stats: {
        totalErrors: stats.totalErrors,
        // buttonErrors: stats.buttonErrors,
        // textWrapErrors: stats.textWrapErrors,
        buttonBorderErrors: stats.buttonBorderErrors,
        wcagErrors: stats.wcagErrors,
        dailyStats: stats.dailyStats
      }
    }, { status: 200 });
  } catch (error) {
    console.error('获取元素样式错误统计失败:', error);
    return NextResponse.json({ 
      success: false, 
      error: '获取元素样式错误统计失败', 
      message: error.message 
    }, { status: 500 });
  }
} 