import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/auth-context'
import { Button } from '../ui/Button'
import './layout.css'

// The top navigation bar, shown on every page.
// - Left: brand/logo that links home.
// - Center: links (Courses, Users, My Learning) — only meaningful when signed in.
// - Right: the logged-in user's name + Logout, OR Login/Sign up buttons.
// On small screens the center links collapse behind a ☰ button.
export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  // Helper so a NavLink gets the "is-active" class when its route is current.
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `navbar__link ${isActive ? 'is-active' : ''}`

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand" onClick={() => setMenuOpen(false)}>
          <span className="navbar__logo" aria-hidden="true">
            🎓
          </span>
          TeachHub
        </Link>

        <nav
          className={`navbar__links ${menuOpen ? 'is-open' : ''}`}
          onClick={() => setMenuOpen(false)}
        >
          <NavLink to="/courses" className={linkClass}>
            Courses
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/users" className={linkClass}>
                Users
              </NavLink>
              <NavLink to="/me" className={linkClass}>
                My Learning
              </NavLink>
            </>
          )}
        </nav>

        <div className="navbar__right">
          {isAuthenticated ? (
            <>
              <span className="navbar__user">
                Hi, <strong>{user?.name}</strong>
              </span>
              <Button variant="secondary" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link className="navbar__link" to="/login">
                Login
              </Link>
              <Button size="sm" onClick={() => navigate('/register')}>
                Sign up
              </Button>
            </>
          )}
          <button
            type="button"
            className="navbar__toggle"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  )
}
