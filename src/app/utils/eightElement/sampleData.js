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
    }]
};

export default sampleData;