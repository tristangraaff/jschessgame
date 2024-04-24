import { PieceFactory, GameState } from "./main.js";
import cloneDeep from 'https://cdn.skypack.dev/lodash.clonedeep';

  //Check if Piece is in the way for pawn and rokeren!
  // Write capture logic
  // Add rokeren
  // Add en passant
  // Add pawn reaches end of board
  // Add piece location to constructor instead of double for looping every time!

class Piece {
  constructor(color, position) {
    //this.boardState = factory._board;
    this.color = color;
    this.piecePosition = position;
    this.possibleMoves = [];
    this.validMoves = [];
    this.gameState = GameState;
    this.instanceIsPawn = false;
    this.checkingForCheckMate = false;
  };

  getValidMoves(currentPiecePosition, possibleMoves) {
    this.validMoves = [];
    this.calculateValidMoves(currentPiecePosition, possibleMoves, this.instanceIsPawn);
  };

  calculateValidMoves(currentPosition, possibleMoves, dealingWithPawn) {
    //this.doesMoveExposeKing(currentPosition, possibleMoves[0]);
    const moves = Array.isArray(possibleMoves[0]) ? possibleMoves : [possibleMoves];

    moves.forEach(move => {
      const possiblePosition = this.calculatePosition(currentPosition, move);
      //console.log("Possible possition: " + possiblePosition);
      const positionOnBoard = this.checkIfPositionIsOnBoard(possiblePosition);
      //console.log("Position on board: " + positionOnBoard);
      if (positionOnBoard) {
        const pieceInTheWay = this.checkIfPieceIsInTheWay(currentPosition, move);
        //console.log("Piece in the way: " + pieceInTheWay);
        const squareIsEmpty = this.checkIfSquareIsEmpty(possiblePosition);
        //console.log("Square is empty: " + squareIsEmpty);
        const isEnemyPosition = this.isEnemyPosition(possiblePosition);
        //console.log("Is enemy position: " + isEnemyPosition);

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
    });
  };

  isMoveValid(currentPosition, move, possiblePosition, dealingWithPawn) {
    if (!this.checkIfPositionIsOnBoard(possiblePosition)) return false;
    if (this.checkIfPieceIsInTheWay(currentPosition, move)) return false;
    if (dealingWithPawn) {
      return this.checkIfPieceIsInTheWay(possiblePosition);
    } else {
      return this.checkIfSquareIsEmpty(possiblePosition) || this.isEnemyPosition(possiblePosition);
    }

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
      if (typeof PieceFactory.board[row][col] === "object") {
        return pieceInTheWay = true;
      };
    };
  
    return pieceInTheWay;
  };

  checkIfSquareIsEmpty(position) {
    return PieceFactory.board[position[0]][position[1]] === false ? true : false;
  };

  isEnemyPosition(position) {
    const boardPosition = PieceFactory.board[position[0]][position[1]];

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

  movePiece(currentPosition, validPosition) {
    const pieceToBeMoved = PieceFactory._board[currentPosition[0]][currentPosition[1]];
    if (pieceToBeMoved instanceof Pawn && !pieceToBeMoved.hasMoved) {
      pieceToBeMoved.hasMoved = true;
      pieceToBeMoved.getPossibleMoves();
    };

    PieceFactory._board[currentPosition[0]][currentPosition[1]] = false;
    PieceFactory._board[validPosition[0]][validPosition[1]] = pieceToBeMoved;

    this.isKingInCheck(validPosition);
    this.piecePosition = validPosition;
  };

  isKingInCheck(position) {
    console.log(position);
    let kingLocation;

    const piece = PieceFactory._board[position[0]][position[1]];
    if (piece.constructor.name === "Pawn") {
      this.instanceIsPawn = true;
    };
    const possibleMoves = piece.possibleMoves;

    this.getValidMoves(position, possibleMoves);
    this.validMoves.forEach(validMove => {
      const [rowIndex, colIndex] = validMove;
      if (typeof PieceFactory.board[rowIndex][colIndex] === "object") {
        if (PieceFactory.board[rowIndex][colIndex].constructor.name === "King") {
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
    const king = PieceFactory.board[rowIndex][colIndex];
    this.instanceIsPawn = false;
    this.getValidMoves(kingLocation, king.possibleMoves);



    // No pieces can jump in front
  };

  doesMoveExposeKing(currentPosition, move) {
    //simulate the move
    let boardStateClone = cloneDeep(PieceFactory._board);
    const newPosition = this.calculatePosition(currentPosition, move);
    for (let i = 0; i < boardStateClone.length; i++) {
      const row = boardStateClone[i];
      const rowIndex = i;
      for (let i = 0; i < row.length; i++) {
        const col = row[i];
        const colIndex = i
        if (typeof col === "object") {
          console.log(boardStateClone[rowIndex][colIndex]);
          const position = [rowIndex, colIndex];
          const kingChecked = this.isKingInCheck(position);
          console.log(kingChecked);
        };
      };
    };

    //then run isKingInCheck
  };
};

class Pawn extends Piece {
  constructor(color, position) {
    super(color, position);
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
    console.log(this.piecePosition);
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

class Knight extends Piece {
  constructor(color, position) {
    super(color, position);
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

class Bishop extends Piece {
  constructor(color, position) {
    super(color, position);
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
  
class Rook extends Piece {
  constructor(color, position) {
    super(color, position);
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

class Queen extends Piece {
  constructor(color, position) {
    super(color, position);
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

class King extends Piece {
  constructor(color, position) {
    super(color, position)
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
  PieceFactory.addPiece(new Pawn("black", [1, i]), 1, i);
  PieceFactory.addPiece(new Pawn("white", [6, i]), 6, i);
};

PieceFactory.addPiece(new Rook("black", [0, 0]), 0, 0);
PieceFactory.addPiece(new Rook("black", [0, 7]), 0, 7);
PieceFactory.addPiece(new Rook("white", [7, 0]), 7, 0);
PieceFactory.addPiece(new Rook("white", [7, 7]), 7, 7);

PieceFactory.addPiece(new Knight("black", [0, 1]), 0, 1);
PieceFactory.addPiece(new Knight("black", [0, 6]), 0, 6);
PieceFactory.addPiece(new Knight("white", [7, 1]), 7, 1);
PieceFactory.addPiece(new Knight("white", [6, 6]), 7, 6);

PieceFactory.addPiece(new Bishop("black", [0, 2]), 0, 2);
PieceFactory.addPiece(new Bishop("black", [0, 5]), 0, 5);
PieceFactory.addPiece(new Bishop("white", [7, 2]), 7, 2);
PieceFactory.addPiece(new Bishop("white", [7, 5]), 7, 5);

PieceFactory.addPiece(new Queen("black", [0, 3]), 0, 3);
PieceFactory.addPiece(new Queen("white", [7, 3]), 7, 3);

PieceFactory.addPiece(new King("black", [0, 4]), 0, 4);
PieceFactory.addPiece(new King("white", [7, 4]), 7, 4);

console.log(PieceFactory.board);