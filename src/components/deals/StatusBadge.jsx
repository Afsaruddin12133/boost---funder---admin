import { statusStyles } from '../../lib/utils'

const StatusBadge = ({ status }) => {
  const label = status === 'pendingReview' ? 'Pending Review' : status
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[status] || 'bg-white/10 text-white/70'}`}>
      {label}
    </span>
  )
}

export default StatusBadge
