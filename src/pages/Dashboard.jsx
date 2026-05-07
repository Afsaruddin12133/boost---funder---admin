import { ArrowRight, Award, Briefcase, CheckCircle, CircleDollarSign, Rocket, Star, TrendingUp, UserRound, Users, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { PageHeader, SectionTitle, glassCardClass, outlineButtonClass, primaryButtonClass } from '../components/BoostFundrUI'
import StatCard from '../components/StatCard'
import Table from '../components/Table'
import { getToken } from '../lib/utils'
import apiClient from '../services/apiClient'

const activityRows = [
  {
    id: 1,
    user: 'Maya Carter',
    action: 'Approved',
    type: 'Seed Deal',
    date: 'Apr 22, 2026',
    status: 'approved',
  },
  {
    id: 2,
    user: 'Omar Ellis',
    action: 'Requested',
    type: 'Verification',
    date: 'Apr 22, 2026',
    status: 'pending',
  },
  {
    id: 3,
    user: 'Sasha Patel',
    action: 'Updated',
    type: 'Investor Profile',
    date: 'Apr 21, 2026',
    status: 'approved',
  },
  {
    id: 4,
    user: 'Jules Kim',
    action: 'Rejected',
    type: 'Deal Review',
    date: 'Apr 21, 2026',
    status: 'rejected',
  },
  {
    id: 5,
    user: 'Nico Reed',
    action: 'Submitted',
    type: 'Pitch Deck',
    date: 'Apr 20, 2026',
    status: 'pending',
  },
]

const columns = [
  { key: 'user', label: 'User', sortable: true },
  { key: 'action', label: 'Action', sortable: true },
  { key: 'type', label: 'Type', sortable: true },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'status', label: 'Status', type: 'status', sortable: true },
  {
    key: 'actions',
    label: 'Actions',
    render: () => (
      <div className="flex items-center gap-2">
        {['View', 'Edit', 'Delete'].map((label) => (
          <button
            key={label}
            type="button"
            className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-white/70 transition hover:border-white/30 hover:text-white"
          >
            {label}
          </button>
        ))}
      </div>
    ),
  },
]

const quickActions = [
  {
    title: 'Approve Deals',
    description: '12 pending approvals waiting in queue',
    action: 'Review now',
  },
  {
    title: 'Review Requests',
    description: '9 new verification requests today',
    action: 'Open inbox',
  },
  {
    title: 'Manage Users',
    description: 'Add or update investor accounts',
    action: 'Go to users',
  },
]

const Dashboard = () => {
  const [allUsers, setAllUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
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
        console.error('Failed to load users:', error)
        toast.error('Failed to load user data')
      } finally {
        setIsLoading(false)
      }
    }

    void fetchUsers()
  }, [])

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Dashboard Overview"
        title="Investment Platform Admin"
        description="Monitor investors, founders, and funding activity in real time."
        actions={[
          <button key="export" className={outlineButtonClass} type="button">
            Export
          </button>,
          <button key="new-deal" className={primaryButtonClass} type="button">
            New Deal
          </button>,
        ]}
      />

      {/* User Analytics - Professional Dashboard */}
      <div className="space-y-6">
        <SectionTitle title="User Analytics" />
        
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Platform Overview */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#01F27B]/10 via-[#0c0c0c] to-black/80 p-6 shadow-lg transition-all duration-300 hover:border-[#01F27B]/30 hover:shadow-[#01F27B]/10">
            <div className="absolute inset-0 bg-gradient-to-br from-[#01F27B]/5 via-transparent to-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <div className="absolute -inset-x-20 -top-20 h-[150px] w-full rotate-45 bg-gradient-to-b from-[#01F27B]/20 to-transparent opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"></div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white/70">Platform Overview</h3>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#01F27B]/20 text-[#01F27B]">
                  <Users className="h-5 w-5" strokeWidth={2} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 rounded-lg bg-white/5 p-4 backdrop-blur-sm">
                  <span className="text-xs text-white/60">Total Users</span>
                  <p className="text-2xl font-bold text-white">{allUsers.length || 0}</p>
                </div>
                <div className="space-y-2 rounded-lg bg-emerald-500/10 p-4 backdrop-blur-sm">
                  <span className="text-xs text-emerald-300">Active</span>
                  <p className="text-2xl font-bold text-emerald-400">{allUsers.filter(u => !u.isSuspended).length}</p>
                </div>
              </div>
              <div className="rounded-lg bg-rose-500/10 p-4 backdrop-blur-sm">
                <span className="text-xs text-rose-300">Suspended</span>
                <p className="text-2xl font-bold text-rose-400">{allUsers.filter(u => u.isSuspended).length}</p>
              </div>
            </div>
          </div>

          {/* Subscription Distribution */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-purple-500/10 via-[#0c0c0c] to-black/80 p-6 shadow-lg transition-all duration-300 hover:border-purple-500/30 hover:shadow-purple-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <div className="absolute -inset-x-20 -top-20 h-[150px] w-full rotate-45 bg-gradient-to-b from-purple-500/20 to-transparent opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"></div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white/70">Subscription Plans</h3>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/20 text-purple-400">
                  <Award className="h-5 w-5" strokeWidth={2} />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-blue-500/10 p-3 backdrop-blur-sm transition-all duration-300 hover:bg-blue-500/20">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-400" strokeWidth={2} />
                    <span className="text-sm text-white/80">Free Plan</span>
                  </div>
                  <p className="text-lg font-bold text-blue-400">{allUsers.filter(u => u.subscription?.plan === 'free' || !u.subscription?.plan).length}</p>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-yellow-500/10 p-3 backdrop-blur-sm transition-all duration-300 hover:bg-yellow-500/20">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-yellow-400" strokeWidth={2} />
                    <span className="text-sm text-white/80">Pro Plan</span>
                  </div>
                  <p className="text-lg font-bold text-yellow-400">{allUsers.filter(u => u.subscription?.plan === 'pro').length}</p>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-[#01F27B]/10 p-3 backdrop-blur-sm transition-all duration-300 hover:bg-[#01F27B]/20">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-[#01F27B]" strokeWidth={2} />
                    <span className="text-sm text-white/80">Elite Plan</span>
                  </div>
                  <p className="text-lg font-bold text-[#01F27B]">{allUsers.filter(u => u.subscription?.plan === 'elite').length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* User Roles & Verification */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-500/10 via-[#0c0c0c] to-black/80 p-6 shadow-lg transition-all duration-300 hover:border-cyan-500/30 hover:shadow-cyan-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <div className="absolute -inset-x-20 -top-20 h-[150px] w-full rotate-45 bg-gradient-to-b from-cyan-500/20 to-transparent opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"></div>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white/70">Users & Status</h3>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400">
                  <CheckCircle className="h-5 w-5" strokeWidth={2} />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-cyan-500/10 p-3 backdrop-blur-sm transition-all duration-300 hover:bg-cyan-500/20">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-cyan-400" strokeWidth={2} />
                    <span className="text-sm text-white/80">Investors</span>
                  </div>
                  <p className="text-lg font-bold text-cyan-400">{allUsers.filter(u => u.role === 'investor').length}</p>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-orange-500/10 p-3 backdrop-blur-sm transition-all duration-300 hover:bg-orange-500/20">
                  <div className="flex items-center gap-2">
                    <Rocket className="h-4 w-4 text-orange-400" strokeWidth={2} />
                    <span className="text-sm text-white/80">Founders</span>
                  </div>
                  <p className="text-lg font-bold text-orange-400">{allUsers.filter(u => u.role === 'founder').length}</p>
                </div>
                <div className="border-t border-white/10 pt-3 mt-3">
                  <div className="flex items-center justify-between rounded-lg bg-emerald-500/10 p-3 backdrop-blur-sm transition-all duration-300 hover:bg-emerald-500/20">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-400" strokeWidth={2} />
                      <span className="text-sm text-white/80">Verified</span>
                    </div>
                    <p className="text-lg font-bold text-emerald-400">{allUsers.filter(u => u.isVerified).length}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-rose-500/10 p-3 backdrop-blur-sm transition-all duration-300 hover:bg-rose-500/20">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-rose-400" strokeWidth={2} />
                    <span className="text-sm text-white/80">Unverified</span>
                  </div>
                  <p className="text-lg font-bold text-rose-400">{allUsers.filter(u => !u.isVerified).length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <SectionTitle
            title="Recent Activity"
            action={<button className="text-sm font-semibold text-[#01F27B]">View all</button>}
          />
          <Table columns={columns} data={activityRows} initialSort={{ key: 'date', direction: 'desc' }} />
        </div>

        <div className="space-y-4">
          <SectionTitle title="Quick Actions" />
          <div className="space-y-4">
            {quickActions.map((item) => (
              <div
                key={item.title}
                className={`${glassCardClass} p-5`}
              >
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="mt-2 text-sm text-white/60">{item.description}</p>
                <button className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#01F27B]">
                  {item.action}
                  <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )

}

const stats = [
  {
    title: 'Total Investors',
    value: '2,840',
    growth: '+12.4%',
    icon: <Users className="h-5 w-5" strokeWidth={1.8} />,
  },
  {
    title: 'Total Founders',
    value: '1,320',
    growth: '+8.1%',
    icon: <UserRound className="h-5 w-5" strokeWidth={1.8} />,
  },
  {
    title: 'Total Deals',
    value: '486',
    growth: '+5.7%',
    icon: <Briefcase className="h-5 w-5" strokeWidth={1.8} />,
  },
  {
    title: 'Revenue',
    value: '$3.28M',
    growth: '+14.9%',
    icon: <CircleDollarSign className="h-5 w-5" strokeWidth={1.8} />,
  },
]

export default Dashboard
