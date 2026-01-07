import { useTheme } from "@store";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex flex-wrap items-center gap-2 rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-200 transition hover:border-indigo-400 hover:text-indigo-200"
    >
      <span>{theme === "dark" ? "🌙" : "☀️"}</span>
      <span>{theme}</span>
    </button>
  );
};

