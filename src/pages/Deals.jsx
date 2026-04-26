import { useEffect, useMemo, useState } from 'react'
import apiClient from '../services/apiClient'
import { getToken } from '../lib/utils'
import FilterBar from '../components/deals/FilterBar'
import DealCard from '../components/deals/DealCard'

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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50">Deals</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Deal Management</h1>
          <p className="mt-2 text-sm text-white/60">
            Review, approve, and manage startup deals with real-time context.
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white/70">
          {filteredDeals.length} deals
        </div>
      </div>

      <FilterBar
        filters={filters}
        categories={categories}
        onChange={(next) => {
          setFilters((prev) => ({ ...prev, ...next }))
          setPage(1)
        }}
      />

      {errorMessage ? (
        <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {errorMessage}
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-3xl border border-white/10 bg-black/40 px-6 py-10 text-center text-white/70">
          Loading deals...
        </div>
      ) : (
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
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:border-white/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:border-white/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default Deals
