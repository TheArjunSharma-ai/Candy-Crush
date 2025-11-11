import { Animated } from "react-native";
import { CandyKey } from "../storage/gameLevels";
import { AnimateClearMatches } from "./AnimatedClearMatches";
import { AnimateFillRandomCandies } from "./AnimateFillRandomCandies";
import { checkForMatches, fillRandomCandies } from "./gridUtils";

/**
 * Animates a board reshuffle:
 * - Fades out the grid
 * - Randomly shuffles candies
 * - Fades + scales them back in
 * - Clears any auto-matches afterward
 */
export const AnimateShuffleAndClear = async (
  grid: (CandyKey | null)[][],
  animatedValues?: (
    | {
        x: Animated.Value;
        y: Animated.Value;
        scale: Animated.Value;
        opacity: Animated.Value;
      }
    | null
  )[][]
): Promise<{ grid: (CandyKey | null)[][]; clearedMatching: number }> => {
  const rows = grid.length;
  const cols = grid[0].length;

  // ✅ Animate shuffle fade-out (whole grid shrinks & fades)
  if (animatedValues) {
    const animations: Animated.CompositeAnimation[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const anim = animatedValues[r]?.[c];
        if (anim) {
          animations.push(
            Animated.parallel([
              Animated.timing(anim.opacity, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
              }),
              Animated.timing(anim.scale, {
                toValue: 0.7,
                duration: 150,
                useNativeDriver: true,
              }),
            ])
          );
        }
      }
    }
    await new Promise((resolve) => {
      Animated.stagger(15, animations).start(() => resolve(true));
    });
  }

  // ✅ Random shuffle logic
  const candies = grid.flat().filter((x): x is CandyKey => x !== null);
  for (let i = candies.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candies[i], candies[j]] = [candies[j], candies[i]];
  }

  let newGrid: (CandyKey | null)[][] = [];
  let idx = 0;
  for (let r = 0; r < rows; r++) {
    const row: (CandyKey | null)[] = [];
    for (let c = 0; c < cols; c++) {
      row.push(candies[idx++] ?? null);
    }
    newGrid.push(row);
  }

  // ✅ Fill nulls (new candies appear)
  newGrid = await fillRandomCandies(newGrid);

  // ✅ Animate shuffle fade-in
  if (animatedValues) {
    const animations: Animated.CompositeAnimation[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const anim = animatedValues[r]?.[c];
        if (anim) {
          anim.scale.setValue(0.7);
          anim.opacity.setValue(0);
          animations.push(
            Animated.parallel([
              Animated.spring(anim.scale, {
                toValue: 1,
                friction: 6,
                useNativeDriver: true,
              }),
              Animated.timing(anim.opacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
              }),
            ])
          );
        }
      }
    }
    await new Promise((resolve) => {
      Animated.stagger(25, animations).start(() => resolve(true));
    });
  }

  // ✅ Clear any instant matches
  let matches = await checkForMatches(newGrid);
  let clearedMatching = 0;

  while (matches.length > 0) {
    clearedMatching += matches.length;

    newGrid = await AnimateClearMatches(
      newGrid,
      matches,
      animatedValues ?? []
    );
    newGrid = await AnimateFillRandomCandies(
      newGrid,
      animatedValues ?? []
    );

    matches = await checkForMatches(newGrid);
  }

  return { grid: newGrid, clearedMatching };
};
