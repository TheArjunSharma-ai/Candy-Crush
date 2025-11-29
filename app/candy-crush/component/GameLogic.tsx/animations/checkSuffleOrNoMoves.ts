import { Alert, Animated } from "react-native";
import { CandyKey, CandyTypes, TileCandyKey } from "../../storage/gameLevels";
import { AnimateShuffleAndClear } from "./AnimateSuffleAndClear";
import { AnimateFillRandomCandies } from "./AnimateFillRandomCandies";
import { hasPossibleMoves } from "./moveUtils";

// a utility to keep trying shuffles until playable or attempts exhausted
export /** ✅ Keep shuffling until a valid grid with possible moves exists */
  const checkAndShuffleIfNoMoves = async (
    grid: TileCandyKey,
    animGrid: ReturnType<typeof createAnimatedGrid>,
    setData: (data: TileCandyKey) => void,
    maxAttempts = 6
  ) => {
    let workingGrid = grid;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const hasMoves = await hasPossibleMoves(workingGrid);
      if (hasMoves) return workingGrid;

      // Show alert only first time (avoid spam)
      if (attempt === 0)
        Alert.alert("😅 No More Moves!", "Shuffling candies...", [{ text: "OK" }]);

      const shuffle = await AnimateShuffleAndClear(workingGrid, animGrid);
      workingGrid = shuffle.grid;

      // Fill any missing spots caused by null or 0
      workingGrid = await AnimateFillRandomCandies(workingGrid, animGrid);
      setData(workingGrid);
      await new Promise((r) => setTimeout(r, 250));
    }

    // Fallback: rebuild a completely random playable grid
    const rows = grid.length;
    const cols = grid[0].length;
    const newGrid = Array.from({ length: rows }, () =>
      Array.from(
        { length: cols },
        () =>
          CandyTypes[Math.floor(Math.random() * CandyTypes.length)] as CandyKey
      )
    );
    setData(newGrid);
    debugger
    return newGrid;
  };

/** ✅ Create and sync animated grid */
export const createAnimatedGrid = (data: (CandyKey | null)[][]) =>
  data.map((row, rIdx) =>
    row.map((tile, cIdx) => {
      if (tile === null)
        return null;
      return {
        x: new Animated.Value(0),
        y: new Animated.Value(0),
        scale: new Animated.Value(1),
        opacity: new Animated.Value(1),
      };
    })
  );