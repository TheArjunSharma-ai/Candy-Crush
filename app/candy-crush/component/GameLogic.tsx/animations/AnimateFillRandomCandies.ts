// AnimateFillRandomCandies.ts
import { Animated } from "react-native";
import { CandyKey, CandyTypes, TileCandyKey } from "../../storage/gameLevels";
import { AnimatedGrid } from "./Types";

/**
 * Fill empty cells (0 only) with random candies + animate their appearance.
 * Null means a blocker/hole and should remain unchanged.
 */
export const AnimateFillRandomCandies = async (
  grid: TileCandyKey,
  animatedValues: AnimatedGrid
): Promise<TileCandyKey> => {

  const newGrid: TileCandyKey = grid.map(row => [...row]);
  const animations: Animated.CompositeAnimation[] = [];

  for (let r = 0; r < newGrid.length; r++) {
    for (let c = 0; c < newGrid[r].length; c++) {

      const cell = newGrid[r][c];

      // ⭐ Skip holes
      if (cell === null) continue;

      // ⭐ Fill only 0
      if (cell === 0) {
        const randomCandy =
          CandyTypes[Math.floor(Math.random() * CandyTypes.length)] as CandyKey;

        newGrid[r][c] = randomCandy;

        const anim = animatedValues?.[r]?.[c];
        if (anim) {
          anim.scale.setValue(0.3);
          anim.opacity.setValue(0);

          animations.push(
            Animated.parallel([
              Animated.spring(anim.scale, {
                toValue: 1,
                tension: 120,
                friction: 6,
                useNativeDriver: true,
              }),
              Animated.timing(anim.opacity, {
                toValue: 1,
                duration: 180,
                useNativeDriver: true,
              }),
            ])
          );
        }
      }
    }
  }

  // ⭐ Run animations staggered
  if (animations.length > 0) {
    await new Promise<void>((resolve) => {
      Animated.stagger(20, animations).start(() => resolve());
    });
  }

  return newGrid;
};
