export default class Piece {
  // while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
  //   // Check if the square is empty or contains an opponent's piece
  //   if (!board[newRow][newCol]) {
  //     validMoves.push([newRow, newCol]);
  //   } else {
  //     // Stop checking in this direction if there's an obstacle
  //     break;
  //   }

    // // Check if the new position is within the board boundaries
  // if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
  //   validMoves.push([newRow, newCol]);
  // } else {
  //   // Stop checking in this direction if out of bounds
  //   break;
  // }
};

export class PawnGameLogic {
    constructor(color, number) {
      this.color = color;
      this.number = number;
      this.hasMoved = false;
    };
  
    getValidMoves() {
      if (this.hasMoved) {
        return this.color === "white" ? [1] : [-1];
      } else if (!this.hasMoved) {
        return this.color === "white" ? [1, 2] : [-1, -2];
      };
    };
  };


export class BishopLogic {
  constructor(color, number) {
    this.color = color;
    this.number = number;
    this.hasMoved = false;
    this.validMoves = [];
  };

  getValidMoves() {
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
        this.validMoves.push([newRow, newCol]);
      };
    };      
  };
};
  
export class RookLogic {
  constructor(color, number) {
    this.color = color;
    this.number = number;
    this.hasMoved = false;
    this.validMoves = [];
  };

  getValidMoves() {
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
        this.validMoves.push([newRow, newCol]);
      };
    }; 

  };
};

export class QueenLogic {

};

export class KingLogic {

};

export class KnightLogic {
  constructor(color, number) {
    this.color = color;
    this.number = number;
    this.hasMoved = false;
    this.validMoves = [[-1, -2], [-1, 2], [-2, -1], [-2, 1], [1, -2], [1, 2], [2, -1], [2, 1]]; 
  };
};