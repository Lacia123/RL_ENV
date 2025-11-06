# 最近提交功能汇总

因为要在之前的一版文档基础上更新，因此需要先梳理一下再次期间更新了多少语法。并可以根据梳理出来的内容，由 AI 来生成新的文档

## 已包括的功能

之前文档内容包括

1. 通用 markdown 语法（包括不同格式的映射）
2. 表格语法增强（只包括：水平柱状图，折线图，饼状图）
3. PSUIP 布局语法：包括布局层级概念，布局语法规范，布局语法类型，包括（layout:row, layout:column, layout:gallery）
4. 卡片组件，基本卡片组件，包括带样式的卡片组件，例如：<card:elevated></card:elevated>，<card:outlined></card:outlined>
5. 特定系列的卡片组件（语法，映射关系，示例）

Elegant 系列（elegantStandard，elegantList，elegantTable）

TechGradient 系列（techGradientStandard，techGradientHeaderActions）

Header 系列（headerCard，headerPrecentCard）

自定义令牌

语法：<插槽名称 属性名={设计令牌}>内容</插槽名称>

自定义颜色设置：

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

**注意，这里没说明什么情况可以设置颜色以及设置的规则还有 token 是什么**

## 新增的功能

**先罗列，再归类**

1. layout 的自定义属性

以 backgroundImage 为例，layout:root 可以自定义属性，语法如下

```
<layout:root backgroundImage="url(https://cdn.pixabay.com/photo/2016/05/05/02/37/sunset-1373171_1280.jpg)"></layout:root>
```

具体支持哪些属性设置，是由 layout 的 styleConfig 设置决定

以 root 为例

```
supportedAttributes: ['backgroundImage', 'backgroundRepeat', 'backgroundSize', 'backgroundPosition', 'backgroundColor', 'background']
```

supportedAttributes 为可以设置的属性

2. 新增 layout:bgColumn 容器

由于 card 本身不能嵌套，因此增加带样式的 layout 容器，用于实现多卡片在容器内的展示，layout:bgColumn 是可以设置背景色，带边框阴影，默认竖向布局的容器，容器的好处就是通过不同的布局标签可以实现    其语法如下所示

```
<layout:bgColumn background={color.onprimary.white100}>
```

其 supportedAttributes 的设置如下

```
supportedAttributes: ['background', 'backgroundColor', 'padding', 'margin', 'borderRadius', 'borderColor', 'borderWidth', 'boxShadow']
```

可以通过 bgColumn 加不同的布局嵌套来实现不同的效果，例如下面的示例

```
<layout:bgColumn background={color.onprimary.white100}>
    <layout:row>
      <card:elegantStandard></card:elegantStandard>
      <card:elegantList></card:elegantList>
    </layout:row>
</layout:bgColumn>
```

3. 图表元件的新增类型

**柱状图（垂直）**

示例如下所示

```
[chart:bar|季度销售额（万元）]
| 季度 | 销售额 |
|------|--------|
| Q1 | 120 |
| Q2 | 180 |
| Q3 | 240 |
| Q4 | 320 |

```

**面积图**

示例如下所示

```
[chart:area_chart|AI-PC 趋势]
| 时间 | 出货量 | 渗透率 |
|------|--------|--------|
| 2025.04 | 100 | 20 |
| 2025.05 | 160 | 24 |
| 2025.06 | 210 | 28 |
```

**环形图**

示例如下所示

```
[chart:donut_chart|产品占比]
| 类型 | 占比 |
|------|------|
| 轻薄本 | 45 |
| 游戏本 | 35 |
| 工作站 | 20 |
</card:headerCard>
```

**树状图**

示例如下所示

```
[chart:tree_mind|业务架构层级关系-Q2-FCST(K$)]
      | layer1         | layer2                 | layer3             | layer4  |
      |----------------|------------------------|--------------------|----------------|
      | 核心业务板块   | 臻算服务               | 企业级臻算         | 128,560.00     |
      | 核心业务板块   | 臻算服务               | 个人端臻算         | 83,836.00      |
      | 核心业务板块   | xCloud智能云           | 私有云服务         | 95,320.00      |
      | 核心业务板块   | xCloud智能云           | 公有云服务         | 68,452.00      |
      | 核心业务板块   | xCloud智能云           | 混合云服务         | 17,140.00      |
      | 核心业务板块   | 全周期AI服务           | AI模型开发         | 62,732.80      |
      | 核心业务板块   | 全周期AI服务           | AI部署运维         | 54,891.20      |
      | 核心业务板块   | 全周期AI服务           | AI定制咨询         | 39,208.00      |
      | 创新业务板块   | 智能体矩阵             | 消费级智能体       | 57,895.20      |
      | 创新业务板块   | 智能体矩阵             | 工业级智能体       | 38,596.80      |
      | 创新业务板块   | 可持续发展解决方案ESG   | 碳管理服务         | 22,612.00      |
      | 创新业务板块   | 可持续发展解决方案ESG   | 绿色运维服务       | 18,089.60      |
      | 创新业务板块   | 可持续发展解决方案ESG   | ESG咨询报告        | 4,522.40       |
```

这里是用表格来表示树状图层级的概念，其中列头用 layer1 ~ n 表示有多少个层级，不同 layer 的相同的项表示合并为同一个节点

4. 增加 tab 组件

tab 组件用于实现切换，具体语法如下所示

```
<tab bindingData="mainTabs" defaultTabKey="analysis">
    <tabPanel tabKey="analysis" tabTitle="数据分析">
        <card:elegantTable></card:elegantTable>
    </tabPanel>

    <tabPanel tabKey="trends" tabTitle="趋势预测">
        <card:elegantTable></card:elegantTable>
    </tabPanel>

    <tabPanel tabKey="settings" tabTitle="系统设置">
        <card:elegantList></card:elegantList>
    </tabPanel>

</tab>
```

其中 bindingData 表示当前 tab 切换绑定的状态数据，注意这里之前的想法是可以自动生成，现在是需要指定一个变量名，defaultTabKey 表示默认值是 analysis，每一个 tabPanel 表示是一个选项卡，其中 tabKey 表示当选项卡切换到该项时 bindingData 的取值，tabTitle 为当前 tab 签的标题

```
"data": {
    "mainTabs": "analysis"
},
"EventTargetIds": [
    "dd-a65c7773-dae4-4aa3-b3eb-270132729e94",
    "dd-4c385183-3a44-4abc-bd8d-16f37b690c0d",
    "dd-739e457e-315a-425c-9589-1a300c89cbd3"
],
```

这都是根八要素中的元素

其中 data 表示当前八要素绑定的数据对象，此处 mainTabs 为声明的 key，"analysis" 是默认的 value

EventTargetIds 是所有选项卡的 ID

在 tab 签的八要素上存在 "conditionStyle" 属性

 "conditionStyle": {
    "condition": "mainTabs=analysis",
    "className": "tab-item-active-dd-a65c7773-dae4-4aa3-b3eb-270132729e94",
    "classStyle": {
        "flexGrow": "1",
        "padding": "{dimension.padding.tight}",
        "background": "{color.onprimary.white100}",
        "borderRadius": "{dimension.borderradius.large}"
    }
},

其中 "condition" 表示当前样式的生效条件，"mainTabs=analysis" 表示当 data 中的 mainTabs 变量为 analysis 时设置此样式，className 为此样式 className，classStyle 为生效时的具体样式。

并且在每一个选项卡上定义了 event 事件，如下示例所示

```
"events": [
    {
        "runtimeEventKey": "tab_changed",
        "nativeEventKey": "click",
        "dataEventKey": [],
        "parameters": {
            "dataKey": "mainTabs",
            "tabKey": "trends"
        },
        "EventTargetId": "dd-4c385183-3a44-4abc-bd8d-16f37b690c0d"
    }
]
```

其中 "runtimeEventKey": "tab_changed" 表示当前触发的系统事件是 "tab_changed"，"parameters" 中 "dataKey" = "mainTabs"，"tabKey" = "trends"，表示触发此事件时会把 mainTabs 设置值为 trends，另外在选项卡面板上存在 "condition" 字段，如下所示

```
"classStyle": {
    "padding": "{dimension.padding.base} {dimension.padding.semiloose}",
    "borderRadius": "{dimension.borderradius.large}",
    "background": "{color.surfacecontainer.white100}"
},
"className": "tab-panel-dd-b9c2682f-d8dd-4ba6-9ee6-5702fa028d30",
"condition": "mainTabs=analysis",
```

"condition" 字段的含义为当 "mainTabs" 取值为 "analysis" 才渲染当前元素

另外在 styleConfig 中的 tab 声明为默认的 standard 的样式，包含以下的组成部分

```
tabContainer: {
    style: {
        padding: "{dimension.padding.superloose} {dimension.padding.extraloose}",
        background: `{color.basic.brand.0}`,
        borderRadius: "{dimension.borderradius.xl}",
        border: `{dimension.borderwidth.base} solid {color.basic.opacity.black.7}`,
        gap: "{dimension.gap.extraloose}",
        position: 'relative',
        overflow: 'hidden',
        },
    },
```

tabContainer 表示整体的 tab 容器样式

```
tabList: {
    style: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: "{dimension.padding.tight}",
        gap: "{dimension.gap.base}",
        borderRadius: "{dimension.borderradius.xxxxl}",
        background: "{color.basic.brand.1}",
        overflow: 'hidden'
    }
},
```

tabList 表示标签容器样式

```
tabListItem: {
    normal: {
        metaType: 'text',
        variant: 'tabItemText',
        style: {
            flexGrow: "1",
            padding: "{dimension.padding.tight}",
        }
    },
    active: {
        metaType: 'text',
        variant: 'tabActiveItemText',
        style: {
            flexGrow: "1",
            padding: "{dimension.padding.tight}",
            background: "{color.onprimary.white100}",
            borderRadius: "{dimension.borderradius.large}",
        }
    }
},
```

tabListItem 表示具体标签样式，这里的 active 即为选中的样式，也是八要素中 conditionStyle 样式

```
tabPanel: {
    style: {
        padding: "{dimension.padding.base} {dimension.padding.semiloose}",
        borderRadius: "{dimension.borderradius.large}",
        background: "{color.surfacecontainer.white100}",
    }
}
```

tabPanel 是选项卡内容容器部分的样式

5.图表切换交互

支持通过点击图表或者点击按钮交互切换图表，具体语法示例如下所示

```
[chart:barh|AI-PC 市场份额][event:chart_changed(barh,bar,pie)]
| 品牌 | 市场份额 |
|------|----------|
| 联想 | 35% |
| 苹果 | 28% |
| 荣耀 | 18% |
```

```
[chart:barh|AI-PC 市场份额][event:chart_changed(barh,bar,pie)|style:button]
| 品牌 | 市场份额 |
|------|----------|
| 联想 | 35% |
| 苹果 | 28% |
| 荣耀 | 18% |
```

其中 style:button 表示通过按钮样式交互，不加为点击图表的形式交互

其对应的八要素的事件格式为

```
"events": [
    {
        "runtimeEventKey": "chart_changed",
        "nativeEventKey": "click",
        "dataEventKey": [],
        "parameters": {
        "chartTypes": [
            "barh",
            "bar",
            "pie"
        ]
    },
    "EventTargetId": "dd-8f300d62-b41d-4ac8-855d-6120cd2c2e6e"
}]
```

其中 "runtimeEventKey": "chart_changed" 表示是切换图表的事件，"chartTypes": ["barh", "bar", "pie"] 为切换图表的顺序，EventTargetId 指向具体的图表 ID，如果添加了 "style:button"，则是通过按钮进行事件交互，具体按钮的八要素事件格式为

```
"type": "button_normal",
"state": "default",
"events": [
    {
        "runtimeEventKey": "chart_changed",
        "nativeEventKey": "click",
        "dataEventKey": [],
        "parameters": {
            "chartTypes": [
                "barh",
                "bar",
                "pie"
            ]
        },
        "EventTargetId": "dd-36355baa-a333-4b8d-a904-e5fc5a6f4412"
    }
],
```

EventTargetId 指向 chart 的 id

在 styleConfig 中具体的 button 格式声明为

```
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

6. ICON 声明

PSUIP 支持通过插入 icon，语法为 `[icon:Base/home]`，使用 icon/Park 图标库，语法为 类别名/图标名，内置图标库为字节的 iconPark

7.系统事件（这个不需要开发给开发者）

[event:download][下载](https://github.com/example/edit)

表示系统下载截图的事件

```
"events": [
    {
        "runtimeEventKey": "download",
        "nativeEventKey": "click",
        "dataEventKey": [],
        "EventTargetId": "dd-845baf57-4ddd-4e6c-b316-c1fd9108d06e"
    }
],
```

8.chart 更新支持标题

[chart:grouped_line|心流指标趋势]
| 日期 | 心流满意度FSV | 心流专注值FFV | 心流效能值FEV |
| --- | --- | --- | --- |
| 2025-03-10 | 0.0 | 0.36 | 2.55 |
| 2025-03-11 | 0.0 | 0.41 | 2.22 |
| 2025-03-12 | 0.0 | 0.36 | 2.64 |
| 2025-03-13 | 0.0 | 0.32 | 2.94 |


标题可以通过 | 后加标题内容


9.表格声明表头的背景色

| 功能模块 | 完成度 | 优先级 |[background:{color.primarycontainer.brand0}]
|---------|--------|--------|
| 卡片系统 | 100% | 高 |
| 布局引擎 | 95% | 高 |
| 主题配置 | 88% | 中 |
| 动画效果 | 75% | 中 |
| 响应式设计 | 92% | 高 |

10.minimalist 系列卡片支持

11.组件卡片的 xml 表达（还没有完全支持）

例如：

<simpleCard>
    <itemTitle>安全加密</itemTitle>
    <itemDescription>企业级数据保护</itemDescription>
</simpleCard>


12. styleConfig 新增组件概念（不需要更新给开发者）

