import { useEffect, useState, useCallback } from 'react'
import { getAuditLogs } from '../api/audit'
import '../styles/audit.css'

const ACTION_COLORS = { CREATE: '#10b981', UPDATE: '#3b82f6', DELETE: '#ef4444', COMPLIANCE_REVIEW: '#f59e0b' }

export default function AuditLogs() {
  const [logs, setLogs] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ action: '', from: '', to: '', page: 1, limit: 20 })
  const [expanded, setExpanded] = useState(null)

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''))
      const res = await getAuditLogs(params)
      setLogs(res.data.logs)
      setTotal(res.data.total)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { fetchLogs() }, [fetchLogs])

  const handleFilter = e => setFilters(f => ({ ...f, [e.target.name]: e.target.value, page: 1 }))
  const totalPages = Math.ceil(total / filters.limit)

  return (
    <div className="audit-page">
      <div className="page-header">
        <div>
          <h1>Audit Logs</h1>
          <span className="page-subtitle">Compliance-grade change trail — {total} entries</span>
        </div>
      </div>

      <div className="filters-bar">
        <select name="action" value={filters.action} onChange={handleFilter}>
          <option value="">All Actions</option>
          <option value="CREATE">Create</option>
          <option value="UPDATE">Update</option>
          <option value="DELETE">Delete</option>
          <option value="COMPLIANCE_REVIEW">Compliance Review</option>
        </select>
        <input type="date" name="from" value={filters.from} onChange={handleFilter} placeholder="From date" />
        <input type="date" name="to" value={filters.to} onChange={handleFilter} placeholder="To date" />
        <button className="btn btn-outline btn-sm" onClick={() => setFilters({ action: '', from: '', to: '', page: 1, limit: 20 })}>Clear</button>
      </div>

      <div className="chart-card">
        {loading ? <div className="loading-screen"><div className="spinner" /></div> : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr><th>Time</th><th>User</th><th>Action</th><th>Resource</th><th>Resource ID</th><th>Details</th></tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr><td colSpan={6} className="empty-state">No audit logs found</td></tr>
                ) : logs.map(log => (
                  <>
                    <tr key={log.id} className="audit-row" onClick={() => setExpanded(expanded === log.id ? null : log.id)} style={{ cursor: 'pointer' }}>
                      <td className="audit-time">{new Date(log.created_at).toLocaleString()}</td>
                      <td>{log.user_email || '—'}</td>
                      <td><span className="action-badge" style={{ backgroundColor: ACTION_COLORS[log.action] || '#6b7280' }}>{log.action}</span></td>
                      <td>{log.resource_type}</td>
                      <td className="resource-id">{log.resource_id?.substring(0, 8)}…</td>
                      <td><span className="expand-hint">{expanded === log.id ? '▲ Hide' : '▼ Show'}</span></td>
                    </tr>
                    {expanded === log.id && (
                      <tr key={`${log.id}-detail`} className="audit-detail-row">
                        <td colSpan={6}>
                          <div className="audit-detail">
                            {log.before_value && (
                              <div className="diff-block before">
                                <strong>Before:</strong>
                                <pre>{JSON.stringify(log.before_value, null, 2)}</pre>
                              </div>
                            )}
                            {log.after_value && (
                              <div className="diff-block after">
                                <strong>After:</strong>
                                <pre>{JSON.stringify(log.after_value, null, 2)}</pre>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button className="btn btn-outline btn-sm" disabled={filters.page <= 1} onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}>← Prev</button>
          <span>Page {filters.page} of {totalPages}</span>
          <button className="btn btn-outline btn-sm" disabled={filters.page >= totalPages} onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}>Next →</button>
        </div>
      )}
    </div>
  )
}