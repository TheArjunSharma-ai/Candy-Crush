import { Animated, Easing } from "react-native";
import { TileCandyKey } from "../../storage/gameLevels";
import { AnimatedGrid } from "./Types";

// -------------------------------------------
// FISH ANIMATION
// -------------------------------------------
export const animateFish = async (
  row: number,
  col: number,
  target: { row: number; col: number },
  changeGrid: TileCandyKey,
  grid: AnimatedGrid
) => {
  const anim = grid[row][col];
  const targetAnim = grid[target.row][target.col];
  if (!anim || !targetAnim) return;

  const dx = (target.col - col) * 60;
  const dy = (target.row - row) * 60;

  await new Promise((resolve) =>
    Animated.sequence([
      Animated.timing(anim.scale, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(anim.x, {
        toValue: dx,
        duration: 300,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(anim.y, {
        toValue: dy,
        duration: 300,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(anim.opacity, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start(() => resolve(true))
  );
  if (target) {
    changeGrid[target.row][target.col] = 0;
    changeGrid[row][col] = 0;
  }
};

// -------------------------------------------
// LINE ANIMATIONS
// -------------------------------------------
export const animateLineHorizontal = async (
  row: number,
  changeGrid:TileCandyKey,
  grid: AnimatedGrid
) => {
  const animations = grid[row].filter(Boolean).map((anim) =>
    Animated.timing(anim!.opacity, {
      toValue: 0,
      duration: 120,
      useNativeDriver: true,
    })
  );
if(changeGrid){
   const length = changeGrid[row].length;
  for(let i=0;i<length;i++){
    changeGrid[row][i] = 0;
  }
}
  await new Promise((resolve) =>
    Animated.parallel(animations).start(() => resolve(true))
  );
};

export const animateLineVertical = async (col: number,changeGrid:TileCandyKey, grid: AnimatedGrid) => {
  const animations = grid
    .map((r) => r[col])
    .filter(Boolean)
    .map((anim) =>
      Animated.timing(anim!.opacity, {
        toValue: 0,
        duration: 120,
        
        useNativeDriver: true,
      })
    );
if(changeGrid){
  const length = changeGrid.length;
  for(let i=0;i<length;i++){
    changeGrid[i][col] = 0;
  }
}
  await new Promise((resolve) =>
    Animated.parallel(animations).start(() => resolve(true))
  );
};

// -------------------------------------------
// BOMB ANIMATION (3×3)
// -------------------------------------------
export const animateBomb = async (
  row: number,
  col: number,
  grid: AnimatedGrid
) => {
  const animations: Animated.CompositeAnimation[] = [];

  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      const anim = grid[r]?.[c];
      if (!anim) continue;

      animations.push(
        Animated.parallel([
          Animated.timing(anim.scale, {
            toValue: 1.6,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(anim.opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ])
      );
    }
  }

  await new Promise((resolve) =>
    Animated.parallel(animations).start(() => resolve(true))
  );
};
