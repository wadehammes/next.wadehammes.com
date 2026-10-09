"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";
import {
  createRandomConfigSet,
  DEFAULT_CONFIG,
  generateRandomConfig,
  HARMONIC_MINIMUMS,
  type SpiralsConfig,
} from "src/components/Spirals/Spirals.utils";
import { isBrowser } from "src/helpers/helpers";

export interface SpiralsState {
  configs: SpiralsConfig[];
  isPlaygroundOpen: boolean;
  initialized: boolean;
}

type SpiralsAction =
  | { type: "UPDATE_CONFIG"; payload: { config: SpiralsConfig; index: number } }
  | { type: "ADD_SPIRAL_SET" }
  | { type: "REMOVE_SPIRAL_SET"; payload: { id: string } }
  | { type: "RANDOMIZE_ALL" }
  | { type: "TOGGLE_PLAYGROUND" }
  | { type: "INITIALIZE_RANDOM" };

const initialState: SpiralsState = {
  configs: [DEFAULT_CONFIG],
  isPlaygroundOpen: false,
  initialized: false,
};

export const spiralsInitialState = initialState;

export const spiralsReducer = (
  state: SpiralsState,
  action: SpiralsAction,
): SpiralsState => {
  switch (action.type) {
    case "UPDATE_CONFIG": {
      const { config, index } = action.payload;
      return {
        ...state,
        configs: state.configs.map((c, i) => (i === index ? config : c)),
      };
    }

    case "ADD_SPIRAL_SET": {
      const newConfig = generateRandomConfig(state.configs);
      return {
        ...state,
        configs: [newConfig, ...state.configs],
      };
    }

    case "REMOVE_SPIRAL_SET": {
      const { id } = action.payload;
      if (state.configs.length > HARMONIC_MINIMUMS.minSpiralSetCount) {
        return {
          ...state,
          configs: state.configs.filter((config) => config.id !== id),
        };
      }
      return state;
    }

    case "RANDOMIZE_ALL": {
      return {
        ...state,
        configs: createRandomConfigSet(),
      };
    }

    case "TOGGLE_PLAYGROUND": {
      return {
        ...state,
        isPlaygroundOpen: !state.isPlaygroundOpen,
      };
    }

    case "INITIALIZE_RANDOM": {
      return {
        ...state,
        configs: createRandomConfigSet(),
        initialized: true,
      };
    }

    default:
      return state;
  }
};

const SpiralsStateContext = createContext<SpiralsState | undefined>(undefined);
const SpiralsDispatchContext = createContext<
  React.Dispatch<SpiralsAction> | undefined
>(undefined);

interface SpiralsProviderProps {
  children: ReactNode;
}

export const SpiralsProvider = ({ children }: SpiralsProviderProps) => {
  const [state, dispatch] = useReducer(spiralsReducer, initialState);
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    if (!isBrowser() || hasInitializedRef.current) {
      return;
    }

    hasInitializedRef.current = true;
    dispatch({ type: "INITIALIZE_RANDOM" });
  }, []);

  return (
    <SpiralsDispatchContext value={dispatch}>
      <SpiralsStateContext value={state}>{children}</SpiralsStateContext>
    </SpiralsDispatchContext>
  );
};

export const useSpiralsDispatch = (): React.Dispatch<SpiralsAction> => {
  const dispatch = useContext(SpiralsDispatchContext);
  if (dispatch === undefined) {
    throw new Error("useSpiralsDispatch must be used within a SpiralsProvider");
  }
  return dispatch;
};

export const useSpiralsState = (): SpiralsState => {
  const state = useContext(SpiralsStateContext);
  if (state === undefined) {
    throw new Error("useSpiralsState must be used within a SpiralsProvider");
  }
  return state;
};

export const useSpiralsConfigs = (): SpiralsConfig[] =>
  useSpiralsState().configs;

export const useSpirals = () => ({
  state: useSpiralsState(),
  dispatch: useSpiralsDispatch(),
});
