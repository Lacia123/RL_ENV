import { NATIVE_EVENT_KEY } from './eventConfig.js';

/**
 * Validates and creates a native event configuration object.
 * @param {string} nativeKey - The native event key (e.g., 'click').
 * @param {string} dataKey - The data key to bind.
 * @returns {Object|null} The event configuration object or null if invalid.
 */
export function createNativeEventConfig(nativeKey, dataKey) {
    const validNativeKeys = Object.values(NATIVE_EVENT_KEY);

    if (validNativeKeys.includes(nativeKey)) {
        return {
            nativeEventKey: nativeKey,
            dataEventKey: dataKey
        };
    } else {
        console.warn(`⚠️ 无效的 nativeEventKey: ${nativeKey}`);
        return null;
    }
}
