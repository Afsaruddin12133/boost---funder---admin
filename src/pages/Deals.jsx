import { useEffect, useMemo, useState } from 'react'
import { EmptyState, PageHeader } from '../components/BoostFundrUI'
import DealCard from '../components/deals/DealCard'
import FilterBar from '../components/deals/FilterBar'
import { getToken } from '../lib/utils'
import apiClient from '../services/apiClient'

const Deals = () => {
  const [deals, setDeals] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [filters, setFilters] = useState({ status: 'all deals', category: 'all', search: '' })
  const [actionLoading, setActionLoading] = useState({})
  const [page, setPage] = useState(1)
  const pageSize = 9

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

        console.log(data);
        

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
    const set = new Set(deals.map((deal) => deal.category).filter(Boolean))
    return Array.from(set)
  }, [deals])

  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      const statusMatch = filters.status === 'all deals' || deal.status === filters.status
      const categoryMatch = filters.category === 'all' || deal.category === filters.category
      const searchMatch = deal.startupName
        ?.toLowerCase()
        .includes(filters.search.trim().toLowerCase())
      return statusMatch && categoryMatch && (filters.search ? searchMatch : true)
    })
  }, [deals, filters])

  const pagedDeals = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredDeals.slice(start, start + pageSize)
  }, [filteredDeals, page])

  const totalPages = Math.max(1, Math.ceil(filteredDeals.length / pageSize))

  const updateStatus = (id, status) => {
    setActionLoading((prev) => ({ ...prev, [id]: status }))
    setDeals((prev) => prev.map((deal) => (deal.id === id ? { ...deal, status } : deal)))
    window.setTimeout(() => {
      setActionLoading((prev) => ({ ...prev, [id]: null }))
    }, 300)
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
            {filteredDeals.length} deals
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

      {isLoading ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-10 text-center text-white/70 backdrop-blur-xl">
          Loading deals...
        </div>
      ) : (
        pagedDeals.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pagedDeals.map((deal) => (
              <DealCard
                key={deal.id}
                deal={deal}
                actionState={actionLoading[deal.id]}
                onApprove={(id) => updateStatus(id, 'approved')}
                onReject={(id) => updateStatus(id, 'rejected')}
                onView={(id) => console.info('View deal', id)}
                onFeature={(id) => console.info('Feature deal', id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No deals matched your filters."
            description="Adjust the status, category, or search filter to surface more opportunities."
          />
        )
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-white/60">
          Page {page} of {totalPages}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition-all duration-300 hover:border-[#01F27B]/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition-all duration-300 hover:border-[#01F27B]/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default Deals
