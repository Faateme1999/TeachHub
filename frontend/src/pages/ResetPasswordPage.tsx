import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { apiClient, getApiErrorMessage } from "../lib/apiClient";
import "../components/components.css";

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setError("");

    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      await apiClient.post("/auth/reset-password", {
        token,
        password,
      });

      setSuccess(true);
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not reset your password"));
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="auth">
        <h1 className="auth__title">Password reset successful</h1>

        <p className="auth__subtitle">
          Your password has been changed successfully.
        </p>

        <Card>
          <Button type="button" block onClick={() => navigate("/login")}>
            Go to login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="auth">
      <h1 className="auth__title">Reset your password</h1>

      <p className="auth__subtitle">Enter your new password below.</p>

      <Card>
        <form className="form" onSubmit={handleSubmit} noValidate>
          {error && <div className="form__error">{error}</div>}

          <Input
            label="New password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
          />

          <Input
            label="Confirm new password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
          />

          <Button type="submit" block disabled={submitting}>
            {submitting ? "Resetting…" : "Reset password"}
          </Button>
        </form>

        <p className="auth__switch">
          Remember your password? <Link to="/login">Log in</Link>
        </p>
      </Card>
    </div>
  );
}
