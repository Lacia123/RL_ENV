'use client';
import React, { useState } from 'react';
import { 
  AiOutlineHome, AiOutlineSearch, AiOutlineSetting, 
  AiOutlineUser, AiOutlineEdit, AiOutlineDelete,
  AiOutlineArrowRight, AiOutlineArrowLeft, AiOutlineMail,
  AiOutlinePhone, AiOutlineHeart, AiOutlineStar,
  AiOutlineShoppingCart, AiOutlineCalendar, AiOutlineCloudUpload,
  AiOutlineCheck, AiOutlineClose, AiOutlineInfoCircle,
  AiOutlineWarning, AiOutlineQuestion, AiOutlineBell
} from 'react-icons/ai';

// 图标映射
const iconMap = {
  'home': <AiOutlineHome />,
  'search': <AiOutlineSearch />,
  'settings': <AiOutlineSetting />,
  'user': <AiOutlineUser />,
  'edit': <AiOutlineEdit />,
  'delete': <AiOutlineDelete />,
  'arrow-right': <AiOutlineArrowRight />,
  'arrow-left': <AiOutlineArrowLeft />,
  'mail': <AiOutlineMail />,
  'phone': <AiOutlinePhone />,
  'heart': <AiOutlineHeart />,
  'star': <AiOutlineStar />,
  'cart': <AiOutlineShoppingCart />,
  'calendar': <AiOutlineCalendar />,
  'upload': <AiOutlineCloudUpload />,
  'check': <AiOutlineCheck />,
  'close': <AiOutlineClose />,
  'info': <AiOutlineInfoCircle />,
  'warning': <AiOutlineWarning />,
  'question': <AiOutlineQuestion />,
  'bell': <AiOutlineBell />
};

// 图标选择器选项
const iconOptions = Object.keys(iconMap).map(key => ({
  value: key,
  label: key.charAt(0).toUpperCase() + key.slice(1).replace('-', ' ')
}));

// 添加空选项
iconOptions.unshift({ value: '', label: '无图标' });

/**
 * 图标选择器组件
 * @param {Object} props
 * @param {string} props.label - 标签文本
 * @param {string} props.value - 当前值
 * @param {Function} props.onChange - 变更回调
 * @param {string} props.tooltip - 提示文本
 */
const IconSelector = ({ 
  label, 
  value = '',
  onChange, 
  tooltip,
  ...props 
}) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  
  // 获取当前选中的图标
  const getSelectedIcon = () => {
    return value && iconMap[value] ? iconMap[value] : null;
  };
  
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {tooltip && (
          <div className="text-gray-400 text-xs" title={tooltip}>
            <span className="cursor-help">ⓘ</span>
          </div>
        )}
      </div>
      
      <div className="relative">
        {/* 选择器按钮 */}
        <button
          type="button"
          className="w-full flex items-center justify-between bg-white border rounded p-2 hover:bg-gray-50"
          onClick={() => setIsPickerOpen(!isPickerOpen)}
        >
          <div className="flex items-center">
            {getSelectedIcon() ? (
              <span className="mr-2 text-xl">{getSelectedIcon()}</span>
            ) : null}
            <span>{value ? iconOptions.find(opt => opt.value === value)?.label : '选择图标'}</span>
          </div>
          <span>{isPickerOpen ? '▲' : '▼'}</span>
        </button>
        
        {/* 图标选择面板 */}
        {isPickerOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg">
            <div className="p-2 max-h-60 overflow-y-auto">
              {/* 无图标选项 */}
              <div
                className={`flex items-center p-2 cursor-pointer hover:bg-gray-100 rounded ${value === '' ? 'bg-blue-50' : ''}`}
                onClick={() => {
                  onChange('');
                  setIsPickerOpen(false);
                }}
              >
                <span>无图标</span>
              </div>
              
              {/* 图标选项 */}
              <div className="grid grid-cols-3 gap-2 mt-2">
                {Object.entries(iconMap).map(([iconKey, iconComponent]) => (
                  <div
                    key={iconKey}
                    className={`flex flex-col items-center p-2 cursor-pointer hover:bg-gray-100 rounded ${
                      value === iconKey ? 'bg-blue-50 border border-blue-300' : ''
                    }`}
                    onClick={() => {
                      onChange(iconKey);
                      setIsPickerOpen(false);
                    }}
                  >
                    <div className="text-xl">{iconComponent}</div>
                    <div className="text-xs mt-1">{iconKey}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 导出图标映射供其他组件使用
export { iconMap };

export default IconSelector;