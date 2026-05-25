import { NATIVE_EVENT_KEY } from './eventConfig.js';

/**
 * Validates and creates a native event configuration object.
 * @param {string} nativeKey - The native event key (e.g., 'click').
 * @param {string} dataKey - The data key to bind.
 * @param {string} [raw] - 标签文本内容（如按钮文案）
 * @returns {Object|null} The event configuration object or null if invalid.
 */
export function createNativeEventConfig(nativeKey, dataKey, raw) {
    const validNativeKeys = Object.values(NATIVE_EVENT_KEY);

    if (validNativeKeys.includes(nativeKey)) {
        const config = {
            nativeEventKey: nativeKey,
            dataEventKey: dataKey
        };
        const rawText = raw != null ? String(raw).trim() : '';
        if (rawText) {
            config.raw = rawText;
        }
        return config;
    } else {
        console.warn(`⚠️ 无效的 nativeEventKey: ${nativeKey}`);
        return null;
    }
}
