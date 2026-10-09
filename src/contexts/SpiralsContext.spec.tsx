import { describe, expect, it } from "@jest/globals";
import { act, renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import {
  SpiralsProvider,
  spiralsInitialState,
  spiralsReducer,
  useSpirals,
  useSpiralsDispatch,
  useSpiralsState,
} from "src/contexts/SpiralsContext";
import { spiralsConfigFactory } from "src/tests/factories/SpiralsConfig.factory";

describe("spiralsReducer", () => {
  it("updates a config at the requested index", () => {
    const existing = spiralsConfigFactory.build({
      id: "keep-me",
      elementSize: 10,
    });
    const replacement = spiralsConfigFactory.build({
      id: "replace-me",
      elementSize: 99,
    });
    const state = {
      ...spiralsInitialState,
      configs: [existing, spiralsConfigFactory.build({ id: "other" })],
    };

    const nextState = spiralsReducer(state, {
      type: "UPDATE_CONFIG",
      payload: { config: replacement, index: 0 },
    });

    expect(nextState.configs[0]).toEqual(replacement);
    expect(nextState.configs[1]?.id).toBe("other");
  });

  it("prepends a generated config when adding a spiral set", () => {
    const existing = spiralsConfigFactory.build({ id: "existing-config" });
    const state = { ...spiralsInitialState, configs: [existing] };

    const nextState = spiralsReducer(state, { type: "ADD_SPIRAL_SET" });

    expect(nextState.configs).toHaveLength(2);
    expect(nextState.configs[0]?.id).not.toBe("existing-config");
    expect(nextState.configs[1]?.id).toBe("existing-config");
  });

  it("does not remove spiral sets below the minimum count", () => {
    const configs = [
      spiralsConfigFactory.build({ id: "a" }),
      spiralsConfigFactory.build({ id: "b" }),
      spiralsConfigFactory.build({ id: "c" }),
    ];
    const state = { ...spiralsInitialState, configs };

    const nextState = spiralsReducer(state, {
      type: "REMOVE_SPIRAL_SET",
      payload: { id: "a" },
    });

    expect(nextState).toBe(state);
  });

  it("removes a spiral set when above the minimum count", () => {
    const configs = [
      spiralsConfigFactory.build({ id: "a" }),
      spiralsConfigFactory.build({ id: "b" }),
      spiralsConfigFactory.build({ id: "c" }),
      spiralsConfigFactory.build({ id: "d" }),
    ];
    const state = { ...spiralsInitialState, configs };

    const nextState = spiralsReducer(state, {
      type: "REMOVE_SPIRAL_SET",
      payload: { id: "d" },
    });

    expect(nextState.configs).toHaveLength(3);
    expect(nextState.configs.some((config) => config.id === "d")).toBe(false);
  });

  it("toggles playground visibility", () => {
    const closed = spiralsReducer(spiralsInitialState, {
      type: "TOGGLE_PLAYGROUND",
    });
    const opened = spiralsReducer(closed, { type: "TOGGLE_PLAYGROUND" });

    expect(closed.isPlaygroundOpen).toBe(true);
    expect(opened.isPlaygroundOpen).toBe(false);
  });

  it("marks initialized on INITIALIZE_RANDOM", () => {
    const nextState = spiralsReducer(spiralsInitialState, {
      type: "INITIALIZE_RANDOM",
    });

    expect(nextState.initialized).toBe(true);
    expect(nextState.configs.length).toBeGreaterThan(0);
  });
});

const wrapper = ({ children }: PropsWithChildren) => (
  <SpiralsProvider>{children}</SpiralsProvider>
);

describe("Spirals context hooks", () => {
  it("throws when used outside SpiralsProvider", () => {
    expect(() => renderHook(() => useSpirals())).toThrow(
      "useSpiralsState must be used within a SpiralsProvider",
    );
  });

  it("returns a stable dispatch reference across state updates", () => {
    const { result } = renderHook(
      () => ({
        dispatch: useSpiralsDispatch(),
        state: useSpiralsState(),
      }),
      { wrapper },
    );

    const initialDispatch = result.current.dispatch;

    act(() => {
      result.current.dispatch({ type: "TOGGLE_PLAYGROUND" });
    });

    expect(result.current.dispatch).toBe(initialDispatch);
  });
});
