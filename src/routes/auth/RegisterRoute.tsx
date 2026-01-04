import { useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@store/hooks";
import { selectTheme } from "@store/theme/theme-slice";

import { AuthTemplate, RegisterForm, useAuth } from "@features/auth";

export const RegisterRoute = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation("auth");
  const theme = useAppSelector(selectTheme);
  const isDark = theme === "dark";

  useEffect(() => {
    document.title = "Codgoo Ecosystem";
  }, []);

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
  <AuthTemplate
    title={t("register.title")}
    bottomSlot={
      <span className={`text-base md:text-lg text-center transition-colors ${
        isDark ? "text-gray-300" : "text-black"
      }`}>
        {t("register.haveAccount")}{" "}
        <Link
          to="/login"
          className="font-medium text-indigo-500 hover:text-indigo-600 underline"
        >
          {t("register.logIn")}
        </Link>
      </span>
    }
  >
    <RegisterForm />
  </AuthTemplate>
  );
};


