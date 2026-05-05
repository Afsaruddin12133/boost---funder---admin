import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Logo from './Logo'

const Sidebar = ({
  items,
  activeItem,
  collapsed,
  onToggleCollapsed,
  isMobileOpen,
  onCloseMobile,
}) => {
  const navigate = useNavigate()

  const handleItemClick = (path) => {
    if (path) {
      navigate(path)
    }
    onCloseMobile()
  }
  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden ${
          isMobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onCloseMobile}
        aria-hidden="true"
      />
      <aside
        className={`fixed left-0 top-0 z-40 h-full w-72 border-r border-white/10 bg-black/70 shadow-xl shadow-black/60 backdrop-blur-xl transition-transform lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${collapsed ? 'lg:w-24' : 'lg:w-72'}`}
      >
        <div className="flex h-full flex-col">
          <div className="flex flex-col items-center gap-3 border-b border-white/10 px-5 py-6">
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col items-start gap-2 overflow-hidden transition-all">
                <Logo size={collapsed ? "sm" : "md"} className={collapsed ? "scale-75 origin-left" : ""} />
                <div className={`transition-all duration-300 ${collapsed ? 'opacity-0 h-0' : 'opacity-100'}`}>
                  <p className="text-[10px] text-[#01F27B] font-black uppercase tracking-[0.3em] opacity-70">
                    Admin Panel
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="hidden h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all duration-300 hover:border-[#01F27B]/40 hover:scale-[1.02] lg:flex cursor-pointer"
                onClick={onToggleCollapsed}
                aria-label="Toggle sidebar collapse"
              >
                <ChevronLeft
                  className={`h-4 w-4 transition-transform ${collapsed ? 'rotate-180' : ''}`}
                  strokeWidth={1.8}
                />
              </button>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-6">
            <div className="mt-4 space-y-1">
              {items.map((item) => {
                const isActive = item.label === activeItem
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleItemClick(item.path)}
                    className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                      isActive
                        ? 'bg-[#01F27B]/10 text-white shadow-[0_0_20px_rgba(1,242,123,0.15)]'
                        : 'text-white/70 hover:border-white/20 hover:bg-white/5'
                    } ${collapsed ? 'lg:justify-center' : ''}`}
                  >
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        isActive
                          ? 'bg-[#01F27B]/10 text-[#01F27B]'
                          : 'bg-white/5 text-white/70 group-hover:bg-white/10 group-hover:text-white'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className={`${collapsed ? 'lg:hidden' : ''}`}>{item.label}</span>
                  </button>
                )
              })}
            </div>
          </nav>

          <div className="border-t border-white/25 px-5 py-4">
            <div
              className={`rounded-2xl bg-white/5 px-4 py-3 text-xs text-white ${
                collapsed ? 'lg:text-center' : ''
              }`}
            >
              <p className="font-semibold text-white">v1.4.2</p>
              <p className={`text-white/50 ${collapsed ? 'lg:hidden' : ''}`}>System healthy</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
