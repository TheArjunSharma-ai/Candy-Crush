export const players = [
  { id: 1, name: "Player 1", score: 0, isActive: true, icon: 'fly' ,color:'red'},
  { id: 2, name: "Player 2", score: 0, isActive: true, icon: 'smile', color:'blue' },
  { id: 3, name: "Player 3", score: 0, isActive: true, icon: 'bug1', color:'green' },
  { id: 4, name: "Player 4", score: 0, isActive: true, icon: 'spider', color:'yellow' },
];
export const boardSize = 4;
export const winningScore = 100;



// Token & Player models
class Token {
  constructor(id) {
    this.id = id;
    this.position = -1;
    this.isFinished = false;
  }
}

class Player {
  constructor(id, name, color) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.tokens = [new Token(1), new Token(2), new Token(3), new Token(4)];
  }
}

class GameManager {
  constructor(maxPlayers) {
    this.maxPlayers = maxPlayers;
    this.players = [];
    this.currentTurnIndex = 0;
    this.diceValue = 0;
    this.isStarted = false;
  }

  addPlayer(name, color) {
    const p = new Player(this.players.length + 1, name, color);
    this.players.push(p);
    if (this.players.length === this.maxPlayers) this.isStarted = true;
    return p;
  }

  rollDice() {
    this.diceValue = Math.floor(Math.random() * 6) + 1;
    return this.diceValue;
  }

  moveToken(playerId, tokenId) {
    const player = this.players.find((p) => p.id === playerId);
    const token = player?.tokens.find((t) => t.id === tokenId);
    if (!token || token.isFinished) return;

    const newPos = getNextPosition(player, token.position, this.diceValue);
    if (newPos === -1) return; // invalid move
    if (newPos === "home") {
      token.isFinished = true;
      token.position = "home";
    } else {
      token.position = newPos;
    }

    // Handle kills (if not in safe cell)
    if (!SAFE_CELLS.includes(token.position)) {
      this.players.forEach((other) => {
        if (other.id !== player.id) {
          other.tokens.forEach((t) => {
            if (t.position === token.position) {
              t.position = -1; // send back home
            }
          });
        }
      });
    }
  }

  nextTurn() {
    this.currentTurnIndex = (this.currentTurnIndex + 1) % this.players.length;
    return this.players[this.currentTurnIndex];
  }

  getState() {
    return {
      players: this.players,
      currentTurn: this.players[this.currentTurnIndex],
      diceValue: this.diceValue,
    };
  }
}

// Setup static game
const game = new GameManager(4);
game.addPlayer("Player 1", "red");
game.addPlayer("Player 2", "green");
game.addPlayer("Player 3", "yellow");
game.addPlayer("Player 4", "blue");
game.isStarted = true;