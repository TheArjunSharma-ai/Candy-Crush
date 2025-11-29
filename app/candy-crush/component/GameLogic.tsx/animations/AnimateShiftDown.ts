import { Animated } from "react-native";
import { TileCandyKey } from "../../storage/gameLevels";

/**
 * Animate candies falling down into empty spaces (0),
 * but never overwrite or move into blocked null cells.
 */
export const AnimateShiftDown = async (
  grid: TileCandyKey,
  animatedValues?: (
    | {
        x: Animated.Value;
        y: Animated.Value;
        scale: Animated.Value;
        opacity: Animated.Value;
      }
    | null
  )[][]
): Promise<TileCandyKey> => {
  const newGrid = grid.map((row) => [...row]);
  const rows = newGrid.length;
  const cols = newGrid[0].length;

  const animations: Animated.CompositeAnimation[] = [];

  for (let c = 0; c < cols; c++) {
    // Start from bottom, move upward
    for (let r = rows - 2; r >= 0; r--) {
      // Skip blocked cells
      if (newGrid[r][c] === null) continue;

      // Find the lowest available (0) slot below this candy
      if (newGrid[r][c] !== 0) {
        let fallTo = -1;

        for (let k = r + 1; k < rows; k++) {
          // Stop if we hit a null — blocked area
          if (newGrid[k][c] === null) break;
          // Found an empty slot
          if (newGrid[k][c] === 0) fallTo = k;
        }

        // If we found a valid empty spot below
        if (fallTo !== -1 && fallTo !== r) {
          const candy = newGrid[r][c];
          newGrid[fallTo][c] = candy;
          newGrid[r][c] = 0;

          // const anim = animatedValues?.[r]?.[c];
          // const targetAnim = animatedValues?.[fallTo]?.[c];

          // if (anim && targetAnim) {
          //   const distance = (fallTo - r) * 30;
          //   anim.y.setValue(-distance);
          //   animations.push(
          //     Animated.timing(anim.y, {
          //       toValue: 1,
          //       duration: 100 + (fallTo - r) * 20,
          //       easing: Easing.out(Easing.quad),
          //       useNativeDriver: true,
          //     })
          //   );
          // }
        }
      }
    }
  }

  // Run all animations together
  // if (animations.length > 0) {
  //   await new Promise((resolve) =>
  //     Animated.stagger(100, animations).start(() => resolve(true))
  //   );
  // }

  return newGrid;
};
