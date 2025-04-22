/**
 * 布局操作工具函数库
 * 
 * 提供处理布局元素的核心操作函数，可以在客户端和服务端环境中使用
 * 这些函数被设计为纯函数，不直接与UI状态交互，便于在不同环境中使用
 */

import { actions } from './reduxStore.js';

/**
 * 查找元素
 * @param {Object} layout - 布局对象
 * @param {string} id - 要查找的元素ID
 * @returns {Object|null} - 找到的元素或null
 */
export const findElement = (layout, id) => {
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

/**
 * 查找元素的父元素
 * @param {Object} layout - 布局对象
 * @param {string} childId - 子元素ID
 * @returns {Object|null} - 找到的父元素或null
 */
export const findParentElement = (layout, childId) => {
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

/**
 * 生成标准元素ID
 * @param {Object} element - 元素对象
 * @returns {string} - 生成的ID
 */
export const generateStandardId = (element) => {
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

/**
 * 为布局树中的所有元素添加ID
 * @param {Object} element - 元素对象
 * @returns {Object} - 添加了ID的元素
 */
export const addIds = (element) => {
  if (!element) return null;  // 如果元素为空，返回null
  if (element.id) return element; // 如果已有ID则跳过

  const newElement = { ...element };

  // 使用内容和特征生成ID
  newElement.id = generateStandardId(newElement);

  if (newElement.children) {
    newElement.children = newElement.children.map(child => addIds(child));
  }
  return newElement;
};

/**
 * 添加容器 - 内部实现
 * @param {Object} currentLayout - 当前布局
 * @param {Array} elements - 要添加的元素数组 
 * @param {string} parentId - 父容器ID
 * @param {string} predefinedContainerId - 预定义的容器ID
 * @returns {Object} - {containerId, newLayout} 新容器ID和更新后的布局
 */
export const addContainerImpl = (currentLayout, elements = [], parentId = null, predefinedContainerId = null) => {
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
  
  // 如果提供了预定义ID，则使用它
  if (predefinedContainerId) {
    // 从预定义ID中提取标准部分，确保符合标准格式
    if (!predefinedContainerId.startsWith('element_')) {
      // 将其转换为符合标准格式的ID
      newContainer.id = `element_${predefinedContainerId}`;
    } else {
      newContainer.id = predefinedContainerId;
    }
  }
  
  // 将选中的元素添加到容器中
  if (elements && elements.length > 0) {
    // 确保每个元素都有ID
    newContainer.children = elements.map(element => {
      if (!element.id) {
        const elementWithId = {
          ...element,
          id: generateStandardId(element)
        };
        return elementWithId;
      }
      return element;
    });
  }
  
  // 添加ID，基于容器内容生成（如果没有预定义ID）
  const containerWithId = newContainer.id ? newContainer : addIds(newContainer);
  
  // 如果没有根容器，这个容器将成为根容器
  if (!currentLayout) {
    return {
      containerId: containerWithId.id,
      newLayout: { ...containerWithId },
      usedElementIds: elements.map(element => element.id).filter(Boolean)
    };
  }
  
  // 如果已有根容器，将新容器添加为子元素
  const parentElementId = parentId || currentLayout.id;
  
  // 更新布局
  const updateElement = (layout) => {
    if (layout.id === parentElementId) {
      // 将新容器添加到父元素
      return {
        ...layout,
        children: [...(layout.children || []), containerWithId]
      };
    }
    
    if (layout.children) {
      return {
        ...layout,
        children: layout.children.map(child => updateElement(child))
      };
    }
    
    return layout;
  };
  
  // 执行更新
  const newLayout = updateElement(currentLayout);
  
  // 收集要更新的元素ID
  const usedElementIds = elements
    .map(element => element.id)
    .filter(Boolean);
  
  return {
    containerId: containerWithId.id,
    newLayout,
    usedElementIds
  };
};

/**
 * 添加子组件 - 内部实现
 * @param {Object} currentLayout - 当前布局
 * @param {string} parentId - 父元素ID
 * @param {string} type - 组件类型
 * @param {Object} markdownElement - 预定义元素(可选)
 * @param {Set} usedElementIds - 已使用的元素ID集合
 * @returns {Object} - {elementId, newLayout} 新元素ID和更新后的布局
 */
export const addChildComponentImpl = (currentLayout, parentId, type, markdownElement, usedElementIds = new Set()) => {
  // 如果没有布局，直接返回错误信息
  if (!currentLayout) {
    return { error: '无法添加组件：布局不存在' };
  }
  
  // 如果元素已被使用，不允许重复添加
  if (markdownElement && markdownElement.id && usedElementIds && usedElementIds.has(markdownElement.id)) {
    return { error: '无法添加组件：元素已被使用' };
  }
  
  // 查找父元素
  const parentElement = findElement(currentLayout, parentId);
  if (!parentElement) {
    return { error: `找不到父元素: ${parentId}` };
  }
  
  // 检查：如果父元素是文本元素，则尝试找到祖父元素
  if (parentElement.type === 'text' && parentElement.id !== currentLayout.id) {
    const grandParent = findParentElement(currentLayout, parentId);
    if (grandParent) {
      return addChildComponentImpl(currentLayout, grandParent.id, type, markdownElement, usedElementIds);
    }
  }
  
  // 创建新元素
  const newElement = markdownElement || {
    type,
    id: generateStandardId({ type, content: { value: type } }),
    content: { value: type }
  };
  
  // 确保元素具有唯一ID
  if (!newElement.id || (markdownElement && !markdownElement.id)) {
    newElement.id = generateStandardId(newElement);
  }
  
  // 确保ID唯一
  const existingElement = findElement(currentLayout, newElement.id);
  if (existingElement) {
    // 如果ID已存在，添加随机后缀确保唯一性
    newElement.id = `${newElement.id}_${Math.random().toString(36).substring(2, 7)}`;
  }
  
  // 更新布局结构
  const updateElement = (layout) => {
    if (layout.id === parentId) {
      if (!layout.children) {
        layout.children = [];
      }
      layout.children.push(newElement);
      return layout;
    }
    
    if (layout.children) {
      layout.children = layout.children.map(child => updateElement(child));
    }
    
    return layout;
  };
  
  const newLayout = updateElement({ ...currentLayout });
  
  // 返回新元素ID和更新后的布局
  return {
    elementId: newElement.id,
    newLayout,
    usedElementIds: markdownElement && markdownElement.id ? [markdownElement.id] : []
  };
};

/**
 * 应用预设到元素 - 内部实现
 * @param {Object} currentLayout - 当前布局
 * @param {string} elementId - 元素ID
 * @param {string} category - 预设类别
 * @param {string} presetKey - 预设键名
 * @param {boolean} asArray - 是否作为数组
 * @param {Function} applyPresetToElement - 预设应用函数
 * @returns {Object} - 更新后的布局
 */
export const applyCategoryPresetImpl = (currentLayout, elementId, category, presetKey, asArray = false, applyPresetToElement) => {
  if (!currentLayout) {
    return { error: '布局为空，无法应用预设' };
  }
  
  if (!elementId) {
    return { error: `无法应用预设: 元素ID为空` };
  }
  
  // 更新元素函数
  const updateElement = (layout) => {
    if (!layout) return null;
    
    if (layout.id === elementId) {
      try {
        // 使用提供的applyPresetToElement函数
        if (typeof applyPresetToElement !== 'function') {
          throw new Error('必须提供 applyPresetToElement 函数来应用预设');
        }
        
        return applyPresetToElement(layout, category, presetKey, asArray);
      } catch (error) {
        console.error('应用预设失败:', error);
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
  
  const newLayout = updateElement({ ...currentLayout });
  // TODO: 这里可能没有更新  
  // 检查是否找到并更新了元素
  // const elementWasFound = JSON.stringify(newLayout) !== JSON.stringify(currentLayout);
  // if (!elementWasFound) {
  //   return { error: `未找到ID为 ${elementId} 的元素，无法应用预设` };
  // }
  
  return { newLayout };
};

/**
 * 更新元素样式 - 内部实现
 * @param {Object} currentLayout - 当前布局
 * @param {string} elementId - 元素ID
 * @param {string} key - 样式属性名
 * @param {any} value - 样式属性值
 * @returns {Object} - 更新后的布局
 */
export const updateElementStyleImpl = (currentLayout, elementId, key, value) => {
  if (!currentLayout || !elementId) {
    return { error: '无效的布局或元素ID' };
  }
  
  const updateElement = (layout) => {
    if (layout.id === elementId) {
      const newLayout = { ...layout };
      if (!newLayout.style) newLayout.style = {};
      
      // 处理数值类型
      if (key === 'width' || key === 'height') {
        if (!isNaN(value) && value !== '') {
          value = Number(value);
        }
      }
      
      // 处理特殊的尺寸模式
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
  
  const newLayout = updateElement(currentLayout);
  
  return { newLayout };
};

/**
 * 更新元素内容 - 内部实现
 * @param {Object} currentLayout - 当前布局
 * @param {string} elementId - 元素ID
 * @param {string} key - 内容属性名
 * @param {any} value - 内容属性值
 * @returns {Object} - 更新后的布局
 */
export const updateElementContentImpl = (currentLayout, elementId, key, value) => {
  if (!currentLayout || !elementId) {
    return { error: '无效的布局或元素ID' };
  }
  
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
  
  const newLayout = updateElement(currentLayout);
  
  return { newLayout };
};

/**
 * 更新元素操作 - 内部实现
 * @param {Object} currentLayout - 当前布局
 * @param {string} elementId - 元素ID
 * @param {string} key - 操作属性名
 * @param {any} value - 操作属性值
 * @returns {Object} - 更新后的布局
 */
export const updateElementActionImpl = (currentLayout, elementId, key, value) => {
  if (!currentLayout || !elementId) {
    return { error: '无效的布局或元素ID' };
  }
  
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
  
  const newLayout = updateElement(currentLayout);
  
  return { newLayout };
};

/**
 * 移动元素到目标容器 - 内部实现
 * @param {Object} currentLayout - 当前布局
 * @param {string} elementId - 要移动的元素ID
 * @param {string} targetContainerId - 目标容器ID
 * @returns {Object} - 更新后的布局或错误信息
 */
export const moveElementImpl = (currentLayout, elementId, targetContainerId) => {
  if (!currentLayout) {
    return { error: '无效的布局' };
  }
  
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
  
  // 创建布局的深拷贝
  const layoutCopy = JSON.parse(JSON.stringify(currentLayout));
  
  // 在拷贝上开始查找
  findElementAndParent(layoutCopy);
  findTargetContainer(layoutCopy);
  
  // 如果未找到元素或目标容器，则退出
  if (!foundElement || !targetContainer) {
    return { error: '找不到要移动的元素或目标容器' };
  }
  
  // 循环检测：只需要检查容器类型的元素
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
    return { error: '不能将容器移动到其子元素中，这会形成循环' };
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
  
  return { newLayout: layoutCopy };
};

/**
 * 清除布局 - 内部实现
 * 返回Redux动作对象，由调用者决定如何处理
 * @returns {Array} - 要分派的Redux动作数组
 */
export const clearLayoutImpl = () => {
  return [
    actions.clearLayout(),
    actions.resetUsedElementIds()
  ];
};

/**
 * 删除元素 - 内部实现
 * @param {Object} currentLayout - 当前布局
 * @param {string} elementId - 要删除的元素ID
 * @returns {Object} - 更新后的布局或错误信息
 */
export const deleteElementImpl = (currentLayout, elementId) => {
  if (!currentLayout || !elementId) {
    return { error: '无效的布局或元素ID' };
  }
  
  const deleteElementById = (layout) => {
    if (!layout.children) return layout;
    
    return {
      ...layout,
      children: layout.children
        .filter(child => child.id !== elementId)
        .map(child => deleteElementById(child))
    };
  };
  
  const newLayout = deleteElementById({ ...currentLayout });
  
  return { newLayout };
};

/**
 * 为Markdown元素生成标准化ID
 * @param {Array} elements - Markdown元素数组
 * @returns {Array} - 添加了标准化ID的元素数组
 */
export const standardizeMarkdownElementsIds = (elements) => {
  if (!elements || !Array.isArray(elements)) {
    return [];
  }
  
  // 为元素添加标准化ID
  const elementsWithIds = elements.map(element => {
    if (!element.id) {
      return {
        ...element,
        id: generateStandardId(element)
      };
    }
    return element;
  });
  
  // 确保没有重复ID
  const idMap = new Map();
  const uniqueElements = elementsWithIds.map(element => {
    if (idMap.has(element.id)) {
      // 如果ID已存在，添加随机后缀
      const newId = `${element.id}_${Math.random().toString(36).substring(2, 7)}`;
      return { ...element, id: newId };
    }
    
    idMap.set(element.id, true);
    return element;
  });
  
  return uniqueElements;
};

/**
 * 处理添加容器 - 增强版综合实现
 * @param {Object} currentLayout - 当前布局
 * @param {Array} selectedElements - 要添加的元素数组
 * @param {string} parentId - 父容器ID
 * @param {string} predefinedContainerId - 预定义的容器ID
 * @param {string} selectedElementId - 当前选中的元素ID
 * @param {Set} usedElementIds - 已使用的元素ID集
 * @returns {Object} - {containerId, newLayout, usedElementIds, error} 处理结果
 */
export const handleAddContainerImpl = (currentLayout, selectedElements = [], parentId = null, predefinedContainerId = null, selectedElementId = null, usedElementIds = null) => {
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

  // 如果提供了预定义ID，则使用它
  if (predefinedContainerId) {
    // 从预定义ID中提取标准部分，确保符合标准格式
    if (!predefinedContainerId.startsWith('element_')) {
      // 将其转换为符合标准格式的ID
      newContainer.id = `element_${predefinedContainerId}`;
    } else {
      newContainer.id = predefinedContainerId;
    }
  }

  // 检查是否已有相同内容的容器
  const checkDuplicateContainer = (container, elements) => {
    if (!container || !container.children || !elements || elements.length === 0) {
      return false;
    }

    // 检查是否有相同数量的子元素
    if (container.children.length !== elements.length) {
      return false;
    }

    // 检查每个子元素是否匹配
    const allElementsMatch = elements.every(element => {
      // 使用ID匹配，因为ID是基于内容生成的，相同内容会有相同ID
      return container.children.some(child =>
        child.id === element.id ||
        (child.content && element.content &&
          JSON.stringify(child.content) === JSON.stringify(element.content))
      );
    });

    return allElementsMatch;
  };

  // 检查布局中是否已存在相同内容的容器
  if (currentLayout && selectedElements && selectedElements.length > 0) {
    // 检查根容器
    if (checkDuplicateContainer(currentLayout, selectedElements)) {
      return { 
        containerId: currentLayout.id,
        newLayout: currentLayout,
        isDuplicate: true
      };
    }

    // 检查子容器
    if (currentLayout.children) {
      for (const child of currentLayout.children) {
        if (child.type === 'container' && checkDuplicateContainer(child, selectedElements)) {
          return { 
            containerId: child.id,
            newLayout: currentLayout,
            isDuplicate: true
          };
        }
      }
    }
  }

  // 将选中的元素添加到容器中
  if (selectedElements && selectedElements.length > 0) {
    // 确保每个元素都有ID
    newContainer.children = selectedElements.map(element => {
      if (!element.id) {
        const elementWithId = {
          ...element,
          id: generateStandardId(element)
        };
        return elementWithId;
      }
      return element;
    });
  }

  // 添加ID，基于容器内容生成（如果没有预定义ID）
  const containerWithId = newContainer.id ? newContainer : addIds(newContainer);

  // 收集要更新的元素ID
  const newUsedElementIds = [];
  selectedElements.forEach(element => {
    if (element.id) {
      newUsedElementIds.push(element.id);
    }
  });

  if (!currentLayout) {
    // 如果没有根容器，这个容器将成为根容器
    const newLayout = {
      ...containerWithId
    };
    
    return {
      containerId: containerWithId.id,
      newLayout,
      usedElementIds: newUsedElementIds
    };
  } else {
    // 如果已有根容器，将新容器添加为子元素
    const parentElementId = parentId || selectedElementId || currentLayout.id;

    // 确保将选中的元素添加到新容器中并且有唯一ID
    containerWithId.children = selectedElements.map(element => {
      // 如果是新元素，添加ID
      const elementWithId = addIds({ ...element });
      return elementWithId;
    });

    // 创建一个深拷贝的布局
    const layoutCopy = JSON.parse(JSON.stringify(currentLayout));
    
    // 更新布局
    const updateElement = (layout) => {
      if (layout.id === parentElementId) {
        // 将新容器添加到父元素
        return {
          ...layout,
          children: [...(layout.children || []), containerWithId]
        };
      }

      if (layout.children) {
        return {
          ...layout,
          children: layout.children.map(child => updateElement(child))
        };
      }

      return layout;
    };

    const newLayout = updateElement(layoutCopy);
    
    return {
      containerId: containerWithId.id,
      newLayout,
      usedElementIds: newUsedElementIds
    };
  }
}; 