import type { ReactNode } from "react";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";

import { AppFooter } from "@shared/components/AppFooter";
import { AppHeader } from "@shared/components/AppHeader";
import { ThemeManager } from "@shared/theme";

type AppLayoutProps = {
  readonly children: ReactNode;
};

export const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();

  const { isAuthRoute, isDashboardRoute, containerClass, mainClass } = useMemo(() => {
    const authRoutes = new Set(["/login", "/register"]);
    const auth = authRoutes.has(location.pathname);
    const dashboard = location.pathname.startsWith("/dashboard");

    return {
      isAuthRoute: auth,
      isDashboardRoute: dashboard,
      containerClass: auth
        ? "bg-white text-slate-900"
        : dashboard
          ? "bg-transparent text-white"
          : "bg-slate-950 text-slate-100",
      mainClass: auth
        ? "flex flex-1"
        : dashboard
          ? "flex flex-1"
          : "flex flex-1 items-center justify-center px-4 py-10 sm:px-6 lg:px-8",
    };
  }, [location.pathname]);

  return (
    <ThemeManager>
      <div className={`flex min-h-screen flex-col transition-colors ${containerClass}`}>
        {!isAuthRoute && !isDashboardRoute && <AppHeader />}
        <main className={mainClass}>{children}</main>
        {!isAuthRoute && !isDashboardRoute && <AppFooter />}
      </div>
    </ThemeManager>
  );
};

