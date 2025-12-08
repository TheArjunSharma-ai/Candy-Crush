import React from "react";
import { ImageSourcePropType } from "react-native";
import Svg, { G, Image, Line } from "react-native-svg";
import { getCandyImage } from "../storage/gameLevels";

interface VerticleSVGProps {
  tile: number;
  rowIndex: number;
  colIndex: number;
  color:string;
}

const VerticleSVG: React.FC<VerticleSVGProps> = ({ tile, rowIndex, colIndex,color }) => {
  const source = getCandyImage(tile) as ImageSourcePropType;

  return (
    <Svg
      width={200}
      height={200}
      viewBox="0 0 200 200"
      key={`${rowIndex}-${colIndex}`}
    >
      {/* Candy PNG (must have transparent background to reveal stripes) */}
      <Image
        href={source}
        x={25}
        y={25}
        width={150}
        height={150}
        preserveAspectRatio="xMidYMid meet"
      />

      {/* White stripes overlay */}
      <G stroke={color} strokeWidth={6} strokeLinecap="round" opacity={0.95}>
        <Line y1="75" x1="50" y2="125" x2="50" />
        <Line y1="65" x1="75" y2="155" x2="75" />
        <Line y1="55" x1="100" y2="155" x2="100" />
        <Line y1="65" x1="125" y2="155" x2="125" />
        <Line y1="75" x1="150" y2="125" x2="150" />
      </G>
    </Svg>
  );
};

export default VerticleSVG;
