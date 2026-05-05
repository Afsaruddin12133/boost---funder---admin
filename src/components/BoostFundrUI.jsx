export const glassCardClass =
  'rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_40px_rgba(1,242,123,0.15)]'

export const primaryButtonClass =
  'inline-flex items-center justify-center rounded-2xl bg-[#01F27B] px-4 py-2.5 text-sm font-semibold text-black shadow-[0_0_20px_rgba(1,242,123,0.3)] transition-all duration-300 hover:bg-[#00d66d] hover:scale-[1.02]'

export const outlineButtonClass =
  'inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:border-[#01F27B]/40 hover:scale-[1.02]'

export const fieldClass =
  'w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/40 focus:border-[#01F27B]/40 focus:shadow-[0_0_40px_rgba(1,242,123,0.15)]'

export const selectClass =
  'appearance-none w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/40 focus:border-[#01F27B]/40 focus:shadow-[0_0_40px_rgba(1,242,123,0.15)]'

export const textareaClass =
  'w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/40 focus:border-[#01F27B]/40 focus:shadow-[0_0_40px_rgba(1,242,123,0.15)]'

export const statusBadgeClass =
  'inline-flex items-center rounded-md bg-[#01F27B]/10 px-2 py-1 text-xs font-semibold text-[#01F27B]'

const joinClasses = (...classes) => classes.filter(Boolean).join(' ')

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
