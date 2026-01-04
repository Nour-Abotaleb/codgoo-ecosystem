import { type FormEvent, useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@store/hooks";
import { selectTheme } from "@store/theme/theme-slice";

import { useAuth } from "../hooks/useAuth";
import { PasswordField } from "./components/PasswordField.tsx";
import { TextField } from "./components/TextField.tsx";

type FieldErrors = {
  email?: string;
  password?: string;
};

export const LoginForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("auth");
  const { login, loading, error } = useAuth();
  const formRef = useRef<HTMLFormElement>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const theme = useAppSelector(selectTheme);
  const isDark = theme === "dark";

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
        errors.email = t("login.errors.emailRequired");
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = t("login.errors.emailInvalid");
      }

      if (!password || password.trim() === "") {
        errors.password = t("login.errors.passwordRequired");
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
    [login, navigate, t]
  );

  return (
    <form ref={formRef} className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {typeof error === "string" ? error : t("login.errors.loginFailed")}
        </div>
      )}
      <TextField
        name="email"
        type="email"
        label={t("login.email")}
        placeholder={t("login.emailPlaceholder")}
        autoComplete="email"
        autoFocus
        required
        error={fieldErrors.email}
      />
      <PasswordField
        name="password"
        label={t("login.password")}
        placeholder={t("login.passwordPlaceholder")}
        autoComplete="current-password"
        required
        error={fieldErrors.password}
      />

      <button
        type="submit"
        disabled={loading}
        className={`mt-2 inline-flex h-14 items-center justify-center cursor-pointer rounded-[20px] text-base md:text-xl font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
          isDark 
            ? "bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:outline-indigo-500" 
            : "bg-black text-white hover:bg-gray-800 focus-visible:outline-slate-900"
        }`}
      >
        {loading ? t("login.loggingIn") : t("login.loginButton")}
      </button>
    </form>
  );
};


