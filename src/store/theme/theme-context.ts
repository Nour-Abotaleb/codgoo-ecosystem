import { createContext } from "react";

type Theme = "light" | "dark";

export type ThemeContextValue = {
  readonly theme: Theme;
  readonly toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

