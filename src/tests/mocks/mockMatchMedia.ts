export function setupMockMatchMedia() {
  mockMatchMediaQueries({});
}

export function mockMatchMediaQueries(matchesByQuery: Record<string, boolean>) {
  Object.defineProperty(window, "matchMedia", {
    value: jest.fn().mockImplementation((query: string) => ({
      addEventListener: jest.fn(),
      addListener: jest.fn(),
      dispatchEvent: jest.fn(),
      matches: matchesByQuery[query] ?? false,
      media: query,
      onchange: null,
      removeEventListener: jest.fn(),
      removeListener: jest.fn(),
    })),
    writable: true,
  });
}

export interface MockMatchMediaController {
  triggerChange: (matches: boolean) => void;
}

/** matchMedia stub whose `matches` value can change after mount (for hook specs). */
export function mockMatchMediaWithChangeListener(
  initialMatches = false,
): MockMatchMediaController {
  let mediaQueryMatches = initialMatches;
  let changeHandler: ((event: MediaQueryListEvent) => void) | undefined;

  Object.defineProperty(window, "matchMedia", {
    value: jest.fn().mockImplementation((query: string) => ({
      addEventListener: jest.fn(
        (_event: string, handler: (event: MediaQueryListEvent) => void) => {
          changeHandler = handler;
        },
      ),
      addListener: jest.fn(),
      dispatchEvent: jest.fn(),
      get matches() {
        return mediaQueryMatches;
      },
      media: query,
      onchange: null,
      removeEventListener: jest.fn(),
      removeListener: jest.fn(),
    })),
    writable: true,
  });

  return {
    triggerChange: (matches: boolean) => {
      mediaQueryMatches = matches;
      queueMicrotask(() => {
        changeHandler?.({ matches } as MediaQueryListEvent);
      });
    },
  };
}
