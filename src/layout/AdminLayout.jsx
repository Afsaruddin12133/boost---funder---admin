import {
    Bell,
    Briefcase,
    ClipboardList,
    CreditCard,
    LayoutDashboard,
    LineChart,
    Settings,
    ShieldCheck,
    Star,
    Users,
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
    <div className="min-h-screen bg-black text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-[#01F27B]/10 blur-[140px]" />
        <div className="absolute right-0 top-24 h-[30rem] w-[30rem] rounded-full bg-white/5 blur-[160px]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />
      </div>

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
    label: 'User Plans',
    path: '/user-plans',
    icon: <ClipboardList className="h-5 w-5" strokeWidth={1.8} />,
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
