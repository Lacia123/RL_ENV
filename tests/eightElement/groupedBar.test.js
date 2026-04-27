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
  const groupedBarFunctionSource =
    source.match(/function generateGroupedBarChart[\s\S]*?function generateBarHChart/)?.[0] || '';

  assert.match(source, /case 'grouped_bar':/);
  assert.match(source, /return generateGroupedBarChart\(/);
  assert.match(source, /const wideCanvasChartTypes = new Set\(\['bar', 'grouped_bar', 'area_chart', 'donut_chart'\]\);/);
  assert.match(source, /const width = wideCanvasChartTypes\.has\(chartType\) \? 800 : 600;/);
  assert.match(source, /const height = wideCanvasChartTypes\.has\(chartType\) \? 450 : 600;/);
  assert.equal(groupedBarFunctionSource.includes(".attr('class', 'bar-label')"), false);
});
