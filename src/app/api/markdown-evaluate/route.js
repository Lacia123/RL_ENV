import { NextResponse } from 'next/server';
import { markdownToEightElement } from '@/app/utils/eightElement/index';
import { renderAndEvaluateEightElement } from '@/app/utils/eightElement/renderAndEvaluate';
import { calculateTokens } from '@/app/utils/seeds/generateTokenBySeed';
import { setDynamicTokenSystem, clearDynamicTokenSystem } from '@/app/utils/tokens/resolveToken';
import { logAPIRequest } from '@/app/utils/logging/apiLogger';

// 配置请求体大小限制
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
};

export async function POST(request) {
  const startTime = Date.now();
  let requestData = null;
  let responseData = null;
  let statusCode = 200;
  let error = null;
  
  try {
    // 记录请求来源（用于诊断 CSRF 问题）
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    
    console.log('收到评分请求', {
      origin: origin || 'none',
      referer: referer || 'none'
    });
    
    requestData = await request.json();
    if (!requestData || !requestData.markdown) {
      return NextResponse.json({ 
        success: false, 
        error: 'markdown参数为必填项' 
      }, { status: 400 });
    }
    
    // 提取参数
    const { markdown, width = 1024, height = 768, seed, useAims = false, takeScreenshot = false } = requestData;
    
    // 处理seed参数，生成自定义设计令牌
    let designTokens = null;
    if (seed) {
      try {
        // 使用seed参数生成设计令牌
        designTokens = calculateTokens(seed);
        console.log('使用自定义种子生成设计令牌:', seed);
        
        // 使用token解析器的动态token系统
        setDynamicTokenSystem(designTokens);
        console.log('已将设计令牌设置为动态token系统');
      } catch (tokenError) {
        console.warn('生成设计令牌失败，将使用默认令牌:', tokenError);
      }
    }
    
    // 转换Markdown为八要素结构
    const eightElement = markdownToEightElement(markdown);
            
    // 渲染并评分
    const result = await renderAndEvaluateEightElement(eightElement, { width, height, useAims, takeScreenshot });
    
    // 如果设置了动态token系统，需要清除
    if (designTokens) {
      try {
        clearDynamicTokenSystem();
        console.log('已清除动态token系统');
      } catch (error) {
        console.warn('清除动态token系统失败:', error);
      }
    }
    
    // 🆕 检查是否有card测量数据
    const cardMeasurements = result.measurements.cards || [];
    const hasCards = cardMeasurements.length > 0;
    
    // 返回评分结果
    responseData = {
      success: true,
      score: result.score,
      aims: result.aims,
      base64Image: result.base64Image ? '[base64 image data]' : null, // 不记录图片数据
      // 🆕 在非aims评分时返回card的渲染尺寸
      cards: !useAims && hasCards ? {
        count: cardMeasurements.length,
        measurements: cardMeasurements.map(card => ({
          id: card.id,
          variant: card.variant,
          width: Math.round(card.width * 100) / 100,
          height: Math.round(card.height * 100) / 100,
          x: Math.round(card.x * 100) / 100,
          y: Math.round(card.y * 100) / 100,
          style: {
            backgroundColor: card.style.backgroundColor,
            borderRadius: card.style.borderRadius,
            padding: card.style.padding,
            margin: card.style.margin
          },
          content: card.content
        }))
      } : undefined,
      designTokens: designTokens,
      tokensApplied: !!designTokens
    };
    
    // 实际返回时包含完整的 base64Image
    const fullResponse = { ...responseData, base64Image: result.base64Image };
    return NextResponse.json(fullResponse, { status: 200 });
    
  } catch (err) {
    error = err;
    statusCode = 500;
    
    // 确保无论如何都清除动态token系统
    try {
      clearDynamicTokenSystem();
    } catch (clearError) {
      // 忽略清除错误
    }
    
    console.error('Markdown评分失败:', err);
    
    responseData = { 
      success: false, 
      error: 'Markdown评分失败', 
      message: err.message 
    };
    
    return NextResponse.json(responseData, { status: 500 });
  } finally {
    // 记录请求日志到文件
    const duration = Date.now() - startTime;
    logAPIRequest({
      method: 'POST',
      path: '/api/markdown-evaluate',
      origin: request.headers.get('origin'),
      referer: request.headers.get('referer'),
      userAgent: request.headers.get('user-agent'),
      body: requestData,
      status: statusCode,
      duration,
      response: responseData, // 不包含 base64Image
      error: error ? { message: error.message, stack: error.stack } : null
    });
  }
} 