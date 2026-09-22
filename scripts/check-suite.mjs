import fs from 'fs';
const cases = JSON.parse(fs.readFileSync('src/app/layout-growth-check/test-cases.json', 'utf8'));
const results = [];
for (let i = 0; i < cases.length; i++) {
  const tc = cases[i];
  try {
    const res = await fetch('http://localhost:3001/api/markdown-grid-growth-check', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ psuip: tc.psuip, n: 8, m: 10, test: false })
    });
    const d = await res.json();
    const pass = !d.error && d.valid === tc.expect.valid && d.columns >= (tc.expect.minColumns ?? 1) && d.rows >= (tc.expect.minRows ?? 1);
    results.push({ i, name: tc.name, card: tc.card, actualValid: d.valid, actualSize: `${d.columns}×${d.rows}`, expect: JSON.stringify(tc.expect), pass, error: d.error || (d.valid !== tc.expect.valid ? `valid期望${tc.expect.valid}实际${d.valid}` : (d.columns < (tc.expect.minColumns??1) || d.rows < (tc.expect.minRows??1)) ? `格子期望${tc.expect.minColumns}×${tc.expect.minRows}实际${d.columns}×${d.rows}` : '') });
  } catch (e) {
    results.push({ i, name: tc.name, card: tc.card, pass: false, error: e.message });
  }
}
for (const r of results) {
  console.log(`${r.pass ? 'PASS' : 'FAIL'} #${r.i + 1} [${r.card}] ${r.name} | 实际 valid=${r.actualValid} ${r.actualSize} | 期望 ${r.expect}${r.error ? ' | ' + r.error : ''}`);
}
console.log('TOTAL:', results.filter(r=>r.pass).length, '/', results.length);
