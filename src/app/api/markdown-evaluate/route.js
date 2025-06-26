import { NextResponse } from 'next/server';
import { markdownToEightElement } from '@/app/utils/eightElement/markdownToEightElement';
import { renderAndEvaluateEightElement } from '@/app/utils/eightElement/renderAndEvaluate';
import { calculateTokens } from '@/app/utils/seeds/generateTokenBySeed';
import { setDynamicTokenSystem, clearDynamicTokenSystem } from '@/app/utils/tokens/resolveToken';

export async function POST(request) {
  try {
    console.log('收到Markdown评分请求');
    
    const requestData = await request.json();
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
    
    // 返回评分结果
    return NextResponse.json({
      success: true,
      score: result.score,
      aims: result.aims,
      base64Image: result.base64Image,
      // 确保scoreDetails与result.score.categories保持一致
      // scoreDetails: result.score.categories,
      // 如果使用了自定义设计令牌，返回相关信息
      designTokens: designTokens,
      tokensApplied: !!designTokens
    }, { status: 200 });
  } catch (error) {
    // 确保无论如何都清除动态token系统
    try {
      clearDynamicTokenSystem();
    } catch (clearError) {
      // 忽略清除错误
    }
    
    console.error('Markdown评分失败:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Markdown评分失败', 
      message: error.message 
    }, { status: 500 });
  }
} 