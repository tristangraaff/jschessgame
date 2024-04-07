import { incrementString, decrementString } from "./general-utils.js";
//import GameState from "./main.js";
import { factory } from "./main.js";

export default class DomManipulation {
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

export class PieceSelector {
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

class BoardDOMConnection {
  constructor(){
    this.addBoardToDom();
    this.addPiecesToDom();
  };

  createSquare(row, col) {
    const square = document.createElement("div");
    const isEvenCol = (col + 1) % 2 === 0;
    const isEvenRow = row % 2 === 0;
    const colorClass = isEvenCol === isEvenRow ? "black" : "white";

    square.classList.add("square", `square_index_${col}`, colorClass);
    square.dataset.position = `${String.fromCharCode(65 + col)}${8 - row}`;
    return square;
  };

  addBoardToDom() {
    const chessBoard = document.getElementById("chess_board");
    for (let row = 0; row < factory.board.length; row++) {
      const rowDOM = document.createElement("div");
      rowDOM.classList.add("row", `row_index_${row}`);
      chessBoard.appendChild(rowDOM);

      for (let col = 0; col < factory.board[row].length; col++) {
        const square = this.createSquare(row, col);
        rowDOM.appendChild(square);
      }; 
    };
  };

  addPiecesToDom() {
    const chessBoard = document.getElementById("chess_board");
    const rows = chessBoard.children;

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex];
      const colLength = rows[rowIndex].children.length;
      
      for (let colIndex = 0; colIndex < colLength; colIndex++) {
        const square = row.children[colIndex];
        const piece = factory.board[rowIndex][colIndex];
        
        if (typeof piece === "object") {
          square.setAttribute("data-piece", JSON.stringify(piece));
          const imgElement = document.createElement("img");
          imgElement.src = `../img/${piece.color}${piece.constructor.name}.png`;
          square.appendChild(imgElement);
        };
      };
    };
  };
};

class PieceSelect {
  constructor() {
    this.chessBoard = document.getElementById("chess_board");
    this.chessBoard.addEventListener("click", this.handleSquareClick.bind(this));
    this.pieceIsSelected = false;
  };

  handleSquareClick(event) {
    const clickedSquare = event.target.closest(".square");
    console.log(clickedSquare);
    if (!clickedSquare) return;
    if (clickedSquare.hasAttribute("data-piece") && this.pieceIsSelected === false) {
      //this.pieceIsSelected = true;
      const rowIndexClassName = clickedSquare.parentElement.classList[1];
      const rowIndex = Number(rowIndexClassName.charAt(rowIndexClassName.length -1));
      const colIndexClassName = clickedSquare.classList[1];
      const colIndex = Number(colIndexClassName.charAt(colIndexClassName.length -1));     
      const piece = factory.board[rowIndex][colIndex];
      this.getValidMovesInDom(piece, rowIndex, colIndex);
    };
  };

  getValidMovesInDom(piece, rowIndex, colIndex) {
    const possibleMoves = piece.possibleMoves;
    console.log(possibleMoves);
    const currentPosition = [rowIndex, colIndex];
    console.log(currentPosition);
    piece.getValidMoves(currentPosition, possibleMoves);
  };

};

const initiializeDOM = new BoardDOMConnection();
const pieceSelector = new PieceSelect();