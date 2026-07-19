export function setupResizeObserverMock({
  disconnect = () => null,
  observe = () => null,
  unobserve = () => null,
} = {}): void {
  class MockResizeObserver implements ResizeObserver {
    disconnect: () => void = disconnect;
    observe: (target: Element) => void = observe;
    unobserve: (target: Element) => void = unobserve;
  }

  Object.defineProperty(window, "ResizeObserver", {
    configurable: true,
    value: MockResizeObserver,
    writable: true,
  });

  Object.defineProperty(global, "ResizeObserver", {
    configurable: true,
    value: MockResizeObserver,
    writable: true,
  });
}
