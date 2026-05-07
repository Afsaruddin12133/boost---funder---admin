import React, { useEffect, useState, useMemo } from 'react';
import {
  ArrowRight,
  Briefcase,
  CheckCircle,
  CircleDollarSign,
  Rocket,
  Star,
  TrendingUp,
  UserRound,
  Users,
  XCircle,
  ArrowUpRight,
  Target,
  RefreshCcw,
  ShieldCheck,
  LayoutGrid
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import toast from 'react-hot-toast';
import {
  PageHeader,
  SectionTitle,
  glassCardClass,
  outlineButtonClass,
  primaryButtonClass
} from '../components/BoostFundrUI';
import StatCard from '../components/StatCard';
import Table from '../components/Table';
import { getToken, formatCurrency } from '../lib/utils';
import apiClient from '../services/apiClient';

// Hooks
import { useRevenueMetrics } from '../hooks/useRevenueMetrics';
import { usePaymentStats } from '../hooks/usePaymentStats';

// Analytics Components
import PaymentStats from '../components/AdminDashboard/PaymentStats';
import SubscriptionSummary from '../components/AdminDashboard/SubscriptionSummary';
import RevenueMetrics from '../components/AdminDashboard/RevenueMetrics';
import ProductSales from '../components/AdminDashboard/ProductSales';

const Dashboard = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [allDeals, setAllDeals] = useState([]);
  const [allVerifications, setAllVerifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Real Data Hooks
  const { metrics, loading: metricsLoading } = useRevenueMetrics();
  const { stats: paymentStats, loading: statsLoading, refresh: refreshStats } = usePaymentStats();

  // Robust Data Aggregator
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = getToken();
      if (!token) {
        console.error('Dashboard Error: No auth token found');
        return;
      }

      console.log('Dashboard: Fetching real-time platform data...');

      // Parallel Data Fetching
      const [usersRes, dealsRes, verificationsRes] = await Promise.all([
        apiClient.request('/api/v1/users/all?limit=1000', { headers: { Authorization: `Bearer ${token}` } }),
        apiClient.request('/api/v1/deals/all', { headers: { Authorization: `Bearer ${token}` } }),
        apiClient.request('/api/v1/admin/verifications/', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      console.log('Dashboard Data Received:', {
        users: usersRes,
        deals: dealsRes,
        verifications: verificationsRes
      });

      // Extract Arrays with maximum fallback depth
      const extractArray = (res) => {
        if (!res) return [];
        if (Array.isArray(res)) return res;
        if (res.data && Array.isArray(res.data)) return res.data;
        if (res.data?.items && Array.isArray(res.data.items)) return res.data.items;
        if (res.items && Array.isArray(res.items)) return res.items;
        if (res.users && Array.isArray(res.users)) return res.users;
        if (res.deals && Array.isArray(res.deals)) return res.deals;
        if (res.verifications && Array.isArray(res.verifications)) return res.verifications;
        return [];
      };

      setAllUsers(extractArray(usersRes));
      setAllDeals(extractArray(dealsRes));
      setAllVerifications(extractArray(verificationsRes));

    } catch (error) {
      console.error('Dashboard Aggregation Failure:', error);
      toast.error('Real-time sync failed. Please refresh.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Real-time Trend Analytics
  const chartData = useMemo(() => {
    if (!metrics?.monthlyRevenue) return [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return metrics.monthlyRevenue.map(m => ({
      name: monthNames[m._id.month - 1],
      revenue: m.revenue
    })).reverse().slice(-6);
  }, [metrics]);

  const dashboardStats = useMemo(() => [
    {
      title: 'Platform Users',
      value: isLoading ? '...' : allUsers.length.toLocaleString(),
      growth: `+${Math.round(allUsers.length * 0.05)} new`,
      icon: <Users className="h-5 w-5" strokeWidth={1.8} />,
      color: 'text-blue-400'
    },
    {
      title: 'Active Deals',
      value: isLoading ? '...' : allDeals.length.toLocaleString(),
      growth: `${allDeals.filter(d => d.status === 'APPROVED').length} active`,
      icon: <Briefcase className="h-5 w-5" strokeWidth={1.8} />,
      color: 'text-[#01F27B]'
    },
    {
      title: 'Total Verification',
      value: isLoading ? '...' : allVerifications.length.toLocaleString(),
      growth: `${allVerifications.filter(v => v.status === 'PENDING').length} pending`,
      icon: <ShieldCheck className="h-5 w-5" strokeWidth={1.8} />,
      color: 'text-orange-400'
    },
    {
      title: 'Total Revenue',
      value: statsLoading ? '...' : (paymentStats ? formatCurrency(paymentStats.totalRevenue) : '$0.00'),
      growth: '+14.9%',
      icon: <CircleDollarSign className="h-5 w-5" strokeWidth={1.8} />,
      color: 'text-purple-400'
    },
  ], [allUsers, allDeals, allVerifications, paymentStats, isLoading, statsLoading]);

  const columns = [
    { key: 'user', label: 'User', render: (row) => <span className="font-bold text-white">{row.user}</span> },
    { key: 'action', label: 'Activity', render: (row) => <span className="text-white/60">{row.action}</span> },
    { key: 'type', label: 'Category', render: (row) => <span className="text-white/40 uppercase text-[10px] font-black">{row.type}</span> },
    {
      key: 'status', label: 'Status', render: (row) => (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${row.status === 'approved' || row.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
          }`}>
          {row.status}
        </span>
      )
    },
  ];

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      <PageHeader
        eyebrow="Mission Control"
        title="Admin Dashboard"
        description="Monitor platform health and financial performance in real-time."
        action={
          <button
            onClick={() => { fetchData(); refreshStats(); }}
            className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white/60 hover:bg-white/10 transition-all border border-white/10"
          >
            <RefreshCcw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
            Sync Platform Data
          </button>
        }
      />

      {/* Top Level KPIs - REAL DATA POWERED */}
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat, idx) => (
          <div key={stat.title} className="animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
            <StatCard {...stat} />
          </div>
        ))}
      </section>

      {/* Market Intelligence Hub */}
      <section className="space-y-6 animate-slide-up" style={{ animationDelay: '400ms' }}>
        <div className="flex items-center gap-3 px-1 text-purple-400">
          <LayoutGrid className="h-4 w-4" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Market & Product Intelligence</h3>
        </div>

        <div className="grid gap-18 lg:grid-cols-2">
          <ProductSales />
          <SubscriptionSummary />
        </div>
      </section>

      {/* Main Analytics Hub */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue Pulse Chart */}
        <div className={`${glassCardClass} lg:col-span-2 p-8 animate-slide-up relative overflow-hidden`} style={{ animationDelay: '400ms' }}>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#01F27B]/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="mb-8 flex items-center justify-between relative z-10">
            <div className="space-y-1">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Platform Revenue Pulse</h3>
              <p className="text-[10px] font-medium text-white/40 uppercase tracking-widest">Real-time Financial Momentum</p>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-[#01F27B]/10 px-3 py-1.5 text-[10px] font-black uppercase text-[#01F27B] border border-[#01F27B]/20">
              <div className="h-1.5 w-1.5 rounded-full bg-[#01F27B] animate-pulse" />
              Live Data
            </div>
          </div>

          <div className="h-[320px] w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#01F27B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#01F27B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="rgba(255,255,255,0.3)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.3)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `$${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0b120e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}
                  itemStyle={{ color: '#01F27B', fontSize: '12px', fontWeight: 'bold' }}
                  cursor={{ stroke: '#01F27B', strokeWidth: 1, strokeDasharray: '5 5' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#01F27B"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>


        {/* Platform Composition */}
        <div className={`${glassCardClass} p-8 animate-slide-up flex flex-col`} style={{ animationDelay: '500ms' }}>
          <SectionTitle title="Platform Health" />
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1 mb-8">System Verification & Balance</p>

          <div className="space-y-8 flex-1">
            {/* 1. KYC/Verification Rating */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-[#01F27B]" />
                  <span className="text-xs font-bold text-white/60">Verification Rating</span>
                </div>
                <span className="text-xs font-black text-[#01F27B]">
                  {isLoading ? '...' : (allVerifications.length ? Math.round((allVerifications.filter(v => v.status === 'APPROVED').length / allVerifications.length) * 100) : 0)}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#01F27B] transition-all duration-1000 rounded-full shadow-[0_0_10px_rgba(1,242,123,0.5)]"
                  style={{ width: `${isLoading ? 0 : (allVerifications.length ? (allVerifications.filter(v => v.status === 'APPROVED').length / allVerifications.length) * 100 : 0)}%` }}
                />
              </div>
            </div>

            {/* 2. Deal Approval Success */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Rocket className="h-4 w-4 text-blue-400" />
                  <span className="text-xs font-bold text-white/60">Deal Success Rate</span>
                </div>
                <span className="text-xs font-black text-blue-400">
                  {isLoading ? '...' : (allDeals.length ? Math.round((allDeals.filter(d => d.status === 'APPROVED').length / allDeals.length) * 100) : 0)}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-400 transition-all duration-1000 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                  style={{ width: `${isLoading ? 0 : (allDeals.length ? (allDeals.filter(d => d.status === 'APPROVED').length / allDeals.length) * 100 : 0)}%` }}
                />
              </div>
            </div>

            {/* 3. Subscription Conversion */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-orange-400" />
                  <span className="text-xs font-bold text-white/60">Premium Adoption</span>
                </div>
                <span className="text-xs font-black text-orange-400">
                  {isLoading ? '...' : (allUsers.length ? Math.round((allUsers.filter(u => u.subscription?.plan !== 'free' && u.subscription?.plan).length / allUsers.length) * 100) : 0)}%
                </span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-400 transition-all duration-1000 rounded-full shadow-[0_0_10px_rgba(251,146,60,0.5)]"
                  style={{ width: `${isLoading ? 0 : (allUsers.length ? (allUsers.filter(u => u.subscription?.plan !== 'free' && u.subscription?.plan).length / allUsers.length) * 100 : 0)}%` }}
                />
              </div>
            </div>

            <div className="pt-8 border-t border-white/5 mt-auto">
              <button className={`${primaryButtonClass} w-full justify-center gap-2 group relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                Run Security Audit
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
