import React from 'react'
import { FileText, Maximize2 } from 'lucide-react'

export const StatusBadge = ({ status }) => {
  const styles = {
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    approved: 'bg-[#01F27B]/10 text-[#01F27B] border-[#01F27B]/20',
    rejected: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  }
  return (
    <span className={`px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider ${styles[status]}`}>
      {status}
    </span>
  )
}

export const RoleBadge = ({ role }) => {
  const isFounder = role === 'founder'
  return (
    <span className={`px-2 py-1 rounded text-[10px] font-semibold uppercase tracking-wider ${isFounder ? 'bg-indigo-500/10 text-indigo-400' : 'bg-fuchsia-500/10 text-fuchsia-400'}`}>
      {role}
    </span>
  )
}

export const DocumentPreview = ({ title, url, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group cursor-pointer rounded-xl border border-white/10 bg-black/40 overflow-hidden hover:border-[#01F27B]/40 transition-colors"
    >
      <div className="h-32 w-full bg-white/5 relative overflow-hidden flex items-center justify-center">
        <img src={url} alt={title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
