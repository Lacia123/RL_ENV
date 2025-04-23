/**
 * Token 解析器测试文件
 * 
 * 可以通过 Node.js 直接执行该文件: node tokenTest.js
 * 测试覆盖了 resolveToken 函数的各种情况，包括基本解析、嵌套解析、边界情况等
 */
import resolveToken from './resolveToken.js';
import { resolveTokensInText, isTokenReference } from './resolveToken.js';
import fs from 'fs';
import path from 'path';

// 测试工具函数 - 用不同颜色显示测试结果
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

// 测试计数器
let passedTests = 0;
let failedTests = 0;
let skippedTests = 0;

// 存储测试结果的数组，用于生成报告文件
const testResults = [];

/**
 * 运行一个测试并输出结果
 * @param {string} description - 测试描述
 * @param {Function} testFn - 测试函数，返回 true 表示通过，false 表示失败
 */
function test(description, testFn) {
  try {
    console.log(`\n${colors.white}运行测试: ${description}${colors.reset}`);
    const startTime = Date.now();
    const result = testFn();
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    let status, message;
    
    if (result === true) {
      status = 'PASS';
      message = '通过';
      console.log(`${colors.green}✓ 通过${colors.reset}`);
      passedTests++;
    } else if (result === false) {
      status = 'FAIL';
      message = '失败';
      console.log(`${colors.red}✗ 失败${colors.reset}`);
      failedTests++;
    } else {
      status = 'SKIP';
      message = '跳过';
      console.log(`${colors.yellow}⚠ 跳过${colors.reset}`);
      skippedTests++;
    }
    
    // 存储测试结果
    testResults.push({
      description,
      status,
      message,
      duration,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.log(`${colors.red}✗ 异常: ${error.message}${colors.reset}`);
    failedTests++;
    
    // 存储测试异常
    testResults.push({
      description,
      status: 'ERROR',
      message: `异常: ${error.message}`,
      error: error.stack,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * 断言函数 - 检查期望值与实际值是否相等
 * @param {any} actual - 实际值
 * @param {any} expected - 期望值
 * @param {string} [message] - 断言消息
 */
function assertEquals(actual, expected, message = '') {
  if (actual === expected) {
    return true;
  }
  
  const failMessage = `断言失败${message ? ': ' + message : ''}`;
  console.log(`${colors.red}${failMessage}`);
  console.log(`  期望值: ${expected}`);
  console.log(`  实际值: ${actual}${colors.reset}`);
  
  // 记录最后一次测试的断言失败细节
  if (testResults.length > 0) {
    const lastTest = testResults[testResults.length - 1];
    lastTest.assertionDetails = {
      expected,
      actual,
      message: failMessage
    };
  }
  
  return false;
}

/**
 * 生成测试报告文件
 */
function generateTestReport() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportFileName = `token-test-report-${timestamp}.html`;
  const reportFilePath = path.join(process.cwd(), reportFileName);
  
  // 生成HTML报告
  const htmlReport = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Token 系统测试报告</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    h1, h2 {
      color: #2c3e50;
    }
    .summary {
      display: flex;
      justify-content: space-around;
      background-color: #f8f9fa;
      padding: 15px;
      border-radius: 5px;
      margin-bottom: 20px;
    }
    .summary-item {
      text-align: center;
    }
    .summary-value {
      font-size: 24px;
      font-weight: bold;
    }
    .test-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    .test-table th, .test-table td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }
    .test-table th {
      background-color: #f2f2f2;
    }
    .test-table tr:nth-child(even) {
      background-color: #f9f9f9;
    }
    .test-table tr:hover {
      background-color: #f1f1f1;
    }
    .status {
      font-weight: bold;
    }
    .pass {
      color: #28a745;
    }
    .fail {
      color: #dc3545;
    }
    .skip {
      color: #ffc107;
    }
    .error {
      color: #9c27b0;
    }
    .details {
      background-color: #f8f9fa;
      border-left: 4px solid #dee2e6;
      padding: 10px;
      margin-top: 10px;
      font-family: monospace;
      white-space: pre-wrap;
    }
    .timestamp {
      color: #6c757d;
      font-size: 0.85em;
    }
  </style>
</head>
<body>
  <h1>Token 系统测试报告</h1>
  <p class="timestamp">生成时间: ${new Date().toLocaleString()}</p>
  
  <div class="summary">
    <div class="summary-item">
      <div class="summary-value pass">${passedTests}</div>
      <div>通过</div>
    </div>
    <div class="summary-item">
      <div class="summary-value fail">${failedTests}</div>
      <div>失败</div>
    </div>
    <div class="summary-item">
      <div class="summary-value skip">${skippedTests}</div>
      <div>跳过</div>
    </div>
    <div class="summary-item">
      <div class="summary-value">${testResults.length}</div>
      <div>总计</div>
    </div>
  </div>
  
  <h2>测试详情</h2>
  <table class="test-table">
    <thead>
      <tr>
        <th>#</th>
        <th>测试描述</th>
        <th>状态</th>
        <th>执行时间</th>
        <th>详情</th>
      </tr>
    </thead>
    <tbody>
      ${testResults.map((test, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${test.description}</td>
          <td class="status ${test.status.toLowerCase()}">${test.message}</td>
          <td>${test.duration !== undefined ? `${test.duration}ms` : '-'}</td>
          <td>
            ${test.assertionDetails ? `
              <div class="details">
                预期值: ${test.assertionDetails.expected}
                实际值: ${test.assertionDetails.actual}
                ${test.assertionDetails.message ? `消息: ${test.assertionDetails.message}` : ''}
              </div>
            ` : ''}
            ${test.error ? `
              <div class="details">
                ${test.error}
              </div>
            ` : ''}
          </td>
        </tr>
      `).join('')}
    </tbody>
  </table>
</body>
</html>
  `;
  
  // 写入文件
  fs.writeFileSync(reportFilePath, htmlReport);
  
  return reportFilePath;
}

/**
 * 执行测试用例
 */
function runTests() {
  console.log(`${colors.cyan}==========================================`);
  console.log(`开始执行 Token 系统测试`);
  console.log(`==========================================${colors.reset}`);
  
  // 测试 1: 基本 token 解析
  test('解析基本 token', () => {
    const result = resolveToken('{color.basic.brand.5}');
    return assertEquals(result, '#615eec', '应该解析颜色 token');
  });
  
  // 测试 2: 嵌套 token 解析
  test('解析嵌套 token', () => {
    const result = resolveToken('{color.border.white7}');
    return assertEquals(result, '#ffffff12', '应该解析嵌套引用 token');
  });
  
  // 测试 3: 非 token 字符串
  test('处理非 token 字符串', () => {
    const result = resolveToken('not a token');
    return assertEquals(result, 'not a token', '应该原样返回非 token 字符串');
  });
  
  // 测试 4: 处理不存在的 token
  test('处理不存在的 token', () => {
    const result = resolveToken('{color.nonexistent.token}');
    return assertEquals(result, null, '应该返回 null 表示找不到 token');
  });
  
  // 测试 5: 尺寸类 token 解析
  test('解析尺寸类 token', () => {
    const result = resolveToken('{dimension.padding.base}');
    return assertEquals(result, '12px', '应该解析尺寸类 token');
  });
  
  // 测试 6: 嵌套尺寸类 token 解析
  test('解析嵌套尺寸类 token', () => {
    const result = resolveToken('{dimension.margin.loose}');
    // 期望值取决于您的实际配置，这里假设是 20px
    return assertEquals(result, '20px', '应该解析嵌套尺寸类 token');
  });
  
  // 测试 7: 字体类 token 解析
  test('解析字体类 token', () => {
    const result = resolveToken('{font.size.large}');
    // 期望值取决于您的实际配置
    // 可能需要调整期望值
    return result !== null;
  });
  
  // 测试 8: 动效类 token 解析
  test('解析动效类 token', () => {
    const result = resolveToken('{motion.duration.slowest}');
    // 期望值取决于您的实际配置
    // 可能需要调整期望值
    return result !== null;
  });
  
  // 测试 9: 测试 resolveTokensInText 函数
  test('解析文本中的所有 token 引用', () => {
    const text = '边框颜色: {color.border.white7}, 内边距: {dimension.padding.base}';
    const result = resolveTokensInText(text);
    const expected = '边框颜色: #ffffff12, 内边距: 12px';
    return assertEquals(result, expected, '应该替换文本中的所有 token 引用');
  });
  
  // 测试 10: 测试空引用处理
  test('处理空引用', () => {
    const result = resolveToken('{}');
    return assertEquals(result, null, '应该处理空引用');
  });
  
  // 测试 11: 测试深层嵌套引用
  test('处理多层嵌套引用', () => {
    // 假设存在三层嵌套: tokenA -> tokenB -> tokenC -> 值
    // 根据实际配置调整此测试
    const result = resolveToken('{color.border.white7}');
    return result !== null && result !== '{color.border.white7}';
  });
  
  // 测试 12: 测试 isTokenReference 函数
  test('检测 token 引用', () => {
    return assertEquals(isTokenReference('{color.border.white7}'), true)
        && assertEquals(isTokenReference('not a token'), false);
  });
  
  // 测试 13: 性能测试 - 解析大量 token
  test('性能测试 - 解析大量 token', () => {
    console.time('解析 1000 个 token');
    for (let i = 0; i < 1000; i++) {
      resolveToken('{color.border.white7}');
      resolveToken('{dimension.padding.base}');
    }
    console.timeEnd('解析 1000 个 token');
    return true;
  });
  
  // 打印测试结果摘要
  console.log(`\n${colors.cyan}==========================================`);
  console.log(`测试结果摘要`);
  console.log(`==========================================${colors.reset}`);
  console.log(`${colors.green}通过: ${passedTests}${colors.reset}`);
  console.log(`${colors.red}失败: ${failedTests}${colors.reset}`);
  console.log(`${colors.yellow}跳过: ${skippedTests}${colors.reset}`);
  console.log(`${colors.cyan}===========================================${colors.reset}`);
  
  // 生成测试报告
  const reportPath = generateTestReport();
  console.log(`\n${colors.cyan}测试报告已生成: ${reportPath}${colors.reset}`);
  
  return failedTests === 0;
}

// 执行测试
runTests();

// 如果测试失败，设置退出代码为非零
if (failedTests > 0) {
  process.exit(1);
} 