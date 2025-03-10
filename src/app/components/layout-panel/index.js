'use client';
import LayoutPanel from './LayoutPanel';

export default LayoutPanel;

// Also export individual components for more flexible usage
export { default as SelectInput } from './inputs/SelectInput';
export { default as TextInput } from './inputs/TextInput';
export { default as ColorInput } from './inputs/ColorInput';
export { default as ConfigSection } from './config-sections/ConfigSection';
export { default as LayoutConfigSection } from './config-sections/LayoutConfigSection';
export { default as AppearanceConfigSection } from './config-sections/AppearanceConfigSection';
export { default as PresetSelector } from './management/PresetSelector';
export { default as AddComponentPanel } from './management/AddComponentPanel';
export { default as ElementActions } from './management/ElementActions';