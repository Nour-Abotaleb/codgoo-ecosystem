import { type FormEvent, useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { PasswordField } from "./components/PasswordField.tsx";
import { TextField } from "./components/TextField.tsx";

type FieldErrors = {
  email?: string;
  password?: string;
};

export const LoginForm = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const formRef = useRef<HTMLFormElement>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setFieldErrors({});

      if (!formRef.current) return;

      const formData = new FormData(formRef.current);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      const errors: FieldErrors = {};

      if (!email || email.trim() === "") {
        errors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = "Please enter a valid email address";
      }

      if (!password || password.trim() === "") {
        errors.password = "Password is required";
      }

      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }

      try {
        await login({
          email,
          password,
        });
        navigate("/dashboard");
      } catch {
        // Error is handled by the error state from useAuth
      }
    },
    [login, navigate]
  );

  return (
    <form ref={formRef} className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {typeof error === "string" ? error : "An error occurred"}
        </div>
      )}
      <TextField
        name="email"
        type="email"
        label="Email"
        placeholder="Email"
        autoComplete="email"
        autoFocus
        required
        error={fieldErrors.email}
      />
      <PasswordField
        name="password"
        label="Password"
        placeholder="Password"
        autoComplete="current-password"
        required
        error={fieldErrors.password}
      />

      <button
        type="submit"
        disabled={loading}
        className="mt-2 inline-flex h-14 items-center justify-center cursor-pointer rounded-[32px] bg-black text-base md:text-xl font-medium text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};


