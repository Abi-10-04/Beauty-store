import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import api from '../api/axiosConfig'

export default function HomePage() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const getCategorySlug = (name) => name.toLowerCase().replace(/\s+/g, '-').trim()

  const handleViewProducts = (name) => {
    const slug = getCategorySlug(name)
    navigate(`/categories/${slug}`)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get('/products/products/?limit=20'), // Fetch 20 products for homepage
        api.get('/products/categories/')
      ])
      
      setProducts(productsRes.data.results || productsRes.data)
      setCategories(categoriesRes.data.results || categoriesRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div >
      {/* Banner */}
      <div className="d-flex align-items-center justify-content-center py-5 text-center mb-4 text-white"
      style={{
        backgroundImage: `url('/src/assets/images/WelcomePage.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        <div className="py-5 text-center mb-4">
        <div className="container">
          <h1 className="display-3 fw-bold mb-3">Glow Your Beauty</h1>
          <p className="lead mb-4">Discover premium beauty products for everyone</p>
          <Link to="/categories" className="btn btn-lg px-5">
            Shop Now
          </Link>
        </div>
        </div>
      </div>

      {/* Categories */}
      <div className="container my-5">
        <h2 className="mb-4 text-center fw-bold">Featured Categories</h2>
        <div className="row g-4">
          {categories.map(category => (
            <div key={category.id} className="col-md-4">
              <div className="card h-100 text-center border-0 shadow-sm hover-card">
                <div className="card-body py-5">
                  <h5 className="fw-bold">{category.name}</h5>
                  <p className="text-muted">{category.description}</p>
                  <button
                    className="btn btn-outline-dark mt-2"
                    onClick={() => handleViewProducts(category.name)}
                  >
                    View Products →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="container mb-5">
        <h2 className="mb-4text-center fw-bold">Trending Products</h2>
        <div className="row g-4">
          {products.map(product => (
            <div key={product.id} className="col-md-6 col-lg-3">
              <ProductCard product={product} onWishlistChange={fetchData} />
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <Link to="/categories" className="btn btn-outline-dark px-4 shadow-sm">
            View All Products
          </Link>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-5 mb-5 text-white div" >
        <div className="container text-center">
          <h2 className="mb-5 fw-bold">Why Choose Beauty Store?</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="text-center text-white">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
                <h5>Premium Quality</h5>
                <p>100% authentic beauty products curated from top brands worldwide</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center text-white">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚚</div>
                <h5>Fast Delivery</h5>
                <p>Quick and reliable shipping directly to your doorstep</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center text-white">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💯</div>
                <h5>Best Prices</h5>
                <p>Competitive pricing with exclusive offers and discounts</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="container mb-5">
        <h2 className="mb-4 text-center">Customer Testimonials</h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <div className="mb-3">
                  <span style={{ fontSize: '1.2rem' }}>⭐⭐⭐⭐⭐</span>
                </div>
                <p className="card-text">"Amazing collection and excellent service! My skin has never looked better."</p>
                <p className="text-muted fw-bold">- Sarah M.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <div className="mb-3">
                  <span style={{ fontSize: '1.2rem' }}>⭐⭐⭐⭐⭐</span>
                </div>
                <p className="card-text">"Great prices and fast delivery. Highly recommend to all beauty lovers!"</p>
                <p className="text-muted fw-bold">- Emma T.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <div className="mb-3">
                  <span style={{ fontSize: '1.2rem' }}>⭐⭐⭐⭐⭐</span>
                </div>
                <p className="card-text">"Perfect products, perfect prices. This is my go-to beauty store now!"</p>
                <p className="text-muted fw-bold">- Jessica L.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-light py-5">
        <div className="container text-center">
          <h3 className="fw-bold">Stay Updated 💌</h3>
          <p className="text-muted">Get latest offers & beauty tips</p>
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="input-group">
                <input className="form-control" placeholder="Enter your email" />
                <button className="btn btn-dark">Subscribe</button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
