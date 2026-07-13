import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/auth-context'
import { Button } from '../ui/Button'
import './admin.css'

// The frame for the SEPARATE admin section. Unlike the student <Layout>, this has
// its own sidebar (no student navbar/footer) so admins get a distinct workspace.
// Every /admin/* route renders inside here via <Outlet />.
//
// This layout is only ever reached through <AdminRoute>, so we can assume the
// viewer is an admin. We still show their name + a logout button.
export function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `admin-sidebar__link ${isActive ? 'is-active' : ''}`

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link to="/admin" className="admin-sidebar__brand">
          <span aria-hidden="true">🛠️</span> TeachHub Admin
        </Link>

        {/* `end` on the dashboard link so it isn't marked active for sub-routes. */}
        <NavLink to="/admin" end className={linkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/admin/courses" className={linkClass}>
          Manage courses
        </NavLink>
        <NavLink to="/admin/users" className={linkClass}>
          Manage users
        </NavLink>
        <NavLink to="/admin/admins/new" className={linkClass}>
          Create admin
        </NavLink>

        <div className="admin-sidebar__spacer" />

        {/* Link back to the normal student-facing app. */}
        <Link to="/courses" className="admin-sidebar__link">
          ← Back to site
        </Link>
      </aside>

      <main className="admin-main">
        <div className="admin-header">
          <span className="navbar__user">
            Signed in as <strong>{user?.name}</strong> (admin)
          </span>
          <Button variant="secondary" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
        <Outlet />
      </main>
    </div>
  )
}
