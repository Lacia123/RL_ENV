/*!
 * graph-renderer.js
 * 知识图谱浏览器端渲染运行时（与 src/app/utils/eightElement/KcGraphG6.js 逻辑保持一致）
 * 辐射布局（radial）+ 默认缩放 0.5 + fitCenter 居中 + node-click 事件。
 *
 * 依赖：/vendor/g6.min.js（@antv/g6 v5 的 UMD 构建，暴露 window.G6）
 * 用法：
 *   <script src="/vendor/g6.min.js"></script>
 *   <script src="/graph-renderer.js"></script>
 *   <kc-graph-g6 data-graph='{"nodes":[],"edges":[]}' zoom="0.5"></kc-graph-g6>
 *   或：window.renderKcGraph(container, dataStr)
 */
(function (global) {
  'use strict';

  if (!global.G6) {
    console.error('[graph-renderer] 未找到 window.G6，请先加载 /vendor/g6.min.js');
    return;
  }

  const MAIN_GRADIENT = 'linear-gradient(45deg, #6975DA 0%, #6E38C1 100%)';
  const TOPIC_GRADIENT = 'linear-gradient(135deg, #B1C5FF 0%, #D0BCFF 25%, #FFA9FF 50%, #FFB0C9 75%, #FFB4A3 100%)';
  const KP_GRADIENT = 'linear-gradient(135deg, #94A6FF 0%, #D68EFE 100%)';
  const HALO_OPACITY = 0.24;
  const DEFAULT_ZOOM = 0.5;

  let nodesRegistered = false;

  function parseGraphData(raw) {
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

  function registerKcGraphNodes(G6) {
    if (!G6 || nodesRegistered) return;
    const { register, ExtensionCategory, BaseNode } = G6;

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

  // 画布居中：先 fitCenter 再按画布中心 zoomTo 放大，最后双 rAF 淡入容器
  function centerRoot(graph, container) {
    if (!graph) return;
    try {
      if (container) container.style.opacity = '0';
      graph.fitCenter();
      const zoom = graph.__kcZoom || DEFAULT_ZOOM;
      if (zoom > 0 && zoom < 1) {
        const center = graph.getCanvasCenter();
        graph.zoomTo(zoom, center);
      }
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (container) container.style.opacity = '';
        });
      });
    } catch (error) {
      console.error('centerRoot error', error);
    }
  }

  function renderGraphData(graph, dataStr, container) {
    if (!graph) return;

    const { nodes, edges } = parseGraphData(dataStr);
    if (nodes.length === 0) return;
    graph.__kcData = dataStr;

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
        const isDirect = relType === 'HAS_TOPIC';
        return {
          id: isRealFormat ? e.id : `${e.data?.source}-${e.data?.target}`,
          source, target, type: 'line',
          data: { label, relationType: relType },
          style: {
            stroke: isDirect ? '#C598FE' : '#C5C5C5',
            lineWidth: isDirect ? 2.265 : 1.5,
            lineDash: isDirect ? undefined : [6, 4],
            cursor: 'pointer',
            endArrow: false,
            labelText: label,
            labelFill: '#ffffff',
            labelFontSize: 12,
            labelFontWeight: 600,
            labelPlacement: 'center',
            labelBackground: true,
            labelBackgroundFill: '#bcc0c4',
            labelBackgroundRadius: 85,
            labelPadding: [2, 2],
            labelBackgroundOpacity: 1,
            labelBackgroundLineWidth: 0,
            labelAutoRotate: false,
          },
        };
      }),
    };

    graph.setData(g6Data);

    // G6 v5 的 render() 是异步的，兜底：渲染完成后居中（fitCenter + zoomTo，幂等无副作用）
    const renderResult = graph.render();
    if (renderResult && typeof renderResult.then === 'function') {
      renderResult.then(() => {
        requestAnimationFrame(() => centerRoot(graph, container));
      }).catch(() => { /* ignore */ });
    }
  }

  // 创建并渲染辐射布局 + 默认缩放 0.5 的知识图谱
  function createKcGraph(container, G6, dataStr, options) {
    options = options || {};
    registerKcGraphNodes(G6);
    const zoom = options.zoom ?? DEFAULT_ZOOM;
    const graph = new G6.Graph({
      container,
      background: 'transparent',
      autoResize: true,
      padding: 24,
      zoom,
      animation: false,
      layout: {
        type: 'radial',
        center: [0, 0],
        radius: 350,
        unitRadius: 280,
        linkDistance: 350,
        preventOverlap: true,
        nodeSize: 280,
        maxIterations: 100,
      },
      behaviors: [
        { type: 'drag-canvas' },
        { type: 'zoom-canvas' },
        { type: 'drag-element' },
      ],
    });
    graph.__kcZoom = zoom;
    wireKcNodeClick(graph, container, dataStr);
    renderGraphData(graph, dataStr, container);
    return graph;
  }

  // 绑定节点点击事件，向上冒泡 node-click 自定义事件
  function wireKcNodeClick(graph, container, dataStr) {
    if (!graph || typeof graph.on !== 'function') return;
    graph.on('node:click', (evt) => {
      let target = evt.target;
      let nodeId = null;
      while (target) {
        if (target.id && typeof graph.getNodeData === 'function') {
          const data = graph.getNodeData(target.id);
          if (data) { nodeId = target.id; break; }
        }
        target = target.parent;
      }
      if (!nodeId) return;
      const nodeData = typeof graph.getNodeData === 'function' ? graph.getNodeData(nodeId) : null;
      const { nodes, edges } = parseGraphData(graph.__kcData || dataStr);
      const host = (container && typeof container.closest === 'function' && container.closest('kc-graph-g6')) || container;
      const targetEl = host || container || global;
      if (!targetEl) return;
      targetEl.dispatchEvent(new CustomEvent('node-click', {
        detail: {
          node: {
            id: nodeId,
            type: nodeData?.data?.semanticType || nodeData?.data?.type,
            label: nodeData?.style?.labelText || nodeData?.data?.label,
            data: nodeData?.data,
            model: nodeData,
          },
          allData: { nodes, edges },
        },
        bubbles: true,
        composed: true,
      }));
    });
  }

  // 监听容器尺寸变化，让画布自适应（autoResize 只监听 window resize，这里覆盖容器级 resize）
  function attachGraphResizeObserver(container, graph) {
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
          graph.resize(width, height);
        } catch (error) {
          console.error('知识图谱自适应尺寸调整失败:', error);
        }
      }, 150);
    });
    observer.observe(container);
    return observer;
  }

  function renderKcGraph(container, dataStr, options) {
    return createKcGraph(container, global.G6, dataStr, options);
  }

  // 注册 <kc-graph-g6 data-graph="..." zoom="0.5"> 自定义元素
  if (!global.customElements.get('kc-graph-g6')) {
    class KcGraphG6Element extends HTMLElement {
      constructor() {
        super();
        this._graph = null;
        this._lastDataStr = '';
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
        return ['data-graph', 'zoom'];
      }
      attributeChangedCallback(name) {
        if (name === 'zoom') {
          if (!this._graph) return;
          const z = parseFloat(this.getAttribute('zoom'));
          if (Number.isFinite(z) && z > 0) {
            this._graph.__kcZoom = z;
            this._graph.zoomTo(z, false);
          }
          return;
        }
        if (!this._graph) return;
        const dataStr = this.getAttribute('data-graph') || '';
        if (dataStr === this._lastDataStr) return;
        renderGraphData(this._graph, dataStr, this._container);
        this._lastDataStr = dataStr;
      }
      _init() {
        try {
          const container = document.createElement('div');
          container.style.width = '100%';
          container.style.height = '100%';
          this._container = container;
          this.appendChild(container);
          const dataStr = this.getAttribute('data-graph') || '';
          const zoomAttr = parseFloat(this.getAttribute('zoom'));
          const options = Number.isFinite(zoomAttr) && zoomAttr > 0 ? { zoom: zoomAttr } : {};
          this._graph = createKcGraph(container, global.G6, dataStr, options);
          this._lastDataStr = dataStr;
          this._resizeObserver = attachGraphResizeObserver(container, this._graph);
        } catch (error) {
          console.error('KcGraphG6 初始化失败:', error);
        }
      }
    }
    global.customElements.define('kc-graph-g6', KcGraphG6Element);
  }

  global.KcGraphG6 = {
    parseGraphData,
    registerKcGraphNodes,
    renderGraphData,
    createKcGraph,
    attachGraphResizeObserver,
    renderGraph: renderKcGraph,
  };
  global.renderKcGraph = renderKcGraph;
})(window);