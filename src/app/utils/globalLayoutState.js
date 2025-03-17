/**
 * 全局布局状态管理
 * 
 * 这个模块提供了一个全局的布局状态存储，
 * 解决不同组件之间布局状态同步的问题
 */

// 全局布局状态
let globalLayoutState = {
  layout: null,
  selectedElementId: null,
  listeners: [],
};

// 注册监听器
const registerListener = (listener) => {
  globalLayoutState.listeners.push(listener);
  return () => {
    globalLayoutState.listeners = globalLayoutState.listeners.filter(l => l !== listener);
  };
};

// 更新布局
const updateLayout = (newLayout) => {
  globalLayoutState.layout = newLayout;
  notifyListeners();
};

// 更新选中元素
const updateSelectedElementId = (elementId) => {
  globalLayoutState.selectedElementId = elementId;
  notifyListeners();
};

// 获取当前布局
const getLayout = () => globalLayoutState.layout;

// 获取当前选中元素ID
const getSelectedElementId = () => globalLayoutState.selectedElementId;

// 通知所有监听器
const notifyListeners = () => {
  globalLayoutState.listeners.forEach(listener => listener(globalLayoutState));
};

// 导出API
export default {
  updateLayout,
  updateSelectedElementId,
  getLayout,
  getSelectedElementId,
  registerListener,
}; 