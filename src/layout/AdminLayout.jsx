import {
  Bell,
  Briefcase,
  CreditCard,
  LayoutDashboard,
  LineChart,
  Settings,
  ShieldCheck,
  Star,
  UserRound,
  Users,
  Users2,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

const AdminLayout = ({ children }) => {
  const location = useLocation()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const activeItem = useMemo(() => {
    const match = navItems.find((item) => item.path === location.pathname)
    return match?.label || 'Dashboard'
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#04140A] via-[#061F11] to-black text-white">
      <Sidebar
        items={navItems}
        activeItem={activeItem}
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
            <div className="absolute -left-20 top-10 h-56 w-56 rounded-full bg-[#01F27B]/15 blur-3xl" />
            <div className="absolute right-10 top-32 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          </div>
          <div className="relative">{children}</div>
        </main>
      </div>
    </div>
  )
}

const navItems = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" strokeWidth={1.8} />,
  },
  { label: 'Users', path: '/users', icon: <Users className="h-5 w-5" strokeWidth={1.8} /> },
  {
    label: 'Founders',
    path: '/founders',
    icon: <UserRound className="h-5 w-5" strokeWidth={1.8} />,
  },
  {
    label: 'Investors',
    path: '/investors',
    icon: <Users2 className="h-5 w-5" strokeWidth={1.8} />,
  },
  { label: 'Deals', path: '/deals', icon: <Briefcase className="h-5 w-5" strokeWidth={1.8} /> },
  {
    label: 'Verification',
    path: '/verification',
    icon: <ShieldCheck className="h-5 w-5" strokeWidth={1.8} />,
  },
  {
    label: 'Subscriptions',
    path: '/subscriptions',
    icon: <CreditCard className="h-5 w-5" strokeWidth={1.8} />,
  },
  {
    label: 'Featured Deals',
    path: '/featured-deals',
    icon: <Star className="h-5 w-5" strokeWidth={1.8} />,
  },
  {
    label: 'Analytics',
    path: '/analytics',
    icon: <LineChart className="h-5 w-5" strokeWidth={1.8} />,
  },
  {
    label: 'Notifications',
    path: '/notifications',
    icon: <Bell className="h-5 w-5" strokeWidth={1.8} />,
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: <Settings className="h-5 w-5" strokeWidth={1.8} />,
  },
]

export default AdminLayout
