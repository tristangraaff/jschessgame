import { factory } from "./main.js";

export default class Piece {
  constructor(color, number) {
    this.color = color;
    this.number = number;
    this.hasMoved = false;
    this.possibleMoves = [];
    this.validMoves = [];
  };

  calculatePosition(currentPosition, moveVector) {
    const newRow = currentPosition[0] + moveVector[0];
    const newCol = currentPosition[1] + moveVector[1];
    const newPosition = [newRow, newCol];
    console.log("New position:", newPosition);
    return newPosition;
  };

  checkIfPositionIsOnBoard(position) {
    const [row, col] = position;
    if (row < 0 || row > 7 || col < 0 || col > 7) {
      return false;
    } else {
      return true;
    };
  };

  checkIfSquareIsEmpty(position) {
    if (factory._board[position[0]][position[1]] === false) {
      console.log("Square is empty");
      return true;
    } else {
      return false;
    };
  };

  getValidMove(currentPosition, moveVector) {
    const position = this.calculatePosition(currentPosition, moveVector);
    const positionOnBoard = this.checkIfPositionIsOnBoard(position);
    const squareIsEmpty = this.checkIfSquareIsEmpty(position);
    if (positionOnBoard === true && squareIsEmpty === true) {
      this.validMoves.push(position);
    };
  };
};

export class PawnGameLogic extends Piece {  
  getValidMoves() {
    if (this.hasMoved) {
      this.possibleMoves = this.color === "white" ? [1, 0] : [-1, 0];
    } else if (!this.hasMoved) {
      this.possibleMoves = this.color === "white" ? [[1, 0], [2, 0]] : [[-1, 0], [-2, 0]];
    };
  };
};

const pawn = new PawnGameLogic("black", 2);
pawn.checkIfSquareIsEmpty([0,95]);

export class BishopLogic extends Piece {

  getPossibleMoves() {
    const boardSize = 8;
    const directions =[
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1]
    ];

    for (const [x, y] of directions) {
      for (let i = 1; i < boardSize; i++) {
        const newRow = i * x;
        const newCol = i * y;
        this.possibleMoves.push([newRow, newCol]);
      };
    };      
  };
};
  
export class RookLogic extends Piece {
  getPossibleMoves() {
    const boardSize = 8;
    const directions =[
      [0, -1],
      [0, 1],
      [-1, 0],
      [1, 0]
    ];

    for (const [x, y] of directions) {
      for (let i = 1; i < boardSize; i++) {
        const newRow = i * x;
        const newCol = i * y;
        this.possibleMoves.push([newRow, newCol]);
      };
    }; 
  };
};

export class QueenLogic extends Piece {
  getPossibleMoves() {
    const boardSize = 8;
    const directions =[
      [0, -1],
      [0, 1],
      [-1, 0],
      [1, 0],
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1]
    ];

    for (const [x, y] of directions) {
      for (let i = 1; i < boardSize; i++) {
        const newRow = i * x;
        const newCol = i * y;
        this.possibleMoves.push([newRow, newCol]);
      };
    }; 
  };
};

export class KingLogic extends Piece {
  constructor(color, number) {
    super(color, number)
    this.possibleMoves = [
      [0, -1],
      [0, 1],
      [-1, 0],
      [1, 0],
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1]
    ];
  // Rokeren toevoegen
  };
};

const king = new KingLogic("black");
console.log(king);


export class KnightLogic extends Piece {
  constructor(color, number) {
    this.color = color;
    this.number = number;
    this.hasMoved = false;
    this.validMoves = [
      [-1, -2],
      [-1, 2],
      [-2, -1],
      [-2, 1],
      [1, -2],
      [1, 2],
      [2, -1],
      [2, 1]
    ]; 
  };
};