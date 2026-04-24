import { Bell, ChevronDown, Menu, Search } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const TOKEN_STORAGE_KEY = import.meta.env.VITE_TOKEN_STORAGE_KEY

const Navbar = ({ onOpenSidebar }) => {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    if (TOKEN_STORAGE_KEY) {
      localStorage.removeItem(TOKEN_STORAGE_KEY)
      sessionStorage.removeItem(TOKEN_STORAGE_KEY)
    }
    setMenuOpen(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-20 border-b border-white/25 bg-black/50 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4 px-4 py-4 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/25 text-white transition hover:border-white/30 lg:hidden"
            onClick={onOpenSidebar}
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" strokeWidth={1.8} />
          </button>
          <div className="hidden items-center gap-3 rounded-2xl border border-white/10 bg-black/60 px-4 py-2 shadow-sm shadow-black/40 md:flex border border-white/40">
            <Search className="h-4 w-4 text-white" strokeWidth={1.8} />
            <input
              type="text"
              placeholder="Search investors, deals, founders"
              className="w-64 bg-transparent text-sm text-white placeholder:text-white/70 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/15 text-white transition hover:border-white/30"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" strokeWidth={1.8} />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#01F27B] ring-2 ring-black/60" />
          </button>

          <div className="relative border border-white/60 rounded-2xl">
            <button
              type="button"
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/60 px-3 py-2 text-left shadow-sm shadow-black/40 transition hover:border-white/30 cursor-pointer"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-haspopup="true"
              aria-expanded={menuOpen}
            >
              <img
                src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=200&auto=format&fit=crop"
                alt="Admin avatar"
                className="h-9 w-9 rounded-xl object-cover"
              />
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-white">Lena Foster</p>
                <p className="text-xs text-white">Admin</p>
              </div>
              <ChevronDown className="hidden h-4 w-4 text-white sm:block" strokeWidth={1.8} />
            </button>

            <div
              className={`absolute right-0 mt-3 w-44 overflow-hidden rounded-2xl border border-white/10 bg-black/80 shadow-xl shadow-black/60 transition-all  ${
                menuOpen
                  ? 'translate-y-0 opacity-100'
                  : 'pointer-events-none -translate-y-2 opacity-0'
              }`}
            >
              {['Profile', 'Settings', 'Logout'].map((item) => (
                <button
                  key={item}
                  type="button"
                  className="flex w-full items-center px-4 py-2.5 text-sm text-white transition hover:bg-white/25 cursor-pointer"
                  onClick={item === 'Logout' ? handleLogout : undefined}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4 md:hidden">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/60 px-4 py-2 shadow-sm shadow-black/40">
          <Search className="h-4 w-4 text-white" strokeWidth={1.8} />
          <input
            type="text"
            placeholder="Search investors, deals, founders"
            className="w-full bg-transparent text-sm text-white placeholder:text-white/70 focus:outline-none"
          />
        </div>
      </div>
    </header>
  )
}

export default Navbar
