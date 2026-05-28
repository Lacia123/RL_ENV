/**
 * 统一的示例数据管理
 * 用于 loop 循环渲染时提供默认数据
 */
const sampleData = {
    // 卡片级循环 - 招聘卡片数据
    cardData: [{
        title: '算法策略',
        name: '张逸杰',
        desc: '他在算法优化与模型调参方面有出色表现，多次在业务指标上实现显著提升具备从0到1构建算法系统的经验，对模型评估与实验设计有敏锐洞察力。',
        avatarUrl: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=200&h=200',
    }, {
        title: '产品设计',
        name: '李明',
        desc: '具备出色的用户体验设计能力，曾主导多个大型产品的设计工作，擅长从用户需求出发进行创新设计。',
        avatarUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200',
    }, {
        title: '前端开发',
        name: '王芳',
        desc: '精通 React、Vue 等主流前端框架，有丰富的大型项目经验，注重代码质量和性能优化。',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200',
    }, {
        title: '算法策略',
        name: '张逸杰',
        desc: '他在算法优化与模型调参方面有出色表现，多次在业务指标上实现显著提升具备从0到1构建算法系统的经验，对模型评估与实验设计有敏锐洞察力。',
        avatarUrl: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=200&h=200',
    }, {
        title: '产品设计',
        name: '李明',
        desc: '具备出色的用户体验设计能力，曾主导多个大型产品的设计工作，擅长从用户需求出发进行创新设计。',
        avatarUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200',
    }, {
        title: '前端开发',
        name: '王芳',
        desc: '精通 React、Vue 等主流前端框架，有丰富的大型项目经验，注重代码质量和性能优化。',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200',
    }],
    // 卡片内部循环 - 评论列表数据
    comments: [{
        applyDeptName: '数据智能&用户体验',
        approveAuditorName: '李峰',
        avatarUrl: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=200&h=200',
        orderSummary: '申报金额（CNY）：23,0000',
        beginTime: '2025-08-11 15:34:05'
    }, {
        applyDeptName: '数据智能&用户体验12',
        approveAuditorName: '李峰2',
        avatarUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200',
        orderSummary: '申报金额（CNY）：45,0000',
        beginTime: '2025-08-11 15:34:05'
    }, {
        applyDeptName: '产品开发部',
        approveAuditorName: '张三',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200',
        orderSummary: '申报金额（CNY）：18,5000',
        beginTime: '2025-08-12 09:20:15'
    }],

    // 通用列表数据
    loopData: [{
        title: '项目启动',
        desc: '完成项目立项和团队组建'
    }, {
        title: '需求分析',
        desc: '完成用户需求调研和分析'
    }, {
        title: '设计评审',
        desc: '通过产品设计评审'
    }],

    // commonStyle 云服务网格卡 — 截图图 1/2：均为 AWS + 美国、亚洲、亚太（图 1 四卡同色，图 2 仅主题色不同）
    commonStyleServiceGridItem: {
        title: 'AWS',
        content: '美国、亚洲、亚太',
        icon: '1',
    },

    commonStyleServiceGridData: [
        { title: 'AWS', content: '美国、亚洲、亚太', icon: '1' },
        { title: 'AWS', content: '美国、亚洲、亚太', icon: '1' },
        { title: 'AWS', content: '美国、亚洲、亚太', icon: '1' },
        { title: 'AWS', content: '美国、亚洲、亚太', icon: '1' },
    ],

    // 图 5 堆叠卡（≤3 条，字段同图 4 + link）
    commonStyleServiceGridDataCompact: [
        { title: 'AWS', content: '美国、亚洲、亚太', icon: '1', link: '↗' },
        { title: 'AWS', content: '美国、亚洲、亚太', icon: '1', link: '↗' },
        { title: 'AWS', content: '美国、亚洲、亚太', icon: '1', link: '↗' },
    ],

    // 图 2 四象限主题色：青 / 橙 / 紫 / 蓝（文案与图 1 相同）
    commonStyleServiceThemeData: [
        {
            title: 'AWS',
            description: '美国、亚洲、亚太',
            icon: '1',
            headerTint: '{color.basic.light-blue.1}',
            contentTint: '{color.basic.light-blue.0}',
            titleColor: '{color.basic.light-blue.7}',
            accentColor: '{color.basic.light-blue.6}',
        },
        {
            title: 'AWS',
            description: '美国、亚洲、亚太',
            icon: '1',
            headerTint: '{color.basic.orange.1}',
            contentTint: '{color.basic.orange.0}',
            titleColor: '{color.basic.orange.7}',
            accentColor: '{color.basic.orange.6}',
        },
        {
            title: 'AWS',
            description: '美国、亚洲、亚太',
            icon: '1',
            headerTint: '{color.basic.purple.1}',
            contentTint: '{color.basic.purple.0}',
            titleColor: '{color.basic.purple.7}',
            accentColor: '{color.basic.purple.6}',
        },
        {
            title: 'AWS',
            description: '美国、亚洲、亚太',
            icon: '1',
            headerTint: '{color.basic.blue.1}',
            contentTint: '{color.basic.blue.0}',
            titleColor: '{color.basic.blue.7}',
            accentColor: '{color.basic.blue.6}',
        },
    ],

    // 图 3 行列表（icon 24×24 + 标题 + content + 操作）
    commonStyleServiceListData: [
        {
            title: 'AWS',
            content: '美国、亚洲、亚太',
            icon: '1',
            sync: '⟳',
            more: '⋮',
        },
        {
            title: 'Azure',
            content: '全球20+区域',
            icon: '1',
            sync: '⟳',
            more: '⋮',
        },
        {
            title: '阿里云',
            content: '中国大陆主要城市',
            icon: '1',
            sync: '⟳',
            more: '⋮',
        },
        {
            title: '私有云',
            content: '定制化部署',
            icon: '1',
            sync: '⟳',
            more: '⋮',
        },
    ],

    mixedCardData: [{
        subtitle: '这是副标题',
        image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&h=800',
        avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=200&h=200',
        title: '企业超级智能体',
        blueLabel: '标签1',
        redLabel: '标签2',
        purpleLabel: '标签3',
        content1: '第一段：这里是描述文字这里是描述文字这里是描述文字这里是描述文字这里是描这里是描这里是描第一段：这里是描述文字这里是描述文字这里是描述文字这里是描述文字这里是描这里是描这里是描',
        content2: '第一段：这里是描述文字这里是描述文字这里是描述文字这里是描述文字这里是描这里是描这里是描第一段：这里是描述文字这里是描述文字这里是描述文字这里是描述文字这里是描这里是描这里是描',
        content3: '第一段：这里是描述文字这里是描述文字这里是描述文字这里是描述文字这里是描这里是描这里是描第一段：这里是描述文字这里是描述文字这里是描述文字这里是描述文字这里是描这里是描这里是描',
        imageItem1: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&h=800',
        imageItem2: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&h=800',
        imageItem3: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&h=800',
    }, {
        subtitle: '这是副标题',
        image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&h=800',
        avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=200&h=200',
        title: '企业超级智能体',
        blueLabel: '标签1',
        redLabel: '标签2',
        purpleLabel: '标签3',
        content1: '第一段：这里是描述文字这里是描述文字这里是描述文字这里是描述文字这里是描这里是描这里是描第一段：这里是描述文字这里是描述文字这里是描述文字这里是描述文字这里是描这里是描这里是描',
        content2: '第一段：这里是描述文字这里是描述文字这里是描述文字这里是描述文字这里是描这里是描这里是描第一段：这里是描述文字这里是描述文字这里是描述文字这里是描述文字这里是描这里是描这里是描',
        content3: '第一段：这里是描述文字这里是描述文字这里是描述文字这里是描述文字这里是描这里是描这里是描第一段：这里是描述文字这里是描述文字这里是描述文字这里是描述文字这里是描这里是描这里是描',
        imageItem1: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&h=800',
        imageItem2: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&h=800',
        imageItem3: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&h=800',
    }, {
        subtitle: '这是副标题',
        image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&h=800',
        avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=200&h=200',
        title: '企业超级智能体',
        blueLabel: '标签1',
        redLabel: '标签2',
        purpleLabel: '标签3',
        content1: '第一段：这里是描述文字这里是描述文字这里是描述文字这里是描述文字这里是描这里是描这里是描第一段：这里是描述文字这里是描述文字这里是描述文字这里是描述文字这里是描这里是描这里是描',
        content2: '第一段：这里是描述文字这里是描述文字这里是描述文字这里是描述文字这里是描这里是描这里是描第一段：这里是描述文字这里是描述文字这里是描述文字这里是描述文字这里是描这里是描这里是描',
        content3: '第一段：这里是描述文字这里是描述文字这里是描述文字这里是描述文字这里是描这里是描这里是描第一段：这里是描述文字这里是描述文字这里是描述文字这里是描述文字这里是描这里是描这里是描',
        imageItem1: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&h=800',
        imageItem2: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&h=800',
        imageItem3: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&h=800',
    }]
};

export default sampleData;