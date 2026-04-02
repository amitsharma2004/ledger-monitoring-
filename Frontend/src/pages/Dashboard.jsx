import { useEffect, useState } from 'react'
import { getSummary, getByCategory, getTrends, getRecent, getForecast } from '../api/dashboard'
import StatCard from '../components/StatCard'
import { TrendingUpIcon, TrendingDownIcon, WalletIcon, ForecastIcon } from '../components/Icons'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import '../styles/dashboard.css'

const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [byCategory, setByCategory] = useState([])
  const [trends, setTrends] = useState([])
  const [recent, setRecent] = useState([])
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [s, c, t, r, f] = await Promise.all([getSummary(), getByCategory(), getTrends(), getRecent(), getForecast().catch(() => null)])
        setSummary(s.data)
        setByCategory(c.data)
        setTrends(t.data)
        setRecent(r.data)
        if (f) setForecast(f.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
        <span className="page-subtitle">Financial overview</span>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        <StatCard title="Total Income" value={fmt(summary?.total_income || 0)} icon={TrendingUpIcon} color="#10b981" />
        <StatCard title="Total Expenses" value={fmt(summary?.total_expenses || 0)} icon={TrendingDownIcon} color="#ef4444" />
        <StatCard title="Net Balance" value={fmt(summary?.net_balance || 0)} icon={WalletIcon} color={summary?.net_balance >= 0 ? '#3b82f6' : '#ef4444'} />
      </div>

      {/* Charts Row */}
      <div className="charts-grid">
        {/* Monthly Trends */}
        <div className="chart-card">
          <h3>Monthly Trends</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => fmt(v)} />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name="Income" />
              <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} name="Expense" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* By Category */}
        <div className="chart-card">
          <h3>By Category</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={byCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="category" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => fmt(v)} />
              <Legend />
              <Bar dataKey="income" fill="#10b981" name="Income" radius={[4,4,0,0]} />
              <Bar dataKey="expense" fill="#ef4444" name="Expense" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Forecast Widget */}
      {forecast && (
        <div className="chart-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <ForecastIcon size={20} color="#3b82f6" />
            <h3 style={{ margin: 0 }}>Forecast — {forecast.forecast_month}</h3>
            <span style={{ fontSize: '0.8rem', color: '#64748b', marginLeft: 'auto' }}>Based on {forecast.based_on_months?.join(', ')}</span>
          </div>
          <div className="forecast-grid">
            {forecast.categories?.slice(0, 6).map(f => (
              <div key={f.category} className="forecast-card">
                <div className="forecast-category">{f.category}</div>
                <div className="forecast-amount">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(f.projected_next_month)}</div>
                <div className={`forecast-trend ${f.trend}`}>{f.trend === 'increasing' ? '↑' : f.trend === 'decreasing' ? '↓' : '→'} {f.trend}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, fontSize: '0.875rem', color: '#64748b' }}>
            Total projected spend: <strong>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(forecast.total_projected)}</strong>
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="chart-card">
        <h3>Recent Transactions</h3>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Notes</th>
                <th>Type</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {recent.map(r => (
                <tr key={r.id}>
                  <td>{r.date}</td>
                  <td><span className="category-tag">{r.category}</span></td>
                  <td className="notes-cell">{r.notes || '—'}</td>
                  <td><span className={`type-badge ${r.type}`}>{r.type}</span></td>
                  <td className={`amount ${r.type}`}>{r.type === 'income' ? '+' : '-'}{fmt(r.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}