import { Animated } from "react-native";
import { CandyKey } from "../storage/gameLevels";

/**
 * Animates matched candies disappearing before clearing.
 */
export const AnimateClearMatches = async (
  grid: (CandyKey | null)[][],
  matches: { row: number; col: number }[],
  animatedValues: ({ x: Animated.Value; y: Animated.Value; scale: Animated.Value; opacity: Animated.Value } | null)[][]
) => {
  // Animate matched tiles shrinking and fading out
  const animations = matches.map(({ row, col }) => {
    const anim = animatedValues[row]?.[col];
    if (!anim) return null;

    return Animated.parallel([
      Animated.timing(anim.scale, { toValue: 0, duration: 100, useNativeDriver: true }),
      Animated.timing(anim.opacity, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]);
  }).filter(Boolean) as Animated.CompositeAnimation[];

  // Play all animations together
  await new Promise((resolve) => {
    Animated.parallel(animations).start(() => resolve(true));
  });

  // After animation completes, clear tiles
  const newGrid = grid.map((row) => [...row]);
  matches.forEach(({ row, col }) => {
    newGrid[row][col] = null;
    const anim = animatedValues[row]?.[col];
    if (anim) {
      anim.scale.setValue(1);
      anim.opacity.setValue(1);
    }
  });

  return newGrid;
};
