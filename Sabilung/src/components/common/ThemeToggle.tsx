import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className="rounded-full border border-slate-200/60 bg-white/70 p-2 text-slate-700 shadow-sm transition hover:scale-105 hover:border-brand-300 hover:text-brand-600 dark:border-white/20 dark:bg-white/10 dark:text-white"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
};
