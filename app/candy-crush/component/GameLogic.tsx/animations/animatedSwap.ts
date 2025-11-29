import { Animated, Easing } from "react-native";
import { createAnimatedGrid } from "./checkSuffleOrNoMoves";

/** Run an animation and await completion */
const runAnimation = (animation: Animated.CompositeAnimation) =>
  new Promise((resolve) => animation.start(() => resolve(true)));

export type Direction = "up" | "down" | "left" | "right";

/** Animate tile swapping */
export const animateSwap = async (
  source: { x: Animated.Value; y: Animated.Value },
  target: { x: Animated.Value; y: Animated.Value },
  direction: Direction
) => {
  const distance = 45;
  const duration = 120;
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



/** Blink candies before clearing (visual feedback) */
export /** ✅ Blink matched candies visibly before clearing */
const blinkMatches = async (
  matches: { row: number; col: number }[],
  animGrid: ReturnType<typeof createAnimatedGrid>
) => {
  const animations = matches
    .map(({ row, col }) => {
      const anim = animGrid[row]?.[col];
      if (!anim) return null;
      return Animated.sequence([
        Animated.timing(anim.opacity, {
          toValue: 0.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(anim.opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]);
    })
    .filter(Boolean) as Animated.CompositeAnimation[];

  if (animations.length > 0) {
    // Blink twice visibly before clearing
    await runAnimation(Animated.sequence([
      Animated.parallel(animations),
      Animated.delay(300),
      Animated.parallel(animations),
    ]));
  }
};
