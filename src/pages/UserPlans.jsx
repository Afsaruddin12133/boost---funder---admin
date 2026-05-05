import { Check, LayoutGrid, Pencil, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { EmptyState, PageHeader } from '../components/BoostFundrUI'
import EditPlanModal from '../components/userPlans/EditPlanModal'
import { PLAN_META } from '../lib/planMeta'
import { getToken } from '../lib/utils'
import apiClient from '../services/apiClient'



// ─── Read-only Plan Card ───────────────────────────────────────────────────────
const PlanCard = ({ plan, onEdit }) => {
  const meta = PLAN_META[plan.name] || PLAN_META.free
  const { Icon } = meta

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-2xl border shadow-lg transition-all duration-300 hover:shadow-xl ${meta.border} ${meta.shadow}`}
    >
      {/* ── Base gradient background ── */}
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${meta.cardBg}`} />

      {/* ── Top edge colour sweep ── */}
      <div className={`pointer-events-none absolute left-0 right-0 top-0 h-24 bg-gradient-to-b ${meta.topGlow} opacity-60 blur-sm transition-opacity duration-300 group-hover:opacity-100`} />

      {/* ── Subtle noise texture overlay ── */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />

      {/* ── Popular ribbon ── */}
      {meta.popular && (
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-px z-20">
          <span className="inline-flex items-center rounded-b-xl border border-amber-400/40 bg-amber-400/20 px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-300 shadow-lg shadow-amber-400/10">
            ⚡ Most Popular
          </span>
        </div>
      )}

      <div className="relative z-10 flex flex-1 flex-col gap-5 p-6 pt-8">
        {/* Plan header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl shadow-lg ring-1 ring-white/10"
                style={{ background: `linear-gradient(135deg, ${meta.accent}30, ${meta.accent}10)` }}
              >
                <Icon className="h-5 w-5" style={{ color: meta.accent }} strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold capitalize text-white tracking-tight">{plan.name}</h3>
            </div>
            <p className={`mt-1.5 text-[10px] font-bold uppercase tracking-widest ${meta.badgeColor}`}>
              {meta.badge}
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-extrabold text-white">
              <span className="text-base font-semibold text-white/50">$</span>{plan.price ?? 0}
            </p>
            <p className="text-xs text-white/40">/ {plan.duration ?? 30} days</p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px" style={{ background: `linear-gradient(90deg, ${meta.accent}40, transparent)` }} />

        {/* Features */}
        <div className="flex-1">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-white/40">Features</p>
          {plan.features && plan.features.length > 0 ? (
            <ul className="space-y-2.5">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-white/75">
                  <span
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full ring-1"
                    style={{ background: `${meta.accent}18`, ringColor: `${meta.accent}30` }}
                  >
                    <Check className="h-3 w-3" style={{ color: meta.accent }} strokeWidth={3} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-white/30 italic">No features defined.</p>
          )}
        </div>
      </div>

      {/* Edit CTA */}
      <div className="relative z-10 border-t border-white/8 px-6 py-4">
        <button
          onClick={() => onEdit(plan)}
          className={`flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-semibold text-white/80 backdrop-blur-sm transition-all duration-200 cursor-pointer ${meta.btnHover}`}
        >
          <Pencil className="h-4 w-4" strokeWidth={2} />
          Edit Plan
        </button>
      </div>
    </div>
  )
}



// ─── Skeleton loader ──────────────────────────────────────────────────────────
const PlanSkeleton = () => (
  <div className="animate-pulse rounded-2xl border border-white/10 bg-[#0c0c0c] p-6">
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <div className="h-9 w-9 rounded-xl bg-white/8" />
        <div className="h-4 w-20 rounded bg-white/8" />
        <div className="h-3 w-24 rounded bg-white/5" />
      </div>
      <div className="space-y-1 text-right">
        <div className="h-7 w-12 rounded bg-white/8" />
        <div className="h-3 w-16 rounded bg-white/5" />
      </div>
    </div>
    <div className="my-5 h-px bg-white/8" />
    <div className="space-y-2">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-white/8" />
          <div className="h-3 w-32 rounded bg-white/8" />
        </div>
      ))}
    </div>
    <div className="mt-8 h-10 rounded-xl bg-white/8" />
  </div>
)

// ─── Main Page ────────────────────────────────────────────────────────────────
const UserPlans = () => {
  const [plans, setPlans] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [editingPlan, setEditingPlan] = useState(null)

  const refreshPlans = async () => {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const token = getToken()
      if (!token) throw new Error('Missing auth token.')

      const response = await apiClient.request('/api/v1/subscription/', {
        headers: { Authorization: `Bearer ${token}` },
      })

      const arr = Array.isArray(response?.data?.plans) ? response.data.plans : []
      setPlans(arr)
    } catch (err) {
      setErrorMessage(err.message || 'Failed to load subscription plans.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true

    const run = async () => {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const token = getToken()
        if (!token) throw new Error('Missing auth token.')

        const response = await apiClient.request('/api/v1/subscription/', {
          headers: { Authorization: `Bearer ${token}` },
        })

        const arr = Array.isArray(response?.data?.plans) ? response.data.plans : []
        if (isMounted) {
          setPlans(arr)
        }
      } catch (err) {
        if (isMounted) {
          setErrorMessage(err.message || 'Failed to load subscription plans.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void run()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Subscription Management"
        title="User Plans"
        description="View and manage the platform's available subscription tiers."
        actions={[
          <div key="count" className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur-xl">
            <LayoutGrid className="h-4 w-4 text-[#01F27B]" strokeWidth={2} />
            <span className="text-xs font-semibold text-[#01F27B]">
              {plans.length} Plan{plans.length !== 1 ? 's' : ''} Active
            </span>
          </div>,
        ]}
      />

      {/* ── Error Banner ─────────────────────────────────────────────────── */}
      {errorMessage && (
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70 backdrop-blur-xl">
          <X className="h-4 w-4 shrink-0 text-white/50" strokeWidth={2} />
          {errorMessage}
        </div>
      )}

      {/* ── Plan Cards Grid ──────────────────────────────────────────────── */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? [...Array(3)].map((_, i) => <PlanSkeleton key={i} />)
          : plans.length > 0
          ? plans.map((plan) => (
              <PlanCard
                key={plan.name}
                plan={plan}
                onEdit={setEditingPlan}
              />
            ))
          : !errorMessage && (
              <div className="col-span-3">
                <EmptyState
                  title="No subscription plans found."
                  description="Plans configured in the backend will appear here."
                />
              </div>
            )}
      </div>

      {/* ── Edit Modal ───────────────────────────────────────────────────── */}
      {editingPlan && (
        <EditPlanModal
          plan={editingPlan}
          onClose={() => setEditingPlan(null)}
          onSaved={refreshPlans}
        />
      )}
    </div>
  )
}

export default UserPlans
