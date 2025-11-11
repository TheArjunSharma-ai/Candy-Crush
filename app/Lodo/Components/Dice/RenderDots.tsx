import React from "react";
import { StyleSheet, View } from "react-native";

const RenderDots = ({ number }: { number: keyof typeof dotPositions }) => {
    // useEffect(() => {
    //     console.log("Rendering dots for number:", number);
    // },[number])
  return dotPositions[number].map(([row, col], index) => (
    <View
      key={index}
      style={[
        styles.dot,
        {
          top: `${row * 33.33 + 10}%`,
          left: `${col * 33.33 + 10}%`,
        },
      ]}
    />
  ));
};

export default RenderDots;

export const dotPositions = {
  1: [[1, 1]],
  2: [
    [0, 0],
    [2, 2],
  ],
  3: [
    [0, 0],
    [1, 1],
    [2, 2],
  ],
  4: [
    [0, 0],
    [0, 2],
    [2, 0],
    [2, 2],
  ],
  5: [
    [0, 0],
    [0, 2],
    [1, 1],
    [2, 0],
    [2, 2],
  ],
  6: [
    [0, 0],
    [0, 2],
    [1, 0],
    [1, 2],
    [2, 0],
    [2, 2],
  ],
};
const styles = StyleSheet.create({
  dot: {
    width: 16,
    height: 16,
    backgroundColor: "#333",
    borderRadius: 8,
    position: "absolute",
  },
});
