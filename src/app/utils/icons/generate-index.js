import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 获取所有图标目录
function getIconDirectories(iconsPath) {
    return fs.readdirSync(iconsPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
}

// 读取SVG文件内容并转换为导出格式
function generateIndexForDirectory(dirPath, dirName) {
    const files = fs.readdirSync(dirPath)
        .filter(file => file.endsWith('.svg'));
    
    if (files.length === 0) {
        return;
    }

    let indexContent = `// ${dirName} 图标导出\n`;
    const exports = [];
    
    files.forEach(file => {
        const fileName = path.basename(file, '.svg');
        const svgPath = path.join(dirPath, file);
        const svgContent = fs.readFileSync(svgPath, 'utf8');
        
        // 清理SVG内容，移除换行符和多余空格
        const cleanSvgContent = svgContent
            .replace(/\n/g, '')
            .replace(/\s+/g, ' ')
            .trim();
        
        // 将连字符转换为驼峰命名
        let camelCaseName = fileName.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
        
        // 处理 JavaScript 保留字
        const reservedWords = [
            'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default',
            'delete', 'do', 'else', 'export', 'extends', 'finally', 'for', 'function',
            'if', 'import', 'in', 'instanceof', 'new', 'return', 'super', 'switch',
            'this', 'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'yield',
            'let', 'static', 'enum', 'implements', 'interface', 'package', 'private',
            'protected', 'public', 'abstract', 'boolean', 'byte', 'char', 'double',
            'final', 'float', 'goto', 'int', 'long', 'native', 'short', 'synchronized',
            'throws', 'transient', 'volatile'
        ];
        
        if (reservedWords.includes(camelCaseName.toLowerCase())) {
            camelCaseName = camelCaseName + 'Icon';
        }
        
        indexContent += `\nexport const ${camelCaseName} = \`${cleanSvgContent}\`;\n`;
        exports.push(camelCaseName);
    });
    
    // 添加默认导出，包含所有图标的对象
    indexContent += `\n// 默认导出包含所有图标的对象\n`;
    indexContent += `export default {\n`;
    exports.forEach(exportName => {
        indexContent += `  ${exportName},\n`;
    });
    indexContent += `};\n`;
    
    // 写入index.js文件
    const indexPath = path.join(dirPath, 'index.js');
    fs.writeFileSync(indexPath, indexContent, 'utf8');
    
    console.log(`✓ 已生成 ${dirName}/index.js (${files.length} 个图标)`);
    return { dirName, exports };
}

// 生成主index.js文件
function generateMainIndex(iconsPath, directoryExports) {
    let mainIndexContent = `// 图标主导出文件\n`;
    
    // 导入所有目录的图标
    directoryExports.forEach(({ dirName }) => {
        mainIndexContent += `import ${dirName}Icons from './${dirName}/index.js';\n`;
    });
    
    mainIndexContent += `\n// 创建图标查找对象\n`;
    mainIndexContent += `export const iconMap = {\n`;
    
    directoryExports.forEach(({ dirName }) => {
        mainIndexContent += `  '${dirName}': ${dirName}Icons,\n`;
    });
    
    mainIndexContent += `};\n\n`;
    
    // 添加图标查找函数
    mainIndexContent += `// 根据路径查找图标\n`;
    mainIndexContent += `export function getIcon(iconPath) {\n`;
    mainIndexContent += `  const [category, iconName] = iconPath.split('/');\n`;
    mainIndexContent += `  \n`;
    mainIndexContent += `  if (!iconMap[category]) {\n`;
    mainIndexContent += `    console.warn(\`图标分类 '\${category}' 不存在\`);\n`;
    mainIndexContent += `    return null;\n`;
    mainIndexContent += `  }\n`;
    mainIndexContent += `  \n`;
    mainIndexContent += `  // 将连字符格式转换为驼峰格式\n`;
    mainIndexContent += `  const camelCaseIconName = iconName.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());\n`;
    mainIndexContent += `  \n`;
    mainIndexContent += `  const icon = iconMap[category][camelCaseIconName];\n`;
    mainIndexContent += `  \n`;
    mainIndexContent += `  if (!icon) {\n`;
    mainIndexContent += `    console.warn(\`图标 '\${category}/\${iconName}' 不存在\`);\n`;
    mainIndexContent += `    return null;\n`;
    mainIndexContent += `  }\n`;
    mainIndexContent += `  \n`;
    mainIndexContent += `  return icon;\n`;
    mainIndexContent += `}\n\n`;
    
    // 添加便捷的图标渲染函数
    mainIndexContent += `// 渲染图标HTML\n`;
    mainIndexContent += `export function renderIcon(iconPath, className = '', style = '') {\n`;
    mainIndexContent += `  const iconSvg = getIcon(iconPath);\n`;
    mainIndexContent += `  \n`;
    mainIndexContent += `  if (!iconSvg) {\n`;
    mainIndexContent += `    return \`<span class="icon-missing">[图标缺失: \${iconPath}]</span>\`;\n`;
    mainIndexContent += `  }\n`;
    mainIndexContent += `  \n`;
    mainIndexContent += `  // 如果有类名或样式，添加到SVG标签中\n`;
    mainIndexContent += `  if (className || style) {\n`;
    mainIndexContent += `    const classAttr = className ? \` class="\${className}"\` : '';\n`;
    mainIndexContent += `    const styleAttr = style ? \` style="\${style}"\` : '';\n`;
    mainIndexContent += `    \n`;
    mainIndexContent += `    return iconSvg.replace('<svg', \`<svg\${classAttr}\${styleAttr}\`);\n`;
    mainIndexContent += `  }\n`;
    mainIndexContent += `  \n`;
    mainIndexContent += `  return iconSvg;\n`;
    mainIndexContent += `}\n\n`;
    
    // 导出所有图标对象
    mainIndexContent += `// 导出所有分类的图标\n`;
    directoryExports.forEach(({ dirName }) => {
        mainIndexContent += `export { default as ${dirName}Icons } from './${dirName}/index.js';\n`;
    });
    
    // 写入主index.js文件
    const mainIndexPath = path.join(iconsPath, 'index.js');
    fs.writeFileSync(mainIndexPath, mainIndexContent, 'utf8');
    
    console.log(`✓ 已生成主 index.js 文件`);
}

// 主函数
function main() {
    const iconsPath = __dirname;
    console.log(`开始处理图标目录: ${iconsPath}`);
    
    const directories = getIconDirectories(iconsPath);
    console.log(`找到 ${directories.length} 个图标目录:`, directories.join(', '));
    
    const directoryExports = [];
    
    // 为每个目录生成index.js
    directories.forEach(dirName => {
        const dirPath = path.join(iconsPath, dirName);
        const result = generateIndexForDirectory(dirPath, dirName);
        if (result) {
            directoryExports.push(result);
        }
    });
    
    // 生成主index.js文件
    generateMainIndex(iconsPath, directoryExports);
    
    console.log(`\n🎉 完成！共处理了 ${directoryExports.length} 个图标目录`);
    console.log(`\n使用示例:`);
    console.log(`import { getIcon, renderIcon } from './utils/icons/index.js';`);
    console.log(`const icon = getIcon('Abstract/ad-product'); // 获取SVG字符串`);
    console.log(`const html = renderIcon('Abstract/ad-product', 'my-icon-class'); // 获取带样式的HTML`);
}

// 如果直接运行此文件，执行主函数
if (import.meta.url.endsWith('generate-index.js')) {
    main();
}

export { main };
