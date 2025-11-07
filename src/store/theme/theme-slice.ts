import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

type Theme = "light" | "dark";

type ThemeState = {
  readonly current: Theme;
};

const initialState: ThemeState = {
  current: "dark"
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme(state) {
      state.current = state.current === "dark" ? "light" : "dark";
    },
    setTheme(state, action: { payload: Theme }) {
      state.current = action.payload;
    }
  }
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export const themeReducer = themeSlice.reducer;

export const selectTheme = (state: RootState) => state.theme.current;

