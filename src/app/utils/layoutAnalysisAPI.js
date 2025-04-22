'use client';

import { analyzeLayout } from './layoutAnalysis/index.js';
import { generateVirtualDomMeasurements } from './layoutAnalysis/virtualDom.js';
import { generateHybridMeasurements } from './layoutAnalysis/playwrightDomMeasure.js';
import ReduxActionExecutor from './reduxActionExecutor.js';
import { addContainerImpl, addChildComponentImpl, applyCategoryPresetImpl, 
  updateElementStyleImpl, updateElementContentImpl, moveElementImpl } from './layoutOperations.js';
import { applyPresetToElement } from './presetSystem.js'
import { store, actions as reduxActions } from './reduxStore.js';

/**
 * 布局分析API类
 * 提供基于JSON的布局评估API
 */
class LayoutAnalysisAPI {
  constructor() {
    // 初始化内部状态
    this.reset();
  }

  /**
   * 重置API实例状态
   */
  reset() {
    this.layout = null;
    this.canvasWidth = 1024;
    this.canvasHeight = 768;
    this.virtualMeasurements = null;
    this.measurementMode = 'virtual'; // 'virtual'或'jsdom'
  }

  /**
   * 设置测量模式
   * @param {string} mode - 测量模式 ('virtual'|'jsdom')
   */
  setMeasurementMode(mode) {
    if (mode === 'virtual' || mode === 'jsdom') {
      this.measurementMode = mode;
    } else {
      console.warn(`不支持的测量模式: ${mode}，使用默认值 'virtual'`);
      this.measurementMode = 'virtual';
    }
  }

  /**
   * 评估布局并返回分析结果
   * @param {Object} request - 包含布局数据和动作的请求对象
   * @returns {Object} 布局分析结果
   */
  async evaluateLayout(request) {
    try {
      // 重置状态
      this.reset();

      // 提取请求数据
      const { metadata, actions, markdownData } = request;
      
      // 设置画布尺寸
      if (metadata && metadata.canvasWidth) {
        this.canvasWidth = metadata.canvasWidth;
      }
      if (metadata && metadata.canvasHeight) {
        this.canvasHeight = metadata.canvasHeight;
      }
      
      // 设置测量模式（如果有）
      if (metadata && metadata.measurementMode) {
        this.setMeasurementMode(metadata.measurementMode);
      }

      // 执行动作序列构建布局
      this.executeActions(actions);

      if (!this.layout) {
        return {
          success: false,
          error: '无法从提供的动作生成有效布局'
        };
      }

      // 根据测量模式生成测量数据
      const containerDimensions = {
        width: this.canvasWidth,
        height: this.canvasHeight
      };
      
      if (this.measurementMode === 'jsdom') {
        // 使用JSDOM生成测量数据
        this.virtualMeasurements = await generateHybridMeasurements(this.layout, containerDimensions);
      } else {
        // 使用虚拟DOM测量
        this.virtualMeasurements = generateVirtualDomMeasurements(this.layout, containerDimensions);
      }

      // 分析布局
      const analysisResult = analyzeLayout(this.layout, this.virtualMeasurements, markdownData ? markdownData.markdownElements : []);

      return {
        success: true,
        result: {
          analysisResult,
          layout: this.layout
        } 
      };
    } catch (error) {
      console.error('布局评估失败:', error);
      return {
        success: false,
        error: error.message || '布局评估过程中发生未知错误'
      };
    }
  }

  /**
   * 执行一系列动作来构建布局
   * @param {Array} actions - 要执行的动作数组
   */
  executeActions(actions) {
    if (!actions || !Array.isArray(actions)) {
      throw new Error('无效的动作数组');
    }
    // 初始化根容器
    this.layout = {
      id: 'root',
      type: 'container',
      style: {
        width: this.canvasWidth,
        height: this.canvasHeight,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: '#FFFFFF',
        padding: 0,
        margin: 0,
      },
      children: []
    };

    // 创建临时的动作执行器，用于布局分析
    const tempExecutor = new ReduxActionExecutor({
      onAddContainer: async (elements, parentId, predefinedContainerId) => {
        try {
          // 使用共享函数实现添加容器
          const result = addContainerImpl(store.getState().layout, elements, parentId, predefinedContainerId);
          if (result.error) {
            console.error("添加容器错误:", result.error);
            return predefinedContainerId || `container_${Date.now()}`;
          }
          
          // 更新Redux状态
          store.dispatch(reduxActions.updateLayout(result.newLayout));
          if (result.usedElementIds && result.usedElementIds.length > 0) {
            store.dispatch(reduxActions.updateUsedElementIds(result.usedElementIds));
          }
          
          return result.containerId;
        } catch (error) {
          console.error("添加容器异常:", error);
          return predefinedContainerId || `container_${Date.now()}`;
        }
      },
      
      onAddChildComponent: async (parentId, componentType, elementData) => {
        try {
          // 使用共享函数实现添加组件
          const result = addChildComponentImpl(
            store.getState().layout, 
            parentId, 
            componentType, 
            elementData, 
            store.getState().usedElementIds
          );
          
          if (result.error) {
            console.error("添加组件错误:", result.error);
            return `component_${Date.now()}`;
          }
          
          // 更新Redux状态
          store.dispatch(reduxActions.updateLayout(result.newLayout));
          if (result.usedElementIds && result.usedElementIds.length > 0) {
            store.dispatch(reduxActions.updateUsedElementIds(result.usedElementIds));
          }
          
          return result.elementId;
        } catch (error) {
          console.error("添加组件异常:", error);
          return `component_${Date.now()}`;
        }
      },
      
      onApplyCategoryPreset: async (elementId, presetCategory, presetKey) => {
        try {
          // 使用共享函数实现应用预设
          const result = applyCategoryPresetImpl(
            store.getState().layout,
            elementId,
            presetCategory,
            presetKey,
            false,
            applyPresetToElement
          );
          
          if (result.error) {
            console.error("应用预设错误:", result.error);
            return elementId;
          }
          
          // 更新Redux状态
          store.dispatch(reduxActions.updateLayout(result.newLayout));
          return elementId;
        } catch (error) {
          console.error("应用预设异常:", error);
          return elementId;
        }
      },
      
      onUpdateElementStyle: async (elementId, property, value) => {
        try {
          // 使用共享函数实现更新样式
          const result = updateElementStyleImpl(
            store.getState().layout,
            elementId,
            property,
            value
          );
          
          if (result.error) {
            console.error("更新样式错误:", result.error);
            return { elementId, property, value };
          }
          
          // 更新Redux状态
          store.dispatch(reduxActions.updateLayout(result.newLayout));
          return { elementId, property, value };
        } catch (error) {
          console.error("更新样式异常:", error);
          return { elementId, property, value };
        }
      },
      
      onUpdateElementContent: async (elementId, contentProperty, value) => {
        try {
          // 使用共享函数实现更新内容
          const result = updateElementContentImpl(
            store.getState().layout,
            elementId,
            contentProperty,
            value
          );
          
          if (result.error) {
            console.error("更新内容错误:", result.error);
            return { elementId, contentProperty, value };
          }
          
          // 更新Redux状态
          store.dispatch(reduxActions.updateLayout(result.newLayout));
          return { elementId, contentProperty, value };
        } catch (error) {
          console.error("更新内容异常:", error);
          return { elementId, contentProperty, value };
        }
      },
      
      onMoveElement: async (elementId, targetContainerId) => {
        try {
          // 使用共享函数实现移动元素
          const result = moveElementImpl(
            store.getState().layout,
            elementId,
            targetContainerId
          );
          
          if (result.error) {
            console.error("移动元素错误:", result.error);
            return { elementId, targetContainerId };
          }
          
          // 更新Redux状态
          store.dispatch(reduxActions.updateLayout(result.newLayout));
          return { elementId, targetContainerId };
        } catch (error) {
          console.error("移动元素异常:", error);
          return { elementId, targetContainerId };
        }
      },
      
      onClearLayout: () => {
        // 清除布局状态
        store.dispatch(reduxActions.clearLayout());
        store.dispatch(reduxActions.resetUsedElementIds());
        return true;
      }
    });

    // 清除现有状态
    tempExecutor.callbacks.onClearLayout();

    // 执行动作序列
    this._executeActionsSequentially(actions, tempExecutor);
    
    // 确保清理资源
    tempExecutor.dispose();

    // 从Redux获取最终布局
    this.layout = store.getState().layout || this.layout;
    
    return this.layout;
  }

  /**
   * 顺序执行动作
   * @param {Array} actionSequence - 要执行的动作数组
   * @param {Object} executor - 动作执行器实例
   * @private
   */
  _executeActionsSequentially(actionSequence, executor) {
    if (!actionSequence || !Array.isArray(actionSequence) || actionSequence.length === 0) {
      console.log('没有动作需要执行');
      return;
    }
    
    console.log(`开始执行动作序列，动作数量: ${actionSequence.length}`);
    
    // 逐一执行动作
    for (let i = 0; i < actionSequence.length; i++) {
      const action = actionSequence[i];
      
      // 输出进度信息
      console.log(`执行动作 ${i + 1}/${actionSequence.length}: ${action.type || '未知类型'}`);
      
      // 根据动作类型执行
      try {
        // 动作数据已经符合executor的格式，直接执行
        if (action.category && action.actionId) {
          executor.executeAction(action.category, action.actionId, action.params || {}, action.result);
        } else {
          console.warn(`动作格式不正确:`, action);
        }
      } catch (error) {
        console.error(`执行动作失败:`, error);
        // 继续执行其余动作
      }
    }
    
    console.log('动作序列执行完成');
  }

  /**
   * 添加元素到布局
   * @param {Object} payload - 元素数据
   */
  addElement(payload) {
    const { element, parentId } = payload;
    if (!element || !element.id) {
      throw new Error('无效的元素数据');
    }

    // 找到父元素
    const parent = this.findElementById(this.layout, parentId || 'root');
    if (!parent) {
      throw new Error(`找不到父元素: ${parentId || 'root'}`);
    }

    // 确保父元素有children数组
    if (!parent.children) {
      parent.children = [];
    }

    // 添加元素到父元素的children
    parent.children.push(element);
  }

  /**
   * 更新元素属性
   * @param {Object} payload - 更新数据
   */
  updateElement(payload) {
    const { id, updates } = payload;
    if (!id || !updates) {
      throw new Error('无效的更新数据');
    }

    // 找到要更新的元素
    const element = this.findElementById(this.layout, id);
    if (!element) {
      throw new Error(`找不到要更新的元素: ${id}`);
    }

    // 应用更新
    Object.assign(element, updates);
  }

  /**
   * 从布局中移除元素
   * @param {Object} payload - 包含要移除元素ID的对象
   */
  removeElement(payload) {
    const { id } = payload;
    if (!id) {
      throw new Error('无效的元素ID');
    }

    // 移除元素的递归辅助函数
    const removeElementHelper = (node) => {
      if (!node.children) return false;

      // 在子元素中查找并移除
      const index = node.children.findIndex(child => child.id === id);
      if (index !== -1) {
        node.children.splice(index, 1);
        return true;
      }

      // 递归检查所有子元素
      for (const child of node.children) {
        if (removeElementHelper(child)) {
          return true;
        }
      }

      return false;
    };

    // 从根元素开始尝试移除
    if (!removeElementHelper(this.layout)) {
      throw new Error(`找不到要移除的元素: ${id}`);
    }
  }

  /**
   * 移动元素到新的父元素
   * @param {Object} payload - 移动数据
   */
  moveElement(payload) {
    const { id, newParentId, index } = payload;
    if (!id || !newParentId) {
      throw new Error('无效的移动数据');
    }

    // 保存要移动的元素
    let elementToMove = null;
    let originalParent = null;
    let originalIndex = -1;

    // 找到要移动的元素及其原始位置的辅助函数
    const findElementToMove = (node) => {
      if (!node.children) return false;

      // 在子元素中查找
      const foundIndex = node.children.findIndex(child => child.id === id);
      if (foundIndex !== -1) {
        elementToMove = node.children[foundIndex];
        originalParent = node;
        originalIndex = foundIndex;
        return true;
      }

      // 递归检查所有子元素
      for (const child of node.children) {
        if (findElementToMove(child)) {
          return true;
        }
      }

      return false;
    };

    // 查找元素
    if (!findElementToMove(this.layout)) {
      throw new Error(`找不到要移动的元素: ${id}`);
    }

    // 找到新的父元素
    const newParent = this.findElementById(this.layout, newParentId);
    if (!newParent) {
      throw new Error(`找不到新的父元素: ${newParentId}`);
    }

    // 确保新父元素有children数组
    if (!newParent.children) {
      newParent.children = [];
    }

    // 从原始位置移除元素
    originalParent.children.splice(originalIndex, 1);

    // 添加到新的位置
    if (typeof index === 'number' && index >= 0 && index <= newParent.children.length) {
      newParent.children.splice(index, 0, elementToMove);
    } else {
      // 如果没有指定索引或索引无效，添加到末尾
      newParent.children.push(elementToMove);
    }
  }

  /**
   * 设置画布尺寸
   * @param {Object} payload - 包含新尺寸的对象
   */
  setCanvasSize(payload) {
    const { width, height } = payload;
    
    if (width) {
      this.canvasWidth = width;
      this.layout.style.width = width;
    }
    
    if (height) {
      this.canvasHeight = height;
      this.layout.style.height = height;
    }
  }

  /**
   * 在布局中查找具有指定ID的元素
   * @param {Object} node - 要搜索的节点
   * @param {string} id - 要查找的元素ID
   * @returns {Object|null} 找到的元素或null
   */
  findElementById(node, id) {
    if (!node) return null;
    
    // 检查当前节点
    if (node.id === id) {
      return node;
    }
    
    // 递归检查子节点
    if (node.children) {
      for (const child of node.children) {
        const result = this.findElementById(child, id);
        if (result) {
          return result;
        }
      }
    }
    
    return null;
  }
}

// 导出API类实例
export const layoutAnalysisAPI = new LayoutAnalysisAPI();