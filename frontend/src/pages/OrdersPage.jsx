import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axiosConfig'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const { isAuthenticated, isAdmin } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders()
    }
  }, [isAuthenticated])

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/orders/my_orders/')
      setOrders(response.data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await api.get(`/orders/orders/${orderId}/`)
      setSelectedOrder(response.data)
      setShowModal(true)
    } catch (error) {
      console.error('Error fetching order details:', error)
    }
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedOrder(null)
  }

  const getStatusBadge = (status) => {
    const badgeClass = {
      pending: 'border border-warning text-warning',
      confirmed: 'border border-info text-info',
      shipped: 'border border-primary text-primary',
      delivered: 'border border-success text-success',
      cancelled: 'border border-danger text-danger'
    };

    return badgeClass[status] || 'border border-secondary text-secondary';
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <div className="spinner-border text-primary"></div>
      </div>
    )
  }

  return (
    <div className="container my-5">
      <h1 className="mb-4">{isAdmin ? 'All Users Orders' : 'My Orders'}</h1>

      {orders && orders.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>Order ID</th>
                {isAdmin && <th>User</th>}
                {isAdmin && <th>Email</th>}
                <th>Date</th>
                <th>Status</th>
                <th>Total Amount</th>
                <th>Items</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td><strong>#{order.id}</strong></td>
                  {isAdmin && <td>{order.user?.username}</td>}
                  {isAdmin && <td>{order.user?.email}</td>}
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge px-3 py-2 rounded-pill ${getStatusBadge(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td>₹{Number(order.total_price).toFixed(2)}</td>
                  <td>{order.items.length} items</td>
                  <td>
                    <button
                      className="btn btn-sm custom-btn"
                      onClick={() => fetchOrderDetails(order.id)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="alert alert-info text-center">
          <p>{isAdmin ? 'No orders found for any users yet.' : "You haven't placed any orders yet"}</p>
          <a href="/categories" className="btn btn-primary">Start Shopping</a>
        </div>
      )}

      {showModal && selectedOrder && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={closeModal}>
          <div className="modal-dialog modal-lg modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Order Details</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3"><strong>Order ID:</strong> #{selectedOrder.id}</div>
                {isAdmin && selectedOrder.user && (
                  <div className="mb-3">
                    <p><strong>User:</strong> {selectedOrder.user.username}</p>
                    <p><strong>Email:</strong> {selectedOrder.user.email}</p>
                  </div>
                )}
                <div className="row mb-3">
                  <div className="col-md-6"><strong>Status:</strong> {selectedOrder.status}</div>
                  <div className="col-md-6"><strong>Date:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</div>
                </div>
                <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map(item => (
                        <tr key={item.id}>
                          <td>
                            {item.product.image ? (
                              <img src={item.product.image} alt={item.product.name} style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
                            ) : '—'}
                          </td>
                          <td>{item.product.name}</td>
                          <td>{item.quantity}</td>
                          <td>₹{item.price}</td>
                          <td>₹{(Number(item.price) * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
