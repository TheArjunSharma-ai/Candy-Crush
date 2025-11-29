import { Level } from "./LevelContext";
const root = '../../../../assets/candies/';

const candyImages: Record<number, any> = {
  // Empty Tiles
  0: require(root + "blank.png"),

  // Normal Candies (1–6)
  1: require(root + "red.png"),
  2: require(root + "green.png"),
  3: require(root + "blue.png"),
  4: require(root + "purple.png"),
  5: require(root + "orange.png"),
  6: require(root + "yellow.png"),

  /** Fish Special Candies → 21–26 */
  21: require(root + "redFish.png"),
  22: require(root + "greenFish.png"),
  23: require(root + "blueFish.png"),
  24: require(root + "purpleFish.png"),
  25: require(root + "orangeFish.png"),
  26: require(root + "yellowFish.png"),

  /** Line Blast Special Candies → 31–36 */
  31: require(root + "LineRed.svg"),
  32: require(root + "LineGreen.svg"),
  33: require(root + "LineBlue.svg"),
  34: require(root + "LinePurple.svg"),
  35: require(root + "LineOrange.svg"),
  36: require(root + "LineYellow.svg"),

  /** Line Blast Special Candies → 31–36 */
  41: require(root + "Bomb.png"),
  42: require(root + "Bomb.png"),
  43: require(root + "Bomb.png"),
  44: require(root + "Bomb.png"),
  45: require(root + "Bomb.png"),
  46: require(root + "Bomb.png"),

  /** Bomb Special Candies → 51–56 */
//   51: require(root + "redBomb.png"),
//   52: require(root + "greenBomb.png"),
//   53: require(root + "blueBomb.png"),
//   54: require(root + "purpleBomb.png"),
//   55: require(root + "orangeBomb.png"),
//   56: require(root + "yellowBomb.png"),
};


export const CandyTypes = [1,2,3,4,5];
export type CandyKey = keyof typeof candyImages;

// Define a 2D grid type of CandyKey or null
export type TileCandyKey = (CandyKey | null)[][];
export type TileMove = number | null;
export type TileTime = number | null;

interface GameLevel {
    id: number;
    target: number;
    moves: TileMove;
    grid: TileCandyKey; // Corrected type reference
    timer: TileTime ;
}

export const getCandyImage = (candyKey: number|string) => candyImages[candyKey as CandyKey];

export const getGameLevel = (id:number)=>{
    const gameLevel = gameLevels[id];
    return gameLevel;
}

const gameLevels: { [key: string]: GameLevel} = {
    1: {
        id: 1,
        grid:[
            [null,1,3,1,5,null],
            [2,4,5,3,2,2],
            [3,2,1,22,3,2],
            [1,5,1,3,22,3],
            [4,3,4,1,4,5],
            [null,2,5,4,3,null],
        ],
        moves:9999,
        target:100,
        timer:230000,
    },
    2: {
        id: 2,
        grid:[
            [null,2,4,2,2,null],
            [null,null,5,3,3,1],
            [3,2,1,4,5,3],
            [1,5,2,3,4,3],
            [4,3,4,2,1,5],
            [null,2,5,4,3,null],
        ],
        timer:null,
        moves:25,
        target:100,
    },
    3: {
        id: 3,
        grid:[
            [null,3,1,4,2,null],
            [2,4,5,3,2,1],
            [3,2,1,4,5,2],
            [1,5,2,3,4,3],
            [4,3,4,2,1,5],
            [null,2,5,4,3,null],
        ],
        moves:9999,
        target:150,
        timer:300000
    },
    4: {
        id: 4,
        grid:[
            [null,4,2,5,3,null],
            [2,4,5,3,2,1],
            [3,2,1,4,5,2],
            [1,5,2,3,4,3],
            [4,3,4,2,1,5],
            [null,2,5,4,3,null],
        ],
        moves:35,
        target:200,
        timer:null
    },
    5: {
        id: 5,
        grid:[
            [null,5,3,1,4,null],
            [2,4,5,3,2,1],
            [3,2,1,4,5,2],
            [1,5,2,3,4,3],
            [4,3,4,2,1,5],
            [null,2,5,4,3,null],
        ],
        moves:40,
        timer:null,
        target:300,
    },
}

export const initialLevelData:Level[] = [
    {id:1,unlocked:true,highScore:0,moves:20,completed:false},
    {id:2,unlocked:false,highScore:0,moves:25,completed:false},
    {id:3,unlocked:false,highScore:0,moves:30,completed:false},
    {id:4,unlocked:false,highScore:0,moves:35,completed:false},
    {id:5,unlocked:false,highScore:0,moves:40,completed:false},
]