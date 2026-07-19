import { beforeEach, describe, expect, it } from "@jest/globals";
import { act, waitFor } from "@testing-library/react";
import { Themes, usePreferredTheme } from "src/hooks/usePreferredTheme";
import { mockMatchMediaQueries } from "src/tests/mocks/mockMatchMedia";
import { renderHook } from "test-utils";

const THEME_STORAGE_VAR = "preferred-theme";

describe("usePreferredTheme", () => {
  beforeEach(() => {
    window.localStorage.clear();
    delete document.body.dataset.theme;
    mockMatchMediaQueries({});
  });

  it("initializes from a dark system preference", () => {
    mockMatchMediaQueries({ "(prefers-color-scheme: dark)": true });

    const { result } = renderHook(() => usePreferredTheme());

    expect(result.current.currentTheme).toBe(Themes.Dark);
  });

  it("applies a stored theme from localStorage on mount", async () => {
    window.localStorage.setItem(THEME_STORAGE_VAR, Themes.Light);

    const { result } = renderHook(() => usePreferredTheme());

    await waitFor(() => {
      expect(result.current.currentTheme).toBe(Themes.Light);
    });
    expect(document.body.dataset.theme).toBe(Themes.Light);
  });

  it("persists theme updates to localStorage and body dataset", () => {
    const { result } = renderHook(() => usePreferredTheme());

    act(() => {
      result.current.updateTheme(Themes.Dark);
    });

    expect(result.current.currentTheme).toBe(Themes.Dark);
    expect(window.localStorage.getItem(THEME_STORAGE_VAR)).toBe(Themes.Dark);
    expect(document.body.dataset.theme).toBe(Themes.Dark);
  });
});
