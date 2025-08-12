'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function MarkdownRendererContent() {
  const searchParams = useSearchParams();
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const renderMarkdown = async () => {
      try {
        setLoading(true);
        setError(null);

        // 从URL参数获取markdown内容和尺寸
        const markdown = searchParams.get('markdown');
        const width = parseInt(searchParams.get('width')) || 800;
        const height = parseInt(searchParams.get('height')) || 500;

        if (!markdown) {
          setError('缺少 markdown 参数。请在URL中添加 ?markdown=your_markdown_content');
          setLoading(false);
          return;
        }

        // 安全解码URL编码的markdown内容
        let decodedMarkdown;
        try {
          decodedMarkdown = decodeURIComponent(markdown);
        } catch (decodeError) {
          console.warn('URL解码失败，尝试直接使用原始内容:', decodeError);
          // 如果解码失败，尝试使用原始内容
          decodedMarkdown = markdown;
        }

        console.log('渲染Markdown:', decodedMarkdown.substring(0, 100) + '...');

        // 调用API获取HTML
        const response = await fetch('/api/markdown-to-html', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            markdown: decodedMarkdown,
            width,
            height
          })
        });

        if (!response.ok) {
          throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || '渲染失败');
        }

        setHtml(data.html);
      } catch (err) {
        console.error('渲染Markdown时出错:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    renderMarkdown();
  }, [searchParams]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 2s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p>正在渲染Markdown...</p>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '20px', 
        fontFamily: 'Arial, sans-serif',
        maxWidth: '800px',
        margin: '50px auto'
      }}>
        <div style={{ 
          backgroundColor: '#ffe6e6', 
          border: '1px solid #ff9999', 
          borderRadius: '5px', 
          padding: '15px' 
        }}>
          <h2 style={{ color: '#cc0000', margin: '0 0 10px 0' }}>渲染错误</h2>
          <p style={{ margin: '0', color: '#666' }}>{error}</p>
        </div>
        
        <div style={{ marginTop: '30px' }}>
          <h3>使用方法：</h3>
          <p>在URL中添加markdown参数：</p>
          <code style={{ 
            backgroundColor: '#f5f5f5', 
            padding: '10px', 
            display: 'block', 
            borderRadius: '3px',
            marginTop: '10px'
          }}>
            /markdown-renderer?markdown=your_encoded_markdown_content
          </code>
          
          <h4 style={{ marginTop: '20px' }}>示例：</h4>
          <code style={{ 
            backgroundColor: '#f5f5f5', 
            padding: '10px', 
            display: 'block', 
            borderRadius: '3px',
            marginTop: '10px',
            wordBreak: 'break-all'
          }}>
            /markdown-renderer?markdown=%3Ccard%3AheaderPrecentCard%3E%0A%23%23%20市场概述%0AAI-PC%20概念%3C%2Fcard%3AheaderPrecentCard%3E
          </code>
          
          <p style={{ marginTop: '15px' }}>可选参数：</p>
          <ul>
            <li><code>width</code> - 渲染宽度（默认：800）</li>
            <li><code>height</code> - 渲染高度（默认：500）</li>
          </ul>
        </div>
      </div>
    );
  }

  // 直接渲染HTML内容
  return (
    <div 
      style={{ width: '100%', height: '100vh', overflow: 'auto' }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default function MarkdownRenderer() {
  return (
    <Suspense fallback={
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <p>加载中...</p>
      </div>
    }>
      <MarkdownRendererContent />
    </Suspense>
  );
}
