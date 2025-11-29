import { Animated } from "react-native";
import { AnimatedGrid } from "./Types";
import { findAllMatches } from './matchUtils';
import { hasPossibleMoves } from './moveUtils';
import { TileCandyKey } from "../../storage/gameLevels";

/**
 * Randomizes array (Fisher-Yates)
 */
const shuffleArray = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/**
 * Converts grid → 1D → shuffles → back to grid
 */
const shuffleGrid = (grid: TileCandyKey): TileCandyKey => {
  const flat = grid.flat();
  const shuffled = shuffleArray(flat);

  const width = grid[0].length;
  const height = grid.length;

  const reshaped: TileCandyKey = [];
  for (let r = 0; r < height; r++) {
    reshaped.push(shuffled.slice(r * width, (r + 1) * width));
  }
  return reshaped;
};

/**
 * Visually shuffle the board by randomly swapping tile animations.
 */
const animateShuffleVisual = async (
  grid: TileCandyKey,
  animGrid: AnimatedGrid,
  duration = 300
) => {
  const ops: Animated.CompositeAnimation[] = [];

  const height = grid.length;
  const width = grid[0].length;

  // Random offsets for a quick "shake"
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      const anim = animGrid[r][c];
      if (!anim) continue;

      const randX = (Math.random() - 0.5) * 40;
      const randY = (Math.random() - 0.5) * 40;

      ops.push(
        Animated.parallel([
          Animated.timing(anim.x, { toValue: randX, duration, useNativeDriver: true }),
          Animated.timing(anim.y, { toValue: randY, duration, useNativeDriver: true }),
          Animated.timing(anim.scale, { toValue: 1.1, duration, useNativeDriver: true }),
        ])
      );
    }
  }

  await new Promise((resolve) =>
    Animated.parallel(ops).start(() => resolve(true))
  );

  // Reset animations after shake
  const resets: Animated.CompositeAnimation[] = [];
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      const anim = animGrid[r][c];
      if (!anim) continue;

      resets.push(
        Animated.parallel([
          Animated.timing(anim.x, { toValue: 0, duration: 200, useNativeDriver: true }),
          Animated.timing(anim.y, { toValue: 0, duration: 200, useNativeDriver: true }),
          Animated.timing(anim.scale, { toValue: 1, duration: 200, useNativeDriver: true }),
        ])
      );
    }
  }

  await new Promise((resolve) =>
    Animated.parallel(resets).start(() => resolve(true))
  );
};

/**
 * Shuffle board until:
 *   1. No immediate matches
 *   2. At least one valid move exists
 * Clears any matches detected after shuffle.
 */
export const AnimateShuffleAndClear = async (
  grid: TileCandyKey,
  animGrid: AnimatedGrid
): Promise<{
  grid: TileCandyKey;
  clearedMatching: number;
}> => {
  let newGrid = grid;
  let cleared = 0;

  // Loop until grid contains no instant matches and has at least one move
  while (true) {
    // Visual shake
    await animateShuffleVisual(newGrid, animGrid);

    // Logical shuffle
    newGrid = shuffleGrid(newGrid);

    // Check for automatic matches after shuffle
    const matches = await findAllMatches(newGrid);

    if (matches.length === 0 && (await hasPossibleMoves(newGrid))) {
      // Success → finished shuffle
      break;
    }

    // If matches exist → clear them
    if (matches.length > 0) {
      cleared += matches.length;

      // No animations here — normally matches appear instantly only after shuffle
      // but you can animate if desired.
      for (const m of matches) newGrid[m.row][m.col] = null;

      // Gravity + refill (these usually exist already in your animation file)
      // You can wire these in or leave shuffle "cleanup" minimal.
    }

    // If no moves → loop again and reshuffle
  }

  return { grid: newGrid, clearedMatching: cleared };
};
