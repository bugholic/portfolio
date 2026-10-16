import { useEffect, useState } from "react";

export type Theme = "dark" | "light";

const THEME_COLORS: Record<Theme, string> = { dark: "#111215", light: "#f2f3f6" };

const readTheme = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

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

    // Until the visitor picks a theme, keep following the system setting.
    const system = window.matchMedia("(prefers-color-scheme: light)");
    const onSystemChange = () => {
      let saved: string | null = null;
      try {
        saved = localStorage.getItem("theme");
      } catch {
        // Unreadable storage counts as no saved choice.
      }
      if (saved !== "light" && saved !== "dark") applyTheme(system.matches ? "light" : "dark");
    };
    system.addEventListener("change", onSystemChange);

    return () => {
      observer.disconnect();
      system.removeEventListener("change", onSystemChange);
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
