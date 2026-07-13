import { EmptyState } from '../../components/ui/States'

// Create-another-admin form. Reached at /admin/admins/new.
//
// TODO(junior) — US-039 (create admin): build a form (name / email / password),
// then submit it with the useCreateAdmin() mutation (hooks/useUsers.ts), which
// POSTs to /auth/admins. You can copy the form markup from RegisterPage.tsx.
// On success, show a toast (useToast) and navigate to /admin/users.
//
// Error handling note: the backend returns 403 if a non-admin somehow reaches
// the endpoint, and 400 if the email already exists. Surface the message with
// getApiErrorMessage(err) like the other pages do. (The axios interceptor only
// auto-redirects on 401, so 400/403 will flow to your onError handler.)
export function CreateAdminPage() {
  return (
    <div>
      <h1 className="page-header__title">Create admin</h1>
      <EmptyState
        icon="➕"
        title="Create-admin form — TODO(junior)"
        message="Build the name/email/password form and submit with useCreateAdmin(). See the TODO comment in CreateAdminPage.tsx."
      />
    </div>
  )
}
