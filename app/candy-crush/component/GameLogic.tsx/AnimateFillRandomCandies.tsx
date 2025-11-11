import { Animated } from "react-native";
import { CandyKey, CandyTypes } from "../storage/gameLevels";

/**
 * Fills empty cells with random candies + animates them scaling in.
 */
export const AnimateFillRandomCandies = async (
  grid: (CandyKey | null)[][],
  animatedValues: ({ x: Animated.Value; y: Animated.Value; scale: Animated.Value; opacity: Animated.Value } | null)[][]
): Promise<(CandyKey | null)[][]> => {
  const newGrid = grid.map((row) => [...row]);
  const fillAnimations: Animated.CompositeAnimation[] = [];

  for (let r = 0; r < newGrid.length; r++) {
    for (let c = 0; c < newGrid[r].length; c++) {
      if (newGrid[r][c] === null) {
        const randomCandy =
          CandyTypes[Math.floor(Math.random() * CandyTypes.length)] as CandyKey;
        newGrid[r][c] = randomCandy;

        const anim = animatedValues[r]?.[c];
        if (anim) {
          anim.scale.setValue(0);
          anim.opacity.setValue(0);
          fillAnimations.push(
            Animated.parallel([
              Animated.spring(anim.scale, {
                toValue: 1,
                friction: 6,
                tension: 150,
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

  // Run all pop-in animations
  await new Promise((resolve) => {
    Animated.stagger(60, fillAnimations).start(() => resolve(true));
  });

  return newGrid;
};
