'use client';
import React from 'react';

/**
 * 配置分组组件 - 用于对相关配置项进行分组
 * @param {Object} props
 * @param {string} props.title - 分组标题
 * @param {string} props.description - 可选描述信息
 * @param {React.ReactNode} props.children - 子元素
 * @param {string} props.className - 额外的CSS类
 * @param {boolean} props.collapsible - 是否可折叠
 * @param {boolean} props.defaultCollapsed - 默认是否折叠
 */
const ConfigSection = ({ 
  title, 
  description, 
  children, 
  className = "",
  collapsible = false,
  defaultCollapsed = false
}) => {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);
  
  return (
    <div className={`mb-6 ${className}`}>
      <div className="flex justify-between items-center border-b pb-2 mb-3">
        <h4 className="text-md font-medium">{title}</h4>
        {collapsible && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-500 hover:text-gray-700"
          >
            {collapsed ? '展开' : '折叠'}
          </button>
        )}
      </div>
      
      {description && (
        <p className="text-sm text-gray-500 mb-3">{description}</p>
      )}
      
      {!collapsed && (
        <div className="grid grid-cols-2 gap-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default ConfigSection;