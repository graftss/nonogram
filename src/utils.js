import {
  zipObj,
} from 'ramda';

export const getTime = () => new Date().getTime();

export const keyMirror = keys => zipObj(keys, keys);

export const argCreator = (type, props) => (...args) => ({
  type,
  payload: zipObj(props, args),
});

export const constantCreator = type => () => ({ type });

export const indexToCoords = (size, index) => [
  index % size,
  Math.floor(index / size),
];

export const coordsToIndex = (width, coords) => coords[0] + coords[1] * width;

export const rectCoordRanges = (width, source, target) => {
  const sourceCoords = indexToCoords(width, source);
  const targetCoords = indexToCoords(width, target);

  const xRange = [
    Math.min(sourceCoords[0], targetCoords[0]),
    Math.max(sourceCoords[0], targetCoords[0]),
  ];

  const yRange = [
    Math.min(sourceCoords[1], targetCoords[1]),
    Math.max(sourceCoords[1], targetCoords[1]),
  ];

  return { xRange, yRange };
}

export const indicesInRect = (width, source, target) => {
  const { xRange, yRange } = rectCoordRanges(width, source, target);
  const result = [];

  for (let x = xRange[0]; x <= xRange[1]; x++) {
    for (let y = yRange[0]; y <= yRange[1]; y++) {
      result.push(coordsToIndex(width, [x, y]));
    }
  }

  return result;
};

export const longestEltLength = lists => lists.reduce(
  (acc, next) => Math.max(acc, next.length),
  0,
);

export const pad = (minLength, padValue, padLeft, array) => {
  const padding = [];

  for (let i = 0; i < minLength - array.length; i++) {
    padding.push(padValue);
  }

  return padLeft ? padding.concat(array) : array.concat(padding);
};

const matrixColumn = (matrix, index) => matrix.map(row => row[index]);

export const rotateMatrix = matrix => (
  matrix[0].map((_, index) => matrixColumn(matrix, index))
);
