const BANNER_IMAGE_PANEL_STYLE = {
    bannerImagePanel: {
        type: 'template',
        markdownMapping: {
            h2: 'title',
            h3: 'subtitle'
        },
        style: {
            width: '100%',
            padding: '{dimension.padding.semiloose}',
            borderRadius: '{dimension.borderradius.xxxl}',
            backgroundImage: 'url("https://sop-cdn.dingcloud.com/aiguitoken/Frame 2087328132.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: "{dimension.margin.loose}",
        },
        title: {
            metaType: 'text',
            variant: 'bannerTitle',
            variantStyle: {
                fontSize: '{font.size.xl}',
                fontWeight: '900',
                color: '{color.onprimary.white100}',
            }
        },
        subtitle: {
            metaType: 'text',
            variant: 'h4',
            variantStyle: {
                fontSize: '{font.size.xl}',
                fontWeight: '350',
                color: '{color.onprimary.white100}',
                margin: '0',
                borderBottom: 'none',
                padding: '0',
            }
        }
    }
};

export default BANNER_IMAGE_PANEL_STYLE;
