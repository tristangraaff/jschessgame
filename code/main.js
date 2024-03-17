import { incrementString, decrementString } from "./general-utils.js";

// To run jest with ES6: node --experimental-vm-modules node_modules/jest/bin/jest.js

// Next steps:
// Find out why non imported test code is tested
// Test existing DOM code
// Add turn logic / win condition
// add movement
// add logic per piece:
  //knight
  //bishop
  //rook
  //king
  //queen
// add board to JS
//change PawnGameLogic to JS board



const log = (input) => {
  console.log(input);
};

class Piece {

};

class GameState {
  static turnCount = 1;
  static turnPlayer = "white";
  static activeGame = true;
  static endOfTurn = false;
  static board = Array.from({ length: 8 }, () => Array(8).fill(false));

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

console.log(GameState.turnCount);
console.log(GameState.board);

export default class PawnGameLogic {
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

class KnightLogic {
  constructor(color, number) {
    this.color = color;
    this.number = number;
    this.hasMoved = false;
  };

  getValidMoves() {
    // +cijfer -tweeLetters
    // +cijfer +tweeLetters
    // +tweeCijfers +letter
    // +tweeCijfers -letter
    // -cijfer -tweeLetters
    // -cijfer +tweeLetters
    // -tweeCijfers +letter
    // -tweeCijfers -letter
  };
};

class BishopLogic {

};

class RookLogic {

};

class QueenLogic {

};

class KingLogic {

};

class domManipulation {
  constructor(classInstance) {
    this.pieceLogicAndState = classInstance;
    this.piece = document.querySelector(`.pawn_${this.pieceLogicAndState.color}${this.pieceLogicAndState.number}`);
    this.location = this.piece.parentElement;
  };

  getValidDomBoxes() {
    const classesArray = this.location.classList;
    const specificBoxClass = classesArray[classesArray.length - 1];
    let validDomBoxes = [];

    for (let i = 0; i < this.pieceLogicAndState.getValidMoves().length; i++) {
      const validBoxClass = incrementString(specificBoxClass, this.pieceLogicAndState.getValidMoves()[i]);
      const validDomBox = document.querySelector(`.${validBoxClass}`);
      validDomBoxes.push(validDomBox);
    };

    return validDomBoxes;
  };
};

class PieceFactory {
  constructor() {
    this.activePieces = [];
    this.capturedPieces = [];
  };

  activatePieces() {
    for (let i = 1; i < 9; i++) {
      const pawnWhiteLogic = new PawnGameLogic("white", i);
      const pawnWhiteDom = new domManipulation(pawnWhiteLogic);
      const pawnBlackLogic = new PawnGameLogic("black", i);
      const pawnBlackDom = new domManipulation(pawnBlackLogic);
      this.activePieces.push(pawnWhiteDom);
      this.activePieces.push(pawnBlackDom);
    };
  };
};

const pieces = new PieceFactory();
pieces.activatePieces();

class PieceSelector {
  constructor(pieces) {
    this.pieces = pieces; // Reference to the PieceFactory or activePieces array
    this.clickedBox = null;
    this.board = document.getElementById("board");
    this.board.addEventListener("click", this.handleBoxClick.bind(this));
    console.log("Turn count:", GameState.turnCount);
    console.log("Turn player:", GameState.turnPlayer);
  };

  handleBoxClick(event) {
    const clickedBox = event.target.closest(".box");
    if (!clickedBox) return;
    const pieceClassNames = clickedBox.firstElementChild?.className;
    if (pieceClassNames && this.clickedBox === null) {
      this.clickedBox = clickedBox;
      const correspondingPiece = this.findCorrespondingActivePiece(pieceClassNames);
      console.log("Clicked piece:", correspondingPiece);
      const domBoxes = correspondingPiece.getValidDomBoxes();
      this.createColorContainer(domBoxes);
    } else if (this.clickedBox === clickedBox) {
        this.clickedBox = null;
        this.removeColorContainer();
    } else if (this.clickedBox !== clickedBox && this.clickedBox !== null) {
        this.clickedBox = clickedBox;
        this.removeColorContainer();
        const correspondingPiece = this.findCorrespondingActivePiece(pieceClassNames);
        console.log("Clicked piece:", correspondingPiece);
        const domBoxes = correspondingPiece.getValidDomBoxes();
        this.createColorContainer(domBoxes);
    };
  };

  findCorrespondingActivePiece(pieceClassNames) {
    return this.pieces.activePieces.find(
      (domPiece) => domPiece.piece.className === pieceClassNames
    );
  };

  createColorContainer(domBoxes) {
    domBoxes.forEach((box) => {
      const container = document.createElement("div");
      container.classList.add("colorContainer");
      box.appendChild(container);
    });

    const colorContainers = document.querySelectorAll(".colorContainer");
    colorContainers.forEach((container) => {
      container.style.backgroundColor = "rgba(0, 0, 255, 0.5)";
      container.style.opacity = "0.7";
      container.style.width = "60px";
      container.style.height = "60px";
    });
  };

  removeColorContainer() {
    const colorContainers = document.querySelectorAll(".colorContainer");
    colorContainers.forEach((container) => {
      container.remove();
    });
  };
};

const pieceSelector = new PieceSelector(pieces);
