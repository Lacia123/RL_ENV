const PRECENT_ITEM_STYLE = {
    // 半分比 item 组件
    precentItem: {
        type: 'template',
        style: {
            display: 'flex',
            flexDirection: 'column',
            flex: "1",
            minWidth: "200px",
            padding: "{dimension.padding.base}",
            alignItems: "center",
            textAlign: "center",
        },
        markdownMapping: {
            h3: 'itemTitle',
            h4: 'percentValue',
            p: 'itemDescription',
        },
        itemTitle: {
            style: {
                marginBottom: "{dimension.margin.tight}",
            },
            metaType: 'text',
            variant: 'percentItemTitle',
        },
        percentValue: {
            style: {
                marginBottom: "{dimension.margin.tight}",
            },
            metaType: 'text',
            variant: 'percentValue',
        },
        itemDescription: {
            metaType: 'text',
            variant: 'percentItemDescription',
        }
    },
    newPrecentItem: {
        type: 'template',
        style: {
            display: 'flex',
            flexDirection: 'column',
            flex: "1",
            minWidth: "200px",
            padding: "{dimension.padding.base}",
            alignItems: "center",
            textAlign: "center",
            background: "{color.basic.red.0}",
            borderRadius: "{dimension.borderradius.xl}",
        },
        markdownMapping: {
            h3: 'header.title',
            h4: 'precentContainer',  // 🔧 修复：h4 移到 p 之前，匹配实际 markdown 顺序
            p: 'header.description',
        },
        header: {
            type: 'template',
            style: {
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: "{dimension.margin.base}",
            },
            title: {
                metaType: 'component',
                variant: 'labelTitle',
            },
            description: {
                metaType: 'text',
                variant: 'percentItemDescription'
            }
        },
        precentContainer: {
            metaType: 'component',
            variant: 'halfCirclePrecent',
            parameters: {
                fillColor: "{color.basic.red.0}"
            }
        },
    },
}

export default PRECENT_ITEM_STYLE