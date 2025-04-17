import { NextResponse } from 'next/server';
import { evaluateLayoutOnServer } from '../../layout-analysis/server-utils.js';
import crypto from 'crypto';

// 内存存储，在生产环境中应该使用数据库
const resultsCache = new Map();

/**
 * 处理布局分析提交请求
 * POST /api/layout-analyzer/submit
 */
export async function POST(request) {
  try {
    // 解析请求体
    const layoutData = await request.json();
    
    // 验证请求数据
    if (!layoutData || !layoutData.actions) {
      return NextResponse.json(
        { success: false, message: '无效的布局数据' },
        { status: 400 }
      );
    }
    
    // 调用布局分析
    const result = await evaluateLayoutOnServer(layoutData);
    
    // 使用唯一标识符作为缓存键
    const id = generateResultId();
    
    // 将布局数据和分析结果存储在缓存中
    resultsCache.set(id, {
      layoutData,
      result,
      timestamp: Date.now()
    });
    
    // 设置24小时后过期
    setTimeout(() => {
      resultsCache.delete(id);
    }, 24 * 60 * 60 * 1000);
    
    // 返回成功响应和结果标识符
    return NextResponse.json({
      success: true,
      id
    });
  } catch (error) {
    console.error('布局分析提交处理错误:', error);
    
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

/**
 * 根据结果ID获取分析结果
 * GET /api/layout-analyzer/submit?id={resultId}
 */
export async function GET(request) {
  // 从URL获取结果ID
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json(
      { success: false, message: '缺少结果ID' },
      { status: 400 }
    );
  }
  
  // 从缓存中检索结果
  const cachedResult = resultsCache.get(id);
  
  if (!cachedResult) {
    return NextResponse.json(
      { success: false, message: '找不到指定的分析结果或已过期' },
      { status: 404 }
    );
  }
  
  return NextResponse.json({
    success: true,
    data: {
      ...cachedResult,
      // 不返回原始布局数据，以减少响应大小
      layoutData: undefined
    }
  });
}

/**
 * 生成唯一的结果标识符
 */
function generateResultId() {
  return crypto.randomBytes(8).toString('hex');
} 