export const mockNextNavigation = {
  params: {} as Record<string, string | string[] | undefined>,
  pathname: "/",
  router: {
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
    push: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
  },
  searchParams: new URLSearchParams(),
};

export const resetMockNextNavigation = () => {
  mockNextNavigation.params = {};
  mockNextNavigation.pathname = "/";
  mockNextNavigation.searchParams = new URLSearchParams();
  for (const fn of Object.values(mockNextNavigation.router)) {
    fn.mockReset();
  }
};
