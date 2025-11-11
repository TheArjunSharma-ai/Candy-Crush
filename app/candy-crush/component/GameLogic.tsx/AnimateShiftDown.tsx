import { Animated, Easing } from "react-native";
import { CandyKey } from "../storage/gameLevels";

/**
 * Animate candies falling down into empty spaces.
 */
export const AnimateShiftDown = async (
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
): Promise<(CandyKey | null)[][]> => {
  const newGrid = grid.map((row) => [...row]);
  const rows = newGrid.length;
  const cols = newGrid[0].length;

  const animations: Animated.CompositeAnimation[] = [];

  for (let c = 0; c < cols; c++) {
    let emptyRow = rows - 1;

    for (let r = rows - 1; r >= 0; r--) {
      if (newGrid[r][c] !== null) {
        // if this candy needs to fall
        if (r !== emptyRow) {
          const candy = newGrid[r][c];
          newGrid[r][c] = null;
          newGrid[emptyRow][c] = candy;

          const anim = animatedValues?.[r]?.[c];
          const targetAnim = animatedValues?.[emptyRow]?.[c];

          // Animate fall
          if (anim && targetAnim) {
            const distance = (emptyRow - r) * 60; // adjust for tile height
            anim.y.setValue(-distance);

            animations.push(
              Animated.timing(anim.y, {
                toValue: 0,
                duration: 150 + (emptyRow - r) * 40,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
              })
            );
          }

          emptyRow--;
        } else {
          emptyRow--;
        }
      }
    }
  }

  // Run animations together
  if (animations.length > 0) {
    await new Promise((resolve) =>
      Animated.stagger(25, animations).start(() => resolve(true))
    );
  }

  return newGrid;
};
