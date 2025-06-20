"use client";

import { createContext, useContext, useEffect, useState } from "react";

export enum Themes {
  Dark = "dark",
  Light = "light",
  NoPreference = "no-preference",
}

interface ThemeContextType {
  currentTheme: Themes;
  updateTheme: (newTheme: Themes) => void;
  isThemeReady: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTheme, setCurrentTheme] = useState<Themes>(Themes.NoPreference);
  const [isThemeReady, setIsThemeReady] = useState(false);

  useEffect(() => {
    // Only run on client side after hydration
    const initializeTheme = () => {
      try {
        const theme = localStorage.getItem("preferred-theme");
        if (theme === "light" || theme === "dark") {
          document.documentElement.classList.add(`theme-${theme}`);
          document.body.dataset.theme = theme;
          setCurrentTheme(theme as Themes);
        } else {
          const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)",
          ).matches;
          const prefersLight = window.matchMedia(
            "(prefers-color-scheme: light)",
          ).matches;
          if (prefersDark) {
            document.documentElement.classList.add("theme-dark");
            document.body.dataset.theme = "dark";
            setCurrentTheme(Themes.Dark);
          } else if (prefersLight) {
            document.documentElement.classList.add("theme-light");
            document.body.dataset.theme = "light";
            setCurrentTheme(Themes.Light);
          }
        }
      } catch {
        // Fallback to system preference
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches;
        if (prefersDark) {
          document.documentElement.classList.add("theme-dark");
          document.body.dataset.theme = "dark";
          setCurrentTheme(Themes.Dark);
        }
      }

      setIsThemeReady(true);
    };

    initializeTheme();
  }, []);

  const updateTheme = (newTheme: Themes) => {
    localStorage.setItem("preferred-theme", newTheme);
    document.body.dataset.theme = newTheme;

    // Remove existing theme classes
    document.documentElement.classList.remove("theme-light", "theme-dark");

    // Add new theme class
    if (newTheme !== Themes.NoPreference) {
      document.documentElement.classList.add(`theme-${newTheme}`);
    }

    setCurrentTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, updateTheme, isThemeReady }}>
      {children}
    </ThemeContext.Provider>
  );
};
