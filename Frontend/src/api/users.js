import api from './axios'

export const getUsers = () => api.get('/users')
export const updateUserRole = (id, role) => api.patch(`/users/${id}/role`, { role })
export const updateUserStatus = (id, status) => api.patch(`/users/${id}/status`, { status })