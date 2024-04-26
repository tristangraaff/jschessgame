import { PieceFactory, GameState } from "./main.js";
import cloneDeep from 'https://cdn.skypack.dev/lodash.clonedeep';

// Add rokeren
// Add en passant
// Add pawn reaches end of board
// Add piece location to constructor instead of double for looping every time! DOM has to be improved to achieve this

  //Alle calls naar PieceFactory mogen in .this maar daarvoor moet eerst DOM file worden gefixt

class Piece {
  constructor(color, position) {
    this.color = color;
    this.piecePosition = position;
    this.possibleMoves = [];
    this.validMoves = [];
    this.gameState = GameState;
    //this.boardState = PieceFactory._board;
    this.instanceIsPawn = false;
    this.checkingForCheckMate = false;
  };

  getValidMoves(currentPiecePosition, possibleMoves) {
    this.validMoves = [];
    const moves = Array.isArray(possibleMoves[0]) ? possibleMoves : [possibleMoves];

    moves.forEach(move => {
      const possiblePosition = this.calculatePosition(currentPiecePosition, move);

      if (this.isMoveValid(currentPiecePosition, move, possiblePosition, this.instanceIsPawn)) {
        const possiblePositionArray = [possiblePosition];
        this.validMoves.push(...possiblePositionArray);
      };
    });
  };

  isMoveValid(currentPiecePosition, move, possiblePosition, dealingWithPawn) {
    if (!this.checkIfPositionIsOnBoard(possiblePosition)) return false;
    if (this.checkIfPieceIsInTheWay(currentPiecePosition, move)) return false;
    if (dealingWithPawn) {
      return this.checkIfSquareIsEmpty(possiblePosition);
    } else {
      return this.checkIfSquareIsEmpty(possiblePosition) || this.isEnemyPosition(possiblePosition);
    };
  };

  checkIfPositionIsOnBoard(position) {
    const [row, col] = position;
    if (row < 0 || row > 7 || col < 0 || col > 7) {
      return false;
    } else {
      return true;
    };
  };

  checkIfPieceIsInTheWay(position, move) {
    const [startRow, startCol] = position;
    const [rowMove, colMove] = move;
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

  calculatePosition(currentPiecePosition, move) {
    const newRow = currentPiecePosition[0] + move[0];
    const newCol = currentPiecePosition[1] + move[1];
    const newPosition = [newRow, newCol];
    return newPosition;
  };

  isEnemyPosition(position) {
    const boardPosition = PieceFactory.board[position[0]][position[1]];

    if (typeof boardPosition !== "object") {
      return false;
    };

    return this.checkingForCheckMate
      ? this.gameState.currentPlayer === boardPosition.color
      : this.gameState.currentPlayer !== boardPosition.color;
  };

  movePiece(currentPosition, validPosition) {
    const pieceToBeMoved = PieceFactory._board[currentPosition[0]][currentPosition[1]];
    if (pieceToBeMoved instanceof Pawn && !pieceToBeMoved.hasMoved) {
      pieceToBeMoved.hasMoved = true;
      pieceToBeMoved.getPossibleMoves();
    };

    PieceFactory._board[currentPosition[0]][currentPosition[1]] = false;
    PieceFactory._board[validPosition[0]][validPosition[1]] = pieceToBeMoved;

    console.log(PieceFactory._board);
    // locate enemy King
    // Then call isKingInCheck function from King class?

    King.isKingInCheck(validPosition);
    this.piecePosition = validPosition;
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
  getValidMoves(currentPiecePosition, possibleMoves) {
    this.validMoves = [];

    //I'm going to use this.getPossibleMoves here because it's better for SoC. The other getValidMoves functionality get's it's input from the DOM through a param, that needs to be refactored later on.
    this.possibleCaptureMoves.forEach(captureMove => {
      const possibleCapture = this.calculatePosition(currentPiecePosition, captureMove);
      const isEnemyPosition = this.isEnemyPosition(possibleCapture);

      if (isEnemyPosition) {
        this.validMoves.push(possibleCapture);
      };
    });

    this.instanceIsPawn = true;
    const moves = Array.isArray(possibleMoves[0]) ? possibleMoves : [possibleMoves];

    moves.forEach(move => {
      const possiblePosition = this.calculatePosition(currentPiecePosition, move);

      if (this.isMoveValid(currentPiecePosition, move, possiblePosition, this.instanceIsPawn)) {
        const possiblePositionArray = [possiblePosition];
        this.validMoves.push(...possiblePositionArray);
      };
    });
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

  static isKingInCheck(piecePosition) {
    let kingLocation;
    const piece = PieceFactory._board[piecePosition[0]][piecePosition[1]];
    const possibleMoves = piece.possibleMoves;

    if (piece.constructor.name === "Pawn") {
      this.instanceIsPawn = true;
    };

    piece.getValidMoves(piecePosition, possibleMoves);
    piece.validMoves.forEach(validMove => {
      const [rowIndex, colIndex] = validMove;
      if (typeof PieceFactory.board[rowIndex][colIndex] === "object") {
        if (PieceFactory.board[rowIndex][colIndex].constructor.name === "King") {
          piece.gameState.kingChecked = true;
          console.log("King checked: " + piece.gameState.kingChecked);
          kingLocation = [rowIndex, colIndex];
        };
      };
    });

    if (piece.gameState.kingChecked) {
      King.isCheckmate(kingLocation, piece);
    };
  };

  static isCheckmate(kingLocation, piece) {
    piece.checkingForCheckMate = true; //This is used in the isEnemyPosition method, because the outcome depends on checking for checkmate or regular situation
    //Also check for Stalemate here?
    //Checkmate when:
    // No possible moves for King
    const [rowIndex, colIndex] = kingLocation;
    const king = PieceFactory.board[rowIndex][colIndex];
    piece.instanceIsPawn = false;
    piece.getValidMoves(kingLocation, king.possibleMoves);



    // And no pieces can jump in front




    piece.checkingForCheckMate = false;
  };

  static doesMoveExposeKing(currentPosition, piece, move) {
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