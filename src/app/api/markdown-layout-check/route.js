import { NextResponse } from 'next/server';
import { markdownToEightElement } from '@/app/utils/eightElement/index';
import { renderEightElementToHtml } from '@/app/utils/eightElement/renderEightElementHtml';
import { GRID_CONSTANTS } from '@/app/utils/eightElement/styles';
import { checkGridLayoutValidity, wrapGridPsuip } from '@/app/utils/eightElement/gridValidity';

/**
 * 布局合理性校验接口（动作空间）
 *
 * 用途：给强化模型训练用——模型产出一段 PSUIP 字符串后，调用本接口判断
 * 该布局在指定的网格（m×n 格数）下是否"合理"（作为训练中的约束/奖励信号）。
 *
 * 语义说明：
 *   - 入参 psuip 为「裸内容」：不包含 <layout:grid> 与 <grid:item> 标签
 *   - type=grid 时，接口先把它包裹成完整可渲染的 PSUIP（wrapGridPsuip）：
 *     <layout:grid width="m" gap="16" height="n"> + 单个占满全网格的 grid:item
 *   - width/height 是「格子数」而不是像素——模型不能看图，不关心具体像素，
 *     只关心"几行几列"级别的布局合理性，降低心智负担。像素换算由程序内部完成。
 *   - 包裹后实际渲染为 HTML（渲染视口 = 格子数换算的像素尺寸），
 *     渲染产物供后续合理性校验（溢出检测等）使用。
 *
 * 入参（JSON）：
 *   - psuip:   string   PSUIP（八要素 markdown）字符串，必填，不含 grid / grid:item 标签
 *   - type:    string   布局类型，当前仅支持 "grid"（默认 "grid"）
 *   - width:   number   网格列数 m（格子数），默认 4
 *   - height:  number   网格行数 n（格子数），默认 3
 *   - test:    boolean  是否返回渲染截图 URL（供人工核对判定结果），默认 false；
 *                       ⚠️ 仅在 dev 环境（运行时 NODE_ENV === 'development'）生效，
 *                       生产环境强制忽略（避免在服务器上不断生成图片文件）
 *
 * 出参（JSON）：
 *   - success:      boolean  请求是否成功
 *   - valid:        boolean  true=该布局在给定 m×n 网格下合理；false=不合理
 *   - wrappedPsuip: string   包裹后的完整可渲染 PSUIP
 *   - screenshotUrl:string   test=true 时的截图 URL（指向 localhost 的静态图片）
 *   - details:      object   校验明细（检查项与原因）
 *   注：渲染 HTML 仅内部使用（供检测），不随响应返回，避免响应过大。
 */
export async function POST(request) {
  try {
    const requestData = await request.json();
    const { psuip, type = 'grid', width = 4, height = 3, test = false } = requestData || {};

    // ⚠️ test 参数只在 dev 环境生效，生产环境强制忽略 test，禁止生成截图——
    // 避免用户在服务器上不断产生图片文件。
    // dev 判断：Next.js 进入 dev 模式（server.js 以 NODE_ENV 为空启动 next({dev:true})）
    // 后会把 NODE_ENV 设为 'development'，因此不能沿用启动时的 !NODE_ENV 判断，
    // 而应判断运行时 NODE_ENV === 'development'（npm run dev 生效；npm run start 为
    // 'production' 不生效）
    const isDev = process.env.NODE_ENV === 'development';
    const effectiveTest = isDev ? test : false;

    // 1. 参数校验：psuip 必填
    if (!psuip || typeof psuip !== 'string' || !psuip.trim()) {
      return NextResponse.json({
        success: false,
        error: 'psuip 参数为必填项（PSUIP markdown 字符串）'
      }, { status: 400 });
    }

    // 2. 参数校验：type 暂只支持 grid
    if (type !== 'grid') {
      return NextResponse.json({
        success: false,
        error: `暂不支持类型 "${type}"，当前仅支持 "grid"`,
        supportedTypes: ['grid']
      }, { status: 400 });
    }

    // 3. 参数校验：width/height 必须为正整数（格子数 m/n）
    const columnCount = Number(width);
    const rowCount = Number(height);
    if (!Number.isInteger(columnCount) || !Number.isInteger(rowCount) || columnCount <= 0 || rowCount <= 0) {
      return NextResponse.json({
        success: false,
        error: 'width/height 必须为正整数（格子数，即网格的列数 m 与行数 n）'
      }, { status: 400 });
    }

    // 4. 包裹为完整可渲染的 PSUIP（裸 psuip → grid 外层 + 占满全网格的 grid:item）
    const wrappedPsuip = wrapGridPsuip(psuip, { columns: columnCount, rows: rowCount });

    // 5. 实际渲染：八要素转换 + HTML 渲染
    //    视口 = 格子数换算的像素 + 环境余量 40px（layout:root padding 12×2 + 安全值），
    //    与校验侧保持一致，避免 grid 被 root padding 挤出视口导致文档滚动误报
    let html = null;
    try {
      const eightElement = markdownToEightElement(wrappedPsuip);
      const VIEWPORT_PADDING = 40;
      const viewportWidth = columnCount * GRID_CONSTANTS.CELL_WIDTH + (columnCount - 1) * GRID_CONSTANTS.GAP + VIEWPORT_PADDING;
      const viewportHeight = rowCount * GRID_CONSTANTS.CELL_HEIGHT + (rowCount - 1) * GRID_CONSTANTS.GAP + VIEWPORT_PADDING;
      const renderResult = renderEightElementToHtml(eightElement, {
        width: viewportWidth,
        height: viewportHeight,
        includeInteractive: false
      });
      html = renderResult.html;
    } catch (renderError) {
      console.error('包裹后的 PSUIP 渲染失败:', renderError);
      // 渲染失败不影响接口返回（valid 仍由校验逻辑决定），html 置 null
    }

    // 6. 执行 grid 布局合理性校验（内容缺失检测：真实渲染后检测缺失/裁切/滚动）
    //    test=true 且为 dev 环境时截图保存到 public 目录，返回可访问的 URL 供人工核对
    const screenshotOptions = effectiveTest
      ? { takeScreenshot: true, outputDir: 'public', outputPrefix: 'grid-check' }
      : { takeScreenshot: false };

    const result = await checkGridLayoutValidity(psuip, {
      columns: columnCount,
      rows: rowCount,
      html, // 复用上面已渲染的 HTML，避免重复渲染
      ...screenshotOptions
    });

    // 7. 返回结果
    const screenshotUrl = result.screenshotPath
      ? `/${result.screenshotPath.split('/').pop()}` // public 目录下的文件名即静态 URL
      : null;

    return NextResponse.json({
      success: true,
      valid: result.valid,
      type: 'grid',
      width: columnCount,
      height: rowCount,
      wrappedPsuip,
      screenshotUrl,
      details: result.details || null
    }, { status: 200 });

  } catch (error) {
    console.error('布局合理性校验失败:', error);
    return NextResponse.json({
      success: false,
      error: '布局合理性校验失败',
      message: error.message
    }, { status: 500 });
  }
}
