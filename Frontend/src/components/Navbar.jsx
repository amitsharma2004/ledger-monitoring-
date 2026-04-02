import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { LogoutIcon } from './Icons'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const roleColors = { admin: '#ef4444', analyst: '#f59e0b', viewer: '#10b981' }

  return (
    <header className="navbar">
      <div className="navbar-left">
        <h2 className="page-title">Welcome back, {user?.name?.split(' ')[0]} 👋</h2>
      </div>
      <div className="navbar-right">
        <span className="role-badge" style={{ backgroundColor: roleColors[user?.role] || '#6b7280' }}>
          {user?.role}
        </span>
        <span className="user-email">{user?.email}</span>
        <button className="btn btn-outline btn-sm logout-btn" onClick={handleLogout}>
          <LogoutIcon size={15} />
          Logout
        </button>
      </div>
    </header>
  )
}