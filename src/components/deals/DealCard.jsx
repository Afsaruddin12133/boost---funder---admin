import { BadgeCheck, Calendar, Clock, MapPin, TrendingUp } from 'lucide-react'
import { formatCurrency, formatDate, isNewDeal } from '../../lib/utils'
import ActionButtons from './ActionButtons'
import StatusBadge from './StatusBadge'

const DealCard = ({ deal, onApprove, onReject, onView, onFeature, actionState }) => {
  const completionWarning = deal.profileCompletionScore < 50
  const highlightCount = deal.tractionHighlights?.length || 0
  const createdLabel = isNewDeal(deal.createdAt)
  const mediaUrl = deal.media?.[0]

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-black/50 shadow-lg shadow-black/40 transition hover:-translate-y-1 hover:border-white/20">
      <div className="relative">
        <img
          src={mediaUrl || 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=900&auto=format&fit=crop'}
          alt={deal.startupName}
          className="h-44 w-full object-cover"
        />
        <div className="absolute right-4 top-4 flex items-center gap-2">
          {createdLabel ? (
            <span className="rounded-full bg-[#01F27B] px-3 py-1 text-xs font-semibold text-black">New</span>
          ) : null}
          <StatusBadge status={deal.status} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-white">{deal.startupName}</h3>
            {deal.verificationBadge?.isVerified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-200">
                <BadgeCheck className="h-3.5 w-3.5" strokeWidth={1.8} />
                Verified
              </span>
            ) : null}
          </div>
          <p className="text-sm text-white/70 line-clamp-2">{deal.shortPitch}</p>
          <div className="flex flex-wrap items-center gap-2 text-xs text-white/70">
            <span className="rounded-full border border-white/10 px-2 py-1">{deal.category}</span>
            <span className="rounded-full border border-white/10 px-2 py-1">{deal.stage}</span>
            {deal.location ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2 py-1">
                <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} />
                {deal.location}
              </span>
            ) : (
              <span className="rounded-full border border-rose-500/40 px-2 py-1 text-rose-200">
                Missing location
              </span>
            )}
          </div>
        </div>

        <div className="grid gap-3 text-sm text-white/70 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase text-white/50">Goal</p>
            <p className="text-white">{formatCurrency(deal.goalAmount, deal.currency)}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-white/50">Raised</p>
            <p className="text-white">{formatCurrency(deal.raisedAmount, deal.currency)}</p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-white/60" strokeWidth={1.8} />
            <div>
              <p className="text-xs uppercase text-white/50">Deadline</p>
              <p className="text-white">{formatDate(deal.deadline)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-white/60" strokeWidth={1.8} />
            <div>
              <p className="text-xs uppercase text-white/50">Created</p>
              <p className="text-white">{formatDate(deal.createdAt)}</p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-xs text-white/60">
            <span>Profile completion</span>
            <span className={completionWarning ? 'text-amber-200' : 'text-emerald-200'}>
              {deal.profileCompletionScore || 0}%
            </span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-white/10">
            <div
              className={`h-2 rounded-full ${completionWarning ? 'bg-amber-400' : 'bg-[#01F27B]'}`}
              style={{ width: `${Math.min(deal.profileCompletionScore || 0, 100)}%` }}
            />
          </div>
          {completionWarning ? (
            <p className="mt-2 text-xs text-amber-200">Profile under 50% completion.</p>
          ) : null}
        </div>

        {highlightCount > 0 ? (
          <div className="flex flex-wrap gap-2">
            {deal.tractionHighlights.slice(0, 2).map((highlight) => (
              <span
                key={highlight}
                className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2 py-1 text-xs text-white/70"
              >
                <TrendingUp className="h-3.5 w-3.5" strokeWidth={1.8} />
                {highlight}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-xs text-white/40">No traction highlights yet.</span>
        )}

        <ActionButtons
          status={deal.status}
          loading={actionState}
          onApprove={() => onApprove(deal.id)}
          onReject={() => onReject(deal.id)}
          onView={() => onView(deal.id)}
          onFeature={() => onFeature(deal.id)}
        />
      </div>
    </div>
  )
}

export default DealCard
