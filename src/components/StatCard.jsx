
const StatCard = ({ title, value, growth, icon }) => {
  const isPositive = growth?.startsWith('+')

  return (
    <div className="rounded-2xl border border-white/10 bg-black/50 p-5 shadow-sm shadow-black/40">
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#01F27B]/15 text-[#01F27B]">
          {icon}
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            isPositive
              ? 'bg-emerald-500/15 text-emerald-200'
              : 'bg-rose-500/15 text-rose-200'
          }`}
        >
          {growth}
        </span>
      </div>
      <div className="mt-4">
        <p className="text-sm text-white/60">{title}</p>
        <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
      </div>
    </div>
  )
}

export default StatCard
