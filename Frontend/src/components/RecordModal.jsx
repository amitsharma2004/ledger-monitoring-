import { useState } from 'react'
import toast from 'react-hot-toast'
import { createRecord, updateRecord } from '../api/records'
import { CloseIcon } from './Icons'

const CATEGORIES = ['Salary', 'Freelance', 'Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Rent', 'Other']

export default function RecordModal({ record, onClose, onSaved }) {
  const isEdit = !!record?.id
  const [form, setForm] = useState({
    amount: record?.amount || '',
    type: record?.type || 'income',
    category: record?.category || 'Salary',
    date: record?.date || new Date().toISOString().split('T')[0],
    notes: record?.notes || ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = { ...form, amount: Number(form.amount) }
      if (isEdit) await updateRecord(record.id, payload)
      else await createRecord(payload)
      toast.success(isEdit ? 'Record updated!' : 'Record created!')
      onSaved()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save record')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEdit ? 'Edit Record' : 'New Record'}</h3>
          <button className="modal-close" onClick={onClose}><CloseIcon size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-row">
            <div className="form-group">
              <label>Amount</label>
              <input type="number" name="amount" value={form.amount} onChange={handleChange} placeholder="0.00" step="0.01" min="0" required />
            </div>
            <div className="form-group">
              <label>Type</label>
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Date</label>
              <input type="date" name="date" value={form.date} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Optional notes..." rows={3} />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}