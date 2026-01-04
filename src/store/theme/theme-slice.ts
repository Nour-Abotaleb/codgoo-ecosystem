import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

type Theme = "light" | "dark";

type ThemeState = {
  readonly current: Theme;
};

const THEME_STORAGE_KEY = "theme";

// Load theme from localStorage or default to dark
const getInitialTheme = (): Theme => {
  try {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === "light" || storedTheme === "dark") {
      return storedTheme;
    }
  } catch (error) {
    console.error("Failed to load theme from localStorage:", error);
  }
  return "dark"; // Default theme
};

const initialState: ThemeState = {
  current: getInitialTheme()
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme(state) {
      state.current = state.current === "dark" ? "light" : "dark";
      // Save to localStorage
      try {
        localStorage.setItem(THEME_STORAGE_KEY, state.current);
      } catch (error) {
        console.error("Failed to save theme to localStorage:", error);
      }
    },
    setTheme(state, action: { payload: Theme }) {
      state.current = action.payload;
      // Save to localStorage
      try {
        localStorage.setItem(THEME_STORAGE_KEY, action.payload);
      } catch (error) {
        console.error("Failed to save theme to localStorage:", error);
      }
    }
  }
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export const themeReducer = themeSlice.reducer;

export const selectTheme = (state: RootState) => state.theme.current;

