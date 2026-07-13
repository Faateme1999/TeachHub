import { Link } from 'react-router-dom'
import { Card } from '../../components/ui/Card'

// The admin landing page. Reached at /admin (inside <AdminLayout>, behind
// <AdminRoute>). Keep it simple — a welcome + quick links to the admin tasks.
//
// TODO(junior) — US-036 (admin dashboard, optional polish): show real numbers
// here, e.g. total courses (useCourses) and total users (useUsers). For now it's
// a static welcome so the section renders and routing is easy to verify.
export function AdminDashboardPage() {
  return (
    <div>
      <h1 className="page-header__title">Admin dashboard</h1>
      <p className="page-header__subtitle">
        Manage the platform's content and admins.
      </p>

      <div className="course-grid" style={{ marginTop: 'var(--space-4)' }}>
        <Card>
          <h2 className="page-header__title">Courses</h2>
          <p>Create, edit and delete courses and their lessons.</p>
          <Link to="/admin/courses" className="navbar__link" style={{ paddingLeft: 0 }}>
            Manage courses →
          </Link>
        </Card>
        <Card>
          <h2 className="page-header__title">Users</h2>
          <p>See everyone registered on the platform.</p>
          <Link to="/admin/users" className="navbar__link" style={{ paddingLeft: 0 }}>
            Manage users →
          </Link>
        </Card>
        <Card>
          <h2 className="page-header__title">Admins</h2>
          <p>Create another admin account.</p>
          <Link to="/admin/admins/new" className="navbar__link" style={{ paddingLeft: 0 }}>
            Create admin →
          </Link>
        </Card>
      </div>
    </div>
  )
}
