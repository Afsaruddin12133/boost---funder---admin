import { useState, useEffect, useCallback } from 'react';
import { paymentService } from '../services/paymentService';
import { getToken } from '../lib/utils';
import toast from 'react-hot-toast';

/**
 * Custom hook to fetch and manage revenue and financial metrics.
 */
export const useRevenueMetrics = (initialFilters = {}) => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMetrics = useCallback(async (currentFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const data = await paymentService.getRevenueMetrics(token, currentFilters);
      setMetrics(data);
    } catch (err) {
      const message = err.message || 'Failed to load revenue metrics';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics(initialFilters);
  }, [fetchMetrics]);

  return { metrics, loading, error, refresh: fetchMetrics };
};
