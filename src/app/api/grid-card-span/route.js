import { NextResponse } from 'next/server';
import { estimateGridCardSpan } from '@/app/utils/eightElement/gridCardSpan';
import { logAPIRequest } from '@/app/utils/logging/apiLogger';

/**
 * POST /api/grid-card-span
 *
 * 输入画布行列、尺寸与单卡 PSUIP，返回该卡在当前网格上的最佳跨格 w、h（单位：格）
 *
 * body:
 * {
 *   columns: number,   // 列数
 *   rows: number,      // 行数
 *   width: number,     // 画布宽 px
 *   height: number,    // 画布高 px
 *   gap?: number,      // 默认 16
 *   markdown: string,  // 单卡 PSUIP
 *   measure?: boolean, // 默认 true，Playwright 实测高度纠偏
 *   objective?: 'min-sum' | 'min-area' | 'min-max-side' | 'min-square', // 默认 min-sum（最小化 w+h）
 *   allowCompress?: boolean, // 默认 false；true 时才允许 minScale 压缩高度
 *   minScale?: number  // 仅 allowCompress=true 时生效
 * }
 */
export async function POST(request) {
  const startTime = Date.now();
  let requestData = null;
  let responseData = null;
  let statusCode = 200;
  let error = null;

  try {
    requestData = await request.json();

    const result = await estimateGridCardSpan({
      columns: requestData?.columns ?? requestData?.cols,
      rows: requestData?.rows,
      width: requestData?.width,
      height: requestData?.height,
      gap: requestData?.gap,
      markdown: requestData?.markdown ?? requestData?.psuip,
      measure: requestData?.measure,
      objective: requestData?.objective,
      allowCompress: requestData?.allowCompress,
      minScale: requestData?.minScale,
    });

    responseData = {
      success: true,
      w: result.w,
      h: result.h,
      cardType: result.cardType,
      method: result.method,
      cell: result.cell,
      spanPx: result.spanPx,
      estimatedMinPx: result.estimatedMinPx,
      measured: result.measured,
      search: result.search,
      analysis: result.analysis,
      canvas: result.canvas,
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (err) {
    error = err;
    statusCode = err?.status || 500;
    console.error('grid-card-span 失败:', err);

    responseData = {
      success: false,
      error: statusCode === 400 ? err.message : '计算网格跨格失败',
      message: err.message,
    };

    return NextResponse.json(responseData, { status: statusCode });
  } finally {
    const duration = Date.now() - startTime;
    logAPIRequest({
      method: 'POST',
      path: '/api/grid-card-span',
      origin: request.headers.get('origin'),
      referer: request.headers.get('referer'),
      userAgent: request.headers.get('user-agent'),
      body: requestData
        ? {
            ...requestData,
            markdown: requestData.markdown
              ? `[markdown ${String(requestData.markdown).length} chars]`
              : requestData.psuip
                ? `[psuip ${String(requestData.psuip).length} chars]`
                : undefined,
          }
        : null,
      status: statusCode,
      duration,
      response: responseData,
      error: error ? { message: error.message, stack: error.stack } : null,
    });
  }
}
