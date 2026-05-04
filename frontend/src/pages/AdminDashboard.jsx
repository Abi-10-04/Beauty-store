import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axiosConfig'
import { getProductImage } from '../utils/imageMap'

export default function AdminDashboard() {
  const { isAdmin } = useAuth()
  const [activeTab, setActiveTab] = useState('products')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: null
  })
  const [editingProduct, setEditingProduct] = useState(null)
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [imagePreview, setImagePreview] = useState(null)
  const [rating, setRating] = useState(0)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [productsRes, ordersRes, catsRes] = await Promise.all([
        api.get('/products/products/?limit=1000'),
        api.get('/orders/orders/?limit=1000'),
        api.get('/products/categories/?limit=1000')
      ])
      setProducts(productsRes.data.results || productsRes.data)
      setOrders(ordersRes.data.results || ordersRes.data)
      setCategories(catsRes.data.results || catsRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, image: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = new FormData()
      payload.append('name', formData.name)
      payload.append('description', formData.description)
      payload.append('price', formData.price)
      payload.append('category', formData.category)
      payload.append('stock', formData.stock)
      payload.append('rating', rating)
      if (formData.image && formData.image instanceof File) {
        payload.append('image', formData.image)
      }

      if (editingProduct) {
        await api.put(`/products/products/${editingProduct.id}/`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        alert('Product updated successfully!')
      } else {
        await api.post('/products/products/', payload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        alert('Product added successfully!')
      }

      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        image: null
      })
      setImagePreview(null)
      setEditingProduct(null)
      fetchData()
    } catch (error) {
      alert(editingProduct ? 'Error updating product' : 'Error adding product')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/products/products/${productId}/`)
        alert('Product deleted!')
        if (editingProduct?.id === productId) {
          setEditingProduct(null)
          setFormData({ name: '', description: '', price: '', category: '', stock: '', image: null, rating: 0 })
          setImagePreview(null)
        }
        fetchData()
      } catch (error) {
        alert('Error deleting product')
      }
    }
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      category: product.category || '',
      stock: product.stock || '',
      image: null,
      rating: product.rating || 0
    })
    setRating(product.rating || 0)
    if (product.image) {
      setImagePreview(product.image)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancelEdit = () => {
    setEditingProduct(null)
    setFormData({ name: '', description: '', price: '', category: '', stock: '', image: null, rating: 0 })
    setRating(0)
    setImagePreview(null)
  }

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/orders/${orderId}/`, { status: newStatus })
      alert('Order status updated!')
      fetchData()
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus })
      }
    } catch (error) {
      alert('Error updating order')
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

  const renderRatingStars = (ratingValue) => {
    return [1, 2, 3, 4, 5].map(star => (
      <span
        key={star}
        style={{
          cursor: 'pointer',
          fontSize: '28px',
          color: star <= ratingValue ? '#ffc107' : '#e0e0e0',
          marginRight: '5px',
          transition: 'color 0.2s'
        }}
        onClick={() => setRating(star)}
        title={`${star} star${star > 1 ? 's' : ''}`}
      >
        ★
      </span>
    ))
  }

  if (!isAdmin) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">Access denied. Admin only.</div>
      </div>
    )
  }

  return (
    <div className="container-fluid my-5">
      <h1 className="mb-4">🛠️ Admin Dashboard</h1>

      <ul className="nav nav-tabs mb-4" role="tablist">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'products' ? 'custom-active' : 'text-dark'}`}
            onClick={() => setActiveTab('products')}
          >
            Products
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'orders' ? 'custom-active' : 'text-dark'}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
        </li>
        <li className="nav-item">
          <Link to="/admin/coupons" className="nav-link text-dark">
            Coupons
          </Link>
        </li>
      </ul>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div>
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Add New Product</h5>
                  <form onSubmit={handleAddProduct}>
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Product Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <textarea
                        className="form-control"
                        placeholder="Description"
                        rows="3"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        placeholder="Price"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Rating</label>
                      <div className="d-flex align-items-center">
                        <div>
                          {renderRatingStars(rating)}
                        </div>
                        <span className="ms-3 badge bg-warning text-dark fw-bold" style={{ fontSize: '16px', padding: '8px 12px' }}>
                          {rating > 0 ? `${rating}.0 out of 5` : 'No rating'}
                        </span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <select
                        className="form-control"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Stock"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Product Image</label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      {imagePreview && (
                        <div className="mt-2">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="img-fluid rounded"
                            style={{ maxHeight: '150px', maxWidth: '150px', objectFit: 'cover' }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="d-grid gap-2">
                      <button type="submit" className="btn custom-btn" disabled={loading}>
                        {loading ? (editingProduct ? 'Updating...' : 'Saving...') : (editingProduct ? 'Update Product' : 'Add Product')}
                      </button>
                      {editingProduct && (
                        <button type="button" className="btn btn-outline-box" onClick={handleCancelEdit} disabled={loading}>
                          Cancel Edit
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Products List</h5>
                  <div className="table-responsive" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                    <table className="table table-hover align-middle">
                      <thead className="custom-btn">
                        <tr>
                          <th>Image</th>
                          <th>Name</th>
                          <th>Category</th>
                          <th>Price</th>
                          <th>Stock</th>
                          <th>Rating</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(product => (
                          <tr key={product.id}>
                            <td style={{ width: '100px' }}>
                              <img
                                src={product.image || getProductImage(product.name) || 'https://via.placeholder.com/80x80?text=No+Image'}
                                alt={product.name}
                                className="img-fluid rounded"
                                style={{ maxHeight: '80px', objectFit: 'cover' }}
                              />
                            </td>
                            <td>{product.name}</td>
                            <td>{product.category_name || product.category}</td>
                            <td>₹{product.price}</td>
                            <td>{product.stock}</td>
                            <td>
                              <span className="text-warning" title={`${product.rating || 0} out of 5`}>
                                {'★'.repeat(Math.round(product.rating || 0))}{'☆'.repeat(5 - Math.round(product.rating || 0))} {product.rating ? Number(product.rating).toFixed(1) : '0'}
                              </span>
                            </td>
                            <td>
                              <button
                                className="btn btn-sm custom-btn me-2"
                                onClick={() => handleEditProduct(product)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-sm"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table">
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.user?.username || order.user}</td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className="form-select form-select-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>₹{Number(order.total_price).toFixed(2)}</td>
                    <td>
                      <button className="btn btn-sm custom-btn" onClick={() => fetchOrderDetails(order.id)}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
                {selectedOrder.user && (
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
                        <th>Rating</th>
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
                          <td>
                            {[1, 2, 3, 4, 5].map(star => (
                              <span
                                key={star}
                                style={{
                                  color: star <= (item.product.rating || 0) ? '#ff9800' : '#ccc'
                                }}
                              >
                                ★
                              </span>
                            ))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
                {selectedOrder.status !== 'delivered' && (
                  <button type="button" className="btn custom-btn" onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'delivered')}>Mark as Delivered</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
