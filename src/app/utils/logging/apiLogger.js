/**
 * API 请求日志记录器
 * 记录所有 POST 请求的详细信息到文件
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 日志文件路径
const LOG_DIR = path.join(process.cwd(), 'logs');
const LOG_FILE = path.join(LOG_DIR, 'api-requests.log');

// 确保日志目录存在
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

/**
 * 格式化日志条目
 */
function formatLogEntry(data) {
  const timestamp = new Date().toISOString();
  const separator = '='.repeat(80);
  
  let entry = `\n${separator}\n`;
  entry += `[${timestamp}] ${data.method} ${data.path}\n`;
  entry += `${separator}\n`;
  
  // 请求信息
  entry += `📥 REQUEST:\n`;
  entry += `  - Origin: ${data.origin || 'none'}\n`;
  entry += `  - Referer: ${data.referer || 'none'}\n`;
  entry += `  - User-Agent: ${data.userAgent ? data.userAgent.substring(0, 100) : 'none'}\n`;
  
  // 请求参数（截断过长的内容）
  if (data.body) {
    const bodyStr = JSON.stringify(data.body, null, 2);
    const truncated = bodyStr.length > 2000 ? bodyStr.substring(0, 2000) + '\n  ... (truncated)' : bodyStr;
    entry += `  - Body: ${truncated}\n`;
  }
  
  // 响应信息
  entry += `\n📤 RESPONSE:\n`;
  entry += `  - Status: ${data.status}\n`;
  entry += `  - Duration: ${data.duration}ms\n`;
  
  if (data.response) {
    const responseStr = JSON.stringify(data.response, null, 2);
    const truncated = responseStr.length > 2000 ? responseStr.substring(0, 2000) + '\n  ... (truncated)' : responseStr;
    entry += `  - Data: ${truncated}\n`;
  }
  
  // 错误信息
  if (data.error) {
    entry += `\n❌ ERROR:\n`;
    entry += `  - Message: ${data.error.message}\n`;
    if (data.error.stack) {
      entry += `  - Stack: ${data.error.stack}\n`;
    }
  }
  
  entry += `${separator}\n`;
  
  return entry;
}

/**
 * 异步写入日志（不阻塞主流程）
 */
function writeLog(entry) {
  setImmediate(() => {
    try {
      fs.appendFileSync(LOG_FILE, entry, 'utf8');
    } catch (err) {
      console.error('写入日志失败:', err.message);
    }
  });
}

/**
 * 记录 API 请求
 */
export function logAPIRequest(data) {
  try {
    const entry = formatLogEntry(data);
    writeLog(entry);
  } catch (err) {
    console.error('格式化日志失败:', err.message);
  }
}

/**
 * 清理旧日志（保留最近 7 天）
 */
export function cleanOldLogs() {
  try {
    const stats = fs.statSync(LOG_FILE);
    const fileAgeInDays = (Date.now() - stats.mtimeMs) / (1000 * 60 * 60 * 24);
    
    if (fileAgeInDays > 7) {
      // 备份旧日志
      const backupFile = LOG_FILE.replace('.log', `-${new Date().toISOString().split('T')[0]}.log`);
      fs.renameSync(LOG_FILE, backupFile);
      console.log(`旧日志已备份到: ${backupFile}`);
    }
  } catch (err) {
    // 文件不存在或其他错误，忽略
  }
}

/**
 * 获取最近的日志条目（用于调试）
 */
export function getRecentLogs(lines = 50) {
  try {
    const content = fs.readFileSync(LOG_FILE, 'utf8');
    const entries = content.split('='.repeat(80));
    return entries.slice(-lines).join('='.repeat(80));
  } catch (err) {
    return '日志文件不存在';
  }
}
