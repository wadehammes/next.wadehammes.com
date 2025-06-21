"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";
import {
  adjustConfigsForTheme,
  DEFAULT_CONFIG,
  generateRandomConfig,
  type SpiralsConfig,
} from "src/components/Spirals/Spirals.utils";
import { isBrowser } from "src/helpers/helpers";

interface SpiralsState {
  configs: SpiralsConfig[];
  isPlaygroundOpen: boolean;
  clientReady: boolean;
}

type SpiralsAction =
  | { type: "UPDATE_CONFIG"; payload: { config: SpiralsConfig; index: number } }
  | { type: "ADD_SPIRAL_SET" }
  | { type: "REMOVE_SPIRAL_SET"; payload: { id: string } }
  | { type: "RANDOMIZE_ALL" }
  | { type: "TOGGLE_PLAYGROUND" }
  | { type: "SET_CLIENT_READY"; payload: boolean }
  | { type: "INITIALIZE_RANDOM" }
  | { type: "ADJUST_FOR_THEME" };

const initialState: SpiralsState = {
  configs: [DEFAULT_CONFIG],
  isPlaygroundOpen: false,
  clientReady: false,
};

const spiralsReducer = (
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
      const newConfig = generateRandomConfig();
      return {
        ...state,
        configs: [newConfig, ...state.configs],
      };
    }

    case "REMOVE_SPIRAL_SET": {
      const { id } = action.payload;
      if (state.configs.length > 1) {
        return {
          ...state,
          configs: state.configs.filter((config) => config.id !== id),
        };
      }
      return state;
    }

    case "RANDOMIZE_ALL": {
      const hasPulseEnabled = Math.random() > 0.2;
      const maxSpiralCount = hasPulseEnabled ? 4 : 5;
      const newSpiralCount =
        Math.floor(Math.random() * (maxSpiralCount - 1)) + 2;
      const newConfigs = Array.from({ length: newSpiralCount }, () =>
        generateRandomConfig(),
      );
      return {
        ...state,
        configs: newConfigs,
      };
    }

    case "TOGGLE_PLAYGROUND": {
      return {
        ...state,
        isPlaygroundOpen: !state.isPlaygroundOpen,
      };
    }

    case "SET_CLIENT_READY": {
      return {
        ...state,
        clientReady: action.payload,
      };
    }

    case "INITIALIZE_RANDOM": {
      const hasPulseEnabled = Math.random() > 0.2;
      const maxSpiralCount = hasPulseEnabled ? 4 : 5;
      const initialSpiralCount =
        Math.floor(Math.random() * (maxSpiralCount - 1)) + 2;
      const initialConfigs = Array.from({ length: initialSpiralCount }, () =>
        generateRandomConfig(),
      );
      return {
        ...state,
        configs: initialConfigs,
      };
    }

    case "ADJUST_FOR_THEME": {
      return {
        ...state,
        configs: adjustConfigsForTheme(state.configs),
      };
    }

    default:
      return state;
  }
};

interface SpiralsContextType {
  state: SpiralsState;
  dispatch: React.Dispatch<SpiralsAction>;
}

const SpiralsContext = createContext<SpiralsContextType | undefined>(undefined);

interface SpiralsProviderProps {
  children: ReactNode;
}

export const SpiralsProvider = ({ children }: SpiralsProviderProps) => {
  const [state, dispatch] = useReducer(spiralsReducer, initialState);

  useEffect(() => {
    if (isBrowser()) {
      dispatch({ type: "INITIALIZE_RANDOM" });
    }
  }, []);

  useEffect(() => {
    if (isBrowser() && state.configs.length > 0) {
      dispatch({ type: "ADJUST_FOR_THEME" });
    }
  }, [state.configs.length]);

  return (
    <SpiralsContext.Provider value={{ state, dispatch }}>
      {children}
    </SpiralsContext.Provider>
  );
};

export const useSpirals = () => {
  const context = useContext(SpiralsContext);
  if (context === undefined) {
    throw new Error("useSpirals must be used within a SpiralsProvider");
  }
  return context;
};
