import React, { useEffect } from 'react';
import { 
  FileText, 
  User, 
  Box, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  CreditCard,
  Mail,
  Shield,
  Layers,
  ListChecks,
  History,
  RefreshCcw,
  ArrowRight
} from 'lucide-react';
import { usePaymentDetails } from '../../hooks/usePaymentDetails';
import { 
  Modal, 
  statusBadgeClass,
  glassCardClass 
} from '../BoostFundrUI';
import { formatCurrency, formatDate } from '../../lib/utils';

export const PaymentDetailsModal = ({ paymentId, isOpen, onClose }) => {
  const { payment, loading, error, fetchPaymentDetails } = usePaymentDetails();

  useEffect(() => {
    if (isOpen && paymentId) {
      fetchPaymentDetails(paymentId);
    }
  }, [isOpen, paymentId, fetchPaymentDetails]);

  if (!isOpen) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-[#01F27B]" />
          <span>Transaction Deep-Dive</span>
        </div>
      }
    >
      <div className="space-y-8 py-2">
        {loading && !payment ? (
          <div className="flex h-60 flex-col items-center justify-center gap-3">
            <RefreshCcw className="h-8 w-8 animate-spin text-[#01F27B]/40" />
            <p className="text-xs font-semibold uppercase tracking-widest text-white/30">Retrieving Invoice Data...</p>
          </div>
        ) : payment ? (
          <>
            {/* Invoice Header Section */}
            <div className="rounded-3xl bg-gradient-to-br from-white/5 to-transparent p-6 border border-white/10">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Invoice Reference</span>
                  <h4 className="text-2xl font-bold text-white font-mono">{payment.invoiceId || 'N/A'}</h4>
                  <p className="text-[10px] font-medium text-white/25">Payment ID: {payment._id}</p>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <span className={`inline-flex items-center gap-2 rounded-xl border px-4 py-1.5 text-xs font-bold uppercase tracking-widest ${
                    payment.status === 'SUCCESS' ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400' :
                    payment.status === 'FAILED' ? 'border-rose-500/20 bg-rose-500/10 text-rose-400' :
                    'border-amber-500/20 bg-amber-500/10 text-amber-400'
                  }`}>
                    {payment.status === 'SUCCESS' ? <CheckCircle2 className="h-3.5 w-3.5" /> : 
                     payment.status === 'FAILED' ? <XCircle className="h-3.5 w-3.5" /> : 
                     <Clock className="h-3.5 w-3.5" />}
                    {payment.status}
                  </span>
                  <div className="flex flex-col items-end">
                    <span className="text-3xl font-black text-white">{formatCurrency(payment.amount)}</span>
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Total Transaction Value</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid for User and Plan */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* User Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#01F27B]/60">
                  <User className="h-4 w-4" />
                  <h5 className="text-[10px] font-black uppercase tracking-widest">Customer Profile</h5>
                </div>
                <div className="rounded-2xl bg-white/5 p-5 border border-white/5 space-y-4">
                   <div>
                     <p className="text-sm font-bold text-white">{payment.userId?.firstName} {payment.userId?.lastName}</p>
                     <p className="text-xs text-white/40 flex items-center gap-1.5 mt-1">
                       <Mail className="h-3 w-3" />
                       {payment.userId?.email}
                     </p>
                   </div>
                   <div className="flex items-center gap-3 border-t border-white/5 pt-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/40">
                        <Shield className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase text-white/30 tracking-widest">Account Tier</p>
                        <p className="text-xs font-bold text-[#01F27B] uppercase">{payment.userId?.subscription?.plan || 'Standard'}</p>
                      </div>
                   </div>
                   {payment.userId?.subscription?.expiresAt && (
                     <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/40">
                          <Clock className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase text-white/30 tracking-widest">Tier Expiry</p>
                          <p className="text-xs font-bold text-white">{formatDate(payment.userId.subscription.expiresAt)}</p>
                        </div>
                     </div>
                   )}
                </div>
              </div>

              {/* Plan Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-blue-400/60">
                  <Box className="h-4 w-4" />
                  <h5 className="text-[10px] font-black uppercase tracking-widest">Product Details</h5>
                </div>
                <div className="rounded-2xl bg-white/5 p-5 border border-white/5 space-y-4">
                   <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm font-bold text-white uppercase">{payment.planId?.name || 'Subscription'}</p>
                        <p className="text-xs text-white/40 mt-1">{payment.planId?.duration || 30} Days Validity</p>
                     </div>
                     <Layers className="h-8 w-8 text-white/5" />
                   </div>
                   
                   {payment.planId?.features && (
                     <div className="border-t border-white/5 pt-4">
                        <p className="text-[10px] font-bold uppercase text-white/30 tracking-widest mb-3 flex items-center gap-2">
                          <ListChecks className="h-3 w-3" />
                          Included Features
                        </p>
                        <ul className="space-y-2">
                          {payment.planId.features.slice(0, 3).map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-[10px] font-semibold text-white/60">
                              <ArrowRight className="h-2 w-2 text-[#01F27B]" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                     </div>
                   )}
                </div>
              </div>
            </div>

            {/* Timeline Section */}
            <div className="space-y-4">
               <div className="flex items-center gap-2 text-purple-400/60">
                <History className="h-4 w-4" />
                <h5 className="text-[10px] font-black uppercase tracking-widest">Transaction Timeline</h5>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-[#0c0c0c]/60 p-4 border border-white/5">
                   <p className="text-[10px] font-bold uppercase text-white/30 tracking-widest">Initialized</p>
                   <p className="text-xs font-bold text-white mt-1">{new Date(payment.createdAt).toLocaleString()}</p>
                </div>
                <div className="rounded-2xl bg-[#0c0c0c]/60 p-4 border border-white/5">
                   <p className="text-[10px] font-bold uppercase text-white/30 tracking-widest">Last Modified</p>
                   <p className="text-xs font-bold text-white mt-1">{new Date(payment.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-40 flex-col items-center justify-center text-white/20 italic">
            <p>Invoice data unavailable</p>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <button 
            onClick={onClose}
            className="rounded-xl border border-white/10 px-8 py-3 text-xs font-bold uppercase tracking-widest text-white/60 transition-all hover:bg-white/5 hover:text-white"
          >
            Close Insight
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentDetailsModal;
