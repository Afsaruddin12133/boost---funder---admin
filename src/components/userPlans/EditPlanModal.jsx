import { Check, Loader2, Plus, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import toast from 'react-hot-toast'
import { PLAN_META } from '../../lib/planMeta'
import { getToken } from '../../lib/utils'
import apiClient from '../../services/apiClient'

// ─── Feature tag chip ─────────────────────────────────────────────────────────
const FeatureTag = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#01F27B]/20 bg-[#01F27B]/10 px-2.5 py-1 text-xs font-medium text-[#01F27B]">
    {label}
    {onRemove && (
      <button
        type="button"
        onClick={() => onRemove(label)}
        className="rounded-full text-[#01F27B]/60 transition hover:text-[#01F27B]"
      >
        <X className="h-3 w-3" />
      </button>
    )}
  </span>
)

// ─── Edit Modal ───────────────────────────────────────────────────────────────
const EditPlanModal = ({ plan, onClose, onSaved }) => {
  const meta = PLAN_META[plan.name] || PLAN_META.free
  const { Icon } = meta

  const [price, setPrice] = useState(String(plan.price ?? 0))
  const [duration, setDuration] = useState(String(plan.duration ?? 30))
  const [features, setFeatures] = useState(plan.features ? [...plan.features] : [])
  const [tagInput, setTagInput] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const tagRef = useRef(null)

  const addTag = () => {
    const val = tagInput.trim()
    if (!val || features.includes(val)) return
    setFeatures((prev) => [...prev, val])
    setTagInput('')
    tagRef.current?.focus()
  }

  const removeTag = (label) => setFeatures((prev) => prev.filter((f) => f !== label))

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addTag() }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const token = getToken()
      if (!token) throw new Error('Missing auth token.')

      await apiClient.request(`/api/v1/subscription/update-plans/${plan.name}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price: Number(price),
          duration: Number(duration),
          features,
        }),
      })

      toast.success(`${plan.name} plan updated successfully!`)
      onSaved()
      onClose()
    } catch (err) {
      toast.error(err.message || 'Failed to update plan.')
    } finally {
      setIsSaving(false)
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0c0c0c] shadow-2xl shadow-black/60">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-xl"
              style={{ background: `${meta.accent}18` }}
            >
              <Icon className="h-4 w-4" style={{ color: meta.accent }} strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-sm font-bold capitalize text-white">
                Edit {plan.name || plan.id} Plan
              </h2>
              <p className={`text-[10px] font-semibold uppercase tracking-widest ${meta.badgeColor}`}>
                {meta.badge}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/50 transition hover:border-white/30 hover:text-white"
          >
            <X className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 px-6 py-5">
          {/* Price */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/40">
              Price (USD)
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 focus-within:border-[#01F27B]/50 focus-within:ring-1 focus-within:ring-[#01F27B]/30 transition">
              <span className="text-sm font-semibold text-white/40">$</span>
              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="flex-1 bg-transparent text-sm text-white outline-none placeholder-white/20"
                placeholder="0"
              />
            </div>
          </div>

          {/* Interval */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/40">
              Interval (Days)
            </label>
            <input
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-sm text-white outline-none placeholder-white/20 transition focus:border-[#01F27B]/50 focus:ring-1 focus:ring-[#01F27B]/30"
              placeholder="30"
            />
          </div>

          {/* Features */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/40">
              Features
            </label>
            <div className="min-h-[60px] flex flex-wrap gap-2 rounded-xl border border-white/10 bg-black/40 p-3 transition focus-within:border-[#01F27B]/50 focus-within:ring-1 focus-within:ring-[#01F27B]/30">
              {features.map((f) => (
                <FeatureTag key={f} label={f} onRemove={removeTag} />
              ))}
              <div className="flex items-center gap-1.5">
                <Plus className="h-3.5 w-3.5 text-white/30" strokeWidth={2} />
                <input
                  ref={tagRef}
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={addTag}
                  placeholder="Add feature…"
                  className="bg-transparent text-xs text-white/70 outline-none placeholder-white/25 min-w-[100px]"
                />
              </div>
            </div>
            <p className="mt-1.5 text-[10px] text-white/30">Press Enter or Tab to add a feature tag.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-4">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/70 transition hover:border-white/20 hover:text-white disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl bg-[#01F27B] px-5 py-2.5 text-sm font-bold text-black transition hover:brightness-110 disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                Saving…
              </>
            ) : (
              <>
                <Check className="h-4 w-4" strokeWidth={2.5} />
                Save Plan
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default EditPlanModal
