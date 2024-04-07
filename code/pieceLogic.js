import { factory } from "./main.js";
  //Check if Piece is in the way for pawn and rokeren!
  // Write capture logic
  // Add rokeren
  // Add en passant
  // Add pawn reaches end of board

export default class Piece {
  constructor(color) {
    this.color = color;
    this.hasMoved = false;
    this.possibleMoves = [];
    this.validMoves = [];
  };

  calculatePosition(currentPosition, moveVector) {
    const newRow = currentPosition[0] + moveVector[0];
    const newCol = currentPosition[1] + moveVector[1];
    const newPosition = [newRow, newCol];
    //console.log("New position:", newPosition);
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
    return factory._board[position[0]][position[1]] === false ? true : false;
  };

  checkIfPieceIsInTheWay(position, moveVector) {

  };

  getValidMoves(currentPosition, possibleMoves) {
    for (let i = 0; i< this.possibleMoves.length; i++) {
      const possiblePosition = this.calculatePosition(currentPosition, possibleMoves[i]);
      const positionOnBoard = this.checkIfPositionIsOnBoard(possiblePosition);
      const squareIsEmpty = this.checkIfSquareIsEmpty(possiblePosition); //This does not make it invalid, it means capturing if opposite color
      if (positionOnBoard === true && squareIsEmpty === true) {
        this.validMoves.push(possiblePosition);
      } else {
        console.log("Move was not valid. positionOnBoard = " + positionOnBoard + " and squareIsEmpty = " + squareIsEmpty);
      }; 
    };
  };

  movePiece(currentPosition, validMove, pieceName) {
    let boardState = factory._board;
    boardState[currentPosition[0]][currentPosition[1]] = false;
    const validPosition = this.calculatePosition(currentPosition, validMove);
    boardState[validPosition[0]][validPosition[1]] = pieceName;
  };

  checkIfPieceCanBeCaptured(ownPosition, otherPosition) {
    //rest
    //get all possible moves
    //check for each move
      //check if square is empty
    //check if piece is opposite color

    if (this.constructor.name != "Pawn") {

    };
    
    if (this.constructor.name == "Pawn") {

    };
  };
};

export class Pawn extends Piece {
  constructor(color) {
    super(color);
    this.getPossibleMoves();
  };
  
  getPossibleMoves() {
    if (this.hasMoved) {
      this.possibleMoves = this.color === "white" ? [-1, 0] : [1, 0];
    } else if (!this.hasMoved) {
      this.possibleMoves = this.color === "white" ? [[-1, 0], [-2, 0]] : [[1, 0], [2, 0]];
    };
  };
};

const pawn = new Pawn("black");
//pawn.getValidMove([1, 4], [1, 1]);
pawn.movePiece([1, 4], [1, 1], "pawnBlack");

export class Knight extends Piece {
  constructor(color) {
    super(color);
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

export class Bishop extends Piece {
  constructor(color) {
    super(color);
    this.getPossibleMoves();
  };

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
  
export class Rook extends Piece {
  constructor(color) {
    super(color);
    this.getPossibleMoves();
  };

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

export class Queen extends Piece {
  constructor(color) {
    super(color);
    this.getPossibleMoves();
  };

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

export class King extends Piece {
  constructor(color) {
    super(color)
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

for (let i = 0; i < 8; i++) {
  factory.addPiece(new Pawn("black"), 1, i);
  factory.addPiece(new Pawn("white"), 6, i);
};

factory.addPiece(new Rook("black"), 0, 0);
factory.addPiece(new Rook("black"), 0, 7);
factory.addPiece(new Rook("white"), 7, 0);
factory.addPiece(new Rook("white"), 7, 7);

factory.addPiece(new Knight("black"), 0, 1);
factory.addPiece(new Knight("black"), 0, 6);
factory.addPiece(new Knight("white"), 7, 1);
factory.addPiece(new Knight("white"), 7, 6);

factory.addPiece(new Bishop("black"), 0, 2);
factory.addPiece(new Bishop("black"), 0, 5);
factory.addPiece(new Bishop("white"), 7, 2);
factory.addPiece(new Bishop("white"), 7, 5);

factory.addPiece(new Queen("black"), 0, 3);
factory.addPiece(new Queen("white"), 7, 3);

factory.addPiece(new King("black"), 0, 4);
factory.addPiece(new King("white"), 7, 4);

console.log(factory.board);