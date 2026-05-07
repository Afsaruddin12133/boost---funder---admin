import { Eye, CheckCircle, XCircle } from 'lucide-react'
import { formatCurrency, formatDate } from '../../lib/utils'
import { glassCardClass } from '../BoostFundrUI'
import StatusBadge from './StatusBadge'

const DealTable = ({ deals, isLoading, onView, onApprove, onReject, actionLoading = {} }) => {
  if (isLoading) {
    return (
      <div className={`${glassCardClass} px-6 py-20 text-center text-white/70 backdrop-blur-xl`}>
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#01F27B] border-t-transparent shadow-[0_0_20px_rgba(1,242,123,0.2)]" />
        <p className="mt-4 font-medium">Intelligence retrieval in progress...</p>
      </div>
    )
  }

  if (!deals || deals.length === 0) {
    return (
      <div className={`${glassCardClass} px-6 py-16 text-center text-white/70 backdrop-blur-xl`}>
        <p className="text-lg font-bold text-white mb-2">No Deals Found</p>
        <p className="text-sm opacity-60">Try adjusting your filters or search criteria.</p>
      </div>
    )
  }

  return (
    <div className={`overflow-x-auto ${glassCardClass} border-white/5`}>
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-white/10 bg-white/5 text-[10px] uppercase tracking-[0.2em] font-black text-white/40">
          <tr>
            <th className="px-6 py-5 font-black">Startup</th>
            <th className="px-6 py-5 font-black">Category & Stage</th>
            <th className="px-6 py-5 font-black">Funding Goal</th>
            <th className="px-6 py-5 font-black">Raised</th>
            <th className="px-6 py-5 font-black">Status</th>
            <th className="px-6 py-5 font-black text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {deals.map((deal) => {
            const basicInfo = deal.basicInfo || {}
            const funding = deal.funding || {}
            const isProcessing = actionLoading[deal.id]

            return (
              <tr key={deal.id} className="group text-white/80 transition-all duration-300 hover:bg-white/[0.03]">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black/50 p-1.5 shadow-lg group-hover:border-[#01F27B]/30 transition-colors">
                      <img 
                        src={basicInfo.startupLogo} 
                        alt={basicInfo.startupName} 
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-white transition-colors group-hover:text-[#01F27B] truncate max-w-[200px]">
                        {basicInfo.startupName}
                      </div>
                      <div className="text-[10px] font-medium text-white/40 uppercase tracking-widest truncate max-w-[200px]">
                        {basicInfo.tagline}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-white/80">{basicInfo.category || 'N/A'}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-[#01F27B]/60">
                      {basicInfo.stage || 'N/A'}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="text-sm font-bold text-white">
                    {formatCurrency(funding.goalAmount || 0, funding.currency || 'USD')}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="space-y-1.5">
                    <div className="text-sm font-bold text-[#01F27B]">
                      {formatCurrency(funding.raisedAmount || 0, funding.currency || 'USD')}
                    </div>
                    <div className="h-1 w-24 overflow-hidden rounded-full bg-white/5">
                      <div 
                        className="h-full bg-[#01F27B] transition-all duration-1000 shadow-[0_0_8px_rgba(1,242,123,0.4)]"
                        style={{ width: `${Math.min(((funding.raisedAmount || 0) / (funding.goalAmount || 1)) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <StatusBadge status={deal.status} />
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => onView(deal.id)}
                      className="p-2 rounded-xl border border-white/5 bg-white/5 text-white/40 transition-all hover:border-white/20 hover:text-white hover:bg-white/10" 
                      title="View Analysis"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {deal.status === 'pendingReview' && (
                      <>
                        <button 
                          onClick={() => onApprove(deal.id)}
                          disabled={isProcessing}
                          className="p-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 transition-all hover:bg-emerald-500 hover:text-white disabled:opacity-30" 
                          title="Approve for Feed"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => onReject(deal)}
                          disabled={isProcessing}
                          className="p-2 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-500 transition-all hover:bg-rose-500 hover:text-white disabled:opacity-30" 
                          title="Reject Deal"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default DealTable
