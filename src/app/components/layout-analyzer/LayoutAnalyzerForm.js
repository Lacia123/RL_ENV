'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// 示例布局模板
const layoutTemplates = {
  simple: {
    metadata: {
      canvasWidth: 1200,
      canvasHeight: 800,
      measurementMode: 'virtual'
    },
    actions: [
      {
        type: 'SET_CANVAS_SIZE',
        payload: { width: 1200, height: 800 }
      },
      {
        type: 'ADD_ELEMENT',
        payload: {
          element: {
            id: 'header',
            type: 'container',
            style: {
              width: '100%',
              height: 80,
              backgroundColor: '#4a90e2',
              padding: 16,
              display: 'flex',
              alignItems: 'center'
            }
          },
          parentId: 'root'
        }
      },
      {
        type: 'ADD_ELEMENT',
        payload: {
          element: {
            id: 'title',
            type: 'text',
            style: { fontSize: 24, color: '#ffffff' },
            content: { value: '布局示例' }
          },
          parentId: 'header'
        }
      }
    ]
  },
  complex: {
    metadata: {
      canvasWidth: 1200, 
      canvasHeight: 800,
      measurementMode: 'virtual'
    },
    actions: [
      // 这里放置更复杂布局的actions...
      {
        type: 'SET_CANVAS_SIZE',
        payload: { width: 1200, height: 800 }
      },
      {
        type: 'ADD_ELEMENT',
        payload: {
          element: {
            id: 'header',
            type: 'container',
            style: {
              width: '100%',
              height: 80,
              backgroundColor: '#1a73e8',
              padding: 16,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }
          },
          parentId: 'root'
        }
      },
      {
        type: 'ADD_ELEMENT',
        payload: {
          element: {
            id: 'title',
            type: 'text',
            style: { fontSize: 24, fontWeight: 'bold', color: '#ffffff' },
            content: { value: '复杂布局示例' }
          },
          parentId: 'header'
        }
      },
      {
        type: 'ADD_ELEMENT',
        payload: {
          element: {
            id: 'content',
            type: 'container',
            style: {
              width: '100%',
              padding: 20,
              display: 'flex',
              flexDirection: 'row',
              gap: 20
            }
          },
          parentId: 'root'
        }
      },
      {
        type: 'ADD_ELEMENT',
        payload: {
          element: {
            id: 'sidebar',
            type: 'container',
            style: {
              width: 250,
              backgroundColor: '#f5f5f5',
              padding: 16,
              borderRadius: 8
            }
          },
          parentId: 'content'
        }
      },
      {
        type: 'ADD_ELEMENT',
        payload: {
          element: {
            id: 'main',
            type: 'container',
            style: {
              flex: 1,
              backgroundColor: '#ffffff',
              padding: 24,
              borderRadius: 8,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }
          },
          parentId: 'content'
        }
      }
    ]
  }
};

/**
 * 布局分析表单组件
 * 用于提交布局数据进行分析
 */
export default function LayoutAnalyzerForm() {
  const router = useRouter();
  const [layoutData, setLayoutData] = useState(JSON.stringify(layoutTemplates.simple, null, 2));
  const [selectedTemplate, setSelectedTemplate] = useState('simple');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 处理模板选择
  const handleTemplateChange = (e) => {
    const template = e.target.value;
    setSelectedTemplate(template);
    
    if (template === 'custom') {
      // 自定义模板保持现有内容
      return;
    }
    
    // 使用预设模板
    if (layoutTemplates[template]) {
      setLayoutData(JSON.stringify(layoutTemplates[template], null, 2));
    }
  };
  
  // 提交表单
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // 解析布局数据，确保是有效的JSON
      const parsedLayout = JSON.parse(layoutData);
      
      // 提交到服务器端API进行分析
      const response = await fetch('/api/layout-analyzer/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(parsedLayout)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '提交布局分析请求失败');
      }
      
      const result = await response.json();
      
      // 跳转到结果页面，带上结果ID
      router.push(`/layout-analyzer?id=${result.id}`);
      
    } catch (err) {
      setError(err.message || '提交布局数据时出错');
      console.error('布局分析错误:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 模板选择 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          选择布局模板
        </label>
        <select 
          value={selectedTemplate}
          onChange={handleTemplateChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="simple">简单布局</option>
          <option value="complex">复杂布局</option>
          <option value="custom">自定义布局</option>
        </select>
      </div>
      
      {/* 布局数据JSON编辑器 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          布局数据 (JSON格式)
        </label>
        <textarea 
          value={layoutData}
          onChange={(e) => setLayoutData(e.target.value)}
          rows={20}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
          spellCheck="false"
        />
      </div>
      
      {/* 错误提示 */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          {error}
        </div>
      )}
      
      {/* 提交按钮 */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className={`
            px-4 py-2 rounded-md text-white font-medium
            ${isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} 
            transition-colors duration-150 ease-in-out
          `}
        >
          {isLoading ? '分析中...' : '分析布局'}
        </button>
      </div>
    </form>
  );
} 