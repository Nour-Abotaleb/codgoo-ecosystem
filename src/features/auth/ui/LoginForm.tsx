import { type FormEvent, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { PasswordField } from "./components/PasswordField.tsx";
import { TextField } from "./components/TextField.tsx";

export const LoginForm = () => {
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      navigate("/dashboard");
    },
    [navigate]
  );

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
      <TextField
        name="loginEmail"
        type="email"
        label="Email"
        placeholder="Email"
        autoComplete="email"
        autoFocus
      />
      <PasswordField
        name="loginPassword"
        label="Password"
        placeholder="Password"
        autoComplete="current-password"
      />

      <button
        type="submit"
        className="mt-2 inline-flex h-14 md:h-17 items-center justify-center cursor-pointer rounded-[32px] bg-black text-base md:text-xl font-medium text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
      >
        Login
      </button>
    </form>
  );
};


