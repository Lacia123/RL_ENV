import { chromium } from 'playwright-chromium';
import fs from 'fs';
import path from 'path';
import { markdownToEightElement } from '../src/app/utils/eightElement/index.js';
import { renderEightElementToHtml } from '../src/app/utils/eightElement/renderEightElementHtml.js';
import { GRID_CONSTANTS } from '../src/app/utils/eightElement/styles/index.js';
import { wrapGridPsuip } from '../src/app/utils/eightElement/gridValidity.js';

const samples = JSON.parse(fs.readFileSync('./scripts/card-samples.json', 'utf8'));
const OUT = '组件卡片清单/卡片截图';
const ONLY = new Set(['commentListCard','productCard','card:headerCard','hiringDarkNewAvatarCard','commentStyleListCard','showcaseCard']);

const BIG = new Set(['commentListCard','commentStyleListCard','productCard','card:headerCard','card:headerPrecentCard']);
const sizeOf = (tag) => BIG.has(tag) ? { w: 4, h: 2 } : { w: 2, h: 1 };
const VIEWPORT_PADDING = 40;
function viewportSize(w, h) {
  return { width: w * GRID_CONSTANTS.CELL_WIDTH + (w-1) * GRID_CONSTANTS.GAP + VIEWPORT_PADDING,
           height: h * GRID_CONSTANTS.CELL_HEIGHT + (h-1) * GRID_CONSTANTS.GAP + VIEWPORT_PADDING };
}
// commentListCard 用用户评论数据覆盖 loopData
const extraData = {
  commentListCard: { loopData: [
    { title: '用户评论1', desc: '这是一条用户评论，展示了用户对产品的评价和反馈。' },
    { title: '用户评论2', desc: '这是另一条用户评论，界面交互流畅，体验不错。' },
    { title: '用户评论3', desc: '功能很实用，希望后续增加更多自定义选项。' },
  ]}
};

const browser = await chromium.launch();
const page = await browser.newPage();
let ok = 0;
for (const [tag, sample] of Object.entries(samples)) {
  if (!ONLY.has(tag)) continue;
  const { w, h } = sizeOf(tag);
  const vp = viewportSize(w, h);
  const fileName = tag.replace(':', '-') + '.png';
  const wrapped = wrapGridPsuip(sample.psuip, { columns: w, rows: h });
  const ee = markdownToEightElement(wrapped);
  const { html } = renderEightElementToHtml(ee, { width: vp.width, height: vp.height, includeInteractive: false, data: extraData[tag] || null });
  await page.setContent(html, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  try {
    await page.waitForFunction(() => Array.from(document.querySelectorAll('img')).every(im => im.complete), { timeout: 6000 });
  } catch {}
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT, fileName) });
  ok++;
}
await browser.close();
console.log('重截完成:', ok);
