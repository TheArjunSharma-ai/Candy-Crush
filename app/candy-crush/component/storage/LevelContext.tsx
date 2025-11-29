import React, { createContext, useContext, useEffect, useReducer } from "react";
import { initialLevelData } from "./gameLevels";
import storage from "./storage";

export interface Level {
  id: number;
  unlocked: boolean;
  completed: boolean;
  highScore: number;
  moves?: number;
}

// Initial levels from static data
const initialLevels: Level[] = initialLevelData;

type Action =
  | { type: "UNLOCK_LEVEL"; id: number }
  | { type: "COMPLETE_LEVEL"; id: number; collectedCandies: number }
  | { type: "SET_LEVELS"; levels: Level[] };

function levelReducer(state: Level[], action: Action): Level[] {
  switch (action.type) {
    case "SET_LEVELS":
      return action.levels;

    case "UNLOCK_LEVEL":
      return state.map((lvl) =>
        lvl.id === action.id ? { ...lvl, unlocked: true } : lvl
      );

    case "COMPLETE_LEVEL":
      return state.map((lvl) =>
        lvl.id === action.id
          ? {
              ...lvl,
              completed: true,
              highScore: Math.max(lvl.highScore, action.collectedCandies),
            }
          : lvl
      );

    default:
      return state;
  }
}

// Contexts
const LevelStateContext = createContext<Level[] | undefined>(undefined);
const LevelDispatchContext = createContext<React.Dispatch<Action> | undefined>(
  undefined
);

export const LevelProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [levels, dispatch] = useReducer(levelReducer, initialLevels);

  // Load saved progress from MMKV/localStorage
  useEffect(() => {
    try {
      const saved = storage.getItem("candy-crush-levels");
      if (saved) {
        const parsed = typeof saved === "string" ? JSON.parse(saved) : saved;
        if (Array.isArray(parsed)) {
          dispatch({ type: "SET_LEVELS", levels: parsed });
        }
      }
    } catch (error) {
      console.warn("⚠️ Failed to load levels from storage:", error);
    }
  }, []);

  // Save progress whenever levels change
  useEffect(() => {
    try {
      storage.setItem("candy-crush-levels", JSON.stringify(levels));
    } catch (error) {
      console.warn("⚠️ Failed to save levels:", error);
    }
  }, [levels]);

  return (
    <LevelStateContext.Provider value={levels}>
      <LevelDispatchContext.Provider value={dispatch}>
        {children}
      </LevelDispatchContext.Provider>
    </LevelStateContext.Provider>
  );
};

// Hook to access levels
export const useLevels = (): Level[] => {
  const context = useContext(LevelStateContext);
  if (!context)
    throw new Error("❌ useLevels must be used inside <LevelProvider>");
  return context;
};

// Hook to trigger actions
export const useLevelActions = () => {
  const dispatch = useContext(LevelDispatchContext);
  if (!dispatch)
    throw new Error("❌ useLevelActions must be used inside <LevelProvider>");

  return {
    unlockLevel: (id: number) => dispatch({ type: "UNLOCK_LEVEL", id }),
    completeLevel: (id: number, collectedCandies: number) =>
      dispatch({ type: "COMPLETE_LEVEL", id, collectedCandies }),
  };
};
