import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
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

import {
  getGameLevel,
  TileCandyKey,
  TileMove,
  TileTime,
} from "./component/storage/gameLevels";

import { useLevelActions } from "./component/storage/LevelContext";
import { screenHeight, screenWidth } from "./component/ui/Footer";
import { useSound } from "./SoundContext";

const GameScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const levelId = Number(id) || 1;

  const router = useRouter();
  const { completeLevel, unlockLevel } = useLevelActions();
  const { playSound } = useSound();

  // ---------- GAME STATE ----------
  const [gridData, setGridData] = useState<TileCandyKey>([]);
  const [moves, setMoves] = useState<TileMove>(null);
  const [timer, setTimer] = useState<TileTime>(null);
  const [collectedCandies, setCollectedCandies] = useState(0);
  const [target, setTarget] = useState(0);

  const [showResult, setShowResult] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /****************************************************
   *  LOAD LEVEL WHEN CHANGED
   ****************************************************/
  const loadLevel = () => {
    const level = getGameLevel(levelId);
    if (!level) return;

    setGridData(level.grid);
    setMoves(level.moves ?? null);
    setTimer(level.timer ?? null);
    setTarget(level.target);

    setCollectedCandies(0);
    setGameEnded(false);
    setShowResult(false);

    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    loadLevel();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [levelId]);

  /****************************************************
   *  TIMER MODE
   ****************************************************/
  useEffect(() => {
    if (timer === null) return; // moves-mode (no timer)
    if (timer <= 0 || gameEnded) return;

    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (!prev || prev <= 1000) {
          clearInterval(timerRef.current!);
          setGameEnded(true);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(timerRef.current!);
  }, [timer, gameEnded]);

  /****************************************************
   *  MOVES MODE
   ****************************************************/
  useEffect(() => {
    if (moves !== null && moves <= 0 && !gameEnded) {
      setGameEnded(true);
    }
  }, [moves]);

  /****************************************************
   *  END GAME
   ****************************************************/
  useEffect(() => {
    if (gameEnded) handleEndGame();
  }, [gameEnded]);

  const handleEndGame = () => {
    const isTargetAchieved = collectedCandies >= target;

    setLevelComplete(isTargetAchieved);
    setShowResult(true);

    if (isTargetAchieved) {
      playSound("levelComplete");
      completeLevel(levelId, collectedCandies);
      unlockLevel(levelId + 1);
    } else {
      playSound("gameOver");
    }
  };

  /****************************************************
   *  RESTART & NEXT LEVEL
   ****************************************************/
  const handleRestart = () => {
    router.replace(`/candy-crush/GameScreen?id=${levelId}`);
  };

  const handleNextLevel = () => {
    router.replace(`/candy-crush/GameScreen?id=${levelId + 1}`);
  };
  const handleMoves = (value:any)=>{
    if(value && moves !== null){
      const move = parseInt(value+'');
      if(!isNaN(move)){
        setMoves((prev)=>{
          if(prev === null ) return prev;
          return prev + move;
        })
      }
    }
  }
  /****************************************************
   *  UI RENDER
   ****************************************************/
  return (
    <ImageBackground
      style={{ width: screenWidth, height: screenHeight }}
      source={require("../../assets/images/b1.png")}
    >
      {/** HEADER */}
      <GameHeader
        totalCount={target}
        collectedCandies={collectedCandies}
        timer={timer ?? -1}
        moves={moves ?? -1}
      />

      {/** GAME BOARD */}
      {!showResult && gridData.length > 0 && (
        <GameTile
          data={gridData}
          setData={setGridData}
          setCollectedCandies={setCollectedCandies}
          setMoves={handleMoves}
        />
      )}

      {/** RESULT POPUP */}
      <Modal visible={showResult} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>
              {levelComplete ? "🎉 Level Complete!" : "💀 Game Over!"}
            </Text>

            <Text style={styles.modalText}>
              You collected {collectedCandies}
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

/****************************************************
 *  STYLES
 ****************************************************/
const styles = StyleSheet.create({
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
