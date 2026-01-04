import { useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@store/hooks";
import { selectTheme } from "@store/theme/theme-slice";

import { AuthTemplate, LoginForm, useAuth } from "@features/auth";

export const LoginRoute = () => {
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
    title={t("login.title")}
    bottomSlot={
      <span className={`text-base md:text-lg text-center transition-colors ${
        isDark ? "text-gray-300" : "text-black"
      }`}>
        {t("login.noAccount")}{" "}
        <Link
          to="/register"
          className="font-medium text-indigo-500 hover:text-indigo-600 underline"
        >
          {t("login.registerNow")}
        </Link>
      </span>
    }
  >
    <LoginForm />
  </AuthTemplate>
  );
};


