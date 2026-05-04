import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axiosConfig'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState({ type: '', message: '' })
  const navigate = useNavigate()
  const { login } = useAuth()

  // Auto-dismiss feedback after 5 seconds
  useEffect(() => {
    if (feedback.message) {
      const timer = setTimeout(() => {
        setFeedback({ type: '', message: '' })
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [feedback])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setFeedback({ type: '', message: '' })
    setLoading(true)

    try {
      const response = await api.post('/auth/auth/login/', {
        username,
        password
      })

      localStorage.setItem('access_token', response.data.access)
      localStorage.setItem('refresh_token', response.data.refresh)
      
      login(response.data.user)
      setFeedback({ 
        type: 'success', 
        message: `Welcome back, ${response.data.user.username}! Redirecting...` 
      })
      
      setTimeout(() => navigate('/'), 1500)
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Login failed. Please try again.'
      setError(errorMsg)
      setFeedback({ 
        type: 'error', 
        message: errorMsg 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container my-5">
      {/* Feedback Toast Area */}
      {feedback.message && (
        <div className="row justify-content-center mb-3">
          <div className="col-md-6">
            <div 
              className={`alert alert-${feedback.type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`}
              role="alert"
              style={{
                animation: 'slideDown 0.3s ease-out'
              }}
            >
              <div className="d-flex align-items-center">
                <span className="me-2">
                  {feedback.type === 'success' ? '✓' : '✗'}
                </span>
                {feedback.message}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body p-5">
              <h2 className="text-center mb-4">Login</h2>

              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn custom-btn w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </form>

              <div className="text-center">
                <p>Don't have an account? <Link className="btn btn-link" to="/register">Register here</Link></p>
              </div>

              {/* <div className="alert alert-info mt-3">
                <small>Demo credentials:<br />
                Username: admin<br />
                Password: admin123
                </small>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
