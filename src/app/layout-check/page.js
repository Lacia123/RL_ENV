'use client';

import React, { useState } from 'react';
import testCases from './test-cases.json';

/**
 * /layout-check —— grid 布局合理性校验（内容缺失检测）调试模块
 *
 * 输入：裸 psuip（不含 grid / grid:item 标签）+ 网格格子数 m/n + 是否截图
 * 调用：POST /api/markdown-layout-check
 * 显示：valid 判定、details 明细（缺失/裁切/滚动）、渲染截图（页面内直接查看）、wrappedPsuip
 *
 * 测试用例：同目录 test-cases.json —— 可展开查看每个用例的 psuip，
 * 支持单用例「加载并运行」，或「一键运行全部」（并发 2，逐项返回判定与预期对比）。
 */
export default function LayoutCheckDebugPage() {
  const [psuip, setPsuip] = useState(`<metricCard>
  <metric_label>调试卡片</metric_label>
  <metric_value>68%</metric_value>
  <trend_value>+12%</trend_value>
</metricCard>`);
  const [width, setWidth] = useState(4);
  const [height, setHeight] = useState(3);
  const [test, setTest] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // 一键运行全部的状态
  const [batchResults, setBatchResults] = useState(null); // Array|null，与 testCases 等长
  const [runningAll, setRunningAll] = useState(false);
  const [expandedResult, setExpandedResult] = useState(null); // 结果表展开的行下标

  /** 通用校验请求（手动输入 / 单用例共用） */
  const runCheck = async ({ psuip: p, width: w, height: h, test: t }) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/markdown-layout-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ psuip: p, type: 'grid', width: Number(w), height: Number(h), test: t })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || `请求失败（${res.status}）`);
      } else {
        setResult(data);
      }
    } catch (e) {
      setError(`请求异常: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCheck = () => {
    runCheck({ psuip, width: Number(width), height: Number(height), test });
  };

  /** 单个用例：加载到输入区并立即校验（带截图） */
  const handleRunCase = (tc) => {
    setPsuip(tc.psuip);
    setWidth(tc.width);
    setHeight(tc.height);
    setTest(true);
    runCheck({ psuip: tc.psuip, width: tc.width, height: tc.height, test: true });
  };

  /** 一键运行全部用例（并发 2，每用例截图供人工核对） */
  const handleRunAll = async () => {
    if (runningAll) return;
    setRunningAll(true);
    setBatchResults(new Array(testCases.length).fill(null));
    setExpandedResult(null);

    const results = new Array(testCases.length).fill(null);
    const CONCURRENCY = 2;
    let next = 0;

    const worker = async () => {
      while (true) {
        const i = next++;
        if (i >= testCases.length) break;
        const tc = testCases[i];
        const t0 = Date.now();
        try {
          const res = await fetch('/api/markdown-layout-check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ psuip: tc.psuip, type: 'grid', width: tc.width, height: tc.height, test: true })
          });
          const data = await res.json();
          results[i] = { ...data, ok: res.ok, elapsed: Date.now() - t0 };
        } catch (e) {
          results[i] = { ok: false, error: e.message, elapsed: Date.now() - t0, expect: tc.expect };
        }
        // 逐条更新进度
        setBatchResults([...results]);
      }
    };

    await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
    setRunningAll(false);
  };

  /** 批量结果统计：只统计实际判定结果（无预期标注，对错由人看截图/明细判断） */
  const batchSummary = (() => {
    if (!batchResults) return null;
    const done = batchResults.filter(Boolean);
    const validCount = done.filter((r) => r.ok && r.valid).length;
    const invalidCount = done.filter((r) => r.ok && !r.valid).length;
    const failedCount = done.filter((r) => !r.ok).length;
    return { done: done.length, total: testCases.length, validCount, invalidCount, failedCount };
  })();

  const violationColor = (type) => {
    switch (type) {
      case 'missing': return { color: '#d4380d', background: '#fff2e8' };
      case 'clipped': return { color: '#d46b08', background: '#fff7e6' };
      case 'scroll': return { color: '#ad4e00', background: '#fff7e6' };
      default: return { color: '#595959', background: '#fafafa' };
    }
  };

  const badgeStyle = (valid) => ({
    display: 'inline-block',
    padding: '2px 10px',
    borderRadius: 10,
    fontSize: 12,
    fontWeight: 600,
    color: valid ? '#389e0d' : '#cf1322',
    background: valid ? '#f6ffed' : '#fff1f0',
    border: `1px solid ${valid ? '#b7eb8f' : '#ffa39e'}`
  });

  return (
    <div style={{ maxWidth: 1100, margin: '24px auto', padding: '0 24px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <h1 style={{ fontSize: 22, marginBottom: 8 }}>Grid 布局校验调试模块</h1>
      <p style={{ color: '#888', fontSize: 13, marginTop: 0 }}>
        POST /api/markdown-layout-check · 内容缺失检测（未显示 / 超出容器裁切（「...」省略号豁免）/ 预期外滚动）·
        测试用例无预期标注，对错以实际渲染截图与明细为准
      </p>

      {/* ============ 测试用例区块 ============ */}
      <div style={{ border: '1px solid #e8e8e8', borderRadius: 10, padding: '16px 20px', marginBottom: 24, background: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <h2 style={{ fontSize: 16, margin: 0 }}>测试用例（{testCases.length} 个 · test-cases.json）</h2>
          <button
            onClick={handleRunAll}
            disabled={runningAll}
            style={{ padding: '6px 20px', background: '#722ed1', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
          >
            {runningAll
              ? `运行中… ${batchSummary?.done ?? 0}/${testCases.length}`
              : '▶ 一键运行全部'}
          </button>
          {batchSummary && !runningAll && (
            <span style={{ fontSize: 13, color: '#595959' }}>
              完成 {batchSummary.done}/{batchSummary.total} ·
              <span style={{ color: '#389e0d', fontWeight: 600 }}> valid {batchSummary.validCount}</span> ·
              <span style={{ color: '#cf1322', fontWeight: 600 }}> invalid {batchSummary.invalidCount}</span>
              {batchSummary.failedCount > 0 && <span style={{ color: '#cf1322' }}> · 失败 {batchSummary.failedCount}</span>}
            </span>
          )}
        </div>

        {/* 用例列表（可展开） */}
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {testCases.map((tc, i) => {
            const br = batchResults?.[i];
            return (
              <details key={i} style={{ border: '1px solid #f0f0f0', borderRadius: 8, background: '#fafafa' }}>
                <summary style={{ cursor: 'pointer', padding: '8px 12px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 10, listStyle: 'none' }}>
                  <span style={{ color: '#888', fontFamily: 'monospace' }}>{String(i + 1).padStart(2, '0')}</span>
                  <span style={{ fontWeight: 600 }}>{tc.name}</span>
                  <span style={{ fontSize: 12, color: '#888' }}>m×n = {tc.width}×{tc.height}</span>
                  {runningAll && br === null && <span style={{ fontSize: 12, color: '#888' }}>排队中…</span>}
                  {br && !br.ok && <span style={{ fontSize: 12, color: '#cf1322' }}>请求失败</span>}
                  {br && br.ok && (
                    <span style={{ fontSize: 12, color: br.valid ? '#389e0d' : '#cf1322', fontWeight: 600 }}>
                      {br.valid ? '✓ valid' : `✗ invalid（${br.details?.messages?.length ?? 0} 条）`}
                    </span>
                  )}
                </summary>
                <div style={{ padding: '0 12px 12px', fontSize: 13 }}>
                  <p style={{ margin: '6px 0', color: '#595959' }}>{tc.description}</p>
                  <pre style={{ background: '#1f1f1f', color: '#d4d4d4', borderRadius: 6, padding: 10, fontSize: 12, overflow: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
{tc.psuip}
                  </pre>
                  <button
                    onClick={() => handleRunCase(tc)}
                    disabled={loading}
                    style={{ marginTop: 8, padding: '4px 14px', background: '#1677ff', color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer', fontSize: 12 }}
                  >
                    加载并运行本用例（带截图）
                  </button>
                </div>
              </details>
            );
          })}
        </div>

        {/* 批量运行结果表 */}
        {batchResults && batchResults.some(Boolean) && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>批量运行结果</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ background: '#fafafa', color: '#595959' }}>
                  <th style={{ padding: '6px 8px', textAlign: 'left', borderBottom: '1px solid #f0f0f0' }}>用例</th>
                  <th style={{ padding: '6px 8px', textAlign: 'center', borderBottom: '1px solid #f0f0f0' }}>网格</th>
                  <th style={{ padding: '6px 8px', textAlign: 'center', borderBottom: '1px solid #f0f0f0' }}>实际判定</th>
                  <th style={{ padding: '6px 8px', textAlign: 'center', borderBottom: '1px solid #f0f0f0' }}>明细</th>
                  <th style={{ padding: '6px 8px', textAlign: 'right', borderBottom: '1px solid #f0f0f0' }}>耗时</th>
                </tr>
              </thead>
              <tbody>
                {batchResults.map((br, i) => {
                  if (!br) return (
                    <tr key={i}>
                      <td style={{ padding: '6px 8px', borderBottom: '1px solid #f5f5f5', color: '#bbb' }} colSpan={5}>
                        {testCases[i].name} — 排队中…
                      </td>
                    </tr>
                  );
                  return (
                    <React.Fragment key={i}>
                      <tr
                        onClick={() => setExpandedResult(expandedResult === i ? null : i)}
                        style={{ cursor: 'pointer', background: br.ok ? undefined : '#fffbe6' }}
                      >
                        <td style={{ padding: '6px 8px', borderBottom: '1px solid #f5f5f5', fontWeight: 600 }}>{testCases[i].name}</td>
                        <td style={{ padding: '6px 8px', borderBottom: '1px solid #f5f5f5', textAlign: 'center' }}>{br.width}×{br.height}</td>
                        <td style={{ padding: '6px 8px', borderBottom: '1px solid #f5f5f5', textAlign: 'center' }}>
                          {br.ok ? <span style={badgeStyle(br.valid)}>{br.valid ? 'valid' : 'invalid'}</span> : <span style={{ color: '#cf1322' }}>请求失败</span>}
                        </td>
                        <td style={{ padding: '6px 8px', borderBottom: '1px solid #f5f5f5', textAlign: 'center', color: '#888' }}>
                          {br.details?.messages?.length ?? 0} 条
                        </td>
                        <td style={{ padding: '6px 8px', borderBottom: '1px solid #f5f5f5', textAlign: 'right', color: '#888' }}>
                          {(br.elapsed / 1000).toFixed(1)}s
                        </td>
                      </tr>
                      {expandedResult === i && (
                        <tr>
                          <td colSpan={5} style={{ padding: '0 8px 10px', borderBottom: '1px solid #f0f0f0' }}>
                            {br.error ? (
                              <div style={{ padding: 8, background: '#fff2f0', color: '#cf1322', borderRadius: 6, fontSize: 12 }}>{br.error}</div>
                            ) : (
                              <div>
                                {/* 该用例的渲染截图（无头浏览器实际渲染结果） */}
                                {br.screenshotUrl && (
                                  <div style={{ marginBottom: 8 }}>
                                    <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, color: '#595959' }}>
                                      渲染截图（m×n = {br.width}×{br.height} 视口）
                                    </div>
                                    <img
                                      src={br.screenshotUrl}
                                      alt={`${testCases[i].name} 渲染截图`}
                                      style={{ width: '100%', maxWidth: 620, border: '1px solid #eee', borderRadius: 8, display: 'block' }}
                                    />
                                  </div>
                                )}
                                {/* 原始 psuip（对照截图核对内容是否缺失） */}
                                <div style={{ marginBottom: 8 }}>
                                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, color: '#595959' }}>
                                    原始 psuip（对照截图核对缺失）
                                  </div>
                                  <pre style={{
                                    background: '#1f1f1f', color: '#d4d4d4', borderRadius: 6, padding: 10,
                                    fontSize: 12, overflow: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all',
                                    maxHeight: 240, margin: 0
                                  }}>
{testCases[i].psuip}
                                  </pre>
                                </div>
                                {br.details?.messages?.length > 0 ? (
                                  <ul style={{ margin: '6px 0', padding: 0, listStyle: 'none' }}>
                                    {br.details.messages.map((msg, j) => {
                                      const typeMatch = msg.match(/^\[(missing|clipped|scroll)\]/);
                                      const type = typeMatch ? typeMatch[1] : 'info';
                                      const style = violationColor(type);
                                      return (
                                        <li key={j} style={{ padding: '6px 10px', marginBottom: 4, borderRadius: 6, fontSize: 12, ...style, wordBreak: 'break-all' }}>
                                          {msg}
                                        </li>
                                      );
                                    })}
                                  </ul>
                                ) : (
                                  <div style={{ padding: 8, background: '#f6ffed', color: '#389e0d', borderRadius: 6, fontSize: 12 }}>无内容缺失明细</div>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ============ 手动输入区 + 结果区 ============ */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        {/* 左侧：输入区 */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <label style={{ fontSize: 13, fontWeight: 600 }}>裸 psuip（不含 grid / grid:item 标签）</label>
          <textarea
            value={psuip}
            onChange={(e) => setPsuip(e.target.value)}
            rows={10}
            style={{ width: '100%', boxSizing: 'border-box', fontFamily: 'monospace', fontSize: 13, padding: 8, marginTop: 4 }}
          />

          <div style={{ display: 'flex', gap: 16, marginTop: 12, alignItems: 'center' }}>
            <label style={{ fontSize: 13 }}>
              网格列数 m：
              <input type="number" min="1" value={width} onChange={(e) => setWidth(e.target.value)}
                style={{ width: 70, marginLeft: 6, padding: '4px 6px' }} />
            </label>
            <label style={{ fontSize: 13 }}>
              网格行数 n：
              <input type="number" min="1" value={height} onChange={(e) => setHeight(e.target.value)}
                style={{ width: 70, marginLeft: 6, padding: '4px 6px' }} />
            </label>
            <label style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
              <input type="checkbox" checked={test} onChange={(e) => setTest(e.target.checked)} />
              返回渲染截图（test）
            </label>
          </div>

          <button
            onClick={handleCheck}
            disabled={loading}
            style={{ marginTop: 12, padding: '8px 24px', background: '#1677ff', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14 }}
          >
            {loading ? '校验中…（无头浏览器渲染，稍候）' : '开始校验'}
          </button>

          {error && (
            <div style={{ marginTop: 12, padding: 12, background: '#fff2f0', color: '#cf1322', borderRadius: 6, fontSize: 13 }}>
              {error}
            </div>
          )}

          {result && (
            <div style={{ marginTop: 12, fontSize: 13, wordBreak: 'break-all' }}>
              <details style={{ background: '#fafafa', padding: 8, borderRadius: 6 }}>
                <summary style={{ cursor: 'pointer', fontWeight: 600 }}>wrappedPsuip（包裹后）</summary>
                <pre style={{ whiteSpace: 'pre-wrap', margin: 8, fontSize: 12 }}>{result.wrappedPsuip}</pre>
              </details>
            </div>
          )}
        </div>

        {/* 右侧：结果区 */}
        {result && (
          <div style={{ flex: 1.2, minWidth: 0 }}>
            {/* valid 判定 */}
            <div style={{
              fontSize: 20, fontWeight: 700, padding: '12px 16px', borderRadius: 8, marginBottom: 12,
              color: result.valid ? '#389e0d' : '#cf1322',
              background: result.valid ? '#f6ffed' : '#fff1f0',
              border: `1px solid ${result.valid ? '#b7eb8f' : '#ffa39e'}`
            }}>
              {result.valid ? '✓ 合理（无内容缺失）' : '✗ 不合理（存在内容缺失）'}
              <span style={{ fontSize: 12, fontWeight: 400, marginLeft: 12, color: '#888' }}>
                checked {result.details?.checked ?? 0} 个元素 · m×n = {result.width}×{result.height}
              </span>
            </div>

            {/* 截图 */}
            {result.screenshotUrl && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>渲染截图（无头浏览器实际渲染结果）</div>
                <img
                  src={result.screenshotUrl}
                  alt="渲染截图"
                  style={{ width: '100%', border: '1px solid #eee', borderRadius: 8, display: 'block' }}
                />
              </div>
            )}

            {/* 明细 */}
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
    </div>
  );
}
