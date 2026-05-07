import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Briefcase, 
  ArrowUpRight,
  PieChart as PieIcon,
  Activity,
  Calendar,
  Filter
} from 'lucide-react';
import { 
  PageHeader, 
  SectionTitle, 
  glassCardClass 
} from '../components/BoostFundrUI';
import { formatCurrency } from '../lib/utils';
import { useRevenueMetrics } from '../hooks/useRevenueMetrics';
import { useSubscriptionSummary } from '../hooks/useSubscriptionSummary';
import { useProductSales } from '../hooks/useProductSales';

const Analytics = () => {
  const { metrics, loading: metricsLoading } = useRevenueMetrics();
  const { summary, loading: summaryLoading } = useSubscriptionSummary();
  const { productSales, loading: salesLoading } = useProductSales();

  const COLORS = ['#01F27B', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

  // Mock Data for extended visualization
  const userGrowthData = [
    { name: 'Week 1', users: 120, growth: 10 },
    { name: 'Week 2', users: 180, growth: 15 },
    { name: 'Week 3', users: 250, growth: 22 },
    { name: 'Week 4', users: 380, growth: 30 },
  ];

  const planComparison = summary ? [
    { name: 'Free', value: summary.subscriptionBreakdown?.free || 0 },
    { name: 'Pro', value: summary.subscriptionBreakdown?.pro || 0 },
    { name: 'Elite', value: summary.subscriptionBreakdown?.elite || 0 },
  ] : [];

  return (
    <div className="space-y-8 pb-12 animate-fade-in">
      <PageHeader
        eyebrow="Data Intelligence"
        title="Platform Analytics"
        description="Deep-dive into revenue trends, user demographics, and product performance."
        action={
          <div className="flex items-center gap-3">
             <div className={`${glassCardClass} flex items-center gap-2 px-4 py-2`}>
                <Calendar className="h-4 w-4 text-white/40" />
                <span className="text-xs font-bold text-white/60">Q2 2026</span>
             </div>
             <button className={`${glassCardClass} flex items-center gap-2 px-4 py-2 hover:border-[#01F27B]/30 transition-colors group`}>
                <Filter className="h-4 w-4 text-white/40 group-hover:text-[#01F27B]" />
                <span className="text-xs font-bold text-white/60 group-hover:text-white">Filter</span>
             </button>
          </div>
        }
      />

      {/* Primary Analytics Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Growth Intelligence */}
        <div className={`${glassCardClass} p-8 animate-slide-up`} style={{ animationDelay: '100ms' }}>
          <div className="mb-8 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Revenue Intelligence</h3>
              <p className="text-[10px] font-medium text-white/40 uppercase tracking-widest">Monthly Growth & Projections</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-[#01F27B]">+24.5%</span>
              <p className="text-[10px] font-bold text-white/20 uppercase">Avg MoM Growth</p>
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics?.monthlyRevenue || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey={(d) => `${d._id.month}/${d._id.year}`} 
                  stroke="rgba(255,255,255,0.3)" 
                  fontSize={10} 
                  tickLine={false}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.3)" 
                  fontSize={10} 
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `$${val/1000}k`}
                />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: '#0b120e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Bar 
                  dataKey="revenue" 
                  fill="#01F27B" 
                  radius={[6, 6, 0, 0]}
                  barSize={40}
                >
                  {(metrics?.monthlyRevenue || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#01F27B' : '#01F27Bcc'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subscription Market Share */}
        <div className={`${glassCardClass} p-8 animate-slide-up`} style={{ animationDelay: '200ms' }}>
          <div className="mb-8 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Subscription Market Share</h3>
              <p className="text-[10px] font-medium text-white/40 uppercase tracking-widest">Tier Distribution Analysis</p>
            </div>
            <PieIcon className="h-5 w-5 text-purple-400" />
          </div>

          <div className="flex h-[350px] flex-col sm:flex-row items-center justify-center gap-8">
            <div className="h-full flex-1 w-full max-w-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={planComparison}
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {planComparison.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0b120e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-6 flex-1">
              {planComparison.map((plan, idx) => (
                <div key={plan.name} className="space-y-2">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                         <span className="text-xs font-bold text-white/60">{plan.name} Tier</span>
                      </div>
                      <span className="text-xs font-bold text-white">{plan.value.toLocaleString()}</span>
                   </div>
                   <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full" 
                        style={{ 
                          width: `${(plan.value / (summary?.totalUsers || 1)) * 100}%`,
                          backgroundColor: COLORS[idx % COLORS.length]
                        }} 
                      />
                   </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Analytics Strip */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* User Acquisition Area Chart */}
        <div className={`${glassCardClass} lg:col-span-2 p-8 animate-slide-up`} style={{ animationDelay: '300ms' }}>
          <div className="mb-8 space-y-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Acquisition Velocity</h3>
            <p className="text-[10px] font-medium text-white/40 uppercase tracking-widest">New Registered Users vs Engagement</p>
          </div>
          <div className="h-[250px] w-full">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userGrowthData}>
                   <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                         <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                   <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={10} axisLine={false} tickLine={false} />
                   <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} axisLine={false} tickLine={false} />
                   <Tooltip contentStyle={{ backgroundColor: '#0b120e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                   <Area type="step" dataKey="users" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={2} />
                </AreaChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Summary Card */}
        <div className={`${glassCardClass} p-8 flex flex-col justify-between animate-slide-up`} style={{ animationDelay: '400ms' }}>
           <div className="space-y-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#01F27B]/10 text-[#01F27B]">
                 <TrendingUp className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                 <h4 className="text-xl font-bold text-white">Portfolio Velocity</h4>
                 <p className="text-sm text-white/40">The current rate of deal completion and successful investment matches across the platform.</p>
              </div>
           </div>
           <div className="pt-8 border-t border-white/5 mt-auto">
              <div className="flex items-center justify-between mb-2">
                 <span className="text-xs font-bold text-white/40 uppercase">Conversion Efficiency</span>
                 <span className="text-xs font-bold text-[#01F27B]">High</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full bg-[#01F27B] w-[82%] rounded-full shadow-[0_0_10px_rgba(1,242,123,0.5)]" />
              </div>
           </div>
        </div>
      </div>

      {/* Plan Performance Radar or Detailed List */}
      <div className={`${glassCardClass} p-8 animate-slide-up`} style={{ animationDelay: '500ms' }}>
        <div className="mb-8 flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">Tier Unit Performance</h3>
            <p className="text-[10px] font-medium text-white/40 uppercase tracking-widest">Revenue vs Volume Comparison</p>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {productSales?.sales.map((sale) => (
            <div key={sale.plan} className="rounded-2xl bg-white/5 p-6 border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                 <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{sale.plan} Plan</span>
                 <ArrowUpRight className="h-4 w-4 text-white/20" />
              </div>
              <div>
                <p className="text-3xl font-black text-white">{sale.unitsSold}</p>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-tighter">Units Dispatched</p>
              </div>
              <div className="pt-4 border-t border-white/5">
                <p className="text-sm font-bold text-[#01F27B]">{formatCurrency(sale.totalRevenue)}</p>
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-tighter">Segment Revenue</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
