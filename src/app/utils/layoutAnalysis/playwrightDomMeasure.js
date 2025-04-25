'use client';

import { JSDOM } from 'jsdom';
import { chromium } from 'playwright-chromium';
import { metawareToStyleObject } from '../metaware/metawareToCss.js';
import presetSystem from '../presets/index.js';

/**
 * JSDOM + Playwright 混合测量系统
 * 
 * 该模块使用 JSDOM 创建 DOM 结构，然后使用 Playwright 进行实际的布局测量
 */

/**
 * 生成基于 JSDOM + Playwright 的 DOM 测量数据
 * @param {Object} layout - 布局对象
 * @param {Object} containerDimensions - 容器尺寸，格式为 {width, height}
 * @returns {Object} DOM测量数据
 */
export async function generateHybridMeasurements(layout, containerDimensions = { width: 1024, height: 768 }) {
    // 使用 JSDOM 创建初始 DOM 结构
    const dom = new JSDOM(`
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          margin: 0;
          padding: 0;
        }
        .layout-container {
          width: ${containerDimensions.width}px;
          height: ${containerDimensions.height}px;
          position: relative;
          overflow: auto;
        }
      </style>
    </head>
    <body>
      <div class="layout-container" id="root"></div>
    </body>
    </html>
  `);

    const { window } = dom;
    const { document } = window;

    // 递归创建 DOM 树
    createDOMTree(layout, document.getElementById('root'), document);

    // 获取生成的 HTML 内容
    const entireHTML = document.documentElement.outerHTML;

    // 清理 JSDOM 资源
    window.close();

    // 使用 Playwright 进行实际测量
    const measurements = await measureWithPlaywright(entireHTML, layout, containerDimensions);

    return measurements;
}

/**
 * 递归创建 DOM 树
 * @param {Object} element - 布局元素
 * @param {Object} parentNode - 父 DOM 节点
 * @param {Object} document - JSDOM 文档对象
 */
function createDOMTree(element, parentNode, document) {
    if (!element || !element.id) return;

    // 创建DOM元素
    const domElement = document.createElement('div');
    domElement.id = element.id;
    domElement.setAttribute('data-element-id', element.id);
    domElement.setAttribute('data-element-type', element.type);

    // 根据元素类型渲染内容
    renderElementContent(element, domElement, document);
    
    // 应用样式
    applyElementStyles(element, domElement);

    // 将元素添加到父节点
    parentNode.appendChild(domElement);

    // 递归处理子元素
    if (element.children && element.children.length > 0) {
        element.children.forEach(child => {
            createDOMTree(child, domElement, document);
        });
    }
}

/**
 * 渲染元素内容
 * @param {Object} element - 元素对象
 * @param {Object} domElement - DOM元素
 * @param {Object} document - 文档对象
 */
function renderElementContent(element, domElement, document) {
    switch (element.type) {
        case 'text':
            // 提取文本内容 - 与LayoutPreview.js保持一致
            const textContent = 
                typeof element.content === 'string'
                ? element.content
                : element.content?.value || 'Text Element';
            domElement.textContent = textContent;
            break;

        case 'button':
            // 提取按钮文本 - 与LayoutPreview.js保持一致
            const buttonText = 
                typeof element.content === 'string'
                ? element.content
                : element.content?.text || 'Button';

            // 处理按钮图标
            const buttonIcon = element.content?.icon;
            const iconPosition = element.content?.iconPosition || 'left';

            // 如果有图标，使用与LayoutPreview.js相同的渲染方式
            if (buttonIcon) {
                const iconElement = document.createElement('span');
                iconElement.className = 'icon';
                iconElement.style.display = 'inline-block';
                iconElement.style.fontSize = '1.2em';
                iconElement.style.marginLeft = iconPosition === 'right' ? '8px' : '0';
                iconElement.style.marginRight = iconPosition === 'left' ? '8px' : '0';
                iconElement.textContent = '•'; // 简化的图标占位符

                if (iconPosition === 'left') {
                    domElement.appendChild(iconElement);
                    domElement.appendChild(document.createTextNode(buttonText));
                } else {
                    domElement.appendChild(document.createTextNode(buttonText));
                    domElement.appendChild(iconElement);
                }
            } else {
                domElement.textContent = buttonText;
            }
            break;

        case 'image':
            // 图片处理 - 与LayoutPreview.js保持一致
            const imgSrc = element.src || element.content?.src || '';
            const imgAlt = element.alt || element.content?.alt || '';

            if (imgSrc) {
                const imgElement = document.createElement('img');
                imgElement.style.width = '100%';
                imgElement.style.height = '100%';
                imgElement.style.objectFit = 'cover';
                imgElement.src = imgSrc;
                imgElement.alt = imgAlt;
                domElement.appendChild(imgElement);
            } else {
                // 图片占位符
                domElement.style.display = 'flex';
                domElement.style.alignItems = 'center';
                domElement.style.justifyContent = 'center';
                domElement.style.color = '#999';
                domElement.style.padding = '8px';
                domElement.style.textAlign = 'center';
                domElement.textContent = 'Image Placeholder';
            }
            break;

        // container和其他类型不需要特殊处理
    }
}

/**
 * 应用元素样式 - 与LayoutPreview.js保持一致的处理逻辑
 * @param {Object} element - 元素对象
 * @param {Object} domElement - DOM元素
 */
function applyElementStyles(element, domElement) {
    try {
        // 从metaware系统获取基础样式
        const metawareStyles = metawareToStyleObject(element.type, 'default', true);
        
        // 从预设系统获取处理后的元素
        const processedElement = presetSystem.processElement(element);
        const presetStyles = processedElement.styles || {};
        
        // 是否选中状态 (测量时不需要选中效果)
        const isSelected = false;
        const selectionStyle = isSelected ? {
            outline: '2px solid #1890FF',
            boxShadow: '0 0 0 1px #1890FF',
            position: 'relative',
            zIndex: 1
        } : {};
        
        // 合并样式，保持与LayoutPreview.js相同的优先级
        const computedStyle = {
            ...metawareStyles,         // metaware基础样式（最低优先级）
            ...presetStyles,           // 预设样式（中等优先级）
            ...(element.style || {}),  // 元素自身样式（高优先级）
            ...selectionStyle          // 选中样式（最高优先级）
        };
        
        // 应用合并后的样式
        Object.keys(computedStyle).forEach(key => {
            let value = computedStyle[key];
            
            // 确保数值属性有单位
            if (typeof value === 'number' && 
                ['fontSize', 'lineHeight', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
                'marginTop', 'marginRight', 'marginBottom', 'marginLeft', 'letterSpacing', 'wordSpacing',
                'borderRadius', 'borderWidth', 'gap', 'width', 'height'].includes(key)) {
                value = `${value}px`;
            }
            
            domElement.style[key] = value;
        });
    } catch (error) {
        console.error(`为元素 ${element.id || 'unknown'} 应用样式失败:`, error);
        
        // 应用基本样式作为回退方案
        domElement.style.boxSizing = 'border-box';
        
        if (element.style) {
            Object.entries(element.style).forEach(([key, value]) => {
                if (typeof value === 'number') {
                    value = `${value}px`;
                }
                domElement.style[key] = value;
            });
        }
    }
}

/**
 * 使用 Playwright 测量 DOM 元素
 * @param {string} htmlContent - HTML 内容
 * @param {Object} layout - 布局对象
 * @param {Object} containerDimensions - 容器尺寸
 * @returns {Object} 测量数据
 */
async function measureWithPlaywright(htmlContent, layout, containerDimensions) {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    // 设置视口尺寸
    await page.setViewportSize({
        width: containerDimensions.width,
        height: containerDimensions.height
    });

    // 设置页面内容
    await page.setContent(htmlContent);

    // 收集测量数据
    const measurements = await page.evaluate(({ layoutData, containerDimensions }) => {
        const measurements = {
            container: { ...containerDimensions }
        };

        function parseStyleValue(value, defaultValue = 0) {
            if (value === 'normal' || value === 'none' || value === 'auto') {
                return defaultValue;
            }
            const parsed = parseFloat(value);
            return isNaN(parsed) ? defaultValue : parsed;
        }

        function collectMeasurements(element) {
            if (!element || !element.id) return;

            const domElement = document.getElementById(element.id);

            if (!domElement) return;

            // 获取元素位置和尺寸
            const rect = domElement.getBoundingClientRect();
            const computedStyle = window.getComputedStyle(domElement);
            
            // 创建元素的测量数据
            measurements[element.id] = {
                x: rect.left,
                y: rect.top,
                width: rect.width,
                height: rect.height,
                type: element.type,
                style: {
                    fontSize: parseStyleValue(computedStyle.fontSize),
                    lineHeight: parseStyleValue(computedStyle.lineHeight),
                    fontWeight: computedStyle.fontWeight,
                    color: computedStyle.color,
                    backgroundColor: computedStyle.backgroundColor,
                    padding: {
                        top: parseStyleValue(computedStyle.paddingTop),
                        right: parseStyleValue(computedStyle.paddingRight),
                        bottom: parseStyleValue(computedStyle.paddingBottom),
                        left: parseStyleValue(computedStyle.paddingLeft)
                    },
                    margin: {
                        top: parseStyleValue(computedStyle.marginTop),
                        right: parseStyleValue(computedStyle.marginRight),
                        bottom: parseStyleValue(computedStyle.marginBottom),
                        left: parseStyleValue(computedStyle.marginLeft)
                    },
                    textAlign: computedStyle.textAlign,
                    letterSpacing: parseStyleValue(computedStyle.letterSpacing),
                    wordSpacing: parseStyleValue(computedStyle.wordSpacing),
                    borderRadius: parseStyleValue(computedStyle.borderRadius),
                    borderWidth: parseStyleValue(computedStyle.borderWidth),
                    display: computedStyle.display,
                    flexDirection: computedStyle.flexDirection,
                    justifyContent: computedStyle.justifyContent,
                    alignItems: computedStyle.alignItems,
                    gap: parseStyleValue(computedStyle.gap)
                }
            };

            // 保存所有预设属性
            const presetProperties = {};
            Object.keys(element).forEach(key => {
                if (key.endsWith('Preset')) {
                    presetProperties[key] = element[key];
                }
            });
            measurements[element.id].presets = presetProperties;

            // 文本元素的特殊处理
            if (element.type === 'text') {
                // 使用与LayoutPreview.js一致的文本提取逻辑
                const textContent = 
                    typeof element.content === 'string'
                    ? element.content
                    : element.content?.value || '';
                
                measurements[element.id].textContent = textContent;
                measurements[element.id].textLength = textContent.length;
                
                // 计算文本密度
                const textArea = rect.width * rect.height;
                measurements[element.id].textDensity = textArea > 0 ?
                    (textContent.length / textArea) * 10000 : 0;
            }
            
            // 保存容器尺寸到每个元素的测量数据
            measurements[element.id].containerWidth = containerDimensions.width;
            measurements[element.id].containerHeight = containerDimensions.height;

            // 递归处理子元素
            if (element.children && element.children.length > 0) {
                element.children.forEach(child => {
                    collectMeasurements(child);
                });
            }
        }

        collectMeasurements(layoutData);
        return measurements;
    }, { layoutData: layout, containerDimensions });

    await browser.close();
    return measurements;
}

/**
 * 向后兼容的函数名称
 */
export const generateJSDOMmeasurements = generateHybridMeasurements;