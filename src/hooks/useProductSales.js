import { useState, useEffect, useCallback } from 'react';
import { paymentService } from '../services/paymentService';
import { getToken } from '../lib/utils';
import toast from 'react-hot-toast';

/**
 * Custom hook to fetch and manage product/plan sales metrics.
 */
export const useProductSales = () => {
  const [productSales, setProductSales] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSales = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const data = await paymentService.getProductSales(token);
      setProductSales(data);
      if (productSales) {
        toast.success('Market data synchronized');
      }
    } catch (err) {
      const message = err.message || 'Failed to load product sales';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  return { productSales, loading, error, refresh: fetchSales };
};
