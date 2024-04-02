import Piece from "./pieceLogic.js";
import { PawnGameLogic, BishopLogic, KnightLogic, RookLogic, QueenLogic, KingLogic, }  from "./pieceLogic.js";
import DomManipulation from "./dom.js";
import { PieceSelector } from "./dom.js";
import { EventService } from "./event.service.js";

eventService.on("pieceMoved", (newPosition) => {
  console.log("test");
});

// To run jest with ES6: node --experimental-vm-modules node_modules/jest/bin/jest.js

// Next steps:
// Find out why non imported test code is tested
// Test existing DOM code
// Add turn logic / win condition
// add movement
// add logic per piece: special rules (rokeren, en passant)
// write Piece class
// add capturing pieces 

const log = (input) => {
  console.log(input);
};

export default class GameState {
  static turnCount = 1;
  static turnPlayer = "white";
  static activeGame = true;
  static endOfTurn = false;

  // checkmate
  // resignation

  //stalemate
  //insufficient material
  // 50 move-rule
  // repetition
  // agreement

  static checkForCheckmate() {

  };

  static changeTurn() {
    if (this.endOfTurn) {
      this.turnCount += 1;
      this.turnPlayer = (this.turnPlayer === "white") ? "black" : "white";
      this.endOfTurn = false;
    };
  };
};

export class PieceFactory {
  constructor() {
    this.activePieces = [];
    this.capturedPieces = [];
    this.board = Array.from({ length: 8 }, () => Array(8).fill(false));
  };
  
  addPiece(pieceType, color, row, col) {
    this.board[row][col] = `${pieceType}${color}${row + 1}`;
  }
  
  addPiecesToBoard() {
    for (let i = 0; i < 8; i++) {
      this.addPiece("pawn", "Black", 1, i);
      this.addPiece("pawn", "White", 6, i);
    }

    this.addPiece("rook", "Black", 0, 0);
    this.addPiece("rook", "Black", 0, 7);
    this.addPiece("rook", "White", 7, 0);
    this.addPiece("rook", "White", 7, 7);

    this.addPiece("knight", "Black", 0, 1);
    this.addPiece("knight", "Black", 0, 6);
    this.addPiece("knight", "White", 7, 1);
    this.addPiece("knight", "White", 7, 6);

    this.addPiece("bishop", "Black", 0, 2);
    this.addPiece("bishop", "Black", 0, 5);
    this.addPiece("bishop", "White", 7, 2);
    this.addPiece("bishop", "White", 7, 5);

    this.addPiece("queen", "Black", 0, 3);
    this.addPiece("queen", "White", 7, 3);

    this.addPiece("king", "Black", 0, 4);
    this.addPiece("king", "White", 7, 4);

    console.log(this.board);
  };
  
  activatePieces() {
    for (let i = 1; i < 9; i++) {
      const pawnWhiteLogic = new PawnGameLogic("white", i);
      const pawnWhiteDom = new DomManipulation(pawnWhiteLogic);
      const pawnBlackLogic = new PawnGameLogic("black", i);
      const pawnBlackDom = new DomManipulation(pawnBlackLogic);
      this.activePieces.push(pawnWhiteDom);
      this.activePieces.push(pawnBlackDom);
    };
  };

  get board() {
    return this._board;
  };

  set board(newBoard) {
    this._board = newBoard;
  };
};

export const factory = new PieceFactory();
factory.activatePieces();
factory.addPiecesToBoard();

//const pieceSelector = new PieceSelector(pieces);
