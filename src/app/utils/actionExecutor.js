/**
 * AIGUI 动作执行系统
 * 
 * 负责执行动作配置中定义的各种动作，并提供录制和回放功能
 */
import { getActionDefinition } from './actionConfig';
import { store, actions, layoutState } from './reduxStore'; // 导入 Redux store

// 记录当前录制状态
const recordingState = {
  isRecording: false,
  recordingName: '',
  actions: [],
  startTime: null,
};

// 已保存的动作序列
const savedSequences = {};

/**
 * 动作执行器类
 */
class ActionExecutor {
  constructor(callbacks = {}) {
    // 存储回调函数
    this.callbacks = {
      // 组件动作回调
      onAddComponent: callbacks.onAddComponent || (() => {}),
      onAddContainer: callbacks.onAddContainer || (() => {}),
      onRemoveComponent: callbacks.onRemoveComponent || (() => {}),
      
      // 预设动作回调
      onApplyPreset: callbacks.onApplyPreset || (() => {}),
      
      // 属性动作回调
      onUpdateElementStyle: callbacks.onUpdateElementStyle || (() => {}),
      onUpdateElementContent: callbacks.onUpdateElementContent || (() => {}),
      
      // 移动动作回调
      onMoveElement: callbacks.onMoveElement || (() => {}),
      onMoveElementToSibling: callbacks.onMoveElementToSibling || (() => {}),
      
      // 添加清除布局回调
      onClearLayout: callbacks.onClearLayout || (() => {}),
      
      // 记录和事件回调
      onActionExecuted: callbacks.onActionExecuted || (() => {}),
      onError: callbacks.onError || (console.error),
      onSetMarkdownData: callbacks.onSetMarkdownData || (() => {}),
      onResetUsedElements: callbacks.onResetUsedElements || (() => {}),
      
      // 状态同步回调
      onStateUpdated: callbacks.onStateUpdated || (() => {})
    };
    
    // 绑定方法
    this.executeAction = this.executeAction.bind(this);
    this.executeActionByType = this.executeActionByType.bind(this);
    this.startRecording = this.startRecording.bind(this);
    this.stopRecording = this.stopRecording.bind(this);
    this.saveRecordedSequence = this.saveRecordedSequence.bind(this);
    this.loadRecordedSequence = this.loadRecordedSequence.bind(this);
    this.playRecordedSequence = this.playRecordedSequence.bind(this);
    
    // 注册全局状态监听器
    this._setupGlobalStateListeners();
  }
  
  /**
   * 设置全局状态监听器
   * @private
   */
  _setupGlobalStateListeners() {
    // 使用Redux状态的监听机制，当全局状态更新时通知组件
    if (layoutState.registerListener) {
      this._unregisterListener = layoutState.registerListener((state) => {
        // 当Redux布局状态改变时，通知组件更新本地状态
        console.log('Redux布局状态已更新，通知组件同步状态');
        this._notifyStateUpdate(state);
      });
    }
  }
  
  /**
   * 通知状态更新
   * @private
   */
  _notifyStateUpdate(state) {
    if (this.callbacks.onStateUpdated) {
      try {
        this.callbacks.onStateUpdated(state);
      } catch (error) {
        console.error('通知状态更新失败:', error);
      }
    }
  }
  
  /**
   * 执行动作
   * @param {string} category - 动作类别
   * @param {string} actionId - 动作ID
   * @param {Object} params - 动作参数
   * @returns {Promise<any>} - 动作执行结果
   */
  async executeAction(category, actionId, params = {}) {
    try {
      // 获取动作定义
      const actionDef = getActionDefinition(category, actionId);
      if (!actionDef) {
        throw new Error(`动作 ${category}.${actionId} 不存在`);
      }
      
      // 参数验证
      this._validateParams(actionDef, params);
      
      // 额外的检查和日志
      if (actionId === "applyPreset" && !params.elementId) {
        console.error(`执行动作 ${category}.${actionId} 失败: 缺少元素ID`);
        throw new Error("应用预设需要有效的元素ID");
      }
      
      console.log(`执行动作: ${category}.${actionId}，参数:`, JSON.stringify(params));
      
      // 执行动作
      const result = await this.executeActionByType(category, actionId, params);
      
      // 记录动作（如果正在录制）
      if (recordingState.isRecording) {
        this._recordAction(category, actionId, params, result);
      }
      
      // 调用动作执行后的回调
      this.callbacks.onActionExecuted({
        category, 
        actionId, 
        params, 
        result
      });
      
      return result;
    } catch (error) {
      this.callbacks.onError(`执行动作 ${category}.${actionId} 失败: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * 根据动作类型执行相应的操作
   * @param {string} category - 动作类别
   * @param {string} actionId - 动作ID
   * @param {Object} params - 动作参数
   * @returns {Promise<any>} - 动作执行结果
   */
  async executeActionByType(category, actionId, params) {
    switch (category) {
      case 'componentActions':
        return this._executeComponentAction(actionId, params);
      
      case 'presetActions':
        return this._executePresetAction(actionId, params);
      
      case 'propertyActions':
        return this._executePropertyAction(actionId, params);
      
      case 'movementActions':
        return this._executeMovementAction(actionId, params);
      
      case 'compositeActions':
        return this._executeCompositeAction(actionId, params);
      
      default:
        throw new Error(`未知的动作类别: ${category}`);
    }
  }
  
  /**
   * 执行组件相关动作
   * @private
   */
  async _executeComponentAction(actionId, params) {
    switch (actionId) {
      case 'addComponent':
        console.log('执行addComponent动作, 参数:', params);
        
        // 确保有父容器ID
        if (!params.parentId) {
          const selectedElementId = layoutState.getSelectedElementId();
          const currentLayout = this._getGlobalLayout();
          
          if (!currentLayout) {
            console.error('添加组件失败：找不到有效的布局');
            throw new Error('请先添加一个容器');
          }
          
          // 使用全局选中的元素ID或根布局ID
          params.parentId = selectedElementId || currentLayout.id;
          console.log(`没有提供父容器ID，使用全局状态：${params.parentId}`);
        }
        
        // 检查父容器是否存在且是有效的容器类型
        const currentLayout = this._getGlobalLayout();
        if (currentLayout) {
          const parentContainer = this._findContainer(currentLayout, params.parentId);
          if (!parentContainer) {
            console.error(`找不到ID为 ${params.parentId} 的父容器`);
            throw new Error('找不到指定的父容器');
          }
          
          if (parentContainer.type !== 'container') {
            console.error(`ID为 ${params.parentId} 的元素不是容器类型: ${parentContainer.type}`);
            throw new Error('选中的元素不是容器，无法添加子组件');
          }
          
          console.log(`找到父容器: ${parentContainer.type} - ${parentContainer.id}`);
        }
        
        // 获取组件类型:
        // 1. 优先使用elementData.type
        // 2. 如果没有，则使用componentType
        // 这样统一了参数格式
        let componentType;
        
        if (params.elementData && params.elementData.type) {
          componentType = params.elementData.type;
        } else {
          componentType = params.componentType;
        }
        
        if (!componentType) {
          console.error('添加组件失败：未指定组件类型');
          throw new Error('未指定组件类型');
        }
        
        // 调用回调函数添加组件
        const componentId = await this.callbacks.onAddComponent(
          params.parentId,
          componentType,
          params.elementData
        );
        
        // 确保状态已更新
        setTimeout(() => {
          const updatedLayout = this._getGlobalLayout();
          if (updatedLayout) {
            // 确保全局状态已更新
            console.log('组件添加完成后确认全局状态已更新');
            this._notifyStateUpdate({
              layout: updatedLayout,
              selectedElementId: componentId || layoutState.getSelectedElementId()
            });
          }
        }, 50);
        
        return componentId;
      
      case 'addContainer':
        // 执行添加容器的动作
        console.log('执行addContainer动作');
        
        // 确保每次添加相同内容的容器时生成一致的ID
        let elements = params.elements || [];
        
        // 验证每个元素都有有效的ID
        elements = elements.map(element => {
          if (!element.id) {
            console.log(`元素 ${element.type} 没有ID，生成标准ID`);
            const newElement = {...element};
            newElement.id = this.generateStandardElementId(newElement);
            console.log(`为元素生成ID: ${newElement.id}`);
            return newElement;
          }
          return element;
        });
        
        // 如果动作中指定了元素且有ID，记录这些ID以便后续使用
        if (elements && elements.length > 0) {
          console.log(`添加容器包含 ${elements.length} 个元素`);
          elements.forEach(element => {
            if (element.id) {
              // 保持动作序列中的原始ID，以便正确关联后续动作
              console.log(`添加容器元素: ${element.type} 使用ID: ${element.id}`);
            }
          });
        }
        
        // 检查父容器的有效性
        let parentId = params.parentId;
        const containerLayout = this._getGlobalLayout();
        
        // 验证父容器存在且是有效的容器
        if (parentId && containerLayout) {
          const parentContainer = this._findContainer(containerLayout, parentId);
          if (!parentContainer) {
            console.warn(`找不到ID为 ${parentId} 的父容器，将使用根容器作为父容器`);
            parentId = containerLayout.id; // 如果找不到指定的父容器，回退到根容器
          } else if (parentContainer.type !== 'container') {
            console.warn(`ID为 ${parentId} 的元素不是容器类型: ${parentContainer.type}，将使用根容器作为父容器`);
            parentId = containerLayout.id; // 如果找到的元素不是容器，回退到根容器
          } else {
            console.log(`找到有效的父容器: ${parentContainer.type} - ${parentContainer.id}`);
          }
        } else if (!parentId && containerLayout) {
          // 如果没有指定父容器，使用根容器
          parentId = containerLayout.id;
          console.log(`没有指定父容器，使用根容器: ${parentId}`);
        }
        
        // 调用回调函数添加容器
        console.log(`调用onAddContainer，父容器ID: ${parentId || '无(根容器)'}`);
        let containerId;
        
        // 如果是来自行为序列且有预定义的result ID，优先使用它
        if (params._predefinedId) {
          console.log(`使用预定义的容器ID: ${params._predefinedId}`);
          containerId = params._predefinedId;
          
          // 调用回调函数时传入预定义ID
          await this.callbacks.onAddContainer(
            elements,
            parentId,
            containerId
          );
        } else {
          // 否则正常调用回调函数
          containerId = await this.callbacks.onAddContainer(
            elements,
            parentId
          );
        }
        
        console.log(`容器添加结果，返回ID: ${containerId}`);
        
        // 确保状态已更新
        setTimeout(() => {
          const updatedLayout = this._getGlobalLayout();
          if (updatedLayout) {
            // 确保全局状态已更新
            console.log('容器添加完成后确认全局状态已更新');
            this._notifyStateUpdate({
              layout: updatedLayout,
              selectedElementId: containerId || layoutState.getSelectedElementId()
            });
          }
        }, 50);
        
        return containerId;
      
      case 'removeComponent':
        return this.callbacks.onRemoveComponent(
          params.elementId
        );
      
      default:
        throw new Error(`未知的组件动作: ${actionId}`);
    }
  }
  
  /**
   * 执行预设相关动作
   * @private
   */
  async _executePresetAction(actionId, params) {
    switch (actionId) {
      case 'applyPreset':
        // 添加参数验证
        if (!params.elementId) {
          throw new Error('应用预设失败: 缺少元素ID');
        }
        if (!params.presetCategory) {
          throw new Error('应用预设失败: 缺少预设类别');
        }
        if (!params.presetKey) {
          throw new Error('应用预设失败: 缺少预设键名');
        }
        
        // 检查回调函数是否存在
        if (!this.callbacks.onApplyPreset || typeof this.callbacks.onApplyPreset !== 'function') {
          console.error('应用预设回调函数未定义或不是函数');
          throw new Error('应用预设回调函数未正确配置');
        }
        
        // 获取全局布局和检查元素是否存在
        const presetLayout = this._getGlobalLayout();
        console.log(`_executePresetAction: 全局布局状态:`, presetLayout ? '存在' : '不存在');
        
        // 如果全局布局存在，验证元素是否存在
        if (presetLayout) {
          let elementExists = false;
          
          // 递归查找元素
          const findElement = (layout, id) => {
            if (layout.id === id) return true;
            if (layout.children) {
              for (const child of layout.children) {
                if (findElement(child, id)) return true;
              }
            }
            return false;
          };
          
          elementExists = findElement(presetLayout, params.elementId);
          console.log(`_executePresetAction: 元素 ${params.elementId} 在全局布局中${elementExists ? '存在' : '不存在'}`);
        }
        
        // 使用延迟重试机制
        let retryCount = 0;
        const maxRetries = 3;
        const retryDelay = 200;
        
        const applyPresetWithRetry = async () => {
          try {
            // 检查全局布局状态 
            const globalLayout = this._getGlobalLayout();
            if (!globalLayout && retryCount < maxRetries) {
              console.log(`全局布局状态为空，将在 ${retryDelay}ms 后重试... (${retryCount + 1}/${maxRetries})`);
              retryCount++;
              
              // 等待一段时间后重试
              await new Promise(resolve => setTimeout(resolve, retryDelay));
              return applyPresetWithRetry();
            }
            
            console.log(`开始应用预设到元素 ${params.elementId}: ${params.presetCategory}.${params.presetKey}`);
            const result = await this.callbacks.onApplyPreset(
              params.elementId,
              params.presetCategory,
              params.presetKey
            );
            console.log(`预设应用结果:`, result !== undefined ? '成功' : '无返回值');
            return result;
          } catch (error) {
            console.error(`应用预设失败 (尝试 ${retryCount + 1}/${maxRetries}):`, error.message);
            
            // 如果是布局为空错误且还有重试机会
            if (error.message.includes('布局为空') && retryCount < maxRetries) {
              retryCount++;
              console.log(`将在 ${retryDelay}ms 后重试应用预设...`);
              
              // 等待一段时间后重试
              await new Promise(resolve => setTimeout(resolve, retryDelay));
              return applyPresetWithRetry();
            }
            
            // 重试次数用完或不是布局为空错误，抛出
            throw error;
          }
        };
        
        return applyPresetWithRetry();
      
      default:
        throw new Error(`未知的预设动作: ${actionId}`);
    }
  }
  
  /**
   * 执行属性相关动作
   * @private
   */
  async _executePropertyAction(actionId, params) {
    switch (actionId) {
      case 'updateElementStyle':
        return this.callbacks.onUpdateElementStyle(
          params.elementId,
          params.property,
          params.value
        );
      
      case 'updateElementContent':
        return this.callbacks.onUpdateElementContent(
          params.elementId,
          params.contentProperty,
          params.value
        );
      
      default:
        throw new Error(`未知的属性动作: ${actionId}`);
    }
  }
  
  /**
   * 执行移动相关动作
   * @private
   */
  async _executeMovementAction(actionId, params) {
    switch (actionId) {
      case 'moveElement':
        return this.callbacks.onMoveElement(
          params.elementId,
          params.targetContainerId,
          params.position
        );
      
      case 'moveElementToSibling':
        return this.callbacks.onMoveElementToSibling(
          params.elementId,
          params.siblingId,
          params.position
        );
      
      default:
        throw new Error(`未知的移动动作: ${actionId}`);
    }
  }
  
  /**
   * 执行组合动作
   * @private
   */
  async _executeCompositeAction(actionId, params) {
    switch (actionId) {
      case 'sequence':
        const results = [];
        for (const actionItem of params.actions) {
          const result = await this.executeAction(
            actionItem.category,
            actionItem.actionId,
            actionItem.params
          );
          results.push(result);
        }
        return results;
      
      case 'conditional':
        const conditionResult = await this._evaluateCondition(params.condition);
        if (conditionResult) {
          return this.executeAction(
            params.thenAction.category,
            params.thenAction.actionId,
            params.thenAction.params
          );
        } else if (params.elseAction) {
          return this.executeAction(
            params.elseAction.category,
            params.elseAction.actionId,
            params.elseAction.params
          );
        }
        return null;
      
      default:
        throw new Error(`未知的组合动作: ${actionId}`);
    }
  }
  
  /**
   * 验证动作参数
   * @private
   */
  _validateParams(actionDef, params) {
    if (!actionDef.parameters) return;
    
    // 特殊处理addComponent动作的兼容性
    if (actionDef.parameters.some(p => p.name === 'componentType') && 
        params.elementData && params.elementData.type && !params.componentType) {
      // 如果有elementData.type但没有componentType，自动设置componentType
      console.log('从elementData.type自动设置componentType:', params.elementData.type);
      params.componentType = params.elementData.type;
    }
    
    actionDef.parameters.forEach(paramDef => {
      if (paramDef.required && (params[paramDef.name] === undefined)) {
        throw new Error(`缺少必需参数: ${paramDef.name}`);
      }
      
      // 使用默认值
      if (params[paramDef.name] === undefined && paramDef.default !== undefined) {
        params[paramDef.name] = paramDef.default;
      }
      
      // 类型检查可以在这里实现
      // ...
    });
  }
  
  /**
   * 评估条件
   * @private
   */
  async _evaluateCondition(condition) {
    if (!condition || !condition.type) {
      return false;
    }
    
    switch (condition.type) {
      case 'propertyEquals':
        // 假设有一个查询元素属性的辅助函数
        return false; // 实际实现会检查元素属性
      
      case 'elementExists':
        // 假设有一个检查元素是否存在的辅助函数
        return false; // 实际实现会检查元素是否存在
      
      case 'hasChildren':
        // 假设有一个检查元素是否有子元素的辅助函数
        return false; // 实际实现会检查元素是否有子元素
      
      default:
        return false;
    }
  }
  
  /**
   * 记录动作
   * @private
   */
  _recordAction(category, actionId, params, result) {
    recordingState.actions.push({
      timestamp: Date.now() - recordingState.startTime,
      category,
      actionId,
      params: JSON.parse(JSON.stringify(params)), // 深拷贝参数
      result: result !== undefined ? JSON.parse(JSON.stringify(result)) : undefined
    });
  }
  
  // ===== 录制和回放功能 =====
  
  /**
   * 开始录制用户动作
   * @param {string} recordingName - 录制会话名称
   * @returns {boolean} - 是否成功开始录制
   */
  startRecording(recordingName) {
    if (recordingState.isRecording) {
      this.callbacks.onError('当前已有录制正在进行');
      return false;
    }
    
    recordingState.isRecording = true;
    recordingState.recordingName = recordingName;
    recordingState.actions = [];
    recordingState.startTime = Date.now();
    
    return true;
  }
  
  /**
   * 停止录制用户动作
   * @returns {Object} - 录制的动作序列
   */
  stopRecording() {
    if (!recordingState.isRecording) {
      this.callbacks.onError('当前没有录制正在进行');
      return null;
    }
    
    const recording = {
      name: recordingState.recordingName,
      startTime: recordingState.startTime,
      endTime: Date.now(),
      duration: Date.now() - recordingState.startTime,
      actions: [...recordingState.actions]
    };
    
    // 重置录制状态
    recordingState.isRecording = false;
    recordingState.recordingName = '';
    recordingState.actions = [];
    recordingState.startTime = null;
    
    return recording;
  }
  
  /**
   * 保存录制的动作序列
   * @param {string} sequenceName - 序列名称
   * @param {Array} actionSequence - 动作序列
   * @returns {boolean} - 是否保存成功
   */
  saveRecordedSequence(sequenceName, actionSequence) {
    if (!sequenceName || !actionSequence || !Array.isArray(actionSequence)) {
      this.callbacks.onError('无效的序列名称或动作序列');
      return false;
    }
    
    savedSequences[sequenceName] = JSON.parse(JSON.stringify(actionSequence));
    return true;
  }
  
  /**
   * 加载已保存的动作序列
   * @param {string} sequenceName - 序列名称
   * @returns {Array|null} - 动作序列或null（如果不存在）
   */
  loadRecordedSequence(sequenceName) {
    if (!savedSequences[sequenceName]) {
      this.callbacks.onError(`找不到序列: ${sequenceName}`);
      return null;
    }
    
    return JSON.parse(JSON.stringify(savedSequences[sequenceName]));
  }
  
  /**
   * 回放动作序列
   * @param {Array} actionSequence - 动作序列
   * @param {number} speed - 回放速度倍率
   * @returns {Promise<boolean>} - 回放是否成功
   */
  async playRecordedSequence(actionSequence, speed = 1.0) {
    if (!actionSequence || !Array.isArray(actionSequence)) {
      this.callbacks.onError('无效的动作序列');
      return false;
    }
    
    try {
      console.log(`开始回放动作序列，共 ${actionSequence.length} 个动作，速度倍率: ${speed}`);
      let previousTimestamp = 0;
      let results = [];
      
      for (let i = 0; i < actionSequence.length; i++) {
        const actionRecord = actionSequence[i];
        const { timestamp, category, actionId, params, result } = actionRecord;
        
        console.log(`执行动作 ${i+1}/${actionSequence.length}: ${category}.${actionId}`);
        console.log('参数:', JSON.stringify(params, null, 2));
        
        // 计算等待时间
        const delay = (timestamp - previousTimestamp) / speed;
        if (delay > 0) {
          console.log(`等待 ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
        
        // 执行动作（不记录回放的动作）
        const wasRecording = recordingState.isRecording;
        if (wasRecording) {
          recordingState.isRecording = false;
        }
        
        try {
          // 如果动作有预定义的结果ID，添加到参数中
          const executeParams = { ...params };
          
          // 为addContainer添加预定义ID
          if (category === 'componentActions' && actionId === 'addContainer' && result) {
            executeParams._predefinedId = result;
            console.log(`为addContainer动作添加预定义ID: ${result}`);
          }
          
          const actionResult = await this.executeAction(category, actionId, executeParams);
          console.log(`动作 ${i+1} 执行结果:`, actionResult);
          results.push(actionResult);
          
          // 检查是否成功执行
          if (actionResult === undefined || actionResult === null) {
            console.warn(`警告: 动作 ${i+1} 没有返回结果`);
          }
        } catch (error) {
          console.error(`动作 ${i+1} 执行失败:`, error);
          this.callbacks.onError(`执行动作 ${category}.${actionId} 失败: ${error.message}`);
          // 我们继续执行下一个动作，但记录失败
          results.push(null);
        }
        
        if (wasRecording) {
          recordingState.isRecording = true;
        }
        
        previousTimestamp = timestamp;
      }
      
      console.log('动作序列回放完成，成功执行动作数量:', results.filter(r => r !== null).length);
      
      // 检查回放结果
      const successCount = results.filter(r => r !== null).length;
      const isFullySuccessful = successCount === actionSequence.length;
      
      if (!isFullySuccessful) {
        console.warn(`回放完成，但有 ${actionSequence.length - successCount} 个动作执行失败`);
      }
      
      return isFullySuccessful;
    } catch (error) {
      this.callbacks.onError(`回放动作序列失败: ${error.message}`);
      console.error('回放动作序列失败:', error);
      return false;
    }
  }
  
  /**
   * 导出动作序列到文件
   * @param {string} sequenceName - 要导出的序列名称
   * @param {Object} markdownData - 可选的Markdown数据
   * @returns {Object} 导出的序列数据
   */
  exportSequenceToFile(sequenceName, markdownData = null) {
    if (!savedSequences[sequenceName]) {
      this.callbacks.onError(`找不到序列: ${sequenceName}`);
      return null;
    }
    
    const sequence = savedSequences[sequenceName];
    
    // 获取画布尺寸
    const canvasSize = layoutState.getCanvasSize();
    
    const metadata = {
      name: sequenceName,
      version: "1.0.0",
      exportDate: new Date().toISOString(),
      source: "aigui-environment-emulator",
      actionsCount: sequence.length,
      hasMarkdownData: !!markdownData,
      canvasWidth: canvasSize.width,
      canvasHeight: canvasSize.height
    };
    
    // 创建导出数据的副本
    let exportData = {
      metadata,
      actions: []
    };
    
    // 清理序列数据中的冗余字段
    exportData.actions = sequence.map(action => {
      const cleanedAction = { ...action };
      
      // 处理addComponent动作中的参数
      if (action.category === 'componentActions' && action.actionId === 'addComponent' && action.params) {
        const cleanedParams = { ...action.params };
        
        // 如果存在elementData.type，则移除冗余的componentType字段
        if (cleanedParams.elementData && cleanedParams.elementData.type && cleanedParams.componentType) {
          const { componentType, ...restParams } = cleanedParams;
          cleanedAction.params = restParams;
        }
      }
      
      return cleanedAction;
    });
    
    // 如果提供了 Markdown 数据，添加到导出内容中
    if (markdownData) {
      // 创建 Markdown 数据的深拷贝
      const markdownDataCopy = {
        markdownText: markdownData.markdownText || '',
        markdownElements: markdownData.markdownElements ? 
          JSON.parse(JSON.stringify(markdownData.markdownElements)) : []
      };
      
      // 应用标准化 ID 到 Markdown 元素
      if (markdownDataCopy.markdownElements && markdownDataCopy.markdownElements.length > 0) {
        // 创建 ID 映射
        const idMapping = {};
        
        // 更新 Markdown 元素的 ID
        markdownDataCopy.markdownElements = markdownDataCopy.markdownElements.map(element => {
          const oldId = element.id;
          const newElement = { ...element };
          newElement.id = this.generateStandardElementId(newElement);
          if (oldId) {
            idMapping[oldId] = newElement.id;
          }
          return newElement;
        });
        
        // 更新动作中的 ID 引用
        exportData.actions = this.updateActionIds(exportData.actions, idMapping);
      }
      
      // 添加到导出数据
      exportData.markdownData = markdownDataCopy;
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const fileName = `aigui-sequence-${sequenceName}-${new Date().toISOString().slice(0, 10)}.json`;
    
    return { fileName, blob };
  }
  
  /**
   * 从文件导入动作序列
   * @param {File} file - 包含动作序列的 JSON 文件
   * @returns {Promise<Object>} - 导入结果，包含序列名称和动作数组
   */
  importSequenceFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          
          // 验证导入的数据
          if (!data.metadata || !data.actions || !Array.isArray(data.actions)) {
            throw new Error('无效的序列文件格式');
          }
          
          const sequenceName = data.metadata.name || `imported-${new Date().toISOString().slice(0, 10)}`;
          
          // 保存导入的序列
          const success = this.saveRecordedSequence(sequenceName, data.actions);
          
          if (success) {
            resolve({
              success: true,
              sequenceName,
              actions: data.actions,
              metadata: data.metadata,
              markdownData: data.markdownData || null
            });
          } else {
            reject(new Error('保存导入的序列失败'));
          }
        } catch (error) {
          reject(new Error(`解析序列文件失败: ${error.message}`));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('读取文件失败'));
      };
      
      reader.readAsText(file);
    });
  }
  
  /**
   * 生成确定性元素 ID
   * 基于元素内容和类型生成一个标准化的 ID
   * @param {Object} element - 元素对象
   * @param {string} prefix - ID 前缀
   * @returns {string} - 生成的元素 ID
   */
  generateStandardElementId(element, prefix = 'element') {
    if (!element) return `${prefix}_unknown`;
    
    let idComponents = [prefix, element.type];
    
    // 创建一个哈希函数 - 简化版本
    const simpleHash = (str) => {
      if (!str) return '';
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // 转换为 32bit 整数
      }
      return Math.abs(hash).toString(16).substring(0, 8); // 转为16进制字符串并取前8位
    };
    
    // 内容特征
    let contentString = '';
    if (element.content) {
      if (typeof element.content === 'string') {
        contentString = element.content;
      } else if (element.content.text) {
        contentString = element.content.text;
      } else if (element.content.value) {
        contentString = element.content.value.toString();
      }
    }
    
    // 添加额外特征字符串（预设、名称等）
    let featureString = '';
    
    // 添加名称特征
    if (element.name) {
      featureString += element.name;
    }
    
    // 添加预设特征
    const presetKeys = Object.keys(element).filter(key => key.endsWith('Preset'));
    presetKeys.forEach(key => {
      if (element[key]) {
        featureString += `${key}:${element[key]};`;
      }
    });
    
    // 创建唯一内容哈希
    const contentHash = contentString ? simpleHash(contentString) : '';
    const featureHash = featureString ? simpleHash(featureString) : '';
    
    // 添加哈希到ID组件
    if (contentHash) {
      idComponents.push(contentHash);
    }
    
    if (featureHash) {
      idComponents.push(featureHash);
    }
    
    // 如果没有足够的唯一性，添加一个确定性标识符（不使用随机数或时间戳）
    if (idComponents.length < 3) {
      idComponents.push('0');
    }
    
    // 为容器类型添加时间戳，确保唯一性
    if (element.type === 'container') {
      // 添加时间戳部分（最后4位）以确保唯一性
      const timestamp = Date.now().toString().slice(-4);
      idComponents.push(timestamp);
    }
    
    return idComponents.join('_');
  }
  
  /**
   * 重新应用标准 ID 到元素树
   * @param {Object} element - 元素对象
   * @param {Object} idMapping - 旧ID到新ID的映射（可选）
   * @returns {Object} - 带有标准ID的元素对象
   */
  applyStandardIds(element, idMapping = {}) {
    if (!element) return null;
    
    const newElement = { ...element };
    const oldId = newElement.id;
    
    // 生成新ID
    newElement.id = this.generateStandardElementId(newElement);
    
    // 更新ID映射
    if (oldId) {
      idMapping[oldId] = newElement.id;
    }
    
    // 递归处理子元素
    if (newElement.children && Array.isArray(newElement.children)) {
      newElement.children = newElement.children.map(child => 
        this.applyStandardIds(child, idMapping)
      );
    }
    
    return newElement;
  }
  
  /**
   * 更新动作序列中的 ID 引用
   * @param {Array} actions - 动作数组
   * @param {Object} idMapping - 旧ID到新ID的映射
   * @returns {Array} - 更新了ID引用的动作数组
   */
  updateActionIds(actions, idMapping) {
    if (!actions || !Array.isArray(actions)) return actions;
    
    return actions.map(action => {
      const newAction = { ...action };
      
      if (newAction.params) {
        let newParams = { ...newAction.params };
        
        // 更新常见ID参数
        const idParams = ['elementId', 'parentId', 'targetContainerId', 'siblingId'];
        idParams.forEach(param => {
          if (newParams[param] && idMapping[newParams[param]]) {
            newParams[param] = idMapping[newParams[param]];
          }
        });
        
        // 更新元素数据中的ID
        if (newParams.elementData && newParams.elementData.id && idMapping[newParams.elementData.id]) {
          newParams.elementData = {
            ...newParams.elementData,
            id: idMapping[newParams.elementData.id]
          };
        }
        
        // 移除冗余的componentType字段，如果elementData.type已存在
        if (action.category === 'componentActions' && action.actionId === 'addComponent') {
          if (newParams.elementData && newParams.elementData.type && newParams.componentType) {
            const { componentType, ...restParams } = newParams;
            newParams = restParams;
          }
        }
        
        newAction.params = newParams;
      }
      
      return newAction;
    });
  }
  
  /**
   * 删除当前布局
   * @returns {Promise<boolean>} - 是否删除成功
   */
  async clearCurrentLayout() {
    try {
      // 我们假设有一个回调函数来清除布局
      if (this.callbacks.onClearLayout) {
        await this.callbacks.onClearLayout();
        return true;
      }
      return false;
    } catch (error) {
      this.callbacks.onError(`清除布局失败: ${error.message}`);
      return false;
    }
  }
  
  /**
   * 导入并执行序列（先清除布局）
   * @param {File} file - 包含动作序列的 JSON 文件
   * @param {number} speed - 回放速度倍率
   * @returns {Promise<Object>} - 执行结果
   */
  async importAndExecuteSequence(file, speed = 1.0) {
    try {
      console.log('开始导入并执行序列...');
      // 先导入序列
      const importResult = await this.importSequenceFromFile(file);
      
      if (!importResult.success) {
        throw new Error('导入序列失败');
      }
      
      console.log('成功导入序列，包含动作数量:', importResult.actions.length);
      
      // 预处理导入的动作序列，确保兼容性
      importResult.actions = importResult.actions.map(action => {
        // 深拷贝动作对象
        const processedAction = JSON.parse(JSON.stringify(action));
        
        // 特别处理addComponent动作
        if (processedAction.category === 'componentActions' && 
            processedAction.actionId === 'addComponent' && 
            processedAction.params) {
          
          // 检查是否缺少必需的componentType参数
          if (!processedAction.params.componentType && 
              processedAction.params.elementData && 
              processedAction.params.elementData.type) {
            
            // 从elementData.type自动设置componentType
            console.log(`为动作添加缺少的componentType参数: ${processedAction.params.elementData.type}`);
            processedAction.params.componentType = processedAction.params.elementData.type;
          }
        }
        
        return processedAction;
      });
      
      console.log('预处理动作序列完成，确保参数兼容性');
      
      // 如果序列包含画布尺寸信息，应用它
      if (importResult.metadata && 
          importResult.metadata.canvasWidth && 
          importResult.metadata.canvasHeight) {
        
        console.log('应用导入序列中的画布尺寸设置:', 
          importResult.metadata.canvasWidth, 'x', importResult.metadata.canvasHeight);
          
        // 更新全局状态中的画布尺寸
        layoutState.updateCanvasSize(
          importResult.metadata.canvasWidth,
          importResult.metadata.canvasHeight
        );
      }
      
      // 清除当前布局
      const clearResult = await this.clearCurrentLayout();
      
      if (!clearResult) {
        throw new Error('清除布局失败，无法继续执行');
      }
      
      console.log('成功清除当前布局，准备执行动作序列');
      
      // 重置已使用元素状态 - 移到这里，确保在应用Markdown数据前重置
      if (this.callbacks.onResetUsedElements) {
        await this.callbacks.onResetUsedElements();
        console.log('已重置使用过的元素状态');
      }
      
      // 创建ID映射（旧ID到新ID）
      const idMapping = {};
      let keepOriginalIds = true; // 增加一个标志，表示是否保留原始ID，当从Python模型导入时需要保留原始ID
      
      // 检查数据源是否为模型服务导出的
      if (importResult.metadata && importResult.metadata.source === 'aigui-model-service') {
        console.log('检测到从模型服务导入的序列，将保留原始ID');
        keepOriginalIds = true;
      }
      
      // 如果有 Markdown 数据，先应用 Markdown 数据，并根据设置决定是否更新ID
      if (importResult.markdownData && this.callbacks.onSetMarkdownData) {
        console.log('检测到Markdown数据，准备应用...');
        
        // 更新或保留Markdown元素中的ID
        if (importResult.markdownData.markdownElements) {
          // 如果需要保留原始ID
          if (keepOriginalIds) {
            console.log('将保留原始Markdown元素ID');
            // 不重新生成ID，但仍然创建ID映射（相同的ID映射到自身）
            for (const element of importResult.markdownData.markdownElements) {
              idMapping[element.id] = element.id;
            }
            console.log('.... idMapping')
            console.log(idMapping)
          } else {
            // 原始逻辑：生成新ID
            const updatedElements = [];
            
            for (const element of importResult.markdownData.markdownElements) {
              const oldId = element.id;
              const newElement = { ...element };
              newElement.id = this.generateStandardElementId(newElement);
              idMapping[oldId] = newElement.id;
              updatedElements.push(newElement);
            }
            
            importResult.markdownData.markdownElements = updatedElements;
            console.log('已更新Markdown元素ID');
          }
        }
        
        // 设置Markdown数据
        await this.callbacks.onSetMarkdownData(importResult.markdownData);
        console.log('已成功设置Markdown数据');
      }
      
      // 更新动作序列中的ID引用
      let updatedActions = importResult.actions;
      
      // 只有在不保留原始ID的情况下才更新ID引用
      if (!keepOriginalIds) {
        console.log('更新动作序列中的ID引用...');
        updatedActions = this.updateActionIds(importResult.actions, idMapping);
        console.log('ID更新完成');
      } else {
        console.log('保留原始ID，不更新ID引用');
      }
      
      console.log('准备执行动作序列');
      
      // 强制执行第一个根容器动作，确保后续动作有正确的父容器
      if (updatedActions.length > 0 && 
          updatedActions[0].category === 'componentActions' && 
          updatedActions[0].actionId === 'addContainer') {
        
        console.log('开始执行根容器创建动作');
        const firstAction = updatedActions[0];
        
        // 确保_predefinedId已设置为原始的result值
        if (firstAction.result && !firstAction.params._predefinedId) {
          firstAction.params._predefinedId = firstAction.result;
          console.log(`设置根容器预定义ID: ${firstAction.result}`);
        }
        
        // 创建ID到索引的映射，用于跟踪已执行的容器
        const containerIdMapping = {};
        
        const rootContainerId = await this.executeAction(
          firstAction.category, 
          firstAction.actionId, 
          firstAction.params
        );
        
        console.log('根容器创建结果:', rootContainerId);
        containerIdMapping[firstAction.result] = rootContainerId;
        
        // 给布局状态更新一些时间
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // 执行其余动作
        if (updatedActions.length > 1) {
          console.log(`开始执行剩余的 ${updatedActions.length - 1} 个动作`);
          
          // 将剩余的动作按照容器嵌套顺序重新排序
          // 确保父容器在子容器之前创建
          const remainingActions = updatedActions.slice(1).map(action => {
            // 为addContainer操作添加预定义ID
            if (action.category === 'componentActions' && 
                action.actionId === 'addContainer' && 
                action.result && 
                !action.params._predefinedId) {
              return {
                ...action,
                params: {
                  ...action.params,
                  _predefinedId: action.result
                }
              };
            }
            return action;
          });
          
          // 确保按照正确的父子关系顺序执行容器创建操作
          const reorderedActions = [];
          const containersToProcess = remainingActions.filter(a => 
            a.category === 'componentActions' && a.actionId === 'addContainer'
          );
          const otherActions = remainingActions.filter(a => 
            !(a.category === 'componentActions' && a.actionId === 'addContainer')
          );
          
          // 创建容器ID到其动作的映射
          const containerActions = {};
          containersToProcess.forEach(action => {
            if (action.result) {
              containerActions[action.result] = action;
            }
          });
          
          // 处理顺序：首先添加直接子容器，然后添加子容器的子容器，以此类推
          // 找出所有父容器ID为第一个容器的动作
          const processChildren = (parentId) => {
            const children = containersToProcess.filter(a => 
              a.params.parentId === parentId && !reorderedActions.includes(a)
            );
            
            for (const child of children) {
              if (!reorderedActions.includes(child)) {
                reorderedActions.push(child);
                // 递归处理这个子容器的子容器
                if (child.result) {
                  processChildren(child.result);
                }
              }
            }
          };
          
          // 从根容器开始处理
          processChildren(firstAction.result);
          
          // 添加任何其他未处理的容器动作（可能是因为parentId不存在等原因）
          containersToProcess.forEach(action => {
            if (!reorderedActions.includes(action)) {
              console.warn(`容器动作未在层级处理中包含，parentId: ${action.params.parentId}`);
              reorderedActions.push(action);
            }
          });
          
          // 最后添加其他非容器动作
          reorderedActions.push(...otherActions);
          
          console.log(`动作已重新排序，先处理容器层次结构`);
          
          const playResult = await this.playRecordedSequence(reorderedActions, speed);
          
          // 最终验证
          await new Promise(resolve => setTimeout(resolve, 300));
          
          if (!playResult) {
            console.warn('部分动作执行失败，但继续处理');
          }
        }
        
        return {
          success: true,
          sequenceName: importResult.sequenceName,
          actionsCount: importResult.actions.length,
          hasMarkdownData: !!importResult.markdownData,
          rootContainerId: rootContainerId
        };
      } else {
        // 如果没有根容器动作，正常执行整个序列
        console.log('未检测到根容器动作，执行完整序列');
        const playResult = await this.playRecordedSequence(updatedActions, speed);
        
        return {
          success: playResult,
          sequenceName: importResult.sequenceName,
          actionsCount: importResult.actions.length,
          hasMarkdownData: !!importResult.markdownData
        };
      }
    } catch (error) {
      this.callbacks.onError(`导入并执行序列失败: ${error.message}`);
      console.error('导入并执行序列失败:', error);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * 递归查找容器的辅助函数
   * @private
   */
  _findContainer(layout, id) {
    if (!layout) return null;
    if (layout.id === id) return layout;
    if (layout.children) {
      for (const child of layout.children) {
        const found = this._findContainer(child, id);
        if (found) return found;
      }
    }
    return null;
  }
  
  /**
   * 获取全局布局状态
   * @private
   */
  _getGlobalLayout() {
    return layoutState.getLayout();
  }
  
  /**
   * 清理资源
   */
  dispose() {
    // 清理全局状态监听器
    if (this._unregisterListener) {
      this._unregisterListener();
      this._unregisterListener = null;
    }
  }
}

export default ActionExecutor; 