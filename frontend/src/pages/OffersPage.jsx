import React, { useState, useEffect } from 'react'
import api from '../api/axiosConfig'

export default function OffersPage() {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOffers()
  }, [])

  const fetchOffers = async () => {
    try {
      const response = await api.get('/offers/offers/')
      setOffers(response.data.results || response.data)
    } catch (error) {
      console.error('Error fetching offers:', error)
    } finally {
      setLoading(false)
    }
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
      <h1 className="mb-4">Special Offers</h1>

      {offers && offers.length > 0 ? (
        <div className="row g-4">
          {offers.map(offer => (
            <div key={offer.id} className="col-md-6 col-lg-4">
              <div className="card h-100 border-success shadow-sm">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h5 className="card-title">{offer.title}</h5>
                      <p className="card-text text-muted">{offer.description}</p>
                    </div>
                    <span className="badge custom-btn fs-6">
                      {offer.discount_percentage}% OFF
                    </span>
                  </div>

                  <div className="mb-3">
                    <p className="mb-1">
                      <strong>Code:</strong> <code className="bg-light p-2 rounded">{offer.code}</code>
                    </p>
                    <p className="mb-0 text-muted small">
                      Valid till: {new Date(offer.valid_to).toLocaleDateString()}
                    </p>
                  </div>

                  <button
                    className="btn custom-btn w-100"
                    onClick={() => {
                      navigator.clipboard.writeText(offer.code)
                      alert('Coupon code copied!')
                    }}
                  >
                    Copy Code
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info text-center">
          <p>No active offers available at the moment</p>
          <a href="/categories" className="btn btn-primary">Continue Shopping</a>
        </div>
      )}
    </div>
  )
}
