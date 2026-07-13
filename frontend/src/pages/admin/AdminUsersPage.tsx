import { UsersPage } from '../UsersPage'

// Admin user management. Reached at /admin/users.
//
// For now this reuses the existing UsersPage (a plain list of everyone). It works
// today because useUsers() already returns every user.
//
// TODO(junior) — US-038 (manage users): enhance this. Each user now has a `role`
// ('STUDENT' | 'ADMIN'), so show a role badge per row, and (optionally) let an
// admin see who the other admins are. Either extend UsersPage or build a richer
// table here. The data hook is useUsers() (hooks/useUsers.ts).
export function AdminUsersPage() {
  return <UsersPage />
}
