'use client';
import React from 'react';
import { resolveToken, mergeStyleValues, processStyleValue } from '../../utils/tokenResolver';
import { mergeElementPresets } from '../../utils/presetSystem';
import { iconMap } from '../layout-panel/inputs/IconSelector';

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
    const presetKeys = Object.keys(element).filter(key => key.endsWith('Preset'));
    presetKeys.forEach(key => {
      if (element[key]) {
        featureString += `${key}:${element[key]};`;
      }
    });
    
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

    const { style = {}, type } = elementWithId;
    const isSelected = elementWithId.id === selectedElementId;

    // 判断元素是否支持布局属性
    const supportsLayout = ['container'].includes(type);

    // 从新预设系统中获取预设样式并处理令牌引用
    let presetStyle = mergeElementPresets(elementWithId) || {};

    // 处理预设样式中的所有令牌引用
    for (const [key, value] of Object.entries(presetStyle)) {
      if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
        const resolvedValue = resolveToken(value);
        if (resolvedValue !== value) {
          presetStyle[key] = resolvedValue;
        }
      }
    }

    // 调试输出预设信息
    if (elementWithId.spacingPreset) {
      console.log(`元素 ${elementWithId.id || elementWithId.type} 的间距预设:`, elementWithId.spacingPreset);
      console.log('解析后的预设样式:', presetStyle);
    }

    // 确保style存在，避免解构undefined
    const resolvedStyle = style || {};

    // 解构并规范化样式属性
    const {
      // 布局方向属性（仅用于容器和按钮）
      direction = supportsLayout ? 'column' : 'none',
      justifyContent = 'flex-start',
      alignItems = 'flex-start',

      // 尺寸/增长属性
      grow = 0,
      primaryAxisSizingMode = 'fixed',
      counterAxisSizingMode = 'auto',
      width = 'auto',
      height = 'auto',
      minWidth = null,
      minHeight = null,
      maxWidth = null,
      maxHeight = null,

      // 间距属性
      gap = 0,

      // 外边距 - 使用单独的属性而非简写
      marginTop = 0,
      marginRight = 0,
      marginBottom = 0,
      marginLeft = 0,

      // 内边距 - 使用单独的属性而非简写
      paddingTop = 0,
      paddingRight = 0,
      paddingBottom = 0,
      paddingLeft = 0,

      // 视觉属性
      borderRadius = 0,
      borderWidth = 0,
      borderColor = null,
      backgroundColor = null,
      boxShadow = 'none',

      // 类型特定的属性在switch语句中处理
      ...restStyle
    } = resolvedStyle;

    // 构建基础样式对象，包含通用属性
    let baseStyle = {
      // 编辑器视觉提示
      cursor: 'pointer',
      // 使用边框指示编辑器中的元素边界
      border: '1px dashed #aaa',
      boxSizing: 'border-box',

      // 通用属性
      width: width === 'auto' ? 'auto' :
        width === 'fix-content' ? 'fit-content' :
          typeof width === 'number' ? `${width}px` : width,

      height: height === 'auto' ? 'auto' :
        height === 'fix-content' ? 'fit-content' :
          typeof height === 'number' ? `${height}px` : height,

      minWidth: minWidth && (typeof minWidth === 'number' ? `${minWidth}px` : minWidth),
      minHeight: minHeight && (typeof minHeight === 'number' ? `${minHeight}px` : minHeight),
      maxWidth: maxWidth && (typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth),
      maxHeight: maxHeight && (typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight),

      // 外边距属性 - 确保正确处理令牌值和数值
      marginTop: processStyleValue(marginTop, 'px', '0'),
      marginRight: processStyleValue(marginRight, 'px', '0'),
      marginBottom: processStyleValue(marginBottom, 'px', '0'),
      marginLeft: processStyleValue(marginLeft, 'px', '0'),

      // 内边距属性 - 确保正确处理令牌值和数值
      paddingTop: processStyleValue(paddingTop, 'px', '0'),
      paddingRight: processStyleValue(paddingRight, 'px', '0'),
      paddingBottom: processStyleValue(paddingBottom, 'px', '0'),
      paddingLeft: processStyleValue(paddingLeft, 'px', '0'),

      // 视觉属性
      borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : resolveToken(borderRadius),
      borderWidth: borderWidth && (typeof borderWidth === 'number' ? `${borderWidth}px` : resolveToken(borderWidth)),
      borderColor: resolveToken(borderColor),
      backgroundColor: resolveToken(backgroundColor),
      boxShadow: resolveToken(boxShadow),
      flexGrow: grow,
    };

    // 仅为支持布局的元素添加布局属性
    if (supportsLayout) {
      baseStyle = {
        ...baseStyle,
        display: 'flex',
        flexDirection: direction,
        justifyContent,
        alignItems,
        gap: processStyleValue(gap, 'px', '0'),
      };
    } else {
      // 对于非布局元素，使用块显示
      baseStyle.display = 'block';
    }

    // 添加选中指示器样式
    const selectionStyle = isSelected ? {
      outline: '2px solid #1890FF',
      boxShadow: '0 0 0 1px #1890FF',
      position: 'relative',
      zIndex: 1,
      // 修复：不要同时使用margin简写和具体的margin方向属性
      // 使用具体方向的margin属性代替
      ...(elementWithId.id === layout?.id ? {
        marginTop: 0,
        marginRight: 0,
        marginBottom: 0,
        marginLeft: 0
      } : {})
    } : {};

    // 合并样式，确保预设样式优先级高于基础样式
    // 选中样式应该始终具有最高优先级以保证视觉一致性
    const computedStyle = {
      ...baseStyle,         // 基础样式（最低优先级）
      ...presetStyle,       // 预设样式（中等优先级）
      ...selectionStyle     // 选中样式（最高优先级）
    };


    // 根据类型渲染特定元素
    switch (elementWithId.type) {
      case 'container':
        // 为容器添加特殊处理，确保子元素即使有margin也不会超出容器
        const containerStyle = {
          ...computedStyle,
          position: 'relative',
          // 确保可以显示子元素的外边距
          paddingTop: computedStyle.paddingTop || '4px',
          paddingRight: computedStyle.paddingRight || '4px',
          paddingBottom: computedStyle.paddingBottom || '4px',
          paddingLeft: computedStyle.paddingLeft || '4px',
          // 防止边距重叠
          borderTop: computedStyle.borderTop || '1px solid transparent',
          borderBottom: computedStyle.borderBottom || '1px solid transparent',
          // 修复：使用更明确的方式设置根容器边距为0
          ...(elementWithId.id === layout?.id ? {
            marginTop: 0,
            marginRight: 0,
            marginBottom: 0,
            marginLeft: 0
          } : {})
        };
        
        return (
          <div
            style={containerStyle}
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
        // 文本特定样式属性 - 使用新的样式处理工具函数
        const { fontSize, fontWeight, color, align, letterSpacing, lineHeight, textTransform, fontStyle } = restStyle;

        // 创建文本样式，使用统一的工具函数处理样式值和优先级
        const textStyle = {
          ...computedStyle,
          fontSize: mergeStyleValues(computedStyle.fontSize, fontSize, 'px', '16px'),
          fontWeight: mergeStyleValues(computedStyle.fontWeight, fontWeight, '', 'normal'),
          color: mergeStyleValues(computedStyle.color, color, '', '#333333'),
          textAlign: mergeStyleValues(computedStyle.textAlign, align, '', 'left'),
          letterSpacing: mergeStyleValues(computedStyle.letterSpacing, letterSpacing),
          lineHeight: mergeStyleValues(computedStyle.lineHeight, lineHeight),
          textTransform: mergeStyleValues(computedStyle.textTransform, textTransform),
          fontStyle: mergeStyleValues(computedStyle.fontStyle, fontStyle)
        };

        return (
          <div
            style={textStyle}
            onClick={(e) => onElementClick(elementWithId, e)}
            className={isSelected ? 'selected-element' : ''}
            data-element-id={elementWithId.id}
          >
            {elementWithId.content?.value || 'Text Element'}
          </div>
        );

      case 'button':
        // 按钮特定样式属性 - 使用统一的样式处理工具函数
        const buttonStyle = {
          ...computedStyle,
          backgroundColor: mergeStyleValues(computedStyle.backgroundColor, restStyle.backgroundColor, '', '#40A9FF'),
          color: mergeStyleValues(computedStyle.color, restStyle.color, '', '#FFFFFF'),
          transition: mergeStyleValues(computedStyle.transition, 'background-color 0.3s'),
          textAlign: mergeStyleValues(computedStyle.textAlign, 'center'),
          display: mergeStyleValues(computedStyle.display, 'flex'),
          justifyContent: mergeStyleValues(computedStyle.justifyContent, 'center'),
          alignItems: mergeStyleValues(computedStyle.alignItems, 'center')
        };

        // 处理按钮图标
        const buttonText = elementWithId.content?.text || 'Button';
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
            style={buttonStyle}
            onClick={(e) => onElementClick(elementWithId, e)}
            className={isSelected ? 'selected-element' : ''}
            data-element-id={elementWithId.id}
          >
            {renderButtonContent()}
          </div>
        );

      case 'image':
        // 图像特定样式属性 - 使用统一的样式处理工具函数
        const { objectFit = 'cover' } = restStyle;

        const imageStyle = {
          ...computedStyle,
          overflow: mergeStyleValues(computedStyle.overflow, 'hidden'),
          minHeight: mergeStyleValues(computedStyle.minHeight, '100px'),
          minWidth: mergeStyleValues(computedStyle.minWidth, '100px')
        };

        return (
          <div
            style={imageStyle}
            onClick={(e) => onElementClick(elementWithId, e)}
            className={isSelected ? 'selected-element' : ''}
            data-element-id={elementWithId.id}
          >
            {elementWithId.content?.src ? (
              <img
                src={elementWithId.content.src}
                alt={elementWithId.content.alt || ''}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: processStyleValue(objectFit, '', 'cover')
                }}
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
            style={{ ...computedStyle, padding: '12px', textAlign: 'center' }}
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