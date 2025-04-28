# Layout From Actions API

此API接口用于将actions序列转换为layout对象，不进行布局分析评估。

## 接口说明

- **URL**: `/api/layout-from-actions`
- **方法**: POST
- **内容类型**: application/json

## 请求参数

```json
{
  "actions": [
    {
      "timestamp": 13415,
      "category": "componentActions",
      "actionId": "addContainer",
      "params": {
        "elements": [
          {
            "type": "text",
            "name": "标题",
            "presets": [],
            "content": "内容文本",
            "id": "element_text_123456"
          }
        ],
        "parentId": null
      },
      "result": "element_container_123456"
    },
    {
      "timestamp": 18636,
      "category": "presetActions",
      "actionId": "applyPreset",
      "params": {
        "elementId": "element_container_123456",
        "presetCategory": "alignment",
        "presetKey": "contentAlignCenter"
      },
      "result": "element_container_123456"
    }
  ],
  "canvasWidth": 1024, // 可选，默认为1024
  "canvasHeight": 768  // 可选，默认为768
}
```

## 响应格式

成功响应:

```json
{
  "success": true,
  "layout": {
    "id": "root",
    "type": "container",
    "style": { ... },
    "children": [ ... ]
  }
}
```

错误响应:

```json
{
  "success": false,
  "message": "错误信息",
  "error": "详细错误描述" // 可选
}
```

## 支持的动作类型

API支持以下几种主要的动作类型：

1. **componentActions.addContainer**: 添加容器
2. **componentActions.addChildComponent**: 添加子元素
3. **presetActions.applyPreset**: 应用预设
4. **styleActions.updateElementStyle**: 更新元素样式
5. **contentActions.updateElementContent**: 更新元素内容
6. **layoutActions.moveElement**: 移动元素

## 使用示例

```javascript
// 前端调用示例
async function generateLayout() {
  const response = await fetch('/api/layout-from-actions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      actions: [
        // 动作序列...
      ]
    }),
  });
  
  const result = await response.json();
  if (result.success) {
    // 处理生成的布局
    console.log(result.layout);
  } else {
    // 处理错误
    console.error(result.message);
  }
}
``` 