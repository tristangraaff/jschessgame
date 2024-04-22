import { factory } from "./main.js";
import GameState from "./main.js";
import cloneDeep from 'https://cdn.skypack.dev/lodash.clonedeep';


  //Check if Piece is in the way for pawn and rokeren!
  // Write capture logic
  // Add rokeren
  // Add en passant
  // Add pawn reaches end of board

export default class Piece {
  constructor(color) {
    //this.boardState = factory._board;
    this.color = color;
    this.possibleMoves = [];
    this.validMoves = [];
    this.gameState = GameState;
    this.instanceIsPawn = false;
    this.checkingForCheckMate = false;
  };

  calculatePosition(currentPosition, moveVector) {
    const newRow = currentPosition[0] + moveVector[0];
    const newCol = currentPosition[1] + moveVector[1];
    const newPosition = [newRow, newCol];
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
    return factory.board[position[0]][position[1]] === false ? true : false;
  };

  isEnemyPosition(position) {
    const boardPosition = factory.board[position[0]][position[1]];

    if (!this.checkingForCheckMate) {
      if (typeof boardPosition === "object" && this.gameState.currentPlayer !== boardPosition.color) {
        return true;
      } else {
        return false;
      };
    } 

    else if (this.checkingForCheckMate) {
      if (typeof boardPosition === "object" && this.gameState.currentPlayer === boardPosition.color) {
        return true;
      } else {
        return false;
      };
    };
  };

  checkIfPieceIsInTheWay(position, moveVector) {
    const [startRow, startCol] = position;
    const [rowMove, colMove] = moveVector;
    const [desiredRow, desiredCol] = [startRow + rowMove, startCol + colMove];

    const rowIncrement = Math.sign(rowMove);
    const colIncrement = Math.sign(colMove);

    let row = startRow + rowIncrement;
    let col = startCol + colIncrement

    let pieceInTheWay = false;

    for (; row !== desiredRow || col !== desiredCol; row += rowIncrement, col += colIncrement) {
      if (typeof factory.board[row][col] === "object") {
        return pieceInTheWay = true;
      };
    };
  
    return pieceInTheWay;
  };

  getValidMoves(currentPosition, possibleMoves) {
    console.log(currentPosition);
    this.validMoves = [];
    this.calculateValidMoves(currentPosition, possibleMoves, this.instanceIsPawn);
  };

  calculateValidMoves(currentPosition, possibleMoves, dealingWithPawn) {
    this.doesMoveExposeKing();
    const moves = Array.isArray(possibleMoves[0]) ? possibleMoves : [possibleMoves];

    for (let i = 0; i< moves.length; i++) {
      const possiblePosition = this.calculatePosition(currentPosition, moves[i]);
      console.log("Possible possition: " + possiblePosition);
      const positionOnBoard = this.checkIfPositionIsOnBoard(possiblePosition);
      console.log("Position on board: " + positionOnBoard);
      if (positionOnBoard) {
        const pieceInTheWay = this.checkIfPieceIsInTheWay(currentPosition, moves[i]);
        console.log("Piece in the way: " + pieceInTheWay);
        const squareIsEmpty = this.checkIfSquareIsEmpty(possiblePosition); //This does not make it invalid, it means capturing if opposite color
        console.log("Square is empty: " + squareIsEmpty);
        const isEnemyPosition = this.isEnemyPosition(possiblePosition);
        console.log("Is enemy position: " + isEnemyPosition);

        if (!dealingWithPawn) {
          if ((positionOnBoard && !pieceInTheWay) && (squareIsEmpty || isEnemyPosition)) {
            const possiblePositionArray = [possiblePosition];
            console.log("Valid position: " + possiblePositionArray);
            this.validMoves.push(...possiblePositionArray);
          };
        }

        else if (dealingWithPawn) {
          if (positionOnBoard && !pieceInTheWay && squareIsEmpty) {
            const possiblePositionArray = [possiblePosition];
            console.log("Valid position: " + possiblePositionArray);
            this.validMoves.push(...possiblePositionArray);
          };
        };
      };
    };
  };

  movePiece(currentPosition, validPosition) {
    const pieceToBeMoved = factory._board[currentPosition[0]][currentPosition[1]];
    if (pieceToBeMoved instanceof Pawn && !pieceToBeMoved.hasMoved) {
      pieceToBeMoved.hasMoved = true;
      pieceToBeMoved.getPossibleMoves();
    };

    factory._board[currentPosition[0]][currentPosition[1]] = false;
    factory._board[validPosition[0]][validPosition[1]] = pieceToBeMoved;

    this.isKingInCheck(validPosition);
  };

  isKingInCheck(position) {
    let kingLocation;

    const piece = factory._board[position[0]][position[1]];
    if (piece.constructor.name === "Pawn") {
      this.instanceIsPawn = true;
    };
    const possibleMoves = piece.possibleMoves;

    this.getValidMoves(position, possibleMoves);
    this.validMoves.forEach(validMove => {
      const [rowIndex, colIndex] = validMove;
      if (typeof factory.board[rowIndex][colIndex] === "object") {
        if (factory.board[rowIndex][colIndex].constructor.name === "King") {
          this.gameState.kingChecked = true;
          kingLocation = [rowIndex, colIndex];
        };
      };
    });

    if (this.gameState.kingChecked) {
      this.isCheckmate(kingLocation);
    };
  };

  isCheckmate(kingLocation) {
    this.checkingForCheckMate = true;
    console.log("START NEW");
    //Also check for Stalemate here?

    //Checkmate when:
    // No possible moves for King
    const [rowIndex, colIndex] = kingLocation;
    const king = factory.board[rowIndex][colIndex];
    this.instanceIsPawn = false;
    this.getValidMoves(kingLocation, king.possibleMoves);



    // No pieces can jump in front
  };

  doesMoveExposeKing(currentPosition, move) {
    //simulate the move
    let boardStateClone = cloneDeep(factory._board);
    

    //then run isKingInCheck
  };

  checkIfKingIsUnchecked() {

  };
};

export class Pawn extends Piece {
  constructor(color) {
    super(color);
    this.hasMoved = false;
    this.possibleCaptureMoves = [];
    this.getPossibleMoves();
  };
  
  getPossibleMoves() {
    if (this.hasMoved) {
      this.possibleMoves = this.color === "white" ? [-1, 0] : [1, 0];
    } else if (!this.hasMoved) {
      this.possibleMoves = this.color === "white" ? [[-1, 0], [-2, 0]] : [[1, 0], [2, 0]];
    };

    const possibleCaptureMoves = this.color === "white" ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]];
    this.possibleCaptureMoves = possibleCaptureMoves;
  };

  //This method overwrites the method in the parent class since the Pawn's capturing rules are different from other pieces.
  getValidMoves(currentPosition, possibleMoves) {
    this.validMoves = [];

    //I'm going to use this.getPossibleMoves here because it's better for SoC. The other getValidMoves functionality get's it's input from the DOM through a param, that needs to be refactored later on.
    this.possibleCaptureMoves.forEach(captureMove => {
      const possibleCapture = this.calculatePosition(currentPosition, captureMove);
      const isEnemyPosition = this.isEnemyPosition(possibleCapture);

      if (isEnemyPosition) {
        this.validMoves.push(possibleCapture);
      };
    });

    this.instanceIsPawn = true;
    this.calculateValidMoves(currentPosition, this.possibleMoves, this.instanceIsPawn);
  };
};

export class Knight extends Piece {
  constructor(color) {
    super(color);
    this.possibleMoves = [
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

  checkIfPieceIsInTheWay() {
    console.log("This method overwrites the method in the parent class because the rule does not apply to the Knight.")
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