import { BadgeCheck, Calendar, Clock, MapPin, TrendingUp, Eye } from 'lucide-react'
import { formatCurrency, formatDate, isNewDeal } from '../../lib/utils'
import { glassCardClass } from '../BoostFundrUI'
import ActionButtons from './ActionButtons'
import StatusBadge from './StatusBadge'

const DealCard = ({ deal, onApprove, onReject, onView, onFeature, actionState }) => {
  const basicInfo = deal.basicInfo || {}
  const funding = deal.funding || {}
  const story = deal.story || {}
  const execution = deal.execution || {}

  const completionWarning = deal.profileCompletionScore < 50
  const createdLabel = isNewDeal(deal.createdAt)
  const logoUrl = basicInfo.startupLogo

  return (
    <div className={`${glassCardClass} group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:scale-[1.02]`}>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
        <img
          src={logoUrl || 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=900&auto=format&fit=crop'}
          alt={basicInfo.startupName}
          className="h-44 w-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-500"
        />
        <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
           <div className="rounded-full bg-[#01F27B]/20 p-3 backdrop-blur-md">
             <Eye className="h-6 w-6 text-[#01F27B]" />
           </div>
        </div>
        <div className="absolute right-4 top-4 flex items-center gap-2 z-30">
          {createdLabel ? (
            <span className="rounded-md bg-[#01F27B] px-3 py-1 text-xs font-black uppercase tracking-widest text-black shadow-[0_0_20px_rgba(1,242,123,0.3)]">New</span>
          ) : null}
          <StatusBadge status={deal.status} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold tracking-tight text-white">{basicInfo.startupName}</h3>
            {deal.verificationBadge?.isVerified ? (
              <BadgeCheck className="h-5 w-5 text-[#01F27B]" strokeWidth={2.5} />
            ) : null}
          </div>
          <p className="text-sm text-white/50 line-clamp-2 leading-relaxed italic">"{basicInfo.tagline || story.shortPitch}"</p>
          
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[#01F27B]">{basicInfo.category}</span>
            <span className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white/60">{basicInfo.stage}</span>
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white/60">
              <MapPin className="h-3 w-3" />
              {basicInfo.location || 'Remote'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 rounded-2xl bg-white/[0.02] p-4 border border-white/5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Target</p>
            <p className="text-sm font-bold text-white">{formatCurrency(funding.goalAmount || 0, funding.currency || 'USD')}</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Raised</p>
            <p className="text-sm font-bold text-[#01F27B]">{formatCurrency(funding.raisedAmount || 0, funding.currency || 'USD')}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
            <span className="text-white/40">Market Readiness</span>
            <span className={completionWarning ? 'text-amber-400' : 'text-[#01F27B]'}>
              {deal.profileCompletionScore || 0}%
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
            <div
              className={`h-full transition-all duration-1000 ${completionWarning ? 'bg-amber-400' : 'bg-[#01F27B] shadow-[0_0_15px_rgba(1,242,123,0.4)]'}`}
              style={{ width: `${Math.min(deal.profileCompletionScore || 0, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex items-center gap-2 text-white/40">
            <Calendar className="h-3.5 w-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{formatDate(funding.deadline)}</span>
          </div>
          <div className="flex items-center gap-2 text-white/40">
            <TrendingUp className="h-3.5 w-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{funding.growthRate || 0}% MoM</span>
          </div>
        </div>

        <ActionButtons
          status={deal.status}
          loading={actionState}
          onApprove={() => onApprove(deal.id)}
          onReject={() => onReject(deal)}
          onView={() => onView(deal.id)}
          onFeature={() => onFeature(deal.id)}
        />
      </div>
    </div>
  )
}

export default DealCard
