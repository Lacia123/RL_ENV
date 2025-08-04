import { NextResponse } from 'next/server';
import { markdownToEightElement } from '@/app/utils/eightElement/markdownToEightElement';
import { renderEightElementToHtml } from '@/app/utils/eightElement/renderEightElementHtml';
import { calculateTokens } from '@/app/utils/seeds/generateTokenBySeed';
import { setDynamicTokenSystem, clearDynamicTokenSystem } from '@/app/utils/tokens/resolveToken';
import { logElementStyleErrors } from '@/app/utils/logging/elementStyleLogger';

export async function POST(request) {
  try {
    console.log('收到Markdown转八要素请求');
    
    const requestData = await request.json();
    if (!requestData || !requestData.markdown) {
      return NextResponse.json({ 
        success: false, 
        error: 'markdown参数为必填项' 
      }, { status: 400 });
    }
    
    // 提取参数
    const { markdown, width = 1024, height = 768, seed } = requestData;
    
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
    
    try {
      // 转换Markdown为八要素结构
      const eightElement = markdownToEightElement(markdown);
                
      // 预处理八要素结构以应用样式
      const { processedEightElement } = renderEightElementToHtml(eightElement, { width, height });
      
      // 异步记录按钮样式错误，不阻塞接口返回
      setImmediate(async () => {
        try {
          await logElementStyleErrors(markdown, seed, eightElement, { width, height });
        } catch (error) {
          console.warn('异步记录元素样式错误失败:', error);
        }
      });
                
      // 返回八要素结构
      return NextResponse.json({
        success: true,
        eightElement: processedEightElement,
        // originalEightElement: eightElement,
        designTokens: designTokens,
        tokensApplied: !!designTokens
      }, { status: 200 });
    } finally {
      // 确保清除动态token系统
      if (designTokens) {
        try {
          clearDynamicTokenSystem();
          console.log('已清除动态token系统');
        } catch (error) {
          console.warn('清除动态token系统失败:', error);
        }
      }
    }
  } catch (error) {
    console.error('Markdown转八要素失败:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Markdown转八要素失败', 
      message: error.message 
    }, { status: 500 });
  }
} 