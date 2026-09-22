import { chromium } from 'playwright-chromium';
import fs from 'fs';
import path from 'path';
import { markdownToEightElement } from '../src/app/utils/eightElement/index.js';
import { renderEightElementToHtml } from '../src/app/utils/eightElement/renderEightElementHtml.js';
import { GRID_CONSTANTS } from '../src/app/utils/eightElement/styles/index.js';
import { wrapGridPsuip } from '../src/app/utils/eightElement/gridValidity.js';

const samples = JSON.parse(fs.readFileSync('./scripts/card-samples.json', 'utf8'));
const OUT = '组件卡片清单/卡片截图';
fs.mkdirSync(OUT, { recursive: true });

// 每张卡的渲染格子数（宽×高）：小卡 2×1，大卡 4×2
const BIG = new Set(['heroCard','featureHeroCard','showcaseCard','contentSummaryCard','layeredActionCard',
  'multiActionCard','confirmableCard','pairedImageTextCard','card:headerCard','card:headerPrecentCard',
  'card:minimalistChartCard','detailListCard','summaryCard','productCard','commentStyleListCard']);
const sizeOf = (tag) => BIG.has(tag) ? { w: 4, h: 2 } : { w: 2, h: 1 };

const VIEWPORT_PADDING = 40;
function viewportSize(w, h) {
  return {
    width: w * GRID_CONSTANTS.CELL_WIDTH + (w - 1) * GRID_CONSTANTS.GAP + VIEWPORT_PADDING,
    height: h * GRID_CONSTANTS.CELL_HEIGHT + (h - 1) * GRID_CONSTANTS.GAP + VIEWPORT_PADDING,
  };
}

const browser = await chromium.launch();
const page = await browser.newPage();
let ok = 0, fail = 0;
for (const [tag, sample] of Object.entries(samples)) {
  const { w, h } = sizeOf(tag);
  const vp = viewportSize(w, h);
  const fileName = tag.replace(':', '-') + '.png';
  try {
    const wrapped = wrapGridPsuip(sample.psuip, { columns: w, rows: h });
    const ee = markdownToEightElement(wrapped);
    const { html } = renderEightElementToHtml(ee, { width: vp.width, height: vp.height, includeInteractive: false });
    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(900); // 等渲染/图片
    await page.screenshot({ path: path.join(OUT, fileName) });
    ok++;
  } catch (e) {
    fail++;
    console.error(`✗ ${tag}: ${e.message.slice(0, 120)}`);
  }
}
await browser.close();
console.log(`完成：成功 ${ok}，失败 ${fail}`);
