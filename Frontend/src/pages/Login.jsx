import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { login } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import { LogoIcon } from '../components/Icons'
import '../styles/auth.css'

export default function Login() {
  const navigate = useNavigate()
  const { login: authLogin } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await login(form)
      authLogin(res.data.token, res.data.user)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (email) => setForm({ email, password: 'password123' })

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <LogoIcon size={48} color="#3b82f6" />
          <h1>FinFlow</h1>
          <p>Financial Management Dashboard</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Create one</Link></p>
        </div>
        <div className="demo-accounts">
          <p>Demo accounts:</p>
          <div className="demo-btns">
            <button onClick={() => fillDemo('admin@test.com')} className="demo-btn admin">Admin</button>
            <button onClick={() => fillDemo('analyst@test.com')} className="demo-btn analyst">Analyst</button>
            <button onClick={() => fillDemo('viewer@test.com')} className="demo-btn viewer">Viewer</button>
          </div>
        </div>
      </div>
    </div>
  )
}