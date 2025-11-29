import { TileCandyKey } from "../../storage/gameLevels";
import { findAllMatches } from "./matchUtils";
import { MatchCell } from "./Types";

// ---------------------------------------------------
// CHECK IF ANY LEGAL MOVE CREATES A MATCH
// ---------------------------------------------------
export const hasPossibleMoves = async (grid: TileCandyKey): Promise<boolean> => {
  const rows = grid.length;
  const cols = grid[0].length;

  const clone = (g: TileCandyKey): TileCandyKey => g.map((r) => [...r]);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === null) continue;

      // Swap right
      if (c + 1 < cols && grid[r][c + 1] !== null) {
        const g = clone(grid);
        [g[r][c], g[r][c + 1]] = [g[r][c + 1], g[r][c]];
        if (findAllMatches(g).length > 0) return true;
      }

      // Swap down
      if (r + 1 < rows && grid[r + 1][c] !== null) {
        const g = clone(grid);
        [g[r][c], g[r + 1][c]] = [g[r + 1][c], g[r][c]];
        if (findAllMatches(g).length > 0) return true;
      }
    }
  }

  return false;
};
