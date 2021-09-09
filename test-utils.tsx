import React, { FC, ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import { theme } from "src/styles/theme";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { NextRouter } from "next/router";

const mockRouter: NextRouter = {
  basePath: "/",
  pathname: "/",
  route: "/",
  query: {},
  asPath: "/",
  locale: "",
  push: jest.fn(() => Promise.resolve(true)),
  replace: jest.fn(() => Promise.resolve(true)),
  reload: jest.fn(() => Promise.resolve(true)),
  prefetch: jest.fn(() => Promise.resolve()),
  back: jest.fn(() => Promise.resolve(true)),
  beforePopState: jest.fn(() => Promise.resolve(true)),
  isFallback: false,
  isLocaleDomain: false,
  isPreview: false,
  isReady: false,
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
};

const Providers: FC = ({ children }) => (
  <RouterContext.Provider value={mockRouter}>
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  </RouterContext.Provider>
);

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "queries">,
) => render(ui, { wrapper: Providers, ...options });

export * from "@testing-library/react";

export { customRender as render };
