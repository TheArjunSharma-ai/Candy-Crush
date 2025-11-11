import { Level } from "./LevelContext";

const root = '../../../../assets/candies/'
const candyImages = {
    0:require(root+'blank.png'),
    1:require(root+'red.png'),
    2:require(root+'green.png'),
    3:require(root+'blue.png'),
    4:require(root+'purple.png'),
    5:require(root+'yellow.png'),
} as const;
export const CandyTypes = [1,2,3,4,5];

export type CandyKey = keyof typeof candyImages;

interface GameLevel {
    id: number;
    target: number;
    moves: number;
    grid: (CandyKey | null)[][]; // Added grid property
    timer?:number;
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
            [2,4,5,3,2,1],
            [3,2,1,4,3,2],
            [1,5,1,3,4,3],
            [4,3,4,1,1,5],
            [null,2,5,4,3,null],
        ],
        moves:20,
        target:10,
        timer:130000,
    },
    2: {
        id: 2,
        grid:[
            [null,2,4,2,5,null],
            [null,null,5,3,2,1],
            [3,2,1,4,5,2],
            [1,5,2,3,4,3],
            [4,3,4,2,1,5],
            [null,2,5,4,3,null],
        ],
        moves:25,
        target:1500,
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
        moves:30,
        target:2000,
        timer:30000
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
        target:2500,
        timer:45000
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
        target:3000,
    },
}

export const initialLevelData:Level[] = [
    {id:1,unlocked:true,highScore:0,moves:20,completed:false},
    {id:2,unlocked:false,highScore:0,moves:25,completed:false},
    {id:3,unlocked:false,highScore:0,moves:30,completed:false},
    {id:4,unlocked:false,highScore:0,moves:35,completed:false},
    {id:5,unlocked:false,highScore:0,moves:40,completed:false},
]