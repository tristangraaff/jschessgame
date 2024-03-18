export default class Piece {

};

export class PawnGameLogic {
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


  export class BishopLogic {

  };
  
  export class RookLogic {
  
  };
  
  export class QueenLogic {
  
  };
  
  export class KingLogic {
  
  };

  export class KnightLogic {
    constructor(color, number) {
      this.color = color;
      this.number = number;
      this.hasMoved = false;
      this.validMoves = [[-1, -2], [-1, 2], [-2, -1], [-2, 1], [1, -2], [1, 2], [2, -1], [2, 1]]; 
    };
  };
  
  const knight = new KnightLogic();
  knight.getValidMoves();