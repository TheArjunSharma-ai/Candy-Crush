import React from "react";
import { Text, View } from "react-native";

interface PlayerProps {
  label: string | undefined;
  color?: string | 'black';
  index?: number;
}
const Player = ({ label, color, index }: PlayerProps) => {
  return (
    <View>
      {renderLabel(label || 'fly', 35, index||Math.random(), color || 'black')}
    </View>
  );
};
const renderLabel = (
  label: string,
  size: number,
  index: number,
  color: string
) => {
  switch (label.toLowerCase()) {
    case "fly":
      return (
        <Text
          style={{ fontSize: size - 10, backgroundColor: "#fff", color: color }}
          key={index}
        >
          🪰
        </Text>
      );
    case "smile":
      return (
        <Text
          style={{ fontSize: size - 10, backgroundColor: "#fff", color: color }}
          key={index}
        >
          😍
        </Text>
      );
    case "bug1":
      return (
        <Text
          style={{ fontSize: size - 10, backgroundColor: "#fff", color: color }}
          key={index}
        >
          🐞
        </Text>
      );
    case "spider":
      return (
        <Text
          style={{ fontSize: size - 10, backgroundColor: "#fff", color: color }}
          key={index}
        >
          🕷️
        </Text>
      );
    case "ant":
      return (
        <Text
          style={{ fontSize: size - 10, backgroundColor: "#fff", color: color }}
          key={index}
        >
          🐜
        </Text>
      );
    case "spinal":
      return (
        <Text
          style={{ fontSize: size - 10, backgroundColor: "#fff", color: color }}
          key={index}
        >
          🐌
        </Text>
      );
    case "butterfly":
      return (
        <Text
          style={{ fontSize: size - 10, backgroundColor: "#fff", color: color }}
          key={index}
        >
          🦋
        </Text>
      );
    case "heart":
      return (
        <Text
          style={{ fontSize: size - 10, backgroundColor: "#fff", color: color }}
          key={index}
        >
          ❤️
        </Text>
      );
    case "bug":
      return (
        <Text
          style={{ fontSize: size - 10, backgroundColor: "#fff", color: color }}
          key={index}
        >
          🪲
        </Text>
      );
    default:
      return (
        <Text style={{ fontSize: size - 45 }} key={index}>
          {label}
        </Text>
      );
  }
};
export default Player;
