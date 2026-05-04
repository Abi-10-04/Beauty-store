import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '../api/axiosConfig'

export default function CheckoutPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const cart = location.state?.cart

  const [formData, setFormData] = useState({
    shipping_address: '',
    phone: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const items = cart.items.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity
      }))

      const response = await api.post('/orders/orders/create_order/', {
        items,
        shipping_address: formData.shipping_address,
        phone: formData.phone
      })

      // Redirect to payment page
      navigate('/payment', { state: { order: response.data } })
    } catch (err) {
      setError(err.response?.data?.error || 'Error creating order')
    } finally {
      setLoading(false)
    }
  }

  if (!cart) {
    return (
      <div className="container my-5">
        <div className="alert alert-warning">No cart data found. Please go back to your cart.</div>
      </div>
    )
  }

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h1 className="mb-4">Checkout</h1>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="row">
            <div className="col-md-8">
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title">Shipping Information</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="shipping_address" className="form-label">Shipping Address</label>
                      <textarea
                        className="form-control"
                        id="shipping_address"
                        name="shipping_address"
                        rows="3"
                        value={formData.shipping_address}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="phone" className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        className="form-control"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : 'Continue to Payment'}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Order Summary</h5>
                  <hr />
                  {cart.items.map(item => (
                    <div key={item.id} className="d-flex justify-content-between mb-2">
                      <span>{item.product_name} x{item.quantity}</span>
                      <span>₹{(Number(item.product_price) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <hr />
                  <div className="d-flex justify-content-between">
                    <strong>Total:</strong>
                    <strong>₹{Number(cart.total_price).toFixed(2)}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
