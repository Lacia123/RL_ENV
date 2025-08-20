'use client';

import React, { useState } from 'react';
import { Crepe } from "@milkdown/crepe";
import { Milkdown, MilkdownProvider, useEditor, useInstance } from "@milkdown/react";
import { getMarkdown } from "@milkdown/utils";
import "@milkdown/crepe/theme/common/style.css";
import "@milkdown/crepe/theme/frame.css";

/**
 * 编辑器控制组件 - 必须在 MilkdownProvider 内部
 */
const EditorControls = ({ onSave, onCancel, isSaving, eventTargetId }) => {
  const [isLoading, getInstance] = useInstance();

  const handleSave = async () => {
    if (!onSave || isLoading) return;

    try {
      const editor = getInstance();
      if (!editor) {
        console.warn('⚠️ 编辑器实例不存在');
        return;
      }

      const content = editor.action(getMarkdown());
      await onSave(content, eventTargetId);
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败: ' + error.message);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="editor-header" style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px',
      paddingBottom: '8px',
      borderBottom: '1px solid #e5e7eb',
      background: '#f9fafb',
      padding: '12px',
      borderRadius: '6px 6px 0 0'
    }}>
      <div className="editor-title" style={{
        fontSize: '16px',
        fontWeight: '600',
        color: '#374151'
      }}>
        📝 Markdown 编辑器
        {eventTargetId && (
          <span style={{ fontSize: '12px', color: '#6b7280', marginLeft: '8px' }}>
            ID: {eventTargetId.slice(-8)}
          </span>
        )}
        {isLoading && (
          <span style={{ fontSize: '12px', color: '#f59e0b', marginLeft: '8px' }}>
            (加载中...)
          </span>
        )}
      </div>

      <div className="editor-buttons" style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={handleSave}
          disabled={isSaving || isLoading}
          style={{
            padding: '6px 12px',
            border: 'none',
            borderRadius: '4px',
            cursor: (isSaving || isLoading) ? 'not-allowed' : 'pointer',
            fontSize: '13px',
            fontWeight: '500',
            background: (isSaving || isLoading) ? '#d1d5db' : '#3b82f6',
            color: 'white',
            transition: 'all 0.2s'
          }}
        >
          {isSaving ? '保存中...' : '💾 保存'}
        </button>

        <button
          onClick={handleCancel}
          disabled={isSaving}
          style={{
            padding: '6px 12px',
            border: 'none',
            borderRadius: '4px',
            cursor: isSaving ? 'not-allowed' : 'pointer',
            fontSize: '13px',
            fontWeight: '500',
            background: '#6b7280',
            color: 'white',
            transition: 'all 0.2s'
          }}
        >
          🔙 返回
        </button>
      </div>
    </div>
  );
};

/**
 * 清理 markdown 中的转义符
 */
const cleanMarkdown = (markdown) => {
  if (!markdown) return '';

  let cleaned = markdown
    // 移除标签转义符
    .replace(/\\</g, '<')
    .replace(/\\>/g, '>')
    // 移除其他常见转义符
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\\[/g, '[')
    .replace(/\\\]/g, ']')
    .replace(/\\\(/g, '(')
    .replace(/\\\)/g, ')')
    .replace(/\\\{/g, '{')
    .replace(/\\\}/g, '}')
    // 移除多余的反斜杠（但保留需要的转义）
    .replace(/\\([^\\])/g, '$1');

  // 🆕 移除图表标记和表格之间的空行
  // 匹配模式：[chart:type|title] 或 [chart:type] 后面跟着空行，然后是表格
  cleaned = cleaned.replace(
    /(\[chart:[^\]]+\])\s*\n\s*\n+(\s*\|[^\n]*\|)/g,
    '$1\n$2'
  );

  // 🆕 更严格的匹配：图表标记后直接跟多个空行然后是表格
  cleaned = cleaned.replace(
    /(\[chart:[^\]]+\])\n{2,}(\s*\|[^\n]*\|)/g,
    '$1\n$2'
  );
  return cleaned;
};

/**
 * 内部的 Crepe 编辑器组件
 */
const CrepeEditor = ({ initialMarkdown }) => {
  const { get } = useEditor((root) => {
    console.log('🔧 初始化 Crepe 编辑器...');

    const crepe = new Crepe({
      root,
      defaultValue: initialMarkdown
    });

    return crepe;
  });

  return <Milkdown />;
};

/**
 * Crepe Markdown 编辑器 React 组件 - 使用正确的 React 包装器
 */
export default function CrepeMarkdownEditor({
  initialMarkdown = '',
  onSave = null,
  onCancel = null,
  isVisible = false,
  eventTargetId = ''
}) {
  const [isSaving, setIsSaving] = useState(false);

  // 包装保存函数以添加状态管理
  const handleSave = async (content, targetId) => {
    if (!onSave) return;

    setIsSaving(true);
    try {
      const cleanedMarkdown = cleanMarkdown(content);
      await onSave(cleanedMarkdown, targetId);
    } catch (error) {
      throw error; // 重新抛出错误让 EditorControls 处理
    } finally {
      setIsSaving(false);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="editor-container" style={{
      width: '100%',
      height: '100%',
      background: 'white',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <MilkdownProvider>
        {/* 编辑器控制按钮 - 必须在 Provider 内部 */}
        <EditorControls
          onSave={handleSave}
          onCancel={onCancel}
          isSaving={isSaving}
          eventTargetId={eventTargetId}
        />

        {/* 编辑器内容区域 */}
        <div className="editor-content" style={{
          flex: 1,
          border: '1px solid #d1d5db',
          borderRadius: '0 0 6px 6px',
          overflow: 'auto',
          position: 'relative',
          minHeight: '400px'
        }}>
          <CrepeEditor initialMarkdown={initialMarkdown} />
        </div>
      </MilkdownProvider>
    </div>
  );
}