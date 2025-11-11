import React from "react";
import { Animated, ImageSourcePropType, StyleSheet } from "react-native";
import { getCandyImage } from "../storage/gameLevels";

interface AnimatedTileProps {
  tile: number | null; // or CandyKey if you have a specific type
  rowIndex: number;
  colIndex: number;
  animatedValues?: {
    x: Animated.Value;
    y: Animated.Value;
    scale: Animated.Value;
    opacity: Animated.Value;
  } | null;
}

/**
 * Renders a single animated candy tile using Animated.Image.
 * Supports translate, scale, and fade effects via Animated.Value.
 */
const AnimatedTile: React.FC<AnimatedTileProps> = ({
  tile,
  rowIndex,
  colIndex,
  animatedValues,
}) => {
  if (tile === null) return null; // nothing to show

  const anim = animatedValues;

  return (
    <Animated.Image
      key={`${rowIndex}-${colIndex}`}
      source={getCandyImage(tile) as ImageSourcePropType}
      resizeMode="contain"
      style={[
        styles.candy,
        anim
          ? {
              transform: [
                { translateX: anim.x },
                { translateY: anim.y },
                { scale: anim.scale },
              ],
              opacity: anim.opacity,
            }
          : { shadowColor: "red" }, // fallback debug style if missing animation ref
      ]}
    />
  );
};

export default AnimatedTile;

const styles = StyleSheet.create({
  candy: {
    width: 50, // you can adjust dynamically via screenWidth * 0.1
    height: 50,
  },
});
