/**
 * LayoutEditor 适配器
 * 
 * 将共享的布局操作函数适配到LayoutEditor组件中使用
 * 提供兼容接口，确保现有功能不受影响
 */

import { useDispatch, useSelector } from 'react-redux';
import { actions, store } from '../../utils/reduxStore';
import { 
  addIds, addContainerImpl, addChildComponentImpl, 
  applyCategoryPresetImpl, updateElementStyleImpl, 
  updateElementContentImpl, updateElementActionImpl,
  moveElementImpl, deleteElementImpl, standardizeMarkdownElementsIds,
  findElement, findParentElement, handleAddContainerImpl
} from '../../utils/layoutOperations';
import { applyPresetToElement } from '../../utils/presetSystem';

/**
 * 创建LayoutEditor适配器
 * @param {Object} options - 选项配置
 * @returns {Object} - 适配后的方法集
 */
export const createLayoutEditorAdapter = (options = {}) => {
  // 获取Redux dispatch函数
  const dispatch = options.dispatch;
  
  // 获取当前布局、选中的元素ID和已使用的元素ID集合
  const getCurrentState = () => {
    // 直接从Redux store获取状态
    const state = store.getState();
    return {
      layout: state.layout,
      selectedElementId: state.selectedElementId,
      usedElementIds: state.usedElementIds
    };
  };
  // 应用预设的依赖函数
  const applyPresetToElement = options.applyPresetToElement;
  
  /**
   * 添加容器的适配器方法
   */
  const handleAddContainer = (selectedElements = [], parentId = null, predefinedContainerId = null) => {
    console.log('适配器: handleAddContainer 被调用，添加元素数量:', selectedElements ? selectedElements.length : 0);
    
    // 获取最新状态信息
    const state = store.getState();
    const currentLayout = state.layout;
    const storeSelectedElementId = state.selectedElementId;
    const storeUsedElementIds = state.usedElementIds;
    
    console.log('从Redux获取的当前布局状态：', currentLayout ? '存在' : '不存在');
    
    // 使用纯函数处理添加容器逻辑
    const result = handleAddContainerImpl(
      currentLayout, 
      selectedElements, 
      parentId, 
      predefinedContainerId,
      storeSelectedElementId,
      storeUsedElementIds
    );
    
    if (result.error) {
      console.error("添加容器错误:", result.error);
      return null;
    }
    
    // 如果是检测到重复的容器，直接返回ID
    if (result.isDuplicate) {
      console.log('检测到重复的容器内容，不重复添加');
      return result.containerId;
    }
    
    // 更新Redux状态
    if (result.usedElementIds && result.usedElementIds.length > 0) {
      dispatch(actions.updateUsedElementIds(result.usedElementIds));
    }
    
    dispatch(actions.updateLayout(result.newLayout));
    dispatch(actions.updateSelectedElementId(result.containerId));
    
    // 更新jsonRef
    if (options.jsonRef) {
      options.jsonRef.current = JSON.stringify(result.newLayout, null, 2);
    }
    
    return result.containerId;
  };
  
  /**
   * 添加子组件的适配器方法
   */
  const addChildComponent = (parentId, type, markdownElement) => {
    console.log('适配器: addChildComponent');
    const { layout, usedElementIds } = getCurrentState();
    
    // 使用共享函数实现添加子组件
    const result = addChildComponentImpl(layout, parentId, type, markdownElement, usedElementIds);
    
    if (result.error) {
      console.error("添加子组件错误:", result.error);
      return null;
    }
    
    // 更新Redux状态
    if (result.usedElementIds && result.usedElementIds.length > 0) {
      dispatch(actions.updateUsedElementIds(result.usedElementIds));
    }
    dispatch(actions.updateLayout(result.newLayout));
    
    return result.elementId;
  };
  
  /**
   * 应用预设的适配器方法
   */
  const applyCategoryPreset = (elementIdOrCategory, categoryOrPresetKey, presetKeyOrAsArray = false, asArray = false) => {
    console.log('适配器: applyCategoryPreset');
    const { layout, selectedElementId } = getCurrentState();
    
    // 支持两种调用方式:
    // 1. applyCategoryPreset(elementId, category, presetKey, asArray) - 新版本，用于 actionExecutor
    // 2. applyCategoryPreset(category, presetKey, asArray) - 旧版本，向后兼容
    
    let elementId, category, presetKey;
    
    // 检查第一个参数是否为元素ID
    if (typeof categoryOrPresetKey === 'string' && typeof presetKeyOrAsArray === 'string') {
      // 新版本调用方式
      elementId = elementIdOrCategory;
      category = categoryOrPresetKey;
      presetKey = presetKeyOrAsArray;
      // asArray 保持不变
    } else {
      // 旧版本调用方式
      elementId = selectedElementId || (layout ? layout.id : null);
      category = elementIdOrCategory;
      presetKey = categoryOrPresetKey;
      asArray = presetKeyOrAsArray;
    }
    
    // 检查布局状态
    if (!layout) {
      console.log(`布局为空，将在500ms后重试应用预设... elementId=${elementId}`);
      // 使用延迟重试机制
      setTimeout(() => {
        // 获取当前状态
        const { layout: currentLayout } = getCurrentState();
        console.log('重试时布局状态:', currentLayout ? '布局存在' : '布局仍为空');
        
        if (!currentLayout) {
          console.error('重试失败：布局为空');
          return;
        }
        
        if (!elementId) {
          console.error('重试失败：元素ID为空');
          return;
        }
        
        // 使用共享函数实现应用预设
        const result = applyCategoryPresetImpl(
          currentLayout,
          elementId,
          category,
          presetKey,
          asArray,
          applyPresetToElement
        );
        
        if (result.error) {
          console.error("应用预设错误:", result.error);
          return;
        }
        
        // 更新Redux状态
        dispatch(actions.updateLayout(result.newLayout));
      }, 500);
      
      return;
    }
    
    // 布局存在，继续正常逻辑
    if (!elementId) {
      console.error(`无法应用预设: 元素ID为空, category=${category}, presetKey=${presetKey}`);
      return;
    }
    
    // 使用共享函数实现应用预设
    const result = applyCategoryPresetImpl(
      layout,
      elementId,
      category,
      presetKey,
      asArray,
      applyPresetToElement
    );
    
    if (result.error) {
      console.log("应用预设错误:", result.error);
      return;
    }
    
    // 更新Redux状态
    dispatch(actions.updateLayout(result.newLayout));
    
    // 如果有jsonRef，更新它
    if (options.jsonRef) {
      options.jsonRef.current = JSON.stringify(result.newLayout, null, 2);
    }
  };
  
  /**
   * 更新元素样式的适配器方法
   */
  const updateElementStyle = (elementId, key, value) => {
    console.log('适配器: updateElementStyle');
    const { layout } = getCurrentState();
    
    if (!layout || !elementId) return;
    
    // 使用共享函数实现更新样式
    const result = updateElementStyleImpl(layout, elementId, key, value);
    
    if (result.error) {
      console.error("更新样式错误:", result.error);
      return;
    }
    
    // 更新Redux状态
    dispatch(actions.updateLayout(result.newLayout));
  };
  
  /**
   * 更新元素内容的适配器方法
   */
  const updateElementContent = (elementId, key, value) => {
    console.log('适配器: updateElementContent');
    const { layout } = getCurrentState();
    
    if (!layout || !elementId) return;
    
    // 使用共享函数实现更新内容
    const result = updateElementContentImpl(layout, elementId, key, value);
    
    if (result.error) {
      console.error("更新内容错误:", result.error);
      return;
    }
    
    // 更新Redux状态
    dispatch(actions.updateLayout(result.newLayout));
  };
  
  /**
   * 更新元素操作的适配器方法
   */
  const updateElementAction = (elementId, key, value) => {
    console.log('适配器: updateElementAction');
    const { layout } = getCurrentState();
    
    if (!layout || !elementId) return;
    
    // 使用共享函数实现更新操作
    const result = updateElementActionImpl(layout, elementId, key, value);
    
    if (result.error) {
      console.error("更新操作错误:", result.error);
      return;
    }
    
    // 更新Redux状态
    dispatch(actions.updateLayout(result.newLayout));
  };
  
  /**
   * 移动元素的适配器方法
   */
  const moveElement = (elementId, targetContainerId) => {
    console.log('适配器: moveElement');
    const { layout } = getCurrentState();
    
    // 使用共享函数实现移动元素
    const result = moveElementImpl(layout, elementId, targetContainerId);
    
    if (result.error) {
      console.error("移动元素错误:", result.error);
      return;
    }
    
    // 更新Redux状态
    dispatch(actions.updateLayout(result.newLayout));
    
    // 如果有jsonRef，更新它
    if (options.jsonRef) {
      options.jsonRef.current = JSON.stringify(result.newLayout, null, 2);
    }
  };
  
  /**
   * 清除布局的适配器方法
   */
  const clearLayout = () => {
    console.log('适配器: clearLayout');
    
    // 清除布局和重置已使用元素ID
    dispatch(actions.clearLayout());
    dispatch(actions.resetUsedElementIds());
    dispatch(actions.updateJsonInput(''));
    
    return true;
  };
  
  /**
   * 删除元素的适配器方法
   */
  const deleteElement = (elementId) => {
    console.log('适配器: deleteElement');
    const { layout } = getCurrentState();
    
    if (!layout || !elementId) return;
    
    // 使用共享函数实现删除元素
    const result = deleteElementImpl(layout, elementId);
    
    if (result.error) {
      console.error("删除元素错误:", result.error);
      return;
    }
    
    // 更新Redux状态
    dispatch(actions.updateLayout(result.newLayout));
    dispatch(actions.updateSelectedElementId(null));
    
    // 如果有jsonRef，更新它
    if (options.jsonRef) {
      options.jsonRef.current = JSON.stringify(result.newLayout, null, 2);
    }
  };
  
  /**
   * 处理Markdown元素生成的适配器方法
   */
  const handleMarkdownElementsGenerated = (elements) => {
    console.log('适配器: handleMarkdownElementsGenerated');
    
    // 使用共享函数标准化Markdown元素ID
    const elementsWithUniqueIds = standardizeMarkdownElementsIds(elements);
    
    // 更新Redux状态
    dispatch(actions.updateMarkdownElements(elementsWithUniqueIds));
  };
  
  // 返回适配器方法
  return {
    handleAddContainer,
    addChildComponent,
    applyCategoryPreset,
    updateElementStyle,
    updateElementContent,
    updateElementAction,
    moveElement,
    clearLayout,
    deleteElement,
    handleMarkdownElementsGenerated,
    findElement,
    findParentElement
  };
};

/**
 * 在组件中使用LayoutEditor适配器的Hook
 * @returns {Object} - 适配后的方法集
 */
export const useLayoutEditorAdapter = () => {
  const dispatch = useDispatch();
  // 不再从useSelector获取状态，而是在需要时直接从store获取
  
  // 创建并返回适配器
  return createLayoutEditorAdapter({
    dispatch,
    jsonRef: { current: '' }, // 提供一个空的jsonRef，会在实际调用时被覆盖
    applyPresetToElement // 传递applyPresetToElement函数
  });
}; 