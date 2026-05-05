import { Award, Ban, ChevronDown, ChevronLeft, ChevronRight, Download, ShieldAlert, Trash2, TrendingUp, UserPlus, Users as UsersIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { PageHeader, glassCardClass, outlineButtonClass, primaryButtonClass, selectClass } from '../components/BoostFundrUI'
import UserDetailsModal from '../components/users/UserDetailsModal'
import UserTable from '../components/users/UserTable'
import { getToken } from '../lib/utils'
import apiClient from '../services/apiClient'

const StatCard = ({ icon: Icon, title, value, trend, trendLabel, trendUp, alert }) => (
  <div className="group relative overflow-hidden flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#0c0c0c] p-5 shadow-lg transition-all duration-300 hover:border-[#01F27B]/30 hover:shadow-[#01F27B]/5">
    {/* Gradient Backgrounds */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#01F27B]/5 via-black/50 to-black/80 opacity-60 transition-opacity duration-300 group-hover:opacity-100"></div>
    <div className="absolute -inset-x-20 -top-20 h-[150px] w-full rotate-45 bg-gradient-to-b from-[#01F27B]/20 to-transparent opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"></div>
    
    <div className="relative z-10 flex items-start justify-between">
      <div className="rounded-xl bg-gradient-to-br from-white/10 to-transparent p-2.5 text-white/90 shadow-inner shadow-white/5 ring-1 ring-white/10 backdrop-blur-md transition-all duration-300 group-hover:text-[#01F27B] group-hover:ring-[#01F27B]/30">
        <Icon className="h-5 w-5" strokeWidth={1.8} />
      </div>
      {trend ? (
        <span className={`rounded-full border px-2 py-1 text-[10px] font-bold backdrop-blur-sm ${trendUp ? 'border-emerald-500/20 bg-emerald-500/10 text-[#01F27B]' : 'border-rose-500/20 bg-rose-500/10 text-rose-400'}`}>
          {trend}
        </span>
      ) : alert ? (
        <span className="rounded-full border border-rose-500/20 bg-rose-500/10 px-2 py-1 text-[10px] font-bold text-rose-400 backdrop-blur-sm">
          {alert}
        </span>
      ) : trendLabel ? (
        <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-[#01F27B] backdrop-blur-sm">
          {trendLabel}
        </span>
      ) : null}
    </div>
    <div className="relative z-10">
      <h3 className="text-3xl font-bold tracking-tight text-white">{value}</h3>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-white/40 group-hover:text-white/60 transition-colors duration-300">{title}</p>
    </div>
  </div>
)

const Users = () => {
  const [allUsers, setAllUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [page, setPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState(null)
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [suspendFilter, setSuspendFilter] = useState('')
  const [subscriptionFilter, setSubscriptionFilter] = useState('')
  const limit = 10

  const refreshUsers = async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const token = getToken()
      if (!token) throw new Error('Missing auth token.')

      const response = await apiClient.request(`/api/v1/users/all?limit=1000`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      const payload = response?.data?.items || response?.data?.users || response?.data || []
      const usersArray = Array.isArray(payload) ? payload : []
      setAllUsers(usersArray)
    } catch (error) {
      setErrorMessage(error.message || 'Unable to load users.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value)
    setPage(1)
  }

  const handleResetFilters = () => {
    setRoleFilter('')
    setStatusFilter('')
    setSuspendFilter('')
    setSubscriptionFilter('')
    setPage(1)
  }

  const filteredUsers = useMemo(() => {
    let filtered = allUsers

    if (roleFilter) {
      filtered = filtered.filter((u) => u.role === roleFilter)
    }
    if (statusFilter !== '') {
      const isVerified = statusFilter === 'true'
      filtered = filtered.filter((u) => u.isVerified === isVerified)
    }
    if (subscriptionFilter) {
      filtered = filtered.filter((u) => u.subscription?.plan === subscriptionFilter)
    }
    if (suspendFilter !== '') {
      const isSuspended = suspendFilter === 'true'
      filtered = filtered.filter((u) => !!u.isSuspended === isSuspended)
    }

    return filtered
  }, [allUsers, roleFilter, statusFilter, suspendFilter, subscriptionFilter])

  const totalEntries = filteredUsers.length
  const totalPages = Math.max(1, Math.ceil(totalEntries / limit))
  const users = useMemo(() => {
    const startIndex = (page - 1) * limit
    return filteredUsers.slice(startIndex, startIndex + limit)
  }, [filteredUsers, page])

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
      return
    }

    try {
      const token = getToken()
      if (!token) throw new Error('Missing auth token.')

      const userId = user.id || user._id
      await apiClient.request(`/api/v1/users/all/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      
      toast.success('User deleted successfully')
      await refreshUsers()
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Failed to delete user.'
      setErrorMessage(msg)
      toast.error(msg)
    }
  }

  const handleSuspendUser = async (user) => {
    const action = user.isSuspended ? 'unsuspend' : 'suspend'
    let reason = ''

    if (action === 'suspend') {
      const input = window.prompt(`Please provide a reason to suspend ${user.firstName} ${user.lastName}:`)
      if (input === null) return // User cancelled the prompt
      
      reason = input.trim()
      if (!reason) {
        toast.error('A reason is required to suspend a user.')
        return
      }
    } else {
      if (!window.confirm(`Are you sure you want to unsuspend ${user.firstName} ${user.lastName}?`)) {
        return
      }
    }

    try {
      const token = getToken()
      if (!token) throw new Error('Missing auth token.')

      const userId = user.id || user._id
      await apiClient.request(`/api/v1/users/all/${userId}/suspend`, {
        method: 'PATCH',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isSuspended: !user.isSuspended, reason })
      })
      
      toast.success(`User ${action}ed successfully`)
      await refreshUsers()
    } catch (error) {
      const msg = error.response?.data?.message || error.message || `Failed to ${action} user.`
      setErrorMessage(msg)
      toast.error(msg)
    }
  }

  useEffect(() => {
    let isMounted = true

    const run = async () => {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const token = getToken()
        if (!token) throw new Error('Missing auth token.')

        const response = await apiClient.request(`/api/v1/users/all?limit=1000`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        const payload = response?.data?.items || response?.data?.users || response?.data || []
        const usersArray = Array.isArray(payload) ? payload : []
        if (isMounted) {
          setAllUsers(usersArray)
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message || 'Unable to load users.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void run()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="User Management"
        title="Users"
        description="Manage permissions, access levels, and subscription status for all platform members."
        actions={[
          <button key="export" className={outlineButtonClass}>
            <Download className="h-4 w-4" strokeWidth={2} />
            Export CSV
          </button>,
          <button key="create" className={primaryButtonClass}>
            <UserPlus className="h-4 w-4" strokeWidth={2} />
            Create Deal User
          </button>,
        ]}
      />

      {/* Top Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={UsersIcon} title="Total Platform Users" value={allUsers.length || 0} trend="+12%" trendUp />
        <StatCard icon={Award} title="Premium Subscribers" value={allUsers.filter(u => u.subscription?.plan === 'pro').length} />
        <StatCard icon={TrendingUp} title="Activity Retention" value="92.4%" trendLabel="ACTIVE" />
        <StatCard icon={ShieldAlert} title="Pending Verifications" value={allUsers.filter(u => !u.isVerified).length} alert={allUsers.filter(u => !u.isVerified).length > 0 ? "FLAGGED" : null} />
      </div>

      {/* Filters & Bulk Actions */}
      <div className={`${glassCardClass} flex flex-wrap items-center justify-between gap-4 p-4`}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select 
              value={roleFilter} 
              onChange={handleFilterChange(setRoleFilter)}
              className={`${selectClass} min-w-[140px] pr-10`}
            >
              <option value="">All Roles</option>
              <option value="founder">Founder</option>
              <option value="investor">Investor</option>
              <option value="guest">Guest</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" strokeWidth={2} />
          </div>

          <div className="relative">
            <select 
              value={statusFilter} 
              onChange={handleFilterChange(setStatusFilter)}
              className={`${selectClass} min-w-[140px] pr-10`}
            >
              <option value="">Status</option>
              <option value="true">Verified</option>
              <option value="false">Unverified</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" strokeWidth={2} />
          </div>

          <div className="relative">
            <select 
              value={suspendFilter} 
              onChange={handleFilterChange(setSuspendFilter)}
              className={`${selectClass} min-w-[140px] pr-10`}
            >
              <option value="">Suspension</option>
              <option value="true">Suspended</option>
              <option value="false">Active</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" strokeWidth={2} />
          </div>

          <div className="relative">
            <select 
              value={subscriptionFilter} 
              onChange={handleFilterChange(setSubscriptionFilter)}
              className={`${selectClass} min-w-[140px] pr-10`}
            >
              <option value="">Subscription</option>
              <option value="pro">Pro Plan</option>
              <option value="free">Free Plan</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" strokeWidth={2} />
          </div>

          <button 
            onClick={handleResetFilters}
            className={outlineButtonClass}
          >
            Reset
          </button>
        </div>
        
        <div className="flex items-center gap-4 rounded-2xl border border-[#01F27B]/20 bg-[#01F27B]/5 px-4 py-2 backdrop-blur-xl">
          <span className="text-xs font-semibold text-[#01F27B]">BULK ACTIONS:</span>
          <div className="flex items-center gap-2 border-l border-[#01F27B]/20 pl-4">
            <button className="rounded-lg p-1.5 text-white/40 transition hover:bg-white/10 hover:text-white" title="Block selected">
              <Ban className="h-4 w-4" strokeWidth={2} />
            </button>
            <button className="rounded-lg p-1.5 text-white/40 transition hover:bg-rose-500/20 hover:text-rose-400" title="Delete selected">
              <Trash2 className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      {/* Table Area */}
      {errorMessage && (
        <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {errorMessage}
        </div>
      )}

      <UserTable 
        users={users} 
        isLoading={isLoading} 
        onViewUser={setSelectedUser} 
        onDeleteUser={handleDeleteUser} 
        onSuspendUser={handleSuspendUser}
      />

      {/* Pagination */}
      {!isLoading && users.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 px-2">
          <div className="text-sm text-white/50">
            Showing {(page - 1) * limit + 1}-{Math.min(page * limit, totalEntries || users.length)} of {totalEntries || users.length} entries
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/60 transition-all duration-300 hover:border-[#01F27B]/40 hover:text-white disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={2} />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button 
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`flex h-9 w-9 items-center justify-center rounded-2xl text-sm font-semibold transition-all duration-300 hover:scale-[1.02] ${page === i + 1 ? 'bg-[#01F27B] text-black shadow-[0_0_20px_rgba(1,242,123,0.3)]' : 'border border-white/10 bg-white/5 text-white/60 hover:border-[#01F27B]/40 hover:text-white'}`}
              >
                {i + 1}
              </button>
            ))}
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/60 transition-all duration-300 hover:border-[#01F27B]/40 hover:text-white disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      )}



      {/* Details Modal */}
      {selectedUser && (
        <UserDetailsModal 
          userId={selectedUser.id || selectedUser._id} 
          onClose={() => setSelectedUser(null)} 
        />
      )}
    </div>
  )
}

export default Users
