// AnimateFillRandomCandies.ts
import { Animated } from "react-native";
import { CandyKey, CandyTypes, TileCandyKey } from "../../storage/gameLevels";
import { AnimatedGrid } from "./Types";

/**
 * Fill empty cells (null or 0) with random candies, animate appearance.
 */
export const AnimateFillRandomCandies = async (
  grid: TileCandyKey,
  animatedValues: AnimatedGrid
): Promise<TileCandyKey> => {
  const newGrid = grid.map((row) => [...row]);
  const fillAnimations: Animated.CompositeAnimation[] = [];

  for (let r = 0; r < newGrid.length; r++) {
    for (let c = 0; c < newGrid[r].length; c++) {
      // ✅ Fill both null and 0
      if (newGrid[r][c] === 0) {
        const randomCandy =
          CandyTypes[Math.floor(Math.random() * CandyTypes.length)] as CandyKey;
        newGrid[r][c] = randomCandy;

        const anim = animatedValues[r]?.[c];
        if (anim) {
          anim.scale.setValue(0.3);
          anim.opacity.setValue(0);
          fillAnimations.push(
            Animated.parallel([
              Animated.spring(anim.scale, {
                toValue: 1,
                friction: 6,
                tension: 120,
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

  if (fillAnimations.length > 0) {
    await new Promise((resolve) =>
      Animated.stagger(50, fillAnimations).start(() => resolve(true))
    );
  }

  return newGrid;
};
