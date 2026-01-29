import { NextResponse } from 'next/server';
import { markdownToEightElement, analyzeElementsInEightElement, applyActionsToEightElement, applyLayoutControlsToEightElement } from '@/app/utils/eightElement/index';
import { renderEightElementToHtml } from '@/app/utils/eightElement/renderEightElementHtml';
import { createActionSystemManager } from '@/app/utils/seeds/rl_action_engines';
import { DEFAULT_STYLE_CONFIG } from '@/app/utils/eightElement/styles';
import { logElementStyleErrors } from '@/app/utils/logging/elementStyleLogger';

export async function POST(request) {
  try {
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
      // 新的动作参数
      actions = [],
      layoutControls = []
    } = requestData;

    try {
      // 1. 转换Markdown为八要素结构
      let eightElement = markdownToEightElement(markdown);

      // 保存原始八要素结构用于返回
      const originalEightElement = JSON.parse(JSON.stringify(eightElement));

      // 2. 分析八要素中的元件类型（获取layout分析信息）
      const pageElements = analyzeElementsInEightElement(eightElement);

      // 3. 应用动作（如果有提供）
      if (actions && actions.length > 0) {

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
          // 检查动作是否存在
          const actionInfo = actionManager.getActionInfo(action.name);
          if (!actionInfo) {
            console.warn('动作不存在:', action.name);
            return false;
          }
          return true;
        });

        if (validActions.length > 0) {

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

          try {
            eightElement = applyActionsToEightElement(
              eightElement,
              pageElements,
              actionManager,
              selectedActions,
              actionIntensities
            );
          } catch (actionError) {
            console.error('应用动作时出错:', actionError);
            // 继续使用原始的八要素结构
          }
        }
      }

      // 4. 应用布局调控（如果有提供）
      if (layoutControls && layoutControls.length > 0) {

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
          // 检查布局索引是否存在
          const layout = pageElements.layoutAnalysis?.find(l => l.index === control.layoutIndex);
          if (!layout) {
            console.warn('布局索引不存在:', control.layoutIndex);
            return false;
          }
          return true;
        });

        if (validLayoutControls.length > 0) {

          try {
            eightElement = applyLayoutControlsToEightElement(
              eightElement,
              validLayoutControls,
              pageElements.layoutAnalysis
            );
          } catch (layoutError) {
            console.error('应用布局调控时出错:', layoutError);
            // 继续使用当前的八要素结构
          }
        }
      }

      // 5. 预处理八要素结构以应用样式
      // 🆕 不需要交互式功能，只需要预处理后的八要素结构
      const { processedEightElement } = renderEightElementToHtml(eightElement, { 
        width, 
        height,
        includeInteractive: false 
      });

      // 6. 异步记录样式错误，不阻塞接口返回
      setImmediate(async () => {
        try {
          // 使用特殊标识符来表示动作系统
          const actionSystemIdentifier = `actions:${actions.map(a => `${a.name}:${a.intensity}`).join('|')}`;
          await logElementStyleErrors(markdown, actionSystemIdentifier, eightElement, { width, height });
        } catch (error) {
          console.warn('异步记录元素样式错误失败:', error);
        }
      });

      // 返回八要素结构
      return NextResponse.json({
        success: true,
        eightElement: processedEightElement,
        // originalEightElement: originalEightElement,
        // 返回应用的动作和布局调控信息
        appliedActions: actions,
        appliedLayoutControls: layoutControls,
        actionSystemUsed: actions && actions.length > 0,
        layoutControlsUsed: layoutControls && layoutControls.length > 0,
        // 附加信息
        pageElements: pageElements.filter(element => element.actualType !== 'layout'), // 排除layout的元素信息
        layoutsAvailable: pageElements.layoutAnalysis || [],
        // 保持与原接口的兼容性
        tokensApplied: false, // 使用动作系统，不使用tokens
        designTokens: null
      }, { status: 200 });

    } catch (error) {
      console.error('处理过程中出错:', error);
      throw error; // 重新抛出错误，由外层catch处理
    }

  } catch (error) {
    console.error('基于动作的Markdown转八要素失败:', error);
    return NextResponse.json({
      success: false,
      error: '基于动作的Markdown转八要素失败',
      message: error.message
    }, { status: 500 });
  }
} 