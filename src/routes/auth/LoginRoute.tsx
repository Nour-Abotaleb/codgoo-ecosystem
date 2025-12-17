import { useEffect } from "react";
import { Link, Navigate } from "react-router-dom";

import { AuthTemplate, LoginForm, useAuth } from "@features/auth";

export const LoginRoute = () => {
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
    title="Welcome Back to Codgoo"
    bottomSlot={
      <span className="text-base md:text-lg text-black text-center">
        You do not have an account?{" "}
        <Link
          to="/register"
          className="font-medium text-[color:var(--color-link)] hover:text-indigo-500 underline"
        >
          Register now
        </Link>
      </span>
    }
  >
    <LoginForm />
  </AuthTemplate>
  );
};


