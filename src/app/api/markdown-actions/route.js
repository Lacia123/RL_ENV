import { NextResponse } from 'next/server';
import { markdownToEightElement, analyzeElementsInEightElement } from '@/app/utils/eightElement/index';
import { createActionSystemManager, ActionSystemManager } from '@/app/utils/seeds/rl_action_engines';
import { DEFAULT_STYLE_CONFIG } from '@/app/utils/eightElement/styles';



export async function POST(request) {
  try {
    console.log('收到获取Markdown动作信息请求');
    
    const requestData = await request.json();
    if (!requestData || !requestData.markdown) {
      return NextResponse.json({ 
        success: false, 
        error: 'markdown参数为必填项' 
      }, { status: 400 });
    }
    
    const { markdown, width = 1024, height = 768 } = requestData;
    
    // 1. 转换Markdown为八要素结构
    const eightElement = markdownToEightElement(markdown);
    
    // 2. 分析八要素中的元件类型
    const pageElements = analyzeElementsInEightElement(eightElement);
    
    // 3. 创建动作系统管理器
    const actionManager = createActionSystemManager(DEFAULT_STYLE_CONFIG);
    
    // 4. 获取所有可用动作
    const availableActions = actionManager.getAvailableActions();
    
    // 5. 获取动作分类
    const actionCategories = actionManager.getActionCategories();
    
    // 6. 获取动作详细信息
    const actionDetails = {};
    availableActions.forEach(actionName => {
      const actionInfo = actionManager.getActionInfo(actionName);
      actionDetails[actionName] = {
        name: actionInfo.name,
        category: actionInfo.category,
        intensity: actionInfo.intensity,
        effects: actionInfo.effects,
        conflicts: actionInfo.conflicts || []
      };
    });
    
    // 7. 分析layout信息
    const layoutAnalysis = pageElements.layoutAnalysis || [];
    const layouts = layoutAnalysis.map(layout => ({
      index: layout.index,
      variant: layout.variant,
      childrenCount: layout.childrenCount,
      layoutDirection: layout.layoutDirection,
      content: layout.content,
      path: layout.path,
      depth: layout.depth
    }));
    
    // 8. 获取页面元件类型
    const elementTypes = pageElements.filter(element => element.actualType !== 'layout').map(element => ({
      type: element.actualType,
      variant: element.variant,
      count: element.count,
      path: element.path
    }));
    
    // 9. 动作冲突信息
    const actionConflicts = {};
    availableActions.forEach(actionName => {
      const conflicts = actionManager.checkActionConflicts(actionName);
      if (conflicts.length > 0) {
        actionConflicts[actionName] = conflicts;
      }
    });
    
    return NextResponse.json({
      success: true,
      data: {
        // 动作系统信息
        actions: {
          available: availableActions,
          categories: actionCategories,
          details: actionDetails,
          conflicts: actionConflicts,
          totalCount: availableActions.length
        },
        
        // Layout调控信息
        layouts: {
          available: layouts,
          totalCount: layouts.length,
          description: "每个layout可通过索引进行方向调控，强度0-0.5为column(垂直)，0.5-1.0为row(水平)"
        },
        
        // 页面元件信息
        elements: {
          types: elementTypes,
          totalCount: pageElements.length - layoutAnalysis.length // 排除layout元素
        },
        
        // 源信息
        source: {
          markdown: markdown.slice(0, 100) + (markdown.length > 100 ? '...' : ''),
          eightElementId: eightElement.id,
          analysisTimestamp: new Date().toISOString(),
          dimensions: { width, height }
        }
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('获取Markdown动作信息失败:', error);
    return NextResponse.json({ 
      success: false, 
      error: '获取Markdown动作信息失败', 
      message: error.message 
    }, { status: 500 });
  }
} 