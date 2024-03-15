//const { incrementString, decrementString } = require("../code/general-utils.js");
import { incrementString, decrementString } from "../code/general-utils.js";
//import decrementString from "../code/general-utils.js";

describe('incrementString', () => {
    it('should increment the last character of a string with 1 and return the full string', () => {
        const result = incrementString("box box_2 box_a2", 1);
        expect(result).toBe("box box_2 box_a3");
    });

    it('should increment the last character of a string with 2 and return the full string', () => {
        const result = incrementString("box box_2 box_e2", 2);
        expect(result).toBe("box box_2 box_e4");
    });
});

describe('decrementString', () => {
    it('should decrement the last character of a string with 1 and return a full string', () => {
        const result = decrementString("box box_7 box_h7", 1);
        expect(result).toBe("box box_7 box_h6");
    });

    it('should decrement the last character of a string with 2 and return a full string', () => {
        const result = decrementString("box box_7 box_c7", 2);
        expect(result).toBe("box box_7 box_c5");
    });
});

