import { evaluateLayoutOnServer } from '../api/layout-analysis/server-utils.js';
import LayoutResultDisplay from '../components/layout-server-demo/LayoutResultDisplay.js';

// 服务器组件 - 不需要使用 'use client'
export default async function LayoutServerDemo() {
    // 示例布局请求数据
    const demoRequest = {
        metadata: {
            canvasWidth: 1200,
            canvasHeight: 800,
            measurementMode: 'virtual' // 使用虚拟DOM测量以提高性能
        },
        actions: [
            {
                "timestamp": 1000,
                "category": "componentActions",
                "actionId": "addContainer",
                "params": {
                    "parentId": null,
                    "elements": [
                        {
                            "id": "element_text_90edbc52_6f64d220",
                            "type": "text",
                            "name": "标题 AIGUI布局代理测试",
                            "typographyPreset": "h1",
                            "selfAlignPreset": "self-start",
                            "textAlignPreset": "left",
                            "sizePreset": "fill-width",
                            "content": {
                                "value": "AIGUI布局代理测试"
                            }
                        },
                        {
                            "id": "element_text_475f4579_a3d75d63",
                            "type": "text",
                            "name": "标题 代理与环境交互",
                            "typographyPreset": "h2",
                            "selfAlignPreset": "self-start",
                            "textAlignPreset": "left",
                            "sizePreset": "fill-width",
                            "content": {
                                "value": "代理与环境交互"
                            }
                        },
                        {
                            "id": "element_text_6d4d8f64_b7c91fe9",
                            "type": "text",
                            "name": "段落 代理能够基于Markdown内容自动生成...",
                            "typographyPreset": "body",
                            "selfAlignPreset": "self-start",
                            "textAlignPreset": "left",
                            "sizePreset": "fill-width",
                            "content": {
                                "value": "代理能够基于Markdown内容自动生成布局和应用预设样式，与环境交互获取奖励。"
                            }
                        }
                    ]
                },
                "result": "element_container_223192ce_7919"
            },
            {
                "timestamp": 2000,
                "category": "componentActions",
                "actionId": "addContainer",
                "params": {
                    "parentId": "element_container_223192ce_7919",
                    "elements": [
                        {
                            "id": "element_text_311ec87c_c9ce3295",
                            "type": "text",
                            "name": "标题 主要流程:",
                            "typographyPreset": "h3",
                            "selfAlignPreset": "self-start",
                            "textAlignPreset": "left",
                            "sizePreset": "fill-width",
                            "content": {
                                "value": "主要流程:"
                            }
                        },
                        {
                            "id": "element_text_888fb8d0_71405c33",
                            "type": "text",
                            "name": "标题 测试目的",
                            "typographyPreset": "h2",
                            "selfAlignPreset": "self-start",
                            "textAlignPreset": "left",
                            "sizePreset": "fill-width",
                            "content": {
                                "value": "测试目的"
                            }
                        },
                        {
                            "id": "element_text_34e14287_3b25c40c",
                            "type": "text",
                            "name": "段落 此测试验证代理和环境的交互过程，确保代理...",
                            "typographyPreset": "body",
                            "selfAlignPreset": "self-start",
                            "textAlignPreset": "left",
                            "sizePreset": "fill-width",
                            "content": {
                                "value": "此测试验证代理和环境的交互过程，确保代理生成的动作序列能正确执行并获得合理奖励。"
                            }
                        }
                    ]
                },
                "result": "element_container_8745a729_7919"
            },
            {
                "timestamp": 3000,
                "category": "componentActions",
                "actionId": "addContainer",
                "params": {
                    "parentId": "element_container_223192ce_7919",
                    "elements": [
                        {
                            "id": "element_text_22a95d0a_637467d7",
                            "type": "text",
                            "name": "列表 代理生成动作序列, 环境执行动作序列, ...",
                            "typographyPreset": "body",
                            "selfAlignPreset": "self-start",
                            "textAlignPreset": "left",
                            "sizePreset": "fill-width",
                            "content": {
                                "value": "- 代理生成动作序列\n- 环境执行动作序列\n- 环境返回奖励和状态\n- 代理优化动作策略"
                            }
                        }
                    ]
                },
                "result": "element_container_66c53a91_7919"
            },
            {
                "timestamp": 4000,
                "category": "presetActions",
                "actionId": "applyPreset",
                "params": {
                    "presetType": "layout",
                    "presetCategory": "distribution",
                    "presetKey": "expanded",
                    "elementId": "element_container_8745a729_7919"
                }
            }
        ]
    };

    // 在服务器端直接调用布局分析
    const analysisResult = await evaluateLayoutOnServer(demoRequest);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">服务器端布局分析示例</h1>

                <div className="mb-8">
                    <p className="mb-4 text-gray-600">
                        这个页面使用了 Next.js 的服务器组件功能，在服务器端直接分析了布局，
                        而不是通过 API 调用。这种方式有以下优势：
                    </p>

                    <ul className="list-disc pl-6 mb-6 text-gray-600">
                        <li>减少客户端-服务器往返时间</li>
                        <li>服务器直接访问布局分析代码，无需额外的 API 层</li>
                        <li>可以进行服务器端缓存，提高性能</li>
                        <li>减轻客户端 JavaScript 负担</li>
                        <li>改善首次加载性能和 SEO</li>
                    </ul>
                </div>

                {/* 客户端组件，用于展示分析结果 */}
                <LayoutResultDisplay result={analysisResult} />
            </div>
        </div>
    );
} 