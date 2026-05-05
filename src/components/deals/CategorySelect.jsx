import { ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { glassCardClass } from '../BoostFundrUI'

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
        className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all duration-300 hover:border-[#01F27B]/40 hover:scale-[1.02] focus:border-[#01F27B]/40"
      >
        <span className="min-w-[90px] text-left">{value === 'all' ? 'All Categories' : value}</span>
        <ChevronDown className={`h-4 w-4 text-white/70 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} strokeWidth={1.8} />
      </button>

      {isOpen && (
        <div className={`absolute left-0 top-full z-50 mt-2 w-full min-w-[180px] overflow-hidden p-2 ${glassCardClass}`}>
          <button
            type="button"
            onClick={() => {
              onChange('all')
              setIsOpen(false)
            }}
            className={`mb-1 w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all duration-300 hover:bg-white/10 ${
              value === 'all' ? 'bg-[#01F27B]/10 text-[#01F27B]' : 'text-white/80'
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
              className={`mb-1 w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all duration-300 last:mb-0 hover:bg-white/10 ${
                value === category ? 'bg-[#01F27B]/10 text-[#01F27B]' : 'text-white/80'
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
