# AIGUI 动作系统

## 概述

AIGUI 动作系统是一个用于强化学习环境的抽象化动作配置和执行系统。它将 UI 交互抽象为结构化的动作，便于强化学习算法理解和学习。

## 主要组件

系统由以下主要组件组成：

1. **动作配置 (actionConfig.js)**：定义所有可用的动作类型、参数和强化学习属性。
2. **动作执行器 (actionExecutor.js)**：负责执行动作并提供录制和回放功能。
3. **动作面板 (newActionPanel.js)**：用户界面组件，展示所有可用的动作选项。

## 动作类别

系统支持以下动作类别：

- **组件操作动作**：添加组件、添加容器、移除组件等。
- **预设操作动作**：应用预设样式到元素。
- **属性操作动作**：更新元素的样式和内容属性。
- **移动操作动作**：移动元素到容器或调整同级元素位置。
- **组合动作**：序列动作和条件动作，用于执行复杂的操作序列。

## 强化学习支持

系统为强化学习算法提供了以下支持：

- **向量编码**：每个动作都有一个向量编码，用于表示动作在动作空间中的位置。
- **离散参数**：定义了动作的离散参数，如组件类型、预设类别等。
- **连续参数**：定义了动作的连续参数，如位置、值等。
- **状态变化**：定义了动作对环境状态的影响。

## 录制和回放

系统支持录制和回放用户动作，便于：

1. **示范学习**：设计师可以录制操作序列，用于训练强化学习算法。
2. **自动化测试**：可以回放录制的操作序列，用于测试系统功能。
3. **用户体验研究**：分析用户操作序列，了解用户行为模式。

## 使用示例

```javascript
// 创建动作执行器
const actionExecutor = new ActionExecutor({
  onAddComponent: (parentId, componentType, elementData) => {
    // 处理添加组件
  },
  onApplyPreset: (elementId, presetCategory, presetKey) => {
    // 处理应用预设
  },
  // 其他回调...
});

// 执行动作
actionExecutor.executeAction('componentActions', 'addComponent', {
  parentId: 'container-1',
  componentType: 'button',
  elementData: { content: { text: '点击我' } }
});

// 开始录制
actionExecutor.startRecording('我的录制');

// 停止录制
const recording = actionExecutor.stopRecording();

// 回放录制
actionExecutor.playRecordedSequence(recording.actions);
```

## 扩展

系统设计为可扩展的，可以通过以下方式扩展：

1. 在 `actionConfig.js` 中添加新的动作类型和参数。
2. 在 `actionExecutor.js` 中实现新动作的执行逻辑。
3. 在 `newActionPanel.js` 中添加新动作的用户界面。

## 与原始 ActionPanel 的兼容性

为了保持向后兼容性，我们保留了原始 `ActionPanel.js` 的接口，但内部实现使用了新的动作系统。这样可以确保现有代码不需要修改即可使用新系统。 