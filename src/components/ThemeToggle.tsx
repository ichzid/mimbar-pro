"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="cursor-pointer relative p-2 sm:p-2.5 rounded-xl transition-all duration-300
        bg-white/60 dark:bg-white/5
        border border-brand-200/50 dark:border-brand-700/30
        text-brand-600 dark:text-brand-300
        hover:bg-brand-50 dark:hover:bg-brand-900/20
        hover:border-brand-400 dark:hover:border-brand-500
        focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50
        shadow-sm hover:shadow-md hover:shadow-brand-500/10"
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
      ) : (
        <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
      )}
    </button>
  );
}
