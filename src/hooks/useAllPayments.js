import { useState, useEffect, useCallback } from 'react';
import { paymentService } from '../services/paymentService';
import { getToken } from '../lib/utils';
import toast from 'react-hot-toast';

/**
 * Custom hook to fetch and manage the full list of payments with filtering and pagination.
 */
export const useAllPayments = (initialFilters = { page: 1, limit: 10 }) => {
  const [payments, setPayments] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchPayments = useCallback(async (currentFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const data = await paymentService.getAllPayments(token, currentFilters);
      
      // Handle the nested structure from the API spec
      setPayments(data?.data || []);
      setPagination(data?.pagination || null);
    } catch (err) {
      const message = err.message || 'Failed to load payments';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch when filters change
  useEffect(() => {
    fetchPayments(filters);
  }, [filters, fetchPayments]);

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handlePageChange = (newPage) => {
    updateFilters({ page: newPage });
  };

  const handleStatusChange = (newStatus) => {
    updateFilters({ status: newStatus, page: 1 }); // Reset to page 1 on filter change
  };

  return { 
    payments, 
    pagination, 
    loading, 
    error, 
    filters,
    updateFilters,
    handlePageChange,
    handleStatusChange,
    refresh: () => fetchPayments(filters)
  };
};
