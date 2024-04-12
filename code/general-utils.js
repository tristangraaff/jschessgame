export default 1 + 1;

export function incrementString (str, number) {
    let lastCharacterToNumber = Number(str.substring(str.length - 1));
    return str.slice(0, -1) + (lastCharacterToNumber + number);
};

export function decrementString (str, number) {
    let lastCharacterToNumber = Number(str.substring(str.length - 1));
    return str.slice(0, -1) + (lastCharacterToNumber - number);
};

export function removeDuplicateArrays(arr) {
    const arraySet = new Set(arr.map(JSON.stringify));
    return Array.from(arraySet).map(JSON.parse);
};