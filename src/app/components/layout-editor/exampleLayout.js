'use client';

/**
 * 示例布局数据 - 使用完全基于预设的方法
 * 用于初始化布局编辑器
 */
export const exampleLayout = {
  type: 'container',
  // 容器专用预设
  layoutPreset: 'vertical-centered',   // 垂直居中布局预设
  flexRatioPreset: 'grow-1',          // 弹性比例预设
  sizePreset: 'fill-width',           // 尺寸比例预设
  appearancePreset: 'card',           // 卡片外观预设
  spacingPreset: 'spacious',          // 宽敞间距预设
  children: [
    {
      type: 'text',
      // 文本专用预设
      selfAlignPreset: 'self-center',  // 元素自身对齐预设
      textAlignPreset: 'center',       // 居中对齐文本预设
      typographyPreset: 'h1',          // 大标题排版预设
      appearancePreset: 'primary',     // 主色调外观预设
      spacingPreset: 'spacious',       // 宽敞间距预设
      sizePreset: 'responsive-large',  // 响应式大比例尺寸
      content: { value: '设计系统与开发效率的革新' }
    },
    {
      type: 'text',
      // 文本专用预设
      selfAlignPreset: 'self-center',  // 元素自身对齐预设
      textAlignPreset: 'center',       // 居中对齐文本预设
      typographyPreset: 'body',        // 正文排版预设
      appearancePreset: 'default',     // 默认外观预设
      spacingPreset: 'comfortable',    // 舒适间距预设
      sizePreset: 'fill-width',        // 填充宽度尺寸
      content: { value: '探索如何通过设计系统提升团队协作效率。' }
    },
    {
      type: 'button',
      // 按钮专用预设
      buttonSizePreset: 'btn-medium',  // 中等按钮尺寸预设
      selfAlignPreset: 'self-center',  // 元素自身对齐预设
      typographyPreset: 'default',     // 默认按钮文本预设
      appearancePreset: 'primary',     // 主色调外观预设
      spacingPreset: 'comfortable',    // 舒适间距预设
      content: { text: '开始使用预设系统' }
    }
  ]
};

export default exampleLayout;