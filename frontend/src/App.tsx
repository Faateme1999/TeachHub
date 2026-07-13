import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { AdminLayout } from './components/layout/AdminLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { PublicOnlyRoute } from './components/PublicOnlyRoute'
import { AdminRoute } from './components/AdminRoute'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { CoursesPage } from './pages/CoursesPage'
import { CourseDetailPage } from './pages/CourseDetailPage'
import { CreateCoursePage } from './pages/CreateCoursePage'
import { EditCoursePage } from './pages/EditCoursePage'
import { UserProfilePage } from './pages/UserProfilePage'
import { MyProfilePage } from './pages/MyProfilePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { AdminCoursesPage } from './pages/admin/AdminCoursesPage'
import { AdminUsersPage } from './pages/admin/AdminUsersPage'
import { CreateAdminPage } from './pages/admin/CreateAdminPage'

// This is the "route table" — it maps URLs to pages.
// Everything renders inside <Layout /> (navbar + footer). Pages that need a
// login are wrapped in <ProtectedRoute>; login/register are wrapped in
// <PublicOnlyRoute> so logged-in users don't see them.
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Home → the course catalog */}
        <Route index element={<Navigate to="/courses" replace />} />

        {/* Public pages */}
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />

        {/* Auth pages (only when logged OUT) */}
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <RegisterPage />
            </PublicOnlyRoute>
          }
        />

        {/* Admin-only course management. These used to be open to any logged-in
            user; now they're wrapped in <AdminRoute> (students get redirected).
            The full admin workspace lives under /admin below. */}
        <Route
          path="/courses/new"
          element={
            <AdminRoute>
              <CreateCoursePage />
            </AdminRoute>
          }
        />
        <Route
          path="/courses/:id/edit"
          element={
            <AdminRoute>
              <EditCoursePage />
            </AdminRoute>
          }
        />

        {/* Protected pages (any logged-in user) */}
        <Route
          path="/me"
          element={
            <ProtectedRoute>
              <MyProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Anything else → 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Separate ADMIN section — its own AdminLayout (sidebar), every child
          behind <AdminRoute> so only admins get in. The Users list moved here. */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route
          index
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />
        <Route
          path="courses"
          element={
            <AdminRoute>
              <AdminCoursesPage />
            </AdminRoute>
          }
        />
        <Route
          path="users"
          element={
            <AdminRoute>
              <AdminUsersPage />
            </AdminRoute>
          }
        />
        {/* Viewing a specific user's profile — kept admin-only, inside the section. */}
        <Route
          path="users/:id"
          element={
            <AdminRoute>
              <UserProfilePage />
            </AdminRoute>
          }
        />
        <Route
          path="admins/new"
          element={
            <AdminRoute>
              <CreateAdminPage />
            </AdminRoute>
          }
        />
      </Route>
    </Routes>
  )
}

export default App
