'use client';

import React, { useState } from 'react';
import testCases from './test-cases.json';

/**
 * /layout-growth-check —— 增长格子数检测（按卡片形态自动推导增长趋势）调试模块 + 测试集
 *
 * 上半部分：单条调试（裸 psuip + n/m + test 截图）
 * 下半部分：测试集（test-cases.json，41 个用例覆盖全部卡片 + 增长/边界场景），
 *           一键串行运行，逐条断言：expect.valid 匹配 + 最终格子数 ≥ expect.minColumns×minRows
 */
export default function LayoutGrowthCheckPage() {
  const [psuip, setPsuip] = useState(`<metricCard>
  <metric_label>调试卡片</metric_label>
  <metric_value>68%</metric_value>
  <trend_value>+12%</trend_value>
</metricCard>`);
  const [n, setN] = useState(8);
  const [m, setM] = useState(10);
  const [test, setTest] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // ── 测试集状态 ──
  const [suiteRunning, setSuiteRunning] = useState(false);
  const [suiteResults, setSuiteResults] = useState(null); // { index: {ok, valid, columns, rows, tendency, tendencySource, cardName, expect, error} }
  const [suiteN, setSuiteN] = useState(8);
  const [suiteM, setSuiteM] = useState(10);
  const [expanded, setExpanded] = useState({}); // 用例 psuip 展开

  /** 按趋势静态推算尺寸路径（与后端增长逻辑一致，仅用于预览；从接口返回的起始尺寸起算） */
  const calcPath = (tendency, maxC, maxR, startC = 1, startR = 1) => {
    const len = tendency.length;
    let c = startC, r = startR, k = 0;
    const path = [{ c, r }];
    while (c < maxC || r < maxR) {
      let dc = 0, dr = 0, steps = 0;
      while (steps < len) {
        const v = tendency[k % len];
        k++;
        steps++;
        dc = c >= maxC ? 0 : (Number(v?.[0]) || 0);
        dr = r >= maxR ? 0 : (Number(v?.[1]) || 0);
        if (dc === 0 && dr === 0) continue;
        break;
      }
      if (dc === 0 && dr === 0) break;
      c += dc;
      r += dr;
      path.push({ c, r });
    }
    return path;
  };

  /** 趋势来源文案 */
  const sourceLabel = (source, cardName) => {
    switch (source) {
      case 'config': return `按卡片形态配置推导（${cardName || '未知卡片'}）`;
      case 'default': return '未配置形态，回退默认（上下）';
      case 'input': return '调用方显式传入';
      default: return source;
    }
  };

  const handleCheck = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/markdown-grid-growth-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ psuip, columns: Number(n), rows: Number(m), test })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || `请求失败（${res.status}）`);
      } else {
        setResult({
          ...data,
          path: calcPath(data.tendency || [], Number(n), Number(m), data.startColumns, data.startRows)
        });
      }
    } catch (e) {
      setError(`请求异常: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  /** 运行单个测试用例（返回结果对象；test=true 本地生成最终渲染截图） */
  const runCase = async (tc, maxC, maxR) => {
    try {
      const res = await fetch('/api/markdown-grid-growth-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ psuip: tc.psuip, columns: Number(maxC), rows: Number(maxR), test: true })
      });
      const data = await res.json();
      if (!res.ok) return { error: data.error || `请求失败（${res.status}）` };
      return {
        valid: data.valid,
        columns: data.columns,
        rows: data.rows,
        tendency: data.tendency,
        tendencySource: data.tendencySource,
        cardName: data.cardName,
        startColumns: data.startColumns,
        startRows: data.startRows,
        screenshotUrl: data.screenshotUrl
      };
    } catch (e) {
      return { error: `请求异常: ${e.message}` };
    }
  };

  /** 断言：expect.valid 匹配 + 最终格子 ≥ min */
  const assertCase = (tc, r) => {
    if (r.error) return { pass: false, reason: r.error };
    const expect = tc.expect || {};
    if (expect.valid !== undefined && r.valid !== expect.valid) {
      return { pass: false, reason: `期望 valid=${expect.valid}，实际 ${r.valid}` };
    }
    if (expect.minColumns !== undefined && r.columns < expect.minColumns) {
      return { pass: false, reason: `期望格子 ≥ ${expect.minColumns}×${expect.minRows}，实际 ${r.columns}×${r.rows}` };
    }
    if (expect.minRows !== undefined && r.rows < expect.minRows) {
      return { pass: false, reason: `期望格子 ≥ ${expect.minColumns}×${expect.minRows}，实际 ${r.columns}×${r.rows}` };
    }
    return { pass: true };
  };

  /** 运行全部测试用例（串行，避免并发打爆 dev server） */
  const runAll = async () => {
    setSuiteRunning(true);
    const results = {};
    const maxC = Number(suiteN);
    const maxR = Number(suiteM);
    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      const r = await runCase(tc, maxC, maxR);
      const assertion = assertCase(tc, r);
      results[i] = { ...r, ...assertion, name: tc.name, card: tc.card, expect: tc.expect };
      setSuiteResults({ ...results }); // 增量更新，实时显示进度
    }
    setSuiteRunning(false);
  };

  const runOne = async (i) => {
    const tc = testCases[i];
    const r = await runCase(tc, suiteN, suiteM);
    const assertion = assertCase(tc, r);
    setSuiteResults((prev) => ({ ...(prev || {}), [i]: { ...r, ...assertion, name: tc.name, card: tc.card, expect: tc.expect } }));
  };

  const violationColor = (type) => {
    switch (type) {
      case 'missing': return { color: '#d4380d', background: '#fff2e8' };
      case 'clipped': return { color: '#d46b08', background: '#fff7e6' };
      case 'scroll': return { color: '#ad4e00', background: '#fff7e6' };
      default: return { color: '#595959', background: '#fafafa' };
    }
  };

  // 形态徽章
  const morphBadge = (morph) => {
    const cfg = {
      vertical: { text: '上下', bg: '#f0f5ff', color: '#2f54eb' },
      horizontal: { text: '左右', bg: '#fff7e6', color: '#d46b08' },
      default: { text: '默认', bg: '#f9f9f9', color: '#595959' }
    }[morph] || { text: morph, bg: '#f9f9f9', color: '#595959' };
    return <span style={{ fontSize: 11, padding: '1px 8px', borderRadius: 10, background: cfg.bg, color: cfg.color, marginRight: 6 }}>{cfg.text}</span>;
  };

  const suiteCount = suiteResults ? Object.keys(suiteResults).length : 0;
  const suitePass = suiteResults ? Object.values(suiteResults).filter(r => r.pass).length : 0;

  return (
    <div style={{ maxWidth: 1100, margin: '24px auto', padding: '0 24px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <h1 style={{ fontSize: 22, marginBottom: 8 }}>增长格子数检测调试模块</h1>
      <p style={{ color: '#888', fontSize: 13, marginTop: 0 }}>
        POST /api/markdown-grid-growth-check · 从卡片起始格子数（minW×minH，未配置则 1×1）起步，
        按卡片整体形态自动推导增长趋势（上下 [[0,1],[1,0]] / 左右 [[1,0],[0,1]]）逐格增长，
        每步做卡片最小尺寸预检（严格）+ DOM 内容检测，返回第一个合法格子数 ·
        截图仅本地 dev 生效，线上不产生图片
      </p>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        {/* 左侧：输入区 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <label style={{ fontSize: 13, fontWeight: 600 }}>裸 psuip（grid 内内容，不含 grid:item 标签）</label>
          <textarea
            value={psuip}
            onChange={(e) => setPsuip(e.target.value)}
            rows={8}
            style={{ width: '100%', boxSizing: 'border-box', fontFamily: 'monospace', fontSize: 13, padding: 8, marginTop: 4 }}
          />

          <div style={{ marginTop: 8, padding: '8px 12px', background: '#f0f5ff', color: '#2f54eb', borderRadius: 6, fontSize: 12, lineHeight: 1.6 }}>
            倾向性不需要输入：接口根据卡片的整体形态自动推导 ——
            上下形态（标题在上 / 内容在下 / 按钮贴底）→ <span style={{ fontFamily: 'monospace' }}>[[0,1],[1,0]]</span>（先加行再加列）；
            左右形态（左信息+右头像 / 左文右图）→ <span style={{ fontFamily: 'monospace' }}>[[1,0],[0,1]]</span>（先加列再加行）
          </div>

          <div style={{ display: 'flex', gap: 16, marginTop: 12, alignItems: 'center' }}>
            <label style={{ fontSize: 13 }}>
              列上限：
              <input type="number" min="1" value={n} onChange={(e) => setN(e.target.value)}
                style={{ width: 70, marginLeft: 6, padding: '4px 6px' }} />
            </label>
            <label style={{ fontSize: 13 }}>
              行上限：
              <input type="number" min="1" value={m} onChange={(e) => setM(e.target.value)}
                style={{ width: 70, marginLeft: 6, padding: '4px 6px' }} />
            </label>
            <label style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
              <input type="checkbox" checked={test} onChange={(e) => setTest(e.target.checked)} />
              返回最终渲染截图（test，仅本地）
            </label>
          </div>

          <button
            onClick={handleCheck}
            disabled={loading}
            style={{ marginTop: 12, padding: '8px 24px', background: '#1677ff', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14 }}
          >
            {loading ? '检测中…（无头浏览器渲染，稍候）' : '开始检测'}
          </button>

          {error && (
            <div style={{ marginTop: 12, padding: 12, background: '#fff2f0', color: '#cf1322', borderRadius: 6, fontSize: 13 }}>
              {error}
            </div>
          )}
        </div>

        {/* 右侧：结果区 */}
        {result && (
          <div style={{ flex: 1.2, minWidth: 0 }}>
            <div style={{
              fontSize: 20, fontWeight: 700, padding: '12px 16px', borderRadius: 8, marginBottom: 12,
              color: result.valid ? '#389e0d' : '#cf1322',
              background: result.valid ? '#f6ffed' : '#fff1f0',
              border: `1px solid ${result.valid ? '#b7eb8f' : '#ffa39e'}`
            }}>
              {result.valid
                ? `✓ 合法：${result.columns}×${result.rows} 格`
                : `✗ 增长到上限仍不合法（${result.columns}×${result.rows} 格）`}
              <span style={{ fontSize: 12, fontWeight: 400, marginLeft: 12, color: '#888' }}>
                起始 {result.startColumns}×{result.startRows} · 上限 = {result.maxColumns}×{result.maxRows} ·
                checked {result.details?.checked ?? 0} 个元素
              </span>
            </div>

            {result.tendency && (
              <div style={{ marginBottom: 12, padding: '10px 12px', background: '#f9f9f9', borderRadius: 6, fontSize: 13 }}>
                <span style={{ fontWeight: 600 }}>倾向性（自动推导）：</span>
                <span style={{ fontFamily: 'monospace', color: '#2f54eb' }}>
                  {JSON.stringify(result.tendency)}
                </span>
                <div style={{ color: '#888', fontSize: 12, marginTop: 2 }}>
                  {sourceLabel(result.tendencySource, result.cardName)}
                </div>
              </div>
            )}

            <div style={{ marginBottom: 12, fontSize: 13 }}>
              <span style={{ fontWeight: 600 }}>按趋势推算的尺寸路径：</span>
              <span style={{ fontFamily: 'monospace', color: '#595959' }}>
                {result.path.map((p, i) => (
                  <span key={i}>
                    {i > 0 && <span style={{ color: '#bbb' }}> → </span>}
                    {p.c}×{p.r}
                  </span>
                ))}
              </span>
            </div>

            {result.screenshotUrl && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>最终渲染截图（无头浏览器实际渲染结果）</div>
                <img
                  src={result.screenshotUrl}
                  alt="最终渲染截图"
                  style={{ width: '100%', border: '1px solid #eee', borderRadius: 8, display: 'block' }}
                />
              </div>
            )}

            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>检测明细（{result.details?.messages?.length ?? 0} 条）</div>
            {result.details?.messages?.length > 0 && (
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {result.details.messages.map((msg, i) => {
                  const typeMatch = msg.match(/^\[(missing|clipped|scroll)\]/);
                  const type = typeMatch ? typeMatch[1] : 'info';
                  const style = violationColor(type);
                  return (
                    <li key={i} style={{ padding: '8px 10px', marginBottom: 6, borderRadius: 6, fontSize: 12, ...style, wordBreak: 'break-all' }}>
                      {msg}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>

      <hr style={{ margin: '32px 0', border: 'none', borderTop: '1px solid #eee' }} />

      {/* ════════════ 测试集 ════════════ */}
      <div>
        <h2 style={{ fontSize: 18, margin: '0 0 4px' }}>测试集（{testCases.length} 个用例 · test-cases.json）</h2>
        <p style={{ color: '#888', fontSize: 12, margin: '0 0 12px' }}>
          覆盖全部卡片（含 card: 命名空间）· 每卡含基础场景；重点卡含「需增长」场景（内容超长应触发增长）·
          另含 3 个边界场景（纯文本回退 / markdown 列表兜底 / 未知卡回退）· 断言：expect.valid 匹配 + 最终格子 ≥ min ·
          每条运行后展示最终渲染截图（test 截图仅本地 dev 生成，线上不产生图片）
        </p>

        <div style={{ display: 'flex', gap: 16, marginBottom: 12, alignItems: 'center' }}>
          <label style={{ fontSize: 13 }}>
            列上限：
            <input type="number" min="1" value={suiteN} onChange={(e) => setSuiteN(e.target.value)}
              style={{ width: 60, marginLeft: 6, padding: '4px 6px' }} />
          </label>
          <label style={{ fontSize: 13 }}>
            行上限：
            <input type="number" min="1" value={suiteM} onChange={(e) => setSuiteM(e.target.value)}
              style={{ width: 60, marginLeft: 6, padding: '4px 6px' }} />
          </label>
          <button
            onClick={runAll}
            disabled={suiteRunning}
            style={{ padding: '8px 24px', background: '#722ed1', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14 }}
          >
            {suiteRunning
              ? `运行中… ${suiteCount}/${testCases.length}（通过 ${suitePass}）`
              : `运行全部（${testCases.length} 条）`}
          </button>
          {suiteRunning && (
            <div style={{ flex: 1, height: 6, background: '#f0f0f0', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(suiteCount / testCases.length) * 100}%`, background: '#722ed1', transition: 'width .2s' }} />
            </div>
          )}
        </div>

        {suiteResults && Object.keys(suiteResults).length > 0 && (
          <div style={{ marginBottom: 12, fontSize: 13 }}>
            总进度：{suiteCount}/{testCases.length} · 通过 <span style={{ color: '#389e0d', fontWeight: 600 }}>{suitePass}</span> · 失败{' '}
            <span style={{ color: '#cf1322', fontWeight: 600 }}>{suiteCount - suitePass}</span>
          </div>
        )}

        {/* 用例列表 */}
        <div style={{ border: '1px solid #eee', borderRadius: 8, overflow: 'hidden' }}>
          {testCases.map((tc, i) => {
            const r = suiteResults ? suiteResults[i] : null;
            return (
              <div key={i} style={{ borderBottom: '1px solid #f0f0f0', padding: '10px 14px', background: r ? (r.pass ? '#f6ffed' : '#fff1f0') : '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 12, color: '#999', width: 28 }}>#{i + 1}</span>
                  {morphBadge(tc.morphology)}
                  <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#722ed1', background: '#f9f0ff', padding: '1px 8px', borderRadius: 10 }}>
                    {tc.card}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 600, flex: 1, minWidth: 200 }}>{tc.name}</span>
                  {r && (
                    <span style={{
                      fontSize: 12, padding: '2px 10px', borderRadius: 10,
                      background: r.error ? '#fff2f0' : (r.pass ? '#f6ffed' : '#fff1f0'),
                      color: r.error ? '#cf1322' : (r.pass ? '#389e0d' : '#cf1322'),
                      border: `1px solid ${r.error || !r.pass ? '#ffa39e' : '#b7eb8f'}`
                    }}>
                      {r.error ? '请求失败' : (r.pass ? '✓ 通过' : '✗ 失败')}
                    </span>
                  )}
                  <button
                    onClick={() => runOne(i)}
                    disabled={suiteRunning}
                    style={{ fontSize: 12, padding: '2px 10px', background: '#fff', border: '1px solid #d9d9d9', borderRadius: 4, cursor: 'pointer' }}
                  >
                    单跑
                  </button>
                  <button
                    onClick={() => setExpanded((prev) => ({ ...prev, [i]: !prev[i] }))}
                    style={{ fontSize: 12, padding: '2px 10px', background: '#fff', border: '1px solid #d9d9d9', borderRadius: 4, cursor: 'pointer' }}
                  >
                    {expanded[i] ? '收起' : '查看 psuip'}
                  </button>
                </div>

                <div style={{ fontSize: 12, color: '#888', marginTop: 4, marginLeft: 36 }}>{tc.description}</div>

                {r && (
                  <div style={{ marginLeft: 36, marginTop: 6, fontSize: 12, fontFamily: 'monospace', color: '#595959', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    <span>实际：{r.error ? '—' : `${r.valid ? '✓ 合法' : '✗ 不合法'} ${r.columns}×${r.rows} 格`}</span>
                    {!r.error && (
                      <>
                        <span>起始 {r.startColumns}×{r.startRows}</span>
                        <span>倾向性 {JSON.stringify(r.tendency)}</span>
                        <span style={{ color: '#999' }}>{sourceLabel(r.tendencySource, r.cardName)}</span>
                        <span>期望：valid={String(tc.expect?.valid)} ≥{tc.expect?.minColumns ?? 1}×{tc.expect?.minRows ?? 1}</span>
                      </>
                    )}
                    {r.reason && <span style={{ color: '#cf1322' }}>（{r.reason}）</span>}
                  </div>
                )}

                {r && r.screenshotUrl && (
                  <div style={{ margin: '8px 0 0 36px' }}>
                    <div style={{ fontSize: 11, color: '#999', marginBottom: 4 }}>
                      {tc.card} · {r.columns}×{r.rows} 格渲染结果
                    </div>
                    <a href={r.screenshotUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-block' }}>
                      <img
                        src={r.screenshotUrl}
                        alt={`${tc.name} 渲染截图`}
                        loading="lazy"
                        style={{ maxWidth: 300, maxHeight: 200, border: '1px solid #eee', borderRadius: 8, display: 'block' }}
                      />
                    </a>
                  </div>
                )}

                {expanded[i] && (
                  <pre style={{
                    margin: '8px 0 0 36px', padding: 10, background: '#fafafa', border: '1px solid #eee',
                    borderRadius: 6, fontSize: 12, fontFamily: 'monospace', whiteSpace: 'pre-wrap', wordBreak: 'break-all'
                  }}>
                    {tc.psuip}
                  </pre>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
