/**
 * Redux 状态管理
 * 
 * 这个模块提供了一个基于 Redux 的全局状态管理解决方案，
 * 解决不同组件之间布局状态同步的问题
 */
import { createStore } from 'redux';

// 定义 Action 类型
export const actionTypes = {
  UPDATE_LAYOUT: 'UPDATE_LAYOUT',
  UPDATE_SELECTED_ELEMENT_ID: 'UPDATE_SELECTED_ELEMENT_ID',
  UPDATE_CANVAS_SIZE: 'UPDATE_CANVAS_SIZE',
  CLEAR_LAYOUT: 'CLEAR_LAYOUT',
  UPDATE_USED_ELEMENT_IDS: 'UPDATE_USED_ELEMENT_IDS',
  // 新增UI状态相关Action类型
  UPDATE_JSON_INPUT: 'UPDATE_JSON_INPUT',
  UPDATE_MARKDOWN_TEXT: 'UPDATE_MARKDOWN_TEXT',
  UPDATE_MARKDOWN_ELEMENTS: 'UPDATE_MARKDOWN_ELEMENTS',
  UPDATE_MARKDOWN_DATA: 'UPDATE_MARKDOWN_DATA',
  TOGGLE_PANEL: 'TOGGLE_PANEL',
  SET_UI_STATE: 'SET_UI_STATE',
  RESET_USED_ELEMENT_IDS: 'RESET_USED_ELEMENT_IDS'
};

// 初始状态
const initialState = {
  // 布局相关状态
  layout: null,
  selectedElementId: null,
  canvasWidth: 1024, // 默认画布宽度
  canvasHeight: 768, // 默认画布高度
  usedElementIds: new Set(), // 已使用的元素ID集合
  
  // UI相关状态
  ui: {
    jsonInput: '',
    jsonError: '',
    showPanel: false,
    showMarkdownPanel: false,
    showActionPanel: false,
    showJsonPanel: false,
    showComponentPanel: false,
    showScorePanel: false,
    showCanvasSettingsPanel: false,
    selectedPresetTab: false,
    markdownText: '',
    markdownElements: [],
    markdownData: null
  }
};

// Reducer
function layoutReducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.UPDATE_LAYOUT:
      return {
        ...state,
        layout: action.payload
      };
    case actionTypes.UPDATE_SELECTED_ELEMENT_ID:
      return {
        ...state,
        selectedElementId: action.payload
      };
    case actionTypes.UPDATE_CANVAS_SIZE:
      return {
        ...state,
        canvasWidth: action.payload.width,
        canvasHeight: action.payload.height
      };
    case actionTypes.CLEAR_LAYOUT:
      return {
        ...state,
        layout: null,
        selectedElementId: null
      };
    case actionTypes.UPDATE_USED_ELEMENT_IDS:
      return {
        ...state,
        usedElementIds: new Set([...state.usedElementIds, ...action.payload])
      };
    case actionTypes.RESET_USED_ELEMENT_IDS:
      return {
        ...state,
        usedElementIds: new Set()
      };
    
    // 处理UI状态更新
    case actionTypes.UPDATE_JSON_INPUT:
      return {
        ...state,
        ui: {
          ...state.ui,
          jsonInput: action.payload
        }
      };
    case actionTypes.UPDATE_MARKDOWN_TEXT:
      return {
        ...state,
        ui: {
          ...state.ui,
          markdownText: action.payload
        }
      };
    case actionTypes.UPDATE_MARKDOWN_ELEMENTS:
      return {
        ...state,
        ui: {
          ...state.ui,
          markdownElements: action.payload
        }
      };
    case actionTypes.UPDATE_MARKDOWN_DATA:
      return {
        ...state,
        ui: {
          ...state.ui,
          markdownData: action.payload,
          markdownElements: action.payload && action.payload.markdownElements ? 
            action.payload.markdownElements : state.ui.markdownElements
        }
      };
    case actionTypes.TOGGLE_PANEL:
      return {
        ...state,
        ui: {
          ...state.ui,
          ...action.payload // {panelName: true/false}
        }
      };
    case actionTypes.SET_UI_STATE:
      return {
        ...state,
        ui: {
          ...state.ui,
          ...action.payload
        }
      };
    default:
      return state;
  }
}

// 创建 Store
export const store = createStore(
  layoutReducer,
  // 添加 Redux DevTools 支持
  typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__ 
    ? window.__REDUX_DEVTOOLS_EXTENSION__() 
    : f => f
);

// Action 创建函数
export const actions = {
  updateLayout: (newLayout) => ({
    type: actionTypes.UPDATE_LAYOUT,
    payload: newLayout
  }),
  updateSelectedElementId: (elementId) => ({
    type: actionTypes.UPDATE_SELECTED_ELEMENT_ID,
    payload: elementId
  }),
  updateCanvasSize: (width, height) => ({
    type: actionTypes.UPDATE_CANVAS_SIZE,
    payload: { width, height }
  }),
  clearLayout: () => ({
    type: actionTypes.CLEAR_LAYOUT
  }),
  updateUsedElementIds: (elementIds) => ({
    type: actionTypes.UPDATE_USED_ELEMENT_IDS,
    payload: elementIds
  }),
  resetUsedElementIds: () => ({
    type: actionTypes.RESET_USED_ELEMENT_IDS
  }),
  
  // UI状态相关Action
  updateJsonInput: (jsonInput) => ({
    type: actionTypes.UPDATE_JSON_INPUT,
    payload: jsonInput
  }),
  updateMarkdownText: (text) => ({
    type: actionTypes.UPDATE_MARKDOWN_TEXT,
    payload: text
  }),
  updateMarkdownElements: (elements) => ({
    type: actionTypes.UPDATE_MARKDOWN_ELEMENTS,
    payload: elements
  }),
  updateMarkdownData: (markdownData) => ({
    type: actionTypes.UPDATE_MARKDOWN_DATA,
    payload: markdownData
  }),
  togglePanel: (panelSettings) => ({
    type: actionTypes.TOGGLE_PANEL,
    payload: panelSettings
  }),
  setUiState: (uiState) => ({
    type: actionTypes.SET_UI_STATE,
    payload: uiState
  })
};

// 为了兼容旧代码的接口
export const compatAPI = {
  updateLayout: (newLayout) => {
    store.dispatch(actions.updateLayout(newLayout));
  },
  updateSelectedElementId: (elementId) => {
    store.dispatch(actions.updateSelectedElementId(elementId));
  },
  updateCanvasSize: (width, height) => {
    store.dispatch(actions.updateCanvasSize(width, height));
  },
  getLayout: () => {
    return store.getState().layout;
  },
  getSelectedElementId: () => {
    return store.getState().selectedElementId;
  },
  getCanvasSize: () => {
    return {
      width: store.getState().canvasWidth,
      height: store.getState().canvasHeight
    };
  },
  registerListener: (listener) => {
    // 返回 unsubscribe 函数
    return store.subscribe(() => {
      listener(store.getState());
    });
  }
};

// 导出 Redux Store
export default store;

// 导出兼容 API
export { compatAPI as layoutState }; 