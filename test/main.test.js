/**
* @jest-environment jsdom
*/

import PawnGameLogic from "../code/main.js";

describe('PawnGameLogic', () => {
    it("should initialize correctly", () => {
        const pawn = new PawnGameLogic("white", 8);
        expect(pawn).toMatchObject({
            color: "white",
            number: 8,
            hasMoved: false
        });
    });

    it("should get valid moves for pawn piece", () => {
        let pawnBlackHasMoved = new PawnGameLogic("black", 1);
        pawnBlackHasMoved.hasMoved = true;
        expect(pawnBlackHasMoved.getValidMoves()).toEqual([-1]);

        const pawnBlackHasNotMoved = new PawnGameLogic("black", 4);
        expect(pawnBlackHasNotMoved.getValidMoves()).toEqual([-1, -2]);

        let pawnWhiteHasMoved = new PawnGameLogic("white", 5);
        pawnWhiteHasMoved.hasMoved = true;
        expect(pawnWhiteHasMoved.getValidMoves()).toEqual([1]);

        const pawnWhiteHasNotMoved = new PawnGameLogic("white", 6);
        expect(pawnWhiteHasNotMoved.getValidMoves()).toEqual([1, 2]);
    });
});