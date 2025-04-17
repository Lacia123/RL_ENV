'use client';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LayoutControl from '../layout-panel/LayoutPanel';
import LayoutPreview from './LayoutPreview';
import LayoutScoreEvaluator from './LayoutScoreEvaluator';
import ComponentStatusPanel from './ComponentStatusPanel';
import ActionPanel from './ActionPanel';
import MarkdownParser from './MarkdownParser';
import JsonInputPanel from './JsonInputPanel';
import CanvasSettingsPanel from './CanvasSettingsPanel'; // 新增：导入画布设置面板
import ReduxActionExecutor from '../../utils/reduxActionExecutor'; // 导入 Redux 版本的 ActionExecutor
import { store, actions } from '../../utils/reduxStore'; // 导入 Redux store及actions
import { useLayoutEditorAdapter } from './layoutEditorAdapter'; // 导入 LayoutEditor 适配器

/**
 * 布局编辑器组件 - 整合预览、控制面板和评分功能
 *
 * 增强为强化学习环境，包含动作面板和Markdown解析器
 * @param {Object} props
 * @param {Object} props.initialLayout - 初始布局数据
 */
const LayoutEditor = ({ initialLayout, onLayoutChange }) => {
  // 使用ref作为ID计数器，在渲染之间保持状态
  const idCounterRef = useRef(0);
  // 用于跟踪 Markdown 元素变化
  const lastElementsRef = useRef([]);
  // 用于存储最后一次的JSON字符串，避免无限循环
  const jsonRef = useRef('');

  // 使用Redux hooks
  const dispatch = useDispatch();

  // 从Redux获取状态 - 现在包括UI状态
  const layout = useSelector(state => state.layout);
  const selectedElementId = useSelector(state => state.selectedElementId);
  const canvasWidth = useSelector(state => state.canvasWidth);
  const canvasHeight = useSelector(state => state.canvasHeight);
  const usedElementIds = useSelector(state => state.usedElementIds);

  // 获取UI状态
  const jsonInput = useSelector(state => state.ui.jsonInput);
  const jsonError = useSelector(state => state.ui.jsonError);
  const showPanel = useSelector(state => state.ui.showPanel);
  const showMarkdownPanel = useSelector(state => state.ui.showMarkdownPanel);
  const showActionPanel = useSelector(state => state.ui.showActionPanel);
  const showJsonPanel = useSelector(state => state.ui.showJsonPanel);
  const showComponentPanel = useSelector(state => state.ui.showComponentPanel);
  const showScorePanel = useSelector(state => state.ui.showScorePanel);
  const showCanvasSettingsPanel = useSelector(state => state.ui.showCanvasSettingsPanel);
  const selectedPresetTab = useSelector(state => state.ui.selectedPresetTab);
  const markdownText = useSelector(state => state.ui.markdownText);
  const markdownElements = useSelector(state => state.ui.markdownElements);

  const panelRef = useRef(null);

  // 创建ActionExecutor实例
  const [actionExecutorCreated, setActionExecutorCreated] = useState(false);

  // UI状态使用Redux管理
  const uiState = useSelector(state => state.ui);

  // 使用layoutEditorAdapter获取方法
  const {
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
  } = useLayoutEditorAdapter();

  // 处理来自Redux的状态更新
  const handleStateUpdate = useCallback((reduxState) => {
    console.log('LayoutEditor接收到Redux状态更新:', reduxState);

    // 如果有onLayoutChange回调，通知外部
    if (onLayoutChange && reduxState.layout) {
      onLayoutChange(reduxState.layout);
    }
  }, [onLayoutChange]);

  // 添加组件
  const addComponent = (type, preset) => {
    const elementId = selectedElementId || (layout && layout.id);
    return addChildComponent(elementId, type, preset);
  };

  // 移动元素到目标元素的同级位置
  const moveElementToSibling = (elementId, targetSiblingId, position = 'after') => {
    // 创建布局的深拷贝
    const layoutCopy = JSON.parse(JSON.stringify(layout));

    // 查找要移动的元素及其父元素
    let elementToMove = null;
    let elementParentPath = [];

    // 查找目标兄弟元素及其父元素
    let targetSibling = null;
    let targetParentPath = [];

    // 查找元素和其父元素路径的辅助函数
    const findElementAndParent = (layout, elementId, path = []) => {
      if (layout.id === elementId) {
        return { element: layout, path: [...path] };
      }

      if (layout.children) {
        for (let i = 0; i < layout.children.length; i++) {
          const childPath = [...path, { parent: layout, index: i }];
          const result = findElementAndParent(layout.children[i], elementId, childPath);
          if (result.element) {
            return result;
          }
        }
      }

      return { element: null, path: [] };
    };

    // 查找要移动的元素和目标元素
    const moveResult = findElementAndParent(layoutCopy, elementId);
    elementToMove = moveResult.element;
    elementParentPath = moveResult.path;

    const targetResult = findElementAndParent(layoutCopy, targetSiblingId);
    targetSibling = targetResult.element;
    targetParentPath = targetResult.path;

    // 如果未找到元素或目标元素，则退出
    if (!elementToMove || !targetSibling) {
      console.error('找不到要移动的元素或目标元素');
      return;
    }

    // 检查目标元素是否是源元素的子元素（防止循环）
    let isChild = false;
    const checkChild = (container) => {
      if (container.id === targetSiblingId) {
        isChild = true;
        return;
      }

      if (container.children) {
        for (const child of container.children) {
          checkChild(child);
        }
      }
    };

    checkChild(elementToMove);

    if (isChild) {
      console.error('不能将元素移动到其子元素旁边');
      return;
    }

    // 确保目标元素有父元素
    if (targetParentPath.length === 0) {
      console.error('目标元素没有父元素，无法移动');
      return;
    }

    // 获取目标元素的父元素和索引
    const targetParent = targetParentPath[targetParentPath.length - 1].parent;
    let targetIndex = targetParentPath[targetParentPath.length - 1].index;

    // 从原父元素中移除元素
    if (elementParentPath.length > 0) {
      const lastParent = elementParentPath[elementParentPath.length - 1];
      lastParent.parent.children.splice(lastParent.index, 1);

      // 如果移除的元素位于同一父元素中，且索引小于目标索引，
      // 则需要调整目标索引（因为移除操作会使数组索引变化）
      if (lastParent.parent === targetParent && lastParent.index < targetIndex) {
        targetIndex--;
      }
    }

    // 插入到目标元素旁边
    // 如果position是'after'，则插入到目标元素后面；如果是'before'，则插入到目标元素前面
    const insertIndex = position === 'after' ? targetIndex + 1 : targetIndex;
    targetParent.children.splice(insertIndex, 0, elementToMove);

    // 更新Redux状态
    dispatch(actions.updateLayout(layoutCopy));

    // 更新jsonRef
    jsonRef.current = JSON.stringify(layoutCopy, null, 2);
  };

  // 添加设置 Markdown 数据的方法
  const setMarkdownData = (markdownData) => {
    if (!markdownData) return false;

    // 设置 Markdown 文本
    const newMarkdownText = markdownData.markdownText || '';
    dispatch(actions.updateMarkdownText(newMarkdownText));

    // 如果提供了 Markdown 元素，使用它们
    if (markdownData.markdownElements && markdownData.markdownElements.length > 0) {
      // 为每个元素应用标准化 ID
      const standardizedElements = markdownData.markdownElements.map(element => {
        // 返回带有标准化ID的元素
        return {
          ...element,
          id: generateStandardId(element)
        };
      });

      // 确保没有重复ID
      const idMap = new Map();
      const uniqueElements = standardizedElements.map(element => {
        if (idMap.has(element.id)) {
          // 如果ID已存在，添加随机后缀
          const newId = `${element.id}_${Math.random().toString(36).substring(2, 7)}`;
          return { ...element, id: newId };
        }

        idMap.set(element.id, true);
        return element;
      });

      dispatch(actions.updateMarkdownElements(uniqueElements));
    }

    return true;
  };

  // 重置已使用元素 IDs
  const resetUsedElements = () => {
    dispatch(actions.resetUsedElementIds());
    return true;
  };

  // 创建动作执行器实例
  const createActionExecutor = useCallback(() => {
    // 使用 Redux 版本的执行器
    console.log('LayoutEditor创建 Redux ActionExecutor实例');
    const executor = new ReduxActionExecutor({
      onAddComponent: addChildComponent,
      onAddContainer: handleAddContainer,
      onApplyPreset: applyCategoryPreset,
      onUpdateElementStyle: updateElementStyle,
      onUpdateElementContent: updateElementContent,
      onMoveElement: moveElement,
      onMoveElementToSibling: moveElementToSibling,
      onClearLayout: clearLayout,
      onSetMarkdownData: setMarkdownData,
      onResetUsedElements: resetUsedElements,
      onStateUpdated: handleStateUpdate,
      onError: (error) => console.error('动作执行错误:', error)
    });

    return executor;
  }, [
    addChildComponent,
    handleAddContainer,
    applyCategoryPreset,
    updateElementStyle,
    updateElementContent,
    moveElement,
    moveElementToSibling,
    clearLayout,
    setMarkdownData,
    resetUsedElements,
    handleStateUpdate
  ]);

  // 只创建一次执行器实例
  useEffect(() => {
    if (!actionExecutorCreated) {
      const executor = createActionExecutor();
      window.actionExecutor = executor;
      setActionExecutorCreated(true);

      // 清理函数
      return () => {
        if (executor && executor.dispose) {
          executor.dispose();
        }
        window.actionExecutor = null;
      };
    }
  }, [actionExecutorCreated, createActionExecutor]);

  // 组件初始化 - 如果提供了initialLayout，则初始化Redux状态
  useEffect(() => {
    console.log('组件挂载，初始化状态...');

    // 如果有初始布局且Redux布局为空，则初始化Redux布局
    if (initialLayout && !layout) {
      dispatch(actions.updateLayout(initialLayout));
    }

    // 仅在组件挂载时执行一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 处理点击外部关闭面板
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        dispatch(actions.setUiState({ showPanel: false }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dispatch]);

  // 处理Markdown文本变化
  const handleMarkdownTextChange = (text) => {
    // 如果 Markdown 文本不为空，则清空 JSON 输入
    if (text.trim() !== '') {
      dispatch(actions.updateMarkdownText(text));
      dispatch(actions.updateJsonInput(''));
    } else {
      dispatch(actions.updateMarkdownText(text));
    }
  };

  // 处理JSON输入变化
  const handleJsonInputChange = (json) => {
    dispatch(actions.updateJsonInput(json));
  };

  // 应用JSON到布局
  const handleApplyJson = (jsonObj) => {
    try {
      // 添加ID到JSON对象
      const newLayoutWithIds = addIds(jsonObj);

      // 更新Redux状态
      dispatch(actions.updateLayout(newLayoutWithIds));
      dispatch(actions.updateSelectedElementId(newLayoutWithIds.id));

      // 更新UI状态
      dispatch(actions.setUiState({
        markdownText: '',
        markdownElements: []
      }));
    } catch (error) {
      console.error('应用JSON时出错:', error);
      dispatch(actions.setUiState({
        jsonError: `应用JSON失败: ${error.message}`
      }));
    }
  };

  // 将 Markdown 元素应用到布局中
  const applyMarkdownElements = () => {
    const elements = uiState.markdownElements;

    // 如果没有元素，则不执行任何操作
    if (!elements || elements.length === 0) {
      return;
    }

    // 创建一个新的根容器
    const newLayout = {
      type: 'container',
      layoutPreset: 'vertical-centered',
      flexRatioPreset: 'grow-1',
      sizePreset: 'fill-width',
      appearancePreset: 'card',
      spacingPreset: 'spacious',
      children: []
    };

    // 将生成的元素添加到根容器中
    elements.forEach(element => {
      // 确保元素有类型
      if (element.type) {
        newLayout.children.push(element);
      }
    });

    // 添加ID并更新布局
    const newLayoutWithIds = addIds(newLayout);

    setUiState(prev => ({
      ...prev,
      layout: newLayoutWithIds,
      jsonInput: JSON.stringify(newLayoutWithIds, null, 2), // 更新 JSON 输入
      selectedElementId: newLayoutWithIds.id
    }));
  };

  // 生成顺序ID
  const generateId = () => {
    idCounterRef.current += 1;
    return `element_${idCounterRef.current}`;
  };

  // 添加ID到布局树
  const addIds = (element) => {
    if (!element) return null;  // 如果元素为空，返回 null
    if (element.id) return element; // 如果已有ID则跳过

    const newElement = { ...element };

    // 使用内容和特征生成ID
    newElement.id = generateStandardId(newElement);

    if (newElement.children) {
      newElement.children = newElement.children.map(child => addIds(child));
    }
    return newElement;
  };

  // 生成标准化ID
  const generateStandardId = (element) => {
    if (!element) return `element_unknown`;

    let idComponents = ['element', element.type];

    // 创建一个简单的哈希函数
    const simpleHash = (str) => {
      if (!str) return '';
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      return Math.abs(hash).toString(16).substring(0, 8);
    };

    // 获取内容字符串
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

    // 添加额外特征字符串
    let featureString = '';
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

    if (contentHash) {
      idComponents.push(contentHash);
    }

    if (featureHash) {
      idComponents.push(featureHash);
    }

    // 如果没有足够的唯一性，添加一个确定性标识符
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
  };

  // 处理画布大小变更
  const handleCanvasSizeChange = (width, height) => {
    // 更新Redux状态
    dispatch(actions.updateCanvasSize(width, height));
  };

  // Redux状态更新效果
  useEffect(() => {
    // 只有当Redux布局存在且JSON输入为空时才更新
    if (layout && (!jsonInput || jsonInput.trim() === '')) {
      try {
        const currentJsonString = JSON.stringify(layout, null, 2);

        // 只在JSON字符串真正改变时更新状态
        if (currentJsonString !== jsonRef.current) {
          jsonRef.current = currentJsonString;
          dispatch(actions.updateJsonInput(currentJsonString));
        }
      } catch (error) {
        console.error('布局格式化为JSON失败:', error);
      }
    }
  }, [layout, jsonInput, dispatch]);

  // 当布局变化时，通知外部
  useEffect(() => {
    // 如果有onLayoutChange回调，通知外部
    if (onLayoutChange && layout) {
      onLayoutChange(layout);
    }
  }, [layout, onLayoutChange]);

  // 处理JSON面板按钮点击
  const handleJsonPanelButtonClick = () => {
    if (showJsonPanel) {
      dispatch(actions.setUiState({ showJsonPanel: false }));
    } else {
      dispatch(actions.setUiState({
        showJsonPanel: true,
        showMarkdownPanel: false,
        showActionPanel: false,
        showCanvasSettingsPanel: false,
        markdownText: showMarkdownPanel ? '' : markdownText
      }));
    }
  };

  // 处理Markdown面板切换
  const handleMarkdownPanelButtonClick = () => {
    if (showMarkdownPanel) {
      dispatch(actions.setUiState({ showMarkdownPanel: false }));
    } else {
      dispatch(actions.setUiState({
        showMarkdownPanel: true,
        showJsonPanel: false,
        showActionPanel: false,
        showCanvasSettingsPanel: false,
        jsonInput: showJsonPanel ? '' : jsonInput
      }));
    }
  };

  // 处理Action面板切换
  const handleActionPanelButtonClick = () => {
    if (showActionPanel) {
      dispatch(actions.setUiState({ showActionPanel: false }));
    } else {
      dispatch(actions.setUiState({
        showActionPanel: true,
        showJsonPanel: false,
        showCanvasSettingsPanel: false
      }));
    }
  };

  // 处理Canvas设置面板切换
  const handleCanvasSettingsPanelButtonClick = () => {
    if (showCanvasSettingsPanel) {
      dispatch(actions.setUiState({ showCanvasSettingsPanel: false }));
    } else {
      dispatch(actions.setUiState({
        showCanvasSettingsPanel: true,
        showMarkdownPanel: false,
        showJsonPanel: false,
        showActionPanel: false
      }));
    }
  };

  // 处理组件面板切换
  const handleComponentPanelButtonClick = () => {
    dispatch(actions.setUiState({
      showComponentPanel: !showComponentPanel
    }));
  };

  // 处理分数面板切换
  const handleScorePanelButtonClick = () => {
    dispatch(actions.setUiState({
      showScorePanel: !showScorePanel
    }));
  };

  // 处理底部面板切换
  const handleBottomPanelButtonClick = () => {
    dispatch(actions.setUiState({
      showPanel: !showPanel
    }));
  };

  // 处理元素点击 - 选中元素并显示面板
  const handleElementClick = (element, event) => {
    if (!element) return;
    event.stopPropagation();

    // 更新Redux状态
    dispatch(actions.updateSelectedElementId(element.id));

    // 更新UI状态
    dispatch(actions.setUiState({
      showPanel: false, // 不再显示底部面板
      showActionPanel: true, // 显示动作面板
      selectedPresetTab: true // 让动作面板显示预设标签页
    }));
  };

  // 处理元素选择 - 仅选中元素不显示面板
  const handleElementSelect = (element, event) => {
    if (!element) return;
    event.stopPropagation();

    // 更新Redux状态
    dispatch(actions.updateSelectedElementId(element.id));

    // 更新UI状态
    dispatch(actions.setUiState({
      showPanel: false, // 不显示底部面板
      showActionPanel: true, // 显示动作面板
      selectedPresetTab: true // 让动作面板显示预设标签页
    }));
  };

  console.log('.... current layout', layout)

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full">
        {/* 顶部工具栏 */}
        <div className="bg-white shadow-sm border-b mb-4">
          <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
            <h2 className="text-xl font-medium">强化学习布局环境</h2>
            <div className="flex space-x-4">
              <button
                className={`px-4 py-1 rounded-md flex items-center ${showMarkdownPanel ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
                onClick={handleMarkdownPanelButtonClick}
              >
                <span className="mr-2">{showMarkdownPanel ? '📝' : '📋'}</span>
                Markdown面板
              </button>
              <button
                className={`px-4 py-1 rounded-md flex items-center ${showActionPanel ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
                onClick={handleActionPanelButtonClick}
              >
                <span className="mr-2">{showActionPanel ? '🎮' : '🕹️'}</span>
                动作面板
              </button>
              <button
                className={`px-4 py-1 rounded-md flex items-center ${showCanvasSettingsPanel ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
                onClick={handleCanvasSettingsPanelButtonClick}
              >
                <span className="mr-2">{showCanvasSettingsPanel ? '📏' : '📐'}</span>
                画布设置
              </button>
              <button
                className={`px-4 py-1 rounded-md flex items-center ${showJsonPanel ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
                onClick={handleJsonPanelButtonClick}
              >
                <span className="mr-2">{showJsonPanel ? '🔄' : '📄'}</span>
                JSON输入
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          {/* 水平布局：当两个面板都显示时 */}
          {showMarkdownPanel && showActionPanel && (
            <div className="flex justify-between pb-4 gap-4">
              <div className="w-1/2">
                <MarkdownParser
                  markdownText={markdownText}
                  onElementsGenerated={handleMarkdownElementsGenerated}
                  onMarkdownTextChange={handleMarkdownTextChange}
                />
              </div>
              <div className="w-1/2">
                <ActionPanel
                  markdownElements={markdownElements}
                  selectedElementId={selectedElementId}
                  layout={layout}
                  onAddComponent={addChildComponent}
                  onApplyCategoryPreset={applyCategoryPreset}
                  onUpdateElementStyle={(id, key, value) => updateElementStyle(id, key, value)}
                  onUpdateElementContent={(id, key, value) => updateElementContent(id, key, value)}
                  onMoveElement={moveElement}
                  onMoveElementToSibling={moveElementToSibling}
                  usedElementIds={Array.from(usedElementIds)}
                  onAddContainer={handleAddContainer}
                  onClearLayout={clearLayout}
                  onSetMarkdownData={setMarkdownData}
                  onResetUsedElements={resetUsedElements}
                  markdownText={markdownText}
                  actionExecutor={window.actionExecutor}
                  selectedPresetTab={selectedPresetTab}
                />
              </div>
            </div>
          )}

          {/* 单个面板布局：只显示Markdown面板 */}
          {showMarkdownPanel && !showActionPanel && (
            <div className="pb-4">
              <MarkdownParser
                markdownText={markdownText}
                onElementsGenerated={handleMarkdownElementsGenerated}
                onMarkdownTextChange={handleMarkdownTextChange}
              />
            </div>
          )}

          {/* 单个面板布局：只显示动作面板 */}
          {!showMarkdownPanel && showActionPanel && (
            <div className="pb-4">
              <ActionPanel
                markdownElements={markdownElements}
                selectedElementId={selectedElementId}
                layout={layout}
                onAddComponent={addChildComponent}
                onApplyCategoryPreset={applyCategoryPreset}
                onUpdateElementStyle={(id, key, value) => updateElementStyle(id, key, value)}
                onUpdateElementContent={(id, key, value) => updateElementContent(id, key, value)}
                onMoveElement={moveElement}
                onMoveElementToSibling={moveElementToSibling}
                usedElementIds={Array.from(usedElementIds)}
                onAddContainer={handleAddContainer}
                onClearLayout={clearLayout}
                onSetMarkdownData={setMarkdownData}
                onResetUsedElements={resetUsedElements}
                markdownText={markdownText}
                actionExecutor={window.actionExecutor}
                selectedPresetTab={selectedPresetTab}
              />
            </div>
          )}

          {/* JSON 输入面板 */}
          {showJsonPanel && (
            <div className="pb-4">
              <JsonInputPanel
                initialJson={jsonInput}
                onJsonChange={handleJsonInputChange}
                onApplyJson={handleApplyJson}
              />
            </div>
          )}

          {/* 画布设置面板 */}
          {showCanvasSettingsPanel && (
            <div className="pb-4">
              <CanvasSettingsPanel
                initialWidth={canvasWidth}
                initialHeight={canvasHeight}
                onSizeChange={handleCanvasSizeChange}
              />
            </div>
          )}
        </div>

        {/* 布局预览区 - 主要区域 */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white border rounded-lg shadow-sm mb-4">
            <div className="flex justify-between items-center px-4 py-2 border-b">
              <h3 className="font-medium text-gray-700">强化学习环境布局预览</h3>
              <button
                className={`px-3 py-1 rounded-md text-sm flex items-center ${showComponentPanel ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
                onClick={handleComponentPanelButtonClick}
              >
                <span className="mr-2">🔍</span>
                组件树
              </button>
            </div>

            <div className="flex gap-2">
              {/* 主要布局预览区 - 占据更多空间 */}
              <div className={`${showComponentPanel ? 'w-3/4' : 'w-full'} min-h-[70vh] p-1`}>
                {layout ? (
                  <LayoutPreview
                    layout={layout}
                    selectedElementId={selectedElementId}
                    onElementClick={handleElementClick}
                    canvasWidth={canvasWidth}
                    canvasHeight={canvasHeight}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-500">
                      <p className="text-lg mb-2">暂无布局</p>
                      <p className="text-sm">请通过 Markdown 解析或 JSON 输入创建布局</p>
                    </div>
                  </div>
                )}
              </div>
              {/* 可折叠的组件状态面板 */}
              {showComponentPanel && (
                <div className="w-1/4 px-2">
                  <div className="border rounded-lg h-full overflow-hidden">
                    <div className="bg-gray-50 px-3 py-2 border-b">
                      <h4 className="font-medium text-sm">组件结构树</h4>
                    </div>
                    <div className="p-2 overflow-auto" style={{ maxHeight: "calc(70vh - 40px)" }}>
                      {layout ? (
                        <ComponentStatusPanel
                          layout={layout}
                          selectedElementId={selectedElementId}
                          onElementClick={handleElementClick}
                          onElementSelect={handleElementSelect}
                          onAddComponent={addChildComponent}
                          onDeleteElement={deleteElement}
                          onMoveElement={moveElement}
                          onMoveElementToSibling={moveElementToSibling}
                        />
                      ) : (
                        <div className="text-center text-gray-500 py-4">
                          <p>暂无组件</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 布局评分（可折叠） */}
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
            <div
              className="flex justify-between items-center px-4 py-2 cursor-pointer bg-gray-50 hover:bg-gray-100"
              onClick={handleScorePanelButtonClick}
            >
              <h3 className="text-lg font-medium">布局评分</h3>
              <button className="text-gray-500 hover:text-gray-700">
                {showScorePanel ? '收起' : '展开'}
              </button>
            </div>

            {showScorePanel && (
              <div className="p-4">
                {layout ? (
                  <LayoutScoreEvaluator layout={layout} />
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    <p>暂无布局可评分</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 底部控制面板 */}
        <div
          ref={panelRef}
          className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg transform transition-transform duration-300"
          style={{
            transform: showPanel ? 'translateY(0)' : 'translateY(calc(100% - 40px))',
            zIndex: 10 // 确保控制面板在预览界面之上
          }}
        >
          <div
            className="flex justify-between items-center px-4 py-2 cursor-pointer bg-gray-50 hover:bg-gray-100"
            onClick={handleBottomPanelButtonClick}
          >
            <h3 className="text-lg font-medium">布局控制</h3>
            <button className="text-gray-500 hover:text-gray-700">
              {showPanel ? '收起' : '展开'}
            </button>
          </div>

          <div className="p-4 max-h-[70vh] overflow-y-auto">
            <div className="max-w-7xl mx-auto space-y-6">
              <LayoutControl
                selectedElement={layout ? findElement(layout, selectedElementId) : null}
                selectedElementId={selectedElementId}
                onStyleChange={(key, value) => updateElementStyle(selectedElementId || (layout && layout.id), key, value)}
                onContentChange={(key, value) => updateElementContent(selectedElementId || (layout && layout.id), key, value)}
                onActionChange={(key, value) => updateElementAction(selectedElementId || (layout && layout.id), key, value)}
                onDeleteElement={deleteElement}
                onDuplicateElement={() => console.log("Duplicate element functionality")}
                onMoveElement={() => console.log("Move element functionality")}
                onAddComponent={addComponent}
                onCategoryPresetApply={applyCategoryPreset}
              />

              {/* JSON显示 */}
              <div className="bg-white rounded-lg border p-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    布局 JSON
                  </label>
                  <textarea
                    className="w-full h-48 border rounded p-2 font-mono text-sm"
                    value={jsonInput}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayoutEditor;