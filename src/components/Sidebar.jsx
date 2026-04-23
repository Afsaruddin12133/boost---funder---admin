
const Sidebar = ({
  items,
  activeItem,
  collapsed,
  onToggleCollapsed,
  isMobileOpen,
  onCloseMobile,
}) => {
  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm transition-opacity lg:hidden ${
          isMobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onCloseMobile}
        aria-hidden="true"
      />
      <aside
        className={`fixed left-0 top-0 z-40 h-full w-72 border-r border-slate-200/70 bg-white/90 shadow-xl shadow-slate-200/40 backdrop-blur-xl transition-transform lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${collapsed ? 'lg:w-24' : 'lg:w-72'}`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200/70 px-5 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200">
                <span className="text-lg font-bold">B</span>
              </div>
              <div className={`${collapsed ? 'lg:hidden' : ''}`}>
                <p className="text-sm font-semibold text-slate-800">Boost Funder</p>
                <p className="text-xs text-slate-500">Admin Panel</p>
              </div>
            </div>
            <button
              type="button"
              className="hidden h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-slate-300 hover:text-slate-900 lg:flex"
              onClick={onToggleCollapsed}
              aria-label="Toggle sidebar collapse"
            >
              <svg
                viewBox="0 0 24 24"
                className={`h-4 w-4 transition-transform ${collapsed ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-6">
            <p
              className={`px-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 ${
                collapsed ? 'lg:text-center' : ''
              }`}
            >
              Admin Menu
            </p>
            <div className="mt-4 space-y-1">
              {items.map((item) => {
                const isActive = item.label === activeItem
                return (
                  <button
                    key={item.label}
                    type="button"
                    className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    } ${collapsed ? 'lg:justify-center' : ''}`}
                  >
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        isActive
                          ? 'bg-white/15 text-white'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-white'
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

          <div className="border-t border-slate-200/70 px-5 py-4">
            <div
              className={`rounded-2xl bg-slate-50 px-4 py-3 text-xs text-slate-500 ${
                collapsed ? 'lg:text-center' : ''
              }`}
            >
              <p className="font-semibold text-slate-700">v1.4.2</p>
              <p className={`${collapsed ? 'lg:hidden' : ''}`}>System healthy</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
