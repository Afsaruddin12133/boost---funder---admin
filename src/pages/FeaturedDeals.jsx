import React from 'react';
import { 
  Star, 
  Rocket, 
  Clock, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck,
  Zap,
  LayoutGrid
} from 'lucide-react';
import { PageHeader, glassCardClass } from '../components/BoostFundrUI';

const FeaturedDeals = () => {
  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        eyebrow="Curated Opportunities"
        title="Featured Deals"
        description="Hand-picked investment opportunities for elite platform visibility."
      />

      {/* Coming Soon Premium Section */}
      <div className={`${glassCardClass} relative overflow-hidden p-12 min-h-[500px] flex flex-col items-center justify-center text-center`}>
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#01F27B]/10 rounded-full blur-[100px]" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-8">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-[#01F27B]/20" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white/5 border border-white/10 shadow-[0_0_30px_rgba(1,242,123,0.15)]">
                <Rocket className="h-10 w-10 text-[#01F27B]" />
              </div>
              <div className="absolute -right-2 -top-2">
                 <Sparkles className="h-6 w-6 text-amber-400 animate-pulse" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter sm:text-5xl">
              Coming <span className="text-[#01F27B]">Soon</span>
            </h2>
            <p className="text-lg text-white/40 font-medium">
              We're building a sophisticated engine to highlight high-potential startups. 
              The Featured Deals module will include advanced visibility controls and elite investor matching.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
             {[
               { icon: Zap, label: 'Boosted Visibility' },
               { icon: TrendingUp, label: 'Performance Metrics' },
               { icon: ShieldCheck, label: 'Elite Verification' }
             ].map((feature, idx) => (
               <div key={idx} className="rounded-2xl bg-white/5 p-4 border border-white/5 flex flex-col items-center gap-3 transition-transform hover:scale-105">
                 <feature.icon className="h-5 w-5 text-white/60" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{feature.label}</span>
               </div>
             ))}
          </div>

          <div className="pt-8">
             <div className="inline-flex items-center gap-3 rounded-full bg-[#01F27B]/10 px-6 py-2 border border-[#01F27B]/20">
                <Clock className="h-4 w-4 text-[#01F27B]" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#01F27B]">Development Phase 2.0</span>
             </div>
          </div>
        </div>
      </div>

      {/* Placeholder Grid to show future layout */}
      <div className="space-y-4 opacity-20 pointer-events-none grayscale">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/20 px-2 flex items-center gap-2">
          <LayoutGrid className="h-3 w-3" />
          Proposed Layout Preview
        </h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`${glassCardClass} h-[300px] border-dashed border-white/10`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedDeals;
