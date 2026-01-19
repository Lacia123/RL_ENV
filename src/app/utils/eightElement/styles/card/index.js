import NORMAL_CARD_STYLE from './normalCard';
import NEOMORPHISM_CARD_STYLE from './neomorphismCard';
import TECH_GRADIENT_CARD_STYLE from './techGradientCard';
import ELEGANT_CARD_STYLE from './elegantCard';
import HEADER_CARD_STYLE from './headerCard';
import MINIMALIST_CARD_STYLE from './minimalistCard';
import OTHER_CARD_STYLE from './otherCard'

const CARD_STYLE = { 
    card: {
        ...NORMAL_CARD_STYLE,
        ...NEOMORPHISM_CARD_STYLE,
        // ==================== 科技渐变风格卡片系列 ====================
        ...TECH_GRADIENT_CARD_STYLE,
        // ==================== 优雅青蓝卡片系列 ====================
        ...ELEGANT_CARD_STYLE,
        // ==================== headerCard 系列 ====================
        ...HEADER_CARD_STYLE,
        // ==================== 简约系列 ====================
        ...MINIMALIST_CARD_STYLE,
        // ==================== 其他系列 ====================
        ...OTHER_CARD_STYLE,
    }
}

export default CARD_STYLE