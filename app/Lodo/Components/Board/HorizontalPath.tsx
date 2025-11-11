import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface HorizontalPathProps {
  size?: number;
  color?: string;
  path?: { row: number; labels: string[] }[]; // Custom labels for each row
}

const HorizontalPath = ({
  size = 240,
  color = "blue",
  path = [
    { row: 0, labels: ["B10", "B9", "B8", "B7", "B6", "B5"] },
    { row: 1, labels: ["B11", "CB1", "CB2", "CB3", "CB4", "CB5"] },
    { row: 2, labels: ["Y0", "Y1", "Y2", "Y3", "Y4", "Y5"] },
  ],
}: HorizontalPathProps) => {
  const cellHeight = size / 3 - 4;

  return (
    <View style={styles.column}>
      {path.map((row) => {
        const cellWidth = size / row.labels.length - 2;

        return (
          <View key={row.row} style={styles.row}>
            {row.labels.map((label, index) => {
              const isHighlight = row.row === 1 && label.startsWith("C") ;

              return (
                <View
                  key={index}
                  style={[
                    styles.cell,
                    {
                      backgroundColor: isHighlight ? color : "#fff",
                      width: cellWidth,
                      height: cellHeight,
                    },
                  ]}
                >
                  {renderLabel(label, cellWidth)}
                </View>
              );
            })}
          </View>
        );
      })}
    </View>
  );
};
export const renderLabel = (label: string, size: number) => {
  switch (label.toLowerCase()) {
    case "start":return <Text style={{ fontSize: size - 10 }}>⭐</Text>;
    case "star":return <Text style={{ fontSize: size - 10 }}>🌟</Text>;
    case "B":
    case "Y":
      return <Text style={{ fontSize: size - 10 }}>{label}🏠</Text>;
    default:
      break;
  }
};

export default HorizontalPath;

const styles = StyleSheet.create({
  column: {
    flexDirection: "column", // stack 3 rows vertically
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row", // each row has cells side-by-side
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 2,
  },
  cell: {
    borderWidth: 1,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 1,
  },
});
