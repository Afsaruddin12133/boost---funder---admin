import React, { useState } from 'react'
import { Search, Eye, Filter, ChevronDown } from 'lucide-react'
import { StatusBadge, RoleBadge } from './ui'

const VerificationList = ({ verifications, onView }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')

  const filtered = verifications.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || v.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter
    const matchesRole = roleFilter === 'all' || v.role === roleFilter
    return matchesSearch && matchesStatus && matchesRole
  })

  return (
    <div className="space-y-4">
      {/* Filters & Search */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-white/40 outline-none focus:border-[#01F27B]/50 focus:ring-1 focus:ring-[#01F27B]/30 transition-all"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Role Filter */}
          <div className="relative">
            <select 
              value={roleFilter} 
              onChange={(e) => setRoleFilter(e.target.value)}
              className="appearance-none rounded-xl border border-white/10 bg-black/40 px-4 py-2 pr-10 text-sm font-semibold text-white/70 transition hover:border-white/20 focus:border-[#01F27B]/50 focus:outline-none focus:ring-1 focus:ring-[#01F27B]/50 cursor-pointer min-w-[130px]"
            >
              <option value="all">All Roles</option>
              <option value="founder">Founder</option>
              <option value="investor">Investor</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" strokeWidth={2} />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 items-center bg-black/40 border border-white/10 rounded-xl p-1">
            <Filter className="w-4 h-4 text-white/40 ml-2" />
            {['all', 'pending', 'approved', 'rejected'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  statusFilter === s ? 'bg-[#01F27B]/15 text-[#01F27B]' : 'text-white/50 hover:text-white/80'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/50 shadow-sm shadow-black/40">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-white/50">
            <tr>
              <th className="px-6 py-4 font-semibold">User</th>
              <th className="px-6 py-4 font-semibold">Role</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {filtered.map(v => (
              <tr key={v.id} className="text-white/80 transition-colors hover:bg-white/5 group">
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-bold text-white flex items-center gap-2">
                      {v.name}
                      {v.verified && <span className="w-1.5 h-1.5 rounded-full bg-[#01F27B]" title="Verified User" />}
                    </p>
                    <p className="text-xs text-white/40 mt-0.5">{v.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <RoleBadge role={v.role} />
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={v.status} />
                </td>
                <td className="px-6 py-4 text-sm text-white/60">
                  {new Date(v.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => onView(v)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 text-xs font-semibold text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Review
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-sm text-white/40">
                  No verifications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default VerificationList
