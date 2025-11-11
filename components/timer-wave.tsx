import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

interface TimerProps {
  time?: number;
}

/**
 * Animated hourglass (⏳ ↔ ⌛)
 * Rotates around its center and flips icons rapidly to simulate sand flow.
 */
const TimerWave = ({ time = 0 }: TimerProps) => {
  const rotate = useRef(new Animated.Value(0)).current;
  const [icon, setIcon] = useState("⏳");
  const [running, setRunning] = useState(true);

  // Rotate animation loop
  useEffect(() => {
    if (time <= 0) {
      setRunning(false);
      return;
    }

    const animation = Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    animation.start();

    return () => animation.stop();
  }, [rotate, time]);

  // Flip icon every 50ms while running
  useEffect(() => {
    if (!running) return;

    const flipInterval = setInterval(() => {
      setIcon((prev) => (prev === "⏳" ? "⌛" : "⏳"));
    }, 500);

    return () => clearInterval(flipInterval);
  }, [running]);

  const rotateInterpolate = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const animatedStyle = {
    transform: [
      { translateX: -20 }, // half of width
      { translateY: -20 },
      // { rotate: rotateInterpolate },
      { translateX: 20 },
      { translateY: 20 },
    ],
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.iconWrapper, animatedStyle]}>
        <Text style={styles.icon}>{icon}</Text>
      </Animated.View>
    </View>
  );
};

export default TimerWave;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapper: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 44,
    textAlign: "center",
    lineHeight: 46,
  },
});
