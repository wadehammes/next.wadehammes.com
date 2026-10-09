import { useEffect, useSyncExternalStore } from "react";
import { isBrowser } from "src/helpers/helpers";

const THEME_STORAGE_VAR = "preferred-theme";

export enum Themes {
  Dark = "dark",
  Light = "light",
  NoPreference = "no-preference",
}

interface UsePreferredTheme {
  currentTheme: Themes;
  updateTheme: (newTheme: Themes) => void;
}

const themeListeners = new Set<() => void>();

const emitThemeChange = () => {
  for (const listener of themeListeners) {
    listener();
  }
};

const readTheme = (): Themes => {
  if (!isBrowser()) {
    return Themes.NoPreference;
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_VAR);
  if (stored) {
    return stored as Themes;
  }

  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return Themes.Dark;
  }

  if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    return Themes.Light;
  }

  return Themes.NoPreference;
};

const subscribe = (onStoreChange: () => void) => {
  if (!isBrowser()) {
    return () => {};
  }

  themeListeners.add(onStoreChange);

  const onStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_VAR) {
      onStoreChange();
    }
  };

  const darkMedia = window.matchMedia("(prefers-color-scheme: dark)");
  const lightMedia = window.matchMedia("(prefers-color-scheme: light)");

  const onSystemThemeChange = () => {
    if (!window.localStorage.getItem(THEME_STORAGE_VAR)) {
      onStoreChange();
    }
  };

  window.addEventListener("storage", onStorage);
  darkMedia.addEventListener("change", onSystemThemeChange);
  lightMedia.addEventListener("change", onSystemThemeChange);

  return () => {
    themeListeners.delete(onStoreChange);
    window.removeEventListener("storage", onStorage);
    darkMedia.removeEventListener("change", onSystemThemeChange);
    lightMedia.removeEventListener("change", onSystemThemeChange);
  };
};

const getServerSnapshot = () => Themes.NoPreference;

export const usePreferredTheme = (): UsePreferredTheme => {
  const currentTheme = useSyncExternalStore(
    subscribe,
    readTheme,
    getServerSnapshot,
  );

  useEffect(() => {
    if (!isBrowser()) {
      return;
    }

    if (currentTheme === Themes.NoPreference) {
      delete document.body.dataset.theme;
      return;
    }

    document.body.dataset.theme = currentTheme;
  }, [currentTheme]);

  const updateTheme = (newTheme: Themes) => {
    window.localStorage.setItem(THEME_STORAGE_VAR, newTheme);
    document.body.dataset.theme = newTheme;
    emitThemeChange();
  };

  return { currentTheme, updateTheme };
};
