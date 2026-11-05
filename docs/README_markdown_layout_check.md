# 布局合理性校验接口说明

`POST /api/markdown-layout-check`

判断一段 **裸 PSUIP** 放入指定 **`m×n` 网格**后，内容是否完整可见、布局是否合理。  
主要用于强化学习训练：模型产出 PSUIP 后调用本接口，得到 `valid` 作为约束 / 奖励信号。

相关实现：

- `src/app/api/markdown-layout-check/route.js`
- `src/app/utils/eightElement/gridValidity.js`
- `src/app/utils/eightElement/gridDomCheck.js`
- 调试页：`http://localhost:3001/layout-check`

---

## 1. 功能概览

| 项目 | 说明 |
|------|------|
| 输入 | 裸 PSUIP（**不要**自带 `layout:grid` / `grid:item`）+ 网格列数 / 行数 |
| 过程 | 自动包裹成占满全网格的 `grid:item` → 渲染 HTML → Playwright DOM 检测 |
| 输出 | `valid`（是否合理）+ `details`（明细）；可选截图 URL |

**检测项（内容缺失）：**

1. 内容未显示（尺寸为 0 / `display:none` / `visibility:hidden` / 完全在容器外）
2. 内容被裁切（超出容器）；**`...` 省略号 / line-clamp 截断允许，不算缺失**
3. `grid:item` 内出现预期外滚动（文档级滚动不参与判定）
4. 传入文本在渲染结果中找不到（按文本片段比对）

---

## 2. 请求

```http
POST http://localhost:3001/api/markdown-layout-check
Content-Type: application/json; charset=utf-8
```

### 2.1 Body 字段

| 字段 | 类型 | 必填 | 默认 | 说明 |
|------|------|------|------|------|
| `psuip` | string | 是 | — | 裸 PSUIP / 八要素 markdown；**不含** `<layout:grid>`、`<grid:item>` |
| `type` | string | 否 | `"grid"` | 布局类型；当前**仅支持** `"grid"` |
| `width` | number | 否 | `4` | 网格**列数** m（格子数，不是像素） |
| `height` | number | 否 | `3` | 网格**行数** n（格子数，不是像素） |
| `test` | boolean | 否 | `false` | 是否返回截图 URL，便于人工核对；**仅 `NODE_ENV=development` 生效**，生产环境强制忽略 |

> **注意：** `width` / `height` 是格子数。像素由内部按参考格换算：`CELL_WIDTH=456`、`CELL_HEIGHT=216`、`GAP=16`（见 `GRID_CONSTANTS`），另加视口余量 40px。

### 2.2 请求示例

```json
{
  "psuip": "<metricCard>\n  <metric_label>调试卡片</metric_label>\n  <metric_value>68%</metric_value>\n  <trend_value>+12%</trend_value>\n</metricCard>",
  "type": "grid",
  "width": 4,
  "height": 3,
  "test": true
}
```

### 2.3 curl 示例

```bash
curl -X POST "http://localhost:3001/api/markdown-layout-check" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "{
    \"psuip\": \"<summaryCard>\\n  <title>生成岗位JD完成</title>\\n  <commit>查看过程</commit>\\n  <text>已生成完整岗位说明</text>\\n</summaryCard>\",
    \"type\": \"grid\",
    \"width\": 2,
    \"height\": 2,
    \"test\": true
  }"
```

---

## 3. 响应

### 3.1 成功（HTTP 200）

```json
{
  "success": true,
  "valid": true,
  "type": "grid",
  "width": 4,
  "height": 3,
  "wrappedPsuip": "<layout:grid width=\"4\" gap=\"16\" height=\"3\">\n<grid:item x=\"1\" y=\"1\" width=\"4\" height=\"3\">\n...\n</grid:item>\n</layout:grid>",
  "screenshotUrl": "/grid-check-1788403367969-zhxn8i.png",
  "details": {
    "checked": 12,
    "messages": ["通过：无内容缺失"]
  }
}
```

| 字段 | 说明 |
|------|------|
| `success` | 请求是否成功处理 |
| `valid` | `true` = 在该 `m×n` 下布局合理；`false` = 不合理 |
| `type` | 实际使用的布局类型 |
| `width` / `height` | 实际使用的列数 / 行数 |
| `wrappedPsuip` | 接口自动包裹后的完整可渲染 PSUIP |
| `screenshotUrl` | `test=true`（且为 dev）时返回；相对路径，访问 `http://localhost:3001` + 该路径即可看图；否则为 `null` |
| `details` | 校验明细；`messages` 列出通过说明或各项违规原因 |

> 渲染出的 HTML **不会**放进响应，避免体积过大；仅内部用于检测。

`valid=false` 时 `details.messages` 示例：

```json
{
  "checked": 18,
  "messages": [
    "[clipped] .title: 内容超出容器被裁切",
    "[scroll] grid:item: 出现预期外滚动",
    "[missing] text token: 某段传入文本未在 DOM 中找到"
  ]
}
```

### 3.2 失败（HTTP 400 / 500）

```json
{
  "success": false,
  "error": "psuip 参数为必填项（PSUIP markdown 字符串）"
}
```

常见错误：

| 情况 | 说明 |
|------|------|
| 缺少 `psuip` | 400 |
| `type` 非 `grid` | 400，并返回 `supportedTypes: ["grid"]` |
| `width` / `height` 非正整数 | 400 |
| 服务端异常 | 500，含 `message` |

---

## 4. 内部处理流程

1. **校验参数**（`psuip` / `type` / 格子数）
2. **包裹网格**（`wrapGridPsuip`）：

```text
<layout:grid width="{m}" gap="16" height="{n}">
  <grid:item x="1" y="1" width="{m}" height="{n}">
    {裸 psuip}
  </grid:item>
</layout:grid>
```

即：整段内容放进**单个占满 m×n 的** `grid:item`。

3. **换算视口并渲染 HTML**  
   `viewport ≈ m×456 + (m-1)×16 + 40`（高同理用 216）
4. **Playwright DOM 检测**（`measureGridDom`）
5. **汇总**：无违规 → `valid: true`；否则 `valid: false` 并写入 `details.messages`

---

## 5. 调试页

开发环境下可打开：

[http://localhost:3001/layout-check](http://localhost:3001/layout-check)

支持：

- 手动输入裸 PSUIP + 列/行数并校验
- 加载 `test-cases.json` 中的用例
- 一键批量跑用例并对照截图 / 明细

---

## 6. 使用注意

1. **只传裸内容**：不要自己写 `<layout:grid>` / `<grid:item>`，否则会被再次包裹，语义错乱。
2. **格子数语义**：模型侧只关心「几列几行」；像素由服务端固定常量换算。
3. **`test` 仅开发环境**：`npm run start` / 生产环境即使传 `test: true` 也不会截图，避免不断往服务器写图片。
4. **依赖 Playwright**：需正确安装并批准 `playwright-chromium` 等构建脚本（见 pnpm `allowBuilds`），否则 DOM 检测会失败。
5. **省略号豁免**：标题等设计上的 ellipsis / line-clamp **不算**内容缺失；真正「被盒子裁掉却看不见」才算裁切违规。
6. **图谱 / 公式 / 表格**：Topology、LaTeX、部分 table 语法会做特殊处理，不完全按纯文本逐字比对（详见 `gridDomCheck.js`）。

---

## 7. 与训练侧的关系

典型用法：

```text
模型生成裸 PSUIP + 提议的 (width, height)
        ↓
POST /api/markdown-layout-check
        ↓
valid === true  → 可给正奖励 / 接受该动作
valid === false → 负奖励 / 拒绝，并可把 details.messages 作为反馈
```

接口返回的 `wrappedPsuip` 也可用于后续真正渲染落盘，无需训练侧再拼 grid 标签。
