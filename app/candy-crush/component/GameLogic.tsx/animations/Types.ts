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
export const normalize = (v: number | null) =>
  v == null ? null : v >= 20 ? v - 20 : v;
