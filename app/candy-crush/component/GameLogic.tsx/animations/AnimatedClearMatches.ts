import { Animated } from "react-native";
import { TileCandyKey } from "../../storage/gameLevels";
import { animateBomb, animateFish, animateLineHorizontal, animateLineVertical } from "./AnimatedFIsh";
import { AnimatedGrid, MatchCell } from "./Types";

export const AnimateClearMatches = async (
  grid: TileCandyKey,
  matches: MatchCell[],
  animGrid: AnimatedGrid,
  target: { row: number; col: number } | null
): Promise<TileCandyKey> => {

  if (!matches.length) return grid;

   // ----------------------------------------
  // Step 1 — Special candy effect
  // ----------------------------------------
  if (target) {
    await spacialApply(grid,matches, animGrid, target);
  }

  // ----------------------------------------
  // Step 2 — Fade + pop animation for all matched tiles
  // ----------------------------------------
  const animations: Animated.CompositeAnimation[] = [];

  for (const m of matches) {
    const anim = animGrid[m.row]?.[m.col];
    if (!anim) continue;

    animations.push(
      Animated.parallel([
        Animated.timing(anim.opacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(anim.scale, {
          toValue: 1.4,
          duration: 180,
          useNativeDriver: true,
        }),
      ])
    );
  }

  await new Promise((resolve) =>
    Animated.parallel(animations).start(() => resolve(true))
  );

  // ----------------------------------------
  // Step 3 — Make a new grid with these tiles cleared
  // ----------------------------------------
  const newGrid: TileCandyKey = grid.map((row) => [...row]);

  for (const m of matches) {
    newGrid[m.row][m.col] = 0; // cleared tile
  }

  // ----------------------------------------
  // Step 4 — Reset animation values (opacity + scale)
  // ----------------------------------------
  for (const m of matches) {
    const anim = animGrid[m.row]?.[m.col];
    if (!anim) continue;
    anim.opacity.setValue(1);
    anim.scale.setValue(1);
  }

  return newGrid;
};

const inRange = (v: number, min: number, max: number) =>
  v >= min && v <= max;

export const spacialApply = async (
  grid:TileCandyKey,
  matches: MatchCell[],
  animatedValues: AnimatedGrid,
  target: { row: number; col: number }
) => {
  if (!matches.length) return;

  for (const { row, col, value } of matches) {
    if (value == null) continue; // FIXED: don't stop entire function

    // FISH candy (21–26)
    if (inRange(value, 21, 26)) {
      await animateFish(row, col, target,grid, animatedValues);
    }

    // horizontal line (31–36)
    if (inRange(value, 31, 36)) {
      await animateLineHorizontal(row,grid, animatedValues);
    }

    // vertical line (41–46)
    if (inRange(value, 41, 46)) {
      await animateLineVertical(col,grid, animatedValues);
    }

    // wrapped (51–56)
    if (inRange(value, 51, 56)) {
      await animateBomb(row, col, animatedValues);
    }

    // bomb (61–66)
    if (inRange(value, 61, 66)) {
      await animateBomb(row, col, animatedValues);
    }
  }
};