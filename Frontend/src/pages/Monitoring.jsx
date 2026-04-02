import { useEffect, useState } from 'react'
import { getSuspicious } from '../api/monitoring'
import { MonitoringIcon } from '../components/Icons'
import '../styles/monitoring.css'

const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

export default function Monitoring() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('large')

  useEffect(() => {
    getSuspicious()
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>

  const tabs = [
    { key: 'large', label: 'Large Transactions', count: data?.summary?.large_transactions },
    { key: 'duplicates', label: 'Duplicates', count: data?.summary?.duplicates },
    { key: 'spikes', label: 'Category Spikes', count: data?.summary?.category_spikes },
  ]

  return (
    <div className="monitoring-page">
      <div className="page-header">
        <div>
          <h1>Transaction Monitoring</h1>
          <span className="page-subtitle">Compliance-grade anomaly detection</span>
        </div>
      </div>

      {/* Summary cards */}
      <div className="monitoring-summary">
        <div className="alert-card total">
          <MonitoringIcon size={28} color="#ef4444" />
          <div>
            <div className="alert-count">{data?.summary?.total_alerts || 0}</div>
            <div className="alert-label">Total Alerts</div>
          </div>
        </div>
        {tabs.map(t => (
          <div key={t.key} className={`alert-card ${t.count > 0 ? 'has-alerts' : ''}`} onClick={() => setTab(t.key)} style={{ cursor: 'pointer' }}>
            <div className="alert-count">{t.count || 0}</div>
            <div className="alert-label">{t.label}</div>
          </div>
        ))}
      </div>

      {/* Tab navigation */}
      <div className="tab-bar">
        {tabs.map(t => (
          <button key={t.key} className={`tab-btn ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
            {t.label} {t.count > 0 && <span className="tab-badge">{t.count}</span>}
          </button>
        ))}
      </div>

      {/* Large transactions */}
      {tab === 'large' && (
        <div className="chart-card">
          <h3>Unusually Large Transactions</h3>
          {data?.large_transactions?.length === 0 ? (
            <p className="empty-state">No unusually large transactions detected.</p>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead><tr><th>Date</th><th>Category</th><th>Type</th><th>Amount</th><th>Compliance</th><th>Reason</th></tr></thead>
                <tbody>
                  {data?.large_transactions?.map(r => (
                    <tr key={r.id}>
                      <td>{r.date}</td>
                      <td><span className="category-tag">{r.category}</span></td>
                      <td><span className={`type-badge ${r.type}`}>{r.type}</span></td>
                      <td className="amount expense">{fmt(r.amount)}</td>
                      <td><span className={`compliance-badge ${r.compliance_status}`}>{r.compliance_status}</span></td>
                      <td className="reason-cell">{r.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Duplicates */}
      {tab === 'duplicates' && (
        <div className="chart-card">
          <h3>Duplicate Transactions (within 24h)</h3>
          {data?.duplicates?.length === 0 ? (
            <p className="empty-state">No duplicate transactions detected.</p>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead><tr><th>Date</th><th>Category</th><th>Type</th><th>Amount</th><th>Compliance</th><th>Reason</th></tr></thead>
                <tbody>
                  {data?.duplicates?.map(r => (
                    <tr key={r.id}>
                      <td>{r.date}</td>
                      <td><span className="category-tag">{r.category}</span></td>
                      <td><span className={`type-badge ${r.type}`}>{r.type}</span></td>
                      <td className="amount expense">{fmt(r.amount)}</td>
                      <td><span className={`compliance-badge ${r.compliance_status}`}>{r.compliance_status}</span></td>
                      <td className="reason-cell">{r.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Category spikes */}
      {tab === 'spikes' && (
        <div className="chart-card">
          <h3>Category Spending Spikes (&gt;200% vs last month)</h3>
          {data?.category_spikes?.length === 0 ? (
            <p className="empty-state">No category spikes detected.</p>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead><tr><th>Category</th><th>Last Month</th><th>This Month</th><th>Change</th><th>Reason</th></tr></thead>
                <tbody>
                  {data?.category_spikes?.map(s => (
                    <tr key={s.category}>
                      <td><span className="category-tag">{s.category}</span></td>
                      <td>{fmt(s.last_month)}</td>
                      <td className="amount expense">{fmt(s.this_month)}</td>
                      <td><span className="spike-badge">+{s.change_percent}%</span></td>
                      <td className="reason-cell">{s.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}