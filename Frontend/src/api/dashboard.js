import api from './axios'

export const getSummary = () => api.get('/dashboard/summary')
export const getByCategory = () => api.get('/dashboard/by-category')
export const getTrends = () => api.get('/dashboard/trends')
export const getRecent = () => api.get('/dashboard/recent')
export const getForecast = () => api.get('/dashboard/forecast')