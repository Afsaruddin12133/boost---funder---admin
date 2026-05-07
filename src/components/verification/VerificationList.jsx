import { ChevronDown, Eye, Filter, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { fieldClass, glassCardClass, selectClass, Select } from '../BoostFundrUI'
import { RoleBadge, StatusBadge } from './ui'

const PAGE_SIZE = 6

const VerificationList = ({ verifications, onView }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  const filtered = useMemo(() => {
    return verifications.filter((item) => {
      const fullName = `${item.userId?.firstName || ''} ${item.userId?.lastName || ''}`.trim()
      const email = item.userId?.email || ''
      const matchesSearch =
        fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter
      const matchesType = typeFilter === 'all' || item.type === typeFilter
      return matchesSearch && matchesStatus && matchesType
    })
  }, [verifications, searchTerm, statusFilter, typeFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE
    return filtered.slice(startIndex, startIndex + PAGE_SIZE)
  }, [filtered, currentPage])

  const documentCount = (documents) => Object.values(documents || {}).filter(Boolean).length

  const handleChangeFilter = (setter) => (value) => {
    setter(value)
    setCurrentPage(1)
  }

  return (
    <div className="space-y-4">
      <div className="relative z-30 flex flex-wrap items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => handleChangeFilter(setSearchTerm)(e.target.value)}
            className={`${fieldClass} pl-10 pr-4 py-2`}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Select
            value={typeFilter}
            onChange={handleChangeFilter(setTypeFilter)}
            className="min-w-[130px]"
            options={[
              { value: 'all', label: 'All Types' },
              { value: 'founder', label: 'Founder' },
              { value: 'investor', label: 'Investor' },
            ]}
          />

          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-1">
            <Filter className="ml-2 h-4 w-4 text-white/40" />
            {['all', 'pending', 'approved', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => handleChangeFilter(setStatusFilter)(status)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold capitalize transition-all duration-300 hover:scale-[1.02] ${
                  statusFilter === status ? 'bg-[#01F27B]/10 text-[#01F27B]' : 'text-white/50 hover:text-white/80'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={`${glassCardClass} overflow-x-auto`}>
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-white/50">
            <tr>
              <th className="px-6 py-4 font-semibold">Applicant</th>
              <th className="px-6 py-4 font-semibold">Type</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Docs</th>
              <th className="px-6 py-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {pageItems.map((item) => {
              const user = item.userId || {}
              const fullName = `${user.firstName || 'Unknown'} ${user.lastName || 'Applicant'}`.trim()

              return (
                <tr key={item._id} className="group text-white/80 transition-colors hover:bg-white/5">
                  <td className="px-6 py-4">
                    <div>
                      <p className="flex items-center gap-2 text-sm font-bold text-white">
                        {fullName}
                        {user.isVerified ? <span className="h-1.5 w-1.5 rounded-full bg-[#01F27B]" title="Verified User" /> : null}
                      </p>
                      <p className="mt-0.5 text-xs text-white/40">{user.email || 'No email on record'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <RoleBadge role={item.type} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-white/60">
                    {documentCount(item.documents)} file{documentCount(item.documents) === 1 ? '' : 's'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onView(item)}
                      className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/70 transition-all duration-300 hover:scale-[1.02] hover:border-[#01F27B]/40 hover:text-white"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Review
                    </button>
                  </td>
                </tr>
              )
            })}

            {pageItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm text-white/40">
                  No verifications found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <p className="text-sm text-white/50">
          Showing {pageItems.length} of {filtered.length} matching requests, page {currentPage} of {totalPages}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition-all duration-300 hover:border-[#01F27B]/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            disabled={currentPage === totalPages}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition-all duration-300 hover:border-[#01F27B]/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default VerificationList
