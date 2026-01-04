import type { ReactNode } from "react";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";

import { ThemeManager } from "@shared/theme";

type AppLayoutProps = {
  readonly children: ReactNode;
};

export const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();

  const { containerClass, mainClass } = useMemo(() => {
    const authRoutes = new Set(["/login", "/register"]);
    const auth = authRoutes.has(location.pathname);
    const dashboard = location.pathname.startsWith("/dashboard");

    return {
      containerClass: auth
        ? "bg-white text-slate-900"
        : dashboard
          ? "bg-transparent text-white"
          : "bg-slate-950 text-slate-100",
      mainClass: auth
        ? "flex flex-1"
        : dashboard
          ? "flex flex-1"
          : " ",
    };
  }, [location.pathname]);

  return (
    <ThemeManager>
      <div className={`flex min-h-screen flex-col transition-colors ${containerClass}`}>
        <main className={mainClass}>{children}</main>
      </div>
    </ThemeManager>
  );
};

