import React from "react";
import { StyleSheet, View } from "react-native";
import {
  gestureHandlerRootHOC,
  PanGestureHandler,
  State,
} from "react-native-gesture-handler";
import useGameLogic from "../GameLogic.tsx/useGameLogic";
import { TileCandyKey } from "../storage/gameLevels";
import { screenHeight, screenWidth } from "../ui/Footer";
import AnimatedTile from "./AnimatedTIle"; // ✅ fixed import case

interface GameTileProps {
  data: TileCandyKey;
  setData: (data: TileCandyKey) => void;
  setMoves: React.Dispatch<React.SetStateAction<number>>;
  setCollectedCandies: React.Dispatch<React.SetStateAction<number>>;
}

const GameTile: React.FC<GameTileProps> = ({
  data,
  setCollectedCandies,
  setData,setMoves
}) => {
  const { handleGesture, animatedValues } = useGameLogic({ data, setData });

  return (
    <View style={styles.flex2}>
      {data?.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row?.map((tile, colIndex) => (
            <PanGestureHandler
              key={`${rowIndex}-${colIndex}`}
              onHandlerStateChange={(event) => {
                const state = event.nativeEvent.state;
                if (state === State.END) {
                  handleGesture(event, rowIndex, colIndex, state, setMoves, setCollectedCandies);
                }
              }}
            >
              <View data-tile={tile}
                style={[
                  styles.tile,
                  tile === null ? styles.emptyTile : styles.activeTile,
                ]}
              >
                <AnimatedTile
                  tile={tile}
                  rowIndex={rowIndex}
                  colIndex={colIndex}
                  animatedValues={animatedValues?.[rowIndex]?.[colIndex]}
                />
              </View>
            </PanGestureHandler>
          ))}
        </View>
      ))}
    </View>
  );
};

export default gestureHandlerRootHOC(GameTile);

const styles = StyleSheet.create({
  flex2: {
    height: screenHeight * 0.75,
    width: screenWidth * 0.95,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "red",
    paddingVertical: 10,
  },
  row: {
    flexDirection: "row",
  },
  tile: {
    height: screenHeight * 0.11,
    width: screenWidth * 0.14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  emptyTile: {
    backgroundColor: "transparent",
  },
  activeTile: {
    borderColor: "#666",
    borderWidth: 0.6,
    backgroundColor: "#326E9A",
  },
});
