import { useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

const AdminLayout = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        items={navItems}
        activeItem="Dashboard"
        collapsed={isCollapsed}
        onToggleCollapsed={() => setIsCollapsed((prev) => !prev)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      <div
        className={`min-h-screen transition-all ${
          isCollapsed ? 'lg:pl-24' : 'lg:pl-72'
        }`}
      >
        <Navbar onOpenSidebar={() => setIsMobileOpen(true)} />

        <main className="relative px-4 pb-16 pt-6 lg:px-8">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-20 top-10 h-56 w-56 rounded-full bg-indigo-200/40 blur-3xl" />
            <div className="absolute right-10 top-32 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
          </div>
          <div className="relative">{children}</div>
        </main>
      </div>
    </div>
  )
}

const DashboardIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h7V3H3v9zm11 9h7v-7h-7v7zM3 21h7v-7H3v7zm11-9h7V3h-7v9z" />
  </svg>
)

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12a4 4 0 100-8 4 4 0 000 8z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M23 20v-2a4 4 0 00-3-3.87" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 3.13a4 4 0 010 7.75" />
  </svg>
)

const FoundersIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6a4 4 0 100 8 4 4 0 000-8z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 20a6.5 6.5 0 0113 0" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8l2 2 2-2" />
  </svg>
)

const InvestorsIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16M4 12h16" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 17h16" />
  </svg>
)

const DealsIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 16v-2m8-6h2M2 12h2m12.95 4.95l1.41 1.41M5.64 5.64l1.41 1.41m0 9.9l-1.41 1.41m12.02-12.02l-1.41 1.41" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const VerificationIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 4v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V7l7-4z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
  </svg>
)

const SubscriptionsIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h10M7 12h10M7 17h6" />
    <rect x="3" y="4" width="18" height="16" rx="3" />
  </svg>
)

const FeaturedIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l3 6 6 .9-4.5 4.3 1.1 6.4L12 17l-5.6 3.6 1.1-6.4L3 9.9 9 9l3-6z" />
  </svg>
)

const AnalyticsIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 15l4-4 4 3 5-6" />
  </svg>
)

const NotificationsIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.73 21a2 2 0 01-3.46 0" />
  </svg>
)

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="3" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.5V22a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.5 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.5-1H2a2 2 0 110-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.9.3h.1a1.7 1.7 0 001-1.5V2a2 2 0 114 0v.1a1.7 1.7 0 001 1.5h.1a1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.9v.1a1.7 1.7 0 001.5 1H22a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" />
  </svg>
)

const navItems = [
  { label: 'Dashboard', icon: <DashboardIcon /> },
  { label: 'Users', icon: <UsersIcon /> },
  { label: 'Founders', icon: <FoundersIcon /> },
  { label: 'Investors', icon: <InvestorsIcon /> },
  { label: 'Deals', icon: <DealsIcon /> },
  { label: 'Verification', icon: <VerificationIcon /> },
  { label: 'Subscriptions', icon: <SubscriptionsIcon /> },
  { label: 'Featured Deals', icon: <FeaturedIcon /> },
  { label: 'Analytics', icon: <AnalyticsIcon /> },
  { label: 'Notifications', icon: <NotificationsIcon /> },
  { label: 'Settings', icon: <SettingsIcon /> },
]

export default AdminLayout
