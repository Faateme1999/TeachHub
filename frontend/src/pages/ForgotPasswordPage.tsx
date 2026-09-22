import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { apiClient, getApiErrorMessage } from "../lib/apiClient";
import "../components/components.css";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setError("");
    setMessage("");
    setSubmitting(true);

    try {
      const response = await apiClient.post("/auth/forgot-password", {
        email,
      });

      setMessage(response.data.message);
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not send password reset email"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth">
      <h1 className="auth__title">Forgot your password?</h1>

      <p className="auth__subtitle">
        Enter your email and we&apos;ll send you a password reset link.
      </p>

      <Card>
        <form className="form" onSubmit={handleSubmit} noValidate>
          {error && <div className="form__error">{error}</div>}

          {message && (
            <div className="password-reset-success">
              <div className="password-reset-success__icon">✓</div>

              <div>
                <strong>Check your inbox</strong>
                <p>{message}</p>
              </div>
            </div>
          )}

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <Button type="submit" block disabled={submitting}>
            {submitting ? "Sending…" : "Send reset link"}
          </Button>
        </form>

        <p className="auth__switch">
          Remember your password? <Link to="/login">Log in</Link>
        </p>
      </Card>
    </div>
  );
}
