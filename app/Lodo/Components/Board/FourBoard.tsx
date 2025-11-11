import React, { useEffect } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { PlayerColor } from ".";
import { playersMoves } from "../../../../data/rule";
import AnimatedDice, { DiceNumber } from "../Dice/AnimatedDice";
import Home from "./Home";
import HorizontalPath from "./HorizontalPath";
import VerticalPath from "./VerticalPath";

const colorMap: Record<PlayerColor, string> = {
   red: '#ef4444',
   blue: '#3b82f6',
   green: '#22c55e',
   yellow: '#eab308',
   purple: '#a855f7',
 };
 interface BoardProps {
    players: { color: PlayerColor; icon: string; id: React.Key | null | undefined }[];
 }
const FourBoard = ({ players }: BoardProps) => {
    const [diceResult, setDiceResult] = React.useState<DiceNumber>(1);
    const [count, setCount] = React.useState(3);
  const cellSize = (Dimensions.get("window").width - 60) / 3; // responsive cell size
const different = 6; // to adjust for borders and spacing
const defaultPlayer =  { id: 0, name: "Player 1", score: 0, isActive: true, icon: 'fly' ,color:'red'};
const rerollDice = (diceValue:DiceNumber) => {
  if (diceValue === 6) {
    return true;
  }
  return false;
};
useEffect(() => {
  console.log(count, ' dice result in four board:', diceResult);
  playersMoves(diceResult, players[0], rerollDice(diceResult));
}, [diceResult,count]);
  return (
    <View style={[styles.board, { width: cellSize * 3, height: cellSize * 3 }]}>
      {/* Top Row */}
      <Home color={colorMap.red} width={cellSize-different} height={cellSize-different} player={players[0] || defaultPlayer}/>
      <View style={[styles.path, { width: cellSize-different, height: cellSize-different }]} >
        <VerticalPath size={cellSize-different} color={colorMap.green} path={GreenLabels}/>
        </View>
      <Home color={colorMap.green} width={cellSize-different} height={cellSize-different} player={players[2] || defaultPlayer}/>

      {/* Middle Row */}
      <View style={[ styles.path, { width: cellSize-different, height: cellSize-different }]} >
        <HorizontalPath size={cellSize-different} color={colorMap.red} path={RedLabels}/>
      </View>
      <View style={[ { width: cellSize-different, height: cellSize-different }]} >
        <AnimatedDice setDiceResult={setDiceResult} setCount={setCount} />
        </View>
      <View style={[ styles.path, { width: cellSize-different, height: cellSize-different }]} >
        <HorizontalPath size={cellSize-different} color={colorMap.blue} path={BlueLabels}/>
      </View>

      {/* Bottom Row */}
      <Home color={colorMap.yellow} width={cellSize-different} height={cellSize-different} player={players[1] || defaultPlayer}/>
      <View style={[styles.path, { width: cellSize-different, height: cellSize-different }]} >
        <VerticalPath size={cellSize-different} color={colorMap.yellow} path={YellowLabels}/>
        </View>
      <Home color={colorMap.blue} width={cellSize-different} height={cellSize-different} player={players[3] || defaultPlayer}/>
    </View>
  );
};

export default FourBoard;

const styles = StyleSheet.create({
  board: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderWidth: 8,
    borderColor: "#333",
    backgroundColor: "#fff",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  path: {
    backgroundColor: "#fff",
  },
});
const RedLabels = [
    { row: 0, labels: ["Y13", "Start", "R2", "R3", "R4", "R5"] },
    { row: 1, labels: ["Y12", "CR5", "CR4", "CR3", "CR2", "CR1"] },
    { row: 2, labels: ["Y11", "Y10", "Star", "Y8", "Y7", "Y6"] },
  ]
  const YellowLabels = [
      { column: 0, labels: ["Y5", "Y4", "Y3", "Y2", "Start", "B13"] },
      { column: 1, labels: [ "CY1", "CY2", "CY3", "CY4", "CY5",'B12'] },
      { column: 0, labels: ['B6',"B7", "B8", "Star", "B10", "B11"] },
  ];
const GreenLabels = [
    { column: 0, labels: ['R11',"R10", "Star", "R8", "R7", "R6"] },
    { column: 1, labels: ["R12", "CG5", "CG4", "CG3", "CG2", "CG1"] },
    { column: 2, labels: ["R13", "Start", "G2", "G3", "G4", "G5"] },
  ]
  const BlueLabels = [
      { row: 0, labels: ["G6", "G7", "G8", "Star", "G10", "G11"] },
      { row: 1, labels: [ "CB1", "CB2", "CB3", "CB4", "CB5",'G12'] },
      { row: 2, labels: ["B5", "B4", "B3", "B2", "Start", "G13"] },
  ];

function playerMoves(diceResult: number, arg1: { color: PlayerColor; icon: string; id: React.Key | null | undefined; }, arg2: boolean) {
  throw new Error("Function not implemented.");
}
