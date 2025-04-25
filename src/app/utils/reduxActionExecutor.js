/**
 * AIGUI 基于 Redux 的动作执行系统
 * 
 * 负责执行动作配置中定义的各种动作，并提供录制和回放功能
 * 这个版本使用 Redux 进行状态管理，以确保全局状态的一致性
 */
import { getActionDefinition } from './actionConfig.js';
import { store, actions } from './reduxStore.js'; // 导入 Redux store
import { applyPresetToElement } from './presets/presetSystem.js'; // 导入 applyPresetToElement 函数

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
 * 动作执行器类 - Redux 版本
 */
class ReduxActionExecutor {
  constructor(callbacks = {}) {
    // 存储回调函数
    this.callbacks = {
      // 组件动作回调
      onAddComponent: callbacks.onAddComponent || (() => {}),
      onAddContainer: callbacks.onAddContainer || (() => {}),
      onRemoveComponent: callbacks.onRemoveComponent || (() => {}),
      
      // 预设动作回调
      onApplyPreset: callbacks.onApplyPreset || ((elementId, category, presetKey) => {
        // 如果没有提供预设应用函数，使用导入的 applyPresetToElement
        console.warn('未提供 onApplyPreset 回调，使用默认 applyPresetToElement 函数');
        // 这里无法直接应用，因为需要布局信息，仅作为应急方案
        return Promise.resolve(elementId);
      }),
      
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
      onStateUpdated: callbacks.onStateUpdated || (() => {}),
      
      // 更新Markdown数据到Redux回调
      onUpdateMarkdownData: callbacks.onUpdateMarkdownData || (() => {}),
    };
    
    // 提供 applyPresetToElement 函数给组件
    this.applyPresetToElement = applyPresetToElement;
    
    // 绑定方法
    this.executeAction = this.executeAction.bind(this);
    this.executeActionByType = this.executeActionByType.bind(this);
    this.startRecording = this.startRecording.bind(this);
    this.stopRecording = this.stopRecording.bind(this);
    this.saveRecordedSequence = this.saveRecordedSequence.bind(this);
    this.loadRecordedSequence = this.loadRecordedSequence.bind(this);
    this.playRecordedSequence = this.playRecordedSequence.bind(this);
    
    // 注册 Redux 状态监听器
    this._setupReduxStateListeners();
  }
  
  /**
   * 设置 Redux 状态监听器
   * @private
   */
  _setupReduxStateListeners() {
    // 使用 Redux store 的 subscribe 机制，当状态更新时通知组件
    this._unsubscribe = store.subscribe(() => {
      // 当 Redux store 状态改变时，通知组件更新本地状态
      console.log('Redux 状态已更新，通知组件同步状态');
      this._notifyStateUpdate(store.getState());
    });
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
  async executeAction(category, actionId, params = {}, res = null) {
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
      const result = await this.executeActionByType(category, actionId, params, res);
      
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
  async executeActionByType(category, actionId, params, res) {
    switch (category) {
      case 'componentActions':
        return this._executeComponentAction(actionId, params, res);
      
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
  async _executeComponentAction(actionId, params, res) {
    switch (actionId) {
      case 'addComponent':
        console.log('执行addComponent动作, 参数:', params);
        
        // 确保有父容器ID
        if (!params.parentId) {
          const state = store.getState();
          const selectedElementId = state.selectedElementId;
          const currentLayout = state.layout;
          
          if (!currentLayout) {
            console.error('添加组件失败：找不到有效的布局');
            throw new Error('请先添加一个容器');
          }
          
          // 使用全局选中的元素ID或根布局ID
          params.parentId = selectedElementId || currentLayout.id;
          console.log(`没有提供父容器ID，使用Redux状态：${params.parentId}`);
        }
        
        // 检查父容器是否存在且是有效的容器类型
        const currentLayout = this._getReduxLayout();
        if (!currentLayout) {
          console.error('添加组件失败：找不到有效的布局');
          throw new Error('请先添加一个容器');
        }
        
        // 添加组件
        const result = await this.callbacks.onAddComponent(
          params.parentId,
          params.componentType,
          params.elementData
        );
        
        return result;
      
      case 'addContainer':
        // 执行添加容器的动作
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
        const containerLayout = this._getReduxLayout();
        
        // 提前处理特殊情况：当有指定result且parentId为null时，说明这是一个要作为root的container
        // 这个逻辑优先级更高，应该在检查parentId之前执行
        let predefinedContainerId = null;
        if (res) {
          // 如果有result字段，我们应该使用它作为容器ID
          predefinedContainerId = res;
          console.log(`检测到指定的容器ID: ${predefinedContainerId}，${parentId ? '子容器' : '根容器'}`);
        }
        
        // 如果没有指定父容器ID，检查是否有选中容器
        if (!parentId) {
          // 尝试使用选中的元素作为父容器
          const selectedElementId = store.getState().selectedElementId;
          
          if (selectedElementId && containerLayout) {
            const selectedElement = this._findContainer(containerLayout, selectedElementId);
            
            if (selectedElement && selectedElement.type === 'container') {
              parentId = selectedElementId;
              console.log(`使用选中的容器作为父容器: ${parentId}`);
            } else {
              // 如果选中的不是容器，使用根容器
              parentId = containerLayout?.id;
              console.log(`选中的元素不是容器，使用根容器: ${parentId}`);
            }
          } else if (containerLayout && containerLayout.id) {
            // 如果没有选中元素，使用根容器
            parentId = containerLayout.id;
            console.log(`没有选中元素，使用根容器: ${parentId}`);
          }
        }
        
        // 调用添加容器回调
        let containerId;
        if (predefinedContainerId) {
          // 如果有预定义ID，传递给回调以确保使用指定的ID
          containerId = await this.callbacks.onAddContainer(elements, parentId, predefinedContainerId);
        } else {
          containerId = await this.callbacks.onAddContainer(elements, parentId);
        }
        console.log('容器添加完成，ID:', containerId);
        
        // 添加元素ID到已使用列表
        if (elements && elements.length > 0) {
          const elementIds = elements.map(element => element.id).filter(Boolean);
          if (elementIds.length > 0) {
            // 这里需要更新 Redux 存储中的已使用元素列表
            store.dispatch(actions.updateUsedElementIds(elementIds));
          }
        }
        
        return containerId;
        
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
        const { elementId, presetCategory, presetKey } = params;
        
        if (!elementId) {
          throw new Error('缺少必要的元素ID');
        }
        
        if (!presetCategory) {
          throw new Error('缺少必要的预设类别');
        }
        
        if (!presetKey) {
          throw new Error('缺少必要的预设键名');
        }
        
        // 处理presetKey，确保不包含presetCategory前缀
        const cleanPresetKey = this._normalizePresetKey(presetCategory, presetKey);
        
        // 构建完整的预设名称
        const fullPresetName = `${presetCategory}:${cleanPresetKey}`;
        
        console.log(`应用预设: ${fullPresetName} 到元素 ${elementId}`);
        
        // 查找元素以确认它存在
        const layout = this._getReduxLayout();
        const findElement = (layout, id) => {
          if (layout.id === id) return layout;
          if (layout.children) {
            for (const child of layout.children) {
              const found = findElement(child, id);
              if (found) return found;
            }
          }
          return null;
        };
        
        const element = layout ? findElement(layout, elementId) : null;
        
        if (!element) {
          console.error(`找不到元素 ${elementId} 来应用预设`);
          throw new Error(`找不到元素 ${elementId}`);
        }
        
        // 使用重试机制应用预设
        const applyPresetWithRetry = async () => {
          let retries = 0;
          const maxRetries = 3;
          
          while (retries < maxRetries) {
            try {
              // 使用回调或默认的 applyPresetToElement 函数
              await this.callbacks.onApplyPreset(elementId, presetCategory, cleanPresetKey);
              console.log(`预设 ${fullPresetName} 已应用到元素 ${elementId}`);
              return elementId;
            } catch (error) {
              console.warn(`应用预设失败，尝试重试 (${retries + 1}/${maxRetries}): ${error.message}`);
              retries++;
              
              if (retries >= maxRetries) {
                throw error;
              }
              
              // 等待一段时间再重试
              await new Promise(resolve => setTimeout(resolve, 100));
            }
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
        const { elementId, property, value } = params;
        await this.callbacks.onUpdateElementStyle(elementId, property, value);
        return { elementId, property, value };
      
      case 'updateElementContent':
        const { elementId: id, contentProperty, value: val } = params;
        await this.callbacks.onUpdateElementContent(id, contentProperty, val);
        return { elementId: id, contentProperty, value: val };
      
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
        const { elementId, targetContainerId } = params;
        await this.callbacks.onMoveElement(elementId, targetContainerId);
        return { elementId, targetContainerId };
      
      case 'moveElementToSibling':
        const { elementId: id, siblingId, position } = params;
        await this.callbacks.onMoveElementToSibling(id, siblingId, position);
        return { elementId: id, siblingId, position };
      
      default:
        throw new Error(`未知的移动动作: ${actionId}`);
    }
  }
  
  /**
   * 执行复合动作
   * @private
   */
  async _executeCompositeAction(actionId, params) {
    throw new Error('复合动作尚未实现');
  }
  
  /**
   * 验证动作参数
   * @private
   */
  _validateParams(actionDef, params) {
    if (!actionDef.params) return true;
    
    for (const param of actionDef.params) {
      if (param.required && (params[param.name] === undefined || params[param.name] === null)) {
        throw new Error(`缺少必要的参数: ${param.name}`);
      }
    }
    
    return true;
  }
  
  /**
   * 规范化预设键，确保不包含类别前缀
   * @private
   * @param {string} presetCategory - 预设类别
   * @param {string} presetKey - 预设键名
   * @returns {string} - 规范化后的预设键名
   */
  _normalizePresetKey(presetCategory, presetKey) {
    if (!presetKey || !presetCategory) return presetKey;
    
    // 检查presetKey是否包含类别前缀，如果包含则去除
    const prefixPattern = new RegExp(`^${presetCategory}:`);
    if (prefixPattern.test(presetKey)) {
      const normalizedKey = presetKey.replace(prefixPattern, '');
      console.log(`规范化presetKey，从 [${presetKey}] 修改为 [${normalizedKey}]`);
      return normalizedKey;
    }
    
    return presetKey;
  }
  
  /**
   * 记录动作
   * @private
   */
  _recordAction(category, actionId, params, result) {
    if (!recordingState.isRecording) return;
    
    const timestamp = Date.now();
    
    // 特殊处理预设动作参数，确保导出的presetKey不包含类别前缀
    let recordParams = { ...params };
    if (category === 'presetActions' && actionId === 'applyPreset' && recordParams.presetKey) {
      const { presetCategory, presetKey } = recordParams;
      recordParams = { 
        ...recordParams, 
        presetKey: this._normalizePresetKey(presetCategory, presetKey)
      };
    }
    
    const actionEntry = {
      category,
      actionId,
      params: recordParams,  // 使用处理过的参数
      result,
      timestamp,
      timeSinceStart: timestamp - recordingState.startTime
    };
    
    recordingState.actions.push(actionEntry);
    console.log(`动作已记录: ${category}.${actionId}`);
  }
  
  /**
   * 开始录制
   * @param {string} recordingName - 录制名称
   * @returns {boolean} - 是否成功开始录制
   */
  startRecording(recordingName) {
    if (recordingState.isRecording) {
      console.warn('已经在录制中');
      return false;
    }
    
    recordingState.isRecording = true;
    recordingState.recordingName = recordingName;
    recordingState.actions = [];
    recordingState.startTime = Date.now();
    
    console.log(`开始录制: ${recordingName}`);
    return true;
  }
  
  /**
   * 停止录制
   * @returns {Object|null} - 录制结果
   */
  stopRecording() {
    if (!recordingState.isRecording) {
      console.warn('没有进行中的录制');
      return null;
    }
    
    const duration = Date.now() - recordingState.startTime;
    const recording = {
      name: recordingState.recordingName,
      actions: [...recordingState.actions],
      duration,
      timestamp: Date.now()
    };
    
    // 重置录制状态
    recordingState.isRecording = false;
    recordingState.recordingName = '';
    recordingState.actions = [];
    recordingState.startTime = null;
    
    console.log(`录制停止: ${recording.name}，动作数量: ${recording.actions.length}`);
    return recording;
  }
  
  /**
   * 保存录制的序列
   * @param {string} sequenceName - 序列名称
   * @param {Array} actionSequence - 动作序列
   * @returns {boolean} - 是否成功保存
   */
  saveRecordedSequence(sequenceName, actionSequence) {
    if (!sequenceName || !actionSequence) {
      console.error('无效的序列名称或动作序列');
      return false;
    }
    
    savedSequences[sequenceName] = {
      name: sequenceName,
      actions: actionSequence,
      timestamp: Date.now()
    };
    
    console.log(`序列已保存: ${sequenceName}，动作数量: ${actionSequence.length}`);
    return true;
  }
  
  /**
   * 加载已保存的序列
   * @param {string} sequenceName - 序列名称
   * @returns {Object|null} - 加载的序列
   */
  loadRecordedSequence(sequenceName) {
    if (!sequenceName) {
      console.error('未提供序列名称');
      return null;
    }
    
    const sequence = savedSequences[sequenceName];
    if (!sequence) {
      console.error(`找不到名为 ${sequenceName} 的序列`);
      return null;
    }
    
    console.log(`加载序列: ${sequenceName}，动作数量: ${sequence.actions.length}`);
    return sequence;
  }
  
  /**
   * 回放录制的动作序列
   * @param {Array} actionSequence - 动作序列
   * @param {number} speed - 回放速度 (1.0 = 正常速度)
   * @returns {Promise<boolean>} - 是否成功回放
   */
  async playRecordedSequence(actionSequence, speed = 1.0) {
    if (!actionSequence || !Array.isArray(actionSequence) || actionSequence.length === 0) {
      console.error('无效的动作序列');
      return false;
    }
    
    console.log(`开始回放序列，动作数量: ${actionSequence.length}，速度: ${speed}x`);
    
    try {
      // 清除当前布局，如果需要从头开始
      if (this.callbacks.onClearLayout) {
        await this.callbacks.onClearLayout();
      }
      
      // 逐一执行动作
      for (let i = 0; i < actionSequence.length; i++) {
        const action = actionSequence[i];
        
        // 计算延迟时间 (使用固定延迟或基于记录的时间)
        const delay = 300 / speed; // 固定延迟，除以速度因子
        
        // 输出进度信息
        console.log(`执行动作 ${i + 1}/${actionSequence.length}: ${action.category}.${action.actionId}`);
        
        // 等待指定的延迟
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // 处理预设动作，确保presetKey格式正确
        let params = { ...action.params };
        if (action.category === 'presetActions' && action.actionId === 'applyPreset' && params.presetKey) {
          const { presetCategory, presetKey } = params;
          params.presetKey = this._normalizePresetKey(presetCategory, presetKey);
        }
        
        // 执行动作
        try {
          await this.executeAction(action.category, action.actionId, params, action.result);
        } catch (error) {
          console.error(`回放动作 ${action.category}.${action.actionId} 失败:`, error);
          // 继续执行其余动作
        }
      }
      
      console.log('序列回放完成');
      return true;
    } catch (error) {
      console.error('回放序列时出错:', error);
      return false;
    }
  }
  
  /**
   * 导出序列到文件
   * @param {string} sequenceName - 序列名称
   * @param {Object} markdownData - Markdown数据
   * @returns {Object|null} - 导出结果
   */
  exportSequenceToFile(sequenceName, markdownData = null) {
    const sequence = this.loadRecordedSequence(sequenceName);
    if (!sequence) {
      return null;
    }
    
    // 获取画布尺寸
    const { canvasWidth, canvasHeight } = store.getState();
    
    // 准备要导出的数据 - 使用旧格式
    const exportData = {
      metadata: {
        name: sequenceName,
        version: "1.0.0",
        exportDate: new Date().toISOString(),
        source: "aigui-environment-emulator",
        actionsCount: sequence.actions.length,
        hasMarkdownData: !!markdownData,
        canvasWidth: canvasWidth || 1024,
        canvasHeight: canvasHeight || 768
      },
      actions: sequence.actions.map(action => ({
        timestamp: action.timeSinceStart,
        category: action.category,
        actionId: action.actionId,
        params: action.params,
        result: action.result
      }))
    };
    
    // 如果提供了Markdown数据，也包含它
    if (markdownData) {
      exportData.markdownData = markdownData;
    }
    
    // 创建文件名
    const fileName = `layout_sequence_${sequenceName.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}.json`;
    
    // 创建Blob对象
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    
    return { fileName, blob };
  }
  
  /**
   * 从文件导入序列
   * @param {File} file - JSON文件
   * @returns {Promise<Object>} - 导入结果
   */
  async importSequenceFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          
          // 检查是否为新格式或旧格式
          let actions = [];
          let name = '';
          let markdownData = null;
          
          if (data.actions && Array.isArray(data.actions)) {
            // 旧格式 - actions 是顶级属性
            actions = data.actions.map(action => ({
              category: action.category,
              actionId: action.actionId,
              params: action.params,
              result: action.result,
              timestamp: Date.now(),
              timeSinceStart: action.timestamp || 0
            }));
            name = data.metadata?.name || 'imported_sequence';
            markdownData = data.markdownData || null;
          } else if (data.name && data.actions && Array.isArray(data.actions)) {
            // 新格式 - actions 是嵌套的
            actions = data.actions;
            name = data.name;
            markdownData = data.markdownData || null;
          } else {
            reject(new Error('无效的序列文件格式'));
            return;
          }
          
          // 导入序列
          this.saveRecordedSequence(name, actions);
          console.log('.... markdownData', markdownData)
          // 如果有 markdownData，直接调用 onUpdateMarkdownData 回调存储到 Redux
          if (markdownData && this.callbacks.onUpdateMarkdownData) {
            console.log('从导入文件中发现 markdownData，存储到 Redux 中...');
            this.callbacks.onUpdateMarkdownData(markdownData);
          }
          
          resolve({
            success: true,
            sequenceName: name,
            actions: actions,
            markdownData: markdownData
          });
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
   * 获取 Redux 中的布局
   * @private
   */
  _getReduxLayout() {
    return store.getState().layout;
  }
  
  /**
   * 查找容器
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
   * 清理资源
   */
  dispose() {
    // 清理 Redux 订阅
    if (this._unsubscribe) {
      this._unsubscribe();
      this._unsubscribe = null;
    }
  }
  
  /**
   * 生成确定性元素 ID
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
   * 导入并执行序列
   * @param {File} file - 序列文件
   * @param {number} speed - 执行速度
   * @returns {Promise<Object>} - 执行结果
   */
  async importAndExecuteSequence(file, speed = 1.0) {
    try {
      // 导入序列
      const importResult = await this.importSequenceFromFile(file);
      
      if (!importResult.success) {
        return { success: false, error: '导入序列失败' };
      }
      
      // 设置Markdown数据（如果有）
      if (importResult.markdownData) {
        // 使用 onSetMarkdownData 回调处理旧的兼容性逻辑
        if (this.callbacks.onSetMarkdownData) {
          await this.callbacks.onSetMarkdownData(importResult.markdownData);
        }
        
        // 同时确保使用 onUpdateMarkdownData 将数据存储到 Redux
        if (this.callbacks.onUpdateMarkdownData) {
          this.callbacks.onUpdateMarkdownData(importResult.markdownData);
        }
      }
      
      // 重置已使用元素
      if (this.callbacks.onResetUsedElements) {
        await this.callbacks.onResetUsedElements();
      }
      
      // 清除现有布局
      if (this.callbacks.onClearLayout) {
        await this.callbacks.onClearLayout();
      }
      
      // 执行动作序列
      await this.playRecordedSequence(importResult.actions, speed);
      
      // 获取结果布局
      const resultLayout = store.getState().layout;
      
      return {
        success: true,
        sequenceName: importResult.sequenceName,
        actionsCount: importResult.actions.length,
        hasMarkdownData: !!importResult.markdownData,
        rootContainerId: resultLayout?.id
      };
    } catch (error) {
      console.error('导入并执行序列失败:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default ReduxActionExecutor; 