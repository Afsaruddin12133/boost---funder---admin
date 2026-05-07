import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Download,
  CreditCard,
  User,
  Calendar,
  Layers,
  CircleDollarSign,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAllPayments } from '../../hooks/useAllPayments';
import { 
  glassCardClass, 
  SectionTitle, 
  Select, 
  outlineButtonClass 
} from '../BoostFundrUI';
import Table from '../Table';
import { formatCurrency, formatDate } from '../../lib/utils';
import UserTransactionsModal from './UserTransactionsModal';
import PaymentDetailsModal from './PaymentDetailsModal';

export const PaymentsTable = () => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const { 
    payments, 
    pagination, 
    loading, 
    filters, 
    handlePageChange, 
    handleStatusChange,
    refresh 
  } = useAllPayments({ page: 1, limit: 10 });

  const handleExportCSV = () => {
    if (!payments || payments.length === 0) {
      toast.error('No payments to export');
      return;
    }

    try {
      const headers = ['Date', 'User', 'Email', 'Plan', 'Amount', 'Currency', 'Status', 'Transaction ID'];
      const rows = payments.map(p => [
        formatDate(p.createdAt),
        `${p.userId?.firstName || ''} ${p.userId?.lastName || ''}`,
        p.userId?.email || '',
        p.planId?.name || 'N/A',
        p.amount,
        p.currency || 'AED',
        p.status,
        p.paymentId || p._id
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `payments_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Payment audit exported successfully');
    } catch (err) {
      toast.error('Export failed');
    }
  };

  const handleUserClick = (userId) => {
    setSelectedUserId(userId);
    setIsUserModalOpen(true);
  };

  const handlePaymentClick = (paymentId) => {
    setSelectedPaymentId(paymentId);
    setIsDetailModalOpen(true);
  };

    console.log("payments data from table : ",payments)
  const columns = [
    { 
      key: 'user', 
      label: 'User', 
      render: (row) => (
        <button 
          onClick={() => handleUserClick(row.userId?._id)}
          className="flex items-center gap-3 text-left transition-transform hover:scale-[1.02] active:scale-95"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/40">
            <User className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-white">
              {row.userId?.firstName} {row.userId?.lastName}
            </span>
            <span className="text-xs text-white/40">{row.userId?.email}</span>
          </div>
        </button>
      )
    },
    { 
      key: 'plan', 
      label: 'Plan', 
      render: (row) => (
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-[#01F27B]/60" />
          <span className="text-sm font-medium text-white/80 uppercase">
            {row.planId?.name || 'N/A'}
          </span>
        </div>
      )
    },
    { 
      key: 'amount', 
      label: 'Amount', 
      render: (row) => (
        <div className="flex items-center gap-1.5 font-bold text-white">
          <CircleDollarSign className="h-4 w-4 text-[#01F27B]" />
          {formatCurrency(row.amount)}
        </div>
      )
    },
    { 
      key: 'status', 
      label: 'Status', 
      type: 'status',
      render: (row) => {
        const status = row.status?.toLowerCase();
        const styles = {
          success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
          failed: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
          pending: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
        };
        
        return (
          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${styles[status] || 'bg-white/10 text-white/40 border-white/10'}`}>
            {row.status}
          </span>
        );
      }
    },
    { 
      key: 'createdAt', 
      label: 'Date', 
      render: (row) => (
        <div className="flex items-center gap-2 text-white/60">
          <Calendar className="h-4 w-4 opacity-50" />
          {formatDate(row.createdAt)}
        </div>
      )
    },
    {
      key: 'action',
      label: 'Action',
      render: (row) => (
        <button 
          onClick={() => handlePaymentClick(row._id)}
          className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#01F27B] transition-all hover:bg-white/10"
        >
          <FileText className="h-3 w-3" />
          Details
        </button>
      )
    }
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'SUCCESS', label: 'Success' },
    { value: 'FAILED', label: 'Failed' },
    { value: 'PENDING', label: 'Pending' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <SectionTitle 
          title="Payment History" 
          action={
            <div className="flex items-center gap-2 text-xs text-white/40">
              <Activity className="h-3 w-3" />
              {pagination?.totalItems || 0} Transactions Found
            </div>
          }
        />
        
        <div className="flex items-center gap-3">
          <Select 
            value={filters.status || ''} 
            onChange={handleStatusChange}
            options={statusOptions}
            className="w-48"
          />
          <button 
            onClick={handleExportCSV}
            className={`${outlineButtonClass} gap-2`}
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      <div className="relative">
        <Table 
          columns={columns} 
          data={payments} 
          initialSort={{ key: 'createdAt', direction: 'desc' }} 
        />
        
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#01F27B] border-t-transparent" />
              <p className="text-xs font-semibold uppercase tracking-widest text-[#01F27B]">Syncing Payments...</p>
            </div>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 && (
        <div className={`${glassCardClass} flex items-center justify-between px-6 py-4`}>
          <p className="text-sm text-white/40">
            Showing <span className="font-semibold text-white">{(pagination.currentPage - 1) * pagination.itemsPerPage + 1}</span> to <span className="font-semibold text-white">{Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}</span> of <span className="font-semibold text-white">{pagination.totalItems}</span> results
          </p>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1 || loading}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 transition-all ${pagination.currentPage <= 1 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white/5 hover:border-white/20'}`}
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            
            <div className="flex items-center gap-1 mx-2">
              {[...Array(pagination.totalPages)].map((_, i) => {
                const pageNum = i + 1;
                // Simple logic to show only a few page numbers if there are many
                if (
                  pageNum === 1 || 
                  pageNum === pagination.totalPages || 
                  (pageNum >= pagination.currentPage - 1 && pageNum <= pagination.currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`h-10 w-10 rounded-xl text-sm font-bold transition-all ${pagination.currentPage === pageNum ? 'bg-[#01F27B] text-black shadow-[0_0_15px_rgba(1,242,123,0.3)]' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                    >
                      {pageNum}
                    </button>
                  );
                }
                if (pageNum === pagination.currentPage - 2 || pageNum === pagination.currentPage + 2) {
                  return <span key={pageNum} className="px-1 text-white/20">...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages || loading}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 transition-all ${pagination.currentPage >= pagination.totalPages ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white/5 hover:border-white/20'}`}
            >
              <ChevronRight className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      )}

      {/* User Transaction History Modal */}
      <UserTransactionsModal 
        userId={selectedUserId}
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
      />

      {/* Specific Payment Details Modal */}
      <PaymentDetailsModal 
        paymentId={selectedPaymentId}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </div>
  );
};

// Internal Activity icon for SectionTitle action
const Activity = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

export default PaymentsTable;
