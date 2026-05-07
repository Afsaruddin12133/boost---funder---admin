import React, { useState } from 'react';
import { 
  CreditCard, 
  BarChart3, 
  TrendingUp, 
  History, 
  Settings2,
  Download,
  Activity,
  DollarSign,
  RefreshCcw
} from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  PageHeader, 
  glassCardClass, 
  outlineButtonClass 
} from '../components/BoostFundrUI';
import { getToken, formatDate } from '../lib/utils';
import apiClient from '../services/apiClient';

// Analytics & Management Components
import PaymentStats from '../components/AdminDashboard/PaymentStats';
import PaymentsTable from '../components/AdminDashboard/PaymentsTable';
import SubscriptionSummary from '../components/AdminDashboard/SubscriptionSummary';
import RevenueMetrics from '../components/AdminDashboard/RevenueMetrics';
import ProductSales from '../components/AdminDashboard/ProductSales';

const Subscriptions = () => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportAudit = async () => {
    try {
      setIsExporting(true);
      const token = getToken();
      if (!token) throw new Error('Auth token missing');

      // Fetch all payments (high limit for audit)
      const response = await apiClient.request('/api/v1/payments/admin/payments?limit=1000', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const payments = response?.data?.items || response?.data?.payments || response?.data || [];
      
      if (payments.length === 0) {
        toast.error('No payment data found for export');
        return;
      }

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
      link.setAttribute('download', `financial_audit_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Exported ${payments.length} transaction records`);
    } catch (error) {
      toast.error(error.message || 'Audit export failed');
    } finally {
      setIsExporting(false);
    }
  };
  return (
    <div className="space-y-10 pb-12 animate-fade-in">
      <PageHeader
        eyebrow="Billing Intelligence"
        title="Revenue & Subscriptions"
        description="Monitor revenue streams, manage user tiers, and audit transaction history."
        action={
          <div className="flex items-center gap-3">
             <button 
                onClick={handleExportAudit}
                disabled={isExporting}
                className={`${outlineButtonClass} gap-2 disabled:opacity-50`}
              >
                {isExporting ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                {isExporting ? 'Preparing Audit...' : 'Export Audit'}
             </button>
          </div>
        }
      />

      <section className="animate-slide-up" style={{ animationDelay: '100ms' }}>
        <PaymentStats />
      </section>

      <section className="animate-slide-up" style={{ animationDelay: '200ms' }}>
        <RevenueMetrics />
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="animate-slide-up" style={{ animationDelay: '300ms' }}>
          <ProductSales />
        </section>
        <section className="animate-slide-up" style={{ animationDelay: '400ms' }}>
          <SubscriptionSummary />
        </section>
      </div>

      <section className="animate-slide-up" style={{ animationDelay: '500ms' }}>
        <PaymentsTable />
      </section>
    </div>
  );
};

export default Subscriptions;
