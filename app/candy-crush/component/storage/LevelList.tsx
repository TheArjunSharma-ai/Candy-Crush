import React from "react";
import { LevelProvider, useLevelActions, useLevels } from "./LevelContext";
// LevelSelectScreen.tsx
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";

function LevelList() {
  const levels = useLevels();
  const { unlockLevel, completeLevel } = useLevelActions();

  return (
    <div>
      <h2>Levels</h2>
      {levels.map((level) => (
        <div key={level.id}>
          <strong>Level {level.id}</strong> —{" "}
          {level.unlocked ? "Unlocked" : "Locked"} —{" "}
          {level.completed ? "Completed" : "Incomplete"} — High Score:{" "}
          {level.highScore}
          <div>
            {!level.unlocked && (
              <button onClick={() => unlockLevel(level.id)}>Unlock</button>
            )}
            {level.unlocked && !level.completed && (
              <button onClick={() => completeLevel(level.id, 50)}>
                Complete (50 candies)
              </button>
            )}
          </div>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default function LevelSelectScreen() {
  const navigation = useNavigation<any>();
  const levels = useLevels();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Level</Text>
      <FlatList
        data={levels}
        numColumns={3}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.levelButton,
              !item.unlocked && styles.locked,
              item.completed && styles.completed,
            ]}
            disabled={!item.unlocked}
            onPress={() => navigation.navigate("Level", { id: item.id })}
          >
            <Text style={styles.levelText}>{item.id}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fce4ec",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  levelButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ff80ab",
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  levelText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  locked: {
    backgroundColor: "#ccc",
  },
  completed: {
    backgroundColor: "#81c784",
  },
});
