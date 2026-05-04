import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '../api/axiosConfig'

export default function PaymentPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const order = location.state?.order

  const [paymentMethod, setPaymentMethod] = useState('card')
  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  })
  const [couponCode, setCouponCode] = useState('')
  const [couponData, setCouponData] = useState(null)
  const [couponLoading, setCouponLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [qrCode] = useState(`upi://pay?pa=beautyskincare@upi&pn=Beauty%20Store&am=${Number(order?.total_price || 0).toFixed(2)}&tn=Order%20Payment`)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      alert('Please enter a coupon code')
      return
    }

    setCouponLoading(true)
    try {
      const response = await api.post('/offers/offers/apply_coupon/', {
        code: couponCode.trim(),
        cart_total: Number(order.total_price)
      })

      setCouponData(response.data)
      alert('Coupon applied successfully!')
    } catch (error) {
      alert(error.response?.data?.error || 'Invalid coupon code')
      setCouponData(null)
    } finally {
      setCouponLoading(false)
    }
  }

  const handleRemoveCoupon = () => {
    setCouponCode('')
    setCouponData(null)
  }

  const getFinalPrice = () => {
    if (couponData) {
      return couponData.final_price
    }
    return Number(order.total_price)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate payment method
      if (paymentMethod === 'card') {
        if (!formData.cardName || !formData.cardNumber || !formData.expiryDate || !formData.cvv) {
          alert('Please fill in all card details')
          setLoading(false)
          return
        }
      } else if (paymentMethod === 'cod') {
        // No validation needed for COD
      } else if (paymentMethod === 'gpay') {
        alert('Please complete the payment through your UPI app and return here')
        setLoading(false)
        return
      }

      // Simulate payment processing
      setTimeout(() => {
        alert(`Payment successful via ${paymentMethod === 'card' ? 'Credit/Debit Card' : paymentMethod === 'gpay' ? 'Google Pay' : 'Cash on Delivery'}! Your order has been placed.`)
        navigate(`/orders`)
      }, 2000)
    } catch (error) {
      alert('Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!order) {
    return (
      <div className="container my-5">
        <div className="alert alert-warning">No order data found.</div>
      </div>
    )
  }

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body p-5">
              <h2 className="text-center mb-4">Payment</h2>

              <div className="alert alert-info mb-4">
                <div className="d-flex justify-content-between align-items-center">
                  <span><strong>Order Total:</strong></span>
                  <span>₹{Number(order.total_price).toFixed(2)}</span>
                </div>
                {couponData && (
                  <div className="mt-2">
                    <div className="d-flex justify-content-between align-items-center text-success">
                      <span><strong>Discount ({couponData.coupon.discount_percentage}%):</strong></span>
                      <span>-₹{Number(couponData.discount_amount).toFixed(2)}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="d-flex justify-content-between align-items-center">
                      <span><strong>Final Total:</strong></span>
                      <span className="text-success fw-bold">₹{Number(couponData.final_price).toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Coupon Section */}
              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title"> Have a Coupon?</h5>
                  {!couponData ? (
                    <div className="row g-2">
                      <div className="col-md-8">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          disabled={couponLoading}
                        />
                      </div>
                      <div className="col-md-4">
                        <button
                          type="button"
                          className="btn btn-outline-primary w-100"
                          onClick={handleApplyCoupon}
                          disabled={couponLoading || !couponCode.trim()}
                        >
                          {couponLoading ? 'Applying...' : 'Apply'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <span className="badge custom-btn me-2">✓ {couponData.coupon.code}</span>
                        <small className="text-muted">{couponData.coupon.title}</small>
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={handleRemoveCoupon}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="mb-4">
                <h5 className="mb-3"> Select Payment Method</h5>
                <div className="row g-3">
                  <div className="col-md-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="card"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <label className="form-check-label" htmlFor="card">
                         Card
                      </label>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="gpay"
                        value="gpay"
                        checked={paymentMethod === 'gpay'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <label className="form-check-label" htmlFor="gpay">
                        Google Pay (UPI)
                      </label>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="cod"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <label className="form-check-label" htmlFor="cod">
                        Cash on Delivery
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <hr />

              <form onSubmit={handleSubmit}>
                {/* Credit/Debit Card Payment Form */}
                {paymentMethod === 'card' && (
                  <div>
                    <h5 className="mb-3">Card Details</h5>
                    <div className="mb-3">
                      <label htmlFor="cardName" className="form-label">Cardholder Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="cardName"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="cardNumber" className="form-label">Card Number</label>
                      <input
                        type="text"
                        className="form-control"
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        required
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label htmlFor="expiryDate" className="form-label">Expiry Date</label>
                        <input
                          type="text"
                          className="form-control"
                          id="expiryDate"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleChange}
                          required
                          placeholder="MM/YY"
                          maxLength="5"
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="cvv" className="form-label">CVV</label>
                        <input
                          type="text"
                          className="form-control"
                          id="cvv"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleChange}
                          required
                          placeholder="123"
                          maxLength="4"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Google Pay / UPI Payment Form */}
                {paymentMethod === 'gpay' && (
                  <div className="text-center">
                    <h5 className="mb-3">Scan with Google Pay or any UPI App</h5>
                    <div className="card mb-3">
                      <div className="card-body p-4">
                        <div style={{
                          backgroundColor: '#fff',
                          padding: '20px',
                          borderRadius: '8px',
                          display: 'inline-block'
                        }}>
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCode)}`}
                            alt="UPI QR Code"
                            style={{ width: '200px', height: '200px' }}
                          />
                        </div>
                        <p className="mt-3 text-muted">
                          <small>Amount: <strong>₹{getFinalPrice().toFixed(2)}</strong></small>
                        </p>
                      </div>
                    </div>
                    <div className="alert alert-info">
                      <small>Open your preferred UPI app (Google Pay, PhonePe, Paytm) and scan this QR code to make payment</small>
                    </div>
                  </div>
                )}

                {/* Cash on Delivery */}
                {paymentMethod === 'cod' && (
                  <div>
                    <div className="card mb-4 border-success">
                      <div className="card-body">
                        <h5 className="card-title"> Cash on Delivery</h5>
                        <p className="card-text">
                          Pay when your order arrives at your doorstep. Please have the exact amount ready.
                        </p>
                        <div className="alert alert-info mt-3">
                          <strong>Order Details:</strong>
                          <ul className="mb-0 mt-2">
                            <li>Total Amount: <strong>₹{getFinalPrice().toFixed(2)}</strong></li>
                            <li>Delivery in 3-5 business days</li>
                            <li>Payment method: Cash</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="btn custom-btn w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? 'Processing Payment...' : `Confirm Payment - ₹${getFinalPrice().toFixed(2)}`}
                </button>
              </form>

              <div className="alert alert-warning mt-3">
                <small><strong>Demo Mode:</strong> Use any card details to complete payment.</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
