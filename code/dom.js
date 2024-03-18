import { incrementString, decrementString } from "./general-utils.js";

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