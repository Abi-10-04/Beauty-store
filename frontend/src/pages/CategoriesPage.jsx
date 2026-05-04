import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import api from '../api/axiosConfig'

export default function CategoriesPage() {
  const { categoryName } = useParams()
  const [categories, setCategories] = useState([])
  const [selectedCategorySlug, setSelectedCategorySlug] = useState(categoryName || '')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalCount, setTotalCount] = useState(0)

  const navigate = useNavigate()
  const slugify = (name) => name.toLowerCase().replace(/\s+/g, '-').trim()

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    setSelectedCategorySlug(categoryName || '')
  }, [categoryName])

  useEffect(() => {
    if (categories.length > 0 && categoryName) {
      const matchedCategory = categories.find((category) => slugify(category.name) === categoryName)
      if (!matchedCategory) {
        setSelectedCategorySlug('')
      }
    }
  }, [categories, categoryName])

  useEffect(() => {
    fetchProducts(selectedCategorySlug, 1)
  }, [selectedCategorySlug])

  const fetchCategories = async () => {
    try {
      const response = await api.get('/products/categories/')
      const cats = response.data.results || response.data
      setCategories(cats)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async (categorySlug, page = 1) => {
    setLoading(true)
    try {
      const endpoint = categorySlug
        ? `/products/products/?category=${encodeURIComponent(categorySlug)}&page=${page}`
        : `/products/products/?page=${page}`
      const response = await api.get(endpoint)

      if (response.data.results) {
        // Paginated response
        setProducts(response.data.results)
        setTotalCount(response.data.count)
        setTotalPages(Math.ceil(response.data.count / 9))
      } else {
        // Non-paginated response (fallback)
        setProducts(response.data)
        setTotalPages(1)
        setTotalCount(response.data.length)
      }
      setCurrentPage(page)
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container my-5">
      <h1 className="mb-4">Shop by Category</h1>

      <div className="row">
        <div className="col-md-3">
          <div className="list-group sticky-top" style={{ top: '20px' }}>
            {categories.map(category => (
              <button
                key={category.id}
                className={`list-group-item list-group-item-action ${selectedCategorySlug === slugify(category.name) ? 'custom-text' : ''}`}
                onClick={() => navigate(`/categories/${slugify(category.name)}`)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="col-md-9">
          {loading ? (
            <div className="d-flex justify-content-center">
              <div className="spinner-border custom-spinner" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              <h3 className="mb-4">
                {categories.find((c) => slugify(c.name) === selectedCategorySlug)?.name
                  ? `${categories.find((c) => slugify(c.name) === selectedCategorySlug).name} Products`
                  : 'All Products'}
              </h3>
              {products.length > 0 ? (
                <>
                  <div className="row g-4">
                    {products.map(product => (
                      <div key={product.id} className="col-md-6 col-lg-4">
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <nav className="mt-5" aria-label="Page navigation">
                      <ul className="pagination justify-content-center">

                        {/* Previous */}
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => fetchProducts(selectedCategorySlug, currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            Previous
                          </button>
                        </li>

                        {/* Page Numbers */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <li key={page} className="page-item">
                            <button
                              className={`page-link ${currentPage === page ? 'custom-active' : ''}`}
                              onClick={() => fetchProducts(selectedCategorySlug, page)}
                            >
                              {page}
                            </button>
                          </li>
                        ))}

                        {/* Next */}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                          <button
                            className="page-link"
                            onClick={() => fetchProducts(selectedCategorySlug, currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            Next
                          </button>
                        </li>

                      </ul>
                      <p className="text-center text-muted mt-2">
                        Showing {(currentPage - 1) * 9 + 1} - {Math.min(currentPage * 9, totalCount)} of {totalCount} products
                      </p>
                    </nav>
                  )}
                </>
              ) : (
                <div className="alert alert-info">No products found in this category</div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
