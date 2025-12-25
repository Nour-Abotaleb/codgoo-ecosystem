import { type FormEvent, useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

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
  const { register, loading, error } = useAuth();
  const formRef = useRef<HTMLFormElement>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

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
        errors.name = "Full name is required";
      }

      if (!email || email.trim() === "") {
        errors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = "Please enter a valid email address";
      }

      if (!phone || phone.trim() === "") {
        errors.phone = "Phone number is required";
      }

      if (!password || password.trim() === "") {
        errors.password = "Password is required";
      }

      if (!password_confirmation || password_confirmation.trim() === "") {
        errors.password_confirmation = "Please confirm your password";
      } else if (password && password !== password_confirmation) {
        errors.password_confirmation = "Passwords do not match";
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
    [register, navigate]
  );

  return (
    <form ref={formRef} className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {typeof error === "string" ? error : "An error occurred"}
        </div>
      )}
      <div className="grid gap-5 grid-cols-1">
        <TextField
          name="name"
          label="Full name"
          placeholder="Full name"
          autoComplete="name"
          required
          error={fieldErrors.name}
        />
        <TextField
          type="email"
          name="email"
          label="Email"
          placeholder="Email"
          autoComplete="email"
          required
          error={fieldErrors.email}
        />
        <PhoneField label="Phone number" name="phone" error={fieldErrors.phone} />
      </div>

      <div className="grid gap-5 grid-cols-1">
        <PasswordField
          name="password"
          label="Password"
          placeholder="Password"
          autoComplete="new-password"
          required
          error={fieldErrors.password}
        />
        <PasswordField
          name="password_confirmation"
          label="Confirm password"
          placeholder="Confirm password"
          autoComplete="new-password"
          required
          error={fieldErrors.password_confirmation}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 inline-flex h-14 items-center cursor-pointer justify-center rounded-[20px] bg-black text-base md:text-xl font-medium text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Creating..." : "Create"}
      </button>

      <SocialProviders
        label="Or sign up with"
        providers={[
          { name: "Google", icon: googleIcon },
          { name: "Facebook", icon: facebookIcon },
          { name: "Apple", icon: appleIcon },
        ]}
      />
    </form>
  );
};


