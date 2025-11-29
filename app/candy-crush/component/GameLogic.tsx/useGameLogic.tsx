import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import {
  PanGestureHandlerGestureEvent,
  State,
} from "react-native-gesture-handler";

import { useSound } from "../../SoundContext";
import { TileCandyKey, TileMove } from "../storage/gameLevels";

// Gameplay actions
import {
  AnimateClearMatches,
  AnimatedGrid,
  AnimateFillRandomCandies,
  AnimateShiftDown,
  AnimateShuffleAndClear,
  animateSwap,
  applySpecialCandy,
  detectSpecialCandy,
  Direction,
  findAllMatches,
  hasPossibleMoves,
} from "./animations";

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------
const isInsideGrid = (row: number, col: number, grid: TileCandyKey) =>
  row >= 0 && col >= 0 && row < grid.length && col < grid[0].length;

const cloneGrid = (g: TileCandyKey): TileCandyKey => g.map((row) => [...row]);

// -----------------------------------------------------------------------------
// Hook
// -----------------------------------------------------------------------------
interface GameLogicProps {
  data: TileCandyKey;
  setData: (data: TileCandyKey) => void;
}

const useGameLogic = ({ data, setData }: GameLogicProps) => {
  const { playSound } = useSound();
  const animatedValues = useRef<AnimatedGrid>([]);

  // ---------------------------------------------------------
  // ⚡ Sync animated grid with tile count (but preserve refs)
  // ---------------------------------------------------------
  useEffect(() => {
    if (!data?.length) return;

    animatedValues.current = data.map((row, r) =>
      row.map((tile, c) => {
        const existing = animatedValues.current?.[r]?.[c];
        if (existing) return existing;

        if (tile === null) return null;

        return {
          x: new Animated.Value(0),
          y: new Animated.Value(0),
          scale: new Animated.Value(1),
          opacity: new Animated.Value(1),
        };
      })
    );
  }, [data]);

  // ---------------------------------------------------------------------------
  // 🌀 Perform swap → detect matches → clear → drop → refill
  // ---------------------------------------------------------------------------
  const handleSwipe = async (
    r: number,
    c: number,
    direction: Direction,
    setMoves: React.Dispatch<React.SetStateAction<TileMove>>,
    setCollectedCandies: React.Dispatch<React.SetStateAction<number>>
  ) => {
    const delta = {
      up: [-1, 0],
      down: [1, 0],
      left: [0, -1],
      right: [0, 1],
    }[direction];

    const tRow = r + delta[0];
    const tCol = c + delta[1];

    if (!isInsideGrid(tRow, tCol, data)) return;

    const srcAnim = animatedValues.current[r]?.[c];
    const dstAnim = animatedValues.current[tRow]?.[tCol];

    if (!srcAnim || !dstAnim) return;

    playSound?.("candy_shuffle");

    // Visual animation first
    await animateSwap(srcAnim, dstAnim, direction);

    // Logical swap
    let grid = cloneGrid(data);
    [grid[r][c], grid[tRow][tCol]] = [grid[tRow][tCol], grid[r][c]];

    let matches = await findAllMatches(grid);

    if (!matches.length) {
      // No match → revert
      playSound?.("candy_cross");
      return setData(data);
    }

    // Immediate UI update
    setData(grid);

    let totalCleared = 0;

    // ---------------------------------------------------
    // Keep clearing matches until none are left
    // ---------------------------------------------------
    while (matches.length > 0) {
      totalCleared += matches.length;
      const special = detectSpecialCandy(matches);

      // The origin of the new special candy is the tile that was moved
      const target = { row: tRow, col: tCol };
      if (special && special) {
        grid[tRow][tCol] = applySpecialCandy(special);
      }

      // Clear animations
      grid = await AnimateClearMatches(
        grid,
        matches,
        animatedValues.current,
        target
      );
      playSound?.("candy_clear");

      // Gravity
      grid = await AnimateShiftDown(grid, animatedValues.current);

      // Fill new candies
      grid = await AnimateFillRandomCandies(grid, animatedValues.current);

      // Find new matches
      matches = await findAllMatches(grid);

      setData(grid); // Refresh UI
    }

    // ---------------------------------------------------
    // Shuffle if no valid moves exist
    // ---------------------------------------------------
    while (!(await hasPossibleMoves(grid))) {
      const shuffled = await AnimateShuffleAndClear(
        grid,
        animatedValues.current
      );
      totalCleared += shuffled.clearedMatching;
      grid = shuffled.grid;
      setData(grid);
    }

    // Update score and moves
    setCollectedCandies((prev) => prev + totalCleared);
    setMoves(-1);
  };

  // ---------------------------------------------------------------------------
  // 🎮 Handle gesture (swipe) input
  // ---------------------------------------------------------------------------
  const handleGesture = async (
    event: PanGestureHandlerGestureEvent,
    row: number,
    col: number,
    state: State,
    setMoves: React.Dispatch<React.SetStateAction<TileMove>>,
    setCollectedCandies: React.Dispatch<React.SetStateAction<number>>
  ) => {
    const value = data?.[row]?.[col];
    if (value == null) return;

    if (state !== State.END) return;

    const { translationX, translationY } = event.nativeEvent;
    const x = Math.abs(translationX);
    const y = Math.abs(translationY);

    const direction: Direction =
      x > y
        ? translationX > 0
          ? "right"
          : "left"
        : translationY > 0
        ? "down"
        : "up";

    await handleSwipe(row, col, direction, setMoves, setCollectedCandies);
  };

  return {
    handleGesture,
    animatedValues: animatedValues.current,
  };
};

export default useGameLogic;
