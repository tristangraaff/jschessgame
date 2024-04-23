// To run jest with ES6: node --experimental-vm-modules node_modules/jest/bin/jest.js

// Next steps:
// Find out why non imported test code is tested
// Test existing DOM code
// checkmate
// resignation

//stalemate
//insufficient material
// 50 move-rule
// repetition
// agreement

export class GameState {
  static board = Array.from({ length: 8 }, () => Array(8).fill(false));
  static turnCount = 1;
  static currentPlayer = "white";
  static activeGame = true;
  static kingChecked = false;

  static changeTurn() {
      this.turnCount += 1;
      this.currentPlayer = (this.currentPlayer === "white") ? "black" : "white";
      console.log(this.kingChecked);
      //this.kingChecked = false;
      //console.log(this.kingChecked);
  };
};

export class PieceFactory {
  static activePieces = [];
  static capturedPieces = [];
  static _board = GameState.board;

  static addPiece(pieceInstance, row, col) {
    this._board[row][col] = pieceInstance;
  };

  static get board() {
    return this._board;
  };

  static set board(newBoard) {
    this._board = newBoard;
  };
};
