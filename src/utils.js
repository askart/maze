export function makeGrid(height, width, val) {
  return Array.from(Array(height), () => new Array(width).fill(val))
}

export const DX = {"E": 1, "W": -1, "N": 0, "S": 0}
export const DY = {"E": 0, "W": 0, "N": -1, "S": 1}
export const VALUE = {"N": 1, "S": 2, "E": 4, "W": 8}
export const OPPOSITE = {"E": "W", "W": "E", "N": "S", "S": "N"}

export function getDirections() {
  return shuffle(["N", "S", "E", "W"])
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array
}
