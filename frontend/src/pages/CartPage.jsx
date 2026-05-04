import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axiosConfig'

export default function CartPage() {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { isAuthenticated, isAdmin } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    } else {
      fetchCart()
    }
  }, [isAuthenticated])

  const fetchCart = async () => {
    try {
      const response = await api.get('/products/cart/my_cart/')
      setCart(response.data)
    } catch (error) {
      console.error('Error fetching cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveItem = async (cartItemId) => {
    try {
      const response = await api.post('/products/cart/remove_item/', {
        cart_item_id: cartItemId
      })
      setCart(response.data)
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }

  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity < 1) return
    try {
      const response = await api.put('/products/cart/update_item/', {
        cart_item_id: cartItemId,
        quantity: newQuantity
      })
      setCart(response.data)
    } catch (error) {
      console.error('Error updating quantity:', error)
    }
  }

  const handleCheckout = () => {
    navigate('/checkout', { state: { cart } })
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <div className="spinner-border text-primary"></div>
      </div>
    )
  }

  return (
    <div className="container my-5">
      <h1 className="text-dark mb-4">{isAdmin ? 'All Carts' : 'Shopping Cart'}</h1>

      {isAdmin && Array.isArray(cart) ? (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table">
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Cart Total</th>
              </tr>
            </thead>
            <tbody>
              {cart.flatMap(currentCart =>
                currentCart.items.map(item => (
                  <tr key={`${currentCart.id}-${item.id}`}>
                    <td>{currentCart.user?.username}</td>
                    <td>{currentCart.user?.email}</td>
                    <td>{item.product_name}</td>
                    <td>{item.quantity}</td>
                    <td>₹{(Number(item.product_price) * item.quantity).toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : cart?.items && cart.items.length > 0 ? (
        <div className="row">
          <div className="col-md-8">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.items.map(item => (
                    <tr key={item.id}>
                      <td>{item.product_name}</td>
                      <td>₹{item.product_price}</td>
                      <td>
                        <div className="input-group" style={{ width: '100px' }}>
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </button>
                          <input type="text" className="form-control text-center" value={item.quantity} readOnly />
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td>₹{(Number(item.product_price) * item.quantity).toFixed(2)}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Order Summary</h5>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <span>Subtotal:</span>
                  <span>₹{Number(cart.total_price).toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Tax:</span>
                  <span>₹0</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-4">
                  <strong>Total:</strong>
                  <strong>₹{Number(cart.total_price).toFixed(2)}</strong>
                </div>
                <button
                  className="btn btn-primary w-100"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="alert alert-info text-center">
          <p>{isAdmin ? 'No carts found for any users yet.' : 'Your cart is empty'}</p>
          <a href="/categories" className="btn btn-primary">Continue Shopping</a>
        </div>
      )}
    </div>
  )
}
