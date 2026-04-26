import { CheckCircle2, Eye, Star, XCircle } from 'lucide-react'

const ActionButtons = ({ status, onApprove, onReject, onView, onFeature, loading }) => {
  const disabled = status === 'approved' || status === 'rejected'

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={onApprove}
        disabled={disabled || loading === 'approved'}
        className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/90 px-4 py-2 text-sm font-semibold text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        title="Approve"
      >
        <CheckCircle2 className="h-4 w-4" strokeWidth={1.8} />
        {loading === 'approved' ? 'Approving...' : 'Approve'}
      </button>
      <button
        type="button"
        onClick={onReject}
        disabled={disabled || loading === 'rejected'}
        className="inline-flex items-center gap-2 rounded-xl bg-rose-500/90 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        title="Reject"
      >
        <XCircle className="h-4 w-4" strokeWidth={1.8} />
        {loading === 'rejected' ? 'Rejecting...' : 'Reject'}
      </button>
      <button
        type="button"
        onClick={onView}
        className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40"
        title="View details"
      >
        <Eye className="h-4 w-4" strokeWidth={1.8} />
        View Details
      </button>
      <button
        type="button"
        onClick={onFeature}
        className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
        title="Feature"
      >
        <Star className="h-4 w-4" strokeWidth={1.8} />
        Feature
      </button>
    </div>
  )
}

export default ActionButtons
