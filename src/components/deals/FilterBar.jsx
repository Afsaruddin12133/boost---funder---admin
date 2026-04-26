import { Filter, Search } from 'lucide-react'
import CategorySelect from './CategorySelect'

const FilterBar = ({ filters, categories, onChange }) => {
  const statuses = ['all deals', 'draft', 'complete','pendingReview', 'approved', 'rejected' ]

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
            className={`rounded-xl cursor-pointer px-3 py-1.5 text-xs font-semibold capitalize transition ${
              filters.status === status
                ? 'bg-gradient-to-r from-[#01F27B] to-[#7CFFB2] text-black'
                : 'border border-white/15 text-white/70 hover:border-white/40 hover:text-white'
            }`}
          >
            {status === 'pendingReview' ? 'Pending Review' : status}
          </button>
        ))}
      </div>
      <CategorySelect
        value={filters.category}
        categories={categories}
        onChange={(category) => onChange({ category })}
      />
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

export default FilterBar
