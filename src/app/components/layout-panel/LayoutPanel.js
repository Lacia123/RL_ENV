'use client';
import React, { useState, useEffect } from 'react';
import { resolveStyleTokens, setNestedProperty } from './utils';
import LayoutConfigSection from './config-sections/LayoutConfigSection';
import AppearanceConfigSection from './config-sections/AppearanceConfigSection';
import ConfigSection from './config-sections/ConfigSection';
import CorePropertiesSection from './config-sections/CorePropertiesSection';
import TextInput from './inputs/TextInput';
import ElementEditorSelector from './element-editors/ElementEditorSelector';
import PresetSelector from './management/PresetSelector';
import CategoryPresetSelector from './management/CategoryPresetSelector';
import AddComponentPanel from './management/AddComponentPanel';
import ElementActions from './management/ElementActions';

/**
 * 布局面板组件 - 整合所有布局编辑功能
 * @param {Object} props
 * @param {Object} props.selectedElement - 当前选中的元素
 * @param {string} props.selectedElementId - 当前选中元素的ID
 * @param {Function} props.onStyleChange - 样式变更回调
 * @param {Function} props.onContentChange - 内容变更回调
 * @param {Function} props.onActionChange - 动作变更回调
 * @param {Function} props.onAddComponent - 添加组件回调
 * @param {Function} props.onPresetApply - 应用预设回调 (旧API)
 * @param {Function} props.onCategoryPresetApply - 应用分类预设回调 (新API) (category, presetKey) => void
 * @param {Function} props.onDeleteElement - 删除元素回调
 * @param {Function} props.onDuplicateElement - 复制元素回调
 * @param {Function} props.onMoveElement - 移动元素回调
 */
const LayoutPanel = ({
  selectedElement,
  selectedElementId,
  onStyleChange,
  onContentChange,
  onActionChange,
  onAddComponent,
  onPresetApply,
  onCategoryPresetApply,
  onDeleteElement,
  onDuplicateElement,
  onMoveElement
}) => {
  // Tab状态管理
  const [activeTab, setActiveTab] = useState('layout');
  // 是否显示高级配置的状态
  const [showAdvancedConfig, setShowAdvancedConfig] = useState(false);
  
  // 如果没有选中元素，显示提示信息
  if (!selectedElement) {
    return (
      <div className="bg-white rounded-lg border p-6 text-center">
        <h4 className="text-lg font-medium mb-3">请选择一个元素进行编辑</h4>
        <p className="text-gray-500 text-sm">
          点击画布中的任意元素以开始编辑其属性
        </p>
      </div>
    );
  }
  
  // 确保style对象存在，防止undefined引用报错
  const { type, content } = selectedElement;
  const style = selectedElement.style || {};
  const isRootElement = selectedElementId === 'root';
  const isContainer = type === 'container';
  
  // Tab样式
  const tabStyle = (isActive) => `px-4 py-2 ${isActive 
    ? 'bg-blue-100 border-b-2 border-blue-500 text-blue-700' 
    : 'hover:bg-gray-100 text-gray-700'} cursor-pointer text-sm transition-colors`;
  
  return (
    <div className="bg-white rounded-lg border p-4">
      {/* 元素信息头部 */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className="text-md font-medium">
            {type.charAt(0).toUpperCase() + type.slice(1)} {!isRootElement && `- ${selectedElementId}`}
          </h4>
          <p className="text-xs text-gray-500 mt-1">
            {isRootElement ? '根容器元素' : `ID: ${selectedElementId}`}
          </p>
        </div>
        
        {/* 元素类型标签 */}
        <div className="flex items-center">
          <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
            {type}
          </div>
        </div>
      </div>
      
      {/* 元素操作按钮 */}
      <ElementActions
        elementId={selectedElementId}
        isRootElement={isRootElement}
        onDeleteElement={onDeleteElement}
        onDuplicateElement={onDuplicateElement}
        onMoveElement={onMoveElement}
        className="mb-4"
      />
      
      {/* 分类预设选择器 */}
      <ConfigSection
        title="样式预设"
        description="组合多种预设实现精细控制"
        className="mb-4"
      >
        <CategoryPresetSelector
          elementType={type}
          selectedPresets={{
            // 原有预设类别
            typography: selectedElement.typographyPreset,
            appearance: selectedElement.appearancePreset,
            spacing: selectedElement.spacingPreset,
            layout: selectedElement.layoutPreset,
            textAlign: selectedElement.textAlignPreset,
            // 新增预设类别
            selfAlign: selectedElement.selfAlignPreset,
            size: selectedElement.sizePreset,
            buttonSize: selectedElement.buttonSizePreset,
            flexRatio: selectedElement.flexRatioPreset,
            imageProportion: selectedElement.imageProportionPreset
          }}
          onPresetSelect={onCategoryPresetApply}
        />
      </ConfigSection>
      
      {/* 核心属性配置 - 每种元素类型的基本内容配置 */}
      <CorePropertiesSection
        element={selectedElement}
        onContentChange={onContentChange}
        onStyleChange={onStyleChange}
        className="mb-4"
      />
      
      {/* 子组件添加面板 (仅容器元素显示) */}
      {isContainer && (
        <AddComponentPanel
          onAddComponent={(type, name) => onAddComponent(type, name)}
          parentElement={selectedElement}
          className="mb-4"
        />
      )}
      
      {/* 高级配置按钮 */}
      <div className="flex justify-center mb-4">
        <button
          className={`px-4 py-2 rounded-lg text-sm transition-colors ${
            showAdvancedConfig
            ? 'bg-blue-100 text-blue-700 border border-blue-300'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
          }`}
          onClick={() => setShowAdvancedConfig(!showAdvancedConfig)}
        >
          {showAdvancedConfig ? '隐藏高级配置' : '显示高级配置'}
        </button>
      </div>

      {/* 属性编辑选项卡 - 只在高级配置显示时才显示 */}
      {showAdvancedConfig && (
        <div className="flex border-b mb-4">
          <div
            className={tabStyle(activeTab === 'layout')}
            onClick={() => setActiveTab('layout')}
          >
            布局
          </div>
          <div
            className={tabStyle(activeTab === 'appearance')}
            onClick={() => setActiveTab('appearance')}
          >
            外观
          </div>
          <div
            className={tabStyle(activeTab === 'specific')}
            onClick={() => setActiveTab('specific')}
          >
            组件特有
          </div>
        </div>
      )}
      
      {/* 属性编辑区域 - 只在高级配置显示时才显示 */}
      {showAdvancedConfig && (
        <div className="overflow-y-auto max-h-[calc(100vh-300px)]">
          {activeTab === 'layout' && (
            <>
              {/* 根据元素类型判断是否显示完整布局面板，默认折叠 */}
              <ConfigSection
                title="布局配置"
                description="配置元素的布局属性"
                defaultCollapsed={true}
              >
                {type === 'container' ? (
                  <LayoutConfigSection
                    style={style}
                    onStyleChange={onStyleChange}
                  />
                ) : (
                  <p className="text-sm text-gray-500 py-2">该元素不支持完整布局属性设置，请使用预设。</p>
                )}
              </ConfigSection>
              
              {/* 通用布局属性区域 */}
              {type !== 'container' && (
                <>
                  {/* 对于不支持布局方向的元素，只显示通用布局属性 */}
                
                  <ConfigSection
                    title="边距设置"
                    description="配置元素的外边距"
                  >
                    <TextInput
                      label="上边距"
                      value={style?.marginTop}
                      type="number"
                      tooltip="元素顶部的外边距"
                      onChange={(val) => onStyleChange('marginTop', val)}
                    />
                    <TextInput
                      label="右边距"
                      value={style?.marginRight}
                      type="number"
                      tooltip="元素右侧的外边距"
                      onChange={(val) => onStyleChange('marginRight', val)}
                    />
                    <TextInput
                      label="下边距"
                      value={style?.marginBottom}
                      type="number"
                      tooltip="元素底部的外边距"
                      onChange={(val) => onStyleChange('marginBottom', val)}
                    />
                    <TextInput
                      label="左边距"
                      value={style?.marginLeft}
                      type="number"
                      tooltip="元素左侧的外边距"
                      onChange={(val) => onStyleChange('marginLeft', val)}
                    />
                  </ConfigSection>
                  
                  <ConfigSection
                    title="内边距设置"
                    description="配置元素的内边距"
                  >
                    <TextInput
                      label="上内边距"
                      value={style?.paddingTop}
                      type="number"
                      tooltip="元素顶部的内边距"
                      onChange={(val) => onStyleChange('paddingTop', val)}
                    />
                    <TextInput
                      label="右内边距"
                      value={style?.paddingRight}
                      type="number"
                      tooltip="元素右侧的内边距"
                      onChange={(val) => onStyleChange('paddingRight', val)}
                    />
                    <TextInput
                      label="下内边距"
                      value={style?.paddingBottom}
                      type="number"
                      tooltip="元素底部的内边距"
                      onChange={(val) => onStyleChange('paddingBottom', val)}
                    />
                    <TextInput
                      label="左内边距"
                      value={style?.paddingLeft}
                      type="number"
                      tooltip="元素左侧的内边距"
                      onChange={(val) => onStyleChange('paddingLeft', val)}
                    />
                  </ConfigSection>
                  
                  <ConfigSection
                    title="尺寸设置"
                    description="配置元素的尺寸"
                  >
                    <TextInput
                      label="宽度"
                      value={style?.width}
                      onChange={(val) => onStyleChange('width', val)}
                      placeholder="auto/fix-content/数值"
                      tooltip="元素的宽度，可以是具体数值或特殊值"
                    />
                    <TextInput
                      label="高度"
                      value={style?.height}
                      onChange={(val) => onStyleChange('height', val)}
                      placeholder="auto/fix-content/数值"
                      tooltip="元素的高度，可以是具体数值或特殊值"
                    />
                    <TextInput
                      label="最小宽度"
                      value={style?.minWidth}
                      type="number"
                      tooltip="元素的最小宽度"
                      onChange={(val) => onStyleChange('minWidth', val)}
                    />
                    <TextInput
                      label="最小高度"
                      value={style?.minHeight}
                      type="number"
                      tooltip="元素的最小高度"
                      onChange={(val) => onStyleChange('minHeight', val)}
                    />
                    <TextInput
                      label="最大宽度"
                      value={style?.maxWidth}
                      type="number"
                      tooltip="元素的最大宽度"
                      onChange={(val) => onStyleChange('maxWidth', val)}
                    />
                    <TextInput
                      label="最大高度"
                      value={style?.maxHeight}
                      type="number"
                      tooltip="元素的最大高度"
                      onChange={(val) => onStyleChange('maxHeight', val)}
                    />
                  </ConfigSection>
                </>
              )}
            </>
          )}
          
          {activeTab === 'appearance' && (
            <AppearanceConfigSection
              style={style}
              onStyleChange={onStyleChange}
            />
          )}
          
          {activeTab === 'specific' && (
            <ElementEditorSelector
              element={selectedElement}
              onStyleChange={onStyleChange}
              onContentChange={onContentChange}
              onActionChange={onActionChange}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default LayoutPanel;