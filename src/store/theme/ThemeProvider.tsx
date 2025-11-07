import { useEffect } from "react";
import type { ReactNode } from "react";

import { useAppSelector } from "../hooks";
import { selectTheme } from "./theme-slice";

type ThemeProviderProps = {
  readonly children: ReactNode;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const theme = useAppSelector(selectTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return <>{children}</>;
};

