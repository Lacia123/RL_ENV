import { Marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js';
import markedKatex from 'marked-katex-extension';

class MarkedSingleton {
  constructor() {
    if (!MarkedSingleton.instance) {
      const katexOptions = {
        throwOnError: false,
      };

      const markedInstance = new Marked(
        markedHighlight({
          async: false,
          langPrefix: 'hljs language-',
          highlight(code, lang) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
          }
        })
      );
      markedInstance.use(markedKatex(katexOptions));

      MarkedSingleton.instance = markedInstance;
    }
  }

  getInstance() {
    return MarkedSingleton.instance;
  }
}

const markedSingleton = new MarkedSingleton();

const getMarkedInstance = () => markedSingleton.getInstance();

// 改进UUID生成，确保更唯一
function generateUUID() {
    return 'dd-' + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// HTML转义函数，用于安全处理文本
function escapeHtml(text) {
    if (!text || typeof text !== 'string') return '';

    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// 检测处理后HTML中的KaTeX类
function detectMathInHTML(htmlContent) {
    if (!htmlContent) return { hasInline: false, hasBlock: false };

    // 检测行内公式（katex类但不是katex-display）
    const hasInlineHTML = htmlContent.includes('class="katex"') &&
        !htmlContent.includes('class="katex-display"');

    // 检测块级公式
    const hasBlockHTML = htmlContent.includes('class="katex-display"');

    return {
        hasInline: hasInlineHTML,
        hasBlock: hasBlockHTML
    };
}

// 🆕 应用自定义样式覆盖
function applyCustomStyleOverride(baseStyle, customStyles, customVariant) {
    if (!customStyles) {
        return baseStyle;
    }

    // 创建样式副本并应用覆盖
    const overriddenStyle = { ...baseStyle };

    Object.entries(customStyles).forEach(([property, value]) => {
        overriddenStyle[property] = value;
    });

    return overriddenStyle;
}


export {
    generateUUID,
    escapeHtml,
    detectMathInHTML,
    applyCustomStyleOverride,
    getMarkedInstance
}