import { PieceFactory, GameState } from "./main.js";
import { mergeArraysOfArrays, removeDuplicateArrays } from "./general-utils.js";
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

    return this.validMoves;
  };

  isMoveValid(currentPiecePosition, move, possiblePosition, dealingWithPawn) {
    //  console.log("On board: " + this.checkIfPositionIsOnBoard(possiblePosition));
    //  console.log("In the way: " + this.checkIfPieceIsInTheWay(currentPiecePosition, move));
    //  console.log("Squarey empty: " + this.checkIfSquareIsEmpty(possiblePosition));
    //  console.log("Enemy position: " + this.isEnemyPosition(possiblePosition));

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

    this.piecePosition = validPosition;
    King.isEnemyKingInCheck();
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
  };

  getValidKingMoves() {

  };

  static isEnemyKingInCheck() {
    //This checks if I'm checking the opponents King, not if I'm exposing myself to a check
    const pawnCaptureMovesArray = King.getPawnCaptureMoves();
    const allValidMovesExceptPawnsArray = King.getAllPiecesValidMovesExceptPawns();
    let allValidMovesArray = mergeArraysOfArrays(pawnCaptureMovesArray, allValidMovesExceptPawnsArray);
    allValidMovesArray = removeDuplicateArrays(allValidMovesArray);
  
    for (let i = 0; i < allValidMovesArray.length; i++) {
      const validMove = allValidMovesArray[i];
      const boardPosition = PieceFactory._board[validMove[0]][validMove[1]];
      if (typeof boardPosition === "object") {
        if (boardPosition.constructor.name === "King" && boardPosition.color !== GameState.currentPlayer) {
          const king = boardPosition;
          console.log("Checked");
          King.isCheckmate(king);
          return true;
        };
      };
    };
    console.log("Not checked");
    return false;
  };

  static getPawnCaptureMoves() {
    let pawnCaptureMovesArray = [];
    PieceFactory._board.forEach(row => {
      row.forEach(col => {
        if (typeof col === "object") {
          const piece = col;
          if (piece.constructor.name === "Pawn" && piece.color === piece.gameState.currentPlayer) {
            piece.possibleCaptureMoves.forEach(possibleCaptureMove => {
              const capturePosition = piece.calculatePosition(piece.piecePosition, possibleCaptureMove);
              if (piece.checkIfPositionIsOnBoard(capturePosition)) {
                pawnCaptureMovesArray.push(capturePosition);
              };
            });
          };
        };
      });
    });
    return pawnCaptureMovesArray;
  };

  static getAllPiecesValidMovesExceptPawns() {
    let allValidMovesArray = [];
    PieceFactory._board.forEach(row => {
      row.forEach(col => {
        if (typeof col === "object") {
          const piece = col;
          if (piece.color === piece.gameState.currentPlayer && piece.constructor.name !== "Pawn") {
            piece.getValidMoves(piece.piecePosition, piece.possibleMoves);
            allValidMovesArray.push(...piece.validMoves)
          };
        };
      });
    });
    return allValidMovesArray;
  };

  static isCheckmate(king) {
    king.checkingForCheckMate = true; //This is used in the isEnemyPosition method, because the outcome depends on checking for checkmate or regular situation
    // //Also check for Stalemate here?
    // //Checkmate when:
    // // No possible moves for King && no pieces can be put in front

    king.instanceIsPawn = false;
    king.getValidMoves(king.piecePosition, king.possibleMoves);
    const pawnCaptureMovesArray = King.getPawnCaptureMoves();
    const allPiecesValidMovesExceptPawnsArray = King.getAllPiecesValidMovesExceptPawns();
    let allPiecesValidMovesArray = mergeArraysOfArrays(pawnCaptureMovesArray, allPiecesValidMovesExceptPawnsArray);
    allPiecesValidMovesArray = removeDuplicateArrays(allPiecesValidMovesArray);
    console.log(allPiecesValidMovesArray);

    let checkMate;

    King.removeSelfCheckingMoves(allPiecesValidMovesArray, king);
    //console.log(king.validMoves);
    //console.log(king.validMoves);



    // for (const kingMove of king.validMoves) {
    //     const found = allValidMovesArray.some(regularMove => JSON.stringify(kingMove) === JSON.stringify(regularMove));
    //     if (found) {
    //         console.log(`Child array ${JSON.stringify(kingMove)} found in the second parent array.`);
    //     };
    // };
  
    // for (const kingMove of king.validMoves) {
    //   if (!allValidMovesArray.some(validMove => validMove.every((val, index) => val === kingMove[index]))) {
    //       checkMate = false;
    //       break;
    //   } else {
    //     checkMate = true;
    //   };
    // };

    king.checkingForCheckMate = false;
    //console.log(checkMate);
    return checkMate;

    //No pieces be put in front
  };

  static removeSelfCheckingMoves(allMovesArray, king) {
    //Need to get all Valid Moves of white
    //Need to get all possible moves of let's say black king
    //If King can capture a piece:
      //Check if piece is covered by friendly piece
      //This means that piece location is found in possible moves of covering piece, and no pieces are in between

    //This has to somehow be run whenever getValidMoves is called because valid moves are reset after each turn  
    for (const kingMove of king.validMoves) {
      allMovesArray.forEach(move => {
        if (JSON.stringify(kingMove) === JSON.stringify(move)) {
          //console.log(`Child array ${JSON.stringify(kingMove)} found in the second parent array.`);
          king.validMoves = king.validMoves.filter(kingMove => {
            return !(JSON.stringify(move) === JSON.stringify(kingMove))
          });
          console.log(kingMove);
          console.log(king.validMoves);
          //Test
        };
      });
    };
  };

  static doesKingCheckItself() {

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

  static canPieceBePutInFrontKing() {

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
PieceFactory.addPiece(new Knight("white", [7, 6]), 7, 6);

PieceFactory.addPiece(new Bishop("black", [0, 2]), 0, 2);
PieceFactory.addPiece(new Bishop("black", [0, 5]), 0, 5);
PieceFactory.addPiece(new Bishop("white", [7, 2]), 7, 2);
PieceFactory.addPiece(new Bishop("white", [7, 5]), 7, 5);

//PieceFactory.addPiece(new Queen("black", [0, 3]), 0, 3);
PieceFactory.addPiece(new Queen("white", [7, 3]), 7, 3);

//PieceFactory.addPiece(new King("black", [0, 4]), 0, 4);
PieceFactory.addPiece(new King("white", [7, 4]), 7, 4);

PieceFactory.addPiece(new King("black", [3, 3]), 3, 3);

console.log(PieceFactory.board);