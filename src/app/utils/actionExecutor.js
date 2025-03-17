/**
 * AIGUI 动作执行系统
 * 
 * 负责执行动作配置中定义的各种动作，并提供录制和回放功能
 */
import { getActionDefinition } from './actionConfig';
import globalLayoutState from './globalLayoutState'; // 导入全局布局状态

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
      onResetUsedElements: callbacks.onResetUsedElements || (() => {})
    };
    
    // 绑定方法
    this.executeAction = this.executeAction.bind(this);
    this.executeActionByType = this.executeActionByType.bind(this);
    this.startRecording = this.startRecording.bind(this);
    this.stopRecording = this.stopRecording.bind(this);
    this.saveRecordedSequence = this.saveRecordedSequence.bind(this);
    this.loadRecordedSequence = this.loadRecordedSequence.bind(this);
    this.playRecordedSequence = this.playRecordedSequence.bind(this);
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
        return this.callbacks.onAddComponent(
          params.parentId,
          params.componentType,
          params.elementData
        );
      
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
        
        // 调用回调函数添加容器
        console.log(`调用onAddContainer，父容器ID: ${params.parentId || '无(根容器)'}`);
        const containerId = await this.callbacks.onAddContainer(
          elements,
          params.parentId
        );
        
        console.log(`容器添加结果，返回ID: ${containerId}`);
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
        const globalLayout = globalLayoutState.getLayout();
        console.log(`_executePresetAction: 全局布局状态:`, globalLayout ? '存在' : '不存在');
        
        // 如果全局布局存在，验证元素是否存在
        if (globalLayout) {
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
          
          elementExists = findElement(globalLayout, params.elementId);
          console.log(`_executePresetAction: 元素 ${params.elementId} 在全局布局中${elementExists ? '存在' : '不存在'}`);
        }
        
        // 使用延迟重试机制
        let retryCount = 0;
        const maxRetries = 3;
        const retryDelay = 200;
        
        const applyPresetWithRetry = async () => {
          try {
            // 检查全局布局状态 
            const globalLayout = globalLayoutState.getLayout();
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
        const { timestamp, category, actionId, params } = actionRecord;
        
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
          const result = await this.executeAction(category, actionId, params);
          console.log(`动作 ${i+1} 执行结果:`, result);
          results.push(result);
          
          // 检查是否成功执行
          if (result === undefined || result === null) {
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
    const canvasSize = globalLayoutState.getCanvasSize();
    
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
      actions: [...sequence]
    };
    
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
        const newParams = { ...newAction.params };
        
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
      
      // 如果序列包含画布尺寸信息，应用它
      if (importResult.metadata && 
          importResult.metadata.canvasWidth && 
          importResult.metadata.canvasHeight) {
        
        console.log('应用导入序列中的画布尺寸设置:', 
          importResult.metadata.canvasWidth, 'x', importResult.metadata.canvasHeight);
          
        // 更新全局状态中的画布尺寸
        globalLayoutState.updateCanvasSize(
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
      
      // 如果有 Markdown 数据，先应用 Markdown 数据，并更新ID
      if (importResult.markdownData && this.callbacks.onSetMarkdownData) {
        console.log('检测到Markdown数据，准备应用...');
        // 更新Markdown元素中的ID
        if (importResult.markdownData.markdownElements) {
          const updatedElements = [];
          
          // 为每个元素生成新的标准ID
          for (const element of importResult.markdownData.markdownElements) {
            const oldId = element.id;
            const newElement = { ...element };
            newElement.id = this.generateStandardElementId(newElement);
            idMapping[oldId] = newElement.id;
            updatedElements.push(newElement);
          }
          
          // 使用更新后的元素
          importResult.markdownData.markdownElements = updatedElements;
          console.log('已更新Markdown元素ID');
        }
        
        // 设置更新后的Markdown数据
        await this.callbacks.onSetMarkdownData(importResult.markdownData);
        console.log('已成功设置Markdown数据');
      }
      
      // 更新动作序列中的ID引用
      console.log('更新动作序列中的ID引用...');
      const updatedActions = this.updateActionIds(importResult.actions, idMapping);
      console.log('ID更新完成，准备执行动作序列');
      
      // 防止创建重复嵌套容器
      let rootContainerCreated = false;
      const processedActions = updatedActions.map(action => {
        // 只处理添加容器的动作
        if (action.category === 'componentActions' && action.actionId === 'addContainer') {
          // 第一个容器是根容器
          if (!rootContainerCreated) {
            rootContainerCreated = true;
            return action;
          } else {
            // 如果不是第一个容器，确保它的parentId不为null（避免创建另一个根容器）
            if (!action.params.parentId) {
              console.log('检测到尝试创建重复的根容器，已阻止此操作');
              // 修改动作，将其parentId设置为已存在的根容器的ID
              // 这里假设第一个动作返回的结果是根容器的ID
              const rootContainerId = updatedActions.find(a => 
                a.category === 'componentActions' && a.actionId === 'addContainer' && !a.params.parentId
              )?.result;
              
              if (rootContainerId) {
                return {
                  ...action,
                  params: {
                    ...action.params,
                    parentId: rootContainerId
                  }
                };
              }
            }
          }
        }
        return action;
      });
      
      // 强制执行第一个根容器动作，确保后续动作有正确的父容器
      if (processedActions.length > 0 && 
          processedActions[0].category === 'componentActions' && 
          processedActions[0].actionId === 'addContainer') {
        
        console.log('开始执行根容器创建动作');
        const firstAction = processedActions[0];
        const rootContainerId = await this.executeAction(
          firstAction.category, 
          firstAction.actionId, 
          firstAction.params
        );
        
        console.log('根容器创建结果:', rootContainerId);
        
        // 给布局状态更新一些时间
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // 执行其余动作
        if (processedActions.length > 1) {
          console.log(`开始执行剩余的 ${processedActions.length - 1} 个动作`);
          const remainingActions = processedActions.slice(1);
          const playResult = await this.playRecordedSequence(remainingActions, speed);
          
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
        const playResult = await this.playRecordedSequence(processedActions, speed);
        
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
}

export default ActionExecutor; 