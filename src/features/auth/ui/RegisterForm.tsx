import { useState } from "react";

import appleIcon from "@assets/images/apple.svg";
import facebookIcon from "@assets/images/facebook.svg";
import googleIcon from "@assets/images/google.svg";

import { PasswordField } from "./components/PasswordField.tsx";
import { PhoneField } from "./components/PhoneField.tsx";
import { SocialProviders } from "./components/SocialProviders.tsx";
import { TextField } from "./components/TextField.tsx";

export const RegisterForm = () => {
  const [rememberMe, setRememberMe] = useState(true);

  return (
    <form className="flex flex-col gap-5" noValidate>
      <div className="grid gap-5 grid-cols-1">
        <TextField
          name="username"
          label="User name"
          placeholder="User name"
          autoComplete="name"
        />
        <TextField
          type="email"
          name="email"
          label="Email"
          placeholder="Email"
          autoComplete="email"
        />
      </div>

      <TextField
        name="company"
        label="Enter Legal Name of Company"
        placeholder="Enter Legal Name of Company"
        autoComplete="organization"
      />

      <PhoneField label="Phone number" />

      <div className="grid gap-5 grid-cols-1">
        <PasswordField
          name="password"
          label="Password"
          placeholder="Password"
          autoComplete="new-password"
        />
        <PasswordField
          name="confirmPassword"
          label="Confirm password"
          placeholder="Confirm password"
          autoComplete="new-password"
        />
      </div>

      <label className="mt-2 flex items-center gap-3 text-sm text-[#6B6B6B]">
        <span className="relative inline-flex">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={() => setRememberMe((prev) => !prev)}
            className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-black/60 bg-white transition focus:outline-none focus:ring-2 focus:ring-black/20 checked:border-black checked:bg-black"
          />
          <span className="pointer-events-none absolute inset-0 grid place-items-center text-xs font-bold text-white opacity-0 transition peer-checked:opacity-100">
            ✔
          </span>
        </span>
        Remember me
      </label>

      <button
        type="submit"
        className="mt-2 inline-flex h-14 md:h-17 items-center cursor-pointer justify-center rounded-[32px] bg-black text-base md:text-xl font-medium text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
        Create
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


