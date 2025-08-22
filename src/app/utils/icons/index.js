// 图标主导出文件
import AbstractIcons from './Abstract/index.js';
import AnimalsIcons from './Animals/index.js';
import ArrowsIcons from './Arrows/index.js';
import BabyIcons from './Baby/index.js';
import BaseIcons from './Base/index.js';
import BrandIcons from './Brand/index.js';
import BuildIcons from './Build/index.js';
import CharacterIcons from './Character/index.js';
import ChartsIcons from './Charts/index.js';
import ClothesIcons from './Clothes/index.js';
import CommunicateIcons from './Communicate/index.js';
import ComponentsIcons from './Components/index.js';
import ConnectIcons from './Connect/index.js';
import ConstellationIcons from './Constellation/index.js';
import DatasIcons from './Datas/index.js';
import EditIcons from './Edit/index.js';
import EmojiIcons from './Emoji/index.js';
import EnergyIcons from './Energy/index.js';
import FoodsIcons from './Foods/index.js';
import GameIcons from './Game/index.js';
import GraphicsIcons from './Graphics/index.js';
import HandsIcons from './Hands/index.js';
import HardwareIcons from './Hardware/index.js';
import HealthIcons from './Health/index.js';
import IndustryIcons from './Industry/index.js';
import LifeIcons from './Life/index.js';
import MakeupsIcons from './Makeups/index.js';
import MeasurementIcons from './Measurement/index.js';
import MoneyIcons from './Money/index.js';
import MusicIcons from './Music/index.js';
import OfficeIcons from './Office/index.js';
import OperateIcons from './Operate/index.js';
import OthersIcons from './Others/index.js';
import PeoplesIcons from './Peoples/index.js';
import SafeIcons from './Safe/index.js';
import SportsIcons from './Sports/index.js';
import TimeIcons from './Time/index.js';
import TravelIcons from './Travel/index.js';
import WeatherIcons from './Weather/index.js';

// 创建图标查找对象
export const iconMap = {
  'Abstract': AbstractIcons,
  'Animals': AnimalsIcons,
  'Arrows': ArrowsIcons,
  'Baby': BabyIcons,
  'Base': BaseIcons,
  'Brand': BrandIcons,
  'Build': BuildIcons,
  'Character': CharacterIcons,
  'Charts': ChartsIcons,
  'Clothes': ClothesIcons,
  'Communicate': CommunicateIcons,
  'Components': ComponentsIcons,
  'Connect': ConnectIcons,
  'Constellation': ConstellationIcons,
  'Datas': DatasIcons,
  'Edit': EditIcons,
  'Emoji': EmojiIcons,
  'Energy': EnergyIcons,
  'Foods': FoodsIcons,
  'Game': GameIcons,
  'Graphics': GraphicsIcons,
  'Hands': HandsIcons,
  'Hardware': HardwareIcons,
  'Health': HealthIcons,
  'Industry': IndustryIcons,
  'Life': LifeIcons,
  'Makeups': MakeupsIcons,
  'Measurement': MeasurementIcons,
  'Money': MoneyIcons,
  'Music': MusicIcons,
  'Office': OfficeIcons,
  'Operate': OperateIcons,
  'Others': OthersIcons,
  'Peoples': PeoplesIcons,
  'Safe': SafeIcons,
  'Sports': SportsIcons,
  'Time': TimeIcons,
  'Travel': TravelIcons,
  'Weather': WeatherIcons,
};

// 根据路径查找图标
export function getIcon(iconPath) {
  const [category, iconName] = iconPath.split('/');
  
  if (!iconMap[category]) {
    console.warn(`图标分类 '${category}' 不存在`);
    return null;
  }
  
  // 将连字符格式转换为驼峰格式
  const camelCaseIconName = iconName.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
  
  const icon = iconMap[category][camelCaseIconName];
  
  if (!icon) {
    console.warn(`图标 '${category}/${iconName}' 不存在`);
    return null;
  }
  
  return icon;
}

// 渲染图标HTML
export function renderIcon(iconPath, className = '', style = '') {
  const iconSvg = getIcon(iconPath);
  
  if (!iconSvg) {
    return `<span class="icon-missing">[图标缺失: ${iconPath}]</span>`;
  }
  
  // 如果有类名或样式，添加到SVG标签中
  if (className || style) {
    const classAttr = className ? ` class="${className}"` : '';
    const styleAttr = style ? ` style="${style}"` : '';
    
    return iconSvg.replace('<svg', `<svg${classAttr}${styleAttr}`);
  }
  
  return iconSvg;
}

// 导出所有分类的图标
export { default as AbstractIcons } from './Abstract/index.js';
export { default as AnimalsIcons } from './Animals/index.js';
export { default as ArrowsIcons } from './Arrows/index.js';
export { default as BabyIcons } from './Baby/index.js';
export { default as BaseIcons } from './Base/index.js';
export { default as BrandIcons } from './Brand/index.js';
export { default as BuildIcons } from './Build/index.js';
export { default as CharacterIcons } from './Character/index.js';
export { default as ChartsIcons } from './Charts/index.js';
export { default as ClothesIcons } from './Clothes/index.js';
export { default as CommunicateIcons } from './Communicate/index.js';
export { default as ComponentsIcons } from './Components/index.js';
export { default as ConnectIcons } from './Connect/index.js';
export { default as ConstellationIcons } from './Constellation/index.js';
export { default as DatasIcons } from './Datas/index.js';
export { default as EditIcons } from './Edit/index.js';
export { default as EmojiIcons } from './Emoji/index.js';
export { default as EnergyIcons } from './Energy/index.js';
export { default as FoodsIcons } from './Foods/index.js';
export { default as GameIcons } from './Game/index.js';
export { default as GraphicsIcons } from './Graphics/index.js';
export { default as HandsIcons } from './Hands/index.js';
export { default as HardwareIcons } from './Hardware/index.js';
export { default as HealthIcons } from './Health/index.js';
export { default as IndustryIcons } from './Industry/index.js';
export { default as LifeIcons } from './Life/index.js';
export { default as MakeupsIcons } from './Makeups/index.js';
export { default as MeasurementIcons } from './Measurement/index.js';
export { default as MoneyIcons } from './Money/index.js';
export { default as MusicIcons } from './Music/index.js';
export { default as OfficeIcons } from './Office/index.js';
export { default as OperateIcons } from './Operate/index.js';
export { default as OthersIcons } from './Others/index.js';
export { default as PeoplesIcons } from './Peoples/index.js';
export { default as SafeIcons } from './Safe/index.js';
export { default as SportsIcons } from './Sports/index.js';
export { default as TimeIcons } from './Time/index.js';
export { default as TravelIcons } from './Travel/index.js';
export { default as WeatherIcons } from './Weather/index.js';
