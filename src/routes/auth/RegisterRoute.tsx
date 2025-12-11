import { useEffect } from "react";
import { Link } from "react-router-dom";

import { AuthTemplate, RegisterForm } from "@features/auth";

export const RegisterRoute = () => {
  useEffect(() => {
    document.title = "Codgoo Ecosystem";
  }, []);

  return (
  <AuthTemplate
    title="Create an account"
    bottomSlot={
      <span className="text-base md:text-lg text-black text-center">
        You already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-[color:var(--color-link)] hover:text-indigo-500 underline"
        >
          Log in
        </Link>
      </span>
    }
  >
    <RegisterForm />
  </AuthTemplate>
  );
};


