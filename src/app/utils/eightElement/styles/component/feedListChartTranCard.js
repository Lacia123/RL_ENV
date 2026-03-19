import fontweight from "@/app/utils/tokens/font/fontweight";

/**
 * feedListChartTranCard - 带图表的信息列表卡片（透明背景 + 白色文字）
 * 结构：标题、副标题 + 内嵌 minimalistChartCard
 *
 * 修改背景色：
 * - 整张卡片背景：改本层 style.background（或 layoutModes 里对应模式的 style.background）
 * - 图表 SVG 背景（图本身）：改 chartCard.chartBackgroundColor，在图表 SVG 内绘制背景 rect
 *
 * 图表内轴/网格/图例/标题颜色：改 chartCard.axis / grid / legend / title，会写入 SVG 内联 <style> 覆盖默认 defs。
 * 若需用页面 CSS 再覆盖：对图表所在容器加 class，用更高优先级选择器覆盖，例如：
 *   .feed-list-chart-tran-card .axis line, .feed-list-chart-tran-card .axis path { stroke: ...; }
 *   .feed-list-chart-tran-card .grid line { stroke: ...; }
 *   .feed-list-chart-tran-card .legend text { fill: ...; }
 *   .feed-list-chart-tran-card .ee-chart-title-wrap text { fill: ...; }
 */
const FEED_LIST_CHART_TRAN_CARD_STYLE = {
  feedListChartTranCard: {
    type: 'template',
    style: {
      display: 'flex',
      flex: '1',
      width: '100%',
      flexDirection: 'column',
      gap: '{dimension.gap.base}',
      padding: '{dimension.padding.loose}',
      borderRadius: '{dimension.borderradius.xl}',
      border: '{dimension.borderwidth.narrow} solid {color.basic.opacity.white.20}',
    },
    layoutModes: [
      {
        name: 'default',
        condition: 'default',
        style: {
          display: 'flex',
          flex: '1',
          width: '100%',
          flexDirection: 'column',
          gap: '{dimension.gap.base}',
          padding: '{dimension.padding.loose}',
          borderRadius: '32px',
          border: '{dimension.borderwidth.narrow} solid {color.basic.opacity.white.20}',
          backgroundColor: '{color.basic.opacity.black.48}',
        },
        structure: {
          groups: [
            {
              name: 'header',
              condition: 'has:title || has:subtitle',
              slots: ['title', 'subtitle'],
              type: 'template',
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '{dimension.gap.supertight}',
              },
            },
            {
              name: 'chartCardGroup',
              condition: 'has:chartCard',
              slots: ['chartCard'],
              type: 'template',
              style: {
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                backgroundColor: 'blue',
              },
            },
          ],
        },
      },
    ],
    markdownMapping: {
      title: 'header.title',
      subtitle: 'header.subtitle',
      'card:minimalistChartCard': 'chartCard',
      'card:*': 'chartCard',
    },
    // 根级 title/subtitle：供按 slot 名（如 structure slots）查找，不能删否则整块不渲染
    title: {
      metaType: 'text',
      variant: 'h4',
      variantStyle: {
        margin: '0',
        color: '{color.basic.opacity.white.100}',
        fontSize: '{font.size.medium}',
        // borderBottom: '1px solid rgba(255,255,255,0.2)',
        borderBottom: '1px solid transparent',
      },
    },
    subtitle: {
      metaType: 'text',
      variant: 'p',
      variantStyle: {
        margin: '0',
        color: '{color.basic.opacity.white.76}',
        fontSize: '{font.size.medium}',
      },
    },
    // header 层级：供路径 header.title / header.subtitle 解析（createOrMergeTemplateElement 等）
    header: {
      type: 'template',
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '{dimension.gap.supertight}',
      },
      title: {
        metaType: 'text',
        variant: 'h4',
        variantStyle: {
          margin: '0',
          color: '#ffffff',
          borderBottom: '1px solid rgba(255,255,255,0.2)',
        },
      },
      subtitle: {
        metaType: 'text',
        variant: 'p',
        variantStyle: {
          margin: '0',
          color: '#ffffff',
          fontSize: '{font.size.small}',
        },
      },
    },
    // 图表卡片槽位：支持从外部传入图表颜色、图表 SVG 背景、坐标系与文字颜色透传
    chartCard: {
      type: 'template',
      style: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      },
      nestedContainerStyle: { background: 'transparent', backgroundColor: 'transparent' },
      // 图表 SVG 背景色：在图表 SVG 内绘制背景 rect，支持 token 或 hex，如 'transparent'、'{color.surfacecontainer.white100}'
      // chartBackgroundColor: 'color.basic.opacity.white.12',
      chartBackgroundColor: '{color.basic.opacity.white.12}',
      // 图表颜色透传（与内容一一对应，建议用 design token 保持整体一致）：
      // - 对应关系：chartColors[0]=第1个系列/第1根柱子/第1个扇形，[1]=第2个…，多出类别循环使用
      // - 建议使用 token（如 {color.primary.brand5}）避免直接写 hex 导致风格混乱；可覆盖为数组
      // chartColors: [
      //   'red',
      //   'blue',
      //   'yellow',
      //   'purple',
      //   'orange',
      //   'pink',
      //   'brown',
      //   'gray',
      //   'black',
      //   'white',
      // ],
      // 坐标系与图表内文字颜色（支持 token 或 hex）
      axis: {
        fill: '#fff',           // 坐标轴刻度/标签颜色
        stroke: '{color.basic.opacity.white.48}',          // 坐标轴线、刻度线颜色
        fontSize: '{font.size.tiny}',
        fontweight: '{font.fontweight.medium}',
      },
      // 柱顶数值标签（800、1000 等）：不配则与轴同色同字号，配了可与轴区分
      dataLabel: {
        fill: '#fff',           // 柱顶数字颜色，可与 axis.fill 不同
        fontSize: '{font.size.tiny}',                      // 柱顶数字字号
        fontweight: '{font.fontweight.medium}',
      },
      // grid：网格线颜色 
      grid: {
        stroke: '{color.basic.opacity.white.16}',
      },
      // legend：图例文字颜色
      legend: {
        fill: '#fff',
        fontSize: '{font.size.tiny}',           // 可选
        fontweight: '{font.fontweight.medium}',
      },
      // title：图表标题文字颜色（图表内标题）
      title: {
        fill: '#fff',
        fontSize: '{font.size.medium}',         // 可选
        fontweight: '{font.fontweight.bold}',
      },
    },
  },
};

export default FEED_LIST_CHART_TRAN_CARD_STYLE;
