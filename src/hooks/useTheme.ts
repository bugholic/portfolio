import { useEffect, useState } from "react";

export type Theme = "dark" | "light";

const THEME_COLORS: Record<Theme, string> = { dark: "#08113a", light: "#ffffff" };

// White is the default; dark only when the visitor picked it.
const readTheme = (): Theme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");

const applyTheme = (theme: Theme) => {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLORS[theme]);
};

/** Current theme from <html data-theme>, kept in sync across every component that uses it. */
export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(readTheme);

  useEffect(() => {
    const observer = new MutationObserver(() => setThemeState(readTheme()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    return () => {
      observer.disconnect();
    };
  }, []);

  const setTheme = (next: Theme) => {
    applyTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // Storage can be unavailable (private mode); the theme still applies for this visit.
    }
  };

  return { theme, setTheme, toggle: () => setTheme(theme === "dark" ? "light" : "dark") };
}
