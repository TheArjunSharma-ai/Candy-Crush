import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import GameHeader from "./component/Game/GameHeader";
import GameTile from "./component/Game/GameTile";
import { CandyKey, getGameLevel } from "./component/storage/gameLevels";
import { useLevelActions } from "./component/storage/LevelContext";
import { screenHeight, screenWidth } from "./component/ui/Footer";
import { useSound } from "./SoundContext";

const GameScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>(); // ✅ works for /GameScreen?id=2
  const levelId = Number(id) || 1;

  const router = useRouter(); // ✅ correct navigation handler
  const { completeLevel, unlockLevel } = useLevelActions();
  const { playSound } = useSound();

  const [gridData, setGridData] = useState<(CandyKey | null)[][]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [moves, setMoves] = useState(20);
  const [timer, setTimer] = useState(60000);
  const [collectedCandies, setCollectedCandies] = useState<number>(0);
  const [target, setTarget] = useState(30);
  const [showResult, setShowResult] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);

  // ✅ Load level when route param changes
  useEffect(() => {
    const level = getGameLevel(levelId);
    if (level) {
      setGridData(level.grid);
      setMoves(level.moves);
      setTimer(level.timer || 60000);
      setTarget(level.target);
      setCollectedCandies(0);
      setGameEnded(false);
      setShowResult(false);
    }
  }, [levelId]);

  // ✅ Countdown Timer
  useEffect(() => {
    if (timer <= 0 || gameEnded) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1000) {
          clearInterval(interval);
          setGameEnded(true);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, gameEnded]);

  // ✅ End game logic
  useEffect(() => {
    if (gameEnded) handleEndGame();
  }, [gameEnded]);

  useEffect(() => {
    if (moves <= 0 && !gameEnded) setGameEnded(true);
  }, [moves]);

  const handleEndGame = () => {
    const isTargetAchieved = collectedCandies >= target;

    setShowResult(true);
    setLevelComplete(isTargetAchieved);

    if (isTargetAchieved) {
      playSound("levelComplete");
      completeLevel(levelId, collectedCandies);
      unlockLevel(levelId + 1);
    } else {
      playSound("gameOver");
    }
  };

  const handleRestart = () => {
    setShowResult(false);
    router.replace(`/candy-crush/GameScreen?id=${levelId}`);
  };

  const handleNextLevel = () => {
    setShowResult(false);
    router.replace(`/candy-crush/GameScreen?id=${levelId + 1}`); // ✅ works now
  };

  return (
    <ImageBackground
      style={{ width: screenWidth, height: screenHeight }}
      source={require("../../assets/images/b1.png")}
    >
      <GameHeader
        totalCount={totalCount}
        collectedCandies={collectedCandies}
        timer={timer}
        moves={moves}
      />

      {gridData && !showResult && (
        <GameTile
          data={gridData}
          setData={setGridData}
          setCollectedCandies={setCollectedCandies}
          setMoves={setMoves}
        />
      )}

      <Text style={styles.timerText}>⏳ {timer / 1000}s left</Text>
      <Text style={styles.movesText}>🎮 Moves left: {moves}</Text>

      {/* ✅ Result Popup */}
      <Modal visible={showResult} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {levelComplete ? "🎉 Level Complete!" : "💀 Game Over!"}
            </Text>
            <Text style={styles.modalText}>
              You collected {collectedCandies} candies
            </Text>
            <Text style={styles.modalText}>Target: {target}</Text>

            <TouchableOpacity
              style={[styles.btn, { backgroundColor: "#007bff" }]}
              onPress={() => router.replace(`/candy-crush/LevelScreen`)}
            >
              <Text style={styles.btnText}>Back 🔙</Text>
            </TouchableOpacity>

            {levelComplete ? (
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#28a745" }]}
                onPress={handleNextLevel}
              >
                <Text style={styles.btnText}>Next Level ▶</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: "#ffc107" }]}
                onPress={handleRestart}
              >
                <Text style={styles.btnText}>Try Again 🔁</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

export default GameScreen;

const styles = StyleSheet.create({
  timerText: {
    fontSize: 22,
    color: "white",
    textAlign: "center",
    marginTop: 10,
  },
  movesText: {
    fontSize: 20,
    color: "#ffcc00",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "white",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
    width: "80%",
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 10,
  },
  btnText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});
