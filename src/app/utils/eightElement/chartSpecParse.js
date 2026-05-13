/**
 * 解析 [chart:...] 标签中竖线分隔的片段。
 * 兼容旧格式：[chart:type|标题|asc|desc]
 * 新格式从第 3 段起支持 key=value（如蜡烛图 scheme=cn_a、time=日期、rate=16/9）。
 */

function parseChartRate(rateValue) {
  if (rateValue == null) return null;

  const raw = String(rateValue).trim();
  if (!raw) return null;

  let numerator;
  let denominator;

  const ratioMatch = raw.match(/^(\d+(?:\.\d+)?)\s*[/:]\s*(\d+(?:\.\d+)?)$/);
  if (ratioMatch) {
    numerator = Number(ratioMatch[1]);
    denominator = Number(ratioMatch[2]);
  } else {
    numerator = Number(raw);
    denominator = 1;
  }

  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || numerator <= 0 || denominator <= 0) {
    return null;
  }

  const value = numerator / denominator;
  if (!Number.isFinite(value) || value <= 0) {
    return null;
  }

  return {
    value,
    cssValue: ratioMatch ? `${numerator} / ${denominator}` : `${value}`
  };
}

/**
 * @param {string} fullChartSpec - [chart: 与 ] 之间的内容
 * @returns {{ chartType: string|null, chartTitle: string|null, sortOrder: string|null, chartRate: null|{value: number, cssValue: string}, options: Record<string, string> }}
 */
export function parseChartTagSpec(fullChartSpec) {
  const parts = (fullChartSpec || '').split('|').map(s => s.trim());
  let chartType = parts[0] || null;
  if (chartType === 'TreeMind') {
    chartType = 'tree_mind';
  } else if (chartType === 'groupedBar') {
    chartType = 'grouped_bar';
  }

  const options = {};
  let sortOrder = null;
  let chartTitle = null;

  const consumePart = (p) => {
    if (!p) return;
    const lower = p.toLowerCase();
    if (lower === 'asc' || lower === 'desc') {
      sortOrder = lower;
      return;
    }
    const eq = p.indexOf('=');
    if (eq > 0) {
      const key = p.slice(0, eq).trim().toLowerCase();
      const val = p.slice(eq + 1).trim();
      if (key) {
        options[key] = val;
      }
    }
  };

  if (parts.length < 2) {
    return { chartType, chartTitle, sortOrder, chartRate: null, options };
  }

  const second = parts[1];
  if (second.includes('=')) {
    chartTitle = null;
    for (let i = 1; i < parts.length; i++) {
      consumePart(parts[i]);
    }
  } else {
    chartTitle = second || null;
    for (let i = 2; i < parts.length; i++) {
      consumePart(parts[i]);
    }
  }

  if (options.sort) {
    const s = String(options.sort).toLowerCase();
    if (s === 'asc' || s === 'desc') {
      sortOrder = s;
    }
  }

  return { chartType, chartTitle, sortOrder, chartRate: parseChartRate(options.rate), options };
}
