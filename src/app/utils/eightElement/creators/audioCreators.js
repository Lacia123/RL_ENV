import { generateUUID } from '../util.js';

/**
 * 检测是否为 audio 标签
 * @param {string} line - 文本行
 * @returns {Object} 检测结果
 */
export function isAudioTag(line) {
    // 匹配 <audio src="..."> 或 <audio src="..."></audio>
    // 支持属性：src
    const audioMatch = line.trim().match(/^<audio\s+([^>]+)>(?:<\/audio>)?$/);
    
    if (audioMatch) {
        const attributesStr = audioMatch[1].trim();
        const attributes = parseAttributes(attributesStr);
        
        if (attributes.src) {
            return {
                isAudioTag: true,
                src: attributes.src,
                attributes: attributes
            };
        }
    }
    
    return { isAudioTag: false };
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
        // 去除可能存在的反引号和首尾空格
        value = value.replace(/`/g, '').trim();
        attributes[attrMatch[1]] = value;
    }
    
    return attributes;
}

/**
 * 创建 audio 元素
 * @param {string} src - 音频链接
 * @param {Object} attributes - 其他属性
 * @returns {Object} 八要素结构
 */
export function createAudioElement(src, attributes = {}) {
    const id = generateUUID();
    
    return {
        "id": id,
        "name": "audio",
        "name-zh": "音频",
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
                "layoutGrow": "{layout.grow.0}",
                "overflow": "hidden",
                "height": "auto",
                "width": "100%",
                "borderColor": {
                    "element": "color",
                    "value": "border",
                    "prop": "default",
                    "token": "border"
                },
                "borderRadius": {
                    "element": "shape",
                    "value": "borderradius",
                    "prop": "default",
                    "token": "borderradius"
                },
                "borderWidth": {
                    "element": "shape",
                    "value": "borderwidth",
                    "prop": "default",
                    "token": "borderwidth"
                },
                "boxShadow": {
                    "element": "material",
                    "value": "elevation",
                    "prop": "default",
                    "token": "elevation"
                },
                "asset": {
                    "element": "material",
                    "value": "audio",
                    "prop": "default",
                    "token": "audio"
                }
            },
            "normal": {
                "type": "container",
                "content": [
                    {
                        "element": "material",
                        "value": "audio",
                        "prop": "default",
                        "token": "audio"
                    }
                ],
                "resource": "",
                "data": [],
                "style": {
                    "display": "{layout.state.display.flex}",
                    "layoutMode": "{layout.direction.NONE}",
                    "layoutWrap": "{layout.wrap.NO_WRAP}",
                    "primaryAxisSizingMode": "{layout.sizing.AUTO}",
                    "counterAxisSizingMode": "{layout.sizing.FIXED}",
                    "primaryAxisAlignItems": "{layout.align.x.MIN}",
                    "counterAxisAlignItems": "{layout.align.y.items.MIN}",
                    "layoutAlign": "{layout.align.y.self.INHERIT}",
                    "layoutGrow": "{layout.grow.0}",
                    "overflow": "hidden",
                    "height": "auto",
                    "width": "100%",
                    "borderColor": {
                        "element": "color",
                        "value": "border",
                        "prop": "default",
                        "token": "border"
                    },
                    "borderRadius": {
                        "element": "shape",
                        "value": "borderradius",
                        "prop": "default",
                        "token": "borderradius"
                    },
                    "borderWidth": {
                        "element": "shape",
                        "value": "borderwidth",
                        "prop": "default",
                        "token": "borderwidth"
                    },
                    "boxShadow": {
                        "element": "material",
                        "value": "elevation",
                        "prop": "default",
                        "token": "elevation"
                    },
                    "asset": {
                        "element": "material",
                        "value": "audio",
                        "prop": "default",
                        "token": "audio"
                    }
                },
                "children": []
            }
        },
        "material": {
            "audio": {
                "default": {
                    "data-key": "",
                    "type": "audio",
                    "style": {
                        "audio": {
                            "value": src,
                            "type": "asset",
                            "key": "material-audio"
                        }
                    },
                    "resource": src
                }
            }
        }
    };
}
