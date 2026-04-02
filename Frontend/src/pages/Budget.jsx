import { useEffect, useState } from 'react'
import { getBudgetVsActual, setBudget } from '../api/budget'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import '../styles/budget.css'

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
const CATEGORIES = ['Salary', 'Freelance', 'Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Rent', 'Other']

const STATUS_CONFIG = {
  over_budget: { label: 'Over Budget', color: '#ef4444', bg: '#fef2f2' },
  near_limit:  { label: 'Near Limit',  color: '#f59e0b', bg: '#fffbeb' },
  on_track:    { label: 'On Track',    color: '#10b981', bg: '#ecfdf5' },
  unbudgeted:  { label: 'Unbudgeted',  color: '#6b7280', bg: '#f9fafb' },
}

export default function Budget() {
  const { isAdmin } = useAuth()
  const [report, setReport]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [month, setMonth]     = useState(new Date().toISOString().substring(0, 7))
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]       = useState({ category: 'Food', month: new Date().toISOString().substring(0, 7), amount: '' })
  const [saving, setSaving]   = useState(false)

  const fetchReport = async (m) => {
    setLoading(true)
    try {
      const res = await getBudgetVsActual(m)
      setReport(res.data)
    } catch {
      toast.error('Failed to load budget data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchReport(month) }, [month])

  const handleSetBudget = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await setBudget({ category: form.category, month: form.month, amount: Number(form.amount) })
      toast.success(`Budget set for ${form.category}!`)
      setShowForm(false)
      setForm({ category: 'Food', amount: '' })
      fetchReport(month)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save budget')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>

  return (
    <div className="budget-page">
      <div className="page-header">
        <div>
          <h1>Budget vs Actual</h1>
          <span className="page-subtitle">{month} — {fmt(report?.total_budgeted || 0)} budgeted</span>
        </div>
        <div className="budget-header-actions">
          <input type="month" value={month} onChange={e => setMonth(e.target.value)} className="month-picker" />
          {isAdmin && (
            <button className="btn btn-primary" onClick={() => setShowForm(v => !v)}>
              {showForm ? 'Cancel' : '+ Set Budget'}
            </button>
          )}
        </div>
      </div>

      {/* Set budget form — admin only */}
      {showForm && isAdmin && (
        <div className="chart-card budget-form-card">
          <h3>Set Budget per Category</h3>
          <form onSubmit={handleSetBudget} className="budget-form">
            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Month</label>
                <input type="month" value={form.month} onChange={e => setForm(f => ({ ...f, month: e.target.value }))} required />
              </div>
              <div className="form-group">
                <label>Budget Amount (₹)</label>
                <input
                  type="number"
                  value={form.amount}
                  onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                  placeholder="e.g. 5000"
                  min="1"
                  required
                />
              </div>
              <div className="form-group form-actions">
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Budget'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Summary cards */}
      <div className="budget-summary">
        <div className="budget-stat-card">
          <div className="budget-stat-label">Total Budgeted</div>
          <div className="budget-stat-value blue">{fmt(report?.total_budgeted || 0)}</div>
        </div>
        <div className="budget-stat-card">
          <div className="budget-stat-label">Total Actual Spend</div>
          <div className="budget-stat-value" style={{ color: (report?.total_actual || 0) > (report?.total_budgeted || 1) ? '#ef4444' : '#10b981' }}>
            {fmt(report?.total_actual || 0)}
          </div>
        </div>
        <div className="budget-stat-card">
          <div className="budget-stat-label">Variance</div>
          <div className="budget-stat-value" style={{ color: ((report?.total_actual || 0) - (report?.total_budgeted || 0)) > 0 ? '#ef4444' : '#10b981' }}>
            {((report?.total_actual || 0) - (report?.total_budgeted || 0)) > 0 ? '+' : ''}
            {fmt((report?.total_actual || 0) - (report?.total_budgeted || 0))}
          </div>
        </div>
      </div>

      {/* Per-category breakdown */}
      <div className="chart-card">
        <h3>Category Breakdown</h3>
        {!report?.categories?.length ? (
          <p className="empty-state">
            No spending data for {month}.{isAdmin ? ' Set budgets above to start tracking.' : ''}
          </p>
        ) : (
          <div className="budget-categories">
            {report.categories.map(cat => {
              const cfg = STATUS_CONFIG[cat.status] || STATUS_CONFIG.on_track
              const barWidth = cat.budgeted > 0 ? Math.min((cat.actual / cat.budgeted) * 100, 100) : 100
              return (
                <div key={cat.category} className="budget-row" style={{ borderLeftColor: cfg.color }}>
                  <div className="budget-row-header">
                    <span className="budget-category">{cat.category}</span>
                    <span className="budget-status-badge" style={{ color: cfg.color, backgroundColor: cfg.bg }}>
                      {cfg.label}
                    </span>
                  </div>
                  {cat.budgeted > 0 && (
                    <div className="budget-bar-track">
                      <div className="budget-bar-fill" style={{ width: `${barWidth}%`, backgroundColor: cfg.color }} />
                    </div>
                  )}
                  <div className="budget-row-numbers">
                    <span>Actual: <strong>{fmt(cat.actual)}</strong></span>
                    {cat.budgeted > 0 && <span>Budget: {fmt(cat.budgeted)}</span>}
                    {cat.budgeted > 0 && <span>Used: {cat.percent_used}%</span>}
                    {cat.budgeted > 0 && (
                      <span style={{ color: cat.variance > 0 ? '#ef4444' : '#10b981' }}>
                        Variance: {cat.variance > 0 ? '+' : ''}{fmt(cat.variance)}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}