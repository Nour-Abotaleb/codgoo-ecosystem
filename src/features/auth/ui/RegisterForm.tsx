import { type FormEvent, useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@store/hooks";
import { selectTheme } from "@store/theme/theme-slice";

import appleIcon from "@assets/images/apple.svg";
import facebookIcon from "@assets/images/facebook.svg";
import googleIcon from "@assets/images/google.svg";

import { useAuth } from "../hooks/useAuth";
import { PasswordField } from "./components/PasswordField.tsx";
import { PhoneField } from "./components/PhoneField.tsx";
import { SocialProviders } from "./components/SocialProviders.tsx";
import { TextField } from "./components/TextField.tsx";

type FieldErrors = {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  password_confirmation?: string;
};

export const RegisterForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("auth");
  const { register, loading, error } = useAuth();
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
      const name = formData.get("name") as string;
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const password_confirmation = formData.get("password_confirmation") as string;
      // Get the full phone number (with dial code) from the hidden input
      const phone = (formData.get("phone_full") as string) || (formData.get("phone") as string);

      const errors: FieldErrors = {};

      if (!name || name.trim() === "") {
        errors.name = t("register.errors.nameRequired");
      }

      if (!email || email.trim() === "") {
        errors.email = t("register.errors.emailRequired");
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = t("register.errors.emailInvalid");
      }

      if (!phone || phone.trim() === "") {
        errors.phone = t("register.errors.phoneRequired");
      }

      if (!password || password.trim() === "") {
        errors.password = t("register.errors.passwordRequired");
      }

      if (!password_confirmation || password_confirmation.trim() === "") {
        errors.password_confirmation = t("register.errors.confirmPasswordRequired");
      } else if (password && password !== password_confirmation) {
        errors.password_confirmation = t("register.errors.passwordMismatch");
      }

      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }

      try {
        await register({
          username: name, // Map name field to username for API
          email,
          password,
          password_confirmation,
          phone,
        });
        navigate("/dashboard");
      } catch {
        // Error is handled by the error state from useAuth
      }
    },
    [register, navigate, t]
  );

  return (
    <form ref={formRef} className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {typeof error === "string" ? error : t("register.errors.registerFailed")}
        </div>
      )}
      <div className="grid gap-5 grid-cols-1">
        <TextField
          name="name"
          label={t("register.fullName")}
          placeholder={t("register.fullNamePlaceholder")}
          autoComplete="name"
          required
          error={fieldErrors.name}
        />
        <TextField
          type="email"
          name="email"
          label={t("register.email")}
          placeholder={t("register.emailPlaceholder")}
          autoComplete="email"
          required
          error={fieldErrors.email}
        />
        <PhoneField label={t("register.phone")} name="phone" error={fieldErrors.phone} />
      </div>

      <div className="grid gap-5 grid-cols-1">
        <PasswordField
          name="password"
          label={t("register.password")}
          placeholder={t("register.passwordPlaceholder")}
          autoComplete="new-password"
          required
          error={fieldErrors.password}
        />
        <PasswordField
          name="password_confirmation"
          label={t("register.confirmPassword")}
          placeholder={t("register.confirmPasswordPlaceholder")}
          autoComplete="new-password"
          required
          error={fieldErrors.password_confirmation}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`mt-2 inline-flex h-14 items-center cursor-pointer justify-center rounded-[20px] text-base md:text-xl font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
          isDark 
            ? "bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:outline-indigo-500" 
            : "bg-black text-white hover:bg-gray-800 focus-visible:outline-slate-900"
        }`}
      >
        {loading ? t("register.creating") : t("register.createButton")}
      </button>

      <SocialProviders
        label={t("register.orSignUpWith")}
        providers={[
          { name: "Google", icon: googleIcon },
          { name: "Facebook", icon: facebookIcon },
          { name: "Apple", icon: appleIcon },
        ]}
      />
    </form>
  );
};


