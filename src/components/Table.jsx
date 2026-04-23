import { useMemo, useState } from 'react'

const statusStyles = {
  approved: 'bg-emerald-50 text-emerald-600',
  pending: 'bg-amber-50 text-amber-600',
  rejected: 'bg-rose-50 text-rose-600',
}

const Table = ({ columns, data, initialSort }) => {
  const [sortConfig, setSortConfig] = useState(initialSort)

  const sortedData = useMemo(() => {
    if (!sortConfig?.key) {
      return data
    }

    const { key, direction } = sortConfig
    const sorted = [...data].sort((a, b) => {
      const valueA = a[key]
      const valueB = b[key]

      if (valueA == null) return 1
      if (valueB == null) return -1

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return valueA - valueB
      }

      const dateA = key.toLowerCase().includes('date') ? Date.parse(valueA) : NaN
      const dateB = key.toLowerCase().includes('date') ? Date.parse(valueB) : NaN

      if (!Number.isNaN(dateA) && !Number.isNaN(dateB)) {
        return dateA - dateB
      }

      return String(valueA).localeCompare(String(valueB))
    })

    return direction === 'desc' ? sorted.reverse() : sorted
  }, [data, sortConfig])

  const handleSort = (key) => {
    if (!key) return
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
      }
      return { key, direction: 'asc' }
    })
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200/70 bg-white shadow-sm shadow-slate-100">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-400">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => column.sortable && handleSort(column.key)}
                  className={`flex items-center gap-2 ${
                    column.sortable ? 'cursor-pointer text-slate-600' : 'text-slate-400'
                  }`}
                >
                  <span>{column.label}</span>
                  {column.sortable && (
                    <svg
                      viewBox="0 0 24 24"
                      className={`h-3.5 w-3.5 ${
                        sortConfig?.key === column.key ? 'text-indigo-600' : 'text-slate-300'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 15l5 5 5-5" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 9l5-5 5 5" />
                    </svg>
                  )}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {sortedData.map((row) => (
            <tr key={row.id} className="text-slate-700">
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-4">
                  {column.render
                    ? column.render(row)
                    : column.type === 'status'
                      ? (
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              statusStyles[row[column.key]] || 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {row[column.key]}
                          </span>
                        )
                      : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table
