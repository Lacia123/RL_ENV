const LIST_STYLE = {
    // ==================== 列表元件 ====================
    list: {
        // 无序列表 
        unordered: {
            paddingLeft: "{dimension.padding.loose}",
            marginBottom: "{dimension.margin.base}",
            fontSize: "{font.size.medium}",
            lineHeight: "1.6",
            color: "{color.onsurface.black76}",
            marginBottom: "{dimension.margin.tight}",
            position: 'relative',
            '&::before': {
                content: "'•'",
                color: "{color.primary.brand5}",
                fontSize: '1.2em',
                position: 'absolute',
                top: '-3px',
                left: '0px'
            }
        },

        // 有序列表 TODO: 目前无法应用有序列表样式，因为八要素解析成 html，不是标准的 <ol> 标签
        ordered: {
            paddingLeft: "{dimension.padding.loose}",
            marginBottom: "{dimension.margin.base}",
            counterReset: 'list-counter',
            fontSize: "{font.size.medium}",
            lineHeight: "1.6",
            color: "{color.onsurface.black76}",
            marginBottom: "{dimension.margin.tight}",
            position: 'relative',
            counterIncrement: 'list-counter',
            '&::before': {
                content: 'counter(list-counter)',
                color: "{color.onprimary.white100}",
                fontWeight: "{font.fontweight.semibold}",
                fontSize: "{font.size.small}",
                backgroundColor: "{color.primary.brand5}",
                borderRadius: "50%",
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                left: '-30px',
                top: '2px',
                boxShadow: "{material.hierarchy.main}"
            }

        },
        // 任务列表  
        task: {
            paddingLeft: "{dimension.padding.base}",
            marginBottom: "{dimension.margin.base}",
            '& > :first-child': {
                fontSize: "{font.size.medium}",
                lineHeight: "1.6",
                color: '{color.onsurface.black76}',
                marginBottom: "{dimension.margin.tight}",
                display: 'flex',
                alignItems: 'flex-start',
                gap: "{dimension.gap.tight}",
                '& input[type="checkbox"]': {
                    marginTop: '4px',
                    accentColor: '{color.primary.brand5}'
                }
            }
        }
    },
}

export default LIST_STYLE