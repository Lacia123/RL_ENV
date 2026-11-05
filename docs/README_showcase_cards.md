# 展示型卡片说明

本文档说明展示型相关顶层组件的用法、视觉效果，以及各标签的互斥/组合规则。  
覆盖：示例页签「🖼 展示型卡片」中的 `showcaseCard` / `mistakesCard`，以及目标统计卡 `targetStatCard`（示例见 Slab 页签）。

实现见：
- `src/app/utils/eightElement/styles/component/showcaseCard.js`
- `src/app/utils/eightElement/styles/component/mistakesCard.js`
- `src/app/utils/eightElement/styles/component/targetStatCard.js`

> **命名注意：** 同名标签在不同组件中语义不同。例如 `showcaseCard` 的 `text` 是段落正文，`targetStatCard` 的 `text` 是超大关键数字；`caption` 在前者多为底部说明，在后者为数字旁的说明标签。

---

## 1. 组件清单

| 顶层组件 | 用途 |
|----------|------|
| `showcaseCard` | 通用展示容器：相关文件、预览、摘要加载、双图等 |
| `mistakesCard` | 易错点 / 薄弱点分级列表 |
| `targetStatCard` | 目标统计卡：副标题标签 + 主标题 + 关键数字 + 说明 |

---

## 2. `showcaseCard`

### 2.1 视觉与布局

半透明白底（`white.48`）、超大圆角。按是否含 `preview` 自动切换布局：

| 布局模式 | 触发条件 | 结构 |
|----------|----------|------|
| **previewMode（左右）** | 有 `preview` | 左：`title` + `caption`；右：180×154 预览图 |
| **default（上中下）** | 无 `preview` | 上：标题行；中：正文/列表/加载/按钮；下：`caption` |

### 2.2 顶层插槽

| 标签 | 必选 | 可重复 | 说明 |
|------|------|--------|------|
| `title` | 否* | 否 | 主标题（粗体大字） |
| `subtitle` | 否 | 否 | 副标题（标题行右侧偏蓝灰） |
| `toggle` | 否 | 否 | 右上角品牌色开关滑块（展示态） |
| `text` | 否 | 否 | 24px 段落正文 |
| `loading` | 否 | 否 | 两段紫色渐变骨架条（下条宽 60%） |
| `button` | 否 | 否 | 通栏大渐变胶囊按钮（白字 32px） |
| `preview` | 否 | 否 | 右侧预览图，带 `src`；**触发左右布局** |
| `caption` | 否 | 否 | 底部说明（如 `4 Images`） |
| `imageTextItem` | 否 | 是 | 单图 + 标题 + 正文条目 |
| `commonListItem` | 否 | 是 | icon + 标题/描述行条目 |
| `doubleImageItem` | 否 | 是 | 双图并排条目 |

\* 业务上通常至少提供 `title`；代码未强制必填。

### 2.3 子标签结构

#### `imageTextItem`

| 子标签 | 说明 |
|--------|------|
| `image` | 主图，`src` / `alt`；4:3，大圆角 |
| `title` | 条目标题 |
| `text` | 条目正文 |

效果：上图下文；白底文本块叠在图片下方。

#### `commonListItem`

| 子标签 | 说明 |
|--------|------|
| `icon` | 左侧图标（可用 emoji / 文本） |
| `title` | 标题 |
| `text` | 描述 |

效果：横向行列表（无底部分隔线、无 hover 变色）。可用 `layout:column` 包裹 `title`/`text`。

#### `doubleImageItem`

| 子标签 | 说明 |
|--------|------|
| `image` | 可重复；按顺序左右并排（通常 2 张） |

效果：两端对齐的双图行。

### 2.4 标签互斥与组合规则

#### 布局级互斥（硬规则）

| 关系 | 说明 |
|------|------|
| **`preview` ↔ 默认布局内容** | 有 `preview` 时进入 `previewMode`，**仅渲染** `title` / `caption` / `preview`。同卡内的 `subtitle`、`toggle`、`text`、`loading`、`button`、`imageTextItem`、`commonListItem`、`doubleImageItem` **不会出现在该布局结构中**（等于与默认中间区互斥）。 |
| **无 `preview` ↔ `preview` 专属形态** | 无 `preview` 时走默认三段布局，不会出现右侧预览块。 |

因此：需要「左文右图」只用 `preview` 模式；需要列表/正文/加载/按钮时**不要**写 `preview`。

#### 默认可组合（非互斥）

以下在 **default 布局** 下可同时出现，代码不互斥：

| 区域 | 标签 | 组合说明 |
|------|------|----------|
| 标题行 | `title` + `subtitle` + `toggle` | 可并存；`toggle` 在右侧 |
| 正文区 | `text` | 可与中间条目、loading、button 同卡 |
| 中间条目区 | `imageTextItem*`、`commonListItem*`、`doubleImageItem*` | 可混排；渲染顺序按文档出现顺序 |
| 底部动作 | `loading`、`button` | 可并存（loading 在上，button 在下） |
| 底栏 | `caption` | 可与上述并存 |

#### 推荐互斥（软约束，避免视觉冲突）

代码允许混用，但生成/校验时建议遵守：

| 建议互斥组 | 原因 |
|------------|------|
| **中间内容三选一主形态**：`imageTextItem` / `commonListItem` / `doubleImageItem` | 混用易造成「文件列表 + 双图 + 叠层图文」信息过载；示例页也是分开展示 |
| **`text` + 大段中间列表** 慎用 | 正文与列表同时很长时层次不清；短摘要 + 少量条目可接受 |
| **`loading` 与已填满的中间条目** 慎用 | 骨架条表示未就绪，与完整列表语义冲突；更适合「摘要文案 + loading + button」场景 |

#### 子标签内部

| 容器 | 互斥/约束 |
|------|-----------|
| `imageTextItem` | 子标签不互斥；建议同时有 `image` + `title`（`text` 可选） |
| `commonListItem` | 子标签不互斥；建议有 `title`（`icon`/`text` 可选） |
| `doubleImageItem` | 多个 `image` 不互斥；语义上固定为 **两张** 并排 |

### 2.5 典型写法对照

| 场景 | 推荐标签组合 | 勿同时使用 |
|------|--------------|------------|
| 开关 + 相关文件列表 | `title` `subtitle?` `toggle` + `imageTextItem`/`commonListItem` + `caption` | `preview` |
| 中间双图 | `title` + `doubleImageItem` + `caption` | `preview`；勿再堆长列表 |
| 右侧预览 | `title` + `preview` + `caption` | 任何默认中间区标签 |
| 加载中摘要 | `title` `toggle?` + `text` + `loading` + `button` | `preview`；完整中间列表 |

---

## 3. `mistakesCard`

### 3.1 视觉与布局

| 布局模式 | 触发条件 | 效果 |
|----------|----------|------|
| **withTitle** | 有顶层 `title` | 外层同 `showcaseCard` 白底大圆角容器；上方标题 + 下方条目列表 |
| **noTitle** | 无顶层 `title` | **无**外层卡片壳，仅渲染 `mistakesCardItem` |

### 3.2 顶层插槽

| 标签 | 必选 | 可重复 | 说明 |
|------|------|--------|------|
| `title` | 否 | 否 | 卡片总标题；有则启用容器壳 |
| `mistakesCardItem` | 是* | 是 | 易错点条目 |

\* 无条目则无可展示内容。

### 3.3 `mistakesCardItem` 子结构

```xml
<mistakesCardItem type="normal|warning|error">
  <title>...</title>
  <text>...</text>
  <caption>...</caption>
</mistakesCardItem>
```

| 子标签 | 位置 | 说明 |
|--------|------|------|
| `title` | 顶部 | 知识点/薄弱点名称 |
| `text` | 下方左侧 | 掌握度等描述 |
| `caption` | 下方右侧 | 带边框强调（如 `12 Mistakes`） |

| `type` | 背景 | 文字色系 |
|--------|------|----------|
| `normal`（默认） | 灰底 `grey.0` | 灰色 |
| `warning` | 橙底 + 毛玻璃 | 橙色 |
| `error` | 粉底 `pink.0` | 粉色 |

### 3.4 标签互斥与组合规则

#### 布局级

| 关系 | 说明 |
|------|------|
| **有 `title` ↔ 无 `title`** | 二选一布局形态，由是否写顶层 `title` 决定；不是两个标签互斥，而是同一标签「有/无」切换壳层。 |

#### 条目级硬互斥

| 关系 | 说明 |
|------|------|
| **`type` 取值互斥** | 每个 `mistakesCardItem` 只能取 `normal` / `warning` / `error` **之一**；不可叠多个 type。 |
| **顶层 `title` vs 条目内 `title`** | **不互斥**（作用域不同）：顶层是卡片标题，条目内是该项标题。 |

#### 可组合

| 关系 | 说明 |
|------|------|
| 多个 `mistakesCardItem` | 可重复，类型可不同（如一条 normal + 一条 error） |
| 条目内 `title` + `text` + `caption` | 可并存，推荐三项齐全 |

#### 推荐软约束

| 建议 | 原因 |
|------|------|
| 分组列表用「有 title」模式 | 需要「Weak Spots」这类章节头时加顶层 `title` |
| 嵌入其他布局/只露一条时用「无 title」模式 | 避免双层卡片壳 |
| 同卡内类型不要无差别堆砌 | `warning`/`error` 应用于真正分级；全用 `normal` 即可时不必硬上彩底 |

---

## 4. `targetStatCard`

### 4.1 视觉与布局

浅品牌色底（`brand.0`）、超大圆角白边卡片；右上角固定灰色八角星装饰。适合突出「单一目标标题 + 一个关键指标」。

| 布局模式 | 触发条件 | 结构 |
|----------|----------|------|
| **withCommit** | 有 `button` | 上：`subtitle` + `title`；下度量行：`text` + `caption` + 右侧 `button` |
| **default** | 无 `button` | 上：`subtitle` + `title`；下度量行：`text` + `caption` |

### 4.2 顶层插槽

| 标签 | 必选 | 可重复 | 说明 |
|------|------|--------|------|
| `subtitle` | 否 | 否 | 顶部紫色小标签（常大写），标记主题/人名/分组 |
| `title` | 是 | 否 | 主标题，黑色超大粗体，可换行 |
| `text` | 否 | 否 | **关键数字**（72px 紫色粗体），不是段落正文 |
| `caption` | 否 | 否 | 数字说明标签（灰色大写），紧贴 `text` 右侧 |
| `button` | 否 | 否 | 度量行右侧小型主操作；可带 `nativeEvent` / `data` |

### 4.3 标签互斥与组合规则

#### 布局级

| 关系 | 说明 |
|------|------|
| **有 `button` ↔ 无 `button`** | 仅切换度量行是否带右侧按钮（`withCommit` / `default`）；**不是**与其他标签互斥，其余 slot 两套布局都支持。 |

#### 硬约束 / 软约束

| 关系 | 类型 | 说明 |
|------|------|------|
| 各顶层标签彼此 | **不互斥** | `subtitle` / `title` / `text` / `caption` / `button` 可同时出现 |
| `title` | **必填** | 代码 `optional: false`；无标题则卡片语义不完整 |
| `text` + `caption` | **推荐成对** | `text` 放数字，`caption` 解释单位/含义；只写其一也可渲染，但统计信息不完整 |
| `text` 内容 | **软约束** | 应放短数字/指标（如 `240`），勿放长段落（与 `showcaseCard.text` 语义相反） |
| 多个 `targetStatCard` | **不互斥** | 可用 `layout:row` 横向并列多张 |

#### 与其他展示卡的边界（选型互斥）

| 勿混用场景 | 说明 |
|------------|------|
| 不要用 `targetStatCard` 承载列表/预览/骨架 | 那些属于 `showcaseCard` |
| 不要用 `targetStatCard` 做分级薄弱点条目 | 那些属于 `mistakesCard` |
| 同页多指标时 | 重复多个 `targetStatCard`，而不是在一张卡里堆多个 `text`（`text` 不可重复） |

### 4.4 典型写法

| 场景 | 推荐标签 |
|------|----------|
| 纯统计高亮 | `subtitle` + `title` + `text` + `caption` |
| 统计 + 操作 | 同上 + `button`（`nativeEvent` / `data`） |
| 多卡并排 | 多个 `targetStatCard` 包在 `layout:row` 内 |

---

## 5. 选型速查

| 需求 | 选用 | 关键互斥提醒 |
|------|------|--------------|
| 相关文件 / 图文列表 / 双图 / 加载摘要 | `showcaseCard` | 有 `preview` 则不要写中间列表/正文/按钮 |
| 左文右图预览条 | `showcaseCard` + `preview` | 仅保留 `title`/`caption`/`preview` |
| 薄弱点分级列表 | `mistakesCard` | 每条 `type` 三选一；要不要外层壳看有无顶层 `title` |
| 单一目标 + 关键数字 | `targetStatCard` | `text` 只放数字；多指标用多张卡，勿堆多个 `text` |

---

## 6. 最小示例

### showcaseCard — 列表（默认布局）

```xml
<showcaseCard>
  <title>Related files</title>
  <subtitle>4 Related Files</subtitle>
  <toggle></toggle>
  <commonListItem>
    <icon>📄</icon>
    <layout:column>
      <title>Patent collection</title>
      <text>Sent by Rebecca an hour ago</text>
    </layout:column>
  </commonListItem>
  <caption>4 Images</caption>
</showcaseCard>
```

### showcaseCard — 预览（左右布局，与上互斥）

```xml
<showcaseCard>
  <title>Related files</title>
  <preview src="https://example.com/preview.png"></preview>
  <caption>4 Images</caption>
</showcaseCard>
```

### mistakesCard — 有壳 + 多类型条目

```xml
<mistakesCard>
  <title>Weak Spots</title>
  <mistakesCardItem type="normal">
    <title>Multivariable Calculus</title>
    <text>38% Mastery</text>
    <caption>12 Mistakes</caption>
  </mistakesCardItem>
  <mistakesCardItem type="error">
    <title>Linear Algebra</title>
    <text>12% Mastery</text>
    <caption>28 Mistakes</caption>
  </mistakesCardItem>
</mistakesCard>
```

### targetStatCard — 默认统计

```xml
<targetStatCard>
  <subtitle>FOR MAGGIE</subtitle>
  <title>Master Calculus in 14 Days.</title>
  <text>240</text>
  <caption>TOTAL PROBLEMS</caption>
</targetStatCard>
```

### targetStatCard — 带按钮（withCommit）

```xml
<targetStatCard>
  <subtitle>WEEKLY REPORT</subtitle>
  <title>Ship 5 launches this week.</title>
  <text>128</text>
  <caption>ACTIVE USERS</caption>
  <button nativeEvent="click" data="viewReport">查看报告</button>
</targetStatCard>
```
