"use client";
import React, { useState, useEffect, useRef } from "react";
import { getAvailablePresets } from "../../utils/presetSystem";
import ActionExecutor from "../../utils/actionExecutor";
import { getAllActions, getCategoryActions } from "../../utils/actionConfig";
import globalLayoutState from "../../utils/globalLayoutState"; // 导入全局布局状态

/**
 * 新版动作操作面板 - 用于强化学习环境的动作选择
 *
 * 此组件基于抽象化的动作配置系统，展示所有可用的动作选项，包括:
 * - 从Markdown生成的元素添加
 * - 应用预设
 * - 修改核心属性
 * - 移动元素
 * - 录制和回放功能
 */
const NewActionPanel = ({
  markdownElements = [], // 从Markdown解析出的元素列表
  selectedElementId, // 当前选中的元素ID
  layout, // 当前布局
  onAddComponent, // 添加组件的函数
  onApplyCategoryPreset, // 应用分类预设的函数
  onUpdateElementStyle, // 更新元素样式的函数
  onUpdateElementContent, // 更新元素内容的函数
  onMoveElement, // 移动元素到容器的函数
  onMoveElementToSibling, // 移动元素到同级位置的函数
  usedElementIds = [], // 已使用的元素ID列表
  onAddContainer, // 添加容器的函数
  onClearLayout, // 清除布局的函数
  onSetMarkdownData, // 设置 Markdown 数据的函数
  onResetUsedElements, // 重置已使用元素 IDs 的函数
  markdownText = "", // 当前 Markdown 文本
  // 添加状态相关的props
  loading = false,
  setLoading = () => {},
  message = "",
  setMessage = () => {},
  error = "",
  setError = () => {},
  onImportSequence = null,
  actionExecutor = null,
}) => {
  // 设置当前活动的标签页
  const [activeTab, setActiveTab] = useState("components");
  // 添加容器时选中的元素
  const [selectedElements, setSelectedElements] = useState([]);
  // 录制状态
  const [isRecording, setIsRecording] = useState(false);
  const [recordingName, setRecordingName] = useState("");
  // 动作执行器实例
  const [actionExecutorInstance, setActionExecutorInstance] = useState(null);

  // 内部状态 - 如果外部未提供，则使用内部状态
  const [internalLoading, setInternalLoading] = useState(false);
  const [internalMessage, setInternalMessage] = useState("");
  const [internalError, setInternalError] = useState("");

  // 使用传入的状态或内部状态
  const actualLoading = loading !== undefined ? loading : internalLoading;
  const actualSetLoading =
    typeof setLoading === "function" ? setLoading : setInternalLoading;
  const actualMessage = message !== undefined ? message : internalMessage;
  const actualSetMessage =
    typeof setMessage === "function" ? setMessage : setInternalMessage;
  const actualError = error !== undefined ? error : internalError;
  const actualSetError =
    typeof setError === "function" ? setError : setInternalError;

  // 录制相关状态 - 移到组件顶层
  const [recordedSequences, setRecordedSequences] = useState({});
  const [currentRecording, setCurrentRecording] = useState(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [sequenceName, setSequenceName] = useState("");

  // 添加文件输入引用
  const fileInputRef = useRef(null);

  // 初始化动作执行器
  useEffect(() => {
    // 如果已经从props传入了actionExecutor，直接使用
    if (actionExecutor) {
      setActionExecutorInstance(actionExecutor);
      return;
    }

    // 否则创建新的实例
    const executor = new ActionExecutor({
      onAddComponent,
      onAddContainer,
      onApplyPreset: onApplyCategoryPreset,
      onUpdateElementStyle,
      onUpdateElementContent,
      onMoveElement,
      onMoveElementToSibling,
      onClearLayout,
      onSetMarkdownData,
      onResetUsedElements,
      onActionExecuted: (actionData) => {
        console.log("Action executed:", actionData);
      },
      onError: (error) => {
        console.error("Action error:", error);
      },
    });

    setActionExecutorInstance(executor);
  }, [
    actionExecutor,
    onAddComponent,
    onAddContainer,
    onApplyCategoryPreset,
    onUpdateElementStyle,
    onUpdateElementContent,
    onMoveElement,
    onMoveElementToSibling,
    onClearLayout,
    onSetMarkdownData,
    onResetUsedElements,
  ]);

  // 获取未使用的元素
  const unusedElements = markdownElements.filter(
    (element) => !usedElementIds.includes(element.id),
  );

  // 处理容器添加
  const handleAddContainer = () => {
    if (actionExecutorInstance) {
      actionExecutorInstance.executeAction("componentActions", "addContainer", {
        elements: selectedElements,
        parentId: layout ? layout.id : null,
      });
      setSelectedElements([]); // 清空选择
    } else {
      // 兼容旧版接口
      onAddContainer(selectedElements);
      setSelectedElements([]);
    }
  };

  // 处理元素选择
  const handleElementSelect = (element) => {
    setSelectedElements((prev) => {
      const index = prev.findIndex((e) => e.id === element.id);
      if (index === -1) {
        return [...prev, element];
      }
      return prev.filter((e) => e.id !== element.id);
    });
  };

  // 获取元素图标
  const getElementIcon = (type) => {
    switch (type) {
      case "container":
        return "🔲";
      case "text":
        return "📝";
      case "button":
        return "🔘";
      case "image":
        return "🖼️";
      case "input":
        return "📋";
      case "icon":
        return "⭐";
      case "divider":
        return "➖";
      default:
        return "📄";
    }
  };

  // 查找所有容器元素，用于移动功能
  const findAllContainers = (rootElement) => {
    const containers = [];

    const traverse = (element) => {
      if (element.type === "container") {
        containers.push(element);
      }

      if (element.children) {
        element.children.forEach(traverse);
      }
    };

    // 只有当根元素存在时才遍历
    if (rootElement) {
      traverse(rootElement);
    }
    return containers;
  };

  // 查找元素的同级元素
  const findSiblings = (rootElement, elementId) => {
    const siblings = [];
    let parentElement = null;

    // 如果根元素不存在，直接返回空数组
    if (!rootElement) {
      return siblings;
    }

    // 辅助函数：查找元素的父元素
    const findParent = (element, targetId, parent = null) => {
      if (!element) return null;

      if (element.children) {
        for (const child of element.children) {
          if (child.id === targetId) {
            return element;
          }
        }

        for (const child of element.children) {
          const result = findParent(child, targetId, element);
          if (result) return result;
        }
      }

      return null;
    };

    // 查找元素的父元素
    parentElement = findParent(rootElement, elementId);

    // 如果找到父元素，获取其所有子元素（除了当前元素本身）
    if (parentElement && parentElement.children) {
      parentElement.children.forEach((child) => {
        if (child.id !== elementId) {
          siblings.push(child);
        }
      });
    }

    return siblings;
  };

  // 使用通过导入的getAvailablePresets获取元素的可用预设
  const getElementPresets = (elementId) => {
    // 如果没有布局或元素ID，返回空对象
    if (!layout || !elementId) return {};

    // 查找元素
    const element = findElement(layout, elementId);
    if (!element || !element.type) return {};

    // 使用预设系统的函数获取可用预设
    return getAvailablePresets(element.type);
  };

  // 获取预设名称的中文显示
  const getPresetName = (presetKey) => {
    const presetMap = {
      layoutPreset: "布局预设",
      spacingPreset: "间距预设",
      appearancePreset: "外观预设",
      typographyPreset: "排版预设",
      sizePreset: "尺寸预设",
      selfAlignPreset: "自对齐",
      textAlignPreset: "文本对齐",
      flexRatioPreset: "Flex比例",
      buttonSizePreset: "按钮尺寸",
      imageProportionPreset: "图片比例",
    };

    return presetMap[presetKey] || presetKey.replace("Preset", "");
  };

  // 渲染容器标签页内容
  const renderContainerTab = () => {
    return (
      <div>
        <h4 className="font-medium mb-3">添加新容器</h4>
        {!layout && (
          <div className="mb-4">
            <p className="text-sm text-yellow-600 mb-2">
              ⚠️ 将创建一个根容器来开始布局
            </p>
          </div>
        )}

        <div className="space-y-4">
          {/* 可选元素列表 */}
          <div>
            <h5 className="text-sm font-medium mb-2">选择要包含的元素：</h5>
            {unusedElements.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {unusedElements.map((element) => (
                  <button
                    key={element.id}
                    className={`p-2 border rounded flex items-center ${
                      selectedElements.some((e) => e.id === element.id)
                        ? "bg-blue-50 border-blue-300"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => handleElementSelect(element)}
                  >
                    <span className="mr-2">{getElementIcon(element.type)}</span>
                    <div className="text-left">
                      <div className="text-sm font-medium">
                        {element.content?.value ||
                          element.content?.text ||
                          element.type}
                      </div>
                      <div className="text-xs text-gray-500">
                        {element.type}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-center py-2">
                <p>没有可用的未使用元素</p>
              </div>
            )}
          </div>

          {/* 容器说明 */}
          <div className="p-4 border rounded-lg bg-gray-50">
            <h5 className="text-sm font-medium mb-2">容器说明：</h5>
            <p className="text-sm text-gray-600 mb-2">
              容器是用来组织和布局其他元素的基本单位。您可以：
            </p>
            <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
              {[
                { id: "add", text: "添加一个新的容器，可选择包含未使用的元素" },
                { id: "nest", text: '在"移动"标签页中调整容器的嵌套关系' },
              ].map((item) => (
                <li key={item.id}>{item.text}</li>
              ))}
            </ul>
          </div>

          {/* 添加容器按钮 */}
          <button
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            onClick={handleAddContainer}
          >
            {!layout
              ? "创建根容器"
              : `添加新容器${selectedElements.length > 0 ? `(包含 ${selectedElements.length} 个元素)` : ""}`}
          </button>
        </div>
      </div>
    );
  };

  // 渲染组件标签页内容
  const renderComponentsTab = () => {
    const handleAddComponent = (element) => {
      if (actionExecutorInstance) {
        actionExecutorInstance.executeAction(
          "componentActions",
          "addComponent",
          {
            parentId: selectedElementId || (layout ? layout.id : null),
            componentType: element.type,
            elementData: element,
          },
        );
      } else {
        // 兼容旧版接口
        onAddComponent(
          selectedElementId || (layout ? layout.id : null),
          element.type,
          element,
        );
      }
    };

    return (
      <div>
        <h4 className="font-medium mb-3">可用组件</h4>
        {unusedElements.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {unusedElements.map((element) => (
              <button
                key={element.id}
                className={`p-3 border rounded flex items-center ${
                  !layout || layout.type !== "container"
                    ? "bg-gray-100 cursor-not-allowed"
                    : "hover:bg-blue-50 hover:border-blue-300"
                } transition-colors`}
                onClick={() => {
                  if (layout && layout.type === "container") {
                    handleAddComponent(element);
                  }
                }}
                disabled={!layout || layout.type !== "container"}
              >
                <span className="mr-2 text-xl">
                  {getElementIcon(element.type)}
                </span>
                <div className="text-left">
                  <div className="font-medium">
                    {element.content?.value ||
                      element.content?.text ||
                      element.type}
                  </div>
                  <div className="text-xs text-gray-500">
                    {element.type}
                    {element.typographyPreset && (
                      <span className="ml-2 font-semibold text-blue-600">
                        ({element.typographyPreset})
                      </span>
                    )}
                    {element.buttonSizePreset && (
                      <span className="ml-2 font-semibold text-blue-600">
                        ({element.buttonSizePreset})
                      </span>
                    )}
                    {element.imageProportionPreset && (
                      <span className="ml-2 font-semibold text-blue-600">
                        ({element.imageProportionPreset})
                      </span>
                    )}
                    {element.layoutPreset && (
                      <span className="ml-2 font-semibold text-blue-600">
                        ({element.layoutPreset})
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-center py-4">
            <p>没有可用的组件</p>
            <p className="text-sm">所有组件已添加到布局中</p>
          </div>
        )}

        {/* 添加已使用组件的提示信息 */}
        {markdownElements.length > unusedElements.length && (
          <div className="mt-4 p-3 bg-gray-50 border rounded-lg">
            <h5 className="text-sm font-medium mb-2">已使用的组件</h5>
            <div className="text-sm text-gray-600">
              <p>
                已添加 {markdownElements.length - unusedElements.length}{" "}
                个组件到布局中
              </p>
              <p className="mt-1">
                提示：已使用的组件可以在"移动"标签页中调整位置
              </p>
            </div>
            <div className="mt-2 space-y-2">
              {markdownElements
                .filter((element) => usedElementIds.includes(element.id))
                .map((element) => (
                  <div
                    key={element.id}
                    className="flex items-center p-2 bg-white border rounded"
                  >
                    <span className="mr-2 text-xl opacity-50">
                      {getElementIcon(element.type)}
                    </span>
                    <div className="text-left">
                      <div className="font-medium text-gray-400">
                        {element.content?.value ||
                          element.content?.text ||
                          element.type}
                      </div>
                      <div className="text-xs text-gray-400">
                        {element.type}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // 渲染预设标签页内容
  const renderPresetsTab = () => {
    const handleApplyPreset = (presetCategory, presetKey) => {
      if (!selectedElementId) {
        console.error("无法应用预设：未选中任何元素");
        setError("请先选择一个元素，然后再应用预设");
        return;
      }

      // 优先使用当前组件接收的布局，其次使用全局布局状态
      const currentLayout = layout || globalLayoutState.getLayout();
      
      // 添加对布局状态的检查
      if (!currentLayout) {
        console.error("无法应用预设：布局为空");
        setError("布局似乎为空，请确保容器已创建成功");
        return;
      }

      // 找到选中的元素并打印更多信息
      const selectedElement = findElement(currentLayout, selectedElementId);
      if (!selectedElement) {
        console.error(`无法应用预设：找不到ID为 ${selectedElementId} 的元素`);
        setError(`找不到选中的元素（ID: ${selectedElementId}）`);
        return;
      }

      console.log(`准备应用预设，布局状态:`, 
        {
          hasLayout: !!currentLayout,
          layoutId: currentLayout?.id,
          elementExists: !!selectedElement,
          elementType: selectedElement?.type,
          elementId: selectedElementId,
          presetCategory,
          presetKey,
          usingGlobalLayout: layout === null && currentLayout !== null
        }
      );

      // 确保全局布局状态已更新
      if (currentLayout && !layout) {
        console.log("当前使用的是全局布局状态，确保全局状态已同步...");
        globalLayoutState.updateLayout(currentLayout);
      }

      // 确保布局在 UI 中已更新
      setTimeout(() => {
        // 再次检查布局状态，确保UI线程中布局仍然可用
        const uiThreadLayout = layout || globalLayoutState.getLayout();
        if (!uiThreadLayout) {
          console.error("应用预设失败：UI线程中布局状态丢失");
          setError("布局状态异常，请尝试重新创建容器");
          return;
        }

        if (actionExecutorInstance) {
          try {
            console.log("应用预设，当前布局状态:", uiThreadLayout ? "布局存在" : "布局为空");
            console.log("应用预设到元素:", selectedElementId);
            
            actionExecutorInstance.executeAction("presetActions", "applyPreset", {
              elementId: selectedElementId,
              presetCategory,
              presetKey,
            });
          } catch (error) {
            console.error("应用预设失败:", error);
            setError(`应用预设失败: ${error.message}`);
          }
        } else {
          // 兼容旧版接口
          try {
            console.log("使用旧版接口应用预设，当前布局状态:", uiThreadLayout ? "布局存在" : "布局为空");
            console.log("应用预设到元素:", selectedElementId);
            
            onApplyCategoryPreset(selectedElementId, presetCategory, presetKey);
          } catch (error) {
            console.error("应用预设失败:", error);
            setError(`应用预设失败: ${error.message}`);
          }
        }
      }, 100); // 添加小延迟确保状态已更新
    };

    const isActionDisabled = !layout || !selectedElementId;
    const availablePresets = selectedElementId
      ? getElementPresets(selectedElementId)
      : {};

    return (
      <div>
        <h4 className="font-medium mb-3">可用预设</h4>
        {!isActionDisabled ? (
          Object.keys(availablePresets).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(availablePresets).map(
                ([presetCategory, presetObj]) => (
                  <div key={presetCategory} className="border rounded-lg p-3">
                    <h5 className="font-medium mb-2">
                      {getPresetName(presetCategory)}
                    </h5>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(presetObj).map(([presetKey, preset]) => (
                        <button
                          key={`${presetCategory}-${presetKey}`}
                          className="px-3 py-2 border rounded text-sm hover:bg-blue-50 hover:border-blue-300"
                          onClick={() =>
                            handleApplyPreset(presetCategory, presetKey)
                          }
                        >
                          <div className="text-sm font-medium">
                            {preset.name}
                          </div>
                          <div className="text-xs text-gray-600">
                            {preset.description?.substring(0, 20)}
                            {preset.description?.length > 20 ? "..." : ""}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ),
              )}
            </div>
          ) : (
            <div className="text-gray-500 text-center py-4">
              <p>当前元素没有可用预设</p>
            </div>
          )
        ) : (
          <div className="text-gray-500 text-center py-4">
            <p>请先选择一个元素</p>
          </div>
        )}
      </div>
    );
  };

  // 根据元素类型渲染不同的核心属性配置
  const renderCoreProperties = () => {
    if (!selectedElementId || !layout) return null;

    const selectedElement = findElement(layout, selectedElementId);
    if (!selectedElement) return null;

    const { type, content } = selectedElement;

    const handleUpdateContent = (property, value) => {
      if (actionExecutorInstance) {
        actionExecutorInstance.executeAction(
          "propertyActions",
          "updateElementContent",
          {
            elementId: selectedElementId,
            contentProperty: property,
            value,
          },
        );
      } else {
        // 兼容旧版接口
        onUpdateElementContent(selectedElementId, property, value);
      }
    };

    const handleUpdateStyle = (property, value) => {
      if (actionExecutorInstance) {
        actionExecutorInstance.executeAction(
          "propertyActions",
          "updateElementStyle",
          {
            elementId: selectedElementId,
            property,
            value,
          },
        );
      } else {
        // 兼容旧版接口
        onUpdateElementStyle(selectedElementId, property, value);
      }
    };

    switch (type) {
      case "text":
        // 文本元素的核心属性是文本内容
        return (
          <div className="space-y-3">
            <div className="flex items-center">
              <label className="w-1/3 text-sm">文本内容:</label>
              <textarea
                className="flex-1 px-3 py-2 border rounded text-sm"
                rows="3"
                value={
                  typeof content === "string" ? content : content?.value || ""
                }
                onChange={(e) => {
                  if (typeof content === "string") {
                    handleUpdateContent("content", e.target.value);
                  } else {
                    handleUpdateContent("value", e.target.value);
                  }
                }}
                placeholder="输入文本内容"
              />
            </div>
          </div>
        );

      case "button":
        // 按钮元素的核心属性包括文本、图标和图标位置
        return (
          <div className="space-y-3">
            <div className="flex items-center">
              <label className="w-1/3 text-sm">按钮文本:</label>
              <input
                type="text"
                className="flex-1 px-3 py-2 border rounded text-sm"
                value={content?.text || ""}
                onChange={(e) => handleUpdateContent("text", e.target.value)}
                placeholder="输入按钮文本"
              />
            </div>
            <div className="flex items-center">
              <label className="w-1/3 text-sm">图标:</label>
              <input
                type="text"
                className="flex-1 px-3 py-2 border rounded text-sm"
                value={content?.icon || ""}
                onChange={(e) => handleUpdateContent("icon", e.target.value)}
                placeholder="选择图标"
              />
            </div>
            {content?.icon && (
              <div className="flex items-center">
                <label className="w-1/3 text-sm">图标位置:</label>
                <select
                  className="flex-1 px-3 py-2 border rounded text-sm"
                  value={content?.iconPosition || "left"}
                  onChange={(e) =>
                    handleUpdateContent("iconPosition", e.target.value)
                  }
                >
                  <option value="left">左侧</option>
                  <option value="right">右侧</option>
                </select>
              </div>
            )}
          </div>
        );

      case "image":
        // 图片元素的核心属性包括图片源和替代文本
        return (
          <div className="space-y-3">
            <div className="flex items-center">
              <label className="w-1/3 text-sm">图片链接:</label>
              <input
                type="text"
                className="flex-1 px-3 py-2 border rounded text-sm"
                value={content?.src || ""}
                onChange={(e) => handleUpdateContent("src", e.target.value)}
                placeholder="输入图片URL"
              />
            </div>
            <div className="flex items-center">
              <label className="w-1/3 text-sm">替代文本:</label>
              <input
                type="text"
                className="flex-1 px-3 py-2 border rounded text-sm"
                value={content?.alt || ""}
                onChange={(e) => handleUpdateContent("alt", e.target.value)}
                placeholder="输入替代文本"
              />
            </div>
          </div>
        );

      case "icon":
        // 图标元素的核心属性是图标名称和大小
        return (
          <div className="space-y-3">
            <div className="flex items-center">
              <label className="w-1/3 text-sm">图标:</label>
              <input
                type="text"
                className="flex-1 px-3 py-2 border rounded text-sm"
                value={content?.icon || ""}
                onChange={(e) => handleUpdateContent("icon", e.target.value)}
                placeholder="选择图标"
              />
            </div>
            {content?.icon && (
              <div className="flex items-center">
                <label className="w-1/3 text-sm">图标大小:</label>
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border rounded text-sm"
                  value={selectedElement.style?.fontSize || "24px"}
                  onChange={(e) =>
                    handleUpdateStyle("fontSize", e.target.value)
                  }
                  placeholder="输入图标大小"
                />
              </div>
            )}
          </div>
        );

      case "input":
        // 输入框元素的核心属性包括占位符、字段名和类型
        return (
          <div className="space-y-3">
            <div className="flex items-center">
              <label className="w-1/3 text-sm">占位符:</label>
              <input
                type="text"
                className="flex-1 px-3 py-2 border rounded text-sm"
                value={content?.placeholder || ""}
                onChange={(e) =>
                  handleUpdateContent("placeholder", e.target.value)
                }
                placeholder="输入占位符文本"
              />
            </div>
            <div className="flex items-center">
              <label className="w-1/3 text-sm">字段名:</label>
              <input
                type="text"
                className="flex-1 px-3 py-2 border rounded text-sm"
                value={content?.field || ""}
                onChange={(e) => handleUpdateContent("field", e.target.value)}
                placeholder="输入字段名"
              />
            </div>
            <div className="flex items-center">
              <label className="w-1/3 text-sm">输入类型:</label>
              <select
                className="flex-1 px-3 py-2 border rounded text-sm"
                value={content?.type || "text"}
                onChange={(e) => handleUpdateContent("type", e.target.value)}
              >
                <option value="text">文本</option>
                <option value="password">密码</option>
                <option value="number">数字</option>
                <option value="email">邮箱</option>
                <option value="tel">电话</option>
                <option value="url">网址</option>
              </select>
            </div>
          </div>
        );

      case "container":
      case "divider":
      default:
        return (
          <p className="text-sm text-gray-500 py-2">
            {type === "container" || type === "divider"
              ? `${type === "container" ? "容器" : "分割线"}元素没有核心内容属性，请使用布局和样式配置。`
              : "该元素类型没有可配置的核心属性。"}
          </p>
        );
    }
  };

  // 渲染属性标签页内容
  const renderPropertiesTab = () => {
    const isActionDisabled = !layout || !selectedElementId;

    return (
      <div>
        <h4 className="font-medium mb-3">核心属性</h4>
        {!isActionDisabled ? (
          renderCoreProperties()
        ) : (
          <div className="text-gray-500 text-center py-4">
            <p>请先选择一个元素</p>
          </div>
        )}
      </div>
    );
  };

  // 渲染移动标签页内容
  const renderMovementTab = () => {
    const isActionDisabled = !layout || !selectedElementId;
    const selectedElement = selectedElementId
      ? findElement(layout, selectedElementId)
      : null;
    const containers = findAllContainers(layout);
    const siblings = selectedElementId
      ? findSiblings(layout, selectedElementId)
      : [];

    const handleMoveElement = (targetContainerId) => {
      if (actionExecutorInstance) {
        actionExecutorInstance.executeAction("movementActions", "moveElement", {
          elementId: selectedElementId,
          targetContainerId,
        });
      } else {
        // 兼容旧版接口
        onMoveElement(selectedElementId, targetContainerId);
      }
    };

    const handleMoveElementToSibling = (siblingId, position) => {
      if (actionExecutorInstance) {
        actionExecutorInstance.executeAction(
          "movementActions",
          "moveElementToSibling",
          {
            elementId: selectedElementId,
            siblingId,
            position,
          },
        );
      } else {
        // 兼容旧版接口
        onMoveElementToSibling(selectedElementId, siblingId, position);
      }
    };

    return (
      <div>
        <h4 className="font-medium mb-3">移动元素</h4>
        {!isActionDisabled ? (
          <div className="space-y-4">
            <div>
              <h5 className="font-medium mb-2">移动到容器</h5>
              {containers.length > 0 ? (
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {containers
                    .filter((container) => container.id !== selectedElementId)
                    .map((container) => (
                      <button
                        key={container.id}
                        className="w-full p-2 border rounded flex items-center hover:bg-blue-50 hover:border-blue-300"
                        onClick={() => handleMoveElement(container.id)}
                      >
                        <span className="mr-2">🔲</span>
                        <span>
                          {container.name || `容器 - ${container.id}`}
                        </span>
                      </button>
                    ))}
                </div>
              ) : (
                <div className="text-gray-500 text-center py-2">
                  <p>没有可用的容器</p>
                </div>
              )}
            </div>

            <div>
              <h5 className="font-medium mb-2">同级移动</h5>
              {siblings.length > 0 ? (
                <div className="space-y-3 max-h-32 overflow-y-auto">
                  {siblings.map((sibling) => (
                    <div key={sibling.id} className="border rounded p-2">
                      <div className="flex items-center mb-2">
                        <span className="mr-2">
                          {getElementIcon(sibling.type)}
                        </span>
                        <span>
                          {sibling.name || `${sibling.type} - ${sibling.id}`}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          className="flex-1 px-2 py-1 bg-green-50 text-green-700 rounded text-sm hover:bg-green-100"
                          onClick={() =>
                            handleMoveElementToSibling(sibling.id, "before")
                          }
                        >
                          移到前面
                        </button>
                        <button
                          className="flex-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm hover:bg-blue-100"
                          onClick={() =>
                            handleMoveElementToSibling(sibling.id, "after")
                          }
                        >
                          移到后面
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-center py-2">
                  <p>没有可用的同级元素</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-gray-500 text-center py-4">
            <p>请先选择一个元素</p>
          </div>
        )}
      </div>
    );
  };

  // 渲染录制标签页内容
  const renderRecordingTab = () => {
    const handleStartRecording = () => {
      if (!recordingName) {
        alert("请输入录制名称");
        return;
      }

      if (actionExecutorInstance) {
        const success = actionExecutorInstance.startRecording(recordingName);
        if (success) {
          setIsRecording(true);
        }
      }
    };

    const handleStopRecording = () => {
      if (actionExecutorInstance && isRecording) {
        const recording = actionExecutorInstance.stopRecording();
        if (recording) {
          setCurrentRecording(recording);
          setIsRecording(false);
        }
      }
    };

    const handleSaveRecording = () => {
      if (!currentRecording || !sequenceName) {
        alert("没有可保存的录制或未输入序列名称");
        return;
      }

      if (actionExecutorInstance) {
        const success = actionExecutorInstance.saveRecordedSequence(
          sequenceName,
          currentRecording.actions,
        );
        if (success) {
          setRecordedSequences((prev) => ({
            ...prev,
            [sequenceName]: currentRecording,
          }));
          setSequenceName("");
          alert("录制已保存");
        }
      }
    };

    const handlePlayRecording = (actions) => {
      if (!actions || !actionExecutorInstance) return;

      actionExecutorInstance
        .playRecordedSequence(actions, playbackSpeed)
        .then((success) => {
          if (success) {
            console.log("回放完成");
          }
        });
    };

    // 添加导出序列功能
    const handleExportSequence = (sequenceName) => {
      if (!actionExecutorInstance) return;

      // 准备 Markdown 数据
      const markdownData = {
        markdownText,
        markdownElements,
      };

      const exportResult = actionExecutorInstance.exportSequenceToFile(
        sequenceName,
        markdownData,
      );
      if (exportResult) {
        // 创建下载链接
        const { fileName, blob } = exportResult;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    };

    // 添加导入序列功能
    const handleImportSequence = () => {
      if (!actionExecutorInstance || !fileInputRef.current) return;
      fileInputRef.current.click();
    };

    // 处理文件选择
    const handleFileSelected = async (event) => {
      const file = event.target.files?.[0];
      if (!file) {
        console.log("未选择文件");
        return;
      }

      // 如果传入了自定义的导入函数，优先使用它
      if (onImportSequence && typeof onImportSequence === "function") {
        onImportSequence(event);
        return;
      }

      if (!actionExecutorInstance) {
        console.error("Action执行器不可用");
        return;
      }

      try {
        const result =
          await actionExecutorInstance.importSequenceFromFile(file);
        if (result.success) {
          setRecordedSequences((prev) => ({
            ...prev,
            [result.sequenceName]: {
              name: result.sequenceName,
              actions: result.actions,
              duration: 0, // 导入的序列没有实际持续时间信息
            },
          }));
          alert(`成功导入序列: ${result.sequenceName}`);
        }
      } catch (error) {
        alert(`导入序列失败: ${error.message}`);
      }

      // 清除文件输入，以便可以再次选择同一文件
      event.target.value = "";
    };

    // 导入并执行序列
    const handleImportAndExecute = () => {
      // 如果传入了自定义的导入函数，优先使用它
      if (onImportSequence && typeof onImportSequence === "function") {
        if (fileInputRef.current) {
          fileInputRef.current.click();
          return;
        }
      }

      if (!actionExecutorInstance || !fileInputRef.current) {
        console.log("Action执行器或文件输入引用不可用");
        return;
      }

      console.log("启动导入并执行序列流程");

      // 创建一个新的文件输入元素用于导入并执行
      const importExecuteInput = document.createElement("input");
      importExecuteInput.type = "file";
      importExecuteInput.accept = ".json";
      importExecuteInput.style.display = "none";

      importExecuteInput.onchange = async (event) => {
        const file = event.target.files?.[0];
        if (!file || !actionExecutorInstance) {
          console.log("未选择文件或Action执行器已失效");
          return;
        }

        try {
          // 显示导入进行中的提示
          console.log("开始导入文件:", file.name);
          actualSetLoading(true);

          // 确保布局清空
          if (onClearLayout) {
            console.log("调用清空布局...");
            await onClearLayout();
          }

          // 确保已使用元素状态重置
          if (onResetUsedElements) {
            console.log("重置已使用元素状态...");
            await onResetUsedElements();
          }

          console.log("执行导入和序列回放，速度:", playbackSpeed);
          const result = await actionExecutorInstance.importAndExecuteSequence(
            file,
            playbackSpeed,
          );
          console.log("导入执行结果:", result);

          if (result.success) {
            console.log("导入执行成功，更新UI...");

            // 等待一段时间确保布局完全更新
            setTimeout(() => {
              console.log("布局应该已更新完成");
              actualSetLoading(false);

              // 提供更详细的成功消息
              alert(`成功导入并执行序列: ${result.sequenceName}
• 执行了 ${result.actionsCount} 个动作
• ${result.hasMarkdownData ? "包含了Markdown数据" : "不包含Markdown数据"}
• 元素ID已更新为标准格式，确保了导入数据的一致性
• 根容器ID: ${result.rootContainerId || "未知"}`);
            }, 500);
          } else {
            console.error("导入执行失败:", result.error);
            actualSetLoading(false);
            alert(`执行序列失败: ${result.error || "未知错误"}`);
          }
        } catch (error) {
          console.error("导入执行过程发生异常:", error);
          actualSetLoading(false);
          alert(`导入并执行序列失败: ${error.message}`);
        } finally {
          document.body.removeChild(importExecuteInput);
        }
      };

      document.body.appendChild(importExecuteInput);
      importExecuteInput.click();
    };

    return (
      <div>
        <h4 className="font-medium mb-3">动作录制</h4>

        {/* 录制控制 */}
        <div className="border rounded-lg p-4 mb-4">
          <h5 className="text-sm font-medium mb-3">录制控制</h5>

          <div className="space-y-3">
            <div className="flex items-center">
              <label className="w-1/3 text-sm">录制名称:</label>
              <input
                type="text"
                className="flex-1 px-3 py-2 border rounded text-sm"
                value={recordingName}
                onChange={(e) => setRecordingName(e.target.value)}
                disabled={isRecording}
                placeholder="输入录制名称"
              />
            </div>

            <div className="flex space-x-2">
              {!isRecording ? (
                <button
                  className="flex-1 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  onClick={handleStartRecording}
                  disabled={!recordingName}
                >
                  开始录制
                </button>
              ) : (
                <button
                  className="flex-1 py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  onClick={handleStopRecording}
                >
                  停止录制
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 当前录制 */}
        {currentRecording && (
          <div className="border rounded-lg p-4 mb-4">
            <h5 className="text-sm font-medium mb-3">
              当前录制: {currentRecording.name}
            </h5>
            <div className="text-sm text-gray-600 mb-3">
              <p>动作数量: {currentRecording.actions.length}</p>
              <p>录制时长: {Math.round(currentRecording.duration / 1000)}秒</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center">
                <label className="w-1/3 text-sm">保存名称:</label>
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border rounded text-sm"
                  value={sequenceName}
                  onChange={(e) => setSequenceName(e.target.value)}
                  placeholder="输入保存名称"
                />
              </div>

              <div className="flex space-x-2">
                <button
                  className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  onClick={handleSaveRecording}
                  disabled={!sequenceName}
                >
                  保存录制
                </button>
                <button
                  className="flex-1 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  onClick={() => handlePlayRecording(currentRecording.actions)}
                >
                  回放录制
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 导入导出控制 */}
        <div className="border rounded-lg p-4 mb-4">
          <h5 className="text-sm font-medium mb-3">导入/导出</h5>

          <div className="space-y-3">
            <div className="flex items-center">
              <label className="w-1/3 text-sm">回放速度:</label>
              <select
                className="flex-1 px-3 py-2 border rounded text-sm"
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
              >
                <option value="0.5">0.5x (慢速)</option>
                <option value="1">1x (正常)</option>
                <option value="2">2x (快速)</option>
                <option value="5">5x (极速)</option>
              </select>
            </div>

            <div className="flex space-x-2">
              <button
                className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                onClick={handleImportSequence}
              >
                导入序列
              </button>
              <button
                className="flex-1 py-2 px-4 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                onClick={handleImportAndExecute}
              >
                导入并执行
              </button>
            </div>

            {/* 隐藏的文件输入 */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              style={{ display: "none" }}
              onChange={handleFileSelected}
            />
          </div>
        </div>

        {/* 已保存的录制 */}
        <div className="border rounded-lg p-4">
          <h5 className="text-sm font-medium mb-3">已保存的录制</h5>

          {Object.keys(recordedSequences).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(recordedSequences).map(([name, recording]) => (
                <div key={name} className="border rounded p-3">
                  <div className="flex justify-between items-center mb-2">
                    <h6 className="font-medium">{name}</h6>
                    <span className="text-xs text-gray-500">
                      {recording.actions.length}个动作 /{" "}
                      {Math.round(recording.duration / 1000)}秒
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="flex-1 py-1 px-3 bg-green-50 text-green-700 rounded text-sm hover:bg-green-100"
                      onClick={() => handlePlayRecording(recording.actions)}
                    >
                      回放
                    </button>
                    <button
                      className="flex-1 py-1 px-3 bg-blue-50 text-blue-700 rounded text-sm hover:bg-blue-100"
                      onClick={() => handleExportSequence(name)}
                    >
                      导出
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-center py-4">
              <p>没有已保存的录制</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 基础UI渲染
  return (
    <div className="w-full bg-white border rounded-lg shadow-sm">
      {/* 标题 */}
      <div className="border-b p-3">
        <h3 className="text-lg font-medium">动作面板</h3>
        <p className="text-sm text-gray-500">用于强化学习环境的动作选择</p>
      </div>

      {/* 标签栏 */}
      <div className="flex border-b">
        {[
          { id: "container", label: "容器" },
          { id: "components", label: "组件" },
          { id: "presets", label: "预设" },
          { id: "properties", label: "属性" },
          { id: "movement", label: "移动" },
          { id: "recording", label: "录制" },
        ].map((tab) => (
          <button
            key={tab.id}
            className={`flex-1 py-2 px-4 font-medium ${activeTab === tab.id ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      <div className="p-4 max-h-96 overflow-y-auto">
        {activeTab === "container" && renderContainerTab()}
        {activeTab === "components" && renderComponentsTab()}
        {activeTab === "presets" && renderPresetsTab()}
        {activeTab === "properties" && renderPropertiesTab()}
        {activeTab === "movement" && renderMovementTab()}
        {activeTab === "recording" && renderRecordingTab()}
        {/* 其他标签页内容将在后续步骤中实现 */}
        {activeTab !== "container" &&
          activeTab !== "components" &&
          activeTab !== "presets" &&
          activeTab !== "properties" &&
          activeTab !== "movement" &&
          activeTab !== "recording" && (
            <div className="text-center text-gray-500 py-4">
              正在加载动作面板...
            </div>
          )}
      </div>

      {/* 底部状态栏 */}
      <div className="border-t p-3 bg-gray-50 text-sm">
        {selectedElementId ? (
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">当前选中: </span>
              <span>
                {layout && selectedElementId
                  ? findElement(layout, selectedElementId)?.type || "unknown"
                  : "unknown"}{" "}
                - {selectedElementId}
              </span>
            </div>
            <div className="text-blue-600">
              {activeTab === "components"
                ? "添加组件"
                : activeTab === "presets"
                  ? "应用预设"
                  : activeTab === "properties"
                    ? "修改属性"
                    : activeTab === "movement"
                      ? "移动元素"
                      : activeTab === "recording"
                        ? "录制动作"
                        : "录制动作"}
            </div>
          </div>
        ) : (
          <div className="text-gray-500 text-center">
            请先选择一个元素以启用动作
          </div>
        )}
      </div>

      {/* 加载状态和消息显示 */}
      {actualLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p>正在处理操作，请稍候...</p>
          </div>
        </div>
      )}

      {actualMessage && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {actualMessage}
        </div>
      )}

      {actualError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {actualError}
        </div>
      )}
    </div>
  );

  // 查找元素辅助函数
  function findElement(layout, id) {
    if (!layout || !id) return null;
    if (layout.id === id) return layout;
    if (layout.children) {
      for (const child of layout.children) {
        const found = findElement(child, id);
        if (found) return found;
      }
    }
    return null;
  }
};

export default NewActionPanel;
