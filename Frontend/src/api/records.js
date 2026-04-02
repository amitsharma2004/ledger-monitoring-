import api from './axios'

export const getRecords = (params) => api.get('/records', { params })
export const createRecord = (data) => api.post('/records', data)
export const updateRecord = (id, data) => api.patch(`/records/${id}`, data)
export const deleteRecord = (id) => api.delete(`/records/${id}`)
export const updateCompliance = (id, compliance_status) => api.patch(`/records/${id}/compliance`, { compliance_status })