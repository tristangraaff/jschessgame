//import Piece from "./pieceLogic.js";
//import { PawnGameLogic, BishopLogic, KnightLogic, RookLogic, QueenLogic, KingLogic, }  from "./pieceLogic.js";
//import DomManipulation from "./dom.js";
//import { PieceSelector } from "./dom.js";

// To run jest with ES6: node --experimental-vm-modules node_modules/jest/bin/jest.js

// Next steps:
// Find out why non imported test code is tested
// Test existing DOM code
// Add turn logic / win condition
// add movement
// add logic per piece: special rules (rokeren, en passant)
// add capturing pieces 

export default class GameState {
  static board = Array.from({ length: 8 }, () => Array(8).fill(false));
  static turnCount = 1;
  static currentPlayer = "white";
  static activeGame = true;

  // checkmate
  // resignation

  //stalemate
  //insufficient material
  // 50 move-rule
  // repetition
  // agreement

  static checkForCheckmate() {
    //If King is checked, then check for checkmate
    //Also steelmate?
  };

  static changeTurn() {
      this.turnCount += 1;
      this.currentPlayer = (this.currentPlayer === "white") ? "black" : "white";
  };
};

export class PieceFactory {
  constructor() {
    this.activePieces = [];
    this.capturedPieces = [];
    this.board = GameState.board;
  };
  
  addPiece(pieceInstance, row, col) {
    this.board[row][col] = pieceInstance;
  };

  get board() {
    return this._board;
  };

  set board(newBoard) {
    this._board = newBoard;
  };
};

export const factory = new PieceFactory();
