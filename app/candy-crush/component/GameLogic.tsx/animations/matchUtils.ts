import { TileCandyKey } from "../../storage/gameLevels";
import { MatchCell, normalize } from "./Types";

// Compare candies but treat fish variants (20+) as same color
const equalCandy = (a: number | null, b: number | null) =>
    normalize(a) === normalize(b);

// ---------------------------------------------------
// HORIZONTAL MATCHES
// ---------------------------------------------------
export const getHorizontalMatches = (grid: TileCandyKey): MatchCell[] => {
    const output: MatchCell[] = [];

    for (let r = 0; r < grid.length; r++) {
        let streak = 1;

        for (let c = 0; c <= grid[r].length; c++) {
            const prev = grid[r][c - 1];
            const cur = grid[r][c];

            if (cur !== null && equalCandy(prev, cur)) {
                streak++;
            } else {
                if (prev !== null && streak >= 3) {
                    for (let i = 1; i <= streak; i++)
                        output.push({ row: r, col: c - i, value: grid[r][c - i] });
                }
                streak = 1;
            }
        }
    }
    return output;
};

// ---------------------------------------------------
// VERTICAL MATCHES
// ---------------------------------------------------
export const getVerticalMatches = (grid: TileCandyKey): MatchCell[] => {
    const output: MatchCell[] = [];
    const rows = grid.length;
    const cols = grid[0].length;

    for (let c = 0; c < cols; c++) {
        let streak = 1;

        for (let r = 0; r <= rows; r++) {
            const prev = grid[r - 1]?.[c];
            const cur = grid[r]?.[c];

            if (cur !== null && equalCandy(prev, cur)) {
                streak++;
            } else {
                if (prev !== null && streak >= 3) {
                    for (let i = 1; i <= streak; i++)
                        output.push({ row: r - i, col: c, value: grid[r - i][c] });
                }
                streak = 1;
            }
        }
    }
    return output;
};

// ---------------------------------------------------
// 2×2 BLOCK MATCHES
// ---------------------------------------------------
export const get2x2BlockMatches = (grid: TileCandyKey): MatchCell[] => {
    const output: MatchCell[] = [];

    for (let r = 0; r < grid.length - 1; r++) {
        for (let c = 0; c < grid[0].length - 1; c++) {
            const base = normalize(grid[r][c]);
            if (
                base !== null &&
                normalize(grid[r][c + 1]) === base &&
                normalize(grid[r + 1][c]) === base &&
                normalize(grid[r + 1][c + 1]) === base
            ) {
                output.push(
                    { row: r, col: c, value: grid[r][c] },
                    { row: r, col: c + 1, value: grid[r][c + 1] },
                    { row: r + 1, col: c, value: grid[r + 1][c] },
                    { row: r + 1, col: c + 1, value: grid[r + 1][c + 1] }
                );
            }
        }
    }

    // Remove duplicates
    return output.filter(
        (m, i, arr) =>
            arr.findIndex((x) => x.row === m.row && x.col === m.col) === i
    );
};

// ---------------------------------------------------
// COMBINED MATCH FINDER
// ---------------------------------------------------
export const findAllMatches = (
    grid: TileCandyKey
): MatchCell[] => {
    const all = [
        ...getHorizontalMatches(grid),
        ...getVerticalMatches(grid),
        ...get2x2BlockMatches(grid),
    ];

    // unique
    return all.filter(
        (m, i, arr) =>
            arr.findIndex((x) => x.row === m.row && x.col === m.col) === i
    );
};
export const applySpecialCandy = (spacial: any) => {
    const candy = spacial.center.value || 0;
    switch (spacial.type) {
        case 'bomb': return candy + 40;
        case 'column': return candy + 30;
        case 'line': return candy + 30;
        case 'fish': return candy + 20;
        case 'wrapped': return candy + 40;
        case 'colorBomb': return candy + 40;
    }
}

// ---------------------------------------------------
// SPECIAL CANDY DETECTION (FULL SET)
// ---------------------------------------------------
export const detectSpecialCandy = (matches: MatchCell[]) => {
    if (!matches.length) return null;

    const sorted = [...matches].sort(
        (a, b) => (a.row === b.row ? a.col - b.col : a.row - b.row)
    );

    // 5+ in a line → BOMB
    if (sorted.length >= 5 && isStraightLine(sorted)) {
        return { type: "bomb", center: sorted[Math.floor(sorted.length / 2)] };
    }

    // 3×3 wrapped → "wrapped" (L or T shape)
    if (isWrappedStructure(sorted)) {
        return { type: "wrapped", center: findWrappedCenter(sorted) };
    }

    // 2×2 block → FISH
    if (sorted.length === 4 && is2x2Block(sorted)) {
        return { type: "fish", center: sorted[1] };
    }

    // 4-in-row → horizontal line candy
    if (sorted.length === 4 && isHorizontal4(sorted)) {
        return { type: "line", center: sorted[1] };
    }

    // 4-in-column → vertical line candy
    if (sorted.length === 4 && isVertical4(sorted)) {
        return { type: "column", center: sorted[1] };
    }

    return null;
};

const isStraightLine = (cells: MatchCell[]) =>
    cells.every((c) => c.row === cells[0].row) ||
    cells.every((c) => c.col === cells[0].col);
const isHorizontal4 = (cells: MatchCell[]) =>
    cells.every((c) => c.row === cells[0].row);
const isVertical4 = (cells: MatchCell[]) =>
    cells.every((c) => c.col === cells[0].col);
const is2x2Block = (cells: MatchCell[]) => {
    const rows = new Set(cells.map((c) => c.row));
    const cols = new Set(cells.map((c) => c.col));
    return rows.size === 2 && cols.size === 2;
};
const isWrappedStructure = (cells: MatchCell[]) => {
    if (cells.length < 5) return false;

    // Must not be straight line
    if (isStraightLine(cells)) return false;

    // Count rows & cols
    const rowCount: Record<number, number> = {};
    const colCount: Record<number, number> = {};

    for (const c of cells) {
        rowCount[c.row] = (rowCount[c.row] || 0) + 1;
        colCount[c.col] = (colCount[c.col] || 0) + 1;
    }

    // T or L shape always has:
    // - One row with 3 tiles (horizontal bar)
    // - One column with 3 tiles (vertical bar)
    const hasRow3 = Object.values(rowCount).includes(3);
    const hasCol3 = Object.values(colCount).includes(3);

    return hasRow3 && hasCol3;
};
const findWrappedCenter = (cells: MatchCell[]) => {
    const byRow = cells.reduce((acc, c) => {
        acc[c.row] = (acc[c.row] || 0) + 1;
        return acc;
    }, {} as Record<number, number>);

    const byCol = cells.reduce((acc, c) => {
        acc[c.col] = (acc[c.col] || 0) + 1;
        return acc;
    }, {} as Record<number, number>);

    const centerRow = Number(Object.keys(byRow).find((r) => byRow[Number(r)] >= 3));
    const centerCol = Number(Object.keys(byCol).find((c) => byCol[Number(c)] >= 3));

    return cells.find((c) => c.row === centerRow && c.col === centerCol)!;
};
