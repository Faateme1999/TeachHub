import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/auth-context'
import { getApiErrorMessage } from '../lib/apiClient'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import '../components/components.css'

// Login page. On submit we call auth.login(); on success we go to /courses,
// on failure (e.g. wrong password) we show the backend's error message inline.
export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email, password)
      navigate('/courses')
    } catch (err) {
      // The backend returns 401 "Invalid email or password" for bad credentials.
      setError(getApiErrorMessage(err, 'Could not log in'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth">
      <h1 className="auth__title">Welcome back</h1>
      <p className="auth__subtitle">Log in to continue learning.</p>
      <Card>
        <form className="form" onSubmit={handleSubmit} noValidate>
          {error && <div className="form__error">{error}</div>}
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          <Button type="submit" block disabled={submitting}>
            {submitting ? 'Logging in…' : 'Log in'}
          </Button>
        </form>
        <p className="auth__switch">
          Don&apos;t have an account? <Link to="/register">Sign up</Link>
        </p>
      </Card>
    </div>
  )
}
