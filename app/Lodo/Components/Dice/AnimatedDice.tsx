import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { Animated, StyleSheet, TouchableOpacity, View } from "react-native";
import RenderDots from "./RenderDots";

export type DiceNumber = 1 | 2 | 3 | 4 | 5 | 6;

interface AnimatedDiceProps {
  setDiceResult: Dispatch<SetStateAction<DiceNumber>>;
  setCount?: Dispatch<SetStateAction<number>>;
}

const AnimatedDice: React.FC<AnimatedDiceProps> = ({ setDiceResult, setCount }) => {
  const [number, setNumber] = useState<DiceNumber>(1);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const rotateAnim = useRef(new Animated.Value(1)).current;

  const rollDice = (): void => {
    if (isRolling) return;

    setIsRolling(true);

    const randomNum: DiceNumber = (Math.floor(Math.random() * 6) + 1) as DiceNumber;

    // Start a rotation animation
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      rotateAnim.setValue(0);
      setNumber(randomNum);
      setIsRolling(false);

      // ✅ Now update parent *after* dice settles
      setDiceResult(randomNum);
      if (setCount) setCount((prev) => prev + 1);
    });

    // During rolling, show random flickering numbers
    const flicker = setInterval(() => {
      const tempNum = (Math.floor(Math.random() * 6) + 1) as DiceNumber;
      setNumber(tempNum);
    }, 60);

    // Stop flicker after animation completes
    setTimeout(() => clearInterval(flicker), 500);
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={rollDice} disabled={isRolling}>
        <Animated.View style={[styles.dice, { transform: [{ rotate: spin }] }]}>
          <RenderDots number={number} />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

export default AnimatedDice;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#222",
  },
  dice: {
    width: 100,
    height: 100,
    backgroundColor: "#fff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowRadius: 4,
    elevation: 5,
  },
});
