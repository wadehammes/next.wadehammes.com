import "@testing-library/jest-dom/jest-globals";
import { setupIntersectionObserverMock } from "src/tests/mocks/mockIntersectionObserver";
import { setupMockMatchMedia } from "src/tests/mocks/mockMatchMedia";
import {
  mockNextNavigation,
  resetMockNextNavigation,
} from "src/tests/mocks/mockNextNavigation";
import { mockedUseRouterReturnValue } from "src/tests/mocks/mockNextRouter";
import { setupResizeObserverMock } from "src/tests/mocks/mockResizeObserver";

jest.mock("next/router", () => ({
  useRouter: () => mockedUseRouterReturnValue,
}));

jest.mock("next/navigation", () => ({
  useParams: () => mockNextNavigation.params,
  usePathname: () => mockNextNavigation.pathname,
  useRouter: () => mockNextNavigation.router,
  useSearchParams: () => mockNextNavigation.searchParams,
}));

global.beforeAll(() => {
  if (typeof window === "undefined") {
    return;
  }

  setupIntersectionObserverMock();
  setupMockMatchMedia();
  setupResizeObserverMock();
});

global.beforeEach(() => {
  jest.clearAllTimers();
  jest.restoreAllMocks();
  jest.clearAllMocks();
  resetMockNextNavigation();
});

global.afterAll(() => {
  jest.resetAllMocks();
});
