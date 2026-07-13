import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/auth-context'
import { getApiErrorMessage } from '../lib/apiClient'
import { useToast } from '../components/ui/toast-context'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import '../components/components.css'

// Register page. auth.register() does two things: creates the account, then
// auto-logs-in to get a token. We handle a tricky edge case: if the account is
// created but the follow-up login fails, we send the user to /login with a
// helpful message instead of a confusing error (retrying register would say
// "Email already exists").
export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({})
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function validate(): boolean {
    const next: typeof errors = {}
    if (!name.trim()) next.name = 'Name is required'
    if (!email.trim()) next.email = 'Email is required'
    if (password.length < 6) next.password = 'Password must be at least 6 characters'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setServerError('')
    if (!validate()) return

    setSubmitting(true)
    try {
      await register(name.trim(), email.trim(), password)
      showToast('Welcome to TeachHub! 🎉', 'success')
      navigate('/courses')
    } catch (err) {
      // Figure out WHICH step failed by looking at the request URL on the error.
      const failedUrl = axios.isAxiosError(err) ? err.config?.url ?? '' : ''
      if (failedUrl.includes('/auth/login')) {
        // Register succeeded but auto-login failed → the account exists.
        showToast('Account created — please sign in.', 'success')
        navigate('/login')
      } else {
        // Register itself failed (e.g. email already exists, validation).
        setServerError(getApiErrorMessage(err, 'Could not create account'))
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth">
      <h1 className="auth__title">Create your account</h1>
      <p className="auth__subtitle">Join TeachHub and start learning today.</p>
      <Card>
        <form className="form" onSubmit={handleSubmit} noValidate>
          {serverError && <div className="form__error">{serverError}</div>}
          <Input
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            autoComplete="name"
          />
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            hint="At least 6 characters"
            autoComplete="new-password"
          />
          <Button type="submit" block disabled={submitting}>
            {submitting ? 'Creating account…' : 'Sign up'}
          </Button>
        </form>
        <p className="auth__switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </Card>
    </div>
  )
}
