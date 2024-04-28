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

export function mergeArraysOfArrays() {
  if (arr1.length === 0) return arr2;
  if (arr2.length ===0) return arr1;
  const merged = [...arr1, ...arr2];
  return merged;
};