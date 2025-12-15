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

export const RegisterForm = () => {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();
  const formRef = useRef<HTMLFormElement>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setSubmitError(null);

      if (!formRef.current) return;

      const formData = new FormData(formRef.current);
      const name = formData.get("name") as string;
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const password_confirmation = formData.get("password_confirmation") as string;
      // Get the full phone number (with dial code) from the hidden input
      const phone = (formData.get("phone_full") as string) || (formData.get("phone") as string);

      if (!name || !email || !password || !password_confirmation || !phone) {
        setSubmitError("All fields are required");
        return;
      }

      if (password !== password_confirmation) {
        setSubmitError("Passwords do not match");
        return;
      }

      try {
        await register({
          name,
          email,
          password,
          password_confirmation,
          phone,
        });
        navigate("/dashboard");
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Registration failed";
        setSubmitError(errorMessage);
      }
    },
    [register, navigate]
  );

  return (
    <form ref={formRef} className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
      {submitError && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {submitError}
        </div>
      )}
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
        />
        <TextField
          type="email"
          name="email"
          label="Email"
          placeholder="Email"
          autoComplete="email"
          required
        />
        <PhoneField label="Phone number" name="phone" />
      </div>

      <div className="grid gap-5 grid-cols-1">
        <PasswordField
          name="password"
          label="Password"
          placeholder="Password"
          autoComplete="new-password"
          required
        />
        <PasswordField
          name="password_confirmation"
          label="Confirm password"
          placeholder="Confirm password"
          autoComplete="new-password"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 inline-flex h-14 items-center cursor-pointer justify-center rounded-[32px] bg-black text-base md:text-xl font-medium text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
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


