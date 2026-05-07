import {
  Leaf,
  PieChart,
  RefreshCcw,
  Star,
  Users,
  Zap
} from 'lucide-react';
import { useSubscriptionSummary } from '../../hooks/useSubscriptionSummary';
import {
  glassCardClass,
  ProgressBar,
  SectionTitle
} from '../BoostFundrUI';

export const SubscriptionSummary = () => {
  const { summary, loading, error, refresh } = useSubscriptionSummary();

  if (loading) {
    return (
      <div className={`${glassCardClass} flex h-[250px] items-center justify-center`}>
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#01F27B] border-t-transparent" />
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40">Analyzing Tiers...</p>
        </div>
      </div>
    );
  }

  if (error || !summary) return null;

  const totalUsers = summary.totalUsers?.toLocaleString() ?? '0';
  const paidUsers = summary.paidUsers?.toLocaleString() ?? '0';
  const freeUsers = summary.freeUsers?.toLocaleString() ?? '0';
  const paidPercentage = summary.percentages?.paidPercentage ?? '--';
  const freePercentage = summary.percentages?.freePercentage ?? '--';

  const tiers = [
    {
      name: 'Free',
      count: summary.subscriptionBreakdown?.free,
      percentage: parseFloat(summary.percentages?.freePercentage),
      icon: Leaf,
      color: '#ffffff80',
      textColor: 'text-white/60'
    },
    {
      name: 'Pro',
      count: summary.subscriptionBreakdown?.pro,
      percentage: parseFloat(summary.percentages?.proPercentage),
      icon: Zap,
      color: '#3b82f6',
      textColor: 'text-blue-400'
    },
    {
      name: 'Elite',
      count: summary.subscriptionBreakdown?.elite,
      percentage: parseFloat(summary.percentages?.elitePercentage),
      icon: Star,
      color: '#01F27B',
      textColor: 'text-[#01F27B]'
    }
  ];

  return (
    <div className="space-y-6">
      <SectionTitle 
        title="Subscription Analytics" 
        action={
          <button 
            onClick={refresh}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#01F27B] hover:opacity-80 transition-opacity"
          >
            <RefreshCcw className="h-3 w-3" />
            Live Sync
          </button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className={`${glassCardClass} relative overflow-hidden p-6`}>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#01F27B]/10 via-transparent to-transparent opacity-70" />
          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#01F27B]/10 text-[#01F27B]">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Subscription Snapshot</p>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-white">User base health</h3>
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-4xl font-bold tracking-tight text-white">{totalUsers}</h4>
                <p className="max-w-md text-sm leading-6 text-white/55">
                  Total registered users, with paid and free tiers summarized into a single glanceable view.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-right">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35">Live Mix</p>
              <p className="mt-1 text-sm font-semibold text-white">Paid {paidUsers}</p>
              <p className="text-sm font-semibold text-white/50">Free {freeUsers}</p>
            </div>
          </div>

          <div className="relative z-10 mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Paid Conversion</p>
              <p className="mt-2 text-3xl font-bold text-white">{paidPercentage}</p>
              <p className="mt-1 text-xs text-white/40">Revenue-bearing members in the system</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35">Free Tier Reach</p>
              <p className="mt-2 text-3xl font-bold text-white">{freePercentage}</p>
              <p className="mt-1 text-xs text-white/40">Top-of-funnel audience and trial base</p>
            </div>
          </div>
        </div>

        <div className={`${glassCardClass} p-6`}>
          <div className="mb-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-[#01F27B]">
                <PieChart className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35">Plan Distribution</p>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Tier mix</h3>
              </div>
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/40">
              Paid: {paidUsers} · Free: {freeUsers}
            </div>
          </div>

          <div className="space-y-4">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className="rounded-2xl border border-white/8 bg-white/[0.04] p-4 transition-colors hover:border-white/15 hover:bg-white/[0.06]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 ${tier.textColor}`}>
                      <tier.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{tier.name} tier</p>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">Active subscribers</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`text-xl font-bold ${tier.textColor}`}>{tier.count?.toLocaleString()}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">
                      {tier.percentage}% share
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <ProgressBar progress={tier.percentage} color={tier.color} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSummary;
