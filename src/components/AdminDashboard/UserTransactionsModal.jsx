import React, { useEffect, useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Shield, 
  CreditCard, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  RefreshCcw,
  ExternalLink,
  History
} from 'lucide-react';
import { useUserTransactions } from '../../hooks/useUserTransactions';
import { 
  glassCardClass, 
  Modal, 
  ProgressBar 
} from '../BoostFundrUI';
import { formatCurrency, formatDate } from '../../lib/utils';

export const UserTransactionsModal = ({ userId, isOpen, onClose }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { 
    userInfo, 
    transactions, 
    pagination, 
    loading, 
    error, 
    fetchTransactions 
  } = useUserTransactions(userId);

  useEffect(() => {
    if (isOpen && userId) {
      fetchTransactions({ page: currentPage, limit: 10 });
    }
  }, [isOpen, userId, currentPage, fetchTransactions]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-[#01F27B]" />
          <span>User Transaction History</span>
        </div>
      }
    >
      <div className="space-y-6">
        {/* User Info Section */}
        {userInfo && (
          <div className="rounded-2xl bg-white/5 p-4 border border-white/5 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#01F27B]/10 text-[#01F27B]">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white leading-tight">{userInfo.name}</h4>
                  <p className="text-sm text-white/40 flex items-center gap-1.5 mt-0.5">
                    <Mail className="h-3 w-3" />
                    {userInfo.email}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white/60">
                  <Shield className="h-3 w-3" />
                  {userInfo.role}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#01F27B]">
                  {userInfo.currentSubscription || 'Free'} Plan
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Transactions List */}
        <div className="space-y-3">
          <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 px-1">Recent Transactions</h5>
          
          <div className="max-h-[400px] overflow-y-auto pr-1 space-y-3 custom-scrollbar">
            {loading && transactions.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center gap-3">
                <RefreshCcw className="h-6 w-6 animate-spin text-white/20" />
                <p className="text-xs font-semibold uppercase tracking-widest text-white/30">Loading History...</p>
              </div>
            ) : transactions.length > 0 ? (
              transactions.map((txn) => (
                <div 
                  key={txn._id} 
                  className="group rounded-2xl bg-[#0c0c0c]/60 p-4 border border-white/5 transition-all hover:border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ${
                        txn.status === 'SUCCESS' ? 'text-emerald-400' : 
                        txn.status === 'FAILED' ? 'text-rose-400' : 'text-amber-400'
                      }`}>
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white uppercase">{txn.planId?.name || 'Subscription'}</p>
                        <p className="text-[10px] font-medium text-white/30 font-mono mt-0.5">{txn.invoiceId}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">{formatCurrency(txn.amount)}</p>
                      <p className="text-[10px] font-medium text-white/40 flex items-center justify-end gap-1 mt-0.5">
                        <Calendar className="h-3 w-3" />
                        {formatDate(txn.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                      txn.status === 'SUCCESS' ? 'text-emerald-400' : 
                      txn.status === 'FAILED' ? 'text-rose-400' : 'text-amber-400'
                    }`}>
                      {txn.status}
                    </span>
                    <button className="flex items-center gap-1.5 text-[10px] font-bold text-white/20 transition-colors hover:text-white">
                      View Receipt
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex h-32 flex-col items-center justify-center gap-2 text-white/20">
                <p className="text-sm font-medium italic">No transaction history found</p>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-white/5 pt-4">
            <span className="text-[10px] font-bold uppercase text-white/30">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={pagination.currentPage <= 1 || loading}
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 transition-all ${
                  pagination.currentPage <= 1 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white/5'
                }`}
              >
                <ChevronLeft className="h-4 w-4 text-white" />
              </button>
              <button
                disabled={pagination.currentPage >= pagination.totalPages || loading}
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 transition-all ${
                  pagination.currentPage >= pagination.totalPages ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white/5'
                }`}
              >
                <ChevronRight className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <button 
            onClick={onClose}
            className="rounded-xl border border-white/10 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white/60 transition-all hover:bg-white/5 hover:text-white"
          >
            Close Panel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default UserTransactionsModal;
