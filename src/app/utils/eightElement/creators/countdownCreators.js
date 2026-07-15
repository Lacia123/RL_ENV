import { generateUUID } from '../util.js';

/**
 * 检测是否为 countdown 标签
 * 匹配 <countdown target="..." format="...">label</countdown>
 * @param {string} line - 文本行
 * @returns {Object} 检测结果
 */
export function isCountdownTag(line) {
    // 匹配 <countdown target="..." format="...">label</countdown>
    // format 是可选的
    const countdownMatch = line.trim().match(/^<countdown\s+([^>]+)>(.*?)<\/countdown>$/);

    if (countdownMatch) {
        const attributesStr = countdownMatch[1].trim();
        const content = countdownMatch[2].trim();
        const attributes = parseAttributes(attributesStr);

        if (attributes.target) {
            return {
                isCountdownTag: true,
                target: attributes.target,
                format: attributes.format || '',
                content: content || ''
            };
        }
    }

    return { isCountdownTag: false };
}

/**
 * 解析属性字符串
 * @param {string} attributesStr - 属性字符串
 * @returns {Object} 属性对象
 */
function parseAttributes(attributesStr) {
    const attributes = {};
    if (!attributesStr) return attributes;

    // 匹配 key="value" 或 key='value'
    const attrRegex = /(\w+)=["']([^"']*)["']/g;
    let attrMatch;
    while ((attrMatch = attrRegex.exec(attributesStr)) !== null) {
        let value = attrMatch[2];
        value = value.replace(/`/g, '').trim();
        attributes[attrMatch[1]] = value;
    }

    return attributes;
}

/**
 * 创建 countdown 元素
 * @param {string} target - 目标时间
 * @param {Object} options - 选项
 * @param {string} options.format - 显示格式
 * @param {string} options.content - 标签文本
 * @returns {Object} 八要素结构
 */
export function createCountdownElement(target, options = {}) {
    const id = generateUUID();
    const format = options.format || '';
    const content = options.content || '';

    return {
        "id": id,
        "name": "countdown",
        "name-zh": "倒计时",
        "file-type": "cell-element",
        "layout": {
            "style": {
                "display": "{layout.state.display.flex}",
                "layoutMode": "{layout.direction.NONE}",
                "layoutWrap": "{layout.wrap.NO_WRAP}",
                "primaryAxisSizingMode": "{layout.sizing.AUTO}",
                "counterAxisSizingMode": "{layout.sizing.FIXED}",
                "primaryAxisAlignItems": "{layout.align.x.MIN}",
                "counterAxisAlignItems": "{layout.align.y.items.MIN}",
                "layoutAlign": "{layout.align.y.self.INHERIT}",
                "layoutGrow": "{layout.grow.0}"
            },
            "countdown": {
                "type": "container",
                "content": [
                    {
                        "element": "material",
                        "value": "countdown",
                        "prop": "default",
                        "token": "countdown"
                    }
                ],
                "resource": "",
                "data": [],
                "style": {
                    "display": "{layout.state.display.flex}",
                    "layoutMode": "{layout.direction.NONE}",
                    "layoutWrap": "{layout.wrap.NO_WRAP}",
                    "layoutAlign": "{layout.align.y.self.INHERIT}",
                    "layoutGrow": "{layout.grow.0}"
                },
                "children": []
            }
        },
        "material": {
            "countdown": {
                "default": {
                    "data-key": "",
                    "type": "countdown",
                    "target": target,
                    "format": format,
                    "content": content,
                    "style": {
                        "countdown": {
                            "value": target,
                            "type": "countdown",
                            "key": "material-countdown"
                        }
                    },
                    "resource": target
                }
            }
        }
    };
}
