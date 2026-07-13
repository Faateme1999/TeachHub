import { Link } from 'react-router-dom'
import { useUsers } from '../hooks/useUsers'
import { getApiErrorMessage } from '../lib/apiClient'
import { getInitials } from '../lib/format'
import { Card } from '../components/ui/Card'
import { Spinner } from '../components/ui/Spinner'
import { EmptyState, ErrorState } from '../components/ui/States'
import '../components/components.css'

// Lists everyone registered on the platform. Each row links to that user's
// profile page.
//
// NOTE: this page is no longer routed directly — the users list moved into the
// admin section. It's kept as a ready-made starting point: AdminUsersPage
// (pages/admin/AdminUsersPage.tsx) should reuse this layout. Links point at the
// admin path (/admin/users/:id) accordingly.
export function UsersPage() {
  const { data: users, isLoading, isError, error } = useUsers()

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-header__title">People on TeachHub</h1>
          <p className="page-header__subtitle">
            {users ? `${users.length} members` : 'See who is learning here'}
          </p>
        </div>
      </div>

      {isLoading && <Spinner center />}
      {isError && <ErrorState message={getApiErrorMessage(error, 'Could not load users')} />}
      {users && users.length === 0 && <EmptyState icon="👥" title="No users yet" />}

      {users && users.length > 0 && (
        <Card>
          <div className="user-list">
            {users.map((user) => (
              <Link key={user.id} to={`/admin/users/${user.id}`} className="user-row">
                <span className="avatar" aria-hidden="true">
                  {getInitials(user.name)}
                </span>
                <span>
                  <span className="user-row__name">{user.name}</span>
                  <br />
                  <span className="user-row__email">{user.email}</span>
                </span>
              </Link>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
