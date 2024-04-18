import { incrementString, decrementString } from "./general-utils.js";
import GameState from "./main.js";
import { factory } from "./main.js";
import { removeDuplicateArrays } from "./general-utils.js";
//import Piece from "./pieceLogic.js";

class BoardDOMConnection {
  constructor(){
    this.boardLogic = factory._board;
    this.chessBoard = document.getElementById("chess_board");
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
    this.chessBoard.innerHTML = "";
    for (let row = 0; row < factory.board.length; row++) {
      const rowDOM = document.createElement("div");
      rowDOM.classList.add("row", `row_index_${row}`);
      this.chessBoard.appendChild(rowDOM);

      for (let col = 0; col < factory.board[row].length; col++) {
        const square = this.createSquare(row, col);
        rowDOM.appendChild(square);
      }; 
    };
  };

  addPiecesToDom() {
    const rows = this.chessBoard.children;

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex];
      const colLength = rows[rowIndex].children.length;
      
      for (let colIndex = 0; colIndex < colLength; colIndex++) {
        const square = row.children[colIndex];
        square.removeAttribute("data-piece");
        square.innerHTML = "";
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
    this.boardLogic = factory._board;
    this.chessBoard = document.getElementById("chess_board");
    this.chessBoard.addEventListener("click", this.handleSquareClick.bind(this));
    this.pieceIsSelected = false;
    this.selectedDomPiece = null;
    this.validMoves = [];
    this.gameState = GameState;
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
    this.removeColorContainer();
    this.removeSelectedSquareHighlight();
    this.pieceIsSelected = false;
    this.selectedDomPiece = null;
    this.validMoves = [];
  };

  selectPiece(clickedSquare) {
    const pieceData = JSON.parse(clickedSquare.getAttribute("data-piece"));

    if (pieceData.color !== this.gameState.currentPlayer) {
      //this.deselectPiece();
      return;
    };

    this.removeColorContainer(); 
    this.removeSelectedSquareHighlight();
    this.highLightSelectedSquare(clickedSquare);
    this.highlightValidMoves(clickedSquare);

    this.pieceIsSelected = true;
    this.selectedDomPiece = clickedSquare;
  };

  removeColorContainer() {
    const colorContainers = document.querySelectorAll(".color_container_valid_moves");
    colorContainers.forEach((container) => {
      if (!container.hasChildNodes()) {
        container.remove();
      } else {
        console.log(container.children[0]);
        const imgElement = container.children[0];
        container.removeChild(imgElement);
        container.parentNode.appendChild(imgElement);
        container.remove();
      };
    });
  };

  removeSelectedSquareHighlight() {
    if (this.selectedDomPiece !== null) {
      //console.log(this.selectedDomPiece);
      this.selectedDomPiece.classList.remove("highlight_selected_piece");
    };
  };

  highLightSelectedSquare(square) {
    square.classList.add("highlight_selected_piece");
  };

  highlightValidMoves(clickedSquare) {
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
    console.log(piece);
    piece.getValidMoves(currentPosition, possibleMoves);
    this.validMoves = piece.validMoves;
    this.validMoves = removeDuplicateArrays(this.validMoves);
    return piece.validMoves
  };

  createColorContainerValidMoves(squares) {
    squares.forEach((square) => {
      const htmlLocation = square.join();
      const htmlElement = document.querySelector(`[data-location='${htmlLocation}']`);
      console.log(htmlElement);
      const container = document.createElement("div");
      container.classList.add("color_container_valid_moves");
      if (!htmlElement.hasChildNodes()) {
        htmlElement.appendChild(container);
      } else {
        const imgElement = htmlElement.children[0];
        htmlElement.removeChild(imgElement);
        container.appendChild(imgElement);
        htmlElement.appendChild(container);
      };
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
        this.updateBoardState(clickedSquareLocation);
        this.moveDomPiece(clickedSquare);
      };
    };
  };

  updateBoardState(squareLocation) {
    const selectedPieceLocation = this.getDatasetLocation(this.selectedDomPiece);
    const [rowIndexSelectedPiece, colIndexSelectedPiece] = selectedPieceLocation;
    const selectedPieceOnBoard = this.boardLogic[rowIndexSelectedPiece][colIndexSelectedPiece];
    selectedPieceOnBoard.movePiece(selectedPieceLocation, squareLocation);
  };

  moveDomPiece(square) {
    if (square.hasChildNodes) {
      square.removeChild(square.children[0]);
    };
    const piece = JSON.parse(this.selectedDomPiece.getAttribute("data-piece"));
    const pieceImg = this.selectedDomPiece.children[0];
    this.selectedDomPiece.removeAttribute("data-piece");
    this.selectedDomPiece.innerHTML = "";
    square.setAttribute("data-piece", JSON.stringify(piece));
    square.appendChild(pieceImg);
    this.deselectPiece();
    this.gameState.changeTurn();
    this.flipDomBoard();
    this.flipDomPieces();
  };

  flipDomBoard() {
    this.chessBoard.classList.toggle("flip");
  };

  flipDomPieces() {
    Array.from(this.chessBoard.children).forEach(row => {
      Array.from(row.children).forEach(col => {
        if (col.children[0] !== undefined) {
          col.children[0].classList.toggle("flip");
        };
      });
    });
  };

  capturePiece() {

  };

  //special movements?
};

const initiializeDOM = new BoardDOMConnection();
const pieceSelector = new PieceMovement();
