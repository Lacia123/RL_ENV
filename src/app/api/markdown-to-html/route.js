import { NextResponse } from 'next/server';
import { markdownToEightElement } from '@/app/utils/eightElement/markdownToEightElement';
import { renderEightElementToHtml } from '@/app/utils/eightElement/renderEightElementHtml';

export async function POST(request) {
  try {
    console.log('收到Markdown转HTML请求');
    
    const requestData = await request.json();
    if (!requestData || !requestData.markdown) {
      return NextResponse.json({ 
        success: false, 
        error: 'markdown参数为必填项' 
      }, { status: 400 });
    }
    
    // 提取参数
    const { 
      markdown, 
      width = 800, 
      height = 500 
    } = requestData;
    
    console.log('接收的参数:', { 
      markdownLength: markdown.length, 
      width, 
      height 
    });
    
    // 1. 转换Markdown为八要素结构
    const eightElement = markdownToEightElement(markdown);
    console.log('Markdown转八要素结构完成');
    
    // 2. 渲染八要素结构为HTML
    const { html, processedEightElement } = renderEightElementToHtml(eightElement, { 
      width, 
      height 
    });
    console.log('八要素结构渲染为HTML完成');
    
    // 3. 返回HTML结果
    const responseData = {
      success: true,
      html: html,
      width: width,
      height: height,
      processedElementsCount: countElements(processedEightElement)
    };
    
    return NextResponse.json(responseData, { status: 200 });
    
  } catch (error) {
    console.error('Markdown转HTML失败:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Markdown转HTML失败', 
      message: error.message 
    }, { status: 500 });
  }
}

/**
 * 递归计算八要素结构中的元素数量
 * @param {Object} element - 八要素元素
 * @returns {number} - 元素数量
 */
function countElements(element) {
  if (!element) return 0;
  
  let count = 1; // 当前元素
  
  // 递归计算子元素
  if (element.layout && element.layout.children && Array.isArray(element.layout.children)) {
    count += element.layout.children.reduce((sum, child) => sum + countElements(child), 0);
  }
  
  return count;
}
