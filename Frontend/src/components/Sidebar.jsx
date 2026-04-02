import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogoIcon, DashboardIcon, RecordsIcon, UsersIcon, MonitoringIcon, AuditIcon, BudgetIcon } from './Icons'

export default function Sidebar() {
  const { isAdmin, user } = useAuth()
  const isAnalystOrAdmin = isAdmin || user?.role === 'analyst'

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <LogoIcon size={28} color="#3b82f6" />
        <span className="logo-text">FinFlow</span>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <DashboardIcon size={20} className="nav-icon" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/records" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <RecordsIcon size={20} className="nav-icon" />
          <span>Records</span>
        </NavLink>
        {isAnalystOrAdmin && (
          <NavLink to="/monitoring" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <MonitoringIcon size={20} className="nav-icon" />
            <span>Monitoring</span>
          </NavLink>
        )}
        <NavLink to="/budget" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <BudgetIcon size={20} className="nav-icon" />
          <span>Budget</span>
        </NavLink>
        {isAdmin && (
          <NavLink to="/audit" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <AuditIcon size={20} className="nav-icon" />
            <span>Audit Logs</span>
          </NavLink>
        )}
        {isAdmin && (
          <NavLink to="/users" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <UsersIcon size={20} className="nav-icon" />
            <span>Users</span>
          </NavLink>
        )}
      </nav>
    </aside>
  )
}