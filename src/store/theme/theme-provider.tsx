import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";

import { ThemeContext, ThemeContextValue } from "./theme-context";

type Theme = ThemeContextValue["theme"];

type ThemeProviderProps = {
  readonly children: ReactNode;
  readonly initialTheme?: Theme;
};

export const ThemeProvider = ({
  children,
  initialTheme = "dark"
}: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(initialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme
    }),
    [theme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

