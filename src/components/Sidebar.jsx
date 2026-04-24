import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

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
          <div className="flex items-center justify-between gap-3 border-b border-white/25 px-5 py-[21px]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#01F27B] text-black shadow-lg shadow-black/50">
                <span className="text-lg font-bold">B</span>
              </div>
              <div className={`${collapsed ? 'lg:hidden' : ''}`}>
                <p className="text-sm font-semibold text-white">Boost Fundr</p>
                <p className="text-xs text-white">Admin Panel</p>
              </div>
            </div>
            <button
              type="button"
              className="hidden h-9 w-9 items-center justify-center rounded-full border border-white text-white transition hover:border-white/30 lg:flex cursor-pointer "
              onClick={onToggleCollapsed}
              aria-label="Toggle sidebar collapse"
            >
              <ChevronLeft
                className={`h-4 w-4 transition-transform ${collapsed ? 'rotate-180' : ''}`}
                strokeWidth={1.8}
              />
            </button>
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
                    className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#01F27B]/20 text-white shadow-md shadow-black/40'
                        : 'text-white hover:bg-white/15'
                    } ${collapsed ? 'lg:justify-center' : ''}`}
                  >
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        isActive
                          ? 'bg-[#01F27B]/25 text-white'
                          : 'bg-white/5 text-white group-hover:bg-white/10'
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
              <p className={`${collapsed ? 'lg:hidden' : ''}`}>System healthy</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
