import { factory } from "./main.js";
  //Check if Piece is in the way for pawn and rokeren!
  // Write capture logic
  // Add rokeren
  // Add en passant
  // Add pawn reaches end of board

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

  checkIfPieceIsInTheWay(position, moveVector) {

  };

  getValidMove(currentPosition, moveVector) {
    const position = this.calculatePosition(currentPosition, moveVector);
    const positionOnBoard = this.checkIfPositionIsOnBoard(position);
    const squareIsEmpty = this.checkIfSquareIsEmpty(position); //This does not make it invalid, it means capturing if opposite color
    if (positionOnBoard === true && squareIsEmpty === true) {
      this.validMoves.push(position);
      console.log("Valid moves: " + this.validMoves);
    } else {
      console.log("Move was not valid. positionOnBoard = " + positionOnBoard + " and squareIsEmpty = " + squareIsEmpty);
    };
  };

  movePiece(currentPosition, validMove, pieceName) {
    let boardState = factory._board;
    boardState[currentPosition[0]][currentPosition[1]] = false;
    const validPosition = this.calculatePosition(currentPosition, validMove);
    boardState[validPosition[0]][validPosition[1]] = pieceName;
  };

  capturePiece() {
    //pawn

    //rest
    //get all possible moves
    //check for each move
      //check if square is empty
    //check if piece is opposite color 
  };
};

export class PawnGameLogic extends Piece {  
  getPossibleMoves() {
    if (this.hasMoved) {
      this.possibleMoves = this.color === "white" ? [1, 0] : [-1, 0];
    } else if (!this.hasMoved) {
      this.possibleMoves = this.color === "white" ? [[1, 0], [2, 0]] : [[-1, 0], [-2, 0]];
    };
  };
};

const pawn = new PawnGameLogic("black", 2);
//pawn.getValidMove([1, 4], [1, 1]);
pawn.movePiece([1, 4], [1, 1], "pawnBlack");

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

export class KnightLogic extends Piece {
  constructor(color, number) {
    this.color = color;
    this.number = number;
    this.hasMoved = false;
    this.possibleMovesMoves = [
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