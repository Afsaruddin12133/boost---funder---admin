import { useState, useCallback } from 'react';
import { paymentService } from '../services/paymentService';
import { getToken } from '../lib/utils';
import toast from 'react-hot-toast';

/**
 * Custom hook to fetch and manage a specific user's transaction history.
 */
export const useUserTransactions = (userId) => {
  const [userInfo, setUserInfo] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTransactions = useCallback(async (filters = { page: 1, limit: 10 }) => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      
      const token = getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      const data = await paymentService.getUserTransactions(token, userId, filters);
      
      setUserInfo(data.user);
      setTransactions(data.transactions || []);
      setPagination(data.pagination || null);
    } catch (err) {
      const message = err.message || 'Failed to load user transactions';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return { 
    userInfo, 
    transactions, 
    pagination, 
    loading, 
    error, 
    fetchTransactions 
  };
};
