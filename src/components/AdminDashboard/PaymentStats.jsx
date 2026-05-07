import React from 'react';
import { 
  TrendingUp, 
  CreditCard, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RefreshCcw,
  BarChart3
} from 'lucide-react';
import { usePaymentStats } from '../../hooks/usePaymentStats';
import { glassCardClass, SectionTitle } from '../BoostFundrUI';
import { formatCurrency } from '../../lib/utils';

export const PaymentStats = () => {
  const { stats, loading, error, refresh } = usePaymentStats();

  if (loading) {
    return (
      <div className={`${glassCardClass} flex h-[300px] items-center justify-center`}>
        <div className="flex flex-col items-center gap-4 text-white/50">
          <RefreshCcw className="h-8 w-8 animate-spin" />
          <p className="text-sm font-medium">Crunching financial data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${glassCardClass} flex h-[300px] flex-col items-center justify-center p-6 text-center`}>
        <XCircle className="mb-4 h-12 w-12 text-rose-500/50" />
        <h3 className="mb-2 text-lg font-semibold text-white">Oops! Something went wrong</h3>
        <p className="mb-6 max-w-xs text-sm text-white/60">{error}</p>
        <button 
          onClick={refresh}
          className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-white/20"
        >
          <RefreshCcw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    );
  }

  if (!stats) return null;

  const statItems = [
    {
      label: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      subLabel: 'All-time platform earnings',
      icon: TrendingUp,
      color: 'text-[#01F27B]',
      bg: 'bg-[#01F27B]/10',
    },
    {
      label: 'Total Payments',
      value: stats.totalPayments?.toLocaleString(),
      subLabel: 'Processed transactions',
      icon: CreditCard,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
    {
      label: 'Avg Transaction',
      value: formatCurrency(stats.averageTransaction),
      subLabel: 'Value per successful sale',
      icon: Activity,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
    },
    {
      label: 'Success Rate',
      value: stats.successRate,
      subLabel: 'Payment health index',
      icon: BarChart3,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
    }
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {statItems.map((item, idx) => (
        <div 
          key={idx}
          className={`${glassCardClass} group relative overflow-hidden p-6 transition-all duration-300 hover:border-white/20 hover:bg-white/5`}
        >
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                {item.label}
              </span>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.bg} ${item.color}`}>
                <item.icon className="h-5 w-5" />
              </div>
            </div>
            
            <div>
              <p className="text-3xl font-bold tracking-tight text-white">{item.value}</p>
              <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-white/30">{item.subLabel}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentStats;
