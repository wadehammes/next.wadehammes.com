import { beforeEach, describe, expect, it } from "@jest/globals";
import { waitFor } from "@testing-library/react";
import { useMediaQuery } from "src/hooks/useMediaQuery";
import {
  mockMatchMediaQueries,
  mockMatchMediaWithChangeListener,
} from "src/tests/mocks/mockMatchMedia";
import { renderHook } from "test-utils";

describe("useMediaQuery", () => {
  beforeEach(() => {
    mockMatchMediaQueries({});
  });

  it("returns true when the query matches", async () => {
    mockMatchMediaQueries({ "(min-width: 72rem)": true });

    const { result } = renderHook(() => useMediaQuery("(min-width: 72rem)"));

    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });

  it("updates when the media query changes", async () => {
    const mediaQuery = mockMatchMediaWithChangeListener(false);

    const { result } = renderHook(() => useMediaQuery("(min-width: 72rem)"));

    mediaQuery.triggerChange(true);

    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });
});
