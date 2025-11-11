import { navigate } from "expo-router/build/global-state/routing";
import React from 'react';
import { FlatList, ImageBackground, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Level, useLevelActions, useLevels } from './component/storage/LevelContext';
import { screenHeight, screenWidth } from './component/ui/Footer';

const LevelScreen = () => {
  const levels = useLevels();
  const { unlockLevel, completeLevel } = useLevelActions();
  return (
     <ImageBackground
      source={require('../../assets/images/b2.png')}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center', height: screenHeight, width: screenWidth }}
    >
      <FlatList
              data={levels}
              numColumns={3}
              keyExtractor={(item: { id: { toString: () => any } }) => item.id.toString()}
              renderItem={({ item }: { item: Level }) => (
                <TouchableOpacity
                  style={[
                    styles.levelButton,
                    !item.unlocked && styles.locked,
                    item.completed && styles.completed,
                  ]}
                  disabled={!item.unlocked}
                  onPress={() => navigate(`/candy-crush/GameScreen?id=${item.id}`)}
                >
                  <Text style={styles.levelText}>{item.id}</Text>
                </TouchableOpacity>
              )}
            />
    </ImageBackground>
  )
}

export default LevelScreen


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
