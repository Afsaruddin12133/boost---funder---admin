import { FileText, Maximize2 } from 'lucide-react'
import { statusBadgeClass } from '../BoostFundrUI'

export const StatusBadge = ({ status }) => {
  return (
    <span className={`${statusBadgeClass} uppercase tracking-wider`}>
      {status}
    </span>
  )
}

export const RoleBadge = ({ role }) => {
  const isFounder = role === 'founder'
  return (
    <span className={`rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-wider ${isFounder ? 'bg-white/10 text-white/70' : 'bg-white/10 text-white/70'}`}>
      {role}
    </span>
  )
}

export const DocumentPreview = ({ title, url, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all duration-300 hover:scale-[1.02] hover:border-[#01F27B]/40"
    >
      <div className="relative flex h-32 w-full items-center justify-center overflow-hidden bg-white/5">
        <img src={url} alt={title} className="h-full w-full object-cover opacity-60 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Maximize2 className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="p-3 flex items-center gap-2">
        <FileText className="w-4 h-4 text-white/50" />
        <p className="text-xs font-semibold text-white/80">{title}</p>
      </div>
    </div>
  )
}
