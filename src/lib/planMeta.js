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
    cardBg: 'from-[#01F27B]/10 via-[#061F11]/80 to-black/95',
    topGlow: 'from-[#01F27B]/30 to-transparent',
    border: 'border-[#01F27B]/20 hover:border-[#01F27B]/50',
    shadow: 'hover:shadow-[#01F27B]/15',
    btnHover: 'hover:border-[#01F27B]/50 hover:bg-[#01F27B]/10 hover:text-[#01F27B]',
  },
  pro: {
    Icon: Zap,
    badge: 'GROWTH TIER',
    badgeColor: 'text-amber-400',
    accent: '#f59e0b',
    popular: true,
    cardBg: 'from-amber-500/10 via-[#1a1200]/80 to-black/95',
    topGlow: 'from-amber-400/30 to-transparent',
    border: 'border-amber-400/20 hover:border-amber-400/50',
    shadow: 'hover:shadow-amber-400/15',
    btnHover: 'hover:border-amber-400/50 hover:bg-amber-400/10 hover:text-amber-400',
  },
  elite: {
    Icon: Crown,
    badge: 'INSTITUTIONAL',
    badgeColor: 'text-violet-400',
    accent: '#a78bfa',
    popular: false,
    cardBg: 'from-violet-500/10 via-[#0d0820]/80 to-black/95',
    topGlow: 'from-violet-400/30 to-transparent',
    border: 'border-violet-400/20 hover:border-violet-400/50',
    shadow: 'hover:shadow-violet-400/15',
    btnHover: 'hover:border-violet-400/50 hover:bg-violet-400/10 hover:text-violet-400',
  },
}
