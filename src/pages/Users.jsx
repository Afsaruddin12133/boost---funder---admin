import { Ban, ChevronLeft, ChevronRight, Download, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { PageHeader, Select, glassCardClass, outlineButtonClass } from '../components/BoostFundrUI'
import UserDetailsModal from '../components/users/UserDetailsModal'
import UserTable from '../components/users/UserTable'
import { getToken } from '../lib/utils'
import apiClient from '../services/apiClient'

const Users = () => {
  const [allUsers, setAllUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [page, setPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedUserIds, setSelectedUserIds] = useState([])
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [suspendFilter, setSuspendFilter] = useState('')
  const [subscriptionFilter, setSubscriptionFilter] = useState('')
  const limit = 10

  const refreshUsers = async () => {
    setIsLoading(true)
    setErrorMessage('')
    setSelectedUserIds([])

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

  const handleBulkDelete = async () => {
    if (!selectedUserIds.length) return
    if (!window.confirm(`Are you sure you want to delete ${selectedUserIds.length} selected users?`)) return

    try {
      const token = getToken()
      await Promise.all(selectedUserIds.map(id => 
        apiClient.request(`/api/v1/users/all/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        })
      ))
      
      toast.success(`Successfully deleted ${selectedUserIds.length} users`)
      await refreshUsers()
    } catch (error) {
      toast.error(error.message || 'Bulk delete failed')
    }
  }

  const handleBulkSuspend = async () => {
    if (!selectedUserIds.length) return
    const reason = window.prompt(`Reason for suspending ${selectedUserIds.length} users:`)
    if (reason === null) return

    try {
      const token = getToken()
      await Promise.all(selectedUserIds.map(id => 
        apiClient.request(`/api/v1/users/all/${id}/suspend`, {
          method: 'PATCH',
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ isSuspended: true, reason })
        })
      ))
      
      toast.success(`Successfully suspended ${selectedUserIds.length} users`)
      await refreshUsers()
    } catch (error) {
      toast.error(error.message || 'Bulk suspension failed')
    }
  }

  const handleFilterChange = (setter) => (val) => {
    setter(val)
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

  const handleExportCSV = () => {
    if (allUsers.length === 0) {
      toast.error('No users to export.')
      return
    }

    try {
      // Define CSV headers
      const headers = [
        'ID',
        'First Name',
        'Last Name',
        'Email',
        'Role',
        'Subscription Plan',
        'Verified Status',
        'Suspended',
        'Created Date',
        'Last Login',
        'Phone Number'
      ]

      // Map user data to CSV rows
      const rows = allUsers.map(user => [
        user._id || user.id || '',
        user.firstName || '',
        user.lastName || '',
        user.email || '',
        user.role || '',
        user.subscription?.plan || 'free',
        user.isVerified ? 'Yes' : 'No',
        user.isSuspended ? 'Yes' : 'No',
        user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '',
        user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : '',
        user.phoneNumber || ''
      ])

      // Create CSV content
      const csvContent = [
        headers.map(h => `"${h}"`).join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      ].join('\n')

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      
      link.setAttribute('href', url)
      link.setAttribute('download', `users_export_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success(`Exported ${allUsers.length} users to CSV.`)
    } catch (error) {
      const msg = error.message || 'Failed to export users.'
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
          <button key="export" className={outlineButtonClass} onClick={handleExportCSV}>
            <Download className="h-4 w-4" strokeWidth={2} />
            Export CSV
          </button>,
        ]}
      />

      {/* User Table */}
      <div className={`${glassCardClass} relative z-30 flex flex-wrap items-center justify-between gap-4 p-4`}>
        <div className="flex items-center gap-3">
          <Select
            value={roleFilter}
            onChange={handleFilterChange(setRoleFilter)}
            className="min-w-[140px]"
            options={[
              { value: '', label: 'All Roles' },
              { value: 'founder', label: 'Founder' },
              { value: 'investor', label: 'Investor' },
              { value: 'guest', label: 'Guest' },
            ]}
          />

          <Select
            value={statusFilter}
            onChange={handleFilterChange(setStatusFilter)}
            className="min-w-[140px]"
            options={[
              { value: '', label: 'Status' },
              { value: 'true', label: 'Verified' },
              { value: 'false', label: 'Unverified' },
            ]}
          />

          <Select
            value={suspendFilter}
            onChange={handleFilterChange(setSuspendFilter)}
            className="min-w-[140px]"
            options={[
              { value: '', label: 'Suspension' },
              { value: 'true', label: 'Suspended' },
              { value: 'false', label: 'Active' },
            ]}
          />

          <Select
            value={subscriptionFilter}
            onChange={handleFilterChange(setSubscriptionFilter)}
            className="min-w-[140px]"
            options={[
              { value: '', label: 'Subscription' },
              { value: 'pro', label: 'Pro Plan' },
              { value: 'free', label: 'Free Plan' },
            ]}
          />

          <button 
            onClick={handleResetFilters}
            className={outlineButtonClass}
          >
            Reset
          </button>
        </div>
        
        <div className={`flex items-center gap-4 rounded-2xl border border-[#01F27B]/20 bg-[#01F27B]/5 px-4 py-2 backdrop-blur-xl transition-all duration-300 ${selectedUserIds.length > 0 ? 'opacity-100 scale-100' : 'opacity-40 scale-95 grayscale pointer-events-none'}`}>
          <div className="flex flex-col">
            <span className="text-[10px] font-black tracking-widest text-[#01F27B]">BULK ACTIONS</span>
            <span className="text-[9px] font-bold text-white/40">{selectedUserIds.length} selected</span>
          </div>
          <div className="flex items-center gap-2 border-l border-[#01F27B]/20 pl-4">
            <button 
              onClick={handleBulkSuspend}
              disabled={selectedUserIds.length === 0}
              className="rounded-lg p-1.5 text-[#01F27B] transition hover:bg-[#01F27B]/20" 
              title="Suspend selected"
            >
              <Ban className="h-4 w-4" strokeWidth={2.5} />
            </button>
            <button 
              onClick={handleBulkDelete}
              disabled={selectedUserIds.length === 0}
              className="rounded-lg p-1.5 text-rose-500 transition hover:bg-rose-500/20" 
              title="Delete selected"
            >
              <Trash2 className="h-4 w-4" strokeWidth={2.5} />
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
        selectedUserIds={selectedUserIds}
        onSelectionChange={setSelectedUserIds}
      />

      {/* Pagination */}
      {!isLoading && users.length > 0 && (
        <div className="relative z-30 flex flex-wrap items-center justify-between gap-4 px-2">
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
