import React from "react";
import { StyleSheet, View } from "react-native";
import { renderLabel } from "./HorizontalPath";

interface VerticalPathProps {
  size?: number;
  color?: string;
  path?: { column: number; labels: string[] }[]; // Custom labels for each column
}

const VerticalPath = ({
  size = 240,
  color = "red",
  path = [
    { column: 0, labels: ["R10", "R9", "R8", "R7", "R6", "R5"] },
    { column: 1, labels: ["R11", "CG1", "CG2", "CG3", "CG4", "CG5"] },
    { column: 2, labels: ["G0", "G1", "G2", "G3", "G4", "G5"] },
  ],
}: VerticalPathProps) => {
  const cellWidth = size / 3 - 4;

  return (
    <View style={styles.row}>
      {path.map((col) => {
        const colHeight = size / col.labels.length - 2;

        return (
          <View key={col.column} style={styles.column}>
            {col.labels.map((label, index) => {
              const isHighlight =
                col.column === 1 && label.startsWith("C");

              return (
                <View
                  key={index}
                  style={[
                    styles.cell,
                    {
                      backgroundColor: isHighlight ? color : "#fff",
                      width: cellWidth,
                      height: colHeight,
                    },
                  ]}
                >
                  {renderLabel(label, colHeight)}
                </View>
              );
            })}
          </View>
        );
      })}
    </View>
  );
};

export default VerticalPath;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row", // 3 columns side by side
    justifyContent: "center",
    alignItems: "center",
  },
  column: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 2,
  },
  cell: {
    borderWidth: 1,
    borderColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 1,
  },
});
