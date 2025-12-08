import { Animated } from "react-native";
import { TileCandyKey } from "../../storage/gameLevels";
import { animateBomb, animateFish, animateLineHorizontal, animateLineVertical } from "./AnimatedFIsh";
import { AnimatedGrid, MatchCell } from "./Types";

export const AnimateClearMatches = async (
  grid: TileCandyKey,
  matches: MatchCell[],
  animGrid: AnimatedGrid
): Promise<TileCandyKey> => {

  if (!matches.length) return grid;

   // ----------------------------------------
  // Step 1 — Special candy effect
  // ----------------------------------------
  await spacialApply(grid,matches, animGrid);

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
    const prev = newGrid[m.row][m.col];
    if(prev && prev > 10) continue;
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
  grid: TileCandyKey,
  matches: MatchCell[],
  animatedValues: AnimatedGrid
) => {
  if (!matches.length) return;

  for (let { row, col, value } of matches) {
    if (value == null || value === 0) continue; // skip invalid cells

    // FISH candy (21–26)
    if (inRange(value, 21, 26)) {
      const target = getTarget(grid);
      await animateFish(row, col, target, grid, animatedValues);
    }

    // horizontal line (31–36)
    if (inRange(value, 31, 36)) {
      await animateLineHorizontal(row, grid, animatedValues);
    }

    // vertical line (41–46)
    if (inRange(value, 41, 46)) {
      await animateLineVertical(col, grid, animatedValues);
    }

    // wrapped candy (51–56)
    if (inRange(value, 51, 56)) {
      await animateBomb(row, col, animatedValues); // separate animation if needed
    }

    // bomb candy (61–66)
    if (inRange(value, 61, 66)) {
      await animateBomb(row, col, animatedValues);
    }
    value = 0;
  }
};
const getTarget = (grid: TileCandyKey): { row: number; col: number } => {
  const rows = grid.length;
  const cols = grid[0].length;

  let targetRow: number;
  let targetCol: number;

  do {
    targetRow = Math.floor(Math.random() * rows);
    targetCol = Math.floor(Math.random() * cols);
  } while (grid[targetRow][targetCol] === null || grid[targetRow][targetCol] === 0);

  return { row: targetRow, col: targetCol };
};
