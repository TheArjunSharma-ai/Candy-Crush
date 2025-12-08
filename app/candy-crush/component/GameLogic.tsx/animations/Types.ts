import { Animated } from "react-native";

export type AnimatedCell = {
  x: Animated.Value;
  y: Animated.Value;
  scale: Animated.Value;
  opacity: Animated.Value;
} | null;

export type AnimatedGrid = AnimatedCell[][];

export interface MatchCell {
  row: number;
  col: number;
  value: number | null;
}

// Matches a base candy color even if it is a “fish” version (20+ offset)
export const normalize = (v: number | null): number | null => {
  if (v == null) return null;

  // Remove all known special-candy offsets
  const offsets = [50, 40, 30, 20];

  for (const offset of offsets) {
    if (v >= offset) return v - offset;
  }

  return v;
};

