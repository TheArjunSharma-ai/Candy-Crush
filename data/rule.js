//rule of lodo game
export const LodoRules = {
  maxPlayers: 4,
  minPlayers: 2,
  maxDiceValue: 6,
  winningScore: 100,
  // Add more rules as needed
};
const saveMoves = [];
export const playersMoves = (DiceValue, player,rerollDice) => {

    if(saveMoves.length>0){
        const lastMove = saveMoves[saveMoves.length - 1];
        console.log('resetting saveMoves for new player',saveMoves);
        if(lastMove.player === player){
            return lastMove.moves;
        }
        else{
            saveMoves =[];
        }
    }
    switch (DiceValue) {
        case 1:
            return 1;
        case 2:
            return 2;
        case 3:
            return 3;
        case 4:
            return 4;
        case 5:
            return 5;
        case 6:
            saveMoves.push({ player: player, moves: 6 });
            return rerollDice;
        default:
            return 0;
    }
};
export const isPlayerValidMoves = (players) => {
    const moves = playersMoves(DiceValue, player, rerollDice);
    console.log('Player', player, 'moves:', moves);
    return moves;
}
// gameLogic.js
const SAFE_CELLS = [0, 8, 13, 21, 26, 34, 39, 47]; // standard safe zones

const PLAYER_PATHS = {
  red: { start: 0, homeEntry: 51, homePathStart: 100 },
  green: { start: 13, homeEntry: 12, homePathStart: 200 },
  yellow: { start: 26, homeEntry: 25, homePathStart: 300 },
  blue: { start: 39, homeEntry: 38, homePathStart: 400 },
};

export const getNextPosition = (player, currentPos, diceValue) => {
  const path = PLAYER_PATHS[player.color];
new Player(this.players.length + 1, name, color);
  // Token still in base (home)
  if (currentPos === -1) {
    if (diceValue === 6) return path.start;
    return -1; // can’t move
  }

  // If token is on outer path
  if (currentPos < 52) {
    let next = (currentPos + diceValue) % 52;
    // Check if about to enter home path
    if (
      (currentPos <= path.homeEntry && next > path.homeEntry) ||
      (path.homeEntry === 51 && (currentPos > path.homeEntry || next < path.start))
    ) {
      // Enter home path
      const stepsToHome = diceValue - (52 - (path.homeEntry - currentPos + 1));
      if (stepsToHome <= 6) {
        return path.homePathStart + stepsToHome - 1;
      }
      return -1; // overshoot
    }
    return next;
  }

  // Inside home path (100–405 range)
  const homeIndex = currentPos - path.homePathStart + diceValue;
  if (homeIndex < 6) return path.homePathStart + homeIndex;
  if (homeIndex === 6) return "home"; // reached final
  return -1; // overshoot (cannot move)
}

