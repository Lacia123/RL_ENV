/**
 * generateTokensCommonJS.js
 * 设计令牌生成器测试文件 (CommonJS版本)
 * 可以直接在Node.js中运行: node generateTokensCommonJS.js
 */

// 使用CommonJS导入方式
let calculateTokens;
try {
  const module = require('./generateTokenBySeed.js');
  calculateTokens = module.calculateTokens;
} catch (err) {
  console.error('无法导入calculateTokens函数:', err);
  // 提供一个模拟实现，返回空对象，以便程序可以继续运行
  calculateTokens = () => ({ dimension: {}, color: { basic: {} } });
}

/**
 * 生成测试令牌并输出到控制台
 */
function runTokensTest() {
  console.log('=== 设计令牌生成器测试 ===');
  
  // 测试用例1: 默认平衡设置
  const defaultSeed = {
    shape: 5,      // 中等圆角和边框
    degree: 5,     // 中等间距
    font: 5,       // 中等字体大小和粗细
    material: 5,   // 中等阴影效果
    color: '#3366FF', // 蓝色基础色
  };
  
  console.log('\n测试用例1: 默认平衡设置');
  const defaultTokens = calculateTokens(defaultSeed);
  console.log('种子值:', defaultSeed);

  console.log('... defaultTokens')
  console.log(defaultTokens)


  printTokenSummary(defaultTokens);
  
  // 测试用例2: 圆润风格
  const roundedSeed = {
    shape: 8,      // 大圆角
    degree: 6,     // 略宽间距
    font: 5,       // 中等字体
    material: 7,   // 较重阴影
    color: '#7B61FF', // 紫色基础色
  };
  
  console.log('\n测试用例2: 圆润风格');
  const roundedTokens = calculateTokens(roundedSeed);
  console.log('种子值:', roundedSeed);
  printTokenSummary(roundedTokens);
  
  // 测试用例3: 方正风格
  const squareSeed = {
    shape: 2,      // 小圆角
    degree: 4,     // 较紧凑间距
    font: 4,       // 较小字体
    material: 3,   // 轻微阴影
    color: '#2D7FF9', // 亮蓝色基础色
  };
  
  console.log('\n测试用例3: 方正风格');
  const squareTokens = calculateTokens(squareSeed);
  console.log('种子值:', squareSeed);
  printTokenSummary(squareTokens);
  
  // 测试用例4: 活泼风格
  const livelySeed = {
    shape: 7,      // 较大圆角
    degree: 3,     // 紧凑间距
    font: 6,       // 较大字体
    material: 7,   // 较重阴影
    color: '#FF5757', // 红色基础色
  };
  
  console.log('\n测试用例4: 活泼风格');
  const livelyTokens = calculateTokens(livelySeed);
  console.log('种子值:', livelySeed);
  printTokenSummary(livelyTokens);
  
  // 测试用例5: 严谨风格
  const formalSeed = {
    shape: 3,      // 较小圆角
    degree: 7,     // 宽松间距
    font: 4,       // 较小字体
    material: 4,   // 中等阴影
    color: '#2C3E50', // 深蓝灰色基础色
  };
  
  console.log('\n测试用例5: 严谨风格');
  const formalTokens = calculateTokens(formalSeed);
  console.log('种子值:', formalSeed);
  printTokenSummary(formalTokens);
  
  // 只测试单个部分
  console.log('\n单独测试字体令牌:');
  const fontOnlyTokens = calculateTokens({ font: 8 });
  console.log('字体种子值: 8');
  if (fontOnlyTokens.dimension && fontOnlyTokens.dimension.font) {
    console.log('字体大小示例:');
    Object.entries(fontOnlyTokens.dimension.font.size).forEach(([name, token]) => {
      console.log(`- ${name}: ${token.value}`);
    });
  }

  console.log('\n单独测试颜色令牌:');
  const colorOnlyTokens = calculateTokens({ color: '#FF0000' });
  console.log('颜色种子值: #FF0000 (红色)');
  if (colorOnlyTokens.color && colorOnlyTokens.color.basic) {
    console.log('品牌色阶示例:');
    Object.entries(colorOnlyTokens.color.basic.brand).slice(0, 5).forEach(([shade, token]) => {
      console.log(`- 色阶 ${shade}: ${token.value}`);
    });
  }
  
  console.log('\n=== 测试完成 ===');
  
  // 返回生成的令牌，方便其他地方使用
  return {
    defaultTokens,
    roundedTokens,
    squareTokens,
    livelyTokens,
    formalTokens
  };
}

/**
 * 打印令牌摘要信息
 * @param {Object} tokens - 生成的令牌对象
 */
function printTokenSummary(tokens) {
  // 如果存在dimension令牌
  if (tokens.dimension) {
    // 打印边框圆角信息
    if (tokens.dimension.borderRadius) {
      console.log('边框圆角示例:');
      const radiusEntries = Object.entries(tokens.dimension.borderRadius);
      // 只打印部分示例
      for (let i = 0; i < Math.min(3, radiusEntries.length); i++) {
        const [name, token] = radiusEntries[i];
        console.log(`- ${name}: ${token.value}`);
      }
    }
    
    // 打印间距信息
    if (tokens.dimension.padding) {
      console.log('间距示例:');
      const paddingEntries = Object.entries(tokens.dimension.padding);
      // 只打印部分示例
      for (let i = 0; i < Math.min(3, paddingEntries.length); i++) {
        const [name, token] = paddingEntries[i];
        console.log(`- ${name}: ${token.value}`);
      }
    }
    
    // 打印字体信息
    if (tokens.dimension.font) {
      console.log('字体示例:');
      if (tokens.dimension.font.size) {
        const fontSizeEntries = Object.entries(tokens.dimension.font.size);
        // 只打印部分示例
        for (let i = 0; i < Math.min(3, fontSizeEntries.length); i++) {
          const [name, token] = fontSizeEntries[i];
          console.log(`- 字体大小 ${name}: ${token.value}`);
        }
      }
    }
  }
  
  // 如果存在颜色令牌
  if (tokens.color && tokens.color.basic) {
    console.log('颜色示例:');
    
    // 打印品牌色
    if (tokens.color.basic.brand) {
      console.log('- 品牌色: ', tokens.color.basic.brand[5]?.value || '未定义');
    }
    
    // 打印灰度色
    if (tokens.color.basic.grey) {
      console.log('- 灰度色: ', tokens.color.basic.grey[5]?.value || '未定义');
    }
  }
}

// 仅在直接运行此文件时执行测试
if (require.main === module) {
  runTokensTest();
}

// 导出测试函数，方便在其他地方使用
module.exports = {
  runTokensTest,
  generateDefaultTokens: function() {
    return calculateTokens({
      shape: 5,
      degree: 5,
      font: 5,
      material: 5,
      color: '#3366FF',
    });
  },
  generateCustomTokens: function(customSeed) {
    const defaultSeed = {
      shape: 5,
      degree: 5,
      font: 5,
      material: 5,
      color: '#3366FF',
    };
    return calculateTokens({ ...defaultSeed, ...customSeed });
  }
}; 