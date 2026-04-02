import api from './axios'
export const getBudgets = (month) => api.get('/budgets', { params: month ? { month } : {} })
export const setBudget = (data) => api.post('/budgets', data)
export const getBudgetVsActual = (month) => api.get('/budgets/vs-actual', { params: month ? { month } : {} })