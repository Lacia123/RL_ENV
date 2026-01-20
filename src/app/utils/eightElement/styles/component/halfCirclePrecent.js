const HALF_CIRCLE_PRECENT_STYLE = {
    // 半圆进度条组件
    halfCirclePrecent: {
        type: 'template',
        parameters: {
            progressValue: {
                source: 'h4',
                expression: 'replace("%", "")',
            },
            fillColor: {
                source: 'outer',
                default: '{color.surfacecontainer.white100}'
            }
        },
        style: {
            position: 'relative',
            width: '200px',
            height: '100px',
            '--p': '$progressValue',
            '--progress-deg': 'calc(var(--p) * 1.8deg)',
            '--bg-color': '$fillColor'
        },
        required: ['progressTrack', 'progressFill', 'progressInner'],
        markdownMapping: {
            'h4': 'progressValue',
        },
        progressTrack: {
            type: 'template',
            style: {
                position: 'absolute',
                width: '200px',
                height: '100px',
                borderRadius: '100px 100px 0 0',
                background: '#fee2e2',
            }
        },
        progressFill: {
            type: 'template',
            style: {
                position: 'absolute',
                width: '200px',
                height: '100px',
                borderRadius: '100px 100px 0 0',
                overflow: 'hidden',
                '&::before': {
                    content: "''",
                    position: 'absolute',
                    width: '200px',
                    height: '200px',
                    top: '0',
                    left: '0',
                    borderRadius: '50%',
                    background: 'conic-gradient(from 270deg, #ef4444 0deg, #ef4444 var(--progress-deg), transparent var(--progress-deg))',
                }
            }
        },
        progressInner: {
            type: 'template',
            style: {
                position: 'absolute',
                width: '160px',
                height: '80px',
                top: '20px',
                left: '20px',
                background: 'var(--bg-color)',
                borderRadius: '84px 84px 0 0',
                zIndex: '1',
            }
        },
        progressValue: {
            type: 'template',
            style: {
                position: 'absolute',
                bottom: '10px',
                textWrap: 'nowrap',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: '2',
            },
            metaType: 'text',
            variant: 'percentValue'
        }
    },
}

export default HALF_CIRCLE_PRECENT_STYLE