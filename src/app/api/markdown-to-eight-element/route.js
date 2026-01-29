import { NextResponse } from 'next/server';
import { markdownToEightElement } from '@/app/utils/eightElement/index';
import { renderEightElementToHtml } from '@/app/utils/eightElement/renderEightElementHtml';
import { calculateTokens } from '@/app/utils/seeds/generateTokenBySeed';
import { setDynamicTokenSystem, clearDynamicTokenSystem } from '@/app/utils/tokens/resolveToken';
import { logAPIRequest } from '@/app/utils/logging/apiLogger';
// import { logElementStyleErrors } from '@/app/utils/logging/elementStyleLogger';

// ✅ Next.js 16: bodyParser 配置已移至 next.config.js 的 serverActions.bodySizeLimit

export async function POST(request) {
  const startTime = Date.now();
  let requestData = null;
  let responseData = null;
  let statusCode = 200;
  let error = null;
  
  try {
    requestData = await request.json();
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
        
        // 使用token解析器的动态token系统
        setDynamicTokenSystem(designTokens);
      } catch (tokenError) {
        console.warn('生成设计令牌失败，将使用默认令牌:', tokenError);
      }
    }
    
    try {
      // 转换Markdown为八要素结构
      const eightElement = markdownToEightElement(markdown);
                
      // 预处理八要素结构以应用样式
      // 🆕 不需要交互式功能，只需要预处理后的八要素结构
      const { processedEightElement } = renderEightElementToHtml(eightElement, { 
        width, 
        height,
        includeInteractive: false 
      });
      
      // 异步记录按钮样式错误，不阻塞接口返回
      // setImmediate(async () => {
      //   try {
      //     await logElementStyleErrors(markdown, seed, eightElement, { width, height });
      //   } catch (error) {
      //     console.warn('异步记录元素样式错误失败:', error);
      //   }
      // });
                
      // 返回八要素结构
      responseData = {
        success: true,
        eightElement: processedEightElement,
        // originalEightElement: eightElement,
        designTokens: designTokens,
        tokensApplied: !!designTokens
      };
      
      return NextResponse.json(responseData, { status: 200 });
    } finally {
      // 确保清除动态token系统
      if (designTokens) {
        try {
          clearDynamicTokenSystem();
        } catch (error) {
          console.warn('清除动态token系统失败:', error);
        }
      }
    }
  } catch (err) {
    error = err;
    statusCode = 500;
    console.error('Markdown转八要素失败:', err);
    
    responseData = { 
      success: false, 
      error: 'Markdown转八要素失败', 
      message: err.message 
    };
    
    return NextResponse.json(responseData, { status: 500 });
  } finally {
    // 记录请求日志到文件
    const duration = Date.now() - startTime;
    logAPIRequest({
      method: 'POST',
      path: '/api/markdown-to-eight-element',
      origin: request.headers.get('origin'),
      referer: request.headers.get('referer'),
      userAgent: request.headers.get('user-agent'),
      body: requestData,
      status: statusCode,
      duration,
      response: responseData,
      error: error ? { message: error.message, stack: error.stack } : null
    });
  }
} 