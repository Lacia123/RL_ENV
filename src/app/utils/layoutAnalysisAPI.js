// 在客户端和服务器端都可用的布局分析API
// 检测环境并按需导入模块

// 客户端版本的API实现
let layoutAnalysisAPI;

// 检测是否是客户端环境
const isClient = typeof window !== 'undefined';

if (isClient) {
  // 客户端API：通过HTTP调用服务器端API
  layoutAnalysisAPI = {
    evaluateLayout: async (request) => {
      try {
        const response = await fetch('/api/layout-analysis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        console.error('布局分析API客户端错误:', error);
        return {
          success: false,
          error: error.message || '布局分析请求失败'
        };
      }
    }
  };
} else {
  // 服务器端API：直接导入和使用相关模块
  // 动态导入服务器端依赖
  layoutAnalysisAPI = {
    evaluateLayout: async (request) => {
      try {
        // 验证请求格式
        if (!request || !request.actions || !Array.isArray(request.actions)) {
          return {
            success: false,
            error: '无效的请求数据，actions必须是数组'
          };
        }
        
        // 提取请求参数
        const { metadata = {}, actions } = request;
        const { canvasWidth = 1024, canvasHeight = 768, measurementMode = 'virtual' } = metadata;
        
        // 构建布局结构
        const layout = {
          id: 'root',
          type: 'container',
          children: []
        };
        
        // 处理所有动作并生成布局
        for (const action of actions) {
          // 处理添加元素动作
          if (action.type === 'add_element') {
            const { element } = action;
            
            if (!element) continue;
            
            // 如果没有指定父元素，则添加到根容器
            if (!element.parentId) {
              element.parentId = 'root';
            }
            
            // 将元素添加到布局中
            if (element.parentId === 'root') {
              layout.children.push(element);
            } else {
              // 递归查找父元素并添加子元素
              const addChildToParent = (parent, child) => {
                if (parent.id === child.parentId) {
                  if (!parent.children) parent.children = [];
                  parent.children.push(child);
                  return true;
                }
                
                if (parent.children) {
                  for (const childElement of parent.children) {
                    if (addChildToParent(childElement, child)) {
                      return true;
                    }
                  }
                }
                
                return false;
              };
              
              addChildToParent(layout, element);
            }
          }
          // 可以添加其他类型的动作处理...
        }
        
        // 根据测量模式选择不同的测量方法
        let measurements;
        
        if (measurementMode === 'hybrid' || measurementMode === 'playwright') {
          // 使用Playwright进行真实DOM测量
          const { generateHybridMeasurements } = await import('./layoutAnalysis/playwrightDomMeasure.js');
          measurements = await generateHybridMeasurements(layout, { 
            width: canvasWidth,
            height: canvasHeight
          });
        } else {
          return {
            success: false,
            error: '无效的测量模式'
          };
        }
        
        // 评估视觉空间得分
        const { evaluateVisualSpace } = await import('./layoutAnalysis/visualSpaceScore.js');
        const visualSpaceResult = evaluateVisualSpace(measurements, layout);
        
        // 返回完整分析结果
        return {
          success: true,
          result: {
            layout,
            measurements,
            score: visualSpaceResult.score,
            visualBalance: visualSpaceResult.categories.visualBalance,
            hierarchy: visualSpaceResult.categories.hierarchy,
            alignment: visualSpaceResult.categories.alignment,
            contentDensity: visualSpaceResult.categories.contentDensity,
            colorTypography: visualSpaceResult.categories.colorTypography,
            responsiveDesign: visualSpaceResult.categories.responsiveDesign,
            accessibility: visualSpaceResult.categories.accessibility,
            performance: visualSpaceResult.categories.performance,
            allDetails: visualSpaceResult.allDetails,
            overallRecommendation: visualSpaceResult.overallRecommendation
          }
        };
      } catch (error) {
        console.error('布局分析API服务端错误:', error);
        return {
          success: false,
          error: error.message || '布局分析处理失败'
        };
      }
    }
  };
}

export { layoutAnalysisAPI };