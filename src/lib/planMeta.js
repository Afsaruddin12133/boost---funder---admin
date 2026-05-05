import { Crown, Gift, Zap } from 'lucide-react'

/**
 * Per-plan display configuration.
 * Keys match the plan `name` field returned by the API: 'free' | 'pro' | 'elite'
 */
export const PLAN_META = {
  free: {
    Icon: Gift,
    badge: 'ENTRY LEVEL',
    badgeColor: 'text-[#01F27B]',
    accent: '#01F27B',
    popular: false,
    cardBg: 'from-[#01F27B]/10 via-black/80 to-black/95',
    topGlow: 'from-[#01F27B]/30 to-transparent',
    border: 'border-white/10 hover:border-[#01F27B]/40',
    shadow: 'hover:shadow-[#01F27B]/15',
    btnHover: 'hover:border-[#01F27B]/40 hover:bg-[#01F27B]/10 hover:text-[#01F27B]',
  },
  pro: {
    Icon: Zap,
    badge: 'GROWTH TIER',
    badgeColor: 'text-[#01F27B]',
    accent: '#01F27B',
    popular: true,
    cardBg: 'from-[#01F27B]/10 via-black/80 to-black/95',
    topGlow: 'from-[#01F27B]/30 to-transparent',
    border: 'border-white/10 hover:border-[#01F27B]/40',
    shadow: 'hover:shadow-[#01F27B]/15',
    btnHover: 'hover:border-[#01F27B]/40 hover:bg-[#01F27B]/10 hover:text-[#01F27B]',
  },
  elite: {
    Icon: Crown,
    badge: 'INSTITUTIONAL',
    badgeColor: 'text-[#01F27B]',
    accent: '#01F27B',
    popular: false,
    cardBg: 'from-[#01F27B]/10 via-black/80 to-black/95',
    topGlow: 'from-[#01F27B]/30 to-transparent',
    border: 'border-white/10 hover:border-[#01F27B]/40',
    shadow: 'hover:shadow-[#01F27B]/15',
    btnHover: 'hover:border-[#01F27B]/40 hover:bg-[#01F27B]/10 hover:text-[#01F27B]',
  },
}
