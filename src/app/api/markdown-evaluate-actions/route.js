import { NextResponse } from 'next/server';
import { markdownToEightElement } from '@/app/utils/eightElement/markdownToEightElement';
import { analyzeElementsInEightElement, applyActionsToEightElement, applyLayoutControlsToEightElement } from '@/app/utils/eightElement/markdownToEightElement';
import { renderAndEvaluateEightElement } from '@/app/utils/eightElement/renderAndEvaluate';
import { createActionSystemManager } from '@/app/utils/seeds/rl_action_engines';
import { DEFAULT_STYLE_CONFIG } from '@/app/utils/eightElement/styleConfig';

export async function POST(request) {
  try {
    console.log('收到基于动作的Markdown评分请求');
    
    const requestData = await request.json();
    if (!requestData || !requestData.markdown) {
      return NextResponse.json({ 
        success: false, 
        error: 'markdown参数为必填项' 
      }, { status: 400 });
    }
    
    // 提取参数
    const { 
      markdown, 
      width = 1024, 
      height = 768, 
      useAims = false, 
      takeScreenshot = false,
      // 新的动作参数
      actions = [],
      layoutControls = []
    } = requestData;
    
    console.log('接收的动作参数:', actions);
    console.log('接收的布局调控参数:', layoutControls);
    
    // 1. 转换Markdown为八要素结构
    let eightElement = markdownToEightElement(markdown);
    
    // 2. 分析八要素中的元件类型（获取layout分析信息）
    const pageElements = analyzeElementsInEightElement(eightElement);
    
    // 3. 应用动作（如果有提供）
    if (actions && actions.length > 0) {
      console.log('开始应用动作到八要素结构');
      
      // 创建动作系统管理器
      const actionManager = createActionSystemManager(DEFAULT_STYLE_CONFIG);
      
      // 验证动作参数格式
      const validActions = actions.filter(action => {
        if (!action.name || typeof action.intensity !== 'number') {
          console.warn('无效的动作参数:', action);
          return false;
        }
        if (action.intensity < 0 || action.intensity > 1) {
          console.warn('动作强度超出范围 [0,1]:', action);
          return false;
        }
        return true;
      });
      
      if (validActions.length > 0) {
        console.log(`应用 ${validActions.length} 个有效动作`);
        
        // 检查动作冲突
        const actionNames = validActions.map(action => action.name);
        const conflicts = [];
        actionNames.forEach(actionName => {
          const actionConflicts = actionManager.checkActionConflicts(actionName, actionNames);
          if (actionConflicts.length > 0) {
            conflicts.push({ action: actionName, conflicts: actionConflicts });
          }
        });
        
        if (conflicts.length > 0) {
          console.warn('检测到动作冲突:', conflicts);
        }
        
        // 🔧 修复：将动作转换为正确的格式
        const selectedActions = validActions.map(action => action.name);
        const actionIntensities = {};
        
        validActions.forEach(action => {
          actionIntensities[action.name] = action.intensity;
        });
        
        console.log('🎯 准备应用的动作:', selectedActions);
        console.log('🎯 动作强度映射:', actionIntensities);
        
        try {
          eightElement = applyActionsToEightElement(
            eightElement, 
            pageElements, 
            actionManager, 
            selectedActions, 
            actionIntensities
          );
          console.log('动作应用完成');
        } catch (actionError) {
          console.error('应用动作时出错:', actionError);
          // 继续使用原始的八要素结构
        }
      }
    }
    
    // 4. 应用布局调控（如果有提供）
    if (layoutControls && layoutControls.length > 0) {
      console.log('开始应用布局调控到八要素结构');
      
      // 验证布局调控参数格式
      const validLayoutControls = layoutControls.filter(control => {
        if (typeof control.layoutIndex !== 'number' || typeof control.intensity !== 'number') {
          console.warn('无效的布局调控参数:', control);
          return false;
        }
        if (control.intensity < 0 || control.intensity > 1) {
          console.warn('布局调控强度超出范围 [0,1]:', control);
          return false;
        }
        return true;
      });
      
      if (validLayoutControls.length > 0) {
        console.log(`应用 ${validLayoutControls.length} 个有效布局调控`);
        
        try {
          eightElement = applyLayoutControlsToEightElement(
            eightElement,
            validLayoutControls,
            pageElements.layoutAnalysis
          );
          console.log('布局调控应用完成');
        } catch (layoutError) {
          console.error('应用布局调控时出错:', layoutError);
          // 继续使用当前的八要素结构
        }
      }
    }
    
    // 5. 渲染并评分
    const result = await renderAndEvaluateEightElement(eightElement, { 
      width, 
      height, 
      useAims, 
      takeScreenshot 
    });
    
    // 6. 检查是否有card测量数据并添加到响应中
    const responseData = {
      success: true,
      score: result.score,
      aims: result.aims,
      base64Image: result.base64Image,
      // 返回应用的动作和布局调控信息
      appliedActions: actions,
      appliedLayoutControls: layoutControls,
      actionSystemUsed: actions && actions.length > 0,
      layoutControlsUsed: layoutControls && layoutControls.length > 0,
      // 保持与原接口的兼容性
      tokensApplied: false, // 使用动作系统，不使用tokens
      designTokens: null
    };

    // 如果不使用AIMS且有card测量数据，添加到响应中
    if (!useAims && result.measurements.cards && result.measurements.cards.length > 0) {
      responseData.cards = {
        count: result.measurements.cards.length,
        measurements: result.measurements.cards.map(card => ({
          id: card.id,
          variant: card.variant,
          width: Math.round(card.width * 100) / 100, // 保留2位小数
          height: Math.round(card.height * 100) / 100, // 保留2位小数
          x: Math.round(card.x * 100) / 100,
          y: Math.round(card.y * 100) / 100,
          style: {
            backgroundColor: card.style.backgroundColor,
            borderRadius: card.style.borderRadius,
            padding: card.style.padding,
            margin: card.style.margin
          },
          content: card.content
        }))
      };
    }
    
    // 返回评分结果
    return NextResponse.json(responseData, { status: 200 });
    
  } catch (error) {
    console.error('基于动作的Markdown评分失败:', error);
    return NextResponse.json({ 
      success: false, 
      error: '基于动作的Markdown评分失败', 
      message: error.message 
    }, { status: 500 });
  }
} 