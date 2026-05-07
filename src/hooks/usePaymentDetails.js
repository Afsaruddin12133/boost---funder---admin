import { useState, useCallback } from 'react';
import { paymentService } from '../services/paymentService';
import { getToken } from '../lib/utils';
import toast from 'react-hot-toast';

/**
 * Custom hook to fetch and manage the details of a specific payment transaction.
 */
export const usePaymentDetails = () => {
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPaymentDetails = useCallback(async (paymentId) => {
    if (!paymentId) return;

    try {
      setLoading(true);
      setError(null);
      
      const token = getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const data = await paymentService.getPaymentDetails(token, paymentId);
      setPayment(data);
    } catch (err) {
      const message = err.message || 'Failed to load payment details';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { 
    payment, 
    loading, 
    error, 
    fetchPaymentDetails 
  };
};
