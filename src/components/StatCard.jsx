
const StatCard = ({ title, value, growth, icon }) => {
  const isPositive = growth?.startsWith('+')

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl shadow-[0_0_40px_rgba(1,242,123,0.15)] transition-all duration-300 hover:scale-[1.02] hover:border-white/20">
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#01F27B]/10 text-[#01F27B]">
          {icon}
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            isPositive
              ? 'bg-[#01F27B]/10 text-[#01F27B]'
              : 'bg-white/10 text-white/60'
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
