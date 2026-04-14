/**
 * 命令行组件 - 通用可复用
 * 可在任意卡片中作为 slot 使用，如 <heroCard><command>npm install</command></heroCard>
 * 样式参考 techGradientStandard 的代码块：macOS 窗口风格（红黄绿圆点）+ 等宽字体
 */
export const COMMAND_SLOT_CONFIG = {
    metaType: 'text',
    variant: 'commandBlock',
    variantStyle: {
        marginTop: '{dimension.margin.base}',
        marginBottom: '{dimension.margin.base}'
    }
};

const COMMAND_STYLE = {
    command: COMMAND_SLOT_CONFIG
};

export default COMMAND_STYLE;
