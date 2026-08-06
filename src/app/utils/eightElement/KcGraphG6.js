// 知识图谱渲染器（KcGraphG6）
// 基于 @antv/g6 v5 渲染 dagre 层级布局的知识图谱，浏览器端专用（需要 DOM）。
//
// 使用方式：
//   1. 打包环境：renderGraph(container, dataStr) 会自动动态 import('@antv/g6')；
//   2. iframe / 无打包器环境：先加载 /vendor/g6.min.js（UMD，暴露 window.G6），
//      再调用 renderGraph(container, dataStr, { G6: window.G6 }) 或直接使用
//      <kc-graph-g6 data-graph="..."> 自定义元素。
//
// 注意：若修改本文件的节点样式 / 渲染逻辑，请同步修改 public/graph-renderer.js。

const MAIN_GRADIENT = 'linear-gradient(45deg, #6975DA 0%, #6E38C1 100%)';
const TOPIC_GRADIENT = 'linear-gradient(135deg, #B1C5FF 0%, #D0BCFF 25%, #FFA9FF 50%, #FFB0C9 75%, #FFB4A3 100%)';
const KP_GRADIENT = 'linear-gradient(135deg, #94A6FF 0%, #D68EFE 100%)';
const HALO_OPACITY = 0.24;

let nodesRegistered = false;

/**
 * 解析图谱数据（JSON 字符串或对象）为 { nodes, edges }
 * @param {string|object} raw
 * @returns {{ nodes: any[], edges: any[] }}
 */
export function parseGraphData(raw) {
    if (!raw) return { nodes: [], edges: [] };
    try {
        const json = typeof raw === 'string' ? JSON.parse(raw) : raw;
        if (Array.isArray(json.nodes)) {
            return { nodes: json.nodes, edges: json.edges || [] };
        }
        return { nodes: [], edges: [] };
    } catch (error) {
        console.error('知识图谱数据解析失败:', error);
        return { nodes: [], edges: [] };
    }
}

/**
 * 注册知识图谱专用的自定义节点类型（只注册一次）
 * @param {object} G6 - @antv/g6 的模块导出（Graph/register/ExtensionCategory/BaseNode 等）
 */
export function registerKcGraphNodes(G6) {
    if (!G6 || nodesRegistered) return;
    const { register, ExtensionCategory, BaseNode } = G6;

    // 主节点（Chapter）：内发光圆 + 渐变主体 + 白色圆环
    class GradientCircle extends BaseNode {
        drawKeyShape(attributes, container) {
            const [w] = this.getSize(attributes);
            const R = w / 2;
            const haloOpacity = attributes.haloOpacity ?? HALO_OPACITY;
            const cursor = 'pointer';
            this.upsert('key', 'circle', { r: R, fill: 'transparent', pointerEvents: 'none' }, container);
            this.upsert('halo', 'circle', {
                r: R, fill: `radial-gradient(circle ${R}px at 50% 50%, #8B9EF5 0%, #C08DE5 72%, rgba(192,141,229,0) 100%)`,
                fillOpacity: haloOpacity, filter: `blur(${(R * 0.1714).toFixed(1)}px)`,
                pointerEvents: 'none', cursor,
            }, container);
            this.upsert('main', 'circle', {
                r: R * 0.543, fill: MAIN_GRADIENT,
                filter: `blur(${(R * 0.2454).toFixed(1)}px)`, cursor,
            }, container);
            this.upsert('ring', 'circle', {
                r: R * 0.68, fill: 'transparent', stroke: 'rgba(255,255,255,0.6)',
                lineWidth: R * 0.16, filter: `blur(${(R * 0.08).toFixed(1)}px)`,
                pointerEvents: 'none', cursor,
            }, container);
            return this.getShape('key');
        }
        drawHaloShape() {}
    }

    // Topic 节点：内外双圆，外圆渐隐消失
    class TopicCircle extends BaseNode {
        drawKeyShape(attributes, container) {
            const [w] = this.getSize(attributes);
            const R = w / 2;
            const cursor = 'pointer';

            this.upsert('outer', 'circle', {
                r: R,
                fill: `radial-gradient(circle ${R}px at 50% 50%, #C0CBFF 0%, #D8D5FF 25%, #FFB8FF 50%, #FFC0CC 72%, rgba(255,192,204,0) 100%)`,
                fillOpacity: 0.26,
                filter: `blur(${(R * 0.21).toFixed(1)}px)`,
                pointerEvents: 'none',
                cursor,
            }, container);

            this.upsert('inner', 'circle', {
                r: R * 0.543,
                fill: `linear-gradient(45deg, #B1C5FF 0%, #D0BCFF 25%, #FFA9FF 50%, #FFB0C9 75%, #FFB4A3 100%)`,
                filter: `blur(${(R * 0.2454).toFixed(1)}px)`,
                cursor,
            }, container);

            this.upsert('key', 'circle', { r: R, fill: 'transparent', pointerEvents: 'none' }, container);
            return this.getShape('key');
        }
        drawHaloShape() {}
    }

    // KnowledgePoint 节点：参考 gradient-circle 样式，颜色换成紫藤渐变
    class KpCircle extends BaseNode {
        drawKeyShape(attributes, container) {
            const [w] = this.getSize(attributes);
            const R = w / 2;
            const cursor = 'pointer';

            this.upsert('halo', 'circle', {
                r: R,
                fill: `radial-gradient(circle ${R}px at 50% 50%, #A8B5FF 0%, #DCB0FF 55%, rgba(220,176,255,0) 100%)`,
                fillOpacity: 0.21,
                filter: `blur(${(R * 0.21).toFixed(1)}px)`,
                pointerEvents: 'none',
                cursor,
            }, container);

            this.upsert('main', 'circle', {
                r: R * 0.543,
                fill: KP_GRADIENT,
                filter: `blur(${(R * 0.2454).toFixed(1)}px)`,
                cursor,
            }, container);

            this.upsert('ring', 'circle', {
                r: R * 0.62,
                fill: 'transparent',
                stroke: 'rgba(255,255,255,0.75)',
                lineWidth: R * 0.14,
                filter: `blur(${(R * 0.18).toFixed(1)}px)`,
                pointerEvents: 'none',
                cursor,
            }, container);

            this.upsert('key', 'circle', { r: R, fill: 'transparent', pointerEvents: 'none' }, container);
            return this.getShape('key');
        }
        drawHaloShape() {}
    }

    register(ExtensionCategory.NODE, 'gradient-circle', GradientCircle);
    register(ExtensionCategory.NODE, 'topic-circle', TopicCircle);
    register(ExtensionCategory.NODE, 'kp-circle', KpCircle);
    nodesRegistered = true;
}

function getNodeColors(type) {
    const map = {
        Chapter: { labelFill: '#ffffff', haloOpacity: HALO_OPACITY },
        Topic: { labelFill: '#ffffff', haloOpacity: HALO_OPACITY },
        KnowledgePoint: { labelFill: '#ffffff', haloOpacity: HALO_OPACITY },
        Example: { labelFill: '#ffffff', haloOpacity: HALO_OPACITY },
        default: { labelFill: '#1e293b', haloOpacity: HALO_OPACITY },
    };
    return map[type] || map.default;
}

/**
 * 将图谱 JSON 数据渲染到已有的 G6 Graph 实例
 * @param {object} graph - G6 Graph 实例
 * @param {string} dataStr - 图谱 JSON 字符串
 */
export function renderGraphData(graph, dataStr) {
    if (!graph) return;

    const { nodes, edges } = parseGraphData(dataStr);
    if (nodes.length === 0) return;

    const BASE_SIZE = 200;
    const FONT_SIZE = 15;
    const isRealFormat = nodes[0].labels !== undefined;

    const g6Data = {
        nodes: nodes.map((n) => {
            const type = isRealFormat ? (n.labels?.[0] || 'default') : (n.data?.type || 'default');
            const id = isRealFormat ? n.id : n.data?.id;
            const label = isRealFormat ? n.props?.name : n.data?.label;
            const colors = getNodeColors(type);
            let size = BASE_SIZE;
            let nodeType = 'gradient-circle';
            if (isRealFormat) {
                if (type === 'Chapter') size = BASE_SIZE * 1.4;
                else if (type === 'Topic') { size = 110; nodeType = 'kp-circle'; }
                else if (type === 'KnowledgePoint') { size = 75; nodeType = 'topic-circle'; }
                else if (type === 'Example') { size = 45; nodeType = 'topic-circle'; }
            }
            const isBelow = nodeType === 'topic-circle' || nodeType === 'kp-circle';
            const fontSize = isBelow ? 14 : Math.max(12, FONT_SIZE * Math.sqrt(size / BASE_SIZE));
            return {
                id, type: nodeType,
                data: isRealFormat ? { id, type: nodeType, label, semanticType: type, ...n.props } : { ...n.data },
                style: {
                    size, haloOpacity: colors.haloOpacity,
                    labelText: label || id,
                    labelFill: isBelow ? '#000000' : colors.labelFill,
                    labelFontSize: fontSize,
                    labelFontWeight: 700,
                    labelPlacement: isBelow ? 'bottom' : 'center',
                    labelOffsetY: isBelow ? 6 : 0,
                    labelPointerEvents: 'none',
                },
            };
        }),
        edges: edges.map((e) => {
            const relType = isRealFormat ? (e.type || 'default') : (e.data?.relationType || 'default');
            const source = isRealFormat ? e.source : e.data?.source;
            const target = isRealFormat ? e.target : e.data?.target;
            const lineWidth = isRealFormat
                ? (relType === 'HAS_TOPIC' || relType === 'HAS_KP' ? 2.2 : 1.6)
                : (e.data?.lineWidth || (1.8 + (e.data?.weight || 1) * 0.6));
            const label = isRealFormat ? e.type : (e.data?.label || '');
            const offset = 50;
            const isDirect = relType === 'HAS_TOPIC';
            return {
                id: isRealFormat ? e.id : `${e.data.source}-${e.data.target}`,
                source, target, type: 'line',
                data: { label, relationType: relType },
                style: {
                    stroke: isDirect ? '#C598FE' : '#C5C5C5',
                    lineWidth: isDirect ? 2.265 : 1.5,
                    lineDash: isDirect ? undefined : [6, 4],
                    cursor: 'pointer',
                    sourceOffset: offset, targetOffset: offset,
                    endArrow: false,
                    labelText: label,
                    labelFill: '#ffffff',
                    labelFontSize: 14,
                    labelFontWeight: 600,
                    labelPlacement: 'center',
                    labelBackground: true,
                    labelBackgroundFill: '#bcc0c4',
                    labelBackgroundRadius: 85,
                    labelBackgroundPadding: [6, 10, 6, 10],
                    labelBackgroundOpacity: 1,
                    labelBackgroundLineWidth: 0,
                    labelAutoRotate: false,
                },
            };
        }),
    };

    graph.setData(g6Data);

    // 根节点水平居中、保持在视口上方：布局完成（afterlayout）后立即平移相机，
    // 只调整水平方向。translateTo 以画布中心为基准：新视口中心 = 画布中心 - t，
    // 取 t = 画布中心X - 根节点X 即可让根节点位于水平中线
    const centerRootX = () => {
        const rootNode = g6Data.nodes.find((n) => n.data?.semanticType === 'Chapter' || n.data?.type === 'Chapter');
        if (!rootNode || typeof graph.translateTo !== 'function') return;
        try {
            const [rx] = graph.getElementPosition(rootNode.id);
            const [cw] = graph.getSize();
            if (typeof rx === 'number' && typeof cw === 'number') {
                graph.translateTo([cw / 2 - rx, 0], false);
            }
        } catch (error) { /* ignore */ }
    };
    graph.on('afterlayout', centerRootX);

    // G6 v5 的 render() 是异步的，兜底：渲染完成后再水平居中（公式基于画布中心，幂等无副作用）
    const renderResult = graph.render();
    if (renderResult && typeof renderResult.then === 'function') {
        renderResult.then(centerRootX).catch(() => { /* ignore */ });
    }
}

/**
 * 在容器上创建并渲染一个知识图谱
 * @param {HTMLElement} container - 挂载容器
 * @param {object} G6 - @antv/g6 的模块导出
 * @param {string} dataStr - 图谱 JSON 字符串
 * @returns {object} G6 Graph 实例
 */
export function createKcGraph(container, G6, dataStr) {
    registerKcGraphNodes(G6);
    const graph = new G6.Graph({
        container,
        background: 'transparent',
        autoFit: false,
        autoResize: true,
        padding: 24,
        layout: { type: 'dagre', rankdir: 'TB', nodesep: 60, ranksep: 100, edgesep: 30 },
        behaviors: [
            { type: 'drag-canvas' },
            { type: 'zoom-canvas' },
            { type: 'drag-element' },
        ],
    });
    renderGraphData(graph, dataStr);
    return graph;
}

/**
 * 监听容器尺寸变化，让画布自适应
 * （autoResize 只监听 window resize，这里覆盖容器级 resize：面板拖拽、flex 布局变化等）
 * @param {HTMLElement} container - 挂载容器
 * @param {object} graph - G6 Graph 实例
 * @returns {object|null} ResizeObserver 实例（用于销毁时断开）
 */
export function attachGraphResizeObserver(container, graph) {
    if (typeof ResizeObserver === 'undefined' || !container || !graph) return null;
    let timer = null;
    let isFirst = true; // 跳过初始触发，避免覆盖初次渲染的相机位置
    const observer = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (!entry || !entry.contentRect) return;
        if (isFirst) { isFirst = false; return; }
        const { width, height } = entry.contentRect;
        if (!width || !height || timer) return;
        timer = setTimeout(() => {
            timer = null;
            try {
                // 只调整画布尺寸，不改相机，保持根节点始终位于上方
                graph.resize(width, height);
            } catch (error) {
                console.error('知识图谱自适应尺寸调整失败:', error);
            }
        }, 150);
    });
    observer.observe(container);
    return observer;
}

/**
 * 渲染知识图谱（会自动加载 @antv/g6）
 * @param {HTMLElement} container - 挂载容器
 * @param {string} dataStr - 图谱 JSON 字符串
 * @param {object} options - { G6?: 手动注入的 @antv/g6 模块导出 }
 * @returns {Promise<object|null>} G6 Graph 实例
 */
export async function renderGraph(container, dataStr, options = {}) {
    if (typeof window === 'undefined' || !container) return null;
    const G6 = options.G6 || (await import('@antv/g6'));
    return createKcGraph(container, G6, dataStr);
}

// 在浏览器环境中注册 <kc-graph-g6 data-graph="..."> 自定义元素
if (typeof window !== 'undefined' &&
    typeof window.customElements !== 'undefined' &&
    !window.customElements.get('kc-graph-g6')) {
    class KcGraphG6Element extends HTMLElement {
        constructor() {
            super();
            this._graph = null;
            this._lastDataStr = '';
            this._container = null;
            this._resizeObserver = null;
        }
        connectedCallback() {
            this._init();
        }
        disconnectedCallback() {
            if (this._resizeObserver) {
                try { this._resizeObserver.disconnect(); } catch (e) { /* ignore */ }
                this._resizeObserver = null;
            }
            if (this._graph) {
                try { this._graph.destroy(); } catch (e) { /* ignore */ }
                this._graph = null;
            }
        }
        static get observedAttributes() {
            return ['data-graph'];
        }
        attributeChangedCallback() {
            if (!this._graph) return;
            const dataStr = this.getAttribute('data-graph') || '';
            if (dataStr === this._lastDataStr) return;
            renderGraphData(this._graph, dataStr);
            this._lastDataStr = dataStr;
        }
        async _init() {
            try {
                const G6 = window.G6 || (await import('@antv/g6'));
                registerKcGraphNodes(G6);
                const container = document.createElement('div');
                container.style.width = '100%';
                container.style.height = '100%';
                this._container = container;
                this.appendChild(container);
                const dataStr = this.getAttribute('data-graph') || '';
                this._graph = createKcGraph(container, G6, dataStr);
                this._lastDataStr = dataStr;
                this._resizeObserver = attachGraphResizeObserver(container, this._graph);
            } catch (error) {
                console.error('KcGraphG6 初始化失败:', error);
            }
        }
    }
    window.customElements.define('kc-graph-g6', KcGraphG6Element);
}
