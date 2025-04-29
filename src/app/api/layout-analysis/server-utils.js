import { layoutAnalysisAPI } from '../../utils/layoutAnalysisAPI.js';

/**
 * 直接在服务器端调用布局分析API的函数
 * 适用于服务器组件中使用
 * 
 * @param {Object} requestData 布局分析请求数据
 * @returns {Promise<Object>} 布局分析结果
 */
export async function evaluateLayoutOnServer(requestData) {
  try {
    if (!requestData || !requestData.actions) {
      throw new Error('无效的请求格式');
    }
    
    // 直接调用布局分析API
    const result = await layoutAnalysisAPI.evaluateLayout(requestData);
    return result;
  } catch (error) {
    console.error('布局分析服务器错误:', error);
    throw error;
  }
} 