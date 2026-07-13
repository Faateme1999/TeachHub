import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/States'

// Shown for any URL that doesn't match a route (the "*" route in App.tsx).
export function NotFoundPage() {
  return (
    <EmptyState
      icon="🧭"
      title="Page not found"
      message="The page you're looking for doesn't exist."
      action={
        <Link to="/courses">
          <Button>Go to courses</Button>
        </Link>
      }
    />
  )
}
