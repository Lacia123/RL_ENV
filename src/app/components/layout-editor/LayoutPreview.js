'use client';
import React from 'react';
import presetSystem from '../../utils/presets';
import resolveToken from '../../utils/tokens/resolveToken';
import { iconMap } from '../layout-panel/inputs/IconSelector';
import { metawareToStyleObject } from '../../utils/metaware/metawareToCss';

/**
 * 布局预览组件 - 负责渲染预览区域中的各种元素
 * @param {Object} layout - 要渲染的布局对象
 * @param {string} selectedElementId - 当前选中的元素ID
 * @param {Function} onElementClick - 元素点击回调
 * @param {number} canvasWidth - 画布宽度
 * @param {number} canvasHeight - 画布高度
 */
const LayoutPreview = ({
  layout,
  selectedElementId,
  onElementClick,
  canvasWidth = 1024,
  canvasHeight = 768
}) => {
  // 生成基于内容的元素ID
  const generateElementId = (element) => {
    if (!element) return `element_unknown`;

    let idComponents = ['element', element.type];

    // 创建一个简单的哈希函数
    const simpleHash = (str) => {
      if (!str) return '';
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // 转换为 32bit 整数
      }
      return Math.abs(hash).toString(16).substring(0, 8); // 转为16进制字符串并取前8位
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
    if (element.presets && Array.isArray(element.presets)) {
      featureString += element.presets.join(';');
    }

    // 创建唯一内容哈希
    const contentHash = contentString ? simpleHash(contentString) : '';
    const featureHash = featureString ? simpleHash(featureString) : '';

    // 添加哈希到ID组件
    if (contentHash) {
      idComponents.push(contentHash);
    }

    if (featureHash) {
      idComponents.push(featureHash);
    }

    // 只有在必要时才添加一个确定性的序号（而不是随机数或时间戳）
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

  // 元素渲染函数
  const renderElement = (element) => {
    if (!element || !element.type) return null;

    // 确保元素有ID
    const elementWithId = element.id ? element : {
      ...element,
      id: generateElementId(element)
    };

    // 确保元素有presets数组
    if (!elementWithId.presets) {
      elementWithId.presets = [];
    }

    const { type } = elementWithId;
    const isSelected = elementWithId.id === selectedElementId;

    // 从预设系统中获取处理后的元素，包含预设样式
    const processedElement = presetSystem.processElement(elementWithId);
    const presetStyles = processedElement.styles || {};

    // 从metaware系统获取基础样式
    const metawareStyles = metawareToStyleObject(type, 'default', true);

    // 添加选中指示器样式
    const selectionStyle = isSelected ? {
      outline: '2px solid #1890FF',
      boxShadow: '0 0 0 1px #1890FF',
      position: 'relative',
      zIndex: 1
    } : {};

    // 合并样式，优先级：元素自身样式 > 预设样式 > metaware基础样式 > 选中样式
    const computedStyle = {
      ...metawareStyles,         // metaware基础样式（最低优先级）
      ...presetStyles,           // 预设样式（中等优先级）
      ...(elementWithId.style || {}), // 元素自身样式（高优先级）
      ...selectionStyle          // 选中样式（最高优先级）
    };

    // if (type === 'button') {
    //   console.log('.... metawareStyles')
    //   console.log(metawareStyles)
    //   console.log('.... presetStyles')
    //   console.log(presetStyles)
    //   console.log('.... elementWithId.style')
    //   console.log(elementWithId.style)
    //   console.log('.... selectionStyle')
    //   console.log(selectionStyle)
    // }

    // 根据类型渲染特定元素
    switch (elementWithId.type) {
      case 'container':
        return (
          <div
            style={computedStyle}
            onClick={(e) => onElementClick(elementWithId, e)}
            className={isSelected ? 'selected-element' : ''}
            data-element-id={elementWithId.id}
          >
            {elementWithId.children?.map((child, index) => {
              // 确保每个子元素都有一个唯一的key
              // 如果child没有id，使用index作为备选
              const key = child.id || `${elementWithId.id}_child_${index}`;
              return (
                <React.Fragment key={key}>
                  {renderElement(child)}
                </React.Fragment>
              );
            })}
          </div>
        );

      case 'text':
        // 提取文本内容
        const textContent =
          typeof elementWithId.content === 'string'
            ? elementWithId.content
            : elementWithId.content?.value || 'Text Element';

        return (
          <div
            style={computedStyle}
            onClick={(e) => onElementClick(elementWithId, e)}
            className={isSelected ? 'selected-element' : ''}
            data-element-id={elementWithId.id}
          >
            {textContent}
          </div>
        );

      case 'button':
        // 提取按钮文本
        const buttonText =
          typeof elementWithId.content === 'string'
            ? elementWithId.content
            : elementWithId.content?.text || 'Button';

        // 处理按钮图标
        const buttonIcon = elementWithId.content?.icon;
        const iconPosition = elementWithId.content?.iconPosition || 'left';

        // 渲染按钮内容，包括可选的图标
        const renderButtonContent = () => {
          // 如果没有图标，只显示文字
          if (!buttonIcon) {
            return buttonText;
          }

          // 渲染图标元素
          const iconElement = (
            <span
              className="icon"
              style={{
                fontSize: '1.2em',
                display: 'inline-block',
                marginLeft: iconPosition === 'right' ? '8px' : 0,
                marginRight: iconPosition === 'left' ? '8px' : 0
              }}
            >
              {/* 使用iconMap渲染真实图标组件 */}
              {iconMap[buttonIcon] || '•'}
            </span>
          );

          // 根据图标位置排列图标和文字
          return iconPosition === 'left'
            ? <>{iconElement}{buttonText}</>
            : <>{buttonText}{iconElement}</>;
        };

        return (
          <div
            style={computedStyle}
            onClick={(e) => onElementClick(elementWithId, e)}
            className={isSelected ? 'selected-element' : ''}
            data-element-id={elementWithId.id}
          >
            {renderButtonContent()}
          </div>
        );

      case 'image':
        // 提取图片属性
        const imgSrc = elementWithId.src || elementWithId.content?.src || '';
        const imgAlt = elementWithId.alt || elementWithId.content?.alt || '';

        // 图片样式
        const imgStyle = {
          width: '100%',
          height: '100%',
          objectFit: computedStyle.objectFit || 'cover'
        };

        return (
          <div
            style={computedStyle}
            onClick={(e) => onElementClick(elementWithId, e)}
            className={isSelected ? 'selected-element' : ''}
            data-element-id={elementWithId.id}
          >
            {imgSrc ? (
              <img
                src={imgSrc}
                alt={imgAlt}
                style={imgStyle}
              />
            ) : (
              <div style={{
                padding: '8px',
                textAlign: 'center',
                color: '#999',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                Image Placeholder
              </div>
            )}
          </div>
        );

      // 任何其他组件类型的后备渲染
      default:
        return (
          <div
            style={computedStyle}
            onClick={(e) => onElementClick(elementWithId, e)}
            className={isSelected ? 'selected-element' : ''}
            data-element-id={elementWithId.id}
          >
            {elementWithId.type.charAt(0).toUpperCase() + elementWithId.type.slice(1)} Element
          </div>
        );
    }
  };

  return (
    <div className="border-b bg-white p-4 h-full flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">布局预览</h3>
          <div className="flex items-center text-sm">
            <p className="mr-4">当前选中: {selectedElementId || 'root'}</p>
            <span className="px-2 py-1 bg-gray-100 rounded-md">
              画布尺寸: {canvasWidth} × {canvasHeight}
            </span>
          </div>
        </div>
        <div className="flex justify-center items-center flex-grow overflow-auto">
          <div
            className="border rounded bg-white"
            style={{
              width: `${canvasWidth}px`,
              height: `${canvasHeight}px`,
              maxWidth: '100%',
              maxHeight: '65vh',
              boxShadow: '0 0 10px rgba(0,0,0,0.1)',
              position: 'relative',
              // 避免影响滚动区域大小 
              boxSizing: 'border-box'
            }}
          >
            <div
              className='layout-preview-container'
              style={{
                width: '100%',
                height: '100%',
                overflow: 'auto',
                // 增加内边距，确保有足够空间显示边框
                padding: '6px',
                boxSizing: 'border-box'
              }}
            >
              {renderElement(layout)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayoutPreview;