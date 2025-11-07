import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";

export const AppHeader = () => {
  const { t } = useTranslation("common");

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4 sm:px-6">
        <NavLink to="/" className="text-lg font-semibold text-indigo-200">
          {t("app.title")}
        </NavLink>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-300 sm:flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              [
                "transition hover:text-indigo-200",
                isActive ? "text-indigo-300" : undefined
              ]
                .filter(Boolean)
                .join(" ")
            }
          >
            {t("navigation.home")}
          </NavLink>
          <a
            href="https://vitejs.dev/guide/"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-indigo-200"
          >
            {t("navigation.docs")}
          </a>
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};

