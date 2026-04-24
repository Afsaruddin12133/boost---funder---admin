import { ArrowRight, Briefcase, CircleDollarSign, UserRound, Users } from 'lucide-react'
import StatCard from '../components/StatCard'
import Table from '../components/Table'

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
  return (
    <div className="space-y-8">
      <section className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50">
            Dashboard Overview
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-white">
            Investment Platform Admin
          </h1>
          <p className="mt-2 text-sm text-white/60">
            Monitor investors, founders, and funding activity in real time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-2xl border border-white/10 bg-black/50 px-4 py-2 text-sm font-semibold text-white/70 transition hover:border-white/30 hover:text-white">
            Export
          </button>
          <button className="rounded-2xl bg-[#01F27B] px-4 py-2 text-sm font-semibold text-black shadow-lg shadow-black/50 transition hover:brightness-110">
            New Deal
          </button>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
            <button className="text-sm font-semibold text-[#01F27B]">View all</button>
          </div>
          <Table columns={columns} data={activityRows} initialSort={{ key: 'date', direction: 'desc' }} />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
          <div className="space-y-4">
            {quickActions.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-black/50 p-5 shadow-sm shadow-black/40"
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
