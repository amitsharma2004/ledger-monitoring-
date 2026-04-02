import api from './axios'
export const getSuspicious = () => api.get('/monitoring/suspicious')