import { NextResponse } from 'next/server';
import { growCheckGridLayout } from '@/app/utils/eightElement/gridGrowthCheck';

/**
 * 增长格子数检测接口（按卡片形态自动推导增长趋势）
 *
 * 用途：输入一段 psuip（grid 内内容，不含 grid:item 标签），从卡片的起始格子数
 * （minW×minH，未配置则 1×1）开始逐格增长，检测内容在哪个格子数下布局合法，
 * 返回最终结果。
 * 参考 /api/markdown-layout-check 的渲染与合法性判定（最小尺寸预检 + DOM 内容检测）。
 *
 * 倾向性（tendency）不再由调用方输入，而是与卡片的「整体形态」相关联：
 *   - 上下形态（column，如标题在上/内容在下/按钮贴底）→ [[0,1],[1,0]]（先加行再加列）
 *   - 左右形态（row，如左信息+右头像、左文右图）→ [[1,0],[0,1]]（先加列再加行）
 * 通过 cardGrowthConfig.CARD_GROWTH_TENDENCY_MAP 按顶层卡片名（去掉 card: 前缀）
 * 自动匹配；未配置 / 顶层非卡片回退默认（上下形态）。也可显式传入 tendency 覆盖。
 *
 * 入参（JSON）：
 *   - psuip:    string            PSUIP（八要素 markdown）字符串，必填，
 *                                 grid 内内容，不含 grid / grid:item 标签
 *   - tendency: Array<[number,number]>  增长方向向量列表，可选（默认按卡片形态自动推导）：
 *                                 [1,0] = 列 +1（横向加宽），[0,1] = 行 +1（纵向加高）；
 *                                 列表用尽循环；一侧到上限后该方向视为 0；
 *                                 [0,0] 步跳过（不渲染不检测）
 *   - n:        number            列数上限（横向最多 n 格），默认 8
 *   - m:        number            行数上限（纵向最多 m 格），默认 10
 *   - test:     boolean           是否返回最终渲染截图 URL；⚠️ 仅本地 dev 生效，
 *                                 生产环境强制忽略（线上不产生任何图片）
 *
 * 出参（JSON）：
 *   - success:        boolean  请求是否成功
 *   - valid:          boolean  true=存在合法格子数；false=增长到上限仍不合法
 *   - startColumns:   number   起始列数（顶层卡片 minW，未配置则 1）
 *   - startRows:      number   起始行数（顶层卡片 minH，未配置则 1）
 *   - columns:        number   最终列数（格子数）
 *   - rows:           number   最终行数（格子数）
 *   - n / m:          number   回显入参上限
 *   - tendency:       Array<[number,number]>  实际使用的增长趋势（自动推导或入参回显）
 *   - cardName:       string|null  命中的顶层卡片名（去掉 card: 前缀；未识别为 null）
 *   - tendencySource: 'config' | 'default' | 'input'  趋势来源：
 *                     config = 按卡片形态配置自动推导；default = 未配置回退默认（上下）；
 *                     input = 调用方显式传入
 *   - screenshotUrl:  string   test=true 且本地时返回最终渲染截图 URL
 *   - details:        object   最终尺寸的校验明细（检查项与原因）
 */
export async function POST(request) {
  try {
    const requestData = await request.json();
    const { psuip, tendency, n = 8, m = 10, test = false } = requestData || {};

    // ⚠️ test 只在本地 dev 生效（与 markdown-layout-check 一致）：
    // 生产环境强制忽略，禁止生成截图文件
    const isDev = process.env.NODE_ENV === 'development';
    const effectiveTest = isDev ? test : false;

    // 1. 参数校验：psuip 必填
    if (!psuip || typeof psuip !== 'string' || !psuip.trim()) {
      return NextResponse.json({
        success: false,
        error: 'psuip 参数为必填项（PSUIP markdown 字符串，grid 内内容，不含 grid:item 标签）'
      }, { status: 400 });
    }

    // 2. 参数校验：tendency 可选；传入时必须为合法向量列表
    if (tendency !== undefined && tendency !== null) {
      if (!Array.isArray(tendency) || tendency.length === 0 ||
          !tendency.every(v => Array.isArray(v) && v.length === 2 &&
                                [v[0], v[1]].every(x => Number.isInteger(x) && (x === 0 || x === 1)))) {
        return NextResponse.json({
          success: false,
          error: 'tendency 参数可选；传入时必须为方向向量列表，如 [[1,0],[1,0],[0,1]]（元素为 0/1 的二元数组）'
        }, { status: 400 });
      }
    }

    // 3. 参数校验：n/m 必须为正整数（列/行上限）
    const maxColumns = Number(n);
    const maxRows = Number(m);
    if (!Number.isInteger(maxColumns) || !Number.isInteger(maxRows) || maxColumns <= 0 || maxRows <= 0) {
      return NextResponse.json({
        success: false,
        error: 'n/m 必须为正整数（n = 列数上限，m = 行数上限）'
      }, { status: 400 });
    }

    // 4. 执行增长检测：起始 minW×minH → 按趋势逐格增长 → 返回最终格子数
    //    tendency 缺省时由卡片整体形态自动推导（cardGrowthConfig）
    //    test=true 且本地时对最终尺寸截图到 public（grid-check-*，.gitignore 已忽略）
    const result = await growCheckGridLayout(psuip, {
      tendency,
      maxColumns,
      maxRows,
      takeScreenshot: effectiveTest,
      outputDir: 'public',
      outputPrefix: 'grid-check'
    });

    const screenshotUrl = result.screenshotPath
      ? `/${result.screenshotPath.split('/').pop()}` // public 目录下的文件名即静态 URL
      : null;

    return NextResponse.json({
      success: true,
      valid: result.valid,
      startColumns: result.startColumns,
      startRows: result.startRows,
      columns: result.columns,
      rows: result.rows,
      n: maxColumns,
      m: maxRows,
      tendency: result.tendency,
      cardName: result.cardName,
      tendencySource: result.tendencySource,
      screenshotUrl,
      details: result.details || null
    }, { status: 200 });

  } catch (error) {
    // 错误信息直接通过响应体返回，localhost 调用即可调试，不打日志
    return NextResponse.json({
      success: false,
      error: '增长格子数检测失败',
      message: error.message
    }, { status: 500 });
  }
}
