import {
  Activity,
  ArrowLeft,
  Briefcase,
  Check,
  DollarSign,
  FileText,
  Globe,
  Layers,
  MessageCircle,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
  XCircle
} from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  glassCardClass,
  primaryButtonClass,
  ProgressBar
} from '../components/BoostFundrUI'
import RejectionModal from '../components/deals/RejectionModal'
import StatusBadge from '../components/deals/StatusBadge'
import { formatCurrency, formatDate, getToken } from '../lib/utils'
import apiClient from '../services/apiClient'

const GridCard = ({ title, subtitle, icon: Icon, children, className = "" }) => (
  <div className={`${glassCardClass} flex flex-col p-4 sm:p-6 transition-all duration-500 hover:border-[#01F27B]/30 hover:translate-y-[-4px] group ${className}`}>
    <div className="flex items-center justify-between mb-4 sm:mb-6">
      <div className="space-y-0.5 sm:space-y-1">
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-white/40">{title}</h3>
        {subtitle && <p className="text-[10px] sm:text-xs text-[#01F27B]/60 font-medium">{subtitle}</p>}
      </div>
      <div className="rounded-lg sm:rounded-xl bg-[#01F27B]/10 p-2 sm:p-2.5 text-[#01F27B] group-hover:bg-[#01F27B] group-hover:text-black transition-all duration-500 shadow-[0_0_15px_rgba(1,242,123,0.1)]">
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2.5} />
      </div>
    </div>
    <div className="flex-1">{children}</div>
  </div>
)

const MetricBox = ({ label, value, icon: Icon }) => (
  <div className="flex items-center gap-2 sm:gap-4 rounded-lg sm:rounded-2xl bg-white/[0.03] p-2.5 sm:p-4 border border-white/5 hover:border-white/10 transition-all">
    <div className="rounded-lg sm:rounded-xl bg-white/5 p-1.5 sm:p-2 text-white/40">
      {Icon && <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
      {!Icon && <div className="h-3.5 w-3.5 sm:h-4 sm:w-4 border-2 border-current rounded-full opacity-20" />}
    </div>
    <div>
      <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-white/30">{label}</p>
      <p className="text-xs sm:text-sm font-bold text-white/90">{value}</p>
    </div>
  </div>
)

const DetailRow = ({ label, value, className = '' }) => (
  <div className={`rounded-lg sm:rounded-2xl border border-white/5 bg-white/[0.03] p-2.5 sm:p-4 ${className}`}>
    <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white/35">{label}</p>
    <p className="mt-1 sm:mt-2 text-xs sm:text-sm font-medium leading-relaxed text-white/80">{value || 'Not provided'}</p>
  </div>
)

const DealDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [deal, setDeal] = useState(location.state?.deal || null)
  const [isLoading, setIsLoading] = useState(!location.state?.deal)
  const [error, setError] = useState(null)
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('intelligence')

  const TABS = [
    { id: 'intelligence', label: 'Intelligence', icon: Target },
    { id: 'performance', label: 'Performance', icon: Activity },
    { id: 'financials', label: 'Financials', icon: DollarSign },
    { id: 'vault', label: 'The Vault', icon: Layers },
    { id: 'qa', label: 'Q&A', icon: MessageCircle }
  ]

  useEffect(() => {
    if (deal) return // Skip fetch if we have data from state

    const fetchDeal = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const token = getToken()
        const response = await apiClient.request(`/api/v1/deals/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const fetchedDeal = response.data?.deal || response.data?.data || response.data
        if (!fetchedDeal) throw new Error('Deal not found')
        setDeal(fetchedDeal)
      } catch (error) {
        console.error('Failed to fetch deal:', error)
        setError(error.message || 'Failed to load deal details')
      } finally {
        setIsLoading(false)
      }
    }
    fetchDeal()
  }, [id, deal])

  const updateStatus = async (newStatus, reason = null) => {
    setActionLoading(true)
    try {
      const token = getToken()
      await apiClient.request(`/api/v1/deals/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus, reason }),
        headers: { Authorization: `Bearer ${token}` }
      })
      toast.success(`Deal ${newStatus} successfully`)
      setDeal(prev => ({ ...prev, status: newStatus }))
      setIsRejectModalOpen(false)
    } catch (error) {
      toast.error(error.message || 'Action failed')
    } finally {
      setActionLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-[#01F27B] border-t-transparent shadow-[0_0_20px_rgba(1,242,123,0.2)]" />
      </div>
    )
  }

  if (error || !deal) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-6">
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-8 text-center backdrop-blur-xl max-w-md">
           <XCircle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
           <h2 className="text-xl font-bold text-white mb-2">Intelligence Unavailable</h2>
           <p className="text-sm text-white/50">{error || 'The requested deal could not be retrieved from the vault.'}</p>
        </div>
        <button 
          onClick={() => navigate('/deals')}
          className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-8 py-3 text-sm font-bold text-white transition-all hover:bg-white/10"
        >
          <ArrowLeft className="h-5 w-5" />
          Return to Control Center
        </button>
      </div>
    )
  }

  const basicInfo = deal.basicInfo || {}
  const story = deal.story || {}
  const funding = deal.funding || {}
  const execution = deal.execution || {}
  const documents = deal.documents || {}
  const category = basicInfo.category || deal.category
  const stage = basicInfo.stage || deal.stage
  const locationLabel = basicInfo.location || deal.location
  const whatsappNumber = basicInfo.whatsappNumber || deal.whatsappNumber
  const whatsappDigits = String(whatsappNumber || '').replace(/\D/g, '')
  const whatsappLink = whatsappDigits ? `https://wa.me/${whatsappDigits}` : null
  const targetMarket = story.targetMarket || deal.targetMarket
  const whyNow = story.whyNow || deal.whyNow
  const businessModel = execution.businessModel || story.businessModel || deal.businessModel
  const goToMarket = execution.goToMarket || story.goToMarket || deal.goToMarket
  const topCompetitor = execution.topCompetitor || story.topCompetitor || deal.topCompetitor
  const advantage = execution.advantage || story.advantage || deal.advantage
  const useOfFunds = execution.useOfFunds || funding.useOfFunds || story.useOfFunds || deal.useOfFunds
  const qaItems = Array.isArray(execution.qa)
    ? execution.qa
    : Array.isArray(story.qa)
      ? story.qa
      : Array.isArray(deal.qa)
        ? deal.qa
        : []
  const useOfFundsItems = Array.isArray(useOfFunds)
    ? useOfFunds
    : typeof useOfFunds === 'string' && useOfFunds.trim()
      ? [{ category: 'Allocation', percentage: null, note: useOfFunds }]
      : []
  const completionFlags = deal.flags || {}
  const completionScore = deal.profileCompletionScore ?? 0

  return (
    <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8 px-4 sm:px-6 pb-16 sm:pb-20 animate-in fade-in duration-700">
      {/* Top Navigation & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button 
          onClick={() => navigate('/deals')}
          className="group flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-bold uppercase tracking-widest text-white/40 transition-colors hover:text-[#01F27B]"
        >
          <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:-translate-x-1" />
          Back to Inventory
        </button>
        
        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            onClick={() => setIsRejectModalOpen(true)}
            disabled={deal.status === 'rejected' || actionLoading}
            className="flex items-center gap-1.5 sm:gap-2 rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 sm:px-6 py-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-rose-500 transition-all hover:bg-rose-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <XCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>Reject</span>
          </button>
          <button 
            onClick={() => updateStatus('approved')}
            disabled={deal.status === 'approved' || actionLoading}
            className={`${primaryButtonClass} gap-1.5 sm:gap-2 !px-4 sm:!px-8 !py-2 text-[10px] sm:text-xs disabled:opacity-50`}
          >
            {actionLoading ? 'Processing...' : (
              <>
                <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Approve for Feed</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Hero Header Section */}
      <div className={`${glassCardClass} relative overflow-hidden`}>
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#01F27B]/5 blur-[100px]" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-blue-500/5 blur-[100px]" />
        
        <div className="relative p-6 sm:p-10 lg:p-12">
          <div className="flex flex-col lg:flex-row gap-8 lg:items-center">
            <div className="relative flex-shrink-0 mx-auto lg:mx-0">
              <div className="absolute -inset-4 rounded-3xl bg-[#01F27B]/10 blur-xl animate-pulse" />
              <img 
                src={basicInfo.startupLogo} 
                alt={basicInfo.startupName} 
                className="relative h-32 w-32 md:h-40 md:w-40 rounded-3xl border border-white/10 bg-black/50 p-3 shadow-2xl object-contain"
              />
            </div>
            
            <div className="flex-1 text-center lg:text-left space-y-4">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4">
                <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black tracking-tight text-white leading-none">
                  {basicInfo.startupName}
                </h1>
                <div className="flex items-center gap-2">
                  <StatusBadge status={deal.status} />
                  {deal.verificationBadge?.isVerified ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-emerald-400 border border-emerald-500/40">
                      <ShieldCheck className="h-3 w-3" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-rose-400 border border-rose-500/40">
                      <XCircle className="h-3 w-3" /> Not Verified
                    </span>
                  )}
                </div>
              </div>
              
              <p className="text-lg sm:text-xl font-medium text-white/60 max-w-3xl leading-relaxed mx-auto lg:mx-0">
                {basicInfo.tagline}
              </p>
              
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-2">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/60">
                  {category || 'N/A'}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white/60">
                  {stage || 'N/A'}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold tracking-wide text-white/60">
                  {locationLabel || 'Global'}
                </span>
              </div>
              
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4">
                {whatsappLink && (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-sm font-bold text-[#01F27B] transition-all hover:translate-y-[-2px]"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>Talk with Founder</span>
                  </a>
                )}
                {basicInfo.startupWebsite && (
                  <a 
                    href={basicInfo.startupWebsite} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-bold text-white/40 transition-colors hover:text-white"
                  >
                    <Globe className="h-5 w-5" />
                    <span>Website</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Tab Switcher */}
        <div className="px-6 sm:px-10 border-t border-white/5 bg-white/2">
          <div className="flex overflow-x-auto no-scrollbar gap-8">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative py-5 text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id ? 'text-[#01F27B]' : 'text-white/30 hover:text-white/60'
                }`}
              >
                <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? 'text-[#01F27B]' : 'text-white/20'}`} />
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#01F27B] shadow-[0_-4px_12px_rgba(1,242,123,0.5)] rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content Area */}
      <div className="min-h-[400px]">
        {activeTab === 'intelligence' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid gap-6 lg:grid-cols-3">
              <GridCard title="Product Story" subtitle="Strategic Vision" icon={Briefcase} className="lg:col-span-3">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-[#01F27B]/60 mb-1.5">The Problem</h4>
                      <p className="text-sm text-white/70 leading-relaxed">{story.problem}</p>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-[#01F27B]/60 mb-1.5">The Solution</h4>
                      <p className="text-sm text-white/70 leading-relaxed">{story.solution}</p>
                    </div>
                  </div>
                  <div className="space-y-4 border-l border-white/5 pl-6">
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-[#01F27B]/60 mb-1.5">Strategic Vision</h4>
                      <p className="text-sm text-white/70 leading-relaxed">{story.vision}</p>
                    </div>
                  </div>
                </div>
              </GridCard>
            </div>

            <GridCard title="Market & Strategy" subtitle="Founder Narrative" icon={Target}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <DetailRow label="Target Market" value={targetMarket} />
                <DetailRow label="Why Now" value={whyNow} />
                <DetailRow label="Business Model" value={businessModel} />
                <DetailRow label="Go-To-Market" value={goToMarket} />
                <DetailRow label="Top Competitor" value={topCompetitor} />
                <DetailRow label="Core Advantage" value={advantage} />
              </div>
            </GridCard>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <GridCard title="Execution Metrics" subtitle="Operational Performance" icon={TrendingUp}>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <MetricBox label="Revenue" value={formatCurrency(execution.revenue || 0, funding.currency || 'USD')} icon={DollarSign} />
                <MetricBox label="Monthly Users" value={funding.users?.toLocaleString() || '0'} icon={Users} />
                <MetricBox label="Growth Rate" value={`${funding.growthRate || 0}% MoM`} icon={TrendingUp} />
                <MetricBox label="CAC" value={formatCurrency(funding.CAC || 0, funding.currency || 'USD')} />
                <MetricBox label="LTV" value={formatCurrency(funding.LTV || 0, funding.currency || 'USD')} />
                <MetricBox label="Churn Rate" value={`${funding.CHURN || 0}%`} />
              </div>
            </GridCard>

            <GridCard title="Core Personnel" subtitle="Leadership Team" icon={Users}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {execution.team?.map((member, i) => (
                  <div key={i} className="group flex items-center gap-4 rounded-2xl bg-white/2 p-4 border border-white/5 hover:border-[#01F27B]/30 hover:bg-white/5 transition-all">
                    <div className="h-12 w-12 rounded-xl bg-[#01F27B]/10 flex items-center justify-center text-[#01F27B] font-black text-xl group-hover:bg-[#01F27B] group-hover:text-black transition-all">
                      {member.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-base font-bold text-white">{member.name}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">{member.role}</p>
                    </div>
                  </div>
                ))}
                {!execution.team?.length && (
                  <div className="col-span-full text-center py-12 text-white/20 italic text-sm border border-dashed border-white/10 rounded-3xl">
                    Personnel records not disclosed
                  </div>
                )}
              </div>
            </GridCard>
          </div>
        )}

        {activeTab === 'financials' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid gap-6 lg:grid-cols-2">
              <GridCard title="Funding Blueprint" subtitle="Current Round Logistics" icon={Target}>
                <div className="space-y-8">
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-white/30">Capital Goal</p>
                    <p className="text-5xl font-black text-white">{formatCurrency(funding.goalAmount || 0, funding.currency || 'USD')}</p>
                  </div>
                  <div className="space-y-4">
                    <ProgressBar progress={Math.round(((funding.raisedAmount || 0)/(funding.goalAmount || 1))*100)} label="Commitment Progress" />
                    <div className="flex justify-between text-[11px] font-black uppercase tracking-tighter">
                      <span className="text-white/40">Min: {formatCurrency(funding.minimumInvestment || 0, funding.currency || 'USD')}</span>
                      <span className="text-[#01F27B]">{formatCurrency(funding.raisedAmount || 0, funding.currency || 'USD')} RAISED</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                    <DetailRow label="Deadline" value={formatDate(funding.deadline)} />
                    <DetailRow label="Valuation" value={funding.valuation ? formatCurrency(funding.valuation, funding.currency || 'USD') : 'TBD'} />
                  </div>
                </div>
              </GridCard>

              <GridCard title="Capital Allocation" subtitle="Use of Funds" icon={TrendingUp}>
                <div className="space-y-6">
                  {useOfFundsItems.length > 0 ? (
                    <>
                      <div className="flex h-12 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-inner">
                        {useOfFundsItems.map((item, idx) => {
                          const pct = Number.isFinite(Number(item?.percentage)) ? Math.max(0, Math.min(100, Number(item?.percentage))) : 0
                          const colors = ['bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-emerald-500']
                          return pct > 0 ? (
                            <div
                              key={idx}
                              className={`${colors[idx % colors.length]} transition-all duration-500 hover:brightness-110`}
                              style={{ width: `${pct}%` }}
                              title={`${item?.category}: ${pct}%`}
                            />
                          ) : null
                        })}
                      </div>
                      <div className="grid gap-3">
                        {useOfFundsItems.map((item, idx) => {
                          const pct = Number.isFinite(Number(item?.percentage)) ? Math.max(0, Math.min(100, Number(item?.percentage))) : 0
                          const colors = ['bg-blue-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-emerald-500']
                          return (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/2 border border-white/5">
                              <div className="flex items-center gap-3">
                                <div className={`h-2.5 w-2.5 rounded-full ${colors[idx % colors.length]}`} />
                                <span className="text-xs font-bold text-white/80">{item?.category}</span>
                              </div>
                              <span className="text-xs font-black text-[#01F27B]">{pct}%</span>
                            </div>
                          )
                        })}
                      </div>
                    </>
                  ) : (
                    <div className="py-12 text-center text-white/20 italic text-sm">Allocation data not available</div>
                  )}
                </div>
              </GridCard>
            </div>
          </div>
        )}

        {activeTab === 'vault' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[
                { label: 'Pitch Deck', key: 'pitchDeck' },
                { label: 'Safe Agreement', key: 'safeAgreement' },
                { label: 'Term Sheet', key: 'termSheet' },
                { label: 'Cap Table', key: 'capTable' },
                { label: 'Revenue Proof', key: 'revenueProof' },
                { label: 'Trade License', key: 'tradeLicense' },
                { label: 'Reg. Certificate', key: 'registrationCertificate' },
                { label: 'Financials', key: 'balanceSheet' },
                { label: 'Shareholder Agreement', key: 'shareholderAgreement' }
              ].map((doc) => {
                const hasDoc = !!documents[doc.key]
                return (
                  <a 
                    key={doc.key}
                    href={hasDoc ? documents[doc.key] : '#'}
                    target={hasDoc ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className={`${glassCardClass} flex flex-col p-6 transition-all group ${!hasDoc ? 'opacity-30 grayscale cursor-not-allowed' : 'hover:border-[#01F27B]/40 hover:bg-[#01F27B]/5 hover:translate-y-[-4px]'}`}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className={`p-3 rounded-2xl ${hasDoc ? 'bg-[#01F27B]/10 text-[#01F27B]' : 'bg-white/5 text-white/20'}`}>
                        <FileText className="h-6 w-6" />
                      </div>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white/60 transition-colors">{doc.label}</p>
                    <p className="text-sm font-bold text-white mt-1">{hasDoc ? 'Secure Access' : 'Missing'}</p>
                  </a>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'qa' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <GridCard title="Founder Q&A" subtitle="Investor Readiness" icon={MessageCircle}>
              <div className="space-y-4">
                {qaItems.length > 0 ? (
                  qaItems.map((item, index) => {
                    const question = typeof item === 'string' ? `Q${index + 1}` : item?.question || `Q${index + 1}`
                    const answer = typeof item === 'string' ? item : item?.answer || item?.response || ''
                    return (
                      <div key={index} className="rounded-2xl border border-white/5 bg-white/2 p-5 hover:bg-white/5 transition-all">
                        <p className="text-xs font-black uppercase tracking-widest text-[#01F27B]/70 mb-2">{question}</p>
                        <p className="text-sm leading-relaxed text-white/75">{answer || 'No response provided.'}</p>
                      </div>
                    )
                  })
                ) : (
                  <div className="py-12 text-center text-white/20 italic text-sm">No Q&A data available</div>
                )}
              </div>
            </GridCard>
          </div>
        )}
      </div>

      <RejectionModal 
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        startupName={basicInfo.startupName}
        onConfirm={(reason) => updateStatus('rejected', reason)}
      />
    </div>
  )
}

export default DealDetail


