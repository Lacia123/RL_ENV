import axios from 'axios'

class AIMClient {
    constructor(baseURL = 'http://localhost:8888') {
        this.client = axios.create({
            baseURL: baseURL,
            timeout: 300000000,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    /**
     * 评估图片质量
     * @param {string} imageBase64 - 图片的 base64 编码字符串
     * @param {string[]} metrics - 评估指标数组
     * @param {Object} options - 可选参数
     * @returns {Promise<Object>} API 响应结果
     */
    async evaluateImage(imageBase64, metrics = ["m1"], options = { save_results: true }) {
        try {
            const response = await this.client.post('/api/evaluate', {
                image: imageBase64,
                metrics: metrics,
                options: options
            });

            return response.data;
        } catch (error) {
            console.log('error', error);
            if (error.response) {
                // 服务器响应了错误状态码
                console.error('API 错误:', error.response.status, error.response.data);
                throw new Error(`API 错误: ${error.response.status} - ${error.response.data.message || error.response.statusText}`);
            } else if (error.request) {
                // 请求已发出但没有收到响应
                console.error('网络错误:', error.message);
                throw new Error('网络连接失败，请检查服务是否运行');
            } else {
                // 其他错误
                console.error('请求配置错误:', error.message);
                throw error;
            }
        }
    }

    /**
     * 检查服务是否可用
     */
    async checkHealth() {
        try {
            const response = await this.client.get('/health');
            return response.data;
        } catch (error) {
            console.error('健康检查失败:', error.message);
            return false;
        }
    }
}

// 简化的函数式接口
async function evaluateImage(imageBase64, metrics = ["m1"], options = { save_results: true }) {
    const client = new AIMClient();
    return await client.evaluateImage(imageBase64, metrics, options);
}

export {
    AIMClient,
    evaluateImage
}
