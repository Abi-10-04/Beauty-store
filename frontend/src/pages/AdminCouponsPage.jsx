import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axiosConfig'

export default function AdminCouponsPage() {
  const { isAdmin } = useAuth()
  const [coupons, setCoupons] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    discount_percentage: '',
    active: true,
    valid_from: '',
    valid_to: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAdmin) {
      fetchCoupons()
    }
  }, [isAdmin])

  const fetchCoupons = async () => {
    try {
      const response = await api.get('/offers/offers/')
      setCoupons(response.data.results || response.data)
    } catch (error) {
      console.error('Error fetching coupons:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = {
        ...formData,
        code: formData.code.toUpperCase(),
        discount_percentage: parseInt(formData.discount_percentage),
        valid_from: new Date(formData.valid_from).toISOString(),
        valid_to: new Date(formData.valid_to).toISOString()
      }

      if (editingCoupon) {
        await api.put(`/offers/offers/${editingCoupon.id}/`, data)
      } else {
        await api.post('/offers/offers/', data)
      }

      setShowModal(false)
      setEditingCoupon(null)
      resetForm()
      fetchCoupons()
      alert(editingCoupon ? 'Coupon updated successfully!' : 'Coupon created successfully!')
    } catch (error) {
      alert('Error saving coupon')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (couponId) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return

    try {
      await api.delete(`/offers/offers/${couponId}/`)
      fetchCoupons()
      alert('Coupon deleted successfully!')
    } catch (error) {
      alert('Error deleting coupon')
      console.error(error)
    }
  }

  const handleToggleActive = async (coupon) => {
    try {
      await api.patch(`/offers/offers/${coupon.id}/`, {
        active: !coupon.active
      })
      fetchCoupons()
    } catch (error) {
      alert('Error updating coupon status')
      console.error(error)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      code: '',
      discount_percentage: '',
      active: true,
      valid_from: '',
      valid_to: ''
    })
  }

  const openEditModal = (coupon) => {
    setEditingCoupon(coupon)
    setFormData({
      title: coupon.title,
      description: coupon.description || '',
      code: coupon.code,
      discount_percentage: coupon.discount_percentage.toString(),
      active: coupon.active,
      valid_from: new Date(coupon.valid_from).toISOString().slice(0, 16),
      valid_to: new Date(coupon.valid_to).toISOString().slice(0, 16)
    })
    setShowModal(true)
  }

  const openAddModal = () => {
    setEditingCoupon(null)
    resetForm()
    setShowModal(true)
  }

  if (!isAdmin) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">Access denied. Admin privileges required.</div>
      </div>
    )
  }

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Coupon Management</h1>
        <button className="btn custom-btn" onClick={openAddModal}>
          <i className="fas fa-plus me-2"></i>Add Coupon
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table">
                <tr>
                  <th>Code</th>
                  <th>Title</th>
                  <th>Discount</th>
                  <th>Status</th>
                  <th>Valid From</th>
                  <th>Valid To</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map(coupon => (
                  <tr key={coupon.id}>
                    <td><strong>{coupon.code}</strong></td>
                    <td>{coupon.title}</td>
                    <td>{coupon.discount_percentage}%</td>
                    <td>
                      <span className={`badge ${coupon.active ? 'custom-btn' : 'bg-dark'}`}>
                        {coupon.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>{new Date(coupon.valid_from).toLocaleDateString()}</td>
                    <td>{new Date(coupon.valid_to).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-dark me-2"
                        onClick={() => openEditModal(coupon)}
                      >
                        Edit
                      </button>
                      <button
                        className={`btn btn-sm me-2 ${coupon.active ? 'btn-outline-warning' : 'btn-outline-success'}`}
                        onClick={() => handleToggleActive(coupon)}
                      >
                        {coupon.active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(coupon.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {coupons.length === 0 && (
            <div className="text-center py-4">
              <p className="text-muted">No coupons found. Create your first coupon!</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Add/Edit Coupon */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description (Optional)</label>
                    <textarea
                      className="form-control"
                      id="description"
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="code" className="form-label">Coupon Code</label>
                    <input
                      type="text"
                      className="form-control text-uppercase"
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                      required
                      disabled={editingCoupon} // Don't allow code changes when editing
                    />
                    <div className="form-text">Code will be converted to uppercase</div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="discount_percentage" className="form-label">Discount Percentage</label>
                    <input
                      type="number"
                      className="form-control"
                      id="discount_percentage"
                      min="1"
                      max="100"
                      value={formData.discount_percentage}
                      onChange={(e) => setFormData({...formData, discount_percentage: e.target.value})}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="valid_from" className="form-label">Valid From</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      id="valid_from"
                      value={formData.valid_from}
                      onChange={(e) => setFormData({...formData, valid_from: e.target.value})}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="valid_to" className="form-label">Valid To</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      id="valid_to"
                      value={formData.valid_to}
                      onChange={(e) => setFormData({...formData, valid_to: e.target.value})}
                      required
                    />
                  </div>

                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="active"
                      checked={formData.active}
                      onChange={(e) => setFormData({...formData, active: e.target.checked})}
                    />
                    <label className="form-check-label" htmlFor="active">
                      Active
                    </label>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : (editingCoupon ? 'Update' : 'Create')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}