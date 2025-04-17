'use client';

import { analyzeLayout } from './layoutAnalysis/index.js';
import { generateVirtualDomMeasurements } from './layoutAnalysis/virtualDom.js';
import { generateJSDOMmeasurements } from './layoutAnalysis/domMeasure.js';

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
      const { metadata, actions } = request;
      
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
        this.virtualMeasurements = await generateJSDOMmeasurements(this.layout, containerDimensions);
      } else {
        // 使用虚拟DOM测量
        this.virtualMeasurements = generateVirtualDomMeasurements(this.layout, containerDimensions);
      }

      // 分析布局
      const analysisResult = analyzeLayout(this.layout, this.virtualMeasurements);

      return {
        success: true,
        result: analysisResult
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

    // 处理每个动作
    for (const action of actions) {
      this.processAction(action);
    }
  }

  /**
   * 处理单个动作
   * @param {Object} action - 要处理的动作
   */
  processAction(action) {
    if (!action || !action.type) {
      throw new Error('无效的动作对象');
    }

    switch (action.type) {
      case 'ADD_ELEMENT':
        this.addElement(action.payload);
        break;
      case 'UPDATE_ELEMENT':
        this.updateElement(action.payload);
        break;
      case 'REMOVE_ELEMENT':
        this.removeElement(action.payload);
        break;
      case 'MOVE_ELEMENT':
        this.moveElement(action.payload);
        break;
      case 'SET_CANVAS_SIZE':
        this.setCanvasSize(action.payload);
        break;
      default:
        console.warn(`未知的动作类型: ${action.type}`);
    }
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