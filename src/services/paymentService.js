import apiClient from './apiClient';

export const paymentService = {
  /**
   * Get payment dashboard statistics
   * @returns {Promise<Object>} The statistics data
   */
  getPaymentStats: async (token) => {
    try {
      const response = await apiClient.request('/api/v1/payments/admin/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Based on typical response structure in this project
      return response?.data || response;
    } catch (error) {
      console.error('Error fetching payment stats:', error);
      throw error;
    }
  },

  /**
   * Get all payments with filters and pagination
   * @param {string} token - Admin JWT token
   * @param {Object} filters - Filter criteria (page, limit, status, etc.)
   * @returns {Promise<Object>} The payments data and pagination info
   */
  getAllPayments: async (token, filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.status) params.append('status', filters.status);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.userId) params.append('userId', filters.userId);

      const response = await apiClient.request(`/api/v1/payments/admin/payments?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response?.data || response;
    } catch (error) {
      console.error('Error fetching all payments:', error);
      throw error;
    }
  },

  /**
   * Get user subscription summary analytics
   * @param {string} token - Admin JWT token
   * @returns {Promise<Object>} The subscription summary data
   */
  getSubscriptionSummary: async (token) => {
    try {
      const response = await apiClient.request('/api/v1/payments/admin/users/subscription-summary', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response?.data || response;
    } catch (error) {
      console.error('Error fetching subscription summary:', error);
      throw error;
    }
  },

  /**
   * Get revenue and financial metrics with date filtering
   * @param {string} token - Admin JWT token
   * @param {Object} filters - Date range filters (startDate, endDate)
   * @returns {Promise<Object>} The revenue metrics data
   */
  getRevenueMetrics: async (token, filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await apiClient.request(`/api/v1/payments/admin/revenue/metrics?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response?.data || response;
    } catch (error) {
      console.error('Error fetching revenue metrics:', error);
      throw error;
    }
  },

  /**
   * Get transaction history for a specific user
   * @param {string} token - Admin JWT token
   * @param {string} userId - Target user ID
   * @param {Object} filters - Pagination filters (page, limit)
   * @returns {Promise<Object>} The user profile and transaction history
   */
  getUserTransactions: async (token, userId, filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);

      const response = await apiClient.request(`/api/v1/payments/admin/user/${userId}?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response?.data || response;
    } catch (error) {
      console.error('Error fetching user transactions:', error);
      throw error;
    }
  },

  /**
   * Get specific payment details
   * @param {string} token - Admin JWT token
   * @param {string} paymentId - Target payment ID
   * @returns {Promise<Object>} The detailed payment information
   */
  getPaymentDetails: async (token, paymentId) => {
    try {
      const response = await apiClient.request(`/api/v1/payments/admin/payment/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response?.data || response;
    } catch (error) {
      console.error('Error fetching payment details:', error);
      throw error;
    }
  },

  /**
   * Get product/plan sales metrics
   * @param {string} token - Admin JWT token
   * @returns {Promise<Object>} The product sales metrics
   */
  getProductSales: async (token) => {
    try {
      const response = await apiClient.request('/api/v1/payments/admin/products/sales', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response?.data || response;
    } catch (error) {
      console.error('Error fetching product sales:', error);
      throw error;
    }
  },
};
