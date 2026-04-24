import { ArrowUpDown } from 'lucide-react'
import { useMemo, useState } from 'react'

const statusStyles = {
  approved: 'bg-emerald-500/15 text-emerald-200',
  pending: 'bg-amber-500/15 text-amber-200',
  rejected: 'bg-rose-500/15 text-rose-200',
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
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/50 shadow-sm shadow-black/40">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-white/5 text-xs uppercase tracking-wider text-white/50">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => column.sortable && handleSort(column.key)}
                  className={`flex items-center gap-2 ${
                    column.sortable ? 'cursor-pointer text-white/70' : 'text-white/40'
                  }`}
                >
                  <span>{column.label}</span>
                  {column.sortable && (
                    <ArrowUpDown
                      className={`h-3.5 w-3.5 ${
                        sortConfig?.key === column.key ? 'text-[#01F27B]' : 'text-white/25'
                      }`}
                      strokeWidth={1.8}
                    />
                  )}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {sortedData.map((row) => (
            <tr key={row.id} className="text-white/80">
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-4">
                  {column.render
                    ? column.render(row)
                    : column.type === 'status'
                      ? (
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              statusStyles[row[column.key]] || 'bg-white/10 text-white/50'
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
