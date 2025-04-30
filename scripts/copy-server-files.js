// 跨平台文件复制脚本
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前脚本目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 构建目录
const buildDir = path.join(rootDir, '.next');
console.log(`构建目录: ${buildDir}`);

// 确保server.js成功复制
try {
  // 1. 检查源文件是否存在
  const serverJsSource = path.join(rootDir, 'server.js');
  if (!fs.existsSync(serverJsSource)) {
    console.error(`错误：源server.js文件不存在: ${serverJsSource}`);
    process.exit(1);
  }
  
  // 2. 创建必要的目录
  fs.ensureDirSync(buildDir);
  fs.ensureDirSync(path.join(buildDir, 'utils'));

  // 3. 复制server.js到构建目录
  console.log(`复制 server.js 从 ${serverJsSource} 到 ${path.join(buildDir, 'server.js')}`);
  fs.copyFileSync(
    serverJsSource,
    path.join(buildDir, 'server.js')
  );
  
  // 4. 验证复制成功
  if (!fs.existsSync(path.join(buildDir, 'server.js'))) {
    console.error(`错误：server.js复制失败！`);
    process.exit(1);
  } else {
    console.log(`✅ server.js复制成功！`);
  }

  // 5. 复制utils目录到构建目录
  console.log('复制 utils 目录到构建目录...');
  fs.copySync(
    path.join(rootDir, 'src', 'app', 'utils'),
    path.join(buildDir, 'utils')
  );

  // 6. 复制next.config.js到构建目录
  console.log('复制 next.config.js 到构建目录...');
  fs.copySync(
    path.join(rootDir, 'next.config.js'),
    path.join(buildDir, 'next.config.js')
  );

  // 7. 在.next目录中创建package.json，指定type为module
  console.log('创建.next/package.json以确保ES模块支持...');
  const packageJson = {
    "type": "module",
    "dependencies": {}
  };

  // 8. 读取项目package.json以获取依赖版本
  const rootPackageJson = JSON.parse(fs.readFileSync(
    path.join(rootDir, 'package.json'),
    'utf8'
  ));

  // 9. 复制服务器运行所需的依赖项
  const requiredDeps = [
    'express', 'cors', 'body-parser', 'next', 
    'fs-extra', 'jsdom', 'playwright-chromium'
  ];

  for (const dep of requiredDeps) {
    if (rootPackageJson.dependencies[dep]) {
      packageJson.dependencies[dep] = rootPackageJson.dependencies[dep];
    }
  }

  fs.writeFileSync(
    path.join(buildDir, 'package.json'),
    JSON.stringify(packageJson, null, 2),
    'utf8'
  );

  // 创建启动指南
  console.log('创建部署指南...');
  const deployGuide = `
  # 部署指南

  构建已完成，请按照以下步骤部署应用：

  1. 将.next目录复制到目标服务器
  2. 在.next目录中运行：npm install --production
  3. 启动服务器：NODE_ENV=production node server.js (Linux/Mac)
     或者：set NODE_ENV=production&& node server.js (Windows)

  注意：确保服务器上安装了Node.js (版本16+)
  `;

  fs.writeFileSync(
    path.join(buildDir, 'DEPLOY.md'),
    deployGuide,
    'utf8'
  );

  console.log('文件复制完成！构建已准备就绪。');
} catch (error) {
  console.error(`构建脚本错误:`, error);
  process.exit(1);
}
