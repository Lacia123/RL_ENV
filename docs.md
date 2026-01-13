# PSUIP 语法文档 - 版本更新日志

本文档记录了 PSUIP (Pseudo-UI Protocol) 标记语言的功能特性及版本演进历史。

---

## 📦 版本概览

| 版本 | 发布日期 | 主要更新 |
|------|---------|---------|
| **1.2.0** | 2025-12 | Loop 循环数据绑定、插槽标签系统、新增组件系列 |
| **1.1.0** | 2025-06 | Layout 自定义属性、图表类型扩展、Tab 组件、事件系统 |
| **1.0.0** | 2025-01 | 基础语法、卡片组件、布局系统、图表支持 |

---

## 🚀 版本 1.2.0（当前版本）

### 新增功能

#### 1. Loop 循环数据绑定语法（增强版）

支持通过 `<loop>` 标签进行列表数据的循环渲染，并支持内部 `group` 标签明确指定循环模板。

**语法格式：**

```xml
<componentName>
  <title>列表标题</title>
  <subtitle>列表副标题</subtitle>
  <loop data="dataKey" nativeEvent="click">
    <groupName>
      <slotName key="fieldName"></slotName>
      <anotherSlot key="anotherField"></anotherSlot>
    </groupName>
  </loop>
</componentName>
```

**属性说明：**
- `data`: 指定绑定的数据数组的键名
- `nativeEvent`: 可选，指定原生事件类型（如 `click`）
- `key`: 在插槽标签上使用，指定数据字段映射
- `<groupName>`: 内部 group 标签，明确指定哪部分是循环模板

**示例1 - 评论列表卡片：**

```xml
<commentStyleListCard>
  <title>项目动态</title>
  <subtitle>最新 3 条更新 · 自动排列列表项</subtitle>
  <loop data="comments" nativeEvent="click">
    <itemContent>
      <avatar src="avatarUrl" key="avatarUrl"></avatar>
      <name key="approveAuditorName"></name>
      <text key="applyDeptName"></text>
      <desc key="orderSummary"></desc>
      <timestamp key="beginTime"></timestamp>
    </itemContent>
  </loop>
</commentStyleListCard>
```

**示例2 - 简易循环（无 group 标签）：**

```xml
<commentListCard>
  <loop data="loopData" nativeEvent="click">
    <title key="title"></title>
    <desc key="desc"></desc>
  </loop>
</commentListCard>
```

**数据绑定说明：**
- 使用 `key` 属性将插槽与数据字段绑定
- 循环会根据 `data` 指定的数组长度重复渲染模板
- `nativeEvent` 会自动添加到每个循环项上

**八要素表示（参考）：**
- 循环容器会添加 `"data-key": "comments"` 属性
- 循环模板会被标记为 `isLoopContainer: true`
- 每个插槽元素会包含对应的 `data-key` 映射

---

#### 2. 插槽标签系统（SlotConfigs）

引入插槽标签系统，使用语义化的标签来定义组件内容，替代传统的 markdown 映射方式。

**语法对比：**

**传统 Markdown 映射方式：**
```xml
<productCard>
## 产品标题
### 产品描述
¥999.00
[购买链接](https://example.com)
</productCard>
```

**新的插槽标签方式：**
```xml
<productCard>
  <image src="https://example.com/image.jpg"></image>
  <title>产品标题</title>
  <description>产品描述</description>
  <price>¥999.00</price>
  <button href="https://example.com/buy">立即购买</button>
</productCard>
```

**插槽标签的优势：**
1. ✅ **明确的语义** - 每个标签清晰表示其用途（title、description、price 等）
2. ✅ **灵活的顺序** - 不再依赖 markdown 标题层级顺序
3. ✅ **属性传递** - 可以通过属性传递额外配置（如 `src`、`href`、`key` 等）
4. ✅ **嵌套支持** - 支持在插槽中嵌套 layout 标签
5. ✅ **数据绑定** - 支持通过 `key` 属性进行数据绑定（用于 loop）

**支持的插槽类型：**
- `<image>` - 图片插槽，支持 `src` 和 `key` 属性
- `<title>` - 标题插槽
- `<subtitle>` - 副标题插槽
- `<description>` / `<desc>` - 描述文本插槽
- `<price>` - 价格插槽
- `<button>` - 按钮插槽，支持 `href` 属性
- `<name>` - 姓名插槽
- `<badge>` - 徽章插槽
- `<timestamp>` - 时间戳插槽
- `<avatar>` - 头像插槽
- 以及组件配置中定义的其他自定义插槽

**向后兼容性：**
插槽标签系统与传统的 `markdownMapping` 方式完全兼容，现有代码无需修改。

---

#### 3. 新增组件卡片系列

##### 3.1 简单卡片（simpleCard）

用于快速创建简单的信息展示卡片。

**方式一：使用 Markdown 语法**
```xml
<simpleCard>
### AI芯片
#### 搭载最新AI处理器
</simpleCard>
```

**方式二：使用插槽标签**
```xml
<simpleCard>
  <itemTitle>云存储</itemTitle>
  <itemDescription>1TB免费空间</itemDescription>
</simpleCard>
```

**方式三：组件内部使用 layout**
```xml
<simpleCard>
  <layout:row-center>
    <itemTitle>安全加密</itemTitle>
    <itemDescription>企业级数据保护</itemDescription>
  </layout:row-center>
</simpleCard>
```

**样式特点：**
- 默认宽度 48%（适合在 row 布局中并排显示）
- 青蓝渐变背景
- 圆角边框
- 自适应内边距

##### 3.2 产品卡片（productCard）

专为电商产品展示设计的卡片组件。

**完整示例：**
```xml
<productCard>
  <image src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400"></image>
  <title>经典设计手表</title>
  <description>精致工艺，优雅外观，适合各种场合佩戴的经典款式。采用瑞士机芯，316L不锈钢表壳。</description>
  <price>¥999.00</price>
  <button href="https://example.com/buy">立即购买</button>
</productCard>
```

**支持的插槽：**
- `image` - 产品图片（必需）
- `title` - 产品标题（必需）
- `description` - 产品描述（可选）
- `price` - 产品价格（可选）
- `button` - 购买按钮（可选）

**布局展示：**
```xml
<layout:row>
  <productCard>...</productCard>
  <productCard>...</productCard>
</layout:row>
```

##### 3.3 评论列表卡片（commentStyleListCard）

带样式的评论/动态列表卡片，支持循环渲染。

**完整示例：**
```xml
<commentStyleListCard>
  <title>项目动态</title>
  <subtitle>最新 3 条更新 · 自动排列列表项</subtitle>
  <loop data="comments" nativeEvent="click">
    <itemContent>
      <avatar src="avatarUrl" key="avatarUrl"></avatar>
      <name key="approveAuditorName"></name>
      <text key="applyDeptName"></text>
      <desc key="orderSummary"></desc>
      <timestamp key="beginTime"></timestamp>
    </itemContent>
  </loop>
</commentStyleListCard>
```

**特点：**
- 支持标题和副标题
- 内置 loop 循环支持
- 自动排列列表项
- 支持头像、姓名、描述、时间戳等多种内容类型

##### 3.4 招聘卡片系列

专为招聘/人才展示场景设计的卡片系列。

**hiringNewTitleCard - 招聘标题卡片：**
```xml
<hiringNewTitleCard>
  <title>人才筛选详情</title>
  <desc>负责核心算法模型的设计、优化与落地</desc>
  <badge>算法工程师</badge>
</hiringNewTitleCard>
```

**hiringNewAvatarCard - 招聘头像卡片：**
```xml
<hiringNewAvatarCard>
  <title>算法策略</title>
  <name>张逸杰</name>
  <badge>推荐原因</badge>
  <desc>他在算法优化与模型调参方面有出色表现，多次在业务指标上实现显著提升...</desc>
  <avatar src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=200&h=200"></avatar>
</hiringNewAvatarCard>
```

**hiringNewPersonCard - 招聘人员卡片：**
```xml
<hiringNewPersonCard>
  <title>杭州电子科技大学</title>
  <name>张忠元</name>
  <badge>推荐原因</badge>
  <desc>他具备扎实的数学与计算机基础，对机器学习、深度学习及优化算法有系统掌握...</desc>
</hiringNewPersonCard>
```

**复合布局示例：**
```xml
<layout:row>
  <layout:column flex="2">
    <hiringNewTitleCard>...</hiringNewTitleCard>
    <layout:row>
      <hiringNewAvatarCard>...</hiringNewAvatarCard>
      <hiringDarkNewAvatarCard>...</hiringDarkNewAvatarCard>
    </layout:row>
  </layout:column>
  <layout:column flex="1">
    <hiringNewPersonCard>...</hiringNewPersonCard>
  </layout:column>
</layout:row>
```

---

#### 4. 组件内部 Layout 支持

组件内部支持使用快捷 layout 标签进行内容布局。

**支持的快捷 layout 标签：**

| 标签 | 说明 | 等价于 |
|------|------|--------|
| `<layout:row-center>` | 水平布局，内容居中 | `flexDirection: row, alignItems: center` |
| `<layout:row-between>` | 水平布局，两端对齐 | `flexDirection: row, justifyContent: space-between` |
| `<layout:row-end>` | 水平布局，右对齐 | `flexDirection: row, justifyContent: flex-end` |
| `<layout:column-center>` | 垂直布局，内容居中 | `flexDirection: column, alignItems: center` |
| `<layout:row-center-center>` | 水平布局，水平垂直居中 | `row + alignItems: center + justifyContent: center` |
| `<layout:column-center-center>` | 垂直布局，水平垂直居中 | `column + alignItems: center + justifyContent: center` |
| `<layout:row-between-center>` | 水平布局，两端对齐+垂直居中 | `row + justifyContent: space-between + alignItems: center` |
| `<layout:row-around>` | 水平布局，均匀分布 | `flexDirection: row, justifyContent: space-around` |

**使用示例：**

```xml
<simpleCard>
  <layout:row-center>
    <itemTitle>安全加密</itemTitle>
    <itemDescription>企业级数据保护</itemDescription>
  </layout:row-center>
</simpleCard>

<simpleCard>
  <layout:row-between>
    <itemTitle>云同步</itemTitle>
    <itemDescription>实时备份</itemDescription>
  </layout:row-between>
</simpleCard>

<simpleCard>
  <layout:column-center-center>
    <itemTitle>智能识别</itemTitle>
    <itemDescription>AI 驱动的图像识别</itemDescription>
  </layout:column-center-center>
</simpleCard>
```

**自定义属性示例：**

```xml
<simpleCard>
  <layout:row-around justify="around" align="center">
    <itemTitle>指纹解锁</itemTitle>
    <itemDescription>安全便捷</itemDescription>
  </layout:row-around>
</simpleCard>
```

---

#### 5. 带参数组件直接使用

支持在组件上直接使用参数化配置。

**示例：**
```xml
<componentName param1="value1" param2="value2">
  内容
</componentName>
```

**说明：**
- 参数会传递给组件的 styleConfig
- 可以用于动态调整组件样式和行为
- 具体支持的参数由组件的 `supportedAttributes` 配置决定

---

### 版本 1.2.0 总结

| 功能类别 | 新增特性 | 优势 |
|---------|---------|------|
| **数据绑定** | Loop 循环语法（带 group） | 支持复杂列表渲染，明确循环模板 |
| **内容定义** | 插槽标签系统 | 语义化、灵活、可读性强 |
| **组件库** | 7+ 新组件卡片 | 覆盖常见业务场景 |
| **布局** | 组件内部 layout 支持 | 快捷布局，提升开发效率 |
| **扩展性** | 带参数组件 | 动态配置，更灵活 |

---

## 🎯 版本 1.1.0

### 新增功能

#### 1. Layout 自定义属性

支持在 layout 标签上设置自定义属性，例如背景图、背景色等。

**语法：**

```xml
<layout:root backgroundImage="url(https://example.com/bg.jpg)"></layout:root>
```

**支持的属性（以 layout:root 为例）：**
- `backgroundImage` - 背景图片 URL
- `backgroundRepeat` - 背景重复方式
- `backgroundSize` - 背景大小
- `backgroundPosition` - 背景位置
- `backgroundColor` - 背景颜色
- `background` - 背景简写属性

**示例：**

```xml
<layout:root backgroundImage="url(https://cdn.pixabay.com/photo/1280.jpg)" 
             backgroundSize="cover" 
             backgroundPosition="center">
  内容
</layout:root>
```

**说明：**
具体支持哪些属性由 layout 的 `styleConfig` 中的 `supportedAttributes` 配置决定。

---

#### 2. Layout:bgColumn 容器

新增带样式的布局容器，支持设置背景色、边框、阴影等。

**语法：**

```xml
<layout:bgColumn background={color.onprimary.white100}>
  内容
</layout:bgColumn>
```

**支持的属性：**
- `background` / `backgroundColor` - 背景颜色
- `padding` - 内边距
- `margin` - 外边距
- `borderRadius` - 圆角
- `borderColor` - 边框颜色
- `borderWidth` - 边框宽度
- `boxShadow` - 阴影

**示例：**

```xml
<layout:bgColumn background={color.onprimary.white100} 
                 padding={dimension.padding.base} 
                 borderRadius={dimension.borderradius.large}>
  <layout:row>
    <card:elegantStandard>...</card:elegantStandard>
    <card:elegantList>...</card:elegantList>
  </layout:row>
</layout:bgColumn>
```

**用途：**
由于 card 本身不能嵌套，`bgColumn` 提供了一个带样式的容器，用于实现多卡片在容器内的展示。

---

#### 3. 图表元件新增类型

新增多种图表类型，丰富数据可视化能力。

##### 3.1 柱状图（垂直）

```markdown
[chart:bar|季度销售额（万元）]
| 季度 | 销售额 |
|------|--------|
| Q1 | 120 |
| Q2 | 180 |
| Q3 | 240 |
| Q4 | 320 |
```

##### 3.2 面积图

```markdown
[chart:area_chart|AI-PC 趋势]
| 时间 | 出货量 | 渗透率 |
|------|--------|--------|
| 2025.04 | 100 | 20 |
| 2025.05 | 160 | 24 |
| 2025.06 | 210 | 28 |
```

##### 3.3 环形图

```markdown
[chart:donut_chart|产品占比]
| 类型 | 占比 |
|------|------|
| 轻薄本 | 45 |
| 游戏本 | 35 |
| 工作站 | 20 |
```

##### 3.4 树状图

```markdown
[chart:tree_mind|业务架构层级关系-Q2-FCST(K$)]
| layer1         | layer2                 | layer3             | layer4  |
|----------------|------------------------|--------------------|---------|
| 核心业务板块   | 臻算服务               | 企业级臻算         | 128,560 |
| 核心业务板块   | 臻算服务               | 个人端臻算         | 83,836  |
| 核心业务板块   | xCloud智能云           | 私有云服务         | 95,320  |
| 创新业务板块   | 智能体矩阵             | 消费级智能体       | 57,895  |
```

**说明：**
树状图使用表格表示层级关系，列头用 `layer1` ~ `layerN` 表示层级数量，相同 layer 的相同项会合并为同一节点。

---

#### 4. Tab 组件

用于实现选项卡切换的组件。

**语法：**

```xml
<tab bindingData="mainTabs" defaultTabKey="analysis">
  <tabPanel tabKey="analysis" tabTitle="数据分析">
    <card:elegantTable>...</card:elegantTable>
  </tabPanel>

  <tabPanel tabKey="trends" tabTitle="趋势预测">
    <card:elegantTable>...</card:elegantTable>
  </tabPanel>

  <tabPanel tabKey="settings" tabTitle="系统设置">
    <card:elegantList>...</card:elegantList>
  </tabPanel>
</tab>
```

**属性说明：**
- `bindingData` - 绑定的状态数据变量名
- `defaultTabKey` - 默认选中的选项卡 key
- `tabKey` - 选项卡的唯一标识
- `tabTitle` - 选项卡显示的标题

**八要素数据绑定（参考）：**

```json
{
  "data": {
    "mainTabs": "analysis"
  },
  "EventTargetIds": [
    "tab-panel-id-1",
    "tab-panel-id-2",
    "tab-panel-id-3"
  ]
}
```

**条件样式（conditionStyle）：**

每个选项卡会根据当前激活状态应用不同样式：

```json
{
  "conditionStyle": {
    "condition": "mainTabs=analysis",
    "className": "tab-item-active-xxx",
    "classStyle": {
      "background": "{color.onprimary.white100}",
      "borderRadius": "{dimension.borderradius.large}"
    }
  }
}
```

**事件绑定：**

```json
{
  "events": [{
    "runtimeEventKey": "tab_changed",
    "nativeEventKey": "click",
    "parameters": {
      "dataKey": "mainTabs",
      "tabKey": "trends"
    }
  }]
}
```

**选项卡面板条件渲染：**

```json
{
  "condition": "mainTabs=analysis"
}
```

只有当 `mainTabs` 的值等于 `analysis` 时，该面板才会渲染。

**StyleConfig 配置：**

Tab 组件包含以下样式配置：
- `tabContainer` - 整体容器样式
- `tabList` - 标签列表容器样式
- `tabListItem` - 标签项样式（normal / active）
- `tabPanel` - 选项卡内容面板样式

---

#### 5. 图表切换交互

支持通过点击图表或按钮来切换图表类型。

**语法1 - 点击图表切换：**

```markdown
[chart:barh|AI-PC 市场份额][event:chart_changed(barh,bar,pie)]
| 品牌 | 市场份额 |
|------|----------|
| 联想 | 35% |
| 苹果 | 28% |
| 荣耀 | 18% |
```

**语法2 - 通过按钮切换：**

```markdown
[chart:barh|AI-PC 市场份额][event:chart_changed(barh,bar,pie)|style:button]
| 品牌 | 市场份额 |
|------|----------|
| 联想 | 35% |
| 苹果 | 28% |
| 荣耀 | 18% |
```

**说明：**
- `event:chart_changed(type1,type2,type3)` - 定义切换的图表类型顺序
- `style:button` - 可选，添加后会显示切换按钮，否则点击图表切换

**八要素事件格式（参考）：**

```json
{
  "events": [{
    "runtimeEventKey": "chart_changed",
    "nativeEventKey": "click",
    "parameters": {
      "chartTypes": ["barh", "bar", "pie"]
    },
    "EventTargetId": "chart-element-id"
  }]
}
```

**按钮样式配置：**

```javascript
event: {
  button: {
    text: '新样式',
    metaType: 'button',
    variant: 'chartButton',
    style: {
      position: 'absolute',
      right: "{dimension.padding.loose}",
      top: "{dimension.padding.loose}"
    }
  }
}
```

---

#### 6. ICON 声明

支持插入图标，使用字节 IconPark 图标库。

**语法：**

```markdown
[icon:类别名/图标名]
```

**示例：**

```markdown
[icon:Base/home]
[icon:Abstract/ad-product]
[icon:Base/aiming]
```

**说明：**
- 使用 IconPark 图标库
- 格式：`类别名/图标名`
- 常见类别：Base, Abstract, Brand, Edit, Money 等

---

#### 7. 图表支持标题

图表现在支持通过 `|` 添加标题。

**语法：**

```markdown
[chart:grouped_line|心流指标趋势]
| 日期 | 心流满意度FSV | 心流专注值FFV | 心流效能值FEV |
| --- | --- | --- | --- |
| 2025-03-10 | 0.0 | 0.36 | 2.55 |
| 2025-03-11 | 0.0 | 0.41 | 2.22 |
```

**说明：**
在图表类型后使用 `|` 分隔，后面跟标题文字。

---

#### 8. 表格表头背景色

支持为表格表头设置背景色。

**语法：**

```markdown
| 功能模块 | 完成度 | 优先级 |[background:{color.primarycontainer.brand0}]
|---------|--------|--------|
| 卡片系统 | 100% | 高 |
| 布局引擎 | 95% | 高 |
| 主题配置 | 88% | 中 |
```

**说明：**
在表头行末尾使用 `[background:{token}]` 设置背景色，支持设计令牌。

---

#### 9. Minimalist 系列卡片

新增极简风格卡片系列（具体组件名称和用法参考 styleConfig）。

---

#### 10. 系统事件 - 下载

支持触发系统下载截图事件。

**语法：**

```markdown
[event:download][下载](https://github.com/example/edit)
```

**八要素事件格式（参考）：**

```json
{
  "events": [{
    "runtimeEventKey": "download",
    "nativeEventKey": "click",
    "EventTargetId": "element-id"
  }]
}
```

---

### 版本 1.1.0 总结

| 功能类别 | 新增特性 | 数量 |
|---------|---------|------|
| **布局** | Layout 自定义属性、bgColumn 容器 | 2 |
| **图表** | 柱状图、面积图、环形图、树状图、标题支持 | 5 |
| **交互** | Tab 组件、图表切换、系统下载事件 | 3 |
| **内容** | ICON 支持、表格表头背景色 | 2 |
| **卡片** | Minimalist 系列 | 1+ |

---

## 📚 版本 1.0.0（基础版本）

### 基础功能

#### 1. 通用 Markdown 语法

支持标准 Markdown 语法及格式映射。

**支持的格式：**
- **标题**：`# H1` ~ `###### H6`
- **强调**：`**粗体**` `*斜体*` `~~删除线~~`
- **列表**：有序列表 `1.` 和无序列表 `-` 或 `*`
- **链接**：`[文字](URL)`
- **引用**：`> 引用文本`
- **代码**：`` `行内代码` `` 和 ` ```代码块``` `
- **表格**：标准 Markdown 表格语法
- **数学公式**：`$行内公式$` 和 `$$块级公式$$`

---

#### 2. 表格语法增强

支持在表格后添加图表声明，将表格数据可视化。

**支持的图表类型：**
- `[chart:barh]` - 水平柱状图
- `[chart:line]` - 折线图
- `[chart:pie]` - 饼状图

**示例：**

```markdown
[chart:barh|AI-PC 市场份额]
| 品牌 | 市场份额 |
|------|----------|
| 联想 | 35% |
| 苹果 | 28% |
| 荣耀 | 18% |
```

---

#### 3. PSUIP 布局语法

提供灵活的布局系统，用于组织页面结构。

**布局层级概念：**
- 页面由多个布局容器组成
- 布局容器可以嵌套
- 每个布局容器有特定的排列方式

**支持的布局类型：**

##### layout:row（水平布局）

```xml
<layout:row>
  <card:elegantStandard>...</card:elegantStandard>
  <card:elegantList>...</card:elegantList>
</layout:row>
```

##### layout:column（垂直布局）

```xml
<layout:column>
  <card:headerCard>...</card:headerCard>
  <card:elegantTable>...</card:elegantTable>
</layout:column>
```

##### layout:gallery（画廊布局）

```xml
<layout:gallery>
  <card:minimalistStandard>...</card:minimalistStandard>
  <card:minimalistList>...</card:minimalistList>
  <card:minimalistTable>...</card:minimalistTable>
</layout:gallery>
```

**布局嵌套示例：**

```xml
<layout:row>
  <layout:column>
    <card:elegantStandard>...</card:elegantStandard>
    <card:elegantList>...</card:elegantList>
  </layout:column>
  <layout:column>
    <card:elegantTable>...</card:elegantTable>
  </layout:column>
</layout:row>
```

---

#### 4. 卡片组件

##### 4.1 基本卡片组件

支持带样式的卡片组件。

**语法：**

```xml
<card:elevated>
## 标题
内容
</card:elevated>
```

```xml
<card:outlined>
## 标题
内容
</card:outlined>
```

**样式类型：**
- `elevated` - 带阴影的卡片
- `outlined` - 带边框的卡片

---

##### 4.2 特定系列的卡片组件

提供多个预定义的卡片系列，每个系列包含多种布局模式。

**Elegant 系列（优雅青蓝风格）：**

```xml
<card:elegantStandard>
## 标题
### 副标题
内容描述
</card:elegantStandard>

<card:elegantList>
## 标题
- 列表项 1
- 列表项 2
- 列表项 3
</card:elegantList>

<card:elegantTable>
## 标题
| 列1 | 列2 |
|-----|-----|
| 值1 | 值2 |
</card:elegantTable>
```

**TechGradient 系列（科技渐变风格）：**

```xml
<card:techGradientStandard>
## 标题
内容
</card:techGradientStandard>

<card:techGradientHeaderActions>
## 标题
### 副标题
[操作按钮](https://example.com)
</card:techGradientHeaderActions>
```

**Header 系列（头部强调风格）：**

```xml
<card:headerCard>
## 标题
内容
</card:headerCard>

<card:headerPrecentCard>
## 标题
### 中国市场
#### 15%
AI-PC 出货量
</card:headerPrecentCard>
```

---

#### 5. 自定义令牌（Design Tokens）

支持使用设计令牌进行样式定制。

**语法：**

```xml
<插槽名称 属性名={设计令牌}>内容</插槽名称>
```

**示例 - 自定义颜色：**

```xml
<card:headerPrecentCard>
## 二、市场概述
AI-PC 概念自 2023 年由英特尔提出后，迅速引发行业关注

### 中国市场
<percentValue color={color.success.green6}>#### 15%</percentValue>
AI-PC 出货量

### 全球市场  
<percentValue color={color.warning.orange6}>#### 25%</percentValue>
AI-PC 渗透率

### 未来预测
<percentValue color={color.error.red6}>#### 40%</percentValue>
预计增长率
</card:headerPrecentCard>
```

**令牌类别：**
- `color.*` - 颜色令牌
  - `color.success.*` - 成功色系
  - `color.warning.*` - 警告色系
  - `color.error.*` - 错误色系
  - `color.basic.*` - 基础色系
  - `color.onprimary.*` - 前景色系
  - `color.surfacecontainer.*` - 容器色系
  - `color.primarycontainer.*` - 主容器色系
- `dimension.*` - 尺寸令牌
  - `dimension.padding.*` - 内边距
  - `dimension.margin.*` - 外边距
  - `dimension.gap.*` - 间距
  - `dimension.borderradius.*` - 圆角
  - `dimension.borderwidth.*` - 边框宽度
- `font.*` - 字体令牌
  - `font.size.*` - 字号
  - `font.weight.*` - 字重
- `material.*` - 材质令牌
  - `material.hierarchy.*` - 层次阴影

**令牌使用场景：**
1. 卡片组件的颜色定制
2. Layout 容器的样式设置
3. 插槽标签的属性配置

---

### 版本 1.0.0 总结

| 功能模块 | 描述 |
|---------|------|
| **Markdown** | 完整的标准 Markdown 语法支持 |
| **表格** | 表格 + 图表集成（3种图表类型） |
| **布局** | 3种布局类型（row, column, gallery） |
| **卡片** | 3个系列卡片组件（Elegant, TechGradient, Header） |
| **令牌** | 设计令牌系统，支持颜色、尺寸、字体、材质定制 |

---

## 🔄 版本对比

| 功能特性 | 1.0.0 | 1.1.0 | 1.2.0 |
|---------|-------|-------|-------|
| Markdown 基础语法 | ✅ | ✅ | ✅ |
| 基础图表（3种） | ✅ | ✅ | ✅ |
| 扩展图表（4+种） | ❌ | ✅ | ✅ |
| 基础布局（row/column/gallery） | ✅ | ✅ | ✅ |
| Layout 自定义属性 | ❌ | ✅ | ✅ |
| bgColumn 容器 | ❌ | ✅ | ✅ |
| 组件内部 layout | ❌ | ❌ | ✅ |
| 卡片系列（Elegant/TechGradient/Header） | ✅ | ✅ | ✅ |
| Minimalist 系列 | ❌ | ✅ | ✅ |
| 新增组件（product/simple/hiring等） | ❌ | ❌ | ✅ |
| Tab 组件 | ❌ | ✅ | ✅ |
| 图表切换交互 | ❌ | ✅ | ✅ |
| ICON 支持 | ❌ | ✅ | ✅ |
| 设计令牌 | ✅ | ✅ | ✅ |
| Markdown 映射（markdownMapping） | ✅ | ✅ | ✅ |
| 插槽标签系统（slotConfigs） | ❌ | ❌ | ✅ |
| Loop 循环（简易） | ❌ | ❌ | ✅ |
| Loop 循环（带 group） | ❌ | ❌ | ✅ |
| 系统事件（download） | ❌ | ✅ | ✅ |

---

## 📖 使用建议

### 新项目推荐使用

对于新项目，推荐使用 **1.2.0 版本** 的新特性：
1. ✅ 使用 **插槽标签** 替代 markdown 映射
2. ✅ 使用 **Loop 循环（带 group）** 处理列表数据
3. ✅ 使用 **组件内部 layout** 快速布局
4. ✅ 选择合适的 **新增组件** 满足业务需求

### 旧项目兼容性

PSUIP 保持 **向后兼容**：
- 1.0.0 和 1.1.0 的语法在 1.2.0 中仍然有效
- `markdownMapping` 和 `slotConfigs` 可以共存
- 简易 loop 和 group loop 可以混用

---

## 🚀 未来规划

### 计划中的功能

1. **更多组件**
   - 新闻卡片（newsCard）
   - 信息卡片（infoCard）
   - 更多业务场景组件

2. **增强的数据绑定**
   - 条件渲染
   - 计算属性
   - 事件处理增强

3. **样式系统**
   - 主题切换
   - 响应式设计
   - 动画效果

4. **开发工具**
   - VSCode 语法高亮
   - 实时预览
   - 组件库文档

---

## 📝 更新记录

| 日期 | 版本 | 更新内容 |
|------|------|---------|
| 2025-12 | 1.2.0 | Loop 循环、插槽标签、新组件系列 |
| 2025-06 | 1.1.0 | Layout 属性、图表扩展、Tab、事件系统 |
| 2025-01 | 1.0.0 | 初始版本，基础语法和卡片系统 |

---

## 💡 获取帮助

- 📚 **文档**：[PSUIP 官方文档](https://psuip-docs-alpha.dingdaoos.com/docs)
- 💬 **社区**：[加入讨论](https://psuip-docs-alpha.dingdaoos.com/community)
- 🐛 **问题反馈**：[GitHub Issues](https://github.com/psuip/issues)

---

本文档持续更新中，最后更新时间：2026-01-13
