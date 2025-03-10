'use client';
import React, { useState, useRef, useEffect } from 'react';
import LayoutControl from '../layout-panel/LayoutPanel';
import LayoutPreview from './LayoutPreview';
import LayoutScoreEvaluator from './LayoutScoreEvaluator';
import ComponentStatusPanel from './ComponentStatusPanel';
import elementPresets, { applyPresetToElement, mergeElementPresets } from '../../utils/presetSystem';
import { elementDefinitions } from '../../utils/elementDefinitions';

/**
 * 布局编辑器组件 - 整合预览、控制面板和评分功能
 * @param {Object} props
 * @param {Object} props.initialLayout - 初始布局数据
 */
const LayoutEditor = ({ initialLayout }) => {
  // 使用ref作为ID计数器，在渲染之间保持状态
  const idCounterRef = useRef(0);

  // 生成顺序ID
  const generateId = () => {
    idCounterRef.current += 1;
    return `element_${idCounterRef.current}`;
  };

  // 添加ID到布局树
  const addIds = (element) => {
    if (element.id) return element; // 如果已有ID则跳过

    const newElement = { ...element };
    newElement.id = generateId();
    if (newElement.children) {
      newElement.children = newElement.children.map(child => addIds(child));
    }
    return newElement;
  };

  // 使用初始化函数确保一致的ID
  const [state, setState] = useState(() => {
    const layoutWithIds = addIds(initialLayout);
    return {
      jsonInput: JSON.stringify(layoutWithIds, null, 2),
      jsonError: '',
      layout: layoutWithIds,
      showPanel: true,
      selectedElementId: layoutWithIds.id // 默认选中根容器元素
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
    if (layout.id === id) return layout;
    if (layout.children) {
      for (const child of layout.children) {
        const found = findElement(child, id);
        if (found) return found;
      }
    }
    return null;
  };

  // 更新元素样式
  const updateElementStyle = (elementId, key, value) => {
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
    event.stopPropagation();
    setState(prev => ({
      ...prev,
      selectedElementId: element.id,
      showPanel: true
    }));
  };

  // 处理元素选择 - 仅选中元素不显示面板
  const handleElementSelect = (element, event) => {
    event.stopPropagation();
    setState(prev => ({
      ...prev,
      selectedElementId: element.id,
      // 不更改showPanel状态，保持当前状态
    }));
  };

  // 处理内容更新
  const updateElementContent = (elementId, key, value) => {
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
  const addChildComponent = (parentId, type, preset) => {
    // 根据类型创建新元素
    let newElement = {};
    if (elementDefinitions[type]) {
      newElement = {
        ...elementDefinitions[type],
        preset
      };
    } else {
      newElement = {
        type,
        style: { ...elementDefinitions.commonStyleProps },
        preset
      };
    }

    // 添加默认预设值 - 确保UI中显示选中状态
    // 这些默认预设会应用于新创建的元素
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

    // 返回新创建的元素ID，以便外部使用
    return newElement.id;
  };

  // 旧版预设选择方法已移除，统一使用分类预设系统

  // 应用分类预设样式
  const applyCategoryPreset = (category, presetKey) => {
    const elementId = state.selectedElementId || state.layout.id;

    const updateElement = (layout) => {
      if (layout.id === elementId) {
        // 使用新的预设系统应用预设
        let newLayout = applyPresetToElement(layout, category, presetKey);
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

  // 删除元素
  const deleteElement = (id) => {
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

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full">
        {/* 布局预览和元件状态区 */}
        <div className="flex">
          {/* 左侧布局预览 */}
          <div className="flex-grow">
            <LayoutPreview
              layout={state.layout}
              selectedElementId={state.selectedElementId}
              onElementClick={handleElementClick}
            />
          </div>

          {/* 右侧元件状态区 */}
          <div className="w-80">
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
          </div>
        </div>

        {/* 布局评分 */}
        <div className="max-w-7xl mx-auto px-4">
          <LayoutScoreEvaluator layout={state.layout} />
        </div>

        {/* 控制面板 */}
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
                selectedElement={findElement(state.layout, state.selectedElementId) || state.layout}
                selectedElementId={state.selectedElementId || state.layout.id}
                onStyleChange={(key, value) => updateElementStyle(state.selectedElementId || state.layout.id, key, value)}
                onContentChange={(key, value) => updateElementContent(state.selectedElementId || state.layout.id, key, value)}
                onActionChange={(key, value) => updateElementAction(state.selectedElementId || state.layout.id, key, value)}
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