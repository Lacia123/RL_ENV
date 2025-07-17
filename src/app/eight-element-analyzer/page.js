'use client';
import React, { useState, useEffect, useRef } from 'react';
import { renderEightElementToHtml } from '../utils/eightElement/renderEightElementHtml';
import { convertEightElementToLayout } from '../utils/layoutAnalysis/eightElementAnalysis';
import { markdownToEightElement, applyLayoutControlsToEightElement } from '../utils/eightElement/markdownToEightElement';

import { RL_ACTIONS, ActionSystemManager, createActionSystemManager, convertActionResultsToTokens } from '../utils/seeds/rl_action_engines';
import { DEFAULT_STYLE_CONFIG } from '../utils/eightElement/styleConfig';
import { analyzeElementsInEightElement, applyActionsToEightElement } from '../utils/eightElement/markdownToEightElement';
import VisualSpaceEvaluator from '../components/VisualSpaceEvaluator';
import collectEightElementMeasurements from '../utils/eightElement/collectElementMeasurements.js';

// 🆕 Markdown 示例配置
// 扩展说明：要添加新的模板，只需要在下面的 MARKDOWN_TEMPLATES 对象中添加新的条目
// 格式：templateId: { name: '显示名称', description: '描述', markdown: '模板内容' }
// 支持的特殊语法：
// - <layout:row> 水平布局
// - [chart:type] 图表（支持 line, bar, pie, grouped_line, barh 等）
// - **粗体** ~~删除线~~ 等 markdown 格式
// - 数学公式 $inline$ 和 $$block$$
// - 表格、代码块、引用等标准 markdown 语法
const MARKDOWN_TEMPLATES = {

  cardShowcase: {
    name: '🎨 经典卡片展示',
    description: '展示经典风格的卡片模板设计',
    markdown: `# 卡片模板设计系统

## 设计理念
现代化的卡片设计，满足不同场景和风格需求

<layout:row>

<card:neomorphism>
## 新拟态风格
### Neomorphism Design
柔和的阴影和高光效果，营造出元素从背景中"浮出"的立体感
创造简洁而富有层次的现代化视觉体验
</card:neomorphism>

<card:techGradient>
## 科技渐变风格
### Tech Gradient
动态渐变背景配合科技感光效，展现前沿技术实力
适用于科技产品、创新服务等需要体现技术感的场景
</card:techGradient>

</layout:row>

<layout:row>

<card:elegant>
## 优雅青蓝风格
### Warm & Friendly
温馨的色调搭配柔和的设计元素，营造舒适友好的氛围
使用渐变橙色背景和圆润边框，适合教育、生活服务类产品
</card:elegant>

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

</layout:row>

## 模板特性


**🎯 智能映射**
H2 标题自动映射为卡片标题，H3 和段落文本映射为内容区域

**🎨 风格多样**
四种预设风格，满足不同品牌调性和使用场景需求



**⚡ 灵活配置**
支持 Markdown 语法，包括代码块、列表、链接等丰富格式

**📱 响应式设计**
自适应布局，在不同屏幕尺寸下都能保持良好的视觉效果


### 使用指南

\`\`\`markdown
<card:neomorphism>
## 卡片标题
### 子标题
这里是卡片内容，支持 **粗体** 和 *斜体* 等格式
</card:neomorphism>
\`\`\`
`,
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

![企业Logo](https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=300)

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


<layout:row>

<card:custom>
  <title>MOST POPULAR</title>
  <content>
    <title>Profesional</title>
    <segment>Best for growing startups and growth companies</segment>
    <segment>Best for growing startups and growth companies</segment>
  </content>
</card:custom>

<card:custom>
## MOST POPULAR
### Profesional
Best for growing startups and growth companies
Best for growing startups and growth companies
</card:custom>

</layout:row>


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
`
  },
  jd: {
    name: '🧑‍💼招聘',
    description: '招聘页面风格',
    markdown: `
    <card:neomorphism>
# 算法工程师招聘JD
### 加入我们的算法团队
</card:neomorphism>
<layout:row>
[在线申请](https://example.com/apply)
[了解更多](https://example.com/about)
[联系我们](https://example.com/contact)
</layout:row>
<layout:row>
<card:techGradient>
## 职位详情
### 算法工程师
**薪资范围**：200K - 300K CNY  
**工作地点**：北京/上海/深圳（可选）  
**招聘人数**：5人  
**工作类型**：全职
</card:techGradient>
<card:techGradient>
## 公司简介
### 创新科技公司
我们是一家专注于人工智能和大数据领域的创新科技公司，致力于为企业提供最先进的数字化解决方案，助力业务增长和数字化转型。我们拥有一支充满活力和创新精神的技术团队，平均从业经验8年以上。我们拥有一支充满活力和创新精神的技术团队，平均从业经验8年以上。我们拥有一支充满活力和创新精神的技术团队，平均从业经验8年以上。
</card:techGradient>
</layout:row>
## 职位描述
### 岗位职责
1. 设计和实现高效的算法解决方案，解决实际业务问题  
2. 参与前沿技术研究，包括但不限于机器学习、深度学习、自然语言处理等领域  
3. 优化现有算法模型，提升系统性能和用户体验  
4. 撰写技术文档，分享研究成果，参与技术交流
### 任职要求
**必备技能**：  
- 计算机科学、数学或相关专业本科及以上学历  
- 熟悉Python/C++/Java等至少一种编程语言  
- 扎实的数据结构和算法基础，熟悉常见的算法优化技巧  
- 具有良好的数学分析能力和逻辑思维能力  
**加分项**：  
- 有机器学习、深度学习、自然语言处理等领域的实践经验  
- 熟悉分布式系统、大数据处理或高性能计算  
- 有顶会论文发表或开源项目贡献  
- 具备良好的团队协作能力和沟通能力
## 公司福利
### 我们提供
- **薪资待遇**：行业内有竞争力的薪资，优秀者薪资不设上限  
- **职业发展**：完善的晋升体系，支持个人成长和职业发展  
- **工作环境**：开放自由的工作氛围，舒适的工作空间  
- **团队活动**：丰富的团队建设活动和节日福利

<card:elegant>
### 加入我们
成为我们团队的一员，你将有机会参与前沿技术研究，与优秀团队一起成长，共同打造行业领先的解决方案。如果你对算法充满热情，渴望挑战，欢迎加入我们！
### 应聘方式
[在线申请](https://example.com/apply) [了解更多](https://example.com/about) [联系我们](https://example.com/contact)
</card:elegant>
    `
  }
};

const EightElementAnalyzer = () => {
  // 🆕 新增模板相关状态
  const [currentTemplate, setCurrentTemplate] = useState('buttonTest');
  const [markdown, setMarkdown] = useState(MARKDOWN_TEMPLATES.buttonTest.markdown);
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

      console.log('page measurements:', measurements);
      console.log('使用的测量尺寸:', measureDimensions);

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


  return (
    <div className="h-screen bg-gray-50 p-4 flex flex-col">
      <h1 className="text-2xl font-bold mb-4 flex-shrink-0">八要素结构分析工具</h1>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0">
        {/* 左侧编辑器区域 */}
        <div className="bg-white rounded-lg shadow p-4 overflow-y-auto">
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

        {/* 右侧预览区域 */}
        <div className="bg-white rounded-lg shadow p-4 overflow-y-auto">
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
          <div className={`${visibleTab === 'html' ? 'block' : 'hidden'}`}>
            <h2 className="text-lg font-medium mb-2">HTML预览</h2>
            <div className="border border-gray-300 rounded p-1 overflow-auto" style={{
              width: '100%',
              height: '600px',
              backgroundColor: '#f5f5f5'
            }}>
              <div style={{
                width: `${dimensions.width}px`,
                height: `${dimensions.height}px`,
                margin: '0 auto',
                backgroundColor: 'white',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                transition: 'width 0.3s, height 0.3s'
              }}>
                {renderedHtml && (  // 只在有内容时渲染 iframe
                  <iframe
                    ref={iframeRef}
                    className="w-full h-full"
                    srcDoc={renderedHtml}
                    title="Eight Element Preview"
                    key={iframeKey}  // 使用状态管理的 key
                  ></iframe>
                )}
              </div>
            </div>
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
  );
};

export default EightElementAnalyzer; 