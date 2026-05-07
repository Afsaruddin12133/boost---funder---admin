import { ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export const glassCardClass =
  'rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_40px_rgba(1,242,123,0.15)]'

export const primaryButtonClass =
  'inline-flex items-center justify-center rounded-2xl bg-[#01F27B] px-4 py-2.5 text-sm font-semibold text-black shadow-[0_0_20px_rgba(1,242,123,0.3)] transition-all duration-300 hover:bg-[#00d66d] hover:scale-[1.02]'

export const outlineButtonClass =
  'inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:border-[#01F27B]/40 hover:scale-[1.02]'

export const fieldClass =
  'w-full rounded-2xl border border-white/10 bg-[#0c0c0c]/80 px-4 py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/40 focus:border-[#01F27B]/40 focus:shadow-[0_0_40px_rgba(1,242,123,0.15)] backdrop-blur-md'

export const selectClass =
  'appearance-none w-full rounded-2xl border border-white/10 bg-[#0c0c0c]/80 px-4 py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/40 focus:border-[#01F27B]/40 focus:shadow-[0_0_40px_rgba(1,242,123,0.15)] backdrop-blur-md'

export const textareaClass =
  'w-full rounded-2xl border border-white/10 bg-[#0c0c0c]/80 px-4 py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/40 focus:border-[#01F27B]/40 focus:shadow-[0_0_40px_rgba(1,242,123,0.15)] backdrop-blur-md'

export const statusBadgeClass =
  'inline-flex items-center rounded-md bg-[#01F27B]/10 px-2 py-1 text-xs font-semibold text-[#01F27B]'

const joinClasses = (...classes) => classes.filter(Boolean).join(' ')

export const Select = ({ value, onChange, options, className, placeholder = 'Select...' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find((opt) => opt.value === value)

  return (
    <div className={joinClasses('relative', className)} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={joinClasses(
          selectClass,
          'flex items-center justify-between gap-2 text-left pr-10',
          isOpen && 'border-[#01F27B]/40 shadow-[0_0_40px_rgba(1,242,123,0.15)]'
        )}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={joinClasses(
            'absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40 transition-transform duration-300',
            isOpen && 'rotate-180 text-[#01F27B]'
          )}
          strokeWidth={2}
        />
      </button>

      {isOpen && (
        <div className={joinClasses(
          'absolute top-[calc(100%+8px)] left-0 z-[100] w-full min-w-[160px] overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0c] p-1.5 shadow-2xl animate-in fade-in zoom-in-95 duration-200 backdrop-blur-xl'
        )}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              className={joinClasses(
                'w-full rounded-xl px-3 py-2 text-left text-sm transition-all duration-200',
                value === option.value
                  ? 'bg-[#01F27B]/10 text-[#01F27B]'
                  : 'text-white/70 hover:bg-white/5 hover:text-white'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}


export const PageHeader = ({ eyebrow, title, description, actions }) => (
  <div className={joinClasses(glassCardClass, 'relative overflow-hidden p-6')}>
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#0c2014] via-black to-[#0a1b12] opacity-90" />
    <div className="pointer-events-none absolute -left-16 top-0 h-32 w-32 rounded-full bg-[#01F27B]/10 blur-3xl" />
    <div className="relative flex flex-wrap items-start justify-between gap-4">
      <div className="max-w-2xl space-y-2">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/50">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-3xl font-semibold text-white">{title}</h1>
        {description ? <p className="text-sm leading-6 text-white/70">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  </div>
)

export const SectionTitle = ({ title, action }) => (
  <div className="flex items-center justify-between gap-4">
    <h2 className="text-lg font-semibold text-white">{title}</h2>
    {action ? action : null}
  </div>
)

export const EmptyState = ({ title, description }) => (
  <div className={joinClasses(glassCardClass, 'flex flex-col items-center justify-center px-6 py-16 text-center')}>
    <p className="text-sm font-semibold text-white">{title}</p>
    {description ? <p className="mt-2 max-w-md text-sm text-white/60">{description}</p> : null}
  </div>
)

export const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div className={joinClasses(glassCardClass, 'relative w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300')}>
        <div className="border-b border-white/10 px-6 py-4">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}

export const ProgressBar = ({ progress, label, color = "#01F27B" }) => (
  <div className="space-y-2">
    {label && (
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40">
        <span>{label}</span>
        <span>{progress}%</span>
      </div>
    )}
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
      <div 
        className="h-full transition-all duration-1000 shadow-[0_0_15px_rgba(1,242,123,0.3)]"
        style={{ 
          width: `${Math.min(progress, 100)}%`,
          backgroundColor: color
        }}
      />
    </div>
  </div>
)
