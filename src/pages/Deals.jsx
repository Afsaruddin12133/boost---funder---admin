import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EmptyState, PageHeader } from '../components/BoostFundrUI'
import DealTable from '../components/deals/DealTable'
import FilterBar from '../components/deals/FilterBar'
import RejectionModal from '../components/deals/RejectionModal'
import { getToken } from '../lib/utils'
import apiClient from '../services/apiClient'

const Deals = () => {
  const navigate = useNavigate()
  const [deals, setDeals] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [filters, setFilters] = useState({ status: 'pendingReview', category: 'all', search: '' })
  const [actionLoading, setActionLoading] = useState({})
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [selectedDeal, setSelectedDeal] = useState(null)
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)

  useEffect(() => {
    const loadDeals = async () => {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const token = getToken()
        if (!token) {
          throw new Error('Missing auth token. Please log in again.')
        }

        const data = await apiClient.request('/api/v1/deals/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const payload = data?.data?.items || data?.data?.deals || data?.deals || data?.data || []
        setDeals(Array.isArray(payload) ? payload : [])
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to load deals.'
        setErrorMessage(message)
        setDeals([])
      } finally {
        setIsLoading(false)
      }
    }

    loadDeals()
  }, [])

  const categories = useMemo(() => {
    const set = new Set(deals.map((deal) => deal.basicInfo?.category).filter(Boolean))
    return Array.from(set)
  }, [deals])

  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      const basicInfo = deal.basicInfo || {}
      const statusMatch = deal.status === filters.status
      const categoryMatch = filters.category === 'all' || basicInfo.category === filters.category
      const searchMatch = 
        basicInfo.startupName?.toLowerCase().includes(filters.search.trim().toLowerCase()) ||
        deal.id?.toLowerCase().includes(filters.search.trim().toLowerCase())
      return statusMatch && categoryMatch && (filters.search ? searchMatch : true)
    })
  }, [deals, filters])

  const totalEntries = filteredDeals.length
  const totalPages = Math.max(1, Math.ceil(totalEntries / pageSize))

  const pagedDeals = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredDeals.slice(start, start + pageSize)
  }, [filteredDeals, page])

  const updateStatus = async (id, status, reason = null) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }))
    try {
      const token = getToken()
      await apiClient.request(`/api/v1/deals/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, reason }),
        headers: { Authorization: `Bearer ${token}` }
      })
      setDeals((prev) => prev.map((deal) => (deal.id === id ? { ...deal, status } : deal)))
      setIsRejectModalOpen(false)
    } catch (error) {
      console.error('Failed to update status:', error)
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }))
    }
  }

  const handlePageChange = (nextPage) => {
    setPage(Math.min(Math.max(nextPage, 1), totalPages))
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Deals"
        title="Deal Management"
        description="Review, approve, and manage startup deals with real-time context."
        actions={[
          <div key="count" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur-xl">
            {totalEntries} deals detected
          </div>,
        ]}
      />

      <FilterBar
        filters={filters}
        categories={categories}
        onChange={(next) => {
          setFilters((prev) => ({ ...prev, ...next }))
          setPage(1)
        }}
      />

      {errorMessage ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70 backdrop-blur-xl">
          {errorMessage}
        </div>
      ) : null}

      <DealTable 
        deals={pagedDeals}
        isLoading={isLoading}
        actionLoading={actionLoading}
        onApprove={(id) => updateStatus(id, 'approved')}
        onReject={(deal) => {
          setSelectedDeal(deal)
          setIsRejectModalOpen(true)
        }}
        onView={(id) => navigate(`/deals/${id}`, { state: { deal: deals.find(d => d.id === id) } })}
      />

      {/* Pagination */}
      {!isLoading && filteredDeals.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 px-2">
          <div className="text-sm text-white/50">
            Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, totalEntries)} of {totalEntries} entries
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/60 transition-all duration-300 hover:border-[#01F27B]/40 hover:text-white disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={2} />
            </button>
            
            {[...Array(totalPages)].map((_, i) => {
              // Show only a few page buttons if there are many pages
              if (totalPages > 7) {
                if (i + 1 !== 1 && i + 1 !== totalPages && (i + 1 < page - 1 || i + 1 > page + 1)) {
                  if (i + 1 === page - 2 || i + 1 === page + 2) {
                    return <span key={i} className="px-1 text-white/20">...</span>
                  }
                  return null
                }
              }

              return (
                <button 
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`flex h-9 w-9 items-center justify-center rounded-2xl text-sm font-semibold transition-all duration-300 hover:scale-[1.02] ${page === i + 1 ? 'bg-[#01F27B] text-black shadow-[0_0_20px_rgba(1,242,123,0.3)]' : 'border border-white/10 bg-white/5 text-white/60 hover:border-[#01F27B]/40 hover:text-white'}`}
                >
                  {i + 1}
                </button>
              )
            })}

            <button 
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/60 transition-all duration-300 hover:border-[#01F27B]/40 hover:text-white disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      )}

      {/* Overlays */}
      <RejectionModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        startupName={selectedDeal?.basicInfo?.startupName}
        onConfirm={(reason) => updateStatus(selectedDeal.id, 'rejected', reason)}
      />
    </div>
  )
}

export default Deals

