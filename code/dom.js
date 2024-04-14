import { incrementString, decrementString } from "./general-utils.js";
//import GameState from "./main.js";
import { factory } from "./main.js";
import { removeDuplicateArrays } from "./general-utils.js";
//import Piece from "./pieceLogic.js";

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
    square.setAttribute("data-location", [row, col]);
    return square;
  };

  addBoardToDom() {
    const chessBoard = document.getElementById("chess_board");
    chessBoard.innerHTML = "";
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

  updateDom() {
    console.log(this.boardLogic);
  };
};

class PieceSelector {
  constructor() {
    this.boardLogic = factory._board;
    this.chessBoard = document.getElementById("chess_board");
    this.chessBoard.addEventListener("click", this.handleSquareClick.bind(this));
    this.pieceIsSelected = false;
    this.selectedDomPiece;
    this.validMoves = [];
  };

  handleSquareClick(event) {
    const clickedSquare = event.target.closest(".square");
    if (!clickedSquare) return;

    if (this.pieceIsSelected && clickedSquare === this.selectedDomPiece) {
      this.deselectPiece();
    } else if (clickedSquare.hasAttribute("data-piece")) {
        this.selectPiece(clickedSquare);
    };
  };

  deselectPiece() {
    this.pieceIsSelected = false;
    this.pieceIsSelected = false;
    this.removeColorContainer();
    this.removeSelectedSquareHighlight();
    this.validMoves = [];
  };

  selectPiece(clickedSquare) {
    this.pieceIsSelected = true;
    this.removeColorContainer();
    this.removeSelectedSquareHighlight();
    this.highLightSelectedSquare(clickedSquare);
    this.highlightValidMoves(clickedSquare);
  };

  removeColorContainer() {
    const colorContainers = document.querySelectorAll(".color_container_valid_moves");
    colorContainers.forEach((container) => {
      container.remove();
    });
  };

  removeSelectedSquareHighlight() {
    const selectedDomPiece = document.querySelector(".highlight_selected_piece");
    if (selectedDomPiece !== null) {
      selectedDomPiece.classList.remove("highlight_selected_piece");
    };
  };

  highLightSelectedSquare(square) {
    square.classList.add("highlight_selected_piece");
  };

  highlightValidMoves(clickedSquare) {
    this.selectedDomPiece = clickedSquare;
    const [rowIndex, colIndex] = this.getDatasetLocation(clickedSquare); 
    const piece = this.boardLogic[rowIndex][colIndex];
    const validMoves = this.getValidMovesFromPieceLogic(piece, rowIndex, colIndex);
    this.createColorContainerValidMoves(validMoves);
  };

  getDatasetLocation(square) {
    return square.dataset.location.split(',').map(Number); 
  };

  getValidMovesFromPieceLogic(piece, rowIndex, colIndex) {
    const possibleMoves = piece.possibleMoves;
    const currentPosition = [rowIndex, colIndex];
    piece.getValidMoves(currentPosition, possibleMoves);
    this.validMoves = piece.validMoves;
    this.validMoves = removeDuplicateArrays(this.validMoves);
    return piece.validMoves
  };

  createColorContainerValidMoves(squares) {
    squares.forEach((square) => {
      const htmlLocation = square.join();
      const htmlElement = document.querySelector(`[data-location='${htmlLocation}']`);
      const container = document.createElement("div");
      container.classList.add("color_container_valid_moves");
      htmlElement.appendChild(container);
    });
  };
};

class PieceMovement extends PieceSelector{
  constructor() {
    super();
    this.chessBoard.addEventListener("click", this.movePiece.bind(this));
  };

  movePiece(event) {
    const clickedSquare = event.target.closest(".square");
    if (!clickedSquare) return;

    if (this.pieceIsSelected && clickedSquare !== this.selectedDomPiece) {
      const clickedSquareLocation = this.getDatasetLocation(clickedSquare);
      const squareIsIncludedInValidMoves = this.validMoves.some(a => clickedSquareLocation.every((v, i) => v === a[i]));

      if (squareIsIncludedInValidMoves) {
        const selectedPieceLocation = this.getDatasetLocation(this.selectedDomPiece);
        const [rowIndexSelectedPiece, colIndexSelectedPiece] = selectedPieceLocation;
        const selectedPieceOnBoard = this.boardLogic[rowIndexSelectedPiece][colIndexSelectedPiece];
        selectedPieceOnBoard.movePiece(selectedPieceLocation, clickedSquareLocation);
        console.log(this.boardLogic);
;
        // this.boardLogic[rowIndexSelectedPiece][colIndexSelectedPiece] = false;
        // this.boardLogic[rowIndexClickedSquare][colIndexClickedSquare] = selectedPieceOnBoard;
        //console.log(this.boardLogic);


        //console.log(this.selectedPiece);
        // const piece = JSON.parse(this.selectedPiece.getAttribute("data-piece"));
        // const pieceImg = this.selectedPiece.children[0];
        // this.selectedPiece.removeAttribute("data-piece");
        // this.selectedPiece.innerHTML = "";
        // clickedSquare.setAttribute("data-piece", JSON.stringify(piece));
        // clickedSquare.appendChild(pieceImg);
        // this.deselectPiece();
        // console.log(this.boardLogic);
        //Board logic is not getting updated!
      };
    };
  };

  capturePiece() {

  };

  //special movements?
};

const initiializeDOM = new BoardDOMConnection();
const pieceSelector = new PieceMovement();
