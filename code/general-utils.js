export const incrementString = (str, number) => {
    let lastCharacterToNumber = Number(str.substring(str.length - 1));
    return str.slice(0, -1) + (lastCharacterToNumber + number);
};

export const decrementString = (str, number) => {
    let lastCharacterToNumber = Number(str.substring(str.length - 1));
    return str.slice(0, -1) + (lastCharacterToNumber - number);
};

