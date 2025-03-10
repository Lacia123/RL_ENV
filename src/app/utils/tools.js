/**
 * 根据ID查找元素
 * @param {Object} root - 根元素
 * @param {string} id - 要查找的元素ID
 * @returns {Object|null} 找到的元素或null
 */
export const findElementById = (root, id) => {
    if (!root) return null;
    if (root.id === id) return root;

    if (root.children) {
        for (const child of root.children) {
            const found = findElementById(child, id);
            if (found) return found;
        }
    }

    return null;
}