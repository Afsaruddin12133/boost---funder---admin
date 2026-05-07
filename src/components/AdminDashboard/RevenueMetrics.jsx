import React, { useState } from 'react';
import { 
  BarChart, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ArrowUpRight, 
  Calendar,
  Filter,
  RefreshCcw,
  ArrowRight,
  ChevronDown
} from 'lucide-react';
import { useRevenueMetrics } from '../../hooks/useRevenueMetrics';
import { 
  glassCardClass, 
  SectionTitle, 
  primaryButtonClass,
  outlineButtonClass,
  fieldClass
} from '../BoostFundrUI';
import { formatCurrency } from '../../lib/utils';

export const RevenueMetrics = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { metrics, loading, error, refresh } = useRevenueMetrics();

  const handleApplyFilter = () => {
    refresh({ startDate, endDate });
  };

  if (loading && !metrics) {
    return (
      <div className={`${glassCardClass} flex h-[400px] items-center justify-center`}>
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#01F27B] border-t-transparent" />
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40">Calculating Revenue...</p>
        </div>
      </div>
    );
  }

  if (error) return null;
  if (!metrics) return null;

  const summaryItems = [
    { label: 'Total Revenue', value: formatCurrency(metrics.summary.totalRevenue), icon: DollarSign, color: 'text-[#01F27B]' },
    { label: 'Transactions', value: metrics.summary.totalTransactions, icon: TrendingUp, color: 'text-blue-400' },
    { label: 'Avg Transaction', value: formatCurrency(metrics.summary.averageTransaction), icon: BarChart, color: 'text-purple-400' },
    { label: 'Max Transaction', value: formatCurrency(metrics.summary.maxTransaction), icon: ArrowUpRight, color: 'text-emerald-400' },
  ];

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <SectionTitle title="Revenue Insights" />
        
        {/* Date Filter Bar */}
        <div className={`${glassCardClass} flex flex-wrap items-center gap-3 p-2 pr-4`}>
          <div className="flex items-center gap-2 px-3 py-1.5 border-r border-white/10">
            <Calendar className="h-4 w-4 text-white/40" />
            <span className="text-xs font-bold uppercase tracking-widest text-white/60">Timeframe</span>
          </div>
          
          <div className="flex items-center gap-2">
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white outline-none [color-scheme:dark]"
            />
            <ArrowRight className="h-3 w-3 text-white/20" />
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white outline-none [color-scheme:dark]"
            />
          </div>

          <button 
            onClick={handleApplyFilter}
            disabled={loading}
            className="ml-2 flex items-center gap-2 rounded-lg bg-[#01F27B]/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#01F27B] transition-all hover:bg-[#01F27B]/20"
          >
            {loading ? <RefreshCcw className="h-3 w-3 animate-spin" /> : <Filter className="h-3 w-3" />}
            Apply
          </button>
        </div>
      </div>

      {/* Summary Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {summaryItems.map((item, idx) => (
          <div key={idx} className={`${glassCardClass} p-5 space-y-4 transition-all hover:border-white/20`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{item.label}</span>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 ${item.color}`}>
                <item.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue By Plan Table */}
        <div className={`${glassCardClass} overflow-hidden`}>
          <div className="border-b border-white/5 bg-white/5 px-6 py-4 flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Revenue By Plan</h3>
            <ChevronDown className="h-4 w-4 text-white/20" />
          </div>
          <div className="p-6">
            <table className="w-full text-left">
              <thead className="text-[10px] font-black uppercase tracking-widest text-white/30">
                <tr>
                  <th className="pb-4">Plan Name</th>
                  <th className="pb-4 text-right">Transactions</th>
                  <th className="pb-4 text-right">Total Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {metrics.revenueByPlan.map((plan) => (
                  <tr key={plan._id} className="group">
                    <td className="py-4 text-sm font-bold text-white uppercase group-hover:text-[#01F27B] transition-colors">
                      {plan._id}
                    </td>
                    <td className="py-4 text-right text-sm text-white/60">
                      {plan.count}
                    </td>
                    <td className="py-4 text-right text-sm font-bold text-white">
                      {formatCurrency(plan.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly Revenue Trend Table */}
        <div className={`${glassCardClass} overflow-hidden`}>
          <div className="border-b border-white/5 bg-white/5 px-6 py-4 flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Monthly Revenue Trend</h3>
            <TrendingUp className="h-4 w-4 text-[#01F27B]" />
          </div>
          <div className="p-6">
            <table className="w-full text-left">
              <thead className="text-[10px] font-black uppercase tracking-widest text-white/30">
                <tr>
                  <th className="pb-4">Period</th>
                  <th className="pb-4 text-right">Transactions</th>
                  <th className="pb-4 text-right">Monthly Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {metrics.monthlyRevenue.map((month) => (
                  <tr key={`${month._id.year}-${month._id.month}`} className="group">
                    <td className="py-4 text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                      {monthNames[month._id.month - 1]} {month._id.year}
                    </td>
                    <td className="py-4 text-right text-sm text-white/60">
                      {month.transactions}
                    </td>
                    <td className="py-4 text-right text-sm font-bold text-[#01F27B]">
                      {formatCurrency(month.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueMetrics;
