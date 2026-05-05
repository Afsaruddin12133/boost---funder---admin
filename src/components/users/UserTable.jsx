import { Ban, Eye, Trash2 } from 'lucide-react'
import { formatDate } from '../../lib/utils'
import { glassCardClass } from '../BoostFundrUI'

const RoleIcon = ({ role }) => {
  if (role === 'investor') {
    return (
      <svg className="h-4 w-4 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
        <path d="M18 14h-8" />
        <path d="M15 18h-5" />
        <path d="M10 6h8v4h-8V6Z" />
      </svg>
    )
  }
  return (
    <svg className="h-4 w-4 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  )
}

const UserTable = ({ users, isLoading, onViewUser, onDeleteUser, onSuspendUser }) => {
  if (isLoading) {
    return (
      <div className={`${glassCardClass} px-6 py-10 text-center text-white/70`}>
        Loading users...
      </div>
    )
  }

  if (!users || users.length === 0) {
    return (
      <div className={`${glassCardClass} px-6 py-10 text-center text-white/70`}>
        No users found.
      </div>
    )
  }

  return (
    <div className={`overflow-x-auto ${glassCardClass}`}>
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-white/50">
          <tr>
            <th className="px-4 py-4 w-12">
              <input type="checkbox" className="rounded border-white/20 bg-transparent text-[#01F27B] focus:ring-[#01F27B] cursor-pointer" />
            </th>
            <th className="px-4 py-4 font-semibold">Name & Email</th>
            <th className="px-4 py-4 font-semibold">Role</th>
            <th className="px-4 py-4 font-semibold">Verified</th>
            <th className="px-4 py-4 font-semibold">Suspended</th>
            <th className="px-4 py-4 font-semibold">Subscription Plan</th>
            <th className="px-4 py-4 font-semibold">Join Date</th>
            <th className="px-4 py-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {users.map((user) => (
            <tr key={user.id || user._id} className="text-white/80 transition-colors hover:bg-white/5 group">
              <td className="px-4 py-4">
                <input type="checkbox" className="cursor-pointer rounded border-white/20 bg-transparent text-[#01F27B] focus:ring-[#01F27B]" />
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-white/10 text-white/40">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-white transition-colors group-hover:text-[#01F27B]">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-xs text-white/40">{user.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-2 capitalize">
                  <RoleIcon role={user.role} />
                  {user.role}
                </div>
              </td>
              <td className="px-4 py-4">
                {user.isVerified ? (
                  <span className="rounded-md border border-[#01F27B]/20 bg-[#01F27B]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#01F27B]">
                    Yes
                  </span>
                ) : (
                  <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/50">
                    No
                  </span>
                )}
              </td>
              <td className="px-4 py-4">
                {user.isSuspended ? (
                  <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/50">
                    Suspended
                  </span>
                ) : (
                  <span className="rounded-md border border-[#01F27B]/20 bg-[#01F27B]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#01F27B]">
                    Active
                  </span>
                )}
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <div className={`h-1.5 w-1.5 rounded-full ${user.subscription?.plan === 'pro' ? 'bg-[#01F27B]' : 'bg-white/40'}`} />
                  <span className="text-white/60 capitalize">{user.subscription?.plan || 'Free'}</span>
                </div>
              </td>
              <td className="px-4 py-4 text-white/60">
                {formatDate(user.createdAt)}
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center justify-end gap-3 text-white/40">
                  <button 
                    onClick={() => onViewUser(user)}
                    className="cursor-pointer transition hover:text-white" 
                    title="View details"
                  >
                    <Eye className="h-4 w-4" strokeWidth={2} />
                  </button>
                  <button 
                    onClick={() => onSuspendUser && onSuspendUser(user)}
                    className="cursor-pointer transition hover:text-white" 
                    title="Suspend user"
                  >
                    <Ban className="h-4 w-4" strokeWidth={2} />
                  </button>
                  <button 
                    onClick={() => onDeleteUser && onDeleteUser(user)}
                    className="cursor-pointer transition hover:text-[#01F27B]" 
                    title="Delete user"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserTable
