'use client';
import React, { useState, useRef, useEffect } from 'react';
import LayoutControl from '../layout-panel/LayoutPanel';
import LayoutPreview from './LayoutPreview';
import LayoutScoreEvaluator from './LayoutScoreEvaluator';
import ComponentStatusPanel from './ComponentStatusPanel';
import ActionPanel from './ActionPanel';
import MarkdownParser from './MarkdownParser';
import JsonInputPanel from './JsonInputPanel';
import elementPresets, { applyPresetToElement, mergeElementPresets } from '../../utils/presetSystem';
import { elementDefinitions } from '../../utils/elementDefinitions';
import exampleLayout from './exampleLayout';

/**
 * 布局编辑器组件 - 整合预览、控制面板和评分功能
 *
 * 增强为强化学习环境，包含动作面板和Markdown解析器
 * @param {Object} props
 * @param {Object} props.initialLayout - 初始布局数据
 */
const LayoutEditor = ({ initialLayout }) => {
  // 使用ref作为ID计数器，在渲染之间保持状态
  const idCounterRef = useRef(0);
  // 用于跟踪 Markdown 元素变化
  const lastElementsRef = useRef([]);

  // 使用初始化函数确保一致的ID
  const [state, setState] = useState(() => {
    // 初始状态
    return {
      jsonInput: '',  // 初始时为空字符串
      jsonError: '',
      layout: null,   // 初始时为 null
      showPanel: false,
      showMarkdownPanel: false,
      showActionPanel: false,
      showJsonPanel: false,
      showComponentPanel: false,
      showScorePanel: false,
      selectedElementId: null,
      markdownText: '',
      markdownElements: [],
      usedElementIds: new Set() // 跟踪已使用的元素ID
    };
  });

  const panelRef = useRef(null);

  // 处理面板外部点击
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setState(prev => ({ ...prev, showPanel: false }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 通过ID查找元素
  const findElement = (layout, id) => {
    if (!layout || !id) return null;
    if (layout.id === id) return layout;
    if (layout.children) {
      for (const child of layout.children) {
        const found = findElement(child, id);
        if (found) return found;
      }
    }
    return null;
  };

  // 查找元素的父元素
  const findParentElement = (layout, childId) => {
    if (!layout || !childId) return null;

    if (layout.children) {
      // 直接检查当前元素的子元素
      for (const child of layout.children) {
        if (child.id === childId) {
          return layout; // 找到了父元素
        }
      }

      // 递归检查子元素
      for (const child of layout.children) {
        const parent = findParentElement(child, childId);
        if (parent) {
          return parent;
        }
      }
    }

    return null; // 未找到父元素
  };

  // 更新元素样式
  const updateElementStyle = (elementId, key, value) => {
    if (!state.layout || !elementId) return;

    const updateElement = (layout) => {
      if (layout.id === elementId) {
        const newLayout = { ...layout };
        if (!newLayout.style) newLayout.style = {};

        if (key === 'width' || key === 'height') {
          if (!isNaN(value) && value !== '') {
            value = Number(value);
          }
        }

        if (key === 'primaryAxisSizingMode') {
          if (value === 'responsive') {
            newLayout.style.width = 'auto';
            newLayout.style.height = 'auto';
          } else if (value === 'fix-content') {
            newLayout.style.width = 'fit-content';
            newLayout.style.height = 'fit-content';
          }
        }

        newLayout.style[key] = value;
        return newLayout;
      }

      if (layout.children) {
        return {
          ...layout,
          children: layout.children.map(child => updateElement(child))
        };
      }

      return layout;
    };

    const newLayout = updateElement(state.layout);
    setState(prev => ({
      ...prev,
      layout: newLayout,
      jsonInput: JSON.stringify(newLayout, null, 2)
    }));
  };

  // 处理元素点击 - 选中元素并显示面板
  const handleElementClick = (element, event) => {
    if (!element) return;
    event.stopPropagation();
    setState(prev => ({
      ...prev,
      selectedElementId: element.id,
      showPanel: true
    }));
  };

  // 处理元素选择 - 仅选中元素不显示面板
  const handleElementSelect = (element, event) => {
    if (!element) return;
    event.stopPropagation();
    setState(prev => ({
      ...prev,
      selectedElementId: element.id,
      // 不更改showPanel状态，保持当前状态
    }));
  };

  // 处理内容更新
  const updateElementContent = (elementId, key, value) => {
    if (!state.layout || !elementId) return;

    const updateElement = (layout) => {
      if (layout.id === elementId) {
        const newLayout = { ...layout };
        if (!newLayout.content) {
          newLayout.content = typeof value === 'string' ? { value } : {};
        }

        if (typeof newLayout.content === 'string' && key === 'content') {
          newLayout.content = value;
        } else if (typeof newLayout.content === 'object') {
          newLayout.content = {
            ...newLayout.content,
            [key]: value
          };
        }
        return newLayout;
      }

      if (layout.children) {
        return {
          ...layout,
          children: layout.children.map(child => updateElement(child))
        };
      }

      return layout;
    };

    const newLayout = updateElement(state.layout);
    setState(prev => ({
      ...prev,
      layout: newLayout,
      jsonInput: JSON.stringify(newLayout, null, 2)
    }));
  };

  // 处理动作更新
  const updateElementAction = (elementId, key, value) => {
    if (!state.layout || !elementId) return;

    const updateElement = (layout) => {
      if (layout.id === elementId) {
        const newLayout = { ...layout };
        if (!newLayout.action) newLayout.action = {};

        newLayout.action = {
          ...newLayout.action,
          [key]: value
        };
        return newLayout;
      }

      if (layout.children) {
        return {
          ...layout,
          children: layout.children.map(child => updateElement(child))
        };
      }

      return layout;
    };

    const newLayout = updateElement(state.layout);
    setState(prev => ({
      ...prev,
      layout: newLayout,
      jsonInput: JSON.stringify(newLayout, null, 2)
    }));
  };

  // 添加新组件
  const addComponent = (type, preset) => {
    const elementId = state.selectedElementId || state.layout.id;
    return addChildComponent(elementId, type, preset);
  };

  // 添加子组件到指定父元素
  const addChildComponent = (parentId, type, markdownElement) => {
    // 如果没有布局，需要先创建容器
    if (!state.layout) {
      alert('请先添加一个容器');
      return;
    }

    // 如果元素已被使用，不允许重复添加
    if (markdownElement && markdownElement.id && state.usedElementIds.has(markdownElement.id)) {
      alert('此元素已被添加到布局中');
      return;
    }

    // 查找父元素
    const parentElement = findElement(state.layout, parentId);
    if (!parentElement) {
      console.error('找不到父元素:', parentId);
      return;
    }

    // 检查：如果父元素是文本元素，则将新元素添加为兄弟元素而不是子元素
    if (parentElement.type === 'text' && parentElement.id !== state.layout.id) {
      // 查找父元素的父元素
      const grandParent = findParentElement(state.layout, parentId);
      if (grandParent) {
        return addChildComponent(grandParent.id, type, markdownElement);
      }
    }

    // 根据类型创建新元素
    let newElement = {};

    // 处理传入的参数：当markdownElement是元素对象时直接使用它，当是字符串(preset)时查找
    if (markdownElement && typeof markdownElement === 'object') {
      // 直接使用传入的元素（完整的Markdown生成元素）
      newElement = JSON.parse(JSON.stringify(markdownElement));
    } else {
      // 按旧逻辑处理，查找匹配的markdown元素或使用默认元素
      const preset = markdownElement;
      const matchedElement = state.markdownElements.find(element =>
        element.type === type && (!preset || element.preset === preset)
      );

      if (matchedElement) {
        // 使用找到的markdown元素
        newElement = JSON.parse(JSON.stringify(matchedElement));
      } else if (elementDefinitions[type]) {
        // 使用元素定义
        newElement = {
          ...elementDefinitions[type],
          preset
        };
      } else {
        // 使用默认元素
        newElement = {
          type,
          style: { ...elementDefinitions.commonStyleProps },
          preset
        };
      }
    }

    // 如果没有从markdown元素获取预设，则添加默认预设值
    if (!markdownElement) {
      switch (type) {
        case 'button':
          // 为按钮设置默认的按钮尺寸和自对齐方式
          newElement.buttonSizePreset = 'btn-medium';
          newElement.selfAlignPreset = 'self-center';
          break;
        case 'text':
          // 为文本设置默认的文本对齐和自对齐方式
          newElement.textAlignPreset = 'left';
          newElement.selfAlignPreset = 'self-start';
          newElement.sizePreset = 'auto';
          break;
        case 'image':
          // 为图片设置默认的图片比例和自对齐方式
          newElement.imageProportionPreset = 'original';
          newElement.selfAlignPreset = 'self-center';
          newElement.sizePreset = 'responsive-medium';
          break;
        case 'container':
          // 为容器设置默认的布局和尺寸
          newElement.layoutPreset = 'vertical-centered';
          newElement.sizePreset = 'fill-width';
          newElement.flexRatioPreset = 'grow-1';
          break;
        default:
          // 为其他元素类型设置默认的自对齐方式
          newElement.selfAlignPreset = 'self-start';
          newElement.sizePreset = 'auto';
      }
    }

    // 添加唯一ID
    newElement = addIds(newElement);

    // 添加到父元素
    const updateElement = (layout) => {
      if (layout.id === parentId) {
        const newLayout = { ...layout };
        if (!newLayout.children) newLayout.children = [];

        newLayout.children = [...newLayout.children, newElement];

        // 选中新添加的元素
        setState(prev => ({
          ...prev,
          selectedElementId: newElement.id
        }));

        return newLayout;
      }

      if (layout.children) {
        return {
          ...layout,
          children: layout.children.map(child => updateElement(child))
        };
      }

      return layout;
    };

    const newLayout = updateElement(state.layout);
    setState(prev => ({
      ...prev,
      layout: newLayout,
      jsonInput: JSON.stringify(newLayout, null, 2)
    }));

    // 更新已使用元素集合
    if (markdownElement && markdownElement.id) {
      setState(prev => ({
        ...prev,
        usedElementIds: new Set([...prev.usedElementIds, markdownElement.id])
      }));
    }

    // 返回新创建的元素ID，以便外部使用
    return newElement.id;
  };

  // 旧版预设选择方法已移除，统一使用分类预设系统

  // 应用分类预设样式
  const applyCategoryPreset = (category, presetKey, asArray = false) => {
    const elementId = state.selectedElementId || state.layout.id;
    console.log(`应用预设: ${category} - ${presetKey} 到元素: ${elementId}`);

    const updateElement = (layout) => {
      if (layout.id === elementId) {
        // 使用预设系统的applyPresetToElement函数应用预设
        console.log(`找到元素: ${layout.type} - ${layout.id}`);
        try {
          let newLayout = applyPresetToElement(layout, category, presetKey, asArray);
          console.log(`成功应用预设 ${category}:${presetKey} 到元素 ${layout.id}`);
          return newLayout;
        } catch (error) {
          console.error(`应用预设失败:`, error);
          return layout;
        }
      }

      if (layout.children) {
        return {
          ...layout,
          children: layout.children.map(child => updateElement(child))
        };
      }

      return layout;
    };

    const newLayout = updateElement(state.layout);
    setState(prev => ({
      ...prev,
      layout: newLayout,
      jsonInput: JSON.stringify(newLayout, null, 2)
    }));
  };

  // 删除元素
  const deleteElement = (id) => {
    if (!state.layout || !id) return;

    const deleteElementById = (layout) => {
      if (!layout.children) return layout;

      return {
        ...layout,
        children: layout.children
          .filter(child => child.id !== id)
          .map(child => deleteElementById(child))
      };
    };

    const newLayout = deleteElementById(state.layout);
    setState(prev => ({
      ...prev,
      layout: newLayout,
      jsonInput: JSON.stringify(newLayout, null, 2),
      selectedElementId: null
    }));
  };

  // 移动元素到目标容器
  // 改进的移动元素到目标容器方法
  const moveElement = (elementId, targetContainerId) => {
    // 查找元素及其父元素
    let foundElement = null;
    let parentPath = [];

    const findElementAndParent = (layout, path = []) => {
      if (layout.id === elementId) {
        foundElement = layout;
        parentPath = [...path];
        return true;
      }

      if (layout.children) {
        for (let i = 0; i < layout.children.length; i++) {
          const childPath = [...path, { parent: layout, index: i }];
          if (findElementAndParent(layout.children[i], childPath)) {
            return true;
          }
        }
      }

      return false;
    };

    // 查找目标容器
    let targetContainer = null;

    const findTargetContainer = (layout) => {
      if (layout.id === targetContainerId) {
        targetContainer = layout;
        return true;
      }

      if (layout.children) {
        for (const child of layout.children) {
          if (findTargetContainer(child)) {
            return true;
          }
        }
      }

      return false;
    };

    // 开始查找
    findElementAndParent(state.layout);
    findTargetContainer(state.layout);

    // 如果未找到元素或目标容器，则退出
    if (!foundElement || !targetContainer) {
      console.error('找不到要移动的元素或目标容器');
      return;
    }

    // 改进的循环检测：只有当移动的是容器元素时，才需要检查目标容器是否在其子树中
    // 对于非容器元素（如按钮、文本等），无需检查，因为它们不能包含子元素，不会形成循环
    let isAncestor = false;

    if (foundElement.type === 'container' && foundElement.children && foundElement.children.length > 0) {
      const checkAncestry = (container) => {
        if (container.id === targetContainerId) {
          isAncestor = true;
          return;
        }

        if (container.children) {
          for (const child of container.children) {
            checkAncestry(child);
          }
        }
      };

      checkAncestry(foundElement);
    }

    if (isAncestor) {
      console.error('不能将容器移动到其子元素中，这会形成循环');
      alert('不能将容器移动到其子元素中，这会形成循环');
      return;
    }

    // 从父元素中移除元素
    if (parentPath.length > 0) {
      const lastParent = parentPath[parentPath.length - 1];
      lastParent.parent.children.splice(lastParent.index, 1);
    }

    // 将元素添加到目标容器
    if (!targetContainer.children) {
      targetContainer.children = [];
    }

    targetContainer.children.push(foundElement);

    // 更新状态
    setState(prev => ({
      ...prev,
      layout: { ...state.layout }, // 创建新对象触发更新
      jsonInput: JSON.stringify(state.layout, null, 2)
    }));
  };

  // 移动元素到目标元素的同级位置
  const moveElementToSibling = (elementId, targetSiblingId, position = 'after') => {
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
    const moveResult = findElementAndParent(state.layout, elementId);
    elementToMove = moveResult.element;
    elementParentPath = moveResult.path;

    const targetResult = findElementAndParent(state.layout, targetSiblingId);
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

    // 更新状态
    setState(prev => ({
      ...prev,
      layout: { ...state.layout }, // 创建新对象触发更新
      jsonInput: JSON.stringify(state.layout, null, 2)
    }));
  };

  // 处理Markdown元素生成
  const handleMarkdownElementsGenerated = (elements) => {
    // 使用ref来避免不必要的状态更新
    if (JSON.stringify(lastElementsRef.current) !== JSON.stringify(elements)) {
      lastElementsRef.current = elements;

      // 创建一个空的根容器
      const emptyLayout = {
        type: 'container',
        layoutPreset: 'vertical-centered',
        flexRatioPreset: 'grow-1',
        sizePreset: 'fill-width',
        appearancePreset: 'card',
        spacingPreset: 'spacious',
        children: []
      };

      // 添加ID并更新布局
      const emptyLayoutWithIds = addIds(emptyLayout);

      // 添加ID给每个Markdown元素
      const elementsWithIds = elements.map(element => addIds({ ...element }));

      // 更新状态：清空预览区域，更新解析出的元素
      setState(prev => ({
        ...prev,
        layout: emptyLayoutWithIds,
        jsonInput: JSON.stringify(emptyLayoutWithIds, null, 2),
        selectedElementId: emptyLayoutWithIds.id,
        markdownElements: elementsWithIds
      }));
    }
  };

  // 处理Markdown文本变化
  const handleMarkdownTextChange = (text) => {
    // 如果 Markdown 文本不为空，则清空 JSON 输入
    if (text.trim() !== '') {
      setState(prev => ({
        ...prev,
        markdownText: text,
        jsonInput: '' // 清空 JSON 输入
      }));
    } else {
      setState(prev => ({
        ...prev,
        markdownText: text
      }));
    }
  };

  // 处理JSON输入变化
  const handleJsonInputChange = (json) => {
    setState(prev => ({
      ...prev,
      jsonInput: json
    }));
  };

  // 应用JSON到布局
  const handleApplyJson = (jsonObj) => {
    try {
      // 添加ID到JSON对象
      const newLayoutWithIds = addIds(jsonObj);

      // 更新状态
      setState(prev => ({
        ...prev,
        layout: newLayoutWithIds,
        jsonInput: JSON.stringify(newLayoutWithIds, null, 2),
        selectedElementId: newLayoutWithIds.id, // 选中根元素
        markdownText: '', // 清空 Markdown 内容
        markdownElements: [] // 清空从 Markdown 解析的元素列表
      }));
    } catch (error) {
      console.error('应用JSON时出错:', error);
      setState(prev => ({
        ...prev,
        jsonError: `应用JSON失败: ${error.message}`
      }));
    }
  };

  // 将 Markdown 元素应用到布局中
  const applyMarkdownElements = () => {
    const elements = state.markdownElements;

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

    setState(prev => ({
      ...prev,
      layout: newLayoutWithIds,
      jsonInput: JSON.stringify(newLayoutWithIds, null, 2), // 更新 JSON 输入
      selectedElementId: newLayoutWithIds.id
    }));
  };

  // 添加容器
  const handleAddContainer = (selectedElements = []) => {
    // 创建新容器
    const newContainer = {
      type: 'container',
      layoutPreset: 'vertical-centered',
      flexRatioPreset: 'grow-1',
      sizePreset: 'fill-width',
      appearancePreset: 'card',
      spacingPreset: 'spacious',
      children: []
    };

    // 添加ID
    const containerWithId = addIds(newContainer);

    if (!state.layout) {
      // 如果没有根容器，这个容器将成为根容器
      const newLayout = {
        ...containerWithId,
        children: selectedElements.map(element => {
          const elementWithId = addIds(element);
          return elementWithId;
        })
      };

      // 更新已使用元素集合
      const newUsedElementIds = new Set(state.usedElementIds);
      selectedElements.forEach(element => {
        if (element.id) {
          newUsedElementIds.add(element.id);
        }
      });

      setState(prev => ({
        ...prev,
        layout: newLayout,
        jsonInput: JSON.stringify(newLayout, null, 2),
        selectedElementId: newLayout.id,
        usedElementIds: newUsedElementIds
      }));
    } else {
      // 如果已有根容器，将新容器添加为子元素
      const parentId = state.selectedElementId || state.layout.id;

      // 将选中的元素添加到新容器中
      containerWithId.children = selectedElements.map(element => {
        // 如果是新元素，添加ID
        return addIds({ ...element });
      });

      // 更新布局
      const updateLayout = (layout) => {
        if (layout.id === parentId) {
          // 将新容器添加到父元素
          const newLayout = {
            ...layout,
            children: [...(layout.children || []), containerWithId]
          };

          return newLayout;
        }

        if (layout.children) {
          return {
            ...layout,
            children: layout.children.map(child => updateLayout(child))
          };
        }

        return layout;
      };

      let newLayout = updateLayout(state.layout);

      // 更新已使用元素集合
      const newUsedElementIds = new Set(state.usedElementIds);
      selectedElements.forEach(element => {
        if (element.id) {
          newUsedElementIds.add(element.id);
        }
      });

      setState(prev => ({
        ...prev,
        layout: newLayout,
        jsonInput: JSON.stringify(newLayout, null, 2),
        selectedElementId: containerWithId.id,
        usedElementIds: newUsedElementIds
      }));
    }
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
    newElement.id = generateId();
    if (newElement.children) {
      newElement.children = newElement.children.map(child => addIds(child));
    }
    return newElement;
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full">
        {/* 顶部工具栏 */}
        <div className="bg-white shadow-sm border-b mb-4">
          <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
            <h2 className="text-xl font-medium">强化学习布局环境</h2>
            <div className="flex space-x-4">
              <button
                className={`px-4 py-1 rounded-md flex items-center ${state.showMarkdownPanel ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
                onClick={() => setState(prev => {
                  // 如果当前 Markdown 面板已显示，则关闭它
                  if (prev.showMarkdownPanel) {
                    return { ...prev, showMarkdownPanel: false };
                  }
                  // 否则，打开 Markdown 面板，关闭 JSON 面板和动作面板
                  return {
                    ...prev,
                    showMarkdownPanel: true,
                    showJsonPanel: false,
                    showActionPanel: false,
                    // 如果 JSON 面板之前是打开的，则清空 JSON 输入
                    jsonInput: prev.showJsonPanel ? '' : prev.jsonInput
                  };
                })}
              >
                <span className="mr-2">{state.showMarkdownPanel ? '📝' : '📋'}</span>
                Markdown面板
              </button>
              <button
                className={`px-4 py-1 rounded-md flex items-center ${state.showActionPanel ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
                onClick={() => setState(prev => {
                  // 如果当前动作面板已显示，则关闭它
                  if (prev.showActionPanel) {
                    return { ...prev, showActionPanel: false };
                  }
                  // 否则，打开动作面板，关闭 JSON 面板
                  return {
                    ...prev,
                    showActionPanel: true,
                    showJsonPanel: false
                  };
                })}
              >
                <span className="mr-2">{state.showActionPanel ? '🎮' : '🕹️'}</span>
                动作面板
              </button>
              <button
                className={`px-4 py-1 rounded-md flex items-center ${state.showJsonPanel ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
                onClick={() => setState(prev => {
                  // 如果当前 JSON 面板已显示，则关闭它
                  if (prev.showJsonPanel) {
                    return { ...prev, showJsonPanel: false };
                  }
                  // 否则，打开 JSON 面板，关闭 Markdown 面板和动作面板
                  return {
                    ...prev,
                    showJsonPanel: true,
                    showMarkdownPanel: false,
                    showActionPanel: false,
                    // 如果 Markdown 面板之前是打开的，则清空 Markdown 文本
                    markdownText: prev.showMarkdownPanel ? '' : prev.markdownText,
                    // 如果 JSON 输入为空，则使用当前布局的 JSON 表示
                    jsonInput: prev.jsonInput || JSON.stringify(prev.layout, null, 2)
                  };
                })}
              >
                <span className="mr-2">{state.showJsonPanel ? '🔄' : '📄'}</span>
                JSON输入
              </button>

            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4">
          {/* 水平布局：当两个面板都显示时 */}
          {state.showMarkdownPanel && state.showActionPanel && (
            <div className="flex justify-between pb-4 gap-4">
              <div className="w-1/2">
                <MarkdownParser
                  markdownText={state.markdownText}
                  onElementsGenerated={handleMarkdownElementsGenerated}
                  onMarkdownTextChange={handleMarkdownTextChange}
                />
              </div>
              <div className="w-1/2">
                <ActionPanel
                  markdownElements={state.markdownElements}
                  selectedElementId={state.selectedElementId}
                  layout={state.layout}
                  onAddComponent={addChildComponent}
                  onApplyCategoryPreset={applyCategoryPreset}
                  onUpdateElementStyle={(id, key, value) => updateElementStyle(id, key, value)}
                  onUpdateElementContent={(id, key, value) => updateElementContent(id, key, value)}
                  onMoveElement={moveElement}
                  onMoveElementToSibling={moveElementToSibling}
                  usedElementIds={Array.from(state.usedElementIds)}
                  onAddContainer={handleAddContainer}
                />
              </div>
            </div>
          )}

          {/* 单个面板布局：只显示Markdown面板 */}
          {state.showMarkdownPanel && !state.showActionPanel && (
            <div className="pb-4">
              <MarkdownParser
                markdownText={state.markdownText}
                onElementsGenerated={handleMarkdownElementsGenerated}
                onMarkdownTextChange={handleMarkdownTextChange}
              />
            </div>
          )}

          {/* 单个面板布局：只显示动作面板 */}
          {!state.showMarkdownPanel && state.showActionPanel && (
            <div className="pb-4">
              <ActionPanel
                markdownElements={state.markdownElements}
                selectedElementId={state.selectedElementId}
                layout={state.layout}
                onAddComponent={addChildComponent}
                onApplyCategoryPreset={applyCategoryPreset}
                onUpdateElementStyle={(id, key, value) => updateElementStyle(id, key, value)}
                onUpdateElementContent={(id, key, value) => updateElementContent(id, key, value)}
                onMoveElement={moveElement}
                onMoveElementToSibling={moveElementToSibling}
                usedElementIds={Array.from(state.usedElementIds)}
                onAddContainer={handleAddContainer}
              />
            </div>
          )}

          {/* JSON 输入面板 */}
          {state.showJsonPanel && (
            <div className="pb-4">
              <JsonInputPanel
                initialJson={state.jsonInput}
                onJsonChange={handleJsonInputChange}
                onApplyJson={handleApplyJson}
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
                className={`px-3 py-1 rounded-md text-sm flex items-center ${state.showComponentPanel ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
                onClick={() => setState(prev => ({ ...prev, showComponentPanel: !prev.showComponentPanel }))}
              >
                <span className="mr-2">🔍</span>
                组件树
              </button>
            </div>

            <div className="flex gap-2">
              {/* 主要布局预览区 - 占据更多空间 */}
              <div className={`${state.showComponentPanel ? 'w-3/4' : 'w-full'} min-h-[70vh] p-1`}>
                {state.layout ? (
                  <LayoutPreview
                    layout={state.layout}
                    selectedElementId={state.selectedElementId}
                    onElementClick={handleElementClick}
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
              {state.showComponentPanel && (
                <div className="w-1/4 px-2">
                  <div className="border rounded-lg h-full overflow-hidden">
                    <div className="bg-gray-50 px-3 py-2 border-b">
                      <h4 className="font-medium text-sm">组件结构树</h4>
                    </div>
                    <div className="p-2 overflow-auto" style={{ maxHeight: "calc(70vh - 40px)" }}>
                      {state.layout ? (
                        <ComponentStatusPanel
                          layout={state.layout}
                          selectedElementId={state.selectedElementId}
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
              onClick={() => setState(prev => ({ ...prev, showScorePanel: !prev.showScorePanel }))}
            >
              <h3 className="text-lg font-medium">布局评分</h3>
              <button className="text-gray-500 hover:text-gray-700">
                {state.showScorePanel ? '收起' : '展开'}
              </button>
            </div>

            {state.showScorePanel && (
              <div className="p-4">
                {state.layout ? (
                  <LayoutScoreEvaluator layout={state.layout} />
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
            transform: state.showPanel ? 'translateY(0)' : 'translateY(calc(100% - 40px))',
            zIndex: 10 // 确保控制面板在预览界面之上
          }}
        >
          <div
            className="flex justify-between items-center px-4 py-2 cursor-pointer bg-gray-50 hover:bg-gray-100"
            onClick={() => setState(prev => ({ ...prev, showPanel: !prev.showPanel }))}
          >
            <h3 className="text-lg font-medium">布局控制</h3>
            <button className="text-gray-500 hover:text-gray-700">
              {state.showPanel ? '收起' : '展开'}
            </button>
          </div>

          <div className="p-4 max-h-[70vh] overflow-y-auto">
            <div className="max-w-7xl mx-auto space-y-6">
              <LayoutControl
                selectedElement={state.layout ? findElement(state.layout, state.selectedElementId) : null}
                selectedElementId={state.selectedElementId}
                onStyleChange={(key, value) => updateElementStyle(state.selectedElementId || (state.layout && state.layout.id), key, value)}
                onContentChange={(key, value) => updateElementContent(state.selectedElementId || (state.layout && state.layout.id), key, value)}
                onActionChange={(key, value) => updateElementAction(state.selectedElementId || (state.layout && state.layout.id), key, value)}
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
                    value={state.jsonInput}
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