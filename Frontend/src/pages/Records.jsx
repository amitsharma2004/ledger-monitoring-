import { useEffect, useState, useCallback } from 'react'
import { getRecords, deleteRecord, updateCompliance } from '../api/records'
import { useAuth } from '../context/AuthContext'
import RecordModal from '../components/RecordModal'
import ConfirmModal from '../components/ConfirmModal'
import { PlusIcon, ArrowLeftIcon, ArrowRightIcon, ComplianceIcon } from '../components/Icons'
import toast from 'react-hot-toast'
import '../styles/records.css'

const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)

export default function Records() {
  const { isAdmin, user } = useAuth()
  const isAnalystOrAdmin = isAdmin || user?.role === 'analyst'
  const [records, setRecords] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ type: '', category: '', compliance_status: '', from: '', to: '', page: 1, limit: 10 })
  const [showModal, setShowModal] = useState(false)
  const [editRecord, setEditRecord] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchRecords = useCallback(async () => {
    setLoading(true)
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''))
      const res = await getRecords(params)
      setRecords(res.data.records)
      setTotal(res.data.total)
    } catch (err) {
      toast.error('Failed to load records')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { fetchRecords() }, [fetchRecords])

  const handleFilter = (e) => setFilters(f => ({ ...f, [e.target.name]: e.target.value, page: 1 }))

  const handleComplianceChange = async (id, status) => {
    try {
      await updateCompliance(id, status)
      toast.success('Compliance status updated')
      fetchRecords()
    } catch (err) {
      toast.error('Failed to update compliance status')
    }
  }

  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      await deleteRecord(deleteTarget)
      toast.success('Record deleted')
      setDeleteTarget(null)
      fetchRecords()
    } catch (err) {
      toast.error('Failed to delete record')
    } finally {
      setDeleteLoading(false)
    }
  }

  const totalPages = Math.ceil(total / filters.limit)

  return (
    <div className="records-page">
      <div className="page-header">
        <div>
          <h1>Financial Records</h1>
          <span className="page-subtitle">{total} records found</span>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => { setEditRecord(null); setShowModal(true) }}>
            <PlusIcon size={15} /> New Record
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <select name="type" value={filters.type} onChange={handleFilter}>
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input type="text" name="category" value={filters.category} onChange={handleFilter} placeholder="Filter by category..." />
        <select name="compliance_status" value={filters.compliance_status} onChange={handleFilter}>
          <option value="">All Compliance</option>
          <option value="clean">Clean</option>
          <option value="flagged">Flagged</option>
          <option value="under_review">Under Review</option>
        </select>
        <input type="date" name="from" value={filters.from} onChange={handleFilter} />
        <input type="date" name="to" value={filters.to} onChange={handleFilter} />
        <button className="btn btn-outline btn-sm" onClick={() => setFilters({ type: '', category: '', compliance_status: '', from: '', to: '', page: 1, limit: 10 })}>Clear</button>
      </div>

      {/* Table */}
      <div className="chart-card">
        {loading ? (
          <div className="loading-screen"><div className="spinner" /></div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Compliance</th>
                  <th>Amount</th>
                  <th>Notes</th>
                  {isAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {records.length === 0 ? (
                  <tr><td colSpan={isAdmin ? 7 : 6} className="empty-state">No records found</td></tr>
                ) : records.map(r => (
                  <tr key={r.id}>
                    <td>{r.date}</td>
                    <td><span className="category-tag">{r.category}</span></td>
                    <td><span className={`type-badge ${r.type}`}>{r.type}</span></td>
                    <td>
                      {isAnalystOrAdmin ? (
                        <select
                          className="role-select"
                          value={r.compliance_status || 'clean'}
                          onChange={e => handleComplianceChange(r.id, e.target.value)}
                        >
                          <option value="clean">clean</option>
                          <option value="flagged">flagged</option>
                          <option value="under_review">under review</option>
                        </select>
                      ) : (
                        <span className={`compliance-badge ${r.compliance_status}`}>{r.compliance_status?.replace('_', ' ') || 'clean'}</span>
                      )}
                    </td>
                    <td className={`amount ${r.type}`}>{r.type === 'income' ? '+' : '-'}{fmt(r.amount)}</td>
                    <td className="notes-cell">{r.notes || '—'}</td>
                    {isAdmin && (
                      <td className="actions">
                        <button className="btn btn-outline btn-xs" onClick={() => { setEditRecord(r); setShowModal(true) }}>Edit</button>
                        <button className="btn btn-danger btn-xs" onClick={() => setDeleteTarget(r.id)}>Delete</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button className="btn btn-outline btn-sm" disabled={filters.page <= 1} onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}><ArrowLeftIcon size={14} /> Prev</button>
          <span>Page {filters.page} of {totalPages}</span>
          <button className="btn btn-outline btn-sm" disabled={filters.page >= totalPages} onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}>Next <ArrowRightIcon size={14} /></button>
        </div>
      )}

      {showModal && <RecordModal record={editRecord} onClose={() => setShowModal(false)} onSaved={() => { setShowModal(false); fetchRecords() }} />}
      {deleteTarget && <ConfirmModal message="Are you sure you want to delete this record? This action cannot be undone." onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleteLoading} />}
    </div>
  )
}