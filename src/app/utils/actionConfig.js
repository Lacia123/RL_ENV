/**
 * AIGUI 动作配置系统
 * 
 * 该文件定义了所有可用的动作类型和参数，用于UI交互和强化学习。
 * 动作分为以下几个类别:
 * - componentActions: 组件操作动作
 * - presetActions: 预设操作动作
 * - propertyActions: 属性操作动作
 * - movementActions: 移动操作动作
 * - compositeActions: 组合动作
 */

const actionConfig = {
  version: "1.0.0",
  categories: {
    componentActions: {
      description: "组件操作动作",
      actions: {
        addComponent: {
          id: "addComponent",
          name: "添加组件",
          description: "添加组件到容器",
          parameters: [
            {
              name: "parentId",
              type: "string",
              description: "父容器ID",
              required: true
            },
            {
              name: "componentType",
              type: "string",
              description: "组件类型",
              required: true,
              options: ["text", "button", "image", "container", "input", "icon", "divider"]
            },
            {
              name: "elementData",
              type: "object",
              description: "元素数据",
              required: false
            }
          ],
          returns: {
            type: "string",
            description: "新创建元素的ID"
          },
          rlProperties: {
            discreteParameters: ["componentType"],
            continuousParameters: [],
            stateChanges: ["addElement"],
            vectorEncoding: [1, 0, 0, 0, 0]
          }
        },
        addContainer: {
          id: "addContainer",
          name: "添加容器",
          description: "添加一个新容器，可包含选中的元素",
          parameters: [
            {
              name: "elements",
              type: "array",
              description: "要包含在容器中的元素",
              required: false,
              default: []
            },
            {
              name: "parentId",
              type: "string",
              description: "父容器ID",
              required: false
            }
          ],
          returns: {
            type: "string",
            description: "新创建容器的ID"
          },
          rlProperties: {
            discreteParameters: [],
            continuousParameters: [],
            stateChanges: ["addElement"],
            vectorEncoding: [1, 0, 0, 0, 0]
          }
        },
        removeComponent: {
          id: "removeComponent",
          name: "移除组件",
          description: "从布局中移除组件",
          parameters: [
            {
              name: "elementId",
              type: "string",
              description: "要移除的元素ID",
              required: true
            }
          ],
          returns: {
            type: "boolean",
            description: "是否移除成功"
          },
          rlProperties: {
            discreteParameters: [],
            continuousParameters: [],
            stateChanges: ["removeElement"],
            vectorEncoding: [1, 0, 0, 0, 0]
          }
        }
      }
    },
    presetActions: {
      description: "预设操作动作",
      actions: {
        applyPreset: {
          id: "applyPreset",
          name: "应用预设",
          description: "应用预设到元素",
          parameters: [
            {
              name: "elementId",
              type: "string",
              description: "元素ID",
              required: true
            },
            {
              name: "presetCategory",
              type: "string",
              description: "预设类别",
              required: true,
              options: ["layoutPreset", "spacingPreset", "appearancePreset", "typographyPreset", "sizePreset"]
            },
            {
              name: "presetKey",
              type: "string",
              description: "预设键名",
              required: true,
              dynamicOptions: {
                source: "getAvailablePresets",
                parameters: ["elementType", "presetCategory"]
              }
            }
          ],
          returns: {
            type: "boolean",
            description: "是否应用成功"
          },
          rlProperties: {
            discreteParameters: ["presetCategory", "presetKey"],
            continuousParameters: [],
            stateChanges: ["updateElement"],
            vectorEncoding: [0, 1, 0, 0, 0]
          }
        }
      }
    },
    propertyActions: {
      description: "属性操作动作",
      actions: {
        updateElementStyle: {
          id: "updateElementStyle",
          name: "更新元素样式",
          description: "更新元素的样式属性",
          parameters: [
            {
              name: "elementId",
              type: "string",
              description: "元素ID",
              required: true
            },
            {
              name: "property",
              type: "string",
              description: "样式属性名",
              required: true,
              dynamicOptions: {
                source: "getElementStyleProperties",
                parameters: ["elementType"]
              }
            },
            {
              name: "value",
              type: "any",
              description: "样式属性值",
              required: true,
              dynamicConstraints: {
                source: "getPropertyConstraints",
                parameters: ["property"]
              }
            }
          ],
          returns: {
            type: "boolean",
            description: "是否更新成功"
          },
          rlProperties: {
            discreteParameters: ["property"],
            continuousParameters: ["value"],
            stateChanges: ["updateElement"],
            vectorEncoding: [0, 0, 1, 0, 0]
          }
        },
        updateElementContent: {
          id: "updateElementContent",
          name: "更新元素内容",
          description: "更新元素的内容属性",
          parameters: [
            {
              name: "elementId",
              type: "string",
              description: "元素ID",
              required: true
            },
            {
              name: "contentProperty",
              type: "string",
              description: "内容属性名",
              required: true,
              dynamicOptions: {
                source: "getElementContentProperties",
                parameters: ["elementType"]
              }
            },
            {
              name: "value",
              type: "any",
              description: "内容属性值",
              required: true
            }
          ],
          returns: {
            type: "boolean",
            description: "是否更新成功"
          },
          rlProperties: {
            discreteParameters: ["contentProperty"],
            continuousParameters: ["value"],
            stateChanges: ["updateElement"],
            vectorEncoding: [0, 0, 1, 0, 0]
          }
        }
      }
    },
    movementActions: {
      description: "移动操作动作",
      actions: {
        moveElement: {
          id: "moveElement",
          name: "移动元素",
          description: "移动元素到另一个容器",
          parameters: [
            {
              name: "elementId",
              type: "string",
              description: "要移动的元素ID",
              required: true
            },
            {
              name: "targetContainerId",
              type: "string",
              description: "目标容器ID",
              required: true,
              dynamicOptions: {
                source: "getAvailableContainers",
                parameters: []
              }
            },
            {
              name: "position",
              type: "integer",
              description: "目标位置索引（-1表示添加到末尾）",
              required: false,
              default: -1
            }
          ],
          returns: {
            type: "boolean",
            description: "是否移动成功"
          },
          rlProperties: {
            discreteParameters: ["targetContainerId"],
            continuousParameters: ["position"],
            stateChanges: ["moveElement"],
            vectorEncoding: [0, 0, 0, 1, 0]
          }
        },
        moveElementToSibling: {
          id: "moveElementToSibling",
          name: "移动元素到同级位置",
          description: "将元素移动到相对于同级元素的位置",
          parameters: [
            {
              name: "elementId",
              type: "string",
              description: "要移动的元素ID",
              required: true
            },
            {
              name: "siblingId",
              type: "string",
              description: "参考同级元素ID",
              required: true,
              dynamicOptions: {
                source: "getSiblingElements",
                parameters: ["elementId"]
              }
            },
            {
              name: "position",
              type: "string",
              description: "相对位置",
              required: true,
              options: ["before", "after"]
            }
          ],
          returns: {
            type: "boolean",
            description: "是否移动成功"
          },
          rlProperties: {
            discreteParameters: ["siblingId", "position"],
            continuousParameters: [],
            stateChanges: ["reorderElements"],
            vectorEncoding: [0, 0, 0, 1, 0]
          }
        }
      }
    },
    compositeActions: {
      description: "组合动作",
      actions: {
        sequence: {
          id: "sequence",
          name: "动作序列",
          description: "按顺序执行多个动作",
          parameters: [
            {
              name: "actions",
              type: "array",
              description: "动作数组",
              required: true,
              items: {
                type: "object",
                properties: {
                  actionType: {type: "string"},
                  actionParams: {type: "object"}
                }
              }
            }
          ],
          returns: {
            type: "array",
            description: "各个动作的执行结果"
          },
          rlProperties: {
            isComposite: true,
            vectorEncoding: [0, 0, 0, 0, 1]
          }
        },
        conditional: {
          id: "conditional",
          name: "条件动作",
          description: "根据条件执行不同的动作",
          parameters: [
            {
              name: "condition",
              type: "object",
              description: "条件表达式",
              required: true,
              properties: {
                type: {type: "string", options: ["propertyEquals", "elementExists", "hasChildren"]},
                params: {type: "object"}
              }
            },
            {
              name: "thenAction",
              type: "object",
              description: "条件成立时执行的动作",
              required: true
            },
            {
              name: "elseAction",
              type: "object",
              description: "条件不成立时执行的动作",
              required: false
            }
          ],
          returns: {
            type: "any",
            description: "执行的动作的返回值"
          },
          rlProperties: {
            isComposite: true,
            vectorEncoding: [0, 0, 0, 0, 1]
          }
        }
      }
    }
  },
  recordingFunctions: {
    startRecording: {
      description: "开始录制用户动作",
      parameters: [
        {
          name: "recordingName",
          type: "string",
          description: "录制会话名称",
          required: true
        }
      ]
    },
    stopRecording: {
      description: "停止录制用户动作",
      parameters: [],
      returns: {
        type: "object",
        description: "录制的动作序列"
      }
    },
    saveRecordedSequence: {
      description: "保存录制的动作序列",
      parameters: [
        {
          name: "sequenceName",
          type: "string",
          description: "序列名称",
          required: true
        },
        {
          name: "actionSequence",
          type: "array",
          description: "动作序列",
          required: true
        }
      ],
      returns: {
        type: "boolean",
        description: "是否保存成功"
      }
    },
    loadRecordedSequence: {
      description: "加载已保存的动作序列",
      parameters: [
        {
          name: "sequenceName",
          type: "string",
          description: "序列名称",
          required: true
        }
      ],
      returns: {
        type: "array",
        description: "动作序列"
      }
    },
    playRecordedSequence: {
      description: "回放动作序列",
      parameters: [
        {
          name: "actionSequence",
          type: "array",
          description: "动作序列",
          required: true
        },
        {
          name: "speed",
          type: "number",
          description: "回放速度倍率",
          required: false,
          default: 1.0
        }
      ],
      returns: {
        type: "boolean",
        description: "回放是否成功"
      }
    }
  },
  rlMetadata: {
    actionSpaceDimension: 5,
    maxDiscreteValues: {
      componentType: 7,
      presetCategory: 5,
      presetKey: 20,
      property: 50,
      targetContainerId: 10,
      position: 2
    },
    continuousRanges: {
      position: [-1, 100],
      value: [-1000, 1000]
    }
  }
};

export default actionConfig;

/**
 * 获取特定类别的所有动作
 * @param {string} category - 动作类别
 * @returns {Object} - 该类别的所有动作
 */
export function getCategoryActions(category) {
  if (!actionConfig.categories[category]) {
    console.warn(`动作类别 ${category} 不存在`);
    return {};
  }
  return actionConfig.categories[category].actions;
}

/**
 * 获取特定动作的定义
 * @param {string} category - 动作类别
 * @param {string} actionId - 动作ID
 * @returns {Object|null} - 动作定义或null（如果不存在）
 */
export function getActionDefinition(category, actionId) {
  const categoryActions = getCategoryActions(category);
  if (!categoryActions[actionId]) {
    console.warn(`动作 ${category}.${actionId} 不存在`);
    return null;
  }
  return categoryActions[actionId];
}

/**
 * 获取所有动作的扁平列表
 * @returns {Array} - 所有动作定义的数组
 */
export function getAllActions() {
  const allActions = [];
  
  Object.entries(actionConfig.categories).forEach(([category, categoryData]) => {
    Object.entries(categoryData.actions).forEach(([actionId, actionDefinition]) => {
      allActions.push({
        category,
        id: actionId,
        ...actionDefinition
      });
    });
  });
  
  return allActions;
}

/**
 * 将动作配置转换为强化学习友好的格式
 * @returns {Object} - 强化学习友好的动作配置
 */
export function getRLActionSpace() {
  const rlActionSpace = {
    discrete: {},
    continuous: {},
    actionMapping: []
  };
  
  getAllActions().forEach(action => {
    if (!action.rlProperties) return;
    
    // 添加到动作映射
    rlActionSpace.actionMapping.push({
      actionId: action.id,
      category: action.category,
      vectorEncoding: action.rlProperties.vectorEncoding
    });
    
    // 处理离散参数
    (action.rlProperties.discreteParameters || []).forEach(param => {
      const paramDef = action.parameters.find(p => p.name === param);
      if (paramDef && paramDef.options) {
        rlActionSpace.discrete[`${action.id}_${param}`] = paramDef.options.length;
      } else if (actionConfig.rlMetadata.maxDiscreteValues[param]) {
        rlActionSpace.discrete[`${action.id}_${param}`] = actionConfig.rlMetadata.maxDiscreteValues[param];
      }
    });
    
    // 处理连续参数
    (action.rlProperties.continuousParameters || []).forEach(param => {
      const range = actionConfig.rlMetadata.continuousRanges[param];
      if (range) {
        rlActionSpace.continuous[`${action.id}_${param}`] = {
          low: range[0],
          high: range[1]
        };
      }
    });
  });
  
  return rlActionSpace;
} 