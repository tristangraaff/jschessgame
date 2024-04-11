import { incrementString, decrementString } from "./general-utils.js";
//import GameState from "./main.js";
import { factory } from "./main.js";

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

class PieceSelector {
  constructor() {
    this.chessBoard = document.getElementById("chess_board");
    this.chessBoard.addEventListener("click", this.handleSquareClick.bind(this));
    this.pieceIsSelected = false;
    this.selectedPiece;
  };

  handleSquareClick(event) {
    const clickedSquare = event.target.closest(".square");
    if (!clickedSquare) return;

    if (clickedSquare.hasAttribute("data-piece") && !this.pieceIsSelected) {
      this.pieceIsSelected = true;
      this.highLightSelectedSquare(clickedSquare);
      this.highlightValidMoves(clickedSquare);
    } 
    
    else if (this.pieceIsSelected) {
      if (clickedSquare === this.selectedPiece) {
        this.pieceIsSelected = false;
        this.removeColorContainer();
        this.removeSelectedSquareHighlight();
      };
      if (clickedSquare !== this.selectedPiece && clickedSquare.hasAttribute("data-piece")) {
        this.pieceIsSelected = true;
        this.removeColorContainer();
        this.removeSelectedSquareHighlight();
        this.highLightSelectedSquare(clickedSquare);
        this.highlightValidMoves(clickedSquare);
      };
    };
  };

  getValidMovesFromPieceLogic(piece, rowIndex, colIndex) {
    const possibleMoves = piece.possibleMoves;
    const currentPosition = [rowIndex, colIndex];
    piece.getValidMoves(currentPosition, possibleMoves);
    return piece.validMoves
  };

  highlightValidMoves(clickedSquare) {
    this.selectedPiece = clickedSquare;
    const rowIndexClassName = clickedSquare.parentElement.classList[1];
    const rowIndex = Number(rowIndexClassName.charAt(rowIndexClassName.length -1));
    const colIndexClassName = clickedSquare.classList[1];
    const colIndex = Number(colIndexClassName.charAt(colIndexClassName.length -1));     
    const piece = factory.board[rowIndex][colIndex];
    const validMoves = this.getValidMovesFromPieceLogic(piece, rowIndex, colIndex);
    this.createColorContainerValidMoves(validMoves);
  };

  createColorContainerValidMoves(squares) {
    squares.forEach((square) => {
      const domRow = document.querySelector(`.row_index_${square[0]}`);
      const domCol = domRow.children[square[1]]; 
      const container = document.createElement("div");
      container.classList.add("color_container_valid_moves");
      domCol.appendChild(container);
    });
  };

  highLightSelectedSquare(square) {
    square.classList.add("highlight_selected_piece");
  };

  removeColorContainer() {
    const colorContainers = document.querySelectorAll(".color_container_valid_moves");
    colorContainers.forEach((container) => {
      container.remove();
    });
  };

  removeSelectedSquareHighlight() {
    const selectedPiece = document.querySelector(".highlight_selected_piece");
    selectedPiece.classList.remove("highlight_selected_piece");
  };
};

class PieceMovement extends PieceSelector{
  constructor() {
    super();
  };

  movePiece() {
    
  };

  capturePiece() {

  };

  //special movements?
};

const initiializeDOM = new BoardDOMConnection();
const pieceSelector = new PieceMovement();
