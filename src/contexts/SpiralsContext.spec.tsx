import { describe, expect, it } from "@jest/globals";
import { renderHook } from "@testing-library/react";
import {
  spiralsInitialState,
  spiralsReducer,
  useSpirals,
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

  it("does not remove the last remaining spiral set", () => {
    const onlyConfig = spiralsConfigFactory.build({ id: "only-config" });
    const state = { ...spiralsInitialState, configs: [onlyConfig] };

    const nextState = spiralsReducer(state, {
      type: "REMOVE_SPIRAL_SET",
      payload: { id: "only-config" },
    });

    expect(nextState).toBe(state);
  });

  it("toggles playground visibility", () => {
    const closed = spiralsReducer(spiralsInitialState, {
      type: "TOGGLE_PLAYGROUND",
    });
    const opened = spiralsReducer(closed, { type: "TOGGLE_PLAYGROUND" });

    expect(closed.isPlaygroundOpen).toBe(true);
    expect(opened.isPlaygroundOpen).toBe(false);
  });

  it("marks the client as ready", () => {
    const nextState = spiralsReducer(spiralsInitialState, {
      type: "SET_CLIENT_READY",
      payload: true,
    });

    expect(nextState.clientReady).toBe(true);
  });
});

describe("useSpirals", () => {
  it("throws when used outside SpiralsProvider", () => {
    expect(() => renderHook(() => useSpirals())).toThrow(
      "useSpirals must be used within a SpiralsProvider",
    );
  });
});
