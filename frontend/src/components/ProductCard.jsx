import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axiosConfig'
import { getProductImage } from '../utils/imageMap'

export default function ProductCard({ product, onWishlistChange }) {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      checkWishlist()
    }
  }, [isAuthenticated, product.id])

  const checkWishlist = async () => {
    try {
      const response = await api.get('/products/wishlist/my_wishlist/')
      // Handle both possible response structures
      const products = response.data.products || response.data || []
      const wishlistedIds = Array.isArray(products) ? products.map(p => p.id) : []
      setIsWishlisted(wishlistedIds.includes(product.id))
    } catch (error) {
      console.error('Error checking wishlist:', error)
    }
  }

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    setLoading(true)
    try {
      await api.post('/products/cart/add_item/', {
        product_id: product.id,
        quantity: 1
      })
      alert('Product added to cart!')
    } catch (error) {
      alert('Error adding to cart')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    setLoading(true)
    try {
      if (isWishlisted) {
        await api.post('/products/wishlist/remove_product/', {
          product_id: product.id
        })
      } else {
        await api.post('/products/wishlist/add_product/', {
          product_id: product.id
        })
      }
      setIsWishlisted(!isWishlisted)
      if (onWishlistChange) onWishlistChange()
    } catch (error) {
      console.error('Error updating wishlist:', error)
    } finally {
      setLoading(false)
    }
  }

  const productImage = getProductImage(product.name)

  const renderStars = (rating) => {
    const rate = rating ? Number(rating) : 0
    const fullStars = Math.floor(rate)
    const hasHalfStar = rate % 1 >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    let stars = '⭐'.repeat(fullStars)
    if (hasHalfStar) stars += '⭐' // You can use '⚡' or '✨' for half star if needed
    stars += '☆'.repeat(emptyStars)

    return stars
  }

  return (
    <div className="card h-100 border-0 shadow product-card">
      <div className="card-img-top bg-dark d-flex align-items-center justify-content-center" style={{ height: '350px', overflow: 'hidden' }}>
        {productImage ? (
          <img
            src={productImage}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: '0.4s' }}
          />
        ) : (
          <span className="d-flex align-items-center justify-content-center h-100">📸 Product Image</span>
        )}
      </div>
      <div className="card-body d-flex flex-column">
        <h5 className="fw-bold">{product.name}</h5>
        <p className="card-text text-muted small">{product.description}</p>
        <div className="mb-3">
          <span className="badge text-outline text-dark p-2">{product.category_name}</span>
          {product.stock > 0 ? (
            <span className="badge text-outline text-dark ms-2">In Stock ({product.stock})</span>
          ) : (
            <span className="badge text-outline-danger ms-2">Out of Stock</span>
          )}
        </div>
        <div className="mb-3">
          <span className="h4 custom-text ms-2">₹{product.price}</span>
          <span className="ms-2 text-warning" title={`${product.rating ? Number(product.rating).toFixed(1) : 'No ratings'} out of 5`}>
            {renderStars(product.rating)} <strong>{product.rating ? Number(product.rating).toFixed(1) : '0.0'}</strong>
          </span>
        </div>
        <div className="mt-auto">
          <button
            className="btn custom-btn w-100 mb-2"
            onClick={handleAddToCart}
            disabled={loading || product.stock === 0}
          >
            {loading ? 'Adding...' : '🛒 Add to Cart'}
          </button>
          <button
            className={`btn outline-box w-100 ${isWishlisted ? 'active' : ''}`}
            onClick={handleWishlistToggle}
            disabled={loading}
          >
            {isWishlisted ? '❤️ Remove from Wishlist' : '🤍 Add to Wishlist'}
          </button>
        </div>
      </div>
    </div>
  )
}
