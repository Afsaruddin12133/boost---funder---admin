import { ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const CategorySelect = ({ value, categories, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-white/25 bg-gradient-to-r from-black/70 via-[#0B1D13] to-black/60 px-4 py-2 text-sm text-white outline-none transition hover:border-white/40 focus:border-[#01F27B]/50 focus:ring-1 focus:ring-[#01F27B]/50"
      >
        <span className="min-w-[90px] text-left">{value === 'all' ? 'All Categories' : value}</span>
        <ChevronDown className={`h-4 w-4 text-white/70 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} strokeWidth={1.8} />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 w-full min-w-[180px] overflow-hidden rounded-[20px] border border-[#1a1a1a] bg-[#0c0c0c] p-2 shadow-2xl">
          <button
            type="button"
            onClick={() => {
              onChange('all')
              setIsOpen(false)
            }}
            className={`mb-1 w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-white/10 ${
              value === 'all' ? 'bg-white/15 text-white' : 'text-white/80'
            }`}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => {
                onChange(category)
                setIsOpen(false)
              }}
              className={`mb-1 w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors last:mb-0 hover:bg-white/10 ${
                value === category ? 'bg-white/15 text-white' : 'text-white/80'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default CategorySelect
