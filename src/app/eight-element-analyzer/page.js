'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { renderEightElementToHtml } from '../utils/eightElement/renderEightElementHtml';
import { convertEightElementToLayout } from '../utils/layoutAnalysis/eightElementAnalysis';
import { markdownToEightElement, applyLayoutControlsToEightElement, analyzeElementsInEightElement, applyActionsToEightElement } from '../utils/eightElement/index';
import { RL_ACTIONS, createActionSystemManager } from '../utils/seeds/rl_action_engines';
import { DEFAULT_STYLE_CONFIG } from '../utils/eightElement/styleConfig';

import VisualSpaceEvaluator from '../components/VisualSpaceEvaluator';
import collectEightElementMeasurements from '../utils/eightElement/collectElementMeasurements.js';
import CrepeMarkdownEditor from '../components/CrepeMarkdownEditor';


// 🆕 Markdown 示例配置
// 扩展说明：要添加新的模板，只需要在下面的 MARKDOWN_TEMPLATES 对象中添加新的条目
// 格式：templateId: { name: '显示名称', description: '描述', markdown: '模板内容' }
// 支持的特殊语法：
// - <layout:row> 水平布局
// - [chart:type] 图表（支持 line, bar, pie, grouped_line, barh 等）
// - **粗体** ~~删除线~~ 等 markdown 格式
// - 数学公式 $inline$ 和 $$block$$
// - 表格、代码块、引用等标准 markdown 语法
/** 图表事件
 * [chart:barh|AI-PC 市场份额][event:chart_changed(barh,bar,pie)]
| 品牌 | 市场份额 | 增长率 |
|------|----------|--------|
| 联想 | 35% | +12% |
| 苹果 | 28% | +8% |
| 荣耀 | 18% | +15% |
 */
const MARKDOWN_TEMPLATES = {
  elegantCardSeries: {
    name: '🌟 优雅卡片系列',
    description: '展示新增的优雅青蓝风格卡片系列：标准、列表、表格三种布局',
    markdown: `# 优雅青蓝卡片系列展示

## 设计特点
[icon:Abstract/ad-product]优雅青蓝卡片系列采用渐变背景、[icon:Base/home]精致装饰和层次化设计，[icon:Base/aiming]提供三种专业的内容展示方式。


[event:download][下载](https://github.com/example/edit)

<card:headerPrecentCard>
   ## 二、市场概述
   AI-PC 概念自 2023 年由英特尔提出后，迅速引发行业关注

   ### 中国市场
   <percentValue color={color.success.green6}>#### 15%</percentValue>
   AI-PC 出货量

   ### 全球市场  
   #### 25%
   AI-PC 渗透率

   ### 未来预测
   #### 40%
   预计增长率
</card:headerPrecentCard>

<card:headerCard background={color.success.green0}>
## 三、头部品牌分析
联想、苹果和荣耀作为 AI-PC 市场的头部品牌，各自凭借独特的产品功能和市场策略在竞争中占据一席之地。以下是联想、苹果和荣耀的销售份额占比。

[chart:barh|AI-PC 市场份额]
| 品牌 | 市场份额 | 增长率 |
|------|----------|--------|
| 联想 | 35% | +12% |
| 苹果 | 28% | +8% |
| 荣耀 | 18% | +15% |

[chart:grouped_line|心流指标趋势]
| 日期 | 心流满意度FSV | 心流专注值FFV | 心流效能值FEV |
| --- | --- | --- | --- |
| 2025-03-10 | 0.0 | 0.36 | 2.55 |
| 2025-03-11 | 0.0 | 0.41 | 2.22 |
| 2025-03-12 | 0.0 | 0.36 | 2.64 |
| 2025-03-13 | 0.0 | 0.32 | 2.94 |

[chart:pie|笔记本市场占比]
| 类型 | 占比 |
|------|------|
| 游戏本 | 40% |
| 轻薄本 | 35% |
| 工作站 | 25% |

</card:headerCard>

<card:headerCard background={color.primarycontainer.brand0}>
## 四、市场图表示例
为了更直观地展示不同图表类型，这里提供柱状图、面积图和环状图的对比示例。

[chart:bar|季度销售额（万元）]
| 季度 | 销售额 |
|------|--------|
| Q1 | 120 |
| Q2 | 180 |
| Q3 | 240 |
| Q4 | 320 |

[chart:area_chart|AI-PC 趋势]
| 时间 | 出货量 | 渗透率 |
|------|--------|--------|
| 2025.04 | 100 | 20 |
| 2025.05 | 160 | 24 |
| 2025.06 | 210 | 28 |

[chart:donut_chart|产品占比]
| 类型 | 占比 |
|------|------|
| 轻薄本 | 45 |
| 游戏本 | 35 |
| 工作站 | 20 |
</card:headerCard>

<layout:bgColumn background={color.onprimary.white100}>

<layout:row>
<card:elegantStandard>
## 标准布局卡片
### 设计理念
优雅青蓝标准布局采用渐变背景和装饰性元素，营造出高端、专业的视觉效果。适用于重要内容展示、产品介绍等场景。

**主要特色：**
- 渐变背景：多层次青蓝色渐变
- 装饰元素：对称的装饰线条和圆点
- 响应式设计：适配各种屏幕尺寸
- 层次清晰：标题和内容区域明确分离

![优雅设计](https://cdn.pixabay.com/photo/2016/05/05/02/37/sunset-1373171_1280.jpg)

这种设计风格特别适合商务场景、品牌展示和高端产品介绍。
[了解更多](https://example.com/elegant)
[secondary][了解更多](https://example.com/elegant)
</card:elegantStandard>

<card:elegantList>
## 关键阻塞问题
### 🚩 高风险项
- 核心模块开发延期（前端组）
- 第三方接口认证失败
- 测试环境资源不足
- 第三方接口认证失败
- 测试环境资源不足

### 🟡 待跟进项
- 需求变更审批中（2个）
- 供应商合同修订
- 需求变更审批中（2个）
- 供应商合同修订
- 需求变更审批中（2个）
- 供应商合同修订
</card:elegantList>
</layout:row>

<layout:row>
<card:elegantStandard>
## 标准布局卡片
### 设计理念
优雅青蓝标准布局采用渐变背景和装饰性元素，营造出高端、专业的视觉效果。适用于重要内容展示、产品介绍等场景。

**主要特色：**
- 渐变背景：多层次青蓝色渐变
- 装饰元素：对称的装饰线条和圆点
- 响应式设计：适配各种屏幕尺寸
- 层次清晰：标题和内容区域明确分离

![优雅设计](https://cdn.pixabay.com/photo/2016/05/05/02/37/sunset-1373171_1280.jpg)

这种设计风格特别适合商务场景、品牌展示和高端产品介绍。
[了解更多](https://example.com/elegant)
[secondary][了解更多](https://example.com/elegant)
</card:elegantStandard>

<card:elegantList>
## 列表布局卡片
### 核心功能
专为列表内容优化的布局，每个列表项都有独特的视觉样式和左侧装饰线。

- ✅ 模块化设计架构
- ✅ 智能内容自适应
- ✅ 多层级信息展示  
- ✅ 统一视觉语言
- ✅ 无障碍访问支持
- ✅ 模块化设计架构
- ✅ 智能内容自适应
- ✅ 多层级信息展示  
- ✅ 统一视觉语言
- ✅ 无障碍访问支持
- ✅ 模块化设计架构
- ✅ 智能内容自适应
- ✅ 多层级信息展示  
- ✅ 统一视觉语言
- ✅ 无障碍访问支持

完美适配功能介绍、特性列表、优势展示等内容组织方式。
</card:elegantList>
</layout:row>
</layout:bgColumn>

<layout:row>

<card:elegantTable>
## 表格布局卡片
### 数据展示
专业的表格数据展示布局，保持优雅青蓝风格的同时确保数据的清晰可读。

| 功能模块 | 完成度 | 优先级 |
|---------|--------|--------|
| 卡片系统 | 100% | 高 |
| 布局引擎 | 95% | 高 |
| 主题配置 | 88% | 中 |
| 动画效果 | 75% | 中 |
| 响应式设计 | 92% | 高 |

这种布局特别适合数据报告、功能对比、进度跟踪等需要表格化展示的内容。
</card:elegantTable>

<card:elegantStandard>
## 混合内容展示
### 综合应用
优雅青蓝标准布局支持各种内容类型的混合展示，包括文本、图片、按钮、代码等。

**代码示例：**
\`\`\`javascript
const a = 1;
\`\`\`


[event:edit][事件编辑](https://github.com/example/edit)
[设计指南](https://example.com/design-guide)
</card:elegantStandard>

</layout:row>


<card:highlight>
## 高亮突出风格
### Highlight & Emphasis
强烈的品牌色对比，让重要信息快速抓住用户注意力

\`\`\`css
.highlight-card {
  background: linear-gradient(brand-color);
  color: white;
  border-radius: 12px;
}
\`\`\`

适用于重要通知、促销活动、核心功能介绍等需要强调的内容
</card:highlight>

[查看源码](https://github.com/example/elegant-cards)

## 使用指南

### 基本语法
\`\`\`markdown
<card:elegantStandard>
## 卡片标题
### 子标题
内容段落支持 **粗体** 和 *斜体* 格式
![图片](url)
[按钮链接](url)
</card:elegantStandard>
\`\`\`

### 列表卡片语法
\`\`\`markdown
<card:elegantList>
## 列表标题
### 子标题
- 列表项1
- 列表项2
- 列表项3
总结段落
</card:elegantList>
\`\`\`

### 表格卡片语法
\`\`\`markdown
<card:elegantTable>
## 表格标题
### 子标题
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 数据1 | 数据2 | 数据3 |
说明文字
</card:elegantTable>
\`\`\`




## 应用场景

<layout:row>
**商务展示**
企业介绍、产品发布、品牌宣传

**数据报告**  
业务指标、项目进度、统计分析

**功能说明**
产品特性、服务介绍、使用教程
</layout:row>

### 设计原则

1. **视觉层次**：通过颜色、大小、间距建立清晰的信息层级
2. **一致性**：所有卡片保持统一的设计语言和视觉风格  
3. **可读性**：确保在各种背景和设备上都有良好的可读性
4. **互动性**：合理使用阴影、渐变等效果提升用户体验

优雅青蓝卡片系列为您的内容提供专业、精致的展示方式。`
  },

  techGradientSeries: {
    name: '🚀 科技渐变系列',
    description: '展示科技渐变风格：标准布局和头部动作两种设计',
    markdown: `# 科技渐变系列展示

## 现代科技美学
科技渐变系列采用现代科技美学设计理念，通过渐变色彩和未来感元素，营造出前沿科技的视觉体验。

<layout:row>
<card:techGradientStandard>
## 科技渐变标准
### 技术创新平台
科技渐变标准布局专为现代技术产品和创新平台设计，融合了未来感的渐变色彩与简洁的信息架构。

**核心特性：**
- 🌈 动态渐变：多层次科技色彩过渡
- 💎 玻璃拟态：现代UI设计趋势
- ⚡ 高性能：优化的渲染和交互
- 🔮 未来感：前沿的视觉设计语言

![科技产品](https://images.unsplash.com/photo-1518709268805-4e9042af2176)

### 应用场景
- 科技产品展示
- 创新项目介绍  
- 数字化解决方案
- 前沿技术说明

**技术栈展示：**
\`\`\`typescript
interface TechStack {
  frontend: 'React' | 'Vue' | 'Angular';
  backend: 'Node.js' | 'Python' | 'Go';
  database: 'PostgreSQL' | 'MongoDB';
  cloud: 'AWS' | 'Azure' | 'GCP';
}
\`\`\`

> "技术的发展永不停歇，我们的创新也永不止步。"

[开始体验](https://example.com/demo)
[secondary][技术文档](https://docs.example.com)
</card:techGradientStandard>

<card:techGradientHeaderActions>
## AI智能平台
[立即试用](https://example.com/try)
[secondary][了解更多](https://example.com/learn)

### 人工智能解决方案
我们的AI智能平台集成了最新的机器学习算法和深度学习技术，为企业提供智能化的数据分析和决策支持。

**平台优势：**
- 🤖 智能算法：先进的AI模型和算法
- 📊 数据洞察：深度数据分析和可视化
- 🔄 自动化：智能流程自动化
- 🛡️ 安全可靠：企业级安全保障

![AI技术](https://images.unsplash.com/photo-1677442136019-21780ecad995)

### 服务模块
- 智能客服机器人
- 预测性分析引擎
- 自然语言处理
- 计算机视觉解决方案
- 推荐系统算法

平台采用云原生架构，支持弹性扩展和高可用部署，满足不同规模企业的需求。
</card:techGradientHeaderActions>
</layout:row>

<layout:row>
<card:techGradientStandard>
## 区块链生态
### 去中心化金融平台
基于区块链技术的去中心化金融平台，提供安全、透明、高效的数字资产管理服务。

**技术特点：**
- ⛓️ 区块链技术：安全可信的分布式账本
- 💰 DeFi协议：去中心化金融协议
- 🔒 智能合约：自动化执行的数字协议
- 🌐 跨链互操作：多链生态支持

| 功能模块 | 状态 | 版本 |
|----------|------|------|
| 数字钱包 | ✅ 已上线 | v2.1 |
| 交易所 | ✅ 已上线 | v1.8 |
| 借贷协议 | 🚧 开发中 | v1.0 |
| 流动性挖矿 | 📋 规划中 | v1.0 |

\`\`\`solidity
contract DeFiProtocol {
    mapping(address => uint256) public balances;
    
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }
}
\`\`\`

> "区块链技术正在重新定义价值交换的方式。"

[连接钱包](https://example.com/wallet)
[secondary][白皮书](https://example.com/whitepaper)
</card:techGradientStandard>

<card:techGradientHeaderActions>
## 云计算服务
[免费试用](https://example.com/free-trial)
[secondary][价格方案](https://example.com/pricing)

### 弹性云基础设施
提供灵活、可扩展的云计算基础设施服务，帮助企业快速构建和部署应用程序。

**服务优势：**
- ☁️ 弹性计算：按需扩展的计算资源
- 💾 数据存储：安全可靠的云端存储
- 🌍 全球部署：覆盖全球的数据中心
- 📈 自动扩缩：智能资源调度

![云计算](https://images.unsplash.com/photo-1544197150-b99a580bb7a8)

### 核心服务
- 弹性计算实例 (ECS)
- 对象存储服务 (OSS)
- 关系型数据库 (RDS)
- 容器服务 (Kubernetes)
- 负载均衡 (ALB)

我们的云平台支持多种编程语言和开发框架，提供完整的DevOps工具链，助力企业数字化转型。
</card:techGradientHeaderActions>
</layout:row>

## 设计理念

### 科技美学
科技渐变系列追求现代科技美学，通过渐变色彩营造未来感，适用于科技产品、创新项目、数字化服务等场景。

### 信息架构
- **标准布局**：适合内容丰富的展示场景，支持多媒体内容
- **头部动作**：突出核心操作，快速引导用户行动

### 应用场景
1. **科技产品**：软件、硬件、平台展示
2. **创新项目**：研发成果、技术方案介绍
3. **数字服务**：云计算、AI、区块链等服务
4. **企业宣传**：技术实力、创新能力展示

科技渐变系列为您的科技产品和创新项目提供专业的视觉呈现。`
  },

  elegantGallery: {
    name: '🎨 优雅卡片画廊',
    description: '使用 layout:gallery 实现不同高度的优雅卡片瀑布流排版效果',
    markdown: `# 优雅卡片画廊展示

## 瀑布流布局美学
优雅卡片画廊采用瀑布流（瀑布流）布局，通过不同高度的卡片内容自动形成美观的瀑布流效果，适合展示多样化的内容。

<layout:gallery>

<card:elegantStandard>
## 设计哲学
### 简约而不简单
优雅设计追求视觉的简洁与功能的完善，通过精心的排版和配色，创造出令人愉悦的用户体验。

**核心理念：**
- 🎯 功能至上：每个元素都有其存在的意义
- 💎 细节完美：精雕细琢每一个视觉细节
- 🌊 自然流动：布局如水流般自然顺畅

[了解更多](https://example.com/philosophy)
</card:elegantStandard>

<card:elegantList>
## 技术特性
### 核心功能清单

- ✅ 响应式瀑布流布局
- ✅ 自适应卡片高度
- ✅ 流畅的视觉过渡
- ✅ 优化的加载性能
- ✅ 无障碍访问支持
- ✅ 跨浏览器兼容性

瀑布流布局让不同内容长度的卡片能够自然地排列，创造出富有韵律感的视觉效果。
</card:elegantList>

<card:elegantStandard>
## 创意灵感
### 来自自然的设计语言
观察自然界中的美妙图案，从叶脉的纹理到水滴的形状，这些都为我们的设计提供了无尽的灵感源泉。

![自然之美](https://images.unsplash.com/photo-1441974231531-c6227db76b6e)

每一个设计元素都经过精心考量，确保它们能够和谐地融合在一起，就像自然界中的万物一样。

**设计原则：**
- 平衡与对称
- 韵律与节奏  
- 对比与统一
- 比例与尺度

> "大自然是最好的艺术家，她的作品永远值得我们学习和模仿。"

[设计案例](https://example.com/cases)
[secondary][设计指南](https://example.com/guide)
</card:elegantStandard>

<card:elegantTable>
## 性能数据
### 优化指标统计

| 性能指标 | 优化前 | 优化后 | 提升率 |
|---------|--------|--------|--------|
| 首屏加载时间 | 3.2s | 1.8s | 44% |
| 瀑布流渲染 | 850ms | 340ms | 60% |
| 内存占用 | 125MB | 78MB | 38% |
| 流畅度评分 | 72 | 94 | 31% |

通过持续的性能优化，我们实现了显著的用户体验提升。
</card:elegantTable>

<card:elegantStandard>
## 用户体验
### 以人为本的设计思维
优秀的用户体验不仅仅是美观的界面，更是对用户需求的深度理解和精准满足。

**体验维度：**
- 🎭 情感化设计：触动用户内心的设计
- ⚡ 响应速度：毫秒级的交互反馈
- 🧭 导航清晰：直观的信息架构
- 🔧 功能完备：满足核心使用场景

我们通过用户调研、A/B测试和数据分析，不断优化产品的每一个细节。

[用户反馈](https://example.com/feedback)
</card:elegantStandard>

<card:elegantList>
## 应用场景
### 多样化展示需求

- ✅ 作品集展示：设计师、摄影师、艺术家
- ✅ 新闻资讯：媒体网站、博客平台
- ✅ 电商产品：商品展示、购物平台
- ✅ 社交媒体：动态时间线、图片分享
- ✅ 企业官网：案例展示、团队介绍
- ✅ 教育平台：课程列表、知识卡片
- ✅ 旅游网站：景点介绍、游记分享

瀑布流布局特别适合内容长度不一致的场景，能够最大化利用屏幕空间。
</card:elegantList>

<card:elegantStandard>
## 技术实现
### 瀑布流核心算法
瀑布流布局采用CSS的多列布局（Multi-column Layout）技术实现，通过智能的高度计算和动态排列，确保视觉效果的最优化。

**关键技术：**
\`\`\`css
.gallery-container {
  column-count: 2;
  column-gap: 15px;
  column-fill: balance;
}

.gallery-item {
  break-inside: avoid;
  margin-bottom: 15px;
}
\`\`\`

**算法特点：**
- 自动平衡列高度
- 避免内容断裂  
- 响应式列数调整
- 流畅的重排动画

[技术文档](https://example.com/docs)
[secondary][开源代码](https://github.com/example/gallery)
</card:elegantStandard>

<card:elegantTable>
## 浏览器兼容性
### 现代浏览器支持情况

| 浏览器 | 桌面版本 | 移动版本 | 支持状态 |
|--------|----------|----------|----------|
| Chrome | 80+ | 80+ | ✅ 完全支持 |
| Firefox | 75+ | 75+ | ✅ 完全支持 |
| Safari | 13+ | 13+ | ✅ 完全支持 |
| Edge | 80+ | 80+ | ✅ 完全支持 |

瀑布流布局在现代浏览器中有着优异的兼容性表现。
</card:elegantTable>

<card:elegantStandard>
## 设计趋势
### 2024年UI设计展望
瀑布流布局作为一种经典的设计模式，在移动优先的时代焕发出新的活力。结合现代设计趋势，我们看到了更多创新的可能性。

**趋势要点：**
- 🌸 新拟物主义：柔和的阴影和渐变
- 🎨 大胆配色：高饱和度的色彩搭配  
- 📱 移动优先：专为触屏设备优化
- 🤖 AI辅助：智能内容推荐和排版

![设计趋势](https://images.unsplash.com/photo-1561070791-2526d30994b5)

> "设计不是装饰，而是沟通。好的设计能够跨越语言和文化的障碍，直达人心。"

[趋势报告](https://example.com/trends)
</card:elegantStandard>

<card:elegantList>
## 优化建议
### 瀑布流性能提升策略

- ✅ 虚拟滚动：仅渲染可视区域内容
- ✅ 图片懒加载：按需加载图片资源
- ✅ 内容预加载：智能预测用户行为
- ✅ 缓存策略：合理利用浏览器缓存
- ✅ CDN加速：全球分发提升速度
- ✅ 压缩优化：减少资源文件大小
- ✅ 骨架屏：提升感知加载速度

性能优化是用户体验的基石，每一毫秒的提升都有意义。
</card:elegantList>

<card:elegantStandard>
## 案例分析
### 成功的瀑布流应用
Pinterest作为瀑布流布局的典型代表，通过这种布局方式重新定义了图片分享的用户体验，成为了设计界的经典案例。

**成功要素：**
- 内容为王：优质的图片内容
- 算法推荐：个性化的内容推送
- 社交互动：点赞、收藏、分享功能
- 响应设计：适配不同设备尺寸

通过深入分析成功案例，我们可以提取出可复用的设计模式和最佳实践。

[案例详情](https://example.com/case-study)
[secondary][设计分析](https://example.com/analysis)
</card:elegantStandard>

</layout:gallery>

## 画廊布局特性

### 自适应瀑布流
采用CSS多列布局实现的瀑布流效果，卡片会根据内容高度自动排列，形成美观的瀑布流视觉效果。

### 响应式设计
- **桌面端**：2列布局，15px列间距
- **平板端**：自动调整为最佳列数
- **移动端**：单列布局，保持可读性

### 应用优势

1. **空间利用率高**：最大化利用屏幕空间
2. **视觉效果佳**：不同高度创造丰富的视觉层次
3. **浏览体验好**：自然的阅读流动感
4. **内容适应性强**：适合各种长度的内容展示

这种布局特别适合展示不同长度的内容卡片，如作品集、新闻列表、产品展示等场景。`
  },

  landing: {
    name: '🏢 企业官网',
    description: '企业着陆页，包含导航、特性介绍、联系方式',
    markdown: `<layout:row>
[首页](/)
[产品](/products)
[解决方案](/solutions)
[关于我们](/about)
[联系我们](/contact)
</layout:row>

![企业Logo](https://images.unsplash.com/photo-1560472354-b33ff0c44a43)

## 创新科技，引领未来
<layout:row>
<icon:small>send</icon:small>
我们致力于为企业提供最先进的数字化解决方案，助力业务增长和数字化转型。
</layout:row>
<layout:row>
[免费试用](https://example.com/trial)
[了解更多](https://example.com/learn)
[观看演示](https://example.com/demo)
</layout:row>

<layout:row>
<card>
### 产品特性
我们的产品具有强大的功能和优异的性能，满足各种业务需求

- ✅ 模块化设计，灵活配置 
- ✅ 实时数据处理能力
- ✅ 智能化推荐算法
- ✅ 多端同步支持

[查看功能详情](https://example.com/features)
</card>
<card>

### 技术优势
采用最新的技术架构，确保系统的稳定性和可扩展性

- 🔧 微服务架构
- 🔧 容器化部署
- 🔧 分布式缓存
- 🔧 负载均衡

[技术白皮书](https://example.com/tech)
</card>

</layout:row>

<card:custom>
## MOST POPULAR
### Profesional
Best for growing startups and growth companies
Best for growing startups and growth companies
</card:custom>


### 核心优势

<layout:row>
**🚀 高性能**
优化的架构设计，提供毫秒级响应

**🔒 安全可靠**
银行级安全保障，数据加密传输
</layout:row>

<layout:row>
**📈 智能分析**
AI驱动的数据分析，洞察业务趋势

**🛠️ 易于集成**
RESTful API，快速集成现有系统
</layout:row>

<layout:row>
### 服务支持
7x24小时专业技术支持，快速响应客户需求

- 📞 **热线支持**: 400-800-1234
- 💬 **在线客服**: 实时响应
- 📧 **邮件支持**: 技术工单系统
- 🎓 **培训服务**: 产品使用培训

<layout:row>
[联系客服](https://example.com/support)
[提交工单](https://example.com/ticket)
</layout:row>

### 质量保证
严格的质量管控体系，确保产品交付质量

> **质量承诺**: 99.9% 服务可用性保障

1. **代码审查**: 多重代码质量检查
2. **自动化测试**: 持续集成测试流程
3. **性能监控**: 实时系统性能监控
4. **安全扫描**: 定期安全漏洞扫描

[质量报告](https://example.com/quality)
</layout:row>

### 客户案例

> "使用该解决方案后，我们的工作效率提升了300%，强烈推荐！" —— 某科技公司CEO

<layout:row>
### 行业经验
深耕行业10年，服务超过1000家企业客户

**成功案例分布:**
- 🏦 金融行业: 150+ 客户
- 🛒 电商平台: 230+ 客户  
- 🎓 教育机构: 89+ 客户
- 🏥 医疗健康: 67+ 客户

<layout:row>
[查看案例](https://example.com/cases)
[客户推荐](https://example.com/testimonials)
</layout:row>

### 团队实力
拥有资深技术团队，平均从业经验8年以上

**团队构成:**

| 角色 | 人数 | 经验 |
| --- | --- | --- |
| 架构师 | 8人 | 10+ 年 |
| 开发工程师 | 32人 | 5+ 年 |
| 测试工程师 | 12人 | 4+ 年 |
| 产品经理 | 6人 | 6+ 年 |

[团队介绍](https://example.com/team)
</layout:row>

### 服务覆盖

[chart:pie]| 行业 | 客户数 |
| --- | --- |
| 金融 | 150 |
| 电商 | 230 |
| 教育 | 89 |
| 医疗 | 67 |
| 制造 | 145 |

<layout:row>
### 全球部署
支持多云部署，覆盖全球主要区域

**部署方案:**
- ☁️ AWS: 美国、欧洲、亚太
- 🌐 Azure: 全球20+区域
- 🚀 阿里云: 中国大陆主要城市
- 🔧 私有云: 定制化部署

> **性能保障**: 全球延迟 < 100ms

[部署指南](https://example.com/deploy)

### 合规认证
通过ISO27001、SOC2等多项安全认证

**认证列表:**

1. ✓ **ISO 27001**: 信息安全管理
2. ✓ **SOC 2 Type II**: 安全控制审计
3. ✓ **GDPR**: 欧盟数据保护
4. ✓ **PCI DSS**: 支付卡行业标准

<layout:row>
[查看证书](https://example.com/certificates)
[合规文档](https://example.com/compliance)
</layout:row>
</layout:row>

### 价格方案

| 套餐 | 价格 | 功能 | 用户数 |
| --- | --- | --- | --- |
| 基础版 | ¥99/月 | 基础功能 | 10人 |
| 专业版 | ¥299/月 | 高级功能 | 50人 |
| 企业版 | 联系销售 | 全部功能 | 无限制 |

<layout:row>
[立即注册](https://example.com/signup)
[联系销售](https://example.com/sales)
[技术支持](https://example.com/support)
</layout:row>

<layout:row>
### 业务咨询
专业的业务顾问为您提供定制化解决方案

**咨询流程:**

1. 📋 **需求调研**: 深入了解业务场景
2. 📊 **方案设计**: 制定最佳技术方案  
3. 💰 **成本评估**: 详细项目预算分析
4. 📝 **方案交付**: 完整解决方案文档

**专业领域:**
- 数字化转型咨询
- 系统架构设计
- 业务流程优化

[预约咨询](https://example.com/consult)

### 实施服务
完整的项目实施流程，确保顺利上线

**实施阶段:**

| 阶段 | 周期 | 交付物 |
| --- | --- | --- |
| 环境搭建 | 1-2周 | 测试环境 |
| 系统集成 | 2-4周 | 集成方案 |
| 数据迁移 | 1-3周 | 迁移报告 |
| 上线部署 | 1周 | 生产环境 |

> **服务承诺**: 7×24小时项目支持，确保按期交付

<layout:row>
[实施流程](https://example.com/implementation)
[项目管理](https://example.com/pm)
</layout:row>
</layout:row>

### 联系我们

<layout:row>
**📞 电话**: 400-123-4567
**📧 邮箱**: hello@company.com
**📍 地址**: 北京市朝阳区科技园
</layout:row>`
  },
  // <layout:root backgroundImage="url(https://cdn.pixabay.com/photo/2016/05/05/02/37/sunset-1373171_1280.jpg)">
  article: {
    name: '📖 技术文档',
    description: '原始的技术文档风格，包含各种元素类型',
    markdown: `
<layout:root backgroundImage="url(https://cdn.pixabay.com/photo/2016/05/05/02/37/sunset-1373171_1280.jpg)">
# 八要素测试文档

## 基本元素
<layout:row>
### 左侧标题

#### 四级标题
四级标题正文四级标题正文四级标题正文四级标题正文四级标题正文四级标题正文

##### 五级标题
五级标题正文五级标题正文五级标题正文五级标题正文五级标题正文五级标题正文

###### 六级标题
六级标题正文六级标题正文六级标题正文六级标题正文六级标题正文六级标题正文

### 右侧标题

#### 四级标题
四级标题正文四级标题正文四级标题正文四级标题正文四级标题正文四级标题正文

##### 五级标题
五级标题正文五级标题正文五级标题正文五级标题正文五级标题正文五级标题正文

###### 六级标题
六级标题正文六级标题正文六级标题正文六级标题正文六级标题正文六级标题正文

</layout:row>

> 这是一段引用文本，展示重要的观点或引述

### 按钮（超链接）
<layout:row>
[primary][主要按钮](https://example.com)
[secondary][次要按钮](https://example.com)
[success][成功按钮](https://example.com)
[warning][警告按钮](https://example.com)
[error][错误按钮](https://example.com)
[ghost][幽灵按钮](https://example.com)
[link][链接按钮](https://example.com)
</layout:row>

### 示例图片
![示例图片](https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg)

### 代码块示例
下面是一个JavaScript代码示例：

\`\`\`javascript
function greeting(name) {
  return \`Hello, \${name}!\`;
}

// 调用函数
const message = greeting('World');
console.log(message);  // 输出: Hello, World!
\`\`\`

### 数学公式示例
行内公式：$E = mc^2$

块级公式：
$$ \\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi} $$

我们还可以有更复杂的公式，例如：
$$ L = \\frac{1}{2} \\rho v^2 S C_L $$

这是一个关于升力的公式。行内也可以混合：例如 $\\alpha + \\beta = \\gamma$。

### 表格示例
下面是一个简单的表格示例：

| 功能 | 描述 | 支持状态 |
| --- | --- | :---: |
| 文本 | 支持普通文本和标题 | ✅ |
| 按钮 | 支持超链接按钮 | ✅ |
| 图片 | 支持图片显示 | ✅ |
| 表格 | 支持表格渲染和样式 | ✅ |
| 代码块 | 支持代码高亮显示 | ✅ |
| 图表 | 支持数据可视化图表 | ✅ |
| 混合内容 | 支持在一行中文本 | ✅ |
| 数学公式 | 支持行内和块级公式 | ✅ |

### 图表示例
下面是一个分组折线图示例：

[chart:grouped_line]| 日期 | 心流满意度FSV | 心流专注值FFV | 心流效能值FEV |
| --- | --- | --- | --- |
| 2025-03-10 | 0.0 | 0.36 | 2.55 |
| 2025-03-11 | 0.0 | 0.41 | 2.22 |
| 2025-03-12 | 0.0 | 0.36 | 2.64 |
| 2025-03-13 | 0.0 | 0.32 | 2.94 |
| 2025-03-14 | 0.0 | 0.48 | 1.87 |
| 2025-03-17 | 0.0 | 0.42 | 2.16 |
| 2025-03-18 | 0.0 | 0.41 | 2.28 |
| 2025-03-19 | 0.0 | 0.31 | 2.97 |
| 2025-03-20 | 0.0 | 0.41 | 2.18 |
| 2025-03-21 | 0.0 | 0.56 | 1.52 |
| 2025-03-24 | 0.0 | 0.34 | 2.67 |
| 2025-03-25 | 0.0 | 0.61 | 1.52 |
| 2025-03-26 | 0.0 | 0.51 | 1.85 |
| 2025-03-27 | 0.0 | 0.29 | 3.25 |
| 2025-03-28 | 0.0 | 0.5 | 1.92 |
| 2025-03-31 | 0.0 | 0.32 | 3.02 |
| 2025-04-01 | 0.0 | 0.35 | 2.74 |
| 2025-04-02 | 0.0 | 0.54 | 1.72 |
| 2025-04-03 | 0.0 | 0.48 | 1.98 |

下面是一个水平柱状图示例：

[chart:barh]| 部门 | 销售额 |
| --- | --- |
| 销售部 | 1250 |
| 市场部 | 980 |
| 技术部 | 750 |
| 客服部 | 620 |
| 行政部 | 450 |

### 指标定义
- **FSV** (FSV = 用户满意度评分 / 每日心流空间交互次数): 衡量美学交互的心流满意度，数值越高表示每次交互带来的用户满意度越高。
- **FFV** (FFV = 每日心流空间服务总时长 / 每日心流空间交互次数): 衡量意图协同的心流专注值，数值越高表示用户在每次互动时保持的专注度越长。
- **FEV** (FEV = 每日心流空间服务总次数 / 每日心流空间总时长): 衡量效能跃迁的心流效能值，数值越高表示服务使用效率越高。

1. **高斯定律（Integral Form）**  
   - 磁场的通量：  
     $$ \\oint \\mathbf{B} \\cdot d\\mathbf{l} = \\frac{Q_{enc}}{\\varepsilon_0} $$

2. **法拉第电磁感应定律（Integral Form）**  
   - 电场的旋度等于变化磁场：  
     $$ \\nabla \\times \\mathbf{E} = -\\frac{\\partial \\mathbf{B}}{\\partial t} $$

3. **安培- Maxwell 恒等式（Integral Form）**  
   - 磁通量的变化：  
     $$ \\oint \\mathbf{B} \\cdot d\\mathbf{l} = \\mu_0 I_{enc} + \\mu_0 \\varepsilon_0 \\frac{\\partial \\Phi_E}{\\partial t} $$

4. **高斯率（Divergence Form）**  
   - 电场的散度等于电荷密度：  
     $$ \\nabla \\cdot \\mathbf{E} = \\rho_{enc} / \\varepsilon_0 $$

5. **高斯率（Ampère 法则）**  
   - 磁感应线的旋度等于电流密度加上变化磁场：  
     $$ \\nabla \\times \\mathbf{B} = \\mu_0 I_{enc} + \\mu_0 \\varepsilon_0 \\frac{\\partial \\mathbf{B}}{\\partial t} $$

6. **高斯率（Divergence Form）**  
   - 位移场的散度等于自由电荷密度：  
     $$ \\nabla \\cdot \\mathbf{D} = \\rho_{free} $$

7. **高斯率（Divergence Form）**  
   - 磁通密度的散度等于变化磁场：  
     $$ \\nabla \\cdot \\mathbf{B} = 0 $$

8. **高斯率（Integral Form）**  
   - 电场的环流量等于包围的净电荷量：  
     $$ \\oint \\mathbf{E} \\cdot d\\mathbf{l} = 4\\pi k_e Q_{enc} $$
</layout:root>
`
  },
  jd: {
    name: '🧑‍💼招聘',
    description: '招聘页面风格',
    markdown: `
    <card:techGradientHeaderActions>
## 算法工程师招聘JD
[secondary][联系我们](https://example.com/elegant)
[在线申请](https://example.com/elegant)
</card:techGradientHeaderActions>
<layout:row>
<card:elegantTable>
## 职位详情
| 条目 | 详情 | 
|---------|--------|
| **薪资范围** | 200K - 300K  |
| **工作地点** | 北京 | 
| **招聘人数** | 5人 | 
| **工作类型** | 全职 |
更多岗位可以关注公司招聘官方链接。
</card:elegantTable>
<card:elegantList>
## 公司简介
- ✅ 我们是一家专注于人工智能和大数据领域的创新科技公司
- ✅ 我们拥有一支充满活力和创新精神的技术团队
- ✅ 我们拥有一支充满活力和创新精神的技术团队 
- ✅ 我们拥有一支充满活力和创新精神的技术团队
致力于提供最先进的数字化解决方案。
</card:elegantList>
<card:elegantStandard>
## 公司简介
### 关于企业
我们是一家专注于人工智能和大数据领域的创新科技公司。
![优雅设计](https://cdn.pixabay.com/photo/2016/05/05/02/37/sunset-1373171_1280.jpg)
**关于团队**
我们拥有一支充满活力和创新精神的技术团队。我们拥有一支充满活力和创新精神的技术团队。

</card:elegantStandard>
</layout:row>

<card:neomorphismStandard>
### 加入我们
成为我们团队的一员，你将有机会参与前沿技术研究，与优秀团队一起成长，共同打造行业领先的解决方案。如果你对算法充满热情，渴望挑战，欢迎加入我们！
### 应聘方式
[官网在线申请](https://example.com/apply)
[公众号后台申请](https://example.com/about)
[发送邮件申请](https://example.com/contact)
</card:neomorphismStandard>
    `
  },

  tabTest: {
    name: '🔖 选项卡测试',
    description: '测试新增的选项卡元件功能，包含多种内容类型',
    markdown: `# 选项卡功能测试

## 企业数据分析平台

<tab bindingData="mainTabs" defaultTabKey="analysis">
    <tabPanel tabKey="analysis" tabTitle="数据分析">
        <card:elegantTable>
## 销售数据表格
### 季度业绩统计
专业的数据展示，清晰展现各项指标的完成情况。

| 季度 | 销售额(万) | 增长率 | 目标完成度 |
|------|-----------|--------|-----------|
| Q1 | 1250 | +12% | 104% |
| Q2 | 1680 | +18% | 112% |
| Q3 | 1920 | +15% | 108% |
| Q4 | 2150 | +20% | 115% |

数据显示整体呈现良好的增长趋势。
        </card:elegantTable>

        <layout:row>
            <card:elegantStandard>
## 关键指标
### 核心业务数据
- 📈 月活用户增长: **25%**
- 💰 营收同比增长: **32%**
- 🎯 客户满意度: **4.8/5**
- ⚡ 系统响应时间: **<100ms**

[查看详细报告](https://example.com/report)
            </card:elegantStandard>

            <card:elegantList>
## 优化建议
### 改进方向
- ✅ 提升用户体验设计
- ✅ 优化数据处理性能
- ✅ 扩展移动端功能
- ✅ 增强安全防护机制
- ✅ 完善客服支持体系

持续优化以保持竞争优势。
            </card:elegantList>
        </layout:row>
    </tabPanel>
    
    <tabPanel tabKey="trends" tabTitle="趋势预测">
        ## 市场趋势分析
        
        基于当前数据和行业发展，我们对未来市场趋势做出以下预测：

        ### 技术发展方向
        - 🤖 **人工智能集成**: AI技术将更深度融入产品
        - 🌐 **云原生架构**: 全面拥抱云计算和微服务
        - 📱 **移动优先**: 移动端体验将成为核心竞争力
        - 🔐 **隐私保护**: 数据安全和用户隐私保护加强

        [chart:line|趋势预测图]
        | 月份 | AI集成度 | 云化程度 | 移动占比 |
        |------|----------|----------|----------|
        | 1月 | 15 | 45 | 60 |
        | 2月 | 22 | 52 | 65 |
        | 3月 | 28 | 58 | 68 |
        | 4月 | 35 | 65 | 72 |
        | 5月 | 42 | 70 | 75 |
        | 6月 | 48 | 75 | 78 |

        > **预测结论**: 人工智能集成度将快速提升，云化和移动化趋势明显

        ### 投资建议
        1. **加大AI研发投入**: 建议增加30%的AI相关预算
        2. **云基础设施升级**: 优先考虑多云和混合云策略
        3. **移动端优化**: 重点提升移动端用户体验
        4. **人才储备**: 招聘更多AI和云计算专业人才

        [了解详细策略](https://example.com/strategy)
        [secondary][下载报告](https://example.com/download)
    </tabPanel>
    
    <tabPanel tabKey="settings" tabTitle="系统设置">
        <card:techGradientStandard>
## 平台配置管理
### 系统参数设置
这里可以配置平台的各项参数和功能开关。

**核心配置项:**
- 🔧 数据刷新频率: 实时/每分钟/每小时
- 📊 图表默认类型: 柱状图/折线图/饼图
- 🎨 界面主题: 浅色/深色/自动
- 🔔 通知设置: 邮件/短信/站内信

![系统架构](https://images.unsplash.com/photo-1518709268805-4e9042af2176)

### 用户权限管理
- **管理员**: 全部权限，可配置系统参数
- **分析师**: 查看和分析数据权限  
- **普通用户**: 基础查看权限
- **访客**: 仅能查看公开数据

\`\`\`javascript
// 权限配置示例
const userRoles = {
  admin: ['read', 'write', 'config', 'manage'],
  analyst: ['read', 'analyze', 'export'],
  user: ['read', 'basic_export'],
  guest: ['read_public']
};
\`\`\`

[保存设置](https://example.com/save)
[secondary][重置默认](https://example.com/reset)
        </card:techGradientStandard>

        <card:elegantList>
## 系统状态监控
### 实时运行状态
- ✅ 数据库连接: 正常
- ✅ API服务: 运行中
- ✅ 缓存系统: 正常
- ⚠️ 备份服务: 待更新
- ✅ 监控告警: 正常
- ✅ 负载均衡: 正常

系统整体运行状态良好，建议及时更新备份服务。
        </card:elegantList>
    </tabPanel>
</tab>

## 功能特性说明

### 选项卡组件优势
- 🎯 **内容组织**: 有效组织大量信息，提升用户体验
- 🎨 **美观设计**: 采用优雅青蓝风格，视觉效果佳
- ⚡ **交互流畅**: 快速切换，无刷新加载
- 📱 **响应式**: 适配各种屏幕尺寸

### 支持的内容类型
本选项卡组件支持所有标准 markdown 内容：

<layout:row>
**文本内容**
标题、段落、列表等

**数据展示**  
表格、图表、统计数据

**交互元素**
按钮、链接、表单

**媒体内容**
图片、视频、代码块
</layout:row>

> 💡 **提示**: 选项卡内可以嵌套任何八要素支持的内容，包括卡片、布局、图表等。

### 技术实现
- 基于八要素架构实现
- 支持数据绑定和状态管理
- 条件样式和显示控制
- 完整的事件系统支持

[查看技术文档](https://example.com/docs)
[secondary][源码示例](https://github.com/example/tab-component)`
  },
  minimalistCardSeries: {
    name: "简约卡片系列",
    description: "测试新增的简约卡片系列",
    markdown: `
    <card:minimalistBorderLessCard>
    ### 招聘JD
    ## 算法工程师
    负责核心算法模型的设计、优化与落地，推动产品智能化升级。需要具备扎实数学功底和工程实现能力，能将理论转化为业务价值。
    </card:minimalistBorderLessCard>
    <card:minimalistListCard>
    ## 职位详情

    ### 薪资范围
    #### 1.6K-1.8K

    ### 工作地点
    #### 北京

    ### 招聘人数
    #### 5人

    ### 各种类型
    #### 全职

    更多岗位可以关注公司招聘官方链接
    </card:minimalistListCard> 
    <card:minimalistButtonCard>
    ## 加入我们
    成为我们图队的一员，你将有机会参与前沿技术研究，与优秀团队一起成长，共同打造行业领先的解决方案。如果你对算法充满热情，渴望挑战，欢迎加入我们！
    ## 应聘方式
    [官网在线申请](https://example.com/apply)
    [公众号后台申请](https://example.com/about)
    [发送邮件申请](https://example.com/contact)
    </card:minimalistButtonCard>
    `
  }
};

const EightElementAnalyzer = () => {
  // 🆕 新增模板相关状态
  const [currentTemplate, setCurrentTemplate] = useState('elegantCardSeries');
  const [markdown, setMarkdown] = useState(MARKDOWN_TEMPLATES.elegantCardSeries.markdown);
  // 动作系统状态
  const [actionManager, setActionManager] = useState(null);
  const [selectedActions, setSelectedActions] = useState([]); // 已选择的动作
  const [actionIntensities, setActionIntensities] = useState({}); // 动作强度
  const [actionInputMode, setActionInputMode] = useState('categories'); // 'categories' 或 'list'
  const [availableActions, setAvailableActions] = useState(Object.keys(RL_ACTIONS));

  // 页面元件分析状态
  const [pageElements, setPageElements] = useState([]); // 当前页面包含的所有元件 [{type, variant, count, elements}]
  const [affectedElements, setAffectedElements] = useState([]); // 当前动作会影响的元件列表
  const [isElementsCollapsed, setIsElementsCollapsed] = useState(false); // 页面元件分析折叠状态
  const [isAffectedCollapsed, setIsAffectedCollapsed] = useState(false); // 动作影响范围折叠状态

  // 🆕 布局调控状态 - 改为基于索引
  const [layoutAnalysis, setLayoutAnalysis] = useState([]); // 可调控的布局列表
  const [layoutControls, setLayoutControls] = useState({}); // 布局调控设置 {layoutIndex: intensity}
  const [isLayoutControlsCollapsed, setIsLayoutControlsCollapsed] = useState(false); // 布局调控折叠状态
  const [eightElement, setEightElement] = useState(null);
  const [processedEightElement, setProcessedEightElement] = useState(null);
  const [renderedHtml, setRenderedHtml] = useState('');
  const [domMeasurements, setDomMeasurements] = useState(null);
  const [scoreResult, setScoreResult] = useState(null);
  const [visibleTab, setVisibleTab] = useState('html'); // 'html', 'json', 'score'
  const iframeRef = useRef(null);
  const [layout, setLayout] = useState(null);
  const [iframeKey, setIframeKey] = useState(0);  // 添加 iframe key 状态
  const [copySuccess, setCopySuccess] = useState(false); // 复制成功状态

  // 🆕 编辑器相关状态
  const [isEditMode, setIsEditMode] = useState(false); // 是否处于编辑模式
  const [editingMarkdown, setEditingMarkdown] = useState(''); // 正在编辑的markdown
  const [currentEventTargetId, setCurrentEventTargetId] = useState(''); // 当前编辑的事件ID

  // 先定义commonDimensions
  const commonDimensions = [
    { name: '桌面 (1920x1080)', width: 1920, height: 1080 },
    { name: '笔记本 (1440x900)', width: 1440, height: 900 },
    { name: '平板 (1024x768)', width: 1024, height: 768 },
    { name: '手机 (375x667)', width: 375, height: 667 }
  ];

  // 然后使用commonDimensions中的值初始化dimensions
  const [dimensions, setDimensions] = useState({
    width: commonDimensions[2].width,  // 使用平板尺寸作为默认值
    height: commonDimensions[2].height
  });

  // 面板布局状态
  const [panelSizes, setPanelSizes] = useState({
    leftWidth: 50, // 左侧面板宽度百分比
    topHeight: 70  // 上半部分高度百分比
  });

  // 拖拽调整大小的状态
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState('');
  const [resizeStartPos, setResizeStartPos] = useState({ x: 0, y: 0 });
  const [resizeStartSize, setResizeStartSize] = useState({ leftWidth: 0, topHeight: 0 });

  // 初始化动作系统
  useEffect(() => {
    try {
      // 使用ActionSystemManager，它会自动从styleConfig中提取基准token
      const manager = createActionSystemManager(DEFAULT_STYLE_CONFIG);
      setActionManager(manager);

      console.log('动作系统管理器初始化完成');
      console.log('可用动作数量:', manager.getAvailableActions().length);
    } catch (error) {
      console.error('动作系统初始化失败:', error);
    }
  }, []);

  // 计算当前动作会影响的元件
  const calculateAffectedElements = (selectedActionsList, pageElementsList) => {
    if (!actionManager || selectedActionsList.length === 0 || pageElementsList.length === 0) {
      setAffectedElements([]);
      return [];
    }

    const affected = [];

    // 对每种元件类型和形态，检查是否会被当前动作影响
    for (const pageElement of pageElementsList) {
      const { type, variant, count, elements, sampleContent } = pageElement;

      try {
        // 获取该元件的基准tokens和元数据
        const { baseTokens, metadata } = actionManager.getBaseTokens(type, variant);

        if (metadata._configFound) {
          // 检查任一选中的动作是否会影响该元件的tokens
          const willBeAffected = selectedActionsList.some(actionName => {
            const actionInfo = actionManager.getActionInfo(actionName);
            if (!actionInfo) return false;

            // 🔧 新增：首先检查动作是否适用于该元件类型和变体
            if (actionInfo.applicableToElements && Array.isArray(actionInfo.applicableToElements)) {
              const isApplicable = actionInfo.applicableToElements.some(target => {
                // 支持两种格式：
                // 1. 简单格式：'layout' （对所有 layout 变体有效）
                // 2. 精细格式：'layout.root' （只对特定变体有效）
                if (target.includes('.')) {
                  // 精细格式：检查完整的 type.variant
                  const [targetType, targetVariant] = target.split('.');
                  return targetType === type && targetVariant === variant;
                } else {
                  // 简单格式：只检查 type
                  return target === type;
                }
              });

              if (!isApplicable) {
                console.log(`⚪ 动作 ${actionName} 不适用于元件 ${type}.${variant}`);
                return false;
              }
            }

            // 检查动作影响的CSS属性是否在该元件的基准tokens中
            const affectedProperties = Object.keys(baseTokens).filter(prop => !prop.startsWith('_'));

            // 🔧 改进的检测逻辑：基于动作的styleMapping检测实际影响的属性
            if (actionInfo.styleMapping) {
              // 获取动作实际会影响的CSS属性
              const actionTargetProperties = Object.keys(actionInfo.styleMapping);

              // 🔍 调试日志：显示动作目标属性和元件属性的匹配情况
              const hasMatch = actionTargetProperties.some(targetProp => {
                const matches = affectedProperties.includes(targetProp);
                if (matches) {
                  console.log(`✅ 动作 ${actionName} 的属性 ${targetProp} 匹配元件 ${type}.${variant}`);
                }
                return matches;
              });

              if (!hasMatch) {
                console.log(`⚪ 动作 ${actionName} 目标属性 [${actionTargetProperties.join(', ')}] 与元件 ${type}.${variant} 属性 [${affectedProperties.join(', ')}] 无匹配`);
              }

              return hasMatch;
            }

            // 🔧 兼容性回退：更完整的启发式判断
            return affectedProperties.some(prop => {
              return (
                // 圆润度相关动作
                (actionName.includes('Roundness') && prop.includes('border')) ||
                // 轮廓相关动作  
                (actionName.includes('Outline') && (prop.includes('border') || prop.includes('Border'))) ||
                // 字体相关动作
                (actionName.includes('Font') && prop.includes('font')) ||
                // 颜色相关动作
                (actionName.includes('Color') && prop.includes('color')) ||
                // 阴影相关动作
                (actionName.includes('Shadow') && prop.includes('shadow')) ||
                // 间距相关动作
                (actionName.includes('Spacing') && (prop.includes('padding') || prop.includes('margin'))) ||
                // 尺寸相关动作
                (actionName.includes('Size') && prop.includes('font')) ||
                // 张力相关动作
                (actionName.includes('Tension') && (prop.includes('border') || prop.includes('gap'))) ||
                // 密度相关动作
                (actionName.includes('Density') && (prop.includes('font') || prop.includes('padding'))) ||
                // 强度相关动作
                (actionName.includes('Strength') && (prop.includes('font') || prop.includes('color'))) ||
                // 透明度相关动作
                (actionName.includes('Transparency') && (prop.includes('background') || prop.includes('opacity'))) ||
                // 纹理相关动作
                (actionName.includes('Texture') && prop.includes('background')) ||
                // 状态相关动作
                (actionName.includes('State') && (prop.includes('color') || prop.includes('background')))
              );
            });
          });

          if (willBeAffected) {
            affected.push({
              type,
              variant,
              count,
              elements,
              sampleContent,
              tokenCount: Object.keys(baseTokens).filter(k => !k.startsWith('_')).length
            });
          }
        }
      } catch (error) {
        console.warn(`无法分析元件 ${type}.${variant}:`, error);
      }
    }

    setAffectedElements(affected);
    console.log('🎯 受影响的元件:', affected);

    return affected;
  };

  // 🔧 处理markdown变化和模板切换
  useEffect(() => {
    if (markdown) {
      // 🆕 模板切换时自动处理markdown
      const timer = setTimeout(() => {
        processMarkdown(null, {});
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [markdown, currentTemplate]);

  // 处理iframe加载完成后的测量
  useEffect(() => {
    if (renderedHtml && iframeRef.current) {
      const timer = setTimeout(() => {
        // 检查iframe是否已经完全加载
        const iframe = iframeRef.current;
        if (iframe && iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
          measureIframeContent();
        } else {
          // 如果还没加载完成，等待iframe加载事件
          const handleIframeLoad = () => {
            measureIframeContent();
            iframe.removeEventListener('load', handleIframeLoad);
          };
          if (iframe) {
            iframe.addEventListener('load', handleIframeLoad);
          }
        }
        // 确保测量完成后再次更新 key
        setIframeKey(prev => prev + 1);
      }, 200); // 增加等待时间，确保渲染完成
      return () => clearTimeout(timer);
    }
  }, [renderedHtml]);

  // 🆕 监听iframe中的编辑事件和图表切换事件
  useEffect(() => {
    const handleMessage = async (event) => {
      if (event.data && event.data.type === 'EDIT_EVENT') {
        console.log('🎯 收到iframe编辑事件:', event.data);

        // 切换到编辑模式
        setIsEditMode(true);
        setEditingMarkdown(event.data.markdown);
        setCurrentEventTargetId(event.data.eventTargetId);

        // 确保切换到HTML预览标签页
        setVisibleTab('html');
      }

      // 🆕 处理图表切换事件
      if (event.data && event.data.type === 'CHART_CHANGED_EVENT') {
        console.log('📊 收到iframe图表切换事件:', event.data);

        // 获取图表元素数据
        const { eventTargetId, currentChartType, nextChartType, chartTypes } = event.data;

        // 找到对应的图表元素并更新其类型
        const updatedEightElement = await updateChartTypeInEightElement(eightElement, eventTargetId, nextChartType);

        if (updatedEightElement) {
          // 更新八要素结构
          setEightElement(updatedEightElement);

          // 重新渲染HTML
          const newHtml = renderEightElementToHtml(updatedEightElement, {
            width: dimensions.width,
            height: dimensions.height
          });
          setRenderedHtml(newHtml.html);

          console.log('✅ 图表类型切换成功:', currentChartType, '->', nextChartType);
        } else {
          console.error('❌ 未找到要更新的图表元素:', eventTargetId);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [eightElement, dimensions]);

  // 处理动作选择
  const handleActionToggle = (actionName) => {
    if (selectedActions.includes(actionName)) {
      // 移除动作
      setSelectedActions(prev => prev.filter(a => a !== actionName));
      setActionIntensities(prev => {
        const newIntensities = { ...prev };
        delete newIntensities[actionName];
        return newIntensities;
      });
    } else {
      // 添加动作
      setSelectedActions(prev => [...prev, actionName]);
      setActionIntensities(prev => ({
        ...prev,
        [actionName]: 0.5 // 默认强度(0.1-1.0)
      }));
    }
  };

  // 处理动作强度变化
  const handleIntensityChange = (actionName, intensity) => {
    setActionIntensities(prev => ({
      ...prev,
      [actionName]: intensity
    }));
  };

  // 处理Markdown转换为八要素结构
  const processMarkdown = (customDimensions = null, forceLayoutControls = null) => {
    try {
      // 使用传入的自定义尺寸或当前状态中的尺寸
      const currentDimensions = customDimensions || dimensions;
      console.log('处理Markdown使用尺寸:', currentDimensions);

      // 🔧 使用强制传入的布局调控或当前状态
      let currentLayoutControls = forceLayoutControls || layoutControls;
      console.log('🎯 使用布局调控设置:', currentLayoutControls);



      // 1. 转换Markdown为八要素结构
      let eightElementObj = markdownToEightElement(markdown);

      // 2. 分析八要素中的元件类型（使用八要素层面的函数）
      const pageElementsList = analyzeElementsInEightElement(eightElementObj);
      setPageElements(pageElementsList);

      // 🆕 3. 提取布局分析信息
      if (pageElementsList.layoutAnalysis) {
        setLayoutAnalysis(pageElementsList.layoutAnalysis);
        console.log(`🏗️ 识别到 ${pageElementsList.layoutAnalysis.length} 个可调控的布局`);

        // 🔧 修复：不再自动设置默认值，只保持用户已经设置的调控
        const layoutControlsToUpdate = { ...currentLayoutControls };

        // 🔧 清理不存在的布局索引（布局可能被删除或修改）
        const validLayoutIndices = new Set(pageElementsList.layoutAnalysis.map(layout => layout.index));
        Object.keys(layoutControlsToUpdate).forEach(layoutIndexStr => {
          const layoutIndex = parseInt(layoutIndexStr);
          if (!validLayoutIndices.has(layoutIndex)) {
            console.log(`🗑️ 清理不存在的布局调控 索引=${layoutIndex}`);
            delete layoutControlsToUpdate[layoutIndexStr];
          }
        });

        // 🔧 修复：只在调控设置有变化时才更新状态
        if (Object.keys(layoutControlsToUpdate).length !== Object.keys(currentLayoutControls).length) {
          setLayoutControls(layoutControlsToUpdate);
          console.log('🔧 更新布局调控设置：清理了不存在的布局，当前总数=' + Object.keys(layoutControlsToUpdate).length);
        } else {
          console.log('🔍 布局调控设置无变化，保持现有设置');
        }
      } else {
        setLayoutAnalysis([]);
      }

      // 3. 如果有选中的动作，应用到八要素结构上
      if (actionManager && selectedActions.length > 0 && pageElementsList.length > 0) {
        console.log(`\n🚀 开始应用动作到八要素结构`);
        console.log(`   选中的动作: ${selectedActions.join(', ')}`);
        console.log(`   目标页面元件: ${pageElementsList.map(p => `${p.type}.${p.variant}(${p.count}个)`).join(', ')}`);
        console.log(`   动作强度设置:`);
        selectedActions.forEach(actionName => {
          const intensity = actionIntensities[actionName] || 0.5;
          console.log(`      ${actionName}: ${intensity.toFixed(1)}`);
        });

        try {
          // 使用八要素层面的函数应用动作
          eightElementObj = applyActionsToEightElement(
            eightElementObj,
            pageElementsList,
            actionManager,
            selectedActions,
            actionIntensities
          );

          console.log('\n🎉 动作应用到八要素结构完成！');
          console.log('   八要素结构已更新，包含所有token变化');
        } catch (error) {
          console.error('\n❌ 动作应用出错:', error);
          console.error('   将使用原始八要素结构继续渲染');
        }
      } else {
        let reason = '';
        if (!actionManager) reason = '动作管理器未初始化';
        else if (selectedActions.length === 0) reason = '未选择任何动作';
        else if (pageElementsList.length === 0) reason = '页面中没有检测到元件';

        console.log(`\n⚪ 跳过动作应用 - ${reason}`);
      }

      // 🆕 4. 如果有布局调控设置，应用到八要素结构上
      const layoutControlsList = Object.entries(currentLayoutControls)
        .filter(([layoutIndexStr, intensity]) => intensity !== undefined)
        .map(([layoutIndexStr, intensity]) => ({
          layoutIndex: parseInt(layoutIndexStr),
          intensity
        }));

      if (layoutControlsList.length > 0) {
        console.log(`\n🏗️ 开始应用基于索引的布局调控到八要素结构`);
        console.log(`   调控的布局数量: ${layoutControlsList.length}`);
        layoutControlsList.forEach(({ layoutIndex, intensity }) => {
          const targetVariant = intensity <= 0.5 ? 'column' : 'row';
          console.log(`   📝 布局调控: 索引=${layoutIndex} → ${targetVariant} (强度: ${intensity.toFixed(2)})`);
        });

        try {
          // 传递layoutAnalysis参数以使用索引映射
          eightElementObj = applyLayoutControlsToEightElement(
            eightElementObj,
            layoutControlsList,
            pageElementsList.layoutAnalysis
          );
          console.log('\n🎨 基于索引的布局调控应用完成！');
        } catch (error) {
          console.error('\n❌ 布局调控应用出错:', error);
          console.error('   将使用当前八要素结构继续渲染');
        }
      } else {
        console.log(`\n⚪ 跳过布局调控 - 没有设置布局调控`);
      }

      // 4. 保存处理后的八要素结构
      setEightElement(eightElementObj);

      // 5. 渲染HTML（使用应用了动作的八要素结构）
      const { html, processedEightElement } = renderEightElementToHtml(eightElementObj, {
        width: currentDimensions.width,
        height: currentDimensions.height
      });

      setRenderedHtml(html);
      setProcessedEightElement(processedEightElement);

      // 将八要素结构转换为标准布局结构
      const convertedLayout = convertEightElementToLayout(processedEightElement);
      setLayout(convertedLayout);

      // 从根元素开始收集测量数据
      const measurements = {
        container: {
          width: currentDimensions.width,
          height: currentDimensions.height
        },
        elements: []
      };

      setDomMeasurements(measurements);

      console.log(`\n🏁 Markdown处理流程完成！`);
      console.log(`   📄 生成的HTML长度: ${html.length} 字符`);
      console.log(`   🎨 八要素结构: ${pageElementsList.length} 种元件类型`);
      console.log(`   📐 渲染尺寸: ${currentDimensions.width}x${currentDimensions.height}`);
      if (selectedActions.length > 0) {
        console.log(`   ⚡ 应用的动作: ${selectedActions.length} 个`);
      }

      return html; // 返回生成的HTML，方便调用者使用
    } catch (error) {
      console.error('\n❌ Markdown 处理出错:', error);
      console.error('   错误详情:', error.message);
      return null;
    }
  };

  // 当动作选择变化时，重新计算影响范围
  useEffect(() => {
    calculateAffectedElements(selectedActions, pageElements);
  }, [selectedActions, pageElements, actionManager]);

  // 显式添加应用样式的函数 - 与processMarkdown分开
  const applyStyleSettings = () => {
    console.log('🎮 应用调控设置被点击');
    console.log('   当前布局调控状态:', layoutControls);
    console.log('   当前选中动作:', selectedActions);
    console.log('   当前动作强度:', actionIntensities);

    // 🔧 强制传递当前的布局调控设置
    processMarkdown(null, layoutControls);
  };

  // 🆕 模板切换处理函数
  const handleTemplateChange = (templateId) => {
    if (templateId === currentTemplate) return; // 避免重复切换

    console.log('切换模板到:', templateId);
    setCurrentTemplate(templateId);

    // 更新markdown内容
    const template = MARKDOWN_TEMPLATES[templateId];
    if (template) {
      setMarkdown(template.markdown);

      // 重置所有状态
      resetAllStates();

      console.log(`已切换到模板: ${template.name}`);
    } else {
      console.warn('模板不存在:', templateId);
    }
  };

  // 🆕 重置所有状态的通用函数
  const resetAllStates = () => {
    // 清空现有的动作选择和强度
    setSelectedActions([]);
    setActionIntensities({});

    // 清空现有的页面元件和影响范围
    setPageElements([]);
    setAffectedElements([]);

    // 清空现有的布局分析和调控
    setLayoutAnalysis([]);
    setLayoutControls({});

    // 清空渲染结果，强制重新渲染
    setRenderedHtml('');
    setProcessedEightElement(null);
    setDomMeasurements(null);
    setScoreResult(null);

    // 强制更新 iframe key 来重新渲染
    setIframeKey(prev => prev + 1);
  };

  // 🆕 重新初始化 Markdown 和动作空间
  const applyMarkdownChanges = () => {
    resetAllStates();

    // 使用 setTimeout 确保状态清空后再处理
    setTimeout(() => {
      // 🔧 传入空的布局调控，确保只做 markdown 解析，不应用调控效果
      processMarkdown(null, {});
    }, 100);
  };

  // 🆕 根据布局的原始方向计算默认显示强度
  const getLayoutDefaultIntensity = (layout) => {
    // 判断布局的原始方向
    const isOriginallyRow = layout.variant === 'row' ||
      layout.layoutDirection === 'HORIZONTAL' ||
      (layout.element._metadata?.originalVariant === 'row') ||
      (layout.element._metadata?.isLayoutTag && layout.variant === 'row');

    // 如果原本是row，默认显示0.8；如果原本是column，默认显示0.2
    return isOriginallyRow ? 0.8 : 0.2;
  };

  // 🆕 布局调控处理函数 - 改为基于索引
  const handleLayoutControlChange = (layoutIndex, intensity) => {
    setLayoutControls(prev => ({
      ...prev,
      [layoutIndex]: intensity
    }));
  };

  // 🆕 重置布局调控 - 改为基于索引，完全清空所有调控
  const resetLayoutControls = () => {
    console.log('🔄 重置布局调控：清空所有调控设置');
    setLayoutControls({});
  };

  // 测量iframe内容时使用通用函数替换内联逻辑
  const measureIframeContent = () => {
    try {
      const iframe = iframeRef.current;
      if (!iframe || !iframe.contentWindow) return;

      // 获取iframe内容文档
      const iframeDocument = iframe.contentDocument;

      // 使用状态中的固定尺寸，而不是iframe的实际尺寸
      // 这样避免了iframe隐藏时测量不准确的问题
      const measureDimensions = {
        width: dimensions.width,
        height: dimensions.height
      };

      // 使用通用元素测量收集函数
      const measurements = collectEightElementMeasurements(processedEightElement, {
        document: iframeDocument,
        dimensions: measureDimensions,
        getElementById: (id) => iframeDocument.getElementById(id),
        getComputedStyle: (el) => iframe.contentWindow.getComputedStyle(el)
      });

      setDomMeasurements(measurements);
    } catch (error) {
      console.error('测量iframe内容时出错:', error);
    }
  };

  // 获取动作分类
  const getActionsByCategory = () => {
    if (!actionManager) return {};
    return actionManager.getActionCategories();
  };

  // 获取动作的中文描述
  const getActionDescription = (actionName) => {
    if (!actionManager) {
      const action = RL_ACTIONS[actionName];
      return action ? action.name : actionName;
    }
    const actionInfo = actionManager.getActionInfo(actionName);
    return actionInfo ? actionInfo.name : actionName;
  };

  // 获取动作的冲突信息
  const getActionConflicts = (actionName) => {
    if (!actionManager) {
      const action = RL_ACTIONS[actionName];
      return action?.conflicts || [];
    }
    return actionManager.checkActionConflicts(actionName, selectedActions);
  };

  // 检查动作是否可用（没有冲突）
  const isActionAvailable = (actionName) => {
    const conflicts = getActionConflicts(actionName);
    return conflicts.length === 0;
  };



  // 复制到剪贴板函数
  const copyToClipboard = async () => {
    if (!eightElement) {
      return;
    }

    try {
      const jsonString = JSON.stringify(eightElement, null, 2);
      await navigator.clipboard.writeText(jsonString);

      // 显示成功反馈
      setCopySuccess(true);

      // 2秒后隐藏反馈
      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);

      console.log('八要素JSON已复制到剪贴板');
    } catch (error) {
      console.error('复制到剪贴板失败:', error);

      // 降级方案：选择文本并提示用户手动复制
      try {
        const textArea = document.createElement('textarea');
        textArea.value = JSON.stringify(eightElement, null, 2);
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);

        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
        console.log('八要素JSON已复制到剪贴板 (降级方案)');
      } catch (fallbackError) {
        console.error('复制失败:', fallbackError);
        alert('复制失败，请手动选择文本进行复制');
      }
    }
  };

  // 添加尺寸选择处理函数
  const handleDimensionChange = (dimension) => {
    // 防止重复点击相同尺寸
    if (dimensions.width === dimension.width && dimensions.height === dimension.height) {
      console.log('已经是当前尺寸，无需更改');
      return;
    }

    console.log('尺寸变更为:', dimension.width, 'x', dimension.height);

    // 先重置 iframe key 强制重新渲染
    setIframeKey(prev => prev + 1);

    // 先处理新尺寸的渲染，得到新的HTML
    const newDimensions = {
      width: dimension.width,
      height: dimension.height
    };

    // 先清除旧的渲染结果
    setRenderedHtml('');
    setProcessedEightElement(null);
    setDomMeasurements(null);

    // 更新维度状态
    setDimensions(newDimensions);

    // 使用新尺寸强制重新处理
    if (markdown) {
      // 使用新尺寸立即生成HTML，不依赖状态更新
      const html = processMarkdown(newDimensions);
      console.log('使用新尺寸生成了HTML, 长度:', html?.length);
    }
  };

  // 使用useRef来存储拖拽状态，避免闭包问题
  const dragStateRef = useRef({
    isResizing: false,
    resizeDirection: '',
    resizeStartPos: { x: 0, y: 0 },
    resizeStartSize: { leftWidth: 0, topHeight: 0 }
  });

  // 处理拖拽调整面板大小的函数
  const handleResizeStart = useCallback((direction, e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('开始拖拽:', direction);

    const startPos = {
      x: e.clientX,
      y: e.clientY
    };

    const startSize = {
      leftWidth: panelSizes.leftWidth,
      topHeight: panelSizes.topHeight
    };

    // 更新状态
    setIsResizing(true);
    setResizeDirection(direction);
    setResizeStartPos(startPos);
    setResizeStartSize(startSize);

    // 更新ref状态
    dragStateRef.current = {
      isResizing: true,
      resizeDirection: direction,
      resizeStartPos: startPos,
      resizeStartSize: startSize
    };

    // 添加全局鼠标事件监听器
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);
  }, [panelSizes.leftWidth, panelSizes.topHeight]);

  const handleResizeMove = useCallback((e) => {
    const dragState = dragStateRef.current;
    if (!dragState.isResizing) return;

    const containerRect = document.querySelector('.main-container')?.getBoundingClientRect();
    if (!containerRect) {
      console.log('找不到容器元素');
      return;
    }

    let newLeftWidth = dragState.resizeStartSize.leftWidth;
    let newTopHeight = dragState.resizeStartSize.topHeight;

    // 根据拖拽方向计算新尺寸百分比
    switch (dragState.resizeDirection) {
      case 'vertical': {
        // 垂直分割线 - 调整左右面板比例
        const deltaPercent = ((e.clientX - dragState.resizeStartPos.x) / containerRect.width) * 100;
        newLeftWidth = Math.max(20, Math.min(80, dragState.resizeStartSize.leftWidth + deltaPercent));
        break;
      }
      case 'horizontal': {
        // 水平分割线 - 调整上下面板比例
        const deltaPercent = ((e.clientY - dragState.resizeStartPos.y) / containerRect.height) * 100;
        newTopHeight = Math.max(30, Math.min(90, dragState.resizeStartSize.topHeight + deltaPercent));
        break;
      }
    }

    setPanelSizes({
      leftWidth: newLeftWidth,
      topHeight: newTopHeight
    });
  }, []);

  const handleResizeEnd = useCallback(() => {
    console.log('结束拖拽');

    setIsResizing(false);
    setResizeDirection('');

    // 重置ref状态
    dragStateRef.current.isResizing = false;

    // 移除全局事件监听器
    document.removeEventListener('mousemove', handleResizeMove);
    document.removeEventListener('mouseup', handleResizeEnd);
  }, []);

  // 清理事件监听器
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [handleResizeMove, handleResizeEnd]);

  // 🆕 编辑器保存处理
  const handleEditorSave = async (newMarkdown, eventTargetId) => {
    console.log('💾 编辑器保存:', newMarkdown);
    // 更新markdown内容
    setMarkdown(newMarkdown);

    // 退出编辑模式
    setIsEditMode(false);
    setEditingMarkdown('');
    setCurrentEventTargetId('');

    // 重新处理markdown（使用当前的动作和布局设置）
    setTimeout(() => {
      processMarkdown(null, layoutControls);
    }, 100);
  };

  // 🆕 编辑器取消处理
  const handleEditorCancel = () => {
    console.log('🚫 编辑器取消');

    // 退出编辑模式，不保存更改
    setIsEditMode(false);
    setEditingMarkdown('');
    setCurrentEventTargetId('');
  };

  // 重置面板大小
  const resetPanelSizes = () => {
    setPanelSizes({
      leftWidth: 50,
      topHeight: 70
    });
  };


  return (
    <div className="h-screen bg-gray-50 p-4 flex flex-col">
      <h1 className="text-2xl font-bold mb-4 flex-shrink-0">强化学习环境</h1>

      <div className="flex-1 flex min-h-0 main-container relative">
        {/* 左侧编辑器区域 */}
        <div
          className="bg-white rounded-lg shadow overflow-hidden flex flex-col mr-2"
          style={{ width: `${panelSizes.leftWidth}%` }}
        >
          <div className="p-4 overflow-y-auto flex-1">
            <h2 className="text-lg font-medium mb-4">Markdown编辑器</h2>

            {/* 🆕 模板选择Tab */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">模板选择</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {Object.entries(MARKDOWN_TEMPLATES).map(([templateId, template]) => (
                  <button
                    key={templateId}
                    onClick={() => handleTemplateChange(templateId)}
                    className={`px-3 py-2 text-sm rounded-lg border transition-all ${currentTemplate === templateId
                      ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    title={template.description}
                  >
                    {template.name}
                  </button>
                ))}
              </div>
              <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
                <strong>当前模板:</strong> {MARKDOWN_TEMPLATES[currentTemplate].description}
              </div>
            </div>

            {/* Markdown编辑器 */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700">Markdown内容</h3>
                <span className="text-xs text-gray-500">
                  {markdown.length} 字符 | {markdown.split('\n').length} 行
                </span>
              </div>
              <textarea
                className="w-full h-64 border border-gray-300 rounded p-2 font-mono text-sm"
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="输入Markdown文本..."
              />
            </div>

            {/* 页面元件分析 */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-700">页面元件分析</h3>
                <button
                  onClick={() => setIsElementsCollapsed(!isElementsCollapsed)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  title={isElementsCollapsed ? "展开" : "折叠"}
                >
                  {isElementsCollapsed ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  )}
                </button>
              </div>

              {!isElementsCollapsed && (
                <div className="mb-4 p-3 bg-gray-50 rounded border">
                  {pageElements.length > 0 ? (
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-600 mb-2">
                        当前页面包含 {pageElements.length} 种元件类型:
                      </div>
                      {pageElements.map(({ type, variant, count, sampleContent }) => (
                        <div key={`${type}.${variant}`} className="flex items-center justify-between p-2 bg-white rounded border">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded font-mono">
                              {type}.{variant}
                            </span>
                            <span className="text-sm text-gray-600">
                              {sampleContent && `"${sampleContent}"`}
                            </span>
                          </div>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {count}个
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 text-center py-4">
                      请先输入Markdown内容以分析页面元件
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 动作影响范围 */}
            {selectedActions.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-700">动作影响范围</h3>
                  <button
                    onClick={() => setIsAffectedCollapsed(!isAffectedCollapsed)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                    title={isAffectedCollapsed ? "展开" : "折叠"}
                  >
                    {isAffectedCollapsed ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    )}
                  </button>
                </div>

                {!isAffectedCollapsed && (
                  <div className="mb-4 p-3 bg-yellow-50 rounded border border-yellow-200">
                    {affectedElements.length > 0 ? (
                      <div className="space-y-2">
                        <div className="text-sm font-medium text-yellow-800 mb-2">
                          当前动作将影响 {affectedElements.length} 种元件:
                        </div>
                        {affectedElements.map(({ type, variant, count, sampleContent, tokenCount }) => (
                          <div key={`${type}.${variant}`} className="flex items-center justify-between p-2 bg-yellow-100 rounded">
                            <div className="flex items-center space-x-2">
                              <span className="text-xs px-2 py-1 bg-yellow-200 text-yellow-800 rounded font-mono">
                                {type}.{variant}
                              </span>
                              <span className="text-sm text-yellow-700">
                                {sampleContent && `"${sampleContent}"`}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs bg-yellow-200 px-2 py-1 rounded">
                                {count}个元件
                              </span>
                              <span className="text-xs bg-yellow-200 px-2 py-1 rounded">
                                {tokenCount}个tokens
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-yellow-700 text-center py-2">
                        当前动作不会影响页面中的任何元件
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-2">动作空间设置</h3>

              <div className="flex mb-3">
                <button
                  className={`px-3 py-1 text-sm rounded-l ${actionInputMode === 'categories' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => setActionInputMode('categories')}
                >
                  分类选择
                </button>
                <button
                  className={`px-3 py-1 text-sm rounded-r ${actionInputMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => setActionInputMode('list')}
                >
                  列表模式
                </button>
              </div>

              {actionInputMode === 'categories' ? (
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {Object.entries(getActionsByCategory()).map(([category, actions]) => (
                    <div key={category} className="border border-gray-200 rounded p-3">
                      <h4 className="font-medium text-gray-800 mb-2 capitalize">
                        {category === 'form' && '🎨 形态动作'}
                        {category === 'color' && '🌈 色彩动作'}
                        {category === 'typography' && '📝 字体动作'}
                        {category === 'material' && '🎭 质感动作'}
                        {category === 'proportion' && '📏 比例动作'}
                        {category === 'composition' && '🏗️ 构图动作'}
                        {category === 'state' && '🚦 状态动作'}
                        {category === 'adaptive' && '🤖 智能动作'}
                        {category === 'animation' && '🎬 动画动作'}
                        {category === 'accessibility' && '♿ 可访问性动作'}
                      </h4>
                      <div className="space-y-2">
                        {actions.map(actionName => {
                          const isSelected = selectedActions.includes(actionName);
                          const isAvailable = isActionAvailable(actionName);
                          const conflicts = getActionConflicts(actionName);

                          return (
                            <div key={actionName} className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  disabled={!isAvailable && !isSelected}
                                  onChange={() => handleActionToggle(actionName)}
                                  className="rounded"
                                />
                                <span className={`text-sm ${!isAvailable && !isSelected ? 'text-gray-400' : 'text-gray-700'}`}>
                                  {getActionDescription(actionName)}
                                </span>
                                {conflicts.length > 0 && (
                                  <span className="text-xs text-orange-500" title={`冲突动作: ${conflicts.join(', ')}`}>
                                    ⚠️
                                  </span>
                                )}
                              </div>
                              {isSelected && (
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-gray-500">强度:</span>
                                  <input
                                    type="number"
                                    min="0.1"
                                    max="1.0"
                                    step="0.1"
                                    value={actionIntensities[actionName] || 0.5}
                                    onChange={(e) => {
                                      const value = parseFloat(e.target.value);
                                      if (value >= 0.1 && value <= 1.0) {
                                        handleIntensityChange(actionName, value);
                                      }
                                    }}
                                    className="w-16 px-1 py-0.5 text-xs border border-gray-300 rounded"
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="max-h-80 overflow-y-auto">
                  <div className="space-y-2">
                    {availableActions.map(actionName => {
                      const isSelected = selectedActions.includes(actionName);
                      const isAvailable = isActionAvailable(actionName);
                      const action = RL_ACTIONS[actionName];

                      return (
                        <div key={actionName} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              disabled={!isAvailable && !isSelected}
                              onChange={() => handleActionToggle(actionName)}
                              className="rounded"
                            />
                            <div>
                              <span className={`text-sm font-medium ${!isAvailable && !isSelected ? 'text-gray-400' : 'text-gray-700'}`}>
                                {getActionDescription(actionName)}
                              </span>
                              <div className="text-xs text-gray-500">
                                {action.category} • {action.intensity}
                              </div>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500">强度:</span>
                              <input
                                type="number"
                                min="0.1"
                                max="1.0"
                                step="0.1"
                                value={actionIntensities[actionName] || 0.5}
                                onChange={(e) => {
                                  const value = parseFloat(e.target.value);
                                  if (value >= 0.1 && value <= 1.0) {
                                    handleIntensityChange(actionName, value);
                                  }
                                }}
                                className="w-16 px-1 py-0.5 text-xs border border-gray-300 rounded"
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 🆕 布局调控（作为动作空间设置的子项） */}
              {layoutAnalysis.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-700">🏗️ 布局调控</h4>
                    <button
                      onClick={() => setIsLayoutControlsCollapsed(!isLayoutControlsCollapsed)}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                      title={isLayoutControlsCollapsed ? "展开" : "折叠"}
                    >
                      {isLayoutControlsCollapsed ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      )}
                    </button>
                  </div>

                  <div className="text-xs text-blue-600 mb-3">
                    发现 {layoutAnalysis.length} 个可调控的布局，可精确控制每个布局的方向
                  </div>

                  {!isLayoutControlsCollapsed && (
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {layoutAnalysis.map((layout) => {
                        // 🔧 修复：使用原始方向计算默认强度，如果用户没有设置调控则显示原始状态
                        const defaultIntensity = getLayoutDefaultIntensity(layout);
                        const currentIntensity = layoutControls[layout.index] !== undefined ? layoutControls[layout.index] : defaultIntensity;
                        const currentVariant = currentIntensity <= 0.5 ? 'column' : 'row';
                        // 🔧 修复：检查是否用户主动设置了调控
                        const hasUserControl = layoutControls[layout.index] !== undefined;

                        return (
                          <div key={layout.index} className={`p-3 rounded border ${hasUserControl ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-200'}`}>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded font-mono">
                                  {layout.isRoot ? 'root' : 'layout'}
                                </span>
                                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded font-mono">
                                  索引:{layout.index}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded font-mono ${currentVariant === 'row' ? 'bg-orange-200 text-orange-800' : 'bg-green-200 text-green-800'
                                  }`}>
                                  {currentVariant}
                                </span>
                                <span className="text-xs text-gray-600">
                                  {layout.childrenCount}子
                                </span>
                              </div>
                              {hasUserControl && (
                                <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                                  已调整
                                </span>
                              )}
                            </div>

                            <div className="text-xs text-gray-700 mb-2">
                              <span className="font-medium">内容:</span> {layout.content.preview}
                            </div>

                            {/* 🆕 显示布局的原始状态 */}
                            <div className="text-xs text-gray-600 mb-2">
                              <span className="font-medium">原始方向:</span>
                              <span className={`ml-1 px-2 py-1 rounded font-mono ${getLayoutDefaultIntensity(layout) > 0.5 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                                {getLayoutDefaultIntensity(layout) > 0.5 ? 'row' : 'column'}
                              </span>
                            </div>

                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-600 w-12">强度:</span>
                              <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={currentIntensity}
                                onChange={(e) => handleLayoutControlChange(layout.index, parseFloat(e.target.value))}
                                className="flex-1"
                              />
                              <span className="text-xs font-mono w-8 text-center">
                                {currentIntensity.toFixed(1)}
                              </span>
                            </div>

                            <div className="text-xs text-gray-500 mt-1">
                              0.0-0.5: 垂直 (column) | 0.5-1.0: 水平 (row)
                            </div>
                          </div>
                        );
                      })}

                      <div className="pt-2 border-t border-gray-200">
                        <button
                          onClick={resetLayoutControls}
                          className="w-full px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors text-xs"
                        >
                          重置布局调控
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-4 space-y-3">
                <button
                  className="px-4 py-2 rounded w-full bg-green-500 text-white hover:bg-green-600"
                  onClick={applyMarkdownChanges}
                >
                  📝 重新解析 Markdown
                </button>
                <p className="text-xs text-gray-500">
                  手动重新解析当前 Markdown 内容（模板切换会自动触发解析）
                </p>

                <button
                  className={`px-4 py-2 rounded w-full ${visibleTab === 'html'
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  onClick={visibleTab === 'html' ? applyStyleSettings : undefined}
                  disabled={visibleTab !== 'html'}
                >
                  🎨 应用调控设置
                </button>
                <p className="text-xs text-gray-500">
                  {visibleTab === 'html'
                    ? `${selectedActions.length} 个动作 + ${Object.keys(layoutControls).length} 个布局调控，影响 ${affectedElements.length} 种元件类型`
                    : '请切换到HTML预览页面后再应用调控设置'
                  }
                </p>
              </div>
            </div>
            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-2">预览尺寸设置</h3>
              <div className="grid grid-cols-2 gap-2">
                {commonDimensions.map((dim) => (
                  <button
                    key={dim.name}
                    className={`px-3 py-2 text-sm rounded ${dimensions.width === dim.width && dimensions.height === dim.height
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    onClick={() => handleDimensionChange(dim)}
                  >
                    {dim.name}
                  </button>
                ))}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                当前尺寸: {dimensions.width} x {dimensions.height}
              </div>
            </div>
          </div>
        </div>

        {/* 垂直分割线 */}
        <div
          className="w-1 bg-gray-300 hover:bg-blue-400 cursor-col-resize flex-shrink-0 transition-colors"
          onMouseDown={(e) => handleResizeStart('vertical', e)}
          title="拖拽调整面板比例"
        />

        {/* 右侧预览区域 */}
        <div
          className="bg-white rounded-lg shadow overflow-hidden flex flex-col ml-2"
          style={{ width: `${100 - panelSizes.leftWidth}%` }}
        >
          <div className="p-4 overflow-y-auto flex-1">
            <div className="flex border-b mb-4">
              <button
                className={`px-4 py-2 ${visibleTab === 'html' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                onClick={() => setVisibleTab('html')}
              >
                HTML预览
              </button>
              <button
                className={`px-4 py-2 ${visibleTab === 'json' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                onClick={() => setVisibleTab('json')}
              >
                八要素JSON
              </button>
              <button
                className={`px-4 py-2 ${visibleTab === 'score' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                onClick={() => setVisibleTab('score')}
              >
                布局评分
              </button>
            </div>

            {/* HTML预览 */}
            <div className={`${visibleTab === 'html' ? 'block h-full' : 'hidden'}`}>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-medium">
                  {'HTML预览'}
                </h2>
                <div className="flex items-center space-x-2">
                  (
                  <>
                    <span className="text-sm text-gray-500">
                      面板比例: {panelSizes.leftWidth.toFixed(1)}% / {(100 - panelSizes.leftWidth).toFixed(1)}%
                    </span>
                    <button
                      onClick={resetPanelSizes}
                      className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                      title="重置面板比例"
                    >
                      重置布局
                    </button>
                  </>
                  )
                </div>
              </div>

              {/* 🆕 条件渲染：编辑模式显示编辑器，预览模式显示iframe */}
              {isEditMode ? (
                // 编辑器模式 - 直接占用预览容器的完整区域
                <div className="border border-gray-300 rounded bg-white h-full">
                  <CrepeMarkdownEditor
                    initialMarkdown={editingMarkdown}
                    onSave={handleEditorSave}
                    onCancel={handleEditorCancel}
                    isVisible={true}
                    eventTargetId={currentEventTargetId}
                  />
                </div>
              ) : (
                // 预览模式
                <div className="border border-gray-300 rounded overflow-hidden bg-gray-100 h-full flex flex-col">
                  <div className="flex-1 flex items-center justify-center p-4">
                    <div
                      className="bg-white shadow-lg"
                      style={{
                        width: '95%',
                        height: '95%',
                        minWidth: '300px',
                        minHeight: '200px',
                        overflow: 'auto'
                      }}
                    >
                      {renderedHtml && (
                        <iframe
                          ref={iframeRef}
                          className="w-full h-full border-0"
                          srcDoc={renderedHtml}
                          title="Eight Element Preview"
                          key={iframeKey}
                        ></iframe>
                      )}
                    </div>
                  </div>

                  {/* 内容尺寸信息 */}
                  <div className="px-2 py-1 bg-gray-50 border-t text-xs text-gray-600 text-center">
                    预览区域占比: 80% × 80% | 渲染尺寸: {dimensions.width} x {dimensions.height} px
                  </div>
                </div>
              )}
            </div>

            {/* JSON预览 */}
            <div className={`${visibleTab === 'json' ? 'block' : 'hidden'}`}>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-medium">八要素结构</h2>
                <div className="flex items-center space-x-2">
                  {copySuccess && (
                    <span className="text-sm text-green-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      已复制！
                    </span>
                  )}
                  <button
                    onClick={copyToClipboard}
                    disabled={!eightElement}
                    className={`flex items-center space-x-1 px-3 py-1 text-sm rounded transition-colors ${eightElement
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    title="复制JSON到剪贴板"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>复制</span>
                  </button>
                </div>
              </div>
              <div className="border border-gray-300 rounded p-2 h-96 overflow-auto bg-gray-50">
                <pre className="text-xs">
                  {eightElement ? JSON.stringify(eightElement, null, 2) : '等待处理...'}
                </pre>
              </div>
            </div>

            {/* 评分结果 */}
            <div className={`${visibleTab === 'score' ? 'block' : 'hidden'}`}>
              <h2 className="text-lg font-medium mb-2">布局评分</h2>
              <div className="h-96 overflow-auto">
                {layout && domMeasurements && (
                  <VisualSpaceEvaluator
                    layout={layout}
                    domMeasurements={domMeasurements}
                  />
                )}
              </div>
            </div>

            {/* 当前使用的动作 */}
            <div className="mt-4 text-xs text-gray-500 p-2 bg-gray-100 rounded">
              <div className="font-medium mb-1">动作系统状态:</div>
              {actionManager ? (
                <div className="space-y-2">
                  <div className="text-green-600">✅ 系统已初始化</div>
                  <div>页面元件类型: {pageElements.length} 种</div>
                  <div>可用动作: {actionManager.getAvailableActions().length} 个</div>

                  {selectedActions.length > 0 ? (
                    <div className="mt-2">
                      <div className="font-medium mb-1">已选择的动作:</div>
                      <div className="space-y-1">
                        {selectedActions.map(actionName => (
                          <div key={actionName} className="flex justify-between">
                            <span>{getActionDescription(actionName)}</span>
                            <span className="font-mono">
                              {(actionIntensities[actionName] || 0.5).toFixed(1)}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 pt-2 border-t border-gray-300">
                        <div className="text-yellow-600">
                          💡 影响范围: {affectedElements.length} 种元件 • 总计 {affectedElements.reduce((sum, el) => sum + el.count, 0)} 个元件
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-400 mt-2">未选择动作</div>
                  )}

                  {/* 🆕 布局调控状态 */}
                  {layoutAnalysis.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-300">
                      <div className="font-medium mb-1">布局调控状态:</div>
                      <div className="text-blue-600">
                        🏗️ 发现 {layoutAnalysis.length} 个可调控布局
                      </div>
                      {Object.keys(layoutControls).length > 0 && (
                        <div className="mt-1">
                          <div className="text-xs">当前调控:</div>
                          {layoutAnalysis.map(layout => {
                            const userSetIntensity = layoutControls[layout.index];
                            if (userSetIntensity === undefined) return null;

                            const currentVariant = userSetIntensity <= 0.5 ? 'column' : 'row';
                            // 🔧 修复：任何设置的调控都视为用户主动修改
                            const hasUserControl = true;

                            return (
                              <div key={layout.index} className="flex justify-between items-center">
                                <span className="text-xs">
                                  索引{layout.index} ({layout.childrenCount}子)
                                </span>
                                <span className={`font-mono ${hasUserControl ? 'text-blue-600 font-bold' : ''}`}>
                                  {currentVariant} ({userSetIntensity.toFixed(1)})
                                </span>
                              </div>
                            );
                          }).filter(Boolean)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-red-500">❌ 系统未初始化</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 🆕 更新八要素结构中指定图表的类型
const updateChartTypeInEightElement = async (eightElement, chartId, newChartType) => {
  if (!eightElement) return null;

  // 深拷贝八要素结构
  const updatedElement = JSON.parse(JSON.stringify(eightElement));

  // 递归查找并更新图表元素
  const updateChartElement = async (element) => {
    if (!element) return false;

    // 检查当前元素是否为目标图表
    if (element.id === chartId && element.name === 'chart') {
      console.log('🎯 找到目标图表元素:', chartId, '当前类型:', element.chartType, '新类型:', newChartType);

      // 更新图表类型
      element.chartType = newChartType;

      // 重新生成SVG内容
      try {
        // 先创建图表元素以获取样式配置
        const { createChartElement, generateChartSvg } = await import('../utils/eightElement/creators/tableCreators.js');
        const chartElement = createChartElement(
          newChartType,
          '', // 空的SVG内容，稍后生成
          element.tableData || [],
          element.tableContent || '',
          element.variant || 'default',
          element.chartTitle || '',
          element.events || []
        );

        // 提取样式配置
        const chartStyleConfig = {
          variant: 'normal',
          title: chartElement.layout.title,
          legend: chartElement.layout.legend,
          axis: chartElement.layout.axis
        };

        // 生成新的SVG内容
        const svgContent = generateChartSvg(newChartType, element.tableData || [], chartStyleConfig, element.chartTitle);

        // 更新SVG内容
        element.svgContent = svgContent;

        console.log('✅ 图表类型和SVG内容更新成功');
        return true;
      } catch (error) {
        console.error('❌ 重新生成图表SVG失败:', error);
        return false;
      }
    }

    // 递归检查子元素
    if (element.layout && element.layout.children) {
      for (const child of element.layout.children) {
        if (await updateChartElement(child)) {
          return true;
        }
      }
    }

    return false;
  };

  // 执行更新
  const updated = await updateChartElement(updatedElement);

  if (updated) {
    return updatedElement;
  } else {
    console.error('❌ 未找到要更新的图表元素:', chartId);
    return null;
  }
};

export default EightElementAnalyzer; 