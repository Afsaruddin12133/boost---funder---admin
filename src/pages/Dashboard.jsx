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
            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600"
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
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Dashboard Overview
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">
            Investment Platform Admin
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Monitor investors, founders, and funding activity in real time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600">
            Export
          </button>
          <button className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700">
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
            <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
            <button className="text-sm font-semibold text-indigo-600">View all</button>
          </div>
          <Table columns={columns} data={activityRows} initialSort={{ key: 'date', direction: 'desc' }} />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
          <div className="space-y-4">
            {quickActions.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm shadow-slate-100"
              >
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="mt-2 text-sm text-slate-500">{item.description}</p>
                <button className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600">
                  {item.action}
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12a4 4 0 100-8 4 4 0 000 8z" />
  </svg>
)

const FoundersIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6a4 4 0 100 8 4 4 0 000-8z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 20a6.5 6.5 0 0113 0" />
  </svg>
)

const DealsIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16M4 12h16" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 17h16" />
  </svg>
)

const RevenueIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8m-4-4h8" />
    <circle cx="12" cy="12" r="9" />
  </svg>
)

const stats = [
  {
    title: 'Total Investors',
    value: '2,840',
    growth: '+12.4%',
    icon: <UsersIcon />,
  },
  {
    title: 'Total Founders',
    value: '1,320',
    growth: '+8.1%',
    icon: <FoundersIcon />,
  },
  {
    title: 'Total Deals',
    value: '486',
    growth: '+5.7%',
    icon: <DealsIcon />,
  },
  {
    title: 'Revenue',
    value: '$3.28M',
    growth: '+14.9%',
    icon: <RevenueIcon />,
  },
]

export default Dashboard
