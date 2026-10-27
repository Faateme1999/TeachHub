import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateTeacher } from "../../hooks/useUsers";
import { getApiErrorMessage } from "../../lib/apiClient";
import { useToast } from "../../components/ui/toast-context";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import "../../components/components.css";

export function CreateTeacherPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const createTeacher = useCreateTeacher();

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

    createTeacher.mutate(
      {
        name: name.trim(),
        email: email.trim(),
        password,
      },
      {
        onSuccess: () => {
          showToast("Teacher created successfully", "success");
          navigate("/admin/users");
        },

        onError: (err) => {
          setServerError(getApiErrorMessage(err, "Could not create teacher"));
        },
      },
    );
  }

  return (
    <div className="auth">
      <h1 className="auth__title">Create teacher</h1>

      <p className="auth__subtitle">Create a teacher account for TeachHub.</p>

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

          <Button type="submit" block disabled={createTeacher.isPending}>
            {createTeacher.isPending ? "Creating teacher…" : "Create teacher"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
