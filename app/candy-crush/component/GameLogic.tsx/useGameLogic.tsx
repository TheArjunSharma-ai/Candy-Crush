import { useEffect, useRef } from "react";
import { Animated, Easing, InteractionManager } from "react-native";
import {
    PanGestureHandlerGestureEvent,
    State,
} from "react-native-gesture-handler";
import { useSound } from "../../SoundContext";
import { CandyKey } from "../storage/gameLevels";
import { AnimateClearMatches } from "./AnimatedClearMatches";
import { AnimateFillRandomCandies } from "./AnimateFillRandomCandies";
import { AnimateShiftDown } from "./AnimateShiftDown";
import { AnimateShuffleAndClear } from "./AnimateSuffleAndClear";
import { checkForMatches, hasPossibleMoves } from "./gridUtils";

type Direction = "up" | "down" | "left" | "right";

interface GameLogicProps {
  data: (CandyKey | null)[][];
  setData: (data: (CandyKey | null)[][]) => void;
}

/**
 * Helper: returns a Promise for an Animated sequence
 */
const runAnimation = (animation: Animated.CompositeAnimation) =>
  new Promise((resolve) => animation.start(() => resolve(true)));

/**
 * Handles gesture-based swapping + animations for Candy Crush–style grid
 */
const useGameLogic = ({ data, setData }: GameLogicProps) => {
  const { playSound } = useSound();

  // Animated refs grid
  const animatedValues = useRef<
    ({
      x: Animated.Value;
      y: Animated.Value;
      scale: Animated.Value;
      opacity: Animated.Value;
    } | null)[][]
  >([]);

  // Sync animation refs with grid shape
  useEffect(() => {
    if (!data || data.length === 0) return;

    animatedValues.current = data.map((row, rIdx) =>
      row.map((tile, cIdx) => {
        const existing = animatedValues.current?.[rIdx]?.[cIdx];
        if (existing) return existing;
        return tile === null
          ? null
          : {
              x: new Animated.Value(0),
              y: new Animated.Value(0),
              scale: new Animated.Value(1),
              opacity: new Animated.Value(1),
            };
      })
    );
  }, [data]);

  /**
   * Animate swap movement between two tiles
   */
  const animateSwap = async (
    source: { x: Animated.Value; y: Animated.Value },
    target: { x: Animated.Value; y: Animated.Value },
    direction: Direction
  ) => {
    const distance = 40; // pixel offset per swipe
    const duration = 100;
    const dx =
      direction === "left" ? -distance : direction === "right" ? distance : 0;
    const dy =
      direction === "up" ? -distance : direction === "down" ? distance : 0;

    const forward = Animated.parallel([
      Animated.timing(source.x, {
        toValue: dx,
        duration,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(source.y, {
        toValue: dy,
        duration,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(target.x, {
        toValue: -dx,
        duration,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(target.y, {
        toValue: -dy,
        duration,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]);

    const back = Animated.parallel([
      Animated.timing(source.x, {
        toValue: 0,
        duration,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(source.y, {
        toValue: 0,
        duration,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(target.x, {
        toValue: 0,
        duration,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(target.y, {
        toValue: 0,
        duration,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]);

    await runAnimation(Animated.sequence([forward, back]));
  };

  /**
   * Swap tiles + trigger match / clear animations
   */
  const handleSwipe = async (
    rowIndex: number,
    colIndex: number,
    direction: Direction,
    setMoves: React.Dispatch<React.SetStateAction<number>>,
    setCollectedCandies: React.Dispatch<React.SetStateAction<number>>
  ) => {
    const targetRow =
      direction === "up"
        ? rowIndex - 1
        : direction === "down"
        ? rowIndex + 1
        : rowIndex;
    const targetCol =
      direction === "left"
        ? colIndex - 1
        : direction === "right"
        ? colIndex + 1
        : colIndex;

    if (
      targetRow < 0 ||
      targetCol < 0 ||
      targetRow >= data.length ||
      targetCol >= (data[0]?.length ?? 0)
    )
      return;

    const sourceAnim = animatedValues.current[rowIndex]?.[colIndex];
    const targetAnim = animatedValues.current[targetRow]?.[targetCol];
    if (!sourceAnim || !targetAnim) return;

    playSound?.("candy_shuffle");

    // animate visual swap
    await animateSwap(sourceAnim, targetAnim, direction);

    // perform logical swap
    const newGrid = data.map((row) => [...row]);
    [newGrid[rowIndex][colIndex], newGrid[targetRow][targetCol]] = [
      newGrid[targetRow][targetCol],
      newGrid[rowIndex][colIndex],
    ];

    // check and clear matches
    let matches = await checkForMatches(newGrid);
    if (!matches.length) {
      // revert if no match
      playSound?.("candy_clear");
      return setData(data);
    }

    playSound?.("candy_clear");

    let totalCleared = 0;
    let grid = newGrid;
    // Set new grid immediately so UI updates fast
    setData(grid);

    InteractionManager.runAfterInteractions(async () => {
      while (matches.length > 0) {
        totalCleared += matches.length;

        grid = await AnimateClearMatches(grid, matches, animatedValues.current);
        grid = await AnimateShiftDown(grid, animatedValues.current);
        grid = await AnimateFillRandomCandies(grid, animatedValues.current);

        matches = await checkForMatches(grid);
        setData(grid); // Refresh visual
      }

      // Shuffle if no moves
      if (!(await hasPossibleMoves(grid))) {
        const shuffle = await AnimateShuffleAndClear(
          grid,
          animatedValues.current
        );
        totalCleared += shuffle.clearedMatching;
        grid = shuffle.grid;
        setData(grid);
      }

      setCollectedCandies((prev) => prev + totalCleared);
      setMoves((prev) => prev - 1);
    });
  };

  /**
   * Handle gesture
   */
  const handleGesture = async (
    event: PanGestureHandlerGestureEvent,
    rowIndex: number,
    colIndex: number,
    state: State,
    setMoves: React.Dispatch<React.SetStateAction<number>>,
    setCollectedCandies: React.Dispatch<React.SetStateAction<number>>
  ) => {
    const selectedValue = data?.[rowIndex]?.[colIndex];
    if (selectedValue == null) return;

    if (state === State.END) {
      const { translationX, translationY } = event.nativeEvent;
      const absX = Math.abs(translationX);
      const absY = Math.abs(translationY);

      const dir: Direction =
        absX > absY
          ? translationX > 0
            ? "right"
            : "left"
          : translationY > 0
          ? "down"
          : "up";

      await handleSwipe(rowIndex, colIndex, dir, setMoves, setCollectedCandies);
    }
  };

  return {
    handleGesture,
    animatedValues: animatedValues.current,
  };
};

export default useGameLogic;
