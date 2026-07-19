import { type RenderOptions, render, renderHook } from "@testing-library/react";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import type { ReactElement, ReactNode } from "react";
import type { PropsWithChildrenOnly } from "src/@types/react";
import { SpiralsProvider } from "src/contexts/SpiralsContext";
import { mockedUseRouterReturnValue } from "src/tests/mocks/mockNextRouter";

const Providers = ({ children }: PropsWithChildrenOnly) => (
  <RouterContext.Provider value={mockedUseRouterReturnValue}>
    <SpiralsProvider>{children}</SpiralsProvider>
  </RouterContext.Provider>
);

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "queries">,
) => render(ui, { wrapper: Providers, ...options });

interface CustomRenderHookOptions<Props> {
  initialProps?: Props;
  wrapper?: ({ children }: { children: ReactNode }) => ReactElement;
}

const customRenderHook = <Result, Props>(
  hook: (props: Props) => Result,
  options?: CustomRenderHookOptions<Props>,
) =>
  renderHook(hook, {
    initialProps: options?.initialProps,
    wrapper: options?.wrapper ?? Providers,
  });

export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";

export { customRender as render, customRenderHook as renderHook };
