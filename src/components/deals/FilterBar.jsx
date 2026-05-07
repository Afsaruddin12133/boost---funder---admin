import { Filter, Search } from 'lucide-react'
import { fieldClass, glassCardClass } from '../BoostFundrUI'
import CategorySelect from './CategorySelect'

const FilterBar = ({ filters, categories, onChange }) => {
  const statuses = ['pendingReview', 'approved', 'rejected']

  return (
    <div className={`${glassCardClass} relative z-30 flex flex-wrap items-center gap-3 px-4 py-3`}>
      <div className="flex items-center gap-2 text-sm text-white/70">
        <Filter className="h-4 w-4" strokeWidth={1.8} />
        Filters
      </div>
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-xl">
        {statuses.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => onChange({ status })}
            className={`rounded-xl cursor-pointer px-3 py-1.5 text-xs font-semibold capitalize transition-all duration-300 hover:scale-[1.02] ${
              filters.status === status
                ? 'bg-[#01F27B] text-black shadow-[0_0_20px_rgba(1,242,123,0.3)]'
                : 'border border-white/10 bg-white/5 text-white/70 hover:border-[#01F27B]/40 hover:text-white'
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
      <div className={`flex flex-1 items-center gap-2 ${fieldClass} px-3 py-2`}>
        <Search className="h-4 w-4" strokeWidth={1.8} />
        <input
          type="text"
          value={filters.search}
          onChange={(event) => onChange({ search: event.target.value })}
          placeholder="Search by startup name"
          className="w-full bg-transparent text-white placeholder:text-white/40 focus:outline-none"
        />
      </div>
    </div>
  )
}

export default FilterBar
