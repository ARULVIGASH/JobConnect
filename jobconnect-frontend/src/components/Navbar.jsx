
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import './Navbar.css'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const [role, setRole] = useState(() => localStorage.getItem('role'))
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [unreadCount, setUnreadCount] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const syncLoginState = () => {
      setRole(localStorage.getItem('role'))
      setToken(localStorage.getItem('token'))
    }

    window.addEventListener('storage', syncLoginState)
    window.addEventListener('focus', syncLoginState)

    return () => {
      window.removeEventListener('storage', syncLoginState)
      window.removeEventListener('focus', syncLoginState)
    }
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!token || !role || role === 'ADMIN') {
      setUnreadCount(0)
      return
    }

    let active = true

    const fetchUnreadCount = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8081/api/notifications/me/unread-count',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (active) {
          setUnreadCount(Number(response.data) || 0)
        }
      } catch (error) {
        if (active) {
          console.error(
            'Failed to load unread notification count:',
            error.response?.status || error.message
          )
        }
      }
    }

    fetchUnreadCount()

    const intervalId = setInterval(fetchUnreadCount, 30000)
    window.addEventListener('focus', fetchUnreadCount)

    return () => {
      active = false
      clearInterval(intervalId)
      window.removeEventListener('focus', fetchUnreadCount)
    }
  }, [token, role])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('role')
    localStorage.removeItem('email')
    localStorage.removeItem('name')

    setRole(null)
    setToken(null)
    setUnreadCount(0)
    setMenuOpen(false)

    navigate('/login')
  }

  const notificationLink = (
    <Link to="/notifications" className="notification-link">
      Notifications
      {unreadCount > 0 && (
        <span className="notification-badge">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Link>
  )

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo" aria-label="JobConnect home">
          <span className="logo-symbol">J</span>
          <span>JobConnect</span>
        </Link>

        <button
          type="button"
          className="menu-toggle"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          className={`nav-links ${menuOpen ? 'nav-links-open' : ''}`}
          aria-label="Main navigation"
        >
          <Link to="/" className="nav-link">Home</Link>

          {!role && (
            <>
              <Link to="/jobs" className="nav-link">Find Jobs</Link>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-register">
                Create Account
              </Link>
            </>
          )}

          {role === 'JOB_SEEKER' && (
            <>
              <Link to="/jobs" className="nav-link">Find Jobs</Link>
              <Link to="/my-applications" className="nav-link">
                My Applications
              </Link>
              <Link to="/saved-jobs" className="nav-link">Saved Jobs</Link>
              <Link to="/resume" className="nav-link">My Resume</Link>
              <Link to="/my-profile" className="nav-link">My Profile</Link>
              {notificationLink}
            </>
          )}

          {role === 'RECRUITER' && (
            <>
              <Link to="/recruiter/dashboard" className="nav-link">
                Dashboard
              </Link>
              <Link to="/recruiter/jobs" className="nav-link">
                My Jobs
              </Link>
              {notificationLink}
              <Link to="/recruiter/post-job" className="nav-post-job">
                <span aria-hidden="true">+</span> Post a Job
              </Link>
            </>
          )}

          {role === 'ADMIN' && (
            <>
              <Link to="/admin" className="nav-link">Dashboard</Link>
              <Link to="/admin/users" className="nav-link">Users</Link>
              <Link to="/admin/jobs" className="nav-link">Jobs</Link>
              <Link to="/admin/applications" className="nav-link">
                Applications
              </Link>
              <Link to="/admin/categories" className="nav-link">
                Categories
              </Link>
            </>
          )}

          {role && (
            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar

