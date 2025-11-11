import React from "react";
import { StyleSheet, View } from "react-native";
import Player from "../GameControl/Player";

interface HomeProps {
  color: string;
  width: number;
  height: number;
  style?: object;
  player?: { color: string; icon: string; id: React.Key | null | undefined };
}
const Home = ({ color, width, height, style, player }: HomeProps) => {
  const sportSize = (width - 24) / 4; // Adjust token spot size based on home size
  return (
    <View style={[ { backgroundColor: color, width, height,justifyContent: "center", alignItems: "center" },style]}>
      <View style={styles.tokenRow}>
        <View style={[styles.tokenSpot, { width: sportSize, height: sportSize }]} ><Player color={color} label={player?.icon || undefined} /></View>
        <View style={[styles.tokenSpot, { width: sportSize, height: sportSize }]} ><Player color={color} label={player?.icon || undefined} /></View>
      </View>
      <View style={styles.tokenRow}>
        <View style={[styles.tokenSpot, { width: sportSize, height: sportSize }]} ><Player color={color} label={player?.icon || undefined} /></View>
        <View style={[styles.tokenSpot, { width: sportSize, height: sportSize }]} ><Player color={color} label={player?.icon || undefined} /></View>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  tokenRow: {
    flexDirection: "row",
  },
  tokenSpot: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#000",
    margin: 6,
  },
});
