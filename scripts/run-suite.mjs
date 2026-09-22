import { chromium } from 'playwright-chromium';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });
const errors = [];
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
await page.goto('http://localhost:3001/layout-growth-check', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await page.getByRole('button', { name: /运行全部/ }).click();
await page.waitForFunction(() => {
  const btns = Array.from(document.querySelectorAll('button'));
  return btns.some(b => b.textContent.includes('运行全部') && !b.textContent.includes('运行中'));
}, null, { timeout: 900000 });
await page.waitForTimeout(3000);
const fails = await page.evaluate(() => {
  // 找所有用例块：编号开头，取"实际："行
  const txt = document.body.innerText.split('\n');
  const out = [];
  for (let i = 0; i < txt.length; i++) {
    if (/^#\d+$/.test(txt[i].trim()) && txt[i+1] && /上下|左右|默认/.test(txt[i+1])) {
      const block = txt.slice(i, i + 12).join(' | ');
      if (block.includes('✗ 失败')) out.push(block.slice(0, 260));
    }
  }
  return out;
});
await page.screenshot({ path: '/tmp/suite-shot-top.png', fullPage: false });
await browser.close();
console.log('FAILS:', JSON.stringify(fails, null, 1));
console.log('PAGEERRORS:', JSON.stringify(errors));
