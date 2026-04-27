import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { parseChartTagSpec } from '../../src/app/utils/eightElement/chartSpecParse.js';

test('parseChartTagSpec normalizes groupedBar to grouped_bar', () => {
  const parsed = parseChartTagSpec('groupedBar|簇状柱形图标题');

  assert.equal(parsed.chartType, 'grouped_bar');
  assert.equal(parsed.chartTitle, '簇状柱形图标题');
});

test('chartGenerator contains grouped_bar rendering path and 16:9 canvas', () => {
  const source = readFileSync(
    new URL('../../src/app/utils/eightElement/chartGenerator.js', import.meta.url),
    'utf8'
  );

  assert.match(source, /case 'grouped_bar':/);
  assert.match(source, /return generateGroupedBarChart\(/);
  assert.match(source, /const width = chartType === 'grouped_bar' \? 800 : 600;/);
  assert.match(source, /const height = chartType === 'grouped_bar' \? 450 : 600;/);
});
