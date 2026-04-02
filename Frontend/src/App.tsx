import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Records from './pages/Records'
import Users from './pages/Users'
import Monitoring from './pages/Monitoring'
import AuditLogs from './pages/AuditLogs'
import Budget from './pages/Budget'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="records" element={<Records />} />
          <Route path="users" element={<ProtectedRoute adminOnly><Users /></ProtectedRoute>} />
          <Route path="monitoring" element={<ProtectedRoute><Monitoring /></ProtectedRoute>} />
          <Route path="audit" element={<ProtectedRoute adminOnly><AuditLogs /></ProtectedRoute>} />
          <Route path="budget" element={<Budget />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  )
}