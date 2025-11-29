import TimerWave from "@/components/timer-wave";
import { Fonts } from "@/constants/theme";
import React from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenHeight, screenWidth } from "../ui/Footer";

interface GameHeaderProps {
  timer: number;
  collectedCandies: number;
  totalCount: number;
  moves: number;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  timer,
  collectedCandies,
  totalCount,
  moves,
}) => {
  const isTimeMode = timer > 0;

  return (
    <View style={styles.container}>
      <SafeAreaView />

      {/* Rope Image */}
      <Image
        source={require("../../../../assets/icons/hangrope.png")}
        style={styles.image}
      />

      <ImageBackground
        source={require("../../../../assets/images/lines.jpg")}
        style={styles.lines}
      >
        <View style={styles.subContainer}>
          {/* Candies Collected */}
          <View style={styles.textContainer}>
            <Text style={styles.candiesText}>
              🍬 {collectedCandies} /
              <Text style={styles.totalCandiesText}> {totalCount}</Text>
            </Text>
          </View>

          {/* Timer / Moves */}
          <View style={styles.timeContainer}>
            {isTimeMode ? (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <TimerWave time={timer} />
                <Text style={styles.timeText}>{format(timer)}</Text>
              </View>
            ) : (
              <Text style={styles.timeText}>{moves} Moves Left</Text>
            )}
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default GameHeader;

const styles = StyleSheet.create({
  container: {
    height: screenHeight * 0.15,
    width: screenWidth,
  },
  image: {
    width: screenWidth,
    height: screenHeight * 0.06,
    resizeMode: "contain",
    position: "absolute",
    zIndex: 2,
    alignSelf: "center",
    top: screenHeight * 0.002,
  },
  lines: {
    padding: 5,
    borderRadius: 35,
    overflow: "hidden",
    margin: screenHeight * 0.03,
    marginTop: -screenWidth * 0.04,
  },
  subContainer: {
    backgroundColor: "#EDC180",
    padding: screenWidth * 0.02,
    borderRadius: screenHeight * 0.45,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 4,
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#c29781",
    padding: 8,
    paddingHorizontal: 12,
    borderRadius: 45,
  },
  candiesText: {
    fontSize: screenWidth * 0.05,
    fontFamily: Fonts.mono,
    color: "#3A0E4C",
  },
  totalCandiesText: {
    fontFamily: Fonts.mono,
    fontSize: screenWidth * 0.05,
    color: "#3A0E4C",
  },
  timeContainer: {
    backgroundColor: "#c29781",
    padding: 8,
    paddingHorizontal: 16,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  timeText: {
    fontSize: screenWidth * 0.05,
    fontFamily: Fonts.mono,
    color: "#5B2333",
    marginLeft: 6,
  },
});

const format = (time: number) => {
  if (time <= 0) return "00:00";

  const ss = Math.floor((time / 1000) % 60);
  const min = Math.floor(time / (60 * 1000));

  return `${String(min).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
};
