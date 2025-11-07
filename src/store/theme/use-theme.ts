import { useCallback } from "react";

import { useAppDispatch, useAppSelector } from "../hooks";
import { selectTheme, setTheme, toggleTheme } from "./theme-slice";

export const useTheme = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);

  const handleToggle = useCallback(() => {
    dispatch(toggleTheme());
  }, [dispatch]);

  const handleSetTheme = useCallback(
    (value: "light" | "dark") => {
      dispatch(setTheme(value));
    },
    [dispatch]
  );

  return {
    theme,
    toggleTheme: handleToggle,
    setTheme: handleSetTheme
  };
};

