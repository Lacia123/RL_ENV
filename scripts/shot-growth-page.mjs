import { chromium } from 'playwright-chromium';

const outDir = '/Users/wuranran/wxj/aigui-enviroment-emulator/组件卡片清单';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto('http://localhost:3001/layout-growth-check', { waitUntil: 'networkidle' });
await page.waitForSelector('textarea', { timeout: 15000 });
await page.waitForTimeout(1000);
await page.screenshot({ path: `${outDir}/测试页面-输入态.png` });

// 点击开始检测
await page.locator('button', { hasText: '开始检测' }).click();
// 等待按钮从「检测中…」恢复为「开始检测」（请求完成）
await page.waitForFunction(() => {
  const btns = [...document.querySelectorAll('button')];
  return btns.some(b => b.textContent.includes('开始检测'));
}, { timeout: 60000 });
await page.waitForTimeout(1500);
// 确认结果区已出现（含「上限 n×m =」）
await page.waitForFunction(() => document.body.innerText.includes('上限 n×m ='), { timeout: 10000 });
await page.screenshot({ path: `${outDir}/测试页面-运行结果.png` });

await browser.close();
console.log('done');
