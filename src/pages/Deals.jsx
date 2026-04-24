import {
    BadgeCheck,
    Calendar,
    CheckCircle2,
    Clock,
    Eye,
    Filter,
    MapPin,
    Search,
    Star,
    TrendingUp,
    XCircle,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import apiClient from '../services/apiClient'

const TOKEN_STORAGE_KEY = import.meta.env.VITE_TOKEN_STORAGE_KEY

const statusStyles = {
  draft: 'bg-white/10 text-white/70',
  pendingReview: 'bg-amber-500/20 text-amber-200',
  approved: 'bg-emerald-500/20 text-emerald-200',
  rejected: 'bg-rose-500/20 text-rose-200',
  complete: 'bg-cyan-500/20 text-cyan-200',
}

const formatCurrency = (amount, currency = 'USD') => {
  if (amount == null) return '--'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

const formatDate = (value) => {
  if (!value) return '--'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '--'
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const isNewDeal = (createdAt) => {
  if (!createdAt) return false
  const created = new Date(createdAt).getTime()
  const now = Date.now()
  return now - created < 1000 * 60 * 60 * 24 * 5
}

const getToken = () => {
  if (!TOKEN_STORAGE_KEY) return null
  return localStorage.getItem(TOKEN_STORAGE_KEY) || sessionStorage.getItem(TOKEN_STORAGE_KEY)
}

const FilterBar = ({ filters, categories, onChange }) => {
  const statuses = ['pendingReview', 'approved', 'rejected', 'draft', 'complete']

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-white/30 bg-gradient-to-br from-[#0B2013] via-[#0A1911] to-black/80 px-4 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.12)]">
      <div className="flex items-center gap-2 text-sm text-white">
        <Filter className="h-4 w-4" strokeWidth={1.8} />
        Filters
      </div>
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-white/25 bg-gradient-to-r from-black/70 via-[#0B1D13] to-black/60 px-3 py-2">
        {statuses.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => onChange({ status })}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition ${
              filters.status === status
                ? 'bg-gradient-to-r from-[#01F27B] to-[#7CFFB2] text-black'
                : 'border border-white/15 text-white/70 hover:border-white/40 hover:text-white'
            }`}
          >
            {status === 'pendingReview' ? 'Pending Review' : status}
          </button>
        ))}
      </div>
      <select
        value={filters.category}
        onChange={(event) => onChange({ category: event.target.value })}
        className="rounded-xl border border-white/25 bg-gradient-to-r from-black/70 via-[#0B1D13] to-black/60 px-3 py-2 text-sm text-white"
      >
        <option value="all" className="text-black">All Categories</option>
        {categories.map((category) => (
          <option key={category} value={category} className="text-black">
            {category}
          </option>
        ))}
      </select>
      <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/25 bg-gradient-to-r from-black/70 via-[#0B1D13] to-black/60 px-3 py-2 text-sm text-white">
        <Search className="h-4 w-4" strokeWidth={1.8} />
        <input
          type="text"
          value={filters.search}
          onChange={(event) => onChange({ search: event.target.value })}
          placeholder="Search by startup name"
          className="w-full bg-transparent text-white placeholder:text-white/60 focus:outline-none"
        />
      </div>
    </div>
  )
}

const StatusBadge = ({ status }) => {
  const label = status === 'pendingReview' ? 'Pending Review' : status
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[status] || 'bg-white/10 text-white/70'}`}>
      {label}
    </span>
  )
}

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

const Deals = () => {
  const [deals, setDeals] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [filters, setFilters] = useState({ status: 'pendingReview', category: 'all', search: '' })
  const [actionLoading, setActionLoading] = useState({})
  const [page, setPage] = useState(1)
  const pageSize = 6

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
      const statusMatch = filters.status === 'all' || deal.status === filters.status
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
        <div className="grid gap-6 lg:grid-cols-2">
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
