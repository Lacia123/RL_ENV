import { NextResponse } from 'next/server';
import { markdownToEightElement } from '../../utils/eightElement/markdownToEightElement.js';
import renderAndEvaluateEightElement from '../../utils/eightElement/renderAndEvaluate.js';

/**
 * 处理Markdown评分请求
 * POST /api/markdown-evaluate
 * 
 * 请求体格式：
 * {
 *   markdown: "# 标题\n这是内容",
 *   width: 1024,  // 可选，默认1024
 *   height: 768   // 可选，默认768
 * }
 * 
 * 响应格式：
 * {
 *   success: true,
 *   score: {
 *     overall: 85.5,
 *     layout: {...},
 *     typography: {...},
 *     color: {...},
 *     spacing: {...}
 *   }
 * }
 */
export async function POST(request) {
  try {
    // 解析请求体
    const requestData = await request.json();
    
    // 验证请求数据
    if (!requestData || !requestData.markdown) {
      return NextResponse.json(
        { success: false, error: 'markdown参数为必填项' },
        { status: 400 }
      );
    }
    
    // 提取参数
    const { markdown, width = 1024, height = 768 } = requestData;
    
    // 转换Markdown为八要素结构
    const eightElement = markdownToEightElement(markdown);
    
    // 使用Playwright渲染并评分
    const result = await renderAndEvaluateEightElement(eightElement, { width, height });
    
    // 返回评分结果
    return NextResponse.json({
      success: true,
      score: result.score,
      // 可选：返回更详细的测量数据和HTML
      // measurements: result.measurements,
      // html: result.html
    });
  } catch (error) {
    console.error('Markdown评分失败:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Markdown评分失败',
      message: error.message
    }, { status: 500 });
  }
} 