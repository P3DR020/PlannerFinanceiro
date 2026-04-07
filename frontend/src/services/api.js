import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ledger-auth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// ─── Dashboard ───────────────────────────────────────────────────────────────
export const getDashboardSummary = () => api.get('/dashboard/summary').then(r => r.data.data);
export const getCashflow = (months = 6) => api.get(`/dashboard/cashflow?months=${months}`).then(r => r.data.data);

// ─── Transactions ─────────────────────────────────────────────────────────────
export const getTransactions = (params = {}) => api.get('/transactions', { params }).then(r => r.data);
export const createTransaction = (data) => api.post('/transactions', data).then(r => r.data.data);
export const updateTransaction = (id, data) => api.patch(`/transactions/${id}`, data).then(r => r.data.data);
export const deleteTransaction = (id) => api.delete(`/transactions/${id}`).then(r => r.data);

// ─── Budgets ──────────────────────────────────────────────────────────────────
export const getBudget = (params = {}) => api.get('/budgets', { params }).then(r => r.data.data);
export const createBudget = (data) => api.post('/budgets', data).then(r => r.data.data);
export const updateBudget = (id, data) => api.patch(`/budgets/${id}`, data).then(r => r.data.data);

// ─── Savings ──────────────────────────────────────────────────────────────────
export const getSavingsGoals = () => api.get('/savings').then(r => r.data.data);
export const createGoal = (data) => api.post('/savings', data).then(r => r.data.data);
export const addContribution = (id, data) => api.post(`/savings/${id}/contribute`, data).then(r => r.data.data);
export const updateGoal = (id, data) => api.patch(`/savings/${id}`, data).then(r => r.data.data);
export const deleteGoal = (id) => api.delete(`/savings/${id}`).then(r => r.data);

// ─── Reports ──────────────────────────────────────────────────────────────────
export const getTrendAnalysis = (months = 12) => api.get(`/reports/trend-analysis?months=${months}`).then(r => r.data.data);
export const getCategoryDistribution = (params = {}) => api.get('/reports/category-distribution', { params }).then(r => r.data.data);
export const getSpendingPatterns = () => api.get('/reports/spending-patterns').then(r => r.data.data);
export const getPeriodComparison = () => api.get('/reports/period-comparison').then(r => r.data.data);