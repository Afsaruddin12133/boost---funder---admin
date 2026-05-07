import React from 'react';
import { 
  ShoppingBag, 
  TrendingUp, 
  Award, 
  Zap, 
  BarChart3, 
  PieChart,
  RefreshCcw,
  ArrowUpRight,
  Target
} from 'lucide-react';
import { useProductSales } from '../../hooks/useProductSales';
import { 
  glassCardClass, 
  SectionTitle, 
  ProgressBar 
} from '../BoostFundrUI';
import { formatCurrency } from '../../lib/utils';

export const ProductSales = () => {
  const { productSales, loading, error, refresh } = useProductSales();

  if (loading && !productSales) {
    return (
      <div className={`${glassCardClass} flex h-[250px] items-center justify-center`}>
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#01F27B] border-t-transparent" />
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40">Syncing Market Data...</p>
        </div>
      </div>
    );
  }

  if (error || !productSales) return null;

  return (
    <div className="space-y-6">
      <SectionTitle 
        title="Product Performance" 
        action={
          <button 
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#01F27B] hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            <RefreshCcw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Syncing...' : 'Refresh Sales'}
          </button>
        }
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Total Volume Card */}
        <div className={`${glassCardClass} flex flex-col justify-between p-6 bg-gradient-to-br from-white/5 to-transparent min-w-[240px]`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Market Volume</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#01F27B]/10 text-[#01F27B]">
                <ShoppingBag className="h-5 w-5" />
              </div>
            </div>
            <div>
              <h4 className="text-4xl font-bold text-white">{productSales.totalProductsSold?.toLocaleString()}</h4>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 mt-1">Total Units Dispatched</p>
            </div>
          </div>
          
          <div className="mt-8 flex items-center gap-2 text-emerald-400">
            <TrendingUp className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Growth Phase</span>
          </div>
        </div>

        {/* Sales Detail Cards */}
        <div className="flex-1 grid gap-6 md:grid-cols-2 xl:grid-cols-1">
          {productSales.sales.map((sale) => (
            <div 
              key={sale.plan} 
              className={`${glassCardClass} overflow-hidden p-6 transition-all hover:border-white/20 group`}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {sale.plan === 'pro' ? (
                      <Zap className="h-4 w-4 text-blue-400" />
                    ) : (
                      <Award className="h-4 w-4 text-[#01F27B]" />
                    )}
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                      {sale.plan} Tier
                    </h3>
                  </div>
                  <p className="text-[10px] font-medium text-white/40 uppercase">Performance Metrics</p>
                </div>
                <div className="text-right">
                  <span className={`text-2xl font-black ${sale.plan === 'pro' ? 'text-blue-400' : 'text-[#01F27B]'}`}>
                    {sale.percentage}
                  </span>
                  <p className="text-[10px] font-bold text-white/20 uppercase tracking-tighter">Share</p>
                </div>
              </div>

              <div className="mt-6 space-y-6">
                {/* Progress Visual */}
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold uppercase text-white/30 tracking-widest">Dominance</span>
                    <span className="text-[10px] font-bold text-white/60">{sale.unitsSold} Units</span>
                  </div>
                  <ProgressBar 
                    progress={parseFloat(sale.percentage)} 
                    color={sale.plan === 'pro' ? '#3b82f6' : '#01F27B'} 
                  />
                </div>

                {/* Grid Stats */}
                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-white/30">Total Value</span>
                    <p className="text-xl font-bold text-white">{formatCurrency(sale.totalRevenue)}</p>
                  </div>
                  <div className="space-y-1 border-l border-white/5 pl-4">
                    <span className="text-[10px] font-bold uppercase text-white/30">Avg Price</span>
                    <p className="text-xl font-bold text-white">{formatCurrency(sale.averagePrice)}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <button className="flex items-center gap-1 text-[10px] font-bold text-white/10 group-hover:text-white/40 transition-colors">
                  View Segment Details
                  <ArrowUpRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductSales;
