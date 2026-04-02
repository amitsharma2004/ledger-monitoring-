import { useEffect, useState } from 'react'
import { getUsers, updateUserRole, updateUserStatus } from '../api/users'
import toast from 'react-hot-toast'
import '../styles/users.css'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    try {
      const res = await getUsers()
      setUsers(res.data.users)
    } catch {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const handleRoleChange = async (id, role) => {
    try {
      await updateUserRole(id, role)
      toast.success('Role updated')
      fetchUsers()
    } catch {
      toast.error('Failed to update role')
    }
  }

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    try {
      await updateUserStatus(id, newStatus)
      toast.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'}`)
      fetchUsers()
    } catch {
      toast.error('Failed to update status')
    }
  }

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>

  return (
    <div className="users-page">
      <div className="page-header">
        <div>
          <h1>User Management</h1>
          <span className="page-subtitle">{users.length} users</span>
        </div>
      </div>
      <div className="chart-card">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td className="user-name">{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <select className="role-select" value={u.role} onChange={e => handleRoleChange(u.id, e.target.value)}>
                      <option value="admin">Admin</option>
                      <option value="analyst">Analyst</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </td>
                  <td><span className={`status-badge ${u.status}`}>{u.status}</span></td>
                  <td>{new Date(u.created_at).toLocaleDateString()}</td>
                  <td>
                    <button
                      className={`btn btn-sm ${u.status === 'active' ? 'btn-danger' : 'btn-success'}`}
                      onClick={() => handleStatusToggle(u.id, u.status)}
                    >
                      {u.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}