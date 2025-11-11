import { CandyKey, CandyTypes } from "../storage/gameLevels";

/**
 * Detects all horizontal & vertical 3+ matches.
 * Returns a list of coordinates to clear.
 */
export const checkForMatches = async (grid: (CandyKey | null)[][]) => {
  const matches: { row: number; col: number }[] = [];

  // --- Horizontal matches ---
  for (let r = 0; r < grid.length; r++) {
    let matchLength = 1;
    for (let c = 0; c < grid[r].length; c++) {
      const current = grid[r][c];
      const next = grid[r][c + 1];

      if (current !== null && current === next) {
        matchLength++;
      } else {
        if (matchLength >= 3 && current !== null) {
          for (let i = 0; i < matchLength; i++) {
            matches.push({ row: r, col: c - i });
          }
        }
        matchLength = 1;
      }
    }
  }

  // --- Vertical matches ---
  for (let c = 0; c < grid[0].length; c++) {
    let matchLength = 1;
    for (let r = 0; r < grid.length; r++) {
      const current = grid[r][c];
      const next = grid[r + 1]?.[c];

      if (current !== null && current === next) {
        matchLength++;
      } else {
        if (matchLength >= 3 && current !== null) {
          for (let i = 0; i < matchLength; i++) {
            matches.push({ row: r - i, col: c });
          }
        }
        matchLength = 1;
      }
    }
  }

  return matches;
};


/**
 * Makes candies fall down into empty spaces (nulls).
 */
export const shiftDown = async (grid: (CandyKey | null)[][]) => {
  const newGrid = grid.map((row) => [...row]);
  const rows = newGrid.length;
  const cols = newGrid[0].length;

  for (let c = 0; c < cols; c++) {
    let emptyRow = rows - 1;
    for (let r = rows - 1; r >= 0; r--) {
      if (newGrid[r][c] !== null) {
        const candy = newGrid[r][c];
        newGrid[r][c] = null;
        newGrid[emptyRow][c] = candy;
        emptyRow--;
      }
    }
  }

  return newGrid;
};

/**
 * Checks if there is at least one possible move.
 */
export const hasPossibleMoves = async (
  grid: (CandyKey | null)[][]
): Promise<boolean> => {
  const rows = grid.length;
  const cols = grid[0].length;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const current = grid[r][c];
      if (current === null) continue;

      // Right swap
      if (c + 1 < cols && grid[r][c + 1] !== null) {
        const swapped = grid.map((row) => [...row]);
        [swapped[r][c], swapped[r][c + 1]] = [swapped[r][c + 1], swapped[r][c]];
        const matches = await checkForMatches(swapped);
        if (matches.length > 0) return true;
      }

      // Down swap
      if (r + 1 < rows && grid[r + 1][c] !== null) {
        const swapped = grid.map((row) => [...row]);
        [swapped[r][c], swapped[r + 1][c]] = [swapped[r + 1][c], swapped[r][c]];
        const matches = await checkForMatches(swapped);
        if (matches.length > 0) return true;
      }
    }
  }

  return false;
};

