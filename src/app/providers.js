'use client';
import { Provider } from 'react-redux';
import { store } from './utils/reduxStore';

/**
 * 提供全局状态管理的Provider组件
 * 包装了Redux Provider，以确保所有组件都能访问Redux状态
 */
export default function Providers({ children }) {
  return <Provider store={store}>{children}</Provider>;
} 