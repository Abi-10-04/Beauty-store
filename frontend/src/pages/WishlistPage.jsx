import React, { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import { useAuth } from '../context/AuthContext'
import api from '../api/axiosConfig'

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState(null)
  const [loading, setLoading] = useState(true)
  const { isAuthenticated, isAdmin } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist()
    }
  }, [isAuthenticated])

  const fetchWishlist = async () => {
    try {
      const response = await api.get('/products/wishlist/my_wishlist/')
      setWishlist(response.data)
    } catch (error) {
      console.error('Error fetching wishlist:', error)
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
      <h1 className="mb-4">{isAdmin ? 'All Wishlists' : 'My Wishlist'}</h1>

      {isAdmin && Array.isArray(wishlist) ? (
        <div className="table-responsive mb-4">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Product</th>
              </tr>
            </thead>
            <tbody>
              {wishlist.flatMap(wl =>
                wl.products.map(product => (
                  <tr key={`${wl.id}-${product.id}`}>
                    <td>{wl.user?.username}</td>
                    <td>{wl.user?.email}</td>
                    <td>{product.name}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : wishlist?.products && wishlist.products.length > 0 ? (
        <div className="row g-4">
          {wishlist.products.map(product => (
            <div key={product.id} className="col-md-6 col-lg-3">
              <ProductCard product={product} onWishlistChange={fetchWishlist} />
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info text-center">
          <p>{isAdmin ? 'No wishlists found for any users yet.' : 'Your wishlist is empty'}</p>
          <a href="/categories" className="btn btn-primary">Start Shopping</a>
        </div>
      )}
    </div>
  )
}
