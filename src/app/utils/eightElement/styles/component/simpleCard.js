const SIMPLE_CARD_STYLE = {
    // card 形式组件
    simpleCard: {
        type: 'template',
        style: {
            flex: "1",
            borderRadius: "{dimension.borderradius.large}",
            background: "{color.basic.brand.1}",
            display: 'flex',
            padding: "{dimension.padding.base}",
            flexDirection: 'column',
        },
        markdownMapping: {
            h3: 'itemTitle',
            h4: 'itemDescription',
        },
        itemTitle: {
            metaType: 'text',
            variant: 'minimalistListCardItemTitle',
        },
        itemDescription: {
            metaType: 'text',
            variant: 'minimalistListCardItemDescription',
        }
    },
}


export default SIMPLE_CARD_STYLE