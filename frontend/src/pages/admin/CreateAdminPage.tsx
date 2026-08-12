import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateAdmin } from "../../hooks/useUsers";
import { getApiErrorMessage } from "../../lib/apiClient";
import { useToast } from "../../components/ui/toast-context";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import "../../components/components.css";
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
  const navigate = useNavigate();
  const { showToast } = useToast();
  const createAdmin = useCreateAdmin();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  const [serverError, setServerError] = useState("");

  function validate(): boolean {
    const next: typeof errors = {};

    if (!name.trim()) {
      next.name = "Name is required";
    }

    if (!email.trim()) {
      next.email = "Email is required";
    }

    if (password.length < 6) {
      next.password = "Password must be at least 6 characters";
    }

    setErrors(next);

    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setServerError("");

    if (!validate()) {
      return;
    }

    createAdmin.mutate(
      {
        name: name.trim(),
        email: email.trim(),
        password,
      },
      {
        onSuccess: () => {
          showToast("Admin created successfully", "success");
          navigate("/admin/users");
        },

        onError: (err) => {
          setServerError(getApiErrorMessage(err, "Could not create admin"));
        },
      },
    );
  }

  return (
    <div className="auth">
      <h1 className="auth__title">Create admin</h1>

      <p className="auth__subtitle">
        Create another administrator for TeachHub.
      </p>

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

          <Button type="submit" block disabled={createAdmin.isPending}>
            {createAdmin.isPending ? "Creating admin…" : "Create admin"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
