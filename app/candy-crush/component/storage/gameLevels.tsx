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
   31: require(root + "redHorizontalLine.png"),
  32: require(root + "greenHorizontalLine.png"),
  33: require(root + "blueHorizontalLine.png"),
  34: require(root + "purpleHorizontalLine.png"),
  35: require(root + "orangeHorizontalLine.png"),
  36: require(root + "yellowHorizontalLine.png"),

/** Line Blast Special Candies → 41–46 */
   41: require(root + "redVerticleLine.png"),
  42: require(root + "greenVerticleLine.png"),
  43: require(root + "blueVerticleLine.png"),
  44: require(root + "purpleVerticleLine.png"),
  45: require(root + "orangeVerticleLine.png"),
  46: require(root + "yellowVerticleLine.png"),
  /** Line Blast Special Candies → 31–36 */
  51: require(root + "redeWrapper.png"),
  52: require(root + "greenWrapper.png"),
  53: require(root + "blueWrapper.png"),
  54: require(root + "purpleWrapper.png"),
  55: require(root + "orangeWrapper.png"),
  56: require(root + "YellowWrapper.png"),

  /** Bomb Special Candies → 61–66 */
  61: require(root + "Bomb.png"),
  62: require(root + "Bomb.png"),
  63: require(root + "Bomb.png"),
  64: require(root + "Bomb.png"),
  65: require(root + "Bomb.png"),
  66: require(root + "Bomb.png"),
};


export const CandyTypes = [1,2,3];
export type CandyKey = keyof typeof candyImages;

// Define a 2D grid type of CandyKey or null
export type TileCandyKey = (CandyKey | null)[][];
export type TileTime = number | null;

interface GameLevel {
    id: number;
    target: number;
    moves: number;
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
            [1,4,5,3,3,1],
            [3,2,1,22,3,2],
            [1,22,4,4,35,2],
            [4,3,4,1,1,5],
            [null,1,5,43,3,null],
        ],
        moves:0,
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
        moves:0,
        target:150,
        timer:300000
    },
    4: {
        id: 4,
        grid:[
            [null,4,5,3,3,null],
            [2,4,3,1,2,1],
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
    6:{
        id:6,
        moves:30,
        timer:null,
        target:100,
        grid:[
            [null,2,2,5],
            [null,null,2,1],
            [null,2,1,null],
            [1,5,1,null]
        ]
    }
}

export const initialLevelData:Level[] = [
    {id:1,unlocked:true,highScore:0,moves:20,completed:false},
    {id:2,unlocked:false,highScore:0,moves:25,completed:false},
    {id:3,unlocked:false,highScore:0,moves:30,completed:false},
    {id:4,unlocked:false,highScore:0,moves:35,completed:false},
    {id:5,unlocked:false,highScore:0,moves:40,completed:false},
    {id:6,unlocked:false,highScore:0,moves:40,completed:false},
]