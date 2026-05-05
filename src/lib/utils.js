export const statusStyles = {
  draft: 'bg-white/10 text-white/70',
  pendingReview: 'bg-[#01F27B]/10 text-[#01F27B]',
  approved: 'bg-[#01F27B]/10 text-[#01F27B]',
  rejected: 'bg-white/10 text-white/60',
  complete: 'bg-[#01F27B]/10 text-[#01F27B]',
}

export const formatCurrency = (amount, currency = 'USD') => {
  if (amount == null) return '--'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export const formatDate = (value) => {
  if (!value) return '--'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '--'
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export const isNewDeal = (createdAt) => {
  if (!createdAt) return false
  const created = new Date(createdAt).getTime()
  const now = Date.now()
  return now - created < 1000 * 60 * 60 * 24 * 5
}

const TOKEN_STORAGE_KEY = import.meta.env.VITE_TOKEN_STORAGE_KEY

export const getToken = () => {
  if (!TOKEN_STORAGE_KEY) return null
  return localStorage.getItem(TOKEN_STORAGE_KEY) || sessionStorage.getItem(TOKEN_STORAGE_KEY)
}
