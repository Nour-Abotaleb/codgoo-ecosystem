import { useEffect } from "react";
import { Link, Navigate } from "react-router-dom";

import { AuthTemplate, RegisterForm, useAuth } from "@features/auth";

export const RegisterRoute = () => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    document.title = "Codgoo Ecosystem";
  }, []);

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

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


