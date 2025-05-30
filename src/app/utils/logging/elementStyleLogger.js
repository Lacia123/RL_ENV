/**
 * elementStyleLogger.js
 * 
 * 异步检测和记录各种元素样式错误的模块
 * 检测的问题类型：
 * 1. 按钮是否超出容器的横向边界（左右边界）
 * 2. 按钮内文本是否显示不全（a标签文本宽度超出按钮宽度）
 * 3. 文本元素是否因为flex布局被迫折行（仅在父级layout容器为flex-direction:row时检测）
 * 不检测纵向溢出（因为有滚动条）
 */

import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright-chromium';
import { renderEightElementToHtml } from '../eightElement/renderEightElementHtml';

// 日志文件路径
const LOG_DIR = path.join(process.cwd(), 'logs');
const LOG_FILE = path.join(LOG_DIR, 'element-style-logs.json');

// 确保日志目录存在
function ensureLogDirectory() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}

function getLogFilePath() {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD 格式
  return path.join(LOG_DIR, `style-errors-${dateStr}.json`);
}

/**
 * 读取现有日志数据
 */
function readLogData() {
  const logFile = getLogFilePath();
  try {
    if (fs.existsSync(logFile)) {
      const data = fs.readFileSync(logFile, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.warn('读取日志文件失败:', error);
  }
  return {
    date: new Date().toISOString().split('T')[0],
    buttonStyleError: 0,
    textWrapError: 0,
    wcagContrastError: 0,
    buttonBorderError: 0,
    logs: []
  };
}

/**
 * 写入日志数据
 */
function writeLogData(logData) {
  const logFile = getLogFilePath();
  try {
    ensureLogDirectory();
    logData.date = new Date().toISOString().split('T')[0];
    fs.writeFileSync(logFile, JSON.stringify(logData, null, 2), 'utf-8');
  } catch (error) {
    console.error('写入日志文件失败:', error);
  }
}



/**
 * 使用Playwright异步检测元素样式问题
 * @param {string} html - HTML内容
 * @param {Object} dimensions - 容器尺寸
 * @returns {Promise<Object>} 检测到的各种元素样式问题
 */
async function detectElementStyleIssues(html, dimensions) {
  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const page = await browser.newPage();
    await page.setViewportSize(dimensions);
    await page.setContent(html);

    // 等待页面渲染完成
    await page.waitForTimeout(100);


    page.on('console', (message) => {
      console.log(`PAGE LOG: ${message.text()}`);
    });


    // 检测各种元素样式问题
    const styleIssues = await page.evaluate((containerDimensions) => {
      const buttonIssues = [];
      const textWrapIssues = [];
      const buttonBorderIssues = [];

      // WCAG颜色对比度计算函数
      /**
       * 解析CSS颜色值为RGB
       * @param {string} color - CSS颜色值
       * @returns {Object} RGB对象 {r, g, b}
       */
      function parseColor(color) {
        // 创建临时元素来解析颜色
        const div = document.createElement('div');
        div.style.color = color;
        document.body.appendChild(div);
        const computedColor = window.getComputedStyle(div).color;
        document.body.removeChild(div);

        // 解析rgb()或rgba()格式
        const match = computedColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (match) {
          return {
            r: parseInt(match[1]),
            g: parseInt(match[2]),
            b: parseInt(match[3])
          };
        }

        // 默认返回黑色
        return { r: 0, g: 0, b: 0 };
      }

      /**
       * 计算相对亮度 (Relative Luminance)
       * 根据WCAG 2.1标准实现
       * @param {Object} rgb - RGB颜色对象 {r, g, b}
       * @returns {number} 相对亮度值 (0-1)
       */
      function calculateRelativeLuminance(rgb) {
        // 步骤A：RGB值标准化 (0-255 -> 0-1)
        const RsRGB = rgb.r / 255;
        const GsRGB = rgb.g / 255;
        const BsRGB = rgb.b / 255;

        // 步骤B：伽马校正
        // 如果值 <= 0.03928，使用线性转换；否则使用指数转换
        const R = RsRGB <= 0.03928 ? RsRGB / 12.92 : Math.pow((RsRGB + 0.055) / 1.055, 2.4);
        const G = GsRGB <= 0.03928 ? GsRGB / 12.92 : Math.pow((GsRGB + 0.055) / 1.055, 2.4);
        const B = BsRGB <= 0.03928 ? BsRGB / 12.92 : Math.pow((BsRGB + 0.055) / 1.055, 2.4);

        // 步骤C：计算相对亮度
        // 使用ITU-R BT.709标准的权重系数
        const luminance = 0.2126 * R + 0.7152 * G + 0.0722 * B;

        return luminance;
      }
      

      function parseGradientColors(cssValue) {
        // 提取rgb color
        const colorMatches = cssValue.match(/rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)/g);
  
        if (!colorMatches) return null;
                
        // 解析颜色
        const colors = colorMatches.map(color => {
          const values = color.match(/\d+/g).map(Number);
          return { r: values[0], g: values[1], b: values[2] };
        });

        if (colors) {
          // 计算平均颜色
          return {
            r: Math.round(colors.reduce((sum, c) => sum + c.r, 0) / colors.length),
            g: Math.round(colors.reduce((sum, c) => sum + c.g, 0) / colors.length),
            b: Math.round(colors.reduce((sum, c) => sum + c.b, 0) / colors.length)
          };
        }
        // 没有取到默认黑色
        return { r: 0, g: 0, b: 0 };
      }

      /**
       * 计算两个颜色之间的对比度
       * @param {Object} color1 - 第一个颜色的RGB值
       * @param {Object} color2 - 第二个颜色的RGB值
       * @returns {number} 对比度值 (1-21)
       */
      function calculateContrastRatio(color1, color2) {
        // 计算两个颜色的相对亮度
        const L1 = calculateRelativeLuminance(color1);
        const L2 = calculateRelativeLuminance(color2);

        // 确定较亮和较暗的颜色
        const lighter = Math.max(L1, L2);
        const darker = Math.min(L1, L2);

        // 计算对比度：(较亮亮度 + 0.05) / (较暗亮度 + 0.05)
        // 0.05是为了避免除零错误而添加的常数
        const contrastRatio = (lighter + 0.05) / (darker + 0.05);

        return contrastRatio;
      }

      /**
       * 评估对比度是否符合WCAG标准
       * @param {number} ratio - 对比度值
       * @param {string} type - 检查类型 ('text' | 'ui')
       * @returns {Object} 评估结果
       */
      function evaluateWCAGCompliance(ratio, type = 'text') {
        const result = {
          ratio: ratio,
          type: type,
          aa: false,
          aaa: false,
          level: 'fail'
        };

        if (type === 'text') {
          // 文字内容的要求：AA级 ≥ 4.5:1，AAA级 ≥ 7:1
          result.aa = ratio >= 4.5;
          result.aaa = ratio >= 7.0;
        } else if (type === 'ui') {
          // UI组件的要求：AA级 ≥ 3:1
          result.aa = ratio >= 3.0;
          result.aaa = ratio >= 3.0; // UI组件没有AAA级别要求
        }

        // 确定等级
        if (result.aaa) {
          result.level = 'AAA';
        } else if (result.aa) {
          result.level = 'AA';
        } else {
          result.level = 'fail';
        }

        return result;
      }

      // 1. 检测按钮样式问题
      const buttons = document.querySelectorAll('[id*="button"], button, .button, [data-element-type="button"]');

      buttons.forEach((button, index) => {
        const rect = button.getBoundingClientRect();
        const textContent = button.textContent || '';

        // 检查按钮是否横向超出容器边界（纵向有滚动条，不需要检测）
        const isOverflowing = (
          rect.left < 0 ||
          rect.right > containerDimensions.width
        );

        // 检查按钮内文本是否显示不全
        let hasTextOverflow = false;
        let textWidth = 0;
        let buttonWidth = rect.width;
        let actualTextContent = '';

        // 查找按钮内的a标签
        const linkElement = button.querySelector('a');
        if (linkElement) {
          actualTextContent = linkElement.textContent.trim();

          if (actualTextContent.length > 0) {
            // 获取按钮的字体大小
            const computedStyle = window.getComputedStyle(button);
            const fontSize = parseFloat(computedStyle.fontSize) || 16;

            // 计算文本宽度（考虑中英文混合）
            for (let char of actualTextContent) {
              if (/[\u4e00-\u9fa5]/.test(char)) {
                // 中文字符，宽度约等于fontSize
                textWidth += fontSize;
              } else {
                // 英文字符和数字，宽度约为fontSize * 0.6
                textWidth += fontSize * 0.6;
              }
            }

            // 如果文本宽度超过可用宽度，则认为文本显示不全
            if (textWidth > buttonWidth) {
              hasTextOverflow = true;
            }
          }
        }

        if (isOverflowing || hasTextOverflow) {
          buttonIssues.push({
            id: button.id || `button-${index}`,
            position: { x: rect.left, y: rect.top },
            size: { width: rect.width, height: rect.height },
            textContent: actualTextContent || textContent,
            isOverflowing,
            hasTextOverflow,
            containerWidth: containerDimensions.width,
            rightEdge: rect.right,
            // 文本溢出相关信息
            textWidth: textWidth,
            buttonWidth: buttonWidth,
          });
        }
      });

      // 2. 检测按钮边框边缘问题
      // 检查按钮的padding是否小于border-radius，如果是则说明边框边缘检测错误
      const allButtonElements = document.querySelectorAll('[data-element-type="button"]');

      allButtonElements.forEach((buttonElement, index) => {
        const buttonStyle = window.getComputedStyle(buttonElement);

        // 获取padding值
        const paddingLeft = parseFloat(buttonStyle.paddingLeft) || 0;
        const paddingRight = parseFloat(buttonStyle.paddingRight) || 0;
        const paddingTop = parseFloat(buttonStyle.paddingTop) || 0;
        const paddingBottom = parseFloat(buttonStyle.paddingBottom) || 0;

        // 获取border-radius值
        const borderRadius = parseFloat(buttonStyle.borderRadius) || 0;

        const problematicPaddings = [];

        // 垂直方向：只有当文字靠近上下边缘时，才会被圆角遮挡
        const verticalRisk = Math.min(paddingTop, paddingBottom) * 2 < borderRadius;

        // 水平方向：只有当文字靠近左右边缘时，才会被圆角遮挡  
        const horizontalRisk = Math.min(paddingLeft, paddingRight) * 2 < borderRadius;

        // 只有两个方向都存在风险时，才可能真正遮挡
        if (verticalRisk && horizontalRisk) {
          problematicPaddings.push({
            name: 'padding',
            value: Math.min(paddingTop, paddingBottom, paddingLeft, paddingRight),
            borderRadius: borderRadius
          });
          buttonBorderIssues.push({
            id: buttonElement.id || `button-${index}`,
            problematicPaddings: problematicPaddings
          });
        }
      });

      // 3. 检测文本元素折行问题
      const textElements = document.querySelectorAll('[data-element-type="text"]');

      textElements.forEach((textElement, index) => {
        // 查找最近的带有 data-element-type="layout" 的父级容器
        let layoutParent = textElement.parentElement;
        while (layoutParent && layoutParent.getAttribute('data-element-type') !== 'layout') {
          layoutParent = layoutParent.parentElement;
        }

        // 如果找到了布局父级容器，检查其 flex-direction
        let shouldCheckWrap = false;
        let flexDirection = '';

        if (layoutParent) {
          const layoutStyle = window.getComputedStyle(layoutParent);
          flexDirection = layoutStyle.flexDirection || '';

          // 只有当 flex-direction 是 row 时才检查被迫换行
          shouldCheckWrap = flexDirection === 'row';
        }

        if (shouldCheckWrap) {
          const pTags = textElement.querySelectorAll('p');

          pTags.forEach((pTag, pIndex) => {
            const rect = pTag.getBoundingClientRect();
            const computedStyle = window.getComputedStyle(pTag);
            const textContent = pTag.textContent.trim();

            if (textContent.length > 0) {
              // 获取字体大小
              const fontSize = parseFloat(computedStyle.fontSize) || 16;

              // 计算单行文本的理论宽度
              let theoreticalWidth = 0;
              for (let char of textContent) {
                if (/[\u4e00-\u9fa5]/.test(char)) {
                  // 中文字符
                  theoreticalWidth += fontSize;
                } else {
                  // 英文字符和数字
                  theoreticalWidth += fontSize * 0.6;
                }
              }

              // 获取实际行高和元素高度
              const lineHeight = parseFloat(computedStyle.lineHeight) || fontSize * 1.2;
              const actualHeight = rect.height;

              // 计算实际行数（考虑padding）
              const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
              const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;
              const contentHeight = actualHeight - paddingTop - paddingBottom;
              const actualLines = Math.round(contentHeight / lineHeight);

              // 如果实际行数大于1，且理论宽度超过容器宽度，则认为是被迫折行
              const containerWidth = rect.width;
              const isWrapped = actualLines > 1 && theoreticalWidth > containerWidth;

              if (isWrapped) {
                textWrapIssues.push({
                  id: textElement.id || `text-${index}-p-${pIndex}`,
                  position: { x: rect.left, y: rect.top },
                  size: { width: rect.width, height: rect.height },
                  textContent: textContent.slice(0, 100), // 限制长度
                  theoreticalWidth,
                  containerWidth,
                  actualLines,
                  lineHeight,
                  fontSize,
                  isWrapped: true,
                  // 添加布局信息用于调试
                  layoutParentId: layoutParent ? layoutParent.id : null,
                  flexDirection: flexDirection
                });
              }
            }
          });
        }
      });

      // 3. WCAG颜色对比度检测
      const wcagResults = [];

      // 获取页面背景色：root元素下第一个data-element-type="layout"的background-color
      let pageBackgroundColor = null;
      const rootElement = document.getElementById('root');
      if (rootElement) {
        const firstLayoutChild = rootElement.querySelector('[data-element-type="layout"]');
        if (firstLayoutChild) {
          const layoutStyle = window.getComputedStyle(firstLayoutChild);
          pageBackgroundColor = parseColor(layoutStyle.backgroundColor);
        }
      }

      // 如果没有找到页面背景色，使用默认白色
      if (!pageBackgroundColor) {
        pageBackgroundColor = { r: 255, g: 255, b: 255 };
      }

      // 检查1：正文文字 vs 页面背景（要求：≥4.5:1）
      const wcagTextElements = document.querySelectorAll('[data-element-type="text"]');
      const textColors = [];

      wcagTextElements.forEach((textElement, index) => {
        const textStyle = window.getComputedStyle(textElement);
        const textColor = parseColor(textStyle.color);

        // 避免重复检查相同的颜色
        const colorKey = `${textColor.r}-${textColor.g}-${textColor.b}`;
        if (!textColors.find(item => item.key === colorKey)) {
          textColors.push({ key: colorKey, color: textColor, element: textElement });

          const contrastRatio = calculateContrastRatio(textColor, pageBackgroundColor);
          const evaluation = evaluateWCAGCompliance(contrastRatio, 'text');

          wcagResults.push({
            type: 'text-background',
            description: '正文文字 vs 页面背景',
            foregroundColor: textColor,
            backgroundColor: pageBackgroundColor,
            contrastRatio: contrastRatio,
            evaluation: evaluation,
            elementId: textElement.id || `text-${index}`,
            requirement: '≥4.5:1 (AA级)',
            passed: evaluation.aa
          });

        }
      });

      // 检查2：按钮文字 vs 按钮背景（要求：≥4.5:1）
      const buttonElements = document.querySelectorAll('[data-element-type="button"]');

      buttonElements.forEach((buttonElement, index) => {
        const buttonStyle = window.getComputedStyle(buttonElement);
        const buttonTextColor = parseColor(buttonStyle.color);
        const buttonBackgroundColor = parseGradientColors(buttonStyle.background);

        const contrastRatio = calculateContrastRatio(buttonTextColor, buttonBackgroundColor);

        const evaluation = evaluateWCAGCompliance(contrastRatio, 'text');


        wcagResults.push({
          type: 'button-text-background',
          description: '按钮文字 vs 按钮背景',
          foregroundColor: buttonTextColor,
          backgroundColor: buttonBackgroundColor,
          contrastRatio: contrastRatio,
          evaluation: evaluation,
          elementId: buttonElement.id || `button-${index}`,
          requirement: '≥4.5:1 (AA级)',
          passed: evaluation.aa
        });
      });

      // 检查3：按钮背景 vs 页面背景（要求：≥3:1，UI组件）
      buttonElements.forEach((buttonElement, index) => {
        const buttonStyle = window.getComputedStyle(buttonElement);
        const buttonBackgroundColor = parseColor(buttonStyle.backgroundColor);

        const contrastRatio = calculateContrastRatio(buttonBackgroundColor, pageBackgroundColor);
        const evaluation = evaluateWCAGCompliance(contrastRatio, 'ui');

        wcagResults.push({
          type: 'button-background-page',
          description: '按钮背景 vs 页面背景',
          foregroundColor: buttonBackgroundColor,
          backgroundColor: pageBackgroundColor,
          contrastRatio: contrastRatio,
          evaluation: evaluation,
          elementId: buttonElement.id || `button-${index}`,
          requirement: '≥3:1 (UI组件)',
          passed: evaluation.aa
        });
      });

      // 计算WCAG总体评分
      const totalChecks = wcagResults.length;
      const passedChecks = wcagResults.filter(result => result.passed).length;
      const wcagScore = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 100;

      // 确定评分等级
      let wcagGrade = '';
      if (wcagScore >= 90) {
        wcagGrade = '优秀';
      } else if (wcagScore >= 80) {
        wcagGrade = '良好';
      } else if (wcagScore >= 60) {
        wcagGrade = '一般';
      } else {
        wcagGrade = '较差';
      }

      const wcagSummary = {
        score: wcagScore,
        grade: wcagGrade,
        totalChecks: totalChecks,
        passedChecks: passedChecks,
        failedChecks: totalChecks - passedChecks,
        results: wcagResults,
        pageBackgroundColor: pageBackgroundColor
      };

      return {
        buttonIssues,
        textWrapIssues,
        buttonBorderIssues,
        wcagSummary
      };
    }, dimensions);

    return styleIssues;
  } catch (error) {
    console.error('检测元素样式问题时出错:', error);
    return { buttonIssues: [], textWrapIssues: [], buttonBorderIssues: [] };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * 异步记录元素样式错误
 * @param {string} markdown - 原始markdown内容
 * @param {string|null} seed - 种子值
 * @param {Object} eightElement - 八要素结构
 * @param {Object} dimensions - 容器尺寸
 */
export async function logElementStyleErrors(markdown, seed, eightElement, dimensions = { width: 1024, height: 768 }) {
  try {
    console.log('开始异步检测元素样式问题...');

    // 渲染HTML
    const { html } = renderEightElementToHtml(eightElement, dimensions);

    // 检测各种元素样式问题
    const styleIssues = await detectElementStyleIssues(html, dimensions);
    const { buttonIssues = [], textWrapIssues = [], buttonBorderIssues = [], wcagSummary = null } = styleIssues || {};

    const totalIssues = buttonIssues.length + textWrapIssues.length + buttonBorderIssues.length;

    // 读取当天日志数据
    const logData = readLogData();

    // 增加错误计数
    logData.buttonStyleError += buttonIssues.length;
    logData.textWrapError += textWrapIssues.length;
    logData.buttonBorderError += buttonBorderIssues.length;

    // 记录WCAG对比度不合格的数量
    if (wcagSummary) {
      logData.wcagContrastError += wcagSummary.failedChecks;
    }

    // 添加详细日志条目
    const logEntry = {
      timestamp: new Date().toISOString(),
      seed: seed || null,
      dimensions,
      markdownHash: Buffer.from(markdown).toString('base64').slice(0, 32), // 生成markdown的短哈希
      buttonIssues: buttonIssues.map(issue => ({
        id: issue.id,
        textContent: issue.textContent.slice(0, 50), // 限制文本长度
        isOverflowing: issue.isOverflowing,
        hasTextOverflow: issue.hasTextOverflow,
        position: issue.position,
        size: issue.size,
        containerWidth: issue.containerWidth,
        rightEdge: issue.rightEdge,
        textWidth: issue.textWidth,
        buttonWidth: issue.buttonWidth
      })),
      textWrapIssues: textWrapIssues.map(issue => ({
        id: issue.id,
        textContent: issue.textContent,
        position: issue.position,
        size: issue.size,
        theoreticalWidth: issue.theoreticalWidth,
        containerWidth: issue.containerWidth,
        actualLines: issue.actualLines,
        lineHeight: issue.lineHeight,
        fontSize: issue.fontSize,
        isWrapped: issue.isWrapped,
        layoutParentId: issue.layoutParentId,
        flexDirection: issue.flexDirection
      })),
      buttonBorderIssues: buttonBorderIssues.map(issue => ({
        id: issue.id,
        position: issue.position,
        size: issue.size,
        borderRadius: issue.borderRadius,
        paddingValues: issue.paddingValues,
        problematicPaddings: issue.problematicPaddings,
        errorDescription: issue.errorDescription,
        hasBorderError: issue.hasBorderError
      })),
      wcagSummary: wcagSummary ? {
        score: wcagSummary.score,
        grade: wcagSummary.grade,
        totalChecks: wcagSummary.totalChecks,
        passedChecks: wcagSummary.passedChecks,
        failedChecks: wcagSummary.failedChecks,
        pageBackgroundColor: wcagSummary.pageBackgroundColor,
        results: wcagSummary.results.map(result => ({
          type: result.type,
          description: result.description,
          contrastRatio: Math.round(result.contrastRatio * 100) / 100, // 保留2位小数
          level: result.evaluation.level,
          passed: result.passed,
          requirement: result.requirement,
          elementId: result.elementId
        }))
      } : null,
      issueCount: {
        button: buttonIssues.length,
        textWrap: textWrapIssues.length,
        buttonBorder: buttonBorderIssues.length,
        wcagFailed: wcagSummary ? wcagSummary.failedChecks : 0,
        total: totalIssues + (wcagSummary ? wcagSummary.failedChecks : 0)
      }
    };

    logData.logs.push(logEntry);

    // 保持日志条目数量在合理范围内（最多保留5000条）
    if (logData.logs.length > 5000) {
      logData.logs = logData.logs.slice(-5000);
    }

    // 写入今天日志文件
    writeLogData(logData);

    const wcagInfo = wcagSummary ? `, WCAG对比度: ${wcagSummary.score}分(${wcagSummary.grade})` : '';
    console.log(`检测到 ${totalIssues} 个元素样式问题（按钮: ${buttonIssues.length}, 文本折行: ${textWrapIssues.length}, 按钮边框: ${buttonBorderIssues.length}${wcagInfo}），已记录到日志`);

  } catch (error) {
    console.error('记录元素样式错误时出错:', error);
  }
}

// 读取历史日志的辅助
function getHistoryLogData(dateStr) {
  const logFile = path.join(LOG_DIR, `style-errors-${dateStr}.json`);
  try {
    if (fs.existsSync(logFile)) {
      const data = fs.readFileSync(logFile, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.warn(`读取 ${dateStr} 日志文件失败:`, error);
  }
  return null;
}

// 读取日志的错误状态，默认 7 天
export function getLogStatistics(days = 7) {
  const stats = {
    totalErrors: 0,
    // buttonErrors: 0,
    // textWrapErrors: 0,
    buttonBorderErrors: 0,
    wcagErrors: 0,
    dailyStats: []
  };

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    const dayData = getHistoryLogData(dateStr);

    console.log('dayData', dayData)
    if (dayData) {
      
      // stats.buttonErrors += dayData.buttonStyleError;
      // stats.textWrapErrors += dayData.textWrapError;
      stats.buttonBorderErrors += dayData.buttonBorderError;
      stats.wcagErrors += dayData.wcagContrastError;
      stats.totalErrors += dayData.buttonBorderError + dayData.wcagContrastError;
      // stats.totalErrors += dayData.buttonStyleError + dayData.textWrapError + dayData.buttonBorderError + dayData.wcagContrastError;

      stats.dailyStats.push({
        date: dateStr,
        totalLogs: dayData.logs.length,
        // buttonStyleError: dayData.buttonStyleError,
        // textWrapError: dayData.textWrapError,
        buttonBorderError: dayData.buttonBorderError,
        wcagContrastError: dayData.wcagContrastError,
        wcagScore: dayData.logs.map(log => log.wcagSummary.score),
        wcagGrade: dayData.logs.map(log => log.wcagSummary.grade),
        wcagResults: dayData.logs.map(log => log.wcagSummary.results)
      });
    }
  }

  return stats;
}



export default {
  logElementStyleErrors,
  getLogStatistics
}; 