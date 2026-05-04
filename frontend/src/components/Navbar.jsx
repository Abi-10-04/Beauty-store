import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axiosConfig'
import 'bootstrap/dist/css/bootstrap.min.css'

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [cartCount, setCartCount] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      fetchCartCount()
    }
  }, [isAuthenticated])

  const fetchCartCount = async () => {
    try {
      const response = await api.get('/products/cart/my_cart/')
      let count = 0
      if (Array.isArray(response.data)) {
        count = response.data.reduce((sum, cart) => sum + (cart.items?.length || 0), 0)
      } else {
        count = response.data.items?.length || 0
      }
      setCartCount(count)
    } catch (error) {
      console.error('Error fetching cart:', error)
      setCartCount(0)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
    setMobileMenuOpen(false)
  }

  const handleNavClick = () => {
    setMobileMenuOpen(false)
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/" onClick={handleNavClick}>
          💄 Beauty Store
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${mobileMenuOpen ? 'show' : ''}`} id="navbarNav" style={{
          display: mobileMenuOpen ? 'block' : 'none',
          backgroundColor: mobileMenuOpen ? '#212529' : 'transparent',
          padding: mobileMenuOpen ? '1rem 0' : '0'
        }}>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={handleNavClick}>Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/categories" onClick={handleNavClick}>Categories</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/offers" onClick={handleNavClick}>Offers</Link>
            </li>
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/wishlist" onClick={handleNavClick}>
                    Wishlist
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/cart" onClick={handleNavClick}>
                    🛒 Cart {cartCount > 0 && <span className="badge bg-danger">{cartCount}</span>}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/orders" onClick={handleNavClick}>Orders</Link>
                </li>
                {user?.role === 'admin' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin" onClick={handleNavClick}>Admin</Link>
                  </li>
                )}
                <li className="nav-item">
                  <Link className="nav-link" to="/profile" onClick={handleNavClick}>
                    👤 {user?.username}
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-light ms-2" onClick={handleLogout} style={{ marginTop: mobileMenuOpen ? '0.5rem' : '0' }}>Logout</button>
                </li>
              </>
            )}
            {!isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login" onClick={handleNavClick}>Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register" onClick={handleNavClick}>Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}
